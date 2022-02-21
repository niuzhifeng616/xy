<template>
    <!-- 10.数据核查-可选课程 -->
    <div class="verificationBan">
      <div v-if="isStudentShow">
        <div class="xy-content-title clearfix">
            <div class="fr pr">
                <i-select v-model="sessionStr"
                          @on-change="sessionChange"
                          class="fl xy-content-title-search"
                          style="width:200px">
                    <i-option :value="0" key="01">所有行政班</i-option>
                    <i-option v-for="(item, index) in sessionData" :key="index" :value="item.StudentOrganizationID" >{{ item.StudentOrganizationName }}</i-option>
                </i-select>
                <Input search
                         clearable
                         v-model.trim="searchText"
                         @on-search="FromSubmit"
                        placeholder="请输入用户名/学籍号/姓名"
                         class="fr xy-content-title-search"
                         style="width: auto;" />
            </div>
        </div>
        <div class="xy-content-body">
          <XyAntTable
            :columns="columns"
            :dataSource="datatable"
            :nullData="nullData"
            :tableLoading="tableLoading"
            :pagination="pagination"
            @change="handleTableChange">
            <div slot="Icon"
                    slot-scope="text, record">
                <div v-if="!record.Icon"
                      :class="`head-con ${!record.Sex? 'woman' : 'man'}`">
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
                <div style="min-width:150px" class="table-el-hover"  @click="rowClick(record)">
                  {{record.FullName.replace(/\s/g, '&nbsp;')}}
                </div>
              </div>
              <div slot="UserName"
                    slot-scope="text, record">
                <div style="min-width:150px">
                  {{record.UserName}}
                </div>
              </div>
              <div slot="StudentOrganizationName"
                    slot-scope="text, record">
                <div style="min-width:300px">
                  {{record.StudentOrganizationName}}
                </div>
              </div>
              <div slot="canSelCount"
                    slot-scope="text, record">
                <div>
                  {{record.canSelCount}}
                </div>
              </div>
                <div slot="mustSelCount"
                    slot-scope="text, record">
                <div>
                  {{record.mustSelCount}}
                </div>
              </div>
              <span slot="oprateRender"
                    slot-scope="text, record">
                <a @click="rowClick(record)">查看</a>
              </span>
          </XyAntTable>
        </div>
    </div>
    <div v-else>
        <div class="xy-content-title clearfix">
            <div class="fl">
                <Button class="xy-info" @click="ReturnClick">返回</Button>
            </div>
        </div>
        <div class="xy-content-body" >
            <h1>{{stndent.cjtest}}（{{stndent.UserName}}）的可选/必选课程</h1>
            <div class="week-crouse" v-for="(item, index) in selectCourse" :key="index">
                <h3 ><b>{{item.SubjectCategoryName}}</b></h3>
                <ul class="crouse-ul">
                    <li v-for="(classSub, n) in item.SubjectList" :key="n">
                        <h4 >{{classSub.SubjectName}}</h4>
                        <row>
                            <i-col span="12">
                                <p >{{classSub.TeacherName}}</p>
                            </i-col>
                            <i-col span="12">
                                <p >{{classSub.AmPmName}}</p>
                            </i-col>
                        </row>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'TLVerBan',
    components: {
      XyAntTable
    },
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
        modal_loading: false,
        loading: true,
        svShow: true, // 获取联级菜单的loading动画,默认true
        modalCreate: false, // 创建弹出框默认不展示
        isShowSpin: false, //
        ids: '',
        // antTable
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
        datatable: [],
        columns: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 18,
            scopedSlots: { customRender: 'Icon' },
            className: 'table-pic'
          },
          {
            title: '姓名',
            dataIndex: 'FullName',
            width: 150,
            scopedSlots: { customRender: 'FullName' }
          },
          {
            title: '用户名',
            dataIndex: 'UserName',
            scopedSlots: { customRender: 'UserName' }
          },
          {
            title: '行政班',
            dataIndex: 'StudentOrganizationName',
            scopedSlots: { customRender: 'StudentOrganizationName' }
          },
          {
            title: '可选课程数',
            dataIndex: 'canSelCount',
            width: 130,
            scopedSlots: { customRender: 'canSelCount' }
          },
          {
            title: '已设必选课程数',
            dataIndex: 'mustSelCount',
            width: 140,
            scopedSlots: { customRender: 'mustSelCount' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            width: 80,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        searchText: '',
        sessionStr: 0,
        sessionData: '',
        studentID: '',
        isStudentShow: true,
        selectCourse: [],
        stndent: ''
      }
    },
    created () {
    },
    mounted () {
      this.getCoursePlans()
    },
    methods: {
      // 获取行政班列表
      async getCoursePlans () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GetStudentOrganization`, {
          classTableID: this.classTableID
        })
        if (res.success) {
          this.sessionData = res.data
          this.getSubjects()
        }
      },

      // 学科列表数据
      async getSubjects () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedDataVerification/GetSelectCourseDataStudent`, {
          classTableID: this.classTableID,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          searchText: this.searchText,
          studentOrganizationID: this.sessionStr
        })
        if (res.success) {
          this.pagination.total = res.data.totalRecords
          this.datatable = res.data.data
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.getSubjects()
      },
      // 下拉框选择行政班
      sessionChange () {
        this.pagination.current = 1
        this.getSubjects()
      },
      // 搜索行政班
      FromSubmit () {
        this.pagination.current = 1
        this.getSubjects()
      },
      // 查询学生的课程
      async getSelectCourse (id) {
        this.studentID = id
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedDataVerification/GetSelectCourseDataStudentDetails`, {
          classTableID: this.classTableID,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          studentID: this.studentID
        })
        this.xy.unloading()
        if (res.success) {
          this.isStudentShow = false
          this.selectCourse = res.data
        }
      },

      // 点击列表中的行
      rowClick (val) {
        this.stndent = val
        this.getSelectCourse(val.StudentID)
      },

      // 返回
      ReturnClick () {
        this.isStudentShow = true
      }

    }
  }
</script>
<style lang="less" scoped>

.week-section{
    padding:10px 0;
    border-bottom:5px solid rgba(149,181,255,0.24);
}
.week-name{
    border-bottom:1px solid #eee;
    padding-bottom:10px;
    font-size:16px;
}
.week-name b,.week-crouse h3 b{
    margin-right:10px;
    font-weight:bold
}
.week-crouse{
    margin-top:15px;
}
.week-crouse h3{
    font-size:14px;
}
.crouse-ul{
    display:flex;
    justify-content:flex-start;
    flex-wrap:wrap;
}
.crouse-ul li{
    width:140px;
    height:100px;
    color: #4285f4;
    border: 1px solid #d4e4ff;
    margin: 10px;
    padding:10px;
    border-radius:8px;
    text-align:center;
}
.crouse-ul li h4{
    margin-top:15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.crouse-ul li p{
     overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
