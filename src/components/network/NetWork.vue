<template>
    <div class="main wx_main">
        <!-- banner -->
        <template v-if="$route.params.subname === 'home'">
            <Banner :url="banner_img_url"></Banner>
           <!--  <span class="banner_button" @click="toProductPage">选择产品</span> -->
        </template>
        <template v-else>
            <div class="net_video">
                <Banner :url="banner_img_url"></Banner>
            </div>
        </template>

        <!-- instruction -->
        <Instruction :instruction="instruction" :tips_text="tips_text" :click="showTips"></Instruction>

        <!-- choose -->
        <template v-if="$route.params.subname === 'home'">
            <div class="shake-horizontal" :class="{run: run}" style="margin:-14vh 0 3vh 0" @click="select('air1')">
                <span class="wx_checkbox" :class="{ on: next_url ==='air1' }"></span><span class="wxc">微信联网</span>
            </div>
            <div class="shake-horizontal" :class="{run: run}" @click="select('ap1')">
                <span class="wx_checkbox" :class="{ on: next_url ==='ap1' }"></span><span class="wxc">热点联网</span>
            </div>

            <div class="tips" style="margin-top:5.5vh;padding-left:1vh;margin-right:1vh">
                提示：<span class="em_font">微信联网</span>简单快捷，<span class="em_font">热点联网</span>成功率高
            </div>
        </template>
        <template v-if="$route.params.subname === 'ap1'">
            <div class="shake-horizontal" :class="{run: run}" @click="select('ap2')">
                <span class="wx_checkbox" :class="{ on: next_url ==='ap2' }"></span>
                <span class="wxc">听到提示“开始热点联网”</span>
            </div>
        </template>
         <!-- <template v-if="$route.params.subname === 'ap1'">
            <div class="shake-horizontal" @click="showApTip()">
                <span class="wx_checkbox" :class="{on : ap_not_connected}"></span>
                <span class="wxc">没有提示“开始热点联网”</span>
            </div>
                 </template> -->
        <template v-if="$route.params.subname === 'ap2'">
            <div class="shake-horizontal" :class="{run: run}" @click="select('ap3')">
                <span class="wx_checkbox" :class="{ on: next_url ==='ap3' }"></span>
                <span class="wxc">手机已连接到<span class="em_font">“ROBOT-XXXX”</span></span>
            </div>
        </template>
        <!-- <template v-if="$route.params.subname === 'ap2'">
            <div class="shake-horizontal" @click="showApTip()">
                <span class="wx_checkbox" :class="{on : ap_not_connected}"></span>
                <span class="wxc">手机未连接到<span class="em_font">“BIRD-XXXX”</span></span>
            </div>
        </template> -->
        <template v-if="$route.params.subname === 'air1'">
            <div class="shake-horizontal" :class="{run: run}" @click="select('air2')">
                <span class="wx_checkbox" :class="{ on: next_url ==='air2' }"></span>
                <span class="wxc">已经进入微信联网</span>
            </div>
        </template>
        <!-- <template v-if="$route.params.subname === 'air1'">
            <div class="shake-horizontal" @click="showAirTip()">
                <span class="wx_checkbox" :class="{ on: air_not_entered }"></span>
                <span class="wxc">没有进入微信联网</span>
            </div>
        </template> -->

        <!-- next -->
        <div class="wx_btn" :class="{'next-home': $route.params.subname === 'home'}" @click="nextStep">下一步</div>

        <!-- pop -->
        <component :is="pop_component" v-on:cancel="finish" :title="pop_title" :content="pop_content">
        </component>
    </div>
</template>
<script>
import "@/assets/css/network"
import Banner from "../banner/Banner"
import Pop from "../pop/Pop"

let Instruction = {
    render: function (h) {
        // 这段兼容某些页面a标签不需要click事件
        let click = a => a;
        this.tips_text && (click = this.click);

        return h(
                'div',
                [
                    h('p', {
                        'class': {
                            "wx_msg tp": true
                        },
                        domProps: {
                            innerHTML: this.instruction
                        }
                    }),
                    h('a', {
                        'style': {
                            "visibility": "hidden"
                        },
                        domProps: {
                            innerHTML: this.tips_text
                        },
                        on: {
                            click: click
                        },
                    }),
                ]
            );
    },
    props: {
        instruction: {
            type: String,
        },
        tips_text: {
            type: String,
        },
        click: {
            type: Function
        },
    }
}

