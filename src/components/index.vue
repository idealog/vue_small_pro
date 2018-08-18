<template>
	<div style = "overflow:hidden">
		<Search></Search>
		<Category></Category>
		
		<Loading :show="loading"></Loading>
		<MiniPlayer></MiniPlayer>
	</div>
</template>
<script>
import Banner from '@/components/banner/Banner'
import Search from './search/Search'
import Category from './content/category/Category'
import Loading from '@/components/loading/Loading'
import MiniPlayer from '@/components/common/propellingplayer/Player'
	export default {
		components: {
			/*Banner,*/
			Search,
			Category,
			Loading,
			MiniPlayer
		},
		data() {
			return {
				url:'',
				loading:false
			}
		},
		created(){
			this.url = this.HOST + '/images/banner.png'
			if(!this.ws){
				//this.websocket.init(this.$route.query.openid)
			}
		},
		mounted(){
			const This = this
			this.loading = true
			this.$nextTick(function(){
				setTimeout(function(){
					This.loading = false
				},600)
			})
		},
		activated(){

		},
		deactivated(){
			//this.$destroy()
		}
	}
</script>