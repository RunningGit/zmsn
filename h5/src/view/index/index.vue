<template>
  <div class="page-wrap-index">
    <div class="carouel" :style="{
      background: '#17B1F4',
      color: '#fff'
      }">
      <p class="txt">
        <i class="icon-ad"></i>
        公告：关于开展第五届寻找“最美南粤少年”活动的通知
      </p>
    </div>
    <div class="page-body"></div>
    <div class="page-footer">
      <div class="cont">
        <div class="btn-left">文件下载</div>
        <div class="btn-middle">
          <router-link to="/apply">我要报名 </router-link>  </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  created(){
    import(`./${this.$isDesktop ? 'desktop': 'mobile'}.less`)
  }
}
</script>
