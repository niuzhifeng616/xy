
<template>
  <!-- 2.作息时间 -->
  <div class="xy-content-body">
      <!-- <Alert show-icon style="margin-bottom:10px;">请首先正确设置上午有几节课、下午有几节课及大课间所处的位置，然后再设置每节上课时间。每节课的上课时间都必须设置。</Alert> -->
      <div style="margin-bottom:20px;">
          <div class="clearfix">
              <div class="fl">
                  <Button class="xy-primary" @click="quicklySet" :disabled="isOperation !== 0">快速复制</Button>
                  <Button class="xy-info"
                          @click="quicklySetting"
                          :disabled="isOperation !== 0">快速设定</Button>
                  <Button class="xy-danger" @click="clearAllTime" :disabled="isOperation !== 0">清除时间</Button>
              </div>
              <div class="fr wt">
                  <checkbox v-model="MScheck" @on-change="checkChange('MS')">早自习</checkbox>
                  <checkbox v-model="AMcheck" @on-change="checkChange('AM')">上午</checkbox>
                  <checkbox v-model="ABcheck" @on-change="checkChange('AB')" :disabled="ABdisabled">上午大课间</checkbox>
                  <checkbox v-model="NScheck" @on-change="checkChange('NS')" :disabled="NSdisabled">午休</checkbox>
                  <checkbox v-model="PMcheck" @on-change="checkChange('PM')">下午</checkbox>
                  <checkbox v-model="PBcheck" @on-change="checkChange('PB')" :disabled="PBdisabled">下午大课间</checkbox>
                  <checkbox v-model="EScheck" @on-change="checkChange('ES')">晚自习</checkbox>
              </div>
          </div>

      </div>
      <table id="tbClassTableTime" class="class-hour-table" style="width:100%;">
          <thead>
              <tr>
                  <th width="8%">上课时间</th>
                  <th width="15%">课节</th>
                  <th class="weekselect" v-for="(week,index) in weekList" :key="week.text" :name="index" width="11%">
                      <span>{{week.text}}</span>
                  </th>
              </tr>

          </thead>
          <tbody>
              <tr v-for="(timeTable,index) in timeTableData" :key="index">
                  <td class="setTime" @click="trSetTime(timeTable)"  v-if="timeTable.isShow">
                      <span>设定</span>
                  </td>
                  <td  v-if="timeTable.isShow">
                      <span>{{timeTable.timeName}}</span>
                      <!-- 自习 添加-->
                      <span class="section-icon add-section" v-if="(timeTable.type==='MS'||timeTable.type==='ES')&&timeTable.isLast">
                          <i class="iconfont" @click="addSection(timeTable.type)">&#xe6d7;</i>
                          <span class="timer-text">自习</span>
                          <i class="iconfont" @click="reduce(timeTable.type,index)">&#xe6d0;</i>
                      </span>
                      <!-- 上午 添加-->
                      <span class="section-icon add-section" v-if="timeTable.type==='AM'&&timeTable.isLast">
                          <i class="iconfont" @click="addSection(timeTable.type)">&#xe6d7;</i>
                          <span class="timer-text">上午</span>
                          <i class="iconfont" @click="reduce(timeTable.type,index)">&#xe6d0;</i>
                      </span>
                      <!-- 课间 移动-->
                      <span class="section-icon" v-if="timeTable.type==='AB' || timeTable.type==='PB'">
                          <i class="iconfont" @click="upMove(timeTable.type,index)" style="font-size:14px; color:#4196FF; cursor:pointer;">&#xe6ab;</i>
                          <span class="timer-text">课间</span>
                          <i class="iconfont" @click="downMove(timeTable.type,index)" style="font-size:14px; color:#4196FF; cursor:pointer;">&#xe6a6;</i>
                      </span>
                      <!-- 下午 添加-->
                      <span class="section-icon add-section" v-if="timeTable.type==='PM'&&timeTable.isLast">
                          <i class="iconfont" @click="addSection(timeTable.type)">&#xe6d7;</i>
                          <span class="timer-text">下午</span>
                          <i class="iconfont" @click="reduce(timeTable.type,index)">&#xe6d0;</i>
                      </span>
                  </td>
                  <td v-for="time in timeTable.weekTime"
                  :key="time.StarTime"
                      @click="tdSetTime(time)"
                      class="week">
                      <span class="timeVal"  v-if="timeTable.isShow">
                          {{time.StartTime}}
                          <span v-if="time.StartTime !== ''&& time.StartTime !== null">-</span>
                          {{time.EndTime}}
                      </span>
                  </td>
              </tr>
          </tbody>
      </table>

      <div style="text-align: center;margin-top:15px;">
          <Button class="xy-btn-primary" shape="circle" @click="saveTimeSubmit(0)" :disabled="isOperation !== 0">保存</Button>
      </div>

      <!--快速设定-->
      <modal v-model="modalQuicklySetting"
          :mask-closable="false"
          v-if="isOperation === 0"
          width="800"
          :transfer="false">
          <p slot="header">快速设定作息时间</p>
          <div style="font-size:14px;">
              <!-- 早自习 -->
              <div class="set-section" v-if="isShowMS">
                  <div class="quick-title">早自习</div>
                  <div>
                      <span>开始上课时间:</span>
                      <time-picker format="HH:mm" style="margin:0 10px"
                                  v-model="MSStartTime"
                                  :editable="false"
                                  placeholder="请选择上课时间"
                                  class="time-picker"
                                  clearable="true"></time-picker>
                      <span>每节课时长:</span>
                      <i-input clearable v-model="MSLength" style="width: 100px;margin:0 10px" :autofocus="true"></i-input>
                      <span>分钟</span>
                  </div>
              </div>
              <!-- 上午 -->
              <div class="set-section" v-if="isShowAM">
                  <div class="quick-title">上午</div>
                  <div>
                      <span>开始上课时间:</span>
                      <time-picker format="HH:mm" style="margin:0 10px"
                                  v-model="AMStartTime"
                                  :editable="false"
                                  placeholder="请选择上课时间"
                                  class="time-picker"></time-picker>
                      <span>每节课时长:</span>
                      <i-input clearable v-model="AMLength" style="width: 100px;margin:0 10px" :autofocus="true"></i-input>
                      <span>分钟</span>
                      <span v-if="isShowAB">
                          <span style="margin-left:10px">大课间时长:</span>
                          <i-input clearable v-model="ABRecessLength" style="width: 100px;margin:0 10px" :autofocus="true"></i-input>
                          <span>分钟</span>
                      </span>
                  </div>
              </div>
              <!-- 下午 -->
              <div class="set-section" v-if="isShowPM">
                  <div class="quick-title">下午</div>
                  <div>
                      <span>开始上课时间:</span>
                      <time-picker format="HH:mm" style="margin:0 10px"
                                  v-model="PMStartTime"
                                  placeholder="请选择上课时间"
                                  class="time-picker"></time-picker>
                      <span>每节课时长:</span>
                      <i-input clearable v-model="PMLength" style="width: 100px;margin:0 10px" :autofocus="true"></i-input>
                      <span>分钟</span>
                      <span v-if="isShowPB">
                          <span  style="margin-left:10px">大课间时长:</span>
                          <i-input clearable v-model="PBRecessLength" style="width: 100px;margin:0 10px" :autofocus="true"></i-input>
                          <span>分钟</span>
                      </span>
                  </div>
              </div>
              <!-- 晚自习 -->
              <div class="set-section" v-if="isShowES">
                  <div class="quick-title">晚自习</div>
                  <div>
                      <span>开始上课时间:</span>
                      <time-picker format="HH:mm" style="margin:0 10px"
                                  v-model="ESStartTime"
                                  placeholder="请选择上课时间"
                                  class="time-picker"></time-picker>
                      <span>
                          <span>每节课时长:</span>
                          <i-input clearable v-model="ESLength" style="width: 100px;margin:0 10px" :autofocus="true"></i-input>
                          <span>分钟</span>
                      </span>
                  </div>
              </div>
              <!-- 普通课间时长 -->
              <div class="set-section">
                  <span>普通课间时长:</span>
                  <i-input clearable v-model="commonLength" style="width: 100px;margin:0 10px" :autofocus="true"></i-input>
                  <span>分钟</span>
              </div>
          </div>
          <div slot="footer">
              <Button class="xy-modal-close" @click="cancleQuicklySetting">取消</Button>
              <Button class="xy-modal-primary" shape="circle" @click="submitQuicklySetting">确定</Button>
          </div>
      </modal>

      <!--设置时间-->
      <modal v-model="modalSetTime"
          :mask-closable="false"
          v-if="isOperation === 0"
          width="400"
          :transfer="false">
          <p slot="header">设置时间</p>
          <div style="font-size:14px;">
              <div class="timePicker">
                  <div class="alert-time-top" style="margin-bottom:20px;">
                      <h6 style="margin-bottom:10px;">上课时间：</h6>
                      <time-picker format="HH:mm"
                                  :editable="false"
                                  placeholder="请选择上课时间"
                                  v-model="starTime"></time-picker>
                  </div>
                  <div class="alert-time-top" style="margin-bottom:20px;">
                      <h6 style="margin-bottom:10px;">下课时间：</h6>
                      <time-picker format="HH:mm"
                                  :editable="false"
                                  placeholder="请选择下课时间"
                                  v-model="endTime"></time-picker>
                  </div>
              </div>
          </div>
          <div slot="footer">
              <Button class="xy-modal-close" @click="modalSetTime = false">取消</Button>
              <Button class="xy-modal-primary" shape="circle" @click="submitSetTime">保存</Button>
          </div>
      </modal>

      <!-- 快速设置 -->
      <modal v-model="modalQuicklySet"
          :mask-closable="false"
          width="564"
          :transfer="false"
          @on-ok="submitQuicklySet">
          <p slot="header">快速设置</p>
          <div style="font-size:14px;max-height:350px;overflow-y:auto;">
              <!-- <Alert show-icon closable>
                以下是与本排课方案上下午课时及大课间等设置完全一致的已发布的排课方案。
                选择排课方案然后点“确定”按钮，被选排课方案中已设置过的每节上课时间将快速加载到本排课方案的课位上。
              </Alert> -->
              <ul class="quickly-set">
                  <li>
                      <h2>行政班排课方案</h2>
                      <div v-if="quicklySetData.General.length > 0">
                        <radio
                            v-for="general in quicklySetData.General"
                            v-model="general.ischecked"
                            :key="general.Name"
                            @on-change="radioChanage(general)">
                            {{general.Name}}
                        </radio>

                      </div>
                      <p class="filter-state" v-if="quicklySetData.General.length === 0">未查到可用的行政班排课方案</p>
                  </li>
                  <li>
                      <h2>走班排课方案</h2>
                      <div v-if="quicklySetData.MoveClass.length > 0">
                      <radio
                          v-for="moveClass in quicklySetData.MoveClass"
                          v-model="moveClass.ischecked"
                          :key="moveClass.Name"
                          @on-change="radioChanage(moveClass)">{{moveClass.Name}}</radio>

                      </div>
                      <p class="filter-state" v-if="quicklySetData.MoveClass.length === 0">未查到可用的走班排课方案</p>
                  </li>
                  <li>
                      <h2>校本排课方案</h2>
                      <div v-if="quicklySetData.SchoolBased.length > 0">
                      <radio
                          v-for="schoolBased in quicklySetData.SchoolBased"
                          v-model="schoolBased.ischecked"
                          :key="schoolBased.Name"
                          @on-change="radioChanage(schoolBased)">{{schoolBased.Name}}</radio>
                      </div>
                      <p class="filter-state" v-if="quicklySetData.SchoolBased.length === 0">未查到可用的校本排课方案</p>
                  </li>
              </ul>
          </div>
          <div slot="footer">
              <Button class="xy-modal-close" @click="modalQuicklySet = false">取消</Button>
              <Button class="xy-modal-primary" shape="circle" @click="submitQuicklySet">确认</Button>
          </div>
      </modal>

  </div>
