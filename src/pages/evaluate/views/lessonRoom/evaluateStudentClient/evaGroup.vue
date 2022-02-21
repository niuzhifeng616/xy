<template>
  <div class="box xy-content-module">
    <div class="xy-content-title pr">
      <div style="height: 36px;line-height: 36px;border-bottom: 1px solid #1890FF;margin-bottom: 20px;" class="tab-active">
        <span @click="changeName('小组')" :class="indexTitle==='小组'?'active':''" v-if="params.isSettingGroup">小组</span>
        <span @click="changeName('学生')" :class="indexTitle==='学生'?'active':''">学生</span>
      </div>
      <div style="margin-bottom: 20px;font-size: 16px;">{{params.strs}}</div>
      <p @click="toEvaRecording" class="to-recording">评价记录</p>
    </div>
    <div class="xy-content-body pr">
      <div label="小组" name="小组" v-show="indexTitle==='小组'">
        <XyTable
          :noDataText="'该搜索条件下没有结果。'"
          @changeSelect="changeSelectGroup"
          :tbColumns="columnsGroup"
          :maxHeight1="height1"
          :tbData="dataTableGroup"
          :isShowPage="false">
        </XyTable>
      </div>
      <div label="学生" name="学生" v-show="indexTitle==='学生'">
        <div class="box-student xy-flex xy-between">
          <div class="left">
            <XyAntTable
              :rowSelection="tableRowSelection"
              :columns="columnss"
              :dataSource="dataTable"
              :nullData="nullData"
              :scrolly="600"
              :isPage="false"
              :tableLoading="tableLoading"
              :isScroll="true"
              :scrollx="700">
              <div slot="Icon" slot-scope="text, record">
                <div style="width:30px;height:30px;border-radius:50%" v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
                  <span class="head-font">
                    {{ xy.showName(record.FullName)}}
                  </span>
                </div>
                <img style="width:30px;height:30px;border-radius:50%" v-else :src="path + record.Icon + '?' + Math.random() * 15">
              </div>
              <div slot="UserName" slot-scope="text, record">
                <div style="min-width:150px" @click="edit(record)">
                  {{record.UserName}}
                </div>
              </div>
              <div slot="FullName" slot-scope="text, record">
                <div style="min-width:150px" >
                  {{record.FullName}}
                </div>
              </div>
              <div slot="TotalScore" slot-scope="text, record">
                <div style="min-width:80px" >
                  {{record.TotalScore}}
                </div>
              </div>
            </XyAntTable>
          </div>
          <div class="right">
            <Menu mode="horizontal"
                  theme="light"
                  @on-select="changeActiveName"
                  :active-name="activeName">
              <MenuItem :name="1"> 常用指标
              <Icon type="ios-settings"
                    class="xyiconicon-test1"
                    @click.stop="openSetting"/>
              </MenuItem>
              <MenuItem :name="2"> 全部指标
              </MenuItem>
            </Menu>
            <Tree :data="treeList"
            class="tree"
            @on-check-change="pickTarget"
            show-checkbox
            multiple></Tree>
          </div>
        </div>
      </div>
    </div>
    <div class="save" >
      <Button class="xy-btn-close" @click="back">返回</Button>
      <Button class="xy-modal-primary" shape="circle" @click="save">保存</Button>
    </div>
    <modal
        v-model="settinModel"
        v-bind:mask-closable="false"
        v-bind:transfer="false"
        title="设置常用评价标准"
        v-cloak
        class="model">
        <div class="search">
          <Input
            search
            v-model.trim="searchTextModel"
            @on-search="FromSubmit"
            placeholder="请输入指标名称"
            class="xy-content-title-search"
            style="width: auto;" />
        </div>
        <p class="title">选择指标</p>
        <Tree :data="treeSettingList"
        ref="setModalRree"
        @on-check-change="checkedSetting"
              show-checkbox
              multiple></Tree>
        <div slot="footer">
          <Button class="xy-modal-close"
                  @click="settinModel = false">取消</Button>
          <Button class="xy-modal-primary"
                  shape="circle"
                  @click="saveSetting">保存</Button>
        </div>
      </modal>
  </div>
