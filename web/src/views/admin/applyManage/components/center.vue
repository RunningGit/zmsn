<template>
  <div :class="$style.centerBox">
    <div :class="$style.left_box">
      <div
        v-for="(nav, index) in navList"
        :key="nav"
        :class="[$style.nav, navIndex == index ? $style.active : '']"
        @click="navIndex = index"
      >{{nav}}</div>
    </div>
    <div
      :class="$style.right_box"
      v-for="(item, index) in navList"
      :key="item"
      v-if="navIndex == index"
    >
      <slot :name="'slot_' + index"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {
    navList: {
      type: Array
    }
  },
  vuex: {},
  data() {
    return {
      navIndex: 0
    }
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
.centerBox {
  height: 100%;
  display: flex;
  .left_box {
    width: 120px;
    border-right: 1px solid #eee;
    margin-top: 50px;
    text-align: right;
    .nav {
      padding: 10px 10px;
      cursor: pointer;
    }
    .active {
      color: #2c5081;
      border-right: 3px solid #2c5081;
    }
  }

  .right_box {
    flex: 1;
    // padding: 4px;
    overflow: scroll;
    // border: 1px solid red;
  }
}
</style>
