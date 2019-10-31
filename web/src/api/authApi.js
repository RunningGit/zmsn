/**
 * 认证接口
 * @type {{ login: ((params?)) }}
 */

// 引入拦截器
import Ajax from '@/utils/fetch'
// 引入公共JS
import until from '@/utils/until'

import Qs from 'qs'
let base = until.apiPath
// let baseDigital = until.apiDigital // v1权限服务
// let baseAuthorize = until.apiAuthorize // v999数据服务

// --------------------------------单体
let baseDigital = base
let baseAuthorize = base

const authApi = {
  // 判断是否微服务模式
  isSystem() {
    if (base === baseAuthorize) {
      return false
    }
    return true
  },
  /**
   * 后台登录
   * @param {String} userName 帐号
   * @param {String} password 密码 md5 加密
   * @param {String} opts 配置请求参数
   */
  login(params, opts) {
    const data = params
    // const data = Qs.stringify(params)
    return Ajax({
      url: `${baseAuthorize}dsf/login`,
      method: 'post',
      data,
      opts
    })
  },
  // 获取登陆图形验证码
  getloginPic(uuid) {
    return `${baseAuthorize}dsfcaptcha.jpg?uuid=${uuid}`
  },

  /**
   * 后台退出
   */
  logout(opts) {
    const data = opts
    return Ajax({
      url: `${baseAuthorize}dsf/logout`,
      method: 'post',
      data
    })
  },
  /**
   * 修改密码
   */
  amendPassword(params, opts) {
    const data = params
    return Ajax({
      url: `${base}dsf/user/password`,
      method: 'put',
      data,
      opts
    })
  }
}

export default authApi
