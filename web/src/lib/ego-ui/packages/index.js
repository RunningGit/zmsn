import './base'
import button from './button/button'
import checkbox from './checkbox/checkbox'
import checkboxGroup from './checkbox/checkboxGroup'
import message from './message/index'
import select from './select/select'
import selectOption from './select/select-option'
import radioGroup from './radio/radioGroup'
import radioButton from './radio/radioButton'
import radio from './radio/radio'
import input from './input/input'
import loading from './loading/index'
import pagination from './pagination/pagination'
import icon from './icon/icon'
import table from './table/table'
import scroller from './scroller/scroller'
import modal from './modal/modal'

const components = [
  button,
  checkbox,
  checkboxGroup,
  message,
  select,
  selectOption,
  radioGroup,
  radioButton,
  radio,
  input,
  pagination,
  icon,
  table,
  scroller,
  modal
]

const install = (Vue, opts = {}) => {
  Vue.prototype.$ego = {}
  components.map(component => {
    Vue.component(component.name, component)
  })

  Vue.prototype.$ego.alertMsg = (msg, theme = 'success', time = 3000) => {
    message({
      message: msg,
      theme: theme,
      delay: time
    })
  }
  //   Vue.prototype.$ego.message = message
  Vue.use(loading)
}

export default {
  version: '0.1.0',
  install
}
