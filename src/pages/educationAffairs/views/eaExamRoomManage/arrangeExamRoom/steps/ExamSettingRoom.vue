<template>
  <div id="ExamSetting">
    <div v-if="params.isEdit" class="box">
      <Button class="xy-primary" icon="md-add" @click="Create">添加考场</Button>
      <Button class="xy-danger" @click="DelAll">批量删除</Button>
      <Button class="xy-info" @click="Serial">调序号</Button>
      <tooltip
        word-wrap
        max-width="200"
        placement="top"
        content="考场序号用于给学生分考场时将优先使用序号小的考场。"
        >
        <Icon type="md-help-circle" size="22" color="#ffad33" />
      </tooltip>
    </div>
    <Alert style="margin: 16px 0 24px; width: 616px;" show-icon closable>{{direction}}</Alert>
    <XyAntTable
      :rowSelection="tableRowSelection"
      :columns="columns"
      :dataSource="datatable"
      :nullData="txt"
      :tableLoading="tableLoading"
      :isPage="false"
      @change="handleTableChange"
      :scrollx="'max-content'"
      :isScroll="true"
      >
      <div style="min-width: 100px" slot="ArrangeSupervisorExamRoomName" slot-scope="text, record">
        <span
          v-html="record.ArrangeSupervisorExamRoomName"
          :class="!params.isEdit ? '' : 'ant-table-cell table-el-hover'"
          style="display: inline-block"
          @click="edit(record, 1)"
          >
        </span>
      </div>
      <!-- 操作 -->
      <span slot="action" slot-scope="text, record">
        <a @click="edit(record, 1)" :disabled="!params.isEdit">编辑</a>
        <a-divider type="vertical" />
        <a @click="del(record.ArrangeSupervisorExamRoomID, record.ArrangeSupervisorExamRoomName)" :disabled='!params.isEdit'>删除</a>
      </span>
    </XyAntTable>
    <modal
      v-model="modalCreate"
      :transfer="false"
      title="添加考场"
      :loading="loading"
      :mask-closable="false"
      @on-ok="Ok"
      ok-text="保存"
      @on-cancel="Cancel"
      >
      <div class="dialog-model-content">
        <i-form
          ref="formValidateOk"
          :model="formValidateOk"
          :rules="ruleValidateOK"
          @submit.native.prevent
          label-position="left"
          :label-width="100"
          >
          <form-item label="考场名称：" prop="ExamSetName" labelFor="examName">
            <i-input v-model="formValidateOk.ExamSetName" style="width: 270px" elementId="examName"></i-input>
          </form-item>
          <form-item label="教学楼：" prop="ExamSetBuild">
            <i-select v-model="formValidateOk.ExamSetBuild" style="width: 270px" @on-change="BuildChange">
              <i-option
                v-for="buildItem in BuildList"
                :value="buildItem.BuildingID"
                :key="buildItem.BuildingID"
                v-cloak
                >
                {{ buildItem.BuildingName }}{{buildItem.IsCurrent?'（当前校区）':''}}
              </i-option>
            </i-select>
          </form-item>
          <form-item label="教室：" prop="ExamSetRoom">
            <i-select v-model="formValidateOk.ExamSetRoom" style="width: 270px" @on-change="RoomChange">
              <i-option
                v-for="roomItem in RoomList"
                :value="roomItem.HouseID"
                :key="roomItem.HouseID"
                v-cloak
                >
                {{ roomItem.HouseName }}
              </i-option>
            </i-select>
          </form-item>
          <form-item label="人数：" labelFor="number" prop="ExamSetNumber">
            <input-number
              style="width: 270px"
              v-model="formValidateOk.ExamSetNumber"
              :min="1"
              :max="99"
              clearable
              elementId="number"
              >
            </input-number>
          </form-item>
        </i-form>
      </div>
      <div slot="footer">
        <checkbox v-model="Continue" @on-change="OkContinueChange" style="margin-left:20px; float: left;line-height: 36px">
          保存并继续
        </checkbox>
        <Button class="xy-modal-close" @click="Cancel()">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="Ok()">保存</Button>
      </div>
    </modal>

    <modal
      v-model="modalEdit"
      :transfer="false"
      title="编辑考场"
      :loading="loading"
      :mask-closable="false"
      >
      <div class="dialog-model-content">
        <i-form
          ref="formValidate"
          :model="formValidate"
          label-position="left"
          :label-width="100"
          :rules="ruleValidate"
          >
          <form-item label="考场名称" labelFor="examNameE" prop="ExamSetName">
            <i-input v-model="formValidate.ExamSetName" style="width: 270px" elementId="examNameE" clearable></i-input>
          </form-item>
          <form-item label="教学楼" prop="ExamSetBuild">
            <i-select v-model="formValidate.ExamSetBuild" style="width: 270px" ref="editbuild" @on-change="BuildChange">
              <i-option
                v-for="buildItem in BuildList"
                :value="buildItem.BuildingID"
                :key="buildItem.BuildingID"
                v-cloak
                >
                {{ buildItem.BuildingName }}{{buildItem.IsCurrent?'（当前校区）':''}}
              </i-option>
            </i-select>
          </form-item>
          <form-item label="教室" prop="ExamSetRoom">
            <i-select v-model="formValidate.ExamSetRoom" style="width: 270px" ref="editclassroom" @on-change="RoomChange">
              <i-option
                v-for="roomItem in RoomList"
                :value="roomItem.HouseID"
                :key="roomItem.HouseID"
                v-cloak
                >
                {{ roomItem.HouseName }}
              </i-option>
            </i-select>
          </form-item>
          <form-item label="人数" labelFor="numberE" prop="ExamSetNumber">
            <input-number
              style="width: 270px"
              v-model="formValidate.ExamSetNumber"
              elementId="numberE"
              :min="1"
              :max="99"
              clearable
              >
            </input-number>
          </form-item>
        </i-form>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="editCancel">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="editOk">保存</Button>
      </div>
    </modal>

    <modal
      v-model="changeSeat"
      :transfer="false"
      title="调考场序号"
      :loading="loading"
      width="700"
      :mask-closable="false"
      @on-ok="SerialOk"
      ok-text="保存"
      @on-cancel="SerialCancel"
      >
      <div class="dialog-model-content">
        <Alert show-icon closable style="width: 336px">选择两个考场进行互换。</Alert>
        <div >
          <i-form
            class="modal-flex"
            ref="formValidateSerialOK"
            :model="formValidateSerialOK"
            :rules="ruleValidateSerialOK"
            style="width:100%;"
            >
              <form-item prop="RoomIDL" style="width:300px;">
              <span>当前考场：</span>
                <i-select v-model="formValidateSerialOK.RoomIDL" style="width:300px;">
                  <i-option
                    v-for="item in datatable"
                    :value="item.ArrangeSupervisorExamRoomID"
                    :key="item.ArrangeSupervisorExamRoomID"
                    >
                    {{item.RoomOrder}}、{{item.ArrangeSupervisorExamRoomName}}（{{item.BuildingName}}{{item.HouseName}}）
                  </i-option>
                </i-select>
              </form-item>
              <Icon type="md-repeat" size="20" style="margin-top: 36px" />
              <form-item label="" prop="RoomIDR" style="width:300px;">
              <span>互换考场：</span>
                <i-select v-model="formValidateSerialOK.RoomIDR" style="width:300px;">
                  <i-option
                    v-for="item in datatable"
                    :value="item.ArrangeSupervisorExamRoomID"
                    :key="item.ArrangeSupervisorExamRoomID"
                    >
                    {{item.RoomOrder}}、{{item.ArrangeSupervisorExamRoomName}}（{{item.BuildingName}}{{item.HouseName}}）
                  </i-option>
                </i-select>
              </form-item>
          </i-form>
        </div>
      </div>
      <div slot="footer">
        <checkbox v-model="SerialContinue" @on-change="OkSerialChange" style="margin-left:20px;float:left;line-height:36px">
          保存并继续
        </checkbox>
        <Button @click="SerialCancel" class="xy-modal-close">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="SerialOk">保存</Button>
      </div>
    </modal>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: {
      XyAntTable
    },
    name: 'ExamSettingRoom',
    data () {
      return {
        txt: '您还没有考场设置的信息，请添加考场。',
        direction: '有排考结果后“考试教室设置”不可更改，若需更改，请先删除排考结果。',
        tableLoading: true,
        ArrangeSupervisorExamID: 0,
        modal_loading: false,
        apiPath: `${this.$store.state.apiPath}/api/ArrangeExamSetting/`,
        modalCreate: false,
        isInitial: true, // 页面加载loading
        isEmpty: false, // 数据是否为空
        loading: true,
        changeSeat: false,
        modalEdit: false,
        schoolID: 0,
        buildingTypeID: 0,
        SchoolDistrictID: 0,
        BuildingList: [],
        buildingID: 0,
        BuildingName: '',
        HouseName: '',
        isClick: true,
        columns: [
          {
            title: '序号',
            dataIndex: 'RoomOrder',
            width: 80
          },
          {
            title: '考场名称',
            dataIndex: 'ArrangeSupervisorExamRoomName',
            scopedSlots: { customRender: 'ArrangeSupervisorExamRoomName' }
          },
          {
            title: '教学楼',
            dataIndex: 'BuildingName',
            width: 200
          },
          {
            title: '教室',
            dataIndex: 'HouseName',
            width: 200
          },
          {
            title: '考生人数',
            dataIndex: 'StudentCount',
            width: 120
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 120,
            scopedSlots: { customRender: 'action' }
          }
        ],
        datatable: [], // table数据
        // 创建模型验证
        formValidateOk: {
          ExamSetName: '',
          ExamSetBuild: '',
          ExamSetRoom: '',
          ExamSetNumber: 1
        },
        ruleValidateOK: {
          ExamSetName: [
            { required: true, message: '考场名称不能为空', trigger: 'blur' },
            { type: 'string', max: 8, message: '考场名称不能超过8个字', trigger: 'blur' }
          ],
          ExamSetBuild: [
            { type: 'number', required: true, message: '请选择教学楼', trigger: 'change' }
          ],
          ExamSetRoom: [
            { type: 'number', required: true, message: '请选择教室', trigger: 'change' }
          ],
          ExamSetNumber: [
            { type: 'number', required: true, message: '请输入教室人数', trigger: 'change' }
          ]
        },
        formValidate: {
          ExamSetName: '',
          ExamSetBuild: '',
          ExamSetRoom: '',
          ExamSetNumber: 1
        },
        ruleValidate: {
          ExamSetName: [
            { required: true, message: '考场名称不能为空', trigger: 'blur' },
            { type: 'string', max: 8, message: '考场名称不能超过8个字', trigger: 'blur' }
          ],
          ExamSetBuild: [
            { type: 'number', required: true, message: '请选择教学楼', trigger: 'change' }
          ],
          ExamSetRoom: [
            { type: 'number', required: true, message: '请选择教室', trigger: 'change' }
          ],
          ExamSetNumber: [
            { type: 'number', required: true, message: '请输入教室人数', trigger: 'change' }
          ]
        },
        // 调序号
        formValidateSerialOK: {
          RoomIDL: '',
          RoomIDR: ''
        },
        ruleValidateSerialOK: {
          RoomIDL: [
            { type: 'number', required: true, message: '请选择当前考场', trigger: 'change' }
          ],
          RoomIDR: [
            { type: 'number', required: true, message: '请选择互换考场', trigger: 'change' }
          ]
        },
        // 教学楼列表
        BuildList: [],
        nowHouseID: '',
        // 教室列表
        RoomList: [],
        RoomTable: [],
        Continue: false,
        selectionAll: [],
        SerialContinue: false,
        types: 0,
        params: this.$store.state.educationAffairs.arrange,
        selectedRowKeys: []
      }
    },
    created () {
      console.log(this.params, this.$store.state.educationAffairs.arrange)
      this.SchoolDistrictID = this.params.SchoolDistrictID
      this.ArrangeSupervisorExamID = this.params.ArrangeSupervisorExamID
      this.getTP()
    },
    computed: {
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange
        }
      }
    },
    methods: {
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      handleTableChange () {
        this.getTP()
      },
      // 获取table列表数据
      async getTP () {
        this.selectedRowKeys = []
        this.selectionAll = []
        this.tableLoading = true
        const params = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID
        }
        let res = await this.xy.get(this.apiPath + 'GetAllArrangeExamRoom', params)
        this.tableLoading = false
        if (res.success) {
          this.isInitial = false
          if (res.data === null || res.data.length < 1) {
            this.isEmpty = true
            this.isClick = true
            this.datatable = []
          } else {
            this.isClick = false
            this.isEmpty = false
            this.datatable = res.data
            // this.pagination.total = res.data.length
          };
          // 保存并继续时调用
          if (this.types === 0 && this.Continue) {
            if (!this.formValidateOk.ExamSetBuild) {
              this.formValidateOk.ExamSetBuild = 0
            };
            this.GetHouseList()
          };
        }
      },
      // 单击删除单个内容触发
      del (id, name) {
        this.xy.confirm('删除', `您确定要删除"'${name}'"吗？`, () => {
          this.toDelet(id)
        })
      },
      async toDelet (id) {
        this.modal_loading = true
        // this.xy.loading()
        this.tableLoading = true
        const params = {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
          ArrangeSupervisorExamRoomIDs: [id]
        }
        let res = await this.xy.post(this.apiPath + 'DeleteArrangeExamRoomByID', params)
        // this.xy.unloading()
        this.tableLoading = false
        this.modal_loading = false
        if (res.success) {
          this.getTP()
          this.xy.msgSuc(res.msg || '删除成功。')
          if (res.data.result.Step === 3) {
            let l = res.data.result.Step + 1
            let arr = JSON.parse(this.params.StepList)
            for (let i = 0; i < l; i++) {
              if (i < l) {
                arr[i].IsDisabled = false
              } else {
                arr[i].IsDisabled = true
              }
            }
            this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
              Steps: res.data.result.Step,
              StepList: JSON.stringify(arr)
            }))
            this.$emit('change', { StepList: arr, step: res.data.result.Step })
          };
        }
      },
      // 单击批量删除触发
      DelAll () {
        this.modal_loading = true
        if (this.selectionAll.length < 1) {
          return this.xy.msgError('请选择要删除的考试教室。')
        }
        this.xy.confirm('批量删除', '您确定要删除选中的所有考试教室吗？', () => {
          this.batchDelete()
        })
      },
      async batchDelete () {
        let idsStr = []
        // this.xy.loading()
        this.tableLoading = true
        idsStr = this.selectionAll.map(val => val.ArrangeSupervisorExamRoomID)
        const params = {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
          ArrangeSupervisorExamRoomIDs: idsStr
        }
        let res = await this.xy.post(this.apiPath + 'DeleteArrangeExamRoomByID', params, true)
        // this.xy.unloading()
        this.tableLoading = false
        this.modal_loading = false
        if (res.success) {
          this.xy.msgSuc(res.msg || '删除成功。')
          this.getTP()
          this.modal_loading = false
          this.selectionAll = []
          if (res.data.result.Step === 3) {
            let l = res.data.result.Step + 1
            let arr = JSON.parse(this.params.StepList)
            for (let i = 0; i < l; i++) {
              if (i < l) {
                arr[i].IsDisabled = false
              } else {
                arr[i].IsDisabled = true
              }
            }
            this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
              Steps: res.data.result.Step,
              StepList: JSON.stringify(arr)
            }))
            this.$emit('change', { StepList: arr, step: res.data.result.Step })
          };
        } else {
          return this.xy.msgError(res.msg || '批量删除失败。')
        }
      },
      async edit (row, types) {
        if (!this.params.isEdit) return
        this.types = types
        this.nowHouseID = row.HouseID

        this.BuildList = []
        this.ArrangeSupervisorExamRoomID = row.ArrangeSupervisorExamRoomID
        // this.xy.loading()
        this.tableLoading = true
        const params = {
          schoolID: this.schoolID,
          buildingTypeID: this.buildingTypeID
        }
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetBuilding`, params)
        // this.xy.unloading()
        this.tableLoading = false
        if (res.success) {
          res.data.forEach((item) => {
            this.$set(item, 'IsCurrent', false)
          })
          let activeList = []
          let otherList = []
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].SchoolDistrictID === this.params.SchoolDistrictID) {
              res.data[i].IsCurrent = true
              activeList.push(res.data[i])
            } else {
              otherList.push(res.data[i])
            };
          };
          this.BuildList = activeList.concat(otherList)
          this.formValidate.ExamSetBuild = row.BuildingID
          this.BuildingName = row.BuildingName
          this.xy.loading()
          const params1 = {
            buildingID: row.BuildingID
          }
          let res1 = await this.xy.get(`${this.xyApi}/xy/comm/GetHouseList`, params1)
          this.xy.unloading()
          if (res1.success) {
            let dataList = res1.data
            if (this.datatable.length && dataList.length) {
              for (let j = 0; j < this.datatable.length; j++) {
                for (let i = 0; i < dataList.length; i++) {
                  if (dataList[i].HouseID === this.datatable[j].HouseID && row.HouseID !== dataList[i].HouseID) {
                    dataList.splice(i, 1)
                  }
                }
              }
            }
            this.RoomList = dataList
            this.formValidate.ExamSetRoom = row.HouseID
          }
        }
        this.HouseName = row.HouseName
        this.formValidate.ExamSetName = row.ArrangeSupervisorExamRoomName
        this.formValidate.ExamSetNumber = row.StudentCount
        this.modalEdit = true
      },
      editOk () {
        this.$refs.formValidate.validate((valid) => {
          if (valid) {
            let BuildingName = ''; let HouseName = ''
            for (let i = 0; i < this.BuildList.length; i++) {
              if (this.formValidate.ExamSetBuild === this.BuildList[i].BuildingID) {
                BuildingName = this.BuildList[i].BuildingName
              }
            }
            for (let j = 0; j < this.RoomList.length; j++) {
              if (this.formValidate.ExamSetRoom === this.RoomList[j].HouseID) {
                HouseName = this.RoomList[j].HouseName
              }
            }
            this.toEdit(BuildingName, HouseName)
          }
        })
      },
      async toEdit (BuildingName, HouseName) {
        // this.xy.loading()
        this.tableLoading = true
        const params = {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
          ArrangeSupervisorExamRoomID: this.ArrangeSupervisorExamRoomID,
          ArrangeSupervisorExamRoomName: this.formValidate.ExamSetName,
          BuildingID: this.formValidate.ExamSetBuild,
          BuildingName: BuildingName,
          HouseID: this.formValidate.ExamSetRoom,
          HouseName: HouseName,
          StudentCount: this.formValidate.ExamSetNumber
        }
        let res = await this.xy.post(this.apiPath + 'EditArrangeExamRoom', params, true)
        // this.xy.unloading()
        this.tableLoading = false
        if (res.success) {
          this.xy.msgSuc(res.msg || '编辑成功。')
          this.getTP()
          this.modalEdit = false
          this.$refs.editbuild.clearSingleSelect()
          this.$refs.editclassroom.clearSingleSelect()
        } else {
          this.modal_loading = false
          this.modalEdit = false
          this.xy.msgError(res.msg || '编辑失败。')
          this.$refs.editbuild.clearSingleSelect()
          this.$refs.editclassroom.clearSingleSelect()
        };
        this.nowHouseID = ''
      },
      editCancel () {
        this.modalEdit = false
        this.$refs.editbuild.clearSingleSelect()
        this.$refs.editclassroom.clearSingleSelect()
        this.nowHouseID = ''
      },

      // 获取场馆楼
      async GetBuilding () {
        // this.xy.loading()
        const params = {
          schoolID: this.schoolID,
          buildingTypeID: this.buildingTypeID
        }
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetBuilding`, params)
        // this.xy.unloading()
        if (res.success) {
          let data = res.data
          let activeList = []
          let otherList = []
          data.forEach((item) => {
            this.$set(item, 'IsCurrent', false)
          })
          for (let i = 0; i < data.length; i++) {
            if (data[i].SchoolDistrictID === this.params.SchoolDistrictID) {
              data[i].IsCurrent = true
              activeList.push(data[i])
            } else {
              otherList.push(data[i])
            }
          }
          this.BuildList = activeList.concat(otherList)
        }
      },

      // 根据场馆获取场室
      async GetHouseList () {
        let dataList = []
        this.RoomList = []
        if (this.types === 0) {
          this.formValidateOk.ExamSetRoom = ''
        } else {
          this.formValidate.ExamSetRoom = ''
        };
        // this.xy.loading()
        const params = {
          buildingID: this.types === 0 ? this.formValidateOk.ExamSetBuild : this.formValidate.ExamSetBuild
        }
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetHouseList`, params)
        // this.xy.unloading()
        if (res.success) {
          dataList = res.data
          if (this.datatable.length > 0) {
            if (dataList.length > 0) {
              for (let j = 0; j < this.datatable.length; j++) {
                for (let i = 0; i < dataList.length; i++) {
                  if (this.types === 1) {
                    if (dataList[i].HouseID === this.datatable[j].HouseID && this.nowHouseID !== dataList[i].HouseID) {
                      dataList.splice(i, 1)
                    }
                  } else {
                    if (dataList[i].HouseID === this.datatable[j].HouseID) {
                      dataList.splice(i, 1)
                    };
                  };
                };
              };
            };
          };
          this.RoomList = dataList
        }
      },
      // 添加教室
      Create () {
        this.GetBuilding()
        this.modalCreate = true
      },
      Ok () {
        this.$refs.formValidateOk.validate((valid) => {
          if (valid) {
            let BuildingName = ''
            let HouseName = ''
            for (let i = 0; i < this.BuildList.length; i++) {
              if (this.formValidateOk.ExamSetBuild === this.BuildList[i].BuildingID) {
                BuildingName = this.BuildList[i].BuildingName
              }
            }
            for (let j = 0; j < this.RoomList.length; j++) {
              if (this.formValidateOk.ExamSetRoom === this.RoomList[j].HouseID) {
                HouseName = this.RoomList[j].HouseName
              }
            }
            this.toOk(BuildingName, HouseName)
          }
        })
      },
      async toOk (BuildingName, HouseName) {
        // this.xy.loading()
        this.tableLoading = true
        const params = {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
          ArrangeSupervisorExamRoomName: this.formValidateOk.ExamSetName,
          BuildingID: this.formValidateOk.ExamSetBuild,
          BuildingName: BuildingName,
          HouseID: this.formValidateOk.ExamSetRoom,
          HouseName: HouseName,
          StudentCount: this.formValidateOk.ExamSetNumber
        }
        let res = await this.xy.post(this.apiPath + 'CreateArrangeExamRoom', params, true)
        // this.xy.unloading()
        this.tableLoading = false
        if (res.success) {
          if (this.Continue) {
            this.xy.msgSuc(res.msg || '创建成功。')
            // 保存并继续
            this.formValidateOk.ExamSetName = ''
            this.formValidateOk.ExamSetRoom = ''
            this.buildingID = this.formValidateOk.ExamSetBuild
            this.getTP()
            this.modalCreate = true
            this.Continue = true
          } else {
            this.xy.msgSuc(res.msg || '创建成功。')
            this.getTP()
            this.$refs.formValidateOk.resetFields()
            this.modalCreate = false
            this.Continue = false
          };
          // this.params.lens = res.data.result.Step
          let l = res.data.result.Step + 1
          // console.log(l)
          let arr = JSON.parse(this.params.StepList)
          for (let i = 0; i < l; i++) {
            if (i < l) {
              arr[i].IsDisabled = false
            }
          }
          this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
            Steps: res.data.result.Step,
            StepList: JSON.stringify(arr)
          }))
          this.$emit('change', { StepList: arr, step: res.data.result.Step })
        // console.log(arr)
        // console.log(this.params)
        // for (let i = 0; i < l; i++) {
        //   this.params.StepList[i].IsDisabled = false
        // };
        } else {
          this.modal_loading = false
          this.modalCreate = false
          this.xy.msgError(res.msg || '创建失败。')
          this.$refs.formValidateOk.resetFields()
        }
      },
      Cancel () {
        this.$refs.formValidateOk.resetFields()
        this.modalCreate = false
        this.Continue = false
      },

      OkContinue () {
        this.$refs.formValidateOk.validate((valid) => {
          if (valid) {
            let BuildingName = ''; let HouseName = ''
            for (let i = 0; i < this.BuildList.length; i++) {
              if (this.formValidateOk.ExamSetBuild === this.BuildList[i].BuildingID) {
                BuildingName = this.BuildList[i].BuildingName
              }
            }
            for (let j = 0; j < this.RoomList.length; j++) {
              if (this.formValidateOk.ExamSetRoom === this.RoomList[j].HouseID) {
                HouseName = this.RoomList[j].HouseName
              }
            }
            this.toOkContinue(BuildingName, HouseName)
          }
        })
      },
      async toOkContinue (BuildingName, HouseName) {
        // this.xy.loading()
        this.tableLoading = true
        const params = {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
          ArrangeSupervisorExamRoomName: this.formValidateOk.ExamSetName,
          BuildingID: this.formValidateOk.ExamSetBuild,
          BuildingName: BuildingName,
          HouseID: this.formValidateOk.ExamSetRoom,
          HouseName: HouseName,
          StudentCount: this.formValidateOk.ExamSetNumber
        }
        let res = await this.xy.post(this.apiPath + 'CreateArrangeExamRoom', params)
        // this.xy.unloading()
        this.tableLoading = false
        if (res.success) {
          this.xy.msgSuc(res.msg || '创建成功。')
          this.formValidateOk.ExamSetName = ''
          this.formValidateOk.ExamSetNumber = 1
          this.formValidateOk.ExamSetRoom = ''
          HouseName = ''
          this.buildingID = this.formValidateOk.ExamSetBuild
          this.getTP()
        } else {
          this.modal_loading = false
          this.modalCreate = false
          this.xy.msgError(res.msg || '创建失败。')
          this.$refs.formValidateOk.resetFields()
        };
      },
      OkContinueChange (item) {
        this.Continue = item
      },

      // 选择教学楼
      BuildChange (item) {
        if (this.types === 0) {
          // 新建
          this.formValidateOk.ExamSetBuild = item
          if (this.formValidateOk.ExamSetBuild !== undefined) {
            this.GetHouseList()
          };
        } else {
          // 编辑操作
          this.formValidate.ExamSetBuild = item
          if (this.formValidate.ExamSetBuild !== undefined) {
            this.GetHouseList()
          };
        };
      },

      // 选择教室
      RoomChange (item) {

      },

      // 调整序号
      Serial () {
        this.changeSeat = true
      },

      SerialOk () {
        this.$refs.formValidateSerialOK.validate((valid) => {
          if (valid) {
            this.toSerialOk()
          }
        })
      },
      async toSerialOk () {
        // this.xy.loading()
        this.tableLoading = true
        const params = {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
          RoomIDL: this.formValidateSerialOK.RoomIDL,
          RoomIDR: this.formValidateSerialOK.RoomIDR
        }
        let res = await this.xy.get(this.apiPath + 'ChangeArrangeExamRoomOrder', params)
        // this.xy.unloading()
        this.tableLoading = false
        if (res.success) {
          if (this.SerialContinue) {
            this.changeSeat = true
            this.SerialContinue = true
          } else {
            this.changeSeat = false
            this.SerialContinue = false
          }
          // 保存并继续
          this.xy.msgSuc(res.msg || '调整成功。')
          this.$refs.formValidateSerialOK.resetFields()
          this.getTP()
        } else {
          this.modal_loading = false
          this.changeSeat = false
          this.xy.msgError(res.msg || '调整失败。')
          this.$refs.formValidateSerialOK.resetFields()
        };
      },
      SerialCancel () {
        this.SerialContinue = false
        this.changeSeat = false
        this.$refs.formValidateSerialOK.resetFields()
      },

      OkSerialChange (item) {
        this.SerialContinue = item
      }
    }
  }
</script>
<style lang="less" scoped>
@import '../../Css/ArrangeExamRoom/ExamSettingRoom.less';
</style>
