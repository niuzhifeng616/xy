<!-- 2.选课结果：学生成绩：table -->
<template>
  <div id="selectResult">
    <XyAntTable :columns="columns"
                :dataSource="dataTable"
                nullData="该搜索条件下没有结果。"
                :tableLoading="tableLoading"
                :pagination="pagination"
                :scrollx="'max-content'"
                @change="handleTableChange">
      <div slot="Icon"
           slot-scope="text, record">
        <div v-if="!record.Icon"
             :class="`head-con ${record.Sex === '女' ? 'woman' : 'man'}`">
          <span class="head-font">
            {{ xy.showName(record.FullName)}}
          </span>
        </div>
        <img style="width:30px;height:30px;border-radius:50%"
             v-else
             :src="record.Icon + '?' + Math.random() * 15">
      </div>
      <div slot="FullName"
           slot-scope="text, record">
        <div
             :class="smartDivideStepsHeader.isOperation === 0 ? 'table-el-hover' : ''"
             @click="adjust(record)">
          {{record.FullName}}
        </div>
      </div>
      <div slot="ClassName"
           slot-scope="text, record">
        <div style="min-width:100px">{{record.ClassName}}</div>
      </div>
      <template v-for='(item,index) in formSubject'>
        <div :slot="'result' + index" slot-scope="text, record" :key='index'>
          <div style="min-width:100px">{{record['result' + index]}}</div>
        </div>
      </template>
      <div slot="oprateRender"
           slot-scope="text, record">
        <a @click="adjust(record)"
           :disabled="smartDivideStepsHeader.isOperation !== 0">调整成绩</a>
      </div>
    </XyAntTable>
    <!-- 调整成绩 -->
    <modal v-model="changeScoreModal"
           :transfer="false"
           title="调整成绩"
           :mask-closable="false"
           width=620>
      <h3 class="text-center studentScoreAdujstTitle">{{StudentName}}的成绩</h3>
      <Form label-position="right"
            :label-width="80"
            inline
            style="margin-top: 15px">
        <template v-for='(item,index) in formSubject'>
          <FormItem :label="item.DisciplineName"
                    :key='index'
                    :label-for='`course${index}`'>
            <input-number style="width: 100px;"
                          :min="0"
                          :element-id='`course${index}`'
                          v-model='item.Score'
                          placeholder="请输入成绩">
            </input-number>
          </FormItem>
        </template>
      </Form>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="changeScoreModal=false">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="sureChangeScore">确定</Button>
      </div>
    </modal>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: { XyAntTable },
    data () {
      return {
        StudentID: '',
        StudentName: '',
        tableLoading: true,
        pagination: {
          total: 0,
          current: 1,
          pageSize: 15,
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        pageList: 0,
        dataTable: [],
        columns: [],
        // 已选课程
        totalCrouse: 0,
        dataTableCourse: [],
        // 调整成绩
        changeScoreModal: false,
        formSubject: [], // 调整成绩
        smartDivideStepsHeader: {},
        StudentScore: {}
      }
    },
    created () {
      this.smartDivideStepsHeader = this.$parent.$parent
      this.StudentScore = this.$parent
      this.getTable()
    },

    methods: {
      // 获取选课结果（学生）
      async getTable () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetPageOfStudentAchievement`, {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          divideClassID: this.smartDivideStepsHeader.divideClassID,
          name: this.StudentScore.searchText,
          StudentOrganizationIDS: this.StudentScore.classOrganizationIDs.join(',') || '',
          noAchievement: this.StudentScore.isSelectNum
        })
        this.tableLoading = false
        if (res.success) {
          let datas = res.data
          this.pagination.total = datas.TotalRecords
          this.dataTable = []
          this.pageList = datas.Data.length
          this.columns = []
          this.columns = [
            {
              title: ' ',
              dataIndex: 'Icon',
              width: 48,
              scopedSlots: { customRender: 'Icon' },
              className: 'table-pic',
              fixed: 'left'
            },
            {
              title: '姓名',
              dataIndex: 'FullName',
              scopedSlots: { customRender: 'FullName' },
              fixed: 'left',
              width: 150
            },
            {
              title: '用户名',
              dataIndex: 'UserName',
              width: 150,
              fixed: 'left'
            },
            {
              title: '性别',
              dataIndex: 'Sex',
              width: 80
            },
            {
              title: '原行政班',
              dataIndex: 'ClassName',
              scopedSlots: { customRender: 'ClassName' },
              width: 150
            }
          ]

          for (let i = 0; i < datas.Subjects.length; i++) {
            this.columns.push({
              title: datas.Subjects[i].DisciplineName,
              dataIndex: 'result' + i,
              scopedSlots: { customRender: 'result' + i }

            })
            datas.Subjects[i].Score = null
          };
          this.formSubject = datas.Subjects // 调整成绩，弹框显示的课程
          this.columns.push({
            title: '操作',
            dataIndex: 'oprateRender',
            width: 100,
            fixed: 'right',
            scopedSlots: { customRender: 'oprateRender' }
          })
          let resData = datas.Data
          for (let j = 0; j < resData.length; j++) {
            if (resData[j].Course.length > 0) {
              for (let k = 0; k < resData[j].Course.length; k++) {
                if (resData[j].Course[k]) {
                  resData[j]['result' + k] = resData[j].Course[k].Score
                }
              }
            };
            this.$set(resData[j], 'key', j)
          }
          this.dataTable = resData
        }
      },
      handleTableChange () {
        this.getTable()
      },
      // 选中的调整
      adjust (row) {
        if (this.smartDivideStepsHeader.isOperation === 0) {
          this.StudentID = row.StudentID
          this.StudentName = row.FullName
          this.changeScoreModal = true
          // 显示学生成绩
          if (row.Course.length > 0) {
            row.Course.map((item) => {
              this.formSubject.map((j) => {
                if (item.DisciplineID === j.DisciplineID) {
                  j.Score = typeof item.Score === 'number' || typeof item.Score === 'string' ? Number(item.Score) : null
                }
              })
            })
          }
        }
      },
      async sureChangeScore () {
        let arr = []
        this.formSubject.map((item) => {
          arr.push({ DisciplineID: item.DisciplineID, Score: item.Score, StudentID: this.StudentID })
        })
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/EditStudentScore`, { divideClassID: this.smartDivideStepsHeader.divideClassID, models: arr })
        if (res.success) {
          this.changeScoreModal = false
          this.getTable()
          this.xy.msgSuc('调整成功。')
        }
      }

    }

  }
</script>
<style lang='less' scoped>
.img-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.studentScoreAdujst {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.studentScoreAdujstTitle {
  margin-bottom: 10px;
  font-size: 16px;
}

.studentScoreAdujst > div {
  width: 33%;
  margin-bottom: 10px;
}
</style>
