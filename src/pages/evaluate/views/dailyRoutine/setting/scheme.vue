<template>
  <div class="xy-content-module" v-if="F5">
    <div class="xy-content-title xy-flex xy-between">
      <div class="">
        <Button class="xy-primary" @click="creat">创建方案</Button>
        <Button class="xy-info" @click="target">指标管理</Button>
      </div>
      <div class="xy-flex xy-center">
        <div class="xy-flex xy-center">
          <label>校区：</label>
          <Select v-model="SchoolDistrictID"
                @on-change="schoolChange"
                class="mr-15"
                style="width:200px">
          <Option :value="0" key="01">所有校区</Option>
          <Option v-for="(item,index) in schoolData" :value="item.SchoolDistrictID" :key="index">{{item.SchoolDistrictName}}</Option>
        </Select>
        </div>
        <div class="xy-flex xy-center">
          <label>学年/学期：</label>
          <Cascader
            :data="yearSemesterList"
            @on-change="changeYear"
            v-model="yearSemester"
            :clearable="false"
            placeholder="学年/学期"
            style="margin-right:10px;"></Cascader>
        </div>
        <div class="xy-flex xy-center">
          <Input suffix="ios-search" search v-model="searchName" @on-search="onSearch" placeholder="请输入方案名称" style="width:200px" />
        </div>
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
          :columns="columns"
          :dataSource="tableData"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="950"
          >
          <div slot="ProgrammeName" style="min-width:200px" slot-scope="text, record">
            <span class="table-el-hover" @click="edit(record)">
              {{ record.ProgrammeName}}
            </span>
          </div>
          <div slot="switch" slot-scope="text, record">
            <a-switch checked-children="启用" un-checked-children="停用" :disabled="record.IsComplete" :checked="record.IsEnable === 1" @change="getIndexNum(record)" />
          </div>
          <span slot="oprate" slot-scope="text, record">
            <a @click="edit(record)">编辑</a>
            <a-divider type="vertical" />
            <a :disabled="record.IsEnable === 1" @click="del(record)">删除</a>
          </span>
        </XyAntTable>
    </div>

  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: {
      XyAntTable
    },
    name: 'scheme',
    data () {
      return {
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        schoolSelect: '',
        F5: true,
        columns: [],
        tableData: [],
        selectionAll: [],
        searchName: '',
        SchoolDistrictID: 0,
        yearSemester: [],
        yearSemesterList: [],
        yearSelect: [],
        modalCopy: false,
        copyOkLoading: false,
        formValidateOK: {
          classTableName: '',
          school: '',
          session: [],
          gradeYear: ''
        },
        studentGradeForStudentYearID: 0,
        studentGradeName: '',
        ruleValidateOK: {
          school: [{
            type: 'number',
            required: true,
            message: '请选择校区',
            trigger: 'change'
          }],
          session: [{
            type: 'array',
            required: true,
            message: '请选择学年学期',
            trigger: 'change'
          }],
          gradeYear: [{
            type: 'number',
            required: true,
            message: '请选择年级',
            trigger: 'change'
          }],
          classTableName: [{
                             required: true,
                             message: '方案名称不能为空',
                             trigger: 'blur'
                           },
                           {
                             max: 15,
                             message: '方案名称不能超过15个字',
                             trigger: 'blur'
                           }
          ]
        },
        schoolData: [],
        studentGradeData: [],
        yearSessionData: []
      }
    },
    created () {
      this.getSchoolGrade()
    },
    methods: {
      handleTableChange () {
        this.GetProgrammePage()
      },
      // 刷新
      provide () {
        return {
          reload: this.reload
        }
      },
      reload () {
        this.F5 = false
        this.$nextTick(() => {
          this.F5 = true
        })
      },
      // 获取列表
      GetProgrammePage () {
        this.tableLoading = true
        this.xy.get(`${this.$store.state.apiPath}/api/MoralProgramme/GetProgrammeList`, {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          schoolDistrictID: this.schoolDistrictID,
          academicYearID: this.yearSemester[0],
          academicSessionID: this.yearSemester[1],
          ProgrammeName: this.searchName
        }).then(res => {
          this.tableLoading = false
          if (res.success) {
            this.tableData = res.data.data
            this.pagination.total = res.data.totalRecords
            this.columns = [
              {
                title: '方案名称',
                dataIndex: 'ProgrammeName',
                scopedSlots: { customRender: 'ProgrammeName' }
              },
              {
                title: '评价维度',
                width: 200,
                dataIndex: 'DimensionName'
              },
              {
                title: '校区',
                width: 200,
                dataIndex: 'SchoolDistrictName'
              },
              {
                title: '学期',
                width: 200,
                dataIndex: 'AcademicSessionName'
              },
              {
                title: '状态',
                width: 100,
                dataIndex: 'switch',
                scopedSlots: { customRender: 'switch' }
              },
              {
                title: '操作',
                width: 120,
                dataIndex: 'oprate',
                scopedSlots: { customRender: 'oprate' }
              }
            ]
          }
        })
      },
      // 获取校区、年级
      getSchoolGrade () {
        this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`).then(res => {
          if (res.success) {
            this.schoolData = res.data
            this.getTableSessionNodeList()
          }
        })
      },
      schoolChange (value) {
        this.pagination.current = 1
        this.schoolDistrictID = value
        this.GetProgrammePage()
      },
      // 获取学年、学期
      getTableSessionNodeList () {
        this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`).then(res => {
          if (res.success) {
            this.yearSemesterList = res.data
            let index = this.yearSemesterList.map(item => {
              return item.IsCurrent
            }).indexOf(true)
            if (index !== -1) {
              this.yearSemester.push(this.yearSemesterList[index].value)
              this.yearSelect.push(this.yearSemesterList[index].label)
              let index1 = this.yearSemesterList[index].children.map(item => {
                return item.IsCurrent
              }).indexOf(true)
              if (index1 !== -1) {
                this.yearSemester.push(this.yearSemesterList[index].children[index1].value)
                this.yearSelect.push(this.yearSemesterList[index].children[index1].label)
              }
            } else {
              for (let i = 0; i < this.yearSemesterList.length; i++) {
                if (this.yearSemesterList[i].children.length > 0) {
                  this.yearSemester = [this.yearSemesterList[i].value, this.yearSemesterList[i].children[0].value]
                  this.yearSelect = [this.yearSemesterList[i].label, this.yearSemesterList[i].children[0].label]
                  break
                }
              }
            }
            this.GetProgrammePage()
          }
        })
      },
      changeYear (value, selectedData) {
        this.pagination.current = 1
        this.yearSelect = [selectedData[0].label, selectedData[1].label]
        this.yearSemester = value
        this.GetProgrammePage()
      },
      onSearch () {
        this.GetProgrammePage()
      },
      // 评价指标
      async getIndexNum (row) {
        if (row.IsEnable === 0 || row.IsEnable === -1) {
          this.swithChange(row)
        } else {
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/MoralProgramme/ProgrammeRecordCount`, {
            ProgrammeID: row.ProgrammeID
          })
          if (res.success) {
            if (res.data > 0) {
              this.$Modal.confirm({
                title: '温馨提示',
                content: '该方案已进行评价操作。禁用后，再次编辑可能导致评价数据丢失，是否确定禁用该方案？',
                onOk: () => {
                  this.swithChange(row)
                },
                onCancel: () => {
                  this.reload()
                }
              })
            } else {
              this.swithChange(row)
            }
          }
        }
      },
      // 启用，停用
      async swithChange (row) {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MoralProgramme/ProgrammeIsEnable?ProgrammeID=${row.ProgrammeID}&IsEnable=${row.IsEnable !== 1}`)
        if (res.success) {
          if (row.IsEnable === 1) {
            this.xy.msgSuc('停用成功。')
          } else {
            this.xy.msgSuc('启动成功。')
          }
          this.GetProgrammePage()
        } else {
          this.GetProgrammePage()
        }
      },
      updateDraft (tableData, index, field) {
        const obj = Object.assign({}, tableData[index])
        this.$set(tableData, index, {})
        for (var key in field) {
          obj[key] = field[key]
        }
        this.$set(tableData, index, obj)
      },

      // 创建方案
      creat () {
        this.$store.commit('evaluate/changeMoralObj', {
          ProgrammeID: 0,
          IndicatorTypeID: -1,
          ProgrammeName: '',
          IsEnable: -1
        })
        this.$router.push({ path: '/xyhome/oneDayCreate' })
      },
      // 编辑
      edit (row) {
        this.$store.commit('evaluate/changeMoralObj', {
          ProgrammeID: row.ProgrammeID,
          ProgrammeName: row.ProgrammeName,
          IndicatorTypeID: row.IndicatorTypeID,
          IsEnable: row.IsEnable
        })
        this.$router.push({ path: '/xyhome/oneDayCreate' })
      },
      // 删除
      del (row) {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除"' + row.ProgrammeName + '"吗，确认删除后不保留历史数据？',
          onOk: () => {
            this.delObj(row.ProgrammeID)
          }
        })
      },
      async delObj (id) {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MoralProgramme/DeleteProgramme?ProgrammeID=${id}`)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          if (this.tableData.length > 1) {
            this.tableData.length = this.tableData.length - 1
          } else {
            if (this.pagination.current > 1) {
              this.pagination.current = this.pagination.current - 1
            }
          }
          this.GetProgrammePage()
        }
      },
      // 指标管理
      target () {
        this.$store.commit('common/getThreeMenuName', '指标管理')
        this.$store.commit('common/getParam', { pro: 'RoutineScheme' })
        this.$router.push({
          path: '/xyhome/targetManage',
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
