<!-- 我的活动评价 -->
<template>
  <div class='xy-content-module'>
    <div class='xy-content-body'>
      <p class="title" v-if='result.Score>0'>{{result.class}} <span>{{result.FullName}}</span> <span>总得分：{{result.Score}}</span></p>
      <ul class="ul-box"
          v-if="list.length>0&&result.Score>0">
        <li v-for='(item,index) in list'
            :key='index'
            class="li-box">
          <p class='activity-name'>{{item.ActivityCourseProjectTargetName}}<span class="score"  v-if='item.Childrens.length===0'>{{item.TotalScore}}分</span></p>
          <div class="activity-box" v-if='item.Childrens.length>0'>
            <div class="activity-info"
                 v-for='(citem,cindex) in item.Childrens'
                 :key='cindex'>
              <span class="activity-item-name">{{cindex+1}}、{{citem.ActivityCourseProjectTargetName}}</span>
              <span class="score">{{citem.TotalScore}}分</span>
            </div>
          </div>
        </li>
      </ul>
      <up-image :studentId='studentId'></up-image>
    </div>
  </div>
</template>

<script>
  import UpImage from './UpImage'
  export default {
    components: { UpImage },
    data () {
      return {
        list: [],
        studentId: 0,
        result: { class: '', FullName: '', Score: 0 }
      }
    },
    computed: {
      activityStaObj () {
        return this.$store.state.evaluate.activityStaObj
      }
    },
    created () {
      if (Object.keys(this.$store.state.common.menuInfo).length > 0) {
        this.ActivityCourseProjectID = this.$store.state.common.menuInfo.id
        this.loadTable()
      }
    },
    methods: {
      async loadTable () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseStatistics/GetMyStatisticsStudentByProjectID`, {
          ActivityCourseProjectID: this.ActivityCourseProjectID
        })
        if (res.success) {
          this.studentId = res.data.ActivityCourseStudentID
          this.list = res.data.ProjectTarget || []
          this.result = { class: res.data.StudentOrganizationName, FullName: res.data.FullName, Score: res.data.Score }
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
  font-weight: bold;
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
      font-weight: bold;
    }
    .activity-box {
      border-top: 1px solid #e9e9e9;
      display: flex;
      flex-wrap: wrap;
      padding: 10px;
    }
    .activity-info {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      width: 33%;
      display: flex;
      padding: 10px 0;
      // justify-content: center;
      .activity-item-name {
        word-break: break-all;
        display: inline-block;
        max-width: 70%;
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
