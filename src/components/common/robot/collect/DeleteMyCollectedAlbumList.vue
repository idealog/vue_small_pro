<!--批量刪除收藏的专辑或者单曲-->
<template>
	<div>
		<div class="flex_container">
			<div class="item left" @click.stop="selectAll">
				{{all_select}}
			</div>
			<div class="item title">
				{{title}}
			</div>
			<div class="item right" @click.stop="back">
				{{cancel}}
			</div>
		</div>
		<div>
			<AlbumList :album_list="collected_album_list" :showOptionSelect="showOptionSelect"
				@select="selectItem"
				@cancel_select="cancel_select"
				@clickItem="dealItem"
			>
			</AlbumList>
		</div>
		<div class="bottom_btn" @click.stop="deleteSelected" v-show="selected_list.length > 0">删除</div>

		<PopCenter :show_pop_ctrl="show_pop_ctrl" :pop_title="pop_title" :pop_content="pop_content" :cancel_txt="cancel_txt" :finish_txt="finish_txt"
		@hidePop="hidePop">
			
		</PopCenter>
	</div>
</template>
<script type="text/javascript">
	import AlbumList from '@/components/common/business/AlbumList'
	import PopCenter from '@/components/common/pop/PopCenter'
	export default {
		components:{
			AlbumList,
			PopCenter
		},
		data(){
			return {
				showOptionSelect: true,
				all_select:'全选',
				title:'批量操作',
				cancel:'返回',
				hideRight: true,
				collected_list:[],
				selected_list:[],
				cancel_select_all:'取消全选',
				select_all:'全选',
				collected_album_list:[],
				pop_title:'删除专辑',
				pop_content:`确定要删除选中的专辑吗？`,
				show_pop_ctrl:false,
				cancel_txt:'取消',
				finish_txt:'删除'
			}
		},
		watch:{
			/*collected_list(list){
				for(let i=0;i<list.length;i++){
					if(list.selected){
						this.selected_list.push(list[i])
					}
				}
			}*/
		},
		mounted(){
			this.getCollectedList()
		},
		methods:{
			getCollectedList(){
				this.collected_album_list = [
					{
						album_name:'实力专辑',
						album_count: 100,
						ability: 10,
						//icon: require('@/assets/img/name.png')
					},
					{
						album_name:'实力专辑',
						album_count: 100,
						ability: 10,
						//icon: require('@/assets/img/name.png')
					},
					{
						album_name:'实力专辑',
						album_count: 100,
						ability: 10,
						//icon: require('@/assets/img/name.png')
					},
					{
						album_name:'实力专辑',
						album_count: 100,
						ability: 10,
						//icon: require('@/assets/img/name.png')
					},
					{
						album_name:'实力专辑',
						album_count: 100,
						ability: 10,
						//icon: require('@/assets/img/name.png')
					}
				]
			},
			selectAll(){
				if(this.all_select != this.cancel_select_all){
					this.all_select = this.cancel_select_all
					for(let i=0; i< this.collected_album_list.length; i++){
						this.$set(this.collected_album_list[i],'selected',true)
						this.selected_list.push(this.collected_list[i])
					}
				}else{
					for(let i=0; i< this.collected_album_list.length; i++){
						this.$set(this.collected_album_list[i],'selected',false)
					}
					this.all_select = this.select_all
					this.selected_list = []
				}
			},
			back(){
				this.$router.go(-1)
			},
			deleteSelected(){
				this.show_pop_ctrl = true
				this.pop_content = `确定要删除选中的${this.selected_list.length}个专辑吗`
			},
			selectItem(item){
				this.$set(item,'selected',true)
				this.selected_list.push(item)
				console.log(item)
			},
			cancel_select(item){
				this.$set(item,'selected',false)
				for(let i=0;i< this.selected_list.length; i++){
					if(this.selected_list[i].id === item.id){
						this.selected_list.splice(i,1)
						i--
					}
				}
				console.log(item)
			},
			hidePop(val){
				if(val === 'finish'){
					console.log('delete selected album')
					//todo
				}
				this.show_pop_ctrl = false
			},
			dealItem(item){
				
			}
		},
		render(){
			h =>  (App)
		}
	}
</script>
<style scoped>
	.flex_container{
		display: -webkit-flex;
		line-height: 4rem;
		border-bottom: 1px solid rgb(222,222,222);
	}
	.title{
		font-size: 1.8rem;
	}
	.item{
		flex:1;
		text-align: center;
		font-size: 1.5rem;
	}
	.left{
		text-align: left;
		margin-left:1rem;
		color:rgb(108,108,108);
	}
	.right{
		text-align: right;
		margin-right:1rem;
		color:rgb(108,108,108);
	}
	.bottom_btn{
		position: fixed;
		z-index: 100;
		line-height: 4rem;
		color:white;
		font-size: 1.6rem;
		background: red;
		bottom: 0;
		width: 100%;
		text-align: center;
	}
</style>