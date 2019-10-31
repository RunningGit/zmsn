<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <!-- 搜索框 -->
      <div class="dsf_search_condition">
        <dy-input v-model="form.beanName"
          placeholder="请输入bean名称"
          maxlength="16"
          @handleKeyup="searchListByName"></dy-input>
        <dy-button type="default"
          class="marginL10"
          @click="searchListByName">搜索</dy-button>
        <dy-button class="fr"
          v-permission="'sys:schedule:save'"
          @click="$router.push({ name: 'timingTaskAdd'})">新增</dy-button>
        <dy-button class="fr marginR10"
          v-permission="'sys:schedule:run'"
          @click="runAll('定时任务', 'jobId')">批量立即执行</dy-button>
        <dy-button class="fr marginR10"
          v-permission="'sys:schedule:resume'"
          @click="resumeAll('定时任务', 'jobId')">批量恢复</dy-button>
        <dy-button class="fr marginR10"
          v-permission="'sys:schedule:pause'"
          @click="stopAll('定时任务', 'jobId')">批量暂停</dy-button>
        <dy-button class="fr  marginR10"
          v-permission="'sys:schedule:delete'"
          @click="delAll('定时任务', 'jobId')">批量删除</dy-button>
      </div>
      <!-- 应用表开始 -->
      <!--  viewFramework-item-mg-top  -->
      <div class="marginT20">
        <div class="dy_table"
          v-loading="loading">
          <table border="0"
            cellspacing="10"
            cellpadding="10">
            <tr>
              <th width="44"
                v-if="dataTable.length > 0">
                <label class="dy_checkbox"
                  @click="selectAll">
                  <span class="dy_checked_input">
                    <input type="checkbox"
                      :checked="hasCheckedAll">
                    <i class="icon iconfont "
                      :class="hasCheckedAll?'icon-check':'icon-check-square'"></i>
                  </span>
                </label>
              </th>
              <th width="60">ID</th>
              <th width="192">bean名称</th>
              <th width="72">方法名称</th>
              <th width="70">参数</th>
              <th width="188">cron表达式</th>
              <th width="200">备注</th>
              <th width="72">状态</th>
              <th width="60"
                class="table_operating">操作</th>
            </tr>
            <tr class="dy_table_tips  "
              v-if="dataTable.length < 1">
              <td>暂无数据</td>
            </tr>
            <tr class="dy_table_row"
              v-for="(item,index) in dataTable"
              :key="index">
              <td v-if="dataTable.length > 0">
                <label class="dy_checkbox"
                  @click="handleSelectionChange(item)">
                  <span class="dy_checked_input">
                    <input type="checkbox"
                      :checked="item.checked">
                    <i class="icon iconfont "
                      :class="item.checked?'icon-check':'icon-check-square'"></i>
                  </span>
                </label>
              </td>
              <td>{{item.jobId}}</td>
              <td :title="item.beanName.length>12?item.beanName:''">{{item.beanName}}</td>
              <td>{{item.methodName}}</td>
              <td>{{item.params}}</td>
              <td>{{item.cronExpression}}</td>
              <td>{{item.remark}}</td>
              <td>{{item.statusName}}</td>
              <td class="edit_now"
                v-permission="'sys:schedule:update || sys:schedule:resume || sys:schedule:delete || sys:schedule:run'">
                <div class="admin_operate">
                  <i class="iconfont icon-operation-group"></i>
                  <div class="edit_inline">
                    <router-link :to="{ name: 'timingTaskDetail' ,query: { id: item.jobId, type: 'detail' }}"
                      v-permission="'sys:schedule:list'">查看</router-link>
                    <router-link :to="{ name: 'timingTaskDetail' ,query: { id: item.jobId, type: 'compile' }}"
                      v-permission="'sys:schedule:update'">修改</router-link>
                    <a href="javascript:;"
                      v-permission="'sys:schedule:resume'"
                      v-if="item.status === 1"
                      @click="resumeThis(item.jobId)">恢复</a>
                    <a href="javascript:;"
                      v-permission="'sys:schedule:pause'"
                      v-if="item.status === 0"
                      @click="stopThis(item.jobId)">暂停</a>
                    <a href="javascript:;"
                      v-permission="'sys:schedule:delete'"
                      @click="del(item.jobId, item.beanName)">删除</a>
                    <a href="javascript:;"
                      v-permission="'sys:schedule:run'"
                      @click="runThis(item.jobId)">立即执行</a>
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
import { tableBase } from '@/utils/systemCom.js' // 引入列表的公共方法

export default {
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
        beanName: '',
        page: 1,
        limit: 10
      },
      hasCheckedAll: false, // 全选反选,
      stateOptionsTrue: true
    }
  },
  mixins: [tableBase],
  methods: {
    // 点击空白处的监听
    handleClose(e) {
      this.stateOptionsTrue = true
    },
    loadDataTable(params) {
      this.loading = true
      // 请求加载table 数据
      systemManage.timingTasklist(params).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          this.pager.currentPage = response.data.data.currPage
          this.pager.total = response.data.data.totalCount
          this.pager.pageSize = response.data.data.pageSize
          let dataList = response.data.data.list
          if (dataList.length > 0) {
            dataList.forEach(item => {
              item.checked = false
              switch (item.status) {
                case 0:
                  item.statusName = '正常'
                  break
                case 1:
                  item.statusName = '暂停'
                  break
              }
            })
          }
          this.dataTable = dataList
          // 数据加载完成结束loding
          this.loading = false
          this.hasCheckedAll = false
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 状态筛选，当前页筛选
    sattusSearch(status) {
      this.form.status = status
      this.form.page = 1
      this.init(this.form)
    },
    // 执行对应
    dataFunction(params, type) {
      let apiFun
      var text = '执行'
      switch (type) {
        case 'del':
          apiFun = systemManage.taskDelete
          text = '删除'
          break
        case 'run':
          apiFun = systemManage.runTask
          text = '执行'
          break
        case 'stop':
          apiFun = systemManage.pauseTask
          text = '暂停'
          break
        case 'resume':
          apiFun = systemManage.resumeTask
          text = '恢复'
          break
      }
      apiFun(params).then(response => {
        if (response.data.code === 0) {
          this.$ego.alertMsg(text + '成功', 'success', 1000)
          this.init(this.form)
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 单个删除
    delData(params) {
      systemManage.taskDelete(params).then(response => {
        if (response.data.code === 0) {
          this.$ego.alertMsg('删除成功', 'success', 1000)
          this.init(this.form)
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    }
  }
}
</script>
