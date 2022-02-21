<template>
<!-- 教师监考表 -->
<div id="StepsContent">
    <div class="xy-flex xy-justy-default" v-if='TList.length>0'>
        <Button @click="exportBtn" type="primary">导出</Button>
        <Input
          search
          v-model.trim="searchName"
          placeholder="请输入用户名/姓名"
          @on-search="FromSubmit"
          class="fr xy-content-title-search"
          style="width: auto;"
          />
    </div>
    <!--暂无数据-->
    <div v-if="isNull && tableLoading === false" class="no-data-box" v-cloak>
        <img class="no-data-img" :src="require('@/assets/common/nullData.svg')" />
        <span class="no-data-text" v-cloak>该搜索条件下没有结果。</span>
    </div>
    <div v-else style="margin-top:10px;">
        <div>
            <div v-for="(item, index) in TList" :key="index" class="t-form" v-show="item.isShow" v-cloak>
                <div class="teacherTit">{{item.TeacherName}} ({{item.UserName}})</div>
                <XyAntTable
                  :columns="columns"
                  :dataSource="TList[index].DetaileInfo"
                  :tableLoading="tableLoading"
                  :isPage="false"
                  :isTop="false"
                  :scrollx="'max-content'"
                  >
                  <div style="min-width: 160px" slot="InvigiltorSubjectName" slot-scope="text, record">
                    {{record.InvigiltorSubjectName}}
                  </div>
                  <div style="min-width: 220px" slot="InvigiltorDateTime" slot-scope="text, record">
                    {{record.InvigiltorDateTime}}
                  </div>
                  <div style="min-width: 120px" slot="InvigiltorAddress" slot-scope="text, record">
                    {{record.InvigiltorAddress}}
                  </div>
                  <div style="min-width: 100px" slot="InvigiltorStudentCount" slot-scope="text, record">
                    {{record.InvigiltorStudentCount}}人
                  </div>
                </XyAntTable>
            </div>
        </div>
    </div>
</div>

</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: {
      XyAntTable
    },
    name: 'TeacherForm',
    data () {
      return {
        isNull: false,
        searchName: '',
        TList: [],
        tableLoading: false,
        columns: [
          {
            title: '课程',
            dataIndex: 'InvigiltorSubjectName',
            scopedSlots: { customRender: 'InvigiltorSubjectName' }
          },
          {
            title: '监考时间',
            dataIndex: 'InvigiltorDateTime',
            scopedSlots: { customRender: 'InvigiltorDateTime' }
          },
          {
            title: '监考教室',
            dataIndex: 'InvigiltorAddress',
            scopedSlots: { customRender: 'InvigiltorAddress' }
          },
          {
            title: '监考人数',
            dataIndex: 'InvigiltorStudentCount',
            scopedSlots: { customRender: 'InvigiltorStudentCount' }
          }
        ]

      }
    },
    props: ['ASExamID'],
    watch: {
      ASExamID (newVal, oldVal) {
        this.ArrangeSupervisorExamID = newVal
        this.getTList()
      }
    },
    created () {
      this.ArrangeSupervisorExamID = this.ASExamID
      this.getTList()
    },
    mounted () { },
    methods: {
      async getTList () {
        this.xy.loading()
        // this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportSummary/GetInvigilatorTeacherTableByID`, {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID
        })
        // this.tableLoading = false
        this.xy.unloading()
        if (res.success) {
          this.TList = res.data
          this.TList.forEach((item) => {
            this.$set(item, 'check', true)
            this.$set(item, 'isShow', true)
          })
        }
      },
      FromSubmit () {
        this.TList.map((item) => {
          if (item.TeacherName.indexOf(this.searchName) >= 0 || item.UserName.indexOf(this.searchName) >= 0 || this.searchName === '') {
            item.isShow = true
          } else {
            item.isShow = false
          }
        })
        var newArr = this.TList.filter((item) => {
          return item.isShow
        })
        this.isNull = !(newArr.length > 0)
      },
      changeCheck (vals) {
        vals.check = !vals.check
      },
      // 导出
      exportBtn () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/ReportSummary/ExportInvigilatorTeacherTableByID`, {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID
        })
      }
    }
  }
</script>

<style lang="less" scoped>
#StepsContent {
  padding: 20px;
}
/*教师监考表*/
.t-form {
  margin-bottom: 35px;
}

.teacherTit {
  font-size: 16px;
  font-weight: bold;
  color: rgba(0, 0, 0, .85);
  line-height: 46px;
}

.t-form-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  height: 50px;
  background: rgba(247, 247, 247, 1);
}

.t-rotate.noactive {
  transform: rotate(-90deg);
}

.t-form-content {
  padding: 15px;
}

.t-form-list {
  display: flex;
  flex-wrap: wrap;
}

.t-form-list>li {
  width: 320px;
  height: 122px;
  padding: 10px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(120, 180, 253, 1);
  border-radius: 8px;
  margin-bottom: 20px;
  margin-right: 30px;
}

.t-form-list-subject-name {
  font-size: 16px;
  font-weight: bold;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 230px;
}

.t-form-list-subject-nums {
  position: absolute;
  right: -10px;
  top: 0;
  width: 70px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  color: #4f9623;
  background: rgba(236, 250, 231, 1);
  border-radius: 15px 0px 0px 15px;
}

.t-form-list-subject-nums>b {
  font-size: 20px;
}

.t-form-list-time {
  margin-top: 18px;
}

.t-form-list-room {
  margin-top: 10px;
  display: flex;
}

.t-form-list-time>span:nth-child(1),
.t-form-list-room>span:nth-child(1) {
  color: #666;
}
</style>
