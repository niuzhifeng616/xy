
<!-- 选课权限 -->
<template>
  <div id="crouseRules">
    <div class="left">
      <radio-group v-model="subjectSelected"
                   vertical
                   @on-change="radioChange"
                   v-if='subjectData.length>0'>
        <radio :label="JSON.stringify(subject)"
               v-for="(subject,index) in subjectData"
               :key='index'>
          <span class="f14">{{subject.Name}}</span>
        </radio>
      </radio-group>
      <p v-if='subjectData.length===0'>暂无课程。</p>
    </div>
    <div class="right-data fl">
      <div class="clearfix"
           style="margin:10px 0;">
        <div class="fl">
          <Button class="xy-info"
                  @click="ImportClick"
                  :disabled="layeredStepsHeader.isOperation != 0">导入权限</Button>
          <Button v-if="isShowBtn"
                  class="xy-primary"
                  @click="openAddModal"
                  :disabled="layeredStepsHeader.isOperation != 0">添加学生</Button>
          <Button v-if="isShowBtn"
                  class="xy-danger"
                  @click="delBatch"
                  :disabled="layeredStepsHeader.isOperation == 0?datatable.length>0?false:true:true">批量删除</Button>
          <Button v-if="isShowBtn"
                  class="xy-danger"
                  @click="delAll"
                  :disabled="layeredStepsHeader.isOperation == 0?datatable.length>0?false:true:true">全部删除</Button>
        </div>
        <div class="fr pr"
             v-if="isShowBtn">
          <i-input search
                   v-model.trim="searchText"
                   @on-search="FromSubmit"
                   placeholder="用户名/姓名"
                   class="fr xy-content-title-search"
                   style="width: auto;">
            <icon type="ios-search cursor-p"
                  slot="suffix" />
          </i-input>
        </div>
      </div>
      <!-- 表格 -->
       <XyAntTable
        :rowSelection="tableRowSelection"
        :columns="columnss"
        :dataSource="datatable"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange">
        <div slot="UserName"
              slot-scope="text, record">
          <div style="min-width:120px">
            {{record.UserName}}
          </div>
        </div>
        <div slot="FullName"
              slot-scope="text, record">
          <div style="min-width:120px">
            {{record.FullName}}
          </div>
        </div>
        <span slot="oprateRender"
              slot-scope="text, record">
          <a :disabled="layeredStepsHeader.isOperation!==0"
              @click="delOne(record)">删除</a>
        </span>
      </XyAntTable>
    </div>
    <!-- 添加学生 -->
    <modal :styles="{top:'20px',width:clientWidth+'px'}"
           title=添加学生
           v-if="layeredStepsHeader.isOperation == 0"
           :transfer="false"
           v-model="addPublic"
           :mask-closable="false">
      <row class="cascader-content">
        <i-col span="6"
               class="cascader-content-left">
          <tree :data="newList"
                @on-select-change="treeSelect"></tree>
        </i-col>
        <i-col span="11"
               class="cascader-content-center">
          <div class="cascader-content-center-title clearfix">
            <checkbox v-model="casaderIsAll"
                      class="fl casader-is-all"
                      @on-change="checkAllBtn"
                      v-if="searchName==''">全选</checkbox>
            <i-input search
                     enter-button
                     placeholder="请输入姓名/用户名"
                     v-model.trim="searchName"
                     class="fr casader-search"
                     @on-search="searchNameFun" />
          </div>
          <alert v-if="fAlert"
                 show-icon
                 style="margin:20px 0px;">
            温馨提示
            <icon type="ios-bulb-outline"
                  slot="icon"></icon>
            <template slot="desc">
              点击左侧栏中的学生组织，从中间栏勾选学生，右侧栏显示已选中的学生
            </template>
          </alert>
          <alert v-if="transferData.length<1 && !fAlert"
                 type="warning"
                 show-icon
                 style="margin:20px 0px">
            未查询到相关数据
            <template slot="desc">
              当前分组下暂无学生，请切换分组后重新查找。
            </template>
          </alert>
          <template v-if="transferData.length > 0">
            <div v-for="item in transferData"
                 :key='item.value'>
              <div class="cascader-content-center-list"
                   v-if="searchName==''||item.childNameStr.indexOf(searchName)>=0 ">
                <div class="cascader-content-center-list-border">
                  <checkbox v-model="item.checkAll"
                            v-if="searchName==''"
                            size="large"
                            :key="item.value"
                            @on-change="handleCheckAll(item)">{{item.orgFullName}}</checkbox>
                  <span v-else>{{item.orgFullName}}</span>
                </div>
                <template v-for="child in item.list">
                  <checkbox size="large"
                            v-if="searchName=='' || child.FullName.indexOf(searchName)>=0  || child.UserName.indexOf(searchName)>=0"
                            :key="child.StudentID"
                            v-model="child.singleCheck"
                            @on-change="checkAllChange(child)"
                            :title="child.UserName"
                            class="check-name">{{child.FullName}}</checkbox>
                </template>

              </div>
            </div>
          </template>
        </i-col>
        <i-col span="7"
              class="cascader-content-right">
          <div>已选<b>{{checkAllList.length}}</b>人</div>
          <div class="cascader-content-right-list">
            <tag
              v-for="(item,index) in checkAllList"
              :name="item.FullName"
              closable
              @on-close="handleClose(item)"
              :title="item.UserName"
              :key='index'>{{item.FullName}}</tag>
          </div>
        </i-col>
      </row>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="modalCancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="modalAdd">保存</Button>
      </div>
      <spin v-if="isLoadingShow"
            fix>
        <icon type="ios-loading"
              size=18
              class="spin-icon-load"></icon>
        <div>加载中...</div>
      </spin>
    </modal>
    <XyUpfile ref="upfile"
              @successLoad='modalSubmit'
              :modalTitle="uptitle"
              :describeData="tipData"
              :fileFormt="formtData"
              :fileSize="size"
              :importPath="upUrl"
              :paramsData="upParams"
              :templateUrl="templateUrl"
              :errorUrl="errorUrl">
    </XyUpfile>
    <!-- <SelectStudent :isShow="addPublic" :teachers="[...selectedStudents]" @select-cancel="modalCancel" @select-confirm="modalAdd">
    </SelectStudent> -->
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import XyUpfile from '@/components/upFile/XyUpfile.vue'
  // import SelectStudent from '@/components/selectStudent/SelectStudent.vue'
  export default {
    components: {
      XyAntTable,
      XyUpfile
    // SelectStudent
    },
    data () {
      return {
        // antTable
        selectedRowKeys: [],
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
        isNoData: true,
        columnss: [
          {
            title: '用户名',
            scopedSlots: { customRender: 'UserName' }
          },
          {
            title: '姓名',
            scopedSlots: { customRender: 'FullName' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            width: 80,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        allSelect: [],
        subjectData: [],
        subjectRadio: {},
        subjectSelected: '',
        datatable: [],
        selectionAll: [],
        pageList: '', // 当前页数据条数
        pages: [10, 20, 50, 100], // 默认每页可选10/20/50/100条
        searchText: '',
        isShowBtn: false, // 是否展示操作按钮
        isHaveData: false,

        //= ==多选控件 start===
        clientWidth: 1600,
        addPublic: false, // modal默认false
        isLoadingShow: false, // modal加载动画
        casaderIsAll: false, // 全选
        searchName: '', // 搜索
        newList: [], // 左侧数据
        transferData: [], // 中间数据
        checkAllList: [], // 右侧数据
        checkAllList2: [],
        checkAllGroup: [], // 多选子集合
        fAlert: true, // 首次
        isShowSelecAll: true, // 全选是否显示
        //= ==多选控件 end===
        layeredStepsHeader: {},
        // 导入文件
        uptitle: '导入权限',
        upfileStatus: false,
        tipData: [],
        formtData: ['xls', 'xlsx'],
        size: 1024000,
        upUrl: '',
        upParams: {},
        templateUrl: '',
        errorUrl: ''
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
      this.layeredStepsHeader = this.$parent.$parent
      let that = this
      this.columns = [
        {
          type: 'selection', // 与标签<i-table>中属性ref值对应
          width: 60,
          align: 'center',
          key: 'CoursePlanPermissionID'
        },
        {
          title: '用户名',
          key: 'UserName'
        },
        {
          title: '姓名',
          key: 'FullName'
        },
        {
          title: '操作',
          key: '04',
          width: 80,
          render: (h, params) => {
            return h('div', { 'class': { oprateList: true } }, [h('a', {
              'class': {
                disabled: this.layeredStepsHeader.isOperation !== 0,
                oprateBtn1: true
              },
              on: {
                click: () => {
                  if (that.layeredStepsHeader.isOperation === 0) {
                    that.delOne(params.row)
                  }
                }
              }
            }, '删除')
            ])
          }
        }
      ]
      // 多选控件宽度
      this.windowResize()
      window.onresize = this.windowResize
    },
    destroyed () {
      window.onresize = null
    },
    watch: {
      subjectRadio: function () {
        if (this.subjectRadio !== '') {
          this.isShowBtn = true
        } else {
          this.isShowBtn = false
        }
      }
    },
    mounted () {
      this.getSubjects()
    },
    methods: {
      // 学科列表数据
      async  getSubjects () {
        let that = this
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/GetSexList`, {
          layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID
        })
        if (res.success) {
          that.subjectData = res.data
        } else {
          that.xy.msgError(res.msg)
        }
        this.xy.unloading()
      },
      // 查看学科下的学生
      radioChange: function () {
        this.isNoData = false
        this.searchText = ''
        this.subjectRadio = JSON.parse(this.subjectSelected)
        this.loadTable(this.subjectRadio.ID, this.subjectRadio.Type)
      },
      // 学生列表数据
      async loadTable (aid, type) {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/GetCourseplanPermissionList`, {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
          AID: aid,
          type: type,
          searchText: this.searchText
        })
        if (res.success) {
          this.datatable = res.data.data
          this.pagination.total = res.data.totalRecords
          if (res.data.data.length === 0) {
            this.pageList = 0
          } else {
            this.pageList = res.data.data.length
          }
          this.tableCallBack()
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.loadTable(this.subjectRadio.ID, this.subjectRadio.Type)
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      tableCallBack: function () {
        if (this.datatable.length > 0) {
          this.isHaveData = true
        } else {
          this.isHaveData = false
        }
      },
      // 搜索
      FromSubmit: function () {
        this.pagination.current = 1
        this.searchText = this.searchText
        this.loadTable(this.subjectRadio.ID, this.subjectRadio.Type)
      },

      // 删除
      delOne (row) {
        let that = this
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除“' + row.FullName + '”吗？',
          async onOk () {
            this.xy.loading()
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/CourseplanPermissionDelete`, {
              id: row.CoursePlanPermissionID,
              LayeredSelectProgrammeID: that.layeredStepsHeader.LayeredSelectProgrammeID
            })
            that.xy.unloading()
            if (res.success) {
              if (that.pageList > 1) {
                that.pageList = that.pageList - 1
              } else {
                if (that.pagination.current > 1) {
                  that.pagination.current = that.pagination.current - 1
                };
              };
              that.xy.unloading()
              that.xy.msgSuc('删除成功。')
              that.loadTable(that.subjectRadio.ID, that.subjectRadio.Type)
            }
          }
        })
      },
      // 批量删除
      delBatch: function () {
        if (this.isHaveData && this.layeredStepsHeader.isOperation === 0) {
          let that = this
          if (this.selectionAll.length === 0) {
            this.xy.msgError('请选择删除项。')
          } else {
            let ids = ''
            for (let i = 0; i < this.selectionAll.length; i++) {
              ids += this.selectionAll[i].CoursePlanPermissionID + ','
            }
            this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要删除选中的学生吗？',
              async onOk () {
                that.xy.loading()
                let res = await that.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/CourseplanPermissionDeleteByIds`, {
                  ids: ids,
                  LayeredSelectProgrammeID: that.layeredStepsHeader.LayeredSelectProgrammeID
                })
                that.xy.unloading()
                if (res.success) {
                  if (that.selectionAll.length === that.pageList && that.pagination.current > 1) {
                    that.pagination.current = that.pagination.current - 1
                  }
                  that.xy.msgSuc('删除成功。')
                  that.loadTable(that.subjectRadio.ID, that.subjectRadio.Type)
                  that.selectionAll = []
                }
              }
            })
          }
        }
      },
      // 全部删除
      delAll: function () {
        if (this.isHaveData && this.layeredStepsHeader.isOperation === 0) {
          let that = this
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除全部的学生吗？',
            async onOk () {
              that.xy.loading()
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/CourseplanPermissionDeleteAll?layeredSelectProgrammeID=` +
                that.layeredStepsHeader.LayeredSelectProgrammeID +
                '&AID=' + that.subjectRadio.ID +
                '&Type=' + that.subjectRadio.Type)
              that.xy.unloading()
              if (res.success) {
                that.xy.msgSuc('删除成功。')
                that.loadTable(that.subjectRadio.ID, that.subjectRadio.Type)
              }
            }
          })
        }
      },

      //= ======导入权限 start===
      ImportClick: function () {
        if (this.layeredStepsHeader.isOperation === 0) {
          this.$refs['upfile'].modalImport = true
          this.upUrl = `${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/Import?LayeredSelectProgrammeID=${this.layeredStepsHeader.LayeredSelectProgrammeID}`
          this.templateUrl = `${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/DownloadTemplateImport`
          this.errorUrl = `${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/DownloadExceptionImport`
        }
      },
      modalSubmit: function () {
        this.getSubjects()
      },
      //= ======导入权限 end===

      //= =====多选弹出框 Start ======
      windowResize: function () {
        if ($(window).width() < 1366) {
          this.clientWidth = 1200
        } else if ($(window).width() < 1440) {
          this.clientWidth = 1300
        } else if ($(window).width() < 1688) {
          this.clientWidth = 1400
        } else {
          this.clientWidth = 1600
        };
      },
      async  openAddModal () {
        if (this.layeredStepsHeader.isOperation === 0) {
          this.addPublic = true
          this.isLoadingShow = true
          this.newList = []// 左侧滞空
          this.transferData = []// 中间滞空
          this.checkAllList = []// 右侧滞空
          let that = this
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/GetOrgAll`, { layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID })
          if (res.success) {
            let dataList = res.data
            if (dataList.length > 0) {
              for (let i = 0; i < dataList.length; i++) {
                that.newList.push({
                  value: dataList[i].SchoolDistrictID,
                  title: dataList[i].SchoolDistrictName,
                  level: 1,
                  children: []
                })
                if (dataList[i].YearList.length > 0) {
                  for (let j = 0; j < dataList[i].YearList.length; j++) {
                    that.newList[i].children.push({
                      value: dataList[i].YearList[j].StudentYearID,
                      title: dataList[i].YearList[j].StudentYearName,
                      schoolID: dataList[i].SchoolDistrictID,
                      level: 2,
                      children: []
                    })
                    if (dataList[i].YearList[j].GradeList.length > 0) {
                      for (let k = 0; k < dataList[i].YearList[j].GradeList.length; k++) {
                        that.newList[i].children[j].children.push({
                          value: dataList[i].YearList[j].GradeList[k].StudentGradeID,
                          title: dataList[i].YearList[j].GradeList[k].StudentGradeName,
                          level: 3,
                          children: []
                        })
                        if (dataList[i].YearList[j].GradeList[k].OrgList.length > 0) {
                          for (let m = 0; m < dataList[i].YearList[j].GradeList[k].OrgList.length; m++) {
                            that.newList[i].children[j].children[k].children.push({
                              value: dataList[i].YearList[j].GradeList[k].OrgList[m].StudentOrganizationID,
                              title: dataList[i].YearList[j].GradeList[k].OrgList[m].StudentOrganizationName,
                              schoolID: dataList[i].SchoolDistrictID,
                              studentYearID: dataList[i].YearList[j].StudentYearID,
                              studentGradeID: dataList[i].YearList[j].GradeList[k].StudentGradeID,
                              orgFullName: dataList[i].YearList[j].StudentYearName +
                                dataList[i].YearList[j].GradeList[k].StudentGradeName +
                                dataList[i].YearList[j].GradeList[k].OrgList[m].StudentOrganizationName,
                              level: 4
                            })
                          }
                        }
                      }
                    }
                  }
                }
              };

              that.treeShow = false
            };
          } else {
            that.xy.msgError(res.msg)
          }
          that.isLoadingShow = false
        }
      },
      async   treeSelect (data) {
        if (data.length > 0) {
          this.fAlert = false// 首次
          this.isLoadingShow = true
          let that = this
          if (data[0].level === 4) {
            let res = await this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/GetCourseplanPermissionCollectionStudent`, {
              schoolID: data[0].schoolID,
              studentYearID: data[0].studentYearID,
              studentGradeID: data[0].studentGradeID,
              studentOrganizationID: data[0].value,
              layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
              layeredSelectRotationID: this.layeredStepsHeader.LayeredSelectRotationID,
              AID: that.subjectRadio.ID,
              type: that.subjectRadio.Type
            })
            that.transferData = []
            if (res.success) {
              that.isLoadingShow = false
              if (res.data.length > 0) {
                for (let i = 0; i < res.data.length; i++) {
                  res.data[i].checkAll = false// 每一组的全选按钮
                  res.data[i].checkAllGroup = []// 每一组人集合
                  res.data[i].orgFullName = data[0].orgFullName
                  if (res.data[i].list.length > 0) {
                    for (let j = 0; j < res.data[i].list.length; j++) {
                      res.data[i].list[j].singleCheck = false
                      res.data[i].childNameStr += res.data[i].list[j].FullName + ',' + res.data[i].list[j].UserName + ','
                    };
                    that.transferData.push(res.data[i])
                    that.isLoadingShow = false
                  };
                };
                // 根据右侧已选人改变渲染的初始数据
                if (that.checkAllList.length > 0) {
                  for (let d = 0; d < that.transferData.length; d++) {
                    for (let z = 0; z < that.transferData[d].list.length; z++) {
                      let f = that.checkAllList.map(function (val) {
                        return val.StudentID
                      }).indexOf(that.transferData[d].list[z].StudentID)
                      if (f !== -1) {
                        that.transferData[d].list[z].singleCheck = true
                      };
                    };
                    // 所有的全选按钮
                    let all1 = that.transferData[d].list.map(function (val) {
                      return val.singleCheck
                    }).indexOf(true)
                    if (all1 === -1) { // 全没有ture
                      that.transferData[d].checkAll = false
                      that.casaderIsAll = false
                    } else {
                      // 最少有一个true
                      let all2 = that.transferData[d].list.map(function (val) {
                        return val.singleCheck
                      }).indexOf(false)
                      if (all2 === -1) {
                        that.transferData[d].checkAll = true
                        that.casaderIsAll = true
                      } else {
                        that.transferData[d].checkAll = false
                        that.casaderIsAll = false
                      };
                    };
                  };
                };
              };
            };
          } else {
            that.isLoadingShow = false
            that.transferData = []
          }
        };
      },
      checkAllBtn: function () { // 全选
        if (this.casaderIsAll) {
          for (let i = 0; i < this.transferData.length; i++) {
            this.transferData[i].checkAll = true
            for (let j = 0; j < this.transferData[i].list.length; j++) {
              this.transferData[i].list[j].singleCheck = true
              // 把选中的添加至右侧
              this.checkAllList.push(this.transferData[i].list[j])
            };
          };
          // 去重
          let obj = {}
          this.checkAllList = this.checkAllList.reduce(function (item, next) {
            // eslint-disable-next-line no-unused-expressions
            obj[next.StudentID] ? '' : obj[next.StudentID] = true && item.push(next)
            return item
          }, [])
        } else {
          for (let k = 0; k < this.transferData.length; k++) {
            this.transferData[k].checkAll = false
            for (let s = 0; s < this.transferData[k].list.length; s++) {
              this.transferData[k].list[s].singleCheck = false
              for (let m = 0; m < this.checkAllList.length; m++) {
                if (this.checkAllList[m].StudentID === this.transferData[k].list[s].StudentID) {
                  this.checkAllList.splice(m, 1)
                };
              };
            };
          };
        };
      },
      handleCheckAll: function (item) { // 各个组内的全选按钮
        if (item.checkAll) {
          item.list.map(function (val) {
            // eslint-disable-next-line no-return-assign
            return val.singleCheck = true
          })
          for (let p = 0; p < this.transferData.length; p++) {
            for (let m = 0; m < this.transferData[p].list.length; m++) {
              for (let q = 0; q < item.list.length; q++) {
                if (this.transferData[p].list[m].StudentID === item.list[q].StudentID) {
                  this.transferData[p].list[m].singleCheck = true
                };
              };
              // 把选中的添加至右侧
              if (this.transferData[p].list[m].singleCheck) {
                this.checkAllList.push(this.transferData[p].list[m])
              };
            };
            // 所有的全选按钮
            let isCheckAll = this.transferData[p].list.map(function (val) {
              return val.singleCheck
            }).indexOf(false)
            if (isCheckAll === -1) {
              this.transferData[p].checkAll = true
              this.casaderIsAll = true// 全选
            } else {
              this.transferData[p].checkAll = false
              this.casaderIsAll = false// 全选
            };
          };
          // 去重
          let obj = {}
          this.checkAllList = this.checkAllList.reduce(function (item, next) {
            // eslint-disable-next-line no-unused-expressions
            obj[next.StudentID] ? '' : (obj[next.StudentID] = true && item.push(next))
            return item
          }, [])
        } else {
          for (let p = 0; p < this.transferData.length; p++) {
            for (let q = 0; q < this.transferData[p].list.length; q++) {
              let index2 = item.list.map(function (val) {
                return val.StudentID
              }).indexOf(this.transferData[p].list[q].StudentID)
              if (index2 !== -1) {
                this.transferData[p].list[q].singleCheck = false
              };
            };
            // 删除右侧
            for (let k = 0; k < item.list.length; k++) {
              let index3 = this.checkAllList.map(function (val) {
                return val.StudentID
              }).indexOf(item.list[k].StudentID)
              if (index3 !== -1) {
                this.checkAllList.splice(index3, 1)
              };
            };
            // 所有的全选按钮
            let isCheckAll2 = this.transferData[p].list.map(function (val) {
              return val.singleCheck
            }).indexOf(true)
            if (isCheckAll2 === -1) { // 全没有ture
              this.transferData[p].checkAll = false
              this.casaderIsAll = false// 全选
            } else {
              // 最少有一个true
              let isCheckAll3 = this.transferData[p].list.map(function (val) {
                return val.singleCheck
              }).indexOf(false)
              if (isCheckAll3 === -1) {
                this.transferData[p].checkAll = true
                this.casaderIsAll = true// 全选
              } else {
                this.transferData[p].checkAll = false
                this.casaderIsAll = false// 全选
              };
            };
          };
        };
      },
      checkAllChange: function (child) { // 每个人的按钮
        if (child.singleCheck) {
          this.checkAllList.push(child)
          for (let i = 0; i < this.transferData.length; i++) {
            let mapIndex = this.transferData[i].list.map(function (val) {
              return val.StudentID
            }).indexOf(child.StudentID)
            if (mapIndex !== -1) {
              this.transferData[i].list[mapIndex].singleCheck = true
            };
            // 组内全选按钮选中
            let is1 = this.transferData[i].list.map(function (val) {
              return val.singleCheck
            }).indexOf(false)
            if (is1 === -1) {
              this.transferData[i].checkAll = true
              this.casaderIsAll = true
            };
          };
        } else {
          let index1 = this.checkAllList.map(function (val) {
            return val.StudentID
          }).indexOf(child.StudentID)
          this.checkAllList.splice(index1, 1)
          for (let i = 0; i < this.transferData.length; i++) {
            let mapIndex1 = this.transferData[i].list.map(function (val) {
              return val.StudentID
            }).indexOf(child.StudentID)
            if (mapIndex1 !== -1) {
              this.transferData[i].list[mapIndex1].singleCheck = false
            };
            // 组内全选按钮是否选中
            let is2 = this.transferData[i].list.map(function (val) {
              return val.singleCheck
            }).indexOf(true)
            if (is2 === -1) { // 没有true
              this.transferData[i].checkAll = false
              this.casaderIsAll = false
            } else {
              // 最少有一个true
              let is3 = this.transferData[i].list.map(function (val) {
                return val.singleCheck
              }).indexOf(false)
              if (is3 === -1) {
                this.transferData[i].checkAll = true
                this.casaderIsAll = true
              } else {
                this.transferData[i].checkAll = false
                this.casaderIsAll = false
              };
            };
          };
        };
      },
      searchNameFun: function (vals) {
        this.searchName = vals
        if (vals !== '') {
          this.isShowSelecAll = false
        } else {
          this.isShowSelecAll = true
        }
      },
      handleClose: function (name) {
        for (let u = 0; u < this.checkAllList.length; u++) {
          if (this.checkAllList[u].StudentID === name.StudentID) { this.checkAllList.splice(u, 1) }
        };
        for (let i = 0; i < this.transferData.length; i++) {
          let mapIndex = this.transferData[i].list.map(function (val) {
            return val.StudentID
          }).indexOf(name.StudentID)
          if (mapIndex !== -1) {
            this.transferData[i].list[mapIndex].singleCheck = false
          };
          // 组内全选按钮是否选中
          let is4 = this.transferData[i].list.map(function (val) {
            return val.singleCheck
          }).indexOf(true)
          if (is4 === -1) { // 没有true
            this.transferData[i].checkAll = false
            this.casaderIsAll = false
          } else {
            // 最少有一个true
            let is5 = this.transferData[i].list.map(function (val) {
              return val.singleCheck
            }).indexOf(false)
            if (is5 === -1) {
              this.transferData[i].checkAll = true
              this.casaderIsAll = true
            } else {
              this.transferData[i].checkAll = false
              this.casaderIsAll = false
            };
          };
        };
      },
      modalCancel: function () {
        this.checkAllGroup = []
        this.checkAllList = []// 右侧滞空
        this.newList = []// 左侧滞空
        this.transferData = []// 中间滞空
        this.casaderIsAll = false// 全选
        this.addPublic = false
      },
      async  modalAdd () {
        let tutorArr = []; let that = this
        if (this.checkAllList.length > 0) {
          for (let i = 0; i < this.checkAllList.length; i++) {
            tutorArr.push(this.checkAllList[i].StudentID)
          };
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/CreateCourseplanPermission`,
                                       {
                                         LayeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
                                         Type: that.subjectRadio.Type,
                                         AID: that.subjectRadio.ID,
                                         StudentIdList: tutorArr
                                       })

          if (res.success) {
            that.xy.msgSuc('添加学生成功。')
            // 根据班级查询导师
            that.loadTable(that.subjectRadio.ID, that.subjectRadio.Type)
          } else {
            that.xy.msgError('添加学生失败。')
          };

          this.addPublic = false
          this.newList = []// 左侧滞空
          this.transferData = []// 中间滞空
          this.checkAllGroup = []// 多选框滞空
          this.checkAllList = []// 右侧滞空
        } else {
          this.xy.msgError(this, { content: '请先选择学生。' })
          this.addPublic = true
        };
      }
    //= =====多选弹出框  End ======
    }

  }
</script>
<style lang='less' scoped>
#crouseRules {
  display: flex;
  height: 100%;
  padding-top: 0;
  .left {
    height: 100%;
    width: 230px;
    overflow-x: auto;
    margin-top: 10px;
  }
}
</style>
