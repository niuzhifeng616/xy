<!-- 5.优化分班：班级统计 -->
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
          <span slot="PersonNumber"
                slot-scope="text, record">
            {{record.PersonNumber + '人' + '(' + record.MaleNumber + '/' + record.FemaleNumber + ')'}}
          </span>
          <span slot="DisciplineGroup"
                slot-scope="text, record">
            <a-button size='small' v-if='record.DisciplineGroup.length>0'
                      @click="showCombination(record.DisciplineGroup)">
              {{record.DisciplineGroup.length+'种'}}
            </a-button>
          </span>
        </XyAntTable>
      </div>
    </div>
    <modal v-model="combinationModal"
           :transfer="false"
           title="查看组合"
           :mask-closable="false"
           width=550>
      <div v-if="combinationData.length>0"
           style="margin: 10px 0">
        <span v-for='(item,index) in combinationData'
              :key='index'
              class="combination-name">{{item}}</span>
      </div>
      <div slot="footer">
        <Button class="xy-modal-primary" shape="circle" @click="cancel">关闭</Button>
      </div>
    </modal>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    name: 'ClassStatistical',
    components: { XyAntTable },
    data () {
      return {
        isSelectNum: 1,
        tableLoading: true,
        dataTable: [],
        columns: [],
        combinationModal: false,
        combinationData: [],
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
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetDivideClassCollectionStatistics?divideClassID=${this.smartDivideStepsHeader.divideClassID}`)
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
              title: '人数(男/女)',
              dataIndex: 'PersonNumber',
              width: 120,
              fixed: 'left',
              scopedSlots: { customRender: 'PersonNumber' }
            },
            {
              title: '固定选考',
              dataIndex: 'SelectDiscipline'
            },
            {
              title: '固定学考',
              dataIndex: 'AcademicDiscipline'
            },
            {
              title: '走班选考',
              dataIndex: 'ShiftSelectDiscipline'
            }, {
              title: '走班学考',
              dataIndex: 'ShiftAcademicDiscipline'
            },
            {
              title: '组合数',
              dataIndex: 'DisciplineGroup',
              width: 100,
              scopedSlots: { customRender: 'DisciplineGroup' }
            },
            {
              title: '固定选考总分',
              dataIndex: 'SelectDisciplineScore',
              width: 120
            }
          ]
          if (datas.Discipline.length > 0) {
            for (let i = 0; i < datas.Discipline.length; i++) {
              this.columns.push({
                title: datas.Discipline[i],
                dataIndex: 'result' + i,
                width: 120
              })
            };
          }
          for (let j = 0; j < datas.Collection.length; j++) {
            if (datas.Collection[j].DisciplineAchievement.length > 0) {
              for (let k = 0; k < datas.Collection[j].DisciplineAchievement.length; k++) {
                datas.Collection[j]['result' + k] = datas.Collection[j].DisciplineAchievement[k]
              }
            };
          }
          this.dataTable = datas.Collection
        }
        this.tableLoading = false
      },
      exportFile () {
        if (this.dataTable.length > 0) {
          this.xy.downFile(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/ExportDivideClassCollectionStatistics`, {
            divideClassID: this.smartDivideStepsHeader.divideClassID
          })
        } else {
          this.xy.msgError('暂无数据导出。')
        }
      },
      showCombination (data) {
        if (data.length > 0) {
          this.combinationData = data
          this.combinationModal = true
        }
      },
      cancel () {
        this.combinationModal = false
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
.combination-name {
  display: inline-block;
  width: 33%;
  text-align: center;
  padding: 10px;
}
</style>
