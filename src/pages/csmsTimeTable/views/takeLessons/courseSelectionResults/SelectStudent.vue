<template>
  <!-- 12.选课结果-已选 -->
<div id="selectResult">
    <div v-if="radioVal === '1'">
      <XyAntTable
        :columns="columns"
        :dataSource="datatable"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        :isScrollx="true"
        :scrollx="'max-content'"
        @change="handleTableChange">
        <div slot="Icon" slot-scope="text, record">
            <div v-if="!record.Icon" :class="`head-con ${record.Sex === '女' ? 'woman' : 'man'}`"> <!--Sex接口需统一 女0-->
              <span class="head-font">
                {{ xy.showName(record.FullName)}}
              </span>
            </div>
            <img v-else style="width:30px;height:30px;border-radius:50%" :src="record.Icon + '?' + Math.random() * 15">
          </div>
          <div slot="FullName" slot-scope="text, record" style="min-width:150px">
            <div>
              {{record.FullName}}
            </div>
          </div>
          <div slot="UserName" slot-scope="text, record" style="min-width:120px">
            {{record.UserName}}
          </div>
          <div slot="ClassName" slot-scope="text, record" style="min-width:150px">
            {{record.ClassName}}
          </div>
          <template v-for='(item,index) in subjectList'>
            <div :slot="'AmPmName' + index" slot-scope="text, record" :key='index'>
              <div>{{record['AmPmName' + index]}}</div>
            </div>
          </template>
        <div slot="operation"
            slot-scope="text, record">
          <a @click="adjust(record)" >调整</a>
        </div>
      </XyAntTable>
    </div>
    <div v-else>
        <div style="margin-bottom:20px;" v-for="(tableData, index) in dataTableCourse" :key="index">
            <div class="table-header">
                <h1 class="title" >{{tableData.ClassName}}</h1>
                <div>
                    <span v-if="tableData.StudentCount !== ''">学生：{{tableData.StudentCount}}</span>
                    <span v-if="tableData.TeacherNames !== ''">教师：{{tableData.TeacherNames}}</span>
                    <span v-if="tableData.AmPmNames !== ''">上课时间：{{tableData.AmPmNames}}</span>
                    <span v-if="tableData.HouseNames !== ''">上课教室：{{tableData.HouseNames}}</span>
                </div>
            </div>
            <div class="table-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th>课程</th>
                            <th>用户名</th>
                            <th>姓名</th>
                            <th>性别</th>
                            <th>行政班</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(course, n) in tableData.list" :key="n">
                            <td >{{tableData.SubjectName}}</td>
                            <td >{{course.UserName}}</td>
                            <td >{{course.FullName}}</td>
                            <td >{{course.Sex}}</td>
                            <td >{{course.StudentOrganizationFullName}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!--初始loading-->
        <div v-if="isInitial" class="no-data-box isInitital-opacity">
          <!-- <img style="width: 100%;" :src="require('@/assets/common/loading.png')" alt="" /> -->
        </div>
        <!--暂无数据-->
        <div v-if="dataTableCourse.length === 0 && !isInitial" class="no-data-box">
            <img  class="no-data-img" :src="require('@/assets/common/nullData.svg')" alt="" />
            <span class="no-data-text">
                该搜索条件下没有结果。
            </span>
        </div>
    </div>
</div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'TLcourseSeleResultSS',
    components: {
      XyAntTable
    },
    props: {
      isOperation: {
        type: Number,
        default: 0
      },
      classTableID: {
        type: Number,
        default: 0
      },
      radioVal: {
        type: String,
        default: ''
      },
      searchName: {
        type: String,
        default: ''
      },
      selectNum: {
        type: Number,
        default: 0
      },
      loadAdjust: {
        type: String,
        default: ''
      },
      studentOrganizationIDs: {
        type: String,
        default: ''
      },
      groupOrSimple: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {

        // 已选学生
        // antTable
        loadingTable: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        pageList: '', // 当前页数据条数
        datatable: [],
        columns: [],
        subjectList: [],

        // 已选课程
        isInitial: false,

        totalCrouse: 0,
        pageCurrentCourse: 1, // 当前页码
        pageSizeCourse: 15, // 每页显示条数
        pagesCourse: [15, 30, 50, 100], // 默认每页可选10/20/50/100条
        dataTableCourse: [],
        columnsCourse: []
      }
    },
    created () {
      // 2020.2.26
      // if (this.loadAdjust !== '') {
      //   if (xy.param.getValues('pageCurrent') !== undefined && xy.param.getValues('pageCurrent') !== 1) {
      //     if (Math.ceil((xy.param.getValues('total') - 1) / this.pageSize) >= xy.param.getValues('pageCurrent')) {
      //       this.pageCurrent = xy.param.getValues('pageCurrent')
      //     } else {
      //       this.pageCurrent = xy.param.getValues('pageCurrent') - 1
      //     }
      //   };
      // };
    },
    mounted () {
      this.getStudent()
    },
    methods: {
      // 获取选课结果（学生）
      async getStudent () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SchoolBasedGrabStudentSelectCourse/GetStudentSelectCourse`, {
          classTableID: this.classTableID,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          isComplete: true,
          organizationIDs: this.studentOrganizationIDs,
          searchText: this.searchName
        })
        if (res.success) {
          this.$emit('selectStudentChange', res.data)
          this.datatable = []
          this.columns = []
          this.columns = [
            {
              title: ' ',
              width: 32,
              dataIndex: 'Icon',
              className: 'set-head-icon',
              scopedSlots: { customRender: 'Icon' },
              fixed: 'left'
            },
            {
              title: '姓名',
              dataIndex: 'FullName',
              scopedSlots: { customRender: 'FullName' },
              fixed: 'left'
            },
            {
              title: '用户名',
              dataIndex: 'UserName',
              scopedSlots: { customRender: 'UserName' },
              fixed: 'left'
            },
            {
              title: '性别',
              dataIndex: 'Sex',
              width: 80
            },
            {
              title: '班级',
              dataIndex: 'ClassName',
              scopedSlots: { customRender: 'ClassName' }
            }
          ]
          for (let i = 0; i < res.data.AmPmList.length; i++) {
            this.columns.push({
              title: res.data.AmPmList[i].AmPmName,
              dataIndex: 'AmPmName' + i,
              scopedSlots: { customRender: 'AmPmName' + i },
              width: 170
            })
          }
          if (!res.data.IsSelectCoursePeriod && this.isOperation === 0) {
            this.columns.push({
              title: '操作',
              dataIndex: 'operation',
              width: 80,
              scopedSlots: { customRender: 'operation' },
              fixed: 'right'
            })
          }
          this.datatable = res.data.Results
          for (let i = 0; i < res.data.Results.length; i++) {
            this.subjectList = res.data.Results[i].Subjects
            for (let j = 0; j < this.subjectList.length; j++) {
              this.datatable[i]['AmPmName' + j] = this.subjectList[j].SubjectName
            }
          }
          if (this.datatable.length > 0) { // 有数据再获取班级信息
            this.$parent.getClass()
          }
          this.pagination.total = res.data.TotalRecords
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.getStudent()
      },
      // 获取选课结果（课程）
      async getCourse () {
        this.isInitial = true
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SchoolBasedGrabStudentSelectCourse/GetStudentSelectCourseByCourse`, {
          searchText: this.searchName,
          classTableID: this.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.dataTableCourse = res.data
          this.isInitial = false
        }
      },
      // 单击页码触发
      changePage (current) {
        if (this.radioVal === '1') {
          this.pagination.current = current
          this.getStudent()
        } else {
          this.pageCurrentCourse = current
          this.getStudent()
        }
      },
      // 单击切换每页展示条数触发
      changePageSize (size) {
        if (this.radioVal === '1') {
          this.pagination.current = 1
          this.pagination.pageSize = size
          this.getStudent()
        } else {
          this.pageCurrentCourse = 1
          this.pageSizeCourse = size
          this.getStudent()
        }
      },
      // 调整
      adjust (row) {
        var routerUrl = ''
        if (this.groupOrSimple) {
          routerUrl = '/xyhome/onlineChooseCourseTLessonG'
        } else {
          routerUrl = '/xyhome/onlineChooseCourseTLesson'
        }
        this.$store.commit('csmstimetable/setTakeLessonsGoSelectResult', {
          classTableID: this.classTableID,
          loadAdjust: JSON.stringify({
            collectionID: row.CollectionID,
            studentID: row.StudentID,
            searchName: this.searchName,
            selectNum: this.selectNum,
            studentOrganizationIDs: this.studentOrganizationIDs,
            radioVal: this.radioVal,
            groupOrSimple: this.groupOrSimple
          })
        })
        this.$store.commit('common/getThreeMenuName', '')
        this.$router.push({ path: routerUrl, query: this.$store.state.common.menuInfo })
      }
    }
  }
