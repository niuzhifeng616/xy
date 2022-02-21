<template>
  <!-- 6.查看课表 -->
  <div class="look-schedule xy-content-body">
    <div class="clearfix">
        <div class="fl">
            <Button class="xy-primary" @click="exprotFile" v-if="isOperation===0">导出</Button>
        </div>
        <div class="fr">
            <!--<span>共{{allClassNum}}个班</span>-->
        </div>
    </div>
    <div v-if="!loading">
      <div class="area-part" v-if="timeTable.length > 0">
        <div class="area-item" v-for="(item, index) in timeTable" :key="index">
            <div class="area-left">
                <span class="dot"></span>
                <div class="top">{{item.Times}}</div>
                <div class="bottom">{{item.ClassCount}}个班</div>
            </div>
            <div class="area-right">
              <div class="" v-for="(category, index) in item.Categorys" :key="index">
                  <div class="class-name nowrap">
                      {{category.SubjectCategoryName}}{{category.ClassCount}}个班
                  </div>
                  <ul class="crouse-ul">
                      <li class="clearfix" v-for="(classSub, n) in category.Classs" :key="n">
                          <div class="icon fl"><i class="iconfont">&#xe6f4;</i></div>
                          <div class="right fl">
                            <div class="sub-name nowrap" :title="classSub.SubjectName">{{classSub.SubjectName}}</div>
                            <div class="teacher-section">
                                <p class="nowrap" style="width:50%" :title="classSub.TeacherNames">{{classSub.TeacherNames}}</p>
                                <p class="nowrap text-right" style="width:50%" :title="classSub.Lesson">{{classSub.Lesson}}</p>
                            </div>
                          </div>
                      </li>
                  </ul>
              </div>
            </div>
        </div>
      </div>
      <div v-else class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
        <span class="no-data-text">您还没有课表信息，请添加课程设置。</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'TLLookSchedule',
    components: {

    },
    data () {
      return {
        loading: true,
        timeTable: [],
        allClassNum: 0, // 共多少个班
        isOperation: true,
        classTableID: 0
      }
    },
    created () {
      this.isOperation = this.$parent.isOperation
      this.classTableID = this.$parent.rowObj.ClassTableID
      this.getTp()
    },
    mounted () {
    },
    methods: {
      // 获取数据
      async getTp () {
        this.loading = true
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedGrabTimeTable/SelectTimeTable`, {
          classTableID: this.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.timeTable = res.data
          for (var i = 0; i < this.timeTable.length; i++) {
            this.allClassNum = this.allClassNum + this.timeTable[i].ClassCount
          };
        }
        this.loading = false
      },
      exprotFile () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/SelectSchoolBasedGrabTimeTable/ExportSelectTimeTable?classTableID=${this.classTableID}`)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import './css/takeLessonCommon.css';
  .look-schedule{
    margin-bottom: 30px;
    padding-bottom: 30px;
    background: #fff;
  }
.area-right .class-name {
    color: rgba(0,0,0,0.65);
}
.crouse-ul li {
    width:270px;
    height:108px;
    padding: 26px 0 0 23px;
    background:rgba(255,255,255,1);
    border-radius:2px;
    border:1px solid rgba(233,233,233,1);
    margin:10px 10px 0 0;
    display:inline-block;
}
.crouse-ul li .icon{
  width: 48px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  border-radius: 50%;
  background: #FFBF00;
  margin-right: 13px;
}
.crouse-ul .right{
  width: calc(100% - 65px);
}
.crouse-ul li .icon i{
  font-size: 22px;
  color: #fff;
}
.crouse-ul li .sub-name {
  margin:2px 0 5px 0;
    font-size: 16px;
    font-weight: bold;
    color: rgba(0,0,0,0.85);
}
.crouse-ul li .teacher-section {
  width: 175px;
    border-radius: 0px 0px 0px 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: rgba(0,0,0,0.45);
}
</style>
