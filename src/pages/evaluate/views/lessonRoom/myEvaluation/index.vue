<template>
  <div class="my-evaluation">
    <div style="background: rgb(255, 255, 255);padding-top: 20px;">
      <Form  class="xy-flex">
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
          <FormItem label-for="session" :label-width='80' label="学年/学期:">
              <cascader
                element-id="session"
                :data="yearSessionData"
                style="width:300px"
                v-model="formValidateOK.session"
                @on-change="cascaderChange"
                placeholder=""
                :clearable="false"
                >
              </cascader>
          </FormItem>
          <FormItem >
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
          <div class="crumbs-custom" v-if="currentComponent!=='MyAverage'">
            <span class="back" @click="back" >
              <i class="iconfont">&#xe6a5;</i>
              <span>返回</span>
            </span>
          </div>
      </Form>
    </div>
    <div class="xy-content-module">
      <div class="xy-content-body" :class="currentComponent==='MyIndex'?'nobg':''">
        <div class="xy-content-title">
          <p>学科/课程：</p>
          <Select v-model="bindingObj" style="width:200px; margin-right:10px;"  @on-change="checkAllGroupChange">
            <Option v-for="item in subjectData" :value="item" :key="item.onlyId">{{ item.CoursePlanTableFullName }}</Option>
          </Select>
          <Button class="xy-primary"  @click="search">查询</Button>
          <Button class="xy-text" v-if="currentComponent!=='MyDetails' && subjectData.length!==0" @click="toDetail">评价明细</Button>
        </div>
         <component v-bind:is="currentComponent" ref="childFunction" :objData="formValidateOK"></component>
      </div>
    </div>
  </div>
