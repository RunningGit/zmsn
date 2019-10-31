<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <!-- 搜索框 -->
      <div class="dsf_search_condition">
        <dy-input v-model="form.jobId"
          @keyup.enter="searchListByName"
          width="250"
          class="fl"
          maxlength="16"
          placeholder="请输入任务id"></dy-input>
        <dy-button class="marginL10 fl"
          @click="searchListByName">搜索</dy-button>
      </div>
      <!-- 应用表开始 -->
      <!--  viewFramework-item-mg-top  -->
      <div class="marginT20">
        <div class="dy_table "
          v-loading="loading">
          <table border="0"
            cellspacing="10"
            cellpadding="10"
            class="table_noSelected">
            <tr>
              <th>任务id</th>
              <th>任务日志id</th>
              <th>请求地址</th>
              <th>请求方法</th>
              <th>参数</th>
              <th>状态</th>
              <th>耗时时长（单位：毫秒）</th>
              <th>执行时间</th>
              <th v-permission="'sys:schedule:list'"
                class="table_operating">操作</th>
            </tr>
            <tr class="dy_table_tips"
              v-if="dataTable.length < 1">
              <td>暂无数据</td>
            </tr>
            <tr class="dy_table_row"
              v-for="(item,index) in dataTable"
              :key="index">
              <td :title="item.jobId">{{item.jobId}}</td>
              <td :title="item.logId">{{item.logId}}</td>
              <td :title="item.requestUrl">{{item.requestUrl}}</td>
              <td :title="item.requestMethod">{{item.requestMethod}}</td>
              <td :title="item.params">{{item.params}}</td>
              <td :title="item.statusName">{{item.statusName}}</td>
              <td :title="item.times">{{item.times}}</td>
              <td :title="item.createTime">{{item.createTime}}</td>
              <td class="edit_now"
                v-permission="'sys:schedule:list'">
                <div class="admin_operate">
                  <i class="iconfont icon-operation-group"></i>
                  <div class="edit_inline">
                    <router-link :to="{ name: 'taskLogsDetail', query: {id: item.logId} }">查看</router-link>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div v-if="dataTable.length > 0"
          class="fr">
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
import { tableBase } from '@/utils/systemCom.js'
import permission from '@/directives/permission'

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
      form: {
        jobId: '',
        logType: '0',
        page: 1,
        limit: 10
      } // 查询参数
    }
  },
  mixins: [tableBase],
  directives: { permission },
  methods: {
    loadDataTable(params) {
      this.loading = true
      systemManage.taskloglist(params).then(response => {
        if (response.data.code === 0) {
          this.pager.currentPage = response.data.data.currPage
          this.pager.total = response.data.data.totalCount
          this.pager.pageSize = response.data.data.pageSize
          response.data.data.list.forEach(element => {
            element.statusName = element.status === 0 ? '成功' : '失败'
          })
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
