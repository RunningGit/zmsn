
export var applyRouter =
  [{
    path: 'zmnysnActivityApply',
    redirect: '/admin/zmnysnActivityApply',
    meta: {
      title: '申报流程管理'
    },
    name: 'zmnysnActivityApply',
    component: resolve => require(['@/views/admin/container'], resolve),
    // component: resolve => require(['@/views/admin/apply/applyList'], resolve),
    children: [
      {
        path: '/',
        meta: {
          title: '申报流程管理列表'
        },
        name: 'applyList',
        component: resolve => require(['@/views/admin/apply/applyList'], resolve)
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
        path: 'applyTemplate',
        meta: {
          title: '活动配置模板'
        },
        name: 'applyTemplate',
        component: resolve => require(['@/views/admin/apply/applyTemplate'], resolve)
      }
    ]
  } ]
