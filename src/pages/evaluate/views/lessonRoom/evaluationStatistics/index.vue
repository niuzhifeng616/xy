<template>
  <div class="evaluation-statistics">
    <div style="background: rgb(255, 255, 255);padding-top: 20px;">
      <Form class="xy-flex">
        <template v-if="currentComponent !== 'IndexStudent'">
          <FormItem label-for="schoolGrade" :label-width='120' label="校区/年级:" label-position="left" >
              <Cascader
                element-id="schoolGrade"
                :data="schoolGradeList"
                @on-change="changeSchool"
                v-model="formValidateOK.schoolGrade"
                :clearable="false"
                placeholder="校区/年级"
                style="margin-right:10px;"
                >
              </Cascader>
          </FormItem>
          <FormItem label-for="yearSemester" label="学年/学期:" :label-width='80'>
            <Cascader
              element-id="yearSemester"
              :data="yearSemesterList"
              @on-change="changeYear"
              v-model="formValidateOK.yearSemester"
              :clearable="false"
              placeholder="学年/学期"
              style="margin-right:10px;"
              >
            </Cascader>
          </FormItem>
        </template>
        <FormItem :style="{'padding-left':currentComponent === 'IndexStudent'?'20px':'0'}">
          <DatePicker
            type="daterange"
            ref="formDate"
            format="yyyy-MM-dd"
            placeholder="选择时间"
            separator=" ~ "
            @on-change="dateChange"
            v-model="formValidateOK.date"
            :clearable="false"
            :options="options"
            >
          </DatePicker>
        </FormItem>
        <div class="crumbs-custom" v-if="currentComponent!=='IndexGrade'">
          <span class="back" @click="back" >
            <i class="iconfont">&#xe6a5;</i>
            <span>返回</span>
          </span>
        </div>
      </Form>
    </div>
    <div class="xy-content-module">
      <div class="xy-content-body">
        <div class="xy-content-title" v-if="currentComponent === 'IndexClass' || currentComponent === 'EvaluationDetails'">
          <p>学科/课程：</p>
          <Select v-model="bindingObj" style="width:200px; margin-right:10px;" value-key="value"  @on-change="checkAllGroupChange">
            <Option v-for="item in subjectData" :value="item" :key="item.onlyId">{{ item.CoursePlanTableFullName }}</Option>
          </Select>
          <Input clearable suffix="ios-search" v-if="currentComponent === 'EvaluationDetails'" search v-model="formValidateOK.Seach"  placeholder="请输入学生姓名或小组名" style="width:200px;margin-right:10px;" />
          <Button class="xy-primary"  @click="search">查询</Button>
          <Button class="xy-text"  v-if="currentComponent !== 'EvaluationDetails' && subjectData.length!==0" @click="toDetail">评价明细</Button>
        </div>
         <component  v-bind:is="currentComponent" ref="childFunctiifon" :objData="formValidateOK" :currentComponent="currentComponent"></component>
      </div>
    </div>
  </div>
