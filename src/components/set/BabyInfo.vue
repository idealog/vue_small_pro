<template>
	<div>
		<div class="item" @click.stop = "setHead()">
			<div class = "tag"> 设置头像</div>
			<div class = "value">
				<img :src="pic_url" ref="head" style="width:4rem" />
			</div>
		</div>
		<div class="item" @click.stop = "edit('name','text')">
			<div class = "tag"> 宝宝昵称</div>
			<div class = "value">
				{{name}}
			</div>
		</div>
		<div class="item" @click.stop = "edit('birthday','date')">
			<div class = "tag"> 宝宝生日</div>
			<div class = "value">
				{{birthday}}
			</div>
		</div>
		<div class="item" @click.stop = "changeSex(sex)">
			<div class = "tag"> 宝宝性别</div>
			<div class = "value">{{getSex(sex)}}</div>
		</div>
		<div class="item" @click.stop = "edit('robot_name','text')">
			<div class = "tag"> 机器人昵称</div>
			<div class = "value">{{robot_name}}</div>
		</div> 
		<component :is="pop_component" :title="title" :type="type" v-on:cancel="cancel" v-on:finish="finish" :value="value" v-on:change_value="change"></component>
	</div>
</template>
<script type="text/javascript">
	import PopInput from '@/components/pop/pop_input'
	import wx from "weixin-js-sdk"
	export default {
		components:{
			PopInput
		},
		data(){
			return {
				name:'',
				birthday:'',
				robot_name:'',
				pop_component:'',
				type:'',
				title:'',
				value:'',
				temp:'',

				tag:'',
				sex: '男',
				openid:'',

				base_info:'',

				jssdk:'',
				pic_url:''
			}
		},
		created(){
			const This = this
			this.openid = this.$route.query.openid
			if(!this.openid){
				this.openid = sessionStorage.getItem('openid')
			}
			this.getBasicInfo(this.openid).then(res => {
				This.base_info = res
				This.name = This.base_info.name
				This.birthday = This.base_info.birthday
				This.robot_name = This.base_info.robot_name
				This.sex = This.base_info.sex
				This.pic_url = This.base_info.pic_url
			})
			this.getJSSDK()
		},
		methods:{
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
				/*.then(resp => {
                  		This.jssdk = resp.data.data
                  })*/
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
			setHead:function(){
				const This = this
				This.getJSSDK().then(res => {
					if(res && res.data && res.data.data){
						This.jssdk = res.data.data
						This.configWXPicture(this.jssdk['appId'],this.jssdk['timestamp'],this.jssdk['nonceStr'],this.jssdk['signature'],['camera','album'],This.$route.query.openid,function(id){
							This.$refs.head.src = id
						})
					}
				})
			},
			getSex: function(sex){
				switch(sex){
					case '男':
						return '小正太'
						break
					case '女':
						return '小萝莉'
						break
					defaut:
						return '保密'
						break
				}
			},
			changeSex:function(sex){
				let data
				console.log(sex)
				switch(sex){
					case '男':
						data = '女'
						break
					case '女':
						data = '男'
						break
					case '保密':
						data = '男'
						break
					defaut:
						data = '保密'
						break
				}
				this.sex = data
				this.set('sex',data)
			},
			edit: function(tag, type){
				this.type = type
				this.tag = tag
				this.title = this.getTitle(tag)
				this.value = this[tag]
				this.pop_component = "PopInput"
			},
			finish: function(){
				const data = this[this.tag]
				
				if(this.tag === 'pic_url'){
					this.$refs.head.src = this.temp
				}
				if(this.temp){
					this[this.tag] = this.temp
				}
				if(data != this[this.tag]){
					this.set(this.tag,this.temp)
				}
				this.pop_component = null
			},
			set:function(tag,value){
				const param = {
					openid:this.openid,
					[`${tag}`]:value
				}
				const url = `${this.HOST}/api/v1/base/set`
				this.axios({
	    			method:'post',
                 	url:url,
                  	data:param,
                  	responseType:'json'
	    		}).then(res =>{
	    			console.log(res)
	    		})
			},
			cancel: function(){
				this.pop_component = null
			},
			getTitle:function(type){
				let tag
				switch(type){
					case 'name':
						tag = '宝宝昵称'
						break
					case 'birthday':
						tag = '宝宝生日'
						break
					case 'robot_name':
					    tag = '机器人昵称'
					    break
				}
				return tag
			},
			change:function(value){
				this.temp =  value
			}
		}
	}
</script>

<style type="text/css" scoped>
.item{
	overflow: hidden;
	height: 6rem;
	padding : 0 1rem;
	line-height: 6rem;
	border-bottom: 1px solid #eee;
	/* background: url(../../../../images/icon_have_more.png) right center no-repeat; */
	background-position-x: 95%;
	background-size: 2% 23%; 
	font-size:1.5rem;

}
.item .tag{
	display: inline-block;
	float:left;
}
.item .value{
	display: inline-block;
	overflow: hidden;
	float:right;
	margin-right: 2rem;
}
.item:after{
	content:'';
	display: block;
	height: 0;
	clear:both;
}
</style>