const TEST_SERVER = 'http://xxx //'
export default {
	getCategoryList:`${TEST_SERVER}/categories`,
	getAlbumListByTag:`${TEST_SERVER}/cocheer_albums`,
	getAudiosByAlbumId:`${TEST_SERVER}/audios`,
	getAlbumDetailByAlbumId: `${TEST_SERVER}/cocheer_albums`,

	genSoundWaveByteArray: '/genSoundWaveByteArray',

	getBindStatus:'/bindStatus',
	registerUser: '/registerUser',
	unBind: '/unBind',

}