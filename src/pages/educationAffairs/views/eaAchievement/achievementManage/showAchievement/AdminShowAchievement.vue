<template>
<!-- 管理员 -->
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
        <div>
            <i-select v-model="schoolID"
                      @on-change="schoolChange"
                      class="fl xy-content-title-search"
                      style="width:150px;">
                <i-option :value="0" :key="0">选择校区</i-option>
                <i-option v-for="item in school" :value="item.SchoolDistrictID" :key="item.SchoolDistrictName" v-cloak>{{ item.SchoolDistrictName }}</i-option>
            </i-select>
            <i-select v-model="studentYearID"
                      @on-change="studentYearChange"
                      class="fl xy-content-title-search"
                      style="width:150px;">
                <i-option :value="0" :key="0">选择学届</i-option>
                <i-option v-for="item in studentYear" :value="item.StudentYearID" :key="item.StudentYearName" v-cloak>{{ item.StudentYearName }}</i-option>
            </i-select>
            <i-select v-model="studentGradeID"
                      @on-change="studentGradeChange"
                      class="fl xy-content-title-search"
                      style="width:150px;">
                <i-option :value="0" :key="0">选择学习阶段</i-option>
                <i-option v-for="item in studentGrade" :value="item.StudentGradeID" :key="item.StudentGradeName" v-cloak>{{ item.StudentGradeName }}</i-option>
            </i-select>
            <i-select v-model="studentOrganizationID"
                      class="fl xy-content-title-search"
                      style="width:150px;">
                <i-option :value="0" :key="0">选择班级</i-option>
                <i-option v-for="item in studentOrganization" :value="item.StudentOrganizationID" :key="item.StudentOrganizationName" v-cloak>{{ item.StudentOrganizationName }}</i-option>
            </i-select>
        </div>
        <div class="">
            <i-select v-model="disciplineID"
                      @on-change="typeValueSearch"
                      class="fl xy-content-title-search"
                      style="width:150px;">
                <i-option :value="0" :key="0">选择学科</i-option>
                <i-option v-for="item in Discipline" :value="item.DisciplineID" :key="item.DisciplineName" v-cloak>{{ item.DisciplineName }}</i-option>
            </i-select>

            <i-select v-model="achievementID"
                      class="fl xy-content-title-search"
                      style="width:150px;">
                <i-option :value="0" :key="0">选择模块</i-option>
                <i-option v-for="item in achievement" :value="item.AchievementID" :key="item.AchievementName" v-cloak>{{ item.AchievementName }}</i-option>
            </i-select>
        </div>
        <div class="fl xy-content-title-search">
            <i-button class="xy-primary" @click="show">查询</i-button>
        </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :isPage="false"
        :columns="columns"
        :dataSource="datatable"
        :nullData="txt"
        :tableLoading="tableLoading"
        :scrollx="'max-content'"
        >
        <div slot="key" slot-scope="text, record">
          {{record.key + 1}}
        </div>
        <div slot="StudentOrganizationName" slot-scope="text, record">
          <div style="min-width: 120px">
            {{record.StudentOrganizationName}}
          </div>
        </div>
        <div slot="UserName" slot-scope="text, record">
          <div style="min-width: 120px">
            {{record.UserName}}
          </div>
        </div>
        <div slot="StudentName" slot-scope="text, record">
          <div style="min-width: 120px">
            {{record.StudentName}}
          </div>
        </div>
        <div slot="AchievementName" slot-scope="text, record">
          <div style="min-width: 360px">
            {{record.AchievementName}}
          </div>
        </div>
      </XyAntTable>
    </div>
</div>

