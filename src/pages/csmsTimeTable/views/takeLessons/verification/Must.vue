<template>
    <!-- 10.数据核查-课式冲突 -->
    <div class="verificationMust">
        <div>
            <h1 style="font-size: 24px;">
                课时冲突详情：
            </h1>
        </div>
        <div v-if="isInitial">
            请点击下方“开始查询”按钮查询是否存在课时冲突学生。
            <!--初始loading-->
            <div class="no-data-box isInitital-opacity">
                <!-- <img class="no-data-img" src="@/assets/common/loading.png" /> -->
            </div>
        </div>
        <div v-else>
            <div v-if="isConflict">
                <div class="no-data-box">
                    <img class="no-data-img" src="@/assets/common/nullData.svg" />
                    <span class="no-data-text">无课时冲突。</span>
                </div>
            </div>
            <div v-else>
                <table class="query-table">
                    <thead>
                        <tr>
                            <th>用户名</th>
                            <th>姓名</th>
                            <th>行政班</th>
                            <th>冲突时间</th>
                            <th>冲突课程</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in conflictData" :key="index">
                            <td>
                                <div>
                                    {{item.UserName}}
                                </div>
                            </td>
                            <td>
                                <div>
                                    {{item.FullName}}
                                </div>
                            </td>
                            <td>
                                <div>
                                    {{item.StudentOrganizationFullName}}
                                </div>
                            </td>
                            <td>
                                <div>
                                    {{item.TimeInfo}}
                                </div>
                            </td>
                            <td>
                                <span v-for="(List, n) in item.AidNameList" :key="n">
                                    {{List}}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="text-center mt-20">
            <Button class="xy-btn-primary"
                    style="margin-right:0px"
                    shape="circle"
                    :loading="loading"
                    :disabled="this.isOperation !== 0"
                    @click="startSearchClick">开始查询</Button>
        </div>
  </div>
</template>
<script>
  export default {
    name: 'TLVerMust',
    props: {
      isOperation: {
        type: Number,
        default: 0
      },
      classTableID: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        datatable: [],
        tableNoData: '当前没有排课方案。您可以点击左上角“创建排课”按钮新建一次排课，或者更改右上角校区等查询条件查询其他排课方案',
        modal_loading: false,
        loading: false,
        tableShow: false, // table数据改变时为true，默认false
        svShow: true, // 获取联级菜单的loading动画,默认true
        modalCreate: false, // 创建弹出框默认不展示
        isShowSpin: false, //
        ids: '',
        isInitial: true,
        isConflict: true,
        conflictData: []
      }
    },
    created () {
    },
    mounted () {
    },
    methods: {
      // 数据核查
      async startSearchClick () {
        if (this.isOperation === 0) {
          this.loading = true
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectSchoolBasedDataVerification/GenerateSelectCourseDataCheck?classTableID=${this.classTableID}`)
          this.xy.unloading()
          if (res.success) {
            this.loading = false
            this.isInitial = false
            this.isConflict = true
            this.xy.msgSuc('查询成功。')
          } else {
            this.loading = false
            this.isInitial = false
            this.isConflict = false
            this.conflictData = res.data
          };
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.verificationMust{
    padding-top:20px;
    min-height: 670px;
}
.query-table {
    width: 100%;
    height: 100%;
    overflow: auto;
    border-spacing: 0;
    text-align: center;
}

    .query-table thead tr th {
        background: #f2f3f5;
        border-right: 1px solid #fff;
    }

    .query-table tbody {
        border: 1px solid #eee;
    }

        .query-table tbody tr td:nth-child(1) {
            border-right: 1px solid #eee;
        }

        .query-table tbody tr td:last-child {
            border-right: 1px solid #eee;
        }

    .query-table td, .query-table th {
        border-bottom: 1px solid #eee;
        border-right: 1px solid #eee;
        /*border: 1px solid #eee;*/
        padding: 10px 18px;
    }

    .query-table thead tr th:nth-child(1) {
        border-top-left-radius: 6px;
    }

    .query-table thead tr th:last-child {
        border-top-right-radius: 6px;
        border-right: 0px;
    }

.table-subject {
    width: 150px;
    height: 80px;
    border: 1px solid #ddd;
}

.export-btn {
    position: absolute;
    top: 15px;
    right: 15px;
}

</style>
