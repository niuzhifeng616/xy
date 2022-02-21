<template>
  <div class="administrative-class">
    <div class="xy-content-body" style="padding:20px 0 0;">
      <div>
        <Form>
            <FormItem label="校区:" :label-width='93' >
                  <Select  v-model="formValidateOK.school"
                            @on-change="schoolChange"
                            :placeholder="'请选择校区'"
                            style="width:300px">
                      <Option v-for="school in schoolData" :value="school.value" :key="school.label" v-cloak>{{ school.label }}</Option>
                  </Select>
              </FormItem>
              <FormItem label="学年学期:" :label-width='120' >
                  <cascader :data="yearSessionData"
                            style="width:300px"
                            v-model="formValidateOK.session"
                            @on-change="cascaderChange" placeholder="">
                  </cascader>
              </FormItem>
        </Form>
      </div>
      <div class="m-l-40 container-top" v-if="leftData.length!==0">
        <span style="width:80px;text-align: center;">班级名称:</span>
        <div class="calssName">
          <span style="cursor: pointer;" v-for="(item,index) in leftData" :key="index"
            :class="GroupType === item.GroupType&&CoursePlanAID===item.CoursePlanAID&&CoursePlanAIDType===item.CoursePlanAIDType?'active':''"
            @click="chooseItem(item,index)">
            {{item.CoursePlanTableFullName}}
          </span>
          <!-- <span v-if="leftData.length===0">暂无数据</span> -->
        </div>
      </div>
      <!-- <div class="container-center" v-if="leftData.length!==0&&nameList.length===0" style="padding-left:40px;text-align: center;color:#999;">
         <img src="./imgs/zw2.png" alt="" style="width:20%">
         <p>暂无未分组学生~</p>
      </div> -->
      <div class="container-center" v-if="nameList.length!==0" style="padding-left:40px;">
          <Button v-if="nameList.length!==0" type="primary" @click="creat">创建小组</Button>
          <span v-if="nameList.length!==0"> 未分组: <span>{{nameList.length>0?nameList.length:0}}</span>人  <span style="
          color:#999;float: right;margin-right: 50px;">*所有学生必须全部分组才可进行评价操作。</span> </span>
          <div style="cursor: pointer;" class="xy-flex xy-center">
            <div class="name-list" :class="isHeight?'more-height':''">
              <div v-for="(item,index) in nameList" :key="item.UserID" @click="clickPerson(index,item)">
                <div style="position: relative;">
                  <div class="tx" >
                    <div v-if="!item.Icon" :class="`head-con ${item.Sex === false ? 'woman' : 'man'}`">
                      <span class="head-font">
                        {{ xy.showName(item.FullName)}}
                      </span>
                    </div>
                    <img v-else style="width: 100%;height: 100%;" :src="item.Icon">
                  </div>
                  <img style="width:24px;height:24px;position: absolute;bottom: -7px;right: -11px;" v-if="item.isCheck" src="./imgs/choose.png" alt="">
                  <img style="width:24px;height:24px;position: absolute;bottom: -7px;right: -11px;"  v-else src="./imgs/none.png" alt="">
                </div>
                <p class="name">
                    <Tooltip :content="item.FullName">
                      {{item.FullName}}
                    </Tooltip>
                  </p>
              </div>
            </div>
            <span  class="more" @click="getMore">
              <span v-if="!isHeight">
                <span>更多</span>
                <Icon type="ios-arrow-down" />
              </span>
              <span v-else>
                <span>收起</span>
                <Icon type="ios-arrow-up" />
              </span>
            </span>
          </div>
      </div>
      <div style="background:#f9f9f9;height:20px;"></div>
      <div class="container-bottom">
        <div class="group"  v-for="(item) in groupList" :key="item.id">
          <div class="top">
            <p class="title"><span style="color:rgba(0,0,0,0.85);font-size:14px;">{{item.GroupName}}</span><i class="iconfont icon" style="margin-left: 15px;font-size:14px;" @click="changeTitle(item)" >&#xe6f7; </i></p>
            <i class="iconfont delete" style="cursor: pointer;" @click="deleteGroup(item)">&#xe6e1;</i>
          </div>
           <!-- 判断是行政还是教学 -->
            <p v-if="item.GroupType === 1" style="color:rgba(0,0,0,0.45);padding-left:20px">点击头像设置角色</p>
          <div class="bottom">
            <div v-if="item.ClassRoomGroupDetails.length>0" class="name-list" >
              <div class="xy-flex xy-center name-hover" v-for="item1 in item.ClassRoomGroupDetails" :key="item1.UserID" >
                <div  style="cursor: pointer;" class="tx" @click="chooseRole(item1)">
                  <div v-if="!item1.Icon" :class="`head-con ${item1.Sex === false ? 'woman' : 'man'}`">
                    <span class="head-font">
                      {{ xy.showName(item1.FullName)}}
                    </span>
                  </div>
                  <img  style="width: 100%;height: 100%;" :src="item1.Icon===''?require('@/assets/common/yrykb.png'):item1.Icon">
                </div>
                <!-- 判断是行政还是教学 -->
                <p class="name" v-if="item.GroupType === 0">{{item1.FullName}}</p>
                <p class="names" v-else style="margin-right: 5px;">
                  <span>{{item1.FullName}}</span>
                  <span>{{item1.GroupRoleName}}</span>
                </p>
                <Icon style="cursor: pointer;" type="ios-close" class="ios-close" size="24" @click="deleteStudent(item1)"/>
              </div>
            </div>
            <div v-else style="text-align: center;margin-top: 100px;color: #999;">
              暂无小组成员，请添加成员。
            </div>
          </div>
          <div class="footer" v-if="isJoin" style="cursor: pointer;" @click="joinGroup(item)">
            <Icon type="ios-add" size="24" style="vertical-align: middle;"/>
            加入小组
          </div>
        </div>
      </div>
      <div v-if="groupList.length===0" class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
        <span class="no-data-text">该搜索条件下没有结果。</span>
      </div>
    </div>
       <Modal
        v-model="addGroup"
        :title="editName?'编辑小组名称':'创建小组'"
        :transfer="false"
        :closable="true"
        :mask-closable="false"
      >
        <Form
          ref="formCreated"
          :rules="ruleCreated"
          :model="formCreated"
          :label-width="80"
          @submit.native.prevent
        >
          <FormItem label-for="name" label="小组名称" prop="name">
            <i-input element-id="name" v-model.trim="formCreated.name"></i-input>
          </FormItem>
        </Form>
        <div slot="footer" :class="editName?'':'footer-style'" >
          <Checkbox v-if="!editName" v-model="single" style="margin-left:10px">
            继续创建小组
          </Checkbox>
          <div>
            <Button class="xy-modal-close" @click="closeCreat">
              取消
            </Button>
            <Button class="xy-modal-primary" shape="circle" @click="creatType">
              确定
            </Button>
          </div>
        </div>
      </Modal>
      <!-- 教学班选择角色 -->
       <Modal
        v-model="roleModel"
        title="学生角色"
        :transfer="false"
        :closable="true"
        :mask-closable="false"
      >
      <div class="role" v-for="(item,index) in roleList" :key="index" :class="GroupRoleID === item.GroupRoleID?'role-active':''"
        @click="clickRole(item)">{{item.GroupRoleName}}</div>
        <div slot="footer" >
          <div>
            <Button class="xy-modal-close" @click="closeRole">
              取消
            </Button>
            <Button class="xy-modal-primary" shape="circle" @click="choosedRole">
              确定
            </Button>
          </div>
        </div>
      </Modal>
      <!-- 温馨提示1 -->
      <Modal
        v-model="cozy"
        title="温馨提示"
        :transfer="false"
        :closable="true"
        :mask-closable="false">
        <div>
          非走班课程，检测到班主任已进行行政班分组，
          是否沿用分组结果？
          沿用后，您可进行编辑调整操作。
        </div>
        <div slot="footer" >
          <div>
            <Button class="xy-modal-close" @click="cozy=false">
              否
            </Button>
            <Button class="xy-modal-primary" shape="circle" @click="cozyFun">
              是
            </Button>
          </div>
        </div>
      </Modal>
      <!-- 温馨提示2 -->
      <Modal
        v-model="cozy1"
        title="温馨提示"
        :transfer="false"
        :closable="true"
        :mask-closable="false">
        <div>
          非走班课程，检测到班主任暂未进行行政班分组，
          您可稍后重新查询或进行分组操作。
          分组后，不受班主任分组结果影响。
        </div>
        <div slot="footer" >
          <div>
            <Button class="xy-modal-primary" shape="circle" @click="cozy1=false">
              确定
            </Button>
          </div>
        </div>
      </Modal>
  </div>
