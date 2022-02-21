<!-- 评教设置：方案列表 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-title flex-flow">
      <Button class="xy-primary" @click="create">创建方案</Button>
      <div class="title-right">
        <span class="col0-85">校区：</span>
        <Select
          v-model="SchoolDistrictID"
          @on-change="schoolChange"
          class="mr-15"
          style="width:200px"
          >
          <Option :value="0" key="01">所有校区</Option>
          <Option v-for="(item,index) in schoolData" :value="item.SchoolDistrictID" :key="index">{{item.SchoolDistrictName}}</Option>
        </Select>
        <span class="col0-85">学年学期：</span>
        <cascader
          :data="yearSessionData"
          v-model="yearSession"
          :clearable="false"
          @on-change="cascaderChange"
          style="width:200px"
          >
          </cascader>
      </div>
    </div>

    <div class="xy-content-body">
      <XyAntTable
        :columns="columns"
        :dataSource="datatable"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scrollx="'max-content'"
        >
        <div slot="TeachingProjectName" style="min-width:200px" slot-scope="text,record">
          <span class="table-el-hover" @click="evaContent(record)">
            {{record.TeachingProjectName}}
          </span>
        </div>
        <div slot="AcademicYearName"  slot-scope="text,record">
          <span>{{record.AcademicYearName}}</span>
          <span style="margin-left:8px">{{record.AcademicSessionName}}</span>
        </div>
        <div slot="StartDate"  slot-scope="text,record">
          <span>{{xy.moment(record.StartDate).format('YYYY/MM/DD HH:mm') + ' - ' + xy.moment(record.EndDate).format('YYYY/MM/DD HH:mm')}}</span>
        </div>
        <div slot="StatusDescible"  slot-scope="text,record">
              <span v-if="record.StatusDescible === '未开始'"><i class="iconfont icon-default">&#xe719;</i>{{record.StatusDescible}}</span>
              <span v-if="record.StatusDescible === '进行中'"><i class="iconfont icon-info">&#xe719;</i>{{record.StatusDescible}}</span>
              <span v-if="record.StatusDescible === '已结束'"><i class="iconfont icon-end">&#xe719;</i>{{record.StatusDescible}}</span>
        </div>
        <div slot="IsPublished" slot-scope="text, record">
          <a-switch
            checked-children="公布"
            un-checked-children="关闭"
            :default-checked="record.TeachingProjectStatus === 2 && record.IsPublished"
            :disabled="record.TeachingProjectStatus !== 2"
            @change="switchFun(record)"
          />
        </div>
        <span slot="operation" slot-scope="text, record">
          <a @click="evaContent(record)">进入方案</a>
          <a-divider type="vertical" />
          <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item :disabled="record.IsPublished" @click="edit(record)"> 编辑</a-menu-item>
              <a-menu-item :disabled="record.TeachingProjectStatus === 1 || record.IsPublished" @click="delFun(record)">删除</a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </XyAntTable>
      <!-- 创建 -->
      <evaCreat
        v-if="modalCreate"
        @select-cancel="cancel"
        @select-confirm="selectConfirm"
        >
      </evaCreat>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import evaCreat from './EvaCreateClassTable'
  export default {
    name: 'evaSetting',
    components: {
      XyAntTable,
      evaCreat
    },
    data () {
      return {
        modalCreate: false, // 创建、编辑弹框

        pageSize: 15, // 每页显示条数
        pageCurrent: 1, // 当前页码
        pageList: '', // 当前页数据条数
        total: 0,
        datatable: [], // table数据
        SchoolDistrictID: 0,
        schoolData: [],
        yearSession: [],
        yearSessionData: [],
        nullData: '该搜索条件下没有结果。',
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
        columns: [
          {
            title: '方案名称',
            dataIndex: 'TeachingProjectName',
            fixed: 'left',
            scopedSlots: { customRender: 'TeachingProjectName' }
          },
          {
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            width: 150,
            scopedSlots: { customRender: 'SchoolDistrictName' }
          },
          {
            title: '学年学期',
            dataIndex: 'AcademicYearName',
            width: 200,
            scopedSlots: { customRender: 'AcademicYearName' }
          },
          {
            title: '起止时间',
            dataIndex: 'StartDate',
            width: 280,
            scopedSlots: { customRender: 'StartDate' }
          },
          {
            title: '状态',
            dataIndex: 'StatusDescible',
            width: 100,
            scopedSlots: { customRender: 'StatusDescible' }
          },
          {
            title: '是否公布',
            dataIndex: 'IsPublished',
            width: 100,
            scopedSlots: { customRender: 'IsPublished' }
          },
          {
            title: '操作',
            dataIndex: 'operation',
            width: 170,
            scopedSlots: { customRender: 'operation' }
          }
        ]

      }
    },
    created () {
      this.$store.commit('common/getThreeMenuName', '')
      this.getSchool()
    },
    mounted () {

    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      // 获取校区
      async getSchool () {
        // this.xy.loading()
        let res = await this.xy.get(`${this.xyApi + '/base'}/xy/comm/SchoolDistrictList`)
        if (res.success) {
          this.schoolData = res.data
          this.getSessionNodeList()
        }
        // this.xy.unloading()
      },
      schoolChange (value) {
        // this.pageCurrent = 1
        this.pagination.current = 1
        this.SchoolDistrictID = value
        this.loadTable()
      },
      // 学年学期
      getSessionNodeList () {
        var that = this
        that.yearSessionData = [
          {
            'label': '所有学年',
            'value': 0,
            'children': [{
              'value': 0,
              'label': '所有学期',
              'children': []
            }]
          }]
        // this.xy.loading()
        this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`).then(res => {
          if (res.success) {
            that.yearSessionData = that.yearSessionData.concat(res.data)
            that.yearSession = [0, 0]
            // var index = that.yearSessionData.map(function (item) {
            //   return item.IsCurrent
            // }).indexOf(true)
            // if (index !== -1) {
            //   that.yearSession.push(that.yearSessionData[index].value)
            //   var index1 = that.yearSessionData[index].children.map(function (item) {
            //     return item.IsCurrent
            //   }).indexOf(true)
            //   if (index1 !== -1) {
            //     that.yearSession.push(that.yearSessionData[index].children[index1].value)
            //   } else {
            //     that.yearSession = [0, 0]
            //   }
            // } else {
            //   for (var i = 0; i < that.yearSessionData.length; i++) {
            //     if (that.yearSessionData[i].children.length > 0) {
            //       that.yearSession = [that.yearSessionData[i].value, that.yearSessionData[i].children[0].value]
            //       return false
            //     }
            //   }
            // }
            that.loadTable()
          }
          // this.xy.unloading()
        })
      },
      cascaderChange (value) {
        // this.pageCurrent = 1
        this.pagination.current = 1
        this.yearSession = value
        this.loadTable()
      },
      // 获取table/分页数据
      loadTable () {
        // this.xy.loading()
        this.tableLoading = true
        var _this = this
        let obj = {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          schoolDistrictID: _this.SchoolDistrictID,
          AcademicSessionID: _this.yearSession[1]
        }
        this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingProject/GetPage`, obj).then(res => {
          if (res.success) {
            _this.total = res.data.totalRecords
            _this.pagination.total = res.data.totalRecords
            _this.datatable = res.data.data
            _this.pageList = res.data.data.length
            // _this.xy.unloading()
          }
          // _this.xy.unloading()
          this.tableLoading = false
        })
      },
      delFun (row) {
        var _this = this
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除"' + row.TeachingProjectName + '"吗？',
          async onOk () {
            let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/StudentTeachingProject/Delete`, {
              projectID: row.TeachingProjectID
            })
            if (res.success) {
              if (_this.pageList > 1) {
                _this.pageList = _this.pageList - 1
              } else {
                if (_this.pagination.current > 1) {
                  _this.pagination.current = _this.pagination.current - 1
                };
              };
              _this.xy.msgSuc('删除成功。')
              _this.loadTable()
            }
          }
        })
      },
      async switchFun (row) {
        // this.xy.loading()
        let res = await this.xy.post(this.$store.state.apiPath + `/api/StudentTeachingProject/Publish?projectID=${row.TeachingProjectID}&status=${!row.IsPublished}`)
        // this.xy.unloading()
        if (res.success) {
          if (row.IsPublished) {
            this.xy.msgSuc('已关闭。')
          } else {
            this.xy.msgSuc('已开启。')
          }
          this.loadTable()
        }
      },

      // 创建方案
      create () {
        this.modalCreate = true
        this.$store.commit('evaluate/changeEvaRowObj', {})
      },
      // 编辑方案
      edit (row) {
        this.modalCreate = true
        this.$store.commit('evaluate/changeEvaRowObj', row)
      },
      // 取消创建编辑
      cancel () {
        this.modalCreate = false
      },
      // 创建编辑成功
      selectConfirm (data) {
        this.modalCreate = false
        // this.pageCurrent = 1
        this.pagination.current = 1
        this.loadTable()

        // 自动进入方案
        if (!data.IsEdit) {
          this.evaContent(data)
        }
      },

      // 进入方案
      evaContent (row) {
        this.$store.commit('evaluate/changeEvaRowObj', row)
        this.$store.commit('common/getParam', { pro: 'evaSetting' })
        this.$store.commit('common/getThreeMenuName', row.TeachingProjectName)
        this.$router.push({ path: '/xyhome/evaContent', query: this.$store.state.common.menuInfo })
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
.title-right {
  display: flex;
  align-items: center;
}
</style>
