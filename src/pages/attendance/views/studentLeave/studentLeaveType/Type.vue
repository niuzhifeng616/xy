<template>
  <div class="xy-content-module">
    <div class="xy-content-title">
      <Button class="xy-primary" @click="rulesetModal">规则设置</Button>
      <Button class="xy-info" @click="checksetPage">审批流程设置</Button>
    </div>
    <div class="xy-content-body">
        <!--初始loading-->
        <!-- <div v-if="isInitial" class="no-data-box isInitital-opacity">
            <img class="no-data-img" src="@/assets/common/loading.png" />
        </div> -->
        <!--暂无数据-->
        <div v-if="isEmpty && !isInitial" class="no-data-box">
            <img class="no-data-img" src="@/assets/common/nullData.svg" />
            <span class="no-data-text">
                您还没有请假的信息，请添加请假类型。
            </span>
        </div>
        <div  v-if="!isEmpty && !isInitial" class="app-flex">
            <div class="app-flex-box cursor-p" @click="addType">
                <div>
                    <Icon type="md-add" size="20"></Icon><span class="app-flex-text">添加类型</span>
                </div>
            </div>
            <div v-for="(item, index) in list" :key="index" class="app-flex-box-content">
                <div class="app-flex-box-content-top">
                    <div class="app-flex-box-content-top-flex">
                        <div class="app-flex-box-content-top-flex-left"
                            :style="{backgroundColor:item.LeaveTypeName=='事假'?'#4196FF':item.LeaveTypeName=='病假'?'#EA6666':'#FFB748'}">
                            <i class="iconfont">&#xe6eb;</i>
                        </div>
                        <div class="app-flex-box-content-top-flex-right">
                            <div class="app-flex-box-content-top-flex-right-top">{{item.LeaveTypeName}}</div>
                            <div class="app-flex-box-content-top-flex-right-bottom">{{item.TypeSourceName}}</div>
                        </div>
                    </div>
                </div>
                <div v-if="item.IsDefault" class="app-flex-box-content-bottom default">
                    <div>
                        <Icon type="md-create" class="app-flex-box-icon"></Icon>编辑
                    </div>
                    <div class="app-split">|</div>
                    <div>
                        <Icon type="ios-trash-outline" size="16" class="app-flex-box-icon"></Icon>删除
                    </div>
                </div>
                <div v-else class="app-flex-box-content-bottom">
                    <div class="app-flex-box-content-bottom-edit cursor-p" @click="edit(item)">
                        <Icon type="md-create" class="app-flex-box-icon"></Icon>编辑
                    </div>
                    <div class="app-split">|</div>
                    <div class="app-flex-box-content-bottom-del cursor-p"
                        @click="del(item.LeaveTypeID, item.LeaveTypeName, item.IsUsed)">
                        <Icon type="ios-trash-outline" size="16" class="app-flex-box-icon"></Icon>删除
                    </div>
                </div>
            </div>
        </div>
        <Modal
          v-model="modalCreate"
          :transfer="false"
          title="新增请假类型"
          :loading="loading"
          :mask-closable="false"
          >
            <div class="dialog-model-content">
                <Form ref="formValidateOk" :model="formValidateOk" :rules="ruleValidateOk" :label-width="80">
                  <FormItem label="请假类型" prop="typeValue" labelFor='typeValuess'>
                      <Input elementId='typeValuess' v-model.trim="formValidateOk.typeValue"/>
                  </FormItem>
              </Form>

            </div>
            <div slot="footer">
              <Button class="xy-modal-close" @click="cancel">取消</Button>
              <Button class="xy-modal-primary" shape="circle" @click="ok">确定</Button>
            </div>
        </Modal>
        <Modal
          v-model="modalEdit"
          :transfer="false"
          title="编辑请假类型"
          :loading="loading"
          :mask-closable="false"
          >
            <div class="dialog-model-content">
                <Form ref="formValidateEdit" :model="formValidateEdit" :rules="ruleValidateEdit"
                    @submit.native.prevent>
                    <FormItem label="请假类型" prop="typeValue" labelFor="typeValueAdd" :label-width="80">
                        <Input v-model.trim="formValidateEdit.typeValue" elementId="typeValueAdd" clearable />
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
              <Button class="xy-modal-close" @click="cancel">取消</Button>
              <Button class="xy-modal-primary" shape="circle" @click="editOk">确定</Button>
            </div>
        </Modal>
        <!-- 规则设置 -->
        <Modal
          v-model="modalRuleset"
          :transfer="false"
          title="规则设置"
          :loading="loading"
          :mask-closable="false"
          >
            <div class="dialog-model-content">
                <i-form ref="formValidateRuleSetting" :model="formValidateRuleSetting"
                    :rules="ruleValidateRuleSetting" @submit.native.prevent>
                    <form-item label="请假申请设置：" prop="studentLimit" labelFor="studentLimit">
                        学生/家长可请过去
                        <input-number v-model.trim="formValidateRuleSetting.studentLimit" style="width: 50px;" elementId="studentLimit" :min="0" :precision="0" :editable="true"></input-number>
                        天之内至本学期末的假。
                    </form-item>
                    <form-item label="" prop="teacherLimit" labelFor="teacherLimit">
                        <div style="margin-left: 120px;">
                            教师可请过去
                            <input-number v-model.trim="formValidateRuleSetting.teacherLimit" style="width: 50px;" elementId="teacherLimit" :min="0" :precision="0" :editable="true"></input-number>
                            天之内至本学期末的假。
                        </div>
                    </form-item>

                    <form-item label="注：只能请本学期时间范围内的假。"></form-item>
                </i-form>
            </div>
            <div slot="footer">
              <Button class="xy-modal-close" @click="rulesetCancel">取消</Button>
              <Button class="xy-modal-primary" shape="circle" @click="rulesetOk">确定</Button>
            </div>
        </Modal>
      </div>
  </div>
