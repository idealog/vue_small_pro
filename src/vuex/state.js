//所有的状态数据  提供给vue实例使用
export default {
    player:{
        audio_name:'大闹天宫',
        album_name:'西游记',
        category_name:'创造力启蒙',
        audio_duration:200,
        progress: 0,
        audio_author:'',

    },
    show_small_player:false,
    play_status: false,

    collected_list: [],

    head_img:require('@/assets/img/member.png'),
    title:'示例'
}