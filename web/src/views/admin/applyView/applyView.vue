<template>
  <div :class="$style.full_container">
    <div :class="$style.top_title">
      {{ config[$route.query.type].name }}
      <div :class="$style.top_close" @click="$router.back()">关闭</div>
    </div>
    <div :class="$style.container">
      <div :class="$style.left_section">
        <div :class="$style.title">移动端</div>
        <div :class="$style.left_section_outer_box" class="iphone">
          <div :class="$style.mobile_view_box">
            <div :class="$style.mobile_view_content">
              <div :class="$style.content_title_box">
                <div :class="$style.content_title1">第N届寻找“最美南粤少年”活动申报</div>
                <div :class="$style.content_title2">践行核心价值观 争当南粤好少年</div>
              </div>
              <div :class="$style.divider_margin_box"></div>
              <div :class="$style.content_main_box">
                <div v-for="item in config[$route.query.type].options" :key="item.name">
                  <all-temp :item="item"></all-temp>
                </div>
              </div>
            </div>
            <btn-temp></btn-temp>
          </div>
        </div>
      </div>
      <div :class="$style.right_section">
        <div :class="$style.title">PC端</div>
        <div :class="$style.right_section_outer_box">
          <div :class="$style.pc_view_box">
            <div :class="$style.pc_view_content">
              <div :class="$style.content_title_box">
                <div :class="$style.content_title1">第N届寻找“最美南粤少年”活动申报</div>
                <div :class="$style.content_title2">践行核心价值观 争当南粤好少年</div>
              </div>
              <div :class="$style.divider_margin_box_pc"></div>
              <div :class="$style.content_main_box_flex">
                <pc-temp
                  style="width: 50%;padding: 20px 10px;"
                  :item="item"
                  v-for="(item, index) in config[$route.query.type].options"
                  :key="index"
                ></pc-temp>
              </div>
            </div>
            <btn-temp></btn-temp>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as config from './config'
import allTemp from './template/allTemp'
import pcTemp from './template/pcTemp'
import btnTemp from './template/btnTemp'
export default {
  name: '',
  components: {
    allTemp,
    pcTemp,
    btnTemp
  },
  props: {},
  vuex: {},
  data() {
    return {
      config: config
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
<style lang="less">
.iphone {
  // TODO 换成iphone
  background: url(./images/iphoneBg.png) no-repeat;
  // background-color: white;
  background-size: 100% 100%;
  width: 380px;
  height: 748px;
}
</style>
<style lang="less" module>
.full_container {
  z-index: 999;
  position: fixed;
  width: 100%;
  overflow: scroll;
  top: 60px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f5f5f5;
  .top_title {
    color: #333333;
    font-size: 20px;
    text-align: center;
    padding: 20px;
    font-weight: bold;
    position: relative;
    .top_close {
      position: absolute;
      cursor: pointer;
      font-size: 18px;
      width: 84px;
      height: 42px;
      border: 1px solid #dddddd;
      border-radius: 4px;
      right: 20px;
      top: 16px;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
    }
  }
}
.divider_margin_box {
  background-color: #eee;
  height: 10px;
  width: 100%;
}
.divider_margin_box_pc {
  height: 10px;
  width: 100%;
}
.container {
  padding: 20px;
  background: #fff;
  min-width: 1500px;
  display: flex;
  justify-content: center;
  text-align: center;
  height: auto !important;
  .left_section {
    width: 40%;
    min-width: 600px;
    .left_section_outer_box {
      margin: 30px auto 0;
      padding: 20px;
      .mobile_view_box {
        background-color: rgba(255, 255, 255, 1);
        margin-top: 130px;
        margin-left: 2px;
        width: 330px;
        height: 503px;
        overflow-y: auto;
        // box-shadow: 0px 0px 1px 1px #eeeeee;
        border-radius: 4px;
        .mobile_view_content {
          width: 100%;
          .content_title_box {
            text-align: center;
            padding: 10px;
            .content_title1 {
              color: #333;
              font-size: 18px;
              padding-bottom: 10px;
              font-weight: bold;
            }
            .content_title2 {
              color: #555;
            }
          }
          .content_main_box {
            padding: 10px;
            text-align: left;
            width: 100%;
          }
        }
      }
    }
  }
  .right_section {
    width: 60%;
    min-width: 880px;
    .right_section_outer_box {
      margin-top: 30px;
      .pc_view_box {
        border: 1px solid #eee;
        padding: 20px 0;
        .pc_view_content {
          .content_title_box {
            text-align: center;
            padding: 10px;
            .content_title1 {
              color: #333;
              font-size: 18px;
              padding-bottom: 10px;
              font-weight: bold;
            }
            .content_title2 {
              color: #555;
            }
          }
          .content_main_box_flex {
            text-align: left;
            width: 100%;
            padding: 10px 20px;
          }
          .content_main_box_flex {
            // width: 50%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            align-items: center;
            flex-direction: row;
          }
        }
      }
    }
  }
  .title {
    text-align: center;
  }
}
</style>
