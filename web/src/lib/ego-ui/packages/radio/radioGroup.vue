<template>
  <div class="dy-radio-group"
    :class="{'dy-disabled': disabled}">
    <slot></slot>
  </div>
</template>

<script type="text/javascript">
import '../theme-default/radio-group.less'
export default {
  name: 'dy-radio-group',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // v-model 绑定值
    value: {
      type: [String, Number],
      default: null
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
