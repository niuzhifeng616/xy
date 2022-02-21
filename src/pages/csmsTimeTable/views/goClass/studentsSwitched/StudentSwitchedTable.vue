<template>
  <!-- 10.学生调班 -->
  <div class="xy-content-body" id="StepsHeader">
    <div class="clearfix" style="margin-bottom:10px;">
        <div class="fl">
          <Alert show-icon style="padding: 8px 8px 8px 35px;">括号中数字指：“实际班额/最大班额”或“实际班额/最大班额/个人成绩/班平均分”。</Alert>
        </div>
        <div class="fr pr">
            <Button class="xy-primary" @click="showAverage" v-if="isShowAverageBtn">各班平均分</Button>
            <i-select v-model="crouseID"
                      @on-change="crouseChange"
                      class="xy-content-title-search"
                      style="width:150px">
                <i-option :value="0" :key="132232">所有课程</i-option>
                <i-option v-for="item in crouseData" :value="item.CoursePlanID" :key="item.label">{{ item.SubjectName }}</i-option>
            </i-select>
            <i-select v-model="classRoomID"
                      @on-change="classRoomChange"
                      class="xy-content-title-search"
                      style="width:150px">
                <i-option :value="0" key="1132">所有班级</i-option>
                <i-option v-for="item in classRoomData" :value="item.ClassID" :key="item.label">{{ item.ClassName }}</i-option>
            </i-select>
            <i-input search
                     clearable
                        v-model.trim="searchName"
                        @on-search="FromSubmit"
                        placeholder="请输入用户名/学籍号/姓名"
                        class="xy-content-title-search"
                        style="width: auto;">
                <icon type="ios-search cursor-p" slot="suffix" />
            </i-input>
        </div>
    </div>
    <div>
      <XyAntTable
          :columns="columns"
          :dataSource="dataTable"
          nullData="该搜索条件下没有结果。"
          :scrollx="'max-content'"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange">
          <!-- 头像 -->
          <div slot="IconRender" slot-scope="text, record">
            <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
              <span class="head-font">
                {{ xy.showName(record.FullName)}}
              </span>
            </div>
            <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
          </div>
          <!-- 姓名 -->
          <div slot="FullNameRender" slot-scope="text, record">
            <span class="table-el-hover" v-if="isOperation1 === 0" @click="adjustPage(record)">
              {{record.FullName}}
            </span>
            <span v-else>
              {{record.FullName}}
            </span>
          </div>
          <!-- 用户名 -->
          <div slot="UserNameRender" slot-scope="text, record" style="min-width:120px">
            <span>
              {{record.UserName}}
            </span>
          </div>
          <!-- 行政班 -->
          <div slot="StudentOrganizationNameRender" slot-scope="text, record" style="min-width:150px">
            <span>
              {{record.StudentOrganizationName}}
            </span>
          </div>
          <!-- 操作 -->
          <span slot="operaRender" slot-scope="text, record">
            <a @click="adjustPage(record)" :disabled="isOperation1 !== 0">调班</a>
          </span>
        </XyAntTable>
    </div>
    <!--各班平均分   v-if="this.isOperation1 === 0"-->
    <modal v-model="modalClassAverage"
            :transfer="false"
            :mask-closable="false">
        <p slot="header">各班平均分</p>
        <div>
          <i-table border
              :columns="averageColumns"
              :data="averageTable"
              :no-data-text="'该搜索条件下没有结果。'"></i-table>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="modalClassAverage = false">关闭</Button>
        </div>
    </modal>

