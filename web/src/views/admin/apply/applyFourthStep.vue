<template>
  <div>
    <div :class="$style.step_title">步骤: {{ node.processNum }}</div>
    <div :class="$style.content_item">
      <div :class="$style.content_itemLD">节点名称</div>
      <div :class="$style.content_itemR">
        <dy-input placeholder="请输入内容" v-model="node.processName" />
      </div>
    </div>
    <div :class="$style.content_item">
      <div :class="$style.content_itemLD">处理人</div>
      <div :class="$style.content_itemR">
        <!-- TODO -->
        <dy-radio v-model="node.approvalUser" :data="node.approvalUser">{{ node.approvalUser }}</dy-radio>
      </div>
    </div>
    <div :class="$style.content_item">
      <div :class="$style.content_itemLD">操作</div>
      <div :class="$style.content_itemR">
        <div :class="$style.content_itemR_box">
          <el-tooltip effect="dark" :content="tooltipsContent.tips1" placement="top">
            <dy-checkbox v-model="node.option1Status">审批</dy-checkbox>
          </el-tooltip>&nbsp;&nbsp;|&nbsp;&nbsp;
          <!-- <dy-input placeholder="推荐" v-model="node.option1" :class="$style.input_options" /> -->
          {{ node.option1 }}
        </div>
        <div :class="$style.content_itemR_box">
          <el-tooltip effect="dark" :content="tooltipsContent.tips4" placement="top">
            <dy-checkbox v-model="node.option2Status">审批撤回</dy-checkbox>
          </el-tooltip>&nbsp;&nbsp;|&nbsp;&nbsp;
          <!-- <dy-input placeholder="撤回推荐" v-model="node.option2" :class="$style.input_options" /> -->
          {{ node.option2 }}
        </div>
        <div :class="$style.content_itemR_box">
          <el-tooltip effect="dark" :content="tooltipsContent.tips5" placement="top">
            <dy-checkbox v-model="node.option3Status">下个节点退审后可再次提交审批</dy-checkbox>
          </el-tooltip>&nbsp;&nbsp;|&nbsp;&nbsp;
          <!-- <dy-input placeholder="重新推荐" v-model="node.option3" :class="$style.input_options" /> -->
          {{ node.option3 }}
        </div>
        <div :class="$style.content_itemR_box">
          <el-tooltip effect="dark" :content="tooltipsContent.tips7" placement="top">
            <dy-checkbox v-model="node.options4Status">关闭流程</dy-checkbox>
          </el-tooltip>
        </div>
        <div
          :class="[$style.content_itemRInner_box, $style.btn_setting]"
          @click="visibleSetting = !visibleSetting"
        >自定义按钮方案</div>
      </div>
    </div>
    <div :class="$style.content_item">
      <div :class="$style.content_itemL">节点设置</div>
      <div :class="$style.content_itemR">
        <div :class="$style.content_itemR_box">
          <dy-checkbox v-model="node.isSuggestionOn">当前节点启用审批意见</dy-checkbox>
        </div>
        <div :class="$style.content_itemR_box">设置默认意见</div>
        <div :class="$style.content_itemR_box">
          <dy-input placeholder="同意" v-model="node.suggestion" />
        </div>
      </div>
    </div>
    <dy-modal title="自定义按钮文案" v-model="visibleSetting">
      <apply-option-setting :node="node"></apply-option-setting>
      <div slot="footer">
        <dy-button type="primary" @click="visibleSetting = false">确定</dy-button>
      </div>
    </dy-modal>
  </div>
</template>
<script>
import { tooltipsContent } from './applyConfig'
import ApplyOptionSetting from './applyOptionSetting'
export default {
  name: '',
  components: {
    ApplyOptionSetting
  },
  props: {
    node: {
      type: Object
    }
  },
  vuex: {},
  data() {
    return {
      tooltipsContent: tooltipsContent,
      visibleSetting: false
    }
  },
  computed: {},
  watch: {
    node(val) {
      console.error('this.node', val)
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
@import url("./applyStep.less");
</style>
