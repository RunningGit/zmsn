/**
 * 系统管理接口
 * @type {{ login: ((params?)) }}
 */

// 引入拦截器
import Ajax from '@/utils/fetch'
// 引入公共JS
import until from '@/utils/until'
import { getIndexConifg, getActivityConfig, getActivityList, getActivityGroup } from './mock'

let base = until.apiPath
// ------------------单体
let baseAuthorize = base // v1数据服务
export default {
  // ---------------------角色管理列表----------------------------1
  /**
     * 首页配置
     */
  getIndexConifg(obj) {
    let data = obj
    return Ajax({
      url: `${baseAuthorize}admin/getIndexConifg`,
      method: 'get',
      params: data
    }).catch(() => {
      console.error('error getIndexConifg ', getIndexConifg)
      return getIndexConifg
    })
  },
  /**
      * 上传文件
      */
  uploadFile(obj) {
    let data = obj
    return Ajax({
      url: `${baseAuthorize}admin/uploadFile`,
      method: 'get',
      params: data
    }).catch(() => {
      console.error('error uploadFile ')
      return {}
    })
  },
  /**
   * 保存首页配置
   */
  saveIndexConfig(obj) {
    let data = obj
    return Ajax({
      url: `${baseAuthorize}admin/saveIndexConfig`,
      method: 'get',
      params: data
    }).catch(() => {
      console.error('error saveIndexConfig ')
      return {}
    })
  },
  /**
     * 获取活动配置
     */
  getActivityConfig(obj = {}) {
    let data = obj
    return Ajax({
      url: `${baseAuthorize}admin/getActivityConfig`,
      method: 'get',
      params: data
    }).catch(() => {
      console.error('error getActivityConfig ', getActivityConfig)
      return getActivityConfig
    })
  },
  /**
   * 保存活动配置
   */
  saveActivityConfig(obj) {
    let data = obj
    return Ajax({
      url: `${baseAuthorize}admin/saveActivityConfig`,
      method: 'get',
      params: data
    }).catch(() => {
      console.error('error saveActivityConfig ')
      return {}
    })
  },
  /**
   * 获取活动列表
   * {
   *    activityType,
   *    activityName
   * }
   */
  getActivityList(obj) {
    let data = obj
    return Ajax({
      url: `${baseAuthorize}admin/getActivityList`,
      method: 'get',
      params: data
    }).catch(() => {
      console.error('error getActivityList ')
      return getActivityList
    })
  },
  /**
   * 获取活动分组 tb_zmnysn_activity_template
   */
  getActivityGroup(obj) {
    let data = obj
    return Ajax({
      url: `${baseAuthorize}admin/getActivityGroup`,
      method: 'get',
      params: data
    }).catch(() => {
      console.error('error getActivityGroup ')
      return getActivityGroup
    })
  }

}
