<template>
  <div id="app">
  	<!-- 显示全局右边的播放gif -->
  	<!-- <div v-show="$store.state.show_small_player" class="top_right" @click.stop="goPlayer">
  			<span>{{$store.state.title}}</span>
  			<img :src="play_gif">
  	</div>  -->
    <transition name="router-fade" mode="out-in">
		<keep-alive>
		    <router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>
	</transition>
	<transition name="router-fade" mode="out-in">
		<!-- <div v-show="$store.state.show_small_player">这是头部公共部分</div> -->
		<router-view v-if="!$route.meta.keepAlive"></router-view>
	</transition>

	<!-- <propelling-controller></propelling-controller> -->
  </div>
</template>

<script>
	//import '@/assets/plugin/propellingController'
	export default {
	  name: 'app',
	  data(){
	  	   return {
	  	   		play_gif:require('@/assets/img/playing.png')
	  	   }
	  },
	  methods:{
	  	goPlayer(){
	  		this.$router.push({path:'/player', query:{openid:this.$route.query.openid}})
	  	}
	  }
	}
</script>

<style>
  .top_right{
  	    position: relative;
	    /* right: 1rem; */
	    width: 100%;
	    height: 2rem;
	    background: transparent;
	    height: 4rem;
	    line-height: 4rem;
	    text-align: center;
	    font-size: 2.5rem;
	    font-weight: bold;

  }
  .top_right img{
  		position: absolute;
	    float: right;
	    width: 2rem;
	    right: 1rem;
	    display: inline-block;
	    top:50%;
	    transform: translateY(-50%);
  }
  .router-fade-enter-active, .router-fade-leave-active {
      transition: opacity .3s;
  }
  .router-fade-enter, .router-fade-leave-active {
      opacity: 0;
  }
</style>

