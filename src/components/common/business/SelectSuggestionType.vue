<template>
	<div>
		<div>
			<h3 class="title">
				<span class="tag" @click.stop="hidePop">{{cancel_txt}}</span>
				<span class='finish_tip' @click.stop="hidePop('finish')">{{finish_tip}}</span>
			</h3>
			<div>
				<Picker :items="items" :initValue="initValue" :currentValue.sync="showType">
				</Picker>
			</div>
		</div>
	</div>
</template>	
<script type="text/javascript">
	import Picker from '@/components/common/picker/Picker'
	export default{
		props:['initValue'],
		components:{
			Picker
		},
		data(){
			return {
				items:[
					'设备联网',
					'设备使用',
					'APP',
					'功能与设计建议',
					'其它'
				],
				showType:'',
				cancel_txt:'取消',
				finish_tip:'完成'
			}
		},
		watch:{
			showType(val){
				const index = parseInt(val)
				console.log(this.items[index])
			}
		},
		mounted(){
			this.$emit('loaded')
		},
		methods:{
			hidePop(val){
				if(val === 'finish'){
					this.$emit('setType',this.items[parseInt(this.showType)])
				}else{
					this.$emit('hidePop')
				}
			}
		}
	}
</script>
<style scoped>
	.title{
		padding: 1rem 2rem;
		line-height: 4rem;
		border-bottom:.1rem solid rgb(245,245,245);;
	}
	.finish_tip{
		float:right;
		color:red;
	}
</style>