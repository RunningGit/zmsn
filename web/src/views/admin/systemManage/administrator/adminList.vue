<template>
  <!-- 管理员列表开始 -->
  <div class="dsf_content_itemR">
    <div class="dsf_search_condition">
      <dy-input v-model="form.username"
        placeholder="账号/姓名"
        width="250"
        maxlength="16"
        @keyup.enter="searchListByName"></dy-input>
      <dy-button class="marginL10"
        @click="searchListByName">搜索</dy-button>
      <dy-button class="fr marginL10"
        v-permission="'dsf:user:delete'"
        @click="delAll('管理员','userId')">批量删除</dy-button>
      <dy-button class="fr"
        v-permission="'dsf:user:save'"
        @click="$router.push({name: 'adminAdd'})">新增管理员</dy-button>
    </div>
    <!-- 内部搜索框结束 -->
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
            <th width="90">姓名</th>
            <th width="104">账号</th>
            <th width="100">所属部门</th>
            <th width="70"
              class="stateOptions_box"
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
                    <li v-for="(item,index) in stateOptions"
                      @click="sattusSearch(item.status)"
                      :key="index">{{item.statusName}}</li>
                  </ul>
                </div>
              </transition>
            </th>
            <th width="62"
              v-permission="'dsf:user:update || dsf:user:list || dsf:user:disable || dsf:user:repassword || dsf:user:delete'"
              class="table_operating">操作</th>
          </tr>
          <tr class="dy_table_tips  "
            v-if="dataTable.length === 0">
            <td>暂无数据</td>
          </tr>
          <tr class="dy_table_row"
            v-for="(item,index) in dataTable"
            :key="index">
            <td v-if="dataTable.length > 0">
              <label class="dy_checkbox"
                v-if="!(item.userName === adminUsername)"
                @click="handleSelectionChange(item)">
                <span class="dy_checked_input">
                  <input type="checkbox"
                    :checked="item.checked">
                  <i class="icon iconfont "
                    :class="item.checked?'icon-check':'icon-check-square'"></i>
                </span>
              </label>
            </td>
            <td :title="item.dsfPersonEntity.personName">{{item.dsfPersonEntity.personName}}</td>
            <td :title="item.userName">{{item.userName}}</td>
            <td :title="item.deptName">{{item.deptName}}</td>
            <td>{{item.type}}</td>
            <td class="edit_now"
              v-permission="'dsf:user:update || dsf:user:list || dsf:user:disable || dsf:user:repassword || dsf:user:delete'">
              <div class="admin_operate">
                <i class="iconfont icon-operation-group"></i>
                <div class="edit_inline">
                  <router-link :to="{name: 'adminDetail',query:{id: item.userId, type: 'edit'}}"
                    v-permission="'dsf:user:update'"
                    v-if="!(item.userName === adminUsername)">编辑</router-link>
                  <router-link :to="{name: 'adminDetail',query:{id: item.userId}}"
                    v-permission="'dsf:user:list'">查看</router-link>
                  <a href="JavaScript:;"
                    v-permission="'dsf:user:disable'"
                    @click="changeStatus(item.userId,item.status)">{{ item.status !== '0'?'禁用':'启用'}}</a>
                  <a href="javascript:;"
                    v-permission="'dsf:user:repassword'"
                    @click="resetPasswd(item.userId,item.dsfPersonEntity.personName)">重置密码</a>
                  <a href="javascript:;"
                    v-permission="'dsf:user:delete'"
                    v-if="!(item.userName === adminUsername)"
                    @click="del(item.userId,item.dsfPersonEntity.personName)">删除</a>
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
          showTotal
          show-quick-jumper
          @page-change="handleSizeChange" />
      </div>
    </div>
  </div>
  <!-- 管理员列表结束 -->
</template>

<script type="text/ecmascript-6">
import systemManage from '../api' // 引入相应API
import { tableBase } from '@/utils/systemCom.js'
import clickoutside from '@/directives/clickoutside' // 引入自定义事件 捕捉点击页面其它区域事件
import permission from '@/directives/permission'

export default {
  data() {
    return {
      dataTable: [], // 列表数据
      pager: {
        // total: 0,
        // currentPage: 1,
        // pageSize: 10,
        // showTotal: true,
        // showPageSize: true,
        // showQuickJumper: true
        pageSize: 10, // 当前页默认个数
        currentPage: 1, // 当前页
        total: 0, // 列表数据总数
        sizes: [10, 20, 50] // 当前页列表数据个数
      },
      loading: true, // 加载动画
      hasCheckedAll: false, // 全选反选
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
        } // 状态框
      ],
      form: {
        username: '',
        deptId: this.$store.state.adminDeptID.id, // 部门ID
        status: '',
        page: 1,
        limit: 10,
        dpath: '1.' // 管理员列表页根节点固定dpath
      }, // 传递参数
      // 权限判断
      // 管理员账号
      adminUsername: ''
    }
  },
  mixins: [tableBase],
  directives: { clickoutside, permission },
  created() {
    // 权限验证
    this.adminUsername = localStorage.username
  },
  methods: {
    // 点击空白处的监听
    handleClose(e) {
      this.stateOptionsTrue = true
    },
    // 获取列表信息
    loadDataTable(params) {
      this.loading = true
      systemManage.getUserList(params).then(response => {
        if (response.data.code === 0) {
          this.pager.currentPage = response.data.data.currPage
          this.pager.total = response.data.data.totalCount
          this.pager.pageSize = response.data.data.pageSize
          let dataList = response.data.data.list
          if (dataList.length > 0) {
            dataList.forEach(item => {
              switch (item.status) {
                case '0':
                  item.type = '禁用'
                  break
                case '1':
                  item.type = '正常'
                  break
              }
              item.checked = false
            })
          }
          this.dataTable = dataList
          this.hasCheckedAll = false
          this.loading = false
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
    // 启用&禁用
    changeStatus(id, status) {
      let type = status !== '0' ? '禁用' : '启用'
      this.$confirm(`是否${type}该管理员?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let st = status !== '0' ? '0' : '1'
          let params = {
            userId: id,
            status: st
          }
          systemManage.updateStatus(params).then(response => {
            if (response.data.code === 0) {
              this.$ego.alertMsg(`${type}成功`, 'success', 1000)
              this.init(this.form)
            } else {
              this.$ego.alertMsg(response.data.msg, 'danger', 1000)
            }
          })
        })
        .catch(() => {})
    },
    // 重置密码
    resetPasswd(id, name) {
      let params = {
        userId: id
      }
      this.$confirm(`是否对"${name}"进行密码重置操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          systemManage.resetPasswd(params).then(response => {
            if (response.data.code === 0) {
              let data = response.data.data
              this.$confirm(`重置密码成功，新的密码是${data}`, '提示', {
                showCancelButton: false,
                confirmButtonText: '确定',
                type: 'warning'
              })
                .then()
                .catch(() => {})
            } else {
              this.$ego.alertMsg(response.data.msg, 'danger', 1000)
            }
          })
        })
        .catch(() => {})
    },
    // 删除管理员
    delData(params) {
      systemManage.delUserMenu(params).then(response => {
        if (response.data.code === 0) {
          this.$ego.alertMsg('删除成功', 'success', 1000)
          this.form.page = 1
          this.init(this.form)
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    }
  },
  computed: {
    listenAdminDeptId() {
      return this.$store.state.adminDeptID
    }
  },
  watch: {
    listenAdminDeptId(newVal, oldVal) {
      this.form.deptId = newVal.id
      this.form.dpath = newVal.deptPath
      this.form.page = 1
      this.init(this.form)
    }
  }
}
</script>
