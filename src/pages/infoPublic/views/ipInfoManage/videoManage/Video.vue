<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div class="fl">
        <Button class="xy-primary" @click="UpClick" :disabled="isUpBtn">上传视频</Button>
      </div>
      <div class="fr">
        <Input search
          v-model="searchText"
          @on-search="FromSubmit"
          placeholder="输入视频名称"
          class="xy-content-title-search"
          style="width: auto;"
        />
      </div>
    </div>
    <div class="xy-content-body clearfix">
      <div
        class="title-describe"
      >请上传不大于500M的视频。此处最多可存储三十个视频，一个班牌只能发布一个视频，后发布的会覆盖先发布的。有播放控件的班牌才能显示此视频。</div>
      <!--初始loading-->
      <div v-if="isInitial" class="no-data-box isInitital-opacity" v-cloak>
        <img class="no-data-img" src="@/assets/common/loading.png" />
      </div>
      <!--暂无数据-->
      <div v-if="isEmpty && !isInitial" class="no-data-box" v-cloak>
        <img class="no-data-img" src="@/assets/common/nullData.svg" />
        <span class="no-data-text">暂无视频</span>
      </div>
      <!-- 视频列表 -->
      <div v-if="!isEmpty && !isInitial" v-cloak>
        <div class="video-list clearfix">
          <div v-for="(item, index) in datatable" class="video-main" :key="index">
            <div v-if="!item.Disabled" class="v-del" v-cloak>
              <icon type="ios-close" size="52" @click="vDel(item.resourceID,item.VideoName)"></icon>
            </div>
            <div class="v-top">
              <!--:poster="/image/mySchedule/mobile-my-schedule.png"-->
              <video
                class="video1"
                controls
                x5-video-player-type="h5"
                x5-video-orientation="landscape"
                style="width: 100%; height: 100%; object-fit: fill;"
                :src="item.DownloadLink"
              >
                <!-- <source />-->
              </video>
            </div>
            <div class="v-btm">
              <div class="v-tit" v-cloak>{{item.VideoName}}</div>
              <div class="v-time vsub">
                <span class="vsub-tit">上传时间：</span>
                <span class="vsub-cont" v-cloak>{{item.CreateByDate}}</span>
              </div>
              <div class="v-name vsub">
                <span class="vsub-tit">上传者：</span>
                <span class="vsub-cont" v-cloak>{{item.CreateByName}}</span>
              </div>
              <div class="clearfix">
                <Button class="xy-info fr" @click="ImportClick(item)">发布到班牌</Button>
              </div>
            </div>
          </div>
        </div>
        <div class="text-right" style="margin-top:10px;">
          <page :total="total"
            :page-size="pageSize"
            :current="pageCurrent"
            :page-size-opts="pages"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></page>
        </div>
      </div>
      <ToReleaseTask
        :taskCreate="taskCreate"
        :publicItem="publicItem"
        :taskList="taskList"
        @changeDate="changeDate"
        @closeTaskModal="closeTaskModal"></ToReleaseTask>
      <!-- 导入设置 -->
      <modal class-name="my-modal-parent"
        v-model="modalImport"
        title="上传视频"
        :transfer="false"
        :closable="true"
        :mask-closable="false"
        :loading="loading"
        @on-ok="UpVideoOk"
        ok-text="确定"
        @on-cancel="UpVideoCancel"
        v-cloak
      >
        <Form ref="formUpVideoOK" :model="formUpVideoOK" :rules="ruleUpVideoOK">
          <FormItem label="视频名称" prop="videoName" labelFor="videoName" :label-width="80">
            <Input v-model="formUpVideoOK.videoName" elementId="videoName" clearable />
          </FormItem>
          <div style="text-align:center;">
            <!-- <upload ref="uploadImport"
                    v-show="isShowUpload"
                    type="drag"
                    :multiple="isMultiple"
                    :show-upload-list="true"
                    :headers="{'Access-Control-Allow-Origin' : '*','Access-Control-Allow-Credentials':true }"
                    :format="formtData"  :accept="fileAccept"
                    :max-size="fileSize"
                    :on-format-error="formatError"
                    :on-exceeded-size="sizeError"
                    :before-upload="beforeUpload"
                    :on-success="success"
                    :data="upParams"
                    :on-error="error"
                    :action="upUrl">
                <div style="padding: 20px 0">
                    <icon type="ios-cloud-upload" size="52" style="color: #3399ff"></icon>
                    <p>点击上传或拖拽文件上传</p>
                </div>
            </upload> -->
            <XyUpfile
              :fileAccept="fileAccept"
              ref="upfile"
              :fileSize="size"
              :importPath="upUrl"
              :showUpList="true"
              @UploadOk="UploadOk"
              :fileList='fileList'
              >
            </XyUpfile>
            <div v-if="loadSuccess && fileShowNameDiv">
              <span>{{fileShowName}}</span>
            </div>
          </div>
        </Form>
      </modal>
    </div>
  </div>
