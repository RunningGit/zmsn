<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <div class="dsf_system_title">
        <h1 v-if="detailTrue"
          key="groupDetail">管理组详情</h1>
        <h1 v-else
          key="groupEdit">编辑管理组</h1>
      </div>
      <div class="dsf_system_btn">
        <div v-if="detailTrue">
          <dy-button @click="back">
            <i class="iconfont icon-angle-double-left"></i>返回</dy-button>
          <dy-button @click="gotocompile()"
            v-permission="'dsf:usergroupStatic:update'"
            v-if="detailTrue">编辑</dy-button>
        </div>
        <div v-if="!detailTrue">
          <dy-button type="primary"
            @click="updateGroupDetail()">保存</dy-button>
          <dy-button @click="gotodetail()">取消</dy-button>
        </div>
      </div>
      <div class="dsf_system_section dsf_group_section">
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span v-show="!detailTrue"
              class="dsf_require">*</span>管理组名称：</label>
          <div class="dsf_label_input">
            <label v-if="detailTrue">{{groupName}}</label>
            <div v-else>
              <dy-input placeholder="请填写管理组名称"
                width="204"
                maxlength="32"
                v-model="groupName">
              </dy-input>
            </div>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">备注：</label>
          <div class="dsf_label_input dsf_label_top">
            <label v-if="detailTrue">{{groupRemark}}</label>
            <template v-else>
              <dy-input type="textarea"
                rows="7"
                maxlength="128"
                placeholder="请输入备注"
                v-model="groupRemark"
                class="dsf_label_textarea unClearable">
              </dy-input>
            </template>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">角色：</label>
          <div class="dsf_label_input dsf_label_top">
            <div v-if="roleEntity.length !== 0 && detailTrue">
              <el-popover v-for="(item, index) in roleEntity"
                :key="index"
                placement="bottom"
                width="250"
                class="marginR10 marginB10"
                style="display:inline-block;color:#409eff"
                trigger="hover">
                <span slot="reference">{{item.roleName}}</span>
                <rolePermissionList :style="{height: '350px',overflowY: 'auto'}"
                  :permissionList="permissionList"
                  :menuIdList="item.menuIdList"></rolePermissionList>
              </el-popover>
            </div>
            <el-row :gutter="10"
              v-if="!detailTrue">
              <el-col :span="5"
                v-for="(item, index) in roleList"
                :key="index"
                class="dsf_rolelist">
                <div class="dsf_roleName_item">
                  <el-checkbox :label="item.id"
                    v-model="item.checkout"
                    class="dsf_roleName_txt nowrap">
                    <span @mouseenter="showData(index)"
                      @mouseleave="hideData(index)"
                      :title="item.roleName?item.roleName:''">
                      {{item.roleName}}
                    </span>
                  </el-checkbox>
                  <!-- 角色权限框 -->
                  <transition enter-active-class="show-enter-active"
                    leave-active-class="show-leave-active">
                    <div class="dsf_rolelist_item"
                      @mouseenter="showData(index)"
                      @mouseleave="hideData(index)"
                      v-show="isShowIndex === index">
                      <div class="dsf_rolelist_pop">
                        <rolePermissionList :permissionList="permissionList"
                          :menuIdList="item.menuIdList"></rolePermissionList>
                      </div>
                    </div>
                  </transition>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="dsf_system_btn">
        <div v-if="detailTrue"
          key="group-detail">
          <dy-button @click="back">
            <i class="iconfont icon-angle-double-left"></i>返回</dy-button>
          <dy-button @click="gotocompile()"
            v-permission="'dsf:usergroupStatic:update'">编辑</dy-button>
        </div>
        <div v-else
          key="group-edit">
          <dy-button type="primary"
            @click="updateGroupDetail()">保存</dy-button>
          <dy-button @click="gotodetail()">取消</dy-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入API
import rolePermissionList from '../common/rolePermissionList/rolePermissionList'
import { treeDataTranslate } from '@/utils/index'
import permission from '@/directives/permission'

export default {
  components: {
    rolePermissionList
  },
  data() {
    return {
      isShowIndex: -1,
      groupName: '', // 角色名称
      groupRemark: '', // 备注
      roleEntity: {}, // 角色信息
      pager: {
        pageSize: 10,
        currentPage: 1
      },
      dataID: '',
      detailTrue: true,
      roleList: [], // 选择角色的列表
      roleListSelect: [], // 选择了哪些角色
      permissionList: [] // 权限列表
    }
  },
  directives: { permission },
  watch: {
    $route(to, from) {
      if (to.name === from.name && to.name === 'systemGroupDetail') {
        this.init()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    showData(index) {
      this.isShowIndex = index
    },
    hideData(index) {
      this.isShowIndex = -1
    },
    init() {
      this.dataID = this.$route.query.id // 角色ID
      let pageType = this.$route.query.type
      // 判断该页面是处于查看详情还是编辑状态--自定义:detail:详情页  compile:编辑状态页面
      this.detailTrue = pageType === 'detail'
      this.groupDetail()
      this.getroleList()
      this.getPermissionList()
    },
    back() {
      this.$router.push({
        name: 'systemGroupList'
      })
    },
    gotocompile() {
      this.$router.push({
        name: 'systemGroupDetail',
        query: { id: this.dataID, type: 'compile' }
      })
    },
    gotodetail() {
      this.$router.push({
        name: 'systemGroupList'
      })
    },
    groupDetail: function() {
      systemManage.groupDetail(this.dataID).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          var data = response.data.data
          this.groupName = data.groupName
          this.groupRemark = data.groupRemark
          this.roleEntity = data.roleEntity
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 请求角色列表
    getroleList() {
      var params = {
        page: this.pager.currentPage,
        limit: 999
      }
      systemManage.rolelist(params).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          var data = response.data.data
          // 请求到角色列表后赋值
          for (let i = 0; i < data.list.length; i++) {
            data.list[i].checkout = false
            for (let j = 0; j < this.roleEntity.length; j++) {
              if (data.list[i].id === this.roleEntity[j].id) {
                data.list[i].checkout = true
              }
            }
          }
          this.roleList = data.list
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 保存编辑状态上做的修改
    updateGroupDetail() {
      this.roleListSelect = []
      for (let i = 0; i < this.roleList.length; i++) {
        if (this.roleList[i].checkout) {
          this.roleListSelect.push(this.roleList[i].id)
        }
      }
      var params = {
        groupId: this.dataID,
        groupName: this.groupName,
        groupRemark: this.groupRemark,
        roleIds: this.roleListSelect,
        userIds: []
      }
      if (!this.groupName) {
        this.$ego.alertMsg('请输入管理组名称', 'warning', 1000)
        return false
      } else {
        let reg = /^([a-zA-Z ]+|[\u4e00-\u9fa5]+)$/
        if (!reg.test(this.groupName)) {
          this.$ego.alertMsg(
            '管理组名称只能为中文或英文，请重新输入',
            'warning',
            1000
          )
          return false
        }
      }
      systemManage.updateGroupDetail(params).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          var data = response.data.data
          this.$ego.alertMsg(response.data.msg, 'success', 1000)
          this.$router.push({
            name: 'systemGroupList'
          })
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 请求权限列表
    getPermissionList() {
      systemManage.getPermissionList().then(response => {
        if (response.status === 200 && response.data.code === 0) {
          var data = response.data.data
          this.permissionList = treeDataTranslate(data, 'menuId')
          this.TraversalObject(this.permissionList)
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    TraversalObject(obj) {
      for (var value of obj) {
        if (value.children) {
          this.TraversalObject(value.children)
        }
        value.disabled = true
      }
    }
  }
}
</script>
