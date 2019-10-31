<template>
  <i :class="`dy-icon iconfont icon-${type}`"
    @click="handleClick"></i>
</template>

<script type="text/javascript">
/**
 * icon组件
 * @example
 * <icon type="lock" />
 */

import '../theme-default/icon.less'
export default {
  name: 'dy-icon',
  props: {
    /**
     * icon图标名
     */
    type: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>
