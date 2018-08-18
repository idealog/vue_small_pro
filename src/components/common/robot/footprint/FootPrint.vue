<template>
	<div>
		<ul>
			<li v-for="item in list">
				<div class="time">
					<span>{{item.date}}</span>
					<span>{{item.time}}</span>
				</div>
				<div class="human">
					<div class="human_wrap">
						<div class="words">
							{{item.human}}
						</div>
						<div class="avatar">
							
						</div>
					</div>
				</div>
				<div class="clearfix"></div>
				<div class="robot">
					<div class="words">
						{{item.robot}}
					</div>
				</div>
			</li>
		</ul>
		<div class="bg"></div>
	</div>
</template>
<script type="text/javascript">
	export default{
		data(){
			return {
				list:[
					{
						date:'2018年8月15日',
						time:'13:30:30',
						human:'小鸟,大海小鸟,大犯得上犯得上犯得上海啥是蓝色的',
						robot:'海水的颜色是由海面反射光和海水内部的回散射光的颜色决定的'
					},
					{
						date:'2018年8月15日',
						time:'13:30:30',
						human:'小鸟,大海小鸟,大犯得上犯得上犯得上海啥是蓝色的',
						robot:'海水的颜色是由海面反射光和海水内部的回散射光的颜色决定的'
					},
					{
						date:'2018年8月15日',
						time:'13:30:30',
						human:'小鸟,大海小鸟,大犯得上犯得上犯得上海啥是蓝色的',
						robot:'海水的颜色是由海面反射光和海水内部的回散射光的颜色决定的'
					},
					{
						date:'2018年8月15日',
						time:'13:30:30',
						human:'小鸟,大海小鸟,大犯得上犯得上犯得上海啥是蓝色的',
						robot:'海水的颜色是由海面反射光和海水内部的回散射光的颜色决定的'
					}

				]
			}
		},
		mounted(){

		},
		methods:{

		},
		render(){
			h => (App)
		}
	}
</script>

<style scoped>
	.bg{
		position: absolute;
		width: 100%;
		height: 100%;
		background: rgb(248,248,248);
		top:0;
		z-index: -1;
	}
	.time{
		text-align: center;
    	padding: 1rem 1rem 0 1rem;
    	font-size: 1.5rem;
    	margin-bottom:1rem;
    	color:rgb(188,188,188);
	}
	.human{
		position: relative;

	}
	.human_wrap{
		float: right;
		padding:.5rem;
	}
	.human .words{
		display: inline-block;
    	font-size: 1.5rem;
	    max-width: -webkit-calc(100% - 5rem);
	    max-width: calc(100% - 5rem);
	    border: 1px solid rgba(237,237,237);
	    padding: .6rem 0.5rem .6rem .6rem;
	    border-bottom-left-radius: 1rem;
	    border-top-left-radius: 1rem;
	    border-bottom-right-radius: 1rem;
	    background: white;
	    color:rgb(134,134,134);
	}
	.human .avatar{
		display: inline-block;
	    width: 4rem;
	    height: 4rem;
	    background: rgb(254,154,104);
	    border-radius: 50%;
	    position: absolute;
	    right: 1rem;
	}
	
	.robot{
		margin-top:1rem;
		padding:1rem;
	}
	.robot .words{
		margin-top: 1rem;
	    padding: 1rem;
	    font-size: 1.5rem;
	    border-top-right-radius: 1rem;
	    border-bottom-left-radius: 1rem;
	    border-bottom-right-radius: 1rem;
	    background: rgb(102,198,106);
	    font-size: 1.5rem;
	    color:rgb(209,238,211);
	    line-height: 2rem;
	}
</style>