//===

function loadDataWorld1() {
    
    //--- Resources
    
    class Resource extends GameObject {
        constructor(data) {
            super({ id:data.id, img:data.img, uiId:'resources' }, { count:data.initCount })
        }
    }
    
    game.gameObjects.push(new Resource({ id:'gold',	        img:'gold.png',	        initCount:500   }))
    game.gameObjects.push(new Resource({ id:'good',	        img:'good.png',	        initCount:500   }))
    game.gameObjects.push(new Resource({ id:'land',         img:'land.png',	        initCount:200   }))
    game.gameObjects.push(new Resource({ id:'pop',          img:'pop.png',	        initCount:0     }))
    game.gameObjects.push(new Resource({ id:'happiness',    img:'happiness.png',	initCount:50    }))
    
    //--- Categories
    
    game.gameCategories.push({ id:'objectives',                                     uiId:'objectives',  buildIcon:'plus-circle',    tabIcon:'bullseye',     displayDone:true, default:true })    
    game.gameCategories.push({ id:'houses',                                         uiId:'houses',      buildIcon:'plus-circle',    tabIcon:'house-user'    })
    game.gameCategories.push({ id:'prods',          req:{ obj0:1 },                 uiId:'prods',       buildIcon:'plus-circle',    tabIcon:'industry'      })
    game.gameCategories.push({ id:'decos',          req:{ obj1:1 },                 uiId:'decos',       buildIcon:'plus-circle',    tabIcon:'fan'           })
    game.gameCategories.push({ id:'cultures',       req:{ construction:1 },         uiId:'cultures',    buildIcon:'plus-circle',    tabIcon:'university'    })
    game.gameCategories.push({ id:'barracks',       req:{ obj5:1 },                 uiId:'barracks',    buildIcon:'plus-circle',    tabIcon:'building'      })
    game.gameCategories.push({ id:'goods',          req:{ growing:1 },              uiId:'goods',       buildIcon:'plus-circle',    tabIcon:'boxes'         })
    game.gameCategories.push({ id:'techs',          req:{ obj2:1 },                 uiId:'techs',       buildIcon:'check-circle',   tabIcon:'flask',        displayDone:true  })
    game.gameCategories.push({ id:'units',          req:{ spearfighterBarracks:1 }, uiId:'units',       buildIcon:'plus-circle',    tabIcon:'users'         })
    game.gameCategories.push({ id:'territories',    req:{ obj6:1 },                 uiId:'territories', buildIcon:'check-circle',   tabIcon:'map',          displayDone:true  })
    
    //--- Objectives
    
    class Objective extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'objectives', req:data.req, check:data.check, build:{ time:0 }, max:1, gain:data.gain }, { count:0 })
        }
    }

    game.gameObjects.push(new Objective({ id:'obj17',	req:{ obj16:1 },    check:{ prov2scout:1 },                         gain:{ good:300 }                   }))
    game.gameObjects.push(new Objective({ id:'obj16',	req:{ obj15:1 },    check:{ prov1sector3:1 },                       gain:{ gold:300 }                   }))
    game.gameObjects.push(new Objective({ id:'obj15',	req:{ obj14:1 },    check:{ prov1sector2:1 },                       gain:{ good:400 }                   }))
    game.gameObjects.push(new Objective({ id:'obj14',	req:{ obj13:1 },    check:{ construction:1 },                       gain:{ gold:350 }                   }))
    game.gameObjects.push(new Objective({ id:'obj13',	req:{ obj12:1 },    check:{ theWheel:1 },                           gain:{ good:400 }                   }))
    game.gameObjects.push(new Objective({ id:'obj12',	req:{ obj11:1 },    check:{ stiltHouse:4, pottery:1 },              gain:{ gold:300 }                   }))
    game.gameObjects.push(new Objective({ id:'obj11',	req:{ obj10:1 },    check:{ potteryTech:1 },                        gain:{ good:200 }                   }))
    game.gameObjects.push(new Objective({ id:'obj10',	req:{ obj9:1 },     check:{ stiltHouse:3 },                         gain:{ good:300 }                   }))
    game.gameObjects.push(new Objective({ id:'obj9',	req:{ obj8:1 },     check:{ memorial:2 },                           gain:{ gold:250 }                   }))
    game.gameObjects.push(new Objective({ id:'obj8',	req:{ obj7:1 },     check:{ spearfighter:3 },                       gain:{ gold:200 }                   }))
    game.gameObjects.push(new Objective({ id:'obj7',	req:{ obj6:1 },     check:{ prov1sector1:1 },                       gain:{ spearfighter:2 }             }))
    game.gameObjects.push(new Objective({ id:'obj6',	req:{ obj5:1 },     check:{ stiltHouse:2, spearfighterBarracks:1 }, gain:{ good:200, spearfighter:2 }   }))
    game.gameObjects.push(new Objective({ id:'obj5',	req:{ obj4:1 },     check:{ spears:1 },                             gain:{ gold:175 }                   }))
    game.gameObjects.push(new Objective({ id:'obj4',	req:{ obj3:1 },     check:{ stiltHouse:1 }                          }))
    game.gameObjects.push(new Objective({ id:'obj3',	req:{ obj2:1 },     check:{ stiltHouses:1 },                        gain:{ gold:120, good:120 }         }))
    game.gameObjects.push(new Objective({ id:'obj2',	req:{ obj1:1 },     check:{ memorial:1 }                            }))
    game.gameObjects.push(new Objective({ id:'obj1',	req:{ obj0:1 },     check:{ hut:2, hunter:1 }                       }))
    game.gameObjects.push(new Objective({ id:'obj0',	                    check:{ hut:1 }                                 }))

    //--- Houses
    
    class House extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'houses', req:data.req, cost:data.cost, build:data.build, using:data.using, gain:data.gain, prod:data.prod, deletable:true }, { count:0, status:'idle', remainingTime:data.build.time })
        }
    }

    game.gameObjects.push(new House({ id:'stiltHouse',	    req:{ stiltHouses:1 },      cost:{ gold:40, good:150 },	    build:{ time:15 },	using:{ land:4, happiness:22 },	gain:{ pop:22 },	prod:{ gold:0.012 } }))
    game.gameObjects.push(new House({ id:'hut',	                                        cost:{ good:60 },	            build:{ time:5 },	using:{ land:4, happiness:14 },	gain:{ pop:14 },	prod:{ gold:0.02 } }))
    
    //--- Prods
    
    class Prod extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'prods', req:data.req, cost:data.cost, build:data.build, using:data.using, prod:data.prod, deletable:true }, { count:0, status:'idle', remainingTime:data.build.time })
        }
    }
    
    game.gameObjects.push(new Prod({ id:'fruitFarm',    req:{ cultivation:1 },          cost:{ gold:1750, good:30 },	build:{ time:2400 },	using:{ land:20, pop:50 },	prod:{ good:0.036 }     }))
    game.gameObjects.push(new Prod({ id:'pottery',      req:{ potteryTech:1 },          cost:{ gold:240, good:30 },	    build:{ time:1200 },	using:{ land:12, pop:41 },	prod:{ good:0.014 }     }))
    game.gameObjects.push(new Prod({ id:'hunter',	    req:{ obj0:1 },                 cost:{ gold:96 },	            build:{ time:5 },	    using:{ land:9, pop:28 },	prod:{ good:0.01 }      }))
    
    //--- Decos
    
    class Deco extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'decos', req:data.req, cost:data.cost, build:data.build, using:data.using, gain:data.gain, deletable:true }, { count:0, status:'idle', remainingTime:data.build.time })
        }
    }

    game.gameObjects.push(new Deco({ id:'flowers',	req:{ stiltHouses:1 },      cost:{ gold:16, good:26 },	build:{ time:5 },	using:{ land:1 },	gain:{ happiness:20 } }))
    game.gameObjects.push(new Deco({ id:'memorial',	req:{ obj1:1 },             cost:{ gold:20, good:20 },	build:{ time:2 },	using:{ land:4 },	gain:{ happiness:72 } }))
    
    //--- Cultures
    
    class Culture extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'cultures', req:data.req, cost:data.cost, build:data.build, using:data.using, gain:data.gain, deletable:true }, { count:0, status:'idle', remainingTime:data.build.time })
        }
    }

    game.gameObjects.push(new Culture({ id:'stoneCircle',	req:{ construction:1 },     cost:{ gold:780, good:140 },    build:{ time:600 },     using:{ land:9 },       gain:{ happiness:182 } }))

    //--- Barracks
    
    class Barrack extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'barracks', req:data.req, cost:data.cost, build:data.build, using:data.using, deletable:true }, { count:0, status:'idle', remainingTime:data.build.time })
        }
    }

    game.gameObjects.push(new Barrack({ id:'horsemanStable',	    req:{ horsebackRiding:1 },  cost:{ gold:640, good:420 },  build:{ time:1800 },	using:{ land:9, pop:56 } }))
    game.gameObjects.push(new Barrack({ id:'spearfighterBarracks',	req:{ spears:1 },           cost:{ gold:170, good:110 },  build:{ time:20 },	using:{ land:9, pop:26 } }))
    
    //--- Goods
    
    class Good extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'goods', req:data.req, cost:data.cost, build:data.build }, { count:0, status:'idle', remainingTime:data.build.time })
        }
    }
    
    game.gameObjects.push(new Good({ id:'dye',	    req:{ growing:1 },  cost:{ gold:100, good:100 },  build:{ time:14400 } }))
    game.gameObjects.push(new Good({ id:'wine',	    req:{ growing:1 },  cost:{ gold:100, good:100 },  build:{ time:14400 } }))
    
    //--- Techs
    
    class Tech extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'techs', req:data.req, cost:data.cost, build:{ time:0 }, max:1, gain:data.gain }, { count:0, status:'idle', remainingTime:0 })
        }
    }

    game.gameObjects.push(new Tech({ id:'horsebackRiding',  req:{ chalets:1, slingshots:1 },    cost:{ gold:250 }           }))
    game.gameObjects.push(new Tech({ id:'growing',          req:{ chalets:1 },                  cost:{ good:300 }           }))
    game.gameObjects.push(new Tech({ id:'tools',            req:{ construction:1 },             cost:{ good:100 },          gain:{ land:16} }))
    game.gameObjects.push(new Tech({ id:'cultivation',      req:{ theWheel:1, construction:1 }, cost:{ gold:200, good:100 } }))
    game.gameObjects.push(new Tech({ id:'chalets',          req:{ construction:1 },             cost:{ gold:100, good:200 } }))
    game.gameObjects.push(new Tech({ id:'slingshots',       req:{ theWheel:1 },                 cost:{ gold:200 }           }))
    game.gameObjects.push(new Tech({ id:'construction',     req:{ potteryTech:1, spears:1 }     }))    
    game.gameObjects.push(new Tech({ id:'theWheel',         req:{ stiltHouses:1, spears:1 },                                gain:{ land:16} }))
    game.gameObjects.push(new Tech({ id:'potteryTech',      req:{ obj10:1 }                     }))    
    game.gameObjects.push(new Tech({ id:'spears',	        req:{ obj4:1 }                      }))
    game.gameObjects.push(new Tech({ id:'stiltHouses',	    req:{ obj2:1 }                      }))

    //--- Units
    
    class Unit extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'units', req:data.req, cost:data.cost, build:data.build }, { count:0, status:'idle', remainingTime:data.build.time })
        }
    }
    
    game.gameObjects.push(new Unit({ id:'horseman',	    req:{ horsemanStable:1 },       cost:{ gold:24, good:100 },     build:{ time:3600 } }))
    game.gameObjects.push(new Unit({ id:'spearfighter',	req:{ spearfighterBarracks:1 }, cost:{ gold:25, good:25 },      build:{ time:20 } }))
    
    //--- Territories
    
    class Territory extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'territories', req:data.req, cost:data.cost, build:data.build, max:1, gain:data.gain }, { count:0, status:'idle', remainingTime:data.build.time })
        }
    }
    /*
    game.gameObjects.push(new Territory({ id:'prov4sector1',	req:{ prov4scout:1 }, cost:{ slinger:2, spearfighter:3 },                               build:{ time:0 }, gain:{ good:100 } }))
    game.gameObjects.push(new Territory({ id:'prov4sector2',	req:{ prov4scout:1 }, cost:{ spearfighter:1, stoneThrower:2, warrior:3 },               build:{ time:0 }, gain:{ good:100 } }))
    game.gameObjects.push(new Territory({ id:'prov4sector3',	req:{ prov4scout:1 }, cost:{ horseman:1, slinger:1, spearfighter:2, stoneThrower:1 },   build:{ time:0 }, gain:{ gold:100 } }))
    game.gameObjects.push(new Territory({ id:'prov4sector4',	req:{ prov4scout:1 }, cost:{ horseman:3, slinger:1, spearfighter:1 },                   build:{ time:0 }, gain:{ good:100 } }))
    game.gameObjects.push(new Territory({ id:'prov4sector5',	req:{ prov4scout:1 }, cost:{ horseman:1, spearfighter:1, warrior:3 },                   build:{ time:0 }, gain:{ gold:100 } }))
    
    game.gameObjects.push(new Territory({ id:'prov4scout',	    req:{ prov3sector1:1, prov3sector2:1, prov3sector3:1, prov3sector4:1, prov3sector5:1 }, cost:{ gold:30 },	build:{ time:480 } }))
    
    game.gameObjects.push(new Territory({ id:'prov3sector1',	req:{ prov3scout:1 }, cost:{ spearfighter:2, stoneThrower:1, warrior:1 },               build:{ time:0 }, gain:{ gold:100 } }))
    game.gameObjects.push(new Territory({ id:'prov3sector2',	req:{ prov3scout:1 }, cost:{ slinger:2, warrior:2 },                                    build:{ time:0 }, gain:{ good:100 } }))
    game.gameObjects.push(new Territory({ id:'prov3sector3',	req:{ prov3scout:1 }, cost:{ spearfighter:1, warrior:3 },                               build:{ time:0 }, gain:{ good:100 } }))
    game.gameObjects.push(new Territory({ id:'prov3sector4',	req:{ prov3scout:1 }, cost:{ spearfighter:2, warrior:1 },                               build:{ time:0 }, gain:{ gold:100 } }))
    game.gameObjects.push(new Territory({ id:'prov3sector5',	req:{ prov3scout:1 }, cost:{ horseman:1, warrior:2 },                                   build:{ time:0 }, gain:{ gold:100 } }))
    
    game.gameObjects.push(new Territory({ id:'prov3scout',	    req:{ prov2sector1:1, prov2sector2:1, prov2sector3:1 },                                 cost:{ gold:20 },	build:{ time:420 } }))
    
    game.gameObjects.push(new Territory({ id:'prov2sector1',	req:{ prov2scout:1 }, cost:{ slinger:1, spearfighter:3 },                               build:{ time:0 }, gain:{ gold:75 } }))
    game.gameObjects.push(new Territory({ id:'prov2sector2',	req:{ prov2scout:1 }, cost:{ horseman:1, slinger:2, spearfighter:1, warrior:1 },        build:{ time:0 }, gain:{ good:75 } }))
    game.gameObjects.push(new Territory({ id:'prov2sector3',	req:{ prov2scout:1 }, cost:{ slinger:2, spearfighter:1, warrior:1 },                    build:{ time:0 }, gain:{ gold:75 } }))
    */
    
    game.gameObjects.push(new Territory({ id:'prov2scout',	    req:{ prov1sector3:1 },     cost:{ gold:10 },	                        build:{ time:420 } }))
    
    game.gameObjects.push(new Territory({ id:'prov1sector3',	req:{ prov1sector2:1 },     cost:{ spearfighter:2, horseman:1 },        build:{ time:0 }, gain:{ good:65 } }))
    game.gameObjects.push(new Territory({ id:'prov1sector2',	req:{ prov1sector1:1 },     cost:{ spearfighter:2, horseman:1 },        build:{ time:0 }, gain:{ good:60 } }))
    game.gameObjects.push(new Territory({ id:'prov1sector1',	req:{ obj6:1 },             cost:{ spearfighter:2 },                    build:{ time:0 }, gain:{ gold:50 } }))    
}