<template>
  <div class="organ">
    <!-- 弹出框左侧部门 -->
    <div class="organ-left"
      :class="[!isGetMember?'organ-left-dept':'']">
      <!-- 名字搜索框 -->
      <div class="organ-search"
        v-clickoutside="handleClose">
        <div class="organ-search-input">
          <dy-input v-model="searchCondition"
            :placeholder="'搜索' + placeholderName + '...'"
            maxlength="16"
            @keyup.enter="searchNameList()"
            suffix-icon="search"
            @suffix-action="searchNameList()"
            style="width:100%"></dy-input>
        </div>
        <!-- 气泡框 -->
        <transition :name="listSlideName">
          <div v-show="showTooltip"
            v-loading="searchLoading"
            :class="listSlideName"
            class="dsf_toolTip">
            <ul id="dsf_outside"
              @scroll="handleScroll()"
              v-if="toolTipList.length !== 0">
              <li v-for="(item, index) in toolTipList"
                :key="index">
                <P @click="selectPeople(item), showTooltip= false"
                  class="dsf_toolTip_name">{{item.name}}</P>
                <div class="dsf_toolTip_path">
                  <p v-for="(val,index) in item.depts"
                    :key="index">{{val.departmentFullName}}</p>
                </div>
              </li>
            </ul>
            <div class="dsf_toolTip_unresult"
              v-if="toolTipList.length === 0">暂无查询结果</div>
          </div>
        </transition>
      </div>
      <div class="organ-left-title">组织架构</div>
      <!-- 默认两级组织树 -->
      <div class="organ-tree">
        <!-- 默认两级组织树 -->
        <div :class="[!isGetMember?'organ-tree-dept':'']"
          class="organ-tree-left">
          <!-- 机构部门 -->
          <div v-if="searchType === 0 || searchType === 1"
            class="organ-left-nodeTree">
            <nodeTree @nodeClick="nodeClick"
              :loadNode="loadNode"></nodeTree>
          </div>
          <!-- 角色 -->
          <div v-else-if="searchType === 3"
            class="organ-left-nodeTree">
            <nodeTree @nodeClick="nodeClick"
              :loadNode="loadNodeRole"></nodeTree>
          </div>
          <!-- 通讯录 -->
          <div v-else
            class="organ-left-nodeTree">
            <nodeTree @nodeClick="nodeClick"
              :loadNode="loadNodeContacts"></nodeTree>
          </div>
        </div>
        <!-- 组织树查询人员列表 -->
        <div class="organ-tree-right"
          v-if="isGetMember">
          <ul class="organ-right-list">
            <li v-for="(item, index) in searchUserList"
              :key="index"
              @click="selectPeople(item)">
              <i class="iconfont icon-renyuan-xiankuang"></i>
              <span :title="item.name.length>10?item.name:''">{{item.name}}</span>
            </li>
            <li class="organ-unresult"
              v-if="searchUserList.length === 0">暂无数据</li>
          </ul>
          <div class="organ-list-btn"
            v-if="searchUserList.length > 0 && pager.totalPage !== 1">
            <span :class="{'organ-page': pager.currentPage === 1}"
              @click="prev()">
              <i class="iconfont icon-angle-single-left"></i>上一页</span>
            <span style="padding-left: 20px"></span>
            <span :class="{'organ-page': pager.totalPage === pager.currentPage}"
              @click="next()">下一页
              <i class="iconfont icon-angle-single-right"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹出框右侧已选择人员或部门 -->
    <div class="organ-right">
      <div class="orgin-right-title">
        <div v-if="searchType === 0 || searchType === 4"
          class="title">已选择的部门</div>
        <div v-else-if="searchType === 3"
          class="title">已选择的角色</div>
        <div v-else
          class="title">已选择的人员</div>
        <ul class="orgin-right-list">
          <li v-for="(item, index) in selectPeopleList"
            :key="index"
            class="nowrap"
            :title="item.name">
            <i v-if="searchType === 0 || searchType === 4"
              class="iconfont icon-bumen-shixin"></i>
            <i v-else
              class="iconfont icon-renyuan-shixin"></i>
            <span class="orgin-right-name"
              :title="item.name.length > 10 ? item.name:''">{{item.name}}</span>
            <i v-if="!(item.showClose || false)"
              class="iconfont icon-close"
              @click="deletSelectPeople(index)"></i>
          </li>
          <li class="organ-unresult"
            v-if="selectPeopleList.length < 1">暂无数据</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import systemManage from '../../api' // 引入API
