<template>
<!-- 教师权限 -->
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
        <alert show-icon v-if="studentOrganization.length===0 && !tableLoading">
            未查询到班级
            <template slot="desc">
                请先确认当前登陆人是否存在于某个班级中。
            </template>
        </alert>
        <div v-else>
            <div class="fl button-group btn-marbot" v-for="(item,index) in studentOrganization" :key="index">
                <i-button class="xy-primary" v-if="index == indexs" @click="show(item.StudentOrganizationID, index)" :title="item.FullName" v-cloak>{{item.FullName}}</i-button>
                <i-button class="xy-info" v-else @click="show(item.StudentOrganizationID, index)" :title="item.FullName" v-cloak>{{item.FullName}}</i-button>
            </div>
        </div>
    </div>
    <div class="xy-content-body">
      <alert show-icon v-if="datatable.length===0 && !tableLoading">
            未查询到成绩
            <template slot="desc">
                请在上方先选择班级或先确认当前班级是否添加了学生。
            </template>
        </alert>
        <div class="xy-content-table pr" v-else>
          <XyAntTable
            ref="selection"
            :isPage="false"
            :columns="columns"
            :dataSource="datatable"
            :tableLoading="tableLoading"
            :scrollx="'max-content'"
            >
            <div slot="key" slot-scope="text, record">
              {{record.key + 1}}
            </div>
            <div slot="UserName" style="min-width: 120px" slot-scope="text, record">
              <span class="table-el-hover" @click="showstu(record)">
                {{ record.UserName}}
              </span>
            </div>
            <div slot="Name" slot-scope="text, record">
              <div style="min-width: 120px">
                {{record.Name}}
              </div>
            </div>
            <div slot="operation" slot-scope="text, record">
              <a @click="showstu(record)">查看</a>
            </div>
          </XyAntTable>
        </div>

    </div>
</div>

</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'headmasterShowAchievement',
    components: {
      XyAntTable
    },
    data () {
      return {
        indexs: 0,
        modal_loading: false,
        loading: true,
        tableLoading: true, // table数据改变时为true，默认false
        studentOrganizationID: 0,
        studentOrganization: [],
        APIPath: this.$store.state.apiPath + '/api/Achievement',
        columns: [],
        datatable: [] // table数据
      }
    },
    created () {
      // 渲染table数据
      // 加载行政班
      this.getHeadmasStuOrg()
    },
    mounted () {
      this.$Message.config({
        top: 70,
        duration: 2
      })
    },
    methods: {
      async getHeadmasStuOrg () {
        let res = await this.xy.get(this.xyApi + '/base/api/StudentOrganization/GetHeadmasterStudentOrganization')
        if (res.success) {
          this.studentOrganization = res.data
          if (res.data != null && res.data.length > 0) {
            this.studentOrganizationID = res.data[0].StudentOrganizationID
          }
          let _data = {
            studentOrganizationID: this.studentOrganizationID
          }
          this.getTP(_data)
        }
      },
      async getTP (data) {
        this.tableLoading = true
        this.datatable = []
        let res = await this.xy.get(this.xyApi + `/base/api/StudentOrganizationMember/GetStudentOrganizationMember`, { studentOrganizationID: data.studentOrganizationID })
        if (res.success) {
          this.tableLoading = false
          this.columns = [
            {
              title: '序号',
              dataIndex: 'key',
              width: 80,
              scopedSlots: { customRender: 'key' }
            },
            {
              title: '班级',
              dataIndex: 'StudentOrganizationName',
              width: 160
            },
            {
              title: '用户名',
              dataIndex: 'UserName',
              scopedSlots: { customRender: 'UserName' }
            },
            {
              title: '姓名',
              dataIndex: 'Name',
              scopedSlots: { customRender: 'Name' }
            },
            {
              title: '模块成绩',
              dataIndex: 'operation',
              width: 100,
              scopedSlots: { customRender: 'operation' }
            }
          ]
          if (res.data.length !== 0) {
            this.datatable = res.data[0].MemberList
            this.datatable.map((item, index) => {
              this.$set(item, 'key', index)
            })
          } else {
            this.datatable = []
          }
        }
      },
      show (id, index) {
        this.indexs = index
        let _data = {
          studentOrganizationID: id
        }
        this.getTP(_data)
      },
      // 查询学生模块成绩
      showstu (row) {
        // xy.http.load(xy.subMenuWebUrl + '/View/eaAchievement/AchievementManage/PC/View/HeadmasterStudentShowAchievement.html', { targetID: 'XyContentModuleReplace', loadParams: { 'Row': JSON.stringify(row) } }, function () { })
        this.$store.commit('common/getThreeMenuName', '查询学生模块成绩')
        this.$store.commit('common/getParam', row)
        this.$router.push({ path: `/xyHome/HeadmasterStudentShowAchievement`, query: this.$store.state.common.menuInfo })
      }
    }
  }
</script>

<style lang="less" scoped>
@import '../css/achievementReport.less';
.btn-marbot {
  margin-bottom: 10px;
}
</style>
