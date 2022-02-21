<!-- 4.调代课审批的代课详情 -->
<template>
  <div class='xy-content-module'>
    <div class='xy-content-title'>
    </div>
    <div class="xy-content-body">
        <div class="approval-details" style="margin-bottom:56px;">
            <h3 class="title">代课申请</h3>
            <div class="detail-info">
                <label class="label">代课原因：</label>
                <span>{{applyInfo.Description}}</span>
            </div>
            <table class="approval-details-table">
                <thead>
                    <tr>
                        <th>班级</th>
                        <th>课程</th>
                        <th>上课时间</th>
                        <th>原任课教师</th>
                        <th>新代课教师</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in applyInfo.Details" :key="index">
                        <td>{{item.CoursePlanTableFullName}}</td>
                        <td>{{item.SubjectName}}</td>
                        <td>
                            <div>第{{item.Week}}周{{item.TimeDesc}}</div>
                            <div>（{{item.StartDate}}）</div>
                        </td>
                        <td>{{item.SourceTeacherName}}</td>
                        <td>{{item.SubstituteTeacherName}}</td>
                    </tr>
                </tbody>
            </table>
            <!-- 已撤销 -->
            <div v-if="applyInfo.SubstituteStatus===6">
                <div class="detail-info">
                    <label class="label">审批状态：</label>
                    <span>{{applyInfo.SubstituteStatusName}}</span>
                </div>
                <div class="detail-info">
                    <label class="label">撤销时间：</label>
                    <span v-if="applyInfo.ApproverDate !=='0001-01-01 00:00:00'">{{applyInfo.ApproverDate}}</span>
                </div>
            </div>
            <!-- 未通过 -->
            <div v-if="applyInfo.SubstituteStatus===3">
                <div class="detail-info">
                    <label class="label">审批状态：</label>
                    <span>{{applyInfo.SubstituteStatusName}}</span>
                </div>
                <div class="detail-info">
                    <label class="label">审批人：</label>
                    <span>{{applyInfo.ApproverName}}</span>
                </div>
                <div class="detail-info">
                    <label class="label">审批时间：</label>
                    <span v-if="applyInfo.ApproverDate !=='0001-01-01 00:00:00'">{{applyInfo.ApproverDate}}</span>
                </div>
                <div class="detail-info clearfix">
                    <label class="label fl">未通过原因：</label>
                    <div class="fl" style="width: calc(100% - 90px);">
                        <p style="width: calc(100% - 90px);" v-for="(item,index) in applyInfo.Explain" :key="index">{{index+1}}、{{item}}</p>
                    </div>
                </div>
            </div>
            <!-- 已通过 -->
            <div v-if="applyInfo.SubstituteStatus===2">
                <div class="detail-info">
                    <label class="label">审批状态：</label>
                    <span>{{applyInfo.SubstituteStatusName}}</span>
                </div>
                <div class="detail-info">
                    <label class="label">审批人：</label>
                    <span>{{applyInfo.ApproverName}}</span>
                </div>
                <div class="detail-info">
                    <label class="label">审批时间：</label>
                    <span v-if="applyInfo.ApproverDate !=='0001-01-01 00:00:00'">{{applyInfo.ApproverDate}}</span>
                </div>
                <div class="detail-info clearfix">
                    <label class="label fl">审批意见：</label>
                    <div class="fl" style="width: calc(100% - 90px);">
                        <p style="width: calc(100% - 90px);" v-for="(item,index) in applyInfo.Explain" :key="index">{{index+1}}、{{item}}</p>
                    </div>
                </div>
            </div>
            <!-- 已拒绝 -->
            <div v-if="applyInfo.SubstituteStatus===4">
                <div class="detail-info">
                    <label class="label">审批状态：</label>
                    <span>{{applyInfo.SubstituteStatusName}}</span>
                </div>
                <div class="detail-info">
                    <label class="label">审批人：</label>
                    <span>{{applyInfo.ApproverName}}</span>
                </div>
                <div class="detail-info">
                    <label class="label">审批时间：</label>
                    <span v-if="applyInfo.ApproverDate !=='0001-01-01 00:00:00'">{{applyInfo.ApproverDate}}</span>
                </div>
                <div class="detail-info clearfix">
                    <label class="label fl">审批意见：</label>
                    <div class="fl" style="width: calc(100% - 90px);">
                        <p style="width: calc(100% - 90px);" v-for="(item,index) in applyInfo.Explain" :key="index">{{index+1}}、{{item}}</p>
                    </div>
                </div>
            </div>
            <!-- 已过期 -->
            <div v-if="applyInfo.SubstituteStatus===5">
                <div class="detail-info">
                    <label class="label">审批状态：</label>
                    <span>{{applyInfo.SubstituteStatusName}}</span>
                </div>
                <div class="detail-info">
                    <label class="label">提交时间：</label>
                    <span v-if="applyInfo.CreateByDate !=='0001-01-01 00:00:00'">{{applyInfo.CreateByDate}}</span>
                </div>
            </div>
            <!-- 已撤回 -->
            <div v-if="applyInfo.SubstituteStatus===7">
                <div class="detail-info">
                    <label class="label">审批状态：</label>
                    <span>{{applyInfo.SubstituteStatusName}}</span>
                </div>
                <div class="detail-info">
                    <label class="label">提交时间：</label>
                    <span v-if="applyInfo.CreateByDate !=='0001-01-01 00:00:00'">{{applyInfo.CreateByDate}}</span>
                </div>
            </div>
        </div>
        <div class="text-center">
            <Button class="xy-btn-close" @click="back">关闭</Button>
            <Button class="xy-btn-primary" shape="circle" @click="exportFile" v-if="applyInfo.SubstituteStatus===2">导出通知</Button>
        </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'TLArranging',
    data () {
      return {
        applyData: null,
        applyInfo: {
          Description: '',
          Data: [],
          ApproverDate: '',
          ApproverName: '',
          CreateByDate: '',
          CreateName: '',
          Explain: [],
          SubstituteStatusName: '',
          SubstituteStatus: '',
          info: '',
          type: 0,
          DetailParameter: '',
          ServiceDoMainName: ''
        },
        info: {},
        ServiceDoMainName: ''

      }
    },
    created () {
      if (this.$store.state.common.msgParam !== '') {
        this.info = JSON.parse(this.$store.state.common.msgParam)
        this.ServiceDoMainName = this.info.ServiceDoMainName
        this.applyData = {
          ID: this.info.BusinessID
        }
      }
    },
    mounted () {
      this.getSubstituteInfo()
    },
    methods: {
      // 代课
      async getSubstituteInfo () {
        this.xy.loading()
        let res = await this.xy.get(`${this.ServiceDoMainName}/api/ClassTableGenerateForTeacherSubstituteApply/GetSubstituteInfo`, {
          classTableGenerateForTeacherSubstituteApplyID: this.applyData.ID
        })
        if (res.success) {
          this.applyInfo = res.data
        }
        this.xy.unloading()
      },
      // 导出通知
      exportFile () {
        this.xy.downFile(`${this.ServiceDoMainName}/api/ClassTableGenerateForTeacherSubstituteApply/Expert?classTableGenerateForTeacherSubstituteApplyID=${this.applyData.ID}`)
      },
      // 关闭
      back () {
        this.$router.push('/xyHome/message')
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../css/adjustSubstituteMsg.css';
</style>
