<template>
<div class="main">
    <div class="rank_top">
        <ul>
            <li v-for="(tab, tab_index) in tabs" @click="choosed_tab = tab_index">
                <span :class="{underline: tab_index === choosed_tab}">{{tab.name}}</span>
            </li>
        </ul>
    </div>
    <p style="height:.7rem;background:#d4d4d4"></p>
    <component :is="list_component" :tab="choosed_tab" :user="user" :list="list">
    </component>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <p style="text-align: center;color:#ededed">{{load}}</p>
    </div>
</div>
</template>
<script>
import '@/assets/css/base_list'
import List from './List'

export default {
    name: 'Rank',
    components: {
        List,
    },
    data() {
        return {
            openid: this.$route.query.openid,
            user_info_url: '/api/v1/relation/deviceBasicInfo',
            user_rank_info_url: `${this.PUBLIC_HOST}api/web/device/dialog/rank/user`,
            dialog_rank_list_url: `${this.PUBLIC_HOST}api/web/device/dialog/rank/list`,
            click_rank_list_url: `${this.PUBLIC_HOST}api/web/click/rank/list`,
            list_url: `${this.PUBLIC_HOST}api/web/device/dialog/rank/list`,
            tabs: [{name: '互动'},{name: '故事'},{name: '儿歌'},{name: '国学'},{name: '英语'}],
            choosed_tab: 0,
            list_component: List,
            user: {
                device_id: '',
                pic_url: this.P_IMG,
                name: '',
                dialog_count: 0,
                dialog_rank: '9999+',
                like_count: 0,
            },
            list: [],
            page: 1,
            busy: false,
            load: '数据加载中...'
        }
    },
    watch: {
        choosed_tab: function(v){
            if(v === 0){
                this.list_url = this.dialog_rank_list_url;
            }else{
                this.list_url = this.click_rank_list_url;
            }
            // 初始化列表
            this.page = 1;
            this.list = [];
            this.busy = false;
            this.load = '数据加载中...';
            this.getRankList();
        }
    },
    created() {
        this.checkDeviceOnline(this.openid);
    },
    mounted() {
        document.title = '排行榜';
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
                        if(~res.data.data.like_person.indexOf(this.openid)){
                            this.user['is_liked'] = true;
                        }else{
                            this.user['is_liked'] = false;
                        }
                    }
                })
            })
        },
        getRankList(url){
            this.axios.get(`${this.list_url}?kq_id=${this.KQ_ID}&openid=${this.openid}&page=${this.page}&category=${this.choosed_tab}`).then(res => {
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
.main{
    font-size: 1.5rem;
}
.rank_top ul{
    width: 80%;
    margin: 1rem auto 1.5rem;
}
.rank_top ul li{
    display: inline-block;
    width: 20%;
    text-align: center;
}
.rank_top ul li span{
    padding-bottom: .3rem;
}
.rank_top ul li span.underline{
    border-bottom: #fbb123 1px solid;
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