<template>
  <div class='xy-content-module'>
    <div class='xy-content-body'>
      <div v-if="schoolList.length > 0">
          <div class="container">
              <ul>
                <li class="class-li"  v-for="(item,index) in schoolList" :key="index">
                  <div class="nowrap grade" :title="item.CoursePlanTableFullName">{{item.CoursePlanTableFullName}}</div>
                  <!-- <div class="grade" :title="item.CoursePlanTableFullName">{{item.CoursePlanTableFullName.length>13?item.CoursePlanTableFullName.substr(0,13)+"...":item.CoursePlanTableFullName}}</div> -->
                  <div class="modular-arr">
                    <div class="modular" v-for="(item1,index1) in item.tables" :key="index1" :class="item1.checked ? 'is-checked':item1.IsPublished?'IsPublished':''" @click="check(index,item1,index1)">
                      <h5 class="title nowrap">{{item1.SubjectName}}</h5>
                      <p><span :title="item1.TeacherNames">{{item1.TeacherNames.substr(0,3)}}</span><span> {{item1.StartTime.substring(0,item1.StartTime.length-3)+"-"+item1.EndTime.substring(0,item1.EndTime.length-3)}}</span></p>
                      <img v-if="item1.IsPublished" class="img" src="@/assets/lanclass/yfb.png" alt="">
                      <div v-else :class="item1.checked?'active-bg sanjiao':''"><i v-if="item1.checked" class="iconfont" style="font-size: 12px;">&#xe6a1;</i></div>
                    </div>
                  </div>
                </li>
              </ul>
          </div>
          <div class="fix-btn">
            <Button class="xy-btn-primary" shape="circle"  @click="save">确定</Button>
          </div>
        </div>
        <div v-else class="no-data-box">
          <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片" />
          <span class="no-data-text">暂无课程。</span>
        </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ListeningSchool',
    data () {
      return {
        schoolList: [{}],
        checkedArr: [],
        menuInfo: {},
        AcademicSessionID: ''// 学期
      }
    },
    created () {
      this.menuInfo = this.$store.state.common.menuInfo.row
      this.getSchoolList()
    },
    mounted () {},
    methods: {
      check (index, item1, index1) {
        if (item1.IsPublished) {
          return false
        }
        item1.checked = !item1.checked
        this.$set(this.schoolList[index], index1, item1.checked)
      },
      save () {
        this.schoolList.forEach(item => {
          item.tables.forEach(item1 => {
            if (item1.checked) {
              this.AcademicSessionID = item1.AcademicSessionID
              this.checkedArr.push(item1.CoursePlanDetailID)
            }
          })
        })
        if (this.checkedArr.length === 0) {
          return this.xy.msgError('请选择课程。')
        }
        this.xy.post(`${this.xyApi}/ic/api/Listening/InsertListeningProgramme`, {
          academicSessionID: parseInt(this.AcademicSessionID),
          coursePlanDetailIDS: this.checkedArr,
          AreaTeachingProgrammeID: parseInt(this.menuInfo.AreaTeachingProgrammeID)
        }).then(res => {
          if (res.success) {
            this.xy.msgSuc('添加成功。')
            this.checkedArr = []
            this.getSchoolList()
          }
        })
      },
      getSchoolList () {
        this.xy.loading()
        this.xy.get(`${this.xyApi}/ic/api/Listening/GetTeacherWeekTimeTable`, {
          startDate: this.menuInfo.CycleStarDate,
          endDate: this.menuInfo.CycleEndDate,
          areaTeachingProgrammeID: this.menuInfo.AreaTeachingProgrammeID
        }).then(res => {
          if (res.success) {
            res.data.TimeTables.forEach(item => {
              item.tables.forEach(item1 => {
                item1.checked = false
              })
            })
            this.schoolList = res.data.TimeTables
          }
          this.xy.unloading()
        })
      }
    }
  }
</script>
<style lang='less' scoped>
.p-t-10{
  padding-top:10px;
}
.container{
  padding: 10px;
}
ul>li:first-child{
  padding-top:0px !important;
}
.class-li{
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  padding: 20px 0 10px 0;
  border-bottom: 1px solid #eee;
  >:first-child{
    margin-right:30px;
  }
  .grade{
    width:150px;
    color: rgba(0,0,0,0.65);
  }
  .modular-arr{
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }
  .modular{
    cursor: pointer;
    position: relative;
    width:167px;
    border:1px solid #DCDCDC;
    padding:13px;
    font-size: 12px;
    color: rgba(0,0,0,0.65);
    border-radius: 4px;
    margin-right:12px;
    margin-bottom:12px;
    .title{
      font-size: 14px;
      color: rgba(0,0,0,0.85);
    }
    .active-bg {
      border-color: transparent #1677FF #1677FF transparent !important;
    }
  }
  .is-checked{
    border-color: #1677FF !important;
    color: #1677ff !important;
    .title{
      color: #1677ff !important;
    }
  }
  .IsPublished{
    p{
      color: rgba(0,0,0,0.65) !important;
      opacity: 0.45;
    }
    .title{
      color: rgba(0,0,0,0.85) !important;
      opacity: 0.45;
    }
  }
  .sanjiao {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    height: 0;
    border-color: transparent #e9e9e9 #e9e9e9 transparent;
    border-width: 13px;
    border-style: solid;
    i {
      position: absolute;
      right: -12px;
      bottom: -14px;
      color: #fff;
    }
  }
  .img{
    width:44px;
    height:44px;
    position: absolute;
    right: 13px;
    top: 9px;

  }
}
.fix-btn {
  height: 50px;
  position: fixed;
  line-height: 50px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 4px 0px rgba(163, 173, 186, 0.4);
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  button {
    margin-right: 20px;
  }
}
</style>
