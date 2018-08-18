<template>
	<div>
		<div>
			<LineItem :left_icon="left_icon" :left_icon_width="left_icon_width" :right_icon_width="right_icon_width" :attr_name="attr_name" :right_icon="right_icon" @ChangeIcon="rightIconClick" >		
			</LineItem>

			<SongList :song_list="song_list">
				
			</SongList>
		</div>
	</div>
</template>
<script type="text/javascript">
	import LineItem from '@/components/common/lineitem/LineItem'
	import SongList from '@/components/common/business/SongList'
	export default{
		components:{
			LineItem,
			SongList
		},
		data(){
			return {
				left_icon:require('@/assets/img/play.png'),
				attr_name:'全部点播',
				right_icon:require('@/assets/img/batch.png'),
				left_icon_width:'2rem',
				right_icon_width:'2rem',

				album_id:'',
				song_list:[]
			}
		},
		mounted(){
			this.getSongList()
		},
		methods:{
			getSongList(){
				this.song_list = this.$store.state.collected_list
			},
			rightIconClick(){
				this.$router.push({path:'/robot/collect/deletesonglist',query:{openid:this.$route.query.openid}})
			}
		}
	}
</script>