<!-- 分层统计 -->
<template>
  <div class="xy-content-body"
       style="padding-left: 0;">
    <div v-if='dataTableList.length>0'>
      <div v-for='(i,index) in dataTableList'
           :key="index"
           style="margin-bottom: 30px;">
        <!-- <Table ref="selection" :columns="i[0].columns" :data="i"></Table> -->
        <XyAntTable :isPage='false'
                    :columns="i[0].columns"
                    :scrollx="'max-content'"
                    :dataSource="i"
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
      </div>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    name: 'statLayered',
    components: { XyAntTable },
    props: {
      LayeredSelectProgrammeID: {
        type: Number,
        required: true
      },
      LayeredSelectRotationID: {
        type: Number,
        required: true
      },
      classOrganizationIDs: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        // 表格
        tableLoading: false,
        dataTableList: []
      }
    },
    created () {
    },
    mounted () {
      if (this.LayeredSelectProgrammeID !== 0 && this.classOrganizationIDs.length > 0) {
        this.getTable()
      }
    },
    methods: {
      async getTable () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredStatisticalAnalysis/GetGroupSelectInfo`, {
          StudentOrganizationIDS: this.classOrganizationIDs,
          LayeredSelectProgrammeID: this.LayeredSelectProgrammeID,
          LayeredSelectRotationID: this.LayeredSelectRotationID
        })
        if (res.success) {
          this.dataTableList = []
          res.data.map((item) => {
            item.map((t, i) => {
              t.columns = []
              t.columns = [
                {
                  title: '课程名称',
                  dataIndex: 'ObjectName',
                  fixed: 'left',
                  width: 150
                },
                {
                  title: '总计',
                  dataIndex: 'Total',
                  width: 150
                }
              ]
              if (t.OrgInfo.length > 0) {
                for (var k = 0; k < t.OrgInfo.length; k++) {
                  t.columns.push({
                    title: t.OrgInfo[k].StudentOrganizationName,
                    dataIndex: 'SubjectCategoryName' + k,
                    width: 180
                  })
                };
              }
            })
          })

          var dataTableList = []
          var dataTable = []
          res.data.map((item) => {
            dataTable = item
            for (var i = 0; i < item.length; i++) {
              var subjectList = []
              subjectList = item[i].OrgInfo
              for (var j = 0; j < subjectList.length; j++) {
                item[i]['SubjectCategoryName' + j] = subjectList[j].SCount
              }
            }
            dataTableList.push(dataTable)
          })
          this.dataTableList = dataTableList
        }
        this.xy.unloading()
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
