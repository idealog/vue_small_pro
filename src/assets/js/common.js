import Vue from 'vue'
import $store from '@/vuex/store'
import constant from './global_val'
export default {
    install(Vue, options) {
    	if(process.env.NODE_ENV === 'development'){
    		Vue.prototype.HOST = '/data_api' ;
            Vue.prototype.WEBSOCKET_HOST = 'ws://xxx:port'
    	}else{
    		Vue.prototype.HOST = '/xxxx';
            Vue.prototype.WEBSOCKET_HOST = 'wss://www.cocheer.net/ws'
    	};
        Vue.prototype.constant = constant // 业务全局常量 设备状态
        Vue.prototype.customer = "xxx";
    	Vue.prototype.PUBLIC_HOST = 'https://xxxx';
        Vue.prototype.ws = null;


    }
}
