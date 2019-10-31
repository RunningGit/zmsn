<template>
  <div class="uploadImage-cont">
    <p class="label" v-show="attr.label">
      {{attr.label}}
      <i class="is-require" v-show="attr.isRequire">*</i>
    </p>
    <p class="sub-label" v-show="attr.placeholder">{{attr.placeholder}}</p>
    <div class="upload-cont">
      <el-upload 
        :action = "action"
        list-type="picture-card" 
        :limit="limit"
        :disabled="lock"
        :on-success="uploadSuccess"
        :file-list="fileList"
        :auto-upload="false">
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{file}">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
            >
              <i class="el-icon-download"></i>
            </span>
            <span v-if="true" class="el-upload-list__item-delete" @click="handleRemove(file)">
              <i class="el-icon-delete"></i>
            </span>
          </span>
          <!-- <span class="upload-actions">
            <span v-if="true" class="item-delete" @click="handleRemove(file)">
              <i class="icon-delete"></i>
            </span>
          </span> -->
        </div>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { Upload, Dialog } from "element-ui";
import Vue from "vue";

Vue.use(Upload);
Vue.use(Dialog);

export default {
  props: {
    attr: {
      type: [Object],
      default: {
        label: '',
        isRequire: true,
      }
    },
    val: {
      type: [String],
      default: ""
    },
    lock: {
      type: [Boolean],
      default: false
    }
  },
  data() {
    return {
      limit: 10,
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      attrState: this.attr,
      imageUrlList: [],
      action: ''
    };
  },
  watch: {
    val: function(curVal) {
      this.msg = curVal;
    },
    attr: function(curVal) {
      this.attrState = curVal
    }
  },
  methods: {
    handleRemove(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    uploadSuccess(response, file, fileList) {
      // TODO 删除的时候注意删掉；
      this.imageUrlList.push([this.dialogImageUrl]);
      console.warn('=23232', this.imageUrlList)
      console.warn('=response', response)
      console.warn('=file', this.file)
      console.warn('=fileList', this.fileList)
    }
  }
};
</script>

<style lang="less">
.uploadImage-cont {
  .el-upload-list--picture-card,
  .el-upload-list__item {
    height: 120px;
    width: 120px;
    position: relative;
    border-radius: 0px;
  }

  .el-upload--picture-card {
    background-color: #FF0000;
    background: url(../assets/upload.png) no-repeat;
    background-size: 100% 100%;
    border: none;
    height: 120px;
    width: 120px;
    border-radius: 0px;

    &.active,
    &.focus {
      border: none;
    }

    i {
      display: none;
    }
  }
}
</style>

<style lang="less" scoped>
.uploadImage-cont {
  font-size: 28px;
  font-weight:500;
  color:rgba(51,51,51,1);
  margin-top: 30px;

  .upload-actions {
    position: absolute;
    height: 30px;
    width: 30px;
  }

  .icon-delete {
    height: 30px;
    width: 30px;
    display: inline-block;
    background: url(../assets/delete.png) no-repeat;
    background-size: 100% 100%;
  }

  .label {
    font-size: 30px;
  }

  .is-require {
    color: #FF0000;
    font-size:30px;
  }

  .sub-label {
    font-size:24px;
    color:rgba(153,153,153,1);
    line-height:70px;
  }
}
</style>