<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <!-- 搜索框 -->
      <div class="dsf_search_condition">
        <dy-input v-model="form.username"
          @keyup.enter="searchListByName"
          width="250"
          class="fl"
          maxlength="16"
          placeholder="请输入用户名"></dy-input>
        <dy-select class="marginL10 fl"
          @change="searchListByName"
          v-model="form.logType">
          <dy-select-option v-for="option in selectList"
            :key="option.id"
            :value="option.id"
            :label="option.label">
          </dy-select-option>
        </dy-select>
        <dy-button class="marginL10 fl"
          @click="searchListByName">搜索</dy-button>
      </div>
      <!-- 应用表开始 -->
      <div class="marginT20">
        <div class="dy_table "
          v-loading="loading">
          <table border="0"
            cellspacing="10"
            cellpadding="10"
            class="table_noSelected">
            <tr>
              <th width="88">日志类型</th>
              <th width="120">日志名称</th>
              <th width="120">用户名称</th>
              <th width="180">方法名</th>
              <th width="104">时间</th>
              <th width="180">具体消息</th>
              <th width="100"
                v-if="form.logType === '1'">错误消息</th>
              <th width="62"
                v-permission="'dsf:log:info'"
                class="table_operating">操作</th>
            </tr>
            <tr class="dy_table_tips  "
              v-if="dataTable.length < 1">
              <td>暂无数据</td>
            </tr>
            <tr class="dy_table_row"
              v-for="(item,index) in dataTable"
              :key="index">
              <td>{{item.logType==='0'?'业务日志':(item.logType==='1'?'异常日志':'')}}</td>
              <td :title="item.operation">{{item.operation}}</td>
              <td :title="item.username">{{item.username}}</td>
              <td :title="item.method.length>17?item.method:''">{{item.method}}</td>
              <td :title="item.createDate?item.createDate:''">{{item.createDate}}</td>
              <td :title="item.params?(item.params.length>18?item.params:''):''">{{item.params}}</td>
              <td v-if="form.logType === '1'"
                :title="item.errorMessage">{{item.errorMessage}}</td>
              <td class="edit_now"
                v-permission="'dsf:log:info'">
                <div class="admin_operate">
                  <i class="iconfont icon-operation-group"></i>
                  <div class="edit_inline">
                    <router-link :to="{ name: 'operateLogsDetail', query: {id: item.id} }">查看</router-link>
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
      <!-- <div class="marginT20">
        <dy-table :data-source="dataTable"
          v-loading="loading"
          :columns="columns">
        </dy-table>
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
      </div> -->
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
      // columns: [
      //   {
      //     title: '日志类型',
      //     dataIndex: 'logType',
      //     formatter(logType) {
      //       const statusMap = {
      //         '0': '业务日志',
      //         '1': '异常日志'
      //       }
      //       return statusMap[logType]
      //     }
      //   },
      //   {
      //     title: '日志名称',
      //     dataIndex: 'operation'
      //   },
      //   {
      //     title: '用户名称',
      //     dataIndex: 'username'
      //   },
      //   {
      //     title: '方法名',
      //     dataIndex: 'method'
      //   },
      //   {
      //     title: '时间',
      //     dataIndex: 'createDate'
      //   },
      //   {
      //     title: '具体消息',
      //     dataIndex: 'params'
      //   },
      //   {
      //     title: '操作',
      //     dataIndex: 'action',
      //     render(h, { data }) {
      //       return h(
      //         'div',
      //         {
      //           class: {
      //             admin_operate: true
      //           }
      //         },
      //         [
      //           h('i', {
      //             class: {
      //               iconfont: true,
      //               'icon-operation-group': true
      //             }
      //           }),
      //           h(
      //             'div',
      //             {
      //               class: {
      //                 edit_inline: true
      //               }
      //             },
      //             [
      //               h(
      //                 'router-link',
      //                 {
      //                   props: {
      //                     to: `operateLogsDetail?id=${data.id}`
      //                   }
      //                 },
      //                 ['查看']
      //               )
      //             ]
      //           )
      //         ]
      //       )
      //     }
      //   }
      // ],
      loading: false, // 加载动画
      selectList: [
        {
          id: '0',
          label: '业务日志'
        },
        {
          id: '1',
          label: '异常日志'
        }
      ],
      form: {
        username: '',
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
      systemManage.operateLogList(params).then(response => {
        if (response.data.code === 0) {
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
