<template>
  <div class="dy-message-wrapper">
    <transition name="displacement-fade-show">
      <div class="dy-message"
        :class="['dy-message-' + theme]"
        v-show="isShow">
        <i class="dy-icon icon iconfont"
          :class="['icon-' + theme]"></i>
        <span class="dy-message-content">
          <slot>{{ message }}</slot>
        </span>
      </div>
    </transition>
  </div>
</template>

<script type="text/javascript">
/**
 * Message组件
 * @example
 * this.$ego.alertMsg(content, status, delay)
 * content 为显示内容
 * status  包括 'info','warning','success','danger'
 * delay   为延迟时间
 */
import '../theme-default/message.less'
export default {
  name: 'dy-message',
  data() {
    return {
      theme: 'success', // 信息提示主题
      isShow: false, // 是否展示提示框
      delay: 3000, // 信息展示时间
      visible: false // 是否移除dom节点
    }
  },
  watch: {
    /*
     ** visible为false，延迟1s之后移除message的dom节点
     */
    visible(val) {
      if (!val) {
        this.isShow = false
        setTimeout(() => {
          this.$el.parentNode.removeChild(this.$el)
        }, 1000)
      }
    }
  },
  methods: {
    /*
     ** 关闭
     */
    close() {
      this.visible = false
    },
    /*
     ** 倒计时
     */
    startCountDown() {
      setTimeout(() => {
        this.close()
      }, this.delay)
    }
  },
  mounted() {
    /*
     ** 挂载message的dom节点，并开始记时
     */
    if (this.delay) {
      this.visible = true
      this.startCountDown()
    }
  }
}
</script>
