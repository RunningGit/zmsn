<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<style lang="less">
/* 引入公共样式 */
@import '~@/assets/style/common/common';
/* 引入字体库 */
@import '~@/assets/icon/iconfont'; //引入font-icon
</style>
<script type="text/ecmascript-6">
// 使用svg矢量图的方式来解决图片缩放导致的模糊的问题
// import icon from './assets/icon/iconfont.js'
export default {
  name: 'App',
  data() {
    // 变量定义
    return {}
  },
  methods: {
    // 兼容IE9浏览器下input删除无效的问题
    ie9OnIput(d) {
      if (navigator.userAgent.indexOf('MSIE 9') === -1) return
      d.addEventListener('selectionchange', function() {
        var el = d.activeElement
        if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
          var ev = d.createEvent('CustomEvent')
          ev.initCustomEvent('input', true, true, {})
          el.dispatchEvent(ev)
        }
      })
    }
  },
  created() {
    this.ie9OnIput(document)
  }
}
</script>
