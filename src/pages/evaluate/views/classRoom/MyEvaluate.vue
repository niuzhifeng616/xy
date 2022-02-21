<template>
<div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between">
      <div>
        <Button class="xy-primary" @click="goCurriculum">按课表查询</Button>
        <Button class="xy-info" @click="exportStudentEvaluateStatistic">导出</Button>
      </div>
      <div class="xy-flex xy-center">
        <label>学年学期：</label>
        <Cascader
          :data="yearSemesterList"
          @on-change="changeYear"
          v-model="kv.yearSemester"
          placeholder="学年/学期"
          class="pick-widht"></Cascader>
        <label>课程：</label>
        <Select
          v-model="kv.subject"
          @on-change="changeSubject"
          placeholder="请选择"
          class="pick-widht"
          style="width:180px;">
          <Option
            v-for="item in subjectList"
            :value="item.SubjectID"
            :key="item.SubjectID">{{ item.SubjectName }}</Option>
        </Select>
        <label>日期：</label>
        <DatePicker
          type="daterange"
          split-panels
          @on-change="changeDate"
          :clearable="false"
          :editable="false"
          :option="dDate"
          placement="bottom-end"
          placeholder="请选择日期"
          v-model="kv.date"></DatePicker>
      </div>
    </div>
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
    name: 'MyEvaluate',
    data () {
      return {
        colType: 1,
        arrHtml: '',
        newObj: [],
        // 搜索条件
        kv: {
          subject: 0,
          yearSemester: [],
          date: []
        },
        subjectList: [
          {
            SubjectID: 0,
            SubjectName: '全部课程'
          }
        ],
        yearSemesterList: [],
        dDate: {},
        content: `
        1. 列表显示课程一级指标得星数和课程得星数。每颗星代表X分。数据四舍五入，保留1位小数。
        2. 多节课，各三级指标“总得星数”=各三级指标单次“得星数”求和。“平均得星数”=总得星数/评价次数。
        3. “一级指标得星数”=某一级指标下的各三级指标的“平均得星数”求和。“课程得星数”=各一级指标得星数加权求和。“课程得分”=课程得星数*每颗星代表分数。
        4. 评价分数为空则代表未做评价，评价分数为0代表评价得分为0。未参与评价的，不进行平均分计算。
        `,
        userInfo: ''
      }
    },
    created () {
      this.getStudentClass()
      this.getYearSession()
    },
    methods: {
      async getStudentClass () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassEvaluationStatistics/GetStudentClass`, {
          userid: this.$store.state.common.userBaseInfo.UserID
        })
        if (res.success) {
          this.userInfo = res.data
        }
      },
      exportStudentEvaluateStatistic () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/ClassEvaluationStatistics/ExportStudentEvaluateStatistic`, this.getParams())
      },
      getParams () {
        return {
          SessionID: this.kv.yearSemester[1] || 0,
          StudentYearID: 0,
          SubjectID: this.kv.subject || 0,
          startTime: this.xy.moment(this.kv.date[0]).format('YYYY-MM-DD') || '',
          endTime: this.xy.moment(this.kv.date[1]).format('YYYY-MM-DD') || ''
        }
      },
      changeYear (val, item) {
        this.kv.yearSemester = val
        this.kv.date = [item[1].StartDate, item[1].EndDate]
        let timeRange = [this.xy.moment(item[1].StartDate).valueOf(), this.xy.moment(item[1].EndDate).valueOf()]
        this.dDate = {
          disabledDate (date) {
            return timeRange[0] > date || date > timeRange[1]
          }
        }
        this.loadTable()
      },
      changeDate (val) {
        this.kv.date = val
        this.loadTable()
      },
      changeSubject (val) {
        this.kv.subject = val
        this.loadTable()
      },
      async loadTable () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassEvaluationStatistics/GetStudentEvaluateStatistic`, {
          SessionID: this.kv.yearSemester[1],
          StudentYearID: 0,
          SubjectID: this.kv.subject,
          startTime: this.kv.date[0],
          endTime: this.kv.date[1]
        }, true)
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
          this.xy.unloading()
        } else {
          this.xy.msgError(res.msg)
          this.xy.unloading()
        }
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
      },
      goCurriculum () {
        this.$store.commit('common/getThreeMenuName', '按课表查询')
        this.$router.push({
          name: 'Curriculum',
          query: this.$store.state.common.menuInfo
        })
      },
      redirect () {
        this.$router.push({ name: 'EvaluationStatisticsDesc' })
      },
      // 获取所有学科
      async getDisciplineList (sid) {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassEvaluationStatistics/GetMySubject`, {
          SessionID: sid
        })
        if (res.success) {
          if (res.data.length > 0) {
            res.data.map(item => {
              item.SubjectName = item.SubjectName.length >= 10 ? `${item.SubjectName.substr(0, 9)}...` : item.SubjectName
            })
            this.subjectList = [...this.subjectList, ...res.data]
          }
        }
        this.loadTable()
      },
      // 获取学年、学期
      async getYearSession () {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`)
        if (res.success) {
          if (res.data.length > 0) {
            this.yearSemesterList = res.data
            for (const tt of res.data) {
              if (tt.IsCurrent) {
                this.kv.yearSemester[0] = tt.value
              }
              for (const vv of tt.children) {
                if (vv.IsCurrent) {
                  this.kv.date = [vv.StartDate, vv.EndDate]
                  let timeRange = [this.xy.moment(vv.StartDate).valueOf(), this.xy.moment(vv.EndDate).valueOf()]
                  this.dDate = {
                    disabledDate (date) {
                      return timeRange[0] > date || date > timeRange[1]
                    }
                  }
                  this.kv.yearSemester[1] = vv.value
                }
              }
            }
            this.getDisciplineList(this.kv.yearSemester[1])
          }
        } else {
          this.xy.msgError(res.msg)
        }
        this.xy.unloading()
      }
    }
  }
</script>
<style lang="less" scoped>
  @import './css/statComm.less';
  .pick-widht {
    margin-right: 10px;
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
