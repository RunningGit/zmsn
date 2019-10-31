<template>
  <div class="dsf_content_itemR">
    <!--添加成员开始  -->
    <div class="dsf_system_title">
      <h1>{{!this.$route.query.type?'新增部门':'编辑部门'}}</h1>
    </div>
    <div class="dsf_system_btn">
      <dy-button type="primary"
        v-show="!this.$route.query.type"
        @click="onSubmit(true)">保存并继续新增</dy-button>
      <dy-button v-show="!this.$route.query.type"
        @click="onSubmit(false)">保存</dy-button>
      <dy-button type="primary"
        v-show="this.$route.query.type"
        @click="onSubmit(false)">保存</dy-button>
      <dy-button @click="back">取消</dy-button>
    </div>
    <div class="dsf_system_section dsf_insManage_section">
      <div class="dsf_label_item">
        <label class="dsf_label_name">
          <span class="dsf_require">*</span>部门名称：</label>
        <div class="dsf_label_input">
          <dy-input v-model="form.deptName"
            maxlength="20"
            width='250'
            type="text"
            placeholder="请填写部门名称"></dy-input>
        </div>
      </div>
      <div class="dsf_label_item">
        <label class="dsf_label_name">
          职能描述：</label>
        <div class="dsf_label_input dsf_label_top">
          <dy-input type="textarea"
            rows="7"
            maxlength="200"
            placeholder="请输入职能描述"
            class="unClearable dsf_label_textarea"
            v-model="form.description">
          </dy-input>
        </div>
      </div>
      <div class="dsf_label_item"
        v-if="!($route.query.type && $route.query.id === '1')">
        <label class="dsf_label_name">
          虚拟部门：</label>
        <div class="dsf_label_input">
          <dy-radio-group v-model="isVirtual">
            <dy-radio :data="0">是</dy-radio>
            <dy-radio :data="1">否</dy-radio>
          </dy-radio-group>
        </div>
      </div>
      <!-- 上级部门 -->
      <template v-if="!($route.query.type && $route.query.id === '1')">
        <input-extends :key="resetKey + '1'"
          @listener="getDeptList"
          :setDate="deptParent"
          :editData="editDeptParent"></input-extends>
      </template>
      <!-- 部门负责人 -->
      <template v-if="!($route.query.type && $route.query.id === '1')">
        <input-extends :key="resetKey + '2'"
          @listener="getDeptHead"
          :setDate="deptHead"
          :editData="editDeptHead"></input-extends>
      </template>
      <!-- 部门分管领导 -->
      <template v-if="!($route.query.type && $route.query.id === '1')">
        <input-extends :key="resetKey + '3'"
          @listener="getDeptLeader"
          :setDate="deptLeader"
          :editData="editDeptLeader"></input-extends>
      </template>
    </div>
    <div class="dsf_system_btn">
      <dy-button type="primary"
        v-show="!this.$route.query.type"
        @click="onSubmit(true)">保存并继续新增</dy-button>
      <dy-button v-show="!this.$route.query.type"
        @click="onSubmit(false)">保存</dy-button>
      <dy-button type="primary"
        v-show="this.$route.query.type"
        @click="onSubmit(false)">保存</dy-button>
      <dy-button @click="back">取消</dy-button>
    </div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入相应API
import inputExtends from '../common/inputExtends'

