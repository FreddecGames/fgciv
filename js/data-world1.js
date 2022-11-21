//===

function loadDataWorld1() {
        
    //--- Resources
    
    game.gameObjects.push(new GameObject({ id:'gold',	img:'gold.webp',	uiId:'resources' },	{ count:500 }))
    game.gameObjects.push(new GameObject({ id:'good',	img:'good.webp',	uiId:'resources' },	{ count:500 }))

    //--- Building objects
    
    class BuildingObject extends GameObject {
        constructor(data) {
            super({ id:data.id, uiId:'buildingObjects', img:data.img }, { count:data.initCount })
        }
    }
    
    game.gameObjects.push(new BuildingObject({ id:'land',	    img:'land.webp',	    initCount:200 }))
    game.gameObjects.push(new BuildingObject({ id:'pop',	    img:'pop.webp',	        initCount:0 }))
    game.gameObjects.push(new BuildingObject({ id:'happiness',	img:'happiness.webp',   initCount:0 }))
    
    //--- Decos
    
    class Deco extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'decos', req:data.req, cost:data.cost, build:data.build, using:data.using, gain:data.gain }, { count:0, status:'idle', remainingTime:0 })
        }
    }

    game.gameObjects.push(new Deco({ id:'tree',	    cost:{ good:8 },	        build:{ time:2 },	using:{ land:1 },	gain:{ happiness:18 } }))
    game.gameObjects.push(new Deco({ id:'obelisk',  cost:{ gold:5 },	        build:{ time:2 },	using:{ land:1 },	gain:{ happiness:18 } }))
    game.gameObjects.push(new Deco({ id:'memorial',	cost:{ gold:20, good:20 },	build:{ time:2 },	using:{ land:4 },	gain:{ happiness:72 } }))
    
    //--- Houses
    
    class House extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'houses', req:data.req, cost:data.cost, build:data.build, using:data.using, gain:data.gain, prod:data.prod }, { count:0, status:'idle', remainingTime:0 })
        }
    }
    
    game.gameObjects.push(new House({ id:'stiltHouse',	    req:{ age0:1 }, cost:{ gold:40, good:150 },	    build:{ time:15 },	using:{ land:4, happiness:22 },	gain:{ pop:22 },	prod:{ gold:0.012 } }))
    game.gameObjects.push(new House({ id:'chalet',	        req:{ age0:1, chalets:1 }, cost:{ gold:120, good:370 },	build:{ time:600 },	using:{ land:4, happiness:32 },	gain:{ pop:32 },	prod:{ gold:0.005 } }))
    game.gameObjects.push(new House({ id:'thatchedHouse',   req:{ age0:1, thatchedHouses:1 }, cost:{ gold:160, good:300 },    build:{ time:300 },	using:{ land:4, happiness:27 },	gain:{ pop:27 },	prod:{ gold:0.009 } }))

    game.gameObjects.push(new House({ id:'hut',	            cost:{ good:60 },	build:{ time:5 },	using:{ land:4, happiness:14 },	gain:{ pop:14 },	prod:{ gold:0.02 } }))
    
    //--- Prods
    
    class Prod extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'prods', req:data.req, cost:data.cost, build:data.build, using:data.using, prod:data.prod }, { count:0, status:'idle', remainingTime:0 })
        }
    }
    
    game.gameObjects.push(new Prod({ id:'pottery',	    req:{ age0:1 }, cost:{ gold:240, good:30 },	    build:{ time:1200 },	using:{ land:12, pop:41 },	prod:{ good:0.014 } }))
    game.gameObjects.push(new Prod({ id:'fruitFarm',	req:{ age0:1, cultivation:1 }, cost:{ gold:1750, good:130 },	build:{ time:2400 },	using:{ land:20, pop:50 },	prod:{ good:0.036 } }))
    game.gameObjects.push(new Prod({ id:'blacksmith',	req:{ age0:1 }, cost:{ gold:430, good:40 },	    build:{ time:1200 },	using:{ land:4, pop:12 },	prod:{ good:0.009 } }))

    game.gameObjects.push(new Prod({ id:'hunter',	    cost:{ gold:96 },	build:{ time:5 },	using:{ land:9, pop:28 },	prod:{ good:0.01 } }))
    
    //--- Barracks
    
    class Barrack extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'barracks', req:data.req, cost:data.cost, build:data.build, using:data.using }, { count:0, status:'idle', remainingTime:0 })
        }
    }
    
    game.gameObjects.push(new Barrack({ id:'spearfighterBarracks',	req:{ age0:1 }, cost:{ gold:170, good:110 },  build:{ time:20 },	using:{ land:9, pop:26 } }))
    game.gameObjects.push(new Barrack({ id:'slingerRange',	        req:{ age0:1, slingshots:1 }, cost:{ gold:430, good:280 },  build:{ time:1800 },	using:{ land:6, pop:34 } }))
    game.gameObjects.push(new Barrack({ id:'horsemanStable',	    req:{ age0:1, horsebackRiding:1 }, cost:{ gold:640, good:420 },  build:{ time:1800 },	using:{ land:9, pop:56 } }))
    game.gameObjects.push(new Barrack({ id:'warriorBarracks',	    req:{ age0:1 }, cost:{ gold:850, good:560 },  build:{ time:2400 },	using:{ land:9, pop:47 } }))
    game.gameObjects.push(new Barrack({ id:'throwerCamp',	        req:{ age0:1 }, cost:{ gold:1070, good:700 }, build:{ time:2400 },	using:{ land:9, pop:56 } }))
    
    //--- Techs
    
    class Tech extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'techs', req:data.req, cost:data.cost, build:data.build }, { count:0, status:'idle', remainingTime:0 })
        }
    }
    
    game.gameObjects.push(new Tech({ id:'slingshots',	    req:{ age0:1 }, cost:{ gold:200 },	            build:{ time:0 } }))
    game.gameObjects.push(new Tech({ id:'chalets',	        req:{ age0:1 }, cost:{ gold:100, good:200 },	build:{ time:0 } }))
    game.gameObjects.push(new Tech({ id:'cultivation',	    req:{ age0:1 }, cost:{ gold:200, good:100 },	build:{ time:0 } }))
    game.gameObjects.push(new Tech({ id:'tools',	        req:{ age0:1 }, cost:{ good:100 },	            build:{ time:0 }, gain:{ land:16 } }))
    game.gameObjects.push(new Tech({ id:'growing',	        req:{ age0:1, chalets:1 }, cost:{ good:300 },	            build:{ time:0 }, gain:{ land:16 } }))
    game.gameObjects.push(new Tech({ id:'horsebackRiding',	        req:{ age0:1, chalets:1, slingshots:1 }, cost:{ gold:250 },	            build:{ time:0 } }))
    game.gameObjects.push(new Tech({ id:'thatchedHouses',	        req:{ age0:1, cultivation:1 }, cost:{ gold:150, good:200 },	            build:{ time:0 } }))
    game.gameObjects.push(new Tech({ id:'thatchedHouses',	        req:{ age0:1, cultivation:1 }, cost:{ gold:150, good:200 },	            build:{ time:0 } }))
    
    game.gameObjects.push(new Tech({ id:'tribalCommunity',	build:{ time:0 } }))
    
    //--- Units
    
    class Unit extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'units', req:data.req, cost:data.cost, build:data.build }, { count:0, status:'idle', remainingTime:0 })
        }
    }

    game.gameObjects.push(new Unit({ id:'spearfighter',	req:{ age0:1, spearfighterBarracks:1 }, cost:{ gold:25, good:25 },  build:{ time:20 } }))
    game.gameObjects.push(new Unit({ id:'slinger',	    req:{ age0:1, slingerRange:1 },         cost:{ gold:60, good:15 },  build:{ time:3600 } }))
    game.gameObjects.push(new Unit({ id:'horseman',	    req:{ age0:1, horsemanStable:1 },       cost:{ gold:24, good:100 }, build:{ time:3600 } }))
    game.gameObjects.push(new Unit({ id:'warrior',	    req:{ age0:1, warriorBarracks:1 },      cost:{ gold:160 },          build:{ time:3600 } }))
    game.gameObjects.push(new Unit({ id:'stoneThrower',	req:{ age0:1, throwerCamp:1 },          cost:{ good:180 },          build:{ time:3600 } }))
    
    //--- Territories
    
    class Territory extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'territories', req:data.req, cost:data.cost, build:data.build, gain:data.gain }, { count:0, status:'idle', remainingTime:0 })
        }
    }
    
    game.gameObjects.push(new Territory({ id:'age1sector11',	req:{ age0:1 },   cost:{ clubmen:2 },                                               build:{ time:0 }, gain:{ gold:50 } }))
    game.gameObjects.push(new Territory({ id:'age1sector12',	req:{ age0:1 },   cost:{ clubmen:2, horseman:1 },                                   build:{ time:0 }, gain:{ good:60 } }))
    game.gameObjects.push(new Territory({ id:'age1sector13',	req:{ age0:1 },   cost:{ clubmen:2, horseman:1 },                                   build:{ time:0 }, gain:{ good:65 } }))

    game.gameObjects.push(new Territory({ id:'age1scout2',	    req:{ age1sector11:1, age1sector12:1, age1scout13:1 },   cost:{ gold:10 },	build:{ time:420 } }))
    
    game.gameObjects.push(new Territory({ id:'age1sector21',	req:{ age1scout2:1 }, cost:{ slinger:1, spearfighter:3 },                               build:{ time:0 }, gain:{ gold:75 } }))
    game.gameObjects.push(new Territory({ id:'age1sector22',	req:{ age1scout2:1 }, cost:{ horseman:1, slinger:2, spearfighter:1, warrior:1 },        build:{ time:0 }, gain:{ good:75 } }))
    game.gameObjects.push(new Territory({ id:'age1sector23',	req:{ age1scout2:1 }, cost:{ slinger:2, spearfighter:1, warrior:1 },                    build:{ time:0 }, gain:{ gold:75 } }))
    
    game.gameObjects.push(new Territory({ id:'age1scout3',	    req:{ age1sector21:1, age1sector22:1, age1sector23:1 },   cost:{ gold:20 },	build:{ time:420 } }))
    
    game.gameObjects.push(new Territory({ id:'age1sector31',	req:{ age1scout3:1 }, cost:{ spearfighter:2, stoneThrower:1, warrior:1 },               build:{ time:0 }, gain:{ gold:100 } }))
    game.gameObjects.push(new Territory({ id:'age1sector32',	req:{ age1scout3:1 }, cost:{ slinger:2, warrior:2 },                                    build:{ time:0 }, gain:{ good:100 } }))
    game.gameObjects.push(new Territory({ id:'age1sector33',	req:{ age1scout3:1 }, cost:{ spearfighter:1, warrior:3 },                               build:{ time:0 }, gain:{ good:100 } }))
    game.gameObjects.push(new Territory({ id:'age1sector34',	req:{ age1scout3:1 }, cost:{ spearfighter:2, warrior:1 },                               build:{ time:0 }, gain:{ gold:100 } }))
    game.gameObjects.push(new Territory({ id:'age1sector35',	req:{ age1scout3:1 }, cost:{ horseman:1, warrior:2 },                                   build:{ time:0 }, gain:{ gold:100 } }))
    
    game.gameObjects.push(new Territory({ id:'age1scout4',	    req:{ age1sector31:1, age1sector32:1, age1sector33:1, age1sector34:1, age1sector35:1 },   cost:{ gold:30 },	build:{ time:480 } }))
    
    game.gameObjects.push(new Territory({ id:'age1sector41',	req:{ age1scout4:1 }, cost:{ slinger:2, spearfighter:3 },                               build:{ time:0 }, gain:{ good:100 } }))
    game.gameObjects.push(new Territory({ id:'age1sector42',	req:{ age1scout4:1 }, cost:{ spearfighter:1, stoneThrower:2, warrior:3 },               build:{ time:0 }, gain:{ good:100 } }))
    game.gameObjects.push(new Territory({ id:'age1sector43',	req:{ age1scout4:1 }, cost:{ horseman:1, slinger:1, spearfighter:2, stoneThrower:1 },   build:{ time:0 }, gain:{ gold:100 } }))
    game.gameObjects.push(new Territory({ id:'age1sector44',	req:{ age1scout4:1 }, cost:{ horseman:3, slinger:1, spearfighter:1 },                   build:{ time:0 }, gain:{ good:100 } }))
    game.gameObjects.push(new Territory({ id:'age1sector45',	req:{ age1scout4:1 }, cost:{ horseman:1, spearfighter:1, warrior:3 },                   build:{ time:0 }, gain:{ gold:100 } }))
    
    //--- Objectives
    
    class Objective extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'objectives', req:data.req, check:data.check, build:{ time:0 } }, { count:0 })
        }
    }
    
    game.gameObjects.push(new Objective({ id:'age1',	req:{ age0:1 }, check:{ age1sector41:1, age1sector42:1, age1sector43:1, age1sector44:1, age1sector45:1 } }))
    game.gameObjects.push(new Objective({ id:'age0',	                check:{ hut:2, hunter:1, tribalCommunity:1 } }))
}