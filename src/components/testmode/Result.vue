<template>
<div>
    <h1>{{$store.state.mac}}的测试结果</h1>
    <div class="weui_cells weui_cells_checkbox">
        <label class="weui_cell weui_check_label" for="all">
            <div class="weui_cell_bd weui_cell_primary">
                <p>{{all_pick_text}}</p>
            </div>
            <div class="weui_cell_hd">
                <input type="checkbox" class="weui_check" name="checkbox" id="all" v-model="checked" @click="pickAll">
                <i class="weui_icon_checked"></i>
            </div>
        </label>
        <template v-for='(checkb, index) in checkbox_list'>
            <label class="weui_cell weui_check_label" :for="index">
                <div class="weui_cell_bd weui_cell_primary">
                    <p v-if="!checkb.disabled">{{checkb.text}}</p>
                    <p v-else style="color:#aaa">{{checkb.text}}</p>
                </div>
                <div class="weui_cell_hd">
                    <input v-if="!checkb.disabled" type="checkbox" name="checkbox" class="weui_check" :value="checkb.value" :id="index" :disabled="checkb.disabled" v-model="checkbox_model">
                    <input v-else type="checkbox" name="checkbox" class="weui_check" :value="checkb.value" :id="index" :disabled="checkb.disabled" v-model="checkbox_model_device">
                    <i class="weui_icon_checked"></i>
                </div>
            </label>
        </template>
    </div>
    <div class="weui_btn_area">
        <a class="weui_btn weui_btn_primary" @click="onSubmit">确认并恢复出厂设置</a>
    </div>
    <br/>
    <br/>
