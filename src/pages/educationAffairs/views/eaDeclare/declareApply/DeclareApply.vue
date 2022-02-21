<template>
<!-- 课程申报-审批 -->
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
        <div class="fr">
            <i-select v-model="DeclareState"
                      @on-change="typeValueSearch"
                      class="fl xy-content-title-search"
                      style="width:150px;">
                <i-option :value="0" :key="0">所有状态</i-option>
                <i-option v-for="types in approvalValue" :value="types.approvalID" :key="types.approvalID" v-cloak>{{ types.approvalName }}</i-option>
            </i-select>
            <i-input search
                     v-model="searchName"
                     @on-search="FromSubmit"
                     placeholder="输入课程名称"
                     class="fr xy-content-title-search"
                     style="width: auto;">
                <icon type="ios-search cursor-p" slot="suffix" />
            </i-input>
        </div>
    </div>
    <div class="xy-content-body">
        <XyTable
      @changeSelect="changeSelect"
      @changePage="changePage"
      @changePageSize="changePageSize"
      :tbColumns="columns"
      :tbData="columnsData"
      :pageSize="pageSize"
      :pageIndex="pageIndex"
      :total="total">
    </XyTable>
        <modal :styles="{top:'60px'}"
               v-model="modalApp"
               :transfer="false"
               v-cloak
               title="课程审批"
               :loading="loading"
               :mask-closable="false"
               :closable="false"
               @on-ok="editApp"
               @on-cancel="cancel">
            <div class="dialog-model-content">
                <i-form :label-width="100" id="applyIsPass">
                    <form-item label="课程名称">
                        <div class="apply-names">{{DeclareSujectName}}</div>
                    </form-item>
                    <form-item label="申报时间">
                        <div class="apply-names">{{CreateByDate}}</div>
                    </form-item>
                    <form-item label="课程描述">
                        <div class="apply-names">{{DeclareSujectDescribe}}</div>
                    </form-item>
                    <form-item label="附件">
                        <span class="apply-names" style="display:inline-block;margin-right:5px;">{{DeclareFileState}}</span>
                        <i-button class="info" ghost v-if="isDown" size="small" @click="download">下载</i-button>
                    </form-item>
                    <form-item label="审批">
                        <radio-group v-model="DeclareStateType" @on-change="change">
                            <radio label="1">
                                <span>通过</span>
                            </radio>
                            <radio label="0">
                                <span>拒绝</span>
                            </radio>
                        </radio-group>
                    </form-item>
                    <form-item label="拒绝原因" v-if="isApprove">
                        <i-input v-model="ApproveOpinion" type="textarea"></i-input>
                    </form-item>
                    <form-item label="" v-if="isShowType">
                        <i-select v-model="DisciplineID"
                                  class="fl"
                                  style="width:180px;">
                            <i-option :value="0" :key="0">请选择学科</i-option>
                            <i-option v-for="item in Discipline" :value="item.DisciplineID" :key="item.DisciplineName">{{ item.DisciplineName }}</i-option>
                        </i-select>
                        <i-select v-model="SubjectCategoryID"
                                  class="fl xy-content-title-search"
                                  style="width:180px;">
                            <i-option :value="0" :key="0">请选择校本分类</i-option>
                            <i-option v-for="item in SubjectCategory" :value="item.SubjectCategoryID" :key="item.SubjectCategoryName">{{ item.SubjectCategoryName }}</i-option>
                        </i-select>
                    </form-item>
                </i-form>
            </div>
        </modal>
        <modal v-model="modalShow"
               :transfer="false"
               v-cloak
               title="查看申报课程"
               :loading="loading"
               :mask-closable="false"
               :closable="false"
               @on-cancel="cancelView">
            <div class="dialog-model-content">
                <i-form :label-width="100" id="applyIsPass">
                    <form-item label="课程名称">
                        <div class="apply-names">{{DeclareSujectName}}</div>
                    </form-item>
                    <form-item label="申报时间">
                        <div class="apply-names">{{CreateByDate}}</div>
                    </form-item>
                    <form-item label="课程描述">
                        <div class="apply-names">{{DeclareSujectDescribe}}</div>
                    </form-item>
                    <form-item label="附件">
                        <span class="apply-names" style="display:inline-block;margin-right:5px;">{{DeclareFileState}}</span>
                        <i-button class="info" ghost v-if="isDown" size="small" @click="download">下载</i-button>
                    </form-item>
                    <form-item label="拒绝原因" v-if="isShow">
                        <div class="apply-names">{{ApproveOpinion}}</div>
                    </form-item>

                    <form-item label="状态" prop="textarea">
                        <div class="apply-names">{{DeclareStateName}}</div>
                    </form-item>
                </i-form>
            </div>
            <div slot="footer">
                <i-button class="default" size="large" @click="cancelView">关闭</i-button>
            </div>
        </modal>
    </div>
