<template>
  <div class="dsf_content_itemR">
    <!--添加菜单开始  -->
    <div class="dsf_system_title">
      <template v-if="$route.query.id">
        <h1 v-if="$route.query.type === '0'">编辑目录</h1>
        <h1 v-else-if="$route.query.type === '1'">编辑菜单</h1>
        <h1 v-else>编辑按钮</h1>
      </template>
      <template v-else>
        <h1 v-if="$route.query.type === '0'">新增目录</h1>
        <h1 v-else-if="$route.query.type === '1'">新增菜单</h1>
        <h1 v-else>新增按钮</h1>
      </template>
    </div>
    <div class="dsf_system_btn">
      <dy-button type="primary"
        v-if="!$route.query.id"
        @click="onSubmit(true)">保存并继续新增</dy-button>
      <dy-button v-if="!$route.query.id"
        @click="onSubmit(false)">保存</dy-button>
      <dy-button v-if="$route.query.id"
        type="primary"
        @click="onSubmit(false)">保存</dy-button>
      <dy-button @click="back">取消</dy-button>
    </div>
    <div class="dsf_system_section dsf_menu_section">
      <div class="dsf_label_item">
        <label class="dsf_label_name">类型：</label>
        <div class="dsf_label_input">
          <span v-show="$route.query.type === '0'">目录</span>
          <span v-show="$route.query.type === '1'">菜单</span>
          <span v-show="$route.query.type === '2'">按钮</span>
        </div>
      </div>
      <div class="dsf_label_item">
        <label class="dsf_label_name">
          <span class="dsf_require">*</span>名称：</label>
        <div class="dsf_label_input">
          <dy-input v-model="form.name"
            maxlength="50"
            width='204'
            placeholder="请填写名称"></dy-input>
        </div>
      </div>
      <div class="dsf_label_item">
        <label class="dsf_label_name"
          v-if="$route.query.type !== '2'">
          <span class="dsf_require">*</span>上级目录：</label>
        <label class="dsf_label_name"
          v-else>
          <span class="dsf_require">*</span>上级菜单：</label>
        <!-- 如果新增页面是新增目录，那么上级菜单固定为一级菜单 -->
        <div class="dsf_label_input"
          v-clickoutside="handleClose">
          <dy-input v-model="form.parentName"
            width='204'
            readonly
            @click.self="searchMenu()"
            :placeholder="menuPlaceholder"></dy-input>
          <!-- 气泡 -->
          <transition :name="listSlideName">
            <div v-show="showTooltip"
              v-loading="searchLoading"
              :class="listSlideName"
              class="dsf_toolTip">
              <ul v-if="menuList.length !== 0">
                <li v-for="(item,index) in menuList"
                  :key="index">
                  <P @click="handleClick(item)"
                    class="dsf_toolTip_name">{{item.name}}</P>
                </li>
              </ul>
              <div class="dsf_toolTip_unresult"
                v-if="menuList.length === 0">暂无查询结果</div>
            </div>
          </transition>
        </div>
      </div>
      <div class="dsf_label_item"
        v-show="$route.query.type === '1'">
        <label class="dsf_label_name">菜单URL：</label>
        <div class="dsf_label_input">
          <dy-input v-model="form.url"
            maxlength="200"
            width='204'
            placeholder="请输入菜单URL"></dy-input>
        </div>
      </div>
      <div class="dsf_label_item"
        v-show="$route.query.type !== '0'">
        <label class="dsf_label_name">权限标识：</label>
        <div class="dsf_label_input">
          <dy-input v-model="form.perms"
            maxlength="500"
            width='204'
            placeholder="如: user:list"></dy-input>
        </div>
      </div>
      <div class="dsf_label_item"
        v-show="$route.query.type !== '2'">
        <label class="dsf_label_name">排序号：</label>
        <div class="dsf_label_input">
          <dy-input v-model="form.orderNo"
            maxlength="5"
            width='204'
            placeholder="请输入排序号"></dy-input>
        </div>
      </div>
      <div class="dsf_label_item"
        v-show="$route.query.type === '2'">
        <label class="dsf_label_name">权限类型：</label>
        <div class="dsf_label_input">
          <dy-radio-group v-model="form.rwAccess">
            <dy-radio data="0">读数据</dy-radio>
            <dy-radio data="1">读写数据</dy-radio>
          </dy-radio-group>
        </div>
      </div>
    </div>
    <div class="dsf_system_btn">
      <dy-button type="primary"
        v-if="!$route.query.id"
        @click="onSubmit(true)">保存并继续新增</dy-button>
      <dy-button v-if="!$route.query.id"
        @click="onSubmit(false)">保存</dy-button>
      <dy-button type="primary"
        v-if="$route.query.id"
        @click="onSubmit(false)">保存</dy-button>
      <dy-button @click="back">取消</dy-button>
    </div>
  </div>
</template>

