<!--  -->
<template>
  <div id="selectResult"
       class="xy-content-body"
       style="padding-left: 0;">
    <div v-if='dataTableList.length>0'>
      <div v-for='(i,index) in dataTableList'
           style="margin-bottom: 30px;"
           :key='index'>
        <Table ref="selection"
                 :columns="i[0].columns"
                 :data="i"></Table>

      </div>
    </div>
  </div>
</template>

<script>

  export default {
    components: {},
    data () {
      return {
        // 表格
        dataTableList: []
      }
    },
    mounted: function () {
      this.getTable()
    },

    methods: {
      async getTable () {
        let that = this
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/GetGroupSelectInfo`, {
          StudentOrganizationIDS: this.$parent.classOrganizationIDs,
          LayeredSelectProgrammeID: this.$parent.$parent.layeredStepsHeader.LayeredSelectProgrammeID,
          LayeredSelectRotationID: this.$parent.$parent.layeredStepsHeader.LayeredSelectRotationID
        })

        if (res.success) {
          this.xy.unloading()
          that.dataTableList = []
          res.data.map(function (item) {
            item.map(function (t, i) {
              t.columns = []
              t.columns = [{
                             title: '课程名称',
                             key: 'ObjectName',
                             minWidth: 200,
                             fixed: 'left'
                           },
                           {
                             title: '总计',
                             key: 'Total',
                             width: 150
                           }
              ]
              if (t.OrgInfo.length > 0) {
                for (let k = 0; k < t.OrgInfo.length; k++) {
                  t.columns.push({
                    title: t.OrgInfo[k].StudentOrganizationName,
                    key: 'SubjectCategoryName' + k,
                    minWidth: 150
                  })
                };
              }
            })
          })

          let dataTableList = []
          let dataTable = []
          res.data.map(function (item) {
            dataTable = item
            for (let i = 0; i < item.length; i++) {
              let subjectList = []
              subjectList = item[i].OrgInfo
              for (let j = 0; j < subjectList.length; j++) {
                item[i]['SubjectCategoryName' + j] = subjectList[j].SCount
              }
            }
            dataTableList.push(dataTable)
          })
          that.dataTableList = dataTableList
        } else {
          this.xy.unloading()
          that.xy.msgError(res.msg)
        };
      }

    }

  }
</script>
<style lang='less' scoped>
</style>
