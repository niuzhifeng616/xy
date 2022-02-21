<!-- 5.调代课审批的调课审批 -->
<template>
  <div class='xy-content-module'>
    <div class='xy-content-title'>
    </div>
    <div class="xy-content-body">
        <div class="approval-details" style="margin-bottom:56px;">
            <h3 class="title">调代课申请</h3>
            <div class="detail-info">
                <label class="label">调课原因：</label>
                <span>{{applyInfo.Description}}</span>
            </div>
            <table class="approval-details-table">
                <thead>
                    <tr>
                        <th>班级</th>
                        <th>课程</th>
                        <th>教师</th>
                        <th>原上课时间</th>
                        <th>新上课时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in applyInfo.Data" :key="index">
                        <td>{{item.StudentOrganizationFullName}}</td>
                        <td>{{item.SourceSubjectName}}</td>
                        <td>{{item.SourceTeacherNames}}</td>
                        <td>
                            <div>第{{item.SourceWeek}}周{{item.SourceWeekName}}{{item.SourceInfo}}</div>
                            <div v-if="item.SourceClassDate!== '0001-01-01'">（{{item.SourceClassDate}}）</div>
                        </td>
                        <td>
                            <div>第{{item.TargetWeek}}周{{item.TargetWeekName}}{{item.TargetInfo}}</div>
                            <div v-if="item.SourceClassDate!== '0001-01-01'">（{{item.TargetClassDate}}）</div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- 待审批 -->
            <div v-if="applyInfo.SubstituteStatus===1">
                <div class="detail-info">
                    <label class="label">审批状态：</label>
                    <radio-group v-model="state">
                        <radio label="true">
                            <span class="f14">同意</span>
                        </radio>
                        <radio label="false">
                            <span class="f14">拒绝</span>
                        </radio>
                    </radio-group>
                </div>
                <div class="detail-info">
                    <label class="label">审批意见：</label>
                    <Input type="textarea" :rows="8"
                             v-model="opinions"
                             :disabled="applyInfo.SubstituteStatus !== 1"
                             placeholder="请填写审批意见" />
                </div>
            </div>
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
                    <span>未通过</span>
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
                        <p style="width: calc(100% - 90px);" v-for="(item,index) in applyInfo.Explain" :key="index">
                            {{index+1}}、{{item}}
                        </p>
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
                        <p style="width: calc(100% - 90px);" v-for="(item,index) in applyInfo.Explain" :key="index">
                            {{index+1}}、{{item}}
                        </p>
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
                        <p style="width: calc(100% - 90px);" v-for="(item,index) in applyInfo.Explain" :key="index">
                            {{index+1}}、{{item}}
                        </p>
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
        <div class="text-center" style="position:absolute;bottom:20px;left:50%;margin-left:-116px;">
            <Button class="xy-btn-close" @click="back">关闭</Button>
            <Button class="xy-btn-primary" shape="circle" @click="exportFile" v-if="applyInfo.SubstituteStatus===2">导出通知</Button>
            <Button class="xy-btn-primary" shape="circle" @click="submit" v-if="applyInfo.SubstituteStatus === 1">确定</Button>
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
          SubstituteStatus: ''
        },
        state: '', // 同意、拒绝
        opinions: '',
        info: '',
        type: 0,
        DetailParameter: '',
        ServiceDoMainName: ''
      }
    },
    created () {
      if (this.$store.state.common.msgParam !== '') {
        this.info = JSON.parse(this.$store.state.common.msgParam)
        this.ServiceDoMainName = this.info.ServiceDoMainName
        this.applyData = {
          ID: this.info.BusinessID,
          SubstituteStatus: this.info.Status
        }
      }
    },
    mounted () {
      this.getAdjustInfo()
    },
    methods: {
      // 调课
      async getAdjustInfo () {
        this.xy.loading()
        let res = await this.xy.get(`${this.ServiceDoMainName}/api/ClasstableGenerateForTeacherAdjustmentApply/GetTeaherApplyInfo`, {
          appilyID: this.applyData.ID
        })
        if (res.success) {
          this.applyInfo = res.data
        }
        this.xy.unloading()
      },
      async OneCycleApply () { // 单周调课提交
        if (this.state === '') {
          this.xy.msgError('请选择审批结果。')
          return false
        };
        if (this.opinions.length > 100) {
          this.xy.msgError('审批意见限制100字符。')
          return false
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.ServiceDoMainName}/api/ClassTableGenerateForTeacherApplyExamine/OneCycleApply`, {
          ID: this.applyData.ID,
          Status: this.state,
          OpinionDescription: this.opinions
        })
        if (res.success) {
          this.xy.msgSuc('审批成功。')
          this.back()
        }
        this.xy.unloading()
      },
      async crossCycleApply () { // 跨周调课提交
        if (this.state === '') {
          this.xy.msgError('请选择审批结果。')
          return false
        };
        if (this.opinions.length > 100) {
          this.xy.msgError('审批意见限制100字符。')
          return false
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.ServiceDoMainName}/api/ClassTableGenerateForTeacherApplyExamine/CrossCycleApply`, {
          ID: this.applyData.ID,
          Status: this.state,
          OpinionDescription: this.opinions
        })
        if (res.success) {
          this.xy.msgSuc('审批成功。')
          this.back()
        }
        this.xy.unloading()
      },
      // 提交
      submit () {
        if (this.applyData.IsCrossWeeks) { // 跨周
          this.crossCycleApply()
        } else { // 单周
          this.OneCycleApply()
        }
      },
      // 导出通知
      exportFile () {
        this.xy.downFile(`${this.ServiceDoMainName}/api/ClasstableGenerateForTeacherAdjustmentApply/Expert?ClassTableGenerateForTeacherAdjustmentApplyID=${this.applyData.ID}`)
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
