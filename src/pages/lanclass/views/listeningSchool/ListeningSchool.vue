<template>
  <div>
    <div class="title">
      <div class="container">
        <span class="main">主讲学校：{{mainSchool===''?'暂无主讲学校':mainSchool}}</span>
        <span>
          听课学校：{{ListeningSchool===''?'暂无听课学校':ListeningSchool}}
        </span>
      </div>
    </div>
    <div class='xy-content-module'>
       <div class='xy-content-title flex-flow' style="text-align: right;">
          <Input suffix="ios-search" search v-model="seach" @on-search="onSearch" placeholder="请输入关键字" style="width:250px;" />
       </div>
      <div class='xy-content-body'>
        <XyAntTable
          :columns="columns"
          :dataSource="datatable"
          :nullData="nullData"
          :scrollx="'max-content'"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange">
          <div slot="oprateRender"  slot-scope="text, record">
            <a :disabled="record._disabled" @click="add(record)">添加</a>
            <a-divider type="vertical" />
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                更多
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item @click="look(record)">查看</a-menu-item>
                <a-menu-item @click="del(record)">删除</a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </XyAntTable>
      </div>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'ListeningSchool',
    components: {
      XyAntTable
    },
    data () {
      return {
        mainSchool: [],
        ListeningSchool: [],
        datatable: [],
        nullData: '该搜索条件下没有结果。',
        tableLoading: true,
        pageList: '', // 当前页数据条数
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
        seach: '',
        columns: [
          {
            title: '课程名称',
            dataIndex: 'SubjectName',
            width: 180
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
            dataIndex: 'oprateRender',
            width: 140,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ]
      }
    },
    created () {
      this.mainSchoolData()
      this.ListeningSchoolList()
      this.loadTable()
    },
    mounted () {},
    methods: {
      // 获取主讲学校
      mainSchoolData () {
        this.xy.get(`${this.xyApi}/ic/api/Teaching/GetAllTeaching`).then(res => {
          if (res.success) {
            this.mainSchool = res.data.map(val => {
              return val.TeachingSchoolAccountName
            }).join('、')
          }
        })
      },
      // 获取听课学校
      ListeningSchoolList () {
        this.xy.get(`${this.xyApi}/ic/api/Listening/GetAllListening`).then(res => {
          if (res.success) {
            this.ListeningSchool = res.data.map(val => {
              return val.ListeningSchoolAccountName
            }).join('、')
          }
        })
      },
      handleTableChange () {
        this.loadTable()
      },
      // 表格
      loadTable () {
        this.xy.get(`${this.xyApi}/ic/api/Listening/GetAllTeachingProgrammeByPage`, {
          pageindex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          seach: this.seach
        }).then(res => {
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
      // 关键字搜索
      onSearch () {
        this.pagination.current = 1
        this.loadTable()
      },
      add (row) {
        this.$store.commit('common/getThreeMenuName', `课程：${row.TeacherFullName} \xa0\xa0 上课时间 ${row.Time} \xa0\xa0上课年级 ${row.CoursePlanTableFullName} \xa0\xa0主讲教师 ${row.TeacherFullName}`)
        this.$store.commit('common/getParam', { row })
        this.$router.push({ path: '/xyhome/AddSchool', query: this.$store.state.common.menuInfo })
      },
      look (row) {
        this.$store.commit('common/getThreeMenuName', `课程：${row.TeacherFullName} \xa0\xa0 上课时间 ${row.Time} \xa0\xa0上课年级 ${row.CoursePlanTableFullName} \xa0\xa0主讲教师 ${row.TeacherFullName}`)
        this.$store.commit('common/getParam', { areaTeachingProgrammeID: row.AreaTeachingProgrammeID })
        this.$router.push({ path: '/xyhome/LookSchool', query: this.$store.state.common.menuInfo })
      },
      del (row) {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除这条记录吗？',
          onOk: () => {
            this.xy.post(`${this.xyApi}/ic/api/Listening/DeleteListeningprogramme`, {
              ids: [row.AreaTeachingProgrammeID]
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
<style lang='less' scoped>
.title{
  padding:12px 10px;
  font-size: 14px;
  color: rgba(0,0,0,0.65);
  .container{
    font-weight: 700;
    background: #fff;
    padding:18px 10px;
    .main{
      margin-right:20px;
    }
  }
}
</style>