</div>
</template>
<script>
import wx from "weixin-js-sdk"
import '@/assets/css/network'
import '@/assets/css/weui.min'
export default {
    name: 'TestResult',
    data() {
        return {
            all_pick_text: '全选',
            checked: false,
            checkbox_model: [], //h5 checkbox
            checkbox_model_device: [],  //设备checkbox
            checkbox_list: [{
                'text': '微信语音测试结果OK',
                'value': 'wx_voice_result',
                'disabled': false,
            },{
                'text': '设备语音测试结果OK',
                'value': 'device_voice_result',
                'disabled': false,
            },{
                'text': '推送指令测试结果OK',
                'value': 'push_result',
                'disabled': false,
            },{
                'text': '录音测试结果OK',
                'value': 'voice_record_result',
                'disabled': false,
            },{
                'text': '喇叭测试结果OK',
                'value': 'speak_result',
                'disabled': false,
            },{
                'text': '灯测试结果OK',
                'value': 'led_result',
                'disabled': true,
            },{
                'text': 'wifi测试结果OK',
                'value': 'wifi_result',
                'disabled': true,
            },{
                'text': '按键测试结果OK',
                'value': 'button_result',
                'disabled': true,
            },{
                'text': '电池测试结果OK',
                'value': 'battery_result',
                'disabled': true,
            },{
                'text': '充电测试结果OK',
                'value': 'charge_result',
                'disabled': true,
            },{
                'text': 'TF卡测试结果OK',
                'value': 'sdcard_result',
                'disabled': true,
            }],
            post_data:{
                device_id: '',
                mac: '',
                factory: 'aoweisi',
                wx_voice_result: '异常',
                device_voice_result: '异常',
                push_result: '异常',
                voice_record_result: '异常',
                speak_result: '异常',
                kq_id: this.KQ_ID,
            },
        };
    },
    mounted() {
        this.checkDeviceOnline(this.$route.query.openid);
        this.getBasicInfo(this.$route.query.openid).then(() => {
            this.post_data.device_id = this.$store.state.device_id;
            this.post_data.mac = this.$store.state.mac;
            this.getDeviceTestResult();
        });
    },
    watch: {
        'checkbox_model': {
            handler: function (val, oldVal) {
                let length = 0;
                for(let value of this.checkbox_list){
                    if(!value.disabled){
                        length ++;
                    }
                }
                if (this.checkbox_model.length === length || this.checkbox_model.length === this.checkbox_list.length) {
                    this.checked = true;
                }else{
                    this.checked = false;
                }
            },
            deep: true
        },
        'checked'(val, oldVal) {
            this.all_pick_text = this.checked ? '全不选': '全选';
        }
    },
    methods: {
        getDeviceTestResult(){
            this.axios({
                url: `${this.PUBLIC_HOST}api/test/factory/detail`,
                params: {
                    device_id: this.$store.state.device_id,
                    kq_id: this.KQ_ID,
                },
            }).then(res => {
                if(res.data.status === 0){
                    this.$toast(res.data.message);
                    for(let e in res.data.data){
                        res.data.data[e] === '正常' && this.checkbox_model.push(e) && this.checkbox_model_device.push(e);
                    }
                }
            });
        },
        pickAll(){
            this.checkbox_model = [];
            if(!this.checked){
                for(let value of this.checkbox_list){
                    if(!value.disabled){
                        this.checkbox_model.push(value.value);
                    }
                }
            }
            this.checked = !this.checked;
        },
        onSubmit(){
            if(!this.$store.state.device_id){
                this.$toast('请先绑定设备');
                return;
            }
            if(!this.$store.state.device_online_state){
                this.$toast('设备不在线');
                return;
            }
            for(let value of this.checkbox_model){
                this.post_data[value] && (this.post_data[value] = '正常');
            }
            this.post_data.updatetime = new Date();
            this.axios({
                method: 'post',
                url: `${this.PUBLIC_HOST}api/test/factory/upsert`,
                data: this.post_data
            }).then(res => {
                this.getJsSDK();
            });
            //  异常存log
            let length = 0;
            for(let value of this.checkbox_list){
                if(!value.disabled){
                    length ++;
                }
            }
            if (this.checkbox_model.length !== length && this.checkbox_model.length !== this.checkbox_list.length){
                this.axios({
                    method: 'post',
                    url: `${this.LOG_HOST}api/device/factory/test/exception`,
                    data: this.post_data
                });
            }
        },
        getJsSDK(){
            let url = location.href.split('#')[0];
            this.axios({
                method: 'post',
                url: `${this.HOST}/api/v1/wechat/jssdk`,
                data:{
                    url: url
                }
            }).then(res => {
                this.factoryReset(res.data.data.appId, res.data.data.timestamp, res.data.data.nonceStr, res.data.data.signature);
            });
        },
        factoryReset(appId, timestamp, nonceStr, signature){
            let reset_param = {
                action: "device_ctrl",
                ctrl_type: 8,
                reset: "yes"
            };
            let _this = this;
            wx.config({
                beta : true, // 开启内测接口调用，注入wx.invoke方法必填
                debug : false, // 开启调试模式 必填
                appId : appId, // 第三方app唯一标识必填
                timestamp : timestamp, // 签名的时间戳必填
                nonceStr : nonceStr, // 生成签名的随机串必填
                signature : signature,//签名 必填
                jsApiList : [
                    //添加使用的函数
                    'openWXDeviceLib', 'getWXDeviceTicket' ]
            });

            //ready权限验证
            wx.ready(function() {
                // _this.$toast('进入wx.ready');
                // 如果这里成功率无法保证，则将下一个方法写到这里的回调里
                wx.invoke('openWXDeviceLib', {'connType':'lan'}, function(res) {});

                wx.invoke('getWXDeviceTicket', {    
                    "deviceId": _this.$store.state.device_id,
                    "type": 2
                }, function (res) {
                    // _this.$toast(JSON.stringify(res));
                    let ticket = res.ticket;
                    if(!ticket){
                        _this.$toast('获取微信ticket认证失败');
                        return;
                    }
                    // _this.$toast('进入post factory_reset');
                    _this.axios({
                        method: 'post',
                        url: `${_this.HOST}/api/v1/base/factory_reset`,
                        data: {
                            openid: _this.$route.query.openid,
                            device_id: _this.$store.state.device_id,
                            ticket: ticket,
                            kq_id: _this.KQ_ID,
                        }
                    }).then(res => {
                        // _this.$toast(JSON.stringify(res.data));
                        if(res.data.status === 0){
                            _this.websocket.sendMessage(reset_param);
                            window.localStorage.clear();
                            _this.$router.push(`../testmode?openid=${_this.$route.query.openid}`);
                        }
                        _this.$toast(res.data.message);
                    }).catch(e => {
                        _this.$toast('post factory_reset err' + JSON.stringify(e));
                    });
                });
            });
            wx.error(function(res) {
                _this.$toast(JSON.stringify(res));
            });
        },
    }
}
</script>
<style>
h1{
    text-align: center;
    font-weight: 800;
    margin: 1rem;
}
.weui_cells{
    overflow: visible;
}
.weui_cell:before{
    width: 90%;
}
.weui_cells_checkbox .weui_check[disabled]+.weui_icon_checked:before{
    background: #c9c9c9;
    border-radius: 50%;
}
</style>