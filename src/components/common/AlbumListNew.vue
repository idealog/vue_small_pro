<template>
	<div v-infinite-scroll="getAlbumList" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
		<AlbumList :album_list="album_list" @clickItem="dealClickItem"></AlbumList>
		<h3 v-show="no_data" class="no_data_tip">没有数据了</h3>
		<Loading :show="loading"></Loading>
		<MiniPlayer></MiniPlayer>
	</div>
</template>
<script>
	import Loading from '@/components/loading/Loading'
	import AlbumList from '@/components/common/business/AlbumList'
	import MiniPlayer from '@/components/common/propellingplayer/Player'
	import {getAlbumListByTag} from '@/service/getData'
	export default {
		components:{
			Loading,
			AlbumList,
			MiniPlayer
		},
		data(){
			return {
				ability_icon: require('@/assets/img/ability.png'),
				count_icon: require('@/assets/img/count.png'),
				album_list:[],
				category_id: this.$route.query.category_id,
				page: 1,
				limit: 20,
				loading: true,
				no_data:false,
				scroll:0,
				have_more:true
			}
		},
		mounted(){
			//this.getAlbumList(this.page,this.limit,this.category_id)
			window.addEventListener('touchend',this.handleScroll)
		},
		activated(){
			window.addEventListener('touchend',this.handleScroll)
			console.log(this.scroll)
			if(this.scroll){
				window.scrollTo(0,this.scroll) //记录滚动位置
			}
			if(this.category_id != this.$route.query.category_id){
				this.init()
				this.getAlbumList(this.page,this.limit,this.category_id)
			}else{
				this.loading = false
			}
		},
		deactivated(){
			this.loading = true
			this.isFirstVisit = true
			window.removeEventListener('touchend',this.handleScroll)
		},
		destroy(){
			window.removeEventListener('touchend',this.handleScroll)
		},
		methods:{
			handleScroll(){
				let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
  				this.scroll = scrollTop;
			},
			init(){
				this.album_list = []
				this.page = 1
				this.limit = 20
				this.loading = true
				this.no_data = false
				this.category_id = this.$route.query.category_id
			},
			getAlbumList(){
				console.log(this.no_data)
				if(this.no_data){
					return
				}
				getAlbumListByTag(this.page++,this.limit,this.category_id).then(resp => {
					if(resp && resp.data){
						if(resp.data.status === 0 && resp.data.data && resp.data.data.length){
							this.album_list = [...this.album_list,...resp.data.data]
							//this.page++
						}else{
							this.no_data = true
						}
					}else{
						this.no_data = true
					}
					this.loading = false;
				})
			},
			dealClickItem(item){
				console.log(item)
				this.$router.push({path:'/songlist',query:{album_id:item.id}})
			}
		}
	}
</script>
<style scoped>
	.item{
		padding: 0 1rem 0rem 1rem;
	}
	.title_img{
		width: 5rem;
		height: 5rem;
		margin-bottom: 3rem;
		display: inline-block;
	}
	.content{
		margin-left:.5rem;
		display: inline-block;
		border-bottom:  1px solid rgb(235,235,235);
		width: calc(100% - 6rem);
		padding-bottom: 1rem;
		padding-top:.5rem;
	}
	.title{
		margin-bottom:.4rem;
	}
	.attr{
		position: relative;
		font-size: .8rem;
		color:rgb(166,166,166);
	}
	.attr img{
		display: inline-block;
		height: 1.2rem;
	}

	.attr span{
		display: inline-block;
		position: absolute;
		top:.3rem;
		margin-left: .2rem;
	}
	.no_data_tip{
		text-align:center;
		margin-top:1rem;
		margin-bottom:1rem;
	}
</style>
