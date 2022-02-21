<template>
<!-- 监考总表 -->
<div id="StepsContent" style="width:100%;">
  <div v-if="!isEmpty && !isInitial" class="xy-flex xy-justy-default" style="margin-bottom: 15px;">
      <Button @click="exportBtn" type="primary">导出</Button>
  </div>
  <XyAntTable
    :columns="columns"
    :dataSource="datatable"
    :tableLoading="tableLoading"
    @change="handleTableChange"
    :nullData="txt"
    :isPage="false"
    :isBorder="true"
    :scrollx="'max-content'"
    :isScroll="true"
  >
  </XyAntTable>
</div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: {
      XyAntTable
    },
    name: 'TotalForm',
    data () {
      return {
        txt: '您还没有监考总表的信息，请发布排考场方案。',
        tableLoading: true,
        isInitial: false, // 页面加载loading
        isEmpty: true, // 数据是否为空
        columns: [],
        datatable: [], // table数据
        ArrangeSupervisorExamID: 0
      }
    },
    props: ['ASExamID'],
    created () {
      this.ArrangeSupervisorExamID = this.ASExamID
      // 获取列表
      this.GetAllInvigilatorTableByID()
    },
    watch: {
      ASExamID: {
        handler (newVal, oldVal) {
          this.ArrangeSupervisorExamID = newVal
          this.GetAllInvigilatorTableByID()
        }
      }
    },
    methods: {
      handleTableChange () {
        this.GetAllInvigilatorTableByID()
      },
      // 获取列表内容
      async GetAllInvigilatorTableByID () {
        this.tableLoading = true
        // console.log(this.tableLoading)
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportSummary/GetAllInvigilatorTableByID`, {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID
        })
        this.tableLoading = false
        this.isInitial = false
        if (res.success) {
          if (res.data.DataHeader != null && res.data.DataHeader.length > 0) {
            // 表头
            let columns = res.data.DataHeader
            this.columns = [
              {
                title: '考场',
                dataIndex: 'RoomName',
                key: 'RoomName',
                fixed: 'left',
                width: 150
              },
              {
                title: '地点',
                dataIndex: 'AddressName',
                key: 'AddressName',
                width: 150,
                fixed: 'left'
              },
              {
                title: '人数',
                dataIndex: 'StudentCount',
                key: 'StudentCount'
              }
            ]
            for (let k = 0; k < columns.length; k++) {
              this.columns.push({
                title: columns[k].ExamDateName,
                children: columns[k].SubjectExamInfo,
                align: 'center'
              })
              for (let c = 0; c < columns[k].SubjectExamInfo.length; c++) {
                columns[k].SubjectExamInfo[c].title = columns[k].SubjectExamInfo[c].DateName
                columns[k].SubjectExamInfo[c].children = columns[k].SubjectExamInfo[c].SubjectInfo

                for (let y = 0; y < columns[k].SubjectExamInfo[c].SubjectInfo.length; y++) {
                  columns[k].SubjectExamInfo[c].SubjectInfo[y].dataIndex = columns[k].SubjectExamInfo[c].SubjectInfo[y].ColunmCode
                  columns[k].SubjectExamInfo[c].SubjectInfo[y].key = columns[k].SubjectExamInfo[c].SubjectInfo[y].ColunmCode
                  columns[k].SubjectExamInfo[c].SubjectInfo[y].title = columns[k].SubjectExamInfo[c].SubjectInfo[y].SubjectName
                }
              }
            }
            // console.log(this.columns)
            // 表内容
            this.datatable = res.data.DataBody
            this.isEmpty = false
          } else {
            this.isEmpty = true
          }
        }
      },

      // 导出
      exportBtn () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/ReportSummary/ExportAllInvigilatorTableByID`, {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID
        })
      }
    }
  }
</script>

<style lang="less" scoped>
#StepsContent {
  padding: 20px;
}

.nav-bg {
  background: #f9f9f9;
  width: 100%;
  height: 20px;
  position: absolute;
  top: 0;
  left: 0;
}

.steps-title {
  width: 1312px;
  height: 124px;
  background-image: url(/View/eaExamRoomManage/Image/report_nav.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 0;
  left: 50%;
  margin-left: -656px;
  z-index: 9;
}

.steps-title-content {
  width: 1120px;
  margin: 18px auto 0;
}

.steps-title-nav {
  flex: 5;
  padding-right: 30px;
  margin-right: 30px;
  border-right: 1px dashed #ccc;
}

.steps-title-nav>div {
  cursor: pointer;
  width: 14.3%;
}

.steps-title-content,
.steps-title-nav {
  display: flex;
  justify-content: space-between;
}

.steps-title-select {
  flex: 1;
}

.steps-title-select-top {
  margin-bottom: 10px;
}

.steps-title-select-top,
.steps-title-select-bottom {
  width: 220px;
}

.steps-title-nav-icon {
  width: 44px;
  text-align: center;
  height: 44px;
  line-height: 44px;
  border-radius: 50%;
  background: #f5f5f5;
  margin: 0 auto 10px;
}

.steps-title-nav-icon>i {
  font-size: 20px;
  color: #bebebe;
}

.steps-title-nav-name {
  text-align: center;
}

.steps-title-nav>div.active>div.steps-title-nav-icon {
  background: #4196ff;
}

.steps-title-nav>div.active>div.steps-title-nav-icon>i {
  color: #fff;
}

.steps-title-nav>div.active>div.steps-title-nav-name {
  color: #4196ff;
}
</style>
