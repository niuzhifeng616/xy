<!-- 8.手动调整-课表分析 -->
<template>
  <div>
    <div class="xy-content-body" style="margin:0 auto;background: #fff;">
        <div class="class-table-analysis">
            <div class="class-table-analysis-title clearfix">
                <div class="fl" v-cloak>{{showScheduleName}}</div>
                <Button class="xy-info fr" type="info" @click="loadPage">查看课表</Button>
            </div>
            <ol class="class-table-analysis-ol">
                <li class="pr">
                    <div style="flex:1">
                        <div class="block-name"> 教案</div>
                        <div class="all-name" style=" display: inline-block;">教案齐头</div>
                    </div>
                    <div class="clearfix" style="flex:2">
                        <div class="ctac-progress fl">
                            <Progress :percent="classTableData.TimesPlanLinePercentage" :stroke-width="14" stroke-color="#1890FF" hide-info />
                        </div>
                        <div class="fl percentage">{{classTableData.TimesPlanLinePercentage}}%</div>
                    </div>
                    <div class="analysis-icon" style="flex:1"
                         :class="classTableData.TimesPlanLinePercentage ==100?'analysis-icon-disable':''"
                         @click="detail(0,'教案齐头',classTableData.TimesPlanLineList)">
                         查看详情
                    </div>
                </li>
                <li class="pr">
                    <div style="flex:1">
                        <div class="block-name1"> 课时</div>
                        <div class="all-name" style=" display: inline-block;">课时分散</div>
                    </div>
                    <div class="clearfix" style="flex:2">
                        <div class="ctac-progress fl">
                            <Progress  :percent="classTableData.DispersedPercentage" :stroke-width="14" stroke-color="#52C41A" hide-info />
                        </div>
                        <div class="fl percentage" >{{classTableData.DispersedPercentage}}%</div>
                    </div>
                    <div class="analysis-icon" style="flex:1"
                         :class="classTableData.DispersedPercentage ==100?'analysis-icon-disable':''"
                         @click="detail(1,'课时分散',classTableData.DispersedList)">
                       查看详情
                    </div>
                </li>
                <li class="pr">
                    <div style="flex:1">
                        <div class="block-name"> 禁止</div>
                        <div class="all-name" style=" display: inline-block;">禁止排课</div>
                    </div>
                    <div class="clearfix" style="flex:2">
                        <div class="ctac-progress">
                            <Progress  :percent="classTableData.ProhibitPercentage" :stroke-width="14" stroke-color="#1890FF" hide-info />
                        </div>
                        <div class="fl percentage" >{{classTableData.ProhibitPercentage}}%</div>
                    </div>
                    <div class="analysis-icon" style="flex:1"
                         :class="classTableData.ProhibitPercentage ==100?'analysis-icon-disable':''"
                         @click="detail(2,'禁止排课时间',classTableData.ProhibitList)">
                        查看详情
                    </div>
                </li>
                <li class="pr">
                    <div style="flex:1">
                        <div class="block-name1"> 必须</div>
                        <div class="all-name" style=" display: inline-block;">必须排课</div>
                    </div>
                    <div class="clearfix" style="flex:2">
                        <div class="ctac-progress">
                            <Progress  :percent="classTableData.MustPercentage" :stroke-width="14" stroke-color="#52C41A" hide-info />
                        </div>
                        <div class="fl percentage" >{{classTableData.MustPercentage}}%</div>
                    </div>
                    <div class="analysis-icon" style="flex:1"
                         :class="classTableData.MustPercentage ==100?'analysis-icon-disable':''"
                         @click="detail(3,'必须排课时间',classTableData.MustList)">
                       查看详情
                    </div>
                </li>
                <li class="pr">
                    <div style="flex:1">
                        <div class="block-name"> 课时</div>
                        <div class="all-name" style=" display: inline-block;">课时连排</div>
                    </div>
                    <div class="clearfix" style="flex:2">
                        <div class="ctac-progress">
                            <Progress  :percent="classTableData.UnionPercentage" :stroke-width="14" stroke-color="#1890FF" hide-info />
                        </div>
                        <div class="fl percentage" >{{classTableData.UnionPercentage}}%</div>
                    </div>
                    <div class="analysis-icon" style="flex:1"
                         :class="classTableData.UnionPercentage ==100?'analysis-icon-disable':''"
                         @click="detail(4,'课时连排',classTableData.UnionList)">
                        查看详情
                    </div>
                </li>
                <li class="pr">
                     <div style="flex:1">
                        <div class="block-name1"> 合班</div>
                        <div class="all-name" style=" display: inline-block;">合班上课</div>
                    </div>
                    <div class="clearfix" style="flex:2">
                        <div class="ctac-progress">
                            <Progress  :percent="classTableData.TimesUnionPercentage" :stroke-width="14" stroke-color="#52C41A" hide-info />
                        </div>
                        <div class="fl percentage" >{{classTableData.TimesUnionPercentage}}%</div>
                    </div>
                    <div class="analysis-icon" style="flex:1"
                         :class="classTableData.TimesUnionPercentage ==100?'analysis-icon-disable':''"
                         @click="detail(5,'合班上课',classTableData.TimesUnionList)">
                       查看详情
                    </div>
                </li>
                <li class="pr">
                    <div style="flex:1">
                        <div class="block-name"> 同时</div>
                        <div class="all-name" style=" display: inline-block;">同时开课</div>
                    </div>
                    <div class="clearfix" style="flex:2">
                        <div class="ctac-progress">
                            <Progress  :percent="classTableData.TimesUplimitPercentage" :stroke-width="14" stroke-color="#1890FF" hide-info />
                        </div>
                        <div class="fl percentage" >{{classTableData.TimesUplimitPercentage}}%</div>
                    </div>
                    <div class="analysis-icon" style="flex:1"
                         :class="classTableData.TimesUplimitPercentage ==100?'analysis-icon-disable':''"
                         @click="detail(6,'同时开课限制',classTableData.TimesUplimitList)">
                       查看详情
                    </div>
                </li>
            </ol>
        </div>
    </div>
    <Modal :styles="{top:'20px',width:nowWidth+'px'}"
           v-model="detailModal"
           :title="detailName"
           :loading="loading"
           :transfer="false">
        <!-- 教案齐头 -->
        <div v-if="types==0">
            <i-table height="500" :columns="headColumns" :data="headTableData"></i-table>
        </div>
        <!-- 课时分散 -->
        <div v-if="types==1">
            <i-table height="500" :columns="timeColumns" :data="timeTableData"></i-table>
        </div>
        <!-- 禁止排课 -->
        <div v-if="types==2" class="modal-max">
            <div>列出已排上课的禁止排课时间</div>
            <ol>
                <li v-for="(item,index) in dataList" :key="index">{{item.ClassName}}：{{item.Times}}</li>
            </ol>
        </div>
        <!-- 必须排课 -->
        <div v-if="types==3" class="modal-max">
            <div>列出未排上课的必须排课时间</div>
            <ol>
                <li v-for="(item,index)  in dataList" :key="index">{{item.ClassName}}：{{item.Times}}</li>
            </ol>
        </div>
        <!-- 课时连排 -->
        <div v-if="types==4" class="modal-max">
            <div>列出未达到所设连排次数的课</div>
            <ol>
                <li v-for="(item,index)  in dataList" :key="index">{{item.ClassName}}</li>
            </ol>
        </div>
        <!-- 合班上课 -->
        <div v-if="types==5" class="modal-max">
            <div>列出未排在同一课位的合班课</div>
            <ol>
                <li v-for="(item,index)  in dataList" :key="index">{{item.UnionClass}}</li>
            </ol>
        </div>
        <!-- 同时开课 -->
        <div v-if="types==6" class="modal-max">
            <ol>
                <li v-for="(item,index)  in dataList" :key="index">{{item.SubjectName}}同时开课超过了{{item.EachLessonClassUpLimit}}个班：{{item.Time}}</li>
            </ol>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" type="text" @click="cancel">关闭</Button>
        </div>
    </modal>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        StepsHeader: {},
        classPlan: {},
        nowWidth: 800,
        detailModal: false,
        types: 0,
        detailName: '教案齐头',
        dataList: [],
        classTableData: {
          TimesPlanLinePercentage: 0, // 教案齐头百分比
          DispersedPercentage: 0, // 课时分散百分比
          ProhibitPercentage: 0, // 禁止排课百分比
          MustPercentage: 0, // 必须排课百分比
          UnionPercentage: 0, // 课时连排百分比
          TimesUnionPercentage: 0, // 合班百分比
          TimesUplimitPercentage: 0, // 同时开课百分比

          TimesPlanLineList: [], // 教案齐头
          DispersedList: [], // 课时分散
          ProhibitList: [], // 禁止排课
          MustList: [], // 必须排课
          UnionList: [], // 课时连排
          TimesUnionList: [], // 合班上课
          TimesUplimitList: [] // 同时开课
        },
        loading: true,
        sloverResultCollectionID: 0,
        showScheduleName: '',
        // 教案齐头table
        headColumns: [
          {
            title: '教师',
            key: 'TeacherNames'
          },
          {
            title: '不齐头课程',
            key: 'CoursePlanTableName'
          }
        ],
        headTableData: [],
        // 课时分散table
        timeColumns: [
          {
            title: '课程',
            key: 'ClassName'
          },
          {
            title: '哪天有多节课（连排课除外）',
            key: 'Days'
          }
        ],
        timeTableData: []
      }
    },
    created () {
      this.StepsHeader = this.$parent
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
      this.sloverResultCollectionID = this.$route.query.IDPre
      this.showScheduleName = this.$route.query.NamePre
      this.getClassTableData()
    },
    mounted: function () {
    },
    methods: {
      // 查看课表
      loadPage () {
        this.$store.commit('common/getParam', {
          IDPre: this.sloverResultCollectionID,
          NamePre: this.showScheduleName
        })
        this.$router.push({
          path: '/xyhome/administrativeStepHeader/administrativeSchedule',
          query: this.$store.state.common.menuInfo
        })
      },
      // 课表分析
      getClassTableData () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/AnalysisClassTableTime/GetTimetableAnalysis`, {
          classTableID: this.classPlan.classTableID,
          sloverResultCollectionID: this.sloverResultCollectionID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.classTableData = res.data.resultInfo
          }
        })
      },
      detail (type, names, data) {
        this.detailName = names
        this.types = type
        if (type === 0) { // 教案齐头
          this.nowWidth = 800
          this.headTableData = data
        };
        if (type === 1) { // 课时分散
          this.nowWidth = 800
          this.timeTableData = data
        };
        if (type === 2) { // 禁止排课
          this.nowWidth = 500
          this.dataList = data
        };
        if (type === 3) { // 必须排课
          this.nowWidth = 500
          this.dataList = data
        };
        if (type === 4) { // 课时连排
          this.nowWidth = 500
          this.dataList = data
        };
        if (type === 5) { // 合班上课
          this.nowWidth = 500
          this.dataList = data
        };
        if (type === 6) { // 同时上课
          this.nowWidth = 500
          this.dataList = data
        };
        this.detailModal = true
      },
      cancel () {
        this.detailModal = false
        this.headTableData = []
        this.timeTableData = []
        this.dataList = []
      }
    }
  }
</script>
<style lang="less" scoped>
.block-name{
    width:48px;
    height:48px;
    line-height: 48px;
    background:rgba(89,126,247,1);
    border-radius:4px;
    display: inline-block;
    text-align: center;
    color: #fff;
}
.block-name1{
    width:48px;
    height:48px;
    line-height: 48px;
    background:#36CFC9;
    border-radius:4px;
    display: inline-block;
    text-align: center;
    color: #fff;
}
.all-name{
    font-weight:bold;
    color:rgba(0,0,0,1);
    opacity:0.65;
    margin-left: 23px;
}
.schedule-content{
    display:flex;
    justify-content:space-around;
}
.left-schedule {
    /*width: calc(100% - 500px);*/
    background: #fff;
    padding: 13px 0 100px;
    border: 1px solid #E5E5E5;
    border-radius: 6px;
    flex:1;
}
.left-schedule .teacher-list .teac-name{
    cursor: pointer;
    font-size:12px;
}
.left-schedule .teacher-list:hover .teac-name {
    color: #499AFF;
}
.select-move-crouse .teacher-list:hover .teac-name {
    color: #fff;
}
.right-content {
    width: 600px;
    margin-left: 12px;
    border: 1px solid rgba(229,229,229,1);
    border-radius: 6px;
    overflow:auto;
}
.teacher-schedule {
    width:100%;
    /*border: 1px solid rgba(229,229,229,1);*/
    border-radius: 6px 6px 0px 0px;
    background:#fff;
}
.teacher-type {
    padding-left: 28px;
    height: 38px;
    line-height: 38px;
    border-bottom: 1px solid #ddd;
}

.teacher-type span {
    margin-right: 30px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(65,150,255,1);
    padding-bottom: 8px;
    cursor: pointer;
}

.teacher-type-active {
    border-bottom: 2px solid #4196FF;
}
.teacher-select {
    height: 33px;
    /*border-top: 1px solid #E5E5E5;*/
    display:flex;
    align-items:center;
    padding-left:16px;
    position:relative;
}
.teacher-select p {
    color: #333333;
    width:90%;
}
.right-title {
    height: 42px;
    line-height: 42px;
    color: #333;
    font-size: 14px;
    font-weight: 400;
    padding-left: 16px;
}
.right-teacher-ul {
    width: 100%;
    position: absolute;
    top: 28px;
    left: 0;
    max-height: 200px;
    overflow: auto;
    margin: 5px 0;
    padding: 5px 0;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
    z-index: 900;
}

.right-teacher-ul li {
    margin: 0;
    line-height: normal;
    padding: 7px 16px;
    clear: both;
    color: #515a6e;
    font-size: 12px !important;
    white-space: nowrap;
    list-style: none;
    cursor: pointer;
    transition: background .2s ease-in-out;
}

.right-teacher-ul li:hover {
    background: #f3f3f3;
}
.teacher-table {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #E5E5E5;
}
.teacher-table th {
    background: #E5E5E5;
    height: 28px;
    color: #999999
}
.teacher-table tbody tr td {
    height: 34px;
    max-width: 100px;
    min-width: 50px;
    border:1px solid #ddd;
}
.teacher-table tbody tr td:first-child {
    background: #E5E5E5;
    max-width: 30px;
    min-width: 30px;
    border:none;
}
.teacher-table .crouse-class {
    text-align: left;
    max-width: 100px;
    min-width: 50px;
    padding: 2px;
    font-size: 12px;
}
.teacher-sub {
    width: 100%;
}
.box-schedule {
    background: #fff;
    /*border: 1px solid rgba(229,229,229,1);*/
    border-radius: 6px 6px 0px 0px;
    margin-top: 10px;
    overflow: auto;
}
.box-ul {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 8px;
    cursor: pointer;
}
.box-ul li {
    width:29%;
    padding: 5px;
    height: 44px;
    display: flex;
    align-items: center;
    border: 1px solid rgba(235,235,235,1);
    margin:7px;
}
.box-li-line {
    width: 4px;
    height: 24px;
    background: rgba(65,150,255,0.8);
    margin-right:14px;
}
.box-record {
    background: #fff;
    /*border: 1px solid rgba(229,229,229,1);*/
    border-radius: 6px 6px 0px 0px;
    margin-top: 10px;
    overflow: auto;
}
.record-ul {
    padding: 0 8px;
}
.record-ul li {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    height: 55px;
}
.record-ul li .week-subject-teacher {
    margin-left: 10px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(102,102,102,1);
    width:85%;
}

.record-ul li .week-subject-teacher p {
    display:flex;
    align-items:center;
}

.record-ul li .swap-icon {
    width: 22px;
    height: 22px;
    line-height: 22px;
    color: #4196FF;
    border: 1px solid #4196FF;
    border-radius: 50%;
    text-align: center;
    transform: rotate(90deg);
}
.record-ul li .del-icon {
    color: #FE7437;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
}

.record-ul li .del-icon:hover {
    background: rgba(255,229,214,1);
}

.no-cover {
    background: #F6F6F6;
}
.schedule-content .fa-stack {
    font-size: 14px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    cursor: pointer;
    border-radius: 16px;
    text-align: center;
    background: #4196FF;
    opacity: 0.3;
    color: #fff;
}
.schedule-content .fa-stack:hover {
    opacity: 1;
    color:#fff;
}
.schedule-content i {
    cursor: pointer;
}
.table-content {
    /*border: 1px solid #ddd;*/
    text-align: center;
    margin: 0 auto;
    border-collapse: collapse;
    font-size: 14px;
    width: 100%;
    margin-top: 5px;
}

.table-content tr {
    width: 100%;
    height: 48px;
    text-align: center;
}

.table-content tr th {
    height: 48px;
    border-bottom: 1px solid #D8E0EB;
    background: rgba(65,150,255,0.1);
    text-align: center;
    color: #333;
    font-weight: 400;
}
.table-content tr td {
    text-align: center;
    border-bottom: 1px solid #cfcfcf;
    max-width: 195px;
    min-width: 100px;
    border: 1px solid #cfcfcf;
    vertical-align: top;
}
.table-content tr td:first-child {
    max-width: 44px;
    width: 44px;
    min-width: 44px;
    color: #444;
    font-weight: bold;
    border: none;
    border-right: 1px solid #cfcfcf;
    vertical-align: middle;
}
.td-box {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border: 1px dashed #36931B;
    z-index: 100;
    background: rgba(218,249,199,0.2);
}
.td-box-no {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    cursor: pointer;
    z-index: 100;
    background: none;
}
.td-del-btn {
    visibility:hidden;
    color: #B3B3B3;
    font-size: 14px;
    text-align: center;
    margin-right: 3px;
    width: 20px;
    height: 20px;
    line-height: 20px;
}
.td-del-btn:hover {
    background: rgba(255,229,214,1);
    border-radius: 50%;
    color: #FE7C43;
    margin-right: 3px;
}
.td-class {
    text-align: left;
    color: rgba(49,117,202,1);
    min-height: 50px;
    width: 100%;
    height: 52px;
    /*max-width: 220px;*/
    min-width: 100px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(232,232,232,0.4);
    /*position:relative;
    z-index:999;*/
}
.td-class:hover .td-del-btn {
    visibility: visible;
}
.td-class .left-line {
    width: 4px;
    height: 24px;
    background: rgba(65,150,255,0.8);
    margin-left: 4px;
    margin-right: 14px;
}
.td-class h5 {
    font-size: 14px;
    font-weight: 400;
    color: #444;
    cursor:pointer;
}
.td-class p {
    font-size: 12px;
    font-weight: 400;
    color: #999;
    cursor: pointer;
}
.left-teacher-ul {
    width: 100%;
    position: absolute;
    top: 21px;
    left: -4px;
    max-height: 200px;
    overflow: auto;
    margin: 5px 0;
    padding: 5px 0;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
    z-index: 900;
}
.left-teacher-ul li{
    margin: 0;
    line-height: normal;
    padding: 7px 16px;
    clear: both;
    color: #515a6e;
    font-size: 12px !important;
    white-space: nowrap;
    list-style: none;
    cursor: pointer;
    transition: background .2s ease-in-out;
}
.left-teacher-ul li:hover {
    background: #f3f3f3;
}
.right-class {
    background: rgba(49,117,202,0.1);
    color: rgba(49,117,202,1);
    height: 55px;
    width: 140px;
    margin: 5px;
    border: 1px solid #eee;
    border-radius: 4px;
    text-align: left;
    padding-left: 8px;
    padding-top: 4px;
    display: inline-block;
    position: relative !important;
    z-index: 1;
}
.subject-btn {
    position: absolute;
    right: 0px;
    top: 0px;
    bottom: 0px;
    background: rgba(54, 115, 255,0.5);
    color: #fff;
    width: 30px;
    cursor: pointer;
    font-size: 12px;
    text-align: center;
    line-height: 26px;
}
.subject-btn.active {
    color: #fff;
    background: rgba(54, 115, 255,0.7);
}
.mr-30 {
    margin-right: 30px;
}
.tdBg{
    background: #edf6ff!important;
    border: 1px solid #b8c9e6 !important;
}
.crouse-table .move-crouse{
    width: 100px;
    height: 70px;
    text-align: center;
    background: #fff;
    border: 1px solid #ececec;
    /*display: inline-block;*/
    border-radius: 4px;
    margin: 3px auto;
    box-shadow: 1px 3px 9px 0px #cfdde6;
    padding: 5px;
}
.move-crouse p{
    margin:5px 0 ;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.right-schedule{
    margin-left:20px;
}
.right-schedule .course-frame{
    min-height: 290px;
    border: 2px dashed #ccc;
    background: #fff;
    width: 100%;
}
.right-schedule .course-frame-text{
    font-size: 24px;
    font-weight: bold;
    color: #eaeaea;
    position: absolute;
    top: 150px;
    left: 50%;
    margin: -17px 0 0 -36px;
    z-index: 0;
}
.right-schedule .move-crouse{
    width: 100px;
    min-height: 64px;
    cursor: pointer;
    text-align: center;
    background: #fff;
    border: 1px solid #ececec;
    border-radius: 4px;
    margin: 3px;
    display: inline-block;
    box-shadow: 1px 3px 9px 0px #cfdde6;
    position:relative !important;
    padding:5px;
    z-index: 1;
}
.select-move-crouse {
    color: #fff;
    background: rgba(73,154,255,1);
    position: relative;
    z-index: 999;
}
.select-move-crouse h5 {
    color: #fff;
}

.select-move-crouse p {
    color: #fff;
}
.select-equal-crouse {
    background: rgba(231,242,255,1);

}
.select-equal-crouse h5 {
    color: #357BE8;
}

.select-equal-crouse p {
    color: #357BE8;
}
.schedule-icon .upDown-icon {
    vertical-align: top;
    margin-right: 3px;
    font-size: 28px;
}
.history-record {
    width: 100%;
    margin-top: 8px;
    overflow: auto;
    background: #f9f9f9;
}
.history-record > ul {
    border-bottom: 1px solid #d0d0d0;
}
.history-record > ul > .course-li-box {
    display: block;
    min-height: 80px;
    cursor: pointer;
    border-top: 1px solid #d0d0d0;
    border-bottom: 1px solid #fff;
    padding: 10px 20px 10px 90px;
    position: relative;
    /* background: -webkit-linear-gradient(left,#afd2f1,#4989e3); */
    background: -webkit-linear-gradient(to left,#66cffe,#2b7aeb);
    background: -o-linear-gradient(to right,#66cffe,#2b7aeb);
    background: -ms-linear-gradient(to left,#66cffe,#2b7aeb);
    background: -moz-linear-gradient(to left,#66cffe,#2b7aeb);
    background: linear-gradient(to right,#66cffe,#2b7aeb);
    color: #fff;
}
.history-record > ul > .course-li-box > .record-top {
    display: block;
    font-weight: bold;
    font-size: 17px;
    margin-bottom: 11px;
}
.record-class {
    display: flex;
    align-items:center;
}
.history-record > ul > .course-li-box > .record-top > .record-time {
    display: block;
    font-weight: normal;
    font-size: 14px;
    vertical-align: bottom;
    margin-top: 5px;
}
.history-record > ul > .course-li-box > .fa {
    position: absolute;
    left:0px;
    bottom: -10px;
    font-size: 80px;
    opacity: 0.5;
    transition: all 0.3s;
}
.history-record > ul > .course-li-box:hover .fa{
    opacity: 0.8;
}
.history-record > ul > .course-li-box > .fa:hover{
     opacity: 0.8;
}
.analysis-table{
    width:100%;
    border:1px solid #e8eaec;
    text-align: center;
    cursor: pointer;
    margin: 0 auto;
    border-collapse: collapse;

}
.analysis-table tr th{
    background-color: #f8f8f9;
    border:1px solid #e8eaec;
    padding:10px 10px;
}
.analysis-table tr td{
    border:1px solid #e8eaec;
    padding:10px 10px;
}
.schedule-analysis-content .rule-box{
   border:1px solid #eaeaea;
   min-height:200px;
   margin-left:10px;
}
.schedule-analysis-content .rule-box:first-child{
   margin-left:0;
}
.schedule-analysis-content .rule-box h2{
    background-color: #f8f8f9;
    padding:10px 14px;
    font-size:14px;
}
.schedule-analysis-content .rule-box h2 span{
    font-size: 12px;
    color: #808080;
}
.schedule-analysis-content .rule-box .no-data-time{
    margin: 30px auto 0;
}
.schedule-analysis-content .rule-box .no-data-time i{
    display: block;
    text-align: center;
    font-size: 38px;
    color: #42d456;
}
.schedule-analysis-content .rule-box .no-data-time span{
     display: block;
    text-align: center;
    margin-top: 6px;
    font-size: 14px;
}
.schedule-analysis-content .cms-view-title{
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
}
.crouse-name{
    position:relative;
    z-index:99;
    font-weight:bold;
    cursor:pointer;
}
.crouse-teacher-name {
    position: relative;
    z-index: 99;
    height: 21px;
    cursor: pointer;
    width:77px;
}
.teacher-icon {
    position: absolute;
    right: 5px;
    bottom: 3px
}

/*�ֶ�����*/
.vertical-divider{
    width:10px;
    height:100%;
    background:#f5f5f5;
}

/*�α�����*/
.class-table-analysis {
    margin-bottom: 180px;
}

.class-table-analysis-title {
    margin: 20px 0 30px;
}

.class-table-analysis-title > div:nth-child(1) {
    font-size: 20px;
    font-weight: 700;
}

.class-table-analysis-ol li {
    height: 80px;
    border-radius: 4px;
    padding:10px 18px;
    border-bottom: 1px solid #EAEAEA;
    display: flex;
    align-items: center
}
.class-table-analysis-ol li:hover{
    background:rgba(240,250,255,1);
}

.class-table-analysis-ol li .ivu-progress-inner {
    background: #fff;
}

    .class-table-analysis-ol li span {
        margin-right: 10px;
        font-weight: 700;
    }
    .percentage{
        padding:0px 16px;
        color:rgba(140,140,140,0.65);
    }
.ctac-progress {
    width: 560px;
    float: left;
}

.ctac-average li,
.ctac-class-size li {
    float: left;
    width: 140px;
    height: 170px;
    margin: 0px 20px 20px 0px;
}

    .ctac-average li .mark,
    .ctac-class-size li .mark {
        height: 48px;
        line-height: 48px;
        border-radius: 7px 7px 0px 0px;
        color: #fff;
        font-weight: bold;
        text-align: center;
    }

    .ctac-average li .mark {
        background: linear-gradient(90deg,rgba(57,201,197,1) 0%,rgba(21,114,238,1) 100%);
    }

    .ctac-class-size li .mark {
        background: linear-gradient(136deg,rgba(63,43,177,1) 0%,rgba(5,109,217,1) 100%);
    }

    .ctac-average li .class-nums,
    .ctac-class-size li .class-nums {
        height: 122px;
        border-radius: 0px 0px 7px 7px;
        border: 1px solid #eee;
        text-align: center;
    }

        .ctac-average li .class-nums > div:nth-child(1),
        .ctac-class-size li .class-nums > div:nth-child(1) {
            margin: 20px 0px;
        }

            .ctac-average li .class-nums > div:nth-child(1) > b,
            .ctac-class-size li .class-nums > div:nth-child(1) > b {
                font-size: 26px;
                color: #DB4A13;
            }

.ctac-average-btn,
.ctac-class-size-btn {
    width: 100px;
    height: 30px;
    line-height: 30px;
    background: linear-gradient(90deg,rgba(61,50,175,1) 0%,rgba(24,108,212,1) 100%);
    border-radius: 15px;
    color: #fff;
    margin: 0 auto;
}

.class-position-table {
    width: 100%;
}

    .class-position-table thead {
        height: 60px;
        line-height: 60px;
        background: linear-gradient(90deg,rgba(57,201,197,1) 0%,rgba(21,114,238,1) 100%);
        color: #fff;
        font-weight: 700;
    }

        .class-position-table thead tr th {
            border-right: 1px solid #D7DDE2;
        }

            .class-position-table thead tr th:nth-child(1) {
                border-top-left-radius: 7px;
            }

            .class-position-table thead tr th:last-child {
                border-top-right-radius: 7px;
                border-right: 0px;
            }

    .class-position-table tbody tr td {
        border: 1px solid #D8D8D8;
        text-align: center;
        padding: 10px 0px;
    }

.analsis-schedule-modal-table {
    width: 100%;
}

    .analsis-schedule-modal-table thead tr th,
    .analsis-schedule-modal-table tbody tr td {
        border: 1px solid #eee;
        text-align: center;
    }
.analysis-icon {
    font-size:14px;
    font-weight:400;
    color:rgba(65,150,255,1);
    cursor: pointer;
    text-align: center;
}
.analysis-icon-disable{
    color: #ddd;
}
.view-all-btn {
    width: 77px;
    height: 30px;
    line-height: 30px;
    background: linear-gradient(90deg,rgba(57,201,197,1) 0%,rgba(21,114,238,1) 100%);
    border-radius: 15px;
    text-align: center;
    color: #fff;
}
.modal-max{
    max-height:400px;
    overflow-y:auto;
}
.modal-max ol li{
    line-height:30px;
    font-size:14px;
}
.rightClassTabel {
    word-wrap: break-word;
    word-break: normal;
}

</style>
