<!-- 5.排课规则-设置教师和教室 -->
<template>
  <div  style="height: 100%;">
      <div class="clearfix"  style="height: 100%;">
          <div class="left-data fl">
              <div v-for="(lesson,index) in lessonData" :key="index" style="margin-bottom:4px;">
                  <h2 style="font-size:16px;margin-bottom:4px;" v-cloak>{{lesson.Name}}</h2>
                  <Radio style="display:block;margin-bottom:4px;font-size:14px;"
                          v-model="item.isSelect"
                          v-for="(item,cIndex) in lesson.Childrens"
                          :key="cIndex"
                          @on-change="lessonChange(item)"
                          v-cloak>{{item.CollectionName}}</Radio>
              </div>
          </div>
          <div class="right-data fl">
              <div class="text-right" style="margin-bottom:10px;">
                  <Button class="xy-info" type="info"
                            :disabled="StepsHeader.isOperation != 0?true:isDisabled"
                            @click="goSelectTeacher(true,'',)">统一设置教师</Button>
                  <Button class="xy-info" type="info"
                           :disabled="StepsHeader.isOperation != 0?true:isDisabled"
                            @click="unifiedSetHouse('','统一设置教室')">统一设置教室</Button>
              </div>
              <table class="teacher-table">
                  <thead>
                      <tr>
                          <th width="20%">课时</th>
                          <th width="40%">设置教师</th>
                          <th width="40%">设置教室</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(item,index) in tableData" :key="index">
                          <td v-cloak>第{{index+1}}课时</td>
                          <td v-cloak>
                              {{item.TeacherName}}
                              <Icon type="md-create" color="#2d8cf0" size="20" @click="goSelectTeacher(false,item,)" v-if="StepsHeader.isOperation == 0" />
                          </td>
                          <td v-cloak>
                              {{item.HouseName}}
                              <Icon type="md-create" color="#2d8cf0" size="20" @click="unifiedSetHouse(item,'设置教室')" v-if="StepsHeader.isOperation == 0" />
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>

      <!-- 统一设置教师 -->
      <SelectTeacherOrg
          :isShow="isShow"
          :selectMembers="[...selectedTeachers]"
          @select-cancel="selectCancel"
          @select-confirm="selectConfirm">
      </SelectTeacherOrg>
      <!-- 统一设置教室 -->
        <RadioSelectClass :isShow="modalSetHouse"
                      modalTitle="设置教室"
                      :classTableID="parseInt(classPlan.classTableID)"
                      :selectMembers="[...selectedClass]"
                      @select-cancel="canacleModalSetHouse"
                      @select-confirm="submitModalSetHouse">
    </RadioSelectClass>
      <!-- <Modal v-model="modalSetHouse"
              v-if="StepsHeader.isOperation == 0"
              width="564"
              :transfer="false">
          <p slot="header">{{classTitle}}</p>
          <div style="font-size:14px;">
              <Form>
                  <FormItem label="楼宇">
                      <Select v-model="unifiedBuildingID"
                                @on-change="unifiedBuildingChange"
                                class="fl xy-content-title-search"
                                placeholder="请选择楼宇"
                                style="margin-left:0">
                          <Option :value="0">请选择楼宇</Option>
                          <Option v-for="item in buildingData" :key="item.BuildingID" :value="item.BuildingID" v-cloak>{{item.BuildingName}}</Option>
                      </Select>
                  </FormItem >
                  <FormItem  label="场室">
                      <Select v-model="unifiedHouseID"
                                :disabled="unifiedHouseDisable"
                                class="fl xy-content-title-search"
                                placeholder="请选择场室"
                                style="margin-left:0">
                          <Option :value="0">请选择场室</Option>
                          <Option v-for="item in unifiedHouseData" :key="item.HouseID" :value="item.HouseID" v-cloak>{{item.HouseName }}</Option>
                      </Select>
                  </FormItem >
              </Form >
          </div>
          <div slot="footer">
              <Button class="xy-modal-close" @click="canacleModalSetHouse">取消</Button>
              <Button class="xy-modal-primary" shape="circle" @click="submitModalSetHouse">确定</Button>
          </div>
      </Modal> -->
  </div>
</template>

