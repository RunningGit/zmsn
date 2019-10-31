const utils = {
  isArray(data) {
    return data instanceof Array
  },
  isEmptyArray(data) {
    return utils.isArray(data) && data.length === 0
  },
  isEmpty(data) {
    return !data || utils.isEmptyArray(data) || utils.isEmptyObject()
  },
  isObject(data) {
    return typeof data === 'object' && !utils.isArray(data)
  },
  isEmptyObject(data) {
    try {
      return typeof data === 'object' && JSON.parse(data) === '{}'
    } catch (e) {
      // 可能json转失败
      return false
    }
  }
}
class Node {
  constructor(data, parentId, keyBind) {
    this.data = data
    this.key = data[keyBind.id]
    this.parentId = parentId
    this.lazyLoad = false
    this.keyBind = keyBind
  }
  getChildren() {
    return this.data[this.keyBind.children]
  }
  isLeaf() {
    return !utils.isArray(this.getChildren())
  }
}
export default class ZTreeStore {
  static utils = utils
  constructor(options) {
    this.keyBind = options.keyBind
    this.tree = options.tree
    this.activeNode = {
      id: -1,
      triggerId: -1
    }
    this.expandKeys = []
    this.keyMap = {}
    this.datas = []
    this.setDatas(options.datas)
  }
  setDatas(datas) {
    if (!utils.isArray(datas)) return
    if (this.datas !== datas) {
      this.clearNodes()
      this.datas = datas
      this.root = new Node(
        {
          [this.keyBind.id]: 'root',
          [this.keyBind.name]: 'root',
          [this.keyBind.children]: this.datas
        },
        -1,
        this.keyBind
      )
      this.registerNodes(this.datas)
    }
  }
  getNode(key) {
    return key === -1 ? this.root : this.keyMap[key]
  }
  registerNode(data, parentId = -1, update) {
    if (!utils.isObject(data) || utils.isEmptyObject(data)) return
    const id = data[this.keyBind.id]
    let node = this.getNode(id)
    let children
    if (!node) {
      this.keyMap[id] = new Node(data, parentId, this.keyBind)
      node = this.keyMap[id]
    }
    children = node.getChildren()
    if (children instanceof Array) {
      for (let i = 0; i < children.length; i++) {
        this.registerNode(children[i], id)
      }
    }
  }
  registerNodes(datas, parentId) {
    if (utils.isArray(datas)) {
      for (var i = 0; i < datas.length; i++) {
        this.registerNode(datas[i], parentId)
      }
    } else {
      this.registerNode(datas, parentId)
    }
  }
  deregisterNode(key) {
    if (utils.isObject(key)) {
      // 如果是个对象，则为值对象
      key = key.id
    }
    let node = this.getNode(key)
    if (!node) return
    delete this.keyMap[node.key]
    const children = node.getChildren()
    if (utils.isArray(children) && children.length > 0) {
      for (let i = 0; i <= children.length; i++) {
        this.deregisterNode(children[i])
      }
    }
  }
  clearNodes() {
    this.keyMap = []
  }
}
