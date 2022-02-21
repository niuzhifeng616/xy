<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between">
      <div>
        校区:
        <Select v-model="SchoolDistrictID" @on-change="schoolChange" class="select mr-10" style="width:209px">
          <Option v-for="(item,index) in schoolData" :value="item.SchoolDistrictID" :key="index">{{item.SchoolDistrictName}}</Option>
        </Select>
        学年学期:
        <cascader style="width:209px;float:right;margin-left:10px" :data="yearSessionData" v-model="yearSession"  :clearable="false" @on-change="cascaderChange"></cascader>
      </div>
      <div>
      </div>
    </div>
    <div class="xy-content-body">
      <!-- <XyTable
        :tableUrl="tableUrl"
        :tbData="tbData"
        :tbColumns="columns"
        :nullData="nullData"
        @changePage="changePage"
        @changePageSize="changePageSize"
        >
      </XyTable> -->
      <XyAntTable
        :columns="columns"
        :dataSource="tbData"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scrollx="'max-content'"
        >
        <div slot="SignFileName" style="display:flex;align-item:center;padding:14px 0;min-width:120px" slot-scope="text,record">
            <div style="padding:12px;border-radius:4px;background: rgba(255,191,0,1);display:flex;align-items:center">
              <img src="@/assets/common/attendance/seticon.png" style="width:24px;height:24px">
            </div>
            <div style="margin-left: 18px;min-width: 130px;display: flex;flex-direction: column;justify-content: space-around;">
              <div>
                <span @click="goDetail(record)" class="hover-color table-el-hover" style="margin-bottom: 4px;font-weight: 600">
                  {{record.TeachingProjectName}}
                </span>
              </div>
              <p>
                <span>{{record.AcademicYearName}}</span>
                <span style=" margin-left: 10px">{{record.AcademicSessionName}}</span>
              </p>
            </div>
        </div>
        <div slot="SchoolDistrictNames" style="min-width:110px" slot-scope="text,record">
          <p style="margin-bottom: 6px">起止时间</p>
          <span>{{xy.moment(record.StartDate).format('YYYY/MM/DD HH:mm') + ' - ' + xy.moment(record.EndDate).format('YYYY/MM/DD HH:mm')}}</span>
        </div>
        <div slot="State" slot-scope="text,record">
          <p style="margin-bottom: 4px">
            状态
          </p>
          <span>
            <span v-if="record.StatusDescible === '未开始'"><i class="iconfont icon-default">&#xe719;</i>{{record.StatusDescible}}</span>
            <span v-if="record.StatusDescible === '进行中'"><i class="iconfont icon-info">&#xe719;</i>{{record.StatusDescible}}</span>
            <span v-if="record.StatusDescible === '已结束'"><i class="iconfont icon-end">&#xe719;</i>{{record.StatusDescible}}</span>
          </span>
        </div>
        <span slot="operation" slot-scope="text,record" class="oprateBtn1">
          <a @click="goDetail(record)">进入方案</a>
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
        tableUrl: '',
        tbData: [],
        radioVal: 'all',
        total: 0,
        pageSize: 15,
        pageIndex: 1,
        seachText: '',
        dateVal: '',
        SchoolDistrictID: 0,
        schoolData: [],
        yearSession: [],
        yearSessionData: [],
        nullData: '该搜索条件下没有结果。',
        tableLoading: true,
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
        columns: [
          {
            title: ' ',
            dataIndex: 'SignFileName',
            scopedSlots: { customRender: 'SignFileName' }
            // minWidth: 120
          },
          {
            title: ' ',
            dataIndex: 'SchoolDistrictNames',
            scopedSlots: { customRender: 'SchoolDistrictNames' }
          },
          {
            title: ' ',
            dataIndex: 'State',
            width: 200,
            scopedSlots: { customRender: 'State' }
          },
          {
            title: ' ',
            dataIndex: 'operation',
            width: 180,
            scopedSlots: { customRender: 'operation' }
          }
        ],
        dataList: [],
        apiPath: ''
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.$store.commit('common/getThreeMenuName', '')
      this.getSchool()
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      // 获取table
      loadTable () {
        this.tableLoading = true
        let obj = {
          searchTxt: '',
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          schoolDistrictID: this.SchoolDistrictID,
          AcademicSessionID: this.yearSession.length > 1 ? this.yearSession[1] : 0,
          pageType: 2
        }
        this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingProject/GetPageByRole`, obj).then(res => {
          if (res.success) {
            this.total = res.data.totalRecords
            this.pagination.total = res.data.totalRecords
            this.tbData = res.data.data
            this.pageList = res.data.data.length
          }
          this.tableLoading = false
        })
      },
      goDetail (row) {
        this.$store.commit('evaluate/changeEvaMyLuate', row)
        this.$store.commit('common/getParam', { pro: 'MyEvaluateList' })
        this.$store.commit('common/getThreeMenuName', row.TeachingProjectName)
        this.$router.push({
          path: '/xyHome/MyEvaluateDetails',
          query: this.$store.state.common.menuInfo
        })
      },
      schoolChange: function (value) {
        this.pageIndex = 1
        this.SchoolDistrictID = value
        this.pagination.current = 1
        this.loadTable()
      },
      // 获取校区
      async getSchool () {
        // this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetSchoolDistrictByRole`, { 'pageType': 2 })
        if (res.success) {
          this.schoolData = res.data
          // 默认筛选第一个校区
          if (this.schoolData.length > 0) {
            this.SchoolDistrictID = this.schoolData[0].SchoolDistrictID
          } else {
            // this.xy.unloading()
            this.loadTable()
            return
          }
          // this.xy.unloading()
          this.getSessionNodeList()
        } else {
          // this.xy.unloading()
          this.xy.msgError(res.msg)
        }
      },
      // 学年学期
      getSessionNodeList: function () {
        var that = this
        that.yearSessionData = [
          {
            'label': '所有学年',
            'value': 0,
            'children': [{
              'value': 0,
              'label': '所有学期',
              'children': []
            }]
          }]
        // this.xy.loading()
        this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`).then(res => {
          if (res.success) {
            that.yearSessionData = that.yearSessionData.concat(res.data)
            that.yearSession = []
            var index = that.yearSessionData.map(function (item) {
              return item.IsCurrent
            }).indexOf(true)
            if (index !== -1) {
              that.yearSession.push(that.yearSessionData[index].value)
              var index1 = that.yearSessionData[index].children.map(function (item) {
                return item.IsCurrent
              }).indexOf(true)
              if (index1 !== -1) {
                that.yearSession.push(that.yearSessionData[index].children[index1].value)
                that.yearSession = [0, 0] // 产品要求默认显示所有学年/所有学期
              } else {
                that.yearSession = [0, 0]
              }
            } else {
              for (var i = 0; i < that.yearSessionData.length; i++) {
                if (that.yearSessionData[i].children.length > 0) {
                  that.yearSession = [that.yearSessionData[i].value, that.yearSessionData[i].children[0].value]
                  return false
                }
              }
            }
            this.loadTable()
          }
          // this.xy.unloading()
        })
      },
      cascaderChange: function (value) {
        this.pageIndex = 1
        this.yearSession = value
        this.pagination.current = 1
        this.loadTable()
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
