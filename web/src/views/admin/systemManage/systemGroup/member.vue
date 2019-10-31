<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <!-- 标题 -->
      <div class="dsf_group">
        <dy-button @click="back">
          <i class="iconfont icon-angle-double-left"></i>返回</dy-button>
        <span class="dsf_group_title">成员管理</span>
      </div>
      <!-- 搜索框 -->
      <div class="dsf_search_conditio">
        <dy-input v-model="form.condiction"
          placeholder="姓名/账号"
          width="250"
          @keyup.enter="searchListByName"></dy-input>
        <dy-button class="marginL10"
          @click="searchListByName">搜索</dy-button>
        <dy-button class="fr"
          v-permission="'dsf:usergroupStatic:deleteUser'"
          @click="delAll('成员', 'userId')">批量删除</dy-button>
        <dy-button class="fr marginR10"
          v-permission="'dsf:usergroupStatic:saveUser'"
          @click="dialogShow = true">添加成员</dy-button>
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
              <th width="74"
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
              <th>姓名</th>
              <th>帐号</th>
              <th class="stateOptions_box"
                v-clickoutside="handleClose"
                @click="stateOptionsTrue = !stateOptionsTrue">状态
                <i v-if="stateOptionsTrue"
                  class="el-icon-caret-bottom"></i>
                <i v-else
                  class="el-icon-caret-top"></i>
                <transition :name="listSlideName">
                  <div class="state_sliderbox"
                    :class="listSlideName"
                    v-show="!stateOptionsTrue">
                    <ul>
                      <li v-for="(item, index) in stateOptions"
                        @click="sattusSearch(item.status)"
                        :key="index">{{item.statusName}}</li>
                    </ul>
                  </div>
                </transition>
              </th>
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
              <td>{{item.dsfPersonEntity.personName}}</td>
              <td>{{item.userName}}</td>
              <td>{{item.statusName}}</td>
              <td class="edit_now">
                <div class="admin_operate">
                  <i class="iconfont icon-operation-group"></i>
                  <div class="edit_inline">
                    <a href="javascript:;"
                      v-permission="'dsf:usergroupStatic:deleteUser'"
                      @click="del(item.userId, item.dsfPersonEntity.personName)">删除</a>
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
      <template v-if="dialogShow">
        <el-dialog title="添加成员"
          :visible.sync="dialogShow"
          width="785px"
          height="544px"
          modal
          lock-scroll
          append-to-body
          custom-class="dsf_defined_dialog">
          <organization @saveSelectPeople="getList"
            :searchType="1"
            placeholderName="人员"
            isGetMember
            multiple
            :groupId="form.id.toString()"
            :roleType="false"></organization>
          <span slot="footer">
            <dy-button type="primary"
              class="marginR10"
              @click="saveMember()">确定</dy-button>
            <dy-button @click="dialogShow = false">取消</dy-button>
          </span>
        </el-dialog>
      </template>
    </div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入API
import organization from '../common/organization/organization'
import { tableBase } from '@/utils/systemCom.js' // 引入列表的公共方法
import clickoutside from '@/directives/clickoutside' // 引入自定义事件 捕捉点击页面其它区域事件
import permission from '@/directives/permission'

export default {
  directives: { clickoutside, permission },
  mixins: [tableBase],
  components: {
    organization
  },
  data() {
    return {
      dataTable: [],
      loading: true,
      pager: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        sizes: [10, 20, 50]
      },
      form: {
        condiction: '',
        id: this.$route.query.id,
        status: '',
        page: 1,
        limit: 10
      },
      hasCheckedAll: false, // 全选反选,
      dialogShow: false,
      selectPeopleLi: [],
      stateOptionsTrue: true,
      listSlideName: 'toolTip-slide-up',
      stateOptions: [
        {
          status: '',
          statusName: '全部'
        },
        {
          status: '0',
          statusName: '禁用'
        },
        {
          status: '1',
          statusName: '正常'
        }
      ]
    }
  },
  methods: {
    // 点击空白处的监听
    handleClose(e) {
      this.stateOptionsTrue = true
    },
    loadDataTable(params) {
      this.loading = true
      // 请求加载table 数据
      systemManage.listMember(params).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          this.pager.currentPage = response.data.data.currPage
          this.pager.total = response.data.data.totalCount
          this.pager.pageSize = response.data.data.pageSize
          let dataList = response.data.data.list
          let statusMap = {
            '0': '禁用',
            '1': '正常'
          }
          if (dataList.length > 0) {
            dataList.forEach(item => {
              item.checked = false
              item.statusName = statusMap[item.status]
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
    // 单个删除
    delData(params) {
      // 如果传递不是数组，就在这里添加相关条件
      let data = {
        groupId: this.$route.query.id,
        userIds: params
      }
      systemManage.deleteUserOfGroup(data).then(response => {
        if (response.data.code === 0) {
          this.$ego.alertMsg('删除成功', 'success', 1000)
          this.form.page = 1
          this.init(this.form)
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 获取已选人员列表
    getList(msg) {
      this.selectPeopleLi = [...msg]
    },
    // 返回
    back() {
      this.$router.push({
        name: 'systemGroupList'
      })
    },
    // 提交添加成员
    saveMember() {
      let uidList = []
      // 没有选择任何成员
      if (this.selectPeopleLi.length === 0) {
        this.$ego.alertMsg('请选择人员', 'warning', 1000)
        return false
      }
      for (let i = 0; i < this.selectPeopleLi.length; i++) {
        uidList.push(this.selectPeopleLi[i].userId)
      }
      let params = {
        groupId: this.$route.query.id,
        userIds: uidList
      }
      systemManage.saveUsers(params).then(response => {
        if (response.data.code === 0) {
          this.dialogShow = false
          this.$ego.alertMsg('添加成功', 'success', 1000)
          this.form.page = 1
          this.init(this.form)
        } else {
          this.$ego.alertMsg(response.data.msg, 'warning', 1000)
        }
      })
    }
  }
}
</script>