</div>

</template>
<script>
  import XyTable from '@/components/table/XyTable.vue'
  export default {
    name: 'DeclareApply',
    components: {
      XyTable
    },
    data () {
      return {
        modal_loading: false,
        loading: true,
        modalCreate: false, // 创建弹出框默认不展示
        searchName: '',
        editId: 0, // 要编辑的ID
        modalShow: false,
        modalApp: false,
        isApprove: false,
        isShowType: true,
        isDown: false,
        DeclareSujectName: '',
        CreateByDate: '',
        DeclareState: 0,
        DeclareSujectDescribe: '',
        DeclareFileState: '',
        ApproveOpinion: '',
        DeclareStateName: '',
        DeclareStateType: '1',
        filepath: '',
        isShow: false,
        isShowUpload: true, // 弹出框导入
        isShowSpin: false,
        uploadFail: false,
        uploadFailSuccess: false,
        uploadPath: `${this.$store.state.apiPath}/api/Declare/Upload`,
        Discipline: [],
        SubjectCategory: [],
        DisciplineID: 0,
        SubjectCategoryID: 0,
        approvalValue: [
          {
            'approvalID': 1,
            'approvalName': '待审批'
          },
          {
            'approvalID': 2,
            'approvalName': '已通过'
          },
          {
            'approvalID': 3,
            'approvalName': '已拒绝'
          },
          {
            'approvalID': 4,
            'approvalName': '已撤销'
          }
        ],
        columns: [],
        columnsData: [],
        total: 0,
        pageSize: 15,
        pageIndex: 1
      }
    },
    created: function () {},
    mounted: function () {
      this.$nextTick(function () {
        this.loadTable()
      })
    },
    methods: {
      changeSelect (selction) {

      },
      changePage (index) {
        this.pageIndex = index
      },
      changePageSize (size) {
        this.pageSize = size
      },
      loadTable: function () {
        var that = this
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/Declare/GetAll`, {
          DeclareState: that.DeclareState,
          seachText: that.searchName,
          pageIndex: that.pageIndex,
          pageSize: that.pageSize
        }).then(res => {
          if (res.success) {
            that.xy.unloading()
            that.total = res.data.totalRecords
            that.columns = [
              {
                title: '课程名称',
                key: 'DeclareSujectName',
                width: 180,
                render: function (h, params) {
                  return h('div', [
                    h('span', {
                      domProps: {
                        innerHTML: '<div class="nowrap table-el-hover">' + (params.row.DeclareSujectName == null ? '--' : params.row.DeclareSujectName) + '</div>'
                      },
                      attrs: {
                        title: params.row.DeclareSujectName
                      },
                      on: {
                        click: function () {
                          if (params.row.DeclareState === 1) { that.edit(params.row) }
                        }
                      }
                    })
                  ])
                }
              },
              {
                title: '申报人',
                key: 'CreateByName'
              },
              {
                title: '审批状态',
                key: 'DeclareState',
                align: 'center',
                render: function (h, params) {
                  return h('div', [
                    h('span', {
                      domProps: {
                        innerHTML: params.row.DeclareState === 1 ? '待审批' : params.row.DeclareState === 2 ? '已通过' : params.row.DeclareState === 3 ? '已拒绝' : params.row.DeclareState === 4 ? '已撤销' : ''
                      },
                      style: {
                        color: params.row.DeclareState === 1 ? '#5cadff' : params.row.DeclareState === 2 ? '#19be6b' : params.row.DeclareState === 3 ? '#f05a4a' : params.row.DeclareState === 4 ? '#f90' : ''
                      }
                    })
                  ])
                }
              },
              {
                title: '附件',
                key: 'DeclareFileState'
              },
              {
                title: '申报时间',
                key: 'CreateByDate'
              },
              {
                title: '操作',
                key: 'operation',
                width: 150,
                render: function (h, params) {
                  return h('div', {
                    'class': {
                      oprateList: true
                    }
                  }, [
                    h('a', {
                      'class': {
                        oprateBtn1: true,
                        disabled: params.row.DeclareState !== 1
                      },
                      on: {
                        click: () => {
                          if (params.row.DeclareState === 1) { that.edit(params.row) }
                        }
                      }
                    }, '审批'),
                    h('a', {
                      'class': {
                        oprateBtn1: true
                      },
                      on: {
                        click: () => {
                          that.show(params.row)
                        }
                      }
                    }, '查看')
                  ])
                }
              }
            ]
            that.columnsData = res.data.data
            for (var i in that.columnsData) {
              that.columnsData[i].CreateByDate = that.xy.moment(that.columnsData[i].CreateByDate).format('YYYY-MM-DD HH:mm:ss')
            }
          } else {
            that.xy.unloading()
            that.xy.msgError(res.msg)
          }
        })
        // xy.http.load(xy.webUrl + '/View/components/View/Tablemix.html', {
        //   targetID: 'Tablemix',
        //   loadParams: {
        //     'tableUrl': xy.string.format('{0}/api/Declare/GetAll', xy.subMenuServiceUrl),
        //     'nullData': '暂无课程',
        //     'tableOption': {
        //       DeclareState: that.DeclareState,
        //       seachText: that.searchName
        //     },
        //     columns: that.columns
        //   }
        // })
      },
      typeValueSearch: function (val) {
        this.pageIndex = 1
        this.DeclareState = val
        // Tablemix.option.seachText = this.searchName
        this.loadTable()
      },
      // 关闭创建/编辑弹框触发
      cancel: function () {
        this.uploadFail = false
        this.isShowUpload = true
        this.uploadFailSuccess = false
        this.isShow = false
        this.modalApp = false
      },
      cancelView: function () {
        this.modalShow = false
        this.isShow = false
        this.isDown = false
      },
      // 单击表格中查看按钮触发
      show: function (row) {
        this.modalShow = true
        if (row.DeclareState === 3) {
          this.isShow = true
        }
        if (row.DeclareFile != null && row.DeclareFile.length > 0) {
          this.isDown = true
        }
        this.DeclareSujectName = row.DeclareSujectName
        this.CreateByDate = row.CreateByDate
        this.DeclareSujectDescribe = row.DeclareSujectDescribe
        this.DeclareFileState = row.DeclareFileState
        this.ApproveOpinion = row.ApproveOpinion
        this.DeclareStateName = row.DeclareStateName
        this.filepath = row.DeclareFile
      },
      edit: function (row) {
        var _this = this
        _this.modalApp = true
        // 加载学科
        this.xy.get(`${this.xyApi}/base/api/ClassInfo/EditHonorInfo`, null).then(res => {
          _this.Discipline = res.data.data
        })
        // 加载校本分类
        this.xy.get(`${this.xyApi}/base/api/SubjectCategory/GetAll`, null).then(res => {
          _this.SubjectCategory = res.data.data
        })
        if (row.DeclareFile != null && row.DeclareFile.length > 0) {
          this.isDown = true
        }
        this.DeclareSujectName = row.DeclareSujectName
        this.CreateByDate = row.CreateByDate
        this.DeclareSujectDescribe = row.DeclareSujectDescribe
        this.DeclareFileState = row.DeclareFileState
        this.ApproveOpinion = row.ApproveOpinion
        this.DeclareStateName = row.DeclareStateName
        this.filepath = row.DeclareFile
        this.editId = row.DeclareID
      },
      change: function () {
        if (this.DeclareStateType === 1) {
          this.isApprove = false
          this.isShowType = true
        } else {
          this.isApprove = true
          this.isShowType = false
        }
      },
      // 提交审批
      editApp: function () {
        var _this = this
        if (_this.DeclareStateType === 1) {
          // 同意
          if (_this.DisciplineID <= 0) {
            // xy.message.error(_this, { content: '请选择学科！' })
            _this.xy.msgError('请选择学科！')
            return false
          }
          if (_this.SubjectCategoryID <= 0) {
            // xy.message.error(_this, { content: '请选择校本分类！' })
            _this.xy.msgError('请选择校本分类！')
            return false
          }
          _this.xy.post(`${this.$store.state.apiPath}/api/Declare/Adopt`, {
            DeclareID: _this.editId,
            DeclareSujectName: _this.DeclareSujectName,
            DisciplineID: _this.DisciplineID,
            SubjectCategoryID: _this.SubjectCategoryID
          }).then(res => {
            if (res.data.success) {
              // xy.message.success(_this, { content: '审批成功！' })
              _this.xy.msgSuc('审批成功！')
              _this.cancel()
              _this.loadTable()
              // Tablemix.getTP()
            } else {
              _this.loading = false
              // xy.message.error(_this, { title: '错误信息', content: res.data.msg })
              _this.xy.mError('错误信息', res.data.msg)
            };
          })
        } else {
          if (this.ApproveOpinion == null) { this.ApproveOpinion = '' }
          if (_this.ApproveOpinion != null && (_this.ApproveOpinion.length <= 0 || _this.ApproveOpinion.length > 200)) {
            // xy.message.error(_this, { content: '拒绝原因只能输入1-200个字符,！' })
            _this.xy.msgError('拒绝原因只能输入1-200个字符,！')
            return false
          }
          _this.xy.post(`${this.$store.state.apiPath}/api/Declare/Refuse?declareID=${_this.editId}&approveOpinion=${_this.ApproveOpinion}`, null).then(res => {
            if (res.data.success) {
              // xy.message.success(_this, { content: '审批成功！' })
              _this.xy.msgSuc('审批成功！')
              _this.cancel()
              _this.loadTable()
            } else {
              _this.loading = false
              // xy.message.error(_this, { title: '错误信息', content: res.data.msg })
              _this.xy.mError('错误信息', res.data.msg)
            };
          })
        }
      },
      download: function () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/Declare/Download?file=${this.filepath}&subjectName=${this.DeclareSujectName}`)
        // xy.http.downFile(xy.string.format('{0}/api/Declare/Download?file={1}&subjectName={2}', xy.subMenuServiceUrl, this.filepath, this.DeclareSujectName))
      },
      // 单击删除单个内容触发
      dele: function (row) {
        var _this = this
        this.xy.confirm({
          title: '删除',
          content: '<p>您确认要删除当前申请吗？</p>',
          onOk: function () {
            _this.xy.post(`${this.$store.state.apiPath}/api/Declare/Delete?declareID=${row.DeclareID}`, null).then(res => {
              if (res.data.success) {
                // xy.message.success(_this, { content: '删除成功！' })
                _this.xy.msgSuc('删除成功！')
              } else {
                // xy.message.error(_this, { title: '错误信息', content: res.data.msg })
                _this.xy.mError('错误信息', res.data.msg)
              };
              // if (Tablemix.pageList > 1) {
              //   Tablemix.pageList = Tablemix.pageList - 1
              // } else {
              //   if (Tablemix.option.PageIndex > 1) {
              //     Tablemix.option.PageIndex = Tablemix.option.PageIndex - 1
              //   };
              // };
              if (_this.total > 1) {
                _this.total = _this.total - 1
              } else {
                if (_this.pageIndex > 1) {
                  _this.pageIndex = _this.pageIndex - 1
                }
              }
              _this.loadTable()
            })
          }
        })
      },
      FromSubmit: function () {
        // Tablemix.option.PageIndex = 1
        // Tablemix.option.seachText = this.searchName
        // Tablemix.option.DeclareState = this.DeclareState
        // Tablemix.getTP()
        this.pageIndex = 1
        // Tablemix.option.seachText = this.searchName
        this.loadTable()
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
