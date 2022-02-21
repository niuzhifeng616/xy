<template>
<div class="xy-content-module">
    <span style="position:absolute;right:20px;top:0;font-size:14px;color:#B3BACB">{{classTableName}}</span>
    <div class="xy-content-title">
        <Button class="xy-primary" @click="greate" :disabled="isOperation!==0">创建学段</Button>
        <Button class="xy-danger" @click="delAll" :disabled="isOperation!==0">批量删除</Button>
        <!-- <Button class="xy-info" @click="back">返回</Button> -->
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :rowSelection="tableRowSelection"
        :columns="columns"
        :dataSource="datatable"
        nullData="您还没有学段信息，请创建学段。"
        :scrollx="'max-content'"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange">
        <!-- 学段名称 -->
        <div slot="ClassSectionSettingName" slot-scope="text, record">
          <div v-if="isOperation !== 1" class="table-el-hover" @click="editor(record)" style="min-width:400px" >
            {{record.ClassSectionSettingName}}
          </div>
          <div v-else style="min-width:400px">
            {{record.ClassSectionSettingName}}
          </div>
        </div>
        <!-- 起始日期 -->
        <div slot="StartDate" slot-scope="text, record">
          <div>
            {{xy.moment(new Date(record.StartDate)).format('YYYY-MM-DD')}}
          </div>
        </div>
        <!-- 截止日期 -->
        <div slot="EndDate" slot-scope="text, record">
          <div>
            {{xy.moment(new Date(record.EndDate)).format('YYYY-MM-DD')}}
          </div>
        </div>
        <!-- 操作 -->
        <span slot="oprateRender" slot-scope="text, record">
          <a @click="editor(record)" :disabled="isOperation === 1">编辑</a>
          <a-divider type="vertical" />
          <a @click="del(record)" :disabled="record._disabled || isOperation === 1">删除</a>
        </span>
      </XyAntTable>
    </div>

    <!--创建学段 -->
    <Modal v-model="modalSelectClass"
            :title="modalName"
            :transfer="false"
            :mask-closable="false"
            :closable="false">
        <div class="selectClassModal">
            <Alert show-icon closable>
              学期范围：{{xy.moment(sDate).format('YYYY-MM-DD')}}至{{xy.moment(eDate).format('YYYY-MM-DD')}}。学段范围要在学期范围内，且时间间隔要大于一周。
                学段周期改变会清除课表，并且清除学生的选课结果。
            </Alert>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidateOK" label-position="top">
                <FormItem label="学段名称" prop="classSectionSettingName" label-for="classSectionSettingName">
                    <Input v-model="formValidate.classSectionSettingName" element-id="classSectionSettingName" clearable autofocus />
                </FormItem>
                <FormItem label="时间段" prop="dateTimes" label-for="dateTimes">
                    <DatePicker type="daterange" v-model="formValidate.dateTimes" element-id="dateTimes" split-panels placeholder="请选择起始日期和截止日期" :editable="false" @on-change="handleDateChange"></DatePicker>
                </FormItem>
            </Form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="cancel">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="submit">确定</Button>
        </div>
    </Modal>
