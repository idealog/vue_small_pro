<template>
	<div>
		<div class="head_bg">
			<img :src="head_img" ref="head_img" style="visibility:hidden">
		</div>
		<div >
			<canvas width="300" height="300" ref="canvas">
				
			</canvas>
		</div>
	</div>

</template>

<script>
	export default {
		data(){
			return{
				head_img:this.$store.state.head_img
			}
		},
		mounted(){
			this.drawImgOnCanvas()
		},	
		methods:{
			drawImgOnCanvas(){
				let ctx = this.$refs.canvas.getContext('2d')
				let img = this.$refs.head_img
				ctx.drawImage(img,0,0,200,200)
			}
		},
		render(){
			h =>  (App)
		}
	}
</script>
<style scoped>
	.head_bg{
		/* background: rgb(34, 34, 34); */
    	width: 100%;
    	height: 100%;
    	position: absolute;
	}
</style>