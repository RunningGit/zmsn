export default {
  // 当被绑定的元素插入到 DOM 中时……
  inserted(el, binding) {
    // 校验传递的参数必须是字符串
    if (typeof binding.value !== 'string') {
      console.error('指令中传递的参数不合法，必须是字符串')
      return
    }
    // 获取权限字符串
    const perm = JSON.parse(sessionStorage.getItem('permissions')) || '[]'
    const str = binding.value
    /**
     * 传递过来的字符串分为三类，xx、xx || xx和xx && xx
     */
    // 或条件
    if (str.indexOf('||') > 0) {
      let arr = str.split('||')
      let flag = true
      arr.forEach(item => {
        if (perm.indexOf(item.trim()) > 0) flag = false
      })
      if (flag) el.parentNode.removeChild(el)
      // 与条件
    } else if (str.indexOf('&&') > 0) {
      let arr = str.split('&&')
      arr.forEach(item => {
        if (perm.indexOf(item.trim()) < 0) el.parentNode.removeChild(el)
      })
      // 单条件
    } else {
      if (perm.indexOf(str) < 0) el.parentNode.removeChild(el)
    }
  }
}
