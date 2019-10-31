<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <div class="dsf_system_title">
        <h1 v-if="$route.query.type">编辑参数</h1>
        <h1 v-else>查看参数详情</h1>
      </div>
      <div class="dsf_system_btn">
        <div v-if="!$route.query.type">
          <dy-button @click="back">
            <i class="iconfont icon-angle-double-left"></i>返回</dy-button>
          <dy-button @click="$router.push({name: 'paramsConfigDetail',query:{id: $route.query.id, type: 'edit'}})"
            v-permission="'dsf:config:update'">编辑</dy-button>
        </div>
        <div v-if="$route.query.type">
          <dy-button type="primary"
            @click="update()">保存</dy-button>
          <dy-button @click="back">取消</dy-button>
        </div>
      </div>
      <div class="dsf_system_section dsf_params_section">
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span v-show="$route.query.type"
              class="dsf_require">*</span>参数名：</label>
          <div class="dsf_label_input">
            <dy-input v-if="$route.query.type"
              maxlength="32"
              width="204"
              placeholder="请填写参数名"
              v-model="form.configkey">
            </dy-input>
            <span v-else>{{form.configkey}}</span>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span v-show="$route.query.type"
              class="dsf_require">*</span>参数值：</label>
          <div class="dsf_label_input"
            :class="[$route.query.type?'':'dsf_label_top']">
            <dy-input v-if="$route.query.type"
              maxlength="2000"
              width="204"
              placeholder="请填写参数值"
              v-model="form.configvalue">
            </dy-input>
            <span v-else>{{form.configvalue}}</span>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">备注：</label>
          <div class="dsf_label_input dsf_label_top">
            <dy-input v-if="$route.query.type"
              type="textarea"
              maxlength="256"
              rows="7"
              placeholder="请输入备注"
              v-model="form.remark"
              class="dsf_label_textarea unClearable">
            </dy-input>
            <span v-else>{{form.remark}}</span>
          </div>
        </div>
      </div>
      <div class="dsf_system_btn">
        <div v-if="!$route.query.type">
          <dy-button @click="back">
            <i class="iconfont icon-angle-double-left"></i>返回</dy-button>
          <dy-button @click="$router.push({name: 'paramsConfigDetail',query:{id: $route.query.id, type: 'edit'}})"
            v-permission="'dsf:config:update'">编辑</dy-button>
        </div>
        <div v-if="$route.query.type">
          <dy-button type="primary"
            @click="update()">保存</dy-button>
          <dy-button @click="back">取消</dy-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入API
import permission from '@/directives/permission'

export default {
  data() {
    return {
      form: {
        configkey: '',
        configvalue: '',
        remark: ''
      }
    }
  },
  directives: { permission },
  created() {
    this.init()
  },
  methods: {
    init() {
      let params = this.$route.query.id
      systemManage.selectParamsConfig(params).then(response => {
        if (response.data.code === 0) {
          Object.assign(this.form, response.data.data)
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    back() {
      this.$router.push({
        name: 'paramsConfig'
      })
    },
    // 提交新增管理组
    update() {
      if (!this.form.configkey.trim()) {
        this.$ego.alertMsg('参数名不能为空，请重新输入', 'warning', 1000)
        return false
      } else {
        let reg = /^[a-zA-Z\u4e00-\u9fa5]+$/
        if (!reg.test(this.form.configkey)) {
          this.$ego.alertMsg('参数名只能为中文或英文，请重新输入', 'warning', 1000)
          return false
        }
      }
      if (!this.form.configvalue.trim()) {
        this.$ego.alertMsg('参数值不能为空，请重新输入', 'warning', 1000)
        return false
      }
      systemManage.updateParamsConfig(this.form).then(response => {
        if (response.data.code === 0) {
          this.$ego.alertMsg(response.data.msg, 'success', 1000)
          this.$router.push({
            name: 'paramsConfig'
          })
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    }
  }
}
</script>
