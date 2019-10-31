import axios from 'axios';
import md5 from 'md5'
import Qs from 'qs'
import {MessageBox, Indicator} from 'mint-ui';
import vui from "./vui";

axios.defaults.timeout = 30000;
// axios.defaults.baseURL = 'http://moss.canplay.com.cn/bink/customer';

// 配置 接口地址   生产获取当前域名
if(process.env.NODE_ENV=='production'){
  // if (process.env.TEST === 'test') {
    axios.defaults.baseURL = process.env.VUE_APP_URL;
  // } else {
  //   axios.defaults.baseURL = window.location.origin+'/bink/youan/customer';
  // }
}else {
  axios.defaults.baseURL = process.env.VUE_APP_URL;
}
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.post['Access-Control-Allow-Credentials'] = 'true';
// axios.defaults.headers.post['Access-Control-Allow-Headers'] = 'x-requested-with,content-type';

//根据项目换key
const appKey = 'eng*lish$goo!2d&'
let commonParams = {
  // platform: '1',//平台 1：PC 2：小程序
  times: new Date().getTime()
}


//http request 拦截器
axios.interceptors.request.use(
  config => {
    config.data = Qs.stringify(config.data)
    return config;
  },
  error => {
    return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
  }
);


//http response 拦截器
axios.interceptors.response.use(
  response => {
    return response.data
  },
  err => {
    return Promise.reject(err) // 返回接口返回的错误信息
  }
)


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export const httpGet = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    params.platform = '1'
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @param isTips 出错是否弹窗提示
 * @returns {Promise}
 */

export const httpPost = (url, data = {}, isTips = true) => {
  Indicator.open();
  return new Promise((resolve, reject) => {
    const user = vui.getSession('user') || {}
    commonParams.userId = user.userId
    commonParams.token = user.token
    data = {...commonParams, ...data}
    let params = vui.objToUrl(vui.objKeySort({times: data.times}))
    data.sign = md5(params + appKey).substring(2, 19)
     axios.post(url, data)
      .then(response => {
        Indicator.close();
        if (response.code != 0 && isTips) {
          MessageBox('提示', response.msg);
        }
        resolve(response);
      }, err => {
        Indicator.close();
        reject(err)
      })
  })
}
