import Run from '@/store/models/Run.js'

import World1Data from '@/store/data/world1.json'

export const state = () => ({
    
    lastRuns: [],
    currentRun: null,
    
    toastText: '',
    toastType: 'info',
    toastTimeout: null,
    
    modalData: null,
    modalType: '',

    worldId: '',
    worldData: {},

    paused: false,
    victory: false,
    timePlayed: 0,
    resetInProgress: false,
    localStorageName: 'fgciv',    
})

export const mutations = {
    
    setPaused(state, value) { state.paused = value },    
    setVictory(state, value) { state.victory = value },
    setWinningTime(state, value) { state.currentRun.winningTime = value },
    setTimePlayed(state, value) { state.timePlayed = value },
    setResetInProgress(state, value) { state.resetInProgress = value },
    
    startNewRun(state, data) {
        
        if (state.currentRun) {
            
            let run = new Run()
            run.worldId = state.currentRun.worldId
            run.timePlayed = state.timePlayed
            run.winningTime = state.currentRun.winningTime
            run.startingDate = state.currentRun.startingDate        
            state.lastRuns.push(run)
        }
        
        state.paused = false
        state.victory = false
        state.timePlayed = 0
        
        state.currentRun = new Run()
        state.currentRun.worldId = data.worldId
        state.currentRun.startingDate = new Date(Date.now())
        state.currentRun.timePlayed = null
        state.currentRun.winningTime = null

        state.worldId = data.worldId        
        if (data.worldId == 'world1') state.worldData = World1Data
        else {
            
            console.log('unknow world id: ' + data.worldId)
            return
        }
    },
    
    loadLocalData(state, data) {
        
        if (data.paused) state.paused = true
        if (data.victory) state.victory = true
        if (data.timePlayed) state.timePlayed = data.timePlayed        
        
        if (data.currentRun) {
            
            if (data.currentRun.worldId) state.currentRun.worldId = data.currentRun.worldId
            if (data.currentRun.winningTime) state.currentRun.winningTime = data.currentRun.winningTime
            if (data.currentRun.startingDate) state.currentRun.startingDate = new Date(data.currentRun.startingDate)
        }
    
        state.lastRuns = []
        if (data.lastRuns) {
            data.lastRuns.forEach(loadedData => {
                
                let run = new Run()
                run.worldId = loadedData.worldId
                run.timePlayed = loadedData.timePlayed
                run.winningTime = loadedData.winningTime
                run.startingDate = new Date(loadedData.startingDate)
                
                state.lastRuns.push(run)
            })
        }        
    },
    wipeLocalData(state) {
        
        state.resetInProgress = true
        
        localStorage.removeItem(state.localStorageName)
        window.location.replace('/fgciv/')
    },
    importToLocalData(state, data) {
        
        state.resetInProgress = true
        
        localStorage.setItem(state.localStorageName, data)
        window.location.replace('/fgciv/')
    },
    
    showToast(state, data) {
        
        if (state.toastTimeout) {
            clearTimeout(state.toastTimeout)
        }
        
        state.toastText = data.text
        state.toastType = data.type
        
        const self = this
        state.toastTimeout = setTimeout(function() { self.commit('hideToast') }, 3e3)
    },    
    hideToast(state) {
        
        state.toastText = null
        state.toastType = null
    },

    showModal(state, data) {
        
        state.modalData = data.data
        state.modalType = data.type
    },    
    hideModal(state) {
        
        state.modalData = null
        state.modalType = null
    },
}

export const getters = {
    
    localData: (state) => {
    
        let text = localStorage.getItem(state.localStorageName)
        return text
    },

    dataToSave: (state) => {
        
        let ret = {
            
            lastRuns: [],
            currentRun: {},
            
            worldId: state.worldId,
            
            paused: state.paused,
            victory: state.victory,
            timePlayed: state.timePlayed,
        }
        
        ret.currentRun.worldId = state.currentRun.worldId
        ret.currentRun.winningTime = state.currentRun.winningTime
        ret.currentRun.startingDate = state.currentRun.startingDate
        
        state.lastRuns.forEach(run => {
            
            let savedData = {}
            savedData.worldId = run.worldId
            savedData.timePlayed = run.timePlayed
            savedData.winningTime = run.winningTime
            savedData.startingDate = run.startingDate
            
            ret.lastRuns.push(savedData)
        })
                
        return ret
    },
    
    victoryReached: (state) => {
        
        if (state.victory == true) {
            return false
        }
        
        return false
    },    
}