import TYPE from './mutation-types'

//适用于 异步请求接口 动态修改vuex 中管理状态
//参数  结构传递参数
//
export default {
	[TYPE.CHANGE_PRODUCT]({ commit }, product) {
        commit(TYPE.CHANGE_PRODUCT, product);
    },
    [TYPE.CHANGE_ONLINE]({ commit }, online) {
        commit(TYPE.CHANGE_ONLINE, online);
    },
     [TYPE.CHANGE_OPENID]({ commit }, openid) {
        commit(TYPE.CHANGE_OPENID, openid);
    },
    [TYPE.CHANGE_MEDIA_ID]({ commit }, media_id) {
        commit(TYPE.CHANGE_MEDIA_ID, media_id);
    },
    [TYPE.CHANGE_BASIC_INFO]({ commit }, basic_info) {
        commit(TYPE.CHANGE_BASIC_INFO, basic_info);
    },
    [TYPE.CHANGE_STATE_LED]({ commit }, led){
    	commit(TYPE.CHANGE_STATE_LED, led);
    },

    [TYPE.CHANGE_STATE_BAT]({ commit }, battery){
        commit(TYPE.CHANGE_STATE_BAT, battery);
    },

    [TYPE.CHANGE_DEVICE_STATE]({ commit },status){
        commit(TYPE.CHANGE_DEVICE_STATE, status);
    },

    [TYPE.CHANGE_LISTEN_ITEM]({commit}, listen_item){
        commit(TYPE.CHANGE_LISTEN_ITEM, listen_item)
    },

    [TYPE.CHANGE_LISTENING_ITEM]({commit}, listening_item){
        commit(TYPE.CHANGE_LISTENING_ITEM,listening_item)
    },

    [TYPE.CHANGE_PLAY_URL]({commit},play_url){
        commit(TYPE.CHANGE_PLAY_URL,play_url)
    },

    [TYPE.CHANGE_SHOW_PROPELLING]({commit}, listening_item){
        commit(TYPE.CHANGE_SHOW_PROPELLING,listening_item)
    },

    [TYPE.CHANGE_STATE_PLAYER]({commit}, item){
        commit(TYPE.CHANGE_STATE_PLAYER,item)
    },

    [TYPE.CHNAGE_PLAY_LIST]({commit}, list){
        commit(TYPE.CHNAGE_PLAY_LIST,list)
    },

    [TYPE.CHANGE_PLAY_MODE]({commit}, mode){
        commit(TYPE.CHANGE_PLAY_MODE, mode)
    },

    [TYPE.CHANGE_STATE_POWER]({commit},charger){
        commit(TYPE.CHANGE_STATE_POWER, charger)
    },

    [TYPE.CHANGE_STATE_CHILDLOCK]({commit},childlock){
        commit(TYPE.CHANGE_STATE_CHILDLOCK,childlock)
    },

    [TYPE.CHANGE_STATE_WECHAT]({commit},wechat_mode){
        commit(TYPE.CHANGE_STATE_WECHAT,wechat_mode)
    },

    [TYPE.CHANGE_STATE_VERSION]({commit},version){
        commit(TYPE.CHANGE_STATE_VERSION,version)
    },

    [TYPE.CHANGE_STATE_OTA]({commit},ota){
        commit(TYPE.CHANGE_STATE_OTA,ota)
    },

    [TYPE.CHANGE_STATE_REST_SLEEP]({commit},rest_sleep){
        commit(TYPE.CHANGE_STATE_REST_SLEEP,rest_sleep)
    },

    [TYPE.CHANGE_STATE_PLAYER_PROGRESS]({commit}, progress){

        commit(TYPE.CHANGE_STATE_PLAYER_PROGRESS,progress)
    },

    [TYPE.CHANGE_STATE_SONGS]({commit},song_num){
        commit(TYPE.CHANGE_STATE_SONGS,song_num)
    },

    [TYPE.CHANGE_STATE_STORAGE]({commit},data){
        commit(TYPE.CHANGE_STATE_STORAGE,data)
    },

    [TYPE.CHANGE_STATE_VOL]({commit},volume){
        commit(TYPE.CHANGE_STATE_VOL,volume)
    },

    [TYPE.CHANGE_STATE_SLEEP]({commit},sleep_time){
        commit(TYPE.CHANGE_STATE_SLEEP,sleep_time)
    }
}