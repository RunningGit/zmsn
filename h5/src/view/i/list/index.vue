<template>
  <div class="page-wrap-i-list">
    <div class="list-cont">
      <div class="list-item">
        <label for>头像</label>
        <p class="more">
          <img src="../../../assets/avator.png" alt class="avator" />
          <i class="icon-more"></i>
        </p>
      </div>
      <router-link to="/i/info" class="list-item">
        <label for>基本信息</label>
        <p class="more">
          <i class="icon-more"></i>
        </p>
      </router-link>
      <div class="list-item">
        <label for>登录账号</label>
        <p class="more">234234</p>
      </div>
      <div class="list-item">
        <label for>密码管理</label>
        <p class="more">
          <i class="icon-more"></i>
        </p>
      </div>
    </div>

    <div class="btn">退出登录</div>
  </div>
</template>

<script>
export default {
  created(){
    import(`./${this.$isDesktop ? 'desktop': 'mobile'}.less`)
  },
}
</script>

