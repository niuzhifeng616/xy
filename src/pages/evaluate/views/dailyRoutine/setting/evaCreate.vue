<template>
   <div class="creat">
    <div class="xy-content-body">
      <div style="width:500px;margin:30px auto; ">
         <Form ref="formValidateOK" :model="formValidateOK" :rules="ruleValidateOK" style="width:500px;" :label-width='140'>
              <FormItem label="方案名称" prop="ProgrammeName"   label-for='ProgrammeName'>
                  <i-input :disabled="StepsHeader.rowObj.IsEnable === 1"  element-id='ProgrammeName' v-model.trim="formValidateOK.ProgrammeName" clearable style="width: 300px;" :autofocus="true" placeholder="请输入方案名称"></i-input>
              </FormItem>
              <FormItem label="评价维度" prop="evaClass" >
                  <Select  v-model="formValidateOK.evaClass"
                            :disabled="StepsHeader.rowObj.IsEnable === 1"
                            style="width:300px">
                      <Option v-for="evaClass in evaClassData" :value="evaClass.value" :key="evaClass.label" v-cloak>{{ evaClass.label }}</Option>
                  </Select>
              </FormItem>
              <FormItem label="指标类型" prop="target">
                  <Select  v-model="formValidateOK.target"
                            @on-change="indexChange"
                            :disabled="StepsHeader.rowObj.IsEnable === 1"
                            style="width:300px">
                      <Option v-for="target in targetData" :value="target.value" :key="target.label" v-cloak>{{ target.label }}</Option>
                  </Select>
              </FormItem>
              <FormItem label="校区" prop="school">
                  <Select  v-model="formValidateOK.school"
                            @on-change="schoolChange"
                            :disabled="StepsHeader.rowObj.IsEnable !== -1"
                            :placeholder="isSchool ? '' :'请选择校区'"
                            style="width:300px">
                      <Option v-for="school in schoolData" :value="school.value" :key="school.label" v-cloak>{{ school.label }}</Option>
                  </Select>
              </FormItem>
              <FormItem label="学年学期" label-for="yearSessionData" prop="session">
                  <cascader :data="yearSessionData"
                            element-id="yearSessionData"
                            :disabled="StepsHeader.rowObj.IsEnable !== -1"
                            style="width:300px"
                            v-model="formValidateOK.session"
                            @on-change="cascaderChange" placeholder="">
                  </cascader>
              </FormItem>
              <FormItem label="评分方式" prop="rateType">
                <RadioGroup v-model="formValidateOK.rateType">
                  <radio :disabled="StepsHeader.rowObj.IsEnable === 1" label="0">手动评分</radio>
                  <radio :disabled="StepsHeader.rowObj.IsEnable === 1" label="1">自动评分
                  </radio>
                </RadioGroup>
                <Tooltip max-width="360" placement="rightBottom" :content='txtMsg'>
                    <Icon type="md-information-circle" size="18" color="#1890ff" />
                </Tooltip>
              </FormItem>
               <div class="text-center" style='width:500px;padding-top:25px'>
                  <Button class="xy-btn-primary" shape="circle" :loading="loading" :disabled="StepsHeader.rowObj.IsEnable===true"
                            @click="save">
                      <span v-if="!loading">保存</span>
                      <span v-else>保存中...</span>
                  </Button>
              </div>
          </Form>
      </div>
    </div>
   </div>
