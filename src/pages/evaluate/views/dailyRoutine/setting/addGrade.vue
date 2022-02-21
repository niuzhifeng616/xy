<template>
  <div class="planCreat">
    <div class="xy-content-title clearfix">
      <div class="fl">
        <Button class="xy-primary"
                :disabled="changeMoralObj.IsEnable === 1"
                @click="getGrade">添加年级</Button>
        <Button class='xy-danger'
                :disabled="changeMoralObj.IsEnable === 1"
                @click="delAll">全部删除</Button>
      </div>
    </div>
    <div class="xy-content-body">
      <div v-if="checkedArr.length > 0">
        <ul class="grade-list" :style="{cursor:changeMoralObj.IsEnable === 1 ? 'auto':'pointer'}">
          <li class="grade-li" v-for="(item,index) in checkedArr" :key="index">
            <div class="li-top">
              <span
                class="GradeImg"
                :class="item.StudentGradeName === '小学' ? 'primary' : item.StudentGradeName === '初中' ? 'junior' : item.StudentGradeName === '高中' ? 'high' : ''"> <img :src="GradeImg" /> </span>
              <p class="grade-name" :title="item.title">{{item.title ? item.title : item.StudentGradeForStudentYearName}}</p>
            </div>
            <div class="li-mid">
                <CheckboxGroup  v-model="item.RoleIDList"  @on-change="changeRoleType">
                  评价角色：
                  <Checkbox disabled label="2">教师</Checkbox>
                  <Checkbox :disabled="changeMoralObj.IsEnable===1" label="3">学生</Checkbox>
                  <Checkbox v-if="$store.state.evaluate.evaClass==='1'" :disabled="changeMoralObj.IsEnable===1" label="4">家长</Checkbox>
                </CheckboxGroup>
            </div>
            <div class="li-bottom" @click="delOneobj(item)">
              <Icon type="ios-trash-outline" size='20'/>
              <span>删除</span>
            </div>
          </li>
        </ul>
      </div>
      <div v-if="checkedArr.length===0" class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
        <span class="no-data-text">您还没有班级的信息，请添加班级。</span>
      </div>
    </div>
    <Modal
      v-model="isShow"
      :mask-closable="false"
      :transfer="false"
      title="选择年级"
      width=800>
      <div class="demo-split">
        <div class="demo-split-pane demo-split-pane1">
          <Tree ref="tree" :data="subjectArr" @on-check-change='getChecked' show-checkbox></Tree>
        </div>
        <div class="demo-split-pane">
            <div class="checkedTit">已选中 {{rightCheckArr.length}} 个年级。</div>
            <ul class="checkedList" v-if="rightCheckArr.length !== 0">
              <li v-for="(item, index) in rightCheckArr" :key="index">
                <span>{{item.title}}</span>
                <span class="delX" @click="delOne(item, index)">X</span>
              </li>
            </ul>
        </div>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="isShow=false">取消</Button>
        <Button class="xy-modal-primary" @click="ok" shape="circle">确定</Button>
      </div>
    </Modal>
    <div class="sure-submit">
        <Button class="xy-btn-primary" shape="circle" @click="sure">保存</Button>
        <!-- <Button class="xy-btn-close">取消</Button> -->
    </div>
  </div>
