<template slot="content">
  <div class="dsf_content">
    <div class="dsf_content_section">
      <div class="dsf_system_title">
        <h1>新增定时任务</h1>
      </div>
      <div class="dsf_system_btn">
        <dy-button type="primary"
          @click="saveChange(1)">保存并继续新增</dy-button>
        <dy-button @click="saveChange(2)">保存</dy-button>
        <dy-button type="default"
          @click="back">取消</dy-button>
      </div>
      <div class="dsf_system_section">
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="dsf_require">*</span>bean名称：</label>
          <div class="dsf_label_input">
            <dy-input placeholder="请填写bean名称"
              maxlength="200"
              v-model="form.beanName">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="dsf_require">*</span>方法名称：</label>
          <div class="dsf_label_input">
            <dy-input placeholder="请填写方法名称"
              v-model="form.methodName"
              maxlength="100">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">参数：</label>
          <div class="dsf_label_input">
            <dy-input placeholder="请填写参数"
              width="280"
              maxlength="2000"
              v-model="form.params">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="dsf_require">*</span>cron表达式：</label>
          <div class="dsf_label_input">
            <dy-input placeholder="提示：0 */1 * * * ? 每隔1分钟执行一次"
              maxlength="100"
              width="280"
              v-model="form.cronExpression">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">备注：</label>
          <div class="dsf_label_input">
            <dy-input placeholder="请输入备注"
              width="280"
              maxlength="255"
              v-model="form.remark">
            </dy-input>
          </div>
        </div>
      </div>
      <div class="dsf_system_btn">
        <dy-button type="primary"
          @click="saveChange(1)">保存并继续新增</dy-button>
        <dy-button @click="saveChange(2)">保存</dy-button>
        <dy-button type="default"
          @click="back">取消</dy-button>
      </div>
    </div>
  </div>
</template>
<script>
import systemManage from '../api' // 引入相应API
export default {
  data() {
    return {
      form: {}
    }
  },
  methods: {
    back() {
      this.$router.push({
        name: 'timingTaskList'
      })
    },
    // 提交新增
    saveChange(type) {
      // 表格验证
      if (!this.form.beanName) {
        this.$ego.alertMsg('请填写bean名称', 'warning', 1000)
        return false
      }
      if (!this.form.methodName) {
        this.$ego.alertMsg('请填写方法名称', 'warning', 1000)
        return false
      }
      if (!this.form.cronExpression) {
        this.$ego.alertMsg('请填写cron表达式', 'warning', 1000)
        return false
      } else {
        let reg = /^[^\u4e00-\u9fa5]+$/
        if (!reg.test(this.form.cronExpression)) {
          this.$ego.alertMsg('cron表达式中不能含有中文', 'warning', 1000)
          return false
        }
      }
      systemManage.saveTask(this.form).then(response => {
        if (response.data.code === 0) {
          this.$ego.alertMsg('新增成功', 'success', 1000)
          if (type === 1) {
            this.form = {}
          } else {
            this.back()
          }
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    }
  }
}
</script>
