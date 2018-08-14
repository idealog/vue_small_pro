<template>
	<div>
		<div class="pop_root" :class="{show:show,hide:hide}">
			<div class="pop_bg" @click.stop="cancel" v-show="show">
				<div class="pop_box"  :class="{center:type == 'center',bottom: type == 'bottom'}" @click.stop>
					<div class="pop_tit">{{title}}</div>
					
					<div class="clearfix ctl_volume">  
						<a class="icons icon_setting_max_volume"></a>  
						<div class="progress" ref="progress">    
							<div style="position:relative;top: 50%;">      
								<p  style="top:12%;position:absolute;" v-bind:style="{width: left + '%'}"></p>    
							</div>    
							<a ref="btn" v-bind:style="{left: left + '%'}"></a>  
						</div>
						<span id="volume_text">{{left}}%</span>
					</div>
					<div class="pop_btns">
						<div>
							<template v-if="!cancel_btn">
								<a :class="{finish: !ok_btn}" @click="finish">完成</a>
							</template>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default {
		name:'Volume',
		props: ['title','content','ok_btn','cancel_btn','type','volume_percent'],
		data(){
			return {
				show: true,
		  		hide: false,
		  		offset_left:'',
		  		left:''
			}
		},
		mounted(){
			this.left = this.volume_percent
			this.getOffsetLeft()
			this.bindEvent()
		},
		methods: {
			finish() {
				if(this.left != this.volume_percent && this.left !== ''){
					this.$emit("change_percent",this.left)
				}
				this.$emit('finish');
			},
			cancel() {
				this.show = false;
				this.hide = true;
				let _this = this;
				setTimeout(function(){_this.$emit('cancel');},300);
			},
			getOffsetLeft() {
				const progress_width = this.$refs.progress.clientWidth
				console.log(progress_width)
				let parent = this.$refs.progress.offsetParent
		        this.offset_left = this.$refs.progress.offsetLeft
		        this.offset_left = this.offset_left + parent.offsetLeft
		        while(parent.offsetParent){
	                parent = parent.offsetParent
	                if(typeof parent.offsetLeft === 'number'){
	                    this.offset_left = parent.offsetLeft + this.offset_left
	                }
	            }
	            console.log('progress offset_left:' + this.offset_left)
			},
			bindEvent() {
				const progress_width = this.$refs.progress.clientWidth
				const This = this
				this.$refs.btn.addEventListener("touchmove",function(e){
					let left = e.changedTouches[0].pageX - This.offset_left
					if(left <= 0){
						This.left = 0
					}
					if(left >= progress_width){
						This.left = 100
					}
					let num = Math.ceil(left * 100 / progress_width)
					if(num > 0 && num < 100 && num % 10 === 0){
						This.left = num
						//This.$emit('change_percent',This.left)
					}
				})
			}
		}
	}	
</script>

<style scoped>
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


	.clearfix:after {
	    content: ".";
	    display: block;
	    height: 0;
	    clear: both;
	    visibility: hidden;
	}

	.ctl_volume {
	    width: 28rem;
	    margin: 0 auto;
	}

	.ctl_volume .icons {
	    width: 4rem;
	    height: 4rem;
	    float: left;
	    margin-top: 0;
	}

	.icon_setting_max_volume {
	    /* background: url(../../../../images/icon_setting_max_volume.png) center center no-repeat; */
	    background-size: 50%;
	}

	.ctl_volume .progress {
	    float: left;
	    height: 4rem;
	    width: 18rem;
	    margin: 0 1rem;
	}

	.progress div p {
	    background-color: #4dcb9b;
	    height: 2px;
	}
	.progress a {
	    width: 3rem;
	    height: 3rem;
	    position: relative;
	    margin-top: -1px;
	    padding: 0.5rem;
	    display: block;
	    margin-left: -1.5rem;
	    top: 0.5rem;
	}

	.progress a:before {
	    content: "";
	    width: 100%;
	    height: 100%;
	    display: block;
	    background-color: #fff;
	    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	    border-radius: 50%;
	}

	.ctl_volume span {
	    float: left;
	    line-height: 4rem;
	    width: 4rem;
	    text-align: center;
	}


</style>