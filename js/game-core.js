//===

class GameObject {

    constructor(staticData, dataToSave) {
        
        if (staticData) {
            
            let names = Object.getOwnPropertyNames(staticData)
            names.forEach(name => { Object.defineProperty(this, name, Object.getOwnPropertyDescriptor(staticData, name)) })
        }
        
        if (dataToSave) {
            
            this.dataToSave = dataToSave
            
            let names = Object.getOwnPropertyNames(dataToSave)
            names.forEach(name => { Object.defineProperty(this, name, Object.getOwnPropertyDescriptor(dataToSave, name)) })
        }

        this.unlocks = []
        
        this.users = []
        this.storers = []
        this.producers = []
    }
    
    //---
    
    onLoad(data) {
        
        if (!this.dataToSave) { return }
        
        if (data[this.id]) {
            
            let names = Object.getOwnPropertyNames(this.dataToSave)
            names.forEach(name => { if (data[this.id][name]) { this[name] = data[this.id][name] } })
        }
    }
    
    onSave() {
        
        if (!this.dataToSave) { return }
        
        let ret = {}
        
        let names = Object.getOwnPropertyNames(this.dataToSave)
        names.forEach(name => { ret[name] = this[name] })
        
        return ret
    }

    //---
    
    get production() {
        
        if (this.producers.length < 1) { return null }
        
        let ret = 0
        this.producers.forEach(producer => {
            ret += producer.count * producer.prod[this.id]
        })
        
        return ret
    }

    get stock() {
        
        if (this.storers.length < 1) { return Infinity }
        
        let ret = 0
        this.storers.forEach(storer => {
            ret += storer.count * storer.storage[this.id]
        })
        
        return ret
    }

    get usage() {
        
        if (this.users.length < 1) { return 0 }
        
        let ret = 0
        this.users.forEach(user => {
            ret += user.count * user.using[this.id]
            if (user.status == 'building') { ret += user.using[this.id] }
        })
        
        return ret
    }

    //---

    get isUnlocked() {
        
        if (!this.req) { return true }
        
        for (let reqId in this.req) {
            if (game.obj(reqId).count < this.req[reqId]) { return false }
        }
        
        return true
    }
    
    //---
    
    get availableCount() { return this.count - this.usage }
    
    get buildingProgress() {
        
        if (this.status != 'building') { return 0 }
        
        let ret = 100 - Math.round((100 * this.remainingTime / this.build.time) + Number.EPSILON)        
        return ret
    }
}

//===

class Game {

    constructor() {
        
        this.fps = 60
        this.locale = 'en'
        this.paused = false
        this.worldId = 'world1'
        this.rafHandle = null
        this.timePlayed = 0
        this.saveInterval = null
        this.autoSaveDelay = 30000
        this.resetInProgress = false
        this.lastFrameTimeMs = new Date().getTime()
        this.localStorageName = 'fgciv'
        
        this.gameObjects = []
        this.gameCategories = []
        
        this.resources = []
        this.houses = []
        this.prods = []
        this.decos = []
        this.barracks = []
        this.goods = []
        this.techs = []
        this.units = []
        this.territories = []
        this.objectives = []
    }
    
    //---
    
    obj(objId) { return game.gameObjects.find(obj => obj.id == objId) }

    //---
    
    start() {
    
        document.addEventListener('DOMContentLoaded', function(e) {
            
            let defaultLocale = trans.supportedOrDefault(trans.browserLocales())
            trans.setLocale(defaultLocale)
            
            game.loadData()

            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
            const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
            
            game.rafHandle = requestAnimationFrame(game.loop)
            game.saveInterval = setInterval(() => { game.saveData() }, game.autoSaveDelay)
        })
        
        window.onbeforeunload = () => {
            
            if (!this.resetInProgress) { this.saveData() }
            
            clearInterval(this.saveInterval)
            cancelAnimationFrame(this.rafHandle)
        }
    }

    //---
    
    loop() {

        game.rafHandle = requestAnimationFrame(game.loop)
        
        let currentTimeMs = new Date().getTime()
        
        let deltaTimeMs = currentTimeMs - game.lastFrameTimeMs
        if (deltaTimeMs >= 1000 / game.fps) {            
        
            game.lastFrameTimeMs = currentTimeMs
            
            if (game.paused) return
            
            let elapsedSeconds = deltaTimeMs / 1000            
            game.timePlayed += elapsedSeconds
            
            game.update(elapsedSeconds)
            
            game.refreshPage()
        }
    }

