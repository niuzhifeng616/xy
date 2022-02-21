<template>
  <div class="xy-content-module">
    <div class="xy-content-title">
      <div class="xy-flex xy-center">
        <p>学年/学期：</p>
        <cascader
          :data="yearSessionData"
          style="width:300px"
          v-model="searchValue"
          @on-change="cascaderChange"
          placeholder=""
        >
        </cascader>
      </div>
    </div>
    <div class="xy-content-body">
      <div v-if="allDataList.length">
        <div
          class="container"
          v-for="(item, index) in allDataList"
          :key="index"
        >
          <p v-text="item.AssessProjectName"></p>
          <div class="tip xy-flex xy-center xy-between">
            <div class="box">
              <div class="box1">
                <p>评价考试：</p>
                <p v-text="item.TeachingExaminationName"></p>
              </div>
              <div class="box1">
                <p>参考考试：</p>
                <p v-text="item.ReferenceExaminationName"></p>
              </div>
            </div>
            <p>发布时间：{{item.ReleaseDate}}</p>
          </div>
          <div v-if="item.SubjectScoreBlock.length">
            <div
              class="eva"
              v-for="(vv,index) in item.SubjectScoreBlock"
              :key="index"
            >
              <div class="container">
                <div class="subject xy-flex">
                  <p v-text="vv.SubjectName"></p>
                  <Progress
                    :percent="vv.MyScore >= 100 ? 100 : vv.MyScore"
                    :stroke-width="20"
                    stroke-color="#52C41A"
                    class="progress"
                  >
                    <span class="score" :style="{ left: ((vv.MyScore >= 13 ? vv.MyScore : 13) - 13) + '%'}">
                      <span v-text="vv.MyScore"></span>
                    </span>
                  </Progress>
                  <p>满分：{{vv.TotalScore}}分</p>
                </div>
                <div class="tab" v-if="vv.TargetScoreBlock.length">
                  <a-table
                    :showHeader="false"
                    :columns="sourceColumns"
                    :data-source="vv.TargetScoreBlock"
                    :pagination="false"
                  >
                    <div slot="AssessTargetName" slot-scope="text, record">
                      <div class="icon-lf">
                        <div :style="{ background: record.bg }">
                          <i class="iconfont">&#xe717;</i>
                        </div>
                          <span class="line-one" v-text="record.AssessTargetName"></span>
                      </div>
                    </div>
                    <div slot="Score" slot-scope="text, record">
                      <p class="line-one" v-text="record.AssessTargetType === 2 ? '增量' : '原始分'"></p>
                      <p class="line-two" v-text="record.AssessTargetType === 2 ? record.Increment : record.Score"></p>
                    </div>
                    <div slot="FFScore" slot-scope="text, record">
                      <p class="line-one">赋分</p>
                      <p class="line-two" v-text="record.FFScore"></p>
                    </div>
                    <div slot="Weight" slot-scope="text, record">
                      <p class="line-one">权重</p>
                      <p class="line-two" v-text="record.Weight"></p>
                    </div>
                    <div slot="SupposedResult" slot-scope="text, record">
                      <p class="line-one">得分</p>
                      <p class="line-two" v-text="record.SupposedResult"></p>
                    </div>
                    <div slot="AssessTargetScore" slot-scope="text, record" :style="{ display: record.AssessTargetType === 2 ? 'block' : 'none'}">
                      <p class="line-one" v-text="`评价考试${record.AssessTargetName.substr(0, 3)}`"></p>
                      <p class="line-two" v-text="record.AssessTargetScore"></p>
                    </div>
                    <div slot="ReferenceTargetScore" slot-scope="text, record" :style="{ display: record.AssessTargetType === 2 ? 'block' : 'none'}">
                      <p class="line-one" v-text="`参考考试${record.AssessTargetName.substr(0, 3)}`"></p>
                      <p class="line-two" v-text="record.ReferenceTargetScore"></p>
                    </div>
                  </a-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     <div v-if="!allDataList.length" class="no-data-box">
        <img
          class="no-data-img"
          src="@/assets/common/nullData.svg"
          alt="图片"
        >
        <span class="no-data-text">该搜索条件下没有结果。</span>
      </div>
    </div>
  </div>
