<template>
  <div class="dsf_content">
    <div class="dsf_content_section">
      <div class="dsf_content_item">
        <div class="dsf_content_itemL">
          <nodeTree :key="this.$store.state.resetNodeTree + '1'"
            :disabled="false"
            :loadNode="loadNode"
            :searchShow="searchShow"
            @nodeClick="nodeClick">
            <!-- 搜索框 -->
            <template slot="search">
              <div class="tree_search tree_search_addcontent">
                <dy-input v-model="searchNode"
                  placeholder="搜索..."
                  @keyup.enter="searchName()"
                  suffix-icon="search"
                  @suffix-action="searchName()"
                  maxlength="16"
                  style="width:80%"></dy-input>
                <span @click="addMenu"
                  v-permission="'dsf:ditionaryCategory:save'"
                  class="tree_search_add">+新增</span>
              </div>
              <template v-if="searchShow">
                <!-- 部门树结构 -->
                <nodeTree :disabled="false"
                  :key='nodeflag + "2"'
                  :loadNode="searchLoadNode"
                  :searchShow="!searchShow"
                  :emptyText="emptyText"
                  @nodeClick="nodeClick">
                </nodeTree>
              </template>
            </template>
          </nodeTree>
        </div>
        <!-- 机构信息开始 -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import nodeTree from '../common/nodeTree'
import systemManage from '../api' // 引入API
import permission from '@/directives/permission'

export default {
  data() {
    return {
      searchNode: '',
      searchShow: false,
      emptyText: '',
      nodeflag: new Date().getTime()
    }
  },
  components: {
    nodeTree
  },
  directives: { permission },
  methods: {
    // 全局新增
    addMenu() {
      this.$router.push({ name: 'dictionaryManageAdd' })
    },
    // 根据名称查询
    searchName() {
      this.nodeflag = new Date().getTime()
      if (!this.searchNode.trim()) {
        this.searchShow = false
        this.emptyText = ''
        return false
      }
      this.searchShow = true
    },
    // 监听节点被点击
    nodeClick(val) {
      this.changeDitID(val)
      this.$router.push({
        name: 'dictionaryManage'
      })
    },
    // 更新deptid
    changeDitID(params) {
      this.$store.commit('updateDitID', params)
    },
    // 搜索字典筛选
    searchLoadNode(node, resolve) {
      if (node.level === 0) {
        let params1 = {
          dicCode: this.searchNode
        }
        systemManage.getDitList(params1).then(response => {
          if (response.data.code === 0) {
            let data = response.data.data
            if (data.length === 0) {
              this.emptyText = '无搜索结果'
              return
            }
            if (data.length > 0) {
              data.forEach(item => {
                item.name = item.dicDesc + '(' + item.dicCode + ')'
                item.id = item.dicId
                item.isLeaf = item.leaf === '0'
              })
            }
            resolve(data)
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
      }
      if (node.level > 0) {
        let params = {
          lev: node.data.level
        }
        params.pid = node.level === 1 ? node.data.dicId : node.data.dtId
        systemManage.getDitChildList(params).then(response => {
          if (response.data.code === 0) {
            let data = response.data.data
            if (data.length > 0) {
              data.forEach(item => {
                item.name = item.dtDesc + '(' + item.dtCode + ')'
                // 自身id
                item.id = item.dtId
                // 父id
                item.pid = item.dicId
                item.isLeaf = item.leaf === '0'
              })
            }
            resolve(data)
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
      }
    },
    // 动态加载字典结构
    loadNode(node, resolve) {
      if (node.level === 0) {
        systemManage.getDitList().then(response => {
          if (response.data.code === 0) {
            let data = response.data.data
            if (data.length > 0) {
              data.forEach(item => {
                item.name = item.dicDesc + '(' + item.dicCode + ')'
                item.id = item.dicId
                item.isLeaf = item.leaf === '0'
              })
            }
            resolve(data)
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
      }
      if (node.level > 0) {
        let params = {
          lev: node.data.lev
        }
        params.pid = node.level === 1 ? node.data.dicId : node.data.dtId
        systemManage.getDitChildList(params).then(response => {
          if (response.data.code === 0) {
            let data = response.data.data
            if (data.length > 0) {
              data.forEach(item => {
                item.name = item.dtDesc + '(' + item.dtCode + ')'
                // 自身id
                item.id = item.dtId
                // 父id
                item.pid = item.dicId
                item.isLeaf = item.leaf === '0'
              })
            }
            resolve(data)
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
      }
    }
  },
  // 页面销毁的时候重置vuex
  destroyed() {
    this.changeDitID({ id: '' })
  }
}
</script>
