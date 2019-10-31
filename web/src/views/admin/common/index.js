import Vue from 'vue'
import popup from './popup/index.vue'

const install = (Vue, opts = {}) => {
  const components = [popup]
  components.map(component => {
    Vue.component(component.name, component)
  })
}

export default {
  version: '1.0.0',
  install: install
}
