<template>
  <div ref="scrollArea"
    class="dy-scroller-area"
    :class="{'dy-dragging': isDragging}"
    :style="{width: setScrollScope(scrollX), height: setScrollScope(scrollY)}"
    @mouseup="handleEndDrag">
    <div v-if="scrollX && thumbXaxisVisible"
      class="dy-scroller-bar dy-scroller-bar-x"
      :style="barStyle.x">
      <span class="dy-scroller-thumb"
        :style="thumbXaxis"
        @mousedown="handleStartDragX"></span>
    </div>
    <div v-if="scrollY && thumbYaxisVisible"
      class="dy-scroller-bar dy-scroller-bar-y"
      :style="barStyle.y">
      <span class="dy-scroller-thumb"
        :style="thumbYaxis"
        @mousedown="handleStartDragY"></span>
    </div>
    <div class="dy-scroller-content"
      :style="{transform: `translate(${-parseFloat(thumbXaxis.left) * ratioX}px, ${-parseFloat(thumbYaxis.top) * ratioY}px)`}">
      <div ref="scrollSupporter"
        class="dy-scroller-supporter">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import '../theme-default/scroller.less'
import { bindEvent, removeEvent } from '../utils/common'
export default {
  name: 'dy-scroller',
  props: {
    // 滚动x轴？
    scrollX: {
      type: [Boolean, String],
      default: false
    },
    // 滚动y轴？
    scrollY: {
      type: [Boolean, String],
      default: false
    },
    // 滚动条样式
    barStyle: {
      type: Object,
      default() {
        return {
          x: {},
          y: {}
        }
      }
    },
    // 滚动条拇指样式
    thumbStyle: {
      type: Object,
      default() {
        return {
          // y轴框
          width: 'inherit',
          // x轴高
          height: 'inherit',
          background: '#023c71'
        }
      }
    }
  },
  data() {
    const { width, height, background } = this.thumbStyle
    return {
      // x轴y轴是否显示
      thumbXaxisVisible: false,
      thumbYaxisVisible: false,
      // 横轴滚动条拇指样式
      thumbXaxis: {
        ...this.thumbStyle,
        left: 0,
        right: 0,
        width: null,
        height,
        background
      },
      // 纵轴滚动条拇指样式
      thumbYaxis: {
        ...this.thumbStyle,
        top: 0,
        bottom: 0,
        width,
        height: null,
        background
      },
      // 点击滚动条拇指时存储坐标
      dragStartX: null,
      dragStartY: null,
      // 是否拖动中
      // 目前用于user-select: none
      isDragging: false,
      // area宽高
      areaWidth: null,
      areaHeight: null,
      // supporter宽高
      supporterWidth: null,
      supporterHeight: null,
      // 内容滚动比例
      ratioX: 1,
      ratioY: 1
    }
  },
  methods: {
    /**
     * 滚动范围
     * @param {String, Boolean} 滚动区值
     * eg. value => '100px' || '100%' || true
     */
    setScrollScope(value) {
      if (!value) return null
      return value === true ? 'inherit' : value
    },
    /**
     * 开始拖动横轴
     * @param {event}
     */
    handleStartDragX(e) {
      this.dragStartX = e.pageX || e.screenX
      this.isDragging = true
      bindEvent(document.body, 'mousemove', this.handleDragging)
      bindEvent(document.body, 'mouseup', this.handleEndDrag)
    },
    /**
     * 开始拖动纵轴
     * @param {event}
     */
    handleStartDragY(e) {
      this.dragStartY = e.pageY || e.screenY
      this.isDragging = true
      bindEvent(document.body, 'mousemove', this.handleDragging)
      bindEvent(document.body, 'mouseup', this.handleEndDrag)
    },
    /**
     * 拖动中
     * @param {event}
     */
    handleDragging(e) {
      const { offsetWidth, offsetHeight } = this.$refs.scrollArea
      if (this.dragStartX) {
        let x = e.pageX || e.screenX
        let dist = x - this.dragStartX
        let thumbWidth = parseFloat(this.thumbXaxis.width)
        let thumbLeft = parseFloat(this.thumbXaxis.left) + dist
        if (thumbLeft <= 0) {
          thumbLeft = 0
        }
        if (thumbLeft >= offsetWidth - thumbWidth) {
          thumbLeft = offsetWidth - parseFloat(this.thumbXaxis.width)
        }
        this.thumbXaxis.left = `${thumbLeft}px`
        this.dragStartX = x
      }
      if (this.dragStartY) {
        let y = e.pageY || e.screenY
        let dist = y - this.dragStartY
        let thumbHeight = parseFloat(this.thumbYaxis.height)
        let thumbTop = parseFloat(this.thumbYaxis.top) + dist
        if (thumbTop <= 0) {
          thumbTop = 0
        }
        if (thumbTop >= offsetHeight - thumbHeight) {
          thumbTop = offsetHeight - parseFloat(this.thumbYaxis.height)
        }
        this.thumbYaxis.top = `${thumbTop}px`
        this.dragStartY = y
      }
    },
    /**
     * 结束拖动
     * @param {event}
     */
    handleEndDrag(e) {
      this.isDragging = false
      this.dragStartX = null
      this.dragStartY = null
      removeEvent(document.body, 'mousemove', this.handleDragging)
      removeEvent(document.body, 'mouseup', this.handleEndDrag)
    },
    /**
     * 滚轮事件
     * @param {event}
     */
    onMouseWheel(e) {
      // 兼容ie，取wheelDelta
      e = e || window.event
      const { offsetWidth, offsetHeight } = this.$refs.scrollArea
      let thumbWidth = parseFloat(this.thumbXaxis.width)
      let thumbLeft = parseFloat(this.thumbXaxis.left)
      let thumbHeight = parseFloat(this.thumbYaxis.height)
      let thumbTop = parseFloat(this.thumbYaxis.top)
      // 滚轮逻辑
      // 如果只存在横向滚动，滚动 x轴
      // 向下滚动，y轴滚动到底后滚动 x轴
      // 向上滚动，x轴滚动到初始位置后滚动 y轴
      if (
        (this.thumbXaxisVisible && !this.thumbYaxisVisible) ||
        (this.thumbXaxisVisible &&
          offsetHeight - thumbHeight === thumbTop &&
          (e.wheelDelta < 0 || thumbLeft > 0))
      ) {
        // 滚动 x 轴
        thumbLeft = thumbLeft - e.wheelDelta
        if (thumbLeft <= 0) {
          thumbLeft = 0
        }
        if (thumbLeft >= offsetWidth - thumbWidth) {
          thumbLeft = offsetWidth - thumbWidth
        }
        this.thumbXaxis.left = `${thumbLeft}px`
      } else if (this.thumbYaxisVisible) {
        // 滚动 y 轴
        thumbTop = thumbTop - e.wheelDelta
        if (thumbTop <= 0) {
          thumbTop = 0
        }
        if (thumbTop >= offsetHeight - thumbHeight) {
          thumbTop = offsetHeight - thumbHeight
        }
        this.thumbYaxis.top = `${thumbTop}px`
      }

      e.preventDefault && e.preventDefault()
      return false
    },
    /**
     * 设置滚动条
     */
    initialScroller() {
      if (!this.$slots.default || (!this.scrollX && !this.scrollY)) return
      const areaWidth = this.$refs.scrollArea.offsetWidth
      const areaHeight = this.$refs.scrollArea.offsetHeight
      const supporterWidth = this.$refs.scrollSupporter.offsetWidth
      const supporterHeight = this.$refs.scrollSupporter.offsetHeight
      if (
        this.areaWidth !== areaWidth ||
        this.areaHeight !== areaHeight ||
        (this.scrollX &&
          supporterWidth &&
          this.supporterWidth !== supporterWidth) ||
        (this.scrollY &&
          supporterHeight &&
          this.supporterHeight !== supporterHeight)
      ) {
        const thumbXaxisWidth = areaWidth * (areaWidth / supporterWidth)
        const thumbYaxisHeight = areaHeight * (areaHeight / supporterHeight)
        const thumbXaxisVisible = thumbXaxisWidth < areaWidth
        const thumbYaxisVisible = thumbYaxisHeight < areaHeight
        this.thumbXaxisVisible = thumbXaxisVisible && this.scrollX
        this.thumbYaxisVisible = thumbYaxisVisible && this.scrollY
        this.thumbXaxis.width = `${thumbXaxisWidth}px`
        this.thumbYaxis.height = `${thumbYaxisHeight}px`
        this.thumbXaxis.left = 0
        this.thumbXaxis.right = thumbYaxisVisible ? this.thumbStyle.width : 0
        this.thumbYaxis.top = 0
        this.thumbYaxis.bottom = thumbXaxisVisible ? this.thumbStyle.height : 0
        this.$nextTick(() => {
          this.areaWidth = areaWidth
          this.areaHeight = areaHeight
          this.supporterWidth = supporterWidth
          this.supporterHeight = supporterHeight
          this.ratioX = supporterWidth / areaWidth
          this.ratioY = supporterHeight / areaHeight
        })
      }
    },
    /**
     * 滚动到y轴 top 处
     * @param {String, Number} top
     */
    scrollTop(top) {
      top = parseFloat(top)
      const thumbHeight = parseFloat(this.thumbYaxis.height)
      const viewHeight = this.areaHeight
      if (top < 0) {
        top = 0
      }
      if (top + thumbHeight > viewHeight) {
        top = viewHeight - thumbHeight
      }
      this.thumbYaxis.top = `${top}px`
    },
    /**
     * 滚动到x轴 left 处
     * @param {String, Number} left
     */
    scrollLeft(left) {
      left = parseFloat(left)
      const thumbWidth = parseFloat(this.thumbXaxis.width)
      const viewWidth = this.areaWidth
      if (left < 0) {
        left = 0
      }
      if (left + thumbWidth > viewWidth) {
        left = viewWidth - thumbWidth
      }
      this.thumbXaxis.left = `${left}px`
    }
  },
  mounted() {
    // 初始化滚动条
    this.initialScroller()
    bindEvent(window, 'resize', this.initialScroller)
    // 添加滚轮事件
    bindEvent(this.$refs.scrollArea, 'mousewheel', this.onMouseWheel)
    bindEvent(this.$refs.scrollArea, 'DOMMouseScroll', this.onMouseWheel)
  },
  updated() {
    this.initialScroller()
  },
  beforeDestroy() {
    // 移除滚轮事件、resize事件
    removeEvent(this.$refs.scrollArea, 'mousewheel', this.onMouseWheel)
    removeEvent(this.$refs.scrollArea, 'DOMMouseScroll', this.onMouseWheel)
    removeEvent(window, 'resize', this.initialScroller)
    removeEvent(document.body, 'mousemove', this.handleDragging)
    removeEvent(document.body, 'mouseup', this.handleEndDrag)
  }
}
</script>
