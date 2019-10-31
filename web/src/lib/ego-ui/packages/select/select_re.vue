<template>
  <div class="dy-select"
    :class="{'dy-select-visible': visible}"
    v-clickoutside="handleClose">
    <div style="width: 216px;overflow: auto;">
      <div style="display: table;">
        <div v-if="multiple"
          class="dy-select-tags"
          @click="handleToggle">
          <span v-for="(tag, idx) in tags"
            :key="tag">
            {{tag}}
            <i class="dy-icon iconfont icon-danger"
              @click.prevent.stop="handleRemoveTag(tag, idx)"></i>
          </span>
        </div>
        <div class="dy-select-input">
          <dy-input :value="label"
            @click="handleToggle"
            @keyup.enter="handleFilter"
            v-bind="$attrs"
            :disabled="disabled"
            :readonly="!filterable" />
        </div>
      </div>
    </div>
    <transition :name="selectToggle">
      <div ref="optionList"
        class="dy-select-list"
        :class="selectToggle"
        v-show="visible">
        <ul>
          <!-- <li v-if="filterable"
            class="dy-select-list-filter">
            <dy-input placeholder="请输入关键字搜索"
              suffix-icon="search"
              @suffix-action="handleFilter"
              @keyup.enter="handleFilter" />
          </li> -->
          <li v-if="multiple && filterLabel === ''"
            class="dy-select-list-option">
            <dy-checkbox v-model="allOptionChecked"
              @change="handleMultipleSelectAll">全选</dy-checkbox>
          </li>
          <slot>
            <li class="dy-select-list-option">
              <span class="dy-no-data">暂无数据</span>
            </li>
          </slot>
          <li v-if="filterable && isFilterAll"
            class="dy-select-list-option">
            <span class="dy-no-data">无匹配选项</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script type="text/javascript">
import '../theme-default/select.less'
import clickoutside from '../directives/clickoutside'
import DyInput from '../input/input'

export default {
  name: 'dy-select',
  components: {
    DyInput
  },
  inheritAttrs: false,
  directives: {
    clickoutside
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // v-model值
    value: {
      type: [String, Number, Boolean, Array],
      default() {
        return this.multiple ? [] : ''
      }
    },
    // 是否过滤筛选
    filterable: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否向上
    up: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 下拉选项是否可见
      visible: false,
      // 单选状态下选中选项label
      label: '',
      // 多选状态下选中选项labels
      tags: [],
      // 过滤筛选值
      filterLabel: '',
      // 是否全部被过滤
      isFilterAll: false,
      // 是否全选
      allOptionChecked: false,
      // 下拉选项位置&动画类名
      selectToggle: this.up ? 'select-toggle-down' : 'select-toggle-up'
    }
  },
  computed: {
    /**
     * 计算是否全选
     */
    calcOptionsChecked() {
      let allChecked = true
      this.$children.forEach(child => {
        if (
          child.$options._componentTag === 'dy-select-option' &&
          !child.disabled
        ) {
          // 如果有一个未被选中，则全选为 false
          if (!child.optionChecked) {
            allChecked = false
          }
        }
      })
      return allChecked
    }
  },
  methods: {
    /**
     * toggle下拉选项
     */
    handleToggle(e) {
      if (this.disabled) return
      this.visible = !this.visible
      this.$nextTick(() => {
        if (this.visible) {
          // this.calcOptionListPosition()
          this.selectToggle = this.up
            ? 'select-toggle-down'
            : 'select-toggle-up'
        } else {
          e.target.blur()
        }
      })
    },
    /**
     * 关闭下拉选项
     */
    handleClose() {
      this.visible = false
      this.$nextTick(() => {
        this.filterLabel = ''
        this.isFilterAll = false
      })
    },
    /**
     * 全选点击事件
     */
    handleMultipleSelectAll() {
      let checkboxes = []
      let tags = []
      this.$children.forEach(child => {
        if (
          child.$options._componentTag === 'dy-select-option' &&
          child.optionChecked !== undefined &&
          !child.disabled
        ) {
          child.optionChecked = this.allOptionChecked
          if (this.allOptionChecked) {
            checkboxes.push(child.value)
            tags.push(child.label)
          }
        }
      })
      this.tags = tags
      this.$emit('change', checkboxes, tags)
    },
    /**
     * 移除多选标签
     */
    handleRemoveTag(removeTag, removeTagIndex) {
      let tags = this.tags.filter((tag, idx) => tag !== removeTag)
      let values = this.value.filter((val, idx) => idx !== removeTagIndex)
      this.tags = tags
      this.$emit('change', values, tags)
    },
    /**
     * 筛选过滤
     */
    handleFilter(e) {
      this.filterLabel = e.target.value
      this.isFilterAll =
        this.$children.filter(
          child =>
            child.$options._componentTag === 'dy-select-option' &&
            !child.isFiltered
        ).length <= 0
      // this.$emit('filter-action', e.target.value)
    },
    /**
     * 计算下拉选项位置
     */
    calcOptionListPosition() {
      let el = this.$refs.optionList
      // 窗口高度
      let winHeight = document.documentElement.clientHeight
      // 滚动高度
      let scrollHeight =
        document.documentElement.scrollTop || document.body.scrollTop
      // 元素高度
      let targetHeight = el.offsetHeight
      // let targetTop = Math.abs(el.offsetTop)
      let targetTop = 42
      let targetParentHeight = el.parentNode.offsetHeight
      let targetParentTop = el.parentNode.offsetTop

      return (
        targetParentTop + targetParentHeight + targetHeight + targetTop >
        winHeight + scrollHeight
      )
    }
  },
  watch: {
    value(newValue) {
      if (newValue.length > 0 && this.$attrs.placeholder) {
        this.$attrs.placeholder = ''
      }
      if (this.multiple) {
        if (newValue.length <= 0) {
          this.tags = []
        }
        this.$nextTick(() => {
          this.allOptionChecked = this.calcOptionsChecked
        })
      }
    }
  },
  mounted() {
    if (this.multiple) {
      this.allOptionChecked = this.calcOptionsChecked
    }
  }
}
</script>
