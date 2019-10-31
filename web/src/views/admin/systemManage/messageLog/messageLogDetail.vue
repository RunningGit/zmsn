<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <div class="dsf_system_btn">
        <dy-button @click="returnlink">返回</dy-button>
      </div>
      <div class="dsf_system_title">
        <h1 v-if="detailTrue">日志详情</h1>
        <h1 v-else>编辑日志详情</h1>
      </div>
      <div class="dsf_system_section">
        <div class="dsf_label_item">
          <label class="dsf_label_name">发送人:</label>
          <div class="dsf_label_input">
            <label>{{entityItem.messageSendUserName || '无'}}</label>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">标题:</label>
          <div class="dsf_label_input">
            <label>{{entityItem.title || '无'}}</label>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">发送内容:</label>
          <div class="dsf_label_input">
            <label>{{entityItem.messageContent || '无'}}</label>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">发送时间:</label>
          <div class="dsf_label_input">
            <label>{{entityItem.sendTime || '无'}}</label>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">接收人:</label>
          <div class="dsf_label_input">
            <div v-if="entityItem.dsfMessageRef.length"
              v-for="(item, index) in entityItem.dsfMessageRef"
              :key="index">{{item.messageAcceptName}}</div>
          </div>
        </div>
      </div>
      <div class="dsf_system_btn"
        v-if="!detailTrue">
        <dy-button type="primary"
          @click="updateGroupDetail()">保存</dy-button>
        <dy-button @click="gotodetail()">取消</dy-button>
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
      messageSendUserName: '',
      title: '',
      entityItem: {}, // 角色信息
      pager: {
        pageSize: 10,
        currentPage: 1
      },
      detailTrue: true
    }
  },
  components: {
    rolePermissionList
  },
  methods: {
    init() {
      this.pager.currentPage = this.$route.query.currentPage
      this.pager.pageSize = this.$route.query.pageSize
      this.loadData()
    },
    returnlink: function() {
      this.$router.push({
        name: 'messageLog'
      }) // 返回到消息日志列表
    },
    loadData() {
      // 请求加载table 数据
      let params = {
        page: this.pager.currentPage,
        limit: this.pager.pageSize // 每页条数
      }
      systemManage.messageloglist(params).then(response => {
        if (response.data.code === 0) {
          let data = response.data.data
          this.entityItem = data.list[this.$route.query.idx]
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    }
  },
  created() {
    this.init()
  },
  watch: {
    $route(to, from) {
      if (to.name === from.name && to.name === 'messageLogDetail') {
        this.init()
      }
    }
  }
}
</script>
