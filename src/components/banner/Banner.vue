<template>
  <div class="main">
    <div class="sliderBox">
        <div id="slider" class="flexslider">
            <ul>
                <li>
                    <a @click="dailyRecommendAlert()">
                        <img :src="url" width="100%">
                    </a>
                </li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    props:['url'],
    name: 'banner',
    data () {
        return {
          data:'./daily_recommend.jpg',
        }
    },
    mounted(){
        
    },
    methods: {
        dailyRecommendAlert: () => {
        }
    }
}
</script>