<template>
	<div>
		<Search @search="getSearchValue"></Search>
		<div class="search_tab">
	        <ul>
	            <li v-for="item in search_category" @click.stop="getList(item.id)"><span :class="{selected:selected === item.source}">{{item.value}}</span></li>
	        </ul>
	    </div>
		<ul>
        	<div class="base_list" v-infinite-scroll="getList" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
				<div><SongItem v-for="item in list" :key="item.id" :song-item="item" ></SongItem></div>
				<Loading :show="loading"></Loading>
			</div>
			<PropellingController v-show="$store.state.show_propelling"></PropellingController>
       </ul>
       <div v-if = "no_data" v-cloak style="margin-bottom:2rem">
       		<h4 style="text-align:center;margin-top:2rem">没有数据了</h4>
       </div>
     </div>
</template>
<script type="text/javascript">
import '@/assets/css/base_list'
import '@/assets/css/network'
import Search from '@/components/search/Search'
import SongItem from  '@/components/common/SongItem'
import Loading from '@/components/loading/Loading'
import PropellingController from '@/components/common/propellingController'
export default {
	name:'SearchResult',
	components:{
		Search,
		SongItem,
		Loading,
		PropellingController
	},
	data(){
		return {
			list:[],
			page:1,
			kw:'',
			loading:false,
			haveMore:true,
			selected:'',
			search_category:[
				{
					id:'1',
					value:'喜马拉雅'
				},{
					id:'4',
					value:'流行音乐'
				},{
					id:'5',
					value:'贝瓦'
				},{
					id:'0',
					value:'其他'
				},{
					id:'-1',
					value:'全部'
				}
			],
			source:'',
			no_data:''
		}
	},
	mounted(){
		if(this.$store.state.keyword){
			this.getSearchValue(this.$store.state.keyword)
		}
		this.$on('search',this.getSearchValue)
	},
	methods:{
		getSearchValue:function(value){
			this.kw = value
			this.list = []
			this.haveMore = true
			this.loading = false
			this.page = 1
			console.log('receive'+value)
			this.getList()
		},
		getList:function(source = undefined){
			if(source){
				this.selected = source
				this.list = []
				this.haveMore = true
				this.loading = false
				this.page = 1
			}
			console.log(source)
			const This = this
			const value = this.kw
			if(source !== undefined){
				this.source = source
			}
			if(value === ''){
				return
			}
			if(!this.haveMore){
				return
			}
			this.loading = true
			let arr
			console.log(this.source === '')
			if(this.source === '' || this.source === '-1'){
				arr = [this.getListBySource(1),this.getListBySource(4),this.getListBySource(5)]
			}else{
				arr = [this.getListBySource(this.source)]
			}
			Promise.all(arr).then(result => {
				let temp = []
				result.map((res) => {
					if(res.data && res.data.data){
						if(res.data.data.length > 0){
							let list = This.formatData(res.data.data)
							temp = [...temp,...list]
						}
					}
				})
				if(temp.length > 0){
					This.list = [...This.list,...temp]
				}else{
					This.haveMore = false
				}
				if(This.list.length === 0){
					This.no_data = true
				}else{
					This.no_data = false
				}
				This.loading = false
				This.page++
			})
		},
		getListBySource(source){
			const value = this.kw
			const This = this
			return this.axios({
				method:'get',
				url:`${This.PUBLIC_HOST}/api/third/search/all`,
				params:{
					key:unescape(value),
					type:2,
					source:source, //[0,1,4,5]  
					openid:This.$route.query.openid,
					page:this.page
				}
			})
		},
		formatData:function(list){
			if(Object.prototype.toString.call(list) === '[object Array]'){
				for(let i = 0 ; i < list.length ; i++){
					list[i]["sequence"] = i + (this.page - 1) * list.length
					list[i] = this.transformData(list[i])
				}
			}
			return list
		},
		transformData:function(item,operate = 1){
			const source = item.source
			const song_name = item.audio_name
			const song_id = item.audio_id
			const song_url = item.audio_url
			const song_icon = item.audio_pic_url
			const sequence = item.sequence
			let album_name,album_id,album_icon,category_id
			if(item.album){
				album_name = item.album.album_title
				album_id = item.album.album_id
				album_icon = item.album.icon
				category_id = item.album.category
			}
			const duration = item.audio_duration
			const data = {sequence,source,song_id,song_name,song_url,album_name,album_id}
			const playlist = [data]
			const sendData = {
              "action": "device_play",
              "play_ctrl": "play",
              "category": this.CategoryMode.SINGLE_MUSIC,
              sequence,
              source,
              song_id,
              song_name,
              song_url,
              "operate": operate,
              duration,
              song_icon,
              album_icon,
              category_id,
              album_name,
              playlist
            }
            return sendData
        }
	}
}
</script>

<style type="text/css" scoped>
.search_tab {
    display: -webkit-box;
    padding: .3rem .3rem;
    overflow-x: scroll;
}	
.search_tab ul {
    white-space: nowrap;
    min-width: 100%;
    display: flex;
}
.search_tab ul li {
    flex: 1;
    text-align: center;
    margin: 0 .3rem;
}
.search_tab ul li span {
    color: white;
    background: pink;
    background-image: -webkit-linear-gradient(pink 0%, #e66c95 100%);
    background-image: linear-gradient(pink 0%, #e66c95 100%);
    font-weight: 600;
    font-size: 1.5rem;
    border-radius: .8rem;
    padding: .4rem .7rem;
}
.selected{
	color:black;
}
</style>


