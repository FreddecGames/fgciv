<template>
    <div class="modal fade show d-block" @click="close">
        <div class="modal-dialog">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <span class="h6">Support</span>
                    <button type="button" class="btn p-0" @click="close">
                        <i class="fas fa-fw fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-12 text-center">
                            <span class="text-muted">I like the donation system because there is nothing forcing you to donate other than out of the goodness of people's hearts. If you like the game and want more content faster, I would be happy to put more time towards this game if I felt that it is paying off.</span>
                        </div>
                        <div class="col-4 text-center">
                            <a href="https://www.patreon.com/bePatron?u=61283131" target="_blank" class="w-100 btn btn-secondary py-2" style="width:80px;">
                                <div class="col-12"><img :src="require(`~/assets/ui/patreon.png`)" width="24px" height="24px" /></div>
                                <div class="mt-2">Become a supporter</div>
                            </a>
                        </div>
                        <div class="col-4 text-center">
                            <a href="https://ko-fi.com/freddecgames" target="_blank" class="w-100 btn btn-secondary py-2" style="width:80px;">
                                <div class="col-12"><img :src="require(`~/assets/ui/kofi.png`)" width="24px" height="24px" /></div>
                                <div class="mt-2">Buy me a Ko-fi</div>
                            </a>
                        </div>
                        <form class="col-4 text-center" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                            <input type="hidden" name="cmd" value="_s-xclick">
                            <input type="hidden" name="hosted_button_id" value="7XYD7SJFKQ8M4">
                            <button type="submit" class="w-100 btn btn-secondary py-2">
                                <div class="col-12"><img :src="require(`~/assets/ui/paypal.png`)" width="24px" height="24px" /></div>
                                <div class="mt-2">Make a donation</div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    
    methods: {
    
        ...mapMutations([ 'hideModal' ]),
        
        close() { this.hideModal() },
    },
}
</script>