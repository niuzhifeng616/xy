<template>
  <div class="evaAluate_result">
    <div class="evaAluate_result_select">
      <Dropdown @on-click="onClickExport" transfer>
        <Button type="primary">
          导出
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem :name="1">按老师导出</DropdownItem>
          <DropdownItem :name="2">按教学班导出</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <div class="evaAluate_result_indicator">
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
          <!--<button class="xy-primary" @click="doSearch">搜索</button>-->
        </div>
      </div>
    </div>
    <!--表格-->
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
  </div>
</template>
  <script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: {
      XyAntTable
    },
    name: 'Result',
    data () {
      return {
        isShow: true,
        tableLoading: false,
        copyList: [],
        searchList: [],
        show: false,
        isOpen: false,
        apiPath: `${this.xyApi}/eva`,
        // 方案ID
        projectId: '',
        // 选择课程的ID
        courseID: '0',
        // 课程列表
        courseList: [],
        // 搜索关键词
        searchText: '',
        // 原始表头
        sourceColumns: [],
        sourceData: [],
        searchNameList: [],
        teachingProjectID: this.$route.query.teachingProjectID * 1,
        chekedValue: '',
        noDataText: '该搜索条件下没有结果。',
        commText: '',
        columTwo: false,
        titleList: [],
        loading: false,
        order: 'asc',
        copyDtList: [],
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
        pickValue: []
      }
    },
    mounted () {
      this.getTab()
    },
    methods: {
      handleTableChange (pagination, filters, sorter) {
        // console.log(pagination, filters, sorter)
        // if (sorter) {
        // this.sortOrder = sorter.order
        this.columTwo = true
        this.sourceColumns[this.sourceColumns.length - 2].sortOrder = sorter.order
        // console.log(this.sourceColumns[this.sourceColumns.length - 2])
        this.order = sorter.order === 'ascend' ? 'asc' : (!sorter.order ? '' : 'desc')
        // }
        if (filters && filters.SubjectName && filters.SubjectName.length && this.sourceColumns.length && this.sourceColumns[1] && this.sourceColumns[1].filters && this.sourceColumns[1].filters.length) {
          let ft = this.sourceColumns[1].filters.filter(v => filters.SubjectName[0] === v.text)
          if (ft && ft.length) {
            this.chekedValue = ft[0].id
          }
        } else {
          this.chekedValue = ''
          this.sourceColumns[1].defaultFilteredValue = []
        }
        this.getTab()
      },
      // 导出
      onClickExport (name) {
        let params = {
          u: `${this.apiPath}/api/TeachingAssessReport/ExportTeachingResultSummaryTable`,
          d: JSON.stringify({
            assessProjectID: this.teachingProjectID,
            searchTxt: this.searchText,
            subjectID: this.chekedValue,
            RankOrderBy: this.order,
            reportType: name // 1:按教师;2:按教学班
          })
        }
        let routeData = this.$router.resolve({
          path: '/downLoad',
          query: params
        })
        window.open(routeData.href, '_blank')
      },
      // 搜索
      doSearch () {
        // console.log(this.chekedValue)
        // console.log(this.sourceColumns[1].filters)
        // console.log(this.sourceColumns[1].filters.filter(v => v.id === this.chekedValue))
        // 处理输入框搜索无条件，表格下拉筛选高亮显示的问题
        if (this.sourceColumns && this.sourceColumns.length && this.sourceColumns[1] && this.sourceColumns[1].filters && this.sourceColumns[1].filters.length && this.chekedValue) {
          let item = this.sourceColumns[1].filters.filter(v => v.id === this.chekedValue)
          if (item && item.length) {
            // console.log(item)
            this.sourceColumns[1].defaultFilteredValue = [item[0].value]
          }
        }
        // console.log(this.sourceColumns[1].defaultFilteredValue)
        // this.columTwo = false
        // this.chekedValue = ''
        this.pagination.current = 1
        this.getTab(true) // 重新获取表格数据
      },
      // 获取列表源数据
      async getTab (val) {
        // this.noDataText = val ? '该搜索条件下没有结果。' : '您还没有评价结果的信息，请添加评价指标。'
        // this.xy.loading()
        this.tableLoading = true
        const params = {
          assessProjectID: this.teachingProjectID,
          pageSize: this.pagination.pageSize,
          pageIndex: this.pagination.current,
          subjectID: this.chekedValue || '',
          searchTxt: this.searchText,
          rankOrderBy: this.order
        }
        let res = await this.xy.get(`${this.apiPath}/api/TeachingAssessReport/GetTeachingResultSummaryTable`, params)
        // this.xy.unloading()
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
                    index: index,
                    scopedSlots: { customRender: vv.key },
                    width: 'auto',
                    // width: index === 2 ? 'auto' : 200,
                    children: vv.children && vv.children.length ? vv.children.map(v => {
                      return {
                        title: v.title,
                        dataIndex: v.key
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
                  defaultFilteredValue: [],
                  width: 150,
                  filters: dt.Columns[1].filters.map(vv => {
                    return {
                      text: vv.label,
                      value: vv.label,
                      id: vv.value
                    }
                  })
                })
                Object.assign(this.sourceColumns[dt.Columns.length - 1], {
                  title: '名次',
                  // dataIndex: 'ObjectRanking',
                  fixed: 'right',
                  // key: 'ObjectRanking',
                  width: 120,
                  className: 'root',
                  // scopedSlots: {
                  //   filterDropdown: 'filterCloumn',
                  //   filterIcon: 'filterCloumnIcon'
                  // }
                  filterDropdown: ({ confirm, clearFilters }) => (
                    <div class="setting-box">
                      <p class="setting-title">设置显示字段</p>
                      <a-checkbox-group indeterminate={true} v-model={this.searchNameList} options={this.searchList.map(val => val.Value)} change={this.changeCloumes(this.searchNameList)} />
                    </div>
                  ),
                  filterIcon: filtered => <a-icon type="setting" class="filter-setting"/>
                })
                Object.assign(this.sourceColumns[dt.Columns.length - 2], {
                  fixed: 'right',
                  width: 120,
                  className: 'hover-tip',
                  sortOrder: 'ascend',
                  sortDirections: ['ascend', 'descend'],
                  sorter: true, // 实现排序Icon出现，开始交互排序
                  filterDropdown: true, // 自定义的列筛选功能，我们占位为信息提示Icon的位置
                  // 在这不写title的原因是ant design 内部有很多title，内部结构并没有对特殊的情况做处理，只接收一个title，
                  // 并覆盖不了默认是筛选。
                  filterIcon: () => {
                    return (
                      <a-tooltip placement="bottom">
                        <template slot="title">
                          <span>总分=平均分+标准分+排名分+标准分增量+排名分增量的权重分之和。</span>
                        </template>
                        <a-icon type="question-circle" class="filter-setting tip"/>
                      </a-tooltip>
                      )
                  }
                })
              }
            }
            // console.log(this.sourceColumns)
            // 复制可操作列2-倒数第2
            // this.copyList = JSON.parse(JSON.stringify(dt.Columns)).splice(2, dt.Columns.length - 4)
            this.copyList = JSON.parse(JSON.stringify(this.sourceColumns)).splice(2, this.sourceColumns.length - 4)
            // this.copyList = arDt.splice(2, arDt.length - 4)
            if (dt.Datas && dt.Datas.length) {
              // this.copyDtList = JSON.parse(JSON.stringify(dt.Datas))
              this.sourceData = dt.Datas
            } else {
              this.sourceData = []
            }
            this.pagination.total = res.data.TotalRecord
          }
        }
      },
      // 表格筛选
      changeCloumes (val) {
        // this.loading = true
        let arr = JSON.parse(JSON.stringify(this.sourceColumns)).splice(2, this.sourceColumns.length - 4).map(vv => vv.title)
        // 增
        if (val.length >= arr.length) {
          for (let item of val) {
            if (item && !arr.includes(item)) {
              for (let i in this.copyList) {
                if (item === this.copyList[i].title) {
                  // this.sourceData = this.copyDtList
                  this.sourceColumns.splice(i * 1 >= arr.length ? arr.length + 2 : i * 1 + 2, 0, this.copyList[i])
                  this.sourceColumns.sort((a, b) => {
                    return a.index - b.index
                  })
                  // setTimeout(() => {
                  //   this.loading = false
                  // }, 2000)
                  return
                }
              }
            }
          }
        } else {
          // 减
          if (val.length === 1) {
            this.pickValue = val
          } else if (!val.length || this.sourceColumns.length === 1) {
            this.searchNameList = this.pickValue
            return this.xy.msgError('筛选数据列至少保留一列。')
          }
          for (let v in arr) {
            if (arr[v] && !val.includes(arr[v])) {
              this.sourceColumns.splice(v * 1 + 2, 1)
              // setTimeout(() => {
              //   this.loading = false
              // }, 2000)
              return
            }
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.evaAluate_result {
  // overflow: hidden;
  .xy-table {
    min-height: 300px;
  }
  /deep/ .ivu-tooltip-popper {
    width: 250px;
  }
  .evaAluate_result_select {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    padding-left: 20px;
  }
  /deep/ .ant-table-tbody .tea-name {
    display: flex;
    align-items: center;
  }
  /deep/ .ant-table-fixed-right {
    // .ant-table-fixed {
    //   .ant-table-tbody {
    //     display: none;
    //   }
    // }
    .ant-table-filter-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hover-tip {
      .tip {
        color: #4196ff;
      }
      .ant-dropdown-trigger:hover {
        background: #e5e5e5 !important;
      }
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
  .show {
    display: inline !important;
  }
  /deep/ .setting {
    display: inline-block;
    margin-left: 6px;
  }
  /deep/ .name-set:hover {
    .setting {
      cursor: pointer;
      color: #4196ff;
    }
  }
  /deep/ .is-show-dt {
    display: none;
  }
  /deep/ .setting-box {
    // display: none;
    position: absolute;
    background-color: #fff;
    width: 152px;
    // height: 260px;
    border-radius: 0px 0px 4px 4px;
    box-shadow: 0px 4px 6px 0px;
    z-index: 999;
    right: 20px;
    padding-bottom: 10px;
    .setting-title {
      padding: 10px 20px;
      padding-top: 20px;
      color: rgba(0, 0, 0, 0.85);
    }
    .check-box {
      .ivu-checkbox-wrapper {
        padding: 6px 20px;
      }
    }
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
