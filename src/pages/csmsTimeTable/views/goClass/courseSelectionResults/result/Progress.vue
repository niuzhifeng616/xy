<template>
  <!-- 3.选课结果 -->
  <div class="xy-content-body">
    <div id="statisticalInfo">
      <!-- 筛选条件 -->
      <div class="progress-title" id='statistical'>
        <div>
          <Button  class="xy-primary" @click="selectSub" :disabled="isOperation != 0">引用选课</Button>
          <Button  class="xy-default" @click="subjectSet" style="margin-right: 10px;">课程设置</Button>
          <Button  class="xy-default" @click="addStudent" :disabled="isOperation != 0" style="margin-right: 10px;">添加学生</Button>
          <dropdown @on-click="more"  trigger="click">
            <Button >
              更多
              <icon type="ios-arrow-down"></icon>
            </Button>
            <dropdown-menu slot="list">
              <!-- <dropdown-item name="1" :disabled="isOperation != 0">添加学生</dropdown-item> -->
              <dropdown-item name="1" :disabled="isOperation != 0">批量删除</dropdown-item>
              <dropdown-item name="2">学生成绩</dropdown-item>
              <dropdown-item name="3" :disabled="isOperation != 0">清除全部学生</dropdown-item>
              <dropdown-item name="4">导出选课结果</dropdown-item>
            </dropdown-menu>
          </dropdown>
        </div>
        <!-- 已选未选班级 -->
        <div style="margin:0px auto ;display: flex;justify-content: center;">
          <button-group size='small'>
            <Button :type="selectNum===0?'primary':'default'" @click="loadComplete(0)">全部</Button>
            <Button :type="selectNum===1?'primary':'default'" @click="loadComplete(1)">已选完:{{checktotal}}人</Button>
            <Button :type="selectNum===2?'primary':'default'" @click="loadComplete(2)">未选完:{{unTotal}}人
            </Button>
          </button-group>
        </div>
        <div>
          <Button class="xy-info" @click="filterClass">筛选班级</Button>
          <i-input search clearable v-model.trim="searchText" @on-search="FromSubmit"  placeholder="请输入用户名/学籍号/姓名"
            class="xy-content-title-search" style="width: auto;">
            <icon type="ios-search cursor-p" slot="suffix" />
          </i-input>
        </div>
      </div>
      <div style="background: #F3F3F3;padding-left: 15px;margin-bottom:10px ;" v-if='showClass.length>0'>
        <span class="selected-class"> 已选择班级:</span>
        <span v-for='(i,index) in showClass'
        :key="i.StudentOrganizationName"
          class="chooseClass selected-class">{{i.StudentOrganizationName}}{{index===showClass.length-1?'':'、'}}</span>
      </div>
      <!-- 表格 -->
      <XyAntTable
        :rowSelection="tableRowSelection"
        :columns="columns"
        :dataSource="datatable"
        nullData="该搜索条件下没有结果。"
        :scrollx="'max-content'"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange">
        <!-- 头像 -->
        <div slot="IconRender" slot-scope="text, record">
          <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
            <span class="head-font">
              {{ xy.showName(record.FullName)}}
            </span>
          </div>
          <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
        </div>
        <!-- 姓名 -->
        <div slot="FullNameRender" slot-scope="text, record">
          <span class="table-el-hover" v-if="isOperation === 0" @click="adjust(record)">
            {{record.FullName}}
          </span>
          <span v-else>
            {{record.FullName}}
          </span>
        </div>
        <!-- 用户名 -->
        <div slot="UserNameRender" slot-scope="text, record" style="min-width:120px">
          <span>
            {{record.UserName}}
          </span>
        </div>
        <!-- 行政班 -->
        <div slot="ClassNameRender" slot-scope="text, record" style="min-width:150px">
          <span>
            {{record.ClassName}}
          </span>
        </div>
        <!-- 操作 -->
        <span slot="operaRender" slot-scope="text, record">
          <a @click="adjust(record)"  :disabled="isOperation !== 0">调整</a>
          <a-divider type="vertical" />
          <a @click="del(record)" :disabled="isOperation !== 0">删除</a>
        </span>
      </XyAntTable>
    <modal v-model="adjustSubmodal" width=550 :transfer="false" title="调整课程" :mask-closable="false">
      <ul>
        <li v-for='(item,index) in list' style="margin: 10px 0" :key="item.ThisID">
          <div>
            <checkbox v-model="item.checked" :disabled='item.disabled' style="display: inline-block;">
              {{item.ThisName}}</checkbox>
            <checkbox v-model="t.checked" @on-change='chooseLayered(item,index,t)' :key='t.ThisID'
              :disabled='t.disabled' v-for='t in item.Childrens'>
              {{t.ThisName}}
            </checkbox>

          </div>
        </li>
      </ul>

      <div slot="footer">
        <Button class="xy-modal-close" @click="cancel">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="sureAdjust">确定</Button>
      </div>
    </modal>
    <!-- 添加学生 -->
    <SelectStudent
      :isShow="isShow"
      :schoolDistrictID="schoolDistrictID"
      :isGraduation="isGraduation"
      :isEffective="isEffective"
      :apiData="apiData"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm">
    </SelectStudent>
      <!-- 筛选班级 -->
      <modal v-model="classModal" class="selectResultModal" :transfer="false" title="筛选班级" :mask-closable="false" width=550>
        <div>
          <ul v-if="moreClassList[0].levelList.length>0">
            <li v-for='(item,index) in moreClassList' style="margin: 10px 0" :key="index">
              <div v-if='moreClassList[0].levelList[0].StudentOrganizationID>0'>
                <Checkbox v-model="item.checked" @on-change='chooseAll(item,index)'>全选</Checkbox>
                <checkbox-group style="margin-top: 10px;" v-model="item.checkAllGroup"
                  @on-change="checkAllGroupChange(index)">
                  <checkbox style=' padding: 10px 0 10px 0;' :label="i.StudentOrganizationID"
                    :key='i.StudentOrganizationID' v-for='i in item.levelList'>
                    {{i.StudentOrganizationName}}
                  </checkbox>
                </checkbox-group>
              </div>
            </li>
          </ul>
          <div v-if="moreClassList[0].levelList.length===0" class="no-data-box">
            <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片">
            <span class="no-data-text">暂无班级信息。</span>
          </div>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="classModal = false">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="sureSelectedClass">确定</Button>
        </div>
      </modal>
      <!-- 引用选课结果 -->
      <modal v-model="modalCreate" :transfer="false" title="引用选课结果" :loading="loading"
        :mask-closable="false">
        <div class="dialog-model-content">
          <i-form ref="formValidateOK" :model="formValidateOK" :rules="ruleValidateOK" :label-width="100">
            <!-- <form-item label="所属校区" prop="school">
              <i-select v-model="formValidateOK.school" @on-change="schoolChange" placeholder="请选择校区" style="width:350px">
                <i-option v-for="school in schoolData" :value="school.value" :key="school.label">
                  {{ school.label }}</i-option>
              </i-select>
            </form-item>
            <form-item label="年级" prop="gradeYear">
              <i-select v-model="formValidateOK.gradeYear"  @on-change="gradeYearChange" :label="formValidateOK.gradeYear" placeholder="请选择年级"
                style="width:350px">
                <i-option v-for="year in studentGradeData" :value="year.value" :key="year.label">
                  {{ year.label }}</i-option>
              </i-select>
            </form-item> -->
            <form-item label="选课方案" prop="planName">
              <i-select v-model="formValidateOK.planName" placeholder="请选择选课方案" style="width:350px">
                <i-option v-for="item in planlData" :value="item.value" :key="item.label" :data-id='item.tvalue'>
                  {{ item.label }}</i-option>
              </i-select>
            </form-item>
          </i-form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="modalCreate=false">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="save">保存</Button>
        </div>
      </modal>

    </div>
  </div>
