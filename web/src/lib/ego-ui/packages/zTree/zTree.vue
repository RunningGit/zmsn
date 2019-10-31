<template>
  <div class="ztree">
    <z-tree-node
    :datas="datas"
    :service-name="serviceName"
    :deep="0"
    :enable-drag="enableDrag"
    :drag-mode="dragMode"
    :key-bind="keyBind"
    :actived-on-leaf="activedOnLeaf"
    :default-expand-all="defaultExpandAll"
    :expand-on-active="expandOnActive"
    :lazy="lazy"
    :load="load"
    >
    </z-tree-node>
  </div>
</template>
<script>
import ZTreeNode from './zTreeNode'
import ZTreeStore from './zTreeStore'

const utils = ZTreeStore.utils
let serviceId = 1
let classUtils = (function() {
  const actions = ['add', 'remove']
  if (document.body.classList) {
    return function(action, el, className) {
      if (actions.indexOf(action) === -1) return
      el.classList[action](className)
    }
  } else {
    return function(action, el, className) {
      if (actions.indexOf(action) === -1) return
      const classArr = el.className ? el.className.split(/\s+/) : []
      const pos = classArr.indexOf(className)
      if (action === 'add' && pos === -1) {
        classArr.push(className)
      } else if (action === 'remove' && pos !== -1) {
        classArr.splice(pos, 1)
      }
      el.className = classArr.join(' ')
    }
  }
})()
export default {
  name: 'ZTree',
  components: {
    ZTreeNode
  },
  props: {
    datas: {
      type: Array,
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
    this.initDragula()
  },
  beforeDestroy() {
    this.destroyDragula()
  },
  data() {
    this.store = new ZTreeStore({
      keyBind: this.keyBind,
      datas: this.datas,
      tree: this
    })
    return {
      deep: 1,
      activeNode: this.store.activeNode,
      expandKeys: this.store.expandKeys,
      serviceName: 'effects' + serviceId++,
      tree: this
    }
  },
  watch: {
    activeNode: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.tree.$emit('activeNode', this.store.getNode(this.activeNode.id))
        })
      }
    },
    datas(val) {
      this.store.setDatas(val)
    }
  },
  methods: {
    initDragula() {
      if (this.enableDrag) {
        let dragula = this.$dragula
        this.service = dragula.createService({
          name: this.serviceName,
          logging: {
            directive: false,
            plugin: false,
            modelManager: false,
            dragHandler: false,
            service: false
          },
          drake: {
            direction: 'vertical',
            copy: false,
            accepts(el, target, source, sibling) {
              return target === source
            },
            moves(el, target, source, sibling) {
              return source.className === 'gu-handle'
            }
          }
        })
        this.service.service(this.serviceName).on({
          [this.serviceName + ':dropModel']: ({
            dragIndex,
            dropIndex,
            sourceModel
          }) => {
            this.tree.$emit(
              'dragEnd',
              sourceModel.model,
              dropIndex,
              dragIndex,
              () => {
                this.dragUndo(sourceModel.modelRef, dropIndex, dragIndex)
              }
            )
          },
          // [this.serviceName + ':insertAt']: datas => {
          //   console.log('insertAt' + datas)
          // },
          drag: ({ el, container, service, drake }) => {
            classUtils('remove', el, 'ex-moved')
          },
          drop: ({ el, container }) => {
            classUtils('add', el, 'ex-moved')
          },
          over: ({ el, container }) => {
            classUtils('add', el, 'ex-over')
          },
          out: ({ el, container }) => {
            classUtils('remove', el, 'ex-over')
          }
        })
      }
    },
    destroyDragula() {
      if (this.service) {
        const dragulaService = this.service.service(this.serviceName)
        dragulaService.eventBus.$destroy()
        dragulaService.destroy('default')
      }
    },
    dragUndo(sourceModel, dropIndex, dragIndex) {
      let datas = sourceModel.splice(dropIndex, 1)
      sourceModel.splice(dragIndex, 0, datas[0])
      this.tree.$emit('dragUndo', sourceModel)
    },
    toggleExpand(nodeId, forceExpand) {
      const node = this.store.getNode(nodeId)
      if (!node || node.isLeaf()) return
      const pos = this.expandKeys.indexOf(node.key)
      if (typeof forceExpand === 'boolean') {
        if (pos === -1 && forceExpand) {
          this.expandKeys.push(node.key)
        } else if (pos !== -1 && !forceExpand) {
          this.expandKeys.splice(pos, 1)
        }
      } else {
        if (pos !== -1) {
          this.expandKeys.splice(pos, 1)
        } else {
          this.expandKeys.push(node.key)
        }
      }
    },
    setActive(nodeId = -1) {
      this.$nextTick(() => {
        const node = this.store.getNode(nodeId)
        this.activeNode.triggerId = node.key // 触发节点点击
      })
    },
    addNodes(datas, parentId) {
      if (!utils.isArray(datas)) return
      const childrenKey = this.keyBind.children
      const parentNode = parentId
        ? this.store.getNode(parentId)
        : this.store.root
      if (parentNode) {
        let children = parentNode.getChildren()
        if (utils.isArray(children)) {
          children.splice(children.length, 0, ...datas)
        } else {
          this.$set(parentNode.data, this.keyBind.children, datas)
        }

        this.store.registerNodes(datas, parentId)
        this.toggleExpand(parentId, true)
        this.setActive() // 添加完成取消节点选中状态
      } else {
        console.warn('ztree:addNodes:找不到父节点id为' + parentId + '的元素')
      }
    },
    addNode(data, parentId) {
      if (utils.isObject(data) && !utils.isEmptyObject(data)) {
        this.addNodes([data], parentId)
      }
    },
    removeNode(nodeId) {
      const node = this.store.getNode(nodeId)
      if (!node) {
        return
      }
      const parentNode = this.store.getNode(node.parentId)
      if (!parentNode) {
        return
      }
      const children = parentNode.getChildren()
      if (!utils.isArray(children) || utils.isEmptyArray(children)) {
        return
      }
      const pos = children.indexOf(node.data)
      if (pos !== -1) {
        children.splice(pos, 1)
        this.store.deregisterNode(nodeId)
      }
    }
  }
}
</script>
<style lang="less">
@import "./zTree";
.ztree-loading {
  position: relative;
  display: inline-block;
  margin: 0 2px;
  width: 14px;
  height: 14px;
  vertical-align: middle;
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    border-radius: 50%;
    animation-name: loading;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    background: #616bf8;
  }
}
@keyframes loading {
  0% {
    opacity: 0;
    transform: scale(0.2);
  }
  100% {
    opactiy: 1;
    transform: scale(0.6);
  }
}
// vue2-dragula
.gu-mirror {
  position: fixed !important;
  margin: 0 !important;
  z-index: 9999 !important;
  opacity: 0.8;
  -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=80)';
  filter: alpha(opacity=80);
}
.gu-hide {
  display: none !important;
}
.gu-unselectable {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}
.gu-transit {
  opacity: 0.2;
  -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=20)';
  filter: alpha(opacity=20);
  background-color: #a4cdee;
}
.gu-handle {
  width: 14px;
  height: 14px;
  cursor: move;
//   background: url(icon_drag.png) center no-repeat;
//   background-size: contain;
}
</style>
