<template>
  <div class="xy-content-module">
    <div class="xy-content-title">
      <div class="clearfix">
        <div class="fl" v-if="datatable.length > 0">
          <Button class="xy-primary fl"  @click="exportModal">导出学生名单</Button>
          <Alert class="fl" style="margin-left:15px;" show-icon closable>我的学生共<b >&nbsp;{{ datatable.length }}&nbsp;</b>名。</Alert>
        </div>
        <div class="fr xy-flex">
          <div style="margin-right:15px">
            <span>学年学期：</span>
            <cascader :data="yearSessionData" v-model="yearSession" style="width:200px; display:inline-block" @on-change="cascaderChange">
            </cascader>
          </div>
          <div>
            <span>班级：</span>
            <Select
              v-model="subjectVal"
              @on-change="subjectChange"
              style="width:200px">
              <Option
                v-for="item in subjectData"
                :value="item.CollectionID + ',' + item.CoursePlanAID + ',' + item.CoursePlanAIDType"
                :key="item.CoursePlanAID"
                >{{item.SubjectName }}|{{item.CoursePlanTableFullName}}</Option>
            </Select>
          </div>
        </div>
      </div>
    </div>
    <div class="xy-content-body">
      <div class="table">
          <!-- 未在所选学期查到您任教的班级。 -->
          <XyAntTable
            :columns="columns"
            :dataSource="datatable"
            nullData="该搜索条件下没有结果。"
            :tableLoading="tableLoading"
            :isPage="false">
            <!-- 头像 -->
            <div slot="IconRender" slot-scope="text, record">
              <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
                <span class="head-font">
                  {{ xy.showName(record.StudentName)}}
                </span>
              </div>
              <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
            </div>
            <!-- 用户名 -->
            <div slot="UserNameRender" slot-scope="text, record" style="min-width:500px">
              <span>
                {{record.UserName}}
              </span>
            </div>
            <!-- 所在行政班 -->
            <div slot="CoursePlanTableFullNameRender" slot-scope="text, record"  style="min-width:300px">
              <span>
                {{`${record.CoursePlanTableFullName}${subjectType==='CP' ? '' : ' ' + record.StudentOrganizationName}`}}<!-- 行政班CP 教学班CL 自习班SS -->
              </span>
            </div>
          </XyAntTable>
      </div>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'MyStudent',
    components: { XyAntTable },
    data () {
      return {
        yearSessionData: [],
        yearSession: [],
        subjectData: [],
        subjectVal: 0,
        curricula: '',
        subjectType: '', // 筛选的班级类型 教学班CL 行政班CP 自习班SS

        tableLoading: true,
        datatable: [],
        columns: [
          {
            title: ' ',
            dataIndex: 'Icon',
            scopedSlots: { customRender: 'IconRender' },
            className: 'table-pic',
            width: 18
          }, {
            title: '姓名',
            dataIndex: 'StudentName',
            width: 250
          }, {
            title: '用户名',
            dataIndex: 'UserName',
            scopedSlots: { customRender: 'UserNameRender' }
          }, {
            title: '所在行政班',
            dataIndex: 'CoursePlanTableFullName',
            scopedSlots: { customRender: 'CoursePlanTableFullNameRender' }
          }
        ]
      }
    },
    created () {
      this.getSessionNodeList()
    },
    methods: {
      // 学年学期
      async getSessionNodeList () {
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`)
        if (res.success) {
          this.yearSessionData = res.data
          this.yearSession = []
          var index = this.yearSessionData.map((item) => { return item.IsCurrent }).indexOf(true)
          if (index !== -1) {
            this.yearSession.push(this.yearSessionData[index].value)
            var index1 = this.yearSessionData[index].children.map((item) => { return item.IsCurrent }).indexOf(true)
            if (index1 !== -1) {
              this.yearSession.push(this.yearSessionData[index].children[index1].value)
            }
          } else {
            for (var i = 0; i < this.yearSessionData.length; i++) {
              if (this.yearSessionData[i].children.length > 0) {
                this.yearSession = [this.yearSessionData[i].value, this.yearSessionData[i].children[0].value]
                return false
              }
            }
          }
          this.getAllCurricula(this.yearSession[1])
        }
      },
      // 切换学年学期
      cascaderChange (value, selectedData) {
        this.yearSession = value
        this.getAllCurricula(value[1])
        this.datatable = []
      },

      // 获取课程信息
      async getAllCurricula (sessionID) {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MyStudents/GetAllCurricula`, { sessionID: sessionID })
        if (res.success) {
          this.subjectData = []
          this.subjectData = res.data
          if (this.subjectData.length > 0) {
            this.subjectVal = this.subjectData[0].CollectionID + ',' + this.subjectData[0].CoursePlanAID + ',' + this.subjectData[0].CoursePlanAIDType
            this.subjectType = this.subjectData[0].CoursePlanAIDType
          } else {
            this.subjectVal = 0
            this.tableLoading = false
          }
          if (this.subjectVal !== 0) {
            this.getStudents(this.subjectVal.toString())
          }
        }
      },
      // 年级和学科
      subjectChange (val) {
        // 教学班CL 行政班CP
        if (val && val.indexOf('CL') > -1) {
          this.subjectType = 'CL'
        } else if (val && val.indexOf('CP') > -1) {
          this.subjectType = 'CP'
        } else if (val && val.indexOf('SS') > -1) {
          this.subjectType = 'SS'
        }
        if (val !== undefined) {
          this.getStudents(val.toString())
        } else {
          this.tableLoading = false
        }
      },
      // 获取学生
      async getStudents (curricula) {
        this.curricula = curricula
        this.tableLoading = true
        this.datatable = []
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MyStudents/GetStudents`, { sessionID: this.yearSession[1], curricula: curricula })
        if (res.success) {
          this.datatable = res.data
        }
        this.tableLoading = false
      },
      // 导出
      exportModal () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/MyStudents/ExportStudents?curricula=${this.curricula}&sessionID=${this.yearSession[1]}`)
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
