import Tree from './zTree'

Pagination.install = function(Vue) {
  Vue.component(Tree.name, Tree)
}

export default Tree
