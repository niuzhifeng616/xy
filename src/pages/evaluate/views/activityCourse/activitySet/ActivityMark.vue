<template>
  <div class="set-weight">
    <div class="xy-content-body">
       <div class="xy-content-title clearfix">
         <div class="xy-flex xy-center">
          <span>打分方式 ： </span>
            <RadioGroup v-model="scoringType" @on-change='changeScoringType'>
                <Radio label="0" class="start">星级</Radio>
                <Radio label="1" >分值</Radio>
            </RadioGroup>
         </div>
         <div style="margin-top:10px;">
          <span>活动指标 : </span>
            <Select v-model="indicator" style="width:200px" @on-change='indicatorChange'>
                <Option v-for="(item,index) in indicatorList" :value="item.id" :key="index">{{ item.ActivityCourseTargetDropDownName }}</Option>
            </Select>
         </div>
       </div>
      <div class="content">
        <Form inline  class="content-right xy-flex" label-position="top">
          <div class="content-right xy-flex">
              <div class="index-level">
                <div class="index-level-title xy-flex xy-between xy-center">
                  <div class="xy-flex xy-between xy-center">
                    <div style="margin-right:5px;"><i class="iconfont">&#xe6f2;</i><span>一级指标</span></div>
                    <Icon type="md-add-circle" size="24" style="cursor: pointer;" @click="addIndex(level1List,1)"  />
                  </div>
                  <span class="num-set" v-if="level2List.length === 0&&level1List.length>0" @click="setNum">分值设定</span>
                </div>
                <div class="index-level-content">
                  <ul class="index-list">
                    <li v-for="(item,index) in level1List" :key="index" :class="activeId1 === item.ActivityCourseProjectTargetID?'active':''"  @click="chooseLi(item,1,index)" >
                      <div class="xy-flex xy-baseline">
                        <div class="index-point"></div>
                        <div style="flex: 1;" v-if="level2List.length>0">
                          <div class="xy-flex">
                            <p  class="index-name">{{item.ActivityCourseProjectTargetName}}</p>
                            <!-- <Tooltip max-width="200" :content="item.ActivityCourseProjectTargetName">
                              <span class="index-name" :alt="item.ActivityCourseProjectTargetName">{{item.ActivityCourseProjectTargetName}}</span>
                            </Tooltip> -->
                            <span class="over" v-if="item.IsFinishSetting">已设置</span>
                            <span v-else class="none"></span>
                            <i  class="iconfont font14" style="margin: 0 5px;" @click.stop="editorIndexManagementName(index,item.ActivityCourseProjectTargetName,1)">&#xe6f7;</i>
                            <i  class="iconfont font14" style="margin: 0 5px;" @click.stop="deleteIndex(level1List,index,1)">&#xe6e1;</i>
                          </div>
                        </div>
                        <div style="flex: 1;" v-else>
                            <p class="xy-flex" style="height: 65px;">
                              <span class="more">
                                <Tooltip max-width="200" :content="item.ActivityCourseProjectTargetName">
                                  <p style="color:rgba(0,0,0,0.45);margin-bottom:0">指标项</p>{{item.ActivityCourseProjectTargetName}}
                                </Tooltip>
                                <span class="over" v-if="item.IsFinishSetting">已设置</span>
                                <span v-else class="none"></span>
                                <i class="iconfont font14" style="margin: 0 5px;" @click.stop="editorIndexManagementName(index,item.ActivityCourseProjectTargetName,1)">&#xe6f7;</i>
                                <i class="iconfont font14" style="margin: 0 5px;" @click.stop="deleteIndex(level1List,index,1)">&#xe6e1;</i>
                              </span>
                              <template v-if='!item.Childrens||item.Childrens.length===0'>
                                <FormItem label="最大值" :label-for='`level1Max${index}`'>
                                <InputNumber @on-change='checkInput(item)' :element-id='`level1Max${index}`' :max='5' :min="0"  v-model="item.MaxValue"  v-if="scoringType==='0'"   :parser="value => value.replace('.', '')"></InputNumber>
                                <InputNumber @on-change='checkInput(item)' :element-id='`level1Max${index}`' :min="0"  v-model="item.MaxValue" v-else  :parser="value => value.replace('.', '')"></InputNumber>
                                </FormItem>
                                <FormItem label="最小值" :label-for='`level1Min${index}`'>
                                    <InputNumber @on-change='checkInput(item)' :element-id='`level1Min${index}`' :max='5' :min="0" v-model="item.MinValue" v-if="scoringType==='0'" :parser="value => value.replace('.', '')"></InputNumber>
                                    <InputNumber @on-change='checkInput(item)' :element-id='`level1Min${index}`' :min="0"   v-model="item.MinValue"  v-else :parser="value => value.replace('.', '')"></InputNumber>
                                </FormItem>
                                <FormItem label="默认值" :label-for='`level1De${index}`'>
                                    <InputNumber  @on-change='checkInput(item)' :element-id='`level1De${index}`' :max='5' :min="0" v-model="item.DefaultValue" v-if="scoringType==='0'" :parser="value => value.replace('.', '')"></InputNumber>
                                    <InputNumber  @on-change='checkInput(item)' :element-id='`level1De${index}`' :min="0" v-model="item.DefaultValue"  v-else :parser="value => value.replace('.', '')"></InputNumber>
                                </FormItem>
                                <FormItem label="折算分/星" v-if="scoringType==='0'" :label-for='`level1Co${index}`'>
                                    <InputNumber  :min="1" v-model="item.ConversionValue" :element-id='`level1Co${index}`' :parser="value => value.replace('.', '')"  @on-change='checkConversionInput()'></InputNumber>
                                </FormItem>
                              </template>
                            </p>
                          </div>
                      </div>
                    </li>
                  </ul>
                  <div class="null-index" v-if="level1List.length===0"><i class="iconfont">&#xe6e7;</i><span>暂无指标</span></div>
                </div>
              </div>
              <div class="index-level">
                <div class="index-level-title xy-flex xy-between xy-center">
                    <div class="xy-flex xy-between xy-center">
                      <div style="margin-right:5px;"><i class="iconfont">&#xe6f2;</i><span>二级指标</span></div>
                      <Icon type="md-add-circle" size="24" style="cursor: pointer;" v-if="activeId1!==''&&level1List.length>0"  @click="addIndex(level2List,2)" />
                    </div>
                    <span class="num-set" v-if="level3List.length === 0 && level2List.length !== 0" @click="setNum">分值设定</span>
                  </div>
                  <div class="index-level-content">
                    <ul class="index-list">
                      <li v-for="(item,index) in level2List" :key="index" :class="activeId2 === item.ActivityCourseProjectTargetID?'active':''"  @click="chooseLi(item,2)">
                        <div class="xy-flex xy-baseline" >
                          <div class="index-point"></div>
                          <div style="flex: 1;" v-if="level3List.length>0">
                            <div class="xy-flex">
                              <!-- <Tooltip max-width="200" :content="item.ActivityCourseProjectTargetName">
                                <span class="index-name" :alt="item.ActivityCourseProjectTargetName">{{item.ActivityCourseProjectTargetName}}</span>
                              </Tooltip> -->
                              <p>{{item.ActivityCourseProjectTargetName}}</p>
                              <i class="iconfont font14" style="margin: 0 5px;" @click.stop="editorIndexManagementName(index,item.ActivityCourseProjectTargetName,2)">&#xe6f7;</i>
                              <i class="iconfont font14" style="margin: 0 5px;" @click.stop="deleteIndex(level2List,index,2)">&#xe6e1;</i>
                            </div>
                          </div>
                          <div style="flex: 1;" v-else>
                            <p class="xy-flex" style="height: 65px;">
                              <span class="more"><Tooltip max-width="200" :content="item.ActivityCourseProjectTargetName">
                                <p style="color:rgba(0,0,0,0.45);margin-bottom:0">指标项</p>{{item.ActivityCourseProjectTargetName}}
                                </Tooltip>
                                <i class="iconfont font14" style="margin: 0 5px;" @click.stop="editorIndexManagementName(index,item.ActivityCourseProjectTargetName,2)">&#xe6f7;</i>
                                <i class="iconfont font14" style="margin: 0 5px;" @click.stop="deleteIndex(level2List,index,2)">&#xe6e1;</i>
                              </span>
                              <template v-if='!item.Childrens||item.Childrens.length===0'>
                                <FormItem label="最大值" :label-for='`level2Max${index}`'>
                                  <InputNumber @on-change='checkInput(item)'  :element-id='`level2Max${index}`' :max='5' :min="0"  v-model="item.MaxValue" v-if="scoringType==='0'" :parser="value => value.replace('.', '')"></InputNumber>
                                  <InputNumber  @on-change='checkInput(item)'  :element-id='`level2Max${index}`' :min="0"  v-model="item.MaxValue" v-else :parser="value => value.replace('.', '')"></InputNumber>
                                </FormItem>
                                <FormItem label="最小值" :label-for='`level2Min${index}`'>
                                    <InputNumber @on-change='checkInput(item)'  :element-id='`level2Min${index}`' :max='5' :min="0" v-model="item.MinValue" v-if="scoringType==='0'" :parser="value => value.replace('.', '')"></InputNumber>
                                    <InputNumber @on-change='checkInput(item)' :element-id='`level2Min${index}`' :min="0"  v-model="item.MinValue" v-else :parser="value => value.replace('.', '')"></InputNumber>
                                </FormItem>
                                <FormItem label="默认值" :label-for='`level2De${index}`'>
                                    <InputNumber @on-change='checkInput(item)'  :element-id='`level2De${index}`' :max='5' :min="0" v-model="item.DefaultValue" v-if="scoringType==='0'" :parser="value => value.replace('.', '')"></InputNumber>
                                    <InputNumber @on-change='checkInput(item)'  :element-id='`level2De${index}`' :min="0"  v-model="item.DefaultValue" v-else :parser="value => value.replace('.', '')"></InputNumber>
                                </FormItem>
                                <FormItem label="折算分/星" v-if="scoringType==='0'" :label-for='`level2Co${index}`'>
                                    <InputNumber  :min="1" v-model="item.ConversionValue"  :element-id='`level2Co${index}`' :parser="value => value.replace('.', '')" @on-change='checkConversionInput()'></InputNumber>
                                </FormItem>
                              </template>
                            </p>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <div class="null-index" v-if="level2List.length===0"><i class="iconfont">&#xe6e7;</i><span>暂无指标</span></div>
                </div>
              </div>
              <div class="index-level">
                <div class="index-level-title xy-flex xy-between xy-center">
                    <div class="xy-flex xy-between xy-center">
                      <div style="margin-right:5px;"><i class="iconfont">&#xe6f2;</i><span>三级指标</span></div>
                      <Icon type="md-add-circle" size="24"  style="cursor: pointer;"  v-if="activeId2!==''&&level2List.length>0"  @click="addIndex(level3List,3)"  />
                    </div>
                    <span class="num-set" v-if="level3List.length !== 0" @click="setNum">分值设定</span>
                  </div>
                  <div class="index-level-content">
                    <ul class="index-list" >
                      <li v-for="(item,index) in level3List" :key="index" @click.stop="chooseLi(item,3)">
                          <div class="xy-flex xy-baseline">
                            <div style="flex: 1;">
                              <div class="xy-flex xy-between">
                                <div class="xy-flex" style="flex-direction: column;margin-right:10px;width:300px;">
                                  <p style="color:rgba(0,0,0,0.45);margin-bottom:0">指标项</p>
                                  <div class="xy-flex">
                                    <p :title="item.ActivityCourseProjectTargetName">{{item.ActivityCourseProjectTargetName}}</p>
                                    <p>
                                      <i class="iconfont font14" style="margin: 0 5px;" @click.stop="editorIndexManagementName(index,item.ActivityCourseProjectTargetName,3)">&#xe6f7;</i>
                                      <i class="iconfont font14" style="margin: 0 5px;" @click.stop="deleteIndex(level3List,index,3)">&#xe6e1;</i>
                                    </p>
                                  </div>
                                </div>
                                <!-- <span class="more"><Tooltip max-width="200" :content="item.ActivityCourseProjectTargetName">
                                  <p style="color:rgba(0,0,0,0.45);margin-bottom:0">指标项</p>
                                  <div class="xy-flex">
                                    <span class="index-name">{{item.ActivityCourseProjectTargetName}}</span>
                                     <i class="iconfont font14" style="margin: 0 5px;" @click.stop="editorIndexManagementName(index,item.ActivityCourseProjectTargetName,3)">&#xe6f7;</i>
                                  <i class="iconfont font14" style="margin: 0 5px;" @click.stop="deleteIndex(level3List,index,3)">&#xe6e1;</i>
                                  </div>
                                  </Tooltip>
                                </span> -->
                                <FormItem label="最大值" :label-for='`level3Max${index}`'>
                                   <InputNumber @on-change='checkInput(item)' :element-id='`level3Max${index}`' :max='5' :min="0"  v-model="item.MaxValue" v-if="scoringType==='0'" :parser="value => value.replace('.', '')"></InputNumber>
                                   <InputNumber @on-change='checkInput(item)' :element-id='`level3Max${index}`' :min="0"  v-model="item.MaxValue" v-else :parser="value => value.replace('.', '')"></InputNumber>
                                </FormItem>
                                <FormItem label="最小值" :label-for='`level3Min${index}`'>
                                    <InputNumber @on-change='checkInput(item)' :element-id='`level3Min${index}`' :max='5' :min="0" v-model="item.MinValue" v-if="scoringType==='0'" :parser="value => value.replace('.', '')"></InputNumber>
                                    <InputNumber  @on-change='checkInput(item)' :element-id='`level3Min${index}`' :min="0" v-model="item.MinValue"  v-else :parser="value => value.replace('.', '')"></InputNumber>
                                </FormItem>
                                <FormItem label="默认值" :label-for='`level3De${index}`'>
                                    <InputNumber @on-change='checkInput(item)' :element-id='`level3De${index}`' :max='5' :min="0" v-model="item.DefaultValue" v-if="scoringType==='0'" :parser="value => value.replace('.', '')"></InputNumber>
                                    <InputNumber @on-change='checkInput(item)' :element-id='`level3De${index}`' :min="0" v-model="item.DefaultValue"  v-else :parser="value => value.replace('.', '')"></InputNumber>
                                </FormItem>
                                <FormItem label="折算分/星" v-if="scoringType==='0'" :label-for='`level3Co${index}`'>
                                  <InputNumber  :min="1" v-model="item.ConversionValue"  :element-id='`level3Co${index}`' :parser="value => value.replace('.', '')" @on-change='checkConversionInput()'></InputNumber>
                                </FormItem>
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
          <Button class="xy-btn-primary" shape="circle" :disabled="StepsHeader.rowObj.IsEnable===1||level1List.length===0" @click="save">保存</Button>
        </div>
      </div>
    </div>
    <Modal v-model="setNumModel"
      title="分值设置"
      :mask-closable="true"
      @on-visible-change="watchClose">
      <Form ref="formValidate" :model="formValidate" :rules="scoringType==='1'?ruleValidate:ruleValidate1" label-position='left' :label-width="80">
        <template v-if="scoringType==='1'">
          <FormItem label="最大值"  prop="big" label-for='big'>
              <InputNumber :min="0"  v-model="formValidate.big" style="width:50%;" element-id='big' :parser="value => value.replace('.', '')"></InputNumber> 分
          </FormItem>
          <FormItem label="最小值" prop="small" label-for='small'>
              <InputNumber :min="0" v-model="formValidate.small" style="width:50%;" element-id='small' :parser="value => value.replace('.', '')"></InputNumber> 分
          </FormItem>
          <FormItem label="默认分值"  prop="default" label-for='default'>
              <InputNumber :min="0" v-model="formValidate.default" style="width:50%;" element-id='default' :parser="value => value.replace('.', '')"></InputNumber> 分
          </FormItem>
        </template>
        <template v-else>
          <FormItem label="最大值"  prop="big">
              <Select v-model="formValidate.big" style="width:200px">
                <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select> <Rate v-model="Rate" :count="Rate" />
          </FormItem>
          <FormItem label="最小值" prop="small">
            <Select v-model="formValidate.small" style="width:200px">
                <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select> <Rate v-model="Rate" :count="Rate" />
          </FormItem>
          <FormItem label="默认分值"  prop="default">
              <Select v-model="formValidate.default" style="width:200px">
                <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select> <Rate v-model="Rate" :count="Rate" />
          </FormItem>
          <FormItem label="星级折算"  prop="conversion" label-for='conversion'>
              <InputNumber  :min="0" v-model="formValidate.conversion" element-id='conversion' style="width:50%;" :parser="value => value.replace('.', '')"></InputNumber> 分 / <Rate v-model="Rate" :count="Rate"/>
          </FormItem>
        </template>
      </Form>
      <div slot="footer">
        <Button class="xy-modal-close" @click="cancel">取消</Button>
        <Button class="xy-modal-primary" @click="ok" shape="circle">确定</Button>
      </div>
    </Modal>
    <!-- 新增指标 -->
     <Modal v-model="indexModal"
        :title="titles"
        :transfer="false"
        :mask-closable="false"
        @on-visible-change="watchClose1"
      >
      <Form ref="addMark" :model="addMark" :rules="addMarkRules" label-position='top'>
        <FormItem label="指标名称" prop="IndexManagementName" label-for='addName'>
          <Input v-model.trim="addMark.IndexManagementName" clearable element-id='addName' />
        </FormItem>
      </Form>
        <div slot="footer">
          <Button class="xy-modal-close" @click="indexModal=false">取消</Button>
          <Button class="xy-modal-primary" @click="indexModalOk" shape="circle">确定</Button>
        </div>
      </Modal>
    <!-- 编辑指标 -->
     <Modal v-model="editorIndexNameModel"
        title="编辑指标名字"
        :transfer="false"
        :mask-closable="false"
        @on-visible-change="watchClose2"
      >
      <Form ref="editorIndex" :model="editorIndex" :rules="editorIndexRules" label-position='top'>
        <FormItem label="指标名称" prop="IndexManagementName" label-for='editName'>
          <Input v-model.trim="editorIndex.IndexManagementName" clearable element-id='editName' />
        </FormItem>
      </Form>
        <div slot="footer">
          <Button class="xy-modal-close" @click="editorIndexNameModel=false">取消</Button>
          <Button class="xy-modal-primary" @click="editorIndexNameOk" shape="circle">确定</Button>
        </div>
      </Modal>
  </div>
