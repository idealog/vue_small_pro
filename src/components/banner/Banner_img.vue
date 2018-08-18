<template>
	<div>
		<div style="overflow:hidden" @click.stop="introduce">
			<carousel  :indicators="true" :auto="6000" style="min-height:16rem">
		        <div v-for="i in list" v-bind:style="{background:i.img,backgroundSize:i.size,height:i.height}"></div>
	      	</carousel>
      	</div>
	</div>
</template>
<script type="text/javascript">
	import carousel from '@/components/carousel/index.js'
	export default{
		components:{
			carousel
		},
		data(){
			return {
				list:[
					{
						name:'图片一',
						img:`url(${this.HOST}/images/banner.png) no-repeat center center`,
						size:'100%',
						height:'100%',
					},
					{
						name:'图片二',
						img:`url(${this.HOST}/images/banner1.png) no-repeat center center`,
						size:'100%',
						height:'100%',
					},
					{
						name:'图片三',
						img:`url(${this.HOST}/images/banner2.png) no-repeat center center`,
						size:'100%',
						height:'100%',
					},
				]
			}
		},
		methods:{
			introduce:function(){
				return
				//this.$router.push({path:'/introduce'})
			}
		}
	}
</script>
