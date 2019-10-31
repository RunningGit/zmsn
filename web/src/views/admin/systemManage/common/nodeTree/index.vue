<template>
  <div class="nodeTree">
    <!-- 插入的搜索框 -->
    <slot name="search"></slot>
    <!-- 树结构 -->
    <div class="treebox"
      v-show="!searchShow">
      <!-- 部门树结构 -->
      <el-tree :props="defaultProps"
        ref="tree"
        :load="loadNode"
        node-key="id"
        lazy
        :empty-text="emptyText"
        :expand-on-click-node="false"
        :default-expanded-keys="['1']"
        @node-click="handleNodeClick"
        :render-content="renderContent">
      </el-tree>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import './nodeTree.less'

export default {
  props: {
    /**
     * 树型节点数据
     */
    loadNode: {
      type: Function
    },
    /**
     * 节点置灰开关，不可点击，默认允许置灰
     */
    disabled: {
      type: Boolean,
      default: true
    },
    /**
     * 隐藏树结构，默认显示
     */
    searchShow: {
      type: Boolean,
      default: false
    },
    /**
     * 自定义tree结构的回调函数事件
     */
    render: {
      type: Function,
      default: null
    },
    /**
     * 树无数据时显示的文本
     */
    emptyText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      defaultProps: {
        label: 'name',
        isLeaf: 'isLeaf'
      },
      ditList: [] // 字典树数据
    }
  },
  methods: {
    // 节点内容
    renderContent(h, { node, data, store }) {
      if (this.render) {
        return this.render(h, { node, data, store })
      }
      // 需要打开置灰开关，再需要判断authFlag它的值
      if (!data.authFlag && this.disabled) {
        return (
          <span class="treebox-node treebox-node-disabled" title={node.label}>
            <i class="iconfont icon-bumen-xuxin" />
            <span class="treebox_node_label">{node.label}</span>
          </span>
        )
      } else {
        return (
          <span class="treebox-node" title={node.label}>
            <i class="iconfont icon-bumen-xuxin" />
            <i class="iconfont icon-bumen-shixin" />
            <span class="treebox_node_label">{node.label}</span>
          </span>
        )
      }
    },
    // remove(node, data) {
    //   this.$confirm(`确定对"${data.name}"进行删除操作?`, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       systemManage.del(data.id).then(response => {
    //         if (response.data.code === 0) {
    //           const parent = node.parent
    //           const children = parent.childNodes || parent.data
    //           for (let i = 0; i < children.length; i++) {
    //             if (data.id === children[i].data.id) {
    //               var index = i
    //             }
    //           }
    //           children.splice(index, 1)
    //           this.$ego.alertMsg('删除成功', 'success', 1000)
    //         } else {
    //           this.$ego.alertMsg(response.data.msg, 'danger', 1000)
    //         }
    //       })
    //     })
    //     .catch(() => {})
    // },
    // 节点点击触发事件
    handleNodeClick(data, a, self) {
      // 更换图标,不允许置灰和不置灰动作方可点击,treebox-node提供节点操作可选class
      if (data.authFlag || !this.disabled) {
        this.$emit('nodeClick', data)
      }
    }
  }
}
</script>
