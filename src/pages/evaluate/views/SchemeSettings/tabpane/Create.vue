<!-- 1.创建方案 -->
<template>
  <div  style="width:440px;margin:30px auto;">
    <i-form ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="120"
            style="width:500px;">
      <form-item label="方案名称："
                  prop="formName"
                  label-for="formName">
        <Input v-model="formValidate.formName"
                  element-id="formName"
                  :maxlength="30"
                  clearable
                  autofocus
                  style="width:350px" />
      </form-item>
      <form-item label="方案描述："
                  prop="formCont"
                  label-for="formCont">
        <Input type="textarea"
                  :rows="4"
                  :maxlength="100"
                  :show-word-limit="true"
                  v-model="formValidate.formCont"
                  element-id="formCont"
                  clearable
                  style="width:350px" />
      </form-item>
      <div>
        <form-item label="校区："
                    prop="schoolID">
          <i-select v-model="formValidate.schoolID"
                    @on-change="schoolChange"
                    :disabled="!IsModifiable"
                    :label="formValidate.schoolID"
                    placeholder="请选择校区"
                    style="width:350px">
            <i-option v-for="item in schoolData"
                      :value="item.SchoolDistrictID"
                      :key="item.SchoolDistrictID">{{item.SchoolDistrictName}}</i-option>
          </i-select>
        </form-item>
        <form-item label="学年学期："
                    prop="searchValue"
                    label-for="searchValue">
          <cascader :data="yearSessionData"
                  style="width:350px"
                  :clearable="false"
                  :disabled="!IsModifiable"
                  v-model="formValidate.searchValue"
                  element-id="searchValue"
                  @on-change="cascaderChange">
        </cascader>
        </form-item>
        <form-item label="年级：" prop="gradeYear">
            <i-select v-model="formValidate.gradeYear"
                      :label="formValidate.value"
                      :disabled="!IsModifiable"
                      style="width:350px"
                      placeholder='请选择年级' @on-change="changeGrade">
                <i-option v-for="year in studentGradeData" :value="year.value" :key="year.value">{{ year.label }}</i-option>
            </i-select>
        </form-item>
      </div>
      <div class="but-left" v-if="status!==2">
        <Button shape="circle"
                class="xy-btn-primary"
                :loading="loadingBtn"
                @click="save">下一步</Button>
      </div>
    </i-form>
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        yearSessionData: [],
        loading: true,
        loadingBtn: false,
        formValidate: {
          searchValue: [],
          formName: '',
          formCont: '',
          schoolID: 0,
          gradeYear: 0,
          StudentYearId: 0,
          StudentGradeId: 0
        },
        ruleValidate: {
          formName: [
            { required: true, message: '方案名称必填', trigger: 'blur' },
            { max: 30, message: '方案名称限制30字以内', trigger: 'blur' }
          ],
          formCont: [
            { max: 100, message: '方案描述限制100字以内', trigger: 'blur' }
          ],
          schoolID: [
            { type: 'number', required: true, message: '请选择校区', trigger: 'change' }
          ],
          searchValue: [
            { type: 'array', required: true, message: '请选择学年学期', trigger: 'change' }
          ],
          gradeYear: [
            { type: 'number', required: true, message: '请选择年级', trigger: 'change' }
          ]
        },
        schoolData: [],
        yearData: [],
        sessionData: [],
        fallData: [],
        stageData: [],

        teachingProjectID: this.$route.query.teachingProjectID * 1,
        urls: '',
        IsModifiable: true,
        status: this.$route.query.status * 1,
        SchoolDistrictNames: '',
        AcademicYearNames: '',
        AcademicSessionNames: '',
        StudentYearNames: '',
        StudentGradeNames: '',
        apiPath: `${this.$store.state.apiPath}`,
        studentGradeData: []
      }
    },
    created () {
      this.getSchool()
    },
    mounted () {
      if (this.teachingProjectID) {
        this.updateProject()
      } else {
        this.getSessionNodeList()
      }
    },
    methods: {
      // 获取所有校区
      async getSchool () {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/base/xy/Comm/SchoolDistrictList`, null)
        if (res.success) {
          if (res.data && res.data.length) {
            this.schoolData = res.data
            if (!this.teachingProjectID) {
              this.formValidate.schoolID = res.data[0].SchoolDistrictID
            }
            if (this.teachingProjectID) return
            this.getStudentGrade()
          }
        }
      },
      schoolChange (vals) {
        this.formValidate.schoolID = vals
        this.xy.loading()
        this.getStudentGrade()
      },
      // 获取年级
      async getStudentGrade () {
        let params = {
          schoolDistrictID: this.formValidate.schoolID
        }
        let res = await this.xy.get(`${this.xyApi}/xy/Comm/GetStudentGradeStudentYearBySid`, params)
        if (res.success) {
          // this.studentGradeData = []
          this.formValidate.StudentGradeId = res.data[0].StudentGradeID
          this.formValidate.StudentYearId = res.data[0].StudentYearID
          if (!this.teachingProjectID) {
            this.formValidate.gradeYear = res.data[0].StudentGradeForStudentYearID
          }
          // console.log(this.formValidate.gradeYear)
          this.studentGradeData = res.data.map(val => {
            return {
              value: val.StudentGradeForStudentYearID,
              tvalue: val.StudentGradeID,
              StudentYearID: val.StudentYearID,
              label: val.FullName
            }
          })
        }
        this.xy.unloading()
      },
      // 年级切换
      changeGrade (val) {
        let arr = this.studentGradeData.filter(vv => val === vv.value)
        if (arr.length) {
          this.formValidate.StudentGradeId = arr[0].tvalue
          this.formValidate.StudentYearId = arr[0].StudentYearID
        }
      },
      cascaderChange (value, selectedData) {
        // console.log(value)
        this.searchValue = value
      },
      // 编辑时获取方案信息
      async updateProject () {
        this.xy.loading()
        const params = {
          projectId: this.teachingProjectID
        }
        let res = await this.xy.get(`${this.apiPath}/api/AssessProject/FindAssessProject`, params)
        if (res.success) {
          this.formValidate.formName = res.data.AssessProjectName
          this.formValidate.formCont = res.data.AssessProjectDescribe
          this.formValidate.schoolID = res.data.SchoolDistrictId
          this.IsModifiable = res.data.IsModifiable

          this.SchoolDistrictNames = res.data.SchoolDistrictName
          this.AcademicYearNames = res.data.AcademicYearName
          this.AcademicSessionNames = res.data.AcademicSessionName
          this.StudentYearNames = res.data.StudentYearName
          this.StudentGradeNames = res.data.StudentGradeName
          this.formValidate.gradeYear = res.data.StudentGradeForStudentYearId
          // console.log(this.formValidate.gradeYear)
          this.formValidate.searchValue[0] = res.data.AcademicYearId
          this.formValidate.searchValue[1] = res.data.AcademicSessionId
          this.getStudentGrade()
          if (this.teachingProjectID) {
            this.getSessionNodeList()
          }
        }
      },

      // 学年学期
      async getSessionNodeList () {
        let res = await this.xy.get(`${this.xyApi}/base/xy/comm/GetSessionNodeList`, null)
        if (res.success) {
          this.yearSessionData = res.data
          if (this.teachingProjectID) return
          this.formValidate.searchValue = []
          let index = this.yearSessionData.map((item) => {
            return item.IsCurrent
          }).indexOf(true)
          if (index !== -1) {
            this.formValidate.searchValue.push(this.yearSessionData[index].value)
            let index1 = this.yearSessionData[index].children.map((item) => {
              return item.IsCurrent
            }).indexOf(true)
            if (index1 !== -1) {
              this.formValidate.searchValue.push(this.yearSessionData[index].children[index1].value)
            }
          } else {
            for (let i = 0; i < this.yearSessionData.length; i++) {
              if (this.yearSessionData[i].children.length > 0) {
                this.formValidate.searchValue = [this.yearSessionData[i].value, this.yearSessionData[i].children[0].value]
                return false
              }
            }
          }
        }
        this.xy.unloading()
      },
      // 保存
      save () {
        this.$refs.formValidate.validate(async (valid) => {
          if (!valid) {
            return false
          } else {
            this.loadingBtn = true
            let options = {
              AssessProjectName: this.formValidate.formName,
              AssessProjectDescribe: this.formValidate.formCont,
              SchoolDistrictId: this.formValidate.schoolID,
              AcademicYearId: this.formValidate.searchValue[0],
              AcademicSessionId: this.formValidate.searchValue[1],
              StudentGradeForStudentYearId: this.formValidate.gradeYear,
              StudentYearId: this.formValidate.StudentYearId,
              StudentGradeId: this.formValidate.StudentGradeId
            }
            if (this.teachingProjectID > 0) {
              options = {
                AssessProjectId: this.teachingProjectID,
                AssessProjectName: this.formValidate.formName,
                AssessProjectDescribe: this.formValidate.formCont,
                SchoolDistrictId: this.formValidate.schoolID,
                AcademicYearId: this.formValidate.searchValue[0],
                AcademicSessionId: this.formValidate.searchValue[1],
                StudentGradeForStudentYearId: this.formValidate.gradeYear,
                StudentYearId: this.formValidate.StudentYearId,
                StudentGradeId: this.formValidate.StudentGradeId
              }
            };
            let url = ''
            if (this.teachingProjectID) {
              url = '/api/AssessProject/UpdateProject'
            } else {
              url = '/api/AssessProject/Create'
            }
            this.xy.loading()
            let res = await this.xy.post(`${this.apiPath}${url}`, options)
            this.loadingBtn = false
            if (res.success) {
              let lens = 0
              let dtList = this.$store.state.evaluate.topHeader
              this.$store.commit('common/getThreeMenuName', this.formValidate.formName)
              if (this.teachingProjectID > 0) {
                this.xy.msgSuc(res.msg || '编辑方案成功。')
                lens = 1
                this.$store.commit('common/getParam', Object.assign(this.$route.query, {
                  steps: 1
                }))
              } else {
                this.xy.msgSuc(res.msg || '创建方案成功。')
                lens = res.data.result.SetpuStep + 1
                this.$store.commit('common/getParam', Object.assign(this.$route.query, {
                  steps: res.data.result.SetpuStep,
                  teachingProjectID: res.data.result.ProjectId
                }))
              }
              for (let i = 0; i < lens; i++) {
                dtList[i].isLoad = 1
              }
              this.$store.commit('evaluate/changetopHeader', dtList)
              this.$router.push({ name: 'EvaStting', query: this.$store.state.common.menuInfo })
            }
            this.xy.unloading()
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.but-left {
  margin:35px 0 0 120px;
}
</style>
