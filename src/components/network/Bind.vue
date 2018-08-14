<template>
	<div>
		<Banner :url="url"></Banner>

		<div>
        <h4  style="margin-top:1.5rem;text-align:left;margin-left:1.5rem; font-size: 1.3rem;color:rgb(245,188,117)">请在下面输入框输入设备播报的绑定号,然后点击下面按钮“获取设备二维码”进行绑定</h4>
        <div class="weui_btn_area" style="height:5rem;margin-top:0.6rem">
            <input  class="weui_btn weui_btn_primary" style="background:rgb(215,215,215);height:3.5rem" v-model="bind_code" />
        </div>
        <div class="weui_btn_area">
            <a class="weui_btn weui_btn_primary" @click="getQrCode()" style="font-size:1.6rem;height:3.5rem;line-height:3.5rem">获取设备二维码</a>
        </div>
        <h4 class="tips">提示：联网状态下，长按播放暂停键播报绑定码”</h4>
        <p class="wx_msg"><a @click="showPop">无法听到设备播报绑定号?</a></p>

        <!-- <div class="text" v-html="text"></div> -->
        <div class="zhezhao" :class="{show:show_qrcode}" @click="hideQrcode">
            <Qrcode :value="qrcode" className="hide"></Qrcode>
			<div class="qrcode_img" :class="{hide: !show_qrcode}">
				<img :src="qrcode_src">
			</div>
        </div>
        <component :is="pop_component" :title="title" :content="pop_content" @cancel="finish"></component>
    </div>
	</div>
</template>

<script type="text/javascript">
	import Banner from '@/components/banner/Banner'
	import Pop from '@/components/pop/Pop'
	import Qrcode from 'qrcode.vue'	//https://www.npmjs.com/package/qrcode.vue
	export default {
		components:{
			Banner,
			Pop,
			Qrcode
		},
		data(){
			return {
				url:`${this.HOST}/images/banner.png`,
				pop_component:'',
				title:'',
				pop_content:'',
				show_qrcode:false,
				qrcode:'',
				qrcode_src:'',
				text:'',
				bind_code:''
			}
		},
		methods:{
			getQrCode:function(){
			    const This = this
			    const url =  `https://www.cocheer.net/mongodb/api/device/cache/qrcode/get`
			  	if(This.bind_code == ''){
			  		this.$toast("请输入绑定码！")
			  	}
			    this.axios({
			    	method:'get',
			    	params:{
			    		kq_id:This.KQ_ID,
			    		auth_code:This.bind_code
			    	},
			    	url:url
			    }).then(res => {
			    	if(res.data.status === 0){
				    	This.qrcode = res.data.data
				    	This.show_qrcode = true
				    	setTimeout(function(){
				    		This.qrcode_src = document.querySelector("canvas").toDataURL("image/png")
				    	})
			    	}else{
			    		This.$toast("获取绑定码失败，请重新获取！")
			    	}
			    })
			},
			showPop:function(){
				this.pop_component = Pop
				this.title = '无法听到设备播报绑定号?'
				this.pop_content = '<div style="text-align: left;padding:0 20px"><p style="text-align:center"></p><p></p><br><p>1、确认设备已经联网成功的前提下，长按播放暂停键播报绑定码”</p><p></p><br><p>2、如果设备没有联网成功、请重新<a href=""><span class="em_font">配置网络进行联网 </span></a></p></div>'
			},
			hideQrcode:function(){
				this.show_qrcode = false
			},
			finish:function(){
				this.pop_component = null
			}
		}
	}
</script>

<style type="text/css">
	.weui_btn_area {
    	margin: 1.17647059em 15px .3em;
    	height:5rem;margin-top:.3rem
	}
	.weui_btn:after {
	    content: " ";
	    width: 200%;
	    height: 200%;
	    position: absolute;
	    top: 0;
	    left: 0;
	    border: 1px solid rgba(0, 0, 0, .2);
	    -webkit-transform: scale(.5);
	    transform: scale(.5);
	    -webkit-transform-origin: 0 0;
	    transform-origin: 0 0;
	    box-sizing: border-box;
	    border-radius: 10px;
	}
	button.weui_btn, input.weui_btn {
	    width: 100%;
	    border-width: 0;
	    outline: 0;
	    -webkit-appearance: none;
	}

	.weui_btn_primary {
	    background-color: #04be02;
	}

	.weui_btn {
	    position: relative;
	    display: block;
	    margin-left: auto;
	    margin-right: auto;
	    padding-left: 14px;
	    padding-right: 14px;
	    box-sizing: border-box;
	    font-size: 18px;
	    text-align: center;
	    text-decoration: none;
	    color: #fff;
	    line-height: 2.33333333;
	    border-radius: 5px;
	    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	    overflow: hidden;
	}

	.wx_msg {
	    color: #666;
	    height: 38vh;
	    margin: 6vh 0 0 0;
	    margin-top:10vh;
	    height:10rem;
	    text-align:center;
	}

	.wx_msg a{
	    font-size: 1.5rem;
	    color: #06d;
	    font-weight: 100;
	    text-decoration: underline;
	}
	.tips{
		margin-top:1.5rem;
		text-align:left;
		margin-left:1.5rem;
		font-size: 1.3rem;
		color:rgb(245,188,117);
		margin-top:-1rem;
	}


	.qrcode_img{
		    width: 15rem;
    margin: auto;
    /* margin-top: 2rem; */
    /* height: 100%; */
    top: 50%;
    position: absolute;
    transform: translate(64%,-50%);
    text-align: center;
	}
</style>