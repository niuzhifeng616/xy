<template>
  <div class="xy-content-module">
    <!-- 学生请假-请假申请   // 缺少面包屑 -->
      <div class="xy-content-body">
        <div class="leave-apply">
            <div style="width:600px;margin:0 auto;">
                <Alert show-icon>规则说明：可请过去&nbsp;{{rowRoleType.RoleType===3 ? leaveSetting.PastDate : leaveSetting.TeacherPastDate}}&nbsp;天到本学期末的假。</Alert>
                <i-form ref="formValidateOk" :model="formValidateOk" :rules="ruleValidateOk" :label-width="80">
                    <!-- <FormItem label="规则说明">
                        <div class="" v-if="rowRoleType.RoleType===3" v-cloak><b>可请过去&nbsp;{{leaveSetting.PastDate}}&nbsp;天到本学期末的假。</b></div>
                        <div class="" v-else v-cloak><b>可请过去&nbsp;{{leaveSetting.TeacherPastDate}}&nbsp;天到本学期末的假。</b></div>
                    </FormItem> -->
                    <FormItem label="请假学生" prop="studentID" class="chooseData">
                        <div v-if="rowRoleType.RoleType===3" v-cloak>{{rowRoleType.FullName}}</div>
                        <div v-else class="add-student-list">
                            <div>
                                <div class="add-student-btn" @click="openAddModal(1)">
                                  <Icon type="md-add" />
                                  添加
                                </div>
                                <tag
                                  closable
                                  @on-close="delStudent"
                                  v-for="(item, index) in selectedTeachers"
                                  :key="index"
                                  :name="item.UserID"
                                  :title="item.UserName"
                                  v-cloak
                                  >
                                  {{item.FullName}}
                                </tag>
                            </div>
                            <!-- <div class="pr">
                                <div class="add-student-btn" @click="openAddModal(1)" title="添加学生"><Icon type="md-add-circle" class="cursor-p" size="24" color="#4196ff" /></div>
                            </div> -->
                        </div>
                    </FormItem>
                    <FormItem label="请假类型" prop="typeValueID" labelFor="typeValueID">
                        <i-select v-model="formValidateOk.typeValueID" elementId="typeValueID">
                            <i-option v-cloak v-for="types in typeValue" :value="types.LeaveTypeID" :key="types.LeaveTypeID">{{ types.LeaveTypeName }}</i-option>
                        </i-select>
                    </FormItem>
                    <FormItem v-if="radioType==='0'" label="请假时间" class="chooseData" prop="formDate" labelFor="formDate">
                        <div>
                            <radio-group v-model="radioType" @on-change="radioTypeChange">
                                <radio label="0">连续性请假</radio>
                                <radio label="1">周期性请假</radio>
                            </radio-group>
                        </div>
                        <date-picker
                          type="datetimerange"
                          :value="formValidateOk.formDate"
                          :options="optionsStartDisabled"
                          split-panels
                          :clearable="false"
                          format="yyyy-MM-dd HH:mm"
                          placeholder="开始时间-结束时间"
                          elementId="formDate"
                          @on-change="dateChange"
                          style="width:100%"
                          :editable="false"
                          >
                        </date-picker>
                    </FormItem>
                    <FormItem v-if="radioType==='1'" label="请假时间" class="chooseData" prop="dataLoop">
                        <div>
                            <radio-group v-model="radioType" @on-change="radioTypeChange">
                                <radio label="0">连续性请假</radio>
                                <radio label="1">周期性请假</radio>
                            </radio-group>
                        </div>
                        <div style="border-radius: 4px;border: 1px solid #eee;">
                            <div style="display:flex;justify-content: space-between; padding: 10px;border-bottom: 1px dashed #ebe9e9;">
                                <span style="font-size: 15px;" v-cloak>起止时间： {{cycleListCopy.SETime[0]}} ~ {{cycleListCopy.SETime[1]}}</span>
                                <!-- <i-button type="primary" size="small" @click="cycleModel=true">编辑</i-button> -->
                                <span class="cursor-p" style="color: #4196ff" @click="cycleModel=true">编辑</span>
                            </div>
                            <div style="padding: 20px 10px; 0">
                                <div v-for="(item,index) in cycleListCopy.CycleList" :key="index" style="display:flex;">
                                  <div v-if="item.Checked" style=" margin-bottom: 20px;">
                                      <span style="margin-right:20px;" v-cloak>{{item.Name}}</span>
                                      <span
                                        v-for="(child, index) in item.TimeList"
                                        :key="index"
                                        style="margin-right:15px;font-size: 15px;"
                                        v-cloak
                                        >
                                        {{child.SETime[0]}} - {{child.SETime[1]}}
                                      </span>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </FormItem>
                    <FormItem label="请假原因" prop="textarea" labelFor="textarea">
                        <Input v-model="formValidateOk.textarea" :autosize="{minRows: 5,maxRows: 5}" maxLength="100" elementId="textarea"  type="textarea" />
                    </FormItem>
                    <FormItem label="是否离校" prop="leaveSchool" labelFor="leaveSchool">
                        <radio-group v-model="formValidateOk.leaveSchool" elementId="leaveSchool">
                            <radio label="1">是</radio>
                            <radio label="2">否</radio>
                        </radio-group>
                    </FormItem>
                    <FormItem label="请假图片" prop="picIcon">
                        <div class="pr">
                            <i-button class="pr cursor-p">
                                <img src="../img/GroupSmall.png" alt="">
                                <input type="file" multiple="multiple" @change="changeFunc($event)" class="pa" style="top:0;left:0;width:100%;height:100%;opacity:0;">
                                上传图片
                            </i-button>
                            <div style="color:#9f9f9f">最多上传6张图片；单张图片最大：10M；格式限制：jpg，jpeg，png，bmp。</div>
                        </div>
                        <div v-if="defaltFileList.length>0" class="upLoad-img">
                          <div v-for="(item, index) in defaltFileList" :key="index" class="upLoad-list-img" @mouseenter="moveImg(index)" @mouseleave="leaveImg()">
                            <img :src="apiPath + item" class="cursor-img" >
                            <div class="upload-list-cover" v-show="isShowImg===index">
                              <Icon type="ios-eye-outline" style="padding-right:10px;color:#fff;font-size:22px;cursor: pointer;" @click.native="viewImg(item)"></Icon>
                              <Icon type="ios-trash-outline" style="padding-left:10px;color:#fff;font-size:20px;cursor: pointer;"  @click.native="handleRemove(item,index)"></Icon>
                          </div>
                        </div>
                        </div>
                    </FormItem>
                </i-form>
                <div style="border-top:1px solid #f5f5f5;margin-bottom:40px;">
                  <!-- 审批流程 -->
                  <WorkflowApply :workflow=workflow :isAddList="isAddList" />
                </div>
                <div class="text-center" style="height: 60px;display: flex;justify-content: center;align-items: center;">
                    <Button class="xy-modal-close" @click="cancel" style="margin-right:20px;">取消</Button>
                    <Button class="xy-modal-primary" shape="circle" @click="ok">保存</Button>
                </div>
            </div>
        </div>
    </div>

    <!-- 查看更多 -->
    <Modal
      v-model="moreModal"
      :styles="{top:'70px',width:'650px'}"
      :transfer="false"
      :title="moreModalTitle"
      :loading="loading"
      :mask-closable="false"
      >
        <div class="modal-flex" style="display:flex;">
            <div v-for="(item,index) in moreList" :key="index" class="modal-list" style="width:20%;">
                <div class="modal-users pr">
                    <span>{{moreType===1?item.CcMemberName:item.AppName}}</span>
                    <Icon
                      v-if="!item.Del&&moreType===1"
                      @click="modalCcDel(index)"
                      type="ios-close-circle"
                      size="22"
                      color="#fb7676"
                      class="pa cursor-p"
                      style="top:-11px;right:-6px;"
                      >
                    </Icon>
                </div>
                <div class="modal-name nowrap">{{item.FullName}}</div>
            </div>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="moreModal=false">关闭</Button>
        </div>
    </Modal>

    <!-- 添加审批人 -->
    <Modal
      v-model="appModal"
      :styles="{top:'70px',width:'480px'}"
      :transfer="false"
      title="添加审批人"
      :loading="loading"
      :mask-closable="false"
      >
        <div class="app-modal">
            <div
              v-for="(item,index) in addAppList"
              :key="index"
              class="app-modal-box"
              :class="index==isAppIndex?'active':''"
              @click="changeAddModalBtn(addAppList,index)"
              >
                <div class="app-modal-box-radio"><span></span></div>
                <div class="app-modal-box-left">{{item.AppName}}</div>
                <div class="app-modal-box-right nowrap">{{item.FullName}}</div>
            </div>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="appModal=false">关闭</Button>
        </div>
    </Modal>

    <!-- 添加请假学生/抄送人 -->
    <SelectStudent
      :isShow="isShow"
      :teachers="[...selectedTeachers]"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm">
    </SelectStudent>

    <!-- 周期性请假 -->
    <Modal
      v-model="cycleModel"
      :styles="{top:'20px',width:'640px'}"
      :transfer="false"
      title="周期性请假"
      :loading="loading"
      :mask-closable="false"
      class="cycleLeave"
      >
        <div>
            <div class="modalTit">
                <span>起止时间</span>
                <date-picker
                  style="width: 494px"
                  type="daterange"
                  v-model="typeList.SETime"
                  :options="optionsStartDisabled"
                  split-panels
                  :clearable="false"
                  format="yyyy-MM-dd"
                  placeholder="开始时间-结束时间"
                  TimeList
                  @on-change="cycleDateChange"
                  :editable="false"
                  >
                </date-picker>
            </div>
            <div>
                <div v-for="(item,index) in typeList.CycleList" :key="index" style="display: flex;align-items: center;margin-bottom: 14px;">
                    <Checkbox v-model="item.Checked"></Checkbox>
                    <div class="weekMain">
                      <span class="weekDay">
                        {{item.Name}}
                      </span>
                      <div  class="timeList">
                        <div v-for="(times, index) in item.TimeList" :key="index">
                          <time-picker
                            format="HH:mm"
                            confirm
                            type="timerange"
                            v-model="times.SETime"
                            :clearable="false"
                            :editable="false"
                            style="width: 152px;margin-right: 12px;"
                            >
                          </time-picker>
                        </div>
                        <div style="display:flex;">
                            <!-- <Icon v-if="item.TimeList.length<3"
                                  type="ios-add-circle"
                                  color="#4196ff"
                                  size="30"
                                  class="cursor-p"
                                  style="margin-right:10px;"
                                  @click="add(item)"></Icon> -->
                            <!-- <Icon v-if="item.TimeList.length>0"
                                  type="ios-remove-circle"
                                  color="#ff8c8c"
                                  size="30"
                                  class="cursor-p"
                                  @click="del(item)"></Icon> -->
                          <Icon class="cursor-p" style="border: 1px solid #ddd; border-radius: 4px; margin-right:10px;" v-if="item.TimeList.length<3" color="#b8b8b8" type="ios-add" size="20" @click="add(item)" />
                          <Icon class="cursor-p" style="border: 1px solid #ddd; border-radius: 4px;" type="ios-remove" color="#b8b8b8" v-if="item.TimeList.length>0" @click="del(item)" size="20" />
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="cycleModelCancel">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="cycleModelOk">确定</Button>
        </div>
    </Modal>

    <!-- 查看图片 -->
    <Modal
      v-model="viewImgModal"
      :styles="{top:'20px',width:'520px'}"
      :transfer="false"
      title="预览"
      :loading="loading"
      :mask-closable="false"
      >
        <div v-if="viewImgModal" style="text-align:center;overflow:auto;width:100%;height:500px;">
            <img :src="apiPath + viewImgInfo" style="width:100%;" />
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="viewImgModal=false">关闭</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
  import SelectStudent from '@/components/selectStudent/SelectStudent.vue'
  import WorkflowApply from '@/components/workflow/WorkflowApply.vue'
  export default {
    name: 'StudentApply',
    components: {
      SelectStudent,
      WorkflowApply
    },
    data () {
      return {
        apiPath: '',
        workflow: [],
        isAddList: 0,
        isAppIndex: -1,
        appModal: false,
        addAppList: [],
        isAddMemberNum: 0,
        moreModal: false,
        moreList: [],
        reg: /^[A-Za-z0-9]+$/,
        regNumber: /\d+/,
        workFlowList: [],
        cycleListCopy: {
          SETime: [],
          CycleList: []
        },
        typeList: {
          SETime: [],
          ApprovalFlowNodes: [
            { }
          ],
          CycleList: [
            {
              Week: 1,
              Name: '每周一',
              Checked: false,
              Times: [],
              TimeList: []
            },
            {
              Week: 2,
              Name: '每周二',
              Checked: false,
              Times: [],
              TimeList: []
            },
            {
              Week: 3,
              Name: '每周三',
              Checked: false,
              Times: [],
              TimeList: []
            },
            {
              Week: 4,
              Name: '每周四',
              Checked: false,
              Times: [],
              TimeList: []
            },
            {
              Week: 5,
              Name: '每周五',
              Checked: false,
              Times: [],
              TimeList: []
            },
            {
              Week: 6,
              Name: '每周六',
              Checked: false,
              Times: [],
              TimeList: []
            },
            {
              Week: 7,
              Name: '每周日',
              Checked: false,
              Times: [],
              TimeList: []
            }
          ]
        },
        loading: true,
        cycleModel: false,
        // rowRoleType: '',
        radioType: '0',
        params: '',
        leaveTypeID: 0,
        typeValue: [], // 全部请假类型
        userId: '',
        copyData: [],
        approval: '', // 审批人
        approvalId: '', // 审批人
        copy: '', // 抄送人
        defaltFileList: [], // 默认已上传的图片-编辑时
        leaveSetting: {
          TeacherPastDate: '',
          PastDate: ''
        },
        formValidateOk: {
          typeValueID: '',
          formDate: null,
          dataLoop: '',
          leaveSchool: '2',
          textarea: ''
        },
        ruleValidateOk: {
          typeValueID: [
            { required: true, type: 'number', message: '请假类型不能为空', trigger: 'change' }
          ],
          formDate: [// 连续性请假
            { required: this.radioType === 0, type: 'array', len: 2, message: '连续性请假不能为空', trigger: 'change' }
          ],
          dataLoop: [// 周期性请假
            { required: this.radioType === 1, message: '周期性请假不能为空' }
          ],
          leaveSchool: [
            { required: true, type: 'string', message: '是否离校不能为空', trigger: 'change' }
          ],
          textarea: [
            { required: true, message: '请假原因不能为空', trigger: 'blur' },
            { type: 'string', max: 100, message: '请假原因不能超过100字符。', trigger: 'blur' }
          ]
        },
        // 请假开始日期 设置不可选择的日期
        optionsStartDisabled: {},
        uploadList: [],
        viewImgInfo: '', // 查看图片
        viewImgModal: false,
        moreModalTitle: '',
        moreType: 1,
        isShow: false,
        selectedTeachers: [],
        rowRoleType: {},
        selectClassID: '',
        isShowImg: false
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.rowRoleType = this.$store.state.common.userBaseInfo
      this.getTypes()
      // 多选控件宽度
      this.windowResize()
      window.onresize = this.windowResize
    },
    mounted () {
      // 从右侧删除已选成员
      $('.group-users-checkmark').off('span i')
      $('.group-users-checkmark').on('click', 'span i', function () {
        $('.group-level3').find('input:checked[data-id="' + $(this).parent('span').attr('data-id') + '"]').prop('checked', false)
        $('.group-level3').find('input[data-id="' + $(this).parent('span').attr('data-id') + '"]').parents('ul.group-level3').siblings('div.checkmark-checkbox-all').find('input').prop('checked', false)
        $(this).parent().remove()
      })
    },
    methods: {
      // 获取请假类型
      async getTypes () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/StudentLeaveType/GetTypeAll`, {
            PageIndex: 1,
            PageSize: 15
          }
        )
        if (res.success) {
          this.typeValue = res.data
          this.getCopyData()
        }
      },
      async getCopyData () {
        let res = await this.xy.get(
          this.apiPath + `/api/StudentLeaveType/GetLeaveSetting`
        )
        if (res.success) {
          this.copyData = res.data
          for (var i = 1; i < this.copyData.length; i++) {
            if (this.copyData[i].IsEnabled) {
              this.copy.push(this.copyData[i].LeaveSettingID)
            }
          }
          this.getLeaveSetting()
        }
      },
      // 获取请假时间规则
      async getLeaveSetting () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/StudentLeaveType/GetLeaveSetting`
        )
        this.xy.unloading()
        if (res.success) {
          this.leaveSetting = res.data
          var newDate = this.rowRoleType.RoleType === 3 ? this.leaveSetting.PastDate : this.leaveSetting.TeacherPastDate
          // 请假日期可选范围设置
          this.optionsStartDisabled = {
            disabledDate (date) {
              return date && date.valueOf() < Date.now() - 86400000 - (newDate * 24 * 60 * 60 * 1000)
            }
          }
        }
      },
      // 获取审批流
      async getCondition () {
        this.xy.loading()
        var timeLong = 0
        if (this.radioType === '1') {
          // 周期性请假
          let m1 = this.xy.moment(this.xy.moment(new Date(this.cycleListCopy.SETime[0])).format('YYYY-MM-DD'))
          let m2 = this.xy.moment(this.xy.moment(new Date(this.cycleListCopy.SETime[1])).format('YYYY-MM-DD'))
          timeLong = m2.diff(m1, 'days') + 1
        } else {
          // 连续性请假
          let m1 = this.xy.moment(this.xy.moment(new Date(this.formValidateOk.formDate[0])).format('YYYY-MM-DD'))
          let m2 = this.xy.moment(this.xy.moment(new Date(this.formValidateOk.formDate[1])).format('YYYY-MM-DD'))
          timeLong = m2.diff(m1, 'days') + 1
        };
        let res = await this.xy.post(
          this.$store.state.apiPublic + `/api/WorkFlowSetting/ApprovalProcessByCondition`, {
            ApplicantUserID: this.rowRoleType.RoleType === 3 ? this.rowRoleType.UserID : 0,
            OrganizationID: this.selectClassID === '' ? 0 : this.selectClassID,
            WorkFlowType: 3, // 学生请假
            ConditionValues: [
              {
                Type: 0,
                Code: 1, // 请假时长类型
                Value: timeLong // 天数
              },
              {
                Type: 0,
                Code: 2, // 请假人数
                Value: this.rowRoleType.RoleType === 3 ? 1 : this.selectedTeachers.length // 人数
              }
            ]
          }
        )
        this.xy.unloading()
        this.workFlowList = []
        if (res.success) {
          this.workflow = res.data
          this.workFlowList = this.workflow
        }
      },
      windowResize () {
        if ($(window).width() < 1366) {
          this.clientWidth = 1200
        } else if ($(window).width() < 1440) {
          this.clientWidth = 1300
        } else if ($(window).width() < 1688) {
          this.clientWidth = 1400
        } else {
          this.clientWidth = 1600
        };
      },
      openAddModal () {
        this.isShow = true
      },
      selectCancel () {
        this.isShow = false
      },
      selectConfirm (data) {
        console.log(data)
        console.log(data.length)
        this.selectClassID = data[0].StudentOrganizationID
        console.log(this.selectClassID)
        this.isShow = false
        this.selectedTeachers = [...data]
        if (data.length > 0 && (this.cycleListCopy.SETime.length > 0 || this.formValidateOk.formDate.length > 0)) {
          this.getCondition()
        }
      },
      delStudent (e, name) {
        for (var i = 0; i < this.selectedTeachers.length; i++) {
          if (this.selectedTeachers[i].UserID === name) {
            this.selectedTeachers.splice(i, 1)
          }
        };
        if (this.radioType === '1') {
          if (this.cycleListCopy.SETime.length > 0 && this.cycleListCopy.SETime[0].length > 0 && this.cycleListCopy.SETime[1].length > 0) {
            this.getCondition()
          }
        } else {
          if (this.formValidateOk.formDate !== null) {
            if (this.formValidateOk.formDate.length > 0 && this.formValidateOk.formDate[0].length > 0 && this.formValidateOk.formDate[1].length > 0) {
              this.getCondition()
            }
          }
        }
      },
      // 添加周期性请假时间
      cycleModelOk () {
        // 没有选中的周次集合
        var isFalseLen = this.typeList.CycleList.filter(function (item) {
          return !item.Checked
        })
        // 没有填写请假时间的数组
        var isLenUper = []
        for (var i = 0, len = this.typeList.CycleList.length; i < len; i++) {
          if (this.typeList.CycleList[i].Checked) {
            if (this.typeList.CycleList[i].TimeList.length > 0) {
              for (var j = 0, jlen = this.typeList.CycleList[i].TimeList.length; j < jlen; j++) {
                if (this.typeList.CycleList[i].TimeList[j].SETime[0] === '') {
                  this.xy.msgError('请填写已添加周次起止时间。')
                  return
                }
                isLenUper = this.typeList.CycleList[i].TimeList[j].SETime.filter(function (sItem) {
                  return sItem.length === 0
                })
              }
            } else {
              isLenUper = [{}]
            }
          }
        }
        if (this.typeList.SETime[0].length === 0 || this.typeList.SETime[1].length === 0) {
          this.xy.msgError('请填写起止时间。')
          this.changeLoading()
        } else {
          if (isFalseLen.length === 7) {
            this.xy.msgError('请选择周次及请假时间。')
            this.changeLoading()
          } else {
            if (isLenUper.length > 0) {
              this.xy.msgError('请填写周次对应的请假时间。')
              this.changeLoading()
            } else {
              this.typeList.CycleList.map(function (item) {
                item.Times = []
                item.TimeList.map(function (child) {
                  item.Times.push({
                    StartTime: child.SETime[0],
                    EndTime: child.SETime[1]
                  })
                })
              })
              this.cycleListCopy = this.typeList
              this.formValidateOk.dataLoop = JSON.stringify(this.cycleListCopy)
              this.cycleModel = false
              this.radioType = '1'
              if (this.selectedTeachers.length > 0 || this.rowRoleType.RoleType === 3) {
                this.getCondition()
              }
            }
          }
        }
      },
      // 关闭周期性请假modal
      cycleModelCancel () {
        this.radioType = this.cycleListCopy.CycleList.length > 0 ? '1' : '0'
        this.cycleModel = false
      },
      // 周期性请假：添加每周时间控件，最多添加3个
      add (val) {
        if (val.TimeList.length < 3) {
          val.TimeList.push({
            SETime: []
          })
        }
      },
      // 周期性请假：删除每周时间控件
      del (val) {
        if (val.TimeList.length > 0) {
          val.TimeList.pop()
        }
      },
      // 周期性请假：选择起止时间
      cycleDateChange (val) {
        this.typeList.SETime = val
      },
      // 切换请假类型
      radioTypeChange (data) {
        this.radioType = data
        this.cycleModel = this.radioType === '1'
      },
      // 用户信息
      async GetUserInfo () {
        this.xy.loading()
        let res = await this.xy.get(
          this.xyApi + `/api/Users/GetUserInfo`
        )
        this.xy.unloading()
        if (res.success) {
          this.userId = res.data.UserID
        } else {
          this.xy.msgError(res.msg)
        }
      },
      dateChange (val) {
        console.log(val)
        this.formValidateOk.formDate = val
        if (this.selectedTeachers.length > 0 || this.rowRoleType.RoleType === 3) {
          this.getCondition()
        }
      },
      // 上传图片
      async changeFunc (e) {
        this.xy.loading()
        var filesUrls = e.target.files
        var imgMasSize = 1024 * 1024 * 10 // 10MB
        if (filesUrls.length > 6) {
          this.xy.unloading()
          this.xy.msgError('最多只能上传6张图片。')
          return
        }
        for (var i = 0; i < filesUrls.length; i++) {
          if (['jpeg', 'png', 'bmp', 'jpg'].indexOf(filesUrls[i].type.split('/')[1]) < 0) {
            this.xy.unloading()
            this.xy.msgError('文件类型仅支持 jpeg，png，jpg，bmp。')
            return
          };
          if (filesUrls[i].size > imgMasSize) {
            this.xy.unloading()
            this.xy.msgError('单张图片不能超过10M。')
            return
          };
        };
        var formData = new FormData()
        for (var j = 0; j < filesUrls.length; j++) {
          // name
          formData.append('name', filesUrls[j].name)
          // type
          formData.append('type', filesUrls[j].type)
          // size
          formData.append('size', filesUrls[j].size)
          // lastModifiedDate
          formData.append('lastModifiedDate', filesUrls[j].lastModifiedDate)
          // append 文件
          formData.append('File', filesUrls[j], 'photo.jpg')
        }
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + `/api/StudentLeave/IconUpload`, formData, true
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('图片上传成功。')
          this.defaltFileList = res.data.result
        } else {
          this.xy.msgError(res.msg)
        }
      },
      viewImg (val) {
        this.viewImgInfo = val
        this.viewImgModal = true
      },
      handleRemove (val, index) {
        this.defaltFileList.splice(index, 1)
      },
      moveImg (index) {
        console.log('jinru')
        this.isShowImg = index
      },
      leaveImg () {
        console.log('likai1')
        this.isShowImg = false
      },
      changeLoading () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      // 确认创建
      ok: function () {
        var _this = this
        // var isGo = false
        if (_this.rowRoleType.RoleType !== 3 && _this.selectedTeachers.length < 1) {
          _this.xy.msgError('请添加请假学生。')
          return false
        }
        if (_this.workFlowList.length < 1) {
          _this.xy.msgError('请添加审批流。')
          return false
        }
        this.$refs.formValidateOk.validate((valid) => {
          if (!valid) {
            return _this.changeLoading()
          } else {
            var sId = []; var flowNodes = []
            for (var i = 0; i < _this.selectedTeachers.length; i++) {
              sId.push(_this.selectedTeachers[i].UserID)
            };
            _this.workFlowList.forEach(function (item) {
              flowNodes.push({
                NodeType: item.NodeType, // 节点类型
                ApprovalFlowNodeName: item.WorkFlowNodeName, // 节点名称
                ApprovalMemberRoleID: item.ApprovalMemberRoleID, // 审批成员类型 1：职务角色 2：自定义角色
                ApprovalMemberType: item.ApprovalMemberType, //  审批成员类型 0：指定成员 1：职务角色 2：自定义角色 3：申请人选择
                ApprovalMode: item.ApprovalMode, // 审批模式  会签 = 1  或签 = 0
                IsApprovalMySelf: item.IsApprovalMySelf, // 审批人就是申请人（自己审批自己）
                IsApprovalComplete: item.IsApprovalComplete, // 审批人已经审批通过
                ApprovalUsers: [], // item.ApprovalMemberList, // 审批人
                CCUsers: [] // item.CheckedCcMemberList//抄送人
              })
            })
            for (var w = 0, wlen = _this.workFlowList.length; w < wlen; w++) {
              // 审批人
              if (_this.workFlowList[w].NodeType === 2) {
                if (_this.workFlowList[w].ApprovalMemberType === 0) { // 会签/或签
                  _this.workFlowList[w].isGo = true
                  _this.workFlowList[w].ApprovalMemberList.forEach(function (ap) {
                    flowNodes[w].ApprovalUsers.push(ap.UserID)
                  })
                } else { // 审批
                  if (_this.workFlowList[w].ApprovalMemberList.length > 0) {
                    _this.workFlowList[w].isGo = false
                    _this.workFlowList[w].CheckedApprovalMemberList.map(function (appItem) {
                      if (appItem.IsShow) {
                        _this.workFlowList[w].isGo = true
                        flowNodes[w].ApprovalUsers.push(appItem.UserID)
                      };
                    })
                  } else {
                    _this.workFlowList[w].isGo = false
                  }
                }
              } else {
                // 抄送人
                _this.workFlowList[w].CheckedCcMemberList.forEach(function (cc) {
                  flowNodes[w].CCUsers.push(cc.UserID)
                })
              }
            };
            for (var isgo = 0; isgo < _this.workFlowList.length; isgo++) {
              if (_this.workFlowList[isgo].isGo === false) {
                _this.xy.msgError('审批人不能为空。')
                return false
              }
            }
            var options = {
              LeaveTypeID: _this.formValidateOk.typeValueID, // 请假类型
              StudentIDs: _this.rowRoleType.RoleType === 3 ? [ _this.rowRoleType.UserID ] : sId, // 请假学生
              StartTime: _this.radioType === '1' ? _this.cycleListCopy.SETime[0] : _this.formValidateOk.formDate[0], // 开始时间
              EndTime: _this.radioType === '1' ? _this.cycleListCopy.SETime[1] : _this.formValidateOk.formDate[1], // 结束时间
              CycleList: [], // 周期性请假时间
              Images: _this.defaltFileList, // 请假图片
              IsCycleLeave: _this.radioType === '1', // 是否周期性请假
              IsLeaveSchool: _this.formValidateOk.leaveSchool === '1', // 是否离校
              ApplicationDescription: _this.formValidateOk.textarea, // 请假原因
              ApplicationType: _this.rowRoleType.RoleType === 3 ? '1' : '2', // 1自己，2代请假
              ApprovalFlowNodes: flowNodes// 审批流
            }
            for (let i = 0, len = _this.cycleListCopy.CycleList.length; i < len; i++) {
              if (_this.cycleListCopy.CycleList[i].Checked) {
                options.CycleList.push({
                  Week: _this.cycleListCopy.CycleList[i].Week,
                  TimeList: _this.cycleListCopy.CycleList[i].Times
                })
              }
            };
            this.Create(options)
          }
        })
      },
      async Create (options) {
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + `/api/StudentLeave/Create`, options
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('创建成功。')
          this.$refs.formValidateOk.resetFields()
          this.$router.back()
        } else {
          this.changeLoading()
        }
      },
      // 关闭创建
      cancel: function (name) {
        this.$router.back()
      }
    }
  }
