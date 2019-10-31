<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <!-- 搜索框 -->
      <div class="dsf_search_condition">
        <dy-input v-model="form.username"
          placeholder="请输入用户名"
          width="250"
          maxlength="16"
          @keyup.enter="searchListByName"></dy-input>
        <dy-button type="default"
          class="marginL10"
          @click="searchListByName">搜索</dy-button>
      </div>
      <!-- 应用表开始 -->
      <div class="marginT20">
        <dy-table :data-source="dataTable"
          :columns="columns"
          @page-change="getTableData"
          :loading="loading"></dy-table>

        <!-- <div class="dy_table"
          v-loading="loading">
          <table class="table_noSelected"
            border="0"
            cellspacing="10"
            cellpadding="10">
            <tr>
              <th width="90">日志名称</th>
              <th width="74">类型</th>
              <th width="90">用户名称</th>
              <th width="104">时间</th>
              <th width="240">具体消息</th>
              <th width="120">IP</th>
            </tr>
            <tr class="dy_table_tips  "
              v-if="dataTable.length < 1">
              <td>暂无数据</td>
            </tr>
            <tr class="dy_table_row"
              v-for="(item,index) in dataTable"
              :key="index">
              <td>{{item.logname}}</td>
              <td>{{item.succeed}}</td>
              <td>{{item.username}}</td>
              <td>{{item.createtime}}</td>
              <td>{{item.message}}</td>
              <td>{{item.ip}}</td>
            </tr>
          </table>
        </div> -->
        <div v-if="dataTable.length > 0"
          class="fr marginT10">
          <!-- <dy-pagination :total="pager.total"
            show-quick-jumper
            show-page-size
            show-total /> -->
          <dy-pagination simplify
            :total="pager.total"
            :currentPage="pager.currentPage"
            :page-size-options="pager.sizes"
            show-page-size
            showTotal
            show-quick-jumper
            @page-change="handleSizeChange" />
        </div>
      </div>
      <!-- 监控表结束 -->
    </div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入API
import { tableBase } from '@/utils/systemCom.js'

export default {
  data() {
    return {
      dataTable: [],
      pager: {
        pageSize: 10, // 当前页默认个数
        currentPage: 1, // 当前页
        total: 0, // 列表数据总数
        sizes: [10, 20, 50] // 当前页列表数据个数
      },
      loading: false, // 加载动画
      // 表格标题
      columns: [
        {
          title: '日志名称',
          dataIndex: 'logname'
        },
        {
          title: '类型',
          dataIndex: 'succeed'
        },
        {
          title: '用户名称',
          dataIndex: 'username'
        },
        {
          title: '时间',
          dataIndex: 'createtime'
        },
        {
          title: '具体消息',
          dataIndex: 'message'
        },
        {
          title: 'IP',
          dataIndex: 'ip'
        }
      ],
      form: {
        username: '',
        page: 1,
        limit: 10
      } // 查询参数
    }
  },
  mixins: [tableBase],
  methods: {
    loadDataTable(params) {
      this.loading = true
      systemManage.loginLogList(params).then(response => {
        if (response.data.code === 0) {
          // 分页参数
          this.pager.currentPage = response.data.data.currPage
          this.pager.total = response.data.data.totalCount
          this.pager.pageSize = response.data.data.pageSize
          this.dataTable = response.data.data.list
          // 数据加载完成结束loding
          this.loading = false
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    }
  }
}
</script>
