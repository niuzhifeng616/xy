<!-- 教师代课 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div class="fl">
        <Button class="xy-primary"
                @click="creatSubstitute">创建代课</Button>
        <Button class="xy-info"
                @click="startClashModal">冲突校验</Button>
      </div>
      <div class="fr pr">
        <i-select v-model="schoolID"
                  @on-change="schoolChange"
                  class="xy-content-title-search"
                  style="width:150px">
          <i-option :value="0">所有校区</i-option>
          <i-option v-for="item in schoolData"
                    :value="item.SchoolDistrictID"
                    :key="item.SchoolDistrictID"
                    >{{ item.SchoolDistrictName }}</i-option>
        </i-select>
        <i-select v-model="yearID"
                  @on-change="yearChange"
                  class="xy-content-title-search"
                  style="width:150px">
          <i-option v-for="item in yearData"
                    :value="item.ID"
                    :key="item.ID"
                    >{{ item.Name }}</i-option>
        </i-select>
        <i-select v-model="sessionID"
                  @on-change="sessionChange"
                  class="xy-content-title-search"
                  style="width:150px">
          <i-option v-for="item in sessionData"
                    :value="item.AcademicSessionID"
                    :key="item.AcademicSessionID"
                    >{{ item.AcademicSessionName }}</i-option>
        </i-select>
        <Input search
          clearable
          v-model.trim="searchName"
          @on-search="FromSubmit"
          placeholder="请输入用户名/工号/姓名"
          class="xy-content-title-search"
          style="width: auto;" />
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :columns="columns"
        :dataSource="datatable"
        nullData="该搜索条件下没有结果。"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange">
        <!-- 被代课教师 -->
        <div slot="SourceTeacherNameRender" slot-scope="text, record" style="min-width:200px">
          <!-- 继续调课 -->
          <span class="table-el-hover" v-if="record.SubstituteStatus === 0" @click="continueCreat(record)">
            {{record.SourceTeacherName}}
          </span>
          <!-- 调课通知 -->
          <span class="table-el-hover" v-else-if="record.SubstituteStatus === 1" @click="getNotifyInfo(record)">
            {{record.SourceTeacherName}}
          </span>
          <span class="table-el-hover" v-else>
            {{record.SourceTeacherName}}
          </span>
        </div>
        <!-- 操作 -->
        <span slot="operaRender" slot-scope="text, record">
          <a v-if="record.SubstituteStatus === 0" @click="continueCreat(record)">继续</a>
          <a v-if="record.SubstituteStatus === 1" @click="getNotifyInfo(record)">代课通知</a>
          <a-divider v-if="record.SubstituteStatus === 1" type="vertical" />
          <a v-if="record.SubstituteStatus === 1" @click="getCancel(record)">撤销</a><!-- 1待审批，6已撤销 -->
          <a v-if="record.SubstituteStatus === 2" disabled>已撤销</a>
        </span>
      </XyAntTable>
      <!-- 冲突校验 -->
      <modal v-model="modalStartClash"
             title="上课冲突校验"
             :mask-closable="false"
             width="448"
             :transfer="false">
        <div>
          <div v-if="!isCheck">
            <row>
              <div class="box-topblock-week"
                   :class="isClashDateTye == 1?'topblock-week-active':''"
                   name="dateblock"
                   @click="selectClashDate('1')">
                <span class="topblock-tit">本周</span>
                <div class="topblock-time">
                  <span>{{clashStartDate}}</span>
                  <span style="margin:0 2px;">-</span>
                  <span>{{clashEndDate}}</span>
                </div>
                <Icon type="md-checkmark"
                      class='fa-check'
                      v-if="isClashDateTye == 1" />
              </div>
              <div class="box-topblock-week"
                   :class="isClashDateTye == 2?'topblock-week-active':''"
                   name="dateblock"
                   @click="selectClashDate('2')">
                <span class="topblock-tit">下周</span>
                <i class="fa fa-calendar i-table"></i>
                <div class="topblock-time">
                  <span>{{clashNextStartDate}}</span>
                  <span style="margin:0 2px;">-</span>
                  <span>{{clashNextEndDate}}</span>
                </div>
                <Icon type="md-checkmark"
                      class='fa-check'
                      v-if="isClashDateTye == 2" />
              </div>
              <div class="box-topblock-week"
                   :class="isClashDateTye == 3?'topblock-week-active':''"
                   name="dateblock"
                   @click="selectClashDate('3')">
                <span class="topblock-tit">本月</span>
                <i class="fa fa-calendar i-table"></i>
                <div class="topblock-time">
                  <span>{{clashStartDate}}</span>
                  <span style="margin:0 2px;">-</span>
                  <span>{{clsshEndMonthDate}}</span>
                </div>
                <Icon type="md-checkmark"
                      class='fa-check'
                      v-if="isClashDateTye == 3" />
              </div>
            </row>
            <Form style="position:relative">
              <FormItem label="校验时间段"
                        label-position='left'
                        :label-width="85"
                        @click.native="selectClashDate('4')"
                        label-for="time">
                <date-picker type="date"
                             element-id='time'
                             v-model="pickerStartDate"
                             placeholder="请选择时间"
                             style="width: 126px;display:inline-block"></date-picker>
                <span>&nbsp;--&nbsp;</span>
                <date-picker type="date"
                             v-model="pickerEndDate"
                             placeholder="请选择时间"
                             style="width: 126px;display:inline-block"></date-picker>
                <Icon type="md-checkmark"
                      v-if="isClashDateTye == 4"
                      color="#4196FF"
                      size="22" />
              </FormItem>
            </Form>
          </div>
          <div class="startCheck"
               v-if="isCheck">
            <div class="generate-course-results">
              <span class="iconfont" v-if="!isComplete" style="color:#F5222D; margin:2px 10px 0 0">&#xe6d9;</span>
              <span class="results-notice"
                    v-if="!isComplete">正在进行上课冲突校验，请勿进行其他操作。</span>
              <span class="results-notice"
                    v-if="isComplete">校验完成</span>
            </div>
            <div class="result-head"
                 style="margin-top:20px;">
              <span>数据队列：</span>
              <span style="margin-left:5px;"
                    >{{curDay+1}}/{{totalDay}}</span>
            </div>
            <ul class="clearfix check-list">
              <li data-index="0"
                  class="complete-option"
                  v-for="(item,index) in enableInfo"
                  :key="index">
                <!-- 等待 -->
                <span class="state-complete"
                      v-if="item.status == 0">
                  <span class="generate-text"
                        >正在等待，正在检查{{item.curDate}}里的上课冲突。</span>
                </span>
                <!-- 进行中 -->
                <span v-if="item.status == 1">
                  <span class="data-list-state">
                    <span class="fa fa-refresh fa-spin fa-2x fa-fw"></span>
                  </span>
                  <span class="generate-text"
                        >正在进行，正在检查{{item.curDate}}里的上课冲突。</span>
                  <i-progress :percent="percentVal"
                              status="active"
                              :stroke-width="16" />
                </span>
                <!-- 成功 -->
                <span v-if="item.status == 2">
                  <span class="data-list-state data-list-state-error">
                    <Icon type="ios-checkmark-circle" />
                  </span>
                  <span class="generate-text"
                        >成功，正在检查{{item.curDate}}里的上课冲突。</span>
                </span>
                <!-- 失败 -->
                <span v-if="item.status == 3">
                  <span class="data-list-state data-list-state-error">
                    <Icon type="md-close-circle"
                          color="#ed4014" />
                  </span>
                  <span class="generate-text"
                        >失败，正在检查{{item.curDate}}里的上课冲突。</span>
                  <span style="color:#2d8cf0;cursor:pointer"
                        @click="exprot(item)">导出详情</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div slot="footer">
          <div v-if="!isCheck">
            <Button class="xy-modal-close"
                    @click="modalStartClash = false">取消</Button>
            <Button class="xy-modal-primary"
                    shape="circle"
                    @click="startClash">确定</Button>
          </div>
          <div v-if="isCheck && isComplete">
            <Button class="xy-modal-primary"
                    shape="circle"
                    @click="modalStartClash = false">关闭</Button>
          </div>
        </div>
      </modal>
      <modal v-model="modalCancel"
             :transfer="false"
             :mask-closable="false">
        <p slot="header">撤销</p>
        <p style="margin-bottom:5px;font-size:14px;">您确定要撤销吗？请输入“<span style="color:#ed4014">撤销</span>”确认。</p>
        <div>
          <Input v-model="cancelText"
                   placeholder="请输入“撤销”进行确认" />
        </div>
        <div slot="footer">
          <Button class="xy-modal-close"
                  @click="canceldb">取消</Button>
          <Button class="xy-modal-primary"
                  shape="circle"
                  @click="cancelBtn">确定</Button>
        </div>
      </modal>
      <modal v-model="modalError"
             :transfer="false"
             :mask-closable="false">
        <p slot="header">错误信息</p>
        <p style="margin-bottom:5px;font-size:14px;">请点击下载错误信息查看</p>
        <div slot="footer">
          <Button class="xy-modal-close"
                  @click="modalError=false">关闭</Button>
          <Button class="xy-danger"
                  size="large"
                  @click="errorBtn">下载错误信息</Button>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    components: { XyAntTable },
    data () {
      return {
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
        datatable: [], // table数据
        columns: [
          {
            title: '被代课教师',
            dataIndex: 'SourceTeacherName',
            scopedSlots: { customRender: 'SourceTeacherNameRender' }
          },
          {
            title: '调课人',
            dataIndex: 'LastModifyName',
            width: 160
          },
          {
            title: '新建时间',
            dataIndex: 'CreateDateStr',
            width: 150
          },
          {
            title: '有效周数',
            dataIndex: 'EffectiveWeek',
            width: 100
          },
          {
            title: '操作',
            dataIndex: 'opera',
            scopedSlots: { customRender: 'operaRender' },
            width: 200
          }
        ],

        modalCancel: false,
        cancelText: '',
        modalError: false,
        textError: [],
        svShow: true,
        modalCreate: false,
        isShowSpin: false,
        ids: '',

        searchName: '',
        schoolID: 0,
        schoolData: [],
        yearID: 0,
        yearData: [],
        sessionID: 0,
        sessionData: [],
        // 调课通知
        modalClassNotice: false,
        adjustmentReason: '',
        isNotice: false,
        notifyInfoData: [],
        isShowReason: true,
        curClassTableGenerateForSubstituteTeacherID: '',
        // 冲突校验
        modalStartClash: false,
        isClashDateTye: '1',
        clashStartDate: '', // 当天日期
        clashEndDate: '', // 当周最后一天日期
        clashNextStartDate: '', // 下周第一天日期
        clashNextEndDate: '', // 下周最后一天日期
        clsshEndMonthDate: '', // 当月最后一天日期
        pickerStartDate: new Date(),
        pickerEndDate: new Date(),
        isCheck: false, //
        isComplete: false,
        enableInfo: [],
        totalDay: '',
        curDay: 0,
        percentVal: 0,
        rowItem: '',
        dateFun: {}
      }
    },
    created: function () {
      this.$store.commit('common/getThreeMenuName', '')
      this.dateFun = {
        // 日期添加
        add: function (date, strInterval, Number) {
          switch (strInterval) {
            case 's': return new Date(Date.parse(date) + (1000 * Number))
            case 'n': return new Date(Date.parse(date) + (60000 * Number))
            case 'h': return new Date(Date.parse(date) + (3600000 * Number))
            case 'd': return new Date(Date.parse(date) + (86400000 * Number))
            case 'w': return new Date(Date.parse(date) + ((86400000 * 7) * Number))
            case 'q': return new Date(date.getFullYear(), (date.getMonth()) + Number * 3, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
            case 'm': return new Date(date.getFullYear(), (date.getMonth()) + Number, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
            case 'y': return new Date((date.getFullYear() + Number), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
          }
        },
        // 日期格式化
        format: function (date, format) {
          if (typeof date === 'string') { // 如果是字符串转换为日期型
            date = new Date(date.replace(/-/g, '/'))
          }

          if (!format) { format = 'yyyy-MM-dd HH:mm:ss' }
          let obj =
            {
              'M+': date.getMonth() + 1, // 返回实际月份
              'd+': date.getDate(), // 返回当月第几天
              'H+': date.getHours(), // 返回小时
              'm+': date.getMinutes(), // 返回分钟
              's+': date.getSeconds(), // 返回秒
              'q+': Math.floor((date.getMonth() + 3) / 3), // 返回第几个季度
              'S': date.getMilliseconds(), // 返回毫秒
              'w': date.getDay(), // 返回星期几，0为星期日
              'W': '日一二三四五六'.charAt(date.getDay()) // 返回星期几的中文表示
            }

          // 年的单独处理
          if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
          // 其他格式处理
          for (let k in obj) {
            if (new RegExp('(' + k + ')').test(format)) { format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? obj[k] : ('00' + obj[k]).substr(('' + obj[k]).length)) }
          }
          return format
        },
        diff: function (date, strInterval, dtEnd) {
          if (typeof dtEnd === 'string') { // 如果是字符串转换为日期型
            dtEnd = new Date(dtEnd.replace(/-/g, '/')) // StringToDate(dtEnd);
          }
          if (typeof date === 'string') { // 如果是字符串转换为日期型
            date = new Date(date.replace(/-/g, '/')) // StringToDate(dtEnd);
          }
          switch (strInterval) {
            case 's': return parseInt((dtEnd - date) / 1000)// 秒
            case 'n': return parseInt((dtEnd - date) / 60000)// 分钟
            case 'h': return parseInt((dtEnd - date) / 3600000)// 小时
            case 'd': return parseInt((dtEnd - date) / 86400000)// 天
            case 'w': return parseInt((dtEnd - date) / (86400000 * 7))// 周
            case 'm': return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - date.getFullYear()) * 12) - (date.getMonth() + 1)// 月
            case 'y': return dtEnd.getFullYear() - date.getFullYear()// 年
          }
        },
        // 输出当月的开始日期和结束日期
        curMonthDate: function () {
          // 获取当前月的第一天
          let start = new Date()
          start.setDate(1)

          // 获取当前月的最后一天
          let date = new Date()
          let currentMonth = date.getMonth()
          let nextMonth = ++currentMonth
          let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
          let oneDay = 1000 * 60 * 60 * 24
          let end = new Date(nextMonthFirstDay - oneDay)

          let arrdate = []
          arrdate.push(start)
          arrdate.push(end)
          return arrdate
        },
        // 输出当前周的开始日期和结束日期
        curWeekDate: function () {
          let date = new Date()
          let today = date.getDay()
          let stepSunDay = -today + 1
          if (today === 0) {
            stepSunDay = -7
          }
          let stepMonday = 7 - today
          let time = date.getTime()
          let monday = new Date(time + stepSunDay * 24 * 3600 * 1000)
          let sunday = new Date(time + stepMonday * 24 * 3600 * 1000)
          let arrdate = []
          arrdate.push(monday)
          arrdate.push(sunday)
          return arrdate
        }
      }
      this.clashStartDate = this.dateFun.format(new Date(), 'yyyy-MM-dd')
      this.clashEndDate = this.dateFun.format(this.dateFun.curWeekDate()[1], 'yyyy-MM-dd')
      this.clashNextStartDate = this.dateFun.format(this.dateFun.add(this.clashEndDate, 'd', 1), 'yyyy-MM-dd')
      this.clashNextEndDate = this.dateFun.format(this.dateFun.add(this.clashEndDate, 'd', 7), 'yyyy-MM-dd')
      this.clsshEndMonthDate = this.dateFun.format(this.dateFun.curMonthDate()[1], 'yyyy-MM-dd')
    },
    mounted: function () {
      this.getSchool()
    },
    methods: {
      // 获取table/分页数据
      async loadTable () {
        this.tableLoading = true
        let obj = {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          schoolDistrictID: this.schoolID,
          academicSessionID: this.sessionID,
          searchName: this.searchName
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SubstituteCourseAdjustmentCourse/GetSubstitutePage`, obj)
        if (res.success) {
          this.pagination.total = res.data.totalRecords
          this.datatable = res.data.data
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.loadTable()
      },
      FromSubmit () {
        this.pagination.current = 1
        this.loadTable()
      },
      // 校区
      schoolChange: function (val) {
        this.pagination.current = 1
        this.schoolDistrictID = val
        this.loadTable()
      },
      // 学年
      yearChange: function (val) {
        this.pagination.current = 1
        this.getSession(val, 1)
      },
      // 学期
      sessionChange: function (val) {
        if (this.sessionID !== undefined) {
          this.academicSessionID = this.sessionID
        }
        this.pagination.current = 1
        this.loadTable()
      },
      // 获取校区
      async getSchool () {
        let that = this
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`)
        if (res.success) {
          that.schoolData = res.data
          that.getYear()
        }
      },
      // 获取学年
      async getYear () {
        let that = this
        let res = await this.xy.get(`${this.xyApi}/xy/comm/YearList`)
        if (res.success) {
          that.yearData = res.data
          if (res.data.length > 0) {
            let arr = res.data.filter(function (item) { return item.IsCurrent === true })
            if (arr.length > 0) {
              that.yearID = arr[arr.length - 1].ID
            } else {
              that.yearID = res.data[res.data.length - 1].ID
            }
          }
          that.getSession(that.yearID, 0)
        }
      },
      // 获取学期
      async getSession (id, val) {
        let that = this
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SessionList`, {
          yearID: id
        })
        if (res.success) {
          that.sessionData = []
          that.sessionID = 0
          if (res.data.length > 0) {
            that.sessionData = res.data
            let arr = res.data.filter(function (item) { return item.IsCurrent === true })
            if (arr.length > 0) {
              that.sessionID = arr[arr.length - 1].AcademicSessionID
            } else {
              that.sessionID = res.data[res.data.length - 1].AcademicSessionID
            }
          } else {
            that.sessionID = 0
            this.academicSessionID = that.sessionID
          }
          if (val === 0) {
            that.loadTable()
          } else {
            this.pagination.current = 1
            this.academicSessionID = that.sessionID
            this.loadTable()
          }
        }
      },
      // 创建
      async creatSubstitute () {
        // this.$store.commit('common/getThreeMenuName', '继续调整未完成代课')
        // this.$store.commit('common/getParam', { classTableGenerateForSubstituteTeacherID: 12 })
        // this.$router.push({ path: `/xyhome/continueCreat`, query: this.$store.state.common.menuInfo })
        // that.$router.push({ path: `/xyhome/continueCreat`, query: that.$store.state.common.menuInfo })
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SubstituteCourseAdjustmentCourse/GetStudenttituteTeacherNoFinish`)
        let that = this
        if (res.success) {
          if (res.data > 0) {
            this.$Modal.confirm({
              title: '温馨提示',
              content: '您有尚未完成的代课任务，请先完成后再新建，点击“确定”继续调整未完成代课。',
              onOk: function () {
                that.$store.commit('common/getThreeMenuName', '继续调整未完成代课')
                that.$store.commit('common/getParam', { classTableGenerateForSubstituteTeacherID: res.data })
                // that.$router.push({ path: `/xyhome/continueCreat`, query: { classTableGenerateForSubstituteTeacherID: res.data } })
                that.$router.push({ path: `/xyhome/continueCreat`, query: that.$store.state.common.menuInfo })
              }
            })
          } else {
            this.$store.commit('common/getThreeMenuName', '创建代课')
            this.$router.push({ path: `/xyhome/creatSubstitute`, query: this.$store.state.common.menuInfo })
          }
        }
        this.xy.unloading()
      },
      continueCreat: function (row) {
        this.$store.commit('common/getThreeMenuName', '继续调整未完成代课')
        this.$store.commit('common/getParam', { classTableGenerateForSubstituteTeacherID: row.ClassTableGenerateForSubstituteTeacherID, sourceWeek: row.Week })
        this.$router.push({ path: `/xyhome/continueCreat`, query: this.$store.state.common.menuInfo })
      // this.$router.push({ path: '/xyhome/ContinueCreat', query: { classTableGenerateForSubstituteTeacherID: row.ClassTableGenerateForSubstituteTeacherID, sourceWeek: row.Week } })
      },
      // 调课通知页面数据
      getNotifyInfo: function (row) {
        this.$store.commit('common/getThreeMenuName', '代课通知')
        this.$store.commit('common/getParam', { classTableGenerateForSubstituteTeacherID: row.ClassTableGenerateForSubstituteTeacherID, loadSource: 1 })
        this.$router.push({ path: `/xyhome/adjustNotice`, query: this.$store.state.common.menuInfo })
      },
      getCancel: function (row) {
        this.modalCancel = true
        this.rowItem = row
      },
      canceldb: function () {
        this.modalCancel = false
        this.cancelText = ''
      },
      // 撤销
      async cancelBtn () {
        if (this.cancelText === '撤销') {
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SubstituteCourseAdjustmentCourse/Revoke`, {
            id: this.rowItem.ClassTableGenerateForSubstituteTeacherID
          }, true)
          if (res.success) {
            this.modalCancel = false
            this.cancelText = ''
            this.xy.msgSuc('撤销成功。')
            this.loadTable()
          } else {
            this.xy.msgError('撤销失败。')
            this.cancelText = ''
            this.modalCancel = false
            this.modalError = true
            this.textError = res.data
          };
          this.xy.unloading()
        } else {
          this.xy.msgError('请输入撤销。')
        };
      },
      download: function (fileName, content) {
        if (window.navigator.msSaveOrOpenBlob) {
          // if browser is IE
          let blob = new Blob([decodeURIComponent(encodeURI(content))], {
            type: 'text/csv;charset=utf-8;'
          })
          navigator.msSaveBlob(blob, fileName)
        } else {
          let urlObject = window.URL || window.webkitURL || window
          // eslint-disable-next-line camelcase
          let export_blob = new Blob([content], { type: 'text/plain' })
          // eslint-disable-next-line camelcase
          let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
          save_link.href = urlObject.createObjectURL(export_blob)
          save_link.download = fileName
          fakeClick(save_link)
        }
        function fakeClick (obj) {
          let ev = document.createEvent('MouseEvents')
          ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
          obj.dispatchEvent(ev)
        }
      },
      // 下载错误信息
      errorBtn: function () {
        let errorMsg = ''
        for (let i = 0; i < this.textError.length; i++) {
          errorMsg += this.textError[i] + '\r\n'
        }
        this.download('error.txt', errorMsg)
        this.modalError = false
      },

      // 冲突校验
      startClashModal: function () {
        this.isClashDateTye = '1'
        this.pickerStartDate = new Date()
        this.pickerEndDate = new Date()
        this.isCheck = false
        this.isComplete = false
        this.enableInfo = []
        this.totalDay = ''
        this.curDay = 0
        this.percentVal = 0
        this.modalStartClash = true
      },
      selectClashDate: function (val) {
        this.isClashDateTye = val
      },
      startClash: function () {
        if (this.isClashDateTye === '') {
          this.xy.msgError('请选择要检验的日期。')
          return false
        };
        let start = ''
        let end = ''
        if (this.isClashDateTye === '1') {
          start = this.clashStartDate
          end = this.clashEndDate
        };
        if (this.isClashDateTye === '2') {
          start = this.clashNextStartDate
          end = this.clashNextEndDate
        };
        if (this.isClashDateTye === '3') {
          start = this.clashStartDate
          end = this.clsshEndMonthDate
        };
        if (this.isClashDateTye === '4') {
          start = this.pickerStartDate
          end = this.pickerEndDate
        };
        if (new Date(start) > new Date(end)) {
          this.xy.msgError('开始时间不能大于结束时间。')
          return false
        }
        this.totalDay = (this.dateFun.diff(new Date(start), 'd', (new Date(end)))) + 1
        for (let i = 0; i < this.totalDay; i++) {
          this.enableInfo.push({
            curDate: this.dateFun.format(this.dateFun.add(new Date(start), 'd', i), 'yyyy-MM-dd'),
            status: 0,
            errorMsg: ''
          })
        };
        this.isCheck = true
        this.postGenerateTimeTable(0)
      },
      // 分步校验
      async postGenerateTimeTable (j) {
        let that = this
        if (j < that.enableInfo.length) {
          that.curDay = j
        }
        that.percentVal = 0
        that.enableInfo[j].status = 1
        that.percentFun()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/StartClash`, {
          startDate: that.enableInfo[j].curDate,
          endDate: that.enableInfo[j].curDate
        }, true)

        if (res.success) {
          that.enableInfo[j].status = 2
          that.percentVal = 100
          if (that.curDay + 1 < that.enableInfo.length) {
            that.curDay++
            that.postGenerateTimeTable(that.curDay)
          } else {
            that.isComplete = true
          }
        } else {
          that.percentVal = 100
          that.enableInfo[j].errorMsg = res.data
          that.enableInfo[j].status = 3
          if (that.curDay + 1 < that.enableInfo.length) {
            that.curDay++
            that.postGenerateTimeTable(that.curDay)
          } else {
            that.isComplete = true
          }
        };
      },
      // 下载错误信息
      exprot: function (item) {
        let msg = ''
        for (let i = 0; i < item.errorMsg.length; i++) {
          msg = msg + item.errorMsg[i]
        }
        this.download('错误信息.txt', msg)
      },
      // 进度条
      percentFun: function () {
        let that = this
        if (this.percentVal < 90) {
          this.percentVal += 1
          setTimeout(function () {
            that.percentFun()
          }, 200)
        }
      }
    }

  }
