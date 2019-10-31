<template>
  <div class="top-info">
    <div class="p p1">
      <div class="label">申报编号</div>
      <div class="des">3232323</div>
    </div>
    <div class="p p2">
      <div class="label">当前进度</div>
      <div class="des hight">团委推荐</div>
    </div>
    <div class="p p3">
      <div class="label">下一步处理</div>
      <div class="des">省团委推荐</div>
    </div>
    <div class="p p4">
      <div class="label">活动说明</div>
      <div class="des">2fhakfhsdfhalhfl ashfl lshf ajslfj alhf kahf hnadh hf as  颠覆活动</div>
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
