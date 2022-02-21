<template>
  <div class="xy-content-module" style="background: #fff;">
    <div style="margin-bottom: 20px;font-size: 16px;">{{params.strs}}</div>
    <div class="header">
      <i-input search
        v-model.trim="searchText"
        @on-search="searchChange"
        placeholder="请输入学生姓名或小组名"
        class="xy-content-title-search"
        style="width: auto;">
        <icon type="ios-search cursor-p"
              slot="suffix" />
      </i-input>
    </div>
    <div class="xy-content-body">
      <XyTable
        style="margin-bottom:80px;"
        :nullData="'该搜索条件下没有结果。'"
        @changePage="changePage"
        @changePageSize="changePageSize"
        :tbColumns="columns"
        :pageSize="pageSize"
        :pageIndex="pageIndex"
        :total="total"
        :tbData="tbData">
      </XyTable>
    </div>
    <div class="save" >
      <Button class="xy-modal-primary"
              shape="circle"
              @click="back">返回</Button>
    </div>
  </div>
</template>
<script>
  import XyTable from '@/components/table/XyTable.vue'
  export default {
    components: {
      XyTable
    },
    name: 'evaRecording',
    data () {
      return {
        total: 0, // 总条数
        // 表头
        columns: [
          {
            minWidth: 100,
            title: '评价对象',
            key: 'RecordObjectName'
          },
          {
            title: '指标项',
            key: 'IndexManagementName',
            manWidth: 200
          },
          {
            width: 100,
            title: '得星数',
            key: 'ScoringValue',
            render (h, params) {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: `+${params.row.ScoringValue} `
                  }
                }),
                h('img', {
                  style: {
                    width: '18px',
                    height: '18px',
                    marginLeft: '6px'
                  },
                  domProps: {
                    src: require('./Image/star.svg')
                  }
                })
              ])
            }
          },
          {
            width: 200,
            title: '评价人员',
            key: 'LastModifyUserName'
          },
          {
            title: '评价时间',
            key: 'LastModifyByDate',
            width: 200
          }
        ],
        searchText: '',
        tbData: {},
        pageIndex: 1,
        pageSize: 15,
        params: JSON.parse(this.$route.query.params),
        apiPath: ''
      }
    },
    created () {
      this.apiPath = this.xy.getCookie('eva')
      this.getTable()
    },
    methods: {
      // 获取列表
      getTable () {
        this.xy.loading()
        this.xy.get(`${this.apiPath}/api/EvaluateStudent/GetRecordLog`, {
          coursePlanAID: this.params.CoursePlanAID,
          coursePlanAIDType: this.params.CoursePlanAIDType,
          classTableGenerateBaseID: this.params.ClassTableGenerateBaseID,
          pageIndex: this.pageIndex,
          name: this.searchText,
          pageSize: this.pageSize
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            if (res.data.data.length > 0) {
              if (res.data.data[0].ScoringMethod === 1) { // 1 :星星，0：打分
                this.columns.splice(2, 1, {
                  title: '得星数',
                  key: 'ScoringValue',
                  render (h, params) {
                    return h('div', [
                      h('span', {
                        domProps: {
                          innerHTML: `<span> ` + params.row.ScoringValue + `<span> `
                        }
                      }),
                      h('img', {
                        style: {
                          width: '18px',
                          height: '18px',
                          marginLeft: '6px'
                        },
                        domProps: {
                          src: require('./Image/star.svg')
                        }
                      })
                    ])
                  }
                })
              } else {
                this.columns.splice(2, 1, {
                  title: '得分',
                  key: 'ScoringValue'
                })
              }
            }
            this.total = res.data.totalRecords
            this.tbData = res.data.data
          }
        })
      },
      FromSubmit () {
        this.pageIndex = 1
        this.getTable()
      },
      searchChange () {
        this.pageIndex = 1
        this.getTable()
      },
      changePage (current) {
        this.pageIndex = current
        this.getTable()
      },
      // 单击切换每页展示条数触发
      changePageSize (size) {
        this.pageIndex = 1
        this.pageSize = size
        this.getTable()
      },
      //
      back () {
        this.$router.push({
          name: 'evaGroupClient',
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.container {
  .header {
    width: 100%;
    padding-bottom: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
.save {
    position: fixed;
    left:0;
    right:0;
    bottom: 0;
    padding-right:20px;
    height: 80px;
    line-height: 80px;
    text-align: right;
    background: #fff;
    padding-right: 50px;
    border-top: 1px solid #f9f9f9;
  }
</style>