    update(elapsedSeconds) {
        
        this.gameObjects.forEach(obj => {
            
            if (obj.producers.length > 0) { obj.count += obj.production * elapsedSeconds }
            
            if (obj.status && obj.status == 'building') {
                
                obj.remainingTime -= elapsedSeconds
                
                if (obj.remainingTime <= 0) {
                    
                    obj.count += 1
                    obj.status = 'idle'
                    obj.remainingTime = obj.build.time
                    
                    if (obj.gain) {
                        for (let gainId in obj.gain) {
                            game.obj(gainId).count += obj.gain[gainId]
                        }
                    }
                }
            }
        })
    }

    refreshPage() {    
        
        //--- displaying objects

        ui.findAll('[data-show]').forEach(elem => {
            
            let attr = elem.getAttribute('data-show')
            let display = elem.style.display
            
            let catId = ui.dataset(elem, 'cat')
            if (catId) {
                
                if (attr == 'unlocked') {
                    
                    let cat = game.gameCategories.find(elem => elem.id == catId)
                    let unlocked = true
                    
                    if (cat.req) {                    
                        for (let reqId in cat.req) {
                            if (game.obj(reqId).count < cat.req[reqId]) {
                                
                                unlocked = false
                                break
                            }
                        }
                    }

                    if (unlocked == true) { display = 'block' }
                    else { display = 'none' }
                }
            }
            else {
                
                let objId = ui.dataset(elem, 'object')
                if (objId) {
                    
                    if (attr == 'unlocked') {
                        
                        let data = game.obj(objId).count

                        if (game.obj(objId).isUnlocked == true) { display = 'block' }
                        else { display = 'none' }
                    }
                    else if (attr == 'unlockedNotBuilt') {
                        
                        let data = game.obj(objId).count
                        
                        if (game.obj(objId).isUnlocked == true && data < 1) { display = 'block' }
                        else { display = 'none' }
                    }
                    else if (attr == 'unlockedBuilt') {
                        
                        let data = game.obj(objId).count

                        if (game.obj(objId).isUnlocked == true && data > 0) { display = 'block' }
                        else { display = 'none' }
                    }
                    else if (attr == 'statusIdle') {
                        
                        let data = game.obj(objId).status
                        
                        if (data == 'idle') { display = 'block' }
                        else { display = 'none' }
                    }
                    else if (attr == 'statusBuilding') {
                        
                        let data = game.obj(objId).status
                        
                        if (data == 'building') { display = 'block' }
                        else { display = 'none' }
                    }
                    else if (attr == 'tabNoContent') {
                        
                        let unlocked = game.gameCategories.find(elem => elem.uiId == objId).objects.filter(elem => elem.isUnlocked == true).filter(elem => !elem.max || elem.count < elem.max)
                        
                        if (unlocked.length < 1) { display = 'block' }
                        else { display = 'none' }
                    }
                }
            }
            
            if (elem.style.display != display) { elem.style.display = display }
        })
        
        //--- enabling/disabling buttons
        
        ui.findAll('[data-check]').forEach(elem => {
            
            let attr = elem.getAttribute('data-check')
            let objId = ui.dataset(elem, 'object')            
            let disabled = elem.disabled
            
            if (attr == 'canBuild') { disabled = !canBuild(objId) }
            else if (attr == 'canDelete') { disabled = !canDelete(objId) }
            else if (attr == 'canCheck') { disabled = !canCheck(objId) }
            
            if (elem.disabled != disabled) { elem.disabled = disabled }
        })
        
        //--- displaying data
        
        ui.findAll('[data-display]').forEach(elem => {
            
            let objId = ui.dataset(elem, 'object')            
            
            let attr = elem.getAttribute('data-display')
            if (attr == 'count') {
                
                let data = Math.round(game.obj(objId).count + Number.EPSILON)
                
                let html = ''
                if (data > 0) { html = '<span class="text-white">' + data + '</span>' }
                else { html = data }
                
                if (elem.innerHTML != html) { elem.innerHTML = html }
            }
            else if (attr == 'stock') {
                
                let data = Math.round(game.obj(objId).stock + Number.EPSILON)
                
                let html = data
                
                if (elem.innerHTML != html) { elem.innerHTML = html }
            }
            else if (attr == 'availableCount') {
                
                let data = Math.round(game.obj(objId).availableCount + Number.EPSILON)
                
                let html = ''
                if (data > 0) { html = '<span class="text-white">' + data + '</span>' }
                else { html = '' + data }
                
                if (elem.innerHTML != html) { elem.innerHTML = html }
            }
            else if (attr == 'production') {
                
                let data = Math.round((game.obj(objId).production + Number.EPSILON) * 1000) / 1000
                
                let html = ''
                if (data > 0) { html = '<span class="text-success">+' + data + ' <small class="opacity-50">/s</small></span>' }
                else if (data < 0) { html = '<span class="text-danger">' + data + ' <small class="opacity-50">/s</small></span>' }
                else { html = '<span>' + data + ' <small class="opacity-50">/s</small></span>' }
                
                if (elem.innerHTML != html) { elem.innerHTML = html }
            }
            else if (attr == 'cost') {

                let value = elem.getAttribute('data-value')
                let data = Math.round(game.obj(objId).cost[value] + Number.EPSILON)
                
                let className = ''
                if (data > game.obj(value).count) { className = 'text-danger' }
                else { className = 'text-success' }
                
                if (elem.className != className) { elem.className = className }
            }
            else if (attr == 'using') {

                let value = elem.getAttribute('data-value')
                let data = Math.round(game.obj(objId).using[value] + Number.EPSILON)

                let className = ''
                if (data > game.obj(value).availableCount) { className = 'text-danger' }
                else { className = 'text-success' }
                
                if (elem.className != className) { elem.className = className }
            }
            else if (attr == 'remainingTime') {
                
                let data = game.obj(objId).remainingTime
                
                let html = formatTime(data)
                
                if (elem.innerHTML != html) { elem.innerHTML = html }
            }
            else if (attr == 'progress') {

                let data = game.obj(objId).buildingProgress

                let html = '<div class="progress-bar bg-success" role="progressbar" style="width:' + data + '%" aria-valuenow="' + data + '" aria-valuemin="0" aria-valuemax="100"></div>'
                
                if (elem.innerHTML != html) { elem.innerHTML = html }
            }
            else if (attr == 'usage') {
                
                let data = Math.round(game.obj(objId).usage + Number.EPSILON)
                
                let html = ''
                if (data >= game.obj(objId).count) { html = '<span class="text-danger">' + data + '</span>' }
                else if (data > 0) { html = '<span class="text-white">' + data + '</span>' }
                else { html = data }
                
                if (elem.innerHTML != html) { elem.innerHTML = html }
            }
        })
    }
    