</template>
<script>
  // 引入表格
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import SelectStudent from '@/pages/csmsTimeTable/components/selectStudent/CheckboxSelectStudent.vue'
  // const poto = require('@/assets/common/yrykb.png')
  export default {
    name: 'Progress',
    components: {
      XyAntTable,
      SelectStudent
    },
    data () {
      return {
        // 已选学生
        selectionAll: [],
        selectedRowKeys: [],
        tableLoading: true,
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
        pageList: 0,
        datatable: [],
        columns: [],
        // 调整
        adjustSubmodal: false,
        list: [{
          ThisID: '',
          ThisName: '',
          checked: false,
          Childrens: [{
            ThisID: '',
            ThisName: '',
            checked: false,
            disabled: false
          }]
        }],
        schoolDistrictIDGoClass: 0,
        delType: true,
        searchText: '',
        clearText: '',
        selectNum: 0,
        checktotal: 0,
        unTotal: 0,
        collectionID: '',
        // 筛选班级
        classOrganizationIDs: [],
        classModal: false,
        showClass: [],
        moreClassList: [{
          checkAllGroup: [], // 已选择的
          checked: false,
          levelList: [
            // {
            //   StudentOrganizationName: '',
            //   StuCount: 0,
            //   StudentOrganizationID: null,
            //   checked: false
            // }
          ]
        }],
        modalClear: false,
        // 引用选课结果
        modalCreate: false,
        schoolData: [],
        studentGradeData: [],
        planlData: [],
        formValidateOK: {
          school: '',
          gradeYear: '',
          planName: ''
        },
        ruleValidateOK: {
          school: [{
            type: 'number',
            required: true,
            message: '请选择校区',
            trigger: 'change'
          }],
          gradeYear: [{
            type: 'number',
            required: true,
            message: '请选择年级',
            trigger: 'change'
          }],
          planName: [{
            type: 'number',
            required: true,
            message: '方案名称不能为空',
            trigger: 'change'
          }]

        },
        // 添加学生
        isShow: false,
        apiData: {},
        schoolDistrictID: null,
        isGraduation: false,
        isEffective: false,
        checkAllList: [],
        loading: true,
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation,
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID
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
              disabled: this.isOperation !== 0
            }
          })
        }
      }
    },
    created () {
      if (Object.keys(this.$store.state.csmstimetable.countTable).length > 0) {
        let res = this.$store.state.csmstimetable.countTable
        this.classOrganizationIDs = res.StudentOrganizationIDS
        this.selectNum = res.Completetype
        this.searchText = res.SeachText
      }
      this.getClass()
      this.getCollectionID()
      this.getAdjustSub()
      this.loadComplete(0)
    },
    methods: {
      loadComplete (type) {
        this.selectNum = type
        this.searchText = ''
        this.pagination.current = 1
        this.pagination.pageSize = 15
        this.loadTable()
      },
      getParams () {
        return {
          StudentOrganizationIDS: this.classOrganizationIDs || [],
          ClassTableID: this.classTableID || 0,
          Completetype: this.selectNum || 0,
          Searchtext: this.searchText,
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize
        }
      },
      // 获取选课结果（学生）f
      async loadTable () {
        this.selectionAll = []
        this.selectedRowKeys = []
        // this.datatable = []
        this.tableLoading = true
        this.$store.commit('csmstimetable/changeCountKW', this.getParams())
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassStudentAchievement/GetSelectResultPage`, this.getParams())
        if (res.success) {
          let datas = res.data
          this.SelectCount = datas.SelectCount
          this.UnSelectCount = datas.UnSelectCount
          this.pagination.total = datas.TotalRecords
          this.getTotal()
          this.datatable = []
          this.columns = []
          this.columns = [
            {
              title: ' ',
              dataIndex: 'Icon',
              scopedSlots: { customRender: 'IconRender' },
              className: 'table-pic',
              width: 18,
              fixed: 'left'
            }, {
              title: '姓名',
              dataIndex: 'FullName',
              scopedSlots: { customRender: 'FullNameRender' },
              width: 150,
              fixed: 'left'
            }, {
              title: '用户名',
              dataIndex: 'UserName',
              scopedSlots: { customRender: 'UserNameRender' },
              fixed: 'left'
            }, {
              title: '性别',
              dataIndex: 'SexName',
              width: 80
            }, {
              title: '行政班',
              dataIndex: 'ClassName',
              scopedSlots: { customRender: 'ClassNameRender' }
            }
          ]
          for (let i = 0; i < datas.Courses.length; i++) {
            this.columns.push({
              title: datas.Courses[i].Name,
              dataIndex: 'result' + i,
              // scopedSlots: { customRender: 'result' + i },
              width: 130
            })
          };
          this.columns.push({
            title: '操作',
            dataIndex: 'opera',
            scopedSlots: { customRender: 'operaRender' },
            width: 120,
            fixed: 'right'
          })
          let resData = datas.Result
          for (let j = 0; j < resData.length; j++) {
            if (resData[j].Courses.length > 0) {
              for (let k = 0; k < resData[j].Courses.length; k++) {
                resData[j]['result' + k] = resData[j].Courses[k].Name
              }
            };
            this.$set(resData[j], 'key', j)
          }
          this.datatable = resData
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
      FromSubmit () {
        this.pagination.current = 1
        this.loadTable()
      },
      // 单击删除单个内容触发
      del (row) {
        let that = this
        if (that.isOperation === 0) {
          that.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除"' + row.FullName + '"吗？',
            async onOk () {
              let params = {
                ClassTableID: that.classTableID,
                StudentID: row.StudentID,
                CollectionID: that.collectionID
              }
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/MovingClassStudentAchievement/DeleteCollectionStudent`, params)
              if (res.success) {
                if (that.pageList > 1) {
                  that.pageList = that.pageList - 1
                } else {
                  if (that.pagination.current > 1) {
                    that.pagination.current = that.pagination.current - 1
                  }
                }
                that.xy.msgSuc('删除成功。')
                that.loadTable()
              }
            }
          })
        }
      },
      // 批量删除
      delAlls () {
        let that = this
        if (that.selectionAll.length < 1) {
          that.xy.msgError('请勾选要删除的学生。')
        } else {
          let studentIDs = ''
          if (that.selectionAll.length === 1) {
            for (let i = 0; i < that.selectionAll.length; i++) {
              studentIDs += that.selectionAll[i].StudentID
            }
          } else {
            for (let i = 0; i < that.selectionAll.length; i++) {
              studentIDs += that.selectionAll[i].StudentID + ','
            }
          }
          that.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除所选的学生吗？',
            async onOk () {
              let params = {
                ClassTableID: that.classTableID,
                StudentIDs: studentIDs,
                CollectionID: that.collectionID
              }
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/MovingClassStudentAchievement/DeleteCollectionStudentByIds`, params)
              if (res.success) {
                if (that.selectionAll.length === that.pageList && that.pagination.current > 1) {
                  that.pagination.current = that.pagination.current - 1
                }
                that.xy.msgSuc('删除成功。')
                that.loadTable()
                that.selectionAll = []
                that.selectedRowKeys = []
              }
            }
          })
        };
      },
      // 清除全部学生
      clearSubmit () {
        let that = this
        that.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要清除所有学生吗?',
          async onOk () {
            let params = {
              ClassTableID: that.classTableID,
              CollectionID: that.collectionID
            }
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/MovingClassStudentAchievement/DeleteAllCollectionStudent`, params)
            if (res.success) {
              that.xy.msgSuc('删除成功。')
              that.loadTable()
              that.selectionAll = []
              that.selectedRowKeys = []
            }
          }
        })
      },
      async getAdjustSub (row) {
        // 课 CP  层 CL
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassSubjectSetting/GetSettingList?classTableID=${this.classTableID}`, null)
        if (res.success) {
          let datas = res.data.Result
          datas.map((item) => {
            item.checked = false
            item.disabled = item.Childrens.length > 0
            if (item.Childrens.length > 0) {
              item.Childrens.map((t) => {
                t.checked = false
                t.disabled = false
              })
            }
          })
          this.list = datas
        }
      },
      // 选中的调整
      adjust (row) {
        this.adjustSubmodal = true
        this.StudentID = row.StudentID
        // 默认勾选
        if (row.Courses.length > 0) {
          row.Courses.map((item) => {
            this.list.map((j) => {
              if (j.Childrens.length > 0) {
                j.Childrens.map((k) => {
                  if (item.AID === k.ThisID && item.Type === k.ThisType) {
                    k.checked = true
                    k.disabled = false
                  }
                })
              } else {
                if ((item.AID === j.ThisID && item.Type === j.ThisType) && (item.AID && item.Type)) {
                  j.checked = true
                }
              }
            })
          })
        }
      },
      cancel () {
        this.adjustSubmodal = false
        this.list.map((item) => {
          item.checked = false
          item.disabled = item.Childrens.length > 0
          if (item.Childrens.length > 0) {
            item.Childrens.map((t) => {
              t.checked = false
              t.disabled = false
            })
          }
        })
      },
      // -----------------调整选课弹窗-------------------

      chooseLayered (item, index, t) {
        if (t.checked) {
          this.list[index].Childrens.map((k) => {
            k.disabled = true
            k.checked = false
            if (k.ThisID === t.ThisID) {
              k.disabled = false
              k.checked = true
            }
          })
        } else {
          this.list[index].Childrens.map((k) => {
            k.disabled = false
            k.checked = false
          })
        }
        this.list.splice(0, 0)
      },
      // 确定调整
      async sureAdjust () {
        let arr = []
        this.list.map((item) => {
          if (item.checked) {
            arr.push({
              CoursePlanID: item.CoursePlanID,
              AID: item.ThisID,
              Type: item.ThisType
            })
          } else if (item.Childrens.length > 0) {
            item.Childrens.map((t) => {
              if (t.checked) {
                arr = arr.concat({
                  CoursePlanID: t.CoursePlanID,
                  AID: t.ThisID,
                  Type: t.ThisType
                })
              }
            })
          }
        })
        let params = {
          'StudentID': this.StudentID,
          'ClassTableID': this.classTableID,
          'Datas': arr
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassStudentAchievement/EditStudentSelectCourse`, params)
        if (res.success) {
          this.loadTable()
          this.getAdjustSub()
          this.cancel()
        }
      },
      selectSub () {
        if (this.isOperation === 0) {
          this.modalCreate = true
        }
      },
      getTotal () {
        this.checktotal = this.SelectCount
        this.unTotal = this.UnSelectCount
        this.$parent.getGeneralFlows()
      },
      async getCollectionID () {
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTable/GetClassTable`, params)
        if (res.success) {
          let result = res.data
          this.collectionID = result.CollectionID
          this.schoolDistrictIDGoClass = result.SchoolDistrictID
          this.getPlan()
        }
      },
      async getPlan () {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectProgramme/GetLayeredSelectProgrammeListByID?schoolID=${this.schoolDistrictIDGoClass}&sgsyID=0`, null)
        if (res.success) {
          this.planlData = []
          // if (resObj != '' && resObj != undefined) { //编辑
          //   this.formValidateOK.planName = this.rowObj.planName;
          // }
          if (res.data.length > 0) {
            for (const item of res.data) {
              this.planlData.push({
                value: item.LayeredSelectProgrammeID,
                tvalue: item.LayeredSelectRotationID,
                label: item.LayeredSelectProgrammeName
              })
            }
            this.formValidateOK.planName = res.data[0].LayeredSelectProgrammeID
          } else {
            this.formValidateOK.planName = ''
          }
        }
      },
      schoolChange (value) {
        this.formValidateOK.school = value
        this.getStudentGrade()
      },
      gradeYearChange () {
        this.getPlan()
      },
      // 批量删除触发
      delAll () {
        if (this.isOperation === 0) {
          this.delAlls()
        }
      },

      // 课程设置
      subjectSet () {
        this.$store.commit('common/getParam', { pro: 'classTableOrder', step: 2 }) // 要返回的路由
        this.$router.push({
          path: 'classSet',
          query: this.$store.state.common.menuInfo
        })
      },
      // 获取所有的班级
      async getClass () {
        let params = {
          classTableID: this.classTableID,
          isComplete: this.selectNum
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassStudentAchievement/GetClassList`, params)
        if (res.success) {
          if (res.data.length > 0) {
            res.data.map((item) => {
              item.checked = false
            })
            this.moreClassList[0].levelList = res.data
          }
        }
      },
      async quote (RotationID) {
        let params = {
          layeredSelectProgrammeID: this.formValidateOK.planName,
          layeredSelectRotationID: RotationID,
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassSubjectSetting/QuoteLayeredSelectProgramme`, params)
        if (res.success) {
          this.xy.msgSuc('引用成功。')
          this.loading = false
          this.modalCreate = false
          this.loadTable()
          this.getAdjustSub()
          this.getClass()
          this.$parent.getGeneralFlows()
        }
      },
      save () {
        this.loading = true
        this.$refs.formValidateOK.validate((valid) => {
          if (!valid) {
            this.loading = false
            return this.loading
          } else {
            let RotationID = ''
            this.planlData.map((item) => {
              if (item.value === this.formValidateOK.planName) { RotationID = item.tvalue }
            })
            this.quote(RotationID)
          }
        })
      },
      // 导出
      exportFile () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/MovingClassStudentAchievement/ExportSelectCourse`, {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          SeachText: this.searchText,
          StudentOrganizationIDS: this.classOrganizationIDs,
          ClassTableID: this.classTableID,
          Completetype: this.selectNum
        })
      },
      more (res) {
        if (res === '1') {
          if (this.isOperation === 0) { // 添加学生
            // this.openAddModal()
            // this.addStudent()
            this.delAll()// 删除学生
          }
        } else if (res === '2') {
          this.$store.commit('common/getParam', { pro: 'classTableOrder', step: 2 }) // 要返回的路由
          this.$router.push({
            path: 'studentScore',
            query: this.$store.state.common.menuInfo
          })
        } else if (res === '3') {
          if (this.isOperation === 0) {
            this.clearSubmit()
          }
        } else if (res === '4') {
          this.exportFile()
        }
      },
      // 未选课提醒
      async noChooseClassRemind () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/SenUnselectedMessage?id=`, null)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('提醒成功。')
        }
      },
      // 添加学生
      addStudent () {
        this.checkAllList = []
        this.apiData = {
          url: `${this.$store.state.apiPath}/api/ClassTable/GetClassTableStudent`,
          type: 'get',
          params: { classTableID: this.classTableID }
        }
        this.isShow = true
      },
      selectCancel () {
        this.checkAllList = []
        this.isShow = false
      },
      async selectConfirm (data) {
        this.xy.loading()
        this.checkAllList = [...data]
        let tutorArr = []
        for (let i = 0; i < this.checkAllList.length; i++) {
          tutorArr.push({
            ClassTableID: this.classTableID,
            CollectionID: this.collectionID,
            StudentID: this.checkAllList[i].id,
            StudentOrganizationID: this.checkAllList[i].studentOrganizationID
          })
        };

        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassStudentAchievement/CreateCollectionStudent`, tutorArr)
        if (res.success) {
          this.xy.msgSuc('添加成功。')
          this.loadTable()
          this.getClass()
        }
        this.isShow = false
        this.xy.unloading()
      },
      // ------------------------筛选班级start------------------------------------
      filterClass () {
        this.classModal = true
      },
      // 筛选班级
      sureSelectedClass () {
        this.showClass = []
        this.classOrganizationIDs = []
        this.moreClassList.map((item) => {
          if (item.checkAllGroup.length > 0) {
            this.classOrganizationIDs = this.classOrganizationIDs.concat(item.checkAllGroup)
            item.levelList.map((t) => {
              if (t.checked) {
                this.showClass.push(t)
              }
            })
          }
        })
        this.classModal = false
        this.loadTable()
      },
      // 筛选班级-----------全选
      chooseAll (item, index) {
        if (this.moreClassList[index].checked) {
          let arr = []
          this.moreClassList[index].levelList.map((item) => {
            item.checked = true
            arr.push(item.StudentOrganizationID)
          })
          this.moreClassList[index].checkAllGroup = arr
        } else {
          this.moreClassList[index].checkAllGroup = []
          this.moreClassList[index].levelList.map((item) => {
            item.checked = false
          })
        }
      },
      // 单个改变
      checkAllGroupChange (index) {
        if (this.moreClassList[index].checkAllGroup.length === this.moreClassList[index].levelList.length) {
          this.moreClassList[index].checked = true
        } else {
          this.moreClassList[index].checked = false
        }
        this.moreClassList[index].levelList.map((item) => {
          item.checked = false
          this.moreClassList[index].checkAllGroup.map((t) => {
            if (item.StudentOrganizationID === t) {
              item.checked = true
            }
          })
        })
      },
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
  @import '../../css/progress.less';
</style>
