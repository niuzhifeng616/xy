<!-- 我的成绩 -->
<template>
    <div class="xy-content-module">
      <div class="xy-content-title clearfix">
        <div class="my-ach-top flex-flow">
          <radio-group v-model="tabsName" type="button">
            <Radio label="original">原始分</Radio>
            <Radio label="leve">等级分</Radio>
          </radio-group>
          <!-- <Tabs :value="tabsName" @on-click="showBox">
            <Tab-pane label="原始分" name="original"></Tab-pane>
            <Tab-pane label="等级分" name="leve"></Tab-pane>
          </!-->
          <div class="xy-flex">
              <div style="margin-right:15px">
                  <span>学年学期：</span>
                  <cascader :data="yearSessionData"
                            trigger="hover"
                            style="width:200px; display:inline-block"
                            v-model="yearSessionId" placeholder="请选择学年学期"
                            @on-change="cascaderChange"></cascader>
              </div>
              <div>
                  <span>考试名称：</span>
                  <Select v-model="defaType" style="width:200px;" @on-change="selectChange" placeholder="请选择考试名称">
                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}
                    </Option>
                  </Select>
              </div>
          </div>
          <!-- <div class="select-gro">
            <cascader :data="yearSessionData" trigger="hover" v-model="yearSessionId" placeholder="请选择学年学期"
              @on-change="cascaderChange"></cascader>
            <Select v-model="defaType" @on-change="selectChange" placeholder="请选择考试名称">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}
              </Option>
            </Select>
          </div> -->
        </div>
      </div>
      <div class="xy-content-body">
        <!-- 原始分 -->
        <div class="tabs-left">
          <div class="lf-top">
            <p>排名</p>
            <div v-show="!isLoading" style="height: 332px;">
              <div style="height: 332px;width: 600px;margin: 0 auto;" v-show="rankEc && rankDisplay">
                <div ref="rankEchar" style="height: 332px;width: 600px;"></div>
              </div>
              <div class="no-dt" v-show="!rankEc || !rankDisplay">
                <i class="iconfont">&#xe6e7;</i>
                <p>该搜索条件下没有结果。</p>
              </div>
            </div>
          </div>

          <div class="lf-bottom">
            <p>标题</p>
            <ul v-if="!isLoading && titList && titList.CombTable.Rows.length > 0">
              <li v-for="(item, index) in titList.CombTable.Rows" :key="index">
                <div class="tit-lf">
                  <div class="icon-bg"
                    :style="index % 2 === 0 ? {backgroundColor: '#597EF7'}: {backgroundColor: '#36CFC9'}">
                    <i></i>
                  </div>
                  <div class="tit-lf-txt">
                    <p class="cl-shallow">组合</p>
                    <p class="cl-deep" v-text="item.TagTitle"></p>
                  </div>
                </div>

                <div class="tit-ri">
                  <div class="tit-ri-txt tit-ri-txt-bd"
                    v-if="(titList.ScoreDisplay && titList.RankDisplay) || (!titList.RankDisplay && titList.ScoreDisplay)">
                    <p class="cl-shallow">分数</p>
                    <p>
                      <span class="cl-deep font-size20" v-text="item.Score < 0 ? '缺考' : item.Score"></span>&nbsp;
                      <span class="cl-shallow" v-if="item.Score >= 0">分</span>
                    </p>
                  </div>
                  <div class="tit-ri-txt tit-ri-txt-bd"
                    v-if="(titList.ScoreDisplay && titList.RankDisplay) || (titList.RankDisplay && !titList.ScoreDisplay)">
                    <p class="cl-shallow">班排名</p>
                    <p>
                      <span class="cl-deep font-size20"
                        v-text="item.ClassRank ? item.ClassRank.substr(0,item.ClassRank.indexOf('/')) : ''"></span>&nbsp;/
                      <span class="cl-shallow"
                        v-text="item.ClassRank ? item.ClassRank.substr(item.ClassRank.indexOf('/') + 1) : ''"></span>
                    </p>
                  </div>
                  <div class="tit-ri-txt"
                    v-if="(titList.ScoreDisplay && titList.RankDisplay) || (titList.RankDisplay && !titList.ScoreDisplay)">
                    <p class="cl-shallow">年排名</p>
                    <p>
                      <span class="cl-deep font-size20"
                        v-text="item.GradeRank ? item.GradeRank.substr(0,item.GradeRank.indexOf('/')) : ''"></span>&nbsp;/
                      <span class="cl-shallow"
                        v-text="item.GradeRank ? item.GradeRank.substr(item.GradeRank.indexOf('/') + 1) : ''"></span>
                    </p>
                  </div>
                </div>
              </li>
            </ul>
            <div class="no-dt" v-show="!isLoading && !titList">
              <i class="iconfont">&#xe6e7;</i>
              <p>该搜索条件下没有结果。</p>
            </div>
          </div>
        </div>
        <div class="tabs-right">
          <div class="tabs-ri">
            <p>标题</p>
            <div class="tip-txt" v-show="!isLoading && tabList && tabList.length > 0">
              <div class="lear">
                <i class="lear-i"></i>
                <p>学考</p>
              </div>
              <div class="sele">
                <i class="sele-i"></i>
                <p>选考</p>
              </div>
            </div>
          </div>

          <Table :columns="tabCol" :data="tabList" v-show="!isLoading && tabList && tabList.length > 0">
          </Table>
          <div class="no-dt" v-show="!isLoading && tabList && tabList.length === 0">
            <i class="iconfont">&#xe6e7;</i>
            <p>该搜索条件下没有结果。</p>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
  export default {
    name: 'MyAchievement',
    components: {
    },
    data () {
      return {
        yearSessionData: [], // 学年学期
        yearSessionId: [], // 默认选中id
        typeList: [], // 考试类型
        defaType: null, // 0就是全部
        tabCol: [],
        tabList: [],
        tabsName: 'original',
        isShow: false,
        rankEc: null,
        titList: null,
        isLoading: true,
        rankEchar: {},
        rankDisplay: false, // 是否展示排名
        scoreDisplay: false// 是否展示分数
      }
    },
    created () {
      this.getYear()
    },
    mounted () {

    },
    watch: {
      tabsName: {
        handler () {
          this.getDt()
        }
      }
    },
    methods: {
      async getDt () {
        this.tabList = []
        this.rankEc = null
        this.titList = null
        var url = this.tabsName === 'original' ? '/api/AchievementRecordDetailsSummary/GetMyScore' : '/api/AchievementRecordDetailsSummary/GetMyFFScore'
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}${url}`, {
          achievementRecordID: this.defaType || 0
        })
        this.xy.unloading()
        this.isLoading = false
        if (res.success) {
          this.rankDisplay = res.data.RankDisplay
          this.scoreDisplay = res.data.ScoreDisplay
          var dta = [
            {
              title: '学科',
              key: 'TagTitle',
              minWidth: 200,
              render: (h, params) => {
                return h('div', {
                  // attrs: {
                  //   class: 'line-center'
                  // },
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '-12px'
                  }
                }, [
                  h('span', {
                    // attrs: {
                    //   class: params.row.SubjectType === 0 ? 'type-no' : params.row.SubjectType === 1 ? 'lear-i' : 'sele-i'
                    // },
                    style: {
                      color: '#1890FF',
                      marginRight: '4px',
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: params.row.SubjectType === 1 ? '#61CD31' : params.row.SubjectType === 2 ? '#F9A443' : ''
                    }
                  }),
                  h('span', params.row.TagTitle)
                ])
              }
            },
            {
              title: '分数',
              key: 'Score',
              width: 160
            },
            {
              title: '班排名',
              key: 'ClassRank',
              width: 160
            },
            {
              title: '年排名',
              key: 'GradeRank',
              width: 160
            }
          ]
          if (res.data) {
            if (res.data.ScoreDisplay && !res.data.RankDisplay) {
              dta.splice(2, 2)
              this.tabCol = dta
            } else if (res.data.RankDisplay && !res.data.ScoreDisplay) {
              dta.splice(1, 1)
              this.tabCol = dta
            } else if (res.data.ScoreDisplay && res.data.RankDisplay) {
              this.tabCol = dta
            } else {
              dta.splice(1, 3)
              this.tabCol = dta
            }
            if (res.data.SingleTable && res.data.SingleTable.Rows && res.data.SingleTable.Rows.length > 0) {
              this.tabList = res.data.SingleTable.Rows
            }
            if (res.data.CombTable && res.data.CombTable.Rows && res.data.CombTable.Rows.length > 0) {
              this.titList = res.data
            }
            var dt = res.data.Chart
            if (dt && dt.Datas && dt.Indicators && dt.Legend && dt.Indicators.length > 0 && dt.Legend.length > 0 && dt.Datas.length > 0) {
              var option = {
                tooltip: {
                  trigger: 'item',
                  backgroundColor: 'rgba(0,0,250,0.2)',
                  formatter (val) {
                    return val.name + '<br/>' + dt.Indicators.map(function (vv, index) {
                      if (val.length - 1 === index) {
                        return vv.text + '：' + (val.data.cace[index] >= 0 ? val.data.cace[index] : '-')
                      } else {
                        return vv.text + '：' + (val.data.cace[index] >= 0 ? val.data.cace[index] : '-') + '<br/>'
                      }
                    }).join('')
                  }
                },
                color: ['#1890FF', '#FACC14', '#2FC25B'],
                legend: {
                  type: 'scroll',
                  bottom: 10,
                  // data: (function (){
                  //     var list = [];
                  //     for (var i = 1; i <=28; i++) {
                  //         list.push(i + 2000 + '');
                  //     }
                  //     return list;
                  // })()
                  data: dt.Legend
                },
                // visualMap: {
                //   top: 'middle',
                //   right: 10,
                //   color: ['red', 'yellow'],
                //   calculable: true
                // },
                // radar: {
                //   indicator: dt.Indicators,
                //   radius: 80
                // },
                radar: [
                  {
                    splitNumber: 3, // 雷达图圈数设置
                    indicator: dt.Indicators,
                    center: ['50%', '50%'], // 雷达图整体位置
                    radius: 80// 缩放
                  }
                ],
                series: {
                  // symbol: 'triangle',//拐点样式
                  symbolSize: 4, // 拐点大小
                  name: '排名',
                  type: 'radar',
                  lineStyle: {
                    width: 2
                  },
                  emphasis: {
                    areaStyle: {
                      color: 'rgba(0,250,0,0.3)'
                    }
                  },
                  data: dt.Datas.map(function (vv) {
                    return {
                      name: vv.name,
                      cace: vv.value,
                      value: vv.value.map(function (vl) {
                        if (vl < 0) {
                          return 0
                        } else {
                          return vl
                        }
                      })
                    }
                  })

                }
              }
              var dom = this.$refs.rankEchar
              this.rankEc = this.echarts.init(dom)
              this.rankEc.setOption(option, true)
            }
          } else {
          }
        }
      },
      cascaderChange (val) {
        this.yearSessionId[0] = val[0]
        this.yearSessionId[1] = val[1]
        this.getCombox()
      },
      selectChange (val) {
        if (!val) return
        this.getDt()
      },
      // 获取学年学期
      async getYear () {
        this.defaType = null
        this.typeList = []
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`)
        if (res.success) {
          if (res.data && res.data.length > 0) {
            this.yearSessionData = res.data

            var index = this.yearSessionData.map(function (item) {
              return item.IsCurrent
            }).indexOf(true)
            if (index !== -1) {
              this.yearSessionId.push(this.yearSessionData[index].value)
              var index1 = this.yearSessionData[index].children.map(function (item) {
                return item.IsCurrent
              }).indexOf(true)
              if (index1 !== -1) {
                this.yearSessionId.push(this.yearSessionData[index].children[index1].value)
              } else {
                this.yearSessionId.push(this.yearSessionData[index].children[0].value)
              }
            } else {
              for (var i = 0; i < this.yearSessionData.length; i++) {
                if (this.yearSessionData[i].children.length > 0) {
                  this.yearSessionId = [this.yearSessionData[i].value, this.yearSessionData[i].children[0].value]
                  return false
                }
              }
            }
            if (this.yearSessionId[1]) {
              this.getCombox()
            }
          } else {
            this.isLoading = false
          }
        }
      },
      // 获取考试名称（下拉列表）
      async getCombox (id) {
        this.defaType = null
        this.typeList = []
        this.tabList = []
        this.rankEc = null
        this.titList = null
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AchievementRecord/GetRecords`, {
          academicSessionID: this.yearSessionId[1],
          schoolDistrictID: id || 0
        })
        if (res.success) {
          if (res.data && res.data.length > 0) {
            this.typeList = res.data.map(function (val) {
              return {
                value: val.ID,
                label: val.Name
              }
            })
            this.defaType = res.data[0].ID
            // this.typeList.unshift({
            //   value: 0,
            //   label: '全部'
            // })
            this.getDt()
          } else {
            this.isLoading = false
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.flex-flow{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.my-ach-top {
  position: relative;
}
.ivu-tabs-bar {
  border-bottom: 0px solid #dcdee2;
  margin-bottom: 0px;
}

.xy-content-body {
  background-color: #F9F9F9;
  display: flex;
  justify-content: space-between;
}
.tabs {
  display: flex;
  justify-content: space-between;
}
.tabs-left {
  /* flex: .4; */
  width: 40%;
  /* border: 1px solid yellowgreen; */
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  /* background-color: #FFF; */
}
.tabs-right {
  /* border: 1px solid yellowgreen; */
  /* flex: .59; */
  width: 59%;
  background-color: #FFF;
}
.tabs-left .lf-top > p, .tabs-left .lf-bottom > p, .tabs-ri {
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
}
.tabs-left .lf-top > p, .tabs-left .lf-bottom > p {
  font-weight: bold;
  color:rgba(0,0,0,0.85);
  border-bottom: 1px solid rgba(233,233,233,1);
}

.tabs-left .lf-top {
  background-color: #FFF;
  height: 372px;
  margin-bottom: 20px;
  min-width: 500px;
}
.tabs-left .lf-bottom {
  height: 359px;
  background-color: #FFF;
  /* overflow: hidden; */
}
.tabs-left .lf-bottom > ul {
  /* overflow-y: auto; */
  display: flex;
  justify-content: space-around;
  flex-flow: column nowrap;
  padding: 10px;
  overflow: auto;
  /* max-height: 319px; */
}
.tabs-left .lf-bottom > ul > li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tabs-left .tit-lf {
  display: flex;
  flex: 1;
}
.tabs-left .tit-lf .icon-bg {
  height: 42px;
  width: 42px;
  /* background:rgba(89,126,247,1); */
  border-radius:4px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}
.tabs-left .tit-lf .icon-bg i {
  height: 16px;
  width: 20px;
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAANlBMVEVHcEz///////////////////////////////////////////////////////////////////+GUsxbAAAAEXRSTlMAikqA+iz0Cr7qG0Fb3M+qdN9Ppc8AAAB4SURBVCjPvdFLDsMgDARQA8YfIKS+/2UbRRRBYFVVneU8IQYB8Ntwy6MuaC0aJ5BWVy+zXECilzieRYwip42IVVA+bRExjHCfMAuj3HdQWzCK73O/lcT1hI0cXPDVl3nqfSrohldm2vcfWfsmGswtv5JVs2CA/+UNhcgLAQffxHQAAAAASUVORK5CYII=') no-repeat center center;
}
.tabs-left .tit-lf .tit-lf-txt {
  display: flex;
  flex-flow: column nowrap;
}
.tabs-left .tit-lf .tit-lf-txt p {
  height: 50%;
}
.tabs-left .tit-ri  {
  display: flex;
  flex: 1;
  justify-content: flex-end;
}
.tabs-left .tit-ri .tit-ri-txt {
  width: 33.333%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column nowrap;
  margin: 5px 0;
}
.tabs-left .tit-ri .tit-ri-txt-bd {
  border-right:1px solid rgba(233,233,233,1);
}
.tabs-ri {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(233,233,233,1);
}
.tabs-ri > p {
  flex: .2;
  font-weight: bold;
  color:rgba(0,0,0,0.85);
}
.tabs-ri .tip-txt {
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-width: 200px;
}
.tabs-ri .tip-txt .lear,
.tabs-ri .tip-txt .sele {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex: .25;
}
.sele-i,
.lear-i,
.type-no {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.lear-i {
  background-color: #61CD31;
}
.sele-i {
  background-color: #F9A443;
}
.cl-deep {
  color:rgba(0,0,0,0.85);
}
.cl-shallow {
  color:rgba(0,0,0,0.45);
}
.font-size20 {
  font-size: 20px;
}
// .line-center {
//   display: flex;
//   align-items: center;
//   margin-left: -12px;
// }
.ivu-table-wrapper {
  margin: 0 10px;
}
.ivu-table th {
  background:rgba(250,250,250,1);
}
.ivu-table-overflowX {
  overflow-x: hidden;
}
.ivu-table-header th span {
  color:rgba(0,0,0,0.65);
}
.ivu-table-tip {
  overflow-x: hidden;
  overflow-y: hidden;
}
.no-dt {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.no-dt i {
  margin-right: 10px;
  font-size: 24px;
  color: #cecece;
}
.no-dt p {
  color:rgba(0,0,0,0.25);
  font-size:16px;
}
</style>
