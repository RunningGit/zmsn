<template>
  <div :class="{'ztree-node':true,'ztree-node-active':isActive,'ztree-node-expand':isExpand}"
    :deep="deep">
    <div class="ztree-node_inner"
      @click="handleClick()"
      v-if="!isRoot">
      <node-content :node="datas"
        :key-bind="keyBind"
        :drag-mode="dragMode"
        :deep="deep"
        :is-loading="isLoading"
        :is-leaf="isLeaf"
        :is-expand="isExpand">
      </node-content>
    </div>
    <div :class="{'ztree-fold':true}"
      v-dragula="children"
      :service="serviceName"
      v-if="!isLeaf && enableDrag"
      v-show="isExpand">
      <z-tree-node :datas="node"
        v-for="node in children"
        :key="node[keyBind.id]"
        :actived-on-leaf="activedOnLeaf"
        :enable-drag="enableDrag"
        :service-name="serviceName"
        :drag-mode="dragMode"
        :key-bind="keyBind"
        :default-expand-all="defaultExpandAll"
        :expand-on-active="expandOnActive"
        :lazy="lazy"
        :load="load"
        :deep="deep+1">
      </z-tree-node>
    </div>
    <div :class="{'ztree-fold':true}"
      v-if="!isLeaf && !enableDrag"
      v-show="isExpand">
      <z-tree-node :datas="node"
        v-for="node in children"
        :key="node[keyBind.id]"
        :actived-on-leaf="activedOnLeaf"
        :enable-drag="enableDrag"
        :service-name="serviceName"
        :drag-mode="dragMode"
        :key-bind="keyBind"
        :default-expand-all="defaultExpandAll"
        :expand-on-active="expandOnActive"
        :lazy="lazy"
        :load="load"
        :deep="deep+1">
      </z-tree-node>
    </div>
  </div>
</template>
<script>
import ZTreeStore from './zTreeStore'
const utils = ZTreeStore.utils
export default {
  name: 'ZTreeNode',
  components: {
    NodeContent: {
      inheritAttrs: false,
      props: {
        node: {
          required: true
        },
        isLeaf: {
          required: true,
          type: Boolean
        },
        keyBind: {
          required: true,
          type: Object
        },
        dragMode: {
          required: true,
          type: Boolean
        },
        isLoading: {
          type: Boolean,
          default: false
        },
        isExpand: {
          required: true,
          type: Boolean
        }
      },
      render(h) {
        const tree = this.$parent.tree
        const node = this.node
        const dragMode = this.dragMode
        const deep = this.$attrs.deep
        const isLoading = this.isLoading
        const isLeaf = this.isLeaf
        const isExpand = this.isExpand
        return tree.$scopedSlots.default ? (
          tree.$scopedSlots.default({
            node,
            dragMode,
            deep,
            isLoading,
            isLeaf,
            isExpand
          })
        ) : (
          <span>
            <i class="gu-handle" style={dragMode ? '' : 'display:none'}>
              =
            </i>
            {node[this.keyBind.name]}
          </span>
        )
      }
    }
  },
  props: {
    datas: {
      type: [Array, Object],
      default() {
        return []
      }
    },
    /**
     * 是否开启拖拽功能
     */
    enableDrag: {
      type: Boolean,
      default: false
    },
    /**
     * 是否拖拽状态，前提是要先开启拖拽功能
     */
    dragMode: {
      type: Boolean,
      default: true
    },
    /**
     * 键值映射
     */
    keyBind: {
      type: Object,
      default() {
        return {
          id: 'id',
          name: 'name',
          children: 'children'
        }
      }
    },
    /**
     * 选中状态只应用于叶子节点
     */
    activedOnLeaf: {
      type: Boolean,
      default: true
    },
    /**
     * 展开路径节点
     */
    expandOnActive: {
      type: Boolean,
      default: true
    },
    /**
     * 是否默认展开所有
     */
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    deep: {
      type: Number,
      default: 1
    },
    serviceName: {
      type: String,
      default: ''
    },
    /**
     * 是否开启节点懒加载
     */
    lazy: {
      type: Boolean,
      default: true
    },
    /**
     * 懒加载执行函数，返回false表示叶子节点，返回数组表示普通节点
     */
    load: {
      type: Function,
      default() {
        return function() {
          return true
        }
      }
    }
  },
  created() {
    // 默认展开初始化
    if (!this.defaultExpandAll && !this.isRoot && !this.isLeaf) {
      this.expandKeys.push(this.key)
    }
  },
  data() {
    const tree = this.$parent.tree
    const store = tree.store
    this.store = store
    return {
      tree: tree,
      isRoot: this.datas instanceof Array,
      activeNode: store.activeNode,
      expandKeys: store.expandKeys,
      key: this.datas[this.keyBind.id],
      isLoading: false
    }
  },
  computed: {
    isLeaf() {
      if (this.isRoot) {
        return false
      }
      return !utils.isArray(this.children)
    },
    isExpand() {
      return (
        (this.isLeaf || !this.expandKeys ? false : this.isRoot) ||
        this.expandKeys.indexOf(this.key) !== -1
      )
    },
    isActive() {
      if (this.activedOnLeaf) {
        if (this.isLeaf && this.activeNode.id === this.key) {
          return true
        }
      } else {
        if (this.activeNode.id === this.key) {
          return true
        }
      }
      return false
    },
    children() {
      return this.isRoot ? this.datas : this.datas[this.keyBind.children]
    }
  },
  watch: {
    'activeNode.triggerId'(val) {
      // 触发当前节点点击
      if (val === this.key) {
        this.handleClick()
      }
    }
  },
  methods: {
    handleClick() {
      if (this.lazyLoad() || !this.activedOnLeaf) {
        this.setActive()
        this.toggleExpand()
      }
    },
    toggleExpand() {
      if (this.isLeaf) return
      const pos = this.expandKeys.indexOf(this.key)
      if (pos !== -1) {
        this.expandKeys.splice(pos, 1)
      } else {
        this.expandKeys.push(this.key)
      }
    },
    setActive() {
      const node = this.store.getNode(this.key)
      if ((this.activedOnLeaf && this.isLeaf) || !this.activedOnLeaf) {
        this.activeNode.id = node.key
      }
    },
    lazyLoad() {
      if (this.isLoading) return false
      if (this.lazy) {
        const node = this.isRoot
          ? this.store.root
          : this.store.getNode(this.key)
        return this.load(node, this.lazyLoadStart, this.lazyLoadDone)
      } else {
        return true
      }
    },
    lazyLoadStart() {
      this.isLoading = true
    },
    lazyLoadDone(children) {
      this.isLoading = false
      this.tree.addNodes(children, this.key)
    }
  }
}
</script>
<style lang="less" scoped>
.ztree-node {
  cursor: pointer;
}
.ztree-fold {
  padding-left: 10px;
}
.ztree-node_inner {
  .ztree-node-active > &,
  &:hover {
    color: #4f7fe1;
  }
  .ztree-root > .ztree-node > & {
    padding: 12px 0;
  }
}
</style>
