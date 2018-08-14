<template>
<div>
    <div class="my_title top_bg">
    </div>
    <PullDownList></PullDownList>
</div>
</template>
<script>
import PullDownList from '@/components/baselist/PullDownList'

export default {
    name: 'Steward',
    components: {
        PullDownList
    },
    data() {
        return {
        };
    },
    mounted() {
        this.checkDeviceOnline(this.$route.query.openid);
    },
    methods: {
        
    }
}
</script>
<style type="text/css" scoped>
.top_bg{
    /* background: url(../../../../images/banner.png) center center; */
    background-size: 100%;
}
</style>