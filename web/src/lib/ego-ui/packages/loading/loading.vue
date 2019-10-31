<template>
  <div class="dy-loading"
    v-show="isShow"
    :style="{position: type === 'directive' ? 'absolute' : 'fixed'}">
    <div class="dy-loading-warpper">
      <div class="dy-loading-animation">
        <div class="point point1"></div>
        <div class="point point2"></div>
        <div class="point point3"></div>
        <div class="point point4"></div>
      </div>
      <div class="dy-loading-title">
        <slot>{{ text }}</slot>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
/**
 * loading组件
 * @example
 * <div v-dyloading="{isLoading: isClassifyLoading, title: '努力加载中...'}"></div>
 * export default {
 *   data() {
 *     return {
 *       isClassifyLoading: false
 *     }
 *   }
 * }
 */
import '../theme-default/loading.less'
export default {
  name: 'dy-loading',
  data() {
    return {
      /**
       * loading显示和隐藏
       */
      isShow: false
    }
  },
  props: {
    /**
     * 修改默认加载文字
     */
    title: {
      type: String,
      default: '加载中...'
    }
  },
  computed: {
    text() {
      return this.title || '加载中...'
    }
  }
}
</script>
