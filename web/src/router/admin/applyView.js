
export var applyViewRouter =
[{
  path: 'activityTemplate',
  redirect: '/admin/activityTemplate',
  meta: {
    title: '申报流程管理'
  },
  name: 'activityTemplate',
  component: resolve => require(['@/views/admin/container'], resolve),
  // component: resolve => require(['@/views/admin/apply/applyList'], resolve),
  children: [
    {
      path: '/',
      meta: {
        title: '申报流程管理列表'
      },
      name: 'applyList',
      component: resolve => require(['@/views/admin/applyView/applyList'], resolve)
    },
    // {
    //   path: 'southJuvenile',
    //   meta: {
    //     title: '南粤少年'
    //   },
    //   name: 'southJuvenile',
    //   component: resolve => require(['@/views/admin/apply/southJuvenile'], resolve)
    // },
    {
      path: 'applyViewTemplate',
      meta: {
        title: '活动配置模板'
      },
      name: 'applyViewTemplate',
      component: resolve => require(['@/views/admin/applyView/applyView'], resolve)
    }
  ]
} ]
