<template>
	<div>
		<article>
			<div class="period">
				<h3><img :src="simple" />公司简介</h3>
				<p>
					深圳市金刚蚁技术有限公司成立于2014年7月，是一家专注于家用智能机器人和智能故事机领域研发、生产的创新型高科技公司。公司总部在深圳，在北京设有分公司。
				</p>
				<!-- <img :src="office"  style="width:100%"/> -->

				<div v-bind:style={background:office,backgroundSize:size,height:height_office}></div>
			</div>
			<div class="period">
				<h3><img :src="head" />我们的产品</h3>
				<p>
					芬兰ROVIO总部授权快乐传送门2.0全系列形象给深圳市金刚蚁机器人技术有限公司，由金刚蚁打造出全新打造IP化智能故事机产品。除怒鸟形象外，国王猪、炸弹黑、飞镖黄等快乐传送门系列产品将会相继推出。
				</p>
				<div v-bind:style={background:product,backgroundSize:size,height:height_product}></div>
			</div>
			<div class="period">
				<h3><img :src="customer" />我们的售后</h3>
				<p style="text-indent:0">
					我司严格遵循国家三包政策<br>
					服务时间：周一至周五9：00 - 18：00<br>
					客服热线：400-600-9981<br>
					我们将竭诚为您服务！<br>
				</p>
			</div>
		</article>

	</div>


</template>

<script type="text/javascript">
	export default {

		data(){
			return {
				simple:`${this.HOST}/images/公司.png`,
				office:`url(${this.HOST}/images/办公室.jpg)`,
				head:`${this.HOST}/images/头像.png`,
				product:`url(${this.HOST}/images/产品.png)`,
				customer:`${this.HOST}/images/客服.png`,
				size:'100%',
				height_office:'22rem',
				height_product:'16rem'
			}
		},

		mounted(){

		},

		methods:{

		}
	}
</script>

<style type="text/css" scoped>
.period{

	}
	h3{
		font-size:1.4rem;
		color:red;
		font-weight: bold;
		padding: 2rem 0 1rem 2rem;
	}
	h3 img{
		width: 2.8rem;
		margin-right: .6rem;
	}
	.period p{
		text-indent: 2em;
	    line-height: 1.8rem;
	    padding: 0 2rem 2rem 2rem;
	    letter-spacing: .1rem;
	}
</style>
