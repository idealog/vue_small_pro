export default {
	['CHANGE_OPENID'](state, openid) {
        state.openid = openid;
    },
    ['CATCH_IMG'](state, img) {
        state.catch_img[img.name] = img.value;
    },
    ['CHANGE_PRODUCT'](state, product) {
        state.product = product;
    },
    ['CHANGE_ONLINE'](state, online) {
        state.device_online_state = online;
    },
    ['CHANGE_MEDIA_ID'](state, media_id) {
        state.media_id = media_id;
    },
    ['CHANGE_BASIC_INFO'](state, basic_info) {
        state.device_id = basic_info.device_id;
        state.mac = basic_info.mac;
    },

    //改变控制面板上面的一些状态
    ['CHANGE_STATE_LED'](state, led){
    	state.led = led;
    },

    ['CHANGE_STATE_BAT'](state, battery){
    	state.battery = battery;
    },

    ['CHANGE_DEVICE_STATE'](state, status){
        state.device_state['status'] = status;
    },

    ['CHANGE_LISTEN_ITEM'](state,item){
        state.listen_item = item
    },

    ['CHANGE_LISTENING_ITEM'](state,item){
        state.listening_item = item
    },

     ['CHANGE_PLAY_URL'](state,item){
        state.play_url = item
    },

    ['CHANGE_SHOW_PROPELLING'](state,show_propelling){
        state.show_propelling = show_propelling
    },

    ['CHANGE_STATE_PLAYER'](state,player){
        state.show_propelling = show_propelling
    },

    ['CHANGE_STATE_PLAYER'](state, state_player){
        state.state_player = state_player;
    },


    ['CHNAGE_PLAY_LIST'](state,play_list){
        state.play_list = play_list
    },

    ['CHANGE_PLAY_MODE'](state,play_mode){
        state.play_mode = play_mode
    },


    ['CHANGE_STATE_POWER'](state, charger){
        state.charger = charger
    },

    ['CHANGE_STATE_CHILDLOCK'](state,childlock){
        state.childlock = childlock
    },

    ['CHANGE_STATE_WECHAT'](state,wechat_mode){
        state.wechat_mode = wechat_mode
    },

    ['CHANGE_STATE_VERSION'](state,version){
        state.version = version
    },

    ['CHANGE_STATE_OTA'](state, ota){
        state.ota = ota
    },

    ['CHANGE_STATE_SLEEP'](state,sleep_time){
        state.sleep_time = sleep_time
    },

    ['CHANGE_STATE_REST_SLEEP'](state, rest_sleep){
        state.sleep_reset_time = rest_sleep
    },

    ['CHANGE_STATE_PLAYER_PROGRESS'](state, progress){
        state.player_progress = progress
    },

    ['CHANGE_STATE_SONGS'](state,song_num){
        state.song_num = song_num
    },

    ['CHANGE_STATE_STORAGE'](state,data){
        state.sdcard_free_size = data.sdcard_free_size
        state.sdcard_total_size = data.sdcard_total_size
    },

    ['CHANGE_STATE_VOL'](state,volume){
        state.volume = volume
    }
}