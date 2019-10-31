import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import vui from './unit/vui'
import 'mint-ui/lib/style.css'
// import 'lib-flexible'
import { httpPost } from '@/unit/axios'
import { MessageBox } from 'mint-ui';
import './style.less';

require('./lib/browser-ua');

(async function () {
  Vue.config.productionTip = false
  Vue.use(VueRouter)

  Vue.prototype.$isDesktop = window.__UA__.default.isDesktop;

  if(!Vue.prototype.$isDesktop) {
    vui.responsive()
  }

  new Vue({
    router,
    render: h => h(App),
  }).$mount('#app')
})()