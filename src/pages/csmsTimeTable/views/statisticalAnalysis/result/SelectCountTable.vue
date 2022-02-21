<template>
  <div id="selectResult">
    <div>
      <!-- <Table  ref="selection" :columns="columns" :data="dataTable"></Table >
        <div class="text-right" style="margin-top:10px;">
            <page :total="total" :page-size="pageSize" :current="pageCurrent" :page-size-opts="pages"
                  show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize"></page>
        </div> -->
      <XyAntTable :columns="columns"
                  :dataSource="dataTable"
                  nullData="该搜索条件下没有结果。"
                  :tableLoading="tableLoading"
                  :pagination="pagination"
                  :scrollx="'max-content'"
                  @change="handleTableChange">
        <div slot="Icon" slot-scope="text, record">
          <div v-if="!record.Icon" :class="`head-con ${record.SexName === '女' ? 'woman' : 'man'}`">
            <span class="head-font">
              {{ xy.showName(record.FullName)}}
            </span>
          </div>
          <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
        </div>
      </XyAntTable>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    name: 'statSelectCountTable',
    components: { XyAntTable },
    props: {
      searchText: {
        type: String,
        required: true
      },
      classOrganizationIDs: {
        type: Array,
        required: true
      },
      LayeredSelectProgrammeID: {
        type: Number,
        required: true
      },
      LayeredSelectRotationID: {
        type: Number,
        required: true
      },
      selectNum: {
        type: Number,
        required: true,
        default: 0
      }
    },
    data () {
      return {
        getAllClassed: false,

        StudentID: '',
        // 已选学生
        SelectCount: 0,
        UnSelectCount: 0,

        // table
        tableLoading: true,
        pagination: {
          total: 0,
          current: 1,
          pageSize: 15,
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        dataTable: [],
        columns: []
      }
    },
    created () {
      this.getAllClassed = this.$parent.getAllClassed
    },
    watch: {
      showPage (val) {
        if (val === 'result' && this.getAllClassed) {
          this.getStudentSelectPage()
        }
      },
      selectNum (val, oldval) {
        if (val !== oldval) {
          this.pagination.current = 1
          this.getStudentSelectPage()
        }
      }
    },
    methods: {
      // 获取选课结果（学生）
      async getStudentSelectPage () {
        this.tableLoading = true
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredStatisticalAnalysis/GetPage`, {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          SeachText: this.searchText,
          StudentOrganizationIDS: this.classOrganizationIDs,
          LayeredSelectProgrammeID: this.LayeredSelectProgrammeID,
          LayeredSelectRotationID: this.LayeredSelectRotationID,
          Type: this.selectNum
        })
        if (res.success) {
          var datas = res.data
          this.SelectCount = datas.SelectCount
          this.UnSelectCount = datas.UnSelectCount
          this.$emit('getTotal', [this.SelectCount, this.UnSelectCount])
          this.pagination.total = datas.Result.totalRecords
          this.dataTable = []
          this.columns = []
          this.columns = [
            {
              title: ' ',
              dataIndex: 'Icon',
              fixed: 'left',
              width: 48,
              className: 'table-pic',
              scopedSlots: { customRender: 'Icon' }
            },
            {
              title: '姓名',
              dataIndex: 'FullName',
              width: 150,
              fixed: 'left'
            },
            {
              title: '用户名',
              dataIndex: 'UserName',
              width: 150,
              fixed: 'left'
            },
            {
              title: '性别',
              dataIndex: 'SexName',
              width: 80
            },
            {
              title: '行政班',
              dataIndex: 'StudentOrganizationFullName',
              width: 180
            }
          ]

          for (var i = 0; i < datas.Courses.length; i++) {
            this.columns.push({
              title: datas.Courses[i].SubjectName || datas.Courses[i].SexName,
              dataIndex: 'result' + i,
              width: 100
            })
          };

          var resData = datas.Result.data
          for (var j = 0; j < resData.length; j++) {
            if (resData[j].Courses.length > 0) {
              for (var k = 0; k < resData[j].Courses.length; k++) {
                resData[j]['result' + k] = resData[j].Courses[k].Name
              }
            };
          }
          this.dataTable = resData
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.getStudentSelectPage()
      },
      // -----------------调整选课弹窗-------------------
      chooseSub (item, index) {
        if (item.checked) {
          this.selected(item)
        } else {
          this.cancelSelected(item)
        }
      },
      chooseLayered (item, index, t) {
        if (t.checked) {
          this.list[index].Children.map((k) => {
            k.disabled = true
            k.checked = false
            if (k.ObjectID === t.ObjectID) {
              k.disabled = false
              k.checked = true
            }
          })
          this.selected(t, item)
        } else {
          this.list[index].Children.map((k) => {
            k.disabled = false
            k.checked = false
          })
          this.cancelSelected(t, item)
        }
        this.list.splice(0, 0)
      }

    }
  }
  </script>
  <style lang="less" scoped>
</style>
