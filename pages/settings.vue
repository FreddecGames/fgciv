<template>
    <div class="h-100 position-relative">
        <div class="row g-3">
            <div class="col-6">
                <div class="h-100 card">
                    <div class="card-header">
                        <span class="h6">About</span>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-12 text-center">
                                <span class="text-muted">This game has been designed and built with all the <i class="text-danger fas fa-heart"></i> love in the world by <span class="text-white">Freddec</span>!</span>
                            </div>
                            <div class="col-12">
                                <div class="row align-items-center justify-content-center">
                                    <div class="col-auto">
                                        <a href="https://discord.gg/3UkgeeT9CV" target="_blank" class="btn btn-secondary">
                                            <span><i class="fab fa-fw fa-discord"></i></span>
                                            <span class="ms-1">Discord</span>
                                        </a>
                                    </div>
                                    <div class="col-auto">
                                        <button type="button" class="btn btn-secondary" @click="showSupportModal">
                                            <span><i class="fas fa-hand-holding-heart"></i></span>
                                            <span class="ms-1">Support</span>
                                        </button>
                                    </div>
                                    <div class="col-auto">
                                        <a href="https://freddecgames.com/" target="_blank" class="btn btn-secondary">
                                            <span><img :src="require(`~/assets/ui/freddec.png`)" width="16px" height="16px" /></span>
                                            <span class="ms-1">Freddec Games</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 text-center">
                                <span class="text-muted">Icons are provided by <a href="https://www.flaticon.com/" target="_blank">Flaticon</a>, <a href="https://fontawesome.com/" target="_blank">Fontawesome</a> and <a href="https://icons8.com/" target="_blank">Icons8</a></span>
                            </div>
                            <div class="border-top col-12 pt-2 text-center">
                                <div class="text-normal mb-2"><span class="badge bg-danger">Alpha version</span></div>
                                <div class="text-danger">This game is still under development with bugs and maybe data lost! Play as your own risks!</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="h-100 card">
                    <div class="card-header">
                        <span class="h6">History</span>
                    </div>
                    <div class="card-body">
                        <p class="text-muted">CivClicker was originally built by <span class="text-white">David Holley</span> in 2013-14. He stated he didn't intend to develop it further, so it was then maintained by <span class="text-white">Scott Colcord</span> for part of 2014. Since then no new updates have been made to the repo, so <span class="text-white">Luke Nickerson</span> forked it on GitHub to make some improvements and potentially inspire others to contribute. It was not the case... :(</p>
                        <p class="mt-3 text-muted"><span class="text-white">Freddec</span> decided to make a new version of this great game in 2022 by using modern technologies. You are playing this version :)</p>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="card">
                    <div class="card-header">
                        <span class="h6">Import Save</span>
                    </div>
                    <div class="card-body">
                        <textarea spellcheck="false" rows="5" class="form-control" v-model="importData"></textarea>
                        <div class="mt-3 text-end">
                            <button type="button" class="btn btn-primary" @click="clickImport">
                                <i class="fas fa-fw fa-file-import"></i>
                                <span>Import</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="card">
                    <div class="card-header">
                        <span class="h6">Export Save</span>
                    </div>
                    <div class="card-body">
                        <textarea spellcheck="false" rows="5" class="form-control" disabled readonly>{{ localData }}</textarea>                                        
                        <div class="mt-3 row gx-2 align-items-center justify-content-end">
                            <div class="col-auto">
                                <button type="button" class="btn btn-primary" @click="clickExport">
                                    <i class="fas fa-fw fa-copy"></i>
                                    <span>Copy to clipboard</span>
                                </button>
                            </div>
                            <div class="col-auto">
                                <button type="button" class="btn btn-primary" @click="clickDownload">
                                    <i class="fas fa-fw fa-download"></i>
                                    <span>Download TXT file</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 text-end">
                <button type="button" class="btn btn-danger" @click="showWipeModal">
                    <span><i class="fas fa-fw fa-skull"></i></span>
                    <span class="ms-1">Wipe Local Data</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {

    data() {
        return {
        
            importData: null,
        }
    },
    
    computed: {
        
        ...mapGetters([ 'localData' ]),
    },
    
    methods: {
        
        ...mapMutations([ 'showModal', 'showToast', 'importToLocalData' ]),
    
        clickImport() {
            
            if (!this.importData || !this.importData.trim()) return this.showToast({ text:'No data to import!', type:'danger' })
            if (this.importData.length % 4 !== 0) return this.showToast({ text:'Data corrupted!', type:'danger' })
            
            this.importToLocalData(this.importData)
        },
        
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
        
        showWipeModal() { this.showModal({ type:'wipe', data:null }) },
        
        showSupportModal() { this.showModal({ type:'support', data:null }) },
    },
}
</script>
