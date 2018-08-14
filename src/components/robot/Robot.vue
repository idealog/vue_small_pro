<template>
	<div>
	 	<div class="my_title title_bg" >
            <!-- <div class="head">
                <img src="../../../../images/default_head_2.png"/>
            </div> -->
        </div>
        <div v-show="isBind">
        	<ul>
        		<li v-for = "item in menu" class="menu_wrap" v-bind:style="{height:item.height +'rem'}" v-cloak v-if="item.name !== '小雅'">
        			<div class="menu" @click="showSub(item)">
        				<img :src="item.img" />
        				<span>{{item.name}}</span>
        				<div class="arrow" v-bind:class="{xuan:selected === item}"></div>
        			</div>
        			<div v-for = "sub,index in item.sub_menu" class="sub_menu hide"  :class="{show_sub:selected === item}"  @click.stop="goPath(sub)">
        				<span class="sub_block">{{sub.name}}</span>
        				<div class="switch" v-bind:class= "{on:$store.state.led}"  v-if="sub.switch" @click.stop="changeStatus(sub)"><span></span></div>
        				<div class="switch" v-bind:class= "{on:$store.state.childlock}"  v-if="sub.tag=== 'childlock'" @click.stop="changeStatus(sub)"><span></span></div>
        				<span v-if="sub.count != null" class="result_data">{{sub.count}}首</span>
        				<span v-if="sub.volume != null" class="result_data">{{$store.state.volume || 100}}%</span>
        				<span v-if="sub.version != null || have_new_version" class="result_data" @click.stop="otaUpdate(sub)">{{sub.version}}</span>
        				<span v-if="have_new_version" class="have_new"></span>
        				<span v-if="sub.tag === 'capacity'" class="result_data" @click.stop="showBattery()">{{getCapacityTip($store.state.battery)}}</span>
        			</div>
        		</li>

        		<li v-for = "item in menu" class="menu_wrap" v-bind:style="{height:item.height +'rem'}" v-cloak v-if="item.name === '小雅' && openid==='oxXlZ0jj8ypaIgFmiaxbMA0hRHwk'">
					<div class="menu" @click="showSub(item)">
        				<img :src="item.img" />
        				<span>{{item.name}}</span>
        				<div class="arrow" v-bind:class="{xuan:selected === item}"></div>
        			</div>	
        		</li>
        	</ul>
        </div>
        <div class= "button" @click.stop="goAirkiss()" v-if="unBind" >
        	{{bind_device}}
        </div>
        <div class= "button" @click.stop="goCloud()" v-show="loaded">
        	{{story_cloud}}
        </div>
        <PropellingController v-show="$store.state.show_propelling"></PropellingController>
        <component :is="pop_component"  v-on:finish="finish"  v-on:cancel="cancel" v-on:upgrade_success="upgrade_success" v-on:upgrade_fail="upgrade_fail" :title="pop_title" :content="pop_content" :type="type" :is_capacity="is_capacity"  :capacity="capacity" :tips="tips" :ceil="ceil" :volume_percent="$store.state.volume || 100" v-on:change_percent="change_percent" ></component>

        <Loading :show="loading"></Loading>
	</div>
