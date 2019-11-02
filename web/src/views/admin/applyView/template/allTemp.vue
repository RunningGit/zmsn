<template>
  <div :class="$style.content_main_item">
    <div v-if="item && item.type == 'input'">
      <div :class="$style.item_title_dot">{{item.name}}</div>
      <div :class="$style.item_detail">
        <dy-input placeholder="请输入"></dy-input>
      </div>
    </div>

    <div v-if="item && item.type == 'textarea'">
      <div :class="$style.item_title_dot">{{item.name}}</div>
      <div :class="$style.item_detail">
        <dy-input placeholder="请输入" type="textarea"></dy-input>
      </div>
    </div>

    <div v-if="item && item.type == 'select'">
      <div :class="$style.item_title_dot">{{item.name}}</div>
      <div :class="$style.item_detail">
        <dy-select placeholder="请选择" style="width: 100%;">
          <dy-select-option
            style="width: 100%;"
            v-for="option in likeList"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          ></dy-select-option>
        </dy-select>
      </div>
    </div>

    <div v-if="item && item.type == 'city'">
      <div :class="$style.item_title_dot">{{item.name}}</div>
      <div :class="$style.item_detail">
        <dy-select placeholder="请选择" style="width: 46%;">
          <dy-select-option
            style="width: 100%;"
            v-for="option in likeList"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          ></dy-select-option>
        </dy-select>
        <dy-select placeholder="请选择" style="width: 46%;">
          <dy-select-option
            style="width: 100%;"
            v-for="option in likeList"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          ></dy-select-option>
        </dy-select>
      </div>
    </div>

    <div v-if="item && item.type == 'file'">
      <div :class="$style.item_title_dot">{{item.name}}</div>
      <div :class="$style.item_detail">
        <div :class="$style.add_file">+选择荣誉</div>
      </div>
      <div :class="$style.item_detail">
        <div :class="$style.item_file">
          <img src="@/views/admin/applyView/images/pic.png" alt />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {
    item: {
      type: Object
    }
  },
  vuex: {},
  data() {
    return {
      likeList: []
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
<style lang='less'>
.dy-input {
  width: 100%;
}
.dy-textarea {
  width: 100%;
}
</style>
<style lang="less" module>
.content_main_item {
  padding-bottom: 8px;
  .item_detail {
    display: flex;
    justify-content: space-between;
  }
  .item_title_dot {
    position: relative;
    font-weight: bold;
    color: #333;
    padding-bottom: 10px;
    &::after {
      content: "*";
      position: absolute;
      height: 4px;
      width: 14px;
      text-align: right;
      color: red;
    }
  }
  .add_file {
    cursor: pointer;
    font-size: 12px;
    color: #aaa;
    border: 1px solid #aaa;
    padding: 10px;
  }
  .item_file {
    width: 40px;
    height: 40px;
    margin: 10px 10px 10px 0;
    > img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