export default {
  data() {
    return {
      form: {
        deptName: '',
        description: '',
        isVirtual: '',
        id: 0, // 默认值
        delFlag: false,
        leader: [], // 领导人
        head: [], // 负责人
        deptParent: [] // 上级部门
      },
      isVirtual: 1,
      editDeptParent: [], // 上级部门回显数据集合
      editDeptHead: [], // 部门负责人回显数据集合
      editDeptLeader: [], // 部门领导回显数据集合
      deptParent: {
        label: '上级部门：',
        dialogTitle: '新增上级部门',
        dialogW: '552px',
        searchType: 0,
        required: true,
        multiple: true
      },
      deptHead: {
        label: '部门负责人：',
        dialogTitle: '新增部门负责人',
        dialogW: '784px',
        searchType: 1,
        isGetMember: true,
        multiple: true
      },
      deptLeader: {
        label: '分管领导：',
        dialogTitle: '新增分管领导',
        dialogW: '784px',
        searchType: 1,
        isGetMember: true,
        multiple: true
      },
      resetKey: new Date().getTime() // 重置数据
    }
  },
  components: {
    inputExtends
  },
  methods: {
    // 初始化
    init() {
      if (this.$route.query.type) {
        // 编辑部门
        this.getInfo(this.$route.query.id)
      } else {
        // 新增部门
        let params = {
          name: this.$route.query.name,
          id: this.$route.query.id,
          isMain: 1
        }
        this.editDeptParent.push(params)
      }
    },
    // 获取上级部门数据集合
    getDeptList(msg) {
      // 编辑的时候如果选到自己要提示用户
      if (this.$route.query.type) {
        for (let i = 0; i < msg.length; i++) {
          if (msg[i].id === this.$route.query.id) {
            msg.splice(i, 1)
            this.$ego.alertMsg('上级部门不可以选择自己', 'warning', 1000)
            return false
          }
        }
      }
      this.form.deptParent = []
      msg.forEach(item => {
        let obj = {
          parentDepartmentId: item.id,
          parentDepartmentName: item.name
        }
        this.form.deptParent.push(obj)
      })
    },
    // 获取部门负责人数据集合
    getDeptHead(msg) {
      this.form.head = []
      if (msg.length > 0) {
        msg.forEach(item => {
          let obj = {
            id: item.id,
            name: item.name
          }
          this.form.head.push(obj)
        })
      }
    },
    // 获取部门领导数据集合
    getDeptLeader(msg) {
      this.form.leader = []
      if (msg.length > 0) {
        msg.forEach(item => {
          let obj = {
            id: item.id,
            name: item.name
          }
          this.form.leader.push(obj)
        })
      }
    },
    // 刷新组织树
    changeState() {
      this.$store.commit('updateResetNodeTree', new Date().getTime())
    },
    // 更新deptid
    changeGroupDeptID(params) {
      this.$store.commit('updateGroupDeptID', params)
    },
    // 获取id机构信息
    getInfo(params) {
      systemManage.getOrganizationInfo(params).then(response => {
        if (response.data.code === 0) {
          Object.assign(this.form, response.data.data)
          let datalist = response.data.data
          this.isVirtual = datalist.isVirtual ? 0 : 1
          // 上级部门回显
          if (datalist.deptParent.length > 0) {
            datalist.deptParent.forEach(item => {
              item.id = item.parentDepartmentId
              item.name = item.parentDepartmentName
              this.editDeptParent.push(item)
            })
          }
          // 部门负责人回显
          if (datalist.head.length > 0) {
            datalist.head.forEach(item => {
              this.editDeptHead.push(item)
            })
          }
          // 部门领导人回显
          if (datalist.leader.length > 0) {
            datalist.leader.forEach(item => {
              this.editDeptLeader.push(item)
            })
          }
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 保存按钮提交
    onSubmit(keep) {
      if (!this.form.deptName.trim()) {
        this.$ego.alertMsg('部门名称不能为空，请重新输入', 'warning', 1000)
        return false
      } else {
        let reg = /^[a-zA-Z\u4e00-\u9fa5]+$/
        if (!reg.test(this.form.deptName)) {
          this.$ego.alertMsg('部门名称只能为中文或英文，请重新输入', 'warning', 1000)
          return false
        }
      }
      if (!(this.$route.query.type && this.$route.query.id === '1')) {
        if (this.form.deptParent.length === 0) {
          this.$ego.alertMsg('上级部门不能为空，请重新选择', 'warning', 1000)
          return false
        }
      }
      if (this.isVirtual === 1) {
        this.form.isVirtual = false
      } else {
        this.form.isVirtual = true
      }
      this.form.name = this.form.deptName
      if (!this.$route.query.type) {
        // 新增部门
        systemManage.save(this.form).then(response => {
          if (response.data.code === 0) {
            this.$ego.alertMsg('保存成功', 'success', 1000)
            if (keep) {
              for (var i in this.form) {
                this.form[i] = ''
              }
              this.form.leader = []
              this.form.head = []
              this.form.deptParent = []
              // 必须填写的参数
              this.form.id = 0
              this.form.delFlag = false
              // 重置组件中数据
              this.resetKey = new Date().getTime()
            } else {
              this.$router.push({
                name: 'institutionManageList'
              })
              this.changeGroupDeptID({ id: '' })
            }
            this.changeState()
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
      } else {
        // 编辑部门
        if (this.isVirtual === 1) {
          this.form.isVirtual = false
        } else {
          this.form.isVirtual = true
        }
        systemManage.update(this.form).then(response => {
          if (response.data.code === 0) {
            this.$ego.alertMsg('保存成功', 'success', 1000)
            this.$router.push({
              name: 'institutionManageList'
            })
            this.changeState()
            this.changeGroupDeptID({ id: '' })
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
      }
    },
    // 返回机构首页
    back() {
      this.$router.push({
        name: 'institutionManageList'
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>
