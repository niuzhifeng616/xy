<!-- 汇总统计 -->
<template>
  <div class="xy-content-module">
    <!-- 顶部搜索框 -->
    <div class="xy-content-title summary">
      <div class="title-right">
        <span class="col0-85">校区：</span>
        <div>
          <Select
            v-model="schoolDistrictId"
            @on-change="schoolChange"
            class="mr-15"
            placeholder="校区"
            style="width:200px"
            >
            <Option v-for="(item,index) in schoolData" :value="item.SchoolDistrictID" :key="index">{{item.SchoolDistrictName}}</Option>
          </Select>
        </div>
        <span class="col0-85">方案：</span>
        <Select
          v-model="teachingProjectId"
          @on-change="teachingPChange"
          class="mr-15"
          placeholder="校区"
          style="width:260px"
          >
          <Option v-for="(item,index) in teachingProjectData" :value="item.TeachingProjectID" :key="index">{{item.TeachingProjectName}}</Option>
        </Select>
      </div>
      <!-- 切换 -->
      <div class="xy-title-btn">
        <div class="xy-title-btn1">
            <span :class="{active:isActive===1}" @click="onActive(1)">方案整体情况</span>
            <span :class="{active:isActive===2}" @click="onActive(2)">教师统计情况</span>
        </div>
        <div>
            <Dropdown @on-click="exportModal" trigger="click" v-if="isActive===1">
                <Button type="primary">
                    导出
                    <Icon type="ios-arrow-down"></Icon>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem :name="0">导出当前题目</DropdownItem>
                    <DropdownItem :name="1">导出全部题目</DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Button class="xy-primary" v-if="isActive===2" @click="Teacherexport">导出</Button>
        </div>
      </div>
    </div>
    <!-- main -->
    <div class="xy-content-body summary">
      <!-- 方案整体情况 -->
      <div class="xy-bigBox" v-show="this.isActive === 1">
        <EvaPlan ref="plan" :SchoolDistrictID="schoolDistrictId" @rankFun='rankChangePlan'></EvaPlan>
      </div>
      <!-- 教师统计情况 -->
      <div class="xy-bigBox" v-show="this.isActive === 2">
        <EvaTeacher ref='teacher' :SchoolDistrictID="schoolDistrictId" @rankFun='rankChangeTea'></EvaTeacher>
      </div>
    </div>
  </div>
</template>

<script>
  import EvaPlan from '@/pages/evaluate/views/studentOfTeacher/summary/components/EvaOverallplan.vue'
  import EvaTeacher from '@/pages/evaluate/views/studentOfTeacher/summary/components/EvaTeacherstatistics.vue'
  export default {
    name: 'evaSummary',
    components: {
      EvaPlan,
      EvaTeacher
    },
    inject: ['reload'],
    data () {
      return {
        schoolData: [], // 校区list
        schoolDistrictId: 0,
        teachingProjectData: [], // 方案list
        teachingProjectId: 0,
        dataList: [], // 问卷list(当前校区方案下)

        isActive: 1, // 点击切换
        newRank: true, // 方案
        type: 'asc',
        newRank2: true, // 教师
        Stype: 'asc',
        Gtype: 'normal'
      }
    },
    computed: {},
    created () {
      this.$store.commit('common/getThreeMenuName', '')
      this.getSchool()
    },
    mounted () {
    },
    methods: {
      // 获取校区
      async getSchool () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetSchoolDistrictByRole`, {
          pageType: 3
        })
        this.xy.unloading()
        if (res.success) {
          this.schoolData = res.data
          if (this.schoolData.length !== 0) {
            this.schoolDistrictId = this.schoolData[0].SchoolDistrictID
            this.schoolChange()
          }
        }
      },
      schoolChange () {
        this.getSessionNodeList()
      },
      // 根据校区获取方案列表
      async getSessionNodeList () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetProjects`, {
          schoolDistrictID: this.schoolDistrictId,
          publishStatus: 1
        })
        if (res.success) {
          this.teachingProjectData = res.data
          if (res.data.length > 0) {
            this.teachingProjectId = res.data[0].TeachingProjectID
            this.getQuestionnaires()
          }
        }
      },
      teachingPChange () {
        this.getQuestionnaires()
      },
      // 获取问卷列表
      async getQuestionnaires () {
        if (this.teachingProjectId !== 0) {
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetQuestionnaires`, {
            teachingProjectID: this.teachingProjectId
          })
          if (res.success) {
            if (res.data.length > 0) {
              this.dataList = res.data
              // 加载第一个问卷
              if (this.isActive === 1) {
                this.$refs.plan.changeindex(0)
              } else {
                this.$refs.teacher.changeindex(0)
              }
            }
          }
        }
      },
      // 方案整体情况导出
      exportModal (val) {
        if (this.$refs.plan.questionType === 4 && val === 0) {
          this.xy.msgError('暂不支持导出问答题目。')
          return false
        }
        this.xy.downFile(`${this.$store.state.apiPath}/api/StudentTeachingReport/ExportSummaryTableForProject`, {
          questionID: val === 1 ? 0 : this.$refs.plan.questionID,
          questionnaireID: this.$refs.plan.questionnaireId,
          isRankAsc: this.type === 'asc' // 是否正序 (组件asc正序、desc倒叙)
        })
      },
      // 教师统计情况导出
      Teacherexport () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/StudentTeachingReport/ExportSummaryTableForTeacher`, {
          questionnaireID: this.$refs.teacher.questionnaireId,
          disciplineIDOrClassID: this.$refs.teacher.disciplineID,
          sortField: this.$refs.teacher.sortField, // SchoolRank:按学校、GroupRank：按班级或者年级
          isRankAsc: this.$refs.teacher.sortField === 'SchoolRank' ? this.Stype === 'asc' : this.Gtype === 'asc' // 是否正序
        })
      },
      // 表格切换
      onActive (flag) {
        this.isActive = flag
        this.searchTxt = ''
        this.getQuestionnaires()
      },
      // 排序
      rankChangePlan (newRank, newOrder) {
        this.newRank = newRank
        this.type = newOrder
      },
      rankChangeTea (newRank, schoolOrder, groupOrder) {
        this.newRank2 = newRank
        this.Stype = schoolOrder
        this.Gtype = groupOrder
      }
    }

  }
