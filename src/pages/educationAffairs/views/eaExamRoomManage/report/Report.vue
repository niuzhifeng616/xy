<!-- 这里是报表汇总 -->
<template>
<div class="xy-content-module" id="XyContentModuleReplace">
    <div class="xy-content-title">
      <div class="title-right">
        <span>学年学期：</span>
        <Cascader
          v-model="searchDefaultValue"
          class="steps-title-select-top"
          :data="defaultList"
          :clearable="false"
          not-found-text="您还没有学年/学期的信息。"
          @on-change="cascaderFunDefault"
          placeholder="学年学期"
          style="width:200px"
          >
        </Cascader >
        <span>学科：</span>
        <Select
          v-if="ArrangeSupervisorExamID>0"
          v-model="ArrangeSupervisorExamID"
          class="steps-title-select-bottom"
          @on-change="searchProgrammeChange"
          placeholder="选择学科"
          style="width:200px"
          >
          <Option
            v-for="Item in searchProgrList"
            :value="Item.ArrangeSupervisorExamID"
            :key="Item.ArrangeSupervisorExamID"
            v-cloak
            >
            {{ Item.ArrangeSupervisorExamName }}
          </Option>
        </Select>
      </div>
      <div class="steps-title-nav">
        <div v-for="(item,index) in StepsList" @click="StepBtn(item, index)" :key="index" >
          <router-link :to="{path: item.Url, query:$store.state.common.menuInfo}" tag='div' :class="index===sIndex?'active':''">
            <div class="steps-title-nav-name">{{item.Name}}</div>
          </router-link>
        </div>
      </div>
    </div>
    <div class="xy-content-body pr">
        <router-view :ASExamID = 'ArrangeSupervisorExamID' :FSType='FixedSubjectType' />
    </div>
</div>
</template>

<script>
  export default {
    name: 'ExamReport',
    data () {
      return {
        sIndex: 0,
        searchDefaultValue: [0, 0],
        // 学年学期
        defaultList: [
          {
            value: 0,
            label: '所有学年',
            children: [
              {
                value: 0,
                label: '所有学期'
              }
            ]
          }
        ],
        StepsList: [
          {
            Name: '监考总表',
            ID: 1,
            Url: 'TotalForm',
            Icon: 'icons-report-total'
          },
          {
            Name: '教师监考表',
            ID: 2,
            Url: 'TeacherForm',
            Icon: 'icons-report-teacher'
          },
          {
            Name: '考生信息表',
            ID: 3,
            Url: 'ExamInfoForm',
            Icon: 'icons-report-info'
          },
          {
            Name: '考场名单',
            ID: 4,
            Url: 'Roster',
            Icon: 'icons-report-list'
          },
          {
            Name: '座位签',
            ID: 5,
            Url: 'Seat',
            Icon: 'icons-report-move'
          },
          {
            Name: '桌面贴',
            ID: 6,
            Url: 'Desktop',
            Icon: 'icons-report-table'
          },
          {
            Name: '监考场次统计',
            ID: 7,
            Url: 'Count',
            Icon: 'icons-report-nums'
          }
        ],
        AddressList: [
          {
            ID: 1
          },
          {
            ID: 2
          },
          {
            ID: 3
          },
          {
            ID: 4
          },
          {
            ID: 5
          },
          {
            ID: 6
          },
          {
            ID: 7
          }
        ],
        vals: {
          Name: '监考总表',
          ID: 1,
          Icon: 'icons-report-total'
        },
        searchProgrList: [],
        ArrangeSupervisorExamID: 0,
        FixedSubjectType: ''
      }
    },
    created () {
      this.getFilterData()
    },
    mounted () {

    },
    methods: {
      // 切换查询表
      StepBtn (item, i) {
        this.vals = item
        this.sIndex = i
      },
      // 获取学年学期
      async getFilterData () {
        // this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/Comm/GetSessionNodeList`)
        // this.xy.unloading()
        if (res.success) {
          this.defaultList = [...this.defaultList, ...res.data]

          // 默认选取当前选中的学年和学期
          $.each(res.data, (item, index) => {
            $.each(item.children, (i, t) => {
              if (item.IsCurrent && t.IsCurrent) {
                this.searchDefaultValue[0] = item.value
                this.searchDefaultValue[1] = t.value
                this.GetArrangeSupervisorByStudent()
              }
            })
          })
          this.GetArrangeSupervisorByStudent()
        }
      },
      // 选择学年学期
      cascaderFunDefault (vals) {
        if (vals.length === 2) {
          this.searchDefaultValue = vals
          this.GetArrangeSupervisorByStudent()
        }
      },

      // 获取下拉方案名称
      async GetArrangeSupervisorByStudent () {
        // this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ArrangeSupervisorExam/GetArrangeSupervisorByManager`, {
          AcademicYearID: this.searchDefaultValue[0],
          AcademicSessionID: this.searchDefaultValue[1]
        })
        // this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            this.searchProgrList = res.data
            this.ArrangeSupervisorExamID = this.searchProgrList[0].ArrangeSupervisorExamID
            this.FixedSubjectType = this.searchProgrList[0].FixedSubjectType
            this.sIndex = 0
            this.$router.push({
              path: '/xyHome/ExamReport/TotalForm',
              query: this.$store.state.common.menuInfo
            })
            this.vals = {
              Name: '监考总表',
              ID: 1,
              Icon: 'icons-report-total'
            }
          } else {
            this.searchProgrList = []
            this.ArrangeSupervisorExamID = 0
            this.FixedSubjectType = 0
            this.sIndex = 0
            this.$router.push({
              path: '/xyHome/ExamReport/TotalForm',
              query: this.$store.state.common.menuInfo
            })
            this.vals = {
              Name: '监考总表',
              ID: 1,
              Icon: 'icons-report-total'
            }
          }
        } else {
          this.searchProgrList = []
          this.ArrangeSupervisorExamID = 0
          this.FixedSubjectType = 0
          this.sIndex = 0
          this.$router.push({
            path: '/xyHome/ExamReport/TotalForm',
            query: this.$store.state.common.menuInfo
          })
          this.vals = {
            Name: '监考总表',
            ID: 1,
            Icon: 'icons-report-total'
          }
        }
      },
      // 选择方案
      searchProgrammeChange (id) {
        this.ArrangeSupervisorExamID = id
        this.searchProgrList.forEach((item) => {
          if (this.ArrangeSupervisorExamID === item.ArrangeSupervisorExamID) {
            this.FixedSubjectType = item.FixedSubjectType
          }
        })
        this.AddressList.forEach((item, index) => {
          if (this.vals.ID === item.ID) {
            this.StepBtn(item, index)
          }
        })
      }
    }
  }
