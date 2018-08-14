<template>
	<div class="pop_bg" @click.stop="cancel" :class="{show: show, p_hide: hide}">
		<div class="pop_box" @click.stop>
			<div class="pop_tit" v-html="title"></div>
			<div class="pop_content" v-html="content"></div>
			<div class="pop_btns">
				<div>
					<template v-if="!!ok_btn">
						<a :class="{finish: !ok_btn}" @click="finish" style="border-right: 1px solid #b2b2b2;">{{ok_btn}}</a>
					</template>
					<template v-if="cancel_btn">
						<a :class="{finish: !ok_btn}" @click="cancel">{{cancel_btn}}</a>
					</template>
					<template v-if="!cancel_btn">
						<a :class="{finish: !ok_btn}" @click="cancel">确认</a>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'pop',
	props: ['title','content','ok_btn','cancel_btn'],
	data () {
		return {
		  	show: true,
		  	hide: false,
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
		display: block;
	    -webkit-animation: pop_kf 300ms;
	}
	.pop_bg.p_hide {
		display: none;
	    opacity: 0;`
	    -webkit-animation: pop_kf1 300ms;
	}
	@-webkit-keyframes pop_kf {
	    from {
	        opacity: 0;
	    }
	    to {
	        opacity: 1;
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
	.pop_box{
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
	}
	.pop_btns {
	    padding: 2.5rem 7rem;
	    font-size: 1.5rem;
	}
	.pop_btns div {
	    /*border: 1px solid #b2b2b2;*/
	    border: 1px solid #ffa21b;
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
	    /*background-image: -webkit-linear-gradient(#a4e7c6 0%, #7ED2A9 100%);*/
	    /*background-image: linear-gradient(#a4e7c6 0%, #7ED2A9 100%);*/
	    background-image: linear-gradient(#ffdd35 0%, #f0b23f 100%);
	    color: #fff;
	    font-size: 1.5rem;
	}
	.pop_btns a:active {
	    background: #7ED2A9;
	    /*background-image: -webkit-linear-gradient(#7ED2A9 0%, #a4e7c6 100%);*/
	    /*background-image: linear-gradient(#7ED2A9 0%, #a4e7c6 100%);*/
	    background-image: linear-gradient(#f0b23f 0%, #ffdd35 100%);
	}
	.pop_btns a.finish{
		width: 100%;
	}
</style>