<template>
  <div class="dsf_content_itemR">
    <div class="dsf_system_title">
      <h1 v-if="detailTrue">角色详情</h1>
      <h1 v-else>角色编辑</h1>
    </div>
    <div class="dsf_system_btn">
      <div v-if="detailTrue">
        <dy-button @click="returnlink()">
          <i class="iconfont icon-angle-double-left"></i>返回</dy-button>
        <dy-button @click="gotocompile()"
          v-permission="'dsf:role:save'"
          v-if="detailTrue">编辑</dy-button>
      </div>
      <div v-if="!detailTrue">
        <dy-button type="primary"
          @click="updateRoleDetail()">保存</dy-button>
        <dy-button @click="returnlink">取消</dy-button>
      </div>
    </div>
    <div class="dsf_system_section dsf_role_section">
      <div class="dsf_label_item">
        <label class="dsf_label_name">
          <span class="dsf_require"
            v-if="!detailTrue">*</span>角色名称：</label>
        <div class="dsf_label_input">
          <label v-if="detailTrue">{{roleName}}</label>
          <template v-else>
            <dy-input type="input"
              maxlength="32"
              width='204'
              placeholder="请填写角色名称"
              v-model="roleName">
            </dy-input>
          </template>
        </div>
      </div>
      <template v-if="this.dataID != '1'">
        <div class="dsf_label_item"
          v-if="detailTrue">
          <label class="dsf_label_name">上级角色：</label>
          <div class="dsf_label_input">
            <label>{{parentName}}</label>
          </div>
        </div>
        <template v-else>
          <input-extends :setDate="ParentRole"
            @listener="getUserList"
            :editData="editContactsUser"></input-extends>
        </template>
      </template>
      <div class="dsf_label_item">
        <label class="dsf_label_name">权限选择：</label>
        <div class="dsf_label_input dsf_role_item dsf_label_top dsf_rolelist">
          <el-tree :data="permissionList"
            :props="props"
            show-checkbox
            :label="permissionList.name"
            node-key="menuId"
            :default-checked-keys="menuIdList"
            ref="menuListTree"
            @check="handleCheckChange">
          </el-tree>
        </div>
      </div>
      <div class="dsf_label_item">
        <label class="dsf_label_name">备注：</label>
        <div class="dsf_label_input dsf_label_top">
          <label v-if="detailTrue">{{remark}}</label>
          <template v-else>
            <dy-input type="textarea"
              rows="7"
              maxlength="200"
              placeholder="请输入备注"
              v-model="remark"
              class="dsf_label_textarea unClearable">
            </dy-input>
          </template>
        </div>
      </div>
    </div>
    <div class="dsf_system_btn">
      <div v-if="detailTrue">
        <dy-button @click="returnlink()">
          <i class="iconfont icon-angle-double-left"></i>返回</dy-button>
        <dy-button @click="gotocompile()"
          v-permission="'dsf:role:save'"
          v-if="detailTrue">编辑</dy-button>
      </div>
      <div v-if="!detailTrue">
        <dy-button type="primary"
          @click="updateRoleDetail()">保存</dy-button>
        <dy-button @click="returnlink">取消</dy-button>
      </div>
    </div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入API
import { treeDataTranslate } from '@/utils/index'
import inputExtends from '../common/inputExtends'
import permission from '@/directives/permission'

