<template>
  <div>
        <Drawer title="设置条件"
          :mask-closable="true"
          width="560"
          :transfer="false"
          :closable="false"
          v-model="isShow"
          :styles="styles"
          @on-close=close
          v-cloak>
        <div>
          <Alert show-icon v-if="type!==1">只能输入正整数，如输入小数会自动去掉小数，保留整数。</Alert>
          <Form :label-width="80">
            <FormItem label="请假人数" v-if="type===3">
                <Select v-model="pep" :style="{width:pep==6?'':'49%'}" placeholder="请选择">
                    <Option v-cloak v-for="item in pepData" :key="item.Type" :value="item.Type">
                      {{item.Name}}
                    </Option>
                </Select>
                <InputNumber :formatter="value=>parseInt(value)" v-model="pepNum" style="width:49%;" v-if="pep!=6" :min="1" />
                <div v-if="pep===6" style="margin-top:10px;">
                    <InputNumber :formatter="value=>parseInt(value)" v-model="lowerPep" style="width:100px;" :min="1" />
                    <Select v-model="lowerPepType" style="width:80px;">
                        <Option v-cloak v-for="item in lowerPepData" :key="item.Type" :value="item.Type">
                          {{item.Name}}
                        </Option>
                    </Select>
                    <span>人数</span>
                    <Select v-model="uperPepType" style="width:80px;">
                        <Option v-cloak v-for="item in uperPepData" :key="item.Type" :value="item.Type">
                          {{item.Name}}
                        </Option>
                    </Select>
                    <InputNumber :formatter="value=>parseInt(value)" v-model="uperPep" style="width:100px;" :min="1" />
                </div>
            </FormItem>
            <FormItem label="请假时长" v-if="type===0||type===3">
                <Select v-model="duration" :style="{width:duration==6?'':'49%'}" placeholder="请选择">
                    <Option v-cloak v-for="item in durationData" :key="item.Type" :value="item.Type">
                      {{item.Name}}
                    </Option>
                </Select>
                <InputNumber :formatter="value=>parseInt(value)" v-model="durationNum" style="width:49%;" v-if="duration!=6" :min="1" />
                <div v-if="duration==6" style="margin-top:10px;">
                    <InputNumber :formatter="value=>parseInt(value)" v-model="lowerNum" style="width:100px;" :min="1" />
                    <Select v-model="lowerTimeType" style="width:80px;">
                        <Option v-cloak v-for="item in lowerTimeData" :key="item.Type" :value="item.Type">
                          {{item.Name}}
                        </Option>
                    </Select>
                    <span>时长（天）</span>
                    <Select v-model="uperTimeType" style="width:80px;">
                        <Option v-cloak v-for="item in uperTimeData" :key="item.Type" :value="item.Type">
                          {{item.Name}}
                        </Option>
                    </Select>
                    <InputNumber :formatter="value=>parseInt(value)" v-model="uperNum" style="width:100px;" :min="0" />
                </div>
            </FormItem>
            <FormItem label="秘密等级" v-if="type===1">
              <Select v-model="mm" placeholder="请选择">
                <Option v-cloak v-for="item in mmList" :key="item.ID" :value="item.ID+'?'+item.Name">
                  {{item.Name}}
                </Option>
              </Select>
            </FormItem>
          </Form>
        </div>
        <div class="work-flow-drawer">
          <Button class="xy-btn-primary" shape="circle" @click="addConditionBtn">保存</Button>
          <Button class="xy-btn-close"  @click="close">取消</Button>
        </div>
    </Drawer>
  </div>
