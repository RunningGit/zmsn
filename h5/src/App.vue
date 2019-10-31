<template>
  <div id="app" :isDesktop="$isDesktop">
    <es-header v-show="$isDesktop" :curNav="$route.meta.curNav"/>
    <router-view ></router-view>
    <es-footer v-show="$route.meta.curNav && !$isDesktop" :curNav="$route.meta.curNav"/>
  </div>
</template>

<script>
import Footer from './component/footer';
import Header from './component/header/index';
import Vue from 'vue'

export default {
  components: {
    "es-footer": Footer,
    "es-header": Header
  },
}
</script>

<style lang="less">
  
</style>