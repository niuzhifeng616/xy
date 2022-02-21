<template>
  <!-- 8.选课规则-必须设置 -->
  <div class="clearfix" style="height: 100%;">
    <div class="left-data fl">
        <div class="import-btn" :class="isOperation !== 0? 'disabled':''" @click="ImportClick"><i class="iconfont">&#xe6c0;</i>导入必选</div>
        <div v-for="(item, index) in crouseTree" :key="index">
            <div class="left-item-title">{{item.title}}</div>
            <radio-group v-model="curSubject" vertical @on-change="radioChange" style="max-width:240px">
                <radio :label="subject.id" v-for="(subject, n) in item.children" :key="n" class="nowrap">
                    <span class="f14 radio-name" :title="subject.title">{{subject.title}}</span>
                </radio>
            </radio-group>
        </div>
    </div>
    <div class="right-data fl">
        <div class="clearfix mb-15" style="margin-top:10px" v-if="curSubject!==-1">
            <div class="fl">
                <Button class="xy-primary" @click="selectStudent" :disabled="isOperation !== 0">添加学生</Button>
                <Button class="xy-danger" @click="delBatch" :disabled="isOperation !== 0||datatable.length===0">批量删除</Button>
                <Button class="xy-danger" @click="delAll" :disabled="isOperation !== 0||datatable.length===0">全部删除</Button>
            </div>
            <div class="fr pr">
                <Input search
                        v-model.trim="searchText"
                        @on-search="FromSubmit"
                        placeholder="用户名/姓名"
                        class="fr xy-content-title-search"
                        style="width: auto;" />
            </div>
        </div>
        <!-- 表格 -->
        <div>
          <XyAntTable :rowSelection="tableRowSelection"
                :columns="columnss"
                :dataSource="datatable"
                :nullData="nullData"
                :tableLoading="tableLoading"
                :pagination="pagination"
                @change="handleTableChange">
              <div slot="Icon"
                  slot-scope="text, record">
                <div v-if="!record.Icon"
                    :class="`head-con ${!record.Sex ? 'woman' : 'man'}`">
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
                <div style="min-width:100px">
                  {{record.FullName.replace(/\s/g, '&nbsp;')}}
                </div>
              </div>
              <div slot="UserName"
                  slot-scope="text, record">
                <div style="min-width:100px">
                  {{record.UserName}}
                </div>
              </div>
              <div slot="StudentOrganizationFullName"
                  slot-scope="text, record">
                <div style="min-width:190px">
                  {{record.StudentOrganizationFullName}}
                </div>
              </div>
              <span slot="oprateRender"
                    slot-scope="text, record">
                <a :disabled="isOperation!==0"
                  @click="delOne(record)">删除</a>
              </span>
            </XyAntTable>
        </div>
    </div>

    <!-- 导入必选 -->
    <xy-upfile ref="upfile"
      :modalTitle="upload.title"
      :describeData="upload.tipData"
      :fileFormt="upload.formtData"
      :fileSize="upload.size"
      :importPath="upload.upUrl"
      :paramsData="upload.upParams"
      :templateUrl="upload.templateUrl"
      :errorUrl="upload.errorUrl"
      @successLoad="modalSubmit">
    </xy-upfile>

    <!-- 添加学生 -->
    <select-student
      ref="selectStudent"
      :isShow="isShowSelectStudent"
      :classTableID="classTableID"
      :getStudentOrgApiurl="'/api/Collection/GetOrgHasStudunt'"
      :getStudentApiurl="'/api/SelectSchoolBasedRuleSetting/GetMustAddStudentList'"
      :courseProject="JSON.stringify(courseProject)"
      :teachers="[...selectedStudent]"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm">
    </select-student>
</div>

