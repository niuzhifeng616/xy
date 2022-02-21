<template>
<div class="xy-content-module" id="XyContentModuleReplace">
    <!-- <link rel="stylesheet" href="XYSubSiteLinkUrl/Css/CurModelPublic.css" />
    <div id="xy-initialize-breadcrumb"></div> -->
    <div class="xy-content-title  flex-flow">
        <div class="fl">
            <i-button type="primary" @click="creat">发起</i-button>
        </div>
        <div class="fr pr" style="float: right;">
                <span class="ml-15">种类：</span>
                <i-select v-model="officeTypeId" @on-change="typeAllSearch"  style="width:150px;">
                    <i-option v-cloak :value="-1" :key="-1">所有种类</i-option>
                    <i-option v-cloak v-for="type in typeAll" :value="type.ID" :key="type.ID">
                        {{ type.Name }}
                    </i-option>
                </i-select>

                <span class="ml-15">密级：</span>
                <i-select v-model="officeLevelId" @on-change="levelAllSearch"  style="width:150px;">
                    <i-option v-cloak :value="-1" :key="-1">所有密级</i-option>
                    <i-option v-cloak v-for="type in levelAll" :value="type.ID" :key="type.ID">
                        {{ type.Name }}
                    </i-option>
                </i-select>

                <span class="ml-15">紧急程度：</span>
                <i-select v-model="officeUrgentId" @on-change="urgentAllSearch" style="width:150px;">
                    <i-option v-cloak :value="-1" :key="-1">所有紧急程度</i-option>
                    <i-option v-cloak v-for="type in urgentAll" :value="type.ID" :key="type.ID">
                        {{ type.Name }}
                    </i-option>
                </i-select>

                <span class="ml-15">状态：</span>
                <i-select
                  v-model="approvalStatus"
                  @on-change="typeValueSearch"
                  style="width:150px;"
                  >
                    <i-option v-cloak v-for="types in approvalValue" :value="types.approvalID" :key="types.approvalID">{{ types.approvalName }}</i-option>
                </i-select>

                <i-input
                  search
                  v-model="searchName"
                  @on-search="FromSubmit"
                  placeholder="请输入主题"
                  class="fr xy-content-title-search"
                  style="width: 250px;margin: 0 15px"
                  >
                    <icon type="ios-search cursor-p" slot="suffix" />
                </i-input>

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
        <!-- 主题 -->
        <div style="min-width:200px" slot="OfficialDocTheme" slot-scope="text,record">
          <span class="table-el-hover"  @click="viewDetail(record)">
              {{text}}
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
    <Drawer v-model="showDetail" width="560" :transfer="false" :mask-closable="false"  v-cloak>
        <div slot="header">
           <p>{{row.FullName}}提交的公文</p>
        </div>
        <div class="drawer">
            <div id="DrawerDetails" v-if="showDetail">
               <DetailLook :row="row" @loadTable="loadTable"></DetailLook>
            </div>
        </div>
    </Drawer>
</div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import DetailLook from './Detail.vue'
  export default {
    name: 'Manage',
    components: {
      XyAntTable,
      DetailLook
    },
    data () {
      return {
        txt: '该搜索条件下没有结果。',
        tableUrl: '',
        tbData: {},
        row: {},
        nullData: '该搜索条件下没有结果。',
        pageIndex: 1,
        pageSize: 15,
        username: '',
        officeTypeId: -1,
        officeLevelId: -1,
        officeUrgentId: -1,
        typeAll: [], // 全部公文种类
        levelAll: [], // 全部秘密等级
        urgentAll: [], // 全部紧急程度
        showDetail: false,
        moment: this.xy.moment,

        searchName: '',
        approvalStatus: -1,
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
        data: [],
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
            title: '主题',
            dataIndex: 'OfficialDocTheme',
            scopedSlots: { customRender: 'OfficialDocTheme' }
          },
          {
            title: '公文种类',
            dataIndex: 'OfficialDocTypeName',
            width: 180
          },
          {
            title: '秘密等级',
            dataIndex: 'OfficialDocSecretLevelName',
            width: 160
          },
          {
            title: '紧急程度',
            dataIndex: 'OfficialDocEmergencyLevelName',
            width: 160
          },
          {
            title: '发起时间',
            dataIndex: 'CreatedByStrDate',
            width: 160
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
    created () {
      this.GetUserInfo()
      this.getType()
      this.getLevel()
      this.getUrgent()
      // 渲染table数据
      this.loadTable()
    },
    mounted () {

    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      // 用户
      // moment: moment,
      GetUserInfo () {
        var _this = this
        this.xy.get(`${_this.xyApi}/base/api/Users/GetUserInfo`).then(res => {
          if (res.success) {
            _this.username = res.data.FullName + ' 提交的公文'
          }
        })
      },
      // 获取公文种类
      getType () {
        var _this = this
        _this.xy.get(`${_this.$store.state.apiPath}/api/OfficialDocType/GetAll`).then(res => {
          _this.typeAll = res.data
        })
      },
      // 获取秘密等级
      getLevel () {
        var _this = this
        _this.xy.get(`${_this.$store.state.apiPath}/api/OfficialDocSecretLevel/GetAll`).then(res => {
          _this.levelAll = res.data
        })
      },
      // 获取紧急程度
      getUrgent () {
        var _this = this
        _this.xy.get(`${_this.$store.state.apiPath}/api/OfficialDocEmergencyLevel/GetAll`).then(res => {
          _this.urgentAll = res.data
        })
      },
      // 获取table/分页数据
      async loadTable () {
        this.showDetail = false
        this.tableLoading = true
        let params = {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          searchText: this.searchName,
          status: this.approvalStatus,
          emergencyID: this.officeUrgentId,
          secretID: this.officeLevelId,
          typeID: this.officeTypeId
        }
        let rs = await this.xy.get(this.$store.state.apiPath + '/api/OfficialDocument/GetMyRecordByPage', params)
        if (rs.success) {
          this.data = rs.data.data
          this.pagination.total = rs.data.totalRecords
        }
        this.tableLoading = false
      },
      // 状态1搜索
      typeAllSearch () {
        this.pagination.current = 1
        this.loadTable()
      },
      // 状态2搜索
      levelAllSearch () {
        this.pagination.current = 1
        this.loadTable()
      },
      // 状态3搜索
      urgentAllSearch () {
        this.pagination.current = 1
        this.loadTable()
      },
      // 状态4搜索
      typeValueSearch () {
        this.pagination.current = 1
        this.loadTable()
      },
      // 搜索框
      FromSubmit () {
        this.pagination.current = 1
        this.loadTable()
      },
      // 创建
      creat () {
        this.$router.push({
          path: '/xyHome/OaCreatManage',
          query: this.$store.state.common.menuInfo
        })
      },
      // 详情
      viewDetail (row) {
        this.row = row
        this.showDetail = true
      }
    }
  }

</script>
<style scoped lang="less">
  .flex-flow {
     display: flex;
     justify-content: space-between;
     align-items: center;
  }
</style>
