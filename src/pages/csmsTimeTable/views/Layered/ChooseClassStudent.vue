<!-- 2.选课学生 -->
<template>
  <div class="xy-content-module"
       id="StepsHeader">
    <div class="xy-content-title clearfix">
      <div class="fl">
        <Button class="xy-primary"
                @click="goSelectTeacher"
                :disabled="layeredStepsHeader.isOperation != 0">添加学生</Button>
        <Button class='xy-danger'
                @click="delBatch"
                :disabled="layeredStepsHeader.isOperation != 0"
                style="margin-right:10px">批量删除</Button>
        <Button class='xy-danger'
                @click="delAll"
                :disabled="layeredStepsHeader.isOperation != 0">全部删除</Button>
      </div>
      <div class="fr pr">
        <Button class="xy-info fl"
                @click="filterClass">筛选班级</Button>
        <i-input search
                 v-model.trim="searchText"
                 @on-search="FromSubmit"
                 placeholder="请输入用户名/学籍号/姓名"
                 clearable
                 style="width: auto;">
          <icon type="ios-search cursor-p"
                slot="suffix" />
        </i-input>
      </div>
    </div>
    <div class="xy-content-body">
      <div class='choose-class'
           v-if="showClass.length > 0">
        <Alert show-icon
               closable> <span> 已选择班级：</span><span v-for="(i, index) in showClass"
                :key='index'>{{ i.StudentOrganizationFullName
          }}{{ index === showClass.length - 1 ? "" : "、" }}</span>。</Alert>
      </div>
      <XyAntTable :rowSelection="tableRowSelection"
                  :columns="columnss"
                  :dataSource="dataTable"
                  :nullData="nullData"
                  :tableLoading="tableLoading"
                  :pagination="pagination"
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
          <div style="min-width:120px">
            {{record.FullName}}
          </div>
        </div>
        <div slot="UserName"
             slot-scope="text, record">
          <div style="min-width:100px">
            {{record.UserName}}
          </div>
        </div>
        <div slot="SexName"
             slot-scope="text, record">
          <div style="min-width:80px">
            {{record.SexName}}
          </div>
        </div>
        <div slot="StudentOrganizationFullName"
             slot-scope="text, record">
          <div style="min-width:100px">
            {{record.StudentOrganizationFullName}}
          </div>
        </div>
        <span slot="oprateRender"
              slot-scope="text, record">
          <a :disabled="layeredStepsHeader.isOperation!==0"
             @click="del(record)">删除</a>
        </span>
      </XyAntTable>
      <!-- 筛选班级 -->
      <modal v-model="classModal"
             class="selectResultModal"
             :transfer="false"
             title="筛选班级"
             :mask-closable="false"
             width="550">
        <div v-if='classData.length>0'>
          <Checkbox :indeterminate="indeterminate"
                    :value="checkedAll"
                    @click.prevent.native="handleCheckAllClass">全选</Checkbox>
          <CheckboxGroup v-model="checkedID"
                         @on-change="checkAllGroupChange"
                         style="margin-top: 10px;">
            <Checkbox style="padding: 10px 0 10px 0;"
                      v-for="item in classData"
                      :label="item.StudentOrganizationID"
                      :key="item.StudentOrganizationID"> {{ item.StudentOrganizationFullName }}({{ item.StuCount }}人)</Checkbox>
          </CheckboxGroup>
        </div>
        <div v-else
             class="no-data-modal">
          <img src="@/assets/common/nullData.svg"
               alt="图片" />
          <p class="no-class">
            您还没有班级的信息，请添加班级。
          </p>
        </div>

        <div slot="footer">
          <Button class="xy-modal-close"
                  @click="classModal = false">取消</Button>
          <Button class="xy-modal-primary"
                  shape="circle"
                  @click="sure">保 存</Button>
        </div>
      </modal>
      <!--全部删除 -->
      <modal v-model="modalClear"
             :transfer="false"
             :mask-closable="false">
        <p slot="header">全部删除</p>
        <p style="margin-bottom:5px;font-size:14px;">
          请输入“<span style="color:#ed4014">删除</span>”二字来确认删除全部学生。
        </p>
        <div>
          <i-input v-model="clearText"
                   placeholder="请输入“删除”进行确认"></i-input>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close"
                  @click="modalClear = false">取消</Button>
          <Button class="xy-modal-primary"
                  shape="circle"
                  @click="clearSubmit">确定</Button>
        </div>
      </modal>

      <SelectStudent :isShow="isShow"
                     :apiData="apiData"
                     @select-cancel="selectCancel"
                     @select-confirm="selectConfirm">
      </SelectStudent>
    </div>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import SelectStudent from '@/pages/csmsTimeTable/components/selectStudent/CheckboxSelectStudent.vue'
  export default {
    components: {
      XyAntTable,
      SelectStudent
    },
    data () {
      return {
        // 选择学生
        isShow: false, // modal默认false
        apiData: {}, // 已经添加过的学生
        checkAllList: [], // 获取子组件选中的数据

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
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },

        columnss: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 18,
            scopedSlots: { customRender: 'Icon' },
            className: 'table-pic'
          },
          {
            title: '姓名',
            scopedSlots: { customRender: 'FullName' }
          },
          {
            title: '用户名',
            scopedSlots: { customRender: 'UserName' }
          },
          {
            title: '性别',
            scopedSlots: { customRender: 'SexName' }
          },
          {
            title: '班级',
            scopedSlots: { customRender: 'StudentOrganizationFullName' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            width: 80,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        dataTable: [],
        pageList: 0, // 当前页数据条数
        selectionAll: [], // 选中的学生

        searchText: '',
        // 清除选课结果
        modalClear: false,
        clearText: '',
        // 筛选班级
        classModal: false,
        classData: [],
        showClass: [],
        checkedAll: false, // 全选
        indeterminate: false,
        checkedID: [], // 已选择的班级id
        layeredStepsHeader: {},
        image: require('@/assets/common/yrykb.png')
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
    created () { },
    mounted () {
      this.layeredStepsHeader = this.$parent
      this.getTable()
      this.getClass()
    },
    methods: {
      // 添加学生
      goSelectTeacher () {
        this.apiData = {
          url: `${this.$store.state.apiPath}/api/LayeredSelectStudent/GetLayeredStudent`,
          type: 'get',
          params: {
            layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
            layeredSelectRotationID: this.layeredStepsHeader.LayeredSelectRotationID
          }
        }
        this.checkAllList = []
        this.isShow = true
      },
      selectCancel () {
        this.isShow = false
        this.checkAllList = []
      },
      selectConfirm (data) {
        this.isShow = false
        this.checkAllList = [...data] // 获取子组件选中的学生数据
        let tutorArr = []
        if (this.checkAllList.length > 0) {
          for (let i = 0; i < this.checkAllList.length; i++) {
            tutorArr.push({
              StudentGradeForStudentYearID: this.checkAllList[i].studentGradeForStudentYearID,
              StudentOrganizationID: this.checkAllList[i].studentOrganizationID,
              StudentID: this.checkAllList[i].id
            })
          }
          this.xy.loading()
          this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectStudent/Create`, {
            LayeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
            LayeredSelectRotationID: this.layeredStepsHeader.LayeredSelectRotationID,
            Data: tutorArr
          }).then(res => {
            if (res.success) {
              this.xy.msgSuc('添加成功。')
              this.getClass('add')
              this.layeredStepsHeader.getGeneralFlows() // 成功后步骤可以点击
            }
            this.xy.unloading()
          })
        } else {
          this.xy.msgError('请先选择学生。')
        }
      },
      // 获取table/分页数据
      getTable () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectStudent/GetPage`, {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          LayeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
          LayeredSelectRotationID: this.layeredStepsHeader.LayeredSelectRotationID,
          SeachText: this.searchText,
          StudentOrganizationIDS: this.checkedID
        }, true).then(res => {
          if (res.success) {
            if (res.data.Result.constructor === Object) { // 步骤1完成后，第一次返回的res.data.Result为[],
              this.dataTable = res.data.Result.data
              this.dataTable.map((item, index) => {
                this.$set(item, 'key', index)
              })
              this.pagination.total = res.data.Count
              this.pageList = res.data.Result.data ? res.data.Result.data.length : 0
            } else {
              this.dataTable = []
              this.pagination.total = 0
              this.pageList = 0
            }
          }
          this.tableLoading = false
        })
      },
      handleTableChange () {
        this.getTable()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      FromSubmit () {
        this.pagination.current = 1
        this.searchText = this.searchText
        this.getTable()
      },
      // 单击删除单个内容触发
      del (row) {
        if (this.layeredStepsHeader.isOperation === 0) {
          let that = this
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除"' + row.FullName + '"吗？',
            onOk: function () {
              that.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectStudent/Deletes`, {
                LayeredSelectProgrammeID:
                  that.layeredStepsHeader.LayeredSelectProgrammeID,
                LayeredSelectRotationID:
                  that.layeredStepsHeader.LayeredSelectRotationID,
                LayeredSelectStudentID: [row.StudentID]
              }).then(res => {
                if (res.success) {
                  if (that.pageList > 1) {
                    that.pageList = that.pageList - 1
                  } else {
                    if (that.pagination.current > 1) {
                      that.pagination.current = that.pagination.current - 1
                    }
                  }
                  that.checkedID = []
                  that.xy.msgSuc('删除成功。')
                  that.getTable()
                  that.getClass()
                }
              })
            }
          })
        }
      },
      // 全部删除
      delAll () {
        this.clearText = ''
        this.modalClear = true
      },
      // 单击批量删除触发
      delBatch () {
        let that = this
        if (that.selectionAll.length < 1) {
          this.xy.msgW('请勾选要删除的学生。')
        } else {
          let arr = []
          that.selectionAll.map(function (item) {
            arr.push(item.StudentID)
          })
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要批量删除所有选中的学生吗?',
            onOk: function () {
              that.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectStudent/Deletes`, {
                LayeredSelectProgrammeID: that.layeredStepsHeader.LayeredSelectProgrammeID,
                LayeredSelectRotationID: that.layeredStepsHeader.LayeredSelectRotationID,
                LayeredSelectStudentID: arr
              }).then(res => {
                if (res.success) {
                  that.checkedID = []
                  that.xy.msgSuc('删除成功。')
                  if (that.selectionAll.length === that.pageList && that.pagination.current > 1) {
                    that.pagination.current = that.pagination.current - 1
                  }
                  that.getTable()
                  that.getClass()
                  that.selectionAll = []
                }
              })
            }
          })
        }
      },
      clearSubmit () {
        let that = this
        if (this.clearText === '删除') {
          if (this.dataTable.length > 0) {
            this.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectStudent/DeleteAll?layeredSelectProgrammeID=${that.layeredStepsHeader.LayeredSelectProgrammeID}&layeredSelectRotationID=${that.layeredStepsHeader.LayeredSelectRotationID}`
            ).then(res => {
              if (res.success) {
                that.xy.msgSuc('删除成功。')
                that.checkedID = []
                that.getTable()
                that.getClass()
              }
            })
            that.modalClear = false
          } else {
            that.xy.msgError('没有需要删除的结果。')
          }
        } else {
          that.xy.msgError('请输入“删除”来确认删除全部选择。')
        }
      },

      async getClass (val) {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/GetLayeredOrganizationListByID`, {
          layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
          layeredSelectRotationID: this.layeredStepsHeader.LayeredSelectRotationID
        })
        this.checkedID = []
        this.showClass = []
        this.classData = res.data
        if (res.success && res.data.length > 0) {
          res.data.map((item) => {
            this.checkedID.push(item.StudentOrganizationID)
            this.showClass.push(item)
          })
          this.classData = res.data
          if (this.classData.length === 0 || this.checkedID.length === 0) {
            this.checkedAll = false
            this.indeterminate = false
          } else if (this.checkedID.length === this.classData.length) { // 全选
            this.checkedAll = true
            this.indeterminate = false
          } else if (this.checkedID.length > 0) { // 选中其中某一个
            this.checkedAll = false
            this.indeterminate = true
          }
          if (val === 'add') {
            this.getTable()
          }
          return true
        }
      },
      // ------------------------筛选班级start------------------------------------
      async filterClass () {
        // this.xy.loading()
        // let res = await this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/GetLayeredOrganizationListByID`, {
        //   layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
        //   layeredSelectRotationID: this.layeredStepsHeader.LayeredSelectRotationID
        // })
        // if (res.success) {
        //   this.xy.unloading()
        this.classModal = true
        this.checkedID = []
        // this.classData = res.data
        if (this.classData.length > 0) {
          this.showClass.map((item) => {
            this.checkedID.push(item.StudentOrganizationID)
          })
          if (this.classData.length === 0 || this.checkedID.length === 0) {
            this.checkedAll = false
            this.indeterminate = false
          } else if (this.checkedID.length === this.classData.length) { // 全选
            this.checkedAll = true
            this.indeterminate = false
          } else if (this.checkedID.length > 0) { // 选中其中某一个
            this.checkedAll = false
            this.indeterminate = true
          }
        // return res.data
        }
      // }
      },
      sure () {
        this.showClass = []
        for (let i = 0; i < this.classData.length; i++) {
          for (let m = 0; m < this.checkedID.length; m++) {
            if (this.checkedID[m] === this.classData[i].StudentOrganizationID) {
              this.showClass.push(this.classData[i])
            }
          }
        }
        this.classModal = false
        this.pagination.current = 1
        this.getTable()
      },
      // 筛选班级-----------全选
      handleCheckAllClass () {
        if (this.indeterminate) {
          this.checkedAll = false
        } else {
          this.checkedAll = !this.checkedAll
        }
        this.indeterminate = false

        if (this.checkedAll) {
          this.checkedID = []
          this.classData.map(item => {
            this.checkedID.push(item.StudentOrganizationID)
          })
        } else {
          this.checkedID = []
        }
      },
      checkAllGroupChange (data) {
        if (data.length === this.classData.length) {
          this.indeterminate = false
          this.checkedAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.checkedAll = false
        } else {
          this.indeterminate = false
          this.checkedAll = false
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.choose-class {
  display: flex;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  opacity: 0.85;
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
</style>
