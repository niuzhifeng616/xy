<template>
  <!-- 教学质量：学科能力分析 -->
  <div class="xy-content-module xyPrj">
    <ul class="xyPrj-nav">
        <li v-for="(title,index) in tabTitle"
          :key="index"
          @click="cur=index">
          <a :class="{'selected':index==cur}" href="javascript:;">{{title}}</a>
        </li>
    </ul>

    <Select v-model="selectResult"
      placeholder="请选择考试名称"
      style="width:270px;"
      v-show="cur==0"
      class="xyPrj-select has_iView"
      @on-change="FromSubmit()">
      <Option v-for="item in dropdownlist"
        :value="item.value"
        :key="item.value" >
        {{ item.label }}
      </Option>
    </Select>

    <Select v-model="searchValue"
      style="width:270px;"
      @on-query-change="OnChangeQuery"
      placeholder="请输入用户名/姓名"
      class="xyPrj-select has_iView"
      :loading="loading1"
      :remote-method="remoteMethod1"
      @on-change="FromSubmit()"
      v-show="cur==0"
      v-if="isShowSearch"
      clearable
      filterable>
      <Option v-for="(option, index) in options1"
        :value="option.value"
        :key="index">
        {{ option.label }}
      </Option>
    </Select>

    <div class="tab-content">
        <!-- tab:学科能力分析 -->
        <div v-show="cur==0">
            <div class="xyPrj-layout">
                <div class="xyPrj-layout-header">
                    <h3 class="xyPrj-title">学科能力分析</h3>
                </div>
                <div class="xyPrj-layout-body">
                    <div class="xyPrj-layout-area" style="max-width:50%;">
                        <div id="echartOne" style="width:640px;height:300px;padding-top:20px;"></div>
                    </div>
                    <div class="xyPrj-layout-area" style="max-width:50%; width: 100%">
                        <table class="xyPrj-table" v-if="newsouceArray.length !== 0 || newpowerArray.length !== 0">
                            <thead>
                            <th width="120px">学科</th>
                            <th width="100px" v-for="(name,index) in subjectArray" :key="index">{{name}}</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <p>总分</p>
                                        <p>（换算分）</p>
                                    </td>
                                    <td v-for="(souce,index) in newsouceArray" :key="index">{{souce}}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>学科能力分</p>
                                        <p>（换算分）</p>
                                    </td>
                                    <td v-for="(power,index) in newpowerArray" :key="index">{{power}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="no-dt" v-else>
                          <i class="iconfont">&#xe6e7;</i>
                          <p>您还没有学科能力的信息。</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="xyPrj-layout">
                <div class="xyPrj-layout-header">
                    <h3 class="xyPrj-title">学科组合分析</h3>
                </div>
                <div class="xyPrj-layout-body">
                    <div class="xyPrj-layout-area" style="max-width:60%">
                        <a class="xyPrj-btn-indicator" v-for="(item,index) in groupName" :key="index" :class="item.class"  @click="showGroup(index)">{{item.name}}</a>
                        <Modal v-model="windowIsShow" title="六选三" width="580px">
                          <div class="xyPrj-card">
                            <a class="xyPrj-btn-marker"
                                  v-for="(sub, index) in subjectName"
                                  :key="index"
                                  :class="{'selected':modal4[clickIndex][index]===true}"
                                  @click="check(index)"
                                  href="javascript:;">{{sub}}</a>
                          </div>
                          <div slot="footer">
                            <Button class="xy-modal-close" @click="cancel">取消</Button>
                            <Button class="xy-modal-primary" shape="circle" @click="ok">确定</Button>
                          </div>
                        </Modal>
                        <div id="echartTwo" style="width:83%;height:300px;"></div>
                    </div>
                    <div class="xyPrj-layout-area" style="max-width:40%; width: 100%">
                        <table class="xyPrj-table" v-if="checkBoxSumValueArray.length !== 0 || checkBoxSumKeyArray.length !== 0">
                            <thead>
                                <th width="150px">组合学科</th>
                                <th width="120px" v-for="(checkname, index) in checkBoxSumKeyArray" :key="index">{{checkname}}</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <p>学科总分</p>
                                        <p>（换算分）</p>
                                    </td>
                                    <td v-for="(soucevalue, index) in checkBoxSumValueArray" :key="index">{{soucevalue}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="no-dt" v-else>
                          <i class="iconfont">&#xe6e7;</i>
                          <p>您还没有学科组合的信息，请先选择学科组合。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- tab:学科组合分析 -->
        <div v-show="cur==1">
            <div class="xyPrj-layout">
                <div class="xyPrj-layout-header">
                    <h3 class="xyPrj-title">学科组合分析</h3>
                </div>
                <div class="xyPrj-layout-body">
                    <div class="xyPrj-layout-area" style="width:50%;">
                        <div v-show="physicsScorePointArray.length !== 0 || physicsPowerPointArray.length !== 0" id="echartPhysics" style="width:600px;height:300px;"></div>
                        <div class="no-dt" style="width:600px;height:300px;" v-show="physicsScorePointArray.length === 0 || physicsPowerPointArray.length === 0">
                          <i class="iconfont">&#xe6e7;</i>
                          <p>您还没有物理成绩的信息。</p>
                        </div>
                    </div>
                    <div class="xyPrj-layout-area" style="width:50%;">
                        <div v-show="chemistryScorePointArray.length !== 0 || chemistryPowerPointArray.length !== 0" id="echartChemistry" style="width:600px;height:300px;"></div>
                        <div class="no-dt" style="width:600px;height:300px;" v-show="chemistryScorePointArray.length === 0 || chemistryPowerPointArray.length === 0" id="echartChemistry">
                          <i class="iconfont">&#xe6e7;</i>
                          <p>您还没有化学成绩的信息。</p>
                        </div>
                    </div>
                </div>
                <div class="xyPrj-layout-body">
                    <div class="xyPrj-layout-area" style="width:50%;">
                        <div v-show="biologyScorePointArray.length !== 0 || biologyPowerPointArray.length !== 0" id="echartBiology" style="width:600px;height:300px;"></div>
                        <div class="no-dt" style="width:600px;height:300px;" v-show="biologyScorePointArray.length === 0 || biologyPowerPointArray.length === 0">
                          <i class="iconfont">&#xe6e7;</i>
                          <p>您还没有生物成绩的信息。</p>
                        </div>
                    </div>
                    <div class="xyPrj-layout-area" style="width:50%;">
                        <div v-show="politicsScorePointArray.length !== 0 || politicsPowerPointArray.length !== 0" id="echartPolitics" style="width:600px;height:300px;"></div>
                        <div class="no-dt" style="width:600px;height:300px;" v-show="politicsScorePointArray.length === 0 || politicsPowerPointArray.length === 0" id="echartPolitics">
                          <i class="iconfont">&#xe6e7;</i>
                          <p>您还没有政治成绩的信息。</p>
                        </div>
                    </div>
                </div>
                <div class="xyPrj-layout-body">
                    <div class="xyPrj-layout-area" style="width:50%;">
                        <div v-show="historyScorePointArray.length !== 0 || historyPowerPointArray.length !== 0" id="echartHistory" style="width:600px;height:300px;"></div>
                        <div class="no-dt" style="width:600px;height:300px;" v-show="historyScorePointArray.length === 0 || historyPowerPointArray.length === 0" id="echartHistory">
                          <i class="iconfont">&#xe6e7;</i>
                          <p>您还没有历史成绩的信息。</p>
                        </div>
                    </div>
                    <div class="xyPrj-layout-area" style="width:50%;">
                        <div v-show="geographyScorePointArray.length !== 0 || geographyPowerPointArray.length !== 0" id="echartGeography" style="width:600px;height:300px;"></div>
                        <div class="no-dt" style="width:600px;height:300px;" v-show="geographyScorePointArray.length === 0 || geographyPowerPointArray.length === 0">
                          <i class="iconfont">&#xe6e7;</i>
                          <p>您还没有地理成绩的信息。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- tab:学科成绩分析 -->
        <div v-show="cur==2">
            <div class="xyPrj-layout">
                <div class="xyPrj-layout-body">
                    <div class="xyPrj-layout-area" style="width:155px; padding-right:0">
                        <div v-for="(subject,index) in allSubjectNameArray" :key="index" style="padding:0 0 5% 0;width:100%;">
                            <a class="xyPrj-btn-indicator-single" :class="{'selected':modal3[index]===true}" @click="tabClick(index)">{{subject}}</a><br/>
                        </div>
                    </div>
                    <div class="xyPrj-layout-area" style="width: calc(100% - 175px);">
                        <div v-show="allExamValueArray.length !== 0 || singleSorcePointPageArray.length !== 0" id="echartSingle" style="width:1000px;height:500px;"></div>
                        <div class="no-dt" v-show="allExamValueArray.length === 0 || singleSorcePointPageArray.length === 0">
                          <i class="iconfont">&#xe6e7;</i>
                          <p>您还没有当前考试成绩的信息。</p>
                        </div>
                    </div>
                </div>
                <div class="xyPrj-layout-body">
                    <div class="xyPrj-layout-area" style="width:155px; padding-right:0">
                        <div v-for="(subject,index) in allSubjectNameArray" :key="index" style="padding:0 0 5% 0;width:100%;">
                            <a class="xyPrj-btn-indicator-single" style="opacity:0;" :class="{'selected':modal3[index]===true}" @click="tabClick(index)">{{subject}}</a><br/>
                        </div>
                    </div>
                    <div class="xyPrj-layout-area" style="width: calc(100% - 175px);">
                        <div v-if="allExamValueArray.length !== 0 || singleSorcePointPageArray.length !== 0">
                            <table class="xyPrj-table">
                                <thead>
                                <th width="120px">考试名称</th>
                                <th width="100px" v-for="(examname, index) in allExamValueArray" :key="index">{{examname}}</th>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <p>总分</p>
                                            <p>（换算分）</p>
                                        </td>
                                        <td v-for="(soucepoint, index) in singleSorcePointPageArray" :key="index">{{soucepoint}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>学科能力分</p>
                                            <p>（换算分）</p>
                                        </td>
                                        <td v-for="(powerpoint, index) in singlePowerPointPageArray" :key="index">{{powerpoint}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                          <div class="no-dt" v-else>
                            <i class="iconfont">&#xe6e7;</i>
                            <p>您还没有考试成绩的信息。</p>
                          </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'SubjectAbilityAnalysis',
    components: {
    },
    data () {
      return {
        /// type 学科能力分析
        tabTitle: ['学科能力分析', '学科组合分析', '学科成绩分析'],
        groupName: [{ name: '选择组合方式1', class: '', isCheck: 0 }, { name: '选择组合方式2', class: '', isCheck: 0 },
                    { name: '选择组合方式3', class: '', isCheck: 0 }, { name: '选择组合方式4', class: '', isCheck: 0 },
                    { name: '选择组合方式5', class: '', isCheck: 0 }],
        subjectArray: ['语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理'],
        group: { 0: true, 1: true, 2: true, 3: true, 4: true },
        subjectName: ['物理', '化学', '生物', '历史', '地理', '政治'],
        cur: 0, // 默认选中第一个tab，
        subjectScore: [],
        groupSelect: [], // 获取六科选中值,
        totalMetaData: [], // 接口返回数据 单个数据
        // 基本信息
        aseId: 0,
        aseName: '',
        modal1: [false, false, false, false, false],
        modal2: [false, false, false, false, false, false],
        modal3: [true, false, false, false, false, false, false, false, false],
        modal4: [[false, false, false, false, false, false], [false, false, false, false, false, false], [false, false, false, false, false, false], [false, false, false, false, false, false], [false, false, false, false, false, false]],
        windowIsShow: false,
        par: -1,
        // Echarts 图表涉及数组
        souceArray: ['Chinese', 'Math', 'English', 'Physics', 'Chemistry', 'Biology', 'Politics', 'History', 'Geography'],
        powerArray: ['ChineseAbility', 'MathAbility', 'EnglishAbility', 'PhysicsAbility', 'ChemistryAbility', 'BiologyAbility', 'PoliticsAbility', 'HistoryAbility', 'GeographyAbility'],
        souceArrayOneChart: ['Physics', 'Chemistry', 'Biology', 'Politics', 'History', 'Geography'],
        powerArrayOneChart: ['PhysicsAbility', 'ChemistryAbility', 'BiologyAbility', 'PoliticsAbility', 'HistoryAbility', 'GeographyAbility'],
        newsouceArray: [],
        newpowerArray: [],
        newsouceArrayOneChart: [],
        newpowerArrayOneChart: [],
        result: [],
        searchValue: '', // 查询值
        dropdownlist: [],
        selectResult: 0, // 下拉框选中值
        clickIndex: 0,
        checkBoxSumKeyArray: [],
        checkBoxSumValueArray: [],
        isShowSearch: false,
        // 学科成绩分析 成绩分
        physicsScorePointArray: [],
        chemistryScorePointArray: [],
        biologyScorePointArray: [],
        historyScorePointArray: [],
        geographyScorePointArray: [],
        politicsScorePointArray: [],
        chineseScorePointArray: [],
        mathScorePointArray: [],
        englishScorePointArray: [],

        physicsScorePointPageArray: [],
        chemistryScorePointPageArray: [],
        biologyScorePointPageArray: [],
        historyScorePointPageArray: [],
        geographyScorePointPageArray: [],
        politicsScorePointPageArray: [],
        chineseScorePointPageArray: [],
        mathScorePointPageArray: [],
        englishScorePointPageArray: [],

        // 能力分
        physicsPowerPointArray: [],
        chemistryPowerPointArray: [],
        biologyPowerPointArray: [],
        historyPowerPointArray: [],
        geographyPowerPointArray: [],
        politicsPowerPointArray: [],
        chinesePowerPointArray: [],
        mathPowerPointArray: [],
        englishPowerPointArray: [],

        physicsPowerPointPageArray: [],
        chemistryPowerPointPageArray: [],
        biologyPowerPointPageArray: [],
        historyPowerPointPageArray: [],
        geographyPowerPointPageArray: [],
        politicsPowerPointPageArray: [],
        chinesePowerPointPageArray: [],
        mathPowerPointPageArray: [],
        englishPowerPointPageArray: [],

        allExamValueArray: [],
        /// 学科成绩分析
        allSubjectNameArray: ['语文成绩走势图', '数学成绩走势图', '英语成绩走势图', '物理成绩走势图', '化学成绩走势图', '生物成绩走势图', '政治成绩走势图', '历史成绩走势图', '地理成绩走势图'],
        singleSorcePointArray: [],
        singlePowerPointArray: [],
        singleSorcePointPageArray: [],
        singlePowerPointPageArray: [],
        // 考试id
        allExamKeyArray: [],
        groupIndex: '',
        // 可搜索下拉框
        model13: '',
        loading1: false,
        options1: []
      }
    },
    created () {
      this.getstudentscore()
      this.getdropdownlist()
      this.getstudentallsouce()
    },
    mounted () {

    },
    methods: {
      ok () {
        var status = this.modal4[this.clickIndex].includes(true)
        status ? this.groupName[this.groupIndex].class = 'selected' : this.groupName[this.groupIndex].class = ''
        status ? this.groupName[this.groupIndex].isCheck = 1 : this.groupName[this.groupIndex].isCheck = 0

        if (this.groupSelect.length !== 3) {
          this.xy.msgError('选中不可多于/少于3科。')
        } else {
          var resultText = ''
          var resultValue = 0
          var max
          // 遍历数组，默认arr中的某一个元素为最大值，进行逐一比较
          for (var i = 0; i < this.groupSelect.length; i++) {
            // 外层循环一次，就拿this.groupSelect[i] 和 内层循环this.groupSelect.legend次的 this.groupSelect[j] 做对比
            for (var j = i; j < this.groupSelect.length; j++) {
              if (this.groupSelect[i] < this.groupSelect[j]) {
                // 如果this.groupSelect[j]大就把此时的值赋值给最大值变量max
                max = this.groupSelect[j]
                this.groupSelect[j] = this.groupSelect[i]
                this.groupSelect[i] = max
              }
            }
          }
          for (let i = 0; i < this.groupSelect.length; i++) {
            var subjectKey = ''
            switch (this.groupSelect[i]) {
              case 0: resultText += '物'; subjectKey = 'Physics'; break
              case 1: resultText += '化'; subjectKey = 'Chemistry'; break
              case 2: resultText += '生'; subjectKey = 'Biology'; break
              case 3: resultText += '历'; subjectKey = 'History'; break
              case 4: resultText += '地'; subjectKey = 'Geography'; break
              case 5: resultText += '政'; subjectKey = 'Politics'; break
            }
            for (var key in this.subjectscore) {
              if (key === subjectKey) {
                resultValue += ((this.subjectscore[key] === '' || this.subjectscore[key] === '缺考') ? Number(0) : Number(parseFloat(this.subjectscore[key]).toFixed(2)))
                break
              }
            }
          }

          if (this.checkBoxSumKeyArray.indexOf(resultText) !== -1) {
            this.xy.msgError('选中结果重复，请重新选择。')
          } else {
            if (this.groupSelect.indexOf(0) === -1 && this.groupSelect.indexOf(3) === -1) {
              this.xy.msgError('物理或者历史必须选中。')
            } else {
              if (this.checkBoxSumKeyArray[this.clickIndex] === 'undefined') {
              } else {
                this.checkBoxSumKeyArray[this.clickIndex] = resultText
                this.checkBoxSumValueArray[this.clickIndex] = parseFloat(resultValue).toFixed(2)
              }
              this.windowIsShow = false
              this.groupSelect = []
              this.echartstwo()
            }
          }
        }
      },
      cancel () {
        this.windowIsShow = false
        this.groupSelect = []
      },
      check (index) {
        if (this.groupSelect.length > 0) {
          this.modal4[this.clickIndex][index] = false
        }
        if (this.groupSelect.indexOf(index) === -1) {
          this.groupSelect.push(index)
          this.modal4[this.clickIndex].splice(index, 1, true)
        } else {
          this.groupSelect.splice(this.groupSelect.indexOf(index), 1)
          this.modal4[this.clickIndex].splice(index, 1, false)
        }
        if (this.groupSelect.indexOf(0) !== -1 && this.groupSelect.indexOf(3) !== -1) {
          this.groupSelect.splice(this.groupSelect.indexOf(index), 1)
          this.modal4[this.clickIndex][index] = false
          this.xy.msgError('物理和历史不能同时选中。')
        }
        if (this.groupSelect.length > 3) {
          this.groupSelect.splice(this.groupSelect.indexOf(index), 1)
          this.modal4[this.clickIndex][index] = false
          this.xy.msgError('选中不可多于3科。')
        }
      },
      async getstudentscore () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SS_ScoreAnalysis/GetStudentAnalysis`, {
          UserName: this.searchValue,
          ExamID: this.selectResult
        })
        if (res.success) {
          this.subjectscore = res.data
          for (var i in this.subjectscore) {
            if (this.souceArray.indexOf(i) !== -1 && this.subjectscore[i] !== null) {
              (this.subjectscore[i] === '' || this.subjectscore[i] === '缺考' ? this.newsouceArray.push(this.subjectscore[i]) : this.newsouceArray.push(parseFloat(this.subjectscore[i]).toFixed(2)))
            }
            if (this.powerArray.indexOf(i) !== -1 && this.subjectscore[i] !== null) {
              (this.subjectscore[i] === '' || this.subjectscore[i] === '缺考' ? this.newpowerArray.push(this.subjectscore[i]) : this.newpowerArray.push(parseFloat(this.subjectscore[i]).toFixed(2)))
            }
            if (this.souceArrayOneChart.indexOf(i) !== -1 && this.subjectscore[i] !== null) {
              (this.subjectscore[i] === '' || this.subjectscore[i] === '缺考' ? this.newsouceArrayOneChart.push(0) : this.newsouceArrayOneChart.push(parseFloat(this.subjectscore[i]).toFixed(2)))
            }
            if (this.powerArrayOneChart.indexOf(i) !== -1 && this.subjectscore[i] !== null) {
              (this.subjectscore[i] === '' || this.subjectscore[i] === '缺考' ? this.newpowerArrayOneChart.push(0) : this.newpowerArrayOneChart.push(parseFloat(this.subjectscore[i]).toFixed(2)))
            }
            if (i === 'IsShowSearch') {
              this.isShowSearch = this.subjectscore[i]
            }
          }
          this.echartsone()
        }
      },
      echartsone () {
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.echarts.init(document.getElementById('echartOne'))
        // 指定图表的配置项和数据
        var option = {
          tooltip: {},
          legend: {
            orient: 'vertical',
            data: ['总分', '学科能力分'],
            x: 'left',
            y: 'center'
          },
          color: ['#FF8C00', '#1E90FF'],
          radar: {
            name: {
              textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            indicator: [
              { name: '物理', max: 100 },
              { name: '化学', max: 100 },
              { name: '生物', max: 100 },
              { name: '政治', max: 100 },
              { name: '历史', max: 100 },
              { name: '地理', max: 100 }
            ]

          },
          series: [{
            name: '总分VS能力分',
            type: 'radar',
            data: [
              {
                value: this.newsouceArrayOneChart,
                name: '总分',
                // 在拐点处显示数值
                label: {
                  normal: {
                    show: true,
                    formatter: (params) => {
                      return params.value
                    }
                  }
                }
              },
              {
                value: this.newpowerArrayOneChart,
                name: '学科能力分',
                // 在拐点处显示数值
                label: {
                  normal: {
                    show: true,
                    formatter: (params) => {
                      return params.value
                    }
                  }
                }
              }
            ]
          }]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      },
      async getdropdownlist () {
        var _this = this
        let res = await _this.xy.get(`${_this.$store.state.apiPath}/api/SS_ScoreAnalysis/GetExamList`)
        if (res.success) {
          _this.dropdownlist = []
          $.each(res.data, (index, item) => {
            _this.dropdownlist.push({
              value: item.ArrangeSupervisorExamID,
              label: item.ArrangeSupervisorExamName
            })
          })
        }
      },
      async getdropdownlist2 () {
        var _this = this
        let res = await _this.xy.get(`${_this.$store.state.apiPath}/api/SS_ScoreAnalysis/GetAllEmportUser`)
        if (res.success) {
          _this.options1 = []
          $.each(res.data, (index, item) => {
            _this.options1.push({
              value: item.UserName,
              label: item.MixedName
            })
          })
        }
      },
      showGroup (index) {
        for (var i = 0; i < this.modal4[index].length; i++) {
          if (this.modal4[index][i]) {
            this.groupSelect.push(i)
          }
        }
        var arr = Array.from(new Set(this.groupSelect))
        this.groupSelect = arr
        this.groupIndex = index
        this.windowIsShow = true
        this.modal1[index] = true
        this.clickIndex = index
      },
      echartstwo () {
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.echarts.init(document.getElementById('echartTwo'))
        // 指定图表的配置项和数据
        var option = {
          // 鼠标触发提示数量
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            y: '5%',
            data: ['总分']
          },
          color: ['#00BFFF'],
          // x轴显示
          xAxis: {
            data: this.checkBoxSumKeyArray,
            splitLine: {
              show: false
            }
          },
          // y轴显示
          yAxis: {
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: '总分',
              type: 'bar',
              stack: '业务',
              data: this.checkBoxSumValueArray,
              barWidth: 38
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      },
      async getstudentallsouce () {
        var _this = this
        this.physicsScorePointArray = []
        this.chemistryScorePointArray = []
        this.biologyScorePointArray = []
        this.historyScorePointArray = []
        this.geographyScorePointArray = []
        this.politicsScorePointArray = []
        this.chineseScorePointArray = []
        this.mathScorePointArray = []
        this.englishScorePointArray = []

        this.physicsPowerPointArray = []
        this.chemistryPowerPointArray = []
        this.biologyPowerPointArray = []
        this.historyPowerPointArray = []
        this.geographyPowerPointArray = []
        this.politicsPowerPointArray = []
        this.chinesePowerPointArray = []
        this.mathPowerPointArray = []
        this.englishPowerPointArray = []
        this.allExamValueArray = []
        this.singleSorcePointArray = []
        this.singlePowerPointArray = []

        let res = await _this.xy.get(`${_this.$store.state.apiPath}/api/SS_ScoreAnalysis/GetStudentAllSouce`, {
          Keywords: _this.searchValue
        })
        if (res.success) {
          $.each(res.data, function (index, item) {
            (item.Physics === '' || item.Physics === '缺考') ? _this.physicsScorePointArray.push(0) : _this.physicsScorePointArray.push(parseFloat(item.Physics).toFixed(2));
            (item.Chemistry === '' || item.Chemistry === '缺考') ? _this.chemistryScorePointArray.push(0) : _this.chemistryScorePointArray.push(parseFloat(item.Chemistry).toFixed(2));
            (item.Biology === '' || item.Biology === '缺考') ? _this.biologyScorePointArray.push(0) : _this.biologyScorePointArray.push(parseFloat(item.Biology).toFixed(2));
            (item.History === '' || item.History === '缺考') ? _this.historyScorePointArray.push(0) : _this.historyScorePointArray.push(parseFloat(item.History).toFixed(2));
            (item.Geography === '' || item.Geography === '缺考') ? _this.geographyScorePointArray.push(0) : _this.geographyScorePointArray.push(parseFloat(item.Geography).toFixed(2));
            (item.Politics === '' || item.Politics === '缺考') ? _this.politicsScorePointArray.push(0) : _this.politicsScorePointArray.push(parseFloat(item.Politics).toFixed(2));
            (item.Chinese === '' || item.Chinese === '缺考') ? _this.chineseScorePointArray.push(0) : _this.chineseScorePointArray.push(parseFloat(item.Chinese).toFixed(2));
            (item.Math === '' || item.Math === '缺考') ? _this.mathScorePointArray.push(0) : _this.mathScorePointArray.push(parseFloat(item.Math).toFixed(2));
            (item.English === '' || item.English === '缺考') ? _this.englishScorePointArray.push(0) : _this.englishScorePointArray.push(parseFloat(item.English).toFixed(2));
            (item.PhysicsAbility === '' || item.PhysicsAbility === '缺考') ? _this.physicsPowerPointArray.push(0) : _this.physicsPowerPointArray.push(parseFloat(item.PhysicsAbility).toFixed(2));
            (item.ChemistryAbility === '' || item.ChemistryAbility === '缺考') ? _this.chemistryPowerPointArray.push(0) : _this.chemistryPowerPointArray.push(parseFloat(item.ChemistryAbility).toFixed(2));
            (item.BiologyAbility === '' || item.BiologyAbility === '缺考') ? _this.biologyPowerPointArray.push(0) : _this.biologyPowerPointArray.push(parseFloat(item.BiologyAbility).toFixed(2));
            (item.HistoryAbility === '' || item.HistoryAbility === '缺考') ? _this.historyPowerPointArray.push(0) : _this.historyPowerPointArray.push(parseFloat(item.HistoryAbility).toFixed(2));
            (item.GeographyAbility === '' || item.GeographyAbility === '缺考') ? _this.geographyPowerPointArray.push(0) : _this.geographyPowerPointArray.push(parseFloat(item.GeographyAbility).toFixed(2));
            (item.PoliticsAbility === '' || item.PoliticsAbility === '缺考') ? _this.politicsPowerPointArray.push(0) : _this.politicsPowerPointArray.push(parseFloat(item.PoliticsAbility).toFixed(2));
            (item.ChineseAbility === '' || item.ChineseAbility === '缺考') ? _this.chinesePowerPointArray.push(0) : _this.chinesePowerPointArray.push(parseFloat(item.ChineseAbility).toFixed(2));
            (item.MathAbility === '' || item.MathAbility === '缺考') ? _this.mathPowerPointArray.push(0) : _this.mathPowerPointArray.push(parseFloat(item.MathAbility).toFixed(2));
            (item.EnglishAbility === '' || item.EnglishAbility === '缺考') ? _this.englishPowerPointArray.push(0) : _this.englishPowerPointArray.push(parseFloat(item.EnglishAbility).toFixed(2))
            _this.allExamValueArray.push(item.ArrangeSupervisorExamName);
            // 页面进行展示数据
            (item.Physics === '' || item.Physics === '缺考') ? _this.physicsScorePointPageArray.push(item.Physics) : _this.physicsScorePointPageArray.push(parseFloat(item.Physics).toFixed(2));
            (item.Chemistry === '' || item.Chemistry === '缺考') ? _this.chemistryScorePointPageArray.push(item.Chemistry) : _this.chemistryScorePointPageArray.push(parseFloat(item.Chemistry).toFixed(2));
            (item.Biology === '' || item.Biology === '缺考') ? _this.biologyScorePointPageArray.push(item.Biology) : _this.biologyScorePointPageArray.push(parseFloat(item.Biology).toFixed(2));
            (item.History === '' || item.History === '缺考') ? _this.historyScorePointPageArray.push(item.History) : _this.historyScorePointPageArray.push(parseFloat(item.History).toFixed(2));
            (item.Geography === '' || item.Geography === '缺考') ? _this.geographyScorePointPageArray.push(item.Geography) : _this.geographyScorePointPageArray.push(parseFloat(item.Geography).toFixed(2));
            (item.Politics === '' || item.Politics === '缺考') ? _this.politicsScorePointPageArray.push(item.Politics) : _this.politicsScorePointPageArray.push(parseFloat(item.Politics).toFixed(2));
            (item.Chinese === '' || item.Chinese === '缺考') ? _this.chineseScorePointPageArray.push(item.Chinese) : _this.chineseScorePointPageArray.push(parseFloat(item.Chinese).toFixed(2));
            (item.Math === '' || item.Math === '缺考') ? _this.mathScorePointPageArray.push(item.Math) : _this.mathScorePointPageArray.push(parseFloat(item.Math).toFixed(2));
            (item.English === '' || item.English === '缺考') ? _this.englishScorePointPageArray.push(item.English) : _this.englishScorePointPageArray.push(parseFloat(item.English).toFixed(2));
            (item.PhysicsAbility === '' || item.PhysicsAbility === '缺考') ? _this.physicsPowerPointPageArray.push(item.PhysicsAbility) : _this.physicsPowerPointPageArray.push(parseFloat(item.PhysicsAbility).toFixed(2));
            (item.ChemistryAbility === '' || item.ChemistryAbility === '缺考') ? _this.chemistryPowerPointPageArray.push(item.ChemistryAbility) : _this.chemistryPowerPointPageArray.push(parseFloat(item.ChemistryAbility).toFixed(2));
            (item.BiologyAbility === '' || item.BiologyAbility === '缺考') ? _this.biologyPowerPointPageArray.push(item.BiologyAbility) : _this.biologyPowerPointPageArray.push(parseFloat(item.BiologyAbility).toFixed(2));
            (item.HistoryAbility === '' || item.HistoryAbility === '缺考') ? _this.historyPowerPointPageArray.push(item.HistoryAbility) : _this.historyPowerPointPageArray.push(parseFloat(item.HistoryAbility).toFixed(2));
            (item.GeographyAbility === '' || item.GeographyAbility === '缺考') ? _this.geographyPowerPointPageArray.push(item.GeographyAbility) : _this.geographyPowerPointPageArray.push(parseFloat(item.GeographyAbility).toFixed(2));
            (item.PoliticsAbility === '' || item.PoliticsAbility === '缺考') ? _this.politicsPowerPointPageArray.push(item.PoliticsAbility) : _this.politicsPowerPointPageArray.push(parseFloat(item.PoliticsAbility).toFixed(2));
            (item.ChineseAbility === '' || item.ChineseAbility === '缺考') ? _this.chinesePowerPointPageArray.push(item.ChineseAbility) : _this.chinesePowerPointPageArray.push(parseFloat(item.ChineseAbility).toFixed(2));
            (item.MathAbility === '' || item.MathAbility === '缺考') ? _this.mathPowerPointPageArray.push(item.MathAbility) : _this.mathPowerPointPageArray.push(parseFloat(item.MathAbility).toFixed(2));
            (item.EnglishAbility === '' || item.EnglishAbility === '缺考') ? _this.englishPowerPointPageArray.push(item.EnglishAbility) : _this.englishPowerPointPageArray.push(parseFloat(item.EnglishAbility).toFixed(2))
          })
          _this.echartsphysics()
          _this.echartschemistry()
          _this.echartsbiology()
          _this.echartspolitics()
          _this.echartshistory()
          _this.echartsgeography()
          _this.singleSorcePointArray = _this.chineseScorePointArray
          _this.singlePowerPointArray = _this.chinesePowerPointArray
          _this.singleSorcePointPageArray = _this.chineseScorePointPageArray
          _this.singlePowerPointPageArray = _this.chinesePowerPointPageArray
          _this.echartsingle()
        }
      },
      // 单科成绩Echarts
      echartsphysics () {
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.echarts.init(document.getElementById('echartPhysics'))
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '物理'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['总分', '能力分']
          },
          color: ['#FF8C00', '#1E90FF'],
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {

            }
          },
          // x轴显示
          xAxis: {
            data: this.allExamValueArray,
            splitLine: {
              show: false
            },
            axisLabel: {
              interval: 0,
              formatter: (value) => {
                var ret = ''// 拼接加\n返回的类目项
                var maxLength = 5// 每项显示文字个数
                var valLength = value.length// X轴类目项的文字个数
                var rowN = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
                if (rowN > 1) {
                  // 如果类目项的文字大于3,
                  for (var i = 0; i < rowN; i++) {
                    var temp = ''// 每次截取的字符串
                    var start = i * maxLength// 开始截取的位置
                    var end = start + maxLength// 结束截取的位置
                    // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                    temp = value.substring(start, end) + '\n'
                    ret += temp // 凭借最终的字符串
                  }
                  return ret
                } else {
                  return value
                }
              }
            }
          },
          // y轴显示
          yAxis: {
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: '总分',
              type: 'line',

              data: this.physicsScorePointArray,
              barWidth: 38
            },
            {
              name: '能力分',
              type: 'line',

              data: this.physicsPowerPointArray,
              barWidth: 38
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      },
      echartschemistry () {
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.echarts.init(document.getElementById('echartChemistry'))
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '化学'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['总分', '能力分']
          },
          color: ['#FF8C00', '#1E90FF'],
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {

            }
          },
          // x轴显示
          xAxis: {
            data: this.allExamValueArray,
            splitLine: {
              show: false
            },
            axisLabel: {
              interval: 0,
              formatter: (value) => {
                var ret = ''// 拼接加\n返回的类目项
                var maxLength = 5// 每项显示文字个数
                var valLength = value.length// X轴类目项的文字个数
                var rowN = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
                if (rowN > 1) {
                  // 如果类目项的文字大于3,
                  for (var i = 0; i < rowN; i++) {
                    var temp = ''// 每次截取的字符串
                    var start = i * maxLength// 开始截取的位置
                    var end = start + maxLength// 结束截取的位置
                    // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                    temp = value.substring(start, end) + '\n'
                    ret += temp // 凭借最终的字符串
                  }
                  return ret
                } else {
                  return value
                }
              }
            }
          },
          // y轴显示
          yAxis: {
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: '总分',
              type: 'line',

              data: this.chemistryScorePointArray,
              barWidth: 38
            },
            {
              name: '能力分',
              type: 'line',

              data: this.chemistryPowerPointArray,
              barWidth: 38
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      },
      echartsbiology () {
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.echarts.init(document.getElementById('echartBiology'))
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '生物'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['总分', '能力分']
          },
          color: ['#FF8C00', '#1E90FF'],
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {

            }
          },
          // x轴显示
          xAxis: {
            data: this.allExamValueArray,
            splitLine: {
              show: false
            },
            axisLabel: {
              interval: 0,
              formatter: (value) => {
                var ret = ''// 拼接加\n返回的类目项
                var maxLength = 5// 每项显示文字个数
                var valLength = value.length// X轴类目项的文字个数
                var rowN = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
                if (rowN > 1) {
                  // 如果类目项的文字大于3,
                  for (var i = 0; i < rowN; i++) {
                    var temp = ''// 每次截取的字符串
                    var start = i * maxLength// 开始截取的位置
                    var end = start + maxLength// 结束截取的位置
                    // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                    temp = value.substring(start, end) + '\n'
                    ret += temp // 凭借最终的字符串
                  }
                  return ret
                } else {
                  return value
                }
              }
            }
          },
          // y轴显示
          yAxis: {
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: '总分',
              type: 'line',

              data: this.biologyScorePointArray,
              barWidth: 38
            },
            {
              name: '能力分',
              type: 'line',

              data: this.biologyPowerPointArray,
              barWidth: 38
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      },
      echartspolitics () {
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.echarts.init(document.getElementById('echartPolitics'))
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '政治'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['总分', '能力分']
          },
          color: ['#FF8C00', '#1E90FF'],
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {

            }
          },
          // x轴显示
          xAxis: {
            data: this.allExamValueArray,
            splitLine: {
              show: false
            },
            axisLabel: {
              interval: 0,
              formatter: (value) => {
                var ret = ''// 拼接加\n返回的类目项
                var maxLength = 5// 每项显示文字个数
                var valLength = value.length// X轴类目项的文字个数
                var rowN = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
                if (rowN > 1) {
                  // 如果类目项的文字大于3,
                  for (var i = 0; i < rowN; i++) {
                    var temp = ''// 每次截取的字符串
                    var start = i * maxLength// 开始截取的位置
                    var end = start + maxLength// 结束截取的位置
                    // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                    temp = value.substring(start, end) + '\n'
                    ret += temp // 凭借最终的字符串
                  }
                  return ret
                } else {
                  return value
                }
              }
            }
          },
          // y轴显示
          yAxis: {
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: '总分',
              type: 'line',

              data: this.politicsScorePointArray,
              barWidth: 38
            },
            {
              name: '能力分',
              type: 'line',

              data: this.politicsPowerPointArray,
              barWidth: 38
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      },
      echartshistory () {
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.echarts.init(document.getElementById('echartHistory'))
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '历史'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['总分', '能力分']
          },
          color: ['#FF8C00', '#1E90FF'],
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {

            }
          },
          // x轴显示
          xAxis: {
            data: this.allExamValueArray,
            splitLine: {
              show: false
            },
            axisLabel: {
              interval: 0,
              formatter: (value) => {
                var ret = ''// 拼接加\n返回的类目项
                var maxLength = 5// 每项显示文字个数
                var valLength = value.length// X轴类目项的文字个数
                var rowN = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
                if (rowN > 1) { // 如果类目项的文字大于3,
                  for (var i = 0; i < rowN; i++) {
                    var temp = ''// 每次截取的字符串
                    var start = i * maxLength// 开始截取的位置
                    var end = start + maxLength// 结束截取的位置
                    // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                    temp = value.substring(start, end) + '\n'
                    ret += temp // 凭借最终的字符串
                  }
                  return ret
                } else {
                  return value
                }
              }
            }
          },
          // y轴显示
          yAxis: {
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: '总分',
              type: 'line',

              data: this.historyScorePointArray,
              barWidth: 38
            },
            {
              name: '能力分',
              type: 'line',

              data: this.historyPowerPointArray,
              barWidth: 38
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      },
      echartsgeography () {
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.echarts.init(document.getElementById('echartGeography'))
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '地理'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['总分', '能力分']
          },
          color: ['#FF8C00', '#1E90FF'],
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {

            }
          },
          // x轴显示
          xAxis: {
            data: this.allExamValueArray,
            splitLine: {
              show: false
            },
            axisLabel: {
              interval: 0,
              formatter: function (value) {
                var ret = ''// 拼接加\n返回的类目项
                var maxLength = 5// 每项显示文字个数
                var valLength = value.length// X轴类目项的文字个数
                var rowN = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
                if (rowN > 1) { // 如果类目项的文字大于3,
                  for (var i = 0; i < rowN; i++) {
                    var temp = ''// 每次截取的字符串
                    var start = i * maxLength// 开始截取的位置
                    var end = start + maxLength// 结束截取的位置
                    // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                    temp = value.substring(start, end) + '\n'
                    ret += temp // 凭借最终的字符串
                  }
                  return ret
                } else {
                  return value
                }
              }
            }
          },
          // y轴显示
          yAxis: {
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: '总分',
              type: 'line',

              data: this.geographyScorePointArray,
              barWidth: 38
            },
            {
              name: '能力分',
              type: 'line',

              data: this.geographyPowerPointArray,
              barWidth: 38
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      },
      echartsingle () {
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.echarts.init(document.getElementById('echartSingle'))
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['总分', '能力分']
          },
          color: ['#FF8C00', '#1E90FF'],
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {

            }
          },
          // x轴显示
          xAxis: {
            data: this.allExamValueArray,
            splitLine: {
              show: false
            },
            axisLabel: {
              interval: 0,
              formatter: function (value) {
                var ret = ''// 拼接加\n返回的类目项
                var maxLength = 5// 每项显示文字个数
                var valLength = value.length// X轴类目项的文字个数
                var rowN = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
                if (rowN > 1) { // 如果类目项的文字大于3,
                  for (var i = 0; i < rowN; i++) {
                    var temp = ''// 每次截取的字符串
                    var start = i * maxLength// 开始截取的位置
                    var end = start + maxLength// 结束截取的位置
                    // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                    temp = value.substring(start, end) + '\n'
                    ret += temp // 凭借最终的字符串
                  }
                  return ret
                } else {
                  return value
                }
              }
            }
          },
          // y轴显示
          yAxis: {
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: '总分',
              type: 'line',

              data: this.singleSorcePointArray,
              barWidth: 38
            },
            {
              name: '能力分',
              type: 'line',

              data: this.singlePowerPointArray,
              barWidth: 38
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      },
      tabClick (index) {
        this.modal3 = [false, false, false, false, false, false, false, false, false]
        this.modal3[index] = true
        switch (index) {
          case 0: this.singleSorcePointArray = this.chineseScorePointArray; this.singlePowerPointArray = this.chinesePowerPointArray
                  this.singleSorcePointPageArray = this.chineseScorePointPageArray; this.singlePowerPointPageArray = this.chinesePowerPointPageArray
                  break
          case 1: this.singleSorcePointArray = this.mathScorePointArray; this.singlePowerPointArray = this.mathPowerPointArray
                  this.singleSorcePointPageArray = this.mathScorePointPageArray; this.singlePowerPointPageArray = this.mathPowerPointPageArray
                  break
          case 2: this.singleSorcePointArray = this.englishScorePointArray; this.singlePowerPointArray = this.englishPowerPointArray
                  this.singleSorcePointPageArray = this.englishScorePointPageArray; this.singlePowerPointPageArray = this.englishPowerPointPageArray
                  break
          case 3: this.singleSorcePointArray = this.physicsScorePointArray; this.singlePowerPointArray = this.physicsPowerPointArray
                  this.singleSorcePointPageArray = this.physicsScorePointPageArray; this.singlePowerPointPageArray = this.physicsPowerPointPageArray
                  break
          case 4: this.singleSorcePointArray = this.chemistryScorePointArray; this.singlePowerPointArray = this.chemistryPowerPointArray
                  this.singleSorcePointPageArray = this.chemistryScorePointPageArray; this.singlePowerPointPageArray = this.chemistryPowerPointPageArray
                  break
          case 5: this.singleSorcePointArray = this.biologyScorePointArray; this.singlePowerPointArray = this.biologyPowerPointArray
                  this.singleSorcePointPageArray = this.biologyScorePointPageArray; this.singlePowerPointPageArray = this.biologyPowerPointPageArray
                  break
          case 6: this.singleSorcePointArray = this.politicsScorePointArray; this.singlePowerPointArray = this.politicsPowerPointArray
                  this.singleSorcePointPageArray = this.politicsScorePointPageArray; this.singlePowerPointPageArray = this.politicsPowerPointPageArray
                  break
          case 7: this.singleSorcePointArray = this.historyScorePointArray; this.singlePowerPointArray = this.historyPowerPointArray
                  this.singleSorcePointPageArray = this.historyScorePointPageArray; this.singlePowerPointPageArray = this.historyPowerPointPageArray
                  break
          case 8: this.singleSorcePointArray = this.geographyScorePointArray; this.singlePowerPointArray = this.geographyPowerPointArray
                  this.singleSorcePointPageArray = this.geographyScorePointPageArray; this.singlePowerPointPageArray = this.geographyPowerPointPageArray
                  break
        }
        this.echartsingle()
      },
      FromSubmit () {
        this.newsouceArray = []
        this.newpowerArray = []

        this.modal4 = [[false, false, false, false, false, false], [false, false, false, false, false, false], [false, false, false, false, false, false], [false, false, false, false, false, false], [false, false, false, false, false, false]]
        this.modal1 = [false, false, false, false, false]
        this.modal2 = [false, false, false, false, false, false]
        this.modal3 = [true, false, false, false, false, false, false, false, false]
        this.getstudentscore()
        this.getdropdownlist()
        this.getstudentallsouce()
        this.physicsScorePointArray = []
        this.chemistryScorePointArray = []
        this.biologyScorePointArray = []
        this.historyScorePointArray = []
        this.geographyScorePointArray = []
        this.politicsScorePointArray = []
        this.chineseScorePointArray = []
        this.mathScorePointArray = []
        this.englishScorePointArray = []

        this.physicsPowerPointArray = []
        this.chemistryPowerPointArray = []
        this.biologyPowerPointArray = []
        this.historyPowerPointArray = []
        this.geographyPowerPointArray = []
        this.politicsPowerPointArray = []
        this.chinesePowerPointArray = []
        this.mathPowerPointArray = []
        this.englishPowerPointArray = []
        this.allExamValueArray = []
        this.singleSorcePointArray = []
        this.singlePowerPointArray = []
        this.newsouceArrayOneChart = []
        this.newpowerArrayOneChart = []
        this.checkBoxSumKeyArray = []
        this.checkBoxSumValueArray = []
        this.physicsScorePointPageArray = []
        this.chemistryScorePointPageArray = []
        this.biologyScorePointPageArray = []
        this.historyScorePointPageArray = []
        this.geographyScorePointPageArray = []
        this.politicsScorePointPageArray = []
        this.chineseScorePointPageArray = []
        this.mathScorePointPageArray = []
        this.englishScorePointPageArray = []

        this.physicsPowerPointPageArray = []
        this.chemistryPowerPointPageArray = []
        this.biologyPowerPointPageArray = []
        this.historyPowerPointPageArray = []
        this.geographyPowerPointPageArray = []
        this.politicsPowerPointPageArray = []
        this.chinesePowerPointPageArray = []
        this.mathPowerPointPageArray = []
        this.englishPowerPointPageArray = []
        this.singleSorcePointPageArray = []
        this.singlePowerPointPageArray = []
        this.echartsone()
        this.echartstwo()
        this.groupName = [{ name: '选择组合方式1', class: '' }, { name: '选择组合方式2', class: '' },
                          { name: '选择组合方式3', class: '' }, { name: '选择组合方式4', class: '' },
                          { name: '选择组合方式5', class: '' }]
      },
      remoteMethod1 (query) {
        if (query !== '') {
          this.loading1 = true
          setTimeout(() => {
            this.loading1 = false
          }, 200)
        } else {
          this.options1 = []
        }
      },
      OnChangeQuery (query) {
        if (query.length > 0) {
          this.getdropdownlist2()
        } else {
          this.options1 = []
        }
      }

    }
  }
</script>
<style lang="less" scoped>
  @import "./css/xyPrj.css";
  .no-dt {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 55px);
    i {
      margin-right: 10px;
      font-size: 24px;
      color: #cecece;
    }
    p {
        color: rgba(0,0,0,0.25);
        font-size: 16px;
    }
  }
</style>