</template>
<script>

  export default {
    name: 'WorkTime',
    components: {

    },
    data () {
      return {
        weekList: [
          { text: '星期一' },
          { text: '星期二' },
          { text: '星期三' },
          { text: '星期四' },
          { text: '星期五' },
          { text: '星期六' },
          { text: '星期日' }
        ],
        chinesesNumber: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
                         '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
        zaoData: ['早1', '早2'],
        wanData: ['晚1', '晚2', '晚3', '晚4'],
        timeTableData: [],
        // checkbox
        MScheck: false,
        AMcheck: false,
        ABcheck: false,
        ABdisabled: false,
        NScheck: false,
        NSdisabled: false,
        PMcheck: false,
        PBcheck: false,
        PBdisabled: false,
        EScheck: false,
        // 设置时间
        curTag: '',
        curType: '', // 1整行  2单节
        modalSetTime: false,
        timeRadio: '0',
        starTime: '',
        endTime: '',
        canSetTime: true, // 控制保存频率
        // 快速设置
        modalQuicklySet: false,
        isTimeData: true,
        quicklySetData: {
          General: [],
          MoveClass: [],
          SchoolBased: []
        },
        selectClassTable: '',
        // 快速设定
        modalQuicklySetting: false,
        isShowMS: false,
        MSStartTime: null,
        MSLength: 45,
        isShowAM: false,
        AMStartTime: null,
        AMLength: 45,
        isShowAB: false,
        ABRecessLength: 20,
        isShowPM: false,
        PMStartTime: null,
        PMLength: 45,
        isShowPB: false,
        PBRecessLength: 20,
        isShowES: false,
        ESStartTime: null,
        ESLength: 45,
        commonLength: 10,
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation || 0,
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID
      }
    },
    created () {
      this.getClassTableTimeAll()
    },
    mounted () {

    },
    methods: {
      // 获取数据
      async getClassTableTimeAll () {
        this.timeTableData = []
        this.xy.loading()
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableTime/GetClassTableTimeAll`, params)
        if (res.success) {
          let resData = res.data
          if (resData.length > 0) {
            this.isTimeData = false
            for (let i = 0; i < resData.length; i++) {
              let name = ''
              let type = ''
              let isLast = ''
              let isShow = ''
              if (resData[i][0].AMorPM === 'MS') {
                name = this.zaoData[i]
                type = 'MS'
                isShow = true
                this.MScheck = true
                if ((i + 1) === resData.length) {
                  isLast = true
                } else {
                  if (resData[i + 1][0].AMorPM !== 'MS') {
                    isLast = true
                  } else {
                    isLast = false
                  }
                }
              }
              if (resData[i][0].AMorPM === 'AM') {
                name = this.chinesesNumber[resData[i][0].Order] + '节'
                type = resData[i][0].AMorPM
                isShow = true
                this.AMcheck = true
                if ((i + 1) === resData.length) {
                  isLast = true
                } else {
                  if (resData[i + 1][0].AMorPM === 'NS' || resData[i + 1][0].AMorPM === 'PM' || resData[i + 1][0].AMorPM === 'ES') {
                    isLast = true
                  } else {
                    isLast = false
                  }
                }
              }
              if (resData[i][0].AMorPM === 'PM') {
                name = this.chinesesNumber[resData[i][0].Order] + '节'
                type = resData[i][0].AMorPM
                isShow = true
                this.PMcheck = true
                if ((i + 1) === resData.length) {
                  isLast = true
                } else {
                  if (resData[i + 1][0].AMorPM === 'ES') {
                    isLast = true
                  } else {
                    isLast = false
                  }
                }
              }
              if (resData[i][0].AMorPM === 'AB') {
                name = '上午大课间'
                type = 'AB'
                isShow = true
                this.ABcheck = true
              }
              if (resData[i][0].AMorPM === 'NS') {
                name = '午休'
                type = 'NS'
                isShow = true
                this.NScheck = true
              }
              if (resData[i][0].AMorPM === 'PB') {
                name = '下午大课间'
                type = 'PB'
                isShow = true
                this.PBcheck = true
              }
              if (resData[i][0].AMorPM === 'ES') {
                name = this.wanData[resData[i][0].Order]
                type = 'ES'
                isShow = true
                this.EScheck = true
                if ((i + 1) === resData.length) {
                  isLast = true
                } else {
                  if (i + 1 === resData.length) {
                    isLast = true
                  } else {
                    isLast = false
                  }
                }
              }
              this.timeTableData.push({
                timeName: name,
                type: type,
                isLast: isLast,
                isShow: isShow,
                order: resData[i][0].Order,
                weekTime: resData[i]
              })
            }
          } else {
            for (let m = 0; m < 5; m++) { // 上午
              let arr = []
              for (let j = 0; j < 7; j++) {
                var amOrder = m
                if (m > 2) {
                  amOrder = m - 1
                }
                if (m === 2) {
                  arr.push({
                    AMorPM: 'AB',
                    AMorPMOrder: 0,
                    ClassTableTimeID: 0,
                    Day: j,
                    EndTime: null,
                    IsSelected: false,
                    Order: 0,
                    StartTime: null,
                    Type: ''
                  })
                } else {
                  arr.push({// 创建上午
                    AMorPM: 'AM',
                    AMorPMOrder: amOrder,
                    ClassTableTimeID: 0,
                    Day: j,
                    EndTime: null,
                    IsSelected: false,
                    Order: amOrder,
                    StartTime: null,
                    Type: ''
                  })
                }
              }
              if (m === 2) {
                this.timeTableData.push({
                  timeName: '上午大课间',
                  type: 'AB',
                  isLast: true,
                  isShow: true,
                  order: 0,
                  weekTime: arr
                })
              } else {
                let isLast = ''
                let name = ''
                if (m === 4) {
                  isLast = true
                } else {
                  isLast = false
                };
                if (m < 3) {
                  name = this.chinesesNumber[m] + '节'
                } else {
                  name = this.chinesesNumber[m - 1] + '节'
                }
                this.timeTableData.push({
                  timeName: name,
                  type: 'AM',
                  isLast: isLast,
                  isShow: true,
                  order: amOrder,
                  weekTime: arr
                })
              }
            }
            let NSArr = []
            for (let i = 0; i < 7; i++) {
              NSArr.push({
                AMorPM: 'NS',
                AMorPMOrder: 0,
                ClassTableTimeID: 0,
                Day: i,
                EndTime: null,
                IsSelected: false,
                Order: 0,
                StartTime: null,
                Type: ''
              })
            }
            this.timeTableData.push({
              timeName: '午休',
              type: 'NS',
              isLast: true,
              isShow: true,
              order: 0,
              weekTime: NSArr
            })
            for (let n = 0; n < 4; n++) { // 下午
              let PMArr = []
              for (let p = 0; p < 7; p++) {
                PMArr.push({
                  AMorPM: 'PM',
                  AMorPMOrder: n,
                  ClassTableTimeID: 0,
                  Day: p,
                  EndTime: null,
                  IsSelected: false,
                  Order: 4 + n,
                  StartTime: null,
                  Type: ''
                })
              }
              let isLast1 = ''
              if (n === 3) {
                isLast1 = true
              } else {
                isLast1 = false
              };
              this.timeTableData.push({
                timeName: this.chinesesNumber[4 + n] + '节',
                type: 'PM',
                isLast: isLast1,
                isShow: true,
                order: 4 + n,
                weekTime: PMArr
              })
            };
            this.AMcheck = true
            this.ABcheck = true
            this.NScheck = true
            this.PMcheck = true
          }
          let AMLength = this.timeTableData.filter((item) => { return item.type === 'AM' })
          let PMLength = this.timeTableData.filter((item) => { return item.type === 'PM' })
          if (AMLength.length === 0 || PMLength.length === 0) {
            this.NSdisabled = true
          }
          if (AMLength.length < 2) {
            this.ABdisabled = true
          }
          if (PMLength.length < 2) {
            this.PBdisabled = true
          }
        }
        this.xy.unloading()
      },
      // 保存
      async saveTimeSubmit (val) {
        if (this.isOperation === 0) {
          if (val === 0) {
            if (this.timeTableData.length === 0) {
              this.xy.msgError('每天上课节数不能为空。')
              return false
            }
          }
          let models = []
          for (let i = 0; i < this.timeTableData.length; i++) {
            let infoArr = []
            for (let m = 0; m < this.timeTableData[i].weekTime.length; m++) {
              if (val === 0) { // 快速复制不判定时间
                if (this.timeTableData[i].weekTime[m].StartTime === '' ||
                  this.timeTableData[i].weekTime[m].StartTime === null ||
                  this.timeTableData[i].weekTime[m].EndTime === '' ||
                  this.timeTableData[i].weekTime[m].EndTime === null) {
                  this.xy.msgError(this.timeTableData[i].timeName + '的时间设置不能为空。')
                  return false
                }
              }
              infoArr.push({
                classTableTimeID: this.timeTableData[i].weekTime[m].ClassTableTimeID,
                section: this.timeTableData[i].weekTime[m].AMorPM,
                sectiontag: this.timeTableData[i].weekTime[m].AMorPMOrder,
                weekVal: this.timeTableData[i].weekTime[m].Day,
                startTime: this.timeTableData[i].weekTime[m].StartTime,
                endTime: this.timeTableData[i].weekTime[m].EndTime
              })
            }
            models.push(infoArr)
          }
          let models1 = []
          models[0].map((col, i) => {
            return models.map((row, j) => {
              models1.push(row[i])
              return row
            })
          })
          this.xy.loading()
          let params = {
            ClassTableID: this.classTableID, Models: models1
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTableTime/Create`, params, true)
          if (res.success) {
            this.isTimeData = false
            this.$parent.getGeneralFlows()
            if (val === 0) {
              this.xy.msgSuc('保存成功。')
              this.$store.commit('common/getParam', { pro: 'classTableOrder', step: 2 })
              this.$router.push({
                path: '/xyhome/goClassStepsHeader/progress',
                query: this.$store.state.common.menuInfo
              })
              this.$parent.tabValue = this.$parent.liData[2].url
            } else { // 快速复制
              let params = {
                classTableID: this.classTableID
              }
              let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableTime/GetSettingList`, params)
              if (res.success) {
                let resData = res.data
                this.quicklySetData = {
                  General: [],
                  MoveClass: [],
                  SchoolBased: []
                }
                for (let j = 0; j < resData.General.length; j++) {
                  resData.General[j].ischecked = false
                  this.quicklySetData.General.push({
                    ClassTableID: resData.General[j].ClassTableID,
                    Name: resData.General[j].Name,
                    ischecked: false
                  })
                };
                for (let k = 0; k < resData.MoveClass.length; k++) {
                  this.quicklySetData.MoveClass.push({
                    ClassTableID: resData.MoveClass[k].ClassTableID,
                    Name: resData.MoveClass[k].Name,
                    ischecked: false
                  })
                };
                for (let m = 0; m < resData.SchoolBased.length; m++) {
                  this.quicklySetData.SchoolBased.push({
                    ClassTableID: resData.SchoolBased[m].ClassTableID,
                    Name: resData.SchoolBased[m].Name,
                    ischecked: false
                  })
                };
                if (this.quicklySetData.General.length > 0 || this.quicklySetData.MoveClass.length > 0 ||
                  this.quicklySetData.SchoolBased.length > 0) {
                  this.modalQuicklySet = true
                } else {
                  this.xy.msgError('未查到可用的排课方案。')
                }
              }
            }
            this.xy.unloading()
          } else {
            this.xy.unloading()
            this.xy.msgError(res.msg)
          }
        }
      },
      // check改变
      checkChange (val) {
        if (val === 'MS') { // 早自习的添加删除
          if (this.MScheck) {
            let arr = []
            for (let i = 0; i < 7; i++) {
              arr.push({
                AMorPM: 'MS',
                AMorPMOrder: 0,
                ClassTableTimeID: 0,
                Day: i,
                EndTime: null,
                IsSelected: false,
                Order: 0,
                StartTime: null,
                Type: ''
              })
            }
            this.timeTableData.unshift({
              timeName: '早1',
              type: 'MS',
              isLast: true,
              isShow: true,
              order: 0,
              weekTime: arr
            })
          } else {
            this.timeTableData = this.timeTableData.filter((item) => { return item.type !== 'MS' })
          }
        }
        if (val === 'AM') { // 上午的添加删除
          if (this.AMcheck) {
            let arr1 = []
            for (let j = 0; j < 4; j++) {
              let arr = []
              for (let i = 0; i < 7; i++) {
                arr.push({
                  AMorPM: 'AM',
                  AMorPMOrder: j,
                  ClassTableTimeID: 0,
                  Day: i,
                  EndTime: null,
                  IsSelected: false,
                  Order: j,
                  StartTime: null,
                  Type: ''
                })
              }
              let isLast = false
              if (j === 3) {
                isLast = true
              }
              arr1.push({
                timeName: this.chinesesNumber[j] + '节',
                type: 'AM',
                isLast: isLast,
                isShow: true,
                order: j,
                weekTime: arr
              })
            }
            let lastIndex = this.timeTableData.map((item) => { return item.type }).lastIndexOf('MS')
            for (let k = 0; k < arr1.length; k++) {
              this.timeTableData.splice(lastIndex + 1 + k, 0, arr1[k])
            }
            let orderNum = 0
            for (let m = 0; m < this.timeTableData.length; m++) {
              if (this.timeTableData[m].type === 'PM') {
                this.timeTableData[m].timeName = this.chinesesNumber[4 + orderNum] + '节'
                this.timeTableData[m].order = 4 + orderNum
                this.timeTableData[m].weekTime.map((item) => {
                  item.Order = 4 + orderNum
                  return item
                })
                orderNum++
              }
            }
            this.ABdisabled = false
            let PMlist = this.timeTableData.filter((item) => { return (item.type === 'PM') })
            if (PMlist.length > 0) { // 上午和下午是否同时有
              this.NSdisabled = false
            } else {
              this.NSdisabled = true
            }
          } else {
            this.timeTableData = this.timeTableData.filter((item) => { return (item.type !== 'AM' && item.type !== 'AB' && item.type !== 'NS') })
            this.ABcheck = false
            this.NScheck = false
            let orderNum = 0
            for (let m = 0; m < this.timeTableData.length; m++) {
              if (this.timeTableData[m].type === 'PM') {
                this.timeTableData[m].timeName = this.chinesesNumber[orderNum] + '节'
                this.timeTableData[m].order = orderNum
                this.timeTableData[m].weekTime.map((item) => {
                  item.Order = orderNum
                  return item
                })
                orderNum++
              }
            };
            this.ABdisabled = true
            this.NSdisabled = true
          }
        }
        if (val === 'PM') {
          if (this.PMcheck) {
            let AMlist = this.timeTableData.filter((item) => { return (item.type === 'AM') })
            let arr1 = []
            for (let j = 0; j < 4; j++) {
              let arr = []
              for (let i = 0; i < 7; i++) {
                arr.push({
                  AMorPM: 'PM',
                  AMorPMOrder: j,
                  ClassTableTimeID: 0,
                  Day: i,
                  EndTime: null,
                  IsSelected: false,
                  Order: j + AMlist.length,
                  StartTime: null,
                  Type: ''
                })
              }
              let isLast = false
              if (j === 3) {
                isLast = true
              }
              arr1.push({
                timeName: this.chinesesNumber[j + AMlist.length] + '节',
                type: 'PM',
                isLast: isLast,
                isShow: true,
                order: j + AMlist.length,
                weekTime: arr
              })
            }

            let lastIndex = -1
            if (this.NScheck) {
              lastIndex = this.timeTableData.map((item) => { return item.type }).lastIndexOf('NS')
            } else {
              if (AMlist.length > 0) {
                lastIndex = this.timeTableData.map((item) => { return item.type }).lastIndexOf('AM')
              } else {
                lastIndex = this.timeTableData.map((item) => { return item.type }).lastIndexOf('MS')
              }
            }
            for (let k = 0; k < arr1.length; k++) {
              this.timeTableData.splice(lastIndex + 1 + k, 0, arr1[k])
            }
            this.PBdisabled = false
            AMlist = this.timeTableData.filter((item) => { return (item.type === 'AM') })
            if (AMlist.length > 0) { // 上午和下午是否同时有
              this.NSdisabled = false
            } else {
              this.NSdisabled = true
            }
          } else {
            this.timeTableData = this.timeTableData.filter((item) => { return (item.type !== 'PM' && item.type !== 'PB' && item.type !== 'NS') })
            this.PBcheck = false
            this.NScheck = false
            this.PBdisabled = true
            this.NSdisabled = true
          }
        }
        if (val === 'AB') { // 上午大课间的添加删除
          if (this.ABcheck) {
            let AMList = this.timeTableData.filter((item) => { return item.type === 'AM' })
            if (AMList.length > 1) {
              let contrastOrder = 1
              if (AMList.length > 2) {
                contrastOrder = 2
              }
              let index = -1
              for (let i = 0; i < this.timeTableData.length; i++) {
                if (this.timeTableData[i].type === 'AM' && this.timeTableData[i].order === contrastOrder) {
                  index = i
                  break
                };
              }
              let arr = []
              for (let i = 0; i < 7; i++) {
                arr.push({
                  AMorPM: 'AB',
                  AMorPMOrder: 0,
                  ClassTableTimeID: 0,
                  Day: i,
                  EndTime: null,
                  IsSelected: false,
                  Order: 0,
                  StartTime: null,
                  Type: ''
                })
              }
              let arr1 = {
                timeName: '上午大课间',
                type: 'AB',
                isLast: true,
                isShow: true,
                order: 0,
                weekTime: arr
              }
              if (index !== -1) {
                this.timeTableData.splice(index, 0, arr1)
              }
            } else {
              this.xy.msgError('上午课时少于两节，不足以有大课间。')
              this.ABcheck = false
            }
          } else {
            this.timeTableData = this.timeTableData.filter((item) => { return item.type !== 'AB' })
          }
        }
        if (val === 'NS') { // 午休的添加删除
          if (this.NScheck) {
            let AMList = this.timeTableData.filter((item) => { return item.type === 'AM' })
            let PMList = this.timeTableData.filter((item) => { return item.type === 'PM' })
            if (AMList.length === 0 || PMList.length === 0) {
              this.NScheck = false
              this.xy.msgError('当上午和下午同时有课时，才可以设置午休。')
              return false
            }
            let lastIndex = this.timeTableData.map((item) => { return item.type }).lastIndexOf('AM')
            let arr = []
            for (let i = 0; i < 7; i++) {
              arr.push({
                AMorPM: 'NS',
                AMorPMOrder: 0,
                ClassTableTimeID: 0,
                Day: i,
                EndTime: null,
                IsSelected: false,
                Order: 0,
                StartTime: null,
                Type: ''
              })
            }
            let arr1 = {
              timeName: '午休',
              type: 'NS',
              isLast: true,
              isShow: true,
              order: 0,
              weekTime: arr
            }
            this.timeTableData.splice(lastIndex + 1, 0, arr1)
          } else {
            this.timeTableData = this.timeTableData.filter((item) => { return item.type !== 'NS' })
          }
        }
        if (val === 'PB') { // 下午大课间的添加删除
          if (this.PBcheck) {
            let PMList = this.timeTableData.filter((item) => { return item.type === 'PM' })
            if (PMList.length > 1) {
              let contrastOrder = 2
              if (PMList.length > 2) {
                contrastOrder = 3
              }
              let index = -1
              let lastAM = this.timeTableData.map((item) => { return item.type }).lastIndexOf('AM')
              for (let i = 0; i < this.timeTableData.length; i++) {
                if (this.timeTableData[i].type === 'PM' &&
                  this.timeTableData[i].order === this.timeTableData[lastAM + contrastOrder].order) {
                  index = i
                  break
                };
              }
              let arr = []
              for (let i = 0; i < 7; i++) {
                arr.push({
                  AMorPM: 'PB',
                  AMorPMOrder: 0,
                  ClassTableTimeID: 0,
                  Day: i,
                  EndTime: null,
                  IsSelected: false,
                  Order: 0,
                  StartTime: null,
                  Type: ''
                })
              }
              let arr1 = {
                timeName: '下午大课间',
                type: 'PB',
                isLast: true,
                isShow: true,
                order: 0,
                weekTime: arr
              }
              if (index !== -1) {
                if (this.NScheck) {
                  this.timeTableData.splice(index + 1, 0, arr1)
                } else {
                  this.timeTableData.splice(index, 0, arr1)
                }
              }
            } else {
              this.xy.msgError('下午课时少于两节，不足以有大课间。')
              this.PBcheck = false
            }
          } else {
            this.timeTableData = this.timeTableData.filter((item) => { return item.type !== 'PB' })
          }
        }
        if (val === 'ES') {
          if (this.EScheck) {
            for (let j = 0; j < 2; j++) {
              let arr = []
              for (let i = 0; i < 7; i++) {
                arr.push({
                  AMorPM: 'ES',
                  AMorPMOrder: j,
                  ClassTableTimeID: 0,
                  Day: i,
                  EndTime: null,
                  IsSelected: false,
                  Order: j,
                  StartTime: null,
                  Type: ''
                })
              }
              let isLast = false
              if (j === 1) {
                isLast = true
              }
              this.timeTableData.push({
                timeName: this.wanData[j],
                type: 'ES',
                isLast: isLast,
                isShow: true,
                order: j,
                weekTime: arr
              })
            }
          } else {
            this.timeTableData = this.timeTableData.filter((item) => { return item.type !== 'ES' })
          }
        }
      },
      // 添加节次
      addSection (type) {
        if (type === 'MS') { // 早自习
          let MSList = this.timeTableData.filter((item) => { return item.type === 'MS' })
          if (MSList.length < 2) {
            let lastMS = this.timeTableData.map((item) => { return item.type }).lastIndexOf('MS')
            this.timeTableData[0].isLast = false
            let arr = []
            for (let i = 0; i < 7; i++) {
              arr.push({
                AMorPM: 'MS',
                AMorPMOrder: 0,
                ClassTableTimeID: 0,
                Day: i,
                EndTime: null,
                IsSelected: false,
                Order: this.timeTableData[lastMS].order + 1,
                StartTime: null,
                Type: ''
              })
            }
            let arr1 = {
              timeName: this.zaoData[this.timeTableData[lastMS].order + 1],
              type: 'MS',
              isLast: true,
              isShow: true,
              order: this.timeTableData[lastMS].order + 1,
              weekTime: arr
            }
            this.timeTableData.splice(lastMS + 1, 0, arr1)
          } else {
            this.xy.msgError('课时已达上限，不能再添加。')
          }
        };
        if (type === 'AM') { // 上午
          let AMList = this.timeTableData.filter((item) => { return item.type === 'AM' })
          if (AMList.length < 6) {
            let lastAM = this.timeTableData.map((item) => { return item.type }).lastIndexOf('AM')
            // 上午添加课
            this.timeTableData.map((item) => {
              if (item.type === 'AM') {
                item.isLast = false
              }
              return item
            })
            let arr = []
            let lastAMorder = this.timeTableData[lastAM].order + 1
            for (let i = 0; i < 7; i++) {
              arr.push({
                AMorPM: 'AM',
                AMorPMOrder: Number(this.timeTableData[lastAM].weekTime[0].AMorPMOrder) + 1,
                ClassTableTimeID: 0,
                Day: i,
                EndTime: null,
                IsSelected: false,
                Order: lastAMorder,
                StartTime: null,
                Type: ''
              })
            }
            let arr1 = {
              timeName: this.chinesesNumber[lastAMorder] + '节',
              type: 'AM',
              isLast: true,
              isShow: true,
              order: lastAMorder,
              weekTime: arr
            }
            this.timeTableData.splice(lastAM + 1, 0, arr1)
            let AMList1 = this.timeTableData.filter((item) => { return item.type === 'AM' })
            if (AMList1.length > 1) {
              this.ABdisabled = false
            }
            // 下午课程改变
            let PMOrder = 1
            for (let j = 0; j < this.timeTableData.length; j++) {
              if (this.timeTableData[j].type === 'PM') {
                this.timeTableData[j].timeName = this.chinesesNumber[lastAMorder + PMOrder] + '节'
                this.timeTableData[j].order = lastAMorder + PMOrder
                this.timeTableData[j].weekTime.map((item) => {
                  item.Order = lastAMorder + PMOrder
                  return item
                })
                PMOrder++
              }
            }
          } else {
            this.xy.msgError('课时已达上限，不能再添加。')
          }
        }
        if (type === 'PM') { // 下午
          let PMList = this.timeTableData.filter((item) => { return item.type === 'PM' })
          if (PMList.length < 6) {
            let lastPM = this.timeTableData.map((item) => { return item.type }).lastIndexOf('PM')
            this.timeTableData.map((item) => {
              if (item.type === 'PM') {
                item.isLast = false
              }
              return item
            })
            let arr = []
            let lastPMorder = this.timeTableData[lastPM].order + 1
            for (let i = 0; i < 7; i++) {
              arr.push({
                AMorPM: 'PM',
                AMorPMOrder: Number(this.timeTableData[lastPM].weekTime[0].AMorPMOrder) + 1,
                ClassTableTimeID: 0,
                Day: i,
                EndTime: null,
                IsSelected: false,
                Order: lastPMorder,
                StartTime: null,
                Type: ''
              })
            }
            let arr1 = {
              timeName: this.chinesesNumber[lastPMorder] + '节',
              type: 'PM',
              isLast: true,
              isShow: true,
              order: lastPMorder,
              weekTime: arr
            }
            this.timeTableData.splice(lastPM + 1, 0, arr1)
            let PMList1 = this.timeTableData.filter((item) => { return item.type === 'PM' })
            if (PMList1.length > 1) {
              this.PBdisabled = false
            }
          } else {
            this.xy.msgError('课时已达上限，不能再添加。')
          }
        }
        if (type === 'ES') { // 晚自习
          let ESList = this.timeTableData.filter((item) => { return item.type === 'ES' })
          if (ESList.length < 4) {
            this.timeTableData.map((item) => {
              if (item.type === 'ES') {
                item.isLast = false
              }
              return item
            })
            let arr = []
            for (let i = 0; i < 7; i++) {
              arr.push({
                AMorPM: 'ES',
                AMorPMOrder: 0,
                ClassTableTimeID: 0,
                Day: i,
                EndTime: null,
                IsSelected: false,
                Order: ESList.length,
                StartTime: null,
                Type: ''
              })
            }
            this.timeTableData.push({
              timeName: this.wanData[ESList.length],
              type: 'ES',
              isLast: true,
              isShow: true,
              order: ESList.length,
              weekTime: arr
            })
          } else {
            this.xy.msgError('课时已达上限，不能再添加。')
          }
        }
      },
      // 删除节次
      reduce (type, index) {
        if (type === 'MS') { // 早自习
          this.timeTableData.splice(index, 1)
          let lastMS = this.timeTableData.map((item) => { return item.type }).lastIndexOf('MS')
          if (lastMS !== -1) {
            this.timeTableData[lastMS].isLast = true
          } else {
            this.MScheck = false
          }
        }
        if (type === 'AM') { // 上午
          this.timeTableData.splice(index, 1)
          let AMList = this.timeTableData.filter((item) => { return item.type === 'AM' })
          if (AMList.length < 2) {
            let ABindex = this.timeTableData.map((item) => { return item.type }).lastIndexOf('AB')
            if (ABindex !== -1) {
              this.timeTableData.splice(ABindex, 1)
            }
            this.ABcheck = false
            this.ABdisabled = true
          }
          if (this.ABcheck) { // 是否有大课间
            if (AMList.length >= 2) {
              if (this.timeTableData[index - 1].type === 'AB') { // 上一个是课间
                let arr = []
                for (let i = 0; i < 7; i++) {
                  arr.push({
                    AMorPM: 'AB',
                    AMorPMOrder: 0,
                    ClassTableTimeID: 0,
                    Day: i,
                    EndTime: null,
                    IsSelected: false,
                    Order: 0,
                    StartTime: null,
                    Type: ''
                  })
                }
                let arr1 = {
                  timeName: '上午大课间',
                  type: 'AB',
                  isLast: true,
                  isShow: true,
                  order: 0,
                  weekTime: arr
                }
                let ABindex = this.timeTableData.map((item) => { return item.type }).lastIndexOf('AB')
                this.timeTableData.splice(ABindex, 1)
                this.timeTableData.splice(index - 2, 0, arr1)
              }
            }
          }
          let lastAM = this.timeTableData.map((item) => { return item.type }).lastIndexOf('AM')
          let lastAMorder = 0
          if (lastAM !== -1) {
            this.timeTableData[lastAM].isLast = true
            lastAMorder = this.timeTableData[lastAM].order + 1
          } else { // 上午删除最后一个
            this.AMcheck = false
            if (this.NScheck) { // 午休删除
              let NSindex = this.timeTableData.map((item) => { return item.type }).indexOf('NS')
              this.timeTableData.splice(NSindex, 1)
              this.NScheck = false
            };
            this.NSdisabled = true
          };
          // 下午课程改变
          let PMOrder = 0
          for (let j = 0; j < this.timeTableData.length; j++) {
            if (this.timeTableData[j].type === 'PM') {
              if (lastAMorder === -1) {
                lastAMorder = 0
              }
              this.timeTableData[j].timeName = this.chinesesNumber[lastAMorder + PMOrder] + '节'
              this.timeTableData[j].order = lastAMorder + PMOrder
              this.timeTableData[j].weekTime.map((item) => {
                item.Order = lastAMorder + PMOrder
                return item
              })
              PMOrder++
            }
          }
        }
        if (type === 'PM') { // 下午
          this.timeTableData.splice(index, 1)
          let PMList = this.timeTableData.filter((item) => { return item.type === 'PM' })
          if (PMList.length < 2) {
            let PBindex = this.timeTableData.map((item) => { return item.type }).lastIndexOf('PB')
            if (PBindex !== -1) {
              this.timeTableData.splice(PBindex, 1)
            }
            this.PBcheck = false
            this.PBdisabled = true
          }
          if (this.PBcheck) { // 是否有大课间
            if (PMList.length >= 2) {
              if (this.timeTableData[index - 1].type === 'PB') { // 上一个是课间
                let arr = []
                for (let i = 0; i < 7; i++) {
                  arr.push({
                    AMorPM: 'PB',
                    AMorPMOrder: 0,
                    ClassTableTimeID: 0,
                    Day: i,
                    EndTime: null,
                    IsSelected: false,
                    Order: 0,
                    StartTime: null,
                    Type: ''
                  })
                }
                let arr1 = {
                  timeName: '下午大课间',
                  type: 'PB',
                  isLast: true,
                  isShow: true,
                  order: 0,
                  weekTime: arr
                }
                let PBindex = this.timeTableData.map((item) => { return item.type }).lastIndexOf('PB')
                this.timeTableData.splice(PBindex, 1)
                this.timeTableData.splice(index - 2, 0, arr1)
              }
            }
          };
          let lastPM = this.timeTableData.map((item) => { return item.type }).lastIndexOf('PM')
          if (lastPM !== -1) {
            this.timeTableData[lastPM].isLast = true
          } else { // 下午删除最后一个
            this.PMcheck = false
            if (this.NScheck) { // 午休删除
              let NSindex = this.timeTableData.map((item) => { return item.type }).indexOf('NS')
              this.timeTableData.splice(NSindex, 1)
              this.NScheck = false
            };
            this.NSdisabled = true
          };
        }
        if (type === 'ES') { // 晚自习
          this.timeTableData.splice(index, 1)
          let lastES = this.timeTableData.map((item) => { return item.type }).lastIndexOf('ES')
          if (lastES !== -1) {
            this.timeTableData[lastES].isLast = true
          } else {
            this.EScheck = false
          }
        }
      },
      // 上移
      upMove (type, index) {
        if (type === 'AB') { // 上午大课间
          let preTwo = this.timeTableData.slice(index - 2, index)
          let AMList = preTwo.filter((item) => { return item.type === 'AM' })
          if (AMList.length === 2) {
            let ABCopy = this.timeTableData.filter((item) => { return item.type === 'AB' })
            this.timeTableData.splice(index, 1)
            this.timeTableData.splice(index - 1, 0, ABCopy[0])
          } else {
            this.xy.msgError('上午大课间必须在上午课节之间。')
          }
        };
        if (type === 'PB') { // 下午大课间
          let preTwo = this.timeTableData.slice(index - 2, index)
          let PMList = preTwo.filter((item) => { return item.type === 'PM' })
          if (PMList.length === 2) {
            let PBCopy = this.timeTableData.filter((item) => { return item.type === 'PB' })
            this.timeTableData.splice(index, 1)
            this.timeTableData.splice(index - 1, 0, PBCopy[0])
          } else {
            this.xy.msgError('下午大课间必须在下午课节之间。')
          }
        };
      },
      // 下移
      downMove (type, index) {
        if (type === 'AB') { // 上午大课间
          let nextTwo = this.timeTableData.slice(index + 1, index + 3)
          let AMList = nextTwo.filter((item) => { return item.type === 'AM' })
          if (AMList.length === 2) {
            let ABCopy = this.timeTableData.filter((item) => { return item.type === 'AB' })
            this.timeTableData.splice(index, 1)
            this.timeTableData.splice(index + 1, 0, ABCopy[0])
          } else {
            this.xy.msgError('上午大课间必须在上午课节之间。')
          }
        };
        if (type === 'PB') { // 下午大课间
          let nextTwo = this.timeTableData.slice(index + 1, index + 3)
          let PMList = nextTwo.filter((item) => { return item.type === 'PM' })
          if (PMList.length === 2) {
            let PBCopy = this.timeTableData.filter((item) => { return item.type === 'PB' })
            this.timeTableData.splice(index, 1)
            this.timeTableData.splice(index + 1, 0, PBCopy[0])
          } else {
            this.xy.msgError('下午大课间必须在下午课节之间。')
          }
        };
      },
      // 设置时间
      trSetTime (val) {
        this.curTag = ''
        this.curTag = val
        this.curType = ''
        this.curType = '1'
        this.starTime = ''
        this.endTime = ''
        this.modalSetTime = true
        this.canSetTime = true
      },
      tdSetTime (val) {
        this.curTag = ''
        this.curTag = val
        this.curType = ''
        this.curType = '0'
        this.starTime = val.StartTime
        this.endTime = val.EndTime
        this.modalSetTime = true
        this.canSetTime = true
      },
      radioChange () {
        if (this.timeRadio === '1') {
          this.starTime = ''
          this.endTime = ''
        }
      },
      submitSetTime () {
        if (this.modalSetTime) {
          if (this.endTime === '' || this.endTime === null || this.starTime === '' || this.starTime === null) {
            this.xy.msgError('上课时间和下课时间不能为空。')
            return false
          };
          let starTime1 = this.xy.moment(`2020-01-01 ${this.starTime}`)
          let endTime1 = this.xy.moment(`2020-01-01 ${this.endTime}`)
          if (starTime1.diff(endTime1, 'minutes') >= 0) {
            this.xy.msgError('对不起，下课时间必须晚于上课时间。')
            return false
          };
          // 1整行  2单节
          if (this.curType === '0') {
            this.curTag.StartTime = this.starTime
            this.curTag.EndTime = this.endTime
          }
          if (this.curType === '1') {
            this.curTag.weekTime.map((item) => {
              item.StartTime = this.starTime
              item.EndTime = this.endTime
              return false
            })
          }
          this.modalSetTime = false
          this.starTime = ''
          this.endTime = ''
        }
      },
      // 清除全部时间
      clearAllTime () {
        if (this.isOperation === 0) {
          let that = this
          that.$Modal.confirm({
            title: '温馨提示',
            content: '是否确认清空？',
            async onOk () {
              let params = {
                id: that.classTableID
              }
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/ClassTableTime/ClearTime`, params)
              if (res.success) {
                that.xy.msgSuc('清除全部时间成功。')
                that.MScheck = false
                that.AMcheck = false
                that.ABcheck = false
                that.ABdisabled = false
                that.NScheck = false
                that.NScheck = false
                that.NSdisabled = false
                that.PMcheck = false
                that.PBcheck = false
                that.PBdisabled = false
                that.EScheck = false
                that.$parent.getGeneralFlows()
                that.getClassTableTimeAll()
              }
            }
          })
        }
      },
      // 快速设置
      quicklySet () {
        if (this.isOperation === 0) {
          this.saveTimeSubmit(1)
        }
      },
      radioChanage (val) {
        this.quicklySetData.General.map((item) => {
          item.ischecked = false
          return item
        })
        this.quicklySetData.MoveClass.map((item) => {
          item.ischecked = false
          return item
        })
        this.quicklySetData.SchoolBased.map((item) => {
          item.ischecked = false
          return item
        })
        val.ischecked = true
        this.selectClassTable = val
      },
      async submitQuicklySet () {
        if (this.selectClassTable.ClassTableID === undefined) {
          this.xy.msgError('请选择排课方案。')
          return
        }
        let params = {
          SelectClassTableID: this.selectClassTable.ClassTableID,
          ClassTableID: this.classTableID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTableTime/Setting`, params)
        if (res.success) {
          this.xy.msgSuc('快速设置成功。')
          this.selectClassTable = ''
          this.modalQuicklySet = false
          this.$parent.getGeneralFlows()
          this.getClassTableTimeAll()
        }
      },
      // 快速设定作息时间
      quicklySetting () {
        if (this.timeTableData.length === 0) {
          this.xy.msgError('请先添加节次。')
          return false
        }
        this.isShowMS = false
        this.isShowAM = false
        this.isShowAB = false
        this.isShowPM = false
        this.isShowPB = false
        this.isShowES = false
        this.timeTableData.map((item) => {
          if (item.type === 'MS') {
            this.isShowMS = true
          };
          if (item.type === 'AM') {
            this.isShowAM = true
          };
          if (item.type === 'AB') {
            this.isShowAB = true
          };
          if (item.type === 'PM') {
            this.isShowPM = true
          };
          if (item.type === 'PB') {
            this.isShowPB = true
          };
          if (item.type === 'ES') {
            this.isShowES = true
          };
          return item
        })
        this.modalQuicklySetting = true
      },
      cancleQuicklySetting () {
        this.MSStartTime = null
        this.MSLength = 45
        this.AMStartTime = null
        this.AMLength = 45
        this.ABRecessLength = 20
        this.PMStartTime = null
        this.PMLength = 45
        this.PBRecessLength = 20
        this.ESStartTime = null
        this.ESLength = 45
        this.commonLength = 10
        this.modalQuicklySetting = false
      },
      add (date, strInterval, Number) {
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
      submitQuicklySetting () {
        let reg = /^([1-9]|[1-5]\d|60)$/// 1-60正整数
        if (this.isShowMS) { // 早自习
          if (this.MSStartTime === null || this.MSStartTime === '') {
            this.xy.msgError('请填写早自习开始上课时间。')
            return false
          };
          if (!reg.test(this.MSLength)) {
            this.xy.msgError('早自习每节课时长限制1-60正整数。')
            return false
          };
        };
        if (this.isShowAM) { // 上午
          if (this.AMStartTime === null || this.AMStartTime === '') {
            this.xy.msgError('请填写上午开始上课时间。')
            return false
          };
          if (!reg.test(this.AMLength)) {
            this.xy.msgError('上午每节课时长限制1-60正整数。')
            return false
          };
          if (this.isShowAB) { // 上午大课间
            if (!reg.test(this.ABRecessLength)) {
              this.xy.msgError('上午大课间时长限制1-60正整数。')
              return false
            };
          }
        };
        if (this.isShowPM) { // 下午
          if (this.PMStartTime === null || this.PMStartTime === '') {
            this.xy.msgError('请填写下午开始上课时间。')
            return false
          };
          if (!reg.test(this.PMLength)) {
            this.xy.msgError('下午每节课时长限制1-60正整数。')
            return false
          };
          if (this.isShowPB) { // 下午大课间
            if (!reg.test(this.PBRecessLength)) {
              this.xy.msgError('下午大课间时长限制1-60正整数。')
              return false
            };
          }
        };
        if (this.isShowES) { // 晚自习
          if (this.ESStartTime === null || this.ESStartTime === '') {
            this.xy.msgError('请填写晚自习开始上课时间。')
            return false
          }
          if (!reg.test(this.ESLength)) {
            this.xy.msgError('晚自习每节课时长限制1-60正整数。')
            return false
          };
        };
        if (!reg.test(this.commonLength)) { // 普通课间时长
          this.xy.msgError('普通课间时长限制1-60正整数。')
          return false
        }
        let MSStartTime = ''// 早自习
        let MSEndTime = ''// 早自习
        let AMStartTime = ''// 上午
        let AMEndTime = ''// 上午
        let ABStartTime = ''// 上午大课间
        let ABEdnTime = ''// 上午大课间
        let PMStartTime = ''// 下午
        let PMEndTime = ''// 下午
        let PBStartTime = ''// 下午大课间
        let PBEdnTime = ''// 下午大课间
        let ESStartTime = ''// 晚自习
        let ESEndTime = ''// 晚自习
        for (let i = 0; i < this.timeTableData.length; i++) {
          if (this.timeTableData[i].type === 'MS') { // 早自习
            if (MSStartTime === '') {
              MSStartTime = this.MSStartTime
            } else {
              MSStartTime = this.xy.timeFormat(this.add(this.xy.timeFormat(MSStartTime), 'n', Number(this.MSLength) + Number(this.commonLength)), 'HH:mm')
            }
            MSEndTime = this.xy.timeFormat(this.add(this.xy.timeFormat(MSStartTime), 'n', Number(this.MSLength)), 'HH:mm')
            this.timeTableData[i].weekTime.map((item, index) => {
              item.StartTime = MSStartTime
              item.EndTime = MSEndTime
              return item
            })
          };
          if (this.timeTableData[i].type === 'AM') { // 上午
            if (AMStartTime === '') {
              if (this.xy.timeFormat(this.AMStartTime) < this.xy.timeFormat(MSEndTime)) {
                this.xy.msgError('上午开始时间不能小于早自习结束时间。')
                return false
              }
              AMStartTime = this.AMStartTime
            } else {
              if (this.timeTableData[i - 1].type !== 'AB') {
                AMStartTime = this.xy.timeFormat(this.add(this.xy.timeFormat(AMStartTime), 'n', Number(this.AMLength) + Number(this.commonLength)), 'HH:mm')
              }
            }
            AMEndTime = this.xy.timeFormat(this.add(this.xy.timeFormat(AMStartTime), 'n', Number(this.AMLength)), 'HH:mm')
            this.timeTableData[i].weekTime.map((item, index) => {
              item.StartTime = AMStartTime
              item.EndTime = AMEndTime
              return item
            })
          }
          if (this.timeTableData[i].type === 'AB') { // 上午大课间
            ABStartTime = AMEndTime
            ABEdnTime = this.xy.timeFormat(this.add(this.xy.timeFormat(ABStartTime), 'n', Number(this.ABRecessLength)), 'HH:mm')
            AMStartTime = ABEdnTime
            this.timeTableData[i].weekTime.map((item, index) => {
              item.StartTime = ABStartTime
              item.EndTime = ABEdnTime
              return item
            })
          }
          if (this.NScheck && this.timeTableData[i].type === 'NS') { // 午休
            if (this.xy.timeFormat(this.PMStartTime) <= this.xy.timeFormat(AMEndTime)) {
              this.xy.msgError('午休存在，上课时间冲突。')
              return false
            }
            this.timeTableData[i].weekTime.map((item) => {
              item.StartTime = AMEndTime
              item.EndTime = this.PMStartTime
              return item
            })
          }
          if (this.timeTableData[i].type === 'PM') { // 下午
            if (PMStartTime === '') {
              if (this.xy.timeFormat(this.PMStartTime) < this.xy.timeFormat(AMEndTime)) {
                this.xy.msgError('下午开始时间不能小于上午结束时间。')
                return false
              }
              PMStartTime = this.PMStartTime
            } else {
              if (this.timeTableData[i - 1].type !== 'PB') {
                PMStartTime = this.xy.timeFormat(this.add(this.xy.timeFormat(PMStartTime), 'n', Number(this.PMLength) + Number(this.commonLength)), 'HH:mm')
              }
            }
            PMEndTime = this.xy.timeFormat(this.add(this.xy.timeFormat(PMStartTime), 'n', Number(this.PMLength)), 'HH:mm')
            this.timeTableData[i].weekTime.map((item, index) => {
              item.StartTime = PMStartTime
              item.EndTime = PMEndTime
              return item
            })
          }
          if (this.timeTableData[i].type === 'PB') { // 下午大课间
            PBStartTime = PMEndTime
            PBEdnTime = this.xy.timeFormat(this.add(this.xy.timeFormat(PBStartTime), 'n', Number(this.PBRecessLength)), 'HH:mm')
            PMStartTime = PBEdnTime
            this.timeTableData[i].weekTime.map((item, index) => {
              item.StartTime = PBStartTime
              item.EndTime = PBEdnTime
              return item
            })
          }
          if (this.timeTableData[i].type === 'ES') { // 晚自习
            if (ESStartTime === '') {
              if (i !== 0) {
                if (this.xy.timeFormat(this.ESStartTime) < this.xy.timeFormat(this.timeTableData[i - 1].weekTime[0].EndTime)) {
                  this.xy.msgError('晚自习开始时间不能小于上一节结束时间。')
                  return false
                }
              }
              ESStartTime = this.ESStartTime
            } else {
              ESStartTime = this.xy.timeFormat(this.add(this.xy.timeFormat(ESStartTime), 'n', Number(this.ESLength) + Number(this.commonLength)), 'HH:mm')
            }
            ESEndTime = this.xy.timeFormat(this.add(this.xy.timeFormat(ESStartTime), 'n', Number(this.ESLength)), 'HH:mm')
            this.timeTableData[i].weekTime.map((item, index) => {
              item.StartTime = ESStartTime
              item.EndTime = ESEndTime
              return item
            })
          }
        }
        this.modalQuicklySetting = false
      }
    }
  }
</script>
<style lang="less" scoped>
  @import './css/classTable.less';
  .wt .ivu-checkbox-wrapper{
    margin-right: 20px;
  }
  .timer-text {
    color: #666;
    margin: 0 5px;
  }
  .section-icon {
    float: right;
  }
  .xy-checkbox{
    width:14px;
    height:14px;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    line-height: 12px;
    position: relative;
  }
  .xy-checkbox::before{
    content: "";
    position: absolute;
    top: 0;left: 0;
    background:#fff;
    width: 100%;
    height: 100%;
    border: 1px solid #dcdee2;
    border-radius: 3px;
  }
  .xy-checkbox:checked::before{
    content: "\2713";
    background-color: #2d8cf0;
    position: absolute;
    top: 0;
    left: 0;
    width:100%;
    border: 1px solid #2d8cf0;
    color:#fff;
    font-size: 12px;
    font-weight: bold;
  }

.class-hour-table{
  border: 1px solid #E8E8E8;
  border-top: none;
  text-align: center;
  margin: 0 auto;
  border-collapse: collapse;
  font-size: 14px;
}
.class-hour-table tr {
  width: 100%;
  height: 54px;
  text-align: center;
}
.class-hour-table tr th {
  border: 1px solid #E8E8E8;
  border-top: none;
  color: rgba(0,0,0,.85);
  font-weight: bold;
  text-align: left;
  background: #fafafa;
  padding:0 10px 0 20px;

}
.class-hour-table tr td {
  text-align: left;
  font-weight: initial;
  position: relative;
  cursor:pointer;
  color: rgba(0,0,0,.65);
  border: 1px solid #e8e8e8;
}
.class-hour-table tr:nth-child(1){
    cursor:default;
    color: #333;
}
.class-hour-table tr td:nth-child(2){
    cursor:default;
    color: #333;
}
.class-hour-table .fa-plus-circle,.class-hour-table .fa-minus-circle{
    cursor:pointer;
}
.class-hour-table tr td.setTime{
  color: #4196FF;
}
.class-hour-table tr td>span{
    padding:0 15px;
}
.class-hour-table tr td .section-icon{
    padding:0 15px 0 0;
}
.class-hour-table tbody tr td:nth-child(2) {
  text-align: left;
}
.time-list li{
  display: inline-block;
  list-style: none;
  padding: 10px 8px;
}
.time-list li label,.time-list li input{
  cursor: pointer;
}
.active-bg{
  background: #7badff;
  color: #fff;
  padding: 0;
}
.timePop{
  display: none;
}
.add-section {
  color: #4285f4;
  cursor:pointer;
}
.red-section {
  color: #fc8450;
  cursor:pointer;
}
.popover {
  position: absolute;
  top: -230px;
  left: -20px;
  z-index: 1060;
  display: none;
  max-width: 800px;
  padding: 1px;
  color:#333;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: left;
  text-align: start;
  text-decoration: none;
  text-shadow: none;
  text-transform: none;
  letter-spacing: normal;
  word-break: normal;
  word-spacing: normal;
  word-wrap: normal;
  white-space: normal;
  background-color: #fff;
  -webkit-background-clip: padding-box;
  background-clip: padding-box;
  border: 1px solid #ccc;
  border: 1px solid rgba(0,0,0,.2);
  border-radius: 6px;
  -webkit-box-shadow: 0 5px 10px rgba(0,0,0,.2);
  box-shadow: 0 5px 10px rgba(0,0,0,.2);
  line-break: auto;
  z-index: 9999;
}
.popover.top>.arrow {
  bottom: -11px;
  left: 50%;
  margin-left: -11px;
  border-top-color: #999;
  border-top-color: rgba(0,0,0,.25);
  border-bottom-width: 0;
}
.popover>.arrow {
  border-width: 11px;
}
.popover>.arrow, .popover>.arrow:after {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
}
.popover.top>.arrow:after {
  bottom: 1px;
  margin-left: -10px;
  content: " ";
  border-top-color: #fff;
  border-bottom-width: 0;
}
.popover>.arrow:after {
  content: "";
  border-width: 10px;
}
.popover>.arrow, .popover>.arrow:after {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
}
.popover-title {
  padding: 8px 14px;
  margin: 0;
  font-size: 14px;
  background-color: #f7f7f7;
  border-bottom: 1px solid #ebebeb;
  border-radius: 5px 5px 0 0;
}
.popover-content {
  padding: 9px 14px;
  width: 230px;
  height: 230px;
}
.popover-content label{
  padding-right:15px;
}
.popover-content .timePicker .alert-time-top{
  padding:8px 0;
}
.popover-content .timePicker .alert-time-top h6{
  margin-bottom:5px;
}
.alert-time-btn {
  width: 100%;
  position: absolute;
  bottom:20px;
  right: 0px;
  }
.quickly-set li h2{
  font-size:16px;
  font-weight:bold;
  padding-bottom:4px;
  border-bottom: 1px solid #ebebeb;
}
.quickly-set li label{
  display:block;
  font-size: 14px;
  margin: 8px 0;
}
.filter-state{
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
/*快速设定*/
.set-section{
    margin-bottom:10px;
}
.time-picker {
    width: 200px;
    display: inline-block!important;
}
.quick-title{
    font-weight:400;
    color:#333;
}
</style>
