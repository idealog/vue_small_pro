<template>
	<div>
		<!--底部miniplayer-->
		<MiniPlayer :show_pop_player="show_pop_player" 
			@showPopPlayer="showPopPlayer"
			@playPrev="ctrl_prev" 
			@switchPlayStatus="ctrl_play_pause"
			@playNext="ctrl_prev"
			@showPlayingList="show_pop_list"  
		>
		</MiniPlayer>
		<!--弹出的正常player-->
		<div class="out_wrap" :class="{pop_up:show_pop_player}" ref="pop_player">
			<div class="pop_player" style="position:relative">
				<div style="position:absolute;top:1rem;left:1rem;width:1.8rem;height:1.8rem"><img style="width:100%" :src="course_down" @click.stop="hidePopPlayer" /></div>
				<h3 class="audio_title">{{title_tip}}</h3>
				<div class="pannel">
					<!--专辑图片背景部分-->
					<div class="album_bg" v-bind:style="{width:album_bg_width,height:album_bg_height}">
						<img v-lazy="$store.state.player.audio_pic_url"/>
					</div>
					<!--专辑标题部分-->
					<div class="album_title" v-bind:style="{paddingTop:title_padding_top,paddingBottom:title_padding_bottom}">
						<h3 class="album_font">
							{{$store.state.player.audio_name}}
						</h3>
						<h3 class="category_title">
							{{$store.state.player.album_name}}
						</h3>
					</div>
					<!--进度条部分-->
					<div class="progress_wrap" v-bind:style="{marginTop:wrap_margin_top,paddingTop:wrap_padding_top,paddingBottom:wrap_padding_bottom}">
						<div>
							<span class="start_time">{{formatTime($store.state.player.progress)}}</span>
							<component :is="progress_component" :offset_left="player_duration_offset_left" :percent="player_duration_percent" :width="player_duration_progress_width" :height="player_duration_progress_height" :bar_width="player_duration_bar_width" :bar_height="player_duration_bar_height" @changeProgress="changeDurationProgress" @submitResult="submitDurationProgress" ref="duration_progress" @progressLoaded="progressLoaded"></component>
							<span class="duration_time">{{formatTime($store.state.player.audio_duration)}}</span>
							<img :src="volume_icon" class="volume_img" @click.stop="showVolumeCtrl" />
						</div>
					</div>
					<!--底部图标控制播放部分-->
					<div class="container" v-bind:style="{paddingTop:container_padding_top,paddingBottom:container_padding_bottom}">
						<span class="player_icon" v-show="!collected" ><img :src="player_collect_icon"  @click.stop="collect"></span>
						<span class="player_icon" v-show="collected"><img :src="player_collected_icon"   @click.stop="collect"></span>
						<span class="player_icon"><img :src="player_prev_icon" @click.stop="ctrl_prev"></span>
						<span class="player_icon" v-show="!paused"><img style="width:4.5rem" :src="player_play_icon" @click.stop="ctrl_play_pause"></span>
						<span class="player_icon" v-show="paused"><img style="width:4rem" :src="player_pause_icon" @click.stop="ctrl_play_pause"></span>
						<span class="player_icon"><img :src="player_next_icon" @click.stop="ctrl_next"></span>
						<span class="player_icon"><img :src="player_list_icon" @click.stop="show_pop_list"></span>
					</div>
				</div>
			</div>
		</div>
		<!--弹出层组件-->
		<Pop :show_pop_ctrl="show_pop_ctrl" :show_pop_down_transition="show_pop_down_transition" :slot_business_component="slot_business_component" :pop_pannel_height="pop_pannel_height" :hide_pannel_class="hide_pannel_class" :hide_ele_class="hide_ele_class" >
			<div :slot="slot_business_component">
				<component :is="slot_business_component"
				:volume_progress_offset_left="volume_progress_offset_left" 
				:volume_progress_percent="volume_progress_percent"
				:volume_progress_width="volume_progress_width"
				:volume_progress_height="volume_progress_height"
				:volume_progress_bar_width="volume_progress_bar_width"
				:volume_progress_bar_height="volume_progress_bar_height"
				:volume_progress="volume_progress"
				@changeVolumeProgress="changeVolumeProgress"
				@CtrlVolumeLoaded = "startComputeVolume"
				@pop_ctrl_pannel_hide="hidePopCtrl"
				@PlayingListLoaded = "PlayingListLoaded"
				ref="business_component">
				</component>
			</div>
		</Pop>
	</div>