</template>

<script>
  import XyUpfile from '@/components/upFileOptimize/upFileDrag.vue'
  import ToReleaseTask from '@/pages/infoPublic/components/ToReleaseTask.vue'
  export default {
    name: 'Video',
    inject: ['reload'],
    components: {
      ToReleaseTask, XyUpfile
    },
    data () {
      return {
        loadSuccess: false,
        fileShowName: '',
        // fileAccept: '',
        isMultiple: true,
        XYcookie: this.xy.getCookie('.XYTOKEN'),
        modalImport: false,
        isShowSpin: false,
        isShowUpload: true,
        uploadSuccess: false, //  上传成功
        showUploadList: true, //  是否显示上传文件列表
        importResult: {},
        importResultAll: {},
        xyCookie: '',
        taskList: [],
        hasPage: true,
        // 默认数据
        isEmpty: false, // 数据是否为空
        isEmptyPage: false, // 显示分页
        isInitial: true,
        loading: true,
        // 搜索
        searchText: '',
        total: 0, // 总条数
        pageCurrent: 1,
        pageSize: 15, // 每页显示条数
        pages: [15, 30, 50, 100],
        // pagen: this.xy.table.pages,
        pagen: [10, 15, 50, 100],
        pageIndex: 1, // 当前页码
        pageList: 0, // 当前页数据条数
        datatable: [],
        // 是否上传
        isUpBtn: false,

        // 导入设置

        typeBtn: true,
        // 上传视频
        fileShowNameDiv: false,
        title: '上传视频',
        tipData: [],
        formtData: ['mp4'],
        fileSize: 512000,
        // upUrl: '',
        upParams: {},
        file: null,
        fileName: '',
        UploadList: [],
        formUpVideoOK: {
          videoName: ''
        },
        ruleUpVideoOK: {
          videoName: [
            { required: true, message: '视频名称不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 20,
              message: '视频名称不能超过20个字',
              trigger: 'blur'
            }
          ]
        },

        // 新建发布任务---开始
        taskCreate: false,
        formValidateTaskOK: {
          publicName: ''
        },
        ruleValidateTaskOK: {
          publicName: [
            { required: true, message: '任务名称不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 20,
              message: '任务名称不能超过20个字',
              trigger: 'blur'
            }
          ]
        },
        getTreeList: [
          {
            title: '全部分组',
            expand: true,
            selected: false,
            ParentID: -1,
            ClassTerminalGroupID: 0,
            children: [],
            TreminalS: []
          }
        ],
        tremianlArr: [],
        classTerminalIDs: [],
        publicItem: {},
        viewUrl: '',
        ids: '',
        // 上传资源优化
        fileAccept: '.mp4',
        size: 500,
        upUrl: this.$store.state.apiPath + '/api/Resource/UploadVideoVerifiCation',
        imgList: [],
        fileList: []
      }
    },
    created () {
      this.upUrl = this.$store.state.apiPath + '/api/Resource/UploadVideoVerifiCation'
      this.viewUrl = `${this.xyViewUrl}`
      this.getList(1, 15)
    },
    mounted () {
      // 不显示上传按钮，显示自定义上传区域
    },
    methods: {
      UploadOk (list) {
        // 获取最终生成的需要提交的数据格式
        console.log(list)
        this.imgList = list
        this.UpVideoOk()
      },
      closeTaskModal (val) {
        this.taskCreate = false
        this.publicItem = {}
        this.taskList = []
      },
      modalChange (status) {
        if (status) {
          this.isShowUpload = true
          this.uploadSuccess = false
        }
      },
      beforeUpload (res) {
        this.isShowSpin = true
      },
      formatError (file, fileList) { // 文件格式验证失败时
        this.isShowSpin = false
        this.xy.msgError('文件格式不正确。')
      },
      sizeError () { // 文件超出指定大小限制时
        this.isShowSpin = false
        this.$refs.uploadImport.clearFiles()
        this.xy.msgError('文件超出500M大小限制。')
      },
      success (res) {
        console.log(res)
        this.importResult = res.data
        this.importResultAll = res
        this.isShowSpin = false
        this.$refs.uploadImport.clearFiles()
        if (res.code === 1) {
          // this.modalImport = false
          // this.isShowUpload = false // 是否展示上传控件
          this.loadSuccess = true
          this.fileShowName = res.data
          this.fileShowNameDiv = true
          this.uploadSuccess = true // 上传成功展示的样式
          this.showUploadList = true // 显示上传文件列表
          // if (this.modalSubmit !== undefined) { // callback
          //   this.modalSubmit(res.data)
          // }
          this.xy.msgSuc('成功。')
        } else if (res.errorcode === 'rowError') {
          this.isShowUpload = false // 是否展示上传控件
          this.uploadSuccess = false // 上传成功展示的样式
          this.showUploadList = false // 显示上传文件列表
        } else if (res.errorcode === 'fileError') {
          this.isShowUpload = true // 是否展示上传控件
          this.showUploadList = false // 显示上传文件列表
          this.xy.msgError(res.msg)
        } else if (res.errorcode === 'taskError' || res.errorcode === 'mscorlib' || (typeof (res.data)) === 'string') {
          // 导入异常了
          this.isShowUpload = false // 是否展示上传控件
          this.showUploadList = false // 显示上传文件列表
        } else {
          if (res.data !== null && res.data !== '') {
            if (res.data.scount > 0) {
              if (this.modalSubmit !== undefined) { // callback
                this.modalSubmit(res.data)
              }
            } else {
              this.isShowUpload = false // 是否展示上传控件
            }
          } else {
            this.isShowUpload = true // 是否展示上传控件
            this.xy.msgError(res.msg)
          }
          this.uploadSuccess = false // 上传成功展示的样式
          this.showUploadList = false // 显示上传文件列表
        }
      },
      error (file, fileList) {
        this.isShowSpin = false
        this.xy.msgError('Error。')
        this.$refs.uploadImport.clearFiles()
      },

      // 获取页面视频 getList
      async getList (pageCurrent, pageSize) {
        this.pageindex = pageCurrent
        let res = await this.xy.get(
          `${this.$store.state.apiPath}/api/Resource/GetVideoByPage`,
          {
            SearchText: this.searchText,
            PageIndex: pageCurrent,
            PageSize: pageSize
          }
        )
        if (res.success) {
          this.isEmpty = false
          this.isInitial = false
          if (res.data.data != null && res.data.data.length > 0) {
            this.datatable = res.data.data
            this.total = res.data.totalRecords
            this.pageList = res.data.data.length
            this.isEmpty = false
            if (this.total < 30) {
              this.isUpBtn = false
            } else {
              this.isUpBtn = true
            }
            if (this.datatable.length > 0) {
              this.isEmptyPage = true
            } else {
              this.isEmptyPage = false
            }
          } else {
            this.isEmpty = true
            this.isEmptyPage = false
          }
          if (this.hasPage) {
          // this.Page()
          }
        } else {
          this.isEmpty = true
          // this.xy.msgSuc(res.msg)
          this.xy.msgError(res.Errmsg)
          this.hasPage = false
        }
        this.xy.unloading()
      },
      // // 调用分页(Page)组件
      // Page() {
      //   this.xy.http.load(this.xy.webUrl + '/View/components/View/Page.html', {
      //     targetID: 'Page',
      //     loadParams: {
      //       'total': this.total,
      //       'pageCurrent': this.pageindex, // 当前页码
      //       'pageSize': this.pageSize, // 每页显示条数
      //       'pages': this.pagen// 每页条数切换的配置
      //     }
      //   })

      //   console.log(this.pageindex)
      // },

      // 删除
      vDel (ids, name) {
        this.ids = ids
        this.xy.confirm('删除', '您确认要删除"' + name + '"吗？', this.delOk)
      },
      delOk () {
        this.xy.loading()
        // 删除接口  api/Resource/DeleteVideo/{id}
        this.xy
          .post(this.$store.state.apiPath + `/api/Resource/DeleteVideo?id=` + this.ids, {})
          .then(res => {
            if (res.success) {
              this.xy.unloading()
              // this.xy.message.success(this, '删除成功！')
              this.xy.msgSuc('删除成功。')
            } else {
              this.xy.unloading()
              // this.xy.message.error(this, res.msg)
              this.xy.msgError(res.msg)
            }
            this.modal_loading = false
            if (this.hasPage) {
              // this.Page()
            }
          }).finally(() => {
            this.getList(1, 15)
          })
      },
      // 搜索
      FromSubmit () {
        this.pageCurrent = 1
        this.getList(this.pageCurrent, this.pageSize)
      },

      // 单击页码触发
      changePage (current) {
        this.pageCurrent = current
        this.getList(current, this.pageSize)
      },

      // 单击切换每页展示条数触发
      changePageSize (size) {
        this.pageSize = size
        this.getList(1, size)
      },

      // 提交创建时触发
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },

      // 导入开始---

      // 导入视频
      UpClick () {
        this.modalImport = true
        this.fileShowNameDiv = false
        this.taskCreate = false
        this.fileList = []
        // this.upUrl = `${this.xyWebUrl}${this.xyUploadUrl}?uploadSubPath=ResourceVideo/${localStorage.getItem('accountId')}&token=${this.xyUploadToken}`
      },

      // 保存视频名称
      UpVideoOk () {
        this.$refs.formUpVideoOK.validate(valid => {
          if (!valid) {
            return this.changeLoading()
          } else {
            this.xy
              .post(`${this.$store.state.apiPath}/api/Resource/CreateVideo`, {
                FileName: this.imgList[0].FileName,
                ResourceSize: this.imgList[0].ResourceSize,
                VideoName: $.trim(this.formUpVideoOK.videoName)
              })
              .then(res => {
                if (res.success) {
                  this.file = null
                  this.changeLoading()
                  // this.xy.message.success(this, { content: '上传成功！' })
                  this.xy.msgSuc('上传成功。')
                  this.modalImport = false
                  this.fileName = ''
                  this.UploadList = []
                  this.fileList = []
                  this.$refs.formUpVideoOK.resetFields()
                  this.reload()
                  this.getList(this.pageCurrent, this.pageSize)
                } else {
                  this.modal_loading = false
                  this.xy.msgError(res.msg)
                  this.modalImport = false
                  this.$refs.formUpVideoOK.resetFields()
                }
              })
          }
        })
      },

      // 点击取消
      UpVideoCancel () {
        this.reload()
        this.UploadList = []
        this.modalImport = false
        this.$refs.formUpVideoOK.resetFields()
      },

      // 导入结束---

      // 发布到指定班牌---新建发布任务---开始
      // 打开发布任务框
      ImportClick (row) {
        this.publicItem = row
        this.taskCreate = true
        this.taskList.push(row.resourceID) // 所要发布的ID
      },
      // 发送到班牌
      changeDate () {
        this.taskCreate = false // 开启弹框
        this.taskList = [] // 所要发布的ID
        this.publicItem = {} // 所要发布的类型
      },
      // 确定提交
      submitPublic () {
        let ids = []
        if (this.classTerminalIDs.length > 0) {
          for (let i = 0; i < this.classTerminalIDs.length; i++) {
            ids.push(this.classTerminalIDs[i].ClassTerminalID)
          }
          this.$refs.formValidateTaskOK.validate(valid => {
            if (!valid) {
              return this.changeLoading()
            } else {
              this.xy
                .post(this.$store.state.apiPath + `/api/PublicTask/CreatePublicTask`, {
                  PublishTaskName: $.trim(this.formValidateTaskOK.publicName),
                  PublishTaskType: this.publicItem.resourceType, // 资源类型8
                  ClassTerminalID: ids, // 班牌ID
                  ResourceID: [this.publicItem.resourceID] // 资源ID
                })
                .then(res => {
                  if (res.success) {
                    this.xy.msgSuc('操作成功，可去发布任务记录查看发布详情。')
                    this.publicName = ''
                    this.tremianlArr = [] // 中间空
                    this.classTerminalIDs = [] // 右侧空
                    this.taskCreate = false
                    this.getTreeList[0].selected = false
                    this.$refs.formValidateTaskOK.resetFields()
                    this.getList(1, this.pageSize)
                  } else {
                    this.xy.msgError('请勾选班牌后再发布。')
                    this.changeLoading()
                  }
                })
            }
          })
        } else {
          this.xy.msgError('请勾选班牌后再发布。')
          this.changeLoading()
        }
      },

      publicCancel () {
        this.$refs.formValidateTaskOK.resetFields()
        this.tremianlArr = [] // 中间空
        this.classTerminalIDs = [] // 右侧空
        this.taskCreate = false
        this.getTreeList[0].selected = false
        this.$refs.formValidateTaskOK.resetFields()
      }
    // 发布到指定班牌---新建发布任务---结束
    }
  }
