//===

function loadDataWorld1() {
    
    //--- resources
    
    game.gameObjects.push(new GameObject(
        { id:'pop', img:'world1/pop.webp', type:'resource' },
        { count:0 },
    ))
    
    game.gameObjects.push(new GameObject(
        { id:'good', img:'world1/good.webp', type:'resource', showProduction:true },
        { count:500 },
    ))

    game.gameObjects.push(new GameObject(
        { id:'gold', img:'world1/gold.webp', type:'resource', showProduction:true },
        { count:500 },
    ))

    //--- land
    
    game.gameObjects.push(new GameObject({ id:'land', img:'world1/land.webp', type:'land' }, { count:214 } ))
    
    //--- town hall
    
    game.gameObjects.push(new GameObject({ id:'townHallLevel1',  img:'world1/townHall.webp', type:'townHall', prod:{ gold:0.006 } }, { count:1 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel2',  img:'world1/townHall.webp', type:'townHall', prod:{ gold:0.017 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel3',  img:'world1/townHall.webp', type:'townHall', prod:{ gold:0.029 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel4',  img:'world1/townHall.webp', type:'townHall', prod:{ gold:0.046 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel5',  img:'world1/townHall.webp', type:'townHall', prod:{ gold:0.069 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel6',  img:'world1/townHall.webp', type:'townHall', prod:{ gold:0.104 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel7',  img:'world1/townHall.webp', type:'townHall', prod:{ gold:0.139 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel8',  img:'world1/townHall.webp', type:'townHall', prod:{ gold:0.185 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel9',  img:'world1/townHall.webp', type:'townHall', prod:{ gold:0.231 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel10', img:'world1/townHall.webp', type:'townHall', prod:{ gold:0.289 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel11', img:'world1/townHall.webp', type:'townHall', prod:{ gold:0.347 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel12', img:'world1/townHall.webp', type:'townHall', prod:{ gold:0.417 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel13', img:'world1/townHall.webp', type:'townHall', prod:{ gold:0.486 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel14', img:'world1/townHall.webp', type:'townHall', prod:{ gold:0.567 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel15', img:'world1/townHall.webp', type:'townHall', prod:{ gold:0.648 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel16', img:'world1/townHall.webp', type:'townHall', prod:{ gold:0.787 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel17', img:'world1/townHall.webp', type:'townHall', prod:{ gold:1.389 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel18', img:'world1/townHall.webp', type:'townHall', prod:{ gold:1.736 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel19', img:'world1/townHall.webp', type:'townHall', prod:{ gold:2.083 } }, { count:0 } ))
    game.gameObjects.push(new GameObject({ id:'townHallLevel20', img:'world1/townHall.webp', type:'townHall', prod:{ gold:2.431 } }, { count:0 } ))
    
    //--- house
    
    game.gameObjects.push(new GameObject(
        { id:'house0Level1', type:'house', req:{ townHallLevel1:1 }, limit:{ townHallLevel2:1 }, gain:{ pop:14 }, prod:{ gold:0.01 }, build:{ time:5, cost:{ land:5, good:60 } } },
        { count:0, status:'idle', remainingTime:0 },
    ))
    game.gameObjects.push(new GameObject(
        { id:'house1Level1', type:'house', req:{ townHallLevel1:1, techHouse1Level1:1 }, limit:{ townHallLevel2:1 }, gain:{ pop:22 }, prod:{ gold:0.01 }, build:{ time:15, cost:{ land:5, gold:60, good:180 } } },
        { count:0, status:'idle', remainingTime:0 },
    ))
    game.gameObjects.push(new GameObject(
        { id:'house2Level1', type:'house', req:{ townHallLevel1:1, techHouse2Level1:1 }, limit:{ townHallLevel2:1 }, gain:{ pop:32 }, prod:{ gold:0.005 }, build:{ time:600, cost:{ land:5, gold:140, good:400 } } },
        { count:0, status:'idle', remainingTime:0 },
    ))
    game.gameObjects.push(new GameObject(
        { id:'house3Level1', type:'house', req:{ townHallLevel1:1, techHouse3Level1:1 }, limit:{ townHallLevel2:1 }, gain:{ pop:27 }, prod:{ gold:0.008 }, build:{ time:300, cost:{ land:5, gold:180, good:330 } } },
        { count:0, status:'idle', remainingTime:0 },
    ))
    
    //--- tech
    
    game.gameObjects.push(new GameObject(
        { id:'techHouse1Level1', type:'tech', req:{ townHallLevel1:1 }, limit:{ townHallLevel2:1 }, max:1, build:{ time:0 } },
        { count:0, status:'idle', remainingTime:0 },
    ))
    
    game.gameObjects.push(new GameObject(
        { id:'techHouse2Level1', type:'tech', req:{ townHallLevel1:1 }, limit:{ townHallLevel2:1 }, max:1, build:{ time:0 } },
        { count:0, status:'idle', remainingTime:0 },
    ))
    
    game.gameObjects.push(new GameObject(
        { id:'techHouse3Level1', type:'tech', req:{ townHallLevel1:1 }, limit:{ townHallLevel2:1 }, max:1, build:{ time:0 } },
        { count:0, status:'idle', remainingTime:0 },
    ))
}