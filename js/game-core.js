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
        this.gameObjects = []
        this.saveInterval = null
        this.autoSaveDelay = 30000
        this.resetInProgress = false
        this.lastFrameTimeMs = new Date().getTime()
        this.localStorageName = 'fgciv'
        
        this.resources = []
        this.buildingObjects = []
        this.decos = []
        this.houses = []
        this.prods = []
        this.barracks = []
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
                    obj.remainingTime = 0
                    
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
            
            if (attr == 'unlocked') {
                
                let objId = ui.dataset(elem, 'object')
                let data = game.obj(objId).count

                if (game.obj(objId).isUnlocked == true) { elem.style.display = 'block' }
                else { elem.style.display = 'none' }
            }
            else if (attr == 'unlockedNotBuilt') {
                
                let objId = ui.dataset(elem, 'object')
                let data = game.obj(objId).count
                
                if (game.obj(objId).isUnlocked == true && data < 1) { elem.style.display = 'block' }
                else { elem.style.display = 'none' }
            }
            else if (attr == 'unlockedBuilt') {
                
                let objId = ui.dataset(elem, 'object')
                let data = game.obj(objId).count

                if (game.obj(objId).isUnlocked == true && data > 0) { elem.style.display = 'block' }
                else { elem.style.display = 'none' }
            }
            else if (attr == 'statusIdle') {
                
                let objId = ui.dataset(elem, 'object')
                let data = game.obj(objId).status
                
                if (data == 'idle') { elem.style.display = 'block' }
                else { elem.style.display = 'none' }
            }
            else if (attr == 'statusBuilding') {
                
                let objId = ui.dataset(elem, 'object')
                let data = game.obj(objId).status
                
                if (data == 'building') { elem.style.display = 'block' }
                else { elem.style.display = 'none' }
            }
        })
        
        //--- enabling/disabling buttons
        
        ui.findAll('[data-check]').forEach(elem => {
            
            let attr = elem.getAttribute('data-check')
            
            if (attr == 'canBuild') {
                
                let objId = ui.dataset(elem, 'object')
                elem.disabled = !canBuild(objId)
            }
            else if (attr == 'canDelete') {
                
                let objId = ui.dataset(elem, 'object')
                elem.disabled = !canDelete(objId)
            }
            else if (attr == 'canCheck') {
                
                let objId = ui.dataset(elem, 'object')
                elem.disabled = !canCheck(objId)
            }
            else if (attr == 'canAssign') {
                
                let objId = ui.dataset(elem, 'object')
                elem.disabled = !canAssign(objId)
            }
            else if (attr == 'canUnassign') {
                
                let objId = ui.dataset(elem, 'object')
                elem.disabled = !canUnassign(objId)
            }
        })
        
        //--- displaying data
        
        ui.findAll('[data-display]').forEach(elem => {
            
            let objId = ui.dataset(elem, 'object')            
            
            let attr = elem.getAttribute('data-display')
            if (attr == 'count') {
                
                let data = Math.round(game.obj(objId).count + Number.EPSILON)
                
                if (data > 0) { elem.innerHTML = '<span class="text-white">' + data + '</span>' }
                else { elem.innerHTML = data }
            }
            else if (attr == 'stock') {
                
                let data = Math.round(game.obj(objId).stock + Number.EPSILON)
                elem.innerHTML = data
            }
            if (attr == 'availableCount') {
                
                let data = Math.round(game.obj(objId).availableCount + Number.EPSILON)
                
                if (data > 0) { elem.innerHTML = '<span class="text-white">' + data + '</span>' }
                else { elem.innerHTML = data }
            }
            else if (attr == 'production') {
                
                let data = Math.round((game.obj(objId).production + Number.EPSILON) * 1000) / 1000
                
                if (data > 0) { elem.innerHTML = '<span class="text-success">+' + data + ' <small class="opacity-50">/s</small></span>' }
                else if (data < 0) { elem.innerHTML = '<span class="text-danger">' + data + ' <small class="opacity-50">/s</small></span>' }
                else { elem.innerHTML = '<span>' + data + ' <small class="opacity-50">/s</small></span>' }
            }
            else if (attr == 'cost') {

                let value = elem.getAttribute('data-value')
                let data = Math.round(game.obj(objId).cost[value] + Number.EPSILON)

                if (data > game.obj(value).count) { elem.className = 'text-danger' }
                else { elem.className = 'text-success' }
            }
            else if (attr == 'using') {

                let value = elem.getAttribute('data-value')
                let data = Math.round(game.obj(objId).using[value] + Number.EPSILON)

                if (data > game.obj(value).availableCount) { elem.className = 'text-danger' }
                else { elem.className = 'text-success' }
            }
            else if (attr == 'remainingTime') {
                
                let data = game.obj(objId).remainingTime
                
                elem.innerHTML = formatTime(data)
            }
            else if (attr == 'progress') {

                let data = game.obj(objId).buildingProgress

                elem.innerHTML = '<div class="progress-bar bg-success" role="progressbar" style="width:' + data + '%" aria-valuenow="' + data + '" aria-valuemin="0" aria-valuemax="100"></div>'
            }
            else if (attr == 'usage') {
                
                let data = Math.round(game.obj(objId).usage + Number.EPSILON)
                
                if (data >= game.obj(objId).count) { elem.innerHTML = '<span class="text-danger">' + data + '</span>' }
                else if (data > 0) { elem.innerHTML = '<span class="text-white">' + data + '</span>' }
                else { elem.innerHTML = data }
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
        })
    }
    
    buildUI() {
        
        let html = ''
        
        this.resources = this.gameObjects.filter(obj => { return obj.uiId == 'resources'})
        html = '<div class="row gx-2">'
        this.resources.forEach(elem => { html += getHtmlResource(elem) })
        html += '</div>'
        ui.find('#resources').innerHTML = html
        
        this.buildingObjects = this.gameObjects.filter(obj => { return obj.uiId == 'buildingObjects'})
        html = ''
        this.buildingObjects.forEach(elem => { html += getHtmlUsedObject(elem) })
        ui.find('#buildingObjects').innerHTML = html
        
        this.decos = this.gameObjects.filter(obj => { return obj.uiId == 'decos'})
        html = '<div class="row g-3">'
        this.decos.forEach(elem => { html += getHtmlBuilding(elem) })
        html += '</div>'
        ui.find('#decos').innerHTML = html
        
        this.houses = this.gameObjects.filter(obj => { return obj.uiId == 'houses'})
        html = '<div class="row g-3">'
        this.houses.forEach(elem => { html += getHtmlBuilding(elem) })
        html += '</div>'
        ui.find('#houses').innerHTML = html
        
        this.prods = this.gameObjects.filter(obj => { return obj.uiId == 'prods'})
        html = '<div class="row g-3">'
        this.prods.forEach(elem => { html += getHtmlBuilding(elem) })
        html += '</div>'
        ui.find('#prods').innerHTML = html
        
        this.barracks = this.gameObjects.filter(obj => { return obj.uiId == 'barracks'})
        html = '<div class="row g-3">'
        this.barracks.forEach(elem => { html += getHtmlBuilding(elem) })
        html += '</div>'
        ui.find('#barracks').innerHTML = html
        
        this.techs = this.gameObjects.filter(obj => { return obj.uiId == 'techs'})
        html = '<div class="row g-3">'
        this.techs.forEach(elem => { html += getHtmlTech(elem) })
        html += '</div>'
        ui.find('#techs').innerHTML = html
        
        this.units = this.gameObjects.filter(obj => { return obj.uiId == 'units'})
        html = '<div class="row g-3">'
        this.units.forEach(elem => { html += getHtmlUnit(elem) })
        html += '</div>'
        ui.find('#units').innerHTML = html
        
        this.territories = this.gameObjects.filter(obj => { return obj.uiId == 'territories'})
        html = '<div class="row g-3">'
        this.territories.forEach(elem => { html += getHtmlTerritory(elem) })
        html += '</div>'
        ui.find('#territories').innerHTML = html
        
        this.objectives = this.gameObjects.filter(obj => { return obj.uiId == 'objectives'})
        html = '<div class="row g-3">'
        this.objectives.forEach(elem => { html += getHtmlObjective(elem) })
        html += '</div>'
        ui.find('#objectives').innerHTML = html
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

function getHtmlProd(prod) {
    
    let html = ''
    
    html += '<div class="col-auto">'
        html += '<div class="row gx-2">'
        html += '<small class="col-auto">Prod</small>'
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
    
    html += '<div class="col-auto">'
        html += '<div class="row gx-2">'
        html += '<small class="col-auto">Gain</small>'
        for (let id in gain) {
            html += '<div class="col-auto">'
                html += '<div class="row gx-1">'
                    html += '<div class="col-auto">'
                        html += '<img src="img/' + game.obj(id).img + '" width="16px" />'
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
    
    html += '<div class="col-auto">'
        html += '<small>Storage</small>'
        html += '<div class="row gx-2">'
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
    
    html += '<div class="col-auto">'
        html += '<div class="row gx-2">'
        html += '<small class="col-auto">Using</small>'
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
    
    html += '<div class="col-auto">'
        html += '<div class="row gx-2">'
        html += '<small class="col-auto">Cost</small>'
            for (let id in cost) {
                html += '<div class="col-auto">'
                    html += '<div class="row gx-1">'
                        html += '<div class="col-auto">'
                            html += '<img src="img/' + game.obj(id).img + '" width="16px" />'
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

function getHtmlBuild(obj, btnLabel) {
    
    let html = ''
    
    html += '<div class="col-12" data-show="statusIdle">'
        html += '<div class="row gx-2 align-items-center justify-content-end">'
            if (obj.build.time) {
                html += '<div class="col-auto">'
                    html += '<span>' + formatTime(obj.build.time) + '</span>'
                html += '</div>'
            }
            html += '<div class="col-auto">'
                html += '<button type="button" class="btn btn-primary" data-check="canBuild" onclick="clickBuild(\'' + obj.id + '\')">'
                    html += btnLabel
                html += '</button>'
            html += '</div>'
        html += '</div>'
    html += '</div>'
    html += '<div class="col-12" data-show="statusBuilding">'
        html += '<div class="row gx-2 align-items-center">'
            html += '<div class="col-auto d-flex flex-column align-items-end">'
                html += '<div class="mb-1"><span data-display="remainingTime"></span></div>'
                html += '<div class="progress" data-display="progress"></div>'
            html += '</div>'
            html += '<div class="col-auto">'
                html += '<button type="button" class="btn btn-danger" data-check="canCancel" onclick="clickCancel(\'' + obj.id + '\')">'
                    html += 'Cancel'
                html += '</button>'
            html += '</div>'
        html += '</div>'
    html += '</div>'
    
    return html
}

function getHtmlDelete(obj, btnLabel) {
    
    let html = ''
    
    html += '<div class="col-12" data-show="statusIdle">'
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

function getHtmlCheck(obj, btnLabel) {
    
    let html = ''
    
    html += '<div class="col-12">'
        html += '<div class="row gx-2 justify-content-end">'
            html += '<div class="col-auto">'
                html += '<button type="button" class="btn btn-primary" data-check="canCheck" onclick="clickCheck(\'' + obj.id + '\')">'
                    html += btnLabel
                html += '</button>'
            html += '</div>'
        html += '</div>'
    html += '</div>'
    
    return html
}

//---

function getHtmlUsedObject(obj) {
    
    let html = ''
    
    html += '<div class="row gx-2 align-items-baseline" data-object="' + obj.id + '">'
        html += '<div class="col-auto">'
            html += '<img src="img/' + obj.img + '" width="16px" />'
        html += '</div>'
        html += '<div class="col">'
            html += '<span class="fw-bold">' + trans.translate(obj.id) + '</span>'
        html += '</div>'
        html += '<div class="col-auto">'
            html += '<span data-display="usage"></span>'
            html += '<small class="opacity-50"> /<span data-display="count"></span></small>'
        html += '</div>'
    html += '</div>'

    return html
}

function getHtmlResource(resource) {
    
    let html = ''
    
    html += '<div class="col" data-object="' + resource.id + '">'
        html += '<div class="dropdown">'
            html += '<button class="w-100 btn px-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">'
                html += '<div class="row g-2">'
                    html += '<div class="col-auto">'
                        html += '<img src="img/' + resource.img + '" width="16px" />'
                    html += '</div>'
                    html += '<div class="col text-end">'
                        html += '<span data-display="availableCount"></span>'
                    html += '</div>'
                html += '</div>'
            html += '</button>'
            html += '<div class="dropdown-menu">'
                html += '<div class="row g-2">'
                    html += '<div class="col-12">'
                        html += '<div class="row gx-2">'
                            html += '<div class="col-auto">'
                                html += '<img src="img/' + resource.img + '" width="16px" />'
                            html += '</div>'
                            html += '<div class="col">'
                                html += '<span class="h6">' + trans.translate(resource.id) + '</span>'
                            html += '</div>'
                        html += '</div>'
                    html += '</div>'
                    html += '<div class="col-12">'
                        html += '<div class="row g-1">'
                            html += '<div class="col-12">'
                                html += '<div class="row gx-2">'
                                    html += '<div class="col">'
                                        html += '<span>Total count</span>'
                                    html += '</div>'
                                    html += '<div class="col-auto">'
                                        html += '<span data-display="count"></span>'
                                    html += '</div>'
                                html += '</div>'
                            html += '</div>'
                            html += '<div class="col-12">'
                                html += '<div class="row gx-2">'
                                    html += '<div class="col">'
                                        html += '<span>Current production</span>'
                                    html += '</div>'
                                    html += '<div class="col-auto">'
                                        html += '<span data-display="production"></span>'
                                    html += '</div>'
                                html += '</div>'
                            html += '</div>'
                        html += '</div>'
                    html += '</div>'
                html += '</div>'
            html += '</div>'
        html += '</div>'
    html += '</div>'

    return html
}

function getHtmlBuilding(building) {
    
    let html = ''
    
    html += '<div class="col-12" data-show="unlocked" data-object="' + building.id + '">'
        html += '<div class="card">'
            html += '<div class="card-header">'
                html += '<div class="row gx-2 align-items-baseline">'
                    html += '<div class="col">'
                        html += '<span class="h6">' + trans.translate(building.id) + '</span>'
                    html += '</div>'
                    html += '<div class="col-auto">'
                        html += '<span><small class="opacity-50">x</small> <span data-display="count"></span></span>'
                    html += '</div>'
                html += '</div>'
            html += '</div>'
            html += '<div class="card-body py-0">'
                html += '<div class="row gx-3">'
                    if (building.gain) { html += getHtmlGain(building.gain) }
                    if (building.storage) { html += getHtmlStorage(building.storage) }
                    if (building.prod) { html += getHtmlProd(building.prod) }
                html += '</div>'
                html += '<div class="row gx-3">'
                    if (building.using) { html += getHtmlUsing(building.using) }
                    if (building.cost) { html += getHtmlCost(building.cost) }
                html += '</div>'
            html += '</div>'
            if (building.build) { 
                html += '<div class="card-footer">'
                    html += '<div class="row gx-2 align-items-center">'
                        html += '<div class="col">'
                            html += getHtmlDelete(building, 'Delete')
                        html += '</div>'
                        html += '<div class="col-auto">'
                            html += getHtmlBuild(building, 'Build')
                        html += '</div>'
                    html += '</div>'
                html += '</div>'
            }
        html += '</div>'
    html += '</div>'
    
    return html
}

function getHtmlTech(tech) {
    
    let html = ''
    
    html += '<div class="col-12" data-show="unlockedNotBuilt" data-object="' + tech.id + '">'
        html += '<div class="card">'
            html += '<div class="card-header">'
                html += '<div class="row gx-2 align-items-center">'
                    html += '<div class="col">'
                        html += '<span class="h6">' + trans.translate(tech.id) + '</span>'
                    html += '</div>'
                html += '</div>'
            html += '</div>'
            if (tech.cost) {
                html += '<div class="card-body py-0">'
                    html += '<div class="row gx-3">'
                        html += getHtmlCost(tech.cost)
                    html += '</div>'
                html += '</div>'
            }
            html += '<div class="card-footer">'
                html += '<div class="row gx-2 justify-content-end">'
                    html += '<div class="col-auto">'
                        html += getHtmlBuild(tech, 'Research')
                    html += '</div>'
                html += '</div>'
            html += '</div>'
        html += '</div>'
    html += '</div>'
    html += '<div class="col-12" data-show="unlockedBuilt" data-object="' + tech.id + '">'
        html += '<div class="row gx-2 align-items-center">'
            html += '<div class="col">'
                html += '<span class="fw-bold">' + trans.translate(tech.id) + '</span>'
            html += '</div>'
            html += '<div class="col-auto">'
                html += '<span class="text-success"><i class="fa-fw fas fa-check-circle"></i></span>'
            html += '</div>'
        html += '</div>'
    html += '</div>'
    
    return html
}

function getHtmlUnit(unit) {
    
    let html = ''
    
    html += '<div class="col-12" data-show="unlockedOrExist" data-object="' + unit.id + '">'
    html += '</div>'
    
    return html
}

function getHtmlTerritory(territory) {
    
    let html = ''
    
    html += '<div class="col-12" data-show="unlockedNotBuilt" data-object="' + territory.id + '">'
    html += '</div>'
    
    return html
}

function getHtmlObjective(objective) {
    
    let html = ''
    
    html += '<div class="col-12" data-show="unlockedNotBuilt" data-object="' + objective.id + '">'
        html += '<div class="card">'
            html += '<div class="card-header">'
                html += '<div class="row gx-2 align-items-center">'
                    html += '<div class="col">'
                        html += '<span class="h6">' + trans.translate(objective.id) + '</span>'
                    html += '</div>'
                html += '</div>'
            html += '</div>'
            html += '<div class="card-body">'
                html += '<div class="row g-1">'
                    for (let id in objective.check) {
                        html += '<div class="col-12">'
                            if (game.obj(id).uiId == 'houses') { html += '<span>&middot; Build ' + objective.check[id] + ' ' + trans.translate(id) + '</span>' }
                            else if (game.obj(id).uiId == 'prods') { html += '<span>&middot; Build ' + objective.check[id] + ' ' + trans.translate(id) + '</span>' }
                            else if (game.obj(id).uiId == 'techs') { html += '<span>&middot; Research ' + trans.translate(id) + '</span>' }
                        html += '</div>'
                    }
                html += '</div>'
            html += '</div>'
            html += '<div class="card-footer">'
                html += '<div class="row gx-2 justify-content-end">'
                    html += '<div class="col-auto">'
                        html += getHtmlCheck(objective, 'Next')
                    html += '</div>'
                html += '</div>'
            html += '</div>'
        html += '</div>'
    html += '</div>'
    html += '<div class="col-12" data-show="unlockedBuilt" data-object="' + objective.id + '">'
        html += '<div class="row gx-2 align-items-center">'
            html += '<div class="col">'
                html += '<span class="fw-bold">' + trans.translate(objective.id) + '</span>'
            html += '</div>'
            html += '<div class="col-auto">'
                html += '<span class="text-success"><i class="fa-fw fas fa-check-circle"></i></span>'
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

function canAssign(objId) {
    
    let obj = game.obj(objId)

    if (obj.isUnlocked == false) { return false }
    
    if (obj.count >= obj.stock) { return false }
    
    if (obj.using) {
        
        let using = obj.using
        for (let usingId in using) {
            
            let usingCount = using[usingId]
            if (usingCount > game.obj(usingId).availableCount) { return false }
        }
    }
    
    return true
}

function canUnassign(objId) {
    
    let obj = game.obj(objId)

    if (obj.isUnlocked == false) { return false }
    
    if (obj.count < 1) { return false }
    
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

function clickAssign(count, objId) {
    if (canAssign(objId) == true) {
        
        let obj = game.obj(objId)
        
        if (obj.using) {
            
            let using = obj.using
            for (let usingId in using) {
                
                let usingCount = using[usingId]
                count = Math.min(count * usingCount, game.obj(usingId).availableCount)
            }
        }
        
        count = Math.min(count, obj.stock - obj.count)
        
        obj.count += count
    }
}

function clickUnassign(count, objId) {
    if (canUnassign(objId) == true) {
                
        let obj = game.obj(objId)
        
        count = -Math.min(-count, obj.count)
        obj.count += count
    }
}

function clickCheck(objId) {
    if (canCheck(objId) == true) {
        
        let obj = game.obj(objId)
        obj.count += 1
    }
}