<template>
   <div class="creat">
    <div class="xy-content-body">
      <div style="width:40vw;margin:16px auto; ">
         <Form ref="formValidateOK" :model="formValidateOK" :rules="ruleValidateOK" style="width:500px;" :label-width='140'>
              <FormItem label="方案名称:" prop="StarProgrammeName" label-for="StarProgrammeName">
                  <i-input element-id="StarProgrammeName" v-model.trim="formValidateOK.StarProgrammeName" clearable style="width: 34vw;" :autofocus="true" placeholder="请输入方案名称"></i-input>
              </FormItem>
              <FormItem label="校区:" prop="school" label-for="school">
                  <Select element-id="school" v-model="formValidateOK.school"
                            @on-change="schoolChange"
                            :placeholder="isSchool ? '' :'请选择校区'"
                            style="width: 34vw;">
                      <Option v-for="school in schoolData" :value="school.value" :key="school.label" v-cloak>{{ school.label }}</Option>
                  </Select>
              </FormItem>

              <FormItem label="年级:" prop="gradeYear">
                  <Select v-model="formValidateOK.gradeYear"
                            :label="formValidateOK.gradeYear"
                            :placeholder="classPlan.ProgrammeID&&isGradeYear ? '' :'请选择年级'"
                            style="width: 34vw;">
                      <Option v-for="year in studentGradeData" :value="year.value" :key="year.label" v-cloak>{{ year.label }}</Option>
                  </Select>
              </FormItem>
              <FormItem>
                <div style='width:500px; margin-top: 16px;'>
                  <Button class="xy-btn-primary" shape="circle" :loading="loading" :disabled="StepsHeader.rowObj.IsEnable" @click="save">
                      <span v-if="!loading">保存</span>
                      <span v-else>保存中...</span>
                  </Button>
                </div>
              </FormItem>

          </Form>
      </div>
    </div>
   </div>
