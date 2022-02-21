<!-- 考试管理table操作-成绩管理 -->
<template>
    <div class="xy-content-module">
        <!-- 筛选条件 -->
        <div class="selected-box pr">
            <div class="selected-con" :class="isUp?'isUpStatus':''">
                <div class="search-item">
                    <div>班级：</div>
                    <ul>
                        <li :class="item.checked?'isChecked':''"
                            @click="changeSeletedClass(item)"
                            v-for="item in classSelected"
                            :key="item.StudentOrganizationID">{{item.StudentOrganizationName}}</li>
                    </ul>
                </div>
                <div class="search-item">
                    <div>学科：</div>
                    <ul>
                        <li :class="item.checked?'isChecked':''"
                            @click="changeSeletedSubject(item)"
                            v-for="item in subjectSelected"
                            :key="item.DisciplineID">{{item.DisciplineName}}</li>
                    </ul>
                </div>
                <div class="search-item">
                    <div>学考成绩：</div>
                    <radio-group v-model="isShowStudy">
                        <radio :label="1">
                            <span>显示</span>
                        </radio>
                        <radio :label="0">
                            <span>不显示</span>
                        </radio>
                    </radio-group>
                </div>
                <div class="search-item">
                    <div>分数：</div>
                    <ul>
                        <li :class="item.checked?'isChecked':''"
                            @click="changeScoreOrFFList(item)"
                            v-for="item in scoreOrFFList"
                            :key="item.id">{{item.name}}</li>
                    </ul>
                </div>
                <div class="search-item">
                    <div>有无分数：</div>
                    <ul>
                        <li :class="item.checked?'isChecked':''" @click="changeScoreStatus(item)" v-for="item in scoreStatus" :key="item.id">
                            {{item.name}}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="search-btn">
                <!--<Button class="xy-btn-info" @click="cancelSelect">取消</Button>-->
                <Button class="xy-btn-primary" shape="circle" @click="submitSelect">查询</Button>
            </div>
            <div class="posi-down pa" @click="isUp = !isUp">
                {{isUp?'展开':'收起'}}
                <Icon :class="!isUp?'arrow_rotate':''" type="ios-arrow-down" />
            </div>
            <div class="search-input">
                <Input search v-model="searchName" @on-search="FromSubmit" placeholder="请输入用户名/姓名"
                        class="xy-content-title-search" style="width: 250px;" />
            </div>
        </div>
        <!--按钮 成绩是未发布状态时-->
        <div v-if="!isPublished" class="xy-content-title flex-flow">
            <div>
                <Button class="xy-primary" @click="addStudent">添加学生</Button>
                <!-- <span class="iconfont" style="font-size: 12px; margin: 0 5px 0 -8px;">&#xe6a2;</span> -->
                <Button class="xy-info" @click="calculation" :disabled="isEmpty || tableLoading">重新计算</Button><!-- 无学生数据时禁用 -->
                <dropdown @on-click="more" trigger="click">
                    <Button class="xy-info">
                        更多操作
                        <icon type="ios-arrow-down"></icon>
                    </Button>
                    <dropdown-menu slot="list">
                        <dropdown-item name="1">学科设置</dropdown-item>
                        <dropdown-item name="2">导入成绩</dropdown-item>
                        <dropdown-item name="3">等级赋分</dropdown-item>
                        <dropdown-item name="4">批量删除</dropdown-item>
                        <dropdown-item name="5">清除全部成绩</dropdown-item>
                        <dropdown-item name="6">导出成绩</dropdown-item>
                    </dropdown-menu>
                </dropdown>
            </div>
            <div class="title-item-name clearfix">
                <!-- <div class="fl name">{{arName}}</div> -->
                <div v-if="scoreMode !== 1" class="fr ident-type">
                    <div class="fl"><span class="study"></span>学考</div>
                    <div class="fl"><span class="choose"></span>选考</div>
                </div>
            </div>
        </div>
        <!--按钮 成绩是已发布状态时-->
        <div v-if="isPublished" class="xy-content-title">
            <div class="title-item-name clearfix">
                <!-- <div class="fl name">{{arName}}</div> -->
                <div class="fr export-icon" @click="exportAchievement" style="margin-left:30px;cursor:pointer;">
                    <span class="iconfont" title="导出">&#xe6c7;</span>
                </div>
                <div v-if="scoreMode !== 1" class="fr ident-type">
                    <div class="fl"><span class="study"></span>学考</div>
                    <div class="fl"><span class="choose"></span>选考</div>
                </div>
            </div>
        </div>
        <div class="xy-content-body">
            <XyAntTable
              :rowSelection="tableRowSelection"
              :columns="columns"
              :dataSource="datatable"
              :nullData="nullData"
              :tableLoading="tableLoading"
              :pagination="pagination"
              :scrollx="'max-content'"
              @change="handleTableChange">
              <div slot="Icon" class="table-pic" slot-scope="text, record">
                <div v-if="!record.Icon" :class="`head-con ${record.TeacherSex === 0 ? 'woman' : 'man'}`">
                  <span class="head-font">
                    {{ xy.showName(record.FullName)}}
                  </span>
                </div>
                <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
              </div>
              <div slot="FullName" style="min-width:180px" slot-scope="text, record">
                <span :class="!isPublished ? 'table-el-hover' : ''" @click="!isPublished ? adjustment(record) : ''">
                  {{ record.FullName}}
                </span>
              </div>
              <div slot="identTypeNameRender" slot-scope="text, record" style="">
                <span>{{record}}</span>
              </div>
              <span v-if="!isPublished" slot="oprate" slot-scope="text, record">
                <a @click="adjustment(record)">调整</a>
                <a-divider type="vertical" />
                <a @click="delItem(record)">删除</a>
              </span>
            </XyAntTable>

            <!-- 添加学生-->
            <Modal v-model="addClassModal" title="添加学生" :transfer="false" :loading="loading"
                :mask-closable="false" :closable="false" width="530">
                <div class="dialog-model-content">
                    <ul class="class-dialog-list">
                        <li v-for="item in classList"
                            :key="item.StudentOrganizationID"
                            class="nowrap"
                            :class="item.IsChecked?'checked':''"
                            @click="changeClass(item)"
                            :title="item.StudentOrganizationName">
                            {{item.StudentOrganizationName}}
                        </li>
                    </ul>
                </div>
                <div slot="footer">
                  <Button class="xy-modal-close" @click="addClassModal=false">取消</Button>
                  <Button class="xy-modal-primary" shape="circle" @click="submitClass">确定</Button>
                </div>
            </Modal>

            <!-- 调整分数-->
            <Modal v-model="adjustmentModal" :title="adjustmentModalTitle" :transfer="false"
                :loading="loading" :mask-closable="false" :closable="false" width="500">
                <div class="dialog-model-content">
                    <Table :columns="headList" :data="adjustmentData"></Table>
                </div>
                <div slot="footer">
                  <Button class="xy-modal-close" @click="adjustmentModal=false">取消</Button>
                  <Button class="xy-modal-primary" shape="circle" @click="submitAdjustment">确定</Button>
                </div>
            </Modal>

            <!--导入成绩-->
            <div id="ModalImportFile"></div>

            <!-- 等级赋分 -->
            <Modal v-model="assignPointMd" title="等级赋分" :loading="loading" width="700"
                :mask-closable="false" :closable="false">
                <div class="dialog-model-content">
                  <p class="assign-sub-tit">赋分学科</p>
                  <div class="box-sub" v-if="asSubList.length > 0">
                      <ul>
                          <li v-for="item in asSubList" :key="item.DisciplineID">
                              <div class="box-p" :class="item.isChecked ? 'is-checked' : ''">
                                  <p v-text="item.DisciplineName" @click="selectSub(item)" :title="item.DisciplineName">
                                  </p>
                              </div>
                          </li>
                      </ul>
                  </div>
                  <div class="box-sub">
                      <p class="assign-sub-tit">赋分方案</p>
                      <ul v-if="asModeList.length > 0">
                          <li v-for="item in asModeList" :key="item.ID">
                              <div class="box-p" :class="item.isChecked ? 'is-checked' : ''">
                                  <p v-text="item.Name" @click="modSwitch(item)" :title="item.Name"></p>
                              </div>
                          </li>
                      </ul>
                  </div>
                </div>
                <div slot="footer">
                  <Button class="xy-modal-close" @click="assignPointMd=false">取消</Button>
                  <Button class="xy-modal-primary" shape="circle" @click="asSubmit">确定</Button>
                </div>
            </Modal>
        </div>
        <!-- 导入成绩 -->
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
    </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import XyUpfile from '@/components/upFile/XyUpfile.vue'

  export default {
    name: 'StudentAchievement',
    components: {
      XyUpfile,
      XyAntTable
    },
    data () {
      return {
        loading: true,

        listSearch: {}, // （考试管理）列表的搜索条件

        arId: '', // 考试管理方案id
        arName: '', // 考试管理方案name
        scoreMode: 1, // 选科模式，未选科时不展示学生成绩单的‘选考学考’标识
        isPublished: false, // 当前方案是否发布了

        searchName: '', // 文本搜索

        // 添加班级
        addClassModal: false, // 添加班级（学生）
        classList: [], // 班级列表，当前年级下的所有班级
        checkedClassIDs: [], // 已选中的班级id集合

        // 等级赋分
        assignPointMd: false, // 等级赋分弹出框status管理
        asSubList: [], // 赋分管理弹出框，课程list
        checkedList: [], // 赋分管理弹出框，多选checked
        asModeList: [], // 赋分方案列表
        asModeCheVal: null, // 赋分管理弹出框-赋分方案，单选

        // 以下是筛选条件
        isUp: true, // 更多筛选条件是否为收起状态

        classSelected: [], // 已经添加到当前成绩列表中的所有班级
        checkedCSIds: [0], // 班级筛选

        subjectSelected: [], // 已设置的学科
        checkedSSIds: [0], // 学科筛选

        isShowStudy: 1, // 是否显示学考成绩-默认显示
        sortName: 'TotalScore', // 所选的需要排序的列的标识,默认以总分排序
        sortType: 'descend', // 倒叙：desc，正序：asc

        scoreOrFFList: [
          {
            id: 0,
            name: '全部',
            checked: true
          }, {
            id: 1,
            name: '原始分',
            checked: true
          }, {
            id: 2,
            name: '等级分',
            checked: true
          }
        ], // 分数-默认全部：0，原始分：1，等级分：2
        showScoreOrFFIds: [0, 1, 2],

        scoreStatus: [
          {
            id: 0,
            name: '全部',
            checked: true
          }, {
            id: 1,
            name: '有分数',
            checked: true
          }, {
            id: 2,
            name: '无分数',
            checked: true
          }
        ], // 有无分数-默认
        isShowScoreIds: [0, 1, 2],

        // table
        isEmpty: false, // 数据是否为空

        headers: [],
        columns: [], // 列
        bodys: [],
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
        nullData: '该搜索条件下没有结果。',
        datatable: [], // 数据
        selectionAll: [],
        selectedRowKeys: [],
        tableLoading: true,

        // 调整分数弹框
        adjustmentModal: false,
        adjustmentModalTitle: '',
        adjustmentData: [],
        adjustmentStudentId: '', // 调整分数弹框（当前学生id）
        headList: [],

        // 导入成绩
        upload: {
          title: '',
          tipData: [],
          formtData: [],
          size: 0,
          upParams: {},
          upUrl: '', // 上传文件url
          templateUrl: '', // 模板下载url
          errorUrl: ''// 下载错误文件url
        }

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
              disabled: this.isPublished
            }
          })
        }
      }
    },
    created () {
    },
    mounted () {
      this.getRow()
    },
    methods: {
      handleTableChange (pagination, filters, sorter) {
        if (sorter.order === undefined) {
          if (this.sortType === 'descend') {
            this.sortType = 'ascend'
          } else if (this.sortType === 'ascend') {
            this.sortType = 'descend'
          }
        } else {
          this.sortName = sorter.column.sortNameColunmn
          this.sortType = sorter.order
        }
        // console.log('排序列：' + this.sortName)
        // console.log('排序方式：' + this.sortType) // 正序:ascend,,倒序descend
        // console.log(sorter)
        this.getTP()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      getRow () {
        // .arId、.arName、.scoreMode、.isPublished、.listSearch

        // 获取搜索条件
        if (this.$store.state.educationAffairs.achievementRecordSearch.listSearch !== undefined) {
          this.listSearch = this.$store.state.educationAffairs.achievementRecordSearch.listSearch
        }

        if (this.$store.state.educationAffairs.achievementRecordSearch.arId !== undefined) {
          this.arId = this.$store.state.educationAffairs.achievementRecordSearch.arId
          this.arName = this.$store.state.educationAffairs.achievementRecordSearch.arName
          this.scoreMode = this.$store.state.educationAffairs.achievementRecordSearch.scoreMode
          this.isPublished = this.$store.state.educationAffairs.achievementRecordSearch.isPublished

          this.getSeletedClass()
          this.getSeletedSubject()

          // 从学科设置返回时重置搜索或筛选条件-暂不做---！！勿删2020.6.9
          // if (this.$store.state.educationAffairs.achievementRecordSearch.showScoreOrFFIds) {
          //   // 从学科设置页面返回时回显之前的筛选条件：筛选-分数
          //   this.showScoreOrFFIds = this.$store.state.educationAffairs.achievementRecordSearch.showScoreOrFFIds
          //   for (var item in this.scoreOrFFList) {
          //     if (this.showScoreOrFFIds.indexOf(this.scoreOrFFList[item].id) !== -1) {
          //       this.scoreOrFFList[item].checked = true
          //     } else {
          //       this.scoreOrFFList[item].checked = false
          //     }
          //   }
          //   // 从学科设置页面返回时回显之前的筛选条件：筛选-有无分数
          //   this.isShowScoreIds = this.$store.state.educationAffairs.achievementRecordSearch.isShowScoreIds
          //   for (let item in this.scoreStatus) {
          //     if (this.isShowScoreIds.indexOf(this.scoreStatus[item].id) !== -1) {
          //       this.scoreStatus[item].checked = true
          //     } else {
          //       this.scoreStatus[item].checked = false
          //     }
          //   }
          //   this.isShowStudy = this.$store.state.educationAffairs.achievementRecordSearch.isShowStudy // 从学科设置页面返回时回显之前的筛选条件：筛选-学考成绩
          //   this.sortName = this.$store.state.educationAffairs.achievementRecordSearch.sortName // 从学科设置页面返回时回显之前的筛选条件：筛选-以...排序
          //   this.sortType = this.$store.state.educationAffairs.achievementRecordSearch.sortType // 从学科设置页面返回时回显之前的筛选条件：筛选-排序方式
          //   this.searchName = this.$store.state.educationAffairs.achievementRecordSearch.searchName // 从学科设置页面返回时回显之前的筛选条件：筛选-文本搜索
          // }
          this.getTP()
        }
      },

      // -------------------------table筛选 start------------------------
      // --筛选通用方法
      changeObject (list, item, itemIdName) {
        // list 所有待选项
        // item 当前点击'选中/取消选中'项
        // itemIdName 选项id的名字,传入字符串
        // 返回idsArr 就是已筛选的id集合
        var _this = this
        if (item[itemIdName] === 0) {
          // 当前点击的"全部"按钮
          if (item.checked) {
            list.map(function (item) {
              _this.$set(item, 'checked', false)
            })
          } else {
            list.map(function (item) {
              _this.$set(item, 'checked', true)
            })
          }
        } else {
          // 当前点击的"全部"以外的按钮
          _this.$set(item, 'checked', !item.checked)// 设置选中/取消选中
          if (!item.checked) {
            _this.$set(list[0], 'checked', false)
          }
        }
        // 把所有checked为true的添加到idsArr
        var idsArr = []
        list.map(function (item) {
          if (item.checked) {
            idsArr.push(item[itemIdName])
          }
        })
        // 除"全部"以外所有项都被选中时，把"全部"也选中（list.length - 1 减1排除0）
        if (idsArr.length === list.length - 1) {
          _this.$set(list[0], 'checked', true)
          idsArr.push(0)
        }
        // console.log(idsArr) //已筛选组合
        return idsArr
      },

      // 获取筛选条件-已添加的班级
      async getSeletedClass () {
        var _this = this
        _this.classSelected = []
        _this.classSelected.push({
          StudentOrganizationID: 0,
          StudentOrganizationName: '全部',
          checked: true
        })
        _this.checkedCSIds = []
        let res = await _this.xy.get(`${_this.$store.state.apiPath}/api/AchievementRecordStudentInfo/GetIsCheckStudentOrganization`, {
          achievementRecordID: _this.arId
        })
        if (res.success) {
          if (res.data.length > 0) {
            // 默认设置全都选中
            _this.checkedCSIds.push(0)
            res.data.map(function (item) {
              _this.$set(item, 'checked', true)
              _this.classSelected.push(item)
              _this.checkedCSIds.push(item.StudentOrganizationID)
            })

            // 从学科设置返回时重置搜索或筛选条件-暂不做---！！勿删2020.6.9
            // 从学科设置页面返回时回显之前的筛选条件
            // if (_this.$store.state.educationAffairs.achievementRecordSearch.checkedCSIds) {
            //   _this.checkedCSIds = _this.$store.state.educationAffairs.achievementRecordSearch.checkedCSIds
            //   for (var item in _this.classSelected) {
            //     if (_this.checkedCSIds.indexOf(_this.classSelected[item].StudentOrganizationID) !== -1) {
            //       _this.classSelected[item].checked = true
            //     } else {
            //       _this.classSelected[item].checked = false
            //     }
            //   }
            // }
          }
        }
      },
      changeSeletedClass (item) {
        var list = this.classSelected // list所有待选项
        this.checkedCSIds = this.changeObject(list, item, 'StudentOrganizationID')// 'StudentOrganizationID'选项id的名字
      },

      // 获取筛选条件-已添加的学科
      async getSeletedSubject () {
        var _this = this
        _this.subjectSelected = []
        _this.subjectSelected.push({
          DisciplineID: 0,
          DisciplineName: '全部',
          checked: true
        })
        _this.checkedSSIds = []
        let res = await _this.xy.get(`${_this.$store.state.apiPath}/api/AchievementRecordExamSubject/GetAll`, {
          achievementRecordID: _this.arId
        })
        if (res.success) {
          if (res.data.length > 0) {
            // 默认设置全都选中
            _this.checkedSSIds.push(0)
            res.data.map(function (item) {
              _this.$set(item, 'checked', true)
              _this.subjectSelected.push(item)
              _this.checkedSSIds.push(item.DisciplineID)
            })

            // 从学科设置返回时重置搜索或筛选条件-暂不做---！！勿删2020.6.9
            // 从学科设置页面返回时回显之前的筛选条件
            // if (this.$store.state.educationAffairs.achievementRecordSearch.checkedSSIds) {
            //   _this.checkedSSIds = _this.$store.state.educationAffairs.achievementRecordSearch.checkedSSIds
            //   for (var item in _this.subjectSelected) {
            //     if (_this.checkedSSIds.indexOf(_this.subjectSelected[item].DisciplineID) !== -1) {
            //       _this.subjectSelected[item].checked = true
            //     } else {
            //       _this.subjectSelected[item].checked = false
            //     }
            //   }
            // }
          }
        }
      },
      changeSeletedSubject (item) {
        var list = this.subjectSelected // list所有待选项
        this.checkedSSIds = this.changeObject(list, item, 'DisciplineID')// 'StudentOrganizationID'选项id的名字
      },

      // 分数筛选
      changeScoreOrFFList (item) {
        var list = this.scoreOrFFList
        this.showScoreOrFFIds = this.changeObject(list, item, 'id')
      },
      // 有无分数筛选
      changeScoreStatus (item) {
        var list = this.scoreStatus
        this.isShowScoreIds = this.changeObject(list, item, 'id')
      },
      // -------------------------table筛选 end------------------------

      // -------------------------table start------------------------
      // 成绩管理table
      async getTP () {
        var _this = this
        _this.tableLoading = true
        _this.selectionAll = []
        _this.selectedRowKeys = []
        let res = await _this.xy.get(`${_this.$store.state.apiPath}/api/AchievementRecordDetailsSummary/GetStudentPage`, {
          pageIndex: _this.pagination.current,
          pageSize: _this.pagination.pageSize,
          searchText: _this.searchName,
          achievementRecordID: _this.arId,

          orgIDs: _this.checkedCSIds.indexOf(0) === -1 ? _this.checkedCSIds.join() : '', // 班级id--（逗号分割，全部传''）
          disciplineIDs: _this.checkedSSIds.indexOf(0) === -1 ? _this.checkedSSIds.join() : '', // 学科id--（逗号分割，全部传''）
          showScoreOrFF: _this.showScoreOrFFIds.indexOf(0) === -1 ? _this.showScoreOrFFIds[0] : 0, // 原始分/等级分显示，（全部：0，原始分：1，等级分：2）
          isShowScore: _this.isShowScoreIds.indexOf(0) === -1 ? _this.isShowScoreIds[0] : 0, // 有无分数（全部：0，有分数：1，无分数：2）

          isShowStudy: _this.isShowStudy === 1, // 是否显示学考
          orderField: _this.sortName, // 所选的需要排序的列的标识
          orderType: _this.sortType === 'descend' ? 'desc' : 'asc' // 正、倒序
        })
        _this.tableLoading = false
        if (res.success) {
          if (res.data) {
            _this.headers = res.data.Header
            _this.bodys = res.data.Data

            _this.columns = []
            if (_this.headers.length > 0) {
              _this.columns.push({
                title: ' ',
                width: 44,
                dataIndex: 'Icon',
                scopedSlots: { customRender: 'Icon' },
                fixed: 'left'
              })
              for (var item in _this.headers) {
                if (_this.headers[item].OrderByFieldList === null) {
                  if (_this.headers[item].FieldValue === '用户名') {
                    _this.columns.push({
                      title: _this.headers[item].FieldValue,
                      dataIndex: _this.headers[item].FieldKey,
                      width: 150,
                      fixed: 'left'
                    })
                  } else {
                    _this.columns.push({
                      title: _this.headers[item].FieldValue,
                      dataIndex: _this.headers[item].FieldKey,
                      width: 100,
                      fixed: 'left',
                      scopedSlots: { customRender: _this.headers[item].FieldKey }
                    })
                  }
                } else if (_this.headers[item].OrderByFieldList !== null) {
                  _this.columns.push({
                    title: _this.headers[item].FieldValue,
                    dataIndex: _this.headers[item].FieldKey,
                    align: 'center',
                    className: 'set-border', // 组合列设置边框
                    children: new function () {
                      var cColunmns = []
                      var cName = []
                      var sortNameKey = ''
                      var isSort = false
                      for (var ckey in _this.headers[item].OrderByFieldList) {
                        if (_this.headers[item].OrderByFieldList[ckey].length > 0) {
                          cName = []
                          sortNameKey = ''
                          isSort = false
                          for (var cItem in _this.headers[item].OrderByFieldList[ckey]) {
                            cName.push(_this.headers[item].OrderByFieldList[ckey][cItem].Name)
                            sortNameKey = _this.headers[item].OrderByFieldList[ckey][0].OrderByFieldName// 只取分数或者等级分的相关属性所以是[0]
                            isSort = _this.headers[item].OrderByFieldList[ckey][0].IsOrderBy// 只取分数或者等级分的相关属性所以是[0]
                          }
                          cColunmns.push({
                            title: cName.join('/'),
                            dataIndex: `${_this.headers[item].FieldKey}_${ckey}`,
                            align: 'center',
                            sorter: isSort, // 是否需要排序
                            sortOrder: _this.sortName === sortNameKey ? _this.sortType : false, // 当前列的排序方式 'descend'/'ascend'/false
                            sortDirections: ['ascend', 'descend'],
                            sortNameColunmn: sortNameKey, // （当前列的标识）自定义属性，用来在页面渲染完成后，点击时获取列属性sortName（作为参数传给后台，表示对当前列进行排序）
                            width: 190
                          })
                        }
                      }
                      // 加一列显示：0未设置 1学考 2选考
                      // var identTypeName = xy.string.format('{0}_identType', _this.headers[item].FieldKey)
                      var identTypeName = `${_this.headers[item].FieldKey}_identType`
                      cColunmns.unshift({
                        title: ' ',
                        dataIndex: identTypeName,
                        align: 'center',
                        width: 1,
                        className: `set-border`, // 组合列设置边框（此列进行了定位，没有单独占用列宽度）
                        customRender: (text, record, index) => {
                          if (record[identTypeName] === 1) {
                            return <span style="width:8px; height:8px; border-radius:50%; float:right; background:#61CD31"></span>
                          } else if (record[identTypeName] === 2) {
                            return <span style="width:8px; height:8px; border-radius:50%; float:right; background:#F9A443"></span>
                          } else {
                            return <span style="width:8px; height:8px; border-radius:50%; float:right; background:rgba(0,0,0,0)"></span>
                          }
                        }
                      })
                      // console.log(cColunmns)
                      return cColunmns
                    }()
                  })
                }
              }
              // 未发布状态下展示操作按钮
              if (!_this.isPublished) {
                _this.columns.push({
                  title: '操作',
                  dataIndex: 'oprate',
                  align: 'left',
                  className: 'set-border',
                  width: 150,
                  scopedSlots: { customRender: 'oprate' }
                })
              }
            }
            // console.log(_this.columns)
            _this.datatable = []
            var colCount = _this.headers.length
            var cValue = []
            if (_this.bodys.length > 0) {
              for (var ii in _this.bodys) {
                var listArr = []
                for (var i = 3; i < colCount; i++) {
                  let item = {}
                  // eslint-disable-next-line no-unused-vars
                  for (var ckey in _this.headers[i]) {
                    if (_this.headers[i].OrderByFieldList !== null) {
                      for (var cFiledKey in _this.headers[i].OrderByFieldList) {
                        cValue = []
                        for (var cItem in _this.bodys[ii].ScoreList[_this.headers[i].FieldKey].Score[cFiledKey]) {
                          cValue.push(_this.bodys[ii].ScoreList[_this.headers[i].FieldKey].Score[cFiledKey][cItem])
                        }
                        // item[xy.string.format('{0}_{1}', _this.headers[i].FieldKey, cFiledKey)] = cValue.join('/')
                        item[`${_this.headers[i].FieldKey}_${cFiledKey}`] = cValue.join('/')

                        // 选考、学考标识添加:0未设置 1学考 2选考
                        // item[xy.string.format('{0}_identType', _this.headers[i].FieldKey)] = _this.bodys[ii].ScoreList[_this.headers[i].FieldKey].Mode
                        item[`${_this.headers[i].FieldKey}_identType`] = _this.bodys[ii].ScoreList[_this.headers[i].FieldKey].Mode
                      }
                    }
                  }
                  listArr.push(item)
                }
                // console.log(listArr)
                var merge = {}
                for (var index in listArr) {
                  $.extend(merge, listArr[index])
                }
                // console.log($.extend(merge, listArr[index]))
                _this.datatable.push($.extend({ 'FullName': _this.bodys[ii].FullName }, { 'UserName': _this.bodys[ii].UserName }, { 'StudentOrganizationName': _this.bodys[ii].StudentOrganizationName }, { 'IsPorH': _this.bodys[ii].IsPorH }, { 'StudentID': _this.bodys[ii].StudentID }, merge))
              }
              _this.isEmpty = false
            } else {
              _this.isEmpty = true
            }
            _this.pagination.total = res.data.TotalRecords
            if (res.data.Data !== null && res.data.Data.length > 0) {
              _this.pageList = res.data.Data.length
            }
          } else {
            _this.isEmpty = true
          };
        } else {
          _this.isEmpty = true
        }
      },
      // -------------------------table end------------------------

      // -------------------------添加班级弹框 end------------------------
      // 添加班级（学生）弹框开启
      addStudent () {
        this.addClassModal = true
        this.getClass()
      },
      // 获取班级list
      async getClass () {
        var _this = this
        let res = await _this.xy.get(`${_this.$store.state.apiPath}/api/AchievementRecordStudentInfo/GetStudentorganization`, {
          achievementRecordID: _this.arId
        })
        if (res.success) {
          if (res.data.length > 0) {
            _this.classList = res.data
            _this.checkedClassIDs = [] // 重置已选班级
            // 已选项push到已选班级数组
            _this.classList.map(function (item) {
              if (item.IsChecked) {
                _this.checkedClassIDs.push(item.StudentOrganizationID)
              }
            })
          }
        }
      },
      // 选择班级-班级列表
      changeClass (item) {
        var _this = this
        this.$set(item, 'IsChecked', !item.IsChecked)// 设置选中/取消选中
        if (item.IsChecked) {
          _this.checkedClassIDs.push(item.StudentOrganizationID)
        } else {
          _this.checkedClassIDs.map(function (items, index) {
            if (item.StudentOrganizationID === items) {
              _this.checkedClassIDs.splice(index, 1)
            }
          })
        }
      },
      // 确认添加班级
      async submitClass () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AchievementRecordStudentInfo/Create`, {
          AchievementRecordID: this.arId,
          StudentOrganizationIDs: this.checkedClassIDs
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('添加成功。')
          this.addClassModal = false
          this.getSeletedClass()// 重新获取筛选班级列表
          this.pagination.current = 1
          this.getTP()// 更新列表
        }
      },
      // -------------------------添加班级弹框 end------------------------

      // 更多操作
      more (res) {
        switch (res) {
          case '1': // 学科设置
            this.subjectSet()
            break
          case '2': // 导入成绩
            this.importAchievement()
            break
          case '3': // 等级赋分
            this.levelScore()
            break
          case '4': // 批量删除
            this.delMore()
            break
          case '5': // 清除全部成绩
            this.clearAllAchieveMent()
            break
          case '6': // 导出成绩
            this.exportAchievement()
            break
        }
      },
      // 学科设置
      subjectSet () {
        this.$store.commit('common/getThreeMenuName', `学科设置（考试名称：${this.arName}）`)
        this.$store.commit('educationAffairs/changeAchievementRecordSearch', {
          'arId': this.arId,
          'arName': this.arName,
          'isPublished': this.isPublished,
          'listSearch': this.listSearch,

          'checkedCSIds': this.checkedCSIds, // 从学科返回至当前页面时的筛选条件回显（成绩管理）
          'checkedSSIds': this.checkedSSIds,
          'isShowStudy': this.isShowStudy,
          'showScoreOrFFIds': this.showScoreOrFFIds,
          'isShowScoreIds': this.isShowScoreIds,
          'sortName': this.sortName,
          'sortType': this.sortType === 'descend' ? 'desc' : 'asc',
          'searchName': this.searchName
        })
        this.$router.push({ path: '/xyhome/studentAchievementSubject', query: this.$store.state.common.menuInfo })
      },

      // 导入成绩
      importAchievement () {
        this.$refs['upfile'].modalImport = true
        this.upload = {
          title: '导入成绩',
          tipData: [''],
          formtData: ['xlsx', 'xls'],
          size: 10240,
          upParams: {},
          upUrl: `${this.$store.state.apiPath}/api/AchievementRecordStudentInfo/Import?achievementRecordID=${this.arId}`, // 上传文件url
          templateUrl: `${this.$store.state.apiPath}/api/AchievementRecordStudentInfo/DownloadTemplateImport?achievementRecordID=${this.arId}`, // 模板下载url
          errorUrl: `${this.$store.state.apiPath}/api/AchievementRecordStudentInfo/DownloadException` // 下载错误文件url
        }
      },
      // 导入成功
      async modalSubmit () {
        this.getTP()
      },

      // 等级赋分
      levelScore () {
        this.checkedList = []
        this.assignPointMd = true
        this.GetDisciplineInfo()
        // this.assignmentMode();
      },
      // 赋分模式-赋分方案列，单选
      modSwitch (val) {
        this.asModeList[0].isChecked = false
        for (var i in this.asModeList) {
          if (val.ID === this.asModeList[i].ID) {
            this.asModeList[i].isChecked = true
            this.asModeCheVal = val.ID
          } else {
            this.asModeList[i].isChecked = false
          }
        }
      },
      // 赋分模式-赋分方案列表查询
      async assignmentMode () {
        var _this = this
        let res = await _this.xy.get(`${_this.$store.state.apiPath}/api/AchievementRecordFufenPattern/GetAll`)
        if (res.success) {
          if (res.data && res.data.length > 0) {
            _this.asModeList = res.data.map(function (val, index) {
              return {
                Name: val.Name,
                Mode: val.Mode,
                ID: val.ID,
                // GardTotalScore: 0,
                isChecked: val.ID === _this.asModeCheVal
              }
            })
            // _this.asModeCheVal = res.data[0].ID
          }
        }
      },
      // 赋分管理，赋分学科
      async GetDisciplineInfo () {
        var _this = this
        let res = await _this.xy.get(`${_this.$store.state.apiPath}/api/AchievementRecordExamSubject/GetForFuFenSetting`, {
          achievementRecordID: _this.arId
        })
        _this.asSubList = []
        _this.checkedList = []
        if (res.success) {
          if (res.data && res.data.List && res.data.List.length > 0) {
            _this.asModeCheVal = res.data.SeletedFufenPartternID
            _this.assignmentMode()
            _this.asSubList = res.data.List.map(function (val) {
              return {
                AchievementRecordExamSubjectID: val.AchievementRecordExamSubjectID,
                AchievementRecordID: val.AchievementRecordID,
                DisciplineID: val.DisciplineID,
                DisciplineName: val.DisciplineName,
                FuFenPatternID: val.FuFenPatternID,
                GardTotalScore: val.GardTotalScore,
                OperatorId: val.OperatorId,
                SubjectID: val.SubjectID,
                SubjectName: val.SubjectName,
                TotalScore: val.TotalScore,
                isChecked: val.HightLight
              }
            })
            for (var i in res.data.List) {
              if (res.data.List[i].HightLight) {
                _this.checkedList.push(res.data.List[i].DisciplineID)
              }
            }
          }
        }
      },
      // 等级赋分，多选操作
      selectSub (val) {
        for (var i in this.asSubList) {
          if (val.DisciplineID === this.asSubList[i].DisciplineID) {
            this.asSubList[i].isChecked = !val.isChecked
            if (!this.asSubList[i].isChecked) {
              this.checkedList.splice(this.checkedList.indexOf(val.DisciplineID), 1)
              return
            } else {
              this.checkedList.push(val.DisciplineID)
              return
            }
          }
        }
        // console.log(this.checkedList)
      },
      // 保存赋分管理
      async asSubmit () {
        var _this = this
        _this.changeLoading()
        if (_this.checkedList.length === 0) { return _this.xy.msgError('请选择至少一门赋分学科。') }
        if (!_this.asModeCheVal) { return _this.xy.msgError('请选择赋分方案。') }
        var arr = []
        for (var i in _this.asSubList) {
          for (var it in _this.checkedList) {
            if (_this.asSubList[i].DisciplineID === _this.checkedList[it]) {
              arr.push(_this.asSubList[i])
            }
          }
        }
        let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/AchievementRecordExamSubject/BindFuFen`, {
          DisciplineIDS: arr.map(function (val) {
            return val.DisciplineID // 学科ID,
          }),
          AchievementRecordID: _this.arId,
          FuFenPatternID: _this.asModeCheVal
        })
        if (res.success) {
          _this.xy.msgSuc(res.msg)
          _this.assignPointMd = false
        }
      },

      // 调整
      adjustment (row) {
        this.adjustmentModal = true
        this.adjustmentModalTitle = '调整分数-' + row.FullName
        this.getAdjustmentData(row)
      },
      // 获取调整分数弹框中所需分数值和学科）
      async getAdjustmentData (row) {
        var _this = this
        _this.adjustmentStudentId = row.StudentID
        let res = await _this.xy.get(`${_this.$store.state.apiPath}/api/AchievementRecordStudentInfo/GetScores`, {
          studentID: row.StudentID,
          achievementRecordID: _this.arId,
          showAllexamSubject: true
        })
        if (res.success) {
          _this.adjustmentData = res.data
          _this.headList = [
            {
              title: '学科',
              key: 'DisciplineName',
              width: 230
            },
            {
              title: '分数',
              key: 'ScoreFormat',
              width: 230,
              render: (h, params) => {
                return h('input', {
                  props: {
                  },
                  attrs: {
                    value: params.row.ScoreFormat
                  },
                  style: {
                    borderRadius: '4px',
                    border: '1px solid rgba(217,217,217,1)',
                    height: '32px',
                    width: '100px',
                    padding: '.5em'
                  },
                  on: {
                    blur: (event) => {
                      // event.target.value 当前输入的值,（分数为空，表示缺考。分数不为空时，判断分数是否在范围内。）
                      if (event.target.value !== '' && Number(event.target.value) > params.row.TotalScore) {
                        this.xy.msgError('“' + params.row.DisciplineName + '”设置的学科分数必须小于该学科设置的最高分' + params.row.TotalScore + '分。')
                      }
                      _this.adjustmentData[params.index].ScoreFormat = event.target.value
                    }
                  }
                })
              }
            }
          ]
        }
      },
      // 确认调整分数
      async submitAdjustment () {
        var _this = this
        // 判断是否有学科(学科list初始有一条数据：全部)
        _this.changeLoading()
        if (_this.subjectSelected.length === 1) {
          _this.xy.msgError('请先添加学科。')
          return false
        }

        var subjectItem = {}
        for (var item in _this.adjustmentData) {
          // 验证输入分数格式（分数为空，表示缺考。分数不为空时，验证分数格式。）
          if (_this.adjustmentData[item].ScoreFormat !== '' && !(/^(0|[1-9]\d*)(\s|$|\.\d{1}\b)/.test(_this.adjustmentData[item].ScoreFormat))) {
            this.xy.msgError('“' + _this.adjustmentData[item].DisciplineName + '”设置的学科分数必须为大于或等于0的整数，最多保留一位小数。')
            return false
          }
          // 设置了分数时，验证输入分数是否在范围内（重复blur的验证，避免没检测到blur直接点击确定提交的情况）
          if (_this.adjustmentData[item].ScoreFormat !== '' && Number(_this.adjustmentData[item].ScoreFormat) > _this.adjustmentData[item].TotalScore) {
            this.xy.msgError('“' + _this.adjustmentData[item].DisciplineName + '”设置的学科分数必须小于该学科设置的最高分' + _this.adjustmentData[item].TotalScore + '分。')
            return false
          }
          // 入参值,分数为空时传'-1'
          subjectItem[_this.adjustmentData[item].AchievementRecordExamSubjectID] = _this.adjustmentData[item].ScoreFormat === '' ? '-1' : _this.adjustmentData[item].ScoreFormat
        }

        let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/AchievementRecordStudentInfo/SetScores`, {
          studentID: _this.adjustmentStudentId,
          achievementRecordID: _this.arId,
          ScoreMap: subjectItem
        })
        if (res.success) {
          _this.xy.msgSuc('调整成功。')
          _this.adjustmentModal = false
          _this.pagination.current = 1
          _this.getTP()// 更新列表
        }
      },

      // 删除单个
      delItem (row) {
        var arr = [row.StudentID]
        this.$Modal.confirm({
          title: '删除',
          content: '<p>确定删除“' + row.FullName + '”吗？</p>',
          onOk: () => {
            this.xy.loading()
            this.xy.post(`${this.$store.state.apiPath}/api/AchievementRecordStudentInfo/ClearStudent`, {
              StudentIDS: arr,
              AchievementRecordID: this.arId
            }).then(res => {
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
                this.selectionAll = []
                this.getSeletedClass()// 更新以及重置可筛选班级
                this.getTP()
              }
            })
          }
        })
      },
      // 批量删除
      delMore () {
        if (this.selectionAll.length === 0) { return this.xy.msgError('请选择要删除的学生。') };
        var arr = this.selectionAll.map(function (val) {
          return val.StudentID
        })
        this.$Modal.confirm({
          title: '删除',
          content: '<p>确定删除选中的学生吗？</p>',
          onOk: () => {
            this.xy.post(`${this.$store.state.apiPath}/api/AchievementRecordStudentInfo/ClearStudent`, {
              StudentIDS: arr,
              AchievementRecordID: this.arId
            }).then(res => {
              if (res.success) {
                if (this.selectionAll.length === this.pageList && this.pagination.current > 1) {
                  this.pagination.current = this.pagination.current - 1
                }
                this.xy.msgSuc('删除成功。')
                this.selectionAll = []
                this.getSeletedClass()// 更新以及重置可筛选班级
                this.getTP()
              }
            })
          }
        })
      },
      // 清除全部成绩
      clearAllAchieveMent () {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确定清除全部成绩吗？</p>',
          onOk: () => {
            this.xy.post(`${this.$store.state.apiPath}/api/AchievementRecordStudentInfo/ClearScore?AchievementRecordID=${this.arId}`).then(res => {
              if (res.success) {
                this.xy.msgSuc('已清除全部成绩。')
                this.getTP()
              }
            })
          }
        })
      },
      // 导出成绩
      exportAchievement () {
        let params = {
          searchText: this.searchName,
          achievementRecordID: this.arId,
          orgIDs: this.checkedCSIds.indexOf(0) === -1 ? this.checkedCSIds.join() : '',
          disciplineIDs: this.checkedSSIds.indexOf(0) === -1 ? this.checkedSSIds.join() : '',
          showScoreOrFF: this.showScoreOrFFIds.indexOf(0) === -1 ? this.showScoreOrFFIds[0] : 0,
          isShowScore: this.isShowScoreIds.indexOf(0) === -1 ? this.isShowScoreIds[0] : 0,
          isShowStudy: this.isShowStudy === 1,
          orderField: this.sortName,
          orderType: this.sortType === 'descend' ? 'desc' : 'asc'
        }
        this.xy.downFile(`${this.$store.state.apiPath}/api/AchievementRecordDetailsSummary/ExportStudentScore`, params)
      },
      // 重新计算
      async calculation () {
        this.changeLoading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AchievementRecord/CalcFuFen`, {
          AchievementRecordID: this.arId
        })
        if (res.success) {
          this.xy.msgSuc('计算成功。')
          this.pagination.current = 1
          this.getTP()
        }
      },
      // 各种条件筛选-取消
      cancelSelect () {

      },
      // 各种条件筛选-确定
      submitSelect () {
        if (this.checkedCSIds.length === 0) {
          this.xy.msgError('请选择“班级”')
          return false
        } else if (this.checkedSSIds.length === 0) {
          this.xy.msgError('请选择“学科”')
          return false
        } else if (this.showScoreOrFFIds.length === 0) {
          this.xy.msgError('请选择“分数”')
          return false
        } else if (this.isShowScoreIds.length === 0) {
          this.xy.msgError('请选择“有无分数”')
          return false
        }
        this.pagination.current = 1
        this.getTP()
      },

      // 文本搜索框
      FromSubmit () {
        this.pagination.current = 1
        // this.searchText = this.searchName;
        this.getTP()
      },

      // 点击确认时，强制不关闭弹出框
      changeLoading () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .flex-flow{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  @import "../ScoreTable.css"; //table
  @import "../StudentAchievement.css"; // 展开收起筛选组合的样式
</style>
