export function isVNode(node) {
  return typeof node === 'object' && node.hasOwnProperty('componentOptions')
}

/**
 *  获取元素相对于页面的高度
 *  @param node {NodeElement} 指定的DOM元素
 */
export function getActualTop(node) {
  let actualTop = node.offsetTop
  let current = node.offsetParent

  while (current !== null) {
    actualTop += current.offsetTop
    current = current.offsetParent
  }
  return actualTop
}

/**
 *  获取元素相对于页面左侧的宽度
 *  @param node {NodeElement} 指定的DOM元素
 */
export function getActualLeft(node) {
  let actualLeft = node.offsetLeft
  let current = node.offsetParent

  while (current !== null) {
    actualLeft += current.offsetLeft
    current = current.offsetParent
  }

  return actualLeft
}

/**
 * 获取node元素存在滚动条的父辈元素
 * @param {NodeElement}} node DOM元素
 */
export function getParentScroller(node) {
  let scroller = node.parentNode
  while (scroller !== null && scroller.tagName !== 'BODY') {
    let overflowY = window.getComputedStyle(scroller).overflowY
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return scroller
    }
    scroller = scroller.parentNode
  }
  return window
}

/**
 * 绑定元素事件
 * @param {DOM} target
 * @param {String} event 事件类型
 * @param {Function} fn 绑定事件
 * @param {Boolean} useCapture 捕获阶段(true) or 冒泡阶段(false) 进行
 */
export function bindEvent(target, event, fn, useCapture = false) {
  if (target.addEventListener) {
    target.addEventListener(event, fn, useCapture)
  } else {
    target.attachEvent('on' + event, fn)
  }
}

/**
 * 取消绑定元素事件
 * @param {DOM} target
 * @param {String} event 事件类型
 * @param {Function} fn 绑定事件
 * @param {Boolean} useCapture 捕获阶段(true) or 冒泡阶段(false) 进行
 */
export function removeEvent(target, event, fn, useCapture = false) {
  if (target.removeEventListener) {
    target.removeEventListener(event, fn, useCapture)
  } else {
    target.detachEvent('on' + event, fn)
  }
}