<script>
  import SelectTeacherOrg from '@/pages/csmsTimeTable/components/selectTeacher/CheckboxSelectTeacher.vue'
  import RadioSelectClass from '@/pages/csmsTimeTable/components/selectClasses/RadioSelectClasses.vue'
  // import SelectTeacherOrg from '@/components/selectTeacherOrg/SelectTeacherOrg.vue'
  export default {
    components: {
      SelectTeacherOrg,
      RadioSelectClass
    },
    data () {
      return {
        StepsHeader: {},
        classPlan: {},
        isShow: false,
        selectedTeachers: [],
        tableData: [],
        isRequiredSelect: false,
        // 集中设置教室
        classTitle: '设置教室',
        selectedClass: [],
        buildingData: [],
        unifiedBuildingID: 0,
        unifiedHouseID: 0,
        unifiedHouseData: [],
        modalSetHouse: false,
        unifiedHouseDisable: true,
        oneHouse: '',
        // 左侧
        lessonData: [],
        isDisabled: true,
        single: '',
        searchName: '',
        radioAll: [],
        checkAllList: [],
        isLoadingShow: false, // modal加载动画
        attendee: [], // 听课人
        newList: [],
        teacherCountName: [],
        addtypes: '',
        disciplineList: [],
        houseList: [],
        svShow: true,
        svShowHouse: true,
        isUnifiedTeacher: true, // 是否统一设置
        selectLesson: '' // 单个添加的信息
      }
    },
    created () {
      this.StepsHeader = this.$parent.$parent
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
      this.getLessonList()
      // this.getBuildingList()
    },
    mounted () {

    },
    methods: {
      // 左侧
      getLessonList () { // 课程树
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetLessonList`, {
          classTableID: this.classPlan.classTableID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            for (let i = 0; i < resData.length; i++) {
              resData[i].Childrens.map((item) => {
                item.isSelect = false
                return item
              })
            };
            this.lessonData = resData
            this.isDisabled = true
          }
        })
      },
      lessonChange (val) { // 选中班级
        for (let i = 0; i < this.lessonData.length; i++) {
          this.lessonData[i].Childrens.map((item) => {
            item.isSelect = false
            return item
          })
        };
        val.isSelect = true
        this.isDisabled = false
        this.getLessonInfo(val.CoursePlanID)
      },
      getLessonInfo (CoursePlanID) { // 获取教师教室数据
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetLessonInfo`, {
          classTableID: this.classPlan.classTableID,
          coursePlanID: CoursePlanID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.tableData = []
            this.tableData = res.data
          }
        })
      },

      // 设置教室   start
      unifiedSetHouse (val, titleType) {
        if (this.StepsHeader.isOperation === 0) {
          this.unifiedHouseDisable = true
          this.classTitle = titleType
          this.selectedClass = !val ? [] : [{ id: val.HouseID }]
          this.oneHouse = val || ''
          this.modalSetHouse = true
          // if (val !== '') { // 单个设置教室
          //   this. = val
          //   this.unifiedBuildingID = val.BuildingID
          //   if (val.BuildingID !== 0) { // 修改教室
          //     this.xy.loading()
          //     this.xy.get(`${this.$store.state.apiPath}/api/GetHouseList`, {
          //       buildingID: this.unifiedBuildingID,
          //       type: '1'
          //     }).then(res => {
          //       this.xy.unloading()
          //       if (res.success) {
          //         this.unifiedHouseData = res.data
          //         if (this.unifiedHouseData.length > 0) {
          //           this.unifiedHouseID = val.HouseID
          //           this.unifiedHouseDisable = false
          //         }
          //       }
          //     })
          //   };
          //   this.modalSetHouse = true
          // } else { // 统一设置教室
          //   this.unifiedHouseData = []
          //   this.unifiedBuildingID = 0
          //   this.unifiedHouseID = 0
          //   this.unifiedHouseDisable = true
          //   this.modalSetHouse = true
          // }
        }
      },
      // getBuildingList () { // 获取场馆
      //   this.xy.loading()
      //   this.xy.get(`${this.$store.state.apiPath}/api/ClassTable/GetBuildingListByClassId`, {
      //     classTableId: this.classPlan.classTableID
      //   }).then(res => {
      //     this.xy.unloading()
      //     if (res.success) {
      //       this.buildingData = res.data
      //     }
      //   })
      // },
      // unifiedBuildingChange () {
      //   this.unifiedHouseID = 0
      //   this.unifiedHouseData = []
      //   if (this.unifiedBuildingID > 0) {
      //     this.xy.loading()
      //     this.xy.get(`${this.$store.state.apiPath}/api/GetHouseList`, {
      //       buildingID: this.unifiedBuildingID,
      //       type: '1'
      //     }).then(res => {
      //       this.xy.unloading()
      //       if (res.success) {
      //         this.unifiedHouseData = res.data
      //         this.unifiedHouseDisable = false
      //       }
      //     })
      //   }
      // },
      canacleModalSetHouse () {
        this.oneHouse = ''
        this.modalSetHouse = false
      },
      submitModalSetHouse (data) {
        this.selectedClass = [...data]
        let postData = []
        if (this.oneHouse === '') { // 统一设置教室
          if (this.tableData.length === 0) {
            this.xy.msgError('请选择数据进行保存。')
            return false
          }
          for (let i = 0; i < this.tableData.length; i++) {
            postData.push({
              CoursePlanDetailID: this.tableData[i].CoursePlanDetailID,
              HouseID: this.selectedClass[0].id
            })
          };
        } else {
          postData.push({// 设置教室
            CoursePlanDetailID: this.oneHouse.CoursePlanDetailID,
            HouseID: this.selectedClass[0].id
          })
        }
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/EditRooms`, postData).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.modalSetHouse = false
            let obj = {}
            for (let i = 0; i < this.lessonData.length; i++) {
              for (let j = 0; j < this.lessonData[i].Childrens.length; j++) {
                if (this.lessonData[i].Childrens[j].isSelect === true) {
                  obj = this.lessonData[i].Childrens[j]
                }
              };
            };
            this.unifiedBuildingID = 0
            this.unifiedHouseID = 0
            this.oneHouse = ''
            this.getLessonInfo(obj.CoursePlanID)
          }
        })
      },
      // 设置教师
      goSelectTeacher (bl, item) {
        this.isUnifiedTeacher = bl
        this.selectLesson = item
        this.selectedTeachers = []
        // 已经添加过的老师不显示
        if (item) { // 单个设置教师
          if (item.Teachers.length > 0) {
            this.selectedTeachers = item.Teachers.map(Number)
            // item.Teachers.map(item => {
            //   this.selectedTeachers.push({
            //     id: item
            //   })
            // })
          }
        }
        this.isShow = true
      },
      selectCancel () {
        this.isShow = false
      },
      selectConfirm (data) {
        this.selectedTeachers = [...data]
        let postData = []
        let ids = []
        for (let i = 0; i < this.selectedTeachers.length; i++) {
          let newIds = this.selectedTeachers[i].id.split('/')
          let dataId = newIds[newIds.length - 1]
          ids.push(dataId)
        };
        if (this.isUnifiedTeacher) { // 统一设置
          for (let i = 0; i < this.tableData.length; i++) {
            postData.push({
              CoursePlanDetailID: this.tableData[i].CoursePlanDetailID,
              Teachers: ids
            })
          };
        } else {
          postData.push({
            CoursePlanDetailID: this.selectLesson.CoursePlanDetailID,
            Teachers: ids
          })
        }
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/EditTeachers`, postData).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            let obj = {}
            for (let i = 0; i < this.lessonData.length; i++) {
              for (let j = 0; j < this.lessonData[i].Childrens.length; j++) {
                if (this.lessonData[i].Childrens[j].isSelect === true) {
                  obj = this.lessonData[i].Childrens[j]
                }
              };
            };
            this.isUnifiedTeacher = true
            this.selectLesson = ''
            this.isShow = false
            this.getLessonInfo(obj.CoursePlanID)
          }
        })
      }
    }

  }
</script>
<style lang='less' scoped>
@import '../../css/arrangingRules.less';
.teacher-table{
    cursor: pointer;
    margin: 0 auto;
    border-collapse: collapse;
    font-size: 14px;
    width: 100%;
    text-align: center;
    tr{
      border-bottom: 1px solid #E8E8E8;
      height: 54px;
      th{
        background:rgba(250,250,250,1);
        border-radius:4px 4px 0px 0px;
        font-weight:bold;
        color:rgba(0,0,0,1);
        opacity:0.85;
      }
      td{
        color:rgba(0,0,0,1);
        opacity:0.65;
      }
      td:first-child{
        letter-spacing: 3px
      }
    }
}
</style>
