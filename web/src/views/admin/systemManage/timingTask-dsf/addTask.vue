<template slot="content">
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <div class="dsf_system_title">
        <h1>新增定时任务</h1>
      </div>
      <div class="dsf_system_btn">
        <dy-button type="primary"
          @click="saveChange(1)">保存并继续新增</dy-button>
        <dy-button @click="saveChange(2)">保存</dy-button>
        <dy-button @click="back">取消</dy-button>
      </div>
      <div class="dsf_system_section">
        <div class="dsf_label_item">
          <label class="dsf_label_name">服务：</label>
          <div class="dsf_label_input">
            <dy-select width="280"
              v-model="defaultValue"
              @change="changeSelect">
              <dy-select-option v-for="option in dataList"
                :key="option.value"
                :value="option"
                :label="option">
              </dy-select-option>
            </dy-select>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">接口：</label>
          <div class="dsf_label_input">
            <dy-select width="280"
              v-model="interfaceValue"
              @change="interfaceSelect">
              <dy-select-option v-for="(option, index) in interfaceList"
                :key="index"
                :value="option.url"
                :label="option.url"
                :method="option.menthod"
                :title="option.url">
              </dy-select-option>
            </dy-select>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="dsf_require">*</span>请求地址：</label>
          <div class="dsf_label_input">
            <dy-input placeholder="请填写请求地址"
              width="280"
              maxlength="200"
              v-model="form.requestUrl">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="dsf_require">*</span>请求方法：</label>
          <div class="dsf_label_input">
            <dy-select width="280"
              @change="requestMethodSelect"
              v-model="requestMethod">
              <dy-select-option v-for="(option, index) in requestMethodList"
                :key="index"
                :value="option.name"
                :label="option.name">
              </dy-select-option>
            </dy-select>
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
          <label class="dsf_label_name">请求参数：</label>
          <div class="dsf_label_input">
            <dy-input placeholder="请填写参数"
              width="280"
              maxlength="2000"
              v-model="form.params">
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
        <dy-button @click="back">取消</dy-button>
      </div>
    </div>
  </div>
</template>
<script>
import systemManage from '../api' // 引入相应API
import defineDict from '../common/defineDict'
export default {
  data() {
    return {
      form: {},
      defaultValue: '', // 服务
      dataList: [],
      interfaceValue: '', // 接口
      interfaceList: [],
      requestMethod: '', // 请求方法
      requestMethodList: [
        {
          name: 'GET'
        },
        {
          name: 'POST'
        },
        {
          name: 'DELETE'
        },
        {
          name: 'PUT'
        }
      ]
    }
  },
  components: {
    defineDict
  },
  methods: {
    init() {
      this.getApplications()
    },
    back() {
      this.$router.push({
        name: 'timingTaskList'
      })
    },
    // 切换服务设置接口请求服务名
    changeSelect(value) {
      this.interfaceValue = ''
      this.form.requestMethod = ''
      this.requestMethod = ''
      this.defaultValue = value
      this.getApplicationsPaths(value)
    },
    // 接口选择相应设置请求方法
    interfaceSelect(value, label, { method }) {
      this.form.requestMethod = method
      this.requestMethod = method
      this.form.requestUrl = window.location.protocol + '//' + this.defaultValue + this.interfaceValue
    },
    // 请求方法设置
    requestMethodSelect() {
      this.form.requestMethod = this.requestMethod
    },
    // 提交新增
    saveChange(type) {
      // 表格验证
      if (!this.form.requestUrl) {
        this.$ego.alertMsg('请填写请求地址', 'warning', 1000)
        return false
      }
      if (!this.form.requestMethod) {
        this.$ego.alertMsg('请填写请求方法', 'warning', 1000)
        return false
      }
      if (!this.form.cronExpression) {
        this.$ego.alertMsg('请填写cron表达式', 'warning', 1000)
        return false
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
    },
    // 调度服务列表
    getApplications() {
      systemManage.getApplications().then(response => {
        if (response.data.code === 0) {
          let data = response.data.data
          this.dataList = [...data]
          this.defaultValue = data[0]
          this.getApplicationsPaths(data[0])
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 调度服务接口
    getApplicationsPaths(params) {
      systemManage.getApplicationsPaths(params).then(response => {
        if (response.data.code === 0) {
          let data = response.data.data
          this.interfaceList = [...data]
          if (data.length > 0) {
            this.interfaceValue = data[0].url
            this.form.requestMethod = data[0].menthod
            this.requestMethod = data[0].menthod
          }
          this.form.requestUrl =
            'http://' + this.defaultValue + this.interfaceValue
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    }
  },
  created() {
    this.init()
  }
}
</script>
