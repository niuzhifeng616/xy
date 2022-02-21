<!-- 6.发布 -->
<template>
  <div class="PublishResult xy-content-body">
    <Alert show-icon
           closable
           class="tip-alert">发布此方案前需要将选课分班组成的新行政班替换原行政班，新行政班将会参与后续排课任务。</Alert>
    <ul class="publish-ul"
        v-if='newClass.length'>
      <li class="publish-li"
          v-for="item in newClass"
          :key="item.id">
        <div class="li-header">
          <div class="left-crile"
               :class="item.coverClass||isReplaceClass?'bg-gr':'bg-ye'"><img :src="GradeImg" /></div>
          <div class="right-name"
               :class="!item.isCheckPass&&!item.coverClass?'err-right-name':''">
            <span>{{item.name}}</span>
            <img v-if='item.coverClass'
                 src="@/assets/csmsTimeTable/exchange.png"
                 alt=""
                 class="exchange">
            <span v-if='item.coverClass'>{{item.coverClass}}</span>
          </div>
        </div>
        <div class="li-bottom" v-if='!isPublished'>
          <div @click="cover(item)"
               v-if='!item.coverClass'>
            <img src="@/assets/csmsTimeTable/replace.png" />
            <span>去覆盖</span>
          </div>
          <div v-if='item.coverClass'
               @click="delFun(item)">
            <i class="iconfont"
               style="margin-right:12px">&#xe6e1;</i>
            <span>删除</span>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="!newClass.length"
         class="no-data-box">
      <img class="no-data-img"
           src="@/assets/common/nullData.svg"
           alt="图片" />
      <span class="no-data-text">暂无新行政班。</span>
    </div>
    <div v-else class="divide-class-fotter">
       <Button class="xy-btn-primary"
              v-if='!isPublished'
              shape="circle"
              @click="validation"
              :disabled="smartDivideStepsHeader.isOperation !== 0">保存</Button>
      <Button class="xy-btn-primary"
              @click="publish(true)"
              v-if='isReplaceClass&&!isPublished'
              shape="circle"
              :disabled="smartDivideStepsHeader.isOperation !== 0">发布方案</Button>
      <!-- <Button class="xy-btn-primary"
              @click="validation()"
              v-if='!isPublished'
              shape="circle">发布方案</Button> -->
      <Button class="xy-btn-primary"
              @click="publish(false)"
               v-if='isPublished'
              shape="circle">取消发布</Button>
    </div>
    <modal v-model="coverModal"
           width=550
           :transfer="false"
           :title="isHaveNewClass?'提示':'选择要覆盖的班级'"
           :mask-closable="false">
      <ul class="modal-section-ul"
          v-if='oldClass.length>0'>
        <template v-for="(item,sdIndex) in oldClass">
          <li :key="sdIndex"
              v-show='!item.isHide'
              :class="activeCoverId===item.id?'section-active':''"
              @click="selectCoverClass(item)">{{item.name}}
            <div :class="activeCoverId===item.id?'active-bg sanjiao':'sanjiao'"><i class="iconfont">&#xe6a1;</i></div>
          </li>
        </template>

      </ul>
      <div v-if='isHaveNewClass'
           class="no-data-modal">
        <p class="no-class">
          无可替换班级，{{this.curClassInfo.name}}将创建为新班级。
        </p>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                size="large"
                @click="coverModal=false">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                size="large"
                @click="sureCover">确定</Button>
      </div>
    </modal>
  </div>
</template>

