// 音体美成绩管理-音体美考试管理
<template>
  <div class="xy-content-module">
      <!-- 面包屑 -->
      <div class="xy-content-title clearfix">
        <div class="fl">
          <Button class="xy-primary" @click="create">创建考试</Button>
        </div>
        <div class="fr pr">
          <i-col class="fl xy-content-title-search">
              <Select v-model="schoolDistrictID" style="width: 150px;" @on-change="reLoadTable" placeholder="全部校区">
                <Option :value="0">
                  全部校区
                </Option>
                <Option :value="item.SchoolDistrictID" v-for="(item, index) in schoolDistrict" :key="index">
                  {{item.SchoolDistrictName}}
                </Option>
              </Select>
            </i-col>
            <i-col class="fl xy-content-title-search">
              <Select v-model="typeID" style="width: 150px;" @on-change="reLoadTable" placeholder="全部学年">
                <Option :value="0">
                  全部学年
                </Option>
                <Option :value="item.ID" v-for="(item, index) in typeList" :key="index">
                  {{item.Name}}
                </Option>
              </Select>
            </i-col>
            <i-col class="fl xy-content-title-search">
              <i-input search v-model.trim="searchText" @on-search="reLoadTable" placeholder="按考试名称查找" class="fr xy-content-title-search">
                <icon type="ios-search cursor-p" slot="suffix" />
              </i-input>
            </i-col>
        </div>
      </div>
      <div class="xy-content-body">
         <XyAntTable
          :columns="columns"
          :dataSource="tableData"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="'max-content'"
        >
          <!--考试名称-->
          <div slot="ExaminationName" slot-scope="text,record" style="min-width:220px">
            <span class="table-el-hover" @click="editExam(record)">
              {{record.ExaminationName}}
            </span>
          </div>
          <!--状态值-->
          <span slot="PublishStatus" slot-scope="text,record">
            <span v-if="!record.IsPublished"><i class="iconfont icon-default">&#xe719;</i>{{record.PublishStatus}}</span>
            <span v-if="record.IsPublished"><i class="iconfont icon-success">&#xe719;</i>{{record.PublishStatus}}</span>
          </span>
          <!--操作-->
          <span slot="oprateRender" slot-scope="text,record">
            <a @click="editExam(record)">编辑</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item :style="{display:(record.IsPublished ?'none' : 'block')}" @click="showRealse(record,true)">
                  发布成绩
                </a-menu-item>
                <a-menu-item :style="{display:(record.IsPublished ?'block' : 'none')}" @click="showRealse(record,false)">
                  取消发布
                </a-menu-item>
                <a-menu-item :disabled="!!record.IsPublished" @click="deleteRow(record)">
                  删除
                </a-menu-item>
              </a-menu>
              <a> 更多 <a-icon type="down" /></a>
            </a-dropdown>
          </span>
        </XyAntTable>
      </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'ExamManagement',
    components: {
      XyAntTable
    },
    data () {
      return {
        nullData: '该搜索条件下没有结果。',
        // 搜索
        typeID: 0,
        schoolDistrict: [],
        schoolDistrictID: 0,
        typeList: [],
        searchText: '',
        tableLoading: true,
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
            this.pageIndex = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
            this.pageInde = 1
            this.pageSize = pageSize
          }
        },
        // 表格
        columns: [
          {
            title: '考试名称',
            width: 140,
            dataIndex: 'ExaminationName',
            fixed: 'left',
            scopedSlots: { customRender: 'ExaminationName' }
          },
          {
            title: '考试类型',
            dataIndex: 'ExaminationTypeName',
            width: 100
          },
          {
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            width: 100
          },
          {
            title: '年级',
            dataIndex: 'StudentGradeName',
            width: 80
          },
          {
            title: '学级',
            dataIndex: 'StudentYearName',
            width: 100
          },
          {
            title: '学年',
            dataIndex: 'AcademicYearName',
            width: 140
          },
          {
            title: '学期',
            dataIndex: 'AcademicSessionName',
            width: 100
          },
          {
            title: '成绩录入开始日期',
            dataIndex: 'StartDate',
            width: 150
          },
          {
            title: '成绩录入结束日期',
            dataIndex: 'EndDate',
            width: 150
          },
          {
            title: '状态',
            dataIndex: 'PublishStatus',
            width: 100,
            scopedSlots: { customRender: 'PublishStatus' }
          },
          {
            title: '操作',
            dataIndex: '04',
            width: 140,
            scopedSlots: { customRender: 'oprateRender' }
          }

        ],
        tableData: [{}],
        total: 0, // 总条数
        pageSize: 15,
        pageIndex: 1
      }
    },
    created () {
      this.getSchoolDistrict()
      this.getTypeList()
    },
    mounted () {
      this.$nextTick(() => {
        this.loadTable()
      })
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      //  获取table分页数据
      async loadTable () {
        this.tableLoading = true
        let params = {
          SchoolDistrictID: this.schoolDistrictID,
          AcademicYearID: this.typeID,
          AcademicSessionID: 0,
          ExaminationName: this.searchText,
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize
        }
        let res = await this.xy.get(this.$store.state.apiPath + '/api/Examination/GetExaminationPageList', params)
        this.tableLoading = false
        if (res.success) {
          this.tableData = res.data.data
          // this.total = res.data.totalRecords
          this.pagination.total = res.data.totalRecords
        }
      },
      // 获取：校区
      async getSchoolDistrict () {
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AemBase/GetSchoolDistrict', null)
        if (res.success) {
          this.schoolDistrict = res.data
        }
      },
      // 所有学年
      async getTypeList () {
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AemBase/GetAcademicYear', null)
        if (res.success) {
          this.typeList = res.data
        }
      },
      reLoadTable () {
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      showRealse (data, publish) {
        this.$Modal.confirm({
          title: '发布',
          content: publish ? '您确认要发布 ' + data.ExaminationName + ' 吗？' : '您确认要取消发布 ' + data.ExaminationName + ' 吗？',
          onOk: () => {
            this.release(data, publish)
          }
        })
      },
      // 发布考试
      async release (data, publish) {
        let res = await this.xy.post(this.$store.state.apiPath + `/api/Examination/ExaminationPublish?ExaminationID=${data.ID}&IsPublished=${publish}`, null)
        if (res.success) {
          this.xy.msgSuc('操作成功。')
          this.reLoadTable()
        }
      },
      deleteRow (row) {
        this.$Modal.confirm({
          title: '删除',
          content: '您确认要删除 ' + row.ExaminationName + ' 吗？',
          onOk: () => {
            this.delExam(row)
          }
        })
      },
      async delExam (row) {
        let res = await this.xy.post(this.$store.state.apiPath + `/api/Examination/ExaminationDelete?ExaminationID=${row.ID}`, null)
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          this.reLoadTable()
        }
      },
      create () {
        this.$store.commit('common/getThreeMenuName', '创建考试')
        this.$router.push({
          path: 'ExamManagementCreat',
          query: this.$store.state.common.menuInfo
        })
      },
      // 编辑
      editExam (row) {
        this.$store.commit('common/getThreeMenuName', '编辑考试')
        this.$store.commit('common/getParam', {
          'ExaminationID': row.ID,
          'ExaminationType': row.ExaminationType
        })
        this.$router.push({ path: `/xyHome/ExamManagementEdit`, query: this.$store.state.common.menuInfo })
      }
    }
  }
</script>

<style lang="less">
</style>
