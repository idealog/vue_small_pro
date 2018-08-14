<template>
	<div>
		<audio :src="audio_url" ref="audio">
			
		</audio>
	</div>
</template>
<script>
	export default {
		props:['audio_url'],
		data() {
			return {

			}
		},
		mounted(){

		},
		methods:{
			control(value){
				const _ = this
				if(value === 'play'){
					this.$refs.audio.addEventListener('canplay',function(e){
						_.$refs.audio.play()
						_.$emit('canplay',true)
					})
				}else{
					_.$refs.audio.pause()
					_.$emit('pause',true)
				}
			}
		}
	}
</script>