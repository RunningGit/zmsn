<template>
  <div class="dsf_content_itemR"
    v-show="dataList">
    <!--管理员详情开始-->
    <div class="dsf_system_title">
      <h1>管理员详情</h1>
    </div>
    <div v-show="$route.query.type"
      class="dsf_system_btn">
      <dy-button type="primary"
        :disabled="forbid"
        @click="update()">保存</dy-button>
      <dy-button @click="back()">取消</dy-button>
    </div>
    <div v-show="!$route.query.type"
      class="dsf_system_btn">
      <dy-button @click="back()">
        <i class="iconfont icon-angle-double-left"></i>返回</dy-button>
      <dy-button v-permission="'dsf:user:update'"
        @click="edit()"
        v-show="!(dataList.userName === adminUsername)">编辑</dy-button>
      <dy-button @click="delManager()"
        v-permission="'dsf:user:delete'"
        v-show="!(dataList.userName === adminUsername)">删除</dy-button>
    </div>
    <div class="dsf_system_section">
      <div class="dsf_label_item">
        <label class="dsf_label_name">
          <span v-show="$route.query.type"
            class="dsf_require">*</span>姓名：</label>
        <div class="dsf_label_input">
          <span v-show="!$route.query.type"> {{form.dsfPersonEntity.personName}}</span>
          <dy-input v-show="$route.query.type"
            maxlength="16"
            placeholder="请填写姓名"
            width='204'
            v-model="form.dsfPersonEntity.personName">
          </dy-input>
        </div>
      </div>
      <div class="dsf_label_item">
        <label class="dsf_label_name">
          <span v-show="$route.query.type"
            class="dsf_require">*</span>账号：</label>
        <div class="dsf_label_input">{{form.userName}}</div>
      </div>
      <div class="dsf_label_item">
        <label class="dsf_label_name">
          <span v-show="$route.query.type"
            class="dsf_require">*</span>性别：</label>
        <div class="dsf_label_input">
          <span v-show="!$route.query.type">{{form.dsfPersonEntity.gender === 1?'男':'女'}}</span>
          <define-dict v-show="$route.query.type"
            type="radio"
            dictType="sex"
            @changeSex="changeSex"
            :selectedData="form.dsfPersonEntity.gender"></define-dict>
        </div>
      </div>
      <!-- 所属部门 -->
      <div v-show="!$route.query.type"
        class="dsf_label_item">
        <label class="dsf_label_name">
          <span v-show="$route.query.type"
            class="dsf_require">*</span>所属部门：</label>
        <div class="dsf_label_input">{{form.deptName}}</div>
      </div>
      <input-extends v-show="$route.query.type"
        @listener="getDeptList"
        :setDate="deptParent"
        :editData="editDeptParent"></input-extends>
      <!-- 绑定通讯录用户 -->
      <div v-show="!$route.query.type"
        class="dsf_label_item">
        <label class="dsf_label_name">
          <span v-show="$route.query.type"
            class="dsf_require">*</span>绑定通讯录用户：</label>
        <div class="dsf_label_input">{{form.resouresPersonName}}</div>
      </div>
      <input-extends v-show="$route.query.type"
        @listener="getContactsUserList"
        :setDate="contactsUser"
        :editData="editContactsUser"></input-extends>
      <!-- 通讯录管理权限 -->
      <div v-show="!$route.query.type"
        class="dsf_label_item">
        <label class="dsf_label_name">
          <span v-show="$route.query.type"
            class="dsf_require">*</span>通讯录管理权限：</label>
        <div class="dsf_label_input dsf_label_top">
          <p class="dsf_label_desc"
            v-for="(item,index) in form.dsfUserAddressbookEntityList"
            :key="index">{{item.deptName}} - {{item.rwAccess === '0' ?'只读':'读写'}}</p>
        </div>
      </div>
      <input-extends v-show="$route.query.type"
        @listenerAccess="getContactsAccessList"
        :setDate="contactsAccess"
        :editData="editContactsAccess"
        showSelect></input-extends>
      <!-- 数据权限 -->
      <div v-show="!$route.query.type"
        class="dsf_label_item">
        <label class="dsf_label_name">
          <span v-show="$route.query.type"
            class="dsf_require">*</span>部门管理权限：</label>
        <div class="dsf_label_input dsf_label_top">
          <p class="dsf_label_desc"
            v-for="(item,index) in form.userManageEntityList"
            :key="index">{{item.deptName}} - {{item.rwAccess === '0' ?'只读':'读写'}}</p>
        </div>
      </div>
      <input-extends v-show="$route.query.type"
        @listenerAccess="getDataAccessList"
        :setDate="dataAccess"
        :editData="editDataAccess"
        showSelect></input-extends>
      <!-- 角色授权 -->
      <div class="dsf_label_item">
        <label class="dsf_label_name">角色：</label>
        <template v-show="!$route.query.type">
          <div v-show="form.roles.length !== 0"
            class="dsf_label_input dsf_label_top">
            <el-popover v-for="(item, index) in form.roles"
              :key="index"
              placement="bottom"
              width="250"
              class="marginR10 marginB10"
              style="display:inline-block;color:#409eff"
              trigger="hover">
              <span slot="reference">{{item.roleName}}</span>
              <rolePermissionList :style="{height: '350px',overflowY: 'auto'}"
                :permissionList="permissionList"
                :menuIdList="item.menuIdList"></rolePermissionList>
            </el-popover>
          </div>
        </template>
        <div v-show="$route.query.type"
          class="dsf_label_input">
          <p>通过角色管理的用户授权关联</p>
        </div>
      </div>
    </div>
    <div v-show="$route.query.type"
      class="dsf_system_btn">
      <dy-button type="primary"
        :disabled="forbid"
        @click="update()">保存</dy-button>
      <dy-button @click="back()">取消</dy-button>
    </div>
    <div v-show="!$route.query.type"
      class="dsf_system_btn">
      <dy-button @click="back()">
        <i class="iconfont icon-angle-double-left"></i>返回</dy-button>
      <dy-button @click="edit()"
        v-permission="'dsf:user:update'"
        v-show="!(dataList.userName === adminUsername)">编辑</dy-button>
      <dy-button @click="delManager()"
        v-permission="'dsf:user:delete'"
        v-show="!(dataList.userName === adminUsername)">删除</dy-button>
    </div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入相应API
