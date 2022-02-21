<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between xy-center">
      <div></div>
      <div>
        <radio-group v-model="timeType" @on-change="radioChange">
          <radio
            v-for="(option, index) in OptionList"
            :key="index"
            :label="option.id"
            v-cloak
            >{{ option.name }}</radio
          >
        </radio-group>
        <date-picker
          v-if="dateShow"
          type="daterange"
          placeholder="请选择自定义时间"
          :editable="false"
          @on-change="dateChange"
          :clearable="false"
          style="width: 300px;"
        ></date-picker>
        <Input
          search
          v-model="searchName"
          @on-search="FromSubmit"
          placeholder="输入版本号/操作人"
          class="xy-content-title-search"
          style="width: auto;"
        />
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :scrollx="'max-content'"
        :columns="columns"
        :dataSource="datatable"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <span
          slot="OperateName"
          slot-scope="text, record"
          class="table-el-hover"
          @click="views(record)"
          >
            {{record.OperateName}}
          </span>
          <span
          slot="action"
          slot-scope="text, record"
          >
            <a @click="views(record)">详情</a>
          </span>
      </XyAntTable>
      <modal
        v-model="modalViews"
        v-cloak
        :transfer="false"
        title="详情"
        :loading="loading"
        :mask-closable="false"
      >
        <div>
          <ul style="max-height:400px;overflow-y:auto;">
            <li
              v-for="(item, index) in failList"
              :key="index"
              style="margin-bottom:10px;font-size:16px;"
            >
              <span>{{ index + 1 }}、</span>
              <b
                :style="{
                  color:
                    item.Status == 1
                      ? '#f05a4a'
                      : item.Status == 0
                      ? '#19be6b'
                      : item.Status == 3
                      ? '#5cadff'
                      : '',
                  'margin-right': '5px'
                }"
                >【{{ item.Status == 3 ? "等待" : item.StatusName }}】
              </b>
              <span
                >{{ item.ClassTerminalName
                }}<span v-if="item.Status == 1"
                  >：{{ item.CauseMsg }}</span
                ></span
              >
            </li>
          </ul>
        </div>
        <div slot="footer">
          <Button class="xy-modal-primary" shape="circle" @click="modalViews = false"
            >关闭</Button
          >
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'UpdateRecords',
    components: {
      XyAntTable
    },
    data () {
      return {
        txt: '该搜索条件下没有结果。',
        timeType: 0,
        loading: true,
        failList: [],
        modalViews: false,
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
        columns: [
          {
            title: '操作人',
            dataIndex: 'OperateName',
            width: 180,
            scopedSlots: { customRender: 'OperateName' }
          },
          {
            title: '更新到班牌的版本',
            dataIndex: 'VersionNumber'
          },
          {
            title: '操作时间',
            dataIndex: 'OperateTime',
            width: 220
          },
          {
            title: '结果',
            dataIndex: 'ResultMsg',
            width: 220
          },
          {
            title: '操作',
            key: 'action',
            scopedSlots: { customRender: 'action' },
            width: 100
          }
        ],
        datatable: [],
        searchName: '',
        OptionList: [
          {
            id: 0,
            name: '本周'
          },
          {
            id: 1,
            name: '自定义'
          }
        ],
        dateShow: false,
        startDate: '',
        endDate: '',
        apiPath: ''
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.getDays()
    },
    methods: {
      handleTableChange () {
        this.getTP()
      },
      // 获取本周时间
      getDays () {
        var now = new Date()
        var day = now.getDay()
        var week = '7123456'
        var first = 1 - week.indexOf(day)
        var f = new Date()
        f.setDate(f.getDate() + first)
        var last = 7 - week.indexOf(day)
        var l = new Date()
        l.setDate(l.getDate() + last)
        this.startDate = this.xy.moment(f).format('YYYY-MM-DD')
        this.endDate = this.xy.moment(l).format('YYYY-MM-DD')
        this.getTP()
      },
      getTP () {
        this.tableLoading = true
        this.xy.get(
          this.apiPath + `/api/AppVersion/GetUpdateAnnalPage`, {
            startDate: this.startDate,
            endDate: this.endDate,
            keyword: this.searchName,
            pageIndex: this.pagination.current,
            pageSize: this.pagination.pageSize
          }).then(res => {
          if (res.success) {
            this.datatable = res.data.data
            this.pagination.total = res.data.totalRecords
          }
          this.tableLoading = false
        })
      },
      // 提交创建时触发
      changeLoading () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      // 搜索触发
      FromSubmit () {
        this.pagination.current = 1
        this.getTP()
      },
      // 列表中操作查看
      views (row) {
        this.failList = row.HandleDetail
        this.modalViews = true
      },
      // 单选触发
      radioChange () {
        if (this.timeType === 0) {
          this.dateShow = false
          this.pagination.current = 1
          this.getDays()
        } else {
          this.dateShow = true
        }
      },
      // 选择自定义时间
      dateChange (val) {
        this.startDate = val[0]
        this.endDate = val[1]
        this.pagination.current = 1
        this.getTP()
      },
      // 返回
      goBack () {
        this.$router.push({ path: '/xyHome/UpdateManage' })
      }
    }
  }
</script>
<style lang="less" scoped></style>
