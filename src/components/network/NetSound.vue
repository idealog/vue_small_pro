<template>
	<div>
		<div class="banner_container">
			<img :src="net_wifi" />
			<h3 class="net_tip">手机音量调至最大</h3>
			<h3 class="net_tip">手机靠近设备10cm以内</h3>
		</div>
		<div class="input_area">
			<input class="wifi_input" type="text" v-model="ssid" placeholder="请输入wifi名称" />
		</div>
		<div class="input_area">
			<input class="wifi_input" type="password" v-model="password" placeholder="请输入wifi密码" />
		</div>
		<div class="wx_btn ft connect" @click.stop="connect" v-if="status === 'init'">连接</div>
		<div class="wx_btn ft connect" v-if="status === 'building'">
				 <i class="icon-loading"></i>
			生成声波中
		</div>
		<div class="wx_btn ft su" @click.stop="finish" v-if="status === 'builded'">连接成功</div>
		<div class="wx_btn ft last" @click.stop="cancel" v-if="status === 'builded'">取消</div>
		 <audio ref="audio" :src="audio_url"></audio>
	</div>
</template>
<script>
	/*import PCMBuilder from 'PCMBuilder'
	import SampleRate from 'SampleRate'
	import FrequencyRangeTag from 'FrequencyRangeTag'*/
	//import {}
	export default {
		data(){
			return {
				net_wifi:  require('@/assets/img/net-wifi.png'),
				status: 'init',
				openid: this.$route.query.openid,
				audio_url: ''  //声波编码生成的一段音频url
			}
		},
		mounted(){
			const wifi = localStorage.getItem('wifi');
	        if (wifi) {
	            Object.assign(this, JSON.parse(wifi));
	        }
		},
		methods:{
			connect(){
				this.status = 'building'
				const _ = this
				//setTimeout(function(){
					// 判断是否有输入 防止报错
				if(!_.ssid){
					_.ssid = ''
				}
				if(!_.password){
					_.password = ''
				}
				if(!_.openid){
					_.openid = ''
				}
				const [ssid, password,openid] = [_.ssid, _.password,_.openid]
				localStorage.setItem('wifi',JSON.stringify({ssid,password}))

					//let originStr = _.computeEncodeStr(_.ssid, _.password, _.openid)
					/*let originStr = _.json2Array({ssid,password,openid})
	                let builder441 = new PCMBuilder({
	                    'sample_rate': SampleRate.RATE_44100_HZ,
	                    'freq_range': FrequencyRangeTag.MIDDLE
	                }) 
	                builder441.on('data', (array) => {
	                    _.audio_url = 'data:audio/mpeg;base64,' + Buffer.from(array).toString('base64')
	                    _.$refs.audio.autoplay = true
	                    _.$refs.audio.loop = true
	                    _.status = 'builded'
	                });
	                builder441.build(originStr)*/

	                //向后台发送一个接口  赋值给audio_url
				//},50)
			},
			finish(){
				this.$refs.audio.pause()
				this.$router.push({path:'/index',query:{openid:this.openid}})
			},
			cancel(){
				this.$refs.audio.pause()
				this.status = 'init'
				//this.audio_url = ''
				window.location.reload()
			},
			json2Array(obj){
				const str = JSON.stringify(obj)
				let data = new Int8Array(str.length)
				let sum = 0
				let j = 0
				for(let i of str){
					data[j++] = i.charCodeAt()
				}
				return data
			},
			computeEncodeStr(ssid, password, openid) {
			    let data = new Int8Array(1 + ssid.length + 1 + password.length + 1 + openid.length + 1);
			    let sum = 0;
			    let j = 0;

			    data[j] = ssid.length;
			    sum += data[j++];

			    for (let i of ssid) {
			        data[j] = i.charCodeAt();
			        sum += data[j++];
			    }

			    data[j] = password.length;
			    sum += data[j++];

			    for (let i of password) {
			        data[j] = i.charCodeAt();
			        sum += data[j++];
			    }

			    data[j] = openid.length;
			    for( let i of openid){
			    	data[j] = i.charCodeAt();
			    	sum += data[j++];
			    }

			    data[j] = sum & 255;

			    return data;
			}
		}
	}
</script>
<style scoped>
	.banner_container{
		text-align: center;
		padding: 3rem;
		background: rgba(222,222,222,.7);
	}
	.banner_container img{
		width:8rem;
		margin-bottom:1rem;
	}
	.net_tip{
		color:red;
	}

	.label{
		display: inline-block;
		width: 6rem;
		font-size: 1.5rem;
		padding-bottom:.25rem;
	}
	
	.wifi_input{
		outline: none;
		width: 100%;
		border: 0px;
		font-size: 1.5rem;
	}

	.input_area{
		padding: 1rem;
		border-bottom: 1px solid rgba(222,222,222,.7);;
	}

	.ft{
		font-size: 1.6rem;
		position: relative;
	}

	.icon-loading {
	    display: inline-block;
	    width: 1.5rem;
	    height: 1.5rem;
	    /* background: transparent url(/static/img/loading.0cfc308.gif) no-repeat; */
	    background: transparent url(../../assets/img/loading.gif) no-repeat; 
	    background-size: 1.5rem 1.5rem;
	    opacity: .6;
	    position: absolute;
	    top: 50%;
	    margin-right: 2rem;
	    left: 28%;
	    transform: translateY(-50%);
    }
    .connect{
    	margin-top:1rem;
    }

    .su{
    	margin-top: 1rem;
    }

    .last{
    	margin-top:-1rem;
    }
</style>