import inputExtends from '../common/inputExtends'
import rolePermissionList from '../common/rolePermissionList/rolePermissionList'
import { treeDataTranslate } from '@/utils/index'
import defineDict from '../common/defineDict'
import permission from '@/directives/permission'

export default {
  data() {
    return {
      dataList: '',
      permissionList: [], // 权限列表
      form: {
        dsfPersonEntity: {
          personName: '', // 姓名
          gender: 0, // 性别
          gmtAuthor: 'admin', // 创建人
          gmtCreated: new Date(), // 创建时间
          gmtModified: new Date() // 更新时间
        },
        userName: '', // 帐号
        password: '', // 密码
        gmtAuthor: 'admin', // 创建人
        gmtCreated: new Date(), // 创建时间
        gmtModified: new Date(), // 更新时间
        status: 1, // 管理员状态，必须传
        deptId: '', // 部门id
        deptName: '', // 部门名称
        resouresPersonId: '', // 通讯录用户id
        dsfUserAddressbookEntityList: [], // 通讯录管理权限
        userManageEntityList: [], // 数据权限
        roles: []
      }, // 传递参数
      editDeptParent: [], // 编辑回显部门数据
      editContactsUser: [], // 编辑回显绑定通讯录用户
      editContactsAccess: [], // 编辑回显通讯录管理权限
      editDataAccess: [], // 编辑回显数据权限
      deptParent: {
        label: '所属部门：',
        dialogTitle: '选择部门',
        dialogW: '552px',
        searchType: 0,
        placeholderName: '部门',
        required: true
      },
      contactsUser: {
        label: '绑定通讯录用户：',
        dialogTitle: '选择通讯录用户',
        dialogW: '784px',
        searchType: 2,
        placeholderName: '用户',
        isGetMember: true
      },
      contactsAccess: {
        label: '通讯录管理权限：',
        dialogTitle: '选择通讯录管理权限',
        dialogW: '552px',
        searchType: 4,
        multiple: true,
        placeholderName: '部门'
      },
      dataAccess: {
        label: '部门管理权限：',
        dialogTitle: '选择部门管理权限',
        dialogW: '552px',
        searchType: 0,
        placeholderName: '部门',
        multiple: true,
        required: true
      },
      forbid: false,
      adminUsername: localStorage.username
    }
  },
  components: {
    inputExtends,
    rolePermissionList,
    defineDict
  },
  directives: { permission },
  methods: {
    // 初始化
    init() {
      let id = this.$route.query.id
      this.getUserInfo(id)
      this.getPermissionList()
    },
    // 改变性别
    changeSex(val) {
      this.form.dsfPersonEntity.gender = val
    },
    // 遍历角色对象添加禁止属性
    TraversalObject(obj) {
      for (let a in obj) {
        if (typeof obj[a] === 'object') {
          this.TraversalObject(obj[a]) // 递归遍历
        } else {
          obj.disabled = true
        }
      }
    },
    // 请求权限列表
    getPermissionList() {
      systemManage.getPermissionList().then(response => {
        if (response.data.code === 0) {
          let data = response.data.data
          this.permissionList = treeDataTranslate(data, 'menuId')
          this.TraversalObject(this.permissionList)
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 删除管理员
    delManager() {
      let id = [this.$route.query.id]
      let name = this.form.dsfPersonEntity.personName
      this.$confirm(`是否删除"${name}"?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          systemManage.delUserMenu(id).then(response => {
            if (response.data.code === 0) {
              this.$ego.alertMsg('删除成功', 'success', 1000)
              this.back()
            } else {
              this.$ego.alertMsg(response.data.msg, 'danger', 1000)
            }
          })
        })
        .catch(() => {})
    },
    // 获取管理员信息
    getUserInfo(params) {
      systemManage.getUserInfo(params).then(response => {
        if (response.data.code === 0) {
          this.dataList = response.data.data
          let data = response.data.data
          this.form.dsfPersonEntity.gender = data.dsfPersonEntity.gender
          // 部门
          let editDeptParent = {
            name: data.deptName,
            id: data.deptId,
            deptPath: data.deptPath
          }
          this.editDeptParent.push(editDeptParent)
          // 绑定通讯录用户
          let editContactsUser = {
            name: data.resouresPersonName,
            id: data.resouresPersonId
          }
          if (data.resouresPersonName) {
            this.editContactsUser.push(editContactsUser)
          }
          // 通讯录管理权限
          if (data.dsfUserAddressbookEntityList.length > 0) {
            data.dsfUserAddressbookEntityList.forEach(item => {
              let obj = {
                name: item.deptName,
                id: item.deptId,
                rwAccess: item.rwAccess,
                deptPath: item.deptPath
              }
              this.editContactsAccess.push(obj)
            })
          }
          // 数据权限
          if (data.userManageEntityList.length > 0) {
            data.userManageEntityList.forEach(item => {
              let obj = {
                name: item.deptName,
                id: item.deptId,
                rwAccess: item.rwAccess,
                deptPath: item.deptPath
              }
              this.editDataAccess.push(obj)
            })
          }
          Object.assign(this.form, response.data.data)
        }
      })
    },
    // 修改
    update() {
      // 表格验证
      if (!this.form.dsfPersonEntity.personName.trim()) {
        this.$ego.alertMsg('姓名不能为空，请重新输入', 'warning', 1000)
        return false
      } else {
        let reg = /^[a-zA-Z\u4e00-\u9fa5]+$/
        if (!reg.test(this.form.dsfPersonEntity.personName)) {
          this.$ego.alertMsg('姓名只能为中文或英文，请重新输入', 'warning', 1000)
          return false
        }
      }
      if (!this.form.deptId) {
        this.$ego.alertMsg('所属部门不能为空，请重新选择', 'warning', 1000)
        return false
      }
      if (this.form.userManageEntityList.length === 0) {
        this.$ego.alertMsg('部门管理权限不能为空，请重新选择', 'warning', 1000)
        return false
      }
      this.form.password = ''
      this.forbid = true
      systemManage.modeMenu(this.form).then(response => {
        this.forbid = false
        if (response.data.code === 0) {
          this.$ego.alertMsg('保存成功', 'success', 1000)
          this.$router.push({
            name: 'adminList'
          })
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 返回管理员列表
    back() {
      this.$router.push({
        name: 'adminList'
      })
    },
    // 获取部门数据集合
    getDeptList(msg) {
      this.form.deptId = ''
      this.form.deptName = ''
      if (msg.length > 0) {
        this.form.deptId = msg[0].id
        this.form.deptName = msg[0].name
        this.form.deptPath = msg[0].deptPath
      }
    },
    // 获取通讯录用户数据集合
    getContactsUserList(msg) {
      this.form.resouresPersonId = ''
      if (msg.length > 0) {
        this.form.resouresPersonId = msg[0].id
      }
    },
    // 获取通讯录管理权限
    getContactsAccessList(msg) {
      this.form.dsfUserAddressbookEntityList = []
      if (msg.length > 0) {
        msg.forEach(item => {
          let obj = {
            deptId: item.id,
            rwAccess: item.rwAccess || '0',
            deptPath: item.deptPath,
            deptName: item.name
          }
          this.form.dsfUserAddressbookEntityList.push(obj)
        })
      }
    },
    // 获取数据权限
    getDataAccessList(msg) {
      this.form.userManageEntityList = []
      if (msg.length > 0) {
        msg.forEach(item => {
          let obj = {
            deptId: item.id,
            rwAccess: item.rwAccess || '0',
            belongDept: 1,
            deptPath: item.deptPath,
            deptName: item.name
          }
          this.form.userManageEntityList.push(obj)
        })
      }
    },
    // 编辑管理员
    edit() {
      let id = this.$route.query.id.toString()
      this.$router.push({
        name: 'adminDetail',
        query: {
          id: id,
          type: 'edit'
        }
      })
    }
  },
  created() {
    this.init()
  }
}
</script>