</template>
<script>
  export default {
    name: 'PlanCreat',
    data () {
      return {
        loading: false,
        /// /添加的验证
        formValidateOK: {
          StarProgrammeName: '',
          school: '',
          session: [],
          gradeYear: '',
          EvaluationObject: '1'
        },
        studentGradeForStudentYearID: 0,
        studentGradeName: '',
        ruleValidateOK: {
          school: [{
            type: 'number',
            required: true,
            message: '请选择校区',
            trigger: 'change'
          }],
          session: [{
            type: 'array',
            required: true,
            message: '请选择学年学期',
            trigger: 'change'
          }],
          gradeYear: [{
            type: 'number',
            required: true,
            message: '请选择年级',
            trigger: 'change'
          }],
          StarProgrammeName: [
            {
              required: true,
              message: '方案名称不能为空',
              trigger: 'blur'
            },
            {
              max: 20,
              message: '方案名称不能超过20个字',
              trigger: 'blur'
            }
          ]
        },

        schoolData: [],
        studentGradeData: [],
        yearSessionData: [],
        // 方案信息
        StepsHeader: {},
        classPlan: {},
        isSchool: true, // 请选择学校
        isGradeYear: true, // 请选择年级
        matching: [], // 匹配后加的参数
        StudentGradeID: '',
        StudentYearID: '',
        ProgrammeID: ''// 编辑
        // isOperation是否可以启动
      }
    },
    created () {
      this.StepsHeader = this.$parent
      this.classPlan = this.$store.state.evaluate.dipperObj
      this.GetClassTable()
    },
    mounted: function () {

    },
    watch: {
      'formValidateOK.school' (newV, oldV) {
        if (newV) {
          this.isSchool = true
        } else {
          this.isSchool = false
        }
      },
      'formValidateOK.gradeYear': {
        handler (newV, oldV) {
          if (newV) {
            this.isGradeYear = true
          } else {
            this.isGradeYear = false
          }
        },
        deep: true
      }
    },
    methods: {
      async GetClassTable () {
        if (this.classPlan.StarProgrammeID > 0) {
          this.xy.loading()
          let params = {
            StarProgrammeID: this.classPlan.StarProgrammeID
          }
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarProgramme/GetProgrammeDetail`, params, true)
          this.xy.unloading()
          if (res.success) {
            let result = res.data
            this.formValidateOK.StarProgrammeName = this.classPlan.StarProgrammeName
            this.getSchool(result)
          } else {
            this.xy.msgError(res.msg || '获取方案失败。')
          }
        } else {
          this.getSchool()
        }
      },
      // 获取校区
      async getSchool (resObj) {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`, null, true)
        this.xy.unloading()
        if (res.success) {
          this.schoolData = []
          let resData = res.data
          for (const iterator of resData) {
            this.schoolData.push({
              value: iterator.SchoolDistrictID,
              label: iterator.SchoolDistrictName
            })
          }
          if (resObj) { // 编辑
            this.formValidateOK.school = resObj.SchoolDistrictID
            this.getStudentGrade(resObj)
            this.getSessionNodeList(resObj)
          } else { // 创建
            if (resData.length > 0) {
              this.formValidateOK.school = resData[0].SchoolDistrictID
              this.getStudentGrade()
            }
            this.getSessionNodeList()
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      schoolChange (value) {
        this.formValidateOK.school = value
        this.formValidateOK.gradeYear = ''
        this.getStudentGrade()
      },
      // 学年学期
      async getSessionNodeList (resObj) {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`, null, true)
        this.xy.unloading()
        if (res.success) {
          this.yearSessionData = res.data
          if (resObj) { // 编辑
            for (let m = 0; m < this.yearSessionData.length; m++) {
              for (let n = 0; n < this.yearSessionData[m].children.length; n++) {
                if (this.yearSessionData[m].children[n].value === resObj.AcademicSessionID) {
                  this.formValidateOK.session[0] = this.yearSessionData[m].value
                  this.formValidateOK.session[1] = resObj.AcademicSessionID
                }
              }
            }
          } else { // 创建
            this.formValidateOK.session = []
            let index = this.yearSessionData.map(function (item) {
              return item.IsCurrent
            }).indexOf(true)
            if (index !== -1) {
              this.formValidateOK.session.push(this.yearSessionData[index].value)
              let index1 = this.yearSessionData[index].children.map(function (item) {
                return item.IsCurrent
              }).indexOf(true)
              if (index1 !== -1) {
                this.formValidateOK.session.push(this.yearSessionData[index].children[index1].value)
              }
            } else {
              for (let i = 0; i < this.yearSessionData.length; i++) {
                if (this.yearSessionData[i].children.length > 0) {
                  this.formValidateOK.session = [this.yearSessionData[i].value, this.yearSessionData[i].children[0].value]
                  return false
                }
              }
            }
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      cascaderChange (value, selectedData) {
        this.formValidateOK.session = value
      },
      // 获取年级
      async getStudentGrade (resObj) {
        this.xy.loading()
        let params = {
          schoolDistrictID: this.formValidateOK.school
        }
        let res = await this.xy.get(`${this.xyApi}/xy/Comm/GetStudentGradeStudentYearBySid`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.studentGradeData = []
          if (resObj) { // 编辑
            this.formValidateOK.gradeYear = resObj.StudentGradeForStudentYearID
          }
          for (const iterator of res.data) {
            this.studentGradeData.push({
              value: iterator.StudentGradeForStudentYearID,
              tvalue: iterator.StudentGradeID,
              label: iterator.FullName
            })
          }
          this.matching = res.data// 匹配
        } else {
          this.xy.msgError(res.msg)
        }
      },

      async save () {
        this.studentGradeData.map((item) => {
          if (item.value === this.formValidateOK.gradeYear) {
            this.studentGradeName = item.label
          }
          return item
        })
        this.loading = true
        if (this.classPlan.StarProgrammeID > 0) {
          this.$refs.formValidateOK.validate((valid) => {
            if (!valid) {
              this.loading = false
              return valid
            } else {
              this.Edit()
            }
          })
        } else {
          this.$refs.formValidateOK.validate((valid) => {
            if (!valid) {
              this.loading = false
              return valid
            } else {
              this.Create()
            }
          })
        }
      },
      async Edit () {
        if (this.StepsHeader.rowObj.IsEnable) {
          this.loading = false
          return false
        }
        this.xy.loading()
        this.matching.map(item => {
          if (item.StudentGradeForStudentYearID === this.formValidateOK.gradeYear) {
            this.StudentGradeID = item.StudentGradeID
            this.StudentYearID = item.StudentYearID
          }
        })
        let params = {
          StarProgrammeName: this.formValidateOK.StarProgrammeName, // 方案名称
          SchoolDistrictID: this.formValidateOK.school,
          StudentGradeForStudentYearID: this.formValidateOK.gradeYear,
          StarProgrammeID: this.classPlan.StarProgrammeID
        }

        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StarProgramme/UpdateProgramme`, params)
        this.loading = false
        this.xy.unloading()
        if (res.success) {
          this.StepsHeader.getGeneralFlows()//
          this.xy.msgSuc('修改成功。')
        }
        this.loading = false
      },
      async Create () {
        this.xy.loading()
        this.matching.map(item => {
          if (item.StudentGradeForStudentYearID === this.formValidateOK.gradeYear) {
            this.StudentGradeID = item.StudentGradeID
            this.StudentYearID = item.StudentYearID
          }
        })
        let params = {
          StarProgrammeName: this.formValidateOK.StarProgrammeName, // 方案名称
          SchoolDistrictID: this.formValidateOK.school,
          StudentGradeForStudentYearID: this.formValidateOK.gradeYear,
          StarProgrammeID: 0
        }

        console.log(params)
        // return false

        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StarProgramme/CreateProgramme`, params)
        this.loading = false
        this.xy.unloading()
        if (res.success) {
          this.$store.commit('evaluate/changeEvaDipperObj', {
            StarProgrammeID: res.data,
            StarProgrammeName: this.formValidateOK.StarProgrammeName
          })
          console.log(this.formValidateOK)
          // this.classPlan.ProgrammeID = res.data.ProgrammeID
          // this.StepsHeader.ProgrammeID = res.data.ProgrammeID// 创建成功后，头部ProgrammeID更新
          // this.StepsHeader.getGeneralFlows()//
          this.xy.msgSuc('创建成功。')
          this.StepsHeader.getGeneralFlows()// 成功后步骤可以点击
        }
        this.loading = false
      }
    }

  }
</script>
<style lang="less" scoped>
/deep/ .ivu-form-item {
  margin-bottom: 20px;
}
</style>