</template>
<script>
  import XyTable from '@/components/table/XyTable'
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    components: {
      XyTable,
      XyAntTable
    },
    name: 'evaGroup',
    data () {
      return {
        params: JSON.parse(this.$route.query.params),
        treeSettingList: [
          {
            title: '全选',
            expand: true,
            Level: 0,
            children: []
          }
        ],
        dataTableGroup: [],
        settinModel: false,
        searchTextModel: '',
        searchText: '',
        treeList: [
          {
            title: '全选',
            expand: true,
            children: []
          }
        ],
        indexTitle: '小组',
        pickedArrGroup: [],
        pickedArr: [],
        dataTable: [],
        columnsGroup: [
          {
            type: 'selection',
            width: 70,
            align: 'center'
          },
          {
            minWidth: 100,
            title: '小组',
            key: 'GroupName'
          },
          {
            minWidth: 100,
            title: '小组得分',
            key: 'GroupValue'
          },
          {
            minWidth: 100,
            title: '小组排名',
            key: 'GroupRank'
          },
          {
            minWidth: 200,
            title: '小组排名积分',
            key: 'GroupRankingValue'
          },
          {
            minWidth: 100,
            title: '加分',
            key: 'AddFraction',
            render: (h, params) => {
              return h('div', [
                h('InputNumber', {
                  props: {
                    value: params.row.AddFraction || 1,
                    min: 1
                  },
                  on: {
                    'on-change': (v) => {
                      params.row.AddFraction = v
                      this.dataTableGroup[params.index].AddFraction = v
                      this.dataTableGroup[params.index]._checked = true
                      let index = this.pickedArrGroup.map(item => { return item.GroupID }).indexOf(params.row.GroupID)
                      if (index > -1) {
                        this.pickedArrGroup.splice(index, 1)
                      }
                      this.pickedArrGroup.push(params.row)
                      // this.upGroupInput(params.row)
                    }
                  }
                })
              ])
            }
          }
        ],
        height1: 600,
        // antTable
        scrollx: 'max-content',
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        columnss: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 40,
            scopedSlots: { customRender: 'Icon' },
            className: 'table-pic'
          },
          {
            title: '用户名',
            dataIndex: 'UserName',
            scopedSlots: { customRender: 'UserName' }
          },
          {
            title: '姓名',
            dataIndex: 'FullName',
            scopedSlots: { customRender: 'FullName' }
          },
          {
            title: '得分',
            dataIndex: 'TotalScore',
            scopedSlots: { customRender: 'TotalScore' }
          }
        ],
        activeName: 1,
        settingList: [],
        targetList: [],
        apiPath: ''
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
      this.path = this.xy.getCookie('eva')
      this.indexTitle = JSON.parse(this.$route.query.params).isSettingGroup ? '小组' : '学生'
      if (!JSON.parse(this.$route.query.params).isSettingGroup) {
        this.columnss.length = 5
      }
    },
    watch: {
      indexTitle: {
        handler (val) {
          if (val === '小组') {
            this.fetchLeftGroupStudentList()
          } else {
            this.fetchRightStudentList()
          }
        },
        immediate: true
      },
      activeName: {
        handler (val) {
          if (val === 1) {
            this.fetchCommUsedList()
          } else {
            this.fetchAllList()
          }
        },
        immediate: true
      }
    },
    methods: {
      // 去评价记录
      toEvaRecording () {
        this.$store.commit('common/getThreeMenuName', `${this.$route.query.menuName}`)
        this.$store.commit('common/getParam', { params: this.$route.query.params })
        this.$router.push({
          name: 'evaRecordingClient',
          query: this.$store.state.common.menuInfo
        })
      },
      // 选择常用指标或者全部指标，只要最后一级
      pickTarget (val) {
        if (!val.length) { return }
        let arr = []
        for (let iv of val) {
          if (iv.Level === 1 && iv.children.length === 0) {
            arr.push({ IndexManagementID: iv.IndexManagementID, Value: iv.DefaultValue })
          }
          if (iv.Level === 2 && iv.children.length === 0) {
            arr.push({ IndexManagementID: iv.IndexManagementID, Value: iv.DefaultValue })
          }
          if (iv.Level === 3) {
            arr.push({ IndexManagementID: iv.IndexManagementID, Value: iv.DefaultValue })
          }
        }
        this.targetList = arr
      },
      // 选择设置指标
      checkedSetting (val) {
        // this.settingList = val
      },
      changeName (val) {
        this.indexTitle = val
        this.columnss = [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 40,
            scopedSlots: { customRender: 'Icon' },
            className: 'table-pic'
          },
          {
            title: '用户名',
            dataIndex: 'UserName',
            scopedSlots: { customRender: 'UserName' }
          },
          {
            title: '姓名',
            dataIndex: 'FullName',
            scopedSlots: { customRender: 'FullName' }
          },
          {
            title: '得分',
            dataIndex: 'TotalScore',
            scopedSlots: { customRender: 'TotalScore' }
          }
        ]
      },
      changeActiveName (val) {
        this.activeName = val
      },
      // 根据课表信息 获取小组评分信息
      async fetchLeftGroupStudentList () {
        let params = {
          schoolDistrictID: this.params.SchoolDistrictID,
          academicSessionID: this.params.AcademicSessionID,
          classTableGenerateBaseID: this.params.ClassTableGenerateBaseID,
          coursePlanAID: this.params.CoursePlanAID,
          coursePlanAIDType: this.params.CoursePlanAIDType
        }
        this.xy.loading()
        let res = await this.xy.get(`${this.xy.getCookie('eva')}/api/ClassRoomGroupRecord/GetClassRoomRecordGroupInfo`, params)
        this.xy.unloading()
        this.dataTableGroup = []
        if (res.msg) {
          return this.xy.msgW(res.msg)
        }
        if (res.success) {
          if (res.data.length > 0) {
            this.dataTableGroup = res.data.map(val => {
              val.AddFraction = 1
              return val
            })
          }
        }
      },
      // 获取学生列表
      async fetchRightStudentList () {
        let params = {
          coursePlanAID: this.params.CoursePlanAID,
          classTableGenerateBaseID: this.params.ClassTableGenerateBaseID,
          coursePlanAIDType: this.params.CoursePlanAIDType,
          studentOrganizationID: this.params.StudentOrganizationID
        }
        this.pickedArr = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let res = await this.xy.get(`${this.xy.getCookie('eva')}/api/EvaluateStudent/GetStudentScoreList`, params)
        this.xy.unloading()
        if (res.success) {
          this.dataTable = []
          if (res.data.length > 0) {
            this.dataTable = res.data
            this.dataTable.map((item, index) => {
              this.$set(item, 'key', index)
            })
            this.columnss = [
              {
                title: ' ',
                dataIndex: 'Icon',
                width: 40,
                scopedSlots: { customRender: 'Icon' },
                className: 'table-pic'
              },
              {
                title: '用户名',
                dataIndex: 'UserName',
                scopedSlots: { customRender: 'UserName' }
              },
              {
                title: '姓名',
                dataIndex: 'FullName',
                scopedSlots: { customRender: 'FullName' }
              },
              {
                title: '得分',
                dataIndex: 'TotalScore',
                scopedSlots: { customRender: 'TotalScore' }
              }
            ]
            if (this.params.isSettingGroup) {
              this.columnss.splice(3, 0, {
                title: '小组排名积分',
                dataIndex: 'GroupRankingScore',
                width: 120,
                scopedSlots: { customRender: 'GroupRankingScore' }
              })
            }
          }
        }
        this.tableLoading = false
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.pickedArr = val
      },
      // 获取常用指标列表
      async fetchCommUsedList () {
        this.treeList[0].children = []
        this.xy.loading()
        let res = await this.xy.get(`${this.xy.getCookie('eva')}/api/EvaluateStudent/GetStudentCommonIndex`, {
          schoolDistrictID: this.params.SchoolDistrictID,
          academicSessionID: this.params.AcademicSessionID,
          academicYearID: this.params.AcademicYearID,
          studentGradeForStudentYearID: this.params.StudentGradeForStudentYearID,
          disciplineID: this.params.DisciplineID
        })
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            this.treeList[0].children = res.data.map(val => {
              return {
                title: val.IndexManagementName,
                expand: true,
                IndexManagementID: val.IndexManagementID,
                Level: val.Level,
                ParentID: val.ParentID,
                children: val.Childrens.length ? val.Childrens.map(vv => {
                  return {
                    title: vv.IndexManagementName,
                    expand: true,
                    IndexManagementID: vv.IndexManagementID,
                    Level: vv.Level,
                    ParentID: vv.ParentID,
                    checked: vv.Checked,
                    DefaultValue: vv.DefaultValue,
                    children: [],
                    render: (h, { root, node, data }) => {
                      return h('span', {
                        style: {
                          display: 'inline-block',
                          width: '100%'
                        }
                      }, [
                        h('span', vv.IndexManagementName),
                        h('span', [
                          h('Rate', {
                            style: {
                              display: vv.SocringMethod === 1 ? 'inline-block' : 'none',
                              marginRight: '8px',
                              marginLeft: '8px'
                            },
                            props: {
                              value: vv.DefaultValue,
                              count: vv.MaxValue,
                              customIcon: 'iconfont icon-Starunselectedbeifen',
                              clearable: vv.MinValue === 0
                            },
                            on: {
                              'on-change': (v) => {
                                if (v < vv.MinValue) {
                                  this.xy.msgError('不能小于' + vv.MinValue + '。')
                                  vv.DefaultValue = vv.MinValue
                                  return false
                                }
                                if (v > vv.MaxValue) {
                                  this.xy.msgError('不能大于' + vv.MaxValue + '。')
                                  vv.DefaultValue = vv.MaxValue
                                  return false
                                }
                                data.DefaultValue = v
                                data.checked = true
                                let index = this.targetList.map(item => { return item.IndexManagementID }).indexOf(vv.IndexManagementID)
                                if (index > -1) {
                                  this.targetList.splice(index, 1)
                                }
                                this.targetList.push({
                                  IndexManagementID: vv.IndexManagementID,
                                  Value: v
                                })
                                // this.upDefaultValue(data)
                              }
                            }
                          }),
                          h('InputNumber', {
                            style: {
                              display: vv.SocringMethod === 0 ? 'inline-block' : 'none',
                              marginRight: '8px',
                              marginLeft: '8px'
                            },
                            props: {
                              value: vv.DefaultValue,
                              min: vv.MinValue,
                              max: vv.MaxValue
                            },
                            on: {
                              'on-change': (v) => {
                                if (v < vv.MinValue) {
                                  this.xy.msgError('不能小于' + vv.MinValue + '。')
                                  vv.DefaultValue = vv.MinValue
                                  return false
                                }
                                if (v > vv.MaxValue) {
                                  this.xy.msgError('不能大于' + vv.MaxValue + '。')
                                  vv.DefaultValue = vv.MaxValue
                                  return false
                                }
                                data.DefaultValue = v
                                data.checked = true
                                let index = this.targetList.map(item => { return item.IndexManagementID }).indexOf(vv.IndexManagementID)
                                if (index > -1) {
                                  this.targetList.splice(index, 1)
                                }
                                this.targetList.push({
                                  IndexManagementID: vv.IndexManagementID,
                                  Value: v
                                })
                                // this.upDefaultValue(data)
                              }
                            }
                          })
                        ])
                      ])
                    }
                  }
                }) : [],
                render: !val.Childrens.length ? (h, { root, node, data }) => {
                  return h('span', {
                    style: {
                      display: 'inline-block',
                      width: '100%'
                    }
                  }, [
                    h('span', val.IndexManagementName),
                    h('span', [
                      h('Rate', {
                        style: {
                          display: val.SocringMethod === 1 ? 'inline-block' : 'none',
                          marginRight: '8px',
                          marginLeft: '8px'
                        },
                        props: {
                          value: val.DefaultValue,
                          count: val.MaxValue,
                          customIcon: 'iconfont icon-Starunselectedbeifen',
                          clearable: val.MinValue === 0
                        },
                        on: {
                          'on-change': (v) => {
                            if (v < val.MinValue) {
                              this.xy.msgError('不能小于' + val.MinValue + '。')
                              val.DefaultValue = val.MinValue
                              return false
                            }
                            if (v > val.MaxValue) {
                              this.xy.msgError('不能大于' + val.MaxValue + '。')
                              val.DefaultValue = val.MaxValue
                              return false
                            }
                            data.DefaultValue = v
                            data.checked = true
                            let index = this.targetList.map(item => { return item.IndexManagementID }).indexOf(val.IndexManagementID)
                            if (index > -1) {
                              this.targetList.splice(index, 1)
                            }
                            this.targetList.push({
                              IndexManagementID: val.IndexManagementID,
                              Value: v
                            })
                            // this.upDefaultValue(data)
                          }
                        }
                      }),
                      h('InputNumber', {
                        style: {
                          display: val.SocringMethod === 0 ? 'inline-block' : 'none',
                          marginRight: '8px',
                          marginLeft: '8px'
                        },
                        props: {
                          value: val.DefaultValue,
                          min: val.MinValue,
                          max: val.MaxValue
                        },
                        on: {
                          'on-change': (v) => {
                            if (v < val.MinValue) {
                              this.xy.msgError('不能小于' + val.MinValue + '。')
                              val.DefaultValue = val.MinValue
                              return false
                            }
                            if (v > val.MaxValue) {
                              this.xy.msgError('不能大于' + val.MaxValue + '。')
                              val.DefaultValue = val.MaxValue
                              return false
                            }
                            data.DefaultValue = v
                            data.checked = true
                            let index = this.targetList.map(item => { return item.IndexManagementID }).indexOf(val.IndexManagementID)
                            if (index > -1) {
                              this.targetList.splice(index, 1)
                            }
                            this.targetList.push({
                              IndexManagementID: val.IndexManagementID,
                              Value: v
                            })
                            // this.upDefaultValue(data)
                          }
                        }
                      })
                    ])
                  ])
                } : (h, { root, node, data }) => {
                  return h('span', val.IndexManagementName)
                }
              }
            })
          }
        }
      },
      // 获取设置常用指标时展示的列表
      async fetchCommUsedModelList () {
        this.treeSettingList[0].children = []
        this.xy.loading()
        let res = await this.xy.get(`${this.xy.getCookie('eva')}/api/EvaluateStudent/GetSettingStudentCommonIndex`, {
          schoolDistrictID: this.params.SchoolDistrictID,
          academicSessionID: this.params.AcademicSessionID,
          academicYearID: this.params.AcademicYearID,
          studentGradeForStudentYearID: this.params.StudentGradeForStudentYearID,
          disciplineID: this.params.DisciplineID,
          name: this.searchTextModel
        })
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            this.treeSettingList[0].children = res.data.map(val => {
              return {
                title: val.IndexManagementName,
                expand: true,
                IndexManagementID: val.IndexManagementID,
                Level: val.Level,
                ParentID: val.ParentID,
                children: val.Childrens.length ? val.Childrens.map(vv => {
                  return {
                    title: vv.IndexManagementName,
                    expand: true,
                    IndexManagementID: vv.IndexManagementID,
                    Level: vv.Level,
                    ParentID: vv.ParentID,
                    children: vv.Childrens.length ? vv.Childrens.map(item => {
                      return {
                        title: item.IndexManagementName,
                        expand: true,
                        IndexManagementID: item.IndexManagementID,
                        Level: item.Level,
                        ParentID: item.ParentID,
                        children: []
                      }
                    }) : []
                  }
                }) : []
              }
            })
          }
        }
      },
      // 获取全部指标列表
      async fetchAllList () {
        this.treeList[0].children = []
        this.xy.loading()
        let res = await this.xy.get(`${this.xy.getCookie('eva')}/api/EvaluateStudent/GetAllIndex`, {
          schoolDistrictID: this.params.SchoolDistrictID,
          academicSessionID: this.params.AcademicSessionID,
          academicYearID: this.params.AcademicYearID,
          studentGradeForStudentYearID: this.params.StudentGradeForStudentYearID,
          disciplineID: this.params.DisciplineID
        })
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            for (let i = 0, len = res.data.length; i < len; i++) {
              this.treeList[0].children.push({
                title: res.data[i].IndexManagementName,
                expand: true,
                IndexManagementID: res.data[i].IndexManagementID,
                Level: res.data[i].Level,
                ParentID: res.data[i].ParentID,
                DefaultValue: res.data[i].DefaultValue,
                render: res.data[i].Childrens.length === 0 ? (h, { root, node, data }) => {
                  return h('span', {
                    style: {
                      display: 'inline-block',
                      width: '100%'
                    }
                  }, [
                    h('span', res.data[i].IndexManagementName),
                    h('span', [
                      h('Rate', {
                        style: {
                          display: res.data[i].SocringMethod === 1 ? 'inline-block' : 'none',
                          marginRight: '8px',
                          marginLeft: '8px'
                        },
                        props: {
                          value: res.data[i].DefaultValue,
                          count: res.data[i].MaxValue,
                          customIcon: 'iconfont icon-Starunselectedbeifen',
                          clearable: res.data[i].MinValue === 0
                        },
                        on: {
                          'on-change': (v) => {
                            if (v < res.data[i].MinValue) {
                              this.xy.msgError('不能小于' + res.data[i].MinValue + '。')
                              res.data[i].DefaultValue = res.data[i].MinValue
                              return false
                            }
                            if (v > res.data[i].MaxValue) {
                              this.xy.msgError('不能大于' + res.data[i].MaxValue + '。')
                              res.data[i].DefaultValue = res.data[i].MaxValue
                              return false
                            }
                            data.DefaultValue = v
                            data.checked = true
                            let index = this.targetList.map(item => { return item.IndexManagementID }).indexOf(res.data[i].IndexManagementID)
                            if (index > -1) {
                              this.targetList.splice(index, 1)
                            }
                            this.targetList.push({
                              IndexManagementID: res.data[i].IndexManagementID,
                              Value: v
                            })
                          }
                        }
                      }),
                      h('InputNumber', {
                        style: {
                          display: res.data[i].SocringMethod === 0 ? 'inline-block' : 'none',
                          marginRight: '8px',
                          marginLeft: '8px'
                        },
                        props: {
                          value: res.data[i].DefaultValue,
                          min: res.data[i].MinValue,
                          max: res.data[i].MaxValue
                        },
                        on: {
                          'on-change': (v) => {
                            if (v < res.data[i].MinValue) {
                              v = res.data[i].MinValue
                              this.xy.msgError('不能小于' + res.data[i].MinValue + '。')
                              res.data[i].DefaultValue = res.data[i].MinValue
                              return false
                            }
                            if (v > res.data[i].MaxValue) {
                              v = res.data[i].MaxValue
                              this.xy.msgError('不能大于' + res.data[i].MaxValue + '。')
                              res.data[i].DefaultValue = res.data[i].MaxValue
                              return false
                            }
                            data.DefaultValue = v
                            data.checked = true
                            let index = this.targetList.map(item => { return item.IndexManagementID }).indexOf(res.data[i].IndexManagementID)
                            if (index > -1) {
                              this.targetList.splice(index, 1)
                            }
                            this.targetList.push({
                              IndexManagementID: res.data[i].IndexManagementID,
                              Value: v
                            })
                            // this.upDefaultValue(data)
                          }
                        }
                      })
                    ])
                  ])
                } : (h, { root, node, data }) => {
                  return h('span', res.data[i].IndexManagementName)
                },
                children: []
              })
              if (res.data[i].Childrens.length > 0) {
                for (let m = 0; m < res.data[i].Childrens.length; m++) {
                  this.treeList[0].children[i].children.push({
                    title: res.data[i].Childrens[m].IndexManagementName,
                    expand: true,
                    IndexManagementID: res.data[i].Childrens[m].IndexManagementID,
                    Level: res.data[i].Childrens[m].Level,
                    ParentID: res.data[i].Childrens[m].ParentID,
                    checked: res.data[i].Childrens[m].Checked,
                    DefaultValue: res.data[i].Childrens[m].DefaultValue,
                    render: (h, { root, node, data }) => {
                      return h('span', {
                        style: {
                          display: 'inline-block',
                          width: '100%'
                        }
                      }, [
                        h('span', res.data[i].Childrens[m].IndexManagementName),
                        h('span', [
                          h('Rate', {
                            style: {
                              display: res.data[i].Childrens[m].SocringMethod === 1 ? 'inline-block' : 'none',
                              marginRight: '8px',
                              marginLeft: '8px'
                            },
                            props: {
                              value: res.data[i].Childrens[m].DefaultValue,
                              count: res.data[i].Childrens[m].MaxValue,
                              customIcon: 'iconfont icon-Starunselectedbeifen',
                              clearable: res.data[i].Childrens[m].MinValue === 0
                            },
                            on: {
                              'on-change': (v) => {
                                if (v < res.data[i].Childrens[m].MinValue) {
                                  this.xy.msgError('不能小于' + res.data[i].Childrens[m].MinValue + '。')
                                  res.data[i].Childrens[m].DefaultValue = res.data[i].Childrens[m].MinValue
                                  return false
                                }
                                if (v > res.data[i].Childrens[m].MaxValue) {
                                  this.xy.msgError('不能大于' + res.data[i].Childrens[m].MaxValue + '。')
                                  res.data[i].Childrens[m].DefaultValue = res.data[i].Childrens[m].MaxValue
                                  return false
                                }
                                data.DefaultValue = v
                                data.checked = true
                                let index = this.targetList.map(item => { return item.IndexManagementID }).indexOf(res.data[i].Childrens[m].IndexManagementID)
                                if (index > -1) {
                                  this.targetList.splice(index, 1)
                                }
                                this.targetList.push({
                                  IndexManagementID: res.data[i].Childrens[m].IndexManagementID,
                                  Value: v
                                })
                              }
                            }
                          }),
                          h('InputNumber', {
                            style: {
                              display: res.data[i].Childrens[m].SocringMethod === 0 ? 'inline-block' : 'none',
                              marginRight: '8px',
                              marginLeft: '8px'
                            },
                            props: {
                              value: res.data[i].Childrens[m].DefaultValue,
                              min: res.data[i].Childrens[m].MinValue,
                              max: res.data[i].Childrens[m].MaxValue
                            },
                            on: {
                              'on-change': (v) => {
                                if (v < res.data[i].Childrens[m].MinValue) {
                                  this.xy.msgError('不能小于' + res.data[i].Childrens[m].MinValue + '。')
                                  res.data[i].Childrens[m].DefaultValue = res.data[i].Childrens[m].MinValue
                                  return false
                                }
                                if (v > res.data[i].Childrens[m].MaxValue) {
                                  this.xy.msgError('不能大于' + res.data[i].Childrens[m].MaxValue + '。')
                                  res.data[i].Childrens[m].DefaultValue = res.data[i].Childrens[m].MaxValue
                                  return false
                                }
                                data.DefaultValue = v
                                data.checked = true
                                let index = this.targetList.map(item => { return item.IndexManagementID }).indexOf(res.data[i].Childrens[m].IndexManagementID)
                                if (index > -1) {
                                  this.targetList.splice(index, 1)
                                }
                                this.targetList.push({
                                  IndexManagementID: res.data[i].Childrens[m].IndexManagementID,
                                  Value: v
                                })
                              }
                            }
                          })
                        ])
                      ])
                    }
                  })
                }
              }
            }
          }
        }
      },
      // 刷新先选节点后打分
      upGroupInput (val) {
        if (!this.pickedArrGroup.length) { return }
        for (let i in this.pickedArrGroup) {
          if (this.pickedArrGroup[i].ProgrammeRecordGroupID === val.ProgrammeRecordGroupID) {
            this.pickedArrGroup[i].AddFraction = val.AddFraction
          }
        }
      },
      // 刷新先选节点后打分
      upDefaultValue (val) {
        if (!this.targetList.length) { return }
        for (let i in this.targetList) {
          if (this.targetList[i].IndexManagementID === val.IndexManagementID) {
            this.targetList[i].Value = val.DefaultValue
          }
        }
      },
      // 保存所有
      async save () {
        if (this.indexTitle === '小组') {
          if (!this.pickedArrGroup.length) { return this.xy.msgError('请选择需要保存的小组。') }
          let params = {
            SchoolDistrictID: this.params.SchoolDistrictID,
            AcademicSessionID: this.params.AcademicSessionID,
            ClassTableGenerateBaseID: this.params.ClassTableGenerateBaseID,
            CoursePlanAID: this.params.CoursePlanAID,
            CoursePlanAIDType: this.params.CoursePlanAIDType,
            DisciplineID: this.params.DisciplineID,
            AcademicYearID: this.params.AcademicYearID,
            StudentGradeForStudentYearID: this.params.StudentGradeForStudentYearID,
            GroupFraction: this.pickedArrGroup.length ? this.pickedArrGroup.map(val => {
              return {
                ProgrammeRecordGroupID: val.ProgrammeRecordGroupID,
                GroupID: val.GroupID,
                GroupValue: val.GroupValue,
                GroupRank: val.GroupRank,
                GroupRankingValue: val.GroupRankingValue,
                AddFraction: val.AddFraction
              }
            }) : []
          }
          this.xy.loading()
          let res = await this.xy.post(`${this.xy.getCookie('eva')}/api/ClassRoomGroupRecord/CreateClassRoomRecordGroup`, params, true)
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc(res.msg || '保存成功。')
            this.pickedArrGroup = []
            this.fetchLeftGroupStudentList()
          } else {
            this.xy.msgError(res.msg || '保存失败。')
          }
        } else {
          if (!this.pickedArr.length) { return this.xy.msgError('请选择需要保存的学生。') }
          if (!this.targetList.length) { return this.xy.msgError('请给选择学生的指标打分。') }
          let params = {
            ClassTableGenerateBaseID: this.params.ClassTableGenerateBaseID,
            DisciplineID: this.params.DisciplineID,
            CoursePlanAID: this.params.CoursePlanAID,
            CoursePlanAIDType: this.params.CoursePlanAIDType,
            UserID: this.pickedArr.map(val => val.UserID),
            Scores: this.targetList
          }
          this.xy.loading()
          let res = await this.xy.post(`${this.xy.getCookie('eva')}/api/EvaluateStudent/UpdataStudentScore`, params, true)
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc(res.msg || '保存成功。')
            this.treeList = [
              {
                title: '全选',
                expand: true,
                children: []
              }
            ]
            this.fetchRightStudentList()
            this.pickedArr = []
            this.targetList = []
            if (this.activeName === 1) {
              this.fetchCommUsedList()
            } else {
              this.fetchAllList()
            }
          } else {
            this.xy.msgError(res.msg || '保存失败。')
          }
        }
      },
      // 设置指标
      openSetting () {
        this.settingList = []
        this.settinModel = true
        this.searchTextModel = ''
        this.fetchCommUsedModelList()
      },
      // 保存常用指标列表
      async saveSetting () {
        let arr = this.$refs.setModalRree.getCheckedAndIndeterminateNodes()
        if (!arr.length) { return this.xy.msgError('请选择指标。') }
        let params = {
          IndexManagementIDs: []
        }
        for (let i in arr) {
          if (arr[i].Level > 0) {
            params.IndexManagementIDs.push(arr[i].IndexManagementID)
          }
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.xy.getCookie('eva')}/api/EvaluateStudent/UpdateStudentCommonIndex`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc(res.msg || '保存成功。')
          this.settinModel = false
          this.fetchCommUsedList()
          this.settingList = []
        } else {
          this.xy.msgError(res.msg || '保存失败。')
        }
      },
      // 关键字搜索
      FromSubmit () {
        this.fetchCommUsedModelList()
      },
      // 批量选择小组学生
      changeSelectGroup (val) {
        this.pickedArrGroup = val
        if (this.pickedArrGroup.length) {
          this.pickedArrGroup.map(item => {
            this.dataTableGroup.map(item1 => {
              if (item.GroupID === item1.GroupID) {
                item1._checked = true
              }
              return item1
            })
            return item
          })
        } else {
          this.dataTableGroup.map(item => {
            item._checked = false
            return item
          })
        }
      },
      // 批量选择
      changeSelect (val) {
        this.pickedArr = val
      },
      //
      back () {
        this.$router.push({
          name: 'evaStudentClient',
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>
<style lang="less" scoped>
/deep/ .ivu-rate-star-second{
  display: flex;
}
.box {
  margin-bottom: 80px;
  .tab-active{
    span{
      display: inline-block;
      width: 90px;
      text-align: center;
      cursor: pointer;
    }
    .active{
      color: #fff;
      background: #4196ff;
      border-radius: 4px 4px 0px 0px;
    }
  }
  background: #fff;
  /deep/ .ivu-tabs-bar {
    border-bottom: 1px solid #4196ff;
  }
  /deep/ .ivu-tabs-tab {
    text-align: center;
    width: 90px;
  }
  /deep/ .ivu-tabs-nav .ivu-tabs-tab-active {
    color: #fff;
    background: #4196ff;
    border-radius: 4px 4px 0px 0px;
  }
  .to-recording {
    cursor: pointer;
    position: absolute;
    height: 35.97px;
    line-height: 35.97px;
    right: 8px;
    top: 0px;
    font-size: 14px;
    color: #4196ff;
  }
  /deep/ .xy-table .ivu-table th {
    height: 59px;
    border-top: 1px solid #dcdee2;
  }
  .box-student {
    .left {
      width: 50%;
    }
    .right {
      width: 50%;
      border-left: 1px solid #dcdee2;
      border-top: 1px solid #dcdee2;
      .icon-st {
        cursor: pointer;
      }
      /deep/ .ivu-menu {
        padding-left: 10px;
      }
      .tree {
        height: 600px;
        overflow: scroll;
        padding: 20px;
        /deep/ .ivu-tree ul li {
          line-height: 31px;
        }
      }
      // /deep/ .ivu-tree-arrow-open {
      //   margin-left: 18px;
      // }
    }
  }
}
/deep/ .ivu-modal-body {
  .title {
    padding: 16px 0 0 10px;
  }
  .ivu-tree {
    margin-left: 8px;
    max-height: 500px;
    overflow-y: auto;
  }
}

.save {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  line-height: 80px;
  text-align: right;
  background: #fff;
  padding-right: 50px;
  border-top: 1px solid #f9f9f9;
}
</style>
