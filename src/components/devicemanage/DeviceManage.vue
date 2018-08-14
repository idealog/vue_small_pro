<template>
	<div >
		<div class="banner_top">
			<p class="banner_text">{{text}}
			<span style="color: #7878fb;border-bottom: 1px #7878fb solid" >{{product_name}}</span></p>
			<!--<span class="button" @click="toProductPage">{{button_name}}</span>  -->
		</div>
		<article class="weui_article">
		<template v-if="list.length">
			<div class="weui_cells_title" style="margin-bottom: .7rem;padding-left:2rem">绑定设备列表:</div>
		</template>
		<template v-else>
			<div class="weui_cells_tips">您还没有绑定任何设备,您可以扫描设备二维码进行绑定。</div>
		</template>
		<template>
			<div class="weui_cells weui_cells_checkbox" v-for="item in list">
				<label class="weui_cell weui_check_label base_list">
					<div class="weui_cell_hd">
						<input type="radio" class="weui_check" name="deviceActiveRadio" checked="checked"  @change="activeDevice(item.device_id)" v-if="item.active_status">
						<input type="radio" class="weui_check" name="deviceActiveRadio" @change="activeDevice(item.device_id)" v-else>
						<span class="weui_icon_checked"></span>
					</div>
					<div class="cover" style="margin: 0 1.5rem 0 .3rem;">
						<img :src="item.pic_url" style="width:4rem">
					</div>
					<div class="weui_cell_bd weui_cell_primary tt">
						<p style="margin:0">{{item.name}}</p>
						<p style="margin:0">{{item.mac}}</p>
					</div>
					<a href="javascript:;" class="weui_btn weui_btn_mini weui_btn_warn" @click.stop="confirmDelete(item.mac, item.device_id)">删除</a>
				</label>
			</div>
		</template>
	    </article>

	    <!-- pop -->
	    <component 
	    	:is="pop_component"
	    	:title="pop_title"
	    	:content="pop_content"
	    	ok_btn="确认"
	    	cancel_btn="取消"
	    	v-on:finish="unBind"
	    	v-on:cancel="pop_component=null">
	    </component>
	</div>
</template>

<script>
import wx from "weixin-js-sdk"
import '@/assets/css/weui.min.css'
import Pop from '@/components/pop/Pop'

export default {
	name: 'DeviceManage',
	components: {
		Pop
	},
	data () {
		//let product_name = this.LStorage.getItem('product_name');
		let product_name = `${this.customer}`;
		let text = product_name ? '您选择的产品是：' : '你还未选择产品，请点击';
		let button_name = product_name ? '更换产品' : '选择产品';
		return {
			openid: this.$route.query.openid,
			text: text,
			product_name: product_name,
			button_name: button_name,
			list: [],
			pop_component: null,
			pop_title: '',
			pop_content: '',
			unbind_device: '',
			data_url: '/api/v1/relation/getBindDeviceInfoList',
			active_url: '/api/v1/relation/activeDevice',
			sign_package_url: '/api/v1/wechat/jssdk',
		}
	},
	mounted() {
		this.getData();
	},
	methods: {
		toProductPage(){
			this.$router.push(`../product?openid=${this.openid}`);
		},
		getData(){
			this.axios.get(`${this.HOST}${this.data_url}?openid=${this.openid}`).then(res => {
				if(res.data.status === 0){
					this.list = res.data.data;
				}else{
					this.list = [];
					this.$toast(res.data.message);
				}
			});
		},
		activeDevice(device_id){
			this.axios({
                method: 'post',
                url: `${this.HOST}${this.active_url}`,
                data: {
                	openid: this.openid,
                	device_id: device_id
                }
            }).then(res => {
            	this.$toast(res.data.message);
            	if(res.data.status !== 0){
            		this.getData();
            	}
            });
		},
		confirmDelete(mac, device_id){
			this.unbind_device = device_id;
			this.pop_component = Pop;
			this.pop_title = '解绑设备';
			this.pop_content = `<div style="margin:1rem;text-align:center">您是否确定要解除跟此设备(${mac})的绑定关系?</div>`;
		},
		getTicket(){
			let url = window.location.href.split('#')[0];
			return this.axios({
                method: 'post',
                url: `${this.HOST}${this.sign_package_url}`,
                data: {
                	url: url
                }
            }).then(res => {
            	if(res.data.status === 0){
            		return Promise.resolve(res.data.data);
            	}else{
            		this.$toast('获取JSsignature失败！');
            	}
            }).catch(e => {
            	this.$toast('获取JSsignature失败！');
            });
		},
		configWXDevice(appId, timestamp, nonceStr, signature, deviceType, deviceId, ticketCallBack) {
		    wx.config({
		        beta: true, // 开启内测接口调用，注入wx.invoke方法
		        debug: false,
		        appId: appId,
		        timestamp: timestamp,
		        nonceStr: nonceStr,
		        signature: signature,
		        jsApiList: [
		            'openWXDeviceLib',
		            'getWXDeviceTicket'
		        ]
		    });

		    wx.ready(function() {
		        wx.invoke("openWXDeviceLib", {}, function(res) {

		        });
		        wx.invoke('getWXDeviceTicket', {
		            "deviceId": deviceId,
		            "type": 2
		        }, function (res) {
		            ticketCallBack(res);
		        });
		    });

		    wx.error(function (res) {
		        this.$toast("config失败, err_msg:" + res.err_msg);
		    });
		},
		unBind(){
			this.pop_component= null;
			this.getTicket().then(res => {
				let sign = res;
				this.configWXDevice(sign.appId, sign.timestamp, sign.nonceStr, 
		            sign.signature, sign.device_type, this.unbind_device, (res) => {
		            	let ticket = res.ticket;
		                this.axios.post(this.HOST + '/api/v1/wechat/device/unbind', {
		                    ticket: ticket,
		                    device_id: this.unbind_device,
		                    openid: this.$route.query.openid
		                }).then(res => {
		                	this.$toast(res.data.message);
		                    if(res.data.status === 0){
		                    	this.getData();
		                    }
		                });
		            });
			});
		}
	}
}
</script>
<style scoped>
.banner_top{
	color: #999;
	text-align: center;
}
.banner_text{
	margin-top: 3rem;
	margin-bottom: 1.5rem;
}
.button{
	font-size: 1.5rem;
	padding: .6rem .8rem;
	border:1.5px #999 solid;
	border-radius: .5rem;
}
</style>