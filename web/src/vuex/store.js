import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 侧边栏, 菜单
    menuList: [],
    menuActiveName: '',
    // 主入口标签页
    mainTabs: JSON.parse(sessionStorage.getItem('mainTabs')) || [],
    mainTabsActiveName: sessionStorage.getItem('mainTabsActiveName') || '',
    // 管理员部门id adminDeptID
    adminDeptID: {
      id: 1
    },
    // 角色管理ID
    roleId: '',
    // 组织结构部门id groupDept
    groupDept: {
      id: ''
    },
    // 字典数据
    ditData: {
      id: ''
    },
    // 重置组织数DOM结构
    resetNodeTree: new Date().getTime(),
    // 菜单id
    menuData: {
      id: ''
    }
  },
  mutations: {
    clearUser(state) {
      // 清除用户token、权限
      localStorage.clear()
    },
    updateMenuList(state, list) {
      state.menuList = list
    },
    updateMenuActiveName(state, name) {
      state.menuActiveName = name
    },
    updateMainTabs(state, tabs) {
      state.mainTabs = tabs
    },
    updateMainTabsActiveName(state, name) {
      state.mainTabsActiveName = name
    },
    // 管理员部门id
    updateAdminDeptID(state, data) {
      state.adminDeptID = data
    },
    // 组织机构部门id
    updateGroupDeptID(state, data) {
      state.groupDept = data
    },
    // 角色id
    updateRoleDeptID(state, data) {
      state.roleId = data
    },
    // 字典数据id
    updateDitID(state, data) {
      state.ditData = data
    },
    // 菜单id
    updateMenuID(state, data) {
      state.menuData = data
    },
    // 重置组织数DOM结构
    updateResetNodeTree(state, data) {
      state.resetNodeTree = data
    }
  },
  modules: {}
})
export default store
