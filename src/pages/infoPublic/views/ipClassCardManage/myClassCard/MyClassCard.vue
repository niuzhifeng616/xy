<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <row>
        <i-col span="5">
          <div
            style="border:1px solid #eee;margin-right:15px;min-height:600px;"
            v-cloak
          >
            <div
              style="border-bottom:1px solid #eee;padding:6px;background: #f9f9f9;"
              class="clearfix"
            >
              <b class="fl f16">班牌分组</b>
            </div>
            <div
              :style="{ height: xyMedia.y + 110 + 'px' }"
              style="padding:5px;overflow: auto;"
            >
              <tree
                v-if="treeList.length > 0"
                :data="treeList"
                :render="renderContent"
                :empty-text="nullTree"
                v-cloak
              ></tree>
              <div v-else>未查询到分组，请联系管理员。</div>
            </div>
          </div>
        </i-col>
        <i-col span="19">
          <div style="margin-bottom:10px;text-align:right;">
            <Input
              search
              v-model="searchName"
              @on-search="FromSubmit"
              placeholder="编号\名称"
              style="width: auto;"
            />
          </div>
          <div class="xy-content-table">
            <XyAntTable
              :columns="columns"
              :dataSource="datatable"
              :nullData="nullData"
              :tableLoading="tableLoading"
              :pagination="pagination"
              :isScroll="true"
              @change="handleTableChange"
            >
              <span slot="ShowModeName" slot-scope="text, record">
                {{ record.ScreenMode === 0 ? "横版" : "竖版" }}
              </span>
              <span slot="IsOnlineName" slot-scope="text, record">
                {{ record.IsOnline === 2 ? "未注册" : record.IsOnlineName }}
              </span>
            </XyAntTable>
          </div>
        </i-col>
      </row>
    </div>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'MyClassCard',
    components: {
      XyAntTable
    },
    data () {
      return {
        nullTree: '分组加载中...',
        nullData: '您没有要管理的班牌。',
        tableLoading: true,
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
        valData: {},
        loading: true,
        searchName: '',
        treeList: [
          {
            title: '全部分组',
            expand: true,
            ParentID: -1,
            ClassTerminalGroupID: 0,
            children: []
          }
        ],
        ClassTerminalGroupID: '',
        ParentID: 0,
        pageList: 0, // 当前页数据条数
        columns: [
          {
            title: '班牌名称',
            width: 180,
            fixed: 'left',
            dataIndex: 'ClassTerminalName'
          },
          {
            title: '班牌编号',
            width: 180,
            dataIndex: 'ClassTerminalNumber'
          },
          {
            title: '所属组',
            width: 120,
            dataIndex: 'ClassTerminalGroupName'
          },
          {
            title: '所属校区',
            width: 120,
            dataIndex: 'SchoolDistrictName'
          },
          {
            title: '所属楼',
            width: 120,
            dataIndex: 'BuildingName'
          },
          {
            title: '所属教室',
            width: 80,
            dataIndex: 'HouseName'
          },
          {
            title: '负责人',
            dataIndex: 'UserFullNames',
            width: 100
          },
          {
            title: '屏幕模式',
            dataIndex: 'ShowModeName',
            width: 100,
            scopedSlots: { customRender: 'ShowModeName' }
          },
          {
            title: '在线状态',
            dataIndex: 'IsOnlineName',
            width: 100,
            scopedSlots: { customRender: 'IsOnlineName' }
          }
        ],
        datatable: [],
        type: 0,
        ServiceDoMainName: '',
        apiPath: ''
      }
    },
    computed: {
      xyMedia () {
        return this.$store.state.common.xyMedia
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.getTree()
      this.getTP()
    },
    methods: {
      handleTableChange () {
        this.getTP()
      },
      async getTree () {
        let res = await this.xy.get(
          this.apiPath + `/api/ClassTerminalGroup/GetTree`
        )
        if (res.success) {
          if (res.data.length > 0) {
            this.treeList[0].children = res.data
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      async getTP () {
        this.tableLoading = true
        let res = await this.xy.get(
          this.apiPath + `/api/ClassTerminal/GetResponsiblePage`,
          {
            ClassTerminalGroupID: this.valData.ClassTerminalGroupID,
            SchoolDistrictID: 0,
            BuildingID: 0,
            SearchText: this.searchName,
            PageIndex: this.pagination.current,
            PageSize: this.pagination.pageSize
          }
        )
        this.tableLoading = false
        if (res.success) {
          this.datatable = res.data.data
          this.pagination.total = res.data.totalRecords
        }
      },
      // 搜索触发
      FromSubmit () {
        this.pagination.current = 1
        this.getTP()
      },
      renderContent (h, param) {
        return h(
          'span',
          {
            class: ['ivu-tree-title'],
            style: {
              display: 'inline-block',
              width: '100%'
            }
          },
          [
            h('span', [
              h('span', {
                style: {
                  cursor: 'pointer',
                  fontSize: '14px'
                },
                domProps: {
                  innerHTML: param.data.title
                },
                on: {
                  click: e => {
                    this.onSelectChangeTree(param, e) // 手动选择树节点
                  }
                }
              })
            ])
          ]
        )
      },
      onSelectChangeTree (val, e) {
        this.valData = val.data
        this.pagination.current = 1
        this.getTP()
      }
    }
  }
</script>
<style lang="less" scoped></style>
