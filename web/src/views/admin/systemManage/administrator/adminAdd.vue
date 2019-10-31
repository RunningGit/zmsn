<template>
  <div class="dsf_content_itemR">
    <!--管理员新增开始-->
    <div class="dsf_system_title">
      <h1>新增管理员</h1>
    </div>
    <div class="dsf_system_btn">
      <dy-button type="primary"
        @click="onSubmit(true)"
        :disabled="forbid">保存并继续新增</dy-button>
      <dy-button @click="onSubmit(false)"
        :disabled="forbid">保存</dy-button>
      <dy-button @click="back()">取消</dy-button>
    </div>
    <div class="dsf_system_section">
      <div class="dsf_label_item">
        <label class="dsf_label_name">
          <span class="dsf_require">*</span>姓名：</label>
        <div class="dsf_label_input">
          <dy-input maxlength="16"
            placeholder="请填写姓名"
            width='204'
            v-model="form.dsfPersonEntity.personName">
          </dy-input>
        </div>
      </div>
      <div class="dsf_label_item">
        <label class="dsf_label_name">
          <span class="dsf_require">*</span>账号：</label>
        <div class="dsf_label_input">
          <dy-input v-model="form.userName"
            maxlength="16"
            width='204'
            placeholder="请填写账号"></dy-input>
        </div>
      </div>
      <div class="dsf_label_item">
        <label class="dsf_label_name">
          <span class="dsf_require">*</span>性别：</label>
        <div class="dsf_label_input">
          <define-dict type="radio"
            dictType="sex"
            @changeSex="changeSex"
            :selectedData="form.dsfPersonEntity.gender"></define-dict>
        </div>
      </div>
      <div class="dsf_label_item">
        <label class="dsf_label_name">
          <span class="dsf_require">*</span>登录密码：</label>
        <div class="dsf_label_input">
          <dy-input v-model="psd"
            type="password"
            width='204'
            maxlength="16"
            placeholder="请输入登录密码"></dy-input>
        </div>
      </div>
      <div class="dsf_label_item">
        <label class="dsf_label_name">
          <span class="dsf_require">*</span>确认密码：</label>
        <div class="dsf_label_input">
          <dy-input v-model="confirmPasswd"
            type="password"
            width='204'
            maxlength="16"
            placeholder="请再次输入密码"></dy-input>
        </div>
      </div>
      <!-- 所属部门 -->
      <input-extends :key="resetKey + '1'"
        @listener="getDeptList"
        :setDate="deptParent"></input-extends>
      <!-- 绑定通讯录用户 -->
      <input-extends :key="resetKey + '2'"
        @listener="getContactsUserList"
        :setDate="contactsUser"></input-extends>
      <!-- 通讯录管理权限 -->
      <input-extends :key="resetKey + '3'"
        showSelect
        @listenerAccess="getContactsAccessList"
        :setDate="contactsAccess"></input-extends>
      <!-- 数据权限 -->
      <input-extends :key="resetKey + '4'"
        showSelect
        @listenerAccess="getDataAccessList"
        :setDate="dataAccess"></input-extends>
      <div class="dsf_label_item">
        <label class="dsf_label_name">角色授权：</label>
        <p class="dsf_label_input">通过角色管理的用户授权关联</p>
      </div>
    </div>
    <div class="dsf_system_btn">
      <dy-button type="primary"
        @click="onSubmit(true)"
        :disabled="forbid">保存并继续新增</dy-button>
      <dy-button @click="onSubmit(false)"
        :disabled="forbid">保存</dy-button>
      <dy-button @click="back()">取消</dy-button>
    </div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入相应API
import md5 from 'js-md5'
import inputExtends from '../common/inputExtends'
import defineDict from '../common/defineDict'

