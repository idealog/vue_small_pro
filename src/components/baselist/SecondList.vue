<template>
    <ul>
        <li v-for="s_it in s_list" @click.stop="push(s_it)">
            <div class="sec_item no_border">
                <span class="sec_title">{{s_it}}</span><i class="push"></i>
            </div>
        </li>
    </ul>
</template>
<script>
import '@/assets/css/base_list'

export default {
    name: 'SecondList',
    props: {
        s_list: Array,
        push_func: Function
    },
    data() {
        return {}
    },
    methods: {
        push(item){
            if(this.push_func){
                this.push_func(item);
                return;
            }
            if(this.$store.state.device_online_state){
                this.axios({
                    method: 'post',
                    url: `${this.HOST}/api/v1/qly/msg`,
                    data: {
                        openid: this.$route.query.openid,
                        content: {
                            'action': 'steward',
                            'data': item
                        }
                    }
                }).then(res => {
                    if(res.status === 200){
                        this.$toast('已推送给设备');
                    }
                });
            }else{
                this.$toast('设备不在线');
            }
        }
    }
}
</script>
<style type="text/css" scoped>
li{
    height: auto;
    padding: 0 1rem;
    position: relative;
}
.sec_title{
    float: none;
    color: #000;
    font-size: 1.4rem;
    max-width: 15rem;
}
.sec_title:before{
    content: '';
    display: inline-block;
    background: #000;
    border-radius: 50%;
    margin-bottom: 0.2rem;
    width: .5rem;
    height: .5rem;
    margin-right: 1rem;
}
.sec_item{
    display: flex;
    align-items:center;
    justify-content: space-between;
    height: 5rem;
}
.no_border:before{
    display: none;
}
.push{
    width: 1.8rem;
    height: 1.8rem;
    /* background: url(../../../../images/push_new.png) center center no-repeat; */
    background-size: 100%;
}
</style>