</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'adminShowAchievement',
    components: {
      XyAntTable
    },
    data () {
      return {
        txt: '该搜索条件下没有结果。',
        modal_loading: false,
        tableLoading: true,
        studentOrganizationID: 0,
        studentOrganization: [],
        achievementID: 0,
        achievement: [],
        studentID: 0,
        disciplineID: 0,
        Discipline: [],
        schoolID: 0,
        school: [],
        studentYearID: 0,
        studentYear: [],
        studentGradeID: 0,
        studentGrade: [],
        APIPath: this.$store.state.apiPath + '/api/Achievement',
        columns: [
          {
            title: '序号',
            dataIndex: 'key',
            width: 80,
            scopedSlots: { customRender: 'key' }
          },
          {
            title: '班级',
            dataIndex: 'StudentOrganizationName',
            scopedSlots: { customRender: 'StudentOrganizationName' }
          },
          {
            title: '用户名',
            dataIndex: 'UserName',
            scopedSlots: { customRender: 'UserName' }
          },
          {
            title: '姓名',
            dataIndex: 'StudentName',
            scopedSlots: { customRender: 'StudentName' }
          },
          {
            title: '模块',
            dataIndex: 'AchievementName',
            scopedSlots: { customRender: 'AchievementName' }
          },
          {
            title: '考试成绩',
            dataIndex: 'StudentScore',
            width: 160
          },
          {
            title: '学分',
            dataIndex: 'StudentCredit',
            width: 120
          }
        ],
        datatable: []
      }
    },
    created () {
      // 加载学科
      this.getAllDiscipline()
      this.getSchool()
    },
    mounted () {
      this.$nextTick(() => {
        this.loadTable()
      })
    },
    methods: {
      // 加载学科
      async getAllDiscipline () {
        let res = await this.xy.get(this.xyApi + '/base/api/Discipline/GetAllDiscipline', null)
        if (res.success) {
          this.Discipline = res.data
        }
      },
      // 加载校区
      async getSchool () {
        let res = await this.xy.get(this.xyApi + '/xy/comm/SchoolDistrictList', null)
        if (res.success) {
          this.school = res.data
        }
      },
      async loadTable () {
        this.tableLoading = true
        let res = await this.xy.get(this.APIPath + '/GetAllAchievementScore', {
          studentOrganizationID: this.studentOrganizationID,
          achievementID: this.achievementID,
          studentID: this.studentID
        })
        this.tableLoading = false
        if (res.success) {
          this.datatable = res.data
          this.datatable.map((item, index) => {
            this.$set(item, 'key', index)
          })
        }
      },
      show () {
        if (this.studentOrganizationID <= 0) {
          this.xy.msgError('请选择班级。')
          return
        }
        if (this.achievementID <= 0) {
          this.xy.msgError('请选择模块。')
          return
        }
        this.loadTable()
      },
      // 查询模块信息
      typeValueSearch () {
        this.achievementID = 0
        // 加载模块
        this.xy.get(this.APIPath + '/GetInfoByDisciplineID', { id: this.disciplineID }).then(res => {
          this.achievement = res.data
        })
      },
      // 查询学届
      schoolChange () {
        this.studentYearID = 0
        this.studentGradeID = 0
        this.studentOrganizationID = 0
        this.xy.get(this.xyApi + '/xy/comm/StudentYearList?schoolID=' + this.schoolID, null).then(res => {
          this.studentYear = res.data
        })
      },
      // 查询学习阶段
      studentYearChange () {
        this.studentGradeID = 0
        this.studentOrganizationID = 0
        this.xy.get(this.xyApi + '/xy/comm/StudentGradeList?schoolID=' + this.schoolID + '&studentYearID=' + this.studentYearID, null).then(res => {
          this.studentGrade = res.data
        })
      },
      // 查询班级信息
      studentGradeChange () {
        this.studentOrganizationID = 0
        this.xy.get(this.xyApi + '/base/api/StudentOrganization/GetStudentOrganization?schoolID=' + this.schoolID + '&studentYearID=' + this.studentYearID + '&studentGradeID=' + this.studentGradeID, null).then(res => {
          this.studentOrganization = res.data
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.attend-table {
    width: 100%;
    margin-bottom: 15px;
}

            .attend-table > thead > tr > th {
                height: 40px;
                white-space: nowrap;
                overflow: hidden;
                background-color: #f8f8f9;
                border-left: 1px solid #e8eaec;
                border-right: 1px solid #e8eaec;
            }

            .attend-table > tbody > tr > td {
                height: 48px;
                border: 1px solid #e8eaec;
                padding: 0 10px;
            }

                .attend-table > tbody > tr > td > span {
                    padding: 10px 10px;
                    text-align: center;
                    margin: 0 auto;
                    display: block;
                }

                    .attend-table > tbody > tr > td > span > .attend-cont {
                        display: block;
                        width: 260px;
                        padding: 10px 10px;
                        background: #eee;
                        color: #fff;
                        border-radius: 3px;
                        cursor: pointer;
                        color: #333;
                        text-align: center;
                        overflow: hidden;
                        transition: all 0.3s;
                        text-align: center;
                        margin: 0 auto;
                    }

                        .attend-table > tbody > tr > td > span > .attend-cont:hover {
                            transition: all 0.3s;
                            background: #ccc;
                        }

                        .attend-table > tbody > tr > td > span > .attend-cont > span {
                            display: block;
                        }

.examina-table {
    width: 100%;
    margin-bottom: 15px;
}

        .examina-table > thead > tr {
            color: #909399;
        }

            .examina-table > thead > tr > th {
                height: 40px;
                white-space: nowrap;
                padding: 0px 18px;
                overflow: hidden;
                border: 1px solid #e8eaec;
                text-align: left;
            }

            /*.examina-table > tbody > tr > td{

    border:1px solid #e8eaec;
}*/

            .examina-table > tbody > tr > td > .sort-room {
                display: block;
            }

            .examina-table > tbody > tr > td > .sort-address {
                display: block;
            }

            .examina-table > tbody > tr > td {
                min-width: 0;
                height: 48px;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                text-align: left;
                text-overflow: ellipsis;
                vertical-align: middle;
                border: 1px solid #e8eaec;
                padding: 0 18px;
            }

            .examina-table > tbody > tr > .examin-td {
                min-width: 0;
                height: 48px;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                text-align: left;
                text-overflow: ellipsis;
                vertical-align: middle;
                border: 1px solid #e8eaec;
            }

                .examina-table > tbody > tr > .examin-td > span {
                    display: block;
                    margin: 5px 0;
                }
                    .examina-table > tbody > tr > .examin-td > .own-teacher > span {
                        display: inline-block;
                        padding: 1px 7px;
                        background: #2196F3;
                        color: #fff;
                        border-radius: 3px;
                    }
.button-group{
    margin-right: 10px;
}
.button-group span{
    max-width:200px;
    display:block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

</style>
