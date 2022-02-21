
<template>
  <div class="set-weight">
    <div class="xy-content-body" style="border-top:1px solid rgba(0,0,0,0.1);padding:0;margin-bottom: 46px;">
      <div class="content">
        <div class="content-left">
          <h5>选择学科</h5>
          <ul>
            <li v-for="(item,index) in leftData" :key="index" :class="activeId === item.DisciplineID?'active':''" @click="chooseLi(item,0)">
              {{item.DisciplineName}}
              <span class="over" v-if="item.SetWeight">已设置</span>
            </li>
          </ul>
        </div>
        <Form inline  class="content-right xy-flex" style="overflow-x: auto;">
          <div class="content-right xy-flex">
              <div class="index-level" style="border-right: 1px solid #F4F5F7;">
                <div class="index-level-title xy-flex xy-between xy-center">
                  <div><i class="iconfont">&#xe6f2;</i><span>一级指标</span></div>
                  <div v-if="level2List.length === 0">
                    <span v-if="isStart===1">
                      星级折算:
                      <InputNumber :precision=0  :min="1" v-model="starRating"></InputNumber>
                      分/星
                    </span>
                    <span class="num-set" @click="setNum">分值设定</span>
                  </div>
                </div>
                <div class="index-level-content" style="overflow-y: auto;">
                  <ul class="index-list">
                    <li v-for="(item,index) in level1List" :key="index" :class="activeId1 === item.IndexManagementID?'active':''"  @click="chooseLi(item,1,index)">
                      <div class="xy-flex xy-baseline">
                        <div class="index-point"></div>
                        <div style="flex: 1;" v-if="level2List.length>0">
                          <div class="xy-flex" style="width:300px;">
                            <!-- <Tooltip max-width="200" :content="item.IndexManagementName"> -->
                              <span class="index-name" :title="item.IndexManagementName">{{item.IndexManagementName}}</span>
                            <!-- </Tooltip> -->
                            <span class="over" v-if="item.Checked">已设置</span>
                            <span v-else class="none"></span>
                          </div>
                          <FormItem>
                            <InputNumber :min="0" :max="100" :disabled="!item.ScoringRule" v-model="item.Weight" placeholder="百分比"></InputNumber>
                          </FormItem>
                        </div>
                        <div style="flex: 1;" v-else>
                            <div class="xy-flex">
                              <div class="xy-flex" style="flex-direction: column;margin-right:10px;width: 300px;">
                                 <p style="color:rgba(0,0,0,0.45);margin-bottom:0">指标项</p>
                                 <p>{{item.IndexManagementName}}</p>
                              </div>
                              <!-- <span class="more"><Tooltip max-width="200" :content="item.IndexManagementName">
                              <p style="color:rgba(0,0,0,0.45);margin-bottom:0">指标项</p>
                              {{item.IndexManagementName}}
                            </Tooltip></span> -->
                            <div style="width:360px;">
                              <FormItem label="比例">
                                <InputNumber
                                    :min="0"
                                    :max="100"
                                    v-model="item.Weight" placeholder="百分比"></InputNumber>
                              </FormItem>
                              <template v-if="isStart===1">
                                  <FormItem label="最大值">
                                      <InputNumber  :precision=0 :max="5" :min="1" v-model="item.MaxValue"></InputNumber>
                                  </FormItem>
                                  <FormItem label="最小值">
                                      <InputNumber  :precision=0 :max="5" :min="0" v-model="item.MinValue"></InputNumber>
                                  </FormItem>
                                  <FormItem label="默认值">
                                      <InputNumber  :precision=0 :max="5" :min="1" v-model="item.DefaultValue"></InputNumber>
                                  </FormItem>
                                  <!-- <FormItem label="折算分/星" >
                                    <InputNumber  :precision=0  :min="1" v-model="item.ConversionValue"></InputNumber>
                                  </FormItem> -->
                                </template>
                                <template v-else>
                                  <FormItem label="最大值">
                                      <InputNumber  :precision=0 :min="1" v-model="item.MaxValue"></InputNumber>
                                  </FormItem>
                                  <FormItem label="最小值">
                                      <InputNumber  :precision=0 :min="0" v-model="item.MinValue"></InputNumber>
                                  </FormItem>
                                  <FormItem label="默认值">
                                      <InputNumber  :precision=0 :min="1" v-model="item.DefaultValue"></InputNumber>
                                  </FormItem>
                                </template>
                            </div>
                            </div>
                          </div>
                      </div>
                    </li>
                  </ul>
                  <div class="null-index" v-if="level1List.length===0"><i class="iconfont">&#xe6e7;</i><span>暂无指标</span></div>
                </div>
              </div>
              <div class="index-level" style="border-right: 1px solid #F4F5F7;">
                <div class="index-level-title xy-flex xy-between xy-center">
                    <div><i class="iconfont">&#xe6f2;</i><span>二级指标</span></div>
                    <div v-if="level3List.length === 0">
                      <span v-if="isStart===1">
                        星级折算:
                        <InputNumber :precision=0  :min="1" v-model="starRating"></InputNumber>
                        分/星
                      </span>
                      <span class="num-set" @click="setNum">分值设定</span>
                    </div>
                  </div>
                  <div class="index-level-content">
                    <ul class="index-list">
                    <template v-for="(item,index) in level2List" >
                      <li :key="index" :style="{height: item.myHeight!=='0px'?item.myHeight:'123px'}" class="active">
                      <!-- <li v-for="(item,index) in level2List" :key="index" :class="activeId2 === item.IndexManagementID?'active':''"  @click="chooseLi(item,2)"> -->
                        <div class="xy-flex xy-baseline">
                          <div class="index-point"></div>
                          <div style="flex: 1;" v-if="level3List.length>0">
                            <div class="xy-flex" style="width:300px;">
                              <!-- <Tooltip max-width="200" :content="item.IndexManagementName"> -->
                                <span class="index-name" :title="item.IndexManagementName">{{item.IndexManagementName}}</span>
                              <!-- </Tooltip> -->
                              <span class="over" v-if="item.Checked">已设置</span>
                              <span v-else class="none"></span>
                            </div>
                            <FormItem >
                              <InputNumber
                                  :min="0"
                                  :max="100"
                                  v-model="item.Weight" :disabled="!item.ScoringRule" placeholder="百分比"></InputNumber>
                            </FormItem>
                          </div>
                          <div style="flex: 1;" v-else>
                            <div class="xy-flex">
                              <div class="xy-flex" style="flex-direction: column;margin-right:10px;width: 300px;">
                                 <p style="color:rgba(0,0,0,0.45);margin-bottom:0">指标项</p>
                                 <p>{{item.IndexManagementName}}</p>
                              </div>
                              <!-- <span class="more"><Tooltip max-width="200" :content="item.IndexManagementName">
                              <p style="color:rgba(0,0,0,0.45);margin-bottom:0">指标项</p>{{item.IndexManagementName}}
                            </Tooltip></span> -->
                            <div style="width:360px;">
                                <FormItem label="比例">
                                    <InputNumber
                                    :min="0"
                                    :max="100"
                                    v-model="item.Weight" placeholder="百分比"></InputNumber>
                                </FormItem>
                                <template v-if="isStart===1">
                                  <FormItem label="最大值">
                                      <InputNumber  :precision=0 :max="5" :min="1" v-model="item.MaxValue"></InputNumber>
                                  </FormItem>
                                  <FormItem label="最小值">
                                      <InputNumber  :precision=0 :max="5" :min="0" v-model="item.MinValue"></InputNumber>
                                  </FormItem>
                                  <FormItem label="默认值">
                                      <InputNumber  :precision=0 :max="5" :min="1" v-model="item.DefaultValue"></InputNumber>
                                  </FormItem>
                                  <!-- <FormItem label="折算分/星" >
                                    <InputNumber  :precision=0  :min="1" v-model="item.ConversionValue"></InputNumber>
                                  </FormItem> -->
                                </template>
                                <template v-else>
                                  <FormItem label="最大值">
                                      <InputNumber  :precision=0 :min="1" v-model="item.MaxValue"></InputNumber>
                                  </FormItem>
                                  <FormItem label="最小值">
                                      <InputNumber  :precision=0 :min="0" v-model="item.MinValue"></InputNumber>
                                  </FormItem>
                                  <FormItem label="默认值">
                                      <InputNumber  :precision=0 :min="1" v-model="item.DefaultValue"></InputNumber>
                                  </FormItem>
                                </template>
                            </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </template>
                    </ul>
                    <div class="null-index" v-if="level2List.length===0"><i class="iconfont">&#xe6e7;</i><span>暂无指标</span></div>
                </div>
              </div>
              <div class="index-level">
                <div class="index-level-title xy-flex xy-between xy-center">
                    <div><i class="iconfont">&#xe6f2;</i><span>三级指标</span></div>
                    <div v-if='level3List.length>0'>
                      <span v-if="isStart===1">
                        星级折算:
                        <InputNumber :precision=0  :min="1" v-model="starRating"></InputNumber>
                        分/星
                      </span>
                      <span class="num-set" @click="setNum">分值设定</span>
                    </div>
                  </div>
                  <div class="index-level-content" >
                    <ul class="index-list" >
                      <li v-for="(item,index) in level3List" :key="index" @click.stop="chooseLi(item,3)" style="height:123px;">
                          <div class="xy-flex xy-baseline">
                            <div style="flex: 1;">
                              <div class="xy-flex xy-between">
                                <div class="xy-flex" style="flex-direction: column;margin-right:10px;width:300px;">
                                 <p style="color:rgba(0,0,0,0.45);margin-bottom:0">指标项</p>
                                 <p :title="item.IndexManagementName" style="height:60px;  overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp:3;-webkit-box-orient: vertical;">{{item.IndexManagementName}}</p>
                                </div>
                                <!-- <span class="more"><Tooltip max-width="200" :content="item.IndexManagementName">
                                  <p style="color:rgba(0,0,0,0.45);margin-bottom:0">指标项</p>{{item.IndexManagementName}}
                                </Tooltip></span> -->
                                <div style="width:360px;">
                                  <FormItem label="比例">
                                    <InputNumber
                                      :min="0"
                                      :max="100"
                                      v-model="item.Weight" placeholder="百分比"
                                      >
                                    </InputNumber>
                                  </FormItem>
                                  <template v-if="isStart===1">
                                    <FormItem label="最大值">
                                        <InputNumber  :precision=0 :max="5" :min="1" v-model="item.MaxValue"></InputNumber>
                                    </FormItem>
                                    <FormItem label="最小值">
                                        <InputNumber  :precision=0 :max="5" :min="0" v-model="item.MinValue"></InputNumber>
                                    </FormItem>
                                    <FormItem label="默认值">
                                        <InputNumber  :precision=0 :max="5" :min="1" v-model="item.DefaultValue"></InputNumber>
                                    </FormItem>
                                    <!-- <FormItem label="折算分/星" >
                                      <InputNumber  :precision=0  :min="1" v-model="item.ConversionValue"></InputNumber>
                                    </FormItem> -->
                                  </template>
                                  <template v-else>
                                    <FormItem label="最大值">
                                        <InputNumber  :precision=0 :min="1" v-model="item.MaxValue"></InputNumber>
                                    </FormItem>
                                    <FormItem label="最小值">
                                        <InputNumber  :precision=0 :min="0" v-model="item.MinValue"></InputNumber>
                                    </FormItem>
                                    <FormItem label="默认值">
                                        <InputNumber  :precision=0 :min="1" v-model="item.DefaultValue"></InputNumber>
                                    </FormItem>
                                  </template>
                                </div>
                              </div>
                            </div>
                          </div>
                      </li>
                    </ul>
                    <div class="null-index" v-if="level3List.length===0"><i class="iconfont">&#xe6e7;</i><span>暂无指标</span></div>
                </div>
              </div>
          </div>
        </Form>
        <div class="fix-btn">
          <Button class="xy-btn-primary" shape="circle" :disabled="StepsHeader.rowObj.IsEnable==='1'" @click="save">保存</Button>
        </div>
      </div>
    </div>
    <Modal
      v-model="setNumModel"
      title="分值设置"
      :transfer="false"
      :mask-closable="false"
      @on-visible-change="watchClose"
      >
      <Form ref="formValidate" :model="formValidate" :rules="isStart===0?ruleValidate:ruleValidate1" @submit.native.prevent :label-width="80">
        <template v-if="isStart===0">
          <FormItem label="最大值"  prop="big">
              <InputNumber :min="1"  v-model="formValidate.big" style="width:50%;"></InputNumber> 分
          </FormItem>
          <FormItem label="最小值" prop="small">
              <InputNumber  :min="0" v-model="formValidate.small" style="width:50%;"></InputNumber> 分
          </FormItem>
          <FormItem label="默认分值"  prop="default">
              <InputNumber  :min="1" v-model="formValidate.default" style="width:50%;"></InputNumber> 分
          </FormItem>
        </template>
        <template v-else>
          <FormItem label="最大值"  prop="big">
              <Select v-model="formValidate.big" style="width:200px">
                <Option v-for="item in List1" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select> <Rate v-model="Rate" :count="Rate" :custom-icon="'iconfont icon-Starunselectedbeifen'"/>
          </FormItem>
          <FormItem label="最小值" prop="small">
            <Select v-model="formValidate.small" style="width:200px">
                <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select> <Rate v-model="Rate" :count="Rate" :custom-icon="'iconfont icon-Starunselectedbeifen'"/>
          </FormItem>
          <FormItem label="默认分值"  prop="default">
              <Select v-model="formValidate.default" style="width:200px">
                <Option v-for="item in List1" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select> <Rate v-model="Rate" :count="Rate" :custom-icon="'iconfont icon-Starunselectedbeifen'"/>
          </FormItem>
          <!-- <FormItem label="星级折算"  prop="conversion">
              <InputNumber :min="1" v-model="formValidate.conversion" style="width:50%;"></InputNumber> 分 / <img src="./imgs/star.svg" alt="">
          </FormItem> -->
        </template>
      </Form>
      <div slot="footer">
        <Button class="xy-modal-close" @click="cancel">取消</Button>
        <Button class="xy-modal-primary" @click="ok" shape="circle">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'SetWeight',
    data () {
      return {
        starRating: 1, // 星级折算
        isStart: 1,
        StepsHeader: {},
        List: [
          { value: 0, label: '0' },
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
          { value: 4, label: '4' },
          { value: 5, label: '5' }
        ],
        List1: [
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
          { value: 4, label: '4' },
          { value: 5, label: '5' }
        ],
        Rate: 1,
        ruleValidate: {
          big: [
            { type: 'number', required: true, message: '请填写最大值', trigger: 'change' }
          ],
          small: [
            { type: 'number', required: true, message: '请填写最小值', trigger: 'change' }
          ],
          default: [
            { type: 'number', required: true, message: '请填写默认分值', trigger: 'change' }
          ]
        },
        ruleValidate1: {
          big: [
            { type: 'number', required: true, message: '请填写最大值', trigger: 'change' }
          ],
          small: [
            { type: 'number', required: true, message: '请填写最小值', trigger: 'change' }
          ],
          default: [
            { type: 'number', required: true, message: '请填写默认分值', trigger: 'change' }
          ],
          conversion: [
            { type: 'number', required: true, message: '请填写星级折算', trigger: 'change' }
          ]
        },
        formValidate: {
          big: 0,
          small: 0,
          default: 0,
          conversion: 0
        },
        setNumModel: false,
        currentItem: 0, // 第一条(针对第一列)
        currentIndex: '',
        flag: true,
        flags: true,
        superItem: '', // 上级数据
        leftData: [],
        level1List: [],
        level2List: [],
        level3List: [],
        activeId: '',
        activeId1: '',
        activeId2: '',
        activeId3: ''
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
            if (this.activeId === '') {
              this.activeId = this.leftData[0].DisciplineID
            }
            this.getProgrammeWeight()
          }
        })
      },
      // 获取设置
      getProgrammeWeight () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/ProgrammeSetting/GetProgrammeWeight`, {
          programmeID: this.$parent.rowObj.ProgrammeID,
          disciplineID: this.activeId
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            // console.log('返回的所有指标', res.data)
            this.level3List = []
            this.isStart = res.data.ScoringMethod
            this.level1List = res.data.WeightData
            if (this.level1List.length > 0) {
              this.activeId1 = this.level1List[0].IndexManagementID
              this.starRating = this.level1List[0].ConversionValue
              if (this.level1List[0].Childrens && this.level1List[0].Childrens.length > 0) {
                this.level2List = this.level1List[0].Childrens.concat([])
                this.activeId2 = this.level1List[0].Childrens[0].IndexManagementID
                this.starRating = this.level1List[0].Childrens[0].ConversionValue
                if (this.level2List[0].Childrens && this.level2List[0].Childrens.length > 0) {
                  // this.level3List = this.level2List[0].Childrens.concat([])
                  this.activeId3 = this.level1List[0].Childrens[0].Childrens[0].IndexManagementID
                  this.starRating = this.level1List[0].Childrens[0].Childrens[0].ConversionValue
                } else {
                  this.level3List = []
                  this.activeId3 = ''
                }
              } else {
                this.level2List = []
                this.activeId2 = ''
                this.level3List = []
                this.activeId3 = ''
              }
            } else {
              this.activeId1 = ''
              this.level2List = []
              this.activeId2 = ''
              this.level3List = []
              this.activeId3 = ''
            }
            // 找出当前展示二级的所有三级指标 设置二级指标高度
            this.level2List.forEach(item => {
              if (item.Childrens) {
                item.myHeight = (item.Childrens.length * 123) + 'px'
                item.Childrens.forEach(item1 => {
                  this.level3List.push(item1)
                })
              }
            })
          }
        })
      },
      setNum () {
        if (!this.setNumModel) { this.$refs.formValidate.resetFields() }
        if (this.isStart === 0) {
          this.formValidate.big = 10
          this.formValidate.default = 10
        }
        if (this.isStart === 1) {
          this.formValidate.big = 1
          this.formValidate.default = 1
          this.formValidate.conversion = 1
        }
        this.setNumModel = true
      },
      ok () {
        this.$refs.formValidate.validate(valid => {
          if (valid) {
            if (this.level3List.length !== 0) {
              this.level3List.forEach(item => {
                item.MaxValue = this.formValidate.big
                item.MinValue = this.formValidate.small
                item.DefaultValue = this.formValidate.default
                item.ConversionValue = this.formValidate.conversion
              })
            } else {
              if (this.level2List.length !== 0) {
                this.level2List.forEach(item => {
                  item.MaxValue = this.formValidate.big
                  item.MinValue = this.formValidate.small
                  item.DefaultValue = this.formValidate.default
                  item.ConversionValue = this.formValidate.conversion
                })
              } else {
                if (this.level1List.length !== 0) {
                  this.level1List.forEach(item => {
                    item.MaxValue = this.formValidate.big
                    item.MinValue = this.formValidate.small
                    item.DefaultValue = this.formValidate.default
                    item.ConversionValue = this.formValidate.conversion
                  })
                }
              }
            }
            this.setNumModel = false
          }
        })
      },
      cancel () {
        this.setNumModel = false
        this.$refs.formValidate.resetFields()
      },
      watchClose (val) {
        if (!val) { this.$refs.formValidate.resetFields() }
      },
      // 第二级的验证
      secondLevel () {
        if (this.level3List.length > 0) {
          this.flags = this.level1List[this.currentItem].Childrens.map(item => {
            if (item.complete && item.Weight !== '' && item.Weight !== null && item.Weight !== undefined) {
              return true
            } else {
              return false
            }
          }).indexOf(false)
          if (this.flags === -1) {
            this.flags = true
          } else {
            this.flags = false
          }
        } else {
          // 只有第二级 需要去判断下一级
          this.flags = true
          this.level1List[this.currentItem].Childrens.map(item => {
            Object.keys(item).map((item1) => {
              if (item[item1] === null || item[item1] === '') {
                this.flags = false
              }
            })
          })
        }
        this.$set(this.level1List[this.currentItem], 'complete', this.flags)
      },
      // 数值改变
      inputNumChge (val) {
        if (val === 2) {
          // this.secondLevel()
          let second = this.secondValidation()
          let index = this.level1List.map(item => { return item.IndexManagementID }).indexOf(this.activeId1)
          this.$set(this.level1List[index], 'complete', second)
        } else if (val === 3) {
          // 找上级数据
          // this.superItem = this.findId(this.level1List)
          let three = this.threeValidation()
          let index = this.level2List.map(item => { return item.IndexManagementID }).indexOf(this.activeId2)
          this.$set(this.level2List[index], 'complete', three)
        }
      },
      secondValidation () { // 二级验证是否有数据
        let flag = true
        if (this.level3List.length > 0) {
          let index1 = this.level2List.map(item => { return item.IndexManagementID }).indexOf(this.activeId2)
          if (this.level2List[index1].Weight === null) {
            flag = false
            return false
          }
        } else {
          if (this.isStart === 0) { // 不是星级
            this.level2List.forEach(item => {
              if (item.Weight === null || item.MaxValue === null || item.MinValue === null || item.DefaultValue === null) {
                flag = false
                return false
              }
            })
          } else { // 星级
            this.level2List.forEach(item => {
              if (item.Weight === null || item.MaxValue === null || item.MinValue === null || item.DefaultValue === null || item.ConversionValue === null) {
                flag = false
                return false
              }
            })
          }
        }
        return flag
      },
      threeValidation () { // 三级验证是否有数据
        let flag = true
        if (this.isStart === 0) { // 不是星级
          this.level3List.forEach(item => {
            if (item.Weight === null || item.MaxValue === null || item.MinValue === null || item.DefaultValue === null) {
              flag = false
              return false
            }
          })
        } else { // 星级
          this.level3List.forEach(item => {
            if (item.Weight === null || item.MaxValue === null || item.MinValue === null || item.DefaultValue === null || item.ConversionValue === null) {
              flag = false
              return false
            }
          })
        }
        return flag
      },
      // 递归 找父级(如果只有一级不管)
      findId (data) {
        if (data[this.currentItem].Childrens.length > 0) {
          for (let i = 0; i < data[this.currentItem].Childrens.length; i++) {
            if (data[this.currentItem].Childrens[i].IndexManagementID === this.activeId2) {
              return data[this.currentItem].Childrens[i]
            }
          }
        }
      },
      // 选择指标
      chooseLi (item, val, index) {
        if (val === 0) {
          // 获取接口重新渲染 然后执行created里的方法
          this.activeId = item.DisciplineID
          this.getProgrammeWeight()
        } else if (val === 1) {
          if (index !== undefined) {
            this.currentItem = index
          }
          this.activeId1 = item.IndexManagementID
          if (item.Childrens && item.Childrens.length > 0) {
            this.level2List = item.Childrens.concat([])
            this.activeId2 = this.level2List[0].IndexManagementID
            if (this.level2List[0].Childrens && this.level2List[0].Childrens.length > 0) {
              // this.level3List = this.level2List[0].Childrens.concat([])
              // this.activeId3 = this.level3List[0].IndexManagementID
              this.activeId3 = this.level2List[0].Childrens[0].IndexManagementID
            } else {
              this.level3List = []
              this.activeId3 = ''
            }
          } else {
            this.level2List = []
            this.activeId2 = ''
            this.level3List = []
            this.activeId3 = ''
          }
          // 找出当前展示二级的所有三级指标 设置二级指标高度
          this.level3List = []
          this.level2List.forEach(item => {
            if (item.Childrens) {
              item.myHeight = (item.Childrens.length * 123) + 'px'
              item.Childrens.forEach(item1 => {
                this.level3List.push(item1)
              })
            }
          })
        } else if (val === 2) {
          this.activeId2 = item.IndexManagementID
          if (item.Childrens && item.Childrens.length > 0) {
            this.level3List = item.Childrens.concat([])
            this.activeId3 = item.Childrens[0].IndexManagementID
          } else {
            this.level3List = []
            this.activeId3 = ''
          }
        } else if (val === 3) {
          this.activeId3 = item.IndexManagementID
        }
      },
      // 保存
      save () {
        if (this.StepsHeader.rowObj.IsEnable === '1') {
          return false
        }
        let indexManagementIDs = []
        if (this.level1List.length) {
          for (let n = 0, len2 = this.level1List.length; n < len2; n++) {
            indexManagementIDs.push({
              IndexManagementID: this.level1List[n].IndexManagementID,
              Weight: this.level1List[n].Weight,
              MaxValue: this.level1List[n].MaxValue,
              MinValue: this.level1List[n].MinValue,
              DefaultValue: this.level1List[n].DefaultValue,
              // ConversionValue: this.level1List[n].ConversionValue
              ConversionValue: this.starRating
            })
          }
        }
        if (this.level2List.length) {
          for (let m = 0, len1 = this.level2List.length; m < len1; m++) {
            indexManagementIDs.push({
              IndexManagementID: this.level2List[m].IndexManagementID,
              Weight: this.level2List[m].Weight,
              MaxValue: this.level2List[m].MaxValue,
              MinValue: this.level2List[m].MinValue,
              DefaultValue: this.level2List[m].DefaultValue,
              // ConversionValue: this.level2List[m].ConversionValue
              ConversionValue: this.starRating
            })
          }
        }
        if (this.level3List.length) {
          for (let i = 0, len = this.level3List.length; i < len; i++) {
            indexManagementIDs.push({
              IndexManagementID: this.level3List[i].IndexManagementID,
              Weight: this.level3List[i].Weight,
              MaxValue: this.level3List[i].MaxValue,
              MinValue: this.level3List[i].MinValue,
              DefaultValue: this.level3List[i].DefaultValue,
              // ConversionValue: this.level3List[i].ConversionValue
              ConversionValue: this.starRating
            })
          }
        }
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/ProgrammeSetting/UpdateProgrammeWeight`, {
          ProgrammeID: this.$parent.rowObj.ProgrammeID,
          DisciplineID: this.activeId,
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
.set-weight{
  .num-set{
    float:right;
    margin-right:5px;
    cursor: pointer;
  }
   .xy-baseline{
     align-items: baseline;
   }
    span.over{
      min-width:60px;
      height:20px;
      line-height: 20px;
      background: rgba(82,196,26,1);
      border-radius: 4px;
      color:#fff;
      padding:1px 9px;
    }
    span.none{
      min-width:60px;
      height:20px;
      line-height: 20px;
      border-radius: 4px;
      color:#fff;
      padding:1px 9px;
    }
    .content{
      display: flex;
      // border-top:1px solid rgba(0,0,0,0.1);
      .content-left{
        min-width: 200px;
        height: 637px;
        overflow-y:auto;
        padding: 23px 0 32px 0;
        // border-right:1px solid rgba(0,0,0,0.1);
        h5{
          color:rgba(0,0,0,0.85);
          font-weight: 700;
          margin-left:33px;
          margin-bottom: 10px;
        }
        li{
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 52px;
          line-height: 52px;
          color:rgba(0,0,0,0.85);
          border-bottom:1px dashed #E5E5E5;
          padding-left:32px;
          padding-right: 17px;
        }
        li.active{
          background: rgba(65,150,255,0.2);
          color:rgba(65,150,255,1);
        }
    }
    .content-right{
      flex:1;
      overflow: auto;
      margin-bottom: 19px;
        .index-level:last-child{
          flex:1 !important;
        }
        .index-level{
          .index-level-title{
            border-right: 1px solid #fff;
            height:40px;
            line-height: 40px;
            min-width: 340px;
            background:rgba(65,150,255,1);
            color:#fff;
            padding:0 10px 0px;
            span{
              margin-left: 10px;
            }
          }
          .index-level-content{
            min-height: 540px;
            // max-height: 700px;
            // overflow-y: auto;
            // border-left: 1px solid #F4F5F7;
            // border-right: 1px solid #F4F5F7;
            .index-list{
              li{
                cursor: pointer;
                border-bottom: 1px solid #dadada;
                padding: 10px;
                padding-top: 20px;
                .index-point{
                  width:10px;
                  height:10px;
                  background:rgba(213,213,213,1);
                  border-radius:5px;
                  margin-right: 10px;
                }
                /deep/ .ivu-tooltip{
                  width:100%;
                }
                .index-name{
                  display: inline-block;
                  width: 90%;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  vertical-align: top;
                }
                .more{
                  margin-right:26px;
                  margin-left:10px;
                  min-width:300px;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                }
                .index-btn{
                  visibility: hidden;
                  i:nth-child(2){
                    margin-left: 30px;
                  }
                }
                p{
                   margin-bottom: 5px;
                   justify-content: space-between;
                }
              }
              li.active{
                // background:#E7F2FF;
                .index-point{
                  background:#4196ff;
                }
                .index-name{
                  color:#4196ff;
                }
              }
            }
            .null-index{
              margin-top: 150px;
              text-align: center;
              color:rgba(0,0,0,0.25);
              i{
                font-size: 18px;
              }
              span{
                font-size: 16px;
                margin-left: 10px;
              }
            }
          }
          .index-level-content.shadow{
            box-shadow:0px 2px 19px 0px rgba(147,147,147,0.5);
          }
        }
    }
    .fix-btn {
      z-index:1;
      padding-right: 43px;
      height: 56px;
      position: fixed;
      line-height: 56px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 1px 4px 0px rgba(163, 173, 186, 0.4);
      bottom: 0;
      left: 0;
      width: 100%;
      text-align: center;
      button {
        margin-right: 20px;
      }
    }
  }
}

</style>