</template>
<script>
	import App from '@/App'
	import MiniPlayer from '@/components/common/business/MiniPlayer'
	import Pop from '@/components/common/pop/Pop'
	export default {
		components:{
			Pop,
			//业务组件按需引入
			CtrlVolume: function (resolve){ 
				require.ensure([], ()=> resolve(require('@/components/common/business/CtrlVolume')),'CtrlVolume')
			},
			PlayingList: function (resolve){ 
				require.ensure([], ()=> resolve(require('@/components/common/business/PlayingList')),'PlayingList')
			},
			Progress: function(resolve){
				require.ensure([], ()=> resolve(require('@/components/common/progress/Progress')),'Progress')
			},
			MiniPlayer
		},
		data(){
			return {
				title_tip:'正在播放',
				album_bg_width:'82vw',
				album_bg_height:'82vw',
				course_down: require('@/assets/img/course_down.png'),
				volume_icon:require('@/assets/img/volume.png'),
				player_collect_icon: require('@/assets/img/collect.png'),
				player_collected_icon: require('@/assets/img/collected.png'),
				player_prev_icon: require('@/assets/img/prev.png'),
				player_play_icon: require('@/assets/img/pause.png'),
				player_pause_icon: require('@/assets/img/play.png'),
				player_next_icon: require('@/assets/img/next.png'),
				player_list_icon: require('@/assets/img/play_list.png'),
				show_pop_ctrl:false,
				volume_tag:'调节设备音量',
				finish_tip:'完成',
				//歌曲时间进度条部分变量
				player_duration_offset_left:0,  
				player_duration_percent:0,
				player_duration_progress_width:'56vw',
				player_duration_progress_height:'4px',
				player_duration_bar_width: '1rem',
				player_duration_bar_height: '1rem',
				//音量部分进度条设置变量
				volume_progress_offset_left:0,
				volume_progress_percent:0,
				volume_progress_width:'60vw',
				volume_progress_height:'5px',
				volume_progress_bar_width: '1rem',
				volume_progress_bar_height: '1rem',
				//适配变量值		
				title_padding_top:'2rem',
				title_padding_bottom:'2rem',
				wrap_margin_top:'1rem',
				wrap_padding_top:'2rem',
				wrap_padding_bottom:'2rem',
				container_padding_top:'3rem',
				container_padding_bottom:'3rem',
				pop_pannel_height:'30vh',
				set_collected_tip:'收藏成功',
				set_collect_tip:'取消收藏',
				set_volome_tip:'设置音量成功',
				set_ctrl_play_tip:'正在通知设备播放',
				set_ctrl_pause_tip:'正在通知设备暂停',
				set_ctrl_prev_tip:'正在通知设备播放上一曲',
				set_ctrl_next_tip:'正在通知设备播放下一曲',
				hide_pannel_class:'pop_ctrl_pannel',
				hide_ele_class:'volume_finish_tip',
				slot_business_component:'',
				volume_progress:'volume_progress',
				show_pop_ctrl:false,
				collected:false,
				paused: true,
				show_pop_player: false,
				progress_component:null,
				show_pop_down_transition:false
			}
		},
		watch:{
			show_pop_player(val){
				if(val){
					this.progress_component = 'Progress'
				}
			}
		},
		mounted(){
			this.$store.state.show_small_player = false
			console.log(this.$store.state.player)
			console.log(this.$store.state.show_small_player)
			this.adjustProgressWidth()
			this.adjustAlbumBgHeight()
		},
		methods:{
			progressLoaded(){
				const vm = this
				this.getOffsetLeftValue('player_duration_offset_left',this.$refs.duration_progress._vnode.elm)
			},
			//根据屏幕宽度适配 歌曲进度条宽度
			adjustProgressWidth(){
				switch(window.screen.availWidth){
					case (320):
						this.player_duration_progress_width = '48vw'
						break
					case (360):
						this.player_duration_progress_width = '54vw'
						break
					case (375):
						this.player_duration_progress_width = '56vw'
						break
					case (384):
						this.player_duration_progress_width = '57vw'
						break
					case (411):
						this.player_duration_progress_width = '60vw'
					case (412):
						this.player_duration_progress_width = '60vw'
						break
					case (414):
						this.player_duration_progress_width = '60vw'
						break
					case (480):
						this.player_duration_progress_width = '66vw'
						break
					case (600):
						this.player_duration_progress_width = '72vw'
						break
					case (768):
						this.player_duration_progress_width = '78vw'
						break
					case (1024):
						this.player_duration_progress_width = '84vw'
						break
					case (1280):
						this.player_duration_progress_width = '85vw'
						break
				}
			},
			//根据不同移动端的屏幕高度 进行适配
			adjustAlbumBgHeight(){
				switch(window.screen.availHeight){
					case (480):
						this.album_bg_width = '50vw'
						this.album_bg_height = '50vw'
						this.title_padding_top = '1rem'
						this.title_padding_bottom = '1rem' 
						this.wrap_margin_top = '0'
						this.container_padding_top = '0'
						this.container_padding_bottom = '1rem'
						this.pop_pannel_height = '40vh'
						break
					case (568):
						this.album_bg_width = '52vw'
						this.album_bg_height = '52vw'
						break
					case (640):
						this.album_bg_width = '70vw'
						this.album_bg_height = '70vw'
						break
					case (667):
						this.album_bg_width = '70vw'
						this.album_bg_height = '70vw'
						this.title_padding_top = '2rem'
						this.title_padding_bottom = '1rem' 
						this.wrap_margin_top = '0'
						this.container_padding_top = '1rem'
						this.container_padding_bottom = '1rem'
						this.pop_pannel_height = '33vh'
						break
				}
			},
			hidePopPlayer(){
				const vm = this
				this.$refs.pop_player.classList.add("pop_down") //添加消失动画
				setTimeout(function(){
					vm.show_pop_player = false
				},200)
			},
			//获取相对左偏移量  第一个参数为赋值的属性  第二个参数是元素本身
			getOffsetLeftValue(attr,ele){
				const progress = ele
				if(!this[attr]){
					let parent = progress.offsetParent
			        this[attr] = progress.offsetLeft
			        this[attr] = this[attr] + parent.offsetLeft
			        while(parent.offsetParent){
		                parent = parent.offsetParent
		                if(typeof parent.offsetLeft === 'number'){
		                    this[attr] = parent.offsetLeft + this[attr]
		                }
		            }
				}
			},
			//业务部分 显示音量控制面板
			showVolumeCtrl(){
				this.show_pop_ctrl = true
				this.slot_business_component = "CtrlVolume"
			},
			hidePopCtrl(e){
				console.log('hide pannel')
				const vm = this
				this.show_pop_down_transition = true
				setTimeout(function(){
					vm.show_pop_down_transition = false
					vm.show_pop_ctrl = false
				},300)
			},
			changeDurationProgress(value){
				this.player_duration_percent = value
			},
			submitDurationProgress(value){
				//推送数据到server todo
				console.log('send duration progress percent' + value)
			},
			changeVolumeProgress(value){
				this.volume_progress_percent = value
			},
			submitVolumeProgress(value){
				//推送数据到server todo
				console.log('send volume progress percent' + value)
			},
			collect(){
				if(!this.collected)
				{
					this.$toast(this.set_collected_tip)
					this.collected = true
					this.$store.state.collected_list.push(this.$store.state.player)
				}else{
					this.$toast(this.set_collect_tip)
					this.collected = false
				}
			},
			ctrl_prev(){
				this.$toast(this.set_ctrl_prev_tip)
			},
			ctrl_play_pause(){
				this.paused = !this.paused
			},
			ctrl_next(){
				this.$toast(this.set_ctrl_next_tip)
			},
			show_pop_list(){
				this.show_pop_ctrl = true
				this.slot_business_component = 'PlayingList'
			},
			PlayingListLoaded(val){
				console.log('PlayingList loaded')
			},
			//加载完成时候 进行计算
			startComputeVolume(){
				console.log('CtrlVolume Loaded')
				const vm  = this
				vm.getOffsetLeftValue('volume_progress_offset_left',vm.$refs.business_component.$refs.volume_progress._vnode.elm)
			},
			showPopPlayer(val){
				this.show_pop_player = val
			}
		},
		render(){
			h => (App)
		}
	}
