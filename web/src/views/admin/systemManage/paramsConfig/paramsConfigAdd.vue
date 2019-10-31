<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <div class="dsf_system_title">
        <h1>新增参数</h1>
      </div>
      <div class="dsf_system_btn">
        <dy-button type="primary"
          @click="save(form, 1)">保存并继续新增</dy-button>
        <dy-button @click="save(form, 2)">保存</dy-button>
        <dy-button @click="back">取消</dy-button>
      </div>
      <div class="dsf_system_section dsf_params_section">
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="dsf_require">*</span>参数名：</label>
          <div class="dsf_label_input">
            <dy-input maxlength="50"
              width="204"
              placeholder="请填写参数名"
              v-model="form.configkey">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="dsf_require">*</span>参数值：</label>
          <div class="dsf_label_input">
            <dy-input maxlength="2000"
              width="204"
              placeholder="请填写参数值"
              v-model="form.configvalue">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">备注：</label>
          <div class="dsf_label_input dsf_label_top">
            <dy-input type="textarea"
              rows="7"
              maxlength="256"
              placeholder="请输入备注"
              v-model="form.remark"
              class="dsf_label_textarea">
            </dy-input>
          </div>
        </div>
      </div>
      <div class="dsf_system_btn">
        <dy-button type="primary"
          @click="save(form, 1)">保存并继续新增</dy-button>
        <dy-button @click="save(form, 2)">保存</dy-button>
        <dy-button @click="back">取消</dy-button>
      </div>
    </div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入API

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
  methods: {
    back() {
      this.$router.push({
        name: 'paramsConfig'
      })
    },
    // 提交新增管理组
    save(form, type) {
      if (!form.configkey.trim()) {
        this.$ego.alertMsg('参数名不能为空，请重新输入', 'warning', 1000)
        return false
      } else {
        let reg = /^[a-zA-Z\u4e00-\u9fa5]+$/
        if (!reg.test(form.configkey)) {
          this.$ego.alertMsg('参数名只能为中文或英文，请重新输入', 'warning', 1000)
          return false
        }
      }
      if (!form.configvalue.trim()) {
        this.$ego.alertMsg('参数值不能为空，请重新输入', 'warning', 1000)
        return false
      }
      systemManage.saveParamsConfig(form).then(response => {
        if (response.data.code === 0) {
          this.$ego.alertMsg('保存成功', 'success', 1000)
          if (type === 1) {
            for (let key in this.form) {
              this.form[key] = ''
            }
          } else {
            this.$router.push({
              name: 'paramsConfig'
            })
          }
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    }
  }
}
</script>
