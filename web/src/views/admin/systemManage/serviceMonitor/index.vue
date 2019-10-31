<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <iframe :src="iframeUrl"
        width="100%"
        height="100%"
        frameborder="0"></iframe>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      iframeUrl:
        window.location.protocol + '//' + window.location.host + '/admin'
    }
  }
}
</script>
