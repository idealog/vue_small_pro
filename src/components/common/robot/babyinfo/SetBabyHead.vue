<template>
	<div>
		<div class="head_bg"></div>
		<div class="img_container">
			<img :src="head_img" ref="head_img" style="width:100%;margin-top:5rem" @click.stop="showPop">
		</div>
		<Pop :show_pop_ctrl="show_pop_ctrl" :slot_business_component="slot_business_component" :pop_pannel_height="pop_pannel_height">
			<div :slot="slot_business_component">
				<div class="item" @click.stop="setHead('camera')">
					{{photo}}
				</div>
				<div class="item" @click.stop="setHead('album')">
					{{select_photo}}
				</div>
				<div class="btn" @click.stop="hidePop">
					{{cancel_txt}}
				</div>
			</div>
		</Pop>
	</div>
</template>
<script>
	import Pop from '@/components/common/pop/Pop'
	import wx from "weixin-js-sdk"
	export default {
		components:{
			Pop
		},
		data(){
			return{
				head_img:this.$store.state.head_img,
				show_pop_ctrl:false,
				slot_business_component:'ctrl_change_head',
				photo:'拍照',
				select_photo:'从手机相册选择',
				cancel_txt:'取消',
				pop_pannel_height:'14.2rem'
			}
		},
		mounted(){

		},	
		methods:{
			drawImgOnCanvas(){
				let ctx = this.$refs.canvas.getContext('2d')
				let img = this.$refs.head_img
				ctx.drawImage(img,0,0,200,200)
			},
			showPop(){
				this.show_pop_ctrl = true
			},
			hidePop(){
				this.show_pop_ctrl = false
			},

			//获取签名包
			getJSSDK: function(){
				const This = this
				const url = `${this.HOST}/api/v1/wechat/jssdk`
				return this.axios({
					method:'post',
                 	url:url,
                  	data:{
                  		url: window.location.href.split("#")[0]
                  	},
                  	responseType:'json'
                  })
			},

			configWXPicture:function(appId, timestamp, nonceStr, signature,sourceType,openid,callback){
				const This = this
				wx.config({
					debug: false, 
			        appId: appId, 
			        timestamp: timestamp,
			        nonceStr: nonceStr,
			        signature: signature,
			        jsApiList: [
			            'chooseImage',
			            'uploadImage'
			        ] 
				});
				wx.ready(function() {
			        //选择图片
			        wx.chooseImage({
			            count: 1, 
			            sizeType: ['compressed'], 
			            sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
			            success: function(res) {
			                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
			                if(!localIds) return;
			                //上传照片到微信服务器
			                setTimeout(function(){
			                    wx.uploadImage({
			                        localId: localIds.toString(), 
			                        isShowProgressTips: 1, 
			                        success: function (res) {
			                            var serverId = res.serverId; // 返回图片的服务器端ID
			                            This.axios({
			                            	method:'post',
						                 	url:`${This.HOST}/api/v1/base/set/head`,
						                  	data:{
						                  		openid: This.openid,
						                  		media_id:serverId
						                  	},
						                  	responseType:'json'
			                            }).then(res => {
			                            	if(res.data.status === 0){
			                            		This.$toast("上传头像成功")
			                            	}else{
			                            		This.$toast("上传头像失败！")
			                            	}
			                            })
			                        }
			                    });
			                },100);
			                callback(localIds);
			            }
			        });
			    });
			},
			//type camera album
			setHead:function(type){
				const This = this
				This.getJSSDK().then(res => {
					if(res && res.data && res.data.data){
						This.jssdk = res.data.data
						This.configWXPicture(this.jssdk['appId'],this.jssdk['timestamp'],this.jssdk['nonceStr'],this.jssdk['signature'],[type],This.$route.query.openid,function(id){
							This.$refs.head_img.src = id
						})
					}
				})
			},
		},
		render(){
			h =>  (App)
		}
	}
</script>
<style scoped>
	.head_bg{
		background: rgba(34, 34, 34,.6);
    	width: 100%;
    	height: 100%;
    	position: absolute;
    	z-index: -1;
	}
	.img_container{
		position: absolute;
		top:5rem;
		width:100%;
		background: grey;
	}
	.item{
		line-height: 5rem;
		border-bottom: 1px solid rgba(235,235,235,.7);
		color: rgba(16,16,16);
		text-align: center;
		font-size: 1.6rem;
	}
	.btn{
		line-height: 4rem;
		background: rgba(166,166,166,.5);
		text-align: center;
		font-size: 1.6rem;
		color: rgba(68,68,68,.3);
	}
</style>