<template>
    <!-- 考试管理 创建/编辑 -->
    <div class="xy-content-module">
        <div class="xy-content-body">
            <div style="width:600px; margin:30px auto;">
                <Form ref="formValidate"
                        :model="formValidate"
                        :rules="ruleValidate"
                        :label-width="140"
                        style="width:600px;">
                    <form-item label="考试名称" prop="formName" label-for="formName">
                        <Input v-model="formValidate.formName"
                                element-id="formName"
                                placeholder="请输入考试名称"
                                style="width:400px"
                                maxlength="15"
                                clearable />
                    </form-item>
                    <form-item label="考试类型" prop="examTypeId">
                        <Select v-model="formValidate.examTypeId"
                                :disabled="isEdit"
                                style="width:400px"
                                placeholder="请选择">
                            <Option v-for="type in achievementTypeArr" :value="type.AchievementRecordExamTypeID" :key="type.AchievementRecordExamTypeName">{{ type.AchievementRecordExamTypeName }}</Option>
                        </Select>
                    </form-item>
                    <!--编辑模式下不可编辑：考试类型、校区、学期、年级、考试时间-->
                    <form-item label="校区" prop="school">
                        <Select v-model="formValidate.school"
                                :disabled="isEdit"
                                @on-change="schoolChange"
                                style="width:400px"
                                placeholder="请选择校区">
                            <Option v-for="school in schoolData" :value="school.SchoolDistrictID" :key="school.SchoolDistrictName">{{ school.SchoolDistrictName }}</Option>
                        </Select>
                    </form-item>
                    <form-item label="学期" prop="session" label-for="session">
                        <cascader :data="yearSessionData"
                                :clearable="false"
                                placeholder="请选择学年学期"
                                v-model="formValidate.session"
                                element-id="session"
                                :disabled="isEdit"
                                style="width:400px"
                                @on-change="cascaderChange">
                        </cascader>
                    </form-item>

                    <form-item label="年级" prop="gradeYear">
                        <Select v-model="formValidate.gradeYear"
                                :disabled="isEdit"
                                :label="formValidate.gradeYear"
                                style="width:400px"
                                placeholder="请选择年级">
                            <Option v-for="year in studentGradeData" :value="year.value" :key="year.label">{{ year.label }}</Option>
                        </Select>
                    </form-item>

                    <form-item label="考试日期" prop="formDate" label-for="formDate">
                        <date-picker format="yyyy-MM-dd"
                                    v-model="formValidate.formDate"
                                    element-id="formDate"
                                    :options="optionsStartDisabled"
                                    :disabled="isEdit"
                                    placeholder="请选择考试日期"
                                    type="daterange"
                                    :editable="false">
                        </date-picker>
                    </form-item>

                    <form-item label="成绩模式" prop="achieveMode">
                        <radio-group v-model="formValidate.achieveMode"
                                    @on-change ="achieveModeChange">
                            <radio :label="1">
                                <span>未选科</span>
                            </radio>
                            <radio :label="2">
                                <span>已选科</span>
                            </radio>
                        </radio-group>
                        <Select v-model="modeType"
                                v-if="formValidate.achieveMode === 2"
                                style="width:100px"
                                placeholder="请选择选科模式">
                            <Option :value="2" :key="2">3+1+2</Option>
                            <Option :value="3" :key="3">3+3</Option>
                        </Select>
                    </form-item>

                    <form-item label="排名方式" prop="rankType">
                        <radio-group v-model="formValidate.rankType">
                            <radio :label="1">
                                <span>百分位</span>
                            </radio>
                            <radio :label="2">
                                <span>名次</span>
                            </radio>
                        </radio-group>
                    </form-item>

                    <form-item label="其他校区是否可见" prop="otherSchoolSee">
                        <radio-group v-model="formValidate.otherSchoolSee">
                            <radio :label="0">
                                <span>不可见</span>
                            </radio>
                            <radio :label="1">
                                <span>可见</span>
                            </radio>
                        </radio-group>
                    </form-item>

                    <form-item label="学生可见" prop="studentCanSee">
                        <checkbox-group v-model="formValidate.studentCanSee">
                            <checkbox v-for="item in studentVisible"
                                    :key="item.id"
                                    :label="item.id">{{item.name}}</checkbox>
                        </checkbox-group>
                    </form-item>

                </Form>

                <div style="margin-left: 140px;">
                    <!-- <Button class="xy-btn-close" @click="goBack" style="margin-right:15px;">取消</Button> -->
                    <Button class="xy-btn-primary" shape="circle" :loading="loading" @click="save">
                        <span v-if="!loading">保存</span>
                        <span v-else>保存中...</span>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'AchievementRecordDetail',
    components: {
    },
    data () {
      return {
        loading: false,

        breadcrumbTitle: '创建方案',

        // 下拉框
        achievementTypeArr: [], // 考试类型
        schoolData: [], // 校区列表
        yearSessionData: [], // 学年学期
        studentGradeData: [], // 年级
        // 学生可见list
        studentVisible: [
          {
            name: '分数',
            id: 1
          },
          {
            name: '名次',
            id: 2
          },
          {
            name: '等级分',
            id: 4
          }
        ],

        // 基本信息
        arId: 0, // 编辑时方案id
        isEdit: false,

        // 当前选中学期的开始时间
        sessionStart: Date.now(),
        // 当前选中学期的结束时间
        sessionEnd: Date.now(),
        // 只可选择本学期以内的日期
        optionsStartDisabled: {
          disabledDate (date) {
            // return date && date.valueOf() > (Detail.sessionStart + 86400000) && date.valueOf() < (Detail.sessionEnd - 86400000);
          }
        },

        modeType: 2, // 成绩模式选择已选科时的下拉选择，默认3+1+2模式
        // 添加的验证
        formValidate: {
          formName: '',
          examTypeId: '',
          school: '',
          session: [],
          gradeYear: '',
          formDate: [], // 考试时间限制在学期内
          achieveMode: 2, // 成绩模式，默认为3+1+2
          rankType: 1, // 排名方式
          otherSchoolSee: 0, // 其他校区是否可见
          studentCanSee: [1] // 学生可见
        },
        ruleValidate: {
          formName: [
            { required: true, message: '考试名称不能为空', trigger: 'blur' }
          ],
          examTypeId: [
            { type: 'number', required: true, message: '请选择成绩类型', trigger: 'change' }
          ],
          school: [
            { type: 'number', required: true, message: '请选择校区', trigger: 'change' }
          ],
          session: [
            { type: 'array', required: true, message: '请选择学年学期', trigger: 'change' }
          ],
          gradeYear: [
            { type: 'number', required: true, message: '请选择年级', trigger: 'change' }
          ],
          formDate: [
            { type: 'array', len: 2, required: true, message: '请选择考试日期', trigger: 'change' }
          ],
          achieveMode: [
            { type: 'number', required: true, message: '请选择成绩模式', trigger: 'change' }
          ],
          rankType: [
            { type: 'number', required: true, message: '请选择排名方式', trigger: 'change' }
          ],
          otherSchoolSee: [
            { type: 'number', required: true, message: '请选择其他校区是否可见', trigger: 'change' }
          ],
          studentCanSee: [
            { type: 'array', trigger: 'change' }
          ]
        }
      }
    },
    created () {
      // 获取参数
      if (this.$store.state.educationAffairs.achievementRecordSearch.arId !== undefined) {
        this.arId = this.$store.state.educationAffairs.achievementRecordSearch.arId
        this.isEdit = true// 编辑
      } else {
        this.isEdit = false// 创建
      };

      this.getAchievementType()// 考试类型
      this.getSchool()// 校区--选校区作为参数获取年级
      this.getSessionNodeList()// 学年学期
    },
    mounted () {
      if (this.isEdit) {
        this.getById()
      }
    },
    methods: {
      async getById () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AchievementRecord/GetById`, {
          id: this.arId
        })
        this.xy.unloading()
        if (res.success) {
          var result = res.data
          this.formValidate.formName = result.AchievementRecordName
          this.formValidate.examTypeId = result.AchievementRecordExamTypeID
          this.formValidate.school = result.SchoolDistrictID
          this.formValidate.session = [result.AcademicYearID, result.AcademicSessionID]

          this.getStudentGrade(result)// 根据学校id获取年级列表

          this.formValidate.formDate = [result.StartTime, result.EndTime]

          this.formValidate.achieveMode = result.ScoreMode === 3 ? 2 : result.ScoreMode // 成绩模式=3 时选择已选科2
          this.modeType = result.ScoreMode !== 1 ? result.ScoreMode : ''// 成绩模式 =2(已选科)时，回显下拉框的具体模式3+1+2/3+3

          this.formValidate.rankType = result.RankingWay
          this.formValidate.otherSchoolSee = result.IsSchoolVisible ? 1 : 0

          var arr = []
          var setArr = function () {
            if (result.IsStudentVisible === 1) {
              arr = [1]
            } else if (result.IsStudentVisible === 2) {
              arr = [2]
            } else if (result.IsStudentVisible === 4) {
              arr = [4]
            } else if (result.IsStudentVisible === 3) {
              arr = [1, 2]
            } else if (result.IsStudentVisible === 5) {
              arr = [1, 4]
            } else if (result.IsStudentVisible === 6) {
              arr = [2, 4]
            } else if (result.IsStudentVisible === 7) {
              arr = [1, 2, 4]
            }
          }
          setArr()
          this.formValidate.studentCanSee = arr
        }
      },

      // 考试类型列表
      async getAchievementType () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AchievementRecord/GetExamType`)
        if (res.data) {
          this.achievementTypeArr = res.data
          if (!this.isEdit) {
            this.formValidate.examTypeId = res.data[0].AchievementRecordExamTypeID
          }
        }
      },
      // 校区列表
      async getSchool () {
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`)
        if (res.data) {
          this.schoolData = res.data
          if (!this.isEdit) {
            this.formValidate.school = res.data[0].SchoolDistrictID
            // 编辑时在获取校区id后已经调取了年级，此处防止重复调取写在if里
            this.getStudentGrade()// 年级
          }
        }
      },
      // 选择校区
      schoolChange (value) {
        this.getStudentGrade()// 年级
      },
      // 学年学期
      async getSessionNodeList (resObj) {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`)
        this.xy.unloading()
        if (res.success) {
          this.yearSessionData = res.data
          if (this.isEdit) {
            // 编辑时 学年学期值在getById中取值
          } else {
            // 创建
            this.formValidate.session = []
            var index = this.yearSessionData.map(function (item) {
              return item.IsCurrent
            }).indexOf(true)
            if (index !== -1) {
              this.formValidate.session.push(this.yearSessionData[index].value)
              var index1 = this.yearSessionData[index].children.map(function (item) {
                return item.IsCurrent
              }).indexOf(true)
              if (index1 !== -1) {
                this.formValidate.session.push(this.yearSessionData[index].children[index1].value)
              } else {
                this.formValidate.session.push(this.yearSessionData[index].children[0].value)
              }
            } else {
              for (var i = 0; i < this.yearSessionData.length; i++) {
                if (this.yearSessionData[i].children.length > 0) {
                  this.formValidate.session = [this.yearSessionData[i].value, this.yearSessionData[i].children[0].value]
                  return false
                }
              }
            }
          }
        }
      },
      // 选择学年学期
      cascaderChange (value, selectedData) {
        this.formValidate.session = value

        // this.formDate = ["2019-12-02", "2019-12-25"]
        // console.log(selectedData[1])
        // this.sessionStart = Date.parse(selectedData[1].StartDate);
        // this.sessionEnd = Date.parse(selectedData[1].EndDate);
      },
      // 选择成绩模式:成绩模式为已选科时，选科模式默认为3+1+2
      achieveModeChange (value) {
        if (value === 2) {
          this.modeType = 2
        }
      },
      // 根据校区获取年级
      async getStudentGrade (resObj) {
        var _this = this
        _this.xy.loading()
        _this.formValidate.gradeYear = ''// 年级置空
        let res = await _this.xy.get(`${_this.xyApi}/xy/comm/GetStudentGradeStudentYearBySid`, {
          schoolDistrictID: _this.formValidate.school
        })
        _this.xy.unloading()
        if (res.success) {
          _this.studentGradeData = []
          if (_this.isEdit) {
            // 编辑时年级回显
            _this.formValidate.gradeYear = resObj.StudentGradeForStudentYearID
          } else {
            // 默认选择第一个年级
            _this.formValidate.gradeYear = res.data[0].StudentGradeForStudentYearID
          }
          $.each(res.data, function (index, item) {
            _this.studentGradeData.push({
              value: item.StudentGradeForStudentYearID,
              tvalue: item.StudentGradeID,
              label: item.FullName
            })
          })
        }
      },
      // 选择年级
      studentYearChange (value) {
        this.formValidate.studentYear = value
      },
      // 保存
      async save () {
        var _this = this
        this.$refs.formValidate.validate(function (valid) {
          if (!valid) {
            _this.loading = false
          } else {
            for (var i = 0; i < _this.formValidate.formDate.length; i++) {
              if (_this.formValidate.formDate[i] === '') {
                _this.xy.msgError('请选择考试日期。')
                return false
              }
            }

            var start = _this.xy.moment(_this.formValidate.formDate[0]).format('YYYY-MM-DD')
            var end = _this.xy.moment(_this.formValidate.formDate[1]).format('YYYY-MM-DD')
            if (Date.parse(start) >= Date.parse(end)) {
              _this.xy.msgError('结束日期必须晚于开始日期。')
              return false
            }
            if (_this.isEdit) {
              _this.editFun()
            } else {
              _this.creatFun()
            }
          };
        })
      },
      async editFun () {
        this.loading = true
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AchievementRecord/Edit`, {
          AchievementRecordID: this.arId,
          AchievementRecordName: this.formValidate.formName,
          AchievementRecordExamTypeID: this.formValidate.examTypeId,
          AcademicYearID: this.formValidate.session[0],
          AcademicSessionID: this.formValidate.session[1],
          SchoolDistrictID: this.formValidate.school,
          StudentGradeForStudentYearID: this.formValidate.gradeYear,
          StartTime: this.xy.moment(this.formValidate.formDate[0]).format('YYYY-MM-DD'),
          EndTime: this.xy.moment(this.formValidate.formDate[1]).format('YYYY-MM-DD'),
          ScoreMode: this.formValidate.achieveMode !== 2 ? this.formValidate.achieveMode : this.modeType, // 成绩模式 =2(已选科)时，选择具体模式3+1+2/3+3
          RankingWay: this.formValidate.rankType, // 排名方式
          IsSchoolVisible: this.formValidate.otherSchoolSee === 1, // 其他校区是否可见
          // eslint-disable-next-line no-eval
          IsStudentVisible: eval(this.formValidate.studentCanSee.join('+')) // 学生可见 计算和
        })
        if (res.success) {
          this.xy.msgSuc('修改成功。')
          this.goBack()
        }
        this.loading = false
      },
      async creatFun () {
        this.loading = true
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AchievementRecord/Create`, {
          AchievementRecordName: this.formValidate.formName,
          AchievementRecordExamTypeID: this.formValidate.examTypeId,
          AcademicYearID: this.formValidate.session[0],
          AcademicSessionID: this.formValidate.session[1],
          SchoolDistrictID: this.formValidate.school,
          StudentGradeForStudentYearID: this.formValidate.gradeYear,
          StartTime: this.xy.moment(this.formValidate.formDate[0]).format('YYYY-MM-DD'),
          EndTime: this.xy.moment(this.formValidate.formDate[1]).format('YYYY-MM-DD'),
          ScoreMode: this.formValidate.achieveMode !== 2 ? this.formValidate.achieveMode : this.modeType, // 成绩模式 =2(已选科)时，选择具体模式3+1+2/3+3
          RankingWay: this.formValidate.rankType, // 排名方式
          IsSchoolVisible: this.formValidate.otherSchoolSee === 1, // 其他校区是否可见
          // eslint-disable-next-line no-eval
          IsStudentVisible: eval(this.formValidate.studentCanSee.join('+')) // 学生可见 计算和
        })
        if (res.success) {
          this.xy.msgSuc('创建成功。')
          this.goBack()
        }
        this.loading = false
      },
      // 返回上一页
      goBack () {
        this.$store.commit('common/getThreeMenuName', '')
        this.$router.push({ path: '/xyhome/achievementRecord', query: this.$store.state.common.menuInfo }) // or：this.$router.go(-1)

        // studentAchievement 跳转到成绩管理 ？？？
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
