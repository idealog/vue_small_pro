<template>
	<section class="wrapper">
		<div class="header-container">
			<img :src="album_icon" class="flex-item" style="flex:.6;background:grey">
			<div class="flex-item" style="margin-left:1rem;padding:0 .6rem 0">
				<h3 class="head_title">{{album_title}}</h3>
				<div class="attr">
					<div>
						<img :src="ability_icon" /> <span> 能力值+10</span>
					</div>
					<div>
						<img :src="count_icon" /> <span> {{album_count}}首</span>
					</div>
				</div>
				<div>
					<span class="button">
						播放全部
					</span>
				</div>
			</div>
		</div>
		<div v-show="activeTag === 'introduce'">
			<p class="introduce" v-if="introduce">{{introduce}}</p>
			<p style="padding: 1rem;text-align:center" v-if="!introduce">暂无介绍</p>
		</div>
		<div style="height:70vh">
			<div v-show="activeTag === 'songlist'" v-infinite-scroll="getDataByCategoryName" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
				<SongList :song_list="content" >
				</SongList>
			</div>
			<h3 v-show="!have_more" class="no_data_tip">没有数据了</h3>
		</div>
		<AudioPlayer :audio_url="audio_url" ref="audio" @canplay="startPlay" @pause="audioPause"></AudioPlayer>
		<MiniPlayer></MiniPlayer>
	</section>
</template>
<script>
	import {getAudiosByAlbumId,getAlbumDetailByAlbumId} from '@/service/getData'
	import AudioPlayer from '@/components/audioplayer/AudioPlayer'
	import SongList from '@/components/common/business/SongList'
	import MiniPlayer from '@/components/common/propellingplayer/Player'
	export default{
		components:{
			AudioPlayer,
			SongList,
			MiniPlayer
		},
		data(){
			return {
				activeTag: 'songlist',
				introduce: '',
				page: 1,
				album_icon: '',
				album_title:'',
				album_count:'',
				content:[],
				category_name:'',
				have_more: true,
				ability_icon: require('@/assets/img/ability.png'),
				count_icon: require('@/assets/img/count.png'),
				pause_icon: require('@/assets/img/play.png'),
				playing_icon: require('@/assets/img/playing.png'),
				p_color:'#ff0000',
				progress:0, // 0-100
				listen_timer:'',
				listen_count:1,
				album_id: '',
				limit: 20,
				loading: true,
				test_listen_item:'', //设置当前试听的是哪一首单曲
				audio_url:'',
				interval_id: 1,
				scroll:0
			}
		},
		mounted(){
			this.album_id = this.$route.query.album_id
			this.$store.state.show_small_player = true
			this.getAlbumDetail()
			window.addEventListener('touchend',this.handleScroll)
		},
		activated(){
	    	console.log(this.content)
			console.log(this.album_id, this.$route.query.album_id)
			window.addEventListener('touchend',this.handleScroll)
			console.log(this.scroll)
			if(this.scroll){
				window.scrollTo(0,this.scroll) //记录滚动位置
			}
	    	if(this.album_id != this.$route.query.album_id){
	    		console.log('update songlist')
	    		this.init()
	    		this.getAlbumDetail()
	    		this.getDataByCategoryName()
	    	}else{
	    		this.loading = false
	    	}
	    },
	    deactivated(){
	    	this.loading = true
	    	window.removeEventListener('touchend',this.handleScroll)
	    	this.content.map(item => {
	    		this.$set(item,'listen_status',false)
	    		this.$set(item,'play_status',false)
	    	})
	    },
	    destroy(){
	    	window.removeEventListener('touchend',this.handleScroll)
	    	this.content.map(item => {
	    		this.$set(item,'listen_status',false)
	    		this.$set(item,'play_status',false)
	    	})
	    },
		methods:{
			handleScroll(){
				let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
				console.log(scrollTop)
  				this.scroll = scrollTop;
			},
			init(){
				this.album_title = ''
				this.album_count = ''
				this.album_icon = ''
				this.have_more = true
				this.content = []
				this.album_id = this.$route.query.album_id
				this.page = 1
				this.loading = true
				this.limit = 20
			},
			getAlbumDetail(){
				getAlbumDetailByAlbumId(this.album_id).then(res => {
					if(res && res.data && res.data.status === 0){
						this.album_title = res.data.data.album_name
						this.album_icon = res.data.data.icon
						if(res.data.data.album_count != 0){
							this.album_count = res.data.data.album_count
						}
					}
				})
			},
			getDataByCategoryName(){
				if(!this.have_more){
					return
				}
				return getAudiosByAlbumId(this.page++,this.limit,this.album_id).then(res => {
					if(res && res.data && res.data.status === 0 && res.data.data && res.data.data.length){
						console.log(res.data)
						this.content =  [...this.content,...res.data.data]
					}else{
						this.have_more = false
					}
					this.loading = false
				})
			},
			getData(source,album_id,page){
				if(!this.have_more){
					this.$refs.scroll.forceUpdate(true)
					return Promise.reject(null)
				}
				if(this.category_name){
					return getAudiosByAlbumId(this.page,20,this.album_id).then(res => {
						if(res && res.data && res.data.status === 0){
							console.log(res.data)
							return Promise.resolve(res.data.data)
						}else{
							this.have_more = false
							return Promise.reject(null)
						}
					})
				}
			},
			send(item,index){
				Object.assign(this.$store.state.player,item)
				console.log(this.$store.state.show_small_player)
				this.$set(item,'play_status',true)
			},
			stop(item,index){
				this.$store.state.play_status = false
				this.$set(item,'play_status',false)
			},
			listen(item){
				//添加一个属性 listen_status 区分 该项是否处于正在试听状态中 
				//切换试听歌曲的时候进行初始化一次
				if(this.test_listen_item && this.test_listen_item.id != item.id){
					this.progress = 0
					this.listen_count = 1
					this.$set(this.test_listen_item,'listen_status',false)
				}
				this.test_listen_item = item //记录试听的是哪一首
				this.audio_url = this.test_listen_item.audio_url
				if(!item.listen_status){
					this.$refs.audio.control('play')
				}else{
					this.$refs.audio.control('pause')
				}
			},
			startPlay(value){
				if(value){
					const vm = this
					this.$set(this.test_listen_item,'listen_status',true) //设置状态
					let duration = vm.test_listen_item.audio_duration
					console.log(this.listen_timer)
					if(!this.listen_timer){
						this.listen_timer = setInterval(function(){
							if(vm.listen_count <= duration){
								vm.listen_count ++
								vm.progress = vm.listen_count * 100 / duration
							}else{
								vm.listen_count = 1
								vm.progress = 0
								vm.$refs.audio.control('pause')
							}
							return this.interval_id
						},1000)
					}
				}
			},
			audioPause(value){
				if(value){
					this.audio_url = ''
					this.$set(this.test_listen_item,'listen_status',false)
					this.resetProgress()
				}
			},
			resetProgress(){
				this.listen_count = 1
				this.progress = 0
				clearInterval(this.interval_id)
			}

		}
	}
