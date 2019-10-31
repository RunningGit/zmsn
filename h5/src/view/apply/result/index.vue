<template>
  <div class="result-cont">
    <div class="icon"></div>
    <div class="title">您的申报信息提交成功！</div>
    <div class="des">
      <p class="num">
        <span class="label">申报编号</span>
        <span class="label">123454</span>
      </p>
      <p class="next">
        <span class="label">下一步处理</span>
        <span class="label">学校推荐</span>
      </p>
      <p class="btn">查看申报详情</p>
    </div>
  </div>
</template>

<script>
export default {
  created(){
    import(`./${this.$isDesktop ? 'desktop': 'mobile'}.less`)
  },
}
</script>