<template>
  <label class="dy-radio-button"
    :class="{'dy-checked': isChecked,'dy-disabled': disabled}">
    <span class="dy-radio-button-input">
      <input type="radio"
        :checked="isChecked"
        :value="data"
        v-bind="$attrs"
        @change="handleChange" />
      <i class="dy-icon iconfont"
        :class="isChecked ? 'icon-radio-check' : 'icon-radio'"></i>
    </span>
    <span class="dy-radio-button-text">
      <slot></slot>
    </span>
  </label>
</template>

<script>
import '../theme-default/radio-button.less'
export default {
  name: 'dy-radio-button',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Number]
    },
    data: {
      type: [String, Number, Boolean]
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      groupValue: null
    }
  },
  computed: {
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
    isChecked() {
      return this.isGroup
        ? this.groupValue === this.data
        : this.value === this.data
    }
  },
  methods: {
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
