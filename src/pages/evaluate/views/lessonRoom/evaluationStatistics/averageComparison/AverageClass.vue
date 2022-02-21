
<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <p>均分对比-{{this.passData.name}}</p>
       <noData :tip="'该图表没有信息。'" v-if="tbData.length===0" style="height:300px"></noData>
      <div class="echarts" v-else>
        <div ref="subAvg"
             style="height: 100%; width: 100%;"></div>
      </div>
      <div class="table">
          <p  v-if="tbData.length!==0">
            <span>班级人数: {{this.passData.StudentCount}}</span>
            <span>班级均分:{{this.passData.Score}}</span>
          </p>
          <XyTable :noDataText="'您还没有该班级的信息，请进行评价。'" :isShowPage="false"
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
    name: 'AverageClass',
    data () {
      return {
        passData: {},
        tbData: [],
        columns: [
          {
            title: '姓名',
            key: 'FullName',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: params.row.FullName.substr(0, 2)
                  },
                  attrs: {
                    title: params.row.FullName
                  },
                  style: {
                    display: 'inline-block',
                    marginRight: '36px',
                    width: '31px',
                    height: '30px',
                    background: '#4196FF',
                    borderRadius: '50%',
                    color: '#FFFFFF',
                    lineHeight: '30px',
                    textAlign: 'center'
                  }
                }),
                h('span', {
                  domProps: {
                    innerHTML: params.row.FullName
                  }
                })
              ])
            }
          },
          {
            title: '用户名',
            key: 'UserName',
            minWidth: 100
          },
          {
            title: '个人总得分',
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
          },
          {
            title: '评分节次',
            key: 'Number',
            width: 100
          },
          {
            title: '个人总均分',
            key: 'AverageScore',
            width: 150,
            render (h, params) {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: `${params.row.AverageScore}`
                  }
                })
              ])
            }
          },
          {
            title: '操作',
            width: 100,
            render: (h, params) => {
              return h('div', {
                'class': {
                  oprateList: true
                }
              }, [
                h('a', {
                  'class': {
                    oprateBtn1: true
                  },
                  on: {
                    click: () => {
                      this.toClass(params.row)
                    }
                  }
                }, '查看')
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
      // 跳转学生
      toClass (data) {
        this.passData.subname = data.FullName
        this.passData.UserID = data.UserID
        this.passData.Score = data.Score
        this.passData.Number = data.Number
        this.passData.AverageScore = data.AverageScore
        this.$store.commit('evaluate/changeAverageObj', {
          passData: this.passData
        })
        this.$store.commit('common/getThreeMenuName', this.passData.name)
        this.$store.commit('common/getParam')
        this.$router.push({
          path: '/xyhome/AverageGrade/AverageStudent',
          query: this.$store.state.common.menuInfo
        })
      },
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
          EndTime: this.passData.endTime
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AverageRecord/GetClassComparativeInformation`, params)
        this.xy.unloading()
        if (res.success) {
          this.tbData = res.data.Models
          let xData = []; let yData = []
          this.tbData.forEach(item => {
            xData.push(item.FullName)
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
          > span {
            display: inline-block;
            margin-right: 50px;
          }
        }
      }
    }
  }
</style>