    //---
    
    saveData() {
        
        let savedData = {}
        
        savedData.paused = this.paused
        savedData.timePlayed = this.timePlayed
        savedData.lastFrameTimeMs = this.lastFrameTimeMs

        savedData.worldId = this.worldId
        this.gameObjects.forEach(obj => { savedData[obj.id] = obj.onSave() })
        
        let text = JSON.stringify(savedData)
        let compressed = LZString.compressToBase64(text)
        localStorage.setItem(this.localStorageName, compressed)
    }
    
    loadData() {

        let loadedData = localStorage.getItem(this.localStorageName)
        if (loadedData && loadedData !== null && loadedData.length % 4 == 0) {
            
            let text = LZString.decompressFromBase64(loadedData)
            if (!text) return console.warn('Load failed')
            loadedData = JSON.parse(text)
            
            if (loadedData.paused) { this.paused = loadedData.paused }
            if (loadedData.timePlayed) { this.timePlayed = loadedData.timePlayed }
            if (loadedData.lastFrameTimeMs) { this.lastFrameTimeMs = loadedData.lastFrameTimeMs }
            
            if (loadedData.worldId) {
                
                this.startNewWorld(loadedData.worldId)            
                this.gameObjects.forEach(obj => { obj.onLoad(loadedData) })
            }
        }
        else {
            
            this.startNewWorld('world1')
        }
        
        this.buildUI()
    }
    
    startNewWorld(worldId) {
        
        this.worldId = worldId
        
        if (worldId == 'world1') loadDataWorld1()

        this.gameObjects.forEach(obj => {
            
            if (obj.prod) {
                for (let prodId in obj.prod) {
                    game.obj(prodId).producers.push(obj)
                }
            }
            
            if (obj.storage) {
                for (let storageId in obj.storage) {
                    game.obj(storageId).storers.push(obj)
                }
            }
            
            if (obj.using) {
                for (let usingId in obj.using) {
                    game.obj(usingId).users.push(obj)
                }
            }
            
            if (obj.req) {
                for (let reqId in obj.req) {
                    game.obj(reqId).unlocks.push(obj)
                }
            }
        })
    }
    
