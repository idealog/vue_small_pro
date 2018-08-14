<template>
    <div id="alisten">
        <div class="module_hat">
            <a href="javascript:void(0)" @click="goMore()" class="more">更多</a>
            <h1 style="padding-left:1rem">
                大家都在听
            </h1>
        </div>
        <CubeAlbumList :album_list="list" :name="name" :icon="icon" @active_item="goSonglist"></CubeAlbumList>
    </div>
</template>
<script>
    import CubeAlbumList from '@/components/common/CubeAlbumList'
    export default {
        components:{
            CubeAlbumList
        },
        name : 'alllisten',
        data() {
            return {
                list: [],
                name:'album_title',
                icon:'icon'
            }
        },
        mounted(){
            this.getAllListen();
        },
        methods:{
            convert:function(icon){
                return icon.replace('http://','https://')
            },
            getAllListen:function(){
                let host = this.HOST;
                let This = this;
                let param = {
                    page:1,
                    limit:6
                }
                this.axios({
                  method:'get',
                  url:host + '/api/v1/qly/hot',
                  params:param,
                  responseType:'json'
                }).then(function(response) {
                    This.list = response.data.data.data;
                });
            },
            goMore:function(){
                this.$router.push({path:'/alllistenmore',query:{"tag":"alllisten"}});
            },
            goSonglist:function(item){
                this.$router.push({path:'/songlist',query:{'resource_type':'1','album_id':item.album_id,'source':item.source,'category':item.category}});
            },
            goSonglist:function(item){
                this.$router.push({path:'/songlist',query:{'resource_type':'1','album_id':item.album_id,'source':item.source,'category':item.category}});
            }
        }
    }
    
</script>