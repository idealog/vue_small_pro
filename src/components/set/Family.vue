<template>
	<div class="main">
	    <div class="fam_head " v-if="list.length">
	        <ul class="clearfix">
	            <li v-for="item in list" permission="1" :account="item.openid" style="position:relative">
	                <p :account="item.openid" class="remove"></p>
	                <p class="img">
	                    <img class="ratio" rw='1' rh='1' :src="item.headimgurl"/>
	                </p>
	                <p class="family_name">
	                	{{item.nickname}}
	                </p>
	            </li>
	        </ul>
	        <h1 v-show="no_member" style="text-align:center">您还没有绑定任何设备</h1>
	    </div>
	    <div class="base_list short">
	        <ul>
	        	<!-- <li id="toBeAdmin" class="haveMore">
	                <h3>成为管理员</h3>
	            </li>
	        	<li id="manage" class="haveMore">
	                <h3>管理成员</h3>
	            </li> -->
	            <!-- <li @click="share" class="haveMore" v-show="loaded">
	                <h3>分享设备</h3>
	            </li> -->
	        </ul>
	    </div>
	    <div class="shade" :class="{hide: !show_qrcode}" @click.stop="show_qrcode=false">
	    	<div class="share_hint">点击这里分享给家人</div>
	    	<div class="share_qrcode">
	    		<Qrcode :value="qrcode" :size="200"></Qrcode>
	    		<p class="share_qrcode_text">扫描二维码加入微信家庭群</p>
	    	</div>
	    </div>
	    <Loading :show="loading"></Loading>
	</div>
</template>

<script>
import '@/assets/css/basic'
import '@/assets/css/base_list'
import '@/assets/css/network'
import Qrcode from 'qrcode.vue'	//https://www.npmjs.com/package/qrcode.vue
import wx from "weixin-js-sdk"
import Loading from '@/components/loading/Loading'

export default {
	name: 'Family',
	components: {
        Qrcode,
        Loading
	},
	data () {
		return {
			openid: this.$route.query.openid,
			member_url: '/api/v1/relation/getMemberList',
			qrcode_url: '/api/v1/relation/getQRcode',
			share_config_url: '/api/v1/wechat/config/share',
		  	list: [],
		  	qrcode: '',
		  	show_qrcode: false,
		  	no_member:'',
		  	loaded:'',
		  	loading:false
		}
	},
	mounted() {
		document.title = '家人互聊';
		this.getMember();
		this.getQrcode();
	},
	methods: {
		getMember() {
			this.loading = true
			this.axios.get(`${this.HOST}${this.member_url}?openid=${this.openid}`).then(res => {
				if(res.data.status === 0){
					this.list = [...this.list, ...res.data.data];
					if(!this.list.length){
						this.no_member = true
					}
				}else{
					this.$toast(res.data.message);
				}
				this.loaded = true
				this.loading = false
			})
		},
		getQrcode() {
			this.axios.get(`${this.HOST}${this.qrcode_url}?openid=${this.openid}`).then(res => {
				if(res.data.status === 0){
					this.qrcode = res.data.data;
				}else{
					let vm = this;
					window.setTimeout(function(){
						vm.$toast(res.data.message);
					}, 4000);
				}
			})
		},
		share() {
			if(!this.qrcode){
				this.$toast('获取设备信息失败');
				return;
			}
			this.show_qrcode = true;
			let url = window.location.href.split("#")[0];
	        this.axios({
	        	method: 'post',
	        	url: `${this.HOST}${this.share_config_url}`,
	        	data: {
	        		openid: this.openid,
	        		url: url
	        	}
	        }).then(res => {
	        	if(res.data.status === 0){
	        		let result = res.data.data;
	        		this.configWXShare(result.sign_package.appId, result.sign_package.timestamp, result.sign_package.nonceStr,result.sign_package.signature, result.product_id, result.domain, result.head_img_url, result.nickname, result.qrcode);
	        	}else{
					this.$toast(res.data.message);
				}
	        });
		},
		configWXShare(appId, timestamp, nonceStr,signature, product_id, domain, head_img_url, nickname, qrcode){
			let vm = this;
		    wx.config({
		        debug: false,
		        appId: appId,
		        timestamp: timestamp,
		        nonceStr: nonceStr,
		        signature: signature,
		        jsApiList: [
		            'onMenuShareAppMessage'
		        ]
		    });
		    wx.ready(function() {
		        wx.onMenuShareAppMessage({
		            title: `设备${product_id}的二维码`,
		            desc: '您可以扫描二维码或者长按识别二维码绑定设备',
		            link: `${domain}page/dist/#/set/share?head_img=${head_img_url}&nickname=${nickname}&qrcode=${qrcode}`,
		            imgUrl: head_img_url,
		            trigger: function(res) {
		                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
		            },
		            success: function(res) {
		                // vm.$toast("已成功分享");
		            },
		            cancel: function(res) {

		            },
		            fail: function(res) {
		                vm.$toast(JSON.stringify(res));
		            }
		        });
		    });
		    wx.error(function(res) {
		        vm.$toast("config失败, err_msg:" + res.errMsg);
		    });
		}
	}
}
</script>
<style type="text/css" scoped>
@-webkit-keyframes pop_kf_top {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
@-webkit-keyframes pop_kf_top1 {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
.qrcode_img{
	margin:0 auto;
	margin-top: 5vh;
	width: 10rem;
	height: 10rem;
}
.share_qrcode{
	display: inline-block;
	position: relative;
	top: 30%;
}
.share_qrcode > div {
	width: 212px;
	padding-top: 6px;
	background: #fff;
}
.share_qrcode_text{
	margin-top: 1rem;
	color: #fff;
}
.share_hint{
	position: absolute;
	float: right;
	right: 0;
}
</style>