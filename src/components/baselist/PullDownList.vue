<template>
<div class="guide main">
    <div class="base_list">
        <ul>
            <li class="haveMore" :class="{rotate: item.show}" @click="toggle(index)" v-for="(item, index) in list">
               <!--  <div class="item_body no_border">
                   <p class="icons" :style="{backgroundImage: 'url(' + require('../../../../images/' + item.icon) + ')'}"></p>
                   <h3>{{item.title}}</h3>
               </div> -->
                <transition name="slide">
                    <div class="ht0" v-if="item.show" @click.stop>
                        <div style="margin-left: 4.5rem">
                            <SecondList :s_list="item.s_list"></SecondList>
                        </div>
                    </div>
                </transition>
            </li>
        </ul>
    </div>
</div>
</template>
<script>
import '@/assets/css/base_list'
import SecondList from './SecondList'

export default {
    name: 'BaseList',
    components: {
        SecondList
    },
    data() {
        return {
            list:[
                {
                    title: '吃饭提醒',
                    icon: 'eat.png',
                    show: false,
                    s_list: ['吃饭'],
                },{
                    title: '起床提醒',
                    icon: 'get_up.png',
                    show: false,
                    s_list: ['起床'],
                },{
                    title: '好习惯',
                    icon: 'brush_tooth.png',
                    show: false,
                    s_list: [
                        '刷牙',
                        '洗澡',
                        '讲礼貌',
                        '上学校',
                        '上楼梯',
                        '不打岔',
                        '不挑食',
                        '不淘气',
                        '不碰电',
                        '不赖床',
                        '乘电梯',
                        '做家务',
                        '做操',
                        '分果果',
                        '刷牙',
                        '剪指甲',
                        '勤洗手',
                        '叠被子',
                        '学习好习惯',
                        '学穿衣',
                        '对不起',
                        '拉钩钩',
                        '接电话',
                        '早早睡',
                        '洗澡',
                        '浇花',
                        '甜嘴巴',
                        '看医生',
                        '自己做',
                        '认真听讲',
                        '讲卫生',
                        '讲礼貌',
                        '谢谢你，不客气',
                        '跳绳歌',
                        '轻轻地敲门',
                        '过马路',
                    ],
                },
            ],
        };
    },
    methods: {
        toggle(i){
            this.list.forEach((item, index) => {
                if(index !== i){
                    this.list[index].show = false;
                }else{
                    this.list[i].show = !this.list[i].show;
                }
            });
        },
    }
}
</script>
<style type="text/css" scoped>
.base_list li{
    height: auto;
    position: relative;
}
.base_list .item_body{
    z-index: 2;
    position: relative;
}
.base_list .ht0{
    z-index: 1;
    position: relative;
}
.base_list li .ht0:before{
    content: "";
    float: left;
    border-bottom: 1px solid #eee;
    width: 100%;
    margin-top: 0px;
}
.base_list .haveMore:before, .sp_list .haveMore:before{
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    transform:rotate(90deg);
    margin-right: 1rem;
}
.base_list li.rotate:before{
    transform:rotate(270deg);
    -webkit-transform:rotate(270deg);
}
.base_list li .icons{
    float: none;
    display: inline-block;
    position: relative;
    margin-bottom: .4rem;
    margin-right: 1rem;
    background-size: 100%;
}
.base_list h3{
    float: none;
    line-height: normal;
    position: absolute;
    top:2.3rem;
    display: inline-block;
}
/*下拉过渡无法解决z-index问题*/
/* .slide-enter-active {
    animation-name: slide-down;
    animation-duration: .3s;
    animation-timing-function: linear;
}
.slide-leave-active {
    animation-name: slide-up;
    animation-duration: .3s;
    animation-timing-function: linear;
}
@keyframes slide-down {
  0% {
    transform: translateY(-100%);
  }
  50% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes slide-up {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(-100%);
  }
} */
</style>