</script>
<style lang="less" scoped>
.isSelect-active {
    background: #4285f4;
    color: white!important;
}
.table-header .title{
    // font-weight:bold;
    font-size:16px;
    border-left:4px solid #AF85FE;
    background:rgba(175, 133, 254,0.1);
    color: #AF85FE;
    padding:8px 10px;
    display:inline-block;
    margin-bottom:10px;
}
.table-header span{
    margin-right:15px;
}
.table-body .table{
    border: 1px solid #EBF0F6;
    text-align: center;
    cursor: pointer;
    margin: 0 auto;
    border-collapse: collapse;
    font-size: 14px;
    width:100%;
    margin-top:10px;
    color:rgba(113,129,151,1);
    border-radius:8px;

}
.table-body .table tr {
    width: 100%;
    height: 40px;
    text-align: center;
}
.table-body .table tr th {
    height: 40px;
    /*border: 1px solid #ddd;*/
    text-align: center;
    font-weight:bold;
    background:#EBF0F6;
}
.table-body .table tr td {
    height: 40px;
    border-top:1px solid #D8E0EB;
    border-bottom:1px solid #D8E0EB;
    border-right:1px solid #D8E0EB;
    text-align: center;
    position: relative;
    color:#718197;
    min-width:110px;
}
.table-body .table .downUp:hover{
    color:#2b85e4;
}
.table-body .table .i-active{
    color:#2b85e4;
}
</style>
