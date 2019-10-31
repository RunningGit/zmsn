<template>
  <div class="register-warpper">
    <div class="info">
      <div>
        <div>登录账号</div>
        <div><input v-model="account" type="text" placeholder="请输入11位手机号码" autocomplete="off" /></div>
      </div>
      <div>
        <div>密码</div>
        <div><input v-model="password" type="password" placeholder="请输入密码" autocomplete="off" /></div>
      </div>
      <div>
        <div>再次确认</div>
        <div><input v-model="rePassword" type="password" placeholder="请再次输入密码" autocomplete="off" /></div>
      </div>
      <div>
        <div>图形验证码</div>
        <div class="vCode"><input v-model="vCode" type="text" placeholder="请输入图形验证码" /></div>
        <div><img class="code" src="../../assets/code.png" /></div>
      </div>
      <div>
        <div>验证码</div>
        <div class="vCode"><input v-model="messageCode" type="text" placeholder="请输入短信验证码" /></div>
        <div@click="getCodeHandle" :class="{'get-code':true, disabel:startCountdown}">{{codeMessage}}</div@click="getCodeHandle">
      </div>
    </div>
    <div class="have-account">已有账号，直接登录</div>
    <div
      :class="{'register-button':true, active:account&&password&&rePassword&&vCode&&messageCode}"
      @click="handleRegister">
      注册
    </div>
  </div>
</template>
<script>
import { setInterval, clearInterval } from 'timers';
import { MessageBox, Toast } from 'mint-ui';

const countdownTime = 10;
export default {
  data() {
    return {
      codeMessage: '获取验证码',
      time: countdownTime,
      startCountdown: false,
      account: '',
      password: '',
      rePassword: '',
      vCode: '',
      messageCode: '',
    }
  },
  created(){
    import(`./${this.$isDesktop ? 'desktop': 'mobile'}.less`)
  },
  methods: {
    getCodeHandle: function() {
      if (this.startCountdown === true) {
        return;
      }
      this.startCountdown = true;
      const countdown = this.$options.methods.countdown.bind(this);
      countdown();
    },
    countdown: function() {
      let that = this;
      var timer = setInterval(() => {
        let time = --that.time;
        that.codeMessage = `验证码(${time})`;
        that.time = time;
        if (time <= 0) {
          clearInterval(timer);
          that.codeMessage = '获取验证码';
          that.startCountdown = false;
          that.time = countdownTime;
        }
      }, 1000);
    },
    handleRegister: function() {
      if (this.password !== this.rePassword) {
        Toast({
          message: '密码不一致，请重新输入',
          position: 'bottom',
        })
        return;
      }
      MessageBox({
        title: '提示',
        message: '账号注册成功，请前往进行登录',
        confirmButtonText: '登录',
        confirmButtonClass: 'confirm-bottom'
      })
    }
  }
}
</script>
