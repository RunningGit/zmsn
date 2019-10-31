<template>
  <button type="button"
    class="dy-btn"
    :class="[`dy-btn-${type}`, `dy-btn-${size}`, {'dy-disabled': disabled, 'dy-outline': outline, 'dy-circle': circle, 'dy-btn-loading': loading}]"
    :disabled="disabled"
    @click="(() => throttle ? handleThrottleClick : handleClick)()">
    <dy-icon v-if="icon && !loading"
      :type="icon" />
    <dy-icon v-if="loading"
      type="loading"
      :class="[{'dy-icon-loading': loading}]" />
    <span v-if="this.$slots.default">
      <slot></slot>
    </span>
  </button>
</template>

<script type="text/javascript">
/**
 * button组件
 * @example
 * <dy-button type="primary" size="large" icon="user-o" @click="btnClick">按钮</dy-button>
 */
import '../theme-default/button.less'
import DyIcon from '../icon/icon'
let startTiming = Date.now()
export default {
  name: 'dy-button',
  components: {
    DyIcon
  },
  props: {
    throttle: {
      type: Number,
      default: 100
    },
    /**
     * 按钮类型，'default','info','primary','warning','success','danger', 'text'等
     */
    type: {
      type: String,
      default: 'default'
    },
    /**
     * 按钮长度，'large', 'normal', 'small'
     */
    size: {
      type: String,
      default: 'normal'
    },
    /**
     * 按钮是否圆形
     */
    circle: {
      type: Boolean,
      default: false
    },
    /**
     * 按钮是否禁用
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * 按钮是否处于loading状态
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * 按钮icon
     */
    icon: {
      type: String,
      default: ''
    },
    /**
     * 按钮实心还是空心，默认是实心
     */
    outline: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * 按钮点击事件
     * @param e
     */
    handleClick(e) {
      if (!this.disabled && !this.loading) return
      this.$emit('click', e)
    },
    /**
     * 按钮点击事件 - 节流
     * @param e
     */
    handleThrottleClick(e) {
      if (this.disabled || this.loading) return
      let endTiming = Date.now()
      if (endTiming - startTiming >= this.throttle) {
        this.$emit('click', e)
        startTiming = Date.now()
      }
    }
  }
}
</script>
