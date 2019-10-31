<template>
  <div class="dsf_content">
    <div class="dsf_content_section">
      <div class="dsf_content_item">
        <div class="dsf_content_itemL">
          <nodeTree :key="this.$store.state.resetNodeTree"
            disabled
            :loadNode="loadNode"
            :searchShow="searchShow"
            :render="renderContent">
            <!-- 搜索框 -->
            <template slot="search">
              <div class="tree_search tree_search_addcontent">
                <dy-input v-model="form.roleName"
                  placeholder="搜索..."
                  @keyup.enter="searchName()"
                  suffix-icon="search"
                  @suffix-action="searchName()"
                  style="width:80%"
                  maxlength="16"></dy-input>
                <router-link class="tree_search_add"
                  :to="{name: 'addRole'}"
                  tag="a"
                  v-if="roleSave">+新增</router-link>
              </div>
              <div class="treebox"
                v-if="searchShow">
                <el-tree :props="defaultProps"
                  :data="getList"
                  @node-click="searchInfo"
                  :render-content="renderNode">
                </el-tree>
              </div>
            </template>
          </nodeTree>
        </div>
        <!-- 列表开始 -->
        <router-view></router-view>
        <!-- 列表结束 -->
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import nodeTree from '../common/nodeTree'
import systemManage from '../api' // 引入API
import { isAuth } from '@/utils' // 权限控制
import './index.less'

