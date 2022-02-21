<template>
    <div id="FuncInfo">
      <Alert show-icon closable>{{direction}}</Alert>

    <div class="ea_base" style="width: 500px;margin:20px auto">
        <i-form ref="formBasic" :model="formBasic" :rules="ruleBasic" :label-width="160">
            <form-item label="排考名称：" prop="name" labelFor="name">
                <i-input v-model="formBasic.name" elementId="name" placeholder="请输入"></i-input>
            </form-item>
            <form-item label="考试类型：" prop="type">
                <i-select v-model="formBasic.type">
                    <i-option v-for="item in examType" :value="item.AchievementRecordExamTypeID" :key="item.AchievementRecordExamTypeID" v-cloak>{{item.AchievementRecordExamTypeName}}</i-option>
                </i-select>
            </form-item>
            <form-item label="学年/学期：" prop="searchDefaultValue">
                <cascader
                  v-cloak
                  v-model="formBasic.searchDefaultValue"
                  :data="defaultList"
                  not-found-text="您还没有学年/学期的信息。"
                  @on-change="cascaderFunDefault"
                  :clearable="false"
                  placeholder="请选择学年/学期"
                  >
                </cascader>
            </form-item>
            <form-item label="校区/学届/学习阶段：" prop="studentDYGID">
                <cascader
                  v-model="formBasic.studentDYGID"
                  :clearable="false"
                  :data="studentDYGList"
                  not-found-text="您还没有校区/学届/学习阶段的信息。"
                  @on-change="cascaderFun"
                  >
                </cascader>
            </form-item>
            <form-item label="考试日期：" required labelFor="startDate">
                <Row>
                    <Col span="11">
                        <form-item prop="startDate">
                            <date-picker
                              elementId="startDate"
                              type="date"
                              :options='startOption'
                              v-cloak
                              @on-change='startDataChange'
                              v-model="formBasic.startDate"
                              :clearable="true"
                              >
                            </date-picker>
                        </form-item>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <form-item prop="endDate">
                            <date-picker
                              v-cloak
                              type="date"
                              :options='endOptions'
                              @on-change='endDataChange'
                              v-model="formBasic.endDate"
                              :clearable="true"
                              >
                            </date-picker>
                        </form-item>
                    </Col>
                </Row>
            </form-item>
            <div class="text-center" v-if="isEdit">
                <Button @click="CreateClick" shape="circle" class="xy-modal-primary">保存</Button>
            </div>
        </i-form>
    </div>
</div>
</template>

