<!-- 课表变动 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix pr">
      <Button class="xy-primary fl"
              @click="changeShow">从班级课表变更<Icon type="md-arrow-dropdown"
              style="margin-left:5px;"></Icon>
      </Button>
      <!-- 从班级课表变更 -->
      <div class="down-list"
           v-if="isShowSubChange">
        <div class="school-name">
          <span v-for="(item,index) in classList"
                @click="changTab(item,index)"
                :key='index'
                class="nowarp"
                :class='showTitle===index?"active-span":""'
                :title='item.SchoolDistrictName'> {{item.SchoolDistrictName}}</span>
        </div>
        <div class="class-change-tab-pane">
          <div class="class-tab-list pr"
               v-for="(gradeItem,index) in childrensData"
               @click="changeClass(gradeItem,index)"
               :key='index'>
            <i class="class-tab-list-icon fl"
               :class="isIndex===index?'active':''">
              <i class="class-tab-list-icon-in"
                 v-if="isIndex===index"></i>
            </i>
            <span class="fl">{{gradeItem.StudentYearName+gradeItem.StudentGradeName}}</span>
          </div>
        </div>

      </div>
      <!-- <div class="down-teacher-list" v-show="isTeacherShow">
        <i-select v-model="models" filterable remote :remote-method="remoteMethod" :loading="loading">
          <i-option v-for="(item,index) in selectList" :value="item.value" :key='index'>{{item.value}}</i-option>
        </i-select>
      </div> -->
      <div class="fr"
           v-if="isShowYS">
        <i-select v-model="sId"
                  @on-change="sIdChange"
                  style="width:150px"
                  class="xy-content-title-search fl">
          <i-option value="0">所有校区</i-option>
          <i-option v-for="(item,index) in schoolList"
                    :value="item.SchoolDistrictID"
                    :key='index'>{{item.SchoolDistrictName}}</i-option>
        </i-select>
        <cascader v-model="yearSession"
                  style="width:200px;"
                  class="xy-content-title-search fr"
                  :data="AcademicYSList"
                  not-found-text="暂无结果"
                  placeholder="请选择学年/学期"
                  @on-change="yearSessionChangeFun"></cascader>

      </div>
    </div>
    <router-view class="xy-content-body"
                 ref='childCompent'></router-view>
    <!-- <div class="xy-content-body">
      <list ref="list" v-show='isShowYS'></list>
      <to-grade v-show='!isShowYS' ref='toGrade'></to-grade>
    </div> -->
  </div>
</template>

