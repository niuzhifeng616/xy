<template>
  <div class='xy-content-module'>
    <div class='xy-content-title xy-flex xy-between xy-center'>
      <div class="xy-flex xy-center">
        <div class="xy-flex xy-center" v-if="role !==3">
          <label>校区：</label>
          <Cascader
            :data="schoolData"
            @on-change="schoolChange"
            v-model="schoolGrade"
            :clearable="false"
            placeholder="校区/年级/班级"
            style="margin-right:10px;width:260px"
            ></Cascader>
        </div>
        <div class="xy-flex xy-center" v-if="role===3">
          <label>提交状态：</label>
          <Select v-model="SubmitState"
                @on-change="submitChange"
                class="mr-15"
                style="width:200px">
          <Option :value="0" key="01">全部</Option>
          <Option v-for="(item,index) in submitData" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
        </div>
        <div class="xy-flex xy-center" v-if="role===3">
          <label>审批状态：</label>
          <Select v-model="ApprovalState"
                @on-change="approvalChange"
                class="mr-15"
                style="width:200px">
          <Option :value="0" key="01">全部</Option>
          <Option v-for="(item,index) in approvalData" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
        </div>
        <div>
          <Input
            v-model="searchTxt"
            style="width: 224px"
            search
            placeholder="请输入项目名称"
            @on-search="search"
          />
        </div>
      </div>
    </div>
    <div class='xy-content-body'>
      <div class="createBtn" v-if="role === 3">
        <Button class="xy-primary" @click="create">荣誉申报</Button>
      </div>
      <XyAntTable
        :columns="columns"
        :scrollx="'max-content'"
        :data-source="datatable"
        :null-data="nullData"
        :table-loading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <div slot="StudentIcon" slot-scope="text, record">
          <div v-if="!record.Icon" :class="`head-con ${record.SexName === '女' ? 'woman' : 'man'}`">
            <span class="head-font">
              {{ xy.showName(record.StudentName)}}
            </span>
          </div>
          <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
        </div>
        <div slot="StudentName"  slot-scope="text, record">
          <span class="table-el-hover" @click="details(record)">
            {{ record.StudentName}}
          </span>
        </div>
         <!-- 荣誉名称 -->
        <div slot="HonorManagementName" style="min-width:200px" slot-scope="text,record">
          <span class="table-el-hover">
            {{record.HonorManagementName}}
          </span>
        </div>
        <div slot="DateRender"  slot-scope="text, record">
          <span class="table-el-hover">
            {{xy.moment(record.AwardsDate).format('YYYY-MM-DD') }}
          </span>
        </div>
         <div slot="LastDateRender"  slot-scope="text, record">
          <span class="table-el-hover">
            {{record.LastModifyByDate }}
          </span>
        </div>
         <span slot="StateRender" slot-scope="text, record">
          <span v-if="record.SubmitState===1"><i class="iconfont  icon-success">&#xe719;</i>{{record.SubmitStateName}}</span>
          <span v-if="record.SubmitState===2"><i class="iconfont icon-error">&#xe719;</i>{{record.SubmitStateName}}</span>
        </span>
         <span slot="ApprovalRender" slot-scope="text, record">
          <span v-if="record.ApprovalState===1"><i class="iconfont  icon-success">&#xe719;</i>{{record.ApprovalStateName}}</span>
          <span v-if="record.ApprovalState===2"><i class="iconfont icon-error">&#xe719;</i>{{record.ApprovalStateName}}</span>
          <span v-if="record.ApprovalState===3"><i class="iconfont icon-default">&#xe719;</i>{{record.ApprovalStateName}}</span>
        </span>

        <span
          slot="oprate"
          slot-scope="text, record"
        >
          <a @click="details(record)">详情</a>
          <a-divider type="vertical"  v-if="role === 3"/>
          <a-dropdown :trigger="['click']"  v-if="role === 3">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
            <!--
              1、已提交，已通过不可撤回，不可编辑，不可删除，按钮置灰，不可点击

              2、已提交，已拒绝

              不可撤回，可以编辑，不可删除

              重新编辑保存，新增一条记录，重新进入审批流程

              3、已提交，待审批

              可以撤回，可以编辑，可以删除

              重新编辑保存，覆盖原记录，继续等待审批

              4、已撤回，——

              不可撤回，可以编辑，可以删除

              提交后撤回，未进行编辑，审批状态为空，显示横线

              撤回成功后，点击编辑重新提交，新增一条提交记录，状态变更为已提交，待审批，进行审批流程``

            -->
            <!--
              ApprovalState: 1--已通过  2-- 已拒绝  3--待审批
              SubmitState:   1 已提交   2已撤回
            -->
              <a-menu-item @click="edit(record)" :disabled="role === 2 || record.ApprovalState === 1 || (record.ApprovalState === 1&& record.SubmitState === 1 )">
                编辑
              </a-menu-item>
              <a-menu-item  @click="del(record)" :disabled="role === 2 || record.ApprovalState === 1 || (record.ApprovalState === 1&& record.SubmitState === 1 )|| (record.ApprovalState === 2 && record.SubmitState === 1 )">
                删除
              </a-menu-item>
              <a-menu-item @click="cancel(record)" :disabled="role === 2 || record.ApprovalState === 1 || (record.ApprovalState === 1&& record.SubmitState === 1 )|| (record.ApprovalState === 2 && record.SubmitState === 1 ) ||record.SubmitState ===2">
                撤回
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </XyAntTable>
    </div>
    <!-- 右侧详情 -->
    <DrawerDetail
      :show="showDetail"
      :row="row"
      :from="from"
      @loadTable="loadTable"
    />
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import DrawerDetail from './honorDetail'
  export default {
    name: 'honorList',
    components: {
      XyAntTable,
      DrawerDetail
    },
    data () {
      return {
        schoolData: [],
        schoolGrade: [],
        SchoolDistrictID: 0,
        submitData: [
          {
            label: '已提交',
            value: 1
          },
          {
            label: '已撤回',
            value: 2
          }
        ],
        SubmitState: 0,
        approvalData: [
          {
            label: '已通过',
            value: 1
          },
          {
            label: '已拒绝',
            value: 2
          },
          {
            label: '待审批',
            value: 3
          }
        ],
        ApprovalState: 0,
        searchTxt: '',
        // table
        nullData: '该搜索条件下没有结果。',
        columns: [

          {
            title: '学号',
            dataIndex: 'SchoolCardNumber',
            width: 120
          },
          {
            title: '年级',
            dataIndex: 'StudentGradeName',
            width: 120
          },
          {
            title: '班级',
            dataIndex: 'StudentOrganizationName',
            width: 80
          },
          {
            title: '项目名称',
            dataIndex: 'HonorManagementName',
            width: 120
          },
          {
            title: '荣誉类型',
            dataIndex: 'HonorTypeName',
            width: 120
          },
          {
            title: '级别',
            dataIndex: 'LevelName',
            width: 120
          },
          {
            title: '获奖等级',
            dataIndex: 'AwardsLevelName',
            width: 120
          },
          {
            title: '获奖时间',
            dataIndex: 'AwardsDate',
            width: 120,
            scopedSlots: { customRender: 'DateRender' }
          },
          {
            title: '创建时间',
            dataIndex: 'LastModifyByDate',
            width: 220,
            scopedSlots: { customRender: 'LastDateRender' }
          },
          {
            title: '提交状态',
            dataIndex: 'SubmitStateName',
            width: 120,
            scopedSlots: { customRender: 'StateRender' }
          },
          {
            title: '审批状态',
            dataIndex: 'ApprovalStateName',
            width: 100,
            scopedSlots: { customRender: 'ApprovalRender' }
          },
          {
            title: '操作',
            width: 120,
            dataIndex: 'oprate',
            scopedSlots: { customRender: 'oprate' }
          }
        ],
        datatable: [],
        tableLoading: false,
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: current => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        // props
        row: {},
        showDetail: false,
        from: 1,
        role: ''
      }
    },
    created () {
      this.role = this.$store.state.common.userBaseInfo.RoleType
      console.log(this.role)
      if (this.role === 3) {
        this.getData()
        this.columns.splice(0, 3)
      } else {
        this.columns.unshift(
          {
            title: ' ',
            dataIndex: 'StudentIcon',
            width: 60,
            scopedSlots: { customRender: 'StudentIcon' },
            className: 'table-pic'
          },
          {
            title: '姓名',
            dataIndex: 'StudentName',
            scopedSlots: { customRender: 'StudentName' }
          })
        this.getSchool()
      }
    },
    mounted () {},
    methods: {
      // 获取校区
      getSchool () {
        // this.xy.loading()
        // /api/HonorDeclare/GetAllSelected
        this.xy.get(`${this.$store.state.apiPath}/api/HonorDeclare/GetAllSelected`).then(res => {
          res.data.map(item => {
            item.value = item.Value
            item.label = item.Label
            item.children = item.Children
            item.children.map(cItem => {
              cItem.value = cItem.Value
              cItem.label = cItem.Label
              cItem.children = cItem.Children
              cItem.children.map(dItem => {
                dItem.value = dItem.Value
                dItem.label = dItem.Label
                return dItem
              })
            })
            return item
          })
          this.schoolData = res.data
          this.schoolGrade = [this.schoolData[0].value, this.schoolData[0].children[0].value, this.schoolData[0].children[0].children[0].value]
          this.getData()
        })
      },
      // 获取数据
      async getData () {
        this.tableLoading = true
        let params = {
          schoolid: this.schoolGrade[0] ? this.schoolGrade[0] : 0, // 学校id
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          type: 1,
          approvallist: false,
          submitstate: this.role === 2 ? 1 : this.SubmitState, // 提交状态
          approvalstate: this.role === 2 ? 1 : this.ApprovalState, // 审批状态
          orginzationid: this.schoolGrade[2] ? this.schoolGrade[2] : 0,
          studentgradeid: this.schoolGrade[1] ? this.schoolGrade[1] : 0,
          honormanagementname: this.searchTxt
        }
        await this.xy.get(`${this.$store.state.apiPath}/api/HonorDeclare/GetAllHonorList`, params).then(res => {
          if (res.success) {
            this.pagination.total = res.data.totalRecords
            this.datatable = res.data.data
          }
          this.tableLoading = false
        })
      },
      handleTableChange () {
        this.getData()
      },
      // 操作
      // 详情
      async details (row) {
        this.xy.loading()
        await this.xy.get(`${this.$store.state.apiPath}/api/HonorDeclare/GetHonorDeclareDetail?honormanagementID=${row.HonorManagementID}`).then(res => {
          this.showDetail = true
          this.row = res.data
        })
        this.xy.unloading()
        // .this.row = row
      },
      loadTable () {
        this.showDetail = false
      },
      // 撤回
      async cancel (row) {
        this.xy.loading()
        await this.xy.get(`${this.$store.state.apiPath}/api/HonorDeclare/HonorEditBack?honormanagementID=${row.HonorManagementID}`).then(res => {
          this.getData()
          this.xy.msgSuc('撤回成功')
        })
        this.xy.unloading()
      },
      // 编辑
      edit (row) {
        this.$store.commit('common/getThreeMenuName', row.HonorManagementName)
        this.$store.commit('common/getParam', { pro: 'honorList' })
        this.$store.commit('evaluate/changeSelfObj', {
          HonorManagementID: row.HonorManagementID,
          HonorManagementName: ''
        })
        this.$router.push({
          path: '/xyHome/createSelf',
          query: this.$store.state.common.menuInfo
        })
      },
      // 删除
      async del (row) {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/HonorDeclare/DelStudentHonorDeclare?honormanagementID=${row.HonorManagementID}`)
        if (res.success) {
          this.getData()
          this.xy.msgSuc('删除成功')
        }

        this.xy.unloading()
      },
      // 荣誉申报
      create () {
        this.$store.commit('common/getThreeMenuName', '自主申报')
        this.$store.commit('common/getParam', { pro: 'honorList' })
        this.$store.commit('evaluate/changeSelfObj', {
          HonorManagementID: 0,
          HonorManagementName: '',
          isApproal: false
        })
        this.$router.push({
          path: '/xyHome/createSelf',
          query: this.$store.state.common.menuInfo
        })
      },
      // 改变当前页显示的数量
      changePageSize (size) {
        if (this.pageSize !== size) {
          this.pageSize = size
          this.getData()
        }
      },
      // 改变当前页
      changePage (index) {
        if (this.pageIndex !== index) {
          this.pageIndex = index
          this.getData()
        }
      },
      // 筛选条件
      schoolChange (e) {
        this.schoolGrade = e
        this.getData()
      },
      submitChange (e) {
        this.SubmitState = e
        this.getData()
      },
      approvalChange (e) {
        this.ApprovalState = e
        this.getData()
      },
      // 搜索
      search () {
        this.getData()
      }
    }
  }
</script>
<style lang='less' scoped>
.xy-content-module{
  background: #fff;
}
.xy-content-title {
  padding: 20px;
}
.xy-content-body {
  padding: 0 20px;
}
.createBtn {
  margin-bottom: 15px;
}
</style>
