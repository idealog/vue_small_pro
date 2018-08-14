<template>
  <div>
    <div class="pop_root" :class="{show:show,hide:hide}">
      <div class="pop_bg" @click.stop="cancel" v-show="show">
        <div class="pop_box"   :class="{center:type == 'center',bottom: type == 'bottom'}" @click.stop>
            <div class="pop_tit">{{title}}</div>
            <div class="loading" :class="{hide: is_success || is_fail}">
              <div class="left"><span v-bind:style='{transform:`rotateZ(${this.left}deg)`}'></span></div>
              <div class="right" ><span v-bind:style='{transform:`rotateZ(${this.right}deg)`}'></span></div>
              <div class="progress"><span>{{percent}}</span>%</div>
            </div>
            <div  v-show="is_success" style="margin-bottom:2rem;">
              <center><p class="uicon success" ></p><p>升级成功！</p></center>
            </div>
            <div v-show="is_fail" style="margin-bottom:2rem;">
              <center><p class="uicon fail"></p><p>升级失败，请重新尝试</p></center>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['title','content','ok_btn','cancel_btn','type'],
    data() {
      return {
        show: true,
        hide: false,
        isFinish: false,
        total_time:180,  //总时间180s
        timer:'', // 定时器
        left:-180,
        right:-180,
        rotate_left:'',
        rotate_right:'',
        percent:0,
        is_success:'', //成功升级
        is_fail:''    //升级失败
      }
    },
    mounted() {
      this.init()
    },
    methods:{
      init() {
        const This = this
        this.timer = setInterval(() => {
          if(This.$store.state.ota === 3){
            This.is_fail = true
            This.$emit('upgrade_fail')
            clearInterval(This.timer)
          }
          if(This.right < 0){
            This.right += 360 / This.total_time 
          }
          if(This.right >= 0) {
            This.left += 360 / This.total_time 
          }
          if(This.left >= 0 && This.$store.state.ota === 2) {
            This.is_success = true
            This.$emit('upgrade_success')
            clearInterval(This.timer)
          }
          if(This.percent >= 100){
            This.percent = 100
          }
          This.percent += 1
        },1000)
      }
    }
  }
</script>

<style scoped>
.hide{
  display: none;
}
.loading{
  margin: 0px auto;
  width: 150px;
  height: 150px;
  position: relative;
  /* background-color: #FFF; */
  background: #EAEEF2;
  margin-bottom:2rem;
  border-radius: 50%;
}
.progress{
  position: absolute;
  top: 50%;
  left: 50%;
  width: 130px;
  height: 130px;
  transform: translate(-50%,-50%);
  color: #7ED2A9;
  line-height: 130px;
  text-align: center;
  background-color: #FFF;
  border-radius: 50%;
}
.left,.right{
  float: left;
  width: 50%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.left span,.right span{
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color:red;
  transition: all 0.4s;
}
.left span{       
  border-radius:150px 0 0 150px;  
  transform-origin: right;
}
.right span{
  border-radius:0 150px 150px 0;
  transform-origin: left;
}



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