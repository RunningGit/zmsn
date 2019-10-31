<template>
  <div class="dsf_content"
    v-if="operateLog">
    <div class="dsf_content_section dsf_content_section_padding">
      <div class="dsf_system_title">
        <h1>操作日志详情</h1>
      </div>
      <div class="dsf_system_btn">
        <dy-button @click="back">
          <i class="iconfont icon-angle-double-left"></i>返回</dy-button>
      </div>
      <div class="dsf_system_section dsf_taskLogs_section">
        <div class="dsf_label_item">
          <label class="dsf_label_name">任务id：</label>
          <div class="dsf_label_input">
            <label>{{operateLog.jobId}}</label>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">任务日志id：</label>
          <div class="dsf_label_input">
            <label>{{operateLog.logId}}</label>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">请求地址：</label>
          <div class="dsf_label_input">
            <label>{{operateLog.requestUrl}}</label>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">请求方法：</label>
          <div class="dsf_label_input dsf_label_top">
            <label>{{operateLog.requestMethod}}</label>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">参数：</label>
          <div class="dsf_label_input">
            <label>{{operateLog.params}}</label>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">状态：</label>
          <div class="dsf_label_input dsf_label_top">
            <label>{{operateLog.status}}</label>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">耗时时长（单位：毫秒）：</label>
          <div class="dsf_label_input dsf_label_top">
            <label>{{operateLog.times}}</label>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">执行时间：</label>
          <div class="dsf_label_input dsf_label_top">
            <label>{{operateLog.createTime}}</label>
          </div>
        </div>
      </div>
      <div class="dsf_system_btn">
        <dy-button @click="back">
          <i class="iconfont icon-angle-double-left"></i>返回</dy-button>
      </div>
    </div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入API

export default {
  data() {
    return {
      operateLog: ''
    }
  },
  created() {
    this.getOperateLogsDetail()
  },
  methods: {
    back() {
      this.$router.push({
        name: 'taskLogsList'
      })
    },
    getOperateLogsDetail() {
      let params = this.$route.query.id
      systemManage.tasklogDetail(params).then(response => {
        if (response.data.code === 0) {
          response.data.data.statusName =
            response.data.data.status === 0 ? '成功' : '失败'
          this.operateLog = response.data.data
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    }
  }
}
</script>
