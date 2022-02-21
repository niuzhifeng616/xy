<template>
  <!-- 1.基本信息 -->
  <div class="xy-content-body">
      <div class="dialog-model-content" style="width:500px;margin:30px auto;">
          <i-form ref="formValidateOK" :model="formValidateOK" :rules="ruleValidateOK" style="width:500px;" :label-width="140">
              <form-item label="方案名称：" prop="classTableName" label-for="classTableName">
                  <i-input v-model.trim="formValidateOK.classTableName" element-id="classTableName" clearable style="width: 300px" placeholder="请输入排课名称" :autofocus="true"></i-input>
              </form-item>
              <form-item label="校区：" prop="school">
                  <i-select v-model="formValidateOK.school" :disabled="classTableID > 0"
                            @on-change="schoolChange"
                            placeholder="请选择校区"
                            style="width:300px">
                      <i-option v-for="school in schoolData" :value="school.value" :key="school.label">{{ school.label }}</i-option>
                  </i-select>
              </form-item>
              <form-item label="学年学期：" prop="session" label-for="session">
                  <cascader :data="yearSessionData"
                            style="width:300px"
                            :disabled="stepsHeader.isOperation !== 0"
                            v-model="formValidateOK.session"
                            element-id="session"
                            @on-change="cascaderChange">
                  </cascader>
              </form-item>
              <form-item label="年级：" prop="gradeYear">
                  <i-select v-model="formValidateOK.gradeYear"
                            :label="formValidateOK.gradeYear"
                            :disabled="classTableID > 0"
                            placeholder="请选择年级"
                            style="width:300px">
                      <i-option v-for="year in studentGradeData" :value="year.value" :key="year.label">{{ year.label }}</i-option>
                  </i-select>
              </form-item>
              <form-item label="其他校区是否可见：" prop="isVisible">
                  <radio-group v-model="formValidateOK.isVisible">
                      <radio label='0'>不可见</radio>
                      <radio label='1'>可见</radio>
                  </radio-group>
              </form-item>
              <form-item label="方案描述：" prop="describe" label-for="describe">
                  <i-input v-model="formValidateOK.describe" element-id="describe" maxlength="200" show-word-limit type="textarea" placeholder="请输入描述文字" style='width:300px' :rows="5" />
              </form-item>
              <div style="margin-left: 140px;">
                  <!-- <Button @click="back">取消</Button> -->
                  <Button class="xy-btn-primary" shape="circle" :loading="loading" :disabled="stepsHeader.isOperation !== 0"
                            @click="save">
                      <span v-if="!loading">下一步</span>
                      <span v-else>保存中...</span>
                  </Button>
              </div>
          </i-form>
      </div>

  </div>
</template>
<script>
  export default {
    name: 'CreateClassTable',
    data () {
      return {
        loading: false,
        // 添加的验证
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
        classTableType: this.$store.state.csmstimetable.classTableID[1].id,

        stepsHeader: {},
        classTableID: 0
      }
    },
    created () {
      this.stepsHeader = this.$parent
      if (this.stepsHeader.rowObj !== undefined && this.stepsHeader.rowObj !== '' && this.stepsHeader.rowObj !== null) {
        // 编辑
        this.classTableID = this.stepsHeader.rowObj.ClassTableID
      }
    },
    mounted () {
      this.GetClassTable()
    },
    methods: {
      async GetClassTable () {
        if (this.classTableID > 0) {
          let params = {
            classTableID: this.classTableID
          }
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTable/GetClassTable`, params, true)
          if (res.success) {
            let result = res.data
            this.formValidateOK.classTableName = result.ClassTableName
            this.formValidateOK.describe = result.ClassTableDescribe
            this.formValidateOK.isVisible = result.IsOtherSchoolDistrictShow ? '1' : '0'
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
            if (resData.length === 1) {
              this.formValidateOK.school = resData[0].SchoolDistrictID
              this.getStudentGrade()
            }
            this.getSessionNodeList()
          }
        } else {
          this.xy.unloading()
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
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`, null)
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
        let params = {
          schoolDistrictID: this.formValidateOK.school
        }
        let res = await this.xy.get(`${this.xyApi}/xy/Comm/GetStudentGradeStudentYearBySid`, params)
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
        }
      },
      async Edit () {
        this.xy.loading()
        let params = {
          ClassTableName: this.formValidateOK.classTableName,
          SchoolDistrictID: this.formValidateOK.school,
          AcademicSessionID: this.formValidateOK.session[1],
          StudentGradeForStudentYearID: this.formValidateOK.gradeYear,
          ClassTableType: this.classTableType,
          CollectionName: this.studentGradeName,
          ClassTableID: this.classTableID,
          IsOtherSchoolDistrictShow: !!Number(this.formValidateOK.isVisible),
          ClassTableDescribe: this.formValidateOK.describe
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTable/Edit`, params)
        this.loading = false
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
          this.$store.commit('common/getParam', { pro: 'classTableOrder', step: 1 }) // 跳转至第二步
          this.$router.push({
            path: '/xyhome/goClassStepsHeader/workTime',
            query: this.$store.state.common.menuInfo
          })
          this.$parent.tabValue = this.$parent.liData[1].url

          this.loading = false
        }
      },
      async Create () {
        this.xy.loading()
        let params = {
          ClassTableName: this.formValidateOK.classTableName,
          SchoolDistrictID: this.formValidateOK.school,
          AcademicSessionID: this.formValidateOK.session[1],
          AcademicYearID: this.formValidateOK.session[0],
          StudentGradeForStudentYearID: this.formValidateOK.gradeYear,
          ClassTableType: this.classTableType,
          CollectionName: this.studentGradeName,
          IsOtherSchoolDistrictShow: !!Number(this.formValidateOK.isVisible),
          ClassTableDescribe: this.formValidateOK.describe
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTable/Create`, params)
        this.loading = false
        this.xy.unloading()
        if (res.success) {
          this.classTableID = res.data.ClassTableID

          // 重置stepheader数据
          this.$parent.classTableID = res.data.ClassTableID
          this.$parent.classTableName = res.data.classTableName
          this.$parent.getGeneralFlows()
          this.$parent.rowObj = {
            ClassTableID: this.classTableID,
            ClassTableName: this.formValidateOK.classTableName
          }
          this.$store.commit('common/getThreeMenuName', this.formValidateOK.classTableName)
          this.$store.commit('common/getParam', { pro: 'classTableOrder', step: 1 }) // 跳转至第二步
          this.$router.push({
            path: '/xyhome/goClassStepsHeader/workTime',
            query: this.$store.state.common.menuInfo
          })
          this.$parent.tabValue = this.$parent.liData[1].url

          this.$store.commit('csmstimetable/changeClassComValKWnew', { classTableID: this.classTableID, classTableName: this.formValidateOK.classTableName }) // ！待优化
          this.loading = false
        }
      },
      save () {
        if (this.stepsHeader.isOperation === 0) {
          this.studentGradeData.map((item) => {
            if (item.value === this.formValidateOK.gradeYear) {
              this.studentGradeName = item.label
            }
            return item
          })

          this.loading = true
          if (this.classTableID > 0) {
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
      // 返回
      back () {
        this.$router.push('/xyHome/classTableOrder')
      }
    }
  }
</script>
<style lang="less" scoped>
  @import './css/classTable.less';
  @import './css/publice.less';
  .text-center {
    Button {
      margin-right: 10px;
    }
  }
</style>