    buildUI() {
        
        let html = ''
        
        this.resources = this.gameObjects.filter(obj => { return obj.uiId == 'resources'})
        html = '<div class="row g-2">'
        this.resources.forEach(elem => { html += getHtmlResource(elem) })
        html += '</div>'
        ui.find('#resources').innerHTML = html
        
        this.gameCategories.forEach(category => {
            
            html = '<div class="nav-item col" data-show="unlocked" data-cat="' + category.id + '">'
                html += '<button class="nav-link w-100 ' + (category.default ? 'active' : '') + '" id="' + category.uiId + '-tab" data-bs-toggle="tab" data-bs-target="#' + category.uiId + '-pane" type="button" role="tab" aria-controls="' + category.uiId + '" aria-selected="' + (category.default ? 'true' : 'false') + '">'
                    html += '<i class="fa-fw fas fa-' + category.tabIcon + '"></i>'
                html += '</button>'
            html += '</div>'
            ui.find('#category-tabs').innerHTML += html
            
            html = '<div id="' + category.uiId + '-pane" class="tab-pane h-100 scrollbar px-2 py-2 ' + (category.default ? 'active' : '') + '">'
                html += '<div class="row g-2">'
                    html += '<div class="col-12">'
                        html += '<span class="h6">' + trans.translate(category.uiId) + '</span>'
                    html += '</div>'
                    html += '<div id="' + category.uiId + '" class="col-12"></div>'
                    if (category.displayDone == true) { html += '<div id="done' + category.uiId + '" class="col-12"></div>' }
                html += '</div>'
            html += '</div>'
            ui.find('#category-panes').innerHTML += html
            
            category.objects = this.gameObjects.filter(obj => { return obj.uiId == category.uiId })
            
            html = '<div class="row g-2">'
                html += '<div class="col-12" data-object="' + category.uiId + '" data-show="tabNoContent"><span class="opacity-50">Nothing available for the moment</span></div>'
            category.objects.forEach(elem => {
                
                if (category.uiId == 'objectives') { html += getHtmlObjective(elem) }
                else { html += getHtmlBuildable(elem, category.buildIcon) }
            })
            html += '</div>'
            ui.find('#' + category.uiId).innerHTML = html
            
            if (category.displayDone == true) {
                
                html = '<div class="mt-2 row g-2">'
                category.objects.forEach(elem => { html += getHtmlDone(elem) })
                html += '</div>'
                ui.find('#done' + category.uiId).innerHTML = html
            }
        })        
    }
}

//===

var game = new Game()
game.start()

//===

function formatTime(time) {
    
    let format = time
    
    if (format == Infinity) return 'Infinity'
    
    if (format < 1) return Math.ceil(format * 1000) + ' ms'
    
    let d = Math.floor(format / (3600 * 24))
    
    let h = Math.floor(format / 3600) % 24
    if (h < 10) { h = '0' + h }
    
    let m = Math.floor(format / 60) % 60
    if (m < 10) { m = '0' + m }
    
    let s = Math.floor(format % 60)
    if (s < 10) { s = '0' + s }
    
    if (d > 0) format = d + trans.translate('abbr_day') + ' ' + h + ':' + m + ':' + s
    else format = h + ':' + m + ':' + s
    
    return format
}

function getIcon(obj) {
    
    let cat = game.gameCategories.find(elem => elem.uiId == obj.uiId)
    return '<i class="fa-fw fas fa-' + cat.tabIcon + '"></i>'
}

function getHtmlUnlocks(unlocks) {
    
    let html = ''
    
    html += '<div class="col-12">'
        html += '<div class="row g-1">'
            html += '<div class="col-12">Unlocks</div>'
            unlocks.forEach(unlock => {
                html += '<div class="col-12">'
                    html += '<div class="row gx-1">'
                        html += '<div class="col-auto">'
                            html += getIcon(unlock)
                        html += '</div>'
                        html += '<div class="col-auto">'
                            html += '<span class="text-white">' + trans.translate(unlock.id) + '</span>'
                        html += '</div>'
                    html += '</div>'
                html += '</div>'
            })
        html += '</div>'
    html += '</div>'
    
    return html
}

