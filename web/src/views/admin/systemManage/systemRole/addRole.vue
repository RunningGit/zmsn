<template>
  <div class="dsf_content_itemR">
    <div class="dsf_system_title">
      <h1>新增角色</h1>
    </div>
    <div class="dsf_system_btn">
      <dy-button type="primary"
        @click="confirmSubmit(1)">保存并继续新增</dy-button>
      <dy-button @click="confirmSubmit(2)">保存</dy-button>
      <dy-button @click="back">取消</dy-button>
    </div>
    <div class="dsf_system_section dsf_role_section">
      <div class="dsf_label_item">
        <label class="dsf_label_name">
          <span class="dsf_require">*</span>角色名称：</label>
        <div class="dsf_label_input">
          <dy-input maxlength="32"
            width="204"
            placeholder="请填写角色名称"
            v-model="form.roleName">
          </dy-input>
        </div>
      </div>
      <input-extends :key="resetKey + '1'"
        :setDate="ParentRole"
        @listener="getUserList"></input-extends>
      <div class="dsf_label_item">
        <label class="dsf_label_name">选择权限：</label>
        <div class="dsf_label_input dsf_role_item dsf_label_top dsf_rolelist">
          <el-tree :data="permissionList"
            :props="props"
            show-checkbox
            :label="permissionList.name"
            node-key="menuId"
            :default-checked-keys="menuIdList"
            @check="handleCheckChange"
            ref="tree">
          </el-tree>
        </div>
      </div>
      <div class="dsf_label_item">
        <label class="dsf_label_name">备注：</label>
        <div class="dsf_label_input dsf_label_top">
          <dy-input type="textarea"
            maxlength="200"
            rows="7"
            class="dsf_label_textarea unClearable"
            placeholder="请输入备注"
            v-model="form.remark">
          </dy-input>
        </div>
      </div>
    </div>
    <div class="dsf_system_btn">
      <dy-button type="primary"
        @click="confirmSubmit(1)">保存并继续新增</dy-button>
      <dy-button @click="confirmSubmit(2)">保存</dy-button>
      <dy-button @click="back">取消</dy-button>
    </div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入API
import inputExtends from '../common/inputExtends'
import { treeDataTranslate } from '@/utils/index'

export default {
  data() {
    return {
      form: {
        roleName: '', // 角色名称
        remark: '', // 备注
        parentId: ''
      },
      permissionList: [], // 权限list,
      menuIdList: [],
      props: {
        label: 'name'
      },
      menuIdListData: {
        parentIdList: [],
        childrenList: []
      },
      tempKey: -666666, // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      ParentRole: {
        label: '上级角色：',
        dialogTitle: '选择角色',
        dialogW: '550px',
        required: true,
        searchType: 3,
        placeholderName: '角色'
      },
      resetKey: new Date().getTime() // 重置数据
    }
  },
  components: {
    inputExtends
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getPermissionList()
    },
    //  返回角色列表
    back() {
      this.$router.push({
        name: 'userAuthorization'
      })
    },
    // 获取角色数据集合
    getUserList(msg) {
      this.form.parentId = ''
      if (msg.length > 0) {
        this.form.parentId = msg[0].id
      }
    },
    // 请求权限列表
    getPermissionList() {
      systemManage.getPermissionList().then(response => {
        if (response.data.code === 0) {
          let data = response.data.data
          this.permissionList = treeDataTranslate(data, 'menuId')
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 选中了树状图节点,拿到选中的节点id
    handleCheckChange(data, Keys) {
      this.menuIdListData.parentIdList = Keys.halfCheckedKeys
      this.menuIdListData.childrenList = Keys.checkedKeys
    },
    // 提交新增角色
    confirmSubmit(type) {
      var params = {
        menuIdList: [].concat(
          this.menuIdListData.childrenList,
          [this.tempKey],
          this.menuIdListData.parentIdList
        ),
        roleName: this.form.roleName, // 角色名称
        roleRemark: this.form.remark, // 备注
        parentId: this.form.parentId
      }
      let input = /^[\s]*$/
      if (input.test(this.form.roleName)) {
        this.$ego.alertMsg('请输入角色名称', 'warning', 1000)
        return false
      }
      if (input.test(this.form.parentId)) {
        this.$ego.alertMsg('请选择上级角色', 'warning', 1000)
        return false
      }
      systemManage.saveAddRole(params).then(response => {
        if (response.data.code === 0) {
          let data = response.data.data
          this.$ego.alertMsg(response.data.msg, 'success', 1000)
          this.changeState()
          if (type === 1) {
            this.form.roleName = ''
            this.form.remark = ''
            // 重置组件中数据
            this.resetKey = new Date().getTime()
            this.getPermissionList()
          } else {
            this.back()
          }
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 刷新组织树
    changeState() {
      this.$store.commit('updateResetNodeTree', new Date().getTime())
    }
  }
}
</script>
