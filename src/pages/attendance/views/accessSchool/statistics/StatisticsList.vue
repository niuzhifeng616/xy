<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <span>校区/年级/班级：</span>
      <Cascader
        :data="options_data.schoolGradeClass_list"
        v-model="options_filter.schoolGradeClass_value"
        style="display: inline-block;width:280px;"
        :clearable="false"
        v-on:on-change="selectClass"
        v-if="status.cascader_schoolClass"
        ></Cascader>
      <span style="margin-left: 20px">学期/学年：</span>
      <Cascader
        :data="options_data.academicYearSemester_list"
        v-model="options_filter.academicYearSemester_value"
        style="display: inline-block;width:210px;margin-left:10px"
        :clearable="false"
        v-on:on-change="selectSemester"
        ></Cascader>
      <span style="margin-left: 20px">区间：</span>
      <Select
        v-model="options_filter.timePart"
        style="display: inline-block;width:160px;margin-left:10px"
        v-on:on-change="selectTimePart"
        >
        <Option
          v-for="item in options_data.timePart"
          :value="item.value"
          :key="item.value"
          >
          {{ item.label }}
        </Option>
      </Select>
      <RadioGroup
        v-model="options_filter.type_time"
        type="button"
        v-on:on-change="changeTimeType"
        style="margin-left:20px"
        >
        <Radio
          v-for="item in options_data.type_time"
          :key="item.value"
          :label="item.value"
        >{{item.label}}
        </Radio>
      </RadioGroup>
      <DatePicker
        style="width: 210px;"
        v-if="status.datePicker_show"
        v-model="options_filter.datePicker_rangeValue"
        type="daterange"
        confirm
        :clearable="false"
        placeholder="请选择日期范围"
        :options="options_filter.date_range_options"
        v-on:on-change="datePicker_change"
        v-on:on-ok="datePicker_confirm"
        ></DatePicker>
    </div>
    <div class="xy-content-body">
      <div class="attEES-content-wrapper">
        <div class="attEES-content-header">
          <Button style="margin: auto 0" class="xy-primary" @click="exportFile">导出</Button>
          <div>
            <div v-show="options_filter.type_time !== 4" class="">
              <!--<a
                href="javascript:;"
                v-on:click="selectPrevious"
                v-if="btn_previousDate_enable"
              >-->
                <Icon class="cursor-p" type="ios-arrow-back" v-on:click="selectPrevious" v-if="btn_previousDate_enable" style="margin-right: 8px;"/>
              <!--</a>-->
              <span v-show="options_filter.type_time !== 1"
              >{{selectorStartTime}} ~ {{selectorEndTime}}</span
              >
              <span v-show="options_filter.type_time === 1"
              >{{selectorStartTime}}</span
              >
             <!--<a
                href="javascript:;"
                v-on:click="selectNext"
                v-show="btn_afterDate_enable"
              >-->
                <Icon class="cursor-p" type="ios-arrow-forward"  v-on:click="selectNext" v-if="btn_afterDate_enable" style="margin-left: 8px;"/>
              <!--</a>-->
            </div>
          </div>
          <div>
            <a
              v-on:click="router_pop"
              v-show="panel_router.length > 0"
              href="javascript:;"
              style=" padding: 5px;
                    margin-right: 2em;
                    vertical-align: middle;"
            >
              <Icon type="md-arrow-back"/>
              上一级</a
            >
          </div>
        </div>
        <div class="attEES-content-body clearfix">
          <div class="attEES-panel-statist">
            <p v-if="view_type === 3">
              {{options_filter.currentGrade.Grade ||
              options_filter.currentGrade.label}}{{options_filter.currentClass.Class
              || options_filter.currentClass.label}}
            </p>
            <div class="attEES-statist-personBlock" v-if="view_type === 3">
              <div class="attEES-avatar-wrapper large">
                <img
                  v-show="options_filter.studentData.Icon"
                  :title="options_filter.studentData.StudentName"
                  :src="options_filter.studentData.Icon"
                  class="attEES-avatar-img"
                />
                <span
                  v-show="!options_filter.studentData.Icon"
                  :title="options_filter.studentData.StudentName"
                  class="attEES-avatar-font"
                >{{showName(options_filter.studentData.StudentName)}}</span
                >
              </div>
              <div class="attEES-personBlock-content">
                <p class="attEES-personBlock-name">
                  {{options_filter.studentData.StudentName}}
                </p>
                <p>{{options_filter.studentData.UserName}}</p>
              </div>
            </div>
            <p>
              数据汇总
            </p>
            <div class="details">
              <div class="fontPos" v-show="view_type === 3">
                考勤次数：
                <div class="times">
                  <span class="rateFont">{{statistics_data.AttendancePassengers}}次</span>
                </div>
              </div>
              <div class="fontPos" v-show="view_type !== 3">
                考勤人次：
                <div class="times">
                  <span class="rateFont">{{hundred}}%</span>
                  <span class="rateFont">{{statistics_data.AttendancePassengers}}次</span>
                </div>
              </div>
              <div class="detailsFoot">
                <div class="detailsFootL" style="background: #ffbf00;">
                  <img src="../img/mine_small.png" alt="">
                </div>
                <div class="detailsFootR">
                  <Slider v-model="hundred" :disabled="true" />
                </div>
              <div class="attEES-statist-btn">
                <a href="javascript:;" v-on:click="checkStatisticDetail(0)">详情</a>
              </div>
              </div>
            </div>
            <div class="details">
              <div class="fontPos" v-show="view_type === 3">
                正常次数：
                <div class="times">
                  <span class="rateFont">{{statistics_data.NormalPassengers}}次</span>
                </div>
              </div>
              <div class="fontPos" v-show="view_type !== 3">
                正常人次：
                <div class="times">
                  <span class="rateFont">{{statisticData_percentage_calculation.NormalPassengers}}%</span>
                  <span class="rateFont">{{statistics_data.NormalPassengers}}次</span>
                </div>
              </div>
              <div class="detailsFoot">
                <div class="detailsFootL" style="background: #7BCE7B;">
                  <img src="../img/mine_small.png" alt="">
                </div>
                <div class="detailsFootR">
                  <Slider v-model="statisticData_percentage_calculation.NormalPassengers" :disabled="true" />
                </div>
              <div class="attEES-statist-btn">
                <a href="javascript:;" v-on:click="checkStatisticDetail(1)">详情</a>
              </div>
              </div>
            </div>
            <div class="details">
              <div class="fontPos" v-show="view_type === 3">
                迟到次数：
                <div class="times">
                  <span class="rateFont">{{statistics_data.MLate}}次</span>
                </div>
              </div>
              <div class="fontPos" v-show="view_type !== 3">
                迟到人次：
                <div class="times">
                  <span class="rateFont">{{statisticData_percentage_calculation.MLate}}%</span>
                  <span class="rateFont">{{statistics_data.MLate}}次</span>
                </div>
              </div>
              <div class="detailsFoot">
                <div class="detailsFootL" style="background: #1890FF;">
                  <img src="../img/mine_small.png" alt="">
                </div>
                <div class="detailsFootR">
                  <Slider v-model="statisticData_percentage_calculation.MLate" :disabled="true" />
                </div>
              <div class="attEES-statist-btn">
                <a href="javascript:;" v-on:click="checkStatisticDetail(2)">详情</a>
              </div>
              </div>
            </div>
            <div class="details">
              <div class="fontPos" v-show="view_type === 3">
                未识别次数：
                <div class="times">
                  <span class="rateFont">{{statistics_data.unidentificationMens}}次</span>
                </div>
              </div>
              <div class="fontPos" v-show="view_type !== 3">
                未识别人次：
                <div class="times">
                  <span class="rateFont">{{statisticData_percentage_calculation.unidentificationMens}}%</span>
                  <span class="rateFont">{{statistics_data.unidentificationMens}}次</span>
                </div>
              </div>
              <div class="detailsFoot">
                <div class="detailsFootL" style="background: #4F5950;">
                  <img src="../img/mine_small.png" alt="">
                </div>
                <div class="detailsFootR">
                  <Slider v-model="statisticData_percentage_calculation.unidentificationMens" :disabled="true" />
                </div>
              <div class="attEES-statist-btn">
                <a href="javascript:;" v-on:click="checkStatisticDetail(4)">详情</a>
              </div>
              </div>
            </div>
            <div class="details">
              <div class="fontPos" v-show="view_type === 3">
                请假次数：
                <div class="times">
                  <span class="rateFont">{{statistics_data.AskForLeaveMens}}次</span>
                </div>
              </div>
              <div class="fontPos" v-show="view_type !== 3">
                请假人次：
                <div class="times">
                  <span class="rateFont">{{statisticData_percentage_calculation.AskForLeaveMens}}%</span>
                  <span class="rateFont">{{statistics_data.AskForLeaveMens}}次</span>
                </div>
              </div>
              <div class="detailsFoot">
                <div class="detailsFootL" style="background: #ffbf00;">
                  <img src="../img/mine_small.png" alt="">
                </div>
                <div class="detailsFootR">
                  <Slider v-model="statisticData_percentage_calculation.AskForLeaveMens" :disabled="true" />
                </div>
              <div class="attEES-statist-btn">
                <a href="javascript:;" v-on:click="checkStatisticDetail(3)">详情</a>
              </div>
              </div>
            </div>
            <p class="attEES-statist-date">数据截止到：{{statistics_gotTime}}</p>
          </div>
          <div class="attEES-panel-dataArea">
            <XyAntTable
              :columns="table_currentCaption"
              :dataSource="detail_data"
              :nullData="nullData"
              :tableLoading="tableLoading"
              :pagination="pagination"
              :scrollx="'max-content'"
              @change="handleTableChange"
              >
                <div slot="Grade" style="min-width:100px" slot-scope="text, record,type">
                  <span class="table-el-hover" @click="changeType(record,type)">
                    {{record.Grade}}
                  </span>
                </div>
                <div slot="Class" style="min-width:100px" slot-scope="text, record,type">
                  <span class="table-el-hover" @click="changeType(record,type)">
                    {{record.Class}}
                  </span>
                </div>
                <div slot="Icon" slot-scope="text, record">
                <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
                  <span class="head-font">
                    {{ xy.showName(record.StudentName)}}
                  </span>
                </div>
                <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
              </div>
              <div slot="StudentName" style="min-width:100px"  slot-scope="text, record,type">
                <span class="table-el-hover" @click="changeType(record,type)">
                  {{record.StudentName}}
                </span>
              </div>
                <span slot="operation" slot-scope="text, record,type">
                  <a @click="changeType(record,type)">查看</a>
                </span>
            </XyAntTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'StatisticsList',
    components: {
      XyAntTable
    },
    data () {
      // var self = this
      return {
        hundred: 100,
        nullData: '该搜索条件下没有结果。',
        total: 0,
        pageSize: 15,
        pageIndex: 1,
        tableLoading: true,
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        // 上方筛选工具栏
        options_data: {
          schoolGradeClass_list: [], // 校区、年级、班级
          academicYearSemester_list: [], // 学年，学期
          timePart: [ // 当天时间区间
            {
              label: '所有区间',
              value: -1
            }
          ],
          type_time: [ // 时间段类型
            {
              label: '天',
              value: 1
            },
            {
              label: '周',
              value: 2
            },
            {
              label: '月',
              value: 3
            },
            {
              label: '自定义',
              value: 4
            }
          ]
        },
        // 左侧数据汇总栏
        statistics_data: {},
        // 详细数据表格
        detail_data: [],

        /* ------- [Start] 控制 ------- */
        options_filter: {
          /* --- [Start] 工具栏筛选 --- */
          schoolGradeClass_value: [undefined, -1, -1], // 校区、年级、班级
          academicYearSemester_value: [undefined, undefined], // 学年，学期
          timePart: -1, // 当天时间区间
          type_time: 2, // 天：1，周：2，月：3，自定义：4
          date_range: [
            this.xy.moment().startOf('isoWeek')._d,
            this.xy.moment().endOf('isoWeek')._d
          ], // 无论选择的是何种时间类型，均填写该项；用于：当前选择的时间区间，即包含自定义时间段
          datePicker_rangeValue: [
            this.xy.moment().startOf('isoWeek')._d,
            this.xy.moment().endOf('isoWeek')._d
          ],
          date_range_options: {
            disabledDate: function (date) {
              return date.getTime() > new Date(new Date().setHours(0, 0, 0, 0))
            }
          },
          currentYear: undefined,
          currentSemester: undefined,
          /* --- [End] 工具栏筛选 --- */

          /* --- [Start] 当前筛选状态 --- */
          type_attendance: undefined, // 数据汇总状态(0:考勤人次，1：正常人次,2：迟到人次,3:请假人次 , 4: 未识别人次)
          userID: undefined,
          studentData: undefined,

          currentGrade: undefined,
          currentClass: undefined
          /* --- [End] 当前筛选状态 --- */
        },
        checkType: undefined,
        view_type: 0, // 当前视图模式。0：校区统计维度视图；1：年级统计维度视图；2：班级统计维度视图；3：个人统计维度视图；
        view_filterModel: false, // 注意：按类型统计筛选视图（统计筛选） 与 校区、年级、班级、个人为并列关系
        panel_router: [], // 视图路由
        firstRun_status: {
          ready: false,
          received_classList: false,
          received_semesterList: false
        },
        table_pageCfg: {
          isInitial: false,
          isEmpty: false
        },
        status: {
          cascader_schoolClass: true,
          datePicker_show: false
        },
        /* ------- [End] 控制 ------- */

        /* ------- [Start] 视图 ------- */
        // 显示当前维度标题
        panel_currentTitle: '',
        // 表格标题。【注意】均不含操作栏，仅包含数据；操作栏通过专门的方法添加。
        table_caption: [
          // 添加操作栏的方法：setTableData
          // 0.校区
          [
            {
              title: '年级',
              dataIndex: 'Grade',
              width: 100,
              scopedSlots: { customRender: 'Grade' }
            },
            {
              title: '学生人数',
              dataIndex: 'StudentCount',
              width: 100,
              scopedSlots: { customRender: 'StudentCount' }
            },
            {
              title: '考勤人次',
              dataIndex: 'AttendancePassengers',
              width: 100,
              scopedSlots: { customRender: 'AttendancePassengers' }
            },
            {
              title: '正常人次',
              dataIndex: 'NormalPassengers',
              width: 100,
              scopedSlots: { customRender: 'NormalPassengers' }
            },
            {
              title: '迟到人次',
              dataIndex: 'MLate',
              width: 100,
              scopedSlots: { customRender: 'MLate' }
            },
            {
              title: '未识别人次',
              dataIndex: 'unidentificationMens',
              width: 120,
              scopedSlots: { customRender: 'unidentificationMens' }
            },
            {
              title: '请假人次',
              dataIndex: 'AskForLeaveMens',
              width: 100,
              scopedSlots: { customRender: 'AskForLeaveMens' }
            }
          ],
          // 1.年级
          [
            {
              title: '班级',
              dataIndex: 'Class',
              scopedSlots: { customRender: 'Class' }
            },
            {
              title: '学生人数',
              dataIndex: 'StudentCount'
            },
            {
              title: '考勤人次',
              dataIndex: 'AttendancePassengers'
            },
            {
              title: '正常人次',
              dataIndex: 'NormalPassengers'
            },
            {
              title: '迟到人次',
              dataIndex: 'MLate'
            },
            {
              title: '未识别人次',
              dataIndex: 'unidentificationMens'
            },
            {
              title: '请假人次',
              dataIndex: 'AskForLeaveMens'
            }
          ],
          // 2.班级
          [
            {
              title: '',
              dataIndex: 'Icon',
              width: 46,
              className: 'table-pic',
              fixed: 'left',
              scopedSlots: { customRender: 'Icon' }
            },
            {
              title: '姓名',
              dataIndex: 'StudentName',
              fixed: 'left',
              scopedSlots: { customRender: 'StudentName' }
            },
            {
              title: '用户名',
              dataIndex: 'UserName',
              width: 120
            },
            {
              title: '考勤次数',
              dataIndex: 'AttendanceCount'
            },
            {
              title: '正常次数',
              dataIndex: 'NormalCount'
            },
            {
              title: '迟到次数',
              dataIndex: 'MLateCount'
            },
            {
              title: '未识别次数',
              dataIndex: 'unidentificationCount'
            },
            {
              title: '请假次数',
              dataIndex: 'AskForLeaveCount'
            }
          ],
          // 3.个人 &  个人的统计筛选视图
          [
            {
              title: '日期',
              dataIndex: 'ShortDate',
              minWidth: 120
            },
            {
              title: '区间',
              dataIndex: 'section',
              width: 100
            },
            {
              title: '进校时间',
              dataIndex: 'ShsectionortTime',
              minWidth: 100
            },
            {
              title: '状态',
              dataIndex: 'StudentState',
              width: 100
            }
          ],
          // 4.按类型统计筛选视图(统计筛选) || 与上述维度类型不同
          [
            {
              title: '',
              dataIndex: 'Icon',
              width: 46,
              className: 'table-pic',
              fixed: 'left',
              scopedSlots: { customRender: 'Icon' }
            },
            {
              title: '姓名',
              dataIndex: 'StudentName',
              fixed: 'left',
              width: 120
            },
            {
              title: '用户名',
              dataIndex: 'UserName',
              width: 120
            },
            {
              title: '班级',
              dataIndex: 'GardeClass',
              width: 150
            },
            {
              title: '班主任',
              dataIndex: 'ClassTeacher',
              width: 150
            },
            {
              title: '日期',
              dataIndex: 'ShortDate',
              width: 120
            },
            {
              title: '区间',
              dataIndex: 'section',
              width: 80
            },
            {
              title: '进校时间',
              dataIndex: 'ShsectionortTime',
              width: 150
            },
            {
              title: '状态',
              dataIndex: 'StudentState',
              width: 100
            }
          ]
        ],
        table_currentCaption: [],
        // 左侧数据获取时间
        statistics_gotTime: '',
        /* ------- [End] 视图 ------- */
        applicationID: '',
        applicationSubMenuID: '',
        base: ''

      }
    },
    computed: {
      idArr () {
        return this.$store.state.common.menuId
      },
      // 格式化后的开始时间
      selectorStartTime () {
        return this.xy.moment(this.options_filter.date_range[0]).format('YYYY/MM/DD')
      },
      // 格式化后的结束时间
      selectorEndTime () {
        return this.xy.moment(this.options_filter.date_range[1]).format('YYYY/MM/DD')
      },
      // 限定向前按钮的边界
      btn_previousDate_enable () {
        var cs = this.options_filter.currentSemester
        if (cs && cs.StartDate) {
          let semester = this.xy.moment(cs.StartDate)
          let selected = this.xy.moment(this.options_filter.date_range[0])
          return semester.isBefore(selected)
        } else {
          return false
        }
      },
      // 限定向后按钮的边界
      btn_afterDate_enable () {
        var cs = this.options_filter.currentSemester
        if (cs && cs.EndDate) {
          let semester = this.xy.moment(cs.EndDate)
          let selected = this.xy.moment(this.options_filter.date_range[1])
          return semester.add(1, 'day').isAfter(selected) && selected.isBefore(this.xy.moment().startOf('day'))
        } else {
          return false
        }
      },
      // 统计百分比计算
      statisticData_percentage_calculation () {
        let d = this.statistics_data
        if (d && typeof d.AttendancePassengers === 'number' && !isNaN(d.AttendancePassengers) && d.AttendancePassengers !== 0) {
          return {
            AskForLeaveMens: Number(((d.AskForLeaveMens / d.AttendancePassengers) * 100).toFixed(2)),
            NormalPassengers: Number(((d.NormalPassengers / d.AttendancePassengers) * 100).toFixed(2)),
            MLate: Number(((d.MLate / d.AttendancePassengers) * 100).toFixed(2)),
            unidentificationMens: Number(((d.unidentificationMens / d.AttendancePassengers) * 100).toFixed(2))
          }
        } else {
          return {
            AskForLeaveMens: 0,
            NormalPassengers: 0,
            MLate: 0,
            unidentificationMens: 0
          }
        }
      }
    },

    watch: {
      idArr: {
        handler (newVal) {
          let idArr = newVal.split(',')
          this.applicationID = idArr[1]
          this.applicationSubMenuID = idArr[2]
          this.getClassList()
        },
        immediate: true
      }
    },
    created () {
      this.base = `${this.xyApi}/base`
      this.apiPath = this.xyApi + '/att'
      this.getYearSemester()
      this.getTimeSection()
    },
    methods: {
      changeType (params, type) {
        if (this.view_filterModel) {
          type = -1
        } else {
          // 当前视图模式
          switch (this.view_type) {
            case 0:
              // 校区视图
              type = 0
              break
            case 1:
              // 年级视图
              type = 1
              break
            case 2:
              // 班级视图
              type = 2
              break
            case 3:
              // 个人视图
              type = 3
              break
            default:
              // 校区视图
              type = 0
              break
          }
        }
        this.checkDetail(params, type)
      },
      // 获取：校、年级、班级数据
      async getClassList () {
        let that = this
        let params = {
          applicationID: that.applicationID,
          applicationSubMenuID: that.applicationSubMenuID
        }
        let rs = await that.xy.get(that.xyApi + '/xy/comm/GetUserRangeClassPermission', params)
        if (rs.success) {
          let data = rs.data
          data.forEach((itemSchool) => {
            itemSchool.children.unshift({
              label: '所有年级',
              value: -1,
              children: []
            })
            itemSchool.children.forEach(function (itemGrade) {
              itemGrade.children.unshift({
                label: '所有班级',
                value: -1
              })
            })
          })
          if (data.length !== 0) {
            that.options_data.schoolGradeClass_list = data
            that.options_filter.schoolGradeClass_value = [data[0].value, -1, -1]
            if (that.panel_currentTitle === '') {
              that.setTitle(data[0].label)
            }
          }

          // 是否初始化完成
          that.firstRun_status.received_classList = true
          if (!that.firstRun_status.ready && that.firstRun_status.received_semesterList) {
            that.getDetail()
            that.firstRun_status.ready = true
          }
        }
      },

      // 获取：学年、学期
      async getYearSemester () {
        let that = this
        let rs = await this.xy.get(this.xyApi + '/xy/comm/GetSessionNodeList')
        if (rs.success) {
          let data = rs.data
          that.options_data.academicYearSemester_list = data
          let currentYear = { label: '', value: '' }
          let currentSemester = { label: '', value: '' }
          // 寻找当前学年
          for (let yearI = 0; yearI < data.length; yearI++) {
            if (data[yearI].IsCurrent) {
              currentYear = data[yearI]
              // 寻找当前学期
              for (let semesterI = 0; semesterI < data[yearI].children.length; semesterI++) {
                if (data[yearI].children[semesterI].IsCurrent) {
                  currentSemester = data[yearI].children[semesterI]
                  console.log(currentSemester, '?????')
                  break
                }
              }
              break
            }
          }
          that.options_filter.currentYear = currentYear
          that.options_filter.currentSemester = currentSemester
          // 默认选择当前学期
          that.options_filter.academicYearSemester_value = [currentYear.value, currentSemester.value]
          // console.log(that.options_filter.academicYearSemester_value)
          // 是否初始化完成
          that.firstRun_status.received_semesterList = true
          if (!that.firstRun_status.ready && that.firstRun_status.received_classList) {
            that.getDetail()
            that.firstRun_status.ready = true
          }

          // 预设自定义时间选择器
          that.options_filter.date_range_options = {
            disabledDate: function (date) {
              return date.getTime() > new Date(new Date().setHours(0, 0, 0, 0)) || !(date.getTime() >= new Date(currentSemester.StartDate.replace(/-/g, '/')).getTime() && date.getTime() <= new Date(currentSemester.EndDate.replace(/-/g, '/')))
            }
          }
        }
      },
      // 获取：详细数据
      /*
       * 参数： {
       *          resetPageIndex: 不重置页面为1；默认：重置 - true。
       *       }
      */
      async getDetail (config) {
        this.tableLoading = true
        config = config || {}
        config.resetPageIndex = config.resetPageIndex === undefined ? true : config.resetPageIndex
        if (config.resetPageIndex) {
          this.pageIndex = 1
          this.pagination.current = 1
        }
        let p = this.options_filter
        // let idArr = window.localStorage.getItem('menuID').split(',')
        let params = {
          academicSessionId: p.academicYearSemester_value[1] === -1 ? '' : p.academicYearSemester_value[1], // 学期iD
          schoolDistrictID: p.schoolGradeClass_value[0] === -1 ? '' : p.schoolGradeClass_value[0], // 校区ID
          studentGradeForStudentYearID: p.schoolGradeClass_value[1] === -1 ? '' : p.schoolGradeClass_value[1], // 年级ID
          studentOrganizationID: p.schoolGradeClass_value[2] === -1 ? '' : p.schoolGradeClass_value[2], // 班级ID
          section: p.timePart === -1 ? '' : p.timePart, // 区间ID
          contantSatrTime: p.date_range[0] ? this.xy.moment(p.date_range[0]).format('YYYY-MM-DD') : '', // 自定义起始时间
          contantEndTime: p.date_range[1] ? this.xy.moment(p.date_range[1]).format('YYYY-MM-DD') : '', // 自定义起始时间
          state: p.type_attendance !== undefined ? p.type_attendance : -1, // 数据汇总状态(undefined(空):全部;0:考勤人次，1：正常人次,2：迟到人次,3:请假人次 , 4: 未识别人次)
          userID: p.userID ? p.userID : '', // 姓名ID
          // PageIndex: this.pageIndex, // 当前页
          // PageSize: this.pageSize, // 每页几条
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          applicationID: this.applicationID,
          applicationSubMenuID: this.applicationSubMenuID
        }
        let rs = await this.xy.get(this.apiPath + '/api/StatisticsCampus/FindGoShcoolStatistics', params)
        if (rs.success) {
          this.setTableData(rs.data)
          this.tableLoading = false
        }
      },
      // 导出文件
      async exportFile () {
        // 参数与 getDetail 大致相同
        let p = this.options_filter
        // let idArr = window.localStorage.getItem('menuID').split(',')
        let params = {
          academicSessionId: p.academicYearSemester_value[1] === -1 ? '' : p.academicYearSemester_value[1], // 学期ID
          schoolDistrictID: p.schoolGradeClass_value[0] === -1 ? '' : p.schoolGradeClass_value[0], // 校区ID
          studentGradeForStudentYearID: p.schoolGradeClass_value[1] === -1 ? '' : p.schoolGradeClass_value[1], // 年级ID
          studentOrganizationID: p.schoolGradeClass_value[2] === -1 ? '' : p.schoolGradeClass_value[2], // 班级ID
          section: p.timePart === -1 ? '' : p.timePart, // 区间ID
          contantSatrTime: p.date_range[0] ? this.xy.moment(p.date_range[0]).format('YYYY-MM-DD') : '', // 自定义起始时间
          contantEndTime: p.date_range[1] ? this.xy.moment(p.date_range[1]).format('YYYY-MM-DD') : '', // 自定义起始时间
          state: p.type_attendance !== undefined ? p.type_attendance : -1, // 数据汇总状态(0:考勤人次，1：正常人次,2：迟到人次,3:请假人次 , 4: 未识别人次)
          userID: p.userID ? p.userID : '', // 姓名ID
          applicationID: this.applicationID,
          applicationSubMenuID: this.applicationSubMenuID
        }

        this.xy.downFile(
          `${this.$store.state.apiPath}/api/StatisticsCampus/ExportGoShcoolStatistics`,
          {
            schoolDistrictID: params.schoolDistrictID,
            section: params.section,
            studentGradeForStudentYearID: params.studentGradeForStudentYearID,
            studentOrganizationID: params.studentOrganizationID,
            contantSatrTime: params.contantSatrTime,
            contantEndTime: params.contantEndTime,
            state: params.state,
            userID: params.userID,
            applicationID: params.applicationID,
            applicationSubMenuID: params.applicationSubMenuID
          }
        )
      },
      // 设置：表格的数据
      setTableData (data, type) {
        // let that = this
        if (this.checkType !== '详情') {
          this.statistics_data = data.dataSummarization
          this.statistics_gotTime = this.xy.moment(data.dataSummarization.EndTime).format('YYYY-MM-DD HH:mm')
        }
        /* --- 各维度判断 --- */
        // let type
        let btnOperation = {
          title: '操作',
          dataIndex: 'operation',
          width: 80,
          scopedSlots: { customRender: 'operation' }
        }
        this.table_currentCaption = []
        // 是否进入左侧筛选项目
        if (this.view_filterModel) {
          this.table_pageCfg.isEmpty = !data.serach || data.serach.length === 0
          if (data.serach) {
            this.detail_data = data.serach.data
            this.total = data.serach.totalRecords
            this.pagination.total = data.serach.totalRecords
          }
          type = -1
          if (this.view_type === 3) {
            this.table_currentCaption = this.table_caption[3].map((item) => {
              return item
            })
          } else {
            this.table_currentCaption = this.table_caption[4].map((item) => {
              return item
            })
          }
        } else {
          // 当前视图模式
          switch (this.view_type) {
            case 0:
              // 校区视图
              this.table_pageCfg.isEmpty = !data.schoolDimension || data.schoolDimension.length === 0
              if (data.schoolDimension) {
                this.detail_data = data.schoolDimension.data
                this.total = data.schoolDimension.totalRecords
                this.pagination.total = data.schoolDimension.totalRecords
              }
              type = 0
              this.table_currentCaption = this.table_caption[0].map((item) => {
                return item
              })
              this.table_currentCaption.push(btnOperation)
              break
            case 1:
              // 年级视图
              this.table_pageCfg.isEmpty = !data.gardeDimension || data.gardeDimension.length === 0
              if (data.gardeDimension) {
                this.detail_data = data.gardeDimension.data
                this.total = data.gardeDimension.totalRecords
                this.pagination.total = data.gardeDimension.totalRecords
              }
              type = 1
              this.table_currentCaption = this.table_caption[1].map((item) => {
                return item
              })
              this.table_currentCaption.push(btnOperation)
              break
            case 2:
              // 班级视图
              this.table_pageCfg.isEmpty = !data.classDimension || data.classDimension.length === 0
              if (data.classDimension) {
                this.detail_data = data.classDimension.data
                this.total = data.classDimension.totalRecords
                this.pagination.total = data.classDimension.totalRecords
              }
              type = 2
              this.table_currentCaption = this.table_caption[2].map((item) => {
                return item
              })
              this.table_currentCaption.push(btnOperation)
              break
            case 3:
              // 个人视图
              this.table_pageCfg.isEmpty = !data.personnelDimension || data.personnelDimension.length === 0
              if (data.personnelDimension) {
                this.detail_data = data.personnelDimension.data
                this.total = data.personnelDimension.totalRecords
                this.pagination.total = data.personnelDimension.totalRecords
              }
              type = 3
              this.table_currentCaption = this.table_caption[3].map((item) => {
                return item
              })
              break
            default:
              // 校区视图
              this.view_type = 0
              this.table_pageCfg.isEmpty = !data.schoolDimension || data.schoolDimension.length === 0
              if (data.schoolDimension) {
                this.detail_data = data.schoolDimension.data
                this.total = data.schoolDimension.totalRecords
                this.pagination.total = data.schoolDimension.totalRecords
              }
              type = 0
              this.table_currentCaption = this.table_caption[0].map((item) => {
                return item
              })
              this.table_currentCaption.push(btnOperation)
              break
          }
        }
        this.table_pageCfg.isInitial = false
      },
      // 获取：当日时间区间类型
      async getTimeSection () {
        let rs = await this.xy.get(this.apiPath + '/api/ProgrammeSetting/GetAllSection')
        if (rs.success) {
          rs.data.forEach((item) => {
            this.options_data.timePart.push({
              label: item.SchoolAccessTimeSectionName,
              value: item.SchoolAccessTimeSectionID,
              Level: item.Level
            })
          })
        }
      },
      // 选择：时间区间类型
      changeTimeType (val) {
        this.checkType = undefined
        let that = this
        this.status.datePicker_show = false
        // 是否为当前学期
        let selectedSemester = this.options_filter.currentSemester
        if (selectedSemester.IsCurrent) {
          switch (val) {
            case 1:
              // 天
              this.options_filter.date_range = [
                this.xy.moment().startOf('day')._d,
                this.xy.moment().endOf('day')._d
              ]
              this.getDetail()
              break
            case 2:
              // 周
              this.options_filter.date_range = [
                this.xy.moment().startOf('isoWeek')._d,
                this.xy.moment().endOf('isoWeek')._d
              ]
              this.getDetail()
              break
            case 3:
              // 月
              this.options_filter.date_range = [
                this.xy.moment().startOf('month')._d,
                this.xy.moment().endOf('month')._d
              ]
              this.getDetail()
              break
            case 4:
              // 自定义：初始化日历选择器
              let d = this.options_filter.date_range
              if (d[0]._isAMomentObject) {
                d[0] = d[0]._d
              }
              if (d[1]._isAMomentObject) {
                d[1] = d[1]._d
              }
              this.options_filter.datePicker_rangeValue = [d[0], d[1]]
              this.$nextTick(() => {
                that.status.datePicker_show = true
              })
              break
            default:
              break
          }
        } else {
          switch (val) {
            case 1:
              // 天
              this.options_filter.date_range = [
                this.xy.moment(selectedSemester.StartDate).startOf('day')._d,
                this.xy.moment(selectedSemester.StartDate).endOf('day')._d
              ]
              this.getDetail()
              break
            case 2:
              // 周
              this.options_filter.date_range = [
                this.xy.moment(selectedSemester.StartDate).startOf('isoWeek')._d,
                this.xy.moment(selectedSemester.StartDate).endOf('isoWeek')._d
              ]
              this.getDetail()
              break
            case 3:
              // 月
              this.options_filter.date_range = [
                this.xy.moment(selectedSemester.StartDate).startOf('month')._d,
                this.xy.moment(selectedSemester.StartDate).endOf('month')._d
              ]
              this.getDetail()
              break
            case 4:
              // 自定义：初始化日历选择器
              let d = this.options_filter.date_range
              if (d[0]._isAMomentObject) {
                d[0] = d[0]._d
              }
              if (d[1]._isAMomentObject) {
                d[1] = d[1]._d
              }
              this.options_filter.datePicker_rangeValue = [d[0], d[1]]
              this.$nextTick(() => {
                that.status.datePicker_show = true
              })
              break
            default:
              break
          }
        }
      },
      // 选择：上一个时间区间
      selectPrevious () {
        this.checkType = undefined
        let now = this.options_filter.date_range
        switch (this.options_filter.type_time) {
          case 1:
            // 天
            this.options_filter.date_range = [this.xy.moment(now[0]).subtract(1, 'day'), this.xy.moment(now[1]).subtract(1, 'day')]
            break
          case 2:
            // 周
            this.options_filter.date_range = [this.xy.moment(now[0]).subtract(1, 'week'), this.xy.moment(now[1]).subtract(1, 'week')]
            break
          case 3:
            // 月
            this.options_filter.date_range = [this.xy.moment(now[0]).subtract(1, 'month'), this.xy.moment(now[1]).subtract(1, 'month')]
            break
          case 4:
            // 自定义：不会被选中，无操作
            break
          default:
            // 默认： 周
            this.options_filter.type_time = 2
            this.options_filter.date_range = [this.xy.moment(now[0]).subtract(1, 'week'), this.xy.moment(now[1]).subtract(1, 'week')]
            break
        }
        this.getDetail()
      },
      // 选择：下一个时间区间
      selectNext () {
        this.checkType = undefined
        let now = this.options_filter.date_range
        switch (this.options_filter.type_time) {
          case 1:
            // 天
            this.options_filter.date_range = [this.xy.moment(now[0]).add(1, 'day'), this.xy.moment(now[1]).add(1, 'day')]
            break
          case 2:
            // 周
            this.options_filter.date_range = [this.xy.moment(now[0]).add(1, 'week'), this.xy.moment(now[1]).add(1, 'week')]
            break
          case 3:
            // 月
            this.options_filter.date_range = [this.xy.moment(now[0]).add(1, 'month'), this.xy.moment(now[1]).add(1, 'month')]
            break
          case 4:
            // 自定义：不会被选中，无操作
            break
          default:
            // 默认： 周
            this.options_filter.type_time = 2
            this.options_filter.date_range = [this.xy.moment(now[0]).add(1, 'week'), this.xy.moment(now[1]).add(1, 'week')]
            break
        }
        this.getDetail()
      },
      // 选择：校区、年级、班级，以此判断维度
      selectClass (val, selectedData) {
        this.checkType = undefined
        let that = this
        let title = selectedData[0].label
        this.view_type = 0
        if (val[1] !== -1) {
          title += selectedData[1].label
          this.view_type = 1
          this.options_filter.currentGrade = selectedData[1]
        }
        if (val[2] !== -1) {
          title += selectedData[2].label
          this.view_type = 2
          this.options_filter.currentClass = selectedData[2]
        }
        this.setTitle(title)
        // 重置筛选与路由
        this.view_filterModel = false
        this.options_filter.userID = undefined
        this.options_filter.studentData = undefined
        this.options_filter.type_attendance = undefined
        this.panel_router = []
        // 队列置后
        setTimeout(() => {
          that.getDetail()
        }, 0)
      },
      // 选择：学年、学期
      selectSemester (val, selectedData) {
        this.checkType = undefined
        // 预设自定义时间选择器
        this.options_filter.date_range_options = {
          disabledDate: function (date) {
            return date.getTime() > new Date(new Date().setHours(0, 0, 0, 0)) || !(date.getTime() >= new Date(selectedData[1].StartDate.replace(/-/g, '/')).getTime() && date.getTime() <= new Date(selectedData[1].EndDate.replace(/-/g, '/')))
          }
        }

        this.options_filter.currentYear = selectedData[0]
        // this.options_filter.currentSemester = selectedData[1]
        this.$set(this.options_filter, 'currentSemester', selectedData[1])
        this.options_filter.type_time = 2
        this.status.datePicker_show = false
        if (selectedData[1].IsCurrent) {
          // 当前学期：默认选择当前周
          this.options_filter.date_range = [
            this.xy.moment().startOf('isoWeek')._d,
            this.xy.moment().endOf('isoWeek')._d
          ]
        } else {
          // 非当前学期：默认选择该学期第一周
          this.options_filter.date_range = [
            this.xy.moment(selectedData[1].StartDate).startOf('isoWeek')._d,
            this.xy.moment(selectedData[1].StartDate).endOf('isoWeek')._d
          ]
        }
        this.getDetail()
      },
      // 选择：当天时间区间
      selectTimePart (val) {
        this.checkType = undefined
        this.getDetail()
      },
      // 选择：维度筛选
      selectAttendanceType: () => {
        this.view_filterModel = this.type_attendance === undefined
      },
      // 设置标题：根据上方的 校区&年级&班级 筛选 或 左侧的 筛选 控制标题
      setTitle (title) {
        this.panel_currentTitle = title
      },
      // 查看子集详情
      checkDetail (data, type) {
        console.log(type)
        // type 为当前的维度
        let title = this.panel_currentTitle
        this.options_filter.studentData = undefined
        switch (type) {
          case 0:
            this.router_push()
            // this.options_filter.schoolGradeClass_value[1] = data.row.StudentGradeForStudentYearID
            this.options_filter.schoolGradeClass_value[1] = data.StudentGradeForStudentYearID
            this.options_filter.schoolGradeClass_value[2] = -1
            // this.options_filter.currentGrade = data.row
            this.options_filter.currentGrade = data
            this.view_type = 1
            // title += data.row.Grade
            title += data.Grade
            this.setTitle(title)
            break
          case 1:
            this.router_push()
            // this.options_filter.currentClass = data.row
            this.options_filter.currentClass = data
            // this.options_filter.schoolGradeClass_value[2] = data.row.StudentOrganizationID
            this.options_filter.schoolGradeClass_value[2] = data.StudentOrganizationID
            this.view_type = 2
            // title += data.row.Class
            title += data.Class
            this.setTitle(title)
            break
          case 2:
            this.router_push()
            // this.options_filter.studentData = data.row
            // this.options_filter.userID = data.row.UserID
            this.options_filter.studentData = data
            this.options_filter.userID = data.UserID
            this.view_type = 3
            break
          default:
            break
        }
        this.view_filterModel = false
        this.forceUpdate_cascader_schoolClass()
        this.getDetail()
      },
      // 查看筛选详情
      checkStatisticDetail (type) {
        // 查看统计模式不推入路由
        if (!this.view_filterModel) {
          this.router_push()
        }
        this.options_filter.type_attendance = type
        this.checkType = '详情'
        this.view_filterModel = true
        this.getDetail()
      },
      // 强制 刷新校区&年级&班级 级联菜单
      forceUpdate_cascader_schoolClass () {
        var that = this
        this.status.cascader_schoolClass = false
        setTimeout(() => {
          that.status.cascader_schoolClass = true
        }, 0)
      },
      // 推入路由
      router_push () {
        this.panel_router.push({
          schoolGradeClass: this.options_filter.schoolGradeClass_value.toString(),
          userID: this.options_filter.userID,
          view_type: this.view_type,
          title: this.panel_currentTitle
        })
      },
      // 弹出顶层路由
      router_pop () {
        let popData = this.panel_router.pop()
        this.options_filter.schoolGradeClass_value = popData.schoolGradeClass.split(',').map((item) => {
          return Number(item)
        })
        this.options_filter.userID = popData.userID
        this.view_type = popData.view_type
        this.panel_currentTitle = popData.title
        this.options_filter.type_attendance = undefined
        if (this.view_filterModel) {
          this.view_filterModel = false
        }
        this.forceUpdate_cascader_schoolClass()
        this.getDetail()
      },

      // 用户修改日期
      datePicker_change (val, type) {
        console.log(val, type)
      },
      // 用户确认修改日期
      datePicker_confirm () {
        this.checkType = undefined
        var d = this.options_filter.datePicker_rangeValue
        this.options_filter.date_range = [
          this.xy.moment(d[0])._d,
          this.xy.moment(d[1])._d
        ]
        this.getDetail()
      },
      // 默认用户图标：若无图标，展示文字
      showName (name) {
        // 纯中文：汉字姓名大于2个字展示最后2个字，小于等于2个字
        if (/^[\u4e00-\u9fa5]+$/g.test(name)) {
          return name.length > 2 ? name.slice(-2) : name
        } else if (/^[A-Za-z]+$/g.test(name)) {
          // 纯英文名只展示两个字母
          return name.slice(0, 2)
        } else {
          // 其他
          return name.slice(0, 2)
        }
      },
      handleTableChange () {
        if (this.pagination.current !== 1) {
          this.getDetail({ resetPageIndex: false })
        } else {
          this.getDetail()
        }
      }
    }
  }