<script>
  import GradeImg from '@/pages/evaluate/views/dailyRoutine/imgs/grade.png'
  export default {
    data () {
      return {
        GradeImg: GradeImg,
        isReplaceClass: false, // 检测所有的新行政班是否替换完成
        curClassInfo: {}, // 当前点击的新行政班
        isPublished: false, // 是否发布
        coverModal: false,
        activeCoverId: null,
        newClass: [],
        oldClass: [],
        smartDivideStepsHeader: {}
      }
    },
    computed: {
      isHaveNewClass () {
        let status = this.oldClass.every(item => item.isHide)
        return status
      }
    },
    created () {
      this.smartDivideStepsHeader = this.$parent
      this.getIsPublish()
      this.GetPublishCollectionInfo()
    },
    methods: {
      async getIsPublish () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetPublishInfo`, {
          divideClassID: this.smartDivideStepsHeader.divideClassID
        })
        if (res.success) {
          this.isPublished = res.data.length ? res.data[0].IsPublished : false
          // this.isReplaceClass = res.data.length ? res.data[0].IsReplaceClass : false
        }
      // this.xy.unloading()
      },
      // 发布方案获取新旧班级信息
      async GetPublishCollectionInfo () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetPublishCollectionInfo`, {
          divideClassID: this.smartDivideStepsHeader.divideClassID
        })
        if (res.success) {
          if (res.data.NewStudentOrganization.length > 0) {
            this.newClass = res.data.NewStudentOrganization.map(item => {
              item = {
                id: item.StudentOrganizationID,
                name: item.StudentOrganizationName,
                coverClass: '',
                oldID: '',
                isCheckPass: true
              }
              return item
            // this.$set(item, 'id', item.StudentOrganizationID)
            })
          }
          if (res.data.OldStudentOrganization.length > 0) {
            this.oldClass = res.data.OldStudentOrganization.map(item => {
              item = {
                id: item.StudentOrganizationID,
                name: item.StudentOrganizationName,
                isHide: false
              }
              return item
            })
          }
        }
        this.xy.unloading()
      },
      cover (val) {
        this.coverModal = true
        this.activeCoverId = null
        this.curClassInfo = val
      },
      selectCoverClass (item) {
        this.activeCoverId = item.id
      },
      sureCover () {
        if (!this.activeCoverId && !this.isHaveNewClass) {
          return this.xy.msgError('请勾选要覆盖的原行政班。')
        }
        this.newClass = this.newClass.map(item => {
          if (item.id === this.curClassInfo.id) {
            if (!this.isHaveNewClass) { // 原行政班已经被替换完
              this.oldClass = this.oldClass.map(citem => {
                if (citem.id === this.activeCoverId) {
                  citem.isHide = true
                  item.coverClass = citem.name
                  item.oldID = citem.id
                }
                return citem
              })
            } else {
              item.coverClass = '新'
              item.oldID = -item.id
            }
          }
          return item
        })
        // console.log(this.newClass, this.oldClass)
        this.coverModal = false
      },
      delFun (val) {
        this.$Modal.confirm({
          title: '确认提示',
          content: '确定要删除已选择的班级吗？',
          onOk: () => {
            this.newClass = this.newClass.map(item => {
              if (item.id === val.id) {
                if (val.oldID < 0) {
                  item.coverClass = ''
                  item.oldID = ''
                } else {
                  this.oldClass = this.oldClass.map(citem => {
                    if (citem.id === val.oldID) {
                      citem.isHide = false
                      item.coverClass = ''
                      item.oldID = ''
                    }
                    return citem
                  })
                }
              }
              return item
            })
          // console.log(this.newClass, this.oldClass)
          }
        })
      },
      validation () {
        let status = false
        for (let item of this.newClass) {
          if (!item.oldID) {
            status = true
          }
          item.isCheckPass = item.oldID
        }
        if (status) {
          return this.xy.msgError('有班级未被替换。')
        }
        this.$Modal.confirm({
          title: '确定替换原行政班吗?',
          content: '替换后原行政班数据将会被覆盖。',
          onOk: () => {
            this.ReplaceStudentOrganization()
          }
        })
      },
      async ReplaceStudentOrganization () {
        let ids = []
        this.newClass.map(item => {
          ids.push({
            'OldID': item.oldID > 0 ? item.oldID : 0,
            'NewID': item.id
          })
        })
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/ReplaceStudentOrganization`, {
          DivideClassID: this.smartDivideStepsHeader.divideClassID,
          ReplaceInfos: ids
        })
        if (res.success) {
          this.isReplaceClass = true
          this.xy.msgSuc('班级替换成功。')
          this.GetPublishCollectionInfo()
          // this.publish(true)
        }
        this.xy.unloading()
      },

      async publish (val) {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/PublicDivideClass`, {
          divideClassID: this.smartDivideStepsHeader.divideClassID,
          isPublished: val
        })
        if (res.success) {
          this.xy.msgSuc(`${val ? '发布' : '取消发布'}成功。`)
          this.isPublished = val
          this.smartDivideStepsHeader.getGeneralFlows()
        }
        this.xy.unloading()
      }

    }

  }
</script>
<style lang='less' scoped>
.tip-alert {
  // height:40px;
  // line-height: 20px;
  color: rgba(0, 0, 0, 0.65);
}
.publish-ul {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 40px;
  .publish-li {
    width: 290px;
    border: 1px solid #e9e9e9;
    border-radius: 2px;
    margin: 5px 10px 5px 0;
    .li-header {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 20px;
      height: 120px;
      .left-crile {
        width: 48px;
        min-width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-right: 14px;
        text-align: center;
        line-height: 46px;
      }
      .bg-ye {
        background: #ffbf00;
      }
      .bg-gr {
        background: #56d36c;
      }
      .right-name {
        font-weight: bold;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
      }
      .err-right-name {
        color: red !important;
      }
    }
    .li-bottom {
      height: 48px;
      line-height: 48px;
      background: #f7f9fa;
      border-top: 1px solid #e9e9e9;
      text-align: center;
      color: rgba(0, 0, 0, 0.45);
      cursor: pointer;
      img {
        margin-right: 12px;
      }
    }
  }
}
/deep/.ivu-modal-body {
  max-height: 500px;
  overflow-y: auto;
}
.modal-section-ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.modal-section-ul li {
  cursor: pointer;
  min-width: 112px;
  height: 40px;
  line-height: 40px;
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 4px;
  color: #333333;
  position: relative;
  margin: 10px;
  text-align: center;
  padding: 0 10px;
}
// .modal-section-ul li:hover {
//   border: 1px solid #1677ff;
//   border-radius: 4px;
//   color: #1677ff;
//   transition: all 0.3s;
//   .sanjiao {
//     border-color: transparent #1677ff #1677ff transparent !important;
//   }
// }
.modal-section-ul .section-active {
  border: 1px solid #1677ff;
  color: #1677ff;
}
.sanjiao {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0;
  height: 0;
  border-color: transparent transparent transparent transparent;
  border-width: 12px;
  border-style: solid;
  i {
    position: absolute;
    right: -12px;
    bottom: -26px;
    color: #fff;
    font-size: 12px;
  }
}
.active-bg {
  border-color: transparent #1677ff #1677ff transparent !important;
}
.divide-class-fotter {
  height: 50px;
  position: fixed;
  line-height: 50px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 4px 0px rgba(163, 173, 186, 0.4);
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
}
.exchange {
  margin: -4px 5px 0 5px;
}
.no-data-modal {
  display: flex;
  flex-direction: column;
  padding: 17px;
  .no-class {
    font-size: 16px;
    margin-top: 20px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
  }
}
</style>
