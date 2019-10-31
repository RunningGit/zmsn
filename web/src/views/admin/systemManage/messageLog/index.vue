<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <!-- tabbar -->
      <!-- 搜索条件 -->
      <div class="dsf_search_condition">
        <div class="fl">
          <div class="fl dsf_messagelog_time">时间：</div>
          <el-date-picker v-model="startTime"
            :default-value="startTime"
            type="date"
            format="yyyy-MM-dd"
            :clearable='false'
            :editable='false'
            @change='startDate()'
            placeholder="选择日期">
          </el-date-picker>
          <div class="fl dsf_messagelog_line">-</div>
          <el-date-picker v-model="endTime"
            type="date"
            :default-value="endTime"
            format="yyyy-MM-dd"
            :clearable='false'
            :editable='false'
            @change='endDate()'
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="fl marginL10">
          <div class="fl">内容：</div>
          <dy-input placeholder="请输入内容"
            maxlength="16"
            width="250"
            size="mini"
            v-model="operation"
            @keyup.enter="loadDataTable"></dy-input>
        </div>
        <dy-button class="fl marginL10"
          @click="loadDataTable">搜索
        </dy-button>
      </div>
      <section class="marginT20">
        <div class="dy_table"
          style="width:100%">
          <table border="0"
            cellspacing="10"
            cellpadding="10"
            class="table_noSelected"
            v-if="tabIndex==0">
            <tr>
              <th>发送人</th>
              <th>标题</th>
              <th>内容</th>
              <th>终端类型</th>
              <th>接收人</th>
              <th>发送时间</th>
              <th class="edit table_operating"
                v-permission="'dsf:messageLog:list'"
                width="62">操作</th>
            </tr>
            <tr class="dy_table_tips"
              v-if="dataTable.length < 1">
              <td>暂无数据</td>
            </tr>
            <tr class="dy_table_row"
              v-for="(item,index) in dataTable"
              :key="index">
              <td>{{item.messageSendUserName}}</td>
              <td>{{item.title}}</td>
              <td>{{item.messageContent}}</td>
              <td>{{ item.terminalType }}</td>
              <td>{{ item.sendTime }}</td>
              <td class="edit"
                v-permission="'dsf:messageLog:list'">
                <div class="edit_inline">
                  <a href="javascript:;"
                    type="text"
                    @click="detail(index)">查看</a>
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
      </section>
    </div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入API
import permission from '@/directives/permission'

export default {
  data() {
    return {
      tabIndex: 0,
      startTime: '',
      endTime: '',
      operation: '',
      dataTable: [],
      pager: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        sizes: [10, 20, 50]
      }
    }
  },
  directives: { permission },
  methods: {
    changeTabNum(index) {
      // 当tabindex = index 的时候选中
      this.tabIndex = index
    },
    loadDataTable() {
      // 请求加载table 数据
      let params = {
        page: this.pager.currentPage,
        limit: this.pager.pageSize // 每页条数
      }
      if (this.startTime === null) {
        this.$ego.alertMsg('请选择开始时间', 'warning', 1000)
        return false
      } else if (this.endTime === null) {
        this.$ego.alertMsg('请选择结束时间', 'warning', 1000)
        return false
      }
      if (this.startTime !== undefined) {
        params.startTime = this.startTime
      }
      if (this.endTime !== undefined) {
        params.endTime = this.endTime
      }
      if (this.operation !== '') {
        params.messageContent = this.operation
      }
      systemManage.messageloglist(params).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          var data = response.data.data
          this.dataTable = data.list
          this.pager.total = data.totalCount
          // 数据加载完成结束loding
          this.loading = false
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    handleSizeChange: function(val) {
      // 改变 pagerSize
      this.pager.pageSize = val
      this.loadDataTable()
    },
    handleCurrentChange: function(val) {
      // 翻页
      this.pager.currentPage = val
      this.loadDataTable()
    },
    handleSizeChangePopup: function(val) {
      // 改变 pagerSize
      this.page.pageSize = val
      this.getmessageRef()
    },
    handleCurrentChangePopup: function(val) {
      // 翻页
      this.page.currentPage = val
      this.getmessageRef()
    },
    detail(idx) {
      this.$router.push({
        name: 'messageLogDetail',
        query: {
          idx: idx,
          type: 'detail',
          currentPage: this.pager.currentPage,
          limit: this.pager.pageSize
        }
      })
    },
    // 处理结束日期
    endDate() {
      if (this.startTime === null) {
        this.$ego.alertMsg('请选择开始时间', 'warning', 1000)
        this.endTime = null
      } else if (this.startTime > this.endTime) {
        if (this.startTime && this.endTime) {
          this.$ego.alertMsg('结束时间不得小于开始时间', 'warning', 1000)
          this.endTime = null
        }
      }
    },
    // 开始日期
    startDate() {
      if (this.startTime === null) {
        this.$ego.alertMsg('请选择开始时间', 'warning', 1000)
      } else if (this.startTime > this.endTime) {
        if (this.startTime && this.endTime) {
          this.$ego.alertMsg('开始时间不能大于结束时间', 'warning', 1000)
          this.startTime = null
        }
      }
    }
  }
}
</script>