</template>
<script>
  export default {
    name: 'evaCreate',
    data () {
      return {
        loading: false,
        isEnable: 0,
        /// /添加的验证
        formValidateOK: {
          ProgrammeName: '',
          evaClass: '',
          target: '',
          school: '',
          session: [],
          rateType: ''
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
          target: [{
            required: true,
            message: '指标类型不能为空',
            trigger: 'change'
          }],
          evaClass: [{
            required: true,
            message: '评价维度不能为空',
            trigger: 'change'
          }],
          session: [{
            type: 'array',
            required: true,
            message: '请选择学年学期',
            trigger: 'change'
          }],
          rateType: [{
            required: true,
            message: '请选择评分方式'
          }],
          ProgrammeName: [
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
        evaClassData: [
          {
            value: '0',
            label: '行政班'
          },
          {
            value: '1',
            label: '学生'
          }
        ],
        targetData: [],
        schoolData: [],
        studentGradeData: [],
        yearSessionData: [],
        // 方案信息
        StepsHeader: {},
        classPlan: {},
        isSchool: true, // 请选择学校
        matching: [], // 匹配后加的参数
        StudentGradeID: '',
        StudentYearID: '',
        ProgrammeID: '', // 编辑
        txtMsg: '系统每日0点自动评分。默认评价对象自动获得指标项的默认分值，用户可手动修改，保存指标项评分结果。'
      }
    },
    created () {
      this.StepsHeader = this.$parent
      this.classPlan = this.$store.state.evaluate.changeMoralObj
      this.GetClassTable()
      this.getIndexList()
    },
    watch: {
      'formValidateOK.school' (newV, oldV) {
        if (newV) {
          this.isSchool = true
        } else {
          this.isSchool = false
        }
      }
    },
    methods: {
      indexChange (value) {
        this.formValidateOK.target = value
      },
      async getIndexList () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MoralEducationIndex/MoralEducationIndexList`)
        this.xy.unloading()
        if (res.success) {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].IndexTypeName !== null) {
              this.targetData.push({
                label: res.data[i].ApplicationStateName,
                value: String(res.data[i].ApplicationStateID)
              })
            }
          }
        }
      },
      async GetClassTable () {
        if (this.StepsHeader.rowObj.ProgrammeID > 0) {
          this.xy.loading()
          let params = {
            ProgrammeID: this.StepsHeader.rowObj.ProgrammeID
          }
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/MoralProgramme/GetProgrammeById`, params, true)
          this.xy.unloading()
          if (res.success) {
            let result = res.data
            this.$store.commit('evaluate/changeScoreType', res.data.ScoreType)
            this.formValidateOK.ProgrammeName = result.ProgrammeName
            this.formValidateOK.evaClass = String(result.Dimension)
            this.$store.state.evaluate.evaClass = String(result.Dimension)
            this.formValidateOK.target = String(result.IndicatorTypeID)
            this.formValidateOK.school = result.SchoolDistrictID
            this.formValidateOK.session = [result.AcademicYearID, result.AcademicSessionID]
            this.formValidateOK.rateType = String(result.ScoringMethodType)
            console.log(this.formValidateOK.session)
            this.isEnable = result.isEnable
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
            console.log(this.yearSessionData)
            for (let m = 0; m < this.yearSessionData.length; m++) {
              for (let n = 0; n < this.yearSessionData[m].children.length; n++) {
                if (this.yearSessionData[m].children[n].value === resObj.AcademicSessionID) {
                  this.formValidateOK.session[0] = resObj.AcademicYearID
                  this.formValidateOK.session[1] = resObj.AcademicSessionID
                }
              }
            }
            console.log(this.formValidateOK.session)
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
        // if (this.StepsHeader.rowObj.IsEnable === '1') {
        //   return false
        // }
        this.loading = true
        if (this.StepsHeader.rowObj.ProgrammeID > 0) {
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
        this.xy.loading()
        let params = {
          ProgrammeID: this.StepsHeader.rowObj.ProgrammeID,
          ProgrammeName: this.formValidateOK.ProgrammeName, // 方案名称
          SchoolDistrictID: this.formValidateOK.school,
          AcademicSessionID: this.formValidateOK.session[1],
          AcademicYearID: this.formValidateOK.session[0],
          IndicatorTypeID: this.formValidateOK.target,
          Dimension: this.formValidateOK.evaClass,
          ScoringMethodType: this.formValidateOK.rateType
        }

        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MoralProgramme/UpdateProgramme`, params)
        this.loading = false
        this.xy.unloading()
        if (res.success) {
          this.$store.commit('common/getThreeMenuName', this.formValidateOK.ProgrammeName)
          this.StepsHeader.getGeneralFlows()
          this.$store.state.evaluate.evaClass = this.formValidateOK.evaClass
          this.xy.msgSuc('修改成功。')
        }
        this.loading = false
      },
      async Create () {
        this.xy.loading()
        let params = {
          ProgrammeName: this.formValidateOK.ProgrammeName, // 方案名称
          SchoolDistrictID: this.formValidateOK.school,
          AcademicSessionID: this.formValidateOK.session[1],
          AcademicYearID: this.formValidateOK.session[0],
          IndicatorTypeID: this.formValidateOK.target,
          Dimension: this.formValidateOK.evaClass,
          ScoringMethodType: this.formValidateOK.rateType
        }

        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MoralProgramme/CreateProgramme`, params)
        this.loading = false
        this.xy.unloading()
        if (res.success) {
          this.$store.state.evaluate.changeMoralObj.ProgrammeID = res.data.ProgrammeID
          this.$store.state.evaluate.changeMoralObj.ProgrammeName = this.formValidateOK.ProgrammeName
          this.$store.state.evaluate.changeMoralObj.IndicatorTypeID = -1
          this.StepsHeader.rowObj.ProgrammeID = res.data.ProgrammeID
          this.$store.state.evaluate.evaClass = this.formValidateOK.evaClass
          this.StepsHeader.getGeneralFlows()
          this.xy.msgSuc('创建成功。')
          this.$store.commit('common/getThreeMenuName', this.formValidateOK.ProgrammeName)
          this.StepsHeader.changeTab({
            name: '添加年级',
            isActive: false,
            isShow: true,
            isLoad: 1,
            url: 'addGrade',
            index: 1
          }, 1)
        }
        this.loading = false
      }
    }

  }
</script>
<style lang="less" scoped>

</style>
