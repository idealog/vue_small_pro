<template>
	<div>
		<h3 class="title_head">
			<span class="head_left">
				{{my_device_head}}
			</span>
			<div class="head_right" @click.stop="RouterTo('/robot/devicemanage')">
				<span>
					{{turn_or_add}}
				</span>
				<img :src="list_right" class="list_right" />
			</div>
		</h3>

		<!--我的宝宝信息-->
		<div class="list_item-wrapper" @click.stop="RouterTo('/robot/babyinfo')">
			<div class="head_img">
				<img :src="head_img" />
			</div>
			<div class="content">
				<h3>
					{{robot_name}}	
				</h3>
				<div class="item">
					<img :src="icon_sex_girl" class="icon_small" /> {{baby_age}} 
				</div>
				<div class="item" style="margin-top:.5rem">
					<span style="margin-right:.5rem">{{device_status_name}}</span><img :src="icon_electric_quantity_full" class="icon_small"/><span style="margin-right:.5rem;" class="font_color">{{surplus}}{{avail_electricity}}</span><img :src="icon_on_line" style="width:.6rem" /> <span class="font_color">{{online_status_name}}</span>
				</div>
			</div>
			<span class="list_right_arrow">
				<img :src="list_right" class="list_right " />
			</span>
		</div>
		<section>
			<div class="title">
				<span class="title_font">
					{{my}}
				</span>
			</div>
			<div>
				<ul>
					<li class="menu_item" v-for="item in main_menu_list" @click.stop="goPath(item)">
						<div>
							<span>
								<img class="icon_middle" :src="item.icon">
							</span>
							<span class="menu_title">
								{{item.title}}
							</span>
							<span class="menu_arrow">
								<img :src="list_right" class="list_right">
							</span>
						</div>
					</li>
				</ul>
			</div>
		</section>
		<section>
			<div class="title">
				<span class="title_font">
					{{function_name}}
				</span>
			</div>
			<div>
				<ul>
					<li class="menu_item" v-for="item in function_menu_list" @click.stop="goPath(item)">
						<div>
							<span>
								<img class="icon_middle" :src="item.icon">
							</span>
							<span class="menu_title">
								{{item.title}}
							</span>
							<span class="menu_arrow">
								<img :src="list_right" class="list_right">
							</span>
						</div>
					</li>
				</ul>
			</div>
		</section>
		<section>
			<div class="title">
				<span class="title_font">
					{{feedback}}
				</span>
			</div>
			<div>
				<ul>
					<li class="menu_item" v-for="item in feedback_menu_list" @click.stop="goPath(item)">
						<div>
							<span>
								<img class="icon_middle" :src="item.icon">
							</span>
							<span class="menu_title">
								{{item.title}}
							</span>
							<span class="menu_arrow">
								<img :src="list_right" class="list_right">
							</span>
						</div>
					</li>
				</ul>
			</div>
		</section>
		<PopCenter :show_pop_ctrl="show_pop_ctrl" :pop_title="pop_title" :cancel_txt="cancel_txt" :finish_txt="finish_txt" :slot_business_component = "slot_business_component" @hidePop="hidePop" >

			<div :slot="slot_business_component" class="progress_wrap" ref="progress_wrap">
				<div class="left_icon">
					<img :src="pop_icon" />
				</div>
				<!--添加progress组件-->
				<component :is="slot_business_component"

				:offset_left="volume_progress_offset_left" 
				:percent="volume_progress_percent"
				:width="volume_progress_width"
				:height="volume_progress_height"
				:bar_width="volume_progress_bar_width"
				:bar_height="volume_progress_bar_height"
				:volume_progress="volume_progress"
				@changeProgress="changeVolumeProgress"
				@progressLoaded = "startComputeVolume"
				ref="business_component"
				>	
				</component>
				<div class="right_icon">
					<img :src="pop_icon" />
				</div>
			</div>
		</PopCenter>
	</div>
</template>

