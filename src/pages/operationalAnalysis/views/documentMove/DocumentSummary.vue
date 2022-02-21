<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-center xy-between">
        <div class="xy-flex">
          <div class="xy-content-title-search">
              <span>状态：</span>
              <i-select v-model="status" @on-change="DocumentStatusypeSearch" style="width:150px;">
                  <i-option :value="0" :key="0">全部</i-option>
                  <i-option v-cloak v-for="types in DocumentStatusype" :value="types.statusID" :key="types.statusID">{{ types.status }}</i-option>
              </i-select>
          </div>
          <div class="xy-content-title-search">
              <span>时间筛选：</span>
              <date-picker type="daterange" format="yyyy-MM-dd" :value="dataArr"  :editable="false" @on-change="datesChange" placeholder="请选择发起时间日期" style="width: 250px;"></date-picker>
          </div>
          <div class="xy-content-title-search">
              <i-input search v-model="searchT" @on-search="FromSubmit" placeholder="请输入主题/发文字号/发起人" style="width: 272px;">
                  <icon type="ios-search cursor-p" slot="suffix" />
              </i-input>
          </div>
        </div>
    </div>
    <div class="xy-content-body">
        <XyAntTable
          :columns="columns"
          :dataSource="docAll"
          :nullData="txt"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="1250"
          >
          <!-- 公文种类 -->
          <div slot="DocumentTypeName" slot-scope="text, record">
            {{record.DocumentTypeName}}
          </div>
          <!-- 主题 -->
          <div style="min-width: 540px" slot="Title" slot-scope="text, record">
            <span
              v-html="record.Title"
              class="ant-table-cell table-el-hover"
              style="display: inline-block"
              @click="edit(record)"
              >
            </span>
          </div>
          <!-- 发起时间 -->
          <div slot="CreatedTime" slot-scope="text, record">
            {{xy.moment(record.CreatedTime).format('YYYY-MM-DD HH:mm')}}
          </div>
          <!-- 状态 -->
          <span slot="DocumentStatus" slot-scope="text, record">
            <span v-if="record.DocumentStatus===1">
              <i class="iconfont icon-info">&#xe719;</i>{{record.DocumentStatusName}}</span>
            <span v-if="record.DocumentStatus===2 || record.DocumentStatus===4">
              <i class="iconfont icon-end">&#xe719;</i>{{record.DocumentStatusName}}</span>
            <span v-if="record.DocumentStatus===16 || record.DocumentStatus === 8">
              <i class="iconfont icon-default">&#xe719;</i>{{record.DocumentStatusName}}</span>
          </span>
          <!-- 操作 -->
          <span slot="oprateRender" slot-scope="text, record">
            <a @click="edit(record)">详情</a>
          </span>
        </XyAntTable>
        <modal v-model="modalCreateType" :transfer="false" title="添加批复" :mask-closable="false">
          <div class="dialog-model-content">
              <Form ref="formValidateAdd" @on-validate='validate' :model='formValidateAdd' @submit.native.prevent :rules="ruleValidateCreate">
                <FormItem prop='textValue'>
                      <Input :rows='8' maxlength="300" type="textarea" placeholder="请输入批复内容" style="font-size:14px" v-model="formValidateAdd.textValue" />
                </FormItem>
                      <div class="replyFoot">
                        <i-button icon="ios-cloud-upload-outline" class="pr">
                          <input type="file" ref="fileAll" multiple="multiple" @change="changeFunc($event)" class="pa cursor-p" style="top:0;left:0;width:100%;height:100%;opacity:0;">
                          附件
                        </i-button>
                        <span>{{formValidateAdd.textValue.length}}/300</span>
                      </div>
                <FormItem prop='fileList'>
                  <div class="fileBox">
                    <template v-for="(item,index) of formValidateAdd.filesList">
                      <div :key="index" class="files-flex" ref="filesDom">
                        <div class="files-flex-text nowrap">
                          <i class="iconfont iconimg" v-if="item.type.indexOf('image')>-1">&#xe705;</i>
                          <i class="iconfont icontext" v-else>&#xe706;</i>
                          <span>{{item.name}}</span>
                        </div>
                        <Icon @click="delFiles(index)" type="md-close-circle" color="#F5222D" size="22" />
                      </div>
                    </template>
                  </div>
                </FormItem>
              </Form>
          </div>
          <div slot="footer">
            <Button class="xy-modal-close" @click="creatTypeCancel">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="creatTypeOk">发送</Button>
          </div>
        </modal>
    </div>
    <Drawer
      v-model="isLook"
      width="560"
      class="detailModel"
      :transfer="false"
      :mask-closable="false"
      :styles="styles"
      @on-close='closeLook'
      v-cloak
      >
      <div slot="header">
        <p v-if="this.info.DocumentInfo">
          {{this.info.DocumentInfo.CreatedByName}}提交的公文
        </p>
      </div>
      <div class="drawer">
        <DetailsLook
          v-if="isLook"
          :info="info"
          >
        </DetailsLook>
      </div>
    </Drawer>
    <SelectTeacherOrg
      :isShow="isTeacher"
      :teachers="[...addPepList]"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm" />
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import DetailsLook from '@/pages/operationalAnalysis/components/DetailsLook.vue'
  import SelectTeacherOrg from '@/components/selectTeacherOrg/SelectTeacherOrg.vue'
  export default {
    name: 'MyLaunch',
    components: {
      XyAntTable,
      DetailsLook,
      SelectTeacherOrg
    },
    inject: ['reload'],
    created () {
      this.apiPath = this.$store.state.apiPath
      this.getListData()
    },
    data () {
      return {
        tableLoading: true,
        loadingTb: false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        txt: '该搜索条件下没有结果。',
        validateBool: false,
        formValidateAdd: {
          textValue: '', // 批复
          filesList: []
        },
        ruleValidateCreate: {
          textValue: [
            { required: true, message: '批复不能为空', trigger: 'blur' },
            { type: 'string', max: 300, message: '批复不能超过300个字', trigger: 'blur' }
          ],
          filesList: [
            { type: 'array', min: 1, message: '文件内容不能为空', trigger: 'blur' }
          ]
        },
        filesMaxNumKB: 0,
        filesMaxNumMB: 0,
        filesMaxNumKBFixed: 0,
        filesMaxNumMBFixed: 0,
        filesList: [],
        isTeacher: false,
        addPepList: [],
        DocumentStatusype: [
          {
            status: '进行中',
            statusID: '1'
          },
          {
            status: '申请结束',
            statusID: '2'
          },
          {
            status: '已结束',
            statusID: '4'
          }
        ],
        status: 0, // 状态
        searchTimeBegin: [], // 搜索时间
        searchTimeEnd: [],
        dataArr: ['', ''],
        searchT: '', // 搜索词
        docAll: [], // 所有数据
        columns: [
          {
            title: '公文种类',
            dataIndex: 'DocumentTypeName',
            width: 140,
            scopedSlots: { customRender: 'DocumentTypeName' }
          },
          {
            title: '发起时间',
            dataIndex: 'CreatedTime',
            width: 150,
            scopedSlots: { customRender: 'CreatedTime' }
          },
          {
            title: '主题',
            dataIndex: 'Title',
            scopedSlots: { customRender: 'Title' }
          },
          {
            title: '发文字号',
            dataIndex: 'DocumentNumber',
            width: 100
          },
          {
            title: '发起人',
            dataIndex: 'CreatedByName',
            width: 100
          },
          {
            title: '状态',
            width: 120,
            dataIndex: 'DocumentStatus',
            scopedSlots: { customRender: 'DocumentStatus' }
          },
          {
            title: '操作',
            dataIndex: '04',
            width: 80,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        modalCreateType: false,
        modalFinish: false,
        isFinish: false,
        // 详情
        id: '',
        info: [],
        docTypes: ['rar', 'zip', 'png', 'jpg', 'jpeg', 'svg', 'gif', 'flash', 'doc', 'docx', 'dotx', 'dot', 'pdf', 'txt', 'xml', 'ppt', 'pptx', 'xls', 'xlsx', 'xlst'],
        isLook: false,
        apiPath: '',
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        }
      }
    },
    methods: {
      handleTableChange () {
        this.getListData()
      },
      validate (a, b, c) {
        this.validateBool = b
      },
      closeLook () {
        this.reload()
      },
      // 获取分页列表
      async getListData () {
        this.tableLoading = true
        let params = {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          Status: this.status,
          beginTime: this.dataArr[0],
          endTime: this.dataArr[1],
          SearchWord: this.searchT
        }
        let res = await this.xy.get(
          this.apiPath + '/api/DocCirculation/GetTotalPageList', params
        )
        this.tableLoading = false
        if (res.success) {
          this.docAll = res.data.data
          this.pagination.total = res.data.totalRecords
        }
      },
      // 获取详情数据
      async getDetailData () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + '/api/DocCirculation/GetTotalDetail', {
            DocumentID: this.id
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.info = res.data
          this.info.HasApplyEndBtn = true
        }
      },
      // 状态
      DocumentStatusypeSearch () {
        this.pagination.current = 1
        this.getListData()
      },
      // 时间筛选
      datesChange (value) {
        this.dataArr = value
        this.pagination.current = 1
        this.getListData()
      },
      // 搜索
      FromSubmit () {
        this.pagination.current = 1
        this.getListData()
      },
      // 详情
      edit (row) {
        this.isLook = true
        this.id = row.DocumentID
        this.getDetailData()
      },
      // 添加批复
      addReply () {
        this.modalCreateType = true
      },
      // 添加批复 上传附件
      changeFunc (e) {
        for (var i = 0; i < e.target.files.length; i++) {
          let splitType = e.target.files[i].name.split('.')
          if (this.docTypes.indexOf(splitType[splitType.length - 1]) < 0) {
            this.xy.msgError('上传文件格式错误。')
            return
          }
        }
        this.formValidateAdd.filesList = [...this.formValidateAdd.filesList, ...e.target.files]
        for (let i = 0, len = this.formValidateAdd.filesList.length; i < len; i++) {
          if (this.formValidateAdd.filesList[i].isDel === undefined || !this.formValidateAdd.filesList[i].isDel) {
            this.$set(this.formValidateAdd.filesList[i], 'isDel', false)
            this.totalMB += this.formValidateAdd.filesList[i].size / 1024 / 1024
          }
        }
      },
      delFiles (itemIndex) {
        this.$set(this.formValidateAdd.filesList[itemIndex], 'isDel', true)
        let isDelLen = this.formValidateAdd.filesList.filter(item => {
          return !item.isDel
        })
        this.formValidateAdd.filesList = isDelLen
        this.totalMB = 0
        for (let i = 0, len = this.formValidateAdd.filesList.length; i < len; i++) {
          if (!this.formValidateAdd.filesList[i].isDel) {
            this.totalMB += this.formValidateAdd.filesList[i].size / 1024 / 1024
          }
        }
        if (isDelLen.length === 0) {
          this.$refs.fileAll.value = null
        }
      },
      // 添加流转
      addCirculation () {
        this.isTeacher = true
      },
      async addPep () {
        let pepList = []
        this.addPepList.map(item => {
          pepList.push(item.UserID)
        })
        let option = {
          DocumentID: this.id,
          AddUserList: pepList,
          Title: this.info.DocumentInfo.Title,
          CreatedByID: this.info.DocumentInfo.CreatedByID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/DocCirculation/AddSendTo`, option)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('添加流转成功。')
        }
      },
      selectCancel () {
        this.isTeacher = false
      },
      selectConfirm (data) {
        if (data.length > 0) {
          this.isTeacher = false
          this.addPepList = [...data]
          this.addPep()
        } else {
          this.xy.msgError('人员不能为空。')
        }
      },
      // 取消添加
      creatTypeCancel () {
        this.modalCreateType = false
        this.formValidateAdd.textValue = ''
        this.$refs.formValidateAdd.resetFields()
      },
      // 确定添加
      creatTypeOk () {
        if (this.validateBool) {
          if (this.totalMB > 100) {
            this.xy.unloading()
            this.xy.msgError('附件总大小不能超过100M。')
          } else {
            this.Create()
            this.reload()
          }
        }
      },
      // 添加批复
      async Create () {
        this.xy.loading()
        let formData = new FormData()
        for (let i = 0, len = this.formValidateAdd.filesList.length; i < len; i++) {
          formData.append('file', this.formValidateAdd.filesList[i])
        }
        if (this.formValidateAdd.filesList.length !== 0) {
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/DocCirculation/UploadCommentFile`, formData)
          if (res.success) {
            this.createFile(res.data)
          }
        } else {
          this.createFile()
        }
      },
      async createFile (returnFilesData) {
        let option = {
          DocumentID: this.id,
          Title: this.info.DocumentInfo.Title,
          Comment: this.formValidateAdd.textValue, // 批复
          FileInfo: returnFilesData // 附件集合
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/DocCirculation/AddComment`, option)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('添加批复成功。')
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-module {
  /deep/ .ant-table-cell {
    .comm-title {
      display: flex;
      align-items: center;
      > span:nth-of-type(1) {
        text-align: center;
        margin-right: 10px;
        display: inline-block;
        min-width: 54px;
        height: 24px;
        border-radius: 4px;
      }
      > span:nth-of-type(2) {
        text-align: left;
        // display: inline-block;
        // width: 660px;
      }
    }
    .jj {
      > span:nth-of-type(1) {
        background: #fff1f0;
      border: 1px solid #ffa39e;
      color: #F5222D;
      }
    }
    .pt {
       > span:nth-of-type(1) {
        background: #f6ffed;
      border: 1px solid #b7eb8f;
      color: #52c41a;
      }
    }
  }
  /deep/ .ivu-table-body {
    table {
      table-layout: auto !important;
      width: calc(100vw - 120px) !important;
    }
  }
  /deep/ .ivu-table-header {
    table {
      table-layout: auto !important;
      width: calc(100vw - 120px) !important;
    }
  }
}
.flex-flow{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.mr {
  margin-right: 20px;
  margin-left: 2px;
}
.files-flex{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:4px 6px;
  border-radius: 4px;
  margin-top: 25px;
  cursor: pointer;
  .files-flex-text{
    flex: 1;
    margin-right: 40px;
    i{
      margin-right:5px;
    }
    .icontext{
      color:#4196FF;
    }
    .iconimg{
      color:#F1C64E;
    }
  }
}
.files-flex:hover{
  background: #f9f9f9;
}
.replyFoot{
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #E7E7E7;
  span{
    font-size:14px;
    font-weight:400;
    color:rgba(0,0,0,1);
    opacity:0.45;
  }
  button{
    margin: 8px 0;
  }
}
.fileBox{
  height: 168px;
  overflow: auto;
  padding-bottom: 12px;
}
.finish {
  width:437px;
  height:114px;
  background:rgba(255,255,255,1);
  border-radius:4px;
  margin: 35px 0 0 35px;
  p{
    line-height: 22px;
    font-size:16px;
    font-weight:bold;
    color:rgba(33,33,33,1);
  }
}
.xy-btn-circulation{
  width:96px;
  height:36px;
  background:rgba(245,245,245,1);
  border:1px solid rgba(217,217,217,1);
  border-radius:18px;
  font-size:14px;
  font-weight:400;
  color:rgba(0,0,0,1);
  opacity:0.25;
}
.footBtn{
  width:96px;
  height:36px;
  background:rgba(255,255,255,1);
  border:1px solid rgba(65,150,255,1);
  border-radius:18px;
  font-size:14px;
  font-weight:400;
  color:rgba(65,150,255,1);
}
</style>
