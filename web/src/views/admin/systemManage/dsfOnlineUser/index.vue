<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <!-- 应用表开始 -->

      <!--  viewFramework-item-mg-top  -->
      <div class="marginT20">
        <div class="dy_table">
          <table class="table_noSelected"
            border="0"
            cellspacing="10"
            cellpadding="10">
            <tr>
              <th width="100">用户Token</th>
              <th width="100">用户账号</th>
              <th width="100">部门名称</th>
              <th width="100">主机IP</th>
              <th width="100">浏览器</th>
              <th width="100">操作系统</th>
              <th width="100">登录时间</th>
              <th width="100">最后访问时间</th>
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
              <td>{{item.token}}</td>
              <td>{{item.userName}}</td>
              <td>{{item.deptName}}</td>
              <td>{{item.host}}</td>
              <td>{{item.browser}}</td>
              <td>{{item.os}}</td>
              <td>{{item.loginTime}}</td>
              <td>{{item.lastAccessTime}}</td>
              <td class="edit_now">
                <div class="admin_operate">
                  <i class="iconfont icon-operation-group"></i>
                  <div class="edit_inline">
                    <a href="javascript:;"
                      @click="del(item.token, item.userName)">强退</a>
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
      }
    }
  },
  methods: {
    // 获取列表信息
    loadDataTable(params) {
      this.loading = true
      systemManage.queryDsfOnlineUserList(params).then(response => {
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
      systemManage.deleteDsfOnlineUser(params).then(response => {
        if (response.data.code === 0) {
          this.$ego.alertMsg('强退成功', 'success', 1000)
          this.init(this.form)
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    }
  }
}
</script>
