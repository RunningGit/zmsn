<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <div class="dsf_system_title">
        <h1>新增消息日志管理</h1>
      </div>
      <div class="dsf_system_btn">
        <dy-button type="primary"
          @click="confirmSubmit(form, 1)">保存并继续新增</dy-button>
        <dy-button @click="confirmSubmit(form, 2)">保存</dy-button>
        <dy-button @click="returnlink">取消</dy-button>
      </div>
      <div class="dsf_system_section dsf_group_section">
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="require">*</span>
            消息接收人：
          </label>
          <div class="dsf_label_input">
            <dy-input maxlength="500"
              placeholder="请填写消息接收人"
              v-model="form.toUser">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            消息内容：
          </label>
          <div class="dsf_label_input">
            <dy-input maxlength="65535"
              placeholder="请填写消息内容"
              v-model="form.requestBody">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            消息状态：
          </label>
          <div class="dsf_label_input">
            <dy-input placeholder="请填写消息状态"
              v-model="form.status">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            消息类型：
          </label>
          <div class="dsf_label_input">
            <dy-input placeholder="请填写消息类型"
              v-model="form.type">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="require">*</span>
            服务名：
          </label>
          <div class="dsf_label_input">
            <dy-input maxlength="100"
              placeholder="请填写服务名"
              v-model="form.serverName">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="require">*</span>
            发送时间：
          </label>
          <div class="dsf_label_input">
            <el-date-picker v-model="form.sendTime"
              type="date"
              placeholder="请选择发送时间" />
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="require">*</span>
            更新时间：
          </label>
          <div class="dsf_label_input">
            <el-date-picker v-model="form.editTime"
              type="date"
              placeholder="请选择更新时间" />
          </div>
        </div>
      </div>
      <div class="dsf_system_btn">
        <dy-button type="primary"
          @click="confirmSubmit(form, 1)">保存并继续新增</dy-button>
        <dy-button @click="confirmSubmit(form, 2)">保存</dy-button>
        <dy-button @click="returnlink">取消</dy-button>
      </div>
    </div>

  </div>
</template>

<script>
import systemManage from '../api' // 引入API
import rolePermissionList from '../common/rolePermissionList/rolePermissionList'
import { treeDataTranslate } from '@/utils/index'

export default {
  data() {
    return {
      form: {
        toUser: '', // 消息接收人
        requestBody: '', // 消息内容
        status: '', // 消息状态
        type: '', // 消息类型
        serverName: '', // 服务名
        sendTime: '', // 发送时间
        editTime: '' // 更新时间
      }
    }
  },
  created() {},
  methods: {
    returnlink() {
      this.$router.push({
        name: 'smsLog'
      })
    },
    // 提交新增
    confirmSubmit(form, type) {
      let data = form
      let input = /^[\s]*$/
      if (input.test(this.form.toUser)) {
        this.$ego.alertMsg('请输入消息接收人', 'warning', 1000)
        return false
      }
      if (!isInteger(parseInt(this.form.status))) {
        this.$ego.alertMsg('消息状态必须为数字', 'warning', 1000)
        return false
      }
      if (!isInteger(parseInt(this.form.type))) {
        this.$ego.alertMsg('消息类型必须为数字', 'warning', 1000)
        return false
      }
      if (input.test(this.form.serverName)) {
        this.$ego.alertMsg('请输入服务名', 'warning', 1000)
        return false
      }
      if (input.test(this.form.sendTime)) {
        this.$ego.alertMsg('请输入发送时间', 'warning', 1000)
        return false
      }
      if (input.test(this.form.editTime)) {
        this.$ego.alertMsg('请输入更新时间', 'warning', 1000)
        return false
      }
      let params = {
        toUser: this.form.toUser, // 消息接收人
        requestBody: this.form.requestBody, // 消息内容
        status: this.form.status, // 消息状态
        type: this.form.type, // 消息类型
        serverName: this.form.serverName, // 服务名
        sendTime: this.form.sendTime, // 发送时间
        editTime: this.form.editTime // 更新时间
      }
      systemManage.saveSmsLog(params).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          this.$ego.alertMsg(response.data.msg, 'success', 1000)
          if (type === 1) {
            this.form.toUser = ''
            this.form.requestBody = ''
            this.form.status = ''
            this.form.type = ''
            this.form.serverName = ''
            this.form.sendTime = ''
            this.form.editTime = ''
          } else {
            this.returnlink() // 保存按钮跳转到列表查看
          }
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    }
  }
}
</script>
