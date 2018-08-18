import axios from 'axios'
import Path from './path'
//利用axios封装ajax 如果想要更加丰富的ajax 需要写出原生的ajax方法
const requestAjaxData = (url = '' , params = {}, method = 'get') => {
	switch(method){
		case 'get':
			return axios({url,params,method})
			break
		case 'post':
			const data = params
			return axios({url,data,method})
	}
}
//获取资源类别
export const getCategoryList = (page = 1, limit = 100) => {
	return requestAjaxData(Path.getCategoryList, {page,limit}, 'get')
}
//获取专辑
export const getAlbumListByTag = (page=1,limit = 20, category_id) => {
	return requestAjaxData(Path.getAlbumListByTag, {page,limit,category_id}, 'get')
}
//通过专辑ID获取音频列表
export const getAudiosByAlbumId = (page = 1,limit = 20, album_id) => {
	return requestAjaxData(Path.getAudiosByAlbumId, {page,limit,album_id}, 'get')
}
//通过专辑ID获取专辑详情
export const getAlbumDetailByAlbumId = (album_id) => {
	return requestAjaxData(`${Path.getAlbumDetailByAlbumId}/${album_id}`, {}, 'get')
}
//生成声波接口
export const genSoundWaveByteArray = (ssid, pwd, openid) => {
	return requestAjaxData(`Path.genSoundWaveByteArray`, {ssid, pwd, openid}, 'post')
}
//获取绑定状态
export const getBindStatus = (openid) => {
	return requestAjaxData(Path.getBindStatus,{openid},'get')
}
//关注的时候注册用户
export const registerUser = (openid) => {
	return requestAjaxData(Path.registerUser,{openid},'post')
}
//解绑用户
export const unBind = (openid) => {
	return requestAjaxData(Path.unBind, {openid}, 'post')
}
//获取绑定设备列表
export const getBindDeviceList = (openid) => {
	return requestAjaxData(Path.getBindDeviceList, {openid}, 'post')
}
//收藏单曲
export const collectAudio = (openid, audio = {}) => {
	return requestAjaxData(Path.collectAudio, Object.assign({openid},audio), 'post')
}
//删除收藏单曲
export const deleteCollectedAudios = (openid, list=[], type='audio') => {
	return requestAjaxData(Path.deleteCollectedAudios, Object.assign({openid},list,type),'post')
}
//收藏专辑
export const collectAlbum = (openid) => {
	return requestAjaxData(Path.collectAlbum, {openid}, 'post')
}
//删除收藏专辑
export const deleteCollectedAlbums = (openid, list=[], type='album') => {
	return requestAjaxData(Path.deleteCollectedAudios, Object.assign({openid},{list}),'post')
}
//获取收藏单曲
export const getCollectedSongs = (openid) => {
	return requestAjaxData(Path.getCollectedSongs, {openid}, 'get')
}
//获取收藏专辑
export const getCollectedAlbums = (openid) => {
	return requestAjaxData(Path.getCollectedAlbums, {openid}, 'get')
}
//获取播放列表
export const getPlayingList = (openid) => {
	return requestAjaxData(Path.getPlayingList, {openid}, 'get')
}
//添加单曲到播放列表
export const addSongToPlayingList = (openid, song_obj = {}) => {
	return requestAjaxData(Path.addSongToPlayingList, Object.assign({openid},song_obj), 'post')
}
//删除播放列表中某个单曲
export const deleteSongFromPlayingList = (openid, song_obj = {}) => {
	return requestAjaxData(Path.deleteSongFromPlayingList, Object.assign({openid},song_obj), 'post')
}
//设置头像/昵称/生日/性别
export const setUserInfo = (openid, info = {}) => {
	return requestAjaxData(Path.setUserInfo, Object.assign({openid},info), 'post')
}
//获取 头像/昵称/生日/性别
export const getUserInfo = (openid) => {
	return requestAjaxData(Path.getUserInfo, {openid}, 'post')
}
//获取足迹
export const getDialogList = (openid) => {
	return requestAjaxData(Path.getDialogList, {openid}, 'get')
}
//删除足迹
export const deleteDialogList = (openid) => {
	return requestAjaxData(Path.deleteDialogList, {openid}, 'post')
}
//获取家庭成员
export const getFamilyMemberList = (openid) => {
	return requestAjaxData(Path.getFamilyMemberList, {openid}, 'get')
}
//获取家庭成员详情
export const getFamilyMemberDetail = (openid) => {
	return requestAjaxData(Path.getFamilyMemberDetail, {openid}, 'get')
}
//邀请加入家庭成员
export const inviteFamilyMember = (openid) => {
	return requestAjaxData(Path.inviteFamilyMember, {openid}, 'post')
}
//获取我的提醒列表
export const getRemindList = (openid) => {
	return requestAjaxData(Path.getRemindList, {openid} , 'get')
}
//我的提醒添加
export const addRemind = (openid, info = {}) => {
	return requestAjaxData(Path.addRemind, Object.assign({openid},info), 'post')
}
//我的提醒删除
export const deleteRemind = (openid, info={}) => {
	return requestAjaxData(Path.deleteRemind, Object.assign({openid},info), 'post')
}
//获取我的反馈
export const getFeedBack = (openid) => {
	return requestAjaxData(Path.getFeedBack, {openid}, 'get')
}
//添加反馈
export const addFeedBack = (openid) => {
	return requestAjaxData(Path.addFeedBack, {openid}, 'post')
}
