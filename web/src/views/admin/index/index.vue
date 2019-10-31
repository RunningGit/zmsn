<template>
  <div class="dsf_container">
    <!-- 顶部菜单 -->
    <div class="dsf_header">
      <div class="dsf_header_logo fl">
        <img src="@/assets/images/common/logo2.png">
      </div>
      <div class="dsf_header_navbar fr">
        <el-dropdown>
          <span class="dsf_header_navbar_down">
            <i class="iconfont icon-user-o"></i>
            {{username}}
            <i class="el-icon-arrow-down"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changePwd()">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="loginout()">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 页面主体 -->
    <div class="dsf_main"
      :class="{'dsf_main_min': !menuShow}">
      <!-- 左侧菜单 -->
      <transition name="slide-fade">
        <div class="dsf_aside"
          v-show="menuShow">
          <div class="dsf_aside_operationBtn"
            @click="menuShow = false">
            <i class="iconfont icon-angle-double-left"></i>
          </div>
          <el-menu default-active="999"
            @select="selectItems">
            <router-link :to="{name: 'index'}">
              <el-menu-item index="999"
                style="padding-left: 30px;">
                <span slot="title"
                  @click="indexTabHandele()">
                  <div class="dsf_aside_home">
                    <div class="dsf_aside_home_title">首页</div>
                  </div>
                </span>
              </el-menu-item>
            </router-link>
            <!-- 菜单 -->
            <el-submenu :index="dex.toString()"
              v-for="(menuItem, dex) in leftMenu"
              :key="dex">
              <!-- 目录 -->
              <template slot="title">
                <i v-if="menuItem.list.length > 0">
                  <i class="iconfont icon-caret-down"></i>
                  <i class="iconfont icon-caret-right"></i>
                </i>
                <i v-else
                  style="padding-left:17px"></i>
                <span style="padding-left: 6px">{{menuItem.title}}</span>
              </template>
              <!-- 菜单 -->
              <template v-if="menuItem.list.length > 0">
                <div v-for="(item, idx) in menuItem.list"
                  :key="idx">
                  <!-- 菜单中没有子菜单 -->
                  <template v-if="item.list.length === 0">
                    <router-link :to="{name:item.actual || item.name, query: item.query}">
                      <el-menu-item :index="dex +'-' + idx"
                        style="padding-left: 42px;"
                        @click="setTabsMenu(item)">
                        <div class="dsf_aside_home">
                          <div class="dsf_aside_home_title"
                            :title="item.title.length > 6 ? item.title : ''">{{item.title}}</div>
                        </div>
                      </el-menu-item>
                    </router-link>
                  </template>
                  <!-- 菜单中存在子菜单 -->
                  <template v-else>
                    <el-submenu :index="dex + '-' + idx">
                      <template slot="title">
                        <i v-if="item.list.length > 0">
                          <i class="iconfont icon-caret-down"></i>
                          <i class="iconfont icon-caret-right"></i>
                        </i>
                        <i v-else
                          style="padding-left:17px;"></i>
                        <span style="padding-left: 6px;">{{item.title}}</span>
                      </template>
                      <div v-for="(valitem, valIndex) in item.list"
                        :key="valIndex">
                        <router-link :to="{name:valitem.actual || valitem.name, query: valitem.query}">
                          <el-menu-item :index="dex +'-' + idx + '-' + valIndex"
                            style="padding-left: 42px;"
                            @click="setTabsMenu(valitem)">
                            <div class="dsf_aside_home">
                              <div class="dsf_aside_home_title"
                                :title="valitem.title.length > 6 ? valitem.title : ''">{{valitem.title}}</div>
                            </div>
                          </el-menu-item>
                        </router-link>
                      </div>
                    </el-submenu>
                  </template>
                </div>
              </template>
            </el-submenu>
          </el-menu>
        </div>
      </transition>
      <transition name="slide-fade">
        <div class="dsf_aside_min"
          v-show="!menuShow"
          @click="menuShow = true">
          <i class="iconfont icon-angle-double-right"
            style="font-size:12px"></i>
        </div>
      </transition>
      <!-- 左侧菜单END -->
      <!-- 标签页 -->
      <div class="dsf_tabs"
        v-if="navselected &&!navselected.includes('-')">
        <router-view></router-view>
      </div>
      <div class="dsf_tabs"
        v-show="navselected && navselected.includes('-')">
        <!-- class="dsf_tabs" -->
        <el-tabs v-model="mainTabsActiveName"
          :closable="true"
          @tab-click="selectedTabHandle"
          @tab-remove="removeTabHandle">
          <el-tab-pane v-for="item in mainTabs"
            :key="item.name"
            :actualActive="item.actual"
            :query="item.query"
            :label="item.title"
            :name="item.name">
            <!-- 页面内容 -->
            <keep-alive>
              <router-view v-if="item.name === mainTabsActiveName">
              </router-view>
            </keep-alive>
          </el-tab-pane>
          <el-dropdown>
            <i class="el-icon-arrow-down"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="tabsCloseCurrentHandle()">关闭当前标签页</el-dropdown-item>
              <el-dropdown-item @click.native="tabsCloseOtherHandle()">关闭其它标签页</el-dropdown-item>
              <el-dropdown-item @click.native="tabsCloseAllHandle()">关闭全部标签页</el-dropdown-item>
              <!-- <el-dropdown-item @click.native="tabsRefreshCurrentHandle()">刷新当前标签页</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
        </el-tabs>
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="修改密码"
      :visible.sync="popupVisible"
      width="410px"
      custom-class="dsf_defined_dialog dsf_home_dialog"
      modal
      :append-to-body="true"
      lock-scroll>
      <div class="dsf_label_item"
        style="margin-top:20px">
        <label class="dsf_label_name">原密码：</label>
        <div class="dsf_label_input">
          <dy-input v-model="oldPassWord"
            maxlength="16"
            type="password"
            placeholder="请输入原密码">
          </dy-input>
        </div>
      </div>
      <div class="dsf_label_item">
        <label class="dsf_label_name">新密码：</label>
        <div class="dsf_label_input">
          <dy-input v-model="newPassWord"
            maxlength="16"
            type="password"
            placeholder="请输入新密码">
          </dy-input>
        </div>
      </div>
      <div class="dsf_label_item confirm-passWord"
        style="margin-bottom:20px">
        <label class="dsf_label_name">确认密码：</label>
        <div class="dsf_label_input">
          <dy-input v-model="confirmPassWord"
            maxlength="16"
            type="password"
            placeholder="请再次输入新密码">
          </dy-input>
        </div>
      </div>
      <span slot="footer">
        <dy-button type="primary"
          :disabled="forbid"
          @click="confirmModification()">确定</dy-button>
        <dy-button class="marginL10"
          @click="canclePopup()">取消</dy-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import systemManage from '../systemManage/api' // 引入相应API
