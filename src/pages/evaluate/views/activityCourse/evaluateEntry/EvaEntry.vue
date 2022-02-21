<!-- 评价录入 -->
<template>
  <div class='xy-content-module'>
    <div class='xy-content-body'>
      <div class="left">
        <!-- <XyTable :noDataText="'您还没有学生的信息，请添加学生。'" @changeSelect="changeSelect"
                 :tbColumns="columns"
                 maxHeight1="600"
                 :tbData="dataTable"
                 :isShowPage="false">
        </XyTable> -->
      <XyAntTable
        :columns="columns"
        :dataSource="dataTable"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :rowSelection="tableRowSelection"
        :isPage="false"
        @change="handleTableChange"
        :scrollx="'max-content'"
        >
          <!-- <div slot="StudentIcon" slot-scope="text, record">
            <img style="width:30px;height:30px;border-radius:50%"  :src=" record.StudentIcon == null || record.StudentIcon === '' ? image :  record.StudentIcon + '?' + Math.random() * 15">
          </div> -->
          <div slot="StudentIcon" slot-scope="text, record">
            <div v-if="!record.StudentIcon" class="head-con man">
              <span class="head-font">
                {{ xy.showName(record.StudentFullName)}}
              </span>
            </div>
            <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.StudentIcon + '?' + Math.random() * 15">
          </div>
          <div slot="StudentFullName" style="min-width:100px"  slot-scope="text, record">
              {{record.StudentFullName}}
          </div>
      </XyAntTable>
      </div>
      <div class="right">
        <div class="tree">
          <p class="name">活动指标</p>
          <Tree :data="treeList"
                @on-check-change="pickTarget"
                show-checkbox
                multiple></Tree>
        </div>
      </div>
    </div>
    <div slot="footer"
         class="save"
         v-if="isEdit">
      <Button class="xy-modal-primary"
              shape="circle"
              @click="save">保存</Button>
      <!-- <Button class="xy-modal-close"
              @click="cancel">取消</Button> -->
    </div>
  </div>
