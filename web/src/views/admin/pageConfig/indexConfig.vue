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
              <div
                :class="$style.notice"
                v-if="activity.noticeOn"
                :style="noticeColor"
              ><img src="@/views/admin/pageConfig/images/icon_gonggao.png" style="width: 14px;height: 14px;margin-right: 4px;" />公告：{{ activity.noticeContent }}</div>
              <img :src="activity.photoUrl" :class="$style.noticePic" />
              <div :class="$style.btn" :style="btnColor">{{ activity.buttonText }}</div>
              <div :class="$style.btn_down" :style="btnColor">{{ activity.button1Text }}</div>
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
              公告
              <span :class="$style.red_dot">*</span>
            </div>

            <div :class="$style.item_right_column">
              <div :class="$style.inner_item">
                <dy-checkbox v-model="activity.noticeOn"></dy-checkbox>
              </div>
              <div :class="$style.inner_item">
                公告内容
                <dy-input type="textarea" v-model="activity.noticeContent" width="250"></dy-input>
              </div>

              <div :class="$style.inner_item">
                跳转链接
                <dy-input v-model="activity.link" width="250"></dy-input>
                <div :class="$style.limit_text">限10个字</div>
              </div>

              <div :class="$style.inner_item">
                文字颜色
                <el-color-picker @active-change="noticeTextColorChange" v-model="activity.noticeTextColor"></el-color-picker>
              </div>
            </div>
          </div>

          <div :class="$style.item_box">
            <div :class="$style.item_left">
              首页图片
              <span :class="$style.red_dot">*</span>
            </div>
            <div :class="$style.item_right">
              <div :class="$style.file_upload" style="margin-right: 10px;">
                <el-upload
                  :class="$style.avatar_uploader"
                  action="/api/admin/uploadFile"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="activity.photoUrl" :src="activity.photoUrl" :class="$style.avatar" >
                  <img v-else src="@/views/admin/pageConfig/images/pic.png" :class="$style.avatar" >
                </el-upload>
                移动端
              </div>
              <div :class="$style.file_upload">
                <el-upload
                  :class="$style.avatar_uploader"
                  action="/api/admin/uploadFile"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="activity.photoUrl" :src="activity.photoUrl" :class="$style.avatar" >
                  <img v-else src="@/views/admin/pageConfig/images/pic.png" :class="$style.avatar" >
                </el-upload>
                PC端
              </div>
              <span :class="$style.limit_text">移动端建议宽375像素，高度不限，大小不超过1M PC端建议宽1280像素，高度不限，大小不超过2M</span>
            </div>
          </div>

          <div :class="$style.item_box">
            <div :class="$style.item_left">
              报名按钮
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
            </div>
          </div>

          <div :class="$style.item_box">
            <div :class="$style.item_left">
              文件下载
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
                文件上传
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </el-upload>
              </div>
            </div>
          </div>

          <div :class="$style.item_box">
            <dy-button type="primary" style="margin:auto" size="large" @click="openPublishDialog = true">发布</dy-button>
          </div>
        </div>
      </div>
    </div>
    <dy-modal v-model="openPublishDialog" title="提示" class="dy-dialog">
      <div>发布后将立即生效，确认发布吗?</div>
      <div slot="footer">
        <dy-button @click="openPublishDialog = false">取消</dy-button>
        <dy-button type="primary">确定</dy-button>
      </div>
    </dy-modal>
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
      openPublishDialog: false
    }
  },
  computed: {
    noticeColor() {
      return this.activity.noticeTextColor
        ? {
          color: this.activity.noticeTextColor
        }
        : {}
    },
    btnColor() {
      return this.activity.buttonTextColor
        ? {
          color: this.activity.buttonTextColor,
          background: this.activity.buttonColor
        }
        : {}
    }
  },
  watch: {},
  methods: {
    noticeTextColorChange(val) {
      this.activity.noticeTextColor = val
    },
    buttonColorChange(val) {
      this.activity.buttonColor = val
    },
    buttonTextColorChange(val) {
      this.activity.buttonTextColor = val
    },
    handlePictureCardPreview(file) {
      this.activity.photoUrl = file.url
    },
    handleAvatarSuccess(res, file) {
      this.activity.photoUrl = URL.createObjectURL(file.raw)
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
    }
  },
  beforeCreate() {},
  created() {
    Api.getIndexConifg().then(res => {
      this.activity = res
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
.dy-dialog{
  .dy-modal-header{
    background: white;
    color: black;
    .dy-icon.iconfont.icon-close{
      color: black;
    }
  }
  .dy-modal-body {
    border-bottom: none;
  }
  .dy-modal-footer {
    background: white;
    > :first-child{
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      > :first-child {
        margin-right: 20px;
      }
    }
  }
}
.upload-demo {
  display: flex;
  align-items:center;
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
    background: rgba(250,250,250,1);
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
      .avatar_uploader {
        height: 100px;
        width: 100px;
        overflow: hidden;
      }
      .file_upload {
        text-align: center;
      }
    }
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
        background: #ffffff;
        box-shadow: 0 0 1px 0 #eee;
        .notice {
          background: #00A9FB;
          padding: 0 10px;
          height: 38px;
          font-size: 14px;
          font-weight: bold;
          display: flex;
          align-items: center;
        }
        .noticePic {
          width: 100%;
          // height: 600px;
        }
        .btn {
          width: 100%;
          height: 32px;
          line-height: 32px;
          // border-radius: 8px;
          position: absolute;
          bottom: 0px;
          // margin: auto;
          text-align: center;
          left: 0;
          right: 0;
          font-size: 18px;
          font-weight: bold;
        }
        .btn_down {
          width: auto;
          height: 32px;
          line-height: 32px;
          // border-radius: 8px;
          position: absolute;
          padding: 0px 6px;
          bottom: 0px;
          // margin: auto;
          text-align: center;
          left: 0;
          font-size: 12px;
          font-weight: bold;
        }
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
  width: 100px;
  height: 100px;
  display: block;
}
</style>
