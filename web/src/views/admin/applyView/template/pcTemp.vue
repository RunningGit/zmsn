<template>
  <div :class="$style.content_main_item">
    <div v-if="item && item.type == 'input'" :class="$style.content_mail_box">
      <div :class="$style.item_title_dot">{{item.name}}</div>
      <div :class="$style.item_detail">
        <dy-input placeholder="请输入"></dy-input>
      </div>
    </div>

    <div v-if="item && item.type == 'textarea'" :class="$style.content_mail_box">
      <div :class="$style.item_title_dot">{{item.name}}</div>
      <div :class="$style.item_detail">
        <dy-input placeholder="请输入" type="textarea"></dy-input>
      </div>
    </div>

    <div v-if="item && item.type == 'select'" :class="$style.content_mail_box">
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

    <div v-if="item && item.type == 'city'" :class="$style.content_mail_box">
      <div :class="$style.item_title_dot">{{item.name}}</div>
      <div :class="$style.item_detail">
        <dy-select placeholder="请选择" style="flex:1;">
          <dy-select-option
            style="width: 100%;"
            v-for="option in likeList"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          ></dy-select-option>
        </dy-select>
        <dy-select placeholder="请选择" style="flex:1;">
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

    <div v-if="item && item.type == 'file'" :class="$style.content_mail_box">
      <div :class="$style.item_title_dot">{{item.name}}</div>
      <div :class="$style.item_detail_column">
        <div :class="$style.add_file">+选择荣誉</div>
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
.content_mail_box {
  display: flex;
  align-items: flex-start;
}
.content_main_item {
  padding-bottom: 8px;
  width: 50%;
  .item_detail {
    display: flex;
    width: 320px;
    color: #333;
    // justify-content: space-between;
  }
  .item_detail_column {
    display: flex;
    flex-direction: column;
    width: 320px;
    color: #333;
    // justify-content: space-between;
  }
  .item_title_dot {
    width: 120px;
    text-align: right;
    padding-right: 20px;
    position: relative;
    font-weight: bold;
    color: #333;
    font-size: 16px;
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
