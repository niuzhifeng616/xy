<!-- 3.选择指标 -->
<template>
  <div class="xy-content-module">
    <div style="padding:10px 0 0 10px">
      <Checkbox v-model="allPick" @on-change="allPickChange">全选</Checkbox>
    </div>
    <div class="xy-content-body">
      <div class="odd" v-if="aloneList.length">
        <p>单次</p>
        <div class="mage-odd">
          <div
            class="odd-box xy-flex"
            v-for="(item, index) in aloneList"
            :key="item.AssessTargetID"
            @click="pickMore(item, 'aloneList', index)"
          >
            <div class="left">
              <div class="left-box" :style="{background: item.bg}">
                <i class="iconfont">&#xe717;</i>
              </div>
            </div>
            <div class="right">
              <p v-text="item.AssessTargetName"></p>
              <p v-text="item.AssessTargetDescribe"></p>
            </div>
            <div class="banner" :class="item.IsCkecked ? 'checked-banner' : ''">
              <i class="iconfont">&#xe6a1;</i>
            </div>
          </div>
        </div>
      </div>
      <div class="odd" v-if="moreList.length">
        <p>增量</p>
        <div class="mage-odd">
          <div
            class="odd-box xy-flex"
            v-for="(item, index) in moreList"
            :key="item.AssessTargetID"
            @click="pickMore(item, 'moreList', index)"
          >
            <div class="left">
              <div class="left-box" :style="{background: item.bg}">
                <i class="iconfont">&#xe717;</i>
              </div>
            </div>
            <div class="right">
              <p v-text="item.AssessTargetName"></p>
              <p v-text="item.AssessTargetDescribe"></p>
              <p @click.stop="toSettingBtn(item, index)" v-if="item.AssessTargetCode === 'SegmentInc' && !projectIsPublish">分段规则设置</p>
              <p @click.stop="toSettingBtn(item, index)" v-if="item.AssessTargetCode === 'SegmentInc' && projectIsPublish">分段规则查看</p>
              <!-- 方案已发布,不可编辑 -->
            </div>
            <div class="banner" :class="item.IsCkecked ? 'checked-banner' : ''">
              <i class="iconfont">&#xe6a1;</i>
            </div>
          </div>
        </div>
      </div>
      <div class="computed-res">
        <Button
          shape="circle"
          v-if="status!==2"
          class="xy-btn-primary"
          @click="countResult"
        >
          计算结果
        </Button>
      </div>
    </div>
    <Modal
      v-model="ruleSetting"
      :transfer="false"
      width="800"
      :mask-closable="false"
      :closable="false"
      title="分段规则设置（分段分：表示将学生成绩排名按年级百分比，划分多个区间段，每段赋予对应的分值。）"
    >
      <div slot="header">
        <p>分段规则{{projectIsPublish ? '查看' : '设置'}}
          <span class="col0-65 f14">（分段分：表示将学生成绩排名按年级百分比，划分多个区间段，每段赋予对应的分值。）</span>
        </p>
      </div>
      <div class="model-box">
        <div class="left">
          <p :class="settingSub ? '' : 'checked'" @click="unitySet">统一设置</p>
          <RadioGroup
            v-model="settingSub"
            class="radio-group"
            vertical
            @on-change="aloneSet"
          >
            <Radio
              :label="item.SubjectName"
              v-for="item in subList"
              :key="item.SubjectID"
            >
              <span v-text="item.SubjectName"></span>
              <span class="rady-setting" v-if="item.IsSetFufen">已设置</span>
            </Radio>
          </RadioGroup>
        </div>
        <div class="right">
          <p class="col0-85" v-text="settingSub || '统一设置'"></p>
          <div
            class="box-comp col0-65"
            v-for="(item, index) in computedList"
            :key="index"
          >
            <div class="input-start ">
              <InputNumber
                :max="100"
                :precision="0"
                :min="index ? 1 : 0"
                @on-change="changeValue1(item.PreInterval,index)"
                v-model="item.PreInterval"
                :disabled="!index || projectIsPublish"
              ></InputNumber> %
            </div>
            <span class="line"></span>
            <!-- :min="index ? item.PreInterval + 1 : 1" -->
            <div class="input-end">
              <InputNumber
                :max="100"
                :precision="0"
                :min="1"
                @on-change="changeValue2(item.NextInterval,index)"
                v-model="item.NextInterval"
                :disabled="index === computedList.length - 1 || projectIsPublish"
              ></InputNumber> %
            </div>
            <div class="input-end">
              <span class="ff-title">赋分</span>
              <InputNumber
                :max="100"
                :min="0"
                :formatter="value=>parseInt(value)"
                v-model="item.Score"
                :disabled="projectIsPublish"
              ></InputNumber>
            </div>
            <div class="but-group" v-if="status !== 2">
              <i class="iconfont" v-if="index === computedList.length - 2">
                <span @click="add(index)">&#xe69f;</span>
              </i>
              <i class="iconfont" v-if="index < computedList.length - 1 && index">
                <span @click="subtraction(index)">&#xe69e;</span>
              </i>
            </div>
          </div>
          <p class="col0-45" style="font-weight:normal">说明：X% - Y%表示大于X%，小于等于Y%。</p>
        </div>
      </div>
      <div slot="footer"  v-if="status !== 2">
        <Checkbox
          class="fl"
          style="line-height: 36px;"
          v-model="continueScore"
        >
          继续赋分
        </Checkbox>
        <Button class="xy-modal-close" @click="cancelSave">取消</Button>
        <Button
          class="xy-modal-primary"
          shape="circle"
          @click="saveScore"
        >
          保存
        </Button>
      </div>
      <div slot="footer" v-else>
          <Button class="xy-modal-primary" shape="circle" @click="cancelSave">关闭</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'Content',
    data () {
      return {
        subList: [],
        aloneList: [],
        moreList: [],
        allPick: false, // 全选
        computedList: [],
        settingSub: '', // 继续赋分
        ruleSetting: false,
        continueScore: false,
        setAllRule: false, // 是否已经给全部学科设置了规则
        isClickBtn: false, // 是否通过“打开的弹框”，true时关闭时始终不需选中
        webUrl: '',
        loading: false,
        // 方案ID
        TeachingProjectID: this.$route.query.teachingProjectID * 1,
        projectIsPublish: this.$store.state.common.menuInfo.status * 1 === 2,
        quotaData: [],
        singleData: [],
        increaseData: [],
        allCheck: false,
        checkAllGroup: false,
        dataList: [],
        isChecked: false,
        status: this.$route.query.status * 1,
        loadModal: false,
        copyMore: [],
        subjectId: 0,
        setObject: null,
        AssessTargetID: 0,
        FFID: 0
      }
    },
    created () {
      // 获取指标
      this.getQuota()
      // 是否已全部设置 “分段规则设置”
      this.getIsSetting()
    },
    methods: {
      async getIsSetting () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/TeachingAssessProjectTargetFufen/IsSetting`, {
          assessProjectID: this.TeachingProjectID
        })
        if (res.success) {
          this.setAllRule = res.data
          if (this.moreList.length && !this.setAllRule) {
            this.moreList[this.moreList.length - 1].IsCkecked = false
            this.allPick = false
          }
        }
      },
      pickMore (item, name, index) {
        if (this.status === 2) return
        if (name === 'moreList' && !this.copyMore[index].IsCkecked && index === this.copyMore.length - 1 && !this.moreList[index].IsCkecked && !this.setAllRule) {
          this.toSetting(this.copyMore[index], index)
        }
        item.IsCkecked = !item.IsCkecked
        // console.log(item)
        // console.log(this[name])
        let status = true
        let names = ['aloneList', 'moreList']
        for (let vv of names) {
          for (let item of this[vv]) {
            if (!item.IsCkecked) {
              status = false
              break
            }
          }
        }
        this.allPick = status
      },
      aloneSet (val) {
        for (let item of this.subList) {
          if (item.SubjectName === val) {
            this.subjectId = item.SubjectID
            this.FFID = item.AssessProjectTargetFFID
            this.computedList = []
            this.featchSubById()
            break
          }
        }
      },
      // 获取指定学科赋分的详情
      async featchSubById () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/TeachingAssessProjectTargetFufen/Get/${this.FFID}`, null)
        if (res.success) {
          if (res.data) {
            this.setObject = res.data
            if (res.data.Details && res.data.Details.length) {
              this.computedList = res.data.Details
            }
          } else {
            this.computedList = [
              {
                NextInterval: null,
                PreInterval: 0,
                Score: null,
                AssessProjectTargetFFDetailID: 0
              },
              {
                NextInterval: 100,
                PreInterval: null,
                Score: null,
                AssessProjectTargetFFDetailID: 0
              }
            ]
          }
        }
      },
      // 全选
      allPickChange (val) {
        if (this.aloneList.length) {
          for (let item of this.aloneList) {
            item.IsCkecked = val
          }
        }
        if (this.moreList.length) {
          for (let i in this.moreList) {
            // SegmentInc 分段分增量
            if (this.moreList[i].AssessTargetCode === 'SegmentInc' && !this.moreList[i].IsCkecked && !this.copyMore[i].IsCkecked && !this.setAllRule) {
              return this.toSetting(this.moreList[i], i)
            }
            this.moreList[i].IsCkecked = val
          }
        }
      },
      // 第一个文本框设置值改变时联动改变前面一个
      changeValue1 (val, index) {
        // console.log(val, index)
        if (!index) return
        this.computedList[index - 1].NextInterval = val
      // console.log(this.computedList)
      },
      // 第二个文本框设置值改变时联动改变后面一个
      changeValue2 (val, index) {
        // console.log(val, index)
        if (index === this.computedList.length - 1) return
        this.computedList[index + 1].PreInterval = val
      // console.log(this.computedList)
      },
      // 统一设置
      unitySet () {
        this.settingSub = ''
        this.subjectId = 0
        this.FFID = 0
        this.computedList = []
        this.featchSubById()
      },
      // 加
      add (index) {
        if (this.projectIsPublish) return false
        if (!this.computedList[index].NextInterval) {
          return this.xy.msgError(`请填写百分比。`)
        }
        if (this.computedList[index].PreInterval >= this.computedList[index].NextInterval) {
          return this.xy.msgError(`请填写百分比。`)
        }
        if (this.computedList[index].Score === null) {
          return this.xy.msgError(`请填写赋分。`)
        }
        this.computedList.splice(index + 1, 0, {
          PreInterval: this.computedList[index].NextInterval,
          NextInterval: null,
          Score: null,
          AssessProjectTargetFFDetailID: 0
        })
      },
      // 减
      subtraction (index) {
        if (this.projectIsPublish) return false
        this.computedList[index + 1].PreInterval = this.computedList[index - 1].NextInterval
        this.computedList.splice(index, 1)
      },
      // 取消保存赋分
      cancelSave () {
        this.isClickBtn = false// 重置状态
        this.ruleSetting = false
        // 重置选中学科信息
        this.setObject = null
        this.FFID = 0
        this.subjectId = 0

        this.getIsSetting()
      },
      // 保存赋分 设置赋分（subject=0为统一设置）
      async saveScore () {
        for (let i = 0; i < this.computedList.length; i++) {
          if (i > 0) {
            if (this.computedList[i].PreInterval >= this.computedList[i].NextInterval) {
              this.xy.msgError(`请正确填写百分比。`)
              return false
            } else if (this.computedList[i].PreInterval !== this.computedList[i - 1].NextInterval) {
              this.xy.msgError(`请正确填写百分比。`)
              return false
            }
          } else {
            if (!this.computedList[i].NextInterval) {
              return this.xy.msgError(`请填写百分比。`)
            }
          }
          if (this.computedList[i].Score === null) {
            return this.xy.msgError(`请填写赋分。`)
          } else {
            this.computedList[i].Score = parseInt(this.computedList[i].Score)
          }
        }
        this.xy.loading()
        if (this.setObject) {
        // var ffId = this.setObject.AssessProjectTargetFFID
        }
        const params = {
          AssessProjectTargetFFID: this.FFID, // ffId,
          AssessProjectID: this.TeachingProjectID,
          AssessTargetID: this.AssessTargetID,
          SubjectID: this.subjectId,
          Details: this.computedList
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/TeachingAssessProjectTargetFufen/Setting`, params, true)
        if (res.success) {
          this.computedList = []
          this.xy.msgSuc(res.msg || '保存成功。')
          if (!this.isClickBtn) {
            this.moreList[this.moreList.length - 1].IsCkecked = true
          }
          // 是否继续赋分
          if (this.continueScore) {
            // 成功后刷新右侧赋分列表
            this.featchSuject('continue')

            this.ruleSetting = true
          } else {
            // 重置选中学科信息
            this.setObject = null
            this.FFID = 0
            this.subjectId = 0
            this.ruleSetting = false
          }
          this.getIsSetting()
        } else {
          this.xy.msgError(res.msg || '保存失败。')
          // 重置选中学科信息
          this.setObject = null
          this.FFID = 0
          this.subjectId = 0
        }
        this.isClickBtn = false// 重置状态
        this.xy.unloading()
      },
      toSetting (val, index) {
        this.continueScore = false
        this.settingSub = ''
        this.AssessTargetID = val.AssessTargetID
        if (this.copyMore[index].IsCkecked || this.setAllRule) {
          this.featchSuject()
          this.featchSubById()
          this.ruleSetting = true
        } else {
          this.$Modal.confirm({
            title: '温馨提示',
            okText: '确定，去设置',
            content: '您还未完成课程的分段规则设置，请您先设置。',
            onOk: () => {
              setTimeout(() => {
                this.featchSuject()
                this.featchSubById()
                this.ruleSetting = true
              }, 200)
            },
            onCancel: () => {
              this.moreList[this.moreList.length - 1].IsCkecked = false
              this.allPick = false
            }
          })
        }
      },
      toSettingBtn (val, index) {
        this.isClickBtn = true
        this.continueScore = false
        this.settingSub = ''
        this.AssessTargetID = val.AssessTargetID
        // 打开弹框
        this.featchSuject()
        this.featchSubById()
        this.ruleSetting = true
      },
      // 获取学科（带有是否设置赋分的标记）
      async featchSuject (type) {
        const params = {
          assessProjectID: this.TeachingProjectID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/TeachingAssessBase/GetSubjects`, params)
        if (res.success) {
          if (res.data && res.data.length) {
            this.subList = res.data
            // 未选中继续赋分时，默认选中第一个学科
            if (type !== 'continue') {
              this.settingSub = this.subList[0].SubjectName
              this.subjectId = this.subList[0].SubjectID
              this.FFID = this.subList[0].AssessProjectTargetFFID
              this.computedList = []
              this.featchSubById()
            }

            if (type === 'continue' && this.settingSub !== '') { // 刷新数据（type === 'continue'继续赋分， this.settingSub !== ''非统一设置）
              let subjectInfo = this.subList.filter((value) => { if (value.SubjectID === this.subjectId) return value })
              this.FFID = subjectInfo[0].AssessProjectTargetFFID
              if (this.FFID !== 0) {
                this.featchSubById()
              }
            }
            if (this.settingSub === '') {
              this.computedList = [
                {
                  NextInterval: null,
                  PreInterval: 0,
                  Score: null,
                  AssessProjectTargetFFDetailID: 0
                },
                {
                  NextInterval: 100,
                  PreInterval: null,
                  Score: null,
                  AssessProjectTargetFFDetailID: 0
                }
              ]
            }
          }
        }
      },
      // 获取指标
      async getQuota () {
        let color = ['#FFBF00', '#5BD171', '#2C92F6', '#5BD171', '#2C92F6', '#4C5A4F']
        this.xy.loading()
        const params = {
          assessProjectID: this.TeachingProjectID,
          isAll: true
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/TeachingAssessBase/GetTargets`, params)
        if (res.success) {
          let SingleArr = []
          let IncrementArr = []
          if (res.data && res.data.Single && res.data.Single.length) {
            this.aloneList = res.data.Single.map((vv, i) => {
              vv.bg = color[i]
              return vv
            })
            SingleArr = res.data.Single.map((value) => {
              return value.IsCkecked
            })
          }
          if (res.data && res.data.Increment && res.data.Increment.length) {
            this.moreList = res.data.Increment.map((vv, i) => {
              vv.bg = color[i + 3]
              return vv
            })
            this.copyMore = JSON.parse(JSON.stringify(res.data.Increment))
            IncrementArr = res.data.Increment.map((value) => {
              return value.IsCkecked
            })
          }
          let SingleIncrementArr = SingleArr.concat(IncrementArr)
          if (SingleIncrementArr.indexOf(false) === -1) {
            this.allPick = true
          } else {
            this.allPick = false
          }
        }
        this.xy.unloading()
      },
      // 计算结果
      async countResult () {
        let alone = this.aloneList.filter(val => val.IsCkecked).map(val => { return val.AssessTargetID })
        let more = this.moreList.filter(val => val.IsCkecked).map(val => { return val.AssessTargetID })
        if (alone.length === 0 && more.length === 0) {
          this.xy.msgError('请选择计算指标。')
          return false
        }
        this.xy.loading()
        const params = {
          AssessProjectID: this.TeachingProjectID,
          TargetIDs: [...alone, ...more]
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AssessTarget/CalculationTarget`, params, true)
        if (res.success) {
          this.xy.msgSuc(res.msg || '计算结果完成。')
          let lens = res.data.result.SetpuStep + 1
          let dtList = this.$store.state.evaluate.topHeader
          for (let i = 0; i < lens; i++) {
            dtList[i].isLoad = 1
          };
          this.$store.commit('evaluate/changetopHeader', dtList)
          this.$store.commit('common/getParam', Object.assign(this.$route.query, {
            steps: res.data.result.SetpuStep - 1
          }))
          this.$router.push({ name: 'Control', query: this.$store.state.common.menuInfo })
        } else {
          this.xy.msgError(res.msg || '计算结果失败。')
        }
        this.xy.unloading()
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-module {
  /deep/ .ivu-modal-body {
    padding: 0;
  }
  .model-box {
    display: flex;
    max-height: 600px;
    overflow-y: auto;
    .left {
      padding: 20px 0;
      width: 230px;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      > p {
        padding: 0 10px 10px 20px;
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
        width: 40px;
        height: 18px;
        line-height: 18px;
        margin-left: 13px;
        padding: 0 2px;
        border-radius: 2px;
        font-size: 12px;
      }
      .radio-group {
        padding-left: 20px;
        min-height: 300px;
        max-height: 360px;
        width: 100%;
        overflow-y: auto;
        > label {
          height: 40px;
          line-height: 40px;
        }
      }
    }
    .right {
      padding: 20px;
      > p {
        padding: 0 10px 20px 0;
        font-weight: bold;
      }
      .box-comp {
        padding-bottom: 20px;
        display: flex;
        align-items: center;
        .input-start {
          margin-right: 10px;
        }
        .input-end {
          margin-left: 10px;
          .ff-title {
            margin: 0 10px;
          }
        }
        .line {
          display: inline-block;
          width: 20px;
          height: 2px;
          border-top: 1px solid rgba(38, 38, 38, 0.25);
        }
      }
      .but-group {
        display: flex;
        justify-content: space-around;
        align-items: center;
        > i {
          cursor: pointer;
          font-size: 20px;
          color: #999;
          margin: 0 0 0 10px;
        }
        > i:hover {
          color: #4196ff;
        }
      }
    }
  }
  .xy-content-body {
    .odd {
      > p {
        font-weight: 700;
        font-size: 16px;
        padding: 15px 0;
      }
      .mage-odd {
        display: flex;
        flex-flow: row wrap;
        .odd-box:hover {
          border: 1px solid #4196ff;
          cursor: pointer;
        }
        .odd-box {
          margin-right: 20px;
          margin-bottom: 20px;
          position: relative;
          width: 340px;
          height: 140px;
          border: 1px solid #e9e9e9;
          .left {
            // width: 120px;
            padding: 19px 15px 0 11px;
            display: flex;
            justify-content: center;
            .left-box {
              width: 48px;
              height: 48px;
              // background: #ffbf00;
              border-radius: 24px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
              i {
                font-size: 18px;
                margin-left: 5px;
              }
            }
          }
          .right {
            padding-right: 25px;
            > p:nth-of-type(1) {
              padding: 20px 0 18px;
              font-size: 14px;
              color: rgba(0, 0, 0, 0.85);
              font-weight: 700;
            }
            > p:nth-of-type(2) {
              font-size: 14px;
              color: rgba(0, 0, 0, 0.45);
            }
            > p:nth-of-type(3) {
              font-size: 14px;
              color: #4196ff;
              width: 90px;
            }
          }
          .banner {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 0;
            height: 0;
            border-right: 28px solid #eeeeee;
            border-bottom: 28px solid #eeeeee;
            border-top: 28px solid transparent;
            border-left: 28px solid transparent;
            > i {
              color: #fff;
            }
          }
          .checked-banner {
            border-right: 28px solid #4196ff;
            border-bottom: 28px solid #4196ff;
          }
        }
      }
    }
    .computed-res {
      padding-top: 70px;
      text-align: center;
    }
  }
}
</style>
