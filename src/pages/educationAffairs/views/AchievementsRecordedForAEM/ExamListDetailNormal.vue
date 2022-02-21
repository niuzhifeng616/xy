// 音体美成绩管理-音体美成绩录入 管理查看页面2
<template>
  <div class="xy-content-module">
      <!-- 面包屑 -->
      <div class="xy-content-title clearfix">
        <div class="fr pr">
            <i-col class="fl xy-content-title-search">
              <Select v-model="typeID" style="width: 150px;" @on-change="reLoadTable" placeholder="全部班级">
                <Option :value="0">
                  全部班级
                </Option>
                <Option :value="item.StudentOrganizationID" v-for="(item, index) in typeList" :key="index">
                  {{item.StudentOrganizationName}}
                </Option>
              </Select>
            </i-col>
            <i-col class="fl xy-content-title-search">
              <Select v-model="SubjectID" style="width: 150px;" @on-change="reLoadTable" placeholder="全部课程">
                <Option :value="0">
                  全部课程
                </Option>
                <Option :value="item.value" v-for="(item, index) in CourseList"
                  :key="index">
                  {{item.text}}
                </Option>
              </Select>
            </i-col>
            <i-col class="fl xy-content-title-search">
              <i-input search v-model.trim="searchText" @on-search="reLoadTable" placeholder="按学生姓名或学号查找" class="fr xy-content-title-search">
                <icon type="ios-search cursor-p" slot="suffix" />
              </i-input>
            </i-col>
        </div>
      </div>
      <div class="xy-content-body">
       <!--<load-table
          @changePage="changePage"
          @changePageSize="changePageSize"
          :tbColumns="columns"
          :tbData="tableData"
          :changePage="changePage"
          :noDataText="txt"
          :pageSize="pageSize"
          :pageIndex="pageIndex"
          :total="total"
          >
        </load-table>-->
        <XyAntTable
          :columns="columns"
          :dataSource="tableData"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="'max-content'"
        >
          <!--学级-->
          <div slot="StudentYearName" slot-scope="text,record" style="min-width:120px">
            <span>
              {{record.StudentYearName}}
            </span>
          </div>
          <!--年级-->
          <div slot="StudentGradeName" slot-scope="text,record" style="min-width:80px">
            <span>
              {{record.StudentGradeName}}
            </span>
          </div>
          <!--班级-->
          <div slot="StudentOrganizationName" slot-scope="text,record" style="min-width:80px">
            <span>
              {{record.StudentOrganizationName}}
            </span>
          </div>
          <!--姓名-->
          <div slot="FullName" slot-scope="text,record" style="min-width:160px">
            <span class="table-el-hover" @click="edit(record)" v-if="record.IsCanEdit">
              {{record.FullName}}
            </span>
            <span v-else>
              {{record.FullName}}
            </span>
          </div>
          <!--课程名称-->
          <div slot="SubjectName" slot-scope="text,record" style="min-width:200px">
            <span>
              {{record.SubjectName}}
            </span>
          </div>
          <!--等级成绩-->
          <div slot="AchievementLevelName" slot-scope="text,record" style="min-width:200px">
            <span>
              {{record.AchievementLevelName}}
            </span>
          </div>
          <!--操作-->
          <span slot="oprateRender" slot-scope="text, record">
            <a @click="edit(record)" :disabled="!record.IsCanEdit">编辑</a>
          </span>
        </XyAntTable>
      </div>
      <Modal v-model="EditForm.show" :transfer="false" title="编辑" :mask-closable="false">
          <div class="dialog-model-content">
              <Form ref="EditForm.data" :model="EditForm.data" :label-width="120">
                  <FormItem label="学生姓名">
                      <i-input disabled :value="EditForm.FullName"></i-input>
                  </FormItem>
                  <FormItem label="学号">
                      <i-input disabled :value="EditForm.UserName"></i-input>
                  </FormItem>
                  <FormItem label="课程名称">
                      <i-input disabled :value="EditForm.SubjectName"></i-input>
                  </FormItem>
                  <FormItem v-if="EditForm.show" label="成绩等级" prop="formPassword">
                      <i-select v-model="EditForm.data.AchievementLevel">
                          <i-option v-for="(item, index) in CourseLevel" :value="item.Value" :key="index">
                              {{item.Text}}
                          </i-option>
                      </i-select>
                  </FormItem>
              </Form>
          </div>
          <div slot="footer">
            <Button class="xy-modal-close" @click="closeStudentWindow">取消</Button>
            <Button class="xy-modal-primary" @click="save" shape="circle">确定</Button>
          </div>
          <spin size="large" fix v-if="!EditForm.show"></spin>
      </Modal>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'ExamListDetailNormal',
    components: {
      XyAntTable
    },
    data () {
      return {
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
        nullData: '该搜索条件下没有结果。',
        // 上一页
        ExaminationID: this.$store.state.common.menuInfo.ExaminationID,
        couldEdit: this.$store.state.common.menuInfo.couldEdit,
        // 搜索
        typeID: 0,
        typeList: [],
        SubjectID: 0,
        CourseList: [],
        searchText: '',
        // 表格
        columns: [
          {
            title: '学级',
            dataIndex: 'StudentYearName',
            scopedSlots: { customRender: 'StudentYearName' }
          },
          {
            title: '年级',
            dataIndex: 'StudentGradeName',
            scopedSlots: { customRender: 'StudentGradeName' }
          },
          {
            title: '班级',
            dataIndex: 'StudentOrganizationName',
            scopedSlots: { customRender: 'StudentOrganizationName' }
          },
          {
            title: '姓名',
            dataIndex: 'FullName',
            scopedSlots: { customRender: 'FullName' }
          },
          {
            title: '课程名称',
            dataIndex: 'SubjectName',
            scopedSlots: { customRender: 'SubjectName' }
          },
          {
            title: '等级成绩',
            dataIndex: 'AchievementLevelName',
            scopedSlots: { customRender: 'AchievementLevelName' }
          },
          {
            title: '操作',
            width: 80,
            dataIndex: '04',
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        tableData: [],
        total: 0, // 总条数
        pageSize: 15,
        pageIndex: 1,
        CourseLevel: [],
        EditForm: {
          show: false,
          data: {}
        }
      }
    },
    created () {
      this.getTypeList()
      this.getCourseList()
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
      // changePage (index) {
      //   this.pageIndex = index
      //   this.loadTable()
      // },
      // changePageSize (size) {
      //   this.pageSize = size
      //   this.loadTable()
      // },
      //  获取table分页数据
      async loadTable () {
        this.tableLoading = true
        let params = {
          ExaminationID: this.ExaminationID,
          StudentOrgID: this.typeID,
          SubjectID: this.SubjectID,
          SearchStr: this.searchText,
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize
        }
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AchievementOfArtAndSport/GetArtAndSportExaminationStudentPageList', params)
        if (res.success) {
          this.tableData = res.data.data
          this.pagination.total = res.data.totalRecords
        }
        this.tableLoading = false
      },
      // 所有班级
      async getTypeList () {
        let res = await this.xy.get(this.$store.state.apiPath + `/api/AemBase/GetStudentOrganization?ExaminationID=${this.ExaminationID}`, null)
        if (res.success) {
          this.typeList = res.data
        }
      },
      // 所有课程
      async getCourseList () {
        let res = await this.xy.get(this.$store.state.apiPath + `/api/AemBase/GetSubject?ExaminationID=${this.ExaminationID}`, null)
        if (res.success) {
          this.CourseList = res.data
        }
      },
      reLoadTable () {
        this.pagination.current = 1
        this.loadTable()
      },
      // 编辑
      edit (row) {
        this.getStudentDetail(row, () => {
          this.getLevel()
          this.openStudentWindow()
        })
      },
      async getStudentDetail (data, callback) {
        this.xy.loading()
        this.EditForm.FullName = data.FullName
        this.EditForm.UserName = data.UserName
        this.EditForm.SubjectName = data.SubjectName
        this.EditForm.StudentID = data.StudentID
        let params = {
          ExaminationID: this.ExaminationID,
          StudentID: data.StudentID
        }
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AchievementOfArtAndSport/GetAchievementOfArtAndSportExaminationIDByStudentID', params)
        this.xy.unloading()
        if (res.success) {
          if (res.data) {
            this.EditForm.data = res.data
            this.EditForm.data.AchievementLevel = String(res.data.AchievementLevel)
          } else {
            this.EditForm.data = {}
            this.EditForm.data.AchievementLevel = ''
          }
          if (typeof callback === 'function') {
            callback()
          }
        }
      },
      async getLevel () {
        this.xy.loading()
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AemBase/GetAchievementLevel', null)
        this.xy.unloading()
        if (res.success) {
          this.CourseLevel = res.data
          if (this.CourseLevel && this.CourseLevel.length > 0 && this.EditForm.data.AchievementLevel === '') {
            this.$set(this.EditForm.data, 'AchievementLevel', this.CourseLevel[0].Value)
          }
        }
      },
      openStudentWindow () {
        this.EditForm.show = true
      },
      closeStudentWindow () {
        this.EditForm.show = false
        this.EditForm.data.AchievementLevel = ''
      },
      async save () {
        this.xy.loading()

        let params = {
          ExaminationID: this.ExaminationID,
          StudentID: this.EditForm.StudentID,
          SubjectName: this.EditForm.SubjectName,
          AchievementLevel: this.EditForm.data.AchievementLevel
        }
        let res = await this.xy.post(this.$store.state.apiPath + '/api/AchievementOfArtAndSport/AchievementOfArtAndSportSave', params)
        if (res.success) {
          this.xy.unloading()
          this.xy.msgSuc('设置成功。')
          this.EditForm.show = false
          this.reLoadTable()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
