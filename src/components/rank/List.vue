<template>
    <div class="base_list">
        <ul>
            <template v-if="tab===0">
                <li class="resli" @click="getDetail">
                    <span class="rank_body_like"><span>{{user.like_count}}</span><a class="list_like" :class="{yes: user.is_liked}" @click.stop="like(user.device_id, user.is_liked)"></a></span>
                    <a class="list_play lbtn nbtn">{{user.dialog_rank}}</a>
                    <a class="check"></a>
                    <div class="tt">
                        <span><img :src="user.pic_url"></span>
                        <span class="rank_body_name">{{user.name}}</span>
                        <span class="rank_body_num">{{user.dialog_count}}</span>
                    </div>
                </li>
                <li class="resli" @click="getDetail" v-for="(item,index) in list">
                    <span class="rank_body_like"><span>{{item.like_count}}</span><a class="list_like" :class="{yes: item.is_liked}" @click.stop="like(item.device_id, item.is_liked, index)"></a></span>
                    <a class="list_play lbtn nbtn">{{index + 1}}</a>
                    <a class="check"></a>
                    <div class="tt">
                        <span><img :src="item.pic_url"></span>
                        <span class="rank_body_name">{{item.name}}</span>
                        <span class="rank_body_num" :class="{first: index === 0}">{{item.dialog_count}}</span>
                    </div>
                </li>
            </template>
            <template v-else>
                <li class="resli" v-for="(item,index) in list">
                    <span class="rank_body_like" @click="push(item)"><img src="../../../../images/push_new.png"></span>
                    <a class="list_play lbtn nbtn">{{index + 1}}</a>
                    <div class="tt">
                        <span><img :src="item.audio_pic_url"></span>
                        <span class="rank_body_name corr">{{item.audio_name}}</span>
                    </div>
                </li>
            </template>
        </ul>
    </div>
</template>
<script>
import '@/assets/css/base_list'
export default {
    name: 'InteractionList',
    props: {
        tab: Number,
        list: Array,
        user: Object,
    },
    data() {
        return {
            openid: this.$route.query.openid,
            like_url: `${this.PUBLIC_HOST}api/web/device/like/update`,
        }
    },
    mounted() {
        // console.log(this.user);
    },
    methods: {
        getDetail(){

        },
        push(item){
            // console.log(this.$store.state.device_online_state);
            if(this.$store.state.device_online_state){
                // 推送歌曲给设备
                this.axios({
                    method: 'post',
                    url: `${this.HOST}/api/v1/qly/msg`,
                    data: {
                        openid: this.openid,
                        content: {
                            "action": "device_play",
                            "play_ctrl": "play",
                            "category": 7,
                            "source": item.source,
                            "song_id": item.audio_id,
                            "song_name": item.audio_name,
                            "song_url": item.audio_url,
                            "kq_id": this.KQ_ID
                        }
                    }
                }).then(res => {
                    if(res.status === 200){
                        this.$toast('已推送给设备');
                    }
                });
            }else{
                this.$toast('设备不在线');
            }
        },
        like(device_id, is_liked, index) {
            let operate = is_liked ? -1 : 1;
            this.axios({
                method: 'post',
                url: `${this.like_url}`,
                data: {
                    openid: this.openid,
                    device_id: device_id,
                    kq_id: this.KQ_ID,
                    operate: operate,
                }
            }).then( res => {
                this.$toast(res.data.message);
                if(res.data.status === 0){
                    if(index){
                        this.list[index].is_liked = !this.list[index].is_liked;
                        this.list[index].like_count = this.list[index].like_count + operate;
                    }else{
                        this.list.forEach((item, i) => {
                            if(device_id === item.device_id){
                                this.list[i].is_liked = !this.list[i].is_liked;
                                this.list[i].like_count = this.list[i].like_count + operate;
                            }
                        })
                    }
                    if(this.user.device_id === device_id){
                        this.user.like_count = this.user.like_count + operate;
                        this.user.is_liked = !this.user.is_liked;
                    }
                }
            }).catch( error => {
                console.log(error);
            });
        },
    },
}
</script>
<style type="text/css" scoped>
.base_list li {
    height: 6rem;
    padding-right: 0;
}
.nbtn{
    font-size: 2rem;
    padding-left: 0;
    margin-right: 1rem;
    margin-top: .25rem;
    color: #5f625f;
    text-align: center;
    font-weight: 500;
    overflow: visible;
    white-space:nowrap;
}
.nbtn:before{
    display: none;
}
.base_list .tt{
    padding: 0;
    height: 6rem;
}
.tt span{
    float: none;
    display: inline-block;
    line-height: 6rem;
}
.tt span img{
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    margin-top: -.5rem;
}
.rank_body_name{
    display: inline-block;
    font-size: 1.5rem;
    color: #000;
    margin-left: .3rem;
    max-width: 9rem;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden; 
}
.rank_body_name.corr{
    max-width: 18rem;
}
@media screen and (max-width: 320px) {
    .rank_body_name {
        max-width: 5rem;
    }
    .rank_body_name.corr{
        max-width: 14rem;
    }
    .tt span.rank_body_num{
        max-width: 9rem;
    }
}
.tt span.rank_body_num.first{
    color: #fbb123;
}
.tt span.rank_body_num{
    float: right;
    display: inline-block;
    font-size: 2.5rem;
    color: #38ba2a;
}
.rank_body_like{
    width: 5rem;
    text-align: center;
    line-height: 1;
    padding-top: 1rem;
}
.rank_body_like span{
    line-height: 1;
    float: none;
}
.rank_body_like img{
    margin-top: .8rem;
    width: 2.2rem;
    height: 2.2rem;
}
.list_like{
    position: relative;
    top: .4rem;
    margin-top: -1.5rem;
    text-align: center;
    background-image: url(../../assets/img/rank_like_g.png);
}
.list_like.yes{
    background-image: url(../../assets/img/rank_like_r.png);
}
.base_list li:after {
    width: 100vw;
    margin-top: -3px;
    margin-left: -1rem;
}
</style>