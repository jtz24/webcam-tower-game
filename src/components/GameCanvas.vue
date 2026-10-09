<template>
    <div class="game-canvas">
        <canvas ref="canvas"></canvas>
        <!-- 游戏内容 -->
        <template v-if="gameState == 'playing'">
            <GameObject 
                :gameObjects="gameObjects"
                :assets="gameAssets"
            />
            <div class="score-display">
                <div class="score"> {{ t('score') }}: {{ score }}</div>
                <div class="time" :class="{ 'time-warning': gameTime <= 30 }">
                    {{ t('countTime') }}: {{ gameTime }}s
                </div>
            </div>
        </template>
        <!-- 游戏结束画面 -->
        <div class="game-over" v-if="gameState == 'gameover'">
            <div class="game-over-content">
                <h1>Game Over</h1>
                <div class="stats">
                    <p>{{ t('timePlayed') }}: {{ DC.GAME_DURATION - gameTime }}</p>
                    <p>{{ t('finalScore') }}: {{ score }}</p>
                </div>
                <div class="buttons">
                    <button @click="$emit('restart-game')">{{ t('retry')}}</button>
                    <button @click="backToMenu">{{ t('back')}}</button>
                </div>
            </div>
        </div>
        <!-- 添加分数动画 -->
        <div class="score-animations">
            <transition-group name="score-popup">
                <div 
                    v-for="animation in scoreAnimations" 
                    :key="animation.id"
                    class="score-popup"
                    :style="{ 
                        left: `${animation.x}px`, 
                        top: `${animation.y}px`,
                        color: animation.value > 0 ? '#4CAF50' : '#FF0000'
                    }"
                >
                    {{ animation.value > 0 ? '+' : '' }}{{ animation.value }}
                </div>
            </transition-group>
        </div>
    </div>
</template>
<script setup>
import { t } from '../Language/language.js'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import GameObject from './GameObject.vue'
import { GAME_CONFIG as GC, DIFFICULTY_SETTINGS } from '../utils/constants'
import { LEVELS, TILES, ENTITIES, THEMES } from '../utils/levels'
const emit = defineEmits(['restart-game', 'back-to-menu'])
const canvas = ref(null)

const gameAssets = ref(null)
const gameObjects = ref({})

const score = ref(0)
const playerInfo = ref({})
const floors = ref([])
const input = ref({})
const theme = ref('')

const gameState = ref("menu") //menu,countdown,calibrating,playing,gameover
let gameLoop = null
const gameStartTime = ref(0)
const gameTime = ref(0)
let gameTimer = null

let lastUpdateTime = null

const difficulty = ref('medium')
const mode = ref('double')
let DC = DIFFICULTY_SETTINGS.MEDIUM //DIFFICULTY_CONFIG

const scoreAnimations = ref([])
let animationId = 0
let backgroundMusic = null

