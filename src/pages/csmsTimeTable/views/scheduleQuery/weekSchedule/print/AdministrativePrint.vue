<template>
<div class="print-body">
    <div class="fix-down" v-if="isShowDown" @click="downPDF">打印课表</div>
      <div v-for="item in datatable" :key="item.FullName"
            :style="{'height':isShwowTeacher&&isShwowHouse?'1140px':'558px','marginBottom':'40px'}">
          <table class="query-table">
              <thead>
                  <tr>
                      <th :colspan="isShowWeek?8:6">
                          <p class="teac-name">{{item.FullName}} 课程表</p>
                           <p class="query-time">课表生成时间：{{xy.moment(new Date()).format('YYYY-MM-DD HH:mm')}}</p>
                      </th>
                  </tr>
                  <tr>
                      <th rowspan="2"></th>
                      <th v-for="week in weekData" :key="week.title" v-show="(week.val!=5&&week.val!=6)||isShowWeek" v-cloak>{{week.title}}</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="sectionTd in festList"  :key="sectionTd.AMorPMOrderName">
                      <td v-if="sectionTd.AMorPM != 'NS'">
                          <div class="class-name" v-cloak>{{sectionTd.AMorPMOrderName}}</div>
                      </td>
                      <td :colspan="isShowWeek?8:6" v-if="sectionTd.AMorPM == 'NS'" style="font-weight:normal;vertical-align:middle">
                          {{sectionTd.AMorPMOrderName}}
                      </td>
                      <template v-for="week in weekData">
                          <td v-cloak :key="week.title"
                          v-if="sectionTd.AMorPM != 'NS'"
                          v-show="(week.val!=5&&week.val!=6)||isShowWeek">
                          <template v-for="crouse in item.SloverResultList">
                              <div v-cloak class="td-min"
                                :key="crouse.Day"
                                v-if="crouse.Day == week.val  && crouse.AMorPM == sectionTd.AMorPM && crouse.AMorPMOrder == sectionTd.AMorPMOrder">
                             <!-- 课程 -->
                                <p class="nowrap subject-name" v-if="crouse.SubjectName.length>6">{{crouse.SubjectName.substr(0,5)}}..</p>
                                <p class="nowrap subject-name" v-if="crouse.SubjectName.length<7">{{crouse.SubjectName}}</p>
                                <!-- 教师 -->
                                <div v-if="isShwowTeacher&&crouse.TeacherName!=null">
                                    <p class="nowrap other-name" v-if="crouse.TeacherName.length>10">{{crouse.TeacherName.substr(0,9)}}..</p>
                                    <p class="nowrap other-name" v-if="crouse.TeacherName.length<11">{{crouse.TeacherName}}</p>
                                </div>
                                <!-- 教学楼 -->
                                <div v-if="isShwowHouse&&crouse.HouseName!=null">
                                    <p class="nowrap other-name" v-if="crouse.HouseName.length>10">{{crouse.HouseName.substr(0,9)}}..</p>
                                    <p class="nowrap other-name" v-if="crouse.HouseName.length<11">{{crouse.HouseName}}</p>
                                </div>
                          </div>
                          </template>
                      </td>
                      </template>
                  </tr>
              </tbody>
          </table>
      </div>

</div>

</template>
<script>
  export default {
    data () {
      return {
        datatable: [],
        weekData: [],
        festList: [],
        isShowDown: true,
        isShowWeek: false, // 是否展示周六周日
        isShwowTeacher: false,
        isShwowHouse: false
      }
    },
    created () {
      var print = JSON.parse(localStorage.getItem('printParams'))
      this.datatable = print.datatable
      this.weekData = print.weekData
      this.festList = print.festList
      this.isShowWeek = print.isContainWeekend
      this.isShwowTeacher = print.isShwowTeacher
      this.isShwowHouse = print.isShwowHouse
    },
    mounted () {
    },
    methods: {
      downPDF () {
        var that = this
        this.isShowDown = false
        if (this.getExplorer() === 'IE') {
          this.pagesetup_null()
        }
        setTimeout(function () {
          window.print()
          that.isShowDown = true
        }, 500)
      },
      getExplorer () {
        var explorer = window.navigator.userAgent

        if (explorer.indexOf('MSIE') >= 0) { // ie
          return 'IE'
        } else if (explorer.indexOf('Firefox') >= 0) { // firefox
          return 'Firefox'
        } else if (explorer.indexOf('Chrome') >= 0) { // Chrome
          return 'Chrome'
        } else if (explorer.indexOf('Opera') >= 0) { // Opera
          return 'Opera'
        } else if (explorer.indexOf('Safari') >= 0) { // Safari
          return 'Safari'
        }
      }
    }
  }
</script>
<style >
 #Wrapper{
    overflow:visible !important;
 }
 #Wrapper .menu-left{
  display: none;
}
#Wrapper #XyHeader{
  display: none;
}
.wrap-right{
  overflow:visible !important;
  left: 0 !important;
}
.wrap-right .wrap{
  padding: 0 !important;
   overflow:visible !important;
}
.print-body{
  width:794px;
  margin:0 auto;
  background: #fff;
  overflow-y: auto;
  page-break-before: auto;
    page-break-after: always;
}
 .query-table {
    width: 100%;
    height:100%;
    border-spacing: 0;
    text-align: center;
    border: 1px solid #333;
    color: #333;
    font-weight: bold;
}
.query-table thead tr th {
    border: 1px solid #333;
    color: #333;
    width: 130px;
}
.query-table tbody {
    border: 1px solid #333;
}
.query-table td, .query-table th {
    border: 1px solid #333;
    width: 130px;
}
.teac-name {
    font-size: 18px;
    color: #333;

}
.query-time {
    font-size: 12px;
    color: #91A0B4;
    text-align: right;
    padding-right: 10px;
    font-weight: normal;
}
.subject-name{
    font-size:13px;
}
.other-name {
    font-size: 12px;
    color: #91A0B4;
    font-weight:normal;
}
.fix-down {
    position: fixed;
    top: 45%;
    right: 130px;
    width: 30px;
    z-index: 999;
    line-height: 24px;
    text-align: center;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    background: #2d8cf0;
    color: #fff;
}
</style>
