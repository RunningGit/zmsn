<template>
  <div class="inputExtends dsf_label_item">
    <!-- 输入框 -->
    <div class="inputExtends-section">
      <label class="dsf_label_name">
        <span v-if="setDate.required"
          class="dsf_require">*</span>{{setDate.label}}</label>
      <div class="dsf_label_input">
        <dy-input v-model="val"
          @keyup.enter="search()"
          width='204'
          maxlength="16"
          suffix-icon="search"
          @suffix-action="search()"
          placeholder="输入关键字查找添加"></dy-input>
        <span class="label_input_choose"
          @click="showDialog = true">选择</span>
        <!-- 气泡 -->
        <transition :name="listSlideName">
          <div v-show="showTooltip"
            :class="listSlideName"
            v-loading="loading"
            v-clickoutside="handleClose"
            class="dsf_toolTip">
            <ul v-if="toolTipList.length !== 0">
              <li v-for="(item,index) in toolTipList"
                :key="index">
                <P @click="handleClick(item)"
                  class="dsf_toolTip_name">{{item.name}}</P>
                <div class="dsf_toolTip_path">
                  <p v-for="(val,index) in item.depts"
                    :key="index">{{val.departmentFullName}}</p>
                </div>
              </li>
            </ul>
            <div class="dsf_toolTip_unresult"
              v-if="toolTipList.length === 0">暂无查询结果</div>
          </div>
        </transition>
      </div>
    </div>
    <!-- 权限控制数据 -->
    <div class="dsf_label_item"
      v-show="accessList.length !== 0">
      <label class="dsf_label_name">&nbsp;</label>
      <div class="inputExtends-access">
        <ul>
          <li class="inputExtends-access-list"
            v-for="(item, index) in accessList"
            :key="index">
            <div class="inputExtends-access-name">
              {{item.name}}
              <i v-if="!(item.showClose || false)"
                class="iconfont icon-close"
                @click="del(item.id)"></i>
            </div>
            <div class="inputExtends-access-select"
              v-if="showSelect">
              <div class="inputExtends-access-line"></div>
              <dy-select style="vertical-align: middle"
                v-model="accessSelected[index]"
                width='105'>
                <dy-select-option v-for="option in selectData"
                  :key="option.id"
                  :value="option.id"
                  :label="option.label">
                </dy-select-option>
              </dy-select>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <template v-if="showDialog">
      <el-dialog :title="setDate.dialogTitle"
        :visible.sync="showDialog"
        :width="setDate.dialogW"
        custom-class="dsf_defined_dialog"
        height="544px"
        modal
        :append-to-body="true"
        lock-scroll>
        <!-- 弹窗组件 -->
        <organization :searchType="setDate.searchType"
          :multiple="setDate.multiple"
          :initList="accessList"
          :isGetMember="setDate.isGetMember"
          @saveSelectPeople="getSelectList"
          :placeholderName="setDate.placeholderName"></organization>
        <span slot="footer">
          <dy-button type="primary"
            @click="saveSelectList()">确定</dy-button>
          <dy-button type="default"
            class="marginL10"
            @click="showDialog = false">取消</dy-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import organization from '../organization/organization'
import systemManage from '../../api' // 引入API
import clickoutside from '@/directives/clickoutside' // 引入自定义事件 捕捉点击页面其它区域事件
import './inputExtends.less'