</script>
<style lang='less'>
.xy-content-title.summary{
  padding: 10px 10px 0;
}
.programme{
  padding-bottom: 20px;
}

.xy-content-box{
  margin-top: 20px;
  .title-title{
    color: rgba(0, 0, 0, .85);
    font-weight: bold;
    color: #000;
    line-height: 15px;
    margin-bottom: 20px;
  }
}
.xy-content-body.summary{
  padding: 0px 20px 20px;
}
.flex-flow{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title-right {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.xy-title-btn{
    display: flex;
    justify-content: space-between;
    .xy-title-btn1{
      color: rgba(0, 0, 0, .65);
      span{
        display: inline-block;
        height: 40px;
        line-height: 30px;
        margin-right: 55px;
        cursor: pointer;
      }
      .active{
        color: #4196FF;
        border-bottom: 2px solid #4196FF;
      }
    }
  }
.xy-content-body{
  .xy-bigBox{
    .name-box{
      border-bottom: 1px dashed #E8E8E8;
      padding: 20px 70px 5px 0;
      display: flex;
      ul{
        width: calc(100% - 80px);
      }
      .name-box-teacher{
        display: flex;
      }
      .cell-left{
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        margin-right: 10px;
      }
    }
    .choice-box{
      display: flex;
      flex-direction: row;
      padding-top: 25px;
      padding-right: 72px;
      .cell-left{
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        margin-right: 10px;
      }
    }
    .class-strategy {
      display:inline-block;
      cursor: pointer;
      height: 24px;
      line-height: 24px;
      padding: 0 10px;
      margin: 0 10px 15px 0;
      color: rgba(0, 0, 0, 1);
    }
    .class-strategy.ques{
      height: 22px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.85);
    }
    .active {
      background: #1890ff;
      border-radius: 4px;
      color: #fff !important;
      opacity: 1 !important;
    }
    .summary-subobject{
        display:flex;
        font-weight: bold;
        color: rgba(0, 0, 0, .85);
        padding: 20px 0 20px;
        >div{
          margin-right: 30px;
        }
    }
  }
}

.bgColor{
  width: calc(100% + 40px);
  height: 20px;
  background: rgb(249, 249, 249);
  position: relative;
  left: -20px;
}
#none{
  width: calc(100% + 40px);
  min-height: 580px;
  background: rgb(249, 249, 249);
  position: relative;
  left: -20px;
}

.summary .ivu-table-wrapper-with-border{
  border: none;
}
.summary .ivu-table-border th,
.summary .ivu-table-border td{
  border-right: 1px dashed #E8E8E8;
}
.summary .ivu-table-border th:last-child,
.summary .ivu-table-border td:last-child,
.summary .ivu-table-border th.set-head-icon,
.summary .ivu-table-border td.set-head-icon{
  border-right: none;
}
</style>
