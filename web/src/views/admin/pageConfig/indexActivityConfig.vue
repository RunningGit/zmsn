<template>
  <div :class="$style.contianer">
    <div :class="$style.container_bg">
      <div :class="$style.left_container">
        <div :class="$style.iphone_box" class="iphone_bg">
          <div :class="$style.main_box">
            <!-- top -->
            <div :class="$style.nav">
              <img src="@/views/admin/pageConfig/images/icon_more.png" alt :class="$style.nav_back" />
              <div :class="$style.nav_center_title">{{ activity.title }}</div>
              <div :class="$style.nav_more">...</div>
            </div>

            <!-- content -->
            <div :class="$style.content_box">
              <div :class="$style.activity_box" v-for="(activityItem, index) in activityList" :key="activityItem.id" @click="changeActivity(activityItem)">
                <!-- 活动标题 -->
                <div :class="$style.activity_title">
                  <div :class="$style.left_box">
                    <div :class="$style.title">{{ activityItem.title }}</div>
                    <div :class="$style.sub_title">报名截止时间: {{activityItem.endDate}}</div>
                  </div>
                  <div :class="$style.right_box">
                    <div :style="btnColor(activityItem)" :class="$style.right_box_btn">{{activityItem.buttonText}}</div>
                  </div>
                </div>
                <!-- 活动图片 -->
                <img :src="activityItem.activityCover" alt="" :class="$style.activityCover">
                <!-- up / down -->
                <div :class="$style.float_panel">
                  <el-button type="" icon="el-icon-top" @click="upActivity(index)" v-show="index !== 0"></el-button>
                  <el-button type="" icon="el-icon-bottom" @click="downActivity(index)" v-show="index !== activityList.length -1 "></el-button>
                </div>
              </div>
              <div style="display:flex;text-align: center; justify-content: center;padding: 10px;">
                <dy-button type="primary">点击添加活动</dy-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div :class="$style.right_container">
        <div :class="$style.right_box">
          <div :class="$style.item_box">
            <div :class="$style.item_left">
              页面名称
              <span :class="$style.red_dot">*</span>
            </div>
            <div :class="$style.item_right">
              <dy-input v-model="activity.title" width="250"></dy-input>
              <span :class="$style.limit_text">限10个字</span>
            </div>
          </div>

          <div :class="$style.item_box">
            <div :class="$style.item_left">
              活动图片
              <span :class="$style.red_dot">*</span>
            </div>
            <div :class="$style.item_right">
              <el-upload
                class="avatar-uploader"
                action="/api/admin/uploadFile"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="activity.activityCover" :src="activity.activityCover" :class="$style.avatar" >
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span :class="$style.limit_text">建议宽375比例像素，高度不限，大小不超过2M</span>
            </div>
          </div>

          <div :class="$style.item_box">
            <div :class="$style.item_left">
              活动报名
              <span :class="$style.red_dot">*</span>
            </div>

            <div :class="$style.item_right_column">
              <div :class="$style.inner_item">
                背景颜色
                <el-color-picker @active-change="buttonColorChange" v-model="activity.buttonColor"></el-color-picker>
              </div>

              <div :class="$style.inner_item">
                显示文字
                <dy-input type="textarea" v-model="activity.buttonText" width="250"></dy-input>
              <span :class="$style.limit_text">不超过6个字</span>
              </div>

              <div :class="$style.inner_item">
                文字颜色
                <el-color-picker @active-change="buttonTextColorChange" v-model="activity.buttonTextColor"></el-color-picker>
              </div>

              <div :class="$style.inner_item">
                + 选择活动
                <div>

                </div>
              </div>
            </div>
          </div>

          <div :class="$style.item_box">
            <dy-button type="primary" style="margin:auto" size="large" @click="saveIndexConfig">保存</dy-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from './api'
