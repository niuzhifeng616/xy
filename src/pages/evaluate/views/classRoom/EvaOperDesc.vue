<template>
  <div class="xy-content-module">
    <div class="xy-content-title">
      <Tooltip :content="content" placement="left" max-width="700">
        <span class="i-alert"><Icon type="ios-information-circle" />提示</span>
      </Tooltip>
    </div>
    <div class="xy-content-body">
      <xy-table
        ref="Table"
        :tbColumns="columns"
        :tbData="tbData"
        :total="tbTotal"
        @changePage="changePage"
        @changePageSize="changePageSize"
        :pageSize="pageSize"
        :pageIndex="pageIndex"></xy-table>
    </div>
  </div>
</template>
<script>
  import xyTable from '@/components/table/XyTable'
  const poto = require('@/assets/common/yrykb.png')
  export default {
    components: {
      xyTable
    },
    name: 'EvaOperDesc',
    data () {
      return {
        arrTitle: [
          {
            title: '头像',
            key: 'Icon',
            width: 80,
            align: 'center',
            fixed: 'left',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: !params.row.Icon ? poto : `${this.xyApi}/base${params.row.Icon}?${Math.random() * 15}`
                  },
                  style: {
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%'
                  }
                })
              ])
            }
          }, {
            title: '姓名',
            key: 'StudentName',
            width: 100,
            align: 'center',
            fixed: 'left'
          },
          {
            title: '用户名',
            key: 'UserName',
            width: 100,
            align: 'center',
            fixed: 'left'
          }
        ],
        newArrs: [
          {
            title: '课程得星数',
            key: 'StarNumber',
            width: 110
          },
          {
            title: '课程得分',
            key: 'SumNumber',
            width: 100
          },
          {
            title: '评价人',
            key: 'EvaluationName',
            width: 100
          },
          {
            title: '评价时间',
            key: 'EvaluationTime',
            width: 180
          },
          {
            title: '操作',
            key: '04',
            width: 120,
            fixed: 'right',
            render: (h, params) => {
              return h('div', {
                'class': {
                  oprateList: true
                }
              }, [
                h('a', {
                  'class': {
                    disabled: !JSON.parse(this.$route.query.params).isEdit,
                    oprateBtn1: true
                  },
                  on: {
                    click: () => {
                      if (JSON.parse(this.$route.query.params).isEdit) { this.edit(params.row) }
                    }
                  }
                }, '编辑'),
                h('a', {
                  'class': {
                    disabled: !JSON.parse(this.$route.query.params).isEdit,
                    oprateBtn2: true
                  },
                  on: {
                    click: () => {
                      if (JSON.parse(this.$route.query.params).isEdit) { this.del(params.row) }
                    }
                  }
                }, '删除')
              ])
            }
          }],
        columns: [],
        nums: 0,
        tbData: [],
        tbTotal: 0,
        pageSize: 15,
        pageIndex: 1,
        selectionAll: [],
        content: `1. 每颗星代表X分。数据四舍五入，保留1位小数。
2. 单节课，“一级指标得星数”=某一级指标下的三级指标得星数求和。
3. ”课程得星数“=各一级指标得星数加权求和。“课程得分”=课程得星数*每颗星代表分数。`,
        courseInfo: JSON.parse(this.$route.query.params) // 跳转过来时携带的参数
      }
    },
    created () {
      this.loadTable()
      console.log(this.courseInfo)
      // let nowD = this.xy.moment(new Date()).format('YYYY-MM-DD')
      //   let tD = this.xy.moment(this.courseInfo).format('YYYY-MM-DD')
    },
    methods: {
      // 删除
      del (row) {
        let that = this
        that.$Modal.confirm({
          title: '删除',
          content: '<p>您确认删除本节课对于该学生的评价数据吗？</p>',
          async onOk () {
            let params = {
              listStudentId: row.StudentId,
              configureId: row.StandardSubjectConfigureID,
              baseId: that.courseInfo.ClassTableGenerateBaseID,
              classTableGenerateForStudentId: 0
            }
            that.xy.loading()
            let res = await that.xy.get(`${that.$store.state.apiPath}/api/Evaluation/DeleteEvaluate`, params, true)
            that.xy.unloading()
            if (res.success) {
              that.xy.msgSuc('删除成功')
              that.loadTable()
            } else {
              that.xy.msgError(res.msg)
            }
          }
        })
      },
      // 编辑
      edit (row) {
        this.$store.commit('common/getThreeMenuName', `评价${row.StudentName} ${this.$route.query.menuName}`)
        this.$store.commit('common/getParam', { params: JSON.stringify(Object.assign(this.courseInfo, row)) })
        this.$router.push({
          name: 'CreateEvalu',
          query: this.$store.state.common.menuInfo
        })
      },
      async loadTable () {
        let params = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          baseId: this.courseInfo.ClassTableGenerateBaseID,
          classId: this.courseInfo.classId,
          schoolDistrictId: this.courseInfo.SchoolDistrictID,
          studentGradeForStudentYearId: this.courseInfo.StudentGradeForStudentYearID,
          disciplineId: this.courseInfo.DisciplineID,
          subjectId: this.courseInfo.SubjectID
        }
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/EvaluateDetail/EvaluateDetailPage`, params, true)
        this.xy.unloading()
        if (res.success) {
          let treeData = []
          if (res.data.data[0].ListStandard && res.data.data[0].ListStandard.length > 0) {
            for (let i = 0, len = res.data.data[0].ListStandard.length; i < len; i++) {
              treeData.push({
                title: res.data.data[0].ListStandard[i].StandardName,
                align: 'center',
                children: this.forTwo(res.data.data[0].ListStandard[i].StandardLevelNext)
              })
            }
          }
          this.columns = [...this.arrTitle, ...treeData, ...this.newArrs]
          this.columns = this.xy.setTableColumnsWidth(this, 'Table', this.columns)
          this.tbData = res.data.data[0].UserData
          this.tbTotal = res.data.totalRecords
        } else {
          this.xy.msgError(res.msg)
        }
      },
      forTwo (list) {
        let arrs = []
        if (list !== null && list !== undefined && list.length > 0) {
          for (let i = 0, len = list.length; i < len; i++) {
            arrs.push({
              title: list[i].StandardName,
              align: 'center',
              children: this.forThree(list[i].StandardLevelNext)
            })
          }
        }
        return arrs
      },
      forThree (list) {
        let arrs = []
        if (list !== null && list !== undefined && list.length > 0) {
          for (let i = 0, len = list.length; i < len; i++) {
            arrs.push({
              title: list[i].StandardName,
              key: list[i].WhatColumn,
              align: 'center',
              width: 150
            })
          }
        }
        return arrs
      },
      back () {
        this.$router.back()
      },
      // 改变当前页显示的数量
      changePageSize (size) {
        if (this.pageSize !== size) {
          this.pageSize = size
          this.loadTable()
        }
      },
      // 改变当前页
      changePage (index) {
        if (this.pageIndex !== index) {
          this.pageIndex = index
          this.loadTable()
        }
      }
    }
  }
</script>
<style scoped>
  .xy-content-body >>> .ivu-table  td,
  .xy-content-body >>> .ivu-table th {
      border-bottom: 1px solid #EBEEF5;
      border-right: 1px solid #ebeef5;
  }
  .i-alert{
    cursor: pointer;
    color:#D8D8D8;
  }
  .i-alert i{
      margin-right: 5px;
    }
  .i-alert:hover{
    color:#4196FF;
  }
</style>
