<template>
    <span>{{ date }}</span>
</template>

<script>
export default {

    props: [ 'value' ],
    
    computed: {
        
        date: function() {
            
            let ret = ''
            ret += this.value.getFullYear() + '-'
            ret += (this.value.getMonth() + 1) + '-'
            ret += this.value.getDate() + ' '
            ret += this.value.getHours() + ':'
            ret += this.value.getMinutes() + ':'
            ret += this.value.getSeconds()
            
            return ret
        },
    },
}
</script>