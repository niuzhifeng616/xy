<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between">
      <div class="">
        <Button class="xy-primary" @click="creat">创建方案</Button>
        <Button class="xy-info" @click="target">指标管理</Button>
      </div>
      <div class="xy-flex xy-center">
        <div class="xy-flex xy-center">
          <label>校区/年级：</label>
          <Cascader
            :data="schoolGradeList"
            @on-change="changeSchool"
            v-model="schoolGrade"
            :clearable="false"
            placeholder="校区/年级"
            style="margin-right:10px;"></Cascader>
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
          :nullData="'该搜索条件下没有结果。'"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="'max-content'"
          >
          <!-- 方案名称 -->
          <div slot="ProgrammeName" style="min-width:200px" slot-scope="text,record">
            <span class="table-el-hover" @click="edit(record)">
              {{record.ProgrammeName}}
            </span>
          </div>
          <!-- 状态 -->
          <div slot="IsComplete"  slot-scope="text,record">
            <a-switch checked-children="启用" un-checked-children="关闭" :disabled="record.IsComplete"  :checked="record.IsEnable==='1'"  @change="swithChange(record)" />
          </div>
          <!-- 操作 -->
          <div slot="operation" slot-scope="text, record">
            <a @click="edit(record)">编辑</a>
            <a-divider type="vertical" />
            <a :disabled="record.IsEnable==='1'" @click="del(record)">删除</a>
          </div>
         </XyAntTable>
    </div>
    <!-- 复制方案 -->
    <Modal v-model="modalCopy" :transfer="false" :mask-closable="false">
        <p slot="header">复制课堂评价方案</p>
       <div class="dialog-model-content">
          <Form ref="formValidateOK" :model="formValidateOK" :rules="ruleValidateOK" >
              <FormItem label="方案名称" prop="classTableName" >
                  <i-input v-model.trim="formValidateOK.classTableName" clearable :autofocus="true" placeholder="请输入方案名称"></i-input>
              </FormItem>
              <FormItem label="校区" prop="school">
                  <Select  v-model="formValidateOK.school"
                            @on-change="schoolChange"
                            placeholder="请选择校区">
                      <Option v-for="school in schoolData" :value="school.value" :key="school.label" v-cloak>{{ school.label }}</Option>
                  </Select>
              </FormItem>
              <FormItem label="学年学期" prop="session">
                  <cascader :data="yearSessionData"
                            v-model="formValidateOK.session"
                            @on-change="cascaderChange" placeholder="">
                  </cascader>
              </FormItem>
              <FormItem label="年级" prop="gradeYear">
                  <i-select v-model="formValidateOK.gradeYear"
                            :label="formValidateOK.gradeYear"
                            placeholder="'请选择年级'">
                      <i-option v-for="year in studentGradeData" :value="year.value" :key="year.label" v-cloak>{{ year.label }}</i-option>
                  </i-select>
              </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close"  @click="copyCancel">取消</Button>
          <Button class="xy-modal-primary" shape="circle" :loading="copyOkLoading" @click="copyOk">保存</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    components: {
      XyAntTable
    },
    inject: ['reload'],
    name: '',
    data () {
      return {
        tableLoading: true,
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
        switchLoading: false,
        columns: [
          {
            title: '方案名称',
            dataIndex: 'ProgrammeName',
            fixed: 'left',
            scopedSlots: { customRender: 'ProgrammeName' }
          },
          {
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            width: 180,
            scopedSlots: { customRender: 'SchoolDistrictName' }
          },
          {
            title: '年级',
            dataIndex: 'StudentGradeNameForStudentYearName',
            width: 250,
            scopedSlots: { customRender: 'StudentGradeNameForStudentYearName' }
          },
          {
            title: '学期',
            dataIndex: 'AcademicSessionName',
            width: 100,
            scopedSlots: { customRender: 'AcademicSessionName' }
          },
          {
            title: '创建人',
            dataIndex: 'CreateUser',
            width: 150,
            scopedSlots: { customRender: 'CreateUser' }
          },
          {
            title: '创建时间',
            dataIndex: 'CreateByDate',
            width: 200,
            scopedSlots: { customRender: 'CreateByDate' }
          },
          {
            title: '状态',
            dataIndex: 'IsComplete',
            width: 100,
            scopedSlots: { customRender: 'IsComplete' }
          },
          {
            title: '操作',
            dataIndex: 'operation',
            width: 120,
            scopedSlots: { customRender: 'operation' }
          }
        ],
        tableData: [],
        tbTotal: 0,
        pageSize: 15,
        pageIndex: 1,
        selectionAll: [],
        searchName: '',
        schoolGrade: [],
        schoolGradeList: [],
        yearSemester: [],
        yearSemesterList: [],
        // 复制排课方案
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
          classTableName: [
            {
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
      // 获取列表
      GetProgrammePage () {
        this.tableLoading = true
        this.xy.get(`${this.$store.state.apiPath}/api/ProgrammeSetting/GetProgrammePage`, {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          schoolDistrictID: this.schoolGrade[0],
          studentGradeForStudentYearID: this.schoolGrade[1],
          academicYearID: this.yearSemester[0],
          academicSessionID: this.yearSemester[1],
          name: this.searchName
        }).then(res => {
          if (res.success) {
            this.pagination.total = res.data.totalRecords
            this.tableData = res.data.data
          }
          this.tableLoading = false
        })
      },
      // 获取校区、年级
      getSchoolGrade (resObj) {
        // this.xy.loading()
        this.xy.get(`${this.xyApi}/xy/comm/GetSchoolDistrictForStudentGradeStudentYears`).then(res => {
          // this.xy.unloading()
          if (res.success) {
            let resData = res.data
            resData.map(item => {
              item.value = item.ID
              item.label = item.Name
              item.children = item.Childrens
              item.children.map(cItem => {
                cItem.value = cItem.StudentYearForSchoolDistrictID
                cItem.label = cItem.FullName
                return cItem
              })
              item.children.unshift({
                value: 0,
                label: '所有年级'
              })
              return item
            })
            this.schoolGradeList = res.data
            if (this.schoolGradeList.length > 0 && this.schoolGradeList[0].children.length > 0) {
              this.schoolGrade = [this.schoolGradeList[0].value, this.schoolGradeList[0].children[0].value]
            }
            this.getTableSessionNodeList()
          }
        })
      },
      changeSchool (value, selectedData) {
        this.schoolGrade = value
        this.pagination.current = 1
        this.GetProgrammePage()
      },
      // 获取学年、学期
      getTableSessionNodeList (resObj) {
        // this.xy.loading()
        this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`).then(res => {
          // this.xy.unloading()
          if (res.success) {
            this.yearSemesterList = res.data
            let index = this.yearSemesterList.map(item => {
              return item.IsCurrent
            }).indexOf(true)
            if (index !== -1) {
              this.yearSemester.push(this.yearSemesterList[index].value)
              let index1 = this.yearSemesterList[index].children.map(item => {
                return item.IsCurrent
              }).indexOf(true)
              if (index1 !== -1) {
                this.yearSemester.push(this.yearSemesterList[index].children[index1].value)
              }
            } else {
              for (let i = 0; i < this.yearSemesterList.length; i++) {
                if (this.yearSemesterList[i].children.length > 0) {
                  this.yearSemester = [this.yearSemesterList[i].value, this.yearSemesterList[i].children[0].value]
                  return false
                }
              }
            }
            this.GetProgrammePage()
          }
        })
      },
      changeYear (value, selectedData) {
        this.yearSemester = value
        this.pagination.current = 1
        this.GetProgrammePage()
      },
      onSearch () {
        this.pagination.current = 1
        this.GetProgrammePage()
      },
      // 右侧表格多选操作（批量删除）
      changeSelect (data) {
        this.selectionAll = data
      },
      // 改变当前页显示的数量
      changePageSize (size) {
        if (this.pageSize !== size) {
          this.pageSize = size
          this.GetProgrammePage()
        }
      },
      // 改变当前页
      changePage (index) {
        if (this.pageIndex !== index) {
          this.pageIndex = index
          this.GetProgrammePage()
        }
      },
      // 启用，停用
      async swithChange (row) {
        this.switchLoading = true
        // this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ProgrammeSetting/EnableProgramme`, {
          ProgrammeID: row.ProgrammeID,
          Enable: row.IsEnable !== '1'
        }, true)
        // this.xy.unloading()
        this.switchLoading = false
        if (res.success) {
          if (row.IsEnable === '1') { // 关闭
            this.xy.msgSuc('关闭成功。')
          } else {
            this.xy.msgSuc('启用成功。')
          }
          this.GetProgrammePage()
        } else {
          this.xy.msgError(res.msg)
          // this.reload()
          return false
        }
      },
      // 创建方案
      creat () {
        this.$store.commit('evaluate/changeEvaPlanObj', {
          ProgrammeID: 0,
          ProgrammeName: ''
        })
        this.$router.push({ path: '/xyhome/evaStepsHeader' })
      },
      // 编辑
      edit (row) {
        this.$store.commit('evaluate/changeEvaPlanObj', {
          ProgrammeID: row.ProgrammeID,
          ProgrammeName: row.ProgrammeName,
          IsEnable: row.IsEnable
        })
        this.$router.push({ path: '/xyhome/evaStepsHeader' })
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
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ProgrammeSetting/DeleteProgramme`, {
          ProgrammeID: id
        })
        // this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          this.GetProgrammePage()
        }
      },
      // 指标管理
      target () {
        this.$store.commit('common/getThreeMenuName', '指标管理')
        this.$store.commit('common/getParam', { pro: 'evaPlanTable' })
        this.$router.push({
          path: '/xyhome/evaMarkManagement',
          query: this.$store.state.common.menuInfo
        })
      },
      // 复制排课方案
      copyClassTable (row) {
        this.modalCopy = true
        // this.classTableID = row.ClassTableID
        // this.formValidate.copyClassTableName = row.ClassTableName + '（1）'
        // this.formValidate.copyClassTableYear = row.AcademicYearID
        // this.formValidate.copyClassTableSession = row.AcademicSessionID
        this.getSchool()
      },
      // 获取校区
      async getSchool (resObj) {
        // this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`, null, true)
        // this.xy.unloading()
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
            this.getStudentGrade()
          }
          this.getSessionNodeList()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      schoolChange (value) {
        this.formValidateOK.school = value
        this.formValidateOK.gradeYear = ''
        this.getStudentGrade()
      },
      // 学年学期
      async getSessionNodeList (resObj) {
        // this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`, null, true)
        // this.xy.unloading()
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
        } else {
          this.xy.msgError(res.msg)
        }
      },
      cascaderChange (value, selectedData) {
        this.formValidateOK.session = value
      },
      // 获取年级
      async getStudentGrade (resObj) {
        // this.xy.loading()
        let params = {
          schoolDistrictID: this.formValidateOK.school
        }
        let res = await this.xy.get(`${this.xyApi}/xy/Comm/GetStudentGradeStudentYearBySid`, params, true)
        // this.xy.unloading()
        if (res.success) {
          this.studentGradeData = []
          for (const iterator of res.data) {
            this.studentGradeData.push({
              value: iterator.StudentGradeForStudentYearID,
              tvalue: iterator.StudentGradeID,
              label: iterator.FullName
            })
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      async copyOk () {
        this.copyOkLoading = true
        this.$refs.formValidate.validate((valid) => {
          if (!valid) {
            this.copyOkLoading = false
            return false
          } else {
            this.copyHttp()
          }
        })
      },
      async copyHttp () {
        // let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTable/GenerateTimeTableCopy`, {
        //   ClassTableID: this.classTableID,
        //   ClassTableName: this.formValidate.copyClassTableName,
        //   AdemicSessionID: this.formValidate.copyClassTableSession
        // })
        // this.xy.unloading()
        // if (res.success) {
        //   this.modalCopy = false
        //   this.copyOkLoading = false
        //   this.xy.msgSuc('复制成功！')
        //   this.getList()
        // }
      },
      copyCancel () {
        this.modalCopy = false
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
