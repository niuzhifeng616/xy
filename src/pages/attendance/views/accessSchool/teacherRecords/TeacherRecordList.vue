<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between xy-center" style="justify-content: space-between;">
      <!-- <Row :gutter="10" class="title-top">
        <i-col  span="4"> -->
        <div>
          <span>状态：</span>
          <Select style="display: inline-block; width: 240px;padding-right:40px" v-model="state" @on-change="reLoadTable" placeholder="请选择考勤状态">
            <Option :value="0">所有状态</Option>
            <Option :value="item.ProgrammeState" v-for="item in attStateList"
                    :key="item.ProgrammeState">
              {{item.ProgrammeStateName}}
            </Option>
          </Select>
        <!-- </i-col>
        <i-col  span="4"> -->
          <span>区间：</span>
          <Select style="display: inline-block; width: 200px" v-model="areaRange" @on-change="reLoadTable" placeholder="请选择区间">
            <Option :value="0">所有区间</Option>
            <Option :value="item.SchoolAccessTimeSectionID" v-for="item in timeSlotList"
                    :key="item.SchoolAccessTimeSectionID">
              {{item.SchoolAccessTimeSectionName}}
            </Option>
          </Select>
        </div>
        <!-- </i-col>
        <i-col  span="4" offset="12"> -->
        <div>
          <i-input search
                   v-model.trim="searchText"
                   @on-search="reLoadTable"
                   placeholder="请输入用户名/姓名"
                   class="fr xy-content-title-search">
            <icon type="ios-search cursor-p" slot="suffix"/>
          </i-input>
        </div>
        <!-- </i-col>
      </Row> -->
    </div>
    <div class="xy-content-body">
      <div class="body-title">
        <h3 class="title"></h3>
        <div class="calendar">
          <Icon type="ios-arrow-back" class="pre-btn" @click="prevChange"/>
          <span class="showDate">{{currentDate}} {{currentWeek}}</span>
          <DatePicker type="date"
                      format="yyyy-MM-dd"
                      @on-change="selectDate"
                      :clearable="false"
                      :options="date_range_options"
                      :value="currentDate">
          </DatePicker>
          <Icon type="ios-arrow-forward" @click="nextChange" v-if="!isCurrentDay" class="next-btn"/>
        </div>
        <i-button @click="allExport">导出</i-button>
      </div>
      <XyAntTable
          :columns="columns"
          :dataSource="tableData"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          :scrollx="'max-content'"
          @change="handleTableChange"
        >
          <div slot="IconRender" slot-scope="text, record">
            <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
              <span class="head-font">
                {{ xy.showName(record.FullName)}}
              </span>
            </div>
            <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
          </div>
          <div slot="FullNameRender" style="min-width:80px" slot-scope="text, record">
            <span class="table-el-hover" @click="modifyState(record)">
              {{ text}}
            </span>
          </div>
          <div slot="UserNameRender" slot-scope="text, record">
            <div style="min-width:100px">
              {{ record.UserName}}
            </div>
          </div>
          <span slot="oprateRender" slot-scope="text, record">
            <a @click="modifyState(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="seeOperateRecords(record)">操作记录</a>
          </span>
        </XyAntTable>
    </div>
    <Modal
      v-model="screenModel"
      class="screenModel"
      :title="'修改“'+currentRow.FullName+'”的出入校考勤状态'"
      width="400"
      :transfer="false"
      :mask-closable="false"
      >
        <RadioGroup v-model="currentState">
          <Radio :label="item.ProgrammeState" v-for="item in attStateList.slice(0, -1)" :key="item.ProgrammeStateName">
            {{item.ProgrammeStateName}}
          </Radio>
        </RadioGroup>
        <div slot="footer">
          <Button class="xy-modal-close" @click="screenModel = false">取 消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="modifyStatePost">确定</Button>
        </div>
    </Modal>
    <Modal
      v-model="recordsModel"
      class="screenModel"
      :title="currentUser + '的操作记录'"
      width="900"
      :transfer="false"
      :mask-closable="false"
      >
        <Table :no-data-text="txt2" :columns="recordsColumns" :data="recordsData"></Table>
        <div slot="footer">
          <i-button class="xy-btn-primary" shape="circle" @click="recordsModel = false">关 闭</i-button>
        </div>
    </Modal>

  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'

  export default {
    name: 'TeacherRecordList',
    components: {
      XyAntTable
    },
    data () {
      return {
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
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
            title: '区间',
            dataIndex: 'SchoolAccessTimeSectionName',
            width: 120
          },
          {
            title: '入校时间',
            dataIndex: 'ArriveTime',
            width: 120
          },
          {
            title: '状态',
            width: 120,
            dataIndex: 'RecognitionModeStr'
          },
          {
            title: '操作',
            width: 150,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        tableData: [],
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
            this.pageIndex = 1
            this.pageSize = pageSize
          }
        },
        pageIndex: 1,
        pageSize: 15,
        total: 0,
        txt2: '您还没有操作记录的信息，请进行修改后查看。',
        areaRange: 0,
        state: 0,
        searchText: '',
        currentDate: '',
        schoolGradeClass_list: [], // 校区、年级、班级
        schoolGradeClass_value: ['', 0, 0], // 校区、年级、班级
        // tableData: [],
        timeSlotList: [],
        recordsColumns: [
          {
            title: '操作者',
            key: 'FullName',
            minWdith: 100
          },
          {
            title: '考勤方式',
            key: 'RecordTypeName'
          },
          {
            title: '修改时间',
            key: 'CreateByDate',
            width: 180
          },
          {
            title: '原状态',
            key: 'OldRecognitionModeName',
            width: 100
          },
          {
            title: '修改后状态',
            key: 'NewRecognitionModeName',
            width: 150
          }

        ],
        recordsData: [],
        attStateList: [],
        screenModel: false,
        recordsModel: false,
        currentState: 0,
        currentRow: {},
        date_range_options: {
          disabledDate: (date) => {
            return date.getTime() > new Date().getTime()
          }
        },
        currentUser: '',
        idArr: ''

      }
    },
    created () {
      this.apiPath = this.xyApi + '/att'
      this.currentDate = this.xy.moment().format('YYYY-MM-DD')
      this.currentWeek = this.changeChinesesWeek(this.xy.moment(this.currentDate).format('d'))
      this.getSections()
      this.getAttStatus()
    },
    computed: {
      isCurrentDay () {
        return this.xy.moment(this.currentDate).isSame(new Date(), 'day')
      }
    },
    methods: {
      handleTableChange () {
        this.getTableList()
      },
      changeChinesesWeek: function (num) {
        if (num < 1 || num > 6) { num = 0 }
        var listU = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        return listU[num]
      },
      // 搜索触发
      FromSubmit () {
        this.pageIndex = 1
        this.pagination.current = 1
        this.getTableList()
      },
      prevChange () {
        this.currentDate = this.xy.moment(this.currentDate).subtract(1, 'days').format('YYYY-MM-DD')
        this.currentWeek = this.changeChinesesWeek(this.xy.moment(this.currentDate).format('d'))
        this.reLoadTable()
      },
      nextChange () {
        this.currentDate = this.xy.moment(this.currentDate).add(1, 'days').format('YYYY-MM-DD')
        this.currentWeek = this.changeChinesesWeek(this.xy.moment(this.currentDate).format('d'))
        this.reLoadTable()
      },
      selectDate (value) {
        this.currentDate = this.xy.moment(value).format('YYYY-MM-DD')
        this.currentWeek = this.changeChinesesWeek(this.xy.moment(value).format('d'))
        this.reLoadTable()
      },

      modifyState: function (row) {
        this.screenModel = true
        this.currentRow = row
        this.currentState = row.RecognitionMode
      },
      seeOperateRecords (row) {
        this.recordsModel = true
        this.currentUser = row.FullName
        this.getTableRecordList(row)
      },

      reLoadTable: function (value) {
        this.pageIndex = 1
        this.pagination.current = 1
        this.$nextTick(() => {
          this.getTableList()
        })
      },
      // 导出
      allExport () {
        this.xy.downFile(
          `${this.$store.state.apiPath}/api/ProgrammeRecord/TeacherRecordReport`,
          {
            recognitionMode: this.state,
            sectionId: this.areaRange,
            userName: this.searchText,
            queryDate: this.currentDate
          }
        )
      },

      // 获取时间段
      async getSections () {
        let rs = await this.xy.get(this.apiPath + '/api/ProgrammeSetting/GetAllSection', null)
        if (rs.success) {
          this.timeSlotList = rs.data
        }
      },
      async modifyStatePost () {
        let row = this.currentRow
        if (this.currentState === 4 || this.currentState === 0) {
          this.xy.msgError('请选择考勤状态。')
          return false
        }
        var params = {
          SchoolAccessRecordTeacherID: row.SchoolAccessRecordTeacherID,
          RecognitionMode: this.currentState,
          OldRecognitionMode: row.RecognitionMode,
          UserId: row.UserId,
          SchoolAccessTimeSectionID: row.SchoolAccessTimeSectionID,
          queryDate: this.currentDate
        }
        let rs = await this.xy.post(this.apiPath + '/api/ProgrammeRecord/EditTeacherAttState', params)
        if (rs.success) {
          this.getTableList()
          this.screenModel = false
          this.xy.msgSuc('修改成功。')
        }
      },
      async getAttStatus () {
        let rs = await this.xy.get(this.apiPath + '/api/ProgrammeRecord/GetRecognitionMode')
        if (rs.success) {
          this.attStateList = rs.data
          this.getTableList()
        }
      },

      // 获取
      async getTableRecordList (row) {
        let params = {
          recordId: row.SchoolAccessRecordTeacherID
        }
        let rs = await this.xy.get(this.apiPath + '/api/ProgrammeRecord/GetTeacherEditAttLog', params)
        if (rs.success) {
          this.recordsData = rs.data
        }
      },

      async getTableList () {
        this.tableLoading = true
        let params = {
          recognitionMode: this.state,
          sectionId: this.areaRange,
          userName: this.searchText,
          queryDate: this.currentDate,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
        let rs = await this.xy.get(this.apiPath + '/api/ProgrammeRecord/GetTeacherRecordALSPage', params)
        if (rs.success) {
          this.tableData = rs.data.data
          this.total = rs.data.totalRecords
          this.pagination.total = rs.data.totalRecords
        }
        this.tableLoading = false
      }
    }
  }
</script>
<style lang="less">
  .attEnreanceExit {
    .table-header {
      padding: 0 10px;
    }
    background: #fff;
    .xy-content-title {
      margin-bottom: 0;
    }
    padding: 10px;
  }
  .title-top{
    width: 100%;
  }
.body-title {
    height: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #EAEAEA;
    position: relative;

    &.center {
      display: flex;
      justify-content: center;

      .exportFile {
        position: absolute;
        right: 20px;
        top: 6px;
      }
    }

    .calendar {
      position: relative;
      cursor: pointer;
      width: 182px;

      .showDate {
        position: absolute;
        left: 20px;
        right: 20px;
        top: 0;
        height: 32px;
        line-height: 32px;
        text-align: center;
      }

      .ivu-date-picker {
        width: 144px;

        .ivu-input-wrapper {
          opacity: 0;
        }
      }
    }
  }

</style>
