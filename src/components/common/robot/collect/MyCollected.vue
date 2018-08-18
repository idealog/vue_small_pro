<template>
	<div>
		<div class="wrap_head">
			<div class="head_item" @click.stop="active('song')">
				<span :class="{red:activeItem === 'song'}">
					{{song_title}} {{song_count}}
				</span>
				<div class="bottom_red"  v-if="activeItem === 'song'"></div>
			</div>
			<div class="head_item" @click.stop="active('album')">
				<span :class="{red:activeItem === 'album'}">
					{{album_title}} {{album_count}}
				</span>
				<div class="bottom_red" v-if="activeItem === 'album'"></div>
			</div>
		</div>
		<div>
			<LineItem :left_icon="left_icon" :left_icon_width="left_icon_width" :right_icon_width="right_icon_width" :attr_name="attr_name" :right_icon="right_icon" @ChangeIcon="rightIconClick">		
			</LineItem>
		</div>

		<!-- list 外层 传入数据 分页加载在外层设置参数 -->
		<div v-show="activeItem === 'song'" >
			<SongList :song_list="$store.state.collected_list" v-infinite-scroll="loadingData" infinite-scroll-disabled="loading" infinite-scroll-distance="10" >
				
			</SongList>
		</div>
		
		<div v-show="activeItem === 'album'">
			<AlbumList :album_list="album_list" @clickItem="dealItem">
				
			</AlbumList>
		</div>

	</div>
</template>
<script>
	import App from '@/App'
	import LineItem from '@/components/common/lineitem/LineItem'
	import SongList from '@/components/common/business/SongList'
	import AlbumList from '@/components/common/business/AlbumList'
	export default {
		components:{
			LineItem,
			SongList,
			AlbumList
		},
		data(){
			return {
				song_title:'单曲',
				song_count:50,
				album_title:'专辑', 
				album_count: 100,
				left_icon:require('@/assets/img/play.png'),
				attr_name:'全部点播',
				right_icon:require('@/assets/img/batch.png'),
				left_icon_width:'2rem',
				right_icon_width:'2rem',
				activeItem:'song',
				song_list:[
					{
						audio_name:'小兔子乖乖'
					},{
						audio_name:'红孩儿'
					}
				],

				loading: true,

				song_list:[

				],

				album_list:[
					{
						album_name:'实力专辑',
						album_count: 100,
						ability: 10,
						//icon: require('@/assets/img/name.png')
					},
					{
						album_name:'实力专辑',
						album_count: 100,
						ability: 10,
						//icon: require('@/assets/img/name.png')
					},
					{
						album_name:'实力专辑',
						album_count: 100,
						ability: 10,
						//icon: require('@/assets/img/name.png')
					},
					{
						album_name:'实力专辑',
						album_count: 100,
						ability: 10,
						//icon: require('@/assets/img/name.png')
					},
					{
						album_name:'实力专辑',
						album_count: 100,
						ability: 10,
						//icon: require('@/assets/img/name.png')
					}
				]

			}
		},
		mounted(){
			this.$store.state.show_small_player = true
		},
		methods:{
			active(tag){
				this.activeItem = tag
			},
			rightIconClick(e){
				console.log('dd')
				// 获取收藏列表
				if(this.activeItem === 'song'){
					this.$router.push({path:'/robot/collect/deletesonglist',query:{openid:this.$route.query.openid}})
				}

				if(this.activeItem === 'album'){
					this.$router.push({path:'/robot/collect/deletealbumlist',query:{openid:this.$route.query.openid}})
				}
			},
			loadingData(){

			},
			dealItem(item){
				this.$router.push({path:'/robot/collect/getsonglistbycollectedalbum',query:{openid:this.$route.query.openid}})
			}
		},

		render(){
			h =>  (App)
		}
	}	
</script>
<style scoped>
	.wrap_head{
		padding: 0 5rem 0 5rem;
    	position: relative;
    	overflow: hidden;
    	line-height: 5rem;
    	font-size: 2rem;
    	border-bottom: 1px solid rgba(222,222,222,.4);
	}

	.head_item{
		text-align: center;
		display: inline-block;
		float: left;
		width: 50%;
		position: relative;
	}

	.bottom_red{
		width: 2rem;
		height: .4rem;
		background: red;
		position: absolute;
		bottom:0;
		left:50%;
		transform: translateX(-50%);
	}
	.red{
		color:red;
	}

</style>>