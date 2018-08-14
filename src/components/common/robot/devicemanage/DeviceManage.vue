<template>
	<div>
		<h3 class="title">
			<span>{{device_manage_name}}</span>
		</h3>
		<div class="tip_use_robot">
			{{tip_use_robot}}
		</div>
		<div>
			<ul>
				<li class="device_item" v-for="item in device_list">
					<div class="current vertical" v-show="item.is_current">
						{{current}}
					</div>
					<div class="head_icon vertical" :class="{left_5:item.is_current}">
						
					</div>
					<div class="content vertical" :class="{left_10:item.is_current}">
						<h3>{{item.name}}</h3>
						<p>{{item.mac}}</p>
					</div>

					<div class="switch on" :class="{off:!item.online_status,hidden:item.is_current}" @click.stop="switchDevice(item)">
						{{switch_name}}
					</div>
				</li>
			</ul>
		</div>
		<PopCenter :show_pop_ctrl="show_pop_ctrl" :finish_txt="finish_txt" :cancel_txt="cancel_txt" :pop_title="pop_title" :pop_content="pop_content" @hidePop="hidePop"></PopCenter>
	</div>
</template>
<script >
	import App from '@/App'
	import PopCenter from '@/components/common/pop/PopCenter'
	export default {
		components:{
			PopCenter
		},
		data(){
			return {
				device_manage_name:'设备管理',
				tip_use_robot:'当前使用的设备：',
				current: '当前',
				switch_name:'切换',
				device_list:[
					{
						name:'小鸟1',
						mac:'ddddd',
						is_current: false,
						online_status:true
					},{	
						name:'小鸟2',
						mac:'fdsfdsf',
						is_current: false,
						online_status:false
					},
					{	
						name:'小鸟3',
						mac:'fdsfdsf',
						is_current: true,
						online_status:false
					}
				],
				show_pop_ctrl: false,
				finish_txt:'切换设备',
				cancel_txt:'取消',
				pop_title:'切换设备',
				pop_content:'切换设备吗'

			}
		},
		mounted(){

		},
		methods:{
			switchDevice(item){
				if(!item.online_status){
					this.$toast('该设备不在线！')
				}else{
					//调用弹出层插件
					this.show_pop_ctrl = true
					this.pop_content = '你当前绑定的设备是xxx,确定要切换为设备yyy吗？'
				}
			},
			hidePop(){
				this.show_pop_ctrl=false
			}
		},
		render(){
			h =>  (App)
		}
	}
</script>

<style scoped>
	.title{
		padding-top:1rem;
		padding-bottom: 1rem;
		text-align: center;
	}
	.tip_use_robot{
		height: 4rem;
		line-height: 4rem;
		background:rgba(235,235,235,.6);
		padding-left:1rem;
		font-size: 1.5rem;
	}
	.device_item{
		position: relative;
		overflow: hidden;
		padding : 2rem 1rem 2rem 1rem;
		border-bottom: 1px solid rgba(235,235,235,.6);
	}
	
	.current{
		color:white;
		display: inline-block;
		width: 3rem;
		height: 2rem;
		border-radius: 1rem;
		background: rgba(102,198,108);
		overflow: hidden;
		text-align: center;
		line-height: 2rem;
	}
	.head_icon{
		display: inline-block;
		width: 4rem;
		height: 4rem;
		background: rgba(222,222,222.6);
	}

	.content{
		display: inline-block;
		left:6rem;
	}
	
	.switch{
		display: inline-block;
		width: 4rem;
		height: 2rem;
		border-radius:1rem;
		overflow: hidden;
		text-align: center;
		color: white;
		line-height: 2rem;
	}
	.on{
		background: red;
		color:white;
		float:right;
	}

	.vertical{
		position: absolute;
		top:50%;
		transform:translateY(-50%);
	}
	.left_5{
		left: 5rem;
	}

	.left_10{
		left:10rem;
	}

	.off{
		background: rgba(222,222,222,.7);
	}
	.hidden{
		visibility: hidden;
	}

</style>