</div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'

  export default {
    components: {
      XyAntTable
    },
    name: 'StudentSwitchedTable',
    data () {
      return {
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation,
        isOperation1: this.$store.state.csmstimetable.classComValKW.base.isOperation1,
        // coursePlanLevelID: 0,
        sloverResultCollectionID: 0,
        searchName: '',

        tableLoading: false,
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
        dataTable: [],
        columns: [],

        classIDs: '',
        isShowAverageBtn: false, // 是否显示平均分按钮
        // 下拉课程、班级
        crouseID: 0,
        crouseData: [],
        classRoomID: 0,
        classRoomData: [],
        // 各班平均分
        modalClassAverage: false,
        averageTable: [],
        averageColumns: []
      }
    },
    watch: {
      '$route': {
        handler (newVal) {
          console.log(newVal)
          // this.$store.commit('csmstimetable/changeLookGrade', {})
          // this.$store.commit('csmstimetable/changeStudentAdjust', {})
        },
        deep: true
      }
    },
    created () {
      // 从各班平均分返回
      if (this.$store.state.csmstimetable.lookGrade.length > 0) {
        let lookGrade = JSON.parse(this.$store.state.csmstimetable.lookGrade)
        this.searchName = lookGrade.name
        this.pagination.current = lookGrade.pageIndex
        this.pagination.pageSize = lookGrade.pageSize
      }
      // 从调整返回
      if (this.$store.state.csmstimetable.studentAdjust.length > 0) {
        let adjust = JSON.parse(this.$store.state.csmstimetable.studentAdjust).Adjust
        this.searchName = adjust.name
        this.pagination.current = adjust.pageIndex
        this.pagination.pageSize = adjust.pageSize
      }
      this.$store.commit('csmstimetable/changeLookGrade', '')
      this.$store.commit('csmstimetable/changeStudentAdjust', '')
    },
    mounted () {
      this.getTP()
      this.getCourse()
    },
    methods: {
      // 获取列表
      async getTP () {
        this.tableLoading = true
        let params = {
          classTableID: this.classTableID,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          coursePlanLevelID: this.crouseID,
          name: this.searchName,
          ClassIDs: this.classIDs
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassStudentChangeClass/GetCourseList`, params)
        if (res.success) {
          this.sloverResultCollectionID = res.data.SloverResultCollectionID
          this.pagination.total = res.data.TotalRecords
          this.dataTable = []
          this.columns = []
          this.columns = [
            {
              title: ' ',
              dataIndex: 'Icon',
              scopedSlots: { customRender: 'IconRender' },
              className: 'table-pic',
              width: 18,
              fixed: 'left'
            }, {
              title: '姓名',
              dataIndex: 'FullName',
              scopedSlots: { customRender: 'FullNameRender' },
              width: 150,
              fixed: 'left'
            }, {
              title: '用户名',
              dataIndex: 'UserName',
              scopedSlots: { customRender: 'UserNameRender' },
              fixed: 'left'
            }, {
              title: '行政班',
              dataIndex: 'StudentOrganizationName',
              scopedSlots: { customRender: 'StudentOrganizationNameRender' }
            }
          ]
          // 当排课下包含语数外、选考、学考，调班列表显示顺序为：语数外，选考、学考
          let arr = []
          for (let i = 0; i < res.data.Courses.length; i++) {
            let sort = 0
            if (res.data.Courses[i].SubjectType === 1) { // 学考
              sort = 2
            } else if (res.data.Courses[i].SubjectType === 2) { // 选考
              sort = 1
            }
            arr.push({
              title: res.data.Courses[i].SubjectName,
              dataIndex: 'Name' + i,
              // scopedSlots: { customRender: 'Name' + i },
              width: 160,
              sort: sort
            })
          }
          arr.sort((a, b) => {
            return a.sort - b.sort
          })
          this.columns.push(...arr)
          if (this.isOperation1 === 0) {
            this.columns.push({
              title: '操作',
              dataIndex: 'opera',
              scopedSlots: { customRender: 'operaRender' },
              width: 80,
              fixed: 'right'
            })
          }
          let resData = res.data.Result
          this.dataTable = res.data.Result
          for (let j = 0; j < resData.length; j++) {
            if (resData[j].Result.length > 0) {
              for (let k = 0; k < resData[j].Result.length; k++) {
                this.dataTable[j]['Name' + k] = resData[j].Result[k].Name
              }
            }
          }
          this.getAverage()// 各班平均分
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.getTP()
      },
      FromSubmit () {
        this.pagination.current = 1
        this.getTP()
      },
      // 调整
      adjustPage (row) {
        let obj = {
          Adjust: {
            sloverResultCollectionID: this.sloverResultCollectionID,
            studentID: row.StudentID,
            FullName: row.FullName,
            name: this.searchName,
            pageIndex: this.pagination.current,
            pageSize: this.pagination.pageSize
          }
        }

        this.$store.commit('csmstimetable/changeLookGrade', '')
        this.$store.commit('csmstimetable/changeStudentAdjust', JSON.stringify(obj))

        this.$store.commit('common/getParam', { pro: 'classTableOrder', step: 0 }) // 要返回的路由
        this.$router.push({
          path: 'studentSwitchedAdjust',
          query: this.$store.state.common.menuInfo
        })
      },
      // 各班平均分弹框展示
      showAverage () {
        let obj = {
          sloverResultCollectionID: this.sloverResultCollectionID,
          name: this.searchName,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize
        }

        this.$store.commit('csmstimetable/changeStudentAdjust', '')
        this.$store.commit('csmstimetable/changeLookGrade', JSON.stringify(obj))

        this.$store.commit('common/getParam', { pro: 'classTableOrder', step: 0 }) // 要返回的路由
        this.$router.push({
          path: 'lookGrade',
          query: this.$store.state.common.menuInfo
        })

        this.modalClassAverage = true
      },
      // 各班平均分
      async getAverage () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassStudentChangeClass/GetMovingClassStudentChangeClassForClassScore?classTableID=
          ${this.classTableID}&sloverResultCollectionID=${this.sloverResultCollectionID}`, null)
        if (res.success) {
          this.averageColumns = res.data.columnsResult
          this.averageTable = JSON.parse(res.data.Result)
          if (res.data.list.length > 0) {
            this.isShowAverageBtn = true
          } else {
            this.isShowAverageBtn = false
          }
        }
      },
      // 获取所有课程 + 所有教学班
      async getCourse () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassStudentChangeClass/GetCoursePlanLevelTypeLAndAByCourseplanID?classTableID=${this.classTableID}&courseplanID=${this.crouseID}`, null)
        if (res.success) {
          this.crouseData = res.data
        }
      },
      crouseChange () {
        this.classIDs = ''
        this.classRoomID = 0
        this.classRoomData = []
        if (this.crouseID !== 0) {
          let arr = this.crouseData.filter((item) => { return item.CoursePlanID === this.crouseID })
          this.classRoomData = arr[0].list
          if (this.classRoomData.length > 0) {
            for (let i = 0; i < this.classRoomData.length; i++) {
              this.classIDs += this.classRoomData[i].ClassID + ','
            }
          } else {
            this.classIDs = -1
          }
        }
        this.pagination.current = 1
        this.getTP()
      },
      classRoomChange () {
        this.classIDs = ''
        if (this.classRoomID === 0) {
          if (this.crouseID !== 0) {
            for (let i = 0; i < this.classRoomData.length; i++) {
              this.classIDs += this.classRoomData[i].ClassID + ','
            }
          }
        } else {
          this.classIDs = this.classRoomID
        }
        this.pagination.current = 1
        this.getTP()
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/studentsSwitched.less';
</style>