import { authApi } from '@/api/api' // 引入API
import md5 from 'js-md5'
import './index.less'

export default {
  name: 'admin',
  data() {
    // 变量定义
    return {
      leftMenu: [],
      username: '',
      menuShow: true,
      navselected: '1',
      defaultProps: {},
      forbid: false, // 按钮禁止
      popupVisible: false, // 弹窗菜单
      oldPassWord: '', // 原密码
      newPassWord: '', // 新密码
      confirmPassWord: '' // 确认密码
    }
  },
  methods: {
    init() {
      // 初始化
      this.getlist()
      this.username = localStorage.getItem('username') // 获取用户昵称
    },
    selectItems(index) {
      sessionStorage.setItem('navselected', index)
      this.navselected = index
    },
    // tabs, 选中tab 切换路由
    selectedTabHandle(tab) {
      sessionStorage.setItem('mainTabsActiveName', tab.name)
      if (tab) {
        tab.isNew = false
        this.$router.push({
          name: tab.$attrs.actualActive ? tab.$attrs.actualActive : tab.name,
          query: {
            ...tab.$attrs.query
          }
        })
      }
    },
    // tabs, 删除tab
    removeTabHandle(tabName) {
      this.mainTabs.forEach((element, index) => {
        if (element.name === tabName) {
          element.name = element.origin
          // 删除当前选中
          if (this.mainTabsActiveName === tabName) {
            if (this.mainTabs.length === 1) {
              this.mainTabsActiveName = element.origin
              this.navselected = '1'
              sessionStorage.setItem('navselected', 1)
              this.$router.push({ name: 'index' })
              // sessionStorage.clear()
              sessionStorage.removeItem('mainTabs')
              sessionStorage.removeItem('mainTabsActiveName')
              this.mainTabs = []
            } else {
              this.mainTabs.splice(index, 1)
              let tab =
                index - 1 >= 0 ? this.mainTabs[index - 1] : this.mainTabs[0]
              this.mainTabsActiveName = tab.name
              this.$router.push({
                name: tab.actual || tab.name,
                query: {
                  ...tab.query
                }
              })
            }
          } else {
            this.mainTabs.splice(index, 1)
          }

          this.leftMenu.forEach(item => {
            for (let i = 0; i < item.list.length; i++) {
              if (tabName === item.list[i].name) {
                item.list[i].actual = ''
                item.list[i].query = ''
                item.list[i].name = item.list[i].origin
              }
              for (let j = 0; j < item.list[i].list.length; j++) {
                if (tabName === item.list[i].list[j].name) {
                  item.list[i].list[j].actual = ''
                  item.list[i].list[j].query = ''
                  item.list[i].list[j].name = item.list[i].list[j].origin
                }
              }
            }
          })

          this.setSession()
        }
      })
    },
    indexTabHandele() {
      this.$router.push({ name: 'index' })
    },
    // tabs, 关闭当前
    tabsCloseCurrentHandle() {
      this.removeTabHandle(this.mainTabsActiveName)
    },
    // tabs, 关闭其它
    tabsCloseOtherHandle() {
      this.mainTabs = this.mainTabs.filter(
        item => item.name === this.mainTabsActiveName
      )
      this.leftMenu.forEach(item => {
        for (let i = 0; i < item.list.length; i++) {
          if (item.list[i].name !== this.mainTabsActiveName) {
            item.list[i].name = item.list[i].origin
          }
          for (let j = 0; j < item.list[i].list.length; j++) {
            if (item.list[i].list[j].name !== this.mainTabsActiveName) {
              item.list[i].list[j].name = item.list[i].list[j].origin
            }
          }
        }
      })
      this.setSession()
    },
    // tabs, 关闭全部
    tabsCloseAllHandle() {
      this.leftMenu.forEach(item => {
        for (let i = 0; i < item.list.length; i++) {
          item.list[i].actual = ''
          item.list[i].query = ''
          item.list[i].name = item.list[i].origin
          for (let j = 0; j < item.list[i].list.length; j++) {
            item.list[i].list[j].actual = ''
            item.list[i].list[j].query = ''
            item.list[i].list[j].name = item.list[i].list[j].origin
          }
        }
      })

      this.mainTabs = []
      this.menuActiveName = ''
      sessionStorage.removeItem('mainTabs')
      sessionStorage.removeItem('mainTabsActiveName')
      this.$router.push({ name: 'index' })
      this.navselected = '1'
      sessionStorage.setItem('navselected', 1)
    },
    // tabs, 刷新当前
    tabsRefreshCurrentHandle() {
      let tempTabName = this.mainTabsActiveName
      this.removeTabHandle(tempTabName)
      this.$nextTick(() => {
        this.$router.push({ name: tempTabName })
      })
    },

    // tabs, 初始化
    tabsInit() {
      this.leftMenu.forEach(item => {
        if (item.name === this.$route.name) {
          if (this.mainTabsActiveName === '0') {
            this.mainTabsActiveName = item.name
          }
        }
      })
    },
    // tabs, 添加菜单
    setTabsMenu(item) {
      let isExisted = false
      this.mainTabs.forEach(tab => {
        if (tab.origin === item.origin) {
          isExisted = true
        }
      })
      if (!isExisted) {
        item.isNew = true
        this.mainTabs.push(item)
      } else {
        item.isNew = false
      }
      this.mainTabsActiveName = item.name
      this.setSession()
    },
    getlist() {
      // 获取顶部菜单
      systemManage.getMenuNav().then(response => {
        if (response.data.code === 0) {
          let options = response.data.data.dsfMenuEntityList
          if (options.length > 0) {
            options.forEach(item => {
              item.title = item['name']
              if (item['list'].length > 0) {
                item['list'].forEach(val => {
                  val.origin = val.url
                  val.title = val.name
                  val.name = val.url
                  this.mainTabs.forEach(tab => {
                    if (tab.origin === val.name) {
                      val.name = tab.name
                    }
                  })
                  if (val['list'].length > 0) {
                    val['list'].forEach(valList => {
                      valList.origin = valList.url
                      valList.title = valList.name
                      valList.name = valList.url
                      this.mainTabs.forEach(tab => {
                        if (tab.origin === valList.name) {
                          valList.name = tab.name
                        }
                      })
                    })
                  }
                })
              }
            })
          }
          this.leftMenu = options
          // 存储权限
          sessionStorage.setItem(
            'permissions',
            JSON.stringify(response.data.data.permissions)
          )
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
        this.tabsInit()
      })
    },
    // 修改密码弹框
    changePwd() {
      this.popupVisible = true
    },
    // 确定修改密码
    confirmModification() {
      let reg = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^_.&*?]+)$)^[\w~!@#$%^_.&*?]{6,16}$/
      if (this.oldPassWord.length === 0) {
        this.$ego.alertMsg('原密码不能为空', 'warning', 1000)
        return false
      } else if (this.newPassWord.length === 0) {
        this.$ego.alertMsg('新密码不能为空', 'warning', 1000)
        return false
      } else if (this.confirmPassWord.length === 0) {
        this.$ego.alertMsg('确认密码不能为空', 'warning', 1000)
        return false
      } else if (this.confirmPassWord !== this.newPassWord) {
        this.$ego.alertMsg('两次输入密码不一致', 'warning', 1000)
        return false
      } else if (!reg.test(this.newPassWord)) {
        this.$ego.alertMsg(
          '密码长度为6-16个字，必须同时包含字母、数字、特殊符号中的两种!',
          'warning',
          1000
        )
      } else {
        let param = {
          newPassword: md5(this.newPassWord),
          password: md5(this.oldPassWord)
        }
        this.forbid = true
        systemManage.modPasswd(param).then(response => {
          this.forbid = false
          if (response.data.code === 0) {
            this.$ego.alertMsg('修改密码成功', 'success', 1000)
            this.popupVisible = false
            this.$router.push({
              name: 'login'
            })
          } else {
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
      }
    },
    // 取消弹出层
    canclePopup() {
      this.popupVisible = false
    },
    // 用户退出
    loginout() {
      // 清除redis缓存中的记录的token
      authApi.logout().then(response => {
        // 清除数据
        this.$store.commit('clearUser')
        this.mainTabs = []
        this.menuActiveName = ''
        sessionStorage.clear()
      })
      this.$ego.alertMsg('退出成功！', 'success', 1000)
      this.$router.push({ name: 'login' })
    },
    /**
     * 设置 sessionStorage
     */
    setSession() {
      this.$nextTick(() => {
        sessionStorage.setItem('mainTabs', JSON.stringify(this.mainTabs))
        sessionStorage.setItem('mainTabsActiveName', this.mainTabsActiveName)
      })
    }
  },
  computed: {
    menuActiveName: {
      get() {
        return this.$store.state.menuActiveName
      },
      set(val) {
        this.$store.commit('updateMenuActiveName', val)
      }
    },
    mainTabs: {
      get() {
        return this.$store.state.mainTabs
      },
      set(val) {
        this.$store.commit('updateMainTabs', val)
      }
    },
    mainTabsActiveName: {
      get() {
        return this.$store.state.mainTabsActiveName
      },
      set(val) {
        this.$store.commit('updateMainTabsActiveName', val)
      }
    }
  },
  created() {
    this.init() // 执行初始化
    this.navselected = sessionStorage.getItem('navselected')
  },
  watch: {
    // 监听修改密码窗口是否关闭，关闭则清空输入框中的值
    popupVisible(oldval, newval) {
      if (!newval) {
        this.oldPassWord = ''
        this.newPassWord = ''
        this.confirmPassWord = ''
      }
    },
    $route(to, from) {
      if (to.path.includes(from.path) || from.path.includes(to.path)) {
        this.mainTabs.forEach(tab => {
          if (tab.name === this.mainTabsActiveName) {
            tab.actual = to.name
            tab.query = to.query
            this.setSession()
          }
          this.leftMenu.forEach(item => {
            for (let i = 0; i < item.list.length; i++) {
              if (item.list[i].name === tab.name) {
                item.list[i].actual = tab.actual
                item.list[i].query = tab.query
              }
              for (let j = 0; j < item.list[i].list.length; j++) {
                if (item.list[i].list[j].name === tab.name) {
                  item.list[i].list[j].actual = tab.actual
                  item.list[i].list[j].query = tab.query
                }
              }
            }
          })
        })
      }
    }
  }
}
</script>
