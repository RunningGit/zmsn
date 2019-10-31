<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <!-- 搜索框 -->
      <div class="dsf_search_condition">
        <dy-input v-model="form.groupName"
          placeholder="管理组名称"
          maxlength="16"
          width="250"
          @keyup.enter="searchListByName"></dy-input>
        <dy-button class="marginL10"
          @click="searchListByName">搜索</dy-button>
        <dy-button class="fr"
          v-permission="'dsf:usergroupStatic:save'"
          @click="$router.push({ name: 'addSystemGroup'})">新增管理组</dy-button>
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
              <th>管理组名称</th>
              <th>备注</th>
              <th>创建人</th>
              <th>创建时间</th>
              <th width="62"
                class="table_operating"
                v-permission="'dsf:usergroupStatic:update || dsf:usergroupStatic:groupInfo || dsf:usergroupStatic:userInfo || dsf:usergroupStatic:delete'">操作</th>
            </tr>
            <tr class="dy_table_tips"
              v-if="dataTable.length < 1">
              <td>暂无数据</td>
            </tr>
            <tr class="dy_table_row"
              v-for="(item,index) in dataTable"
              :key="index">
              <td :title="item.groupName.length>15?item.groupName:''">{{item.groupName}}</td>
              <td :title="item.groupRemark.length>15?item.groupRemark:''">{{item.groupRemark}}</td>
              <td>{{item.gmtAuthor}}</td>
              <td>{{item.gmtCreated}}</td>
              <td class="edit_now"
                v-permission="'dsf:usergroupStatic:update || dsf:usergroupStatic:groupInfo || dsf:usergroupStatic:userInfo || dsf:usergroupStatic:delete'">
                <div class="admin_operate">
                  <i class="iconfont icon-operation-group"></i>
                  <div class="edit_inline">
                    <router-link :to="{ name: 'systemGroupDetail' ,query: { id: item.groupId, type: 'compile' }}"
                      v-permission="'dsf:usergroupStatic:update'">编辑</router-link>
                    <router-link :to="{ name: 'systemGroupDetail' ,query: { id: item.groupId, type: 'detail' }}"
                      v-permission="'dsf:usergroupStatic:groupInfo'">查看</router-link>
                    <router-link :to="{ name: 'member' ,query: { id: item.groupId}}"
                      v-permission="'dsf:usergroupStatic:userInfo'">成员管理</router-link>
                    <a href="javascript:;"
                      v-permission="'dsf:usergroupStatic:delete'"
                      @click="del(item.groupId, item.groupName)">删除</a>
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
        groupName: '',
        page: 1,
        limit: 10
      }
    }
  },
  directives: { permission },
  methods: {
    loadDataTable(params) {
      this.loading = true
      systemManage.grouplist(params).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          this.pager.currentPage = response.data.data.currPage
          this.pager.total = response.data.data.totalCount
          this.pager.pageSize = response.data.data.pageSize
          let dataList = response.data.data.list
          this.dataTable = dataList
          // 数据加载完成结束loding
          this.loading = false
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 单个删除
    delData(params) {
      systemManage.deletegrouplist(params).then(response => {
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
