<template>
    <div class="h-100">
        <div class="row g-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <span class="h6">Current Run</span>
                    </div>
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-3">
                                <div class="small text-muted">World</div>
                                <div>{{ $t('world_' + currentRun.worldId) }}</div>
                            </div>
                            <div class="col-3">
                                <div class="small text-muted">Starting Date</div>
                                <div><FormatDate :value="currentRun.startingDate" /></div>
                            </div>
                            <div class="col-3">
                                <div class="small text-muted">Time Played</div>
                                <div><FormatTime :value="timePlayed" /></div>
                            </div>
                            <div class="col">
                                <div class="small text-muted">Winning Time</div>
                                <div v-if="currentRun.winningTime">
                                    <img :src="require(`~/assets/img/victory.png`)" width="16px" height="16px" class="me-2" />
                                    <FormatTime :value="currentRun.winningTime" />
                                </div>
                                <div v-if="!currentRun.winningTime">---</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-2 text-end">
                    <button type="button" class="btn btn-primary" @click="start">
                        <i class="fas fa-fw fa-play"></i>
                        Start a new Run
                    </button>
                </div>
            </div>
            <div v-if="lastRuns.length > 0"class="col-12">
                <div class="card">
                    <div class="card-header">
                        <span class="h6">Last Runs</span>
                    </div>
                    <div class="list-group list-group-flush">
                        <div v-for="run in lastRuns" class="list-group-item">
                            <div class="row align-items-center">
                                <div class="col-3">
                                    <div class="small text-muted">World</div>
                                    <div>{{ $t('world_' + run.worldId) }}</div>
                                </div>
                                <div class="col-3">
                                    <div class="small text-muted">Starting Date</div>
                                    <div><FormatDate :value="run.startingDate" /></div>
                                </div>
                                <div class="col-3">
                                    <div class="small text-muted">Time Played</div>
                                    <div><FormatTime :value="run.timePlayed" /></div>
                                </div>
                                <div class="col">
                                    <div class="small text-muted">Winning Time</div>
                                    <div v-if="run.winningTime">
                                        <img :src="require(`~/assets/img/victory.png`)" width="16px" height="16px" class="me-2" />
                                        <FormatTime :value="run.winningTime" />
                                    </div>
                                    <div v-if="!run.winningTime">---</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
    
    computed: {
        
        ...mapState([ 'currentRun', 'timePlayed', 'lastRuns' ]),        
    },
    
    methods: {
        
        ...mapMutations([ 'showModal' ]),
    
        start() { this.showModal({ type:'run', data:null }) },
    },
}
</script>