</script>
<style lang='less' scoped>
.table {
  border: 1px solid #ddd;
  text-align: center;
  /*cursor: pointer;*/
  margin: 0 auto;
  border-collapse: collapse;
  font-size: 14px;
  width: 100%;
}
.table thead th {
  height: 40px;
  white-space: nowrap;
  overflow: hidden;
  background-color: #f8f8f9;
  box-sizing: border-box;
  text-align: center;
  text-overflow: ellipsis;
  vertical-align: middle;
  border-bottom: 1px solid #e8eaec;
  border-right: 1px solid #e8eaec;
  font-weight: bold;
}
.table tbody td {
  height: 40px;
  box-sizing: border-box;
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid #e8eaec;
  border-right: 1px solid #e8eaec;
  position: relative;
  padding: 12px;
  cursor: pointer;
}
.subject {
  padding: 6px 10px;
  margin: 5px auto;
  background: #f5f5f5;
  border-radius: 5px;
}
.is-active {
  background: -webkit-linear-gradient(to left, top, #66cffe, #2b7aeb) !important;
  background: -o-linear-gradient(to bottom, right, #66cffe, #2b7aeb) !important;
  background: -moz-linear-gradient(to bottom, right, #66cffe, #2b7aeb) !important;
  background: linear-gradient(to bottom right, #66cffe, #2b7aeb) !important;
  transition: all 1s;
}
.no-chose {
  background: #ddd !important;
}
.filter-state {
  width: 100%;
  height: 28px;
  line-height: 28px;
  background-color: rgba(149, 181, 255, 0.24) !important;
  text-align: center;
  margin: 17px 0 22px;
  font-size: 12px;
  color: #666;
  border-radius: 5px;
  overflow: hidden;
  cursor: default;
  border: none;
}
.right-substitute-teacher {
  border: 1px solid #e8eaec;
}
.right-substitute-teacher h2 {
  height: 40px;
  line-height: 40px;
  padding-left: 15px;
  background-color: #f8f8f9;
  border-bottom: 1px solid #e8eaec;
}
.tap-content {
  max-height: 500px;
  overflow-y: auto;
}
.teacher-ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 10px 0px;
}
.teacher-ul li {
  margin: 0 8px 8px 0;
  padding: 3px 8px;
  background: #f3f3f3;
  cursor: pointer;
  border-radius: 5px;
}
.teacher-ul li:hover {
  background: #2b7aeb;
  color: #fff;
}
.no-chose-teacher {
  color: #ddd !important;
}
.no-chose-teacher:hover {
  color: #ddd !important;
  background: #f3f3f3 !important;
}
.right-tacher-active {
  background: #2b7aeb !important;
  color: #fff;
}
.teacher-ul li > span {
  margin-right: 5px;
}
.history-record {
  width: 100%;
  margin-top: 8px;
  overflow: auto;
  background: #f9f9f9;
}
.history-record > ul {
  border-bottom: 1px solid #d0d0d0;
}
.history-record > ul > .course-li-box {
  display: block;
  min-height: 80px;
  cursor: pointer;
  border-top: 1px solid #d0d0d0;
  border-bottom: 1px solid #fff;
  padding: 10px 20px 10px 90px;
  position: relative;
  /* background: -webkit-linear-gradient(left,#afd2f1,#4989e3); */
  background: -webkit-linear-gradient(to left, #66cffe, #2b7aeb);
  background: -o-linear-gradient(to right, #66cffe, #2b7aeb);
  background: -ms-linear-gradient(to left, #66cffe, #2b7aeb);
  background: -moz-linear-gradient(to left, #66cffe, #2b7aeb);
  background: linear-gradient(to right, #66cffe, #2b7aeb);
  color: #fff;
}
.history-record > ul > .course-li-box > .record-top {
  display: block;
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 11px;
}
.history-record > ul > .course-li-box > .record-top > .record-class {
  display: block;
  font-weight: bold;
  font-size: 17px;
  // vertical-align: bottom;
}
.history-record > ul > .course-li-box > .record-top > .record-time {
  display: block;
  font-weight: normal;
  font-size: 14px;
  // vertical-align: bottom;
  margin-top: 5px;
}
.history-record > ul > .course-li-box > .fa {
  position: absolute;
  left: 0px;
  bottom: -10px;
  font-size: 80px;
  opacity: 0.5;
  transition: all 0.3s;
}
.history-record > ul > .course-li-box:hover .fa {
  opacity: 0.8;
}
.history-record > ul > .course-li-box > .fa:hover {
  opacity: 0.8;
}
/*冲突校验*/
.box-topblock-week {
  width: 346px;
  height: 38px;
  line-height: 38px;
  background: rgba(244, 245, 247, 1);
  border: 1px solid rgba(217, 217, 217, 1);
  border-radius: 4px;
  padding-left: 10px;
  margin-bottom: 15px;
  position: relative;
  cursor: pointer;
}
.topblock-week-active {
  background: rgba(241, 248, 255, 1) !important;
  border-color: rgba(65, 150, 255, 1) !important;
  color: #4196ff;
}
.topblock-time {
  display: inline-block;
  margin-left: 20px;
  color: rgba(0, 0, 0, 1);
  opacity: 0.65;
}
.topblock-week-active .topblock-tit,
.topblock-week-active .topblock-time {
  color: #4196ff !important;
}
.box-topblock-week .topblock-tit {
  font-size: 16px;
  color: #333333;
  margin-bottom: 8px;
  text-align: center;
}
.box-topblock-week .i-table {
  font-size: 48px;
  position: absolute;
  left: 0px;
  bottom: -10px;
  opacity: 0.7;
}
.box-topblock-week .ivu-icon-md-checkmark {
  font-size: 22px;
  position: absolute;
  right: 7px;
  top: 7px;
  color: #4196ff;
  opacity: 1;
}
.box-topblock-week .topblock-time {
  font-size: 14px;
  font-weight: 400;
  color: #333;
  text-align: center;
}
/*校验数据样式*/
.generate-course-results {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: #fff7dd;
  border-radius: 4px;
}
.generate-course-results > .fa {
  color: #df4444;
  line-height: 30px;
  margin-left: 10px;
}
.generate-course-results > .results-notice {
  color: #df4444;
  margin-left: 10px;
}
.check-list {
  width: 100%;
  min-height: 220px;
}
.check-list li {
  padding: 5px 0;
}
.check-list .generate-text {
  font-size: 14px;
}
.check-list .ivu-icon {
  font-size: 32px;
}
.check-list .ivu-icon-ios-checkmark-circle {
  color: #19be6b;
}
.check-list .ivu-icon-ios-close-circle {
  color: #ed4014;
}
.check-list .fa-spin {
  color: #5cadff;
}
.startCheck {
  max-height: 500px;
  overflow-y: scroll;
}

/*end*/
</style>
