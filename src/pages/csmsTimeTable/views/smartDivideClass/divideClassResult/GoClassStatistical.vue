<!-- 5.优化分班：走班统计 -->
<template>
  <div class="xy-content-body">
    <div class="xy-content-body">
      <div class="clearfix text-right" style="margin-bottom:10px;">
        <Button style="margin: auto 0" class="xy-primary" @click="exportFile">导出</Button>
        <div @click="goBack" class="back">
          <i class="iconfont">&#xe6a5;</i>
          <span>返回</span>
        </div>
      </div>
      <div>
        <XyAntTable :columns="columns"
                    :isPage="false"
                    :scrollx="'max-content'"
                    :dataSource="dataTable"
                    nullData="暂无班级统计的信息。"
                    :tableLoading="tableLoading">
          <span slot="PersonCountRender" slot-scope="text, record">
            {{record.PersonCount + '人'}}
          </span>
        </XyAntTable>
      </div>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    name: 'GoClassStatistical',
    components: { XyAntTable },
    data () {
      return {
        tableLoading: true,
        dataTable: [],
        columns: [],
        smartDivideStepsHeader: {}
      }
    },
    created () {
      this.smartDivideStepsHeader = this.$parent
      this.getTable()
    },
    methods: {
      async getTable () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetMovingClassStatistics?divideClassID=${this.smartDivideStepsHeader.divideClassID}`)
        if (res.success) {
          let datas = res.data
          this.dataTable = []
          this.columns = []
          this.columns = [
            {
              title: '班级名称',
              dataIndex: 'CollectionName',
              width: 120,
              fixed: 'left'
            },
            {
              title: '走班总人数',
              dataIndex: 'PersonCount',
              width: 120,
              fixed: 'left',
              scopedSlots: { customRender: 'PersonCountRender' }
            },
            {
              title: '走班选考',
              dataIndex: 'SelectDiscipline'
            },
            {
              title: '走班学考',
              dataIndex: 'AcademicDiscipline'
            }
          ]
          if (datas.Discipline.length > 0) {
            for (let i = 0; i < datas.Discipline.length; i++) {
              this.columns.push({
                title: datas.Discipline[i],
                dataIndex: 'result' + i,
                width: 140
              })
            };
          }
          for (let j = 0; j < datas.Collection.length; j++) {
            if (datas.Collection[j].DisciplinePersonCount.length > 0) {
              for (let k = 0; k < datas.Collection[j].DisciplinePersonCount.length; k++) {
                datas.Collection[j]['result' + k] = datas.Collection[j].DisciplinePersonCount[k]
              }
            };
          }
          this.dataTable = datas.Collection
        }
        this.tableLoading = false
      },
      exportFile () {
        if (this.dataTable.length > 0) {
          this.xy.downFile(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/ExportMovingClassStatistics`, {
            divideClassID: this.smartDivideStepsHeader.divideClassID
          })
        } else {
          this.xy.msgError('暂无数据导出。')
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
