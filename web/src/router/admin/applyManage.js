export var applyManageRouter =
[{
  path: 'zmnysnApply1',
  redirect: '/admin/zmnysnApply1',
  meta: {
    title: '申报管理'
  },
  name: 'zmnysnApply1',
  component: resolve => require(['@/views/admin/container'], resolve),
  children: [
    {
      path: '/',
      meta: {
        title: '最美南粤少年'
      },
      name: 'zmnysn',
      component: resolve => require(['@/views/admin/applyManage/zmnysn/zmnysn'], resolve)
    }
  ]
},
{
  path: 'yxgqtyApply',
  redirect: '/admin/yxgqtyApply',
  meta: {
    title: '申报管理'
  },
  name: 'yxgqtyApply',
  component: resolve => require(['@/views/admin/container'], resolve),
  children: [
    {
      path: '/',
      meta: {
        title: '广东省优秀共青团员'
      },
      name: 'zmnysn',
      component: resolve => require(['@/views/admin/applyManage/yxgqty/yxgqty'], resolve)
    }
  ]
},
{
  path: 'yxsxdyApply',
  redirect: '/admin/yxsxdyApply',
  meta: {
    title: '申报管理'
  },
  name: 'yxsxdyApply',
  component: resolve => require(['@/views/admin/container'], resolve),
  children: [
    {
      path: '/',
      meta: {
        title: '广东省优秀少先队员'
      },
      name: 'zmnysn',
      component: resolve => require(['@/views/admin/applyManage/yxsxdy/yxsxdy'], resolve)
    }
  ]
} ]
