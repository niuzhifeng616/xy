<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <div style="width: 700px;margin:0 auto">
        <Form ref="fileForm" :model="fileForm" :rules="rules" :label-width="160">
        <FormItem label="文件名" prop="fileName">
          <Input v-model.trim="fileForm.fileName" :disabled='isEdit' placeholder="请输入文件名" />
        </FormItem>
        <!-- 已发布不能编辑上传文件 -->
        <FormItem label="文件名" prop="fileName" v-if='isEdit'>
          <p>{{fileForm.uploadFile}}</p>
        </FormItem>
        <FormItem v-else label="上传签字文件" prop="uploadFile" class="default_style">
          <div style="text-align:left">
            <Upload :action="upload" type="drag" name="upfile"
                    :headers="{'Access-Control-Allow-Origin' : '*','XYTOKEN':xy.getCookie('.XYTOKEN') }"
                    :show-upload-list="false"
                    :format="['docx']"
                    :on-format-error="formatError"
                    :on-success="UploadSuccess"
                    :before-upload='BeforeUpload' :max-size="5* 1024"
                    :on-exceeded-size="handleMaxSize">
              <div style="padding: 20px 0">
                <icon type="ios-cloud-upload" size="52" style="color: #3399ff"></icon>
                <p>点击上传或拖拽文件上传</p>
              </div>
            </Upload>
            <p>发布文件必须使用模板 ,文件大小不能超过5Mb。</p>
            <div v-if="fileForm.uploadFile">
              文件名称: {{ fileForm.uploadFile }}
              <Icon @click="DelUploadSignFile" type='ios-trash'
                    custom='xy-table-del-btn xy-table-del-hover' title='删除'></Icon>
            </div>
            <Button class="xy-info" @click="DownloadTemplate">下载模板</Button>
          </div>
          <spin fix v-if="isShowSpin">上传中...</spin>
        </FormItem>
        <FormItem label="发布到" prop="publishClass" class="default_style">
          <i-button class="xy-primary" size="small" v-if="pageType!=='publish'" @click="openAddModal">
            添加学生
          </i-button>
          <span v-if="fileForm.publishClass.length" style="padding: 6px 15px 6px 15px;font-size: 14px;">
                        已选： {{fileForm.publishClass.length}} 人
                    </span>
          <Select v-model="fileForm.publishClass" multiple v-show="false">
            <Option :value="0" >0</Option>
          </Select>
        </FormItem>
        <FormItem label="签字截止时间" prop="date">
          <DatePicker :clearable="false" date-picker type="date" placeholder="选择签字截止时间" :options="optionsDate"
            :value="fileForm.date" format="yyyy/MM/dd" :editable="false"
            @on-change="noticeDateChange">
          </DatePicker>
        </FormItem>
        <FormItem label="自动提示">
          <Checkbox label="fileForm.isRemind" v-model="fileForm.isRemind"
            @change.native='changeTime'>设置：到截止时间前
          </Checkbox>
          <InputNumber :min="0" v-model="fileForm.time" :disabled='!fileForm.isRemind' style="width:50px"
            class="remindTime" :editable="false"></InputNumber>
          小时，对未签字确认的用户自动发消息进行提醒。
        </FormItem>
        <FormItem style="text-align:center">
          <Button class="xy-info" v-show="pageType!=='publish'" @click="create('存草稿')"
            style="margin-right: 20px">存草稿
          </Button>
          <Button class="xy-info" @click="preview" v-if='fileForm.uploadFile.length!==0'>预览</Button>
          <Button class="xy-primary" @click="create('publish')">{{pageType==='publish'?'确认':'确认发布'}}</Button>
        </FormItem>
      </Form>
      </div>
    </div>
    <SelectStudent
      :isShow="isShow"
      :teachers="teachersData"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm"
    >
    </SelectStudent>
    <Modal
      v-model="previewModal"
      :styles="{top:'20px',width:'800px'}"
      title="预览"
      :transfer="false"
      :mask-closable="false"
      >
      <div class="text">
        <div v-html='tag'></div>
      </div>
        <div slot="footer">
          <Button class="xy-modal-primary" @click="cancel" shape="circle">关闭</Button>
        </div>
      </Modal>
  </div>
