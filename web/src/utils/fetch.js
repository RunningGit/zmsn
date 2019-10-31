// request拦截器
import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router'

axios.create({
  timeout: 10000 // 请求超时时间
})

// request拦截器
axios.interceptors.request.use(
  config => {
    // 获取本地token
    let token = localStorage.getItem('tokendata')
    // 设置请求头
    let headers = 'application/json;charset=UTF-8'
    // 是否携带token
    let tokenFlag = true
    // 是否修改请求信息
    if (config.opts) {
      // 获取携带token状态
      tokenFlag = config.opts ? config.opts.token : true
      // 获取请求头
      headers = config.opts.Header
        ? config.opts.Header
        : 'application/json;charset=UTF-8'
      // 拓展头部参数
      let Head = config.opts.Head
      if (Head) {
        for (let key in Head) {
          config.headers[key] = Head[key]
        }
      }
    }
    // 加时间搓
    if (config.url.indexOf('?') < 1) {
      config.url += '?time=' + new Date().getTime()
    } else {
      config.url += '&time=' + new Date().getTime()
    }
    // 条件允许，携带token请求
    if (token && tokenFlag) {
      // config.headers['token'] = token
      config.headers['X-Auth0-Token'] = token
    } else {
      // headers = 'application/x-www-form-urlencode'
    }
    // 设置请求格式
    config.headers['Content-Type'] = headers
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 服务器响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code === -401) {
      router.push({ name: 'login' })
    }
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          error.message = `错误请求：${error.response.data}`
          break
        case 401:
          error.message = '未授权，请重新登录'
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            } // 登录成功后跳入浏览的当前页面
          })
          break
        case 403:
          error.message = '拒绝访问'
          break
        case 404:
          error.message = '请求错误,未找到该资源'
          break
        case 405:
          error.message = '请求方法未允许'
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器端出错'
          break
        case 501:
          error.message = '网络未实现'
          break
        case 502:
          error.message = '网络错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网络超时'
          break
        case 505:
          error.message = 'http版本不支持该请求'
          break
        default:
          error.message = `连接错误${error.response.status}`
      }
    } else {
      error.message = '服务器异常'
    }
    Message.error(error.message)
    return Promise.reject(error.response.data)
  }
)
export default axios
