<template>
	<div>
		<template v-for="item,index in member_list">
			<LineItem :key="index" :left_icon_width="item.left_icon_width" :left_icon="item.left_icon" :attr_name="item.attr_name" :right_icon="item.right_icon">
			</LineItem>
		</template>
		<div class="save_btn" @click.stop="addMember">
			<span>{{add_txt}}</span>
		</div>

		<PopCenter :pop_title="pop_title" :show_pop_ctrl="show_pop_ctrl" :cancel_txt="cancel_txt" :finish_txt="finish_txt" :slot_business_component="slot_business_component"
		@hidePop = "hidePop"
		>
			<div :slot="slot_business_component" class="slot_input_wrap">
				<input type="text" :placeholder="placeholder" class="slot_input">
				<div class="tip"> {{tip}}</div>
			</div>
		</PopCenter>
	</div>
</template>
<script>
	import App from '@/App'
	import LineItem from '@/components/common/lineitem/LineItem'
	import PopCenter from '@/components/common/pop/PopCenter'
	export default {
		components:{
			LineItem,
			PopCenter
		},
		data(){
			return {
				member_list:[
					{
						left_icon_width:'3rem',
						left_icon: require('@/assets/img/member.png'),
						attr_name: '爸爸',
						right_icon: require('@/assets/img/list_right.png')
					},
					{
						left_icon_width:'3rem',
						left_icon: require('@/assets/img/member.png'),
						attr_name: '妈妈',
						right_icon: require('@/assets/img/list_right.png')
					},
					{
						left_icon_width:'3rem',
						left_icon: require('@/assets/img/member.png'),
						attr_name: '爷爷',
						right_icon: require('@/assets/img/list_right.png')
					},
					{
						left_icon_width:'3rem',
						left_icon: require('@/assets/img/member.png'),
						attr_name: '奶奶',
						right_icon: require('@/assets/img/list_right.png')
					}
					
				],
				add_txt:'添加新成员',
				finish_txt:'邀请',
				cancel_txt:'取消',
				show_pop_ctrl:false,
				slot_business_component:'input_area',
				pop_title:'添加新成员',
				placeholder:'请输入对方的手机号',
				tip: '如果对方已经注册设备，可以邀请成为家庭成员'

			}
		},

		methods:{
			addMember(){
				this.show_pop_ctrl = true
				//console.log('addMember')
			},
			hidePop(type){
				if(type === 'finish'){
				}
				this.show_pop_ctrl = false
			}
		},

		render(){
			h =>  (App)
		}
	}	
</script>

<style scoped>
	.save_btn{
		margin-top:1rem;
		padding:2rem 4rem;
	}
	.save_btn span{
		display: block;
		text-align: center;
		line-height: 4rem;
		border: 1px solid;
		border-radius: 1rem;
		font-size: 1.6rem;
	}
	.slot_input_wrap{
		width: 100%;
		padding: 1rem 2rem 0rem 2rem;
	}
	.slot_input{
		width: 100%;
    	border: 1px solid rgb(166,166,166);
    	line-height: 2.5rem;
    	text-align: center;
    	font-size: 1.6rem;
    	color:rgb(166,166,166);
	}
	.tip{
		color:rgb(166,166,166);
	}
</style>