export default {
  name: '',
  components: {},
  props: {},
  vuex: {},
  data() {
    return {
      activity: {},
      activityList: []

    }
  },
  computed: {
    btnBgColor() {
      return this.activity.buttonColor
    }
  },
  watch: {
  },
  methods: {
    btnColor(activityItem) {
      return {
        color: activityItem.buttonTextColor || '',
        background: activityItem.buttonColor || ''
      }
    },
    buttonColorChange(val) {
      // document.querySelector('.el-color-dropdown__btns').querySelector('.is-plain').click()
      this.activity.buttonColor = val
    },
    buttonTextColorChange(val) {
      // document.querySelector('.el-color-dropdown__btns').querySelector('.is-plain').click()
      this.activity.buttonTextColor = val
    },
    handlePictureCardPreview(file) {
      this.activity.activityCover = file.url
    },
    handleAvatarSuccess(res, file) {
      this.activity.activityCover = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type.toLowerCase().indexOf('png|jpeg|jpg') === -1
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 PNG、JPEG、JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    saveIndexConfig() {
      Api.saveIndexConfig(this.activity)
    },
    changeActivity(item) {
      this.activity = item
      document.querySelectorAll('.el-color-picker__color-inner')[0].style.backgroundColor = this.activity.buttonColor
      document.querySelectorAll('.el-color-picker__color-inner')[1].style.backgroundColor = this.activity.buttonTextColor
    },
    upActivity(index) {
      const activity = this.activityList.splice(index, 1)
      this.activityList.splice(index - 1, 0, ...activity)
    },
    downActivity(index) {
      const activity = this.activityList.splice(index, 1)
      this.activityList.splice(index + 1, 0, ...activity)
    }
  },
  beforeCreate() {},
  created() {
    Api.getActivityConfig().then(res => {
      this.activityList = res.list
      this.activity = this.activityList && this.activityList.length && this.activityList[0]
    })
  },
  beforeMount() {},
  mounted() {}
}
</script>
<style lang="less">
.iphone_bg {
  background: url("./images/iphone.png") no-repeat;
  background-size: 100% 100%;
}
</style>
<style lang="less" module>
.contianer {
  width: 100%;
  padding: 20px;
  height: 100%;
  overflow: scroll;
  .container_bg {
    display: flex;
    background-color: #ffffff;
    border: 1px solid #ddd;
    box-shadow: 3px 4px 12px #ddd;
  }
}
.right_container {
  width: calc(100% - 480px);
  border: 1px solid red;
  padding: 20px;
  .right_box {
    border: 1px solid #eee;
    .item_box,
    .item_box_column {
      border-bottom: 1px solid #eee;
      padding: 20px;
      display: flex;
      flex-direction: row;
      // align-items: center;
      .item_left {
        width: 150px;
        text-align: right;
        padding-top: 8px;
        .red_dot {
          font-size: 14px;
          color: red;
          padding: 0 20px;
        }
      }
      .item_right {
        padding: 6px;
        display: flex;
        align-items: center;
        width: calc(100% - 150px);
      }
      .item_right_column {
        display: flex;
        flex-direction: column;
        width: calc(100% - 150px);
        .inner_item {
          width: 100%;
          display: flex;
          align-items: center;
          margin: 6px 0;
          & > div {
            padding: 0 4px;
          }
        }
      }
    }
  }
}

.activity_box {
  // height: 180px;
  margin:auto;
  box-shadow: 0 0 1px 0 #aaa;
  padding: 10px;
  position: relative;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  .float_panel {
    opacity: 0;
    position: absolute;
    left: 0;bottom: 0;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &:hover {
    .float_panel {
      // background: rgba(255,255,255, .35);
      opacity: 1;
      background: blur(10px);
    }
  }
  .activity_title {
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    .left_box {
      width: 80%;
      overflow: hidden;
      .title {
        font-size: 14px;
        font-weight: bold;
        color: #333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-bottom: 6px;
      }
      .sub_title {
        font-size: 12px;
        color: #aaa;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .right_box{
      display: flex;
      align-items: center;
      width: 20%;
      .right_box_btn {
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        width: 100%;
        height: 32px;
        line-height: 32px;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .activityCover {
    width: 100%;
    height: 160px;
  }
}
.left_container {
  width: 480px;
  border: 1px solid red;
  padding: 40px 0;
  .iphone_box {
    width: 400px;
    height: 781px;
    margin: auto;
    padding-top: 110px;
    .main_box {
      height: 566px;
      width: 320px;
      margin: auto;
      position: relative;
      // content
      .content_box {
        width: 320px;
        height: calc(100% - 40px);
        overflow-y: auto;
        overflow-x: hidden;
        background: #eee;
        padding: 10px;
      }
      // top
      .nav {
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
        background: #ffffff;
        padding: 0px 10px;
        .nav_back {
          width: 10px;
          height: 20px;
        }
        .nav_center_title {
          text-align: center;
          flex: 1;
          font-size: 16px;
          font-weight: bold;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding: 0 10px 0 20px;
        }
        .nav_more {
          font-size: 22px;
          font-weight: bold;
          margin-top: -10px;
        }
      }
    }
  }
}

.limit_text {
  padding-left: 20px;
  font-size: 12px;
  color: #999;
}
.avatar {
  width: 160px;
  height: 160px;
  display: block;
}
</style>
