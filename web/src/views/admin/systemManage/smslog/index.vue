<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <!-- 搜索框 -->
      <div class="dsf_search_condition">
        <dy-input class="fl marginR10 marginB10"
          v-model="form.toUser"
          placeholder="服务名"
          maxlength="16"
          width="250"
          @keyup.enter="searchListByName"></dy-input>
        <div class="fl marginB10">
          <div class="fl dsf_messagelog_time">时间：</div>
          <el-date-picker v-model="form.btime"
            :default-value="form.btime"
            type="date"
            format="yyyy-MM-dd"
            :clearable='false'
            :editable='false'
            @change='startDate()'
            placeholder="选择日期">
          </el-date-picker>
          <div class="fl dsf_messagelog_line">-</div>
          <el-date-picker v-model="form.etime"
            type="date"
            :default-value="form.etime"
            format="yyyy-MM-dd"
            :clearable='false'
            :editable='false'
            @change='endDate()'
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <dy-select class="fl marginL10 marginB10"
          placeholder="消息状态"
          v-model="form.status">
          <dy-select-option v-for="option in statusList"
            :key="option.id"
            :value="option.id"
            :label="option.label">
          </dy-select-option>
        </dy-select>
        <dy-select class="marginL10 fl marginB10"
          placeholder="消息类型"
          v-model="form.type">
          <dy-select-option v-for="option in typeList"
            :key="option.id"
            :value="option.id"
            :label="option.label">
          </dy-select-option>
        </dy-select>
        <dy-button class="marginL10 marginB10"
          @click="searchListByName">搜索</dy-button>
        <!-- <dy-button class="fr " @click="$router.push({ name: 'addSmsLog' })">新增消息日志管理</dy-button> -->
      </div>

      <!-- 应用表开始 -->

      <!--  viewFramework-item-mg-top  -->
      <div class="marginT10">
        <div class="dy_table">
          <table class="table_noSelected"
            border="0"
            cellspacing="10"
            cellpadding="10">
            <tr>
              <th width="100">消息接收人</th>
              <th width="100">消息内容</th>
              <th width="100">消息状态</th>
              <th width="100">消息类型</th>
              <th width="100">服务名</th>
              <th width="100">发送时间</th>
              <th width="100">更新时间</th>
              <!-- <th width="62"
                class="table_operating">操作</th> -->
            </tr>
            <tr class="dy_table_tips"
              v-if="dataTable.length < 1">
              <td>暂无数据</td>
            </tr>
            <tr class="dy_table_row"
              v-for="(item,index) in dataTable"
              :key="index">
              <td>{{item.toUser}}</td>
              <td>{{item.requestBody}}</td>
              <td>{{item.statusName}}</td>
              <td>{{item.typeName}}</td>
              <td>{{item.serverName}}</td>
              <td>{{item.sendTime}}</td>
              <td>{{item.editTime}}</td>
              <!-- <td class="edit_now">
                <div class="admin_operate">
                  <i class="iconfont icon-operation-group"></i>
                  <div class="edit_inline">
                    <router-link :to="{ name: 'smsLogDetail' ,query: { id: item.id, type: 'compile' }}">编辑</router-link>
                    <router-link :to="{ name: 'smsLogDetail' ,query: { id: item.id, type: 'detail' }}">查看</router-link>
                    <a href="javascript:;"
                      @click="del(item.id, item.toUser)">删除</a>
                  </div>
                </div>
              </td> -->
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
        toUser: '',
        page: 1,
        limit: 10,
        btime: '',
        etime: '',
        status: '',
        type: ''
      },
      statusList: [
        {
          id: 1,
          label: '邮件'
        },
        {
          id: 2,
          label: '政务微信'
        },
        {
          id: 3,
          label: '微信公众号'
        },
        {
          id: 4,
          label: '短信'
        }
      ],
      typeList: [
        {
          id: 1,
          label: '已接受'
        },
        {
          id: 2,
          label: '已发送'
        },
        {
          id: 3,
          label: '发送成功'
        },
        {
          id: 4,
          label: '发送失败'
        }
      ]
    }
  },
  methods: {
    // 获取列表信息
    loadDataTable(params) {
      this.loading = true
      systemManage.querySmsLogList(params).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          this.pager.currentPage = response.data.data.currPage
          this.pager.total = response.data.data.totalCount
          this.pager.pageSize = response.data.data.pageSize
          let dataList = response.data.data.list
          let statusMap = {
            '1': '邮件',
            '2': '政务微信',
            '3': '微信公众号',
            '4': '短信'
          }
          let typeMap = {
            '1': '已接受',
            '2': '已发送',
            '3': '发送成功',
            '4': '发送失败'
          }
          if (dataList.length > 0) {
            dataList.forEach(item => {
              item.statusName = statusMap[item.status]
              item.typeName = typeMap[item.status]
            })
          }
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
      systemManage.deleteSmsLog(params).then(response => {
        if (response.data.code === 0) {
          this.$ego.alertMsg('删除成功', 'success', 1000)
          this.init(this.form)
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 开始日期
    startDate() {
      if (this.form.btime === null) {
        this.$ego.alertMsg('请选择开始时间', 'warning', 1000)
      } else if (this.form.btime > this.form.etime) {
        if (this.form.btime && this.form.etime) {
          this.$ego.alertMsg('开始时间不能大于结束时间', 'warning', 1000)
          this.form.btime = null
        }
      }
    },
    // 处理结束日期
    endDate() {
      if (this.form.btime === null) {
        this.$ego.alertMsg('请选择开始时间', 'warning', 1000)
        this.form.etime = null
      } else if (this.form.btime > this.form.etime) {
        if (this.form.btime && this.form.etime) {
          this.$ego.alertMsg('结束时间不得小于开始时间', 'warning', 1000)
          this.form.etime = null
        }
      }
    }
  }
}
</script>
