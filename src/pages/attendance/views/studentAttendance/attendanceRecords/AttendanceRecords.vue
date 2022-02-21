<template>
  <div class="xy-content-module">
    <!-- 学生考勤-考勤记录   // 缺少面包屑 -->
  <div class="xy-content-title clearfix">
    <div class="fl pr">
      校区/年级/班级：
      <Cascader
        :data="schoolGradeClass_list"
        change-on-select
        v-model="options_filter.schoolGradeClass_value"
        style="display: inline-block;width:280px;"
        :clearable="false"
        @on-change="selectClass"
        >
      </Cascader>
    </div>
    <div class="fr pr">
            日期范围：
        <Date-Picker
          v-model="options_filter.datePicker_rangeValue"
          type="daterange"
          confirm
          :clearable="false"
          placeholder="请选择日期范围"
          :options="options_filter.date_range_options"
          @on-change="datePicker_change"
          @on-ok="datePicker_confirm"
          separator="~"
          style="display: inline-block;width:196px;"
          >
        </Date-Picker>
      考勤状态：
      <Select
        v-model="options_filter.attType_value"
        style="display: inline-block;width:180px;"
        @on-change="selectAttType"
        >
          <Option
            v-for="item in toolbar_attType_list"
            :value="item.StudentAttendanceTypeID"
            :key="item.StudentAttendanceTypeID"
            >
            {{ item.StudentAttendanceTypeName }}
          </Option>
        </Select>
      <span>
        学生：
        <Input
          clearable
          v-model.trim="options_filter.searchStudent_value"
          @on-enter="searchStudent_exe"
          placeholder="用户名/姓名"
          style="display:inline-block;width: 180px;margin-right:10px;"
        />
        <Button @click="searchStudent_exe" class="xy-primary">查询</Button>
      </span>
    </div>
  </div>
  <div class="xy-content-body">
    <div class="attRecords-content-header clearfix">
      <h5>
        考勤情况明细表（
          <span v-show="options_filter.type_time !== 1" >
            {{selectorStartTime}} ~ {{selectorEndTime}}
          </span>
          <span v-show="options_filter.type_time === 1">
            {{selectorStartTime}}
          </span>
        ）
      </h5>
      <div class="fr" style="margin-top: 10px;">
        <Checkbox
          v-model="options_filter.showNotNormal_value"
          class="student-check"
          @on-change="showNotNormal_change"
          >
          只显示非正常考勤结果
        </Checkbox>
        <Button @click="exportFile" class="xy-primary">导出</Button>
      </div>
    </div>
      <!-- <div v-if="schoolGradeClass_list.length === 0" class="no-data-box" v-cloak>
        <img class="no-data-img" src="@/assets/common/nullData.svg" />
        <span class="no-data-text" v-cloak>该搜索条件下没有结果。</span>
      </div> -->
    <div class="attRecords-panel-dataArea">
      <div >
      <!-- <div v-if="table_pageCfg.isEmpty" class="no-data-box" v-cloak>
        <img class="no-data-img" src="@/assets/common/nullData.svg" />
        <span class="no-data-text" v-cloak>该搜索条件下没有结果。</span>
      </div> -->
      <div class="xy-content-table pr">
        <XyAntTable
          :columns="columns"
          :dataSource="detail_data"
          :nullData="noDataText"
          :tableLoading="tableLoading"
          :pagination="table_pageCfg"
          @change="handleTableChange"
          :scrollx="1260"
          >
          <div slot="IconRender" slot-scope="text, record">
            <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
              <span class="head-font">
                {{ xy.showName(record.FullName)}}
              </span>
            </div>
            <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
          </div>
          <div slot="UserNameRender" slot-scope="text, record" style="min-width:120px">
              {{record.UserName.replace(/\s/g, '&nbsp;')}}
          </div>
          <div slot="FullNameRender" style="min-width:120px"  slot-scope="text, record">
            <span v-if="record.IsChanged" class="table-el-hover" @click="changeHistory_change(record)">
            {{record.FullName.replace(/\s/g, '&nbsp;')}}
            </span>
            <span v-else>
            {{record.FullName.replace(/\s/g, '&nbsp;')}}
            </span>
          </div>
          <div style="min-width:100px" slot="ClassName" slot-scope="text, record">
            {{record.ClassName}}
          </div>
          <div style="min-width:120px" slot="TeachingClassName" slot-scope="text, record">
            {{record.TeachingClassName}}
          </div>
          <!-- 状态 -->
          <div slot="TypeName" slot-scope="text, record">
            <span v-if="record.TypeID===1">
              <i class="iconfont icon-info">&#xe719;</i>
              {{record.TypeName}}
            </span>
            <span v-else-if="record.TypeID===2 || record.TypeID===3 || record.TypeID===4">
              <i class="iconfont icon-error">&#xe719;</i>
              {{record.TypeName}}
            </span>
            <span v-else-if="record.TypeID===5">
              <i class="iconfont icon-success">&#xe719;</i>
              {{record.TypeName}}
            </span>
            <span v-else>
              <i class="iconfont icon-wran">&#xe719;</i>
              {{record.TypeName}}
            </span>
          </div>
          <div slot="LastModifyByDate" slot-scope="text, record">
            {{record.LastModifyByDate}}
          </div>
          <span slot="oprateRender" slot-scope="text, record">
            <a :disabled="!record.IsChanged" @click="changeHistory_change(record)">查看变更</a>
            <a-divider type="vertical" />
            <a @click="editWindow_openModal(record)">编辑</a>
          </span>
        </XyAntTable>
      </div>
      </div>
    </div>
  </div>

  <!-- 弹窗：变更记录 -->
  <Modal
    v-model="window_change.checkChange"
    width="817"
    title="变更记录"
    :transfer="false"
    :mask-closable="false"
    >
    <XyAntTable
      :columns="window_change.changeDetail"
      :dataSource="window_change.changeDetailData"
      :tableLoading="changeLoading"
      :isPage="false"
      >
      <!-- 修改时间 -->
      <div slot="LastModifyByDate" slot-scope="text, record">
        {{record.LastModifyByDate}}
      </div>
    </XyAntTable>
    <div slot="footer">
      <Button class="xy-modal-primary" shape="circle" @click="changeHistory_closeModal">关闭</Button>
    </div>
  </Modal>
  <!-- 弹窗:编辑 -->
  <div class="" v-if="window_edit.showWindow">
    <Modal
      class-name="editWindow"
      v-model="window_edit.showWindow"
      width="640"
      :title="'修改' + window_edit.currentData.ClassName + window_edit.currentData.FullName + '的考勤'"
      >
        <Radio-Group v-model="window_edit.leaveType_value" type="button" class="editWindow-items">
          <Radio
            v-for="item in window_edit.leaveType_list"
            :label="item.StudentAttendanceTypeID"
            :key="item.StudentAttendanceTypeID"
            >
            {{item.StudentAttendanceTypeName}}
          </Radio>
        </Radio-Group>
        <div slot="footer">
          <Button class="xy-modal-close" @click="editWindow_closeModal">取消</Button>
          <Button class="xy-modal-primary"  shape="circle" @click="update_attendanceType">保存</Button>
        </div>
    </Modal>
  </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'AttendanceRecords',
    components: {
      XyAntTable
    },
    data () {
      return {
        noDataText: '该搜索条件下没有结果。',
        isLoading: false,
        /* ------- [Start] 数据 ------- */
        // 上方筛选工具栏
        schoolGradeClass_list: [], // 校区、年级、班级
        classSection_list: [], // 节次
        currentAcademicSession_data: {}, // 当前学期信息
        // 数据表格
        detail_data: [], // 主表
        changeRecord_data: [], // 变更记录表
        toolbar_attType_list: [{
          StudentAttendanceTypeID: 0,
          StudentAttendanceTypeName: '全部'
        }], // 考勤类型
        options_filter: {
          /* --- [Start] 工具栏筛选 --- */
          schoolGradeClass_value: [], // 校区、年级、班级
          // type_time: 1, // 时间范围类型
          classSection_value: ',-1', // 默认：所有节次。此为数组 [,-1],第一个为AM/PM/空，第二个为具体的节次数字
          searchStudent_value: '', // 学生搜索
          date_range: [ // 当前查看的时间范围：默认今天
            this.xy.moment().startOf('day')._d,
            this.xy.moment().endOf('day')._d
          ], // 无论选择的是何种时间类型，均填写该项；用于：当前选择的时间区间，即包含自定义时间段
          datePicker_rangeValue: [
            this.xy.moment().startOf('day')._d,
            this.xy.moment().endOf('day')._d
          ],
          date_range_options: {
            disabledDate: function (date) {
              return date.getTime() > new Date(new Date().setHours(0, 0, 0, 0))
            }
          },
          showNotNormal_value: true, // 只显示正常的考勤数据（“正常”以外的都是非正常，默认为false，即非正常）
          attType_value: 0 // 考勤状态，默认 全部：0
          /* --- [End] 工具栏筛选 --- */

          /* --- [Start] 当前筛选状态 --- */
          /* --- [End] 当前筛选状态 --- */
        },
        firstRun_status: {
          ready: false,
          received_classList: false,
          received_semesterList: false
        },
        // antTable
        selectedRowKeys: [],
        changeLoading: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        columns: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 40,
            scopedSlots: { customRender: 'IconRender' },
            className: 'table-pic'
          }, {
            title: '姓名',
            dataIndex: 'FullName',
            scopedSlots: { customRender: 'FullNameRender' }
          }, {
            title: '用户名',
            dataIndex: 'UserName',
            scopedSlots: { customRender: 'UserNameRender' }
          },
          {
            title: '日期',
            dataIndex: 'ClassDate_Format',
            width: 100
          },
          {
            title: '节次',
            dataIndex: 'AMorPMOrderName',
            width: 120
          },
          {
            title: '班级',
            dataIndex: 'ClassName',
            scopedSlots: { customRender: 'ClassName' }
          },
          {
            title: '教学班',
            dataIndex: 'TeachingClassName',
            scopedSlots: { customRender: 'TeachingClassName' }
          },
          {
            title: '考勤方式',
            dataIndex: 'AttFromName',
            width: 100
          },
          {
            title: '考勤时间',
            dataIndex: 'LastModifyByDate',
            width: 160
          },
          {
            title: '考勤状态',
            dataIndex: 'TypeName',
            width: 100,
            scopedSlots: { customRender: 'TypeName' }
          },
          {
            title: '操作',
            dataIndex: '04',
            width: 140,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        table_pageCfg: {
          isInitial: false,
          isEmpty: false,
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.table_pageCfg.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.table_pageCfg.current = 1
            this.table_pageCfg.pageSize = pageSize
          }
        },
        status: {
          datePicker_show: false
        },
        window_change: {
          checkChange: false, // 查看变更
          changeDetail: [ // 变更记录表头
            {
              title: '操作者',
              dataIndex: 'UserName'
            },
            {
              title: '原状态',
              dataIndex: 'SourceTypeName'
            },
            {
              title: '修改时间',
              dataIndex: 'LastModifyByDate',
              width: 180,
              scopedSlots: { customRender: 'LastModifyByDate' }
            },
            {
              title: '考勤方式',
              dataIndex: 'AttFromName'
            },
            {
              title: '修改后状态',
              dataIndex: 'TargetTypeName'
            }
          ],
          changeDetailData: [] // 变更记录表格数据
        },
        window_edit: {
          showWindow: false,
          currentData: undefined,
          leaveType_list: [],
          leaveType_value: undefined
        }
      }
    },
    created () {
      this.isLoading = true
      this.getClassList()
      this.getCurrentAcademicSession()
      this.getLeaveType()
    },
    computed: {
      // 格式化后的开始时间
      selectorStartTime: function () {
        return this.xy.moment(this.options_filter.date_range[0]).format('YYYY-MM-DD')
      },
      // 格式化后的结束时间
      selectorEndTime: function () {
        return this.xy.moment(this.options_filter.date_range[1]).format('YYYY-MM-DD')
      }
    },
    mounted () {},
    methods: {
      handleTableChange () {
        this.getDetail()
      },
      // 获取：校、年级、班级数据
      async getClassList () {
        let that = this
        let idArr = this.$store.state.common.menuId.split(',')
        // this.xy.loading()
        let res = await this.xy.get(
          this.xyApi + `/xy/comm/GetUserRangeClassPermission`, {
            applicationID: idArr[1],
            ApplicationSubMenuID: idArr[2]
          }
        )
        if (res.success) {
          let data = res.data
          if (data.length > 0) {
            // data.forEach(itemSchool => {
            //   itemSchool.children.unshift({
            //     label: '所有年级',
            //     value: 0,
            //     children: []
            //   })
            //   itemSchool.children.forEach(itemGrade => {
            //     itemGrade.children.unshift({
            //       label: '所有班级',
            //       value: 0
            //     })
            //   })
            // })
            that.schoolGradeClass_list = data
            if (data.length > 0) {
              that.options_filter.schoolGradeClass_value = [data[0].value]
            }
            // that.getSection()
            that.getDetail()
          } else {
            this.tableLoading = false
          }
        }
      },
      // 获取：节次列表
      async getSection () {
        let that = this
        let value = this.options_filter.schoolGradeClass_value[0]
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/xy/comm/GetAllClassTableStructure?SchoolDistrictID=${value}`)
        if (res.success) {
          that.classSection_list = res.data
        }
      },
      // 获取：详细数据
      async getDetail () {
        // option = option || {
        //   resetPageIndex: true
        // }
        // // 默认重置页面为第一页
        // if (option.resetPageIndex) {
        //   this.table_pageCfg.current = 1
        // }
        this.tableLoading = true

        let that = this
        let idArr = this.$store.state.common.menuId.split(',')
        let p = this.options_filter
        let Lesson = p.classSection_value.split(',')
        let params = {
          UserName: p.searchStudent_value, // 用户名/姓名
          DistrictID: p.schoolGradeClass_value[0], // 校区
          GradeID: p.schoolGradeClass_value[1] ? p.schoolGradeClass_value[1] : 0, // 年级
          ClassID: p.schoolGradeClass_value[2] ? p.schoolGradeClass_value[2] : 0, // 班级
          StartDate: this.xy.moment(p.date_range[0]).format('YYYY-MM-DD'), // 开始日期
          EndDate: this.xy.moment(p.date_range[1]).format('YYYY-MM-DD'), // 结束日期
          AMorPM: Lesson[0], // 节次：上午下午
          Order: Number(Lesson[1]), // 节次
          TypeID: p.attType_value,
          IsShowNomal: p.showNotNormal_value, // 只显示正常的考勤数据（“正常”以外的都是非正常，默认为false，即非正常）
          ApplicaionID: Number(idArr[1]),
          ApplicationSubMenu: Number(idArr[2]),
          PageIndex: this.table_pageCfg.current,
          PageSize: this.table_pageCfg.pageSize
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AttsLesson/GetAttendanceRecord`, params)
        this.tableLoading = false
        if (res.success) {
          that.isLoading = false
          that.table_pageCfg.total = res.data.totalRecords
          that.detail_data = []
          if (res.data.data && res.data.data.length > 0) {
            res.data.data.forEach(item => {
              item.ClassDate_Format = this.xy.moment(item.ClassDate).format('YYYY-MM-DD')
              item.CreateModifyByDate_Format = this.xy.moment(item.CreateModifyByDate).format('YYYY-MM-DD HH:MM:SS')
              item.LastModifyByDate_Format = item.LastModifyByDate ? this.xy.moment(item.LastModifyByDate).format('YYYY-MM-DD') : undefined
              that.detail_data.push(item)
            })
          }
        }
      },
      // 获取：当前学期
      async getCurrentAcademicSession () {
        let that = this
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AcademicSession/GetCurrent`)
        this.xy.unloading()
        if (res.success) {
          that.currentAcademicSession_data = res.data
        }
      },
      // 导出文件
      exportFile () {
        if (this.detail_data.length > 0) {
          let idArr = this.$store.state.common.menuId.split(',')
          let p = this.options_filter
          let Lesson = p.classSection_value.split(',')
          p = {
            UserName: p.searchStudent_value, // 用户名/姓名
            DistrictID: p.schoolGradeClass_value[0], // 校区
            GradeID: p.schoolGradeClass_value[1] ? p.schoolGradeClass_value[1] : 0, // 年级
            ClassID: p.schoolGradeClass_value[2] ? p.schoolGradeClass_value[2] : 0, // 班级
            StartDate: this.xy.moment(p.date_range[0]).format('YYYY-MM-DD'), // 开始日期
            EndDate: this.xy.moment(p.date_range[1]).format('YYYY-MM-DD'), // 结束日期
            AMorPM: Lesson[0], // 节次：上午下午
            Order: Number(Lesson[1]), // 节次
            IsShowNomal: p.showNotNormal_value, // 只显示正常的考勤数据（“正常”以外的都是非正常，默认为false，即非正常）
            ApplicaionID: Number(idArr[1]),
            ApplicationSubMenu: Number(idArr[2]),
            PageIndex: this.table_pageCfg.current,
            PageSize: this.table_pageCfg.pageSize
          }
          // this.xy.downFile(`${this.$store.state.apiPath}/api/AttsLesson/ExportStudentAttendanceRecord?userName=${p.UserName}&startDate=${p.StartDate}&endDate=${p.EndDate}&isShowNomal=${p.IsShowNomal}&districtID=${p.DistrictID}&gradeID=${p.GradeID}&classID=${p.ClassID}&AMorPM=${p.AMorPM}&Order=${p.Order}`)
          this.xy.downFile(`${this.$store.state.apiPath}/api/AttsLesson/ExportStudentAttendanceRecord`, {
            userName: p.UserName,
            startDate: p.StartDate,
            endDate: p.EndDate,
            isShowNomal: p.IsShowNomal,
            districtID: p.DistrictID,
            gradeID: p.GradeID,
            classID: p.ClassID,
            AMorPM: p.AMorPM,
            typeID: this.options_filter.attType_value,
            Order: p.Order
          })
        } else {
          this.xy.msgError('当前无数据可导出。')
        }
      },
      // 选择：校区、年级、班级，以此判断维度
      selectClass (val, selectedData) {
        this.$nextTick(() => {
          this.options_filter.classSection_value = ',-1'
        })
        this.table_pageCfg.current = 1
        setTimeout(() => {
          this.getDetail()
        }, 0)
      },
      // 用户修改日期
      datePicker_change (val, type) {
        console.log(val, type)
      },
      // 用户确认修改日期
      datePicker_confirm () {
        let d = this.options_filter.datePicker_rangeValue
        this.options_filter.date_range = [
          this.xy.moment(d[0])._d,
          this.xy.moment(d[1])._d
        ]
        this.table_pageCfg.current = 1
        this.getDetail()
      },
      searchStudent_exe () {
        this.table_pageCfg.current = 1
        this.getDetail()
      },
      showNotNormal_change () {
        this.table_pageCfg.current = 1
        this.getDetail()
      },
      /* [Start] 查看变更窗口 */
      // 点击查看变更
      async changeHistory_change (row) {
        this.window_change.checkChange = true
        let _this = this
        this.changeLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AttsLesson/GetAttendanceRecordByClassBaseID`, {
          recordID: row.StudentAttendanceID
        })
        this.changeLoading = false
        if (res.success) {
          _this.$set(_this.window_change, 'changeDetailData', res.data)
          this.window_change.changeDetailData.map((item, index) => {
            this.$set(item, 'key', index)
          })
        }
      },
      changeHistory_closeModal () {
        this.window_change.checkChange = false
      },
      /* [End] 查看变更窗口 */
      /* [Start] 修改考勤窗口 */
      editWindow_openModal (data) {
        if (!data.CanEdit) {
          return
        }
        this.window_edit.currentData = data
        this.window_edit.showWindow = true
        this.window_edit.leaveType_value = data.TypeID
      },
      editWindow_closeModal () {
        this.window_edit.currentData = undefined
        this.window_edit.showWindow = false
        this.window_edit.leaveType_value = undefined
      },
      async getLeaveType () {
        // this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AttsSetting/GetType`)
        // this.xy.unloading()
        if (res.success) {
          this.toolbar_attType_list = [{
            StudentAttendanceTypeID: 0,
            StudentAttendanceTypeName: '全部'
          }]
          res.data.forEach(item => {
            if (item.XYCode !== 'Notyet') {
              this.window_edit.leaveType_list.push(item)
            }
            this.toolbar_attType_list.push(item)
          })
        }
      },
      selectAttType () {
        this.getDetail()
      },
      async update_attendanceType () {
        this.xy.loading()
        let v = this.window_edit.leaveType_value
        if (v === 6 || !v) {
          this.xy.msgError('请选择考勤状态。')
          return
        }
        this.xy.unloading()
        let d = this.window_edit.currentData
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AttsLesson/UpdateAttendanceByID?studentID=${d.StudentID}&typeID=${v}&baseID=${d.BaseID}`)
        if (res.success) {
          this.xy.msgSuc('修改成功。')
          this.window_edit.showWindow = false
          this.getDetail()
        }
      }
      /* [End] 修改考勤窗口 */
    }
  }
</script>
<style lang="less" scoped>
.attRecords-content-header>h5 {
    display: inline-block;
    line-height: 52px;
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: bold;
}

.attRecords-panel-dataArea .ivu-table th {
    background-color: #f9f9f9;
    font-size: 14px;
    line-height: 25px
}

.attRecords-avatar-wrapper {
    display: inline-block;
    margin-right: 20px;
    vertical-align: middle;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #4196ff;
    text-align: center;
    font-size: 12px
}

.attRecords-avatar-wrapper.large {
    width: 74px;
    height: 74px
}

.attRecords-avatar-wrapper.large>.attRecords-avatar-font {
    line-height: 74px;
    font-size: 26px
}

.attRecords-avatar-img {
    width: 100%
}

.attRecords-avatar-font {
    line-height: 34px;
    color: #fff
}

.attRecords-table-1stCol {
    display: inline-block;
    width: 4em;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
}

.attRecords-table-exeBtn {
    margin: 0 15px;
    color: #4196ff
}

.attRecords-table-exeBtn.disabled {
    color: #1890FF;
    cursor: not-allowed;
    opacity: .6
}

.editWindow .ivu-modal-body {
    padding: 31px 24px
}

.editWindow-items {
    width: 100%
}
.editWindow-items>.ivu-radio-group-item {
    display: inline-block;
    width: 112px;
    height: 40px;
    line-height: 40px;
    margin-bottom: 20px;
    text-align: center;
    margin-right: 24px;
    border-radius: 4px;
    border: 1px solid #dcdee2;;
}
.ivu-radio-group-button .ivu-radio-wrapper-checked {
  border: 1px solid #1890ff;
  border-left: 0;
  background: url("../img/sel_small.png") no-repeat right bottom;
  transition: none !important;
}
.ivu-radio-group-button .ivu-radio-wrapper-checked:nth-child(1) {
  border-left: 1px solid #1890ff;
}
.ivu-radio-group-button .ivu-radio-wrapper:before {
  display: none;
}
.ivu-radio-group-button .ivu-radio-wrapper:after {
  display: none;
}
/*# sourceMappingURL=AttendanceRecords.css.map */
/deep/ .ivu-modal-content .ivu-modal-header .ivu-modal-header-inner {
  font-size: 16px;
  line-height: 24px;
  color: #333;
  font-weight: bold;
}
/deep/ .ivu-modal-header {
  padding: 16px 24px;
}
/deep/ .ivu-modal-content .ivu-modal-body {
  padding: 24px;
  padding-bottom: 64px;
}
</style>
