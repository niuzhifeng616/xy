<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-center xy-between">
      <Button class="xy-primary" @click="goLaunch">发起公文</Button>
      <div class="xy-flex">
        <div class="xy-content-title-search">
          <span>状态：</span>
          <i-select v-model="status" @on-change="DocumentStatusypeSearch" style="width:150px;">
            <i-option :value="0" :key="0">全部</i-option>
            <i-option
              v-cloak
              v-for="types in DocumentStatusype"
              :value="types.statusID"
              :key="types.statusID"
              >
              {{ types.status }}
            </i-option>
          </i-select>
        </div>
        <div class="xy-content-title-search">
          <span>时间筛选：</span>
          <date-picker
            type="daterange"
            format="yyyy-MM-dd"
            :value="dataArr"
            :editable="false"
            @on-change="datesChange"
            placeholder="请选择发起时间日期"
            style="width: 250px;"
            >
          </date-picker>
        </div>
        <div class="xy-content-title-search">
          <i-input
            search
            v-model="searchT"
            @on-search="FromSubmit"
            placeholder="请输入主题/发文字号"
            style="width: 272px;"
            >
            <icon type="ios-search cursor-p" slot="suffix" />
          </i-input>
        </div>
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :columns="columns"
        :dataSource="tbData"
        :nullData="txt"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scrollx="1220"
        >
        <!-- 公文种类 -->
        <div slot="DocumentTypeName" slot-scope="text, record">
          {{record.DocumentTypeName}}
        </div>
        <!-- 发起时间 -->
        <div slot="CreatedTime" slot-scope="text, record">
          {{xy.moment(record.CreatedTime).format('YYYY-MM-DD HH:mm')}}
        </div>
        <!-- 主题 -->
        <div style="min-width: 570px" slot="Title" slot-scope="text, record">
          <span
            v-html="record.Title"
            class="ant-table-cell table-el-hover"
            style="display: inline-block"
            @click="edit(record)"
            >
          </span>
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
          <a-divider type="vertical" />
          <a :disabled="record.DocumentStatus === 16 || record.DocumentStatus === 4 || userID !== record.CreatedByID" @click="retract(record.DocumentID)">撤销</a>
        </span>
      </XyAntTable>
      <modal
        v-model="modalCreateType"
        :transfer="false"
        title="添加批复"
        :mask-closable="false"
        >
        <div class="dialog-model-content">
          <Form
            ref="formValidateAdd"
            @on-validate='validate'
            :model='formValidateAdd'
            @submit.native.prevent
            :rules="ruleValidateCreate"
            >
            <FormItem prop='textValue' style="margin: 0">
              <Input
                :rows='8'
                show-word-limit
                :maxlength="300"
                type="textarea"
                placeholder="请输入批复内容"
                style="font-size:14px"
                v-model="formValidateAdd.textValue"
                />
            </FormItem>
            <div class="replyFoot">
              <i-button icon="ios-cloud-upload-outline" class="pr">
                <input
                  type="file"
                  ref="fileAll"
                  multiple="multiple"
                  @change="changeFunc($event)"
                  class="pa cursor-p"
                  style="top:0;left:0;width:100%;height:100%;opacity:0;"
                  >
                  附件
              </i-button>
            </div>
            <FormItem prop='fileList'>
              <div class="fileBox">
                <template v-for="(item,index) of formValidateAdd.filesList">
                  <div :key="index" class="files-flex" ref="filesDom">
                    <div class="files-flex-text nowrap">
                      <i class="iconfont iconimg" v-if="item.type.indexOf('image')>-1">&#xe705;</i>
                      <i class="iconfont icontext" v-else>&#xe706;</i>
                    </div>
                    <div class="fileInfo">
                      <span class="fileInfoName"
                            :title="item.name">{{item.name}}</span>
                      <span class="fileInfoSize">{{item.size / 1024 / 1024 >=1?(item.size /1024/1024).toFixed(2)+'MB':(item.size /1024).toFixed(2)+'KB'}}</span>
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
      <modal v-model="modalFinish2"
             :transfer="false">
        <div class="finish">
          <p>
            <span class="mark-img">?</span>
            {{this.applyEndPepName[this.applyEndPepName.length - 1]}}申请流程结束，是否同意？
          </p>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="finishCancel2">拒绝</Button>
          <Button class="xy-modal-primary" shape="circle" @click="finishOk2">同意</Button>
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
        <DetailsLook v-if="isLook"
                     :info="info">
        </DetailsLook>
      </div>

      <!-- 底部 -->
      <div class="work-flow-drawer" style="z-index:2" v-if="isRetract">
        <Button
          v-if="info.HasSignBtn"
          class="xy-btn-primary"
          shape="circle"
          @click="signFor"
        >
          签收
        </Button>
        <Button
          class="xy-btn-primary"
          shape="circle"
          @click="addReply"
          v-if="info.HasAddCommentBtn"
        >
          添加批复
        </Button>
        <Button
          class="mr footBtn rg"
          v-if="info.HasApplyEndBtn"
          shape="circle"
          @click="endApplication"
        >
          申请结束
        </Button>
        <Button
          class="mr footBtn rg"
          v-if="info.HasReviewApplyEndBtn"
          shape="circle"
          @click="endApproval"
        >
          结束审批
        </Button>
        <Button
          class="mr footBtn rg"
          v-if="info.HasAddCirculationBtn"
          shape="circle"
          @click="addCirculation"
        >
          添加流转
        </Button>
        <Button
          class="mr footBtn rg"
          shape="circle"
          v-if="!info.HasSignBtn && info && info.DocumentInfo && info.DocumentInfo.DocumentStatus !== 4 && userID === info.DocumentInfo.CreatedByID"
          @click="retract(id)"
        >
          撤销
        </Button>
      </div>
    </Drawer>
    <SelectTeacherOrg
      :isShow="isTeacher"
      :teachers="[...addPepList]"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm"
      />
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import DetailsLook from '@/pages/operationalAnalysis/components/DetailsLook.vue'
  import SelectTeacherOrg from '@/components/selectTeacherOrg/SelectTeacherOrg.vue'
  export default {
    name: 'MyLaunch',
    inject: ['reload'],
    provide () {
      return {
        isAllow: this.isAllow,
        loadingtb: false
      }
    },
    components: {
      XyAntTable,
      DetailsLook,
      SelectTeacherOrg
    },
    created () {
      // console.log(this.$store.state.common.userBaseInfo)
      this.fetchTabl()
    },
    data () {
      return {
        tableLoading: true,
        txt: '该搜索条件下没有结果。',
        tbData: [],
        total: 0,
        userID: this.$store.state.common.userBaseInfo.UserID * 1,
        isRetract: true, // 是否撤销，是就不能继续操作了
        tableUrl: '',
        totalMB: 0,
        formValidateAdd: {
          textValue: '', // 批复
          filesList: []
        },
        ruleValidateCreate: {
          textValue: [
            { type: 'string', max: 300, message: '批复不能超过300个字', trigger: 'blur' }
          ],
          filesList: [
            { type: 'array', min: 1, message: '批复或文件内容不能为空', trigger: 'blur' }
          ]
        },
        validateBool: false,
        mainUrl: this.xyApi + '/base',
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        applyEndPepName: [],
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
          },
          {
            status: '已撤销',
            statusID: '16'
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
            scopedSlots: { customRender: 'DocumentTypeName' },
            width: 140
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
            title: '状态',
            width: 120,
            dataIndex: 'DocumentStatus',
            scopedSlots: { customRender: 'DocumentStatus' }
          },
          {
            title: '操作',
            dataIndex: '04',
            width: 120,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        modalCreateType: false,
        modalFinish: false,
        modalFinish2: false,
        // 详情
        id: '',
        info: [],
        docTypes: ['rar', 'zip', 'png', 'jpg', 'jpeg', 'svg', 'gif', 'flash', 'doc', 'docx', 'dotx', 'dot', 'pdf', 'txt', 'xml', 'ppt', 'pptx', 'xls', 'xlsx', 'xlst'],
        isLook: false,
        apiPath: this.$store.state.apiPath,
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
        this.fetchTabl()
      },
      async fetchTabl () {
        this.tableLoading = true
        let params = {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          Status: this.status,
          beginTime: this.dataArr[0],
          endTime: this.dataArr[1],
          SearchWord: this.searchT
        }
        let res = await this.xy.get(`${this.apiPath}/api/DocCirculation/GetSendByMePageList`, params)
        this.tableLoading = false
        if (res.success) {
          this.tbData = res.data.data
          this.pagination.total = res.data.totalRecords
          if (res.data.data && res.data.data.length) {
            this.columns[2].minWidth = res.data.data.filter(item => item.Title.length > 80).length ? 660 : 300
          }
        }
      },
      // 撤销
      retract (id) {
        // console.log(id)
        this.xy.confirm('撤销公文', '您确定要撤销该公文吗？', () => {
          this.toRetract(id)
        })
      },
      async toRetract (id) {
        this.xy.loading()
        let res = await this.xy.get(`${this.apiPath}/api/DocCirculation/RevokeEnd?DocumentID=${id}`, null, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc(res.msg || '撤销成功。')
          this.DocumentStatusypeSearch()
          if (this.isLook) {
            this.getDetailData()
            this.isRetract = false
          }
        } else {
          this.xy.msgError(res.msg || '撤销失败。')
        }
      },
      validate (a, b, c) {
        this.validateBool = b
      },
      closeLook () {
        this.reload()
      },
      // 获取详情数据
      async getDetailData () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + '/api/DocCirculation/GetSendByMeDetail', {
            DocumentID: this.id
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.info = res.data
          for (var i = 0; i < this.info.NodeList.length; i++) {
            if (this.info.NodeList[i].OrderName === '申请结束') {
              this.applyEndPepName.push(this.info.NodeList[i].UserList[0].FullName)
            }
          }
        }
      },
      // 状态
      DocumentStatusypeSearch () {
        this.pagination.current = 1
        this.fetchTabl()
      },
      // 时间筛选
      datesChange (value) {
        this.dataArr = value
        this.pagination.current = 1
        this.fetchTabl()
      },
      // 搜索
      FromSubmit () {
        this.pagination.current = 1
        this.fetchTabl()
      },
      // 详情
      edit (row) {
        if (row.DocumentStatus === 16 || row.DocumentStatus === 4) {
          this.isRetract = false
        } else {
          this.isRetract = true
        }
        this.isLook = true
        this.id = row.DocumentID
        this.getDetailData()
      },
      // TO 发起公文
      goLaunch () {
        this.$store.commit('common/getThreeMenuName', '发起公文')
        this.$router.push({
          path: '/xyHome/Launch',
          query: this.$store.state.common.menuInfo
        })
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
        this.totalMB = 0
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
        this.xy.loading()
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
          this.getDetailData()
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
      async creatTypeOk () {
        if (this.totalMB > 100) {
          this.xy.unloading()
          this.xy.msgError('附件总大小不能超过100M。')
        } else {
          if (!this.formValidateAdd.textValue && this.formValidateAdd.filesList.length === 0) {
            this.xy.msgError('批复或文件内容不能为空。')
          } else {
            this.Create()
            this.$set(this.info.NodeList[this.info.NodeList.length - 1].CommentList)
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
          CreatedByID: this.info.DocumentInfo.CreatedByID,
          Title: this.info.DocumentInfo.Title,
          Comment: this.formValidateAdd.textValue, // 批复
          FileInfo: returnFilesData // 附件集合
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/DocCirculation/AddComment`, option)
        this.xy.unloading()
        if (res.success) {
          this.modalCreateType = false
          this.xy.msgSuc('添加批复成功。')
          let res = await this.xy.get(
            this.apiPath + '/api/DocCirculation/GetSendByMeDetail', {
              DocumentID: this.id
            }
          )
          if (res.success) {
            this.info = res.data
          }
          this.formValidateAdd.textValue = ''
          this.formValidateAdd.filesList = []
        }
      },
      // 流程结束
      endApproval () {
        this.modalFinish2 = true
      },
      finishCancel2 () {
        this.modalFinish2 = false
        let id = 4
        this.ApplyEnd2(id)
      },
      finishOk2 () {
        this.modalFinish2 = false
        let id = 2
        this.ApplyEnd(id)
      },
      async ApplyEnd (id) {
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + '/api/DocCirculation/ReviewApplyEnd', {
            DocumentID: this.id,
            Status: id,
            Title: this.info.DocumentInfo.Title
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('流程结束。')
          this.getDetailData()
        }
      },
      async ApplyEnd2 (id) {
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + '/api/DocCirculation/ReviewApplyEnd', {
            DocumentID: this.id,
            Status: id,
            Title: this.info.DocumentInfo.Title
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('申请驳回。')
          this.getDetailData()
        }
      },
      // 签收
      async signFor () {
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + '/api/DocCirculation/Sign', {
            DocumentID: this.id,
            CreatedByID: this.info.DocumentInfo.CreatedByID
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('签收成功。')
          this.getDetailData()
        }
      },
      // 结束审批
      endApplication () {
        this.xy.confirm('申请结束', '您确定申请流程完成吗?', () => this.finishOk())
      // this.modalFinish = true
      },
      // finishCancel () {
      //   this.modalFinish = false
      // },
      async finishOk () {
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + '/api/DocCirculation/ApplyEnd', {
            DocumentID: this.id,
            CreatedByID: this.info.DocumentInfo.CreatedByID,
            Title: this.info.DocumentInfo.Title
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.modalFinish = false
          this.xy.msgSuc('申请结束成功。')
          this.getDetailData()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-module {
  /deep/ .ivu-form-item {
    margin-bottom: 7px;
  }
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
        color: #f5222d;
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
}
.rg {
  margin-right: 20px;
}
.flex-flow {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mr {
  margin-right: 20px;
  margin-left: 2px;
}
.files-flex {
  display: flex;
  align-items: center;
  padding: 0px 6px;
  border-radius: 4px;
  margin-top: 25px;
  cursor: pointer;
  .files-flex-text {
    margin-right: 14px;
  }
  .fileInfo {
    display: flex;
    flex-direction: column;
    margin-right: 120px;
    width: 293px;
    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .fileInfoName {
      color: rgba(0, 0, 0, 1);
      opacity: 0.85;
      font-size: 14px;
      line-height: 18px;
    }
    .fileInfoSize {
      color: rgba(0, 0, 0, 1);
      opacity: 0.45;
      font-size: 12px;
      line-height: 16px;
    }
  }
  i {
    margin-right: 5px;
  }
  .icontext {
    color: #4196ff;
  }
  .iconimg {
    color: #f1c64e;
  }
  .fileL {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    opacity: 0.85;
  }
  .fileL .fileSize {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    opacity: 0.45;
  }
}
.files-flex:hover {
  background: #f9f9f9;
}
.replyFoot {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #e7e7e7;
  span {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    opacity: 0.45;
  }
  button {
    margin: 8px 0;
  }
}
.fileBox {
  height: 180px;
  overflow: auto;
  padding-bottom: 12px;
}
.finish {
  width: 437px;
  height: 114px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  margin: 35px 0 0 35px;
  p {
    line-height: 22px;
    font-size: 16px;
    font-weight: bold;
    color: rgba(33, 33, 33, 1);
    .mark-img {
      width: 22px;
      height: 22px;
      background: #faad14;
      border-radius: 50%;
      color: #ffffff;
      display: inline-block;
      text-align: center;
      line-height: 22px;
      margin-right: 13px;
    }
  }
}
.xy-btn-circulation {
  width: 96px;
  height: 36px;
  background: rgba(245, 245, 245, 1);
  border: 1px solid rgba(217, 217, 217, 1);
  border-radius: 18px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  opacity: 0.25;
}
.footBtn {
  width: 96px;
  height: 36px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(65, 150, 255, 1);
  border-radius: 18px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(65, 150, 255, 1);
}
</style>