</template>
<script>
  import GradeImg from '../imgs/grade.png'
  export default {
    name: 'addGrade',
    data () {
      return {
        GradeImg: GradeImg,
        applicationID: 0,
        applicationSubMenuID: 0,
        // 方案信息
        StepsHeader: {},
        school: 0,
        checkedArr: [],
        StudentGradeID: 0,
        StudentGradeForStudentYearID: 0,
        StudentYearID: 0,
        // 添加年级
        subjectArr: [],
        rightCheckArr: [],
        isShow: false
      }
    },
    computed: {
      idArr () {
        return this.$store.state.common.menuId
      },
      changeMoralObj () {
        return this.$store.state.evaluate.changeMoralObj
      }
    },
    watch: {
      idArr: {
        handler (val) {
          let idArr = val.split(',')
          this.applicationID = idArr[1]
          this.applicationSubMenuID = idArr[2]
        },
        immediate: true
      },
      checkedArr (val) {
        console.log(val)
      }
    },
    created () {
      this.StepsHeader = this.$parent
      this.getList()
    },
    methods: {
      // 获取校区、年级
      getGrade () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/MoralProgramme/GetUserRangeClassGradePermissionNodeList`, {
          ProgrammeID: this.StepsHeader.rowObj.ProgrammeID,
          ApplicationID: this.applicationID,
          ApplicationSubMenuID: this.applicationSubMenuID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.subjectArr = []
            this.rightCheckArr = []
            let resData = res.data
            for (let i = 0; i < resData.length; i++) {
              let children1 = []
              this.subjectArr.push({
                title: resData[i].label,
                id: resData[i].value,
                level: 1,
                expand: true,
                children: children1
              })
              for (let m = 0; m < resData[i].children.length; m++) {
                let children2 = []
                children1.push({
                  title: resData[i].children[m].label,
                  id: resData[i].children[m].value,
                  level: 2,
                  expand: true,
                  children: children2
                })
                for (let n = 0; n < resData[i].children[m].children.length; n++) {
                  children2.push({
                    title: resData[i].children[m].children[n].label,
                    id: resData[i].children[m].children[n].value,
                    level: 3,
                    StudentGradeID: resData[i].children[m].value,
                    StudentYearID: resData[i].children[m].children[n].children[0].value,
                    StudentGradeForStudentYearID: resData[i].children[m].children[n].value,
                    expand: true,
                    children: []
                  })
                }
              }
            }
            this.isShow = true
          }
        })
      },
      getChecked (val) {
        this.rightCheckArr = []
        for (let i in val) {
          if (val[i].level === 3) {
            this.rightCheckArr.push(val[i])
          }
        }
      },
      delOne (i, idx) {
        let tree = this.$refs.tree.getCheckedAndIndeterminateNodes()
        for (var a = 0; a < tree.length; a++) {
          if (tree[a].level < 3) {
            tree[a].checked = false
            tree[a].indeterminate = false
          } else {
            if (tree[a].id === i.id) {
              tree[a].checked = false
            }
          }
        }
        this.rightCheckArr.splice(idx, 1)
      },
      ok () {
        if (this.rightCheckArr.length === 0) {
          this.xy.msgError('您还未选择年级。')
        } else {
          let modelGrage = []
          for (var i = 0; i < this.rightCheckArr.length; i++) {
            modelGrage.push({
              ProgrammeID: this.StepsHeader.rowObj.ProgrammeID,
              StudentGradeID: this.rightCheckArr[i].StudentGradeID,
              StudentYearID: this.rightCheckArr[i].StudentYearID,
              StudentGradeForStudentYearID: this.rightCheckArr[i].StudentGradeForStudentYearID
            })
          }
          this.xy.loading()
          this.xy.post(`${this.$store.state.apiPath}/api/MoralProgramme/SaveProgrammeGrade`, {
            modelGrage: modelGrage
          }).then(res => {
            this.xy.unloading()
            if (res.success) {
              this.xy.msgSuc('保存成功。')
              this.isShow = false
              this.getList()
              this.StepsHeader.getGeneralFlows()
            }
          })
        }
      },
      // 获取列表
      getList () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/MoralProgramme/GetProgrammeById`, {
          programmeID: this.StepsHeader.rowObj.ProgrammeID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.checkedArr = res.data.MoralEducationProgrammeGradeList
          }
        })
      },
      // 删除
      delAll () { // 全部删除
        this.$Modal.confirm({
          title: '温馨提示',
          content: '确定要全部删除年级吗？',
          onOk: () => {
            let ids = []
            this.checkedArr.map(item => {
              ids.push(item.StudentGradeForStudentYearID)
            })
            this.delAllObj(ids)
          }
        })
      },
      delOneobj (val) { // 删除单个
        if (this.changeMoralObj.IsEnable === 1) {

        } else {
          this.$Modal.confirm({
            title: '温馨提示',
            content: '确定要删除' + val.StudentGradeForStudentYearName + '年级吗？',
            onOk: () => {
              let ids = [val.StudentGradeForStudentYearID]
              this.delAllObj(ids)
            }
          })
        }
      },
      delAllObj (ids) {
        this.xy.post(`${this.$store.state.apiPath}/api/MoralProgramme/DeleteProgrammeGrade`, {
          ProgrammeID: this.StepsHeader.rowObj.ProgrammeID,
          ids: ids
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('删除成功。')
            this.getList()
            this.StepsHeader.getGeneralFlows()// 成功后步骤可以点击
          }
        })
      },
      changeRoleType (i) {
        console.log(i)
        console.log(this.checkedArr)
      },
      sure () {
        let params = this.checkedArr.map(item => {
          return {
            ProgrammeGradeID: item.ProgrammeGradeID,
            RoleID: item.RoleIDList
          }
        })
        this.xy.post(`${this.$store.state.apiPath}/api/MoralProgramme/SaveProgrammeGradeRole`, {
          GradeRoleList: params
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.getList()
            this.StepsHeader.getGeneralFlows()
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.demo-split{
  height: 400px;
  display: flex;
  .demo-split-pane{
    overflow: scroll;
    .checkedTit{
      margin: 10px;
    }
    .checkedList{
      padding: 10px;
      display: flex;
      flex-wrap: wrap;
      .delX{
        cursor: pointer;
      }
      .delX:hover{
        color: red;
      }
      li{
        width: 46%;
        margin: 5px;
        padding: 5px;
        border: 1px solid #d9d9d9;
        background: #f5f5f5;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .demo-split-pane:first-child{
    border-right: 1px solid #eee;
    margin-right: 10px;
    width: 280px;
  }
  .demo-split-pane:last-child{
    flex: 1;
  }
}
.GradeImg{
  display: inline-block;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  text-align: center;
  position: relative;
  img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }
}
.primary {
  background: #5bd171;
}
.junior{
  background: #ffbf00;
}
.high{
  background: #2c92f6;
}
.trigger {
  height: 100%;
  width: 1px;
  background: #000;
}
.planCreat{
  -webkit-user-select:none;
   -moz-user-select:none;
   -ms-user-select:none;
   user-select:none;
  .sure-submit{
    width:100%;
    position:fixed;
    bottom:0;
    height:60px;
    display:flex;
    justify-content:center;
    align-items:center;
  }
   .m-l-15{
     margin-left:15px;
   }
   .font85{
     color:rgba(0, 0, 0, 0.85);
   }
   .font65{
     color:rgba(0, 0, 0, 0.65);
   }
   .icon-holiday {
    display: inline-block;
    font-size: 24px;
    color: #fff;
    min-width: 48px;
    height: 48px;
    border-radius: 50%;
    text-align: center;
    line-height: 48px;
  }
  .grade-list{
    margin-top: 10px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    cursor: pointer;
    margin-bottom: 50px;
    .grade-li{
      width: 299px;
      height: 190px;
      background: #ffffff;
      border: 1px solid #e9e9e9;
      border-radius: 2px;
      position: relative;
      margin-right: 10px;
      margin-top: 10px;
      .li-top{
        height: 95px;
        line-height: 95px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 24px 20px;
        .grade-name{
          font-size: 16px;
          font-weight: bold;
          text-align: left;
          color: rgba(0,0,0,0.85);
          margin-left: 14px;
          width: 180px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
      .li-bottom{
        position: absolute;
        bottom: 0;
        left: 0;
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 14px;
        color: rgba(0,0,0,0.45);
        width: 100%;
        background: #f7f9fa;
        border-top: 1px solid #e9e9e9;
      }
      .li-bottom:hover{
        color: #FDA8A4;
      }
      .li-mid{
        height: 95px;
        padding: 0px 20px;
      }
    }
  }
  .plan-list {
    margin-top: 10px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    cursor: pointer;
    margin-bottom: 50px;
  }
  .plan-list li {
    position: relative;
    display: flex;
    align-items: center;
    padding: 20px 15px;
    padding-right: 45px;
    width: 298px;
    height: 100px;
    margin: 10px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(233, 233, 233, 1);
    .info {
      flex: 1;
      color: rgba(0, 0, 0, 0.85);
      margin-left: 10px;
      div {
        display: flex;
        color:rgba(0,0,0,0.45);
        .fl {
          display: inline-block;
          padding-right: 10px;
          margin-right: 10px;
          border-right: 1px solid #e8e8e8;
        }
      }
    }
    img{
      width:40px;
      height: 46px;
    }
  }
  .plan-list  .is-checked{
    border-color: rgba(65,150,255,1) !important;
  }
  .plan-list .class-table-name {
    max-width:110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 10px;
  }

  .plan-list .plan-span {
    margin-top: 17px;
  }
  .plan-list .plan-span span {
    color: #8b8b8b;
  }
  .sanjiao {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    height: 0;
    border-color: transparent #e9e9e9 #e9e9e9 transparent;
    border-width: 25px;
    border-style: solid;
    i {
      position: absolute;
      right: -18px;
      bottom: -20px;
      color: #fff;
    }
  }
  .active-bg {
    border-color: transparent #4196ff #4196ff transparent !important;
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
}

</style>
