// 音体美成绩管理-音体美考试管理-创建考试
<template>
  <div class="xy-content-module">
    <div class="xy-content-body clearfix">
      <div style="width:600px;min-height:750px;margin:0 auto;position: relative;">
        <Form ref="FormData" :model="FormData" :rules="FormRules" :label-width="140">
          <FormItem label="考试名称" prop="ExaminationName" labelFor="examName">
              <i-input v-model="FormData.ExaminationName" elementId="examName" placeholder="请输入考试名称"></i-input>
          </FormItem>
          <FormItem label="考试类型" prop="ExaminationType">
              <Select v-model="FormData.ExaminationType" @on-change="getAcademicSession">
                  <Option v-for="(item, index) in OptionList.ExaminationType" :value="item.Value" :key="index">
                      {{item.Text}}
                  </Option>
              </Select>
          </FormItem>
          <FormItem label="校区" prop="SchoolDistrictID">
              <Select v-model="FormData.SchoolDistrictID" @on-change="getStudentGrade">
                  <Option v-for="(item, index) in OptionList.SchoolDistrict" :value="item.SchoolDistrictID" :key="index">
                      {{item.SchoolDistrictName}}
                  </Option>
              </Select>
          </FormItem>
          <FormItem label="学年" prop="AcademicYearID">
              <Select v-model="FormData.AcademicYearID" @on-change="getAcademicSession">
                  <Option v-for="(item, index) in OptionList.AcademicYear" :value="item.ID" :key="index">
                      {{item.Name}}
                  </Option>
              </Select>
          </FormItem>
          <FormItem v-show="FormData.ExaminationType !== '1'" label="学期" prop="AcademicSessionID">
              <Select v-model="FormData.AcademicSessionID">
                  <Option v-for="(item, index) in OptionList.AcademicSession" :value="item.AcademicSessionID" :key="index">
                      {{item.AcademicSessionName}}
                  </Option>
              </Select>
          </FormItem>
          <FormItem label="年级" prop="StudentGradeID">
              <Select v-model="FormData.StudentGradeID" @on-change="getStudentYear">
                  <Option v-for="(item, index) in OptionList.StudentGrade" :value="item.StudentGradeID" :key="index">
                      {{item.StudentGradeName}}</Option>
              </Select>
          </FormItem>
          <FormItem label="学级" prop="StudentYearID">
              <Select v-model="FormData.StudentYearID">
                  <Option v-for="(item, index) in OptionList.StudentYear" :value="item.StudentYearID" :key="index">
                      {{item.StudentYearName}}</Option>
              </Select>
          </FormItem>
          <FormItem label="成绩录入 开始日期" prop="StartDate" labelFor="dataStart">
              <date-picker :editable="false" format="yyyy-MM-dd" elementId="dataStart" v-model="FormData.StartDate" type="date" placeholder="请输入开始日期" style="width: 100%">
              </date-picker>
          </FormItem>
          <FormItem label="成绩录入 结束日期" prop="EndDate" labelFor="dataEnd">
              <date-picker :editable="false" format="yyyy-MM-dd" elementId="dataEnd" v-model="FormData.EndDate" type="date" placeholder="请输入结束日期" style="width: 100%">
              </date-picker>
          </FormItem>
          <div style="line-height: 1;padding-left: 10em;color: #ed4014;" v-show="!validateDateSuccess">
              开始日期不得大于结束日期</div>
        </Form>
        <div class="text-center">
          <Button class="xy-btn-primary" :loading="loading" shape="circle" @click="create">
            <span v-if="!loading">保存</span>
            <span v-else>保存中...</span>
          </Button>
          <Button class="xy-btn-close" @click="cancle">取消</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'CreateExam',
    data () {
      return {
        loading: false,
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
          // 考试类型
          ExaminationType: undefined,
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
          ExaminationType: { required: true, message: '请选择考试类型' },
          SchoolDistrictID: { required: true, type: 'number', message: '请选择校区' },
          AcademicYearID: { required: true, type: 'number', message: '请选择学年' },
          StudentGradeID: { required: true, type: 'number', message: '请选择年级' },
          StudentYearID: { required: true, message: '请选择学级' },
          AcademicSessionID: { required: true, message: '请选择学期' },
          StartDate: [{ required: true, message: '成绩录入开始日期不能为空' }],
          EndDate: [{ required: true, message: '成绩录入结束日期不能为空' }]
        },
        OptionList: {
          ExaminationType: [],
          SchoolDistrict: [],
          AcademicYear: [],
          StudentGrade: [],
          StudentYear: [],
          AcademicSession: []
        },
        validateDateSuccess: true
      }
    },
    created () {
      this.getExaminationType()
      this.getSchoolDistrict()
      this.getAcademicYear()
    },
    watch: {
      'FormData.ExaminationType': {
        handler (val) {
          this.FormRules.AcademicSessionID.required = val !== '1'
        }
      },
      'FormData.StartDate': {
        handler (val) {
          this.compareDate(this.FormData.StartDate, this.FormData.EndDate)
        }
      },
      'FormData.EndDate': {
        handler (val) {
          this.compareDate(this.FormData.StartDate, this.FormData.EndDate)
        }
      }

    },
    mounted () {
    },
    methods: {
      // 获取：获取：考试类型
      async getExaminationType () {
        this.xy.loading()
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AemBase/GetExaminationType', null)
        this.xy.unloading()
        if (res.success) {
          this.OptionList.ExaminationType = res.data
          this.FormData.ExaminationType = res.data[0].Value
        }
      },
      // 获取：校区
      async getSchoolDistrict () {
        this.xy.loading()
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AemBase/GetSchoolDistrict', null)
        this.xy.unloading()
        if (res.success) {
          this.OptionList.SchoolDistrict = res.data
          this.FormData.SchoolDistrictID = res.data[0].SchoolDistrictID
          this.getStudentGrade()
        }
      },
      // 获取：学年
      async getAcademicYear () {
        this.xy.loading()
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AemBase/GetAcademicYear', null)
        this.xy.unloading()
        if (res.success) {
          this.OptionList.AcademicYear = res.data
          let index = res.data.map((item) => {
            return item.IsCurrent
          }).indexOf(true)
          if (index !== -1) {
            this.FormData.AcademicYearID = res.data[index].ID
          } else {
            this.FormData.AcademicYearID = res.data[0].ID
          }
        }
      },
      // 学期
      async getAcademicSession () {
        // 除 体侧考试 外均显示学期
        if (this.FormData.ExaminationType === '1') {
          return
        }
        let params = {
          AcademicYearID: this.FormData.AcademicYearID // 默认：0
        }
        this.xy.loading()
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AemBase/GetAcademicSession', params)
        this.xy.unloading()
        if (res.success) {
          this.OptionList.AcademicSession = res.data
          let index = res.data.map((item) => {
            return item.IsCurrent
          }).indexOf(true)
          if (index !== -1) {
            this.FormData.AcademicSessionID = res.data[index].AcademicSessionID
          } else {
            this.FormData.AcademicSessionID = res.data[0].AcademicSessionID
          }
        }
      },
      // 年级
      async getStudentGrade () {
        let params = {
          SchoolDistrictID: this.FormData.SchoolDistrictID // 默认：0
        }
        this.xy.loading()
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AemBase/GetStudentGradeBySchoolDistrictID', params)
        this.xy.unloading()
        if (res.success) {
          this.OptionList.StudentGrade = res.data
          this.FormData.StudentGradeID = res.data[0].StudentGradeID
          this.getStudentYear()
        }
      },
      // 学级
      async getStudentYear () {
        // 除 体侧考试 外均显示学期
        this.FormData.StudentYearID = ''
        let params = {
          SchoolDistrictID: this.FormData.SchoolDistrictID, // 校区ID
          StudentGradeID: this.FormData.StudentGradeID // 年级ID
        }
        this.xy.loading()
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AemBase/GetStudentYearBySchoolDistrictIDAndStudentGradeID', params)
        this.xy.unloading()
        if (res.success) {
          this.OptionList.StudentYear = res.data
          this.FormData.StudentYearID = res.data[0].StudentYearID
        }
      },
      // 比较日期：结束日期不得大于开始日期
      compareDate (StartDate, EndDate) {
        if (typeof StartDate === 'object' && typeof EndDate === 'object') {
          let s = this.xy.moment(StartDate).format('YYYY-MM-DDT00:00:00')
          let e = this.xy.moment(EndDate).format('YYYY-MM-DDT23:59:59')
          this.validateDateSuccess = s <= e
        }
      },
      cancle () {
        this.$router.go(-1)
      },
      async create () {
        let valid = await this.$refs.FormData.validate()
        if (!valid) {
          this.loading = false
        } else {
          this.insert()
        }
      },
      async insert () {
        this.loading = true
        let params = this.FormData
        params.StartDate = this.xy.moment(params.StartDate).format('YYYY-MM-DDT00:00:00')
        params.EndDate = this.xy.moment(params.EndDate).format('YYYY-MM-DDT23:59:59')
        if (params.ExaminationType === '1') {
          params.AcademicSessionID = undefined
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Examination/ExaminationInsert`, params)
        if (res.success) {
          this.loading = false
          this.xy.msgSuc('创建成功。')
          this.$router.go(-1)
        }
        this.loading = false
      }
    } }
</script>

<style lang="less" scpoed>
</style>