<script>
import systemManage from '../api' // 引入相应API
import clickoutside from '@/directives/clickoutside' // 引入自定义事件 捕捉点击页面其它区域事件

export default {
  data() {
    return {
      form: {
        type: this.$route.query.type,
        name: '',
        parentId: 0,
        parentName: '一级菜单',
        url: '',
        perms: '',
        orderNo: '',
        rwAccess: '0'
      },
      showTooltip: false,
      searchLoading: true,
      listSlideName: 'toolTip-slide-up',
      menuList: [],
      menuPlaceholder: ''
    }
  },
  directives: { clickoutside },
  methods: {
    // 初始化
    init() {
      let id = this.$route.query.id
      this.menuPlaceholder =
        this.$route.query.type === '2' ? '请选择上级菜单' : '请选择上级目录'
      if (id) {
        // 编辑
        this.getInfo(id)
      } else {
        if (this.$route.query.type === '0') {
          this.form.parentName = '一级菜单'
        } else {
          this.form.parentName = ''
        }
      }
    },
    // 点击空白处的监听
    handleClose() {
      this.showTooltip = false
    },
    // 查询上级菜单
    searchMenu() {
      this.showTooltip = !this.showTooltip
      systemManage.getMenuNameList(this.$route.query.type).then(response => {
        if (response.data.code === 0) {
          this.searchLoading = false
          this.menuList = response.data.data
          if (this.$route.query.type === '0') {
            let menuFirst = {
              name: '一级菜单',
              menuId: 0
            }
            this.menuList.unshift(menuFirst)
          }
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 获取菜单信息
    getInfo(params) {
      systemManage.infoMenu(params).then(response => {
        if (response.data.code === 0) {
          Object.assign(this.form, response.data.data)
          // 上级菜单如果返回为空就固定为一级菜单
          this.form.parentName = response.data.data.parentName || '一级菜单'
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 选择上级菜单
    handleClick(item) {
      this.showTooltip = false
      this.form.parentName = item.name
      this.form.parentId = item.menuId
    },
    // 保存按钮提交
    onSubmit(keep) {
      // 表格验证
      if (!this.form.name.trim()) {
        this.$ego.alertMsg('菜单名称不能为空，请重新输入', 'warning', 1000)
        return false
      } else {
        let reg = /^[a-zA-Z\u4e00-\u9fa5]+$/
        if (!reg.test(this.form.name)) {
          this.$ego.alertMsg('菜单名称只能为中文或英文，请重新输入', 'warning', 1000)
          return false
        }
      }
      if (!this.form.parentName) {
        this.$ego.alertMsg('上级菜单不能为空，请重新选择', 'warning', 1000)
        return false
      }
      if (this.form.type !== '2') {
        if (this.form.orderNo.toString().trim()) {
          let numReg = /^[0-9]+$/
          if (!numReg.test(this.form.orderNo)) {
            this.$ego.alertMsg('排序号只可以为整数，请重新输入', 'warning', 1000)
            return false
          }
          this.form.orderNo = parseInt(this.form.orderNo)
        }
      }
      if (this.$route.query.id) {
        // 编辑
        this.form.menuId = this.$route.query.id
        systemManage.updateMenu(this.form).then(response => {
          if (response.data.code === 0) {
            this.$ego.alertMsg('保存成功', 'success', 1000)
            this.$router.push({
              name: 'menuDetail'
            })
            this.changeState()
            this.$store.commit('updateMenuID', { id: '' })
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
      } else {
        // 新增
        systemManage.addMenu(this.form).then(response => {
          if (response.data.code === 0) {
            this.$ego.alertMsg('保存成功', 'success', 1000)
            if (keep) {
              for (let i in this.form) {
                this.form[i] = ''
              }
              this.form.type = this.$route.query.type
              this.form.parentId = 0
              this.form.parentName = '一级菜单'
              this.form.rwAccess = '0'
            } else {
              this.$router.push({
                name: 'menuDetail'
              })
              this.$store.commit('updateMenuID', { id: '' })
            }
            this.changeState()
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
      }
    },
    // 返回管理员列表
    back() {
      this.$router.push({
        name: 'menuDetail'
      })
    },
    // 刷新组织树
    changeState() {
      this.$store.commit('updateResetNodeTree', new Date().getTime())
    }
  },
  created() {
    this.init()
  },
  // 监听路由的变化
  watch: {
    $route(to, from) {
      for (let i in this.form) {
        this.form[i] = ''
      }
      this.form.type = this.$route.query.type
      this.form.parentId = 0
      this.menuPlaceholder =
        this.$route.query.type === '2' ? '请选择上级菜单' : '请选择上级目录'
      if (this.$route.query.type === '0') {
        this.form.parentName = '一级菜单'
      } else {
        this.form.parentName = ''
      }
      this.form.rwAccess = '0'
    }
  }
}
</script>
