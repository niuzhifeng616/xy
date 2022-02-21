<template>
  <div class="xy-content-module">
    <div class="xy-content-title flex-flow">
      <div>
        <Button class="xy-primary"
                @click="createClassTable">创建排课</Button>
        <!-- <span class="iconfont" style="font-size: 12px; margin: 0 5px 0 -8px;">&#xe6a2;</span> -->
        <Button class="xy-danger"
                @click="delAll">批量删除</Button>
      </div>
      <div class="xy-flex">
        <div style="margin-right:15px">
          <span>校区：</span>
          <Select v-model="schoolDistrictID"
                  @on-change="schoolChange"
                  style="width:200px">
            <Option v-for="item in schoolData"
                    :value="item.value"
                    :key="item.value"
                    :title="item.title">{{ item.label }}</Option>
          </Select>
        </div>
        <div>
          <span>学年学期：</span>
          <cascader :data="yearSessionData"
                    v-model="yearSession"
                    :clearable="false"
                    @on-change="cascaderChange"
                    style="width:200px; display:inline-block"></cascader>
        </div>
      </div>
    </div>
    <div class="xy-content-body">
      <div class="table">
        <XyAntTable
          :rowSelection="tableRowSelection"
          :columns="columnss"
          :dataSource="datatable"
          :nullData="nullData"
          :scrollx="'max-content'"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange">
          <div slot="ClassTableName" slot-scope="text, record">
            <div style="min-width:220px" class="table-el-hover" @click="edit(record)">
              {{text}}
            </div>
          </div>
          <div slot="SchoolDistrictName" slot-scope="text, record">
          <div style="min-width:120px" >
            {{record.SchoolDistrictName}}
          </div>
          </div>
          <div slot="StudentGradeNameForStudentYearName" slot-scope="text, record">
            <div style="min-width:100px" >
              {{record.StudentGradeNameForStudentYearName}}
            </div>
          </div>
          <div slot="yearAndSession" slot-scope="text, record">
            <div style="min-width:150px" >
              {{record.yearAndSession}}
            </div>
          </div>
          <div slot="CreateByFullName" slot-scope="text, record">
            <div style="min-width:80px" >
              {{record.CreateByFullName}}
            </div>
          </div>
          <div slot="SelectCourseStatusName" slot-scope="text, record">
            <i class="iconfont icon-default" v-if="record.SelectCourseStatus === 1 ">&#xe719;</i>
            <i class="iconfont icon-info" v-if="record.SelectCourseStatus === 2 ">&#xe719;</i>
            <i class="iconfont icon-end" v-if="record.SelectCourseStatus === 3 ">&#xe719;</i>
            <span>
              {{record.SelectCourseStatusName}}
            </span>
          </div>
          <div slot="IsEnabled" slot-scope="text, record">
            <i class="iconfont icon-info" v-if="record.SloverTaskStatusName ==='进行中'">&#xe719;</i>
            <i class="iconfont icon-success" v-if="record.SloverTaskStatusName ==='已发布'">&#xe719;</i>
            <i class="iconfont icon-use" v-if="record.SloverTaskStatusName ==='已启用' ">&#xe719;</i>
            <span>
              {{record.SloverTaskStatusName}}
            </span>
            <!-- <span>
              {{record.IsPublished === true ? '已发布' : '未发布'}}
            </span>
            <i class="iconfont icon-default" v-if="record.IsEnabled === 0 ">&#xe719;</i>
            <i class="iconfont icon-success" v-if="record.IsEnabled === 1 ">&#xe719;</i>
            <i class="iconfont icon-end" v-if="record.IsEnabled === 2 ">&#xe719;</i>
            <span>
                {{record.IsEnabled === 0 ? '未用'
                      : record.IsEnabled === 1 ? '启用'
                        : record.IsEnabled === 2 ? '停用' : ''}}
            </span> -->
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
                <a-menu-item @click="loadLearing(record)">学段管理</a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </XyAntTable>
      </div>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'TLClassTable',
    components: {
      XyAntTable
    },
    data () {
      return {
        // antTable
        selectedRowKeys: [],
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
        pageList: 0, // 当前页数据条数
        datatable: [],
        selectionAll: [],
        columnss: [
          {
            title: '排课名称',
            dataIndex: 'ClassTableName',
            scopedSlots: { customRender: 'ClassTableName' }
          },
          {
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            scopedSlots: { customRender: 'SchoolDistrictName' }
          },
          {
            title: '年级',
            dataIndex: 'StudentGradeNameForStudentYearName',
            scopedSlots: { customRender: 'StudentGradeNameForStudentYearName' }
          },
          {
            title: '学期',
            dataIndex: 'yearAndSession',
            scopedSlots: { customRender: 'yearAndSession' }
          },
          {
            title: '创建人',
            dataIndex: 'CreateByFullName',
            scopedSlots: { customRender: 'CreateByFullName' }
          },
          {
            title: '选课状态',
            dataIndex: 'SelectCourseStatusName',
            width: 150,
            scopedSlots: { customRender: 'SelectCourseStatusName' }
          },
          // {
          //   title: '发布状态',
          //   width: 150,
          //   scopedSlots: { customRender: 'IsPublished' }
          // },
          {
            title: '状态',
            width: 150,
            dataIndex: 'IsEnabled',
            scopedSlots: { customRender: 'IsEnabled' }
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
            width: 60,
            align: 'center',
            key: 'ClassTableID'
          },
          {
            title: '排课名称',
            key: 'ClassTableName',
            minWidth: 400,
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
              }, params.row.ClassTableName)
            }
          },
          {
            title: '选课状态',
            key: 'IsEnabled',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML:
                      params.row.SelectCourseStatusName
                  },
                  style: {
                    // 1未开始  2选课中  3已结束
                    color: params.row.SelectCourseStatus === 1 ? '' : params.row.SelectCourseStatus === 2 ? '#19be6b' : params.row.SelectCourseStatus === 3 ? '#ff9900' : ''
                  }
                })
              ])
            }
          },
          {
            title: '发布状态',
            key: 'IsPublished',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML:
                      params.row.IsPublished === true ? '已发布' : '未发布'
                  }
                })
              ])
            }
          },
          {
            title: '启用状态',
            key: 'IsEnabled',
            width: 120,
            className: 'set-dot',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  'class': 'dot',
                  style: {
                    background:
                      params.row.IsEnabled === 0 ? '#BFBFBF'
                      : params.row.IsEnabled === 1 ? '#52C41A'
                        : params.row.IsEnabled === 2 ? '#F5222D' : ''
                  }
                }),
                h('span', {
                  domProps: {
                    innerHTML:
                      params.row.IsEnabled === 0 ? '未用 '
                      : params.row.IsEnabled === 1 ? '启用'
                        : params.row.IsEnabled === 2 ? '停用' : ''
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
                    disabled: false,
                    oprateBtn1: true
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                }, '编辑'),
                // 更多
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
                        name: 'detail',
                        disabled: params.row._disabled
                      }
                    }, [
                      h('div', {
                        on: {
                          click: () => {
                            if (!params.row._disabled) {
                              this.del(params.row.ClassTableID, params.row.ClassTableName)
                            }
                          }
                        }
                      }, '删除')
                    ])

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
                            this.loadLearing(params.row)
                          }
                        }
                      }, '学段管理')
                    ])

                  ])
                ])

              ])
            }
          }
        ],

        //  排课任务参数
        classTableType: this.$store.state.csmstimetable.classTableID[2].id,
        schoolDistrictID: 0,
        schoolData: [],
        yearSession: [],
        yearSessionData: []
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
    created () {
      this.getSchool()
    },
    methods: {
      // 获取校区
      async getSchool () {
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`)
        if (res.success) {
          this.schoolData.push({
            value: 0,
            label: '所有校区'
          })
          res.data.map(item => {
            this.schoolData.push({
              value: item.SchoolDistrictID,
              label: item.SchoolDistrictName.length >= 8 ? `${item.SchoolDistrictName.substr(0, 7)}...` : item.SchoolDistrictName,
              title: item.SchoolDistrictName.length >= 8 ? item.SchoolDistrictName : ''
            })
          })
          this.getSessionNodeList()
        }
      },
      schoolChange (value) {
        this.schoolDistrictID = value
        this.pagination.current = 1
        this.loadTable()
      },

      // 学年学期
      async getSessionNodeList () {
        this.yearSessionData = [
          {
            'label': '所有学年',
            'value': 0,
            'children': [{
              'value': 0,
              'label': '所有学期',
              'children': []
            }]
          }]
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`)
        if (res.success) {
          this.yearSessionData = this.yearSessionData.concat(res.data)
          this.yearSession = []
          var index = this.yearSessionData.map((item) => {
            return item.IsCurrent
          }).indexOf(true)
          if (index !== -1) {
            this.yearSession.push(this.yearSessionData[index].value)
            var index1 = this.yearSessionData[index].children.map((item) => {
              return item.IsCurrent
            }).indexOf(true)
            if (index1 !== -1) {
              this.yearSession.push(this.yearSessionData[index].children[index1].value)
            } else {
              this.yearSession.push(0)
            }
          } else {
            if (this.yearSessionData.length > 0) {
              this.yearSession.push(this.yearSessionData[0].value)
              if (this.yearSessionData[0].children.length > 0) {
                this.yearSession.push(this.yearSessionData[0].children[0].value)
              } else {
                this.yearSession.push(0)
              }
            } else {
              this.yearSession = [0, 0]
            }
          }
          this.loadTable()
        }
      },
      cascaderChange (value) {
        this.pagination.current = 1
        this.yearSession = value
        this.loadTable()
      },
      // 获取列表数据
      async loadTable () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let res = await this.xy.get(
          `${this.$store.state.apiPath}/api/ClassTable/GetPage`,
          {
            schoolDistrictID: this.schoolDistrictID,
            academicSessionID: this.yearSession[1],
            academicYearID: this.yearSession[0],
            classTableType: this.classTableType,
            pageIndex: this.pagination.current ? this.pagination.current : 1,
            pageSize: this.pagination.pageSize
          }
        )
        if (res.success) {
          res.data.data.map(item => {
            item.yearAndSession = `${item.AcademicYearName}/${item.AcademicSessionName}`
            item.CreateByDate = this.xy.moment(item.CreateByDate).format('YYYY-MM-DD HH:mm')
            return item
          })
          this.datatable = res.data.data
          this.datatable.map((item, index) => {
            this.$set(item, 'key', index)
          })
          this.pagination.total = res.data.totalRecords
          if (res.data.data !== null && res.data.data.length > 0) {
            this.pageList = res.data.data.length
          }
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.loadTable()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      // 删除单个
      async del (row) {
        if (!row._disabled) {
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除"' + row.ClassTableName + '"吗？',
            onOk: () => {
              this.delObj(row.ClassTableID)
            }
          })
        }
      },
      async delObj (id) {
        this.xy.loading()
        let res = await this.xy.post(
          `${this.$store.state.apiPath}/api/ClassTable/Delete?classTableID=${id}`
        )
        this.xy.unloading()
        if (res.success) {
          if (this.pageList > 1) {
            this.pageList = this.pageList - 1
          } else {
            if (this.pagination.current > 1) {
              this.pagination.current = this.pagination.current - 1
            }
          }
          this.xy.msgSuc('删除成功。')
          this.loadTable()
        }
      },
      // 批量删除
      delAll () {
        let idsStr = ''
        if (this.selectionAll.length < 1) {
          this.xy.msgW('请选择要删除的排课方案。')
        } else {
          for (let i = 0; i < this.selectionAll.length; i++) {
            idsStr += this.selectionAll[i].ClassTableID + ','
          }
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除所有选中的数据吗？',
            onOk: () => {
              this.delAllObj(idsStr)
            }
          })
        }
      },
      async delAllObj (idsStr) {
        let res = await this.xy.post(
          `${this.$store.state.apiPath}/api/ClassTable/DeleteByIDs?classTableIDs=${idsStr}`
        )
        this.xy.unloading()
        if (res.success) {
          if (this.selectionAll.length === this.pageList && this.pagination.current > 1) {
            this.pagination.current = this.pagination.current - 1
          }
          this.selectionAll = []
          this.xy.msgSuc('删除成功。')
          this.loadTable()
        }
      },
      // 创建方案
      createClassTable () {
        this.$store.commit('csmstimetable/setTakeLessonsRowObj', {})
        this.$router.push({ path: '/xyhome/takeLessonsStepsHeader', query: this.$store.state.common.menuInfo })
      },
      // 编辑
      async edit (row) {
        this.$store.commit('csmstimetable/setTakeLessonsRowObj', row)
        this.$router.push({ path: '/xyhome/takeLessonsStepsHeader', query: this.$store.state.common.menuInfo })
      },

      // 学段管理
      loadLearing (row) {
        this.$store.commit('common/getThreeMenuName', '学段管理')
        this.$store.commit('csmstimetable/setTakeLessonsLearningPeriodManage', {
          classTableID: row.ClassTableID,
          classTableType: row.ClassTableType,
          classTableName: row.ClassTableName
        })
        this.$router.push({ path: '/xyhome/takeLessonsLearningPeriod', query: this.$store.state.common.menuInfo })
      },

      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.table {
  background: #fff;
}
.flex-flow {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.iconfont{
  vertical-align: middle;
}
</style>
