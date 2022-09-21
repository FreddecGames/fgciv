<template>
    <div class="w-100 h-100">
    
        <div v-if="isMobile == true" class="position-absolute bg-grid top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center">
            <div class="p-4">
                <div class="row g-4">
                    <div class="col-12 text-center">
                        <img :src="require(`~/assets/logo.png`)" width="64px" height="64px" />
                    </div>
                    <div class="col-12 mt-2 text-center">
                        <div class="h4">FG Civ</div>
                    </div>
                    <div class="col-12 text-center">
                        <span class="text-danger">Your device is not supported for the moment.</span>
                    </div>
                    <div class="col-12 text-normal text-center">
                        <span class="text-muted">To be informed when your device will be supported and new features will be ready, please join Discord server.</span>
                    </div>
                    <div class="col-12 mt-2 d-flex justify-content-center">
                        <div class="col-12 d-flex justify-content-center">
                            <a href="https://discord.gg/3UkgeeT9CV" target="_blank" class="btn btn-primary">
                                <span><i class="fab fa-fw fa-discord"></i></span>
                                <span class="ms-1">Discord</span>
                            </a>
                        </div>
                    </div>                
                </div>
            </div>
        </div>
        
        <div v-if="isMobile == false && started == false" class="position-absolute top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center">
            <div class="p-4">
                <div class="row g-4">
                    <div class="col-12 text-center">
                        <img :src="require(`~/assets/logo.png`)" width="64px" height="64px" />
                    </div>
                    <div class="col-12 mt-2 text-center">
                        <div class="h4">FG Civ</div>
                    </div>
                    <div v-if="error == null" class="col-12 mt-2 flicker text-center">
                        <span class="text-primary">Initializing game...</span>
                    </div>
                    <div v-if="error != null" class="col-12 text-center">
                        <div class="row g-4">
                            <div class="col-12 text-center">
                                <div class="text-danger">An error occured during game loading</div>
                                <div class="text-danger">"{{ this.error }}"</div>
                            </div>
                            <div class="col-12">
                                <span class="text-muted">To ask for help, you could contact <span class="h6 text-white">Freddec</span> on Discord with following exported data</span>
                            </div>
                            <div class="col-12 mt-2 d-flex justify-content-center">
                                <a href="https://discord.gg/3UkgeeT9CV" target="_blank" class="btn btn-primary">
                                    <span><i class="fab fa-fw fa-discord"></i></span>
                                    <span class="ms-1">Discord</span>
                                </a>
                            </div>
                            <div class="col-12 d-flex justify-content-center">
                                <textarea spellcheck="false" rows="5" class="form-control" style="max-width:512px;">{{ localData }}</textarea>
                            </div>
                            <div class="col-12 mt-2">
                                <div class="row gx-2 align-items-center justify-content-center">
                                    <div class="col-auto">
                                        <button type="button" class="btn btn-primary" @click="clickExport">
                                            <span><i class="fas fa-fw fa-copy"></i></span>
                                            <span>Copy to clipboard</span>
                                        </button>
                                    </div>
                                    <div class="col-auto">
                                        <button type="button" class="btn btn-primary" @click="clickDownload">
                                            <span><i class="fas fa-fw fa-download"></i></span>
                                            <span>Download TXT file</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <span class="text-muted">Or you could wipe your local data to restart the game from the beginning</span>
                            </div>
                            <div class="col-12 mt-2 d-flex justify-content-center">
                                <button type="button" class="btn btn-danger" @click="showWipeModal">
                                    <span><i class="fas fa-fw fa-skull"></i></span>
                                    <span class="ms-1">Wipe Local Data</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="toastText" class="position-absolute end-0 bottom-0">
                <div class="alert mb-3 me-3 text-end" :class="{ 'alert-info':toastType == 'info', 'alert-danger':toastType == 'danger', 'alert-success':toastType == 'success' }">
                    <span v-html="toastText" class="fw-bold"></span>
                </div>
            </div>
        </div>
        
        <div v-if="isMobile == false && started == true" class="w-100 h-100">
            <div class="h-100 container p-0 d-flex flex-column position-relative shadow">
                <div class="col-12">
                    <div class="bg-dark">
                        <div id="top-bar" class="px-4 pb-3">
                            <div class="flex-fill row gx-4 align-items-center">
                                <div class="col-auto">
                                    <img :src="require(`~/assets/logo.png`)" width="24px" height="24px" />
                                </div>
                                <div class="col-auto ps-0">
                                    <span class="h4">FG Civ</span>
                                </div>
                                <div class="col-auto">
                                    <span class="badge bg-danger">Alpha Version</span>
                                </div>
                                <div class="col text-end">
                                    <div class="small text-muted">Current World</div>
                                    <div>{{ $t('world_' + worldId) }}</div>
                                </div>
                            </div>
                        </div>
                        <div id="tabs-bar">
                            <div class="w-100 nav nav-tabs">
                                <div class="nav-item"><NuxtLink to="/" class="nav-link"><i class="fas fa-fw fa-home me-2"></i>Home</NuxtLink></div>
                                <div class="ms-auto nav-item"><NuxtLink to="/runs" class="nav-link"><i class="fas fa-fw fa-sync me-2"></i>Runs</NuxtLink></div>
                                <div class="nav-item"><NuxtLink to="/settings" class="nav-link"><i class="fas fa-fw fa-cogs me-2"></i>Settings</NuxtLink></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="content-bar" class="col-12 position-relative scrollbar">
                    <div class="h-100 p-3">
                        <Nuxt />
                    </div>
                </div>
                <div id="bottom-bar" class="col-12 bg-dark px-3">
                    <div class="flex-fill">
                        <div class="row gx-3 align-items-center">
                            <div class="col-auto">
                                <button type="button" class="btn btn-secondary" @click="manualSave">
                                    <span><i class="fas fa-fw fa-save"></i></span>
                                    <span class="ms-1">Save</span>
                                </button>
                            </div>
                            <div class="col-auto">
                                <button type="button" class="btn btn-secondary" @click="showSupportModal">
                                    <span><i class="fas fa-fw fa-hand-holding-heart"></i></span>
                                    <span class="ms-1">Support</span>
                                </button>
                            </div>
                            <div class="ms-auto col-auto text-end">
                                <div class="text-muted small">Time Played</div>
                                <div><FormatTime :value="timePlayed" /></div>
                            </div>
                            <div v-if="!paused" class="col-auto">
                                <button type="button" class="btn btn-secondary" @click="pauseGame">
                                    <span><i class="fas fa-fw fa-pause"></i></span>
                                    <span class="ms-1">Pause</span>
                                </button>
                            </div>
                            <div v-if="paused" class="col-auto">
                                <button type="button" class="btn btn-primary" @click="resumeGame">
                                    <span><i class="fas fa-fw fa-play"></i></span>
                                    <span class="ms-1">Resume</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="toastText" class="position-absolute end-0" style="bottom:48px;">
                    <div class="alert mb-3 me-3 text-end" :class="{ 'alert-info':toastType == 'info', 'alert-danger':toastType == 'danger', 'alert-success':toastType == 'success' }">
                        <span v-html="toastText" class="fw-bold"></span>
                    </div>
                </div>
            </div>
        </div>
        
        <ModalRun v-if="modalType == 'run'" />
        <ModalWipe v-if="modalType == 'wipe'" />
        <ModalSupport v-if="modalType == 'support'" />
        <ModalOffline v-if="modalType == 'offline'" :data="modalData" />
        <ModalVictory v-if="modalType == 'victory'" />
        
        <div v-if="modalType || modalData" class="modal-backdrop fade show" />
        
    </div>
