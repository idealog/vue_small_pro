<template>
<div>
    <h1>测试模式</h1>
    <div class="wx_btn" style="line-height: 3.4rem;" @click="fresh">刷新页面</div>
    <br/>
    <div class="box_border">
        <input class="input_box" v-model="factory_code" :placeholder="$store.state.mac.substr(-4)">
        <div class="wx_btn" style="display: inline-block;margin: 0 0 .3rem 2rem;line-height: 3.4rem;height: 3.4rem;width:35%" @click="getQrCode">获取二维码</div>
    </div>
    <!-- qrcode -->
    <div class="shade" :class="{hide: !show_qrcode}" @click.stop="show_qrcode=false">
        <div class="share_qrcode">
            <Qrcode :value="qrcode" className="hide"></Qrcode>            
            <div class="qrcode_img" :class="{hide: !show_qrcode}">
                <img :src="qrcode_src">
            </div>
            <p class="qrcode_text">识别二维码绑定设备</p>
        </div>
    </div>
    <!-- push-list -->
    <div style="padding:1rem 2rem;">
        <SecondList :s_list="push_list" :push_func="push"></SecondList>
    </div>
    <div class="wx_btn" style="line-height: 3.4rem;" @click="toResultPage">显示测试结果</div>
</div>
</template>
<script>
import SecondList from '@/components/baselist/SecondList'
import Qrcode from 'qrcode.vue'
import wx from "weixin-js-sdk"
import '@/assets/css/network'

export default {
    name: 'TestMode',
    components: {
        SecondList,
        Qrcode,
    },
    data() {
        return {
            factory_code: '',
            qrcode: '',
            qrcode_src: '',
            media_id: 'S8froXMxj-qizMMrECi3Jyd1XYg5-azvsadW4e1m5Zk',
            show_qrcode: false,
            push_list: [
               // '播放设备语音',
               // '发送微信语音',
               // '推送音乐指令'
            ]
        };
    },
    mounted() {
        this.initPage();
    },
    watch: {
        '$store.state.media_id': function(media_id) {
            // console.log(media_id);
            this.$toast('收到设备测试语音');
            document.querySelectorAll("ul li .sec_item")[0].querySelector('.sec_title').style.color = "#000";
        }
    },
    methods: {
        initPage(){
            this.checkDeviceOnline(this.$route.query.openid);
            this.websocket.init(this.$route.query.openid);
            this.getBasicInfo(this.$route.query.openid);
          //  document.querySelectorAll("ul li .sec_item")[0].querySelector('.sec_title').style.color = "#aaa";
            // this.$store.dispatch("CHANGE_MEDIA_ID", '123');
            this.factory_code = '';
        },
        fresh(){
            this.initPage();
            this.$toast("刷新成功");
        },
        getQrCode(){
            //update by zhu
            if(this.factory_code.length !== 4 && this.factory_code.length !== 7 && this.factory_code.length !== 8){
                this.$toast('请正确输入设备播报的号码');
                return;
            }
            this.axios({
                url: `${this.HOST}/api/v1/relation/getQRcode`,
                params: {
                    factory_code: this.factory_code
                }
            }).then(res => {
                if(res.data.status === 0){
                    this.qrcode = res.data.data;
                    this.$nextTick(function() {
                        this.qrcode_src = document.querySelector("canvas").toDataURL("image/png");
                        this.show_qrcode = true;
                    });
                }else{
                    this.$toast(res.data.message);
                }
            })
        },
        push(item){
            if(!this.$store.state.device_online_state){
                this.$toast('设备不在线');
                return;
            }
            let content;
            switch(item){
                case '播放设备语音':
                    let url = location.href.split('#')[0];
                    this.axios({
                        method: 'post',
                        url: `${this.HOST}/api/v1/wechat/jssdk`,
                        data:{
                            url: url
                        }
                    }).then(res => {
                        this.getMedia(res.data.data.appId, res.data.data.timestamp, res.data.data.nonceStr, res.data.data.signature, this.$store.state.media_id);
                    });
                    break;
                case '发送微信语音': 
                    content = {
                        action: "device_wechat",
                        media_id: this.media_id
                    };
                    break;
                case '推送音乐指令':
                    content = {
                        "action": "device_play",
                        "play_ctrl": "play",
                        "category": 7,
                        "source": 0,
                        "song_id": "-1",
                        "song_name": "测试音频",
                        "song_url": "http://www.cocheer.net/resource/public/music/audio/curry%20curry.mp3"
                    };
                    break;
            }
            if(content){
                this.websocket.sendMessage(content);
                this.$toast('已推送给设备');
            }
        },
        getMedia(appId, timestamp, nonceStr, signature, media_id) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: appId, // 必填，公众号的唯一标识
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: nonceStr, // 必填，生成签名的随机串
                signature: signature,// 必填，签名，见附录1
                jsApiList: ['downloadVoice', 'playVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

            wx.ready(function () {
                wx.downloadVoice({
                    serverId: media_id, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        var localId = res.localId; // 返回音频的本地ID
                        wx.playVoice({
                            localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
                        });
                        this.$toast("正在播放设备发送的测试语音，请把手机音量开大进行检测");
                    }
                });
            });

            wx.error(function (res) {
                this.$toast("config失败, err_msg:" + res.err_msg);
            });
        },
        toResultPage(){
            this.$router.push(`./testmode/result?openid=${this.$route.query.openid}`);
        },
    }
}
</script>
<style type="text/css">
h1{
    text-align: center;
    font-weight: 800;
    margin: 1rem;
}
.box_border{
    padding: .8rem 2rem .8rem 4.4rem;
}
.share_qrcode .qrcode_img{
    margin:0 auto;
    margin-top: 30vh;
    padding: 8px;
    width: 20rem;
    height: 20rem;
    background: #fff;
}
</style>