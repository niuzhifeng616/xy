// 音体美成绩管理-音体美考试管理-编辑考试
<template>
  <div class="xy-content-module">
    <div class="xy-content-body clearfix">
      <div style="width:600px;min-height:750px;margin:0 auto;position: relative;">
        <Form ref="FormData" :model="FormData" :rules="FormRules" :label-width="140">
          <FormItem label="考试名称" labelFor="examName" prop="ExaminationName">
              <i-input v-model="FormData.ExaminationName" elementId="examName" placeholder="请输入考试名称"></i-input>
          </FormItem>
          <FormItem label="考试类型">
              <i-input disabled :value="FormData.ExaminationTypeName"></i-input>
          </FormItem>
          <FormItem label="校区">
              <i-input disabled :value="FormData.SchoolDistrictName"></i-input>
          </FormItem>
          <FormItem label="学年">
              <i-input disabled :value="FormData.AcademicYearName"></i-input>
          </FormItem>
          <FormItem v-show="ExaminationType !== 1" label="学期">
              <i-input disabled :value="FormData.AcademicSessionName"></i-input>
          </FormItem>
          <FormItem label="年级">
              <i-input disabled :value="FormData.StudentGradeName"></i-input>
          </FormItem>
          <FormItem label="学级">
              <i-input disabled :value="FormData.StudentYearName"></i-input>
          </FormItem>
          <FormItem label="成绩录入 开始日期" labelFor="dataStart" prop="StartDate">
              <date-picker :editable="false" elementId="dataStart" format="yyyy-MM-dd" v-model="FormData.StartDate" type="date" placeholder="请输入开始日期" style="width: 100%"/>
          </FormItem>
          <FormItem label="成绩录入 结束日期" labelFor="dataEnd" prop="EndDate">
              <date-picker :editable="false" elementId="dataEnd" format="yyyy-MM-dd" v-model="FormData.EndDate" type="date" placeholder="请输入结束日期" style="width: 100%"/>
          </FormItem>
        </Form>
        <div class="text-center">
          <Button class="xy-btn-primary" shape="circle" @click="edit">提交</Button>
          <Button class="xy-btn-close" @click="cancle">取消</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'EditExam',
    data () {
      return {
        ExaminationType: this.$store.state.common.menuInfo.ExaminationType,
        ExaminationID: this.$store.state.common.menuInfo.ExaminationID,
        FormData: {
          // 考试名称
          ExaminationName: undefined,
          // 校区ID
          SchoolDistrictID: undefined,
          // 学年ID，默认：0
          AcademicYearID: undefined,
          // 学期ID
          AcademicSessionID: undefined,
          // 学级ID
          StudentYearID: undefined,
          // 年级ID
          StudentGradeID: undefined,
          // 成绩录入 开始、结束日期
          StartDate: undefined,
          EndDate: undefined,
          IsPublished: false
        },
        FormRules: {
          ExaminationName: [
            { required: true, message: '请输入考试名称' },
            { max: 15, message: '最多输入15个字符' }
          ],
          StartDate: [{ required: true, message: '成绩录入开始日期不能为空' }, {
            type: 'date', message: '请输入日期'
          }],
          EndDate: [{ required: true, message: '成绩录入结束日期不能为空' }, {
            type: 'date', message: '请输入日期'
          }]
        }
      }
    },
    created () {
      this.getDetail()
    },
    methods: {
      // 详情
      async getDetail () {
        let params = {
          ExaminationID: this.ExaminationID
        }
        this.xy.loading()
        let res = await this.xy.get(this.$store.state.apiPath + '/api/Examination/GetExaminationByID', params)
        this.xy.unloading()
        if (res.success) {
          this.FormData = res.data
        }
      },
      cancle () {
        this.$router.go(-1)
      },
      edit () {
        this.$refs.FormData.validate((valid) => {
          if (valid) {
            this.xy.loading()
            let params = {
              ExaminationID: this.FormData.ExaminationID,
              ExaminationName: this.FormData.ExaminationName,
              StartDate: this.xy.moment(this.FormData.StartDate).format('YYYY-MM-DDT00:00:00'),
              EndDate: this.xy.moment(this.FormData.EndDate).format('YYYY-MM-DDT23:59:59')
            }
            if (params.StartDate < params.EndDate) {
              this.xy.post(`${this.$store.state.apiPath}/api/Examination/ExaminationModify`, params).then(res => {
                this.xy.unloading()
                if (res.success) {
                  this.xy.msgSuc('编辑成功。')
                  this.$router.go(-1)
                }
              })
            } else {
              this.xy.msgError('开始日期不得大于结束日期。')
              this.xy.unloading()
            }
          } else {
            this.xy.unloading()
            this.xy.msgError('请检查填写内容。')
          }
        })
      }
    }
  }
</script>

<style lang="less" scpoed>
</style>
