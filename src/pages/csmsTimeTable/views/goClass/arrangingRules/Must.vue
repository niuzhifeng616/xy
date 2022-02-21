<!-- 5.排课规则-必须排课-->
<template>
  <div class="ban-rule" style=" height: 100%;">
    <div class="left-data fl">
      <radio-group v-model="radioData" @on-change="radioChange">
        <radio :label="1">
          <span>按课程</span>
        </radio>
        <radio :label="2">
          <span>按教师</span>
        </radio>
      </radio-group>
      <div v-if="radioData === 1">
        <tree :data="crouseTree" :empty-text='treeEmptyText' show-checkbox check-directly multiple @on-check-change="crouseTreeCheck"></tree>
      </div>
      <div v-if="radioData === 2">
        <tree :data="teacherTree" :empty-text='treeEmptyText1' show-checkbox check-directly multiple @on-check-change="teacherTreeCheck"></tree>
      </div>
    </div>
    <div class="right-data ban-must fl">
      <div style="margin-bottom:20px">
        <Button class="xy-danger" @click="clearSetting" :disabled="isOperation !== 0">清除全部设置</Button>
      </div>
      <table class="ban-must-table">
        <thead>
          <tr>
            <th width="16%" @click="allSelect" class="all-pick"><span>全选</span></th>
            <th width="12%" v-for="week in weekData" @click="weekDay(week)" :key="week.name">{{week.name}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="schedule in scheduleData" :key="schedule.sectionName">
            <td @click="trClick(schedule)">{{schedule.sectionName}}</td>
              <template v-for="(week,n) in schedule.weekList">
                <td v-if="schedule.isRest == 0"
                    :key="n"
                    @click="week.isActive = !week.isActive">
                      <div class="must-block" v-if="week.isActive">必须排课</div>
                </td>
              </template>
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
    name: 'Must',
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
        // 按教师或课程
        treeEmptyText: '正在加载中...',
        treeEmptyText1: '正在加载中...',
        radioData: 1,
        crouseTree: [],
        teacherTree: [],
        selectCrouseTree: [],
        selectTeacherTree: []
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
      this.getTeacherTree()
      this.getTableTimeAll()
    },
    methods: {
      // 清除全部设置
      clearSetting () {
        if (this.isOperation === 0) {
          let that = this
          that.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要全部清除必须排课时间设置吗？',
            async onOk () {
              that.xy.loading()
              let params = {
                ClassTableID: that.classTableID,
                Value: 1
              }
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/GeneralRuleSetting/ClearRuleRecordTime`, params)
              that.xy.unloading()
              if (res.success) {
                that.xy.msgSuc('删除成功。')
                that.getCrouseTree()
                that.getTeacherTree()
                that.getTableTimeAll()
              }
            }
          })
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

      // 保存
      async submit () {
        if (this.isOperation === 0) {
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
          if (this.radioData === 1) {
            if (this.selectCrouseTree.length === 0) {
              this.xy.msgError('请选择数据后再保存。')
              return false
            };
            for (let i = 0; i < this.selectCrouseTree.length; i++) {
              postData.push({
                ClassTableID: this.classTableID,
                AID: this.selectCrouseTree[i],
                Type: 'C',
                Value: 1,
                Times: time
              })
            }
          } else {
            if (this.selectTeacherTree.length === 0) {
              this.xy.msgError('请选择数据后再保存。')
              return false
            };
            for (let i = 0; i < this.selectTeacherTree.length; i++) {
              postData.push({
                ClassTableID: this.classTableID,
                AID: this.selectTeacherTree[i],
                Type: 'T',
                Value: 1,
                Times: time
              })
            }
          };
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassRuleSetting/EditRuleRecordTime`, postData)
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.selectCrouseTree = []
            this.selectTeacherTree = []
            this.getCrouseTree()
            this.getTeacherTree()
            this.getTableTimeAll()
          }
        }
      },

      // 左侧操作
      radioChange (val) { // 按课程或者老师
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
        } else {
          this.editTreeChildren(this.teacherTree)
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
      teacherTreeCheck (val) { // 教师树点击
        this.selectTeacherTree = []
        for (let i = 0; i < val.length; i++) {
          if (val[i].id > 0) {
            this.selectTeacherTree.push(val[i].id)
          }
        }
      },
      async getCrouseTree () { // 课程树
        this.treeEmptyText = '正在加载中...'
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassRuleSetting/GetCoursePlanLeverTree`, params)
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
                mustCount: dataList[i].children[j].MustCount,
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
                        display: func.data.mustCount > 0 ? 'inline-block' : 'none',
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
                            if (func.data.mustCount > 0) {
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
      },
      async getTeacherTree () { // 教师树
        this.treeEmptyText = '正在加载中...'
        let params = {
          classTableID: this.classTableID,
          value: 1
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetTeacherTreeList`, params)
        if (res.success) {
          this.teacherTree = []
          let dataList = res.data
          for (let i = 0; i < dataList.length; i++) {
            this.teacherTree.push({
              id: dataList[i].Value,
              title: dataList[i].Name,
              expand: true,
              checked: false,
              indeterminate: false,
              children: this.getTeacherChildren(dataList[i].Childrens)
            })
          };
          if (this.teacherTree.length === 0) {
            this.treeEmptyText = '教师树没有信息。'
          }
        }
      },
      getTeacherChildren (orglist) { // 递归教师
        if (orglist.length > 0) {
          let result = []
          for (let i = 0; i < orglist.length; i++) {
            let render = (h, func) => {
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
                          this.editTreeChildren(this.teacherTree)
                          // func.data.checked = true
                          this.selectTeacherTree = []
                          this.selectTeacherTree.push(func.data.id)
                          this.getRuleTime(func.data, 'T')
                        }
                      }
                    }
                  })
                ])
              ])
            }
            if (orglist[i].Childrens.length > 0) {
              result.push({
                id: orglist[i].Value,
                title: orglist[i].Name,
                expand: true,
                isRule: orglist[i].IsRule,
                checked: false,
                indeterminate: false,
                children: this.getTeacherChildren(orglist[i].Childrens),
                render: render
              })
            } else {
              result.push({
                id: orglist[i].Value,
                title: orglist[i].Name,
                expand: true,
                isRule: orglist[i].IsRule,
                checked: false,
                indeterminate: false,
                children: [],
                render: render
              })
            }
          }
          return result
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
          aid: func.id,
          type: type,
          value: 1
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassRuleSetting/GetRuleTime`, params)
        this.xy.unloading()
        if (res.success) {
          func.checked = true
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
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/arrangingRules.less';
</style>
