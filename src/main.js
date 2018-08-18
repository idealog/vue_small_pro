import '@/assets/css/cocheer-style'
import '@/assets/css/customer.css'
import Vue from 'vue'
import App from './App'
import router from './router/'
import VueTouch from 'vue-touch'
import Router from 'vue-router'
import Axios from 'axios'
import VueAxios from 'vue-axios'
import VueLazyload from 'vue-lazyload'
import Toast from '@/assets/plugin/toast';
import '@/assets/plugin/toast/toast.css';
import VueCircleSlider from 'vue-circle-slider'	//进度条转圈插件
import infiniteScroll from 'vue-infinite-scroll'
import FastClick from 'fastclick'
import vueScroll from 'vuescroll'
import 'vuescroll/dist/vuescroll.css'
import store from './vuex/store'
import Common from './assets/js/common'
import Websocket from './assets/js/websocket'

Vue.config.productionTip = false
Vue.use(VueLazyload)
Vue.use(VueAxios, Axios)
Vue.use(VueCircleSlider)
Vue.use(Toast)
Vue.use(infiniteScroll)
Vue.use(vueScroll)
Vue.use(VueTouch, {name: 'v-touch'})
Vue.use(Common)
Vue.use(Websocket)

/* eslint-disable no-new */
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

if('onunload' in window){
  window.onunload = function(e){
    console.log('close')
    Vue.prototype.websocket.close()
  }
}

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