</script>

<style lang="less" scoped>
.my-modal-parent {
  z-index: 900;
}
.my-modal-parent_body .ivu-modal-mask {
    z-index: 900;
}
.video-list {
  margin-top: 15px;
  width: 100%;
}

.video-list > .video-main {
  background: #fff;
  width: 300px;
  margin: 0 10px 15px;
  float: left;
  position: relative;
  transition: all ease 0.5s;
}
.video-list > .video-main:hover {
  transition: all ease 0.5s;
  box-shadow: 6px 7px 30px #dadada;
}

.video-list > .video-main > .v-del {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 99;
}

.video-list > .video-main > .v-del > i {
  cursor: pointer;
  transform: rotate(0deg);
  color: #fff;
  transition: all ease 0.3s;
}

.video-list > .video-main > .v-del > i:hover {
  transition: all ease 0.3s;
  transform: rotate(180deg);
  color: #ccc;
}

.video-list > .video-main > .v-top {
  width: 100%;
  height: 180px;
  background: #ccc;
  cursor: pointer;
}

.video-list > .video-main > .v-btm {
  border-left: 1px solid #eee;
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
  padding: 15px 12px;
}

.video-list > .video-main > .v-btm > .v-tit {
  height: 40px;
  line-height: 20px;
  font-size: 16px;
  color: #333;
  overflow: hidden;
  cursor: pointer;
}

.video-list > .video-main > .v-btm > .vsub {
  line-height: 18px;
  color: #666;
  margin-top: 5px;
}

</style>
