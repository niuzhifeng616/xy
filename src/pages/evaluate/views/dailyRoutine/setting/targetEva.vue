
<template>
  <div class="set-weight">
    <div class="xy-content-body" style="margin-bottom: 46px;">
       <div class="xy-content-title clearfix">
         <div class="targetHead">
            <span>打分方式 ： </span>
            <RadioGroup v-model="scoringType" @on-change='changeRadio()'>
                <Radio :disabled="changeMoralObj.IsEnable === 1" label="0" >分值</Radio>
                <Radio :disabled="changeMoralObj.IsEnable === 1" label="1" >星级</Radio>
            </RadioGroup>
            <!-- <div class="conversion" v-if="scoringType==='1'">
              <span>折算分: </span>
              <InputNumber :precision=0 :disabled="changeMoralObj.IsEnable === 1" :min="0" v-model="conversion" style="width:100px"></InputNumber>
              分/星
            </div> -->
         </div>
         <div style="margin-top:10px;">
          <span>评价初始值 : </span>
           <InputNumber :precision=0 :disabled="changeMoralObj.IsEnable === 1" :min="0" v-model="model1" style="width:100px"></InputNumber>
          <!-- <InputNumber :precision=0 v-if="scoringType==='0'" :disabled="changeMoralObj.IsEnable === 1" :min="0" v-model="model1" style="width:100px"></InputNumber>
          <InputNumber :precision=0 v-if="scoringType==='1'" :disabled="changeMoralObj.IsEnable === 1" :min="0" :max="5" v-model="model1" style="width:100px"></InputNumber> -->
         </div>
       </div>
      <div class="content">
        <Form inline  class="content-right xy-flex" label-position='top'>
          <div class="content-right xy-flex">
              <div class="index-level" style="border-right: 1px solid #F4F5F7;" :class="onActive === 1 ? 'onActive' : ''">
                <div class="index-level-title xy-flex xy-between xy-center">
                  <div class="xy-flex xy-between xy-center">
                    <div style="margin-right:5px;"><i class="iconfont">&#xe6f2;</i><span>一级指标</span></div>
                  </div>
                  <div v-if="level2List.length === 0">
                    <span v-if="scoringType==='1'">
                      折算分:
                        <InputNumber :precision=0 :disabled="changeMoralObj.IsEnable === 1" :min="0" v-model="conversion" style="width:100px"></InputNumber>
                      分/星
                    </span>
                    <span class="num-set" @click="setNum">分值设定</span>
                  </div>
                  <!-- <span class="num-set" v-if="level2List.length === 0" @click="setNum">分值设定</span> -->
                </div>
                <div class="index-level-content">
                  <ul class="index-list">
                    <li v-for="(item,index) in level1List" :key="index" :class="activeId === item.IndexManagementID?'active':''"  @click="chooseLi(item,1,index)" >
                      <div class="xy-flex xy-baseline">
                        <div class="index-point"></div>
                        <div style="flex: 1;" v-if="item.have === 1">
                          <div class="xy-flex xy-between">
                            <span  style="width:300px;" class="index-name" :class="onActive !== 1 ? 'onAct' : ''" v-if="item.have === 1" :alt="item.IndexManagementName">{{item.IndexManagementName}}</span>
                            <span class="over" v-if="item.IsSet">已设置</span>
                            <span v-else class="none"></span>
                          </div>
                        </div>
                        <div style="flex: 1;" v-else>
                           <div class="xy-flex">
                            <div class="xy-flex" style="flex-direction: column;margin-right:10px;width:270px;">
                                 <p style="color:rgba(0,0,0,0.45);margin-bottom:0;">指标项</p>
                                 <p style="width: 270px;">{{item.IndexManagementName}}</p>
                                 <p style="width:60px;">
                                  <span class="over" v-if="item.IsSet">已设置</span>
                                  <span v-else class="none"></span>
                                 </p>
                            </div>
                              <div style="width:270px;" v-if="scoringType==='1'">
                                <FormItem label="最大值" :label-for='`level1Max${index}`'>
                                    <InputNumber :precision=0 :element-id='`level1Max${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0" :max='5' v-model="item.ScoreMax"></InputNumber>
                                </FormItem>
                                <FormItem label="最小值" :label-for='`level1Min${index}`'>
                                    <InputNumber :precision=0 :element-id='`level1Min${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0" :max='5' v-model="item.ScoreMin"></InputNumber>
                                </FormItem>
                                <FormItem label="默认值" :label-for='`level1De${index}`'>
                                    <InputNumber :precision=0  :element-id='`level1De${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0" :max='5' v-model="item.ScoreDefault"></InputNumber>
                                </FormItem>
                              </div>
                              <div style="width:270px;" v-if="scoringType==='0'">
                                <FormItem label="最大值"  :label-for='`level1Max${index}`'>
                                    <InputNumber :precision=0 :element-id='`level1Max${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0"  v-model="item.ScoreMax"></InputNumber>
                                </FormItem>
                                <FormItem label="最小值"  :label-for='`level1Min${index}`'>
                                    <InputNumber :precision=0 :element-id='`level1Min${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0" v-model="item.ScoreMin"></InputNumber>
                                </FormItem>
                                <FormItem label="默认值"  :label-for='`level1De${index}`'>
                                    <InputNumber :precision=0  :element-id='`level1De${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0" v-model="item.ScoreDefault"></InputNumber>
                                </FormItem>
                              </div>
                           </div>
                          </div>
                      </div>
                    </li>
                  </ul>
                  <div class="null-index" v-if="level1List.length===0"><i class="iconfont">&#xe6e7;</i><span>暂无指标</span></div>
                </div>
              </div>
              <div class="index-level" style="border-right: 1px solid #F4F5F7;" :class="onActive === 2 ? 'onActive' : ''">
                <div class="index-level-title xy-flex xy-between xy-center">
                    <div class="xy-flex xy-between xy-center">
                      <div style="margin-right:5px;"><i class="iconfont">&#xe6f2;</i><span>二级指标</span></div>
                    </div>
                    <div v-if="level3List.length === 0 && level2List.length !== 0">
                      <span v-if="scoringType==='1'">
                        折算分:
                          <InputNumber :precision=0 :disabled="changeMoralObj.IsEnable === 1" :min="0" v-model="conversion" style="width:100px"></InputNumber>
                        分/星
                      </span>
                      <span class="num-set" @click="setNum">分值设定</span>
                    </div>
                    <!-- <span class="num-set" v-if="level3List.length === 0 && level2List.length !== 0" @click="setNum">分值设定</span> -->
                  </div>
                  <div class="index-level-content">
                    <ul class="index-list">
                      <li v-for="(item,index) in level2List" :key="index" :style="{height: item.myHeight!=='0px'?item.myHeight:'123px'}" class="active"  @click="chooseLi(item,2)">
                        <div class="xy-flex xy-baseline" >
                          <div v-if="item.have === 1" class="index-point"></div>
                          <div style="flex: 1;" v-if="item.have === 1">
                            <div class="xy-flex" style="width:300px;">
                              <span class="index-name" :class="onActive !== 2 ? 'onAct' : ''" v-if="item.have === 1" :alt="item.IndexManagementName">{{item.IndexManagementName}}</span>
                            </div>
                          </div>
                          <div style="flex: 1;" v-else>
                            <div class="xy-flex">
                             <div class="xy-flex" style="flex-direction: column;margin-right:10px;width: 300px;">
                                 <p style="color:rgba(0,0,0,0.45);margin-bottom:0">指标项</p>
                                 <p>{{item.IndexManagementName}}</p>
                              </div>
                              <span style="width: 270px" v-if="scoringType==='1'">
                                <FormItem label="最大值" :label-for='`level2Max${index}`'>
                                    <InputNumber :precision=0  :element-id='`level2Max${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0" :max='5' v-model="item.ScoreMax"></InputNumber>
                                </FormItem>
                                <FormItem label="最小值" :label-for='`level2Min${index}`'>
                                    <InputNumber :precision=0 :element-id='`level2Min${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0" :max='5' v-model="item.ScoreMin"></InputNumber>
                                </FormItem>
                                <FormItem label="默认值" :label-for='`level2De${index}`'>
                                    <InputNumber :precision=0 :element-id='`level2De${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0" :max='5' v-model="item.ScoreDefault"></InputNumber>
                                </FormItem>
                              </span>
                              <span style="width: 270px" v-if="scoringType==='0'">
                                <FormItem label="最大值" :label-for='`level2Max${index}`'>
                                    <InputNumber :precision=0  :element-id='`level2Max${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0"  v-model="item.ScoreMax"></InputNumber>
                                </FormItem>
                                <FormItem label="最小值" :label-for='`level2Min${index}`'>
                                    <InputNumber :precision=0 :element-id='`level2Min${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0" v-model="item.ScoreMin"></InputNumber>
                                </FormItem>
                                <FormItem label="默认值" :label-for='`level2De${index}`'>
                                    <InputNumber :precision=0  :element-id='`level2De${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0" v-model="item.ScoreDefault"></InputNumber>
                                </FormItem>
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <div class="null-index" v-if="level2List.length===0"><i class="iconfont">&#xe6e7;</i><span>暂无指标</span></div>
                </div>
              </div>
              <div class="index-level" ref="index3" :class="onActive === 3 ? 'onActive' : ''">
                <div class="index-level-title xy-flex xy-between xy-center">
                    <div class="xy-flex xy-between xy-center">
                      <div style="margin-right:5px;"><i class="iconfont">&#xe6f2;</i><span>三级指标</span></div>
                    </div>
                    <div v-if="level3List.length !== 0">
                      <span v-if="scoringType==='1'">
                        折算分:
                         <InputNumber :precision=0 :disabled="changeMoralObj.IsEnable === 1" :min="0" v-model="conversion" style="width:100px"></InputNumber>
                        分/星
                      </span>
                      <span class="num-set" @click="setNum">分值设定</span>
                    </div>
                  </div>
                  <div class="index-level-content">
                    <ul class="index-list" >
                      <li v-for="(item,index) in level3List" :key="index" :class="activeId === item.IndexManagementID?'active':''" @click.stop="chooseLi(item,3)"  style="height:123px;">
                          <div class="xy-flex xy-baseline">
                            <div style="flex: 1;">
                              <div class="xy-flex xy-between">
                                <div class="xy-flex" style="flex-direction: column;margin-right:10px;width:300px;">
                                  <p style="color:rgba(0,0,0,0.45);margin-bottom:0">指标项</p>
                                  <p :title="item.IndexManagementName" style="height:60px;  overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp:3;-webkit-box-orient: vertical;">{{item.IndexManagementName}}</p>
                                </div>
                                <!-- <span class="more">
                                  <Tooltip max-width="100%" :content="item.IndexManagementName">
                                  </Tooltip>
                                  <p style="color:rgba(0,0,0,0.45);margin-bottom:0">指标项</p>
                                  <p class="indexName">{{item.IndexManagementName}}</p>
                                </span> -->
                              <div style="width: 270px" v-if="scoringType==='1'">
                                <FormItem label="最大值" :label-for='`level3Max${index}`'>
                                    <InputNumber :precision=0  :element-id='`level3Max${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0" :max='5' v-model="item.ScoreMax"></InputNumber>
                                </FormItem>
                                <FormItem label="最小值" :label-for='`level3Min${index}`'>
                                    <InputNumber :precision=0  :element-id='`level3Min${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0" :max='5' v-model="item.ScoreMin"></InputNumber>
                                </FormItem>
                                <FormItem label="默认值" :label-for='`level3De${index}`'>
                                    <InputNumber :precision=0  :element-id='`level3De${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0" :max='5' v-model="item.ScoreDefault"></InputNumber>
                                </FormItem>
                              </div>
                              <div style="width: 270px" v-if="scoringType==='0'">
                                <FormItem label="最大值" :label-for='`level3Max${index}`'>
                                    <InputNumber :precision=0  :element-id='`level3Max${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0"  v-model="item.ScoreMax"></InputNumber>
                                </FormItem>
                                <FormItem label="最小值" :label-for='`level3Min${index}`'>
                                    <InputNumber :precision=0  :element-id='`level3Min${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0" v-model="item.ScoreMin"></InputNumber>
                                </FormItem>
                                <FormItem label="默认值"  :label-for='`level3De${index}`'>
                                    <InputNumber :precision=0 :element-id='`level3De${index}`' :disabled="changeMoralObj.IsEnable === 1" :min="0" v-model="item.ScoreDefault"></InputNumber>
                                </FormItem>
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
          <Button class="xy-btn-primary" shape="circle" :disabled="changeMoralObj.IsEnable === 1" @click="save">保存</Button>
        </div>
      </div>
    </div>
    <Modal v-model="setNumModel"
      title="分值设置"
      :transfer="false"
      :mask-closable="false"
      @on-visible-change="watchClose">
      <Form ref="formValidate" :model="formValidate" :rules="scoringType==='0'?ruleValidate:ruleValidate1" @submit.native.prevent :label-width="80" label-position='left'>
        <template v-if="scoringType==='0'">
          <FormItem label="最大值"  prop="big" label-for="big">
              <InputNumber :precision=0 element-id='big' :disabled="changeMoralObj.IsEnable === 1" :min="0"  v-model="formValidate.big" style="width:50%;"></InputNumber> 分
          </FormItem>
          <FormItem label="最小值" prop="small" label-for="small">
              <InputNumber :precision=0 element-id="small" :disabled="changeMoralObj.IsEnable === 1" :min="0" v-model="formValidate.small" style="width:50%;"></InputNumber> 分
          </FormItem>
          <FormItem label="默认分值"  prop="default" label-for="default">
              <InputNumber :precision=0  element-id="default" :disabled="changeMoralObj.IsEnable === 1" :min="0" v-model="formValidate.default" style="width:50%;"></InputNumber> 分
          </FormItem>
        </template>
        <template v-else>
          <FormItem label="最大值"  prop="big">
              <Select :disabled="changeMoralObj.IsEnable === 1" v-model="formValidate.big" style="width:200px">
                <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select> <Rate v-model="Rate" :count="Rate" :custom-icon="'iconfont icon-Starunselectedbeifen'"/>
          </FormItem>
          <FormItem label="最小值" prop="small">
            <Select :disabled="changeMoralObj.IsEnable === 1" v-model="formValidate.small" style="width:200px">
                <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select> <Rate v-model="Rate" :count="Rate" :custom-icon="'iconfont icon-Starunselectedbeifen'"/>
          </FormItem>
          <FormItem label="默认分值"  prop="default">
              <Select :disabled="changeMoralObj.IsEnable === 1" v-model="formValidate.default" style="width:200px">
                <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select> <Rate v-model="Rate" :count="Rate" :custom-icon="'iconfont icon-Starunselectedbeifen'"/>
          </FormItem>
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
    name: 'targetEva',
    data () {
      return {
        scoringType: '1',
        conversion: 0,
        titles: '创建一级指标',
        indexModal: false,
        addMarkRules: {
          IndexManagementName: [
            { required: true, message: '指标名称不能为空', trigger: 'blur' }
          ]
        },
        editorIndexNameModel: false,
        addMark: {
          IndexManagementName: ''
        },
        editorIndexRules: {
          IndexManagementName: [
            { required: true, message: '指标名称不能为空', trigger: 'blur' }
          ]
        },
        editorIndex: {
          IndexManagementName: ''
        },
        StepsHeader: {},
        List: [
          { value: 0, label: '0' },
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
          ]
        },
        formValidate: {
          big: 0,
          small: 0,
          default: 0
        },
        setNumModel: false,
        currentItem: 0, // 第一条(针对第一列)
        currentIndex: '',
        flag: true,
        flags: true,
        superItem: '', // 上级数据
        level1List: [],
        level2List: [],
        level3List: [],
        onActive: 3,
        activeId: '',
        activeId1: '',
        activeId2: '',
        activeId3: '',
        model1: 0,
        activeData: [],
        activeType: '',
        activeEditorIndexdata: []
      }
    },
    computed: {
      changeMoralObj () {
        return this.$store.state.evaluate.changeMoralObj
      }
    },
    created () {
      // 默认获取保存了的取值方式
      this.scoringType = String(this.$store.state.evaluate.scoringType)
      this.StepsHeader = this.$parent
      this.changeRadio()
      // this.getProgrammeWeight()
    },
    methods: {
      changeRadio () {
        this.$store.commit('evaluate/changeScoreType', this.scoringType)
        let scoreType = true
        this.getProgrammeWeight(scoreType)
      },
      // 获取设置
      getProgrammeWeight (scoreType) {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/MoralProgramme/GetProgrammeIndexSettingById`, {
          programmeid: this.StepsHeader.rowObj.ProgrammeID,
          // scoretype: Number(this.scoringType)
          scoretype: Number(this.scoringType)
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.level1List = []
            this.level2List = []
            this.level3List = []
            if (!scoreType) {
              this.scoringType = res.data.ScoreType.toString()
              this.$store.commit('evaluate/changeScoreType', this.scoringType)
            }
            this.conversion = res.data.Conversion
            this.model1 = res.data.InitialScore
            this.level1List = res.data.IndexData
            if (this.level1List.length > 0) {
              this.activeId = this.level1List[0].IndexManagementID// 解决跳转样式不跳转
              this.activeId1 = this.level1List[0].IndexManagementID
              this.level2List = this.level1List[0].children.concat(this.level2List)
              for (var l1 = 0; l1 < this.level1List.length; l1++) {
                if (this.level1List[l1].children && this.level1List[l1].children.length > 0) {
                  this.level1List[l1].have = 1
                  this.activeId2 = this.level1List[l1].children[0].IndexManagementID
                } else {
                  this.level1List[l1].have = 0
                }
              }
            } else {
              this.activeId1 = ''
              this.level2List = []
              this.activeId2 = ''
              this.level3List = []
              this.activeId3 = ''
            }
            if (this.level2List.length > 0) {
              for (var l2 = 0; l2 < this.level2List.length; l2++) {
                // this.level3List = this.level3List.concat(...this.level2List[l2].children)
                if (this.level2List[l2].children && this.level2List[l2].children.length > 0) {
                  this.level2List[l2].have = 1
                  this.activeId3 = this.level2List[l2].children[0].IndexManagementID
                } else {
                  this.level2List[l2].have = 0
                }
              }
            }
            // 找出当前展示二级的所有三级指标 设置二级指标高度
            this.level2List.forEach(item => {
              if (item.children) {
                item.myHeight = (item.children.length * 123) + 'px'
                item.children.forEach(item1 => {
                  this.level3List.push(item1)
                })
              }
            })
          }
        })
      },
      // 分值设定
      setNum () {
        if (this.scoringType === '0') {
          this.formValidate.big = 10
          this.formValidate.default = 10
        }
        if (this.scoringType === '1') {
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
                item.ScoreMax = this.formValidate.big
                item.ScoreMin = this.formValidate.small
                item.ScoreDefault = this.formValidate.default
                item.Conversion = this.formValidate.conversion
              })
            } else {
              if (this.level2List.length !== 0) {
                this.level2List.forEach(item => {
                  item.ScoreMax = this.formValidate.big
                  item.ScoreMin = this.formValidate.small
                  item.ScoreDefault = this.formValidate.default
                  item.Conversion = this.formValidate.conversion
                })
              } else {
                if (this.level1List.length !== 0) {
                  this.level1List.forEach(item => {
                    item.ScoreMax = this.formValidate.big
                    item.ScoreMin = this.formValidate.small
                    item.ScoreDefault = this.formValidate.default
                    item.Conversion = this.formValidate.conversion
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
      // 选择指标
      chooseLi (item, val, index) {
        if (val === 1) {
          this.activeId = item.IndexManagementID
          this.activeId1 = item.IndexManagementID
          this.level2List = []
          this.activeId2 = ''
          this.level3List = []
          this.activeId3 = ''
          if (item.children && item.children.length > 0) {
            this.level2List = item.children.concat(this.level2List)
            this.activeId2 = item.children[0].IndexManagementID
            this.level3List = []
            this.activeId3 = ''
            for (var a3 = 0; a3 < this.level2List.length; a3++) {
              // this.level3List = this.level3List.concat(this.level2List[a3].children)
              if (this.level2List[a3].children && this.level2List[a3].children.length > 0) {
                this.activeId3 = this.level2List[a3].children[0].IndexManagementID
                this.level2List[a3].have = 1
              } else {
                this.level2List[a3].have = 0
              }
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
            if (item.children) {
              item.myHeight = (item.children.length * 123) + 'px'
              item.children.forEach(item1 => {
                this.level3List.push(item1)
              })
            }
          })
        }
      },
      // 保存
      save () {
        let detailmodelList = []
        if (this.level3List.length !== 0) {
          for (let index in this.level3List) {
            detailmodelList.push({
              IndexManagementID: this.level3List[index].IndexManagementID,
              Level: this.level3List[index].Level,
              ScoreMax: this.level3List[index].ScoreMax,
              ScoreMin: this.level3List[index].ScoreMin,
              ScoreDefault: this.level3List[index].ScoreDefault
            })
          }
        } else {
          if (this.level2List.length !== 0) {
            for (let index in this.level2List) {
              detailmodelList.push({
                IndexManagementID: this.level2List[index].IndexManagementID,
                Level: this.level2List[index].Level,
                ScoreMax: this.level2List[index].ScoreMax,
                ScoreMin: this.level2List[index].ScoreMin,
                ScoreDefault: this.level2List[index].ScoreDefault
              })
            }
          } else {
            if (this.level1List.length !== 0) {
              for (let index in this.level1List) {
                detailmodelList.push({
                  IndexManagementID: this.level1List[index].IndexManagementID,
                  Level: this.level1List[index].Level,
                  ScoreMax: this.level1List[index].ScoreMax,
                  ScoreMin: this.level1List[index].ScoreMin,
                  ScoreDefault: this.level1List[index].ScoreDefault
                })
              }
            }
          }
        }
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/MoralProgramme/SaveProgrammeDetail`, {
          // ScoreType: Number(this.scoringType),
          ScoreType: this.scoringType,
          InitialScore: Number(this.model1),
          ProgrammeID: this.StepsHeader.rowObj.ProgrammeID,
          IndicatorTypeID: this.StepsHeader.rowObj.IndicatorTypeID,
          Conversion: this.conversion,
          detailmodelList: detailmodelList
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.getProgrammeWeight()
            this.$parent.getGeneralFlows()
          }
        })
      }
    }

  }
</script>
<style lang="less" scoped>
.conversion{
  display: inline-block;
}
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
      border-top:1px solid rgba(0,0,0,0.1);
    .content-right{
      flex:1;
      overflow: auto;
      margin-bottom: 19px;
        // .onActive{
        //   flex:1 !important;
        // }
        .index-level:last-child{
          flex:1 !important;
        }
        .index-level{
          min-width: 600px;
          .index-level-title{
            border-right: 1px solid #fff;
            height:40px;
            line-height: 40px;
            background:rgba(65,150,255,1);
            color:#fff;
            padding:0 10px 0px;
            span{
              margin-left: 10px;
            }
          }
          .index-level-content{
            min-height: auto;
            // max-height: 700px;
            // overflow-y: auto;
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
                  min-width:150px;
                }
                .index-name{
                  display: inline-block;
                  width: 90%;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  vertical-align: top;
                }
                .onAct{
                  width: 75%;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .more{
                  margin-right:26px;
                  margin-left:10px;
                  min-width:300px;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  height: 100%;
                  .indexName{
                    white-space: normal;
                    word-break: break-all;
                    max-width: 400px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                  }
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