</div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'

  export default {
    name: 'TLLearnningPeriod',
    components: {
      XyAntTable
    },
    data () {
      return {
        loading: true,
        sDate: '',
        eDate: '',
        modalSelectClass: false,
        modalData: {},
        classTableID: 0,
        classTableType: this.$store.state.csmstimetable.classTableID[2].id,
        formValidate: {
          dateTimes: null,
          classSectionSettingName: ''
        },
        ruleValidateOK: {
          classSectionSettingName: [
            { required: true, message: '学段名称不能为空', trigger: 'blur' },
            { max: 20, message: '学段名称不能超过20个字符', trigger: 'blur' }
          ],
          dateTimes: [
            {
              required: true,
              type: 'array',
              len: 2,
              message: '时间段不能为空',
              trigger: 'change',
              fields: {
                0: { type: 'date', required: true, message: '时间段不能为空' },
                1: { type: 'date', required: true, message: '时间段不能为空' }
              }
            }
          ]
        },
        startDate: '',
        endDate: '',
        classSectionSettingID: 0,
        modalName: '创建学段', //
        classTableName: '',
        // 按课程table
        isOperation: 0,

        pageList: 0, // 当前页数据条数
        selectionAll: [],
        selectedRowKeys: [],
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
        datatable: [],
        columns: [
          {
            title: '学段名称',
            dataIndex: 'ClassSectionSettingName',
            scopedSlots: { customRender: 'ClassSectionSettingName' }
          },
          {
            title: '起始日期',
            dataIndex: 'StartDate',
            scopedSlots: { customRender: 'StartDate' },
            width: 150
          },
          {
            title: '截止日期',
            dataIndex: 'EndDate',
            scopedSlots: { customRender: 'EndDate' },
            width: 150
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            width: 120,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ]
      }
    },
    computed: {
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange,
          getCheckboxProps: record => ({
            props: {
              disabled: record._disabled || this.isOperation === 1
            }
          })
        }
      }
    },
    created () {
      if (Object.keys(this.$store.state.csmstimetable.takeLessonsLearningPeriodManage).length > 0) {
        this.rowObj = this.$store.state.csmstimetable.takeLessonsLearningPeriodManage
        this.classTableID = this.rowObj.classTableID
        this.classTableName = this.rowObj.classTableName
      }
    },
    mounted () {
      this.getGeneralFlows()
    },
    methods: {
      async getGeneralFlows () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GetSchoolBasedGrabClassTableFlows`, {
          classTableID: this.classTableID
        })
        if (res.success) {
          this.isOperation = res.data.PublishCollections
          this.getTP()
        }
      },
      async getTP () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassSectionSetting/GetList`, {
          classTableID: this.classTableID,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize
        })
        if (res.success) {
          this.datatable = res.data.Result.data
          this.pagination.total = res.data.Result.totalRecords
          this.sDate = res.data.StartDate
          this.eDate = res.data.EndDate
          if (res.data.Result.data !== null && res.data.Result.data.length > 0) {
            this.pageList = res.data.Result.data.length
          }
        }
        this.tableLoading = false
      },
      // greate
      greate () {
        if (this.isOperation === 0) {
          this.modalName = '创建学段'
          this.classSectionSettingID = 0
          this.formValidate.classSectionSettingName = ''

          this.modalSelectClass = true
        }
      },
      //
      handleDateChange (arrayVal) {
      },
      submit () {
        let sessionStart = this.xy.moment(this.sDate) // 学期范围：开始
        let sessionEnd = this.xy.moment(this.eDate) // 学期范围：结束
        let pStart = this.xy.moment(this.formValidate.dateTimes[0]) // 学段开始时间
        let pEnd = this.xy.moment(this.formValidate.dateTimes[1]) // 学段结束时间

        if (pStart.diff(sessionStart, 'day') < 0 || sessionEnd.diff(pStart, 'day') < 0) {
          this.xy.msgError('学段范围未在学期范围内。')
          return false
        } else if (pEnd.diff(sessionStart, 'day') < 0 || sessionEnd.diff(pEnd, 'day') < 0) {
          this.xy.msgError('学段范围未在学期范围内。')
          return false
        } else if (pEnd.diff(pStart, 'day') < 7) {
          this.xy.msgError('学段范围时间间隔要大于一周。')
          return false
        }

        if (this.classSectionSettingID === 0) {
          this.$refs.formValidate.validate(valid => {
            if (valid) {
              let params = {
                ClassTableID: this.classTableID,
                ClassSectionSettingID: this.classSectionSettingID,
                ClassSectionSettingName: this.formValidate.classSectionSettingName,
                StartDate: this.xy.moment(this.formValidate.dateTimes[0]).format('YYYY-MM-DD'),
                EndDate: this.xy.moment(this.formValidate.dateTimes[1]).format('YYYY-MM-DD')
              }
              this.xy.post(`${this.$store.state.apiPath}/api/ClassSectionSetting/Create`, params).then(res => {
                if (res.success) {
                  this.xy.msgSuc('创建成功。')
                  // this.formValidate.classSectionSettingName = ''
                  // this.endDate = ''
                  // this.startDate = ''
                  // this.formValidate.dateTimes = null
                  this.getTP()
                  this.modalSelectClass = false
                  this.$refs.formValidate.resetFields()
                }
              })
            } else {
              return false
            };
          })
        } else {
          this.$refs.formValidate.validate(valid => {
            if (valid) {
              let params = {
                ClassTableID: this.classTableID,
                ClassSectionSettingID: this.classSectionSettingID,
                ClassSectionSettingName: this.formValidate.classSectionSettingName,
                StartDate: this.xy.moment(this.formValidate.dateTimes[0]).format('YYYY-MM-DD'),
                EndDate: this.xy.moment(this.formValidate.dateTimes[1]).format('YYYY-MM-DD')
              }
              this.xy.post(`${this.$store.state.apiPath}/api/ClassSectionSetting/Edit`, params).then(res => {
                if (res.success) {
                  this.xy.msgSuc('编辑成功。')
                  // this.classSectionSettingID = 0
                  // this.formValidate.classSectionSettingName = ''
                  // this.formValidate.dateTimes = null
                  this.getTP()
                  this.modalSelectClass = false
                  this.$refs.formValidate.resetFields()
                }
              })
            } else {
              return false
            }
          })
        }
      },
      cancel () {
        this.formValidate.dateTimes = null
        this.$refs.formValidate.resetFields()
        this.modalSelectClass = false
      },
      // 编辑
      editor (row) {
        this.modalName = '编辑学段'
        this.classSectionSettingID = row.ClassSectionSettingID
        this.formValidate.classSectionSettingName = row.ClassSectionSettingName
        this.formValidate.dateTimes = [row.StartDate, row.EndDate]
        this.modalSelectClass = true
      },
      handleTableChange () {
        this.getTP()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      // 批量删除
      delAll () {
        if (this.isOperation === 0) {
          let idsStr = []
          if (this.selectionAll.length < 1) {
            this.xy.msgW('请选择要删除的学段。')
          } else {
            for (let i = 0; i < this.selectionAll.length; i++) {
              idsStr.push(this.selectionAll[i].ClassSectionSettingID)
            }
            this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要删除所有选中的数据吗？',
              onOk: () => {
                this.delAllObj(idsStr)
              }
            })
          }
        }
      },
      async delAllObj (idsStr) {
        let res = await this.xy.post(
          `${this.$store.state.apiPath}/api/ClassSectionSetting/DeleteByIds`, {
            ClassTableID: this.classTableID,
            id: 0,
            ids: idsStr.join(',')
          })
        if (res.success) {
          if (this.selectionAll.length === this.pageList && this.pagination.current > 1) {
            this.pagination.current = this.pagination.current - 1
          }
          this.selectionAll = []
          this.selectedRowKeys = []
          this.xy.msgSuc('删除成功。')
          this.getTP()
        }
      },
      // 删除单个
      async del (row) {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除"' + row.ClassSectionSettingName + '"吗？',
          onOk: () => {
            this.delObj(row)
          }
        })
      },
      async delObj (row) {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassSectionSetting/Delete`, {
          ClassTableID: this.classTableID,
          id: row.ClassSectionSettingID,
          ids: ''
        })
        if (res.success) {
          if (this.pageList > 1) {
            this.pageList = this.pageList - 1
          } else {
            if (this.pagination.current > 1) {
              this.pagination.current = this.pagination.current - 1
            }
          }
          this.xy.msgSuc('删除成功。')
          this.getTP()
        }
      },
      // 全选/取消全选触发
      changeSelect (selection) {
        if (selection.length > 0) {
          this.selectionAll = selection
        } else {
          this.selectionAll = []
          this.selectedRowKeys = []
        };
      }
      // 返回
      // back () {
      //   this.$router.push('/xyhome/takeLessons')
      // }
    }
  }
</script>
<style lang="less" scoped>
@import './css/courseSelectionResults.css';
.table {
  background: #fff;
}
</style>