</script>

<style scoped lang='less'>
.xy-content-title {
  padding: 20px 20px 0;
}

.xy-content-body {
  margin: 20px;
  padding: 0;
  min-height: 538px;
}

.title-right>div {
  margin-right: 17px;
}

.title-right {
  display: flex;
  align-items: center;
  margin-bottom: 28px;
}

.steps-title-nav>div>div {
  cursor: pointer;
  padding: 0 12px;
  line-height: 40px;
  margin-right: 22px;
}

.steps-title-nav {
  display: flex;
  .steps-title-nav-name {
    color: rgba(0, 0, 0, .65);
  }
  .active {
    .steps-title-nav-name {
      color: #1890ff;
    }
    border-bottom: 2px solid #1890ff;
  }
}

.steps-title-select {
  display: flex;
  justify-content: space-around;
  align-items: center;
  span {
    display: inline-block;
    width: 100%;
  }
}

/*教师监考表*/
.t-form {
  margin-bottom: 40px;
  box-shadow: 0px 4px 8px 0px rgba(202, 202, 202, 0.3);
}

.t-form-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  height: 50px;
  background: rgba(247, 247, 247, 1);
  border-radius: 6px 6px 0px 0px;
  cursor: pointer;
}

.t-form-title i {
  color: #4196ff;
  font-size: 20px;
  margin-right: 10px;
}

.t-rotate.noactive {
  transform: rotate(-90deg);
}

.t-form-title span {
  font-size: 18px;
  color: #444;
  font-weight: bold;
}

.t-form-content {
  padding: 15px;
}

.t-form-list {
  display: flex;
  flex-wrap: wrap;
}

.t-form-list>li {
  width: 320px;
  height: 122px;
  padding: 10px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(120, 180, 253, 1);
  border-radius: 8px;
  margin-bottom: 20px;
  margin-right: 30px;
}

.t-form-list-subject-name {
  font-size: 16px;
  font-weight: bold;
  line-height: 30px;
}

.t-form-list-subject-nums {
  position: absolute;
  right: -10px;
  top: 0;
  width: 70px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  color: #4f9623;
  background: rgba(236, 250, 231, 1);
  border-radius: 15px 0px 0px 15px;
}

.t-form-list-subject-nums>b {
  font-size: 20px;
}

.t-form-list-time {
  margin-top: 18px;
}

.t-form-list-room {
  margin-top: 10px;
  display: flex;
}

.t-form-list-time>span:nth-child(1),
.t-form-list-room>span:nth-child(1) {
  color: #666;
}

/*考生信息表*/
.exam-info-form {
  display: flex;
  justify-content: space-between;
  min-height: 500px;
  margin-top: 10px;
}

.exam-info-form-left {
  width: 240px;
  flex-basis: 240px;
  background: rgba(65, 150, 255, 1);
  border-radius: 4px;
  color: #fff;
  overflow: auto;
}

.exam-info-form-left-parent {
  width: 240px;
  max-height: 800px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 10px;
}

.left_fiexd {
  width: 240px;
  position: fixed;
  top: 50px;
}

.exam-info-form-right {
  flex: 1;
  overflow: auto;
  padding-left: 20px;
}

.exam-info-form-class-all {
  margin-bottom: 20px;
  font-size: 16px;
  cursor: pointer;
}

.exam-info-form-class-list {
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

.exam-info-form-class-list.active {
  background: rgba(255, 255, 255, 0.1);
}

.ivu-table-border th {
  background-color: #f8f8f9 !important;
}
</style>
