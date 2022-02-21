<template>
<div class="xy-content-module">
  <div class="xy-content-body">
        <div class="CourseScore-wrapper">
            <div class="CourseScore-body">
                <div class="CourseScore-fitness CourseScore-body-container">
                    <h3 class="CourseScore-body-title">体制测试成绩</h3>
                    <div v-if="fitness.original.length === 0" class="CourseScore-card isEmpty">
                        您还没有体制测试成绩的信息，请在音体美成绩录入模块中录入成绩。
                    </div>
                    <div v-else class="CourseScore-card">
                        <div class="CourseScore-card-navBar">
                            <a href="javascript:;" class="CourseScore-card-navBtn"
                                :class="{active: index === fitness.nowItem}" v-for="(item, index) in fitness.original" :key="index"
                                @click="setItem('f',item.items,
                               index)">{{item.AcademicYearName}}</a>
                        </div>
                        <div class="CourseScore-card-body">
                            <div v-if="fitnessNowItems.AchievementList.length === 0" class="isEmpty">您还没有体制测试成绩的信息，请在音体美成绩录入模块中录入成绩。</div>
                            <ul v-else class="CourseScore-list"
                                v-for="(item, index) in fitnessNowItems.AchievementList" :key="index">
                                <li class="CourseScore-list-item">
                                    <span class="CourseScore-list-caption">{{item.SportItemName}}</span>
                                </li>
                                <li class="CourseScore-list-item">
                                    <span class="CourseScore-list-caption">测试结果</span><span
                                        class="CourseScore-list-value">{{item.Value}}</span>
                                </li>
                                <li class="CourseScore-list-item" v-show="item.Score">
                                    <span class="CourseScore-list-caption">评分</span><span
                                        class="CourseScore-list-value">{{item.Score}}</span>
                                </li>
                                <li class="CourseScore-list-item" v-show="item.Level !== '无'">
                                    <span class="CourseScore-list-caption">等级</span><span
                                        class="CourseScore-list-value">{{item.Level}}</span>
                                </li>
                                <li class="CourseScore-list-item" v-show="item.BonusPoints">
                                    <span class="CourseScore-list-caption">加分</span><span
                                        class="CourseScore-list-value">{{item.BonusPoints}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="CourseScore-card-footer" v-if="fitnessNowItems && fitnessNowItems.AchievementList.length > 0">
                            <span>总分：{{fitnessNowItems.TotalScore}}</span><span
                                style="margin-left: 2em;">总分等级：{{fitnessNowItems.TotalScoreLevel}}</span>
                        </div>
                    </div>
                </div>
                <div class="CourseScore-grade CourseScore-body-container">
                    <h3 class="CourseScore-body-title">模块成绩表</h3>
                    <div class="CourseScore-card">
                        <div class="CourseScore-card-navBar">
                            <a href="javascript:;" class="CourseScore-card-navBtn"
                                :class="{active: index === course.nowItem}" v-for="(item, index) in course.original" :key="index"
                                @click="setItem('c',item.items,
                               index)">{{item.CourseName}}</a>
                        </div>
                        <div class="CourseScore-card-body" v-if="courseNowItems">
                            <div v-if="courseNowItems.AchievementList.length === 0" class="isEmpty">您还没有模块成绩的信息，请在音体美成绩录入模块中录入成绩。</div>
                            <div v-else>
                              <ul class="CourseScore-list">
                                <li class="CourseScore-list-title">
                                    <span>考试名称</span>
                                </li>
                                <li class="CourseScore-list-title">
                                    <span>课程名称</span>
                                </li>
                                <li class="CourseScore-list-title">
                                    <span>模块成绩评价</span>
                                </li>
                              </ul>
                              <ul class="CourseScore-list" v-for="(item, index) in courseNowItems.AchievementList" :key="index">
                                  <li class="CourseScore-list-item">
                                      <span class="CourseScore-list-tableValue">{{item.ExaminationName}}</span>
                                  </li>
                                  <li class="CourseScore-list-item">
                                      <span class="CourseScore-list-tableValue">{{item.SubjectName}}</span>
                                  </li>
                                  <li class="CourseScore-list-item">
                                      <span class="CourseScore-list-tableValue">{{item.LevelName}}</span>
                                  </li>
                              </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</template>