export default {
  data() {
    return {
      getList: [],
      arr: [],
      searchShow: false,
      chooseFirst: false,
      form: {
        roleName: '',
        page: 1,
        limit: 999
      },
      roleUpdate: '',
      roleDelete: '',
      roleSave: '',
      roleInfo: '',
      roleUserauthorization: '',
      disabled: true,
      defaultProps: {
        label: 'roleName',
        isLeaf: 'isleaf'
      }
    }
  },
  components: {
    nodeTree
  },
  created() {
    // 权限认证
    this.roleUpdate = isAuth('dsf:role:update')
    this.roleDelete = isAuth('dsf:role:delete')
    this.roleSave = isAuth('dsf:role:save')
    this.roleInfo = isAuth('dsf:role:info')
    this.roleUserauthorization = isAuth('dsf:role:userauthorization')
  },
  methods: {
    // 防止冒泡
    stopBubble(e) {
      e = window.event || e
      e.cancelBubble = true
      e.stopPropagation()
    },
    // 筛选节点，节点查询
    searchInfo(data) {
      this.changeAdminDeptID(data.id)
      this.$router.push({
        name: 'userAuthorization'
      })
    },
    // 搜索查询树节点jsx
    renderNode(h, { node, data, store }) {
      if (this.render) {
        return this.render(h, { node, data, store })
      }
      return (
        <span class="treebox-node" title={data.roleName}>
          <i class="iconfont icon-bumen-xuxin" />
          <i class="iconfont icon-bumen-shixin" />
          <span class="treebox_node_label">{data.roleName}</span>
        </span>
      )
    },
    // 监听节点被点击
    nodeClick(val) {
      this.changeAdminDeptID(val.roleId)
      this.$router.push({
        name: 'userAuthorization'
      })
    },
    // 更新deptid
    changeAdminDeptID(params) {
      this.$store.commit('updateRoleDeptID', params)
    },
    // 根据名称查询
    searchName() {
      if (!this.form.roleName.trim()) {
        this.searchShow = false
        return
      }
      systemManage.rolelist(this.form).then(response => {
        if (response.data.code === 0) {
          this.getList = []
          this.getList = response.data.data.list
          this.searchShow = true
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 树节点数据，查询组织部门树
    loadNode(node, resolve) {
      let nodeId = 1
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
                isLeaf: !roleData.leaf,
                id: roleData.roleId,
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
    // 节点内容
    renderContent(h, { node, data, store }) {
      // 需要打开置灰开关，再需要判断authFlag它的值
      if (!data.authFlag && this.disabled) {
        return (
          <span class="treebox-node treebox-node-disabled" title={node.label}>
            <i class="iconfont icon-bumen-xuxin" />
            <span class="treebox_node_label">{node.label}</span>
          </span>
        )
      } else {
        if (this.roleInfo) {
          if (this.roleUpdate) {
            if (this.roleDelete) {
              return (
                <span
                  class="treebox-node"
                  title={node.label}
                  on-click={() => this.nodeClick(node.data)}
                >
                  <i class="iconfont icon-bumen-xuxin" />
                  <i class="iconfont icon-bumen-shixin" />
                  <span class="treebox_node_label">{node.label}</span>
                  <span class="node-tree-oper">
                    <i class="dy-icon iconfont icon-operation" />
                    <span class="node_tree_bth">
                      <a
                        on-click={e => {
                          this.stopBubble(e)
                          this.getDetails(node.data.roleId, 'detail')
                        }}
                      >
                        查看
                      </a>
                      <a
                        id="roleUpdate"
                        on-click={e => {
                          this.stopBubble(e)
                          this.getDetails(node.data.roleId, 'compile')
                        }}
                      >
                        编辑
                      </a>
                      <a
                        on-click={e => {
                          this.stopBubble(e)
                          this.remove(node, data, node.label)
                        }}
                      >
                        删除
                      </a>
                    </span>
                  </span>
                </span>
              )
            } else {
              return (
                <span
                  class="treebox-node"
                  on-click={() => this.nodeClick(node.data)}
                >
                  <i class="iconfont icon-bumen-xuxin" />
                  <i class="iconfont icon-bumen-shixin" />
                  <span title={node.label} class="treebox_node_label">
                    {node.label}
                  </span>
                  <span class="node-tree-oper">
                    <i class="dy-icon iconfont icon-operation" />
                    <span class="node_tree_bth">
                      <a
                        on-click={e => {
                          this.stopBubble(e)
                          this.getDetails(node.data.roleId, 'detail')
                        }}
                      >
                        查看
                      </a>
                      <a
                        id="roleUpdate"
                        on-click={e => {
                          this.stopBubble(e)
                          this.getDetails(node.data.roleId, 'compile')
                        }}
                      >
                        编辑
                      </a>
                    </span>
                  </span>
                </span>
              )
            }
          } else {
            if (this.roleDelete) {
              return (
                <span
                  class="treebox-node"
                  title={node.label}
                  on-click={() => this.nodeClick(node.data)}
                >
                  <i class="iconfont icon-bumen-xuxin" />
                  <i class="iconfont icon-bumen-shixin" />
                  <span class="treebox_node_label">{node.label}</span>
                  <span class="node-tree-oper">
                    <i class="dy-icon iconfont icon-operation" />
                    <span class="node_tree_bth">
                      <a
                        on-click={e => {
                          this.stopBubble(e)
                          this.getDetails(node.data.roleId, 'detail')
                        }}
                      >
                        查看
                      </a>
                      <a
                        on-click={e => {
                          this.stopBubble(e)
                          this.remove(node, data, node.label)
                        }}
                      >
                        删除
                      </a>
                    </span>
                  </span>
                </span>
              )
            } else {
              return (
                <span
                  class="treebox-node"
                  on-click={() => this.nodeClick(node.data)}
                >
                  <i class="iconfont icon-bumen-xuxin" />
                  <i class="iconfont icon-bumen-shixin" />
                  <span title={node.label} class="treebox_node_label">
                    {node.label}
                  </span>
                  <span class="node-tree-oper">
                    <i class="dy-icon iconfont icon-operation" />
                    <span class="node_tree_bth">
                      <a
                        on-click={e => {
                          this.stopBubble(e)
                          this.getDetails(node.data.roleId, 'detail')
                        }}
                      >
                        查看
                      </a>
                    </span>
                  </span>
                </span>
              )
            }
          }
        } else {
          if (this.roleDelete) {
            return (
              <span
                class="treebox-node"
                title={node.label}
                on-click={() => this.nodeClick(node.data)}
              >
                <i class="iconfont icon-bumen-xuxin" />
                <i class="iconfont icon-bumen-shixin" />
                <span class="treebox_node_label">{node.label}</span>
                <span class="node-tree-oper">
                  <i class="dy-icon iconfont icon-operation" />
                  <span class="node_tree_bth">
                    <a
                      on-click={e => {
                        this.stopBubble(e)
                        this.remove(node, data, node.label)
                      }}
                    >
                      删除
                    </a>
                  </span>
                </span>
              </span>
            )
          }
        }
      }
    },
    // 查看详情
    getDetails(item, type) {
      this.$router.push({
        name: 'roleDetail',
        query: { id: item, type: type }
      })
    },
    remove(node, rows, usename) {
      var data = []
      data.push(rows.roleId)
      this.$confirm(`是否删除"${usename}"该角色?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (!rows.isLeaf) {
            this.$ego.alertMsg('请先删除子角色!', 'warning', 1000)
            return
          }
          systemManage.deleteRow(data).then(response => {
            if (response.status === 200 && response.data.code === 0) {
              const parent = node.parent
              const children = parent.childNodes || parent.data
              for (let i = 0; i < children.length; i++) {
                if (rows.roleId === children[i].data.roleId) {
                  var index = i
                }
              }
              children.splice(index, 1)
              this.$ego.alertMsg('删除成功！', 'success', 1000)
              this.changeAdminDeptID('')
              this.changeState()
            } else {
              this.$ego.alertMsg(response.data.msg, 'danger', 1000)
            }
          })
        })
        .catch(() => {})
    },
    // 刷新组织树
    changeState() {
      let flag = !this.$store.state.resetNodeTree
      this.$store.commit('updateResetNodeTree', flag)
    }
  },
  // 页面销毁的时候重置vuex
  destroyed() {
    this.changeAdminDeptID('')
  }
}
</script>
