<template>
  <div>
    <div class="xy-content-module">
      <div class="xy-content-body">
        <div class="odd" v-if="aloneList.length">
          <p>单次</p>
          <div class="mage-odd">
            <div class="box" v-for="(item,index) in aloneList" :key="item.AssessTargetName">
              <div class="odd-box xy-flex xy-between">
                <div class="left">
                  <div class="left-box" :style="{background: item.bg}">
                    <i class="iconfont">&#xe717;</i>
                  </div>
                </div>
                <div class="right">
                  <p v-text="item.AssessTargetName"></p>
                  <div class="avg xy-flex xy-center">
                    <Form :model="aqz" :label-width="70">
                      <FormItem label="权重占比：" :label-for="'aqz' + index">
                        <InputNumber
                          :max="100"
                          :precision="0"
                          :min="1"
                          :disabled="status === 2 ? true : false"
                          v-model="item.Weight"
                          :element-id="'aqz' + index"
                        ></InputNumber>
                        <span>%</span>
                      </FormItem>
                    </Form>
                  </div>
                </div>
              </div>
              <div class="featch-score" @click="onpenFeatch(item)">
                <Button type="text">
                  <i class="iconfont">&#xe632;</i>
                  <span>赋分</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div class="odd" v-if="moreList.length">
          <p>增量</p>
          <div class="mage-odd">
            <div class="box" v-for="(item,index) in moreList" :key="item.AssessTargetName">
              <div class="odd-box xy-flex xy-between">
                <div class="left">
                  <div class="left-box" :style="{background: item.bg}">
                    <i class="iconfont">&#xe717;</i>
                  </div>
                </div>
                <div class="right">
                  <p v-text="item.AssessTargetName"></p>
                  <div class="avg xy-flex xy-center">
                    <Form :model="qz" :label-width="70">
                      <FormItem label="权重占比：" :label-for="'qz' + index">
                        <InputNumber
                          :max="100"
                          :element-id="'qz' + index"
                          :min="1"
                          :disabled="status === 2 ? true : false"
                          :precision="0"
                          v-model="item.Weight"
                        ></InputNumber>
                        <span>%</span>
                      </FormItem>
                      <!-- <p>权重占比：</p>
                      <InputNumber :max="100"
                                  :min="1"
                                  v-model="item.Weight"></InputNumber>
                      <span>%</span> -->
                    </Form>
                  </div>
                </div>
              </div>
              <div class="featch-score" @click="onpenFeatch(item)">
                <Button type="text">
                  <i class="iconfont">&#xe632;</i>
                  <span>赋分</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <p class="tip">提示:所有指标的权重占比之和必须为100%。</p>
        <div class="computed-res">
          <Button
            shape="circle"
            class="xy-primary"
            @click="countResult"
          >
            {{status === 2 ? '取消发布': '发布结果'}}
          </Button>
        </div>
      </div>
      <Modal
        v-model="ruleSetting"
        :transfer="false"
        width="800"
        :mask-closable="false"
        :closable="false"
        title="评价结果赋分（按百分比赋分）"
      >
        <div slot="header">
          <p>评价结果赋分
            <span class="col0-65 f14">（按百分比赋分）</span>
          </p>
        </div>
        <div class="model-box" >
          <div class="left">
            <p :class="settingSub ? '' : 'checked'"
               @click="unitySet">统一设置</p>
            <RadioGroup v-model="settingSub"
                        vertical
                        class="radio-group"
                        @on-change="pickSubject">
              <Radio
                :label="item.SubjectName"
                v-for="item in subjectList"
                :key="item.SubjectID"
              >
                <span v-text="item.SubjectName"></span>
                <span class="rady-setting" v-if="item.SupposedruleDetail && item.SupposedruleDetail.length">已设置</span>
              </Radio>
            </RadioGroup>
          </div>
          <div class="right">
            <p v-text="settingSub || '统一设置'"></p>
            <div class="box-comp" v-for="(item, index) in computedList" :key="index">
              <div class="input-start">
                <InputNumber
                  :max="100"
                  :precision="0"
                  :min="0"
                  @on-change="changeValue1(item.InitialValue,index)"
                  v-model="item.InitialValue"
                  :disabled="!index || status === 2 ? true : false"
                >
                </InputNumber> %
              </div>
              <span class="line"></span>
              <!-- :min="index ? item.InitialValue + 1 : 1" -->
              <div class="input-end">
                <InputNumber
                  :max="100"
                  :precision="0"
                  :min="0"
                  @on-change="changeValue2(item.CutOffValue,index)"
                  v-model="item.CutOffValue"
                  :disabled="index === computedList.length - 1 || status === 2 ? true : false"
                >
                </InputNumber> %
              </div>
              <div class="input-end ff">
                <InputNumber
                  :max="100"
                  :min="0"
                  :precision="0"
                  :disabled="status === 2 ? true : false"
                  v-model="item.SupposedResult"
                >
                </InputNumber> 赋分
              </div>
              <div class="but-group" v-if="status !== 2">
                <i class="iconfont">
                  <span v-if="index === computedList.length - 2 " @click="add(index)">&#xe69f;</span>
                </i>
                <i class="iconfont">
                  <span v-if="index < computedList.length - 1 && index" @click="subtraction(index)">&#xe69e;</span>
                </i>
              </div>
            </div>
            <p class="col0-45">说明：X% - Y%表示大于X%，小于等于Y% 。</p>
          </div>
        </div>
        <div slot="footer" v-if="status !== 2">
          <div class="continue">
            <Checkbox v-model="continueScore" class="fl" style="line-height: 36px;">继续赋分</Checkbox>
          </div>
          <Button class="xy-modal-close" @click="close">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="saveScore">确定</Button>
        </div>
        <div slot="footer" v-else>
          <Button class="xy-modal-primary" shape="circle" @click="close">关闭</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Speed',
    data () {
      return {
        aqz: {},
        qz: {},
        settingSub: '统一设置',
        computedList: [],
        ruleSetting: false,
        single: false,
        webUrl: '',
        loading: false,
        // 方案ID
        TeachingProjectID: this.$route.query.teachingProjectID * 1,
        quotaData: [],
        singleData: [],
        increaseData: [],
        allCheck: false,
        checkAllGroup: false,
        dataList: [],
        isChecked: false,
        status: this.$route.query.status * 1,
        loadModal: false,
        aloneList: [],
        moreList: [],
        continueScore: false,
        subjectList: [],
        pickValue: null,
        indexObject: null
      }
    },
    created () {
      this.getQuota()
    },
    methods: {
      // 关闭
      close () {
        this.ruleSetting = false
        this.computedList = []
      },
      pickSubject (val) {
        for (let item of this.subjectList) {
          if (val === item.SubjectName) {
            this.pickValue = item
            if (item.SupposedruleDetail && item.SupposedruleDetail.length > 1) {
              this.computedList = item.SupposedruleDetail
              break
            } else {
              this.computedList = [
                {
                  CutOffValue: null,
                  InitialValue: 0,
                  SupposedResult: null
                },
                {
                  CutOffValue: 100,
                  InitialValue: null,
                  SupposedResult: null
                }
              ]
              break
            }
          }
        }
      },
      async saveScore () {
        // console.log(this.pickValue.SubjectID)
        // console.log(this.computedList)
        for (let i in this.computedList) {
          if (this.computedList[i].InitialValue === null) {
            return this.xy.msgError(`请先填写第${i * 1 + 1}行第一个输入框里面的值。`)
          }
          if (!this.computedList[i].CutOffValue) {
            return this.xy.msgError(`请先填写第${i * 1 + 1}行第二个输入框里面的值。`)
          }
          if (!this.computedList[i].SupposedResult) {
            return this.xy.msgError(`请先填写第${i * 1 + 1}行“赋分”输入框里面的值。`)
          }
          if (this.computedList[i].InitialValue >= this.computedList[i].CutOffValue) {
            return this.xy.msgError(`第${i * 1 + 1}行第二个输入框里面的值,必须大于第一个输入框里面的值。`)
          }
        }
        this.xy.loading()
        const params = {
          AssessProjectID: this.TeachingProjectID,
          AssessTargetID: this.indexObject.AssessTargetID,
          SubjectID: this.settingSub ? [this.pickValue.SubjectID] : this.subjectList.map(val => val.SubjectID),
          SupposedruleDetail: this.computedList
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AssessTarget/CreateSupposedruleDetailByID`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.computedList = []
          this.xy.msgSuc(res.msg || '保存成功。')
          // 是否继续赋分
          if (this.continueScore) {
            // 成功后刷新右侧赋分列表
            this.featchSubject()
            // this.ruleSetting = true
            return
          }
          this.close()
        } else {
          this.xy.msgError(res.msg || '保存失败。')
        }
      },
      // 第一个文本框设置值改变时联动改变前面一个
      changeValue1 (val, index) {
        // console.log(val, index)
        if (!index) return
        this.computedList[index - 1].CutOffValue = val
      // console.log(this.computedList)
      },
      // 第二个文本框设置值改变时联动改变后面一个
      changeValue2 (val, index) {
        // console.log(val, index)
        if (index === this.computedList.length - 1) return
        this.computedList[index + 1].InitialValue = val
      // console.log(this.computedList)
      },
      // 统一设置
      unitySet () {
        this.settingSub = ''
        this.computedList = [
          {
            CutOffValue: null,
            InitialValue: 0,
            SupposedResult: null
          },
          {
            CutOffValue: 100,
            InitialValue: null,
            SupposedResult: null
          }
        ]
      },
      // 加
      add (index) {
        if (!this.computedList[index].CutOffValue) {
          return this.xy.msgError(`请先填写第${index + 1}行第二个输入框里面的值。`)
        } else if (!this.computedList[index].SupposedResult) {
          return this.xy.msgError(`请先填写第${index + 1}行“赋分”输入框里面的值。`)
        }
        if (this.computedList[index].InitialValue >= this.computedList[index].CutOffValue) {
          return this.xy.msgError(`第${index + 1}行第一个输入框里面的值，必须小于第二个输入框里面的值。`)
        }
        this.computedList.splice(index + 1, 0, {
          InitialValue: this.computedList[index].CutOffValue,
          CutOffValue: null,
          SupposedResult: null
        })
      },
      // 减
      subtraction (index) {
        this.computedList[index + 1].InitialValue = this.computedList[index - 1].CutOffValue
        this.computedList.splice(index, 1)
      },
      onpenFeatch (item) {
        // if (this.status === 2) return
        this.indexObject = item
        this.ruleSetting = true
        this.unitySet()
        this.featchSubject()
      },
      // 获取科目
      async featchSubject () {
        this.xy.loading()
        const params = {
          AssessProjectID: this.TeachingProjectID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AssessTarget/GetAllAssessSubject`, params)
        this.xy.unloading()
        if (res.success) {
          if (res.data && res.data.length) {
            if (!this.continueScore) {
              this.settingSub = res.data[0].SubjectName
              this.pickValue = res.data[0]
            }
            this.subjectList = res.data
            // this.featchStting([{
            //   SubjectID: 1,
            //   SubjectName: '数学'
            // }, {
            //   SubjectID: 3,
            //   SubjectName: '语文'
            // }, {
            //   SubjectID: 4,
            //   SubjectName: '外语'
            // }, {
            //   SubjectID: 7,
            //   SubjectName: '物理'
            // }])
            this.featchStting(res.data)
          }
        }
      },
      async featchStting (val) {
        this.xy.loading()
        const params = {
          AssessProjectID: this.TeachingProjectID,
          AssessTargetID: this.indexObject.AssessTargetID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AssessTarget/GetSupposedruleDetailByID`, params)
        this.xy.unloading()
        if (res.success) {
          if (res.data && res.data.length) {
            if (!this.continueScore) {
              this.computedList = res.data[0]
            }
            for (let vv in val) {
              for (let v in res.data) {
                if (val[vv].SubjectID === res.data[v].SubjectID) {
                  // this.subjectList[vv] = Object.assign(val[vv], res.data[v])
                  this.$set(this.subjectList, [vv], Object.assign(val[vv], res.data[v]))
                // console.log(this.subjectList)
                }
              }
            }
            // if (this.continueScore && this.settingSub) {
            this.pickSubject(this.settingSub)
            // }
          }
        // console.log(this.subjectList)
        }
      },
      // 获取方案下的赋分结果列表
      async getQuota () {
        let color = ['#FFBF00', '#5BD171', '#2C92F6', '#5BD171', '#2C92F6', '#4C5A4F']
        this.xy.loading()
        const params = {
          AssessProjectID: this.TeachingProjectID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AssessTarget/GetSupposedruleByID`, params)
        this.xy.unloading()
        if (res.success) {
          if (res.data && res.data.length) {
            this.aloneList = res.data.filter(val => val.AssessTargetType === 1).map((vv, i) => {
              vv.bg = color[i]
              vv.Weight = vv.Weight || null
              return vv
            })
            this.moreList = res.data.filter(val => val.AssessTargetType === 2).map((vv, i) => {
              vv.bg = color[i + 3]
              vv.Weight = vv.Weight || null
              return vv
            })
          }
        }
      },
      // 发布结果or取消发布
      async countResult () {
        let alone = this.aloneList
        let more = this.moreList
        let params = {}; let status = 0; let title = ''; let steps = 4
        if (this.status === 2) {
          params = {
            AssessProjectID: this.TeachingProjectID,
            ReleaseStutus: false
          }
          status = 1
          title = '取消发布'
        } else {
          let arr = [...alone, ...more]
          let count = 0
          if (!arr.length) {
            return this.xy.msgError('没有可操作项。')
          }
          for (let item of arr) {
            if (!item.Weight) {
              return this.xy.msgError(`请填写${item.AssessTargetName}的权重占比。`)
            }
            count = item.Weight + count
          }
          if (count !== 100) {
            return this.xy.msgError(`权重占比总和为100。`)
          }
          params = {
            AssessProjectID: this.TeachingProjectID,
            TargetWeightList: arr,
            ReleaseStutus: true
          }
          status = 2
          title = '发布'
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AssessTarget/AssessReleaseProject`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc(res.msg || title + '成功。')
          let lens = steps + 1
          let dtList = this.$store.state.evaluate.topHeader.map(val => { val.isLoad = 0; return val })
          for (let i = 0; i < lens; i++) {
            dtList[i].isLoad = 1
          };
          let pm = Object.assign(this.$route.query, {
            status: status,
            steps: lens
          })
          this.$store.commit('evaluate/changetopHeader', dtList)
          this.$store.commit('common/getParam', pm)
          this.$nextTick(() => {
            this.status = status
          })
          if (status === 2) {
            this.$router.push({ name: 'Result', query: this.$store.state.common.menuInfo })
          }
        } else {
          this.xy.msgError(res.msg || title + '失败。')
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-module {
  /deep/ .ivu-modal-body {
    padding: 0;
  }
  .radio-group{
    // padding-left: 20px;
    min-height: 300px;
    max-height: 360px;
    width: 100%;
    overflow-y: auto;
    > label{
      height: 40px;
      line-height: 40px;
    }
  }
  .model-box {
    display: flex;
    overflow-y: auto;
    max-height: 600px;
    .left {
      padding: 20px;
      width: 20%;
      padding-right: 0;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      > p {
        padding: 10px;
        padding-left: 0;
        font-weight: bold;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.45);
      }
      > p:hover {
        color: #4196ff;
      }
      .checked {
        color: #4196ff;
      }
      .rady-setting {
        display: inline-block;
        background: #3bd19f;
        color: #fff;
        height: 18px;
        line-height: 18px;
        margin-left: 6px;
        padding: 0 2px;
      }
    }
    .right {
      padding: 20px;
      > p {
        padding: 10px;
        padding-left: 0;
        font-weight: bold;
      }
      .box-comp {
        padding: 10px 0;
        display: flex;
        align-items: center;
        .input-start {
          margin-right: 10px;
        }
        .input-end {
          margin-left: 10px;
        }
        .line {
          display: inline-block;
          width: 20px;
          height: 2px;
          border-top: 1px solid rgba(38, 38, 38, 0.25);
        }
        .ff {
          margin-left: 20px;
        }
      }
      .but-group {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 60px;
        > i {
          cursor: pointer;
          width: 16px;
        }
        > i:hover {
          color: #4196ff;
        }
      }
    }
  }
  .continue {
    position: absolute;
    left: 15px;
  }
  .xy-content-body {
    position: relative;
    .odd {
      > p {
        padding: 20px;
        font-weight: bold;
        font-size: 16px;
        padding-left: 0;
        padding-top: 0;
      }
      .mage-odd {
        display: flex;
        flex-flow: row wrap;
        // .box:hover {
        //   border: 1px solid #4196ff;
        //   cursor: pointer;
        // }
        .box {
          .odd-box {
            border-radius: 2px 0 0 2px;
            margin-right: 20px;
            position: relative;
            width: 340px;
            height: 96px;
            border: 1px solid #e9e9e9;
            border-bottom: none;
            .left {
              display: flex;
              justify-content: center;
              // align-items: center;
              padding: 0 15px;
              padding-top: 15px;
              .left-box {
                width: 48px;
                height: 48px;
                // background: #ffbf00;
                border-radius: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
              }
            }
            .right {
              width: 80%;
              padding-right: 15px;
              display: flex;
              flex-flow: column;
              justify-content: center;
              > p:nth-of-type(1) {
                font-size: 16px;
                color: rgba(0, 0, 0, 85);
                font-weight: bold;
              }
              > p:nth-of-type(2) {
                font-size: 14px;
                color: rgba(0, 0, 0, 0.45);
              }
              .avg {
                /deep/ .ivu-form {
                  width: 100%;
                  .ivu-form-item-label {
                    padding-right: 0px;
                  }
                  .ivu-form-item-content {
                    > span {
                      display: inline-block;
                      margin-left: 8px;
                    }
                  }
                }
              }
            }
          }
          .featch-score {
            margin-bottom: 20px;
            border: 1px solid #e9e9e9;
            width: 340px;
            height: 48px;
            line-height: 48px;
            display: flex;
            justify-content: center;
            align-content: center;
            cursor: pointer;
            border-radius: 0 2px 2px 0;
            /deep/.ivu-btn {
              width: 100%;
              height: 100%;
              background: #f7f9fa;
              > span {
                > span {
                  display: inline-block;
                  margin-left: 6px;
                  color: rgba(0, 0, 0, 0.45);
                }
                > i {
                  color: #878889;
                }
              }
            }
            /deep/.ivu-btn:hover {
              background: #f7f9fa;
              > span {
                > i,
                span {
                  color: #4196ff;
                }
              }
            }
          }
        }
      }
    }
    .computed-res {
      bottom: 0;
      left: 0;
      right: 0;
      height: 56px;
      line-height: 56px;
      position: fixed;
      text-align: right;
      background: #ffffff;
      box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03);
    }
    .tip {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      padding: 20px 0;
    }
  }
}
</style>