</script>
<style scoped>
	.out_wrap{
		position: fixed;
	    z-index: 200;
	    height: 100%;
	    width: 100%;
	    bottom: -100%;
	    display: none;
	    background: white;
	    background: rgb(248,248,248);
	}
	.pop_up{
		display: block;
		animation:slideUp 300ms ease 100ms;
		animation-fill-mode : forwards;
	}
	.pop_down{
		animation:slideDown 300ms ease;
		animation-fill-mode : forwards;
	}
	.audio_title{
		line-height: 4rem;
		text-align: center;
		border-bottom:1px solid rgba(222,222,222,.6);
	}
	.pannel{
		padding : 2rem;
		position: relative;
	} 
	.album_bg{
		width: 82vw;
		height: 82vw;
		margin: 0 auto;
		border-radius: 1rem;
		background: rgba(211,211,211,.5);
	}
	.album_title{
		text-align: center;
		padding: 2rem 1rem;
	}
	.progress_wrap{
		/* margin-top:1rem; */
		position: relative;
		padding: 2rem 0 0;
	}
	.start_time{
		display: inline-block;
	}
	.duration_time{
		display: inline-block;
	}
	.volume_img{
		width: 2.2rem;
	    right: 1.5rem;
	    float: right;
	    margin-bottom: .2rem;
	    margin-top: -.4rem;
	}
	.player_icon{
		height: 5rem;
		line-height: 5rem;
		flex: 1;
		text-align: center;
	}
	.player_icon img{
		width: 2.6rem;
	}
	.container{
		padding: 3rem 0;
		display: -webkit-flex;
	}
	.category_title{
		color: rgba(166,166,166,.6);
	}
	.album_font{
		font-size: 1.8rem;
		font-weight: bold;
	}
	.album_bg img{
		width:100%;
		height:100%;
		border-radius:1rem;
	}
	@keyframes slideUp
	{
		from {bottom: -100%;}
		to {bottom: 0;}
	}
	@-moz-keyframes slideUp /* Firefox */
	{
		from {bottom: -100%;}
		to {bottom: 0;}
	}
	@-webkit-keyframes slideUp /* Safari 和 Chrome */
	{
		from {bottom: -100%;}
		to {bottom: 0;}
	}
	@-o-keyframes slideUp /* Opera */
	{
		from {bottom: -100%;}
		to {bottom: 0;}
	}

	@keyframes slideDown
	{
		from {bottom: 0;}
		to {bottom: -100%;}
	}
	@-moz-keyframes slideDown /* Firefox */
	{
		from {bottom: 0;}
		to {bottom: -100%;}
	}
	@-webkit-keyframes slideDown /* Safari 和 Chrome */
	{
		from {bottom: 0;}
		to {bottom: -100%;}
	}
	@-o-keyframes slideDown /* Opera */
	{
		from {bottom: 0;}
		to {bottom: -100%;}
	}
</style>