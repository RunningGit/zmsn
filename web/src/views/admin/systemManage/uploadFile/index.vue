<template>
  <div class="dsf_content">
    <div class="dsf_content_section dsf_content_section_padding">
      <!-- 按钮 -->
      <div class="dsf_search_condition">
        <dy-button v-permission="'dsf:oss:config'"
          @click="showDialog = true">云存储配置</dy-button>
        <dy-button @click="fileList = [],showUpload = true"
          v-permission="'dsf:oss:upload'"
          class="marginL10">上传文件</dy-button>
        <dy-button class="fr"
          v-permission="'dsf:oss:delete'"
          v-if="dataTable.length > 0"
          @click="delAll('URL地址')">批量删除</dy-button>
      </div>
      <!-- 应用表开始 -->
      <!--  viewFramework-item-mg-top  -->
      <div class="marginT20">
        <div class="dy_table"
          v-loading="loading">
          <table border="0"
            cellspacing="10"
            cellpadding="10">
            <tr>
              <th width="50"
                v-if="dataTable.length > 0">
                <label class="dy_checkbox"
                  @click="selectAll">
                  <span class="dy_checked_input">
                    <input type="checkbox"
                      :checked="hasCheckedAll">
                    <i class="icon iconfont"
                      :class="hasCheckedAll?'icon-check':'icon-check-square'"></i>
                  </span>
                </label>
              </th>
              <th>URL地址</th>
              <th width="200">创建时间</th>
              <th width="60"
                v-permission="'dsf:oss:list || dsf:oss:delete'"
                class="table_operating">操作</th>
            </tr>
            <tr class="dy_table_tips  "
              v-if="dataTable.length < 1">
              <td>暂无数据</td>
            </tr>
            <tr class="dy_table_row"
              v-for="(item,index) in dataTable"
              :key="index">
              <td v-if="dataTable.length > 0">
                <label class="dy_checkbox"
                  @click="handleSelectionChange(item)">
                  <span class="dy_checked_input">
                    <input type="checkbox"
                      :checked="item.checked">
                    <i class="icon iconfont "
                      :class="item.checked?'icon-check':'icon-check-square'"></i>
                  </span>
                </label>
              </td>
              <td :title="item.url">{{item.url}}</td>
              <td>{{item.createDate}}</td>
              <td class="edit_now"
                v-permission="'dsf:oss:list || dsf:oss:delete'">
                <div class="admin_operate">
                  <i class="iconfont icon-operation-group"></i>
                  <div class="edit_inline ">
                    <a :href="downFileUrl + '?uploadType=' + item.uploadType + '&path=' + item.url + '&X-Auth0-Token=' + headers['X-Auth0-Token']"
                      v-permission="'dsf:oss:list'"
                      target="_blank">查看</a>
                    <a href="javascript:;"
                      v-permission="'dsf:oss:delete'"
                      @click="del(item.id, '此URL数据')">删除</a>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <!-- 云存储配置 -->
        <div class="dsf_defined_dialog">
          <el-dialog title="云存储配置"
            :visible.sync="showDialog"
            width="748px"
            modal
            lock-scroll>
            <div class="dsf_system_section dsf_uploadfile_section">
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>存储类型：</label>
                <div class="dsf_label_input">
                  <dy-radio-group v-model="conf.type">
                    <dy-radio :data="1">七牛</dy-radio>
                    <dy-radio :data="2">阿里云</dy-radio>
                    <dy-radio :data="3">腾讯云</dy-radio>
                    <dy-radio :data="4">fastdsf</dy-radio>
                  </dy-radio-group>
                </div>
              </div>
            </div>
            <!-- 七牛 -->
            <div class="dsf_system_section dsf_uploadfile_section"
              style="border-top:0"
              v-show="conf.type === 1">
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>域名：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写域名"
                    v-model="conf.qiniuDomain">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>路径前缀：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写路径前缀"
                    v-model="conf.qiniuPrefix">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>AccessKey：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写AccessKey"
                    v-model="conf.qiniuAccessKey">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>SecretKey：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写SecretKey"
                    v-model="conf.qiniuSecretKey">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>空间名：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写空间名"
                    v-model="conf.qiniuBucketName">
                  </dy-input>
                </div>
              </div>
            </div>
            <!-- 阿里云 -->
            <div class="dsf_system_section dsf_uploadfile_section"
              style="border-top:0"
              v-show="conf.type === 2">
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>域名：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写域名"
                    v-model="conf.aliyunDomain">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>路径前缀：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写路径前缀"
                    v-model="conf.aliyunPrefix">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>EndPoint：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写EndPoint"
                    v-model="conf.aliyunEndPoint">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>AccessKeyId：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写AccessKeyId"
                    v-model="conf.aliyunAccessKeyId">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>AccessKeySecret：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写AccessKeySecret"
                    v-model="conf.aliyunAccessKeySecret">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>BucketName：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写BucketName"
                    v-model="conf.aliyunBucketName">
                  </dy-input>
                </div>
              </div>
            </div>
            <!-- 腾讯云 -->
            <div class="dsf_system_section dsf_uploadfile_section"
              style="border-top:0"
              v-show="conf.type === 3">
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>域名：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写域名"
                    v-model="conf.qcloudDomain">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>路径前缀：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写路径前缀"
                    v-model="conf.qcloudPrefix">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>AppId：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写AppId"
                    v-model="conf.qcloudAppId">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>SecretId：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写SecretId"
                    v-model="conf.qcloudSecretId">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>SecretKey：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写SecretKey"
                    v-model="conf.qcloudSecretKey">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>BucketName：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写BucketName"
                    v-model="conf.qcloudBucketName">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>Bucket所属地区：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写Bucket所属地区"
                    v-model="conf.qcloudRegion">
                  </dy-input>
                </div>
              </div>
            </div>
            <!-- fastdsf -->
            <div class="dsf_system_section dsf_uploadfile_section"
              style="border-top:0"
              v-show="conf.type === 4">
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>访问IP：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写IP"
                    v-model="conf.accessIP">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>访问端口：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写端口"
                    v-model="conf.accessPort">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>连接超时：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写连接超时时间"
                    v-model="conf.connectTimeout">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>网络超时：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写网络超时时间"
                    v-model="conf.networkTimeout">
                  </dy-input>
                </div>
              </div>
              <div class="dsf_label_item">
                <label class="dsf_label_name">
                  <span class="dsf_require">*</span>服务器列表：</label>
                <div class="dsf_label_input">
                  <dy-input type="text"
                    width="204"
                    placeholder="请填写服务器列表，多个地址用逗号隔开"
                    v-model="conf.trackers">
                  </dy-input>
                </div>
              </div>
            </div>
            <span slot="footer">
              <dy-button type="primary"
                @click="saveConfig(),showDialog=false">确定</dy-button>
              <dy-button class="marginL10"
                @click="showDialog = false">取消</dy-button>
            </span>
          </el-dialog>
        </div>
        <!-- 上传文件 -->
        <template v-if="showUpload">
          <el-dialog title="上传文件"
            :visible.sync="showUpload"
            width="748px"
            modal
            custom-class="dsf_defined_dialog"
            :append-to-body="true"
            lock-scroll>
            <el-upload class="upload-demo"
              style="width:100%;text-align:center"
              drag
              ref="upload"
              :auto-upload="false"
              :action="uploadUrl"
              :headers="headers"
              :file-list="fileList"
              :on-success="successLoad"
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip"
                slot="tip"></div>
            </el-upload>
            <span slot="footer">
              <dy-button type="primary"
                @click="saveFile(),showUpload=false">确定</dy-button>
            </span>
          </el-dialog>
        </template>
        <!-- 分页 -->
        <div v-if="dataTable.length > 0"
          class="fr">
          <dy-pagination simplify
            :total="pager.total"
            :currentPage="pager.currentPage"
            :page-size-options="pager.sizes"
            show-page-size
            show-quick-jumper
            showTotal
            @page-change="handleSizeChange" />
        </div>
      </div>
      <!-- 监控表结束 -->
    </div>
  </div>
