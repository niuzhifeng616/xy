
<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <p>均分对比-{{this.passData.subname}}</p>
      <noData v-if="tbData.length===0" style="height:300px"></noData>
      <div class="echarts" v-else>
        <div ref="subAvg"
             style="height: 100%; width: 100%;"></div>
      </div>
      <div class="table">
        <p v-if="tbData.length!==0">
          <span>个人总得分：{{this.passData.Score}} </span>
          <span>评分节次：{{this.passData.Number}}</span>
          <span>个人均分：{{this.passData.AverageScore}}</span>
        </p>
        <XyTable :isShowPage="false"
                 :noDataText="'您还没有该学生的信息，请进行评价。'"
                 :tbColumns="columns"
                 :tbData="tbData">
        </XyTable>
      </div>
    </div>
  </div>
</template>
<script>
  import XyTable from '@/components/table/XyTable'
  import noData from '../../../../components/noData'
  export default {
    components: {
      XyTable,
      noData
    },
    name: 'AverageStudent',
    data () {
      return {
        passData: {},
        tbData: [],
        columns: [
          {
            title: '日期',
            key: 'Time',
            width: 200,
            render (h, params) {
              return h('div', {
                domProps: {
                  innerHTML: `${params.row.Time} `
                }
              })
            }
          },
          {
            title: '节次',
            key: 'TimeName',
            width: 100
          },
          {
            title: '个人得分',
            key: 'inedxScore',
            minWidth: 100,
            render (h, params) {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: `${params.row.inedxScore} `
                  }
                })
                // h('img', {
                //   style: {
                //     width: '18px',
                //     height: '18px',
                //     marginLeft: '6px'
                //   },
                //   domProps: {
                //     src: require('./imgs/star.svg')
                //   }
                // })
              ])
            }
          },
          {
            title: '小组排位分',
            key: 'GroupScore',
            width: 100,
            render (h, params) {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: `${params.row.GroupScore} `
                  }
                })
                // h('img', {
                //   style: {
                //     width: '18px',
                //     height: '18px',
                //     marginLeft: '6px'
                //   },
                //   domProps: {
                //     src: require('./imgs/star.svg')
                //   }
                // })
              ])
            }
          },
          {
            title: '总得分',
            key: 'Score',
            width: 100,
            render (h, params) {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: `${params.row.Score} `
                  }
                })
                // h('img', {
                //   style: {
                //     width: '18px',
                //     height: '18px',
                //     marginLeft: '6px'
                //   },
                //   domProps: {
                //     src: require('./imgs/star.svg')
                //   }
                // })
              ])
            }
          }
        ]
      }
    },
    created () {
      this.passData = this.$store.state.evaluate.averageObj.passData
      this.getData()
    },
    methods: {
      async getData () {
        this.xy.loading()
        const params = {
          AcademicSessionID: this.passData.academicSessionID,
          SchoolDistrictID: this.passData.schoolDistrictID,
          AcademicYearID: this.passData.academicYearID,
          StudentGradeForStudentYearID: this.passData.studentGradeForStudentYearID,
          DisciplineID: this.passData.disciplineID,
          CoursePlan: this.passData.checkArr,
          StarTime: this.passData.starTime,
          EndTime: this.passData.endTime,
          UserID: this.passData.UserID
        }
        console.log('获取学生数据的参数', params)
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AverageRecord/GetClassStudentComparativeInformation`, params)
        this.xy.unloading()
        if (res.success) {
          this.tbData = res.data.Models
          let xData = []; let yData = []
          this.tbData.forEach(item => {
            item.Time = this.xy.moment(item.Time).format('YYYY-MM-DD')
            xData.push(this.xy.moment(item.Time).format('YYYY-MM-DD') + ' ' + item.TimeName)
            yData.push(item.Score)
          })
          this.fetch(xData, yData)
        }
      },
      fetch (xData, yData) {
        this.$nextTick(() => {
          let subAvgEc = this.echarts.init(this.$refs.subAvg)
          let option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            xAxis: {
              type: 'category',
              data: xData
            },
            yAxis: {
              type: 'value',
              boundaryGap: false,
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              },
              axisLine: {
                show: false
              }
            },
            series: [{
              data: yData,
              type: 'bar',
              color: '#3AA0FF',
              barWidth: '20%',
              markPoint: {
                data: [
                  { type: 'max', name: '最大值' },
                  { type: 'min', name: '最小值' }
                ]
              },
              markLine: {
                data: [
                  { type: 'average', name: '平均值' }
                ]
              }
            }]
          }
          subAvgEc.setOption(option)
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .xy-content-module {
  padding: 20px;
    .xy-content-body {
      > p {
        padding: 20px;
        font-weight: bold;
        font-size: 16px;
        color: rgba(0,0,0,0.85)
      }
      .echarts {
        height: 500px;
      }
      .table {
        > p {
          padding: 20px;
          padding-left: 94px;
          border-bottom: 1px dashed #d9d9d9;
          > span {
            display: inline-block;
            margin-right: 50px;
          }
        }
      }
    }
  }
</style>
