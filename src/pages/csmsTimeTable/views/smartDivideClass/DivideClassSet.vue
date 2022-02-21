<!-- 3.分班设置 -->
<template>
  <div class="divide-class">
    <Tabs v-model="tabName"
          :animated='false'
          @on-click='changeTab'
          class="whole-set">
      <TabPane label="自动分班设置"
               name="set">
        <div>
          <div class="divide-cell">
            <div class="cell-left">学考结束科目</div>
            <ul class="cell-right">
              <li class="cell-right-li subject-add"
                  :class="smartDivideStepsHeader.isOperation !== 0?'end-subject-disabled':' end-subject-add'"
                  @click="addEndSubject">
                <Icon type="ios-add"
                      size="18" />
                <span>添加</span>
              </li>
              <li class="cell-right-li end-subject"
                  v-for="(endCourse,index) in examinationEnd.Discipline"
                  :key="index">
                <span>{{endCourse.DisciplineName}}</span>
                <Icon type="ios-close"
                      size="18"
                      style="cursor:pointer"
                      @click="delEndSubject(endCourse)" />
              </li>
            </ul>
          </div>
          <div class="divide-cell">
            <span class="cell-left require"
                  :class="error.strategy?'error-tip':''">分班策略</span>

            <ul class="cell-right">
              <Checkbox v-model="ruleExtendInfo.FixThree"
                        class="lable-width">定三</Checkbox>
              <Checkbox v-model="ruleExtendInfo.FixTwo"
                        class="lable-width">定二</Checkbox>
              <Checkbox v-model="ruleExtendInfo.FixOne"
                        class="lable-width">定一</Checkbox>
            </ul>
          </div>
          <div class="divide-cell">
            <span class="cell-left">优先固定</span>
            <ul class="cell-right">
              <template v-for="(pf,index) in priorityFixed.Discipline">

                <Checkbox v-model="pf.IsSelection"
                          :key="index"
                          class="lable-width">{{pf.DisciplineName}}</Checkbox>
              </template>
            </ul>
          </div>
          <div class="divide-cell xy-flex">
            <span class="cell-left">成绩均衡</span>
            <div style="margin-left: 12px;">
              <radio-group v-model="achievement.DisciplineSetting"
                           @on-change='achievementChange()'>
                <radio label="1">所有科目总分均衡</radio>
                <radio label="2">学生选科总分均衡</radio>
                <radio label="3">下方勾选科目总分均衡</radio>
              </radio-group>
              <checkbox-group v-if="achievement.DisciplineSetting == 3"
                              v-model="checkedSetCourse"
                              @on-change='setCrouseSubmit()'>
                <checkbox v-for="(item,index) in setCourseData"
                          :label="JSON.stringify(item)"
                          :key='index'
                          style="margin-top:15px;width: 68px;">
                  {{item.DisciplineName}}
                </checkbox>
              </checkbox-group>
            </div>
          </div>
          <div class="divide-cell">
            <span class="cell-left">其他规则</span>
            <ul class="cell-right">
              <Checkbox v-model="ruleExtendInfo.OriginalStudentTogether"
                        class="lable-width">原行政班学生集中</Checkbox>
              <Checkbox v-model="ruleExtendInfo.MenAndWomenBalance"
                        class="lable-width">男女均衡</Checkbox>
            </ul>
          </div>
          <div class="divide-cell xy-flex">
            <span class="cell-left require"
                  :class="error.limit?'error-tip':''">分班限制</span>
            <ul class="xy-flex"
                style='flex-direction: column; margin-left: 12px;'>
              <li class="xy-flex"
                  style='flex-direction: row;'
                  v-for="(item,zIndex) in classLimitData"
                  :key="zIndex">
                <span class="zone-name"
                      :title='item.AreaName'
                      v-if='classLimitData.length>1'> {{item.AreaName}}</span>
                <Form label-position="right"
                      :label-width="90"
                      inline>
                  <FormItem label="班级人数"
                            class="margin-b">
                    <input-number :min="1"
                                  v-model="item.CollectionMinimum"
                                  :parser="value => value.replace('.', '')"
                                  style="width:100px;"></input-number>
                    <span style="color:#D9D9D9;margin:0 8px">—</span>
                    <input-number :min="1"
                                  v-model="item.CollectionMaximum"
                                  :parser="value => value.replace('.', '')"
                                  style="width:100px;"></input-number>
                  </FormItem>
                  <FormItem label="开班数量"
                            class="margin-b">
                    <input-number :min="1"
                                  v-model="item.CollectionNumber"
                                  :parser="value => value.replace('.', '')"
                                  style="width:100px;"></input-number>
                  </FormItem>
                </Form>
              </li>
            </ul>
          </div>
        </div>
      </TabPane>
      <TabPane label="预分班级" class="tab-divide"
               name="divide">
        <div v-for="(zone,zIndex) in zoneData"
             :key="zIndex"
             class="zone-info">
          <div class="zone-head clearfix">
            <span class="name fl"
                  v-if='zoneData.length>1'> {{zone.AreaName}}({{zone.PersonNumber}}人)</span>
            <span class="name fl"
                  v-else>总人数：({{zone.PersonNumber}}人)</span>
            <Button class="xy-danger fl"
                    @click="delAllClass(zone,zIndex)"
                    :disabled='smartDivideStepsHeader.isOperation !== 0||zone.classList.length===0'
                    size="small">清除全部班级</Button>
            <span class="fr expand-btn"
                  @click="expandFun(zone,zIndex)">{{zone.expand?'收起':'展开'}}
              <Icon type="ios-arrow-down"
                    :class="zone.expand?'close-arrow':'expand-arrow'" />
            </span>
          </div>
          <div>
            <div class="pre-divide"
                 v-if='zone.OneDisciplineInfo.length>0'>
              <div class="pre-divide-type">一科：</div>
              <ul class="pre-divide-ul">
                <li class="pre-divide-ul-li"
                    v-for="(one,index) in zone.OneDisciplineInfo"
                    :key="index">
                  <Tooltip placement="top-start"
                           v-if='one.DisciplineGroupInfo&&one.DisciplineGroupInfo.length>0'>
                    <div slot="content">
                      <p v-for='(citem,cindex) in one.DisciplineGroupInfo'
                         :key='cindex'>{{citem.Discipline}}&nbsp;{{citem.Count}}人</p>
                    </div>
                    <span class="li-subject">{{one.DisciplineName}}（{{one.Count}}人）</span>
                  </Tooltip>
                  <span class="li-subject"
                        v-else>{{one.DisciplineName}}（{{one.Count}}人）</span>

                  <span class="li-divide-btn"
                        :class="smartDivideStepsHeader.isOperation !== 0?'disabled-color':''"
                        @click="divedeClass(one,zone,zIndex)">分班</span>
                </li>
              </ul>
            </div>
            <div class="pre-divide"
                 v-if='zone.TwoDisciplineInfo.length>0'>
              <div class="pre-divide-type">二科：</div>
              <ul class="pre-divide-ul">
                <li class="pre-divide-ul-li"
                    v-for="(two,index) in zone.TwoDisciplineInfo"
                    :key='index'>
                  <Tooltip placement="top-start"
                           v-if='two.DisciplineGroupInfo&&two.DisciplineGroupInfo.length>0'>
                    <div slot="content">
                      <p v-for='(citem,cindex) in two.DisciplineGroupInfo'
                         :key='cindex'>{{citem.Discipline}}&nbsp;{{citem.Count}}人</p>
                    </div>
                    <span class="li-subject">{{two.DisciplineName}}（{{two.Count}}人）</span>
                  </Tooltip>
                  <span class="li-subject"
                        v-else>{{two.DisciplineName}}（{{two.Count}}人）</span>
                  <span class="li-divide-btn"
                        :class="smartDivideStepsHeader.isOperation !== 0?'disabled-color':''"
                        @click="divedeClass(two,zone,zIndex)">分班</span>
                </li>
              </ul>
            </div>
            <div :class="zone.expand?'expand':'close'">
              <div class="pre-divide"
                   v-if='zone.ThreeDisciplineInfo.length>0'>
                <div class="pre-divide-type">三科：</div>
                <ul class="pre-divide-ul">
                  <li class="pre-divide-ul-li"
                      v-for="(three,index) in zone.ThreeDisciplineInfo"
                      :key="index">
                    <Tooltip placement="top-start"
                             v-if='three.DisciplineGroupInfo&&three.DisciplineGroupInfo.length>0'>
                      <div slot="content">
                        <p v-for='(citem) in three.DisciplineGroupInfo'
                           :key='JSON.stringify(citem)'>{{citem.Discipline}}&nbsp;{{citem.Count}}人</p>
                      </div>
                      <span class="li-subject">{{three.DisciplineName}}（{{three.Count}}人）</span>
                    </Tooltip>
                    <span class="li-subject"
                          v-else>{{three.DisciplineName}}（{{three.Count}}人）</span>
                    <span class="li-divide-btn"
                          :class="smartDivideStepsHeader.isOperation !== 0?'disabled-color':''"
                          @click="divedeClass(three,zone,zIndex)">分班</span>
                  </li>
                </ul>
              </div>
              <!-- 班级 -->
              <ul v-if='zone.classList.length>0'
                  class="zone-class-ul"
                  ref="zone">
                <li class="zone-class-li"
                    v-for="(item,index) in zone.classList"
                    :key="index">
                  <div style="height:136px;padding:24px 18px 24px 24px">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <div>
                        <img src="@/assets/csmsTimeTable/smartDivideClass1.png"
                             style="width:22px;margin-right:12px" />
                        <span style="font-weight:bold;font-size:16px;color:rgba(0,0,0,0.85);">{{item.CollectionName}}</span>
                        <span style="margin-left:10px;color:rgba(0,0,0,0.45);">{{item.PersonNumber}}人</span>
                      </div>
                      <div>
                        <span style="color:rgba(0,0,0,0.45);"
                              v-if='item.SelectDiscipline.length>0'>定{{subjectNum[item.SelectDiscipline.length]}}</span>
                        <span style="color:rgba(0,0,0,0.45);margin:0 4px;">|</span>
                        <span style="color:rgba(0,0,0,0.45);">预分</span>
                      </div>
                    </div>
                    <div style="color:rgba(0,0,0,0.45);margin:14px 0 0 34px">
                      <span> 选考:</span>
                      <span v-for="(academic,aIndex) in item.SelectDiscipline"
                            :key='aIndex'>
                        {{academic.DisciplineName}}
                        <span v-if="(aIndex+1)<item.SelectDiscipline.length">/</span>
                      </span>
                    </div>
                      <div style="color:rgba(0,0,0,0.45);margin:14px 0 0 34px">
                      <span> 学考:</span>
                      <span v-for="(select,sIndex) in item.AcademicDiscipline"
                            :key='sIndex'>
                        {{select.DisciplineName}}
                        <span v-if="(sIndex+1)<item.AcademicDiscipline.length">/</span>
                      </span>
                    </div>
                  </div>
                  <div class="class-li-fotter">
                    <div class="li-fotter-btn"
                         :class="smartDivideStepsHeader.isOperation !== 0?'disabled-color':''"
                         @click="editName(zone,zIndex,item)">
                      <Icon type="md-create" />
                      <span>编辑</span>
                    </div>
                    <div class="li-fotter-btn"
                         :class="smartDivideStepsHeader.isOperation !== 0?'disabled-color':''"
                         @click="delClass(zone,zIndex,item)">
                      <Icon type="ios-trash-outline"
                            size="18" />
                      <span>删除</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div v-if='!zone.classList.length&&zone.expand'
                 class="text-center" style='padding-bottom:10px'>暂无班级信息。</div>
          </div>

        </div>
      </TabPane>
    </Tabs>

    <div class="divide-class-fotter">
      <Button class="xy-btn-primary"
              shape="circle"
              :disabled="smartDivideStepsHeader.isOperation !== 0||tabName==='divide'"
              @click="divideSetSubmit">保存</Button>
    </div>

    <!-- 学考结束科目 -->
    <modal v-model="endCourseModal"
           :transfer="false"
           title="学考结束科目"
           :mask-closable="false"
           width=400>
      <div style="height:206px;">
        <p style="margin-bottom:15px;">勾选已经学考结束的科目</p>
        <checkbox-group v-model="checkedEndCourse"
                        style="height:150px">
          <checkbox class="end-crouse-checkbox"
                    v-for="(item,index) in endCourse"
                    :label="JSON.stringify(item)"
                    :key="index">
            {{item.DisciplineName}}
          </checkbox>
        </checkbox-group>
        <p style="color:rgba(0,0,0,0.65);">提示：此处操作会影响后面的分班，请勿随意变更。</p>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="endCourseModal = false">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="endCourseSubmit">确定</Button>
      </div>
    </modal>
    <!-- 创建班级 -->
    <modal v-model="creatClassModal"
           :transfer="false"
           title="创建班级"
           :mask-closable="false"
           width=400>
      <div style="height:200px;">
        <Form label-position="left"
              :label-width="100">
          <FormItem label="待分班人数:"
                    class="margin-b">
            <Select v-model="createClassFrom.divideClassId"
                    placeholder="请选择待分班人数"
                    style="width: 216px">
              <Option v-for="item in divideClassData"
                      :value="item.val"
                      :key="item.val">{{ item.Count }}人（{{ item.Discipline }}）</Option>
            </Select>
          </FormItem>
          <FormItem label="分班数量:"
                    label-for='divideClassNum'
                    class="margin-b"
                    :class="error.divideClassNum?'error-tip':''">
            <!-- :max="creatObj.CollectionNumber||1"
                      :disabled="!creatObj.CollectionNumber" -->
            <input-number :min="1"
                          element-id='divideClassNum'
                          v-model="createClassFrom.divideClassNum"
                          :parser="value => value.replace('.', '')"
                          placeholder="请输入分班数量"
                          style="width: 216px"></input-number>
          </FormItem>
          <FormItem label="班级人数："
                    label-for='minClassNum1'
                    class="margin-b"
                    :class="error.classPeople?'error-tip':''">
            <!-- :max="creatObj.CollectionMaximum||1" -->
            <input-number :min="1"
                          v-model="createClassFrom.minClassNum"
                          :parser="value => value.replace('.', '')"
                          element-id='minClassNum1'
                          style="width:100px;"></input-number>
            <span style="color:#D9D9D9">—</span>
            <!-- :max="creatObj.CollectionMaximum||1" -->
            <input-number :min="1"
                          v-model="createClassFrom.maxClassNum"
                          :parser="value => value.replace('.', '')"
                          style="width:100px;"></input-number>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="creatClassModal = false">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="creatClassSubmit">确定</Button>
      </div>
    </modal>
    <!-- 编辑班名 -->
    <modal v-model="editNameModal"
           :transfer="false"
           title="编辑"
           :mask-closable="false"
           width=550>
      <div>
        <Form label-position="left"
              :label-width="80">
          <FormItem label="班级名称:"
                    label-for='CollectionName'
                    class="margin-b">
            <i-input v-model="editObj.CollectionName"
                     clearable
                     element-id='CollectionName'
                     style="width: 350px"
                     placeholder="请输入班级名称"></i-input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="editNameModal = false">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="editNameSubmit">确定</Button>
      </div>
    </modal>
  </div>

