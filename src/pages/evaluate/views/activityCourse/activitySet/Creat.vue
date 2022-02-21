<template>
  <div class="creat">
    <div class="xy-content-body">
      <div style="width:500px;margin:30px auto; ">
        <Form ref="formValidateOK"
              :model="formValidateOK"
              :rules="ruleValidateOK"
              style="width:500px;"
              :label-width='100'>
          <FormItem label="活动名称"
                    label-for='ProgrammeName'
                    prop="ProgrammeName">
            <Input v-model.trim="formValidateOK.ProgrammeName"
                   clearable
                   element-id='ProgrammeName'
                   style="width: 300px;"
                   :autofocus="true"
                   placeholder="请输入活动名称" />
          </FormItem>
          <FormItem label="活动类型"
                    prop="activityType">
            <Select v-model="formValidateOK.activityType"
                    :disabled="classPlan.ActivityCourseProjectID > 0"
                    placeholder="请选择活动类型"
                    style="width:300px">
              <Option v-for="item in activityData"
                      :value="item.value"
                      :key="item.label">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="所属校区"
                    prop="school">
            <Select v-model="formValidateOK.school"
                    @on-change="schoolChange"
                    :disabled="classPlan.ActivityCourseProjectID > 0"
                    placeholder="请选择校区"
                    style="width:300px">
              <Option v-for="school in schoolData"
                      :value="school.value"
                      :key="school.label">{{ school.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="学年学期"
                    prop="session">
            <cascader :data="yearSessionData"
                      :disabled="classPlan.ActivityCourseProjectID > 0"
                      style="width:300px"
                      v-model="formValidateOK.session"
                      @on-change="cascaderChange"
                      placeholder="">
            </cascader>
          </FormItem>
          <FormItem label="活动时间"
                    label-for='startStopDate'
                    prop="startStopDate">
            <DatePicker :clearable="false"
                        element-id='startStopDate'
                        style="width: 300px"
                        date-picker
                        type="datetimerange"
                        placeholder="选择活动时间"
                        :value="formValidateOK.startStopDate"
                        format="yyyy-MM-dd HH:mm"
                        :editable="false"
                        @on-change="startStopChange">
            </DatePicker>
          </FormItem>
          <FormItem label="评价时间"
                    label-for='evaDate'
                    prop="evaDate">
            <DatePicker :clearable="false"
                        element-id='evaDate'
                        style="width: 300px"
                        date-picker
                        type="datetimerange"
                        placeholder="选择评价时间"
                        :value="formValidateOK.evaDate"
                        format="yyyy-MM-dd HH:mm"
                        :editable="false"
                        @on-change="evaDateChange">
            </DatePicker>
          </FormItem>
          <form-item label="活动目标"
                     label-for='target'
                     prop="target">
            <Input v-model="formValidateOK.target"
                   element-id='target'
                   maxlength="200"
                   show-word-limit
                   type="textarea"
                   placeholder="请输入活动目标"
                   style="width:300px"
                   :rows="4" />
          </form-item>
          <form-item label="活动内容"
                     label-for='content'
                     prop="content">
            <Input v-model="formValidateOK.content"
                   maxlength="200"
                   element-id='content'
                   show-word-limit
                   type="textarea"
                   placeholder="请输入活动内容"
                   style="width:300px"
                   :rows="4" />
          </form-item>
          <div class="text-center"
               style='width:500px'>
            <Button class="xy-btn-primary"
                    shape="circle"
                    :loading="loading"
                    :disabled="StepsHeader.rowObj.IsEnable===1"
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
    name: 'PlanCreat',
    data () {
      return {
        loading: false,
        formValidateOK: {
          ProgrammeName: '',
          activityType: null,
          school: '',
          session: [],
          startStopDate: [],
          evaDate: [],
          target: '',
          content: ''
        },
        studentGradeForStudentYearID: 0,
        ruleValidateOK: {
          activityType: [{
            type: 'number',
            required: true,
            message: '请选择活动类型',
            trigger: 'change'
          }],
          startStopDate: [
            { type: 'array', len: 2, required: true, message: '请选择活动时间', trigger: 'change' }
          ],
          evaDate: [
            { type: 'array', len: 2, required: true, message: '请选择评价时间', trigger: 'change' }
          ],
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
          target: [{
            required: true,
            message: '活动目标不能为空',
            trigger: 'blur'
          }],
          content: [{
            required: true,
            message: '活动内容不能为空',
            trigger: 'blur'
          }],
          ProgrammeName: [
            {
              required: true,
              message: '活动名称不能为空',
              trigger: 'blur'
            },
            {
              max: 20,
              message: '活动名称不能超过20个字',
              trigger: 'blur'
            }
          ]
        },
        schoolData: [],
        activityData: [],
        yearSessionData: [],
        // 方案信息
        StepsHeader: {},
        classPlan: {},
        matching: [], // 匹配后加的参数
        StudentGradeID: '',
        StudentYearID: '',
        ActivityCourseProjectID: ''// 编辑
      }
    },
    created () {
      this.StepsHeader = this.$parent
      this.classPlan = this.$store.state.evaluate.activityObj
      this.GetClassTable()
    },
    methods: {
      async GetClassTable () {
        if (this.classPlan.ActivityCourseProjectID > 0) {
          this.xy.loading()
          let params = {
            ActivityCourseProjectID: this.classPlan.ActivityCourseProjectID
          }
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseProject/GetProjectByID`, params, true)
          this.xy.unloading()
          if (res.success) {
            let result = res.data
            this.formValidateOK.ProgrammeName = result.ActivityCourseProjectName
            this.formValidateOK.target = result.ActivityCourseTarget
            this.formValidateOK.content = result.ActivityCourseContent
            this.formValidateOK.startStopDate = [result.ActivityCourseStartTime, result.ActivityCourseEndTime]
            this.formValidateOK.evaDate = [result.ActivityCourseEvaStartTime, result.ActivityCourseEvaEndTime]
            this.getSchool(result)
            this.GetActivityCourseType(result)
          } else {
            this.xy.msgError(res.msg || '获取方案失败。')
          }
        } else {
          this.getSchool()
          this.GetActivityCourseType()
        }
      },
      // 获取活动方案类型
      async GetActivityCourseType (resObj) {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseType/GetActivityCourseType`, null, true)
        this.xy.unloading()
        if (res.success) {
          this.activityData = []
          let resData = res.data
          for (const iterator of resData) {
            this.activityData.push({
              value: iterator.ActivityCourseTypeID,
              label: iterator.ActivityCourseTypeName
            })
          }
          if (resObj) { // 编辑
            this.formValidateOK.activityType = resObj.ActivityCourseTypeID
          } else { // 创建
            if (resData.length > 0) {
              this.formValidateOK.activityType = resData[0].ActivityCourseTypeID
            }
          }
        } else {
          this.xy.msgError(res.msg)
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
            this.getSessionNodeList(resObj)
          } else { // 创建
            if (resData.length > 0) {
              this.formValidateOK.school = resData[0].SchoolDistrictID
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
      startStopChange (val) {
        this.formValidateOK.startStopDate = val
      },
      evaDateChange (val) {
        this.formValidateOK.evaDate = val
      },
      async save () {
        this.loading = true
        if (this.classPlan.ActivityCourseProjectID > 0) {
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
          'ActivityCourseProjectID': this.classPlan.ActivityCourseProjectID,
          'ActivityCourseProjectName': this.formValidateOK.ProgrammeName,
          'ActivityCourseTypeID': this.formValidateOK.activityType,
          'SchoolDistrictID': this.formValidateOK.school,
          'AcademicYearID': this.formValidateOK.session[0],
          'AcademicSessionID': this.formValidateOK.session[1],
          'ActivityCourseTarget': this.formValidateOK.target,
          'ActivityCourseContent': this.formValidateOK.content,
          'ActivityCourseStartTime': this.formValidateOK.startStopDate[0],
          'ActivityCourseEndTime': this.formValidateOK.startStopDate[1],
          'ActivityCourseEvaStartTime': this.formValidateOK.evaDate[0],
          'ActivityCourseEvaEndTime': this.formValidateOK.evaDate[1]
        }

        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ActivityCourseProject/Edit`, params)
        this.loading = false
        this.xy.unloading()
        if (res.success) {
          this.StepsHeader.getGeneralFlows()
          this.xy.msgSuc('修改成功。')
        }
        this.loading = false
      },
      goAddStudent () {
        this.StepsHeader.liData.map(function (item) {
          item.isActive = 0
          return item.isActive
        })
        this.StepsHeader.liData[1].isActive = 1
        this.$store.commit('common/getThreeMenuName', this.formValidateOK.ProgrammeName)
        this.StepsHeader.getGeneralFlows()
        this.$router.push({ path: '/xyhome/acStepsHeader/addStudents', query: this.$store.state.common.menuInfo })
      },
      async Create () {
        this.xy.loading()
        let params = {
          'ActivityCourseProjectID': 0,
          'ActivityCourseProjectName': this.formValidateOK.ProgrammeName,
          'ActivityCourseTypeID': this.formValidateOK.activityType,
          'SchoolDistrictID': this.formValidateOK.school,
          'AcademicYearID': this.formValidateOK.session[0],
          'AcademicSessionID': this.formValidateOK.session[1],
          'ActivityCourseTarget': this.formValidateOK.target,
          'ActivityCourseContent': this.formValidateOK.content,
          'ActivityCourseStartTime': this.formValidateOK.startStopDate[0],
          'ActivityCourseEndTime': this.formValidateOK.startStopDate[1],
          'ActivityCourseEvaStartTime': this.formValidateOK.evaDate[0],
          'ActivityCourseEvaEndTime': this.formValidateOK.evaDate[1]
        }

        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ActivityCourseProject/Create`, params)
        this.loading = false
        this.xy.unloading()
        if (res.success) {
          // this.$store.commit('evaluate/changeActivityObj', {
          //   ActivityCourseProjectID: res.data.result,
          //   ActivityCourseProjectName: this.formValidateOK.ProgrammeName,
          //   ActivityCourseTemplateID: 0,
          //   ActivityCourseTemplateType: 'ST'
          // })
          this.$store.state.evaluate.activityObj.ActivityCourseProjectID = res.data.result
          this.$store.state.evaluate.activityObj.ActivityCourseProjectName = this.formValidateOK.ProgrammeName
          this.$store.state.evaluate.activityObj.ActivityCourseTemplateID = -1
          this.$store.state.evaluate.activityObj.ActivityCourseTemplateType = 'ST'
          this.$store.state.evaluate.activityObj.IsEnable = 0 // 刚创建完是禁用状态，步骤2 3都是可以操作的
          this.$store.state.evaluate.activityObj.SchoolDistrictID = this.formValidateOK.school // 校区id，添加学生时组织树只显示当前校区
          this.classPlan.ActivityCourseProjectID = res.data.result
          this.StepsHeader.ActivityCourseProjectID = res.data.result// 创建成功后，头部ActivityCourseProjectID更新
          this.StepsHeader.getGeneralFlows()//
          // this.goAddStudent()
          this.xy.msgSuc('创建成功。')
        }
        this.loading = false
      }
    }

  }
</script>
<style lang="less" scoped>
</style>
