<template>
  <div class="xy-content-module">
    <div class="box">
      <div class="box-top">
        <div class="box-btn">
          <Button class="xy-primary" @click="pick">{{isPick?'取消多选':'多选'}}</Button>
          <Button class="xy-info" @click="goDesc">评价详情</Button>
        </div>
        <Select v-model="status" placeholder="请选择" class="pick-widht" @on-change="getList">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="box-middle">
        <div class="box1"
          v-for="(item, index) in studentList"
          :key="item.StudentId"
          @click="pickBtn(index,item)">
          <div class="box2" :class="item.isPick&&isPick ? 'box2-pick' : ''">
            <div class="icon">
              <img v-if="item.Icon" :src="baseApi+item.Icon" alt="">
              <span v-else :class="`color${(Number(index) + 1) % 2}`" v-text="item.StudentName ? item.StudentName.substr(item.StudentName.length - 3,item.StudentName.length - 1) : ''"></span>
            </div>
            <div class="user-info">
              <div class="info">
                <div v-cloak v-if="item.IsEvaluation && item.Type === 'SC'" class="tip">
                  {{item.Number}}<i class="iconfont">&#xe662;</i>
                </div>
                <div class="tip" v-cloak v-if="item.IsEvaluation  && item.Type === 'NV'">
                  {{item.Number}}分
                </div>
              </div>
              <p v-text="item.StudentName"></p>
              <p v-cloak>用户名：{{item.UserName}}</p>
            </div>
            <div class="pick" v-show="isPick" :class="item.isPick ? 'is-pick' : ''">
              <i class="iconfont">&#xe6a1;</i>
            </div>
          </div>
        </div>
      </div>
      <div class="box-but" v-show="isPick">
        <div class="rg">
          <Button  class="xy-btn-primary" shape="circle"
            @click="goEvalu">去评价</Button>
          <Button  class="xy-btn-close"
            @click="back">取消</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'EvaluationOperation',
    data () {
      return {
        baseApi: '',
        isPick: false, // 是否开启批量选择
        status: 0,
        statusList: [
          {
            label: '全部',
            value: 0
          },
          {
            label: '已评价',
            value: 1
          },
          {
            label: '未评价',
            value: 2
          }
        ],
        studentList: [], // 装后台返回该课程的学生数
        pickArr: [],
        courseInfo: JSON.parse(this.$route.query.params) // 跳转过来时携带的参数
      }
    },
    created () {
      this.baseApi = `${this.xyApi}/base`
      this.getList()
    },
    methods: {
      async pickBtn (index, item) {
        if (this.isPick) {
          if (this.pickArr.indexOf(item.StudentId) === -1) {
            this.pickArr.push(item.StudentId)
          } else {
            this.pickArr.splice(index, 1)
          }
          this.studentList[index].isPick = !this.studentList[index].isPick
        } else {
          this.$store.commit('common/getThreeMenuName', `评价${item.StudentName} ${this.$route.query.menuName}`)
          this.$store.commit('common/getParam', { params: JSON.stringify(Object.assign(this.courseInfo, item)) })
          this.$router.push({
            name: 'CreateEvalu',
            query: this.$store.state.common.menuInfo
          })
        }
      },
      async getList () {
        let params = {
          pageIndex: 1,
          pageSize: 20,
          baseId: this.courseInfo.ClassTableGenerateBaseID,
          schoolDistrictId: this.courseInfo.SchoolDistrictID,
          studentGradeForStudentYearId: this.courseInfo.StudentGradeForStudentYearID,
          disciplineId: this.courseInfo.DisciplineID,
          subjectId: this.courseInfo.SubjectID,
          isEvaluation: this.status
        }
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Evaluation/EvaluationPage`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.studentList = res.data.data.map(val => {
            return Object.assign(val, { isPick: false })
          })
        } else {
          this.xy.msgError(res.msg)
        }
      },
      goDesc () {
        this.$store.commit('common/getParam', { params: JSON.stringify(this.courseInfo) })
        this.$router.push({
          name: 'EvaOperDesc',
          query: this.$store.state.common.menuInfo
        })
      },
      pick () {
        this.isPick = !this.isPick
        if (!this.isPick) {
          for (let i = 0, len = this.studentList.length; i < len; i++) {
            this.studentList[i].isPick = false
          }
          this.pickArr = []
        }
      },
      back () {
        this.pickArr = []
        this.isPick = false
        for (let i = 0, len = this.studentList.length; i < len; i++) {
          this.studentList[i].isPick = false
        }
      },
      goEvalu () {
        if (this.pickArr.length === 0) return this.xy.msgError('请选择至少一个需要评价的学生')
        for (const item of this.studentList) {
          if (item.StudentId === this.pickArr[0]) {
            this.$store.commit('common/getThreeMenuName', `评价${this.pickArr.length}人 ${this.$route.query.menuName}`)
            this.$store.commit('common/getParam', { params: JSON.stringify(Object.assign(this.courseInfo, { IsEvaluation: item.IsEvaluation, StudentId: item.StudentId, ClassTableGenerateForStudentID: item.ClassTableGenerateForStudentID, pickArr: this.pickArr })) })
            this.$router.push({
              name: 'CreateEvalu',
              query: this.$store.state.common.menuInfo
            })
            return
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .mod-title {
    display: flex;
    padding: 20px;
  }
  .course-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 47px;
    line-height: 47px;
    background: #FFF;
    margin-bottom: 20px;
    p {
      font-size:20px;
      font-weight:bold;
      color:rgba(0,0,0,1);
    }
  }
  .box {
    padding: 20px 16px;
    background-color: #FFF;
    .box-top {
      display: flex;
      justify-content: space-between;
      padding-bottom: 20px;
      .pick-widht {
        max-width: 154px;
      }
      .box-btn {
        margin-left: 8px;
      }
    }
    .box-middle {
      display: flex;
      flex-flow: row wrap;
      .box1 {
        width: 298px;
        height: 140px;
        display: flex;
        justify-content: center;
        cursor: pointer;
        .box2 {
          width: 95%;
          height: 90%;
          background:rgba(255,255,255,1);
          border:1px solid rgba(233,233,233,1);
          display: flex;
          position: relative;
          .pick {
            position: absolute;
            right: -1px;
            bottom: -1px;
            width: 0;
            height: 0;
            // border-bottom: 60px solid #4196FF;
            border-bottom: 60px solid #EEEEEE;
            border-left: 60px solid transparent;
            i {
              color: #FFF;
              position: absolute;
              right: 8px;
              bottom: -52px;
              z-index: 1;
            }
          }
          .pick:hover {
            cursor: pointer;
          }
          .is-pick {
             border-bottom: 60px solid #4196FF;
          }
          .icon {
            width: 30%;
            height: 80%;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
              display: block;
              border-radius: 50%;
              width: 68px;
              height: 68px;
              margin-top: 10px;
            }
            span {
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 50%;
              width: 68px;
              height: 68px;
              background-color: pink;
              color: #FFF;
              margin-top: 10px;
            }
          }
          .user-info {
            width: 70%;
            p, .info {
              color: rgba(0,0,0, 0.85);
              height: 30px;
              line-height: 30px;
            }
            .tip:nth-of-type(1) {
              text-align: right;
              font-size: 14px;
              padding-right: 18px;
              padding-top: 18px;
              i {
                margin-left: 5px;
                color: #FFBF00;
                font-size: 12px;
              }
            }
            .tip:nth-of-type(2) {
              font-size: 16px;
            }
            p:nth-of-type(2) {
              font-size: 14px;
              color: rgba(0,0,0, 0.45);
            }
          }
        }
        .box2-pick{
          border:1px solid #4196ff;
        }
      }
    }
    .box-but {
      position: fixed;
      left: 60px;
      right: 0;
      bottom: 0;
      background-color: #FFF;
      padding: 10px;
      border-top: 1px solid #eee;
      .rg {
        text-align: center;
      }
    }
  }
  .color1 {
    background-color: #4196FF !important;
  }
  .color2 {
    background-color: #FF81AC !important;
  }
</style>