const setGameAssets = (assets, gameConfig) => {
    gameAssets.value = assets
    difficulty.value = gameConfig.difficulty
    mode.value = gameConfig.mode
    DC = DIFFICULTY_SETTINGS[difficulty.value.toUpperCase()]
}
const playSound = (key, lang=false) => {
    if (lang){
        gameAssets.value.sounds[key+t('key')].play()
    }else{
        gameAssets.value.sounds[key].play()
    }
}
const resetGame = () => {
    gameState.value = "menu"
    score.value = 0
    gameObjects.value = {
        tiles:[],
        player:{x:880, y:460, width:80, height:80, image:`PLAYER`, frames:1, xV:0, yV:0, xBlocked:false, yBlocked:false},
        entities:[],
        cursor:{x:0, y:0, width:50, height:50, image:`CURSOR`, frames:1},
        bars:[]
    }
    floors.value = []
    theme.value = `FOREST`
    playerInfo.value = {
        floor:0,
        stunTime:0,
        invTime:0,
        hp:DC.MAX_HP
    }
    gameTime.value = DC.GAME_DURATION
    if (gameLoop) {
        cancelAnimationFrame(gameLoop)
    }
    if (gameTimer) {
        clearInterval(gameTimer)
    }
    if (backgroundMusic) {
        backgroundMusic.pause()
        backgroundMusic.currentTime = 0
    }
}
const initGame = () => {
    if (canvas.value && gameAssets.value) {
        const ctx = canvas.value.getContext('2d')
        ctx.drawImage(
            gameAssets.value.images.BACKGROUND,
            0,
            0,
            canvas.value.width,
            canvas.value.height
        )
    }
    gameState.value = "playing"
    gameStartTime.value = Date.now()
    
    gameTime.value = DC.GAME_DURATION
    gameTimer = setInterval(() => {
        if (gameTime.value > 0) {
            gameTime.value--
            if (gameTime.value <= 0) {
                gameOver()
            }
        }
    }, 1000)

    generateFloors()

    if (gameAssets.value?.sounds?.BACKGROUND_MUSIC) {
        backgroundMusic = gameAssets.value.sounds.BACKGROUND_MUSIC
        backgroundMusic.loop = true
        backgroundMusic.volume = 0.5
        backgroundMusic.play()
    }
    startGameLoop()
}
const generateFloors = () => {
    if (randint(1,DC.THEME_CHANCE)==1){
        theme.value = THEMES[randint(0,THEMES.length-1)]
    }
    let lastExitTop = true
    let lastExitRight = true
    //Ground Floor
    if (floors.value.length==0){
        floors.value = []
        floors.value.push({
            layout:LEVELS.ground[0].layout,
            tiles:[],
            active_tiles:[]//unused for now
        })
    }else if (floors.value[DC.FLOORS_BETWEEN_REST].layout[47]=='G'){
        floors.value = []
        floors.value.push({
            layout:LEVELS.ground[2].layout,
            tiles:[],
            active_tiles:[]
        })
        lastExitTop = false
        lastExitRight = false
    }else{
        floors.value = []
        floors.value.push({
            layout:LEVELS.ground[1].layout,
            tiles:[],
            active_tiles:[]
        })
    }
    //Main Floors
    for (let i = 0; i < DC.FLOORS_BETWEEN_REST; i++){
        let level = randint(0, LEVELS.main.length, true)
        floors.value.push({
            layout:LEVELS.main[level].layout,
            tiles:[],
            active_tiles:[]
        })
        if (lastExitTop){
            let flipped = ""
            for (let j = 8; j >= 0; j--){
                flipped += floors.value[i+1].layout.slice(j*17, j*17+17)
            }
            floors.value[i+1].layout = flipped
        }
        if (lastExitRight){
            let flipped = ""
            for (let j = 0; j < 9; j++){
                flipped += floors.value[i+1].layout.slice(j*17, j*17+16).split("").reverse().join("")+'\n'
            }
            floors.value[i+1].layout = flipped
        }
        lastExitTop = (LEVELS.main[level].exitTop != lastExitTop)
        lastExitRight = (LEVELS.main[level].exitRight != lastExitRight)
    }
    //Generate
    for (let i = 0; i < DC.FLOORS_BETWEEN_REST + 1; i++){
        console.log(`FLOOR ${i} LAYOUT:`)
        for (let j = 0; j < 9; j++){
            console.log(floors.value[i].layout.slice(j*17,j*17+16))
            for (let k = 0; k < 16; k++){
                floors.value[i].tiles.push({
                    x: k * 120,
                    y: j * 120,
                    width: 120,
                    height:120,
                    image: TILES[floors.value[i].layout[j*17+k]].image+'_'+theme.value,
                    frames:1,
                    attributes: structuredClone(TILES[floors.value[i].layout[j*17+k]].attributes)
                })
                if (TILES[floors.value[i].layout[j*17+k]].active){
                    floors.value[i].active_tiles.push(j*17+k)
                }
            }
            floors.value[i].tiles.push({
                x: 0,
                y: 0,
                width: 0,
                height:0,
                image: `BLANK`,
                frames:1
            })
        }
    }
    gameObjects.value.tiles = floors.value[0].tiles
    playerInfo.value.floor = 0
    gameObjects.value.entities = []
}
const startGameLoop = () => {
    lastUpdateTime = Date.now()
    const loop = () => {
        try {
            if (gameState.value != "playing") return
            updateGame()
            gameLoop = requestAnimationFrame(loop)
            lastUpdateTime = Date.now()
        } catch (error) {
            console.error('Error in game loop:', error)
            // 如果发生错误，尝试重新启动游戏循环
            gameLoop = requestAnimationFrame(loop)
            lastUpdateTime = Date.now()
        }
    }
    gameLoop = requestAnimationFrame(loop)
}
const updateGame = () => {
    const currentTime = Date.now()
    const timeDelta = currentTime - lastUpdateTime

    //Update Player
    if (mode.value == 'lefthand'){
        gameObjects.value.cursor.x = input.value.handLX
        gameObjects.value.cursor.y = input.value.handLY
    }else{
        gameObjects.value.cursor.x = input.value.handRX
        gameObjects.value.cursor.y = input.value.handRY
    }
    const playerX = gameObjects.value.player.x
    const cursorX = gameObjects.value.cursor.x + gameObjects.value.cursor.width/2 - gameObjects.value.player.width/2
    const playerY = gameObjects.value.player.y
    const cursorY = gameObjects.value.cursor.y + gameObjects.value.cursor.height/2 - gameObjects.value.player.height/2
    if (playerInfo.value.invTime > 0){
        playerInfo.value.invTime -= timeDelta
        if (playerInfo.value.invTime < 0){
            gameObjects.value.player.image = `PLAYER`
            gameObjects.value.player.frames = 1
        }
    }
    if (playerInfo.value.stunTime > 0){
        playerInfo.value.stunTime -= timeDelta
    }else if (distSquared(playerX, playerY, cursorX, cursorY) < (DC.PLAYER_SPEED * timeDelta)**2){
        gameObjects.value.player.x = cursorX
        gameObjects.value.player.y = cursorY
    }else{
        if (playerX == cursorX){
            if (playerY < cursorY){
                gameObjects.value.player.y += DC.PLAYER_SPEED * timeDelta
            }else{
                gameObjects.value.player.y -= DC.PLAYER_SPEED * timeDelta
            }
        }else{
            const angle = Math.atan((cursorY - playerY)/(cursorX - playerX))
            const neg = cursorX < playerX ? -1 : 1
            gameObjects.value.player.x += DC.PLAYER_SPEED * timeDelta * Math.cos(angle) * neg
            gameObjects.value.player.y += DC.PLAYER_SPEED * timeDelta * Math.sin(angle) * neg
        }
    }
    gameObjects.value.player.x += gameObjects.value.player.xV * timeDelta
    gameObjects.value.player.y += gameObjects.value.player.yV * timeDelta
    gameObjects.value.player.xV *= 0.5
    gameObjects.value.player.yV *= 0.5
    if (Math.abs(gameObjects.value.player.xV) < 0.05){gameObjects.value.player.xV=0}
    if (Math.abs(gameObjects.value.player.yV) < 0.05){gameObjects.value.player.yV=0}

    //Update Tiles
    const touchedTiles = getTouchedTiles(gameObjects.value.player)
    gameObjects.value.player.xBlocked = false
    gameObjects.value.player.yBlocked = false
    let multiCollision = false
    touchedTiles.forEach(tile => {
        const tileType = floors.value[playerInfo.value.floor].layout[tile]
        if (!tileType){return}
        if (TILES[tileType].behaviour == 'wall'){
            const xCollision = !checkCollision({x:playerX, y:gameObjects.value.player.y, width:gameObjects.value.player.width, height:gameObjects.value.player.height}, gameObjects.value.tiles[tile])
            const yCollision = !checkCollision({x:gameObjects.value.player.x, y:playerY, width:gameObjects.value.player.width, height:gameObjects.value.player.height}, gameObjects.value.tiles[tile])
            if (xCollision && yCollision){
                multiCollision = true
            }else if (xCollision){
                gameObjects.value.player.xBlocked = true
            }else if (yCollision){
                gameObjects.value.player.yBlocked = true
            }
        }
    })
    if (multiCollision && !gameObjects.value.player.xBlocked && !gameObjects.value.player.yBlocked){
        gameObjects.value.player.x = playerX
        gameObjects.value.player.xV = 0
    }
    if (gameObjects.value.player.xBlocked){
        gameObjects.value.player.x = playerX
    }
    if (gameObjects.value.player.yBlocked){
        gameObjects.value.player.y = playerY
    }
    multiCollision = false
    touchedTiles.forEach(tile => {
        const tileType = floors.value[playerInfo.value.floor].layout[tile]
        if (!tileType || multiCollision){return}
        if (TILES[tileType].behaviour == 'danger'){
            if (!checkCollision({x:playerX, y:gameObjects.value.player.y, width:gameObjects.value.player.width, height:gameObjects.value.player.height}, gameObjects.value.tiles[tile])){
                if (playerX > (gameObjects.value.tiles[tile].x+gameObjects.value.tiles[tile].width)){
                    gameObjects.value.player.xV = TILES[tileType].attributes.kb
                }else{
                    gameObjects.value.player.xV = -TILES[tileType].attributes.kb
                }
            }else{
                if (playerY > (gameObjects.value.tiles[tile].y+gameObjects.value.tiles[tile].height)){
                    gameObjects.value.player.yV = TILES[tileType].attributes.kb
                }else{
                    gameObjects.value.player.yV = -TILES[tileType].attributes.kb
                }
            }
            if (playerInfo.value.invTime<=0){
                playerInfo.value.hp -= TILES[tileType].attributes.damage
                if (playerInfo.value.hp<=0){
                    gameOver()
                }
                playerInfo.value.stunTime = TILES[tileType].attributes.stunTime
                playerInfo.value.invTime = TILES[tileType].attributes.invTime
                gameObjects.value.player.image = `PLAYER_HURT`
                gameObjects.value.player.frames = 1
                playSound(TILES[tileType].attributes.sound)
            }
            multiCollision = true
        }
    })
    touchedTiles.forEach(tile => {
        const tileType = floors.value[playerInfo.value.floor].layout[tile]
        if (!tileType){return}
        if (TILES[tileType].behaviour == 'gate'){
            if (playerInfo.value.floor == DC.FLOORS_BETWEEN_REST){
                generateFloors()
            }else{
                gameObjects.value.tiles = floors.value[playerInfo.value.floor+1].tiles
                playerInfo.value.floor = playerInfo.value.floor+1
                gameObjects.value.entities = []
            }
            gameObjects.value.player.x = playerX
            gameObjects.value.player.y = playerY
            score.value += 10
            gameAssets.value.sounds.GOOD.play()
        }
    })
    //Update Active Tiles
    floors.value[playerInfo.value.floor].active_tiles.forEach(tile => {
        const tileType = floors.value[playerInfo.value.floor].layout[tile]
        if (TILES[tileType].behaviour == 'spawner'){
            if (Date.now() - gameObjects.value.tiles[tile].attributes.lastSpawnTime > TILES[tileType].attributes.cd){
                let spawn = structuredClone(ENTITIES[TILES[tileType].attributes.entity])
                spawn.x = gameObjects.value.tiles[tile].x + 60 - spawn.width/2
                spawn.y = gameObjects.value.tiles[tile].y + 60 - spawn.height/2
                spawn.image = spawn.image+'_'+theme.value
                spawn.attributes = spawn['attributes_'+difficulty.value]
                gameObjects.value.entities.push(spawn)
                gameObjects.value.tiles[tile].attributes.lastSpawnTime = Date.now()
            }
        }
    })

    //Update Entities
    gameObjects.value.entities = gameObjects.value.entities.filter(entity => {
        entity.x += entity.xV * timeDelta
        entity.y += entity.yV * timeDelta
        if (checkCollision(gameObjects.value.player, entity) && playerInfo.value.invTime<=0){
            if (entity.attributes.kb > 0){
                if (!checkCollision({x:playerX, y:gameObjects.value.player.y, width:gameObjects.value.player.width, height:gameObjects.value.player.height}, entity)){
                    if (playerX > (entity.x+entity.width)){
                        gameObjects.value.player.xV = entity.attributes.kb
                    }else{
                        gameObjects.value.player.xV = -entity.attributes.kb
                    }
                }else if (!checkCollision({x:gameObjects.value.player.x, y:playerY, width:gameObjects.value.player.width, height:gameObjects.value.player.height}, entity)){
                    if (playerY > (entity.y+entity.height)){
                        gameObjects.value.player.yV = entity.attributes.kb
                    }else{
                        gameObjects.value.player.yV = -entity.attributes.kb
                    }
                }else{
                    gameObjects.value.player.xV = entity.attributes.kb / Math.sqrt(entity.xV**2 + entity.yV**2) * entity.xV
                    gameObjects.value.player.yV = entity.attributes.kb / Math.sqrt(entity.xV**2 + entity.yV**2) * entity.yV
                }
            }
            if (entity.attributes.damage > 0){
                if (playerInfo.value.invTime<=0){
                    playerInfo.value.hp -= entity.attributes.damage
                    if (playerInfo.value.hp<=0){
                        gameOver()
                    }
                    playerInfo.value.stunTime = entity.attributes.stunTime
                    playerInfo.value.invTime = entity.attributes.invTime
                    gameObjects.value.player.image = `PLAYER_HURT`
                    gameObjects.value.player.frames = 1
                    playSound(entity.attributes.sound)
                }
            }
        }
        if (entity.behaviour == 'walkerH'){
            if (entity.xV == 0){
                entity.xV = entity.attributes.speed
            }
            let entityTouchedTiles = getTouchedTiles(entity)
            let hitWall = false
            entityTouchedTiles.forEach(tile => {
                if (TILES[floors.value[playerInfo.value.floor].layout[tile]].behaviour == 'wall'){
                    hitWall = true
                }
            })
            if (hitWall){
                const overflowGap = entity.xV > 0 ? (entity.x+entity.width)%120 : (entity.x%120)-120
                entity.x -= 2 * overflowGap
                entity.xV *= -1
            }
        }else if (entity.behaviour == 'walkerV'){
            if (entity.yV == 0){
                entity.yV = entity.attributes.speed
            }
            let entityTouchedTiles = getTouchedTiles(entity)
            let hitWall = false
            entityTouchedTiles.forEach(tile => {
                if (TILES[floors.value[playerInfo.value.floor].layout[tile]].behaviour == 'wall'){
                    hitWall = true
                }
            })
            if (hitWall){
                const overflowGap = entity.yV > 0 ? (entity.y+entity.height)%120 : (entity.y%120)-120
                entity.y -= 2 * overflowGap
                entity.yV *= -1
            }
        }else if (entity.behaviour == 'projectile'){
            if (entity.xV == 0){
                const gapX = rectX(gameObjects.value.player)-rectX(entity)
                const gapY = rectY(gameObjects.value.player)-rectY(entity)
                entity.xV = entity.attributes.speed / Math.sqrt(gapX**2 + gapY**2) * gapX
                entity.yV = entity.attributes.speed / Math.sqrt(gapX**2 + gapY**2) * gapY
            }
            if (entity.x < -entity.width || entity.x > GC.SCREEN_WIDTH || entity.y < -entity.height || entity.y > GC.SCREEN_HEIGHT){
                return false
            }
        }
        return true
    })

    //Display
    gameObjects.value.bars=[
        {
            x: rectX(gameObjects.value.player)-50,
            y: gameObjects.value.player.y-40,
            width: 100,
            height: 20,
            image: `BLACK`,
            frames: 1
        },{
            x: rectX(gameObjects.value.player) - 48,
            y: gameObjects.value.player.y - 38,
            width: 96 * playerInfo.value.hp / DC.MAX_HP,
            height: 16,
            image: `GREEN`,
            frames: 1
        }
    ]

    lastUpdateTime = currentTime
}

