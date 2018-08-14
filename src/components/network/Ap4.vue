<template>
	<div>
		<!-- circle-slider -->
		<div class="progress">
			<div class="rotate">
				<circle-slider 
					v-model="slider" 
					circle-color="#eee" 
					:progress-color="p_color"
					:knob-color="p_color"
					:circle-width="6" 
					:progress-width="5" 
					:knob-radius="1">
				</circle-slider>
			</div>
			<div class="circle" :class="icon"></div>
		</div>

		<div class="text" v-html="text"></div>
		<div class="wx_main">
			<Qrcode :value="qrcode" className="hide"></Qrcode>
			<div class="qrcode_img" :class="{hide: !show_qrcode}">
				<img :src="qrcode_src">
			</div>
			<div :class="{hide: !show_airkiss}">
				<p class="wx_msg">
					<a @click.stop="showTips()">故障排除？</a>
				</p>
				<router-link to="air1" style="text-decoration: none;"><div class="wx_btn">试试微信联网</div></router-link>
			</div>
		</div>

		<!-- pop -->
		<component :is="pop_component" v-on:cancel="finish" :title="pop_title" :content="pop_content">
	    </component>
	</div>
</template>

<script>
import "@/assets/css/network"
import Pop from "../pop/Pop"
import wx from "weixin-js-sdk"
import Qrcode from 'qrcode.vue'	//https://www.npmjs.com/package/qrcode.vue

