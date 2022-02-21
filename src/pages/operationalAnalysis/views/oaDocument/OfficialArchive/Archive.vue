<template>
<div class="xy-content-module" id="XyContentModuleReplace">
    <!-- <link rel="stylesheet" href="XYSubSiteLinkUrl/Css/CurModelPublic.css" /> -->
    <div id="xy-initialize-breadcrumb"></div>
    <div class="xy-content-title flex-flow">
        <div class="xy-flex">
          <div class="mr-15">
            <span>种类：</span>
            <i-select
              v-model="officeTypeId"
              @on-change="typeAllSearch"
              style="width:150px;"
              >
                <i-option v-cloak :value="-1" :key="-1">所有种类</i-option>
                <i-option v-cloak v-for="type in typeAll" :value="type.ID" :key="type.ID">
                  {{ type.Name }}
                </i-option>
            </i-select>
          </div>
          <div class="mr-15">
            <span>等级：</span>
            <i-select
              v-model="officeLevelId"
              @on-change="levelAllSearch"
              style="width:150px;"
              >
                <i-option v-cloak :value="-1" :key="-1">所有密级</i-option>
                <i-option v-cloak v-for="type in levelAll" :value="type.ID" :key="type.ID">
                  {{ type.Name }}
                </i-option>
            </i-select>
          </div>
          <div class="mr-15">
            <span>紧急程度：</span>
            <i-select
              v-model="officeUrgentId"
              @on-change="urgentAllSearch"
              style="width:150px;"
              >
                <i-option v-cloak :value="-1" :key="-1">所有紧急程度</i-option>
                <i-option v-cloak v-for="type in urgentAll" :value="type.ID" :key="type.ID">
                  {{ type.Name }}
                </i-option>
            </i-select>
          </div>
            <!-- <i-select v-model="approvalStatus" @on-change="typeValueSearch" class="fl xy-content-title-search"
                style="width:150px;">
                <i-option v-cloak v-for="types in approvalValue" :value="types.approvalID"
                    :key="types.approvalID">{{ types.approvalName }}</i-option>
            </i-select> -->
          <div>
            <i-input
              search
              v-model="searchName"
              @on-search="FromSubmit"
              placeholder="请输入申请人/主题"
              class="fr xy-content-title-search"
              style="width: 250px;"
              >
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
        <!-- 主题 -->
        <div slot="OfficialDocTheme" slot-scope="text,record" style="min-width:300px">
          <span class="table-el-hover" @click="viewDetail(record)">
            {{ record.OfficialDocTheme}}
          </span>
        </div>
        <!-- 公文种类 -->
        <div slot="OfficialDocTypeName" slot-scope="text,record" style="min-width:140px">
          {{ record.OfficialDocTypeName}}
        </div>
        <!-- 秘密等级 -->
        <div slot="OfficialDocSecretLevelName" slot-scope="text,record" style="min-width:140px">
          {{ record.OfficialDocSecretLevelName}}
        </div>
        <!-- 紧急程度 -->
         <div slot="OfficialDocEmergencyLevelName" slot-scope="text,record" style="min-width:140px">
          {{ record.OfficialDocEmergencyLevelName}}
        </div>
        <!-- 归档时间 -->
         <div slot="LastModifyByStrDate" slot-scope="text,record">
          {{ record.LastModifyByStrDate}}
        </div>
        <!-- 操作 -->
        <span slot="oprateRender" slot-scope="text, record">
          <a @click="viewDetail(record)">详情</a>
        </span>
      </XyAntTable>
    </div>
    <Drawer v-model="showDetail" width="560" :transfer="false" :mask-closable="false">
      <div slot="header">
          <p>{{row.FullName}}提交的公文</p>
      </div>
      <div class="drawer">
          <div id="DrawerDetails">
              <!-- 右侧详情 -->
              <DetailsLook :params="row" v-if="showDetail"  @loadTable="loadTable"></DetailsLook>
          </div>
      </div>
    </Drawer>
    <!-- <script src="XYSubSiteLinkUrl/View/oaDocument/OfficialArchive/PC/Scripts/Archive.js"></script> -->
</div>
</template>
<script>
  import DetailsLook from './Detail.vue'
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'Archive',
    components: {
      DetailsLook,
      XyAntTable
    },
    data: function () {
      return {
        row: {},
        officeTypeId: -1,
        officeLevelId: -1,
        officeUrgentId: -1,
        showDetail: false,
        typeAll: [], // 全部公文种类
        levelAll: [], // 全部秘密等级
        urgentAll: [], // 全部紧急程度
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
        searchName: '',
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
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
        data: [],
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
            title: '主题',
            dataIndex: 'OfficialDocTheme',
            scopedSlots: { customRender: 'OfficialDocTheme' }
          },
          {
            title: '公文种类',
            dataIndex: 'OfficialDocTypeName',
            scopedSlots: { customRender: 'OfficialDocTypeName' }
          },
          {
            title: '秘密等级',
            dataIndex: 'OfficialDocSecretLevelName',
            scopedSlots: { customRender: 'OfficialDocSecretLevelName' }
          },
          {
            title: '紧急程度',
            dataIndex: 'OfficialDocEmergencyLevelName',
            scopedSlots: { customRender: 'OfficialDocEmergencyLevelName' }
          },
          {
            title: '归档时间',
            dataIndex: 'LastModifyByStrDate',
            width: 180,
            scopedSlots: { customRender: 'LastModifyByStrDate' }
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
    created: function () {
      this.getType()
      this.getLevel()
      this.getUrgent()
      // 渲染table数据
      this.loadTable()
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      // 获取公文种类
      getType: function () {
        var _this = this
        _this.xy.get(`${_this.$store.state.apiPath}/api/OfficialDocType/GetAll`).then(res => {
          _this.typeAll = res.data
        })
      },
      // 获取秘密等级
      getLevel: function () {
        var _this = this
        _this.xy.get(`${_this.$store.state.apiPath}/api/OfficialDocSecretLevel/GetAll`).then(res => {
          _this.levelAll = res.data
        })
      },
      // 获取紧急程度
      getUrgent: function () {
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
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          searchText: this.searchName,
          status: this.approvalStatus,
          emergencyID: this.officeUrgentId,
          secretID: this.officeLevelId,
          typeID: this.officeTypeId
        }
        let rs = await this.xy.get(this.$store.state.apiPath + '/api/OfficialDocument/GetArchiveRecordByPage', params)
        if (rs.success) {
          this.data = rs.data.data
          this.pagination.total = rs.data.totalRecords
        }
        this.tableLoading = false
      },
      // 状态1搜索
      typeAllSearch: function () {
        this.pagination.current = 1
        this.loadTable()
      },
      // 状态2搜索
      levelAllSearch: function () {
        this.pagination.current = 1
        this.loadTable()
      },
      // 状态3搜索
      urgentAllSearch: function () {
        this.pagination.current = 1
        this.loadTable()
      },
      // 状态4搜索
      typeValueSearch: function () {
        this.pagination.current = 1
        this.loadTable()
      },
      // 搜索框
      FromSubmit: function () {
        this.pagination.current = 1
        this.loadTable()
      },
      // 详情
      viewDetail (row) {
        this.showDetail = true
        this.row = row
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