</template>
<script>
  // import XyAntTable from '@/components/table/XyAntTable'
  export default {
    // components: {
    //   XyAntTable
    // },
    name: 'MyReport',
    data () {
      return {
        sourceColumns: [
          {
            title: '标题',
            dataIndex: 'AssessTargetName',
            key: 'AssessTargetName',
            scopedSlots: { customRender: 'AssessTargetName' }
          },
          {
            title: '原始分',
            dataIndex: 'Score',
            key: 'Score',
            scopedSlots: { customRender: 'Score' }
          },
          {
            title: '赋分',
            dataIndex: 'FFScore',
            key: 'FFScore',
            scopedSlots: { customRender: 'FFScore' }
          },
          {
            title: '权重',
            dataIndex: 'Weight',
            key: 'Weight',
            scopedSlots: { customRender: 'Weight' }
          },
          {
            title: '得分',
            dataIndex: 'SupposedResult',
            key: 'SupposedResult',
            scopedSlots: { customRender: 'SupposedResult' }
          },
          {
            title: '评价考试标准分',
            dataIndex: 'AssessTargetScore',
            key: 'AssessTargetScore',
            scopedSlots: { customRender: 'AssessTargetScore' }
          },
          {
            title: '参考考试标准分',
            dataIndex: 'ReferenceTargetScore',
            key: 'ReferenceTargetScore',
            scopedSlots: { customRender: 'ReferenceTargetScore' }
          }
        ],
        sourceData: [],
        searchValue: [0, 0],
        yearSessionData: [],
        apiPath: `${this.xyApi}/eva`,
        allDataList: []
      }
    },
    created () {
      this.getSessionNodeList()
    },
    methods: {
      cascaderChange (value) {
        this.searchValue = value
        this.featchMyInfo()
      },
      // 学年学期
      async getSessionNodeList () {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/base/xy/comm/GetSessionNodeList`, null, true)
        this.xy.unloading()
        if (res.success) {
          this.yearSessionData = res.data
          this.searchValue = []
          let index = this.yearSessionData.map((item) => {
            return item.IsCurrent
          }).indexOf(true)
          if (index !== -1) {
            this.searchValue.push(this.yearSessionData[index].value)
            let index1 = this.yearSessionData[index].children.map((item) => {
              return item.IsCurrent
            }).indexOf(true)
            if (index1 !== -1) {
              this.searchValue.push(this.yearSessionData[index].children[index1].value)
            }
          } else {
            for (let i = 0; i < this.yearSessionData.length; i++) {
              if (this.yearSessionData[i].children.length > 0) {
                this.searchValue = [this.yearSessionData[i].value, this.yearSessionData[i].children[0].value]
              }
            }
          }
          this.featchMyInfo()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      async featchMyInfo () {
        this.xy.loading()
        const params = {
          schoolDistrictID: 0,
          academicSessionID: this.searchValue[1]
        }
        let res = await this.xy.get(`${this.apiPath}/api/TeachingAssessReport/GetMyReport`, params)
        this.xy.unloading()
        if (res.success) {
          let color = ['#F5C042', '#7BCE7B', '#4B92EF', '#7BCE7B', '#2C92F6', '#4C5A4F', '#F5C042', '#7BCE7B', '#4B92EF']
          if (res.data && res.data.length) {
            this.allDataList = res.data.map((vv, i) => {
              vv.SubjectScoreBlock.map(vs => {
                return vs.TargetScoreBlock && vs.TargetScoreBlock.length ? vs.TargetScoreBlock.map((v, i) => {
                  v.bg = color[i]
                  v.key = v.AssessTargetCode
                  return v
                }) : []
              })
              return vv
            })
            // console.log(this.allDataList)
          } else {
            this.allDataList = []
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-module {
  // padding: 20px;
  .xy-content-title {
    padding: 20px 10px 0px 20px;
  }
  .xy-content-body {
    /deep/ .icon-lf {
      > div {
        margin-right: 24px;
        width: 48px;
        height: 48px;
        border-radius: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        .iconfont {
          color: #FFF;
        }
      }
      display: flex;
      // justify-content: center;
      align-items: center;
    }
    // padding: 0 20px 20px 20px;
    .container {
      padding-top: 40px;
      > p {
        padding: 20px 0;
        font-weight: bold;
        font-size: 16px;
      }
      .eva {
        .container {
          .subject {
            /deep/ .progress {
              position: relative;
              .score {
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                top: -20px;
                width: 32px;
                height: 32px;
                background: #52c41a;
                border: 2px solid #ffffff;
                box-shadow: 0px 2px 4px 0px rgba(47, 112, 15, 0.3);

                border-radius: 50% 50% 0% 50%;

                /*顺时针旋转45度*/

                transform: rotate(45deg);
                > span {
                  transform: rotate(-45deg);
                  color: #fff;
                }
              }
            }
            > p:nth-of-type(1) {
              padding: 20px;
              font-size: 16px;
              color: rgba(0, 0, 0, 0.85);
              font-weight: bold;
            }
            > p:nth-of-type(2) {
              padding: 20px;
              font-size: 14px;
              color: rgba(0, 0, 0, 0.65);
              font-weight: bold;
            }
          }
          .progress {
            max-width: 500px;
            display: flex;
            align-items: center;
          }
          .tab {
            // /deep/ .ant-table-thead {
            //   display: none;
            // }
            .line-one {
              color: rgba(0,0,0,0.45);
              padding: 10px 0 5px 0;
            }
            .line-two {
              color: rgba(0,0,0,0.85);
              padding: 5px 0 10px 0;
            }
          }
        }
      }
      .tip {
        .box {
          min-width: 300px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .box1 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-right: 32px;
            > p:nth-of-type(1) {
              color: rgba(0, 0, 0, 0.65);
            }
            > p:nth-of-type(2) {
              color: rgba(0, 0, 0, 0.85);
            }
          }
        }
        > p {
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }
  }
}
</style>
