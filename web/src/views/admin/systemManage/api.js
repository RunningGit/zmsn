/**
 * 系统管理接口
 * @type {{ login: ((params?)) }}
 */

// 引入拦截器
import Ajax from '@/utils/fetch'
// 引入公共JS
import until from '@/utils/until'
import Qs from 'qs'

let base = until.apiPath
// let baseDigital = until.apiDigital // v1权限服务
// let baseAuthorize = until.apiAuthorize // v1数据服务
// let basePortal = until.apiPortal // v1门户服务
// let baseSchedule = until.apiSchedule // v1调度服务(微服务)
// let message = until.apiMessage // 消息服务
// ------------------单体
let baseDigital = base // v1权限服务
let baseAuthorize = base // v1数据服务
let basePortal = base // v1门户服务
let baseSchedule = base // 调度任务(单体)
let message = base // 消息服务
const systemManage = {
  // ---------------------角色管理列表----------------------------1
  /**
   * 获取角色表信息
   */
  rolelist(obj) {
    let data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/role/list`,
      method: 'get',
      params: data
    })
  },
  /**
   * 删除角色表信息
   */
  deleteRow(obj) {
    const data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/role/delete`,
      method: 'delete',
      data
    })
  },
  /**
   * 角色管理详情
   */
  getRoleDetail(obj) {
    const data = obj
    return Ajax({
      // url: `${base}dsf/role/info/`,
      url: `${baseAuthorize}dsf/role/info/` + data,
      method: 'get'
    })
  },
  /**
   * 保存编辑状态下的修改
   */
  updateRoleDetail(obj) {
    const data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/role/update`,
      method: 'put',
      data
    })
  },
  // 新建角色管理---------2

  /**
   * 获取权限列表
   */
  getPermissionList(obj) {
    const data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/menu/querymanagermenulist`,
      method: 'get',
      params: data
    })
  },

  /**
   * 提交新建角色
   */
  saveAddRole(obj) {
    const data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/role/save`,
      method: 'post',
      data
    })
  },
  /**
   * 查询用户授权列表
   */
  listAuthorize(obj) {
    const data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/role/listAuthorize`,
      method: 'get',
      params: data
    })
  },
  /**
   * 删除角色授权对应的用户
   */
  delAuthorize(obj) {
    const data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/role/delAuthorize`,
      method: 'delete',
      data
    })
  },
  /**
   * 角色授权给对应用户
   */
  saveAuthorize(obj) {
    const data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/role/authorize`,
      method: 'post',
      data
    })
  },
  // 请求角色树
  roleTree(id) {
    return Ajax({
      url: `${baseAuthorize}dsf/role/tree/${id}`,
      method: 'get'
    })
  },
  roleTreeChildtree(params) {
    return Ajax({
      url: `${baseAuthorize}dsf/role/childtree/${params}`,
      method: 'get'
    })
  },
  // ***---------------------角色管理列表END----------------------------****

  // ---------------------管理组列表--------------------------------
  /**
   * 获取管理组表列表
   */
  grouplist(obj) {
    let data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/usergroupstatic/list`,
      method: 'get',
      params: data
    })
  },
  /**
   * 删除管理组表信息
   */
  deletegrouplist(obj) {
    const data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/usergroupstatic/delete`,
      method: 'delete',
      data
    })
  },
  /**
   * 获取管理组表详情
   */
  groupDetail(obj) {
    const data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/usergroupstatic/selectGroup/` + data,
      method: 'get'
    })
  },
  /**
   * 提交新建角色
   */
  saveGroup(obj) {
    const data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/usergroupstatic/save`,
      method: 'post',
      data
    })
  },
  /**
   * 查询成员管理列表
   */
  listMember(obj) {
    const data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/usergroupstatic/queryUsersInfo`,
      method: 'get',
      params: data
    })
  },
  /**
   * 删除查询成员管理列表
   */
  delMember(obj) {
    const data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/usergroupstatic/deleteUserOfGroup`,
      method: 'delete',
      data
    })
  },
  // updateGroupDetail
  /**
   * 保存编辑状态下的修改
   */
  updateGroupDetail(obj) {
    const data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/usergroupstatic/update`,
      method: 'put',
      data
    })
  },
  /**
   * 添加成员
   */
  saveUsers(obj) {
    const data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/usergroupstatic/saveUsers`,
      method: 'post',
      data
    })
  },
  /**
   * 删除成员
   */
  deleteUserOfGroup(obj) {
    const data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/usergroupstatic/deleteUserOfGroup`,
      method: 'delete',
      data
    })
  },
  // ---------------------管理组列表END------------------------------
  // ---------------------管理员接口------------------------------
  /**
   * 获取用户信息
   */
  getInfo() {
    return Ajax({
      url: `${baseAuthorize}dsf/user/info`,
      method: 'get'
    })
  },
  /**
   * 获取用户表信息
   */
  getUserInfo(id) {
    return Ajax({
      url: `${baseAuthorize}dsf/user/info/` + id,
      method: 'get'
    })
  },
  /**
   * 查询用户表列表
   */
  getUserList(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseAuthorize}dsf/user/list?` + data,
      method: 'get'
    })
  },
  /**
   * 查询用户名
   */
  getUserListName(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseAuthorize}dsf/user/listByName?` + data,
      method: 'get'
    })
  },
  /**
   * 删除用户表
   */
  delUserMenu(params) {
    const data = params
    return Ajax({
      url: `${baseAuthorize}dsf/user/delete`,
      method: 'delete',
      data
    })
  },
  /**
   * 修改密码
   */
  modPasswd(params) {
    const data = params
    return Ajax({
      url: `${baseAuthorize}dsf/user/password`,
      method: 'put',
      data
    })
  },
  /**
   * 保存用户表
   */
  addUser(params) {
    const data = params
    return Ajax({
      url: `${baseAuthorize}dsf/user/save`,
      method: 'post',
      data
    })
  },
  /**
   * 调用all方法，目前只用于测试，v2.0封装一个完整版本
   */
  test(params1, params2) {
    return Ajax.all([params1, params2]).then(
      Ajax.spread((res1, res2) => {
        console.log(res1)
        console.log(res2)
      })
    )
  },
  /**
   * 修改用户表
   */
  modeMenu(params) {
    const data = params
    return Ajax({
      url: `${baseAuthorize}dsf/user/update`,
      method: 'put',
      data
    })
  },
  /**
   * 修改用户状态
   */
  updateStatus(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseAuthorize}dsf/user/updatestatus?` + data,
      method: 'put'
    })
  },
  /**
   * 重置密码
   */
  resetPasswd(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseAuthorize}dsf/user/resetpassword?` + data,
      method: 'put'
    })
  },
  /**
   * 查询通讯录用户表列表
   */
  getContactsUser(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseAuthorize}dsf/user/addresslist?` + data,
      method: 'get'
    })
  },
  /**
   * 根据名称查询通讯录用户人员
   */
  getContactsUserName(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseAuthorize}dsf/user/addresslistByName?` + data,
      method: 'get'
    })
  },
  /**
   * 通讯录默认两级
   */
  getContactsUserTree(params) {
    const data = params
    return Ajax({
      url: `${baseAuthorize}dsf/department/addressdepttreeinfo/` + data,
      method: 'get'
    })
  },
  /**
   * 通讯录子集
   */
  getContactsUserChilds(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseAuthorize}dsf/department/addresschildreninfo?` + data,
      method: 'get'
    })
  },
  /**
   * 通讯录子集
   */
  getContactsName(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseAuthorize}dsf/department/addressDepttreeinfoByName?` + data,
      method: 'get'
    })
  },
  // ---------------------管理员接口END------------------------------
  // ---------------------菜单管理接口------------------------------
  /**
   * 获取开发框架顶部和左侧导航
   */
  getMenuNav() {
    return Ajax({
      url: `${baseAuthorize}dsf/menu/nav`,
      method: 'get'
    })
  },
  /**
   * 获取菜单列表表格
   */
  getMenuList() {
    return Ajax({
      url: `${baseAuthorize}dsf/menu/list`,
      method: 'get'
    })
  },
  /**
   * 添加菜单
   */
  addMenu(params) {
    const data = params
    return Ajax({
      url: `${baseAuthorize}dsf/menu/save`,
      method: 'post',
      data
    })
  },
  /**
   * 删除菜单
   */
  delMenu(params) {
    const data = params
    return Ajax({
      url: `${baseAuthorize}dsf/menu/delete/` + data,
      method: 'delete'
    })
  },
  /**
   * 修改菜单
   */
  updateMenu(params) {
    const data = params
    return Ajax({
      url: `${baseAuthorize}dsf/menu/update`,
      method: 'put',
      data
    })
  },
  /**
   * 获取上级菜单
   */
  selectMenu() {
    return Ajax({
      url: `${baseAuthorize}dsf/menu/select`,
      method: 'get'
    })
  },
  /**
   * 获取菜单信息
   */
  infoMenu(params) {
    return Ajax({
      url: `${baseAuthorize}dsf/menu/info/` + params,
      method: 'get'
    })
  },
  /**
   * 获取菜单树节点
   */
  getMenuTree(params) {
    const data = params
    return Ajax({
      url: `${baseAuthorize}dsf/menu/tree/` + data,
      method: 'get'
    })
  },
  /**
   * 上级菜单
   */
  getMenuNameList(params) {
    const data = params
    return Ajax({
      url: `${baseAuthorize}dsf/menu/searchByType/` + data,
      method: 'get'
    })
  },
  /**
   * 根据名称查询菜单
   */
  getMenuName(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseAuthorize}dsf/menu/searchByName?` + data,
      method: 'get'
    })
  },
  // ---------------------菜单管理接口END------------------------------
  // ---------------------消息日志接口------------------------------
  // ---------------------消息日志列表----------------------------1
  //
  messageloglist(obj) {
    let data = obj
    return Ajax({
      url: `${baseDigital}dsf/messageLog/list`,
      method: 'get',
      params: data
    })
  },
  // 消息日志接收成员
  messageRefList(obj) {
    let data = obj
    return Ajax({
      url: `${baseDigital}dsf/messageRef/list`,
      method: 'get',
      params: data
    })
  },
  // ---------------------定时任务列表----------------------------1
  timingTasklist(obj) {
    let data = obj
    return Ajax({
      url: `${baseSchedule}sys/schedule/list`,
      method: 'get',
      params: data
    })
  },
  taskDelete(obj) {
    let data = obj
    return Ajax({
      url: `${baseSchedule}sys/schedule/delete`,
      method: 'delete',
      data
    })
  },
  // 详情
  infoTask(params) {
    return Ajax({
      url: `${baseSchedule}sys/schedule/info/` + params,
      method: 'get'
    })
  },
  // 保存修改
  updateTask(params) {
    const data = params
    return Ajax({
      url: `${baseSchedule}sys/schedule/update`,
      method: 'put',
      data
    })
  },
  // 新增
  saveTask(params) {
    const data = params
    return Ajax({
      url: `${baseSchedule}sys/schedule/save`,
      method: 'post',
      data
    })
  },
  // 立即执行
  runTask(params) {
    const data = params
    return Ajax({
      url: `${baseSchedule}sys/schedule/run`,
      method: 'post',
      data
    })
  },
  // 暂停定时任务
  pauseTask(params) {
    const data = params
    return Ajax({
      url: `${baseSchedule}sys/schedule/pause`,
      method: 'post',
      data
    })
  },
  // 恢复定时任务
  resumeTask(params) {
    const data = params
    return Ajax({
      url: `${baseSchedule}sys/schedule/resume`,
      method: 'post',
      data
    })
  },
  // 调度任务资源(服务)
  getApplications() {
    return Ajax({
      url: `${baseSchedule}sys/resource/applications`,
      method: 'get'
    })
  },
  // 调度任务资源(接口)
  getApplicationsPaths(params) {
    return Ajax({
      url: `${baseSchedule}sys/resource/applications/` + params + `/paths`,
      method: 'get'
    })
  },
  // -------------------------定时任务END----------------------------
  // -------------------------定时任务日志开始----------------------------
  // 列表
  taskloglist(obj) {
    let data = obj
    return Ajax({
      url: `${baseSchedule}sys/scheduleLog/list`,
      method: 'get',
      params: data
    })
  },
  // 详情
  tasklogDetail(params) {
    return Ajax({
      url: `${baseSchedule}sys/scheduleLog/info/` + params,
      method: 'get'
    })
  },
  // -------------------------定时任务日志END----------------------------
  // ---------------------消息日志接口END------------------------------
  // ---------------------日志管理接口------------------------------
  // ---------------------登录日志列表----------------------------1
  //
  loginLogList(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseDigital}dsf/loginLog/list?` + data,
      method: 'get'
    })
  },
  // ---------------------操作日志列表----------------------------1
  operateLogList(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseDigital}dsf/log/list?` + data,
      method: 'get'
    })
  },
  // ---------------------操作日志详情----------------------------1
  operateLogsDetail(params) {
    return Ajax({
      url: `${baseDigital}dsf/log/info/` + params,
      method: 'get'
    })
  },
  // ---------------------日志管理接口END------------------------------
  // ---------------------组织结构接口------------------------------
  /**
   * 获取当前ID下所有组织机构信息
   */
  getAllInfo(id) {
    return Ajax({
      url: `${baseAuthorize}dsf/department/allinfo/` + id,
      method: 'get'
    })
  },
  /**
   * 获取当前ID下级组织机构信息
   */
  getChildInfo(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseAuthorize}dsf/department/childreninfo?` + data,
      method: 'get'
    })
  },
  /**
   * 删除组织结构
   */
  del(params) {
    const data = params
    return Ajax({
      url: `${baseAuthorize}dsf/department/delete`,
      method: 'delete',
      data
    })
  },
  /**
   * 获取当前ID组织机构信息
   */
  getOrganizationInfo(id) {
    return Ajax({
      url: `${baseAuthorize}dsf/department/info/` + id,
      method: 'get'
    })
  },
  /**
   * 保存组织机构
   */
  save(params) {
    const data = params
    return Ajax({
      url: `${baseAuthorize}dsf/department/save`,
      method: 'post',
      data
    })
  },
  /**
   *修改组织机构
   */
  update(params) {
    const data = params
    return Ajax({
      url: `${baseAuthorize}dsf/department/update`,
      method: 'put',
      data
    })
  },
  /**
   *根据名称查询组织部门
   */
  search(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseAuthorize}dsf/department/depttreeinfoByName?` + data,
      method: 'get'
    })
  },
  /**
   *获取组织机构树型信息默认两级
   */
  getTree(id) {
    return Ajax({
      url: `${baseAuthorize}dsf/department/depttreeinfo/` + id,
      method: 'GET'
    })
  },
  // ---------------------组织结构接口END------------------------------
  // ---------------------字典管理接口------------------------------
  /**
   *根据ID查询字典信息
   */
  getDitInfo(params) {
    const data = params
    return Ajax({
      url: `${baseDigital}dsf/ditionary/` + data,
      method: 'get'
    })
  },
  /**
   *根据ID查询字典类目信息
   */
  getDitCategoryInfo(params) {
    const data = params
    return Ajax({
      url: `${baseDigital}dsf/ditionary/category/` + data,
      method: 'get'
    })
  },
  /**
   *删除字典表
   */
  delDit(params) {
    const data = params
    return Ajax({
      url: `${baseDigital}dsf/ditionary/delete/` + data,
      method: 'delete'
    })
  },
  /**
   *删除字典类目
   */
  delDitCategory(params) {
    const data = params
    return Ajax({
      url: `${baseDigital}dsf/ditionary/deleteDitionaryCategory/` + data,
      method: 'delete'
    })
  },
  /**
   *编辑字典类目
   */
  updateDitCategory(params) {
    const data = params
    return Ajax({
      url: `${baseDigital}dsf/ditionary/editDitionaryCategory`,
      method: 'put',
      data
    })
  },
  /**
   *查询字典表列表
   */
  getDitList(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseDigital}dsf/ditionary/list?` + data,
      method: 'get'
    })
  },
  /**
   *查询字典类目录/字典下的子字典列表
   */
  getDitChildList(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseDigital}dsf/ditionary/listChild?` + data,
      method: 'get'
    })
  },
  /**
   *保存字典表
   */
  saveDit(params) {
    const data = params
    return Ajax({
      url: `${baseDigital}dsf/ditionary/save`,
      method: 'post',
      data
    })
  },
  /**
   *新增字典类目
   */
  saveDitCategory(params) {
    const data = params
    return Ajax({
      url: `${baseDigital}dsf/ditionary/saveDitionaryCategory`,
      method: 'post',
      data
    })
  },
  /**
   *修改字典表
   */
  updateDit(params) {
    const data = params
    return Ajax({
      url: `${baseDigital}dsf/ditionary/update`,
      method: 'put',
      data
    })
  },
  /**
   *根据类型请求字典表
   */
  taglib(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseDigital}dsf/ditionary/taglib?` + data,
      mmethod: 'get'
    })
  },
  // ---------------------字典管理接口END------------------------------
  // ---------------------参数配置接口------------------------------
  /**
   *查询参数配置列表
   */
  paramsConfigList(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseDigital}dsf/config/list?` + data,
      method: 'get'
    })
  },
  /**
   *保存参数配置
   */
  saveParamsConfig(params) {
    const data = params
    return Ajax({
      url: `${baseDigital}dsf/config/save`,
      method: 'post',
      data
    })
  },
  /**
   *删除参数配置
   */
  delParamsConfig(params) {
    const data = params
    return Ajax({
      url: `${baseDigital}dsf/config/delete`,
      method: 'delete',
      data
    })
  },
  /**
   *查询参数配置
   */
  selectParamsConfig(params) {
    const data = params
    return Ajax({
      url: `${baseDigital}dsf/config/info/` + data,
      method: 'get'
    })
  },
  /**
   *修改参数配置
   */
  updateParamsConfig(params) {
    const data = params
    return Ajax({
      url: `${baseDigital}dsf/config/update`,
      method: 'put',
      data
    })
  },
  // ---------------------参数配置接口END------------------------------
  // ---------------------上传附件接口------------------------------
  /**
   *查询云存储配置信息
   */
  getOssConfig() {
    return Ajax({
      url: `${baseDigital}dsf/oss/config`,
      method: 'get'
    })
  },
  /**
   *删除
   */
  delUploadFile(params) {
    const data = params
    return Ajax({
      url: `${baseDigital}dsf/oss/delete`,
      method: 'delete',
      data
    })
  },
  /**
   *查询附件列表
   */
  getUploadFile(params) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${baseDigital}dsf/oss/list?` + data,
      method: 'get'
    })
  },
  /**
   *保存云存储配置信息
   */
  saveOssConfig(params) {
    const data = params
    return Ajax({
      url: `${baseDigital}dsf/oss/saveConfig`,
      method: 'post',
      data
    })
  },
  /**
   *上传文件
   */
  uploadFile: `${baseDigital}dsf/oss/upload`,
  downFile: `${baseDigital}dsf/oss/download`,
  // ---------------------上传附件接口END------------------------------
  // ---------------------消息监听Start----------------------------
  /**
   * 列表
   */
  queryMonitorMessageList(obj) {
    let data = obj
    return Ajax({
      url: `${message}message/monitorMessage/list`,
      method: 'get',
      params: data
    })
  },
  /**
   * 重发
   */
  retransmission(obj) {
    let data = obj
    return Ajax({
      url: `${message}message/retransmission`,
      method: 'get',
      params: data
    })
  },

  // ---------------------消息监听End----------------------------
  // ---------------------消息日志管理管理Start----------------------------
  /**
   * 消息日志管理列表
   */
  querySmsLogList(obj) {
    let data = obj
    return Ajax({
      url: `${message}message/log/list`,
      method: 'get',
      params: data
    })
  },
  /**
   * 消息日志管理删除
   */
  deleteSmsLog(obj) {
    const data = obj
    return Ajax({
      url: `${message}message/log/delete`,
      method: 'delete',
      data
    })
  },
  /**
   * 消息日志管理保存
   */
  saveSmsLog(obj) {
    const data = obj
    return Ajax({
      url: `${message}message/log/save`,
      method: 'post',
      data
    })
  },
  /**
   * 消息日志管理详情
   */
  getSmsLogDetail(obj) {
    const data = obj
    return Ajax({
      url: `${message}message/log/info/` + data,
      method: 'get'
    })
  },
  /**
   * 消息日志管理更新
   */
  updateSmsLogDetail(obj) {
    const data = obj
    return Ajax({
      url: `${message}message/log/update`,
      method: 'put',
      data
    })
  },
  // ---------------------消息日志管理管理End----------------------
  /**
   * 列表
   */
  queryDsfOnlineUserList(obj) {
    let data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/onlineUser/list`,
      method: 'get',
      params: data
    })
  },
  /**
   * 删除
   */
  deleteDsfOnlineUser(obj) {
    const data = obj
    return Ajax({
      url: `${baseAuthorize}dsf/onlineUser/delete`,
      method: 'delete',
      data
    })
  }
}

export default systemManage
