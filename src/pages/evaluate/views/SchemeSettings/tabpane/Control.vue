<template>
  <div>
    <div class="evaAluate_control">
      <div class="evaAluate_control_select">
        <div class="evaAluate_control_indicator">
          <div class="control_indicator"> </div>
          <div>
            <i-input
              search
              v-model="searchText"
              @on-search="doSearch"
              placeholder="请输入教师姓名"
              class="xy-content-title-search"
              style="width: 200px;"
            >
            </i-input>
          </div>
        </div>
      </div>
      <XyAntTable
        :columns="sourceColumns"
        :dataSource="sourceData"
        nullData="该搜索条件下没有教师。"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :isBorder="true"
        :scrollx="'max-content'">
        <div slot="TeacherName" slot-scope="text, record" class="set-head-icon">
          <div class="icon">
            <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
              <span class="head-font">
                {{ xy.showName(record.TeacherName)}}
              </span>
            </div>
            <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
          </div>
          <span v-text="record.TeacherName"></span>
        </div>
        <div slot="SegmentInc" slot-scope="text, record">
          <span class="to-desc" v-text="text" @click="toDesc(record)"></span>
        </div>
      </XyAntTable>
      <!-- <XyTable
        ref="tab"
        :loading="loading"
        @changePage="changePage"
        :rowKey="'id'"
        @changePageSize="changePageSize"
        :tbColumns="sourceColumns"
        :tbData="sourceData"
        :noDataText="noDataText"
        :pageSize="pageSize"
        :pageIndex="pageIndex"
        :total="total"
        @handleLoadData="handleLoadData"
      >
      </XyTable> -->
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: {
      XyAntTable
    },
    name: '',
    data () {
      return {
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
        apiPath: `${this.xyApi}/eva`,
        isOpen: false,
        // 方案ID
        TeachingProjectID: this.$route.query.teachingProjectID * 1,
        // 选择课程的ID
        courseID: '0',
        // 课程列表
        courseList: [],
        // 源选择指标
        sourceIndicator: [],
        // 已选择指标选项
        indicator: [],
        // 搜索关键词
        searchText: '',
        // 源表头
        sourceColumns: [],
        // 筛选过后的表头
        sourceData: [],
        searchList: [],
        show: false,
        searchNameList: [], // 选中搜索条件列表
        copyList: [],
        noDataText: '',
        columTwo: null,
        subId: null,
        scrollPar: 0,
        loading: false,
        copyDtList: [],
        pickValue: []
      }
    },
    created () {
      this.$store.commit('common/getThreeMenuName', this.$route.query.menuName)
      this.$store.commit('common/getParam', Object.assign(this.$route.query, { pro: 'evaluate/ScheSetting', clearTitle: null }))
      this.getTab()
    },
    methods: {
      handleTableChange (pagination, filters, sorter) {
        if (filters && filters.SubjectName && filters.SubjectName.length && this.sourceColumns.length && this.sourceColumns[1] && this.sourceColumns[1].filters && this.sourceColumns[1].filters.length) {
          let ft = this.sourceColumns[1].filters.filter(v => filters.SubjectName[0] === v.text)
          if (ft && ft.length) {
            this.subId = ft[0].id
          }
        } else {
          this.subId = null
          this.sourceColumns[1].defaultFilteredValue = []
        }
        this.getTab()
      },
      toDesc (row) {
        // console.log(row)
        if (!row.children) return
        this.$store.commit('common/getParam', Object.assign(this.$route.query, { AssessObjectID: row.AssessObjectID, pro: 'evaluate/ConmmHeader/Control', clearTitle: true }))
        this.$router.push({
          path: '/xyHome/evaluate/ControlDesc',
          query: this.$store.state.common.menuInfo
        })
      },
      // 搜索
      doSearch () {
        // 处理输入框搜索无条件，表格下拉筛选高亮显示的问题
        if (this.sourceColumns && this.sourceColumns.length && this.sourceColumns[1] && this.sourceColumns[1].filters && this.sourceColumns[1].filters.length && this.subId !== null) {
          let item = this.sourceColumns[1].filters.filter(v => v.id === this.subId)
          if (item && item.length) {
            this.sourceColumns[1].defaultFilteredValue = [item[0].value]
          }
        }
        this.pagination.current = 1
        this.getTab() // 重新获取表格数据
      },
      // 获取列表源数据
      async getTab (val) {
        this.tableLoading = true
        // this.noDataText = val ? '该搜索条件下没有结果。' : '暂无指标分数相关数据，请添加评价指标。'
        const params = {
          assessProjectID: this.TeachingProjectID,
          pageSize: this.pagination.pageSize,
          pageIndex: this.pagination.current,
          subjectID: this.subId,
          searchTxt: this.searchText
        }
        let res = await this.xy.get(`${this.apiPath}/api/TeachingAssessReport/GetTargetScoreSummaryTable`, params)
        this.tableLoading = false
        if (res.success) {
          if (res.data && res.data.Table) {
            let dt = res.data.Table
            if (!this.columTwo) {
              if (res.data.TargetFilter && res.data.TargetFilter.length) {
                this.searchList = res.data.TargetFilter
                this.searchNameList = res.data.TargetFilter.map(val => val.Value)
                if (this.searchNameList.length === 1) {
                  this.pickValue = this.searchNameList
                }
              }
              if (dt.Columns && dt.Columns.length) {
                this.columTwo = true
                this.sourceColumns = dt.Columns.map((vv, index) => {
                  return {
                    title: vv.title,
                    dataIndex: vv.key,
                    key: vv.key,
                    scopedSlots: { customRender: vv.key },
                    width: 'auto',
                    index: index,
                    // width: index === 2 ? 'auto' : 200,
                    children: vv.children && vv.children.length ? vv.children.map(v => {
                      return {
                        title: v.title,
                        dataIndex: v.key,
                        scopedSlots: v.key === 'zl_SegmentInc' ? { customRender: 'SegmentInc' } : ''
                      }
                    }) : null
                  }
                })
                Object.assign(this.sourceColumns[0], {
                  fixed: 'left',
                  width: 250,
                  tree: true,
                  scopedSlots: { customRender: 'TeacherName' },
                  className: 'tea-name'
                })
                Object.assign(this.sourceColumns[1], {
                  fixed: 'left',
                  filterMultiple: false,
                  // filtered: true,
                  defaultFilteredValue: [],
                  width: 200,
                  filters: dt.Columns[1].filters.map(vv => {
                    return {
                      text: vv.label,
                      value: vv.label,
                      id: vv.value
                    }
                  })
                })
                this.sourceColumns.push({
                  title: '',
                  dataIndex: 'action',
                  fixed: 'right',
                  key: 'action',
                  width: 28,
                  className: 'root',
                  // scopedSlots: {
                  //   filterDropdown: 'filterCloumn',
                  //   filterIcon: 'filterCloumnIcon'
                  // }
                  filterDropdown: ({ confirm, clearFilters }) => (
                    <div class="setting-box">
                      <p class="setting-title">设置显示字段</p>
                      <a-checkbox-group indeterminate={true} v-model={this.searchNameList} options={this.searchList.map(val => val.Value)} change={this.featchCloum()} />
                    </div>
                  ),
                  filterIcon: filtered => <a-icon type="setting" class="filter-setting"/>
                })
                // console.log(dt.Columns)
                // console.log(this.sourceColumns)
                // 复制可操作列2-倒数第2
                let arDt = JSON.parse(JSON.stringify(this.sourceColumns))
                this.copyList = arDt.splice(2, arDt.length - 2)
              }
            }
            if (dt.Datas) {
              this.copyDtList = JSON.parse(JSON.stringify(dt.Datas))
              this.sourceData = dt.Datas
            }
            this.pagination.total = res.data.TotalRecord
          }
        }
      },
      featchCloum () {
        this.changeCloumes(this.searchNameList)
      },
      // 表格筛选
      changeCloumes (val) {
        let arr = JSON.parse(JSON.stringify(this.sourceColumns)).splice(2, this.sourceColumns.length - 3).map(vv => vv.title)
        // 增
        if (val.length >= arr.length) {
          for (let item of val) {
            if (item && !arr.includes(item)) {
              for (let i in this.copyList) {
                if (item === this.copyList[i].title) {
                  // this.sourceData = this.copyDtList
                  // this.sourceData.push({})
                  // console.log(this.sourceData)
                  this.sourceColumns.splice(i * 1 >= arr.length ? arr.length + 2 : i * 1 + 2, 0, this.copyList[i])
                  this.sourceColumns.sort((a, b) => {
                    return a.index - b.index
                  })
                  console.log(this.sourceColumns)
                  // setTimeout(() => {
                  //   this.tableLoading = false
                  // }, 1500)
                  return
                }
              }
            }
          }
        } else {
          if (val.length === 1) {
            this.pickValue = val
          } else if (!val.length || this.sourceColumns.length === 1) {
            this.searchNameList = this.pickValue
            return this.xy.msgError('筛选数据列至少保留一列。')
          }
          // console.log(val)
          // 减
          for (let v in arr) {
            if (arr[v] && !val.includes(arr[v])) {
              this.sourceColumns.splice(v * 1 + 2, 1)
              // setTimeout(() => {
              //   this.tableLoading = false
              // }, 1500)
              return
            }
          }
        }
      }
    },
    mounted () {
      // this.$refs.tab.isResetScroll = false
    }
  }
