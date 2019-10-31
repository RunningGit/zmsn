<template>
  <div class="dsf_content_itemR">
    <template v-if="menuId !== ''">
      <template v-if="dataList">
        <!--菜单详情开始  -->
        <div class="dsf_system_title">
          <h1>{{type}}</h1>
        </div>
        <div class="dsf_system_btn">
          <dy-button v-permission="'dsf:menu:update'"
            @click="edit()">编辑</dy-button>
          <dy-button v-permission="'dsf:menu:delete'"
            @click="delMenu()">删除</dy-button>
        </div>
        <div class="dsf_system_section dsf_menu_section">
          <div class="dsf_label_item">
            <label class="dsf_label_name">类型：</label>
            <div class="dsf_label_input">{{type}}</div>
          </div>
          <div class="dsf_label_item">
            <label class="dsf_label_name">名称：</label>
            <div class="dsf_label_input">{{form.name}}</div>
          </div>
          <div class="dsf_label_item">
            <label class="dsf_label_name"
              v-if="dataList.type === 2">上级菜单：</label>
            <label class="dsf_label_name"
              v-else>上级目录：</label>
            <div class="dsf_label_input">{{form.parentName || '一级菜单'}}</div>
          </div>
          <div class="dsf_label_item"
            v-show="form.type === 1">
            <label class="dsf_label_name">菜单URL：</label>
            <div class="dsf_label_input dsf_label_top">{{form.url}}</div>
          </div>
          <div class="dsf_label_item"
            v-show="form.type !== 0">
            <label class="dsf_label_name">权限标识：</label>
            <div class="dsf_label_input dsf_label_top">{{form.perms}}</div>
          </div>
          <div class="dsf_label_item"
            style="margin-bottom:0"
            v-show="form.type === 2">
            <label class="dsf_label_name">权限类型：</label>
            <div class="dsf_label_input">{{form.rwAccess === '1'?'读写数据':'读数据'}}</div>
          </div>
          <div class="dsf_label_item"
            v-show="form.type !== 2">
            <label class="dsf_label_name">排序号：</label>
            <div class="dsf_label_input">{{form.orderNo}}</div>
          </div>
        </div>
        <div class="dsf_system_btn">
          <dy-button v-permission="'dsf:menu:update'"
            @click="edit()">编辑</dy-button>
          <dy-button v-permission="'dsf:menu:delete'"
            @click="delMenu()">删除</dy-button>
        </div>
      </template>
    </template>
    <div v-else
      class="dsf_defualt_image"></div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入相应API
import permission from '@/directives/permission'

export default {
  data() {
    return {
      dataList: '',
      type: '',
      form: {
        type: 0,
        name: '',
        parentId: 0,
        parentName: '',
        url: '',
        perms: '',
        orderNo: '',
        rwAccess: ''
      },
      menuId: this.$store.state.menuData.id
    }
  },
  directives: { permission },
  methods: {
    // 初始查询菜单详情
    init() {
      // 第一次进来内容为空，不查询
      if (this.menuId) this.getInfo(this.menuId)
    },
    // 获取菜单信息
    getInfo(params) {
      systemManage.infoMenu(params).then(response => {
        if (response.data.code === 0) {
          Object.assign(this.form, response.data.data)
          this.dataList = response.data.data
          this.$nextTick(() => {
            if (this.dataList.type === 0) {
              this.type = '目录'
            } else if (this.dataList.type === 1) {
              this.type = '菜单'
            } else {
              this.type = '按钮'
            }
          })
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 删除菜单
    delMenu() {
      let id = this.dataList.menuId
      let name = this.dataList.name
      this.$confirm(`是否删除"${name}"?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delData(id)
        })
        .catch(() => {})
    },
    // 删除数据
    delData(params) {
      systemManage.delMenu(params).then(response => {
        if (response.data.code === 0) {
          this.$ego.alertMsg('删除成功', 'success', 1000)
          this.back()
          this.changeState()
          this.$store.commit('updateMenuID', { id: '' })
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 返回菜单列表
    back() {
      this.$router.push({
        name: 'menuDetail'
      })
    },
    // 刷新组织树
    changeState() {
      this.$store.commit('updateResetNodeTree', new Date().getTime())
    },
    // 编辑菜单
    edit() {
      this.$router.push({
        name: 'menuAdd',
        query: {
          id: this.dataList.menuId,
          type: this.dataList.type.toString(),
          name: 'edit'
        }
      })
    }
  },
  computed: {
    listenMenuID() {
      return this.$store.state.menuData
    }
  },
  watch: {
    // 监听id的变化
    listenMenuID(newVal, oldVal) {
      this.menuId = newVal.id
      if (this.menuId) this.getInfo(newVal.id)
    }
  },
  mounted() {
    this.init()
  }
}
</script>