</template>
<script>
  export default {
    name: 'SetWeight',
    data () {
      return {
        addID: -1, // 创建指标，当前页面有效
        targetEdit: false, // 针对指标名称是否增删改，
        targetScoreEdit: false, // 针对分值是否增删改，
        scoringType: '0',
        titles: '创建一级指标',
        indexModal: false,
        addMarkRules: {
          IndexManagementName: [
            { required: true, message: '指标名称不能为空', trigger: 'blur' },
            { type: 'string', max: 10, message: '指标名称不能超过10字符', trigger: 'blur' }
          ]
        },
        editorIndexNameModel: false,
        addMark: {
          IndexManagementName: ''
        },
        editorIndexRules: {
          IndexManagementName: [
            { required: true, message: '指标名称不能为空', trigger: 'blur' },
            { type: 'string', max: 10, message: '指标名称不能超过10字符', trigger: 'blur' }
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
        level1List: [],
        level2List: [],
        level3List: [],
        activeId1: '',
        activeId2: '',
        activeId3: '',
        activeData: [],
        activeType: '',
        activeEditorIndex: {
          index: -1, // 下标
          level: -1 // 级别
        },
        // 活动指标页面 下拉框
        indicatorList: [],
        indicatorID: -1, // 活动指标下拉的对应值
        indicator: -1// 活动指标接口id
      }
    },
    created () {
      this.StepsHeader = this.$parent
      this.scoringType = this.StepsHeader.rowObj.ActivityCourseScoreType
      if (this.StepsHeader.rowObj.ActivityCourseTemplateType === 'ST') {
        this.indicator = -1
        this.indicatorID = this.StepsHeader.rowObj.ActivityCourseTemplateID
      } else {
        this.indicator = this.StepsHeader.rowObj.ActivityCourseTemplateID
        this.indicatorID = this.StepsHeader.rowObj.ActivityCourseTemplateID
      }
      this.getTargetDropDownList()
    },
    methods: {
      /** 打分方式
      星级：页面和弹框最大值、最小值和默认值，最大只能是5，折算分/星，正整数
      分值：页面和弹框最大值、最小值和默认值，最大为正整数**/
      resetValue (val) {
        val.map(item => {
          item.MaxValue = 0
          item.DefaultValue = 0
          item.MinValue = 0
          item.ConversionValue = 1
          if (item.Childrens && item.Childrens.length > 0) {
            this.resetValue(item.Childrens)
          }
          return item
        })
      },
      changeScoringType () {
        if (this.level1List.length > 0) {
          this.resetValue(this.level1List)
        }
        if (this.level2List.length > 0) {
          this.resetValue(this.level2List)
        }
        if (this.level3List.length > 0) {
          this.resetValue(this.level3List)
        }
        this.targetScoreEdit = true
      },
      // 活动指标页面 下拉框
      getTargetDropDownList () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseProject/GetTargetDropDownList`, {
          ActivityCourseProjectID: this.$parent.rowObj.ActivityCourseProjectID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.indicatorList = res.data
            if (this.indicatorList.length) {
              this.indicatorList.map(item => {
                if (item.ActivityCourseTargetDropDownType === 'ST') {
                  this.$set(item, 'id', -1)
                } else {
                  this.$set(item, 'id', item.ActivityCourseTargetDropDownID)
                }
              })
              if (this.indicator === -1 || this.indicator === 0) {
                this.indicatorID = this.indicatorList[0].ActivityCourseTargetDropDownID
                this.indicator = this.indicatorList[0].id
              }

              console.log(this.indicatorList)
            }
            this.getProgrammeWeight()
          }
        })
      },
      indicatorChange (val) {
        if (val === -1) {
          let index = this.indicatorList.map(item => { return item.id }).indexOf(-1)
          this.indicator = this.indicatorList[index].id
          this.indicatorID = this.indicatorList[index].ActivityCourseTargetDropDownID
        } else {
          this.indicatorID = val
        }
        this.getProgrammeWeight()
      },
      // 获取设置
      getProgrammeWeight () {
        let index = 0
        if (this.indicator === -1) {
          index = this.indicatorList.map(item => { return item.id }).indexOf(-1)
        } else {
          index = this.indicatorList.map(item => { return item.id }).indexOf(this.indicatorID)
        }
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseTemplate/GetTemplateTargetDetailList`, {
          ActivityCourseProjectID: this.$parent.rowObj.ActivityCourseProjectID,
          ActivityCourseTypeID: this.indicatorID,
          ActivityCourseTypeName: index > -1 ? this.indicatorList[index].ActivityCourseTargetDropDownType.toString() : ''
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.level1List = res.data
            if (this.level1List.length > 0) {
              this.activeId1 = this.level1List[0].ActivityCourseProjectTargetID
              if (this.level1List[0].Childrens && this.level1List[0].Childrens.length > 0) {
                this.level2List = this.level1List[0].Childrens.concat([])
                this.activeId2 = this.level1List[0].Childrens[0].ActivityCourseProjectTargetID
                if (this.level2List[0].Childrens && this.level2List[0].Childrens.length > 0) {
                  this.level3List = this.level2List[0].Childrens.concat([])
                  this.activeId3 = this.level1List[0].Childrens[0].Childrens[0].ActivityCourseProjectTargetID
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
          }
        })
      },
      // 删除指标
      deleteIndex (data, index, level) {
        this.$Modal.confirm({
          title: '确定删除指标',
          onOk: () => {
            if (level === 1) {
              this.level1List.splice(index, 1)
              if (this.level1List.length) {
                this.activeId1 = this.level1List[0].ActivityCourseProjectTargetID
                this.level2List = this.level1List[0].Childrens.concat([])
                if (this.level2List.length) {
                  this.activeId2 = this.level2List[0].ActivityCourseProjectTargetID
                  this.level3List = this.level2List[0].Childrens.concat([])
                } else {
                  this.level3List = []
                }
              } else {
                this.level2List = []
                this.level3List = []
              }
            }
            if (level === 2) {
              this.level2List.splice(index, 1)
              let index1 = this.level1List.map(item => { return item.ActivityCourseProjectTargetID }).indexOf(this.activeId1)
              this.level1List[index1].Childrens.splice(index, 1)
              if (this.level2List.length) {
                this.activeId2 = this.level2List[0].ActivityCourseProjectTargetID
                this.level3List = this.level2List[0].Childrens.concat([])
              } else {
                this.level3List = []
              }
            }
            if (level === 3) {
              this.level3List.splice(index, 1)
              let index1 = this.level1List.map(item => { return item.ActivityCourseProjectTargetID }).indexOf(this.activeId1)
              let index2 = this.level1List[index1].Childrens.map(item => { return item.ActivityCourseProjectTargetID }).indexOf(this.activeId2)
              this.level1List[index1].Childrens[index2].Childrens.splice(index, 1)
            }
            this.targetEdit = true
            this.$Message.info('删除成功。')
          },
          onCancel: () => {
            this.$Message.info('取消删除。')
          }
        })
      },
      editValidType (type) {
        // this.type = type
        switch (type) {
          case 1:
            // this.titles = '编辑一级指标'
            this.editorIndexRules.IndexManagementName[1].max = 10
            this.editorIndexRules.IndexManagementName[1].message = '指标名称不能超过10字符'
            break
          case 2:
            // this.titles = '编辑二级指标'
            this.editorIndexRules.IndexManagementName[1].max = 10
            this.editorIndexRules.IndexManagementName[1].message = '指标名称不能超过10字符'
            break
          case 3:
            // this.titles = '编辑三级指标'
            this.editorIndexRules.IndexManagementName[1].max = 40
            this.editorIndexRules.IndexManagementName[1].message = '指标名称不能超过40字符'
            break
        }
      },
      // 编辑指标名字
      editorIndexManagementName (index, name, level) {
        this.editorIndexNameModel = true
        this.activeEditorIndex.index = index
        this.activeEditorIndex.level = level
        this.editorIndex.IndexManagementName = name
        this.editValidType(level)
      },
      editorIndexNameOk () {
        this.$refs.editorIndex.validate(valid => {
          if (valid) {
            if (this.activeEditorIndex.level === 1) {
              let bl = false
              this.level1List.map((item, m) => {
                if (item.ActivityCourseProjectTargetName === this.editorIndex.IndexManagementName &&
                  this.activeEditorIndex.index !== m) {
                  bl = true
                }
              })
              if (bl) {
                this.xy.msgError(this.editorIndex.IndexManagementName + '名称已存在')
                return false
              }
              this.level1List[this.activeEditorIndex.index].ActivityCourseProjectTargetName = this.editorIndex.IndexManagementName
            }
            if (this.activeEditorIndex.level === 2) {
              let bl2 = false
              this.level2List.map((item, m) => {
                if (item.ActivityCourseProjectTargetName === this.editorIndex.IndexManagementName &&
                  this.activeEditorIndex.index !== m) {
                  bl2 = true
                }
              })
              if (bl2) {
                this.xy.msgError(this.editorIndex.IndexManagementName + '名称已存在')
                return false
              }
              let index = this.level1List.map(item => { return item.ActivityCourseProjectTargetID }).indexOf(this.activeId1)
              this.level2List[this.activeEditorIndex.index].ActivityCourseProjectTargetName = this.editorIndex.IndexManagementName
              this.level1List[index].Childrens[this.activeEditorIndex.index].ActivityCourseProjectTargetName = this.editorIndex.IndexManagementName
            }
            if (this.activeEditorIndex.level === 3) {
              let bl3 = false
              this.level3List.map((item, m) => {
                if (item.ActivityCourseProjectTargetName === this.editorIndex.IndexManagementName &&
                  this.activeEditorIndex.index !== m) {
                  bl3 = true
                }
              })
              if (bl3) {
                this.xy.msgError(this.editorIndex.IndexManagementName + '名称已存在')
                return false
              }
              let index = this.level1List.map(item => { return item.ActivityCourseProjectTargetID }).indexOf(this.activeId1)
              let index1 = this.level1List[index].Childrens.map(item => { return item.ActivityCourseProjectTargetID }).indexOf(this.activeId2)
              this.level3List[this.activeEditorIndex.index].ActivityCourseProjectTargetName = this.editorIndex.IndexManagementName
              this.level1List[index].Childrens[index1].Childrens[this.activeEditorIndex.index].ActivityCourseProjectTargetName = this.editorIndex.IndexManagementName
            }
            this.xy.msgSuc('编辑成功。')
            this.editorIndexNameModel = false
            this.targetEdit = true
          }
        })
      },
      // 新建指标
      addIndex (data, val) {
        this.indexModal = true
        this.activeType = val
        switch (val) {
          case 1:
            this.titles = '创建一级指标'
            this.addMarkRules.IndexManagementName[1].max = 10
            this.addMarkRules.IndexManagementName[1].message = '指标名称不能超过10字符'
            break
          case 2:
            this.titles = '创建二级指标'
            this.addMarkRules.IndexManagementName[1].max = 10
            this.addMarkRules.IndexManagementName[1].message = '指标名称不能超过10字符'
            break
          case 3:
            this.titles = '创建三级指标'
            this.addMarkRules.IndexManagementName[1].max = 40
            this.addMarkRules.IndexManagementName[1].message = '指标名称不能超过40字符'
            break
        }
      },
      indexModalOk () {
        this.$refs.addMark.validate(valid => {
          if (valid) {
            if (this.activeType === 1) {
              let index = this.level1List.map(item => { return item.ActivityCourseProjectTargetName }).indexOf(this.addMark.IndexManagementName)
              if (index !== -1) {
                this.xy.msgError(this.addMark.IndexManagementName + '名称已存在。')
                return false
              }
              this.level1List.push({
                ActivityCourseProjectTargetID: this.addID,
                ActivityCourseProjectTargetName: this.addMark.IndexManagementName,
                Level: 1,
                ConversionValue: 1,
                DefaultValue: 0,
                IsLastTarget: false,
                MaxValue: 0,
                MinValue: 0,
                ParentID: 0,
                TotalScore: 0,
                Childrens: []
              })
            }
            if (this.activeType === 2) {
              let index1 = this.level2List.map(item => { return item.ActivityCourseProjectTargetName }).indexOf(this.addMark.IndexManagementName)
              if (index1 !== -1) {
                this.xy.msgError(this.addMark.IndexManagementName + '名称已存在。')
                return false
              }
              let arr2 = {
                ActivityCourseProjectTargetID: this.addID,
                ActivityCourseProjectTargetName: this.addMark.IndexManagementName,
                Level: 2,
                Childrens: [],
                ConversionValue: 1,
                DefaultValue: 0,
                IsLastTarget: false,
                MaxValue: 0,
                MinValue: 0,
                ParentID: 0,
                TotalScore: 0
              }
              this.level2List.push(arr2)
              // this.activeId2 = this.addID
              let index = this.level1List.map(item => { return item.ActivityCourseProjectTargetID }).indexOf(this.activeId1)
              if (index > -1) {
                this.level1List[index].Childrens.push(arr2)
              }
            }
            if (this.activeType === 3) {
              let index1 = this.level3List.map(item => { return item.ActivityCourseProjectTargetName }).indexOf(this.addMark.IndexManagementName)
              if (index1 !== -1) {
                this.xy.msgError(this.addMark.IndexManagementName + '名称已存在。')
                return false
              }
              let arr3 = {
                ActivityCourseProjectTargetID: this.addID,
                ActivityCourseProjectTargetName: this.addMark.IndexManagementName,
                Level: 3,
                Childrens: [],
                ConversionValue: 1,
                DefaultValue: 0,
                IsLastTarget: false,
                MaxValue: 0,
                MinValue: 0,
                ParentID: 0,
                TotalScore: 0
              }
              this.level3List.push(arr3)
              let index = this.level1List.map(item => { return item.ActivityCourseProjectTargetID }).indexOf(this.activeId1)
              if (index > -1) {
                let index1 = this.level1List[index].Childrens.map(item => { return item.ActivityCourseProjectTargetID }).indexOf(this.activeId2)
                if (index1 > -1) {
                  this.level1List[index].Childrens[index1].Childrens.push(arr3)
                }
              }
            }
            this.addID--
            this.xy.msgSuc('创建成功。')
            this.indexModal = false
            this.targetEdit = true
          }
        })
      },
      watchClose1 (val) {
        if (!val) { this.$refs.addMark.resetFields() }
      },
      watchClose2 (val) {
        if (!val) { this.$refs.editorIndex.resetFields() }
      },
      // 分值设定
      setNum () {
        if (this.scoringType === '1') {
          this.formValidate.big = 10
          this.formValidate.default = 10
        }
        if (this.scoringType === '0') {
          this.formValidate.big = 1
          this.formValidate.default = 1
          this.formValidate.conversion = 1
        }
        this.setNumModel = true
      },
      checkInput (item) {
        if (item.MinValue > item.MaxValue) {
          this.xy.msgW(`最小值不能大于最大值。`)
        } else if (item.DefaultValue > item.MaxValue) {
          this.xy.msgW(`默认值不能大于最大值。`)
        } else if ((item.DefaultValue < item.MinValue) && item.DefaultValue > 0) {
          this.xy.msgW(`默认值不能小于最小值（除0外）。`)
        }
        this.targetScoreEdit = true
      },
      checkConversionInput () {
        this.targetScoreEdit = true
      },
      ok () {
        this.$refs.formValidate.validate(valid => {
          if (valid) {
            if (this.formValidate.small > this.formValidate.big) {
              this.xy.msgW(`最小值不能大于最大值。`)
              return
            }
            if (this.formValidate.default > this.formValidate.big) {
              this.xy.msgW(`默认值不能大于最大值。`)
              return
            } if ((this.formValidate.default < this.formValidate.small) && this.formValidate.default > 0) {
              this.xy.msgW(`默认值不能小于最小值（除0外）。`)
              return
            }
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
            this.targetScoreEdit = true
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
          if (index !== undefined) {
            this.currentItem = index
          }
          this.activeId1 = item.ActivityCourseProjectTargetID
          if (item.Childrens && item.Childrens.length > 0) {
            this.level2List = item.Childrens.concat([])
            this.activeId2 = this.level2List[0].ActivityCourseProjectTargetID
            if (this.level2List[0].Childrens && this.level2List[0].Childrens.length > 0) {
              this.level3List = this.level2List[0].Childrens.concat([])
              this.activeId3 = this.level3List[0].ActivityCourseProjectTargetID
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
        } else if (val === 2) {
          this.activeId2 = item.ActivityCourseProjectTargetID
          if (item.Childrens && item.Childrens.length > 0) {
            this.level3List = item.Childrens.concat([])
            this.activeId3 = item.Childrens[0].ActivityCourseProjectTargetID
          } else {
            this.level3List = []
            this.activeId3 = ''
          }
        } else if (val === 3) {
          this.activeId3 = item.ActivityCourseProjectTargetID
        }
      },
      checkVal (val) {
        for (let i = 0; i < val.length; i++) {
          let item = val[i]
          if (!item.Childrens || item.Childrens.length === 0) {
            if (item.MinValue > item.MaxValue) {
              this.xy.msgW(`指标："${item.ActivityCourseProjectTargetName}"，最小值不能大于最大值。`)
              return false
            } else if (item.DefaultValue > item.MaxValue) {
              this.xy.msgW(`指标："${item.ActivityCourseProjectTargetName}"，默认值不能大于最大值。`)
              return false
            } else if ((item.DefaultValue < item.MinValue) && item.DefaultValue > 0) {
              this.xy.msgW(`指标："${item.ActivityCourseProjectTargetName}"，默认值不能小于最小值（除0外）。`)
              return false
            }
          } else if (item.Childrens.length > 0) {
            if (!this.checkVal(item.Childrens)) {
              return false
            }
          }
        }
        return true
      },
      // 保存
      save () {
        if (this.StepsHeader.rowObj.IsEnable === 1 || this.level1List.length === 0) {
          return false
        }
        if (!this.checkVal(this.level1List)) {
          return false
        }
        let index = 0
        if (this.indicator === -1) {
          index = this.indicatorList.map(item => { return item.id }).indexOf(-1)
        } else {
          index = this.indicatorList.map(item => { return item.id }).indexOf(this.indicatorID)
        }
        // this.targetEdit = this.$store.state.evaluate.activityObj.ActivityCourseTemplateID > 0
        // let index = this.indicatorList.map(item => { return item.ActivityCourseTargetDropDownID }).indexOf(this.indicatorID)
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/ActivityCourseProjectTarget/CreateProjectTarget`, {
          ActivityCourseProjectID: this.$parent.rowObj.ActivityCourseProjectID,
          ActivityCourseTypeID: this.indicatorID,
          ActivityCourseTypeName: index > -1 ? this.indicatorList[index].ActivityCourseTargetDropDownType.toString() : '',
          TargetEdit: this.targetEdit,
          TargetScoreEdit: this.targetScoreEdit,
          ActivityCourseScoreType: this.scoringType,
          TargetData: this.level1List
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.$store.state.evaluate.activityObj.ActivityCourseScoreType = this.scoringType
            this.$store.state.evaluate.activityObj.ActivityCourseTemplateID = this.indicatorID
            this.$store.state.evaluate.activityObj.ActivityCourseTemplateType = index > -1 ? this.indicatorList[index].ActivityCourseTargetDropDownType.toString() : ''
            this.getTargetDropDownList()
          }
        })
      }
    }

  }
</script>
<style lang="less" scoped>
.start{
  margin-right:20px;
}
.font14{
 font-size:14px;
 margin: 0 5px;
 visibility: hidden;
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
      margin: 0 5px;
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
      .content-left{
        min-width: 200px;
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
            background:rgba(65,150,255,1);
            color:#fff;
            padding:0 10px 0px;
            span{
              margin-left: 10px;
            }
          }
          .index-level-content{
            min-height: 540px;
            max-height: 700px;
            overflow-y: auto;
            border-right: 1px solid #F4F5F7;
            .index-list{
              li{
                cursor: pointer;
                border-bottom: 1px solid #e8e8e8;
                padding: 10px;
                padding-top: 20px;
                &:hover{
                  .font14{
                    visibility: visible;
                  }
                }
                .index-point{
                  width:10px;
                  height:10px;
                  background:rgba(213,213,213,1);
                  border-radius:5px;
                  margin-right: 10px;
                }
                // /deep/ .ivu-tooltip{
                //   width:150px;
                // }
                .index-name{
                  display: inline-block;
                  // width: 90%;
                  // white-space: nowrap;
                  // overflow: hidden;
                  // text-overflow: ellipsis;
                  // vertical-align: top;
                  max-width: 230px;
                  min-width: 150px;
                  word-break: break-all;
                }
                .more{
                  margin-right:16px;
                  margin-left:10px;
                  width:230px;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
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
                background:#E7F2FF;
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
      text-align: right;
      button {
        margin-right: 20px;
      }
    }
  }
}

</style>
