<!-- 方案整体情况 -->
<template>
<div>
  <div class="programme"  v-if="questionnaireId !== 0 && SchoolDistrictID !== 0">
      <div class="bgColor"></div>
      <div class="name-box">
          <span class="cell-left">问卷名称：</span>
          <ul class="cell-right">
              <li v-for="(item,index) in this.$parent.dataList" :key="index" class="class-strategy" :class="{active: index == num}" @click="changeindex(index)">
                  <span>{{item.QuestionnaireTitle}}</span>
              </li>
          </ul>
      </div>
      <div class="choice-box">
          <span class="cell-left">选择题目：</span>
          <ul class="cell-right">
              <li v-for="(item,index) in titleLists" :key="index" class="class-strategy ques" :class="{active: index == num1}" @click="changeindex1(index)">
                  <span>{{item.ShortName}}</span>
              </li>
          </ul>
      </div>
      <div class="summary-subobject">
          <div>参评学生：<span>{{StudentCount}}</span>人</div>
          <div>被评价教师：<span>{{TeacherCount}}</span>人</div>
      </div>
      <div class="bgColor"></div>
      <div class="xy-content-box">
        <div class="approval-main">
          <div v-for="(outerItem, outerIndex) in subjectStatistics" :key="outerIndex" class="content-flex">
            <div class="title">
              <p class="col0-85">{{num1 + 1}}.&nbsp;&nbsp;{{outerItem.questionName}}</p>
              <!-- 问答 4 -->
              <div class="bottom" v-if="questionType === 4">
                <div class="numOfText">采集到&nbsp;&nbsp;{{allTextQues}}&nbsp;&nbsp;份</div>
                <Input search v-model="searchTxt" @on-search="FromSubmit" placeholder="用户名/姓名" style="width: 200px;" />
              </div>
            </div>
            <!-- 单选 1 -->
            <div v-show="questionType === 1" :id="'pie' + outerIndex" class="charts"></div>
            <div v-show="questionType === 2" :id="'histogram' + outerIndex" class="charts"></div>
            <div class="score-radio" v-if="questionType === 1 || questionType === 2">
              <span>平均分：{{choiceQues.Avg}}分</span>
              <span>最低分：{{choiceQues.Min}}分</span>
              <span>最高分: {{choiceQues.Max}}分</span>
              <span>满分：{{choiceQues.TotalScore}}分</span>
            </div>
            <!-- 打分 3 -->
            <div class="evaluation-score" v-show="questionType === 3">
              <div class="score-center">
                  <div v-for="(item,index) in outerItem.rateStart" :key="index">
                      <Rate
                        disabled
                        clearable
                        v-model="item.StartCount"
                        :custom-icon="'iconfont icon-Starunselectedbeifen'"
                        class="rate"/>
                      <span class="rate-title">
                        <span class="opttag">选 {{item.OptTag}} </span>
                        <span class="optname">{{item.OptName}}</span>
                        <span class="count">{{item.Count}}<span>({{item.Rate}}%)</span></span>
                      </span>
                  </div>
              </div>
              <div class="score-eva">
                <span>平均分：{{choiceQues.Avg}}分</span>
                <span>最低分：{{choiceQues.Min}}分</span>
                <span>最高分: {{choiceQues.Max}}分</span>
                <span>满分：{{choiceQues.TotalScore}}分</span>
              </div>
            </div>
          </div>
          <!-- 非问答 -->
          <div v-if="questionType !== 4" class="xy-table">
            <div v-if="titleLists.length > 0 && datable.length === 0"></div>
            <div v-else>
              <XyAntTable
                :columns="columns"
                :dataSource="datable"
                :nullData="nullData"
                :tableLoading="tableLoading"
                :pagination="pagination"
                @change="handleTableChange"
                :scrollx="1150"
                :isBorder="true"
                >
                <!-- 教师姓名 -->
                <div slot="TeacherFullName" style="min-width:120px" slot-scope="text, record">
                  {{ record.TeacherFullName}}
                </div>
                <!-- 用户名 -->
                <div slot="TeacherName" slot-scope="text, record">
                  <div style="min-width:120px">
                    {{ record.TeacherName}}
                  </div>
                </div>
                <!-- 班级 -->
                <div slot="ClassName" slot-scope="text, record">
                  <div style="min-width:120px">
                    {{ record.ClassName}}
                  </div>
                </div>
                <!-- 操作 -->
                <span slot="oprate" slot-scope="text, record">
                  <a @click="edit(record)">查看详情</a>
                </span>
              </XyAntTable>
            </div>

          </div>
          <!-- 问答题 4-->
          <div v-else-if="questionType === 4" class="xy-table">
            <XyAntTable
              :columns="columns2"
              :dataSource="datable"
              :nullData="nullData"
              :tableLoading="tableLoading"
              :pagination="pagination"
              @change="handleTableChange"
              :scrollx="650"
              >
              <div slot="Icon" class="table-pic" slot-scope="text, record">
                <div v-if="!record.Icon" :class="`head-con ${record.TeacherSex === 0 ? 'woman' : 'man'}`">
                  <span class="head-font">
                    {{ xy.showName(record.TeacherFullName)}}
                  </span>
                </div>
                <img style="width:30px;height:30px;border-radius:50%" v-else :src="+ record.Icon + '?' + Math.random() * 15">
              </div>
              <div slot="TeacherFullName" style="min-width:120px" slot-scope="text, record">
                <span class="table-el-hover" @click="edit(record)">
                  {{ record.TeacherFullName}}
                </span>
              </div>
              <div slot="TeacherName" slot-scope="text, record">
                <div style="min-width:120px">
                  {{ record.TeacherName}}
                </div>
              </div>
              <span slot="oprate" slot-scope="text, record">
                <a @click="edit(record)">查看详情</a>
              </span>
            </XyAntTable>
          </div>
        </div>
      </div>
  </div>
  <div v-else id="none"></div>
