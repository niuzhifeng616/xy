
<!-- 4.选课进度 -->
<template>
  <div id="selectResult">
    <XyAntTable
      :columns="columns"
      :dataSource="dataTable"
      :nullData="nullData"
      :tableLoading="tableLoading"
      :pagination="pagination"
      @change="handleTableChange">
        <div slot="IconRender" slot-scope="text, record">
          <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
            <span class="head-font">
              {{ xy.showName(record.FullName)}}
            </span>
          </div>
          <img v-else :src="record.Icon + '?' + Math.random() * 15" style="width:30px;height:30px;border-radius:50%">
        </div>
        <div slot="FullNameRender" slot-scope="text, record" style="min-width:150px">
          {{record.FullName}}
        </div>
        <div slot="UserNameRender" slot-scope="text, record" style="min-width:120px">
          {{record.UserName}}
        </div>
        <div slot="StudentOrganizationFullNameRender" slot-scope="text, record">
          <div v-if="layeredStepsHeader.isOperation !== 1" class="table-el-hover" @click="adjust(record)">
            {{record.StudentOrganizationFullName}}
          </div>
          <div v-else>
            {{record.StudentOrganizationFullName}}
          </div>
        </div>
        <template v-for="(item, index) in coursesList">
          <div :slot="'result' + index" slot-scope="text, record" :key="index">
            <div style="min-width:100px">{{record['result' + index]}}</div>
          </div>
        </template>
      <div slot="operation"
          slot-scope="text, record">
        <a @click="adjust(record)" :disabled="layeredStepsHeader.isOperation === 1">调整</a>
      </div>
    </XyAntTable>
    <modal v-model="modal"
           width=550
           :transfer="false"
           title="调整课程"
           :mask-closable="false">
      <ul style="max-height: 500px;  overflow-y: auto;" v-if='list.length>0'>
        <li v-for='(item,index) in list'
            style="margin: 10px 0"
            :key='index'>
          <checkbox v-model="item.checked"
                    :disabled='item.disabled'
                    @on-change='chooseSub(item,index)'
                    style="display: inline-block;">
            {{item.ObjectName}}</checkbox>
          <checkbox v-model="t.checked"
                    v-for='t in item.Children'
                    @on-change='chooseLayered(item,index,t)'
                    :key='t.ObjectID'
                    :disabled='t.disabled'>
            {{t.ObjectName}}
          </checkbox>
        </li>
      </ul>
      <div v-else class="modal-null">
        <img class="img" src="@/assets/common/nullData.svg" />
        <span class="text">暂无课程。</span>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="cancel">关闭</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="sure">提交</Button>
      </div>
    </modal>

  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    components: { XyAntTable },
    data () {
      return {
        StudentID: '',
        type: null,
        // 已选学生
        SelectCount: 0,
        UnSelectCount: 0,
        tableLoading: false,
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
        dataTable: [],
        columns: [],
        coursesList: [],
        // 已选课程
        totalCrouse: 0,
        dataTableCourse: [],
        checkAll: false,
        checkAllGroup: [],
        // 弹窗--调整
        modal: false,
        list: [{
          ObjectID: -1,
          ObjectName: '',
          checked: false,
          Children: [{
            ObjectID: -1,
            ObjectName: '',
            checked: false,
            disabled: false
          }]
        }],
        Progress: {},
        layeredStepsHeader: {}

      }
    },

    created: function () {
      this.Progress = this.$parent
      this.layeredStepsHeader = this.$parent.$parent
      this.getTable()
    },
    mounted: function () {
      this.getSubjectSettingInfo()
    },
    methods: {
      // 获取选课结果（学生）
      async getTable (valModal) {
        this.tableLoading = true
        let that = this
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/GetPage`, {
          pageIndex: that.pagination.current,
          pageSize: that.pagination.pageSize,
          SeachText: this.Progress.searchText,
          StudentOrganizationIDS: this.Progress.checkedID,
          LayeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
          LayeredSelectRotationID: this.layeredStepsHeader.LayeredSelectRotationID,
          Type: this.Progress.selectNum
        })
        if (res.success) {
          let datas = res.data
          that.SelectCount = datas.SelectCount
          that.UnSelectCount = datas.UnSelectCount
          this.$parent.getTotal({ 'SelectCount': that.SelectCount, 'UnSelectCount': that.UnSelectCount })
          that.pagination.total = datas.Result.totalRecords
          that.dataTable = []
          that.columns = []
          that.columns = [
            {
              title: ' ',
              width: 32,
              dataIndex: 'Icon',
              className: 'set-head-icon',
              scopedSlots: { customRender: 'IconRender' }
            },
            {
              title: '姓名',
              dataIndex: 'FullName',
              scopedSlots: { customRender: 'FullNameRender' }
            },
            {
              title: '用户名',
              dataIndex: 'UserName',
              scopedSlots: { customRender: 'UserNameRender' }
            },
            {
              title: '性别',
              dataIndex: 'SexName',
              width: 80
            },
            {
              title: '行政班',
              dataIndex: 'StudentOrganizationFullName',
              scopedSlots: { customRender: 'StudentOrganizationFullNameRender' },
              width: 150
            }
          ]
          if (!datas.Courses) {
            return false
          }
          for (let i = 0; i < datas.Courses.length; i++) {
            that.columns.push({
              title: datas.Courses[i].SubjectName,
              dataIndex: 'result' + i,
              scopedSlots: { customRender: 'result' + i }
              // width: 100
            })
          };
          that.columns.push({
            title: '操作',
            dataIndex: 'operation',
            width: 80,
            scopedSlots: { customRender: 'operation' },
            fixed: 'right'
          })
          let resData = datas.Result.data
          for (let j = 0; j < resData.length; j++) {
            if (resData[j].Courses.length > 0) {
              this.coursesList = resData[j].Courses
              for (let k = 0; k < this.coursesList.length; k++) {
                resData[j]['result' + k] = this.coursesList[k].Name
              }
            };
          }
          that.dataTable = resData
        // // 调整课程
        // if (valModal) {
        //   that.changeSubjectSelected()
        // }
        } else {
          that.xy.msgError(res.msg)
        }
        this.tableLoading = false
      },
      // 获取所有的课和层
      async  getSubjectSettingInfo () {
        let that = this
        this.list = []
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/GetSubjectSettingInfo`, {
          layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID
        })
        if (res.success) {
          if (res.data.Subinfo) {
            let datas = res.data.Subinfo
            datas.map(function (item) {
              item.checked = false
              item.status = false
              item.disabled = item.Children.length > 0
              if (item.Children.length > 0) {
                item.Children.map(function (t) {
                  t.checked = false
                  t.disabled = false
                  t.status = false
                })
              }
            })
            that.list = datas
          }
        } else {
          that.xy.msgError(res.msg)
        }
      },
      handleTableChange () {
        this.getTable()
      },
      // 选中的调整
      adjust: function (row) {
        this.modal = true
        this.StudentID = row.StudentID
        this.getStudentSelectCourse()
        if (row.Courses.length > 0) {
        // this.selectedFun(row.Courses)
        }
      },
      // 获取所选学生选课的结果，以及将学生已选的课程或层勾选上 。选课规则：当课程（CP）和层（CL）同时存在，学生只能选择层，课程禁选，如果是多个层，每个学生只能选择一个层
      async getStudentSelectCourse () {
        let that = this
        // 让所有的课程和层都没被选中
        that.list.map(function (item) {
          item.checked = false
          item.status = false
          item.disabled = item.Children.length > 0
          if (item.Children.length > 0) {
            item.Children.map(function (t) {
              t.checked = false
              t.disabled = false
              t.status = false
            })
          }
        })

        this.xy.loading()
        let obj = {
          'layeredSelectProgrammeID': this.layeredStepsHeader.LayeredSelectProgrammeID,
          'LayeredSelectRotationID': this.layeredStepsHeader.LayeredSelectRotationID,
          'StudentID': this.StudentID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/GetStudentSelectCourse`, obj)
        if (res.success) {
          let selectCourse = res.data
          for (let i = 0; i < selectCourse.length; i++) {
            for (let j = 0; j < that.list.length; j++) {
              if (selectCourse[i].Type === 'CP' && selectCourse[i].CoursePlanID === that.list[j].ObjectID) { // 课程被选中
                that.list[j].checked = true
                that.list[j].disabled = false
              } else if (selectCourse[i].Type === 'CL' && that.list[j].Children.length > 0) { // 层被选中
                let childrenData = that.list[j].Children
                for (let k = 0; k < childrenData.length; k++) {
                  if (selectCourse[i].AID === childrenData[k].ObjectID) {
                    that.list[j].Children[k].checked = true
                    that.list[j].Children[k].disabled = false
                    break
                  }
                }
              }
            }
          }
          that.list.map(function (t) {
            if (t.Children.length > 0) {
              let isCL = t.Children.some(function (c) {
                return c.checked
              })
              if (isCL) { // 有层被选中，其他层禁选，一个课程下，每个学生只能选择一个层
                t.Children.map(function (t) {
                  if (!t.checked) {
                    t.disabled = true
                  }
                })
              } else { // 没有层被选中，其他层不禁选
                t.Children.map(function (t) {
                  t.disabled = false
                })
              }
            }
          })
        }
        this.xy.unloading()
      },
      cancel: function () {
        this.modal = false
        this.list.map(function (item) {
          item.checked = false
          item.disabled = item.Children.length > 0
          if (item.Children.length > 0) {
            item.Children.map(function (t) {
              t.checked = false
              t.disabled = false
            })
          }
        })
      },
      // -----------------调整选课弹窗-------------------
      // 重新勾选课或层
      selectedFun: function (data) {
        let that = this
        data.map(function (item) {
          that.list.map(function (j, parentIndex) {
            if (j.Children.length > 0) {
              let childrenIndex = -1
              j.Children.map(function (k, index) {
                if (item.AID === k.ObjectID && item.Type === k.ObjectType && (item.AID && item.Type)) {
                  k.checked = true
                  childrenIndex = index
                }
              })

              if (childrenIndex > -1) { // 表示课程下有层被选中，那么其他层都
                j.Children.map(function (k) {
                  if (item.AID !== k.ObjectID || item.Type !== k.ObjectType) {
                    k.checked = false
                    k.disabled = true
                  }
                })
              }
            } else {
              if ((item.AID === j.ObjectID && item.Type === j.ObjectType) && (item.AID && item.Type)) {
                j.checked = true
              }
            }
          })
        })
      },
      chooseSub: function (item, index) {
        if (item.checked) {
          this.selected(item, false, index, 'subject')
        } else {
          this.cancelSelected(item, false, index, 'subject')
        }
      },
      chooseLayered: function (pItem, pIndex, selfItem) {
        if (selfItem.checked) {
          this.selected(selfItem, pItem, pIndex, 'layered')
        } else {
          this.cancelSelected(selfItem, pItem, pIndex, 'layered')
        }
      },
      // 调整成功改变课程和层的勾选状态
      // changeSubjectSelected: function () {
      //   let that = this; let studentCourses = []
      //   if (this.dataTable.length > 0) {
      //     this.dataTable.map(function (item) {
      //       if (item.StudentID === that.StudentID) {
      //         studentCourses = item.Courses ? item.Courses : []
      //         return false
      //       }
      //     })
      //     if (studentCourses.length > 0) {
      //       this.selectedFun(studentCourses)
      //     }
      //   }
      // },
      // 勾选
      async  selected (selfItem, islay, index, type) {
        let that = this
        this.xy.loading()
        let obj = {
          'layeredSelectProgrammeID': this.layeredStepsHeader.LayeredSelectProgrammeID,
          'LayeredSelectRotationID': this.layeredStepsHeader.LayeredSelectRotationID,
          'StudentID': this.StudentID,
          'CoursePlanID': islay ? islay.ObjectID : selfItem.ObjectID, // islay：false，表示选择的课,islay:pItem, 选择层传课的ObjectID;
          'AID': selfItem.ObjectID,
          'Type': selfItem.ObjectType
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/AdjustmentSelectCourse`, obj, true)
        if (res.success) {
          // that.getTable(true)
          that.getStudentSelectCourse()
          that.xy.msgSuc('调整成功。')
        } else {
          // that.getTable(true)
          if (type === 'layered') {
            that.list[index].Children.map(function (t, i) {
              if (t.ObjectID === selfItem.ObjectID) {
                that.list[index].Children[i].checked = false
                that.list[index].Children[i].disabled = false
              }
            })
          } else {
            that.list[index].checked = false
            that.list[index].disabled = false
          }
          that.xy.msgError(res.msg)
        }
        this.xy.unloading()
      },
      // 取消勾选
      async cancelSelected (selfItem, islay, index, type) {
        let that = this
        this.xy.loading()
        let obj = {
          'layeredSelectProgrammeID': this.layeredStepsHeader.LayeredSelectProgrammeID,
          'LayeredSelectRotationID': this.layeredStepsHeader.LayeredSelectRotationID,
          'StudentID': this.StudentID,
          'CoursePlanID': islay ? islay.ObjectID : selfItem.ObjectID,
          'AID': selfItem.ObjectID,
          'Type': selfItem.ObjectType
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/AdjustmentUnSelectCourse`, obj, true)
        if (res.success) {
          // that.getTable(true)
          that.getStudentSelectCourse()
          that.xy.msgSuc('调整成功。')
        } else {
          if (type === 'layered') {
            that.list[index].Children.map(function (t, i) {
              if (t.ObjectID === selfItem.ObjectID) {
                that.list[index].Children[i].checked = true
                that.list[index].Children[i].disabled = false
              }
            })
          } else {
            that.list[index].checked = true
            that.list[index].disabled = false
          }
          that.xy.msgError(res.msg)
        }
        this.xy.unloading()
      },
      async sure () {
        let that = this
        let obj = {
          'layeredSelectProgrammeID': this.layeredStepsHeader.LayeredSelectProgrammeID,
          'LayeredSelectRotationID': this.layeredStepsHeader.LayeredSelectRotationID,
          'StudentID': this.StudentID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/AdjustmentSelectCourseComplete`, obj)
        if (res.success) {
          that.cancel()
          that.getTable()
        }
      }
    }
  }
</script>
<style lang='less' scoped>
</style>
