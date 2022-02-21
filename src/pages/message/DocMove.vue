<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <div class="drawer detailModel">
        <DetailsLook :info="info"></DetailsLook>
        <div v-if="info && info.DocumentInfo.DocumentStatus !== 16">
          <Button v-if="info.HasSignBtn"
                  class="xy-btn-primary"
                  shape="circle"
                  @click="signFor">签收</Button>
          <Button class="xy-btn-primary"
                  shape="circle"
                  @click="addReply"
                  v-if="info.HasAddCommentBtn">添加批复</Button>
          <Button class="mr footBtn rg rg"
                  v-if="info.HasApplyEndBtn"
                  shape="circle"
                  @click="endApplication">申请结束</Button>
          <Button class="mr footBtn rg"
                  v-if="info.HasReviewApplyEndBtn"
                  shape="circle"
                  @click="endApproval">结束审批</Button>
          <Button class="mr footBtn rg"
                  v-if="info.HasAddCirculationBtn"
                  shape="circle"
                  @click="addCirculation">添加流转</Button>
          <Button class="mr footBtn rg"
                  shape="circle"
                  v-if="!info.HasSignBtn && info.DocumentInfo.DocumentStatus !== 4  && userID === info.DocumentInfo.CreatedByID"
                  @click="retract()">撤销</Button>
        </div>
      </div>
    </div>
    <modal v-model="modalCreateType"
           :transfer="false"
           title="添加批复"
           :mask-closable="false">
      <div class="dialog-model-content">
        <Form ref="formValidateAdd"
              @on-validate='validate'
              :model='formValidateAdd'
              @submit.native.prevent
              :rules="ruleValidateCreate">
          <FormItem prop='textValue' style="margin: 0">
                <Input :rows='8' show-word-limit :maxlength="300" type="textarea" placeholder="请输入批复内容" style="font-size:14px" v-model="formValidateAdd.textValue" />
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
                <div :key="index"
                     class="files-flex"
                     ref="filesDom">
                  <div class="files-flex-text nowrap">
                    <i class="iconfont iconimg"
                       v-if="item.type.indexOf('image')>-1">&#xe705;</i>
                    <i class="iconfont icontext"
                       v-else>&#xe706;</i>
                  </div>
                  <div class="fileInfo">
                    <span class="fileInfoName"
                          :title="item.name">{{item.name}}</span>
                    <span class="fileInfoSize">{{item.size / 1024 / 1024 >=1?(item.size /1024/1024).toFixed(2)+'MB':(item.size /1024).toFixed(2)+'KB'}}</span>
                  </div>
                  <Icon @click="delFiles(index)"
                        type="md-close-circle"
                        color="#F5222D"
                        size="22" />
                </div>
              </template>
            </div>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="creatTypeCancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="creatTypeOk">发送</Button>
      </div>
    </modal>
    <modal v-model="modalFinish2"
           :transfer="false"
           :closable="false">
      <div class="finish">
        <p>
          <span class="mark-img"></span> {{this.applyEndPepName[this.applyEndPepName.length - 1]}}申请流程结束，是否同意？</p>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="finishCancel2">拒绝</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="finishOk2">同意</Button>
      </div>
    </modal>
    <!-- <modal v-model="modalFinish"
           :transfer="false"
           :closable="false">
      <div class="finish">
        <p>
          <span class="mark-img">?</span> 您确定申请流程完成吗</p>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="finishCancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="finishOk">确定</Button>
      </div>
    </modal> -->
    <SelectTeacherOrg :isShow="isTeacher"
                      :teachers="[...addPepList]"
                      @select-cancel="selectCancel"
                      @select-confirm="selectConfirm" />
  </div>