</div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'Plan',
    components: {
      XyAntTable
    },
    props: {
      SchoolDistrictID: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        StudentCount: 0, // 参评学生
        TeacherCount: 0, // 被评价教师

        num: 0, // 当前问卷索引
        questionnaireId: 0, // 当前问卷id

        titleLists: [], // 题目列表
        num1: 0, // 当前题目索引
        questionID: 0,
        questionType: 0, // 当前题目类型 1单选 2多选 3打分 4问答

        choiceQues: [], // 当前单选、打分题的分数信息
        subjectStatistics: [], // 当前题目信息

        allTextQues: 0, // 问答题采集份数信息
        merge: {}, // 合并单元格
        mergeORnot: false, //  是否有合并单元格

        searchTxt: '',
        datable: [],
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        isRankAsc: false,
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
            if (this.datable.length > this.pagination.pageSize) {
              this.pagination.pageSize = this.datable.length
            } else {
              this.pagination.pageSize = pageSize
            }
            this.$nextTick(() => {
              let a = document.getElementsByClassName('ant-select-selection-selected-value')
              if (a.length !== 0) {
                a[0].innerHTML = pageSize + '条/页'
              }
            })
          }
        },
        columns: [],
        columns2: [
          {
            title: ' ',
            width: 44,
            scopedSlots: { customRender: 'Icon' }
          },
          {
            title: '教师姓名',
            dataIndex: 'TeacherFullName',
            scopedSlots: { customRender: 'TeacherFullName' }
          },
          {
            title: '用户名',
            dataIndex: 'TeacherName',
            scopedSlots: { customRender: 'TeacherName' }
          },
          {
            title: '采集回答数',
            dataIndex: 'JoinCount',
            width: 140
          },
          {
            title: '操作',
            width: 200,
            scopedSlots: { customRender: 'oprate' }
          }
        ]
      }
    },
    created () {
    },
    methods: {
      handleTableChange (pagination, filters, sorter) {
        let order = sorter.order
        if (order === 'ascend') {
          this.$emit('rankFun', true, order)
          this.isRankAsc = true
        }
        if (order === 'descend' || order === undefined) {
          this.$emit('rankFun', false, order)
          this.isRankAsc = false
        }
        if (this.questionType === 4) {
          this.tableText()
        } else {
          this.tableChoise()
        }
      },
      // 切换问卷
      changeindex (i) {
        this.num = i
        if (this.$parent.dataList.length !== 0) {
          this.questionnaireId = this.$parent.dataList[this.num].QuestionnaireID
          if (this.questionnaireId > 0) {
            this.getSummaryPep()
            this.getAll()
          }
        }
      },
      // 方案人数
      async getSummaryPep () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetSummaryJoinCountForProject`, {
          questionnaireID: this.questionnaireId
        })
        if (res.success) {
          this.StudentCount = res.data.StudentCount
          this.TeacherCount = res.data.TeacherCount
        }
      },
      // 获取题目
      async getAll () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetQuestions`, {
          questionnaireID: this.questionnaireId
        })
        if (res.success) {
          this.titleLists = res.data

          // 切换问卷时清空当前选中题目信息
          this.subjectStatistics = []
          this.questionID = 0
          this.questionType = 0
          this.columns = []
          this.datable = []

          if (res.data.length > 0) {
            this.changeindex1(0)
          } else {
            this.tableLoading = false
          }
        }
      },
      // 切换题目
      changeindex1 (i) {
        this.num1 = i
        this.questionID = this.titleLists[this.num1].QuestionID
        this.questionType = this.titleLists[this.num1].QuestionType
        if (this.questionType !== 4) {
          this.pagination.current = 1
          this.tableChoise()
        } else {
          this.pagination.current = 1
          this.tableText()
          this.subjectStatistics = []
          this.subjectStatistics.push({
            questionName: this.titleLists[i].QuestionName,
            Type: this.questionType
          })
        }
      },
      // 选择题、打分题
      async tableChoise () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetSummarySelectQuestionTableForProject`, {
          questionID: this.questionID,
          questionnaireID: this.questionnaireId,
          tableType: 1,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          searchTxt: this.searchTxt,
          isRankAsc: this.isRankAsc
        })
        this.tableLoading = false
        if (res.success) {
          if (res.data !== null) {
            this.pagination.total = res.data.TotalRecords
            this.merge = res.data.Table.MergeMap
            let newColumns = res.data.Table.Columns
            newColumns.map((item, i) => {
              this.$set(item, 'dataIndex', item.key)
              if (i === 0) {
                this.$set(item, 'fixed', 'left')
              }
              item.dataIndex = item.key
              if (item.key.substring(0, 6) === 'Option') {
                item.width = 100
              } else {
                item.scopedSlots = { customRender: item.dataIndex }
              }
              if (item.key === 'JoinCount') {
                item.width = 120
              }
              if (item.key === 'Score' || item.key === 'Rank') {
                item.width = 100
              }
              if (item.key === 'Rank') {
                item.sorter = (a, b) => {

                }
                item.sortDirections = ['ascend', 'descend']
              }
            })
            this.columns = newColumns
            // 添加头像
            this.columns.unshift({
              title: ' ',
              width: 44,
              dataIndex: 'Icon',
              fixed: 'left'
            })
            let s = this.pagination.pageSize
            this.datable = res.data.Table.Datas
            if (this.datable.length > this.pagination.pageSize) {
              this.pagination.pageSize = this.datable.length
              this.$nextTick(() => {
                let a = document.getElementsByClassName('ant-select-selection-selected-value')
                if (a.length !== 0) {
                  a[0].innerHTML = s + '条/页'
                }
              })
            }
            this.columns.map((item, i) => {
              item.customRender = (value, row, index) => {
                const obj = this.merge[index] ? {
                  children: i === 0 ? !row.Icon
                    ? <div class="table-pic">
                    <div class={row.TeacherSex === 0 ? 'head-con woman' : 'head-con man'}>
                      <span class="head-font">
                        { this.xy.showName(row.TeacherFullName)}
                      </span>
                    </div>
                  </div>
                    : <img style="width:30px;height:30px;border-radius:50%" src={this.$store.state.apiPath + row.Icon + '?' + Math.random() * 15} />
                    : value,
                  attrs: {
                    colSpan: this.merge[index][i] ? this.merge[index][i].ColSpan : '',
                    rowSpan: this.merge[index][i] ? this.merge[index][i].RowSpan : ''
                  }
                } : {
                  children: i === 0 ? !row.Icon
                    ? <div class="table-pic">
                    <div class={row.TeacherSex === 0 ? 'head-con woman' : 'head-con man'}>
                      <span class="head-font">
                        { this.xy.showName(row.TeacherFullName)}
                      </span>
                    </div>
                  </div>
                    : <img style="width:30px;height:30px;border-radius:50%" src={this.$store.state.apiPath + row.Icon + '?' + Math.random() * 15} />
                    : value,
                  attrs: {}
                }
                return obj
              }
            })
            this.getChoiceQuestions()
          }
        }
      },
      // 文本题
      async tableText () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetSummaryTextQuestionTableForProject`, {
          questionID: this.questionID,
          questionnaireID: this.questionnaireId,
          tableType: 1,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          searchTxt: this.searchTxt
        })
        this.tableLoading = false
        if (res.success) {
          this.pagination.total = res.data.totalRecords
          this.datable = res.data.data
          let res2 = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetSummaryCountForProject`, {
            questionID: this.questionID
          })
          if (res2.success) {
            this.allTextQues = res2.data
          }
        }
      },
      // 单选echart设置
      setEchartPie (pie, echart) {
        const obj = {
          color: ['#8543E0', '#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#33EA92', '#FF9331'],
          backgroundColor: {
            type: 'linear',
            x0: 0,
            y0: 0,
            x2: 1,
            y2: 0,
            colorStops: [{
              offset: 0, color: 'rgba(0, 0, 0, .03)' // 0% 处的颜色
            }, {
              offset: 0.344, color: 'rgba(0, 0, 0, .03)'
            }, {
              offset: 0.3441, color: 'rgba(255, 255, 255, 1)'
            }, {
              offset: 1, color: 'rgba(255, 255, 255, 1)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          },
          legend: {
            orient: 'vertical',
            width: 50,
            itemWidth: 8,
            itemHeight: 8,
            itemGap: 20, // 图例间隔
            left: 445,
            textStyle: {
              fontSize: 14,
              marginLeft: '30px',
              color: 'rgba(0, 0, 0, .65)'
            },
            data: pie.name
          },
          tooltip: {
            trigger: 'item',
            formatter (params) {
              return params.name
            }
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '71%'],
              center: ['50%', '50%'],
              width: 420,
              height: 306,
              label: {
                normal: {
                  show: false,
                  position: 'inside',
                  formatter: '{b}: {c}' + '人'
                }
              },
              data: pie.data
            }
          ]
        }
        echart.setOption(obj)
      },
      setEchartHistogram (histogram, chart) {
        const obj = {
          color: ['#1077FE'],
          legend: {},
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: histogram.x,
            axisLabel: {
              interval: 0,
              formatter (value) {
                let newParamsName = ''
                const paramsNameNumber = value.length
                const provideNumber = 4 // 一行显示几个字
                const rowNumber = Math.ceil(paramsNameNumber / provideNumber)
                if (paramsNameNumber > provideNumber) {
                  for (let p = 0; p < rowNumber; p++) {
                    let tempStr = ''
                    const start = p * provideNumber
                    const end = start + provideNumber
                    if (p === rowNumber - 1) {
                      tempStr = value.substring(start, paramsNameNumber)
                    } else {
                      tempStr = value.substring(start, end) + '\n'
                    }
                    newParamsName += tempStr
                  }
                } else {
                  newParamsName = value
                }
                return newParamsName
              }
            }
          },
          yAxis: {
            type: 'value',
            scale: true,
            max: 200,
            min: 0
          },
          series: [{
            name: histogram.z,
            data: histogram.y,
            type: 'bar',
            barWidth: 40
          }]
        }
        chart.setOption(obj)
      },
      // 单选
      async getChoiceQuestions () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetSummaryChartForProject`, {
          questionID: this.questionID,
          questionnaireID: this.questionnaireId
        })
        if (res.success) {
          this.choiceQues = res.data
          this.subjectStatistics = []
          this.subjectStatistics.push(res.data)
          this.subjectStatistics = this.subjectStatistics.map((s, index) => {
            const pie = {}
            const histogram = {}
            s.OptionStatistics = s.Chart.map(m => {
              return {
                OptionsName: '选项' + m.Title,
                OptionsNumber: m.Count
              }
            })
            pie.name = s.Chart.map(m => {
              // m.Title = '选' + m.OptTag + m.OptName + m.Count + '(' + m.Rate + '%)'
              return {
                name: m.Title,
                icon: 'circle'
              }
            })
            pie.data = s.Chart.map(m => {
              return {
                value: m.Count,
                name: m.Title
              }
            })
            pie.data2 = s.Chart.map(m => {
              return {
                Count: m.Count,
                OptName: m.OptName,
                OptTag: m.OptTag,
                Rate: m.Rate,
                StartCount: 0,
                icon: 'circle',
                Title: m.Title
              }
            })
            return {
              questionName: s.QuestionName,
              Type: this.questionType,
              statistics: s.OptionStatistics,
              pie: pie,
              histogram: histogram,
              rateStart: s.Chart
            }
          })
          const that = this
          this.$nextTick(() => {
            that.subjectStatistics.forEach((s, index) => {
              document.getElementById('pie' + index) && that.setEchartPie(s.pie, that.echarts.init(document.getElementById('pie' + index)))
              document.getElementById('histogram' + index) && that.setEchartHistogram(s.histogram, that.echarts.init(document.getElementById('histogram' + index)))
            })
          })
        }
      },
      // 文本题查看详情
      async edit (row) {
        let params = {
          row: row,
          questionID: this.questionID,
          title: this.subjectStatistics[0].questionName,
          quesOrder: this.num1 + 1
        }
        this.$store.commit('evaluate/changeEvaQuestion', JSON.stringify(params))
        this.$store.commit('common/getThreeMenuName', '问答详情')
        this.$router.push({ path: '/xyhome/evaDetails', query: this.$store.state.common.menuInfo })
      },
      // 搜索
      FromSubmit () {
        this.pagination.current = 1
        this.searchTxt = this.searchTxt
        this.tableText()
      }
    }
  }
