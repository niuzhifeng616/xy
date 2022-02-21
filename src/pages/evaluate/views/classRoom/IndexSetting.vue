<template>
  <div  class="xy-content-module">
      <div class="xy-content-title xy-flex xy-between">
        <div>
            <Button class="xy-primary" @click="settingBtn">批量设置</Button>
        </div>
        <div class="xy-flex xy-center">
          <div>校区/年级：</div>
          <cascader v-model="schoolDefaultValue"
            :data="schoolData"
            :clearable="false"
            not-found-text="暂无数据"
            style="margin-right:10px;"
            @on-change="schoolCascaderFun"></cascader>
          <div>学科/课程：</div>
          <cascader v-model="subjectDefaultValue"
            :data="subjectData"
            :clearable="false"
            not-found-text="暂无数据"
            style="margin-right:10px;"
            @on-change="subjectCascaderFun"></cascader>
          <Input search
            v-model.trim="searchText"
            style="width:200px;"
            @on-search="searchSubmit"
            placeholder="请输入年级/学科/课程"/>
        </div>
      </div>
      <div class="xy-content-body">
        <XyTable
          @changeSelect="changeSelect"
          @changePage="changePage"
          @changePageSize="changePageSize"
          :tbColumns="columns"
          :tbData="tableData"
          :pageSize="pageSize"
          :pageIndex="pageIndex"
          :total="total">
        </XyTable>
      </div>
      <Modal v-model="modalShow"
        :styles="{top:'20px'}"
        width="900"
        :title="modalTitle"
        :transfer="false"
        :loading="loading"
        :mask-closable="false"
      >
        <div class="modal-content">
          <div class="modal-flex-left">
            <div class="font-700">选择指标</div>
            <Tree ref="tree" :data="treeData" show-checkbox @on-check-change="checkChange"></Tree>
          </div>
          <div class="modal-flex-right">
            <div class="font-700">设置一级指标权重</div>
            <div>权重合计100%</div>
            <div v-if="checkedTreeData.length>0" style="max-height:250px;overflow-y:auto;">
              <template v-for="item in checkedTreeData">
                <div :key="item.standardId" v-if="item.parentId===0" class="level-weight xy-flex xy-center">
                  <div class="level-weight-name">{{item.title}}</div>
                  <InputNumber style="width:100px;" placeholder="请输入百分比" :min="0" :max="100" v-model="item.percentage"></InputNumber>
                </div>
              </template>
            </div>
            <div v-else style="margin:20px 0;color:#ccc;">请从左侧勾选指标</div>
            <div class="font-700">设置打分方式</div>
            <RadioGroup v-model="rateType" :disabled="isHaveEvaluation">
              <Radio label="SC" style="margin-rigth:50px;" :disabled="isHaveEvaluation">星级</Radio>
              <Radio label="NV" :disabled="isHaveEvaluation">分值</Radio>
            </RadioGroup>
            <div class="rate-wrap" v-if="rateType==='SC'">
              <div class="rate-flex">
                <span class="xy-flex xy-end">
                  <span>最大星级：</span>
                  <Rate :custom-icon="'iconfont icon-Starunselectedbeifen'" :disabled="isHaveEvaluation" clearable v-model="maxStar" />
                  <span>{{maxStar}}星</span>
                </span>
              </div>
              <div class="rate-flex">
                <span class="xy-flex xy-end">
                  <span>默认星级：</span>
                  <Rate :custom-icon="'iconfont icon-Starunselectedbeifen'" :disabled="isHaveEvaluation" clearable v-model="defaultStar" />
                  <span>{{defaultStar}}星</span>
                </span>
              </div>
              <div class="rate-flex">
                <span class="xy-flex xy-end">
                  <span>最小星级：</span>
                  <Rate :custom-icon="'iconfont icon-Starunselectedbeifen'" :disabled="isHaveEvaluation" clearable v-model="minStar" />
                  <span>{{minStar}}星</span>
                </span>
              </div>
              <div class="rate-flex">
                <span class="xy-flex xy-end">
                  <span>星级折算：</span>
                  <Rate :custom-icon="'iconfont icon-Starunselectedbeifen'" clearable :count="1" disabled v-model="rateStar" />
                  <span>1星=</span>
                  <InputNumber :formatter="value=>parseInt(value)" :disabled="isHaveEvaluation" :min="0" v-model="rateStarNumber" />
                  <span class="rate-margin">分</span>
                </span>
              </div>
            </div>
            <div v-else class="rate-wrap">
              <div class="rate-flex">
                <span>最大分值：<InputNumber :formatter="value=>parseInt(value)" :disabled="isHaveEvaluation" :min="0" v-model="maxRate" /><span class="rate-margin">分</span></span>
              </div>
              <div class="rate-flex">
                <span>默认分值：<InputNumber :formatter="value=>parseInt(value)" :disabled="isHaveEvaluation" :min="0" v-model="defaultRate" /><span class="rate-margin">分</span></span>
              </div>
              <div class="rate-flex">
                <span>最小分值：<InputNumber :formatter="value=>parseInt(value)" :disabled="isHaveEvaluation" :min="0" v-model="minRate" /><span class="rate-margin">分</span></span>
              </div>
            </div>
            <Alert style="margin-top:20px;" show-icon>分值只能输入整数，如果输入小数会自动去掉小数，保留整数</Alert>
            <div v-if="isHaveEvaluation" style="color: #7f7f7f;">注：本学期内已有评价数据，则打分方式在本学期内不可变更</div>
          </div>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="cancel">取消</Button>
          <Button class="xy-modal-primary" @click="ok" shape="circle">确定</Button>
        </div>
      </Modal>
  </div>