</template>
<script>
  import DetailsLook from '@/pages/operationalAnalysis/components/DetailsLook.vue'
  import SelectTeacherOrg from '@/components/selectTeacherOrg/SelectTeacherOrg.vue'
  export default {
    components: {
      DetailsLook,
      SelectTeacherOrg
    },
    name: 'DocMove',
    data () {
      return {
        userID: this.$store.state.common.userBaseInfo.UserID,
        addPepList: [],
        isTeacher: false,
        modalCreateType: false,
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
        info: null,
        modalFinish: false,
        modalFinish2: false,
        docTypes: ['rar', 'zip', 'png', 'jpg', 'jpeg', 'svg', 'gif', 'flash', 'doc', 'docx', 'dotx', 'dot', 'pdf', 'txt', 'xml', 'ppt', 'pptx', 'xls', 'xlsx', 'xlst'],
        validateBool: false,
        applyEndPepName: [],
        params: this.$store.state.common.msgParam ? JSON.parse(this.$store.state.common.msgParam) : {},
        apiPath: `${this.xyApi}/oa`
      }
    },
    mounted () {
      this.getDetailData()
    },
    methods: {
      // 撤销
      retract () {
        this.xy.confirm('撤销公文', '您确定要撤销该公文吗？', () => {
          this.toRetract()
        })
      },
      async toRetract () {
        this.xy.loading()
        let res = await this.xy.get(`${this.apiPath}/api/DocCirculation/RevokeEnd?DocumentID=${this.params.BusinessID}`, null, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc(res.msg || '成功撤销')
          this.getDetailData()
        } else {
          this.xy.msgError(res.msg || '撤销失败')
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
          this.xy.msgError('人员不能为空')
        }
      },
      validate (a, b, c) {
        this.validateBool = b
      },
      // 获取详情数据
      async getDetailData () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + '/api/DocCirculation/GetSendByMeDetail', {
            DocumentID: this.params.BusinessID
          }
        )
        this.xy.unloading()
        // console.log(this.info)
        if (res.success) {
          console.log(res.data, this.userID)
          this.info = res.data
          console.log(this.info)
          for (var i = 0; i < this.info.NodeList.length; i++) {
            if (this.info.NodeList[i].OrderName === '申请结束') {
              this.applyEndPepName.push(this.info.NodeList[i].UserList[0].FullName)
            }
          }
        } else {
          this.xy.msgError(res.msg)
        };
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
            this.xy.msgError('上传文件格式错误')
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
          DocumentID: this.params.BusinessID,
          AddUserList: pepList,
          Title: this.info.DocumentInfo.Title,
          CreatedByID: this.info.DocumentInfo.CreatedByID
        }
        let res = await this.xy.post(`${this.apiPath}/api/DocCirculation/AddSendTo`, option, true)
        if (res.success) {
          this.xy.msgSuc('添加流转成功')
          this.getDetailData()
        } else {
          this.xy.msgError(res.msg)
        }
        this.xy.unloading()
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
          this.xy.msgError('附件总大小不能超过100M')
        } else {
          if (!this.formValidateAdd.textValue && this.formValidateAdd.filesList.length === 0) {
            this.xy.msgError('批复或文件内容不能为空')
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
          let res = await this.xy.post(`${this.apiPath}/api/DocCirculation/UploadCommentFile`, formData, true)
          if (res.success) {
            this.createFile(res.data)
          }
        } else {
          this.createFile()
        }
      },
      async createFile (returnFilesData) {
        let option = {
          DocumentID: this.params.BusinessID,
          CreatedByID: this.info.DocumentInfo.CreatedByID,
          Title: this.info.DocumentInfo.Title,
          Comment: this.formValidateAdd.textValue, // 批复
          FileInfo: returnFilesData // 附件集合
        }
        let res = await this.xy.post(`${this.apiPath}/api/DocCirculation/AddComment`, option, true)
        if (res.success) {
          this.modalCreateType = false
          this.xy.msgSuc('添加批复成功')
          let res = await this.xy.get(
            this.apiPath + '/api/DocCirculation/GetSendByMeDetail', {
              DocumentID: this.params.BusinessID
            }
          )
          if (res.success) {
            this.info = res.data
            console.log(this.info)
          }
          this.formValidateAdd.textValue = ''
          this.formValidateAdd.filesList = []
        } else {
          this.xy.msgError(res.msg)
          this.xy.unloading()
        }
        this.xy.unloading()
      },
      // 流程结束
      endApproval () {
        // this.xy.confirm('', '您确定申请流程完成吗?', () => this.finishOk())
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
            DocumentID: this.params.BusinessID,
            Status: id,
            Title: this.info.DocumentInfo.Title
          }
        )
        if (res.success) {
          this.xy.msgSuc('流程结束')
          this.getDetailData()
        } else {
          this.xy.msgError(res.msg)
        };
        this.xy.unloading()
      },
      async ApplyEnd2 (id) {
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + '/api/DocCirculation/ReviewApplyEnd', {
            DocumentID: this.params.BusinessID,
            Status: id,
            Title: this.info.DocumentInfo.Title
          }
        )
        if (res.success) {
          this.xy.msgSuc('申请驳回')
          this.getDetailData()
        } else {
          this.xy.msgError(res.msg)
        };
        this.xy.unloading()
      },
      // 签收
      async signFor () {
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + '/api/DocCirculation/Sign', {
            DocumentID: this.params.BusinessID,
            CreatedByID: this.info.DocumentInfo.CreatedByID
          }
        )
        if (res.success) {
          this.xy.msgSuc('签收成功')
          this.getDetailData()
        } else {
          this.xy.msgError(res.msg)
        };
        this.xy.unloading()
      },
      // 结束审批
      endApplication () {
        // this.modalFinish = true
        this.xy.confirm('申请结束', '您确定申请流程完成吗?', () => this.finishOk())
      },
      finishCancel () {
        this.modalFinish = false
      },
      async finishOk () {
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + '/api/DocCirculation/ApplyEnd', {
            DocumentID: this.params.BusinessID,
            CreatedByID: this.info.DocumentInfo.CreatedByID,
            Title: this.info.DocumentInfo.Title
          }
        )
        if (res.success) {
          this.modalFinish = false
          this.xy.msgSuc('申请结束成功')
          this.getDetailData()
        } else {
          this.xy.msgError(res.msg)
        };
        this.xy.unloading()
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-module {
  /deep/ .ivu-form-item {
    margin-bottom: 7px;
  }
  .xy-content-body {
    display: flex;
    justify-content: center;
    .drawer {
      .rg {
        margin-right: 20px;
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