export default {
	name: 'Ap4',
	components: {
        Pop,
        Qrcode,
	},
	data () {
		return {
			device_id: '',
			mac: this.$route.query.mac,
			device_online_state: false,	//设备在线状态
			text: '正在等待设备联网,请勿关闭页面...<br>整个流程可能需要15~60秒,请耐心等待...',
			slider: 0,	//滑块百分比
			p_color: '#f1b23f',	//进度条颜色
			circle_timer: '',	//进度条计时器
			circle_int: 600,	//进度条变化间隔
			// circle_int: 10,	//进度条变化间隔
			icon: 'upicon',	//icon类名
			await: 10000,	//初始化等待时间
			// await: 10,	//初始化等待时间
			interval: 3000,	//重试间隔
			count: 0,	//重试次数
			system_error_count: 0,	//system error 次数
			max_retry: 20,	//最大重试次数
			final_result: '',	//最终结果
			show_qrcode: false,	//显示二维码
			show_airkiss: false,	//显示airkiss按钮
			qrcode: '',	//二维码地址
			qrcode_src: '',	//二维码转化成图片的url
			pop_component: null,
			pop_title: '无法绑定设备',
			pop_content: "<div style='text-align: left;padding:0 20px'>" + "<p style='text-align:center'><p/><br/><p>1．  如果设备提示网络连接失败，请检查wifi密码是否输入正确<p/><br/><p>2．  如果设备提示网络连接超时，请将设备和路由器靠近再试试</p><br/><p>3．  如果设备提示网络连接成功，请刷新页面试试</p>"/*点击<span style='color: #06d;text-decoration: underline;' onclick='window.location.reload()'>这里</span>重试</p><br/><p>4．  如果您需要帮助，请<a style='color: #06d;text-decoration: underline;' href = " + "'/angry_birds/wechat_vue/dist/#/network/help'" + ">查看视频教程</a></p>" + "</div>*/,
		}
	},
    created() {
    	let vm = this;
    	this.circleInit();
    	window.setTimeout(function(){vm.checkDeviceOnline()}, vm.await);
    },
	methods: {
		circleInit(){
    		let vm = this;
			this.circle_timer = window.setInterval(function(){
				vm.slider++;
				if(vm.slider >= 100){
					vm.showFailed();
				}
			}, vm.circle_int);
		},
		// 检测设备在线状态 -> 获取设备id
		checkDeviceOnline() {
			let vm = this;
			this.text = '正在检测设备在线情况...<br>整个流程可能需要15~60秒,请耐心等待...';
			this.axios.get(`${this.HOST}/api/v1/base/checkDeviceOnline?mac=${this.mac}`)
				.then(res => {
					if(res.data.status === 0 && res.data.data.data === 'true'){
						this.device_online_state = true;
						this.getDeviceInfo();
					}else{
						this.count++;
						if(this.count <= this.max_retry){
							this.final_result = '设备未连接网络';
							window.setTimeout(function(){vm.checkDeviceOnline()}, vm.interval);
						}else{
							this.showFailed();
						}
					}
			    });
		},
		// 获取设备id -> 获取用户已绑定设备
		getDeviceInfo() {
			let vm = this;
			this.text = '正在获取设备基本信息...<br>整个流程可能需要15~60秒,请耐心等待...';
			this.axios.get(`${this.HOST}/api/v1/relation/deviceBasicInfo?mac=${this.mac}`)
				.then(res => {
					if(res.data.status === 0){
						this.device_id = res.data.data.device_id;
						this.qrcode = res.data.data.qrticket;
						this.getBindDeviceInfoList();
					}else{
						this.count++;
						if(this.count <= this.max_retry){
							this.final_result = '设备未注册';
							window.setTimeout(function(){vm.getDeviceInfo()}, vm.interval);
						}else{
							this.showFailed();
						}
					}
			    });
		},
		// 获取用户已绑定设备 -> 若已绑定则激活，若未绑定则绑定
		getBindDeviceInfoList(){
			this.text = '正在获取设备绑定信息...<br>整个流程可能需要15~60秒,请耐心等待...'
			this.axios.get(`${this.HOST}/api/v1/relation/getBindDeviceInfoList?openid=${this.$route.query.openid}`)
				.then(res => {
					if(res.data.status === 0){
						let is_bind = false;
						for(let item of res.data.data){
							// 绑定并已激活此设备则直接提示绑定成功
							if(this.mac.replace(/(.{2})(?!$)/g,"$1:").toLowerCase() === item.mac && item.active_status){
								is_bind = true;
								this.showSuccess();
								break;
							// 绑定未激活此设备则激活此设备
							}else if(this.mac.replace(/(.{2})(?!$)/g,"$1:").toLowerCase() === item.mac && !item.active_status){
								is_bind = true;
								this.activeDevice();
								break;
							}
						}
							// 未绑定设备则绑定设备
						if(!is_bind){
							this.bindDevice();
						}
					}else{
						// 未绑定设备绑定设备
						this.bindDevice();
					}
			    });
		},
		// 激活设备 -> 绑定成功 -> 跳转页面
		activeDevice(){
			this.text = '正在激活设备...<br>整个流程可能需要15~60秒,请耐心等待...';
			this.axios.post(this.HOST + '/api/v1/relation/activeDevice', {
		        openid: this.$route.query.openid,
		        device_id: this.device_id
		    }).then(res => {
		    	if(res.data.status === 0){
		    		this.showSuccess();
		    	}else{
		    		this.final_result = res.data.message;
		    		this.showFailed();
		    	}
		    });
		},
		// 绑定设备 -> 获取微信ticket
		bindDevice(){
			let url = location.href.split('#')[0];
			this.text = '正在绑定设备...<br>整个流程可能需要15~60秒,请耐心等待...';
			this.axios.post(this.HOST + '/api/v1/wechat/jssdk', {
		        url: url
		    }).then(res => {
		    	if(res.data.status === 0){
		    		let sign = res.data.data;
		    		this.configWXDevice(sign.appId, sign.timestamp, sign.nonceStr, 
		            sign.signature, sign.device_type, this.device_id, (res) => {
		                let ticket = res.ticket;
		                // this.$toast(ticket);
		                this.axios.post(this.HOST + '/api/v1/wechat/device/bind', {
		                    ticket: ticket,
		                    device_id: this.device_id,
		                    openid: this.$route.query.openid,
		                    product_name: this.LStorage.getItem('product_name'),
		                }).then(res => {
		                    // this.$toast(JSON.stringify(res.data));
		                    if(res.data.status === 0){
		                    	this.final_result = '设备注册成功';
		                    	this.showSuccess();
		                    	// this.$toast(JSON.stringify(res.data));
		                    }else{
		                    	this.count++;
		                    	this.system_error_count++;
		                    	//this.$toast(JSON.stringify(res.data));
		                    	let vm = this;
		                    	if(this.count <= this.max_retry && this.system_error_count <= 2){
									this.final_result = '微信注册失败';
									window.setTimeout(function(){vm.bindDevice()}, vm.interval);
								}else{
									this.showFailed();
								}
		                    }
		                });
		            });
		    	}else{
		    		this.$toast('获取JSsignature失败！');
		    	}
		    });
		},
		configWXDevice(appId, timestamp, nonceStr, signature, deviceType, deviceId, ticketCallBack) {
		    wx.config({
		        beta: true, // 开启内测接口调用，注入wx.invoke方法
		        debug: false,
		        appId: appId,
		        timestamp: timestamp,
		        nonceStr: nonceStr,
		        signature: signature,
		        jsApiList: [
		            'openWXDeviceLib',
		            'getWXDeviceTicket'
		        ]
		    });

		    wx.ready(function() {
		        wx.invoke("openWXDeviceLib", {}, function(res) {

		        });
		        wx.invoke('getWXDeviceTicket', {
		            "deviceId": deviceId,
		            "type": 1
		        }, function (res) {
		            ticketCallBack(res);
		        });
		    });

		    wx.error(function (res) {
		        this.$toast("config失败, err_msg:" + res.err_msg);
		    });
		},
		showSuccess() {
			this.icon = 'upsuccess';
			this.text = '绑定成功，即将跳转页面...';
			window.clearInterval(this.circle_timer);
			let vm = this;
			const openid = this.$route.query.openid
			//setTimeout(function(){
			/*vm.$router.push({path:'/index',query:{openid:vm.$route.query.openid}})*/
			setTimeout(function(){
				window.location.href = `https://www.cocheer.net/msi_visual_channel/page/dist/#/index?openid=${openid}`
			},1500)
			//},1500);
		},
		showFailed() {
			if(this.final_result === '设备未连接网络' || this.final_result === '设备未注册' || !this.qrcode){
				this.icon = 'upfailed';
				this.p_color = '#da4330';
				this.text = `绑定失败<br/>${this.final_result}`;
				this.show_airkiss = true;
				this.showTips();
			}else{
				// this.text = `绑定失败<br/>${this.final_result}<br/>请长按下面二维码进行绑定`;
				this.text = `<br/><br/>请长按下面二维码进行绑定`;
				this.show_qrcode = true;
				this.qrcode_src = document.querySelector("canvas").toDataURL("image/png");
			}
			window.clearInterval(this.circle_timer);
		},
		showTips() {
			this.pop_component = Pop;
		},
		finish() {
			this.pop_component = null;
		},
	}
}
</script>
<style scoped>
	html{
		height: 100vh;
    	overflow: hidden;
	}
	.progress{
		text-align: center;
		margin-top: 20vh;
	}
	.rotate{
		display: inline-block;
		transform: rotate(180deg);
	}
	.circle:after{
	    position: relative;
	    content: '';
	    display: block;
	    background: url(../../../../images/icon_ota_warning.png) center center no-repeat;
	    background-size: 100%;
	    left: 50%;
	    transform: translateX(-50%);
	}
	.upicon:after {
	    height: 6rem;
	    top: -8rem;
	    background: url(../../../../images/icon_ota_warning.png) center center no-repeat;
	    /*animation: update 5s linear infinite;*/
	    /*-webkit-animation: update 5s linear infinite;*/
	}
	.upfailed:after {
	    background-image: url(../../../../images/icon_ota_fail.png);
	    width: 4rem;
	    height: 6rem;
	    top: -8rem;
	    animation: none;
	    -webkit-animation: none;
	}
	.upsuccess:after {
	    background-image: url(../../../../images/icon_ota_success.png);
	    height: 6rem;
	    top: -8rem;
	    width: 4rem;
	    animation: none;
	    -webkit-animation: none;
	}
	@-webkit-keyframes update /* Safari 和 Chrome */
	{
	    from {transform: rotate(0);}
	    to {transform: rotate(360deg);}
	}
	.text{
		text-align: center;
		margin-top: -5rem;
	}
	.wx_msg{
		height: 27.4vh;
	}
	.wx_btn {
		font-size: 1.6rem;
		/*width: 80%;
	    background-color: #04be02;
	    border-radius: 0.5rem;
	    line-height: 7vh;
	    text-align: center;
	    color: #fff;
	    margin: 4.5vh auto 0;*/
	}
	.wx_msg + a{
		margin-bottom: 0; 
	}
	.qrcode_img{
		width:15rem;
		margin:auto;
		margin-top:2rem;
	}
</style>