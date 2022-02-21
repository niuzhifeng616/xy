<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between xy-center">
      <div></div>
      <div>
        <radio-group v-model="timeType" size="large">
          <radio label="1">本周</radio>
          <radio label="0">自定义</radio>
        </radio-group>
        <date-picker v-model="dateTimes" type="datetimerange" v-if="timeType==='0'" placement="bottom-end" placeholder="开始时间-结束时间" style="width: 300px;"></date-picker>
        <i-select v-model="recordType" class="xy-content-title-search" style="width:250px;">
          <i-option v-bind:value="-1">全部</i-option>
          <i-option v-for="(item, index) in recordTypeList" :key="index" v-bind:value="item.id" v-cloak>{{item.names}}</i-option>
        </i-select>
        <i-button class="xy-primary xy-content-title-search" @click="searchBtn">查询</i-button>
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :columns="columns"
        :dataSource="datatable"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <span
          slot="FullName"
          slot-scope="text, record"
          class="table-el-hover"
          @click="views(record)"
        >
          {{record.FullName === null? "--": record.FullName}}
        </span>
        <span
          slot="Records"
          slot-scope="text, record"
        >
          {{record.SuccessCount + '成功，' + record.FailCount + '失败'}}
        </span>
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="views(record)">操作详情</a>
        </span>
      </XyAntTable>
      <modal
        v-model="modalViews"
        v-cloak
        :transfer="false"
        title="详情"
        :mask-closable="false"
        :closable="false">
          <div>
              <ul style="max-height:400px;overflow-y:auto;">
                  <li v-for="(item,index) in failList" :key="index" style="margin-bottom:10px;font-size:16px;">
                      <span>{{index+1}}、</span>
                      <b v-bind:style="{
                                      color:item.Status==1?'#f05a4a':item.Status==0?'#19be6b':item.Status==3?'#5cadff':'',
                                      'margin-right':'5px'
                                      }">【{{item.Status==3?'等待':item.StatusName}}】
                      </b>
                      <span>{{item.ClassTerminalName}}<span v-if="item.Status==1">：{{item.CauseMsg}}</span></span>
                  </li>
              </ul>
          </div>
          <div slot="footer">
            <Button class="xy-modal-primary" shape="circle" @click="modalViews=false">关闭</Button>
          </div>
      </modal>
    </div>
</div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'ClassCardManageRecord',
    components: {
      XyAntTable
    },
    data () {
      return {
        tableLoading: true,
        nullData: '未查询到任何操作记录。',
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: current => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        timeType: '1',
        dateTimes: [],
        loading: true,
        failList: [],
        modalViews: false,
        recordType: -1,
        recordTypeList: [
          {
            id: 98,
            names: '班牌注册'
          },
          {
            id: 1,
            names: '定时开关机设置'
          },
          {
            id: 0,
            names: '班牌重启'
          },
          {
            id: 20,
            names: '班牌截屏'
          },
          {
            id: 5,
            names: '绑定教室变更'
          },
          {
            id: 6,
            names: '班级展示变更'
          },
          {
            id: 4,
            names: '模式变更'
          },
          {
            id: 14,
            names: '解绑班牌'
          }
        ],
        columns: [
          {
            title: '操作人',
            dataIndex: 'FullName',
            scopedSlots: { customRender: 'FullName' }
          },
          {
            title: '操作内容',
            dataIndex: 'ClassTerminalHandleTypeName'
          },
          {
            title: '操作时间',
            dataIndex: 'CreateByDate'
          },
          {
            title: '结果',
            dataIndex: 'Records',
            scopedSlots: { customRender: 'Records' }
          },
          {
            title: '操作',
            width: 80,
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        datatable: []
      }
    },
    created () {
      this.getTP()
    },
    methods: {
      handleTableChange () {
        this.getTP()
      },
      getTP () {
        let startTime = ''; let endTime = ''
        if (this.dateTimes.length === 2) {
          startTime = this.xy.moment(this.dateTimes[0]).format('YYYY-MM-DD  HH:mm:ss')
          endTime = this.xy.moment(this.dateTimes[1]).format('YYYY-MM-DD  HH:mm:ss')
        };
        this.tableLoading = true
        this.xy.get(`${this.$store.state.apiPath}/api/Handle/GetPage`, {
          isweek: this.timeType,
          starTime: startTime,
          endTime: endTime,
          type: this.recordType,
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize
        }).then(res => {
          if (res.success) {
            this.datatable = res.data.data
            this.pagination.total = res.data.totalRecords
          }
          this.tableLoading = false
        })
      },
      searchBtn () {
        this.pagination.current = 1
        this.getTP()
      },
      views (row) {
        this.failList = row.HandleDetail
        this.modalViews = true
      },
      goBack () {
        this.$router.back()
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-table {
    background: #fff;
    padding: 10px;
    .ivu-table th {
      background: #FAFAFA;
    }
    .oprateList {
      a.disabled {
        cursor: not-allowed;
        color: #ccc;
      }
      a {
        color: #1890FF;
      }
      .oprateBtn1 {
        color: #1890FF;
        padding-right: 10px;
        font-size: 14px;
      }
      .oprateBtn2 {
        padding-left: 10px;
        a {
          color: #1890FF;
          font-size: 14px;
          border-left: 1px solid #D8D8D8;
          margin-right: 5px;
        }
      }
      .oprateBtn3 {
        // 只有两个按钮时右边按钮没有嵌套 a标签，需要左边框
        padding-left: 10px;
        color: #1890FF;
        font-size: 14px;
        border-left: 1px solid #D8D8D8;
        margin-right: 5px;
      }
    }
    .xy-page {
      margin-top: 10px;
      text-align: right;
      position: relative;
      padding-bottom: 10px;

      .ivu-page-total {
        position: absolute;
        left: 36px;
        font-weight: 700;
      }
    }
  }
</style>
