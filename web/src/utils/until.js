/**
 * API配置文件
 */

const apiPath = '/api/' // 测试服
const apiDigital = '/api/sys-digital/' // 权限服务
const apiAuthorize = '/api/sys-authorize/' // 数据服务
const apiPortal = '/api/biz-portal/' // 门户服务
const apiSchedule = '/api/sys-schedule/' // 门户服务
const apiMessage = '/api/sys-message/'

/**
 * 二级域名
 */
const apiSlDomain = {
  default: '/'
}

module.exports = {
  apiPath,
  apiDigital,
  apiAuthorize,
  apiPortal,
  apiSchedule,
  apiMessage
}
