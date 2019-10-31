<template>
  <div class="dsf_content_itemR">
    <div class="dsf_system_title">
      <h1>{{!this.$route.query.type?'新增字典':'编辑字典'}}</h1>
    </div>
    <div class="dsf_system_btn">
      <dy-button type="primary"
        v-show="!this.$route.query.type"
        @click="save(form, 1)">保存并继续新增</dy-button>
      <dy-button v-show="!this.$route.query.type"
        @click="save(form, 2)">保存</dy-button>
      <dy-button type="primary"
        v-show="this.$route.query.type"
        @click="update()">保存</dy-button>
      <dy-button @click="back">取消</dy-button>
    </div>
    <div class="dsf_system_section dsf_menu_section">
      <div class="dsf_label_item">
        <label class="dsf_label_name">
          <span class="dsf_require">*</span>字典名称：</label>
        <div class="dsf_label_input">
          <dy-input width='204'
            maxlength='50'
            placeholder="请填写字典名称"
            v-model="form.dtDesc">
          </dy-input>
        </div>
      </div>
      <div class="dsf_label_item">
        <label class="dsf_label_name">
          <span class="dsf_require">*</span>代码：</label>
        <div class="dsf_label_input">
          <dy-input width='204'
            maxlength='32'
            placeholder="请填写代码"
            v-model="form.dtCode">
          </dy-input>
        </div>
      </div>
      <div class="dsf_label_item"
        v-if="showSort">
        <label class="dsf_label_name">排序号：</label>
        <div class="dsf_label_input">
          <dy-input width='204'
            placeholder="请填写排序号"
            maxlength='2'
            v-model="form.sort">
          </dy-input>
        </div>
      </div>
      <div class="dsf_label_item">
        <label class="dsf_label_name">备注：</label>
        <div class="dsf_label_input dsf_label_top">
          <dy-input type="textarea"
            class="dsf_label_textarea"
            placeholder="请填写备注"
            maxlength="200"
            rows="7"
            v-model="form.remark">
          </dy-input>
        </div>
      </div>
    </div>
    <div class="dsf_system_btn">
      <dy-button type="primary"
        v-show="!this.$route.query.type"
        @click="save(form, 1)">保存并继续新增</dy-button>
      <dy-button v-show="!this.$route.query.type"
        @click="save(form, 2)">保存</dy-button>
      <dy-button type="primary"
        v-show="this.$route.query.type"
        @click="update()">保存</dy-button>
      <dy-button @click="back">取消</dy-button>
    </div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入API

export default {
  data() {
    return {
      form: {
        dtDesc: '',
        dtCode: '',
        sort: '',
        remark: ''
      },
      dataList: '',
      showSort: false
    }
  },
  created() {
    if (this.$route.query.type) {
      this.showSort = this.$route.query.id !== this.$route.query.pid
      this.getInfo(this.$route.query)
    } else {
      if (this.$route.query.id) {
        this.showSort = true
      } else {
        this.showSort = false
      }
    }
  },
  methods: {
    back() {
      this.$router.push({
        name: 'dictionaryManage',
        params: {
          show: true
        }
      })
    },
    // 查询当前组织机构信息
    getInfo(params) {
      if (typeof params.lev !== 'number') {
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
    },
    // 刷新组织树
    changeState() {
      this.$store.commit('updateResetNodeTree', new Date().getTime())
    },
    // 更新DitID
    changeDitID(params) {
      this.$store.commit('updateDitID', params)
    },
    // 提交新增管理组
    save(form, type) {
      if (!form.dtDesc.trim()) {
        this.$ego.alertMsg('字典名称不能为空，请重新输入', 'warning', 1000)
        return false
      }
      if (!form.dtCode.trim()) {
        this.$ego.alertMsg('代码不能为空，请重新输入', 'warning', 1000)
        return false
      }
      if (!/^[0-9]*$/.test(form.sort)) {
        this.$ego.alertMsg('排序号只可以为整数，请重新输入', 'warning', 1000)
        return false
      }
      // 根父节点新增字典，上传自己的id，子节点新增字典，上传直接父id和根父id
      if (this.$route.query.id === undefined) {
        // 字典类保存
        let params = {
          dicCode: form.dtCode,
          dicDesc: form.dtDesc,
          remark: form.remark
        }
        systemManage.saveDitCategory(params).then(response => {
          if (response.data.code === 0) {
            this.$ego.alertMsg(response.data.msg, 'success', 1000)
            if (type === 1) {
              for (let key in this.form) {
                this.form[key] = ''
              }
            } else {
              this.$router.push({
                name: 'dictionaryManage'
              })
              this.changeDitID({ id: '' })
            }
            this.changeState()
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
      } else {
        // 字典保存
        // 根父节点
        form.dicId = this.$route.query.pid
        // 直接父节点
        if (this.$route.query.lev !== undefined) {
          form.dtPid = this.$route.query.id
        }
        if (form.sort !== '') {
          form.sort = parseInt(form.sort)
        }
        systemManage.saveDit(form).then(response => {
          if (response.data.code === 0) {
            this.$ego.alertMsg(response.data.msg, 'success', 1000)
            if (type === 1) {
              for (let key in this.form) {
                this.form[key] = ''
              }
            } else {
              this.$router.push({
                name: 'dictionaryManage'
              })
            }
            this.changeDitID({ id: '' })
            this.changeState()
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
      }
    },
    // 编辑
    update() {
      if (!this.form.dtDesc.trim()) {
        this.$ego.alertMsg('字典名称不能为空，请重新输入', 'warning', 1000)
        return false
      }
      if (!this.form.dtCode.trim()) {
        this.$ego.alertMsg('代码不能为空，请重新输入', 'warning', 1000)
        return false
      }
      if (!/^[0-9]*$/.test(this.form.sort)) {
        this.$ego.alertMsg('排序号只可以为整数，请重新输入', 'warning', 1000)
        return false
      }
      // 根父节点新增字典，上传自己的id，子节点新增字典，上传直接父id和根父id
      if (this.$route.query.lev === undefined) {
        // 字典类编辑
        let params = {
          dicCode: this.form.dtCode,
          dicDesc: this.form.dtDesc,
          dicId: this.$route.query.id,
          remark: this.form.remark
        }
        systemManage.updateDitCategory(params).then(response => {
          if (response.data.code === 0) {
            this.$ego.alertMsg(response.data.msg, 'success', 1000)
            this.$router.push({
              name: 'dictionaryManage'
            })
            this.changeDitID({ id: '' })
            this.changeState()
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
      } else {
        // 字典编辑
        let params = {
          dtCode: this.form.dtCode,
          dtDesc: this.form.dtDesc,
          dicId: this.$route.query.pid,
          sort: parseInt(this.form.sort),
          remark: this.form.remark
        }
        params.dtID = this.$route.query.id
        systemManage.updateDit(params).then(response => {
          if (response.data.code === 0) {
            this.$ego.alertMsg(response.data.msg, 'success', 1000)
            this.$router.push({
              name: 'dictionaryManage'
            })
            this.changeDitID({ id: '' })
            this.changeState()
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
      }
    }
  }
}
</script>
