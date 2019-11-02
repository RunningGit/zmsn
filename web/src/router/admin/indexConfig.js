export var indexConfigRouter =
[
  {
    path: 'zmnysnIndexConfig',
    redirect: '/admin/zmnysnIndexConfig',
    meta: {
      title: '首页配置'
    },
    name: 'zmnysnIndexConfig',
    component: resolve => require(['@/views/admin/container'], resolve),
    // component: resolve => require(['@/views/admin/apply/applyList'], resolve),
    children: [
      {
        path: '/',
        meta: {
          title: '首页配置'
        },
        name: 'pageConfig',
        component: resolve => require(['@/views/admin/pageConfig/indexConfig'], resolve)
      }
    ]
  },
  {
    path: 'zmnysnActivityIndexConfig',
    redirect: '/admin/zmnysnActivityIndexConfig',
    meta: {
      title: '活动列表配置'
    },
    name: 'zmnysnActivityIndexConfig',
    component: resolve => require(['@/views/admin/container'], resolve),
    // component: resolve => require(['@/views/admin/apply/applyList'], resolve),
    children: [
      {
        path: '/',
        meta: {
          title: '活动列表配置'
        },
        name: 'pageConfig',
        component: resolve => require(['@/views/admin/pageConfig/indexActivityConfig'], resolve)
      }
    ]
  }
]
