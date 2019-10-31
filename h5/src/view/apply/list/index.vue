<template>
  <div class="declare">
    <div class="tab-bar">
      <div @click="tabChange('applying')" :class="{'active': tab==='applying'}">申报中</div>
      <div @click="tabChange('result')" :class="{'active': tab==='result'}">申报结果</div>
      <div @click="tabChange('draft')" :class="{'active': tab==='draft'}">草稿</div>
    </div>
    <div class="list" v-if="tab==='applying'">
      <div class="item">
        <div class="title">广东省第五届寻找南粤最美少年活动</div>
        <div class="content">
          <div>
            <div class="desc">申报编号</div>
            <div class="info">12345678</div>
          </div>
          <div>
            <div class="desc">申报时间</div>
            <div>2019.04.01 15:30:12</div>
          </div>
          <div>
            <div class="desc">当前进度</div>
            <div class="color-red">团市委已推荐</div>
          </div>
          <div>
            <div class="desc">下一步处理</div>
            <div class="color-red">团省委推荐</div>
          </div>
          <div>
            <div class="desc">活动说明</div>
            <div class="explain">
              判断长度是否等于45，是则显示展示。判断长度是否等于45，是则显示展示判断长度是否等于45，是则显示展示判断长度是否等于45，是则显示展示
              <div class="more">....<span style="color:#ff8245">展开</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div>活动详情</div>
        <div>申报信息</div>
        <div class="detail">评审详情</div>
      </div>
    </div>
    <div class="list" v-if="tab==='result'">
      <div class="item">
        <div class="title">广东省第五届寻找南粤最美少年活动</div>
        <div class="content">
          <div>
            <div class="desc">申报编号</div>
            <div class="info">12345678</div>
          </div>
          <div>
            <div class="desc">荣获荣誉</div>
            <div class="color-red">省级最美南粤少年-美德好少年</div>
          </div>
          <div>
            <div class="desc">荣获时间</div>
            <div>2019.08.01</div>
          </div>
          <div>
            <div class="desc">申报时间</div>
            <div>2019.04.01 15:30:09</div>
          </div>
          <div>
            <div class="desc">活动说明</div>
            <div
              class="explain"
            >活动说明活动说明活动说明活动说明活动说明活动说明活动说明活动说明活动说明活动说明动说明动说明动说明动说明动说明动说明动说明动说明动说明动说明动说明动说明动说明动说明动说明动说明</div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div>活动详情</div>
        <div>申报信息</div>
        <div class="detail">评审详情</div>
      </div>
    </div>
    <div class="list" v-if="tab==='draft'">
      <div class="item">
        <div class="title">广东省第五届寻找南粤最美少年活动</div>
        <div class="content">
          <div>
            <div class="desc">保存时间</div>
            <div class="info">2019.08.01</div>
          </div>
          <div>
            <div class="desc">状态</div>
            <div>草稿</div>
          </div>
          <div>
            <div class="desc">活动说明</div>
            <div
              class="explain"
            >活动说明活动说明活动说明活动说明活动说明活动说明活动说明活动说明活动说明活动说明动说明动说明动说明动说明动说明动说明动说明动说明动说明动说明动说明动说明动说明动说明动说明动说明</div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div>删除</div>
        <div>编辑</div>
        <div class="detail">评审详情</div>
      </div>
    </div>
    <div class="none-data">暂无数据</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tab: "applying",
      list: "11"
    };
  },
  methods: {
    tabChange: function(key) {
      this.tab = key;
    }
  },
  created(){
    import(`./${this.$isDesktop ? 'desktop': 'mobile'}.less`)
  },
};
</script>
<style lang="less" scoped>

</style>