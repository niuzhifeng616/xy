<template>
  <!-- 抢课式选课:选课结果(简单模式、分组模式公用) -->
  <div class="xy-content-module">
    <div class="xy-content-title ">
      <h1 class="cms-view-title">
        查看选课结果<a
          v-if="
            crouseList.OnLineSelectCourseRequirement != null &&
              crouseList.OnLineSelectCourseRequirement != ''
          "
          @click="modalHelp = true"
          >帮助说明</a
        >
      </h1>
    </div>

    <div class="xy-content-body">
      <table class="result-table" v-if="scheduleData.length > 0">
        <thead>
          <tr>
            <th width="100px"></th>
            <th v-for="(week, index) in weekData" :key="index">
              <span>{{ week.weekName }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(schedule, i) in scheduleData" :key="i">
            <td>{{ schedule.sectionName }}</td>
            <td
              v-show="schedule.isRest == 0"
              v-for="(week, n) in schedule.weekList"
              :key="n"
            >
              <div
                class="attend-cont-tit"
                v-for="(crouse, index) in crouseList"
                :key="index"
                :style="{
                  background: crouse.bg,
                  'border-color': crouse.color,
                  color: crouse.color
                }"
                v-show="
                  crouse.Day == n &&
                    crouse.AMorPM == week.AMorPM &&
                    crouse.AMorPMOrder == week.AMorPMOrder
                "
              >
                <p class="nowrap" :title="crouse.SubjectName">
                  {{ crouse.SubjectName }}
                </p>
              </div>
            </td>
            <td
              v-if="schedule.isRest == 1"
              colspan="7"
              style="background: #eee;"
            ></td>
          </tr>
        </tbody>
      </table>
      <!--暂无数据-->
      <div v-if="scheduleData.length == 0" class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
        <span class="no-data-text">您的选课数据尚未生成，请联系学校老师帮您处理。</span>
      </div>
      <div class="text-center mt-20" style="margin-top: 60px;">
        <Button class="xy-btn-primary" style="margin-right:0px" shape="circle" @click="close">关闭</Button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'OnlineChooseCourseLayeredResult',
    components: {},
    data () {
      return {
        modalHelp: false,
        modalntroduce: false,
        classTableID: '',
        crouseList: '',
        lntroduceContent: '',
        weekData: [],
        scheduleData: [],
        sectionList: ['第一节', '第二节', '第三节', '第四节',
                      '第五节', '第六节', '第七节', '第八节',
                      '第九节', '第十节', '第十一节', '第十二节'],
        zaoData: ['早自习一', '早自习二'],
        wanData: ['晚自习一', '晚自习二', '晚自习三', '晚自习四']
      }
    },
    created () {
      this.classTableID = this.$route.query.classTableID
      for (var i = 0; i < 7; i++) {
        this.weekData.push({
          weekName: this.xy.getChinesesWeekForNumSmall(i)
        })
      }
    },
    mounted () {
      this.getClassTableTimeAll()
    },
    methods: {
      async getClassTableTimeAll () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableTime/GetClassTableTimeAll`, { classTableID: this.classTableID })
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
          this.getTP()
        }
      },
      async getTP () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentOnLineSelectCourse/GetSchoolBasedGrabOnLineResultList`, { classTableID: this.classTableID })
        this.xy.unloading()
        if (res.success) {
          var resData = res.data.Results
          if (resData.length > 1) {
            var array = []
            for (var i = 0; i < resData.length; i++) {
              var index = array.indexOf(resData[i].SubjectName)
              if (index > -1) {
                resData[i].color = this.xy.colors(index).color
                resData[i].bg = this.xy.colors(index).bg
              } else {
                resData[i].color = this.xy.colors(array.length).color
                resData[i].bg = this.xy.colors(array.length).bg
                array.push(resData[i].SubjectName)
              }
            }
          } else if (resData.length === 1) {
            resData[0].color = this.xy.colors(0).color
            resData[0].bg = this.xy.colors(0).bg
          }
          this.crouseList = resData
        }
      },
      // 关闭
      close: function () {
        this.$router.back()
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../css/takeLessons.css';

.cms-view-title{
  font-size:16px;
  font-weight:bold;
  /*margin:10px 0;*/
  margin-bottom: 10px;
}
.cms-view-title a{
  color: #2d8cf0;
  font-size:12px;
  font-weight:normal;
  padding-left:5px;
}
/*table*/
.result-table{
  border: 1px solid #ddd;

  cursor: pointer;
  margin: 0 auto;
  border-collapse: collapse;
  font-size: 14px;
    width:100%;
}
.result-table tr {
  width: 100%;
  height: 40px;
    border: 1px solid #ddd;
}
.result-table tr th {
  height: 40px;
    white-space: nowrap;
    overflow: hidden;
    background-color: #f8f8f9;
    text-align: center;
    border: 1px solid #ddd;
}
.result-table tr td {
  height: 40px;
  border: 1px solid #ddd;
  text-align: center;
  font-weight: initial;
  padding:10px 0;
}
</style>
