<template>
  <div class="xy-content-module">
    <!-- 学生考勤-考勤范围设置   // 缺少面包屑 -->
    <div class="xy-content-title clearfix">
      <div class="fl">
        <Button class="xy-primary" @click="batchSetting">批量设置</Button>
      </div>
      <div class="fr">
        <!-- 校区 -->
        <i-select
          v-model="schoolChangeStr"
          v-on:on-change="SchoolChange"
          class="xy-content-title-search"
          style="width: 170px;"
          >
        <!--  <i-option :value="0" :key="-1">所有校区</i-option> -->
          <i-option
            v-for="school in venueSchool"
            :value="school.id"
            :key="school.id"
            v-cloak
            >
            {{ school.label }}
          </i-option>
        </i-select>
        <!-- 年级 -->
        <i-select
          v-model="grade_value"
          v-on:on-change="ClassChange"
          class="xy-content-title-search"
          style="width: 170px;"
          >
          <i-option :value="0" :key="-1">所有年级</i-option>
          <i-option
            v-for="grade in grade_list"
            :value="grade.id"
            :key="grade.id"
            v-cloak
            >
            {{ grade.label }}
          </i-option>
        </i-select>
        <!-- 学科 -->
        <i-select
          v-model="subject_value"
          v-on:on-change="SubjectChange"
          class="xy-content-title-search"
          style="width: 170px;"
          >
          <i-option :value="0" :key="-1">所有学科</i-option>
          <i-option
            v-for="subject in subject_list"
            :value="subject.id"
            :key="subject.id"
            v-cloak
            >
            {{ subject.label }}
          </i-option>
        </i-select>
        <!-- 开关状态筛选 -->
        <i-select
          v-model="statusID"
          v-on:on-change="typeStatusSearch"
          class="xy-content-title-search"
          style="width:170px;"
          >
          <i-option
            v-cloak
            v-for="(types, index) in typeStatus"
            :value="types.value"
            :key="index"
            >
            {{ types.status }}
          </i-option>
        </i-select>
        <!-- 搜索 -->
        <i-input
          search
          v-on:on-search="searchExe"
          v-model.trim="searchClass"
          placeholder="请输入教学班搜索"
          class="xy-content-title-search"
          style="display:inline-block;width: 170px;"
          >
          <!-- <i-button slot="append" icon="ios-search" v-on:click="searchExe"></i-button> -->
        </i-input>
      </div>
    </div>
    <div class="xy-content-body">
        <XyAntTable
            :rowSelection="tableRowSelection"
            :columns="columns"
            :dataSource="tableData"
            :nullData="nullData"
            :tableLoading="tableLoading"
            :pagination="pagination"
            @change="handleTableChange"
            :scrollx="'max-content'"
            >
            <div slot="SchoolDistrictName" style="min-width:200px" slot-scope="text, record" @click="switchFun(record)">
              <span class="table-el-hover">
              {{text}}
              </span>
            </div>
            <div slot="StudentGradeNameForStudentYearName" style="min-width:200px" slot-scope="text, record">
              {{record.StudentGradeNameForStudentYearName}}
            </div>
            <div slot="DisciplineName" style="min-width:150px" slot-scope="text, record">
              {{record.DisciplineName}}
            </div>
            <div slot="CoursePlanTableFullName" style="min-width:200px" slot-scope="text, record">
              {{record.CoursePlanTableFullName}}
            </div>
            <div slot="switchRender" slot-scope="text, record">
              <a-switch checked-children="开启" un-checked-children="关闭" :checked="record.IsEnable" @change="switchFun(record)" />
            </div>
          </XyAntTable>
    </div>
    <modal
      v-model="showWindow_batchSetting"
      :transfer="false"
      title="批量设置"
      @on-visible-change="cancelHandle"
      >
        <p>将所选教学班的考勤状态，批量设置为:
          <i-switch v-model="switchStatus_batchSetting" size="large">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
          </i-switch>
        </p>
        <div slot="footer">
          <Button class="xy-modal-close" @click="batchSetting_cancel">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="batchSetting_confirm">确定</Button>
        </div>
    </modal>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'AttendanceRange',
    components: {
      XyAntTable
    },
    data () {
      return {
        /* [Start] 各列表值 */
        venueSchool: [], // 校区列表
        grade_list: [], // 年级列表
        subject_list: [], // 学科列表
        typeStatus: [
          {
            value: 0,
            status: '全部'
          },
          {
            value: 1,
            status: '开启'
          },
          {
            value: 2,
            status: '关闭'
          }
        ], // 关闭与否的状态列表
        // antTable
        selectedRowKeys: [],
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        columns: [
          {
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            scopedSlots: { customRender: 'SchoolDistrictName' }
          }, {
            title: '年级',
            dataIndex: 'StudentGradeNameForStudentYearName',
            scopedSlots: { customRender: 'StudentGradeNameForStudentYearName' }
          },
          {
            title: '学科',
            dataIndex: 'DisciplineName',
            scopedSlots: { customRender: 'DisciplineName' }
          },
          {
            title: '教学班',
            dataIndex: 'CoursePlanTableFullName',
            scopedSlots: { customRender: 'CoursePlanTableFullName' }
          },
          {
            title: '状态',
            width: 100,
            scopedSlots: { customRender: 'switchRender' }
          }
        ],
        tbData: [],
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
        tableData: [],
        pageIndex: 1,
        pageSize: 15,
        /* [End] 各列表值 */
        /* [Start] 筛选值 */
        schoolChangeStr: '', // 校区
        grade_value: 0, // 年级,
        subject_value: 0, // 学科
        statusID: 1, // 开启状态，默认展示开启
        searchClass: '', // 教学班搜索
        /* [End] 筛选值 */

        /* [Start] 状态 */
        firstRun: {
          Finished: false,
          grade: false,
          subject: false
        },
        selectionAll: [],
        showWindow_batchSetting: false,
        /* [End] 状态 */

        /* [Start] 设置 */
        switchStatus_batchSetting: false,
        /* [End] 设置 */
        // apiPath: 'http://192.168.20.35:5011'
        apiPath: ''
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.getSchool()
      this.getSubjects()
    },
    watch: {
    },
    mounted () {
    },
    computed: {
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange
        }
      }
    },
    methods: {
      handleTableChange () {
        this.getTP()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      // 全部校区: 仅在页面首次加载时调用
      async getSchool () {
        // this.tableLoading = true
        var _this = this
        this.venueSchool = []
        let res = await this.xy.get(
          this.xyApi + `/xy/comm/SchoolDistrictList`
        )
        // this.tableLoading = false
        if (res.success) {
          var data = res.data
          if (data && data.length > 0) {
            data.forEach(function (item) {
              _this.venueSchool.push({
                id: item.SchoolDistrictID,
                label: item.SchoolDistrictName,
                callback: function (e) {
                  _this.schoolChangeStr = e.id
                }
              })
            })
            // 默认值：首个校区
            _this.schoolChangeStr = data[0].SchoolDistrictID
            // _this.schoolChangeStr = 0
            _this.getGrades()
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 获取年级
      async getGrades () {
        var _this = this
        this.grade_list = []
        let res = await this.xy.get(
          this.xyApi + `/xy/Comm/GetStudentGradeStudentYearBySid?schoolDistrictID=` + this.schoolChangeStr
        )
        if (res.success) {
          var data = res.data
          if (data && data.length > 0) {
            data.forEach(function (item) {
              _this.grade_list.push({
                id: item.StudentGradeForStudentYearID,
                label: item.FullName
              })
            })
            // 默认使用所有年级：0
            _this.grade_value = 0
            // 根据是否为首次加载进行切换
            if (_this.firstRun.Finished) {
              _this.pagination.current = 1
              _this.schoolDistrictID = _this.schoolChangeStr
              _this.StudentGradeForStudentYearID = _this.grade_value
              _this.getTP()
            } else {
              // 首次进入页面时
              _this.firstRun.grade = true
              if (_this.firstRun.subject) {
                _this.firstRun.Finished = true
                _this.getTP()
              }
            }
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 获取学科列表：仅在首次加载页面时调用
      async getSubjects () {
        var _this = this
        let res = await this.xy.get(
          this.xyApi + `/xy/comm/GetDisciplineList`
        )
        if (res.success) {
          var data = res.data
          if (data && data.length > 0) {
            data.forEach(function (item) {
              _this.subject_list.push({
                id: item.DisciplineID,
                label: item.DisciplineName
              })
            })
            // 首次进入页面时
            if (!_this.firstRun.Finished) {
              _this.firstRun.subject = true
              if (_this.firstRun.grade) {
                _this.firstRun.Finished = true
                _this.getTP()
              }
            }
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 状态筛选
      typeStatusSearch () {
        this.pagination.current = 1
        this.isEnable = this.statusID
        this.getTP()
      },
      // 获取考勤范围 列表
      async getTP () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        var params = {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          StudentGradeForStudentYearID: this.grade_value,
          DisciplineID: this.subject_value,
          SearchText: this.searchClass,
          schoolDistrictID: this.schoolChangeStr,
          isEnable: this.statusID
        }
        let res = await this.xy.get(
          this.apiPath + `/api/AttsSetting/GetRange`, params
        )
        if (res.success) {
          this.tableData = res.data.data
          this.pagination.total = res.data.totalRecords
        } else {
          this.xy.msgError(res.msg)
        }
        this.tableLoading = false
      },
      // 校区筛选
      SchoolChange () {
        this.pagination.current = 1
        this.getGrades()
      },
      // 范围设置切换switch
      async switchFun (row) {
        this.xy.loading()
        var _status = row.IsEnable
        let res = await this.xy.post(
          this.apiPath + `/api/AttsSetting/SetRangeStatus`, {
            RangeModel: [row],
            IsEnable: !row.IsEnable
          }
        )
        this.xy.unloading()
        if (res.success) {
          if (_status) {
            this.xy.msgSuc('已关闭。')
          } else {
            this.xy.msgSuc('已开启。')
          }
          if (this.tableData.length > 1) {
            this.tableData.length = this.tableData.length - 1
          } else {
            if (this.pagination.current > 1) {
              this.pagination.current = this.pagination.current - 1
            }
          }
          this.getTP()
        }
      },
      ClassChange () {
        this.pagination.current = 1
        this.StudentGradeForStudentYearID = this.grade_value
        this.getTP()
      },
      SubjectChange () {
        this.pagination.current = 1
        this.DisciplineID = this.subject_value
        this.getTP()
      },
      searchExe () {
        this.pagination.current = 1
        this.SearchText = this.searchClass
        this.getTP()
      },
      batchSetting () {
        if (this.selectionAll.length > 0) {
          this.showWindow_batchSetting = true
        } else {
          this.xy.msgError('请选择要设置的项目。')
        }
      },
      // 批量设置：确认
      async batchSetting_confirm () {
        this.xy.loading()
        var data = this.selectionAll
        let res = await this.xy.post(
          this.apiPath + `/api/AttsSetting/SetRangeStatus`, {
            RangeModel: data,
            IsEnable: this.switchStatus_batchSetting
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('设置成功。')
          if (this.selectionAll.length === this.tableData.length && this.tableData.length > 0) {
            this.pagination.current = this.pagination.current - 1
          }
          this.selectionAll = []
          this.getTP()
        }
        this.closeWindow_batchSetting()
      },
      batchSetting_cancel () {
        this.closeWindow_batchSetting()
      },
      cancelHandle () {
        if (!this.switchStatus_batchSetting) {
          this.switchStatus_batchSetting = false
        }
        if (!this.showWindow_batchSetting) {
          this.showWindow_batchSetting = false
          this.switchStatus_batchSetting = false
        }
      },
      closeWindow_batchSetting () {
        this.switchStatus_batchSetting = false
        this.showWindow_batchSetting = false
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
