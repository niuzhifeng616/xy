// 体测项目评分规则管理-创建评分规则
<template>
  <div class='xy-content-module'>
    <!-- 面包屑 -->
    <div class='xy-content-title'>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <Button class="xy-primary"  @click="modalCreate = true">创建评分规则</Button>
      </div>
    </div>
    <div class='xy-content-body'>
      <XyAntTable
        :columns="columns"
        :dataSource="tableData"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scrollx="'max-content'"
      >
         <!-- 年级 -->
        <div slot="GradeName" slot-scope="text,record" style="min-width:280px">
          <span class="table-el-hover" @click="edit(record)">
            {{record.GradeName}}
          </span>
        </div>
         <!--性别-->
        <div slot="SexName" slot-scope="text,record" style="min-width:80px">
          <span>
            {{record.SexName}}
          </span>
        </div>
        <!--最小得分标准-->
        <div slot="MinValue" slot-scope="text,record" style="min-width:140px">
          <span>
            {{record.MinValue}}
          </span>
        </div>
        <!--获得分数-->
        <div slot="Score" slot-scope="text,record" style="min-width:100px">
          <span>
            {{record.Score}}
          </span>
        </div>
        <!--获得等级-->
        <div slot="Level" slot-scope="text,record" style="min-width:180px">
          <span>
            {{record.Level}}
          </span>
        </div>
        <!--操作-->
        <span slot="oprateRender" slot-scope="text, record">
          <a @click="edit(record)">编辑</a>
        </span>
      </XyAntTable>
    </div>
    <Modal
      v-model="modalCreate"
      :transfer="false"
      title="创建评分规则"
      :styles="{top: '150px'}"
      :mask-closable="false"
      ok-text="保存"
      >
        <div class="dialog-model-content">
          <Form ref="FormData" :model="FormData" :rules="FormRules" :label-width="120">
            <FormItem label="年级" prop="Grade">
              <i-select v-model="FormData.Grade">
                <i-option v-for="(item, index) in CONSTANT.Grade" :key="index" :value="item.value">{{item.label}}</i-option>
              </i-select>
            </FormItem>
            <FormItem label="性别" prop="Sex">
              <i-select v-model="FormData.Sex">
                <i-option v-for="(item, index) in CONSTANT.Gender" :key="index" :value="item.value">{{item.label}}</i-option>
              </i-select>
            </FormItem>
            <FormItem label="最小得分标准" prop="MinValue" labelFor='min'>
              <Input elementId='min' v-model="FormData.MinValue" placeholder="" />
            </FormItem>
            <FormItem label="获得分数" prop="Score" labelFor='score'>
              <Input elementId='score' v-model="FormData.Score" placeholder="" />
            </FormItem>
            <FormItem label="获得等级" prop="Level" labelFor='level'>
              <Input elementId='level' v-model="FormData.Level" placeholder="" />
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="cancel">取消</Button>
          <Button class="xy-modal-primary" @click="ok" shape="circle">确定</Button>
        </div>
    </Modal>
    <Modal
      v-model="modalEdit"
      :transfer="false"
      title="编辑评分规则"
      :mask-closable="false"
      ok-text="保存"
      >
        <div class="dialog-model-content">
          <Form ref="FormEditData" :model="FormEditData" :rules="FormEditRules" :label-width="120">
            <FormItem label="年级" prop="Grade">
              <i-select v-model="FormEditData.Grade">
                <i-option v-for="(item, index) in CONSTANT.Grade" :key="index" :value="item.value">{{item.label}}</i-option>
              </i-select>
            </FormItem>
            <FormItem label="性别" prop="Sex">
              <i-select v-model="FormEditData.Sex">
                <i-option v-for="(item, index) in CONSTANT.Gender" :key="index" :value="item.value">{{item.label}}</i-option>
              </i-select>
            </FormItem>
            <FormItem label="最小得分标准" labelFor='minE' prop="MinValue">
              <Input elementId='minE' v-model="FormEditData.MinValue" placeholder="" />
            </FormItem>
            <FormItem label="获得分数" labelFor='scoreE' prop="Score">
              <Input elementId='scoreE' v-model="FormEditData.Score" placeholder="" />
            </FormItem>
            <FormItem label="获得等级" labelFor='levelE' prop="Level">
              <Input elementId='levelE' v-model="FormEditData.Level" placeholder="" />
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="cancel">取消</Button>
          <Button class="xy-modal-primary" @click="editOk" shape="circle">确定</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'SetRules',
    components: {
      XyAntTable
    },
    data () {
      return {
        modalCreate: false, // 创建弹出框默认不展示
        modalEdit: false,
        tableLoading: true,

        nullData: '您还没有评分规则的信息，请创建评分规则',
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
            title: '年级',
            dataIndex: 'GradeName',
            scopedSlots: { customRender: 'GradeName' }
          },
          {
            title: '性别',
            dataIndex: 'SexName',
            scopedSlots: { customRender: 'SexName' }
          },
          {
            title: '最小得分标准',
            key: 'MinValue',
            scopedSlots: { customRender: 'MinValue' }
          },
          {
            title: '获得分数',
            key: 'Score',
            scopedSlots: { customRender: 'Score' }
          },
          {
            title: '获得等级',
            key: 'Level',
            scopedSlots: { customRender: 'Level' }
          },
          {
            title: '操作',
            dataIndex: '04',
            width: 80,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        //   表格
        tableData: [{}],
        total: 100,
        pageSize: 15,
        pageIndex: 1,
        selectionAll: [],
        Start: '',
        end: '',
        FormData: {
          // SportItemID: this.$router.query('row').SportItemID,
          SportItemID: undefined,
          Sex: undefined,
          Grade: undefined,
          MinValue: undefined,
          Score: undefined,
          Level: undefined
        },
        FormRules: {
          Sex: { required: true, message: '请选择性别' },
          Grade: { required: true, message: '请选择年级' },
          MinValue: [{ required: true, message: '最小得分标准不能为空' }, {
            transform: (value) => {
              return Number(value)
            },
            type: 'number',
            message: '请输入数字'
          }],
          Score: [{ required: true, message: '获得分数不能为空' }, {
            transform: (value) => {
              return Number(value)
            },
            type: 'number',
            message: '请输入数字'
          }],
          Level: [
            { required: true, message: '请输入等级' },
            { max: 5, message: '最多输入5个字符' }
          ]
        },
        CONSTANT: {
          Grade: [{
            label: '高一',
            value: 1
          }, {
            label: '高二',
            value: 2
          }, {
            label: '高三',
            value: 4
          }],
          Gender: [{
            label: '男',
            value: 1
          }, {
            label: '女',
            value: 2
          }]
        },
        // SportItemGradingRuleID: this.$router.query('row').SportItemGradingRuleID,
        SportItemGradingRuleID: 0,
        SportItemID: 0,
        FormEditData: {
          // SportItemID: this.$router.query('row').SportItemID,
          SportItemID: undefined,
          Sex: undefined,
          Grade: undefined,
          MinValue: undefined,
          Score: undefined,
          Level: undefined
        },
        FormEditRules: {
          Sex: { required: true, message: '请选择性别' },
          Grade: { required: true, message: '请选择年级' },
          MinValue: [{ required: true, message: '最小得分标准不能为空' }, {
            transform: (value) => {
              return Number(value)
            },
            type: 'number',
            message: '请输入数字'
          }],
          Score: [{ required: true, message: '获得分数不能为空' }, {
            transform: (value) => {
              return Number(value)
            },
            type: 'number',
            message: '请输入数字'
          }],
          Level: [
            { required: true, message: '请输入等级' },
            { max: 5, message: '最多输入5个字符' }
          ]
        }
      }
    },
    created () {
      // console.log(this.$store.state.common.menuInfo)
      this.SportItemID = this.$store.state.common.menuInfo.SportItemID
      this.loadTable()
    },
    mounted () {
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      changeSelect (selction) {
        this.selectionAll = selction
      },
      // 获取table分页数据
      async loadTable () {
        this.tableLoading = true
        let params = {
          SportItemID: this.SportItemID,
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize
        }
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/SportItemGradingRule/GetSportItemGradingRulePageList',
          params
        )
        if (res.success) {
          this.tableData = res.data.data
          this.pagination.total = res.data.totalRecords
        }
        this.tableLoading = false
      },
      ok () {
        this.$refs.FormData.validate((valid) => {
          if (!valid) {
            return false
          } else {
            let params = this.FormData
            params.SportItemID = this.SportItemID
            this.xy.post(`${this.$store.state.apiPath}/api/SportItemGradingRule/SportItemGradingRuleInsert`, params).then(res => {
              if (res.success) {
                this.xy.msgSuc('设置成功。')
                this.loadTable()
                this.modalCreate = false
                this.$refs.FormData.resetFields()
              } else {
                this.modalCreate = true
              }
            })
          }
        })
      },
      //  关闭创建弹框触发
      cancel () {
        this.editId = ''
        this.modalCreate = false
        this.modalEdit = false
        this.$refs.FormData.resetFields()
        this.$refs.FormEditData.resetFields()
      },
      async getData () {
        // this.xy.loading()
        // api / SportItemGradingRule / GetSportItemGradingRuleByID
        let res = await this.xy.get(
          this.$store.state.apiPath + `/api/SportItemGradingRule/GetSportItemGradingRuleByID?SportItemGradingRuleID=${this.SportItemGradingRuleID}`,
          null
        )
        // this.xy.unloading()
        if (res.success) {
          var d = res.data
          this.FormEditData.SportItemID = d.SportItemID
          this.FormEditData.Sex = d.Sex
          this.FormEditData.Grade = d.Grade
          this.FormEditData.MinValue = d.MinValue
          this.FormEditData.Score = d.Score
          this.FormEditData.Level = d.Level
          this.modalEdit = true
        }
      },
      //  单击表格中编辑按钮触发
      edit (row) {
        this.modalEdit = true
        this.SportItemGradingRuleID = row.SportItemGradingRuleID
        this.FormEditData.SportItemID = row.SportItemID
        this.FormEditData.Sex = row.Sex
        this.FormEditData.Grade = row.Grade
        this.FormEditData.MinValue = row.MinValue
        this.FormEditData.Score = row.Score
        this.FormEditData.Level = row.Level
      },
      //  确认编辑触发
      editOk () {
        this.$refs.FormEditData.validate((valid) => {
          if (!valid) {
            return false
          } else {
            let params = this.FormEditData
            params.SportItemGradingRuleID = this.SportItemGradingRuleID
            this.xy.post(`${this.$store.state.apiPath}/api/SportItemGradingRule/SportItemGradingRuleModify`, params).then(res => {
              if (res.success) {
                this.xy.msgSuc('编辑成功。')
                this.loadTable()
                this.modalEdit = false
                this.$refs.FormEditData.resetFields()
              }
            })
          }
        })
      },
      editCancel () {
        this.modalEdit = false
        this.$refs.FormEditData.resetFields()
      },
      // 返回
      ReturnClick () {
        // 体测项目评分规则管理
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang='less' scoped>
.ivu-modal-confirm-head-title {
    margin: 0px;
    display: block;
}
.ivu-modal-confirm-body {
    padding-left: 0px;
    margin: 20px 20px 30px;
}
</style>
