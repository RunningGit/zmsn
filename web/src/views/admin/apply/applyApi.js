/**
 * 系统管理接口
 * @type {{ login: ((params?)) }}
 */

// 引入拦截器
import Ajax from '@/utils/fetch'
// 引入公共JS
import until from '@/utils/until'
import { viewActivityProcess } from './mock'

let base = until.apiPath
// ------------------单体
let baseAuthorize = base // v1数据服务
export default {
  // ---------------------角色管理列表----------------------------1
  /**
   * 获取角色表信息
   */
  viewActivityProcess(obj) {
    let data = obj
    return Ajax({
      url: `${baseAuthorize}admin/viewActivityProcess`,
      method: 'get',
      params: data
    }).catch(() => {
      console.error('viewActivityProcess ', viewActivityProcess)
      return viewActivityProcess
    })
  }
}
