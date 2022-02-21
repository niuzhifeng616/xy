
<template>
  <div style="height: 100%;">
      <div class="clearfix" style="height: 100%;">
          <div class="left-data fl">
              <Tree :data="crouseTree" show-checkbox check-directly multiple @on-check-change="crouseTreeCheck" :empty-text='treeEmptyText'></Tree>
          </div>
          <div class="right-data fl">
              <div style="margin:20px 0;">
                  <Button class="xy-danger" type="info"
                            @click="clearSetting"
                            :disabled="StepsHeader.isOperation != 0">清除全部设置</Button>
              </div>
              <div style="margin-bottom:10px;">
                  <RadioGroup v-model="isPlatoon" @on-change="radioChange">
                      <Radio label="0">
                          <span>不连排</span>
                      </Radio>
                      <Radio label="1">
                          <div style="display:inline-block">
                              <span>一周连排</span>
                              <Input v-model="platoonNum" @on-focus="isPlatoon = '1'" size="small" style="width:38px" />
                              <span>次</span>
                          </div>
                      </Radio>
                  </RadioGroup>
                  <Checkbox v-model="nextDay" v-if="platoonNum > 1 && isPlatoon == 1">隔天连排</Checkbox>
              </div>
              <div class="no-platoon-img text-center pr" v-if="isPlatoon != 1">
                  <p style="font-size:16px;font-weight:bold;color:#444;">不选择每周几次连排排在哪些课位。</p>
              </div>
              <table class="table" v-if="isPlatoon == 1">
                  <thead>
                      <tr>
                          <th width="16%" @click="allSelect">全选</th>
                          <th width="12%" v-for="week in weekData" :key="week" @click="weekDay(week)">{{week.name}}</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(schedule,i) in scheduleData" :key="i">
                          <td v-cloak @click="trClick(schedule)">{{schedule.sectionName}}</td>
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
      </div>
      <div class="text-right fix-footer">
          <Button class="xy-btn-primary" shape="circle" style="margin-right:0" @click="submit" :disabled="StepsHeader.isOperation != 0">保存</Button>
      </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        StepsHeader: {},
        classPlan: {},
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
        isPlatoon: '0',
        platoonNum: '',
        nextDay: false
      }
    },
    created () {
      this.StepsHeader = this.$parent.$parent
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
      for (let i = 0; i < 7; i++) {
        this.weekData.push({
          day: i,
          isSelect: false,
          name: this.xy.getChinesesWeekForNumSmall(i)
        })
      }
      this.getCrouseTree()
      this.getTableTimeAll()
    },
    mounted () {

    },
    methods: {
      // 清除全部设置
      clearSetting () {
        if (this.StepsHeader.isOperation === 0) {
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要全部清除课时连排设置吗？',
            onOk: () => {
              this.xy.loading()
              this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/ClearClassScheduleSetting`, {
                id: this.classPlan.classTableID
              }).then(res => {
                this.xy.unloading()
                if (res.success) {
                  this.xy.msgSuc('删除成功。')
                  this.isPlatoon = '0'
                  this.platoonNum = ''
                  this.getCrouseTree()
                  for (let i = 0; i < this.scheduleData.length; i++) {
                    this.scheduleData[i].weekList.map((item) => {
                      item.isActive = false
                    })
                  }
                  this.getTableTimeAll()
                }
              })
            }
          })
        }
      },
      // 连排选择
      radioChange () {
        if (this.isPlatoon === '0') {
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
      getTableTimeAll () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/ClassTableTime/GetClassTableTimeAll`, {
          classTableID: this.classPlan.classTableID
        }).then(res => {
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
        })
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
      getCrouseTree () { // 课程树
        this.treeEmptyText = '正在加载中...'
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetSettingCollectionClassSchedule`, {
          classTableID: this.classPlan.classTableID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.crouseTree = []
            let dataList = res.data
            for (let i = 0; i < dataList.length; i++) {
              this.crouseTree.push({
                id: dataList[i].Value,
                title: dataList[i].Name,
                checked: false,
                indeterminate: false,
                expand: false,
                children: []
              })
              for (let j = 0; j < dataList[i].Childrens.length; j++) {
                this.selectCrouseTree.forEach(item => {
                  if (item === dataList[i].Childrens[j].CoursePlanID) {
                    this.crouseTree[i].expand = true
                  }
                })
                this.crouseTree[i].children.push({
                  id: dataList[i].Childrens[j].CoursePlanID,
                  title: dataList[i].Childrens[j].CollectionName,
                  collectionID: dataList[i].Childrens[j].CollectionID,
                  isRule: dataList[i].Childrens[j].IsRule,
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
                          display: func.data.isRule ? 'inline-block' : 'none',
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
                              if (func.data.isRule) {
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
            };
            if (this.crouseTree.length === 0) {
              this.treeEmptyText = '课程树没有信息。'
            }
          }
          this.selectCrouseTree = []
        })
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
      getRuleTime (func, type) { // 点击笔
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetClassScheduleSetting`, {
          classTableID: this.classPlan.classTableID,
          aid: func.id
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            this.platoonNum = resData.ConstantWeekCount
            this.nextDay = resData.ConstantIsNextDay
            this.isPlatoon = '1'
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
            };
          }
        })
      },

      // 保存
      submit () {
        if (this.StepsHeader.isOperation === 0) {
          let postData = []
          if (this.selectCrouseTree.length === 0) {
            this.xy.msgError('请选择左侧班级后再保存。')
            return false
          };
          if (this.isPlatoon === '1') { // 连排
            let reg = /^20$|^1\d{0,1}$|^[1-9]$/ // 1-20正整数
            // console.log(reg.test(this.platoonNum))
            if (!reg.test(this.platoonNum)) {
              this.xy.msgError('连排次数限1到20的正整数。')
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
            if (time.length < 1) {
              this.xy.msgError('请选择连排区域。')
              return false
            }
            for (let j = 0; j < this.selectCrouseTree.length; j++) {
              let count = 0
              if (this.isPlatoon > 0) {
                count = Number(this.platoonNum)
              }
              postData.push({
                ClassTableID: this.classPlan.classTableID,
                CoursePlanID: this.selectCrouseTree[j],
                ConstantWeekCount: count,
                ConstantIsNextDay: this.nextDay,
                Times: time
              })
            };
          } else { // 不连排
            for (let i = 0; i < this.selectCrouseTree.length; i++) {
              postData.push({
                ClassTableID: this.classPlan.classTableID,
                CoursePlanID: this.selectCrouseTree[i],
                ConstantWeekCount: 0,
                ConstantIsNextDay: false,
                Times: ''
              })
            };
          }
          this.xy.loading()
          this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/EditClassScheduleSetting`, postData).then(res => {
            this.xy.unloading()
            if (res.success) {
              this.xy.msgSuc('保存成功。')
              this.platoonNum = ''
              this.isPlatoon = '0'
              this.nextDay = false
              for (let i = 0; i < this.scheduleData.length; i++) {
                this.scheduleData[i].weekList.map((item) => {
                  item.isActive = false
                })
              }
              this.getCrouseTree()
              this.getTableTimeAll()
            }
          })
        }
      }
    }

  }
</script>
<style lang='less' scoped>
@import '../../css/arrangingRules.less';
</style>
