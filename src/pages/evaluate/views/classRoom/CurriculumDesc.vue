<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-center">
      <div style="font-size:18px;font-weight:700;margin-right:20px;">{{titleName}}</div>
      <Tooltip :content="content" placement="left-start" max-width="600">
        <span class="i-alert"><Icon type="ios-information-circle"  />提示</span>
      </Tooltip>
    </div>
    <div class="xy-content-body">
      <table id="TableData" v-show="arrHtml.length>0">
        <thead>
          <tr>
          <th>一级指标</th>
          <th>二级指标</th>
          <th>三级指标</th>
          <th>{{colType===1?'总得星数':colType===2?'总得分':'总得星数/得分'}}</th>
        </tr>
        </thead>
        <tbody id="tBody" v-html="arrHtml"></tbody>
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
    name: 'CreateEvalu',
    data () {
      return {
        content: `1. 数据四舍五入，保留1位小数。
2. 单节课，“一级指标得星数”=某一级指标下的三级指标得星数求和。
3. ”课程得星数“=各一级指标得星数加权求和。“课程得分”=课程得星数*每颗星代表分数。`,
        // 2019-02-21  高中1班第一节  语文
        evaluInfo: [], // 单个详情
        courseInfo: JSON.parse(this.$route.query.params), // 跳转过来时携带的参数
        colType: 1,
        newObj: [],
        arrHtml: '',
        titleName: '',
        totalScore: 0
      }
    },
    created () {
      this.getStuInfo()
    },
    methods: {
      async getStuInfo () {
        this.xy.loading()
        let params = {
          ClassTableGenerateBaseID: this.courseInfo.ClassTableGenerateBaseID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassEvaluationStatistics/GetStudentSingleLessonEvaludate`, params)
        if (res.success) {
          this.evaluInfo = res.data
          this.colType = res.data.colType
          this.titleName = `${this.colType === 1 ? '总得星数：' : this.colType === 2 ? '总得分：' : '总得星数/得分：'}${res.data.totalScore}`
          let _obj = []
          this.newObj = []
          res.data.data.forEach(element => {
            _obj[element['1级指标']] = _obj[element['1级指标']] || {}
            _obj[element['1级指标']][element['2级指标']] = _obj[element['1级指标']][element['2级指标']] || {}
            _obj[element['1级指标']][element['2级指标']][element['3级指标']] = _obj[element['1级指标']][element['2级指标']][element['3级指标']] || []
            _obj[element['1级指标']][element['2级指标']][element['3级指标']].push(element)
          })
          this.newObj = _obj
          this.renderTable(_obj)
        }
        this.xy.unloading()
      },
      renderTable (obj) {
        this.arrHtml = ``
        this.totalScore = 0
        for (let i in this.newObj) {
          let titleBool = true
          for (let j in this.newObj[i]) {
            let projectBool = true
            for (let k in this.newObj[i][j]) {
              for (let v in this.newObj[i][j][k]) {
                let data = this.newObj[i][j][k][v]
                this.arrHtml += `<tr>`
                this.arrHtml += titleBool ? `<td rowspan="${this.getChildrenNum(obj[i])}"><div>${data['1级指标']}</div></td>` : ''
                this.arrHtml += projectBool ? `<td rowspan="${this.getChildrenNum(obj[i][j])}"><div>${data['2级指标']}</div></td>` : ''
                this.arrHtml += `<td><div>${data['3级指标']}</div></td>`
                this.arrHtml += `<td><div>${this.colType === 1 ? data['总得星数'] : this.colType === 2 ? data['总得分'] : data['总得星数/得分']}</div></td>`
                this.arrHtml += `</tr>`
                titleBool = false
                projectBool = false
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
  .i-alert{
    cursor: pointer;
    color:#D8D8D8;
    i{
      margin-right: 5px;
    }
  }
  .i-alert:hover{
    color:#4196FF;
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
