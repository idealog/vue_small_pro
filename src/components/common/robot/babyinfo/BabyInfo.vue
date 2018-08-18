<template>
	<div>
		<LineItem :left_icon="left_icon" :attr_name="attr_head_name" :right_icon="right_icon" :slot_business_component="head_img">
			<img :src="head_icon" :slot="head_img" @click.stop="setBabyAvatar"/>
		</LineItem>
		<LineItem :left_icon="nickname_icon" 
			:attr_name="attr_nickname_name" 
			:right_icon="nick_right_icon" 
			:slot_business_component="input_nickname" 
			@slotClick="switchStatus" 
			@ChangeIcon= "clearInput"
			>
			<input type="text" ref="nick_input" :readOnly="nickReadOnly" :class="{bg_input:!nickReadOnly}"  :slot="input_nickname" class="nick_cls_input" v-model="nickname"  />
		</LineItem>
		<LineItem :left_icon="sex_icon" :attr_name="attr_sex_name" :right_icon="right_icon" @itemClick="showPop('SetBabySex')" :slot_business_component="select_babysex">
			<div  :slot="select_babysex" class="option" @click.stop="showPop('SetBabySex')"> {{sex}}</div>
		</LineItem>
		<LineItem :left_icon="birth_icon" :attr_name="attr_birth_name" :right_icon="right_icon"  @itemClick="showPop('SetBabyBirth')" :slot_business_component="select_birth">
			<div :slot="select_birth" class="option" @click.stop="showPop('SetBabyBirth')"> {{birth}} </div>
		</LineItem>	
		<!--底部弹出层组件-->
		<Pop :show_pop_ctrl="show_pop_ctrl" :slot_business_component="slot_business_component" :show_pop_down_transition="show_pop_down_transition" :pop_pannel_height="pop_pannel_height">
			<div :slot="slot_business_component">
				<component :is="slot_business_component" @setBabySexPanel="setBabySexPanel"
				@setBabyBirthPanel="setBabyBirthPanel"
				@setSex = "setSex"
				@setBirth = "setBirth">
				</component>
			</div>
		</Pop>
		<div class="save_btn" @click.stop="saveBabyInfo">
			<span>{{save_txt}}</span>
		</div>
	</div>
</template>
<script>
	import App from '@/App'
	import LineItem from '@/components/common/lineitem/LineItem'
	import Pop from '@/components/common/pop/Pop'
	import SetBabySex from '@/components/common/business/SetBabySex'
	import SetBabyBirth from '@/components/common/business/SetBabyBirth'
	export default {
		components:{
			LineItem,
			Pop,
			SetBabySex,
			SetBabyBirth
		},
		data(){
			return {
				head_icon:require('@/assets/img/member.png'), //模拟头像
				left_icon:require('@/assets/img/name.png'),
				attr_head_name:'头像',
				right_icon:require('@/assets/img/list_right.png'),
				nick_right_icon: require('@/assets/img/list_right.png'),
				head_img:'head_img',
				nickname_icon:require('@/assets/img/nickname.png'),
				sex_icon: require('@/assets/img/sex.png'),
				birth_icon: require('@/assets/img/birthday.png'),
				attr_nickname_name:'昵称',
				attr_sex_name:'宝宝性别',
				attr_birth_name:'宝宝生日',
				input_nickname:'input_nickname',
				clear_icon:require('@/assets/img/clear.png'),
				nickReadOnly: true,
				nickname:'',
				show_pop_ctrl: false,
				slot_business_component:'',
				pop_pannel_height:'30rem',
				save_txt:'保存',
				select_babysex:'select_babysex',
				sex:'未知',
				birth:'2018-08-14',
				select_birth: 'select_birth',
				show_pop_down_transition:false
			}
		},

		methods:{
			switchStatus(e){
				if(this.nickReadOnly){
					this.nickReadOnly = false
					this.nick_right_icon = this.clear_icon
					this.$nextTick(function(){
						this.$refs.nick_input.focus()
					})
				}
			},
			clearInput(e){
				console.log(this.nickname,this.nickReadOnly)
				if(!this.nickReadOnly){
					console.log(this.nickname)
					this.nickname = ''
					this.$nextTick(function(){
						this.$refs.nick_input.focus()
					})
				}else{
					this.$nextTick(function(){
						this.$refs.nick_input.focus()
					})
				}
			},
			restoreStatus(e){
				console.log(e)
				console.log('onblur')
				this.nickReadOnly = true
				this.nick_right_icon = this.right_icon
			},
			showPop(slot_business_component){
				this.show_pop_ctrl = true
				this.slot_business_component = slot_business_component
			},
			setBabySexPanel(show){
				this.setHideTransition()
			},
			setBabyBirthPanel(show){
				this.setHideTransition()
			},
			setBabyAvatar(){
				console.log('go babyhead')
				this.$router.push({path:'/robot/babyhead',query:{openid:this.$route.query.openid}})
			},
			setSex(val){
				this.sex =  val
				this.setHideTransition()
			},
			setBirth(val){
				this.birth = val
				this.setHideTransition()
			},
			saveBabyInfo(){
				/*const param = {
					birth,
					head_img,
					nickname,
					sex
				} = this*/
				//todo 发送请求 保存宝宝信息
			},
			setHideTransition(){
				const vm = this
				vm.show_pop_down_transition = true
				setTimeout(function(){
					vm.show_pop_down_transition = false
					vm.show_pop_ctrl = false
				},300)
			}
		},

		render(){
			h =>  (App)
		}
	}	
</script>

<style scoped>
	.nick_cls_input{
		border: none;
    	text-decoration: none;
    	height: 4rem;
    	font-size:1.6rem;
    	text-align: right;
	}
	.bg_input{
		background: rgba(235,235,235,.6);
		border-radius:1rem;
	}
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
	.option{
		display: inline-block;
		font-size: 1.6rem;
	}
</style>