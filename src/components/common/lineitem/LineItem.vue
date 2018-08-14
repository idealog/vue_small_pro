<!--单行组件-->
<template>
	<div class="wrap" @click.stop="itemClick($event)">
		<div class="inline-item" >
			<img :src="left_icon" class="small bottom_half"/>
			<span class="attr">{{attr_name}}</span>
		</div>
		<div class="inline-item right" >
			<div @click.stop="emitClick($event)">
				<slot :name="slot_business_component" ></slot>
				<img :src="right_icon" class="small" @click.stop="emitChangeIcon($event)"/>
			</div>
		</div>
		<div style="clear:both"></div>
	</div>
</template>
<script>
	export default {
		props:['left_icon','right_icon','attr_name','slot_business_component'],
		data(){
			return {

			}
		},

		methods:{
			emitClick(e){
				console.log('emitClick')
				this.$emit('slotClick',e)
			},
			emitChangeIcon(e){
				console.log('emitChangeIcon')
				this.$emit('ChangeIcon',e)
			},
			itemClick(e){
				this.$emit('itemClick',e)
			}
		}
	}
</script>

<style scoped>
	.wrap{
		padding-left: 1rem;
		padding-right: 1rem;
		min-height: 6rem;
		line-height: 6rem;
		border-bottom: 1px solid rgba(222,222,222,.6);
	}
	.inline-item{
		display: inline-block;
	}
	.attr{
		font-size: 1.6rem;
		margin-left: 1rem;
	}
	.left{
		float:left;
	}
	.right{
		float:right;
	}
	.small{
		width: 1.6rem;
	}
	.bottom_half{
		padding-bottom:.75rem;
	}
</style>