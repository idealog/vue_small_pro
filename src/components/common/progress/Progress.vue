<!--进度条组件-->
<template>
	<div class="progress" ref="progress"  v-bind:style="{width:width,height:height}">
		<div class="volume_progress" v-bind:style="{width: percent + '%'}"></div>
		<div class="drag_bar" v-bind:style="{left: percent + '%', width: bar_width, height: bar_height}" ref="progress_bar"></div>
	</div>
</template>

<script>
	export default {
		//offset_left 相对位置偏移量 percent 进度条百分比  width 进度条宽度  height 进度条高度
		props:['offset_left','percent','width','height', 'bar_width', 'bar_height'],
		data(){
			return {
				progress_width:0,
				submit_percent:0
			}
		},
		mounted(){
			this.$emit('progressLoaded',true)
			this.addEvents()
		},
		methods:{
			addEvents(){
				this.progress_width = this.$refs.progress.clientWidth
				const vm = this
				this.$refs.progress_bar.addEventListener('touchmove',function(e){
					vm.setPosition(e.changedTouches[0].pageX)
				})
				this.$refs.progress_bar.addEventListener('touchend',function(e){
					vm.setPosition(e.changedTouches[0].pageX)
					vm.submitResult(vm.submit_percent)
				})
			},
			setPosition(pageX){
				console.log('get target')
				console.log(pageX)
				let left  = pageX - this.offset_left // 
				console.log(left)
				console.log(this.$refs.progress.clientWidth) //225
				if(left >= 0 && left <= this.$refs.progress.clientWidth){
					this.submit_percent = left * 100 / this.$refs.progress.clientWidth
					console.log(this.submit_percent)
					this.$emit('changeProgress',this.submit_percent) //向上传递百分比
				}
			},
			submitResult(result){
				this.$emit('submitResult', result) //提交百分比值
			}
		}
	}
</script>

<style scoped>
	.progress{
		position: relative;
		display: inline-block;
		margin-bottom: 2px;
		/* height: 4px; */
		border-radius: 2px;
		/* width: 56vw; */
		background: rgba(222,222,222,.5);
	}
	.drag_bar{
		position: absolute;
		display: inline-block;
	    /* width: 1rem; */
	    /* height: 1rem; */
	    background: red;
	    border-radius: 50%;
	    top: -4px;
	}
	.volume_progress{
		height: 3px;
	    /* width: 100px; */
	    background: red;
	    z-index: 100;
	    position: absolute;
	    top: .5px;
	}
</style>