</template>
<script>
  import SelectStudent from '@/components/selectStudent/SelectStudent.vue'
  function validateDate (rule, value, callback) {
    if (value === '') {
      callback(new Error('截止时间不能为空。'))
    } else {
      if (new Date(value).getTime() < new Date().getTime()) {
        callback(new Error('截止时间不能在当前时间之前。'))
      }
      callback()
    }
  }
  function validatePeopel (rule, value, callback) {
    if (value.length === 0) {
      callback(new Error('请选择学生。'))
    } else {
      callback()
    }
  }

  export default {
    name: 'FileSignList',
    components: {
      SelectStudent
    },
    data () {
      return {
        tag: '',
        previewList: [],
        previewModal: false,
        isShow: false,
        checkAllList: [],
        apiPath: '',
        params: {
          SignFileID: ''
        },
        pageType: 'add', // add 新增页面  publish  已发布的页面   unpublish 未发布页面
        upload: '',
        fAlert: false,
        searchName: '',
        isShowSpin: false,
        isEdit: false,
        fileForm: {
          fileName: '', // 文件名称
          uploadFile: '', // 文件名称
          filePath: '', // 上传文件的路径
          publishClass: [], // 选择的学生
          date: '', // 截止日期
          isRemind: false,
          time: 0 // 截止时间前几小时
        },

        rules: {
          fileName: [
            { required: true, message: '文件名称不能为空', trigger: 'blur' },
            { type: 'string', max: 30, message: '文件名称最多可输入30个字符', trigger: 'blur' }
          ],
          publishClass: [{ required: true, validator: validatePeopel, message: '请选择学生', trigger: 'change' }],
          uploadFile: [{ required: true, message: '请上传文件', trigger: 'change', type: 'string' }],
          date: [{ validator: validateDate, trigger: 'change' }]
        },
        optionsDate: {},
        teachersData: [],
        teachersDataLength: false
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.upload = this.apiPath + '/api/SignFileManage/UploadSignFile'
      this.pageType = this.$route.query.type
      if (this.pageType !== 'add') {
        this.isEdit = this.pageType === 'publish'
        this.getRow()
      } else {
        this.checkAllList = []
      }
      this.optionsDate = {
        disabledDate: (date) => {
          if (this.isEdit) {
            this.endTime = this.params.EndTime
            return date && date.valueOf() <= new Date(this.endTime)
          } else {
            return date && date.valueOf() < Date.now() - 86400000
          }
        }
      }
    },
    methods: {
      openAddModal () {
        this.isShow = true
      },
      selectCancel () {
        if (this.fileForm.state !== 1 && this.teachersDataLength === false) {
          this.teachersData = []
        }
        this.isShow = false
      },
      selectConfirm (data) {
        if (this.$route.query.type === 'add') {
          this.teachersDataLength = true
        }
        this.isShow = false
        this.checkAllList = [...data]
        this.fileForm.publishClass = this.checkAllList
        this.teachersData = [...this.checkAllList]
      },
      // 编辑时获取数据
      async getRow () {
        let params = {
          SignFileID: this.$route.query.row
        }
        let rs = await this.xy.get(this.apiPath + '/api/SignFileManage/GetSignFileByID', params)
        if (rs.success) {
          let result = rs.data
          this.optionsDate = {
            disabledDate: (date) => {
              if (this.isEdit) {
                this.endTime = rs.data.EndTime
                return date && date.valueOf() <= new Date(this.endTime)
              } else {
                return date && date.valueOf() < Date.now() - 86400000
              }
            }
          }
          let stuids = []
          this.teachersData = result.StudentIDs.map((teachers) => {
            return {
              FullName: teachers.Name,
              UserID: teachers.ID,
              singleCheck: teachers.Checked
            }
          })
          this.checkAllList = this.teachersData
          result.StudentIDs.map((item) => {
            stuids.push(item.ID)
          })
          this.fileForm = {
            SignFileID: result.SignFileID,
            fileName: result.SignFileName, // 手写的文件名称
            uploadFile: result.OriginalFileName, // 上传的文件名称
            filePath: result.SignFilePath,
            publishClass: stuids, // 选择的学生
            date: this.xy.moment(result.EndTime).format('YYYY-MM-DD'), // 截止日期
            isRemind: result.AutoNotify, // 是否开启自动提醒
            time: result.AutoNotifyTime, // 截止时间前几小时
            state: result.State
          }
          if (result.State === 1) {
            this.pageType = 'unPublish'
            this.isEdit = false
          } else if (result.State === 2) {
            this.pageType = 'publish'
            this.isEdit = true
          }
        }
      },
      // 确定发布
      create (val) {
        if (this.pageType === 'publish') {
          this.editPublish()
          return
        }
        this.$refs.fileForm.validate((valid) => {
          let time1 = new Date(this.fileForm.date).getTime()
          let time2 = parseInt(this.fileForm.time) * 60 * 60 * 1000
          if (time1 - time2 < new Date().getTime()) {
            this.xy.msgW('选择的截止时间无效。')
            return
          }
          if (valid) {
            this.postCreate(val)
          } else {
            this.xy.msgError('请检查填写。')
          }
        })
      },
      async postCreate (val) {
        this.xy.loading()
        let StudentIDs = []
        this.checkAllList.map((item) => {
          StudentIDs.push(item.UserID)
        })
        let params = {
          SignFileID: this.fileForm.SignFileID,
          SignFileName: this.fileForm.fileName,
          OriginalFileName: this.fileForm.uploadFile,
          SignFilePath: this.fileForm.filePath,
          StudentIDs: StudentIDs,
          EndTime: this.fileForm.date,
          AutoNotify: this.fileForm.isRemind,
          AutoNotifyTime: parseInt(this.fileForm.time) || 0
        }
        let rs = await this.xy.post(this.apiPath + '/api/SignFileManage/Save', params)
        this.xy.unloading()
        if (rs.success) {
          if (val === '存草稿') {
            this.$router.back()
          } else {
            // 创建成功后请求接口发布
            let id = this.pageType === 'add' ? rs.data.result : params.SignFileID
            this.publish(id)
          }
        }
      },
      // 请求接口发布 新增或者未发布 状态下
      async publish (CreatFileID) {
        let rs = await this.xy.post(this.apiPath + '/api/SignFileManage/Publish?SignFileID=' + CreatFileID)
        if (rs.success) {
          this.xy.msgSuc('发布成功。')
          this.$router.go(-1)
        }
      },

      // 已发布的确认发布
      async editPublish () {
        let time1 = new Date(this.fileForm.date).getTime()
        if (this.fileForm.time > 0) {
          let time2 = parseInt(this.fileForm.time) * 60 * 60 * 1000
          if (time1 - time2 < new Date().getTime()) {
            this.xy.msgW('选择的截止时间无效。')
            return
          }
        }
        let params = {
          SignFileID: this.fileForm.SignFileID,
          EndTime: this.fileForm.date,
          AutoNotify: this.fileForm.isRemind,
          AutoNofityTime: parseInt(this.fileForm.time) || 0
        }

        let rs = await this.xy.post(this.apiPath + '/api/SignFileManage/Modify', params)
        if (rs.success) {
          this.xy.msgSuc('发布成功。')
          this.$router.go(-1)
        }
      },
      noticeDateChange: function (val) {
        this.fileForm.date = val
      },
      // ------------------文件上传--------------------

      handleMaxSize: function () {
        this.isShowSpin = false
        this.xy.msgError('文件不能超过5Mb。')
      },
      formatError: function (file, fileList) {
        this.isShowSpin = false
        this.xy.msgError('文件格式不正确。')
      },
      // 上传成功
      UploadSuccess: function (res) {
        if (res.success) {
          this.isShowSpin = false
          this.xy.msgSuc('上传成功。')
          this.fileForm.filePath = res.data.result.SignFilePath // 真实的文件路径
          this.$set(this.fileForm, 'uploadFile', res.data.result.OriginalFileName) // 显示的文件名称
        } else {
          this.isShowSpin = false
          this.xy.msgError(res.msg)
        }
      },
      // 删除上传文件
      async DelUploadSignFile (res) {
        let rs = await this.xy.post(this.apiPath + '/api/SignFileManage/DelUploadSignFile?FileName=' + this.fileForm.filePath)
        if (rs.success) {
          this.fileForm.uploadFile = ''
          this.fileForm.filePath = ''
          this.xy.msgSuc('删除成功。')
        }
      },
      BeforeUpload (res) {
        this.isShowSpin = true
      },
      // 模板下载
      DownloadTemplate () {
        this.xy.downFile(this.apiPath + '/api/SignFileManage/GetTmpFile')
      },
      // ------------------文件上传end--------------------
      cancel () {
        this.previewModal = false
      },
      preview () {
        if (!this.fileForm.uploadFile) {
          this.msgW(this, '请先上传文件。')
          return false
        }
        this.previewModal = true
        this.fileForm.StudentIDs = this.checkAllList
        if (this.pageType === 'add') {
          this.fileForm.publishClass = this.checkAllList.map((item) => {
            return item.UserID
          })
        }
        this.getPreview()
      },
      async getPreview () {
        let id = this.pageType === 'add' ? '' : this.fileForm.SignFileID
        // 新增页面不需要传递SignFileId，其他都需要
        let params = {
          SignFileId: id,
          FileName: this.fileForm.filePath
        }
        let rs = await this.xy.get(this.apiPath + '/api/SignFileManage/GetPreviewFileData', params)
        if (rs.success) {
          this.previewList = rs.data
          this.setFormat()
        }
      },
      // 设置预览格式
      setFormat () {
        let arr = []
        this.tag = ''
        this.previewList.forEach((item) => {
          if (item.IsTable) {
            let style = ''
            let tableObj = item.Tables
            for (var key in tableObj.LayoutStyle) {
              if (tableObj.LayoutStyle[key]) {
                var attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                attrs = attrs.replace(/([A-Z])/g, '-$1').toLowerCase() // 将大驼峰改为css属性名格式
                style += attrs + ':' + tableObj.LayoutStyle[key] + ';'
              }
            }
            let tableRows = item.Tables.TRows
            let rows = ''
            let columns = ''
            let columnStyle = ''
            if (tableRows.length > 0) {
              tableRows.forEach((row) => {
                columns = ''
                row.forEach(function (column) {
                  for (let key in column.LayoutStyle) {
                    if (column.LayoutStyle[key]) {
                      var attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                      attrs = attrs.replace(/([A-Z])/g, '-$1').toLowerCase()

                      columnStyle += attrs + ':' + column.LayoutStyle[key] + ';'
                    }
                  }
                  // 如果文本为null  字体显示为白色
                  if (!column.Text || column.Text == null) {
                    if (column.FontStyle) {
                      column.FontStyle.color = '#fff'
                    } else {
                      column.FontStyle = { color: '#fff' }
                    }
                  } else {
                    column.FontStyle.color = 'black'
                  }

                  for (let key in column.FontStyle) {
                    if (column.FontStyle[key]) {
                      let attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                      attrs = attrs.replace(/([A-Z])/g, '-$1').toLowerCase()
                      columnStyle += attrs + ':' + column.FontStyle[key] + ';'
                    }
                  }
                  columns += '<td style="' + columnStyle + '">' + column.Text + '</td>'
                })
                rows += '<tr>' + columns + '</tr>'
              })
            }
            arr.push('<table  style=' + style + '>' + rows + '</table>')
          } else if (item.IsImage) {
            // 图片格式类似于： <div  style=""><image/></div>
            let style = ''
            for (let key in item.LayoutStyle) {
              if (item.LayoutStyle[key]) {
                let attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                attrs = attrs.replace(/([A-Z])/g, '-$1').toLowerCase() // 将大驼峰改为css属性名格式
                style += attrs + ':' + item.LayoutStyle[key] + ';'
              }
            }
            for (let key in item.FontStyle) {
              if (item.FontStyle[key]) {
                let attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                attrs = attrs.replace(/([A-Z])/g, '-$1').toLowerCase()
                style += attrs + ':' + item.FontStyle[key] + ';'
              }
            }
            let img = ''
            // let imgStyle
            // 每张图片的格式
            if (item.Images.length > 0) {
              item.Images.forEach((every) => {
                //  imgStyle = ''
                for (let key in every.ImgStyle) {
                  if (every.ImgStyle[key]) {
                    // let attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                    //   imgStyle += attrs + ':' + every.ImgStyle[key] + ';'
                  }
                }
                for (let key in every.LayoutStyle) {
                  if (every.LayoutStyle[key]) {
                    let attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                    attrs = attrs.replace(/([A-Z])/g, '-$1').toLowerCase()
                    //  imgStyle += attrs + ':' + every.LayoutStyle[key] + ';'
                  }
                }

                // img += '<image  style="' + '\"' + imgStyle + '\"' + '&nbsp; src=\"' + every.Src + '\"' + '"/>'
                img += `<image  style="width:100%;height:50%;" src="${this.xyApi}/base${every.Src}"/>`
              })
            }
            arr.push('<div  style="' + style + '">' + img + '</div>')
          } else {
            let style = ''
            for (let key in item.LayoutStyle) {
              if (item.LayoutStyle[key]) {
                let attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                attrs = attrs.replace(/([A-Z])/g, '-$1').toLowerCase() // 将大驼峰改为css属性名格式
                style += attrs + ':' + item.LayoutStyle[key] + ';'
              }
            }
            if (!item.Text || item.Text == null) {
              if (item.FontStyle) {
                item.FontStyle.color = '#fff'
              } else {
                item.FontStyle = { color: '#fff' }
              }
            }
            for (let key in item.FontStyle) {
              if (item.FontStyle[key]) {
                let attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                attrs = attrs.replace(/([A-Z])/g, '-$1').toLowerCase()

                style += attrs + ':' + item.FontStyle[key] + ';'
              }
            }

            arr.push('<p  style="' + style + '">' + (item.Text === '签字确认：{$}' ? '签字确认：<span class=\'sign-name\'>您的签字将在此处展示</span>' : item.Text) + '</p>')
          }
        })
        arr.forEach((item) => {
          this.tag += item
        })
      },
      changeTime () {
        if (!this.fileForm.isRemind) {
          this.fileForm.time = 0
        }
      }
    }
  }
</script>
<style lang="less" scpoed>
.image {
    width: 412px;
    height: 840px;
  }

  .text {
    width: 300px;
    height: 568px;
    background: url('./img/preview.png') no-repeat center;
    background-size: 100% 100%;
    margin: 0 auto;
    padding: 20px;
  }

  .text > div {
    width: 251px;
    text-align: left;
    margin: 15px auto;
    max-height: 476px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 0px;
  }

  .sign-name {
    color: red;
  }

</style>
