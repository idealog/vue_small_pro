<template>
	<div ref="parentElem" class="picker_wrap">
	 	<vue-scroll :ops="ops" ref="vs" @handle-scroll="handleScroll">
		<ul class="picker_ui" ref="picker">
			<template v-for="item,index in items">
			 <!--data-index 根据元素获取当前的下标值-->
				<li class="picker_li" :key="index" :index="index" :class="{active:index == currentIndex}"  :data-index="index"  @touchstart="goToElem($event.target)" @click.stop="goToElem($event.target,true)">
					{{item}} 
				</li>
			</template>
		</ul>
		</vue-scroll>
	</div>
</template>
<script>
	export default {
		props:{
			items: {
				type: Array,
				default: () => []
			},
			currentValue: {},
			initValue:{
				type: Number,
				default: () => 1
			}
		},
		data(){
			return {
				ops: {
		        vuescroll: {
			          mode: 'slide',
			          scroller: {
			            bouncing: false,
			            preventDefault: false
			          },
			          //每次滑动50的距离
			          snapping: {
			            enable: true,
			            height: 50
			          }
			        },
			        scrollPanel: {
			          scrollingX: false,
			        },
			        bar: {
			          onlyShowBarOnScroll: false,
			          keepShow: false,
			          background: '#ffffff', //滚动条与背景色重叠
			        }
			    },
			    currentIndex:'',
			    width:'',
			    target:'',
			}
		},
		watch:{
			initValue(val){
				this.setInitPosition()
			}
		},
		mounted(){
			this.width = this.$refs.parentElem.clientWidth + 'px'
		},
		methods:{
			//设置初始滚动位置
			setInitPosition(){
				const vm = this;
			    setTimeout(() => {
			        vm.$refs['vs'].scrollTo(
			          {
			            y: 50 * parseInt(vm.initValue)
			          },
			          true
			        )
			     }, 0)
			},
			scrollToElem(){
				const vm = this
				setTimeout(function(){
					if(vm.target){
						const index = vm.target.dataset.index;
				        vm.target = null; //计算滚动多长位置
				        vm.$refs['vs'].scrollBy(
				          {
				            dy: 50 * (index - vm.currentIndex)
				          },
				          true
				        );
					}
				})
				
			},
			//获取滚动目标
			goToElem(target,isScroll){
				this.target = target
				if(isScroll){
					this.scrollToElem()
				}
			},
			//内容滚动的回调函数
			handleScroll({ process }) {
		        const children = this.$refs['picker'].children;
		        const length = children.length;
		        const currentIndex = Math.floor(length * process);
		        for (
		            let index = Math.max(currentIndex - 1, 0);
		        	index <= Math.min(currentIndex + 1, length - 1);
		        	index++
		      	) {
		        	const element = children.item(index);
		        	const { top } = element.getBoundingClientRect();
		        	const { top: vsTop } = this.$refs['vs'].$el.getBoundingClientRect(); //获取距离变
		        	if (
		          	(top - vsTop < 125 && top - vsTop >= 100) ||
		          	(top - vsTop > 75 && top - vsTop <= 100)
		        	) {
		          		this.currentIndex = element.dataset.index;
		          		const formatValue =
		            	this.currentIndex < 10
		              ? '0' + this.currentIndex
		              : this.currentIndex;
		          		this.$emit('update:currentValue', formatValue); //动态修改当前变化的值
		        }
		      }
		    }

		}
	}
</script>

<style scoped>
	.picker_wrap{
		height: 250px !important;
	}
	.picker_ui{
		padding: 100px 0;
  		margin: 0;
	}
	.picker_li{
		height: 50px;
  		line-height: 50px;
  		display: block;
  		color: rgba(166,166,166,.6);
  		text-align: center;
  		font-size: 1.6rem;
	}
	.active{
		color:#000000;
		font-size:1.6rem;
	}
	.selected_line_top{
		position: absolute;
		margin:0;
		height: 100px;
		width:100%;
		border-bottom: 1px solid #e3e3e3;
		top:77px;
	}
	.selected_line_bottom{
		position: absolute;
		margin:0;
		height: 100px;
		width:100%;
		border-top: 1px solid #e3e3e3;
		bottom:5px;
	}
</style>