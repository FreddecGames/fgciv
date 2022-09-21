<template>
    <div class="modal fade show d-block" @click="close">
        <div class="modal-dialog">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <span class="h6">Wipe Local Data</span>
                    <button type="button" class="btn p-0" @click="close">
                        <i class="fas fa-fw fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="text-center">Are you sure to wipe your local data ?</div>
                    <div class="text-danger text-center">You will lost all your progression and restart from the beginning</div>
                </div>
                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-secondary" @click="close">
                        Close
                    </button>
                    <button type="button" class="btn btn-danger" @click="wipe">
                        Wipe
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {

    methods: {
    
        ...mapMutations([ 'hideModal', 'wipeLocalData' ]),
        
        close() { this.hideModal() },
        
        wipe() { this.wipeLocalData() },
    },
}
</script>