const Index = r => require.ensure([], () => r(require('@/components/index')), 'index') //故事云首页
export default [
	{
        path:'/index',
        name:'index',
        component:Index,
        meta: {
            title:'xxx',
            keepAlive: false //
        }
    },
 
    {
        path:'/player',
        component: resolve　=> require(['@/components/common/propellingplayer/Player'],resolve) //这种写法需要render 挂载
    },

	{ path: "/", redirect: '/index' }
]