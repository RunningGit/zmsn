<template>
  <label class="dy-checkbox"
    :class="{'dy-checked': isChecked, 'dy-disabled': disabled}">
    <span class="dy-checkbox-input">
      <input type="checkbox"
        :value="data"
        :disabled="disabled"
        v-bind="$attrs"
        @change="handleChange" />
      <i class="dy-icon iconfont"
        :class="isChecked ? 'icon-checkbox-check' : 'icon-checkbox'"></i>
    </span>
    <span class="dy-checkbox-text">
      <slot></slot>
    </span>
  </label>
</template>

<script type="text/javascript">
/**
 * checkbox
 * @example
 * isChecked => false
 * <dy-checkbox :value="true">男</dy-checkbox> => checked
 * <dy-checkbox v-model="isChecked">女</dy-checkbox> => unChecked
 * more see checkbox-group
 */
import '../theme-default/checkbox.less'
export default {
  name: 'dy-checkbox',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    /**
     * 非 checkbox-group 下 v-model 值
     */
    value: {
      type: Boolean,
      default: false
    },
    /**
     * checkbox 值 (checkbox-group 下)
     */
    data: {
      type: [String, Number, Boolean]
    },
    /**
     * checkbox 是否禁用状态
     */
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      /**
       * checkbox-group v-model值存储
       */
      groupValue: []
    }
  },
  computed: {
    /**
     * 是否有 checkbox-group
     */
    isGroup() {
      let parent = this.$parent
      while (parent) {
        if (parent.$options._componentTag !== 'dy-checkbox-group') {
          parent = parent.$parent
        } else {
          return true
        }
      }
      return false
    },
    /**
     * 是否 checked
     */
    isChecked() {
      return this.isGroup
        ? (this.groupValue || []).includes(this.data)
        : this.value
    }
  },
  methods: {
    /**
     * checked or not checked
     */
    handleChange(ev) {
      if (this.disabled || this.$parent.disabled) return
      let lable = this.$slots.default ? this.$slots.default[0].text : null
      if (this.isGroup) {
        if (this.groupValue.indexOf(this.data) === -1) {
          this.$parent.$emit(
            'change',
            (this.$parent.value || []).concat(ev.target._value)
          )
        } else {
          this.$parent.$emit(
            'change',
            this.$parent.value.filter(item => item !== ev.target._value)
          )
        }
      } else {
        this.$emit('change', !this.value, this.data, lable)
      }
    }
  },
  mounted() {
    if (this.isGroup) {
      this.groupValue = this.$parent.value || []
    }
  },
  watch: {
    '$parent.value'() {
      this.groupValue = [...this.$parent.value]
    }
  }
}
</script>
