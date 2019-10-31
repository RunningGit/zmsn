<template>
  <div class="form-title-cont">
    <div class="title">{{typeMap[type].title}}</div>
    <div class="sub-title">{{typeMap[type].subTitle}}</div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: [String],
      default: '1'
    }
  },
  data(){
    return {
      typeMap: {
        '1': {
          title: '第五届寻找“最美南粤少年”活动申报',
          subTitle: '践行核心价值观 争当南粤好少年'
        },
       '2': {
          title: '广东省第五届优秀共青团员活动申报',
          subTitle: '践行核心价值观 争当南粤好少年',
        },
        '3': {
          title: '第五届寻找“最美南粤少年”活动申报',
          subTitle: '践行核心价值观 争当南粤好少年'
        }
      }
    }
  },
  created(){
    import(`./${this.$isDesktop ? 'desktop': 'mobile'}.less`)
  },
}
</script>