</template>
<script>
  import MyAverage from './MyAverage.vue'
  import MyDetails from './MyDetails'
  export default {
    name: 'myEvaluation',
    components: {
      MyAverage,
      MyDetails
    },
    data () {
      return {
        bindingObj: {},
        subjectData: [],
        options: {
          // 选择自定义时间所需参数
          disabledDate: function (date) {
            return date && date.valueOf() > Date.now()
          }
        },
        list: [
          { name: '均分', id: 1 },
          { name: '指标', id: 2 },
          { name: '评价明细', id: 3 }
        ],
        currentComponent: 'MyAverage',
        schoolGradeList: [],
        yearSessionData: [],
        formValidateOK: {
          schoolGrade: [],
          session: [],
          date: [],
          disciplineID: '',
          checkArr: [],
          disabledDate: []
        }
      }
    },
    mounted () {
      // 控制级联下拉太宽导致的样式问题
      this.$nextTick(() => {
        $(document).on('mouseenter', '.ivu-cascader-menu .ivu-cascader-menu-item', function (e) {
          $('.ivu-cascader-menu-item').attr('title', e.target.innerText)
        })
      })
    },
    created () {
      this.getSchoolGrade()
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
      // 时间改变
      dateChange () {
        this.fetchSubject()// 学科
      },
      toDetail () {
        this.currentComponent = 'MyDetails'
        setTimeout(() => {
          this.$refs.childFunction.getTable()
        }, 500)
      },
      checkAllGroupChange (data) {
        this.formValidateOK.checkArr = {}
        // 解决默认不选第一个的bug
        this.formValidateOK.checkArr = { CoursePlanAID: data.CoursePlanAID, CoursePlanAIDType: data.CoursePlanAIDType }
        this.formValidateOK.disciplineID = data.DisciplineID
      },
      async fetchSubject () {
        this.xy.loading()
        const params = {
          starTime: this.formValidateOK.date[0],
          endTime: this.formValidateOK.date[1],
          academicSessionID: this.formValidateOK.session[1], // 学期
          schoolDistrictID: this.formValidateOK.schoolGrade[0],
          studentGradeForStudentYearID: this.formValidateOK.schoolGrade[1]
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MyEvaluationStatistics/GetDisciplinesByID`, params)
        this.xy.unloading()
        if (res.success) {
          if (res.data.length) {
            this.subjectData = res.data
            this.formValidateOK.disciplineID = this.subjectData[0].DisciplineID

            this.bindingObj = this.subjectData[0]// 解决默认不选第一个的bug

            this.formValidateOK.checkArr = { CoursePlanAID: this.subjectData[0].CoursePlanAID, CoursePlanAIDType: this.subjectData[0].CoursePlanAIDType }
            this.subjectData.forEach((item, index) => {
              item.onlyId = index
            })
            if (this.currentComponent === 'MyAverage') {
              this.$refs.childFunction.getLineData()
              this.$refs.childFunction.getRingData()
              this.$refs.childFunction.getlineMoreData()
              this.$refs.childFunction.getpieData()
              this.$refs.childFunction.getradarData()
              this.$refs.childFunction.getAll()
            } else if (this.currentComponent === 'MyDetails') {
              this.$refs.childFunction.getTable()
            }
          } else {
            this.subjectData = []
            this.formValidateOK.checkArr = []
            this.bindingObj = ''
            this.formValidateOK.disciplineID = ''
          }
        }
      },
      // 返回
      back () {
        this.currentComponent = 'MyAverage'
        setTimeout(() => {
          this.$refs.childFunction.getLineData()// 每日得分折线图
          this.$refs.childFunction.getRingData()// 环形图
          this.$refs.childFunction.getlineMoreData()// 多折线
          this.$refs.childFunction.getpieData()// 饼图(二级指标)
          this.$refs.childFunction.getradarData()// 雷达(三级指标)
          this.$refs.childFunction.getAll()// 总表
        })
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
            this.getSessionNodeList()
          }
        })
      },
      // 学年学期
      async getSessionNodeList (resObj) {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`, null, true)
        this.xy.unloading()
        if (res.success) {
          this.yearSessionData = res.data
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
              this.formValidateOK.date = []
              this.formValidateOK.date = [this.yearSessionData[index].children[index1].StartDate, this.yearSessionData[index].children[index1].EndDate]
              // this.formValidateOK.date.push(this.xy.moment(new Date()).format('YYYY-MM-DD'))
              // this.formValidateOK.date.push(this.yearSessionData[index].children[index1].EndDate)
              this.formValidateOK.disabledDate = [this.yearSessionData[index].children[index1].StartDate, this.yearSessionData[index].children[index1].EndDate]
            }
          } else {
            if (this.yearSessionData.length > 0) {
              this.formValidateOK.yearSemester = [this.yearSessionData[0].value, this.yearSessionData[0].children[0].value]
              this.formValidateOK.date = []
              this.formValidateOK.disabledDate = []
              this.formValidateOK.date = [this.yearSessionData[0].children[0].StartDate, this.yearSessionData[0].children[0].EndDate]
              // this.formValidateOK.date.push(this.yearSessionData[0].children[0].EndDate)
              this.formValidateOK.disabledDate = [this.yearSessionData[0].children[0].StartDate, this.yearSessionData[0].children[0].EndDate]
            }
          }
          this.fetchSubject()// 学科
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 查询
      search () {
        if (this.bindingObj) {
          if (this.currentComponent === 'MyAverage') {
            this.$refs.childFunction.getLineData()
            this.$refs.childFunction.getRingData()
            this.$refs.childFunction.getlineMoreData()
            this.$refs.childFunction.getpieData()
            this.$refs.childFunction.getradarData()
            this.$refs.childFunction.getAll()
          } else if (this.currentComponent === 'MyDetails') {
            this.$refs.childFunction.getTable()
          }
        } else {
          this.xy.msgW('您还没有选择学科。')
        }
      },
      clickTab (item) {
        this.activeId = item.id
        if (item.id === 1) {
          this.currentComponent = 'MyAverage'
        } else if (item.id === 2) {
          this.currentComponent = 'MyIndex'
        } else {
          this.currentComponent = 'MyDetails'
        }
      },
      changeSchool (value, selectedData) {
        this.formValidateOK.schoolGrade = value
        this.fetchSubject()// 学科
      },
      cascaderChange (value, selectedData) {
        this.formValidateOK.session = value
        // 变化学年学期时间动态变化
        this.yearSessionData.forEach((item, index) => {
          if (item.value === this.formValidateOK.session[0]) {
            if (item.children) {
              item.children.forEach((item1, index1) => {
                if (item1.value === this.formValidateOK.session[1]) {
                  this.formValidateOK.date = [this.yearSessionData[index].children[index1].StartDate, this.yearSessionData[index].children[index1].EndDate]
                  this.formValidateOK.disabledDate = [this.yearSessionData[index].children[index1].StartDate, this.yearSessionData[index].children[index1].EndDate]
                }
              })
            }
          }
        })
        this.fetchSubject()// 学科
      }
    }
  }
</script>
<style lang="less" scoped>
.my-evaluation{
  /deep/.ivu-cascader-menu-item{
    max-width: 209px;
    overflow-x: hidden;
    text-overflow:ellipsis;
  }
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
 /deep/ .ivu-form-item{
    display: inline-block;
    margin-right: 20px;
    margin-bottom:0;
  }
  .nobg{
    background: #f9f9f9;
    padding:0;
  }
   .tab{
    background: rgb(255, 255, 255);
    padding-left: 20px;
    margin-bottom: 10px;
    span{
      cursor: pointer;
      display: inline-block;
      width: 110px;
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
}
</style>
