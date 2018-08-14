<template>
	<div>
		<table class="playing">
			<tr>
				<th style="valign:middle" v-bind:class = "{hide: !show}">{{formatTime(currentTime)}}</th>
				<td style="width:100%">
					<div class="pro" v-bind:class = "{hide: !show}">
						<div class="pro_play" id="line1" v-bind:class = "{hide: !show}"><p id="line2" v-bind:class = "{hide: !show}" ref="progress"></p></div><div v-bind:style="{left:left + ceil}"  class="point" ref="progressBar" ></div>
					</div>
				</td>
				<th  v-bind:class = "{hide: !show}">{{formatTime(duration)}}</th>
			</tr>
			<tr>
				<th  v-bind:class="{hide: show || init_duration_show}">{{formatTime(duration)}}</th>
			</tr>
	  </table>
	  <audio :src="play_url" ref="audio" id="au"></audio>
	</div>
</template>
<script type="text/javascript">
	export default {
		props:['play_url','id','duration','playing','ceil','init_duration_show','show'],
		data(){
			return {
				'progress_width':'',
				'interval':'',
				'audio':'',
				'left': 0,
				'offset_left':'',
				'currentTime':0,
				't':'',
				'count':0,
				'move_count':0
			}
		},
		mounted() {
			if(this.$refs.progress){
				this.progress_width = this.$refs.progress.parentNode.clientWidth
			}
			this.bindEvents()
		},
		beforeDestroy(){
			clearInterval(this.interval)
		},
		methods:{
			play(value) {
				let This = this
				if(value === 'play'){
					//this.$nextTick(function(){
						if (window.WeixinJSBridge) {
			                WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
					            //This.notifyPlay()
					            //This.$toast('play')
					            This.$emit('audioReday',true)
				            	This.$refs.audio.play()
								This.setProgress()
			                }, false);
			            } else {
			                document.addEventListener("WeixinJSBridgeReady", function () {
			                	This.$toast('weixin call')
			                    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
						            //This.notifyPlay()
						            This.$toast('weixin call')
						            This.$emit('audioReday',true)
				            		This.$refs.audio.play()
									This.setProgress()
			                    });
			                }, false);
			            }
			            /*this.$nextTick(function(){
			            	This.$emit('audioReday',true)
		            		This.$refs.audio.play()
							This.setProgress()
						})*/
			            	
				}else{
					clearInterval(this.interval)
					this.$refs.audio.pause()
				}
			},
			notifyPlay(){
				const This = this
				This.$refs.audio.addEventListener("canplay",function(){
	            	This.$emit('audioReday',true)
	            	This.$refs.audio.play()
					This.setProgress()
	            })
			},
			setProgress() {
				let This = this
				//移动设备上面可能不兼容
				if(!This.offset_left){
					This.progress_width = This.$refs.progress.parentNode.clientWidth
					let parent = This.$refs.progress.offsetParent
			        This.offset_left = This.$refs.progress.offsetLeft
			        This.offset_left = This.offset_left + parent.offsetLeft
			        while(parent.offsetParent){
		                parent = parent.offsetParent
		                if(typeof parent.offsetLeft === 'number'){
		                    This.offset_left = parent.offsetLeft + This.offset_left
		                }
		            }
				}
				This.progress_width = This.$refs.progress.parentNode.clientWidth
	            This.setAutoProgress()
			},
			setAutoProgress(){
				let This = this
				This.interval = setInterval(() => {
					if(This.$refs.audio){
						let currentTime = This.$refs.audio.currentTime
						This.currentTime = Math.ceil(This.$refs.audio.currentTime)
						This.left = (currentTime / parseInt(this.duration)) * (This.progress_width - (This.$refs.progressBar.clientWidth + 4) / 2) 
						if(currentTime >= This.duration){
							This.$emit('changeProgress',0)
							This.$refs.audio.pause()  
							This.left = 0
							This.currentTime = 0
							clearInterval(This.interval)
						}
					}
				},1000)
			},
			bindEvents(){
				let This = this
				if(This.$refs.progressBar){
					This.$refs.progressBar.addEventListener('touchmove',function(e){
			            if(This.left < 0 || This.left > This.progress_width){

			            }else{
		            		let positionX = e.changedTouches[0].pageX
		            		let deltX = positionX - This.offset_left
		            		This.left = deltX
			                if(deltX > 0 && deltX <= This.progress_width){
			                	This.currentTime = Math.ceil((deltX / This.progress_width) * This.duration)  
			                	This.$refs.audio.currentTime = This.currentTime
			                }
			            }
			            clearInterval(This.interval)
			        })
			        This.$refs.progressBar.addEventListener('touchend',function(e){
			        	This.$refs.audio.currentTime = This.currentTime
			        	This.$emit('changeProgress',This.currentTime)
			        	This.setAutoProgress()
			        })
				}
			}
		}
	}
</script>

<style scoped>
	.pro .point {
	    width: 18px;
	    height: 18px;
	    border-radius: 9px;
	    background-color: #fff;
	    border: 1px solid #b4b4b4;
	    position: relative;
	    top: -2px;
	    margin-left: -3px; 
	}
	.playing {
		margin-top:.2rem;
	    height: 2rem;
	}
	.playing th {
	    font-size: 1.5rem;
	    color: #999;
	    font-weight: normal;
	    padding-left:.2rem;
	}
	.playing #curt, .playing #curp {
	    display: table-cell;
	}
	.playing #curt {
	    padding-right: 1.3rem;
	}
	.playing #totl {
	    padding-left: 1rem;
	}
	#curt, #curp {
	    display: none;
	}
	.pro {
	    height: 18px;
	    float: left;
	    width: 100%;
	    padding-left:6px;
	    position:relative;
	}
	.pro_play {
	    height: 2px;
	    background: #e5e5e5;
	    position: relative;
	    top: 8px;
	}
	.pro_play p {
	    height: 2px;
	    background-color: #a3a3a3;
	    width: 0;
	}
	.pro .point {
	    width: 16px;
	    height: 16px;
	    border-radius: 8px;
	    background-color: #fff;
	    border: 1px solid #b4b4b4;
	    position: relative;
	    top: -2px;
	}

</style>