<script>
  export default {
    data () {
      return {
        user: {},
        fitness: {
          original: [],
          nowItem: []
        },
        course: {
          original: [],
          nowItem: []
        }
      }
    },
    created () {
      this.getData()
    },
    computed: {
      fitnessNowItems () {
        return this.fitness.original[this.fitness.nowItem]
      },
      courseNowItems () {
        return this.course.original[this.course.nowItem]
      }
    },
    methods: {
      setItem (type, item, index) {
        if (type === 'f') {
          this.fitness.nowItem = index
        } else if (type === 'c') {
          this.course.nowItem = index
        }
      },
      async getData () {
        this.xy.loading()
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AemBase/GetCurrentStudentAemAchievement', null)
        if (res.success) {
          this.xy.unloading()
          this.fitness.original = res.data.SportItemAchievement
          this.course.original = res.data.ArtAndSportAchievement
          if (this.fitness.original.length > 0) {
            this.fitness.nowItem = 0
          }
          if (this.course.original.length > 0) {
            this.course.nowItem = 0
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.CourseScore-wrapper {
  min-width: 1010px;
}

.CourseScore-header {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 97%;
  width: calc(100% - 30px);
  height: 130px;
  margin: 0 auto;
  // background: url(./banner.png) no-repeat #4f8cff;
  background-image: url(~@/assets/educationAffairs/banner.png) no-repeat #4f8cff;
  border-radius: 10px;
  -webkit-box-shadow: 0px 2px 10px 0px rgba(197, 197, 197, 0.5);
  box-shadow: 0px 2px 10px 0px rgba(197, 197, 197, 0.5);
}

.CourseScore-header-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  position: absolute;
  top: 32px;
  left: 60px;
}

.CourseScore-avatar {
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background: #fff;
  border-radius: 30px;
  font-size: 20px;
  font-weight: bold;
  color: #387bff;
  overflow: hidden;
}

.CourseScore-info {
  margin-left: 20px;
  color: #fff;
  line-height: 1.8;
}

.CourseScore-name {
  font-size: 18px;
  font-weight: bold;
}

.CourseScore-studentID {
  margin-left: 10px;
  font-size: 12px;
  background: #1B60DE;
  padding: 2px 4px;
  border-radius: 4px;
  vertical-align: text-bottom;
}

.CourseScore-class {
  font-size: 14px;
}

.CourseScore-body {
  padding: 30px 15px;
}

.CourseScore-body-container {
  width: 100%;
}

.CourseScore-body-title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}

.CourseScore-card {
  min-height: 200px;
  -webkit-box-shadow: 0px 2px 10px 0px rgba(197, 197, 197, 0.5);
  box-shadow: 0px 2px 10px 0px rgba(197, 197, 197, 0.5);
  border-radius: 8px;
}

.CourseScore-card.isEmpty {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: #999;
}

.CourseScore-card-navBar {
  line-height: 47px;
  border-bottom: 1px solid #cfcfcf;
}

.CourseScore-card-navBtn {
  position: relative;
  display: inline-block;
  padding: 0 20px;
}

.CourseScore-card-navBtn.active {
  font-weight: bold;
}

.CourseScore-card-navBtn.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  display: inline-block;
  width: 20px;
  height: 4px;
  background: #6392e9;
}

.CourseScore-card-body {
  padding: 10px 25px;
}

.CourseScore-card-body>.isEmpty {
  text-align: center;
  margin-top: 20px;
  color: #999;
}

.CourseScore-list {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  line-height: 60px;
  border-bottom: 1px solid #eaeaea;
}

.CourseScore-list-caption {
  margin-right: 10px;
  font-size: 14px;
  color: #999;
}

.CourseScore-list-value {
  font-size: 14px;
  color: #444;
}

.CourseScore-card-footer {
  padding: 5px 25px 15px;
  font-size: 14px;
  font-weight: bold;
  color: #999;
}

.CourseScore-list-title {
  color: #999;
}

/* 具体项目 */
.CourseScore-grade {
  margin-top: 40px;
}

.CourseScore-fitness .CourseScore-list-item {
  width: 40%;
}

.CourseScore-fitness .CourseScore-list-item:nth-child(2) {
  width: 20%;
}

.CourseScore-fitness .CourseScore-list-item:nth-child(3) {
  width: 15%;
}

.CourseScore-fitness .CourseScore-list-item:nth-child(4) {
  width: 15%;
}

.CourseScore-fitness .CourseScore-list-item:nth-child(5) {
  width: 10%;
}

.CourseScore-grade .CourseScore-list-item,
.CourseScore-grade .CourseScore-list-title {
  width: 40%;
}

.CourseScore-grade .CourseScore-list-item:nth-child(3),
.CourseScore-grade .CourseScore-list-title:nth-child(3) {
  width: 20%;
}

</style>
