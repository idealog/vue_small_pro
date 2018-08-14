<template>
	<div class="pop_root" :class="{show:show,hide:hide}">
		<div class="pop_bg" @click.stop="cancel" v-show="show">
			<div class="pop_box"  :class="{center:type == 'center',bottom: type == 'bottom'}" @click.stop>
				<div class="pop_tit">{{title}}</div>
				<div class="pop_content" v-html="content" v-show="!is_list"></div>
				<component :is="content_component" :show="is_list" :list="list" :item_key="item_key" :selected_item="selected_item"  @change_selected="get_selected" :is_capacity="is_capacity" :capacity="capacity" :tips="tips" :ceil="ceil"></component>
				<div class="pop_btns">
					<div>
						<template v-if="!!ok_btn">
							<a :class="{finish: !ok_btn}" @click="finish" style="border-right: 1px solid #b2b2b2;">{{ok_btn}}</a>
						</template>
						<template v-if="cancel_btn">
							<a :class="{finish: !ok_btn}" @click="cancel">{{cancel_btn}}</a>
						</template>
						<template v-if="!cancel_btn">
							<a :class="{finish: !ok_btn}" @click="finish">确认</a>
						</template>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import Pop_List from './Pop_List'
	import Capacity from './Capacity'
	export default{
		name: 'Pop_Bottom',
		props: ['title','content','ok_btn','cancel_btn','is_list','list','type','item_key','is_capacity','tips','capacity','ceil','selected_item'],
		components:{
			Pop_List,
			Capacity
		},
		data(){
			return {
		  		show: true,
		  		hide: false,
		  		content_component:''
			}
		},
		mounted(){
			//console.log(this.capacity)
			if(this.is_list){
				this.content_component = "Pop_List"
			}
			if(this.is_capacity){
				this.content_component = "Capacity"
			}
		},
		methods: {
			finish() {
				this.$emit('finish');
			},
			cancel() {
				this.show = false;
				this.hide = true;
				let _this = this;
				setTimeout(function(){_this.$emit('cancel');},300);
			},
			get_selected(value){
				this.$emit('change_selected',value)
			}
		}
	}
</script>
<style type="text/css" scoped>
	.pop_bg{
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
    	background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
	}
	.pop_bg.show {
		/* display: block; */
	    -webkit-animation: pop_kf 200ms;
	}
	.pop_bg.p_hide {
		display: none;
	    opacity: 0;
	    -webkit-animation: pop_kf1 200ms;
	}
	@keyframes pop_kf {
	    from {
	        opacity: 0;
	    }
	    to {
	        opacity: 1;
	    }
	}
	@-webkit-keyframes pop_kf {
	    from {
	        opacity: 0;
	    }
	    to {
	        opacity: 1;
	    }
	}
	@keyframes pop_kf1 {
	    from {
	        opacity: 1;
	    }
	    to {
	        opacity: 0;
	    }
	}
	@-webkit-keyframes pop_kf1 {
	    from {
	        opacity: 1;
	    }
	    to {
	        opacity: 0;
	    }
	}
	.pop_box.center{
		background-color: #fff;
	    position: fixed;
   		top: 50%;
    	transform: translate(0, -50%);
    	-webkit-transform: translate(0, -50%);
	    left: 10%;
	    bottom: auto;
	    width: 80%;
	    z-index: 1001;
	   	border-radius: 1rem;
	}
	.pop_box{
		 background-color: #fff;
	    position: fixed;
	    z-index: 1001;
	    bottom: 0;
	    left: 0;
	    width: 100%;
	}
	.pop_box.bottom{
	    background-color: #fff;
	    position: fixed;
	    z-index: 1001;
	    bottom: 0;
	    left: 0;
	    width: 100%;
	}
	.pop_tit{
		text-align: center;
	    padding: 1.6rem 0;
	    font-size: 1.6rem;
	    font-family: 'SimHei';
	}
	.pop_content {
	    max-height: 55vh;
	    overflow: auto;
	    -webkit-overflow-scrolling: touch;
	    text-align: center;
	    /* padding:1.5rem 0; */
	    /* border-top:1px solid #eee;
	    border-bottom:1px solid #eee; */
	}
	.pop_btns {
	    padding: 2.5rem 7rem;
	    font-size: 1.5rem;
	}
	.pop_btns div {
	    /* border: 1px solid #ffa21b; */
	    border-radius: 2rem;
	    background-color: #fff;
	    overflow: hidden;
	}
	.pop_btns a {
	    width: 50%;
	    float: left;
	    text-align: center;
	    line-height: 3.4rem;
	    background: #7ED2A9;
	    background-image: linear-gradient(#a4e7c6 0%, #7ED2A9 100%);
	   /*  background-image: linear-gradient(#ffdd35 0%, #f0b23f 100%); */
	    color: #fff;
	    font-size: 1.5rem;
	}
	.pop_btns a:active {
	    background: #7ED2A9;
	    background-image: linear-gradient(#f0b23f 0%, #ffdd35 100%);
	}
	.pop_btns a.finish{
		width: 100%;
	}
	
	.pop_root.show .pop_box.bottom {
	    -webkit-animation: pop_kf2 300ms ease;
	} 
	
	.pop_root.show .pop_bg {
		animation:pop_kf 300ms;;
	    -webkit-animation: pop_kf 300ms ease;
	}
	.pop_root.hide .pop_bg {
		animation:pop_kf1 300ms;;
	    -webkit-animation: pop_kf1 300ms ease;
	}

	@-webkit-keyframes pop_kf2 {
	    from {
        	transform: translateY(100%);
	    }
	    to {
        	transform: translateY(0%);
	    }
	}

	@keyframes pop_kf2{
		from {
        	transform: translateY(100%);
	    }
	    to {
        	transform: translateY(0%);
	    }
	}

</style>