import nodeTree from '../nodeTree'
import clickoutside from '@/directives/clickoutside' // 引入自定义事件 捕捉点击页面其它区域事件
import './organization.less'

export default {
  name: 'oragnization',
  props: {
    /**
     * searchType: 搜索查询类型
     * 0: 查询机构部门
     * 1: 查询管理员
     * 2: 查询通讯录人员
     * 3: 查询角色
     * 4: 查询通讯录部门
     */
    searchType: {
      type: Number,
      default: 0
    },
    /**
     * multiple: 默认单选
     */
    multiple: {
      type: Boolean,
      default: false
    },
    /**
     * initList: 回显数据
     */
    initList: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * placeholderName: 搜索提示
     */
    placeholderName: {
      type: String,
      default: ''
    },
    /**
     * groupId: 详情Id
     */
    groupId: {
      type: String,
      default: ''
    },
    /**
     * roleType: 查询的role是属于哪个,默认是roleid
     */
    roleType: {
      type: Boolean,
      default: true
    },
    /**
     * isGetMember: 是否需要通过部门列表查询人员，若需要弹窗结构会改变，默认不需要查询
     */
    isGetMember: {
      type: Boolean,
      default: false
    }
  },
  components: {
    nodeTree
  },
  data() {
    return {
      showTooltip: false,
      searchLoading: false, // 加载动画
      toolTipList: [], // 气泡列表
      searchUserList: [],
      pager: {
        pageSize: 10,
        currentPage: 1,
        totalPage: 1
      }, // 人员查询分页
      searchPager: {
        pageSize: 10,
        currentPage: 1,
        totalPage: 1
      }, // 搜索框的分页实现懒加载
      arr: [], // 树结构第二级菜单数据存储集合
      deptId: 1, // 部门默认两级id
      dpath: '1.', // 部门根节点路劲
      selectPeopleList: [], // 选中人员&部门数据集合
      searchCondition: '', // 搜素框
      listSlideName: 'toolTip-slide-up' // 气泡框显示&关闭动画
    }
  },
  directives: { clickoutside },
  created() {
    // 每次弹窗重置选中数据集合再进行赋值
    this.selectPeopleList = []
    // 数据回显
    if (this.initList.length > 0) {
      this.selectPeopleList = [...this.initList]
    }
  },
  methods: {
    /**
     * 滚动加载
     */
    handleScroll() {
      let scrollDiv = document.getElementById('dsf_outside')
      if (
        scrollDiv.scrollTop + scrollDiv.clientHeight >=
        scrollDiv.scrollHeight
      ) {
        this.loadmore()
      }
    },
    /**
     * 懒加载
     */
    loadmore() {
      if (this.searchPager.currentPage >= this.searchPager.totalPage) {
        return (this.searchPager.currentPage = this.searchPager.totalPage)
      } else {
        this.searchPager.currentPage++
      }
      this.searchNameList(this.searchPager.currentPage)
    },
    /**
     * 根据名称来查询人员或者部门
     */
    searchNameList(currentPage = 1) {
      // 搜索值为空时提示请输入内容
      if (this.searchCondition.trim() === '') {
        this.$ego.alertMsg('请输入关键字查找', 'warning', 1000)
        return
      }
      // 加载动画
      this.searchLoading = true
      // 气泡框显示
      this.showTooltip = true
      // 重新搜索
      this.searchPager.currentPage = currentPage
      if (this.searchPager.currentPage === 1) {
        this.toolTipList = []
      }
      // 不同类型查询不同接口
      switch (this.searchType) {
        // 查询机构部门
        case 0:
          let params0 = {
            page: this.searchPager.currentPage,
            limit: this.searchPager.pageSize,
            deptName: this.searchCondition
          }
          systemManage.search(params0).then(response => {
            if (response.data.code === 0) {
              this.searchLoading = false
              // 处理数据
              let data = response.data.data.list
              this.searchPager.totalPage = response.data.data.totalPage
              if (data.length > 0) {
                data.forEach(item => {
                  // 统一名称
                  item.name = item.deptName
                  this.toolTipList.push(item)
                })
              }
            } else {
              this.$ego.alertMsg(response.data.msg, 'danger', 1000)
            }
          })
          break
        // 查询管理员
        case 1:
          let params1 = {
            name: this.searchCondition
          }
          if (this.groupId !== '') {
            if (this.roleType) {
              params1.roleid = this.groupId
            } else {
              params1.groupid = this.groupId
            }
          }
          this.getUserByName(params1)
          break
        // 查询通讯录人员
        case 2:
          let params2 = {
            name: this.searchCondition,
            limit: this.searchPager.pageSize,
            deptName: this.searchCondition
          }
          this.getContactsUserByName(params2)
          break
        // 查询角色
        case 3:
          let params3 = {
            page: this.searchPager.currentPage,
            limit: this.searchPager.pageSize,
            roleName: this.searchCondition
          }
          systemManage.rolelist(params3).then(response => {
            if (response.data.code === 0) {
              this.searchLoading = false
              // 处理数据
              let data = response.data.data.list
              this.searchPager.totalPage = response.data.data.totalPage
              if (data.length > 0) {
                data.forEach(item => {
                  // 统一名称
                  item.name = item.roleName
                  this.toolTipList.push(item)
                })
              }
            } else {
              this.$ego.alertMsg(response.data.msg, 'danger', 1000)
            }
          })
          break
        // 查询通讯录部门
        case 4:
          let params4 = {
            page: this.searchPager.currentPage,
            limit: this.searchPager.pageSize,
            deptName: this.searchCondition
          }
          systemManage.getContactsName(params4).then(response => {
            if (response.data.code === 0) {
              this.searchLoading = false
              // 处理数据
              let data = response.data.data.list
              this.searchPager.totalPage = response.data.data.totalPage
              if (data.length > 0) {
                data.forEach(item => {
                  // 统一名称
                  item.name = item.deptName
                  this.toolTipList.push(item)
                })
              }
            } else {
              this.$ego.alertMsg(response.data.msg, 'danger', 1000)
            }
          })
          break
      }
    },
    /**
     * 监听节点被点击
     */
    nodeClick(data) {
      this.pager.currentPage = 1
      this.searchUserList = []
      this.dpath = data.deptPath
      this.deptId = data.id
      switch (this.searchType) {
        // 添加部门
        case 0:
          this.selectPeople(data)
          break
        // 筛选查询管理员
        case 1:
          let params1 = {
            deptId: data.id,
            dpath: data.deptPath
          }
          this.getUserList(params1)
          break
        // 筛选查询通讯录人员
        case 2:
          let params2 = {
            deptId: data.id,
            dpath: data.deptPath
          }
          this.getContactsUser(params2)
          break
        // 查询角色
        case 3:
          this.selectPeople(data)
          break
        // 添加通讯录部门
        case 4:
          this.selectPeople(data)
          break
      }
    },
    /**
     * 查询管理员列表
     */
    getUserList(params2) {
      let params = {
        page: this.pager.currentPage,
        limit: this.pager.pageSize
      }
      // 角色和管理组添加成员筛选
      if (this.groupId !== '') {
        if (this.roleType) {
          params.roleid = this.groupId
        } else {
          params.groupid = this.groupId
        }
      }
      let obj = Object.assign(params, params2)
      systemManage.getUserList(obj).then(response => {
        if (response.data.code === 0) {
          this.searchLoading = false
          // 处理数据
          let data = response.data.data.list
          let dataList = []
          if (data.length > 0) {
            data.forEach(item => {
              // 统一名称和id
              item.name = item.dsfPersonEntity.personName
              item.id = item.userId
              dataList.push(item)
            })
          }
          this.pager.totalPage = response.data.data.totalPage
          this.searchUserList = dataList
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    /**
     * 根据名称查询管理员
     */
    getUserByName(params2) {
      let params = {
        page: this.searchPager.currentPage,
        limit: this.searchPager.pageSize
      }
      let obj = Object.assign(params, params2)
      systemManage.getUserListName(obj).then(response => {
        if (response.data.code === 0) {
          this.searchLoading = false
          // 处理数据
          let data = response.data.data.list
          this.searchPager.totalPage = response.data.data.totalPage
          if (data.length > 0) {
            data.forEach(item => {
              // 统一名称和id
              item.name = item.dsfPersonEntity.personName
              item.id = item.userId
              this.toolTipList.push(item)
            })
          }
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    /**
     * 查询通讯录人员列表
     */
    getContactsUser(params2) {
      let params = {
        page: this.pager.currentPage,
        limit: this.pager.pageSize
      }
      let obj = Object.assign(params, params2)
      systemManage.getContactsUser(obj).then(response => {
        if (response.data.code === 0) {
          this.searchLoading = false
          // 处理数据
          let data = response.data.data.list
          let dataList = []
          if (data.length > 0) {
            data.forEach(item => {
              // 统一名称和id
              item.name = item.dsfPersonEntity.personName
              item.id = item.userId
              dataList.push(item)
            })
          }
          this.pager.totalPage = response.data.data.totalPage
          this.searchUserList = dataList
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    /**
     * 根据名称查询通讯录人员
     */
    getContactsUserByName(params) {
      systemManage.getContactsUserName(params).then(response => {
        if (response.data.code === 0) {
          this.searchLoading = false
          // 处理数据
          let data = response.data.data.list
          this.searchPager.totalPage = response.data.data.totalPage
          if (data.length > 0) {
            data.forEach(item => {
              // 统一名称和id
              item.name = item.dsfPersonEntity.personName
              item.id = item.userId
              this.toolTipList.push(item)
            })
          }
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    /**
     * 点击页面其它地方隐藏气泡
     */
    handleClose(e) {
      this.searchCondition = ''
    },
    /**
     * 跳转到上一页
     */
    prev() {
      let params = {
        deptId: this.deptId,
        dpath: this.dpath
      }
      if (this.pager.currentPage <= 1) {
        return (this.pager.currentPage = 1)
      } else {
        this.pager.currentPage--
        switch (this.searchType) {
          case 1:
            // 查询管理员
            this.getUserList(params)
            break
          case 2:
            // 查询通讯录人员
            this.getContactsUser(params)
            break
        }
      }
    },
    /**
     * 跳转到下一页
     */
    next() {
      let params = {
        deptId: this.deptId,
        dpath: this.dpath
      }
      if (this.pager.currentPage >= this.pager.totalPage) {
        return (this.pager.currentPage = this.pager.totalPage)
      } else {
        this.pager.currentPage++
        switch (this.searchType) {
          case 1:
            // 查询管理员
            this.getUserList(params)
            break
          case 2:
            // 查询通讯录人员
            this.getContactsUser(params)
            break
        }
      }
    },
    /**
     * 选择人员列表,id参数是判断数据唯一性
     */
    selectPeople(item) {
      if (this.multiple) {
        // 保证唯一，多选
        let flag = true
        if (this.selectPeopleList.length > 0) {
          this.selectPeopleList.forEach(val => {
            if (val.id === item.id) {
              flag = false
            }
          })
        }
        if (flag) this.selectPeopleList.push(item)
      } else {
        // 单选
        this.selectPeopleList = []
        this.selectPeopleList.push(item)
      }
    },
    /**
     * 删除已选人员
     */
    deletSelectPeople(idx) {
      this.selectPeopleList.splice(idx, 1)
    },
    /**
     * 组织部门树，默认两级
     */
    loadNode(node, resolve) {
      let nodeId = 1
      if (node.level === 0) {
        systemManage.getTree(nodeId).then(response => {
          if (response.data.code === 0) {
            let data = response.data.data.children
            let parentData = response.data.data
            this.arr = []
            if (data.length > 0) {
              data.forEach(item => {
                item.name = item.deptName
                item.isLeaf = !item.isleaf
                this.arr.push(item)
              })
            }
            resolve([
              {
                name: parentData.deptName,
                isLeaf: !parentData.isleaf,
                ...parentData
              }
            ])
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
        return
      }
      if (node.level > 1) {
        let params = {
          deptId: node.data.id,
          dpath: node.data.deptPath
        }
        systemManage.getChildInfo(params).then(response => {
          if (response.data.code === 0) {
            let data = response.data.data
            if (data.length > 0) {
              data.forEach(item => {
                item.name = item.deptName
                item.isLeaf = !item.isleaf
              })
            }
            resolve(data)
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
        return
      }
      resolve(this.arr)
    },
    /**
     * 角色树，默认两级
     */
    loadNodeRole(node, resolve) {
      let nodeId = 1
      // 存储第二级节点数据
      if (node.level === 0) {
        systemManage.roleTree(nodeId).then(response => {
          if (response.data.code === 0) {
            let data = response.data.data.childs
            let roleData = response.data.data
            this.arr = []
            if (data.length > 0) {
              data.forEach(item => {
                item.name = item.roleName
                item.isLeaf = !item.leaf
                item.id = item.roleId
                this.arr.push(item)
              })
            }
            resolve([
              {
                name: roleData.roleName,
                id: roleData.roleId,
                isLeaf: !roleData.leaf,
                ...roleData
              }
            ])
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
        return
      }
      if (node.level > 1) {
        let params = node.data.roleId
        systemManage.roleTreeChildtree(params).then(response => {
          if (response.data.code === 0) {
            let data = response.data.data
            if (data.length > 0) {
              data.forEach(item => {
                item.name = item.roleName
                item.isLeaf = !item.leaf
                item.id = item.roleId
              })
            }
            resolve(data)
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
        return
      }
      resolve(this.arr)
    },
    /**
     * 通讯录人员树，默认两级
     */
    loadNodeContacts(node, resolve) {
      let nodeId = 1
      if (node.level === 0) {
        systemManage.getContactsUserTree(nodeId).then(response => {
          if (response.data.code === 0) {
            let data = response.data.data.children
            let parentData = response.data.data
            this.arr = []
            if (data.length > 0) {
              data.forEach(item => {
                item.name = item.deptName
                item.isLeaf = !item.isleaf
                this.arr.push(item)
              })
            }
            resolve([
              {
                name: parentData.deptName,
                isLeaf: !parentData.isleaf,
                ...parentData
              }
            ])
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
        return
      }
      if (node.level > 1) {
        let params = {
          deptId: node.data.id,
          dpath: node.data.deptPath
        }
        systemManage.getContactsUserChilds(params).then(response => {
          if (response.data.code === 0) {
            let data = response.data.data
            if (data.length > 0) {
              data.forEach(item => {
                item.name = item.deptName
                item.isLeaf = !item.isleaf
              })
            }
            resolve(data)
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
        return
      }
      resolve(this.arr)
    }
  },
  watch: {
    /**
     * 监听输入框为空或者空格
     */
    searchCondition(newVal, oldVal) {
      if (!newVal.trim()) {
        this.toolTipList = []
        this.showTooltip = false
      }
    },
    /**
     * 监听选择人的人员或部门
     */
    selectPeopleList(newVal, oldVal) {
      this.$emit('saveSelectPeople', newVal)
    }
  }
}
</script>
