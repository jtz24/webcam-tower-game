export const LEVELS = {
ground:[
{
layout:
`BBBBBBBBBBBBBBBB
B______________B
B_B_B_B______G_B
B_BBB_B________B
B_B_B_B________B
B______________B
B______________B
B______________B
BBBBBBBBBBBBBBBB
`
},
{
layout:
`BBBBBBBBBBBBBBBB
B______________B
B____________G_B
B_===_==_==_=__B
B_=_=_==_=__==_B
B_==__=___=_=__B
B_=_=_==_==_==_B
B______________B
BBBBBBBBBBBBBBBB
`
},
{
layout:
`BBBBBBBBBBBBBBBB
B______________B
B_===_==_==_=__B
B_=_=_==_=__==_B
B_==__=___=_=__B
B_=_=_==_==_==_B
B_G____________B
B______________B
BBBBBBBBBBBBBBBB
`
}
],

main:[
{
layout: 
`RRRRRRRRRRRBBBBB
RRR______RRB___B
RR________R__G_B
R____B____R____B
R____B____R____R
B___BB____R____R
B___BB_________R
B___B___B_____RR
BBBBBBBBBRRRRRRR
`,
exitTop: true,
exitRight: true
},
{
layout: 
`RRRRRRRRRRRRRRRR
RRRRRR____RRRRRR
RRRRR______RRRRR
RRRR________RRRR
RRR____RR____BBB
R_____RRRR_____B
B____RRRRRR__G_B
B___RRRRRRRR___B
BBBBBBBBBBBBBBBB
`,
exitTop: false,
exitRight: true
},
{
layout: 
`BBBBBRRRRRRRRRRR
B___B______R___R
B_G____________R
B______RR______R
RRRRRRRRR______R
R______RRRRR___R
B______________R
B______________R
BBBBBRRRRRRRRRRR
`,
exitTop: true,
exitRight: false,
},
{
layout:
`BBBBBBBBBBBBBBBB
B__0___________B
B___B_0________B
B___B_______0__B
B___B_____0____B
B___B0_________B
B___B________G_B
B___B__________B
BBBBBBBBBBBBBBBB
`,
exitTop: false,
exitRight: true
},
{
layout:
`BBBBBBBBBBBBBBBB
B____1_________B
B______________B
B______1_______B
B______________B
B________1_____B
B____________G_B
B__________1___B
BBBBBBBBBBBBBBBB
`,
exitTop: false,
exitRight: true
},
{
layout:
`BBBBBBBBBBBBBBBB
B______________B
B_G____________B
B___BB0___BBBBBB
BBBBB__________B
B___BBBB0___BBBB
B______________B
B______________B
BBBBBBBBBBBBBBBB
`,
exitTop: true,
exitRight: false
},
{
layout:
`BBBBBBBBBBBBBBBB
B___R_____R____B
B_B_____B____G_B
B_____R_____R__B
B___R_____R____B
B_______B_____BB
B_____B_____B__B
B_________R____B
BBBBBBBBBBBBBBBB
`,
exitTop: true,
exitRight: true
},
{
layout:
`BBBBBBBBBBBBBBBB
B______________B
B____________G_B
B______________B
B____________2_B
B______________B
B__________2_2_B
B______________B
BBBBBBBBBBBBBBBB
`,
exitTop: true,
exitRight: true
},
{
layout:
`BBBBBBBBBBBBBBBB
BBBBB_BBBB_B___B
BBB__________G_B
B___0__________B
B____1____1____B
B__________0___B
B____________BBB
B___B_BBBB_BBBBB
BBBBBBBBBBBBBBBB
`,
exitTop: true,
exitRight: true
},
{
layout: 
`BBBBBBBBBBBBBBBB
B______________B
B____________G_B
B______________B
B_______2______B
B______________B
B______________B
B______________B
BBBBBBBBBBBBBBBB
`,
exitTop: true,
exitRight: true
},
]
}

export const TILES = {
    '_':{
        behaviour: 'blank',
        attributes: {},
        active: false,
        image: `TILE`
    },
    '=':{
        behaviour: 'blank',
        attributes: {},
        active: false,
        image: `YELLOW`
    },
    'B':{
        behaviour: 'wall',
        attributes: {},
        active: false,
        image: `WALL`
    },
    'R':{
        behaviour: 'danger',
        attributes: {damage:1, kb:1, stunTime:2000, invTime:2000, sound:`BAD`},
        active: false,
        image: `DANGER`
    },
    'G':{
        behaviour: 'gate',
        attributes: {direction: 'up'},
        active: false,
        image: `GATE`
    },
    '0':{
        behaviour: 'spawner',
        attributes: {entity:'walkerH', cd:1000000, lastSpawnTime:0},
        active: true,
        image: `TILE`
    },
    '1':{
        behaviour: 'spawner',
        attributes: {entity:'walkerV', cd:1000000, lastSpawnTime:0},
        active: true,
        image: `TILE`
    },
    '2':{
        behaviour: 'spawner',
        attributes: {entity:'bulletS', cd:2000, lastSpawnTime:0},
        active: true,
        image: `SPAWNER`
    }
}

export const ENTITIES = {
    'walkerH':{
        behaviour: 'walkerH',
        attributes_easy:  {speed:0.2, damage:1, kb:1.5, stunTime:750, invTime:2000, sound:`BAD`},
        attributes_medium:{speed:0.25, damage:1, kb:1.5, stunTime:750, invTime:2000, sound:`BAD`},
        attributes_hard:  {speed:0.3, damage:1, kb:1.5, stunTime:750, invTime:2000, sound:`BAD`},
        attributes: {},
        x: 0,
        y: 0,
        width: 80,
        height:80,
        image: `WALKER`,
        frames:2,
        xV:0,
        yV:0
    },
    'walkerV':{
        behaviour: 'walkerV',
        attributes_easy:  {speed:0.2, damage:1, kb:1.5, stunTime:750, invTime:2000, sound:`BAD`},
        attributes_medium:{speed:0.25, damage:1, kb:1.5, stunTime:750, invTime:2000, sound:`BAD`},
        attributes_hard:  {speed:0.3, damage:1, kb:1.5, stunTime:750, invTime:2000, sound:`BAD`},
        attributes: {},
        x: 0,
        y: 0,
        width: 80,
        height:80,
        image: `WALKER`,
        frames:2,
        xV:0,
        yV:0
    },
    'bulletS':{
        behaviour: 'projectile',
        attributes_easy:  {speed:0.5, damage:1, kb:2, stunTime:750, invTime:2000, sound:`BAD`},
        attributes_medium:{speed:0.6, damage:1, kb:2, stunTime:750, invTime:2000, sound:`BAD`},
        attributes_hard:  {speed:0.7, damage:1, kb:2, stunTime:750, invTime:2000, sound:`BAD`},
        attributes: {},
        x: 0,
        y: 0,
        width: 40,
        height:40,
        image: `PROJ`,
        frames:1,
        xV:0,
        yV:0
    }
}

export const THEMES = [
    `DUNGEON`,
    `LAIR`,
    `FOREST`,
    `GROTTO`,
    `OASIS`,
    `DESERT`,
    `CAVERN`,
]