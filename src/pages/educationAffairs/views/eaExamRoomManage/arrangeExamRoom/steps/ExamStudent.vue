<template>
  <div id="FuncInfo">
    <Alert show-icon closable>{{direction}}</Alert>
    <div class="fl" v-if="isEdit">
      <Button class="xy-primary" @click="modalUpload = true">导入</Button>
      <Button class="xy-danger" @click='EmptyStudents'>清空考生</Button>
    </div>
    <div class="fr pr">
      <i-input
        search
        v-model.trim="SearchText"
        placeholder="请输入用户名/姓名"
        @on-search="DoSearch"
        class="fr xy-content-title-search"
        style="width: auto;"
        >
        <icon type="ios-search cursor-p" slot="suffix" />
      </i-input>
    </div>
    <div class="table_header">
      <div v-cloak v-for='(item,index) in subList' :key="index">
        <tooltip placement="top" max-width="200">
          <span slot="content">
            <span v-cloak>{{item.Name}}</span>
          </span>
          <span v-cloak class="SubjectName">{{item.Name}}</span>
        </tooltip>
        <span v-cloak>：{{item.Value}}</span>
      </div>
    </div>
    <div class="xy-content-table pr">
      <XyAntTable
        :columns="columns"
        :dataSource="dataList"
        :nullData="txt"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        >
        <div slot="Icon" slot-scope="text, record">
          <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
            <span class="head-font">
              {{ xy.showName(record.FullName)}}
            </span>
          </div>
          <img style="width:30px;height:30px;border-radius:50%" v-else :src="$store.state.apiPath + record.Icon + '?' + Math.random() * 15">
        </div>
        <div style="min-width: 80px" slot="FullName" slot-scope="text, record">
          <span
            v-html="record.FullName"
            :class="isEdit ? 'ant-table-cell table-el-hover' : ''"
            style="display: inline-block"
            @click="changeClass(record)"
            >
          </span>
        </div>
      <div slot="UserName" style="min-width: 80px" slot-scope="text, record">
        {{record.UserName}}
      </div>
      <!-- 操作 -->
      <span slot="action" slot-scope="text, record">
        <a @click="changeClass(record)" :disabled='!isEdit'>调整</a>
        <a-divider type="vertical" />
        <a @click="DelStudent(record)" :disabled='!isEdit'>删除</a>
      </span>
    </XyAntTable>
    </div>
    <!-- 编辑框 -->
    <div class="modal_edit">
      <modal
        width='670'
        v-model="modaledit"
        :transfer="false"
        title="调整考生所考科目"
        :mask-closable="false"
        :closable="true"
        :loading="editLoading"
        v-cloak
        >
        <div class="dialog-model-content ">
          <div class="modal_edit_sub">
            <p>{{selrow.SchooleNumber}} {{selrow.FullName}}</p>
            <div class="sub_div">
              <div
                @click='SelSubject(index)'
                v-for='(item,index) in subjects'
                :key="index"
                :class='{sel_sub:item.isSel}'
                >
                <tooltip placement="top" max-width="200">
                  <span slot="content">
                    <span v-cloak>{{item.SubjectName}}</span>
                  </span>
                  <span class="sub_div_SubjectName" v-text='item.SubjectName'></span>
                </tooltip>
                <i></i>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <Button class="xy-modal-primary" shape="circle" @click="editOk">保存</Button>
          <Button class="xy-modal-close" @click="modaledit = false">取消</Button>
        </div>
      </modal>
    </div>

    <!-- 映射框 -->
    <modal
      v-model="modalImport"
      :transfer="false"
      id="id_import"
      title="批量导入"
      :mask-closable="false"
      >
      <div class="dialog-model-content import-modal">
        <div>
          <div style="margin:10px 0 5px 20px;">用户名</div>
          <div>
            <i-select v-model="UserName" style="width:200px;margin-right:20px;margin-left:20px;">
              <i-option value="-1">--不映射--</i-option>
              <i-option v-for="(item,index) in ColumnsList" :value="index" v-cloak :key="index">
                {{item}}
              </i-option>
            </i-select>
          </div>
        </div>
        <div>
          <div style="margin:10px 0 5px 20px;">准考证号</div>
          <div>
            <i-select v-model="AdmissionTicketNumberIndex" style="width:200px;margin-right:20px;margin-left:20px;">
              <i-option value="-1">--不映射--</i-option>
              <i-option v-for="(item,index) in ColumnsList" :value="index" v-cloak :key="index">
                {{item}}
              </i-option>
            </i-select>
          </div>
        </div>
        <div v-for="(item, index) in columnsExamSubject" :key="index">
          <div v-cloak style="margin:10px 0 5px 20px;">{{item.SubjectName}}</div>
          <div>
            <i-select v-model="item._index" style="width:200px;margin-right:20px;margin-left:20px;">
              <i-option value="-1">--不映射--</i-option>
              <i-option v-for="(item,index) in ColumnsList" :value="index" v-cloak :key="index">
                {{item}}
              </i-option>
            </i-select>
          </div>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <Button class="xy-modal-primary" shape="circle" @click="Import">保存</Button>
        <Button class="xy-modal-close" @click="modalImport = false">取消</Button>
      </div>
    </modal>

    <!-- 批量导入 -->
    <modal
      title="批量导入"
      v-model="modalUpload"
      :mask-closable="false"
      :closable="true"
      :loading="loading"
      :transfer="false"
      @on-visible-change="modalChange"
      >
      <div style="text-align:center">
        <Upload
          :action="upload"
          v-if="isShowUpload"
          type="drag"
          name="upfile"
          :headers="{'Access-Control-Allow-Origin' : '*','XYTOKEN':cookie}"
          :show-upload-list="false"
          :format="['xlsx','xls']"
          :on-format-error="formatError"
          :on-success="UploadSuccess"
          :on-error="UploadError"
          :before-upload='BeforeUpload'
          >
          <div style="padding: 20px 10px">
            <icon type="ios-cloud-upload" size="52" style="color: #3399ff"></icon>
            <p>点击上传或拖拽文件上传</p>
          </div>
        </Upload>
      </div>
      <div slot="footer">
        <Button class="xy-modal-primary" shape="circle" @click="DownloadTemplate()">下载模板</Button>
      </div>
      <spin fix v-if="isShowSpin">上传中...</spin>
    </modal>
    <!-- 导入结果 -->
    <modal
      v-model="modalimportResult"
      :transfer="false"
      v-cloak
      id="id_import"
      title="导入结果"
      :loading="loading"
      :mask-closable="false"
      >
      <div id="uploadSuccess" v-if="importSuccess">
        <i class="ivu-icon ivu-icon-ios-checkmark-circle-outline"></i>上传成功。
        <!--<span>成功：{{importResult.scount}}，失败：{{importResult.ecount}}</span>-->
      </div>
      <div id="uploadFail" v-if="importFail">
        <i class="ivu-icon ivu-icon-ios-close-circle-outline"></i>
        上传失败,
        <a @click="DownloadErrorInfo()">请点击下载错误信息。</a>
        <span>失败原因：{{importResult.ecount}}人信息有误。</span>
      </div>
      <div slot="footer">
        <Button type="primary" long size="large" @click="modalimportResult = false">关闭</Button>
      </div>
    </modal>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: {
      XyAntTable
    },
    name: 'ExamStudent',
    data () {
      return {
        tableLoading: true,
        txt: '该搜索条件下没有结果。',
        // txt: '您还没有考试学生的信息，请导入考试学生。',
        cookie: this.xy.getCookie('.XYTOKEN'),
        apiPath: `${this.$store.state.apiPath}/api/ArrangeSupervisorExam/`,
        upload: `${this.$store.state.apiPath}/api/ArrangeSupervisorExam/Upload`,
        direction: '有排考结果后本页内容不可更改。若需更改，请先删除排考结果。',
        loading: true,
        modalUpload: false, // 上传
        isShowUpload: true, // 弹出框导入
        isShowSpin: false, //
        modalimportResult: false, // 导入结果modal
        importResult: {}, // 导入结果
        importSuccess: false, // 导入
        importFail: false,
        SearchText: '',
        pageSizeOpts: [15, 30, 50, 100],
        isInitial: true, // 页面加载loading
        isEmpty: false, // 数据是否为空
        modaledit: false,
        editLoading: true,
        search: 0,
        // 导入映射框
        modalImport: false,
        defaultSelected: -1, // 映射下拉框默认选中数据
        // 当前方案选择的科目
        columnsExamSubject: [],
        // 上传返回科目
        ColumnsList: [],
        // 文件名
        FileName: '',
        // 校内号对应的列
        UserName: 0,
        // 准考证号对应的列
        AdmissionTicketNumberIndex: 1,
        // 选中的某列
        selrow: {},
        // 编辑对话框中的科目信息
        subjects: [],
        // 表头上方统计
        subList: [],
        columns: [],
        dataList: [],
        isEdit: true,
        params: this.$store.state.educationAffairs.arrange,
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
        }
      }
    },
    created () {
      // 控制步骤
      if (this.params.IsEnabled === 1) {
        this.isEdit = false
      } else {
        if (this.params.Steps < 6) {
          this.isEdit = true
        } else {
          this.isEdit = false
        };
      };
      if (this.params.ArrangeSupervisorExamID > 0) {
        this.ArrangeSupervisorExamID = this.params.ArrangeSupervisorExamID
      };
      this.GetAllExamSubject()// 获取当前方案已经选择科目
      this.GetExamStudentInfoList()// 获取表头、统计、表格分页数据
    },
    methods: {
      changeClass (val) {
        // console.log(val)
        // console.log(this.isEdit)
        if (this.isEdit) {
          this.selrow = val
          this.subjects = this.subjects.map((item) => {
            item.isSel = false
            return item
          })
          // 默认选中该考生已经添加的课程
          this.subjects.forEach((item) => {
            for (let key in val) {
              if (item.SubjectName === val[key]) {
                item.isSel = true
              }
            }
          })
          this.modaledit = true
        }
      },
      handleTableChange () {
        this.GetExamStudentInfoList()
      },
      // 编辑考生科目
      async editOk () {
        let ArrangeSupervisorSubjectIDs = []
        // 筛选被选择的科目
        this.subjects.forEach((item) => {
          if (item.isSel) {
            ArrangeSupervisorSubjectIDs.push(item.ArrangeSupervisorSubjectID)
          }
        })
        if (ArrangeSupervisorSubjectIDs.length === 0) {
          return this.xy.msgError('请至少选择一门课程。')
        } else {
          // this.xy.loading()
          this.tableLoading = true
          const params = {
            ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
            ArrangeSupervisorSubjectIDs: ArrangeSupervisorSubjectIDs,
            ArrangeSupervisorStudentID: this.selrow.PK
          }
          let res = await this.xy.post(this.apiPath + 'EditExamStudentSubject', params)
          // this.xy.unloading()
          this.tableLoading = false
          if (res.success) {
            this.modaledit = false
            this.xy.msgSuc(res.msg || '修改成功。')
            this.GetExamStudentInfoList()
          }
        }
      },
      // 删除考生
      DelStudent (row) {
        this.xy.confirm('删除', `您确定要删除"'${row.FullName}'"吗？`, () => {
          this.toDelete(row)
        })
      },
      async toDelete (row) {
        // this.xy.loading()
        this.tableLoading = true
        const params = {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
          ArrangeSupervisorStudentID: row.PK
        }
        let res = await this.xy.get(this.apiPath + 'DeleteExamStudentByID', params)
        // this.xy.unloading()
        this.tableLoading = false
        if (res.success) {
          // 单个删除：删除最后一页最后一条时，自动返回上一页
          if (this.dataList.length > 1) {
            this.dataList.length = this.dataList.length - 1
          } else {
            if (this.pagination.current > 1) {
              this.pagination.current = this.pagination.current - 1
            }
          }
          this.GetExamStudentInfoList()
          this.xy.msgSuc(res.msg || '删除成功。')
          // 改变步骤
          if (res.data.result.Step === 2) {
            // this.params.Steps = res.data.result.Step
            let l = res.data.result.Step + 1
            let arr = JSON.parse(this.params.StepList)
            for (let i = 0; i < l; i++) {
              if (i < l) {
                arr[i].IsDisabled = false
              } else {
                arr[i].IsDisabled = true
              }
            }
            this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
              Steps: res.data.result.Step,
              StepList: JSON.stringify(arr)
            }))
            this.$emit('change', { StepList: arr, step: res.data.result.Step })
          };
        }
      },
      // 清空考生
      EmptyStudents () {
        if (this.dataList.length > 0) {
          this.xy.confirm('提示', '您确定要清空所有考生吗？', () => {
            this.toClear()
          })
        } else {
          this.xy.msgError('您还未添加考生，无需清空。')
        };
      },
      async toClear () {
        // this.xy.loading()
        this.tableLoading = true
        const params = {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID
        }
        let res = await this.xy.get(this.apiPath + 'DeleteAllExamStudent', params)
        // this.xy.unloading()
        this.tableLoading = false
        if (res.success) {
          this.pagination.current = 1
          this.SearchText = ''
          this.GetExamStudentInfoList()
          this.xy.msgSuc(res.msg || '清空成功。')
          if (res.data.result.Step === 2) {
            let l = res.data.result.Step + 1
            let arr = JSON.parse(this.params.StepList)
            for (let i = 0; i < l; i++) {
              if (i < l) {
                arr[i].IsDisabled = false
              } else {
                arr[i].IsDisabled = true
              }
            }
            this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
              Steps: res.data.result.Step,
              StepList: JSON.stringify(arr)
            }))
            this.$emit('change', { StepList: arr, step: res.data.result.Step })
          };
        }
      },
      // 调整考试科目
      SelSubject (index) {
        this.subjects[index].isSel = !this.subjects[index].isSel
      },
      // 获取当前方案已经选择科目
      async GetAllExamSubject () {
        // this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID
        }
        let res = await this.xy.get(this.apiPath + 'GetAllExamSubject', params)
        // this.xy.unloading()
        if (res.success) {
          this.columnsExamSubject = res.data
          // 填入编辑对话框中考试科目信息
          res.data.forEach((item) => {
            this.subjects.push({
              ArrangeSupervisorSubjectID: item.ArrangeSupervisorSubjectID,
              SubjectName: item.SubjectName,
              isSel: false
            })
          })
        }
      },
      // 获取表头、考生人数、表格数据
      async GetExamStudentInfoList () {
        this.columns = [
          {
            title: ' ',
            dataIndex: 'Icon',
            fiexd: 'left',
            scopedSlots: { customRender: 'Icon' },
            width: 60,
            className: 'table-pic'
          },
          {
            title: '姓名',
            dataIndex: 'FullName',
            fiexd: 'left',
            scopedSlots: { customRender: 'FullName' }
          },
          {
            title: '用户名',
            dataIndex: 'UserName',
            fiexd: 'left',
            scopedSlots: { customRender: 'UserName' }
          },
          {
            title: '准考证号',
            dataIndex: 'AdmissionTicketNumber',
            width: 150
          },
          {
            title: '行政班',
            dataIndex: 'StudentOrganizationName',
            width: 150
          }
        ]
        this.tableLoading = true
        const params = {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          SearchText: this.SearchText
        }
        let res = await this.xy.get(this.apiPath + 'GetExamStudentInfoList', params, true)
        this.tableLoading = false
        this.isInitial = false
        if (res.success) {
          if (res.data !== null) {
            // 表头上方统计
            this.subList = this.search === 0 ? res.data.SubjectDetail : this.subList
            // 拼接表头
            for (let i = 5; i < res.data.DataHeader.length; i++) {
              this.columns.push({
                title: res.data.DataHeader[i].ColumName,
                dataIndex: res.data.DataHeader[i].ColumCode,
                width: 100
              })
            };
            this.columns.push({
              title: '操作',
              dataIndex: 'action',
              scopedSlots: { customRender: 'action' },
              width: 120
            })
            this.pagination.total = res.data.TotalRecords
            if (res.data.DataBody.length > 0) {
              this.isEmpty = false
              this.dataList = res.data.DataBody
            } else {
              this.isEmpty = true
              this.dataList = []
            };
          };
        } else {
          this.isEmpty = true
          this.xy.msgError(res.msg)
        };
      },
      BeforeUpload (res) {
        this.isShowSpin = true
      },
      formatError (file, fileList) {
        this.isShowSpin = false
        this.xy.msgError('文件格式不正确。')
      },
      // 上传成功
      UploadSuccess (res) {
        if (res.success) {
          this.FileName = res.data.FileName
          this.ColumnsList = res.data.ColumnsList
          this.modalUpload = false
          this.modalImport = true
          this.isShowSpin = false
          // xy.message.success(this, '上传成功！');
          // 找到课程的默认下拉选中项
          this.columnsExamSubject.forEach((item) => {
            this.ColumnsList.forEach((t, i) => {
              if (item.SubjectName === t) {
                item._index = i
              }
            })
          })
          this.columnsExamSubject.forEach((item) => {
            if (item._index === undefined) {
              item._index = '-1'
            }
          })
        } else {
          this.modalUpload = false
          this.isShowSpin = false
          this.xy.msgError(res.msg)
        }
      },
      // 上传失败
      UploadError () {
        this.isShowSpin = false
        this.xy.msgError('Error！')
      },
      Error () {
        this.isShowSpin = false
        this.xy.msgError('Error！')
      },
      // 导入
      async Import () {
        // //映射出[校内号/准考证号]的序列。
        let examSubjectMapIndexList = []
        this.columnsExamSubject.forEach((item) => {
          if (item._index !== '-1') {
            examSubjectMapIndexList.push({
              SubjectID: item.SubjectID,
              SubjectIndex: item._index
            })
          }
        })
        if (this.UserName === '-1') {
          this.xy.msgW('请选择用户名要映射的列。')
        } else if (this.AdmissionTicketNumberIndex === '-1') {
          this.xy.msgW('请选择准考证号要映射的列。')
        } else {
          this.xy.loading()
          const params = {
            ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
            ImportName: this.FileName,
            FileName: this.FileName,
            UserName: this.UserName,
            AdmissionTicketNumberIndex: this.AdmissionTicketNumberIndex,
            ExamSubjectMapIndexList: examSubjectMapIndexList
          }
          let res = await this.xy.post(this.apiPath + 'Import', params)
          this.xy.unloading()
          if (res.success) {
            this.modalImport = false
            this.modalImport = false
            this.modalimportResult = true
            this.importSuccess = true
            this.importFail = false
            this.importResult = res.data
            this.xy.msgSuc(res.msg || '导入成功。')
            this.GetExamStudentInfoList()
            // 改变步骤
            // this.params.Steps = res.data.Step
            let l = res.data.Step + 1
            let arr = JSON.parse(this.params.StepList)
            for (let i = 0; i < l; i++) {
              if (i < l) {
                arr[i].IsDisabled = false
              } else {
                arr[i].IsDisabled = true
              }
            }
            this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
              Steps: res.data.Step,
              StepList: JSON.stringify(arr)
            }))
            this.$emit('change', { StepList: arr, step: res.data.Step })
          } else if (res.data.errorcode === 'fileError') {
            this.xy.msgError(res.msg)
          } else {
            this.modalImport = false
            this.modalimportResult = true
            this.importSuccess = false
            this.importFail = true
            this.importResult = res.data
          }
        }
      },
      // 模板下载
      DownloadTemplate () {
        this.xy.downFile(this.apiPath + 'DownloadTemplateImport')
      },
      modalChange (status) {
        if (status) {
          this.isShowUpload = true
          this.uploadSuccess = false
        }
      },
      // 下载错误信息
      DownloadErrorInfo () {
        this.xy.downFile(this.apiPath + 'DownloadException' + '?file=' + this.importResult.efile)
      },
      // 切换页码
      // 搜索
      DoSearch () {
        this.search = 0
        this.pagination.current = 1
        this.GetExamStudentInfoList()
        this.search++
      }
    }
  }
</script>
<style lang="less" scoped>
@import '../../Css/ArrangeExamRoom/ExamStudent.less';
#FuncInfo {
  padding: 20px;
}
</style>