<script scoped>
	import App from '@/App'
	import PopCenter from '@/components/common/pop/PopCenter'
	import Progress from '@/components/common/progress/Progress'
	export default {
		components:{
			PopCenter,
			Progress
		},
		data(){
			return {
				my:'我的',
				my_device_head:'我的设备',
				turn_or_add:'切换或添加',
				list_right: require('@/assets/img/list_right.png'),
				icon_sex_girl: require('@/assets/img/girl.png'),
				icon_sex_body: require('@/assets/img/boy.png'),
				icon_on_line: require('@/assets/img/on_line.png'),
				icon_off_line: require('@/assets/img/off_line.png'),
				icon_electric_quantity_full:require('@/assets/img/electric_quantity_full.png'),
				baby_age:'3岁',
				head_img:'',
				robot_name:'小宝贝的早教机',
				device_status_name:'设备状态',
				online_status_name:'在线',
				surplus:'剩余',
				avail_electricity: '80%',//可用电量

				main_menu_list:[
					{
						icon:require('@/assets/img/my_collected.png'),
						title:'我的收藏',
						path: '/robot/collect'

					},{
						icon:require('@/assets/img/footprint.png'),
						title:'我的足迹',
						path: '/robot/footprint'
					},{
						icon:require('@/assets/img/member.png'),
						title:'家庭成员',
						path: '/robot/familymember'
					}		
				],

				function_name:'功能',
				function_menu_list:[
					{
						icon:require('@/assets/img/locking.png'),
						title:'童锁',
						path: '/robot/childlock'

					},{
						icon:require('@/assets/img/lamp.png'),
						title:'亮度调节'
					}, {
						icon:require('@/assets/img/volume.png'),
						title:'音量调节'
					}		
				],
				feedback:'反馈',
				feedback_menu_list:[
					{
						icon:require('@/assets/img/feedback.png'),
						title:'意见反馈',
						path: '/robot/feedback'
					}	
				],
				slot_business_component:'',
				pop_content_component:'',

				cancel_txt:'取消',
				finish_txt:'完成',
				show_pop_ctrl:false,

				//音量部分进度条设置变量
				volume_progress_offset_left:0,
				volume_progress_percent:0,
				volume_progress_width:'calc(100% - 4rem)',
				volume_progress_height:'5px',
				volume_progress_bar_width: '1rem',
				volume_progress_bar_height: '1rem',
				volume_progress:'volume_progress',
				pop_title:'',

				pop_icon:'',


				volume_icon:require('@/assets/img/volume.png'),

				lamp_icon: require('@/assets/img/lamp.png')

			}
		},
		mounted(){
			this.$store.state.show_small_player = false
		},
		methods:{
			goPath(item){
				if(item.path){
					this.$router.push({path:item.path,query:{openid:this.$route.query.openid}})
				}else{
					if(item.title === '亮度调节'){
						this.pop_title = '设备亮度调节'
						this.show_pop_ctrl = true
						this.slot_business_component='Progress'
						this.pop_icon = this.lamp_icon
					}
					if(item.title === '音量调节'){
						this.pop_title = '设备音量调节'
						this.show_pop_ctrl = true
						this.slot_business_component='Progress'
						this.pop_icon = this.volume_icon
					}
				}
				
			},
			RouterTo(path){
				if(path){
					this.$router.push({path:path,query:{openid:this.$route.query.openid}})
				}
			},
			hidePop(){
				this.show_pop_ctrl = false
			},
			//加载完成时候 进行计算
			startComputeVolume(){
				console.log('CtrlVolume Loaded')
				const vm  = this
				//console.log(vm.$refs.business_component)
				vm.getOffsetLeftValue('volume_progress_offset_left',vm.$refs.business_component._vnode.elm)
				console.log(this.$refs.progress_wrap.clientWidth)
				this.volume_progress_offset_left = this.volume_progress_offset_left -  this.$refs.progress_wrap.clientWidth /2
				//vm.getOffsetLeftValue('volume_progress_offset_left',vm.$refs.business_component.$refs.volume_progress)
			},
			changeVolumeProgress(value){
				this.volume_progress_percent = value
			},
			//获取相对左偏移量  第一个参数为赋值的属性  第二个参数是元素本身
			getOffsetLeftValue(attr,ele){
				const progress = ele
				if(!this[attr]){
					let parent = progress.offsetParent
			        this[attr] = progress.offsetLeft
			        this[attr] = this[attr] + parent.offsetLeft
			        while(parent.offsetParent){
		                parent = parent.offsetParent
		                if(typeof parent.offsetLeft === 'number'){
		                    this[attr] = parent.offsetLeft + this[attr]
		                }
		            }
				}
			},
		},
		render(){
			h => (App)
		}
	}
</script>

<style scoped>
	.title_head{
		padding : 1rem;
		line-height: 5rem;
		overflow: hidden;
	}
	.head_left{
		display: inline-block;
		float:left;
		font-size: 2.6rem;
		font-weight: bold;
	}
	.head_right{
		display: inline-block;
		float:right;
	}
	.head_right span{
		font-size: 1.5rem;
	}
	.list_right{
		width:1.5rem;
	}

	.list_item-wrapper{
		position: relative;
		overflow: hidden;
		line-height: 100%;
		padding:0 1rem 1rem 1rem;
	}

	.head_img{
		display: inline-block;
		margin-top:.5rem;
		width: 8rem;
		height: 8rem;
		background: rgba(222,222,222,.6);
	}

	.content{
		display: inline-block;
		position: absolute;
		top: 50%;
		left: 10rem;
		right: 3rem;
		transform: translateY(-50%);
	}
	.list_right_arrow{
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
	}
	.icon_small{
		width: 1.6rem;
	}
	.content .item{
		margin-top:1rem;
	}
	.icon_smaller{
		width: .8rem;
	}
	.font_color{
		color:rgba(166,166,166,.6);
	}
	.title{
		padding: 1rem 1rem 0 1rem;
		height: 4rem;
		line-height: 4rem;
	}
	.title_font{
		font-size: 1.5rem;
		color:rgba(166,166,166,.6)
	}
	.icon_middle{
		width: 2.2rem;
	}
	.menu_item{
		width: 100%;
		padding: 1rem;
		line-height: 4rem;
		border-bottom: 1px solid rgba(235,235,235,.6);
	}
	.menu_arrow{
		float: right;
	}
	.menu_title{
		font-size: 1.8rem;
		margin-left:1rem;
	}
	.progress_wrap{
		padding-left:3.6rem;
		margin-top:2rem;
		position:relative;
	}
	.left_icon{
		position: absolute;
    	left: 1rem;
    	width: 2rem;
    	height: 2rem;
    	top: 50%;
    	transform: translateY(-50%);
	}

	.left_icon img{
		width:100%;
	}

	.right_icon{
		position: absolute;
    	right: 1rem;
    	width: 3rem;
    	height: 3rem;
    	top: 50%;
    	transform: translateY(-50%);
	}

	.right_icon img{
		width: 100%;
	}
</style>