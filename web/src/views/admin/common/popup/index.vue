<template>
  <div class='model_demo'
    v-show="visible">
    <div class='alert_mode'
      :class="popupdata.nobotton?'alert_mode_nobotton':''">
      <div class="modelBox">
        <div class="closeModel"
          @click="confirmCancel">
          <i class="icon iconfont icon-close"></i>
        </div>
        <div class="title">{{popupdata.titles}}</div>
        <div class="popup_content"
          :class="popupdata.popup_c2?'popup_content2':''">
          <!-- 自定义内容区域 -->
          <slot name="content"></slot>
        </div>
        <div class="btn_box"
          v-if="!popupdata.nobotton">
          <div class="model_btnBox">
            <!-- 自定义footer -->
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class='model_mask'></div>
  </div>
</template>

<script type="text/ecmascript-6">
import './popup.less'

export default {
  name: 'dy-popup',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    popupdata: {
      type: Object
    }
  },
  data() {
    // 变量定义
    return {}
  },
  methods: {
    // 函数定义
    confirmCancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
