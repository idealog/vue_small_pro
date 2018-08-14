<template>
	<div>
		<Banner :url="imgSrc"></Banner>
		<ul>
			<li v-for="item in list" class="item">
				<span class="tag">{{item.name}}</span>
				<span class="value" v-if="item.tag === 'version'">{{version}}</span>
				<span class="value" v-if="item.tag === 'song_count'">{{song_count}}</span>
				<span class="value" v-if="item.tag === 'capacity'">{{capacity}}</span>
				<span class="value" v-if="item.tag === 'total_capacity'">{{total_capacity}}</span>
			</li>
		</ul>
	</div>
</template>
<script type="text/javascript">
	import Banner from '@/components/banner/Banner'
	export default{
		name:'About',
		components:{
			Banner
		},data(){
			return {
				imgSrc:`${this.HOST}/images/banner.png`,
				list:[
					{
						"tag":"version",
						"name":"软件版本",
						"value":""
					},
					{
						"tag":"song_count",
						"name":"音频数量",
						"value":""
					},
					{
						"tag":"capacity",
						"name":"可用容量",
						"value":""
					},
					{
						"tag":"total_capacity",
						"name":"总容量",
						"value":""
					}
				],
				version:'',
				song_count:'',
				capacity:'',
				total_capacity:''
			}


		},
		mounted(){
			console.log(this.$store.state)
			const This = this

			this.list.map(item => {
				switch(item.tag){
					case 'version':
						This.version = This.$store.state.version
						console.log(this.version)
						break
					case 'song_count':
						This.song_count = This.$store.state.song_num
						break
					case 'capacity':
						This.capacity = This.$store.state.sdcard_free_size
						break
					case 'total_capacity':
						This.total_capacity = This.$store.state.sdcard_total_size
						break

				}
			})
		}
	}
</script>
<style type="text/css" scoped>
		.item{
			height: 5rem;
			line-height: 5rem;
			padding:0 1rem;
			border-bottom: 1px solid #eee;
		}
		.tag{
			display: inline-block;
			float:left;
		}
		.value{
			display: inline-block;
			float: right;
		}

</style>