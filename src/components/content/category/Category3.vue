<template>
    <div> 
      <carousel  :indicators="true" :auto="0" style="height:17rem">
        <div  v-for="item in list">
           <div v-for="sub in item.content" class="sub-item" @click.stop="goAlbum(sub)">
             <img class="category_picture" v-lazy="sub.img"/>
                 <h3 class="title">{{replaceName(sub.name)}}</h3>
           </div>
        </div>
      </carousel>
      <div class="special">
        <!-- <div class="special_item" @click.stop="goWonder()"><div><h1 class="wonder_bg"><span class="wonder_why_module">十万个为什么</span></h1></div></div> -->
        <div class="special_item" @click.stop="goSynCourse()"><div><h1 class="wonder_bg"><span class="wonder_why_module">同步教材</span></h1></div></div>
        <div class="special_item" @click.stop="goXmly()"><div><h1 class="xmly_bg"><span class="xmly_module">喜马拉雅FM</span></h1></div></div>
      </div>   
    </div>
</template>
<script>
import carousel from '@/components/carousel/index.js'
export default {
    name:'Category',
    components: {
        carousel,
    },
    data(){
    return {
      list:[
        {'content':[
            {type:1,name:"欢乐儿歌",category:1,img:`${this.HOST}/images/icon_happy_song.png` },
            {type:1,name:"童话故事", category:3,img:`${this.HOST}/images/icon_fairy_tales.png`},
            {type:1,name:"国学经典",category:2,img:`${this.HOST}/images/icon_classics_chinese.png`},
            {type:1,name:"英语学习",category:4,img:`${this.HOST}/images/icon_enlighten_english.png`},
            {type:1,name:"十万个为什么",category:0,img:`${this.HOST}/images/sync_course.png`,path:"/wonder_tag"},
            /*{type:1,name:"同步教材",category:0,img:`${this.HOST}/images/sync_course.png`,path:"/syncourse"},*/
            /*{type:1,name:"喜马拉雅",category:0,img:`${this.HOST}/images/xmly.png`,path:"/xmly",},*/
            {type:1,name:"精品电台",category:0,img:`${this.HOST}/images/radio.png`,path:"/radio"},
            /*{type:1,name:"十万个为什么",category:0,img:`${this.HOST}/images/wonder_why.png`,path:"/wonder_tag",}*/

            {type: 1, name: "历史启蒙", img: `${this.HOST}/images/历史精选.png`, tag: "历史启蒙", category: 6},          
            {type: 1, name: "智力启蒙", img: `${this.HOST}/images/智力精选.png`, tag: "智力启蒙", category: 6}

          ]
        },
        {
          'content':[
            {type: 1, name: "科普启蒙", img: `${this.HOST}/images/科普精选.png`, tag: "科普启蒙", category: 6},
            {type: 1, name: "心理启蒙", img: `${this.HOST}/images/心理精选.png`, tag: "心理启蒙", category: 6},
            {type: 1, name: "胎教启蒙", img: `${this.HOST}/images/胎教精选.png`, tag: "胎教启蒙", category: 6},

           /* {type: 1, name: "每日FM", img: `${this.HOST}/images/FM.png`, path:'/song?type=fm', category: 0},
            {type: 1, name: "推送记录", img: `${this.HOST}/images/push.png`, path:'/push_record',  category: 0},
            {type: 1, name: "排行榜", img: `${this.HOST}/images/rank.png`, path:'/rank/composite', category: 0},
*/
            {type: 1, name: "英语启蒙", img: `${this.HOST}/images/英语精选.png`, tag: "英语启蒙", category: 6},
            {type: 1, name: "语文启蒙", img: `${this.HOST}/images/语文精选.png`, tag: "语文启蒙", category: 6},
            {type: 1, name: "国学启蒙", img: `${this.HOST}/images/国学精选.png`, tag: "国学启蒙", category: 6},
            {type: 1, name: "科普启蒙", img: `${this.HOST}/images/科普精选.png`, tag: "科普启蒙", category: 6},
            {type: 1, name: "心理启蒙", img: `${this.HOST}/images/心理精选.png`, tag: "心理启蒙", category: 6},
            /*{type: 1, name: "历史启蒙", img: `${this.HOST}/images/历史精选.png`, tag: "历史启蒙", category: 6},          
            {type: 1, name: "智力启蒙", img: `${this.HOST}/images/智力精选.png`, tag: "智力启蒙", category: 6}*/
          ]
        },
        { 'content':[
            /*{type: 1, name: "科普启蒙", img: `${this.HOST}/images/科普精选.png`, tag: "科普启蒙", category: 6},
            {type: 1, name: "心理启蒙", img: `${this.HOST}/images/心理精选.png`, tag: "心理启蒙", category: 6},
            {type: 1, name: "胎教启蒙", img: `${this.HOST}/images/胎教精选.png`, tag: "胎教启蒙", category: 6},*/
            {type: 1, name: "故事启蒙", img: `${this.HOST}/images/故事精选.png`, tag: "故事启蒙", category: 6},
            {type: 1, name: "歌曲启蒙", img: `${this.HOST}/images/歌曲精选.png`, tag: "歌曲启蒙", category: 6},
            {type: 1, name: "动画启蒙", img: `${this.HOST}/images/动画精选.png`, tag: "动画启蒙", category: 6},
            {type: 1, name: "思维启蒙", img: `${this.HOST}/images/思维精选.png`, tag: "思维启蒙", category: 6},
            {type: 1, name: "家教启蒙", img: `${this.HOST}/images/家教精选.png`, tag: "家教启蒙", category: 6},
             {type: 1, name: "每日FM", img: `${this.HOST}/images/FM.png`, path:'/song?type=fm', category: 0},
            {type: 1, name: "推送记录", img: `${this.HOST}/images/push.png`, path:'/push_record',  category: 0},
            {type: 1, name: "排行榜", img: `${this.HOST}/images/rank.png`, path:'/rank/composite', category: 0},
          ]
        }
      ],
    }
  },
  mounted(){
    //todo
  },
  methods:{
    replaceName:function(name){
      return name.replace(/启蒙/g,'精选')
    },
    // 分成3种  1、青莲云 对应的资源类型内容  2、喜马拉雅自己添加的专辑内容  3、链接到已有的排行榜之类的，需要加上openid
    goAlbum:function(item){
      console.log(item)
      if(item.category == 6){
          this.$router.push({path:'/album',query:{"category":item.category,"resource_type":4,"tag":item.tag}});
        }else if(item.category !== 0){
          this.$router.push({path:'/album',query:{"category":item.category,"resource_type":1,"tag":item.tag}});
        }else{
          if(item.path){
            this.$router.push({path:item.path,query:{openid:this.$store.state.openid}});
          }
        }
    },
    goWonder:function(){
      this.$router.push({path:"/wonder_tag",query:{openid:this.$store.state.openid}});
    },
    goSynCourse:function(){
      this.$router.push({path:"/syncourse",query:{openid:this.$store.state.openid}});
    },
    goXmly:function(){
      this.$router.push({path:"/xmly",query:{openid:this.$store.state.openid}});
    }
  }
}
</script>
<style scoped>
  .sub-item{
    display: inline-block;
    width: 25%;
    float: left;
    text-align: center;
    margin-bottom:.5rem;
  }
  .sub-item img{
    width: 4rem;
  }
  .item{
    overflow:hidden;
  }
  .item:after{
    content:'';
    display: block;
    height: 0;
    clear: both;
  }
  .title{
      font-size:1.6rem;
      margin-top:.6rem;
  }
  .special{
        /* margin-top: 3rem;  */
        overflow: hidden;
        padding: .3rem .5rem;
        border-top: 1rem solid rgb(245,245,245);
        border-bottom: .7rem solid rgb(245,245,245);
    }
    .special_item{
        display:inline-block;
        width:50%;
        float:left;
    }
    .special_item div{
        text-align: center;
        padding: .3rem .5rem;
    }
    .special_item h1{
        height: 5rem;
        line-height: 5rem;
        border-radius:1rem;
        font-weight: bold;
        padding-top: 1.2rem;
        color: rgba(245,255,255,.8);
    }
    @media screen and (width:320px){
        .special_item h1{
            line-height: 4.6rem;
        }
     }
    .wonder_why_module{
       position: relative;
       margin-top: -2rem;
       top: -1.1rem;
       font-size: 1.8rem;
       font-weight: bold;
       margin-right: 2.5rem;
    }
    @media screen and (width:320px){
         .wonder_why_module{
            position: relative;
            font-size: 1.5rem;
            font-weight: bold;
            margin-right: 2.5rem;
        }
     }
     @media screen and (min-width:360px){
         .wonder_why_module{
            position: relative;
            font-size: 1.7rem;
            font-weight: bold;
            margin-right: 2.5rem;
        }
     }
   .xmly_module{
        position: absolute;
        right: 5.9rem;
        font-weight: bold;
        line-height: 1.5rem;
        font-size: 1.8rem;
        letter-spacing: .16rem;
    }
    @media screen and (width:320px){
        .xmly_module{
            position: absolute;
            font-weight: bold;
            width: 8.5rem;
            line-height: 1.5rem;
            font-size: 1.5rem;
            letter-spacing: .16rem;
            margin-top: .5rem;
            margin-right: -1.5rem;
        }
     }
    @media screen and (min-width:360px){
        .xmly_module{
            right: 5.2rem;
            margin-top:.8rem;
            margin-right:1rem;
            font-size:1.7rem;
        }
     }
    @media screen and (min-width:375px){
        .xmly_module{
            position: absolute;
            font-weight: bold;
            line-height: 1.5rem;
            font-size: 1.7rem;
            letter-spacing: .16rem;
            margin-right: .4rem;
            margin-top:.7rem;
        }
     }
     @media screen and (min-width:400px){
        .xmly_module{
            position: absolute;
            font-weight: bold;
            line-height: 1.5rem;
            font-size: 1.8rem;
            letter-spacing: .16rem;
            margin-right: .9rem;
            margin-top:.7rem;
        }
     }
     @media screen and (min-width:1920px){
        .xmly_module{
          margin-right:1rem;
        }
     }

    .wonder_bg{
       background: url(../../../../../images/wonder_why_bg.png) center center no-repeat;
       background-size:100%;
    }
     .xmly_bg{
        background: url(../../../../../images/xmly_bg.png) center center no-repeat;
        background-size:100%;
     }
</style>