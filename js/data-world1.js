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
    game.gameCategories.push({ id:'warehouses',     req:{ growing:1 },              uiId:'warehouses',  buildIcon:'plus-circle',    tabIcon:'warehouse'     })
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

    game.gameObjects.push(new Objective({ id:'obj17',	req:{ obj16:1 },    check:{ prov2scout:1 },                             gain:{ good:300 }                   }))
    game.gameObjects.push(new Objective({ id:'obj16',	req:{ obj15:1 },    check:{ prov1sector3:1 },                           gain:{ gold:300 }                   }))
    game.gameObjects.push(new Objective({ id:'obj15',	req:{ obj14:1 },    check:{ chalets:1, stiltHouse:5, prov1sector2:1 },  gain:{ good:400 }                   }))
    game.gameObjects.push(new Objective({ id:'obj14',	req:{ obj13:1 },    check:{ construction:1 },                           gain:{ gold:350 }                   }))
    game.gameObjects.push(new Objective({ id:'obj13',	req:{ obj12:1 },    check:{ theWheel:1 },                               gain:{ good:400 }                   }))
    game.gameObjects.push(new Objective({ id:'obj12',	req:{ obj11:1 },    check:{ stiltHouse:4, pottery:1 },                  gain:{ gold:300 }                   }))
    game.gameObjects.push(new Objective({ id:'obj11',	req:{ obj10:1 },    check:{ potteryTech:1 },                            gain:{ good:200 }                   }))
    game.gameObjects.push(new Objective({ id:'obj10',	req:{ obj9:1 },     check:{ stiltHouse:3 },                             gain:{ good:300 }                   }))
    game.gameObjects.push(new Objective({ id:'obj9',	req:{ obj8:1 },     check:{ memorial:2 },                               gain:{ gold:250 }                   }))
    game.gameObjects.push(new Objective({ id:'obj8',	req:{ obj7:1 },     check:{ spearfighter:3 },                           gain:{ gold:200 }                   }))
    game.gameObjects.push(new Objective({ id:'obj7',	req:{ obj6:1 },     check:{ prov1sector1:1 },                           gain:{ spearfighter:2 }             }))
    game.gameObjects.push(new Objective({ id:'obj6',	req:{ obj5:1 },     check:{ stiltHouse:2, spearfighterBarracks:1 },     gain:{ good:200, spearfighter:2 }   }))
    game.gameObjects.push(new Objective({ id:'obj5',	req:{ obj4:1 },     check:{ spears:1 },                                 gain:{ gold:175 }                   }))
    game.gameObjects.push(new Objective({ id:'obj4',	req:{ obj3:1 },     check:{ stiltHouse:1 }                              }))
    game.gameObjects.push(new Objective({ id:'obj3',	req:{ obj2:1 },     check:{ stiltHouses:1 },                            gain:{ gold:120, good:120 }         }))
    game.gameObjects.push(new Objective({ id:'obj2',	req:{ obj1:1 },     check:{ memorial:1 }                                }))
    game.gameObjects.push(new Objective({ id:'obj1',	req:{ obj0:1 },     check:{ hut:2, hunter:1 }                           }))
    game.gameObjects.push(new Objective({ id:'obj0',	                    check:{ hut:1 }                                     }))

    //--- Houses
    
    class House extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'houses', req:data.req, cost:data.cost, build:data.build, using:data.using, gain:data.gain, prod:data.prod, deletable:true }, { count:0, status:'idle', remainingTime:data.build.time })
        }
    }

    game.gameObjects.push(new House({ id:'cottage',         req:{ cottages:1 },         cost:{ gold:250, good:890 },    build:{ time:30 },	using:{ land:4, happiness:73 },	gain:{ pop:73 },	prod:{ gold:0.007 } }))
    game.gameObjects.push(new House({ id:'roofTileHouse',   req:{ roofTileHouses:1 },   cost:{ gold:400, good:600 },    build:{ time:20 },	using:{ land:4, happiness:44 },	gain:{ pop:44 },	prod:{ gold:0.061 } }))
    
    game.gameObjects.push(new House({ id:'thatchedHouse',   req:{ thatchedHouses:1 },   cost:{ gold:160, good:300 },    build:{ time:15 },	    using:{ land:4, happiness:27 },	gain:{ pop:27 },	prod:{ gold:0.009 } }))
    game.gameObjects.push(new House({ id:'stiltHouse',	    req:{ stiltHouses:1 },      cost:{ gold:40, good:150 },	    build:{ time:15 },	    using:{ land:4, happiness:22 },	gain:{ pop:22 },	prod:{ gold:0.012 } }))
    game.gameObjects.push(new House({ id:'hut',	                                        cost:{ good:60 },	            build:{ time:5 },	    using:{ land:4, happiness:14 },	gain:{ pop:14 },	prod:{ gold:0.02 } }))
    
    //--- Prods
    
    class Prod extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'prods', req:data.req, cost:data.cost, build:data.build, using:data.using, prod:data.prod, deletable:true }, { count:0, status:'idle', remainingTime:data.build.time })
        }
    }
    
    game.gameObjects.push(new Prod({ id:'butcher',      req:{ butchery:1 },             cost:{ gold:4100, good:410 },   build:{ time:70 },	using:{ land:12, pop:66 },	prod:{ good:0.044 }     }))
    game.gameObjects.push(new Prod({ id:'goatFarm',     req:{ stockBreeding:1 },        cost:{ gold:4800, good:680 },	build:{ time:100 },	using:{ land:20, pop:122 },	prod:{ good:0.036 }     }))
    
    game.gameObjects.push(new Prod({ id:'blacksmith',   req:{ smithery:1 },             cost:{ gold:430, good:40 },	    build:{ time:20 },	using:{ land:4, pop:12 },	prod:{ good:0.009 }     }))
    game.gameObjects.push(new Prod({ id:'fruitFarm',    req:{ cultivation:1 },          cost:{ gold:1750, good:30 },	build:{ time:40 },	using:{ land:20, pop:50 },	prod:{ good:0.036 }     }))
    game.gameObjects.push(new Prod({ id:'pottery',      req:{ potteryTech:1 },          cost:{ gold:240, good:30 },	    build:{ time:20 },	    using:{ land:12, pop:41 },	prod:{ good:0.014 }     }))
    game.gameObjects.push(new Prod({ id:'hunter',	    req:{ obj0:1 },                 cost:{ gold:96 },	            build:{ time:5 },	    using:{ land:9, pop:28 },	prod:{ good:0.01 }      }))
    
    //--- Decos
    
    class Deco extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'decos', req:data.req, cost:data.cost, build:data.build, using:data.using, gain:data.gain, deletable:true }, { count:0, status:'idle', remainingTime:data.build.time })
        }
    }

    game.gameObjects.push(new Deco({ id:'fountain',	    req:{ thermae:1 },          cost:{ gold:72, good:72 },	build:{ time:5 },	using:{ land:1 },	gain:{ happiness:22 } }))
    game.gameObjects.push(new Deco({ id:'monument',	    req:{ processions:1 },      cost:{ gold:72, good:72 },	build:{ time:5 },	using:{ land:1 },	gain:{ happiness:22 } }))
    game.gameObjects.push(new Deco({ id:'flowerTub',	req:{ roofTileHouses:1 },   cost:{ gold:72, good:72 },	build:{ time:5 },	using:{ land:1 },	gain:{ happiness:22 } }))
    
    game.gameObjects.push(new Deco({ id:'hedge',	    req:{ brewing:1 },          cost:{ gold:72, good:72 },	build:{ time:5 },	using:{ land:1 },	gain:{ happiness:22 } }))
    game.gameObjects.push(new Deco({ id:'statue',	    req:{ teaching:1 },         cost:{ gold:49, good:49 },	build:{ time:5 },	using:{ land:1 },	gain:{ happiness:21 } }))
    game.gameObjects.push(new Deco({ id:'bush',	        req:{ thatchedHouses:1 },   cost:{ gold:20, good:15 },	build:{ time:5 },	using:{ land:1 },	gain:{ happiness:20 } }))
    game.gameObjects.push(new Deco({ id:'flowers',	    req:{ stiltHouses:1 },      cost:{ gold:16, good:26 },	build:{ time:5 },	using:{ land:1 },	gain:{ happiness:20 } }))
    game.gameObjects.push(new Deco({ id:'memorial',	    req:{ obj1:1 },             cost:{ gold:20, good:20 },	build:{ time:2 },	using:{ land:4 },	gain:{ happiness:72 } }))
    
    //--- Cultures
    
    class Culture extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'cultures', req:data.req, cost:data.cost, build:data.build, using:data.using, gain:data.gain, deletable:true }, { count:0, status:'idle', remainingTime:data.build.time })
        }
    }

    game.gameObjects.push(new Culture({ id:'publicBath',	    req:{ thermae:1 },          cost:{ gold:6000, good:3700 },  build:{ time:110 },    using:{ land:24 },      gain:{ happiness:570 } }))
    game.gameObjects.push(new Culture({ id:'triumphalArch',	    req:{ processions:1 },      cost:{ gold:1900, good:1400 },  build:{ time:60 },    using:{ land:6 },       gain:{ happiness:190 } }))
    
    game.gameObjects.push(new Culture({ id:'tavern',	        req:{ brewing:1 },          cost:{ gold:2900, good:440 },   build:{ time:40 },    using:{ land:9 },       gain:{ happiness:280 } }))
    game.gameObjects.push(new Culture({ id:'school',	        req:{ teaching:1 },         cost:{ gold:1500, good:290 },   build:{ time:30 },    using:{ land:9 },       gain:{ happiness:240 } }))
    game.gameObjects.push(new Culture({ id:'stoneCircle',	    req:{ construction:1 },     cost:{ gold:780, good:140 },    build:{ time:10 },     using:{ land:9 },       gain:{ happiness:182 } }))

    //--- Barracks
    
    class Barrack extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'barracks', req:data.req, cost:data.cost, build:data.build, using:data.using, storage:data.storage, deletable:true }, { count:0, status:'idle', remainingTime:data.build.time })
        }
    }

    game.gameObjects.push(new Barrack({ id:'ballistaCamp',	        req:{ mathematics:1 },      cost:{ gold:7040, good:5050 },  build:{ time:110 },	using:{ land:12, pop:170 }, storage:{ ballista:4 } }))
    game.gameObjects.push(new Barrack({ id:'legionnaireBarracks',   req:{ chainOfCommand:1 },   cost:{ gold:5630, good:4040 },  build:{ time:100 },	using:{ land:9, pop:144 },  storage:{ legionnaire:4 } }))
    game.gameObjects.push(new Barrack({ id:'mountedWarriorStable',  req:{ militaryTactics:1 },  cost:{ gold:4220, good:3030 },  build:{ time:90 },	using:{ land:12, pop:170 }, storage:{ mountedWarrior:4 } }))
    game.gameObjects.push(new Barrack({ id:'archeryRange',	        req:{ archery:1 },          cost:{ gold:2820, good:2020 },  build:{ time:80 },	using:{ land:4, pop:105 },  storage:{ archer:4 } }))
    game.gameObjects.push(new Barrack({ id:'soldierBarracks',	    req:{ militia:1 },          cost:{ gold:1410, good:1010 },  build:{ time:70 },	using:{ land:6, pop:79 },   storage:{ soldier:4 } }))
    
    game.gameObjects.push(new Barrack({ id:'throwerCamp',	        req:{ siegeWeapons:1 },     cost:{ gold:1080, good:700 },   build:{ time:40 },	using:{ land:9, pop:56 },   storage:{ stoneThrower:4 } }))
    game.gameObjects.push(new Barrack({ id:'warriorBarracks',	    req:{ phalanx:1 },          cost:{ gold:850, good:560 },    build:{ time:40 },	using:{ land:9, pop:47 },   storage:{ warrior:4 } }))
    game.gameObjects.push(new Barrack({ id:'horsemanStable',	    req:{ horsebackRiding:1 },  cost:{ gold:640, good:420 },    build:{ time:30 },	using:{ land:9, pop:56 },   storage:{ horseman:4 } }))
    game.gameObjects.push(new Barrack({ id:'slingerRange',	        req:{ slingshots:1 },       cost:{ gold:430 },              build:{ time:30 },	using:{ land:6, pop:34 },   storage:{ slinger:4 } }))
    game.gameObjects.push(new Barrack({ id:'spearfighterBarracks',	req:{ spears:1 },           cost:{ gold:170, good:110 },    build:{ time:20 },	    using:{ land:9, pop:26 },   storage:{ spearfighter:4 } }))
    
    //--- Warehouses
    
    class Warehouse extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'warehouses', req:data.req, cost:data.cost, build:data.build, using:data.using, deletable:true, storage:data.storage }, { count:0, status:'idle', remainingTime:data.build.time })
        }
    }
    
    game.gameObjects.push(new Warehouse({ id:'limestoneMason',	    req:{ processing:1 },       cost:{ gold:1500, good:2400 },  build:{ time:70 },	using:{ land:16, pop:230 },     storage:{ limestone:6 } }))
    game.gameObjects.push(new Warehouse({ id:'weavingMill',	        req:{ handicraft:1 },       cost:{ gold:1500, good:2400 },  build:{ time:70 },	using:{ land:12, pop:230 },     storage:{ cloth:6 } }))
    game.gameObjects.push(new Warehouse({ id:'ironFoundry',	        req:{ ironWorks:1 },        cost:{ gold:1500, good:2400 },  build:{ time:70 },	using:{ land:9, pop:230 },      storage:{ iron:6 } }))
    game.gameObjects.push(new Warehouse({ id:'jewelryManufacturer', req:{ handicraft:1 },       cost:{ gold:1500, good:2400 },  build:{ time:70 },	using:{ land:12, pop:230 },     storage:{ jewelry:6 } }))
    game.gameObjects.push(new Warehouse({ id:'ebonyWoodworks',	    req:{ processing:1 },       cost:{ gold:1500, good:2400 },  build:{ time:70 },	using:{ land:16, pop:230 },     storage:{ ebony:6 } }))
    
    game.gameObjects.push(new Warehouse({ id:'lumbermill',	        req:{ woodwork:1 },         cost:{ gold:340, good:490 },  build:{ time:30 },	    using:{ land:9, pop:108 },      storage:{ lumber:6 } }))
    game.gameObjects.push(new Warehouse({ id:'marbleMason',	        req:{ stonework:1 },        cost:{ gold:340, good:490 },  build:{ time:30 },	    using:{ land:9, pop:108 },      storage:{ marble:6 } }))
    game.gameObjects.push(new Warehouse({ id:'stoneMason',	        req:{ stonework:1 },        cost:{ gold:340, good:490 },  build:{ time:30 },	    using:{ land:9, pop:108 },      storage:{ stone:6 } }))
    game.gameObjects.push(new Warehouse({ id:'dyeWorks',	        req:{ growing:1 },          cost:{ gold:340, good:490 },  build:{ time:30 },	    using:{ land:9, pop:108 },      storage:{ dye:6 } }))
    game.gameObjects.push(new Warehouse({ id:'vineyard',	        req:{ growing:1 },          cost:{ gold:340, good:490 },  build:{ time:30 },	    using:{ land:9, pop:108 },      storage:{ wine:6 } }))
    
    //--- Goods
    
    class Good extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'goods', req:data.req, cost:data.cost, build:data.build }, { count:0, status:'idle', remainingTime:data.build.time })
        }
    }
    
    game.gameObjects.push(new Good({ id:'limestone',	req:{ limestoneMason:1 },       cost:{ gold:200, good:2000 },  build:{ time:240 } }))
    game.gameObjects.push(new Good({ id:'cloth',	    req:{ weavingMill:1 },          cost:{ gold:200, good:2000 },  build:{ time:240 } }))
    game.gameObjects.push(new Good({ id:'iron',	        req:{ ironFoundry:1 },          cost:{ gold:200, good:2000 },  build:{ time:240 } }))
    game.gameObjects.push(new Good({ id:'jewelry',	    req:{ jewelryManufacturer:1 },  cost:{ gold:200, good:2000 },  build:{ time:240 } }))
    game.gameObjects.push(new Good({ id:'ebony',	    req:{ ebonyWoodworks:1 },       cost:{ gold:200, good:2000 },  build:{ time:240 } }))
    
    game.gameObjects.push(new Good({ id:'lumber',	    req:{ lumbermill:1 },           cost:{ gold:100, good:100 },  build:{ time:240 } }))
    game.gameObjects.push(new Good({ id:'marble',	    req:{ marbleMason:1 },          cost:{ gold:100, good:100 },  build:{ time:240 } }))
    game.gameObjects.push(new Good({ id:'stone',	    req:{ stoneMason:1 },           cost:{ gold:100, good:100 },  build:{ time:240 } }))
    game.gameObjects.push(new Good({ id:'dye',	        req:{ dyeWorks:1 },             cost:{ gold:100, good:100 },  build:{ time:240 } }))
    game.gameObjects.push(new Good({ id:'wine',	        req:{ vineyard:1 },             cost:{ gold:100, good:100 },  build:{ time:240 } }))
    
    //--- Techs
    
    class Tech extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'techs', req:data.req, cost:data.cost, build:{ time:0 }, max:1, gain:data.gain }, { count:0, status:'idle', remainingTime:0 })
        }
    }
    
    game.gameObjects.push(new Tech({ id:'chainOfCommand',   req:{ fortification:1 },                        cost:{ gold:600, good:1100, wine:50, jewelry:16 }   }))
    game.gameObjects.push(new Tech({ id:'plowing',          req:{ fortification:1 },                        cost:{ lumber:30, iron:13 },                        gain:{ land:16} }))
    game.gameObjects.push(new Tech({ id:'thermae',          req:{ militaryTactics:1, fortification:1 },     cost:{ gold:600, good:750, marble:21, cloth:11 }    }))
    game.gameObjects.push(new Tech({ id:'mathematics',      req:{ butchery:1, militaryTactics:1 },          cost:{ gold:2000, good:1500 }                       }))
    game.gameObjects.push(new Tech({ id:'fortification',    req:{ cottages:1, archery:1 },                  cost:{ good:1400, stone:20, ebony:4 },              gain:{ land:16} }))
    game.gameObjects.push(new Tech({ id:'militaryTactics',  req:{ cottages:1, archery:1 },                  cost:{ gold:1500, good:2000 }                       }))
    game.gameObjects.push(new Tech({ id:'butchery',         req:{ cottages:1 },                             cost:{ gold:100, good:2500 }                        }))
    game.gameObjects.push(new Tech({ id:'sewerage',         req:{ ironWorks:1, handicraft:1 },              cost:{ good:750, dye:15, limestone:3 },             gain:{ land:16} }))
    game.gameObjects.push(new Tech({ id:'archery',          req:{ processions:1, processing:1 },            cost:{ marble:16 }                                  }))
    game.gameObjects.push(new Tech({ id:'cottages',         req:{ stockBreeding:1, processions:1 },         cost:{ gold:600, good:1250 }                        }))
    game.gameObjects.push(new Tech({ id:'agriculture',      req:{ stockBreeding:1 },                        cost:{ lumber:30 },                                 gain:{ land:16} }))
    game.gameObjects.push(new Tech({ id:'handicraft',       req:{ militia:1 },                              cost:{ gold:1500 }                                  }))
    game.gameObjects.push(new Tech({ id:'ironWorks',        req:{ militia:1 },                              cost:{ good:1500 }                                  }))
    game.gameObjects.push(new Tech({ id:'processing',       req:{ architecture:1, militia:1 },              cost:{ gold:600 }                                   }))
    game.gameObjects.push(new Tech({ id:'processions',      req:{ roofTileHouses:1, architecture:1 },       cost:{ dye:12 }                                     }))
    game.gameObjects.push(new Tech({ id:'stockBreeding',    req:{ roofTileHouses:1 },                       cost:{ gold:300, good:250 }                         }))
    game.gameObjects.push(new Tech({ id:'militia',          req:{ brewing:1, manuring:1 },                  cost:{ wine:8 }                                     }))
    game.gameObjects.push(new Tech({ id:'architecture',     req:{ siegeWeapons:1, brewing:1 },              cost:{ stone:5 },                                   gain:{ land:16} }))
    game.gameObjects.push(new Tech({ id:'roofTileHouses',   req:{ paths:1, siegeWeapons:1 },                cost:{ gold:250, good:100 }                         }))
    
    game.gameObjects.push(new Tech({ id:'manuring',         req:{ teaching:1 },                             cost:{ good:300 },                                  gain:{ land:16} }))
    game.gameObjects.push(new Tech({ id:'brewing',          req:{ smithery:1, teaching:1 },                 cost:{ gold:150, good:150 }                         }))
    game.gameObjects.push(new Tech({ id:'siegeWeapons',     req:{ phalanx:1, smithery:1 },                  cost:{ gold:500 }                                   }))
    game.gameObjects.push(new Tech({ id:'paths',            req:{ phalanx:1 },                              cost:{ good:100 }                                   }))
    game.gameObjects.push(new Tech({ id:'craftwork',        req:{ stonework:1, woodwork:1 },                cost:{ marble:2, lumber:2 },                        gain:{ land:16} }))
    game.gameObjects.push(new Tech({ id:'teaching',         req:{ thatchedHouses:1 },                       cost:{ gold:200, good:50 }                          }))
    game.gameObjects.push(new Tech({ id:'smithery',         req:{ thatchedHouses:1 },                       cost:{ gold:350 }                                   }))
    game.gameObjects.push(new Tech({ id:'phalanx',          req:{ horsebackRiding:1, thatchedHouses:1 },    cost:{ good:200 }                                   }))
    game.gameObjects.push(new Tech({ id:'woodwork',         req:{ tools:1 },                                cost:{ gold:200, good:100 }                         }))
    game.gameObjects.push(new Tech({ id:'stonework',        req:{ tools:1 },                                cost:{ good:500 }                                   }))
    game.gameObjects.push(new Tech({ id:'thatchedHouses',   req:{ cultivation:1 },                          cost:{ gold:150, good:200 }                         }))
    game.gameObjects.push(new Tech({ id:'horsebackRiding',  req:{ chalets:1, slingshots:1 },                cost:{ gold:250 }                                   }))
    game.gameObjects.push(new Tech({ id:'growing',          req:{ chalets:1 },                              cost:{ good:300 }                                   }))
    game.gameObjects.push(new Tech({ id:'tools',            req:{ construction:1 },                         cost:{ good:100 },                                  gain:{ land:16} }))
    game.gameObjects.push(new Tech({ id:'cultivation',      req:{ theWheel:1, construction:1 },             cost:{ gold:200, good:100 }                         }))
    game.gameObjects.push(new Tech({ id:'chalets',          req:{ construction:1 },                         cost:{ gold:100, good:200 }                         }))
    game.gameObjects.push(new Tech({ id:'slingshots',       req:{ theWheel:1 },                             cost:{ gold:200 }                                   }))
    game.gameObjects.push(new Tech({ id:'construction',     req:{ potteryTech:1, spears:1 }                 }))    
    game.gameObjects.push(new Tech({ id:'theWheel',         req:{ stiltHouses:1, spears:1 },                                                                    gain:{ land:16} }))
    game.gameObjects.push(new Tech({ id:'potteryTech',      req:{ obj10:1 }                                 }))    
    game.gameObjects.push(new Tech({ id:'spears',	        req:{ obj4:1 }                                  }))
    game.gameObjects.push(new Tech({ id:'stiltHouses',	    req:{ obj2:1 }                                  }))

    //--- Units
    
    class Unit extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'units', req:data.req, cost:data.cost, build:data.build }, { count:0, status:'idle', remainingTime:data.build.time })
        }
    }
    
    game.gameObjects.push(new Unit({ id:'ballista',	        req:{ ballistaCamp:1 },         cost:{ good:250 },              build:{ time:90 } }))
    game.gameObjects.push(new Unit({ id:'legionnaire',	    req:{ legionnaireBarracks:1 },  cost:{ gold:230 },              build:{ time:90 } }))
    game.gameObjects.push(new Unit({ id:'mountedWarrior',   req:{ mountedWarriorStable:1 }, cost:{ gold:40, good:180 },     build:{ time:90 } }))
    game.gameObjects.push(new Unit({ id:'archer',	        req:{ archeryRange:1 },         cost:{ gold:170, good:40 },     build:{ time:90 } }))
    game.gameObjects.push(new Unit({ id:'soldier',	        req:{ soldierBarracks:1 },      cost:{ gold:100, good:100 },    build:{ time:90 } }))
    
    game.gameObjects.push(new Unit({ id:'stoneThrower',	    req:{ throwerCamp:1 },          cost:{ good:180 },              build:{ time:60 } }))
    game.gameObjects.push(new Unit({ id:'warrior',	        req:{ warriorBarracks:1 },      cost:{ gold:160 },              build:{ time:60 } }))
    game.gameObjects.push(new Unit({ id:'horseman',	        req:{ horsemanStable:1 },       cost:{ gold:24, good:100 },     build:{ time:60 } }))
    game.gameObjects.push(new Unit({ id:'slinger',	        req:{ slingerRange:1 },         cost:{ gold:60, good:15 },      build:{ time:60 } }))
    game.gameObjects.push(new Unit({ id:'spearfighter',	    req:{ spearfighterBarracks:1 }, cost:{ gold:25, good:25 },      build:{ time:20 } }))
    
    //--- Territories
    
    class Territory extends GameObject {        
        constructor(data) {
            super({ id:data.id, uiId:'territories', req:data.req, cost:data.cost, build:data.build, max:1, gain:data.gain }, { count:0, status:'idle', remainingTime:data.build.time })
        }
    }
    
    game.gameObjects.push(new Territory({ id:'prov11sector3',	req:{ prov11sector2:1 },    cost:{ soldier:3, ballista:2, mountedWarrior:3 },                           build:{ time:0 }, gain:{ gold:400 } }))
    game.gameObjects.push(new Territory({ id:'prov11sector2',	req:{ prov11sector1:1 },    cost:{ ballista:3, mountedWarrior:5 },                                      build:{ time:0 }, gain:{ good:400 } }))
    game.gameObjects.push(new Territory({ id:'prov11sector1',	req:{ prov11scout:1 },      cost:{ soldier:2, ballista:1, mountedWarrior:1, legionnaire:3, archer:1 },  build:{ time:0 }, gain:{ gold:400 } }))    
    game.gameObjects.push(new Territory({ id:'prov11scout',	    req:{ prov10sector6:1 },    cost:{ gold:830 },	                                                        build:{ time:2400 } }))
    
    game.gameObjects.push(new Territory({ id:'prov10sector6',	req:{ prov10sector5:1 },    cost:{ soldier:3, legionnaire:2, archer:3 },                                build:{ time:0 }, gain:{ gold:400 } }))
    game.gameObjects.push(new Territory({ id:'prov10sector5',	req:{ prov10sector4:1 },    cost:{ soldier:1, legionnaire:6, archer:1 },                                build:{ time:0 }, gain:{ good:400 } }))
    game.gameObjects.push(new Territory({ id:'prov10sector4',	req:{ prov10sector3:1 },    cost:{ soldier:3, mountedWarrior:2, legionnaire:1, archer:1 },              build:{ time:0 }, gain:{ good:400 } }))
    game.gameObjects.push(new Territory({ id:'prov10sector3',	req:{ prov10sector2:1 },    cost:{ soldier:1, mountedWarrior:2, legionnaire:3, archer:1 },              build:{ time:0 }, gain:{ gold:400 } }))
    game.gameObjects.push(new Territory({ id:'prov10sector2',	req:{ prov10sector1:1 },    cost:{ soldier:2, mountedWarrior:2, legionnaire:4 },                        build:{ time:0 }, gain:{ gold:400 } }))
    game.gameObjects.push(new Territory({ id:'prov10sector1',	req:{ prov10scout:1 },      cost:{ ballista:2, mountedWarrior:2, legionnaire:4 },                       build:{ time:0 }, gain:{ good:400 } }))    
    game.gameObjects.push(new Territory({ id:'prov10scout',	    req:{ prov9sector5:1 },     cost:{ gold:790 },	                                                        build:{ time:2040 } }))
    
    game.gameObjects.push(new Territory({ id:'prov9sector5',	req:{ prov9sector4:1 },     cost:{ soldier:5, ballista:2 },                                             build:{ time:0 }, gain:{ gold:400 } }))
    game.gameObjects.push(new Territory({ id:'prov9sector4',	req:{ prov9sector3:1 },     cost:{ soldier:3, ballista:1, mountedWarrior:1, legionnaire:2 },            build:{ time:0 }, gain:{ good:400 } }))
    game.gameObjects.push(new Territory({ id:'prov9sector3',	req:{ prov9sector2:1 },     cost:{ soldier:2, mountedWarrior:2, legionnaire:3 },                        build:{ time:0 }, gain:{ gold:400 } }))
    game.gameObjects.push(new Territory({ id:'prov9sector2',	req:{ prov9sector1:1 },     cost:{ soldier:3, mountedWarrior:1, legionnaire:2, archer:1 },              build:{ time:0 }, gain:{ gold:400 } }))
    game.gameObjects.push(new Territory({ id:'prov9sector1',	req:{ prov9scout:1 },       cost:{ soldier:4, ballista:3 },                                             build:{ time:0 }, gain:{ good:400 } }))    
    game.gameObjects.push(new Territory({ id:'prov9scout',	    req:{ prov8sector5:1 },     cost:{ gold:750 },	                                                        build:{ time:1680 } }))
    
    game.gameObjects.push(new Territory({ id:'prov8sector5',	req:{ prov8sector4:1 },     cost:{ mountedWarrior:3, legionnaire:3, soldier:1 },                        build:{ time:0 }, gain:{ good:400 } }))
    game.gameObjects.push(new Territory({ id:'prov8sector4',	req:{ prov8sector3:1 },     cost:{ archer:1, mountedWarrior:2, soldier:4 },                             build:{ time:0 }, gain:{ gold:400 } }))
    game.gameObjects.push(new Territory({ id:'prov8sector3',	req:{ prov8sector2:1 },     cost:{ legionnaire:2, mountedWarrior:4, soldier:1 },                        build:{ time:0 }, gain:{ good:400 } }))
    game.gameObjects.push(new Territory({ id:'prov8sector2',	req:{ prov8sector1:1 },     cost:{ archer:2, ballista:1, soldier:5 },                                   build:{ time:0 }, gain:{ good:400 } }))
    game.gameObjects.push(new Territory({ id:'prov8sector1',	req:{ prov8scout:1 },       cost:{ archer:2, legionnaire:4, soldier:1 },                                build:{ time:0 }, gain:{ gold:400 } }))    
    game.gameObjects.push(new Territory({ id:'prov8scout',	    req:{ prov7sector5:1 },     cost:{ gold:720 },	                                                        build:{ time:1320 } }))
    
    game.gameObjects.push(new Territory({ id:'prov7sector5',	req:{ prov7sector4:1 },     cost:{ ballista:2, soldier:5 },                                             build:{ time:0 }, gain:{ gold:400 } }))
    game.gameObjects.push(new Territory({ id:'prov7sector4',	req:{ prov7sector3:1 },     cost:{ archer:2, legionnaire:1, soldier:4 },                                build:{ time:0 }, gain:{ good:400 } }))
    game.gameObjects.push(new Territory({ id:'prov7sector3',	req:{ prov7sector2:1 },     cost:{ archer:2, soldier:4 },                                               build:{ time:0 }, gain:{ gold:400 } }))
    game.gameObjects.push(new Territory({ id:'prov7sector2',	req:{ prov7sector1:1 },     cost:{ mountedWarrior:4, soldier:2 },                                       build:{ time:0 }, gain:{ good:400 } }))
    game.gameObjects.push(new Territory({ id:'prov7sector1',	req:{ prov7scout:1 },       cost:{ archer:2, legionnaire:3, soldier:2 },                                build:{ time:0 }, gain:{ good:400 } }))    
    game.gameObjects.push(new Territory({ id:'prov7scout',	    req:{ prov6sector4:1 },     cost:{ gold:680 },	                                                        build:{ time:960 } }))
    
    game.gameObjects.push(new Territory({ id:'prov6sector4',	req:{ prov6sector3:1 },     cost:{ legionnaire:2, mountedWarrior:2, soldier:1 },                        build:{ time:0 }, gain:{ gold:400 } }))
    game.gameObjects.push(new Territory({ id:'prov6sector3',	req:{ prov6sector2:1 },     cost:{ archer:3, mountedWarrior:2 },                                        build:{ time:0 }, gain:{ good:400 } }))
    game.gameObjects.push(new Territory({ id:'prov6sector2',	req:{ prov6sector1:1 },     cost:{ archer:1, legionnaire:2, soldier:3 },                                build:{ time:0 }, gain:{ good:400 } }))
    game.gameObjects.push(new Territory({ id:'prov6sector1',	req:{ prov6scout:1 },       cost:{ ballista:3, legionnaire:1, soldier:2 },                              build:{ time:0 }, gain:{ good:400 } }))    
    game.gameObjects.push(new Territory({ id:'prov6scout',	    req:{ prov5sector5:1 },     cost:{ gold:640 },	                                                        build:{ time:600 } }))
    
    game.gameObjects.push(new Territory({ id:'prov5sector5',	req:{ prov5sector4:1 },     cost:{ archer:2, mountedWarrior:3 },                                        build:{ time:0 }, gain:{ good:400 } }))
    game.gameObjects.push(new Territory({ id:'prov5sector4',	req:{ prov5sector3:1 },     cost:{ mountedWarrior:3, soldier:3 },                                       build:{ time:0 }, gain:{ gold:400 } }))
    game.gameObjects.push(new Territory({ id:'prov5sector3',	req:{ prov5sector2:1 },     cost:{ archer:2, soldier:3 },                                               build:{ time:0 }, gain:{ gold:400 } }))
    game.gameObjects.push(new Territory({ id:'prov5sector2',	req:{ prov5sector1:1 },     cost:{ mountedWarrior:2, soldier:3 },                                       build:{ time:0 }, gain:{ good:400 } }))
    game.gameObjects.push(new Territory({ id:'prov5sector1',	req:{ prov5scout:1 },       cost:{ archer:2, ballista:3, mountedWarrior:1, soldier:1 },                 build:{ time:0 }, gain:{ good:400 } }))    
    game.gameObjects.push(new Territory({ id:'prov5scout',	    req:{ prov4sector5:1 },     cost:{ gold:600 },	                                                        build:{ time:600 } }))

    game.gameObjects.push(new Territory({ id:'prov4sector5',	req:{ prov4sector4:1 },     cost:{ horseman:1, spearfighter:1, warrior:3 },                             build:{ time:0 }, gain:{ gold:100 } }))
    game.gameObjects.push(new Territory({ id:'prov4sector4',	req:{ prov4sector3:1 },     cost:{ horseman:3, slinger:1, spearfighter:1 },                             build:{ time:0 }, gain:{ good:100 } }))
    game.gameObjects.push(new Territory({ id:'prov4sector3',	req:{ prov4sector2:1 },     cost:{ horseman:1, slinger:1, spearfighter:2, stoneThrower:1 },             build:{ time:0 }, gain:{ gold:100 } }))
    game.gameObjects.push(new Territory({ id:'prov4sector2',	req:{ prov4sector1:1 },     cost:{ spearfighter:1, stoneThrower:2, warrior:3 },                         build:{ time:0 }, gain:{ good:100 } }))
    game.gameObjects.push(new Territory({ id:'prov4sector1',	req:{ prov4scout:1 },       cost:{ slinger:2, spearfighter:3 },                                         build:{ time:0 }, gain:{ good:100 } }))    
    game.gameObjects.push(new Territory({ id:'prov4scout',	    req:{ prov3sector5:1 },     cost:{ gold:30 },	                                                        build:{ time:480 } }))
    
    game.gameObjects.push(new Territory({ id:'prov3sector5',	req:{ prov3sector4:1 },     cost:{ horseman:1, warrior:2 },                                             build:{ time:0 }, gain:{ gold:100 } }))
    game.gameObjects.push(new Territory({ id:'prov3sector4',	req:{ prov3sector3:1 },     cost:{ spearfighter:2, warrior:1 },                                         build:{ time:0 }, gain:{ gold:100 } }))
    game.gameObjects.push(new Territory({ id:'prov3sector3',	req:{ prov3sector2:1 },     cost:{ spearfighter:1, warrior:3 },                                         build:{ time:0 }, gain:{ good:100 } }))
    game.gameObjects.push(new Territory({ id:'prov3sector2',	req:{ prov3sector1:1 },     cost:{ slinger:2, warrior:2 },                                              build:{ time:0 }, gain:{ good:100 } }))
    game.gameObjects.push(new Territory({ id:'prov3sector1',	req:{ prov3scout:1 },       cost:{ spearfighter:2, stoneThrower:1, warrior:1 },                         build:{ time:0 }, gain:{ gold:100 } }))    
    game.gameObjects.push(new Territory({ id:'prov3scout',	    req:{ prov2sector3:1 },     cost:{ gold:20 },	                                                        build:{ time:420 } }))
    
    game.gameObjects.push(new Territory({ id:'prov2sector3',	req:{ prov2sector2:1 },     cost:{ slinger:2, spearfighter:1, warrior:1 },                              build:{ time:0 }, gain:{ gold:75 } }))
    game.gameObjects.push(new Territory({ id:'prov2sector2',	req:{ prov2sector1:1 },     cost:{ horseman:1, slinger:2, spearfighter:1, warrior:1 },                  build:{ time:0 }, gain:{ good:75 } }))
    game.gameObjects.push(new Territory({ id:'prov2sector1',	req:{ prov2scout:1 },       cost:{ slinger:1, spearfighter:3 },                                         build:{ time:0 }, gain:{ gold:75 } }))    
    game.gameObjects.push(new Territory({ id:'prov2scout',	    req:{ prov1sector3:1 },     cost:{ gold:10 },	                                                        build:{ time:420 } }))
    
    game.gameObjects.push(new Territory({ id:'prov1sector3',	req:{ prov1sector2:1 },     cost:{ spearfighter:2, horseman:1 },                                        build:{ time:0 }, gain:{ good:65 } }))
    game.gameObjects.push(new Territory({ id:'prov1sector2',	req:{ prov1sector1:1 },     cost:{ spearfighter:2, horseman:1 },                                        build:{ time:0 }, gain:{ good:60 } }))
    game.gameObjects.push(new Territory({ id:'prov1sector1',	req:{ obj6:1 },             cost:{ spearfighter:2 },                                                    build:{ time:0 }, gain:{ gold:50 } }))    
}