</template>
<script>
  // import XyTable from '@/components/table/XyTable'
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    components: {
      XyAntTable
    },
    name: 'evaEntry',
    data () {
      return {
        ActivityCourseProjectID: 0,
        scoreType: 0, // 打分方式
        isEdit: true,
        dataTable: [],
        selectedRowKeys: [],
        image: require('@/assets/common/yrykb.png'),
        nullData: '该搜索条件下没有结果。',
        tableLoading: true,
        ApplicationID: 0,
        ApplicationSubMenuID: 0,
        columns: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 40,
            scopedSlots: { customRender: 'StudentIcon' },
            className: 'table-pic'
          },
          {
            title: '姓名',
            dataIndex: 'StudentFullName',
            // minWidth: 100,
            scopedSlots: { customRender: 'StudentFullName' }
          },
          // {
          //   title: '姓名',
          //   dataIndex: 'StudentFullName',
          //   width: 120,
          //   ellipsis: true,
          //   tooltip: true
          // },
          {
            title: '用户名',
            dataIndex: 'StudentName',
            // minWidth: 120
            scopedSlots: { customRender: 'StudentName' }
          },
          {
            title: '得分',
            dataIndex: 'ActivityCourseScoreSum',
            width: 100,
            scopedSlots: { customRender: 'ActivityCourseScoreSum' }
          }
        ],
        pickedArr: [], // 左侧选中的学生
        treeList: [
          {
            title: '全选',
            expand: true,
            children: []
          }
        ],
        targetList: [] // 右侧选中的指标，只有最后一级
      }
    },
    watch: {
      idArr: {
        handler (val) {
          let idArr = val.split(',')
          this.ApplicationID = idArr[1]
          this.ApplicationSubMenuID = idArr[2]
        },
        immediate: true
      }
    },
    created () {
      this.ActivityCourseProjectID = this.$store.state.common.menuInfo.id
      this.scoreType = parseInt(this.$store.state.common.menuInfo.type)
      this.isEdit = this.$store.state.common.menuInfo.isEdit
      if (this.scoreType === 0) { // 0 :星星，1：打分
        this.columns.splice(3, 0, {
          title: '得星数',
          dataIndex: 'ActivityCourseScore',
          width: 100
        })
      }
      this.fetchAllList()
    },
    computed: {
      idArr () {
        return this.$store.state.common.menuId
      },
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange,
          getCheckboxProps: record => ({
            props: {
              disabled: record._disabled
            }
          })
        }
      }
    },
    methods: {
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        // this.selectionAll = val
        this.pickedArr = val// 修改没有选择学生的bug
      },
      handleTableChange () {
        this.getTable()
      },
      changeSelect (val) {
        this.pickedArr = val
      },

      // 获取活动指标列表
      async fetchAllList () {
        // this.treeList[0].children = []
        // this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseProjectTarget/GetLastTwoProjectTargetByID`, {
          activityCourseProjectID: this.ActivityCourseProjectID
        })
        if (res.success) {
          if (res.data.length > 0) {
            this.treeList[0].children = res.data.map(val => {
              return {
                title: val.ActivityCourseProjectTargetName,
                expand: true,
                ActivityCourseProjectTargetID: val.ActivityCourseProjectTargetID,
                Level: val.Level,
                ParentID: val.ParentID,
                DefaultValue: val.DefaultValue,
                MinValue: val.MinValue,
                ConversionValue: val.ConversionValue,
                children: val.Childrens.length ? val.Childrens.map(vv => {
                  return {
                    title: vv.ActivityCourseProjectTargetName,
                    expand: true,
                    ActivityCourseProjectTargetID: vv.ActivityCourseProjectTargetID,
                    Level: vv.Level,
                    ParentID: vv.ParentID,
                    // checked: vv.Checked,
                    children: [],
                    DefaultValue: vv.DefaultValue,
                    MinValue: vv.MinValue,
                    ConversionValue: vv.ConversionValue,
                    render: this.renderNode(vv)
                  }
                }) : [],
                render: !val.Childrens.length ? this.renderNode(val) : (h, { root, node, data }) => {
                  return h('span', val.ActivityCourseProjectTargetName)
                }
              }
            })
          }
          // this.xy.unloading()
          this.getTable()
        }
      },
      renderNode (vals) {
        let that = this
        let texts = vals.ActivityCourseProjectTargetName
        return (h, { root, node, data }) => {
          return h('div', { class: 'xy-flex xy-center' }, [
            h('Tooltip', { props: { placement: 'top', transfer: true } },
              [
                h('span', { class: 'index-name' }, texts),
                h('div', { slot: 'content', style: { whiteSpace: 'normal' } }, texts)
              ]
            ),
            h('Rate', {
              style: {
                display: that.scoreType === 0 ? 'inline-block' : 'none',
                marginRight: '8px',
                marginLeft: '8px',
                marginTop: '-10px'
              },
              props: {
                value: vals.DefaultValue,
                count: vals.MaxValue,
                customIcon: 'icon-icons-zhpj-active iconfont',
                size: '16'
              // clearable: vals.MinValue === 0
              },
              on: {
                'on-change': (v) => {
                  if (v < vals.MinValue) {
                    this.xy.msgError(`指标项评价最小值为${vals.MinValue}`)
                  // vals.DefaultValue = vals.MinValue
                  }
                  data.DefaultValue = v
                  data.checked = true
                  let index = that.targetList.map(item => { return item.ActivityCourseTargetID }).indexOf(vals.ActivityCourseProjectTargetID)
                  if (index > -1) {
                    this.targetList.splice(index, 1)
                  }
                  this.targetList.push({
                    'ActivityCourseTargetID': vals.ActivityCourseProjectTargetID,
                    'ActivityCourseScoreType': that.scoreType,
                    'ActivityCourseScore': v,
                    'markName': vals.ActivityCourseProjectTargetName,
                    'MinValue': vals.MinValue,
                    'ActivityCourseScoreConversion': vals.ConversionValue || 1
                  })
                }
              }
            }),
            h('InputNumber', {
              style: {
                display: that.scoreType === 1 ? 'inline-block' : 'none',
                marginRight: '8px',
                marginLeft: '8px'
              },
              props: {
                value: vals.DefaultValue,
                min: vals.MinValue,
                max: vals.MaxValue
              },
              on: {
                'on-change': (v) => {
                  if (v < vals.MinValue) {
                    this.xy.msgError(`指标项评价最小值为${data.MinValue}`)
                  // vals.DefaultValue = vals.MinValue
                  // return false
                  }
                  data.DefaultValue = v
                  data.checked = true
                  let index = that.targetList.map(item => { return item.ActivityCourseTargetID }).indexOf(vals.ActivityCourseProjectTargetID)
                  if (index > -1) {
                    this.targetList.splice(index, 1)
                  }
                  this.targetList.push({
                    'ActivityCourseTargetID': vals.ActivityCourseProjectTargetID,
                    'ActivityCourseScoreType': that.scoreType,
                    'ActivityCourseScore': v,
                    'markName': vals.ActivityCourseProjectTargetName,
                    'MinValue': vals.MinValue,
                    'ActivityCourseScoreConversion': vals.ConversionValue || 1
                  })
                // that.upDefaultValue(data)
                }
              }
            })
          ])
        }
      },
      // 选择常用指标或者全部指标，只要最后一级
      pickTarget (val) {
        this.targetList = []
        if (!val.length) { return }
        let arr = []
        for (let iv of val) {
          if (iv.Level === 1 && iv.children.length === 0) {
            arr.push({
              'ActivityCourseTargetID': iv.ActivityCourseProjectTargetID,
              'ActivityCourseScoreType': this.scoreType,
              'ActivityCourseScore': iv.DefaultValue,
              'markName': iv.title,
              'MinValue': iv.MinValue,
              'ActivityCourseScoreConversion': iv.ConversionValue || 1
            })
          }
          if (iv.Level === 2 && iv.children.length === 0) {
            arr.push({
              'ActivityCourseTargetID': iv.ActivityCourseProjectTargetID,
              'ActivityCourseScoreType': this.scoreType,
              'ActivityCourseScore': iv.DefaultValue,
              'markName': iv.title,
              'MinValue': iv.MinValue,
              'ActivityCourseScoreConversion': iv.ConversionValue || 1
            })
          }
          if (iv.Level === 3) {
            arr.push({
              'ActivityCourseTargetID': iv.ActivityCourseProjectTargetID,
              'ActivityCourseScoreType': this.scoreType,
              'ActivityCourseScore': iv.DefaultValue,
              'markName': iv.title,
              'MinValue': iv.MinValue,
              'ActivityCourseScoreConversion': iv.ConversionValue || 1
            })
          }
        }
        this.targetList = arr
      },
      async save () {
        if (!this.pickedArr.length) { return this.xy.msgError('请选择需要保存的学生。') }
        if (!this.targetList.length) { return this.xy.msgError('请给选择学生的指标打分。') }
        let arr = []
        for (let i = 0; i < this.targetList.length; i++) {
          let item = this.targetList[i]
          arr.push({
            'ActivityCourseTargetID': item.ActivityCourseTargetID,
            'ActivityCourseScoreType': item.ActivityCourseScoreType,
            'ActivityCourseScore': item.ActivityCourseScore,
            'ActivityCourseScoreConversion': item.ActivityCourseScoreConversion
          })
          if (item.ActivityCourseScore < item.MinValue) {
            this.xy.msgW(`${item.markName}，指标项评价最小值为${item.MinValue}`)
            return false
          }
        }
        let params = {
          'ActivityCourseProjectID': this.ActivityCourseProjectID,
          'ActivityCourseStudentIDs': this.pickedArr.map(val => val.ActivityCourseStudentID),
          'ScoreData': arr
        }
        // this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ActivityCourseStatistics/TeacherTeachingScore`, params, true)
        if (res.success) {
          this.xy.msgSuc(res.msg || '保存成功。')
          this.treeList = [
            {
              title: '全选',
              expand: true,
              children: []
            }
          ]
          this.dataTable = []
          // this.getTable()
          this.pickedArr = []
          this.targetList = []
          this.fetchAllList()
        } else {
          // this.xy.unloading()
          this.xy.msgError(res.msg || '保存失败。')
        }
      },
      // 获取学生列表
      async getTable () {
        // this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let obj = {
          ActivityCourseProjectID: this.ActivityCourseProjectID,
          ApplicationID: this.ApplicationID,
          ApplicationSubMenuID: this.ApplicationSubMenuID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseStudent/GetTeacherStudentByProjectID`, obj, true)
        if (res.success) {
          this.dataTable = res.data
          this.tableLoading = false
        } else {
          this.tableLoading = false
          this.xy.msgError(res.msg)
        }
      },
      cancel () {

      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-body {
  height: 100%;
  display: flex;
  margin-bottom: 70px;
  .left {
    width: 50%;
    height: 600px;
    max-height: 600px;
    overflow: scroll;
    /deep/ .xy-table .ivu-table th {
      height: 59px;
      border-top: 1px solid #dcdee2;
    }
  }
  .right {
    width: 50%;
    border-left: 1px solid #dcdee2;
    border-top: 1px solid #dcdee2;
    max-height: 600px;
    overflow-y: auto;
    .name {
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      padding: 10px 10px 10px 0;
    }
    .tree {
      margin-left: 10px;
    }
    /deep/.ivu-rate-star-chart.ivu-rate-star-full .ivu-rate-star-first,
    /deep/.ivu-rate-star-chart.ivu-rate-star-full .ivu-rate-star-second {
      color: #fadb14;
    }
    /deep/ .ivu-tree-title {
      vertical-align: middle;
    }
    /deep/ .ivu-tooltip-rel {
      display: flex;
    }
    /deep/.index-name {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 300px;
    }
  }
}

.save {
  position: fixed;
  bottom: 0;
  height: 80px;
  line-height: 80px;
  text-align: right;
  background: #fff;
  width: calc(100% - 80px);
}
</style>
