<template>
  <!-- 8.选课规则-名额设置 -->
  <div class="clearfix" style="height: 100%;">
    <div class="left-data fl">
        <div v-for="(item, index) in crouseTree" :key="index">
            <div class="left-item-title">{{item.title}}</div>
            <radio-group v-model="subjectRadio1" vertical @on-change="radioChange" style="max-width:240px">
                <radio :label="subject.id" v-for="(subject, n) in item.children" :key="n" class="nowrap">
                    <span class="f14 radio-name" :title="subject.title">{{subject.title}}</span>
                </radio>
            </radio-group>
        </div>
    </div>
    <div class="right-data fl">
        <div class="clearfix mb-15" style="margin-top:10px"  v-if="isShowBtn">
            <div class="fl" v-if="isOperation===0">
                <Button class="xy-primary" @click="openAddModal">分配名额</Button>
                <Button class="xy-danger" @click="delBatch" :disabled="isNullData">批量删除</Button>
                <Button class="xy-danger" @click="delAll" :disabled="isNullData">全部删除</Button>
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
            <div slot="OrgName"
                slot-scope="text, record">
              <div>
                {{record.OrgName}}
              </div>
            </div>
            <div slot="Quota"
                slot-scope="text, record">
              <div>
                {{record.Quota}}
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

    <!-- 分配名额 -->
    <modal width="664"
           v-if="isOperation === 0"
           :transfer="false"
           v-model="addPublic"
           :mask-closable="false"
           :closable="false">
        <p slot="header">分配名额</p>
        <div>
            <Alert show-icon>
                正在为“{{courseProject.subjectName}}”分配名额。
            </Alert>
            <row>
                <i-col span="12" class="cascader-content-left">
                    <radio-group v-model="subjectBoxRadio" vertical @on-change="radioSubjectBox">
                        <radio label="1">
                            <span class="f14">单班占用名额</span>
                        </radio>
                        <radio label="2">
                            <span class="f14">多班共用名额</span>
                        </radio>
                    </radio-group>
                    <div v-if="crouseBoxTree.length>0">
                        <div v-if="subjectBoxRadio === '1'">
                            <div style="padding:20px;">
                                <radio-group v-model="OrganizationRadio" vertical @on-change="radioOrgChange">
                                    <radio v-for="(subject, index) in crouseBoxTree"
                                            :key="index"
                                            v-model="subject.isChecked"
                                            :value="subject.StudentOrganizationID"
                                            :label="subject">
                                        <span class="f14" >{{subject.StudentOrganizationFullName}}</span>
                                    </radio>
                                </radio-group>
                            </div>
                        </div>
                        <div v-if="subjectBoxRadio === '2'">
                            <div style="padding:20px;">
                                <checkbox v-for="(subject, index) in crouseBoxTree"
                                          :key="index"
                                          v-model="subject.isChecked"
                                          :value="subject.StudentOrganizationID"
                                          :label="subject"
                                          style="height:30px;line-height:30px;"
                                          @on-change="leftChange(subject)">
                                    <span class="f14" >{{subject.StudentOrganizationFullName}}</span>
                                </checkbox>
                            </div>
                        </div>
                    </div>
                    <!--暂无数据-->
                    <!-- <div v-if="crouseBoxTree.length===0" class="modal-null">
                        <img class="img" :src="require('@/assets/common/nullData.svg')" alt="" />
                        <span class="text">暂无班级。</span>
                    </div> -->
                </i-col>
                <i-col span="12" class="cascader-content-left">
                    <div >
                        当前所剩名额：{{SurplusLimit}}
                    </div>
                    <div>
                        名额：<input-number :max="SurplusLimit"
                                :min="1"
                                :disabled="disabledInput"
                                v-model="quotaInput"></input-number>
                    </div>
                </i-col>
            </row>
            <!--暂无数据-->
            <div v-if="crouseBoxTree.length===0" class="modal-null">
                <img class="img" :src="require('@/assets/common/nullData.svg')" alt="" />
                <span class="text">暂无班级。</span>
            </div>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="addPublicCancel">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="modalAdd">保存</Button>
        </div>
    </modal>
