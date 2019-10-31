<template>
  <div ref="dySelect"
    class="dy-select"
    :class="{'dy-select-visible': visible}">
    <div v-if="multiple"
      class="dy-select-tags"
      @click="handleToggle">
      <dy-scroller scroll-x>
        <div>
          <span v-for="(tag, idx) in tags"
            class="dy-select-tag"
            :key="tag">
            {{tag}}
            <i class="dy-icon iconfont icon-danger"
              @click.prevent.stop="handleRemoveTag(tag, idx)"></i>
          </span>
        </div>
      </dy-scroller>
    </div>
    <div class="dy-select-input">
      <dy-input v-model="label"
        :placeholder="placeholder"
        suffix-icon="angle-single-down"
        @click="handleToggle"
        @suffix-action="handleToggle"
        @keyup.enter="handleFilter"
        @focus="handleFocus"
        v-bind="$attrs"
        :disabled="disabled"
        :readonly="multiple || !filterable" />
    </div>
    <transition :name="selectToggle">
      <div ref="dyOption"
        class="dy-select-list"
        :class="selectToggle"
        :style="optionListPosition"
        v-clickoutside="handleClose"
        v-show="visible">
        <ul>
          <li v-if="filterable && multiple"
            class="dy-select-list-filter">
            <dy-input v-model="searchKeyword"
              placeholder="请输入关键字搜索"
              suffix-icon="search"
              @suffix-action="handleFilter"
              @keyup.enter="handleFilter" />
          </li>
          <li v-if="multiple && filterLabel === '' && isExistSlots"
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
import { getParentScroller, bindEvent, removeEvent } from '../utils/common'
import DyInput from '../input/input'
import DyScroller from '../scroller/scroller'

export default {
  name: 'dy-select',
  components: {
    DyInput,
    DyScroller
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
    // 嵌入 body
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // placeholder
      placeholder: this.$attrs.placeholder,
      // 下拉选项是否可见
      visible: false,
      // 单选状态下选中选项label
      label: '',
      // 下拉关键字搜索
      searchKeyword: '',
      // 多选状态下选中选项labels
      tags: [],
      // 过滤筛选值
      filterLabel: '',
      // 是否全部被过滤
      isFilterAll: false,
      // 是否全选
      allOptionChecked: false,
      // 下拉选项位置&动画类名
      selectToggle: 'select-toggle-up',
      // 是否存在子元素
      isExistSlots: false,
      // 当前下拉选项dom对象
      optionListPosition: {
        top: '42px',
        left: 0,
        minWidth: '100%'
      },
      // 父辈滚动元素
      parentScroller: null
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
     * 筛选状态且非多选时，
     * 筛选后如果未选择选项则重置为原来的值
     */
    resetLabel() {
      if (this.filterable && !this.multiple) {
        for (let i = 0; i < this.$children.length; i++) {
          if (
            this.$children[i].$options._componentTag === 'dy-select-option' &&
            this.$children[i].value === this.value
          ) {
            this.label = this.$children[i].label
            break
          }
        }
      }
    },
    /**
     * toggle下拉选项
     */
    handleToggle(e) {
      if (this.disabled) return
      this.visible = !this.visible
      this.$nextTick(() => {
        if (this.visible) {
          this.calcIsReverse()
          let parentScroller = getParentScroller(this.$refs.dySelect)
          this.parentScroller = parentScroller
          // this.parentScroller.addEventListener('scroll', this.calcIsReverse)
          bindEvent(parentScroller, 'scroll', this.calcIsReverse)
        } else {
          e.target.blur()
          this.parentScroller &&
            removeEvent(this.parentScroller, 'scroll', this.calcIsReverse)
          // this.parentScroller.removeEventListener(
          //   'scroll',
          //   this.calcIsReverse
          // )
          this.parentScroller = null
        }
      })
    },
    /**
     * 关闭下拉选项
     */
    handleClose() {
      if (!this.visible) return
      // 重置label
      this.resetLabel()
      this.$nextTick(() => {
        this.filterLabel = ''
        this.isFilterAll = false
      })
      // v-clickout和handleToggle冲突
      // 暂时这么解决
      setTimeout(() => {
        this.visible = false
        this.parentScroller &&
          this.parentScroller.removeEventListener('scroll', this.calcIsReverse)
        this.parentScroller = null
      }, 0)
    },
    /**
     * 筛选状态且非多选时，
     * 聚焦输入框则选中输入框文字
     */
    handleFocus(e) {
      if (this.filterable && !this.multiple) e.currentTarget.select()
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
    calcSelectStyle() {
      // select 元素
      let el = this.$refs.dySelect
      if (!el) return false
      // 元素高度、距离顶部高度
      let targetHeight = el.offsetHeight
      let targetWidth = el.offsetWidth

      let { top, left } = el.getBoundingClientRect()

      return {
        top,
        left,
        height: targetHeight,
        minWidth: targetWidth
      }
    },
    /**
     * 下拉菜单高度
     */
    calcOptionsHeight() {
      let el = this.$refs.dyOption
      // 下拉菜单高度
      let height = el.offsetHeight

      return height
    },
    /**
     * 计算下拉菜单是否翻转及定位
     */
    calcIsReverse() {
      let selectStyle = this.calcSelectStyle()
      if (!selectStyle) return
      // 弹窗三角形高及间距
      const triangleHeight = 10

      // 窗口高度
      let winHeight = document.documentElement.clientHeight
      // 滚动高度
      let bodyScrollHeight =
        document.documentElement.scrollTop || document.body.scrollTop
      // 元素到顶部，元素到左侧，元素最小宽度，元素高
      let { top, left, minWidth, height } = selectStyle
      let optionsHeight = this.calcOptionsHeight()
      let reverse = top + height + triangleHeight + optionsHeight > winHeight
      if (!this.appendToBody) {
        if (reverse) {
          this.selectToggle = 'select-toggle-down'
          this.optionListPosition.top = -triangleHeight - optionsHeight + 'px'
        } else {
          this.selectToggle = 'select-toggle-up'
          this.optionListPosition.top = '42px'
        }
        return
      }
      if (reverse) {
        this.selectToggle = 'select-toggle-down'
        this.optionListPosition = {
          top: `${top + bodyScrollHeight - triangleHeight - optionsHeight}px`,
          left: `${left}px`,
          minWidth: `${minWidth}px`
        }
      } else {
        this.selectToggle = 'select-toggle-up'
        this.optionListPosition = {
          top: `${top + bodyScrollHeight + height + triangleHeight}px`,
          left: `${left}px`,
          minWidth: `${minWidth}px`
        }
      }
    }
  },
  watch: {
    value(newValue) {
      const placeholder = this.$attrs.placeholder
      if (this.multiple) {
        if (newValue.length <= 0) {
          this.tags = []
          this.placeholder = placeholder
        } else {
          this.placeholder = ''
        }
        this.$nextTick(() => {
          this.allOptionChecked = this.calcOptionsChecked
        })
      } else {
        if (newValue !== '' && newValue !== null) {
          this.placeholder = ''
        } else {
          this.label = ''
          this.placeholder = placeholder
        }
      }
    }
  },
  mounted() {
    // 挂载组件后判断是否全选状态
    if (this.multiple && this.$slots.length > 0) {
      this.allOptionChecked = this.calcOptionsChecked
    }
    // 将select-option嵌入body
    if (this.appendToBody) {
      this.$nextTick(() => document.body.appendChild(this.$refs.dyOption))
    }
  },
  beforeDestroy() {
    // 移除options
    this.appendToBody && document.body.removeChild(this.$refs.dyOption)
  }
}
</script>
