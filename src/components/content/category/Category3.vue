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

      ],
    }
  },
  mounted(){
    //todo
  },
  methods:{


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