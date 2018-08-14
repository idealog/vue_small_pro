/**
 *  base on vue2-toast-sample 1.2.0
 *  https://www.npmjs.com/package/vue2-toast-sample
 */
var Toast = {};
var showToast = false;      // 存储toast显示状态

Toast.install = function (Vue, options) {
    var opt = {
        duration:'1000'
    };
    for(var property in options){
        opt[property] = options[property];
    }
    Vue.prototype.$toast = function(tips){
        var toastTpl = Vue.extend({
            data: function(){
                return {
                    show: showToast,
                    tips: tips
                }
            },
            template: '<transition name="toast"><div v-show="show" class="lx-toast lx-toast-center">' + '{{tips}}' + '</div></transition>'
        });
        var vm = new toastTpl()
        if(!Vue.prototype._toast){
            Vue.prototype._toast = vm
                  // 挂载节点
            var tpl = Vue.prototype._toast.$mount().$el;
            // 将挂载好的节点append到body内
            document.body.appendChild(tpl); //只挂载一次
        }
        Vue.prototype._toast.tips = tips
        Vue.prototype._toast.show = showToast = true;
        setTimeout(function () {
            Vue.prototype._toast.show = showToast = false;
        }, opt.duration)
    };
}
module.exports = Toast;