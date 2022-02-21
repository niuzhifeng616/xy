<template>
  <div>
    <div class="xy-content-title clearfix">
      <div class="fl">
        <Button class="xy-primary"
                @click="createClassTable"
                style="margin-right:10px">
          <!-- <Icon type="md-add" /> -->
          创建方案</Button>
        <Button class="xy-danger"
                @click="delAll">批量删除</Button>
      </div>
      <div class="fr pr">
        <i-select v-model="schoolDistrictID"
                  @on-change="schoolChange"
                  class="fl xy-content-title-search"
                  style="width:209px">
          <i-option :value="0"
                    key="01">所有校区</i-option>
          <i-option v-for="item in schoolData"
                    :value="item.SchoolDistrictID"
                    :key="item.SchoolDistrictID">{{ item.SchoolDistrictName }}</i-option>
        </i-select>
        <cascader :data="yearSessionData"
                  v-model="yearSession"
                  :clearable="false"
                  class="fl"
                  @on-change="cascaderChange"
                  style="margin-left: 15px"></cascader>
        <i-input search
                 v-model.trim="searchText"
                 @on-search="FromSubmit"
                 placeholder="请输入方案名称"
                 class="xy-content-title-search"
                 style="width: auto;">
          <icon type="ios-search cursor-p"
                slot="suffix" />
        </i-input>
      </div>
    </div>
    <div class="xy-content-body">
      <!-- <xy-table :tbColumns="columns"
                :tbData="datatable"
                :total="total"
                @changePage="changePage"
                @changePageSize="changePageSize"
                :pageSize="pageSize"
                :pageIndex="pageCurrent"
                :noDataText='noDataText'
                @changeSelect="changeSelect"></xy-table> -->
      <XyAntTable
        :rowSelection="tableRowSelection"
        :columns="columnss"
        :dataSource="datatable"
        :nullData="nullData"
        :isScrollx="true"
        :scrollx="1260"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange">
        <div slot="LayeredSelectProgrammeName" slot-scope="text, record">
          <div style="min-width:250px" class="table-el-hover" @click="edit(record)">
            {{record.LayeredSelectProgrammeName}}
          </div>
        </div>
        <div slot="SchoolDistrictName" slot-scope="text, record">
          <div style="min-width:150px" >
            {{record.SchoolDistrictName}}
          </div>
        </div>
        <div slot="StudentGradeNameForStudentYearName" slot-scope="text, record">
          <div style="min-width:150px" >
            {{record.StudentGradeNameForStudentYearName}}
          </div>
        </div>
        <div slot="yearAndSession" slot-scope="text, record">
          <div style="min-width:150px" >
            {{record.yearAndSession}}
          </div>
        </div>
        <div slot="CreateByFullName" slot-scope="text, record">
          <div style="min-width:80px">
            {{record.CreateByFullName}}
          </div>
        </div>
        <div slot="CreateByDay" slot-scope="text, record">
          <div>
            {{record.CreateByDay}}
          </div>
        </div>
        <div slot="LayeredSelectProgrammeState" slot-scope="text, record">
            <i class="iconfont icon-default" v-if="record.LayeredSelectProgrammeState === 0 ">&#xe719;</i>
            <i class="iconfont icon-info" v-if="record.LayeredSelectProgrammeState === 1 ">&#xe719;</i>
            <i class="iconfont icon-end" v-if="record.LayeredSelectProgrammeState === 2 ">&#xe719;</i>
            <i class="iconfont icon-success" v-if="record.LayeredSelectProgrammeState === 3 ">&#xe719;</i>
            <span>
                {{record.LayeredSelectProgrammeState === 0 ? '未开始 '
                      : record.LayeredSelectProgrammeState === 1 ? '进行中'
                        : record.LayeredSelectProgrammeState === 2 ? '已结束'
                          : record.LayeredSelectProgrammeState === 3 ? '已发布' : ''}}
            </span>
          </div>
        <div slot="oprateRender"  slot-scope="text, record">
          <a @click="edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item :disabled="record._disabled" @click="del(record)">删除</a-menu-item>
              <a-menu-item @click="copyClassTable(record)">复制</a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </XyAntTable>
    </div>
    <modal v-model="modalCopy"
            :transfer="false"
            :mask-closable="false">
      <p slot="header">复制排课方案</p>
      <div class="dialog-model-content">
        <i-form ref="formValidate"
                :model="formValidate"
                :rules="ruleValidate"
                label-position="top">
          <form-item label="排课名称"
                      prop="copyClassTableName"
                      label-for="copyClassTableName">
            <i-input v-model="formValidate.copyClassTableName"
                      element-id="copyClassTableName"
                      clearable></i-input>
          </form-item>
          <form-item label="所属学年"
                      prop="copyClassTableYear">
            <i-select v-model="formValidate.copyClassTableYear"
                      :value="formValidate.copyClassTableYear"
                      @on-change="yearCopy"
                      :label="formValidate.copyClassTableYear"
                      placeholder="请选择学年">
              <i-option v-for="year in yearDataCopy"
                        :value="year.value"
                        :key="year.label">
                {{ year.label }}
              </i-option>
            </i-select>
          </form-item>
          <form-item label="所属学期"
                     prop="copyClassTableSession">
            <i-select v-model="formValidate.copyClassTableSession"
                      :value="formValidate.copyClassTableSession"
                      @on-change="sessionCopy"
                      :label="formValidate.copyClassTableSession"
                      placeholder="请选择学期">
              <i-option v-for="session in sessionDataCopy"
                        :value="session.value"
                        :key="session.label">{{ session.label }}</i-option>
            </i-select>
          </form-item>
        </i-form>
      </div>
      <div slot="footer">
         <Button class="xy-modal-close"
                @click="copyCancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="copyOk"
                style="margin-right:10px">保 存</Button>
      </div>
    </modal>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    components: {
      XyAntTable
    },
    data () {
      return {
        noDataText: '该搜索条件下没有结果。',
        isPages: true,
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
            this.pageCurrent = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
            this.pageCurrent = 1
            this.pageSize = pageSize
          }
        },
        pageSize: 15, // 每页显示条数
        pageCurrent: 1, // 当前页码
        pageList: '', // 当前页数据条数
        total: 0,
        selectionAll: [],
        columnss: [
          {
            title: '方案名称',
            dataIndex: 'LayeredSelectProgrammeName',
            scopedSlots: { customRender: 'LayeredSelectProgrammeName' }
          },
          {
            title: '校区',
            scopedSlots: { customRender: 'SchoolDistrictName' }
          },
          {
            title: '年级',
            scopedSlots: { customRender: 'StudentGradeNameForStudentYearName' }
          },
          {
            title: '学期',
            scopedSlots: { customRender: 'yearAndSession' }
          },
          {
            title: '创建人',
            scopedSlots: { customRender: 'CreateByFullName' }
          },
          // {
          //   title: '创建时间',
          //   width: 120,
          //   scopedSlots: { customRender: 'CreateByDay' }
          // },
          {
            title: '状态',
            width: 150,
            scopedSlots: { customRender: 'LayeredSelectProgrammeState' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            width: 140,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        columns: [
          {
            type: 'selection',
            title: '方案名称',
            width: 60,
            align: 'center',
            key: 'LayeredSelectProgrammeID'
          },
          {
            title: '方案名称',
            key: 'LayeredSelectProgrammeName',
            minWidth: 250,
            render: (h, params) => {
              return h('span', {
                attrs: {
                  class: 'table-el-hover'
                },
                on: {
                  click: () => {
                    this.edit(params.row)
                  }
                }
              }, params.row.LayeredSelectProgrammeName)
            }
          },
          {
            title: '校区',
            key: 'SchoolDistrictName',
            minWidth: 150
          },
          {
            title: '年级',
            key: 'StudentGradeNameForStudentYearName',
            width: 150
          },
          {
            title: '创建人',
            key: 'CreateByFullName',
            width: 150
          },
          {
            title: '创建时间',
            key: 'CreateByDay',
            width: 120
          },
          {
            title: '状态',
            key: 'LayeredSelectProgrammeState',
            className: 'set-dot',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('i', {
                  domProps: {
                    innerHTML: '&#xe719;'
                  },
                  style: {
                    marginRight: '5px',
                    verticalAlign: 'middle'
                  },
                  class: {
                    iconfont: true,
                    'icon-default': params.row.LayeredSelectProgrammeState === 0,
                    'icon-info': params.row.LayeredSelectProgrammeState === 1,
                    'icon-end': params.row.LayeredSelectProgrammeState === 2,
                    'icon-success': params.row.LayeredSelectProgrammeState === 3
                  }
                }),
                h('span', {
                  domProps: {
                    innerHTML: params.row.LayeredSelectProgrammeState === 0 ? '未开始 '
                      : params.row.LayeredSelectProgrammeState === 1 ? '进行中'
                        : params.row.LayeredSelectProgrammeState === 2 ? '已结束'
                          : params.row.LayeredSelectProgrammeState === 3 ? '已发布' : ''
                  }
                })
              ])
            }
          },
          {
            title: '操作',
            key: '04',
            width: 140,
            render: (h, params) => {
              return h('div', {
                'class': {
                  oprateList: true
                }
              }, [
                h('a', {
                  'class': {
                    oprateBtn1: true
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                }, '编辑'),
                h('Dropdown', {
                  props: {
                    trigger: 'click'
                  }
                }, [
                  h('div', {
                    'class': {
                      oprateBtn2: true
                    }
                  }, [
                    h('a', {}, '更多'),
                    h('Icon', {
                      props: {
                        type: 'ios-arrow-down'
                      },
                      style: {
                        color: '#1890FF'
                      }
                    })
                  ]),
                  h('DropdownMenu', {
                    slot: 'list'
                  }, [
                    h('DropdownItem', {
                      props: {
                        name: 'detail'
                      }
                    }, [
                      h('div', {
                        on: {
                          click: () => {
                            this.copyClassTable(params.row)
                          }
                        }
                      }, '复制')
                    ]),
                    h('DropdownItem', {
                      props: {
                        name: 'detail',
                        disabled: !!params.row._disabled
                      }
                    }, [
                      h('div', {
                        on: {
                          click: () => {
                            if (!params.row._disabled) {
                              this.del(params.row)
                            }
                          }
                        }
                      }, '删除')
                    ])
                  ])
                ])
              ])
            }
          }
        ],
        datatable: [], // table数据
        // 复制排课方案
        modalCopy: false,
        copyObj: null,
        yearDataCopy: [],
        sessionDataCopy: [],
        formValidate: {
          copyClassTableName: '',
          copyClassTableYear: '',
          copyClassTableSession: ''
        },
        ruleValidate: {
          copyClassTableName: [
            {
              required: true,
              message: '排课任务名称不能为空',
              trigger: 'blur'
            },
            {
              max: 15,
              message: '排课任务名称不能超过15个字',
              trigger: 'blur'
            }
          ],
          copyClassTableYear: [{
            type: 'number',
            required: true,
            message: '请选择学年',
            trigger: 'change'
          }],
          copyClassTableSession: [{
            type: 'number',
            required: true,
            message: '请选择学期',
            trigger: 'change'
          }]
        },
        schoolDistrictID: 0,
        schoolData: [],
        yearSessionData: [],
        yearSession: [],
        searchText: '',
        loading: true,
        modalLog: false,
        logList: [],
        isRefresh: false
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
              disabled: record._disabled
            }
          })
        }
      }
    },
    mounted () {
      this.$store.commit('common/getThreeMenuName', '')
      this.getSchool()
    },
    methods: {
      // 获取校区
      getSchool () {
        let that = this
        this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`).then(res => {
          if (res.success) {
            that.schoolData = res.data
            that.getSessionNodeList()
          }
        })
      },
      schoolChange: function (value) {
        this.pageCurrent = 1
        this.pagination.current = 1
        this.SchoolDistrictID = value
        this.loadTable()
      },
      // 学年学期
      getSessionNodeList: function () {
        let that = this
        that.yearSessionData = [
          {
            'label': '所有学年',
            'value': 0,
            'children': [{
              'value': 0,
              'label': '所有学期',
              'children': []
            }]
          }]
        this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`).then(res => {
          if (res.success) {
            that.yearSessionData = that.yearSessionData.concat(res.data)
            that.yearSession = []
            let index = that.yearSessionData.map(function (item) {
              return item.IsCurrent
            }).indexOf(true)
            if (index !== -1) {
              that.yearSession.push(that.yearSessionData[index].value)
              let index1 = that.yearSessionData[index].children.map(function (item) {
                return item.IsCurrent
              }).indexOf(true)
              if (index1 !== -1) {
                that.yearSession.push(that.yearSessionData[index].children[index1].value)
              } else {
                that.yearSession = [0, 0]
              }
            } else {
              that.yearSession = [0, 0]
            }
            that.loadTable()
          }
        })
      },
      cascaderChange (value) {
        this.pageCurrent = 1
        this.pagination.current = 1
        this.yearSession = value
        this.loadTable()
      },
      // 获取table/分页数据
      loadTable () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let obj = {
          PageIndex: this.pageCurrent,
          PageSize: this.pageSize,
          SchoolDistrictID: this.schoolDistrictID,
          AcademicSessionID: this.yearSession[1],
          SeachText: this.searchText,
          applicationID: this.$store.state.common.menuId.split(',')[0],
          applicationSubMenuID: this.$store.state.common.menuId.split(',')[1]
        }
        this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectProgramme/GetPage`, obj).then(res => {
          if (res.success) {
            this.pagination.total = res.data.totalRecords
            if (res.data.data.length === 0) {
              this.pageList = 0
            } else {
              this.pageList = res.data.data.length
            }
            res.data.data.map(item => {
              item.yearAndSession = `${item.AcademicYearName}/${item.AcademicSessionName}`
              return item
            })
            this.datatable = res.data.data
            this.datatable.map((item, index) => {
              this.$set(item, 'key', index)
            })
          }
          this.tableLoading = false
        })
      },
      handleTableChange () {
        this.loadTable()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      FromSubmit () {
        this.pageCurrent = 1
        this.pagination.current = 1
        this.loadTable()
      },
      // 创建
      createClassTable: function () {
        this.$store.commit('csmstimetable/changeLayeredRowObj', {})
        this.$store.commit('common/getThreeMenuName', '创建方案')
        this.$store.commit('common/getParam', { pro: 'layeredClassTable' })
        this.$router.push({ path: '/xyhome/layeredStepsHeader', query: this.$store.state.common.menuInfo })
      },
      // 单击表格中编辑按钮触发
      edit: function (row) {
        this.$store.commit('common/getThreeMenuName', '编辑方案')
        this.$store.commit('csmstimetable/changeLayeredRowObj', row)
        this.$store.commit('common/getParam', { pro: 'layeredClassTable' })
        this.$router.push({ path: '/xyhome/layeredStepsHeader', query: this.$store.state.common.menuInfo })
      },
      // 单击删除单个内容触发
      del: function (row) {
        let that = this
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除"' + row.LayeredSelectProgrammeName + '"吗？',
          onOk: function () {
            // let idArr = [row.LayeredSelectProgrammeID]
            that.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgramme/Deletes?ids=${row.LayeredSelectProgrammeID}`).then(res => {
              if (res.success) {
                if (that.pageList > 1) {
                  that.pageList = that.pageList - 1
                } else {
                  if (that.pageCurrent > 1) {
                    this.pagination.current = that.pageCurrent - 1
                    that.pageCurrent = that.pageCurrent - 1
                  }
                }
                that.xy.msgSuc('删除成功。')
                that.loadTable()
              }
            })
          }
        })
      },
      // 单击批量删除触发
      delAll: function () {
        let that = this
        if (that.selectionAll.length < 1) {
          this.xy.msgW('请选择要删除的排课任务。')
        } else {
          let ids = ''
          for (let i = 0; i < that.selectionAll.length; i++) {
            ids += `ids=${that.selectionAll[i].LayeredSelectProgrammeID}` + (i === that.selectionAll.length - 1 ? '' : '&')
          }
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除所有选中的排课方案吗?',
            onOk: function () {
              that.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgramme/Deletes?${ids}`).then(res => {
                if (res.success) {
                  that.xy.msgSuc('删除成功。')
                  if (that.selectionAll.length === that.pageList && that.pageCurrent > 1) {
                    that.pageCurrent = that.pageCurrent - 1
                    this.pagination.current = that.pageCurrent - 1
                  }
                  that.loadTable()
                  that.selectionAll = []
                }
              })
            }
          })
        }
      },
      // -------------------复制排课方案----------------------------
      copyClassTable: function (row) {
        this.modalCopy = true
        this.copyObj = row
        this.classTableID = row.LayeredSelectProgrammeID
        this.formValidate.copyClassTableName = row.LayeredSelectProgrammeName + '（1）'
        this.formValidate.copyClassTableYear = row.AcademicYearID
        this.formValidate.copyClassTableSession = row.AcademicSessionID
        this.copyGetYear()
      },
      copyGetYear: function () {
        let that = this
        this.xy.get(`${this.xyApi}/xy/comm/YearList`).then(res => {
          that.yearDataCopy = []
          res.data.map(item =>
            that.yearDataCopy.push({
              value: item.ID,
              label: item.Name
            })
          )
          that.copyGetSession()
        })
      },
      copyGetSession: function () {
        let that = this
        that.sessionID = 0
        this.xy.get(`${this.xyApi}/xy/comm/SessionList`, {
          yearID: that.formValidate.copyClassTableYear
        }).then(res => {
          that.sessionDataCopy = []
          res.data.map(item =>
            that.sessionDataCopy.push({
              value: item.AcademicSessionID,
              label: item.AcademicSessionName
            }))
        })
      },
      yearCopy: function (value) {
        this.formValidate.copyClassTableYear = value
        this.formValidate.copyClassTableSession = ''
        this.sessionDataCopy = []
        this.copyGetSession()
      },

      sessionCopy: function (value) {
        this.formValidate.copyClassTableSession = value
      },
      copyOk: function () {
        let that = this
        this.$refs.formValidate.validate(function (valid) {
          if (!valid) {
            return that.changeLoading()
          } else {
            that.xy.loading()
            that.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgramme/Copy`, {
              ObjectID: that.classTableID,
              ObjectName: that.formValidate.copyClassTableName,
              AdemicSessionID: that.formValidate.copyClassTableSession,
              LayeredSelectRotationID: that.copyObj.LayeredSelectRotationID
            }).then(res => {
              if (res.success) {
                that.modalCopy = false
                that.xy.msgSuc('复制成功。')
                that.loadTable()
              }
              that.xy.unloading()
            })
          }
        })
      },
      copyCancel: function () {
        let that = this
        that.modalCopy = false
      },
      changeLoading: function () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      }
    // ------------------复制排课方案完-----------------------
    }

  }
</script>

<style lang="less" scoped>
.iconfont{
  vertical-align: middle;
}
</style>
