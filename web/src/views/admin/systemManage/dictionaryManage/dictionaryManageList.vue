<template>
  <!-- 机构信息开始 -->
  <div class="dsf_content_itemR">
    <template v-if="defaultId.id !== ''">
      <template v-if="dataList">
        <div class="dsf_system_title">
          <h1>字典信息</h1>
        </div>
        <div class="dsf_system_btn">
          <dy-button type="primary"
            v-permission="'dsf:ditionaryCategory:save'"
            @click="addDept()">新增字典</dy-button>
          <dy-button v-permission="'dsf:ditionaryCategory:edit'"
            @click="addDept('edit')">编辑</dy-button>
          <dy-button @click="delDept(form.dtDesc)"
            v-permission="'dsf:ditionaryCategory:delete'">删除</dy-button>
        </div>
        <div class="dsf_system_section dsf_menu_section">
          <div class="dsf_label_item">
            <label class="dsf_label_name">
              名称：</label>
            <div class="dsf_label_input dsf_label_top">{{form.dtDesc}}</div>
          </div>
          <div class="dsf_label_item">
            <label class="dsf_label_name">
              代码：</label>
            <div class="dsf_label_input dsf_label_top">{{form.dtCode}}</div>
          </div>
          <div class="dsf_label_item"
            v-if="dataList.lev !== undefined">
            <label class="dsf_label_name">
              排序号：</label>
            <div class="dsf_label_input">{{form.sort}}</div>
          </div>
          <div class="dsf_label_item">
            <label class="dsf_label_name">备注：</label>
            <div class="dsf_label_input dsf_label_top">{{form.remark}}</div>
          </div>
        </div>
        <div class="dsf_system_btn">
          <dy-button type="primary"
            v-permission="'dsf:ditionaryCategory:save'"
            @click="addDept()">新增字典</dy-button>
          <dy-button v-permission="'dsf:ditionaryCategory:edit'"
            @click="addDept('edit')">编辑</dy-button>
          <dy-button @click="delDept(form.dtDesc)"
            v-permission="'dsf:ditionaryCategory:delete'">删除</dy-button>
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
      dataList: this.$route.params.show,
      defaultId: this.$store.state.ditData,
      form: {
        dtCode: '',
        dtDesc: '',
        remark: '',
        sort: ''
      }
    }
  },
  directives: { permission },
  created() {
    // 初始查询根节点数据
    if (this.defaultId.id) this.getInfo(this.defaultId)
  },
  methods: {
    // 刷新组织树
    changeState() {
      this.$store.commit('updateResetNodeTree', new Date().getTime())
    },
    // 新增
    addDept(params) {
      this.$router.push({
        name: 'dictionaryManageAdd',
        query: {
          id: this.$store.state.ditData.id,
          name: this.$store.state.ditData.name,
          lev: this.$store.state.ditData.lev,
          pid: this.$store.state.ditData.dicId,
          type: params
        }
      })
    },
    // 删除
    delDept(name) {
      this.$confirm(`是否删除"${name}"?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (this.dataList.lev === undefined) {
            // 字典类删除
            systemManage.delDitCategory(this.dataList.dicId).then(response => {
              if (response.data.code === 0) {
                this.$ego.alertMsg('删除成功', 'success', 1000)
                this.dataList = ''
                this.changeState()
                this.$store.commit('updateDitID', { id: '' })
              } else {
                this.$ego.alertMsg(response.data.msg, 'danger', 1000)
              }
            })
          } else {
            // 字典类删除
            systemManage.delDit(this.dataList.dtId).then(response => {
              if (response.data.code === 0) {
                this.$ego.alertMsg('删除成功', 'success', 1000)
                this.dataList = ''
                this.changeState()
                this.$store.commit('updateDitID', { id: '' })
              } else {
                this.$ego.alertMsg(response.data.msg, 'danger', 1000)
              }
            })
          }
        })
        .catch(() => {})
    },
    // 查询当前组织机构信息
    getInfo(params) {
      if (params.lev === undefined) {
        // 字典类查询
        systemManage.getDitCategoryInfo(params.id).then(response => {
          if (response.data.code === 0) {
            this.dataList = response.data.data
            this.form.dtCode = response.data.data.dicCode
            this.form.dtDesc = response.data.data.dicDesc
            this.form.remark = response.data.data.remark
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
      } else {
        // 字典查询
        systemManage.getDitInfo(params.id).then(response => {
          if (response.data.code === 0) {
            this.dataList = response.data.data
            Object.assign(this.form, response.data.data)
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
      }
    }
  },
  computed: {
    listenDitID() {
      return this.$store.state.ditData
    }
  },
  watch: {
    listenDitID(newVal, oldVal) {
      this.defaultId = newVal
      if (this.defaultId.id) this.getInfo(newVal)
    }
  }
}
</script>
