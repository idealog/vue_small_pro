<template>
	<div class="wrap">
		<h3 class="title">
			<span class="tag" @click.stop="hidePop($event)">{{cancel_txt}}</span>
			<span class='finish_tip' @click.stop="hidePop($event)">{{finish_tip}}</span>
		</h3>
		<!--选择属性-->
		<div>
			<div>
				<Picker :items="list" :initValue="initValue" :currentValue.sync="showSex">
				</Picker>
			</div>
		</div>
	</div>
</template>

<script>
	import Picker from '@/components/common/picker/Picker'
	export default{
		components:{
			Picker
		},
		data(){
			return {
				cancel_txt:'取消',
				finish_tip:'完成',
				list:[
					'男',
					'女'
				],
				initValue:23,
				showValue:'',
				showSex:''
			}
		},
		watch:{
			showSex(val){
				const index = parseInt(val)
				console.log(this.list[index])
			}
		},
		mounted(){},
		methods:{
			hidePop(e){
				this.$emit('setSex',this.list[parseInt(this.showSex)])
				this.$emit('setBabySexPanel',false)
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