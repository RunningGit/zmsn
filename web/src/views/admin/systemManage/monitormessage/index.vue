<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <!-- 搜索框 -->
      <div class="dsf_search_condition">
        <!-- <dy-input class="fl"
          v-model="form.id"
          placeholder="消息ID"
          maxlength="16"
          width="250"
          @keyup.enter="searchListByName"></dy-input> -->
        <dy-select class="fl"
          placeholder="消息状态"
          v-model="form.status">
          <dy-select-option v-for="option in statusList"
            :key="option.id"
            :value="option.id"
            :label="option.label">
          </dy-select-option>
        </dy-select>
        <dy-select class="marginL10 fl"
          placeholder="消息队列"
          v-model="form.queue">
          <dy-select-option v-for="option in messageList"
            :key="option.id"
            :value="option.id"
            :label="option.label">
          </dy-select-option>
        </dy-select>
        <dy-button class="marginL10"
          @click="searchListByName">搜索</dy-button>
        <dy-button class="marginL10 fr"
          @click="retransmissionFun('2')">批量重发</dy-button>
        <dy-select class=" fr"
          placeholder="消息队列"
          v-model="messageRetrydata">
          <dy-select-option v-for="option in messageRetryList"
            :key="option.id"
            :value="option.id"
            :label="option.label">
          </dy-select-option>
        </dy-select>
      </div>

      <!-- 应用表开始 -->

      <!--  viewFramework-item-mg-top  -->
      <div class="marginT20">
        <div class="dy_table">
          <table class="table_noSelected"
            border="0"
            cellspacing="10"
            cellpadding="10">
            <tr>
              <th width="100">消息内容</th>
              <th width="100">消费队列</th>
              <th width="100">确认状态uri</th>
              <th width="100">消息重发次数</th>
              <th width="100">消息状态 </th>
              <th width="100">创建时间</th>
              <th width="100">更新时间</th>
              <th width="100">超时时间</th>
              <th width="62"
                class="table_operating">操作</th>
            </tr>
            <tr class="dy_table_tips"
              v-if="dataTable.length < 1">
              <td>暂无数据</td>
            </tr>
            <tr class="dy_table_row"
              v-for="(item,index) in dataTable"
              :key="index">
              <td>{{item.content}}</td>
              <td>{{item.queue}}</td>
              <td>{{item.confirmUri}}</td>
              <td>{{item.sendTimes}}</td>
              <td>{{item.status === '0'? '待发送': item.status === '1'? '发送中': '已消亡'}}</td>
              <td>{{item.createTime}}</td>
              <td>{{item.updateTime}}</td>
              <td>{{item.expireTime}}</td>
              <td class="edit_now">
                <div class="admin_operate">
                  <i class="iconfont icon-operation-group"></i>
                  <div class="edit_inline">
                    <div v-if="item.status === '2'"
                      @click="retransmissionFun('1',item.id)">重发</div>
                    <div v-else>无</div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div class="fr">
          <dy-pagination simplify
            :total="pager.total"
            :currentPage="pager.currentPage"
            :page-size-options="pager.sizes"
            show-page-size
            show-quick-jumper
            showTotal
            @page-change="handleSizeChange" />
        </div>
      </div>
      <!-- 监控表结束 -->
    </div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入API
import { tableBase } from '@/utils/systemCom.js' // 引入列表的公共方法
import permission from '@/directives/permission'
import { isAuth } from '@/utils' // 权限控制

export default {
  mixins: [tableBase],
  data() {
    return {
      dataTable: [],
      loading: false,
      pager: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        sizes: [10, 20, 50]
      },
      form: {
        id: '',
        page: 1,
        limit: 10
      },
      statusList: [
        {
          id: '0',
          label: '待发送'
        },
        {
          id: '1',
          label: '发送中'
        },
        {
          id: '2',
          label: '已消亡'
        }
      ],
      messageList: [
        {
          id: 'do1.dsf.member.order.point',
          label: '会员队列'
        }
      ],
      messageRetrydata: '',
      messageRetryList: [
        {
          id: 'do1.dsf.member.order.point',
          label: '会员队列'
        }
      ]
    }
  },
  methods: {
    // 获取列表信息
    loadDataTable(params) {
      this.loading = true
      systemManage.queryMonitorMessageList(params).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          this.pager.currentPage = response.data.data.currPage
          this.pager.total = response.data.data.totalCount
          this.pager.pageSize = response.data.data.pageSize
          let dataList = response.data.data.list
          this.dataTable = dataList
          // 数据加载完成结束loading
          this.loading = false
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 单个删除
    delData(params) {
      systemManage.deleteMonitorMessage(params).then(response => {
        if (response.data.code === 0) {
          this.$ego.alertMsg('删除成功', 'success', 1000)
          this.init(this.form)
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 重发
    retransmissionFun(status, param) {
      let params = {}
      // status = 1 单个重发 status = 2 批量重发
      if (status === '1') {
        params = {
          id: param,
          status: status
        }
      } else if (status === '2') {
        if (this.messageRetrydata === '') {
          return this.$ego.alertMsg('请选择重发队列！', 'warning', 1000)
        }
        params = {
          queue: this.messageRetrydata,
          size: 1000,
          state: status
        }
      }
      systemManage.retransmission(params).then(response => {
        if (response.data.code === 0) {
          this.$ego.alertMsg(response.msg, 'success', 1000)
          this.init(this.form)
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    }
  }
}
</script>
