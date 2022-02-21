
<template>
  <div class="my-averge">
    <div class="xy-content-module">
      <div class="xy-content-title">
        <div class="box-pick container-top">
          <p class="title">对比学科：</p>
          <!-- <RadioGroup v-model="disciplineID" @on-change="changeSubject">
            <Radio :label="item.DisciplineID" v-for="item in subjectList" :key="item.DisciplineID">{{item.DisciplineName}}</Radio>
          </RadioGroup>
          <span v-if="subjectList.length===0" style="color:#999;">暂无数据</span> -->
          <div style="cursor: pointer;" class="xy-flex xy-start">
            <div class="calssName">
              <span style="cursor: pointer;" v-for="(item,index) in subjectList" :key="index"
                :class="item.isShow ? 'active':''"
                @click="changeSubject(item,index)">
                <Tooltip :content="item.DisciplineName" max-width="200" v-if="item.DisciplineName.length>10" >
                  {{item.DisciplineName.substr(0,10)+"...."}}
                </Tooltip>
                <span v-else>
                  {{item.DisciplineName}}
                </span>
              </span>
              <span v-if="subjectList.length===0">暂无学科信息</span>
            </div>
          </div>
        </div>
        <div class="box-pick container-top" style="margin-top:10px;">
          <p class="title">对比班级：</p>
          <div class="calssName">
            <span style="cursor: pointer;" v-for="(item,index) in classList" :key="index"
              :class="item.isShow ? 'active':''"
              @click="chooseclass(item,index)">
              <Tooltip :content="item.CoursePlanTableFullName" max-width="200" v-if="item.CoursePlanTableFullName.length>10" >
                {{item.CoursePlanTableFullName.substr(0,10)+"...."}}
              </Tooltip>
              <span v-else>
                {{item.CoursePlanTableFullName}}
              </span>
            </span>
            <span v-if="classList.length===0">暂无班级信息</span>
          </div>
          <!-- <template v-if="classList.length>0">
            <Checkbox :indeterminate="indeterminate"
                      :value="checkAll"
                      @click.prevent.native="handleCheckAll"
                      class="all-pick">全选</Checkbox>
            <CheckboxGroup v-model="checkAllGroup"
                          @on-change="checkAllGroupChange">
              <Checkbox :label='item.onlyId'  v-for="(item,index) in classList" :key="index">{{item.CoursePlanTableFullName}}</Checkbox>
            </CheckboxGroup>
          </template>
           <span v-if="classList.length===0" style="color:#999;">暂无数据</span> -->
        </div>
        <div class="search">
          <Button class="xy-primary" @click="fetchEcharts">查询</Button>
          <!-- <Button @click="reset">重置</Button> -->
        </div>
      </div>
      <div class="xy-content-body">
        <div class="left">
          <p>{{isShow?subject+'学科各教学班学生均分对比':''}}</p>
          <noData :tip="'该图表没有信息。'" v-if="echartsData.length===0"></noData>
          <div class="echarts" v-else>
            <div ref="subAvg"
                 style="height: 100%; width: 100%;"></div>
          </div>
        </div>
        <div class="right">
          <XyTable style="width:100%;" :isShowPage="false" :noDataText="'该搜索条件下没有结果。'"
                   :tbColumns="columns"
                   :tbData="tbData">
          </XyTable>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import XyTable from '@/components/table/XyTable'
  import noData from '../../../../components/noData'
  export default {
    components: {
      XyTable,
      noData
    },
    name: 'AverageGrade',
    props: {
      objData: {
        type: Object
      },
      currentComponent: {
        type: String
      }
    },
    watch: {
      objData: {
        handler (newVal) {
          this.schoolDistrictID = newVal.schoolGrade[0] // 校区
          this.studentGradeForStudentYearID = newVal.schoolGrade[1] // 年级
          this.academicSessionID = newVal.yearSemester[1]// 学期
          this.academicYearID = newVal.yearSemester[0]// 学年ID
          this.starTime = this.xy.moment(newVal.date[0]).format('YYYY-MM-DD')
          this.endTime = this.xy.moment(newVal.date[1]).format('YYYY-MM-DD')
          this.fetchSubject()
        },
        deep: true,
        immediate: true
      }
    },
    data () {
      return {
        isShow: false,
        subject: '',
        starTime: '',
        endTime: '',
        schoolDistrictID: '', // 校区
        academicSessionID: '', // 学期
        academicYearID: '', // 学年ID
        studentGradeForStudentYearID: '', // 年级
        disciplineID: '',
        tbData: [],
        columns: [
          {
            title: '班级',
            minWidth: 200,
            key: 'CoursePlanTableFullName'
          },
          {
            width: 200,
            title: '任课教师',
            key: 'TeacherNames'
          },
          {
            width: 200,
            title: '人数',
            key: 'StudentCount'
          },

          {
            width: 200,
            title: '班级均分',
            render: function (h, params) {
              return h('div', [h('span', {}, params.row.Score === 'Infinity' ? '--' : params.row.Score)])
            }
          },
          {
            title: '操作',
            width: 100,
            render: (h, params) => {
              return h('div', {
                'class': {
                  oprateList: true
                }
              }, [
                h('a', {
                  'style': {
                    color: params.row.Score === 'Infinity' ? '#ddd' : '',
                    cursor: params.row.Score === 'Infinity' ? 'auto' : ''
                  },
                  on: {
                    click: () => {
                      if (params.row.Score !== 'Infinity') {
                        this.toClass(params.row)
                      }
                    }
                  }
                }, '查看')
              ])
            }
          }
        ],
        indeterminate: false,
        checkAll: false,
        checkAllGroup: [],
        checkArr: [],
        subjectList: [],
        classList: [],
        passData: {},
        echartsData: []
      }
    },
    created () {
    },
    mounted: function () {

    },
    methods: {
      // 班级
      chooseclass (data, index) {
        if (data.isShow) {
          data.isShow = false
          // 全选
          if (data.onlyId === '-1') {
            this.classList.forEach(item1 => {
              this.checkArr = []
              item1.isShow = false
            })
          } else {
            // 全选取消
            this.classList[0].isShow = false
            let index1 = this.checkArr.map(element => { return element.onlyId }).indexOf(data.onlyId)
            if (index1 !== -1) {
              this.checkArr.splice(index1, 1)
            }
          }
        } else {
          // 全选
          if (data.onlyId === '-1') {
            this.checkArr = []
            this.classList.forEach(item1 => {
              this.checkArr.push({ CoursePlanAID: item1.CoursePlanAID, CoursePlanAIDType: item1.CoursePlanAIDType, onlyId: item1.onlyId })
              item1.isShow = true
            })
          } else {
            data.isShow = true
            this.checkArr.push({ CoursePlanAID: data.CoursePlanAID, CoursePlanAIDType: data.CoursePlanAIDType, onlyId: data.onlyId })
          }
          // 自动全选
          if (this.checkArr.length === this.classList.length - 1) {
            this.classList.forEach((item, index) => {
              item.isShow = true
            })
          }
        }
        // 删除全选-1
        this.checkArr.forEach((item, index) => {
          if (item.onlyId === '-1') {
            this.checkArr.splice(index, 1)
          }
        })
        console.log('选中的', this.checkArr)
        const isShow = data.isShow
        this.updateDraft(this.classList, index, { isShow })
      },
      // 更新视图
      updateDraft (tableData, index, field) {
        console.log('field', field)
        const obj = Object.assign({}, tableData[index])
        this.$set(tableData, index, {})
        for (var key in field) {
          obj[key] = field[key]
        }
        this.$set(tableData, index, obj)
      },
      changeSubject (data, index) {
        console.log(111, data)
        this.subjectList.forEach(item => {
          item.isShow = false
          if (item.DisciplineID === data.DisciplineID) {
            item.isShow = true
            const isShow = item.isShow
            this.updateDraft(this.subjectList, index, { isShow })
            this.disciplineID = data.DisciplineID
            this.fetchClass()
          }
        })
        console.log('  this.subjectList', this.subjectList)
        // todo
        // let data1 = this.subjectList.find(v => v.DisciplineID === data.DisciplineID)
        // if (data1) {
        //   this.subject = data1.DisciplineName
        //   // 点击学科重新获取班级
        //   this.checkAllGroup = []// 清空选中的班级(组件绑定的)
        //   this.checkArr = []// 清空选中的班级(接口需要的)
        //   this.checkAll = false
        //   this.indeterminate = false
        //   this.fetchClass()
        // } else {
        //   return ''
        // }
      },
      toClass (data) {
        this.passData = {
          academicSessionID: this.academicSessionID,
          schoolDistrictID: this.schoolDistrictID,
          academicYearID: this.academicYearID,
          studentGradeForStudentYearID: this.studentGradeForStudentYearID,
          disciplineID: this.disciplineID,
          starTime: this.starTime,
          endTime: this.endTime,
          checkArr: { CoursePlanAID: data.CoursePlanAID, CoursePlanAIDType: data.CoursePlanAIDType },
          StudentCount: data.StudentCount,
          Score: data.Score,
          name: data.CoursePlanTableFullName
        }

        this.$store.commit('evaluate/changeAverageObj', {
          passData: this.passData
        })

        this.$store.commit('common/getThreeMenuName', data.CoursePlanTableFullName)
        this.$store.commit('common/getParam', { currentComponent: this.currentComponent })// 在这传个对象
        this.$router.push({
          path: '/xyhome/AverageGrade/AverageClass',
          query: this.$store.state.common.menuInfo
        })
      },
      // 获取学科
      async fetchSubject () {
        this.xy.loading()
        const params = {
          academicSessionID: this.academicSessionID,
          schoolDistrictID: this.schoolDistrictID,
          studentGradeForStudentYearID: this.studentGradeForStudentYearID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AverageRecord/GetDisciplinesByID`, params)
        this.xy.unloading()
        if (res.success) {
          this.subjectList = []
          if (res.data.length) {
            this.disciplineID = res.data[0].DisciplineID
            this.subject = res.data[0].DisciplineName
            this.subjectList = res.data
            this.subjectList.map(item => {
              item.isShow = false
            })
            this.subjectList[0].isShow = true
            if (this.disciplineID) {
              this.fetchClass()
            }
          }
        }
      },
      // 获取班级信息
      async fetchClass () {
        this.xy.loading()
        const params = {
          academicSessionID: this.academicSessionID,
          schoolDistrictID: this.schoolDistrictID,
          studentGradeForStudentYearID: this.studentGradeForStudentYearID,
          disciplineID: this.disciplineID,
          starTime: this.starTime,
          endTime: this.endTime
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AverageRecord/GetDisciplineCourseplanInfoByID`, params)
        this.xy.unloading()
        if (res.success) {
          this.classList = []
          if (res.data.length) {
            this.classList = res.data
            this.classList.forEach((item, index) => {
              item.onlyId = index
            })
            this.classList.unshift({ CoursePlanAID: '-1', CoursePlanAIDType: '-1', CoursePlanTableFullName: '全部', onlyId: '-1' })
          }
        }
      },
      reset () {
        this.disciplineID = ''
        this.checkAllGroup = []
        this.checkArr = []
      },
      // 语文学科各教学班学生均分对比
      async fetchEcharts () {
        if (this.disciplineID) {
          this.xy.loading()
          const params = {
            AcademicSessionID: this.academicSessionID,
            AcademicYearID: this.academicYearID,
            SchoolDistrictID: this.schoolDistrictID,
            StudentGradeForStudentYearID: this.studentGradeForStudentYearID,
            DisciplineID: this.disciplineID,
            CoursePlan: this.checkArr,
            StarTime: this.starTime,
            EndTime: this.endTime
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/AverageRecord/GetClassComparativeInformations`, params)
          this.xy.unloading()
          if (res.success) {
            this.echartsData = res.data.Models
            if (res.data.Models) {
              this.isShow = true
              this.tbData = res.data.Models
              let xData = []; let yData = []
              this.tbData.forEach(item => {
                xData.push(item.CoursePlanTableFullName)
                yData.push(item.Score)
              })
              this.fetch(xData, yData)
            }
          }
        }
      },
      fetch (xData, yData) {
        yData.map((item, index) => {
          if (item === 'Infinity') {
            yData[index] = '暂无数据'
          }
        })
        this.$nextTick(() => {
          let subAvgEc = this.echarts.init(this.$refs.subAvg)
          let option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            xAxis: {
              type: 'category',
              data: xData
            },
            yAxis: {
              type: 'value',
              boundaryGap: false,
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              },
              axisLine: {
                show: false
              }
            },
            series: [{
              data: yData,
              type: 'bar',
              color: '#3AA0FF',
              barWidth: '20%',
              markPoint: {
                data: [
                  { type: 'max', name: '最大值' },
                  { type: 'min', name: '最小值' }
                ]
              },
              markLine: {
                data: [
                  { type: 'average', name: '平均值' }
                ]
              }
            }]
          }
          subAvgEc.setOption(option)
        })
      },
      handleCheckAll () {
        if (this.indeterminate) {
          this.checkAll = false
        } else {
          this.checkAll = !this.checkAll
        }
        this.indeterminate = false

        if (this.checkAll) {
          this.classList.forEach(item => {
            this.checkAllGroup.push(item.onlyId)
            this.checkArr.push({ CoursePlanAID: item.CoursePlanAID, CoursePlanAIDType: item.CoursePlanAIDType })
          })
        } else {
          this.checkAllGroup = []
          this.checkArr = []
        }
      },
      checkAllGroupChange (data) {
        this.checkArr = []
        this.classList.forEach(item => {
          data.forEach(item1 => {
            if (item.onlyId === item1) {
              this.checkArr.push({ CoursePlanAID: item.CoursePlanAID, CoursePlanAIDType: item.CoursePlanAIDType })
            }
          })
        })
        if (data.length === this.classList.length) {
          this.indeterminate = false
          this.checkAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.checkAll = false
        } else {
          this.indeterminate = false
          this.checkAll = false
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.my-averge {
  .xy-content-module {
    padding: 20px;
    background-color: #fff;
    .xy-content-title {
      border-radius: 4px 4px 0 0;
      padding: 20px;
      border: 1px solid #d9d9d9;
      color: rgba(0, 0, 0, 1);
      display: flex;
      flex-flow: column nowrap;
      .box-pick {
        display: flex;
        align-items: center;
        min-height: 40px;
        color:rgba(0,0,0,0.85);
        // padding: 30px 0px 15px 0px;
        .title {
          display: flex;
          align-content: center;
          min-width: 82px;
          justify-content: flex-end;
          margin-right: 14px;
        }
        .all-pick {
          min-width: 56px;
        }
      }
      .container-top{
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        div.calssName{
          &>span:last-child{
            margin-right: 0px;
          }
          &>span{
              box-sizing: content-box;
              display: inline-block;
              padding:0 15px;
              color:rgba(0,0,0,0.65);
              background: #fff;
              height: 22px;
              line-height: 22px;
              text-align: center;
              border-radius: 5px;
              margin-right: 20px;
              margin-bottom:10px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
            &>span.active{
              background: rgba(65,150,255,1);
              color:#fff;
            }
        }
      }
      .search {
        padding-top: 15px;
        margin-left: 95px;
      }
    }
    .xy-content-body {
      border: 1px solid #d9d9d9;
      border-top: none;
      border-radius: 0 0 4px 4px;
      display: flex;
      justify-content: space-between;
      .left {
        width: 50%;
        > p {
          padding: 30px 0 0 20px;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.85);
          font-weight: bold;
        }
        .echarts {
          width: 100%;
          height: calc(100% - 30px);
        }
      }
      .right {
        margin-top:20px;
        flex:1;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
