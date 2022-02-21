<template>
  <div class="xy-content-module">
    <div class="xy-content-title">
      <Menu
        mode="horizontal"
        theme="light"
        :activeName="index"
        @on-select="changeIndex"
      >
        <MenuItem :name="1">汇总统计</MenuItem>
        <MenuItem :name="2">学生详情</MenuItem>
      </Menu>
    </div>
    <div class="xy-content-body">
      <Dropdown @on-click="onClickExport">
        <Button type="primary">
          导出
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem :name="1">当前老师</DropdownItem>
          <DropdownItem :name="2">所有老师</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <XyAntTable
        :columns="columns"
        :dataSource="tbData"
        :nullData="noDataText"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :isBorder="true"
        :isScroll="true"
        :isPage="isShowPage"
        :scrollx="'max-content'">
        <!-- <div slot="TeacherName" slot-scope="text, record" class="set-head-icon">
          <div class="icon">
            <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
              <span class="head-font">
                {{ xy.showName(record.TeacherName)}}
              </span>
            </div>
            <img class="head-img" v-else :src="$store.state.apiPath + record.Icon + '?' + Math.random() * 15">
          </div>
          <span v-text="record.TeacherName"></span>
        </div>
        <div slot="SegmentInc" slot-scope="text, record">
          <span class="to-desc" v-text="text" @click="toDesc(record)"></span>
        </div> -->
        <!-- <div slot="filterCloumn" style="position: relative">
          <a-icon
            slot="filterCloumnIcon"
            slot-scope="filtered"
            type="setting"
            :style="{ color: filtered ? '#108ee9' : undefined }"
          />
          <div class="setting-box">
            <p class="setting-title">设置显示字段</p>
            <a-checkbox-group :indeterminate="true" v-model="searchNameList" :options="searchList.map(val => val.Value)" @change="featchCloum()" />
          </div>
        </div> -->
      </XyAntTable>
      <!-- <XyTable
        :isShowPage="isShowPage"
        :tbData="tbData"
        :total="total"
        :pageIndex="pageIndex"
        :pageSize="pageSize"
        :noDataText="noDataText"
        @changePage="changePage"
        @changePageSize="changePageSize"
        :tbColumns="columns"
        ref="table"
        class="table"
      >
      </XyTable> -->
    </div>
  </div>