</template>

<script>
import LZString from 'lz-string'

import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
    
    data() {
        return {
            
            fps: 60,
            error: null,
            started: false,
            isMobile: false,
            rafHandle: null,
            autoSaveDelay: 30000,
            lastFrameTimeMs: new Date().getTime(),
            minLoadingTimerMS: 1000,
        }
    },
    
    computed: {
        
        ...mapState([
            'worldId',
            'modalData', 'modalType', 'toastText', 'toastType', 'toastTimeout', 
            'paused', 'victory', 'timePlayed', 'resetInProgress', 'localStorageName', 
        ]),
        
        ...mapGetters([
            'localData', 'dataToSave', 'victoryReached',
        ]),
    },
    
    methods: {
        
        ...mapMutations([
            'showToast', 'showModal', 'setPaused', 'setVictory', 'setTimePlayed', 'setWinningTime', 'startNewRun', 'loadLocalData',
        ]),
        
        start() {
            
            try {
            
                this.load()
                
                let currentTimeMs = new Date().getTime()
                let deltaTimeMs = currentTimeMs - this.lastFrameTimeMs
                if (deltaTimeMs > 15 * 60 * 1000) {
                    this.showModal({ type:'offline', data:deltaTimeMs })
                }

                this.update()
                                
                window.onbeforeunload = () => {
                    if (!this.resetInProgress)
                        this.save()
                }
                
                this.rafHandle = requestAnimationFrame(this.update)
                this.saveInterval = setInterval(() => { this.save() }, this.autoSaveDelay)
                
                this.started = true
            }
            catch (error) {
                
                this.error = error                
                console.error(error)
            }
        },

        load() {
            
            let loadedData = localStorage.getItem(this.localStorageName)
            if (loadedData && loadedData !== null && loadedData.length % 4 == 0) {
            
                let text = LZString.decompressFromBase64(loadedData)
                if (!text) return console.warn('Load failed')
                loadedData = JSON.parse(text)
                
                if (loadedData.worldId) {
                    
                    this.startNewRun({ worldId:loadedData.worldId })
                    this.loadLocalData(loadedData)
                    
                    if (loadedData.lastFrameTimeMs != null) {
                        this.lastFrameTimeMs = loadedData.lastFrameTimeMs
                    }
                }
            }
            else {
                this.startNewRun({ worldId:'world1' })
            }
        },
        
        save() {
            
            let savedData = this.dataToSave            
            savedData.lastFrameTimeMs = this.lastFrameTimeMs
            
            let text = JSON.stringify(savedData)
            let compressed = LZString.compressToBase64(text)
            localStorage.setItem(this.localStorageName, compressed)
        },

        update() {
            
            this.rafHandle = requestAnimationFrame(this.update)
            
            let currentTimeMs = new Date().getTime()
            
            let deltaTimeMs = currentTimeMs - this.lastFrameTimeMs
            if (deltaTimeMs >= 1000 / this.fps) {            
            
                this.lastFrameTimeMs = currentTimeMs
                
                if (this.paused) return
                
                let elapsedSeconds = deltaTimeMs / 1000
                                                
                this.setTimePlayed(this.timePlayed + elapsedSeconds)
                
                if (this.victoryReached == true) {
                
                    this.setVictory(true)
                    this.setWinningTime(this.timePlayed)
                    
                    this.showModal({ type:'victory', data:null })
                }                
            }
        },
        
        //---
        
        clickExport() {
            
            navigator.clipboard.writeText(this.localData)
            this.showToast({ text:'Game data copied in clipboard!', type:'info' })
        },
        
        clickDownload() {
        
            var element = document.createElement('a')
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.localData))
            element.setAttribute('download', 'FGCiv_save_' + (new Date).getTime() + '.txt')

            element.style.display = 'none'
            document.body.appendChild(element)

            element.click()

            document.body.removeChild(element)
        },
        
        //---
        
        manualSave() {
        
            this.save()
            this.showToast({ text:'Game saved in local storage!', type:'info' })
        },
        
        pauseGame() { this.setPaused(true) },
        
        resumeGame() { this.setPaused(false) },
        
        //---
        
        showWipeModal() { this.showModal({ type:'wipe', data:null }) },
        
        showSupportModal() { this.showModal({ type:'support', data:null }) },
    },

    created() {
    
        let txt = navigator.userAgent || navigator.vendor || window.opera
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(txt)) {
            this.isMobile = true
        }
        
        if (this.isMobile == false) {
            setTimeout(() => { this.start() }, this.minLoadingTimerMS)
        }
    },

    beforeDestroy() {
    
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout)
        }
        
        clearInterval(this.saveInterval)
        cancelAnimationFrame(this.rafHandle)
    },
}
</script>