</template>
<script>
  export default {
    name: 'DrawerCondition',
    props: {
      workflowList: Object,
      type: Number
    },
    data () {
      return {
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        pep: null, // 请假人数类型
        pepNum: null,
        pepData: [
          {
            Type: 1,
            Name: '小于'
          },
          {
            Type: 2,
            Name: '小于等于'
          },
          {
            Type: 3,
            Name: '大于'
          },
          {
            Type: 4,
            Name: '大于等于'
          },
          {
            Type: 5,
            Name: '等于'
          },
          {
            Type: 6,
            Name: '介于(两个数之间)'
          }
        ], // 时长类型
        // 介于两者之间
        lowerPep: null,
        uperPep: null,
        lowerPepType: '<',
        uperPepType: '<',
        lowerPepData: [{ Type: '<', Name: '<' }, { Type: '<=', Name: '<=' }],
        uperPepData: [{ Type: '<', Name: '<' }, { Type: '<=', Name: '<=' }],
        duration: null, // 时长类型
        durationNum: null,
        durationData: [
          {
            Type: 1,
            Name: '小于'
          },
          {
            Type: 2,
            Name: '小于等于'
          },
          {
            Type: 3,
            Name: '大于'
          },
          {
            Type: 4,
            Name: '大于等于'
          },
          {
            Type: 5,
            Name: '等于'
          },
          {
            Type: 6,
            Name: '介于(两个数之间)'
          }
        ], // 时长类型
        // 介于两者之间
        lowerNum: null,
        uperNum: null,
        lowerTimeType: '<',
        uperTimeType: '<',
        lowerTimeData: [{ Type: '<', Name: '<' }, { Type: '<=', Name: '<=' }],
        uperTimeData: [{ Type: '<', Name: '<' }, { Type: '<=', Name: '<=' }],
        mm: null,
        mmList: []
      }
    },
    computed: {
      isShow: {
        get () {
          return this.$store.state.common.conditionModal
        },
        set (newValue) {
          return newValue
        }
      }
    },
    watch: {
      isShow (newVal) {
        if (newVal) {
          this.clickCondition(this.$store.state.common.conditionOption)
        } else {
          this.$store.commit('common/getCondition', {})
        }
      },
      type: {
        handler (val) {
          if (val === 1) {
            this.getSecretLevel()
          }
        },
        // deep: true,
        immediate: true
      }
    },
    methods: {
      formatterFunc (val) {
        console.log(val)
      },
      getSecretLevel () {
        this.xy.loading()
        this.xy.get(`${this.xyApi}/oa/api/OfficialDocSecretLevel/GetAll`).then(res => {
          if (res.success) {
            this.mmList = res.data
          }
          this.xy.unloading()
        })
      },
      close () {
        this.$store.commit('common/changeConditionModal', false)
      },
      clickCondition (val) {
        this.duration = null// 时长类型
        this.durationNum = null
        this.lowerNum = null
        this.uperNum = null
        this.lowerTimeType = '<'
        this.uperTimeType = '<'
        this.pep = null
        this.pepNum = null
        this.lowerPep = null
        this.uperPep = null
        this.lowerPepType = '<'
        this.uperPepType = '<'
        this.recursion = val.WorkFlowNodeID
        // ConditionCode = 1请假时长，2请假人数
        // LowerBoundEqual大于等于
        // UpperBoundNotEqual小于
        // LowerBoundNotEqual大于
        // UpperBoundEqual小于等于
        // BoundEqual等于
        // FormulaType = 1介于两者之间
        if (val.WorkFlowConditions.length > 0) {
          for (let i = 0; i < val.WorkFlowConditions.length; i++) {
            // 请假时长
            if (val.WorkFlowConditions[i].ConditionCode === 1) {
              if (val.WorkFlowConditions[i].FormulaType === 0) {
                if (val.WorkFlowConditions[i].LowerBoundEqual > 0) { // 大于等于
                  this.duration = 4
                  this.durationNum = val.WorkFlowConditions[i].LowerBoundEqual
                };
                if (val.WorkFlowConditions[i].UpperBoundNotEqual > 0) { // 小于
                  this.duration = 1
                  this.durationNum = val.WorkFlowConditions[i].UpperBoundNotEqual
                };
                if (val.WorkFlowConditions[i].LowerBoundNotEqual > 0) { // 大于
                  this.duration = 3
                  this.durationNum = val.WorkFlowConditions[i].LowerBoundNotEqual
                };
                if (val.WorkFlowConditions[i].UpperBoundEqual > 0) { // 小于等于
                  this.duration = 2
                  this.durationNum = val.WorkFlowConditions[i].UpperBoundEqual
                };
                if (val.WorkFlowConditions[i].BoundEqual > 0) { // 等于
                  this.duration = 5
                  this.durationNum = val.WorkFlowConditions[i].BoundEqual
                };
              } else {
                this.duration = 6
                this.durationNum = null
                if (val.WorkFlowConditions[i].LowerBoundEqual > 0) { // 大于等于
                  this.lowerTimeType = '<='
                  this.lowerNum = val.WorkFlowConditions[i].LowerBoundEqual
                };
                if (val.WorkFlowConditions[i].UpperBoundNotEqual > 0) { // 小于
                  this.uperTimeType = '<'
                  this.uperNum = val.WorkFlowConditions[i].UpperBoundNotEqual
                };
                if (val.WorkFlowConditions[i].LowerBoundNotEqual > 0) { // 大于
                  this.lowerTimeType = '<'
                  this.lowerNum = val.WorkFlowConditions[i].LowerBoundNotEqual
                };
                if (val.WorkFlowConditions[i].UpperBoundEqual > 0) { // 小于等于
                  this.uperTimeType = '<='
                  this.uperNum = val.WorkFlowConditions[i].UpperBoundEqual
                };
              }
            }
            // 请假人数
            if (val.WorkFlowConditions[i].ConditionCode === 2) {
              if (val.WorkFlowConditions[i].FormulaType === 0) {
                if (val.WorkFlowConditions[i].LowerBoundEqual > 0) { // 大于等于
                  this.pep = 4
                  this.pepNum = val.WorkFlowConditions[i].LowerBoundEqual
                };
                if (val.WorkFlowConditions[i].UpperBoundNotEqual > 0) { // 小于
                  this.pep = 1
                  this.pepNum = val.WorkFlowConditions[i].UpperBoundNotEqual
                };
                if (val.WorkFlowConditions[i].LowerBoundNotEqual > 0) { // 大于
                  this.pep = 3
                  this.pepNum = val.WorkFlowConditions[i].LowerBoundNotEqual
                };
                if (val.WorkFlowConditions[i].UpperBoundEqual > 0) { // 小于等于
                  this.pep = 2
                  this.pepNum = val.WorkFlowConditions[i].UpperBoundEqual
                };
                if (val.WorkFlowConditions[i].BoundEqual > 0) { // 等于
                  this.pep = 5
                  this.pepNum = val.WorkFlowConditions[i].BoundEqual
                };
              } else {
                this.pep = 6
                this.pepNum = null
                if (val.WorkFlowConditions[i].LowerBoundEqual > 0) { // 大于等于
                  this.lowerPepType = '<='
                  this.lowerPep = val.WorkFlowConditions[i].LowerBoundEqual
                };
                if (val.WorkFlowConditions[i].UpperBoundNotEqual > 0) { // 小于
                  this.uperPepType = '<'
                  this.uperPep = val.WorkFlowConditions[i].UpperBoundNotEqual
                };
                if (val.WorkFlowConditions[i].LowerBoundNotEqual > 0) { // 大于
                  this.lowerPepType = '<'
                  this.lowerPep = val.WorkFlowConditions[i].LowerBoundNotEqual
                };
                if (val.WorkFlowConditions[i].UpperBoundEqual > 0) { // 小于等于
                  this.uperPepType = '<='
                  this.uperPep = val.WorkFlowConditions[i].UpperBoundEqual
                };
              }
            }
            // 公文审批
            if (val.WorkFlowConditions[i].ConditionCode === 4) {
              this.mmList.map(item => {
                if (val.WorkFlowConditions[i].IncludeValue[0] === item.ID) {
                  this.mm = val.WorkFlowConditions[i].IncludeValue[0] + '?' + item.Name // 公文审批秘密等级
                }
              })
            }
          }
        }
        this.branchModal = true
      },
      // 保存条件
      addConditionBtn () {
        if (this.type !== 1) {
          if (this.pep === null && this.duration === null) {
            this.xy.msgError('最少添加一种条件。')
          } else {
            if (this.pep !== '' || this.duration !== '') {
              if (this.pep > 0 && this.pep < 6) {
                if (this.pepNum === '' || this.pepNum === null) {
                  this.xy.msgError('请假人数不能为空。')
                  return false
                }
              }
              if (this.pep === 6) {
                console.log(this.uperPepType)
                if (this.lowerPep === '' || this.uperPep === '' || this.lowerPep === null || this.uperPep === null) {
                  this.xy.msgError('请假人数不能为空。')
                  return false
                }
                if (this.lowerPepType === '' || this.uperPepType === '') {
                  this.xy.msgError('请假人数范围不能为空。')
                  return false
                }
              }
              if (this.duration > 0 && this.duration < 6) {
                if (this.durationNum === '' || this.durationNum === null) {
                  this.xy.msgError('请假时间不能为空。')
                  return false
                }
              }
              if (this.duration === 6) {
                if (this.lowerNum === '' || this.uperNum === '' || this.lowerNum === null || this.uperNum === null) {
                  this.xy.msgError('请假时间不能为空。')
                  return false
                }
                if (this.lowerTimeType === '' || this.uperTimeType === '') {
                  this.xy.msgError('请假时间范围不能为空。')
                  return false
                }
              }
              this.branchRecursion(this.workflowList.WorkFlowNodeModels)
            } else {
              this.xy.msgError('最少添加一种条件。')
            }
          }
        } else {
          if (this.mm) {
            this.branchRecursion(this.workflowList.WorkFlowNodeModels)
          } else {
            this.xy.msgError('请选择秘密等级。')
          }
        }
      },
      // 递归后插入选中的条件值
      branchRecursion (list) {
        // ConditionCode = 1请假时长，2请假人数
        // LowerBoundEqual大于等于
        // UpperBoundNotEqual小于
        // LowerBoundNotEqual大于
        // UpperBoundEqual小于等于
        // BoundEqual等于
        // FormulaType = 1介于两者之间
        let pep1 = ''; let pep2 = ''; let pep3 = ''; let pep3s = ''; let time1 = ''; let time2 = ''; let time3 = ''; let time3s = ''
        if (list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].NodeType === 3) {
              if (list[i].WorkFlowNodeModels.length > 0) {
                for (var j = 0; j < list[i].WorkFlowNodeModels.length; j++) {
                  if (this.recursion === list[i].WorkFlowNodeModels[j].WorkFlowNodeID) {
                    list[i].WorkFlowNodeModels[j].WorkFlowConditions = []
                    if (this.type !== 1) {
                      if (this.pep !== '' && this.pep !== null) { // 请假人数已选
                        if (this.pep === 6) {
                          switch (this.lowerPepType) {
                            case '<=':
                              pep1 = parseInt(this.lowerPep) + '<='
                              break
                            case '<':
                              pep1 = parseInt(this.lowerPep) + '<'
                              break
                          }
                          switch (this.uperPepType) {
                            case '<=':
                              pep2 = '<=' + parseInt(this.uperPep)
                              break
                            case '<':
                              pep2 = '<' + parseInt(this.uperPep)
                              break
                          }
                          list[i].WorkFlowNodeModels[j].WorkFlowNodeName = pep1 + '请假人数' + pep2 + '；'
                          list[i].WorkFlowNodeModels[j].WorkFlowConditions.push({
                            ConditionCode: 2, // 请假人数
                            ConditionType: 0,
                            ConditionFormula: pep1 + 'StudentNumber&&StudentNumber' + pep2,
                            LowerBoundEqual: this.lowerPepType === '<=' ? parseInt(this.lowerPep) : 0, // 大于等于
                            UpperBoundNotEqual: this.uperPepType === '<' ? parseInt(this.uperPep) : 0, // 小于
                            LowerBoundNotEqual: this.lowerPepType === '<' ? parseInt(this.lowerPep) : 0, // 大于
                            UpperBoundEqual: this.uperPepType === '<=' ? parseInt(this.uperPep) : 0, // 小于等于
                            BoundEqual: 0, // 等于
                            FormulaType: 1 // 介于两者之前
                          })
                        } else {
                          if (this.pep >= 1 && this.pep <= 5) {
                            switch (this.pep) {
                              case 1:
                                pep3 = '<' + parseInt(this.pepNum)
                                pep3s = '<' + parseInt(this.pepNum)
                                break
                              case 2:
                                pep3 = '<=' + parseInt(this.pepNum)
                                pep3s = '<=' + parseInt(this.pepNum)
                                break
                              case 3:
                                pep3 = '>' + parseInt(this.pepNum)
                                pep3s = '>' + parseInt(this.pepNum)
                                break
                              case 4:
                                pep3 = '>=' + parseInt(this.pepNum)
                                pep3s = '>=' + parseInt(this.pepNum)
                                break
                              case 5:
                                pep3 = '=' + parseInt(this.pepNum)
                                pep3s = '==' + parseInt(this.pepNum)
                                break
                            }
                            list[i].WorkFlowNodeModels[j].WorkFlowNodeName = '请假人数' + pep3 + '人；'
                            list[i].WorkFlowNodeModels[j].WorkFlowConditions.push({
                              ConditionCode: 2, // 请假人数
                              ConditionType: 0,
                              ConditionFormula: 'StudentNumber' + pep3s,
                              LowerBoundEqual: this.pep === 4 ? parseInt(this.pepNum) : 0, // 大于等于
                              UpperBoundNotEqual: this.pep === 1 ? parseInt(this.pepNum) : 0, // 小于
                              LowerBoundNotEqual: this.pep === 3 ? parseInt(this.pepNum) : 0, // 大于
                              UpperBoundEqual: this.pep === 2 ? parseInt(this.pepNum) : 0, // 小于等于
                              BoundEqual: this.pep === 5 ? parseInt(this.pepNum) : 0, // 等于
                              FormulaType: 0 // 介于两者之前
                            })
                          }
                        }
                      }
                      if (this.duration !== '') { // 请假时长已选
                        if (this.duration === 6) {
                          switch (this.lowerTimeType) {
                            case '<=':
                              time1 = parseInt(this.lowerNum) + '<='
                              break
                            case '<':
                              time1 = parseInt(this.lowerNum) + '<'
                              break
                          }
                          switch (this.uperTimeType) {
                            case '<=':
                              time2 = '<=' + parseInt(this.uperNum)
                              break
                            case '<':
                              time2 = '<' + parseInt(this.uperNum)
                              break
                          }
                          if (this.pep !== '' && this.pep !== null && this.pep !== undefined) {
                            list[i].WorkFlowNodeModels[j].WorkFlowNodeName += time1 + '请假时长' + time2 + '；'
                          } else {
                            list[i].WorkFlowNodeModels[j].WorkFlowNodeName = time1 + '请假时长' + time2 + '；'
                          }
                          list[i].WorkFlowNodeModels[j].WorkFlowConditions.push({
                            ConditionCode: 1, // 请假时长
                            ConditionType: 0,
                            ConditionFormula: time1 + 'LeaveTime&&LeaveTime' + time2,
                            LowerBoundEqual: this.lowerTimeType === '<=' ? parseInt(this.lowerNum) : 0, // 大于等于
                            UpperBoundNotEqual: this.uperTimeType === '<' ? parseInt(this.uperNum) : 0, // 小于
                            LowerBoundNotEqual: this.lowerTimeType === '<' ? parseInt(this.lowerNum) : 0, // 大于
                            UpperBoundEqual: this.uperTimeType === '<=' ? parseInt(this.uperNum) : 0, // 小于等于
                            BoundEqual: 0, // 等于
                            FormulaType: 1 // 介于两者之前
                          })
                        } else {
                          if (this.duration >= 1 && this.duration <= 5) {
                            switch (this.duration) {
                              case 1:
                                time3 = '<' + parseInt(this.durationNum)
                                time3s = '<' + parseInt(this.durationNum)
                                break
                              case 2:
                                time3 = '<=' + parseInt(this.durationNum)
                                time3s = '<=' + parseInt(this.durationNum)
                                break
                              case 3:
                                time3 = '>' + parseInt(this.durationNum)
                                time3s = '>' + parseInt(this.durationNum)
                                break
                              case 4:
                                time3 = '>=' + parseInt(this.durationNum)
                                time3s = '>=' + parseInt(this.durationNum)
                                break
                              case 5:
                                time3 = '=' + parseInt(this.durationNum)
                                time3s = '==' + parseInt(this.durationNum)
                                break
                            }
                            if (this.pep !== '' && this.pep !== null && this.pep !== undefined) {
                              list[i].WorkFlowNodeModels[j].WorkFlowNodeName += '请假时长' + time3 + '天'
                            } else {
                              list[i].WorkFlowNodeModels[j].WorkFlowNodeName = '请假时长' + time3 + '天'
                            }
                            list[i].WorkFlowNodeModels[j].WorkFlowConditions.push({
                              ConditionCode: 1, // 请假时长
                              ConditionType: 0,
                              ConditionFormula: 'LeaveTime' + time3s,
                              LowerBoundEqual: this.duration === 4 ? parseInt(this.durationNum) : 0, // 大于等于
                              UpperBoundNotEqual: this.duration === 1 ? parseInt(this.durationNum) : 0, // 小于
                              LowerBoundNotEqual: this.duration === 3 ? parseInt(this.durationNum) : 0, // 大于
                              UpperBoundEqual: this.duration === 2 ? parseInt(this.durationNum) : 0, // 小于等于
                              BoundEqual: this.duration === 5 ? parseInt(this.durationNum) : 0, // 等于
                              FormulaType: 0 // 介于两者之前
                            })
                          }
                        }
                      }
                    } else {
                      list[i].WorkFlowNodeModels[j].WorkFlowNodeName = '秘密等级：' + this.mm.split('?')[1]
                      list[i].WorkFlowNodeModels[j].WorkFlowConditions.push({
                        ConditionCode: 4, // 公文审批
                        ConditionType: 1, // 公文审批
                        IncludeValueStr: this.mm.split('?')[0]
                      })
                    }
                  } else {
                    this.branchRecursion(list[i].WorkFlowNodeModels[j].WorkFlowNodeModels)
                  }
                }
              }
            }
          }
        }
        this.close()
      },
      cancelConditionBtn () {}
    }
  }
</script>
