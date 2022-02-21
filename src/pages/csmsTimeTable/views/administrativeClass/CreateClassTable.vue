<template>
    <div class="xy-content-body">
      <div style="width:500px;margin:30px auto; ">
         <Form ref="formValidateOK" :model="formValidateOK" :rules="ruleValidateOK" style="width:500px;" :label-width='140'>
              <FormItem label="方案名称" prop="classTableName" label-for="classTableName">
                  <i-input v-model.trim="formValidateOK.classTableName" element-id="classTableName" clearable style="width: 300px;" :autofocus="true" placeholder="请输入方案名称"></i-input>
              </FormItem>
              <FormItem label="校区" prop="school">
                  <Select  v-model="formValidateOK.school" :disabled="classPlan.classTableID > 0?true:false"
                            @on-change="schoolChange"
                            :placeholder="isSchool ? '' :'请选择校区'"
                            style="width:300px">
                      <Option v-for="school in schoolData" :value="school.value" :key="school.label" v-cloak>{{ school.label }}</Option>
                  </Select>
              </FormItem>
              <FormItem label="学年学期" prop="session" label-for="session">
                  <cascader :data="yearSessionData"
                            style="width:300px"
                            :disabled="classPlan.classTableID > 0?true:false"
                            v-model="formValidateOK.session"
                            element-id="session"
                            @on-change="cascaderChange" placeholder="">
                  </cascader>
              </FormItem>
              <FormItem label="年级" prop="gradeYear">
                  <i-select v-model="formValidateOK.gradeYear"
                            :label="formValidateOK.gradeYear"
                            :disabled="classPlan.classTableID > 0?true:false"
                            :placeholder="classPlan.classTableID&&isGradeYear ? '' :'请选择年级'"
                            style="width:300px">
                      <i-option v-for="year in studentGradeData" :value="year.value" :key="year.label" v-cloak>{{ year.label }}</i-option>
                  </i-select>
              </FormItem>
              <FormItem label="其他校区是否可见" prop="isVisible">
                  <radio-group v-model="formValidateOK.isVisible">
                      <radio label='0'>不可见</radio>
                      <radio label='1'>可见</radio>
                  </radio-group>
              </FormItem>
              <FormItem label="方案描述" prop="describe" label-for="describe">
                  <i-input v-model="formValidateOK.describe" element-id="describe" maxlength="200" show-word-limit type="textarea" placeholder="请输入描述文字" style='width:300px' :autosize="{minRows: 5,maxRows: 5}" />
              </FormItem>
               <div class="btn-box">
                  <Button class="xy-btn-primary" shape="circle" :loading="loading" :disabled="StepsHeader.isOperation !== 0"
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
          classTableName: [{
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
        // 方案信息
        StepsHeader: {},
        classPlan: {},
        isSchool: true, // 请选择学校
        isGradeYear: true// 请选择年级
      }
    },
    created () {
      this.StepsHeader = this.$parent
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj

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
        if (this.classPlan.classTableID > 0) {
          let params = {
            classTableID: this.classPlan.classTableID
          }
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTable/GetClassTable`, params, true)
          if (res.success) {
            let result = res.data
            this.formValidateOK.classTableName = result.ClassTableName
            this.formValidateOK.describe = result.ClassTableDescribe
            this.formValidateOK.isVisible = result.IsOtherSchoolDistrictShow ? '1' : '0'
            this.$store.commit('common/getThreeMenuName', result.ClassTableName)
            this.getSchool(result)
          } else {
            this.xy.msgError(res.msg || '获取排课任务失败。')
          }
        } else {
          this.getSchool()
        }
      },
      // 获取校区
      async getSchool (resObj) {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`, null, true)
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
          this.xy.unloading()
        }
      },
      schoolChange (value) {
        this.formValidateOK.school = value
        this.formValidateOK.gradeYear = ''
        this.getStudentGrade()
      },
      // 学年学期
      async getSessionNodeList (resObj) {
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`, null, true)
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
        this.xy.unloading()
      },
      cascaderChange (value, selectedData) {
        this.formValidateOK.session = value
      },
      // 获取年级
      async getStudentGrade (resObj) {
        let params = {
          schoolDistrictID: this.formValidateOK.school
        }
        let res = await this.xy.get(`${this.xyApi}/xy/Comm/GetStudentGradeStudentYearBySid`, params, true)
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
        } else {
          this.xy.msgError(res.msg)
        }
      },

      async save () {
        if (this.StepsHeader.isOperation === 0) {
          this.studentGradeData.map((item) => {
            if (item.value === this.formValidateOK.gradeYear) {
              this.studentGradeName = item.label
            }
            return item
          })

          this.loading = true
          if (this.classPlan.classTableID > 0) {
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
        }
      },
      async Edit () {
        this.xy.loading()
        let params = {
          ClassTableName: this.formValidateOK.classTableName,
          SchoolDistrictID: this.formValidateOK.school,
          AcademicSessionID: this.formValidateOK.session[1],
          StudentGradeForStudentYearID: this.formValidateOK.gradeYear,
          ClassTableType: this.$store.state.csmstimetable.classTableID[0].id,
          CollectionName: this.studentGradeName,
          ClassTableID: this.classPlan.classTableID,
          IsOtherSchoolDistrictShow: !!Number(this.formValidateOK.isVisible),
          ClassTableDescribe: this.formValidateOK.describe
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTable/Edit`, params)
        this.loading = false
        this.xy.unloading()
        if (res.success) {
          this.StepsHeader.getGeneralFlows()//
          this.xy.msgSuc('修改成功。')
          this.$store.commit('common/getParam', { pro: 'administrative', step: 1 })// 行政班排课
          this.$store.commit('common/getThreeMenuName', this.formValidateOK.classTableName)
          this.$router.push({ path: '/xyhome/administrativeStepHeader/administrativeWorkTime', query: this.$store.state.common.menuInfo })
          this.$parent.tabValue = this.$parent.liData[1].url
        }
        this.loading = false
      },
      async Create () {
        this.xy.loading()
        let params = {
          ClassTableName: this.formValidateOK.classTableName,
          SchoolDistrictID: this.formValidateOK.school,
          AcademicSessionID: this.formValidateOK.session[1],
          AcademicYearID: this.formValidateOK.session[0],
          StudentGradeForStudentYearID: this.formValidateOK.gradeYear,
          ClassTableType: this.$store.state.csmstimetable.classTableID[0].id,
          CollectionName: this.studentGradeName,
          IsOtherSchoolDistrictShow: !!Number(this.formValidateOK.isVisible),
          ClassTableDescribe: this.formValidateOK.describe
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTable/Create`, params)
        this.loading = false
        this.xy.unloading()
        if (res.success) {
          this.classPlan.classTableID = res.data.ClassTableID
          this.StepsHeader.classTableID = res.data.ClassTableID// 创建成功后，头部classTableID更新
          this.StepsHeader.getGeneralFlows()//
          this.xy.msgSuc('创建成功。')
          this.$store.commit('common/getParam', { pro: 'administrative', step: 1 })// 行政班排课
          this.$store.commit('common/getThreeMenuName', this.formValidateOK.classTableName)
          this.$router.push({ path: '/xyhome/administrativeStepHeader/administrativeWorkTime', query: this.$store.state.common.menuInfo })
          this.$parent.tabValue = this.$parent.liData[1].url
        }
        this.loading = false
      }
    }

  }
</script>
<style lang="less" scoped>
.class-name{
    position:absolute;
    right:20px;
    top:0;
    font-size:14px;
    color:#B3BACB
}
.btn-box {
  width: 500px;
  margin: 30px auto 0 auto;
  padding-left: 140px;
}
</style>
