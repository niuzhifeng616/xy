<!-- 5.优化分班：调整学生 -->
<template>
  <div id="StepsHeader">
    <div class="adjust-header pr">
      <div @click="goBack" class="back pa">
        <i class="iconfont">&#xe6a5;</i>
        <span>返回</span>
      </div>
      <div class="divide-cell">
        <div class="cell-left" style="line-height: 32px;">筛选班级：</div>
        <div class="cell-right">
          <i-select v-model="selectClassID"
                    style="width:150px"
                    @on-change="classChange">
            <i-option v-for="(item,index) in moreClassList"
                      :value="item.DivideClassGenerateCollectionID"
                      :key='index'>{{item.DivideClassGenerateCollectionName}}</i-option>
          </i-select>
        </div>
      </div>
      <div class="divide-cell">
        <div class="cell-left">固定科目：</div>
        <ul class="cell-right">
          <li class="cell-right-li"
              :key='index'
              v-for="(item,index) in classInfoObj.SelectDiscipline">
            <span>{{item}}</span>
          </li>
        </ul>
      </div>
      <div class="divide-cell">
        <div class="cell-left">固定选考总分：</div>
        <ul class="cell-right">
          <li v-if="classInfoObj.SelectDisciplineScore !== null" class="cell-right-li">
            <span>{{classInfoObj.SelectDisciplineScore}}</span>
          </li>
          <li class="cell-right-li"
              v-for="(item,index) in classInfoObj.DisciplineAchievement"
              :key='index'>
            <span>{{item.DisciplineName}}</span>
            <span v-show="item.Score !== null">：{{item.Score}}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="adjust-body">
      <div>
        <Button class="xy-primary"
                :disabled="smartDivideStepsHeader.isOperation !== 0"
                @click="adjustStudent">批量调到</Button>
        <Button class="xy-info"
                :disabled="smartDivideStepsHeader.isOperation !== 0"
                @click="getStudent('fir')">批量调入</Button>
        <Button class="xy-info fr"
                @click="searchMoreFun">更多筛选条件</Button>
        <a-input-search v-model.trim="searchText" placeholder="请输入用户名/学籍号/姓名" allowClear @search='FromSubmit' class="xy-content-title-search fr mr-10" style="width: 250px;" />
      </div>
      <div style="margin-top:16px;">
        <div>
          <XyAntTable :rowSelection="tableRowSelection"
                      :columns="columns"
                      :scrollx="'max-content'"
                      :dataSource="dataTable"
                      nullData="该搜索条件下没有结果。"
                      :tableLoading="tableLoading"
                      :pagination="pagination"
                      @change="handleTableChange">
            <div slot="IconRender" slot-scope="text, record">
              <div v-if="!record.Icon" :class="`head-con ${!record.Sex ? 'woman' : 'man'}`">
                <span class="head-font">
                  {{ xy.showName(record.FullName)}}
                </span>
              </div>
              <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
            </div>
            <span slot="Sex" slot-scope="text, record">{{record.Sex ? '男' : '女'}}</span>
          </XyAntTable>
        </div>
      </div>
    </div>
    <Modal v-model="searchMore"
          :transfer="false"
          title="更多筛选条件"
          :mask-closable="false"
          width="650">
      <div>
        <div class="divide-cell-model">
          <div class="cell-left-model pt-10">性别</div>
          <div class="cell-right-model">
            <checkbox-group v-model="sexId">
              <checkbox class="right-checkbox" label="1">男</checkbox>
              <checkbox class="right-checkbox" label="0">女</checkbox>
            </checkbox-group>
          </div>
        </div>
        <div class="divide-cell-model">
          <div class="cell-left-model">走班科目</div>
          <div class="cell-right-model">
            <checkbox-group v-model="goSubjectId">
              <checkbox class="right-checkbox"
                        :label="item.DisciplineID"
                        :key='index'
                        v-for="(item,index) in classInfoObj.ShiftDisciplinePersonNumber">
                {{item.DisciplineName}}
              </checkbox>
            </checkbox-group>
          </div>
        </div>
        <div class="divide-cell-model">
          <div class="cell-left-model">选科组合</div>
          <div class="cell-right-model">
            <checkbox-group v-model="groupId">
              <checkbox class="right-checkbox"
                        :label="JSON.stringify(item.DisciplineID)"
                        :key='index'
                        v-for="(item,index) in classInfoObj.DisciplineGroupPersonNumber">
                {{item.DisciplineName}}
              </checkbox>
            </checkbox-group>
          </div>
        </div>
        <div class="divide-cell-model">
          <div class="cell-left-model">原行政班</div>
          <div class="cell-right-model">
            <checkbox-group v-model="administrativeId">
              <checkbox class="right-checkbox"
                        :label="item.StudentOrganizationID"
                        :key='index'
                        v-for="(item,index) in classInfoObj.OriginalCollectionPersonNumber">
                {{item.Name}}
              </checkbox>
            </checkbox-group>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="searchMore=false">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="getTable">确定</Button>
      </div>
    </Modal>
    <!-- 批量调到 -->
    <Modal v-model="adjustModal"
          :transfer="false"
          title="批量调整班级"
          :mask-closable="false"
          width="600">
      <div style="height:400px;overflow:auto">
        <div v-if="adjustClassData.length === 0">
          <div class="model table-null">
            <img class="imgs" src="@/assets/common/nullData.svg" alt="图片"/>
            <div class="text">未查询到班级。</div>
          </div>
        </div>

        <div v-else class="adjust-box">
          <div class="adjust-item pr"
              @click="selectAdjustID=item.DivideCollectionID"
              v-for="(item,index) in adjustClassData"
              :key='index'
              :class="selectAdjustID==item.DivideCollectionID?'checked':''">
            <span>{{item.CollectionName}}</span>
            <span v-if='item.Discipline'>({{item.Discipline}})</span>
            <span>{{item.PersonNumber}}人</span>
            <span class="sanjiao"><i class="iconfont">&#xe6a1;</i></span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="adjustModal=false">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="adjustSubmit">确定</Button>
      </div>
    </Modal>
    <!-- 批量调入 -->
    <Modal v-model="adjustModalIn"
          :transfer="false"
          title="批量调入"
          :mask-closable="false"
          width="1000">
      <div class="adjust-model" style="min-height:400px">
        <a-input-search v-model.trim="searchTextIn" placeholder="请输入用户名/学籍号/姓名" allowClear @search='FromSubmitIn' class="xy-content-title-search" style="width:250px; margin:0 0 15px 0;" />
        <div v-if="!tableLoadingIn && dataTableIn.length === 0">
          <div class="model table-null">
            <img class="imgs" src="@/assets/common/nullData.svg" alt="图片"/>
            <div class="text">该搜索条件下没有结果。</div>
          </div>
        </div>
        <XyAntTable v-else :rowSelection="tableRowSelectionIn"
                    :columns="columnsIn"
                    :dataSource="dataTableIn"
                    nullData="该搜索条件下没有结果。"
                    :tableLoading="tableLoadingIn"
                    :isPage="false"
                    :isScroll="true"
                    :scrollx="'max-content'">
          <div slot="IconRenderIn" slot-scope="text, record">
            <div v-if="!record.Icon" :class="`head-con ${!record.Sex ? 'woman' : 'man'}`">
              <span class="head-font">
                {{ xy.showName(record.FullName)}}
              </span>
            </div>
            <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
          </div>
          <span slot="SexIn" slot-scope="text, record">{{record.Sex ? '男' : '女'}}</span>
        </XyAntTable>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="adjustInCancel">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="adjustInSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    name: 'AdjustStudents',
    components: { XyAntTable },
    data () {
      return {
        selectionAll: [],
        searchText: '',
        selectedRowKeys: [],
        tableLoading: false,
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
        pageList: 0, // 每页显示的条数
        dataTable: [],
        columns: [],
        // 筛选条件
        selectClassID: 0, // 当前班级ID
        moreClassList: [], // 班级
        classInfoObj: {}, // 班级详细信息
        sexId: ['0', '1'], // 性别
        goSubjectId: [], // 走班科目
        groupId: [], // 组合
        administrativeId: [], // 原行政班

        searchMore: false,

        // 调整学生弹框
        adjustModal: false,
        adjustClassData: [],
        selectAdjustID: 0,
        smartDivideStepsHeader: {},

        // 调入
        adjustModalIn: false,
        tableLoadingIn: false,
        dataTableIn: [],
        columnsIn: [],
        searchTextIn: '',
        selectionAllIn: [],
        selectedRowKeysIn: []
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
              disabled: false
            }
          })
        }
      },
      // 批量调入 选择
      tableRowSelectionIn () {
        const { selectedRowKeysIn } = this
        return {
          selectedRowKeysIn,
          onChange: this.onTableSelectChangeIn,
          getCheckboxProps: record => ({
            props: {
              disabled: false
            }
          })
        }
      }
    },
    created () {
      if (this.$route.query.id !== undefined) {
        this.selectClassID = Number(this.$route.query.id)
      }
      this.smartDivideStepsHeader = this.$parent
      this.getClass()
    },
    methods: {
      // 获取所有的班级
      async getClass () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetDivideClassCollection`, {
          divideClassID: this.smartDivideStepsHeader.divideClassID
        }, true)
        if (res.success) {
          if (res.data.length > 0) {
            this.moreClassList = res.data
            this.getCollectionInfo()
          } else {
            this.xy.unloading()
          }
        } else {
          this.xy.msgError(res.msg)
          this.xy.unloading()
        }
      },
      classChange () {
        this.getCollectionInfo()
      },
      // 获取班级信息
      async getCollectionInfo () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetAdjustStudentCollectionInfo`, {
          divideClassID: this.smartDivideStepsHeader.divideClassID,
          divideCollectionID: this.selectClassID
        })
        if (res.success) {
          let resData = res.data
          this.classInfoObj = resData
          this.goSubjectId = []
          resData.ShiftDisciplinePersonNumber.map((item) => {
            this.goSubjectId.push(item.DisciplineID)
          })
          this.groupId = []
          resData.DisciplineGroupPersonNumber.map((item) => {
            this.groupId.push(JSON.stringify(item.DisciplineID))
          })
          this.administrativeId = []
          resData.OriginalCollectionPersonNumber.map((item) => {
            this.administrativeId.push(item.StudentOrganizationID)
          })
          this.getTable()
        }
        this.xy.unloading()
      },
      // 学生
      async getTable () {
        this.searchMore = false // 弹框关闭
        this.tableLoading = true
        this.selectionAll = []
        this.selectedRowKeys = []
        let arr = []
        if (this.groupId.length > 0) {
          this.groupId.map(item => {
            if (item !== '[]') {
              arr.push(JSON.parse(item))
            }
          })
        }
        let sexIdArr = []
        if (this.sexId.length > 0) {
          this.sexId.map(item => {
            sexIdArr.push(parseInt(item))
          })
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetAdjustStudentCollectionStudents`, {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          DivideClassID: this.smartDivideStepsHeader.divideClassID,
          DivideCollectionID: this.selectClassID,
          Sex: sexIdArr,
          ShiftDiscipline: this.goSubjectId,
          GroupDiscipline: arr,
          StudentOrganizationIDs: this.administrativeId.join(','),
          Name: this.searchText
        })
        this.tableLoading = false
        // this.xy.unloading()// ???
        if (res.success) {
          let resData = res
          this.pagination.total = resData.data.totalRecords
          this.pageList = resData.data.data.length

          this.dataTable = []
          this.columns = []
          this.columns = [
            {
              title: ' ',
              dataIndex: 'Icon',
              scopedSlots: { customRender: 'IconRender' },
              className: 'table-pic',
              width: 48,
              fixed: 'left'
            },
            {
              title: '姓名',
              dataIndex: 'FullName',
              width: 150,
              fixed: 'left'
            },
            {
              title: '用户名',
              dataIndex: 'UserName',
              width: 150,
              fixed: 'left'
            },
            {
              title: '性别',
              dataIndex: 'Sex',
              scopedSlots: { customRender: 'Sex' },
              width: 80
            },
            {
              title: '原行政班',
              dataIndex: 'StudentOrganizationName',
              width: 150
            },
            {
              title: '选课组合',
              dataIndex: 'SelectDiscipline',
              width: 150

            },
            {
              title: '走班课程',
              dataIndex: 'ShiftDiscipline',
              width: 150

            }
          ]
          for (let i = 0; i < resData.discipline.length; i++) {
            this.columns.push({
              title: resData.discipline[i].DisciplineName,
              dataIndex: 'result' + i,
              width: 100
            })
          };
          for (let j = 0; j < resData.data.data.length; j++) {
            if (resData.data.data[j].DisciplineAchievements.length > 0) {
              for (let k = 0; k < resData.data.data[j].DisciplineAchievements.length; k++) {
                resData.data.data[j]['result' + k] = resData.data.data[j].DisciplineAchievements[k]
              }
            };
          }
          this.dataTable = resData.data.data
        }
      },
      FromSubmit () {
        this.pagination.current = 1
        this.getTable()
      },
      handleTableChange () {
        this.getTable()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      // 更多筛选条件
      searchMoreFun () {
        this.searchMore = true
      },
      // 批量调到-弹框
      async adjustStudent () {
        if (this.selectionAll.length === 0) {
          this.xy.msgError('请先选择要调整的学生。')
          return false
        }
        let ids = []
        this.selectionAll.map((item) => {
          ids.push(item.StudentID)
        })
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetCanAdjustStudentCollection`, {
          DivideClassID: this.smartDivideStepsHeader.divideClassID,
          StudentID: ids
        })
        if (res.success) {
          this.adjustClassData = res.data
          this.adjustModal = true
          this.selectAdjustID = 0
        }
        this.xy.unloading()
      },
      // 批量调到-提交
      async adjustSubmit () {
        if (this.selectAdjustID === 0) {
          this.xy.msgError('请先选择要调整到的班级。')
          return false
        }
        let ids = []
        this.selectionAll.map((item) => {
          ids.push(item.StudentID)
        })
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/AdjustStudent`, {
          DivideClassID: this.smartDivideStepsHeader.divideClassID,
          CurrentDivideCollectionID: this.selectClassID,
          TargetDivideCollectionID: this.selectAdjustID,
          StudentID: ids
        }, true)
        if (res.success) {
          this.xy.msgSuc('调整成功。')
          this.adjustModal = false
          this.getCollectionInfo() // 刷新班级信息+学生
        } else {
          this.xy.msgError(res.msg)
          this.xy.unloading()
        }
      },
      // 批量调入-弹框 (获取学生信息)
      async getStudent (type) {
        if (type === 'fir') {
          this.searchTextIn = ''
        }
        this.dataTableIn = []
        this.selectionAllIn = []
        this.selectedRowKeysIn = []
        this.tableLoadingIn = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetTransferInStudents`, {
          divideClassID: this.smartDivideStepsHeader.divideClassID,
          divideCollectionID: this.selectClassID,
          searchText: this.searchTextIn
        })
        this.tableLoadingIn = false
        if (res.success) {
          this.columnsIn = []
          this.columnsIn = [
            {
              title: ' ',
              dataIndex: 'Icon',
              scopedSlots: { customRender: 'IconRenderIn' },
              className: 'table-pic',
              width: 48
            },
            {
              title: '姓名',
              dataIndex: 'FullName',
              width: 100
            },
            {
              title: '用户名',
              dataIndex: 'UserName',
              width: 150
            },
            {
              title: '性别',
              dataIndex: 'Sex',
              scopedSlots: { customRender: 'SexIn' },
              width: 80
            },
            {
              title: '原行政班',
              dataIndex: 'StudentOrganizationName',
              width: 150
            },
            {
              title: '选课组合',
              dataIndex: 'SelectDiscipline',
              width: 150
            },
            {
              title: '走班课程',
              dataIndex: 'ShiftDiscipline',
              width: 200
            }
          ]
          this.dataTableIn = res.data
          this.adjustModalIn = true
        }
      },
      onTableSelectChangeIn (index, val) {
        this.selectedRowKeysIn = index
        this.selectionAllIn = val
      },
      FromSubmitIn () {
        this.getStudent()
      },
      // 批量调入-提交
      async adjustInSubmit () {
        if (this.selectionAllIn.length === 0) {
          this.xy.msgError('请选择要调入的学生。')
          return false
        }
        let ids = []
        this.selectionAllIn.map((item) => {
          ids.push(item.StudentID)
        })
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/TransferInStudent`, {
          DivideClassID: this.smartDivideStepsHeader.divideClassID,
          DivideCollectionID: this.selectClassID,
          StudentID: ids
        })
        if (res.success) {
          this.xy.msgSuc('调整成功。')
          this.adjustModalIn = false
          this.getCollectionInfo()// 刷新班级信息+学生
          this.selectedRowKeysIn = []
          this.selectionAllIn = []
        } else {
          this.xy.msgError(res.msg)
          this.xy.unloading()
        }
      },
      adjustInCancel () {
        this.adjustModalIn = false
        this.dataTableIn = []
        this.selectedRowKeysIn = []
        this.selectionAllIn = []
      },
      goBack () {
        this.$router.go(-1)
      }
    }

  }
</script>
<style lang='less' scoped>
.back {
  color: #1890ff;
  top: 15px;
  right: 20px;
  cursor: pointer;
  .iconfont {
    margin-right: 5px;
    font-size: 14px;
  }
}
.adjust-header {
  background: #fff;
  padding: 20px;
  margin-bottom: 22px;
}
// 顶部筛选
.divide-cell {
  padding: 8px 0;
  display: flex;
}
.cell-left {
  width: 100px;
  text-align: right;
  color:#666;
  display: inline-block;
}
.cell-right {
  flex: 1;
  margin-left: 12px;
}
.cell-right-li {
  display: inline-block;
  color: #333;
  margin-right: 20px;
  margin-bottom: 4px;
  /*padding: 2px 10px;*/
  cursor: pointer;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
}
// 弹框筛选
.divide-cell-model:first-child .cell-left-model {
  padding-top: 10px;
}
.cell-left-model {
  width: 70px;
  color: #666;
  display: inline-block;
  padding-left: 7px;
  padding: 20px 0 10px 11px;
}
.cell-right-model {
  margin-left: 12px;
}
.right-checkbox {
  color: #333;
  margin-right: 20px;
  margin-bottom: 10px;
}

.adjust-body {
  min-height: 500px;
  background: #fff;
  padding: 20px;
}

.adjust-box{
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}
.adjust-box .adjust-item{
  margin: 4px 20px 16px 0;
  padding: 0 14px;
  height: 40px;
  color: #333;
  border: 1px solid #dddddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.adjust-box .sanjiao {
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
    bottom: -14px;
    color: #fff;
    font-size: 12px;
  }
}
.adjust-box .checked{
  color: #1677FF;
  border: 1px solid #1677ff;
}
.adjust-box .checked .sanjiao{
  border-color: transparent #1677ff #1677ff transparent !important;
}

.model.table-null{
  margin: 50px 0 0;
  text-align: center;
}
.model.table-null .imgs {
  width: 300px;
  margin: 20px 0;
}
.model.table-null .text {
  font-size: 16px;
  width: 400px;
  margin: 0 auto;
  color: #7f7f7f;
}
</style>
