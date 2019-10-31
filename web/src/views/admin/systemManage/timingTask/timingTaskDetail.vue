<template slot="content">
  <div class="dsf_content">
    <div class="dsf_content_section">
      <div class="dsf_system_title">
        <h1 v-if="detailTrue">定时任务详情</h1>
        <h1 v-else>编辑定时任务</h1>
      </div>
      <div class="dsf_system_btn">
        <div v-if="detailTrue">
          <dy-button @click="back">
            <i class="iconfont icon-angle-double-left"></i>返回</dy-button>
          <dy-button @click="gotocompile()"
            v-permission="'sys:schedule:update'"
            v-if="detailTrue">编辑</dy-button>
        </div>
        <div v-if="!detailTrue">
          <dy-button type="primary"
            @click="saveChange()">保存</dy-button>
          <dy-button @click="back">取消</dy-button>
        </div>
      </div>
      <div class="dsf_system_section">
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="dsf_require"
              v-if="!detailTrue">*</span>bean名称：</label>
          <div class="dsf_label_input">
            <label v-if="detailTrue">{{form.beanName}}</label>
            <dy-input v-if="!detailTrue"
              placeholder="请填写bean名称"
              maxlength="200"
              v-model="form.beanName">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="dsf_require"
              v-if="!detailTrue">*</span>方法名称：</label>
          <div class="dsf_label_input">
            <label v-if="detailTrue">{{form.methodName}}</label>
            <dy-input v-if="!detailTrue"
              placeholder="请填写方法名称"
              v-model="form.methodName"
              maxlength="100">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">参数：</label>
          <div class="dsf_label_input">
            <label v-if="detailTrue">{{form.params}}</label>
            <dy-input v-if="!detailTrue"
              placeholder="请填写参数"
              width="280"
              maxlength="2000"
              v-model="form.params">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">
            <span class="dsf_require"
              v-if="!detailTrue">*</span>cron表达式：</label>
          <div class="dsf_label_input">
            <label v-if="detailTrue">{{form.cronExpression}}</label>
            <dy-input v-if="!detailTrue"
              placeholder="请输入cron表达式"
              maxlength="100"
              width="280"
              v-model="form.cronExpression">
            </dy-input>
          </div>
        </div>
        <div class="dsf_label_item">
          <label class="dsf_label_name">备注：</label>
          <div class="dsf_label_input dsf_label_top">
            <label v-if="detailTrue">{{form.remark}}</label>
            <dy-input v-if="!detailTrue"
              placeholder="请输入备注"
              maxlength="255"
              width="280"
              v-model="form.remark">
            </dy-input>
          </div>
        </div>
      </div>
      <div class="dsf_system_btn">
        <div v-if="detailTrue">
          <dy-button @click="back">
            <i class="iconfont icon-angle-double-left"></i>返回</dy-button>
          <dy-button @click="gotocompile()"
            v-if="detailTrue">编辑</dy-button>
        </div>
        <div v-if="!detailTrue">
          <dy-button type="primary"
            @click="saveChange()">保存</dy-button>
          <dy-button @click="back">取消</dy-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import systemManage from '../api' // 引入相应API
import permission from '@/directives/permission'

export default {
  data() {
    return {
      form: {},
      detailTrue: false
    }
  },
  directives: { permission },
  watch: {
    $route(to, from) {
      if (to.name === from.name && to.name === 'timingTaskDetail') {
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.dataID = this.$route.query.id
      let pageType = this.$route.query.type
      // 判断该页面是处于查看详情还是编辑状态--自定义:detail:详情页  compile:编辑状态页面
      this.detailTrue = pageType === 'detail'
      this.getDetail(this.dataID)
    },
    back() {
      this.$router.push({
        name: 'timingTaskList'
      })
    },
    gotocompile() {
      this.$router.push({
        name: 'timingTaskDetail',
        query: { id: this.dataID, type: 'compile' }
      })
    },
    // 获取详情数据
    getDetail(id) {
      systemManage.infoTask(id).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          this.form = response.data.data
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 保存更改
    saveChange() {
      // 表格验证
      if (!this.form.beanName) {
        this.$ego.alertMsg('请填写bean名称', 'warning', 1000)
        return false
      }
      if (!this.form.methodName) {
        this.$ego.alertMsg('请填写方法名称', 'warning', 1000)
        return false
      }
      if (!this.form.cronExpression) {
        this.$ego.alertMsg('请填写cron表达式', 'warning', 1000)
        return false
      }
      systemManage.updateTask(this.form).then(response => {
        if (response.data.code === 0) {
          this.$ego.alertMsg('修改定时任务成功', 'success', 1000)
          this.$router.push({
            name: 'timingTaskList'
          })
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    }
  },
  created() {
    this.init()
  }
}
</script>