</script>
<style lang="less">
.ivu-progress-success-bg {
  background: #1890FF;
}
.ivu-slider-disabled .ivu-slider-button {
  border-color: #46a6ff;
  cursor: default;
}
.ivu-slider-disabled .ivu-slider-button:hover {
  border-color: #46a6ff;
  cursor: default;

}
.ivu-slider-disabled .ivu-slider-bar {
  background: #46a6ff;
}
.ivu-slider-disabled .ivu-slider-wrap {
  cursor: default;
  background-color: #f5f5f5 !important;
}

.cursor-p {
  cursor: pointer;
}

.details {
  width: 100%;
  margin-bottom: 22px;
  .fontPos {
    font-size: 14px;
    line-height: 22px;
    position: relative;
    .times {
      position: absolute;
      right: 58px;
      .rateFont {
        font-size: 14px;
        line-height: 22px;
        color: rgba(0,0,0,0.85);
        display: inline-block;
      }
      .rateFont:nth-child(1) {
        margin-right: 16px;
      }
    }
  }
  .detailsFoot {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .detailsFootL {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      text-align: center;
      line-height: 36px;
      img {
        width: 20px;
        height: 20px;
      }
    }
    .detailsFootR {
      width: 200px;
    }
    .attEES-statist-btn {
      padding-left: 20px;
    }
  }
}
.xy-content-body {
  min-height: 600px;
  padding-bottom: 0;
}
.xy-content-body .attEES-content-wrapper {
  border: 0;
  .attEES-content-header {
    padding: 10px 0 20px;
  }
  .attEES-content-body {
    height: 100%;
    .attEES-panel-statist {
      width: 357px;
      height: 624px;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px;
      .attEES-statist-date {
        font-size: 12px;
        line-height: 22px;
        font-weight: 400;
        color: rgba(0, 0, 0, .45);
        text-align: left;
      }
      .attEES-statist-personBlock {
        flex-direction: column;
        text-align: center;
        margin-bottom: 28px;
        .attEES-avatar-wrapper {
          margin: 0 auto 10px;
        }
        .attEES-personBlock-content {
          color: #595959;
          font-size: 14px;
          line-height: 22px;
          .attEES-personBlock-name {
            color: rgba(0,0,0,0.85);
            font-size: 16px;
            font-weight: 500;
            margin: 0;
          }
        }
      }
    }
      .attEES-panel-statist>p {
        font-size: 14px;
        line-height: 22px;
        font-weight: bold;
        color: rgba(0, 0, 0, .85);
        margin-bottom: 20px;
      }
    .attEES-panel-dataArea {
      height: 100%;
      width: calc(100% - 357px);
      overflow-x: hidden;
      overflow-y: auto;
      padding: 0;
    }
  }
}
  .attEES {
    &-content {
      &-wrapper {
        border: 1px solid rgba(234, 234, 234, 1);
        border-radius: 4px;
      }

      &-header {
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        line-height: 45px;
        border-bottom: 1px solid rgba(234, 234, 234, 1);
      }

      // &-body {
      // display: flex;
      // }
    }

    &-panel {
      &-statist {
        float: left;
        width: 420px;
        min-height: 500px;
        padding: 30px 15px;
      }

      &-dataArea {
        float: left;
        width: calc(100% - 420px);
        min-height: 500px;
        padding-bottom: 25px;
        border-left: 1px solid #eaeaea;

        & .ivu-table th {
          background-color: #f9f9f9;
        }
      }
    }

    &-avatar {
      &-wrapper {
        display: inline-block;
        margin-right: 20px;
        vertical-align: middle;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        overflow: hidden;
        background-color: #4196ff;
        text-align: center;
        font-size: 12px;

        &.large {
          width: 74px;
          height: 74px;

          & > .attEES-avatar-font {
            line-height: 74px;
            font-size: 26px;
          }
        }
      }

      &-img {
        width: 100%;
      }

      &-font {
        line-height: 34px;
        color: #fff;
      }
    }

    &-statist {
      &-item {
        display: flex;
        justify-content: space-between;
      }

      &-caption {
        flex-grow: 0;
        flex-shrink: 0;
        width: 5em;
        line-height: 45px;
      }

      &-content {
        flex-grow: 1;
        padding: 0 20px;
      }

      &-btn {
        flex-grow: 0;
        flex-shrink: 0;
        line-height: 45px;

        & > a {
          color: #4196ff;
        }
      }

      &-description {
        display: flex;
        justify-content: space-between;
      }

      &-personBlock {
        display: flex;
        margin-bottom: 20px;
      }

      &-date {
        margin-top: 35px;
        text-align: right;
        font-size: 14px;
        font-weight: normal;
        color: rgba(153, 153, 153, 1);
      }
    }

    &-personBlock {
      &-name {
        font-size: 15px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin-bottom: 10px;
      }

      &-content {
        font-size: 14px;
        font-weight: normal;
        color: rgba(102, 102, 102, 1);
      }
    }

    &-chart {
      &-wrapper {
        height: 14px;
        margin-bottom: 10px;
        overflow: hidden;
        background-color: #f3f3f5;
        border-radius: 7px;
      }

      &-fill {
        float: left;
        width: 0;
        height: 100%;
        font-size: 12px;
        line-height: 14px;
        color: #fff;
        text-align: center;
        background-color: #fdb539;
        transition: width 0.6s ease;
        border-radius: 7px;
      }
    }

    &-AttendancePassengers {
      margin-bottom: 15px;
      padding-left: 18px;
      background-color: #f5f5f5;
      font-size: 15px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      border-radius: 4px;

      &-number {
        margin-right: 8px;
        line-height: 40px;
        font-size: 22px;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
    }
  }

</style>
