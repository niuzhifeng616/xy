<template>
  <div class="module-func">
    <ul class="basic-info">
      <li @click="loadHtml(0)">
        <div class="have-data"
             v-if='isHaveSession'>
          <p class="title">{{timeShowText?'timeShowText':'剩余'}}</p>
          <div v-if='!timeShowText'>
            <span class="number">{{timeCount}}</span>
            <span class="unit">天</span>
          </div>
          <div class="session">
            <i class="iconfont session-icon">&#xe74b;</i>
            <span class="session-name"
                  v-if='currentSession.fullNameLength>4'
                  :title='currentSession.fullName'>{{currentSession.name}}</span>
            <span class="session-name"
                  v-else>{{currentSession.name}}</span>
            <span class="session-date">{{currentSession.StartDate}}-{{currentSession.EndDate}}</span>
          </div>
        </div>
        <div class="no-data"
             v-else>
          <p class="add-btn"><i class="iconfont icon-color"> &#xe6a2;</i></p>
          <p class="add-title">学期</p>
        </div>
      </li>
      <li @click="loadHtml(1)">
        <div class="have-data"
             v-if='countInfo.TeacherCount'>
          <p class="title">教师</p>
          <div class="number-and-icon">
            <div>
              <span class="number">{{countInfo.TeacherCount}}</span>
              <span class="unit">人</span>
            </div>
            <div class="add-btn"> <i class="iconfont icon-color">&#xe74a;</i> </div>
          </div>
        </div>
        <div class="no-data"
             v-else>
          <p class="add-btn"><i class="iconfont icon-color"> &#xe6a2;</i></p>
          <p class="add-title">教师</p>
        </div>
      </li>
      <li @click="loadHtml(2)">
        <div class="have-data"
             v-if='countInfo.StudentCount'>
          <p class="title">学生</p>
          <div class="number-and-icon">
            <div>
              <span class="number">{{countInfo.StudentCount}}</span>
              <span class="unit">人</span>
            </div>
            <div class="add-btn"> <i class="iconfont icon-color">&#xe749;</i> </div>
          </div>
        </div>
        <div class="no-data"
             v-else>
          <p class="add-btn"><i class="iconfont icon-color"> &#xe6a2;</i></p>
          <p class="add-title">学生</p>
        </div>
      </li>
      <li @click="loadHtml(3)">
        <div class="have-data"
             v-if='countInfo.SubjectCount'>
          <p class="title">课程</p>
          <div class="number-and-icon">
            <div>
              <span class="number">{{countInfo.SubjectCount}}</span>
              <span class="unit">门</span>
            </div>
            <div class="add-btn"> <i class="iconfont icon-color"> &#xe748;</i> </div>
          </div>
        </div>
        <div class="no-data"
             v-else>
          <p class="add-btn"><i class="iconfont icon-color"> &#xe6a2;</i></p>
          <p class="add-title">课程</p>
        </div>
      </li>
      <li @click="loadHtml(4)">
        <div class="have-data"
             v-if='countInfo.HouseCount'>
          <p class="title">教室</p>
          <div class="number-and-icon">
            <div>
              <span class="number">{{countInfo.HouseCount}}</span>
              <span class="unit">间</span>
            </div>
            <div class="add-btn"> <i class="iconfont icon-color">&#xe747;</i> </div>
          </div>
        </div>
        <div class="no-data"
             v-else>
          <p class="add-btn"><i class="iconfont icon-color"> &#xe6a2;</i></p>
          <p class="add-title">教室</p>
        </div>
      </li>
    </ul>
    <div class="basic-content">
      <div class="basic-left">
        <h3 class="module-title">最近排课</h3>
        <XyAntTable :isPage='false'
                    :columns="columns"
                    :dataSource="datatable"
                    nullData="暂无排课数据"
                    :tableLoading="tableLoading"
                    :scrollx="'max-content'">
          <div slot="ClassTableName"
               slot-scope="text, record">
            <div style="min-width:220px"
                 class="table-el-hover"
                 @click="editFun(record)">
              <span v-if='record.ClassTableType===1'
                    class='class-ad'>行</span>
              <span v-if='record.ClassTableType===3'
                    class='class-go'>走</span>
              {{record.ClassTableName}}
            </div>
          </div>
          <div slot="SchoolDistrictName"
               slot-scope="text, record">
            <div style="min-width:120px">
              {{record.SchoolDistrictName}}
            </div>
          </div>
          <div slot="StudentGradeNameForStudentYearName"
               slot-scope="text, record">
            <div style="min-width:100px">
              {{record.StudentGradeNameForStudentYearName}}
            </div>
          </div>
          <div slot="yearAndSession"
               slot-scope="text, record">
            <div style="min-width:150px">
              {{record.yearAndSession}}
            </div>
          </div>
          <div slot="CreateByFullName"
               slot-scope="text, record">
            <div style="min-width:80px">
              {{record.CreateByFullName}}
            </div>
          </div>
          <div slot="SloverTaskStatusName"
               slot-scope="text, record">
            <i class="iconfont icon-info"
               v-if="record.SloverTaskStatusName ==='进行中' ">&#xe719;</i>
            <i class="iconfont icon-success"
               v-if="record.SloverTaskStatusName ==='已发布'">&#xe719;</i>
            <i class="iconfont icon-use"
               v-if="record.SloverTaskStatusName ==='已启用' ">&#xe719;</i>
            <span>
              {{record.SloverTaskStatusName}}
            </span>
          </div>
        </XyAntTable>
      </div>
      <div class="basic-right">
        <div class="app-module">
          <h3 class="module-title">应用模块</h3>

          <ul class="module-ul">
            <li class="module-box"
                v-for='(item,index) in moduleList'
                :key='index'
                @click="moduleClick(item)">
              <img :src="item.img"
                   alt=""
                   class="img">
              <p>{{item.name}}</p>
            </li>
          </ul>

        </div>
        <div class="official-accounts">
          <h3 class="module-title">公众号</h3>
          <img class="public-img"
              src="@/pages/compactArrangement/imgs/public.png"
              alt="">
        </div>
      </div>
    </div>
    <!-- 行政班排课方案日志 -->
    <Modal v-model="modalLog"
           :transfer="false"
           :title="logTitle"
           :mask-closable="false"
           :closable="false"
           @on-ok="LogOk"
           ok-text="确定"
           @on-cancel="modalLog=false">
      <div class="dialog-model-content">
        <span v-for="(item,index) in logList"
              :key="index"
              style="display:block;">
          <span>{{item.LogTime}}</span>
          <span>{{item.SloverTaskLog}}</span>
        </span>
      </div>
      <div slot="footer"
           v-if="isRefresh">
        <Button class="xy-modal-close"
                @click="modalLog=false">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="LogRefresh">刷新</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="LogStop">停止</Button>
      </div>
    </Modal>
    <!-- 走班排课方案日志 -->
    <modal v-model="modalLog1"
           :transfer="false"
           :title="`“${logName1}”排课方案日志`"
           :mask-closable="false">
      <div class="dialog-model-content">
        <span v-for="item in logList1"
              :key="item.SloverTaskLog"
              style="display:block;">
          <span>{{xy.moment(item.LogTime).format('YYYY-MM-DD HH:mm')}}&nbsp;&nbsp;</span>
          <span>{{item.SloverTaskLog}}</span>
        </span>
      </div>
      <div slot="footer"
           v-if="isRefresh1">
        <Button class="xy-modal-close"
                @click="LogCancel1">取消</Button>
        <Button class="xy-modal-close"
                @click="LogStop1">停止</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="LogRefresh1">刷新</Button>
      </div>
      <div slot="footer"
           v-if="!isRefresh1">
        <Button class="xy-modal-close"
                @click="LogCancel1">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="LogOk1">确定</Button>
      </div>
    </modal>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'ModuleFunc',
    components: {
      XyAntTable
    },
    data () {
      return {
        isHaveSession: true,
        timeShowText: '',
        timeCount: null,
        countInfo: {},
        currentSession: {},
        columns: [
          {
            title: '名称',
            dataIndex: 'ClassTableName',
            scopedSlots: { customRender: 'ClassTableName' }
          },
          {
            title: '年级',
            scopedSlots: { customRender: 'StudentGradeNameForStudentYearName' }
          },
          {
            title: '学期',
            scopedSlots: { customRender: 'yearAndSession' }
          },
          {
            title: '创建人',
            scopedSlots: { customRender: 'CreateByFullName' }
          },
          {
            title: '状态',
            width: 150,
            scopedSlots: { customRender: 'SloverTaskStatusName' }
          }],
        datatable: [],
        tableLoading: false,
        moduleList: [
          {
            name: '行政班排课',
            PCIcon: 'icons-jcgl-njsj',
            img: require('@/pages/compactArrangement/imgs/icon1.png'),
            global: {}
          },
          {
            name: '走班排课',
            PCIcon: 'icons-jcgl-njsj',
            img: require('@/pages/compactArrangement/imgs/icon2.png'),
            global: {}
          },
          {
            name: '学期课表',
            PCIcon: 'icons-jcgl-njsj',
            img: require('@/pages/compactArrangement/imgs/icon3.png'),
            global: {}
          },
          {
            name: '排教室',
            PCIcon: 'icons-jcgl-njsj',
            img: require('@/pages/compactArrangement/imgs/icon4.png'),
            global: {}
          }
        ],
        // 点击方案
        refreshClassTableID: 0,
        // 行政班排课方案日志
        modalLog: false,
        sloverTaskID: 0,
        logTitle: '',
        logList: [],
        returnState: '',
        isRefresh: false,
        // 走班排课方案日志
        modalLog1: false,
        sloverTaskID1: 0,
        logList1: [],
        logName1: '',
        returnState1: 0,
        isRefresh1: false
      }
    },
    created () {
      let vals = this.$store.state.common.moduleList
      this.moduleList[0].global = vals[1].applications[0]
      this.moduleList[1].global = vals[1].applications[1]
      this.moduleList[2].global = vals[1].applications[3]
      this.moduleList[3].global = vals[1].applications[2]
      this.GetIndexCountInfo()
      this.getTable()
    },
    mounted () {

    },
    methods: {
      async GetIndexCountInfo () {
        this.countInfo = {
          HouseCount: null,
          StudentCount: null,
          SubjectCount: null,
          TeacherCount: null
        }
        this.isHaveSession = false
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetIndexCountInfo`, {})
        if (res.success) {
          this.countInfo = res.data
        }
        let res1 = await this.xy.get(`${this.xyApi}/base/api/AcademicSession/GetAll`, {})
        if (res1.success) {
          res1.data.map(item => {
            if (item.IsCurrent) {
              let length = item.AcademicSessionName.length || 0
              this.currentSession = {
                fullNameLength: length,
                fullName: item.AcademicSessionName,
                name: length > 4 ? item.AcademicSessionName.slice(0, 4) + '...' : item.AcademicSessionName,
                StartDate: this.xy.moment(item.StartDate).format('YYYY/MM/DD'),
                EndDate: this.xy.moment(item.EndDate).format('YYYY/MM/DD')
              }
              this.isHaveSession = true
            }
          })
          // 计算学期时间
          let current = new Date().getTime() / 1000
          let endDate = new Date(`${this.currentSession.EndDate}  23:59:59`).getTime() / 1000
          let startDate = new Date(`${this.currentSession.StartDate} 00:00:00`).getTime() / 1000
          if (current >= startDate && current < endDate) { // 学期剩余天数
            let diff = endDate - parseInt(current)
            this.timeCount = parseInt(diff / 60 / 60 / 24)
            this.timeShowText = ''
          } else if (current < startDate) {
            this.timeShowText = '即将开始'
          } else if (current > endDate) {
            this.timeShowText = '已结束'
          }
        // this.countInfo = res.data
        }
      },
      async getTable () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.xyApi}/csms/api/ClassTable/GetLiteClassTableList`, {})
        if (res.success) {
          if (res.data.length) {
            res.data.map(item => {
              item.yearAndSession = `${item.AcademicYearName}/${item.AcademicSessionName}`
              return item
            })
            this.datatable = res.data.length ? res.data.slice(0, 8) : res.data
          }
        }
        this.tableLoading = false
      },
      editFun (row) {
        this.refreshClassTableID = row.ClassTableID
        this.$store.commit('changeApiPath', `${this.xyApi}/csms`)
        // 行政班
        if (row.ClassTableType === 1) {
          if (row.SloverTaskID !== '0') {
            this.xy.get(`${this.xyApi}/csms/api/ClassTable/GetSloverTaskByClassTable`, {
              classTableID: row.ClassTableID
            }).then(res => {
              this.xy.unloading()
              if (res.success) {
                if (Number(res.data.Model.SloverTaskID) === 0) {
                  this.$store.commit('csmstimetable/changeAdmininstrativeRowObj', {
                    classTableID: row.ClassTableID,
                    classTableType: row.ClassTableType,
                    classTableName: row.ClassTableName,
                    schoolDistrictID: row.SchoolDistrictID,
                    yearID: row.AcademicYearID,
                    sessionID: row.AcademicSessionID
                  })
                  let query = { xy: '2,217', cd: 'csms' }
                  this.$store.commit('common/getMenuInfo', query)
                  this.$router.push({
                    path: '/xyhome/administrativeStepHeader',
                    query: query
                  })
                } else {
                  this.sloverTaskID = res.data.Model.SloverTaskID
                  this.returnState = res.data.Model.ReturnState
                  this.logList = res.data.LogList
                  for (let i = 0, len = this.logList.length; i < len; i++) {
                    this.logList[i].LogTime = this.xy.moment(this.logList[i].LogTime).format('YYYY-MM-DD HH:mm')
                  }
                  // 队列中
                  if (Number(this.returnState) === 1) {
                    let that = this
                    this.$Modal.confirm({
                      title: '温馨提示',
                      content: '您确定要终止当前排课吗？',
                      onOk: () => {
                        that.xy.post(`${that.xyApi}/csms/SloverCoreSiteByPaas/SloverStop?classTableID=${that.refreshClassTableID}&sloverTaskID=${that.sloverTaskID}`).then(res => {
                          that.xy.unloading()
                          if (res.success) {
                            that.modalLog = false
                            that.xy.msgSuc('进度更新成功。')
                            that.getTable()
                          }
                        })
                      }
                    })
                  }
                  // 进行中
                  if (Number(this.returnState) === 2) {
                    // 开启日志
                    this.modalLog = true
                    this.logTitle = row.ClassTableName + '排课方案日志'
                    this.isRefresh = true
                  }
                  // 完成未读
                  if (Number(this.returnState) === 3) {
                    // 开启日志
                    this.modalLog = true
                    this.logTitle = row.ClassTableName + '排课方案日志'
                  }
                  //  完成已读
                  if (Number(this.returnState) === 4) {
                    this.$store.commit('csmstimetable/changeAdmininstrativeRowObj', {
                      classTableID: row.ClassTableID,
                      classTableType: row.ClassTableType,
                      classTableName: row.ClassTableName,
                      schoolDistrictID: this.schoolDistrictID,
                      yearID: this.yearID,
                      sessionID: this.sessionID
                    })
                    let query = { xy: '2,217', cd: 'csms' }
                    this.$store.commit('common/getMenuInfo', query)
                    this.$router.push({
                      path: '/xyhome/administrativeStepHeader',
                      query: query
                    })
                  }
                }
              }
            })
          } else {
            this.$store.commit('csmstimetable/changeAdmininstrativeRowObj', {
              classTableID: row.ClassTableID,
              classTableType: row.ClassTableType,
              classTableName: row.ClassTableName,
              schoolDistrictID: this.schoolDistrictID,
              yearID: this.yearID,
              sessionID: this.sessionID
            })
            let query = { xy: '2,217', cd: 'csms' }
            this.$store.commit('common/getMenuInfo', query)
            this.$router.push({
              path: '/xyhome/administrativeStepHeader',
              query: query
            })
          }
        }
        // 走班
        if (row.ClassTableType === 3) {
          if (row.SloverTaskID !== 0) {
            this.xy.loading()
            let params = {
              classTableID: row.ClassTableID
            }
            this.xy.get(`${this.$store.state.apiPath}/api/ClassTable/GetSloverTaskByClassTable`, params).then(res => {
              this.xy.unloading()
              if (res.success) {
                if (res.data.Model.SloverTaskID === '0') {
                  this.$store.commit('csmstimetable/setGoClassRowObj', row)
                  let query = { xy: '2,220', cd: 'csms' }
                  this.$store.commit('common/getMenuInfo', query)
                  this.$router.push({
                    path: '/xyhome/goClassStepsHeader',
                    query: query
                  })
                } else {
                  // this.sloverTaskID = res.data.Model.SloverTaskID;
                  this.sloverTaskID1 = res.data.Model.SloverTaskIDStr
                  this.returnState1 = res.data.Model.ReturnState
                  this.logList1 = res.data.LogList
                  this.logName1 = res.data.Name
                  // 队列中
                  if (this.returnState1 === 1) {
                    let that = this
                    this.$Modal.confirm({
                      title: '温馨提示',
                      content: '您确定要终止这个排课吗？',
                      async onOk () {
                        that.xy.post(`${that.$store.state.apiPath}/api/SloverCoreSiteByPaas/SloverStop?ClassTableID=${row.ClassTableID}&sloverTaskID=${that.sloverTaskID}`, null).then(res => {
                          if (res.success) {
                            that.xy.msgSuc(res.data)
                            that.getTable()
                          }
                        })
                      }
                    })
                  }
                  // 进行中
                  if (this.returnState1 === 2) {
                    // 开启日志
                    this.modalLog1 = true
                    this.isRefresh1 = true
                  }
                  // 完成未读
                  if (this.returnState1 === 3) {
                    // 开启日志
                    this.modalLog1 = true
                  }
                  // 完成已读
                  if (this.returnState1 === 4) {
                    this.$store.commit('csmstimetable/setGoClassRowObj', row)
                    let query = { xy: '2,220', cd: 'csms' }
                    this.$store.commit('common/getMenuInfo', query)
                    this.$router.push({
                      path: '/xyhome/goClassStepsHeader',
                      query: query
                    })
                  }
                }
              }
            })
          } else {
            this.$store.commit('csmstimetable/setGoClassRowObj', row)
            let query = { xy: '2,220', cd: 'csms' }
            this.$store.commit('common/getMenuInfo', query)
            this.$router.push({
              path: '/xyhome/goClassStepsHeader',
              query: query
            })
          }
        }
      },
      // 行政班排课方案日志
      async LogOk () { // 确定 关闭日志
        let res = await this.xy.post(`${this.xyApi}/csms/api/ClassTable/EditIsRead`, {
          SloverTaskID: this.sloverTaskID
        })
        this.xy.unloading()
        if (res.success) {
          this.modalLog = false
          this.getList()
        }
      },
      async LogRefresh () { // 刷新 不关闭日志
        let res = await this.xy.get(`${this.xyApi}/csms/ClassTable/GetSloverTaskByClassTable`, {
          SloverTaskID: this.sloverTaskID
        })
        this.xy.unloading()
        if (res.success) {
          this.logList = res.data.data.LogList
          for (let i = 0, len = this.logList.length; i < len; i++) {
            this.logList[i].LogTime = this.xy.moment(this.logList[i].LogTime).format('YYYY-MM-DD HH:mm')
          }
        }
      },
      // 走班
      async LogOk1 () { // 确定 关闭日志
        let params = {
          SloverTaskID: this.sloverTaskID1
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTable/EditIsRead`, params)
        if (res.success) {
          this.modalLog1 = false
          this.getTable()
        }
      },
      LogCancel1 () { // 取消 关闭日志
        this.modalLog1 = false
      },
      LogStop1 () { // 停止 关闭日志
        let that = this
        that.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要终止这个排课吗？',
          async onOk () {
            let params = {
            }
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/SloverCoreSiteByPaas/SloverStop?ClassTableID=${that.refreshClassTableID}&sloverTaskID=${that.sloverTaskID}`, params)
            if (res.success) {
              that.modalLog1 = false
              that.xy.msgSuc(res.data)
              that.getTable()
            }
          }
        })
      },
      async LogRefresh1 () { // 刷新 不关闭日志
        this.xy.loading()
        let params = {
          ClassTableID: this.refreshClassTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTable/GetSloverTaskByClassTable`, params)
        this.xy.unloading()
        if (res.success) {
          this.logList1 = res.data.LogList
        }
      },
      // 应用模块点击
      moduleClick (val) {
        // this.$store.commit(
        //   'changeApiPath',
        //   `${this.xyApi}/${parentItem.ModuleCode}`
        // )
        let application = val.global
        this.$store.commit(
          'changeApiPath',
          `${this.xyApi}/${application.GatewayCode}`
        )
        let mIds = [2, application.ID]
        if (application.subMenu.length > 0) {
          mIds.push(application.subMenu[0].ID)
        }
        this.$router.push({
          path:
            application.subMenu.length > 0
              ? application.subMenu[0].ApplicationSubMenuPCUrl
              : application.PCUrl,
          query: {
            xy: mIds.join(','),
            cd: application.GatewayCode
          }
        })
        window.scrollTo(0, 0)
      },
      // 头部基础数据模块跳转
      loadHtml (val) {
        let vals = this.$store.state.common.moduleList
        let application = vals[0].applications[val]
        this.$store.commit(
          'changeApiPath',
          `${this.xyApi}/${application.GatewayCode}`
        )
        let mIds = [1, application.ID]
        if (application.subMenu.length > 0) {
          mIds.push(application.subMenu[0].ID)
        }
        this.$router.push({
          path:
            application.subMenu.length > 0
              ? application.subMenu[0].ApplicationSubMenuPCUrl
              : application.PCUrl,
          query: {
            xy: mIds.join(','),
            cd: application.GatewayCode
          }
        })
        window.scrollTo(0, 0)
      }
    }
  }
</script>
<style lang="less" scoped>
.Add-Btn-Fun() {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #ebf3ff;
  text-align: center;
  line-height: 38px;
  .icon-color {
    color: #4994ff;
  }
}
.module-title-Fun() {
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  color: #000000;
  margin-bottom: 30px;
}
.module-func {
  height: 100%;
  .basic-info {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    li {
      cursor: pointer;
      flex: 1;
      height: 145px;
      margin-right: 16px;
      // min-width: 230px;
      .have-data {
        height: 100%;
        background: #ffffff;
        padding: 25px 0 0 24px;
        border-radius: 8px;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.08);
        .title {
          color: rgba(0, 0, 0, 0.45);
        }
        .session {
          margin-top: 8px;
          font-size: 14px;
          .session-icon {
            font-size: 14px;
            color: #0c70ff;
          }
          .session-name {
            color: #1677ff;
            margin: 0 3px;
          }
          .session-date {
            color: rgba(0, 0, 0, 0.45);
            margin-left: 3px;
          }
        }
        .number {
          font-size: 36px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
        }
        .unit {
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
        }
        .number-and-icon {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
          padding-right: 25px;
          .add-btn {
            .Add-Btn-Fun;
          }
        }
      }
      &:hover {
        .have-data {
          background: linear-gradient(135deg, #1356f4, #46abfa);
          box-shadow: 2px 6px 16px 0px rgba(0, 54, 223, 0.33);
          .title {
            color: #fff;
          }
          .session {
            .session-icon {
              color: #fff;
            }
            .session-name {
              color: #fff;
            }
            .session-date {
              color: #fff;
            }
          }
          .number {
            color: #fff;
          }
          .unit {
            color: #fff;
          }
          .add-btn {
            background: #4a9df9;
          }
          .icon-color {
            color: #fff !important;
          }
        }
      }
      .no-data {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.08);
        cursor: pointer;
        .add-btn {
          margin-bottom: 10px;
          .Add-Btn-Fun;
        }
        .add-title {
          font-size: 14px;
          font-weight: 400;
          text-align: center;
          color: rgba(0, 0, 0, 0.85);
        }
      }
    }
    li:last-child {
      margin-right: 0;
    }

  }
  .basic-content {
    margin-top: 16px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    min-height: calc(100% - 145px);
    .basic-left {
      background: #fff;
      padding: 15px 15px 0 15px;
      flex: 1;
      margin-right: 16px;
      border-radius: 8px;
      box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.08);
      .class-ad,
      .class-go {
        font-size: 12px;
        background: #1677ff;
        padding: 2px 3px;
        border-radius: 5px;
        color: #fff;
      }
      .class-go {
        background: #0cb493;
      }
      .module-title {
        .module-title-Fun
      }
      // /deep/.ant-table-thead > tr > th{
      //   background-color: transparent;
      // }
    }
    .basic-right {
      width: 20%;
      min-width: 240px;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      .app-module,
      .official-accounts {
        height: 50%;
        background: #fff;
        border-radius: 8px;
        padding-top: 15px;
        min-height: 300px;
        text-align: center;
        border-radius: 8px;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.08);
        .public-img {
          width: 250px;
          height: 233px;
        }
        .module-title {
          padding-left: 15px;
          .module-title-Fun
        }
        .module-ul {
          display: flex;
          flex-wrap: wrap;
          height: calc(100% - 54px);
          .module-box {
            width: 50%;
            text-align: center;
            cursor: pointer;
            .img {
              margin-bottom: 8px;
              width: 62px;
              height: 62px;
            }
          }
        }
      }
      .app-module {
        margin-bottom: 20px;
        border-radius: 8px;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.08);
      }
    }
  }
}
</style>
