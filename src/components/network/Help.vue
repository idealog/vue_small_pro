<template>
	<div style="margin-top:33vh">
	    <video autoplay loop controls width="100%">
	        <source src="https://www.cocheer.net/resource/public/video/test854x480.mp4" type="video/mp4">
	        <source src="https://www.cocheer.net/resource/public/video/test854x480.ogg" type="video/ogg">
	    </video>
	</div>
</template>

<script>
export default {
	name: 'Help',
	created() {
        this.checkIsChoosedProduct(this);
    },
}
</script>