function getHtmlProd(prod) {
    
    let html = ''
    
    html += '<div class="col-12">'
        html += '<div class="row gx-2 align-items-baseline">'
        html += '<span class="col">Prod</span>'
        for (let id in prod) {
            html += '<div class="col-auto">'
                html += '<div class="row gx-1">'
                    html += '<div class="col-auto">'
                        html += '<img src="img/' + game.obj(id).img + '" width="16px" />'
                    html += '</div>'
                    html += '<div class="col-auto">'
                        html += '<span class="text-success">+' + prod[id] + ' <small class="opacity-50">/s</small></span>'
                    html += '</div>'
                html += '</div>'
            html += '</div>'
        }
        html += '</div>'
    html += '</div>'
    
    return html
}

function getHtmlGain(gain) {
    
    let html = ''
    
    html += '<div class="col-12">'
        html += '<div class="row gx-2 align-items-baseline">'
        html += '<span class="col">Gain</span>'
        for (let id in gain) {
            html += '<div class="col-auto">'
                html += '<div class="row gx-1">'
                    html += '<div class="col-auto">'
                        let img = game.obj(id).img
                        if (img) { html += '<img src="img/' + game.obj(id).img + '" width="16px" />' }
                        else { html += trans.translate(id) }
                    html += '</div>'
                    html += '<div class="col-auto">'
                        html += '<span class="text-success">+' + gain[id] + '</span>'
                    html += '</div>'
                html += '</div>'
            html += '</div>'
        }
        html += '</div>'
    html += '</div>'
    
    return html
}

function getHtmlStorage(storage) {
    
    let html = ''
    
    html += '<div class="col-12">'
        html += '<div class="row gx-2 align-items-baseline">'
        html += '<span class="col">Storage</span>'
        for (let id in storage) {
            html += '<div class="col-auto">'
                html += '<div class="row gx-1">'
                    html += '<div class="col-auto">'
                        html += '<img src="img/' + game.obj(id).img + '" width="16px" />'
                    html += '</div>'
                    html += '<div class="col-auto">'
                        html += '<span class="text-success">+' + storage[id] + ' <small class="opacity-50">max</small></span>'
                    html += '</div>'
                html += '</div>'
            html += '</div>'
        }
        html += '</div>'
    html += '</div>'
    
    return html
}

function getHtmlUsing(using) {
    
    let html = ''
    
    html += '<div class="col-12">'
        html += '<div class="row gx-2 align-items-baseline">'
        html += '<span class="col">Using</span>'
        for (let id in using) {
            html += '<div class="col-auto">'
                html += '<div class="row gx-1">'
                    html += '<div class="col-auto">'
                        html += '<img src="img/' + game.obj(id).img + '" width="16px" />'
                    html += '</div>'
                    html += '<div class="col-auto">'
                        html += '<span data-display="using" data-value="' + id + '">' + using[id] + '</span>'
                    html += '</div>'
                html += '</div>'
            html += '</div>'
        }
        html += '</div>'
    html += '</div>'
    
    return html
}

function getHtmlCost(cost) {
    
    let html = ''
    
    html += '<div class="col-12">'
        html += '<div class="row gx-2 align-items-baseline">'
        html += '<span class="col">Cost</span>'
            for (let id in cost) {
                html += '<div class="col-auto">'
                    html += '<div class="row gx-1">'
                        html += '<div class="col-auto">'
                            let img = game.obj(id).img
                            if (img) { html += '<img src="img/' + game.obj(id).img + '" width="16px" />' }
                            else { html += trans.translate(id) }
                        html += '</div>'
                        html += '<div class="col-auto">'
                            html += '<span data-display="cost" data-value="' + id + '">' + cost[id] + '</span>'
                        html += '</div>'
                    html += '</div>'
                html += '</div>'
            }
        html += '</div>'
    html += '</div>'
    
    return html
}

