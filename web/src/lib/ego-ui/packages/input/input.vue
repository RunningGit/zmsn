<template>
  <div :class="[
        type === 'textarea' ? 'dy-textarea' : 'dy-input',
        {
            'dy-disabled': disabled
        }
    ]">
    <!-- textarea -->
    <template v-if="type === 'textarea'">
      <textarea ref="dyInput"
        :value="propValue"
        :style="{'width': `${width}px`}"
        :maxlength="maxlength"
        :disabled="disabled"
        v-bind="$attrs"
        v-on="inputActions" />
      <span v-if="placeholder"
        v-show="!propValue && propValue !== 0"
        class="dy-input-placeholder" @click="handleFocus">
        {{placeholder}}
      </span>
      </template>
    <!-- input -->
    <template v-else>
      <span v-if="prefixIcon"
        class="dy-icon-fix dy-input-prefix-icon"
        @click="prefixAction">
        <i :class="`dy-icon iconfont icon-${prefixIcon}`"></i>
      </span>
      <span v-if="placeholder"
        v-show="!propValue && propValue !== 0"
        class="dy-input-placeholder" @click="handleFocus">
        {{placeholder}}
      </span>
      <input ref="dyInput"
        :type="type"
        :class="[`dy-input-${size}`, {'dy-input-suffix': suffixIcon,'dy-input-clear': clearable}]"
        :style="{'width': `${width}px`}"
        :value="propValue"
        :autocomplete="autoComplete"
        :maxlength="maxlength"
        :disabled="disabled"
        v-bind="$attrs"
        v-on="inputActions" />
      <span v-if="suffixIcon"
        class="dy-icon-fix dy-input-suffix-icon"
        @click="suffixAction">
        <i :class="`dy-icon iconfont icon-${suffixIcon}`"></i>
      </span>
      <i v-if="clearable && !disabled"
        v-show="propValue"
        class="dy-icon iconfont icon-danger"
        @click="clearValue"></i>
    </template>
  </div>
</template>

<script type="text/javascript">
/**
 * input | textarea
 * @example
 * <dy-input v-model="value" />
 */
import '../theme-default/input.less'
export default {
  name: 'dy-input',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    /**
     * 类型，包括'text'、'textarea'等原生属性
     */
    type: {
      type: String,
      default: 'text'
    },
    /**
     * 输入框宽度
     */
    width: [Number, String],
    /**
     * placeholder
     */
    placeholder: {
      type: String,
      default: null
    },
    /**
     * 自动填充
     */
    autoComplete: {
      type: String,
      default: 'off'
    },
    /**
     * 为了兼容ie9。。。好气啊
     */
    maxlength: [Number, String],
    /**
     * 输入框前后图标
     */
    prefixIcon: {
      type: String,
      default: null
    },
    suffixIcon: {
      type: String,
      default: null
    },
    /**
     * 是否禁用
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * 大小
     */
    size: {
      type: [String, Number],
      default: 'default'
    },
    /**
     * 输入框值
     */
    value: [String, Number],
    /**
     * 是否可清空
     */
    clearable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 输入框值
      propValue: this.value
      // 输入框组合
      // composing: false
    }
  },
  computed: {
    /**
     * vue 原生行为
     */
    inputActions() {
      return Object.assign({}, this.$listeners, {
        input: event => {
          let value = this.maxlength
            ? event.target.value.substr(0, this.maxlength)
            : event.target.value
          // maxlength限制输入
          event.target.value = value

          this.propValue = value
          this.$emit('input', value)
        }
      })
    }
  },
  methods: {
    /**
     * 前缀图标事件
     */
    prefixAction(e) {
      if (this.disabled) return
      this.$emit('prefix-action', e)
    },
    /**
     * 后缀图标事件
     */
    suffixAction(e) {
      if (this.disabled) return
      this.$emit('suffix-action', e)
    },
    /**
     * 清空数值
     */
    clearValue(e) {
      this.propValue = ''
      this.$emit('input', '')
    },
    /**
     * 解决ie9下兼容问题
     */
    handleFocus() {
      this.$refs.dyInput.focus()
    }
    /**
     * 处理中文输入法
     */
    //  @compositionstart="startCHN" @compositionend="endCHN"
    // startCHN(e) {
    //   this.composing = true
    // },
    // endCHN(e) {
    //   this.composing = false
    // }
  },
  watch: {
    value(newValue) {
      this.propValue = newValue
    }
  }
}
</script>
