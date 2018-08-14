import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
//状态管理
import actions from './action'
import state from './state'
import mutations from './mutation'
const store = new Vuex.Store({
    state,
    mutations,
    actions,
});

/* eslint-disable no-new */
export default store;
