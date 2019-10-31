<template>
  <div class="dsf_content">
    <div class="dsf_content_section">
      <div class="dsf_content_item">
        <div class="dsf_content_itemL">
          <nodeTree :disabled="false"
            :loadNode="loadNode"
            ref="nodeTree"
            :searchShow="searchShow"
            @nodeClick="nodeClick">
            <!-- 搜索框 -->
            <template slot="search">
              <div class="tree_search">
                <dy-input v-model="searchNode"
                  placeholder="搜索..."
                  @keyup.enter="searchName()"
                  suffix-icon="search"
                  @suffix-action="searchName()"
                  maxlength="16"
                  style="width:100%"></dy-input>
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
        <!-- 管理员列表开始 -->
        <router-view></router-view>
        <!-- 管理员列表结束 -->
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import nodeTree from '../common/nodeTree'
import systemManage from '../api' // 引入API

export default {
  data() {
    return {
      searchNode: '',
      getList: [],
      arr: [],
      searchShow: false,
      defaultProps: {
        label: 'deptName',
        isLeaf: 'isleaf'
      }
    }
  },
  components: {
    nodeTree
  },
  methods: {
    // 筛选节点，节点查询
    searchInfo(data) {
      this.changeAdminDeptID(data)
      this.$router.push({
        name: 'adminList'
      })
    },
    // 搜索查询树节点jsx
    renderNode(h, { node, data, store }) {
      if (this.render) {
        return this.render(h, { node, data, store })
      }
      return (
        <span class="treebox-node" title={data.deptName}>
          <i class="iconfont icon-bumen-xuxin" />
          <i class="iconfont icon-bumen-shixin" />
          <span class="treebox_node_label">{data.deptName}</span>
        </span>
      )
    },
    // 监听节点被点击
    nodeClick(val) {
      this.changeAdminDeptID(val)
      this.$router.push({
        name: 'adminList'
      })
    },
    // 更新deptid
    changeAdminDeptID(params) {
      this.$store.commit('updateAdminDeptID', params)
    },
    // 根据名称查询
    searchName() {
      if (!this.searchNode.trim()) {
        this.searchShow = false
        return
      }
      let params = {
        deptName: this.searchNode,
        page: 1,
        limit: 999
      }
      systemManage.search(params).then(response => {
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
            let arr = []
            if (data.length > 0) {
              data.forEach(item => {
                item.name = item.deptName
                item.isLeaf = !item.isleaf
                arr.push(item)
              })
            }
            resolve(arr)
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
        return
      }
      this.$nextTick(() => {
        this.$refs.nodeTree.$el &&
          this.$refs.nodeTree.$el.children[1].firstChild.__vue__.setCurrentKey(
            1
          )
      })
      resolve(this.arr)
    }
  }
}
</script>