export default {
    name: 'hello',
    components: {
        Banner,
        Instruction,
        Pop,
    },
    data() {
        this.LStorage.product_name = `${this.customer}`;
        let product_name = encodeURI(this.LStorage.product_name);
        return {
            openid: this.$route.query.openid,
            banner_img_url: `${this.HOST}/images/banner.png`,
            product_html_url: '/api/v1/relation/getProductHtmlInfo',
            device_info_url: '/api/v1/relation/deviceBasicInfo',
            audio: '',  //音频对象
            audio_url: '',
            instruction: '',
            tips_text: '',
            next_url: 'ap1',
            run: false,
            pop_component: null,
            pop_title: '',
            pop_content: '',
            next_count: 0,  //下一步点击次数
            btn_is_clicked: false,  //第三步下一步按钮点击状态
            product_name: product_name,
            ap_not_connected:'',
            air_not_entered:'',
           // tip_hide:false
        }
    },
    created(){
        this.checkIsChoosedProduct();
        this.getOpenId();
        this.catchImg();
    },
    beforeRouteUpdate (to, from, next) {
        console.log(to.params);
        this.getProduct(to.params.subname);
        if(typeof this.audio === 'object'){
            this.audio.pause();
        }
        //this.palyTips();
        next();
    },
    mounted() {
        document.title = '联接网络';
    },
    methods: {
        //  这里重写common的checkIsChoosedProduct方法
        checkIsChoosedProduct(){
            if(!this.LStorage.getItem('product_name')){
                this.axios.get(`${this.HOST}${this.device_info_url}?openid=${this.openid}`)
                .then(res => {
                    if(res.data.status === 0){
                        this.LStorage.setItem('product_name', res.data.data.product_name);
                        this.product_name = encodeURI(res.data.data.product_name);
                        this.getProduct();
                    }else{
                        this.$router.push(`/product?&page=network/home&openid=${this.openid}`);
                    }
                });
            }else{
                this.getProduct();
            }
        },
        toProductPage() {
            this.$router.push(`../product?page=network/home&openid=${this.$route.query.openid}`);
        },
        getOpenId() {
            this.axios({
                url: `${this.HOST}/api/v1/base/getOpenId`,
                params: this.$route.query
            }).then( response => {
                this.openid = response.data.data.openid;
            }).catch( error => {
                console.log(error);
            });
        },
        getProduct(subname){
            subname || (subname = this.$route.params.subname);
            if(this.$store.state.product) {
                this.initPage(subname);

            }else{
                this.axios.get(`${this.HOST}${this.product_html_url}?name=${this.product_name}`)
                    .then(res => {
                        if(res.data.status === 0){
                            this.$store.dispatch("CHANGE_PRODUCT", res.data.data);
                            this.initPage(subname);
                        }else{
                            // this.$toast(res.data.message);
                        }
                    });
            }
        },
        initPage(subname){
            this.run = false;
            switch(subname){
                case 'home':
                    this.audio_url = '';
                    break;
                case 'ap1':
                    this.audio_url = require("@/assets/audio/ap_step1_tip.mp3");
                    break;
                case 'ap2':
                    this.audio_url = require("@/assets/audio/ap_step2_tip.mp3");
                    break;
                case 'air1':
                    this.audio_url = require("@/assets/audio/wx_step1_tip.mp3");
                    break;
                default:
                    break;
            }
            subname === 'home' ? this.next_url = 'air1' : this.next_url = '';
            this.instruction = this.$store.state.product[`${subname}_in`];
            this.tips_text = this.$store.state.product[`${subname}_tt`] ? this.$store.state.product[`${subname}_tt`] : null;
            this.pop_title = this.$store.state.product[`${subname}_pt`];
            this.pop_content = this.$store.state.product[`${subname}_pc`];
        },
        palyTips(){
            if(this.audio_url){
                let vm = this;
                vm.audio = new Audio(this.audio_url);
                if (window.WeixinJSBridge) {
                    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                        vm.audio.play();
                    }, false);
                } else {
                    document.addEventListener("WeixinJSBridgeReady", function () {
                        WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                            vm.audio.play();
                        });
                    }, false);
                }
                vm.audio.play();
            }
        },
        showTips(){
            this.pop_component = Pop;
        },
        finish() {
            this.pop_component = null;
        },
        select(name) {
            console.log(name)
            if(this.next_url === name){
                this.next_url = '';
                this.ap_not_connected = true
                this.air_not_entered = true
            }else{
                this.next_url = name;
                this.ap_not_connected = false
                this.air_not_entered = false
            }
        },
        showApTip(){
            this.ap_not_connected = !this.ap_not_connected
            this.next_url = ''
        },
        showAirTip(){
            this.air_not_entered = !this.air_not_entered
            this.next_url = ''
        },
        nextStep() {
            if(this.$route.params.subname === 'ap1' || this.$route.params.subname === 'ap2' || this.$route.params.subname === 'air1'){
                if(this.ap_not_connected || this.air_not_entered){
                    //this.showTips();
                }
            }
            if(this.next_url === 'ap3'){
                //this.tip_hide = true;
                if (this.btnIsClicked === true) return;
                this.btnIsClicked = true;
                this.axios({
                        url: 'http://192.168.8.1/cgi-bin/wifi.cgi',
                        timeout: 1000,
                        params: {
                            action: 'get_mac'
                        }
                    })
                    .then((response) => {
                        this.$router.push({ path: this.next_url, query: { mac: 
                        response.data.msg, openid: this.openid }});
                    })
                    .catch((error) => {
                        this.btnIsClicked = false;
                        this.next_count ++;
                        if(this.next_url){
                            if(this.next_count > 3){
                                //this.pop_title = "温馨提示";
                                //this.pop_content = "<div style='text-align: center;padding:0 20px'>" + "请确认眼灯是否闪烁，进入ROBOT热点联网模式" + "</div>";
                                //this.pop_component = Pop;
                            }else{
                                this.$toast('请将手机Wi-Fi连接到ROBOT-xxxx');
                            }
                        }else{
                           // this.showTips()
                            //this.pop_component = Pop
                            console.log("111");
                        }
                        
                    });
            }else if(this.next_url){
                //this.tip_hide = false
                this.$router.push({ path: this.next_url, query: { openid: this.openid }});
            }else{
                let _this = this;
                _this.run = true;
                window.setTimeout(function(){ _this.run = false; }, 800);
            }
        },
        catchImg() {
            let wifi = new Image();
            wifi.src = `${this.HOST}/images/wifi.png`;
            this.$store.commit('CATCH_IMG',{name: 'wifi', value: wifi});
        },
    }
}
</script>
<style scoped>
.next-home {
    margin-top:5vh;
}
.tp{
    margin-top: 0;
}
.banner_button {
    top: -4rem;
    color: #8d8d8d;
    border-color: #8d8d8d;
}
</style>
