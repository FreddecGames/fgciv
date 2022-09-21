<template>
    <div class="modal fade show d-block" @click="close">
        <div class="modal-dialog">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <span class="h6">Start a new Run</span>
                    <button type="button" class="btn p-0" @click="close">
                        <i class="fas fa-fw fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-2">Choose the world you want for your new Run</div>
                    <div class="row justify-content-center">
                        <div class="col-9">
                            <button v-for="world in worlds" :key="world" type="button" class="w-100 btn btn-secondary py-2" :class="{ 'border-primary':world == selectedWorld }" @click="select(world)">
                                <div class="flex-fill text-start text-wrap">
                                    <div class="h6">{{ $t('world_' + world) }}</div>
                                    <div class="small text-muted">{{ $t('worldDesc_' + world) }}</div>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <span class="text-danger">By starting a new Run, you will lose your current progression. You cannot have multiple Runs at the same time.</span>
                    </div>
                </div>
                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-secondary" @click="close">
                        Close
                    </button>
                    <button type="button" class="btn btn-danger" :class="{ 'disabled':!selectedWorld }" @click="start">
                        Start
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    
    data() {
        return {
        
            worlds: [ 'world1' ],
            
            selectedWorld: null,
        }
    },
    
    methods: {
    
        ...mapMutations([ 'hideModal', 'startNewRun' ]),
        
        select(world) { this.selectedWorld = world },
        
        close() { this.hideModal() },
        
        start() {
        
            this.startNewRun({ worldId:this.selectedWorld })
            this.hideModal()
        },
    },
}
</script>