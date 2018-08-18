<template>
	<div style="color:rgb(106,106,106);position:relative">
		<LineItem :left_icon="left_icon" :attr_name="attr_name" :left_icon_width="left_icon_width" :right_icon="right_icon" :slot_business_component ="slot_business_component">
			<div :slot="slot_business_component" class="switch_lock" :class="{active:active}">
				<span class="lock_bar" :class="{right:active}" @click="setChildLock"></span>
			</div>
		</LineItem>
	</div>	
</template>

<script>
	import LineItem from '@/components/common/lineitem/LineItem'
	import App from '@/App'
	export default {
		components:{
			LineItem
		},
		data(){
			return {
				left_icon:require('@/assets/img/locking.png'),
				attr_name:'立即上锁',
				right_icon:'',
				left_icon_width:'3rem',
				slot_business_component:'switch_lock',
				active:false
			}
		},
		mounted(){

		},
		methods:{
			setChildLock(){
				if(!this.active){
					this.active = true
				}else{
					this.active = false
				}
				// todo 推送童锁数据
			}
		},
		render(){
			h =>  (App)
		}
	}	
</script>
<style scoped>
	.switch_lock{
		display: inline-block;
		position: absolute;
		right:1.5rem;
		background: rgb(166,166,166);
		width: 4.3rem;
		height: 2.3rem;
		top:50%;
		transform: translateY(-50%);
		border-radius:2rem;
	}
	.lock_bar{
		display: inline-block;
		width:2.3rem;
		height: 2.3rem;
		background: white;
		border-radius: 50%;
		position: absolute;
		transition: transform 400ms ease;
	}
	.active{
		background: rgb(102,198,109);
	}
	.right{
		transform: translate(2rem,0);
	}
</style>