function getBtnBuild(obj, btnIcon) {
    
    let html = ''
    
    html += '<div class="row gx-2 align-items-center justify-content-end">'
        if (obj.build.time) {
            html += '<div class="col-auto d-flex flex-column align-items-end">'
                html += '<div class="mb-1"><span data-display="remainingTime"></span></div>'
                html += '<div class="progress" data-display="progress"></div>'
            html += '</div>'
        }
        html += '<div class="col-auto" data-show="statusIdle">'
            html += '<button type="button" class="btn btn-primary px-2" data-check="canBuild" onclick="clickBuild(\'' + obj.id + '\')">'
                html += '<i class="fa-fw fas fa-' + btnIcon + '"></i>'
            html += '</button>'
        html += '</div>'
        html += '<div class="col-auto" data-show="statusBuilding">'
            html += '<button type="button" class="btn btn-danger px-2" data-check="canCancel" onclick="clickCancel(\'' + obj.id + '\')">'
                html += '<i class="fa-fw fas fa-times-circle"></i>'
            html += '</button>'
        html += '</div>'
    html += '</div>'
    
    return html
}

function getBtnDelete(obj, btnLabel) {
    
    let html = ''
    
    html += '<div class="col-12 mt-2">'
        html += '<div class="row gx-2 align-items-center">'
            html += '<div class="col-auto">'
                html += '<button type="button" class="btn btn-danger" data-check="canDelete" onclick="clickDelete(\'' + obj.id + '\')">'
                    html += btnLabel
                html += '</button>'
            html += '</div>'
        html += '</div>'
    html += '</div>'
    
    return html
}

function getBtnCheck(obj, btnLabel) {
    
    let html = ''
    
    html += '<div class="row gx-2 justify-content-end">'
        html += '<div class="col-auto">'
            html += '<button type="button" class="btn btn-primary" data-check="canCheck" onclick="clickCheck(\'' + obj.id + '\')">'
                html += btnLabel
            html += '</button>'
        html += '</div>'
    html += '</div>'
    
    return html
}

//---

function getHtmlResource(resource) {
    
    let html = ''
    
    html += '<div class="col" data-object="' + resource.id + '">'
        html += '<div class="dropdown">'
            html += '<button class="w-100 btn px-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">'
                html += '<div class="row g-1 lh-1">'
                    html += '<div class="col-12 text-center">'
                        html += '<img src="img/' + resource.img + '" width="16px" />'
                    html += '</div>'
                    html += '<div class="col-12 text-center">'
                        html += '<small data-display="availableCount"></small>'
                    html += '</div>'
                html += '</div>'
            html += '</button>'
            html += '<div class="dropdown-menu">'
                html += '<div class="row g-1">'
                    html += '<div class="col-12 pb-2 border-bottom">'
                        html += '<div class="row gx-2">'
                            html += '<div class="col-auto">'
                                html += '<img src="img/' + resource.img + '" width="16px" />'
                            html += '</div>'
                            html += '<div class="col">'
                                html += '<span class="fw-semibold">' + trans.translate(resource.id) + '</span>'
                            html += '</div>'
                        html += '</div>'
                    html += '</div>'
                    if (resource.users.length > 0) {
                        html += '<div class="col-12">'
                            html += '<div class="row gx-2">'
                                html += '<div class="col">'
                                    html += '<span>Available count</span>'
                                html += '</div>'
                                html += '<div class="col-auto">'
                                    html += '<span data-display="availableCount">' + resource.availableCount + '</span>'
                                html += '</div>'
                            html += '</div>'
                        html += '</div>'
                    }
                    html += '<div class="col-12">'
                        html += '<div class="row gx-2">'
                            html += '<div class="col">'
                                html += '<span>Total count</span>'
                            html += '</div>'
                            html += '<div class="col-auto">'
                                html += '<span data-display="count">' + resource.count + '</span>'
                            html += '</div>'
                        html += '</div>'
                    html += '</div>'
                    if (resource.producers.length > 0) {
                        html += '<div class="col-12">'
                            html += '<div class="row gx-2">'
                                html += '<div class="col">'
                                    html += '<span>Current production</span>'
                                html += '</div>'
                                html += '<div class="col-auto">'
                                    html += '<span data-display="production">' + resource.production + '</span>'
                                html += '</div>'
                            html += '</div>'
                        html += '</div>'
                    }
                html += '</div>'
            html += '</div>'
        html += '</div>'
    html += '</div>'

    return html
}

