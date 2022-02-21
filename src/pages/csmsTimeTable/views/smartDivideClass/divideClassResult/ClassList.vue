<!-- 5.优化分班：班级名单 -->
<template>
  <div id="StepsHeader">
    <div class="xy-content-title clearfix">
      <div class="fl">
        <Button :class="isOriginalOrg?'':'xy-primary'"
                @click="loadComplete(false)"
                style="margin-right:10px;">现行政班</Button>
        <Button :class="isOriginalOrg?'xy-primary':''"
                @click="loadComplete(true)">原行政班</Button>
      </div>
      <div class="fr pr">
        <i-select v-model="StudentOrganizationID"
                  class="fl xy-content-title-search"
                  style="width:200px"
                  @on-change="changeClass">
          <i-option v-for="item in moreClassList"
                    :value="item.StudentOrganizationID"
                    :key="item.StudentOrganizationID">{{ item.StudentOrganizationName }}</i-option>
        </i-select>
        <a-input-search v-model.trim="searchText" placeholder="请输入用户名/学籍号/姓名" allowClear @search='FromSubmit' class="xy-content-title-search" style="width: auto;" />
        <Button @click="exportFile(1)"
                style="margin-left:15px">导出</Button>
        <div @click="goBack" class="back">
          <i class="iconfont">&#xe6a5;</i>
          <span>返回</span>
        </div>
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable :columns="columns"
                  :dataSource="dataTable"
                  nullData="该搜索条件下没有结果。"
                  :tableLoading="tableLoading"
                  :pagination="pagination"
                  :scrollx="'max-content'"
                  @change="handleTableChange">
        <div slot="Icon"
             slot-scope="text, record">
          <div v-if="!record.Icon"
               :class="`head-con ${!record.Sex? 'woman' : 'man'}`">
            <span class="head-font">
              {{ xy.showName(record.FullName)}}
            </span>
          </div>
          <img style="width:30px;height:30px;border-radius:50%"
               v-else
               :src="record.Icon + '?' + Math.random() * 15" />
        </div>
        <span slot="Sex"
              slot-scope="text, record">
          {{record.Sex ? '男' : '女'}}
        </span>
        <div slot="FixedDiscipline" style="min-width:150px;"
              slot-scope="text, record">
          {{record.FixedDiscipline }}
        </div>
      </XyAntTable>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    name: 'ClassList',
    components: { XyAntTable },
    data () {
      return {
        isOriginalOrg: false, // true原行政班;false现行政班
        searchText: '',
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
        columns: [],
        // 筛选班级
        StudentOrganizationID: 0,
        moreClassList: [],
        smartDivideStepsHeader: {}
      }
    },
    created () {
      this.smartDivideStepsHeader = this.$parent
      this.getClass()
    },
    methods: {
      // 获取班级
      async getClass () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetClassListCollection`, {
          divideClassID: this.smartDivideStepsHeader.divideClassID,
          isOriginalOrg: this.isOriginalOrg
        })
        if (res.success) {
          this.moreClassList = res.data
          this.dataTable = []
          if (this.moreClassList.length > 0) {
            this.StudentOrganizationID = this.moreClassList[0].StudentOrganizationID
            this.getTable()
          }
        }
      },
      changeClass () {
        this.pagination.current = 1
        this.getTable()
      },
      loadComplete (type) {
        this.isOriginalOrg = type
        this.searchText = ''
        this.pagination.current = 1
        this.getClass()
      },
      handleTableChange () {
        this.getTable()
      },
      async getTable () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetPageDivideClassCollection`, {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          divideClassID: this.smartDivideStepsHeader.divideClassID,
          studentOrganizationID: this.StudentOrganizationID,
          isOriginalOrg: this.isOriginalOrg,
          name: this.searchText
        })
        if (res.success) {
          let resData = res.data
          this.pagination.total = resData.Result.totalRecords
          this.pageList = resData.Result.data.length
          this.dataTable = []
          this.columns = []
          this.columns = [
            {
              title: ' ',
              dataIndex: 'Icon',
              width: 48,
              scopedSlots: { customRender: 'Icon' },
              className: 'table-pic',
              fixed: 'left'
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
              dataIndex: 'Sex',
              scopedSlots: { customRender: 'Sex' },
              width: 80
            },
            {
              title: '原行政班',
              dataIndex: 'StudentOrganizationName'
            },
            {
              title: '选课组合',
              dataIndex: 'SelectDiscipline',
              width: 150
            },
            {
              title: '固定组合',
              dataIndex: 'FixedDiscipline',
              scopedSlots: { customRender: 'FixedDiscipline' }
            },
            {
              title: '走班科目',
              dataIndex: 'ShiftDiscipline',
              width: 150
            }
          ]
          for (let i = 0; i < resData.Discipline.length; i++) {
            this.columns.push({
              title: resData.Discipline[i],
              width: 100,
              dataIndex: 'result' + i
            })
          };
          for (let j = 0; j < resData.Result.data.length; j++) {
            if (resData.Result.data[j].DisciplineScore.length > 0) {
              for (let k = 0; k < resData.Result.data[j].DisciplineScore.length; k++) {
                resData.Result.data[j]['result' + k] = resData.Result.data[j].DisciplineScore[k]
              }
            };
          }
          this.dataTable = resData.Result.data
        }
        this.tableLoading = false
      },
      FromSubmit () {
        this.pagination.current = 1
        this.getTable()
      },
      exportFile () {
        let that = this
        if (this.dataTable.length > 0) {
          this.xy.downFile(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/ExportDivideClassCollection`, {
            divideClassID: this.smartDivideStepsHeader.divideClassID,
            studentOrganizationID: that.StudentOrganizationID,
            isOriginalOrg: that.isOriginalOrg,
            name: that.searchText
          })
        } else {
          this.xy.msgError('暂无导出数据。')
        }
      },
      goBack () {
        this.$router.go(-1)
      }

    }

  }
</script>
<style lang='less' scoped>
.back {
  color: #1890ff;
  display: inline-block;
  margin-left: 15px;
  cursor: pointer;
  .iconfont {
    margin-right: 5px;
    font-size: 14px;
  }
}
</style>
