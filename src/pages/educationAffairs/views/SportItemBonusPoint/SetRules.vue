// 体测项目评分规则管理-加分规则
<template>
  <div class='xy-content-module'>
    <!-- 面包屑 -->
    <div class='xy-content-title'>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <Button class="xy-primary"  @click="modalCreate = true">创建加分规则</Button>
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

        <!--最小加分标准-->
        <div slot="MinBonusValue" slot-scope="text,record" style="min-width:140px">
          <span>
            {{record.MinBonusValue}}
          </span>
        </div>
        <!--获得加分分数-->
         <div slot="BonusScore" slot-scope="text,record" style="min-width:140px">
          <span>
            {{record.BonusScore}}
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
      title="创建加分规则"
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
            <FormItem label="最小得分标准" prop="MinBonusValue" labelFor="minBouns">
              <i-input elementId="minBouns" v-model="FormData.MinBonusValue" placeholder=""></i-input>
            </FormItem>
            <FormItem label="获得分数" prop="BonusScore" labelFor="score">
              <i-input elementId="score" v-model="FormData.BonusScore" placeholder=""></i-input>
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
      title="编辑创建评分规则"
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
            <FormItem label="最小得分标准" prop="MinBonusValue" labelFor="minBounsE">
              <i-input elementId="minBounsE" v-model="FormEditData.MinBonusValue" placeholder=""></i-input>
            </FormItem>
            <FormItem label="获得分数" prop="BonusScore" labelFor="scoreE">
              <i-input elementId="scoreE" v-model="FormEditData.BonusScore" placeholder=""></i-input>
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
        nullData: '您还没有加分规则的信息，请创建加分规则。',
        modalCreate: false, // 创建弹出框默认不展示
        modalEdit: false,
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
            title: '最小加分标准',
            key: 'MinBonusValue',
            scopedSlots: { customRender: 'MinBonusValue' }
          },
          {
            title: '获得加分分数',
            key: 'BonusScore',
            scopedSlots: { customRender: 'BonusScore' }
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
          MinBonusValue: undefined,
          BonusScore: undefined
        },
        FormRules: {
          Grade: { required: true, message: '请选择年级' },
          Sex: { required: true, message: '请选择性别' },
          MinBonusValue: [{ required: true, message: '最小得分标准不能为空' }, {
            transform: (value) => {
              return Number(value)
            },
            type: 'number',
            message: '请输入数字'
          }],
          BonusScore: [{ required: true, message: '获得分数不能为空' }, {
            transform: (value) => {
              return Number(value)
            },
            type: 'number',
            message: '请输入数字'
          }]
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
        // SportItemBonusPointsRuleID: this.$router.query('row').SportItemBonusPointsRuleID,
        SportItemBonusPointsRuleID: 0,
        FormEditData: {
          // SportItemID: this.$router.query('row').SportItemID,
          SportItemID: undefined,
          Sex: undefined,
          Grade: undefined,
          MinBonusValue: undefined,
          BonusScore: undefined
        },
        FormEditRules: {
          Grade: { required: true, message: '请选择年级' },
          Sex: { required: true, message: '请选择性别' },
          MinBonusValue: [{ required: true, message: '最小得分标准不能为空' }, {
            transform: (value) => {
              return Number(value)
            },
            type: 'number',
            message: '请输入数字'
          }],
          BonusScore: [{ required: true, message: '获得分数不能为空' }, {
            transform: (value) => {
              return Number(value)
            },
            type: 'number',
            message: '请输入数字'
          }]
        }
      }
    },
    created () {
      this.FormData.SportItemID = this.$store.state.common.menuInfo.SportItemID
      this.loadTable()
    },
    mounted () {
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      // 获取table分页数据
      async loadTable () {
        this.tableLoading = true
        let params = {
          SportItemID: this.FormData.SportItemID,
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize
        }

        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/SportItemBonusPointsRule/GetSportItemBonusPointsRulePageList',
          params
        )
        if (res.success) {
          // 表格排序
          let sex1Data = []
          let sex2Data = []
          // 按性别排序
          res.data.data.map((item, index) => {
            if (item.Sex === 1) {
              sex1Data.push(item)
            }
          })
          res.data.data.map((item, index) => {
            if (item.Sex === 2) {
              sex2Data.push(item)
            }
          })
          // 按年级排序
          sex1Data.sort((a, b) => {
            return a.Grade - b.Grade
          })
          sex2Data.sort((a, b) => {
            return a.Grade - b.Grade
          })
          this.tableData = [...sex1Data, ...sex2Data]
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
            this.xy.post(`${this.$store.state.apiPath}/api/SportItemBonusPointsRule/SportItemBonusPointsRuleInsert`, params).then(res => {
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
        let res = await this.xy.get(
          this.$store.state.apiPath + `/api/SportItemBonusPointsRule/GetSportItemBonusPointsRuleByID?SportItemBonusPointsRuleID=${this.SportItemBonusPointsRuleID}`,
          null
        )
        // this.xy.unloading()
        if (res.success) {
          var d = res.data
          this.FormEditData.SportItemID = d.SportItemID
          this.FormEditData.Sex = d.Sex
          this.FormEditData.Grade = d.Grade
          this.FormEditData.MinBonusValue = d.MinBonusValue
          this.FormEditData.BonusScore = d.BonusScore
          this.FormEdiitData.Level = d.Level
          this.modalEdit = true
        }
      },
      //  单击表格中编辑按钮触发
      edit (row) {
        this.modalEdit = true
        this.FormEditData.SportItemID = row.SportItemID
        this.SportItemBonusPointsRuleID = row.SportItemBonusPointsRuleID
        this.FormEditData.Sex = row.Sex
        this.FormEditData.Grade = row.Grade
        this.FormEditData.MinBonusValue = row.MinBonusValue
        this.FormEditData.BonusScore = row.BonusScore
        this.FormEditData.Level = row.Level
      },
      //  确认编辑触发
      editOk () {
        this.$refs.FormEditData.validate((valid) => {
          if (!valid) {
            return false
          } else {
            let params = this.FormEditData
            params.SportItemBonusPointsRuleID = this.SportItemBonusPointsRuleID
            this.xy.post(`${this.$store.state.apiPath}/api/SportItemBonusPointsRule/SportItemBonusPointsRuleModify`, params).then(res => {
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
