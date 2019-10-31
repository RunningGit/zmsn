<template>
  <div class="apply-list-index">
    <div class="item">
      <div class="details">
        <div class="info">
          <div class="title">2019年广东省优秀共青团员</div>
          <div class="sub-title">报名截止时间：2019-12-01 20:22:22</div>
        </div>
        <div class="btn">
          <router-link to='/apply/form'>申报</router-link>
        </div>
      </div>
      <div class="pic">
        <img src="../../../assets/list-1.png" alt="" class="" width="100%" height="100%">
      </div>
    </div>
    <div class="item">
      <div class="details">
        <div class="info">
          <div class="title">2019年广东省优秀共青团员</div>
          <div class="sub-title">报名截止时间：2019-12-01 20:22:22</div>
        </div>
        <div class="btn">申报</div>
      </div>
      <div class="pic">
        <img src="../../../assets/list-2.png" alt="" class="" width="100%" height="100%">
      </div>
    </div>
    <div class="item">
      <div class="details">
        <div class="info">
          <div class="title">2019年广东省优秀共青团员</div>
          <div class="sub-title">报名截止时间：2019-12-01 20:22:22</div>
        </div>
        <div class="btn">申报</div>
      </div>
      <div class="pic">
        <img src="../../../assets/list-3.png" alt="" class="" width="100%" height="100%">
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      listInfo: []
    }
  },
  created(){
    import(`./${this.$isDesktop ? 'desktop': 'mobile'}.less`)
  },
}
</script>