//Mathsy Functions
const randint = (a, b, excl = false) => {
    return Math.floor(a + (b - a + (excl?0:1)) * Math.random())
}
const generateRandomPermutation = (n) => {
    let permutation = Array.from({ length: n }, (_, i) => i + 1)
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = permutation[j]
        permutation[j] = permutation[i]
        permutation[i] = temp
    }
    return permutation
}
const checkCollision = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
}
const getTouchedTiles = (rect) => {
    let touchedTiles = [Math.floor(rect.x/120) + 17*Math.floor(rect.y/120)]
    if (rect.x%120 + rect.width > 120){
        touchedTiles.push(Math.floor(rect.x/120)+1 + 17*Math.floor(rect.y/120))
        if (rect.y%120 + rect.height > 120){
            touchedTiles.push(Math.floor(rect.x/120)+1 + 17*(Math.floor(rect.y/120)+1))
        }
    }
    if (rect.y%120 + rect.height > 120){
        touchedTiles.push(Math.floor(rect.x/120) + 17*(Math.floor(rect.y/120)+1))
    }
    return touchedTiles
}
const distSquared = (x1,y1,x2,y2) => {
    return (x1 - x2)**2 + (y1 - y2)**2
}
const rectX = (rect) => {
    return rect.x + rect.width/2
}
const rectY = (rect) => {
    return rect.y + rect.height/2
}
// 游戏结束
const gameOver = () => {
    gameState.value = "gameover"
    // 停止游戏循环和计时器
    if (gameLoop) {
        cancelAnimationFrame(gameLoop)
    }
    if (gameTimer) {
        clearInterval(gameTimer)
    }
}
// 返回菜单
const backToMenu = () => {
    // 重置所有游戏状态
    resetGame()
    // 重置难度
    difficulty.value = 'medium'
    // 发送返回菜单事件
    emit('back-to-menu')
}
// 组件卸载时清理
onUnmounted(() => {
    if (gameTimer) {
        clearInterval(gameTimer)
    }
    // 停止并清理背景音乐
    if (backgroundMusic) {
        backgroundMusic.pause()
        backgroundMusic = null
    }
})
// 更新角色位置（由姿势检测触发）
const setInput = (newInput) => {
    input.value=newInput
}
// 添加 onMounted 钩子来设画布尺寸
onMounted(() => {
    if (canvas.value) {
        if (window.innerWidth/window.innerHeight > GC.SCREEN_WIDTH/GC.SCREEN_HEIGHT){
            canvas.value.height = window.innerHeight
            canvas.value.width = GC.SCREEN_WIDTH * window.innerHeight / GC.SCREEN_HEIGHT
        }else{
            canvas.value.width = window.innerWidth
            canvas.value.height = GC.SCREEN_HEIGHT * window.innerWidth / GC.SCREEN_WIDTH
        }
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            if (window.innerWidth/window.innerHeight > GC.SCREEN_WIDTH/GC.SCREEN_HEIGHT){
                canvas.value.height = window.innerHeight
                canvas.value.width = GC.SCREEN_WIDTH * window.innerHeight / GC.SCREEN_HEIGHT
            }else{
                canvas.value.width = window.innerWidth
                canvas.value.height = GC.SCREEN_HEIGHT * window.innerWidth / GC.SCREEN_WIDTH
            }
            // 重新绘制背景
            if (gameAssets.value) {
                const ctx = canvas.value.getContext('2d')
                ctx.drawImage(
                    gameAssets.value.images.BACKGROUND,
                    0,
                    0,
                    canvas.value.width,
                    canvas.value.height
                )
            }
        })
    }
})
// 添加显示分数动画函数
const showScoreAnimation = (x, y, value) => {
    const animation = {
        id: animationId++,
        x,
        y,
        value
    }
    scoreAnimations.value.push(animation)
    setTimeout(() => {
        scoreAnimations.value = scoreAnimations.value.filter(a => a.id !== animation.id)
    }, 1000)
}
defineExpose({
    canvas,
    setGameAssets,
    setInput,
    backToMenu,
    resetGame,
    initGame
})
</script>
<style scoped>
.game-canvas {
    margin: auto;
    z-index: 0;
    overflow: hidden;
}
canvas {
    margin: auto;
    overflow: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: none;
}
.score-display {
    position: fixed;
    top: 20px;
    left: 20px;
    font-size: 48px;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
    padding: 20px;
    border-radius: 10px;
    backdrop-filter: blur(5px);
}
.life {
    margin-bottom: 20px;
    color: #FF6B6B;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
}
.score {
    color: #4CAF50;
    margin-bottom: 20px;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}