</template>
<script type="text/javascript">
	import PropellingController from '@/components/common/propellingController'
	import Pop from '@/components/pop/Pop_Bottom'
	import Volume from '@/components/pop/Volume'
	import wx from "weixin-js-sdk"
	import Progress from '@/components/pop/update_progress'
	import Loading from '@/components/loading/Loading'
	export default{
		name:'Robot',
		components:{
			PropellingController,
			Pop,
			Volume,
			Progress,
			Loading
		},
		data(){
			return {
					pop_component:'',
					pop_title:'',
					pop_content:'',
					type:'bottom',
					menu:[
						{
							"img":`${this.HOST}/images/icon_my_setting.png`,
							"name":"设置",
							"height":7,
							"sub_menu":[
								{
									"name":"设置宝宝信息",
									"path":"/set/babyinfo"
								},
								{
									"name":"家庭成员",
									"path":"/set/family"
								},
								{
									"name":"电量显示",
									"capacity":"5",
									"tag":"capacity"
								},
								{
									"name":"童锁开关",
									"path":"",
									"on":false,
									"switch":1,
									"ctrl_type":4,
									"tag":"childlock"
								},
								{
									"name":"眼灯开关",
									"path":"",
									"on":false,
									"switch":1,
									"ctrl_type":1,
									"tag":"led"
								},
								{
									"name":"最大音量",
									"path":"",
									"volume":"50%",
									"tag":"volume"
								},
								{
									"name":"软件更新",
									"path":"",
									"version":"",
									"tag":"ota_update"
								},
								{
									"name":"关于",
									"path":"/about"
								},
								{
									"name":"恢复出厂设置",
									"path":"",
									"tag":"factory_reset"
								}
							]
						},
						{
							"img":`${this.HOST}/images/icon_my_collection.png`,
							"name":"本地内容",
							"tag":"local_list",
							"height":7,
							"sub_menu":[
								{
									"name":"收藏",
									"path":"/localmusic?type=0",
									"count":0,
									"tag":"cocheer_collect"
								},
								{
									"name":"儿歌",
									"path":"/localmusic?type=1",
									"count":50,
									"tag":"cocheer_happy_songs"
								},
								{
									"name":"国学",
									"path":"/localmusic?type=2",
									"count":50,
									"tag":"cocheer_chinese_classic"
								},
								{
									"name":"故事",
									"path":"/localmusic?type=3",
									"count":50,
									"tag":"cocheer_fairy_tale"
								},
								{
									"name":"学英语",
									"path":"/localmusic?type=4",
									"count":50,
									"tag":"cocheer_enlighten_english"
								}

							]
						},
						{
							"img":`${this.HOST}/images/foot_print.png`,
							"name":"点滴记忆",
							"path":"/footprint",
							"sub_menu":[

							]
						},
						{
							"img":`${this.HOST}/images/foot_print.png`,
							"name":"小雅",
							"path":"/footprint",
							"sub_menu":[

							]
						}
					],
					cocheer_chinese_classic:0,
					cocheer_collect:0,
					cocheer_drift_bottle:0,
					cocheer_enlighten_english:0,
					cocheer_fairy_tale:0,
					cocheer_happy_songs:0,
					selected:'',
					story_cloud:'故事云',
					bind_device:'绑定设备',
					menu_height:7,
					num:0,
					have_new_version:'',
					versionInfo:'',
					switch_item:'',
					radius:100,
					percent: 0.5,
					reset:false,
					sign_package:'',
					volume_percent:'80',
					isBind:'',
					device_id:'',
					is_capacity:false,
					capacity:'',
					tips:'',
					ceil:'',
					unBind:'',
					loaded:'',
					loading:false,
					openid:''
			}
		},
		created(){
			this.openid = this.$route.query.openid
			if(!this.ws){
				this.websocket.init(this.$route.query.openid)
			}
			this.init()
		},
		mounted(){
			const This = this
			This.loading = true
			setTimeout(function(){
				This.loading =  false
			},600)
		},
		watch:{
			volume_percent(cur,old){
				console.log(cur)
			}
		},
		methods:{
			init:function(){
				this.getBindState()
				this.getJSSDK()
				this.getLocalCount()
				this.getVersion()
				this.$on('change_percent',this.change_percent)
			},
			getCapacityTip:function(num){
				const percent = num * 100 / 5 
				return `剩余${percent}%`
			},
			showBattery(){
	        	console.log("showBattery")
	        	this.pop_component = "Pop"
	        	this.pop_title = "电量详情"
	        	this.type = "center"
	        	this.is_capacity = true
	        	this.capacity = `${this.$store.state.battery*100/5}%`  
	        	this.ceil =`小时`
	        	this.tips = "剩余"
	        },
			getBindState:function(){
				const This = this
				this.getBasicInfo(This.$route.query.openid).then(res => {
					console.log(res)
                    if(res){
                    	console.log(res)
                        This.device_id = res.device_id
                        if(This.device_id){
                        	This.isBind = true
                        }else{
                        	This.isBind = false
                        	This.unBind = true
                        }
                        console.log(This.isBind)
                        console.log(This.unBind)
                    }else{
                    	This.unBind = true
                    }
                    this.loaded = true
                })
			},
			// 恢复出厂设置需要
			getJSSDK:function(){
				const This = this
				const url = `${this.HOST}/api/v1/wechat/jssdk`
				const param = {
					url: window.location.href.split("#")[0],
					openid: this.$route.query.openid,
				}
				return This.axios({
	    			method:'post',
                 	url:url,
                  	data:param,
                  	responseType:'json'
	    		})
	    		/*.then(res =>{
	    			This.sign_package = res.data.data
	    		})*/
			},
			goAirkiss:function(){
				const openid  = this.$route.query.openid
				window.location.href = `https://www.cocheer.net/msi_visual_channel/airkiss?openid=${openid}`
			},
			getVersion:function(){
				const This = this
				const url = `${this.HOST}/api/v1/base/check_ota_update`
				let mac
				if(sessionStorage.getItem("device_info") && JSON.parse(sessionStorage.getItem("device_info")) && JSON.parse(sessionStorage.getItem("device_info")).data){
				    mac = JSON.parse(sessionStorage.getItem("device_info")).data.mac
				}
				const param = {
					mac: mac
				}
				This.axios({
	    			method:'get',
                 	url:url,
                  	params:param,
                  	responseType:'json'
	    		}).then(res =>{
	    			if(res.data.data){
	    				This.versionInfo = res.data.data.data
	    				//版本说明 mcuVersion description
	    			}
	    		})
			},
			getLocalCount:function(){
				const This = this 
				const url = `${this.HOST}/api/v1/music/local/count`
				const param = {
					openid: this.$route.query.openid
				}
				This.axios({
	    			method:'get',
                 	url:url,
                  	params:param,
                  	responseType:'json'
	    		}).then(res =>{
	    			if(res.data.status === 0){
	    				console.log(res.data.data)
	    				This.cocheer_collect = res.data.data.cocheer_collect
	    				This.cocheer_chinese_classic = res.data.data.cocheer_chinese_classic_default
	    				This.cocheer_drift_bottle = res.data.data.cocheer_drift_bottle_default
	    				This.cocheer_enlighten_english = res.data.data.cocheer_enlighten_english_default
	    				This.cocheer_fairy_tale = res.data.data.cocheer_fairy_tale_default
	    				This.cocheer_happy_songs = res.data.data.cocheer_happy_songs_default
	    				for(let i = 0; i<This.menu.length;i++){
	    					let menu = This.menu[i]
	    					if(menu.tag === "local_list" && menu.sub_menu){
	    						if(menu.sub_menu){
	    							const sub = menu.sub_menu
	    							sub.map(item => {
	    								item.count = This[`${item.tag}`]
	    							})
	    						}
	    					}
	    				}
	    			}
	    		})
			},
			showSub:function(item){
				const This = this
				if(item.sub_menu.length === 0){
					if(item.path.indexOf("http://") != -1 || item.path.indexOf("https://") != -1){
						window.location.href = item.path
					}else{
						this.$router.push({path:item.path,query:{openid:this.$route.query.openid}})
					}
				}else{
					if(!This.selected){
						This.selected = item 
						item.height += item.sub_menu.length * 4
						this.num = 90
					}else{
						if(item != This.selected){
							let temp = This.selected
							temp.selected = ''
							temp.height = 7
							temp.num = 0
							This.selected = item
							item.height += item.sub_menu.length * 4
							this.num = 90
						}else{
							This.selected = ''
							item.height = 7
							this.num = 0
						}
					}
				}
			},
			resetFactory:function(){
				const This = this
				this.getJSSDK().then(res => {
				if(res && res.data && res.data.data){
					this.sign_package = res.data.data
					const appId = this.sign_package.appId
					const timestamp = this.sign_package.timestamp
					const signature = this.sign_package.signature
					const nonceStr = this.sign_package.nonceStr
					const deviceId = JSON.parse(sessionStorage.getItem("device_info")).data.device_id
					console.log(deviceId)
					const openId = this.$route.query.openid
					const kq_id = This.KQ_ID;
					const resetParam = {
				        action: "device_ctrl",
				        ctrl_type: 8,
				        reset: "yes"
				    };
				    this.websocket.sendMessage(resetParam);
				    wx.config({
				    //都是从后台传过来的值
				        beta : true, // 开启内测接口调用，注入wx.invoke方法必填
				        debug : false, // 开启调试模式 必填
				        appId : appId, // 第三方app唯一标识必填
				        timestamp : timestamp, // 签名的时间戳必填
				        nonceStr : nonceStr, // 生成签名的随机串必填
				        signature : signature,//签名 必填
				        jsApiList : [
				            //添加使用的函数
				            'openWXDeviceLib', 'closeWXDeviceLib', 'getWXDeviceTicket' ]
				    });
				    //ready权限验证
				    wx.ready(function() {
				    	wx.invoke('openWXDeviceLib',{'connType':'lan'},function(res){

				    	})
				        wx.invoke('getWXDeviceTicket', {    
				            "deviceId": deviceId,
				            "type": 2
				        }, function (res) {
				        	//This.$toast(JSON.stringify(res))
				            const ticket = res.ticket;
				            const url = `${This.HOST}/api/v1/base/factory_reset`
				            const param = {
				            	openid: openId,
				            	device_id:deviceId,
				            	ticket:ticket,
				            	kq_id
				            }
				            This.axios({
				            	method:'post',
			                 	url:url,
			                  	data:param,
			                  	responseType:'json'
				            }).then(res =>{
				            	if(res && res.data && res.data.status === 0){
				            		This.$toast(JSON.stringify(res.data.message));
				            	}else{
				            		This.$toast("恢复出厂设置失败");
				            	}
				            	setTimeout(function () {
			                        window.location.reload();
			                    }, 1200);
				            })
				        })
				    })
				    wx.error(function(res) {
				    	This.$toast(JSON.stringify(res))
				    });
					}
			    })
			},
			otaUpdate:function(sub){
				if(!this.$store.state.device_online_state){
					this.$toast("设备离线")
					return
				}

				if(this.$store.state.battery < 2){
					this.$this.$toast("电量不足，请保持电量充足后进行升级！")
					return
				}
				//先要检查电池
				if(this.versionInfo)
				{
					this.pop_component = "pop"
					this.pop_title = `更新到${this.versionInfo.mcuVersion}`
					this.pop_content = `${this.versionInfo.description}您确定要这么做吗？`
				}
			},
			goPath:function(sub){
				if(sub.tag && sub.tag === "factory_reset"){
					if(this.$store.state.device_online_state){
						this.pop_component = "Pop"
						this.pop_title =　"提示信息"
						this.pop_content = "恢复出厂设置将清除故事机除网络配置以外的其它设置，<br>您确定要这么做吗？"
						this.reset = true
					}else{
						this.$toast("设备离线")
					}
				}else if(sub.tag === "volume"){
					if(this.$store.state.device_online_state){
						this.type="bottom"
						this.pop_component = "Volume"
						this.pop_title = "最大音量"
						this.pop_content = "Volume"
					}else{
						this.$toast("设备离线")
					}
				}else if(sub.tag === "ota_update"){
					if(this.$store.state.device_online_state){
						if(!this.have_new_version){
							this.$toast("已经是最新版本了")
						}else{
							this.otaUpdate(sub)
						}
					}else{
						this.$toast("设备离线")
					}
				}else{
					const openid = this.$route.query.openid
					this.$router.push({path:sub.path,query:{openid:openid}})
				}
			},
			changeStatus:function(sub){
				if(!this.$store.state.device_online_state){
					this.$toast("设备离线")
					return
				}
				const sendData = {
					"action": "device_ctrl",
	                "ctrl_type": sub.ctrl_type,
				}
				if(sub.tag === 'led'){
					if(this.$store.state.led){
						this.$store.state.led = 0
					}else{
						this.$store.state.led = 1
					}
					sendData[`${sub.tag}`] = this.$store.state.led ? "on" : "off"
				}
				if(sub.tag === 'childlock'){
					if(this.$store.state.childlock){
						this.$store.state.childlock = 0
					}else{
						this.$store.state.childlock = 1
					}
					sendData[`${sub.tag}`] = this.$store.state.childlock ? "on" : "off"
				}
				this.websocket.sendMessage(sendData)
			},
			finish:function(){
				if(this.versionInfo){
					this.websocket.sendMessage('ota_update');
					this.pop_component = "Progress"
					this.pop_title = "设备升级中"
					this.type = 'center'
					return
				}
				if(this.reset){
					this.resetFactory()
				}
				this.pop_component = null
			},
			upgrade_success: function(){
				location.reload()
			},
			upgrade_fail:function(){
				location.reload()
			},
			cancel:function(){
				this.type = "bottom"
				this.pop_component = null
			},
			goCloud:function(){
				const openid = this.$route.query.openid
				this.$router.push({path:"/index",query:{openid:openid}})
			},
			change_percent:function(value){
				this.$store.state.volume = value
				const sendData = {
					"action":"device_set",
					"set_type":1,
					"max_vol":value
				}
				this.websocket.sendMessage(sendData)
			},
			checkDeviceOnline:function(){
				if(!this.$store.state.device_online_state){
					this.$toast("设备离线")
					return false
				}else{
					return true
				}
			}
		}
	}
