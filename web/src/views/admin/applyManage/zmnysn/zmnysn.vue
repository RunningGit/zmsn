<template>
  <div class='dsf_content'>
    <div class='dsf_content_section dsf_content_section_padding' style="display:flex;flex-direction: column;">
      这里是给你们参考的，选中后的值会返回，也可以传递对应的对像，但在修改具体select跟option的值。{{selectValue}}
      <top title="活动名称" :list="list" v-model="selectValue"></top>
      <center :navList="navList" style="flex:1;">
        <!-- 主要写这里的页面面板内容，面板按照序号新建类似slot_0的页面 <template slot="slot_0"><slot-0></slot-0></template>-->
        <template slot="slot_0"><slot-0></slot-0></template>
        <template slot="slot_1"><slot-1></slot-1></template>
        <template slot="slot_2">2</template>
        <template slot="slot_3">3</template>
      </center>
    </div>
  </div>
</template>
<script>
import Top from '../components/top'
import center from '../components/center'
import Slot0 from './slot_0'
import Slot1 from './slot_1'
export default {
  name:'',
  components:{
    Top, center, Slot0, Slot1
  },
  props:{
  },
  vuex:{

  },
  data() {
    return {
      list: ['1', '2', '43'],
      navList: ['申报信息', '活动评审', '我的候选人', '统计分析', '评分表'],
      selectValue: '1'
    }
  },
  computed:{

  },
  watch:{

  },
  methods:{

  },
  beforeCreate() {

  },
  created() {

  },
  beforeMount() {

  },
  mounted() {

  }
}
</script>
<style lang="less">

</style>
