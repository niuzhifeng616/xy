<!-- 学期课表 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-title">
      <div class="clearfix">
        <div class="fl">
          <span class="tishi">校区：</span>
          <Select v-model="school" @on-change="schoolChange" class="xy-content-title-search" style="width:150px">
            <Option v-for="(item,index) in schoolData" :value="item.SchoolDistrictID" :key="index">{{item.SchoolDistrictName}}</Option>
          </Select>
          <span class="tishi">学年：</span>
          <Select v-model="year" @on-change="yearChange" class="xy-content-title-search" placeholder="请选择学年" style="width:150px">
            <Option v-for="(item,index) in yearData" :value="item.ID" :key="index" v-cloak>{{ item.Name }}</Option>
          </Select>
          <span class="tishi">学期：</span>
          <Select v-model="session" @on-change="sessionChange" class="xy-content-title-search" placeholder="请选择学期" style="width:150px">
            <Option v-for="(item,index) in sessionData" :value="item.AcademicSessionID" :key="index" v-cloak>{{ item.AcademicSessionName }}</Option>
          </Select>
        </div>
      </div>
    </div>

    <div class="xy-content-body">
      <div v-if="tableData.length > 0">
        <ul class="plan-list">
          <li v-for="(item,index) in tableData" :key="index" @click="classCheck(item)" :class="item.isCheck?'is-checked':''">
            <i class="iconfont icon-holiday" style=" background:#FFBF00">&#xe703;</i>
            <div class="info">
              <p class="f16 class-table-name" :title="item.ClassTableName" v-cloak>{{item.ClassTableName}}</p>
              <div>
                <span v-cloak class="fl">{{item.CollectionName}}</span>
                <span class="fr pr" v-cloak>{{item.ClassTableType}}</span>
              </div>
              <div class="" :class="item.isCheck?'active-bg sanjiao':'sanjiao'"><i class="iconfont">&#xe6a1;</i></div>
            </div>
          </li>
        </ul>
        <div class="fix-btn">
          <Button class="xy-btn-primary" shape="circle" @click="submit">确定</Button>
        </div>
      </div>
      <div v-else class="no-data-box">
        <img class="no-data-img" :src="require('@/assets/common/nullData.svg')" />
        <span class="no-data-text">
          该搜索条件下没有结果。
        </span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        year: '',
        yearData: [],
        session: '',
        sessionData: [],
        school: 0,
        schoolData: [],
        tableData: [],
        checkTable: []
      }
    },
    created () {
      this.$store.commit('common/getThreeMenuName', '')
      this.getSchool()
    },
    mounted: function () {

    },
    methods: {
      // 获取排课方案
      async getClassTables () {
        // let schoolID = 0
        // let yearID = 0
        // let sessionID = 0
        // if (this.school !== 0) {
        //   schoolID = this.school.SchoolDistrictID
        // };
        // if (this.year !== '') {
        //   yearID = this.year.ID
        // };
        // if (this.session !== '' && this.session !== undefined) {
        //   sessionID = this.session.AcademicSessionID
        // };
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportSessionTimeTable/ClassTables`, {
          schoolDistrictID: this.school || 0,
          academicYearID: this.year || 0,
          academicSessionID: this.session || 0
        })
        if (res.success) {
          this.xy.unloading()
          this.tableData = []
          this.checkTable = []// 清空选中的排课方案
          let resData = res.data
          resData.map((item) => {
            item.isCheck = false
            return item
          })
          this.tableData = res.data
        }
      },
      // 选中排课方案
      classCheck (val) {
        val.isCheck = !val.isCheck
        if (this.checkTable.length === 0) {
          this.checkTable.push(val)
        } else {
          let index = this.checkTable.map((item) => { return item.ClassTableID }).indexOf(val.ClassTableID)
          if (index === -1) {
            this.checkTable.push(val)
          } else {
            this.checkTable.splice(index, 1)
          }
        }
      },
      // 校区
      schoolChange (val) {
        this.getClassTables()
      },
      // 学年
      yearChange (val) {
        this.session = ''
        this.getSession(val)
      },
      // 学期
      sessionChange: function () {
        if (this.session !== '' && this.session !== null && this.session !== undefined) {
          this.getClassTables()
        } else {
          this.tableData = []
        }
      },
      // 获取校区
      async getSchool () {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi + '/base'}/xy/comm/SchoolDistrictList`)
        if (res.success) {
          this.xy.unloading()
          this.schoolData = res.data
          if (this.schoolData.length > 0) {
            this.school = this.schoolData[0].SchoolDistrictID
          }
          this.getYear()
        }
      },
      // 获取学年
      async getYear () {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi + '/base'}/xy/comm/YearList`)
        if (res.success) {
          this.xy.unloading()
          this.yearData = res.data
          if (res.data.length > 0) {
            let arr = res.data.filter((item) => { return item.IsCurrent === true })
            if (arr.length > 0) {
              this.year = arr[arr.length - 1].ID
            } else {
              this.year = ''
            }
          }
          if (this.year !== '') {
            this.getSession(this.year)
          } else {
            this.getSession(0)
          }
        }
      },
      // 获取学期
      async getSession (id) {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi + '/base'}/xy/comm/SessionList`, {
          yearID: id
        })
        if (res.success) {
          this.xy.unloading()
          this.sessionData = []
          this.session = ''
          this.sessionData = res.data
          if (res.data.length > 0) {
            let arr = res.data.filter((item) => { return item.IsCurrent === true })
            if (arr.length > 0) {
              this.session = arr[arr.length - 1].AcademicSessionID
            } else {
              this.session = ''
            }
          }
          if (this.session !== '' && this.session !== null && this.session !== undefined) {
            this.getClassTables()
          }
        }
      },
      // 确定
      async submit () {
        if (this.checkTable.length === 0) {
          this.xy.msgError('请选择排课方案。')
          return false
        };

        let datas = {
          classTable: this.checkTable,
          year: '',
          session: '',
          pro: 'semesterQueryConditions'
        }
        this.yearData.filter(item => {
          if (item.ID === this.year) {
            datas.year = item.Name
          }
        })
        this.sessionData.filter(item => {
          if (item.AcademicSessionID === this.session) {
            datas.session = item.AcademicSessionName
          }
        })
        let classTableIDs = ''
        let name = `${datas.year}、${datas.session}、`
        this.checkTable.map((item, index) => {
          classTableIDs = classTableIDs + item.ClassTableID + ','
          name += item.ClassTableName + (index + 1 !== this.checkTable.length ? '、' : '')
        })
        this.$store.commit('csmstimetable/changeScheduleQuery', datas)
        this.$store.commit('common/getThreeMenuName', name)
        this.$store.commit('common/getParam', datas)
        this.$router.push({
          path: `/xyhome/SemesterScheduleHeader`,
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/QueryConditions.less';
</style>