<script>
// import List from './List'
// import ToGrade from './ToGrade'
  export default {
    // components: { List, ToGrade },
    data () {
      return {
        showTitle: 0,
        childrensData: [],
        isShowYS: true,
        isShowSubChange: false,
        isTeacherShow: false,
        models: '',
        loading: false,
        options: [],
        selectList: [{ value: 'aa' }, { value: 'bb' }],
        classList: [],
        sId: '0',
        yId: '0',
        seId: '0',
        isIndex: -1,
        sGradeId: '',
        schoolList: [],
        schoolDs: '',
        AcademicYSList: [], // 学年学期
        StudentDYGList: [], // 学习阶段
        yearSession: [0, 0],
        // 子页面需要的参数
        studentGradeForStudentYears: '',
        titleNames: ''
      }
    },
    created: function () {
      this.getClasses()
      this.getSchool()
    },
    methods: {
      // 获取校区
      async  getSchool () {
        let that = this
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`)
        if (res.success) {
          if (res.data.length > 0) {
            that.schoolList = res.data
          } else {
            that.schoolList = []
          };
          // 获取学年数据
          this.addMore()
        }
      },
      // 获取学年学期
      async addMore () {
        let that = this
        // 学年-学期
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`)
        that.AcademicYSList = res.data
        if (res.data.length > 0) {
          res.data.map(item => {
            item.children.map(t => {
              if (item.IsCurrent && t.IsCurrent) {
                that.yearSession[0] = item.value
                that.yearSession[1] = t.value
              };
            })
          })
          this.$refs.childCompent.loadTable()
        };
      // 校区-学届-学习阶段
      // this.xy.get(`${this.xyApi}/xy/comm/GetSchoolDistrictNodeList`).then(res => {
      //   that.StudentDYGList = res.data
      // })
      },

      // 改变校区
      sIdChange: function (sId) {
        this.sId = sId
        // console.log(`校区id：${sId}`)
        this.$refs.childCompent.pageCurrent = 1
        this.$refs.childCompent.loadTable()
      },
      // 改变学年学期
      yearSessionChangeFun: function (val) {
        if (val.length === 0) {
          this.yearSession = [0, 0]
        };
        if (val.length === 1) {
          this.yearSession = [val[0], 0]
        };
        if (val.length === 2) {
          this.yearSession = val
        };
        // console.log(`学年学期id：${val}，${this.yearSession}`)
        this.$refs.childCompent.pageCurrent = 1
        this.$refs.childCompent.loadTable()
      },
      async getClasses () {
        let that = this
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForCourseChange/GetClasses`)
        if (res.success) {
          if (res.data.length > 0) {
            that.classList = res.data
            that.childrensData = res.data[0].Childrens || []
            that.schoolDs = res.data[0].SchoolDistrictName
          } else {
            that.classList = []
            that.childrensData = []
          };
        }
      },
      // 点击课程变更按钮，
      changeShow: function () {
        // if (this.isTeacherShow) {
        //   this.isTeacherShow = false
        // };
        this.isShowSubChange = !this.isShowSubChange
      },
      // 改变课程变更的校区
      changTab: function (item, index) {
        this.showTitle = index
        this.childrensData = item.Childrens
        this.schoolDs = item.SchoolDistrictName
        this.isIndex = -1
      },
      changeClass: function (vals, indexs) {
        this.isIndex = indexs
        this.isShowYS = false
        this.isShowSubChange = false
        this.titleNames = this.schoolDs + vals.StudentYearName + vals.StudentGradeName
        this.studentGradeForStudentYears = vals.StudentGradeForStudentYearID
        if (this.$router.currentRoute.fullPath.indexOf('/xyHome/classChange/toGrade') === -1) {
          this.$store.commit('common/getThreeMenuName', '课表变更')
          this.$router.push({ path: '/xyHome/classChange/toGrade', query: this.$store.state.common.menuInfo })
        } else {
          this.$refs.childCompent.activeIndex = 0
          this.$refs.childCompent.currentPage = 1
          this.$refs.childCompent.move = 0
          this.$refs.childCompent.getWeek()
          this.$refs.childCompent.getSubject()
        }

      // this.$refs.toGrade.getWeek()
      // this.$refs.toGrade.getSubject()
      // let that = this
      // xy.http.load(xy.subMenuWebUrl + '/View/csmsTimeTable/PC/View/ScheduleChanges/ClassChange/ToGrade.html', {
      //   targetID: 'ClassChange',
      //   loadParams: {
      //     'titleNames': that.schoolDs + vals.StudentYearName + vals.StudentGradeName,
      //     'studentGradeForStudentYears': vals.StudentGradeForStudentYearID,
      //     'applications': xy.param.getValues('applications'),
      //     'breadcrumbIDs': xy.param.getValues('breadcrumbIDs'),
      //     'breadcrumbNames': xy.param.getValues('breadcrumbNames')
      //   }
      // })
      }

    // changeTeacherShow: function () {
    //   if (this.isShowSubChange) {
    //     this.isShowSubChange = false
    //   };
    //   this.isTeacherShow = !this.isTeacherShow
    // },
    // remoteMethod: function (query) {
    //   if (query !== '') {
    //     let list = this.selectList.map(function (item) {
    //       return item
    //     })
    //     this.options = list.filter(function (item) {
    //       return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1
    //     })
    //   } else {
    //     this.options = []
    //   }
    // }
    }

  }
</script>
<style lang='less' scoped>
.down-list {
  position: absolute;
  top: 54px;
  left: 15px;
  padding: 10px 10px 0px;
  background: #fff;
  width: 1000px;
  z-index: 9;
  height: 400px;
  border-radius: 6px;
  overflow-y: auto;
  box-shadow: 0px 4px 12px 0px rgba(170, 170, 170, 0.5);
  .school-name {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid rgba(236, 236, 236, 1);
    padding: 10px 0;
    margin-bottom: 15px;
    span {
      cursor: pointer;
      display: inline-block;
      min-width: 84px;
      height: 28px;
      line-height: 28px;
      background: rgba(244, 245, 247, 1);
      border: 1px solid rgba(217, 217, 217, 1);
      border-radius: 4px;
      margin: 10px;
      text-align: center;
      padding: 0 10px;
    }
    .active-span {
      background: rgba(65, 150, 255, 1);
      border-radius: 4px;
      color: #fff;
    }
  }
}

.down-teacher-list {
  position: absolute;
  top: 54px;
  left: 152px;
  padding: 30px 10px 0px;
  background: #fff;
  width: 300px;
  z-index: 9;
  height: 400px;
  border-radius: 6px;
  overflow-y: auto;
  box-shadow: 0px 4px 12px 0px rgba(170, 170, 170, 0.5);
}

.class-change-tab-pane {
  height: 330px;
  overflow: auto;
}

.class-tab-list {
  float: left;
  margin-right: 16px;
  margin-bottom: 16px;
  cursor: pointer;
}

.class-tab-list-icon {
  display: inline-block;
  vertical-align: text-top;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  margin-right: 5px;
  border: 1px solid #eee;
  border-radius: 50%;
}

.class-tab-list-icon.active {
  border: 1px solid #4196ff;
}

.class-tab-list-icon-in {
  width: 14px;
  height: 14px;
  margin: 2px auto;
  display: block;
  border-radius: 50%;
  background: #4196ff;
}
</style>
