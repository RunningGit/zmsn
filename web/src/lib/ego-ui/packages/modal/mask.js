import Vue from 'vue'

class Mask {
  constructor({
    zIndex,
    $el
  }) {
    this.$el = $el || null
    this.zIndex = zIndex
    const MaskConstructor = Vue.extend(this.render())
    this.instance = new MaskConstructor()
    let childNode = this.instance.$mount().$el
    if ($el) {
      document.getElementById($el).appendChild(childNode)
    } else {
      document.body.appendChild(childNode)
    }
  }

  render() {
    const zIndex = this.zIndex
    return Vue.component('DyMask', {
      template: '<transition name="mask"><div v-if="isRender" v-show="visible" class="dy-mask" :style="{zIndex: zIndex}"></div></transition>',
      data() {
        return {
          visible: true,
          isRender: true,
          zIndex
        }
      }
    })
  }

  /**
   * 销毁实例
   */
  destroy() {
    this.instance.$data.isRender = false
  }

  /**
   * 蒙版显示
   * @param {Number} zIndex
   */
  show(zIndex) {
    this.instance.$data.visible = true
    this.instance.$data.zIndex = zIndex
  }

  /**
   * 蒙版隐藏
   */
  hide() {
    this.instance.$data.visible = false
  }
}

export default Mask
