<template>
 <div class='xy-content-module'>
    <div class="xy-content-title clearfix">
        <div class="xy-flex">
           <div class="mr-15">
             <span>状态：</span>
              <i-select v-model="approvalStatus" @on-change="typeValueSearch"
                        style="width:150px;">
                  <i-option v-cloak v-for="types in approvalValue" :value="types.approvalID"
                            :key="types.approvalID">{{ types.approvalName }}</i-option>
              </i-select>
            </div>
            <div>
            <i-input search v-model="searchName" @on-search="FromSubmit" placeholder="请输入申请人/主题"
                     class="fr xy-content-title-search" style="width: 250px;">
                <icon type="ios-search cursor-p" slot="suffix" />
            </i-input>
            </div>
        </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :columns="columns"
        :dataSource="data"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scrollx="'max-content'"
        >
        <!-- 头像 -->
        <div slot="Icon" slot-scope="text,record">
          <div v-if="!record.Icon" :class="`head-con ${record.Sex === '男' ? 'man' : 'woman'}`">
              <span class="head-font">
                {{ xy.showName(record.FullName)}}
              </span>
            </div>
            <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
        </div>
        <!-- 申请人 -->
        <div slot="FullName" slot-scope="text,record">
          <span>
            {{record.FullName}}
          </span>
        </div>
        <!-- 审批类型 -->
        <div slot="type">
          <span>
            公文审批
          </span>
        </div>
        <!-- 摘要 -->
        <div slot="OfficialDocTheme" slot-scope="text,record">
          <span class="table-el-hover"  @click="viewDetail(record)">
             主题：{{ record.OfficialDocTheme}}， 公文种类：{{ record.OfficialDocTypeName}}
          </span>
        </div>
        <!-- 状态值 -->
        <span slot="StatusDescible" slot-scope="text, record">
          <span v-if="record.Status===0"><i class="iconfont icon-default">&#xe719;</i>{{record.StatusDescible}}</span>
          <span v-if="record.Status===1"><i class="iconfont icon-info">&#xe719;</i>{{record.StatusDescible}}</span>
          <span v-if="record.Status===2"><i class="iconfont icon-success">&#xe719;</i>{{record.StatusDescible}}</span>
          <span v-if="record.Status===3"><i class="iconfont icon-error">&#xe719;</i>{{record.StatusDescible}}</span>
          <span v-if="record.Status===4"><i class="iconfont icon-end">&#xe719;</i>{{record.StatusDescible}}</span>
        </span>
        <!-- 操作 -->
        <span slot="oprateRender" slot-scope="text, record">
          <a @click="viewDetail(record)">详情</a>
        </span>
      </XyAntTable>
    </div>
    <Drawer v-model="mInfo" width="560" :transfer="false" :mask-closable="false">
        <div slot="header">
           <p>{{row.FullName}}提交的公文</p>
        </div>
        <div class="drawer">
            <div id="DrawerDetails" v-if="mInfo">
                <!-- 右侧详情 -->
                <DetailLooks :type="type"  @loadTable="loadTable"  :MessageModel="row" :mInfo="mInfo"></DetailLooks>
            </div>
        </div>
    </Drawer>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import DetailLooks from './Detail.vue'
  export default {
    name: 'Recording',
    components: {
      XyAntTable,
      DetailLooks
    },
    data () {
      return {
        officeTypeId: -1,
        typeAll: [], // 全部公文种类
        mInfo: false,
        searchName: '',
        approvalStatus: -1,
        mainUrl: this.xyApi + '/base',
        approvalValue: [{
                          'approvalID': -1,
                          'approvalName': '所有状态'
                        },
                        {
                          'approvalID': 0,
                          'approvalName': '待审批'
                        },
                        {
                          'approvalID': 1,
                          'approvalName': '审批中'
                        },
                        {
                          'approvalID': 2,
                          'approvalName': '已通过'
                        },
                        {
                          'approvalID': 3,
                          'approvalName': '已拒绝'
                        },
                        {
                          'approvalID': 4,
                          'approvalName': '已收回'
                        }
        ],
        isInitial: true,
        type: '',
        info: '',
        ServiceDoMainName: this.xy.subMenuServiceUrl,
        WebDoMainName: this.xy.subMenuWebUrl,
        types: '',
        row: {},
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        data: [],
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
            title: '',
            width: 50,
            dataIndex: 'Icon',
            scopedSlots: { customRender: 'Icon' },
            className: 'table-pic'
          },
          {
            title: '申请人',
            width: 140,
            dataIndex: 'FullName',
            scopedSlots: { customRender: 'FullName' }
          },
          {
            title: '审批类型',
            width: 120,
            dataIndex: '',
            scopedSlots: { customRender: 'type' }
          },
          {
            title: '摘要',
            dataIndex: 'OfficialDocTheme',
            scopedSlots: { customRender: 'OfficialDocTheme' }
          },
          {
            title: '申请时间',
            dataIndex: 'CreatedByStrDate',
            width: 180
          },
          {
            title: '状态',
            dataIndex: 'StatusDescible',
            width: 100,
            scopedSlots: { customRender: 'StatusDescible' }
          },
          {
            title: '操作',
            dataIndex: '04',
            width: 80,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ]
      }
    },
    mounted () {

    },
    watch: {
      'isInitial': {
        deep: true,
        handler: function (newV, oldV) {
          this.isInitial = newV
        }
      }
    },
    created: function () {
      let that = this
      that.getType()
      // 渲染table数据
      that.loadTable()
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      // 获取公文种类
      getType: function () {
        var _this = this
        _this.xy.get(`${_this.$store.state.apiPath}/api/OfficialDocType/GetAll`).then(res => {
          _this.typeAll = res.data.data
        })
      },
      // 获取table/分页数据
      async  loadTable (pageChange) {
        this.mInfo = false
        this.tableLoading = true
        let params = {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          Status: this.approvalStatus,
          emergencyID: 0,
          secretID: 0,
          typeID: -1,
          searchText: this.searchName
        }
        let rs = await this.xy.get(this.$store.state.apiPath + '/api/OfficialDocument/GetAllRecordByPage', params)
        if (rs.success) {
          this.data = rs.data.data
          this.pagination.total = rs.data.totalRecords
        }
        this.tableLoading = false
      },
      // 状态搜索
      typeValueSearch: function () {
        this.pagination.current = 1
        this.pagination.current = 1
        this.loadTable()
      },
      // 搜索框
      FromSubmit: function () {
        this.pagination.current = 1
        this.loadTable()
      },
      viewDetail (row) {
        this.mInfo = true
        this.row = row
        this.type = 1
      }
    }
  }
  </script>
<style lang="less" scoped>
.xy-flex{
   justify-content: flex-end;
   align-items: center;
}
</style>