</template>
<script>
  import XyTable from '@/components/table/XyTable.vue'
  export default {
    name: 'IndexSetting',
    components: {
      XyTable
    },
    data () {
      return {
        total: 0,
        pageSize: 15,
        pageIndex: 1,
        modalTitle: '设置指标',
        submitType: 'create',
        options: {
          SubjectConfigureID: 0,
          ListSubjectConfigure: [],
          Tree: [],
          Type: 'SC',
          MaxValue: null,
          MinValue: null,
          DefaultValue: null,
          Conversion: null// 星折算
        },
        searchText: '',
        maxRate: null,
        defaultRate: null,
        minRate: null,
        rateStarNumber: null,
        rateType: 'SC',
        maxStar: 0,
        defaultStar: 0,
        minStar: 0,
        rateStar: 1,
        isHaveEvaluation: false,
        modalShow: false,
        loading: true,
        tableData: [],
        treeList: [],
        treeData: [],
        schoolDefaultValue: [0, 0],
        schoolData: [],
        subjectDefaultValue: [0, 0],
        subjectData: [],
        checkedTreeData: [],
        selectTables: [],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '校区',
            key: 'SchoolDistrictName'
          },
          {
            title: '年级',
            key: 'StudentGradeForStudentYearName'
          },
          {
            title: '学科',
            key: 'DisciplineName'
          },
          {
            title: '课程',
            key: 'SubjectName'
          },
          {
            title: '状态',
            key: 'StandardSubjectConfigureID',
            render: (h, params) => {
              return h('div', {
                'style': {
                  'color': params.row.StandardSubjectConfigureID ? '' : '#7f7f7f'
                }
              }, [
                h('span', {
                  'style': {
                    'display': 'inline-block',
                    'width': '6px',
                    'height': '6px',
                    'border-radius': '50%',
                    'margin-right': '5px',
                    'background': params.row.StandardSubjectConfigureID ? '#52C41A' : '#bfbfbf'
                  }
                }),
                h('span', params.row.StandardSubjectConfigureID ? '已设置' : '未设置')
              ])
            }
          },
          {
            title: '指标操作',
            key: 'operation',
            width: 120,
            render: (h, params) => {
              return h('div', {
                'class': {
                  oprateList: true
                }
              }, [
                h('a', {
                  'class': {
                    // disabled: false,
                    oprateBtn1: true
                  },
                  on: {
                    click: () => {
                      this.operationBtn(params.row)
                    }
                  }
                }, params.row.StandardSubjectConfigureID ? '编辑' : '设置')
              ])
            }
          }
        ]
      }
    },
    created () {
      this.getSchool()
      this.getSubject()
      this.getTableData()
    },
    mounted () {
    },
    methods: {
      operationBtn (row) {
        this.isHaveEvaluation = false
        this.modalShow = true
        let strs = `${row.SchoolDistrictID},${row.StudentGradeForStudentYearID},${row.DisciplineID},${row.SubjectID}`
        this.options.ListSubjectConfigure = [strs]
        if (row.StandardSubjectConfigureID) {
          this.modalTitle = '编辑指标'
          this.submitType = 'edit'
          this.options.SubjectConfigureID = row.StandardSubjectConfigureID
          this.getEditData(row.StandardSubjectConfigureID)
        } else {
          this.clearData()
          this.options.SubjectConfigureID = 0
          this.submitType = 'create'
          this.modalTitle = '设置指标'
          this.getLevelList()
        }
      },
      async getEditData (id) {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StandardSetting/GetClassSetting`, {
          subjectConfigureId: id
        })
        if (res.success) {
          this.treeDataFun(res.data.Tree, 'edit')
          this.rateType = res.data.ScoringSetting.Type
          this.isHaveEvaluation = res.data.IsHaveEvaluation
          if (this.rateType === 'SC') {
            this.maxStar = res.data.ScoringSetting.MaxValue
            this.minStar = res.data.ScoringSetting.MinimumValue
            this.defaultStar = res.data.ScoringSetting.DefaultValue
            this.rateStarNumber = res.data.ScoringSetting.Conversion
          } else {
            this.maxRate = res.data.ScoringSetting.MaxValue
            this.defaultRate = res.data.ScoringSetting.DefaultValue
            this.minRate = res.data.ScoringSetting.MinimumValue
          }
        }
      },
      // 获取下拉框中的数据
      async getSchool () {
        let res = await this.xy.get(this.xyApi + '/xy/comm/GetSchoolDistrictForStudentGradeStudentYears')
        if (res.success) {
          this.schoolData.push({
            value: 0,
            label: '所有校区',
            children: [{
              value: 0,
              label: '所有年级'
            }],
            loading: false
          })
          res.data.map(item => {
            this.schoolData.push({
              value: item.ID,
              label: item.Name.length >= 10 ? `${item.Name.substr(0, 9)}...` : item.Name,
              children: this.getSchoolLevel(item.Childrens),
              loading: false
            })
          })
        }
      },
      getSchoolLevel (list) {
        let arrs = [{
          value: 0,
          label: '所有年级'
        }]
        for (let i = 0, len = list.length; i < len; i++) {
          arrs.push({
            value: list[i].StudentGradeForStudentYearID,
            label: list[i].FullName.length >= 10 ? `${list[i].FullName.substr(0, 9)}...` : list[i].FullName
          })
        }
        return arrs
      },
      // 获取下拉框中的数据
      async getSubject () {
        let res = await this.xy.get(this.xyApi + '/xy/comm/GetDisciplineForSubjects')
        if (res.success) {
          this.subjectData.push({
            value: 0,
            label: '所有学科',
            children: [{
              value: 0,
              label: '所有课程'
            }],
            loading: false
          })
          res.data.map(item => {
            this.subjectData.push({
              value: item.ID,
              label: item.Name.length >= 10 ? `${item.Name.substr(0, 9)}...` : item.Name,
              children: this.getSubjectLevel(item.Childrens),
              loading: false
            })
          })
        }
      },
      getSubjectLevel (list) {
        let arrs = [{
          value: 0,
          label: '所有课程'
        }]
        for (let i = 0, len = list.length; i < len; i++) {
          arrs.push({
            value: list[i].SubjectID,
            label: list[i].SubjectName.length >= 10 ? `${list[i].SubjectName.substr(0, 9)}...` : list[i].SubjectName
          })
        }
        return arrs
      },
      schoolCascaderFun (val) {
        this.schoolDefaultValue = val
        this.pageIndex = 1
        this.getTableData()
      },
      subjectCascaderFun (val) {
        this.pageIndex = 1
        this.subjectDefaultValue = val
        this.getTableData()
      },
      searchSubmit () {
        this.pageIndex = 1
        this.getTableData()
      },
      async getLevelList () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StandardManage/GetStandardPage`)
        if (res.success) {
          if (res.data.length > 0) {
            this.treeDataFun(res.data, 'create')
          }
        }
        this.xy.unloading()
      },
      treeDataFun (dataList, name) {
        this.treeData = []
        for (let i = 0, len = dataList.length; i < len; i++) {
          if (name === 'create') {
            this.treeData.push({
              title: dataList[i].StandardName,
              expand: true,
              parentId: dataList[i].ParentID,
              standardId: dataList[i].StandardID,
              percentage: null,
              children: this.treeFor(dataList[i].StandardLevelNext, 'create')
            })
          } else {
            this.treeData.push({
              title: dataList[i].title,
              expand: dataList[i].expand,
              checked: dataList[i].checked,
              parentId: dataList[i].parentId,
              standardId: dataList[i].standardId,
              percentage: dataList[i].percentage,
              children: this.treeFor(dataList[i].children, 'edit')
            })
          }
        }

        this.$nextTick(() => {
          if (name === 'edit') {
            this.checkedTreeData = this.$refs.tree.getCheckedAndIndeterminateNodes()
          } else {
            this.checkedTreeData = []
          }
        })
      },
      treeFor (list, name) {
        let arrs = []
        if (list !== null && list !== undefined && list.length > 0) {
          for (let i = 0, len = list.length; i < len; i++) {
            if (name === 'create') {
              arrs.push({
                title: list[i].StandardName,
                expand: true,
                parentId: list[i].ParentID,
                standardId: list[i].StandardID,
                children: this.treeFor(list[i].StandardLevelNext, 'create'),
                render: (h, func) => {
                  return h('span', {
                    class: ['tree-li']
                  }, [
                    h('span', {
                      class: ['ivu-tree-title', 'ivu-tree-width'],
                      domProps: {
                        title: func.data.title
                      },
                      style: {
                        fontSize: '14px'
                      }
                    }, [
                      h('span', {
                      }, (func.data.title.length >= 10 ? `${func.data.title.substr(0, 9)}...` : func.data.title))
                    ])
                  ])
                }
              })
            } else {
              arrs.push({
                title: list[i].title,
                expand: list[i].expand,
                checked: list[i].checked,
                parentId: list[i].parentId,
                standardId: list[i].standardId,
                children: this.treeFor(list[i].children, 'edit'),
                render: (h, func) => {
                  return h('span', {
                    class: ['tree-li']
                  }, [
                    h('span', {
                      class: ['ivu-tree-title', 'ivu-tree-width'],
                      domProps: {
                        title: func.data.title
                      },
                      style: {
                        fontSize: '14px'
                      }
                    }, [
                      h('span', {
                      }, (func.data.title.length >= 10 ? `${func.data.title.substr(0, 9)}...` : func.data.title))
                    ])
                  ])
                }
              })
            }
          }
        }
        return arrs
      },
      async getTableData () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StandardSetting/GetStandardSettingPage`, {
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          schoolDistrictId: this.schoolDefaultValue[0],
          studentGradeForStudentYearId: this.schoolDefaultValue[1],
          disciplineId: this.subjectDefaultValue[0],
          subjectId: this.subjectDefaultValue[1],
          keyWord: this.searchText
        })
        if (res.success) {
          if (res.data.data.length > 0) {
            for (let i = 0, len = res.data.data.length; i < len; i++) {
              if (res.data.data[i].StandardSubjectConfigureID) {
                this.$set(res.data.data[i], '_disabled', true)
              } else {
                this.$set(res.data.data[i], '_disabled', false)
              }
            }
          }
          this.tableData = res.data.data
          this.total = res.data.totalRecords
        }
        this.xy.unloading()
      },
      changeSelect (val) {
        this.selectTables = val
      },
      changePage (val) {
        this.pageIndex = val
        this.getTableData()
      },
      changePageSize (val) {
        this.pageSize = val
        this.getTableData()
      },
      settingBtn () {
        this.clearData()
        this.modalTitle = '批量设置'
        this.options.SubjectConfigureID = 0
        this.options.ListSubjectConfigure = []
        let arrs = []
        if (this.selectTables.length > 0) {
          this.submitType = 'create'
          for (let i = 0, len = this.selectTables.length; i < len; i++) {
            arrs = `${this.selectTables[i].SchoolDistrictID},${this.selectTables[i].StudentGradeForStudentYearID},${this.selectTables[i].DisciplineID},${this.selectTables[i].SubjectID}`
            this.options.ListSubjectConfigure.push(arrs)
          }
          this.getLevelList()
          this.modalShow = true
        } else {
          this.xy.msgError('请先勾选批量设置的数据')
        }
      },
      clearData () {
        this.checkedTreeData = []
        this.maxStar = 0
        this.minStar = 0
        this.defaultStar = 0
        this.rateStarNumber = null
        this.rateType = 'SC'
        this.maxRate = null
        this.defaultRate = null
        this.minRate = null
      },
      cancel () {
        this.clearData()
        this.modalShow = false
      },
      ok () {
        this.options.Tree = this.treeData
        this.options.Type = this.rateType
        if (this.options.Type === 'SC') {
          this.options.MaxValue = this.maxStar
          this.options.MinValue = this.minStar
          this.options.DefaultValue = this.defaultStar
          this.options.Conversion = parseInt(this.rateStarNumber) // 星折算
        } else {
          this.options.MaxValue = parseInt(this.maxRate)
          this.options.MinValue = parseInt(this.minRate)
          this.options.DefaultValue = parseInt(this.defaultRate)
          this.options.Conversion = 0
        }
        if (this.options.Type === 'SC') {
          if (this.options.Conversion === undefined || this.options.Conversion === null || this.options.Conversion === 0) {
            this.xy.msgError('星级折算不能为空')
            return false
          }
          if (this.options.MaxValue === 0) {
            this.xy.msgError('最大星级不能为空')
            return false
          }
        } else {
          if (this.options.MaxValue === null) {
            this.xy.msgError('最大分值不能为空')
            return false
          }
          if (this.options.MinValue === null) {
            this.xy.msgError('最小分值不能为空')
            return false
          }
          if (this.options.DefaultValue === undefined || this.options.DefaultValue === null) {
            this.xy.msgError('默认分值不能为空')
            return false
          }
        }
        let scoreTotal = 0
        for (let i = 0, len = this.checkedTreeData.length; i < len; i++) {
          if (this.checkedTreeData[i].parentId === 0) {
            scoreTotal += this.checkedTreeData[i].percentage
          }
        }
        if (scoreTotal === 100) {
          this.submitFunc(this.options)
        } else {
          this.xy.msgError('一级指标权重必须为100%')
        }
      },
      async submitFunc (datas) {
        let url = ''
        if (this.submitType === 'create') {
          url = `${this.$store.state.apiPath}/api/StandardSetting/CreateSetting`
        } else {
          url = `${this.$store.state.apiPath}/api/StandardSetting/UpdateSetting`
        }
        this.xy.loading()
        let res = await this.xy.post(url, datas)
        if (res.success) {
          this.modalShow = false
          this.checkedTreeData = []
          this.xy.msgSuc('指标设置成功')
          this.getTableData()
        }
        this.xy.unloading()
      },
      checkChange () {
        for (let i = 0, len = this.treeData.length; i < len; i++) {
          if (this.treeData[i].parentId === 0 && this.treeData[i].checked === false) {
            this.treeData[i].percentage = null
          }
        }
        this.checkedTreeData = this.$refs.tree.getCheckedAndIndeterminateNodes()
      }
    }
  }
</script>
<style lang="less" scoped>
.modal-content{
  display: flex;
  .modal-flex-left{
    width: 300px;
    border:1px solid #d9d9d9;
    border-radius: 4px;
    padding:10px;
    margin-right: 20px;
    max-height: 500px;
    overflow-y: auto;
  }
  .modal-flex-right{
    flex:1;
    .level-weight{
      margin:10px 0;
      .level-weight-name{
        width:170px;
      }
    }
    .rate-wrap{
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .rate-flex{
        width: 50%;
        margin-top:20px;
        .rate-margin{
          margin-left:10px;
        }
      }
    }
  }
}
</style>
