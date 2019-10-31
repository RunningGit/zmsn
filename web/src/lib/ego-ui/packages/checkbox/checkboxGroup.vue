<template>
  <div class="dy-checkbox-group"
    :class="{'dy-checkbox-disabled': disabled}">
    <slot></slot>
  </div>
</template>

<script type="text/javascript">
/**
 * checkbox-group
 * @example
 * checkedList => ['男', '女']
 * <dy-checkbox-group v-model="checkedList">
 *    <dy-checkbox data="男">男</dy-checkbox> => checked
 *    <dy-checkbox data="女">女</dy-checkbox> => checked
 *    <dy-checkbox data="人妖">人妖</dy-checkbox> => unChecked
 * </dy-checkbox-group>
 */
import '../theme-default/checkbox-group.less'
export default {
  name: 'dy-checkbox-group',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    /**
     * v-model值
     */
    value: Array,
    /**
     * 是否全部禁用
     */
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
