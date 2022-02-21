<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between">
      <div style="margin: 8px 0 0 5px;" class="fl">
        <RadioGroup v-model="radioVal" v-if="showRadio" @on-change="changeTableType">
          <Radio label="all">
            <span>全部</span>
          </Radio>
          <Radio label="mine">
            <span>我的审批</span>
          </Radio>
        </RadioGroup>
      </div>
      <div>
        拜访时间：
        <DatePicker
          class="mr-10"
          style="width:200px"
          :value="dateVal"
          @on-change="changeDate"
          format="yyyy/MM/dd"
          type="date"
          placeholder="请选择拜访时间"
        >
        </DatePicker>
        状态：
        <Select v-model="RecruittypeID" @on-change="typeValueSearch" style="width:200px;" class="mr-10">
          <Option v-for="item in Recruittype" :value="item.Status" :key="item.Status">
            {{ item.StatusName }}
          </Option>
        </Select>
        <Input style="width:200px" search v-model="seachText" @on-search="FromSubmit" :placeholder="radioVal === 'all'?'请输入访客/访客手机号':'请输入访客/访客手机号'"/>
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :columns="columns"
        :dataSource="dataList"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scrollx="'max-content'"
        :scrolly="true"
      >
      <!-- 点击全部审批 -->
       <!-- 审批人 -->
         <div slot="allInterviewName" slot-scope="text,record" style="min-width:80px">
            <span class="table-el-hover" @click="goDetail(record)">
              {{record.InterviewName}}
            </span>
          </div>
           <!-- 审批人手机号码 -->
          <div slot="allInterviewPhoneNumber" slot-scope="text,record" style="min-width:140px" >
            <span>
              {{record.InterviewPhoneNumber}}
            </span>
          </div>
          <!-- 访客 -->
          <div slot="allVisitorName" slot-scope="text,record" style="min-width:80px">
            <span>
              {{record.VisitorName}}
            </span>
          </div>
          <!-- 访客手机号 -->
          <div slot="allVisitorPhoneNumber" slot-scope="text,record" style="min-width:140px"  >
            <span>
              {{record.VisitorPhoneNumber}}
            </span>
          </div>
          <!-- 预约拜访时间 -->
          <div slot="allApplicationVisitTimeStr" slot-scope="text,record" style="min-width:180px" >
            <span>
              {{record.ApplicationVisitTimeStr}}
            </span>
          </div>

      <!-- 获取我的审批  -->
          <!-- 访客 -->
           <div slot="VisitorName" slot-scope="text,record" style="min-width:88px">
            <span  class="table-el-hover" @click="goDetail(record)">
              {{record.VisitorName}}
            </span>
          </div>
          <!-- 手机号 -->
          <div slot="VisitorPhoneNumber" slot-scope="text,record" style="min-width:200px">
            <span>
              {{record.VisitorPhoneNumber}}
            </span>
          </div>
          <!-- 预约拜访时间 -->
           <div slot="ApplicationVisitTimeStr" slot-scope="text,record" style="min-width:220px">
            <span>
              {{record.ApplicationVisitTimeStr}}
            </span>
          </div>
          <!-- 状态值 -->
          <span slot="ApprovalStatusName" slot-scope="text, record">
          <span v-if="record.ApprovalStatus===1 && record.VisitStatus!==7"><i class="iconfont icon-info">&#xe719;</i>{{record.ApprovalStatusName}}</span>
          <span v-if="record.VisitStatus===5 && record.ApprovalStatus===2"><i class="iconfont icon-success">&#xe719;</i>{{record.ApprovalStatusName}}</span>
          <span v-if="record.VisitStatus===7 || record.ApprovalStatus===3"><i class="iconfont icon-error">&#xe719;</i>{{record.ApprovalStatusName}}</span>
          <span v-if="record.VisitStatus===6"><i class="iconfont icon-wran">&#xe719;</i>{{record.ApprovalStatusName}}</span>
          </span>
          <!-- 操作 -->
          <span slot="operation" slot-scope="text, record">
            <a @click="goDetail(record)">详情</a>
          </span>
      </XyAntTable>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'

  export default {
    name: 'VisitManageList',
    components: {
      XyAntTable
    },
    data () {
      return {
        showRadio: true,
        radioVal: 'all',
        total: 0,
        pageSize: 15,
        pageIndex: 1,
        seachText: '',
        dateVal: '',
        RecruittypeID: 0,
        Recruittype: [],
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
        columns: [
          {
            title: '审批人',
            dataIndex: 'InterviewName',
            scopedSlots: { customRender: 'allInterviewName' }
          },
          {
            title: '审批人手机号码',
            dataIndex: 'InterviewPhoneNumber',
            scopedSlots: { customRender: 'allInterviewPhoneNumber' }
          },
          {
            title: '访客',
            dataIndex: 'VisitorName',
            scopedSlots: { customRender: 'allVisitorName' }
          },
          {
            title: '访客手机号',
            dataIndex: 'VisitorPhoneNumber',
            scopedSlots: { customRender: 'allVisitorPhoneNumber' }
          },
          {
            title: '预约拜访时间',
            dataIndex: 'allApplicationVisitTimeStr',
            scopedSlots: { customRender: 'allApplicationVisitTimeStr' }
          },
          {
            title: '出入校时间',
            dataIndex: 'VisitInOutTime',
            scopedSlots: { customRender: 'VisitInOutTime' }
          },
          {
            title: '状态',
            dataIndex: 'ApprovalStatusName',
            width: 100,
            scopedSlots: { customRender: 'ApprovalStatusName' }
          },
          {
            title: '操作',
            dataIndex: '04',
            width: 80,
            scopedSlots: { customRender: 'operation' }
          }

        ],
        dataList: []
      }
    },
    created () {
      console.log(this.$store.state.common.userBaseInfo.Admin)
      if (!this.$store.state.common.userBaseInfo.Admin) {
        this.showRadio = false
        this.columns = [
          {
            title: '访客',
            dataIndex: 'VisitorName',
            scopedSlots: { customRender: 'VisitorName' }
          },
          {
            title: '手机号码',
            dataIndex: 'VisitorPhoneNumber',
            scopedSlots: { customRender: 'VisitorPhoneNumber' }
          },
          {
            title: '预约拜访时间',
            dataIndex: 'ApplicationVisitTimeStr',
            scopedSlots: { customRender: 'ApplicationVisitTimeStr' }
          },
          {
            title: '出入校时间',
            dataIndex: 'VisitInOutTime',
            scopedSlots: { customRender: 'VisitInOutTime' }
          },
          {
            title: '状态',
            dataIndex: 'ApprovalStatusName',
            width: 100,
            scopedSlots: { customRender: 'ApprovalStatusName' }
          },
          {
            title: '操作',
            dataIndex: 'operation',
            width: 80,
            scopedSlots: { customRender: 'operation' }
          }
        ]
        this.getSelectData()
        this.getTableList()
      } else {
        this.getSelectData()
        this.getTableList()
      }
    },
    methods: {
      handleTableChange () {
        this.getTableList()
      },
      async getSelectData () {
        let rs = await this.xy.get(this.xyApi + '/vst' + '/visitor/GetSearchStatus')
        if (rs.success) {
          console.log(rs)
          this.Recruittype = rs.data
        }
      },
      goDetail (row) {
        let params = {
          row: row
        }
        this.$store.commit('common/getThreeMenuName', '详情')
        this.$store.commit('common/getParam', params)
        this.$router.push({
          path: '/xyHome/sa/VisitManage/VisitManageDetails',
          query: this.$store.state.common.menuInfo
        })
      },
      changeDate (value) {
        console.log(value)
        this.dateVal = value
        this.pageIndex = 1
        this.getTableList()
      },
      async getTableList () {
        this.tableLoading = true
        let params = {
          PageIndex: this.pageIndex,
          PageSize: this.pageSize,
          Status: this.RecruittypeID,
          KeyWord: this.seachText,
          VisitDate: this.dateVal,
          IsMine: this.radioVal === 'all' ? 0 : 1
        }
        let rs = await this.xy.get(this.xyApi + '/vst' + '/visitor/GetVisitorPage', params)
        if (rs.success) {
          this.pagination.total = rs.totalRecords
          this.dataList = []
          this.dataList = rs.data === null ? [] : rs.data
        }
        this.tableLoading = false
      },
      // 搜索触发
      FromSubmit () {
        this.pageIndex = 1
        this.pagination.current = 1
        this.getTableList()
      },
      typeValueSearch () {
        this.pageIndex = 1
        this.pagination.current = 1
        this.getTableList()
      },
      changeTableType (value) {
        this.dateVal = ''
        this.RecruittypeID = 0
        this.seachText = ''
        this.pagination.current = 1
        this.radioVal = value
        if (value === 'all') {
          this.columns = [
            {
              title: '审批人',
              dataIndex: 'InterviewName',
              scopedSlots: { customRender: 'allInterviewName' }
            },
            {
              title: '审批人手机号码',
              dataIndex: 'InterviewPhoneNumber',
              scopedSlots: { customRender: 'allInterviewPhoneNumber' }
            },
            {
              title: '访客',
              dataIndex: 'VisitorName',
              scopedSlots: { customRender: 'allVisitorName' }
            },
            {
              title: '访客手机号',
              dataIndex: 'VisitorPhoneNumber',
              scopedSlots: { customRender: 'allVisitorPhoneNumber' }
            },
            {
              title: '预约拜访时间',
              dataIndex: 'ApplicationVisitTimeStr',
              scopedSlots: { customRender: 'allApplicationVisitTimeStr' }
            },
            {
              title: '出入校时间',
              dataIndex: 'VisitInOutTime',
              scopedSlots: { customRender: 'VisitInOutTime' }
            },
            {
              title: '状态',
              dataIndex: 'ApprovalStatusName',
              width: 100,
              scopedSlots: { customRender: 'ApprovalStatusName' }

            },
            {
              title: '操作',
              key: 'operation',
              width: 80,
              scopedSlots: { customRender: 'operation' }
            }
          ]
          this.pageIndex = 1
          this.getTableList()
        } else {
          this.columns = [
            {
              title: '访客',
              dataIndex: 'VisitorName',
              scopedSlots: { customRender: 'VisitorName' }
            },
            {
              title: '手机号码',
              dataIndex: 'VisitorPhoneNumber',
              scopedSlots: { customRender: 'VisitorPhoneNumber' }
            },
            {
              title: '预约拜访时间',
              dataIndex: 'ApplicationVisitTimeStr',
              scopedSlots: { customRender: 'ApplicationVisitTimeStr' }
            },
            {
              title: '出入校时间',
              dataIndex: 'VisitInOutTime',
              scopedSlots: { customRender: 'VisitInOutTime' }
            },
            {
              title: '状态',
              dataIndex: 'ApprovalStatusName',
              width: 100,
              scopedSlots: { customRender: 'ApprovalStatusName' }
            },
            {
              title: '操作',
              dataIndex: 'operation',
              width: 80,
              scopedSlots: { customRender: 'operation' }
            }
          ]
          this.pageIndex = 1
          this.getTableList()
        }
      }

    }
  }
</script>
<style lang="less" scpoed>
  .table-wrap {
    background: #ffffff;

    .table-header {
      padding: 10px 10px 0 10px;
    }
  }

</style>