export default {
  name: 'inputExtends',
  props: {
    /**
     * 设置数据集合
     * @param {string} label 输入框的label文字
     * @param {string} dialogTitle 弹出框的标题
     * @param {string} dialogW 弹出框的总宽度，例如348px
     * @param {Boolean} multiple 弹出框选择人员&部门是否可以多选
     * @param {string} placeholderName 输入框的placeholder提示语
     * @param {Boolean} isGetMember 弹出框结构中是否需要选择人员&角色
     * @param {Number} searchType 查询类型 0 查询部门 1 查询管理员 2 查询通讯录人员 3 查询角色 4 查询通讯录部门
     * @param {Boolean} required 输入框内容是否必填
     */
    setDate: {
      type: Object
    },
    /**
     * 是否需要显示权限下拉框，默认不显示
     */
    showSelect: {
      type: Boolean,
      default: false
    },
    /**
     * 编辑时候回显数据
     */
    editData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      val: '', // input值
      showTooltip: false, // 搜索框显示开关
      toolTipList: [], // 搜索列表
      showDialog: false,
      accessList: [], // 权限列表
      selectList: [], // 选择人员或者部门数据集合
      initList: [],
      accessSelected: [],
      loading: false,
      listSlideName: 'toolTip-slide-up',
      selectData: [
        {
          id: '0',
          label: '只读'
        },
        {
          id: '1',
          label: '读写'
        }
      ]
    }
  },
  components: {
    organization
  },
  created() {
    // 数据回显
    this.accessList = this.editData
  },
  directives: { clickoutside },
  methods: {
    // 点击空白处的监听
    handleClose() {
      this.showTooltip = false
      this.loading = false
    },
    // 查询部门&管理员&通讯录人员
    search() {
      // 搜索值为空时提示请输入内容
      if (this.val.trim() === '') {
        this.$ego.alertMsg('请输入关键字查找', 'warning', 1000)
        return
      }
      this.showTooltip = true
      this.loading = true
      this.toolTipList = []
      switch (this.setDate.searchType) {
        case 0:
          let params0 = {
            deptName: this.val,
            page: 1,
            limit: 999
          }
          systemManage.search(params0).then(response => {
            if (response.data.code === 0) {
              this.loading = false
              // 处理数据
              let data = response.data.data.list
              if (data.length > 0) {
                data.forEach(item => {
                  // 统一名称
                  item.name = item.deptName
                  this.toolTipList.push(item)
                })
              }
            } else {
              this.$ego.alertMsg(response.data.msg, 'danger', 1000)
            }
          })
          break
        case 1:
          let params1 = {
            name: this.val,
            page: 1,
            limit: 999
          }
          systemManage.getUserListName(params1).then(response => {
            if (response.data.code === 0) {
              this.loading = false
              // 处理数据
              let data = response.data.data.list
              if (data.length > 0) {
                data.forEach(item => {
                  // 统一名称
                  item.name = item.dsfPersonEntity.personName
                  item.id = item.userId
                  this.toolTipList.push(item)
                })
              }
            } else {
              this.$ego.alertMsg(response.data.msg, 'danger', 1000)
            }
          })
          break
        case 2:
          let params2 = {
            name: this.val,
            page: 1,
            limit: 999
          }
          systemManage.getContactsUserName(params2).then(response => {
            if (response.data.code === 0) {
              this.loading = false
              // 处理数据
              let data = response.data.data.list
              if (data.length > 0) {
                data.forEach(item => {
                  // 统一名称和id
                  item.name = item.dsfPersonEntity.personName
                  item.id = item.userId
                  this.toolTipList.push(item)
                })
              }
            } else {
              this.$ego.alertMsg(response.data.msg, 'danger', 1000)
            }
          })
          break
        case 3:
          let params3 = {
            roleName: this.val,
            page: 1,
            limit: 999
          }
          systemManage.rolelist(params3).then(response => {
            if (response.data.code === 0) {
              this.loading = false
              // 处理数据
              let data = response.data.data.list
              if (data.length > 0) {
                data.forEach(item => {
                  // 统一名称和id
                  item.name = item.roleName
                  // item.id = item.roleId #后台返回就是id
                  this.toolTipList.push(item)
                })
              }
            } else {
              this.$ego.alertMsg(response.data.msg, 'danger', 1000)
            }
          })
          break
        case 4:
          let params4 = {
            deptName: this.val,
            page: 1,
            limit: 999
          }
          systemManage.getContactsName(params4).then(response => {
            if (response.data.code === 0) {
              this.loading = false
              // 处理数据
              let data = response.data.data.list
              if (data.length > 0) {
                data.forEach(item => {
                  // 统一名称
                  item.name = item.deptName
                  this.toolTipList.push(item)
                })
              }
            } else {
              this.$ego.alertMsg(response.data.msg, 'danger', 1000)
            }
          })
          break
      }
    },
    // 气泡点击事件
    handleClick(data) {
      this.toolTipList = []
      this.showTooltip = false
      // 只可以添加一个
      if (!this.setDate.multiple) this.accessList = []
      // 保证数据唯一
      if (this.accessList.length === 0) {
        this.accessList.push(data)
        return
      }
      let flag = true
      for (let i = 0, len = this.accessList.length; i < len; i++) {
        if (this.accessList[i].id === data.id) flag = false
      }
      if (flag) this.accessList.push(data)
    },
    // 删除数据结构
    del(id) {
      let data = this.accessList
      let index = 0
      data.forEach((item, i) => {
        if (item.id === id) index = i
      })
      this.accessList.splice(index, 1)
      this.accessSelected.splice(index, 1)
    },
    // 确认按钮,将选择的数据集合传递给父组件
    saveSelectList() {
      this.accessList = []
      // 用户什么都没选择
      if (this.selectList.length === 0) {
        let info = ''
        switch (this.setDate.searchType) {
          case 0:
            info = '请选择部门'
            break
          case 1:
            info = '请选择人员'
            break
          case 2:
            info = '请选择人员'
            break
          case 3:
            info = '请选择角色'
            break
          case 4:
            info = '请选择部门'
            break
        }
        this.$ego.alertMsg(info, 'warning', 1000)
        return false
      }
      this.showDialog = false
      // 存取弹窗选择的数据
      this.accessList = [...this.selectList]
    },
    // 监听弹窗选择的人员或部门
    getSelectList(msg) {
      this.selectList = [...msg]
    }
  },
  watch: {
    // 监听选择数据
    accessList(newVal, oldVal) {
      if (newVal.length > 0 && this.showSelect) {
        this.accessSelected = []
        // 监听的时候需要判断回显的数据是否存在
        newVal.forEach((item, index) => {
          this.accessSelected.splice(index, 1, item.rwAccess || '0')
        })
      }
      this.$emit('listener', newVal)
    },
    // 监听文本框
    val(newVal, oldVal) {
      if (!newVal.trim()) {
        this.toolTipList = []
        this.showTooltip = false
      }
    },
    // 监听下拉框值的变化重新组合数据
    accessSelected(newVal, oldVal) {
      let data = this.accessList
      if (newVal.length > 0) {
        newVal.forEach((item, index) => {
          data[index]['rwAccess'] = item
        })
      }
      this.$emit('listenerAccess', data)
    }
  }
}
</script>
