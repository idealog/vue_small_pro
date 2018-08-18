<template>
	<div class="player_wrap" @click.stop="showPopPlayer">
		<div class="bg">
		</div>
		<div class="ele_wrap">
			<div class="robot_img">
				<div>
					<img :src="head_icon"/>
				</div>
			</div>
			<div class="song_detail">
				<div style="display:inline-block;padding-top: .15rem; ">
					<div class="audio_title" style=" -webkit-box-orient: vertical;">
						{{$store.state.player.audio_name}}
					</div>
					<div class="album_title" style="-webkit-box-orient: vertical;">
						{{$store.state.player.album_name}}
					</div>
				</div>
			</div>
			<div class="operation_icon">
				<div class="flex_container">
					<div class="item">
						<img :src="prev_icon" style="width:1.6rem" @click.stop="playPrev">
					</div>
					<div class="item">
						<img :src="play_icon" v-show="!playing" style="width:1.8rem" @click.stop="switchPlayStatus">
						<img :src="pause_icon" v-show="playing" style="width:1.8rem" @click.stop="switchPlayStatus">
					</div>
					<div class="item">
						<img :src="next_icon" style="width:1.6rem" @click.stop="playNext">
					</div>
					<div class="item">
						<img :src="list_icon" style="width:1.6rem" @click.stop="showPlayingList">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		props:{
			show_pop_player:{
				type:Boolean,
				default: ()=> false
			}
		},
		data(){
			return {
				head_icon:require('@/assets/img/member.png'),
				prev_icon:require('@/assets/img/prev.png'),
				play_icon: require('@/assets/img/play.png'),
				pause_icon: require('@/assets/img/pause.png'),
				next_icon: require('@/assets/img/next.png'),
				list_icon: require('@/assets/img/play_list.png'),
				playing:false
			}
		},
		methods:{
			showPopPlayer(){
				this.$emit('showPopPlayer',true)
			},
			playPrev(){
				this.$emit('playPrev')
			},
			switchPlayStatus(){
				this.playing = !this.playing
				this.$emit('switchPlayStatus')
			},
			playNext(){
				this.$emit('playNext')
			},
			showPlayingList(){
				this.$emit('showPlayingList')
			}
		}
	}
</script>
<style scoped>
	.player_wrap{
		padding: 1rem .5rem 1rem .5rem;
    	position: fixed;
	    bottom: 0;
	    width: 100%;
	    border-top: .1rem solid rgb(222,222,222);
	    /* background: rgb(248,248,248); */
	    background: white;
	}
	.ele_wrap{
		position: relative;
		display: -webkit-flex;
	}
	.robot_img{
		flex: .2;
	}
	.song_detail{
		flex:1;
		padding-left:.6rem;
		padding-right: .6rem;
	}
	.operation_icon{
		flex:.8;
		line-height: 3.5rem;
	}
	.flex_container{
		display: -webkit-flex;
	}
	.item{
		flex:1;
	}
	.item img {
		width :2rem;
	}
	.audio_title{
		font-size: 1.5rem;
	    overflow: hidden;
	    display: -webkit-box;
	    -webkit-line-clamp: 1;
	    -webkit-box-orient: vertical;
	   	color:rgb(153,153,153);
	}
	.album_title{
		font-size: 1.5rem;
		overflow: hidden;
	    display: -webkit-box;
	    -webkit-line-clamp: 1;
	    -webkit-box-orient: vertical;
	    color:rgb(153,153,153);
	}
	.robot_img img{
		width: 4rem;
		border: .1rem solid white;
		border-radius: .3rem;
	}
</style>