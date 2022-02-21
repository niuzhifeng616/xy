<template>
  <div class="xy-content-module">
     <div class="gradeName">
       {{changeMoralObj.gradeName}}{{changeMoralObj.className}}
     </div>
    <div class="xy-content-body">
        <XyAntTable
          :columns="columns"
          :dataSource="tableData"
          :tableLoading="tableLoading"
          :isPage="false"
          :scrollx="'max-content'"
          >
          <div slot="StudentIcon" slot-scope="text, record">
            <div v-if="!record.Icon" :class="`head-con ${record.SexName === '女' ? 'woman' : 'man'}`">
              <span class="head-font">
                {{ xy.showName(record.FullName)}}
              </span>
            </div>
            <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
          </div>
          <div slot="FullName" style="min-width:200px" slot-scope="text, record">
            <span class="table-el-hover" @click="goStudent(record)">
              {{ record.FullName}}
            </span>
          </div>
          <div slot="UserName" slot-scope="text, record">
            <div style="min-width:150px">
              {{ record.UserName}}
            </div>
          </div>
          <div slot="Score" slot-scope="text, record">
            <div style="min-width:150px">
              {{ record.Score}}
            </div>
          </div>
          <span slot="oprate" slot-scope="text, record">
            <a @click="goStudent(record)">详情</a>
          </span>
        </XyAntTable>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    components: {
      XyAntTable
    },
    name: 'stuDetails',
    data () {
      return {
        passData: {},
        tableLoading: true,
        tableData: [], // table数据
        columns: [
          {
            title: ' ',
            dataIndex: 'StudentIcon',
            width: 60,
            scopedSlots: { customRender: 'StudentIcon' },
            className: 'table-pic'
          },
          {
            title: '姓名',
            dataIndex: 'FullName',
            scopedSlots: { customRender: 'FullName' }
          },
          {
            title: '用户名',
            dataIndex: 'UserName',
            scopedSlots: { customRender: 'UserName' }
          },
          {
            title: '得分',
            dataIndex: 'Score',
            scopedSlots: { customRender: 'Score' }
          },
          {
            title: '操作',
            width: 80,
            dataIndex: 'oprate',
            scopedSlots: { customRender: 'oprate' }
          }]
      }
    },
    created () {
      this.getQuestionnaires()
    },
    computed: {
      changeMoralObj () {
        return this.$store.state.evaluate.changeMoralObj
      }
    },
    methods: {
      goStudent (row) {
        this.$parent.settingComponent = 'oneStuDetails'
        this.$parent.backUrl = 'stuDetails'
        this.$store.commit('evaluate/changeMoralObj', {
          stuID: row.StudentID,
          gradeName: this.$store.state.evaluate.changeMoralObj.gradeName,
          className: this.$store.state.evaluate.changeMoralObj.className,
          fullName: row.FullName,
          passData: this.passData
        })
      },
      async getQuestionnaires () {
        let params = {
          schoolDistrictID: this.$parent.schoolSession[0],
          academicYearID: this.$parent.yearSession[0],
          academicSessionID: this.$parent.yearSession[1],
          studentGradeForStudentYearID: this.$parent.schoolSession[1],
          studentOrganizationId: this.$parent.schoolSession[2]
        }
        this.tableLoading = true
        let res = await this.xy.get(this.$store.state.apiPath + '/api/MoralEducationStatistics/GetStudentDetailStatistics', params)
        this.tableLoading = false
        if (res.success) {
          this.tableData = res.data
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.title {
  font-size: 16px;
  text-align: left;
  color: rgba(0, 0, 0, 0.85);
  padding: 10px 0;
}
.gradeName{
  background: #ffffff;
  padding: 0 20px 20px;
  font-size: 18px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.75);
}
</style>
