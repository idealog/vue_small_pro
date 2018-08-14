<template>
	<!-- <div>
		<div style="height:45vh;overflow:hidden;" @click="choose('波哥')"><img src="../../assets/img/product.png"></div>
		<div style="height:55vh;overflow:hidden;" @click="choose('巴布')"><img src="../../assets/img/product.png" style="margin-top: -45vh"></div>
	</div> -->
</template>

<script>
export default {
	name: 'Choose',
	data () {
		return {
			set_url: '/api/v1/base/set',
		  	next_page: this.$route.query.page,
		}
	},
	created() {
		document.title = '请选择';
	},
	methods: {
		choose(name) {
			this.LStorage.setItem('product_name', `{this.customer}`);

            // 此时选择产品不传给后台，仅保存在本地
            if(this.next_page){
            	this.$router.push(`${this.next_page}?openid=${this.$route.query.openid}`);
            	return;
            }

			this.axios({
				method: 'post',
                url: `${this.HOST}${this.set_url}`,
                data: {
	            	openid: this.$route.query.openid,
	                product_name: name,
	            },
            })
            .then(res => {
            	if(window.history.length > 1){
        			window.history.back();
        			window.location.reload();
				}else{
					this.$toast(res.data.message);
				}
            }).catch(e => {
          //   	if(this.next_page){
        		// 	this.$router.push(this.next_page);
        		// }else{
        		// 	location.href = `../../babyinfo?openid=${this.$route.query.openid}`;
        		// }
            });
		}
	}
}
</script>
<style type="text/css" scoped>
	img{
		width: 100%;
	}
</style>