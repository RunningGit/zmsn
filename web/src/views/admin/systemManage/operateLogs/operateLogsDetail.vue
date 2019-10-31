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
      <div class="dsf_system_section dsf_group_section">
        <div class="dsf_label_item">
          <label class="dsf_label_name">日志类型：</label>
          <div class="dsf_label_input">
            <label>{{operateLog.logType === '0'?'业务日志':(operateLog.logType==='1'?'异常日志':'')}}</label>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">日志名称：</label>
          <div class="dsf_label_input">
            <label>{{operateLog.operation}}</label>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">用户名称：</label>
          <div class="dsf_label_input">
            <label>{{operateLog.username}}</label>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">方法名：</label>
          <div class="dsf_label_input dsf_label_top">
            <label>{{operateLog.method}}</label>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">时间：</label>
          <div class="dsf_label_input">
            <label>{{operateLog.createDate}}</label>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">具体消息：</label>
          <div class="dsf_label_input dsf_label_top">
            <label>{{operateLog.params}}</label>
          </div>
        </div>
        <div class="dsf_label_item"
          v-if="operateLog.logType == 1">
          <label class="dsf_label_name">错误消息：</label>
          <div class="dsf_label_input dsf_label_top">
            <label>{{operateLog.errorMessage}}</label>
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
        name: 'operateLogs'
      })
    },
    getOperateLogsDetail() {
      let params = this.$route.query.id
      systemManage.operateLogsDetail(params).then(response => {
        if (response.data.code === 0) {
          this.operateLog = response.data.data
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    }
  }
}
</script>