export default {
  data() {
    return {
      roleName: '', // 角色名称
      remark: '', // 备注
      parentId: '',
      parentName: '',
      permissionList: [], // 权限list,
      menuIdList: [], // 选中的权限id
      props: {
        label: 'name'
      },
      dataID: '',
      detailTrue: true,
      menuIdListData: {
        parentIdList: [],
        childrenList: []
      },
      menuIdListDataNow: [],
      checkChange: false,
      tempKey: '-666666', // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      ParentRole: {
        label: '上级角色：',
        dialogTitle: '选择角色',
        dialogW: '550px',
        required: true,
        searchType: 3,
        placeholderName: '角色'
      },
      editContactsUser: [] // 数据回显
    }
  },
  directives: { permission },
  components: {
    inputExtends
  },
  watch: {
    $route(to, from) {
      if (to.name === from.name && to.name === 'roleDetail') {
        this.editContactsUser = []
        this.init()
      }
    }
  },
  created() {
    // 权限认证
    this.init()
  },
  methods: {
    init() {
      this.dataID = this.$route.query.id // 角色ID
      let pageType = this.$route.query.type
      // 判断该页面是处于查看详情还是编辑状态--自定义:detail:详情页  compile:编辑状态页面
      if (pageType === 'detail') {
        this.detailTrue = true
      } else {
        this.detailTrue = false
      }
      this.getRoleDetail()
    },
    returnlink: function() {
      this.$router.push({
        name: 'userAuthorization'
      })
    },
    // 获取部门数据集合
    getUserList(msg) {
      this.parentId = ''
      if (msg.length > 0) {
        this.parentId = msg[0].roleId || msg[0].id
      }
    },
    gotocompile() {
      this.$router.push({
        name: 'roleDetail',
        query: { id: this.dataID, type: 'compile' }
      })
    },
    // 获取详情信息
    getRoleDetail() {
      systemManage.getRoleDetail(this.dataID).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          let data = response.data.data
          this.roleName = data.roleName
          this.remark = data.roleRemark
          this.parentId = data.parentId
          this.parentName = data.parentName
          let editContactsUserData = {
            name: data.parentName,
            id: data.parentId
          }
          this.editContactsUser.push(editContactsUserData)
          this.menuIdListDataNow = [...data.menuIdList]
          let idx = data.menuIdList.indexOf(this.tempKey)
          if (idx !== -1) {
            data.menuIdList.splice(idx, data.menuIdList.length - idx)
          }
          this.menuIdList = data.menuIdList
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
        this.getPermissionList()
      })
    },
    // 请求权限列表
    getPermissionList() {
      systemManage.getPermissionList().then(response => {
        if (response.status === 200 && response.data.code === 0) {
          let data = response.data.data
          this.permissionList = treeDataTranslate(data, 'menuId', 'parentId')
          this.TraversalObject(this.permissionList)
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    handleCheckChange(data, Keys) {
      this.checkChange = true
      this.menuIdListData.parentIdList = Keys.halfCheckedKeys
      this.menuIdListData.childrenList = Keys.checkedKeys
    },
    // 保存编辑状态上做的修改
    updateRoleDetail() {
      let params = {
        id: this.dataID,
        menuIdList: [].concat(
          this.menuIdListData.childrenList,
          [this.tempKey],
          this.menuIdListData.parentIdList
        ),
        roleName: this.roleName, // 角色名称
        roleRemark: this.remark, // 备注
        parentId: this.parentId
      }
      if (this.menuIdListData.childrenList.length === 0 && !this.checkChange) {
        params.menuIdList = this.menuIdListDataNow
      }
      if (!this.roleName) {
        this.$ego.alertMsg('请输入角色名称', 'warning', 1000)
        return false
      }
      if (this.parentId === '') {
        this.$ego.alertMsg('请选择上级角色', 'warning', 1000)
        return false
      }
      systemManage.updateRoleDetail(params).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          let data = response.data.data
          this.$ego.alertMsg(response.data.msg, 'success', 1000)
          this.changeState()
          this.$router.push({
            name: 'userAuthorization'
          })
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    TraversalObject(obj) {
      for (let a in obj) {
        if (typeof obj[a] === 'object') {
          this.TraversalObject(obj[a]) // 递归遍历
        } else {
          obj.disabled = this.$route.query.type === 'detail'
        }
      }
    },
    // 刷新组织树
    changeState() {
      this.$store.commit('updateResetNodeTree', new Date().getTime())
    }
  }
}
</script>
