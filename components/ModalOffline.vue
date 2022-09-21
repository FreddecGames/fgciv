<template>
    <div class="modal fade show d-block" @click="close">
        <div class="modal-dialog">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <span class="h6">Offline Gains</span>
                    <button type="button" class="btn p-0" @click="close">
                        <i class="fas fa-fw fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="text-center text-muted">Welcome back!</div>
                    <div class="text-center">You were away <FormatTime :value="seconds" /></div>
                </div>
                <div class="modal-footer justify-content-center">
                    <button type="button" class="btn btn-secondary" @click="close">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    
    props: [ 'data' ],
    
    computed: {
    
        seconds() { return Math.floor(this.data / 1000) },
    },
    
    methods: {
    
        ...mapMutations([ 'hideModal' ]),
        
        close() { this.hideModal() },
    },
}
</script>