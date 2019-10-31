<template>
  <label class="dy-radio"
    :class="{'dy-checked': isChecked,'dy-disabled': disabled}">
    <span class="dy-radio-input">
      <input type="radio"
        :checked="isChecked"
        :value="data"
        v-bind="$attrs"
        @change="handleChange" />
      <i class="dy-icon iconfont"
        :class="isChecked ? 'icon-radio-check' : 'icon-radio'"></i>
    </span>
    <span class="dy-radio-text">
      <slot></slot>
    </span>
  </label>
</template>

<script>
import '../theme-default/radio.less'
export default {
  name: 'dy-radio',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // v-model绑定值
    value: {
      type: [String, Number]
    },
    // option值
    data: {
      type: [String, Number, Boolean]
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // radioGroup值
      groupValue: null
    }
  },
  computed: {
    /**
     * 是否有父级 radioGroup
     */
    isGroup() {
      let parent = this.$parent
      while (parent) {
        if (parent.$options._componentTag !== 'dy-radio-group') {
          parent = parent.$parent
        } else {
          return true
        }
      }
      return false
    },
    /**
     * 是否选中
     */
    isChecked() {
      return this.isGroup
        ? this.groupValue === this.data
        : this.value === this.data
    }
  },
  methods: {
    /**
     * 下拉选项改变触发
     */
    handleChange(ev) {
      if (this.disabled || this.$parent.disabled) return
      if (this.groupValue !== null || this.isGroup) {
        this.$parent.$emit(
          'change',
          ev.target._value,
          this.$slots.default[0].text
        )
      } else {
        this.$emit('change', ev.target._value)
      }
    }
  },
  mounted() {
    if (this.isGroup) {
      this.groupValue = this.$parent.value
    }
  },
  watch: {
    '$parent.value'() {
      this.groupValue = this.$parent.value
    }
  }
}
</script>
