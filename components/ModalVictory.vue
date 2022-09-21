<template>
    <div class="modal fade show d-block" @click="close">
        <div class="modal-dialog">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <span class="h6">Victory</span>
                    <button type="button" class="btn p-0" @click="close">
                        <i class="fas fa-fw fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="text-center h5">Congratulations</div>
                    <div class="text-center text-muted">You beat this world!</div>
                    <div class="mt-3 text-center text-muted">
                        <img :src="require(`~/assets/img/victory.png`)" width="32px" height="32px" />
                    </div>
                    <div class="mt-3 text-center text-muted">You escape from this hostile planet in</div>
                    <div class="text-center h5"><FormatTime :value="currentRun.winningTime" /></div>
                    <div class="mt-3 text-center text-primary">Now you have the choice to continue playing in this world and to try to beat another world by making a new Run and choosing a different world.</div>
                </div>
                <div class="modal-footer justify-content-center">
                    <button type="button" class="btn btn-light" @click="close">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {

    computed: {
    
        ...mapState([ 'currentRun' ]),
    },
    
    methods: {
    
        ...mapMutations([ 'hideModal' ]),
        
        close() { this.hideModal() },
    },
}
</script>