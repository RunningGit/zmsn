<template>
  <!-- 机构信息开始 -->
  <div class="dsf_content_itemR">
    <template v-if="defaultId !== ''">
      <template v-if="dataList">
        <div class="dsf_system_title">
          <h1>部门详情</h1>
        </div>
        <div class="dsf_system_btn">
          <dy-button type="primary"
            @click="addDept()"
            v-permission="'dsf:department:save'"
            v-if="rootFlag">添加子部门</dy-button>
          <dy-button @click="addDept('edit')"
            v-permission="'dsf:department:update'"
            v-if="rootFlag">编辑</dy-button>
          <dy-button v-if="dataList.id !== '1'"
            v-permission="'dsf:department:delete'"
            @click="delDept()">删除</dy-button>
        </div>
        <div class="dsf_system_section">
          <div class="dsf_label_item">
            <label class="dsf_label_name">部门名称：</label>
            <div class="dsf_label_input dsf_label_top">{{dataList.deptName}}</div>
          </div>
          <div class="dsf_label_item">
            <label class="dsf_label_name">职能描述：</label>
            <div class="dsf_label_input dsf_label_top">{{dataList.description}}</div>
          </div>
          <div class="dsf_label_item"
            v-if="dataList.id !== '1'">
            <label class="dsf_label_name">虚拟部门：</label>
            <div class="dsf_label_input dsf_label_top">{{dataList.isVirtual === 1?'是':'否'}}</div>
          </div>
          <div class="dsf_label_item"
            v-if="dataList.id !== '1'">
            <label class="dsf_label_name">上级部门：</label>
            <div class="dsf_label_input dsf_label_top">
              <template v-if="dataList.deptParent && dataList.deptParent.length > 0">
                <p class="dsf_label_desc"
                  v-for="(item,index) in dataList.deptParent"
                  :key="index">{{item.parentDepartmentName}}</p>
              </template>
            </div>
          </div>
          <div class="dsf_label_item"
            v-if="dataList.id !== '1'">
            <label class="dsf_label_name">部门负责人：</label>
            <div class="dsf_label_input dsf_label_top">
              <template v-if="dataList.head && dataList.head.length > 0">
                <p class="dsf_label_desc"
                  v-for="(item,index) in dataList.head"
                  :key="index">{{item.name}}</p>
              </template>
            </div>
          </div>
          <div class="dsf_label_item"
            v-if="dataList.id !== '1'">
            <label class="dsf_label_name">分管领导：</label>
            <div class="dsf_label_input dsf_label_top">
              <template v-if="dataList.leader && dataList.leader.length > 0">
                <p class="dsf_label_desc"
                  v-for="(item,index) in dataList.leader"
                  :key="index">{{item.name}}</p>
              </template>
            </div>
          </div>
        </div>
        <div class="dsf_system_btn">
          <dy-button type="primary"
            @click="addDept()"
            v-permission="'dsf:department:save'"
            v-if="rootFlag">添加子部门</dy-button>
          <dy-button @click="addDept('edit')"
            v-permission="'dsf:department:update'"
            v-if="rootFlag">编辑</dy-button>
          <dy-button v-if="dataList.id !== '1'"
            v-permission="'dsf:department:delete'"
            @click="delDept()">删除</dy-button>
        </div>
      </template>
    </template>
    <div v-else
      class="dsf_defualt_image"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import systemManage from '../api' // 引入相应API
import permission from '@/directives/permission'

export default {
  data() {
    return {
      dataList: '',
      defaultId: this.$store.state.groupDept.id,
      rootFlag: true
    }
  },
  directives: { permission },
  mounted() {
    // 初始查询根节点数据或者刷新页面
    if (this.defaultId) this.getInfo(this.defaultId)
  },
  methods: {
    // 新增部门
    addDept(params) {
      this.$router.push({
        name: 'institutionManageAdd',
        query: {
          id: this.dataList.id.toString(),
          name: this.dataList.deptName,
          type: params
        }
      })
    },
    // 删除部门
    delDept() {
      let id = this.dataList.id
      let name = this.dataList.deptName
      this.$confirm(`是否删除"${name}"?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          systemManage.del(id).then(response => {
            if (response.data.code === 0) {
              this.$ego.alertMsg('删除成功', 'success', 1000)
              this.changeState()
              this.changeGroupDeptID({ id: '' })
            } else {
              this.$ego.alertMsg(response.data.msg, 'danger', 1000)
            }
          })
        })
        .catch(() => {})
    },
    // 更新deptid
    changeGroupDeptID(params) {
      this.$store.commit('updateGroupDeptID', params)
    },
    // 查询当前组织机构信息
    getInfo(id) {
      systemManage.getOrganizationInfo(id).then(response => {
        if (response.data.code === 0) {
          this.dataList = response.data.data
          let data = response.data.data
          if (data.id === '1') {
            this.rootFlag = data.authFlag
          } else {
            this.rootFlag = true
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
  },
  computed: {
    listenGroupDeptID() {
      return this.$store.state.groupDept
    }
  },
  watch: {
    // 监听id的变化
    listenGroupDeptID(newVal, oldVal) {
      this.defaultId = newVal.id
      if (this.defaultId) this.getInfo(newVal.id)
    }
  }
}
</script>
