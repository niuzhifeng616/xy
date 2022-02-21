<template>
  <!-- 成绩填报 -->
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div>
        <i-select v-model="schoolID" @on-change="schoolChange" class="fl" style="width:150px;">
          <i-option :value="0" :key="0">选择校区</i-option>
          <i-option
            v-for="item in school"
            :value="item.SchoolDistrictID"
            :key="item.SchoolDistrictName"
            v-cloak
          >{{ item.SchoolDistrictName }}</i-option>
        </i-select>
        <i-select
          v-model="studentYearID"
          @on-change="studentYearChange"
          class="fl xy-content-title-search"
          style="width:150px;"
        >
          <i-option :value="0" :key="0">选择学届</i-option>
          <i-option
            v-for="item in studentYear"
            :value="item.StudentYearID"
            :key="item.StudentYearName"
            v-cloak
          >{{ item.StudentYearName }}</i-option>
        </i-select>
        <i-select
          v-model="studentGradeID"
          @on-change="studentGradeChange"
          class="fl xy-content-title-search"
          style="width:150px;"
        >
          <i-option :value="0" :key="0">选择学习阶段</i-option>
          <i-option
            v-for="item in studentGrade"
            :value="item.StudentGradeID"
            :key="item.StudentGradeName"
            v-cloak
          >{{ item.StudentGradeName }}</i-option>
        </i-select>
        <i-select
          v-model="studentOrganizationID"
          class="fl xy-content-title-search"
          style="width:150px;"
        >
          <i-option :value="0" :key="0">选择班级</i-option>
          <i-option
            v-for="item in studentOrganization"
            :value="item.StudentOrganizationID"
            :key="item.StudentOrganizationName"
            v-cloak
          >{{ item.StudentOrganizationName }}</i-option>
        </i-select>
        <i-select
          v-model="disciplineID"
          @on-change="typeValueSearch"
          class="fl xy-content-title-search"
          style="width:150px;"
        >
          <i-option :value="0" :key="0">选择学科</i-option>
          <i-option
            v-for="item in Discipline"
            :value="item.DisciplineID"
            :key="item.DisciplineName"
            v-cloak
          >{{ item.DisciplineName }}</i-option>
        </i-select>
        <i-select v-model="achievementID" class="fl xy-content-title-search" style="width:150px;">
          <i-option :value="0" :key="0">选择模块</i-option>
          <i-option
            v-for="item in achievement"
            :value="item.AchievementID"
            :key="item.AchievementName"
            v-cloak
          >{{ item.AchievementName }}</i-option>
        </i-select>
      </div>
      <div class="fl xy-content-title-search">
        <i-button class="xy-primary" @click="show">查询</i-button>
      </div>
    </div>
    <div class="xy-content-body">
      <Alert show-icon closable>请从下拉框中选择学生和模块，然后点“查询” 按钮查询学生，可以进而对查询出的学生添加或者修改相应模块的成绩。</Alert>
      <div class="xy-content-table">
        <XyAntTable
          ref="selection"
          :columns="columns"
          :dataSource="datatable"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :isPage="false"
          :scrollx="'max-content'"
          >
          <div slot="key" slot-scope="text, record">
            {{record.key + 1}}
          </div>
          <div slot="StudentOrganizationName" slot-scope="text, record">
            <div style="min-width: 150px">
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
          <div slot="StudentScore" slot-scope="text, record">
            <div style="min-width: 100px">
              <InputNumber :max="200" v-model="record.StudentScore" :formatter=formatter />
            </div>
          </div>
        </XyAntTable>
        <div v-if="!isEmpty && !isInitial" style="margin-top: 24px" class="text-center">
          <i-button class="xy-btn-primary" shape="circle" @click="add">保存</i-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'achievementReport',
    components: {
      XyAntTable
    },
    data () {
      return {
        nullData: '该搜索条件下没有结果。',
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
            dataIndex: 'AchievementName'
          },
          {
            title: '考试成绩',
            dataIndex: 'StudentScore',
            scopedSlots: { customRender: 'StudentScore' }
          }
        ],
        tableLoading: true,
        modal_loading: false,
        loading: true,
        studentOrganizationID: 0,
        studentOrganization: [],
        achievementID: 0,
        isachievementID: 0,
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
        datatable: [], // table数据
        isEmpty: false, // 数据是否为空
        isInitial: true
      }
    },
    created () {
      // 渲染table数据
      this.getAllDiscipline()
      this.getSchool()

      let _data = {
        studentOrganizationID: this.studentOrganizationID,
        achievementID: this.achievementID,
        studentID: this.studentID
      }
      this.getTP(_data)
    },
    mounted () {
      this.$Message.config({
        top: 70,
        duration: 2
      })
    },
    methods: {
      formatter (VauleNumber, length = 1) {
        let newNumber = null

        if (!isNaN(VauleNumber)) {
          if (VauleNumber >= 0) {
            let reg = /.*\..*/

            if (reg.test(VauleNumber) && String(VauleNumber).split('.')[1].length > length) {
              newNumber = parseFloat(VauleNumber).toFixed(length)
            } else {
              newNumber = VauleNumber
            }
          }

          return newNumber
        }

        return 0
      },
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
      changeLoading () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      async getTP (data) {
        this.tableLoading = true
        let res = await this.xy.get(this.APIPath + `/GetAllAchievementScore?studentOrganizationID=${data.studentOrganizationID}&achievementID=${data.achievementID}&studentID=${data.studentID}`)
        this.tableLoading = false
        if (res.success) {
          this.isInitial = false
          if (res.data != null && res.data.length > 0) {
            this.datatable = res.data
            this.datatable.map((item, index) => {
              this.$set(item, 'key', index)
            })
            this.isEmpty = false
          } else {
            this.isEmpty = true
          };
        }
      },
      show () {
        if (this.studentOrganizationID <= 0) {
          this.changeLoading()
          this.xy.msgError('请选择班级。')
          return
        }

        if (this.achievementID <= 0) {
          this.changeLoading()
          this.xy.msgError('请选择模块。')
          return
        }

        // 模块ID
        this.isachievementID = this.achievementID

        let _data = {
          studentOrganizationID: this.studentOrganizationID,
          achievementID: this.achievementID,
          studentID: this.studentID
        }
        this.getTP(_data)
      },
      // 查询模块信息
      typeValueSearch () {
        this.achievementID = 0
        this.achievement = []
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
        this.studentYear = []
        this.xy.get(this.xyApi + '/xy/comm/FilterStudentYearList?schoolID=' + this.schoolID, null).then(res => {
          this.studentYear = res.data
        })
      },
      // 查询学习阶段
      studentYearChange () {
        this.studentGradeID = 0
        this.studentOrganizationID = 0
        this.studentGrade = []
        this.xy.get(this.xyApi + '/xy/comm/FilterStudentGradeList?schoolID=' + this.schoolID + '&studentYearID=' + this.studentYearID, null).then(res => {
          this.studentGrade = res.data
        })
      },
      // 查询班级信息
      studentGradeChange () {
        this.studentOrganizationID = 0
        this.studentOrganization = []
        this.xy.get(this.xyApi + '/base/api/StudentOrganization/GetStudentOrganization?schoolID=' + this.schoolID + '&studentYearID=' + this.studentYearID + '&studentGradeID=' + this.studentGradeID, null).then(res => {
          this.studentOrganization = res.data
        })
      },
      // 创建课程申请
      add () {
        if (this.studentOrganizationID <= 0) {
          this.xy.msgError('请选择班级。')
          return
        };
        if (this.achievementID <= 0) {
          this.xy.msgError('请选择模块。')
          return
        };
        let StudentOrganizationName = ''
        let Content = ''
        // 获取列表信息
        let selectDom = this.datatable
        for (let h = 0; h < selectDom.length; h++) {
          let attfrom = selectDom[h]
          StudentOrganizationName = attfrom.StudentOrganizationName
          Content += attfrom.StudentName + ',' + attfrom.StudentID + ',' + attfrom.UserName + ',' + (attfrom.StudentScore == null ? '' : attfrom.StudentScore)
          if (h < selectDom.length - 1) {
            Content += '|'
          };
        };

        if (Content.length <= 0) {
          this.changeLoading()
          this.xy.msgError('没有要保存的值。')
          return
        };

        this.xy.post(this.APIPath + '/CreateBatchScore', {
          Content: Content,
          StudentOrganizationID: this.studentOrganizationID,
          StudentOrganizationName: StudentOrganizationName,
          AchievementID: this.isachievementID// this.achievementID
        }).then(res => {
          if (res.success) {
            this.xy.msgSuc('保存成功。')
          } else {
            this.xy.msgError(res.msg)
          };
        })
      }
    }
  }
</script>
<style lang="less" scoped>
@import "../css/achievementReport.less";
</style>
