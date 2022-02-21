// 教师请假-创建请假
<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div style="width:600px;min-height:750px;margin:0 auto;position: relative;">
        <Form
          ref="formValidateCreate"
          :rules="ruleValidateCreate"
          :model="formValidateCreate"
          :label-width="80"
          >
          <FormItem label="请假类型" prop="formTeacherLeaveTypeID">
            <Select v-model="formValidateCreate.formTeacherLeaveTypeID">
              <Option
                v-cloak
                v-for="item in teacherLeaveTypeArr"
                :value="item.TeacherLeaveTypeID"
                :key="item.TeacherLeaveTypeName"
                >
                {{ item.TeacherLeaveTypeName }}
              </Option>
            </Select>
          </FormItem>
          <FormItem prop="username" label="请假人">
            <span>{{username}}</span>
          </FormItem>
          <FormItem label="请假时间" class="chooseData" prop="formDate" labelFor='formDate'>
            <date-picker
              type="datetimerange"
              :value="formValidateCreate.formDate"
              split-panels
              :clearable="false"
              format="yyyy-MM-dd HH:mm"
              placeholder="开始时间-结束时间"
              @on-change="dateChange"
              style="width:100%"
              :editable="false"
              elementId="formDate"
              >
            </date-picker>
          </FormItem>
          <FormItem label="请假原因" prop="formApplicationDescription" labelFor='formApplicationDescription'>
            <i-input v-model="formValidateCreate.formApplicationDescription" type="textarea" elementId="formApplicationDescription"></i-input>
          </FormItem>
          <FormItem label="请假图片" prop="LeaveApplicationImg">
            <div class="pr">
              <div class="demo-upload-list" v-for="(item,index) in formValidateCreate.LeaveApplicationImg" :key="index">
                <template>
                  <img :src="mainUrl + item">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                  </div>
                </template>
                <template>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <upload
                style="display:inline-block;"
                :format="['png','jpg','jpeg']" ref="upload"
                :show-upload-list="false"
                :max-size="4000"
                :on-format-error="formatErrorIcon"
                :headers="{'Access-Control-Allow-Origin' : '*','XYTOKEN': xy.getCookie('.XYTOKEN') }"
                :on-exceeded-size="MaxSizeIcon" :on-success="SuccessIcon"
                ::before-upload="handleBeforeUpload" :default-file-list="defaltFileList"
                :on-error="ErrorIcon" :action="puthUpload"
                >
                <Button icon="ios-cloud-upload-outline">添加照片</Button>
              </upload>
              <tooltip word-wrap max-width="350" placement="right" content="图片格式支持：jpg，png，jpeg。最多上传6张。">
                <Icon type="md-help-circle" size="18" color="#ffad33" />
              </tooltip>
              <Modal title="查看" v-model="visible" v-for="(item,index) in formValidateCreate.LeaveApplicationImg" :key="index">
                <img :src="mainUrl + item" v-if="visible" style="width: 100%;">
              </Modal>
            </div>
          </FormItem>
          <WorkflowApply :workflow="barchData" :isAddList="isAddList" />
        </Form>
        <div class="text-center">
          <Button class="xy-btn-primary" shape="circle" @click="create">提交</Button>
          <Button class="xy-btn-close" @click="cancle">取消</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import WorkflowApply from '@/components/workflow/WorkflowApply.vue'
  export default {
    name: 'create',
    components: {
      WorkflowApply
    },
    data () {
      return {
        isAddList: 0,
        mainUrl: this.xyApi + '/att',
        teacherLeaveTypeArr: [],
        formValidateCreate: {
          formTeacherLeaveTypeID: null,
          formDate: null,
          formApplicationDescription: '',
          LeaveApplicationImg: [],
          username: this.$store.state.common.userBaseInfo.FullName
        },
        puthUpload: '', // 上传文件地址
        picIcon: '', // 上传图片名称
        defaltFileList: [], // 默认已上传的图片-编辑时
        uploadList: [],
        imgName: '',
        visible: false,
        // 日期选择范围
        startTime: null,
        endTime: null,
        optionsStartTime: {
          disabledDate: (date) => {
            if (this.endTime) {
              return date.valueOf() > this.endTime
            } else {
              return false
            }
          }
        },
        optionsEndTime: {
          disabledDate: (date) => {
            if (this.startTime) {
              return date.valueOf() < this.startTime
            } else {
              return false
            }
          }
        },
        handleStartTimeChange: (date) => {
          this.startTime = date
        },
        handleEndTimeChange: (date) => {
          this.endTime = date
        },
        // 验证规则
        ruleValidateCreate: {
          formTeacherLeaveTypeID: [{
            type: 'number',
            required: true,
            message: '请假类型不能为空',
            trigger: 'change'
          }],
          username: [{
            required: true,
            message: '请假人不能为空',
            trigger: 'blur'
          }],
          formDate: [{
            required: true,
            type: 'array',
            len: 2,
            message: '请假时间不能为空',
            trigger: 'change'
          }],
          formApplicationDescription: [
            {
              required: true,
              message: '请假原因不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              max: 100,
              message: '请假原因不能超过100字符',
              trigger: 'blur'
            }
          ],
          LeaveApplicationImg: [
            {
              required: false,
              message: '请至少上传一张图片',
              type: 'array',
              min: 1,
              trigger: 'change'
            },
            {
              required: false,
              message: '请至多上传六张图片',
              type: 'array',
              max: 6,
              trigger: 'change'
            }
          ]
        },
        username: this.$store.state.common.userBaseInfo.FullName,
        userId: this.$store.state.common.userBaseInfo.UserID,
        barchData: []
      }
    },
    created () {
      this.$store.commit('common/getThreeMenuName', '创建请假')
      this.getTeacherLeaveType()
    },
    mounted () {
      // 上传图片地址
      this.puthUpload = this.$store.state.apiPath + '/api/TeacherLeave/IconUpload'
      this.$nextTick(function () {
      })
    },
    methods: {
      async getTeacherLeaveType () {
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/TeacherLeaveType/GetAll', null)
        if (res.success) {
          this.teacherLeaveTypeArr = res.data
        }
      },
      dateChange (val) {
        this.formValidateCreate.formDate = val
        var m1 = this.xy.moment(this.formValidateCreate.formDate[0]).format('YYYY-MM-DD')
        var m2 = this.xy.moment(this.formValidateCreate.formDate[1])
        var tempDays = m2.diff(m1, 'days')
        if (tempDays === 0) {
          this.getBarch(1)
        } else if (tempDays > 0) {
          this.getBarch(tempDays + 1)
        }
      },
      // 上传图片
      formatErrorIcon (file, fileList) {
        this.xy.msgError('文件格式不正确,只能上传jpg,png,jpeg格式。')
      },
      MaxSizeIcon (file, fileList) {
        this.xy.msgError('文件格式大小超过4M。')
      },
      SuccessIcon (res, file, fileList) {
        if (this.formValidateCreate.LeaveApplicationImg.length === 6) {
          this.xy.msgError('最多上传6张图片。')
        } else {
          this.formValidateCreate.LeaveApplicationImg.push(res.data.FilePath)
          if (res.success) {
            console.log(this.mainUrl + res.data.FilePath)
            this.picIcon = res.data.FilePath
            this.defaltFileList = [{
              name: this.picIcon
            }]
            this.xy.msgSuc('上传成功。')
          } else {
            this.xy.msgError(res.msg)
          }
        }
      },
      ErrorIcon (error, file, fileList) {
        this.xy.msgError(error)
      },
      handleBeforeUpload () {
        const check = this.uploadList.length <= 9
        if (!check) {
          this.$Notice.warning({
            title: 'Up to nine pictures can be uploaded.'
          })
        }
        return check
      },
      handleView (name) {
        this.imgName = name
        this.visible = true
      },
      handleRemove (file) {
        for (var index = 0; index < this.formValidateCreate.LeaveApplicationImg.length; index++) {
          if (this.formValidateCreate.LeaveApplicationImg[index] === file) {
            this.formValidateCreate.LeaveApplicationImg.splice(index, 1)
          }
        }
      },
      async getBarch (days) {
        this.xy.loading()
        let res = await this.xy.post(this.$store.state.apiPublic + '/api/WorkFlowSetting/ApprovalProcessByCondition', {
          ApplicantUserID: this.userId,
          OrganizationID: 0,
          WorkFlowType: 0,
          ConditionValues: [{ Type: 0, Code: 1, Value: days }, { Type: 0, Code: 2, Value: 1 }]
        })
        if (res.success) {
          this.xy.unloading()
          this.barchData = []
          this.barchData = res.data
        }
      },
      cancle () {
        this.$router.go(-1)
      },
      create () {
        var flowNodes = []
        this.barchData.forEach(function (item) {
          flowNodes.push({
            NodeType: item.NodeType, // 节点类型
            ApprovalFlowNodeName: item.WorkFlowNodeName, // 节点名称
            ApprovalMemberRoleID: item.ApprovalMemberRoleID, // 审批成员类型 1：职务角色 2：自定义角色
            ApprovalMemberType: item.ApprovalMemberType, // 审批成员类型 0：指定成员 1：职务角色 2：自定义角色 3：申请人选择
            ApprovalMode: item.ApprovalMode, // 审批模式  会签 = 1  或签 = 0
            IsApprovalMySelf: item.IsApprovalMySelf, // 审批人就是申请人（自己审批自己）
            IsApprovalComplete: item.IsApprovalComplete, // 审批人已经审批通过
            ApprovalUsers: [], // item.ApprovalMemberList, // 审批人
            CCUsers: [] // item.CheckedCcMemberList//抄送人
          })
        })
        for (var w = 0, wlen = this.barchData.length; w < wlen; w++) {
          // 审批人
          if (this.barchData[w].NodeType === 2) {
            if (this.barchData[w].ApprovalMemberType === 0) { // 会签/或签
              this.barchData[w].isGo = true
              this.barchData[w].ApprovalMemberList.forEach((ap) => {
                flowNodes[w].ApprovalUsers.push(ap.UserID)
              })
            } else { // 审批
              if (this.barchData[w].ApprovalMemberList.length > 0) {
                this.barchData[w].isGo = false
                this.barchData[w].CheckedApprovalMemberList.map((appItem) => {
                  if (appItem.IsShow) {
                    this.barchData[w].isGo = true
                    flowNodes[w].ApprovalUsers.push(appItem.UserID)
                  }
                })
              } else {
                this.barchData[w].isGo = false
              }
            }
          } else {
            // 抄送人
            this.barchData[w].CheckedCcMemberList.forEach(function (cc) {
              flowNodes[w].CCUsers.push(cc.UserID)
            })
          }
        }
        if (this.barchData.length === 0) {
          this.xy.msgError('请添加审批流程。')
          return false
        }
        for (let isgo = 0; isgo < this.barchData.length; isgo++) {
          if (this.barchData[isgo].isGo === false) {
            this.xy.msgError('审批人不能为空。')
            return false
          }
        }
        this.$refs.formValidateCreate.validate((valid) => {
          if (!valid) {
            console.log('未校验')
          } else {
            let params = {
              ApplicationState: 1,
              TeacherLeaveTypeID: this.formValidateCreate.formTeacherLeaveTypeID,
              StartTime: this.formValidateCreate.formDate[0],
              EndTime: this.formValidateCreate.formDate[1],
              ApplicationDescription: this.formValidateCreate.formApplicationDescription,
              LeavePictrueList: this.formValidateCreate.LeaveApplicationImg,
              Models: flowNodes
            }
            this.xy.post(`${this.$store.state.apiPath}/api/TeacherLeave/CreateTeacherLeave`, params).then(res => {
              if (res.success) {
                this.xy.msgSuc(res.data)
                this.$router.go(-1)
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scpoed>
.text-center{
  bottom: 20px;
  position: inherit;
  left: 50%;
  margin-left: -75px;
}
/* 上传图片组件样式 */
.upload-image-item input[type=file],
.sub-btn.blue input[type=file] {
  margin: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
}
.pwsp-rotate {
  position: relative;
  color: #ffffff;
  margin-top: 10px;
  cursor: pointer;
  overflow: visible;
  float: right;
  width: 20px;
  height: 20px;
  z-index: 1111;
  margin-right: 150px;
}
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  // border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
  margin-right: 4px;
}
.demo-upload-list div{
  width: 60px;
  height: 60px;
  border-radius: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  // margin: 0 2px;
}
.text-center{
  bottom: 0px;
  position: initial;
  left: 50%;
  margin-left: -75px;
}
/* 上传图片组件样式 */
.upload-image-item input[type=file],
.sub-btn.blue input[type=file] {
  margin: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
}
.pwsp-rotate {
  position: relative;
  color: #ffffff;
  margin-top: 10px;
  cursor: pointer;
  overflow: visible;
  float: right;
  width: 20px;
  height: 20px;
  z-index: 1111;
  margin-right: 150px;
}
.pswp__button--zoom {
  display: block;
}
</style>
