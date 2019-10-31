<template>
  <div class="page-wrap">
    <div class="section-1">
      
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