function getHtmlBuildable(buildable, buildIcon) {
    
    let html = ''
    
    html += '<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3" data-show="' + (buildable.max && buildable.max == 1 ? 'unlockedNotBuilt' : 'unlocked') + '" data-object="' + buildable.id + '">'
        html += '<div class="card card-body">'
            html += '<div class="row gx-2 align-items-center flex-nowrap">'
                html += '<div class="col-auto">'
                    html += '<div class="dropdown">'
                        html += '<button class="w-100 btn px-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">'
                            html += '<i class="fa-fw fas fa-info-circle"></i>'
                        html += '</button>'
                        html += '<div class="dropdown-menu">'
                            html += '<div class="row g-1">'
                                html += '<div class="col-12 pb-2 border-bottom">'
                                    html += '<span class="fw-semibold">' + getIcon(buildable) + ' ' + trans.translate(buildable.id) + '</span>'
                                html += '</div>'
                                if (buildable.gain) { html += getHtmlGain(buildable.gain) }
                                if (buildable.storage) { html += getHtmlStorage(buildable.storage) }
                                if (buildable.prod) { html += getHtmlProd(buildable.prod) }
                                if (buildable.using) { html += getHtmlUsing(buildable.using) }
                                if (buildable.cost) { html += getHtmlCost(buildable.cost) }
                                if (buildable.unlocks.length > 0) { html += getHtmlUnlocks(buildable.unlocks) }
                                if (buildable.deletable) { html += getBtnDelete(buildable, 'Delete') }
                            html += '</div>'
                        html += '</div>'
                    html += '</div>'
                html += '</div>'
                html += '<div class="col text-truncate">'
                    html += '<span class="fw-semibold">' + trans.translate(buildable.id) + '</span>'
                html += '</div>'
                if (!buildable.max || buildable.max > 1) {
                    html += '<div class="col-auto">'
                        html += '<span><small class="opacity-50">x</small> <span data-display="count">' + buildable.count + '</span></span>'
                    html += '</div>'
                }
                html += '<div class="col-auto">'
                    html += getBtnBuild(buildable, buildIcon)
                html += '</div>'
            html += '</div>'
        html += '</div>'
    html += '</div>'
    
    return html
}

function getHtmlObjective(objective) {
    
    let html = ''
    
    html += '<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3" data-show="unlockedNotBuilt" data-object="' + objective.id + '">'
        html += '<div class="card card-body">'
            html += '<div class="row gx-2 align-items-center">'
                html += '<div class="col-12 mb-2 pb-2 border-bottom">'
                    html += '<span class="fw-semibold">' + trans.translate(objective.id) + '</span>'
                html += '</div>'
                html += '<div class="col-12 mb-2">'
                    html += '<span class="fst-italic">' + trans.translate(objective.id + '_desc') + '</span>'
                html += '</div>'
                html += '<div class="col-12">'
                    html += '<div class="row g-1">'
                        for (let id in objective.check) {
                            html += '<div class="col-12">'
                                if (game.obj(id).uiId == 'houses') { html += '<span class="text-white">&bull; Have ' + objective.check[id] + ' ' + getIcon(game.obj(id)) + ' ' + trans.translate(id) + '</span>' }
                                else if (game.obj(id).uiId == 'prods') { html += '<span class="text-white">&bull; Have ' + objective.check[id] + ' ' + getIcon(game.obj(id)) + ' ' + trans.translate(id) + '</span>' }
                                else if (game.obj(id).uiId == 'decos') { html += '<span class="text-white">&bull; Have ' + objective.check[id] + ' ' + getIcon(game.obj(id)) + ' ' + trans.translate(id) + '</span>' }
                                else if (game.obj(id).uiId == 'barracks') { html += '<span class="text-white">&bull; Have ' + objective.check[id] + ' ' + getIcon(game.obj(id)) + ' ' + trans.translate(id) + '</span>' }
                                else if (game.obj(id).uiId == 'techs') { html += '<span class="text-white">&bull; Research ' + getIcon(game.obj(id)) + ' ' + trans.translate(id) + '</span>' }
                                else if (game.obj(id).uiId == 'units') { html += '<span class="text-white">&bull; Have ' + objective.check[id] + ' ' + getIcon(game.obj(id)) + ' ' + trans.translate(id) + '</span>' }
                                else if (game.obj(id).uiId == 'territories') { html += '<span class="text-white">&bull; Conquer ' + getIcon(game.obj(id)) + ' ' + trans.translate(id) + '</span>' }
                            html += '</div>'
                        }
                    html += '</div>'
                html += '</div>'
                if (objective.gain) { html += '<div class="my-2">' + getHtmlGain(objective.gain) + '</div>' }
                html += '<div class="col-12">'
                    html += '<div class="row gx-2 justify-content-end">'
                        html += '<div class="col-auto">'
                            html += getBtnCheck(objective, 'Next')
                        html += '</div>'
                    html += '</div>'
                html += '</div>'
            html += '</div>'
        html += '</div>'
    html += '</div>'
    
    return html
}

