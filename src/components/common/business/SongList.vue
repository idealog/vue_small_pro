<template>
	<!-- <ul class="content-wrapper" v-infinite-scroll="getDataByCategoryName" infinite-scroll-disabled="loading" infinite-scroll-distance="10">  -->
	<div>
		<ul class="content-wrapper">
			<li class="content-item" v-for="item,index in song_list">
				<div class="slot_wrap" v-show="showOptionSelect">
					<div class="slot_pic_container">
						<span class="circle" v-show="!item.selected" @click.stop="select(item)"></span>
						<img :src="slot_icon" style="width:1.6rem" v-show="item.selected" @click.stop="cancel(item)"/>
					</div>
				</div>	
				<div class="item">
					<h3>{{index+1}}、{{item.title || item.audio_name}}</h3>
					<p style="margin-top:.2rem;position:relative;">
						<div class="inline-attr">
							<img :src="ability_icon" class="ab_img"/>
							<span class="attr-item">能力值 +{{10}}</span>
						</div>
						<div class="inline-attr">
							<img :src="time_icon" />
							<span class="attr-item">{{formatTime(item.duration || item.audio_duration)}}</span>
						</div>
					</p>	
				</div>
				<div class="right_wrap" v-show="!hideRight">
					<span class="listen" @click.stop="listen(item)" v-show="!item.listen_status">试听</span>
					<div class="listen_circle" v-show="item.listen_status" @click.stop="listen(item)" >
						<circle-slider 
							:side="26"
							v-model="progress" 
							circle-color="#eee" 
							:progress-color="p_color"
							:knob-color="p_color"
							:circle-width="2" 
							:progress-width="2" 
							:knob-radius="1">
						</circle-slider>
					</div>
					<img :src="pause_icon" class="playing_status" v-show="!item.play_status"  @click.stop="send(item,index)" />
					<img :src="playing_icon" class="playing_status" v-show="item.play_status"  @click.stop="stop(item,index)" />
				</div>
			</li>
		</ul>
		<AudioPlayer :audio_url="audio_url" ref="audio" @canplay="startPlay" @pause="audioPause"></AudioPlayer>
	</div>
</template>

<script>
	import AudioPlayer from '@/components/audioplayer/AudioPlayer'
	export default {
		components:{
			AudioPlayer
		},
		props:{
			song_list:{
				type:Array,
				default: () => []
			},
			showOptionSelect:{
				type:Boolean,
				default: () => false
			},
			hideRight:{
				type:Boolean,
				default: () => false
			},

		},
		data(){
			return {
				ability_icon: require('@/assets/img/ability.png'),
				count_icon: require('@/assets/img/count.png'),
				pause_icon: require('@/assets/img/play.png'),
				playing_icon: require('@/assets/img/playing.png'),
				time_icon: require('@/assets/img/time.png'),
				progress:0, // 0-100
				p_color:'#ff0000',
				audio_url:'',
				//分页加载参数设置
				loading: true,
				have_more:true,
				page: 1,
				limit: 20,
				//试听部分参数设置
				test_listen_item: '', //记录试听的是哪一首
				listen_count: 1,
				interval_id: 1,
				operation_icon:require('@/assets/img/locking.png'),
				slot_icon: require('@/assets/img/selected.png')
			}
		},
		destroy(){
			this.audio_url = '' //组件销毁的时候初始化数据
			this.listen_count = 1
			clearInterval(this.interval_id)
			clearInterval(this.listen_timer)
			this.test_listen_item = ''
			this.progress = 0
		},
		deactivated(){
			this.audio_url = '' //组件销毁的时候初始化数据
			this.listen_count = 1
			clearInterval(this.interval_id)
			clearInterval(this.listen_timer)
			this.test_listen_item = ''
			this.progress = 0
		},
		methods:{
			init(){
				this.album_title = ''
				this.album_count = ''
				this.album_icon = ''
				this.have_more = true
				this.content = []
				//this.album_id = this.$route.query.album_id
				this.page = 1
				this.loading = true
				this.limit = 20
			},
			listen(item){
				//添加一个属性 listen_status 区分 该项是否处于正在试听状态中 
				//切换试听歌曲的时候进行初始化一次
				if(this.test_listen_item && this.test_listen_item.id != item.id){
					this.progress = 0
					this.listen_count = 1
					this.$set(this.test_listen_item,'listen_status',false)
				}
				console.log('listen_status:'+item.listen_status)
				this.test_listen_item = item //记录试听的是哪一首
				this.audio_url = this.test_listen_item.audio_url
				if(!item.listen_status){
					this.$refs.audio.control('play')
				}else{
					this.$refs.audio.control('pause')
				}
			},
			send(item,index){
				Object.assign(this.$store.state.player,item)
				console.log(this.$store.state.show_small_player)
				this.$set(item,'play_status',true)

				//推送
				this.$emit('',item)
			},
			stop(item,index){
				this.$store.state.play_status = false
				//this.$set(this.$store.state.player,'play_status',false)
				/*console.log(this.$store.state.play_status)*/
				clearInterval(this.interval_id)
				clearInterval(this.listen_timer)
				this.progress = 0
				this.listen_count = 1
				this.$set(item,'play_status',false)
			},
			startPlay(value){
				if(value){
					const vm = this
					this.$set(this.test_listen_item,'listen_status',true) //设置状态
					let duration = vm.test_listen_item.audio_duration
					console.log(this.listen_timer)
					clearInterval(this.interval_id) //保持只有一个定时器
					clearInterval(this.listen_timer)
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
			},
			select(item){
				/*if(!item.selected){
					this.$set(item,'selected',true)
				}else{
					this.$set(item,'selected',false)
				}*/
				console.log('select item')
				this.$emit('select',item)
			},
			cancel(item){
				this.$emit('cancel_select',item)
			}
		}
	}
	
</script>

<style scoped>
	.content-wrapper{
		padding: 0 1rem 2.2rem 1rem;
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
    	padding: .2rem .8rem .2rem .8rem;
    	border-radius: 1rem;
    	font-size: 1rem;
    	color: red;
    	position:absolute;
    	top:50%;
    	transform:translateY(-50%);
	}
	.attr-item{
    	top: .2rem;
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
		width: 1.8rem;
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
		margin-left:5rem;
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
	.inline-attr{
		position: relative;
		display: inline-block;
	}
	.inline-attr img{
		width:1.7rem;
	}
	.right_wrap{
		flex:.35;
		position:relative;
	}


	.slot_wrap{
		position:relative;
		display: inline-block;
		width:3rem;
		flex: .13;
	}

	.slot_pic_container{
		position: absolute;
		width: 3rem;
		height: 3rem;
		top:50%;
		transform:translateY(-50%);
		text-align: left;
	}
	.slot_pic_container img{
		width: 1.6rem;
		position: absolute;
		top:50%;
		transform: translateY(-50%);
	}
	.circle{
		display: inline-block;
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 50%;
		border: .2rem solid rgb(222,222,222);
		top: 50%;
    	position: absolute;
    	transform: translateY(-50%);
	}
</style>