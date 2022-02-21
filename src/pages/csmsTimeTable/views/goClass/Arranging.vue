<template>
  <!-- 6.排课课位 -->
  <div class="xy-content-body">
      <div class="arraning-content">
          <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
              <!-- <Alert show-icon>点击课位区域设置本次排课排在哪些课位，被选中的课位用蓝色显示。</Alert> -->
              <div>
                  <Button class="xy-info" @click="showAlready"
                            :disabled="isOperation !== 0">显示已用课位</Button>
                  <Button  class="xy-danger"
                            v-if="classTables !== ''"
                            :disabled="isOperation !== 0"
                            @click="clear">清除显示</Button>
              </div>
          </div>
          <table class="arranging-table">
              <thead>
                  <tr>
                      <th width="170px"></th>
                      <th v-for="week in weekData"
                        @click="setTH(week)"
                        :key="week.name">{{week.name}}</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(schedule,i) in scheduleData" :key="schedule.sectionName">
                      <td @click="setTD(schedule)">{{schedule.sectionName}}</td>
                      <td v-if="schedule.isRest === 1" colspan="7" style="background: #F5F4F7;"></td>
                      <td v-else
                          v-for="(week,n) in schedule.weekList"
                          @click="setCrouse(i,n,week.IsSelected)"
                          :key="n"
                          :class="week.IsSelected?'bg-blue':''">
                          <span class="crile administrative" v-if="week.Type !== ''">{{week.Type}}</span>
                          <span v-else></span>
                      </td>
                  </tr>
              </tbody>
          </table>
          <div style="margin-top:16px;text-align:center">
              <Button class="xy-btn-primary" shape="circle" @click="submitBtn" :disabled="isOperation !== 0">保存</Button>
          </div>
      </div>
      <!--显示已用课位-->
      <modal v-model="modalAlreadyClass"
            :mask-closable="false"
            width="564"
            v-if="isOperation === 0"
            :transfer="false">
          <p slot="header">显示已用课位</p>
          <div style="font-size:14px;height:350px;overflow-y:auto" v-if="checkData.length >0">
              <checkbox-group v-model="checkGroupAll">
                  <checkbox :label="item.ClassTableID" style="display:block;margin:10px;"
                            v-for="item in checkData" :key="item.ClassTableName">
                      <span style="font-size:14px;">{{item.ClassTableName}}</span>
                  </checkbox>
              </checkbox-group>
          </div>
          <div v-else class="modal-null">
            <img class="img" src="@/assets/common/nullData.svg" alt="图片" />
            <span class="text">未查询到相关数据。</span>
          </div>
          <div slot="footer">
              <Button class="xy-modal-close" @click="modalAlreadyClass = false">取消</Button>
              <Button class="xy-modal-primary" shape="circle" @click="submitAlreadyClass">确定</Button>
          </div>
      </modal>
  </div>
</template>
<script>
  export default {
    name: 'Arranging',
    components: {
    },
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
        postData: [],
        classTables: '',
        weekData: [],
        // 显示已用课位
        modalAlreadyClass: false,
        checkGroupAll: [],
        checkData: []
      }
    },

    created () {
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
        let params = {
          classTableID: this.classTableID,
          classTables: this.classTables
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableTime/GetClassTableTimeAll`, params)
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
      },

      // 显示已用课位
      async showAlready () {
        if (this.isOperation === 0) {
          this.checkGroupAll = []
          this.xy.loading()
          let params = {
            classTableID: this.classTableID
          }
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableTime/GetSessionList`, params)
          this.xy.unloading()
          if (res.success) {
            this.checkData = res.data
            this.modalAlreadyClass = true
          }
        }
      },

      submitAlreadyClass () {
        this.classTables = this.checkGroupAll.join(',')
        this.modalAlreadyClass = false
        this.getTp()
      },

      clear () {
        if (this.isOperation === 0) {
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
  line-height:30px;
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
