<template>
  <li v-show="!isFiltered"
    class="dy-select-list-option"
    :class="{'dy-option-selected': isSelected, 'dy-option-disabled': disabled}"
    @click.stop="handleSelect">
    <template v-if="hasSlot">
      <slot></slot>
    </template>
    <template v-else>
      <dy-checkbox v-if="isMultipleSelect"
        v-model="optionChecked"
        :data="value"
        :disabled="disabled"
        @change="handleMultipleSelect">{{label}}</dy-checkbox>
      <span v-else>{{label}}</span>
    </template>
  </li>
</template>

<script type="text/javascript">
import '../theme-default/select-option.less'
export default {
  name: 'dy-select-option',
  props: {
    // 选项的值
    value: [String, Number, Boolean],
    // 选项标签
    label: [String, Number, Boolean],
    // 选项是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 多选状态下，父组件值
      groupValue: [],
      // 多选状态下，选项是否选中
      optionChecked: false
    }
  },
  computed: {
    isFiltered() {
      return !this.label.includes(this.$parent.filterLabel)
    },
    /**
     * 是否有$slots
     */
    hasSlot() {
      return this.$slots.default
    },
    /**
     * 是否选中
     * 非多选状态下
     */
    isSelected() {
      return this.$parent.value && this.$parent.value === this.value
    },
    /**
     * 是否多选
     */
    isMultipleSelect() {
      return this.$parent.multiple
    },
    /**
     * 是否 checked
     */
    isChecked() {
      return this.groupValue.includes(this.value)
    }
  },
  methods: {
    /**
     * 单选状态下选项选择事件
     */
    handleSelect() {
      if (this.isMultipleSelect || this.disabled) return
      this.$parent.handleClose()
      if (this.$parent.value !== this.value) {
        let extra = { ...this.$attrs }
        this.$parent.label = this.label
        this.$parent.$emit('change', this.value, this.label, extra)
      }
    },
    /**
     * 多选状态下选项选择事件
     * @param {Boolean} isChecked
     * @param {String, Number} data
     * @param {String, Number} label
     */
    handleMultipleSelect(isChecked, data, label) {
      if (this.disabled) return
      let labels = []
      if (this.groupValue.includes(this.value)) {
        labels = this.$parent.tags.filter(tag => tag !== label)
        this.$parent.tags = [...labels]
        this.$parent.$emit(
          'change',
          this.$parent.value.filter(item => item !== data),
          labels
        )
      } else {
        labels = this.$parent.tags.concat(label)
        this.$parent.tags = [...labels]
        this.$parent.$emit(
          'change',
          (this.$parent.value || []).concat(data),
          labels
        )
      }
    }
  },
  watch: {
    '$parent.value'(newValue) {
      if (this.isMultipleSelect) {
        this.groupValue = [...this.$parent.value]
        this.optionChecked = this.isChecked
      } else {
        if (newValue === '' && newValue === null) {
          this.$parent.label = ''
          return
        }
        if (this.value === newValue) {
          this.$parent.label = this.label
        }
      }
    }
  },
  beforeMount() {
    if (this.$parent.value === this.value) {
      this.$parent.label = this.label
    }
  },
  mounted() {
    if (this.isMultipleSelect) {
      this.$parent.isExistSlots = true
      this.groupValue = [...this.$parent.value]
      this.optionChecked = this.isChecked
      if (this.isChecked) {
        let idx = this.$parent.value.indexOf(this.value)
        this.$parent.tags[idx] = this.label
      }
    }
  }
}
</script>
