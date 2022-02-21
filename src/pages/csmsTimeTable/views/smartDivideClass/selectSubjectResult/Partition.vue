<!-- 2.选课结果：学生分区 -->
<template>
  <div class="xy-content-body"
       style='display:flex'>
    <!-- 左边 -->
    <div class="class-set-left">
      <!-- <p class="count">
        所有学生(总<span class="name-count"
              :class='studentType==="1"?"name-active":""'
              @click='getSubStudent("1")'>{{selectObj.all}}</span>人, 未分区<span class="name-count"
              :class='studentType==="2"?"name-active":""'
              @click='getSubStudent("2")'>{{selectObj.noPartition}}</span>人)
      </p> -->
      <div @click='addPartition'
           class="partition-add text-center"
           v-show='partitionData.length<10&&smartDivideStepsHeader.isOperation == 0'>
        <p>
          <Icon type="md-add" />添加
        </p>
      </div>
      <div v-for='(item,index) in partitionData'
           @click='getStudent(item)'
           :key='index'
           class="partition-info"
           :class="selectLeftAreaId===item.DivideAreaID?'partition-active':'partition-default'">
        <p class="nowarp"
           :title='item.AreaName+"("+item.PersonNumber+"人)"'> <span>{{item.AreaName}}</span><span>({{item.PersonNumber}}人)</span></p>
        <div v-show='selectLeftAreaId===item.DivideAreaID&&smartDivideStepsHeader.isOperation == 0'>
          <Icon @click.stop='editPartition(item)'
                v-show='!item.IsNoArea'
                title='编辑分区'
                type="md-create"
                class="edit-btn" />
          <Icon @click.stop='delPartition(item)'
                v-show='!item.IsNoArea&&!item.IsDefault'
                title='删除分区'
                type="md-close"
                class="del-btn" />
        </div>
      </div>

    </div>
    <!-- 右边 -->
    <div class="class-set-right pr">
      <div class="xy-content-title clearfix">
        <div class="fl">
          <Dropdown @on-click="moreFun"
                    trigger="click">
            <Button class="xy-info">
              批量操作
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem name="1"
                            :disabled="smartDivideStepsHeader.isOperation !== 0">批量调到</DropdownItem>
              <DropdownItem name="2"
                            :disabled="smartDivideStepsHeader.isOperation !== 0">批量导出</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button class="xy-info"
                  @click="filterModal=true">筛选学生</Button>
        </div>
        <div class="fr pr">
          <!-- <i-input search
                   clearable
                   v-model.trim="searchText"
                   @on-search="FromSubmit"
                   placeholder="请输入用户名/学籍号/姓名"
                   style="width: auto;">
            <icon type="ios-search cursor-p"
                  slot="suffix" />
          </i-input> -->
          <a-input-search placeholder="请输入用户名/学籍号/姓名"
            allowClear
            v-model.trim="searchText"
            @search='FromSubmit'
            style="width: auto;"/>
          <div @click="goBack"
               class="back">
            <i class="iconfont">&#xe6a5;</i>
            <span>返回</span>
          </div>
        </div>
      </div>
      <div>
        <Alert show-icon
               v-show='isNoAreaId&&selectLeftAreaId===isNoAreaId'
               closable
               class="noarea-title">加入到未分区的学生将不参与自动分班流程，可在优化分班时手动加入到指定班级中，适用于对分班有特殊要求的学生
        </Alert>
        <!-- v-if="" -->
        <XyAntTable :rowSelection="tableRowSelection"
                    :columns="columns"
                    :dataSource="dataTable"
                    nullData="该搜索条件下没有结果。"
                    :tableLoading="tableLoading"
                    :pagination="pagination"
                    :scrollx="'max-content'"
                    @change="handleTableChange">
          <div slot="Icon"
               slot-scope="text, record">
            <div v-if="!record.Icon"
                 :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
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
            <span :class="smartDivideStepsHeader.isOperation === 0 ? 'table-el-hover' : ''"
                  @click="adjustStudent(record)">
              {{record.FullName}}
            </span>
          </div>
          <div slot="oprateRender"
               slot-scope="text, record">
            <a @click="adjustStudent(record)"
               :disabled="smartDivideStepsHeader.isOperation !== 0">调整分区</a>
          </div>
        </XyAntTable>
      </div>
    </div>
    <!-- 新增或编辑分区 -->
    <modal v-model="partitionModal"
           width=550
           :transfer="false"
           :title="partitionType?'新增分区':'编辑分区'"
           :mask-closable="false">
      <i-input v-model='partitionObj.name'
               style="margin:15px 0"></i-input>
      <div slot="footer">
        <Button class="xy-modal-close"
                size="large"
                @click="partitionModal=false">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                size="large"
                @click="partitionSubmit">确定</Button>
      </div>
    </modal>
    <!-- 调整分区 -->
    <modal v-model="adjustModal"
           width=550
           :transfer="false"
           title="调整分区"
           :mask-closable="false">
      <ul class="modal-section-ul"
          v-if='areaData.length>0'>
        <template v-for="(item,sdIndex) in areaData">
          <li v-show='selectLeftAreaId!==item.DivideAreaID'
              :key="sdIndex"
              :class="item.isSelect?'section-active':''"
              @click="changeArea(item)">{{item.AreaName}}
            <div :class="adjustAreaId===item.DivideAreaID?'active-bg sanjiao':'sanjiao'"><i class="iconfont">&#xe6a1;</i></div>
          </li>
        </template>
      </ul>
      <div v-else
           class="no-data-modal">
        <img src="@/assets/common/nullData.svg"
             alt="图片" />
        <p class="no-class">
          您还没有分区的信息，请添加分区。
        </p>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                size="large"
                @click="adjustModal=false">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                size="large"
                @click="adjustSubmit">确定</Button>
      </div>
    </modal>
    <!-- 筛选学生 -->
    <modal v-model="filterModal"
           :transfer="false"
           title="筛选学生"
           :mask-closable="false"
           width=550>
      <div class="student-body">
        <span @click='reset'
              class="reset-btn"><img src="@/assets/csmsTimeTable/reset.png"
               alt="">重置</span>
        <!-- 班级 -->
        <div class="filterStudentContent max-h">
          <p class="name">班级：</p>
          <div class="info"
               v-if='classList.length>0'>
            <span class="default-btn"
                  @click='chooseAllClass'
                  :class='checkAll?"avtive-btn":""'>全部</span>
            <span @click='changeClass(item,index)'
                  class="default-btn"
                  v-for='(item,index) in classList'
                  :key='index'
                  :class='item.checked?"avtive-btn":""'>{{item.StudentOrganizationFullName}}</span>
          </div>
        </div>
        <!-- 选科 -->
        <div class="filterStudentContent">
          <p class="name">选科：</p>
          <div class="subs"
               v-if='subjectSetData.length>0'>
            <span class="default-btn"
                  @click='noLimitDivide'
                  :class='subjectSelectedId.length>0?"disabled-btn":(noLimit?"avtive-btn":"")'>不限</span>
            <span @click='changeDivide(item,index)'
                  class="default-btn"
                  v-for='(item,index) in subjectSetData'
                  :key='index'
                  :class='noLimit?"disabled-btn":(item.checkedSub?"avtive-btn":"")'>{{item.DisciplineName}}</span>
          </div>
        </div>
        <!-- 成绩 -->
        <div>
          <div class="filterStudentContent">
            <p class="name">成绩：</p>
            <!-- <div class="name" v-if='!isExistAchievement'>提示：若要通过排名和分数筛选，请去选课结果页面设置学生成绩。</div> -->
            <div class="info"
                 v-if='achievementData.length>0'>
              <radio-group v-model="accordingType"
                           @on-change='accordingTypeChange'>
                <radio label="1">按分数</radio>
                <radio label="2">按排名</radio>
              </radio-group>
            </div>
          </div>
          <div class="filterStudentContent"
               v-if='accordingType=="1"'>
            <div class="info info-margin">
              <span class="default-btn"
                    @click='chooseAllScore'
                    :class='allScoreSelected?"avtive-btn":""'>全部</span>
              <span @click='changeAccordingType(item,index)'
                    class="default-btn"
                    v-for='(item,index) in achievementData'
                    :key='index'
                    :class='item.checked?"avtive-btn":""'>{{item.DisciplineName}}</span>
            </div>
          </div>
          <div class="filterStudentContent"
               v-if='accordingType=="2"'>
            <div class="info info-margin">
              <span @click='changeAccordingType(item,index)'
                    class="default-btn"
                    v-for='(item,index) in achievementData'
                    :key='index'
                    :class='item.checked?"avtive-btn":""'>{{item.DisciplineName}}</span>
            </div>
          </div>
          <div class="choose"
               v-if='accordingType=="1"'>
            <input-number style="width: 150px;"
                          :min="1"
                          v-model.number="score.Min"
                          placeholder="范围起始值"></input-number>
            <span>—</span>
            <input-number style="width: 150px;"
                          :min="1"
                          v-model.number="score.Max"
                          placeholder="范围结束值"></input-number>
          </div>
          <div class="choose"
               v-if='accordingType=="2"'>
            <input-number style="width: 150px;"
                          :min="1"
                          v-model.number="ranking.Min"
                          placeholder="范围起始值"></input-number>
            <span>—</span>
            <input-number style="width: 150px;"
                          :min="1"
                          v-model.number="ranking.Max"
                          placeholder="范围结束值"></input-number>
          </div>

        </div>
        <!-- 学生 -->
        <div class="filterStudentContent"
             v-if='studentType=="1"'>
          <p class="name">学生：</p>
          <div class="info">
            <radio-group v-model='chooseStudentType'>
              <radio label="1">全部学生</radio>
              <radio label="2">未分区学生</radio>
            </radio-group>
          </div>
        </div>
      </div>

      <div slot="footer">
        <Button class="xy-modal-close"
                @click="filterModalCancle">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="filterSubmit">确定</Button>
      </div>
    </modal>
    <!-- 根据分区，批量导出 -->
    <modal v-model="exportModal"
           :transfer="false"
           title="批量导出"
           :mask-closable="false"
           width=550>
      <div v-if='areaData.length>0'>
        <Checkbox :value="exportCheckAll"
                  :indeterminate="indeterminate"
                  @click.prevent.native="chooseAll"
                  style='margin-left: 10px;'>全选</Checkbox>

        <ul class="modal-section-ul">

          <li v-for="(item,sdIndex) in areaData"
              :key="sdIndex"
              :class="item.isSelect?'section-active':''"
              @click="selectSection(item)">{{item.AreaName}}
            <div :class="item.isSelect?'active-bg sanjiao':'sanjiao'"><i class="iconfont">&#xe6a1;</i></div>
          </li>
        </ul>
      </div>
      <div v-else
           class="no-data-modal">
        <img src="@/assets/common/nullData.svg"
             alt="图片" />
        <p class="no-class">
          您还没有分区的信息，请添加分区。
        </p>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="cancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="exportFile">确定</Button>
      </div>
    </modal>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: { XyAntTable },
    data () {
      return {
        noDataText: '该搜索条件下没有结果。',
        smartDivideStepsHeader: this.$parent,
        chooseStudentType: '',
        adjustAreaId: -1, // 控制样式 调整分区弹框，选中的分区样式
        selectLeftAreaId: -1, // 控制样式 分区列表左边的分区选中样式
        isNoAreaId: null,
        // 根据分区，批量导出
        indeterminate: false,
        exportCheckAll: false,
        exportPartitionIds: [],
        exportModal: false,
        // 筛选学生
        filterModal: false,
        // 1.按照班级筛选
        checkAll: false, // 全部按钮
        classSelectedId: [], // 已选择的班级
        classList: [], // 所有班级
        // 2.按照选科筛选
        noLimit: false,
        subjectSelectedId: [], // 已选择的科目
        subjectSetData: [],
        // 3.按照成绩筛选
        accordingType: '',
        achievementData: [],
        // 按分数
        allScoreSelected: false, // 全部
        scoreIndeterminate: false,
        scoreSelectedId: [], // 已选择的科目
        // 按排名
        rankSelectedId: '',
        ranking: {// 排名
          ObjectID: '0',
          ObjectType: '',
          Max: null,
          Min: null
        },
        score: {// 分数
          ObjectID: '0',
          ObjectType: '',
          Max: null,
          Min: null
        },
        studentType: '',
        // 学生列表
        selectedRowKeys: [],
        tableLoading: true,
        pagination: {
          total: 0,
          current: 1,
          pageSize: 15,
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        dataTable: [],
        selectionAll: [],
        pageList: 0,
        searchText: '',
        selectCourse: {
          AID: 0,
          Type: ''
        },
        isExistAchievement: false, // 是否有成绩
        // 调整分区
        partitionId: '',
        adjustModal: false,
        curAdjustStudent: '',
        areaData: [],
        // 增删改分区
        partitionType: true, // true  新增  false 编辑
        partitionModal: false,
        partitionData: [],
        partitionObj: {
          name: '',
          id: ''
        },
        columns: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 48,
            scopedSlots: { customRender: 'Icon' },
            className: 'table-pic',
            fixed: 'left'
          },
          {
            title: '姓名',
            dataIndex: 'FullName',
            width: 150,
            scopedSlots: { customRender: 'FullName' },
            fixed: 'left'
          },
          {
            title: '用户名',
            dataIndex: 'UserName',
            width: 200,
            fixed: 'left'
          },
          {
            title: '性别',
            dataIndex: 'SexName',
            width: 80
          },
          {
            title: '原行政班',
            dataIndex: 'StudentOrganizationFullName'
          },
          {
            title: '选课结果',
            dataIndex: 'SelectDiscipline'
          },
          {
            title: '成绩',
            dataIndex: 'TotalScore',
            width: 100
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            scopedSlots: { customRender: 'oprateRender' },
            width: 100,
            fixed: 'right'
          }
        ]

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
              disabled: record.IsPublished
            }
          })
        }
      }
    },
    mounted () {
      this.getClass()
      this.getSub()
      this.getAreaInfo()
    },
    methods: {
      handleTableChange () {
        this.getTable()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      getStudent (item) {
        this.reset()
        if (item) {
          this.studentType = ''
          this.partitionId = item.DivideAreaID
          this.selectLeftAreaId = item.DivideAreaID
          this.pagination.current = 1
          this.searchText = ''
          this.getTable()
        }
      },
      // getSubStudent (type) {
      //   this.studentType = type
      //   this.partitionId = ''
      //   this.selectLeftAreaId = ''
      //   this.getTable()
      // },
      // 获取班级
      async getClass () {
        let res = await
          this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetIDCOrganizationListByID/?id=${this.smartDivideStepsHeader.divideClassID}`)
        if (res.success) {
          if (res.data.length > 0) {
            res.data.map((item) => {
              item.checked = false
            })
            this.classList = res.data
          }
        }
      },
      // 获取筛选学生科目下的课程和成绩下的课程
      async getSub () {
        this.subjectSetData = []
        this.achievementData = []
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetALllDefaultCourseplan/?id=${this.smartDivideStepsHeader.divideClassID}`)
        if (res.success) {
          let resData = res.data
          resData.map((item) => {
            item.checked = false /// 学生筛选成绩下 选中的样式
            item.checkedSub = false // 学生筛选  选科下 科目选中的样式控制
            if (item.IsSelection) {
              this.subjectSetData.push(item)
            }
          })
          this.achievementData = resData
        }
      },
      // 获取分区详细信息
      async getAreaInfo () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetStuDentAreaInfo?divideClassID=${this.smartDivideStepsHeader.divideClassID}`)
        if (res.success) {
          this.partitionData = res.data.AreaInfo
          this.areaData = res.data.AreaInfo
          this.areaData.sort((a, b) => {
            return b.IsDefault - a.IsDefault
          })
          if (!this.partitionId && this.areaData.length > 0) {
            this.areaData.map(item => {
              if (item.IsDefault) {
                this.partitionId = item.DivideAreaID
                this.selectLeftAreaId = item.DivideAreaID
              }
              if (item.IsNoArea) { // 未分区id
                this.isNoAreaId = item.DivideAreaID
              }
            })
          // this.partitionId = this.areaData[0].DivideAreaID
          // this.selectLeftAreaId = this.areaData[0].DivideAreaID
          }
          this.pagination.current = 1
          this.searchText = ''
          this.getTable()
        }
      },
      // 获取列表数据
      async getTable () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let Search = {
          'DisciplineIDS': [], // 分数
          'DisciplineID': 0, // 排名
          'Max': 0,
          'Min': 0
        }
        if (this.accordingType === '1') {
          Search.DisciplineIDS = this.scoreSelectedId
          Search.Max = this.score.Max
          Search.Min = this.score.Min
          Search.DisciplineID = 0
        } else if (this.accordingType === '2') {
          Search.DisciplineID = this.rankSelectedId
          Search.Max = this.ranking.Max
          Search.Min = this.ranking.Min
          Search.DisciplineIDS = []
        }
        // DisciplineIDS（选科限制 0不限）,SelectType(1：全部学生 2：未分区学生),Type(1：按分数 2：按排名)
        let res = await
          this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetAreaStudentPage`, {
            'PageIndex': this.pagination.current,
            'PageSize': this.pagination.pageSize,
            'DivideClassID': this.smartDivideStepsHeader.divideClassID,
            'DivideAreaID': this.partitionId || 0,
            'StudentOrganizationIDs': this.classSelectedId,
            'SeachText': this.searchText,
            'DisciplineIDS': this.subjectSelectedId || 0, // 选科
            'Type': this.accordingType || 0,
            'Search': Search,
            'SelectType': this.chooseStudentType ? parseInt(this.chooseStudentType) : parseInt(this.studentType || 0)
          })
        if (res.success) {
          let datas = res.data
          this.pagination.total = datas.TotalNumber
          this.pageList = datas.Data.length
          this.dataTable = datas.Data
        }
        this.tableLoading = false
        this.xy.unloading()
      },
      FromSubmit () {
        this.pagination.current = 1
        this.getTable()
      },
      changeArea (item) {
        this.adjustAreaId = item.DivideAreaID
        this.partitionId = item.DivideAreaID
      },
      batchChangePartition () { // 批量改变分区
        if (this.smartDivideStepsHeader.isOperation === 0) {
          if (this.selectionAll.length === 0) {
            this.xy.msgError('请勾选要改变分区的学生。')
            return false
          }
          this.adjustAreaId = -1
          this.adjustModal = true
        }
      },
      moreFun (res) {
        if (res === '1') {
          this.batchChangePartition()
        } else if (res === '2') {
          this.exportFun()
        }
      },
      // 单个学生调整分区
      adjustStudent (row) {
        this.adjustAreaId = -1
        this.adjustModal = true
        this.selectionAll = [row]
      },
      // 调整分区
      async adjustSubmit () {
        if (this.smartDivideStepsHeader.isOperation === 0) {
          if (!this.partitionId || this.adjustAreaId === -1) {
            this.xy.msgError('请选择一个分区。')
            return false
          }
          let idsStr = []
          for (let i = 0; i < this.selectionAll.length; i++) {
            idsStr.push(this.selectionAll[i].StudentID)
          }
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/EditStudentArea`, {
            DivideClassID: this.smartDivideStepsHeader.divideClassID,
            DivideAreaID: this.partitionId,
            StudentdIDS: idsStr
          })
          if (res.success) {
            this.xy.msgSuc('调整成功。')
            this.selectionAll = []
            this.selectedRowKeys = []
            this.adjustModal = false
            this.selectLeftAreaId = this.partitionId // 分区调整成功，高亮显示调整之后的分区
            this.getAreaInfo()
          }
          this.xy.unloading()
        }
      },
      // ------------------------批量导出start------------------------------------
      exportFun () {
        this.indeterminate = false
        this.exportCheckAll = true
        this.exportPartitionIds = []
        this.areaData.map((item) => {
          this.$set(item, 'isSelect', true)
          this.exportPartitionIds.push(item.DivideAreaID)
          return item
        })
        this.exportModal = true
      },
      selectSection (val) { // 选择课时数
        this.areaData.map((item) => {
          if (item.DivideAreaID === val.DivideAreaID) {
            item.isSelect = !item.isSelect
          }
          return item
        })
        if (val.isSelect) {
          if (this.exportPartitionIds.indexOf(val.DivideAreaID) === -1) {
            this.exportPartitionIds.push(val.DivideAreaID)
          }
        } else {
          this.exportPartitionIds = this.exportPartitionIds.filter(item => item !== val.DivideAreaID)
        }
        this.checkAllGroupChange(this.exportPartitionIds)
      // console.log(this.exportPartitionIds)
      },
      // 导出
      exportFile () {
        // console.log(this.exportPartitionIds)
        if (!this.exportPartitionIds.length) {
          return this.xy.msgError('请选择分区。')
        }
        this.exportModal = false
        let ids = this.exportPartitionIds.length > 0 ? this.exportPartitionIds.join(',') : ''
        this.xy.downFile(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/ExportStudentArea`, {
          divideAreaIDs: ids,
          divideClassID: this.smartDivideStepsHeader.divideClassID
        })
      },
      cancel () {
        this.exportModal = false
      },
      // 根据分区，批量导出-----------全选
      chooseAll (item, index) {
        if (this.indeterminate) {
          this.exportCheckAll = false
        } else {
          this.exportCheckAll = !this.exportCheckAll
        }
        this.indeterminate = false
        if (this.exportCheckAll) {
          this.exportPartitionIds = this.areaData.map(item => item.DivideAreaID)
          if (this.areaData.length > 0) {
            this.areaData.map((item) => {
              item.isSelect = true
              return item
            })
          }
        } else {
          this.exportPartitionIds = []
          if (this.areaData.length > 0) {
            this.areaData.map((item) => {
              item.isSelect = false
              return item
            })
          }
        }
        console.log(this.exportPartitionIds)
      },
      // 单个改变
      checkAllGroupChange (data) {
        if (data.length === this.areaData.length && this.areaData.length > 0) {
          this.indeterminate = false
          this.exportCheckAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.exportCheckAll = false
        } else {
          this.indeterminate = false
          this.exportCheckAll = false
        }
      },
      // --------------------------筛选学生start---------------------------
      // 1.按班级筛选
      chooseAllClass () {
        this.checkAll = !this.checkAll
        this.classSelectedId = []
        if (this.checkAll) {
          this.classList.map((item) => {
            item.checked = true
            this.classSelectedId.push(item.StudentOrganizationID)
          })
        } else {
          this.classList.map((item) => {
            item.checked = false
          })
        }
      },
      changeClass (item, index) {
        let arr = []
        this.classList[index].checked = !this.classList[index].checked
        this.classList.map((t) => {
          if (t.checked) {
            arr.push(t.StudentOrganizationID)
          }
        })
        this.checkAll = !!((arr.length === this.classList.length && arr.length > 0))
        this.classSelectedId = arr
      },

      // 2.按选科筛选
      noLimitDivide () {
        if (this.subjectSelectedId.length === 0) {
          this.noLimit = !this.noLimit
          this.subjectSetData.map((item) => {
            item.checkedSub = false
          })
          this.subjectSelectedId = []
        }
      },
      changeDivide (item, index) {
        if (!this.noLimit) {
          let arr = []
          this.subjectSetData[index].checkedSub = !this.subjectSetData[index].checkedSub
          this.subjectSetData.map((item) => {
            if (item.checkedSub) {
              arr.push(item.DisciplineID) // CoursePlanID
            }
          })
          this.subjectSelectedId = arr
        }
      },
      // 3.按成绩筛选
      accordingTypeChange () {
        if (this.accordingType === '1') {
          this.rankSelectedId = ''
        // this.ranking.Min = ''
        // this.ranking.Max = ''
        } else if (this.accordingType === '2') {
          this.scoreSelectedId = []
          this.allScoreSelected = false
          this.scoreIndeterminate = false
        // this.score.Min = ''
        // this.score.Max = ''
        }
        this.achievementData.map((t) => {
          t.checked = false
        })
      },
      // 按分数的全选选中与取消
      chooseAllScore () {
        this.allScoreSelected = !this.allScoreSelected
        this.scoreSelectedId = []
        if (this.allScoreSelected) {
          this.achievementData.map((item) => {
            item.checked = true
            this.scoreSelectedId.push(item.DisciplineID)
          })
        } else {
          this.achievementData.map((item) => {
            item.checked = false
          })
        }
      },
      // 按成绩或分数的筛选 改变样式
      changeAccordingType (item, index) {
        if (this.accordingType === '1') { // 下面的科目是多选
          let arr = []
          this.achievementData[index].checked = !this.achievementData[index].checked
          this.achievementData.map((t) => {
            if (t.checked) {
              arr.push(t.DisciplineID)
            }
          })
          this.allScoreSelected = !!((arr.length === this.achievementData.length && arr.length > 0))
          this.scoreSelectedId = arr
        } else if (this.accordingType === '2') { // 下面的科目是单选
          this.achievementData[index].checked = !this.achievementData[index].checked
          this.achievementData.map((t) => {
            if (t.DisciplineID !== item.DisciplineID) {
              t.checked = false
            }
          })
          this.rankSelectedId = this.achievementData[index].checked ? item.DisciplineID : ''
        }
      },

      reset () {
        this.checkAll = false
        this.classSelectedId = []
        this.classList.map((item) => {
          item.checked = false
        })
        this.noLimit = false
        this.subjectSelectedId = []
        this.subjectSetData.map((item) => {
          item.checked = false
        })
        // ---------按成绩start------------
        this.accordingType = ''
        this.achievementData.map((item) => {
          item.checked = false
          item.checkedSub = false
        })
        // 按分数
        this.allScoreSelected = false
        this.scoreSelectedId = []
        this.score.Max = null
        this.score.Min = null
        // 按排名
        this.rankSelectedId = ''
        this.ranking.Max = null
        this.ranking.Min = null
        // ---------按成绩end------------
        this.chooseStudentType = ''
      },
      filterModalCancle () {
        this.filterModal = false
        this.reset()
        this.getTable()
      },
      filterSubmit () {
        // 判断有无筛选条件
        let obj = {
          isHaveClass: false,
          isHaveSubject: false,
          isHaveOther: false,
          isHaveStudentType: false
        }
        if (this.accordingType === '1' || this.accordingType === '2') {
          obj.isHaveOther = true
        }
        if (obj.isHaveOther) {
          let val = this.check()
          if (val) {
            this.filterModal = false
            this.getTable()
            // this.reset()
          }
        } else {
          this.filterModal = false
          this.getTable()
          // this.reset()
        }
      },
      check () {
        switch (this.accordingType) {
          case '1': {
            if (this.scoreSelectedId.length === 0) {
              this.xy.msgError('请选择按分数下的科目。')
              return false
            } else if (!this.score.Min > 0) {
              this.xy.msgError('请填写按分数查询起始值。')
              return false
            } else if (!this.score.Max > 0) {
              this.xy.msgError('请填写按分数查询结束值。')
              return false
            } else if (this.score.Min >= this.score.Max) {
              this.xy.msgError('分数的结束值要大于起始值。')
              return false
            }
            break
          }
          case '2': {
            if (this.rankSelectedId.length === 0) {
              this.xy.msgError('请选择按排名下的科目。')
              return false
            } else if (!this.ranking.Min > 0) {
              this.xy.msgError('请填写按排名查询起始值。')
              return false
            } else if (!this.ranking.Max > 0) {
              this.xy.msgError('请填写按排名查询结束值。')
              return false
            } else if (this.ranking.Min >= this.ranking.Max) {
              this.xy.msgError('排名的结束值要大于起始值。')
              return false
            }
            break
          }
        }
        return true
      },
      addPartition () {
        this.partitionType = true
        this.partitionModal = true
        this.partitionObj.name = '第' + (this.partitionData.length - 1) + '分区'
      },
      editPartition (item) {
        if (this.smartDivideStepsHeader.isOperation === 0) {
          this.partitionModal = true
          // this.partitionObj = item
          this.partitionObj.name = item.AreaName
          this.partitionId = item.DivideAreaID
          this.partitionType = false
        }
      },
      async partitionSubmit () {
        if (!this.partitionObj.name) {
          this.xy.msgError('请输入分区名称。')
          return false
        } else if (this.partitionObj.name.length > 10) {
          this.xy.msgError('分区名称限制10个字符。')
          return false
        }
        if (!this.partitionType) { // 编辑
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/EditAreaName`, {
            DivideClassID: this.smartDivideStepsHeader.divideClassID,
            AreaName: this.partitionObj.name,
            DivideAreaID: this.partitionId
          })
          if (res.success) {
            this.partitionModal = false
            this.getAreaInfo()
          }
          this.xy.unloading()
        } else { // 新增
          let status = true
          this.partitionData.map((item) => {
            if (item.AreaName === this.partitionObj.name) {
              status = false
            }
          })
          if (!status) {
            this.xy.msgError('分区名称已存在,请手动修改分区名称。')
            return false
          }
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/CreateArea`, {
            DivideClassID: this.smartDivideStepsHeader.divideClassID,
            AreaNames: [this.partitionObj.name]
          })
          if (res.success) {
            this.partitionModal = false
            this.getAreaInfo()
          }
          this.xy.unloading()
        }
      },
      delPartition (item) {
        if (this.smartDivideStepsHeader.isOperation === 0) {
          let that = this
          this.$Modal.confirm({
            title: '确认提示',
            content: '确定要删除此分区么？删除后此分区下的人都会归入默认分区内。',
            onOk () {
              that.sureDel(item)
            }
          })
        }
      },
      async sureDel (item) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/DeleteArea`, {
          DivideClassID: this.smartDivideStepsHeader.divideClassID,
          DivideAreaIDS: [item.DivideAreaID]
        })
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          this.partitionId = ''
          this.getAreaInfo()
        }
        this.xy.unloading()
      },
      goBack () {
        this.$router.go(-1)
      }
    }

  }
</script>
<style lang='less' scoped>
.class-set-left {
  border-right: 1px solid #e8e8e8;
  width: 200px;
  padding-right: 10px;
  padding-top: 10px;
}

.class-set-right {
  width: calc(100% - 200px);
}

.class-set-left > .count {
  font-size: 12px;
  color: rgba(140, 140, 140, 1);
  margin: 20px 0;
}

.partition-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
  font-size: 12px;
  margin-bottom: 20px;
  min-height: 32px;
}

.partition-default {
  color: rgba(0, 0, 0, 0.65);
  background: rgba(245, 245, 245, 1);
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
}
.partition-info {
  &:hover {
    background: rgba(230, 247, 255, 1);
    border: 1px solid rgba(65, 150, 255, 1);
    .nowarp {
      color: rgb(102, 102, 102);
    }
    .edit-btn {
      color: #1890ff;
      &:hover {
        cursor: pointer;
      }
    }
    .del-btn {
      color: #1890ff;
      &:hover {
        cursor: pointer;
      }
    }
  }
}

.partition-active {
  background: rgba(65, 150, 255, 1);
  border-radius: 2px;
  color: #fff;
}

.partition-info > p {
  max-width: 70%;
}

.name-count {
  font-size: 14px;
}

.name-active {
  color: #1890ff;
}

.partition-info .edit-btn {
  margin-right: 5px;
}
.partition-add {
  font-size: 12px;
  color: rgba(102, 102, 102, 1);
  border-radius: 4px;
  border: 1px dashed rgba(217, 217, 217, 1);
  margin-bottom: 20px;
  min-height: 32px;
  line-height: 32px;
}

.partition-add:hover,
.name-count:hover {
  color: #1890ff;
  cursor: pointer;
}
.adjustPartition {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-left: 15px;
}

.adjustPartition > li {
  width: 22%;
  max-width: 22%;
  margin-bottom: 10px;
  border-radius: 4px;
  font-size: 14px;
  height: 44px;
  margin-right: 10px;
  line-height: 44px;
}
// 调整分区
.adjustPartition > .default {
  color: rgba(0, 0, 0, 0.65);
  background: rgba(245, 245, 245, 1);
  border: 1px solid rgba(217, 217, 217, 1);
}

.adjustPartition > .active {
  background: rgba(230, 247, 255, 1);
  border: 1px solid rgba(65, 150, 255, 1);
  color: rgba(65, 150, 255, 1);
}

.nowarp {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
// 筛选学生弹框样式
.student-body {
  position: relative;
  margin: 15px 0;
}

.reset-btn {
  position: absolute;
  right: 15px;
  top: -15px;
  color: rgba(24, 144, 255, 1);
  font-size: 14px;
  cursor: pointer;
}

.reset-btn img {
  width: 16px;
}
.max-h {
  max-height: 300px;
  overflow-y: auto;
}
.filterStudentContent {
  display: flex;
}

.filterStudentScore {
  display: inline-block !important;
}

.choose {
  display: flex;
  align-items: center;
  margin-left: 50px;
}

.filterStudentContent .name {
  min-width: 50px;
  padding: 8px 0;
}

.filterStudentContent > .info {
  padding-bottom: 6px;
  margin-bottom: 6px;
  font-size: 0;
}

.filterStudentContent .checkbox-width {
  display: inline;
}

.filterStudentContent .checkbox-width > .ivu-checkbox-default {
  min-width: 50px;
  padding: 8px 0;
}

.filterStudentContent > .info > div > .ivu-radio-default {
  padding: 8px 0;
}

.info-margin {
  margin-left: 50px;
  margin-top: -15px;
}

.default-btn {
  display: inline-block;
  padding: 2px 10px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  background: transparent;
  border-radius: 4px;
  margin-right: 10px;
  margin-top: 8px;
  cursor: pointer;
}

.disabled-btn {
  color: #c5c8ce;
  background-color: #f7f7f7;
}

.avtive-btn {
  color: rgba(255, 255, 255, 1);
  background: rgba(24, 144, 255, 1);
}
.adjustPartition {
  margin: 20px 0;
}
.img-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.no-data-modal {
  display: flex;
  flex-direction: column;
  padding: 50px;
  .no-class {
    text-align: center;
    font-size: 16px;
    color: rgb(127, 127, 127);
    margin-top: 20px;
  }
}
.back {
  color: #1890ff;
  margin-left: 20px;
  display: inline-block;
  cursor: pointer;
  .iconfont {
    margin-right: 5px;
    font-size: 14px;
  }
}
// 批量导出
.modal-section-ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.modal-section-ul li {
  cursor: pointer;
  min-width: 112px;
  height: 40px;
  line-height: 40px;
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 4px;
  color: #333333;
  position: relative;
  margin: 10px;
  text-align: center;
  padding: 0 10px;
}
// .modal-section-ul li:hover {
//   border: 1px solid #1677ff;
//   border-radius: 4px;
//   color: #1677ff;
//   transition: all 0.3s;
//   .sanjiao {
//     border-color: transparent #1677ff #1677ff transparent !important;
//   }
// }
.modal-section-ul .section-active {
  border: 1px solid #1677ff;
  color: #1677ff;
}
.sanjiao {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0;
  height: 0;
  border-color: transparent transparent transparent transparent;
  border-width: 12px;
  border-style: solid;
  i {
    position: absolute;
    right: -12px;
    bottom: -26px;
    color: #fff;
    font-size: 12px;
  }
}
.active-bg {
  border-color: transparent #1677ff #1677ff transparent !important;
}
.noarea-title {
  margin-left: 10px;
}
</style>
