<!-- 5.优化分班 -->
<template>
  <div id="StepsHeader">
    <div class="class-result">
      <!-- 顶部条件 -->
      <div class="whole-set">
        <div class="whole-student">
          <h3>全部学生</h3>
          <div>
            <Button class="mr-10" @click="loadComplete(0)">精细优化</Button>
            <Button class="mr-10" @click="loadComplete(1)">走班统计</Button>
            <Button class="mr-10" @click="loadComplete(2)">班级统计</Button>
            <Button class="mr-10" @click="loadComplete(3)">班级名单</Button>
          </div>
        </div>
        <div class="divide-cell">
          <div class="cell-left">走班学生：</div>
          <ul class="cell-right">
            <li class="cell-right-li"
                v-for="(item,index) in classResult.DisciplineInfo"
                :key='index'>
              <span>{{item.ObjName}} </span>
              <span>{{item.PersonNumber}}人</span>
              <span>(选考{{item.SelectDiscipline}}人 学考{{item.AcademicDiscipline}}人)</span>
            </li>
          </ul>
        </div>
        <div class="divide-cell">
          <div class="cell-left">分班数量：</div>
          <ul class="cell-right">
            <li class="cell-right-li"
                v-for="(item,index) in classResult.AllClassInfo"
                :key='index'>
              <span>{{item.ObjName}}</span>
              <span>{{item.PersonNumber}}个</span>
            </li>
          </ul>
        </div>
        <!-- 有未分区学生时展示 -->
        <div class="divide-cell" v-if="classResult.GetDivideClassCollectionInfo > 0">
          <div class="cell-left">未分区学生：</div>
          <div class="cell-right">{{classResult.GetDivideClassCollectionInfo}}人</div>
        </div>
      </div>
      <!-- 分区 -->
      <div class="zone">
        <!-- 默认展示第一个分区，其他分区收起 -->
        <div v-for="(curDivideArea, zIndex) in allArea" :key='zIndex' class="zone-con pr" :class="curDivideArea.isDowm?'':'isUpStatus'">
          <div class="posi-down pa" @click="checkedDownUp(zIndex)">
              {{curDivideArea.isDowm?'收起':'展开'}}
              <Icon :class="!curDivideArea.isDowm?'arrow_rotate':''" type="ios-arrow-up" />
          </div>
          <!-- 分区信息 -->
          <div class="zone-info">
            <p class="num">{{curDivideArea.AreaName}}（{{curDivideArea.PersonNumber}}人）</p>
            <div class="divide-cell">
              <div class="cell-left">走班学生：</div>
              <ul class="cell-right">
                <li class="cell-right-li"
                    v-for="(item,index) in curDivideArea.StuInfo"
                    :key='index'>
                  <span>{{item.ObjName}} </span>
                  <span>{{item.PersonNumber}}人</span>
                  <span>(选考{{item.SelectDiscipline}}人 学考{{item.AcademicDiscipline}}人)</span>
                </li>
              </ul>
            </div>
            <div class="divide-cell">
              <div class="cell-left">分班数量：</div>
              <ul class="cell-right">
                <li class="cell-right-li"
                    v-for="(item,index) in curDivideArea.ConfirmClassInfo"
                    :key='index'>
                  <span>{{item.ObjName}}</span>
                  <span>{{item.PersonNumber}}个</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- 分区 班列表 -->
          <ul class="zone-class-ul">
            <li class="zone-class-li"
                v-for="(item, index) in curDivideArea.AreasGenerateCollectionInfo"
                :key='index'>
              <div class="zone-class-li-herder">
                <div class="z-top">
                  <div class="card-top">
                    <img src="@/assets/csmsTimeTable/smartDivideClass1.png" />
                    <span class="name col0-85" :title="item.DivideClassGenerateCollectionName">{{ item.DivideClassGenerateCollectionName.length>6?item.DivideClassGenerateCollectionName.substr(0,6)+'...':item.DivideClassGenerateCollectionName }}</span>
                    <span class="num col0-45">{{item.PersonNumber}}人</span>
                  </div>
                  <div class="card-right">
                    <span class="col0-45">定{{item.ConfirmNumber}}</span>
                    <span class="col0-45" v-if="item.IsBeforehand" style="margin:0 5px;">|</span>
                    <span class="col0-45" v-if="item.IsBeforehand">预分</span>
                  </div>
                </div>
                <div v-if="item.SelectDiscipline.length>0" class="z-middle col0-45">
                  <span> 选考:</span>
                  <span v-for="(select,sIndex) in item.SelectDiscipline" :key='sIndex'>
                    {{select.DisciplineName}}
                    <span v-if="(sIndex+1)<item.SelectDiscipline.length">/</span>
                  </span>
                </div>
                <div v-if="item.AcademicDiscipline.length>0" class="z-bottom col0-45">
                  <span> 学考:</span>
                  <span v-for="(academic,aIndex) in item.AcademicDiscipline" :key='aIndex'>
                    {{academic.DisciplineName}}
                    <span v-if="(aIndex+1)<item.AcademicDiscipline.length">/</span>
                  </span>
                </div>
              </div>
              <div class="class-li-fotter">
                <div class="li-fotter-btn"
                    @click="adjustStudent(item)">
                  <Icon type="ios-list" size="18" color="#000"></Icon>
                  <span>调整学生</span>
                </div>
                <div class="li-fotter-btn"
                    :class="smartDivideStepsHeader.isOperation !== 0?'disabled-color':''"
                    @click="editName(curDivideArea, item)"
                    style="border-left:1px solid #E8E8E8;border-right:1px solid #E8E8E8;">
                  <Icon type="md-create"></Icon>
                  <span>编辑</span>
                </div>
                <div class="li-fotter-btn"
                    :class="smartDivideStepsHeader.isOperation !== 0?'disabled-color':''"
                    @click="del(curDivideArea, item)">
                  <Icon type="ios-trash-outline" size="18"></Icon>
                  <span>删除</span>
                </div>
              </div>
            </li>
            <li class="zone-class-li text-center"
                v-if='smartDivideStepsHeader.isOperation == 0'
                style="line-height:184px; cursor:pointer"
                @click="creatClass(curDivideArea)">
              <Icon type="ios-add"
                    size="20"></Icon>
              <span style="font-size:16px;color:rgba(0,0,0,0.45);">创建班级</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 创建班级 -->
      <modal v-model="creatClassModal"
            :transfer="false"
            title="创建班级"
            :mask-closable="false"
            @on-visible-change="cancelHandle"
            width="500">
        <div style="padding:10px 0 0;">
          <Form label-position="right" :label-width="106">
            <FormItem label="班级名称：" class='add-name' label-for='addName' style="margin-bottom:16px;">
              <i-input v-model="className" element-id='addName' clearable style="width: 300px" placeholder="请输入班级名称"></i-input>
            </FormItem>
          </Form>
          <div class="creat-modal-div">
            <span class="creat-modal-lable">选考固定科目：</span>
            <checkbox-group v-model="selectIDArr"
                            style="flex:1">
              <checkbox v-for="item in subjectData"
                        :label="item.DisciplineID"
                        class="end-crouse-checkbox"
                        :key='item.DisciplineID'>
                {{item.DisciplineName}}
              </checkbox>
            </checkbox-group>
          </div>
          <div class="creat-modal-div">
            <span class="creat-modal-lable">学考固定科目：</span>
            <checkbox-group v-model="academicIDArr"
                            style="flex:1">
              <checkbox v-for="item in subjectData"
                        :label="item.DisciplineID"
                        class="end-crouse-checkbox"
                        :key='item.DisciplineID'>
                {{item.DisciplineName}}
              </checkbox>
            </checkbox-group>
          </div>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close"
                  @click="creatClassCancel">取消</Button>
          <Button class="xy-modal-primary"
                  shape="circle"
                  @click="creatClassSubmit">确定</Button>
        </div>
      </modal>
      <!-- 编辑班名 -->
      <modal v-model="editNameModal"
          :transfer="false"
          title="编辑班名"
          :mask-closable="false"
          width="550">
        <Form label-position="left" :label-width="80">
          <FormItem label="班级名称:" label-for='editName' style="margin-bottom:16px;">
            <i-input v-model="editObj.DivideClassGenerateCollectionName" clearable element-id='editName' style="width: 350px" placeholder="请输入班级名称"></i-input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button class="xy-modal-close" @click="editNameModal = false">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="editNameSubmit">确定</Button>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ClassResult',
    components: {},
    data () {
      return {
        selectNum: '',
        classResult: {},
        allArea: [], // 分区数据
        curDivideArea: {},
        curDivideAreaID: 0,
        // 创建班级
        creatClassModal: false,
        className: '',
        subjectData: [],
        academicIDArr: [],
        selectIDArr: [],
        // 编辑班名
        editNameModal: false,
        editObj: '',
        smartDivideStepsHeader: {}
      }
    },
    created () {
      this.smartDivideStepsHeader = this.$parent
      if (!this.smartDivideStepsHeader.isShowHeader) {
        this.smartDivideStepsHeader.isShowHeader = true
      }
      this.getCollectionInfo()
    },
    methods: {
      async getCollectionInfo () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetDivideClassCollectionInfo`, {
          divideClassID: this.smartDivideStepsHeader.divideClassID
        }, true)
        if (res.success) {
          this.classResult = res.data
          if (this.classResult.AreaData.length > 0) {
            this.allArea = this.classResult.AreaData
            this.allArea.map((item, index) => {
              if (index === 0) {
                this.$set(item, 'isDowm', true)
              } else {
                this.$set(item, 'isDowm', false)
              }
            })
          }
        } else {
          this.xy.msgError(res.msg)
        };
        this.xy.unloading()
      },
      // 展开收起
      checkedDownUp (index) {
        this.allArea[index].isDowm = !this.allArea[index].isDowm
      },

      // 创建班级
      async creatClass (curDivideArea) {
        this.curDivideAreaID = curDivideArea.DivideAreaID
        if (this.smartDivideStepsHeader.isOperation !== 0) {
          return false
        }
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetCourseplan/?id=${this.smartDivideStepsHeader.divideClassID}`)
        if (res.success) {
          let resData = res.data
          this.subjectData = []
          for (let i = 0; i < resData.length; i++) {
            if (resData[i].IsSelection) {
              this.subjectData.push(resData[i])
            }
          }
          this.creatClassModal = true
        }
        this.xy.unloading()
      },

      async creatClassSubmit () {
        if (!this.className) {
          this.xy.msgError('班级名称不能为空。')
          return false
        }
        if (this.className.length > 15) {
          this.xy.msgError('班级名称限制15个字符。')
          return false
        } else if (this.selectIDArr.length > 3) {
          this.xy.msgError('选考固定科目最多只能勾选3科。')
          return false
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/CreateDivideClassGenerateCollection`, {
          DivideClassID: this.smartDivideStepsHeader.divideClassID,
          DivideAreaID: this.curDivideAreaID,
          Name: this.className,
          academic: this.academicIDArr,
          select: this.selectIDArr
        })
        if (res.success) {
          this.xy.msgSuc('创建成功。')
          this.creatClassModal = false
          this.resetCreatClass()
          this.getCollectionInfo()
        } else {
          this.xy.unloading()
        };
      },
      creatClassCancel () {
        this.resetCreatClass()
        this.creatClassModal = false
      },
      cancelHandle () {
        if (!this.creatClassModal) {
          this.resetCreatClass()
        }
      },
      resetCreatClass () {
        this.className = ''
        this.selectIDArr = []
        this.academicIDArr = []
      },

      // 删除班级
      del (curDivideArea, val) {
        this.curDivideAreaID = curDivideArea.DivideAreaID
        if (this.smartDivideStepsHeader.isOperation !== 0) {
          return false
        }
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除"' + val.DivideClassGenerateCollectionName + '"吗？',
          onOk: () => {
            this.delSub(val)
          }
        })
      },
      async delSub (val) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/DeleteDivideClassGenerateCollectionName`, {
          DivideClassID: this.smartDivideStepsHeader.divideClassID,
          DivideAreaID: this.curDivideAreaID,
          DivideClassGenerateCollectionID: val.DivideClassGenerateCollectionID
        })
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          this.getCollectionInfo()
        }
        this.xy.unloading()
      },

      // 编辑班名
      editName (curDivideArea, val) {
        this.curDivideAreaID = curDivideArea.DivideAreaID
        if (this.smartDivideStepsHeader.isOperation !== 0) {
          return false
        }
        this.editObj = JSON.parse(JSON.stringify(val))
        this.editNameModal = true
      },
      async editNameSubmit () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/EditDivideClassGenerateCollectionName`, {
          DivideClassGenerateCollectionID: this.editObj.DivideClassGenerateCollectionID,
          DivideClassID: this.smartDivideStepsHeader.divideClassID,
          DivideAreaID: this.curDivideAreaID,
          Name: this.editObj.DivideClassGenerateCollectionName
        })
        if (res.success) {
          this.xy.msgSuc('编辑成功。')
          this.editNameModal = false
          this.getCollectionInfo()
        }
        this.xy.unloading()
      },

      // 调整学生
      adjustStudent (val) {
        this.smartDivideStepsHeader.isShowHeader = false
        this.smartDivideStepsHeader.typeName = '调整学生'
        this.smartDivideStepsHeader.typeUrl = '/xyHome/smartStepsHeader/SmartClassResult'
        this.$store.commit('common/getParam', { id: val.DivideClassGenerateCollectionID })
        this.$router.push({ path: '/xyHome/smartStepsHeader/adjustSudents', query: this.$store.state.common.menuInfo })
      },

      loadComplete (type) {
        this.smartDivideStepsHeader.isShowHeader = false
        this.smartDivideStepsHeader.typeUrl = '/xyHome/smartStepsHeader/SmartClassResult'
        if (type === 0) {
          this.smartDivideStepsHeader.typeName = '精细优化'
          this.$router.push({ path: '/xyHome/smartStepsHeader/fineOptimiza', query: this.$store.state.common.menuInfo })
        }
        if (type === 1) {
          this.smartDivideStepsHeader.typeName = '班级统计'
          this.$router.push({ path: '/xyHome/smartStepsHeader/goClassStatistical', query: this.$store.state.common.menuInfo })
        }
        if (type === 2) {
          this.smartDivideStepsHeader.typeName = '班级统计'
          this.$router.push({ path: '/xyHome/smartStepsHeader/classStatistical', query: this.$store.state.common.menuInfo })
        }
        if (type === 3) {
          this.smartDivideStepsHeader.typeName = '班级名单'
          this.$router.push({ path: '/xyHome/smartStepsHeader/classList', query: this.$store.state.common.menuInfo })
        }
      }
    }

  }
</script>
<style lang='less' scoped>
.add-name {
  /deep/.ivu-form-item-label {
    padding-right: 0;
    margin-right: 10px;
  }
}
.whole-set {
  background: #fff;
  padding-bottom: 18px;
}

.whole-student {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 32px;
  border-bottom: 1px solid #e9e9e9;
  margin-bottom: 16px;
}
.whole-student h3 {
  font-size: 16px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
}
.divide-cell {
  padding: 8px 0;
  display: flex;
}
.cell-left {
  width: 110px;
  text-align: right;
  color:#666;
  display: inline-block;
}
.cell-right {
  flex: 1;
  margin-left: 12px;
}

.cell-right-li {
  display: inline-block;
  color: #333;
  margin-right: 24px;
  margin-bottom: 10px;
}

.zone-con {
  overflow: hidden;
  max-height: 1000px;
  transition: all .3s ease-in-out;
}
.zone-con.isUpStatus {
  max-height: 135px;
  overflow: hidden;
  margin-bottom: 20px;
  transition: all .3s ease-in-out;
}
.posi-down {
  right: 29px;
  top: 26px;
  color: #1890FF;
  cursor: pointer;
}
.posi-down > i{
  color: #1890FF;
  transition: all .3s ease-in-out;
}
.posi-down > i.arrow_rotate {
  transform: rotate(180deg);
  transition: all .3s ease-in-out;
}

.zone {
  margin-top: 20px;
  padding-bottom: 30px;
  background: #fff;
  min-height: 400px;
}

.zone-li {
  display: inline-block;
  text-align: center;
  width: 88px;
  height: 40px;
  line-height: 40px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px 4px 0px 0px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  margin-left: 1px;
  cursor: pointer;
}

.zone-li:first-child {
  margin-left: 0;
}

.zone-info {
  background: #fff;
  padding: 25px 0 0;
}
.zone-info .num{
  color: #333;
  font-weight: 700;
  margin: 0 0 16px 29px;
}
.pre-divide {
  display: flex;
}

.pre-divide-ul {
  width: calc(100% - 60px);
}

.pre-divide-ul-li {
  margin-left: 10px;
  display: inline-block;
  margin-bottom: 8px;
}

.pre-divide-type {
  width: 60px;
  text-align: right;
  color: rgba(0, 0, 0, 0.85);
}

.li-subject {
  padding: 2px 6px;
  background: rgba(245, 245, 245, 1);
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
  font-size: 12px;
}

.li-divide-btn {
  color: #4196ff;
  margin-left: 6px;
  font-size: 12px;
  cursor: pointer;
}

.zone-class-ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 10px 0 20px 30px;
}

.zone-class-li {
  width: 316px;
  height: 184px;
  border-radius: 2px;
  border: 1px solid rgba(233, 233, 233, 1);
  margin: 0 16px 16px 0;
  position: relative;
}
.disabled-color {
  color: #c5c8ce;
  cursor: default !important;
}

.class-li-fotter {
  position: absolute;
  bottom: 0;
  height: 48px;
  width: 100%;
  background: #f7f9fa;
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.45);
}

.li-fotter-btn {
  width: 50%;
  text-align: center;
  cursor: pointer;
}

.divide-class-fotter {
  height: 56px;
  line-height: 56px;
  text-align: right;
  padding: 0 51px;
  background: #fff;
}

.end-crouse-checkbox {
  width: 68px;
  margin-bottom: 10px;
  color: #333;
}
.zone-class-li-herder {
  height: 136px;
  padding: 20px 18px 20px 20px;
}
.z-top{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom: 17px;
}
.card-top img{
  width:24px;
  height:24px;
}
.card-top .name{
  font-weight:700;
  font-size:16px;
  margin: 0 10px 0 15px;
}
.card-top .num{
}
.z-middle{
  margin:0 0 7px 40px
}
.z-bottom{
  margin:0 0 0 40px
}
.creat-modal-div {
  margin-bottom: 5px;
  display: flex;
  justify-content: flex-start;
}
.creat-modal-lable {
  width: 106px;
  margin-right: 10px;
  text-align: right;
  display: inline-block;
  color: #666;
}
</style>
