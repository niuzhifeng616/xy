<template>
  <div class="xy-content-module">
    <div class="xy-content-title" style="padding-bottom:0px">
      <div class="xy-flex" style="display: flex;">
        <div class="mr-15">
          <span>校区：</span>
          <Select v-model="SchoolDistrictID" @on-change="getYearFilter" style="width:240px">
            <Option v-for="item in schoolData" :value="item.SchoolDistrictID" label :key="item.SchoolDistrictID">{{ item.SchoolDistrictName }}
            </Option>
          </Select>
        </div>
        <div class="mr-15">
          <span>方案：</span>
          <Select v-model="TeachingProjectID" @on-change="changTable(1)" style="width:300px">
            <Option v-for="item in yearData" :value="item.TeachingProjectID" :key="item.TeachingProjectID">{{ item.TeachingProjectName }}
            </Option>
          </Select>
        </div>
      </div>
      <div class="xy-title-btn0">
        <div class="xy-title-btn1">
            <span :class="{active:isActive===1}" @click="changTable(1)">按学生查看</span>
            <span :class="{active:isActive===2}" @click="changTable(2)">按教师查看</span>
        </div>
      </div>
    </div>
    <div class="xy-content-body" style="padding:0;">
      <div class="dividing-line"></div>
      <div class="xy-content-body-content xy-speed">
        <div class="xy-student-p">
          <div  class="xy-student-p-div"  v-if= "this.isActive === 1">
            <checkbox v-model="isNotice"  @on-change="handIncomplete()">查看未完成名单</checkbox>
            <span style="margin-left:20px">参与评教学生：{{stuProgressComplete}}人</span>
            <span style="margin-left:20px">未完成评教学生：{{stuProgressUnComplete}}人</span>
          </div>
          <div  class="xy-student-p-div"  v-if= "this.isActive === 2">
            <checkbox v-model="isNotice"  @on-change="handIncomplete()">查看未完成名单</checkbox>
            <span style="margin-left:20px">被评价教师：{{stuProgressComplete}}人</span>
            <span style="margin-left:20px">未完成被评教师：{{stuProgressUnComplete}}人</span>
          </div>
          <div class="xy-title-btn2">
            <i-input search v-model.trim="searchTxt" @on-search="FromSubmit" placeholder="请输入用户名/姓名"
              style="width: 200px;">
              <icon type="ios-search cursor-p" slot="suffix" />
            </i-input>
            <Button  @click="exportProgressTable" class="xy-primary" style="margin:0 0 0 12px;">导出</Button>
          </div>
        </div>
            <XyAntTable
              v-if= "this.isActive === 1"
              :columns="columns"
              :dataSource="tbData"
              :nullData="nullData"
              :tableLoading="tableLoading"
              :pagination="pagination"
              :scrollx="'max-content'"
              @change="handleTableChange"
              >
              <div slot="Icon" slot-scope="text, record">
                <div v-if="!record.Icon" :class="`head-con ${record.TeacherSex === 0 ? 'woman' : 'man'}`">
                  <span class="head-font">
                    {{ xy.showName(record.StudentFullName)}}
                  </span>
                </div>
                <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
              </div>
              <!--姓名 -->
              <div slot="StudentFullName" slot-scope="text, record" >
                  {{record.StudentFullName}}
              </div>
              <!-- 用户名 -->
              <div slot="StudentName" slot-scope="text, record" >
                  {{record.StudentName}}
              </div>
              <!-- 年级 -->
               <div slot="StudentGradeForStudentYearName" slot-scope="text, record" style="min-width:100px" >
                  {{record.StudentGradeForStudentYearName}}
              </div>
              <!-- 班级 -->
              <div slot="StudentOrganizationName" slot-scope="text, record" style="min-width:100px" >
                  {{record.StudentOrganizationName}}
              </div>
              <!-- 班主任 -->
              <div slot="TeacherFullName" slot-scope="text, record" >
                  {{record.TeacherFullName}}
              </div>
              <!-- 进度 -->
              <div slot="numberp" slot-scope="text, record" style="min-width:240px" >
                  <div>
                    <i-progress
                      :percent="record.Rate"
                      :hideInfo="true"
                      :strokeColor="record.Rate < 100 ? '#4196FF' : '#52C41A'"
                      style="display:inline-block;width:70%;margin-right:20px"
                      >
                    </i-progress>
                    <span v-if="!record.IsComplate">{{record.StatusFormat}}</span>
                    <img v-else src="@/assets/operationalAnalysis/true.png" >
                  </div>
              </div>
            </XyAntTable>
            <XyAntTable
              v-if= "this.isActive === 2"
              :columns="columns1"
              :dataSource="tbDataTea"
              :nullData="nullData"
              :tableLoading="tableLoading"
              :pagination="pagination1"
              :scrollx="'max-content'"
              @change="handleTableChange"
              >
              <div slot="Icon" slot-scope="text, record">
                <div v-if="!record.Icon" :class="`head-con ${record.TeacherSex === 0 ? 'woman' : 'man'}`">
                  <span class="head-font">
                    {{ xy.showName(record.TeacherFullName)}}
                  </span>
                </div>
                <img style="width:30px;height:30px;border-radius:50%" v-else :src="`${xyApi}/base` + record.Icon + '?' + Math.random() * 15">
              </div>
              <div slot="TeacherFullName"  slot-scope="text, record">
                  {{record.TeacherFullName}}
              </div>
               <!-- 用户名 -->
              <div slot="TeacherName"  slot-scope="text, record">
                  {{record.TeacherName}}
              </div>
              <!-- 年级 -->
               <div slot="StudentGradeForStudentYearName"  slot-scope="text, record" style="min-width:100px">
                  {{record.StudentGradeForStudentYearName}}
              </div>
              <!-- 班级 -->
              <div slot="ClassName"  slot-scope="text, record" style="min-width:100px">
                  {{record.ClassName}}
              </div>
              <!-- 角色组 -->
              <div slot="TeacherRoleFormat"  slot-scope="text, record">
                  {{record.TeacherRoleFormat}}
              </div>
              <!-- 进度 -->
              <div slot="numberp"  slot-scope="text, record" style="min-width:240px">
                  <div>
                    <i-progress
                      :percent="record.Rate"
                      :hideInfo="true"
                      :strokeColor="record.Rate < 100 ? '#4196FF' : '#52C41A'"
                      style="display:inline-block;width:70%;margin-right:20px"
                      >
                    </i-progress>
                    <span v-if="!record.IsComplate">{{record.ComplateFormat}}</span>
                    <img v-else src="@/assets/operationalAnalysis/true.png" >
                  </div>
              </div>
            </XyAntTable>
        </div>
    </div>
  </div>
