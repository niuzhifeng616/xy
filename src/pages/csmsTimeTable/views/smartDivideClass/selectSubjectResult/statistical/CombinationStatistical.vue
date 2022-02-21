<!-- 2.选课结果：选课统计-组合统计 -->
<template>
  <div id="selectResult"
       class="xy-content-body"
       style="padding-left: 0;">
    <div v-for='(i,index) in dataTable'
         style="margin-bottom: 30px;"
         :key='index'>
      <div style="background: #f9f9f9;padding: 10px; display:flex; justify-content: space-between;">
        <p>
          {{index+1}}：{{i.ObjectName}}。
        </p>
        <p>{{i.count}}</p>
      </div>
      <XyAntTable :isPage='false'
                  :columns="i.columns"
                  :scrollx="'max-content'"
                  :dataSource="i.list"
                  nullData="该搜索条件下没有结果。"
                  :tableLoading="tableLoading">
        <template v-for='(item,cindex) in i .OrgInfo'>
          <div :slot="'SubjectCategoryName' + cindex"
               :key='cindex'
               slot-scope="text, record">
            <div style="min-width:100px">
              {{record['SubjectCategoryName' + cindex]}}
            </div>
          </div>
        </template>

      </XyAntTable>
      <!-- <Table ref="selection"
             class="thead-bg"
             :columns="i.columns"
             :data="i.list"></Table> -->
    </div>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: { XyAntTable },
    data () {
      return {
        dataTable: [],
        tableLoading: false
      }
    },
    mounted () {
      this.getTable()
    },
    methods: {
      async getTable () {
        this.xy.loading()
        let ids = this.$parent.classOrganizationIDs
        ids = ids.length > 0 ? ids.join(',') : ''
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetCombinationSelectInfo`, {
          StudentOrganizationIDS: ids,
          DivideClassID: this.$parent.$parent.divideClassID,
          DisciplineIDS: ''
        })
        if (res.success) {
          this.dataTable = []
          let reslut = res.data
          reslut.map((item) => {
            item.columns = []
            item.count = 0
            if (item.OrgInfo.length > 0) {
              for (let i = 0; i < item.OrgInfo.length; i++) {
                item.columns.push({
                  title: item.OrgInfo[i].StudentOrganizationFullName,
                  dataIndex: 'SubjectCategoryName' + i,
                  scopedSlots: { customRender: 'SubjectCategoryName' + i }
                })
                item.count += item.OrgInfo[i].SCount
              };
            }
            let subjectList = []
            subjectList = item.OrgInfo
            item.list = [{}]
            for (let j = 0; j < subjectList.length; j++) {
              item.list[0]['SubjectCategoryName' + j] = subjectList[j].SCount
            }
          })
          this.dataTable = reslut
        }
        this.xy.unloading()
      }
    }

  }
</script>
<style lang='less' scoped>
</style>
