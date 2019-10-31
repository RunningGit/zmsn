/**
 * 全站路由配置入口
 * tips:
 * 1、通过concat合并子路由内容
 * 2、代码中路由统一使用name属性跳转(不使用path属性)
 */

import Vue from 'vue'
import Router from 'vue-router'

// 引入首页路由文件
import index from './index/index'
// 引用后台路由文件
import admin from './admin'

Vue.use(Router)
// 定义路由集合
let mainRoutes = [].concat(index).concat(admin)

const router = new Router({
  // mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }), // 滚动条置顶
  linkActiveClass: 'active',
  routes: mainRoutes
})

export default router