</script>
<style lang="less" scoped>
/deep/ .cycleLeave .ivu-modal-body {
  padding: 15px 24px 20px;
  max-height: 560px;
  overflow-y: auto;
}
.modalTit {
  display: flex;
  align-items: center;
  padding-left: 24px;
  margin-bottom: 20px;
  >span {
    margin-right: 10px;
  }
}

.weekMain {
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 560px;
  height: 106px;
  padding: 15px 20px 20px;
  .timeList {
    display: flex;
    align-items: center;
  }
  .weekDay {
    font-size: 16px;
    font-weight: bold;
    color: rgba(0, 0, 0, .85);
    line-height: 26px;
    margin-bottom: 15px;
    display: inline-block;
  }
}

.add-student-list{
  border: 1px solid #dcdee2;
  border-radius: 4px;
  padding: 5px 0 5px 10px;
  >div {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .add-student-btn {
    width: 60px;
    height: 22px;
    line-height: 22px;
    border-radius: 4px;
    border: 1px dashed #ddd;
    display: inline-block;
    margin: 2px 4px 2px 0;
    padding: 0 8px;
    font-size: 12px;
    color: #666;
  }
}
.upLoad-img{
  display: flex;
  flex-wrap: wrap;
  .upLoad-list-img{
    position: relative;
    overflow: hidden;
    width: 128px;
    height: 80px;
    text-align: center;
    margin: 10px;
    .cursor-img{
      display: inline-block;
      height: 100%;
      overflow: hidden;
    }
    .upload-list-cover{
      width:128px;
      height: 80px;
      background: rgba(0, 0, 0, .55);
      z-index: 999;
      position: absolute;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

</style>
