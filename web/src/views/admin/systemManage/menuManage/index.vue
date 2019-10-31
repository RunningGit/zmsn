<template>
  <div class="dsf_content">
    <div class="dsf_content_section">
      <div class="dsf_content_item">
        <div class="dsf_content_itemL">
          <nodeTree :disabled="false"
            :key="this.$store.state.resetNodeTree"
            :loadNode="loadNode"
            :searchShow="searchShow"
            @nodeClick="nodeClick"
            thisId='id'>
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
                <span class="tree_search_add"
                  v-permission="'dsf:menu:save'">
                  <i @click="showTooltip = !showTooltip">+新增</i>
                  <transition :name="listSlideName">
                    <span class="tree_btn"
                      :class="listSlideName"
                      v-clickoutside="handleClose"
                      v-show="showTooltip">
                      <router-link :to="{name: 'menuAdd',query: {type:'0'}}"
                        tag="a"
                        class="tree_btn_txt"
                        @click.native="showTooltip = false"
                        href="javascript:;">目录</router-link>
                      <router-link :to="{name: 'menuAdd',query: {type:'1'}}"
                        tag="a"
                        class="tree_btn_txt"
                        @click.native="showTooltip = false"
                        href="javascript:;">菜单</router-link>
                      <router-link :to="{name: 'menuAdd',query: {type:'2'}}"
                        tag="a"
                        class="tree_btn_txt"
                        @click.native="showTooltip = false"
                        href="javascript:;">按钮</router-link>
                    </span>
                  </transition>
                </span>
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
        <!-- 机构信息开始 -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import nodeTree from '../common/nodeTree'
import systemManage from '../api'
import clickoutside from '@/directives/clickoutside' // 引入自定义事件 捕捉点击页面其它区域事件
import permission from '@/directives/permission'

export default {
  data() {
    return {
      dataList: [],
      searchNode: '',
      listSlideName: 'toolTip-slide-up',
      showTooltip: false,
      searchShow: false,
      getList: [],
      defaultProps: {
        label: 'name',
        isLeaf: 'isleaf'
      }
    }
  },
  components: {
    nodeTree
  },
  directives: { clickoutside, permission },
  methods: {
    // 筛选节点，节点查询
    searchInfo(data) {
      this.changeMenuID(data)
      this.$router.push({
        name: 'menuDetail'
      })
    },
    // 搜索查询树节点jsx
    renderNode(h, { node, data, store }) {
      if (this.render) {
        return this.render(h, { node, data, store })
      }
      return (
        <span class="treebox-node" title={data.name}>
          <i class="iconfont icon-bumen-xuxin" />
          <i class="iconfont icon-bumen-shixin" />
          <span class="treebox_node_label">{data.name}</span>
        </span>
      )
    },
    // 搜索
    searchName() {
      if (!this.searchNode.trim()) {
        this.searchShow = false
        return
      }
      let params = {
        menuName: this.searchNode,
        page: 1,
        limit: 999
      }
      systemManage.getMenuName(params).then(response => {
        if (response.data.code === 0) {
          this.getList = []
          let datalist = response.data.data
          if (datalist.length > 0) {
            datalist.forEach(item => {
              item.id = item.menuId
            })
          }
          this.getList = datalist
          this.searchShow = true
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 加载菜单树数据
    loadNode(node, resolve) {
      if (node.level === 0) {
        systemManage.getMenuTree(0).then(response => {
          if (response.data.code === 0) {
            let data = response.data.data
            if (data.length > 0) {
              data.forEach(item => {
                item.id = item.menuId
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
        let params = node.data.menuId
        systemManage.getMenuTree(params).then(response => {
          if (response.data.code === 0) {
            let data = response.data.data
            if (data.length > 0) {
              data.forEach(item => {
                item.id = item.menuId
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
    // 节点筛选
    searchClick(val) {
      this.changeMenuID(val)
      this.$router.push({
        name: 'menuDetail'
      })
    },
    // 监听节点被点击
    nodeClick(val) {
      this.changeMenuID(val)
      this.$router.push({
        name: 'menuDetail'
      })
    },
    // 更新menuid
    changeMenuID(params) {
      this.$store.commit('updateMenuID', params)
    },
    // 点击空白处的监听
    handleClose() {
      this.showTooltip = false
    }
  },
  // 页面销毁的时候重置vuex
  destroyed() {
    this.changeMenuID({ id: '' })
  }
}
</script>
