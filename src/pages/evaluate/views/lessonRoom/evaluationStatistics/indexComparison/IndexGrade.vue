
<template>
  <div class="average-grade">
    <div class="container-all">
      <div class="xy-content-title">
        <div class="search" style="padding:10px;">
          <div class="container-top">
          <span style="min-width:82px;">对比学科:</span>
           <div style="cursor: pointer;" class="xy-flex xy-start">
            <div class="calssName" :class="isHeight?'more-height':''">
              <span style="cursor: pointer;" v-for="(item,index) in subjectList" :key="index"
                :class="item.isShow ? 'active':''"
                @click="chooseject(item,index)">
                <Tooltip :content="item.DisciplineName" max-width="200" v-if="item.DisciplineName.length>10" >
                  {{item.DisciplineName.substr(0,10)+"...."}}
                </Tooltip>
                <span v-else>
                  {{item.DisciplineName}}
                </span>
              </span>
              <span v-if="subjectList.length===0">暂无学科信息</span>
            </div>
             <!-- <span class="more" @click="getMore">
              <span v-if="!isHeight">
                <span>更多</span>
                <Icon type="ios-arrow-down" />
              </span>
              <span v-else>
                <span>收起</span>
                <Icon type="ios-arrow-up" />
              </span>
            </span> -->
          </div>
          </div>
          <div class="container-top">
          <span style="min-width:82px;">对比班级:</span>
            <div class="calssName">
              <span style="cursor: pointer;" v-for="(item,index) in classList" :key="index" :class="item.isShow ? 'active':''" @click="chooseclass(item,index)">
                <Tooltip :content="item.CoursePlanTableFullName" max-width="200" v-if="item.CoursePlanTableFullName.length>10" >
                  {{item.CoursePlanTableFullName.substr(0,10)+"...."}}
                </Tooltip>
                <span v-else>{{item.CoursePlanTableFullName}}</span>
              </span>
              <span v-if="classList.length===0">暂无班级信息</span>
            </div>
          </div>
          <div style="margin-left:90px;margin-top:24px">
            <Button class="xy-primary" @click="search">查询</Button>
          </div>
        </div>
      </div>
      <div class="xy-content-body" >
        <div class="echarts" style="padding:20px">
          <RadioGroup v-model="Exhibition" type="button" @on-change="change">
              <Radio label="echart">图表</Radio>
              <Radio label="table">列表</Radio>
          </RadioGroup>
          <div class="container">
            <div v-if="Exhibition==='echart'">
              <div ref="echartGeography" style="width:100%;height:550px;"></div>
              <div ref="echartGeography1" style="width:100%;height:550px;padding-top:100px;"></div>
              <div ref="echartGeography2" style="width:100%;height:550px;padding-top:100px;"></div>
              <div v-if="(subjectList.length===0&&classList.length===0)||noData" class="no-data-box" style="margin:10px auto 30px">
                <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
                <span class="no-data-text">该搜索条件下没有结果。</span>
              </div>
            </div>
            <div v-if="Exhibition==='table'" :style="{'overflow':(basicInformation.length>0?'auto':'')}">
              <table v-if="basicInformation.length!==0" class="table-data" style="width:100%;" >
                <thead>
                  <tr>
                    <th :colspan="basicInformation.length+1">基本信息</th>
                  </tr>
                </thead>
                <tbody class="tBody">
                  <tr>
                    <td >
                      <div style="width:200px;">班级名称</div>
                    </td>
                    <td v-for="item in basicInformation" :key="item.CoursePlanAID">
                      <div style="width:200px;" @click="toClass(item)">
                        <span :title="item.CoursePlanTableFullName">{{item.CoursePlanTableFullName}}</span>
                      </div>
                    </td>
                  <tr>
                    <td >
                      <div style="width:200px;">任课教师</div>
                    </td>
                    <td v-for="item in basicInformation" :key="item.CoursePlanAID">
                      <div style="width:200px;">
                        <span :title="item.TeacherNames">{{item.TeacherNames}}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td >
                      <div style="width:200px;">班级人数</div>
                    </td>
                    <td v-for="item in basicInformation" :key="item.CoursePlanAID">
                      <div style="width:200px;">
                        <span>{{item.StudentCount}}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td >
                      <div style="width:200px;">班级均分</div>
                    </td>
                    <td v-for="item in basicInformation" :key="item.CoursePlanAID">
                      <div style="width:200px;">
                        <span :title="item.AvgScore">{{item.AvgScore}}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table class="table-data TableData1" style="width:100%;"  v-for="(item,index) in indexDatas" :key="index">
                <tbody class="tBody1">
                  <tr>
                    <template v-for="(item1,index1) in item">
                      <td style="background:#fafafa;" v-if="index1===0" :key="index1" >
                          <div style="width:200px;display: flex;justify-content: flex-start;align-items: center;" :style="{'paddingLeft':item1.level===2?'40px':item1.level===3?'60px':'none'}">
                            <i style="margin-right:5px;color:#777;" v-if="item1.level === 1" class="iconfont">&#xe719;</i>
                            <i style="margin-right:5px;" v-if="item1.level === 2" class="iconfont icon-default">&#xe719;</i>
                            <span class="spanmore" :style="{'fontWeight':item1.level===1?'700':'none'}" :title="item1.IndexManagementName">{{item1.IndexManagementName}}</span>
                          </div>
                      </td>
                    </template>
                    <template v-for="(item1,index1) in item">
                        <td  v-if="index1!==0" :key="index1">
                            <div style="width:200px;"><span>{{item1.ScoreString}}</span></div>
                        </td>
                    </template>
                  </tr>
                </tbody>
              </table>
              <div v-if="basicInformation.length===0" class="no-data-box">
                <Spin fix v-if="spinShow"><div>加载中...</div></Spin>
                <template v-else>
                  <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
                  <span class="no-data-text">该搜索条件下没有结果。</span>
                </template>
              </div>
            </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'IndexGrade',
    props: {
      objData: {
        type: Object
      },
      currentComponent: {
        type: String
      }
    },
    data () {
      return {
        spinShow: false,
        noData: false,
        tableBasicData: [],
        basicInformation: [],
        isHeight: false,
        Exhibition: 'echart',
        selectId: [],
        checkArr: [],
        subjectList: [],
        classList: [],
        myChart: {},
        myChart1: {},
        myChart2: {},
        starTime: '',
        endTime: '',
        schoolDistrictID: '', // 校区
        academicSessionID: '', // 学期
        studentGradeForStudentYearID: '', // 年级
        AcademicYearID: '', // 学年
        arr: [],
        echartsUrl: '',
        option: {
          title: {
            text: ''
          },
          color: ['#1890FF', '#2FC25B', '#FACC14', '#003366', '#006699', '#4cabce', '#e5323e'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              var html = ''
              if (params.length !== 0) {
                var getName = params[0].name
                html += getName + '<br/>'
                for (var i = 0; i < params.length; i++) {
                  if (params[i].value !== 0) {
                    // params[i].marker 需要加上，否则你鼠标悬浮时没有样式了
                    html += params[i].marker
                    html += params[i].seriesName + ': ' + params[i].value + '<br/>'
                  }
                }
              }
              return html
            }
          },
          legend: {
            top: 0,
            type: 'scroll',
            orient: 'vertical',
            right: 10
          },
          dataZoom: [{
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            left: '9%',
            bottom: -5,
            start: 10,
            height: 22,
            end: 90 // 初始化滚动条
          }],
          xAxis: [
            {
              triggerEvent: true,
              type: 'category',
              axisTick: { show: false },
              data: [],
              axisLabel: {
                clickable: true,
                formatter: function (params) {
                  // 两种显示方式
                  params = params.length > 20 ? params.substr(0, 20) + '...' : params
                  return params
                }
              }
            }
          ],
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
          series: []
        },
        oneData: [],
        twoData: [],
        threeData: [],
        indexDatas: []
      }
    },
    watch: {
      subjectList: {
        handler (val) {
          if (val.length === 0) {
            if (this.oneData.length !== 0) {
              this.myChart.clear()
            }
            if (this.twoData.length !== 0) {
              this.myChart1.clear()
            }
            if (this.threeData.length !== 0) {
              this.myChart2.clear()
            }
          }
        },
        immediate: true,
        deep: true
      }
    },
    mounted () {
      let that = this
      this.$nextTick(() => {
        if (this.Exhibition === 'echart') {
          window.addEventListener('resize', () => {
            if (that.oneData.length !== 0) {
              that.myChart.resize()
            }
            if (that.twoData.length !== 0) {
              that.myChart1.resize()
            }
            if (that.threeData.length !== 0) {
              that.myChart2.resize()
            }
          }, false)
        }
      })
    },
    beforeDestroy () {
      window.removeEventListener('resize', () => {
        this.myChart.resize()
        this.myChart1.resize()
        this.myChart2.resize()
      }, false)
    },
    methods: {
      reset () {
        this.selectId = []
        this.checkArr = []
        this.subjectList.forEach(item => {
          item.isShow = false
        })
        this.classList.forEach(item => {
          item.isShow = false
        })
      },
      // 获取学科
      async fetchSubject (data) {
        this.xy.loading()
        const params = {
          starTime: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          endTime: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD'),
          schoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          academicSessionID: this.$parent.formValidateOK.yearSemester[1],
          studentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1]
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AverageRecord/GetDisciplinesByID`, params)
        this.xy.unloading()
        if (res.success) {
          this.subjectList = []// 学科
          this.classList = []// 班级
          this.selectId = []// 选中的学科id
          this.checkArr = []// 选中的班级
          if (res.data.length) {
            this.subjectList = res.data
            this.subjectList.forEach(item => {
              item.isShow = false
            })
            if (data) {
              this.selectId = this.$store.state.evaluate.averageObj.passData.selectId
              this.subjectList.unshift({ DisciplineID: '-1', DisciplineName: '全部' })
              this.subjectList.forEach((item, index) => {
                this.selectId.forEach(item1 => {
                  if (item.DisciplineID === item1) {
                    this.subjectList[index].isShow = true
                  }
                })
              })
              if (this.subjectList.length - 1 === this.$store.state.evaluate.averageObj.passData.selectId.length) {
                this.subjectList[0].isShow = true
              }
            } else {
              this.selectId.push(this.subjectList[0].DisciplineID)// 学科
              this.subjectList.unshift({ DisciplineID: '-1', DisciplineName: '全部' })
              this.subjectList[1].isShow = true
            }
            if (this.selectId.length !== 0) {
              this.fetchClass(data)
            }
          } else {
            this.$refs.echartGeography.style.height = '0'
            this.$refs.echartGeography1.style.height = '0'
            this.$refs.echartGeography2.style.height = '0'
          }
        }
      },
      // 获取班级信息 多选学科情况下的班级
      async fetchClass (data) {
        this.xy.loading()
        const params = {
          SchoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          StudentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          AcademicSessionID: this.$parent.formValidateOK.yearSemester[1],
          DisciplineID: this.selectId,
          StarTime: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndTime: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD')
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/IndexContrast/GetDisciplineCourseplanInfoByID`, params)
        this.xy.unloading()
        if (res.success) {
          this.classList = []
          if (res.data.length) {
            this.classList = res.data
            this.classList.forEach((item, index) => {
              item.onlyId = index
              item.isShow = false
            })
            this.classList.unshift({ CoursePlanAID: '-1', CoursePlanAIDType: '-1', CoursePlanTableFullName: '全部', onlyId: '-1' })
            if (data) {
              this.checkArr = this.$store.state.evaluate.averageObj.passData.checkArr
              this.classList.forEach((item, index) => {
                this.checkArr.forEach(item1 => {
                  if (item.CoursePlanAID === item1.CoursePlanAID && item.CoursePlanAIDType === item1.CoursePlanAIDType) {
                    this.classList[index].isShow = true
                  }
                })
              })
              if (this.classList.length - 1 === this.$store.state.evaluate.averageObj.passData.checkArr.length) {
                this.classList[0].isShow = true
              }
              this.Exhibition = 'table'
              this.getTableData()
            }
          }
        }
      },
      // 更多
      getMore () {
        this.isHeight = !this.isHeight
      },
      // 跳转班级
      toClass (data) {
        this.passData = {
          AcademicYearID: this.AcademicYearID, // 学年
          academicSessionID: this.academicSessionID,
          schoolDistrictID: this.schoolDistrictID,
          studentGradeForStudentYearID: this.studentGradeForStudentYearID,
          starTime: this.starTime,
          endTime: this.endTime,
          DisciplineID: data.DisciplineID,
          CoursePlanAID: data.CoursePlanAID, // 教学班id
          CoursePlanAIDType: data.CoursePlanAIDType, // 教学班type
          CoursePlanTableFullName: data.CoursePlanTableFullName, // 名字
          // 选择的学科和班级存起来
          selectId: this.selectId,
          checkArr: this.checkArr,
          // 年级页面的班级列表
          basicInformation: this.basicInformation
        }
        this.$store.commit('evaluate/changeAverageObj', {
          passData: this.passData
        })
        this.$parent.currentComponent = 'IndexClass'
        this.$parent.fetchSubject()// 获取班级头部的学科列表
      },

      async search (data) {
        if (this.selectId.length === 0) {
          if (data !== 'check') {
            this.$Message.warning('请选择要对比的学科')
          }
          return
        }
        this.arr = []
        this.checkArr.forEach(item => {
          this.arr.push(item.CoursePlanAID)
        })
        if (this.arr.length === 0) {
          if (data !== 'check') {
            this.$Message.warning('请选择要对比的班级')
          }
          return
        }
        if (this.Exhibition === 'echart') {
          // setTimeout(() => {
          //   this.$refs.echartGeography.style.height = '0px'
          //   this.$refs.echartGeography1.style.height = '0px'
          //   this.$refs.echartGeography2.style.height = '0px'
          // }, 500)
          this.getEchartsOneData()
        } else {
          this.getTableData()
        }
      },
      // 获取一级指标数据
      async getEchartsOneData () {
        this.xy.loading()
        const params = {
          SchoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          StudentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          AcademicYearID: this.$parent.formValidateOK.yearSemester[0],
          AcademicSessionID: this.$parent.formValidateOK.yearSemester[1],
          DisciplineID: this.selectId, // 学科
          CoursePlan: this.checkArr, // 班级
          StartDate: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndDate: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD')
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/GradeAndClassStatistics/GetGradeIndexOneBar`, params)
        this.xy.unloading()
        if (res.success) {
          if (res.data.length) {
            this.noData = false
            this.$refs.echartGeography.style.height = '500px'
            this.$refs.echartGeography1.style.height = '0px'
            this.$refs.echartGeography2.style.height = '0px'
            this.handleData(res.data, 'one')
            // 清空上一次得图表
            if (this.oneData.length !== 0) {
              this.myChart.clear()
            }
            if (this.twoData.length !== 0) {
              this.myChart1.clear()
            }
            if (this.threeData.length !== 0) {
              this.myChart2.clear()
            }
            // 后赋值
            this.oneData = res.data
          } else {
            this.noData = true
            // 清空上一次得图表
            this.echarts.init(this.$refs.echartGeography).clear()
            this.echarts.init(this.$refs.echartGeography1).clear()
            this.echarts.init(this.$refs.echartGeography2).clear()
            this.$refs.echartGeography.style.height = '0px'
            this.$refs.echartGeography1.style.height = '0px'
            this.$refs.echartGeography2.style.height = '0px'
          }
        }
      },
      // 处理数据
      async handleData (data, indexData) {
        let beforeYdata = []; let xData = []; let yData = []
        data.forEach(item => {
          xData.push(item.IndexManagementName) // 添加数据
          item.ClassList.forEach(item1 => {
            beforeYdata.push({
              name: item1.ClassName,
              data: item1.Score
            })
          })
        })
        const s = new Set() // 实例化对象
        beforeYdata.forEach(item => s.add(item.name))
        let newData = Array.from({ length: s.size }, () => []) // 创建指定长度数组并添值
        let newProject = [...s]
        newProject.forEach((item, index) => {
          data.forEach(item1 => {
            let score = 0
            item1.ClassList.forEach(item2 => {
              if (item2.ClassName === item) {
                score = item2.Score
              }
            })
            newData[index].push(score)
          })
        })
        newData.forEach((item, index) => {
          yData.push({
            name: Array.from(s)[index],
            type: 'bar',
            barGap: 0,
            barWidth: '5px',
            data: item
          })
        })
        this.$nextTick(() => {
          this.echartsOneAndTwoAndTree(xData, yData, indexData)
        })
      },
      echartsOneAndTwoAndTree (xData, yData, indexData) {
        let that = this
        this.option.xAxis[0].data = xData
        this.option.series = yData
        if (indexData === 'one') {
          this.myChart = this.echarts.init(this.$refs.echartGeography)
          this.option.title.text = '一级指标'
          this.myChart.setOption(this.option)
          that.myChart.off('click')
          that.myChart.on('click', function (params) {
            // 点击获取数据再绘制图表
            that.$nextTick(() => {
              let obj = {}
              obj = that.oneData.find(item => item.IndexManagementName === (params.name ? params.name : params.value))
              if (that.twoData.length !== 0) {
                that.myChart1.clear()
              }
              if (that.threeData.length !== 0) {
                that.myChart2.clear()
              }
              that.getEchartsData('two', obj.IndexManagementID)
              that.$refs.echartGeography1.scrollIntoView({ block: 'start', behavior: 'smooth' })
            })
          })
        } else if (indexData === 'two') {
          this.myChart1 = this.echarts.init(this.$refs.echartGeography1)
          this.option.title.text = '二级指标'
          this.myChart1.setOption(this.option)
          that.myChart1.off('click')
          that.myChart1.on('click', function (params) {
            that.$nextTick(() => {
              let obj = {}
              obj = that.twoData.find(item => item.IndexManagementName === (params.name ? params.name : params.value))
              that.getEchartsData('tree', obj.IndexManagementID)
              that.$refs.echartGeography2.scrollIntoView({ block: 'start', behavior: 'smooth' })
            })
          })
        } else {
          this.myChart2 = this.echarts.init(this.$refs.echartGeography2)
          this.option.title.text = '三级指标'
          this.myChart2.setOption(this.option)
        }
      },
      // 获取二，三级指标数据
      async getEchartsData (data, IndexManagementID) {
        if (data === 'two') {
          this.echartsUrl = `${this.$store.state.apiPath}/api/GradeAndClassStatistics/GetGradeIndexTwoBar`
        } else {
          this.echartsUrl = `${this.$store.state.apiPath}/api/GradeAndClassStatistics/GetGradeIndexThreeBar`
        }
        this.xy.loading()
        const params = {
          SchoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          StudentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          AcademicYearID: this.$parent.formValidateOK.yearSemester[0],
          AcademicSessionID: this.$parent.formValidateOK.yearSemester[1],
          DisciplineID: this.selectId, // 学科
          CoursePlan: this.checkArr, // 班级
          StartDate: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndDate: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD'),
          IndexManagementID: IndexManagementID
        }
        let res = await this.xy.post(this.echartsUrl, params)
        this.xy.unloading()
        if (res.success) {
          if (data === 'two') {
            this.twoData = res.data
            if (this.twoData.length === 0) {
              this.noData = true
              this.$refs.echartGeography1.style.height = '0'
            } else {
              this.noData = false
              this.$refs.echartGeography1.style.height = '650px'
            }
          } else {
            this.threeData = res.data
            if (this.threeData.length === 0) {
              this.noData = true
              this.$refs.echartGeography2.style.height = '0'
            } else {
              this.noData = false
              this.$refs.echartGeography2.style.height = '650px'
            }
          }
          if (res.data.length) {
            this.handleData(res.data, data)
          }
        }
      },
      windowResize () {
        this.avg.resize()
      },
      change () {
        // 调查询里面再判断列表还是图表
        this.search('check')
      },
      // 获取表格数据
      async getTableData () {
        this.spinShow = true
        this.xy.loading()
        // let CoursePlanAID = []
        // this.checkArr.forEach(item => {
        //   CoursePlanAID.push(item.CoursePlanAID)
        // })
        const params1 = {
          SchoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          StudentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          AcademicYearID: this.$parent.formValidateOK.yearSemester[0],
          AcademicSessionID: this.$parent.formValidateOK.yearSemester[1],
          DisciplineID: this.selectId, // 学科
          CoursePlan: this.checkArr, // 班级
          StartDate: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndDate: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD')
        }
        let res1 = await this.xy.post(`${this.$store.state.apiPath}/api/GradeAndClassStatistics/GetGradeIndexScoreList`, params1)
        this.spinShow = false
        this.xy.unloading()
        if (res1.success) {
          this.basicInformation = []
          if (res1.data.length) {
            this.basicInformation = res1.data
            this.indexDatas = []
            if (this.basicInformation[0].ClassScore) {
              this.basicInformation[0].ClassScore.forEach((item, index) => {
                let arr = []
                this.basicInformation.forEach((item1, index1) => {
                  if (index1 === 0) {
                    arr.push({
                      IndexManagementName: item.IndexManagementName,
                      level: 1
                    })
                  }
                  arr.push({
                    ScoreString: item1.ClassScore[index].ScoreString
                  })
                })
                this.indexDatas.push(arr)
                if (item.Children !== null) {
                  item.Children.forEach((childrenItem, childrenIndex) => {
                    let arr1 = []
                    this.basicInformation.forEach((item1, index1) => {
                      if (index1 === 0) {
                        arr1.push({
                          IndexManagementName: childrenItem.IndexManagementName,
                          level: 2
                        })
                      }
                      arr1.push({
                        ScoreString: item1.ClassScore[index].Children[childrenIndex].ScoreString
                      })
                    })
                    this.indexDatas.push(arr1)
                    if (childrenItem.Children !== null) {
                      childrenItem.Children.forEach((childrenItem1, childrenIndex1) => {
                        let arr2 = []
                        this.basicInformation.forEach((item1, index1) => {
                          if (index1 === 0) {
                            arr2.push({
                              IndexManagementName: childrenItem1.IndexManagementName,
                              level: 3
                            })
                          }
                          arr2.push({
                            ScoreString: item1.ClassScore[index].Children[childrenIndex].Children[childrenIndex1].ScoreString
                          })
                        })
                        this.indexDatas.push(arr2)
                      })
                    }
                  })
                }
              })
            }
          }
        }
      },
      // 班级
      chooseclass (data, index) {
        if (data.isShow) {
          data.isShow = false
          // 全选
          if (data.onlyId === '-1') {
            this.classList.forEach(item1 => {
              this.checkArr = []
              item1.isShow = false
            })
          } else {
            // 全选取消
            this.classList[0].isShow = false
            let index1 = this.checkArr.map(element => { return element.onlyId }).indexOf(data.onlyId)
            if (index1 !== -1) {
              this.checkArr.splice(index1, 1)
            }
          }
        } else {
          // 全选
          if (data.onlyId === '-1') {
            this.checkArr = []
            this.classList.forEach(item1 => {
              this.checkArr.push({ CoursePlanAID: item1.CoursePlanAID, CoursePlanAIDType: item1.CoursePlanAIDType, onlyId: item1.onlyId })
              item1.isShow = true
            })
          } else {
            data.isShow = true
            this.checkArr.push({ CoursePlanAID: data.CoursePlanAID, CoursePlanAIDType: data.CoursePlanAIDType, onlyId: data.onlyId })
          }
          // 自动全选
          if (this.checkArr.length === this.classList.length - 1) {
            this.classList.forEach((item, index) => {
              item.isShow = true
            })
          }
        }
        // 删除全选-1
        this.checkArr.forEach((item, index) => {
          if (item.onlyId === '-1') {
            this.checkArr.splice(index, 1)
          }
        })
        const isShow = data.isShow
        this.updateDraft(this.classList, index, { isShow })
      },
      chooseject (item, index) {
        // 学科变化清空班级数组
        this.checkArr = []
        if (item.isShow) {
          item.isShow = false
          // 全部
          if (item.DisciplineID === '-1') {
            this.subjectList.forEach(item1 => {
              this.selectId = []
              item1.isShow = false
            })
          } else {
            // 全选取消
            this.subjectList[0].isShow = false
            let index1 = this.selectId.map(element => { return element }).indexOf(item.DisciplineID)
            if (index1 !== -1) {
              this.selectId.splice(index1, 1)
            }
          }
        } else {
          // 全部
          if (item.DisciplineID === '-1') {
            this.subjectList.forEach(item1 => {
              this.selectId.push(item1.DisciplineID)
              item1.isShow = true
            })
          } else {
            item.isShow = true
            this.selectId.push(item.DisciplineID)
          }
          // 自动全选
          if (this.selectId.length === this.subjectList.length - 1) {
            this.subjectList.forEach((item, index) => {
              item.isShow = true
            })
          }
          // 选中去重
          this.selectId = Array.from(new Set(this.selectId))
          // 删除全选-1
          this.selectId.forEach((item, index) => {
            if (item === '-1') {
              this.selectId.splice(index, 1)
            }
          })
        }
        // 获取班级
        if (this.selectId.length !== 0) {
          this.fetchClass()
        }
        const isShow = item.isShow
        this.updateDraft(this.subjectList, index, { isShow })
      },
      // 更新视图
      updateDraft (tableData, index, field) {
        const obj = Object.assign({}, tableData[index])
        this.$set(tableData, index, {})
        for (var key in field) {
          obj[key] = field[key]
        }
        this.$set(tableData, index, obj)
      }
    }
  }
</script>
<style lang="less" scoped>
.average-grade{
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
  .spanmore{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .container-all {
    // padding: 20px;
    background-color: #fff;
    .xy-content-title {
      border-top: none;
      border-radius: 4px 4px 0 0;
      padding: 20px;
      border: 1px solid #d9d9d9;
      .more{
         color:#1890FF
      }
      .more-height{
         height: 100% !important;
      }
    }
     .xy-content-body {
      border: 1px solid #d9d9d9;
      border-top: none;
      border-radius: 0 0 4px 4px;
     }
  }
  .TableData1{
    th{
      div{
        text-align: center !important;
        span{
          color:rgba(0,0,0,0.65) ;
        }
      }
    }
    img{
      width: 16px;
      height: 16px;
    }
  }
  .table-data{
    width:100%;
    border: 1px solid #EBEEF5;
    thead{
      th:first-child{
        text-align: left;
        font-weight: 700;
        padding:0 0 0 10px;
      }
      th{
        background: #FAFAFA;
        border-right: 1px solid #EBEEF5;
        border-bottom: 1px solid #EBEEF5;
        height: 54px;
        line-height: 54px;
        div{
          // color:#909399;
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
    .tBody{
      color: #606266;
      tr:first-child{
        td{
          width: 150px;
          span{
              color:#295AAE;
            }
            span:hover{
              border-bottom: 1px solid #295AAE;
            }
        }
      }
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
          text-align: center;
          text-overflow: ellipsis;
          vertical-align: middle;
          background-color: #fff;
          -webkit-transition: background-color 0.2s ease-in-out;
          transition: background-color 0.2s ease-in-out;
          width: 150px;
          /deep/div{
            padding:3px 18px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            text-align: center;
          }
        }
      }
      /deep/tr:hover{
        /deep/td{
          background-color: #ebf7ff;
        }
      }
    }
    .tBody1{
      color: #606266;
      tr:first-child{
        td{
          width: 150px;
        }
      }
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
          text-align: center;
          text-overflow: ellipsis;
          vertical-align: middle;
          background-color: #fff;
          -webkit-transition: background-color 0.2s ease-in-out;
          transition: background-color 0.2s ease-in-out;
          width: 150px;
          /deep/div{
            padding:3px 18px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            text-align: center;
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
  .echarts{
    padding: 24px 35px;
  }
  .container{
    margin-top:20px;
  }
  .container-top{
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    div.calssName{
      // width: 90%;
      &>span:last-child{
        margin-right: 0px;
      }
      &>span{
          box-sizing: content-box;
          display: inline-block;
          padding:0 15px;
          color:rgba(0,0,0,0.65);
          background: #fff;
          // height: 22px;
          // line-height: 22px;
          text-align: center;
          border-radius: 5px;
          margin-right: 20px;
          margin-bottom:10px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        &>span.active{
          background: rgba(65,150,255,1);
          color:#fff;
        }
    }
  }
}
</style>
