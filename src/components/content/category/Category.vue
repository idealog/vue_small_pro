<template>
	<div>
		<ul class="container">
			<li v-for="item in category_list" class="child-item" @click.stop="goAlbum(item)">
				<img :src="item.category_pic_url" />
				<h3>{{item.category_name}}</h3>
			</li>
		</ul>
	</div>
</template>
<script>
	import {getCategoryList} from '@/service/getData'
	export default {
		 data() {
			return {
				category_list:[]
			}
		},
		mounted(){
			this.getCategory()
		},
		methods:{
			getCategory(){
				getCategoryList().then(resp => {
					if(resp && resp.status === 200){
						if(resp.data && resp.data.status === 0){
							this.category_list = resp.data.data
						}
					}
				})
			},
			goAlbum(item){
				this.$router.push({path:'/album',query:{category_id:item.id}})
			}
		}
	}
</script>
<style scoped>
	.container{
		display: -webkit-flex;
    	flex-flow: row wrap;
    	padding-bottom:6rem;
    	/* margin-top:1rem; */
	}
	.child-item{
	    flex: 0 0 25%;
	    text-align: center;
	}

	.child-item img{
		width: 5rem;
		height: 5rem;
		border-radius: 50%;
	}
	.child-item h3{
		margin-top:.8rem;
		margin-bottom:1rem;
	}
</style>