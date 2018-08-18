<template>
	<div>
		<ul class="wrapper">
			<li class="item more"   v-for="item,index in album_list" @click.stop="clickItem(item)">
			    <!--插槽组件-->
				<div class="slot_wrap" v-show="showOptionSelect">
					<div class="slot_pic_container">
						<span class="circle" v-show="!item.selected" @click.stop="select(item)"></span>
						<img :src="slot_icon" style="width:1.6rem" v-show="item.selected" @click.stop="cancel(item)"/>
					</div>
				</div>
				<div class="album_wrap">
					<div class="album_img_wrap">
						<img v-lazy="item.icon"  />
					</div>
					<div class="content" >
						<h3 class="title">{{index+1}}、{{item.album_title || item.album_name}}</h3>
						<p class="attr"><img :src="ability_icon" /><span>能力值 +{{item.ability || 10}}</span></p>
						<p class="attr"><img :src="count_icon"/> <span>{{item.album_count}}</span></p>
					</div>
				</div>
			</li>
		</ul>
		<!-- <h3 v-show="no_data" class="no_data_tip">没有数据了</h3>
		<Loading :show="loading"></Loading> -->
	</div>
</template>
<script>
	import Loading from '@/components/loading/Loading'
	//import {getAlbumListByTag} from '@/service/getData'
	export default {
		props:{
			album_list:{
				type: Array,
				default: () => []
			},
			showOptionSelect:{
				type: Boolean,
				default: () => false
			}
		},
		components:{
			Loading
		},
		data(){
			return {
				ability_icon: require('@/assets/img/ability.png'),
				count_icon: require('@/assets/img/count.png'),
				category_id: this.$route.query.category_id,
				page: 1,
				limit: 20,
				loading: true,
				no_data:false,
				scroll:0,
				operation_icon: require('@/assets/img/oneloop.png'),

				slot_icon: require('@/assets/img/selected.png')
			}
		},
		mounted(){
			//this.getAlbumList(this.page,this.limit,this.category_id)
		},
		activated(){
			/*this.loading = false
			window.addEventListener('touchend',this.handleScroll)
			if(this.scroll){
				window.scrollTo(0,this.scroll) //记录滚动位置
			}
			if(this.category_id != this.$route.query.category_id){
				this.init()
				this.getAlbumList(this.page,this.limit,this.category_id)
			}*/
		},
		deactivated(){
			/*this.loading = true
			this.isFirstVisit = true
			window.removeEventListener('touchend',this.handleScroll)*/
		},
		methods:{
			handleScroll(){
				let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
  				this.scroll = scrollTop;
			},
			init(){
				this.album_list = []
				this.page = 1
				this.limit = 20
				this.loading = true
				this.category_id = this.$route.query.category_id
			},
			select(item){
				/*if(!item.selected){
					this.$set(item,'selected',true)
				}else{
					this.$set(item,'selected',false)
				}*/
				console.log('select item')
				this.$emit('select',item)
			},
			cancel(item){
				this.$emit('cancel_select',item)
			},
			/*getAlbumList(){
				getAlbumListByTag(this.page,this.limit,this.category_id).then(resp => {
					if(resp && resp.data){
						if(resp.data.status === 0){
							this.album_list = [...this.album_list,...resp.data.data]
							this.page++
						}
					}
					if(this.album_list.length === 0){
						this.no_data = true
					}
					this.loading = false;
				})
			},*/
			clickItem(item){
				console.log(item)
				this.$emit('clickItem',item)
				//this.$router.push({path:'/songlist',query:{album_id:item.id}})
			},
			emitOperationClick(e){
				console.log('operationClick')
				this.$emit('operationClick',e)
			}
		}
	}
</script>
<style scoped>
	.wrapper{
		padding-bottom:2.2rem;
	}
	.item{
		padding: 0 1rem 0rem 1rem;
		border-bottom: 1px solid rgb(235,235,235);
		position: relative;
		overflow: hidden; 
		display: -webkit-flex;
	}
	.title_img{
		width: 5rem;
		height: 5rem;
		margin-bottom: 3rem;
		/* display: inline-block; */
	}
	.content{
		margin-left:.5rem;
		display: inline-block;
		width: calc(100% - 6rem);
		padding-bottom: 1rem;
		padding-top:.5rem;
		margin-left:6rem;
		/* float: right; */
	}
	.title{
		margin-bottom:.4rem;
	}
	.attr{
		position: relative;
		font-size: .8rem;
		color:rgb(166,166,166);
	}
	.attr img{
		display: inline-block;
		height: 1.2rem;
	}

	.attr span{
		display: inline-block;
		position: absolute;
		top:.3rem;
		margin-left: .2rem;
	}
	.no_data_tip{
		text-align:center;
		margin-top:.5rem;
		margin-bottom:2rem;
	}

	.circle{
		display: inline-block;
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 50%;
		border: .2rem solid rgb(222,222,222);
		top: 50%;
    	position: absolute;
    	transform: translateY(-50%);
	}
	.album_img_wrap{
		width:5rem;
		height: 4.8rem;
		display:inline-block;
		position:absolute;
		top: 50%;
		transform: translateY(-50%);
		background: rgb(188,188,188);
	}
	.album_img_wrap img{
		width: 100%;
		height: 100%;
		border-radius: .5rem;
	}
	.operation_icon_wrap{
		position: absolute;
		display: inline-block;
		top: 50%;
		transform: translateY(-50%);
	}
	.slot_wrap{
		position:relative;
		display: inline-block;
		width:3rem;
		flex: .13;
	}
	.album_wrap{
		/* position: relative;
		display: inline-block;
		width: calc(100% - 4rem); */
		flex: 1;
	}
	.slot_pic_container{
		position: absolute;
		width: 3rem;
		height: 3rem;
		top:50%;
		transform:translateY(-50%);
		text-align: left;
	}
	.slot_pic_container img{
		width: 1.6rem;
		position: absolute;
		top:50%;
		transform: translateY(-50%);
	}
</style>