</script>
<style lang='less' scoped>
/deep/ .ant-table-fixed-left .ant-table-row-level-0 td {
  border-right: 0 !important;
}
/deep/ .ant-table-fixed-left th {
  border-right: 0 !important;
}
// 题以及table部分
.xy-content-box{
    .approval-main{
        margin-bottom: 20px;
        //题目
        .title{
          >p{
            font-weight: 700;
            margin-bottom: 5px;
          }
          .bottom{
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            .numOfText{
              color: rgba(0, 0, 0, .65);
              margin-left: 24px;
            }
          }
        }
        // 单选题
        .charts{
          flex-shrink:0;
          display:inline-block;
          width:1240px;
          height:300px;
          margin-top: 15px;
        }
        .score-radio{
          width: 500px;
          color: rgba(0, 0, 0, .65);
          display: flex;
          font-size: 14px;
          line-height: 14px;
          position: relative;
          left: 450px;
          bottom: 20px;
          >span{
            margin-right: 25px;
          }
        }
        // 打分题
        .evaluation-score{
          margin:10px 0px 10px 36px;
          .score-center{
            .rate{
              position: relative;
              top: -6px;
            }
            .rate-title{
              margin-left: 60px;
              line-height: 36px;
              color: rgba(56, 27, 27, 0.85);
              .opttag{
                margin-right: 10px;
              }
              .optname{
                margin-right: 27px;
              }
              .count{
                color: rgba(56, 27, 27, 0.65);
                span{
                  margin-left: 10px;
                }
              }
            }
          }
          .score-eva{
            color: rgba(0, 0, 0, .65);
            display: flex;
            width: 530px;
            font-size: 14px;
            line-height: 14px;
            margin: 15px 0 20px 180px;
            >span{
              margin-right: 25px;
            }
          }
        }
    }
    .ivu-page{
      text-align: right;
      margin-top: 20px;
    }
}
</style>
