<!--教学质量：分析设置-->
<template>
  <div class="xy-content-module">
    <div class="container">
      <div class="box1">
        <p>分数段</p>
        <div class="box-subor">
          <Form :model="formData"
                :label-width="12"
                class="form-sty">
            <FormItem label-for="ScoreSegment"
                      label="每">
              <Input type="number"
                     @on-blur="inputNumChge(formData.SettingBase.ScoreSegment,1)"
                     v-model="formData.SettingBase.ScoreSegment"
                     element-id="ScoreSegment"
                     class="input-num" />
              <span>分一段</span>
            </FormItem>
          </Form>
        </div>
      </div>
      <div class="box2">
        <p>名次段</p>
        <div class="box-subor">
          <Form :model="formData"
                :label-width="12"
                class="form-sty xy-between">
            <FormItem label-for="Front1"
                      label="前">
              <Input type="number"
                     @on-blur="inputNumChge(formData.SettingRanking[0].Front1,2,0,0)"
                     v-model="formData.SettingRanking[0].Front1"
                     element-id="Front1"
                     class="input-num" />
              <span>名</span>
            </FormItem>
            <FormItem label-for="Front2"
                      label="前">
              <Input type="number"
                     @on-blur="inputNumChge(formData.SettingRanking[0].Front2,2,0,1)"
                     v-model="formData.SettingRanking[0].Front2"
                     element-id="Front2"
                     class="input-num" />
              <span>名</span>
            </FormItem>
            <FormItem label-for="Front3"
                      label="前">
              <Input type="number"
                     @on-blur="inputNumChge(formData.SettingRanking[0].Front3,2,0,2)"
                     v-model="formData.SettingRanking[0].Front3"
                     element-id="Front3"
                     class="input-num" />
              <span>名</span>
            </FormItem>
            <FormItem label-for="Front4"
                      label="前">
              <Input type="number"
                     @on-blur="inputNumChge(formData.SettingRanking[0].Front4,2,0,3)"
                     v-model="formData.SettingRanking[0].Front4"
                     element-id="Front4"
                     class="input-num" />
              <span>名</span>
            </FormItem>
            <FormItem label-for="After1"
                      label="后">
              <Input type="number"
                     @on-blur="inputNumChge(formData.SettingRanking[0].After1,2,0,4)"
                     v-model="formData.SettingRanking[0].After1"
                     element-id="After1"
                     class="input-num" />
              <span>名</span>
            </FormItem>
          </Form>
        </div>
      </div>
      <div class="box3">
        <p>比例段</p>
        <div class="box-subor">
          <div class="box-bott">
            <Form :model="formData"
                  :label-width="12"
                  class="form-sty xy-between">
              <FormItem label-for="Front31"
                        label="前">
                <Input type="number"
                       @on-blur="inputNumChge(formData.SettingRanking[1].Front1,3,1,0)"
                       v-model="formData.SettingRanking[1].Front1"
                       element-id="Front31"
                       class="input-num" />
                <span>%</span>
              </FormItem>
              <FormItem label-for="Front32"
                        label="前">
                <Input type="number"
                       @on-blur="inputNumChge(formData.SettingRanking[1].Front2,3,1,1)"
                       v-model="formData.SettingRanking[1].Front2"
                       element-id="Front32"
                       class="input-num" />
                <span>%</span>
              </FormItem>
              <FormItem label-for="Front33"
                        label="前">
                <Input type="number"
                       @on-blur="inputNumChge(formData.SettingRanking[1].Front3,3,1,2)"
                       v-model="formData.SettingRanking[1].Front3"
                       element-id="Front33"
                       class="input-num" />
                <span>%</span>
              </FormItem>
              <FormItem label-for="Front34"
                        label="前">
                <Input type="number"
                       @on-blur="inputNumChge(formData.SettingRanking[1].Front4,3,1,3)"
                       v-model="formData.SettingRanking[1].Front4"
                       element-id="Front34"
                       class="input-num" />
                <span>%</span>
              </FormItem>
              <FormItem label-for="After31"
                        label="后">
                <Input type="number"
                       @on-blur="inputNumChge(formData.SettingRanking[1].After1,3,1,4)"
                       v-model="formData.SettingRanking[1].After1"
                       element-id="After31"
                       class="input-num" />
                <span>%</span>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
      <div class="box4">
        <p>区分度</p>
        <div class="box-subor">
          <div class="box-bott">
            <p>区分度：前百分之多少学生的得分率与后百分之多少学生的得分率的差。</p>
            <p>得分率：平均分比卷面总分。</p>
            <div class="box-inp">
              <Form :model="formData"
                    :label-width="12"
                    class="form-sty add">
                <div class="inp1">
                  <FormItem label-for="DistinctionFrontRate"
                            label="前">
                    <Input type="number"
                           @on-blur="inputNumChge(formData.SettingBase.DistinctionFrontRate,4,0)"
                           v-model="formData.SettingBase.DistinctionFrontRate"
                           element-id="DistinctionFrontRate"
                           class="input-num" />
                    <span>%</span>
                  </FormItem>
                </div>
                <div class="inp2">
                  <FormItem label-for="DistinctionAfterRate"
                            label="后">
                    <Input type="number"
                           @on-blur="inputNumChge(formData.SettingBase.DistinctionAfterRate,4,1)"
                           v-model="formData.SettingBase.DistinctionAfterRate"
                           element-id="DistinctionAfterRate"
                           class="input-num" />
                    <span>%</span>
                  </FormItem>
                </div>

              </Form>
            </div>
          </div>
        </div>
      </div>
      <div class="box5">
        <div class="box5-tit">
          <p>优良率</p>
          <p @click="goStting">统一设置</p>
        </div>
        <div class="box-tab">
          <Table :columns="columns"
                 :data="niceList"
                 :loading="tableLoading"
                 v-if="formLoad && niceList && niceList.length > 0">
          </Table>
          <!--暂无数据-->
          <div class="no-data-box"
               v-if="formLoad && niceList && niceList.length === 0">
            <img class="no-data-img"
                 src="/image/Nodata/no-Data.png" />
            <span class="no-data-text">您还没有优良率的信息，请添加优良率。</span>
          </div>
        </div>
      </div>
    </div>
    <div class="box6">
      <Button class="xy-btn-primary"
              shape="circle"
              @click="save">保存</Button>
    </div>
    <Modal v-model="modal"
           :loading="loading"
           title="统一设置">
      <Form :model="SettingDiscipline"
            :label-width="80">
        <FormItem label-for="OutsRate"
                  label="优秀率：">
          <Input v-model="SettingDiscipline.OutsRate"
                 type="number"
                 @on-blur="inputNumChge(SettingDiscipline.OutsRate,6,0)"
                 element-id="OutsRate"
                 class="input-num"></Input>
          <span>%</span>
        </FormItem>
        <FormItem label-for="GoodRate"
                  label="良好率：">
          <Input type="number"
                 @on-blur="inputNumChge(SettingDiscipline.GoodRate,6,1)"
                 v-model="SettingDiscipline.GoodRate"
                 element-id="GoodRate"
                 class="input-num" />
          <span>%</span>
        </FormItem>
        <FormItem label-for="PassRate"
                  label="合格率：">
          <Input type="number"
                 @on-blur="inputNumChge(SettingDiscipline.PassRate,6,2)"
                 v-model="SettingDiscipline.PassRate"
                 element-id="PassRate"
                 class="input-num" />
          <span>%</span>
        </FormItem>
        <FormItem label-for="LowRate"
                  label="低分率：">
          <Input type="number"
                 @on-blur="inputNumChge(SettingDiscipline.LowRate,6,3)"
                 v-model="SettingDiscipline.LowRate"
                 element-id="LowRate"
                 class="input-num" />
          <span>%</span>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="modal = false">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="comSttingSave">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'EaAASsetting',
    components: {
    },
    data () {
      return {
        tableLoading: true,
        segValue: 5,
        columns: [
          {
            title: '科目名',
            key: 'DisciplineName',
            minWidth: 270
          },
          {
            title: '优秀率',
            key: 'OutsRate',
            width: 270,
            render: (h, params) => {
              return h('div', [
                h('input-number', {
                  props: {
                    max: 100,
                    min: 1,
                    value: params.row.OutsRate
                  },
                  style: {
                    marginRight: '12px'
                  },
                  on: {
                    'on-change': (value) => {
                      // 值改变时
                      // 将渲染后的值重新赋值给单元格值
                      params.row.OutsRate = ~~value || null
                      this.$set(this.niceList[params.index], 'OutsRate', ~~value || null)
                    },
                    'on-blur': () => {
                      this.$set(this.niceList[params.index], 'OutsRate', this.niceList[params.index].OutsRate || 1)
                    }
                  }
                }),
                h('span', '%')
              ])
            }
          },
          {
            title: '良好率',
            key: 'GoodRate',
            width: 270,
            render: (h, params) => {
              return h('div', [
                h('input-number', {
                  attrs: {
                    max: 100,
                    min: 1,
                    precision: 0
                  },
                  props: {
                    value: params.row.GoodRate
                  },
                  style: {
                    marginRight: '12px'
                  },
                  on: {
                    'on-change': (value) => {
                      // 值改变时
                      // 将渲染后的值重新赋值给单元格值
                      params.row.GoodRate = ~~value || null
                      this.$set(this.niceList[params.index], 'GoodRate', ~~value || null)
                    },
                    'on-blur': () => {
                      this.$set(this.niceList[params.index], 'GoodRate', this.niceList[params.index].GoodRate || 1)
                    }
                  }
                }),
                h('span', '%')
              ])
            }
          },
          {
            title: '合格率',
            width: 270,
            key: 'PassRate',
            render: (h, params) => {
              return h('div', [
                h('input-number', {
                  attrs: {
                    max: 100,
                    min: 1,
                    precision: 0
                  },
                  props: {
                    value: params.row.PassRate
                  },
                  style: {
                    marginRight: '12px'
                  },
                  on: {
                    'on-change': (value) => {
                      // 值改变时
                      // 将渲染后的值重新赋值给单元格值
                      params.row.PassRate = ~~value || null
                      this.$set(this.niceList[params.index], 'PassRate', ~~value || null)
                    },
                    'on-blur': () => {
                      this.$set(this.niceList[params.index], 'PassRate', this.niceList[params.index].PassRate || 1)
                    }
                  }
                }),
                h('span', '%')
              ])
            }
          },
          {
            title: '低分率',
            width: 270,
            key: 'LowRate',
            render: (h, params) => {
              return h('div', [
                h('input-number', {
                  attrs: {
                    max: 100,
                    min: 1,
                    precision: 0
                  },
                  props: {
                    value: params.row.LowRate
                  },
                  style: {
                    marginRight: '12px'
                  },
                  on: {
                    'on-change': (value) => {
                      // 值改变时
                      // 将渲染后的值重新赋值给单元格值
                      params.row.LowRate = ~~value || null
                      this.$set(this.niceList[params.index], 'LowRate', ~~value || null)
                    },
                    'on-blur': () => {
                      this.$set(this.niceList[params.index], 'LowRate', this.niceList[params.index].LowRate || 1)
                    }
                  }
                }),
                h('span', {
                  style: {
                    marginLeft: '8px'
                  }
                }, '%')
              ])
            }
          }
        ],
        loading: true,
        modal: false,
        formLoad: false,
        SettingDiscipline: {
          OutsRate: 1, // 优秀率
          GoodRate: 1, // 良好率
          PassRate: 1, // 及格率
          LowRate: 1 // 低分率
        },
        formData: {
          SettingBase: {
            ScoreSegment: 5, // 分数段--分数间隔
            DistinctionFrontRate: 0, // 区分度--前区间
            DistinctionAfterRate: 0 // 区分度--后区间
          },
          // 名次段，比例段
          SettingRanking: [
            {
              Front1: 1,
              Front2: 1,
              Front3: 1,
              Front4: 1,
              After1: 1,
              RankingType: null
            },
            {
              Front1: 1,
              Front2: 1,
              Front3: 1,
              Front4: 1,
              After1: 1,
              RankingType: null
            }
          ]
        },
        niceList: [],
        ruleValidate: {
          name: [
            { required: true, message: '请填写', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.getNiceList()
    },
    mounted () {
    },
    methods: {
      /**
       *
       * @param {*} val 当前inpu的value
       * @param {*} line 当前input所在第几行
       * @param {*} index SettingRanking属于第几个下标
       * @param {*} vv SettingRanking这个里面的第几个
       */
      inputNumChge (val, line, index, vv) {
        if (line === 1) {
          if (!val || val < 5) {
            this.formData.SettingBase.ScoreSegment = 5
          } else if (val > 20) {
            this.formData.SettingBase.ScoreSegment = 20
          } else {
            this.formData.SettingBase.ScoreSegment = ~~this.formData.SettingBase.ScoreSegment
          }
        } else if (line > 1 < 4) {
          if (vv === 0) {
            if (!val || val < 1) {
              this.formData.SettingRanking[index].Front1 = 1
            } else if (val > 999) {
              this.formData.SettingRanking[index].Front1 = 999
            } else {
              this.formData.SettingRanking[index].Front1 = ~~this.formData.SettingRanking[index].Front1
            }
          } else if (vv === 1) {
            if (this.formData.SettingRanking[index].Front1 >= ~~(this.formData.SettingRanking[index].Front2 || 0)) {
              this.formData.SettingRanking[index].Front2 = ~~this.formData.SettingRanking[index].Front1 + 1
            }
          } else if (vv === 2) {
            if (~~this.formData.SettingRanking[index].Front2 > ~~this.formData.SettingRanking[index].Front3) {
              this.formData.SettingRanking[index].Front3 = ~~this.formData.SettingRanking[index].Front2 + 1
            }
          } else if (vv === 3) {
            if (~~this.formData.SettingRanking[index].Front3 > ~~this.formData.SettingRanking[index].Front4) {
              this.formData.SettingRanking[index].Front4 = ~~this.formData.SettingRanking[index].Front3 + 1
            }
          } else if (vv === 4) {
            if (!val || val < 1) {
              this.formData.SettingRanking[index].After1 = 1
            } else if (val > 999) {
              this.formData.SettingRanking[index].After1 = 999
            } else {
              this.formData.SettingRanking[index].After1 = ~~this.formData.SettingRanking[index].After1
            }
          }
        }
        if (line === 4) {
          if (index === 0) {
            if (!val || val < 1) {
              this.formData.SettingBase.DistinctionFrontRate = 1
            } else if (val > 50) {
              this.formData.SettingBase.DistinctionFrontRate = 50
            } else {
              this.formData.SettingBase.DistinctionFrontRate = ~~this.formData.SettingBase.DistinctionFrontRate
            }
          } else {
            if (!val || val < 1) {
              this.formData.SettingBase.DistinctionAfterRate = 1
            } else if (val > 50) {
              this.formData.SettingBase.DistinctionAfterRate = 50
            } else {
              this.formData.SettingBase.DistinctionAfterRate = ~~this.formData.SettingBase.DistinctionAfterRate
            }
          }
        }
        if (line === 6) {
          switch (index) {
            case 0:
              if (!val || val < 1) {
                this.SettingDiscipline.OutsRate = 1
              } else if (val > 100) {
                this.SettingDiscipline.OutsRate = 100
              } else {
                this.SettingDiscipline.OutsRate = ~~this.SettingDiscipline.OutsRate
              }
              break
            case 1:
              if (!val || val < 1) {
                this.SettingDiscipline.GoodRate = 1
              } else if (val > 100) {
                this.SettingDiscipline.GoodRate = 100
              } else {
                this.SettingDiscipline.GoodRate = ~~this.SettingDiscipline.GoodRate
              }
              break
            case 2:
              if (!val || val < 1) {
                this.SettingDiscipline.PassRate = 1
              } else if (val > 100) {
                this.SettingDiscipline.PassRate = 100
              } else {
                this.SettingDiscipline.PassRate = ~~this.SettingDiscipline.PassRate
              }
              break
            case 3:
              if (!val || val < 1) {
                this.SettingDiscipline.LowRate = 1
              } else if (val > 100) {
                this.SettingDiscipline.LowRate = 100
              } else {
                this.SettingDiscipline.LowRate = ~~this.SettingDiscipline.LowRate
              }
              break
          }
        }
      },
      // 打开统一设置
      goStting () {
        this.modal = true
        this.SettingDiscipline.OutsRate = 1
        this.SettingDiscipline.GoodRate = 1
        this.SettingDiscipline.PassRate = 1
        this.SettingDiscipline.LowRate = 1
      },
      // 统一设置保存
      comSttingSave () {
        for (var i in this.niceList) {
          this.niceList[i].OutsRate = this.SettingDiscipline.OutsRate
          this.niceList[i].GoodRate = this.SettingDiscipline.GoodRate
          this.niceList[i].PassRate = this.SettingDiscipline.PassRate
          this.niceList[i].LowRate = this.SettingDiscipline.LowRate
        }
        this.xy.msgSuc('统一设置成功。')
        this.modal = false
      },
      // 保存
      async save () {
        var list = this.niceList.map(function (val) {
          return {
            SettingDisciplineID: val.SettingDisciplineID,
            DisciplineID: val.DisciplineID,
            DisciplineCode: val.DisciplineCode,
            OutsRate: val.OutsRate,
            GoodRate: val.GoodRate,
            PassRate: val.PassRate,
            LowRate: val.LowRate
          }
        })
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AchievementAnalyseSetting/Create`, {
          SettingBase: this.formData.SettingBase,
          SettingRanking: this.formData.SettingRanking,
          SettingDiscipline: list
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc(res.data)
        }
      },
      // 加载表格
      async getNiceList () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AchievementAnalyseSetting/GetAllSetting`)
        this.tableLoading = false
        this.formLoad = true
        if (res.success) {
          if (res.data) {
            if (res.data.Discipline && res.data.Discipline.length > 0) {
              this.niceList = res.data.Discipline
            } else {
              this.niceList = []
            }
            if (res.data.Base) {
              this.formData.SettingBase.ScoreSegment = res.data.Base.ScoreSegment
              this.formData.SettingBase.DistinctionFrontRate = res.data.Base.DistinctionFrontRate
              this.formData.SettingBase.DistinctionAfterRate = res.data.Base.DistinctionAfterRate
            }
            if (res.data.Ranking && res.data.Ranking.length > 0) {
              this.formData.SettingRanking[0].Front1 = res.data.Ranking[0].Front1
              this.formData.SettingRanking[0].Front2 = res.data.Ranking[0].Front2
              this.formData.SettingRanking[0].Front3 = res.data.Ranking[0].Front3
              this.formData.SettingRanking[0].Front4 = res.data.Ranking[0].Front4
              this.formData.SettingRanking[0].After1 = res.data.Ranking[0].After1
              this.formData.SettingRanking[0].RankingType = res.data.Ranking[0].RankingType
              this.formData.SettingRanking[1].Front1 = res.data.Ranking[1].Front1
              this.formData.SettingRanking[1].Front2 = res.data.Ranking[1].Front2
              this.formData.SettingRanking[1].Front3 = res.data.Ranking[1].Front3
              this.formData.SettingRanking[1].Front4 = res.data.Ranking[1].Front4
              this.formData.SettingRanking[1].After1 = res.data.Ranking[1].After1
              this.formData.SettingRanking[1].RankingType = res.data.Ranking[1].RankingType
            }
          }
        }
      }

    }
  }
</script>
<style lang="less" scoped>
.form-sty {
  display: flex;
  width: 100%;
  align-items: center;
  .inp2 {
    margin-left: 140px;
  }
  /deep/ .ivu-form-item-label {
    color: rgba(0, 0, 0, 0.45);
  }
}
.add {
  margin-top: 24px;
}
.box3 .box-bott {
  width: 100%;
}
.container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  padding-bottom: 56px;
}
.box1,
.box2,
.box3,
.box4,
.box5 {
  height: 137px;
  margin: 0 20px;
  background-color: #fff;
  border-radius: 4px;
  margin-top: 20px;
}
/* .box-bott {
  padding: 20px;
} */
.box1 > p,
.box2 > p,
.box3 > p,
.box4 > p,
.box5 .box5-tit > p {
  padding: 20px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  border-bottom: 1px solid rgba(233, 233, 233, 1);
  font-weight: bold;
}
.box-subor {
  color: rgba(0, 0, 0, 0.45);
  padding: 20px;
}
.input-num {
  margin: 0 12px;
  width: 180px;
}
.box2 .box-subor,
.box3 .box-subor {
  display: flex;
  justify-content: space-between;
}
.box4 {
  height: 199px;
}
.box4 .box-subor {
  height: calc(100% - 65px);
}
.box4 .box-subor .box-bott {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  height: 100%;
}
.box4 .box-subor .box-bott .box-inp {
  display: flex;
}
// .box4 .box-subor .box-bott .box-inp .inp2 {
//   margin-left: 10.4%;
// }
.box5 {
  height: 564px;
  /* overflow-x: hidden;
  overflow-y: scroll; */
  overflow: hidden;
}
.box5 .box5-tit {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box5 .box5-tit > p {
  border-bottom: none;
}
.box5 .box5-tit > p:nth-of-type(2) {
  font-size: 14px;
  color: #4196ff;
  cursor: pointer;
}
.box5 .box-tab {
  max-height: 500px;
  overflow: auto;
  width: calc(100% + 12px);
  padding: 0 20px 20px 20px;
}
.box6 {
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding: 5%; */
  left: 0px;
  position: fixed;
  bottom: 0;
  z-index: 999;
  width: 100%;
  padding-right: 5%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
}
/* .box6 button:nth-of-type(1) {
  margin-right: 20px;
} */
/*table*/
.ivu-table-fixed-header thead tr th {
  background: #fafafa;
}
.ivu-table-header thead tr th {
  background: #fafafa;
  height: 54px;
}
th .ivu-table-cell {
  font-weight: bold;
  color: rgba(0, 0, 0, 0.65);
}
.ivu-table-header th .ivu-table-cell {
  font-weight: bold;
  color: rgba(0, 0, 0, 0.65);
}
.ivu-table-header th .ivu-table-cell span {
  color: rgba(0, 0, 0, 0.65);
}

.from-ul {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  min-height: 200px;
  margin-bottom: 10%;
}
.ivu-modal-header {
  border-bottom: 1px solid rgba(232, 232, 232, 1);
}
.ivu-modal-footer {
  border-top: 1px solid rgba(232, 232, 232, 1);
}
</style>
