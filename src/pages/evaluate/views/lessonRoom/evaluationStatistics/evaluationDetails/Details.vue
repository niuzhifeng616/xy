
<template>
  <div class="details">
     <div class="xy-content-module">
        <div class="xy-content-title">
          <p>学科/课程：</p>
          <Select v-model="coursePlanAID" style="width:200px; margin-right:10px;"  @on-change="checkAllGroupChange">
            <Option v-for="item in subjectData" :value="item.CoursePlanAID" :key="item.CoursePlanAID">{{ item.CoursePlanTableFullName }}</Option>
          </Select>
          <Input suffix="ios-search"  v-model.trim="searchVal" placeholder="输入学生名称或者小组名称" style="width: auto;margin:0 20px;" @on-search="searchName"/>
          <Button class="xy-primary" @click="getTable">查询</Button>
          <!-- <Button class="xy-text" @click="reset">重置</Button> -->
        </div>
        <div class="xy-content-body"  style="padding:0px">
          <div style="padding-top:20px">
            <!-- 暂时用这个看下效果 -->
            <!-- <Table :columns="columns" :data="data" border ></Table> -->
           <XyTable :noDataText="'该搜索条件下没有结果。'" :isShowPage="false"
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
  export default {
    name: 'Details',
    components: {
      XyTable
    },
    props: {
      objData: {
        type: Object
      }
    },
    data () {
      return {
        starTime: '',
        endTime: '',
        schoolDistrictID: '', // 校区
        academicSessionID: '', // 学期
        studentGradeForStudentYearID: '', // 年级
        subjectData: [],
        subject: {},
        coursePlanAID: 0,
        searchVal: '',
        tbData: [],
        columns: [
          {
            title: '日期',
            key: 'ClassDateTime',
            width: 200
          },
          {
            title: '节次',
            key: 'Time',
            width: 200
          },
          {
            title: '评价对象',
            key: 'RecordObjectName',
            minWidth: 200
          },
          {
            title: '指标项目',
            key: 'IndexManagementName',
            minWidth: 200
          },
          {
            title: '得星数',
            key: 'ScoringValue',
            width: 100,
            render (h, params) {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: `<span> ` + params.row.ScoringValue + `<span> `
                  }
                }),
                h('img', {
                  style: {
                    width: '18px',
                    height: '18px',
                    marginLeft: '6px'
                  },
                  domProps: {
                    src: require('./imgs/start.svg')
                  }
                })
              ])
            }
          },
          {
            width: 200,
            title: '评价人员',
            key: 'LastModifyUserName'
          },
          {
            title: '时间',
            key: 'LastModifyByDate',
            width: 200
          }
        ]
      }
    },
    created () {

    },
    watch: {
      objData: {
        handler (newVal) {
          this.schoolDistrictID = newVal.schoolGrade[0] // 校区
          this.studentGradeForStudentYearID = newVal.schoolGrade[1] // 年级
          this.academicSessionID = newVal.yearSemester[1]// 学期
          this.starTime = this.xy.moment(newVal.date[0]).format('YYYY-MM-DD')
          this.endTime = this.xy.moment(newVal.date[1]).format('YYYY-MM-DD')
          this.fetchSubject()
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      // 获取学科
      async fetchSubject () {
        this.xy.loading()
        const params = {
          starTime: this.starTime,
          endTime: this.endTime,
          academicSessionID: this.academicSessionID,
          schoolDistrictID: this.schoolDistrictID,
          studentGradeForStudentYearID: this.studentGradeForStudentYearID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassRoomScoreRecord/GetDisciplinesByID`, params)
        this.xy.unloading()
        if (res.success) {
          if (res.data.length) {
            this.subjectData = []
            this.subjectData = res.data
            this.coursePlanAID = this.subjectData[0].CoursePlanAID
            this.subject = this.subjectData[0]
            this.getTable()
          }
        }
      },
      checkAllGroupChange (data) {
        let index = this.subjectData.map(item => { return item.CoursePlanAID }).indexOf(data)
        if (index > -1) {
          this.subject = this.subjectData[index]
        }
        // this.getTable()
      },
      // 获取列表
      getTable () {
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/ClassRoomScoreRecord/GetScoreRecordLog`, {
          AcademicSessionID: this.academicSessionID,
          SchoolDistrictID: this.schoolDistrictID,
          StudentGradeForStudentYearID: this.studentGradeForStudentYearID,
          StarTime: this.starTime,
          EndTime: this.endTime,
          DisciplineID: this.subject.DisciplineID,
          Seach: this.searchVal,
          CoursePlan: {
            DisciplineID: this.subject.DisciplineID,
            CoursePlanAID: this.subject.CoursePlanAID,
            CoursePlanAIDType: this.subject.CoursePlanAIDType
          }

        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            if (res.data.ScoringMethod === 1) { // 1 :星星，0：打分
              this.columns.splice(4, 1, {
                title: '得星数',
                key: 'ScoringValue',
                render (h, params) {
                  return h('div', [
                    h('span', {
                      domProps: {
                        innerHTML: `<span> ` + params.row.ScoringValue + `<span> `
                      }
                    }),
                    h('img', {
                      style: {
                        width: '18px',
                        height: '18px',
                        marginLeft: '6px'
                      },
                      domProps: {
                        src: require('./imgs/start.svg')
                      }
                    })
                  ])
                }
              })
            } else {
              this.columns.splice(4, 1, {
                title: '得分',
                key: 'ScoringValue'
              })
            }
            this.tbData = res.data
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.details{
    .xy-content-module {
      padding: 20px;
      background-color: #fff;
    .xy-content-title {
      border-radius: 4px 4px 0 0;
      border: 1px solid #d9d9d9;
      padding: 20px;
      display: flex;
      align-items: center;
      > p {
        text-align: right;
        margin-right: 12px;
        width: 80px;
      }
    }
     .xy-content-body {
      border: 1px solid #d9d9d9;
      border-top: none;
      border-radius: 0 0 4px 4px;
     }
  }
  .ivu-form-item{
    margin-bottom: 10px;
  }
}
</style>