<script>
  export default {
    name: 'Basic',
    data () {
      return {
        examType: [],
        defaultList: [], // 学年学期list
        studentDYGList: [], // 校区/学届/学习阶段list
        AchievementTypeName: '',
        formBasic: {
          name: '',
          type: '', // 考试类型
          searchDefaultValue: [],
          studentDYGID: [],
          startDate: '',
          endDate: ''
        },
        direction: '设置过考试科目后本页内容不可更改。若需更改，请先删除考试科目。',
        endOptions: {
          disabledDate (date) {

          }
        },
        startOption: {
          disabledDate (date) {

          }
        },
        ruleBasic: {
          name: [
            { required: true, message: '排考名称不能为空', trigger: 'blur' },
            { type: 'string', max: 30, message: '排考名称最多可输入30字符', trigger: 'blur' }
          ],
          type: [
            { required: true, type: 'number', message: '考试类型不能为空', trigger: 'change' }
          ],
          searchDefaultValue: [
            { required: true, type: 'array', len: 2, message: '学年/学期不能为空', trigger: 'change' }
          ],
          studentDYGID: [
            { required: true, type: 'array', len: 3, message: '校区/学届/学习阶段不能为空', trigger: 'change' }
          ],
          startDate: [
            { required: true, type: 'date', message: '开始日期不能为空', trigger: 'blur' }
          ],
          endDate: [
            { required: true, type: 'date', message: '结束日期不能为空', trigger: 'blur' }
          ]
        },
        isEdit: true,
        // 是否拿到了方案的数据,并进行了绑定
        isModify: false,
        params: this.$store.state.educationAffairs.arrange
      }
    },
    created () {
      // console.log(2)
      // this.$emit('change', { StepList: this.params.StepList, step: 1 })
      // this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
      //   isIndex: 0,
      //   Steps: 1
      // }))
      // 控制步骤
      if (this.params.IsEnabled === 1) {
        this.isEdit = false
      } else {
        if (this.params.Steps * 1 < 2) {
          this.isEdit = true
        } else {
          this.isEdit = false
        };
      };
      // //考试类型
      // this.getAllExamType();
      // 学年学期
      this.getFilterData()
      // 校区-学届-学习阶段
      this.getStudentDYGList()
    },
    mounted () {
      if (this.params.ArrangeSupervisorExamID * 1 !== 0) {
        this.fetchById()
      } else {
        // 考试类型
        this.getAllExamType()
      };
    },
    methods: {
      async fetchById () {
        this.xy.loading()
        const params = {
          id: this.params.ArrangeSupervisorExamID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ArrangeSupervisorExam/GetById`, params)
        this.xy.unloading()
        if (res.success) {
          this.formBasic.name = res.data.ArrangeSupervisorExamName// 方案名称
          this.formBasic.type = res.data.AchievementTypeID// 考试类型
          this.formBasic.searchDefaultValue = [res.data.AcademicYearID, res.data.AcademicSessionID]// 学年学期
          this.formBasic.studentDYGID = [res.data.SchoolDistrictID, `${res.data.StudentYearID},${res.data.StudentGradeID}`, res.data.StudentGradeID]// 校区/学届/学习阶段
          this.formBasic.startDate = this.xy.moment(res.data.StartTime).format('YYYY-MM-DD')
          this.changeEndOptions()
          this.formBasic.endDate = this.xy.moment(res.data.EndTime).format('YYYY-MM-DD')
          this.changeStartOption()
          this.AchievementTypeName = res.data.AchievementTypeName // 考试名称
          this.isModify = true
          // 考试类型
          this.getAllExamType()
        }
      },
      // 获取考试类型
      async getAllExamType () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AchievementRecord/GetAllExamType`, null)
        this.xy.unloading()
        if (res.success) {
          // 若该考试类型已被删除，则添加方案已保存的考试类型
          if ((!res.data.some((item) => { return item.AchievementRecordExamTypeID === this.formBasic.type })) && (this.formBasic.type)) {
            res.data.unshift({
              AchievementRecordExamTypeID: this.formBasic.type,
              AchievementRecordExamTypeName: this.AchievementTypeName
            })
          }
          this.examType = res.data
        }
      },
      // 获取学年学期
      async getFilterData () {
        this.xy.loading()
        const params = {}
        let res = await this.xy.get(`${this.xyApi}/xy/Comm/GetSessionNodeList`, params)
        this.xy.unloading()
        if (res.success) {
          if (res.data.length) {
            // 生成学年学期列表
            this.defaultList = res.data
            // 若还未绑定当前方案数据，默认选取当前选中的学年和学期
            if (!this.isModify) {
              for (const item of res.data) {
                for (const t of item.children) {
                  if (item.IsCurrent && t.IsCurrent) {
                    this.formBasic.searchDefaultValue[0] = item.value
                    this.formBasic.searchDefaultValue[1] = t.value
                    return
                  }
                }
              }
            }
          }
        }
      },
      // 获取校区-学届-学习阶段
      async getStudentDYGList () {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSchoolDistrictNodeList`, null)
        this.xy.unloading()
        if (res.success) {
          // let curDt = res.data
          // let arr = []
          // for (let i in curDt) {
          //   if (curDt[i] && curDt[i].children && curDt[i].children.length) {
          //     for (let v in curDt[i].children) {
          //       if () {

          //       }
          //     }
          //   }
          // }
          this.studentDYGList = this.convertTree(res.data)
          // this.studentDYGList = res.data.map(val => {
          //   return {
          //     IsCurrent: val.IsCurrent,
          //     label: val.label,
          //     value: val.value,
          //     children: val.children && val.children.length ? val.children.map(vv => {
          //       return {
          //         IsCurrent: vv.IsCurrent,
          //         label: `${vv.label}/${vv.children && vv.children.length ? vv.children[0].label : ''}`,
          //         value: vv.value,
          //         children: vv.children
          //       }
          //     }) : []
          // }
          // })
        }
      },
      convertTree (val) {
        for (let i = 0; i < val.length; i++) {
          if (val[i].children.length > 0) {
            for (let j = 0; j < val[i].children.length; j++) {
              if (val[i].children[j].children.length > 0) {
                for (let q = 0; q < val[i].children[j].children.length; q++) {
                  // 学届返回的id都一样，编辑数据时，重新设置一下，学届的id（解决bug：校区/学届/学习阶段偶尔不展示)
                  val[i].children[j].value = `${val[i].children[j].value},${val[i].children[j].children[q].value}`
                }
              }
            }
          }
        }
        return val
      },
      // 选择学年学期
      cascaderFunDefault (vals) {
        this.formBasic.searchDefaultValue = vals
      },
      // 选择学习阶段
      cascaderFun (vals) {
        if (vals.length === 3 && typeof vals[1] === 'string') {
          if (vals[1].indexOf(',') !== -1) {
            this.formBasic.studentDYGID = [vals[0], parseInt(vals[1].split(',')[0] || vals[1]), vals[2]]
          }
        } else {
          this.formBasic.studentDYGID = vals
        }
      },
      // 第一个日期选择器选择日期
      startDataChange () {
        if (!this.formBasic.endDate) {
          this.formBasic.endDate = this.formBasic.startDate
          this.changeStartOption()
        }
        this.changeEndOptions()
      },
      // 设置第二个日期选择框的不可选择日期
      changeEndOptions () {
        if (this.formBasic.startDate) {
          this.endOptions = {
            disabledDate: (date) => {
              return (date.valueOf() < this.formBasic.startDate.valueOf()) || (date.valueOf() > this.formBasic.startDate.valueOf() + 86400000 * 2)
            }
          }
        } else {
          this.endOptions = {
            disabledDate (date) {

            }
          }
        }
      },
      // 第二个日期选择器选择日期
      endDataChange () {
        if (!this.formBasic.startDate) {
          this.formBasic.startDate = this.formBasic.endDate
          this.changeEndOptions()
        }
        this.changeStartOption()
      },
      // 设置第一个日期选择框的不可选择日期
      changeStartOption () {
        if (this.formBasic.endDate) {
          this.startOption = {
            disabledDate: (date) => {
              return (date.valueOf() > this.formBasic.endDate.valueOf()) || (date.valueOf() < this.formBasic.endDate.valueOf() - 86400000 * 2)
            }
          }
        } else {
          this.startOption = {
            disabledDate (date) {

            }
          }
        }
      },
      CreateClick () {
        // console.log(this.params)
        // let arr = JSON.parse(this.params.StepList)
        // for (let i = 0; i < 2; i++) {
        //   arr[i].IsDisabled = false
        // };
        // this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
        //   Steps: 1,
        //   StepList: JSON.stringify(arr)
        // }))
        // this.$emit('change', { StepList: arr, step: 1 })
        this.$refs.formBasic.validate((valid) => {
          if (valid) {
            let vals = this.formBasic.studentDYGID
            if (vals.length === 3 && typeof vals[1] === 'string') {
              if (vals[1].indexOf(',') !== -1) {
                this.formBasic.studentDYGID = [vals[0], parseInt(vals[1].split(',')[0]), vals[2]]
              }
            }
            let option = {
              ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID,
              ArrangeSupervisorExamName: this.formBasic.name,
              AchievementTypeID: this.formBasic.type,
              AcademicYearID: this.formBasic.searchDefaultValue[0],
              AcademicSessionID: this.formBasic.searchDefaultValue[1],
              SchoolDistrictID: this.formBasic.studentDYGID[0],
              StudentYearID: this.formBasic.studentDYGID[1],
              StudentGradeID: this.formBasic.studentDYGID[2],
              StartTime: this.xy.moment(this.formBasic.startDate).format('YYYY-MM-DD'),
              EndTime: this.xy.moment(this.formBasic.endDate).format('YYYY-MM-DD')
            }
            if (this.params.ArrangeSupervisorExamID > 0) {
              this.editRoom(option)
            } else {
              this.createRoom(option)
            };
          }
        })
      },
      async editRoom (option) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ArrangeSupervisorExam/Edit`, option)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc(res.msg || '编辑排考成功。')
          // this.params.SchoolDistrictID = this.formBasic.studentDYGID[0]
          // this.params.ArrangeSupervisorExamName = this.formBasic.name
          this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
            ArrangeSupervisorExamName: this.formBasic.name,
            SchoolDistrictID: this.formBasic.studentDYGID[0],
            Steps: 1
          }))
        }
      },
      async createRoom (option) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ArrangeSupervisorExam/Create`, option)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc(res.msg || '创建排考成功。')
          // this.params.SchoolDistrictID = this.formBasic.studentDYGID[0]
          // this.params.ArrangeSupervisorExamName = this.formBasic.name
          // this.params.ArrangeSupervisorExamID = res.data.result.ArrangeSupervisorExamID
          // this.params.lens = res.data.result.Step
          let arr = JSON.parse(this.params.StepList)
          let l = res.data.result.Step + 1
          for (let i = 0; i < l; i++) {
            if (i < l) {
              arr[i].IsDisabled = false
            } else {
              arr[i].IsDisabled = true
            }
          };
          this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
            ArrangeSupervisorExamID: res.data.result.ArrangeSupervisorExamID,
            ArrangeSupervisorExamName: this.formBasic.name,
            SchoolDistrictID: this.formBasic.studentDYGID[0],
            Steps: res.data.result.Step,
            StepList: JSON.stringify(arr)
          }))
          // console.log(this.params)
          this.$emit('change', { StepList: arr, step: res.data.result.Step })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
#FuncInfo {
  padding: 20px;
}
</style>