.collision-indicator {
    position: absolute;
    color: red;
    font-size: 32px;
    font-weight: bold;
    animation: fadeUp 1s ease-out;
    opacity: 0;
}
@keyframes fadeUp {
    0% {
        transform: translateY(0);
        opacity: 1;
    }
    100% {
        transform: translateY(-30px);
        opacity: 0;
    }
}
.game-over {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}
.game-over-content {
    background: rgba(143, 212, 245, 0.9);
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    border: 2px solid rgba(255, 255, 255, 0.1);
}
.game-over h1 {
    color: #FF0000;
    font-size: 64px;
    font-weight: bold;
    margin-bottom: 30px;
    text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
}
.stats {
    margin-bottom: 30px;
}
.stats p {
    color: white;
    font-size: 48px;
    font-weight: bold;
    margin: 10px 0;
}
.buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
}
.buttons button {
    padding: 15px 30px;
    font-size: 36px;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}
.buttons button:first-child {
    background: #4CAF50;
    color: white;
}
.buttons button:last-child {
    background: #2196F3;
    color: white;
}
.buttons button:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
}
.time {
    color: #FFD700;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}
.time-warning {
    color: #FF0000 !important;
    animation: blink 1s infinite;
}
@keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}
.progress-bar {
    height: 100%;
    background: #4CAF50;
    transition: width 0.1s linear;
}
.score-popup {
    position: fixed;
    left: 50% !important;    /* 强制居中 */
    top: 50% !important;     /* 强制居中 */
    transform: translate(-50%, -50%);
    font-size: 48px;    /* 增大字体 */
    font-weight: bold;
    pointer-events: none;
    animation: float-up 1s ease-out;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    z-index: 1000;
}
.score-popup.positive {
    color: #4CAF50;
}
.score-popup.negative {
    color: #FF0000;
}
@keyframes float-up {
    0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
    100% {
        transform: translate(-50%, -100%) scale(1.5);
        opacity: 0;
    }
}
.score-popup-enter-active,
.score-popup-leave-active {
    transition: all 1s ease-out;
}
.score-popup-enter-from,
.score-popup-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
