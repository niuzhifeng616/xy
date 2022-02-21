<template>
<div class="xy-content-module">
    <div class="xy-content-title room-title clearfix">
        <div class="fl">
            <!-- <Button class="xy-primary" @click="back">返回</Button> -->
            <Button class="xy-primary" @click="autoAdjust">自动排教室</Button>
            <Button class="xy-danger" @click="emptyAll">置空全部教室</Button>
        </div>
        <div class="fr clearfix" style="padding-bottom: 1px;">
            <i-input search v-model.trim="searchName"  @on-search="FromSubmit" style="width:250px">
                <i-select v-model="range" slot="prepend" style="width: 90px">
                    <i-option value="1">教师姓名</i-option>
                    <i-option value="2">班额大于</i-option>
                    <i-option value="3">班额小于</i-option>
                    <i-option value="4">课程名称</i-option>
                </i-select>
            </i-input>
        </div>
    </div>
    <div class="xy-content-body room-body">
        <div class="clearfix row-room-top">
            <checkbox class="fl" v-model="inClass">合班的课使用同一教室</checkbox>
            <checkbox-group class="fl" v-model="checkAllGroup" @on-change="checkAllGroupChange">
                <checkbox label="1">课时</checkbox>
                <checkbox label="2">教师</checkbox>
                <checkbox label="3">班额</checkbox>
            </checkbox-group>
        </div>
        <div class="row-room-bottom">
            <!-- 左侧部分 -->
            <div class="rrb-left" id="tableDiv">
                <table class="table" style="table-layout: fixed;width: auto;border-collapse: separate;border-spacing: 0;transform-style:preserve-3d;">
                    <thead>
                        <tr>
                            <th style="width:8%">节次</th>
                            <th style="width:8%">班级</th>
                            <th v-for="(week, index) in weekData"  :key="index">
                                <span >{{week.weekName}}</span>
                                <span >({{week.use}}/{{week.all}})</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(table, index) in leftTableData" :key="index">
                            <td v-if="table.Rowspan > 0" :rowspan="table.Rowspan" >{{table.AMorPMName}}</td>
                            <td >{{table.CollectionName}}</td>
                            <td v-for="(week,n) in 7" :key="n">
                                <div class="crouse"
                                    :class="`${range === '1' && searchName !== '' ? (temp.TeacherNames.indexOf(searchName) > -1?'crouse-active':'' ) : ''}
                                            ${range === '2' && searchName !== '' ? (temp.StudentLimitation > Number(searchName) ? 'crouse-active' : '' ) : ''}
                                            ${range === '3' && searchName !== '' ? (temp.StudentLimitation < Number(searchName) ? 'crouse-active' : '' ) : ''}
                                            ${range === '4' && searchName !== '' ? (temp.TempName.indexOf(searchName) > -1?'crouse-active':'' ) : ''}`"
                                    v-show="table.AMorPM === temp.AMorPM && table.AMorPMOrder === temp.AMorPMOrder && temp.Day === n"
                                    v-for="(temp, m) in table.Temps"  :key="m"
                                    @click.stop="leftRoom($event,temp,n)">

                                    <span class="subject" >
                                        {{temp.TempName}}
                                        <span v-if="crouseHour && temp.Level !== null" >[{{temp.Level}}] - </span>
                                    </span>
                                    <span class="teacher" v-if="isTeacher ? ((temp.TeacherNames === '' || temp.TeacherNames === null)?false:true):false" >{{temp.TeacherNames}} - </span>
                                    <span class="class" v-if="isClassNum && temp.StudentLimitation !== null" >[{{temp.StudentLimitation}}] - </span>
                                    <span class="room" >
                                        <span :data-id="temp.HouseID" style="font-weight:bold;"><em v-if="temp.HouseName" style="color:#D7D7D9;">|&nbsp;</em>{{temp.HouseName}}</span>
                                        <span class="modal-operation">
                                            <a class="" @click="empty(temp)">置空</a><br>
                                            <a class="" @click="same(temp)">置同</a>
                                        </span>
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 右侧部分 -->
            <div class="rrb-right">
                <div>
                    <i-select v-model="schoolIDCur"
                                @on-change="schoolChange"
                                style="width:100%; margin-bottom:14px;">
                        <i-option v-for="item in schoolData"
                              :value="item.value"
                              :key="item.value"
                              :title="item.title">{{ item.label }}</i-option>
                    </i-select>
                    <i-select v-model="buildingID"
                                @on-change="buildingChange"
                                style="width:100%">
                        <i-option value="0">所有教学楼</i-option>
                        <i-option v-for="item in buildingData"
                                    :value="item.BuildingID"
                                    :key="item.BuildingID" >{{ item.BuildingName }}</i-option>
                    </i-select>
                </div>
                <div class="room-block">
                    <div class="room-block-list" v-for="(building, index) in houseData" :key="index">
                        <h3 >{{building.BuildingName}}</h3>
                        <ul class="room-ul">
                            <li v-for="(item, n) in building.houseList"  :key="n">
                                <span v-if="item.dis"
                                      @click="rightHouse(item.HouseID)"
                                      :data-id="item.HouseID"
                                      >{{item.HouseName}}</span>
                                <span v-else class="disspan" >{{item.HouseName}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--置空全部教室 -->
    <Modal v-model="modalEmptyAll"
           title="确认置空全部教室"
           :mask-closable="false"
           :closable="false"
           width="564"
           :transfer="false">
        <div style="font-size:14px;">
            <p style="margin:8px 0">请输入“<span style="color:#ed4014">置空</span>”来确认“<b>置空所选全部排课方案</b>”的教室。</p>
            <i-input v-model="emptyAllText"  placeholder="请输入“置空”"/>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="modalEmptyAll = false">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="submitmodalEmptyAll">保存</Button>
        </div>
    </Modal>
</div>
</template>
<script>
  export default {
    name: 'SetRoomRowRoom',
    components: {

    },
    data () {
      return {
        modalIsShow: false,
        crouseHour: false,
        isTeacher: false,
        isClassNum: false,
        inClass: true,
        checkAllGroup: [],
        searchName: '',
        range: '4',
        weekData: [],
        schoolIDCur: 0,
        schoolData: [],
        buildingID: '0',
        buildingData: [],
        houseData: [],
        leftTableData: [],
        leftHouseActive: false,
        postData: {},
        disList: [], // 已经选过的教室
        leftSelectRoom: '', // 左侧点击的教室
        // 置空全部教室
        modalEmptyAll: false,
        emptyAllText: '',
        // 列表页的搜索条件
        classTableIDs: '',
        schoolID: 0,
        yearID: 0,
        sessionID: 0,
        searchName1: '',

        menuName: '' // title展示
      }
    },
    watch: {
      leftTableData () {
        if (this.leftTableData.length > 0) {
          this.$nextTick(function () {
            var tableDiv = document.querySelector('#tableDiv')
            var scrollY = 0
            tableDiv.addEventListener('scroll', function (e) {
              // 垂直滚动固定头
              if (this.scrollTop !== scrollY) {
                scrollY = this.scrollTop
                this.querySelector('thead').style.transform = 'translate3d(0,' + this.scrollTop + 'px,.1px)'
              }
            })
          })
        }
      }
    },
    created () {
      // 从table跳转至本页面
      if (Object.keys(this.$store.state.csmstimetable.roomTableGoRowRoom).length > 0) {
        let rowObj = this.$store.state.csmstimetable.roomTableGoRowRoom
        this.classTableIDs = rowObj.classTableIDs
        this.schoolID = rowObj.schoolID
        this.yearID = rowObj.yearID
        this.sessionID = rowObj.sessionID
        this.searchName1 = rowObj.searchName
      }

      if (Object.keys(this.$store.state.csmstimetable.roomGoAutoAdjust).length > 0) {
        // 从快速排教室返回至本页面
        // console.log('从快速排教室返回')
        let rowObj = this.$store.state.csmstimetable.roomGoAutoAdjust
        this.schoolIDCur = rowObj.schoolIDCur
        this.$store.commit('csmstimetable/setRoomGoAutoAdjust', {})
      } else {
        // 从table跳转过来
        this.schoolIDCur = this.schoolID
      }
      this.menuName = this.$store.state.common.menuInfo // 获取title内容

      var body = document.querySelector('body')
      body.addEventListener('click', function (e) {
        if (e.target.className !== 'room room-active') {
          if (e.target.className !== 'room') {
            if (e.target.className !== 'modal-operation') {
              $('.modal-operation').hide()
              $('.room').removeClass('room-active')
            };
          };
        };
      })
    },
    mounted () {
      this.getSchool()
      this.getTP()
    },
    methods: {
      // 获取课程信息
      async getTP () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AssignedClassRoom/GetAssignedClassRoomAll`, {
          classTableIDs: this.classTableIDs
        })
        this.xy.unloading()
        if (res.success) {
          var resData = res.data
          this.weekData = []
          for (var i = 0; i < resData.Days.length; i++) {
            this.weekData.push({
              use: resData.Days[i].HasRoomTempsCount,
              all: resData.Days[i].TempsCount,
              weekName: this.xy.getChinesesWeekForNumSmall(i)
            })
          }

          this.leftTableData = []
          for (let i = 0; i < resData.List.length; i++) {
            if (resData.List[i].Collections.length > 0) {
              for (let j = 0; j < resData.List[i].Collections.length; j++) {
                let rowspan = 0
                if (j === 0) {
                  rowspan = resData.List[i].Collections.length
                };
                this.leftTableData.push({
                  Rowspan: rowspan,
                  AMorPM: resData.List[i].AMorPM,
                  AMorPMOrder: resData.List[i].AMorPMOrder,
                  AMorPMName: resData.List[i].AMorPMName,
                  CollectionName: resData.List[i].Collections[j].CollectionName,
                  CollectionID: resData.List[i].Collections[j].CollectionID,
                  Temps: resData.List[i].Collections[j].Temps
                })
              }
            } else {
              this.leftTableData.push({
                Rowspan: 1,
                AMorPM: resData.List[i].AMorPM,
                AMorPMOrder: resData.List[i].AMorPMOrder,
                AMorPMName: resData.List[i].AMorPMName,
                CollectionName: '',
                CollectionID: '',
                Temps: []
              })
            }
          };
        }
      },
      // 获取校区
      async getSchool () {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`)
        this.xy.unloading()
        if (res.success) {
          res.data.map(item => {
            this.schoolData.push({
              value: item.SchoolDistrictID,
              label: item.SchoolDistrictName.length >= 16 ? `${item.SchoolDistrictName.substr(0, 15)}...` : item.SchoolDistrictName,
              title: item.SchoolDistrictName.length >= 16 ? item.SchoolDistrictName : ''
            })
          })
          this.getBuildingList()
        }
      },
      // 根据校区获取场馆
      async getBuildingList () {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetBuildingList`, {
          schoolID: this.schoolIDCur
        })
        this.xy.unloading()
        if (res.success) {
          this.buildingData = res.data
          this.buildingID = '0'
          this.getHouseList(this.buildingID)
        }
      },
      // 根据场馆获取场室
      async getHouseList (buildingID) {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetHouseNoDeleteList`, {
          schoolID: this.schoolIDCur,
          buildingID: buildingID
        })
        this.xy.unloading()
        if (res.success) {
          var resData = res.data
          this.houseData = []
          for (var i = 0; i < resData.length; i++) {
            if (i === 0) {
              var arr = []
              resData[i].dis = true
              arr.push(resData[i])
              this.houseData.push({
                BuildingName: resData[i].BuildingName,
                BuildingID: resData[i].BuildingID,
                houseList: arr
              })
            } else {
              var index = this.houseData.map(function (item) { return item.BuildingID }).indexOf(resData[i].BuildingID)
              if (index === -1) {
                var arr1 = []
                resData[i].dis = true
                arr1.push(resData[i])
                this.houseData.push({
                  BuildingName: resData[i].BuildingName,
                  BuildingID: resData[i].BuildingID,
                  houseList: arr1
                })
              } else {
                resData[i].dis = true
                this.houseData[index].houseList.push(resData[i])
              }
            }
          }
        }
      },
      // 校区Change
      schoolChange (val) {
        this.leftHouseActive = false
        this.postData = {}
        this.getBuildingList()
      },
      // 场馆楼
      buildingChange (val) {
        this.leftHouseActive = false
        this.postData = {}
        this.getHouseList(val)
      },
      // FromSubmit
      FromSubmit () {
        if (this.searchName === '') {
          this.xy.msgError('请输入查询条件。')
          return false
        }
      },
      // 置空
      empty (temp) {
        if (temp.HouseID > 0) {
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除这节课的教室吗?',
            onOk: () => {
              var arr = []
              arr.push(temp)
              this.clearRoomFun(temp, arr)
            }
          })
        } else {
          this.xy.msgError('这节课还未设置教室，不需要置空。')
        }
      },
      async clearRoomFun (temp, arr) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AssignedClassRoom/ClearRoom`, {
          HouseID: temp.HouseID,
          SetList: arr
        })
        $('.modal-operation').hide()
        if (res.success) {
          for (var j = 0; j < this.houseData.length; j++) { // 置空后右侧该教室可以点击
            for (var i = 0; i < this.houseData[j].houseList.length; i++) {
              if (temp.HouseID === this.houseData[j].houseList[i].HouseID) {
                this.houseData[j].houseList[i].dis = true
              }
            }
          };
          this.getTP()
          this.xy.unloading()
        }
      },
      // 全部置空
      emptyAll () {
        this.modalEmptyAll = true
        this.emptyAllText = ''
      },
      async submitmodalEmptyAll () {
        if (this.emptyAllText === '置空') {
          var postArr = []
          for (var i = 0; i < this.leftTableData.length; i++) {
            for (var j = 0; j < this.leftTableData[i].Temps.length; j++) {
              if (this.leftTableData[i].Temps[j].HouseID > 0) {
                postArr.push(this.leftTableData[i].Temps[j])
              }
            }
          }
          if (postArr.length > 0) {
            this.xy.loading()
            let res = await this.xy.post(`${this.$store.state.apiPath}/api/AssignedClassRoom/ClearRoom`, {
              HouseID: 0,
              SetList: postArr
            })
            $('.modal-operation').hide()
            if (res.success) {
              this.modalEmptyAll = false
              this.getTP()
              this.xy.unloading()
            }
          } else {
            this.xy.msgError('课表中暂无教室。')
          }
        } else {
          this.xy.msgError('请输入“置空”。')
        }
      },
      // 置同
      same (temp) {
        if (temp.Type === 'ZX') {
          this.xy.msgError('该课程只有一个课时，不需要置同教室。')
          return false
        }

        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要把该课程的其他课时也设为这间教室吗?',
          onOk: () => {
            temp.IsUnion = this.inClass
            this.updateSameRoomFun(temp)
          }
        })
      },
      async updateSameRoomFun (temp) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AssignedClassRoom/UpdateSameRoom`, temp)
        $('.modal-operation').hide()
        if (res.success) {
          this.xy.msgSuc('置同教室成功。')
          this.getTP()
        }
        this.xy.unloading()
      },
      // 左侧放置场室点击
      async leftRoom (event, temp, day) {
        this.leftSelectRoom = ''
        this.leftSelectRoom = temp
        this.postData = {
          CollectionID: temp.CollectionID,
          AID: temp.AID,
          CoursePlanDetailID: temp.CoursePlanDetailID,
          ClassTableType: temp.ClassTableType,
          CoursePlanID: temp.CoursePlanID,
          HouseID: '',
          ClassName: '',
          ClassTableID: temp.ClassTableID,
          ParentID: temp.ParentID,
          ParentType: temp.ParentType,
          SloverResultCollectionID: temp.SloverResultCollectionID,
          SelfStudyCoursesID: temp.SelfStudyCoursesID
        }
        this.leftHouseActive = true
        // this.modalIsShow = true;
        var targe = $(event.currentTarget)
        $('.room').removeClass('room-active')
        targe.addClass('room-active')
        if (day === 6) {
          $('.modal-operation').css({
            'left': '-66px'
          })
        } else {
          $('.modal-operation').css({
            'left': '20px'
          })
        }
        $('.modal-operation').hide()
        targe.find('.modal-operation').show()
        if (temp.ClassTableType === 99) {
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/AssignedClassRoom/GetUsedHoseByCoursePlanDetail?schoolDistrictID=${this.schoolIDCur}&coursePlanDetailID=${temp.CoursePlanDetailID}&subjectType=SS&isUnion=${this.inClass}`)
          this.xy.unloading()
          if (res.success) {
            this.disList = res.data
            for (var j = 0; j < this.houseData.length; j++) {
              for (var i = 0; i < this.houseData[j].houseList.length; i++) {
                this.houseData[j].houseList[i].dis = true
                for (var k = 0; k < this.disList.length; k++) {
                  if (this.disList[k] === this.houseData[j].houseList[i].HouseID) {
                    this.houseData[j].houseList[i].dis = false
                  }
                }
              }
            };
          }
        } else {
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/AssignedClassRoom/GetUsedHoseByCoursePlanDetail?schoolDistrictID=${this.schoolIDCur}&coursePlanDetailID=${temp.CoursePlanDetailID}&subjectType=CL&isUnion=${this.inClass}`)
          this.xy.unloading()
          if (res.success) {
            this.disList = res.data
            for (let j = 0; j < this.houseData.length; j++) {
              for (let i = 0; i < this.houseData[j].houseList.length; i++) {
                this.houseData[j].houseList[i].dis = true
                for (let k = 0; k < this.disList.length; k++) {
                  if (this.disList[k] === this.houseData[j].houseList[i].HouseID) {
                    this.houseData[j].houseList[i].dis = false
                  }
                }
              }
            };
          }
        }
      },
      // 右侧场室点击
      async rightHouse (item) {
        this.postData.HouseID = item
        if (this.leftHouseActive) {
          this.postData.SchoolDistrictID = this.schoolIDCur
          this.postData.CoursePlanDetailID = this.leftSelectRoom.CoursePlanDetailID
          if (this.leftSelectRoom.ClassTableType === 99) {
            this.postData.SubjectType = 'SS'
          } else {
            this.postData.SubjectType = 'CL'
          }
          this.postData.isUnion = this.inClass

          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/AssignedClassRoom/SetHouse`, this.postData)
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('设置教室成功。')
            this.getTP()
          }

          this.leftHouseActive = false
          $('.room').removeClass('room-active')
        } else {
          this.xy.msgError('请先点击课表中的一个教室。')
        }
        // this.modalIsShow = false;
        $('.modal-operation').hide()
      },
      checkAllGroupChange () {
        if (this.checkAllGroup.indexOf('1') !== -1) {
          this.crouseHour = true
        } else {
          this.crouseHour = false
        };
        if (this.checkAllGroup.indexOf('2') !== -1) {
          this.isTeacher = true
        } else {
          this.isTeacher = false
        };
        if (this.checkAllGroup.indexOf('3') !== -1) {
          this.isClassNum = true
        } else {
          this.isClassNum = false
        };
      },

      // 自动排教室
      autoAdjust () {
        // 跳转至自动排教室
        // this.$store.commit('common/getThreeMenuName', '') // 清空顶部title
        this.$router.push({
          path: '/xyhome/roomAutoAdjust',
          query: this.$store.state.common.menuInfo
        })

        this.$store.commit('csmstimetable/setRoomGoAutoAdjust', {
          classTableIDs: this.classTableIDs,
          schoolID: this.schoolID,
          schoolIDCur: this.schoolIDCur,
          menuName: this.menuName // 跳转至自动排教室后会清空‘common/getThreeMenuName’，导致从“自动排教室”跳回后顶部无法正确显示标题（有两种类型的标题）,所以存此值
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.room-title{
  padding-bottom: 24px;
}
.room-body{
  background: #F4F5F7;
}
.row-room-top{
  padding: 0 0 10px;
}
.row-room-top .ivu-checkbox-group-item{
  margin-left: 17px;
}
.row-room-bottom{
  display: flex;
}

// 左侧
.row-room-bottom .rrb-left{
    width:calc(100% - 300px);
    overflow: auto;
    min-height: 500px;
    max-height: 700px;
}
.rrb-left .table{
    min-width: 100%;
    text-align: center;
    margin: 0 auto;
    border-collapse: collapse;
    font-size: 14px;
    border-left: 1px solid #D8D8D8;
    color: rgba(0,0,0,0.85)
}
.rrb-left .table thead th{
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
    text-align: center;
    text-overflow: ellipsis;
    vertical-align: middle;
    border: 1px solid #D8D8D8;
    border-left: none;
    font-weight:bold;
    background: #F5F4F9;
}
.rrb-left .table tbody td{
    height: 40px;
    box-sizing: border-box;
    vertical-align: middle;
    border-bottom: 1px solid #D8D8D8;
    border-right: 1px solid #D8D8D8;
    padding:10px 10px 5px;
    white-space: nowrap;
}
.crouse{
    font-size: 12px;
    width: 100%;
    white-space: nowrap;
    margin-bottom: 5px;

    min-width: 60px;
    vertical-align: middle;
    text-align: center;
    padding: 0 7px;
    cursor: pointer;
    position: relative;
    height: 29px;
    line-height: 29px;

    border-radius: 4px;
    color: #000;
    border:1px solid rgba(0,0,0,0.35);
    background: #fff;
}
.crouse:hover{
    transition: all 0.1s;
    border-color:#2487FF;
    box-shadow:inset 0px 0px 3px 1px rgba(36, 135, 255, .5);
}
.crouse-active {
  color: #fff;
  border: 1px solid #8CC0FF;
  background: #2487FF;
}
.crouse.crouse-active:hover{
  transition: all 0.1s;
  border-color:#2487FF;
    box-shadow:inset 0px 0px 3px 1px rgba(36, 135, 255, .5);
}
.modal-operation{
    box-shadow: 0px 2px 16px 1px #ccc;
    border-radius: 3px;
    position: absolute;
    top: 30px;
    left: 20px;
    z-index: 10;
    display:none;
}
.modal-operation a{
  width:97px;
  height:40px;
  line-height: 40px;
  padding-left: 19px;
  color:#6B6B6B;
  background: #fff;
  display: inline-block;
  text-align: left;
}
.modal-operation a:hover{
  color: #333;
  background: #F2F2F2;
}

// 右侧部分
.row-room-bottom .rrb-right{
  width:300px;
  padding:10px 15px;
  margin-left:20px;
  background:#fff;
  border-radius:2px;
}

.room-block{
    border:1px solid #eee;
    border-radius:5px;
    padding:10px 8px;
    min-height:500px;
    max-height: 600px;
    overflow: auto;
    margin-top: 10px;
}
.room-block .room-block-list h3{
    margin-bottom: 6px;
    letter-spacing: 0.5px;
    border-bottom: 1px solid rgb(234, 234, 234);
    padding: 0px 20px 2px 0px;
}
.room-block .room-block-list .room-ul{
    display:flex;
    justify-content:flex-start;
    flex-wrap:wrap;
}
.room-block .room-block-list .room-ul span{
    cursor: pointer;
    display: inline-block;
    line-height: 22px;
    padding: 0 4px;
    margin: 0 6px 17px 0;
    border-radius:4px;
    border:1px solid rgba(217,217,217,1);
    background:rgba(245,245,245,1);
    transition: all 0.3s;
    transition:all 0.3s;
}
.room-block .room-block-list .room-ul span:hover{
    transition:all 0.3s;
    color: #1890FF;
    background:rgba(230,247,255,1);
    border:1px solid rgba(145,213,255,1);
}

.room-block .room-block-list .room-ul .disspan,
.room-block .room-block-list .room-ul .disspan:hover{
    background: #e6e6e6;
    border: 1px solid #bbb;
    cursor:no-drop;
    color:#888;
}
.room-block .room-block-list .room-ul .disnonespan{
    display: none !important;
    line-height: 26px;
    background: #e6e6e6;
    padding: 0 4px;
    border-radius: 3px;
    transition: all 0.3s;
    border: 1px solid #bbb;
    margin: 5px;
    cursor:default;
    color:#888;
    transition:all 0.3s;
}
</style>
