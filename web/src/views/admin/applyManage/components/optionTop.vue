<template>
  <div :class="$style.optionBox">
    <div :class="$style.title">
      <div>{{leftTitleText}} > {{rightTitleText}}</div>
      <div>
        {{leftTipsText}}:
        <span style="color: red;">{{rightTipsText}}</span>
      </div>
    </div>
    <div :class="$style.main_box">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {
    leftTitleText: {
      type: String
    },
    rightTitleText: {
      type: String
    },
    leftTipsText: {
      type: String
    },
    rightTipsText: {
      type: String
    }
  },
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
<style lang="less" module>
.optionBox {
  //   border-bottom: 1px solid #eee;
  .title {
    height: 50px;
    display: flex;
    align-items: center;
    font-size: 20px;
    padding: 0 20px 10px;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
  }
  .main_box {
    padding: 10px;
  }
}
</style>
