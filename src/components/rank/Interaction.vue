<template>
<div class="main">
    <div class="cfy_bar rank_top">
        <div class="cfy_hbox rank_hbox">
            <div class="title_icon rank_title_icon" :class="{hide: !user.device_id}">
                <img :src="user.pic_url">
            </div>
            <p class="rank_tite_name" :class="{hide: !user.device_id}">{{user.name}}</p>
            <div class="title_num" :class="{hide: !user.device_id}">
                <div class="title_num_l">
                    <p class="title_num_l_t">{{user.dialog_count}}</p>
                    <p class="title_num_l_b">第 {{user.dialog_rank}} 名</p>
                </div>
                <div class="title_num_r">
                    <p class="title_num_r_t">{{user.like_count}}</p>
                   <!--  <img src="../../../../images/rank_like_w.png"> -->
                </div>
            </div>
            <div class="rank_top_sub">
                <span>排名</span>
                <span>消息总数</span>
            </div>
        </div>
    </div>
    <p style="height:.5rem;background:#ededec"></p>
    <div class="base_list">
        <ul>
            <li class="resli" @click="getDetail" v-for="(item,index) in list">
                <span class="rank_body_like"><span>{{item.like_count}}</span><a class="list_like" :class="{yes: item.is_liked}" @click.stop="like(item.device_id, item.is_liked, index)"></a></span>
                <a class="list_play lbtn nbtn">{{index + 1}}</a>
                <a class="check"></a>
                <div class="tt">
                    <span><img :src="item.pic_url"></span>
                    <span class="rank_body_name">{{item.name}}</span>
                    <span class="rank_body_num">{{item.dialog_count}}</span>
                </div>
            </li>
        </ul>
    </div>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <p style="text-align: center;color:#ededed">{{load}}</p>
    </div>
</div>
</template>
<script>
import '@/assets/css/base_list'

export default {
    name: 'Rank',
    data() {
        return {
            openid: this.$route.query.openid,
            user_info_url: '/api/v1/relation/deviceBasicInfo',
            user_rank_info_url: `${this.PUBLIC_HOST}api/web/device/dialog/rank/user`,
            rank_list_url: `${this.PUBLIC_HOST}api/web/device/dialog/rank/list`,
            like_url: `${this.PUBLIC_HOST}api/web/device/like/update`,
            user: {
                device_id: '',
                pic_url: '',
                name: '',
                dialog_count: 0,
                dialog_rank: '10000+',
                like_count: 0,
            },
            list: [],
            page: 1,
            busy: false,
            load: '数据加载中...'
        }
    },
    mounted() {
        document.title = '互动排行榜';
        this.getData();
    },
    methods: {
        getData(){
            this.getUserInfo();
            this.getRankList();
        },
        getUserInfo(){
            this.axios.get(`${this.HOST}${this.user_info_url}?openid=${this.openid}`).then(res => {
                if(res.data.status === 0){
                    for(let e in res.data.data){
                        this.user[e] = res.data.data[e];
                    }
                }
            }).then(res => {
                this.axios.get(`${this.user_rank_info_url}?device_id=${this.user.device_id}&kq_id=${this.KQ_ID}`).then(res => {
                    if(res.data.status === 0){
                        for(let e in res.data.data){
                            this.user[e] = res.data.data[e];
                        }
                    }
                })
            })
        },
        getRankList(){
            this.axios.get(`${this.rank_list_url}?kq_id=${this.KQ_ID}&openid=${this.openid}&page=${this.page}`).then(res => {
                let l = res.data.data.length;
                if(l === 0){
                    this.busy = true;
                    this.load = '没有更多数据了';
                    return;
                }
                this.list = [...this.list, ...res.data.data];
                this.page++;
            })
        },
        getDetail(){
            // this.$toast('测试详情');
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
                    this.list[index].is_liked = !this.list[index].is_liked;
                    this.list[index].like_count = this.list[index].like_count + operate;
                    if(this.user.device_id === device_id){
                        this.user.like_count = this.user.like_count + operate;
                    }
                }
            }).catch( error => {
                console.log(error);
            });

        },
        loadMore() {
            if(this.load !== '没有更多数据了'){
                this.busy = true; 
                setTimeout(() => { 
                    this.getRankList();
                    this.busy = false; 
                }, 300); 
            }
        }
    }
}
</script>
<style type="text/css" scoped>
.rank_top{
    background: #efde4f;
    height: auto;
}
.rank_hbox{
    padding-top: 1rem;
}
.rank_hbox p{
    font-weight: 500;
    margin-top: 0;
    line-height: 1.4;
}
.rank_title_icon{
    width: 9rem;
    height: 9rem;
}
.rank_tite_name{
    display:inline-block;
    min-width: 10.8rem;
    font-size: 2.7rem;
    border-bottom: 1px solid #fff;
}
.rank_tite_name.hide{
    display: none;
}
.title_icon img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
.title_num > div{
    display: inline-block;
}
.title_num_l{
    margin-right: 1rem;
}
.title_num_l_t{
    font-size: 2.5rem;
}
.title_num .title_num_l_b{
    font-size: 1.2rem;
    padding-left: .3rem;
    font-weight: 300;
    text-align: left;
    line-height: .6;
}
.title_num_r .title_num_r_t{
    font-size: 1.4rem;
    line-height: .6;
    position: relative;
    top: -.9rem;
}
.title_num_r img{
    width: 70%;
    position: relative;
    top: -.3rem;
}
.rank_top_sub{
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-size: 1.6rem;
}
.rank_top_sub span{
    margin: .4rem 1.5rem;
}
.base_list li {
    height: 6rem;
    padding-right: 0;
}
.nbtn{
    font-size: 2.5rem;
    padding-left: 0;
    margin-right: 1rem;
    margin-top: 0;
    color: #535353;
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
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    margin-top: -.5rem;
}
.rank_body_name{
    display: inline-block;
    font-size: 1.8rem;
    margin-left: 1rem;
    max-width: 9rem;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden; 
}
@media screen and (max-width: 320px) {
    .rank_body_name {
        max-width: 5rem;
    }
    .tt span.rank_body_num{
        max-width: 9rem;
    }
}
.tt span.rank_body_num{
    float: right;
    display: inline-block;
    font-size: 3rem;
    color: #efde4f;
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
.list_like{
    position: relative;
    top: .4rem;
    margin-top: -1.5rem;
    text-align: center;
    /* background-image: url(../../../../images/rank_like_g.png); */
}
.list_like.yes{
    /* background-image: url(../../../../images/rank_like_r.png); */
}
.base_list li:after {
    width: 100vw;
    margin-top: -3px;
    margin-left: -1rem;
}
</style>