</template>
<script>
  import IndexGrade from './indexComparison/IndexGrade.vue'
  import IndexClass from './indexComparison/IndexClass.vue'
  import IndexStudent from './indexComparison/IndexStudent.vue'
  import EvaluationDetails from './indexComparison/EvaluationDetails.vue'// 评价明细
  export default {
    components: {
      IndexGrade,
      IndexClass,
      IndexStudent,
      EvaluationDetails
    },
    name: 'indexComparison',
    data () {
      return {
        bindingObj: {},
        subjectData: [],
        schoolGradeList: [],
        yearSemesterList: [],
        options: {
          // 选择自定义时间所需参数
          disabledDate: function (date) {
            return date && date.valueOf() > Date.now()
          }
        },
        currentComponent: 'IndexGrade',
        formValidateOK: {
          schoolGrade: [],
          yearSemester: [],
          date: [],
          disabledDate: [],
          Seach: ''
        }
      }
    },
    created () {
      this.getSchoolGrade()
    },
    mounted () {
      // 控制级联下拉太宽导致的样式问题
      this.$nextTick(() => {
        $(document).on('mouseenter', '.ivu-cascader-menu .ivu-cascader-menu-item', function (e) {
          $('.ivu-cascader-menu-item').attr('title', e.target.innerText)
        })
      })
    },
    watch: {
      'formValidateOK.disabledDate': {
        handler (val) {
          this.options = {
            disabledDate: function (date) {
              let minDate = new Date(val[0])
              let maxDate = new Date(val[1])
              return date.getTime() < minDate || date.getTime() > maxDate
            }
          }
        },
        immediate: true
      }
    },
    methods: {
      // 班级的头部
      checkAllGroupChange (data) {
        if (data) {
          this.passData = this.$store.state.evaluate.averageObj.passData
          // 班级头部改变年级传列表的学科
          this.passData.CoursePlanAID = data.CoursePlanAID// 教学班id
          this.passData.CoursePlanAIDType = data.CoursePlanAIDType // 教学班type
          this.passData.DisciplineID = data.DisciplineID // 学科id
          this.$store.commit('evaluate/changeAverageObj', {
            passData: this.passData
          })
        }
      },
      search () {
        if (this.currentComponent === 'IndexClass') {
          this.$refs.childFunctiifon.change()
        } else if (this.currentComponent === 'EvaluationDetails') {
          this.$refs.childFunctiifon.pagination.current = 1
          this.$refs.childFunctiifon.getTable()// 评价明细数据
        }
      },
      toDetail () {
        this.currentComponent = 'EvaluationDetails'
      },
      // 学科
      async fetchSubject (data) {
        this.xy.loading()
        const params = {
          starTime: this.xy.moment(this.formValidateOK.date[0]).format('YYYY-MM-DD'),
          endTime: this.xy.moment(this.formValidateOK.date[1]).format('YYYY-MM-DD'),
          academicSessionID: this.formValidateOK.yearSemester[1], // 学期
          schoolDistrictID: this.formValidateOK.schoolGrade[0],
          studentGradeForStudentYearID: this.formValidateOK.schoolGrade[1]
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassRoomScoreRecord/GetDisciplinesByID`, params)
        this.xy.unloading()
        if (res.success) {
          if (res.data.length) {
            this.subjectData = res.data
            if (this.subjectData.length === 0) {
              this.$refs.childFunctiifon.isShow = false
            }
            // this.formValidateOK.disciplineID = this.subjectData[0].DisciplineID
            if (data === 'change') {
              this.bindingObj = this.subjectData[0]// 解决默认不选第一个的bug
            } else {
              // 选中的是年级的页面选择的班级
              if (this.$store.state.evaluate.averageObj.passData) {
                // 年级列表的所有班级
                this.subjectData = this.$store.state.evaluate.averageObj.passData.basicInformation
                this.subjectData.forEach(item => {
                  if (item.CoursePlanAID === this.$store.state.evaluate.averageObj.passData.CoursePlanAID && item.CoursePlanAIDType === this.$store.state.evaluate.averageObj.passData.CoursePlanAIDType) {
                    this.bindingObj = item
                  }
                })
              }
            }
            this.subjectData.forEach((item, index) => {
              item.onlyId = index
            })
          } else {
            this.subjectData = []
            this.bindingObj = ''
          }
        }
      },
      // 返回
      back () {
        if (this.currentComponent === 'IndexClass') {
          this.currentComponent = 'IndexGrade'
        } else if (this.currentComponent === 'IndexStudent') {
          this.currentComponent = 'IndexClass'
        } else if (this.currentComponent === 'EvaluationDetails') {
          this.formValidateOK.Seach = ''
          this.currentComponent = 'IndexClass'
        }
        if (this.currentComponent === 'IndexGrade') {
          setTimeout(() => {
            this.$refs.childFunctiifon.fetchSubject('keep')// 年级的学科
          }, 500)
        }
      },
      changeSchool (value, selectedData) {
        this.formValidateOK.schoolGrade = value
        if (this.currentComponent === 'IndexGrade') {
          this.$refs.childFunctiifon.fetchSubject()// 年级的学科
        } else if (this.currentComponent === 'IndexClass' || this.currentComponent === 'EvaluationDetails') {
          this.fetchSubject('change')// 学科
        }
      },
      changeYear (value, selectedData) {
        this.formValidateOK.yearSemester = value
        this.yearSemesterList.forEach((item, index) => {
          if (item.value === this.formValidateOK.yearSemester[0]) {
            if (item.children) {
              item.children.forEach((item1, index1) => {
                if (item1.value === this.formValidateOK.yearSemester[1]) {
                  this.formValidateOK.date = [this.yearSemesterList[index].children[index1].StartDate, this.yearSemesterList[index].children[index1].EndDate]
                  this.formValidateOK.disabledDate = [this.yearSemesterList[index].children[index1].StartDate, this.yearSemesterList[index].children[index1].EndDate]
                }
              })
            }
          }
        })
        if (this.currentComponent === 'IndexGrade') {
          this.$refs.childFunctiifon.fetchSubject()// 年级的学科
        } else if (this.currentComponent === 'IndexClass' || this.currentComponent === 'EvaluationDetails') {
          this.fetchSubject('change')// 学科
        }
      },
      // 获取校区、年级
      getSchoolGrade (resObj) {
        this.xy.loading()
        this.xy.get(`${this.xyApi}/xy/comm/GetSchoolDistrictForStudentGradeStudentYears`).then(res => {
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            resData.map(item => {
              item.value = item.ID
              item.label = item.Name
              item.children = item.Childrens
              item.children.map(cItem => {
                cItem.value = cItem.StudentGradeForStudentYearID
                // cItem.value = cItem.StudentYearForSchoolDistrictID
                cItem.label = cItem.FullName
                return cItem
              })
              return item
            })
            this.schoolGradeList = res.data
            if (this.schoolGradeList.length > 0 && this.schoolGradeList[0].children.length > 0) {
              this.formValidateOK.schoolGrade = [this.schoolGradeList[0].value, this.schoolGradeList[0].children[0].value]
            }
            this.getTableSessionNodeList()
          }
        })
      },
      // 获取学年、学期
      getTableSessionNodeList (resObj) {
        this.xy.loading()
        this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.yearSemesterList = res.data
            this.formValidateOK.yearSemester = []
            let index = this.yearSemesterList.map(item => {
              return item.IsCurrent
            }).indexOf(true)
            if (index !== -1) {
              this.formValidateOK.yearSemester.push(this.yearSemesterList[index].value)
              let index1 = this.yearSemesterList[index].children.map(item => {
                return item.IsCurrent
              }).indexOf(true)
              if (index1 !== -1) {
                this.formValidateOK.yearSemester.push(this.yearSemesterList[index].children[index1].value)
                this.formValidateOK.date = []
                this.formValidateOK.disabledDate = []
                this.formValidateOK.date = [this.yearSemesterList[index].children[index1].StartDate, this.yearSemesterList[index].children[index1].EndDate]
                // this.formValidateOK.date.push(this.xy.moment(new Date()).format('YYYY-MM-DD'))
                // this.formValidateOK.date.push(this.yearSemesterList[index].children[index1].EndDate)

                this.formValidateOK.disabledDate = [this.yearSemesterList[index].children[index1].StartDate, this.yearSemesterList[index].children[index1].EndDate]
              }
            } else {
              if (this.yearSemesterList.length > 0) {
                this.formValidateOK.yearSemester = [this.yearSemesterList[0].value, this.yearSemesterList[0].children[0].value]
                this.formValidateOK.date = []
                this.formValidateOK.disabledDate = []
                this.formValidateOK.date = [this.yearSemesterList[0].children[0].StartDate, this.yearSemesterList[0].children[0].EndDate]
                // this.formValidateOK.date.push(this.yearSemesterList[0].children[0].EndDate)
                this.formValidateOK.disabledDate = [this.yearSemesterList[0].children[0].StartDate, this.yearSemesterList[0].children[0].EndDate]
              }
            }
            if (this.currentComponent === 'IndexGrade') {
              this.$refs.childFunctiifon.fetchSubject()// 年级的学科
            } else if (this.currentComponent === 'IndexClass') {
              this.fetchSubject('change')// 学科
            }
          }
        })
      },
      // 日期改变
      dateChange (val) {
        this.formValidateOK.date = val
        if (this.currentComponent === 'IndexStudent') {
          this.$refs.childFunctiifon.getLineData()
          this.$refs.childFunctiifon.getRingData()
          this.$refs.childFunctiifon.getlineMoreData()
          this.$refs.childFunctiifon.getpieData()
          this.$refs.childFunctiifon.getradarData()
          this.$refs.childFunctiifon.getAll()
        } else if (this.currentComponent === 'IndexGrade') {
          this.$refs.childFunctiifon.fetchSubject()// 年级的学科
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.evaluation-statistics{
  .xy-content-title {
    border-radius: 4px 4px 0 0;
    border: 1px solid #d9d9d9;
    padding: 20px;
    display: flex;
    align-items: center;
    > p {
      text-align: right;
      margin-right: 12px;
      width: 94px;
    }
  }
  /deep/ .ivu-cascader-menu-item{
    max-width: 209px;
    overflow-x: hidden;
    text-overflow:ellipsis;
  }
  /deep/ .ivu-form-item{
    display: inline-block;
    margin-right: 20px;
    margin-bottom:0;
  }
  .tab{
    background: rgb(255, 255, 255);
    padding-left: 20px;
    margin-bottom: 10px;
    span{
      cursor: pointer;
      display: inline-block;
      width: 100px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      border-bottom: 2px solid #fff;
    }
    span.active{
      color: rgba(65,150,255,1);
      border-bottom: 2px solid rgba(65,150,255,1);
    }
  }
  // 返回
  .crumbs-custom{
    margin-right:30px;
    flex: 1;
    text-align: right;
    .name{
      font-size: 18px;
      font-weight:700;
      color:rgba(0,0,0,0.75);
    }
    .back{
      cursor: pointer;
      i{
        margin-right:5px;
        font-size: 14px;
        color: #1890FF;
      }
      span{
        color:#1890FF;
      }

    }
  }
}
</style>