</div>

</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'TLArrangRuleQuota',
    components: {
      XyAntTable
    },
    data () {
      return {
        isNoData: true,

        allSelect: [],
        subjectData: [],
        subjectRadio1: '',
        subjectRadio: {
          ID: '',
          Type: ''
        },
        searchText: '',
        isShowBtn: false, // 是否展示操作按钮

        //= ==多选控件 start===
        clientWidth: 1600,
        addPublic: false, // modal默认false
        casaderIsAll: false, // 全选
        newList: [], // 左侧数据
        transferData: [], // 中间数据
        checkAllList: [], // 右侧数据
        checkAllList2: [],
        checkAllGroup: [], // 多选子集合
        fAlert: true, // 首次
        isShowSelecAll: true, // 全选是否显示
        //= ==多选控件 end===

        crouseTree: [],
        courseProject: '',

        AID: 0,
        type: '',
        subjectBoxRadio: '1',
        crouseBoxTree: [],
        SurplusLimit: null,
        switchList: true,
        quotaInput: '',
        orgIDs: [],
        OrganizationRadio: '',
        disabledInput: false,
        isChecked: false,

        isLoading: true,
        isNullData: false,
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: false,
        nullData: '您还没有名额设置的信息，请添加设置。',
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
            title: '行政班级',
            dataIndex: 'OrgName',
            scopedSlots: { customRender: 'OrgName' }
          },
          {
            title: '名额',
            dataIndex: 'Quota',
            width: 100,
            scopedSlots: { customRender: 'Quota' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            width: 80,
            scopedSlots: { customRender: 'oprateRender' }
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
      subjectRadio1 () {
        if (this.subjectRadio1 !== '') {
          this.isShowBtn = true
        } else {
          this.isShowBtn = false
        }
      }
    },
    methods: {
      // 名额列表数据
      async getSubjects (type) {
        if (type === 'fir') {
          this.xy.loading()
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/SelectQuotaTree`, {
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
                subjectName: dataList[i].Levels[j].SubjectName,
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
      },
      // 学生列表数据
      async getTP (aid, type) {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/GetQuotaPage`, {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          searchName: this.searchText,
          classTableID: this.classTableID,
          AID: this.subjectRadio.ID,
          type: this.subjectRadio.Type
        })
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
          content: '您确定要删除此名额设置吗？',
          async onOk () {
            let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/DeleteQuota`, {
              ids: row.CoursePlanQuotaID,
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
        if (!this.isNullData) {
          if (this.selectionAll.length === 0) {
            this.xy.msgError('请勾选要删除的班级。')
          } else {
            var ids = ''
            for (var i = 0; i < this.selectionAll.length; i++) {
              ids += this.selectionAll[i].CoursePlanQuotaID + ','
            }
            var _this = this
            _this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要删除所有选中的班级吗？',
              async onOk () {
                // 缺少批量删除接口
                let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/DeleteQuota`, {
                  ids: ids,
                  ClassTableID: _this.classTableID
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
        if (!_this.isNullData) {
          _this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除所有班级吗？',
            async onOk () {
              let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/DeleteQuotaAll?classTableID=${_this.classTableID}&aid=${_this.subjectRadio.ID}`)
              if (res.success) {
                _this.xy.msgSuc('删除成功。')
                _this.getTP(_this.subjectRadio.ID, _this.subjectRadio.Type)
                _this.getSubjects()
              }
            }
          })
        }
      },
      // 分配名额
      radioSubjectBox () {
        this.orgIDs = []
        this.OrganizationRadio = ''
        this.crouseBoxTree.map((item) => {
          item.isChecked = false
          return item
        })
      },
      radioOrgChange (val) {
        if (this.orgIDs.length === 1) {
          this.orgIDs.splice(0, 1, val.StudentOrganizationID)
        } else {
          this.orgIDs.push(val.StudentOrganizationID)
        }
      },
      leftChange (val) { // 点击选中名额
        var index = this.orgIDs.map((item) => { return item }).indexOf(val.StudentOrganizationID)
        if (index === -1) {
          this.orgIDs.push(val.StudentOrganizationID)
        } else {
          this.orgIDs.splice(index, 1)
        }
      },
      async openAddModal () { // 点击分配名额
        this.addPublic = false
        this.isChecked = false
        this.subjectBoxRadio = '1'
        this.quotaInput = ''
        this.OrganizationRadio = ''
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/SelectQuota`, {
          classTableID: this.classTableID,
          aid: this.courseProject.id
        })
        this.xy.unloading()
        if (res.success) {
          this.addPublic = true
          this.quotaInput = ''
          this.orgIDs = []
          this.crouseBoxTree = []
          // this.crouseBoxTree = res.data.OrgList;
          this.SurplusLimit = res.data.SurplusLimit
          var dataList = res.data.OrgList

          for (var i = 0; i < dataList.length; i++) {
            this.crouseBoxTree.push({
              StudentOrganizationID: dataList[i].StudentOrganizationID,
              StudentOrganizationFullName: dataList[i].StudentOrganizationFullName,
              isChecked: this.isChecked
            })
          };
          if (this.SurplusLimit === 0) {
            this.disabledInput = true
          } else {
            this.disabledInput = false
          }
        }
      },
      addPublicCancel () {
        this.addPublic = false
        this.quotaInput = ''
        this.orgIDs = []
      },
      async modalAdd () {
        if (this.quotaInput === '' || this.orgIDs === '') {
          this.xy.msgError('请勾选班级和填写名额。')
          return false
        } else {
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/CreateQuota?classTableID=${this.classTableID}
            &quota=${this.quotaInput}
            &aid=${this.courseProject.id}
            &orgIDs=${this.orgIDs}`)

          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('添加学生成功。')
            // 根据班级查询导师
            this.getTP(this.subjectRadio.ID, this.subjectRadio.Type)
            this.addPublic = false
            this.getSubjects()
          } else {
            this.xy.msgError('添加学生失败。')
          };
        }
      },

      //= =====多选弹出框 Start ======
      windowResize () {
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

      async treeSelect (data) {
        if (data.length > 0) {
          this.fAlert = false// 首次
          var _this = this
          if (data[0].level === 4) {
            let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/GetAddStudentList`, {
              classTableID: this.classTableID,
              studentOrganizationID: data[0].value
            })
            _this.transferData = []
            if (res.success) {
              if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                  res.data[i].checkAll = false// 每一组的全选按钮
                  res.data[i].checkAllGroup = []// 每一组人集合
                  if (res.data[i].list.length > 0) {
                    for (var j = 0; j < res.data[i].list.length; j++) {
                      res.data[i].list[j].singleCheck = false
                      res.data[i].childNameStr += res.data[i].list[j].FullName + ',' + res.data[i].list[j].UserName + ','
                    };
                    _this.transferData.push(res.data[i])
                  };
                };
                // 根据右侧已选人改变渲染的初始数据
                if (_this.checkAllList.length > 0) {
                  for (var d = 0; d < _this.transferData.length; d++) {
                    for (var z = 0; z < _this.transferData[d].list.length; z++) {
                      var f = _this.checkAllList.map((val) => {
                        return val.StudentID
                      }).indexOf(_this.transferData[d].list[z].StudentID)
                      if (f !== -1) {
                        _this.transferData[d].list[z].singleCheck = true
                      };
                    };
                    // 所有的全选按钮
                    var all1 = _this.transferData[d].list.map((val) => {
                      return val.singleCheck
                    }).indexOf(true)
                    if (all1 === -1) { // 全没有ture
                      _this.transferData[d].checkAll = false
                      _this.casaderIsAll = false
                    } else {
                      // 最少有一个true
                      var all2 = _this.transferData[d].memberlist.map((val) => {
                        return val.singleCheck
                      }).indexOf(false)
                      if (all2 === -1) {
                        _this.transferData[d].checkAll = true
                        _this.casaderIsAll = true
                      } else {
                        _this.transferData[d].checkAll = false
                        _this.casaderIsAll = false
                      };
                    };
                  };
                };
              };
            };
          } else {
            _this.transferData = []
          }
        };
      },
      checkAllBtn () { // 全选
        if (this.casaderIsAll) {
          for (var i = 0; i < this.transferData.length; i++) {
            this.transferData[i].checkAll = true
            for (var j = 0; j < this.transferData[i].memberlist.length; j++) {
              this.transferData[i].memberlist[j].singleCheck = true
              // 把选中的添加至右侧
              this.checkAllList.push(this.transferData[i].memberlist[j])
            };
          };
          // 去重
          this.checkDuplicateRemoval(this.checkAllList)
          // var obj = {}
          // this.checkAllList = this.checkAllList.reduce(function (item, next) {
          //   // eslint-disable-next-line no-unused-expressions
          //   obj[next.StudentID] ? '' : obj[next.StudentID] = true && item.push(next)
          //   return item
          // }, [])
        } else {
          for (var k = 0; k < this.transferData.length; k++) {
            this.transferData[k].checkAll = false
            for (var s = 0; s < this.transferData[k].memberlist.length; s++) {
              this.transferData[k].memberlist[s].singleCheck = false
              for (var m = 0; m < this.checkAllList.length; m++) {
                if (this.checkAllList[m].StudentID === this.transferData[k].memberlist[s].StudentID) {
                  this.checkAllList.splice(m, 1)
                };
              };
            };
          };
        };
      },
      handleCheckAll (item) { // 各个组内的全选按钮
        if (item.checkAll) {
          item.memberlist.map((val) => {
            val.singleCheck = true
            return val
          })
          for (var p = 0; p < this.transferData.length; p++) {
            for (var m = 0; m < this.transferData[p].memberlist.length; m++) {
              for (var q = 0; q < item.memberlist.length; q++) {
                if (this.transferData[p].memberlist[m].StudentID === item.memberlist[q].StudentID) {
                  this.transferData[p].memberlist[m].singleCheck = true
                };
              };
              // 把选中的添加至右侧
              if (this.transferData[p].memberlist[m].singleCheck) {
                this.checkAllList.push(this.transferData[p].memberlist[m])
              };
            };
            // 所有的全选按钮
            var isCheckAll = this.transferData[p].memberlist.map((val) => {
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
          this.checkDuplicateRemoval(this.checkAllList)
          // var obj = {}
          // this.checkAllList = this.checkAllList.reduce(function (item, next) {
          //   // eslint-disable-next-line no-unused-expressions
          //   obj[next.StudentID] ? '' : obj[next.StudentID] = true && item.push(next)
          //   return item
          // }, [])
        } else {
          for (let p = 0; p < this.transferData.length; p++) {
            for (let q = 0; q < this.transferData[p].memberlist.length; q++) {
              var index2 = item.memberlist.map((val) => {
                return val.StudentID
              }).indexOf(this.transferData[p].memberlist[q].StudentID)
              if (index2 !== -1) {
                this.transferData[p].memberlist[q].singleCheck = false
              };
            };
            // 删除右侧
            for (var k = 0; k < item.memberlist.length; k++) {
              var index3 = this.checkAllList.map((val) => {
                return val.StudentID
              }).indexOf(item.memberlist[k].StudentID)
              if (index3 !== -1) {
                this.checkAllList.splice(index3, 1)
              };
            };
            // 所有的全选按钮
            var isCheckAll2 = this.transferData[p].memberlist.map((val) => {
              return val.singleCheck
            }).indexOf(true)
            if (isCheckAll2 === -1) { // 全没有ture
              this.transferData[p].checkAll = false
              this.casaderIsAll = false// 全选
            } else {
              // 最少有一个true
              var isCheckAll3 = this.transferData[p].memberlist.map((val) => {
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
      checkAllChange (child) { // 每个人的按钮
        if (child.singleCheck) {
          this.checkAllList.push(child)
          for (var i = 0; i < this.transferData.length; i++) {
            var mapIndex = this.transferData[i].list.map((val) => {
              return val.StudentID
            }).indexOf(child.StudentID)
            if (mapIndex !== -1) {
              this.transferData[i].list[mapIndex].singleCheck = true
            };
            // 组内全选按钮选中
            var is1 = this.transferData[i].list.map((val) => {
              return val.singleCheck
            }).indexOf(false)
            if (is1 === -1) {
              this.transferData[i].checkAll = true
            };
          };
        } else {
          var index1 = this.checkAllList.map((val) => {
            return val.StudentID
          }).indexOf(child.StudentID)
          this.checkAllList.splice(index1, 1)
          for (let i = 0; i < this.transferData.length; i++) {
            var mapIndex1 = this.transferData[i].list.map((val) => {
              return val.StudentID
            }).indexOf(child.StudentID)
            if (mapIndex1 !== -1) {
              this.transferData[i].list[mapIndex1].singleCheck = false
            };
            // 组内全选按钮是否选中
            var is2 = this.transferData[i].list.map((val) => {
              return val.singleCheck
            }).indexOf(true)
            if (is2 === -1) { // 没有true
              this.transferData[i].checkAll = false
              this.casaderIsAll = false
            } else {
              // 最少有一个true
              var is3 = this.transferData[i].list.map((val) => {
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
      searchNameFun (vals) {
        this.searchText = vals
        if (vals !== '') {
          this.isShowSelecAll = false
        } else {
          this.isShowSelecAll = true
        }
      },
      handleClose (e, name) {
        for (var u = 0; u < this.checkAllList.length; u++) {
          if (this.checkAllList[u].StudentID === name.StudentID) { this.checkAllList.splice(u, 1) }
        };
        for (var i = 0; i < this.transferData.length; i++) {
          var mapIndex = this.transferData[i].list.map((val) => {
            return val.StudentID
          }).indexOf(name.StudentID)
          if (mapIndex !== -1) {
            this.transferData[i].list[mapIndex].singleCheck = false
          };
          // 组内全选按钮是否选中
          var is4 = this.transferData[i].list.map((val) => {
            return val.singleCheck
          }).indexOf(true)
          if (is4 === -1) { // 没有true
            this.transferData[i].checkAll = false
          } else {
            // 最少有一个true
            var is5 = this.transferData[i].list.map((val) => {
              return val.singleCheck
            }).indexOf(false)
            if (is5 === -1) {
              this.transferData[i].checkAll = true
            } else {
              this.transferData[i].checkAll = false
            };
          };
        };
      },
      modalCancel () {
        this.checkAllGroup = []
        this.checkAllList = []// 右侧滞空
        this.newList = []// 左侧滞空
        this.transferData = []// 中间滞空
      },
      //= =====多选弹出框  End ======

      checkDuplicateRemoval (data) { // checkList去重
        this.checkAllList = this.checkAllList.reduce((pre, cur) => {
          if (!pre.includes(cur)) {
            return pre.concat(cur)
          } else {
            return pre
          }
        }, [])
      }
    }
  }
</script>
<style lang="less" scoped>
.left-data {
    padding-right: 15px;
    height: 500px;
    overflow: auto;
    width: 250px;
    border-right: 0;
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
    margin-left: 0;
    border-left: 1px solid rgba(0, 0, 0, 0.09);
    height: 100%;
}
</style>
