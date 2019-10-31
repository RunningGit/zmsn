/**
 * 前台官网路由
 */
var router = [
  //   {
  //   path: '/',
  //   redirect: '/index',
  //   component: resolve => require(['@/views/index/container'], resolve),
  //   children: [{
  //     path: 'index',
  //     title: '首页',
  //     name: 'index',
  //     component: resolve => require(['@/views/index/index/index'], resolve)
  //   }]
  // },
  {
    path: '/',
    name: 'login',
    component: resolve => require(['@/views/index/login'], resolve)
  },
  {
    path: '*',
    component: resolve => require(['@/views/error/404'], resolve)
  }
]
export default router
