<template>
	<div>
		<div class="capacity">
			<div style="background-color: rgb(0, 193, 210);height:100%">
				<p :style="{height:percent}"></p>
			</div>
			<div class="capacity_pop_t">{{tips}}<span style="color:#00c1d2">{{compute(capacity)}}</span>{{ceil}}</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		name:'Capacity',
		props:['tips','capacity','ceil'],
		data(){
			return {
				show:false,
				percent:'100%'
			}
		},
		mounted(){
			let This = this
			setTimeout(function(){
				This.percent = 100 - parseInt(This.capacity.split("%")[0]) + '%'
			},30)
		},
		methods:{
			compute(capacity){
				return this.$store.state.battery
			}
		}
	}
</script>

<style type="text/css" scoped>
	.capacity{
		width: 12rem;
	    height: 12rem;
	    margin: 1rem auto;
	}
	.capacity div p {
	    width: 100%;
	    height: 100%;
	    background-color: #ddd;
	    transition: all 1000ms linear;
	    -webkit-transition: all 1000ms linear;
	}
	.capacity_pop_t {
		margin-top:.5rem;
    	text-align: center;
	}
</style>