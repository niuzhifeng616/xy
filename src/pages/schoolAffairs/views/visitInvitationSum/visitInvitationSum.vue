<template>
  <div class='xy-content-module'>
    <div class='xy-content-title xy-flex xy-between xy-center'>
        <div class="fl"></div>
        <div class="fr pr">
            <div class="fl xy-content-title-search">
                <span>到校时间：</span>
                <DatePicker
                  type="date"
                  v-model="defaultDate"
                  format="yyyy-MM-dd"
                  @on-change="datesChange"
                  placeholder="请选择日期"
                  style="width: 250px;">
                </DatePicker>
            </div>
            <div class="fl xy-content-title-search">
                <Input search v-model.trim="searchTheme" @on-search="themeSubmit" placeholder="请输入邀约人姓名或主题" style="width: 260px;" />
            </div>
        </div>
    </div>
    <div class='xy-content-body'>
      <!-- 这里是table等DOM -->
        <XyAntTable
          :columns="columns"
          :dataSource="tableData"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="'max-content'"
        >
          <div slot="InvatationUser" style="min-width:80px" slot-scope="text,record">
              {{record.InvatationUser}}
          </div>
          <div slot="InvatationTitle" style="min-width:220px" slot-scope="text,record">
            <span class="table-el-hover" @click="look(record)">
              {{record.InvatationTitle}}
            </span>
          </div>
          <div slot="InvatationCount"  slot-scope="text,record">
              {{record.InvatationCount}}人
          </div>
          <span slot="oprate" slot-scope="text, record">
            <a @click="look(record)">详情</a>
          </span>
        </XyAntTable>
    </div>
    <div v-if="showDrawer" >
        <Details
          @loadTable="loadTable"
          ref="drawer"
          :row="row"
          :isFrom="isFrom"
          :tableType="tableType"
          >
        </Details>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import Details from '@/pages/schoolAffairs/components/visitInvitationDetails.vue'
  export default {
    name: 'VisitInvitation',
    components: {
      XyAntTable,
      Details
    },
    data () {
      return {
        tableType: 'view',
        showDrawer: false, // 点击详情
        row: {},
        isFrom: 1,
        tableData: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        columns: [
          {
            title: '邀约人',
            dataIndex: 'InvatationUser',
            // width: 120,
            scopedSlots: { customRender: 'InvatationUser' }
          },
          {
            title: '主题',
            dataIndex: 'InvatationTitle',
            // width: 120,
            scopedSlots: { customRender: 'InvatationTitle' }
          },
          {
            title: '邀请人数',
            dataIndex: 'InvatationCount',
            scopedSlots: { customRender: 'InvatationCount' },
            width: 120
          },
          {
            title: '到访时间',
            dataIndex: 'InvatationArriveTime',
            scopedSlots: { customRender: 'InvatationArriveTime' },
            width: 180
          },
          {
            title: '操作',
            dataIndex: 'oprate',
            width: 80,
            scopedSlots: { customRender: 'oprate' }
          }
        ],
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
        defaultDate: null, // 到校时间
        searchTheme: ''
      }
    },
    created () {
      this.loadTable()
    },
    mounted () {},
    methods: {
      //  获取table分页数据
      async loadTable () {
        this.tableLoading = true
        this.showDrawer = false
        let params = {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          invatationTitle: this.searchTheme, // 邀请主题
          invatationArriveTime: this.defaultDate ? this.defaultDate : '', // 邀请到访时间
          invatationUser: '' // 受邀人
        }
        let res = await this.xy.get(
          this.xyApi + '/vst' + '/invatation/GetInvatationPagelist', params
          // 'http://devpczx.xiaoyangedu.net:9092' + '/vst/invatation/GetInvatationPagelist', params
        )
        if (res.success) {
          if (res.data.data != null && res.data.data.length > 0) {
            this.tableData = res.data.data
            this.pagination.total = res.data.totalRecords
          } else {
            this.tableData = []
          }
        } else {
          this.xy.msgError(res.msg)
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.loadTable()
      },
      // 到访时间change
      datesChange (val) {
        this.defaultDate = val
        this.pagination.current = 1
        this.loadTable()
      },
      // 搜索
      themeSubmit () {
        this.pagination.current = 1
        this.loadTable()
      },
      // 发起邀请-跳转页面
      createLeave () {
        this.$store.commit('common/getThreeMenuName', '邀请访客')
        this.$router.push({
          path: '/xyHome/sa/visitLaunchInvitation',
          query: this.$store.state.common.menuInfo
        })
      },
      // 单击表格中详情
      look (record) {
        this.showDrawer = true
        this.row = record
      }
    }
  }
</script>
<style lang='less' scoped>
</style>
