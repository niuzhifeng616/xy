<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between xy-center">
      <Button
        :disabled='SignFileState === 3 ? true : (Sign.SignedNum > 0 ? false:true)'
        class="xy-primary"
        @click="exportAll">全部导出
      </Button>
      <div class="xy-flex">
        <cascader
          class="mr-10 w-200"
          :data="classList"
          :load-data="loadData"
          not-found-text="暂无班级信息"
          placeholder="请选择班级"
          @on-change="cascaderFun">
        </cascader>
        <Select v-model="signatureStatus" @on-change="typeValueSearch" class="mr-10 w-150">
          <Option v-for="item in signatureList" :value="item.value" :key="item.value">
            {{ item.name }}
          </Option>
        </Select>
        <Input search
        class="w-200"
          v-model="seachText"
          @on-search="SearchFun"
          placeholder="请输入用户名或姓名"/>
      </div>
    </div>
    <div class="xy-content-body">
      <Alert show-icon closable>
        {{Sign.SignFileName}}，共计
        <b> {{Sign.SignedNum+Sign.UnSignNum}}</b>人，
        已签<b> {{Sign.SignedNum}}</b>人，
        未签<b> {{Sign.UnSignNum}}</b>人
      </Alert>
      <XyTable
        @changePage="changePage"
        @changePageSize="changePageSize"
        :tbColumns="columns"
        :tbData="data"
        :pageSize="pageSize"
        :noDataText="txt"
        :pageIndex="pageIndex"
        :total="total">
      </XyTable>
    </div>
  </div>
</template>
<script>
  import XyTable from '@/components/table/XyTable.vue'

  export default {
    name: 'FileSignStudentList',
    components: {
      XyTable
    },
    data () {
      return {
        txt: '该搜索条件下没有结果。',
        total: 0,
        pageSize: 15,
        pageIndex: 1,
        seachText: '',
        Sign: { UnSignNum: 0, SignedNum: 0 },
        classList: [], // 获取班级
        OtherTrue: false,
        HeadmasterShow: false,
        value1: [],
        signatureStatus: 0,
        SignFileID: '',
        signatureList: [{ value: '0', name: '所有状态' }, { value: '1', name: '未签字' }, { value: '2', name: '已签字' }],
        columns: [
          {
            title: '用户名',
            key: 'UserName'

          },
          {
            title: '学生姓名',
            key: 'FullName'
          },
          {
            title: '校区',
            key: 'SchoolDistrictName',
            tooltip: true
          },
          {
            title: '年级',
            key: 'StudentGradeName',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: params.row.StudentGradeName + '(' + params.row.StudentYearName + ')'
                  }
                })
              ])
            }
          },
          {
            title: '班级',
            key: 'StudentOrganizationName'
          },
          {
            title: '签字状态',
            key: 'SignState',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: this.signatureList[params.row.SignState].name
                  }
                })
              ])
            }
          },
          {
            title: '签字日期',
            key: 'SignTime'
          },
          {
            title: '操作',
            key: 'operation',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'ios-cloud-download',
                    custom: this.SignFileState === 3 ? 'xy-table-btn xy-table-disabled xy-table-hover' : (params.row.SignState === 2 ? 'xy-table-btn xy-table-hover ' : 'xy-table-btn xy-table-disabled xy-table-hover')
                  },
                  attrs: {
                    title: '导出'
                  },

                  on: {
                    click: () => {
                      if (this.SignFileState !== 3 && params.row.SignState === 2) {
                        this.Download(params.row.SignFileDetailID)
                      }
                    }
                  }
                })
              ])
            }
          }
        ],
        data: [],
        apiPath: '',
        StudentOrganizationID: 0
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.SignFileID = this.$route.query.id
      this.SignFileState = this.$route.query.state // 3:已撤回 不可导出
      this.GetSignFileByID()
      this.getClass()
      this.getTableList()
    },
    methods: {
      async GetSignFileByID () {
        let params = {
          SignFileID: this.SignFileID
        }
        let rs = await this.xy.get(this.apiPath + '/api/SignFileManage/GetSignFileByID', params)
        if (rs.success) {
          this.Sign = rs.data
        }
      },
      getTableList () {
        this.xy.loading()
        let params = {
          PageIndex: this.pageIndex,
          PageSize: this.pageSize,
          SchoolDistrictID: 0, // 校区
          StudentOrganizationID: this.StudentOrganizationID, // 几班
          StudentGradeID: 0, // 高中 初中 小学
          StudentYearID: 0, // 学届
          State: this.signatureStatus,
          SearchName: this.seachText,
          SignFileID: this.SignFileID
        }
        this.xy.get(this.apiPath + '/api/SignFileDetailManage/GetPage', params).then(rs => {
          if (rs.success) {
            this.total = rs.data.totalRecords
            this.data = rs.data.data
          }
          this.xy.unloading()
        })
      },
      SearchFun () {
        this.pageIndex = 1
        this.getTableList()
      },
      typeValueSearch () {
        this.pageIndex = 1
        this.getTableList()
      },
      // 单个文件导出
      Download (ids) {
        let params = {
          SignFiledDetailID: ids
        }
        this.xy.downFile(this.apiPath + '/api/SignFileDetailManage/ExportSignedFile', params)
      },
      // 所有导出
      exportAll () {
        this.xy.downFile(this.apiPath + '/api/SignFileDetailManage/ExportAllSignedFile?SignFileID=' + this.SignFileID)
      },
      // 其他班级选择器change事件
      cascaderFun (value) {
        if (value.length === 4) {
          this.StudentOrganizationID = value[3]
          this.pageIndex = 1
          this.getTableList()
        } else if (value.length === 0) {
          this.StudentOrganizationID = 0
          this.pageIndex = 1
          this.getTableList()
        }
      },
      // 班级
      async getClass () {
        let params = {
          id: 0,
          type: ''
        }
        let rs = await this.xy.get(this.xyApi + '/xy/comm/GetOrgNodeListByData', params)
        if (rs.success) {
          this.classList = rs.data
        }
      },
      async loadData (item, callback) {
        item.loading = true
        let params = {
          id: item.value,
          type: item.nodetype
        }
        let rs = await this.xy.get(this.xyApi + '/xy/comm/GetOrgNodeListByData', params)
        if (rs.success) {
          if (rs.data.length < 1) {
            item.children.push({
              value: '',
              label: '暂无信息',
              disabled: true
            })
          } else {
            rs.data.forEach((value) => {
              if (value.ischild) {
                item.children.push({
                  value: value.value,
                  label: value.label,
                  loading: false,
                  nodetype: value.nodetype,
                  children: []
                })
              } else {
                item.children.push({
                  value: value.value,
                  label: value.label,
                  nodetype: value.nodetype
                })
              }
            })
          }
          item.loading = false
          callback()
        }
      },

      changePage (index) {
        this.pageIndex = index
        this.getTableList()
      },
      changePageSize (size) {
        this.pageSize = size
        this.pageIndex = 1
        this.getTableList()
      }
    }
  }
</script>
<style lang="less" scoped>
  .table-wrap {
    background: #ffffff;

    .table-header {
      padding: 10px 10px 0 10px;
    }
  }

</style>
