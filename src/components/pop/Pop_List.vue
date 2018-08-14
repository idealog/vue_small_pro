<template>
	<div v-show="show" class="pop_list list_container">
		<ul>
			<li class="item" :class="{select: selected === item || selected_item == item}" v-for="item in list" @click="choose(item)" ref="items"> {{getValue(item)}}  </li>
		</ul>
	</div>
</template>
<script type="text/javascript">
	export default{
		name: 'pop',
		props: ['show','list','item_key','selected_item'],
		data(){
			return {
				selected:false,
				selected:''
			}
		},
		mounted(){
			console.log(this.selected_item)
			this.$refs.items.map(item => {
				if(item.className.indexOf("select") > -1){ //滚动到指定地方
					item.parentNode.parentNode.scrollTop = item.offsetTop - item.parentNode.parentNode.clientHeight + item.clientHeight
				}
			})
		},
		methods:{
			getValue(item){
				return item[this.item_key]
			},
			choose(item){
				if(this.selected != item){
					this.selected = item
					/*if(item.song_url){
						item["operate"] = 0
						this.websocket.sendMessage(item)
					}*/
				}else{
					this.selected = ''
				}
				this.$emit('change_selected',this.selected)
			}
		}

	}
</script>
<style type="text/css" scoped>
	.pop_list{
		max-height: 30rem;
		overflow:auto;
	}
	.list_container{
		border-top: 1px solid #eee;
	}
	.item{
		height: 4rem;
	    line-height: 4rem;
	    border-bottom: 1px solid #eee;
	    padding-left: 1rem;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	}
	.item.select:after {
	    content: "";
	    width: 1.5rem;
	    height: 1.5rem;
	    /* background: url(../../../../images/list_select.png) center center no-repeat; */
	    background-size: 80%;
	    display: inline-block;
	    vertical-align: middle;
	    margin: -2px 0 0 3px;
	}
</style>