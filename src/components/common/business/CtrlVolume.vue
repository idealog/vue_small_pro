<!--控制音量的业务组件-->
<template>
	<div>
		<h3 class="volume_title">
			<span class="tag">{{volume_tag}}</span>
			<span class='volume_finish_tip' @click.stop="hidePop($event)">{{finish_tip}}</span>
		</h3>
		<div class="set_volome">
			<img :src="volume_icon" class="small_icon" />
			<Progress :offset_left="volume_progress_offset_left" :percent="volume_progress_percent" :width="volume_progress_width" :height="volume_progress_height" :bar_width="volume_progress_bar_width" :bar_height="volume_progress_bar_height" :ref="volume_progress" @changeProgress="changeVolumeProgress" @submitResult="submitVolumeProgress">
			</Progress>
			<img :src="volume_icon" />
		</div>
	</div>
</template>
<script type="text/javascript">
	import Progress from '@/components/common/progress/Progress'
	export default{
		components:{
			Progress
		},
		props:['volume_progress_offset_left','volume_progress_percent','volume_progress_width','volume_progress_height','volume_progress_bar_width','volume_progress_bar_height','volume_progress'],
		data(){
			return {
				volume_icon:require('@/assets/img/volume.png'),
				volume_tag:'调节设备音量',
				finish_tip:'完成',
				set_volome_tip:'设置音量成功',
				hide_pannel_class:'pop_ctrl_pannel',
				hide_ele_class:'volume_finish_tip'
			}
		},

		mounted(){
			this.$emit('CtrlVolumeLoaded')
		},
		methods:{
			hidePop(e){
				this.$emit('pop_ctrl_pannel_hide',e)
			},
			changeVolumeProgress(value){
				this.$emit('changeVolumeProgress',value)
			},
			submitVolumeProgress(value){
				//推送数据到server todo
				console.log('send volume progress percent' + value)
			},

		}
	}
	
</script>

<style scoped>
	.volume_title{
		padding: 1rem 2rem;
		line-height: 4rem;
		border-bottom: .1rem solid rgb(233,233,233);
	}
	.tag{
		color: rgba(168,168,168,.6);
		font-weight: bold;
	}
	.volume_finish_tip{
		float:right;
		color:red;
	}
	.set_volome{
		text-align: center;
		padding-top:3rem;
	}
	.small_icon{
		width: 3rem;
	}
	
</style>