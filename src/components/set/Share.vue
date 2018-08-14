<template>
	<div class="main">
        <div class="my_title top_bg share" style="height:18rem;">
        	<div class="my_head">
            	<img :src="head_img" width="100%"/>
            </div>
            <p>{{this.$route.query.nickname}}<br>邀请您加入家庭群聊</p>
        </div>
        <div class="wave mt1"></div>
        <div class="share_msg" style="margin-top: 9rem;">
        	<Qrcode :value="qrcode" :size="180" className="hide"></Qrcode>
        	<img :src="qrcode_url" class="{hide: !qrcode_url}">
        	<br>长按识别二维码关注公众号<br>即可绑定设备               	            
        </div>
    </div>
</template>

<script>
import Qrcode from 'qrcode.vue'	//https://www.npmjs.com/package/qrcode.vue
export default {
	name: 'Share',
	components: {
        Qrcode,
	},
	data () {
		return {
			head_img: this.$route.query.head_img ? this.$route.query.head_img : 'http://www.cocheer.net/resource/public/img/0.jpg',
			qrcode: this.$route.query.qrcode,
			qrcode_url: '',
		}
	},
	mounted() {
		this.getQrcodeImg();
	},
	methods: {
		getQrcodeImg() {
			this.qrcode_url = document.querySelector("canvas").toDataURL("image/png");
		}
	}
}
</script>