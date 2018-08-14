<template>
	<!--定义公共的弹出层插件-->
	<div>
		<div class="shadow" :class="{show_pop:show_pop_ctrl}">
			<div :class="{disappear:show_transition_out}">
				<div class="pop_ctrl_pannel" v-bind:style="{minHeight: pop_pannel_height}" :class="{slide_up:show_pop_ctrl,slide_down:!show_pop_ctrl}">
					<slot :name="slot_business_component"></slot> <!--定义插入业务组件 动态插入-->
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		// business_component 组件名称 hide_pannel_class 需要控制显隐的弹出层元素class  hide_ele_class 点击完成需要隐藏的弹出层
		// pop_pannel_height 设置弹出层最小高度 show_pop_ctrl 初始显示状态
		props:['slot_business_component','pop_pannel_height','hide_pannel_class','hide_ele_class','show_pop_ctrl'],
		data(){
			return {
				show_transition_out:false
			}
		},
		watch:{
			show_pop_ctrl(new_val,old_val){
				if(new_val != old_val && !new_val){
					//console.log('show disappear')
				}
			}
		},
		mounted(){

		}
	}	
</script>
<style scoped>
	.shadow{
		z-index: 100;
	    height: 100%;
	    width: 100%;
	    display: none;
	    position: absolute;
	    top: 0;
	}
	.disappear{
		display: block;
	}
	.show_pop{
	    display: block;
	    animation:pop_opacity_animation 300ms ease 100ms;
	    animation-fill-mode : forwards;
	}
	.pop_ctrl_pannel{
		position: absolute;
		min-height: 30vh;
		width: 100%;
		background: white;
		border-top-left-radius: 1rem;
		border-top-right-radius: 1rem;
		bottom: -100%;
		background: white;
	}
	.slide_up{
		animation:slideUp 300ms ease 100ms;
		animation-fill-mode : forwards;
	}
	.slide_down{
		animation:slideDown 1000ms ease 100ms;
		animation-fill-mode : forwards;
	}

	@keyframes slideUp
	{
		from {bottom: -100%;}
		to {bottom: 0;}
	}

	@-moz-keyframes slideUp /* Firefox */
	{
		from {bottom: -100%;}
		to {bottom: 0;}
	}

	@-webkit-keyframes slideUp /* Safari 和 Chrome */
	{
		from {bottom: -100%;}
		to {bottom: 0;}
	}

	@-o-keyframes slideUp /* Opera */
	{
		from {bottom: -100%;}
		to {bottom: 0;}
	}

	
	 @keyframes pop_opacity_animation{
		from {background: rgba(10,10,10,0);}
		to {background: rgba(10,10,10,0.6);}
	}
	
	
	@-webkit-keyframes pop_opacity_animation{
		from {background: rgba(10,10,10,0);}
		to {background: rgba(10,10,10,0.6);}
	} 


	@keyframes hide_opacity_animation{
		from {background: rgba(10,10,10,0.6);}
		to {background: rgba(10,10,10,0);}
	}
	
	@-webkit-keyframes hide_opacity_animation{
		from {background: rgba(10,10,10,0.6);}
		to {background: rgba(10,10,10,0);}
	}



	@keyframes slideDown
	{
		from {bottom: 0;}
		to {bottom: -100%;}
	}

	@-moz-keyframes slideDown /* Firefox */
	{
		from {bottom: 0;}
		to {bottom: -100%;}
	}

	@-webkit-keyframes slideDown /* Safari 和 Chrome */
	{
		from {bottom: 0;}
		to {bottom: -100%;}
	}

	@-o-keyframes slideDown /* Opera */
	{
		from {bottom: 0;}
		to {bottom: -100%;}
	}




</style>