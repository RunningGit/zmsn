import Vue from 'vue'
import Message from './message.vue'
import { isVNode } from '../utils/common'

const MessageConstructor = Vue.extend(Message)

let instance // 当前组件实例
let instancesArr = []
let count = 0
let zIndex = new Date().getFullYear()

let Msg = (options = {}) => {
  let type = (typeof options).toLowerCase()
  let usrClose = options.onClose
  let id = 'dyMessage' + count
  count++

  if (type === 'string' || type === 'number') {
    options = {
      message: options
    }
  }

  options.onClose = () => {
    Msg.close(id, usrClose)
  }

  instance = new MessageConstructor({
    data: options
  })

  // 解析并挂载内容区的VNode
  if (isVNode(instance.message)) {
    instance.$slots.default = [instance.message]
    instance.message = null
  }

  instance.id = id
  instance.viewmodel = instance.$mount()
  document.body.appendChild(instance.viewmodel.$el)
  instance.$dom = instance.viewmodel.$el
  instance.$dom.style.zIndex = zIndex
  zIndex++
  instance.viewmodel.isShow = true
  instancesArr.push(instance)
  return instance.viewmodel
}

Msg.close = (id, usrClose) => {
  for (let [index, _instance] of instancesArr.entries()) {
    if (id === _instance.id) {
      usrClose && usrClose(_instance)
    }

    instancesArr.splice(index, 1)
    break
  }
}

export default Msg
