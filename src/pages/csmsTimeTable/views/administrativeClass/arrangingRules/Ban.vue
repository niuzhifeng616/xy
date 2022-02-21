<!-- 5.排课规则-禁止排课 -->
<template>
  <div class="clearfix" style="height:100%">
    <div class="left-data fl">
        <RadioGroup v-model="radioData" @on-change="radioChange" style="margin-bottom:10px;">
            <Radio label="1">
                <span>按课程</span>
            </Radio>
            <Radio label="2">
                <span>按教师</span>
            </Radio>
        </RadioGroup >
        <div v-if="radioData == 1" style="min-height: 565px; max-height: 565px; overflow: auto;">
            <Tree :data="crouseTree" show-checkbox check-directly multiple @on-check-change="crouseTreeCheck" :empty-text='treeEmptyText'></Tree>
        </div>
        <div v-if="radioData == 2">
            <!--选择教师 -->
            <SelectTeacherOrg
              ref="selectTeacherOrg"
              :classTableID="classPlan.classTableID"
              :value="-1"
              @edit-rule="editRule"
              @select-teacher="selectTeacher">
            </SelectTeacherOrg>
        </div>
    </div>
    <div class="right-data ban-must fl">
      <div style="margin:20px 0;">
          <Button type="info" class="xy-danger" @click="clearSetting" :disabled="StepsHeader.isOperation != 0">清除全部设置</Button>
      </div>
      <table class="ban-must-table">
          <thead>
              <tr>
                  <th width="16%" @click="allSelect" style="min-width:80px">全选</th>
                  <th width="12%" v-for="(week,index) in weekData" :key="index" @click="weekDay(week)" style="min-width:100px">{{week.name}}</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="(schedule,i) in scheduleData" :key="i">
                  <td v-cloak @click="trClick(schedule)">{{schedule.sectionName}}</td>
                  <template v-for="(week,n) in schedule.weekList">
                      <td v-if="schedule.isRest == 0"
                          :key="n"
                          @click="week.isActive = !week.isActive">
                          <div class="ban-block" v-if="week.isActive">禁止排课</div>
                      </td>
                  </template>
                  <td v-if="schedule.isRest == 1" colspan="7" style="background: #F4F5F7;"></td>
              </tr>
          </tbody>
      </table>
      <div class="text-right fix-footer">
        <Button class="xy-btn-primary" shape="circle" style="margin-right:0" @click="submit" :disabled="StepsHeader.isOperation != 0">保存</Button>
      </div>
    </div>
  </div>
</template>

