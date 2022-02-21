<template>
  <div class="xy-content-module">
    <!-- 学生考勤-考勤设置   // 缺少面包屑 -->
    <div class="xy-content-title clearfix" v-if="titleShow">
        <Button class="xy-primary"  @click="getAttsSetting" v-if="AttStudentSettingTypeRule">规则设置</Button >
        <Button class="xy-info"  @click="getNewsSetting">消息设置</Button >
        <Button class="xy-info"  @click="scopeSetting">范围设置</Button>
    </div>
    <div class="xy-content-body" :class="titleShow?'':'table-top'">
        <!--初始loading-->
        <!-- <div v-if="isInitial" class="no-data-box isInitital-opacity">
            <img class="no-data-img" src="@/assets/common/loading.png" />
        </div> -->
        <!--暂无数据-->
        <div v-if="isEmpty && !isInitial" class="no-data-box">
            <img class="no-data-img" src="@/assets/common/nullData.svg" />
            <span class="no-data-text">
                您还没有考勤类型的信息，请添加考勤。
            </span>
        </div>
        <div v-if="!isEmpty && !isInitial">
            <div class="xy-content-table pr">
                <div class="att-flex">
                    <div class="att-flex-box cursor-p" @click="addType">
                        <div><Icon type="md-add" size="20" /><span class="att-flex-text">添加类别</span></div>
                    </div>
                    <div v-for="(item, index) in list" :key="index" class="att-flex-box-content">
                        <div class="att-flex-box-content-top">
                            <div class="att-flex-box-content-top-flex">
                                <div class="att-flex-box-content-top-flex-left" :style="{backgroundColor:item.StudentAttendanceTypeName=='正常'?'#4196FF':item.StudentAttendanceTypeName=='迟到'?'#EA6666':'#FFB748'}">
                                      <i class="iconfont">&#xe6eb;</i>
                                </div>
                                <div class="att-flex-box-content-top-flex-right">
                                    <div class="att-flex-box-content-top-flex-right-top">{{item.StudentAttendanceTypeName}}</div>
                                    <div class="att-flex-box-content-top-flex-right-bottom">{{item.TypeSourceName}}</div>
                                </div>
                            </div>
                        </div>
                        <div v-if="item.IsDefault" class="att-flex-box-content-bottom default">
                            <div><Icon type="md-create" class="att-flex-box-icon" />编辑</div>
                            <div class="att-split">|</div>
                            <div><Icon type="ios-trash-outline" size="16" class="att-flex-box-icon" />删除</div>
                        </div>
                        <div v-else class="att-flex-box-content-bottom">
                            <div class="att-flex-box-content-bottom-edit cursor-p" @click="editType(item)"><Icon type="md-create" class="att-flex-box-icon" />编辑</div>
                            <div class="att-split">|</div>
                            <div class="att-flex-box-content-bottom-del cursor-p" @click="delType(item)"><Icon type="ios-trash-outline" size="16" class="att-flex-box-icon" />删除</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <modal
          v-model="modalCreateType"
          :transfer="false"
          title="新增加考勤状态"
          :loading="loading"
          :mask-closable="false"
          >
          <div class="dialog-model-content">
              <i-form
                ref="formValidateCreate"
                :model="formValidateCreate"
                :rules="ruleValidateCreate"
                :label-width="120"
                @submit.native.prevent
                >
                <form-item label="考勤状态" labelFor="onputItem1" prop="typeName">
                    <i-input v-model.trim="formValidateCreate.typeName" elementId="onputItem1" clearable style="width: 250px">
                    </i-input>
                </form-item>
              </i-form>
          </div>
          <div slot="footer">
            <Button class="xy-modal-close" @click="creatTypeCancel">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="creatTypeOk">确定</Button>
          </div>
        </modal>
        <modal
          v-model="modalEditType"
          :transfer="false"
          title="编辑考勤类型"
          :loading="loading"
          :mask-closable="false"
          >
          <div class="dialog-model-content">
              <i-form ref="formValidateEdit" :model="formValidateEdit" :rules="ruleValidateEdit"
                  :label-width="120">
                  <form-item label="考勤类型" labelFor="onputItem2" prop="typeName">
                      <i-input v-model.trim="formValidateEdit.typeName"  elementId="onputItem2" clearable style="width: 250px"></i-input>
                  </form-item>
              </i-form>
          </div>
          <div slot="footer">
            <Button class="xy-modal-close" @click="editTypeCancel">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="editTypeOk">确定</Button>
          </div>
        </modal>

        <modal
          v-model="modalAttsSetting"
          :transfer="false"
          title="规则设置"
          :loading="loading"
          :mask-closable="false"
          >
                <div class="dialog-model-content">
                    <p style=" color: #999; padding-left: 35px;">温馨提示：</p>
                    <p style=" color: #999; padding-left: 35px;">1.只能在<strong style="font-weight: bold;">非考勤时间</strong>，进行规则设置，以免影响正在考勤的学生。</p>
                    <p style=" color: #999; padding-left: 35px;">2.时间范围均是<strong style="font-weight: bold;">以课表的上课时间为起始点。</strong></p>
                    <p style=" color: #999; padding-left: 35px;">3.迟到延后时间范围≤旷课时间范围，且二者都不能大于课程时长。</p>
                    <p style=" color: #999; padding-left: 35px;">4.迟到提前时间范围小于考勤提前开始时间范围。</p>
                    <i-form
                      ref="formValidateRuleSetting"
                      :model="formValidateRuleSetting"
                      :rules="ruleValidateRuleSetting"
                      label-position="top"
                      >
                        <form-item label="考勤时间范围：" labelFor="onputItem3" prop="OffsetBefore">
                            提前
                            <input-number
                              :min="0"
                              v-model="formValidateRuleSetting.OffsetBefore"
                              elementId="onputItem3"
                              :editable="false"
                              :precision="0"
                              style="width: 100px"
                              >
                            </input-number>
                            分钟，开始考勤。
                        </form-item>
                        <form-item v-show="formValidateRuleSetting.radio === 'delay'" label="迟到时间范围："  prop="OffsetRear">
                            <radio-group v-model="formValidateRuleSetting.radio" vertical>
                                <Radio label="delay">
                                    延后
                                    <input-number
                                      :min="0"
                                      v-model="formValidateRuleSetting.OffsetRear"
                                      :editable="false"
                                      :precision="0"
                                      style="width: 100px"
                                      >
                                    </input-number>
                                    分钟之内，不记迟到。
                                </Radio>
                                <Radio label="ahead" style="margin-top: 10px;">
                                    提前
                                    <input-number
                                      :min="0"
                                      v-model="formValidateRuleSetting.OffsetLeadTime"
                                      :editable="false"
                                      :precision="0"
                                      style="width: 100px"
                                      >
                                    </input-number>
                                    分钟之内，不记迟到。
                                </Radio>
                            </radio-group>
                        </form-item>
                        <form-item v-show="formValidateRuleSetting.radio === 'ahead'" label="迟到时间范围：" prop="OffsetLeadTime">
                            <radio-group v-model="formValidateRuleSetting.radio" vertical>
                                <Radio label="delay" >
                                    延后
                                    <input-number
                                      :min="0"
                                      v-model="formValidateRuleSetting.OffsetRear"
                                      :editable="false"
                                      :precision="0"
                                      style="width: 100px"
                                      >
                                    </input-number>
                                    分钟之内，不记迟到。
                                </Radio>
                                <Radio label="ahead" style="margin-top: 10px;">
                                    提前
                                    <input-number
                                      :min="0"
                                      v-model="formValidateRuleSetting.OffsetLeadTime"
                                      :editable="false"
                                      :precision="0"
                                      style="width: 100px"
                                      >
                                    </input-number>
                                    分钟之内，不记迟到。
                                </Radio>
                            </radio-group>
                        </form-item>
                        <form-item label="旷课时间范围：" labelFor="onputItem4" prop="OffsetAbsentee">
                            向后偏移
                            <input-number
                              :min="0"
                              v-model="formValidateRuleSetting.OffsetAbsentee"
                              elementId="onputItem4"
                              :editable="false"
                              :precision="0"
                              style="width: 100px"
                              >
                            </input-number>
                            分钟以后,记为旷课。
                        </form-item>
                        <form-item label="考勤状态修改限制：" labelFor="onputItem5" prop="HistoryChange">
                                只能修改过去
                                <input-number
                                  :min="0"
                                  v-model="formValidateRuleSetting.HistoryChange"
                                  elementId="onputItem5"
                                  :editable="false"
                                  :precision="0"
                                  style="width: 100px"
                                  >
                                </input-number>
                                天之内的考勤状态。
                            </form-item>
                    </i-form>
                </div>
                <div slot="footer">
                  <Button class="xy-modal-close" @click="attsSettingCancel">取消</Button>
                  <Button class="xy-modal-primary" shape="circle" @click="attsSettingOk">保存</Button>
                </div>
        </modal>
        <modal
          v-model="NewsSetModel"
          :transfer="false"
          title="定时发送考勤统计"
          :loading="loading"
          :mask-closable="false"
          class="window-sendStatisticsRegularly"
          >
                <div class="dialog-model-content">
                    <i-form ref="sendSRValues" :model="sendSRValues" :rules="sendSR_rulers" style="position: relative;">
                        <form-item label="定时发送考勤统计">
                            <i-switch size="large" @on-change="switchChange" v-model="sendSRValues.switchModel">
                                <span slot="open">开启</span>
                                <span slot="close">关闭</span>
                            </i-switch>
                            <tooltip word-wrap max-width="200" placement="top"
                                content="关闭后老师将不再接收考勤统计。">
                                <Icon type="md-help-circle" size="18" color="#ffad33" />
                            </tooltip>
                        </form-item>
                        <div class="sendStatisticsRegularly-item">
                            <Checkbox v-model="sendSRValues.item_everySection" label="everySection" class="fl checker" :disabled="!sendSRValues.switchModel">每节课</Checkbox>
                            <div class="sendStatisticRegularly-item-body">
                                <form-item prop="classMoment">
                                上课
                                <input-number
                                  v-model="sendSRValues.classMoment"
                                  :min="1"
                                  :max="100"
                                  :editable="true"
                                  :precision="0"
                                  style="width: 60px"
                                  :disabled="numberDisabled || !sendSRValues.switchModel || !sendSRValues.item_everySection"
                                  >
                                </input-number>
                                    分钟后，向所选教师发送所管学生的考勤统计。
                                </form-item>
                                <form-item>
                                    接收统计的人员：
                                    <Checkbox-Group v-model="sendSRValues.everySection_receiver">
                                        <Checkbox label="1" :disabled="!sendSRValues.switchModel || !sendSRValues.item_everySection" >班主任</Checkbox>
                                        <Checkbox label="2" :disabled="!sendSRValues.switchModel || !sendSRValues.item_everySection" >任课教师</Checkbox>
                                    </Checkbox-Group>
                                    <span v-show="sendSRValues.item_everySection && !everySection_hasSelected" class="ivu-form-item-error-tip">请至少选择一种接收统计的人员</span>
                                </form-item>
                            </div>
                        </div>
                        <div class="sendStatisticsRegularly-item">
                            <Checkbox v-model="sendSRValues.item_everyDay" label="everyDay" class="fl checker" :disabled="!sendSRValues.switchModel">每天</Checkbox>
                            <div class="sendStatisticRegularly-item-body">
                                <form-item prop="classTimePoint">
                                    <Time-Picker v-model="sendSRValues.classTimePoint" format="HH:mm" placeholder="请选择时间" :clearable="false" style="display:inline-block;width: 112px" :disabled="!sendSRValues.switchModel || !sendSRValues.item_everyDay"></Time-Picker>
                                ，向所选教师发送所管学生的考勤统计。
                                </form-item>
                                <form-item>
                                    接收统计的人员：
                                    <Checkbox-Group v-model="sendSRValues.everyDay_receiver">
                                        <Checkbox label="1" :disabled="!sendSRValues.switchModel || !sendSRValues.item_everyDay">班主任</Checkbox>
                                        <Checkbox label="2" :disabled="!sendSRValues.switchModel || !sendSRValues.item_everyDay">任课教师</Checkbox>
                                    </Checkbox-Group>
                                    <span v-show="sendSRValues.item_everyDay && !everyDay_hasSelected" class="ivu-form-item-error-tip">请至少选择一种接收统计的人员</span>
                                </form-item>
                            </div>
                            <span v-show="!window_sendSR_hasSelectedItem&&sendSRValues.switchModel" class="ivu-form-item-error-tip">请至少选择一种类型</span>
                        </div>
                    </i-form>
                </div>
                <div slot="footer">
                  <Button class="xy-modal-close" @click="NewsSetCancel">取消</Button>
                  <Button class="xy-modal-primary" shape="circle" @click="NewsSetOk">保存</Button>
                </div>
        </modal>
    </div>
    <!--范围设置-->
    <div v-if="showType === 'range'">
        <div class="xy-content-title clearfix">
            <i-select v-model="statusID" @on-change="typeStatusSearch" class="fr xy-content-title-search"
                style="width:200px;">
                <i-option v-cloak v-for="types in typeStatus" :value="types.value" :key="types.value">
                    {{ types.status }}
                </i-option>
            </i-select>
            <i-select v-model="schoolChangeStr" @on-change="SchoolChange" class="fr xy-content-title-search"
                style="width: 200px;">
                <i-option :value="0">所有校区</i-option> <!-- :key="01" -->
                <i-option v-for="school in venueSchool" :value="school.id" :key="school.id" v-cloak>
                    {{ school.label }}
                </i-option>
            </i-select>
        </div>
        <div class="xy-content-body">
            <div id="Tablemix"></div>
        </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'AttendanceType',
    data () {
      return {
        loading: true,
        showType: 'type',
        delId: '',
        /*
         考勤类型设置
         */
        AttStudentSettingType: true, // 类型设置
        AttStudentSettingScope: true, // 范围设置
        AttStudentSettingTypeAdd: true, // 新增考勤类型
        AttStudentSettingTypeRule: true, // 规则设置
        AttStudentSettingTypeEdit: true, // 编辑
        AttStudentSettingTypeDelete: true, // 删除
        AttStudentSettingScopeEnabled: true, // 启用
        titleShow: true,
        modalCreateType: false, // 创建考勤类型的弹框
        modalEditType: false, // 编辑考勤类型的弹框
        modalAttsSetting: false, // 规则信息弹框
        editTypeId: '', // 被编辑的考勤类型id
        enableId: '',
        columns: [
          {
            title: '类别名称',
            key: 'StudentAttendanceTypeName'
          },
          {
            title: '类别来源',
            key: 'AttFrom',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: params.row.TypeSourceName
                  }
                })
              ])
            }
          },
          {
            title: '操作',
            key: 'operation',
            width: 200,
            className: 'table-info-column',
            render: (h, params) => {
              return h('div', [
                params.row.AttStudentSettingTypeEdit ? h('Icon', {
                  props: {
                    type: 'md-create',
                    custom: !params.row.IsDefault ? 'xy-table-btn xy-table-hover' : 'xy-table-btn xy-table-hover xy-table-disabled'
                  },
                  attrs: {
                    title: '编辑'
                  },
                  on: {
                    click: function () {
                      if (!params.row.IsDefault) {
                        this.editType(params.row)
                      }
                    }
                  }
                }) : '',
                params.row.AttStudentSettingTypeDelete ? h('Icon', {
                  props: {
                    type: 'ios-trash',
                    custom: !params.row.IsDefault && !params.row._disabled ? 'xy-table-del-btn xy-table-del-hover' : 'xy-table-del-btn xy-table-del-hover xy-table-disabled'
                  },
                  attrs: {
                    title: '删除'
                  },
                  on: {
                    click: function () {
                      if (!params.row.IsDefault && !params.row._disabled) {
                        this.delType(params.row)
                      }
                    }
                  }
                }) : ''
              ])
            }
          }
        ],
        datatable: [], // 考勤类型table数据
        isEmpty: false, // 数据是否为空
        isInitial: true,
        attBtnCreate_disabled: false, //  是否禁用“新增状态”按钮
        // 规则设置偏移
        formValidateRuleSetting: {
          OffsetBefore: null, // 提前考勤时间
          OffsetRear: null, // 延后考勤不算迟到
          OffsetLeadTime: 0, // 提前考勤时间，超出这个时间算迟到
          OffsetAbsentee: 0, // 旷课偏移
          HistoryChange: 7, // 历史考勤数据调整，只能修改过去多久的考勤，单位天
          radio: 'delay'
        },
        ruleValidateRuleSetting: {
          OffsetBefore: [
            { required: true, type: 'number', message: '提前考勤时间范围设置不能为空', trigger: 'blur' }
          ],
          OffsetRear: [
            { required: true, type: 'number', message: '迟到延后时间设置不能为空', trigger: 'blur' }
          ],
          OffsetLeadTime: [
            { required: true, type: 'number', message: '迟到提前时间设置不能为空', trigger: 'blur' }
          ],
          OffsetAbsentee: [
            { required: true, type: 'number', message: '旷课时间向后偏移设置不能为空', trigger: 'blur' }
          ],
          HistoryChange: [
            { required: true, type: 'number', message: '考勤状态修改限制不能为空', trigger: 'blur' }
          ]
        },
        // 创建考勤类型
        formValidateCreate: {
          typeName: ''
        },
        ruleValidateCreate: {
          typeName: [
            { required: true, message: '考勤类型名称不能为空', trigger: 'blur' },
            { type: 'string', min: 2, max: 6, message: '考勤类型名称不能低于2个字超过6个字', trigger: 'blur' }
          ]
        },
        // 编辑考勤类型
        formValidateEdit: {
          typeName: ''
        },
        ruleValidateEdit: {
          typeName: [
            { required: true, message: '考勤类型名称不能为空', trigger: 'blur' },
            { type: 'string', min: 2, max: 6, message: '考勤类型名称不能低于2个字超过6个字', trigger: 'blur' }
          ]
        },

        /*
         考勤范围设置
         */
        schoolChangeStr: 0,
        venueSchool: [],
        statusID: 1, // 默认展示开启
        typeStatus: [
          {
            value: 0,
            status: '全部'
          },
          {
            value: 1,
            status: '开启'
          },
          {
            value: 2,
            status: '关闭'
          }
        ],
        columnsRange: [
          {
            title: '校区',
            key: 'SchoolDistrictName',
            tooltip: true
          },
          {
            title: '学届',
            key: 'StudentYearName'
          },
          {
            title: '年级',
            key: 'StudentGradeName'
          },
          {
            title: '开启考勤',
            key: 'IsEnable', // State
            width: 100,
            render: (h, params) => {
              return h('div', [
                params.row.AttStudentSettingScopeEnabled
                  ? h('i-switch', {
                    props: {
                      size: 'large',
                      value: params.row.IsEnable,
                      type: 'namesssss'
                    },
                    on: {
                      'on-change': function () {
                        this.switchFun(params.row)
                      }
                    }
                  }, [
                    h('span', {
                      slot: 'open',
                      domProps: {
                        innerHTML: '开启'
                      }
                    }),
                    h('span', {
                      slot: 'close',
                      domProps: {
                        innerHTML: '关闭'
                      }
                    })
                  ]) : ''
              ])
            }
          }
        ],
        list: [],
        /*
         * 定时发送考勤统计
         */
        NewsSetModel: false,
        numberDisabled: true,
        // sendSR: sendStatisticsRegularly
        sendSR_control: {},
        sendSRValues: {
          switchModel: false,
          item_everySection: false,
          item_everyDay: false,
          classMoment: 10,
          classTimePoint: '18:00',
          everySection_receiver: [],
          everyDay_receiver: []
        },
        sendSR_rulers: {
          classMoment: [{
            transform: function name (value) {
              return Number(value)
            },
            type: 'number',
            min: 1,
            max: 100,
            message: '请填写1~100的数字'
          }]
        },
        apiPath: ''
      }
    },
    computed: {
      // 定时发送考勤统计: 选择了至少一项
      window_sendSR_hasSelectedItem: function () {
        return this.sendSRValues.item_everySection || this.sendSRValues.item_everyDay
      },
      // 定时发送考勤统计: 选择了至少一项接收人(每节课)
      everySection_hasSelected: function () {
        return this.sendSRValues.everySection_receiver.length > 0
      },
      // 定时发送考勤统计: 选择了至少一项接收人(每天)
      everyDay_hasSelected: function () {
        return this.sendSRValues.everyDay_receiver.length > 0
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.getTP() // 考勤类型
    },
    watch: {
      'formValidateRuleSetting.radio': function (val) {
        if (val === 'ahead') {
          this.ruleValidateRuleSetting.OffsetRear[0].required = false
          this.ruleValidateRuleSetting.OffsetAbsentee[0].required = true
        } else if (val === 'delay') {
          this.ruleValidateRuleSetting.OffsetRear[0].required = true
          this.ruleValidateRuleSetting.OffsetAbsentee[0].required = false
        }
      }
    },
    mounted () {
      // this.permissions() // 权限
    },
    methods: {
      //     this.xy.loading()
      //     let res = await this.xy.get(
      //       this.apiPath + `/api/Resource/GetPage`
      //     )
      //     this.xy.unloading()
      //     if (res.success) {
      //     } else {
      //      this.xy.msgError(res.msg)
      //     }
      // tab
      tab (val) {
        this.showType = val
        if (this.showType === 'type') {
          this.getTP() // 考勤类型
        } else {
          this.getRange() // 考勤范围
          this.getSchool()
        }
      },
      /* 考勤类型设置 */
      // 获取考勤类型
      async getTP () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/AttsSetting/GetType`
        )
        this.isInitial = false
        this.xy.unloading()
        if (res.success) {
          if (res.data != null && res.data.length > 0) {
            this.list = res.data
            for (var i = 0; i < this.datatable.length; i++) {
              this.datatable[i].AttStudentSettingTypeEdit = this.AttStudentSettingTypeEdit
              this.datatable[i].AttStudentSettingTypeDelete = this.AttStudentSettingTypeDelete
              if (this.datatable[i].AttStudentSettingTypeEdit || this.datatable[i].AttStudentSettingTypeDelete) {
              } else {
                this.columns[2].title = ' '
              }
            }
            this.isEmpty = false
            this.attBtnCreate_disabled = res.data.length >= 10
          } else {
            this.isEmpty = true
          }
        } else {
          this.isEmpty = true
          this.xy.msgError(res.msg)
        }
      },
      // 提交创建时触发
      changeLoading () {
        var _this = this
        this.loading = false
        this.$nextTick(function () {
          _this.loading = true
        })
      },
      // 创建考勤类型
      addType () {
        this.$refs.formValidateCreate.resetFields()
        this.formValidateCreate.typeName = ''
        this.formValidateEdit.typeName = ''
        if (this.list.length < 10) {
          this.modalCreateType = true
        } else {
          this.xy.msgError('最多创建10种考勤类型。')
        }
      },
      // 提交创建考勤类型
      creatTypeOk () {
        var _this = this
        this.$refs.formValidateCreate.validate(function (valid) {
          if (!valid) {
            return _this.changeLoading()
          } else {
            _this.Create()
          }
        })
      },
      async Create () {
        this.xy.loading()
        let res = await this.xy.post(this.apiPath + `/api/AttsSetting/Create?StudentAttendanceTypeName=` + this.formValidateCreate.typeName, null, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('创建成功。')
          this.modalCreateType = false
          this.$refs.formValidateCreate.resetFields()
          this.getTP()
        } else {
          if (Number(res.errorcode) > 0) {
            // 已存在同名的被删除类型
            this.editTypeId = 0
            this.enableId = Number(res.errorcode)
            this.xy.confirm('重新使用', res.msg, this.enableAttendanceType)
          } else {
            this.xy.msgError(res.msg)
          }
          this.changeLoading()
        }
      },

      // 关闭创建考勤类型弹框触发
      creatTypeCancel () {
        this.modalCreateType = false
        this.formValidateCreate.typeName = ''
        this.$refs.formValidateCreate.resetFields()
      },
      // 编辑考勤类型
      editType (row) {
        this.$refs.formValidateEdit.resetFields()
        this.modalEditType = true
        this.editTypeId = row.StudentAttendanceTypeID
        this.formValidateEdit.typeName = row.StudentAttendanceTypeName
      },
      // 确认编辑考勤类型
      editTypeOk () {
        var _this = this
        this.$refs.formValidateEdit.validate((valid) => {
          if (!valid) {
            return _this.changeLoading()
          } else {
            this.Edit()
          }
        })
      },
      // 编辑
      async Edit () {
        var _this = this
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + `/api/AttsSetting/Edit`, {
            StudentAttendanceTypeID: _this.editTypeId,
            StudentAttendanceTypeName: _this.formValidateEdit.typeName
          }, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('编辑成功。')
          this.modalEditType = false
          this.$refs.formValidateEdit.resetFields()
          this.getTP()
        } else {
          if (Number(res.errorcode) > 0) {
            // 已存在同名的被删除类型
            this.enableId = Number(res.errorcode)
            this.xy.confirm('重新使用', res.msg, this.enableAttendanceType)
          } else {
            this.xy.msgError(res.msg)
          }
          this.changeLoading()
        }
      },
      // 编辑考勤类型取消
      editTypeCancel () {
        this.editId = ''
        this.formValidateEdit.typeName = ''
        this.modalEditType = false
        this.$refs.formValidateEdit.resetFields()
      },

      // 恢复已存在的被删除类型
      async enableAttendanceType () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/AttsSetting/EnableAttendanceType`, {
            TargetAttendanceID: this.enableId,
            SourceAttendanceID: this.editTypeId
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('恢复成功。')
          this.getTP()
        }
        this.modalEditType = false
        this.modalCreateType = false
      },

      // 删除
      delType (vals) {
        this.delId = vals
        this.xy.confirm('删除', '是否删除此考勤类型？', this.dels)
      },
      async dels () {
        this.xy.loading()
        let res = await this.xy.post(this.apiPath + `/api/AttsSetting/Delete?id=` + this.delId.StudentAttendanceTypeID)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          this.getTP()
        }
      },
      // 获取规则设置信息
      async getAttsSetting () {
        this.xy.loading()
        this.modalAttsSetting = true
        let res = await this.xy.get(
          this.apiPath + `/api/AttsSetting/GetSetting`
        )
        this.xy.unloading()
        if (res.success) {
          var data = res.data
          this.formValidateRuleSetting.OffsetBefore = data.OffsetBefore
          this.formValidateRuleSetting.OffsetRear = data.OffsetRear
          this.formValidateRuleSetting.OffsetAbsentee = data.OffsetAbsentee
          this.formValidateRuleSetting.HistoryChange = data.HistoryChange
          this.formValidateRuleSetting.OffsetLeadTime = data.OffsetLeadTime
          if (data.OffsetRear > 0) {
            this.formValidateRuleSetting.radio = 'delay'
          } else if (data.OffsetLeadTime > 0) {
            this.formValidateRuleSetting.radio = 'ahead'
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 规则设置保存
      attsSettingOk () {
        var _this = this
        if (this.formValidateRuleSetting.radio === 'ahead' && this.formValidateRuleSetting.OffsetBefore === this.formValidateRuleSetting.OffsetLeadTime) {
          return _this.xy.msgError('迟到提前时间范围等于考勤提前开始时间范围。')
        }
        this.$refs.formValidateRuleSetting.validate(function (valid) {
          if (!valid) {
            return _this.changeLoading()
          } else {
            _this.Save()
          }
        })
      },
      async Save () {
        var data = this.formValidateRuleSetting
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + `/api/AttsSetting/Save`, {
            OffsetBefore: data.OffsetBefore,
            OffsetRear: data.radio === 'delay' ? data.OffsetRear : 0,
            OffsetLeadTime: data.radio === 'ahead' ? data.OffsetLeadTime : 0,
            OffsetAbsentee: data.OffsetAbsentee,
            HistoryChange: data.HistoryChange
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('保存成功。')
          this.modalAttsSetting = false
          this.$refs.formValidateRuleSetting.resetFields()
        }
      },
      // 规则设置取消编辑
      attsSettingCancel () {
        this.modalAttsSetting = false
        this.$refs.formValidateRuleSetting.resetFields()
      },
      // 获取消息设置
      async getNewsSetting () {
        this.NewsSetModel = true
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/AttsSetting/GetMessageSetting`
        )
        this.xy.unloading()
        if (res.success) {
          let d = res.data
          let t = d.PerDiemTime.split(' ')[1].split(':')
          let sendSRValues = {
            switchModel: d.IsOpen,
            item_everySection: d.IsSchoolTime,
            item_everyDay: d.IsPerDiem,
            classMoment: d.AfterSchoolTime,
            classTimePoint: t[0] + ':' + t[1],
            // everySection_receiver: d.PerDiemReceived === '' ? [] : d.PerDiemReceived.split(','),
            // everyDay_receiver: d.SchoolTimeReceived === '' ? [] : d.SchoolTimeReceived.split(',')
            everyDay_receiver: d.PerDiemReceived === '' ? [] : d.PerDiemReceived.split(','),
            everySection_receiver: d.SchoolTimeReceived === '' ? [] : d.SchoolTimeReceived.split(',')
          }
          this.$set(this, 'sendSRValues', sendSRValues)
          this.numberDisabled = !this.sendSRValues.switchModel
        } else {
          this.changeLoading()
          this.xy.msgError(res.msg)
        }
      },
      // 范围设置
      scopeSetting () {
        this.$store.commit('common/getThreeMenuName', '范围设置')
        this.$router.push({
          path: '/xyHome/AttendanceRange',
          query: this.$store.state.common.menuInfo
        })
      },
      switchChange () {
        if (this.sendSRValues.switchModel) {
          this.numberDisabled = false
        } else {
          this.numberDisabled = true
        }
      },
      // 提交消息设置
      async NewsSetOk () {
        var _this = this
        if (this.sendSRValues.switchModel) {
          if (this.window_sendSR_hasSelectedItem) {
            if (this.sendSRValues.item_everySection) {
              if (_this.sendSRValues.classMoment === '' || _this.sendSRValues.classMoment === null || _this.sendSRValues.classMoment === 0) {
                this.xy.msgError('发送时间必填。')
                return _this.changeLoading()
              }
              if (!_this.everySection_hasSelected) {
                return _this.changeLoading()
              }
            }
            if (this.sendSRValues.item_everyDay) {
              if (!_this.everyDay_hasSelected) {
                return _this.changeLoading()
              }
            }
          } else {
            return _this.changeLoading()
          }
        }
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + `/api/AttsSetting/SaveMessageSetting`, {
            IsOpen: _this.sendSRValues.switchModel,
            IsSchoolTime: _this.sendSRValues.item_everySection,
            AfterSchoolTime: _this.sendSRValues.classMoment,
            IsPerDiem: _this.sendSRValues.item_everyDay,
            PerDiemTime: _this.sendSRValues.classTimePoint,
            // PerDiemReceived: _this.sendSRValues.everySection_receiver.toString(),
            // SchoolTimeReceived: _this.sendSRValues.everyDay_receiver.toString()
            PerDiemReceived: _this.sendSRValues.everyDay_receiver.toString(),
            SchoolTimeReceived: _this.sendSRValues.everySection_receiver.toString()
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.NewsSetModel = false
          this.getTP()
          this.xy.msgSuc('设置成功。')
        }
        this.changeLoading()
      },
      NewsSetCancel () {
        this.NewsSetModel = false
        this.$refs.sendSRValues.resetFields()
      }
    }
  }
</script>
<style lang="less" scoped>
.attendance .ivu-form-item-content {
    margin-left: 109px;
}

.attendance .tabs {
    width: 195px;
    height: 30px;
    line-height: 30px;
    margin: 0 auto;
    color: #444;
    display: flex;
}

    .attendance .tabs span {
        display: block;
        flex: 1;
        position: relative;
        cursor: pointer;
    }

        .attendance .tabs span.currents {
            font-weight: bold;
        }

            .attendance .tabs span.currents i {
                width: 30px;
                height: 4px;
                background: #6392E9;
                position: absolute;
                bottom: 0px;
                left: 34px;
            }

.table-top {
    margin-top: 10px;
}

.sendStatisticsRegularly-item .checker {
    margin-top: 6px;
}

.attendance .sendStatisticRegularly-item-body .ivu-form-item-content {
    margin-left: 6em;
}

.att-flex {
    display: flex;
    flex-wrap: wrap;
}

.att-flex-box,
.att-flex-box-content {
    width: 290px;
    height: 160px;
    margin-right: 20px;
    margin-bottom: 20px;
    background: #fff;
}

.att-flex-box {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #d9d9d9;
}

    .att-flex-box > div {
        color: #8c8c8c;
    }

.att-flex-box-content {
    display: flex;
    flex-flow: column;
    border: 1px solid #e9e9e9;
}

    .att-flex-box-content .att-flex-box-content-top {
        flex: 1;
    }

        .att-flex-box-content .att-flex-box-content-top .att-flex-box-content-top-flex {
            height: 48px;
            display: flex;
            align-items: center;
            margin: 20px 0 0 20px;
        }

            .att-flex-box-content .att-flex-box-content-top .att-flex-box-content-top-flex .att-flex-box-content-top-flex-left {
                width: 48px;
                height: 48px;
                border-radius: 10px;
                margin-right: 18px;
                background-image: url(/image/seticon.png);
                background-size: 22px;
                background-position: center;
                background-repeat: no-repeat;
            }
            .att-flex-box-content .att-flex-box-content-top .att-flex-box-content-top-flex .att-flex-box-content-top-flex-left > i {
                text-align: center;
                line-height: 48px;
                display: block;
                font-size: 22px;
                color: #fff;
            }

            .att-flex-box-content .att-flex-box-content-top .att-flex-box-content-top-flex .att-flex-box-content-top-flex-right {
                display: flex;
                flex-flow: column;
            }

                .att-flex-box-content .att-flex-box-content-top .att-flex-box-content-top-flex .att-flex-box-content-top-flex-right .att-flex-box-content-top-flex-right-top {
                    color: #000;
                    font-size: 16px;
                    font-weight: 700;
                }

                .att-flex-box-content .att-flex-box-content-top .att-flex-box-content-top-flex .att-flex-box-content-top-flex-right .att-flex-box-content-top-flex-right-bottom {
                    color: #999;
                    font-size: 14px;
                }

    .att-flex-box-content .att-flex-box-content-bottom {
        height: 48px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(249,250,251,1);
        color: #878889;
    }

        .att-flex-box-content .att-flex-box-content-bottom .att-flex-box-icon {
            margin-right: 10px;
            color: #878889;
        }

        .att-flex-box-content .att-flex-box-content-bottom.default {
            background: rgba(249,250,251,.5);
            color: rgba(135,136,137,.45);
        }

            .att-flex-box-content .att-flex-box-content-bottom.default .att-flex-box-icon {
                margin-right: 10px;
                color: #E8E8E8;
            }

        .att-flex-box-content .att-flex-box-content-bottom > div {
            flex: 4;
            text-align: center;
        }

            .att-flex-box-content .att-flex-box-content-bottom > div.att-split {
                flex: 1;
                text-align: center;
                color: #e8e8e8;
            }

        .att-flex-box-content .att-flex-box-content-bottom .att-flex-box-content-bottom-edit:hover,
        .att-flex-box-content .att-flex-box-content-bottom .att-flex-box-content-bottom-edit:hover .att-flex-box-icon {
            color: #4196ff;
        }

        .att-flex-box-content .att-flex-box-content-bottom .att-flex-box-content-bottom-del:hover,
        .att-flex-box-content .att-flex-box-content-bottom .att-flex-box-content-bottom-del:hover .att-flex-box-icon {
            color: #f5222d;
        }

.att-flex-text {
    font-size: 16px;
    margin-left: 5px;
}

</style>
