import Vue from 'vue'
import $store from '@/vuex/store'
export default {
    install(Vue, options) {
    	Vue.prototype.websocket_host = Vue.prototype.WEBSOCKET_HOST;
    	let CocheerWebSocket = {
		    init: function(openid) {
		    	
		    },
		    onMessage: function(event) {

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