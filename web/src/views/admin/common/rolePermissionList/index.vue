<template>
  <el-tree :data="permissionList"
    :props="props"
    show-checkbox
    :label="permissionList.name"
    :default-expanded-keys="menuIdList"
    node-key="menuId"
    :default-checked-keys="menuIdList">
  </el-tree>
</template>

<script>
// ---------使用方法----------
// menuIdList: 设置选中的权限列表
export default {
  name: 'rolePermissionList',
  // props: ['menuIdList'],
  props: {
    menuIdList: {
      type: Array
    },
    permissionList: {
      type: Array
    }
  },
  data() {
    return {
      // permissionList: [],
      props: {
        label: 'name'
      }
    }
  }
}
</script>