</template>
<script>
// 引入表格
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'classTable',
    components: {
      XyAntTable
    },
    data () {
      return {
        tableUrl: '',
        tbData: [],
        tbDataTea: [],
        isActive: 1, // 点击切换
        datatable: [], // 学生
        datatable1: [], // 教师
        stuProgressComplete: null,
        stuProgressUnComplete: null,
        total: 0,
        pageSize: 15,
        pageCurrent: 1, // 学生
        pageCurrent1: 1, // 教师
        total1: 0,
        pageSize1: 15,
        status: -1, // -1===all
        studentGradeForStudentYearID: 0,
        TeachingProjectID: 0,
        searchTxt: '',
        SchoolDistrictID: 0,
        schoolData: [],
        yearData: [],
        loading: true,
        forTeacher: false, // 当按学生查看
        isNotice: false,
        colorful: [],
        nullData: '该搜索条件下没有结果。',
        tableLoading: true,
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
        pagination1: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination1.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination1.current = 1
            this.pagination1.pageSize = pageSize
          }
        },
        columns: [
          {
            title: ' ',
            width: 40,
            dataIndex: 'Icon',
            scopedSlots: { customRender: 'Icon' },
            className: 'table-pic'
          },
          {
            title: '姓名',
            dataIndex: 'StudentFullName',
            scopedSlots: { customRender: 'StudentFullName' },
            width: 180
            // minWidth: 80
          },
          {
            title: '用户名',
            dataIndex: 'StudentName',
            scopedSlots: { customRender: 'StudentName' },
            width: 180
          },
          {
            title: '年级',
            dataIndex: 'StudentGradeForStudentYearName',
            scopedSlots: { customRender: 'StudentGradeForStudentYearName' }
          },
          {
            title: '班级',
            dataIndex: 'StudentOrganizationName',
            scopedSlots: { customRender: 'StudentOrganizationName' }
          },
          {
            title: '班主任',
            dataIndex: 'TeacherFullName',
            scopedSlots: { customRender: 'TeacherFullName' },
            width: 200
            // minWidth: 80
          },
          {
            title: '进度',
            // minWidth: 220,
            dataIndex: 'numberp',
            scopedSlots: { customRender: 'numberp' }
          }
        ],
        columns1: [
          {
            title: '',
            width: 40,
            dataIndex: 'Icon',
            scopedSlots: { customRender: 'Icon' },
            className: 'table-pic'
          },
          {
            title: '教师姓名',
            dataIndex: 'TeacherFullName',
            scopedSlots: { customRender: 'TeacherFullName' },
            width: 180
          },
          {
            title: '用户名',
            dataIndex: 'TeacherName',
            scopedSlots: { customRender: 'TeacherName' },
            width: 180
          },
          {
            title: '年级',
            dataIndex: 'StudentGradeForStudentYearName',
            scopedSlots: { customRender: 'StudentGradeForStudentYearName' }
            // width: 160
          },
          {
            title: '班级',
            dataIndex: 'ClassName',
            scopedSlots: { customRender: 'ClassName' }
            // width: 170
          },
          {
            title: '角色组',
            dataIndex: 'TeacherRoleFormat',
            scopedSlots: { customRender: 'TeacherRoleFormat' }
          },
          {
            title: '进度',
            // minWidth: 220,
            dataIndex: 'numberp',
            scopedSlots: { customRender: 'numberp' }
            // width: 300
          }
        ]
      }
    },
    created () {
      this.getSchool()
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      // 学生/教师表格数据
      loadTable () {
        if (this.isActive === 1) {
          this.tableLoading = true
          let stuObj = {
            TeachingProjectID: this.TeachingProjectID,
            status: this.status,
            studentGradeForStudentYearID: this.studentGradeForStudentYearID,
            pageSize: this.pagination.pageSize,
            pageIndex: this.pagination.current,
            searchTxt: this.searchTxt
          }
          this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetProgressTableForStudent`, stuObj).then(res => {
            if (res.success) {
              this.total = res.data.totalRecords
              this.pagination.total = res.data.totalRecords
              this.tbData = res.data.data
              // this.pageList = res.data.data.length
            }
            this.tableLoading = false
          })
        } else if (this.isActive === 2) {
          this.tableLoading = true
          let teaObj = {
            TeachingProjectID: this.TeachingProjectID,
            status: this.status,
            studentGradeForStudentYearID: this.studentGradeForStudentYearID,
            pageSize: this.pagination1.pageSize,
            pageIndex: this.pagination1.current,
            searchTxt: this.searchTxt,
            teacherRoleType: 0 // 0===all
          }
          this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetProgressTableForTeacher`, teaObj).then(res => {
            if (res.success) {
              console.log(res.data.data)
              this.total1 = res.data.totalRecords
              this.pagination1.total = res.data.totalRecords
              this.tbDataTea = res.data.data
              // this.pageList = res.data.data.length
            }
            this.tableLoading = false
          })
        }
      },
      // 导出
      exportProgressTable () {
        if (this.status === undefined) {
          this.status = -1
        }
        if (this.isActive === 1) {
          let obj = {
            TeachingProjectID: this.TeachingProjectID,
            status: this.status,
            studentGradeForStudentYearID: this.studentGradeForStudentYearID,
            searchTxt: this.searchTxt
          }
          this.xy.downFile(`${this.$store.state.apiPath}/api/StudentTeachingReport/ExportProgressTableForStudent`, obj)
        } else if (this.isActive === 2) {
          let obj = {
            TeachingProjectID: this.TeachingProjectID,
            teacherRoleType: 0,
            status: this.status,
            studentGradeForStudentYearID: this.studentGradeForStudentYearID,
            searchTxt: this.searchTxt
          }
          this.xy.downFile(`${this.$store.state.apiPath}/api/StudentTeachingReport/ExportProgressTableForTeacher`, obj)
        }
      },
      // 统计数字
      async getProgress () {
        // this.xy.loading()
        if (this.isActive === 1) {
          this.forTeacher = false
        } else if (this.isActive === 2) {
          this.forTeacher = true
        }
        let obj = {
          TeachingProjectID: this.TeachingProjectID,
          forTeacher: this.forTeacher
        }
        this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetProgress`, obj).then(res => {
          // this.xy.unloading()
          if (res.success) {
            this.stuProgressComplete = res.data.Total
            this.stuProgressUnComplete = res.data.UnComplete
          } else {
            this.xy.msgError(res.msg)
          }
        })
      },
      // 获取校区
      async getSchool () {
        // this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetSchoolDistrictByRole?pageType=4`)
        // this.xy.unloading()
        if (res.success) {
          this.schoolData = res.data
          // 默认筛选第一个校区
          if (this.schoolData.length > 0) {
            this.SchoolDistrictID = this.schoolData[0].SchoolDistrictID
          } else {
            // this.xy.unloading()
            return
          }
          this.getYearFilter()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 方案名称
      async getYearFilter (val) {
        // this.xy.loading()
        let params = {
          SchoolDistrictID: this.SchoolDistrictID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetProjects`, params)
        // this.xy.unloading()
        if (res.success) {
          this.yearData = res.data
          // 默认筛选第一个item
          if (this.yearData.length === 0) {
            this.xy.msgError('该搜索条件下没有结果。')
          } else {
            this.TeachingProjectID = this.yearData[0].TeachingProjectID
            this.changTable(1)
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 切换方案 切换角色
      changTable (flag) {
        this.isActive = flag
        this.searchTxt = ''
        this.isNotice = false
        // this.pageCurrent = 1
        // this.pageCurrent1 = 1
        this.pagination.current = 1
        this.pagination1.current = 1
        this.pageSize = 15
        this.pageSize1 = 15
        this.status = -1
        this.getProgress()
        this.loadTable()
      },
      // 搜索
      FromSubmit () {
        // this.pageCurrent = 1
        // this.pageCurrent1 = 1
        this.pagination.current = 1
        this.pagination1.current = 1
        this.pageSize = 15
        this.pageSize1 = 15
        this.loadTable()
      },
      // 选择完成/未完成
      handIncomplete () {
        // this.pageCurrent = 1
        // this.pageCurrent1 = 1
        this.pagination.current = 1
        this.pagination1.current = 1
        this.pageSize = 15
        this.pageSize1 = 15
        if (this.isNotice) {
          this.status = 0
          this.loadTable()
        } else {
          this.status = -1
          this.loadTable()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-title-btn0{
  display: flex;
  justify-content: space-between;
  .xy-title-btn1{
    margin-top: 8px;
    span{
      font-size: 14px;
      margin-right: 30px;
      display: inline-block;
      width: 90px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      cursor: pointer;
    }
    .active{
      color: #4196FF;
      background: #ffffff;
      border-bottom:2px solid #4196FF
    }
  }
}
.xy-content-body{
  .dividing-line{
    width:100%;
    height:20px;
    background:#f9f9f9;
    position:relative
  }
  .xy-student-p{
    color: #666;
    margin: 16px 20px 20px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.ivu-progress-text-inner{
  position: absolute;
  margin-left: -55px;
}
.ivu-progress-inner{
  background-color: #b9e5ff;
  border-radius: 20px;
}
</style>
