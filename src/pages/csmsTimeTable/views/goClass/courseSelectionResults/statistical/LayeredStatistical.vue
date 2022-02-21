<!-- 分层统计 -->
<template>
  <div class="xy-content-body"
       style="padding-left: 0;">
    <div v-if='dataTableList.length>0'>
      <div v-for='(i,index) in dataTableList'
           :key="index"
           style="margin-bottom: 30px;">
        <Table :columns="i[0].columns"
               :data="i"></Table>
               <!-- XyAntTable数据太大会卡 -->
        <!-- <XyAntTable :isPage='false'
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
        </XyAntTable> -->
      </div>
    </div>
    <div v-if='!dataTableList.length'
         class="no-data-box">
      <img class="no-data-img"
           src="@/assets/common/nullData.svg"
           alt="图片" />
      <span class="no-data-text">该搜索条件下没有结果。</span>
    </div>
  </div>
</template>
<script>
// import XyAntTable from '@/components/table/XyAntTable'
  export default {
    name: 'layered',
    // components: { XyAntTable },
    props: {
      classOrganizationIDs: {
        type: Array,
        required: false
      }
    },
    data () {
      return {
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        tableLoading: false,
        dataTableList: []
      }
    },
    watch: {
      classOrganizationIDs: {
        handler: function (val, old) {
          if (this.classTableID && val.length > 0) {
            this.getTable()
          }
        },
        deep: true
      }
    },
    created () {
      if (this.classTableID && this.classOrganizationIDs.length > 0) {
        this.getTable()
      }
    },
    methods: {
      async getTable () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassSubjectSetting/GetMovingClassGroupSelectInfo`, {
          ClassTableID: this.classTableID,
          StudentOrganizationIDS: this.classOrganizationIDs
        })
        if (res.success) {
          this.dataTableList = []
          res.data.map((item) => {
            item.map((t, i) => {
              t.columns = []
              t.columns = [
                {
                  title: '课程名称',
                  fixed: 'left',
                  key: 'ObjectName',
                  minWidth: 200
                  // dataIndex: 'ObjectName',
                  // width: 150
                },
                {
                  title: '总计',
                  key: 'Total',
                  // dataIndex: 'Total',
                  width: 150
                }
              ]
              if (t.OrgInfo.length > 0) {
                for (var k = 0; k < t.OrgInfo.length; k++) {
                  t.columns.push({
                    title: t.OrgInfo[k].StudentOrganizationFullName,
                    key: 'SubjectCategoryName' + k,
                    minWidth: 150
                  // dataIndex: 'SubjectCategoryName' + k,
                  // width: 180
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
          this.$emit('isExportFun', !!this.dataTableList.length)
        }
        this.xy.unloading()
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
