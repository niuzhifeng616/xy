<template>
  <!-- 4.排课课位 -->
  <div class="xy-content-body">
    <div class="arraning-content">
        <table class="arranging-table">
            <thead>
                <tr>
                    <th width="170px"></th>
                    <th v-for="(week, index) in weekData"
                      :key="index"
                      @click="setTH(week)">{{week.name}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(schedule,i) in scheduleData" :key="i">
                    <td  @click="setTD(schedule)">{{schedule.sectionName}}</td>
                    <td v-show="schedule.isRest === 0"
                      v-for="(week,n) in schedule.weekList"
                      :key="n"
                      @click="setCrouse(i,n,week.IsSelected)"
                      :class="week.IsSelected?'bg-blue':''">
                      <span></span>
                    </td>
                    <td v-if="schedule.isRest === 1" colspan="7" style="background: #F5F4F7;"></td>
                </tr>
            </tbody>
        </table>
        <div style="margin-top:16px;text-align:center">
            <Button class="xy-btn-primary" shape="circle" @click="submitBtn" :disabled="isOperation !== 0">保存</Button>
        </div>
    </div>
</div>
</template>
<script>
  export default {
    name: 'TLArranging',
    data () {
      return {
        sectionList: ['第一节', '第二节', '第三节', '第四节',
                      '第五节', '第六节', '第七节', '第八节',
                      '第九节', '第十节', '第十一节', '第十二节'],
        zaoData: ['早自习一', '早自习二'],
        wanData: ['晚自习一', '晚自习二', '晚自习三', '晚自习四'],
        scheduleData: [],
        postData: [],
        weekData: [],

        isOperation: true,
        classTableID: 0
      }
    },
    created () {
      this.isOperation = this.$parent.isOperation
      this.classTableID = this.$parent.rowObj.ClassTableID

      for (var i = 0; i < 7; i++) {
        this.weekData.push({
          day: i,
          isSelect: false,
          name: this.xy.getChinesesWeekForNumSmall(i)
        })
      }
    },
    mounted () {
      this.getTp()
    },
    methods: {
      // 获取数据
      async getTp () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableTime/GetClassTableTimeAll`, {
          classTableID: this.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          var resData = res.data
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
          this.scheduleData[m].weekList.map((item) => {
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
        if (this.isOperation === 0) {
          this.postData = []
          for (var i = 0; i < this.scheduleData.length; i++) {
            for (var j = 0; j < this.scheduleData[i].weekList.length; j++) {
              this.postData.push({
                ClassTableTimeID: this.scheduleData[i].weekList[j].ClassTableTimeID,
                ClassTableID: this.classTableID,
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
              this.$parent.getGeneralFlows()
            }
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.arranging-table{
  border: 2px solid #EBF0F6;
  border-radius:8px;
  cursor: pointer;
  margin: 0 auto;
  border-collapse: collapse;
  font-size: 14px;
  width:100%;
  font-weight:bold;
  color:rgba(113,129,151,1);
  background: #F5F4F7;
}
.arranging-table tr {
  width: 100%;
  height: 50px;
  color: rgba(0,0,0,0.85);
}
.arranging-table tr th {
  white-space: nowrap;
  overflow: hidden;
  border: 1px solid #D8D8D8;
  text-align: center;
  font-weight: bold;
}
.arranging-table tr td {
  border: 1px solid #D8D8D8;
  text-align: center;
  font-weight: initial;
  padding:9px;
}
.arraning-content>h1{
  margin:5px 0;
  font-size: 14px;
}
.bg-blue{
   background:rgba(54, 115, 255, 0); //覆盖其他页面的冲突样式
}
.bg-blue > span{
  display: block;
  width:100%;
  height:30px;
  background:rgba(0,184,84,1);
  border-radius:6px;
  border:1px solid rgba(0,164,74,1);
}
.crile{
  width:24px;
  height:24px;
  line-height:24px;
  border-radius:12px;
  display:inline-block;
  color:#fff;
  margin:0 5px;
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