</script>

<style scoped>
	.menu_wrap{
		transition: height 300ms;
		-webkit-transition: height 300ms;
		overflow:hidden;
	}

	.menu{
		position: relative;
		height: 7rem;
		line-height: 7rem;
		border-bottom: 1px solid #eee;
		padding: 0 2rem;
		font-size: 1.6rem;
	}
	.menu img{
		width:3.2rem;
		margin-right:1rem;
	}

	.arrow{
		position: absolute;
		display: inline-block;
		width:2rem;
		height:2rem;
		float: right;
		top:50%;
		transform: translateY(-50%);
		right:2rem;
		/* background: url(../../../../images/icon_have_more.png) no-repeat  center; */
		background-size:40%;
		transition: transform 500ms;
		-webkit-transition: -webkit-transform 500ms; 
	}

	.menu:after{
		content: '';
		display: block;
		height: 0;
		clear: both;
	}

	.sub_menu{
		height: 4rem;
		line-height: 4rem;
		border-bottom: 1px dashed #eee;
		padding-left: 5rem; 
		overflow:hidden;
		font-size: 1.4rem;
	}

	.head{
		position: relative;
		top:50%;
		transform: translateY(-50%);
		margin:0 auto;
		text-align: center;
	}

	.head img{
		width: 7rem;
	}

	.hide{
		display: none;
	}
	.show_sub{
		display: block;
		position: relative;
	}
	.show{
		display: inline-block;
	}
	.button{
		margin-top:2rem;
		margin-bottom:2rem;
		height: 4rem;
		line-height: 4rem;
		text-align: center;
		border-radius: 3rem;
		border:1px solid #4dcb9b;
		margin-right:1rem;
		margin-left:1rem;
		color: #4dcb9b;
		font-size: 1.6rem;
	}
	.title_bg{
		/* background:url(../../../../images/robot_bg.png); */
		background-size: 100%;
	}

	.xuan{
		transform: rotate(90deg) translateX(-50%) translateY(50%);
		transition: transform 500ms;
		-webkit-transform:rotate(90deg) translateX(-50%) translateY(50%);
		-webkit-transition: -webkit-transform 500ms; 
	}
	.sub_block{
		display: inline-block;
	    height: 4rem;
	}

	.switch{
		position: absolute;
		display: inline-block;
		width: 4rem;
		height: 2rem;
		right:2rem;
		top:50%;
		background: white;
		transform: translateY(-50%);
		-webkit-transform: translateY(-50%);
		border-radius: 1rem;
		box-shadow: 0 0 1px #999;
		-webkit-box-shadow: 0 0 1px #999;
	}
	.switch.on{
		background: #4dcb9b;
	}
	.switch span{
		position: absolute;
		display: inline-block;
		width: 2rem;
		height: 2rem;
		border:1px solid #eee;
		background: white;
		border-radius: 50%;
		transition: transform 300ms;
		-webkit-transition: -webkit-transform 300ms;
	}

	.switch.on span{
		transform: translateX(1.8rem);
		-webkit-transform: translateX(1.8rem);;
		transition: transform 300ms;
		-webkit-transition:-webkit-transform 300ms;
	}
	.result_data{
		float:right;
		margin-right: 3rem;
		color:rgb(188,188,188);
	}

	.have_new{
		width: 0.8rem;
	    height: 0.8rem;
	    margin-top: 1.5rem;
	    margin-right:1rem;
	    border-radius: 0.4rem;
	    float: right;
	    background-color: #4dcb9b;
	}
	[v-cloak] {
	    display: none;
	}
</style>