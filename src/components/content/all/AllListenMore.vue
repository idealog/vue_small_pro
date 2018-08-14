<template>
    <div>
        <CubeAlbumList :album_list="list" :name="name" :icon="icon" @loadMore="getAllListen" @active_item="goSonglist" v-infinite-scroll="getAllListen"></CubeAlbumList>
        <Loading :show="loading"></Loading>
        <PropellingController v-show="$store.state.show_propelling"></PropellingController>
    </div>
</template>
<script>
import Loading from '@/components/loading/Loading'
import PropellingController from '@/components/common/propellingController'
import CubeAlbumList from '@/components/common/CubeAlbumList'
    export default {
        components: {
            Loading,
            PropellingController,
            CubeAlbumList
        },
        data(){
            return {
                list: [],
                page: 1,
                loading: false,
                haveMore:true,
                name: 'album_title',
                icon: 'icon'
            }
        },
        mounted(){
            this.getAllListen();
        },
        activated(){
            
        },
        deactivated(){
            
        },
        methods:{
            getAllListen:function(){
                let host = this.HOST;
                let This = this;
                let param = {
                    page:this.page++,
                    limit:20
                }
                if(!This.haveMore){
                    return
                }
                This.loading = true
                this.axios({
                  method:'get',
                  url:host + '/api/v1/qly/hot',
                  params:param,
                  responseType:'json'
                }).then(function(response) {
                    if(response.data.data.data.length === 0){
                        This.haveMore = false
                    }
                    This.list = [...This.list,...response.data.data.data];
                    This.loading = false

                    console.log(This.loading)
                });
            },
            goSonglist:function(item){
                this.$router.push({path:'/songlist',query:{'resource_type':'1','album_id':item.album_id,'source':item.source,'category':item.category}});
            }
        }
    }

</script>
