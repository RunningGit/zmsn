<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <div class="dsf_system_title">
        <h1>新增管理组</h1>
      </div>
      <div class="dsf_system_btn">
        <dy-button type="primary"
          @click="confirmSubmit(form, 1)">保存并继续新增</dy-button>
        <dy-button @click="confirmSubmit(form, 2)">保存</dy-button>
        <dy-button @click="returnlink">取消</dy-button>
      </div>
      <div class="dsf_system_section dsf_group_section">
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="dsf_require">*</span>管理组名称：</label>
          <div class="dsf_label_input">
            <dy-input maxlength="32"
              width="204"
              placeholder="请填写管理组名称"
              v-model="form.groupName">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">备注：</label>
          <div class="dsf_label_input dsf_label_top">
            <dy-input type="textarea"
              maxlength="128"
              rows="7"
              placeholder="请输入备注"
              v-model="form.groupRemark"
              class="dsf_label_textarea unClearable">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">角色：</label>
          <div class="dsf_label_input dsf_label_top">
            <el-row :gutter="10">
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
        <dy-button type="primary"
          @click="confirmSubmit(form, 1)">保存并继续新增</dy-button>
        <dy-button @click="confirmSubmit(form, 2)">保存</dy-button>
        <dy-button @click="returnlink">取消</dy-button>
      </div>
    </div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入API
import rolePermissionList from '../common/rolePermissionList/rolePermissionList'
import { treeDataTranslate } from '@/utils/index'

export default {
  components: {
    rolePermissionList
  },
  data() {
    return {
      isShowIndex: -1,
      form: {
        groupName: '', // 管理组名称
        groupRemark: '',
        netWork: '1'
      },
      pager: {
        pageSize: 10,
        currentPage: 1
      },
      roleList: [], // 选择角色的列表
      roleListSelect: [], // 选择了哪些角色
      permissionList: [] // 权限列表
    }
  },
  created() {
    this.getroleList()
    this.getPermissionList()
  },
  methods: {
    returnlink() {
      this.$router.push({
        name: 'systemGroupList'
      }) // 返回到管理组列表
    },
    // 提交新增管理组
    confirmSubmit(form, type) {
      let data = form
      for (let i = 0; i < this.roleList.length; i++) {
        if (this.roleList[i].checkout) {
          this.roleListSelect.push(this.roleList[i].id)
        }
      }
      let input = /^[\s]*$/
      if (input.test(form.groupName)) {
        this.$ego.alertMsg('请输入管理组名称', 'warning', 1000)
        return false
      } else {
        let reg = /^([a-zA-Z ]+|[\u4e00-\u9fa5]+)$/
        if (!reg.test(form.groupName)) {
          this.$ego.alertMsg(
            '管理组名称只能为中文或英文，请重新输入',
            'warning',
            1000
          )
          return false
        }
      }
      let params = {
        groupName: this.form.groupName,
        groupRemark: this.form.groupRemark, // 备注
        roleIds: this.roleListSelect
      }
      systemManage.saveGroup(params).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          this.$ego.alertMsg(response.data.msg, 'success', 1000)
          if (type === 1) {
            this.form.groupRemark = ''
            this.form.groupName = ''
            this.getroleList()
            this.getPermissionList()
          } else {
            this.returnlink() // 保存按钮跳转到列表查看
          }
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 请求角色列表
    getroleList() {
      let params = {
        page: this.pager.currentPage,
        limit: 9999
      }
      systemManage.rolelist(params).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          let data = response.data.data
          // 请求到角色列表后赋值
          for (let i = 0; i < data.list.length; i++) {
            data.list[i].checkout = false
          }
          this.roleList = data.list
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 请求权限列表
    getPermissionList() {
      systemManage.getPermissionList().then(response => {
        if (response.status === 200 && response.data.code === 0) {
          let data = response.data.data
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
    },
    showData(index) {
      this.isShowIndex = index
    },
    hideData(index) {
      this.isShowIndex = -1
    }
  }
}
</script>