</template>

<script>
import { tableBase } from '@/utils/systemCom.js'
import systemManage from '../api' // 引入API
import permission from '@/directives/permission'

export default {
  data() {
    return {
      dataTable: [],
      pager: {
        currentPage: 1, // 当前页
        total: 0, // 列表数据总数
        sizes: [10, 20, 50] // 当前页列表数据个数
      },
      // 设置请求头
      headers: {
        'X-Auth0-Token': localStorage.getItem('tokendata')
      },
      uploadUrl: '',
      showUpload: false,
      showDialog: false,
      loading: false, // 加载动画
      hasCheckedAll: false, // 全选反选
      conf: {
        type: '', // 类型
        qiniuDomain: '', // 七牛域名
        qiniuPrefix: '', // 七牛路劲前缀
        qiniuAccessKey: '', // 七牛AccessKey
        qiniuSecretKey: '', // 七牛SecretKey
        qiniuBucketName: '', // 七牛空间名
        aliyunDomain: '', // 阿里域名
        aliyunPrefix: '', // 阿里路劲前缀
        aliyunEndPoint: '',
        aliyunAccessKeyId: '',
        aliyunAccessKeySecret: '',
        aliyunBucketName: '',
        qcloudDomain: '', // 腾讯域名
        qcloudPrefix: '', // 腾讯路劲前缀
        qcloudAppId: '',
        qcloudSecretId: '',
        qcloudSecretKey: '',
        qcloudBucketName: '',
        qcloudRegion: '', // 腾讯所属地区
        accessIP: '',
        accessPort: '',
        connectTimeout: '',
        networkTimeout: '',
        trackers: ''
      },
      form: {
        page: 1,
        limit: 10
      }, // 查询参数
      fileList: [],
      downFileUrl: '' // 下载文件地址
    }
  },
  mixins: [tableBase],
  directives: { permission },
  created() {
    this.uploadUrl = systemManage.uploadFile
    this.downFileUrl = systemManage.downFile
    this.loadOssConfig()
  },
  methods: {
    // 保存配置
    saveConfig() {
      systemManage.saveOssConfig(this.conf).then(response => {
        if (response.data.code === 0) {
          this.$ego.alertMsg('保存成功', 'success', 1000)
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 保存文件
    saveFile() {
      // 上传文件到服务器
      this.$refs.upload.submit()
    },
    // 上传文件成功
    successLoad(response) {
      if (response.code === 0) {
        this.form.page = 1
        this.form.limit = 10
        this.init(this.form)
      }
    },
    // 加载配置参数
    loadOssConfig() {
      systemManage.getOssConfig().then(response => {
        if (response.data.code === 0) {
          Object.assign(this.conf, response.data.data)
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 加载列表
    loadDataTable(params) {
      this.loading = true
      systemManage.getUploadFile(params).then(response => {
        if (response.data.code === 0) {
          this.pager.currentPage = response.data.data.currPage
          this.pager.total = response.data.data.totalCount
          this.pager.pageSize = response.data.data.pageSize
          let dataList = response.data.data.list
          if (dataList.length > 0) {
            dataList.forEach(item => {
              item.checked = false
            })
          }
          this.dataTable = dataList
          // 数据加载完成结束loding
          this.loading = false
          this.hasCheckedAll = false
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    },
    // 删除&批量删除
    delData(params) {
      systemManage.delUploadFile(params).then(response => {
        if (response.data.code === 0) {
          this.$ego.alertMsg('删除成功', 'success', 1000)
          this.form.page = 1
          this.init(this.form)
        } else {
          this.$ego.alertMsg(response.data.msg, 'danger', 1000)
        }
      })
    }
  }
}
</script>