export default {
  data() {
    return {
      form: {
        dsfPersonEntity: {
          personName: '', // 姓名
          gender: 1, // 性别
          gmtAuthor: 'admin', // 创建人
          gmtCreated: new Date(), // 创建时间
          gmtModified: new Date() // 更新时间
        },
        userName: '', // 帐号
        password: '', // 提交密码
        deptPath: '', // 部门路径
        gmtAuthor: 'admin', // 创建人
        gmtCreated: new Date(), // 创建时间
        gmtModified: new Date(), // 更新时间
        status: 1, // 管理员状态，必须传
        deptId: '', // 部门id
        deptName: '', // 部门名称
        resouresPersonId: '', // 通讯录用户id
        dsfUserAddressbookEntityList: [], // 通讯录管理权限
        userManageEntityList: [] // 数据权限
      }, // 传递参数
      psd: '', // 填写密码
      confirmPasswd: '', // 确认密码
      resetKey: new Date().getTime(), // 重置数据
      forbid: false, // 禁用按钮
      deptParent: {
        label: '所属部门：',
        dialogTitle: '选择部门',
        dialogW: '550px',
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
        dialogW: '550px',
        searchType: 4,
        multiple: true,
        placeholderName: '部门'
      },
      dataAccess: {
        label: '部门管理权限：',
        dialogTitle: '选择部门管理权限',
        dialogW: '550px',
        searchType: 0,
        placeholderName: '部门',
        multiple: true,
        required: true
      }
    }
  },
  components: {
    inputExtends,
    defineDict
  },
  methods: {
    // 保存按钮提交
    onSubmit(keep) {
      // 表格验证
      if (!this.form.dsfPersonEntity.personName.trim()) {
        this.$ego.alertMsg('姓名不能为空，请重新输入', 'warning', 1000)
        return false
      } else {
        let reg = /^([a-zA-Z ]+|[\u4e00-\u9fa5]+)$/
        if (!reg.test(this.form.dsfPersonEntity.personName)) {
          this.$ego.alertMsg('姓名只能为中文或英文，请重新输入', 'warning', 1000)
          return false
        }
      }
      if (!this.form.userName.trim()) {
        this.$ego.alertMsg('帐号不能为空，请重新输入', 'warning', 1000)
        return false
      } else {
        if (!/^[a-zA-Z0-9][a-zA-Z0-9-_.]{2,15}$/.test(this.form.userName)) {
          this.$ego.alertMsg(
            '帐号长度3-16个字符，由字母、数字、点(.)、减号(-)或下划线(_)',
            'warning',
            1000
          )
          return false
        }
      }
      if (!this.psd) {
        this.$ego.alertMsg('登录密码不能为空，请重新输入', 'warning', 1000)
        return false
      } else {
        let reg = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^_.&*?]+)$)^[\w~!@#$%^_.&*?]{6,16}$/
        if (!reg.test(this.psd)) {
          this.$ego.alertMsg(
            '密码长度为6-16个字，必须同时包含字母、数字、特殊符号中的两种',
            'warning',
            1000
          )
          return false
        }
      }
      if (!this.confirmPasswd) {
        this.$ego.alertMsg('确认密码不能为空，请重新输入', 'warning', 1000)
        return false
      }
      if (this.psd !== this.confirmPasswd) {
        this.$ego.alertMsg('两次密码输入不一致，请重新输入', 'warning', 1000)
        return false
      }
      if (!this.form.deptId) {
        this.$ego.alertMsg('所属部门不能为空，请重新选择', 'warning', 1000)
        return false
      }
      if (this.form.userManageEntityList.length === 0) {
        this.$ego.alertMsg('部门管理权限不能为空，请重新选择', 'warning', 1000)
        return false
      }
      // 加密密码
      this.form.password = md5(this.psd)
      // 新增管理员
      this.forbid = true
      systemManage.addUser(this.form).then(response => {
        this.forbid = false
        if (response.data.code === 0) {
          this.$ego.alertMsg('保存成功', 'success', 1000)
          if (keep) {
            // 重置数据
            this.form.dsfPersonEntity.personName = ''
            this.form.dsfPersonEntity.gender = 1
            this.form.userName = ''
            this.form.password = ''
            this.psd = ''
            this.form.deptId = ''
            this.form.deptName = ''
            this.form.deptPath = ''
            this.form.resouresPersonId = ''
            this.form.dsfUserAddressbookEntityList = []
            this.form.userManageEntityList = []
            this.confirmPasswd = ''
            // 重置组件中数据
            this.resetKey = new Date().getTime()
          } else {
            this.$router.push({
              name: 'adminList'
            })
          }
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 改变性别的值
    changeSex(val) {
      this.form.dsfPersonEntity.gender = val
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
      this.form.deptPath = ''
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
            deptPath: item.deptPath
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
            deptPath: item.deptPath
          }
          this.form.userManageEntityList.push(obj)
        })
      }
    }
  }
}
</script>
