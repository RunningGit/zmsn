<template>
  <div class="login-warpper">
    <div class="title">请使用一号通账号登录</div>
    <div>
      <div class="account">
        <input type="text" v-model="account" placeholder="请输入账号"/>
      </div>
      <div class="password">
        <input type="password" v-model="password" placeholder="请输入密码"/>
      </div>
    </div>
    <div class="desc">
      <div class="register">没有一号通账号？点击注册</div>
      <div class="forge-pwd">忘记密码？</div>
    </div>
    <div :class="{'login-button':true, 'active':account&&password}" @click="handleLogin">登录</div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui';

export default {
  data() {
    return {
      account: '',
      password: '',
    }
  },
  created(){
    import(`./${this.$isDesktop ? 'desktop': 'mobile'}.less`)
  },
  methods: {
    handleLogin: function() {
      Toast({
        message: '账号有误',
        position: 'bottom',
      })
    },
  }
}
</script>