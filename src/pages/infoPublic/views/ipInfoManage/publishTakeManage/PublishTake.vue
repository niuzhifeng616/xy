<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between xy-center">
      <div></div>
      <div>
        <i-select
          v-model="takeType"
          @on-change="takeTypeChange"
          class="xy-content-title-search"
          placeholder="选择资源类型"
          style="width:150px"
        >
          <i-option
            v-for="item in takeTypeList"
            :value="item.Key"
            :key="item.Key"
            v-cloak
            >{{ item.Value }}</i-option
          >
        </i-select>
        <i-select
          v-model="takeState"
          @on-change="takeStateChange"
          class="xy-content-title-search"
          placeholder="选择任务状态"
          style="width:150px"
        >
          <i-option
            v-for="item in takeStateList"
            :value="item.Key"
            :key="item.Key"
            v-cloak
          >
            {{ item.Value }}
          </i-option>
        </i-select>
        <date-picker
          v-model="queryDate"
          type="daterange"
          @on-change="takeDateChange"
          style="margin-left:15px;"
          placeholder="选择查询日期"
          :editable="false"
        >
        </date-picker>
        <Input
          search
          v-model="searchText"
          @on-search="FromSubmit"
          placeholder="输入任务名称\具体内容\创建人\审批人"
          class="xy-content-title-search"
          style="width: auto;"
        />
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :scrollx="'max-content'"
        :columns="columns"
        :dataSource="tableData"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <span slot="Num" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span
          slot="PublishTaskName"
          slot-scope="text, record"
          style="min-width:158px;"
        >
          <span
            class="table-el-hover"
            v-if="
              record.PublishTaskStatus !== 3 &&
                record.PublishTaskStatus !== 4 &&
                record.PublishTaskStatus !== 5
            "
            @click="edit(record)"
          >
            {{ record.PublishTaskName }}
          </span>
          <span v-else>{{ record.PublishTaskName }}</span>
        </span>
        <span slot="LastModifyByDate" slot-scope="text, record">
          {{
            record.LastModifyByDate === null
              ? "--"
              : xy
                  .moment(new Date(record.LastModifyByDate))
                  .format("YYYY/MM/DD HH:mm")
          }}
        </span>
        <span slot="ApproveLastDate" slot-scope="text, record">
          {{
            record.ApproveLastDate === null || record.ApproveLastDate === ''
              ? "--"
              : xy
                  .moment(new Date(record.ApproveLastDate))
                  .format("YYYY/MM/DD HH:mm")
          }}
        </span>
        <span slot="ApproveUserName" slot-scope="text, record">
          {{ record.ApproveUserName === null ? "--" : record.ApproveUserName }}
        </span>
        <span slot="PublishTaskStatusName" slot-scope="text, record">
          {{
            record.PublishTaskStatusName ? record.PublishTaskStatusName : "--"
          }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a
            :disabled="
              !(
                record.PublishTaskStatus !== 3 &&
                record.PublishTaskStatus !== 4 &&
                record.PublishTaskStatus !== 5
              )
            "
            @click="edit(record)"
          >
            编辑
          </a>
          <a-divider type="vertical" />
          <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a
                  href="javascript:;"
                  @click="detailClick(record.PublishTaskID)"
                  >内容详情</a
                >
              </a-menu-item>
              <a-menu-item>
                <a
                  href="javascript:;"
                  @click="resultClick(record.PublishTaskID)"
                  >执行结果</a
                >
              </a-menu-item>
              <a-menu-item>
                <a
                  href="javascript:;"
                  :disabled="
                    !(
                      record.PublishTaskStatus === 2 ||
                      record.PublishTaskStatus === 3 ||
                      record.PublishTaskStatus === 5
                    )
                  "
                  @click="del(record)"
                >
                  撤销
                </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </XyAntTable>
    </div>
    <!-- 内容详情 -->
    <modal
      :styles="{ top: '20px', width: '900px' }"
      v-model="detailSee"
      :transfer="false"
      title="内容详情"
      :loading="loading"
      :mask-closable="false"
      :closable="true"
      v-cloak
    >
      <div class="dialog-model-content">
        <XyAntTable
          :isPage="false"
          :columns="detailColumns"
          :dataSource="detailDatatable"
          :tableLoading="detailLoading"
        >
          <span slot="StartDate" slot-scope="text, record">
            {{
              record.ResourceType === 8 || record.ResourceType === 9
                ? "--"
                : xy
                    .moment(new Date(record.StartDate))
                    .format("YYYY-MM-DD HH:mm")
            }}
          </span>
          <span slot="EndDate" slot-scope="text, record">
            {{
              record.ResourceType === 8 || record.ResourceType === 9
                ? "--"
                : xy.moment(new Date(record.EndDate)).format("YYYY-MM-DD HH:mm")
            }}
          </span>
        </XyAntTable>
      </div>
      <div slot="footer">
        <Button class="xy-modal-primary" shape="circle" @click="detailOk"
          >关闭</Button
        >
      </div>
    </modal>
    <!-- 执行结果详情 -->
    <modal
      v-model="resultSee"
      :styles="{ top: '20px', width: '1200px' }"
      :transfer="false"
      title="执行结果详情"
      :loading="loading"
      :mask-closable="false"
      :closable="true"
      v-cloak
    >
      <div class="dialog-model-content">
        <div style="margin-bottom:10px;">
          <i-select
            v-model="resultResult"
            @on-change="resultResultChange"
            class="xy-content-title-search"
            placeholder="选择发布结果"
            style="width:150px"
          >
            <i-option
              v-for="item in resultResultList"
              :value="item.Key"
              :key="item.Key"
              v-cloak
            >
              {{ item.Value }}
            </i-option>
          </i-select>
          <i-input
            search
            v-model="searchTextBan"
            @on-search="FromSubmitBan"
            placeholder="输入班牌名称"
            class="xy-content-title-search"
            style="width: auto;"
          >
            <icon type="ios-search cursor-p" slot="suffix" />
          </i-input>
        </div>
        <XyAntTable
          :tableStyle="resultMarginTop"
          :columns="resultColumns"
          :dataSource="resultDatatable"
          :tableLoading="taskLoading"
          :pagination="taskPagination"
          @change="resultHandleTableChange"
        >
          <span slot="Num" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <span slot="PublishCauseMsg" slot-scope="text, record">
            {{ record.PublishCauseMsg === "" ? "--" : record.PublishCauseMsg }}
          </span>
          <span slot="DownloadProgress" slot-scope="text, record">
            {{
              record.DownloadProgress === ""
                ? "--"
                : record.DownloadProgress + "%"
            }}
          </span>
          <span slot="DownloadCauseMsg" slot-scope="text, record">
            {{
              record.DownloadCauseMsg === "" ? "--" : record.DownloadCauseMsg
            }}
          </span>
          <span slot="DownloadDate" slot-scope="text, record">
            {{
              record.DownloadDate !== null
                ? "--"
                : xy
                    .moment(new Date(record.DownloadDate))
                    .format("YYYY-MM-DD HH:mm")
            }}
          </span>
          <span slot="RevokeName" slot-scope="text, record">
            {{ record.IsRevoke === 0 ? "--" : record.RevokeName }}
          </span>
        </XyAntTable>
      </div>
      <div slot="footer">
        <Button class="xy-modal-primary" shape="circle" @click="resultOk"
          >关闭</Button
        >
      </div>
    </modal>
    <!-- 编辑发布任务 -->
    <modal
      v-model="publicModal"
      :styles="{ top: '20px', width: '1000px' }"
      :transfer="false"
      title="编辑发布任务"
      :loading="loading"
      :mask-closable="false"
      :closable="true"
      @on-cancel="taskCancel"
      v-cloak
    >
      <i-form
        label-position="top"
        ref="formValidateTaskOK"
        :model="formValidateTaskOK"
        :rules="ruleValidateTaskOK"
      >
        <form-item label="任务名称" prop="publicName" labelFor="publicName">
          <i-input v-model="formValidateTaskOK.publicName" elementId="publicName" clearable></i-input>
        </form-item>
        <row>
          <i-col span="6" style="height: 352px;overflow:auto;">
            <tree :data="getTreeList" @on-select-change="selectTree"></tree>
          </i-col>
          <i-col
            span="9"
            style="height: 352px;overflow:auto;padding:0px 10px;border-right: 1px solid #ccc;"
          >
            <div>
              <checkbox
                v-for="(item, index) in tremianlArr"
                :key="index"
                size="large"
                v-model="item.checked"
                @on-change="changeCheckbox(item)"
                :disabled="
                  screenModes !== -1 && screenModes !== item.ScreenMode
                "
                >{{ item.ClassTerminalName }}({{
                  item.ScreenMode == 0
                    ? "横"
                    : item.ScreenMode == 1
                    ? "竖"
                    : ""
                }})</checkbox
              >
            </div>
          </i-col>
          <i-col span="9" style="padding:0px 10px;">
            <div
              style="padding-bottom:10px;margin-bottom: 5px;border-bottom:1px solid #eee;"
            >
              已选<b>{{ classTerminalIDs.length }}</b
              >个班牌
            </div>
            <div>
              <tag
                type="border"
                color="primary"
                v-for="(item, index) in classTerminalIDs"
                :key="index"
                :name="item.ClassTerminalId"
                closable
                @on-close="handleClose"
                >{{ item.ClassTerminalName }}</tag
              >
            </div>
          </i-col>
        </row>
      </i-form>
      <div slot="footer">
        <Button class="xy-modal-close" @click="taskCancel">关闭</Button>
        <Button class="xy-modal-primary" shape="circle" @click="taskOk"
          >发布</Button
        >
      </div>
    </modal>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'PublishTake',
    components: {
      XyAntTable
    },
    data () {
      return {
        saveDefaultdata: [],
        resultMarginTop: {
          marginTop: '20px'
        },
        tableLoading: true,
        detailLoading: true,
        taskLoading: true,
        nullData: '该搜索条件下没有结果。',
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: current => {
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
        taskPagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: current => {
            this.taskPagination.current = current
            this.resultPageCurrent = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.taskPagination.current = 1
            this.taskPagination.pageSize = pageSize
            this.resultPageCurrent = 1
            this.resultPageSize = pageSize
          }
        },
        // 默认数据
        isEmpty: false, // 数据是否为空
        isInitial: true,
        loading: true,
        // 是否发布
        isRelease: true,
        // 查看窗口
        takeSee: false,
        // 搜索
        searchText: '',
        // 数据发布类型
        takeTypeList: [],
        // 数据审批状态
        takeStateList: [],
        // 数据类型
        takeType: 0,
        // 数据状态
        takeState: 0,
        // 查询日期
        queryDate: [],
        tableData: [],
        total: 0,
        pageSize: 15,
        pageIndex: 1,
        columns: [
          {
            title: '序号',
            width: 70,
            scopedSlots: { customRender: 'Num' }
          },
          {
            title: '名称',
            dataIndex: 'PublishTaskName',
            scopedSlots: { customRender: 'PublishTaskName' }
          // minWidth: 190,
          },
          {
            title: '内容类型',
            dataIndex: 'PublishTaskTypeName',
            width: 100
          },
          {
            title: '操作时间',
            width: 150,
            dataIndex: 'LastModifyByDate',
            scopedSlots: { customRender: 'LastModifyByDate' }
          },
          {
            title: '操作人',
            dataIndex: 'FullName',
            width: 120
          },
          {
            title: '审批时间',
            width: 150,
            dataIndex: 'ApproveLastDate',
            scopedSlots: { customRender: 'ApproveLastDate' }
          },
          {
            title: '审批人',
            dataIndex: 'ApproveUserName',
            width: 120,
            scopedSlots: { customRender: 'ApproveUserName' }
          },
          {
            title: '审批状态',
            dataIndex: 'PublishTaskStatusName',
            width: 100,
            scopedSlots: { customRender: 'PublishTaskStatusName' }
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 140,
            scopedSlots: { customRender: 'action' }
          }
        ],
        // 内容详情
        detailSee: false,
        detailColumns: [
          {
            title: '任务类型',
            dataIndex: 'ResourceTypeName'
          },
          {
            title: '名称',
            dataIndex: 'ResourceTitle'
          },
          {
            title: '开始时间',
            dataIndex: 'StartDate',
            scopedSlots: { customRender: 'StartDate' }
          },
          {
            title: '结束时间',
            dataIndex: 'EndDate',
            scopedSlots: { customRender: 'EndDate' }
          }
        ],
        detailDatatable: [],
        // 执行结果详情
        resultSee: false,
        resultResult: -1,
        PublishTaskID: '',
        resultResultList: [],
        resultColumns: [
          {
            title: '序号',
            width: 70,
            scopedSlots: { customRender: 'Num' }
          },
          {
            title: '班牌分组',
            dataIndex: 'ClassTerminalGroupName'
          },
          {
            title: '班牌',
            dataIndex: 'ClassTerminalName'
          },
          {
            title: '发布结果',
            dataIndex: 'PublishStatusName'
          },
          {
            title: '发布失败原因',
            dataIndex: 'PublishCauseMsg',
            scopedSlots: { customRender: 'PublishCauseMsg' }
          },
          {
            title: '下载进度',
            dataIndex: 'DownloadProgress',
            Slots: { customRender: 'DownloadProgress' }
          },
          {
            title: '下载失败原因',
            dataIndex: 'DownloadCauseMsg',
            Slots: { customRender: 'DownloadCauseMsg' }
          },
          {
            title: '下载开始时间',
            dataIndex: 'DownloadDate',
            Slots: { customRender: 'DownloadDate' }
          },
          {
            title: '是否已撤销',
            dataIndex: 'RevokeName',
            Slots: { customRender: 'RevokeName' }
          },
          {
            title: '班牌状态',
            dataIndex: 'IsOnLineName'
          }
        ],
        resultDatatable: [],
        searchTextBan: '',
        // resultPageSize: xy.table.pageSize, // 每页显示条数
        // resultPages: xy.table.pages,
        resultPageSize: 15, // 每页显示条数
        resultPageCurrent: 1, // 当前页码
        resultPageList: 0, // 当前页数据条数
        // 新建发布任务---开始
        taskCreate: false,
        // 班牌列表
        banCont: false,
        banRight: false,
        classBrandList: [],
        formValidateTaskOK: {
          publicName: ''
        },
        ruleValidateTaskOK: {
          publicName: [
            { required: true, message: '任务名称不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 20,
              message: '任务名称不能超过20个字',
              trigger: 'blur'
            }
          ]
        },
        taskSearch: '',
        brandShow: 0,
        classBrandShow: false,
        showBanBox: '',
        showBanList: [],
        banClass: '',
        boxList: [],
        taskArrList: [],
        taskList: '',
        PublicTaskList: '',
        // 新建发布任务---结束
        publicModal: false,
        getTreeList: [
          {
            title: '全部分组',
            expand: true,
            ParentID: -1,
            ClassTerminalGroupID: 0,
            selected: true,
            TreminalS: [],
            children: []
          }
        ],
        tremianlArr: [],
        classTerminalIDs: [],
        publicName: '',
        screenModes: -1,
        apiPath: ''
      }
    },
    watch: {
      // 设置全部分组数据
      // saveDefaultdata (newValue) {
      //   this.tremianlArr = []
      //   this.getTreeList[0].TreminalS = []
      //   for (var i = 0; i < newValue.length; i++) {
      //     for (var j = 0; j < newValue[i].length; j++) {
      //       this.getTreeList[0].TreminalS.push(newValue[i][j])
      //       // 默认显示全部班牌
      //       // 屏保管理判断横版下竖版置灰竖版下横置灰
      //       if (
      //         this.screenModes !== 'undefined' &&
      //         this.screenModes === 0 &&
      //         newValue[i][j].ScreenMode === 1
      //       ) {
      //         newValue[i][j].disabled = true
      //       } else if (
      //         this.screenModes !== 'undefined' &&
      //         this.screenModes === 1 &&
      //         newValue[i][j].ScreenMode === 0
      //       ) {
      //         newValue[i][j].disabled = true
      //       }
      //       this.tremianlArr.push(newValue[i][j])
      //     }
      //   }
      //   for (let j = 0; j < this.classTerminalIDs.length; j++) {
      //     let all1 = this.tremianlArr
      //       .map(function (val) {
      //         return val.ClassTerminalId
      //       })
      //       .indexOf(this.classTerminalIDs[j].ClassTerminalId)
      //     if (all1 !== -1) {
      //       this.tremianlArr[j].checked = true
      //     }
      //   }
      // }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.GetResourceType()
      this.GetPublicTaskStatus()
      // this.getTree()
    },
    mounted () {
      this.$nextTick(function () {
        this.loadTable()
      })
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      resultHandleTableChange () {
        this.GetPublicTaskInfoByPage()
      },
      //  获取table分页数据
      async loadTable () {
        this.tableLoading = true
        let params = {
          PageIndex: this.pageIndex,
          PageSize: this.pageSize,
          PublishTaskType: this.takeType,
          PublishTaskStatus: this.takeState,
          SearchText: this.searchText,
          BeginDate: this.queryDate[0],
          EndDate: this.queryDate[1]
        }
        let res = await this.xy.get(
          this.apiPath + '/api/PublicTask/GetPublicTaskByPage',
          params
        )
        this.tableLoading = false
        if (res.success) {
          this.tableData = res.data.data
          this.pagination.total = res.data.totalRecords
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 获取所有资源类型
      async GetResourceType () {
        let res = await this.xy.get(
          this.apiPath + '/api/PublicTask/GetResourceType'
        )
        this.isInitial = false
        if (res.success) {
          if (res.data != null) {
            this.takeTypeList = res.data
            if (this.takeTypeList.length > 0) {
              this.takeType = this.takeTypeList[0].Key
            }
          } else {
            this.isEmpty = true
            this.xy.msgError(res.msg)
          }
        } else {
          this.isEmpty = true
        }
      },
      // 获取所有任务状态
      async GetPublicTaskStatus () {
        let res = await this.xy.get(
          this.apiPath + '/api/PublicTask/GetPublicTaskStatus'
        )
        this.isInitial = false
        if (res.success) {
          if (res.data != null) {
            this.takeStateList = res.data
            if (this.takeStateList.length > 0) {
              this.takeState = this.takeStateList[0].Key
            }
          } else {
            this.isEmpty = true
            this.xy.msgError(res.msg)
          }
        } else {
          this.isEmpty = true
        }
      },
      // 直接发布任务---------该功能未开发
      async Release (id, name) {
        this.$Modal.confirm({
          title: '发布',
          content: '<p>您确认要发布"' + name + '"吗？</p>',
          onOk: () => {
            this.xy.loading()
            this.modal_loading = true
            this.xy
              .post(this.apiPath + `/api/AcademicYear/Delete?yearId=` + id)
              .then(res => {
                if (this.pageList > 1) {
                  this.pageList = this.pageList - 1
                } else {
                  if (this.pageCurrent > 1) {
                    this.pageCurrent = this.pageCurrent - 1
                  }
                }
                if (res.success) {
                  this.xy.msgSuc('发布成功')
                } else {
                  this.xy.msgError(res.msg)
                }
                this.xy.unloading()
                this.modal_loading = false
              })
          }
        })
      },
      // 单击删除发布任务
      // 撤销
      async del (row) {
        let tipContent = ''
        if (row.PublishTaskType === 8 || row.PublishTaskType === 9) {
          tipContent = '<p>撤销后此控件将无显示内容，确定要撤销吗？</p>'
        } else {
          tipContent = '<p>确定要撤销吗？</p>'
        }
        this.$Modal.confirm({
          title: '撤销',
          content: tipContent,
          onOk: () => {
            this.xy.loading()
            this.modal_loading = true
            this.xy
              .post(
                this.apiPath +
                  `/api/PublicTask/RevokePublicTaskStatus?id=` +
                  row.PublishTaskID
              )
              .then(res => {
                if (res.success) {
                  this.xy.msgSuc('撤销成功！')
                  this.pageIndex = 1
                  this.pagination.current = 1
                  this.loadTable()
                } else {
                  this.xy.msgError(res.Errmsg)
                }
                this.xy.unloading()
              })
          }
        })
      },
      FromSubmit (val) {
        this.SearchText = val
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      // 筛选任务类型
      takeTypeChange (val) {
        this.PublishTaskType = val
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      // 筛选任务状态
      takeStateChange (val) {
        this.PublishTaskStatus = val
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      // 筛选任务时间
      takeDateChange (val) {
        this.queryDate = val
        this.queryDate[0] =
          this.queryDate[0] === ''
            ? ''
            : this.xy.moment(new Date(this.queryDate[0])).format('YYYY-MM-DD')
        this.queryDate[1] =
          this.queryDate[1] === ''
            ? ''
            : this.xy.moment(new Date(this.queryDate[1])).format('YYYY-MM-DD')
        this.BeginDate = this.queryDate[0]
        this.EndDate = this.queryDate[1]
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      // 查看列表中---内容详情
      async detailClick (ids) {
        this.detailLoading = true
        let res = await this.xy.get(
          this.apiPath + '/api/PublicTask/GetPublicTaskByID',
          {
            id: ids
          }
        )
        this.detailLoading = false
        this.isInitial = false
        if (res.success) {
          if (res.data != null) {
            this.detailDatatable = res.data.PublischTaskDetails
            this.detailSee = true
          } else {
            this.isEmpty = true
            this.xy.msgError(res.msg)
          }
        } else {
          this.isEmpty = true
        }
      },
      detailOk () {
        this.detailSee = false
      },
      // 查看列表中---执行结果详情
      resultClick (ids) {
        this.taskPagination.current = 1
        this.resultPageCurrent = 1
        this.resultSee = true
        this.PublishTaskID = ids
        this.GetPublicTaskResult()
        this.GetPublicTaskInfoByPage()
      },
      resultOk () {
        this.resultSee = false
      },
      async GetPublicTaskResult () {
        let res = await this.xy.get(
          this.apiPath + '/api/PublicTask/GetPublicTaskResult'
        )
        if (res.success) {
          if (res.data != null) {
            this.resultResultList = res.data
            this.resultResult = this.resultResultList[0].Key
          } else {
            this.isEmpty = true
          }
        } else {
          this.isEmpty = true
          this.xy.msgError(res.msg)
        }
      },
      // 获取执行结果详情列表
      async GetPublicTaskInfoByPage () {
        this.taskLoading = true
        let res = await this.xy.get(
          this.apiPath + '/api/PublicTask/GetPublicTaskInfoByPage',
          {
            PublishTaskID: this.PublishTaskID,
            SearchText: this.searchTextBan,
            PageIndex: this.resultPageCurrent,
            PageSize: this.resultPageSize,
            PublishStatus: this.resultResult
          }
        )
        this.taskLoading = false
        this.isInitial = false
        if (res.success) {
          this.resultDatatable = res.data.data
          this.taskPagination.total = res.data.totalRecords
        } else {
          this.isEmpty = true
          this.xy.msgError(res.msg)
        }
      },
      // 获取执行结果详情列表---筛选
      resultResultChange (val) {
        this.resultResult = val
        this.taskPagination.current = 1
        this.resultPageCurrent = 1
        this.GetPublicTaskInfoByPage()
      },
      // 获取执行结果详情列表---搜索
      FromSubmitBan (val) {
        this.taskPagination.current = 1
        this.resultPageCurrent = 1
        this.searchTextBan = val
        this.GetPublicTaskInfoByPage()
      },
      // 提交创建时触发
      changeLoading () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      // 发布到指定班牌---新建发布任务---开始
      edit (item) {
        // this.saveDefaultdata = []
        // this.getTree()
        this.taskList = item.PublishTaskID
        this.formValidateTaskOK.publicName = item.PublishTaskName
        this.GetPublicTaskByID(item.PublishTaskID)
      },
      // 根据ID获取发布的数据
      async GetPublicTaskByID (ids) {
        // this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + '/api/PublicTask/GetPublicTaskByID',
          {
            id: ids
          }
        )
        // this.xy.unloading()
        this.isInitial = false
        if (res.success) {
          if (res.data !== null) {
            if (res.data.PublishTaskType === 11) {
              // 发布欢迎
              this.screenModes = res.data.ScreenMode // 横竖版
            } else {
              this.screenModes = -1
            }
            if (res.data.ClassTerminalID.length > 0) {
              for (let i = 0; i < res.data.ClassTerminalID.length; i++) {
                this.classTerminalIDs.push({
                  ClassTerminalId: res.data.ClassTerminalID[i],
                  ClassTerminalName: res.data.ClassTerminalName[i]
                })
              }
            } else {
              this.classTerminalIDs = []
            }
          } else {
            this.xy.msgError(res.msg)
          }
          this.getTree()
          this.publicModal = true
        } else {
          this.isEmpty = true
          this.xy.msgError(res.msg)
        }
      },
      async getTree () {
        let res = await this.xy.get(
          this.apiPath + '/api/ClassTerminalGroup/GetTreminalTree'
        )
        this.isInitial = false
        if (res.success) {
          if (res.data.length > 0) {
            let resData = res.data
            for (var i = 0; i < resData.length; i++) {
              for (var j = 0; j < resData[i].TreminalS.length; j++) {
                this.getTreeList[0].TreminalS.push(resData[i].TreminalS[j])
                // 默认显示全部班牌
                // 屏保管理判断横版下竖版置灰竖版下横置灰
                if (
                  this.screenModes !== 'undefined' &&
                  this.screenModes === 0 &&
                  resData[i].TreminalS[j].ScreenMode === 1
                ) {
                  resData[i].TreminalS[j].disabled = true
                } else if (
                  this.screenModes !== 'undefined' &&
                  this.screenModes === 1 &&
                  resData[i].TreminalS[j].ScreenMode === 0
                ) {
                  resData[i].TreminalS[j].disabled = true
                }
                let all1 = this.classTerminalIDs.map(val => {
                  return val.ClassTerminalId
                }).indexOf(resData[i].TreminalS[j].ClassTerminalId)
                if (all1 !== -1) {
                  this.$set(resData[i].TreminalS[j], 'checked', true)
                }
                this.tremianlArr.push(resData[i].TreminalS[j])
              }
            }
            this.getTreeList[0].children = resData
            // this.setTreeData(res.data)
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // setTreeData (data) {
      //   for (var i = 0; i < data.length; i++) {
      //     if (data[i].TreminalS.length > 0) {
      //       this.saveDefaultdata.push(data[i].TreminalS)
      //     }
      //     if (data[i].children.length > 0) {
      //       this.setTreeData(data[i].children)
      //     }
      //   }
      // },
      selectTree (val) {
        this.tremianlArr = []
        if (val.length === 0) {
          return
        }
        if (val[0].TreminalS.length > 0) {
          this.tremianlArr = val[0].TreminalS
          this.tremianlArr.map(function (val) {
            val.checked = false
            return val
          })
          for (let j = 0; j < this.classTerminalIDs.length; j++) {
            let all1 = this.tremianlArr
              .map(function (val) {
                return val.ClassTerminalId
              })
              .indexOf(this.classTerminalIDs[j].ClassTerminalId)
            if (all1 !== -1) {
              this.tremianlArr[all1].checked = true
            }
          }
        }
      },
      changeCheckbox (vals) {
        let obj = {
          ClassTerminalId: vals.ClassTerminalId,
          ClassTerminalName: vals.ClassTerminalName
        }
        if (vals.checked) {
          this.classTerminalIDs.push(obj)
        } else {
          for (let i = 0; i < this.classTerminalIDs.length; i++) {
            if (
              this.classTerminalIDs[i].ClassTerminalId === vals.ClassTerminalId
            ) {
              this.classTerminalIDs.splice(i, 1)
            }
          }
        }
      },
      handleClose (e, id) {
        for (let i = 0; i < this.classTerminalIDs.length; i++) {
          if (this.classTerminalIDs[i].ClassTerminalId === id) {
            for (let j = 0; j < this.tremianlArr.length; j++) {
              if (this.tremianlArr[j].ClassTerminalId === id) {
                this.tremianlArr[j].checked = false
              }
            }
            this.classTerminalIDs.splice(i, 1)
          }
        }
      },
      // 确定
      taskOk () {
        let that = this
        if (this.classTerminalIDs.length < 1) {
          that.xy.msgError('请勾选班牌后再发布')
          that.changeLoading()
          return false
        }
        let newArrs = []
        for (let i = 0; i < this.classTerminalIDs.length; i++) {
          newArrs.push(this.classTerminalIDs[i].ClassTerminalId)
        }
        this.$refs.formValidateTaskOK.validate(valid => {
          if (!valid) {
            return that.changeLoading()
          } else {
            that.EditPublicTask(newArrs)
          }
        })
      },
      async EditPublicTask (newArrs) {
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + '/api/PublicTask/EditPublicTask',
          {
            PublishTaskName: $.trim(this.formValidateTaskOK.publicName),
            ClassTerminalID: newArrs,
            PublishTaskID: this.taskList
          }
        )
        this.xy.unloading()
        this.isInitial = false
        if (res.success) {
          this.xy.msgSuc('编辑成功！')
          this.loadTable()
        } else {
          this.xy.mError('编辑失败', res.Errmsg)
        }
        this.publicModal = false
        this.tremianlArr = [] // 中间空
        this.classTerminalIDs = [] // 右侧空
        this.$refs.formValidateTaskOK.resetFields()
        this.publicName = ''
        this.changeLoading()
      },
      // 取消
      taskCancel () {
        this.publicName = ''
        this.tremianlArr = [] // 中间空
        this.classTerminalIDs = [] // 右侧空
        this.publicModal = false
        this.$refs.formValidateTaskOK.resetFields()
      },
      // 显示所有班牌
      brandRadioBtn: function () {
        if (this.brandShow === 0) {
        // 显示所有班牌
        } else {
          // 显示已选择班牌
          if (this.classBrand.length > 0) {
            this.classBrandShow = false
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped></style>
