// 资源路径
export const ASSETS = {
    IMAGES: {
        BLACK: new URL('../assets/images/black.png', import.meta.url).href,
        GREEN: new URL('../assets/images/green.png', import.meta.url).href,
        RED: new URL('../assets/images/red.png', import.meta.url).href,
        YELLOW: new URL('../assets/images/yellow.png', import.meta.url).href,
        PLAYER: new URL('../assets/images/player.png', import.meta.url).href,
        PLAYER_HURT: new URL('../assets/images/player_hurt.png', import.meta.url).href,
        CURSOR: new URL('../assets/images/cursor.png', import.meta.url).href,
        BACKGROUND: new URL('../assets/images/bg.png', import.meta.url).href,
        BLANK: new URL('../assets/images/blank.png', import.meta.url).href,
        WALKER_DUNGEON_FRAME_1: new URL('../assets/images/walker_dungeon_FRAME_1.png', import.meta.url).href,
        WALKER_DUNGEON_FRAME_0: new URL('../assets/images/walker_dungeon_FRAME_2.png', import.meta.url).href,
        PROJ_DUNGEON: new URL('../assets/images/projectile_dungeon.png', import.meta.url).href,
        WALL_DUNGEON: new URL('../assets/images/wall_dungeon.png', import.meta.url).href,
        DANGER_DUNGEON: new URL('../assets/images/danger_dungeon.png', import.meta.url).href,
        TILE_DUNGEON: new URL('../assets/images/tile_dungeon.png', import.meta.url).href,
        GATE_DUNGEON: new URL('../assets/images/gate_dungeon.png', import.meta.url).href,
        SPAWNER_DUNGEON: new URL('../assets/images/spawner_dungeon.png', import.meta.url).href,
        WALKER_LAIR_FRAME_1: new URL('../assets/images/walker_lair_FRAME_1.png', import.meta.url).href,
        WALKER_LAIR_FRAME_0: new URL('../assets/images/walker_lair_FRAME_2.png', import.meta.url).href,
        PROJ_LAIR: new URL('../assets/images/projectile_lair.png', import.meta.url).href,
        WALL_LAIR: new URL('../assets/images/wall_lair.png', import.meta.url).href,
        DANGER_LAIR: new URL('../assets/images/danger_lair.png', import.meta.url).href,
        TILE_LAIR: new URL('../assets/images/tile_lair.png', import.meta.url).href,
        GATE_LAIR: new URL('../assets/images/gate_lair.png', import.meta.url).href,
        SPAWNER_LAIR: new URL('../assets/images/spawner_lair.png', import.meta.url).href,
        WALKER_FOREST_FRAME_1: new URL('../assets/images/walker_forest_FRAME_1.png', import.meta.url).href,
        WALKER_FOREST_FRAME_0: new URL('../assets/images/walker_forest_FRAME_2.png', import.meta.url).href,
        PROJ_FOREST: new URL('../assets/images/projectile_forest.png', import.meta.url).href,
        WALL_FOREST: new URL('../assets/images/wall_forest.png', import.meta.url).href,
        DANGER_FOREST: new URL('../assets/images/danger_forest.png', import.meta.url).href,
        TILE_FOREST: new URL('../assets/images/tile_forest.png', import.meta.url).href,
        GATE_FOREST: new URL('../assets/images/gate_forest.png', import.meta.url).href,
        SPAWNER_FOREST: new URL('../assets/images/spawner_forest.png', import.meta.url).href,
        WALKER_GROTTO_FRAME_1: new URL('../assets/images/walker_grotto_FRAME_1.png', import.meta.url).href,
        WALKER_GROTTO_FRAME_0: new URL('../assets/images/walker_grotto_FRAME_2.png', import.meta.url).href,
        PROJ_GROTTO: new URL('../assets/images/projectile_grotto.png', import.meta.url).href,
        WALL_GROTTO: new URL('../assets/images/wall_grotto.png', import.meta.url).href,
        DANGER_GROTTO: new URL('../assets/images/danger_grotto.png', import.meta.url).href,
        TILE_GROTTO: new URL('../assets/images/tile_grotto.png', import.meta.url).href,
        GATE_GROTTO: new URL('../assets/images/gate_grotto.png', import.meta.url).href,
        SPAWNER_GROTTO: new URL('../assets/images/spawner_grotto.png', import.meta.url).href,
        WALKER_OASIS_FRAME_1: new URL('../assets/images/walker_oasis_FRAME_1.png', import.meta.url).href,
        WALKER_OASIS_FRAME_0: new URL('../assets/images/walker_oasis_FRAME_2.png', import.meta.url).href,
        PROJ_OASIS: new URL('../assets/images/projectile_oasis.png', import.meta.url).href,
        WALL_OASIS: new URL('../assets/images/wall_oasis.png', import.meta.url).href,
        DANGER_OASIS: new URL('../assets/images/danger_oasis.png', import.meta.url).href,
        TILE_OASIS: new URL('../assets/images/tile_oasis.png', import.meta.url).href,
        GATE_OASIS: new URL('../assets/images/gate_oasis.png', import.meta.url).href,
        SPAWNER_OASIS: new URL('../assets/images/spawner_oasis.png', import.meta.url).href,
        WALKER_DESERT_FRAME_1: new URL('../assets/images/walker_desert_FRAME_1.png', import.meta.url).href,
        WALKER_DESERT_FRAME_0: new URL('../assets/images/walker_desert_FRAME_2.png', import.meta.url).href,
        PROJ_DESERT: new URL('../assets/images/projectile_desert.png', import.meta.url).href,
        WALL_DESERT: new URL('../assets/images/wall_desert.png', import.meta.url).href,
        DANGER_DESERT: new URL('../assets/images/danger_desert.png', import.meta.url).href,
        TILE_DESERT: new URL('../assets/images/tile_desert.png', import.meta.url).href,
        GATE_DESERT: new URL('../assets/images/gate_desert.png', import.meta.url).href,
        SPAWNER_DESERT: new URL('../assets/images/spawner_desert.png', import.meta.url).href,
        WALKER_CAVERN_FRAME_1: new URL('../assets/images/walker_cavern_FRAME_1.png', import.meta.url).href,
        WALKER_CAVERN_FRAME_0: new URL('../assets/images/walker_cavern_FRAME_2.png', import.meta.url).href,
        PROJ_CAVERN: new URL('../assets/images/projectile_cavern.png', import.meta.url).href,
        WALL_CAVERN: new URL('../assets/images/wall_cavern.png', import.meta.url).href,
        DANGER_CAVERN: new URL('../assets/images/danger_cavern.png', import.meta.url).href,
        TILE_CAVERN: new URL('../assets/images/tile_cavern.png', import.meta.url).href,
        GATE_CAVERN: new URL('../assets/images/gate_cavern.png', import.meta.url).href,
        SPAWNER_CAVERN: new URL('../assets/images/spawner_cavern.png', import.meta.url).href,
    },
    SOUNDS: {
        BACKGROUND_MUSIC: new URL('../assets/sounds/backgroundmusic.mp3', import.meta.url).href,
        BAD: new URL('../assets/sounds/collision.wav', import.meta.url).href,
        GOOD: new URL('../assets/sounds/coin.mp3', import.meta.url).href,
        SILENCE: new URL('../assets/sounds/silence.mp3', import.meta.url).href
    }
}

// 游戏配置 (从 initialization.py 转换)
export const GAME_CONFIG = {
    SCREEN_WIDTH: 1920,
    SCREEN_HEIGHT: 1080,
    GAME_DURATION: 120,
    INITIAL_LIFE: 3,
    MAX_SCORE: 360,
    CALIBRATION_MIN_X: 800,
    CALIBRATION_MAX_X: 1120,
    CALIBRATION_MIN_WIDTH: 200,
    CALIBRATION_MAX_WIDTH: 450,
}

// 难度设置
export const DIFFICULTY_SETTINGS = {
    EASY: {
        GAME_DURATION: 120,
        PLAYER_SPEED: 0.3,
        MAX_HP: 10,
        FLOORS_BETWEEN_REST: 2,
        THEME_CHANCE: 2
    },
    MEDIUM: {
        GAME_DURATION: 999,
        NO_OF_ITEMS: 12,
        NO_OF_JUNK: 5,
        HOLD_TIME: 1500
    },
    HARD: {
        GAME_DURATION: 999,
        NO_OF_ITEMS: 18,
        NO_OF_JUNK: 8,
        HOLD_TIME: 2000
    }
}