<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between xy-center">
      <div></div>
      <div>
        <DatePicker
          v-model="queryDate"
          type="daterange"
          @on-change="newDateChange"
          placeholder="选择查询日期"
          v-bind:editable="false"
          >
        </DatePicker>
        <span class="input-label xy-content-title-search">内容类型：</span>
        <Select v-model="takeType"
          @on-change="informTypeChange"
          placeholder="选择内容类型"
          style="width:150px"
          >
          <Option v-for="item in takeTypeList" v-bind:value="item.Key" v-bind:key="item.Key">{{ item.Value }}</Option>
        </Select>
        <span class="input-label xy-content-title-search">审批状态：</span>
        <Select
          v-model="takeState"
          @on-change="informColorChange"
          placeholder="选择审批状态"
          style="width:150px"
          >
          <Option
            v-for="item in takeStateList"
            v-bind:value="item.Key"
            v-bind:key="item.Key">
            {{ item.Value }}
          </Option>
        </Select>
        <Input
          search
          v-model="searchText"
          style="width:260px"
          @on-search="FromSubmit"
          placeholder="任务名称\具体内容\创建人\审批人"
          class="xy-content-title-search"
          />
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :columns="columns"
        :dataSource="columnsData"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        >
        <span slot="Num" slot-scope="text, record, index">
          {{index+1}}
        </span>
        <div slot="PublishTaskName" class="table-el-hover" style="min-width:158px" slot-scope="text, record" @click="see(record.PublishTaskType, record)">
          {{record.PublishTaskName}}
        </div>
        <span slot="LastModifyByDate" slot-scope="text, record">
          {{record.LastModifyByDate === null ? '--' : xy.moment(record.LastModifyByDate).format('YYYY-MM-DD HH:mm')}}
        </span>
        <span slot="ApproveLastDate" slot-scope="text, record">
          {{record.ApproveLastDate == null || record.ApproveLastDate == '' ? '--' : xy.moment(record.ApproveLastDate).format('YYYY-MM-DD HH:mm')}}
        </span>
        <span slot="ApproveUserName" slot-scope="text, record">
          {{record.ApproveUserName == null ? '--' : record.ApproveUserName}}
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="see(record.PublishTaskType, record)">详情</a>
          <a-divider type="vertical" />
          <a :disabled="record.PublishTaskStatus !== 2" @click="approval(record.PublishTaskType, record)">编辑</a>
        </span>
      </XyAntTable>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'ApprovalList',
    components: {
      XyAntTable
    },
    data () {
      return {
        nullData: '该搜索条件下没有结果。',
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
            this.pageIndex = 1
            this.pageSize = pageSize
          }
        },
        columnsData: [],
        pageSize: 15,
        pageIndex: 1,
        seachText: '',
        // 搜索
        searchText: '',
        columns: [
          {
            title: '序号',
            width: 70,
            scopedSlots: { customRender: 'Num' }
          },
          {
            title: '任务名称',
            dataIndex: 'PublishTaskName',
            scopedSlots: { customRender: 'PublishTaskName' }
          },
          {
            title: '内容类型',
            dataIndex: 'PublishTaskTypeName',
            width: 100
          },
          {
            title: '操作时间',
            dataIndex: 'LastModifyByDate',
            width: 160,
            scopedSlots: { customRender: 'LastModifyByDate' }
          },
          {
            title: '操作人',
            dataIndex: 'FullName',
            width: 120
          },
          {
            title: '审批时间',
            width: 160,
            dataIndex: 'ApproveLastDate',
            scopedSlots: { customRender: 'ApproveLastDate' }
          },
          {
            title: '审批人',
            width: 120,
            dataIndex: 'ApproveUserName',
            scopedSlots: { customRender: 'ApproveUserName' }
          },
          {
            title: '状态',
            width: 100,
            dataIndex: 'PublishTaskStatusName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            width: 120
          }
        ],
        // 获取内容类型
        takeTypeList: [],
        // 获取状态类型
        takeStateList: [],
        // 数据类型
        takeType: 0,
        // 数据状态
        takeState: 0,
        // 日期
        queryDate: [],
        // 新闻类型ID
        informTypeID: 0,
        // 字体颜色ID
        informColorID: 0
      }
    },
    // 消息
    beforeRouteEnter (to, from, next) {
      if (from.name === 'Message') {
        next(vm => {
          let msg = JSON.parse(vm.$store.state.common.msgParam)
          let DetailParameter = JSON.parse(msg.DetailParameter)
          DetailParameter.PublishTaskName = msg.Subject
          let type = null
          switch (Number(DetailParameter.PublishTaskType)) {
            case 8:// 视频
              type = 'ApprovalVideo'
              break
            case 9:// 照片
              type = 'ApprovalPhoto'
              break
            case 7:// 通知
              type = 'ApprovalNotice'
              break
            case 10:// 新闻
              type = 'ApprovalNews'
              break
            case 11:// 欢迎
              type = 'ApprovalWelcome'
              break
            case 29:// 屏保
              type = 'ApprovalScreenSaver'
              break
          }
          let datas = {
            row: JSON.stringify(DetailParameter),
            type: msg.Subject === '班牌信息发布任务申请' ? 2 : 1
          }
          vm.$router.push({
            path: `/xyHome/IpApproval/${type}`,
            query: datas
          })
        })
      } else {
        next()
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.getTableList()
      this.GetResourceType()
      this.GetPublicTaskStatus()
    },
    methods: {
      handleTableChange () {
        this.getTableList()
      },
      async getTableList () {
        this.tableLoading = true
        let params = {
          PageIndex: this.pageIndex,
          PageSize: this.pageSize,
          SearchText: this.searchText,
          PublishTaskType: this.takeType,
          PublishTaskStatus: this.takeState
        }
        if (this.queryDate[0]) {
          params = Object.assign(params, {
            BeginDate: this.queryDate[0],
            EndDate: this.queryDate[1]
          })
        }
        let res = await this.xy.get(this.apiPath + '/api/PublicTask/GetPublicApproveByPage', params)
        if (res.success) {
          this.columnsData = res.data.data
          this.pagination.total = res.data.totalRecords
        }
        this.tableLoading = false
      },
      // 搜索触发
      FromSubmit () {
        this.pagination.current = 1
        this.pageIndex = 1
        this.getTableList()
      },
      typeValueSearch () {
        this.pagination.current = 1
        this.pageIndex = 1
        this.getTableList()
      },
      // 获取所有资源类型
      async GetResourceType () {
        let rs = await this.xy.get(this.apiPath + '/api/PublicTask/GetResourceType')
        if (rs.success) {
          this.takeTypeList = rs.data
          if (this.takeTypeList.length > 0) {
            this.takeType = this.takeTypeList[0].Key
          }
        }
      },
      // 获取所有任务状态
      async GetPublicTaskStatus () {
        let rs = await this.xy.get(this.apiPath + '/api/PublicTask/GetPublicTaskStatus')
        if (rs.success) {
          this.takeStateList = rs.data
          if (this.takeStateList.length) {
            this.takeState = this.takeStateList[0].Key
          }
        }
      },

      // 筛选任务类型
      informTypeChange (val) {
        this.pagination.current = 1
        this.pageIndex = 1
        this.getTableList()
      },
      // 选择审批状态
      informColorChange (val) {
        this.pagination.current = 1
        this.pageIndex = 1
        this.getTableList()
      },
      // 筛选日期
      newDateChange () {
        this.pagination.current = 1
        this.pageIndex = 1
        this.getTableList()
      },
      // 审批设置
      approval (InType, item) {
        // 需要判断Type类型来选择打开哪种类型的审批任务
        let type
        switch (InType) {
          case 8:// 视频
            type = 'ApprovalVideo'
            break
          case 9:// 照片
            type = 'ApprovalPhoto'
            break
          case 7:// 通知
            type = 'ApprovalNotice'
            break
          case 10:// 新闻
            type = 'ApprovalNews'
            break
          case 11:// 欢迎
            type = 'ApprovalWelcome'
            break
          case 29:// 屏保
            type = 'ApprovalScreenSaver'
            break
        }
        let datas = {
          row: JSON.stringify(item),
          type: 2
        }
        this.$store.commit('common/getThreeMenuName', item.PublishTaskName)
        this.$store.commit('common/getParam', datas)
        this.$router.push({
          path: `/xyHome/IpApproval/${type}`,
          query: this.$store.state.common.menuInfo
        })
      },
      // 查看
      see (InType, item) {
        let type
        switch (InType) {
          case 8:// 视频
            type = 'ApprovalVideo'
            break
          case 9:// 照片
            type = 'ApprovalPhoto'
            break
          case 7:// 通知
            type = 'ApprovalNotice'
            break
          case 10:// 新闻
            type = 'ApprovalNews'
            break
          case 11:// 欢迎
            type = 'ApprovalWelcome'
            break
          case 29:// 屏保
            type = 'ApprovalScreenSaver'
            break
        }
        let datas = {
          row: JSON.stringify(item),
          type: 1
        }
        this.$store.commit('common/getThreeMenuName', item.PublishTaskName)
        this.$store.commit('common/getParam', datas)
        this.$router.push({
          path: `/xyHome/IpApproval/${type}`,
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>
<style lang="less" scpoed>
  .table-wrap {
    background: #ffffff;

    .table-header {
      padding: 10px;
    }
  }

</style>
