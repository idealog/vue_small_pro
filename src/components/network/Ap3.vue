<template>
	<div>
		<div class="login" @click="hideWifiList">
	        <div class="img-wraper">
	            <img :src="wifi_img">
	        </div>
	        <form>
	            <div>
	                <label for="ssid">WIFI账号：<span class="text-name"></span></label>
	                <input type="text" id="ssid" placeholder="选择常用的WiFi账号" @keyup="showWifiList" @click.stop="showWifiList" v-model="ssid" /><span class="drop-down-icon" @click.stop="showWifiList"></span>
	            </div>
	            <div :class="{asso: true, hide: list_is_hide}">
	                <div class="wifi-hold"></div>
	                <div class="wifi-list">
	                    <ul>
	                    	<li v-for="item in wifi_list" @click="selectWifi(item)">{{item}}</li>
	                    </ul>
	                </div>
	            </div>
	            <div>
	                <label for="password">WIFI密码：<span class="text-name"></span></label>
	                <input type="text" id="password" placeholder="输入对应的WiFi密码" v-model="password"/>
	            </div>
	            <p class="placeholder"></p>
	            <div>
	                <a class="btn_parallel wx_btn" :class="{disabled: is_sending_wifi}" id="connect" @click="sb">连接网络</a>
	                <a class="btn_parallel wx_btn" @click="reset()">重新填写</a>
	            </div>
	        </form>
	        <div style="color: #999">注意：如果没有密码请留空，隐藏<br/>的wifi帐号请手动输入</div>
		</div>

	    <!-- pop -->
	    <component :is="pop_component" v-on:cancel="finish" :title="pop_title" :content="pop_content">
	    </component>

	    <!-- loading -->
		<Loading :show="loading"></Loading>
	</div>
</template>

<script>
import "@/assets/css/network"
import Loading from "@/components/loading/Loading"
import Pop from "../pop/Pop"

export default {
	name: 'Ap3',
	components: {
		Loading,
        Pop,
	},
	data () {
		return {
			//wifi_img: this.$store.state.catch_img.wifi ? this.$store.state.catch_img.wifi.src : require("../../../../images/wifi.png"),
			wifi_img: require("../../../../images/wifi.png"),
			wifi_list: [],	//wifi列表
			list_is_hide: true,		//wifi列表显示状态
			ssid: '',	//wifi账号
			password: '',	//wifi密码
			is_sending_wifi: false,		//wifi发送状态
			loading: false,		//加载状态
			next_url: 'ap4',	//下一页
			pop_component: null,	//pop组件名
			pop_title: '温馨提示',	//pop组件标题
			pop_content: "<div style='text-align: center;padding:0 20px'>" + "注册失败！请保持手机与外网的连接并重试" + "</div>",	//pop组件文本
		}
	},
	created() {
        this.checkIsChoosedProduct(this);
    },
	mounted() {
        this.getWifiList();
        this.getCatchWifiInfo();
    },
	methods: {
		getWifiList() {
			this.axios.get('http://192.168.8.1/cgi-bin/wifi.cgi?action=get_wifi_list')  
                .then((response) => {
                    this.wifi_list = response.data.msg.ssids;
		            let tempL = [];
		            let tempJ = {};
                    this.wifi_list.forEach(function(item) {
		                //第一个判断去重，第二个判断去空，第三个判断去___，第四个判断匹配输入
		                if (!tempJ[item] && item !== '' /*&& item.search(/___/g) === -1 && item.indexOf(cVal) !== -1*/) {
		                    tempL.push(item);
		                    tempJ[item] = 1;
		                }
		            });
		            this.wifi_list = tempL;
                })
                .catch(error => {
                	console.log(error);
                	console.log("获取wifi列表失败！");
                });
		},
		showWifiList() {
			if(this.wifi_list.length){
				this.list_is_hide = false;
			}else{
				this.getWifiList();
			}
		},
		hideWifiList() {
			this.list_is_hide = true;
		},
		selectWifi(item) {
			this.ssid = item;
		},
		sb() {
			//只允许点击一次
			if(this.is_sending_wifi === true) return;
			this.is_sending_wifi = true;
			//5G网络不支持提示
		    if (this.ssid.substr(this.ssid.length - 2, 2).toUpperCase() === '5G') {
		        this.$toast('设备不支持5G网络');
		        this.is_sending_wifi = false;
		        return;
		    };
		    //账户名为空提示
		    if(!this.ssid){
		    	this.$toast('WIFI账号不能为空');
		        this.is_sending_wifi = false;
		        return;
		    }

			this.loading = true;
			// this.axios.get(`http://localhost:8080/#/network/ap3?mac=AABBCCDDEEFF`)
		    this.axios.get(`http://192.168.8.1/cgi-bin/wifi.cgi?ssid=${this.ssid}&password=${this.password}`)  
                .then((response) => {
                	this.is_sending_wifi = false;
                	this.toDeviceBindPage();
                })
                .catch((error) => {
                	this.loading = false;
                	this.is_sending_wifi = false;
                    this.$toast('请确认是否与设备热点保持连接！');
                });
		},
		reset() {
			this.ssid = '';
			this.password = '';
		},
		toDeviceBindPage(){
			window.localStorage.setItem("ssid", this.ssid);
			window.localStorage.setItem("sspw", this.password);
			let checkedCount = 0;
			checkOutLine(this);
			function checkOutLine(vm){				
				if (checkedCount < 60) {
					vm.axios({
	                        url: `${vm.HOST}/images/player_mode1.png?t=${new Date().getTime()}`,
	                        timeout: 1000
	                    })
	                    .then((response) => {
	                        vm.$router.push({ path: vm.next_url, query: { mac: vm.$route.query.mac, openid: vm.$route.query.openid }});
	                    })
	                    .catch((error) => {
	                        checkedCount++;
	                        window.setTimeout(function() {
	                            checkOutLine(vm);
	                        }, 1000);
	                    });
	            } else {
	            	vm.loading = false;
	                vm.pop_component = Pop;
	            }
			}
		},
		finish() {
            this.pop_component = null;
        },
        getCatchWifiInfo() {
        	let ssid = window.localStorage.getItem("ssid"),
        		password = window.localStorage.getItem("sspw");
        	this.ssid = ssid ? ssid : '';
        	this.password = password ? password : '';
        },
	}
}
</script>