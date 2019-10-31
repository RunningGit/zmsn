import Vue from 'vue'
import Router from 'vue-router'

import Index from './view/index/';

import ApplyIndex from './view/apply/index';
import ApplyForm from './view/apply/form/';
import ApplyResult from './view/apply/result/';
import ApplyList from './view/apply/list/';

import Progress from './view/progress/';

import Login from './view/login/';
import Register from './view/register/';

import Mine from './view/i/index';
import MineInfo from './view/i/info/';
import MineList from './view/i/list/';

import ActivityDetails from './view/activityDetails/'


Vue.use(Router)

const router = new Router({
  // mode: 'history',
  // base: process.env.NODE_NEV === 'dev' ? '' : '/appsStatic/', // 两边斜杠要加（PS: 打包生成到其他定制目录的时候要修改）
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Index,
      meta: {
        title: '寻找“最美南粤少年”系列活动',
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '登录',
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        title: '注册一号通账号',
      }
    },
    {
      path: '/apply',
      name: 'apply',
      component: ApplyIndex,
      meta: {
        title: '寻找“最美南粤少年”系列活动',
        curNav: 2
      },
    },
    {
      path: '/apply/form',
      name: 'applyForm',
      component: ApplyForm,
      meta: {
        title: '申报信息填写',
      },
      props: {
        showNav: 'true'
      }
    },
    {
      path: '/apply/result',
      name: 'applyResult',
      component: ApplyResult,
      meta: {
        title: '申报结果',
      }
    },
    {
      path: '/apply/list',
      name: 'applyList',
      component: ApplyList,
      meta: {
        title: '全部申报活动',
        curNav: 2,
      }
    },
    {
      path: '/progress',
      name: 'progress',
      component: Progress,
      meta: {
        title: '评审进度',
      }
    },
    {
      path: '/activity/details',
      name: 'activityDetails',
      component: ActivityDetails,
      meta: {
        title: '活动详情',
      }
    },
    {
      path: '/i',
      name: 'mine',
      component: Mine,
      meta: {
        title: '我的',
        curNav: 3
      }
    },
    {
      path: '/i/list',
      name: 'mineList',
      component: MineList,
      meta: {
        title: '个人信息',
      }
    },
    {
      path: '/i/info',
      name: 'mineInfo',
      component: MineInfo,
      meta: {
        title: '基本信息',
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  if(to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = '最美南粤少年';
  }
  next();
})

export default router;