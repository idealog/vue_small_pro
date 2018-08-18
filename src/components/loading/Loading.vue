<template>
	<div class="shade" :class="{hide: !show}">
		<table width="100%" height="100%">
			<td>加载中...</td>
			<td align="center">
				<!-- <img :src="img"/> -->

				<div id="loading3">
			       <div class="demo3"></div>
			       <div class="demo3"></div>
			       <div class="demo3"></div>
			       <div class="demo3"></div>
			       <div class="demo3"></div>
			       <div class="demo3"></div>
			       <div class="demo3"></div>
			       <div class="demo3"></div>
			 	</div>
			</td>
		</table>
	</div>
</template>

<script>
export default {
	name: 'loading',
	props: ['show'],
	data () {
		return {
			//img: require('@/assets/img/loading.gif'),
		}
	}
}
</script>

<style type="text/css" scoped>
.shade{
	position: fixed;
	top: 0;
	margin: 0;
	width: 100%;
	height: 100%;
	background: rgba(230,230,230,0.5);
	font-size: 0;
}

.shade img{
	max-width: 40px;
}

td{
	vertical-align: middle;
}

.hide{
	display: none;
}


#loading3 {
    position: relative;
     width: 50px;
     height: 50px;
  }
  .demo3 {
      width: 4px;
     height: 4px;
      border-radius: 2px;
     background: #4dcb9b;
     background:#999;
     position: absolute;
     animation: demo3 linear 0.8s infinite;
     -webkit-animation: demo3 linear 0.8s infinite;
 }
 .demo3:nth-child(1){
     left: 24px;
     top: 2px;
     animation-delay:0s;
 }
 .demo3:nth-child(2){
     left: 40px;
     top: 8px;
     animation-delay:0.1s;
 }
 .demo3:nth-child(3){
     left: 47px;
     top: 24px;
     animation-delay:0.1s;
 }
 .demo3:nth-child(4){
     left: 40px;
     top: 40px;
     animation-delay:0.2s;
 }
 .demo3:nth-child(5){
     left: 24px;
     top: 47px;
     animation-delay:0.4s;
 }
 .demo3:nth-child(6){
     left: 8px;
     top: 40px;
     animation-delay:0.5s;
 }
 .demo3:nth-child(7){
     left: 2px;
     top: 24px;
     animation-delay:0.6s;
 }
 .demo3:nth-child(8){
     left: 8px;
     top: 8px;
     animation-delay:0.7s;
 }
 
 @keyframes demo3 
 {
     0%,40%,100% {transform: scale(1);}
     20% {transform: scale(3);}
 }
 @-webkit-keyframes demo3 
 {
    0%,40%,100% {transform: scale(1);}
     20% {transform: scale(3);}
 }
</style>