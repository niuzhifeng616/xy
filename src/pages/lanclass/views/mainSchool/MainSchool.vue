<!-- 互动课堂：主讲学校 -->
<template>
  <div class="xy-content-module">
    <div class="school-info col0-65">
      <span class="mr-20">主讲学校：{{schoolInfo===''?'暂无主讲学校':schoolInfo}}</span>
      <span>听课学校：{{listenSchoolInfo===''?'暂无听课学校':listenSchoolInfo}}</span>
    </div>
    <div class="xy-content-title flex-flow">
      <Button class="xy-primary" @click="create">添加课程</Button>
      <div class="title-right">
        <span class="col0-85">学年学期：</span>
        <cascader
          :data="yearSessionData"
          v-model="yearSession"
          :clearable="false"
          @on-change="cascaderChange"
          class="mr-15"
          style="width:200px"></cascader>
        <span class="col0-85">课程：</span>
        <Select
          v-model="subjectId"
          @on-change="subjectChange"
          class="mr-15"
          style="width:200px">
          <Option v-for="(item,index) in subjectData" :value="item.SubjectID" :key="index">{{item.SubjectName}}</Option>
        </Select>
        <a-input-search placeholder="请输入关键字" allowClear v-model.trim="searchText" @search='FromSubmit' style="width: 220px;" />
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :columns="columns"
        :dataSource="datatable"
        nullData="该搜索条件下没有结果。"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scrollx="'max-content'"
        >
        <div slot="SubjectNameRender" slot-scope="text,record">
          <span class="table-el-hover" @click="view(record)">
            {{record.SubjectName}}
          </span>
        </div>
        <span slot="operationRender" slot-scope="text, record"  style="width:120px" >
          <a @click="view(record)">查看</a>
          <a-divider type="vertical" />
          <a @click="delFun(record)">删除</a>
        </span>
      </XyAntTable>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'MainSchool',
    components: {
      XyAntTable
    },
    data () {
      return {
        schoolInfo: [],
        listenSchoolInfo: [],

        subjectId: 0,
        subjectData: [], // 课程
        yearSession: [],
        yearSessionData: [], // 学年学期
        searchText: '', // 搜索：课程、上课时间、上课教师、上课年级、互动周期

        tableLoading: true,
        pageList: '', // 当前页数据条数
        datatable: [], // table数据
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
        columns: [
          {
            title: '课程名称',
            dataIndex: 'SubjectName',
            width: 180,
            // fixed: 'left',
            scopedSlots: { customRender: 'SubjectNameRender' }
          },
          {
            title: '上课时间',
            dataIndex: 'Time',
            width: 280
          },
          {
            title: '上课教师',
            dataIndex: 'TeacherFullName',
            width: 150
          },
          {
            title: '上课年级',
            dataIndex: 'CoursePlanTableFullName',
            width: 200
          },
          {
            title: '互动周期',
            dataIndex: 'CycleName',
            width: 280
          },
          {
            title: '操作',
            dataIndex: 'operation',
            width: 120,
            scopedSlots: { customRender: 'operationRender' }
          }
        ]
      }
    },
    created () {
      this.getMainSchool()
      this.getListenSchool()
      this.getSubject()
      this.getSessionNodeList()
    },
    mounted () {
    },
    methods: {
      // 获取主讲学校信息
      async getMainSchool () {
        let res = await this.xy.get(`${this.xyApi}/ic/api/Teaching/GetAllTeaching`)
        if (res.success) {
          this.schoolInfo = res.data.map(val => {
            return val.TeachingSchoolAccountName
          }).join('、')
        }
      },
      // 获取听课学校信息
      async getListenSchool () {
        let res = await this.xy.get(`${this.xyApi}/ic/api/Listening/GetAllListening`)
        if (res.success) {
          this.listenSchoolInfo = res.data.map(val => {
            return val.ListeningSchoolAccountName
          }).join('、')
        }
      },
      // 课程
      getSubject () {
        this.xy.get(`${this.xyApi}/ic/api/Teaching/GetTeachingSubject`, {
          academicSessionID: this.yearSession[1]
        }).then(res => {
          if (res.success) {
            if (res.data) {
              this.subjectData = res.data
              this.subjectData.unshift({
                SubjectID: 0,
                SubjectName: '全部'
              })
              this.subjectId = this.subjectData[0].SubjectID
            }
          }
        })
      },
      subjectChange (value) {
        this.pagination.current = 1
        this.loadTable()
      },
      // 学年学期
      getSessionNodeList () {
        this.yearSessionData = [{
          'label': '所有学年',
          'value': 0,
          'children': [{
            'value': 0,
            'label': '所有学期',
            'children': []
          }]
        }]
        this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`).then(res => {
          if (res.success) {
            this.yearSessionData = this.yearSessionData.concat(res.data)
            var index = this.yearSessionData.map(function (item) {
              return item.IsCurrent
            }).indexOf(true)
            if (index !== -1) {
              this.yearSession.push(this.yearSessionData[index].value)
              var index1 = this.yearSessionData[index].children.map(function (item) {
                return item.IsCurrent
              }).indexOf(true)
              if (index1 !== -1) {
                this.yearSession.push(this.yearSessionData[index].children[index1].value)
              } else {
                this.yearSession = [0, 0]
              }
            } else {
              for (var i = 0; i < this.yearSessionData.length; i++) {
                if (this.yearSessionData[i].children.length > 0) {
                  this.yearSession = [this.yearSessionData[i].value, this.yearSessionData[i].children[0].value]
                  return false
                }
              }
            }
            this.loadTable()
          }
        })
      },
      cascaderChange (value) {
        this.pagination.current = 1
        this.yearSession = value
        this.loadTable()
      },
      // 获取table/分页数据
      loadTable () {
        this.tableLoading = true
        let obj = {
          pageindex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          academicSessionID: this.yearSession[1],
          subjectID: this.subjectId,
          seach: this.searchText
        }
        this.xy.get(`${this.xyApi}/ic/api/Teaching/GetAllTeachingProgrammeByPage`, obj).then(res => {
          if (res.success) {
            this.pagination.total = res.data.totalRecords
            this.datatable = res.data.data
            if (res.data.data !== null && res.data.data.length > 0) {
              this.pageList = res.data.data.length
            }
          }
          this.tableLoading = false
        })
      },
      handleTableChange () {
        this.loadTable()
      },
      FromSubmit () {
        this.pagination.current = 1
        this.loadTable()
      },
      // 添加课程
      create () {
        this.$store.commit('common/getThreeMenuName', '添加课程')
        this.$router.push({ path: '/xyhome/MainSchoolPublish', query: this.$store.state.common.menuInfo })
      },
      // 查看
      view (row) {
        this.$store.commit('common/getThreeMenuName', '查看详情')
        this.$store.commit('lanclass/changeMainSchoolObj', {
          teachingProgrammeID: row.TeachingProgrammeID,
          sessionId: this.yearSession[1]
        })
        this.$router.push({ path: '/xyhome/MainSchoolDetail', query: this.$store.state.common.menuInfo })
      },
      delFun (row) {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除这条记录吗？',
          onOk: () => {
            this.xy.post(`${this.xyApi}/ic/api/Teaching/DeleteTeachingProgramme`, {
              ids: [row.TeachingProgrammeID]
            }).then(res => {
              if (res.success) {
                this.xy.msgSuc('删除成功。')
                if (this.pageList > 1) {
                  this.pageList = this.pageList - 1
                } else {
                  if (this.pagination.current > 1) {
                    this.pagination.current = this.pagination.current - 1
                  }
                }
                this.loadTable()
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.flex-flow{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title-right {
  display: flex;
  align-items: center;
}
.school-info{
    height: 56px;
    line-height: 56px;
    font-weight: 700;
    padding: 0 0 0 10px;
    margin-bottom: 12px;
    background: #fff;
}
</style>