</template>

<script>
  export default {
    components: {},
    data () {
      return {
        subjectNum: ['', '一', '二', '三'],
        tabName: 'set',
        examinationEnd: { Discipline: [] }, // 学考结束科目
        ruleExtendInfo: {}, // 分班策略、其他规则
        priorityFixed: { Discipline: [] }, // 优先固定
        achievement: { Discipline: [] }, // 成绩
        classLimitData: [], // 分班限制
        // 分区
        zoneData: [],
        // 学考结束科目
        endCourseModal: false,
        endCourse: [],
        checkedEndCourse: [],
        // 创建班级
        creatClassModal: false,
        creatObj: '',
        divideClassData: [], // 创建班级的待分班人数下拉框
        createClassFrom: {
          divideClassId: -1,
          divideClassNum: null,
          minClassNum: null,
          maxClassNum: null
        },

        // 设置依据科目
        setCrouseModal: false,
        setCrouseRadio: '0',
        setCourseData: [],
        checkedSetCourse: [],
        // 编辑班名
        editNameModal: false,
        editObj: '',
        // 必填选项
        error: {
          strategy: false, // 分班策略
          limit: false, // 分班限制
          divideClassNum: false,
          classPeople: false
        },
        smartDivideStepsHeader: {}
      }
    },

    created () {
      this.smartDivideStepsHeader = this.$parent
      this.getDivideClassSetting()
      this.getClassLimit()
    },
    mounted () {

    },
    methods: {
      // 获取自动分班设置
      async getDivideClassSetting () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetDivideClassCollectionSetting`, {
          divideClassID: this.smartDivideStepsHeader.divideClassID
        })
        if (res.success) {
          let resData = res.data
          this.examinationEnd = resData.ExaminationEnd
          this.ruleExtendInfo = resData.RuleExtendInfo
          this.priorityFixed = resData.FirstFix
          this.achievement = resData.DivideClassAchievement
          this.achievement.Type = this.achievement.Type.toString()
          this.achievement.DisciplineSetting = this.achievement.DisciplineSetting.toString()
          if (this.achievement.DisciplineSetting === '3') {
            this.setGist()
          }
        }
        this.xy.unloading()
      },
      // 分区列表
      async getClassLimit () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetAreaInfo`, {
          divideClassID: this.smartDivideStepsHeader.divideClassID
        })
        if (res.success) {
          this.classLimitData = res.data
        }
        this.xy.unloading()
      },
      // 学考结束科目
      async addEndSubject () {
        if (this.smartDivideStepsHeader.isOperation !== 0) {
          return false
        }
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetSelectionCourseplan`, {
          divideClassID: this.smartDivideStepsHeader.divideClassID
        })
        if (res.success) {
          this.endCourse = res.data
          this.checkedEndCourse = []
          if (this.examinationEnd.Discipline.length > 0) {
            let arr = []
            this.examinationEnd.Discipline.map(item => arr.push(JSON.stringify(item)))
            this.checkedEndCourse = arr
          }

          this.endCourseModal = true
        }
        this.xy.unloading()
      },
      endCourseSubmit () {
        if (this.checkedEndCourse.length > 0) {
          let arr = []
          this.checkedEndCourse.map(item => arr.push(JSON.parse(item)))
          this.examinationEnd.Discipline = arr
        }
        this.endCourseModal = false
      },
      delEndSubject (val) {
        this.examinationEnd.Discipline = this.examinationEnd.Discipline.filter(item => item.DisciplineID !== val.DisciplineID)
        console.log(this.examinationEnd.Discipline)
      },
      achievementChange () {
        if (this.achievement.DisciplineSetting === '3') {
          this.setGist()
        }
      },
      // 设置依据科目
      async setGist () {
        if (this.smartDivideStepsHeader.isOperation !== 0) {
          return false
        }
        this.checkedSetCourse = []
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetSelectionCourseplan`, {
          divideClassID: this.smartDivideStepsHeader.divideClassID
        })
        if (res.success) {
          this.setCourseData = res.data || []
          if (this.achievement.Discipline && this.achievement.Discipline.length > 0) {
            this.checkedSetCourse = this.achievement.Discipline.map(item => JSON.stringify(item))
          }
        // this.checkedSetCourse = this.achievement.Discipline
        // this.setCrouseModal = true
        }
        this.xy.unloading()
      },
      setCrouseSubmit () {
        this.achievement.Discipline = []
        if (this.checkedSetCourse.length > 0) {
          this.achievement.Discipline = this.checkedSetCourse.map(item => JSON.parse(item))
        }
      // console.log(this.achievement.Discipline)
      // this.achievement.Discipline = this.checkedSetCourse
      // this.setCrouseModal = false
      },
      // 获取分区列表
      async getAreaInfo (index = 0) {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetBeforehandDivideClassAreaInfo`, {
          divideClassID: this.smartDivideStepsHeader.divideClassID
        })
        if (res.success) {
          this.zoneData = res.data || []
          this.zoneData.map((item, cindex) => {
            this.$set(item, 'expand', cindex === index)
            this.$set(item, 'classList', [])
            return item
          })
          if (res.data.length > 0) {
            this.getClassList(res.data[index].DivideAreaID, index)
          }

          console.log(this.zoneData)
        }
        this.xy.unloading()
      },
      // 获取分区下预分班列表
      async getClassList (val, index) {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetDivideClassAreaCollection`, {
          divideAreaID: val
        })
        if (res.success) {
          this.zoneData[index].classList = res.data
        // this.$nextTick(() => {
        //   let h = this.$refs.zone[0].offsetHeight
        //   if (h) {
        //     this.$refs.zone[0].style.maxHeight = h + 'px'
        //     this.zoneData[0].h = h
        //   }
        // })
        }
        this.xy.unloading()
      },

      // 创建班级
      divedeClass (val, zone, zIndex) {
        if (this.smartDivideStepsHeader.isOperation !== 0) {
          return false
        }
        this.error.divideClassNum = false
        this.error.classPeople = false
        this.creatObj = {}
        // 设置分班数量、班级人数可输入的最大/小值
        this.classLimitData.map(item => {
          if (item.DivideAreaID === zone.DivideAreaID) {
            this.creatObj = {
              // DivideAreaID: item.DivideAreaID,
              zIndex: zIndex,
              CollectionMaximum: item.CollectionMaximum,
              CollectionMinimum: item.CollectionMinimum,
              CollectionNumber: item.CollectionNumber
            }
          }
        })
        // console.log(val, zone)
        // 默认选中第一个
        this.creatClassModal = true
        this.createClassFrom = {
          DivideAreaID: zone.DivideAreaID,
          divideClassId: -1,
          divideClassNum: null,
          minClassNum: null,
          maxClassNum: null
        }
        this.divideClassData = val.DisciplineGroupInfo.map((item, index) => {
          item.val = item.DisciplineID.join(',')
          if (index === 0) {
            this.createClassFrom.divideClassId = item.val
          }
          return item
        })
      // this.divideClassData = val.DisciplineGroupInfo || []
      },
      async creatClassSubmit () {
        let min = this.createClassFrom.minClassNum
        let max = this.createClassFrom.maxClassNum
        this.error.divideClassNum = !this.createClassFrom.divideClassNum
        this.error.classPeople = !(min && max && min <= max)
        if (this.error.divideClassNum && this.error.divideClassNum) {
          return this.xy.msgError('请填写分班数量和班级人数。')
        } else if (!this.createClassFrom.divideClassNum) {
          return this.xy.msgError('请填写分班数量。')
        } else if (!min || !max) {
          this.error.classPeople = true
          return this.xy.msgError('请填写分班人数。')
        } else if (min > max) {
          this.error.classPeople = true
          return this.xy.msgError('分班人数起始值不能大于结束值。')
        }
        let ids = this.createClassFrom.divideClassId.split(',').map(Number)

        let param = {
          DivideClassID: this.smartDivideStepsHeader.divideClassID,
          DivideAreaID: this.createClassFrom.DivideAreaID,
          CollectionNumber: this.createClassFrom.divideClassNum,
          MaxPersonNumber: this.createClassFrom.maxClassNum,
          PersonNumber: this.createClassFrom.minClassNum,
          Discipline: ids
        }
        // console.log(param)
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/CreateDivideClassAreaCollection`, param)
        if (res.success) {
          // debugger
          this.xy.msgSuc('分班成功。')
          this.creatClassModal = false
          this.getAreaInfo(this.creatObj.zIndex)
        }
        this.xy.unloading()
      },
      // 编辑班名
      editName (zone, zIndex, val) {
        if (this.smartDivideStepsHeader.isOperation !== 0) {
          return false
        }
        Object.assign(val, { index: zIndex, DivideAreaID: zone.DivideAreaID })
        this.editObj = JSON.parse(JSON.stringify(val))
        this.editNameModal = true
      },
      async editNameSubmit () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/EditDivideClassCollectionName`, {
          divideCollectionID: this.editObj.DivideCollectionID,
          name: this.editObj.CollectionName,
          DivideClassID: this.smartDivideStepsHeader.divideClassID
        })
        if (res.success) {
          this.xy.msgSuc('编辑成功。')
          this.editNameModal = false
          this.getClassList(this.editObj.DivideAreaID, this.editObj.index)
        }
        this.xy.unloading()
      },
      // 删除班级
      delClass (zone, zIndex, val) {
        if (this.smartDivideStepsHeader.isOperation !== 0) {
          return false
        }
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除"' + val.CollectionName + '"吗？',
          onOk: () => {
            this.xy.loading()
            this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/DeleteDivideClassCollection`, {
              divideCollectionID: val.DivideCollectionID
            }).then(res => {
              if (res.success) {
                this.xy.msgSuc('删除成功。')
                this.getAreaInfo(zIndex)

              // this.getClassList(zone.DivideAreaID, zIndex)
              }
            })
            this.xy.unloading()
          }
        })
      },
      delAllClass (val, zIndex) {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '确认清除所有分班吗？',
          onOk: () => {
            this.xy.loading()
            this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/ClearDivideClassCollection`, {
              DivideAreaID: val.DivideAreaID
            }).then(res => {
              if (res.success) {
                this.xy.msgSuc('删除成功。')
                this.getAreaInfo(zIndex)
              }
            })
            this.xy.unloading()
          }
        })
      },
      // 分区整体保存
      divideSetSubmit () {
        // debugger
        let status = this.ruleExtendInfo.FixThree || this.ruleExtendInfo.FixTwo || this.ruleExtendInfo.FixOne
        this.error.strategy = !status
        if (!status) {
          return this.xy.msgError('请勾选分班策略。')
        }
        let divideAreaInfo = []
        for (let i = 0; i < this.classLimitData.length; i++) {
          let item = this.classLimitData[i]
          if (!item.CollectionMinimum) {
            this.error.limit = true
            return this.xy.msgError('请填写班级人数起始值。')
          } else if (!item.CollectionMaximum) {
            this.error.limit = true
            return this.xy.msgError('请填写班级人数结束值。')
          } else if (item.CollectionMinimum > item.CollectionMaximum) {
            this.error.limit = true
            return this.xy.msgError('班级人数起始值不能大于等于结束值。')
          } else if (!item.CollectionNumber) {
            this.error.limit = true
            return this.xy.msgError('请填写开班数量。')
          }
          divideAreaInfo.push({
            DivideAreaID: item.DivideAreaID,
            CollectionMinimum: item.CollectionMinimum,
            CollectionMaximum: item.CollectionMaximum,
            CollectionNumber: item.CollectionNumber
          })
        }
        this.error.strategy = false
        this.error.limit = false
        // console.log(divideAreaInfo)
        this.takeEffect(true, divideAreaInfo)
      },
      async takeEffect (val, divideAreaInfo) {
        let postData = {}
        let endCourseIDs = []
        endCourseIDs = this.examinationEnd.Discipline.map(item => item.DisciplineID)
        let fixIDs = []
        this.priorityFixed.Discipline.map((item) => {
          if (item.IsSelection) {
            fixIDs.push(item.DisciplineID)
          }
        })
        let achievementIDs = []
        if (this.achievement.DisciplineSetting === '3') {
          achievementIDs = this.achievement.Discipline.map(item => item.DisciplineID)
        }
        if (val) { // 生效
          postData = {
            DivideClassID: this.smartDivideStepsHeader.divideClassID,
            ExaminationEndDisciplineIDs: endCourseIDs,
            FirstFixDisciplineIDs: fixIDs,
            DivideClassAchievement: {
              DisciplineIDs: achievementIDs,
              Type: parseInt(this.achievement.Type),
              DisciplineSetting: parseInt(this.achievement.DisciplineSetting)
            },
            DivideClassRuleExtend: {
              DivideClassID: this.smartDivideStepsHeader.divideClassID,
              FixThree: this.ruleExtendInfo.FixThree,
              FixTwo: this.ruleExtendInfo.FixTwo,
              FixOne: this.ruleExtendInfo.FixOne,
              OriginalStudentTogether: this.ruleExtendInfo.OriginalStudentTogether,
              MenAndWomenBalance: this.ruleExtendInfo.MenAndWomenBalance
            },
            DivideAreaInfo: divideAreaInfo
          }
        } else { // 重置
          postData = {
            DivideClassID: this.smartDivideStepsHeader.divideClassID,
            ExaminationEndDisciplineIDs: [],
            FirstFixDisciplineIDs: [],
            DivideClassAchievement: {
              DisciplineIDs: [],
              Type: 0,
              DisciplineSetting: 1
            },
            DivideClassRuleExtend: {
              DivideClassID: this.smartDivideStepsHeader.divideClassID,
              FixThree: true,
              FixTwo: true,
              FixOne: true,
              OriginalStudentTogether: true,
              MenAndWomenBalance: true
            },
            DivideAreaInfo: divideAreaInfo
          }
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/EditDivideClassCollectionSetting`, postData)
        if (res.success) {
          this.xy.msgSuc('设置成功。')
          this.smartDivideStepsHeader.getGeneralFlows()
          this.getDivideClassSetting()
        }
        this.xy.unloading()
      },
      expandFun (val, index) {
        this.zoneData[index].expand = !this.zoneData[index].expand
        if (this.zoneData[index].expand) {
          this.getClassList(val.DivideAreaID, index)
        }
      // 设置展开时的最大高度
      // this.$nextTick(() => {
      //   if (!this.zoneData[index].expand) {
      //     this.$refs.zone[index].style.maxHeight = ''
      //     return
      //   }
      //   let h = this.$refs.zone[index].offsetHeight
      //   if (h) {
      //     this.$refs.zone[index].style.maxHeight = h + 'px'
      //     this.zoneData[index].h = h
      //   } else if (val.h) {
      //     this.$refs.zone[index].style.maxHeight = val.h + 'px'
      //   }
      // })
      },
      changeTab (name) {
        this.tabName = name
        if (name === 'divide') {
          this.getAreaInfo()
        }
      }
    }
  }
</script>
<style lang='less' scoped>
.whole-set {
  background: #fff;
  padding-bottom: 18px;
  border-bottom: 1px solid #e9e9e9;
  min-height: 550px;
}
.set-title {
  height: 55px;
  line-height: 55px;
  padding-left: 32px;
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  border-bottom: 1px solid #e9e9e9;
}
.divide-cell {
  padding: 8px 0;
}
.cell-left {
  width: 120px;
  text-align: right;
  font-weight: 400;
  color: #000;
  display: inline-block;
}
.cell-right {
  display: inline-block;
  margin-left: 12px;
  .lable-width {
    min-width: 68px;
  }
}
.cell-right-li {
  display: inline-block;
}
.set-gist {
  color: #1890ff;
  vertical-align: middle;
  margin-left: 6px;
  cursor: pointer;
}
.disabled-color {
  color: #c5c8ce !important;
  cursor: default !important;
}

.end-subject {
  padding: 2px 6px;
  background: rgba(245, 245, 245, 1);
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
  margin-right: 8px;
  font-size: 12px;
}
.subject-add {
  margin-right: 8px;
}
.end-subject-add {
  padding: 2px 6px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px dashed rgba(217, 217, 217, 1);
  font-size: 12px;
  cursor: pointer;
  &:hover {
    background: #1890ff;
    color: #fff;
  }
}
.end-subject-disabled {
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px dashed rgba(217, 217, 217, 1);
  font-size: 12px;
  color: #c5c8ce;
  background-color: #f7f7f7;
  border-color: #dcdee2;
}
.class-strategy {
  margin: 0 16px;
  padding: 2px 8px;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
}
.class-strategy:first-child {
  margin-left: 0;
}
.class-strategy-active {
  background: #1890ff;
  border-radius: 4px;
  color: #fff;
}
.zone {
  margin-top: 26px;
}
.zone-li {
  display: inline-block;
  text-align: center;
  width: 88px;
  height: 40px;
  line-height: 40px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px 4px 0px 0px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  margin-left: 1px;
  cursor: pointer;
}
.zone-li:first-child {
  margin-left: 0;
}
.zone-li-active {
  background: #fff;
  color: #4196ff;
  font-weight: 500;
  border-bottom: 0;
}
.zone-info {
 background: #fff;
    margin: 0px 38px;
    border-bottom: 1px dashed #e9e9e9;
    margin-bottom: 15px;
}
.zone-info:first-child {
  padding-top: 10px;
}
.zone-info:last-child {
    border-bottom: none;
}

.pre-divide {
  display: flex;
}
.pre-divide-ul {
  width: calc(100% - 60px);
}
.pre-divide-ul-li {
  margin-right: 20px;
  display: inline-block;
  margin-bottom: 20px;
}
.pre-divide-type {
  height: 32px;
  line-height: 32px;
  width: 60px;
  text-align: right;
  color: rgba(0, 0, 0, 0.85);
}
.li-subject {
  width: 112px;
  padding: 0px 6px;
  background: #f5f5f5;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  font-size: 12px;
  height: 32px;
  line-height: 32px;
  display: inline-block;
  text-align: center;
}
.li-divide-btn {
  color: #4196ff;
  margin-left: 6px;
  font-size: 12px;
  cursor: pointer;
}
.zone-class-ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  // margin: 20px 0;
}
.zone-class-li {
  width: 316px;
  height: 184px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(233, 233, 233, 1);
  margin-right: 20px;
  margin-bottom: 20px;
  position: relative;
}
.class-li-fotter {
  position: absolute;
  bottom: 0;
  height: 48px;
  width: 100%;
  background: #f7f9fa;
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.45);
}
.li-fotter-btn {
  width: 50%;
  text-align: center;
  cursor: pointer;
}
.divide-class-fotter {
  height: 50px;
  position: fixed;
  line-height: 50px;
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
.end-crouse-checkbox {
  width: 68px;
  margin-bottom: 16px;
}
.require:before {
  content: '*';
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-size: 14px;
  color: #ed4014;
}
.require {
  height: 34px;
  line-height: 34px;
}
.zone-name {
  display: inline-block;
  line-height: 34px;
  width: 145px;
  // max-width: 120px;
  // overflow: hidden;
  // white-space: nowrap;
  // text-overflow: ellipsis;
  font-size: 14px;
  font-weight: bold;
}
.error-tip {
  // position: absolute;
  // top: 25px;
  // left: 0;
  // line-height: 1;
  // padding-top: 6px;
  color: #ed4014;
  /deep/.ivu-form-item-label {
    color: #ed4014 !important;
  }
}
.zone-head {
  margin-bottom: 25px;
  .name {
    width: 115px;
    font-size: 14px;
    color: #333333;
    margin-right: 15px;
    font-weight: bold;
  }
}
.margin-b {
  margin-bottom: 16px;
}
.expand-btn {
  font-size: 14px;
  color: #1890ff;
  cursor: pointer;
  i {
    font-size: 12px;
    color: #1890ff;
    margin-left: 5px;
    transition: all 0.6s ease-in-out;
  }
}
.close-arrow {
  transform: translateY(-15%) rotate(180deg);
}
.expand {
  overflow: hidden;
  max-height: 1000px;
  transition: all 1s ease-in-out;
}
.close {
  max-height: 0;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}
// 样式覆盖
/deep/.ivu-tooltip-popper {
  width: 112px;
}
.tab-divide{
  margin-bottom: 60px;
}
</style>
