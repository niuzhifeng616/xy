<!-- 活动统计-学生 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <p class="title" v-if="activityStaObj.score>0">
        {{activityStaObj.class}}
        <span>{{activityStaObj.student}}</span>
        <span>总得分：{{activityStaObj.score}}</span>
      </p>
      <ul class="ul-box" v-if="list.length>0&&activityStaObj.score>0">
        <li v-for="(item,index) in list" :key="index" class="li-box">
          <p class="activity-name">{{item.ActivityCourseProjectTargetName}}<span class="score" v-if='item.Childrens.length===0'>{{item.TotalScore}}分</span></p>
          <div class="activity-box" v-if='item.Childrens.length>0'>
            <div class="activity-info" v-for="(citem,cindex) in item.Childrens" :key="cindex">
              <span
                class="activity-item-name"
              >{{cindex+1}}、{{citem.ActivityCourseProjectTargetName}}</span>
              <span class="score">{{citem.TotalScore}}分</span>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
        <span class="no-data-text">您还没有该学生的活动信息，请为该学生添加活动。</span>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    components: {},
    data () {
      return {
        list: []
      }
    },
    computed: {
      activityStaObj () {
        return this.$store.state.evaluate.activityStaObj
      }
    },
    created () {
      if (Object.keys(this.$store.state.common.menuInfo).length > 0) {
        let row = this.$store.state.common.menuInfo
        this.params = {
          ActivityCourseProjectID: row.id,
          ActivityCourseStudentID: row.studentID
        }
        this.loadTable()
      }
    },
    methods: {
      async loadTable () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseStatistics/GetStatisticsStudentByProjectID`, this.params)
        if (res.success) {
          this.list = res.data.ProjectTarget || []
        }
        this.xy.unloading()
      }
    }
  }
</script>
<style lang='less' scoped>
.title {
  font-size: 16px;
  text-align: left;
  color: rgba(0, 0, 0, 0.85);
  padding: 10px 0;
  span {
    margin: 0 10px;
  }
}
.ul-box {
  .li-box {
    width: 100%;
    border: 1px solid #e9e9e9;
    border-radius: 4px 4px 0px 0px;
    margin-bottom: 15px;
    .score {
          color: #ff8700;
          margin-left: 10px;
        }
    .activity-name {
      background: #fafafa;
      padding: 10px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
    }
    .activity-box {
      border-top: 1px solid #e9e9e9;
      display: flex;
      flex-wrap: wrap;
      padding: 10px;
      .activity-info {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        width: 33%;
        display: flex;
        padding: 10px 0;
        .activity-item-name {
          word-break: break-all;
          display: inline-block;
          max-width: 70%;
        }
      }
    }
  }
}
.no-data {
  width: 392px;
  margin: 180px auto 0;
  text-align: center;
  .no-data-img {
    width: 250px;
  }
  .no-data-text {
    margin-top: 10px;
    width: 100%;
    text-align: center;
    font-size: 16px;
    color: #7f7f7f;
  }
}
</style>
