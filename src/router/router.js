const Index = r => require.ensure([], () => r(require('@/components/index')), 'index') //故事云首页
const AlbumList = r => require.ensure([], () => (require('@/components/common/AlbumListNew')) , 'AlbumList')
const SongListNew = r => require.ensure([], () => r(require('@/components/common/SongListNew')), 'SongListNew') // 歌曲列表
export default [
	{
        path:'/index',
        name:'index',
        component:Index,
        meta: {
            title:'故事云',
            keepAlive: false //不缓存故事云首页
        }
    },
    {
        path:'/album',
        component: AlbumList,
        meta: {
            title:'专辑列表',
            keepAlive: true  //缓存
        }
    },
    {
        path:'/songlist',
        component:SongListNew,
        meta:{
            title:'单曲列表',
            keepAlive: true //缓存
        }
    },
    {
        path:'/player',
        component: resolve　=> require(['@/components/common/propellingplayer/Player'],resolve) //这种写法需要render 挂载
    },
    {
        path:'/robot',
        component: resolve　=> require(['@/components/common/robot/Robot'],resolve) 
    },
    {
        path:'/robot/devicemanage',
        component: resolve　=> require(['@/components/common/robot/devicemanage/DeviceManage'],resolve) 
    },
    {
        path:'/robot/babyinfo',
        component: resolve　=> require(['@/components/common/robot/babyinfo/BabyInfo'],resolve) 
    },
    {
        path:'/robot/childlock',
        component: resolve　=> require(['@/components/common/robot/childlock/ChildLock'],resolve) 
    },
    {
        path:'/robot/collect',
        component: resolve　=> require(['@/components/common/robot/collect/MyCollected'],resolve) 
    },
    {
        path:'/robot/collect/deletesonglist',
        component: resolve　=> require(['@/components/common/robot/collect/DeleteMyCollectedSongList'],resolve) 
    },
    {
        path:'/robot/collect/deletealbumlist',
        component: resolve　=> require(['@/components/common/robot/collect/DeleteMyCollectedAlbumList'],resolve) 
    },
    {
        path:'/robot/collect/getsonglistbycollectedalbum',
        component: resolve　=> require(['@/components/common/robot/collect/GetSongListByCollectedAlbum'],resolve) 
    },
    {
        path:'/robot/familymember',
        component: resolve　=> require(['@/components/common/robot/familymember/FamilyMember'],resolve) 
    },
    {
        path:'/robot/feedback',
        component: resolve　=> require(['@/components/common/robot/feedback/FeedBack'],resolve) 
    },
    {
        path:'/robot/babyhead',
        component: resolve　=> require(['@/components/common/robot/babyinfo/SetBabyHead'],resolve) 
    }, 
    {
        path:'/robot/footprint',
        component: resolve　=> require(['@/components/common/robot/footprint/FootPrint'],resolve)
    },
	{ path: "/", redirect: '/index' }
]