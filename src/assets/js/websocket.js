import Vue from 'vue'
import $store from '@/vuex/store'
export default {
    install(Vue, options) {
    	Vue.prototype.websocket_host = Vue.prototype.WEBSOCKET_HOST;
    	/*Vue.prototype.DeviceStatus = {
		    openId: null,
		    offline: true,
		    volume: 100,
		    led: 0,
		    battery: 0,
		    childlock: 0,
		    wechatMode: 0,
		    charger: 0,
		    sleepTime: 0,
		    restSleepTime: 0,
		    restSleep: 0,
		    version: null,
		    ota: 0, //0 none, 1 updating, 2 success, 3 fail
		    playerStatus: 0,
		    playerMode: 0,
		    songDuration: 0,
		    songPosition: 0,
		    songId: -1,
		    songName: null,
		    songUrl: null,
		    category: 0,
		    source: 0,
		    albumId: 0,
		    albumName: null,
		    sequence: 0,
		    isBabyFavor: false,
		    songNum: 0,
		    sdcardFreeSize: 0,
		    sdcardTotalSize: 0,
		    Chinese_speed: 0,
		    English_speed: 0,
		    voice_type: 0
		};*/ //状态由vuex管理
		// 刷新某个组件时候 判断 是否需要再次初始化ws
		//Vue.prototype.player_progress = 0
		Vue.prototype.player_timer = ''
		Vue.prototype.initWs = function(){
			if(!$store.state.openid){
				let openid = sessionStorage.getItem('openid')
				if(openid){
					$store.dispatch('CHANGE_OPENID',openid)
					Vue.prototype.websocket.init(openid)
				}else{
					Vue.prototype.websocket.init()
				}
			}	
		};

		Vue.prototype.isVoiceType = function(voice_type){
			console.log(voice_type)
			const VoiceType = Vue.prototype.constant.VoiceType 
			if (voice_type === VoiceType.PLAY_AIVOD || voice_type === VoiceType.PLAY_AIMUSIC ||
                voice_type === VoiceType.PLAY_LOCAL || voice_type === VoiceType.PLAY_NETVOD ||
                voice_type === VoiceType.PLAY_NETLIST || voice_type === VoiceType.PLAY_INVAILD ||
                voice_type === VoiceType.PLAY_COLLECT){
				return true 
			}else{
				return false
			}
		}

		Vue.prototype.sendSongs = function(index,count){
			if(isNaN(index) || isNaN(count) || $store.state.play_list.length === 0 || index < 0 || count < 0){
				return
			}
			for (let i = index;i<count;i++){
				CocheerWebSocket.sendMessage($store.state.play_list[i])
			}
		}

		Vue.prototype.isAdded = function(player){
            console.log($store.state.state_player)
            if(!$store.state.state_player["song_id"]){
            	return
            }
            let param = {
                openid: sessionStorage.getItem("openid"),
                song_id: $store.state.state_player.song_id,
                source: $store.state.state_player.source,
                //category: this.$store.state.state_player.album_detail.category,
                table: 0 //代表收藏那张表
            }
            console.log(param)
            Vue.prototype.axios({
                method:'get',
                params: param,
                url: Vue.prototype.HOST + '/api/v1/music/song/isAdded'
            }).then(res => {
                if(res.data.data){
                    $store.state.state_player.collect_status = res.data.data.collect_status
                }
            })
		}

		Vue.prototype.initProgress = function(song_position,song_duration){
			//设置音乐播放进度条
		}

		Vue.prototype.sendNextList = function(sequence){
			const len = $store.state.play_list.length
			if(len <= 0){
				return
			}
			if(sequence === 0){
				if(len <= sequence){
					Vue.prototype.$toast("序号错误");
				}else{
					if(len < 10){
						Vue.prototype.sendSongs(sequence,len)
					}else{
						Vue.prototype.sendSongs(sequence,10)
					}
				}
			}else{
				sequence = sequence - 1
				if(len - sequence <= 10){
					Vue.prototype.sendSongs(sequence,len)
				}else{
					Vue.prototype.sendSongs(sequence,len)
				}
			}
		}
		//控制面板
		Vue.prototype.controlPlayerPanel = function(player){
			if(!Vue.prototype.isVoiceType(player.voice_type)){
				return
			}
			let play_list = Vue.prototype.LStorage.getItem("play_list")
			if(play_list){
				play_list = JSON.parse(play_list)
				$store.dispatch(`CHNAGE_PLAY_LIST`,play_list)
			}
			$store.dispatch(`CHANGE_STATE_PLAYER`, player)
			Vue.prototype.isAdded(player)
			$store.dispatch('CHANGE_PLAY_MODE',player.mode)
			if(player.song_duration != 0){
				clearInterval($store.state.player_timer)
			}
			let count = player.song_position
			const PlayerStatus = Vue.prototype.constant.PlayerStatus
    		if(player.status === PlayerStatus.STOP){
    			$store.state.state_player.song_name = Vue.prototype.tips["stop"]
    			console.log($store.state.play_list)
    		}
    		if(player.status === PlayerStatus.PAUSE){
    			// 修改播放进度
    			console.log('pause status:' + player.status)
    		}
    		if(player.status === PlayerStatus.PLAYING){
    			// 修改播放进度
    			$store.state.player_count = player.song_position
    			$store.state.player_timer = setInterval(function(){
    				if($store.state.player_count < $store.state.state_player.song_duration){
    					$store.state.player_progress = $store.state.player_count * 100 / $store.state.state_player.song_duration
    					$store.state.player_count ++ 
    				}
    			},1000)
    		}
			// 播放专辑歌曲时候 推送列表信息
			if(player.status === PlayerStatus.NEXT){
				Vue.prototype.sendNextList(player.sequence)
			}
		}

    	let CocheerWebSocket = {
		    init: function(openid) {
		    	$store.dispatch('CHANGE_OPENID',openid)
		    	sessionStorage.setItem('openid',openid) //openid 存入 sessionStorage
		    	Vue.prototype.axios.get(`${Vue.prototype.HOST}/api/v1/relation/deviceBasicInfo?openid=${openid}`)
                .then(res => {
                	sessionStorage.setItem('device_info',JSON.stringify(res.data)) //查询设备基本信息写入sessionStorage
                	if(res.data.status !== 0){
                		if(res.data.status === 5){
                			$store.dispatch('CHANGE_SHOW_PROPELLING',false)
                		}
                		return Promise.reject(res.data.message);
                	}
                	$store.dispatch('CHANGE_SHOW_PROPELLING',true)
                	const info = `${openid}+${res.data.data.device_id}+${res.data.data.mac}`;
			        Vue.prototype.ws = new WebSocket(Vue.prototype.websocket_host, info);
			        Vue.prototype.ws.onopen = function(event) {
			        	console.log("连接成功");
			        	const sendData = {
		                    action: "device_status",
		                    state_type: Vue.prototype.constant.allStatusCode
		                };
		                Vue.prototype.websocket.sendMessage(sendData) //获取各种状态
			            CocheerWebSocket.heartbeat.init();
			        };
			        Vue.prototype.ws.onmessage = function(event) {
			            CocheerWebSocket.heartbeat.reset();
			            CocheerWebSocket.onMessage(event);
			        };
			        Vue.prototype.ws.onclose = function(event) {
			            console.log("连接关闭");
			            setTimeout(function() {
			                CocheerWebSocket.init(openid);
			            }, 1000);
			        };
			        Vue.prototype.ws.onerror = function(event) {
			            console.log("error:" + event);
			            setTimeout(function() {
			                CocheerWebSocket.init(openid);
			            }, 1000);
			        };
			        return Vue.prototype.axios.get(`${Vue.prototype.HOST}/api/v1/base/checkDeviceOnline?mac=${res.data.data.mac}`);
                }).then(resp =>{
                	if(resp){
                		let status = resp.data.data.data;
	                	if(status === "true"){
	                		$store.dispatch("CHANGE_DEVICE_STATE","设备在线");
	                		$store.dispatch("CHANGE_ONLINE",true)
	                	}else{
	                		$store.dispatch("CHANGE_DEVICE_STATE","设备离线");
	                		console.log("设备离线");
	                		$store.dispatch("CHANGE_ONLINE",false)
	                	}
                	}else{
                		return Promise.reject("获取设备状态异常")
                	}
                }).catch(e => {
                	Vue.prototype.$toast(e);
                })	
		    },
		    onMessage: function(event) {
		    	let data = event.data;
		    	const PlayerStatus = Vue.prototype.constant.PlayerStatus
		    	data = eval('(' + data + ')');
		    	// 测试模式接收微信语音
		    	if (data.sub_type === 'send_test_voice'){
					$store.dispatch("CHANGE_MEDIA_ID", media_id);
		    	}
		    	console.log(data)
		    	for(let state in Vue.prototype.constant.StateType){
		    		if((Vue.prototype.constant.StateType[state] & data.state) != 0){
		    			console.log('state---' + data.state)
		    			switch(state){
		    				case `STATE_LED`:
		    					$store.dispatch(`CHANGE_${state}`,data.led);
		    					break;
		    					// 不需要展示的东西 暂时不做处理
		    				/*case StateType.STATE_SPEECH_SET:
		    					$store.dispatch(`CHANGE_${state}`,data.led);
		    					break;*/
		    				case `STATE_VERSION`:
		    					$store.dispatch(`CHANGE_${state}`,data.version);
		    					break;
		    				case `STATE_OTA`:
		    					$store.dispatch(`CHANGE_${state}`,data.ota_update);
		    					break;
		    				case `STATE_BAT`:
		    					$store.dispatch(`CHANGE_${state}`,data.battery);
		    					break;
		    				case `STATE_CHILDLOCK`:
		    					$store.dispatch(`CHANGE_${state}`,data.childlock);
		    					break;
		    				case `STATE_WECHAT`:
		    					$store.dispatch(`CHANGE_${state}`,data.wechat_mode);
		    					break;
		    				case `STATE_POWER`:
		    					$store.dispatch(`CHANGE_${state}`,data.charger);
		    					break;
		    				case `STATE_SLEEP`:
		    					$store.dispatch(`CHANGE_${state}`,data.sleep_time);
		    					break;
		    				// 音乐面板   控制主要在歌曲信息
		    				case `STATE_PLAYER`:
		    					Vue.prototype.controlPlayerPanel(data.player)
		    					break;
		    				case `STATE_REST_SLEEP`:
		    					$store.dispatch(`CHANGE_${state}`,data.sleep_rest_time);
		    					break;
		    				case `STATE_CONNECT`:
		    					console.log(data)
		    					$store.dispatch(`CHANGE_ONLINE`,data.connect);
		    					break;
		    				case `STATE_SONGS`:
		    				console.log(state)
		    					$store.dispatch(`CHANGE_${state}`,data.songs_num);
		    					break;
		    				case `STATE_STORAGE`:
		    					console.log('state_storagte')
		    					$store.dispatch(`CHANGE_${state}`,data);
		    					break;
		    				case `STATE_VOL`:
		    					console.log(data.volume)
		    					$store.dispatch(`CHANGE_${state}`,data.volume);
		    					break;
		    			}
		    		}
		    	}
		    },
		    sendMessage: function(message) {
		        if(message !== 'heartbeat'){
		        	message.kq_id = Vue.prototype.KQ_ID;
		        }
		        console.log(message);
		        message = JSON.stringify(message);
		        if (Vue.prototype.ws !== null && Vue.prototype.ws.readyState == 1) {
		            Vue.prototype.ws.send(message);
		            this.heartbeat.reset();
		        }
		    },
		    close:function(){
		    	if(Vue.prototype.ws){
		    		Vue.prototype.ws.close()
		    	}
		    },
		    heartbeat: {
		        timeout: 20000,
		        timeoutObj: null,
		        init: function() {
		            this.timeoutObj = setTimeout(function() {
		                CocheerWebSocket.sendMessage('heartbeat');
		            }, this.timeout);
		        },
		        reset: function() {
		            clearTimeout(this.timeoutObj);
		            this.init();
		        },
		        stop: function() {
		            clearTimeout(this.timeoutObj);
		        }
		    }
		};
		Vue.prototype.websocket = CocheerWebSocket;
    }
}