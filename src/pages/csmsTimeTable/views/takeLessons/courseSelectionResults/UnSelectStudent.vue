<template>
  <!-- 12.选课结果-未选 -->
  <div id="selectResult">
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
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'TLcourseSeleResultUSS',
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
        // 按课程table
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
        subjectList: []
      }
    },
    created () {
    },
    mounted () {
      this.getTP()
    },
    methods: {
      async getTP () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SchoolBasedGrabStudentSelectCourse/GetStudentSelectCourse`, {
          classTableID: this.classTableID,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          isComplete: false,
          organizationIDs: this.studentOrganizationIDs,
          searchText: this.searchName
        })
        if (res.success) {
          this.$emit('unSelectStudentChange', res.data)
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
        this.getTP()
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

</style>
