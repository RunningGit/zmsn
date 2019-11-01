<template>
  <dy-modal title="自定义按钮文案" v-model="visible">
    <div :class="$style.content_box">
      <div :class="$style.content_title">该功能可定制当前节点在前端的功能操作按钮文案，使处理人更好的理解业务场景</div>
      <div :class="$style.form_box_title">
        <div :class="$style.form_box_left_title">操作</div>
        <div :class="$style.form_box_right_title">文案</div>
      </div>
      <div :class="$style.form_box">
        <div :class="$style.form_box_left">审批</div>
        <div :class="$style.form_box_right">
          <dy-input placeholder="推荐" style="width: 100%;" v-model="node.option1"></dy-input>&nbsp;&nbsp;
          <div>2/6</div>
        </div>
      </div>

      <div :class="$style.form_box">
        <div :class="$style.form_box_left">审批为本级荣誉</div>
        <div :class="$style.form_box_right">
          <dy-input placeholder="推荐本级荣誉" style="width: 100%;" v-model="node.option2"></dy-input>&nbsp;&nbsp;
          <div>2/6</div>
        </div>
      </div>

      <div :class="$style.form_box">
        <div :class="$style.form_box_left">退审</div>
        <div :class="$style.form_box_right">
          <dy-input placeholder="退回" style="width: 100%;" v-model="node.option3"></dy-input>&nbsp;&nbsp;
          <div>2/6</div>
        </div>
      </div>

      <div :class="$style.form_box">
        <div :class="$style.form_box_left">审批撤回</div>
        <div :class="$style.form_box_right">
          <dy-input placeholder="请输入内容" style="width: 100%;" v-model="node.option4"></dy-input>&nbsp;&nbsp;
          <div>2/6</div>
        </div>
      </div>

      <div :class="$style.form_box">
        <div :class="$style.form_box_left">退审后再次提交审批</div>
        <div :class="$style.form_box_right">
          <dy-input placeholder="请输入内容" style="width: 100%;" v-model="node.option5"></dy-input>&nbsp;&nbsp;
          <div>2/6</div>
        </div>
      </div>

      <div :class="$style.form_box">
        <div :class="$style.form_box_left">退审后推荐本级荣誉</div>
        <div :class="$style.form_box_right">
          <dy-input placeholder="请输入内容" style="width: 100%;" v-model="node.option6"></dy-input>&nbsp;&nbsp;
          <div>2/6</div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <dy-button type="primary">确定</dy-button>
      <dy-button @click="visible = false">取消</dy-button>
    </div>
  </dy-modal>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    node: {
      type: Object
    }
  },
  vuex: {},
  data() {
    return {}
  },
  computed: {},
  watch: {
    node(val) {
      console.error('node', val)
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
.content_box {
  max-width: 550px;
  .content_title {
    color: #333333;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .form_box,
  .form_box_title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #999;
    border-top: 0;
    text-align: center;
    font-size: 18px;
    .form_box_left_title,
    .form_box_left {
      width: 40%;
      border-right: 1px solid #999;
    }
    .form_box_right_title,
    .form_box_right {
      width: 60%;
    }
    .form_box_left_title,
    .form_box_right_title {
      border-top: 1px solid #999;
      padding: 10px 0;
      background-color: #ddd;
    }
    .form_box_left {
      border-right: 1px solid #999;
      padding: 10px;
    }
    .form_box_right {
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .form_box {
    font-size: 14px;
  }
}
</style>
