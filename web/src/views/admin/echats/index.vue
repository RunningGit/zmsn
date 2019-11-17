<template>
  <div class='dsf_content'>
    <div style="width: 100%;height: 600px;" ref="echats_01"></div>
    <div style="width: 100%;height: 600px;" ref="echats_02"></div>
    <div style="width: 100%;height: 600px;" ref="echats_03"></div>
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
// 引入柱状图
require('echarts/lib/chart/bar')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/chart/line')
export default {
  name:'',
  components:{

  },
  props:{

  },
  vuex:{

  },
  data() {
    return {
      schoolNum: [1200.0, 4000.9, 700.0, 2300.2, 2500.6, 7600.7, 1300.6, 6200.2, 3200.6, 2000.0, 600.4, 300.3],
      schoolJoinNum: [2.6, 5.9, 2.0, 2.4, 28.7, 70.7, 15.6, 8.2, 22.7, 18.8, 6.0, 2.3].map(item => item * 80),
      schoolName: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      schoolBalanceNum: [1200.0, 4000.9, 700.0, 2300.2, 2500.6, 7600.7, 1300.6, 6200.2, 3200.6, 2000.0, 600.4, 300.3],
      schoolApplyNum: [1200.0, 4000.9, 700.0, 2300.2, 2500.6, 7600.7, 1300.6, 6200.2, 3200.6, 2000.0, 600.4, 300.3]
    }
  },
  computed:{
    schoolNumMaxValue() {
      return Math.max(Math.max.call(null, ...this.schoolNum) + Math.min.call(null, ...this.schoolNum), Math.max.call(null, ...this.schoolJoinNum))
    },
    schoolJoinBalance() {
      return 6000
    },
    schoolRate() {
      const rates = []
      this.schoolNum.forEach((item, index) => {
        rates.push(this.schoolJoinNum[index] / item * 100)
      })
      return rates
    },
    schoolApplyMaxValue() {
      return Math.max.call(null, ...this.schoolApplyNum) + Math.min.call(null, ...this.schoolApplyNum)
    }
  },
  watch:{

  },
  methods:{
    setChatsO1() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.echats_01)

      const colors = ['#5793f3', '#d14a61', '#67b131']

      const option = {
        title: {
          text: '各地市学校参与情况'
        },
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: 'eee'
            }
          }
        },
        //   grid: {
        //     right: '20%'
        //   },
        toolbox: {
          feature: {
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        legend: {
          data:['学校总数', '学校参与数', '学校覆盖率']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: this.schoolName
          }
        ],
        yAxis: [
        // 左侧数据
          {
            type: 'value',
            name: '',
            min: 0,
            max: this.schoolNumMaxValue,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          // 右侧百分比
          {
            type: 'value',
            name: '',
            min: 0,
            max: 100,
            position: 'right',
            offset: 0,
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name:'学校总数',
            type:'bar',
            data: this.schoolNum,
            barMaxWidth: 20
          },
          {
            name:'学校参与数',
            type:'bar',
            data: this.schoolJoinNum,
            barMaxWidth: 20
          },
          {
            name:'学校覆盖率',
            type:'line',
            yAxisIndex: 1,
            data: this.schoolRate
          }
        ]
      }

      // 绘制图表
      myChart.setOption(option)
    },
    // 各地市校均参与情况
    setChatsO2() {
    // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.echats_02)

      const colors = ['#5793f3']

      const option = {
        title: {
          text: '各地市校均参与情况'
        },
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        //   grid: {
        //     right: '20%'
        //   },
        toolbox: {
          feature: {
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        legend: {
          data:['各地市校均参与情况']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: this.schoolName
          }
        ],
        yAxis: [
        // 左侧数据
          {
            type: 'value',
            name: '',
            min: 0,
            max: this.schoolJoinBalance,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name:'各地市校均参与情况',
            type:'bar',
            data: this.schoolBalanceNum,
            barMaxWidth: 20
          }
        ]
      }

      // 绘制图表
      myChart.setOption(option)
    },
    // 各地市申报总人数
    setChatsO3() {
    // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.echats_03)

      const colors = ['#5793f3', '#d14a61', '#67b131']

      const option = {
        title: {
          text: '各地市申报总人数'
        },
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: 'eee'
            }
          }
        },
        //   grid: {
        //     right: '20%'
        //   },
        toolbox: {
          feature: {
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        legend: {
          data:['各地市申报总人数']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: this.schoolName
          }
        ],
        yAxis: [
        // 左侧数据
          {
            type: 'value',
            name: '',
            min: 0,
            max: this.schoolApplyMaxValue,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name:'各地市申报总人数',
            type:'bar',
            data: this.schoolApplyNum,
            barMaxWidth: 20
          }
        ]
      }
      // 绘制图表
      myChart.setOption(option)
    }
  },
  beforeCreate() {

  },
  created() {

  },
  beforeMount() {

  },
  mounted() {
    // 1 先执行一次yarn add echarts
    // 相关学习链接参考 https://www.echartsjs.com/zh/tutorial.html#%E5%9C%A8%20webpack%20%E4%B8%AD%E4%BD%BF%E7%94%A8%20ECharts
    // 2 按照三个表，根据接口返回数据对对应填充即可
    this.setChatsO1() // 图一
    this.setChatsO2() // 图二
    this.setChatsO3() // 图三
  }
}
</script>
<style lang="less">

</style>