function getHtmlDone(obj) {
    
    let html = ''
    
    html += '<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3" data-show="unlockedBuilt" data-object="' + obj.id + '">'
        html += '<div class="card card-body opacity-50">'
            html += '<div class="row gx-2 align-items-center">'
                html += '<div class="col">'
                    html += '<span class="fw-semibold">' + trans.translate(obj.id) + '</span>'
                html += '</div>'
                html += '<div class="col-auto">'
                    html += '<span class="text-success"><i class="fa-fw fas fa-check-circle"></i></span>'
                html += '</div>'
            html += '</div>'
        html += '</div>'
    html += '</div>'
    
    return html
}

//===

function canBuild(objId) {
    
    let obj = game.obj(objId)

    if (obj.isUnlocked == false) { return false }
    
    if (obj.count >= obj.max) { return false }
    if (obj.count >= obj.stock) { return false }
    
    if (obj.status != 'idle') { return false }

    if (obj.using) {
        
        let using = obj.using
        for (let usingId in using) {
            
            let usingCount = using[usingId]
            if (usingCount > game.obj(usingId).availableCount) { return false }
        }
    }
    
    if (obj.cost) {
        
        let cost = obj.cost
        for (let costId in cost) {
            
            let costCount = cost[costId]
            if (costCount > game.obj(costId).count) { return false }
        }
    }
    
    return true
}

function canCancel(objId) {
    
    let obj = game.obj(objId)

    if (obj.isUnlocked == false) { return false }
    
    if (obj.status != 'building') { return false }

    return true
}

function canDelete(objId) {
    
    let obj = game.obj(objId)

    if (obj.count < 1) { return false }
    if (obj.status != 'idle') { return false }
    
    if (obj.prod) {
        for (let prodId in obj.prod) {
            
            let production = game.obj(prodId).production
            if (production - obj.prod[prodId] < 0) { return false }
        }
    }

    if (obj.storage) {
        for (let storageId in obj.storage) {
            
            let stock = game.obj(storageId).stock
            if (stock - obj.storage[storageId] < game.obj(storageId).count) { return false }
        }
    }
    
    if (obj.gain) {
        for (let gainId in obj.gain) {
            
            let availableCount = game.obj(gainId).availableCount
            if (availableCount - obj.gain[gainId] < 0) { return false }
        }
    }
    
    return true
}

function canCheck(objId) {
    
    let obj = game.obj(objId)

    if (obj.isUnlocked == false) { return false }
    
    if (obj.count >= obj.max) { return false }
    
    let check = obj.check
    for (let checkId in check) {
        
        let checkCount = check[checkId]
        if (checkCount > game.obj(checkId).count) { return false }
    }
        
    return true
}

//===

function clickWipe() {
    
    game.resetInProgress = true
    
    localStorage.removeItem(game.localStorageName)
    window.location.replace('')
}

function clickBuild(objId) {
    if (canBuild(objId) == true) {
        
        let obj = game.obj(objId)
        if (obj.cost) {
            
            let cost = obj.cost
            for (let costId in cost) {
                
                let costCount = cost[costId]
                game.obj(costId).count -= costCount
            }
        }
        
        obj.status = 'building'
        obj.remainingTime = obj.build.time ? obj.build.time : 0
    }
}

function clickCancel(objId) {
    if (canCancel(objId) == true) {
        
        let obj = game.obj(objId)
        if (obj.cost) {
            
            let cost = obj.cost
            for (let costId in cost) {
                
                let costCount = cost[costId]
                game.obj(costId).count += costCount
            }
        }
        
        obj.status = 'idle'
        obj.remainingTime = 0
    }
}

function clickDelete(objId) {
    if (canDelete(objId) == true) {

        let obj = game.obj(objId)
        obj.count -= 1
    
        if (obj.gain) {
            for (let gainId in obj.gain) {                
                game.obj(gainId).count -= obj.gain[gainId]
            }
        }
    }
}

function clickCheck(objId) {
    if (canCheck(objId) == true) {
        
        let obj = game.obj(objId)
        obj.count += 1
        
        if (obj.gain) {
            for (let gainId in obj.gain) {
                game.obj(gainId).count += obj.gain[gainId]
            }
        }
    }
}