</script>

<style scoped>
	.wrapper{
		
	}
	.header-container{
		padding: 1rem;
		display: -webkit-flex;
		border-bottom: .2rem solid rgb(235,235,235);
	}
	.content-wrapper{
		padding: 0 1rem 0 1rem;
	}
	.flex-item{
		flex: 1;
		height: 10rem;
		width: 10rem;
		display: inline-block;
	}
	.attr{
		padding: 1rem 0 1rem 0;
		font-size: .9rem;
		color: rgb(166,166,166);
		display: relative;
	}
	.button{
		display: inline-block;
	    height: 2.5rem;
	    color: white;
	    line-height: 2.5rem;
	    padding: 0 1rem 0 1rem;
	    border-radius: 1.5rem;
	    background: rgb(251,68,46);
	    font-size: 1.5rem;
	}
	.hwrapper{
		padding: .9rem 5rem .9rem 5rem  ;
		display: -webkit-flex;
		border-bottom:  1px solid rgb(235,235,235);
	}
	.hitem{
		flex: 1;
		text-align: center;
	}
	.active{
		padding: .8rem 0 .8rem 0;
		border-bottom:.2rem solid red;
	}
	.introduce{
		text-indent: 2em;
		padding: 1rem;
	}
	.content-item{
		padding: 1rem 0 1rem 0;
		display: block;
		display: -webkit-flex;
		border-bottom:  1px solid rgb(235,235,235);
	}
	.item{
		flex: 1;
	}
	.listen{
		border: 1px solid red;
		padding: .2rem .4rem .2rem .4rem;
		border-radius: .8rem;
		font-size: .9rem;
		color:red;
	}
	.attr-item{
		position: absolute;
    	top: .2rem;
		position: absolute;
		font-size: .9rem;
		color: rgb(166,166,166);
		margin-right: .5rem;
	}
	.head_title{
		overflow: hidden;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    -webkit-line-clamp: 1;
	    -webkit-box-orient: vertical;
	    line-height: 1.5rem;
	}
	.attr img{
		height: 1.5rem;
		display: inline-block;
	}
	.attr div{
		position: relative;
	}
	.attr span{
		display: inline-block;
		position: absolute;
		top:.2rem;
		margin-left: .2rem;
	}
	.ab_img{
		height: 1.2rem;
		display: inline-block;
	}
	.play_module{
		text-align:center;
		color:red;
		flex:.4;
		display: relative;
	} 
	.listen_circle{
		position: absolute;
		top:50%;
		transform: translateY(-50%);
	}
	.playing_status{
		position:absolute;
		margin-left:3.6rem;
		width:2rem;
		top:50%;
		transform:translateY(-50%)
	}

	.show{
		display: inline-block;
	}

	.hide{
		display: none;
	}
	.no_data_tip{
		text-align:center;
		margin-top:1rem;
		margin-bottom:1rem;
	}
</style>