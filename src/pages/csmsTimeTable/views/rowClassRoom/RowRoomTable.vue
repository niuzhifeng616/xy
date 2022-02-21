<template>
 <div class="xy-content-module">
    <div class="xy-content-title">
        <!-- <Alert show-icon closable>为“已发布”的排课方案新排或重排教室。</Alert> -->
        <div class="clearfix">
            <div class="fl">
                <Button class="xy-primary" @click="allRowRoom">共同排教室</Button>
            </div>
            <div class="fr xy-flex">
                <div style="margin-right:15px">
                  <span>校区：</span>
                  <Select v-model="schoolID"
                            @on-change="schoolChange"
                            style="width:200px">
                      <Option v-for="item in schoolData"
                                :value="item.value"
                                :key="item.value"
                                :title="item.title" >{{ item.label }}</Option>
                  </Select>
                </div>
                <div style="margin-right:15px">
                  <span>学年学期：</span>
                  <cascader :data="yearSessionData" :clearable="false" v-model="yearSession" style="width:200px; display:inline-block" @on-change="cascaderChange">
                  </cascader>
                </div>
                <Input search
                        v-model.trim="searchName"
                        @on-search="FromSubmit"
                        placeholder="按排课名称查找"
                        style="width: 200px" />
            </div>
        </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :rowSelection="tableRowSelection"
        :columns="columns"
        :dataSource="datatable"
        nullData="该搜索条件下没有结果。"
        :tableLoading="tableLoading"
        :isPage="false"
        @change="handleTableChange">
        <!-- 排课方案名称 -->
        <div slot="ClassTableNameRender" slot-scope="text, record" style="min-width:400px">
          <span class="table-el-hover" @click="rowRoom(record)">
            {{record.ClassTableName}}
          </span>
        </div>
        <!-- 操作 -->
        <span slot="operaRender" slot-scope="text, record">
          <a @click="rowRoom(record)">去排教室</a>
        </span>
      </XyAntTable>
    </div>
