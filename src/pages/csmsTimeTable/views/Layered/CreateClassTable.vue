<template>
  <div class="xy-content-body">
    <div class="dialog-model-content"
          style="width:500px;margin:30px auto;">
      <i-form ref="formValidateOK"
              :model="formValidateOK"
              :rules="ruleValidateOK"
              :label-width="140"
              style="width:500px;">
        <form-item label="方案名称："
                    prop="classTableName"
                    label-for="classTableName">
          <i-input v-model="formValidateOK.classTableName"
                    element-id="classTableName"
                    clearable
                    style="width: 300px"
                    autofocus
                    placeholder="请输入方案名称"></i-input>
        </form-item>
        <form-item label="校区："
                    prop="school">
          <i-select v-model="formValidateOK.school"
                    :disabled="layeredStepsHeader.LayeredSelectProgrammeID > 0 ? true : false"
                    @on-change="schoolChange"
                    placeholder="请选择校区"
                    style="width:300px">
            <i-option v-for="school in schoolData"
                      :value="school.value"
                      :key="school.label">{{ school.label }}</i-option>
          </i-select>
        </form-item>
        <form-item label="学年学期："
                    prop="session"
                    label-for="session">
          <cascader :data="yearSessionData"
                    style="width:300px"
                    :disabled="layeredStepsHeader.LayeredSelectProgrammeID > 0 ? true : false"
                    v-model="formValidateOK.session"
                    element-id="session"
                    @on-change="cascaderChange">
          </cascader>
        </form-item>
        <form-item label="年级："
                    prop="gradeYear">
          <i-select v-model="formValidateOK.gradeYear"
                    :label="formValidateOK.gradeYear"
                    :disabled="
              layeredStepsHeader.LayeredSelectProgrammeID > 0 ? true : false
            "
                    placeholder="请选择年级"
                    style="width:300px">
            <i-option v-for="year in studentGradeData"
                      :value="year.value"
                      :key="year.label">{{ year.label }}</i-option>
          </i-select>
        </form-item>
        <form-item label="其他校区是否可见："
                    prop="isVisible">
          <radio-group v-model="formValidateOK.isVisible">
            <radio label="0">不可见</radio>
            <radio label="1">可见</radio>
          </radio-group>
        </form-item>
        <form-item label="方案描述："
                    prop="describe"
                    label-for="describe">
          <i-input v-model="formValidateOK.describe"
                    element-id="describe"
                    maxlength="200"
                    show-word-limit
                    type="textarea"
                    placeholder="请输入描述文字"
                    style="width:300px"
                    :rows="4" />
        </form-item>
        <div class="btn-box">
          <Button class="xy-btn-primary"
                  shape="circle"
                  :loading="loading"
                  :disabled="layeredStepsHeader.isOperation !== 0"
                  @click="save">
            <span v-if="!loading">下一步</span>
            <span v-else>保存中...</span>
          </Button>
          <!-- <Button class="xy-btn-close" @click="back" style="margin-right:10px">取消</Button> -->
        </div>
      </i-form>
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
        layeredStepsHeader: {}
      }
    },
    created: function () {
      this.layeredStepsHeader = this.$parent
      if (this.layeredStepsHeader.rowObj !== undefined && this.layeredStepsHeader.rowObj !== '' && this.layeredStepsHeader.rowObj !== null) {
        this.formValidateOK.classTableName = this.layeredStepsHeader.rowObj.LayeredSelectProgrammeName
        this.formValidateOK.isVisible = this.layeredStepsHeader.rowObj.IsOtherSchoolDistrictShow ? '1' : '0'
        this.formValidateOK.describe = this.layeredStepsHeader.rowObj.LayeredSelectProgrammeDescribe
      }
      if (this.layeredStepsHeader.LayeredSelectProgrammeID > 0) { // 编辑
        this.getSchool(this.layeredStepsHeader.rowObj)
      } else { // 创建
        this.getSchool()
      }
    },
    methods: {
      // 获取校区
      getSchool (resObj) {
        this.xy.loading()
        this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`, null, true).then(res => {
          if (res.success) {
            this.schoolData = []
            let resData = res.data
            resData.map(item => {
              this.schoolData.push({
                value: item.SchoolDistrictID,
                label: item.SchoolDistrictName
              })
            })
            if (resObj !== '' && resObj !== undefined) { // 编辑
              this.formValidateOK.school = this.layeredStepsHeader.rowObj.SchoolDistrictID
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
          };
        })
      },
      schoolChange: function (value) {
        this.formValidateOK.school = value
        this.formValidateOK.gradeYear = ''
        this.getStudentGrade()
      },
      // 学年学期
      getSessionNodeList: function (resObj) {
        let that = this
        this.xy.get(`${that.xyApi}/xy/comm/GetSessionNodeList`).then(res => {
          if (res.success) {
            that.yearSessionData = res.data
            if (resObj !== '' && resObj !== undefined) { // 编辑
              for (let m = 0; m < that.yearSessionData.length; m++) {
                for (let n = 0; n < that.yearSessionData[m].children.length; n++) {
                  if (that.yearSessionData[m].children[n].value === that.layeredStepsHeader.rowObj.AcademicSessionID) {
                    that.formValidateOK.session[0] = that.yearSessionData[m].value
                    that.formValidateOK.session[1] = that.layeredStepsHeader.rowObj.AcademicSessionID
                  }
                }
              }
            } else { // 创建
              that.formValidateOK.session = []
              let index = that.yearSessionData.map(function (item) {
                return item.IsCurrent
              }).indexOf(true)
              if (index !== -1) {
                that.formValidateOK.session.push(that.yearSessionData[index].value)
                let index1 = that.yearSessionData[index].children.map(function (item) {
                  return item.IsCurrent
                }).indexOf(true)
                if (index1 !== -1) {
                  that.formValidateOK.session.push(that.yearSessionData[index].children[index1].value)
                }
              } else {
                for (let i = 0; i < that.yearSessionData.length; i++) {
                  if (that.yearSessionData[i].children.length > 0) {
                    that.formValidateOK.session = [that.yearSessionData[i].value, that.yearSessionData[i].children[0].value]
                    return false
                  }
                }
              }
            }
          } else {
            this.xy.msgError(res.msg)
          };
          this.xy.unloading()
        })
      },
      cascaderChange: function (value, selectedData) {
        this.formValidateOK.session = value
      },
      // 获取年级
      getStudentGrade: function (resObj) {
        let that = this
        this.xy.get(`${this.xyApi}/xy/comm/GetStudentGradeStudentYearBySid`, {
          schoolDistrictID: that.formValidateOK.school
        }).then(res => {
          if (res.success) {
            that.studentGradeData = []
            if (resObj !== '' && resObj !== undefined) { // 编辑
              that.formValidateOK.gradeYear = that.layeredStepsHeader.rowObj.StudentGradeForStudentYearID
            }
            res.data.map(item => {
              that.studentGradeData.push({
                value: item.StudentGradeForStudentYearID,
                tvalue: item.StudentGradeID,
                label: item.FullName
              })
            })
          } else {
            this.xy.msgError(res.msg)
          };
        })
      },
      // 保存
      save: function () {
        if (this.layeredStepsHeader.isOperation === 0) {
          let that = this
          that.loading = true
          if (this.layeredStepsHeader.LayeredSelectProgrammeID > 0) {
            this.$refs.formValidateOK.validate(function (valid) {
              if (!valid) {
                that.loading = false
                return that.loading
              } else {
                that.xy.loading()
                that.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgramme/Edit`, {
                  LayeredSelectProgrammeName: that.formValidateOK.classTableName,
                  SchoolDistrictID: that.formValidateOK.school,
                  AcademicSessionID: that.formValidateOK.session[1],
                  StudentGradeForStudentYearID: that.formValidateOK.gradeYear,
                  IsOtherSchoolDistrictShow: !!Number(that.formValidateOK.isVisible),
                  LayeredSelectProgrammeDescribe: that.formValidateOK.describe,
                  LayeredSelectProgrammeID: that.layeredStepsHeader.LayeredSelectProgrammeID
                }).then(res => {
                  that.xy.unloading()
                  if (res.success) {
                    that.xy.msgSuc('修改成功。')
                    that.layeredStepsHeader.getGeneralFlows() // 成功后步骤可以点击
                    that.layeredStepsHeader.rowObj = {
                      LayeredSelectProgrammeName: that.formValidateOK.classTableName,
                      LayeredSelectProgrammeDescribe: that.formValidateOK.describe,
                      IsOtherSchoolDistrictShow: !!Number(that.formValidateOK.isVisible),
                      SchoolDistrictID: that.formValidateOK.school,
                      AcademicSessionID: that.formValidateOK.session[1],
                      StudentGradeForStudentYearID: that.formValidateOK.gradeYear
                    }
                    that.layeredStepsHeader.liData.map(function (item) {
                      item.isActive = false
                      return item.isActive
                    })
                    that.layeredStepsHeader.liData[1].isActive = true
                    that.layeredStepsHeader.currentComponent = 'chooseClassStudent'
                  }

                  that.loading = false
                }, function () {
                  that.loading = false
                })
              }
            })
          } else {
            this.$refs.formValidateOK.validate(function (valid) {
              if (!valid) {
                that.loading = false
                return that.loading
              } else {
                that.xy.loading()
                that.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgramme/Create`, {
                  LayeredSelectProgrammeName: that.formValidateOK.classTableName,
                  SchoolDistrictID: that.formValidateOK.school,
                  AcademicSessionID: that.formValidateOK.session[1],
                  StudentGradeForStudentYearID: that.formValidateOK.gradeYear,
                  IsOtherSchoolDistrictShow: !!Number(that.formValidateOK.isVisible),
                  LayeredSelectProgrammeDescribe: that.formValidateOK.describe,
                  LayeredSelectProgrammeID: that.layeredStepsHeader.LayeredSelectProgrammeID
                }).then(res => {
                  that.xy.unloading()
                  if (res.success) {
                    that.layeredStepsHeader.LayeredSelectProgrammeID = res.data.ClassTableID
                    that.xy.msgSuc('创建成功。')
                    that.layeredStepsHeader.getGeneralFlows() // 成功后步骤可以点击
                    that.layeredStepsHeader.rowObj = {
                      LayeredSelectProgrammeName: that.formValidateOK.classTableName,
                      LayeredSelectProgrammeDescribe: that.formValidateOK.describe,
                      IsOtherSchoolDistrictShow: !!Number(that.formValidateOK.isVisible),
                      SchoolDistrictID: that.formValidateOK.school,
                      AcademicSessionID: that.formValidateOK.session[1],
                      StudentGradeForStudentYearID: that.formValidateOK.gradeYear
                    }
                    that.layeredStepsHeader.liData.map(function (item) {
                      item.isActive = false
                      return item.isActive
                    })
                    that.layeredStepsHeader.liData[1].isActive = true
                    that.layeredStepsHeader.currentComponent = 'chooseClassStudent'
                  }

                  that.loading = false
                }, function () {
                  that.loading = false
                })
              }
            })
          }
        }
      },
      // 返回
      back: function () {
        this.$router.push({ path: '/xyhome/layeredClassTable', query: this.$store.state.common.menuInfo })
      }
    }
  }
</script>

<style lang="less" scoped>
.ivu-btn[disabled] {
  color: rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.04);
}
.btn-box {
  width: 500px;
  margin: 30px auto 0 auto;
  padding-left: 140px;
}
</style>
