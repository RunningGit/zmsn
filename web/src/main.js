// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 浏览器兼容
import 'babel-polyfill'
import Vue from 'vue'

// 引入道一UI
// import Do1Ui from 'do1-ui-beta'
// import 'do1-ui-beta/lib/theme-default/index.css'
import Do1Ui from 'ego-ui'
import 'ego-ui/lib/theme-default/index.css'

// 本地ego组件库
// import Do1Ui from './lib/ego-ui/packages'

import App from './App'
import router from './router'

// vuex
import store from './vuex/store'

// element-ui
import './element-ui/index'

// 公用组件
import CommonComponents from './views/admin/common'

// 国际化
import VueI18n from 'vue-i18n'

// 引入公共脚本
import '@/utils/until.js'

// 道一UI全局注册
Vue.use(Do1Ui)
Vue.use(CommonComponents)
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh', // 语言标识
  // this.$i18n.locale = 'en';// 切换语言包
  messages: {
    zh: require('./lang/zh'), // 中文语言包
    en: require('./lang/en') // 英文语言包
  }
})

// 关闭提示
Vue.config.productionTip = false

/* eslint-disable no-new */
top.vm = new Vue({
  el: '#app',
  i18n,
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})