</template>
<script>
  export default {
    name: 'Type',
    data () {
      return {
        isInitial: true, // 页面加载loading
        isEmpty: false, // 数据是否为空
        modal_loading: false,
        loading: true,
        modalCreate: false, // 创建弹出框默认不展示
        modalAttsSetting: false,
        rebootId: '',
        modalCheckset: false,
        editId: 0, // 要编辑的ID
        modalEdit: false,
        delTip: '', // 删除请假类型弹框提示语
        copyData: [],
        leaveSettingIDArr: [], // 保存抄送设置所需参数
        // 规则设置参数
        modalRuleset: false,
        formValidateOk: {
          typeValue: ''
        },
        ruleValidateOk: {
          typeValue: [
            { required: true, message: '请假类型不能为空', trigger: 'blur' },
            { type: 'string', min: 2, max: 6, message: '请假名称字数不能低于2个字超过6个字', trigger: 'blur' }
          ]
        },
        formValidateEdit: {
          typeValue: ''
        },
        ruleValidateEdit: {
          typeValue: [
            { required: true, message: '请假类型不能为空', trigger: 'blur' },
            { type: 'string', min: 2, max: 6, message: '请假名称字数不能低于2个字超过6个字', trigger: 'blur' }
          ]
        },
        // 规则设置
        formValidateRuleSetting: {
          studentLimit: null,
          teacherLimit: null
        },
        ruleValidateRuleSetting: {
          studentLimit: [
          ],
          teacherLimit: [
          ]
        },
        list: [],
        apiPath: ''
      }
    },
    props: [],
    created () {
      this.apiPath = this.$store.state.apiPath
    },
    mounted () {
      this.$nextTick(() => {
        this.getListData()
      })
    },
    methods: {
      addType () {
        this.$refs.formValidateOk.resetFields()
        this.formValidateOk.typeValue = ''
        this.formValidateEdit.typeValue = ''
        if (this.list.length < 10) {
          this.modalCreate = true
        } else {
          this.xy.msgError('最多创建10种请假类型。')
        }
      },
      async getListData () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/StudentLeaveType/GetTypeAll`, {
            PageIndex: 1,
            PageSize: 15
          }, true
        )
        this.isInitial = false
        if (res.success) {
          if (res.data != null && res.data.length > 0) {
            this.list = res.data
            this.isEmpty = false
          } else {
            this.isEmpty = true
          }
          this.xy.unloading()
        } else {
          this.xy.unloading()
          this.xy.msgError(res.msg)
        }
      },
      // 创建
      changeLoading () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      ok () {
        var _this = this
        this.$refs.formValidateOk.validate(function (valid) {
          if (!valid) {
            return _this.changeLoading()
          } else {
            _this.CreateType()
          }
        })
      },
      // 创建
      async CreateType () {
        this.xy.loading()
        let params = {
          LeaveTypeName: this.formValidateOk.typeValue
        }
        let res = await this.xy.post(
          this.apiPath + `/api/StudentLeaveType/CreateType`, params, true)
        if (res.success) {
          this.xy.msgSuc('创建成功。')
          this.getListData()
          this.modalCreate = false
          this.$refs.formValidateOk.resetFields()
        } else {
          if (Number(res.errorcode) > 0) {
            // 已存在同名的被删除类型
            this.editId = 0
            this.rebootId = Number(res.errorcode)
            this.xy.confirm('重新使用', res.msg, this.enableAttendanceType)
          } else {
            this.xy.msgError(res.msg)
          }
          this.changeLoading()
          this.xy.unloading()
        }
      },
      // 关闭创建/编辑弹框触发
      cancel (name) {
        this.editId = ''
        this.modalCreate = false
        this.modalEdit = false
        this.$refs.formValidateOk.resetFields()
        this.$refs.formValidateEdit.resetFields()
      },

      // 获取规则设置信息
      async getRuleSet () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/StudentLeaveType/GetLeaveSetting`
        )
        this.xy.unloading()
        if (res.success) {
          this.formValidateRuleSetting.studentLimit = res.data.PastDate
          this.formValidateRuleSetting.teacherLimit = res.data.TeacherPastDate
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 规则设置
      async rulesetOk () {
        var studentLimit = this.formValidateRuleSetting.studentLimit
        var teacherLimit = this.formValidateRuleSetting.teacherLimit
        if (studentLimit !== '' && teacherLimit !== '') {
          this.xy.loading()
          let res = await this.xy.post(
            this.apiPath + `/api/StudentLeaveType/CreateLeaveSetting`, {
              PastDate: studentLimit,
              TeacherPastDate: teacherLimit
            }, true
          )
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.modalRuleset = false
            // this.$refs.ruleFormValidateRule.resetFields()
          } else {
            this.changeLoading()
            this.xy.msgError(res.msg)
          }
        } else {
          this.modalRuleset = false
          this.xy.msgError('请假时间设置不能为空。')
        }
        // })
      },

      // 规则设置取消
      rulesetCancel () {
        this.modalRuleset = false
      },
      // 单击表格中编辑按钮触发
      edit (row) {
        this.$refs.formValidateEdit.resetFields()
        this.editId = row.LeaveTypeID
        this.modalEdit = true
        // 名称回写
        this.formValidateEdit.typeValue = row.LeaveTypeName
      },
      // 确认编辑触发
      editOk () {
        var _this = this
        this.$refs.formValidateEdit.validate(function (valid) {
          if (!valid) {
            return _this.changeLoading()
          } else {
            _this.EditType()
          }
        })
      },
      // 编辑
      async EditType () {
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + `/api/StudentLeaveType/EditType`, {
            LeaveTypeID: this.editId,
            LeaveTypeName: this.formValidateEdit.typeValue
          }, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('编辑成功。')
          this.changeLoading()
          this.modalEdit = false
          this.getListData()
          this.$refs.formValidateEdit.resetFields()
        } else {
          if (Number(res.errorcode) > 0) {
            // 已存在同名的被删除类型
            this.rebootId = Number(res.errorcode)
            this.xy.confirm('重新使用', res.msg, this.enableAttendanceType)
          } else {
            this.xy.msgError(res.msg)
          }
          this.changeLoading()
        }
      },
      // 恢复已存在的被删除类型
      async enableAttendanceType () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/StudentLeaveType/EnableLeaveType?TargetLeaveID=` + this.rebootId + '&SourceLeaveID=' + this.editId + ''
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('恢复成功。')
          this.getListData()
        }
        this.modalEdit = false
        this.modalCreate = false
      },
      // 单击删除单个内容触发
      del (id, name, isUsed) {
        var _this = this
        if (isUsed) {
          _this.delTip = '此请假类型已被使用过，删除后请假统计将不再统计此类型，是否确认删除？'
        } else {
          _this.delTip = '是否确认删除？'
        }
        this.$Modal.confirm({
          title: '删除',
          content: '<p>' + _this.delTip + ' </p>',
          onOk: function () {
            _this.modal_loading = true
            _this.xy.post(
              _this.apiPath + `/api/StudentLeaveType/DeleteType?typeid=` + id).then(res => {
              if (res.success) {
                _this.xy.msgSuc('删除成功。')
                _this.modal_loading = false
                _this.getListData()
              } else {
                _this.modal_loading = false
                _this.xy.msgError(res.msg)
              }
              _this.xy.unloading()
            })
          },
          onCancel: function () { }
        })
      },
      changeCopy (data) {
        this.leaveSettingIDArr = []
        this.leaveSettingIDArr.push(this.copyData[0].LeaveSettingID)
        for (var i = 0; i < data.length; i++) {
          this.leaveSettingIDArr.push(data[i])
        }
      },
      // 规则设置弹框
      rulesetModal () {
        this.modalRuleset = true
        this.getRuleSet()
      },
      // 跳转审批设置页面
      checksetPage () {
        this.$store.commit('common/getThreeMenuName', '审批流程设置')
        this.$router.push({
          path: '/xyHome/Workflow',
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.app-flex {
    display: flex;
    flex-wrap: wrap;
}

.app-flex-box,
.app-flex-box-content {
    width: 290px;
    height: 160px;
    margin-right: 20px;
    margin-bottom: 20px;
    background: #fff;
}

.app-flex-box {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #d9d9d9;
}

    .app-flex-box > div {
        color: #8c8c8c;
    }

.app-flex-box-content {
    display: flex;
    flex-flow: column;
    border: 1px solid #e9e9e9;
}

    .app-flex-box-content .app-flex-box-content-top {
        flex: 1;
    }

        .app-flex-box-content .app-flex-box-content-top .app-flex-box-content-top-flex {
            height: 48px;
            display: flex;
            align-items: center;
            margin: 20px 0 0 20px;
        }

            .app-flex-box-content .app-flex-box-content-top .app-flex-box-content-top-flex .app-flex-box-content-top-flex-left {
                width: 48px;
                height: 48px;
                border-radius: 10px;
                margin-right: 18px;
                background-image: url(/image/seticon.png);
                background-size: 22px;
                background-position: center;
                background-repeat: no-repeat;
            }
            .app-flex-box-content .app-flex-box-content-top .app-flex-box-content-top-flex .app-flex-box-content-top-flex-left > i {
                text-align: center;
                line-height: 48px;
                display: block;
                font-size: 22px;
                color: #fff;
            }

            .app-flex-box-content .app-flex-box-content-top .app-flex-box-content-top-flex .app-flex-box-content-top-flex-right {
                display: flex;
                flex-flow: column;
            }

                .app-flex-box-content .app-flex-box-content-top .app-flex-box-content-top-flex .app-flex-box-content-top-flex-right .app-flex-box-content-top-flex-right-top {
                    color: #000;
                    font-size: 16px;
                    font-weight: 700;
                }

                .app-flex-box-content .app-flex-box-content-top .app-flex-box-content-top-flex .app-flex-box-content-top-flex-right .app-flex-box-content-top-flex-right-bottom {
                    color: #999;
                    font-size: 14px;
                }

.app-flex-box-content .app-flex-box-content-bottom {
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(249,250,251,1);
    color: #878889;
}

    .app-flex-box-content .app-flex-box-content-bottom .app-flex-box-icon {
        margin-right: 10px;
        color: #878889;
    }

    .app-flex-box-content .app-flex-box-content-bottom.default {
        background: rgba(249,250,251,.5);
        color: rgba(135,136,137,.45);
    }

        .app-flex-box-content .app-flex-box-content-bottom.default .app-flex-box-icon {
            margin-right: 10px;
            color: #E8E8E8;
        }

    .app-flex-box-content .app-flex-box-content-bottom > div {
        flex: 4;
        text-align: center;
    }

        .app-flex-box-content .app-flex-box-content-bottom > div.app-split {
            flex: 1;
            text-align: center;
            color: #e8e8e8;
        }
    .app-flex-box-content .app-flex-box-content-bottom .app-flex-box-content-bottom-edit:hover,
    .app-flex-box-content .app-flex-box-content-bottom .app-flex-box-content-bottom-edit:hover .app-flex-box-icon {
        color: #4196ff;
    }

    .app-flex-box-content .app-flex-box-content-bottom .app-flex-box-content-bottom-del:hover,
    .app-flex-box-content .app-flex-box-content-bottom .app-flex-box-content-bottom-del:hover .app-flex-box-icon {
        color: #f5222d;
    }

.app-flex-text {
    font-size: 16px;
    margin-left: 5px;
}
</style>
