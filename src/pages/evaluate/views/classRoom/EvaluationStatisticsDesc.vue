<template>
  <!-- 评价统计（行政班）详情页 -->
<div class="xy-content-module">
  <div class="xy-content-body">
    <table id="TableData" v-show="arrHtml.length>0">
      <thead>
        <tr>
          <th>课程</th>
          <th>一级指标</th>
          <th>二级指标</th>
          <th>三级指标</th>
          <th>{{colType===1?'总得星数':colType===2?'总得分':'总得星数/得分'}}</th>
          <th>评价次数</th>
          <th>{{colType===1?'平均得星数':colType===2?'平均得分':'平均得星数/得分'}}</th>
          <th>{{colType===1?'一级指标得星数':colType===2?'一级指标得分':'一级指标星数/得分'}}</th>
          <th>权重</th>
          <th>{{colType===1?'课程得星数（加权后）':colType===2?'课程得分（加权后）':'课程得星数/得分（加权后）'}}</th>
          <th>课程得分</th>
        </tr>
      </thead>
      <tbody id="tBody" v-html="arrHtml">
      </tbody>
    </table>
    <div v-show="arrHtml.length==0" class="no-data-box">
      <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片" style="width:100%"/>
      <span class="no-data-text">暂无相关数据</span>
    </div>
  </div>
</div>
</template>
<script>
  export default {
    name: 'EvaluationStatisticsDesc',
    data () {
      return {
        colType: 1,
        arrHtml: '',
        newObj: []
      }
    },
    mounted () {
      this.loadTable()
    },
    methods: {
      async loadTable () {
        this.xy.loading()
        let obj = JSON.parse(this.$route.query.params)
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassEvaluationStatistics/GetAdministrativeClassDetail`, {
          SessionID: obj.SessionID,
          SchoolDistrictID: obj.SchoolDistrictID,
          StudentYearID: obj.StudentYearID,
          StudentOrgID: obj.StudentOrgID,
          StudentID: obj.StudentID,
          StartTime: obj.StartTime,
          EndTime: obj.EndTime
        })
        if (res.success) {
          let _obj = []
          this.newObj = []
          this.colType = res.data.colType
          res.data.data.forEach(element => {
            _obj[element['课程']] = _obj[element['课程']] || {}
            _obj[element['课程']][element['1级指标']] = _obj[element['课程']][element['1级指标']] || {}
            _obj[element['课程']][element['1级指标']][element['2级指标']] = _obj[element['课程']][element['1级指标']][element['2级指标']] || []
            _obj[element['课程']][element['1级指标']][element['2级指标']].push(element)
          })
          this.newObj = _obj
          this.renderTable(_obj)
        }
        this.xy.unloading()
      },
      renderTable (obj) {
        this.arrHtml = ``
        for (let i in this.newObj) {
          let titleBool = true
          for (let j in this.newObj[i]) {
            let projectBool = true
            for (let k in this.newObj[i][j]) {
              let twoBool = true
              for (let v in this.newObj[i][j][k]) {
                let data = this.newObj[i][j][k][v]
                this.arrHtml += `<tr>`
                this.arrHtml += titleBool ? `<td rowspan="${this.getChildrenNum(obj[i])}"><div>${data['课程']}</div></td>` : ''
                this.arrHtml += projectBool ? `<td rowspan="${this.getChildrenNum(obj[i][j])}"><div>${data['1级指标']}</div></td>` : ''
                this.arrHtml += twoBool ? `<td rowspan="${this.getChildrenNum(obj[i][j][k])}"><div>${data['2级指标']}</div></td>` : ''
                this.arrHtml += `<td><div>${data['3级指标']}</div></td>`
                this.arrHtml += `<td><div>${this.colType === 1 ? data['总得星数'] : this.colType === 2 ? data['总得分'] : data['总得星数/得分']}</div></td>`
                this.arrHtml += `<td><div>${data['评价次数']}</div></td>`
                this.arrHtml += `<td><div>${this.colType === 1 ? data['平均得星数'] : this.colType === 2 ? data['平均得分'] : data['平均得星数/得分']}</div></td>`
                this.arrHtml += projectBool ? `<td rowspan="${this.getChildrenNum(obj[i][j])}"><div>${this.colType === 1 ? data['一级指标得星数'] : this.colType === 2 ? data['一级指标得分'] : data['一级指标得星数/得分']}</div></td>` : ''
                this.arrHtml += projectBool ? `<td rowspan="${this.getChildrenNum(obj[i][j])}"><div>${data['权重']}</div></td>` : ''
                this.arrHtml += titleBool ? `<td rowspan="${this.getChildrenNum(obj[i])}"><div>${this.colType === 1 ? data['课程得星数（加权后）'] : this.colType === 2 ? data['课程得分（加权后）'] : data['课程得星数/得分（加权后）']}</div></td>` : ''
                this.arrHtml += titleBool ? `<td rowspan="${this.getChildrenNum(obj[i])}"><div>${data['课程得分']}</div></td>` : ''
                this.arrHtml += `</tr>`
                titleBool = false
                projectBool = false
                twoBool = false
              }
            }
          }
        }
      },
      getChildrenNum (obj) {
        let num = 0
        if (obj instanceof Array) {
          return obj.length
        }
        for (let i in obj) {
          if (obj[i] instanceof Array) {
            num += obj[i]['length']
          } else {
            num += this.getChildrenNum(obj[i])
          }
        }
        return num
      }
    }
  }
</script>
<style lang="less" scoped>
/deep/.ivu-table td, .ivu-table th{
  border-right: 1px solid #EBEEF5;
}
#TableData{
  width:100%;
  border: 1px solid #EBEEF5;
  thead{
    th{
      background: #FAFAFA;
      border-right: 1px solid #EBEEF5;
      border-bottom: 1px solid #EBEEF5;
      height: 100%;
      padding: 8px 0;
      div{
        color:#909399;
        text-align: left;
        padding-left: 18px;
        padding-right: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
    }
  }
  #tBody{
    color: #606266;
    /deep/tr{
      display: table-row;
      vertical-align: inherit;
      border-color: inherit;
      /deep/td{
        border-right: 1px solid #EBEEF5;
        border-bottom: 1px solid #EBEEF5;
        min-width: 0;
        height: 48px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        text-align: left;
        text-overflow: ellipsis;
        vertical-align: middle;
        background-color: #fff;
        -webkit-transition: background-color 0.2s ease-in-out;
        transition: background-color 0.2s ease-in-out;
        /deep/div{
          padding-left: 18px;
          padding-right: 18px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          word-break: break-all;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
        }
      }
    }
    /deep/tr:hover{
      /deep/td{
        background-color: #ebf7ff;
      }
    }
  }
}
</style>
