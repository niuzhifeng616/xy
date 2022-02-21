<template>
    <!-- 1.基本信息 -->
    <div class="xy-content-body">
      <div class="dialog-model-content" style="width:800px; margin:0 auto 30px; padding:30px 0 0 150px;">
          <Form ref="formValidateOK" :model="formValidateOK" :rules="ruleValidateOK" :label-width="120">
              <FormItem label="排课名称：" prop="classTableName" label-for="classTableName">
                  <Input v-model.trim="formValidateOK.classTableName" element-id="classTableName" clearable style="width: 300px" placeholder="请输入排课名称" autofocus />
              </FormItem>
              <FormItem label="所属校区：" prop="school">
                  <Select v-model="formValidateOK.school" :disabled="classTableID > 0?true:false"
                              @on-change="schoolChange"
                              placeholder="请选择校区"
                              style="width:300px">
                      <Option v-for="school in schoolData"
                              :value="school.value"
                              :key="school.value"
                              :title="school.title">{{ school.label }}</Option>
                  </Select>
              </FormItem>
              <FormItem label="所属学年：" prop="year">
                  <Select v-model="formValidateOK.year"
                              @on-change="yearChange"
                              :label="formValidateOK.year"
                              placeholder="请选择学年"
                              style="width:300px">
                      <Option v-for="year in yearData" :value="year.value" :key="year.label">{{ year.label }}</Option>
                  </Select>
                  <tooltip class="option-problem" style="margin-left:10px" word-wrap max-width="185" placement="right" content="启用课表时将在以下学年学期时间范围内为教师和学生生成每天的课表。">
                      <Icon type="md-help-circle" size="18" color="#ffad33" />
                  </tooltip>
              </FormItem>
              <FormItem label="所属学期：" prop="session">
                  <Select v-model="formValidateOK.session"
                              :value="formValidateOK.session"
                              @on-change="sessionChange"
                              :label="formValidateOK.session"
                              placeholder="请选择学期"
                              style="width:300px">
                      <Option v-for="session in sessionData" :value="session.value" :key="session.label">{{ session.label }}</Option>
                  </Select>
              </FormItem>
              <FormItem label="学届：" prop="studentYear">
                  <Select v-model="formValidateOK.studentYear"
                            :disabled="classTableID > 0?true:false"
                            :value="formValidateOK.studentYear"
                            @on-change="studentYearChange"
                            :label="formValidateOK.studentYear"
                            placeholder="请选择学届"
                            style="width:300px">
                      <Option v-for="studentYear in studentYearData" :value="studentYear.value" :key="studentYear.label">{{ studentYear.label }}</Option>
                  </Select>
              </FormItem>
              <FormItem label="学习阶段：" prop="studentGrade">
                  <Select v-model="formValidateOK.studentGrade" :disabled="classTableID > 0?true:false"
                            :value="formValidateOK.studentGrade"
                            :label="formValidateOK.studentGrade"
                            @on-change="studentGradeChange"
                            placeholder="请选择学习阶段"
                            style="width:300px">
                      <Option v-for="studentGrade in studentGradeData" :value="studentGrade.value" :key="studentGrade.label">{{ studentGrade.label }}</Option>
                  </Select>
              </FormItem>
              <div style="margin-left: 120px;">
                  <Button :disabled="stepsHeader.isOperation !== 0" class="xy-btn-primary" shape="circle" :loading="loading" @click="save">
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
    name: 'TLCreatClassTable',
    data () {
      return {
        loading: false,
        // 添加的验证
        formValidateOK: {
          classTableName: '',
          school: '',
          year: 0,
          session: 0,
          studentYear: '',
          studentGrade: ''
        },
        studentGradeForStudentYearID: 0,
        studentYearName: '',
        studentGradeName: '',
        ruleValidateOK: {
          school: [
            { type: 'number', required: true, message: '请选择校区', trigger: 'change' }
          ],
          year: [
            { type: 'number', required: true, message: '请选择学年', trigger: 'change' }
          ],
          session: [
            { type: 'number', required: true, message: '请选择学期', trigger: 'change' }
          ],
          studentYear: [
            { type: 'number', required: true, message: '请选择学届', trigger: 'change' }
          ],
          studentGrade: [
            { type: 'number', required: true, message: '请选择学习阶段', trigger: 'change' }
          ],
          classTableName: [
            { required: true, message: '排课任务名称不能为空', trigger: 'blur' },
            { max: 30, message: '排课任务名称不能超过30个字', trigger: 'blur' }
          ]
        },
        schoolData: [],
        yearData: [],
        sessionData: [],
        studentYearData: [],
        studentGradeData: [],

        classTableType: this.$store.state.csmstimetable.classTableID[2].id,
        stepsHeader: {},
        classTableID: 0,
        sessionID: 0,
        collectionID: '',
        isEdit: false
      }
    },
    created () {
      this.stepsHeader = this.$parent
      if (this.stepsHeader.rowObj !== undefined && this.stepsHeader.rowObj !== '' && this.stepsHeader.rowObj !== null) {
        // 编辑
        this.formValidateOK.classTableName = this.stepsHeader.rowObj.ClassTableName
        this.classTableID = this.stepsHeader.rowObj.ClassTableID
        this.isEdit = true
      } else {
        // 创建
        this.isEdit = false
      }

      // 选课页面跳转过来的
      // if (xy.param.getValues('loadAdjust') != undefined) {
      //   this.loadAdjust = xy.param.getValues('loadAdjust')
      // };
      // if (this.loadAdjust != '') {
      //   this.backResult()
      // };
    },
    mounted () {
      if (this.isEdit) {
        // 编辑
        this.editFun()
      } else {
        // 创建
        this.getSchool()
        this.getYear()
      }
    },
    methods: {
      async editFun () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTable/GetClassTable`, { classTableID: this.classTableID })
        this.xy.loading()
        if (res.success) {
          var result = res.data
          this.formValidateOK.classTableName = result.ClassTableName
          this.collectionID = result.CollectionID

          // SchoolDistrictList
          let res1 = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`)
          this.schoolData = []
          if (res1.success) {
            for (let i = 0, len = res1.data.length; i < len; i++) {
              this.schoolData.push({
                value: res1.data[i].SchoolDistrictID,
                label: res1.data[i].SchoolDistrictName.length >= 18 ? `${res1.data[i].SchoolDistrictName.substr(0, 17)}...` : res1.data[i].SchoolDistrictName,
                title: res1.data[i].SchoolDistrictName.length >= 18 ? res1.data[i].SchoolDistrictName : ''
              })
            }
            this.formValidateOK.school = result.SchoolDistrictID

            // StudentYearList
            let res2 = await this.xy.get(`${this.xyApi}/xy/comm/StudentYearList`, { schoolID: this.formValidateOK.school })
            this.formValidateOK.studentYear = ''
            this.studentYearData = []
            if (res2.success) {
              for (let i = 0, len = res2.data.length; i < len; i++) {
                this.studentYearData.push({
                  value: res2.data[i].StudentYearID,
                  label: res2.data[i].StudentYearName
                })
              }
              this.formValidateOK.studentYear = result.StudentYearID
              // StudentGradeList
              let res3 = await this.xy.get(`${this.xyApi}/xy/comm/StudentGradeList`, {
                schoolID: this.formValidateOK.school,
                studentYearID: this.formValidateOK.studentYear
              })
              this.formValidateOK.studentGrade = ''
              this.studentGradeData = []
              if (res3.success) {
                for (let i = 0, len = res3.data.length; i < len; i++) {
                  this.studentGradeData.push({
                    value: res3.data[i].StudentGradeID,
                    tvalue: res3.data[i].StudentGradeForStudentYearID,
                    label: res3.data[i].StudentGradeName
                  })
                }
                this.formValidateOK.studentGrade = result.StudentGradeID
              }
            }

            // YearList
            let resYear = await this.xy.get(`${this.xyApi}/xy/comm/YearList`)
            if (resYear.success) {
              this.yearData = []
              for (let i = 0, len = resYear.data.length; i < len; i++) {
                this.yearData.push({
                  value: resYear.data[i].ID,
                  label: resYear.data[i].Name
                })
              }
              this.formValidateOK.year = result.AcademicYearID

              // SessionList
              let resSession = await this.xy.get(`${this.xyApi}/xy/comm/SessionList`, { yearID: this.formValidateOK.year })
              if (resSession.success) {
                this.formValidateOK.session = 0
                this.sessionData = []
                for (let i = 0, len = resSession.data.length; i < len; i++) {
                  this.sessionData.push({
                    value: resSession.data[i].AcademicSessionID,
                    label: resSession.data[i].AcademicSessionName
                  })
                }
                this.formValidateOK.session = result.AcademicSessionID
              }
            }
          }
        } else {
          this.xy.msgError('获取排课任务失败。')
        }
        this.xy.unloading()
      },
      async getSchool () {
        this.schoolData = []
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`)
        if (res.success) {
          let resData = res.data
          if (resData.length === 1) {
            this.formValidateOK.school = resData[0].SchoolDistrictID
            this.getStudentYear()
          }
          for (let i = 0, len = resData.length; i < len; i++) {
            this.schoolData.push({
              value: resData[i].SchoolDistrictID,
              label: resData[i].SchoolDistrictName.length >= 18 ? `${resData[i].SchoolDistrictName.substr(0, 17)}...` : resData[i].SchoolDistrictName,
              title: resData[i].SchoolDistrictName.length >= 18 ? resData[i].SchoolDistrictName : ''
            })
          }
        }
      },
      async getYear () {
        let res = await this.xy.get(`${this.xyApi}/xy/comm/YearList`)
        this.xy.loading()
        if (res.success) {
          this.yearData = []
          var resData = res.data
          for (let i = 0, len = resData.length; i < len; i++) {
            if (this.classTableID === 0) {
              if (i === 0 || resData[i].IsCurrent) {
                this.formValidateOK.year = resData[i].ID
              }
            }
            this.yearData.push({
              value: resData[i].ID,
              label: resData[i].Name
            })
          }
          this.getSession()
        }
      },
      async getSession () {
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SessionList`, { yearID: this.formValidateOK.year })
        if (res.success) {
          var resData = res.data
          for (let i = 0, len = resData.length; i < len; i++) {
            if (this.classTableID === 0) {
              if (i === 0 || resData[i].IsCurrent) {
                this.formValidateOK.session = resData[i].AcademicSessionID
              }
            }
            this.sessionData.push({
              value: resData[i].AcademicSessionID,
              label: resData[i].AcademicSessionName
            })
          }
        }
        this.xy.unloading()
      },
      // 学届
      async getStudentYear () {
        this.formValidateOK.studentYear = ''
        this.studentYearData = []

        this.formValidateOK.studentGrade = ''// 学习阶段
        this.studentGradeData = []

        let res = await this.xy.get(`${this.xyApi}/xy/comm/StudentYearList`, {
          schoolID: this.formValidateOK.school
        })
        if (res.success) {
          for (let i = 0, len = res.data.length; i < len; i++) {
            this.studentYearData.push({
              value: res.data[i].StudentYearID,
              label: res.data[i].StudentYearName
            })
          }
        }
      },
      // 学习阶段
      async getStudentGrade () {
        this.formValidateOK.studentGrade = ''
        this.studentGradeData = []
        let res = await this.xy.get(`${this.xyApi}/xy/comm/StudentGradeList`, {
          schoolID: this.formValidateOK.school,
          studentYearID: this.formValidateOK.studentYear
        })
        if (res.success) {
          for (let i = 0, len = res.data.length; i < len; i++) {
            this.studentGradeData.push({
              value: res.data[i].StudentGradeID,
              tvalue: res.data[i].StudentGradeForStudentYearID,
              label: res.data[i].StudentGradeName
            })
          }
        }
      },
      yearChange (value) {
        this.formValidateOK.year = value
        this.formValidateOK.session = 0
        this.sessionData = []
        this.getSession()
      },
      sessionChange (value) {
        this.formValidateOK.session = value
      },
      schoolChange (value) {
        this.formValidateOK.school = value
        this.formValidateOK.studentGrade = ''// 学习阶段情况
        this.studentGradeData = []
        this.getStudentYear() // 学届
      },
      studentYearChange (value) {
        this.formValidateOK.studentYear = value
        var index = this.studentYearData.map((item) => { return item.value }).indexOf(value)
        if (index > -1) {
          this.studentYearName = this.studentYearData[index].label
        }
        this.formValidateOK.studentGrade = ''// 学习阶段
        this.studentGradeData = []
        if (this.formValidateOK.studentYear !== '' && this.formValidateOK.studentYear !== undefined) {
          this.getStudentGrade()
        }
      },
      studentGradeChange (value) {
        this.formValidateOK.studentGrade = value
        var index = this.studentGradeData.map((item) => { return item.value }).indexOf(value)
        if (index > -1) {
          this.studentGradeForStudentYearID = this.studentGradeData[index].tvalue
          this.studentGradeName = this.studentGradeData[index].label
        }
      },
      async save () {
        this.loading = true
        if (this.classTableID > 0) {
          this.$refs.formValidateOK.validate((valid) => {
            if (!valid) {
              this.loading = false
              return this.loading
            } else {
              this.Edit()
            }
          })
        } else {
          this.$refs.formValidateOK.validate((valid) => {
            if (!valid) {
              this.loading = false
              return this.loading
            } else {
              this.Create()
            }
          })
        }
      },
      async Edit () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTable/Edit`, {
          ClassTableName: this.formValidateOK.classTableName,
          SchoolDistrictID: this.formValidateOK.school,
          AcademicSessionID: this.formValidateOK.session,
          StudentGradeForStudentYearID: this.studentGradeForStudentYearID,
          ClassTableType: this.classTableType,
          CollectionName: this.studentYearName + this.studentGradeName,
          ClassTableID: this.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('修改成功。')

          // 重置stepheader数据
          this.$parent.classTableName = this.formValidateOK.classTableName
          this.$parent.getGeneralFlows()
          this.$parent.rowObj = {
            ClassTableID: this.classTableID,
            ClassTableName: this.formValidateOK.classTableName
          }

          this.$store.commit('common/getThreeMenuName', this.formValidateOK.classTableName)
          this.$store.commit('common/getParam', { pro: 'takeLessons', step: 1 }) // 校本排课（抢课）。跳转至第二步：作息时间
          this.$router.push({
            path: '/xyhome/takeLessonsStepsHeader/workTime',
            query: this.$store.state.common.menuInfo
          })
          this.$parent.tabValue = this.$parent.liData[1].url
        }
        this.loading = false
      },
      async Create () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTable/Create`, {
          ClassTableName: this.formValidateOK.classTableName,
          SchoolDistrictID: this.formValidateOK.school,
          AcademicYearID: this.formValidateOK.year,
          AcademicSessionID: this.formValidateOK.session,
          StudentGradeForStudentYearID: this.studentGradeForStudentYearID,
          ClassTableType: this.classTableType,
          CollectionName: this.studentYearName + this.studentGradeName
        })
        this.xy.unloading()
        if (res.success) {
          this.classTableID = res.data.ClassTableID
          this.xy.msgSuc('创建成功。')

          // 重置stepheader数据
          this.$parent.classTableID = res.data.ClassTableID
          this.$parent.classTableName = this.formValidateOK.classTableName
          this.$parent.getGeneralFlows()
          this.$parent.rowObj = {
            ClassTableID: this.classTableID,
            ClassTableName: this.formValidateOK.classTableName
          }

          this.$store.commit('common/getThreeMenuName', this.formValidateOK.classTableName)
          this.$store.commit('common/getParam', { pro: 'takeLessons', step: 1 }) // 校本排课（抢课）。跳转至第二步：作息时间
          this.$router.push({
            path: '/xyhome/takeLessonsStepsHeader/workTime',
            query: this.$store.state.common.menuInfo
          })
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
</style>
