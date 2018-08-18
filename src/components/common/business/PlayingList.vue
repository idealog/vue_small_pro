<!--播放列表组件-->
<template>
	<div>
		<div class="title">
			<div class="inline_title_left">
				共{{playing_list.length}}首
			</div>
			<div class="inline_title_right" @click.stop="changeMode">
				<span class="mode_name">
					{{getChin(current_mode.mode_name)}}
				</span>
				<span>
					<img :src="current_mode.mode_img" class="img_mod" />
				</span>
			</div>
		</div>
		<!--中间部分是歌曲列表部分-->
		<div class="list_wrap">
			<ul>
				<li class="flex_container" v-for="item,index in playing_list">
					<div class="flex_item flex_2">
						<img :src="item.audio_pic_url" class="audio_pic"/>
					</div>
					<div class="flex_item content">
						<h3>{{index+1}}、{{item.audio_name}}</h3>
						<p>{{item.author_name}}</p>
					</div>
					<div class="flex_item flex_2 trash">
						<img :src="icon_trash" @click.stop="del(item,index)"/>
					</div>
				</li>
			</ul>
		</div>
		<div class="bottom_buttom" @click.stop="hidePop($event)">
			<span>{{cancel_txt}}</span>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return {
				count: 10,
				cancel_txt:'取消',
				mode:{
					'loop':{
						mode_name:'loop',
						mode_img:require('@/assets/img/loop.png')
					},
					'list':{
						mode_name:'list',
						mode_img:require('@/assets/img/play_list.png')
					},
					'random':{
						mode_name:'random',
						mode_img:require('@/assets/img/random.png')
					},
					'oneloop':{
						mode_name:'oneloop',
						mode_img:require('@/assets/img/oneloop.png')
					}
				},
				current_mode:{
					mode_name:'',
					mode_img:''
				},
				playing_list:[
					{
						audio_name:'西游记',
						audio_pic_url:'http://fdfs.xmcdn.com/group22/M03/74/EE/wKgJLlidVRKyhKCSAABTmjxH1rY873_mobile_large.jpg',
						author_name:'吴承恩'
					},
					{
						audio_name:'水浒传',
						audio_pic_url:'http://fdfs.xmcdn.com/group22/M03/74/EE/wKgJLlidVRKyhKCSAABTmjxH1rY873_mobile_large.jpg',
						author_name:'施耐庵'
					},
					{
						audio_name:'红楼梦',
						audio_pic_url:'http://fdfs.xmcdn.com/group22/M03/74/EE/wKgJLlidVRKyhKCSAABTmjxH1rY873_mobile_large.jpg',
						author_name:'曹雪芹'
					},
					{
						audio_name:'三国演义',
						audio_pic_url:'http://fdfs.xmcdn.com/group22/M03/74/EE/wKgJLlidVRKyhKCSAABTmjxH1rY873_mobile_large.jpg',
						author_name:'罗贯中'
					},
					{
						audio_name:'格林童话',
						audio_pic_url:'http://fdfs.xmcdn.com/group22/M03/74/EE/wKgJLlidVRKyhKCSAABTmjxH1rY873_mobile_large.jpg',
						author_name:'雅格·格林和威廉·格林兄弟'
					},
					{
						audio_name:'格列佛游记',
						audio_pic_url:'http://fdfs.xmcdn.com/group22/M03/74/EE/wKgJLlidVRKyhKCSAABTmjxH1rY873_mobile_large.jpg',
						author_name:'乔纳森·斯威夫特'
					},
					{
						audio_name:'鲁滨逊漂流记',
						audio_pic_url:'http://fdfs.xmcdn.com/group22/M03/74/EE/wKgJLlidVRKyhKCSAABTmjxH1rY873_mobile_large.jpg',
						author_name:'丹尼尔·笛福'
					},
					{
						audio_name:'狂人日记',
						audio_pic_url:'http://fdfs.xmcdn.com/group22/M03/74/EE/wKgJLlidVRKyhKCSAABTmjxH1rY873_mobile_large.jpg',
						author_name:'鲁迅'
					}
				],
				icon_trash:require('@/assets/img/trash.png')
			}
		},
		mounted(){
			this.$emit('PlayingListLoaded') //组件加载完成 通知父组件
			this.getCurrentMode()
		},
		methods:{
			hidePop(e){
				this.$emit('pop_ctrl_pannel_hide',e)
			},
			getChin(val){
				let result = ''
				switch(val){
					case 'loop':
						result = '列表循环'
						break
					case 'list':
						result = '顺序播放'
						break
					case 'random':
						result = '随机播放'
						break
					case 'oneloop':
						result = '单曲循环'
						break
				}
				return result
			},
			getCurrentMode(){
				this.current_mode  = this.mode['random']
			},
			changeMode(){
				const list = Object.keys(this.mode)
				let index = list.indexOf(this.current_mode.mode_name)
				console.log(this.current_mode.mode_name,list,list.length,index)
				index = (index + 1) % list.length
				this.current_mode = this.mode[list[index]]
			},
			del(item,index){
				//todo 删除播放列表中一条数据
				this.playing_list.splice(index, 1)
			}
		}
	}
</script>
<style scoped>
	.title{
		font-size: 1.6rem;
		line-height: 5.6rem;
		padding: 0 1.5rem;
		border-bottom: 1px solid rgba(222,222,222,.6);
		overflow: hidden;
	}
	.inline_title_left{
		float: left;
		display: inline-block;
	}
	.inline_title_right{
		float: right;
		display: inline-block;
	}
	.img_mod{
		height: 1.8rem;
	}
	.mode_name{
		font-size: 1.5rem;
		color:rgb(166,166,166);
	}
	.list_wrap{
		height: 35rem;
		overflow-y: scroll;
		padding-bottom: 4rem;
	}
	.bottom_buttom{
		position: absolute;
		width: 100%;
		font-size: 1.6rem;
		text-align: center;
		line-height: 5rem;
		bottom:0;
		background: rgba(245,245,245);
	}
	.flex_container{
		display: -webkit-flex;
		width: 100%;
		min-height: 4rem;
		padding: 1rem 0 1rem 1rem;
		border-bottom: 1px solid rgba(234,234,234,.6);
	}

	.flex_item{
		flex:1;
	}

	.audio_pic{
		width:4rem;
	}
	.flex_2{
		flex: .2
	}

	.content{
		padding-left:.5rem;
		padding-top: .3rem;
	}

	.trash{
		line-height: 4rem;
		text-align: center;
	}

	.trash img{
		width:1.6rem;
	}


</style>