</template>
<script>
  import $ from 'jquery'
  window.jQuery = $
  export default {
    name: 'AdministrativeClass',
    data () {
      return {
        iconUrl: '',
        editName: false,
        roleList: [],
        roleModel: false,
        isJoin: false,
        groupList: [],
        single: false,
        addGroup: false,
        selectId: [],
        selectId1: [],
        isHeight: false,
        formCreated: {
          name: ''
        },
        ruleCreated: {
          name: [
            {
              required: true,
              message: '请填写小组名称',
              trigger: 'blur'
            },
            {
              max: 10,
              message: '小组名称不能超过10个字',
              trigger: 'blur'
            }
          ]
        },
        nameList: [],
        GroupType: '',
        CoursePlanAID: '',
        CoursePlanAIDType: '',
        studentOrganizationID: '',
        formValidateOK: {
          school: '',
          session: []
        },
        schoolData: [],
        yearSessionData: [],
        leftData: [],
        cozy: false,
        cozy1: false,
        GroupID: '',
        GroupDetailID: '',
        UserID: '',
        GroupRoleID: '',
        url: ''
      }
    },
    watch: {
      single (val) {
        this.single = val
      },
      selectId (val) {
        if (val.length > 0) {
          this.isJoin = true
        } else {
          this.isJoin = false
        }
      },
      nameList: {
        handler (newVal) {
          if (parseInt($('.xy-content-body').width()) <= 1982) {
            if (newVal.length <= 21) {
              $('.more').css({ display: 'none' })
            } else {
              $('.more').css({ display: 'inline-block' })
            }
          }
          if (parseInt($('.xy-content-body').width()) <= 1470) {
            if (newVal.length <= 15) {
              $('.more').css({ display: 'none' })
            } else {
              $('.more').css({ display: 'inline-block' })
            }
          }
        },
        deep: true,
        immediate: true
      }
    },
    mounted () {
    },
    created () {
      this.iconUrl = this.$store.state.apiPath
      this.getSchool()
      this.getRole()
    },
    methods: {
      deleteGroup (item) {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '<p>是否确认删除小组，小组内成员重新分配。</p>',
          onOk: () => {
            this.xy.loading()
            this.xy.post(`${this.$store.state.apiPath}/api/ClassRoomGroup/DeleteClassRoomGroup`, {
              id: item.GroupID
            }).then(res => {
              this.xy.unloading()
              if (res.success) {
                this.roleModel = false
                this.xy.msgSuc('删除成功。')
                this.getGroupingData()
              }
            })
          },
          onCancel: () => {
            this.$Message.info('取消删除。')
          }
        })
      },
      deleteStudent (item) {
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/ClassRoomGroup/DeleteClassRoomGroupDetail`, {
          groupID: item.GroupID,
          userids: [item.UserID]
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.roleModel = false
            this.xy.msgSuc('删除成功。')
            this.getGroupingData()
          }
        })
      },
      // 加入小组
      joinGroup (item) {
        this.xy.loading()
        let userids = []
        this.selectId.forEach((ele, index) => {
          userids.push({
            UserID: ele,
            GroupRoleID: this.selectId1[index] ? this.selectId1 : 0
          })
        })
        this.xy.post(`${this.$store.state.apiPath}/api/ClassRoomGroup/CreateClassRoomGroupDetail`, {
          groupID: item.GroupID,
          userids: userids
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.roleModel = false
            this.selectId = []
            this.selectId1 = []
            this.xy.msgSuc('加入成功。')
            this.getGroupingData()
          }
        })
      },
      // 查询小组角色
      getRole () {
        this.xy.get(`${this.$store.state.apiPath}/api/ClassRoomGroup/GetClassRoomGroupRole`).then(res => {
          if (res.success) {
            let resData = res.data
            this.roleList = resData
          }
        })
      },
      // 获取行政班教学班分组信息
      getGroupingData (val) {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/ClassRoomGroup/GetClassTbaleGrouInfo`, {
          schoolDistrictID: this.formValidateOK.school,
          academicSessionID: this.formValidateOK.session[1],
          groupType: this.GroupType, // 0:行政班 1:教学班
          coursePlanAID: this.CoursePlanAID,
          studentOrganizationID: this.studentOrganizationID, // 行政班id
          coursePlanAIDType: this.CoursePlanAIDType
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            if (val === 1) { // 第一次
              if (this.GroupType === 1) {
                if (resData.IsStuOrg) {
                  if (resData.IsGroup) {
                    this.cozy = true
                  } else {
                    this.cozy1 = true
                  }
                }
              }
            }
            if (val === 2) {
              // 引用之后就关闭
              this.cozy = false
            }

            this.nameList = resData.NoGRoup
            this.groupList = resData.GroupInfo
            if (this.nameList.length > 0) {
              this.nameList.forEach(item => {
                item.isCheck = false
              })
            }
            // console.log('获取信息为分组人 ', this.groupList)
          }
        })
      },
      // 引用
      cozyFun () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/ClassRoomGroup/CopyClassTbaleGrouInfo`, {
          schoolDistrictID: this.formValidateOK.school,
          academicYearID: this.formValidateOK.session[0],
          academicSessionID: this.formValidateOK.session[1],
          studentOrganizationID: this.studentOrganizationID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.getGroupingData(2)
          }
        })
      },
      // 获取学班信息
      getClassInformation () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/ClassRoomGroup/GetAllGetTeacherClassesByAcademicSessionandSchoolID`, {
          schoolDistrictID: this.formValidateOK.school,
          academicSessionID: this.formValidateOK.session[1]
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            this.leftData = resData
            if (this.leftData.length > 0) {
              this.GroupType = this.leftData[0].GroupType
              this.CoursePlanAID = this.leftData[0].CoursePlanAID
              this.CoursePlanAIDType = this.leftData[0].CoursePlanAIDType
              this.studentOrganizationID = this.leftData[0].StudentOrganizationID
              this.getGroupingData(1)
            } else {
              this.nameList = []
              this.groupList = []
            }
          }
        })
      },
      // 修改角色取消
      closeRole () {
        this.roleModel = false
      },
      // 修改角色确定
      choosedRole () {
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/ClassRoomGroup/EditClassRoomGroupDetail`, {
          groupID: this.GroupID,
          userids: [{ GroupDetailID: this.GroupDetailID, UserID: this.UserID, GroupRoleID: this.GroupRoleID }]
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.roleModel = false
            this.xy.msgSuc('修改成功。')
            this.getGroupingData()
          }
        })
      },
      clickRole (item) {
        this.GroupRoleID = item.GroupRoleID
      },
      // 教学班选择人员
      chooseRole (item) {
        // 区分行政班和教学班
        if (this.GroupType === 0) {
          return false
        } else {
          this.GroupID = item.GroupID
          this.GroupDetailID = item.GroupDetailID
          this.UserID = item.UserID
          this.GroupRoleID = item.GroupRoleID
          this.roleModel = true
        }
      },
      // 点击人员
      clickPerson (index, item) {
        if (item.isCheck) {
          item.isCheck = false
          let index1 = this.selectId.map(element => { return element }).indexOf(item.UserID)
          let index2 = this.selectId1.map(element => { return element }).indexOf(item.GroupRoleID)
          if (index1 !== -1) {
            this.selectId.splice(index1, 1)
          }
          if (index1 !== -1) {
            this.selectId1.splice(index2, 1)
          }
        } else {
          this.selectId.push(item.UserID)
          this.selectId1.splice(item.GroupRoleID)
          item.isCheck = true
        }
        // console.log(' this.selectId', this.selectId)
        // console.log(' this.selectId1', this.selectId1)
        const isCheck = item.isCheck
        this.updateDraft(this.nameList, index, { isCheck })
      },
      // 更新视图
      updateDraft (tableData, index, field) {
        const obj = Object.assign({}, tableData[index])
        this.$set(tableData, index, {})
        for (var key in field) {
          obj[key] = field[key]
        }
        this.$set(tableData, index, obj)
      },
      changeTitle (item) {
        this.formCreated.name = item.GroupName
        this.GroupID = item.GroupID
        this.editName = true
        this.addGroup = true
      },
      creat () {
        this.selectId = []
        this.selectId1 = []
        this.addGroup = true
        this.editName = false
        this.single = false
      },
      closeCreat () {
        this.addGroup = false
        this.$refs.formCreated.resetFields()
      },
      creatType () {
        if (this.editName) {
          this.$refs.formCreated.validate((valid) => {
            if (valid) {
              // 创建得接口
              this.xy.loading()
              this.xy.post(`${this.$store.state.apiPath}/api/ClassRoomGroup/EditClassRoomGroup`, {
                model: {
                  GroupType: this.GroupType, // 0:行政班 1：教学班
                  GroupDataID: this.CoursePlanAID,
                  GroupDateType: this.CoursePlanAIDType,
                  GroupName: this.formCreated.name,
                  AcademicSessionID: this.formValidateOK.session[1],
                  AcademicYearID: this.formValidateOK.session[0],
                  SchoolDistrictID: this.formValidateOK.school,
                  GroupID: this.GroupID
                }
              }).then(res => {
                this.xy.unloading()
                if (res.success) {
                  this.xy.msgSuc('修改成功。')
                  this.addGroup = false
                  this.$refs.formCreated.resetFields()
                  this.getGroupingData()
                }
              })
            }
          })
        } else {
          this.$refs.formCreated.validate((valid) => {
            if (valid) {
              // 创建得接口
              this.xy.loading()
              this.xy.post(`${this.$store.state.apiPath}/api/ClassRoomGroup/CreateClassRoomGroup`, {
                GroupType: this.GroupType, // 0:行政班 1：教学班
                GroupDataID: this.CoursePlanAID,
                GroupDateType: this.CoursePlanAIDType,
                GroupName: this.formCreated.name,
                AcademicSessionID: this.formValidateOK.session[1],
                AcademicYearID: this.formValidateOK.session[0],
                SchoolDistrictID: this.formValidateOK.school
              }).then(res => {
                this.xy.unloading()
                if (res.success) {
                  this.xy.msgSuc('创建成功。')
                  this.$refs.formCreated.resetFields()
                  if (!this.single) {
                    this.addGroup = false
                  }
                  this.getGroupingData()
                }
              })
            }
          })
        }
      },

      // 更多
      getMore () {
        this.isHeight = !this.isHeight
      },
      // 选择班级
      chooseItem (item, index) {
        // 清空选中的人员
        this.selectId = []
        this.GroupType = item.GroupType
        this.CoursePlanAID = item.CoursePlanAID
        this.CoursePlanAIDType = item.CoursePlanAIDType
        this.studentOrganizationID = item.StudentOrganizationID
        this.getGroupingData(1)
      },
      schoolChange (value) {
        this.formValidateOK.school = value
        this.getClassInformation()
      },
      cascaderChange (value, selectedData) {
        this.formValidateOK.session = value
        this.getClassInformation()
      },
      // 获取校区
      async getSchool (resObj) {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`, null, true)
        if (res.success) {
          this.schoolData = []
          let resData = res.data
          for (const iterator of resData) {
            this.schoolData.push({
              value: iterator.SchoolDistrictID,
              label: iterator.SchoolDistrictName
            })
          }
          if (resData.length > 0) {
            this.formValidateOK.school = resData[0].SchoolDistrictID
          }
          this.getSessionNodeList()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 学年学期
      async getSessionNodeList (resObj) {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`, null, true)
        if (res.success) {
          this.yearSessionData = res.data
          this.formValidateOK.session = []
          let index = this.yearSessionData.map(function (item) {
            return item.IsCurrent
          }).indexOf(true)
          if (index !== -1) {
            this.formValidateOK.session.push(this.yearSessionData[index].value)
            let index1 = this.yearSessionData[index].children.map(function (item) {
              return item.IsCurrent
            }).indexOf(true)
            if (index1 !== -1) {
              this.formValidateOK.session.push(this.yearSessionData[index].children[index1].value)
            }
          } else {
            for (let i = 0; i < this.yearSessionData.length; i++) {
              if (this.yearSessionData[i].children.length > 0) {
                this.formValidateOK.session = [this.yearSessionData[i].value, this.yearSessionData[i].children[0].value]
                return false
              }
            }
          }
          this.getClassInformation()
        } else {
          this.xy.msgError(res.msg)
        }
      }

    }
  }
</script>
<style lang="less" scoped>
.head-con{
  display: inline-block;
  vertical-align: middle;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #4196FF;
  text-align: center;
  font-size: 12px;
}
.head-con.woman{
  background-color: #FF81AC;
}
.head-con .head-img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.head-con .head-font{
  line-height: 46px;
  color: #fff;
}
.administrative-class{
  /deep/ .ivu-form-item{
    display: inline-block;
  }
  .text-left{
    text-align: left;
  }
  .m-l-40{
    margin-left: 40px;
  }
  .bgp{
    background: rgba(255,129,172,1);
  }
  .bgl{
    background: rgba(65,150,255,1);
  }
  .footer-style{
   text-align: center;
   display: flex;
   justify-content: space-between;
  }
  .role{
    display: inline-block;
    display: inline-block;
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 4px;
    color: rgba(0,0,0,1);
    border: 1px solid rgba(217,217,217,1);
    background: rgba(249,249,249,1);
    margin-right: 20px;
    cursor: pointer;
  }
  .role-active{
    background: rgba(236,244,255,1);
    color: rgba(65,150,255,1);
    border: 1px solid rgba(65,150,255,1);
  }
  .container-top{
    display: flex;
    justify-content: flex-start;
    border-bottom:1px dashed rgba(233,233,233,1);
    div.calssName{
      width: 90%;
      &>span:last-child{
        margin-right: 0px;
      }
      span{
          display: inline-block;
          padding:0 5px;
          color:rgba(0,0,0,0.65);
          background: #fff;
          // width: 164px;
          height: 22px;
          line-height: 22px;
          text-align: center;
          border-radius: 5px;
          margin-right: 20px;
          margin-bottom:10px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        span.active{
          background: rgba(65,150,255,1);
          color:#fff;
        }
    }
  }
  .container-center{
    padding:20px;
    button{
      margin-right: 20px;
    }
    .more{
      color:rgba(0,0,0,0.85)
    }
    .more-height{
      height: 100% !important;
    }
    .name-list{
      height: 100px;
      overflow: hidden;
      width: 95%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      &>div{
        margin-top:20px;
        margin-bottom:10px;
        margin-right:20px;
        margin-left:20px;
        text-align: center;
      }
      &>div:last-child{
        margin-right:0;
      }
      .tx{
        line-height: 46px;
        color: #fff;
        text-align: center;
        width: 46px;
        height:46px;
        border-radius: 50%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      p.name{
        margin-top:11px;
        width: 46px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
  }
  .container-bottom{
    padding:25px;
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 100px;
    .group{
      margin-right: 15px;
      margin-bottom: 15px;
      position: relative;
      width: 382px;
      padding-top:5px;
      border:1px solid rgba(232,232,232,1);
      border-radius: 4px;
      .top{
        padding: 10px 20px 0 20px;
        display: flex;
        justify-content: space-between;
        .title{
          font-weight: 700;
          cursor: pointer;
          .icon{
            display:none;
          }
        }
        .title:hover{
          .icon{
            display:inline;
          }
        }
      }
      .bottom{
        padding:10px;
        height: 332px;
        overflow: auto;
        .name-list{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-wrap: wrap;
          &>div{
            margin:10px;
            text-align: center;
          }
          .tx{
            margin-right: 6px;
            line-height: 46px;
            color: #fff;
            text-align: center;
            width: 46px;
            height:46px;
            border-radius: 50%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .name{
            width: 70px;
            text-align: left;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .name-hover{
            width:147px;
          }
          .ios-close{
            display: none;
          }
          .name-hover:hover{
            .ios-close{
              display: inline;
            }
          }
          .names{
            display: flex;
            flex-direction: column;
            &>:first-child{
                width: auto;
                text-align: left;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            &>:nth-child(2){
              border-radius: 4px;
              color:#fff;
              background: rgba(59,209,159,1);
              padding: 0 5px;
            }
          }
        }
      }
      .footer{
        width: 100%;
        height:48px;
        line-height: 48px;
        text-align: center;
        color: rgba(0,0,0,0.65);
        position: absolute;
        bottom:0;
        background:rgba(247,249,250,1) ;
      }
      .footer:hover,.delete:hover{
        color:rgba(65,150,255,1)
      }
    }
  }

}

</style>
