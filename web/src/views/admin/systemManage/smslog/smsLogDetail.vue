<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <div class="dsf_system_title">
        <h1 v-if="detailTrue"
          key="groupDetail">消息日志管理详情</h1>
        <h1 v-else
          key="groupEdit">编辑消息日志管理</h1>
      </div>
      <div class="dsf_system_btn">
        <div v-if="detailTrue">
          <dy-button @click="back">
            <i class="iconfont icon-angle-double-left"></i>返回</dy-button>
          <dy-button @click="gotocompile()"
            v-if="detailTrue">编辑</dy-button>
        </div>
        <div v-if="!detailTrue">
          <dy-button type="primary"
            @click="updateDetail()">保存</dy-button>
          <dy-button @click="back()">取消</dy-button>
        </div>
      </div>
      <div class="dsf_system_section dsf_group_section">
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="require">*</span>
            消息接收人：
          </label>
          <div class="dsf_label_input">
            <label v-if="detailTrue">{{toUser}}</label>
            <div v-else>
              <dy-input maxlength="500"
                placeholder="请填写消息接收人名称"
                v-model="toUser">
              </dy-input>
            </div>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            消息内容：
          </label>
          <div class="dsf_label_input">
            <label v-if="detailTrue">{{requestBody}}</label>
            <div v-else>
              <dy-input maxlength="65535"
                placeholder="请填写消息内容名称"
                v-model="requestBody">
              </dy-input>
            </div>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            消息状态：
          </label>
          <div class="dsf_label_input">
            <label v-if="detailTrue">{{status}}</label>
            <div v-else>
              <dy-input placeholder="请填写消息状态名称"
                v-model="status">
              </dy-input>
            </div>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            消息类型：
          </label>
          <div class="dsf_label_input">
            <label v-if="detailTrue">{{type}}</label>
            <div v-else>
              <dy-input placeholder="请填写消息类型名称"
                v-model="type">
              </dy-input>
            </div>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="require">*</span>
            服务名：
          </label>
          <div class="dsf_label_input">
            <label v-if="detailTrue">{{serverName}}</label>
            <div v-else>
              <dy-input maxlength="100"
                placeholder="请填写服务名名称"
                v-model="serverName">
              </dy-input>
            </div>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="require">*</span>
            发送时间：
          </label>
          <div class="dsf_label_input">
            <label v-if="detailTrue">{{sendTime}}</label>
            <div v-else>
              <el-date-picker v-model="sendTime"
                type="date"
                placeholder="请选择发送时间" />
            </div>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="require">*</span>
            更新时间：
          </label>
          <div class="dsf_label_input">
            <label v-if="detailTrue">{{editTime}}</label>
            <div v-else>
              <el-date-picker v-model="editTime"
                type="date"
                placeholder="请选择更新时间" />
            </div>
          </div>
        </div>
      </div>
      <div class="dsf_system_btn">
        <div v-if="detailTrue"
          key="group-detail">
          <dy-button @click="back">
            <i class="iconfont icon-angle-double-left"></i>返回</dy-button>
          <dy-button @click="gotocompile()">编辑</dy-button>
        </div>
        <div v-else
          key="group-edit">
          <dy-button type="primary"
            @click="updateDetail()">保存</dy-button>
          <dy-button @click="back()">取消</dy-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入API
import { treeDataTranslate } from '@/utils/index'

export default {
  data() {
    return {
      dataID: '',
      detailTrue: true,
      toUser: '', // 消息接收人
      requestBody: '', // 消息内容
      status: '', // 消息状态
      type: '', // 消息类型
      serverName: '', // 服务名
      sendTime: '', // 发送时间
      editTime: '' // 更新时间
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === from.name && to.name === 'smsLogDetail') {
        this.init()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.dataID = this.$route.query.id // 角色ID
      let pageType = this.$route.query.type
      // 判断该页面是处于查看详情还是编辑状态--自定义:detail:详情页  compile:编辑状态页面
      this.detailTrue = pageType === 'detail'
      this.goDetail()
    },
    back() {
      this.$router.push({
        name: 'smsLog'
      })
    },
    gotocompile() {
      this.$router.push({
        name: 'smsLogDetail',
        query: { id: this.dataID, type: 'compile' }
      })
    },
    goDetail: function() {
      systemManage.getSmsLogDetail(this.dataID).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          var data = response.data.data
          this.dataID = data.id
          this.toUser = data.toUser
          this.requestBody = data.requestBody
          this.status = data.status
          this.type = data.type
          this.serverName = data.serverName
          this.sendTime = data.sendTime
          this.editTime = data.editTime
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 保存编辑状态上做的修改
    updateDetail() {
      var params = {
        id: this.dataID,
        toUser: this.toUser, // 消息接收人
        requestBody: this.requestBody, // 消息内容
        status: this.status, // 消息状态
        type: this.type, // 消息类型
        serverName: this.serverName, // 服务名
        sendTime: this.sendTime, // 发送时间
        editTime: this.editTime // 更新时间
      }
      let input = /^[\s]*$/
      if (input.test(this.toUser)) {
        this.$ego.alertMsg('请输入消息接收人', 'warning', 1000)
        return false
      }
      if (input.test(this.serverName)) {
        this.$ego.alertMsg('请输入服务名', 'warning', 1000)
        return false
      }
      if (input.test(this.sendTime)) {
        this.$ego.alertMsg('请输入发送时间', 'warning', 1000)
        return false
      }
      if (input.test(this.editTime)) {
        this.$ego.alertMsg('请输入更新时间', 'warning', 1000)
        return false
      }
      systemManage.updateSmsLogDetail(params).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          var data = response.data.data
          this.$ego.alertMsg(response.data.msg, 'success', 1000)
          this.$router.push({
            name: 'smsLog'
          })
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    }
  }
}
</script>