<script>
  import SelectTeacherOrg from './components/CheckboxSelectTeacher.vue'

  export default {
    components: {
      SelectTeacherOrg
    },
    name: 'Ban',
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
        // 按教师或课程
        treeEmptyText: '正在加载中...',
        radioData: '1',
        crouseTree: [],
        selectCrouseTree: [],
        selectedTeacherIds: [] // 子组件选中的教师id数组
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
      clearSetting: function () {
        if (this.StepsHeader.isOperation === 0) {
          this.xy.confirm('温馨提示', '您确定要全部清除禁止排课时间设置吗？', this.clearSettingOk)
        }
      },
      clearSettingOk () {
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/ClearRuleRecordTime`, {
          ClassTableID: this.classPlan.classTableID,
          Value: -1
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('删除成功。')
            if (this.radioData === '1') {
              this.selectCrouseTree = []
              this.getCrouseTree()
            } else {
              this.$refs.selectTeacherOrg.resetTeacherTree()
              this.selectedTeacherIds = []
            }
            this.getTableTimeAll()
          }
        })
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
      // 点击笔-按教师
      async editRule (teacherIds) {
        this.selectedTeacherIds = teacherIds
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetRuleTime`, {
          classTableID: this.classPlan.classTableID,
          aid: teacherIds[0],
          type: 'T',
          value: -1
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            for (let i = 0; i < this.scheduleData.length; i++) {
              this.scheduleData[i].weekList.map((item) => {
                item.isActive = false
                return item
              })
              for (let j = 0; j < this.scheduleData[i].weekList.length; j++) {
                for (let k = 0; k < resData.length; k++) {
                  if (resData[k].AMorPM === this.scheduleData[i].weekList[j].AMorPM &&
                    resData[k].AMorPMOrder === this.scheduleData[i].weekList[j].AMorPMOrder &&
                    resData[k].Day === this.scheduleData[i].weekList[j].Day) {
                    this.scheduleData[i].weekList[j].isActive = true
                  }
                };
              };
            };
          }
        })
      },
      // 获取选中的教师
      async selectTeacher (teacherIds) {
        this.selectedTeacherIds = teacherIds
      },
      // 保存
      submit () {
        if (this.StepsHeader.isOperation === 0) {
          let time = []
          let postData = []
          for (let i = 0; i < this.scheduleData.length; i++) {
            let arr = this.scheduleData[i].weekList.filter((item) => {
              return item.isActive === true
            })
            if (arr.length > 0) {
              for (let j = 0; j < arr.length; j++) {
                time.push({
                  Day: arr[j].Day,
                  AMorPM: arr[j].AMorPM,
                  AMorPMOrder: arr[j].AMorPMOrder
                })
              }
            }
          };

          if (this.radioData === '1') {
            if (this.selectCrouseTree.length === 0) {
              this.xy.msgError('请选择数据后再保存。')
              return false
            };
            for (let i = 0; i < this.selectCrouseTree.length; i++) {
              postData.push({
                ClassTableID: this.classPlan.classTableID,
                AID: this.selectCrouseTree[i],
                Type: 'C',
                Value: -1,
                Times: time
              })
            }
          } else {
            if (this.selectedTeacherIds.length === 0) {
              this.xy.msgError('请选择数据后再保存。')
              return false
            };
            for (let i = 0; i < this.selectedTeacherIds.length; i++) {
              postData.push({
                ClassTableID: this.classPlan.classTableID,
                AID: this.selectedTeacherIds[i],
                Type: 'T',
                Value: -1,
                Times: time
              })
            }
          }
          this.xy.loading()
          this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/EditRuleRecordTime`, postData).then(res => {
            this.xy.unloading()
            if (res.success) {
              this.xy.msgSuc('保存成功。')
              if (this.radioData === '1') {
                this.selectCrouseTree = []
                this.getCrouseTree()
              } else {
                this.$refs.selectTeacherOrg.resetTeacherTree()
                this.selectedTeacherIds = []
              }
              this.getTableTimeAll()
            }
          })
        }
      },

      // 左侧操作
      radioChange (val) { // 按课程
        for (let i = 0; i < this.scheduleData.length; i++) {
          this.scheduleData[i].weekList.map((item) => {
            item.isActive = false
            return item
          })
        };
        if (val === '1') {
          for (let i = 0; i < this.crouseTree.length; i++) {
            this.crouseTree[i].indeterminate = false
            for (let j = 0; j < this.crouseTree[i].children.length; j++) {
              this.crouseTree[i].children[j].checked = false
            }
          }
        }
      },
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
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetSettingCollection`, {
          classTableID: this.classPlan.classTableID,
          value: -1
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
                disabled: false,
                expand: true,
                children: []
              })
              for (let j = 0; j < dataList[i].Childrens.length; j++) {
                this.crouseTree[i].children.push({
                  id: dataList[i].Childrens[j].CoursePlanID,
                  title: dataList[i].Childrens[j].CollectionName,
                  collectionID: dataList[i].Childrens[j].CollectionID,
                  isRule: dataList[i].Childrens[j].IsRule,
                  checked: false,
                  indeterminate: false,
                  disabled: false,
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
                                this.getRuleTime(func.data, 'C')
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
      getRuleTime (func, type) { // 点击笔-按课程
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetRuleTime`, {
          classTableID: this.classPlan.classTableID,
          aid: func.id,
          type: type,
          value: -1
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            for (let i = 0; i < this.scheduleData.length; i++) {
              this.scheduleData[i].weekList.map((item) => {
                item.isActive = false
                return item
              })
              for (let j = 0; j < this.scheduleData[i].weekList.length; j++) {
                for (let k = 0; k < resData.length; k++) {
                  if (resData[k].AMorPM === this.scheduleData[i].weekList[j].AMorPM &&
                    resData[k].AMorPMOrder === this.scheduleData[i].weekList[j].AMorPMOrder &&
                    resData[k].Day === this.scheduleData[i].weekList[j].Day) {
                    this.scheduleData[i].weekList[j].isActive = true
                  }
                };
              };
            };
          }
        })
      }
    }

  }
</script>
<style lang='less' scoped>
@import '../../css/arrangingRules.less';
.left-data {
    width: 240px;
    height: 620px;
    padding: 20px 15px 0;
}
.right-data {
    width: calc(100% - 280px);
}
.ban-block{
  width:96px;
  height:30px;
  line-height: 30px;
  background:rgba(255,75,75,1);
  border:1px solid rgba(223,66,66,1);
  border-radius:6px;
  margin: auto;
  color: #fff;
}
</style>
