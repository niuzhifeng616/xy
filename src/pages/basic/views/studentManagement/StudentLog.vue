<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <XyAntTable
        :columns="columns"
        :dataSource="tbData"
        :nullData="noDataText"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scrollx="970"
        >
      </XyAntTable>
    </div>
  </div>

</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'StudentLog',
    components: {
      XyAntTable
    },
    data () {
      return {
        // 传参.
        selectOrgName: '',
        usersModel: {
          'userId': 0,
          'fullName': ''
        },
        // 搜索条件,[返回/编辑成功]之后要传给用户列表的数据
        conditionParame: {},
        noDataText: '该学生没有登录日志的信息。',
        columns: [{
          title: '浏览器',
          dataIndex: 'Browser',
          width: 150
        }, {
          title: '浏览器版本号',
          dataIndex: 'Version'
        }, {
          title: 'IP地址',
          dataIndex: 'InternetIP'
        }, {
          title: '登录时间',
          dataIndex: 'LoginDateName'
        }],
        tbData: [],
        tableLoading: true,
        nullData: '该用户没有登录日志的信息。',
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
        }
      }
    },
    created () {
      if (this.$route.query.userID) {
        this.usersModel.userId = this.$route.query.userID
        this.loadTable()
      }
    },
    methods: {
      // 获取table/分页数据
      async loadTable () {
        this.tableLoading = true
        let params = {
          userId: this.usersModel.userId,
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Student/GetUserLoginPageList`, params, true)
        this.tableLoading = false

        if (res.success) {
          this.tbData = res.data.data
          this.pagination.total = res.data.totalRecords
        } else {
          this.xy.msgError(res.msg)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .fl {
    float: left;
    button {
      margin-right: .5em;
    }
  }
  .fr {
    float: right;
  }
  .pr {
    position: relative;
  }
  .clearfix:after {
    content: "";
    display: table;
    clear: both;
  }
</style>
