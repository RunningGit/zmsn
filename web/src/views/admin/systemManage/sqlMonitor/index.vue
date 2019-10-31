<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <define-dict dictType="sqlview"
        @changeSex="changeSex"
        :selectedData="sqlUrlList"></define-dict>
      <div class="marginT20">
        <iframe :src="iframeUrl"
          width="100%"
          height="650px"
          frameborder="0"></iframe>
      </div>
    </div>
  </div>
</template>
<script>
import defineDict from '../common/defineDict'
import { authApi } from '@/api/api' // 引入API
export default {
  data() {
    return {
      iframeUrl:
        window.location.protocol +
        '//' +
        window.location.host +
        '/api/sys-authorize/druid/index.html',
      sqlUrlList: ''
    }
  },
  created: function() {
    if (!authApi.isSystem()) {
      this.iframeUrl = window.location.protocol +
        '//' +
        window.location.host +
        '/api/druid'
    }
  },
  components: {
    defineDict
  },
  methods: {
    changeSex(val) {
      this.iframeUrl =
        window.location.protocol + '//' + window.location.host + '/api' + val
    }
  }
}
</script>
