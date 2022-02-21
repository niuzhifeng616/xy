<!--1.基本信息  -->
<template>
  <div class="xy-content-body"
       id="StepsHeader">
    <div class="dialog-model-content"
         style="width:500px;margin:30px auto;">
      <Form ref="formValidateOK"
              :model="formValidateOK"
              :rules="ruleValidateOK"
              :label-width="140"
              style="width:500px;">
        <FormItem label="方案名称"
                   prop="classTableName"
                   label-for='name'>
          <Input v-model="formValidateOK.classTableName"
                   clearable
                   style="width: 350px"
                   autofocus
                   element-id='name'
                   placeholder="请输入方案名称" />
        </FormItem>
        <FormItem label="校区"
                   prop="school">
          <i-select v-model="formValidateOK.school"
                    :disabled="smartDivideStepsHeader.divideClassID > 0?true:false"
                    @on-change="schoolChange"
                    placeholder="请选择校区"
                    style="width:350px">
            <i-option v-for="school in schoolData"
                      :value="school.value"
                      :key="school.label"
                      >{{ school.label }}</i-option>
          </i-select>
        </FormItem>
        <FormItem label="学年学期"
                   prop="session">
          <cascader :data="yearSessionData"
                    style="width:350px"
                    :disabled="smartDivideStepsHeader.divideClassID > 0?true:false"
                    v-model="formValidateOK.session"
                    @on-change="cascaderChange">
          </cascader>
        </FormItem>
        <FormItem label="年级"
                   prop="gradeYear">
          <i-select v-model="formValidateOK.gradeYear"
                    :label="formValidateOK.gradeYear"
                    :disabled="smartDivideStepsHeader.divideClassID > 0?true:false"
                    placeholder="请选择年级"
                    style="width:350px">
            <i-option v-for="year in studentGradeData"
                      :value="year.value"
                      :key="year.label"
                      >{{ year.label }}</i-option>
          </i-select>
        </FormItem>
        <FormItem label="其他校区是否可见"
                   prop="isVisible">
          <radio-group v-model="formValidateOK.isVisible">
            <radio label='0'>不可见</radio>
            <radio label='1'>可见</radio>
          </radio-group>
        </FormItem>
        <FormItem label="方案描述"
                   prop="describe"
                   label-for='describe'>
          <Input v-model="formValidateOK.describe"
                 maxlength="200"
                 element-id='describe'
                 show-word-limit
                 type="textarea"
                 placeholder="请输入描述文字"
                 style='width:350px'
                 :rows="4" />
        </FormItem>
        <div class="btn-box">
          <Button class="xy-btn-primary"
                  shape="circle"
                  :loading="loading"
                  :disabled="smartDivideStepsHeader.isOperation != 0"
                  @click="save">
            <span v-if="!loading">下一步</span>
            <span v-else>保存中...</span>
          </Button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        loading: false,
        /// /添加的验证
        formValidateOK: {
          classTableName: '',
          school: '',
          session: [],
          gradeYear: '',
          isVisible: '0',
          describe: ''
        },
        studentGradeForStudentYearID: 0,
        studentYearName: '',
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
          classTableName: [
            {
              required: true,
              message: '方案名称不能为空',
              trigger: 'blur'
            },
            {
              max: 15,
              message: '方案名称不能超过15个字',
              trigger: 'blur'
            }
          ]
        },

        schoolData: [],
        studentGradeData: [],
        yearSessionData: [],
        smartDivideStepsHeader: {}
      }
    },
    created () {
      this.smartDivideStepsHeader = this.$parent
      if (this.smartDivideStepsHeader.rowObj !== undefined && this.smartDivideStepsHeader.rowObj !== '' && this.smartDivideStepsHeader.rowObj != null) {
        this.formValidateOK.classTableName = this.smartDivideStepsHeader.rowObj.DivideClassName
        this.formValidateOK.isVisible = this.smartDivideStepsHeader.rowObj.IsOtherSchoolDistrictShow ? '1' : '0'
        this.formValidateOK.describe = this.smartDivideStepsHeader.rowObj.DivideClassDescribe
      }
      if (this.smartDivideStepsHeader.divideClassID > 0) { // 编辑
        this.getSchool(this.smartDivideStepsHeader.rowObj)
      } else { // 创建
        this.getSchool()
      }
    },
    mounted () {

    },
    methods: {
      // 获取校区
      async getSchool (resObj) {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`)
        if (res.success) {
          this.schoolData = []
          let resData = res.data
          res.data.map(item => {
            this.schoolData.push({
              value: item.SchoolDistrictID,
              label: item.SchoolDistrictName
            })
          })
          if (resObj !== '' && resObj !== undefined) { // 编辑
            this.formValidateOK.school = this.smartDivideStepsHeader.rowObj.SchoolDistrictID
            this.getStudentGrade(resObj)
            this.getSessionNodeList(resObj)
          } else { // 创建
            if (resData.length > 0) {
              this.formValidateOK.school = resData[0].SchoolDistrictID
              this.getStudentGrade()
            }
            this.getSessionNodeList()
          }
        }
        this.xy.unloading()
      },
      schoolChange (value) {
        this.formValidateOK.school = value
        this.formValidateOK.gradeYear = ''
        this.getStudentGrade()
      },
      // 学年学期
      async getSessionNodeList (resObj) {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`)
        if (res.success) {
          this.yearSessionData = res.data
          if (resObj !== '' && resObj !== undefined) { // 编辑
            for (let m = 0; m < this.yearSessionData.length; m++) {
              for (let n = 0; n < this.yearSessionData[m].children.length; n++) {
                if (this.yearSessionData[m].children[n].value === this.smartDivideStepsHeader.rowObj.AcademicSessionID) {
                  this.formValidateOK.session[0] = this.yearSessionData[m].value
                  this.formValidateOK.session[1] = this.smartDivideStepsHeader.rowObj.AcademicSessionID
                }
              }
            }
          } else { // 创建
            this.formValidateOK.session = []
            let index = this.yearSessionData.map((item) => {
              return item.IsCurrent
            }).indexOf(true)
            if (index !== -1) {
              this.formValidateOK.session.push(this.yearSessionData[index].value)
              let index1 = this.yearSessionData[index].children.map((item) => {
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
        }
        this.xy.unloading()
      },
      cascaderChange (value, selectedData) {
        this.formValidateOK.session = value
      },
      // 获取年级
      async getStudentGrade (resObj) {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetStudentGradeStudentYearBySid`, {
          schoolDistrictID: this.formValidateOK.school
        })
        if (res.success) {
          this.studentGradeData = []
          if (resObj !== '' && resObj !== undefined) { // 编辑
            this.formValidateOK.gradeYear = this.smartDivideStepsHeader.rowObj.StudentGradeForStudentYearID
          }
          res.data.map(item => {
            this.studentGradeData.push({
              value: item.StudentGradeForStudentYearID,
              tvalue: item.StudentGradeID,
              label: item.FullName
            })
          })
        }
        this.xy.unloading()
      },
      async edit () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/EditDivideClassList`, {
          DivideClassName: this.formValidateOK.classTableName,
          SchoolDistrictID: this.formValidateOK.school,
          AcademicSessionID: this.formValidateOK.session[1],
          StudentGradeForStudentYearID: this.formValidateOK.gradeYear,
          IsOtherSchoolDistrictShow: !!Number(this.formValidateOK.isVisible),
          DivideClassDescribe: this.formValidateOK.describe,
          DivideClassID: this.smartDivideStepsHeader.divideClassID
        })
        if (res.success) {
          this.xy.msgSuc('修改成功。')
          this.smartDivideStepsHeader.rowObj = {
            DivideClassName: this.formValidateOK.classTableName,
            SchoolDistrictID: this.formValidateOK.school,
            AcademicSessionID: this.formValidateOK.session[1],
            StudentGradeForStudentYearID: this.formValidateOK.gradeYear,
            IsOtherSchoolDistrictShow: !!Number(this.formValidateOK.isVisible),
            DivideClassDescribe: this.formValidateOK.describe
          }
          this.smartDivideStepsHeader.getGeneralFlows() // 成功后步骤可以点击
          this.smartDivideStepsHeader.liData.map((item) => {
            // eslint-disable-next-line no-return-assign
            return item.isActive = false
          })
          this.smartDivideStepsHeader.liData[1].isActive = true
          this.$store.commit('common/getThreeMenuName', this.formValidateOK.classTableName)
          this.$router.push({ path: '/xyhome/smartStepsHeader/smartSelectSubjectResult', query: this.$store.state.common.menuInfo })
        }
        this.xy.unloading()
        this.loading = false
      },
      async add () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/CreateDivideClassList`, {
          DivideClassName: this.formValidateOK.classTableName,
          SchoolDistrictID: this.formValidateOK.school,
          AcademicSessionID: this.formValidateOK.session[1],
          StudentGradeForStudentYearID: this.formValidateOK.gradeYear,
          IsOtherSchoolDistrictShow: !!Number(this.formValidateOK.isVisible),
          DivideClassDescribe: this.formValidateOK.describe
        })
        if (res.success) {
          this.smartDivideStepsHeader.divideClassID = res.data.ClassTableID
          this.xy.msgSuc('创建成功。')
          this.smartDivideStepsHeader.getGeneralFlows() // 成功后步骤可以点击
          this.smartDivideStepsHeader.rowObj = {
            DivideClassName: this.formValidateOK.classTableName,
            SchoolDistrictID: this.formValidateOK.school,
            AcademicSessionID: this.formValidateOK.session[1],
            StudentGradeForStudentYearID: this.formValidateOK.gradeYear,
            IsOtherSchoolDistrictShow: !!Number(this.formValidateOK.isVisible),
            DivideClassDescribe: this.formValidateOK.describe
          }
          this.smartDivideStepsHeader.liData.map((item) => {
            // eslint-disable-next-line no-return-assign
            return item.isActive = false
          })
          this.smartDivideStepsHeader.liData[1].isActive = true
          this.$store.commit('common/getThreeMenuName', this.formValidateOK.classTableName)
          this.$router.push({ path: '/xyhome/smartStepsHeader/smartSelectSubjectResult', query: this.$store.state.common.menuInfo })
        }
        this.xy.unloading()
        this.loading = false
      },
      save () {
        if (this.smartDivideStepsHeader.isOperation === 0) {
          this.loading = true
          if (this.smartDivideStepsHeader.divideClassID > 0) {
            this.$refs.formValidateOK.validate((valid) => {
              if (!valid) {
                // eslint-disable-next-line no-return-assign
                return this.loading = false
              } else {
                this.edit()
              }
            })
          } else {
            this.$refs.formValidateOK.validate((valid) => {
              if (!valid) {
                // eslint-disable-next-line no-return-assign
                return this.loading = false
              } else {
                this.add()
              }
            })
          }
        }
      }
    }
  }
</script>
<style lang='less' scoped>
.btn-box {
  width: 500px;
  margin: 30px auto 0 auto;
  padding-left: 140px;
}
</style>
