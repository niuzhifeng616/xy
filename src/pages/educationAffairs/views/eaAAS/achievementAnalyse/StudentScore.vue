<!-- 教学质量：成绩分析-学生成绩单 -->
<template>
    <div>
        <!-- 筛选条件 -->
        <div class="selected-box pr">
            <div class="selected-con" :class="isUp?'isUpStatus':''">
                <div class="search-item">
                    <div>班级：</div>
                    <ul>
                        <li :class="item.checked?'isChecked':''" @click="changeSeletedClass(item)"
                            v-for="item in classSelected"
                            :key="item.StudentOrganizationID">{{item.StudentOrganizationName}}</li>
                    </ul>
                </div>
                <div class="search-item">
                    <div>学科：</div>
                    <ul>
                        <li :class="item.checked?'isChecked':''" @click="changeSeletedSubject(item)"
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
                        <li :class="item.checked?'isChecked':''" @click="changeScoreOrFFList(item)"
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
        <!--按钮-->
        <div class="xy-content-title">
            <div class="title-item-name clearfix">
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
            :columns="columns"
            :dataSource="datatable"
            :tableLoading="tableLoading"
            :pagination="pagination"
            :scrollx="1000"
            @change="handleTableChange"
            >
            <div slot="Icon" class="table-pic" slot-scope="text, record">
              <div v-if="!record.Icon" :class="`head-con ${record.TeacherSex === 0 ? 'woman' : 'man'}`">
                <span class="head-font">
                  {{ xy.showName(record.FullName)}}
                </span>
              </div>
              <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
            </div>
            <div v-if="scoreMode !== 1" slot="FieldValue" slot-scope="text">
              <div :style="{width:'8px',height: '8px',borderRadius: '50%',background: text === 1 ? '#61CD31' : text === 2 ? '#F9A443' : 'rgba(0,0,0,0)'}">
              </div>
            </div>
            <div slot="FieldValue1" style="min-width:150px" slot-scope="text">
              {{text}}
            </div>
          </XyAntTable>

        </div>
    </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'StudentScore',
    components: {
      XyAntTable
    },
    data () {
      return {
        loading: true,

        arId: '', // 考试管理方案id
        scoreMode: 1, // 选科模式，未选科时不展示学生成绩单的‘选考学考’标识
        searchName: '', // 文本搜索

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
            this.pageIndex = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
            this.pageIndex = 1
            this.pageSize = pageSize
          }
        },
        selectionAll: [],
        headers: [],
        columns: [], // 列
        bodys: [],
        datatable: [] // 数据
      }
    },
    created () {
    },
    mounted () {
      this.getRow()
    },
    methods: {
      handleTableChange (pagination, filters, sorter) {
        // 倒叙：desc，正序：asc
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
        this.getTP()
      },
      getRow () {
        // 获取参数
        if (this.$parent.row) {
          this.arId = this.$parent.row.AchievementRecordID
          this.scoreMode = this.$parent.row.ScoreMode
          this.getSeletedClass()
          this.getSeletedSubject()
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
            list.map((item) => {
              _this.$set(item, 'checked', false)
            })
          } else {
            list.map((item) => {
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
        list.map((item) => {
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
        let res = await _this.xy.get(`${_this.$store.state.apiPath}/api/AchievementRecordStudentInfo/GetIsCheckStudentOrganization`, {
          achievementRecordID: _this.arId
        })
        if (res.success) {
          if (res.data.length > 0) {
            res.data.map((item) => {
              _this.$set(item, 'checked', true)// 默认设置全都选中
              _this.classSelected.push(item)
            })
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
        let res = await _this.xy.get(`${_this.$store.state.apiPath}/api/AchievementRecordExamSubject/GetAll`, {
          achievementRecordID: _this.arId
        })
        if (res.success) {
          if (res.data.length > 0) {
            res.data.map((item) => {
              _this.$set(item, 'checked', true)// 默认设置全都选中
              _this.subjectSelected.push(item)
            })
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
        this.tableLoading = true
        _this.selectionAll = []
        _this.datatable = [] // 当前位置清空后页面刷新调至顶部
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
        this.tableLoading = false
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
                      width: 100,
                      fixed: 'left'
                    })
                  } else {
                    _this.columns.push({
                      title: _this.headers[item].FieldValue,
                      dataIndex: _this.headers[item].FieldKey,
                      width: 150,
                      fixed: 'left'
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
                            sorter: isSort, // 是否需要排序，通过data值获取当前列是否需要排序，如果需要排序则设置为远程排序，监听on-sort-change（如果设置为 custom，则代表远程排序）
                            sortOrder: _this.sortName === sortNameKey ? _this.sortType : false, // 当前列的排序方式 'descend'/'ascend'/false
                            sortDirections: ['ascend', 'descend'],
                            sortNameColunmn: sortNameKey, // 此项为自定义属性，用来在页面渲染完成后，点击时获取列属性sortName（作为参数传给后台，表示对当前列进行排序）
                            width: 190
                          })
                        }
                      }
                      // 加一列显示：0未设置 1学考 2选考
                      var identTypeName = `${_this.headers[item].FieldKey}_identType`
                      cColunmns.unshift({
                        title: ' ',
                        dataIndex: identTypeName,
                        width: 25,
                        className: 'set-border', // 组合列设置边框(此列进行了定位，没有单独占用列宽度)
                        scopedSlots: { customRender: 'FieldValue' }
                      })
                      return cColunmns
                    }()
                  })
                }
              }
            }
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
                        item[`${_this.headers[i].FieldKey}_${cFiledKey}`] = cValue.join('/')

                        // 选考、学考标识添加:0未设置 1学考 2选考
                        item[`${_this.headers[i].FieldKey}_identType`] = _this.bodys[ii].ScoreList[_this.headers[i].FieldKey].Mode
                      }
                    }
                  }
                  listArr.push(item)
                }
                var merge = {}
                for (var index in listArr) {
                  $.extend(merge, listArr[index])
                }
                _this.datatable.push($.extend({ 'FullName': _this.bodys[ii].FullName }, { 'UserName': _this.bodys[ii].UserName }, { 'StudentOrganizationName': _this.bodys[ii].StudentOrganizationName }, { 'IsPorH': _this.bodys[ii].IsPorH }, { 'StudentID': _this.bodys[ii].StudentID }, merge))
              }
            }
            _this.datatable.map((item, index) => {
              _this.$set(item, 'key', index)
            })
            _this.pagination.total = res.data.TotalRecords
          }
        }
      },
      // 单击页码触发
      changePage (current) {
        $(window).scrollTop(0)
        this.pagination.current = current
        this.getTP()
      },
      // 单击切换每页展示条数触发
      changePageSize (size) {
        $(window).scrollTop(0)
        this.pagination.pageSize = size
        if (this.pagination.current === 1) {
          this.getTP()
        } else {
          this.pagination.current = 1
        }
      },
      // -------------------------table end------------------------

      // 排序
      sortChange (val) {
        this.sortName = val.column.sortNameColunmn
        if (val.order === 'normal') {
          this.sortType = 'desc'// 方法返回默认时，传给后台desc（页面上ui箭头未体现出当前排序方式）
        } else {
          this.sortType = val.order
        }
        this.pagination.current = 1
        this.getTP()
      },

      // 导出成绩
      exportAchievement () {
        this.xy.loading()
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
        var _this = this
        setTimeout(function () {
          _this.xy.unloading()
        }, 2000)
      },
      // 各种条件筛选-取消
      cancelSelect () {

      },
      // 各种条件筛选-确定
      submitSelect () {
        if (this.checkedCSIds.length === 0) {
          this.xy.msgError('请选择“班级”。')
          return false
        } else if (this.checkedSSIds.length === 0) {
          this.xy.msgError('请选择“学科”。')
          return false
        } else if (this.showScoreOrFFIds.length === 0) {
          this.xy.msgError('请选择“分数”。')
          return false
        } else if (this.isShowScoreIds.length === 0) {
          this.xy.msgError('请选择“有无分数”。')
          return false
        }
        this.pagination.current = 1
        this.getTP()
      },

      // 文本搜索框
      FromSubmit () {
        this.pagination.current = 1
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
  @import "../../eaAR/ScoreTable.css"; //table
  @import "../../eaAR/StudentAchievement.css"; // 展开收起筛选组合的样式
</style>
