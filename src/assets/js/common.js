import Vue from 'vue'
import $store from '@/vuex/store'
import constant from './global_val'
export default {
    install(Vue, options) {
    	if(process.env.NODE_ENV === 'development'){
    		Vue.prototype.HOST = '/xxx' ;
            Vue.prototype.WEBSOCKET_HOST = 'ws://xxx'
    	}else{
    		Vue.prototype.HOST = '/xxx';
            Vue.prototype.WEBSOCKET_HOST = 'xxx'
    	};
       // Vue.prototype.search_url = 'http://www.cocheer.net/mongodb/api/third/search/all'
        Vue.prototype.constant = constant // 业务全局常量 设备状态
    	Vue.prototype.PUBLIC_HOST = 'https://www.cocheer.net/mongodb/';
    	Vue.prototype.KQ_ID = 18;
    	Vue.prototype.P_IMG = 'https://www.cocheer.net/resource/public/img/0.jpg';
        Vue.prototype.LStorage = window.localStorage;
        if(!Vue.prototype.LStorage.getItem('push_record_list')){
            Vue.prototype.LStorage.setItem('push_record_list',JSON.stringify([])); //记录推送记录
        }
    }
}
