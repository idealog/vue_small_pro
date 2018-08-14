<template>
	<div>
		<Banner :url="url"></Banner>
		<div>
			<p class="wx_msg" v-html="tips.bird.entry"></p>
			<a class="question" @click="showPop">{{tips.bird.question}}</a>
			<div class="wx_btn extra" @click="goAirkiss">微信联网</div>
			<div class="wx_btn extra" @click="goBind">已联网,直接绑定设备</div>
			<a class="link" @click="goApConnect">试试热点联网</a>
			<component :is="pop_component" :title="title" :content="pop_content" @cancel="finish"></component>
		</div>
	</div>
</template>
<script type="text/javascript">
	import Banner from '@/components/banner/Banner'
	import Pop from '@/components/pop/Pop'
	import wx from "weixin-js-sdk"
	export default {
		components:{
			Banner,
			Pop
		},
		data(){
			return {
				url:`${this.HOST}/images/banner.png`,
				tips:{
					"bird":{
						'entry':'设备开机完成后长按<span style="font-size:1.4rem;font-weight:bold" class="em_font">靠近羽毛的下一首</span>按键3秒<br>进入微信联网模式',
						'question':'没有进入微信联网？'
					}
				},
				pop_component:'',
				title:'无法进入微信联网状态？',
				pop_content:'<div style="text-align: left;padding:0 20px"><p style="text-align:center"></p><p></p><br><p>1．  需要在开机完全完成后按键</p><p></p><br><p>2．  请确认长按<span class="em_font">靠近羽毛的下一首</span>按键3秒</p><br><p>3．  如果您还不能进入微信联网模式，请重启设备后再试试</p></div>'
			}
		},
		methods:{
			goApConnect:function(){
				this.$router.push({path:'/network/ap1',query:{'openid':this.$route.query.openid}})
			},
			finish:function(){
				this.pop_component = null
			},
			showPop:function(){
				this.pop_component = Pop
				this.pop_content = this.pop_content
			},
			goAirkiss:function(){
				const This = this
				this.axios({
					method:'post',
					url:`${This.HOST}/api/v1/wechat/jssdk`,
					data:{
						url:window.location.href.split("#")[0]
					}	
				}).then(resp => {
					console.log(resp.data.data)
					This.configWXAirkiss(resp.data.data.appId,resp.data.data.timestamp,resp.data.data.nonceStr,resp.data.data.signature)
				})
			},
			configWXAirkiss:function(appId,timestamp,nonceStr,signature){
				const This = this
				wx.config({
			        beta: true, // 开启内测接口调用，注入wx.invoke方法,否则airkiss方法不起作用
			        debug: false,
			        appId: appId,
			        timestamp: timestamp,
			        nonceStr: nonceStr,
			        signature: signature,
			        jsApiList: [
			            'configWXDeviceWiFi'
			        ]
			    });
			    wx.ready(function () {
			    	const deviceType = 'gh_81973a0de5b8'
					wx.invoke("configWXDeviceWiFi", {"brandUserName": '"' + deviceType + '"'}, function (res) {
				        const err_msg = res.err_msg;
				        if (err_msg === 'configWXDeviceWiFi:ok') {
				           This.$toast("配置网络成功")
				           This.$router.push({path:'/bind',query:{'openid':This.$route.query.openid}})
				        }
				    });
			    });
			    wx.error(function (res) {
			        This.$toast(res.err_msg)
			    });
			},
			goBind:function(){
				this.$router.push({path:'/bind',query:{'openid':this.$route.query.openid}})
			}
		}
	}
</script>

<style type="text/css" scoped>
	.wx_msg{
		color: #666;
	    margin: 3vh 0 0 0;
	    font-size:1.3rem;
	    text-align:center;
	}
	.question{
		font-size:1.4rem;
		text-align: center;
		margin-top:1rem;
		margin-bottom: 12vh;
	}
	.link {
	    font-size: 1.4rem;
	    color: #67cc9b;
	    font-weight: bold;
	    text-decoration: underline;
	    text-align: center;
	    display: block;
	    margin-top:3rem;
	}
	.extra{
		font-weight:bold;
		margin-top:-3vh;
		border-radius:2rem;
		box-shadow: 1px 1px 4px rgb(13, 33, 47);
		margin-top:1rem;
	}
</style>