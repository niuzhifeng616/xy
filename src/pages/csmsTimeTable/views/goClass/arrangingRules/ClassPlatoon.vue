<!-- 5.排课规则-连排课程-->
<template>
  <div class="ClassPlatoon-rule clearfix" style=" height: 100%;">
    <div class="left-data fl">
      <tree :data="crouseTree" :empty-text='treeEmptyText' show-checkbox check-directly multiple @on-check-change="crouseTreeCheck"></tree>
    </div>
    <div class="right-data fl" style="padding-left: 20px;">
      <div style="margin:20px 0">
        <Button class="xy-danger" @click="clearSetting" :disabled="isOperation !== 0">清除全部设置</Button>
      </div>
      <div style="margin-bottom: 10px;">
        <radio-group v-model="isPlatoon" @on-change="radioChange">
          <radio :label="0">
            <span>不连排</span>
          </radio>
          <radio :label="1">
            <div style="display:inline-block">
              <span>一周连排</span>
              <Input v-model="platoonNum" @on-focus="isPlatoon = 1" size="small" style="width:38px; margin:0 5px" />
              <span>次</span>
            </div>
          </radio>
        </radio-group>
        <checkbox v-model="nextDay" v-if="platoonNum > 1 && isPlatoon === 1">隔天连排</checkbox>
      </div>
      <div class="no-platoon-img text-center pr" v-if="isPlatoon !== 1">
        <p style="font-size:16px;font-weight:bold;color:#444;">不选择每周几次连排排在哪些课位。</p>
      </div>
      <table class="table" v-if="isPlatoon === 1">
        <thead>
          <tr>
            <th width="16%" @click="allSelect">全选</th>
            <th width="12%" v-for="week in weekData" @click="weekDay(week)" :key="week.name">{{week.name}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(schedule, i) in scheduleData" :key="i">
            <td @click="trClick(schedule)">{{schedule.sectionName}}</td>
            <template v-for="(week,n) in schedule.weekList">
                <td v-if="schedule.isRest == 0"
                    :key="n"
                    @click="week.isActive = !week.isActive"
                    :class="week.isActive?'bg-blue':''">
                    <Icon type="ios-checkmark-circle" color="#4196FF" size="24" v-if="week.isActive" />
                </td>
            </template>
            <td v-if="schedule.isRest == 1" colspan="7" style="background: #eee;"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="fix-footer text-right">
      <Button class="xy-btn-primary" shape="circle" style="margin-right:0" @click="submit" :disabled="isOperation !== 0">保存</Button>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ClassPlatoon',
    data () {
      return {
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation,
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        sectionList: ['1节', '2节', '3节', '4节',
                      '5节', '6节', '7节', '8节',
                      '9节', '10节', '11节', '12节'],
        zaoData: ['早1', '早2'],
        wanData: ['晚1', '晚2', '晚3', '晚4'],
        scheduleData: [],
        weekData: [],
        isAllSelect: false,
        // 课程树
        treeEmptyText: '正在加载中...',
        crouseTree: [],
        selectCrouseTree: [],
        // 是否连排
        isPlatoon: 0,
        platoonNum: '',
        nextDay: false
      }
    },

    created () {
      for (let i = 0; i < 7; i++) {
        this.weekData.push({
          day: i,
          isSelect: false,
          name: this.xy.getChinesesWeekForNumSmall(i)
        })
      }
    },
    mounted () {
      this.getCrouseTree()
      this.getTableTimeAll()
    },
    methods: {
      // 清除全部设置
      clearSetting () {
        if (this.isOperation === 0) {
          let taht = this
          taht.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要全部清除课时连排的设置吗？',
            async onOk () {
              taht.xy.loading()
              let params = {
                id: taht.classTableID
              }
              let res = await taht.xy.post(`${taht.$store.state.apiPath}/api/GeneralRuleSetting/ClearClassScheduleSetting`, params)
              taht.xy.unloading()
              if (res.success) {
                taht.xy.msgSuc('清除设置成功。')
                taht.isPlatoon = 0
                taht.platoonNum = ''
                taht.getCrouseTree()
                taht.getTableTimeAll()
              }
            }
          })
        }
      },
      // 连排选择
      radioChange () {
        if (this.isPlatoon === 0) {
          this.platoonNum = ''
        }
      },
      // 设置课位
      weekDay (val) {
        let day = val.day
        let isStatus = false
        for (let i = 0; i < this.scheduleData.length; i++) {
          for (let j = 0; j < this.scheduleData[i].weekList.length; j++) {
            if (this.scheduleData[i].weekList[j].Day === day) {
              if (this.scheduleData[i].weekList[j].AMorPM !== 'AB' &&
                this.scheduleData[i].weekList[j].AMorPM !== 'NS' &&
                this.scheduleData[i].weekList[j].AMorPM !== 'PB') {
                if (!(this.scheduleData[i].weekList[j].isActive)) {
                  isStatus = true
                }
              }
            }
          }
        };
        for (let m = 0; m < this.scheduleData.length; m++) {
          this.scheduleData[m].weekList.map((item) => {
            if (item.Day === day) {
              if (item.AMorPM !== 'AB' &&
                item.AMorPM !== 'NS' &&
                item.AMorPM !== 'PB') {
                item.isActive = isStatus
                return item
              }
            };
          })
        };
      },
      trClick (val) {
        if (val.isRest === 0) {
          let index = val.weekList.map((item) => { return item.isActive }).indexOf(false)
          if (index === -1) {
            val.weekList.map((item) => {
              item.isActive = false
              return item
            })
          } else {
            val.weekList.map((item) => {
              item.isActive = true
              return item
            })
          }
        }
      },
      allSelect (val) {
        this.isAllSelect = !this.isAllSelect
        for (let i = 0; i < this.scheduleData.length; i++) {
          this.scheduleData[i].weekList.map((item) => {
            if (item.AMorPM !== 'AB' &&
              item.AMorPM !== 'NS' &&
              item.AMorPM !== 'PB') {
              item.isActive = this.isAllSelect
              return item
            }
          })
        }
      },
      // 获取课位数据
      async getTableTimeAll () {
        this.xy.loading()
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableTime/GetClassTableTimeAll`, params)
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          this.scheduleData = []
          for (let i = 0; i < resData.length; i++) {
            resData[i].map((item) => {
              item.isActive = false
              return item
            })
            if (resData[i][0].AMorPM === 'MS') {
              this.scheduleData.push({
                sectionName: this.zaoData[resData[i][0].Order],
                weekList: resData[i],
                isSelect: false,
                isRest: 0
              })
              continue
            };
            if (resData[i][0].AMorPM === 'AB') {
              this.scheduleData.push({
                sectionName: '上午大课间',
                weekList: resData[i],
                isSelect: false,
                isRest: 1
              })
              continue
            };
            if (resData[i][0].AMorPM === 'NS') {
              this.scheduleData.push({
                sectionName: '午休',
                weekList: resData[i],
                isSelect: false,
                isRest: 1
              })
              continue
            };
            if (resData[i][0].AMorPM === 'PB') {
              this.scheduleData.push({
                sectionName: '下午大课间',
                weekList: resData[i],
                isSelect: false,
                isRest: 1
              })
              continue
            };
            if (resData[i][0].AMorPM === 'ES') {
              this.scheduleData.push({
                sectionName: this.wanData[resData[i][0].Order],
                weekList: resData[i],
                isSelect: false,
                isRest: 0
              })
              continue
            };
            this.scheduleData.push({
              sectionName: this.sectionList[resData[i][0].Order],
              weekList: resData[i],
              isSelect: false,
              isRest: 0
            })
          }
        }
      },

      // 左侧操作
      crouseTreeCheck (val) { // 课程树点击
        this.selectCrouseTree = []
        for (let i = 0; i < val.length; i++) {
          if (val[i].id > 0) {
            this.selectCrouseTree.push(val[i].id)
          }
        }
      },
      async getCrouseTree () { // 课程树
        this.treeEmptyText = '正在加载中...'
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassRuleSetting/GetSettingCollectionClassSchedule`, params)
        if (res.success) {
          this.crouseTree = []
          let dataList = res.data
          for (let i = 0; i < dataList.length; i++) {
            let isDisable = false
            if (dataList[i].children.length === 0) {
              isDisable = true
            }
            this.crouseTree.push({
              id: dataList[i].CoursePlanID,
              title: dataList[i].SubjectName,
              checked: false,
              indeterminate: false,
              expand: true,
              disableCheckbox: isDisable,
              disabled: isDisable,
              children: []
            })
            for (let j = 0; j < dataList[i].children.length; j++) {
              this.crouseTree[i].children.push({
                id: dataList[i].children[j].CoursePlanID,
                title: dataList[i].children[j].SubjectName,
                IsRult: dataList[i].children[j].IsRult,
                checked: false,
                indeterminate: false,
                children: [],
                render: (h, func) => {
                  return h('span', {
                    style: {
                      display: 'inline-block'
                    }
                  }, [
                    h('span', [
                      h('span', {
                        style: {
                          fontSize: '14px',
                          color: '#515a6e'
                        }
                      }, func.data.title)
                    ]),
                    h('span', {
                      style: {
                        display: func.data.IsRult ? 'inline-block' : 'none',
                        marginLeft: '6px'
                      }
                    }, [
                      h('Icon', {
                        props: {
                          type: 'md-create',
                          size: '16'
                        },
                        style: {
                          cursor: 'pointer'
                        },
                        on: {
                          click: () => {
                            if (func.data.IsRult) {
                              for (let i = 0; i < this.crouseTree.length; i++) {
                                for (let j = 0; j < this.crouseTree[i].children.length; j++) {
                                  this.crouseTree[i].children[j].checked = false
                                }
                              }
                              this.editTreeChildren(this.crouseTree)
                              // func.data.checked = true
                              this.selectCrouseTree = []
                              this.selectCrouseTree.push(func.data.id)
                              this.getRuleTime(func.data)
                            }
                          }
                        }
                      })
                    ])
                  ])
                }
              })
            };
          }
          if (this.crouseTree.length === 0) {
            this.treeEmptyText = '课程树没有信息。'
          }
        }
      },
      editTreeChildren (orglist) { // 递归修改状态
        if (orglist.length > 0) {
          for (let i = 0; i < orglist.length; i++) {
            orglist[i].checked = false
            orglist[i].indeterminate = false
            if (orglist[i].children.length > 0) {
              this.editTreeChildren(orglist[i].children)
            }
          }
        }
      },
      async getRuleTime (func, type) { // 点击笔
        this.xy.loading()
        let params = {
          classTableID: this.classTableID,
          aid: func.id
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassRuleSetting/GetClassScheduleSetting`, params)
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          this.platoonNum = resData.ConstantWeekCount
          this.nextDay = resData.ConstantIsNextDay
          this.isPlatoon = 1
          for (let i = 0; i < this.scheduleData.length; i++) {
            this.scheduleData[i].weekList.map((item) => {
              item.isActive = false
              return item
            })
            for (let j = 0; j < this.scheduleData[i].weekList.length; j++) {
              for (let k = 0; k < resData.Weeks.length; k++) {
                if (resData.Weeks[k].AMorPM === this.scheduleData[i].weekList[j].AMorPM &&
                  resData.Weeks[k].AMorPMOrder === this.scheduleData[i].weekList[j].AMorPMOrder &&
                  resData.Weeks[k].Day === this.scheduleData[i].weekList[j].Day) {
                  this.scheduleData[i].weekList[j].isActive = true
                }
              };
            };
          }
        }
      },

      // 保存
      async submit () {
        if (this.isOperation === 0) {
          let postData = []
          if (this.selectCrouseTree.length === 0) {
            this.xy.msgError('请选择连排课程。')
            return false
          };
          if (this.isPlatoon === 1) { // 连排
            let reg = /^[1-5]$/// 1-5正整数
            if (!reg.test(this.platoonNum)) {
              this.xy.msgError('连排次数限1到5的正整数。')
              return false
            };
            let time = []
            for (let i = 0; i < this.scheduleData.length; i++) {
              let arr = this.scheduleData[i].weekList.filter((item) => {
                return item.isActive === true
              })
              if (arr.length > 0) {
                for (let k = 0; k < arr.length; k++) {
                  time.push({
                    Day: arr[k].Day,
                    AMorPM: arr[k].AMorPM,
                    AMorPMOrder: arr[k].AMorPMOrder
                  })
                }
              }
            };
            if (time.length === 0) {
              this.xy.msgError('请选择连排区域。')
              return false
            };
            for (let j = 0; j < this.selectCrouseTree.length; j++) {
              let count = 0
              if (this.isPlatoon > 0) {
                count = this.platoonNum
              }
              postData.push({
                ClassTableID: this.classTableID,
                CoursePlanLevelID: this.selectCrouseTree[j],
                ConstantWeekCount: count,
                ConstantIsNextDay: this.nextDay,
                Times: time
              })
            };
          } else { // 不连排
            for (let i = 0; i < this.selectCrouseTree.length; i++) {
              postData.push({
                ClassTableID: this.classTableID,
                CoursePlanLevelID: this.selectCrouseTree[i],
                ConstantWeekCount: 0,
                ConstantIsNextDay: false,
                Times: ''
              })
            };
          }
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassRuleSetting/EditClassScheduleSetting`, postData)
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.selectCrouseTree = []
            this.platoonNum = ''
            this.isPlatoon = 0
            this.nextDay = false
            this.platoonNum = ''
            this.getCrouseTree()
            this.getTableTimeAll()
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/arrangingRules.less';
</style>
