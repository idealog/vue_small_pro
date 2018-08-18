<template>
	<div class="shadow" v-show="show_pop_ctrl">
		<div class="pop_ctrl_pannel">
			<h3 style="text-align:center">
				{{pop_title}}
			</h3>
			<slot :name="slot_business_component"></slot>
			<div style="text-align:center;margin-top:1rem;font-size:1.5rem;padding-left:1rem;padding-right:1rem">
				{{pop_content}}
			</div>
			<div class="flex_container">
				<div class="flex_btn" @click.stop="hidePop" v-if="cancel_txt">{{cancel_txt}}</div>
				<div class="flex_btn red" @click.stop="hidePop('finish')" v-if="finish_txt">{{finish_txt}}</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		props:['show_pop_ctrl','slot_business_component','pop_title','pop_content','finish_txt','cancel_txt'],
		data(){
			return {

			}
		},
		methods:{
			hidePop(type){
				this.$emit('hidePop',type)
			}
		}
	}
</script>

<style scoped>
	.shadow{
		z-index: 100;
	    height: 100%;
	    width: 100%;
	    position: fixed;
	    top: 0;
	    background: rgba(10,10,10,0.6);
	}
	.pop_ctrl_pannel{
		position: absolute;
		top:50%;
		left: 50%;
		transform:translate(-50%,-50%);
		min-height: 15rem;
		width: 70vw;
		background: white;
		border-radius: 1rem;
		padding-top:1rem;
	}
	.flex_container{
		display: -webkit-flex;
		border-top:1px solid rgba(222,222,222,.6);
		position: absolute;
    	bottom: 0;
    	width: 100%;
    	height: 4rem;
    	line-height: 4rem;
    	font-size: 1.6rem;
	}
	.flex_btn{
		flex:1;
		text-align: center;
		border-left: 1px solid rgba(222,222,222,.6);
	}
	.red{
		color:red;
	}

</style>