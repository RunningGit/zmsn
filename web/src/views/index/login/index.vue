<template>
  <div class="dsf_login">
    <!-- 登录界面 -->
    <div class="dsf_login_item">
      <h3 class="dsf_login_title"></h3>
      <div class="dsf_label_item">
        <dy-input v-model="userName"
          maxlength="16"
          autocomplete="off"
          placeholder="账号"></dy-input>
      </div>
      <div class="dsf_label_item">
        <dy-input ref="pwdRef"
          v-model="passwd"
          autocomplete="off"
          placeholder="密码"
          type="text"
          name="password"
          onfocus="this.type='password'"></dy-input>
      </div>
      <div class="dsf_label_item clearfix">
        <dy-input v-model="captcha"
          class="fl"
          style="width:200px;"
          placeholder="验证码"
          @keyup.enter="submit()"></dy-input>
        <div class="dsf_login_codePic fr">
          <img :src="captchaPath"
            @click="getCaptcha()" />
        </div>
      </div>
      <div class="dsf_label_item">
        <dy-button type="primary"
          class="dsf_login_btn"
          :disabled="disabled"
          @click="submit()">登录</dy-button>
      </div>
    </div>
    <!-- 底部版权 -->
    <footer>
      <p>广东道一信息技术股份有限公司版权所有</p>
    </footer>
  </div>
</template>

<script type="text/ecmascript-6">
import md5 from 'js-md5'
import { authApi } from '@/api/api' // 引入API
import { getUUID } from '@/utils'
import './login.less'

export default {
  data() {
    // 变量定义
    return {
      userName: 'admin', // 账户名
      passwd: 'do1@123qwe', // 密码
      uuid: '',
      captcha: '', // 验证码
      captchaPath: '', // 图形验证码图片地址
      disabled: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.getCaptcha()
    },
    // 获取图形验证码
    getCaptcha() {
      this.uuid = getUUID()
      let params = this.uuid
      this.captchaPath = authApi.getloginPic(params)
    },
    submit() {
      if (this.userName === '') {
        this.$ego.alertMsg('请填写账户名', 'warning', 1000)
        return false
      }
      if (this.passwd === '') {
        this.$ego.alertMsg('请填写密码', 'warning', 1000)
        return false
      }
      if (this.captcha === '') {
        this.$ego.alertMsg('请填写验证码', 'warning', 1000)
        return false
      }
      // 禁止多次点击
      this.disabled = true
      let params = {
        userName: this.userName,
        password: md5(this.passwd),
        uuid: this.uuid,
        captcha: this.captcha
      }
      authApi
        .login(params, {
          token: false
        })
        .then(response => {
          // 登录成功 存储用户数据
          this.disabled = false
          if (response.data.code === 0) {
            this.$refs.pwdRef.type = 'text'
            this.$ego.alertMsg('登录成功！', 'success', 1000)
            let data = response.data.data
            // 存储用户token、用户名、ID
            localStorage.setItem('tokendata', data.token)
            localStorage.setItem('username', params.userName)
            localStorage.setItem('userId', data.userId)
            sessionStorage.setItem('navselected', 1) // 默认给定选择第一个index
            // 默认跳到后台 欢迎页
            this.$router.push({
              name: 'index'
            })
          } else {
            // 登录失败 清空数据
            this.getCaptcha()
            this.captcha = ''
            this.$ego.alertMsg(response.data.msg, 'danger', 1000)
          }
        })
    }
  }
}
</script>
