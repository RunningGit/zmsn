<template>
  <transition name="modal"
    @before-enter="handleTransitionBeforeEnter"
    @enter="handleTransitionEnter"
    @after-enter="handleTransitionAfterEnter"
    @before-leave="handleTransitionBeforeLeave"
    @leave="handleTransitionLeave"
    @after-leave="handleTransitionAfterLeave">
    <div v-if="isRender || visible"
      v-show="visible"
      :key="zIndex"
      class="dy-modal-wrapper"
      :style="{zIndex}"
      @click.self="handleClickMask">
      <div :class="`dy-modal ${customClass}`"
        :style="{maxWidth: width}">
        <div class="dy-modal-header">
          <span class="dy-modal-title">
            {{title}}
          </span>
          <dy-icon type="close"
            @click="handleClose" />
        </div>
        <div class="dy-modal-body">
          <slot></slot>
        </div>
        <div v-if="existFooter"
          class="dy-modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
/**
 * @example
 * <dy-modal v-model="visible" @open="handleOpen" @close="handleClose">
 *  <div>内容区</div>
 *  <div slot="footer">页脚</div>
 * </dy-modal>
 */
import '../theme-default/modal.less'
import Mask from './mask'
export default {
  name: 'dy-modal',
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    // 模态框显示隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 模态框标题
    title: {
      type: String,
      default: '标题'
    },
    // 模态框最大宽度
    width: {
      type: String,
      default: 'auto'
    },
    // 自定义类
    customClass: {
      type: String,
      default: ''
    },
    // 蒙版嵌入到元素
    // id
    el: {
      type: String,
      default: null
    },
    // 点击蒙版是否可关闭
    closableMask: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 是否已渲染
      // 渲染后通过v-show来显示隐藏而不是v-if
      isRender: false,
      // 蒙版实例
      maskInstance: null,
      // 是否有页脚插槽内容
      existFooter: false,
      // 模态框层级
      zIndex: 1993
    }
  },
  methods: {
    /**
     * 关闭模态框
     */
    handleClose() {
      this.$emit('change', false)
      this.maskInstance && this.maskInstance.hide()
    },
    /**
     * 蒙版渲染
     */
    maskRender(visible = false) {
      if (!visible) return
      const zIndex = this.calcZindex() - 1
      const el = this.el
      this.maskInstance = new Mask({ zIndex, $el: el })
    },
    /**
     * 计算层级
     */
    calcZindex() {
      let modals = document.getElementsByClassName('dy-modal-wrapper')
      let modalAmount = modals.length
      let modalMaxZindex = this.zIndex
      for (let i = 0; i < modalAmount; i++) {
        let modalZindex = modals[i].style.zIndex
        modalMaxZindex =
          modalZindex > modalMaxZindex ? modalZindex : modalMaxZindex
      }
      return +modalMaxZindex
    },
    /**
     * 动画过程
     */
    handleTransitionBeforeEnter() {
      this.$emit('before-open')
    },
    handleTransitionEnter() {
      this.$emit('open')
    },
    handleTransitionAfterEnter() {
      this.$emit('after-open')
    },
    handleTransitionBeforeLeave() {
      this.$emit('before-close')
    },
    handleTransitionLeave() {
      this.$emit('close')
    },
    handleTransitionAfterLeave() {
      this.$emit('after-close')
    },
    /**
     * 事件代理
     * 点击蒙版
     */
    handleClickMask() {
      if (!this.closableMask) return
      this.$emit('change', false)
      this.maskInstance && this.maskInstance.hide()
    }
  },
  watch: {
    /**
     * 监听visible
     * 同步蒙版显示隐藏状态
     */
    visible(isVisible) {
      if (isVisible) {
        this.zIndex = this.calcZindex() + 1
        if (!this.maskInstance) {
          this.maskRender(isVisible)
          this.isRender = true
        } else {
          this.$nextTick(() => this.maskInstance.show(this.zIndex - 1))
        }
      } else {
        this.maskInstance && this.maskInstance.hide()
      }
    }
  },
  mounted() {
    this.maskRender(this.visible)
    this.zIndex = this.calcZindex() + 1
    this.existFooter = this.$slots.footer && this.$slots.footer.length > 0
  },
  beforeDestroy() {
    this.isRender = false
    this.maskInstance && this.maskInstance.destroy()
  }
}
</script>
