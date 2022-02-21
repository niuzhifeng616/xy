<!-- 创建听评课，发布任务 -->
<template>
  <div>
    <div class="xy-content-body clearfix">
      <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" style="width:800px;margin:0 auto;">
        <form-item label="学科" prop="LectureSubject">
          <i-select v-model="formValidate.LectureSubject">
            <i-option v-for="(item,index) in disciplineList" :value="item.DisciplineID" :key="index" v-cloak>{{ item.DisciplineName }}</i-option>
          </i-select>
        </form-item>
        <form-item label="教室" prop="LectureHouseName">
          <div class="pr">
            <cascader v-model="formValidate.LectureHouseName" size="large" :data="houseList" not-found-text="暂无数据" placeholder="请选择听课地点" @on-change="HouseChange"></cascader>
            <spin size="small" fix v-if="svShowHouse">加载中...</spin>
          </div>
        </form-item>
        <form-item label="时间" prop="LectureDateTime">
          <date-picker :value="formValidate.LectureDateTime" type="datetimerange" :clearable="false" format="yyyy-MM-dd HH:mm" placeholder="开始时间-结束时间" @on-change="dateChange" style="width:300px;" :editable="false"></date-picker>
        </form-item>
        <form-item label="讲课人" prop="LectureTeacher">
          <Icon type="md-add-circle" size="24" color="#19be6b" @click="openAddModal(1)" class="cursor-p fl" style="padding-top: 4px;padding-right: 34px;" />
          <div style="clear:both;"></div>
          <tag v-for="(item,index) in formValidate.LectureTeacher" :key="index" :name="item.FullName" closable @on-close="delTeacher(index)" v-cloak>{{item.FullName}}</tag>
        </form-item>
        <form-item label="听课人" prop="TeacherCount">
          <Icon type="md-add-circle" size="24" color="#19be6b" @click="openAddModal(2)" class="cursor-p fl" style="padding-top: 4px;padding-right: 34px;" />
          <div style="clear:both;"></div>
          <tag v-for="(item,index) in formValidate.TeacherCount" :key="index" :name="item.FullName" closable @on-close="delTeacherCount(index)" v-cloak>{{item.FullName}}</tag>
        </form-item>
        <form-item label="备注" prop="Explain">
          <i-input v-model="formValidate.Explain" :autosize="{minRows: 5,maxRows: 5}" type="textarea"></i-input>
        </form-item>
        <form-item>
          <Button class="xy-btn-primary" shape="circle" @click="createBtn(formValidate)">发布</Button>
          <Button class="xy-btn-close" @click="close">取消</Button>
        </form-item>
      </i-form>
    </div>
    <modal width='90%' :title="titleType" :transfer="false" v-model="addPublic" :loading="loading" :mask-closable="false">
      <row class="cascader-content">
        <i-col span="6" class="cascader-content-left">
          <tree :data="newList" :load-data="newLoadData" @on-select-change="treeSelect"></tree>
        </i-col>
        <i-col span="11" class="cascader-content-center">
          <div class="title-describe title-model">温馨提示：点击左侧栏中的教师组织，从中间栏勾选教师，右侧栏显示已选中的教师</div>

          <div class="cascader-content-center-title clearfix">
            <checkbox v-model="casaderIsAll" class="fl casader-is-all" @on-change="checkAllBtn" v-if="searchName==''">全选</checkbox>
            <i-input search enter-button placeholder="请输入姓名/用户名" v-model="searchName" class="fr casader-search" @on-search="searchNameFun" />
          </div>
          <div v-for="(item,index) in transferData" v-show="transferData.length>0" :key='index'>
            <div class="cascader-content-center-list" v-if="item.childNameStr.indexOf(searchName)>=0 || searchName==''">
              <div class="cascader-content-center-list-border">
                <checkbox v-model="item.checkAll" v-if="searchName==''" size="large" @on-change="handleCheckAll(item)">{{item.label}}</checkbox>
                <span v-else>{{item.label}}</span>
              </div>
              <template v-for="(child,cIndex) in item.memberlist">
                <checkbox size="large" v-if="child.FullName.indexOf(searchName)>=0 || searchName=='' || child.UserName.indexOf(searchName)>=0" :key="cIndex" v-model="child.singleCheck" @on-change="checkAllChange(child)" :title="child.UserName" class="check-name">{{child.FullName}}</checkbox>
              </template>
            </div>
          </div>
          <alert v-if="isDataList" type="warning" show-icon style="margin:0px 0px 20px">
            未查询到相关数据
            <template slot="desc">
              当前分组下暂无数据，请切换分组后重新查找
            </template>
          </alert>
        </i-col>
        <i-col span="7" class="cascader-content-right">
          <div>已选<b>{{checkAllList.length}}</b>人</div>
          <div class="cascader-content-right-list">
            <tag v-for="(item,index) in checkAllList" :key='index' :name="item.FullName" closable @on-close="handleClose" :title="item.UserName">{{item.FullName}}</tag>
          </div>
        </i-col>
      </row>
      <div slot="footer">
        <Button class="xy-modal-close" @click="modalCancel">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="modalAdd">确定</Button>
      </div>
      <spin v-if="isLoadingShow" fix>
        <icon type="ios-loading" size=18 class="spin-icon-load"></icon>
        <div>加载中...</div>
      </spin>
    </modal>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        //= ===多选控件 start====
        isDataList: false,
        addPublic: false, // modal默认false
        isLoadingShow: false, // modal加载动画
        casaderIsAll: false, // 全选
        searchName: '', // 搜索
        newList: [], // 左侧数据
        transferData: [], // 中间数据
        checkAllList: [], // 右侧数据
        checkAllList2: [],
        checkAllGroup: [], // 多选子集合
        //= ===多选控件 end====
        titleType: '',
        changeType: 2,
        attendee: [], // 听课人
        teacherCountName: [],
        addtypes: '',
        disciplineList: [],
        houseList: [],
        svShow: true,
        svShowHouse: true,
        modal_loading: false,
        loading: true,
        modalCreate: false, // 创建弹出框默认不展示
        organizationList: [], // 获取组织
        CreateLectureTeacher: false,
        isLectureTeacherShow: false,
        isTeacherCountShow: false,
        manageUserName: '',
        DisciplineName: '',
        HouseName: '',
        StartTime: '',
        EndTime: '',
        Remarks: '',
        TeacherName: '',
        TeacherNames: '',
        createDate: '',
        formValidate: {
          LectureSubject: '',
          LectureHouseName: [],
          LectureDateTime: null,
          LectureTeacher: [],
          TeacherCount: [],
          Explain: ''
        },
        ruleValidate: {
          LectureSubject: [
            { type: 'number', required: true, message: '科目不能为空', trigger: 'change' }
          ],
          LectureHouseName: [
            { type: 'array', required: true, len: 3, message: '请选择正确的地点', trigger: 'change' }
          ],
          LectureDateTime: [
            { type: 'array', required: true, message: '时间不能为空', trigger: 'change' }
          ],
          LectureTeacher: [
            { type: 'array', required: true, message: '讲课人不能为空', trigger: 'blur' }
          ],
          TeacherCount: [
            { type: 'array', required: true, message: '听课人不能为空', trigger: 'blur' }
          ],
          Explain: [
            { type: 'string', max: 200, message: '备注信息不能超过200个字', trigger: 'blur' }
          ]
        }
      }
    },
    created: function () {
      // 获取学科信息
      this.getDiscipline()
      // 场室
      this.getHouse()
    },
    mounted: function () {
      // this.$nextTick(function () {
      //   xy.breadcrumb.create({ name: '发布听评课任务' })
      // })
      this.$Message.config({
        top: 70,
        duration: 2
      })
    },
    methods: {
      // 科目
      async getDiscipline () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Discipline/GetAllDiscipline`)
        if (res.success) {
          this.disciplineList = res.data
        }
      },
      // 场室
      async  getHouse (value) {
        var _this = this
        let res = await this.xy.get(`${this.$store.state.apiPath}/xy/Comm/GetHouseNodeList`)
        if (res.success) {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].children.length > 0) {
              for (var j = 0; j < res.data[i].children.length; j++) {
                if (res.data[i].children[j].children.length > 0) {
                  for (var k = 0; k < res.data[i].children[j].children.length; k++) {
                    if (res.data[i].children[j].children[k].children.length === 0) {
                      delete res.data[i].children[j].children[k].loading
                    }
                  }
                } else {
                  delete res.data[i].children[j].loading
                }
              }
            } else {
              delete res.data[i].loading
            }
          }
          _this.houseList = res.data
        }
        _this.svShowHouse = false
      },
      // 选择场室
      HouseChange: function (value) {
        this.formValidate.LectureHouseName = value
      },
      // 选择时间
      dateChange: function (val) {
        this.formValidate.LectureDateTime = val
      },
      // 发布听评课
      createBtn (formValidate) {
        this.$refs.formValidate.validate((valid) => {
          if (!valid) {
            return this.changeLoading()
          } else {
            this.publish()
          }
        })
      },
      async  publish () {
        this.xy.loading()
        var newArr = []
        for (var i = 0; i < this.formValidate.TeacherCount.length; i++) {
          newArr.push(this.formValidate.TeacherCount[i].UserID)
        };
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Evaluate/Create`, {
          DisciplineID: this.formValidate.LectureSubject,
          HouseID: this.formValidate.LectureHouseName[2],
          StartTime: this.formValidate.LectureDateTime[0],
          EndTime: this.formValidate.LectureDateTime[1],
          TeacherID: this.formValidate.LectureTeacher[0].UserID,
          teacherIDS: newArr.join(','),
          Remarks: this.formValidate.Explain
        })
        if (res.success) {
          this.changeLoading()
          this.xy.msgSuc('发布成功')
          this.close()
        } else {
          this.$Modal.error({ title: '发布失败', content: res.msg })
        };
        this.xy.unloading()
      },
      close: function () {
        this.$router.push({ path: '/xyHome/evaluate', query: this.$store.state.common.menuInfo })
      },
      delTeacher: function (index) {
        this.formValidate.LectureTeacher.splice(index, 1)
      },
      delTeacherCount: function (index) {
        this.formValidate.TeacherCount.splice(index, 1)
      },
      // 创建
      changeLoading: function () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      // 单击删除单个内容触发
      del: function (row) {
        this.$Modal.confirm({
          title: '撤销',
          content: '<p>您确认要撤销当前听评课任务吗？</p>',
          onOk: function () {
            var _this = this
            this.modal_loading = true
            let res = this.xy.post(`${_this.$store.state.apiPath}/api/Evaluate/Delete/?id=${row.LectureCommentClassTableID}`, null, true)
            if (res.success) {
              if (_this.pageList > 1) {
                _this.pageList = _this.pageList - 1
              } else {
                if (_this.pageCurrent > 1) {
                  _this.pageCurrent = _this.pageCurrent - 1
                };
              };
              var _data = {
                current: _this.pageCurrent,
                size: _this.pageSize
              }
              _this.getTP(_data)
              _this.modal_loading = false
              _this.xy.msgSuc('撤销成功！')
            } else {
              _this.xy.msgError('撤销成功！')
              _this.xy.mError('错误信息', res.msg)
            };
          }
        })
      },
      //= =======多选弹出框 Start =========
      async openAddModal (type) {
        this.changeType = type
        if (type === 1) {
          this.titleType = '添加讲课人'
          if (this.formValidate.LectureTeacher.length > 0) {
            this.xy.msgError('请先移除已添加的讲课人')
            return false
          };
        };
        if (type === 2) {
          this.titleType = '添加听课人'
        };
        this.addPublic = true
        this.isLoadingShow = true
        this.newList = []// 左侧滞空
        this.transferData = []// 中间滞空
        this.checkAllList = []// 右侧滞空
        var _this = this
        let res = await this.xy.get(`${this.$store.state.apiPath}/xy/Comm/GetNodeList`, { id: 0, type: '' })
        if (res.success) {
          var respon = res.data
          for (var i = 0; i < respon.length; i++) {
            _this.newList.push({
              title: respon[i].label,
              loading: false,
              children: [],
              id: respon[i].value,
              nodetype: respon[i].nodetype
            })
          }
        }
        _this.isLoadingShow = false
      },
      async  newLoadData (item, callback) {
        this.isLoadingShow = true
        var _this = this
        let res = await this.xy.get(`${this.$store.state.apiPath}/xy/Comm/GetNodeList`, { id: item.id, type: item.nodetype })
        var data = []
        if (res.data.length > 0) {
          $.each(res.data, function (index, items) {
            if (items.ischild) {
              data.push({
                parentId: item.id,
                parentTitle: item.title,
                parentNodetype: item.nodetype,
                id: items.value,
                title: items.label,
                loading: false,
                nodetype: items.nodetype,
                children: []
              })
            } else {
              data.push({
                parentId: item.id,
                parentTitle: item.title,
                parentNodetype: item.nodetype,
                id: items.value,
                title: items.label,
                nodetype: items.nodetype
              })
            };
          })
        };
        callback(data)
        _this.isLoadingShow = false
      },
      async  treeSelect (data) {
        if (data.length > 0) {
          this.isLoadingShow = true
          var _this = this
          if (data[0].nodetype !== 'S') {
            var tIds = []
            if (_this.formValidate.TeacherCount.length > 0) {
              for (var i = 0; i < _this.formValidate.TeacherCount.length; i++) {
                tIds.push(_this.formValidate.TeacherCount[i].UserID)
              };
            };
            let res = await this.xy.get(`${this.$store.state.apiPath}/xy/Comm/GetNodeListHasmember`, {
              orgID: data[0].id,
              teacherIDs: tIds.length > 0 ? tIds.join(',') : '',
              type: data[0].nodetype
            })
            _this.transferData = []
            if (res.success) {
              if (res.data.length > 0) {
                for (let i = 0; i < res.data.length; i++) {
                  res.data[i].checkAll = false// 每一组的全选按钮
                  res.data[i].checkAllGroup = []// 每一组人集合
                  if (res.data[i].memberlist.length > 0) {
                    _this.isDataList = false
                    for (var j = 0; j < res.data[i].memberlist.length; j++) {
                      res.data[i].memberlist[j].singleCheck = false
                      res.data[i].childNameStr += res.data[i].memberlist[j].FullName + ',' + res.data[i].memberlist[j].UserName + ','
                    };
                    _this.transferData.push(res.data[i])
                    _this.isLoadingShow = false
                  };
                };
                _this.isLoadingShow = false
                // 根据右侧已选人改变渲染的初始数据
                if (_this.checkAllList.length > 0) {
                  for (var d = 0; d < _this.transferData.length; d++) {
                    for (var z = 0; z < _this.transferData[d].memberlist.length; z++) {
                      var f = _this.checkAllList.map(function (val) {
                        return val.UserID
                      }).indexOf(_this.transferData[d].memberlist[z].UserID)
                      if (f !== -1) {
                        _this.transferData[d].memberlist[z].singleCheck = true
                      };
                    };
                    // 所有的全选按钮
                    var all1 = _this.transferData[d].memberlist.map(function (val) {
                      return val.singleCheck
                    }).indexOf(true)
                    if (all1 === -1) { // 全没有ture
                      _this.transferData[d].checkAll = false
                      _this.casaderIsAll = false
                    } else {
                      // 最少有一个true
                      var all2 = _this.transferData[d].memberlist.map(function (val) {
                        return val.singleCheck
                      }).indexOf(false)
                      if (all2 === -1) {
                        _this.transferData[d].checkAll = true
                        _this.casaderIsAll = true
                      } else {
                        _this.transferData[d].checkAll = false
                        _this.casaderIsAll = false
                      };
                    };
                  };
                };
              } else {
                _this.isDataList = true
              };
            } else {
              _this.isDataList = true
            }
          } else {
            _this.isDataList = true
            _this.isLoadingShow = false
            _this.transferData = []
          };
        }
      },
      checkAllBtn: function () { // 全选
        if (this.casaderIsAll) {
          for (var i = 0; i < this.transferData.length; i++) {
            this.transferData[i].checkAll = true
            for (var j = 0; j < this.transferData[i].memberlist.length; j++) {
              this.transferData[i].memberlist[j].singleCheck = true
              // 把选中的添加至右侧
              this.checkAllList.push(this.transferData[i].memberlist[j])
            };
          };
          // 去重
          var obj = {}
          this.checkAllList = this.checkAllList.reduce(function (item, next) {
            // eslint-disable-next-line no-unused-expressions
            obj[next.UserID] ? '' : obj[next.UserID] = true && item.push(next)
            return item
          }, [])
        } else {
          for (var k = 0; k < this.transferData.length; k++) {
            this.transferData[k].checkAll = false
            for (var s = 0; s < this.transferData[k].memberlist.length; s++) {
              this.transferData[k].memberlist[s].singleCheck = false
              for (var m = 0; m < this.checkAllList.length; m++) {
                if (this.checkAllList[m].UserID === this.transferData[k].memberlist[s].UserID) {
                  this.checkAllList.splice(m, 1)
                };
              };
            };
          };
        };
      },
      handleCheckAll: function (item) { // 各个组内的全选按钮
        if (item.checkAll) {
          item.memberlist.map(function (val) {
            // eslint-disable-next-line no-return-assign
            return val.singleCheck = true
          })
          for (var p = 0; p < this.transferData.length; p++) {
            for (var m = 0; m < this.transferData[p].memberlist.length; m++) {
              for (var q = 0; q < item.memberlist.length; q++) {
                if (this.transferData[p].memberlist[m].UserID === item.memberlist[q].UserID) {
                  this.transferData[p].memberlist[m].singleCheck = true
                };
              };
              // 把选中的添加至右侧
              if (this.transferData[p].memberlist[m].singleCheck) {
                this.checkAllList.push(this.transferData[p].memberlist[m])
              };
            };
            // 所有的全选按钮
            var isCheckAll = this.transferData[p].memberlist.map(function (val) {
              return val.singleCheck
            }).indexOf(false)
            if (isCheckAll === -1) {
              this.transferData[p].checkAll = true
              this.casaderIsAll = true// 全选
            } else {
              this.transferData[p].checkAll = false
              this.casaderIsAll = false// 全选
            };
          };
          // 去重
          var obj = {}
          this.checkAllList = this.checkAllList.reduce(function (item, next) {
            // eslint-disable-next-line no-unused-expressions
            obj[next.UserID] ? '' : obj[next.UserID] = true && item.push(next)
            return item
          }, [])
        } else {
          for (let p = 0; p < this.transferData.length; p++) {
            for (let q = 0; q < this.transferData[p].memberlist.length; q++) {
              var index2 = item.memberlist.map(function (val) {
                return val.UserID
              }).indexOf(this.transferData[p].memberlist[q].UserID)
              if (index2 !== -1) {
                this.transferData[p].memberlist[q].singleCheck = false
              };
            };
            // 删除右侧
            for (var k = 0; k < item.memberlist.length; k++) {
              var index3 = this.checkAllList.map(function (val) {
                return val.UserID
              }).indexOf(item.memberlist[k].UserID)
              if (index3 !== -1) {
                this.checkAllList.splice(index3, 1)
              };
            }
            // 所有的全选按钮
            var isCheckAll2 = this.transferData[p].memberlist.map(function (val) {
              return val.singleCheck
            }).indexOf(true)
            if (isCheckAll2 === -1) { // 全没有ture
              this.transferData[p].checkAll = false
              this.casaderIsAll = false// 全选
            } else {
              // 最少有一个true
              var isCheckAll3 = this.transferData[p].memberlist.map(function (val) {
                return val.singleCheck
              }).indexOf(false)
              if (isCheckAll3 === -1) {
                this.transferData[p].checkAll = true
                this.casaderIsAll = true// 全选
              } else {
                this.transferData[p].checkAll = false
                this.casaderIsAll = false// 全选
              };
            };
          };
        };
      },
      checkAllChange: function (child) { // 每个人的按钮
        if (child.singleCheck) {
          this.checkAllList.push(child)
          for (var i = 0; i < this.transferData.length; i++) {
            var mapIndex = this.transferData[i].memberlist.map(function (val) {
              return val.UserID
            }).indexOf(child.UserID)
            if (mapIndex !== -1) {
              this.transferData[i].memberlist[mapIndex].singleCheck = true
            };
            // 组内全选按钮选中
            var is1 = this.transferData[i].memberlist.map(function (val) {
              return val.singleCheck
            }).indexOf(false)
            if (is1 === -1) {
              this.transferData[i].checkAll = true
            };
          };
        } else {
          var index1 = this.checkAllList.map(function (val) {
            return val.UserID
          }).indexOf(child.UserID)
          this.checkAllList.splice(index1, 1)
          for (let i = 0; i < this.transferData.length; i++) {
            var mapIndex1 = this.transferData[i].memberlist.map(function (val) {
              return val.UserID
            }).indexOf(child.UserID)
            if (mapIndex1 !== -1) {
              this.transferData[i].memberlist[mapIndex1].singleCheck = false
            };
            // 组内全选按钮是否选中
            var is2 = this.transferData[i].memberlist.map(function (val) {
              return val.singleCheck
            }).indexOf(true)
            if (is2 === -1) { // 没有true
              this.transferData[i].checkAll = false
              this.casaderIsAll = false
            } else {
              // 最少有一个true
              var is3 = this.transferData[i].memberlist.map(function (val) {
                return val.singleCheck
              }).indexOf(false)
              if (is3 === -1) {
                this.transferData[i].checkAll = true
                this.casaderIsAll = true
              } else {
                this.transferData[i].checkAll = false
                this.casaderIsAll = false
              };
            };
          };
        };
      },
      searchNameFun: function (vals) {
        this.searchName = vals
      },
      handleClose: function (e, name) {
        for (var u = 0; u < this.checkAllList.length; u++) {
          if (this.checkAllList[u].UserID === name.UserID) { this.checkAllList.splice(u, 1) }
        };
        for (var i = 0; i < this.transferData.length; i++) {
          var mapIndex = this.transferData[i].memberlist.map(function (val) {
            return val.UserID
          }).indexOf(name.UserID)
          if (mapIndex !== -1) {
            this.transferData[i].memberlist[mapIndex].singleCheck = false
          };
          // 组内全选按钮是否选中
          var is4 = this.transferData[i].memberlist.map(function (val) {
            return val.singleCheck
          }).indexOf(true)
          if (is4 === -1) { // 没有true
            this.transferData[i].checkAll = false
          } else {
            // 最少有一个true
            var is5 = this.transferData[i].memberlist.map(function (val) {
              return val.singleCheck
            }).indexOf(false)
            if (is5 === -1) {
              this.transferData[i].checkAll = true
            } else {
              this.transferData[i].checkAll = false
            };
          };
        };
      },
      modalCancel: function () {
        this.checkAllGroup = []
        this.checkAllList = []// 右侧滞空
        this.newList = []// 左侧滞空
        this.transferData = []// 中间滞空
        this.casaderIsAll = false
        this.searchName = ''
      },
      modalAdd: function () {
        if (this.changeType === 1) {
          if (this.checkAllList.length === 1) {
            var newArr1 = []
            for (var i = 0; i < this.checkAllList.length; i++) {
              newArr1.push(this.checkAllList[i])
            };
            this.formValidate.LectureTeacher = newArr1
            this.addPublic = false
            this.newList = []// 左侧滞空
            this.transferData = []// 中间滞空
            this.checkAllGroup = []// 单选框滞空
            this.radioAll = []// 右侧滞空
            this.casaderIsAll = false
          } else {
            if (this.checkAllList.length > 1) {
              this.xy.msgError('讲课人最多添加1人')
            } else {
              this.xy.msgError('请先选择讲课人')
            };
            this.changeLoading()
          };
        };
        if (this.changeType === 2) {
          if (this.checkAllList.length > 0) {
            for (let i = 0; i < this.checkAllList.length; i++) {
              this.formValidate.TeacherCount.push(this.checkAllList[i])
            };
            this.addPublic = false
            this.newList = []// 左侧滞空
            this.transferData = []// 中间滞空
            this.checkAllGroup = []// 多选框滞空
            this.checkAllList = []// 右侧滞空
            this.casaderIsAll = false
            this.searchName = ''
          } else {
            this.xy.msgError('请先选择听课人')
            this.changeLoading()
          };
        };
      }
    //= =======多选弹出框 End =========
    }
  }
</script>
<style lang='less' scoped>
</style>