</script>
<style lang="less" scoped>
.evaAluate_control {
  .evaAluate_control_indicator {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
  }
  /deep/ .ant-table-tbody .tea-name {
    display: flex;
    align-items: center;
  }
  /deep/ .ant-table-fixed-right {
    .ant-table-fixed {
      .ant-table-tbody {
        display: none;
      }
    }
    .ant-table-filter-icon {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  /deep/ .set-select {
    box-shadow: -2px 0 6px -2px rgba(0, 0, 0, 0.2);
    .ivu-table-cell {
      padding: 0 !important;
    }
  }
  .ant-table-row-level-1 {
    .set-head-icon {
      .icon {
        display: none;
      }
    }
  }
  .ant-table-row-level-0 {
    .to-desc {
      cursor: pointer;
      color: #4196ff;
    }
  }
  /deep/ .set-head-icon {
    width: calc(100% - 25px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    // width: 100%;
    .icon {
      height: 32px;
    }
    > div {
      padding: 0;
    }
    > span {
      display: inline-block;
      width: 70%;
    }
    > .icon {
      display: inline;
    }
    > img {
        overflow: hidden;
        min-width: 32px;
        max-width: 32px;
        height: 32px;
        border-radius: 50%;
      }
      .head-con {
        display: inline-block;
        margin-right: 10px;
      }
  }
  /deep/ .hidden {
    display: none;
  }
  .show {
    display: inline !important;
  }
  /deep/ .is-show-dt {
    display: none;
  }
}
body {
   .setting-box {
    // display: none;
    // position: absolute;
    background-color: #fff;
    width: 152px;
    // height: 260px;
    padding-bottom: 10px;
    border-radius: 0px 0px 4px 4px;
    box-shadow: 0px 4px 6px 0px;
    // z-index: 999;
    // right: 20px;
    .setting-title {
      padding: 10px 20px;
      padding-top: 20px;
      color: rgba(0, 0, 0, 0.85);
    }
    /deep/ .ant-checkbox-group {
      label {
        width: 100%;
        height: 30px;
        padding-left: 20px;
      }
    }
    // .check-box {
    //   .ivu-checkbox-wrapper {
    //     padding: 6px 20px;
    //   }
    // }
  }
}
</style>