</template>
<script>
  // import XyTable from '@/components/table/XyTable.vue'
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: {
      XyAntTable
    },
    name: 'ControlDesc',
    data () {
      return {
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
        tbData: [],
        isShowPage: false,
        tableLoading: false,
        isInitial: true,
        columns: [],
        index: 1,
        apiPath: `${this.xyApi}/eva`,
        TeachingProjectID: this.$route.query.teachingProjectID * 1,
        AssessObjectID: this.$route.query.AssessObjectID * 1,
        noDataText: '',
        columTwo: false,
        assessObjectClassID: null,
        studentList: [],
        studentDt: [],
        countList: [],
        countDt: [],
        changeColum: false
      }
    },
    mounted () {
      this.changeTab(this.index)
    },
    methods: {
      handleTableChange (pagination, filters, sorter) {
        this.columTwo = false
        if (filters && filters.TeachClassName && filters.TeachClassName.length && this.columns.length && this.columns[1] && this.columns[1].filters && this.columns[1].filters.length) {
          let ft = this.columns[1].filters.filter(v => filters.TeachClassName[0] === v.text)
          if (ft && ft && ft.length) {
            this.assessObjectClassID = ft[0].id
          }
        } else {
          this.assessObjectClassID = null
        }
        this.changeTab(this.index)
      },
      changeIndex (val) {
        this.index = val
        if (!this.columTwo) {
          this.changeTab(val)
        } else {
          if (this.index === 1) {
            this.columns = this.countList
            this.tbData = this.countDt
            this.isShowPage = false
          } else {
            this.columns = this.studentList
            this.tbData = this.studentDt
            this.isShowPage = true
          }
        }
      },
      // 导出
      onClickExport (name) {
        let all = name === 1 ? this.AssessObjectID : 0
        let params = {
          u: `${this.apiPath}/api/TeachingAssessReport/ExportSegmentIncDetailSummaryTable`,
          d: JSON.stringify({
            assessProjectID: this.TeachingProjectID,
            assessObjectID: all
          })
        }
        let routeData = this.$router.resolve({
          path: '/downLoad',
          query: params
        })
        window.open(routeData.href, '_blank')
      },
      changeTab (val) {
        if (val === 1) {
          this.noDataText = '您还没有汇总统计的信息，请添加汇总统计。'
          this.isShowPage = false
          let tableUrl = `${this.apiPath}/api/TeachingAssessReport/GetSegmentIncDetailSummaryTable`
          let params = {
            assessProjectID: this.TeachingProjectID,
            assessObjectID: this.AssessObjectID
          }
          // ]
          this.fetchTab(1, tableUrl, params)
        } else {
          this.noDataText = '您还没有学生详情的信息，请添加学生详情。'
          this.isShowPage = true
          let tableUrl = `${this.apiPath}/api/TeachingAssessReport/GetSegmentIncStudentDetailSummaryTable`
          let params = {
            assessProjectID: this.TeachingProjectID,
            assessObjectID: this.AssessObjectID,
            assessObjectClassID: this.assessObjectClassID,
            pageSize: this.pagination.pageSize,
            pageIndex: this.pagination.current
          }
          this.fetchTab(2, tableUrl, params)
        }
      },
      async fetchTab (index, url, params) {
        // this.xy.loading()
        this.tableLoading = true
        let res = await this.xy.get(url, params)
        // this.xy.unloading()
        this.tableLoading = false
        if (res.success) {
          // console.log(res)
          if ((!this.columTwo && index === 2) || index === 1) {
            if (index === 1) {
              this.countList = res.data.Columns.map(vv => {
                return {
                  title: vv.title,
                  dataIndex: vv.key,
                  children: vv.children && vv.children.length ? vv.children.map(vs => {
                    return {
                      title: vs.title,
                      dataIndex: vs.key
                    }
                  }) : null
                }
              })
              this.countDt = res.data.Datas
              Object.assign(this.countList[0], {
                tree: true,
                width: 300
              })
              this.columns = this.countList
              this.tbData = this.countDt
            } else {
              this.studentList = res.data.Table.Columns.map((vv, index) => {
                if (index === 0) {
                  vv.width = 'auto'
                  vv.fixed = 'left'
                }
                return {
                  title: vv.title,
                  dataIndex: vv.key,
                  // width: 150,
                  // fixed: index === 0 || index === 1 ? 'left' : false,
                  // width: index === 0 || index === 1 ? 'auto' : 200,
                  children: vv.children && vv.children.length ? vv.children.map(vc => {
                    // vc.width = 120
                    return {
                      title: vc.title,
                      dataIndex: vc.key,
                      width: 100
                    }
                  }) : null
                }
              })
              Object.assign(this.studentList[0], {
                fixed: 'left',
                width: 80
              })
              this.studentDt = res.data.Table.Datas
              this.pagination.total = res.data.TotalRecords
              if (!this.columTwo) {
                this.columTwo = true
                Object.assign(this.studentList[1], {
                  filterMultiple: false,
                  fixed: 'left',
                  width: 150,
                  filters: res.data.Table.Columns[1] && res.data.Table.Columns[1].filters && res.data.Table.Columns[1].filters.length ? res.data.Table.Columns[1].filters.map(vv => {
                    return {
                      text: vv.label,
                      value: vv.label,
                      id: vv.value
                    }
                  }) : []
                //   filterRemote: (val) => {
                //     this.assessObjectClassID = val[0]
                //     this.columTwo = false
                //     this.changePage(1)
                //   }
                })
              }
              // console.log(this.studentList)
              if (!this.changeColum) {
                this.changeColum = true
                this.columns = this.studentList
              }
              this.tbData = this.studentDt
            }
            // console.log(this.columns)
          }
        }
      }
      // changePage (i) {
      //   this.pageIndex = i
      //   this.columTwo = false
      //   this.changeTab(this.index)
      // },
      // changePageSize (size) {
      //   this.pageIndex = 1
      //   this.pageSize = size
      //   this.columTwo = false
      //   this.changeTab(this.index)
      // }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-body {
  /deep/ .ivu-dropdown {
    padding: 20px;
    padding-top: 0;
  }
  .table {
    margin: 0 20px;
  }
}
</style>
