// 校区管理
<template>
  <div class="xy-content-module">
      <div  class='xy-content-title'>
          <Button class="xy-primary" @click="create">创建校区</Button>
      </div>
      <div class="xy-content-body">
        <Alert show-icon closable>对学校的校区进行管理，您不可以删除已被使用的校区。</Alert>
        <XyAntTable
          :columns="columns"
          :dataSource="tableData"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          :scrollx="'max-content'"
          @change="handleTableChange"
          >
          <div slot="NameRender" slot-scope="text, record" style="min-width:400px">
            <span  v-if="!record.IsDefault" class="table-el-hover" @click="edit(record)">
            {{text}}
            </span>
            <span v-else>
            {{text}}
            </span>
          </div>
          <div slot="SchoolDistrictNameRender" slot-scope="text, record">
            <div style="min-width:350px">
            {{record.SchoolDistrictName}}
            </div>
          </div>
          <span slot="GardInfosRender" slot-scope="text, record">
            <span>
            {{filterName (record)}}
            </span>
          </span>
          <span slot="termRender" slot-scope="text, record">
            <div>
              <Button size="small" @click="termManage(record)">编辑</Button>
            </div>
          </span>
          <span slot="oprateRender" slot-scope="text, record">
            <a :disabled="record.IsDefault" @click="edit(record)">编辑</a>
            <a-divider type="vertical" />
            <a :disabled="record._disabled" @click="del(record.SchoolDistrictID, record.SchoolDistrictName)">删除</a>
          </span>
        </XyAntTable>
        <Modal
          v-model="modalCreate"
          :transfer="false"
          title="创建校区"
          :mask-closable="false"
          @on-visible-change='clearData'
          width='600'
          >
            <div class="dialog-model-content">
                <Form ref="formValidateOK" :model="formValidateOK" label-position="top" :rules="ruleValidateOK">
                    <FormItem label="校区名称" prop="schoolDistrictFullName" labelFor="schoolDistrictFullName">
                        <Input v-model="formValidateOK.schoolDistrictFullName" elementId="schoolDistrictFullName" />
                    </FormItem>
                    <FormItem label="校区简称" prop="schoolDistrictName" labelFor="schoolDistrictName">
                        <Input v-model="formValidateOK.schoolDistrictName" elementId="schoolDistrictName" />
                    </FormItem>
                    <FormItem label="学制">
                        <div style="width:100%;display:inline-block">
                            <span v-if="isHeigh">
                                <checkbox v-model="highBox">
                                    <span>高中</span>
                                </checkbox>
                                <Select v-model="highVal" style="width:60px;margin-right: 65px;">
                                    <Option v-for="item in yearData" :value="item.value" :key="item.value">
                                        {{ item.name }}
                                    </Option>
                                </Select>
                            </span>
                            <span v-if="isMidle" style="margin-right: 65px;">
                                <checkbox v-model="juniorBox">
                                    <span>初中</span>
                                </checkbox>
                                <Select v-model="juniorVal" style="width:60px;">
                                    <Option v-for="item in yearData" :value="item.value" :key="item.value">
                                        {{ item.name }}
                                    </Option>
                                </Select>
                            </span>
                            <span v-if="isXiao">
                                <checkbox v-model="smallBox">
                                    <span>小学</span>
                                </checkbox>
                                <Select v-model="smallVal" style="width:60px;">
                                    <Option v-for="item in yearData" :value="item.value" :key="item.value">
                                        {{ item.name }}
                                    </Option>
                                </Select>
                            </span>
                        </div>
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
          title="编辑校区"
          :mask-closable="false"
          width='600'
          >
            <div class="dialog-model-content">
                <Form ref="formValidate" :model="formValidate" label-position="top" :rules="ruleValidate" @submit.native.prevent>
                    <FormItem label="校区名称" prop="schoolDistrictFullName" labelFor="schoolDistrictFullNameE">
                        <Input v-model="formValidate.schoolDistrictFullName" elementId="schoolDistrictFullNameE" />
                    </FormItem>
                    <FormItem label="校区简称" prop="schoolDistrictName" labelFor="schoolDistrictNameE">
                        <Input v-model="formValidate.schoolDistrictName" elementId="schoolDistrictNameE" />
                    </FormItem>
                    <FormItem label="学制">
                        <div style="width:100%;display:inline-block">
                            <span v-if="isHeigh" style="margin-right: 65px;">
                                <checkbox v-model="highBox" :disabled="isHighBox">
                                    <span>高中</span>
                                </checkbox>
                                <Select v-model="highVal" style="width:60px;" :disabled="isHighBox">
                                    <Option v-for="item in yearData" :value="item.value" :key="item.value">
                                        {{ item.name }}
                                    </Option>
                                </Select>
                            </span>
                            <span v-if="isMidle" style="margin-right: 65px;">
                                <checkbox v-model="juniorBox" :disabled="isJuniorBox">
                                    <span>初中</span>
                                </checkbox>
                                <Select v-model="juniorVal" style="width:60px;" :disabled="isJuniorBox">
                                    <Option v-for="item in yearData" :value="item.value" :key="item.value">
                                        {{ item.name }}
                                    </Option>
                                </Select>
                            </span>
                            <span v-if="isXiao">
                                <checkbox v-model="smallBox" :disabled="isSmallBox">
                                    <span>小学</span>
                                </checkbox>
                                <Select v-model="smallVal" style="width:60px;" :disabled="isSmallBox">
                                    <Option v-for="item in yearData" :value="item.value" :key="item.value">
                                        {{ item.name }}
                                    </Option>
                                </Select>
                            </span>
                        </div>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
              <Button class="xy-modal-close" @click="editCancel">取消</Button>
              <Button class="xy-modal-primary" @click="editOk" shape="circle">确定</Button>
            </div>
        </Modal>
      </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'schoolDistrict',
    components: {
      XyAntTable
    },
    data () {
      return {
        modalCreate: false, // 创建弹出框默认不展示
        editId: '', // 要编辑的ID
        modalEdit: false,
        modalRemove: false, // 删除单个数据弹出框默认不展示
        // antTable
        loadingTable: true,
        tableLoading: true,
        nullData: '您还没有校区的信息，请创建校区。',
        columns: [
          {
            title: '校区名称',
            dataIndex: 'SchoolDistrictFullName',
            scopedSlots: { customRender: 'NameRender' }
          },
          {
            title: '校区简称',
            dataIndex: 'SchoolDistrictName',
            scopedSlots: { customRender: 'SchoolDistrictNameRender' }
          },
          {
            title: '学制',
            width: 300,
            dataIndex: 'GardInfos',
            scopedSlots: { customRender: 'GardInfosRender' }
          },
          {
            title: '操作',
            width: 120,
            dataIndex: 'oprateRender',
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        tableData: [],
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
            this.pageIndex = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
            this.pageIndex = 1
            this.pageSize = pageSize
          }
        },
        pageIndex: 1,
        pageSize: 15,
        yearData: [
          { name: '1年', value: 1 },
          { name: '2年', value: 2 },
          { name: '3年', value: 3 },
          { name: '4年', value: 4 },
          { name: '5年', value: 5 },
          { name: '6年', value: 6 }
        ],
        highVal: 3,
        highBox: true,
        isHighBox: false, // 学制是否可以编辑
        juniorVal: 3,
        juniorBox: true,
        isJuniorBox: false, // 学制是否可以编辑
        smallVal: 6,
        smallBox: true,
        isSmallBox: false, // 学制是否可以编辑
        // 创建模型验证
        formValidateOK: {
          schoolDistrictFullName: '',
          schoolDistrictName: ''
        },
        ruleValidateOK: {
          schoolDistrictFullName: [
            { required: true, message: '校区名称不能为空', trigger: 'blur' },
            { type: 'string', max: 30, message: '校区名称不能超过30个字', trigger: 'blur' }
          ],
          schoolDistrictName: [
            { required: true, message: '校区简称不能为空', trigger: 'blur' },
            { type: 'string', max: 30, message: '校区简称不能超过30个字', trigger: 'blur' }
          ]
        },
        // 编辑模型验证
        formValidate: {
          schoolDistrictFullName: '',
          schoolDistrictName: ''
        },
        ruleValidate: {
          schoolDistrictFullName: [
            { required: true, message: '校区名称不能为空', trigger: 'blur' },
            { type: 'string', max: 30, message: '校区名称不能超过30个字', trigger: 'blur' }
          ],
          schoolDistrictName: [
            { required: true, message: '校区简称不能为空', trigger: 'blur' },
            { type: 'string', max: 30, message: '校区简称不能超过30个字', trigger: 'blur' }
          ]
        },
        isXiao: true,
        isMidle: true,
        isHeigh: true,
        tableUrl: '',
        tbData: {}
      }
    },
    created () {
      this.GradeBase()
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
        let params = {
          searchTxt: '',
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SchoolDistrict/GetPage`, params)
        if (res.success) {
          this.tableData = res.data.data
          this.total = res.data.totalRecords
          this.pagination.total = res.data.totalRecords
        }
        this.tableLoading = false
      },
      // filter
      filterName (text) {
        let str = ''
        if (text.GardInfos.length > 0) {
          text.GardInfos.map(item => {
            str += item.StudentGradeName + '\xa0(' + item.GradeCount + '年)' + '\xa0\xa0'
          })
        }
        return str
      },
      //   点击X关闭创建
      clearData () {
        this.$refs.formValidateOK.resetFields()
      },
      async GradeBase () {
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/StudentOrganization/GetStudentGradeBase', null)
        if (res.success) {
          let data = []
          data = res.data.map(item => {
            return item.StudentGradeName
          })
          this.isXiao = data.some(item => item === '小学')
          this.isMidle = data.some(item => item === '初中')
          this.isHeigh = data.some(item => item === '高中')
        }
      },
      // 创建校区
      create () {
        this.modalCreate = true
        this.highBox = true
        this.juniorBox = true
        this.smallBox = true
        this.highVal = 3
        this.juniorVal = 3
        this.smallVal = 6
      },
      ok () {
        this.$refs.formValidateOK.validate(valid => {
          if (!valid) {
            return false
          } else {
            var gardInfo = []
            if (!this.highBox && !this.juniorBox && !this.smallBox) {
              this.xy.msgError('请勾选学制。')
              return false
            }
            if (this.highBox && this.isHeigh) {
              gardInfo.push({
                StudentGradeID: 3,
                GradeCount: this.highVal
              })
            }
            if (this.juniorBox && this.isMidle) {
              gardInfo.push({
                StudentGradeID: 2,
                GradeCount: this.juniorVal
              })
            }
            if (this.smallBox && this.isXiao) {
              gardInfo.push({
                StudentGradeID: 1,
                GradeCount: this.smallVal
              })
            }
            let params = {
              SchoolDistrictFullName: this.formValidateOK.schoolDistrictFullName.trim(),
              SchoolDistrictName: this.formValidateOK.schoolDistrictName.trim(),
              GardInfo: gardInfo
            }
            this.xy.post(`${this.$store.state.apiPath}/api/SchoolDistrict/Create`, params).then(res => {
              if (res.success) {
                this.xy.msgSuc('创建成功。')
                this.tbData = {
                  searchTxt: '',
                  pageIndex: this.pageIndex,
                  pageSize: this.pageSize
                }
                this.modalCreate = false
                this.$refs.formValidateOK.resetFields()
                this.loadTable()
              }
            })
          }
        })
      },
      // 关闭创建弹框触发
      cancel () {
        this.modalCreate = false
        this.$refs.formValidateOK.resetFields()
      },
      // 单击表格中编辑按钮触发
      edit (row) {
        this.editId = row.SchoolDistrictID
        this.formValidate.schoolDistrictName = row.SchoolDistrictName
        this.formValidate.schoolDistrictFullName = row.SchoolDistrictFullName
        this.highVal = 3
        this.highBox = false
        this.juniorVal = 3
        this.juniorBox = false
        this.smallVal = 6
        this.smallBox = false
        // 默认都能编辑
        this.isSmallBox = false
        this.isJuniorBox = false
        this.isHighBox = false
        for (var i = 0; i < row.GardInfos.length; i++) {
          if (row.GardInfos[i].StudentGradeID === 1) { // 小学
            this.smallVal = row.GardInfos[i].GradeCount
            this.smallBox = true
            this.isSmallBox = true
          }
          if (row.GardInfos[i].StudentGradeID === 2) { // 初中
            this.juniorVal = row.GardInfos[i].GradeCount
            this.juniorBox = true
            this.isJuniorBox = true
          }
          if (row.GardInfos[i].StudentGradeID === 3) { // 高中
            this.highVal = row.GardInfos[i].GradeCount
            this.highBox = true
            this.isHighBox = true
          }
        }
        this.modalEdit = true
      },
      // 确认编辑触发
      editOk () {
        this.$refs.formValidate.validate(valid => {
          if (!valid) {
            return false
          } else {
            var gardInfo = []
            if (!this.highBox && !this.juniorBox && !this.smallBox) {
              return false
            }
            if (this.highBox && this.isHeigh) {
              gardInfo.push({
                StudentGradeID: 3,
                GradeCount: this.highVal
              })
            }
            if (this.juniorBox && this.isMidle) {
              gardInfo.push({
                StudentGradeID: 2,
                GradeCount: this.juniorVal
              })
            }
            if (this.smallBox && this.isXiao) {
              gardInfo.push({
                StudentGradeID: 1,
                GradeCount: this.smallVal
              })
            }
            let params = {
              SchoolDistrictID: this.editId,
              SchoolDistrictName: this.formValidate.schoolDistrictName.trim(),
              SchoolDistrictFullName: this.formValidate.schoolDistrictFullName.trim(),
              GardInfo: gardInfo
            }
            this.xy.post(`${this.$store.state.apiPath}/api/SchoolDistrict/Edit`, params).then(res => {
              if (res.success) {
                this.xy.msgSuc('编辑成功。')
                this.tbData = {
                  searchTxt: '',
                  pageIndex: this.pageIndex,
                  pageSize: this.pageSize
                }
                this.modalEdit = false
                this.$refs.formValidateOK.resetFields()
                this.loadTable()
              }
            })
          }
        })
      },
      editCancel () {
        this.editId = ''
        this.modalEdit = false
        this.$refs.formValidate.resetFields()
      },
      // 单击删除单个内容触发
      del (id, name) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确定要删除"' + name + '"吗？</p>',
          loading: true,
          onOk: () => {
            this.xy.post(`${this.$store.state.apiPath}/api/SchoolDistrict/Delete?schoolDistrictID=${id}`, null).then(res => {
              if (res.success) {
                this.$Modal.remove()
                this.xy.msgSuc('删除成功。')
                if (this.tableData.length > 1) {
                  this.tableData.length = this.tableData.length - 1
                } else {
                  if (this.pageIndex > 1) {
                    this.pageIndex = this.pageIndex - 1
                    this.pagination.current = this.pageIndex
                  }
                }
                this.loadTable()
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.ivu-modal-confirm-head-title {
    margin: 0px;
    display: block;
}
.ivu-modal-confirm-body {
    padding-left: 0px;
    margin: 20px 20px 30px;
}
</style>
