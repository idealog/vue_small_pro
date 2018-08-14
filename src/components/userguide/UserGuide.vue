<template>
<div class="guide main">
    <div>
        <!-- <img src="../../../../images/banner.png" style="width:100%" /> -->
    </div>
    <div class="base_list">
        <ul>
            <li class="haveMore" @click="toggleImg">
                <p class="icons_fruitrabbit icon_guide_button"></p>
                <h3>按键说明</h3>
                <div class="ht0"><img :src="img_button"></div>
            </li>

             <li class="haveMore" @click="toggleImg">
                <p class="icons_fruitrabbit icon_guide_translate"></p>
                <h3>汉英快译</h3>
                <div class="ht0"><img :src="img_translate"></div>
            </li>

            <li class="haveMore" @click="toggleImg">
                <p class="icons_fruitrabbit icon_guide_net"></p>
                <h3>网络配置</h3>
                <div class="ht0"><img :src="img_net"></div>
            </li>

            <li class="haveMore" @click="toggleImg">
                <p class="icons_fruitrabbit icon_guide_content"></p>
                <h3>内容播放</h3>
                <div class="ht0"><img :src="img_content"></div>
            </li>

            <li class="haveMore" @click="toggleImg">
                <p class="icons_fruitrabbit icon_guide_wechat"></p>
                <h3>亲子微聊</h3>
                <div class="ht0"><img :src="img_wechat"></div>
            </li>

            <li class="haveMore" @click="toggleImg">
                <p class="icons_fruitrabbit icon_guide_smart"></p>
                <h3>语音点播</h3>
                <div class="ht0"><img :src="img_smart"></div>
            </li>


        </ul>
    </div>
</div>
</template>
<script>
import '@/assets/css/base_list'

export default {
    name: 'UserGuide',
    data() {
        this.LStorage.product_name = `${this.customer}`;
        let product_name = encodeURI(this.LStorage.product_name);
        return {
            img_button: `${this.HOST}/images/button_instruction.png`,
            img_net: `${this.HOST}/images/network_config.png`,
            img_content: `${this.HOST}/images/content_play.png`,
            img_wechat: `${this.HOST}/images/wechat.png`,
            img_smart: `${this.HOST}/images/voice_push.png`,
            img_translate:`${this.HOST}/images/translate.png`
        };
    },
    created() {
        this.checkIsChoosedProduct(this, 'userguide');
    },
    methods: {
        toProductPage() {
            this.$router.push(`../product?page=userguide`);
        },
        toggleImg(e){
            let el = e.srcElement || e.target;
                el = el.querySelector('h3') ? el : el.parentNode;
                el = el.querySelector('h3') ? el : el.parentNode;
            let height = el.querySelector('img').height;
            document.querySelectorAll(".ht0").forEach(item => {
                if(item !== el.querySelector(".ht0") && item.style.height && item.style.height !== '0px'){
                    item.style.height = 0;
                    item.parentNode.className = 'haveMore';
                }
            });
            if(!el.querySelector(".ht0").style.height || el.querySelector(".ht0").style.height === '0px'){
                el.querySelector(".ht0").style.height = `${height}px`;
                el.className = 'haveMore rotate';
            }else{
                el.querySelector(".ht0").style.height = 0;
                el.className = 'haveMore';
            }
        }
    }
}
</script>
<style type="text/css" scoped>
.guide .top_bg{
    /* background: url(../../../../images/banner.png) center center; */
    background-size: 100%;
}
.guide .base_list li{
    overflow: visible;
    height: auto;
    position: relative;
}
.guide .base_list .haveMore:before, .sp_list .haveMore:before{
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    transform:rotate(90deg);
    margin-right: 1rem;

}
.guide .base_list li.rotate:before{
    transform:rotate(270deg);
    -webkit-transform:rotate(270deg);
}
.guide .base_list li .icons_fruitrabbit{
    float: none;
    display: inline-block;
    position: relative;
    margin-bottom: .4rem;
    /*margin-top: 1.4rem;*/
    margin-right: 1rem;
}
.guide .base_list h3{
    float: none;
    line-height: normal;
    position: absolute;
    top:2.3rem;
    display: inline-block;
}
.guide .base_list li img{
    width: 100%;
    margin-bottom: 2px;
    margin-top: 1px;
}
.guide .base_list li div:before{
    content: "";
    float: left;
    border-bottom: 1px solid #eee;
    width: 100%;
    margin-top: 0px;
}
.icon_guide_button{
    /* background: url(../../../../images/guide_icon_button.jpg) center center no-repeat; */
    background-size: 85%;
}
.icon_guide_translate{
    /* background: url(../../../../images/guide_icon_translation.jpg) center center no-repeat; */
    background-size: 85%;
}
.icon_guide_net{
    /* background: url(../../../../images/guide_icon_network.jpg) center center no-repeat; */
    background-size: 85%;
}
.icon_guide_content{
    /* background: url(../../../../images/guide_icon_play.jpg) center center no-repeat; */
    background-size: 85%;
}
.icon_guide_wechat{
    /* background: url(../../../../images/guide_icon_wechat.jpg) center center no-repeat; */
    background-size: 85%;
}

.icon_guide_smart{
    /* background: url(../../../../images/guide_icon_voice.jpg) center center no-repeat; */
    background-size: 85%;
}
.base_list .ht0{
    overflow: hidden;
    height: 0;
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
</style>