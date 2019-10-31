<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <div class="dsf_system_title">
        <router-link
          :to="{ name: 'applyTemplate' ,query: { id: '123123', type: 'southJuvenile' }}"
        >南粤少年</router-link>
        <router-link
          :to="{ name: 'applyTemplate' ,query: { id: '123123', type: 'leagueMember' }}"
        >共青团员</router-link>
        <router-link
          :to="{ name: 'applyTemplate' ,query: { id: '123123', type: 'youngPioneer' }}"
        >少年队员</router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  componets: {},
  props: {},
  vuex: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {}
}
</script>
<style lang="less">
</style>
