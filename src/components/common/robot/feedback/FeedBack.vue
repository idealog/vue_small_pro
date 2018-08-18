<template>
	<div>
		<LineItem :attr_name="attr_name" :slot_business_component="slot_business_component" :right_icon="right_icon" :hideLeftIcon="hideLeftIcon" :right_icon_width="right_icon_width">
			<div :slot="slot_business_component" class="select_question_type" @click.stop="showPop('SelectSuggestionType')">
				{{question_type}}
			</div>
		</LineItem>
		<Pop :show_pop_ctrl="show_pop_ctrl" :slot_business_component="slot_business_component_type" :show_pop_down_transition="show_pop_down_transition" :pop_pannel_height="pop_pannel_height">
			<div :slot="slot_business_component_type">
				<component :is="slot_business_component_type"
				@setType = "setType"
				@hidePop= "hidePop"
				>
				</component>
			</div>
		</Pop>
		<div style="position:relative">
			<textarea rows="10" cols="60" v-model="suggestion" class="feedback_area" maxlength="200" placeholder="请输入">
			</textarea>
			<div class="bottom_tip">
				{{getResult(suggestion.length)}}
			</div>
		</div>
		<div class="photo_wrap">
			<span><img :src="photo_icon"/></span>
			<span><img :src="photo_icon"/></span> 
		</div>
		<div class="bottom_wrap">
			<div class="btn disabled" :class="{abled:suggestion.length > 0}">
				{{submit_txt}}
			</div>
		</div>
	</div>
</template>
<script>
	import App from '@/App'
	import LineItem from '@/components/common/lineitem/LineItem'
	import Pop from '@/components/common/pop/Pop'
	import SelectSuggestionType from '@/components/common/business/SelectSuggestionType'
	export default {
		components:{
			LineItem,
			Pop,
			SelectSuggestionType
		},
		data(){
			return {
				attr_name:'问题类型',
				right_icon:require('@/assets/img/list_right.png'),
				photo_icon:require('@/assets/img/photo.png'),
				hideLeftIcon: true,
				right_icon_width:'1.8rem',
				slot_business_component:'question_type',
				question_type:'设备联网',
				show_pop_ctrl:false,
				slot_business_component_question:'pop_wrap',
				cancel_txt:'取消',
				finish_tip:'完成',
				items:[
					'设备使用',
					'设备联网'
				],
				initValue:0,
				showType:'',
				pop_pannel_height:'30rem',

				initValue:0,
				slot_business_component_type:null,
				suggestion:'',
				submit_txt:'提交',
				show_pop_down_transition:false
			}
		},

		methods:{
			showPop(pop_component){
				this.show_pop_ctrl = true
				this.slot_business_component_type = 'SelectSuggestionType'
			},
			hidePop(){
				const vm = this
				vm.show_pop_down_transition = true
				setTimeout(function(){
					vm.show_pop_down_transition = false
					vm.show_pop_ctrl = false
				},300)
			},
			setType(val){
				this.question_type = val
				this.hidePop()
			},
			dealLoaded(){
				this.initValue = 1
			},
			getResult(number){
				return number + '/200'
			}
		},

		render(){
			h =>  (App)
		}
	}	
</script>
<style scoped>
	.select_question_type{
		display:inline-block;
		font-size: 1.6rem;
	}
	.title{
		padding: 1rem 2rem;
		line-height: 4rem;
		border-bottom:.1rem solid rgb(245,245,245);;
	}
	.finish_tip{
		float:right;
		color:red;
	}
	.feedback_area{
		border-top:2rem solid rgb(245,245,245);
		width: 100%;
		border-bottom: .05rem solid (245,245,245);
		border-left:none;
		border-right:none;
		padding-top:1rem;
		padding-left:1rem;
		font-size: 2rem;
		height: 50vh;
	}
	.bottom_tip{
		position: absolute;
    	width: 6rem;
    	height: 4rem;
    	bottom: 0;
    	right: .5rem;
    	color:rgb(200,200,200);
	}
	.photo_wrap{
		position: relative;
		padding: 1rem;
		height: 8rem;
	}
	.photo_wrap img{
		height: 100%;
	}
	.bottom_wrap{
		padding-top:4rem;
		position: absolute;
		bottom:0;
		background: rgb(245,245,245);
		width: 100%;
		padding-bottom: 4rem;
	}
	.btn{
		width: 80vw;
		height: 4rem;
		margin: 0 auto;
		border-radius: 2rem;
		line-height: 4rem;
		font-size: 2rem;
		color: white;
		text-align: center;

	}
	.disabled{
		background:rgb(222,222,222);
	}
	.abled{
		background: rgb(249,67,48);
	}
</style>