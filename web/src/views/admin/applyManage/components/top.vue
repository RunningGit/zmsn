<template>
  <div :class="$style.topBox">
    <span v-show="title" style="padding-right: 20px;">{{title}}</span>
    <dy-select v-model="selectValue">
      <dy-select-option v-for="item in list" :key="item" :label="item" :value="item"></dy-select-option>
    </dy-select>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {
    title: {
      type: String,
      default() {}
    },
    list: {
      type: Array,
      default() {}
    },
    value: {
      type: String
    }
  },
  vuex: {},
  data() {
    return {
      selectValue: this.value
    }
  },
  computed: {},
  watch: {
    selectValue(val) {
      this.$emit('input', val)
    }
  },
  methods: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {}
}
</script>
<style lang="less" module>
.topBox {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
</style>
