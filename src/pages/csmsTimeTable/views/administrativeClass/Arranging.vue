<!-- 6.排课课位 -->
<template>
  <div class="xy-content-body pr">
    <div class="arraning-content">
            <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                <div>
                    <Button class="xy-info" type="info" @click="showAlready"
                              :disabled="StepsHeader.isOperation != 0">显示已用课位</Button>
                    <Button class="xy-info" type="info"
                              v-if="classTables != ''"
                              :disabled="StepsHeader.isOperation != 0"
                              @click="clear">清除显示</Button>
                </div>
            </div>

            <table class="arranging-table">
                <thead>
                    <tr>
                        <th width="170px"></th>
                        <th v-for="week in weekData" :key="week.name" @click="setTH(week)">
                          {{week.name}}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(schedule,i) in scheduleData" :key="i">
                        <td v-cloak @click="setTD(schedule)">
                          {{schedule.sectionName}}
                        </td>
                        <template v-for="(week,n) in schedule.weekList">
                            <td v-if="schedule.isRest == 0"
                                :key="n"
                                @click="setCrouse(i,n,week.IsSelected)"
                                :class="week.IsSelected?'bg-blue':''">
                                <div class="select-block" v-if="week.IsSelected">
                                </div>
                                 <span class="crile administrative" v-cloak v-if="week.Type != ''">{{week.Type}}</span>
                            </td>
                        </template>
                        <td v-if="schedule.isRest == 1" colspan="7" style="background:#F4F5F7; cursor:default;"></td>
                    </tr>
                </tbody>
            </table>
            <div style="margin-top:16px;text-align:center">
                <Button class="xy-primary" type="primary"
                          :disabled="StepsHeader.isOperation != 0"
                          @click="submitBtn" shape="circle">保存</Button>
            </div>
        </div>

        <!--显示已用课位-->
        <Modal v-model="modalAlreadyClass"
               :mask-closable="false"
               :closable="false"
               width="564"
               :transfer="false">
            <p slot="header">显示已用课位</p>
            <div style="font-size:14px;height:350px;overflow-y:auto" v-if="checkData.length >0">
                <CheckboxGroup  v-model="checkGroupAll">
                    <Checkbox :label="item.ClassTableID" style="display:block;margin:10px;"
                              v-for="item in checkData" :key="item.ClassTableName">
                        <span style="font-size:14px;" v-cloak>{{item.ClassTableName}}</span>
                    </Checkbox>
                </CheckboxGroup >
            </div>
            <div v-else class="modal-null">
              <img class="img" src="@/assets/common/nullData.svg" alt="图片" />
              <span class="text">未查询到相关数据。</span>
            </div>
            <div slot="footer">
                <Button class="xy-modal-close" @click="modalAlreadyClass = false">取消</Button>
                <Button class="xy-modal-primary" shape="circle" @click="submitAlreadyClass">确定</Button>
            </div>
        </Modal>
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
        postData: [],
        classTableName: '',
        classTables: '',
        weekData: [],
        // 显示已用课位
        modalAlreadyClass: false,
        checkGroupAll: [],
        checkData: []
      }
    },
    created () {
      this.StepsHeader = this.$parent
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
      for (var i = 0; i < 7; i++) {
        this.weekData.push({
          day: i,
          isSelect: false,
          name: this.xy.getChinesesWeekForNumSmall(i)
        })
      }
      this.getTp()
    },
    mounted: function () {

    },
    methods: {
      // 获取数据
      async getTp () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableTime/GetClassTableTimeAll`, {
          classTableID: this.classPlan.classTableID,
          classTables: this.classTables
        })
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          this.scheduleData = []
          for (var i = 0; i < resData.length; i++) {
            if (resData[i][0].AMorPM === 'MS') {
              this.scheduleData.push({
                sectionName: this.zaoData[resData[i][0].Order],
                weekList: resData[i],
                isRest: 0
              })
              continue
            };
            if (resData[i][0].AMorPM === 'AB') {
              this.scheduleData.push({
                sectionName: '上午大课间',
                weekList: resData[i],
                isRest: 1
              })

              continue
            };
            if (resData[i][0].AMorPM === 'NS') {
              this.scheduleData.push({
                sectionName: '午休',
                weekList: resData[i],
                isRest: 1
              })
              continue
            };
            if (resData[i][0].AMorPM === 'PB') {
              this.scheduleData.push({
                sectionName: '下午大课间',
                weekList: resData[i],
                isRest: 1
              })
              continue
            };
            if (resData[i][0].AMorPM === 'ES') {
              this.scheduleData.push({
                sectionName: this.wanData[resData[i][0].Order],
                weekList: resData[i],
                isRest: 0
              })
              continue
            };
            this.scheduleData.push({
              sectionName: this.sectionList[resData[i][0].Order],
              weekList: resData[i],
              isRest: 0
            })
          }
        }
      },

      // 设置课位
      setCrouse (index, tag, isSelected) {
        this.scheduleData[index].weekList[tag].IsSelected = !isSelected
      },
      setTD (val) { // 整行选中
        if (val.isRest === 0) {
          var index = val.weekList.map((item) => { return item.IsSelected }).indexOf(false)
          if (index === -1) {
            val.weekList.map((item) => { item.IsSelected = false })
          } else {
            val.weekList.map((item) => { item.IsSelected = true })
          }
        }
      },
      setTH (val) {
        var day = val.day
        var isStatus = false
        for (var i = 0; i < this.scheduleData.length; i++) {
          for (var j = 0; j < this.scheduleData[i].weekList.length; j++) {
            if (this.scheduleData[i].weekList[j].Day === day) {
              if (this.scheduleData[i].weekList[j].AMorPM !== 'AB' &&
                this.scheduleData[i].weekList[j].AMorPM !== 'NS' &&
                this.scheduleData[i].weekList[j].AMorPM !== 'PB') {
                if (!(this.scheduleData[i].weekList[j].IsSelected)) {
                  isStatus = true
                }
              }
            }
          }
        };
        for (var m = 0; m < this.scheduleData.length; m++) {
          this.scheduleData[m].weekList.map(function (item) {
            if (item.Day === day) {
              if (item.AMorPM !== 'AB' &&
                item.AMorPM !== 'NS' &&
                item.AMorPM !== 'PB') {
                item.IsSelected = isStatus
                return item
              }
            };
          })
        };
      },

      // 保存
      async submitBtn () {
        if (this.StepsHeader.isOperation === 0) {
          this.postData = []
          for (var i = 0; i < this.scheduleData.length; i++) {
            for (var j = 0; j < this.scheduleData[i].weekList.length; j++) {
              this.postData.push({
                ClassTableTimeID: this.scheduleData[i].weekList[j].ClassTableTimeID,
                ClassTableID: this.classPlan.classTableID,
                IsSelected: this.scheduleData[i].weekList[j].IsSelected,
                Day: this.scheduleData[i].weekList[j].Day,
                AMorPM: this.scheduleData[i].weekList[j].AMorPM,
                AMorPMOrder: this.scheduleData[i].weekList[j].AMorPMOrder
              })
            };
          };
          var index = this.postData.map((item) => { return item.IsSelected }).indexOf(true)
          if (index === -1) {
            this.xy.msgError('至少选中一个课位。')
          } else {
            this.xy.loading()
            let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTableTime/EditStatus`, this.postData)
            this.xy.unloading()
            if (res.success) {
              this.xy.msgSuc('保存成功。')
              this.StepsHeader.getGeneralFlows()// 成功后步骤可以点击
            }
          }
        }
      },

      // 显示已用课位
      async showAlready () {
        if (this.StepsHeader.isOperation === 0) {
          this.checkGroupAll = []
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableTime/GetSessionList`, {
            classTableID: this.classPlan.classTableID
          })
          this.xy.unloading()
          if (res.success) {
            this.checkData = res.data || []
            this.modalAlreadyClass = true
          }
        }
      },

      submitAlreadyClass () {
        this.classTables = this.checkGroupAll.join(',')
        this.modalAlreadyClass = false
        this.getTp()
      },

      clear: function () {
        if (this.StepsHeader.isOperation === 0) {
          this.classTables = ''
          this.checkGroupAll = []
          this.getTp()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.arranging-table{
  border-radius:8px;
  cursor: pointer;
  margin: 0 auto;
  border-collapse: collapse;
  font-size: 14px;
  width:100%;
  text-align: center;
  tr {
    width: 100%;
    height: 50px;
    text-align: center;
    th {
      height: 50px;
      width: 160px;
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      color:rgba(0,0,0,0.85);
      font-weight:bold;
      background:rgba(244,245,247,1);
       border-right:1px solid #D8D8D8;
       border-top:0;
    }
    th:last-child{
      border-right:0;
    }
     td:first-child{
       border:1px solid #D8D8D8;
      border-left: 0;
    }
    td:last-child{
       border:1px solid #D8D8D8;
      border-right: 0;
    }
    td {
      height: 50px;
      border: 1px solid #D8D8D8;
      text-align: center;
      font-weight: initial;
      padding:10px 0;
      width: 160px;
      color:rgba(0,0,0,0.85);
      background:rgba(244,245,247,1);
      position: relative;
    }
    .select-block{
      width:147px;
      height:30px;
      line-height: 30px;
      text-align: center;
      background:rgba(0,184,84,1);
      border-radius:6px;
      border:1px solid rgba(0,164,74,1);
      margin: auto;
      .block-icon{
        color: #fff;
        margin-right: 10px;
        font-size: 20px;
      }
    }
  }
}
.arraning-content{
  background: #fff;
  h1{
    margin:5px 0;
    font-size: 14px;
  }
}
.bg-blue{
  background:rgba(54, 115, 255,0.6);
}
.crile{
  width:24px;
  height:24px;
  line-height:24px;
  border-radius:12px;
  display:inline-block;
  color:#fff;
  margin:0 5px;
  top: 50%;
  position: absolute;
  margin-top: -12px;
  left: 50%;
  margin-left: -12px;
}
.ban{
  background:#ed4014;
}
.go{
  background:#2d8cf0;
}
.schoole{
  background:#5cadff;
}
.administrative{
  background:#2db7f5;
}
</style>
