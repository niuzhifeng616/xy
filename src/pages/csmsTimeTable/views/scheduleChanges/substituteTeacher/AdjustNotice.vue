<!--调课通知  -->
<template>
  <div class="xy-content-body">
    <i-table ref="selection"
             :columns="columns"
             class="adjust-table"
             :data="dataTable"></i-table>
    <div class="right-box">
      <h5>被代课人信息</h5>
      <div style="display:flex;align-items:center;margin:15px 0 ">
        <div class="notice-ajust-person">{{notifyInfoData.substrName}}</div>
        <div style="margin-left:10px;text-align:left">
          <div style="font-weight:700">{{notifyInfoData.SourceTeacherName}}</div>
        </div>
      </div>
      <Input v-model="adjustmentReason"
             :disabled="isShowReason"
             type="textarea"
             :rows="8"
             placeholder="请填写代课原因" />
      <div style="margin-top:15px;">共有效{{notifyInfoData.EffectiveWeek}}周</div>
      <div class="text-left"
           style="margin-top:15px;">
        <Checkbox v-model="isExport">导出代课单</Checkbox>
        <Checkbox style="margin-left:24px;"
                  v-model="isOnlineNotice">在线通知</Checkbox>
      </div>
      <div class="fix-btn">
        <Button class="xy-btn-close"
                shape="circle"
                @click="back">取消</Button>
        <Button class="xy-btn-primary"
                shape="circle"
                @click="addClassNotice">保存</Button>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        isExport: true, // 导出代课单
        isOnlineNotice: true, // 在线通知
        classTableGenerateForSubstituteTeacherID: 0,
        columns: [
          {
            title: '班级',
            key: 'CoursePlanTableFullName',
            minWidth: 150
          },
          {
            title: '课程',
            key: 'SubjectName',
            minWidth: 150
          },
          {
            title: '上课时间',
            key: 'FullClassDate',
            width: 260
          },
          {
            title: '代课教师',
            key: 'SubstituteTeacherName',
            width: 150
          }
        ],
        dataTable: [],
        notifyInfoData: [],
        adjustmentReason: '',
        isShowReason: true,
        isNotice: false,
        loadSource: 1// 1-列表、2-创建或者继续
      }
    },
    created: function () {
      this.classTableGenerateForSubstituteTeacherID = this.$store.state.common.menuInfo.classTableGenerateForSubstituteTeacherID
      if (this.$store.state.common.menuInfo.loadSource !== undefined) {
        this.loadSource = this.$store.state.common.menuInfo.loadSource
      }
    },
    mounted: function () {
      this.getSubstituteInfo()
    },
    methods: {
      back: function () {
        this.$store.commit('common/getThreeMenuName', '')
        this.$router.push({ path: '/xyhome/substituteTable', query: this.$store.state.common.menuInfo })
      },
      async getSubstituteInfo () {
        let that = this
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SubstituteCourseAdjustmentCourse/GetSubstituteInfo?classTableGenerateForSubstituteTeacherID=${that.classTableGenerateForSubstituteTeacherID}`)
        if (res.success) {
          if (res.data.Description == null || res.data.Description === '') {
            that.isShowReason = false
          } else {
            that.adjustmentReason = res.data.Description
          }
          that.notifyInfoData = res.data
          this.$set(this.notifyInfoData, 'substrName', this.notifyInfoData.SourceTeacherName.substr(0, 1))
          that.dataTable = res.data.Details
        }
        this.xy.unloading()
      },
      // 调课通知
      async addClassNotice () {
        if (this.isShowReason) {
          if (!this.isOnlineNotice && !this.isExport) {
            this.xy.msgError('请勾选:导出代课单或在线通知。')
            return false
          }
          if (this.isExport) {
            this.expert()
          }
          if (this.isOnlineNotice) {
            this.notify()
          }
          this.back()
        } else {
          if (!this.adjustmentReason) {
            this.xy.msgError('请填写代课原因。')
            return false
          };
          if (this.adjustmentReason.length > 100) {
            this.xy.msgError('代课原因字数限制1-100字符。')
            return false
          };
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SubstituteCourseAdjustmentCourse/EompleteSubstituteTeacher`, {
            ClassTableGenerateForSubstituteTeacherID: this.classTableGenerateForSubstituteTeacherID,
            Description: this.adjustmentReason
          })

          if (res.success) {
            if (this.isExport) {
              this.expert()
            }
            if (this.isOnlineNotice) {
              this.notify()
            }
            this.back()
          }
        }
      },
      async notify () {
        let that = this
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SubstituteCourseAdjustmentCourse/Notify?classTableGenerateForSubstituteTeacherID=${that.classTableGenerateForSubstituteTeacherID}&description=${that.adjustmentReason}`)
        if (res.success) {
          this.xy.msgSuc('通知发送成功。')
        }
        this.xy.unloading()
      },
      expert: function () {
        let that = this
        this.xy.downFile(`${this.$store.state.apiPath}/api/SubstituteCourseAdjustmentCourse/Expert?classTableGenerateForSubstituteTeacherID=${that.classTableGenerateForSubstituteTeacherID}`)
      }
    }
  }
</script>
<style lang='less' scoped>
.xy-content-body {
  display: flex;
  .adjust-table {
    width: calc(100% - 300px);
    border-right: 1px solid #ebeef5;
    /deep/.ivu-table {
      width: 100%;
    }
  }
  .right-box {
    width: 300px;
    margin-left: 10px;
    h5 {
      font-weight: 700;
    }
    .teacher-info {
      .icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        font-size: 14px;
        font-weight: 700;
      }
    }
  }
  .notice-ajust-person {
    width: 42px;
    height: 42px;
    line-height: 42px;
    background: rgba(65, 150, 255, 1);
    border-radius: 50%;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    text-align: center;
  }
  .fix-btn {
    height: 50px;
    position: fixed;
    line-height: 50px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 4px 0px rgba(163, 173, 186, 0.4);
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: right;
    button {
      margin-right: 20px;
    }
  }
}
</style>
