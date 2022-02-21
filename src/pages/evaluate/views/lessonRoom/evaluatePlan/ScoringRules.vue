<template>
  <div class="scoring-rules">
    <div class="xy-content-body" style="border-top:1px solid rgba(0,0,0,0.1);padding-top:0;">
      <div class="content">
        <div class="content-left">
          <h5>选择学科</h5>
          <div class="more-check">
            <Checkbox
              :indeterminate="indeterminate"
              :value="checkAll"
              @click.prevent.native="handleCheckAll">全选</Checkbox>
            <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                <Checkbox :label='item.DisciplineID'  v-for="(item,index) in leftData" :key="index">{{item.DisciplineName}}</Checkbox>
            </CheckboxGroup>
          </div>
        </div>
        <div class="content-right">
          <div class="level">
            <ul class="rule-ul">
              <li class="li-have" v-if="JSON.stringify(threelevel) !== '{}'">
                <div class="li-header">三级指标</div>
                <div class="li-body">
                  <p class="body-type">升级规则</p>
                  <RadioGroup vertical v-model="threelevel.ScoringRule" style=" width: 100%;">
                    <Radio :label="0" class="body-radio">
                      <span>累计求和，每项指标结果100%折算求和</span>
                    </Radio>
                    <Radio :label="1" class="body-radio">
                      <span>设置权重，同一指标层级权重合计100%</span>
                    </Radio>
                  </RadioGroup>
                </div>
                <div class="li-body">
                  <p class="body-type">打分方式</p>
                  <RadioGroup vertical  v-model="threelevel.ScoringMethod">
                        <Radio :label="1" class="body-radio">星级</Radio>
                        <Radio :label="0" class="body-radio">分值</Radio>
                  </RadioGroup >
                </div>
                <div class="li-body">
                  <p class="body-type">评价结果保存规则</p>
                  <RadioGroup vertical v-model="threelevel.SaveResultRule">
                    <Radio :label="0" class="body-radio">累计求和，每次评价保存结果均有效</Radio>
                    <Radio :label="1" class="body-radio">覆盖更新，只保存最后一次评价结果</Radio>
                  </RadioGroup >
                </div>
              </li>
              <li class="li-img" v-if="JSON.stringify(threelevel) !== '{}'"><img src="./imgs/sanjiao.png" alt=""></li>
              <li class="li-have" v-if="JSON.stringify(twolevel) !== '{}'">
                <div class="li-header">二级指标</div>
                <div class="li-body">
                  <p class="body-type">升级规则</p>
                  <RadioGroup vertical v-model="twolevel.ScoringRule" style=" width: 100%;">
                    <Radio :label="0" class="body-radio">
                      <span>累计求和，每项指标结果100%折算求和</span>
                    </Radio>
                    <Radio :label="1" class="body-radio">
                      <span>设置权重，同一指标层级权重合计100%</span>
                    </Radio>
                  </RadioGroup>
                </div>
                <div class="li-body" v-if="JSON.stringify(this.threelevel) === '{}'">
                  <p class="body-type">打分方式</p>
                  <RadioGroup vertical  v-model="twolevel.ScoringMethod">
                        <Radio :label="1" class="body-radio">星级</Radio>
                        <Radio :label="0" class="body-radio">分值</Radio>
                  </RadioGroup >
                </div>
                <div class="li-body" v-if="JSON.stringify(this.threelevel) === '{}'">
                  <p class="body-type">评价结果保存规则</p>
                  <RadioGroup vertical v-model="twolevel.SaveResultRule">
                    <Radio :label="0" class="body-radio">累计求和，每次评价保存结果均有效</Radio>
                    <Radio :label="1" class="body-radio">覆盖更新，只保存最后一次评价结果</Radio>
                  </RadioGroup >
                </div>
              </li>
              <li class="li-img" v-if="JSON.stringify(twolevel) !== '{}'"><img src="./imgs/sanjiao.png" alt=""></li>
              <li class="li-have" v-if="JSON.stringify(onelevel) !== '{}'">
                <div class="li-header">一级指标</div>
                <div class="li-body">
                  <p class="body-type">升级规则</p>
                  <RadioGroup vertical v-model="onelevel.ScoringRule" style=" width: 100%;">
                    <Radio :label="0" class="body-radio">
                      <span>累计求和，每项指标结果100%折算求和</span>
                    </Radio>
                    <Radio :label="1" class="body-radio">
                      <span>设置权重，同一指标层级权重合计100%</span>
                    </Radio>
                  </RadioGroup>
                </div>
              </li>
              <li class="li-img" v-if="!(JSON.stringify(onelevel) === '{}'&&JSON.stringify(twolevel) === '{}'&&JSON.stringify(threelevel) === '{}')">
                <img src="./imgs/sanjiao.png" alt="">
              </li>
              <li style="width:84px;font-weight:700;" v-if="!(JSON.stringify(onelevel) === '{}'&&JSON.stringify(twolevel) === '{}'&&JSON.stringify(threelevel) === '{}')">课堂评价总分</li>
            </ul>
            <div v-if="JSON.stringify(onelevel) === '{}'&&JSON.stringify(twolevel) === '{}'&&JSON.stringify(threelevel) === '{}'" class="nodata">
                暂无评分规则
            </div>
          </div>
        </div>
        <div class="fix-btn">
          <Button class="xy-btn-primary" shape="circle" :disabled="StepsHeader.rowObj.IsEnable==='1'" @click="save">保存</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ScoringRules',
    data () {
      return {
        StepsHeader: {}, // 方案信息
        indeterminate: false,
        checkAll: false,
        checkAllGroup: [],
        threelevel: {},
        twolevel: {},
        onelevel: {},
        leftData: [],
        checkId: ''

      }
    },
    created () {
      this.StepsHeader = this.$parent
      this.getProgrammeDiscipline()
    },
    methods: {
      // 获取学科
      getProgrammeDiscipline () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/ProgrammeSetting/GetProgrammeDiscipline`, {
          programmeID: this.$parent.rowObj.ProgrammeID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.leftData = res.data
            this.checkAllGroup = []
            this.leftData.map(item => {
              if (item.SetLevel) {
                this.checkAllGroup.push(item.DisciplineID)
              }
            })
            if (this.checkAllGroup.length === 0) {
              this.checkAll = false
              this.indeterminate = false
            } else {
              if (this.checkAllGroup.length === this.leftData.length) {
                this.checkAll = true
                this.indeterminate = false
              } else {
                this.checkAll = false
                this.indeterminate = true
              }
              this.getProgrammeIndex(this.checkAllGroup[0])
            }
          }
        })
      },
      // 获取学科指标规则列表
      getProgrammeIndex (id) {
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/ProgrammeSetting/GetProgrammeIndexRule`, {
          programmeID: this.$parent.rowObj.ProgrammeID,
          disciplineID: this.checkAllGroup// 多选显示第一个
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            this.onelevel = {}
            this.twolevel = {}
            this.threelevel = {}
            resData.forEach(item => {
              if (item.Level === 1) {
                this.onelevel = item
              } else if (item.Level === 2) {
                this.twolevel = item
              } else {
                this.threelevel = item
              }
            })
          }
        })
      },
      handleCheckAll () {
        if (this.indeterminate) {
          this.checkAll = false
        } else {
          this.checkAll = !this.checkAll
        }
        this.indeterminate = false

        if (this.checkAll) {
          this.leftData.forEach(item => {
            this.checkAllGroup.push(item.DisciplineID)
          })
          this.checkId = this.leftData[this.leftData.length - 1].DisciplineID
        } else {
          this.checkAllGroup = []
          this.checkId = ''
        }
        if (!this.checkId) {
          this.onelevel = {}
          this.twolevel = {}
          this.threelevel = {}
        } else {
          this.getProgrammeIndex(this.checkId)
        }
      },
      checkAllGroupChange (data) {
        this.checkId = ''
        if (data.length === this.leftData.length) {
          this.indeterminate = false
          this.checkAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.checkAll = false
        } else {
          this.indeterminate = false
          this.checkAll = false
        }
        this.checkId = data[data.length - 1]
        this.getProgrammeIndex(this.checkId)
      },
      save () {
        if (this.StepsHeader.rowObj.IsEnable === '1') {
          return false
        }
        let indexManagementIDs = []
        if (JSON.stringify(this.onelevel) !== '{}') {
          indexManagementIDs.push(this.onelevel)
        }
        if (JSON.stringify(this.twolevel) !== '{}') {
          indexManagementIDs.push(this.twolevel)
        }
        if (JSON.stringify(this.threelevel) !== '{}') {
          indexManagementIDs.push(this.threelevel)
        }

        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/ProgrammeSetting/UpdateProgrammeIndexRule`, {
          ProgrammeID: this.$parent.rowObj.ProgrammeID,
          DisciplineIDs: this.checkAllGroup,
          IndexManagementIDs: indexManagementIDs
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.getProgrammeDiscipline()
            this.$parent.getGeneralFlows()
          }
        })
      }
    }

  }
</script>
<style lang="less" scoped>
.scoring-rules{
 .content{
    display: flex;
    // border-top:1px solid rgba(0,0,0,0.1);
    .nodata{
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -25px;
      margin-top: -97px;
      color: #999;
    }
    .content-left{
      width: 10%;
      height: 637px;
      overflow-y:auto;
      padding: 23px 0 32px 0;
      border-right:1px solid rgba(0,0,0,0.1);
      h5{
        color:rgba(0,0,0,0.85);
        font-weight: 700;
        margin-left:33px;
        margin-bottom: 10px;
      }
      .more-check{
        padding-left:30px;
        /deep/ .ivu-checkbox-wrapper{
          display: flex;
          height: 40px;
          line-height: 40px;
        }
        /deep/ .ivu-checkbox{
          height: 46px;
          line-height: 46px;
          margin-right: 10px;
        }
      }
    }
    .content-right{
      position: relative;
      flex:1;
      width: 90%;
      height: 637px;
      //  overflow-y:auto;
      .level{
        .rule-ul{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin: 24px 0 0 24px;
          .li-img{
            width: 52px;
            text-align: center;
            img{
              transform:rotate(-90deg);
              height: 25px;
            }
          }
          .li-have{
            // width: 258px;
            flex: 1;
            height: 536px;
            background: #ffffff;
            border: 1px solid #e9e9e9;
            .li-header{
              // width: 256px;
              height: 54px;
              line-height: 54px;
              background: #fafafa;
              text-align: center;
              font-size: 14px;
              font-weight: bold;
              color: rgba(0,0,0,0.85);
            }
            .li-body{
              margin: 5px 24px;
              .body-type{
                margin-top: 24px;
                font-weight: bold;
                color: rgba(0,0,0,0.85);
              }
              .body-radio{
                margin-top: 20px;
                span{
                  font-weight: 400;
                  text-align: left;
                  color: rgba(0,0,0,0.65);
                  line-height: 20px;
                }
              }
            }
          }
        }
        .table{
            text-align: center;
            margin: 0 auto;
            border-collapse: collapse;
            font-size: 14px;
            width: 100%;
            font-weight: 700;
          thead th{
            background: #f8f8f8;
            width:12.5%;
            height: 50px;
            white-space: nowrap;
            overflow: hidden;
            box-sizing: border-box;
            text-align: center;
            text-overflow: ellipsis;
            vertical-align: middle;
            font-weight:bold;
            color:rgba(0,0,0,0.85);
          }
          tbody td{
            height: 100px;
            box-sizing: border-box;
            text-align: center;
            vertical-align: middle;
            border-bottom: 1px solid #eceef1;
            border-right: 1px solid #fff;
            position:relative;
            padding:1px;
            color:rgba(0,0,0,0.65);
            div{
              display: flex;
              align-items: center;
              flex-direction: column;
              span{
                margin-bottom: 10px;
              }
              img{
                width: 15px;
                height: 20px;
              }
            }
          }
         }
       }
    }
    .fix-btn {
      padding-right:43px;
      height: 56px;
      position: fixed;
      line-height: 56px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 1px 4px 0px rgba(163, 173, 186, 0.4);
      bottom: 0;
      left: 0;
      width: 100%;
      text-align: right;
      button {
        margin-right: 20px;
      }
    }
  }
}

</style>
