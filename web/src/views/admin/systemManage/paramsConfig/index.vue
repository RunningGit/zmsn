<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <!-- 搜索框 -->
      <div class="dsf_search_condition">
        <dy-input v-model="form.key"
          placeholder="请输入参数名"
          maxlength="16"
          style="width: 250px;"
          @keyup.enter="searchListByName"></dy-input>
        <dy-button class="marginL10"
          @click="searchListByName">搜索</dy-button>
        <dy-button class="fr marginL10"
          v-permission="'dsf:config:delete'"
          @click="delAll('参数名')">批量删除</dy-button>
        <dy-button class="fr"
          v-permission="'dsf:config:save'"
          @click="$router.push({name: 'paramsConfigAdd'})">新增参数</dy-button>
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
              <th width="45"
                v-if="dataTable.length > 0">
                <label class="dy_checkbox"
                  @click="selectAll()">
                  <span class="dy_checked_input">
                    <input type="checkbox"
                      :checked="hasCheckedAll">
                    <i class="icon iconfont "
                      :class="hasCheckedAll?'icon-check':'icon-check-square'"></i>
                  </span>
                </label>
              </th>
              <th width="72">参数名</th>
              <th width="104">参数值</th>
              <th width="188">备注</th>
              <th class="table_operating"
                v-permission="'dsf:config:update || dsf:config:info || dsf:config:delete'"
                width="60">操作</th>
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
              <td :title="item.configkey.length>8?item.configkey:''">{{item.configkey}}</td>
              <td :title="item.configvalue.length>13?item.configvalue:''">{{item.configvalue}}</td>
              <td :title="item.remark?(item.remark.length>24?item.remark:''):''">{{item.remark}}</td>
              <td class="edit_now"
                v-permission="'dsf:config:update || dsf:config:info || dsf:config:delete'">
                <div class="admin_operate">
                  <i class="iconfont icon-operation-group"></i>
                  <div class="edit_inline">
                    <router-link :to="{name: 'paramsConfigDetail',query:{id: item.id, type: 'edit'}}"
                      v-permission="'dsf:config:update'">编辑</router-link>
                    <router-link :to="{name: 'paramsConfigDetail',query:{id: item.id}}"
                      v-permission="'dsf:config:info'">查看</router-link>
                    <a href="javascript:;"
                      v-permission="'dsf:config:delete'"
                      @click="del(item.id, item.configkey)">删除</a>
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
      dataTable: [], // 列表数据
      pager: {
        pageSize: 10, // 当前页默认个数
        currentPage: 1, // 当前页
        total: 0, // 列表数据总数
        sizes: [10, 20, 50] // 当前页列表数据个数
      },
      loading: false, // 加载动画
      hasCheckedAll: false, // 全选反选
      form: {
        key: '',
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
      systemManage.paramsConfigList(params).then(response => {
        if (response.data.code === 0) {
          this.pager.currentPage = response.data.data.currPage
          this.pager.total = response.data.data.totalCount
          this.pager.pageSize = response.data.data.pageSize
          let dataList = response.data.data.list
          if (dataList.length > 0) {
            dataList.forEach(item => {
              item.checked = false
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
    // 删除&批量删除
    delData(params) {
      systemManage.delParamsConfig(params).then(response => {
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
