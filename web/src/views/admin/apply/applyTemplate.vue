<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <div class="dsf_system_title dsf_system_border title">{{ config.name }}</div>
      <div class="dsf_system_title dsf_system_border">
        <div class="input_box">
          <div class="input_box_left">
            活动名称
            <span class="red_dot">*</span>
          </div>
          <dy-input style="width: 60%" placeholder="请输入内容" v-model="activity.processName" />
        </div>
        <div class="input_box">
          <div class="input_box_left">
            活动说明
            <span class="red_dot">*</span>
          </div>
          <dy-input style="width: 80%" placeholder="请输入内容" type="textarea" v-model="activity.processDetail" />
        </div>
        <div class="activity_title">活动流程设置</div>
      </div>

      <div class="dsf_content_section">
        <div class="dsf_content_item">
          <div class="dsf_content_itemL" :class="$style.left_tab_container">
            <div :class="[$style.left_tab_box, applyIndex === 0 ? $style.active : '']">提交申报</div>
            <div
              :class="[$style.left_tab_box, applyIndex === 1 ? $style.active : '']"
              @click="applyIndex = 1"
            >学校推荐</div>
            <div
              :class="[$style.left_tab_box, applyIndex === 2 ? $style.active : '']"
              @click="applyIndex = 2"
            >团区（县）委推荐</div>
            <div
              :class="[$style.left_tab_box, applyIndex === 3 ? $style.active : '']"
              @click="applyIndex = 3"
            >团市委推荐</div>
            <div
              :class="[$style.left_tab_box, applyIndex === 4 ? $style.active : '']"
              @click="applyIndex = 4"
            >团省委推荐</div>
            <div :class="[$style.left_tab_box, applyIndex === 5 ? $style.active : '']">流程结束</div>
          </div>
          <div class="dsf_content_itemR">
            <!-- <div v-show="applyIndex === 0"></div> -->
            <apply-first-step v-show="applyIndex === 1" :node="activity.nodeList && activity.nodeList[0] || {}"></apply-first-step>
            <apply-second-step v-show="applyIndex === 2" :node="activity.nodeList && activity.nodeList[1] || {}"></apply-second-step>
            <apply-third-step v-show="applyIndex === 3" :node="activity.nodeList && activity.nodeList[2] || {}"></apply-third-step>
            <apply-fourth-step v-show="applyIndex === 4" :node="activity.nodeList && activity.nodeList[3] || {}"></apply-fourth-step>
            <div v-show="applyIndex === 5">结束</div>
          </div>
        </div>
      </div>
      <div class="btn_save">
        <dy-button type="primary" size="large">保存编辑内容</dy-button>
      </div>
    </div>
  </div>
</template>
<script>
import * as applyTemplateConfig from './applyConfig'
import ApplyFirstStep from './applyFirstStep'
import ApplySecondStep from './applySecondStep'
import ApplyThirdStep from './applyThirdStep'
import ApplyFourthStep from './applyFourthStep'
import ApplyApi from './applyApi'
export default {
  name: '',
  components: {
    ApplyFirstStep,
    ApplySecondStep,
    ApplyThirdStep,
    ApplyFourthStep
  },
  props: {},
  vuex: {},
  data() {
    return {
      config: {},
      applyIndex: 1,
      gender: 0,
      activity: {}
    }
  },
  computed: {},
  watch: {},
  methods: {},
  beforeCreate() {},
  created() {
    this.config = applyTemplateConfig[this.$route.query.type]
  },
  beforeMount() {
    ApplyApi.viewActivityProcess({
      processId: this.$route.query.id || 0
    }).then(res => {
      console.error('res', res)
      this.activity = res
    })
  },
  mounted() {}
}
</script>
<style lang="less">
.title {
  font-size: 20px;
  color: #333333 !important;
}
.input_box {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  .input_box_left {
    width: 150px;
    text-align: right;
    padding: 0 20px;
  }
  .red_dot {
    color: #ff0000;
  }
}
.activity_title {
  font-size: 18px;
  color: rgba(51, 51, 51, 1);
  line-height: 49px;
}
.btn_save {
  padding-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
<style lang="less" module>
@import url("./applyStep.less");
</style>
