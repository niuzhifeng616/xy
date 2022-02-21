<template>
  <div>
    <div class="crumbs-wrap">
      <div class="crumbs-flex">
        <div>首页</div>
        <!-- &#xe6a9; -->
        <div class="split">&gt;</div>
        <div class="now-name">登录日志</div>
      </div>
      <div class="crumbs-custom">
        <div class="name">登录日志记录</div>
        <div class="back" @click="back">
          <i class="iconfont">&#xe6a5;</i>
          <span>返回首页</span>
        </div>
      </div>
    </div>
    <div class="xy-content-module">
      <div class="xy-content-body">
          <XyAntTable
            :columns="columns"
            :dataSource="datatable"
            :nullData="nullData"
            :tableLoading="tableLoading"
            :pagination="pagination"
            @change="handleTableChange"
            :scrollx="970"
            >
          </XyAntTable>
      </div>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'UserLoginIndex',
    components: {
      XyAntTable
    },
    data () {
      return {
        loadingTable: true,
        tableLoading: true,
        nullData: '该用户没有登录日志的信息。',
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
            this.pageCurrent = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
            this.pageCurrent = 1
            this.pageSize = pageSize
          }
        },
        pageSize: 15, // 每页显示条数
        pageCurrent: 1, // 当前页码
        columns: [{
          title: '浏览器',
          dataIndex: 'Browser'
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
        datatable: []
      }
    },
    created () {
      this.getList()
    },
    methods: {
      handleTableChange () {
        this.getList()
      },
      back () {
        this.$router.go(-1)
      },
      async getList () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.xyApi}/base/api/Users/CurUserLoginPageList`, {
          pageIndex: this.pageCurrent ? this.pageCurrent : 1,
          pageSize: this.pageSize
        })
        this.tableLoading = false
        if (res.success) {
          this.datatable = res.data.data
          this.pagination.total = res.data.totalRecords
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.crumbs-wrap{
  padding:10px 20px 0;
  margin-bottom: 10px;
  background: #fff;
  .crumbs-flex{
    display: flex;
    align-items:center;
    .split{
      margin:0 5px;
    }
    .split-active{
      color:#0877FF;
    }
    .crumbs-icon{
      color:#0877FF;
      margin-right: 5px;
    }
    .now-name{
      color:#0877FF;
    }
  }
  .crumbs-custom{
    display: flex;
    justify-content: space-between;
    padding: 18px 0 5px;
    align-items: center;
    .name{
      font-size: 18px;
      font-weight:700;
      color:rgba(0,0,0,0.75);
    }
    .back{
      cursor: pointer;
      i{
        margin-right:5px;
        font-size: 14px;
        color: #1890FF;
      }
      span{
        color:#1890FF;
      }
    }
  }
}
.pages{
  text-align: right;
  padding:10px 0;
}
</style>