</div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'

  export default {
    name: 'SetRoomTable',
    components: {
      XyAntTable
    },
    data () {
      return {
        searchName: '',
        schoolID: 0,
        schoolData: [],
        yearSessionData: [],
        yearSession: [],

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
        datatable: [],
        columns: [
          {
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            width: 300
          },
          {
            title: '排课方案名称',
            dataIndex: 'ClassTableName',
            scopedSlots: { customRender: 'ClassTableNameRender' }
          },
          {
            title: '操作',
            dataIndex: 'opera',
            scopedSlots: { customRender: 'operaRender' },
            width: 120
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
              disabled: false
            }
          })
        }
      }
    },
    created () {
      // 排教室返回table
      if (Object.keys(this.$store.state.csmstimetable.roomTableGoRowRoom).length > 0) {
        let rowObj = this.$store.state.csmstimetable.roomTableGoRowRoom
        this.schoolID = rowObj.schoolID
        this.yearSession = [rowObj.yearID, rowObj.sessionID]
        this.searchName1 = rowObj.searchName
        // console.log('排教室返回')
        this.$store.commit('csmstimetable/setRoomTableGoRowRoom', {})
      }
    },
    mounted () {
      this.getSchool()
    },
    methods: {
      // 获取校区
      async getSchool () {
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`)
        if (res.success) {
          this.schoolData.push({
            value: 0,
            label: '所有校区'
          })
          res.data.map(item => {
            this.schoolData.push({
              value: item.SchoolDistrictID,
              label: item.SchoolDistrictName.length >= 8 ? `${item.SchoolDistrictName.substr(0, 7)}...` : item.SchoolDistrictName,
              title: item.SchoolDistrictName.length >= 8 ? item.SchoolDistrictName : ''
            })
          })
          if (res.data.length > 0) {
            if (this.schoolID === 0) {
              this.schoolID = res.data[0].SchoolDistrictID
            }
          }
          this.getSessionNodeList()
        }
      },
      // 校区
      schoolChange (val) {
        this.pagination.current = 1
        this.loadTable()
      },
      // 学年学期
      async getSessionNodeList () {
        var that = this
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`)
        if (res.success) {
          that.yearSessionData = res.data
          that.yearSession = []
          var index = that.yearSessionData.map(function (item) { return item.IsCurrent }).indexOf(true)
          if (index !== -1) {
            that.yearSession.push(that.yearSessionData[index].value)
            var index1 = that.yearSessionData[index].children.map(function (item) { return item.IsCurrent }).indexOf(true)
            if (index1 !== -1) {
              that.yearSession.push(that.yearSessionData[index].children[index1].value)
            }
          } else {
            for (var i = 0; i < that.yearSessionData.length; i++) {
              if (that.yearSessionData[i].children.length > 0) {
                that.yearSession = [that.yearSessionData[i].value, that.yearSessionData[i].children[0].value]
                return false
              }
            }
          }
          that.loadTable()
        }
      },
      // 切换学年学期
      cascaderChange (value, selectedData) {
        this.yearSession = value
        this.pagination.current = 1
        this.loadTable()
      },
      // 获取table数据
      async loadTable () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AssignedClassRoom/GetClassTableAll`, {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          searchName: this.searchName,
          schoolDistrictID: this.schoolID,
          academicSessionID: this.yearSession[1]
        })
        if (res.success) {
          this.datatable = res.data
          this.pagination.total = res.data.totalRecords
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
      // 去排教室
      rowRoom (row) {
        this.$store.commit('common/getThreeMenuName', `${row.SchoolDistrictName}-${row.ClassTableName}`)
        this.$store.commit('common/getParam', { pro: 'setRoomTable' }) // 设置“排教室页”顶部返回至“设置教室table页”
        // 跳转至排教室
        this.$router.push({
          path: '/xyhome/rowRoom',
          query: this.$store.state.common.menuInfo
        })

        this.$store.commit('csmstimetable/setRoomTableGoRowRoom', {
          classTableIDs: row.ClassTableID,
          schoolID: this.schoolID,
          yearID: this.yearSession[0],
          sessionID: this.yearSession[1],
          searchName: this.searchName
        })
      },
      // 共同排教室
      allRowRoom () {
        if (this.selectionAll.length > 0) {
          var ids = []
          for (var i = 0; i < this.selectionAll.length; i++) {
            ids.push(this.selectionAll[i].ClassTableID)
          };
          ids = ids.join(',')

          this.$store.commit('common/getThreeMenuName', '共同排教室')
          this.$store.commit('common/getParam', { pro: 'setRoomTable' }) // 设置“排教室页”顶部返回至“设置教室table页”
          // 跳转至排教室
          this.$router.push({
            path: '/xyhome/rowRoom',
            query: this.$store.state.common.menuInfo
          })

          this.$store.commit('csmstimetable/setRoomTableGoRowRoom', {
            classTableIDs: ids,
            schoolID: this.schoolID,
            yearID: this.yearSession[0],
            sessionID: this.yearSession[1],
            searchName: this.searchName
          })
        } else {
          this.xy.msgError('请至少选择一个。')
        }
      }
    }
  }
</script>
<style lang="less" scoped>
/*课程设置*/
.is-not-operation{
    opacity:0.5;
}
.not-operation-select:hover{
    border-color: #dcdee2!important;
}
.crouseSetting .content-list .content-list-ul li span{
    display: inline-block;
    vertical-align: middle;
}
.crouseSetting .content-list{
    width:1000px;
    margin:0 auto 20px;
    padding-bottom: 15px;
    border-bottom: 10px solid #f5f5f5;
}
.crouseSetting .content-list h1{
    font-size:16px;
    font-weight:bold;
    /*border-bottom:1px solid #ddd;*/
}
.crouseSetting .content-list i{
    cursor:pointer;
    color:#2db7f5;
}
/* .crouseSetting .content-list i:hover{ */
    /*color:#ed4014;*/
/* } */
.crouseSetting .content-list-ul li{
    margin:10px 0;
    /*margin-bottom:10px;*/
}
.crouseSetting .subject-name{
    width:100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
    margin-right: 5px;
}
.crouseSetting .select{
    height: 32px;
    width:150px;
    padding-top: -3px;
    border: 1px solid #dcdee2;
    border-radius: 5px;
    color: #515a6e;
    cursor: pointer;
    outline:0;
}
.crouseSetting .select:hover,.crouseSetting .select:focus{
    border-color: #57a3f3;
    border-radius: 5px;
    outline:0;
}
.crouseSetting .selectTeacher{
    width:150px;
    height: 32px;
    line-height:32px;
    padding:0 5px;
    border: 1px solid #dcdee2;
    border-radius: 5px;
    color: #515a6e;
    cursor: pointer;
    display:inline-block;
    text-align:left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align:middle;
    margin-top: -5px;
}
.crouseSetting .selectTeacher i{
    margin-top:8px;
}
.crouseSetting .section-set-text{
    padding-top: 1px;
    margin-right: 15px;
    font-size: 12px;
    color: #888;
}
.crouseSetting .add-class{
    color:#5cadff;
    cursor: pointer;
    font-size:16px;
    margin-left:10px;
}
.modal-crouse{
    max-height:300px;
    overflow-y:scroll;
    padding:10px 0;
    display:flex;
    justify-content:flex-start;
    flex-wrap: wrap;
}
.modal-crouse li{
    cursor: pointer;
    padding: 20px 0;
    color: #4285f4;
    border: 1px solid #d4e4ff;
    overflow: hidden;
    margin: 10px;
    border-radius:8px;
    width: 110px;
    text-align: center;
}
.modal-crouse li:hover{
     color: #fff;
    background-image: -moz-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    background-image: -webkit-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    background-image: -ms-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    text-align: center;
    color: #fff;
    transition: all 0.3s;
}
.modal-crouse .is-active{
    color: #fff;
    background-image: -moz-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    background-image: -webkit-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    background-image: -ms-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    text-align: center;
    color: #fff;
    transition: all 0.3s;
}
/*
   启动课表
*/
.generate-course-results {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: #fff7dd;
    border-radius: 4px;
}
.generate-course-results > .fa {
    color: #df4444;
    line-height: 30px;
    margin-left: 10px;
}
.generate-course-results > .results-notice {
    color: #df4444;
}
.check-list {
    width: 100%;
    min-height: 220px;
}
.check-list li{
    padding:5px 0;
}
.check-list .generate-text{
    font-size:14px;
}
.check-list .ivu-icon{
    font-size:32px;
}
.check-list .ivu-icon-ios-checkmark-circle{
    color:#19be6b;
}
.check-list .ivu-icon-ios-close-circle{
    color:#ed4014;
}
.check-list .fa-spin{
    color:#5cadff;
}
.startCheck{
    max-height:500px;
    overflow-y:scroll;
}
.modal-section-ul{
    display:flex;
    justify-content:flex-start;
    flex-wrap: wrap;
}
.modal-section-ul li{
    cursor: pointer;
    padding: 16px 0;
    color: #4285f4;
    border: 1px solid #d4e4ff;
    overflow: hidden;
    margin: 10px;
    border-radius: 8px;
    width: 96px;
    text-align: center;
}
.modal-section-ul li:hover{
    color: #fff;
    background-image: -moz-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    background-image: -webkit-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    background-image: -ms-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    text-align: center;
    color: #fff;
    transition: all 0.3s;
}
.modal-section-ul .section-active{
    color: #fff;
    background-image: -moz-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    background-image: -webkit-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    background-image: -ms-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    text-align: center;
    color: #fff;
    transition: all 0.3s;
}
</style>
