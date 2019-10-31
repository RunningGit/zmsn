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
          <dy-input style="width: 60%" placeholder="请输入内容" v-model="value1" />
        </div>
        <div class="input_box">
          <div class="input_box_left">
            活动说明
            <span class="red_dot">*</span>
          </div>
          <dy-input style="width: 80%" placeholder="请输入内容" type="textarea" v-model="value1" />
        </div>
        <div class="activity_title">活动流程设置</div>
      </div>

      <div class="dsf_content_section">
        <div class="dsf_content_item">
          <div class="dsf_content_itemL" :class="$style.left_tab_container">
            <div
              :class="[$style.left_tab_box, applyIndex === 0 ? $style.active : '']"
              @click="applyIndex = 0"
            >提交申报</div>
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
            <div
              :class="[$style.left_tab_box, applyIndex === 5 ? $style.active : '']"
              @click="applyIndex = 5"
            >流程结束</div>
          </div>
          <div class="dsf_content_itemR">
            <div v-show="applyIndex === 0">
              <div :class="$style.step_title">步骤: 1</div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemLD">节点名称</div>
                <div :class="$style.content_itemR">
                  <dy-input placeholder="请输入内容" v-model="value1" />
                </div>
              </div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemLD">处理人</div>
                <div :class="$style.content_itemR">
                  <dy-radio v-model="gender" data="man">学校</dy-radio>
                </div>
              </div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemLD">操作</div>
                <div :class="$style.content_itemR">
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">审批</dy-checkbox>&nbsp;&nbsp;|&nbsp;&nbsp;
                    <dy-input placeholder="推荐" v-model="value1" :class="$style.input_options" />
                  </div>
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">审批</dy-checkbox>&nbsp;&nbsp;|&nbsp;&nbsp;
                    <dy-input placeholder="撤回推荐" v-model="value1" :class="$style.input_options" />
                  </div>
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">下个节点退审后可再次提交审批</dy-checkbox>&nbsp;&nbsp;|&nbsp;&nbsp;
                    <dy-input placeholder="重新推荐" v-model="value1" :class="$style.input_options" />
                  </div>
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">关闭流程</dy-checkbox>
                  </div>
                </div>
              </div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemL">节点设置</div>
                <div :class="$style.content_itemR">
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">当前节点启用审批意见</dy-checkbox>
                  </div>
                  <div :class="$style.content_itemR_box">设置默认意见</div>
                  <div :class="$style.content_itemR_box">
                    <dy-input placeholder="同意" />
                  </div>
                </div>
              </div>
            </div>
            <div v-show="applyIndex === 1">
              <div :class="$style.step_title">步骤: 2</div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemLD">节点名称</div>
                <div :class="$style.content_itemR">
                  <dy-input placeholder="请输入内容" v-model="value1" />
                </div>
              </div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemLD">处理人</div>
                <div :class="$style.content_itemR">
                  <dy-radio v-model="gender" data="man">学校</dy-radio>
                </div>
              </div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemLD">操作</div>
                <div :class="$style.content_itemR">
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">审批</dy-checkbox>&nbsp;&nbsp;|&nbsp;&nbsp;
                    <dy-input placeholder="推荐" v-model="value1" :class="$style.input_options" />
                  </div>
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">审批</dy-checkbox>&nbsp;&nbsp;|&nbsp;&nbsp;
                    <dy-input placeholder="撤回推荐" v-model="value1" :class="$style.input_options" />
                  </div>
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">下个节点退审后可再次提交审批</dy-checkbox>&nbsp;&nbsp;|&nbsp;&nbsp;
                    <dy-input placeholder="重新推荐" v-model="value1" :class="$style.input_options" />
                  </div>
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">关闭流程</dy-checkbox>
                  </div>
                </div>
              </div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemL">节点设置</div>
                <div :class="$style.content_itemR">
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">当前节点启用审批意见</dy-checkbox>
                  </div>
                  <div :class="$style.content_itemR_box">设置默认意见</div>
                  <div :class="$style.content_itemR_box">
                    <dy-input placeholder="同意" />
                  </div>
                </div>
              </div>
            </div>
            <div v-show="applyIndex === 2">
              <div :class="$style.step_title">步骤: 3</div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemLD">节点名称</div>
                <div :class="$style.content_itemR">
                  <dy-input placeholder="请输入内容" v-model="value1" />
                </div>
              </div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemLD">处理人</div>
                <div :class="$style.content_itemR">
                  <dy-radio v-model="gender" data="man">学校</dy-radio>
                </div>
              </div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemLD">操作</div>
                <div :class="$style.content_itemR">
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">审批</dy-checkbox>&nbsp;&nbsp;|&nbsp;&nbsp;
                    <dy-input placeholder="推荐" v-model="value1" :class="$style.input_options" />
                  </div>
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">审批</dy-checkbox>&nbsp;&nbsp;|&nbsp;&nbsp;
                    <dy-input placeholder="撤回推荐" v-model="value1" :class="$style.input_options" />
                  </div>
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">下个节点退审后可再次提交审批</dy-checkbox>&nbsp;&nbsp;|&nbsp;&nbsp;
                    <dy-input placeholder="重新推荐" v-model="value1" :class="$style.input_options" />
                  </div>
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">关闭流程</dy-checkbox>
                  </div>
                </div>
              </div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemL">节点设置</div>
                <div :class="$style.content_itemR">
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">当前节点启用审批意见</dy-checkbox>
                  </div>
                  <div :class="$style.content_itemR_box">设置默认意见</div>
                  <div :class="$style.content_itemR_box">
                    <dy-input placeholder="同意" />
                  </div>
                </div>
              </div>
            </div>
            <div v-show="applyIndex === 3">
              <div :class="$style.step_title">步骤: 4</div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemLD">节点名称</div>
                <div :class="$style.content_itemR">
                  <dy-input placeholder="请输入内容" v-model="value1" />
                </div>
              </div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemLD">处理人</div>
                <div :class="$style.content_itemR">
                  <dy-radio v-model="gender" data="man">学校</dy-radio>
                </div>
              </div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemLD">操作</div>
                <div :class="$style.content_itemR">
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">审批</dy-checkbox>&nbsp;&nbsp;|&nbsp;&nbsp;
                    <dy-input placeholder="推荐" v-model="value1" :class="$style.input_options" />
                  </div>
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">审批</dy-checkbox>&nbsp;&nbsp;|&nbsp;&nbsp;
                    <dy-input placeholder="撤回推荐" v-model="value1" :class="$style.input_options" />
                  </div>
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">下个节点退审后可再次提交审批</dy-checkbox>&nbsp;&nbsp;|&nbsp;&nbsp;
                    <dy-input placeholder="重新推荐" v-model="value1" :class="$style.input_options" />
                  </div>
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">关闭流程</dy-checkbox>
                  </div>
                </div>
              </div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemL">节点设置</div>
                <div :class="$style.content_itemR">
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">当前节点启用审批意见</dy-checkbox>
                  </div>
                  <div :class="$style.content_itemR_box">设置默认意见</div>
                  <div :class="$style.content_itemR_box">
                    <dy-input placeholder="同意" />
                  </div>
                </div>
              </div>
            </div>
            <div v-show="applyIndex === 4">
              <div :class="$style.step_title">步骤: 5</div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemLD">节点名称</div>
                <div :class="$style.content_itemR">
                  <dy-input placeholder="请输入内容" v-model="value1" />
                </div>
              </div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemLD">处理人</div>
                <div :class="$style.content_itemR">
                  <dy-radio v-model="gender" data="man">学校</dy-radio>
                </div>
              </div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemLD">操作</div>
                <div :class="$style.content_itemR">
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">审批</dy-checkbox>&nbsp;&nbsp;|&nbsp;&nbsp;
                    <dy-input placeholder="推荐" v-model="value1" :class="$style.input_options" />
                  </div>
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">审批</dy-checkbox>&nbsp;&nbsp;|&nbsp;&nbsp;
                    <dy-input placeholder="撤回推荐" v-model="value1" :class="$style.input_options" />
                  </div>
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">下个节点退审后可再次提交审批</dy-checkbox>&nbsp;&nbsp;|&nbsp;&nbsp;
                    <dy-input placeholder="重新推荐" v-model="value1" :class="$style.input_options" />
                  </div>
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">关闭流程</dy-checkbox>
                  </div>
                </div>
              </div>
              <div :class="$style.content_item">
                <div :class="$style.content_itemL">节点设置</div>
                <div :class="$style.content_itemR">
                  <div :class="$style.content_itemR_box">
                    <dy-checkbox v-model="remember">当前节点启用审批意见</dy-checkbox>
                  </div>
                  <div :class="$style.content_itemR_box">设置默认意见</div>
                  <div :class="$style.content_itemR_box">
                    <dy-input placeholder="同意" />
                  </div>
                </div>
              </div>
            </div>
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
export default {
  name: '',
  componets: {},
  props: {},
  vuex: {},
  data() {
    return {
      config: {},
      applyIndex: 0,
      gender: 0
    }
  },
  computed: {},
  watch: {},
  methods: {},
  beforeCreate() {},
  created() {
    this.config = applyTemplateConfig[this.$route.query.type]
  },
  beforeMount() {},
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
.left_tab_container {
  padding-top: 20px;
  padding-right: 0px !important;
  .left_tab_box {
    cursor: pointer;
    color: #666666;
    padding: 20px 40px 20px 0;
    text-align: right;
    font-size: 18px;
    &.active {
      color: #2c5081;
      border-right: 3px solid rgba(44, 80, 129, 1);
    }
  }
}
.step_title {
  color: rgba(51, 51, 51, 1);
  font-size: 18px;
}
.content_item {
  display: flex;
  //   align-items: flex-start;
  width: 100%;
  margin: 10px;
  .content_itemL {
    width: 80px;
    height: 30px;
    line-height: 32px;
    text-align: right;
    margin-right: 25px;
    position: relative;
    color: #333333;
  }
  .content_itemLD {
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: right;
    margin-right: 25px;
    position: relative;
    color: #333333;
    &::after {
      content: "*";
      top: 0;
      margin: auto;
      color: #ff0000;
      position: absolute;
      width: 10px;
      height: 18px;
    }
  }
  .content_itemR {
    display: flex;
    //   align-items: center;
    flex-direction: column;
    padding: 4px 0;
    .content_itemR_box {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
  }
}
.input_options {
  border: none;
}
</style>
