// 访客管理详情页面通用组件
<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div style="width:600px;min-height:750px;margin:57px auto 0 auto;position: relative;">
        <Form ref="formValidateCreate" :model="formValidateCreate" :label-width="120">
          <div class="officeStatus">
            <!---已撤销--->
            <img v-if="rowData.ApprovalStatus === 4" class="no-data-img" :src="approvalImg[1]" />
            <!---已拒绝--->
            <img v-else-if="rowData.ApprovalStatus === 3" class="no-data-img"  :src="approvalImg[0]" />
            <!---已拜访---->
            <img v-else-if="rowData.ApprovalStatus === 2 && rowData.VisitStatus === 6" :src="approvalImg[3]" />
            <!---待拜访---->
            <img v-else-if="rowData.ApprovalStatus === 2 && rowData.VisitStatus === 5" :src="approvalImg[2]" />
            <!---待审批 【暂无设计图片】---->
            <!-- <img v-else-if="row.ApprovalStatus === 1" :src="approvalImg[0]"/>-->
            <!---已逾期---->
            <img v-else-if="rowData.VisitStatus === 7" :src="approvalImg[4]"/>
          </div>
          <FormItem :label-width="10">
            <span class="avatar">
              <span  :title="username" class="left fl" >{{xy.showName(rowData.VisitorName)}}</span>
            </span>
            <span style="font-size:18px;font-weight:bold;">{{rowData.VisitorName}}提交的拜访申请</span>
            <br>
            <span style="font-size:14px;font-weight:400;color:#606060;margin-left:15px">{{rowData.CreateTimeStr}}</span>
          </FormItem>
          <div style="border-top:1px solid #f5f5f5;padding-bottom:20px;">
          </div>
          <FormItem label="参访人姓名" class="visit-item">
            <span>{{rowData.VisitorName}}</span>
          </FormItem>
          <FormItem label="性别" class="visit-item">
            <span>{{rowData.Sex === 0 ? '女' : '男'}}</span>
          </FormItem>
          <FormItem label="身份证号" class="visit-item">
            <span>{{rowData.VisitorIdCard}}</span>
          </FormItem>
          <FormItem label="手机号码" class="visit-item">
            <span>{{rowData.VisitorPhoneNumber}}</span>
          </FormItem>
          <FormItem label="所在单位" class="visit-item">
            <span>{{rowData.VisitorCompanyAddress}}</span>
          </FormItem>
          <FormItem label="受访人" class="visit-item">
            <span>{{rowData.InterviewName}}</span>
          </FormItem>
          <FormItem label="入校时间" class="visit-item" v-if="rowData.VisitStatus===6">
            <span>{{rowData.ActualVisitInTimeStr}}</span>
          </FormItem>
          <FormItem label="出校时间" class="visit-item" v-if="rowData.VisitStatus===6&&rowData.ActualVisitOutTime.Valid">
            <span>{{rowData.ActualVisitOutTimeStr}}</span>
          </FormItem>
          <FormItem label="预约拜访时间" class="visit-item" v-if="rowData.VisitStatus!==6">
            <span>{{rowData.ApplicationVisitTimeStr}}</span>
          </FormItem>
          <FormItem label="拜访事宜" class="visit-item">
            <span>{{rowData.VisitReason}}</span>
          </FormItem>
          <div style="border-top:1px solid #f5f5f5;padding-bottom:22px;margin-top: 22px;">
          </div>
          <!-- 待审批且可以审批 -->
          <FormItem label="审批结果" style="margin-bottom: 14px" prop=""  v-if="rowData.ApprovalStatus===1&&rowData.VisitStatus!==7">
            <RadioGroup v-model="radioVal" @on-change="changeType">
                <Radio label="2">
                    <span>同意</span>
                </Radio>
                <Radio label="3">
                    <span>拒绝</span>
                </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="审批意见" prop="formApplicationDescription" labelFor="description"  v-if="rowData.ApprovalStatus===1&&rowData.VisitStatus!==7">
            <i-input
              v-model="formValidateCreate.formApplicationDescription"
              type="textarea"
              maxlength="100"
              show-word-limit
              :rows="8"
              placeholder="请输入"
              elementId="description"
              >
            </i-input>
          </FormItem>
          <!-- 待拜访 -->
          <FormItem label="审批结果" style="margin-bottom: 14px" v-if="showChange">
            <RadioGroup v-model="radioVal1" @on-change="changeType">
                <Radio label="2" :disabled="disabled">
                    <span>同意</span>
                </Radio>
                <Radio label="3" :disabled="disabled">
                    <span>拒绝</span>
                </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="审批意见" prop="formApplicationDescription" labelFor="formApplicationDescription" v-if="showChange" >
            <i-input
              v-model="formValidateCreate.formApplicationDescription"
              show-word-limit
              type="textarea"
              elementId="formApplicationDescription"
              maxlength="100"
              :rows="8"
              placeholder="请输入"
              >
            </i-input>
          </FormItem>
          <!-- 其他 -->
          <FormItem label="审批结果" class="visit-item" v-if="rowData.ApprovalStatus!==1 && !showChange">
            <span>{{rowData.ApprovalStatusName}}</span>
          </FormItem>
          <FormItem label="审批意见" v-if="rowData.ApprovalStatus!==1 && !showChange">
            <span>{{rowData.ApprovalComment}}</span>
          </FormItem>
          <!-- 其他 -->
          <FormItem label="审批结果" class="visit-item" v-if="rowData.VisitStatus===7">
            <span>{{rowData.ApprovalStatusName}}</span>
          </FormItem>
        </Form>
        <div class="text-center-v" v-if="rowData.ApprovalStatus===1&&rowData.VisitStatus!==7">
          <Button class="xy-btn-primary" shape="circle" @click="create">确认</Button>
          <Button class="xy-btn-close" @click="cancle">取消</Button>
        </div>
        <div class="text-center" v-if="rowData.ApprovalStatus!==1&&rowData.ApprovalStatus!==3&&rowData.ApprovalStatus!==4&&rowData.VisitStatus===5&&!showChange">
          <Button class="xy-btn-primary" shape="circle" @click="changeDetail">更改审批</Button>
        </div>
        <div class="text-center-v" v-if="showChange">
          <Button class="xy-btn-primary" shape="circle" @click="create">确认</Button>
          <Button class="xy-btn-close" @click="cancle">取消</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'create',
    data () {
      return {
        radioVal: '2',
        radioVal1: '2',
        username: 'm,,,,',
        formValidateCreate: {
          formApplicationDescription: ''
        },
        showChange: false,
        IsCanApproval: null,
        disabled: false,
        checked: false,
        rowsId: null,
        rowData: {},
        approvalImg: [
          require('@/assets/common/attendance/seal-refuse.png'),
          require('@/assets/common/attendance/seal-undo.png'),
          require('@/assets/common/attendance/visit_ing.png'),
          require('@/assets/common/attendance/visit_old.png'),
          require('@/assets/common/attendance/yuqi_b.png')
        ]
      }
    },
    computed: {
      row () {
        return this.$store.state.common.msgParam !== '' ? JSON.parse(this.$store.state.common.msgParam) : {}
      }
    },
    watch: {
      row: {
        handler (newVal) {
          let rows = newVal
          console.log(rows)
          this.rowsId = rows.BusinessID
          this.getDeatils(rows.BusinessID)
        },
        immediate: true
      },
      rowData: {
        handler (newVal) {
          console.log(newVal)
        }
      }
    },
    methods: {
      changeDetail () {
        this.showChange = true
        this.formValidateCreate.formApplicationDescription = this.rowData.ApprovalComment
        if (this.rowData.ApprovalStatus === 2) {
          this.radioVal1 = String(this.rowData.ApprovalStatus)
          this.checked = true
        } else {
          this.disabled = true
        }
      },
      changeType (value) {
        this.radioVal = value
        this.radioVal1 = value
      },
      async getDeatils (id) {
        this.xy.loading()
        let res = await this.xy.get(this.xyApi + '/vst' + '/visitor/GetUserVisitorDetailByVisitorRecordID', {
          VisitorRecordID: id
        })
        if (res.success) {
          this.xy.unloading()
          this.rowData = res.data
        }
      },
      cancle () {
        this.$router.go(-1)
      },
      create () {
        let params = {
          VisitorRecordID: this.rowsId,
          ApprovalStatus: this.showChange ? Number(this.radioVal1) : Number(this.radioVal),
          ApprovalComment: this.formValidateCreate.formApplicationDescription,
          MobileUrl: this.xyMobileUrl // 后台发短息需要 区分不同端
        }
        this.xy.post(this.xyApi + '/vst' + `/visitor/UpdateUserVisitorDetailApprovalStatus`, params).then(res => {
          if (res.success) {
            this.xy.msgSuc('审批成功。')
            this.$router.go(-1)
          }
        })
      }
    }
  }
</script>

<style lang="less" scpoed>
.avatar{
  padding:0;
  padding-right:15px;
  span{
    display:block;
    background:#4196ff;
    width:50px;height:50px;
    border-radius:50%;
    text-align:center;
    line-height:50px;
    font-size:18px;
    color:#fff
  }
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
.text-center-v{
  bottom: 0px;
  position: initial;
  left: 50%;
  margin-left: 120px;
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
.officeStatus{
  position: absolute;
  right: 0px;
  top: -20px;
  width: 110px;
  height: 110px;
}
.officeStatus img {
  width: 100%;
  height: 100%;
}
.visit-item{
 margin-bottom: 6px;
}
</style>