</template>
<script>
  // import XyTable from '@/components/table/XyTable'
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import XyUpfile from '@/components/upFile/XyUpfile.vue'
  import SelectStudent from '../components/SelectStudent'

  export default {
    name: 'TLArrangRuleMust',
    components: {
      XyUpfile,
      SelectStudent,
      XyAntTable
      // XyTable
    },
    data () {
      return {
        isNoData: true,
        curSubject: -1,
        allSelect: [],
        subjectData: [],
        subjectRadio: {
          ID: '',
          Type: ''
        },
        searchText: '',
        isShowBtn: false, // 是否展示操作按钮

        // 添加学生
        isShowSelectStudent: false,
        selectedStudent: [],

        // 导入必选
        upload: {
          title: '',
          tipData: [],
          formtData: [],
          size: 0,
          upParams: {},
          upUrl: '', // 上传文件url
          templateUrl: '', // 模板下载url
          errorUrl: '' // 下载错误文件url
        },

        crouseTree: [],
        courseProject: '',

        isLoading: true,
        isNullData: false,
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: false,
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
        pageList: '', // 当前页数据条数
        datatable: [],
        selectionAll: [],
        columnss: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 18,
            scopedSlots: { customRender: 'Icon' },
            className: 'table-pic'
          },
          {
            title: '姓名',
            dataIndex: 'FullName',
            width: 150,
            scopedSlots: { customRender: 'FullName' }
          },
          {
            title: '用户名',
            dataIndex: 'UserName',
            scopedSlots: { customRender: 'UserName' }
          },
          {
            title: '原班级',
            dataIndex: 'StudentOrganizationFullName',
            scopedSlots: { customRender: 'StudentOrganizationFullName' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            width: 80,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        columns: [
          {
            type: 'selection', // 与标签<i-table>中属性ref值对应
            width: 60,
            align: 'center',
            key: 'CoursePlanPermissionID'
          },
          {
            title: ' ',
            width: 32,
            className: 'set-head-icon',
            render: (h, params) => {
              return h('div', {
                attrs: {
                  title: params.row.FullName
                }
              }, [
                h('div', {
                  'class': `head-con ${params.row.Sex === 0 ? 'woman' : 'man'}`
                }, [
                  h('img', {
                    'class': 'head-img',
                    style: {
                      display: params.row.Icon ? 'inline-block' : 'none'
                    },
                    attrs: {
                      title: params.row.FullName,
                      src: params.row.Icon ? `${this.xyApi}/base${params.row.Icon}` : require('@/assets/common/yrykb.png') // 尽管当前不显示，备用
                    }
                  }),
                  h('span', {
                    'class': 'head-font',
                    style: {
                      display: !params.row.Icon ? 'inline-block' : 'none'
                    },
                    attrs: {
                      title: params.row.FullName
                    }
                  }, this.xy.showName(params.row.FullName))
                ])
              ])
            }
          },
          {
            title: '姓名',
            key: 'FullName',
            width: 150
          },
          {
            title: '用户名',
            key: 'UserName',
            minWidth: 100
          },
          {
            title: '行政班级',
            key: 'StudentOrganizationFullName',
            minWidth: 190
          },
          {
            title: '操作',
            key: '04',
            width: 80,
            render: (h, params) => {
              return h('div', {
                'class': {
                  oprateList: true
                }
              }, [
                // 删除
                h('a', {
                  'class': {
                    disabled: this.isOperation,
                    oprateBtn1: true
                  },
                  on: {
                    click: () => {
                      if (this.isOperation === 0) {
                        this.delOne(params.row)
                      }
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],

        isOperation: true,
        classTableID: 0
      }
    },
    computed: {
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange
        }
      }
    },
    created () {
      this.isOperation = this.$parent.isOperation
      this.classTableID = this.$parent.classTableID
    },
    mounted () {
      this.getSubjects('fir')
    },
    watch: {
      subjectRadio () {
        if (this.subjectRadio !== '') {
          this.isShowBtn = true
        } else {
          this.isShowBtn = false
        }
      }
    },
    methods: {
      // 学科列表数据
      async getSubjects (type) {
        if (type === 'fir') {
          this.xy.loading()
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/SelectMustTree`, {
          classTableID: this.classTableID
        })
        if (type === 'fir') {
          this.xy.unloading()
        }
        if (res.success) {
          this.subjectData = res.data

          this.crouseTree = []
          var dataList = res.data
          for (var i = 0; i < dataList.length; i++) {
            this.crouseTree.push({
              id: dataList[i].SubjectCategoryID,
              title: dataList[i].SubjectCategoryName,
              checked: false,
              expand: true,
              children: []
            })
            for (var j = 0; j < dataList[i].Levels.length; j++) {
              this.crouseTree[i].children.push({
                id: dataList[i].Levels[j].AID,
                title: dataList[i].Levels[j].SubjectName + '(' + dataList[i].Levels[j].StudntCount + '人)',
                type: dataList[i].Levels[j].Type,
                studentLimitation: dataList[i].Levels[j].StudentLimitation,
                checked: false,
                children: []
              })
            };
          };
        }
      },
      // 查看学科下的学生
      radioChange (val) {
        this.isNoData = false
        this.searchText = ''
        for (let i = 0, len = this.crouseTree.length; i < len; i++) {
          for (let m = 0; m < this.crouseTree[i].children.length; m++) {
            if (val === this.crouseTree[i].children[m].id) {
              this.courseProject = this.crouseTree[i].children[m]
              this.subjectRadio.ID = this.crouseTree[i].children[m].id
              this.subjectRadio.Type = this.crouseTree[i].children[m].type
              this.getTP(this.subjectRadio.ID, this.subjectRadio.Type)
              return false
            }
          }
        }
        // this.courseProject = val
        // this.getTP(val.id, val.type)

        // this.subjectRadio.ID = val.id
        // this.subjectRadio.Type = val.type
      },
      // 学生列表数据
      async getTP (aid, type) {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/GetCourseplanMustList`, {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          searchText: this.searchText,
          classTableID: this.classTableID,
          AID: aid,
          type: type
        })
        this.xy.unloading()
        if (res.success) {
          this.pagination.total = res.data.totalRecords
          this.datatable = res.data.data
          if (res.data.data.length === 0) {
            this.pageList = 0
          } else {
            this.pageList = res.data.data.length
          }
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.getTP(this.subjectRadio.ID, this.subjectRadio.Type)
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      // 搜索
      FromSubmit () {
        this.pagination.current = 1
        this.getTP(this.subjectRadio.ID, this.subjectRadio.Type)
      },

      // 删除
      delOne (row) {
        var _this = this
        _this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除' + row.FullName + '吗？',
          async onOk () {
            let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/CoursePlanSelectMustDelete`, {
              id: row.CoursePlanSelectMustID,
              ClassTableID: _this.classTableID
            })
            if (res.success) {
              _this.xy.msgSuc('删除成功。')
              if (_this.pageList > 1) {
                _this.pageList = _this.pageList - 1
              } else {
                if (_this.pagination.current > 1) {
                  _this.pagination.current = _this.pagination.current - 1
                }
              }
              _this.selectionAll = []
              _this.getTP(_this.subjectRadio.ID, _this.subjectRadio.Type)
              _this.getSubjects()
            }
          }
        })
      },
      // 批量删除
      delBatch () {
        var _this = this
        if (!_this.isNullData && _this.isOperation === 0) {
          if (_this.selectionAll.length === 0) {
            _this.xy.msgError('请勾选要删除的学生。')
          } else {
            var ids = ''
            for (var i = 0; i < _this.selectionAll.length; i++) {
              ids += _this.selectionAll[i].CoursePlanSelectMustID + ','
            }
            _this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要删除所有选中的学生吗？',
              async onOk () {
                let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/CoursePlanSelectMustDeleteByIds`, {
                  ClassTableID: _this.classTableID,
                  ids: ids
                })
                if (res.success) {
                  _this.xy.msgSuc('删除成功。')
                  if (_this.selectionAll.length === _this.pageList && _this.pagination.current > 1) {
                    _this.pagination.current = _this.pagination.current - 1
                  }
                  _this.selectionAll = []
                  _this.getTP(_this.subjectRadio.ID, _this.subjectRadio.Type)
                  _this.getSubjects()
                }
              }
            })
          }
        }
      },
      // 全部删除
      delAll () {
        var _this = this
        if (!_this.isNullData && _this.isOperation === 0) {
          _this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除所有学生吗？',
            async onOk () {
              let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/CreateCoursePlanSelectMustDeleteAll?classTableID=${_this.classTableID}
                &AID=${_this.subjectRadio.ID}
                &Type=${_this.subjectRadio.Type}`)
              if (res.success) {
                _this.xy.msgSuc('删除成功。')
                _this.getTP(_this.subjectRadio.ID, _this.subjectRadio.Type)
                _this.getSubjects()
              }
            }
          })
        }
      },

      // ===导入必选===
      ImportClick () {
        if (this.isOperation === 0) {
          this.$refs['upfile'].modalImport = true
          this.upload = {
            title: '导入必选',
            tipData: [''],
            formtData: ['xlsx', 'xls'],
            size: 10240,
            upParams: {},
            upUrl: `${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/SelectMustImport?classTableID=${this.classTableID}`, // 上传文件url
            templateUrl: `${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/DownloadMustTemplateImport`, // 模板下载url
            errorUrl: `${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/DownloadMustExceptionImport` // 下载错误文件url
          }
        }
      },
      modalSubmit () {
        this.getSubjects()
        this.getTP(this.subjectRadio.ID, this.subjectRadio.Type)
      },
      // ===导入必选 end===

      // 添加学生-start
      selectStudent () {
        this.isShowSelectStudent = true
      },
      selectCancel () {
        this.isShowSelectStudent = false
      },
      selectConfirm (data) {
        this.isShowSelectStudent = false
        this.selectedStudent = [...data] // 所选学生
        if (this.selectedStudent.length > 0) {
          this.addComplate()
        } else {
          this.xy.msgError('请先选择学生。')
        };
      },
      async addComplate () {
        var tutorArr = []
        for (var i = 0; i < this.selectedStudent.length; i++) {
          tutorArr.push(this.selectedStudent[i].StudentID)
        };
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/CreateCourseplanMust`, {
          ClassTableID: this.classTableID,
          Type: this.subjectRadio.Type,
          AID: this.subjectRadio.ID,
          StudentIdList: tutorArr
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('添加学生成功。')
          // 根据班级查询导师
          this.getTP(this.subjectRadio.ID, this.subjectRadio.Type)
          this.getSubjects()
        } else {
          this.xy.msgError('添加学生失败。')
        }
      }
      // 添加学生-end

    }
  }
</script>
<style lang="less" scoped>
.left-data {
    padding-right: 15px;
    height: 500px;
    overflow: auto;
    width: 250px
}
.left-data .import-btn{
    cursor: pointer;
    margin: 10px 0;
}
.left-data .import-btn i{
  margin-right: 5px;
  color: #1890ff;
}
.left-data .import-btn.disabled{
    cursor:no-drop;
    color: #ccc;
}
.left-data .import-btn.disabled i{
  color: #ccc;
}
.left-data .left-item-title{
  margin: 10px 0;
  color: rgba(0,0,0,0.45);
}
.left-data .radio-name{
  color: rgba(0,0,0,0.65);
}
.right-data {
    width: calc(100% - 280px);
    padding-left: 20px;
    border-left: 1px solid rgba(0, 0, 0, 0.09);
  height: 100%;
}

</style>
