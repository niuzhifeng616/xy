<template>
  <div class="xy-content-module">
      <div class="xy-content-body">
          <row>
              <i-col span="6" class="left-body">
                  <div class="left-box">
                      <div class="box-header">
                          <h3 style="font-weight: bold;">
                              角色管理
                          </h3>
                          <Icon type="md-add" color="#4196FF" size="18" @click="addGroupModel" />
                      </div>
                      <div class="box-body">
                          <tree class="tree-dom" :empty-text="emptyTxt"  :data="roleTree"></tree>
                      </div>
                  </div>
              </i-col>
              <i-col span="18">
                  <div class="clearfix" style="margin-bottom:10px;" v-if="selectOrg!=''">
                      <div class="fl">
                          <span style="font-weight:bold;font-size:14px;margin-right:10px;">{{selectOrg.title}}</span>
                          <Button  class="xy-primary" v-if="setBtn" @click="setPermission(selectOrg)">设置权限</Button>
                          <dropdown @on-click="moreImport" v-if="moreBtn" trigger="click">
                              <Button  class="xy-info">
                                  更多
                                  <icon type="ios-arrow-down"></icon>
                              </Button>
                              <dropdown-menu slot="list">
                                  <dropdown-item name="1">批量添加</dropdown-item>
                                  <dropdown-item name="2">批量更新</dropdown-item>
                                  <dropdown-item name="3">批量导出</dropdown-item>
                              </dropdown-menu>
                          </dropdown>
                          <dropdown @on-click="more" v-if="addPersonBtn" trigger="click">
                              <Button  class="xy-info">
                                  添加人员
                                  <icon type="ios-arrow-down"></icon>
                              </Button>
                              <dropdown-menu slot="list">
                                  <dropdown-item name="1">添加教师</dropdown-item>
                                  <dropdown-item name="2">添加学生</dropdown-item>
                                  <dropdown-item v-if="!roleEva" name="3">添加家长</dropdown-item>
                              </dropdown-menu>
                          </dropdown>
                      </div>
                      <div class="fr pr">
                          <i-input
                            search
                            clearable
                            v-model.trim="searchText"
                            @on-search="FromSubmit"
                            :placeholder="placeholder"
                            class="xy-content-title-search"
                            style="width: auto;"
                            >
                              <icon type="ios-search cursor-p" slot="suffix" />
                          </i-input>
                      </div>
                  </div>
                  <XyAntTable
                    :columns="columns"
                    :dataSource="tbData"
                    :nullData="nullData"
                    :tableLoading="tableLoading"
                    :pagination="pagination"
                    @change="handleTableChange"
                    :scrollx="700"
                    >
                    <div slot="IconRender" slot-scope="text, record">
                      <div v-if="!record.Icon" :class="`head-con ${record.Sex ? 'man' : 'woman'}`">
                        <span class="head-font">
                          {{ xy.showName(record.FullName)}}
                        </span>
                      </div>
                      <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
                    </div>
                    <div slot="UserNameRender" slot-scope="text, record">
                      <div style="min-width:200px">
                        {{record.UserName.replace(/\s/g, '&nbsp;')}}
                      </div>
                    </div>
                    <div slot="FullNameRender" slot-scope="text, record">
                      <span style="min-width:180px" v-if="operationBtn" class="table-el-hover" @click="selectScopeFun(record)">
                      {{record.FullName.replace(/\s/g, '&nbsp;')}}
                      </span>
                      <span style="min-width:180px" v-else >
                      {{record.FullName.replace(/\s/g, '&nbsp;')}}
                      </span>
                    </div>
                    <span slot="oprateRender" slot-scope="text, record">
                      <a :disabled="!operationBtn" @click="selectScopeFun(record)">编辑管理范围</a>
                      <a-divider type="vertical" />
                      <a href="javascript:;" :disabled="!operationBtn" @click="del(record)">删除</a>
                    </span>
                  </XyAntTable>
                  <!-- 创建角色组 -->
                  <modal
                    v-model="modalAddRoleGroup"
                    :mask-closable="false"
                    :transfer="false"
                    title="创建角色组"
                    >
                      <div class="dialog-model-content">
                          <i-form ref="formValidate" label-position="top" :model="formValidate" @submit.native.prevent>
                              <form-item label="角色组名称" labelFor="roleGroupName" prop="roleGroupName">
                                  <i-input elementId="roleGroupName" v-model.trim="formValidate.roleGroupName" placeholder="请输入角色组名称" clearable></i-input>
                              </form-item>
                          </i-form>
                      </div>
                      <div slot="footer">
                          <Button class="xy-modal-close" @click="modalAddRoleGroup = false">取消</Button>
                          <Button class="xy-modal-primary" shape="circle" @click="addGroupSubmit">保存</Button>
                      </div>
                  </modal>
                  <!-- 创建角色或职务 -->
                  <modal
                    v-model="modalAddRole"
                    :mask-closable="false"
                    :transfer="false"
                    :title="selecGroup.type==='A'?'创建角色':'创建职务'"
                    >
                      <div class="dialog-model-content">
                          <i-form ref="formValidateRole" label-position="top" :model="formValidateRole" @submit.native.prevent>
                              <form-item :label="selecGroup.type==='A'?'角色名称':'职务名称'" labelFor="roleRoleName" prop="roleRoleName">
                                  <i-input elementId="roleRoleName" v-model.trim="formValidateRole.roleRoleName" :placeholder="selecGroup.type==='A'?'请输入角色名称':'请输入职务名称'" clearable></i-input>
                              </form-item>
                          </i-form>
                      </div>
                      <div slot="footer">
                          <Button class="xy-modal-close" @click="modalAddRole = false">取消</Button>
                          <Button class="xy-modal-primary" shape="circle" @click="addRoleSubmit">保存</Button>
                      </div>
                  </modal>
                  <!-- 重命名组 -->
                  <modal
                    v-model="modalRenameGroup"
                    :transfer="false"
                    :mask-closable="false"
                    @on-cancel="closeEditTreeName"
                    title="重命名角色组"
                    >
                      <div>
                          <Input v-model="renameGroupOld" placeholder="请输入角色组名称" clearable/>
                      </div>
                      <div slot="footer">
                          <Button class="xy-modal-close" @click="closeEditTreeName">取消</Button>
                          <Button class="xy-modal-primary" shape="circle" @click="orgSubmit">保存</Button>
                      </div>
                  </modal>
                  <!-- 重命名子组 -->
                  <modal v-model="modalRenameChild" :transfer="false" :mask-closable="false">
                      <p slot="header">
                          <span v-if="renameChild.type==='A'">重命名角色</span>
                          <span v-if="renameChild.type==='D'">重命名职务</span>
                      </p>
                      <div>
                          <i-input v-model.trim="renameChild.fullOrgName" :placeholder="renameChild.type==='A'?'请输入角色名称':'请输入职务名称'" clearable></i-input>
                      </div>
                      <div slot="footer">
                          <Button class="xy-modal-close" @click="closeEditTreeChildName">取消</Button>
                          <Button class="xy-modal-primary" shape="circle" @click="childNameSubmit">保存</Button>
                      </div>
                  </modal>
                  <!-- 选择管理范围 -->
                  <modal
                      v-model="modalSelectScope"
                      :mask-closable="false"
                      width="550">
                      <p slot="header">选择管理范围</p>
                      <div style="height:500px;">
                          <tabs v-model="selectScope" :animated="false" @on-click="tabsCli">
                              <tab-pane label="教师组织" name="1">
                                  <div style="height:420px;overflow:auto">
                                      <tree class="tree-dom" :empty-text="emptyTxt1" :data="teacherTree" ref="tree" show-checkbox @on-check-change="treeCheck"></tree>
                                  </div>
                              </tab-pane>
                              <tab-pane label="学生组织" name="2">
                                  <div style="height:420px;overflow:auto">
                                      <tree class="tree-dom" :empty-text="emptyTxt2" :data="studentTree" show-checkbox @on-check-change="treeCheck"></tree>
                                  </div>
                              </tab-pane>
                              <tab-pane label="学科" name="3">
                                  <div style="height:420px;overflow:auto">
                                      <tree class="tree-dom" :empty-text="emptyTxt3" :data="subjectTree" show-checkbox @on-check-change="treeCheck"></tree>
                                  </div>
                              </tab-pane>
                          </tabs>
                      </div>
                      <div slot="footer" v-if="selectPersonType === 1"><!-- 教师 -->
                          <Button class="xy-modal-close" v-if="checkAllListTeacher.length===0" @click="modalSelectScope = false">取消</Button>
                          <Button class="xy-modal-close" v-else @click="preStep">上一步</Button>
                          <Button class="xy-modal-primary" shape="circle" @click="selectScopeSubmit">确定</Button>
                      </div>
                      <div slot="footer" v-else-if="selectPersonType === 2"><!-- 学生 -->
                          <Button class="xy-modal-close" v-if="checkAllList.length===0" @click="modalSelectScope = false">取消</Button>
                          <Button class="xy-modal-close" v-else @click="preStep">上一步</Button>
                          <Button class="xy-modal-primary" shape="circle" @click="selectScopeSubmit">确定</Button>
                      </div>
                      <div slot="footer" v-else-if="selectPersonType === 3"><!-- 家长 -->
                          <Button class="xy-modal-close" v-if="checkAllListParent.length===0" @click="modalSelectScope = false">取消</Button>
                          <Button class="xy-modal-close" v-else @click="preStep">上一步</Button>
                          <Button class="xy-modal-primary" shape="circle" @click="selectScopeSubmit">确定</Button>
                      </div>
                  </modal>
                  <!-- 选择管理范围:德育评价+活动评价 -->
                  <modal v-model="modalSelectScopeNew" :mask-closable="false" width="550">
                      <p slot="header">选择管理范围</p>
                      <div style="height:500px;">
                          <tabs v-model="selectScope" :animated="false">
                              <tab-pane label="学生组织" name="1">
                                  <div style="height:420px;overflow:auto">
                                      <tree class="tree-dom" :empty-text="emptyTxtNew" :data="studentTreeNew" show-checkbox @on-check-change="treeCheckNew"></tree>
                                  </div>
                              </tab-pane>
                          </tabs>
                      </div>
                      <div slot="footer" v-if="selectPersonType === 1"><!-- 教师 -->
                          <Button class="xy-modal-close" v-if="checkAllListTeacher.length===0" @click="modalSelectScopeNew = false">取消</Button>
                          <Button class="xy-modal-close" v-else @click="preStepNew">上一步</Button>
                          <Button class="xy-modal-primary" shape="circle" @click="selectScopeSubmitNew">确定</Button>
                      </div>
                      <div slot="footer" v-else-if="selectPersonType === 2"><!-- 学生 -->
                          <Button class="xy-modal-close" v-if="checkAllList.length===0" @click="modalSelectScopeNew = false">取消</Button>
                          <Button class="xy-modal-close" v-else @click="preStepNew">上一步</Button>
                          <Button class="xy-modal-primary" shape="circle" @click="selectScopeSubmitNew">确定</Button>
                      </div>
                      <div slot="footer" v-else-if="selectPersonType === 3"><!-- 家长 -->
                          <Button class="xy-modal-close" v-if="checkAllListParent.length===0" @click="modalSelectScopeNew = false">取消</Button>
                          <Button class="xy-modal-close" v-else @click="preStepNew">上一步</Button>
                          <Button class="xy-modal-primary" shape="circle" @click="selectScopeSubmitNew">确定</Button>
                      </div>
                  </modal>
              </i-col>
          </row>
      </div>
      <XyUpfile
        ref="upfile"
        :modalTitle="upload.title"
        :describeData="upload.tipData"
        :fileFormt="upload.formtData"
        :fileSize="upload.size"
        :importPath="upload.upUrl"
        :paramsData="upload.upParams"
        :templateUrl="upload.templateUrl"
        :errorUrl="upload.errorUrl"
        @successLoad="refresh"
        >
      </XyUpfile>
      <!-- 添加家长 -->
      <SelectParent :isShow="isShowParent"
          :showMoreBtn="true"
          :moreBtnTitle="'下一步'"
          :selectedPart="newAddParent"
          :selectMembers="haveParent"
          @select-cancel="selectCancelParent"
          @select-other="nextConfirmParent"
          @select-confirm="selectConfirmParent">
      </SelectParent>
      <!-- 添加学生 -->
      <SelectStudent :isShow="isShowStudent"
          :showMoreBtn="true"
          :moreBtnTitle="'下一步'"
          :selectedPart="newAddStudent"
          :selectMembers="haveStudent"
          @select-cancel="selectCancel"
          @select-other="nextConfirm"
          @select-confirm="selectConfirm">
      </SelectStudent>
      <!-- 添加教师 -->
      <SelectTeacher :isShow="isShowTeacher"
        :showMoreBtn="true"
        :moreBtnTitle="'下一步'"
        :selectedPart="newAddTeacher"
        :selectMembers="haveTeacher"
        :setFilter="teacherSetTeacher"
        @select-cancel="selectCancelTeacher"
        @select-other="nextConfirmTeacher"
        @select-confirm="selectConfirmTeacher">
      </SelectTeacher>
      <!-- selectedPart 选择教师点击‘下一步’后，再次点击‘上一步’返回选择教师时的反选数据 -->
      <!-- selectMembers 列表中的教师数据-->
      <!-- setFilter 列表中的教师数据-是否要做反选和过滤tree -->
  </div>
</template>
<script>
  import XyUpfile from '@/components/upFile/XyUpfile'
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import SelectParent from './components/CheckboxSelectParent.vue' // 需要做反选 单独使用组件
  import SelectStudent from './components/CheckboxSelectStudent.vue' // 需要做反选 单独使用组件
  import SelectTeacher from './components/CheckboxSelectTeacher.vue' // 需要做反选 单独使用组件

  export default {
    name: 'RoleTable',
    components: {
      XyUpfile,
      XyAntTable,
      SelectParent,
      SelectTeacher,
      SelectStudent
    },
    data () {
      return {
        emptyTxt: '正在加载中...',
        emptyTxt1: '正在加载中...',
        emptyTxt2: '正在加载中...',
        emptyTxt3: '正在加载中...',
        formValidate: {
          roleGroupName: ''
        },
        formValidateRole: {
          roleRoleName: ''
        },
        // antTable
        tableLoading: false,
        nullData: '该搜索条件下没有结果。',
        columns: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 40,
            scopedSlots: { customRender: 'IconRender' },
            className: 'table-pic'
          }, {
            title: '姓名',
            dataIndex: 'FullName',
            scopedSlots: { customRender: 'FullNameRender' }
          }, {
            title: '用户名',
            dataIndex: 'UserName',
            scopedSlots: { customRender: 'UserNameRender' }
          },
          {
            title: '操作',
            dataIndex: '04',
            width: 180,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        tbData: [],
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
        upload: {
          title: '上传demo',
          tipData: [],
          formtData: ['txt'],
          size: 1024,
          upUrl: '//jsonplaceholder.typicode.com/posts/',
          upParams: {},
          templateUrl: '',
          errorUrl: ''
        },
        renameGroupOld: '', // 重命名角色组的name
        renameChildOld: '', // 重命名子组的name
        // 左侧树
        roleTree: [],
        selectOrg: '',
        // 搜索条件
        searchText: '',
        sourceID: 0,
        sourceType: '',
        // 按钮显示哪些
        setBtn: true,
        moreBtn: true,
        addPersonBtn: true,
        operationBtn: false,
        // 创建角色组
        modalAddRoleGroup: false,
        roleGroupName: '',
        // 创建角色
        modalAddRole: false,
        roleRoleName: '',
        selecGroup: '',
        // 重命名组
        modalRenameGroup: false,
        renameGroup: '',
        // 重命名子组
        modalRenameChild: false,
        renameChild: '',
        // 选择管理范围
        modalSelectScope: false,
        selectScope: '1',
        selectUser: '',
        teacherTree: [], // 教职工组织
        teacherSelect: [],
        studentTree: [], // 学生组织
        studentSelect: [],
        subjectTree: [], // 学科
        subjectSelect: [],

        selectPersonType: -1, // 1教师、2学生、3家长、
        // 添加家长
        isShowParent: false, // modal默认false
        haveParent: [], // 已经添加过的家长
        newAddParent: [], // 子组件选中的部分家长，点击下一步后再返回时的家长组件中需要做反选（清空：选家长弹框‘取消/关闭’、‘确定’，选范围弹框‘关闭’、‘确定’）
        checkAllListParent: [], // 获取子组件选中的数据

        // 添加学生
        isShowStudent: false,
        haveStudent: [],
        newAddStudent: [],
        checkAllList: [], // 获取子组件选中的数据

        // 添加教师
        isShowTeacher: false,
        haveTeacher: [],
        teacherSetTeacher: true, // 是否需要过滤tree,过滤后不反选
        newAddTeacher: [],
        checkAllListTeacher: [], // 获取子组件选中的数据

        // ----------------------------------------------------------
        roleEva: false, // 是否是德育/活动-职务角色
        modalSelectScopeNew: false, // 德育/活动-职务--管理范围弹框
        emptyTxtNew: '',
        studentTreeNew: []

      }
    },
    computed: {
      placeholder () {
        let name = '请输入用户名/姓名'
        if (this.sourceType === 'R' && this.sourceID === 2) { // 教师
          name = '请输入用户名/工号/姓名'
        } else if (this.sourceType === 'R' && this.sourceID === 3) { // 学生
          name = '请输入用户名/学籍号/姓名'
        }
        return name
      }
    },
    created () {
      if (Object.keys(this.$store.state.base.roleKeyWords).length > 0) {
        let res = this.$store.state.base.roleKeyWords
        this.pagination.current = res.PageIndex
        this.pagination.pageSize = res.PageSize
        this.searchText = res.searchText
      }
      this.getRoleTree()
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      // 导入后刷新
      refresh () {
        this.loadTable()
        this.getRoleTree()
      },

      // 左侧树
      async getRoleTree (val2) {
        this.emptyTxt = '正在加载中...'
        let params = {
          schoolid: 0,
          isGraduation: false
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AdministrationRole/Get`, params, true)
        if (res.success) {
          let resData = res.data
          if (res.data.length === 0) {
            this.emptyTxt = '暂无角色组织，请联系管理员。'
          }
          this.roleTree = []
          for (let i = 0; i < resData.length; i++) {
            // 包含添加、编辑、删除
            let render = (h, func) => {
              return h('span', {
                class: ['tree-li']
              }, [
                h('span', {
                  class: ['ivu-tree-title'],
                  style: {
                    fontSize: '14px'
                  }
                }, [
                  h('span', func.data.title)
                ]),
                h('span', {
                  // style: {
                  //   display: 'inline-block',
                  //   float: 'right'
                  // }
                }, [
                  h('span', {
                    // style: {
                    //   display: 'inline-block',
                    //   float: 'right'
                    // }
                  }, [
                    h('Icon', {
                      props: {
                        type: 'md-create',
                        custom: 'xy-tree-btn xy-tree-hover'
                      },
                      attrs: {
                        title: '编辑'
                      },
                      on: {
                        click: () => {
                          this.editTreeName(func.data)
                        }
                      }
                    }),
                    h('Icon', {
                      props: {
                        type: 'md-add',
                        custom: 'xy-tree-btn xy-tree-hover'
                      },
                      attrs: {
                        title: '创建角色'
                      },
                      on: {
                        click: () => {
                          this.addRoleModel(func.data)
                        }
                      }
                    }),
                    h('Icon', {
                      style: {
                        display: func.data.IsDel ? 'inline-block' : 'none'
                      },
                      props: {
                        type: 'md-close',
                        custom: 'xy-tree-btn xy-tree-hover'
                      },
                      attrs: {
                        title: '删除'
                      },
                      on: {
                        click: () => {
                          this.delGroup(func.data)
                        }
                      }
                    })
                  ])
                ])
              ])
            }
            // 包含添加
            let render1 = (h, func) => {
              return h('span', {
                class: ['tree-li']
              }, [
                h('span', {
                  class: ['ivu-tree-title'],
                  style: {
                    fontSize: '14px'
                  }
                }, [
                  // h('span', func.data.title)
                  h('Tooltip', {
                    props: {
                      placement: 'top',
                      transfer: true
                    }
                  }, [func.data.title, h('Icon', {
                    props: {
                      type: 'md-help-circle'
                    },
                    style: {
                      'margin-left': '10px',
                      'color': '#f90'
                    }
                  }), h('span', {
                    slot: 'content',
                    style: {
                      whiteSpace: 'normal'
                    }
                  }, '职务角色即是职务')])

                ]),
                h('span', {
                  // style: {
                  //   display: 'inline-block',
                  //   float: 'right'
                  // }
                }, [
                  h('span', {
                    // style: {
                    //   display: 'inline-block',
                    //   float: 'right'
                    // }
                  }, [
                    h('Icon', {
                      props: {
                        type: 'md-add',
                        custom: 'xy-tree-btn xy-tree-hover'
                      },
                      attrs: {
                        title: '创建角色'
                      },
                      on: {
                        click: () => {
                          this.addRoleModel(func.data)
                        }
                      }
                    })
                  ])
                ])
              ])
            }
            this.roleTree.push({
              id: resData[i].ID,
              title: resData[i].Name,
              type: resData[i].Type,
              IsDel: resData[i].IsDel,
              IsEdit: resData[i].IsEdit,
              Code: '',
              expand: true,
              children: [],
              fullOrgName: resData[i].Name,
              render: resData[i].Type === 'D' ? render1 : resData[i].Type === 'A' ? render : ''
            })
            for (let m = 0; m < resData[i].Childrens.length; m++) {
              this.roleTree[i].children.push({
                id: resData[i].Childrens[m].Value,
                pID: resData[i].ID,
                title: resData[i].Childrens[m].Name + '(' + resData[i].Childrens[m].Count + '人)',
                type: resData[i].Childrens[m].Type,
                fullOrgName: resData[i].Childrens[m].Name,
                IsDel: resData[i].Childrens[m].IsDel,
                IsEdit: resData[i].Childrens[m].IsEdit,
                Code: resData[i].Childrens[m].Code,
                children: [],
                render: (h, func) => {
                  return h('span', {
                    class: ['tree-li']
                  }, [
                    h('span', {
                      class: ['ivu-tree-title'],
                      style: {
                        fontSize: '14px'
                      }
                    }, [
                      h('span', {
                        on: {
                          click: () => {
                            this.treeSelect(func.data)
                          }
                        }
                      }, func.data.title)
                    ]),
                    h('span', {
                      // style: {
                      //   display: 'inline-block',
                      //   float: 'right'
                      // }
                    }, [
                      h('Icon', {
                        style: {
                          display: func.data.IsEdit ? 'inline-block' : 'none'
                          // float: 'left'
                        },
                        props: {
                          type: 'md-create',
                          custom: 'xy-tree-btn xy-tree-hover'
                        },
                        attrs: {
                          title: '编辑'
                        },
                        on: {
                          click: () => {
                            if (func.data.IsEdit) {
                              this.editTreeChildName(func.data)
                            }
                          }
                        }
                      }),
                      h('Icon', {
                        style: {
                          display: func.data.IsDel ? 'inline-block' : 'none'
                          // float: 'right'
                        },
                        props: {
                          type: 'md-close',
                          custom: 'xy-tree-btn xy-tree-hover'
                        },
                        attrs: {
                          title: '删除'
                        },
                        on: {
                          click: () => {
                            if (func.data.IsDel) {
                              this.delChild(func.data)
                            }
                          }
                        }
                      })
                    ])
                  ])
                }
              })
            }
          };
          // 如果是增加或删除 家长 教师 学生  重命名后

          if (val2 && this.selectOrg) {
            let findTitle = (data) => {
              data.map((item) => {
                if (item.id === this.selectOrg.id && item.type === this.selectOrg.type) {
                  this.selectOrg.title = item.title
                  return false
                } else if (item.children) {
                  findTitle(item.children)
                }
              })
            }
            findTitle(this.roleTree)
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      async getStudentTree (row) { // 学生组织
        this.emptyTxt2 = '正在加载中...'
        let params = {
          sourceID: this.selectOrg.id,
          sourceType: this.selectOrg.type,
          userID: row.UserID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AdministrationRole/GetSchoolGardTree`, params, true)
        // this.xy.unloading()
        if (res.success) {
          this.getSubjectTree(row)
          var resData = res.data
          this.studentTree = []
          for (var i = 0; i < resData.length; i++) {
            this.studentTree.push({
              id: resData[i].SchoolDistrictID,
              title: resData[i].Name,
              StudentGradeForStudentYearID: resData[i].StudentGradeForStudentYearID,
              StudentOrganizationID: resData[i].StudentOrganizationID,
              SchoolDistrictID: resData[i].SchoolDistrictID,
              children: this.studentRepeat(resData[i].Children),
              checked: resData[i].Open
            })
          }
          // 编辑管理范围
          this.studentSelect = this.studentCheckRepeat(this.studentTree, this.studentSelect)
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 德育+活动评价 学生组织树
      async getStudentTreeNew (row) { // 学生组织
        this.emptyTxtNew = '正在加载中...'
        let params = {
          sourceID: this.selectOrg.id,
          sourceType: this.selectOrg.type,
          userID: row.UserID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AdministrationRole/GetSchoolGardTreeNoClass`, params, true)
        // this.xy.unloading()
        if (res.success) {
          var resData = res.data
          this.studentTreeNew = []
          for (var i = 0; i < resData.length; i++) {
            this.studentTreeNew.push({
              id: resData[i].SchoolDistrictID,
              title: resData[i].Name,
              StudentGradeForStudentYearID: resData[i].StudentGradeForStudentYearID,
              StudentOrganizationID: resData[i].StudentOrganizationID,
              SchoolDistrictID: resData[i].SchoolDistrictID,
              children: this.studentRepeat(resData[i].Children),
              checked: resData[i].Open
            })
          }
          // 编辑管理范围
          this.studentSelect = this.studentCheckRepeat(this.studentTreeNew, this.studentSelect)
        } else {
          this.xy.msgError(res.msg)
        }
      },
      studentRepeat (ogrList) {
        var result = []
        for (let i = 0; i < ogrList.length; i++) {
          if (ogrList[i].Children.length > 0) {
            result.push({
              id: ogrList[i].SchoolDistrictID,
              title: ogrList[i].Name,
              StudentGradeForStudentYearID: ogrList[i].StudentGradeForStudentYearID,
              StudentOrganizationID: ogrList[i].StudentOrganizationID,
              SchoolDistrictID: ogrList[i].SchoolDistrictID,
              children: this.studentRepeat(ogrList[i].Children),
              checked: ogrList[i].Open
            })
          } else {
            result.push({
              id: ogrList[i].SchoolDistrictID,
              title: ogrList[i].Name,
              StudentGradeForStudentYearID: ogrList[i].StudentGradeForStudentYearID,
              StudentOrganizationID: ogrList[i].StudentOrganizationID,
              SchoolDistrictID: ogrList[i].SchoolDistrictID,
              children: [],
              checked: ogrList[i].Open
            })
          }
        }
        return result
      },
      async getSubjectTree (row) { // 学科
        this.emptyTxt3 = '正在加载中...'
        let params = {
          sourceID: this.selectOrg.id,
          sourceType: this.selectOrg.type,
          userID: row.UserID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AdministrationRole/GetDisciplineTree`, params, true)
        this.xy.unloading()
        if (res.success) {
          var resData = res.data
          this.subjectTree = []
          for (var i = 0; i < resData.length; i++) {
            this.subjectTree.push({
              id: resData[i].SchoolDistrictID,
              title: resData[i].Name,
              StudentGradeForStudentYearID: resData[i].StudentGradeForStudentYearID,
              DisciplineID: resData[i].DisciplineID,
              SchoolDistrictID: resData[i].SchoolDistrictID,
              children: this.subjectRepeat(resData[i].Children),
              checked: resData[i].Open
            })
          }
          // 编辑管理范围
          this.subjectSelect = this.studentCheckRepeat(this.subjectTree, this.subjectSelect)
        } else {
          this.xy.msgError(res.msg)
        }
      },
      subjectRepeat: function (ogrList) {
        var that = this
        var result = []
        for (var i = 0; i < ogrList.length; i++) {
          if (ogrList[i].Children.length > 0) {
            result.push({
              id: ogrList[i].SchoolDistrictID,
              title: ogrList[i].Name,
              StudentGradeForStudentYearID: ogrList[i].StudentGradeForStudentYearID,
              DisciplineID: ogrList[i].DisciplineID,
              SchoolDistrictID: ogrList[i].SchoolDistrictID,
              children: that.subjectRepeat(ogrList[i].Children),
              checked: ogrList[i].Open
            })
          } else {
            result.push({
              id: ogrList[i].SchoolDistrictID,
              title: ogrList[i].Name,
              StudentGradeForStudentYearID: ogrList[i].StudentGradeForStudentYearID,
              DisciplineID: ogrList[i].DisciplineID,
              SchoolDistrictID: ogrList[i].SchoolDistrictID,
              children: [],
              checked: ogrList[i].Open
            })
          }
        }
        return result
      },
      studentCheckRepeat (org, selectData) {
        for (var i = 0; i < org.length; i++) {
          if (!(org[i].checked)) {
            this.studentCheckRepeat(org[i].children, selectData)
          } else if (org[i].checked) {
            selectData.push(org[i])
          }
        }
        console.log(selectData)
        return selectData
      },
      treeSelect (res) {
        this.selectOrg = res
        if (res.type === 'R') { // 默认角色
          if (res.Code === 'A') { // 管理员
            this.roleEva = false
            this.setBtn = false
            this.moreBtn = false
            this.addPersonBtn = false
            this.operationBtn = false
          } else { // 教师、学生、家长
            this.roleEva = false
            this.setBtn = true
            this.moreBtn = false
            this.addPersonBtn = false
            this.operationBtn = false
          }
        } else if (res.type === 'D') { // 职务
          if (res.Code === 'Headmaster' || res.Code === 'TeachingLeader' || res.Value === 34) {
            this.roleEva = false
            this.setBtn = true
            this.moreBtn = true
            this.addPersonBtn = true
            this.operationBtn = true
          } else if (res.Code === 'MoralEducation' || res.Code === 'ActivityEvaluate') {
            this.roleEva = true
            this.moreBtn = false
            this.addPersonBtn = true
            this.operationBtn = true
          } else {
            this.roleEva = false
            this.setBtn = true
            this.moreBtn = false
            this.addPersonBtn = true
            this.operationBtn = true
          }
        } else {
          this.roleEva = false
          this.setBtn = true
          this.moreBtn = false
          this.addPersonBtn = true
          this.operationBtn = true
        }
        if (this.sourceType === '') {
          this.sourceID = res.id
          this.sourceType = res.type
          this.loadTable()
        } else {
          this.sourceID = res.id
          this.sourceType = res.type
          this.pagination.current = 1
          this.loadTable()
        }
      },
      // 删除组
      delGroup (val) {
        let that = this
        that.$Modal.confirm({
          title: '删除',
          content: '<p>您确定要删除"' + val.fullOrgName + '"角色组吗？</p>',
          async onOk () {
            that.xy.loading()
            let params = {
              RoleID: val.id
            }
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/AdministrationRole/Delete`, params, true)
            that.xy.unloading()
            if (res.success) {
              that.xy.msgSuc('删除成功。')
              that.getRoleTree()
            } else {
              that.xy.msgError(res.msg)
            }
          }
        })
      },
      // 删除子组
      delChild (val) {
        let that = this
        if (val.type === 'A') { // 自定义角色
          this.$Modal.confirm({
            title: '删除',
            content: '<p>您确定要删除"' + val.fullOrgName + '"角色吗？</p>',
            async onOk () {
              that.xy.loading()
              let params = {
                RoleID: val.pID,
                DetailID: val.id
              }
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/AdministrationRole/DeleteDetail`, params, true)
              that.xy.unloading()
              if (res.success) {
                that.xy.msgSuc('删除成功。')
                that.getRoleTree()
              } else {
                that.xy.msgError(res.msg)
              }
            }
          })
        }
        if (val.type === 'D') { // 职务
          this.$Modal.confirm({
            title: '删除',
            content: '<p>您确定要删除"' + val.fullOrgName + '"职务吗？</p>',
            async onOk () {
              that.xy.loading()
              let params = {
                id: val.id
              }
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/AdministrationRole/DeleteDuty`, params, true)
              that.xy.unloading()
              if (res.success) {
                that.xy.msgSuc('删除成功。')
                that.getRoleTree()
              } else {
                that.xy.msgError(res.msg)
              }
            }
          })
        }
      },
      // 重命名组
      editTreeName (res) {
        this.renameGroup = res
        this.renameGroupOld = res.title
        this.modalRenameGroup = true
      },
      closeEditTreeName () {
        this.modalRenameGroup = false
      },
      async orgSubmit () {
        this.xy.loading()
        let params = {
          RoleID: this.renameGroup.id,
          RoleName: this.renameGroupOld
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AdministrationRole/Edit`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('重命名成功。')
          this.modalRenameGroup = false
          this.getRoleTree()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      treeCheck (res, resa) {
        if (this.selectScope === '1') {
          this.teacherSelect = []
          for (let i = 0; i < this.teacherTree.length; i++) {
            if (!(this.teacherTree[i].checked)) {
              this.studentCheckRepeat(this.teacherTree[i].children, this.teacherSelect)
            } else if (this.teacherTree[i].checked) {
              this.teacherSelect.push(this.teacherTree[i])
            }
          }
        }
        if (this.selectScope === '2') {
          this.studentSelect = []
          for (let i = 0; i < this.studentTree.length; i++) {
            if (!(this.studentTree[i].checked)) {
              this.studentCheckRepeat(this.studentTree[i].children, this.studentSelect)
            } else if (this.studentTree[i].checked) {
              this.studentSelect.push(this.studentTree[i])
            }
          }
        }
        if (this.selectScope === '3') {
          this.subjectSelect = []
          for (var i = 0; i < this.subjectTree.length; i++) {
            if (!(this.subjectTree[i].checked)) {
              this.studentCheckRepeat(this.subjectTree[i].children, this.subjectSelect)
            } else if (this.subjectTree[i].checked) {
              this.subjectSelect.push(this.subjectTree[i])
            }
          }
        }
      },
      treeCheckNew (res, resa) {
        if (this.selectScope === '1') {
          this.studentSelect = []
          for (let i = 0; i < this.studentTreeNew.length; i++) {
            if (!(this.studentTreeNew[i].checked)) {
              this.studentCheckRepeat(this.studentTreeNew[i].children, this.studentSelect)
            } else if (this.studentTreeNew[i].checked) {
              this.studentSelect.push(this.studentTreeNew[i])
            }
          }
        }
      },
      // 重命名子组
      editTreeChildName (res) {
        this.renameChild = res
        this.renameChildOld = res.fullOrgName
        this.modalRenameChild = true
      },
      closeEditTreeChildName () {
        this.modalRenameChild = false
        this.renameChild.fullOrgName = this.renameChildOld
      },
      async childNameSubmit () {
        if (this.renameChild.type === 'A') { // 自定义添加角色
          if (this.renameChild.fullOrgName.length === 0) {
            return this.xy.msgError('角色名称不能为空。')
          }
          if (this.renameChild.fullOrgName.length > 20) {
            return this.xy.msgError('角色名称限制20个字符。')
          }
          this.xy.loading()
          let params = {
            RoleID: this.renameChild.pID,
            DetailID: this.renameChild.id,
            DetailName: this.renameChild.fullOrgName
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/AdministrationRole/EditDetail`, params, true)
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('重命名成功。')
            this.getRoleTree(true)
            this.modalRenameChild = false
          } else {
            this.xy.msgError(res.msg)
          }
        }
        if (this.renameChild.type === 'D') { // 职务添加
          if (this.renameChild.fullOrgName.length === 0) {
            return this.xy.msgError('职务名称不能为空。')
          }
          if (this.renameChild.fullOrgName.length > 20) {
            return this.xy.msgError('职务名称限制20个字符。')
          }
          this.xy.loading()
          let params = {
            DutyID: this.renameChild.id,
            DutyName: this.renameChild.fullOrgName
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/AdministrationRole/EditDuty`, params, true)
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('重命名成功。')
            this.getRoleTree(true)
            this.modalRenameChild = false
          } else {
            this.xy.msgError(res.msg)
          }
        }
      },
      // 创建角色组
      addGroupModel () {
        this.formValidate.roleGroupName = ''
        this.modalAddRoleGroup = true
      },
      async addGroupSubmit () {
        if (this.formValidate.roleGroupName.length === 0) {
          return this.xy.msgError('角色组名称不能为空。')
        }
        if (this.formValidate.roleGroupName.length > 20) {
          return this.xy.msgError('角色组名称限制20个字符。')
        }
        this.xy.loading()
        let params = {
          RoleName: this.formValidate.roleGroupName
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AdministrationRole/Create`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('创建角色组成功。')
          this.getRoleTree()
          this.modalAddRoleGroup = false
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 创建角色或职务
      addRoleModel (val) {
        this.formValidateRole.roleRoleName = ''
        this.selecGroup = val
        this.modalAddRole = true
      },
      async addRoleSubmit () {
        if (this.selecGroup.type === 'A') { // 自定义添加角色
          if (this.formValidateRole.roleRoleName.length === 0) {
            return this.xy.msgError('角色名称不能为空。')
          }
          if (this.formValidateRole.roleRoleName.length > 20) {
            return this.xy.msgError('角色名称限制20个字符。')
          }
          let params = {
            RoleID: this.selecGroup.id,
            DetailName: this.formValidateRole.roleRoleName
          }
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/AdministrationRole/CreateDetail`, params, true)
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('创建角色成功。')
            this.getRoleTree()
            this.modalAddRole = false
          } else {
            this.xy.msgError(res.msg)
          }
        }
        if (this.selecGroup.type === 'D') { // 职务添加
          if (this.formValidateRole.roleRoleName.length === 0) {
            return this.xy.msgError('职务名称不能为空。')
          }
          if (this.formValidateRole.roleRoleName.length > 20) {
            return this.xy.msgError('职务名称限制20个字符。')
          }
          this.xy.loading()
          let params = {
            DutyName: this.formValidateRole.roleRoleName
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/AdministrationRole/CreateDuty`, params, true)
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('创建职务成功。')
            this.getRoleTree()
            this.modalAddRole = false
          } else {
            this.xy.msgError(res.msg)
          }
        }
      },
      getParams () {
        return {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          searchText: this.searchText
        }
      },
      // 列表
      async loadTable () {
        this.tableLoading = true
        this.$store.commit('base/changeRoleValue', this.getParams())
        let params = {
          sourceID: this.sourceID,
          sourceType: this.sourceType
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AdministrationRole/GetUser`, Object.assign(this.getParams(), params), true)
        if (res.success) {
          this.tbData = res.data.data
          this.pagination.total = res.data.totalRecords
        } else {
          this.xy.msgError(res.msg)
        }
        this.tableLoading = false
      },
      FromSubmit () {
        this.pagination.current = 1
        this.loadTable()
      },
      // 批量更多
      moreImport (res) {
        switch (res) {
          case '1': // 批量添加
            this.batchAddImport()
            break
          case '2': // 批量更新
            this.batchUpdate()
            break
          case '3': // 批量导出
            this.xy.downFile(`${this.$store.state.apiPath}/api/AdministrationRole/Export`, {
              code: this.selectOrg.Code,
              sourceID: this.selectOrg.id,
              searchText: this.searchText
            })
            break
        }
      },
      // 批量更多
      moreImportNew (res) {
        switch (res) {
          case '1': // 批量导入
            this.batchAddImport()
            break
          case '2': // 批量更新
            this.batchUpdate()
            break
          case '3': // 批量导出
            this.xy.downFile(`${this.$store.state.apiPath}/api/AdministrationRole/Export`, {
              code: this.selectOrg.Code,
              sourceID: this.selectOrg.id,
              searchText: this.searchText
            })
            break
          case '4': // 批量删除
            this.moreDel()
            break
          case '5': // 全部删除
            this.AllDel()
            break
        }
      },
      batchAddImport () { // 批量添加
        this.$refs['upfile'].modalImport = true
        this.upload = {
          title: '批量导入', // 标题
          ipData: [], // 提示语句
          formtData: ['xlsx', 'xls'], // 支持的文件类型
          size: 1024, // 文件大小限制，单位 kb
          upUrl: `${this.$store.state.apiPath}/api/AdministrationRole/ImportCreate?code=${this.selectOrg.Code}&isCreate=true`, // 上传文件url
          upParams: {}, // 上传参数
          templateUrl: `${this.$store.state.apiPath}/api/AdministrationRole/DownloadCreateTemplate?code=${this.selectOrg.Code}`, // 模板下载url
          errorUrl: `${this.$store.state.apiPath}/api/AdministrationRole/DownloadException` // 下载错误文件url
        }
      },
      batchUpdate () { // 批量更新
        this.$refs['upfile'].modalImport = true
        this.upload = {
          title: '批量导入', // 标题
          ipData: [], // 提示语句
          formtData: ['xlsx', 'xls'], // 支持的文件类型
          size: 1024, // 文件大小限制，单位 kb
          upUrl: `${this.$store.state.apiPath}/api/AdministrationRole/ImportCreate?code=${this.selectOrg.Code}&isCreate=true`, // 上传文件url
          upParams: {}, // 上传参数
          templateUrl: `${this.$store.state.apiPath}/api/AdministrationRole/DownloadEditTemplate?code=${this.selectOrg.Code}`, // 模板下载url
          errorUrl: `${this.$store.state.apiPath}/api/AdministrationRole/DownloadException` // 下载错误文件url
        }
      },
      batchSubmit () {
        this.loadTable()
      },
      // 编辑管理范围
      selectScopeFun (row) {
        if (this.roleEva) {
          this.modalSelectScopeNew = true
          this.selectUser = row
          this.selectScope = '1'
          this.studentTreeNew = []
          this.studentSelect = []
          this.getStudentTreeNew(this.selectUser)
        } else {
          this.modalSelectScope = true
          this.selectUser = row
          this.selectScope = '1'
          this.teacherTree = []
          this.teacherSelect = []
          this.studentTree = []
          this.studentSelect = []
          this.subjectTree = []
          this.subjectSelect = []
          this.getTeacherTree(this.selectUser)
        }
      },
      tabsCli () {
        // if (this.selectScope === 1 && this.teacherTree.length === 0) {
        //   this.getTeacherTree(this.selectUser)
        // }
        // if (this.selectScope === 2 && this.studentTree.length === 0) {
        //   this.getStudentTree(this.selectUser)
        // }
        // if (this.selectScope === 3 && this.subjectTree.length === 0) {
        //   this.getSubjectTree(this.selectUser)
        // }
      },
      async getTeacherTree (row) { // 教职工组织
        this.xy.loading()
        this.emptyTxt1 = '正在加载中...'
        let params = {
          sourceID: this.selectOrg.id,
          sourceType: this.selectOrg.type,
          userID: row.UserID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AdministrationRole/GetTeacherTree`, params, true)
        // this.xy.unloading()
        if (res.success) {
          this.getStudentTree(row)
          let resData = res.data
          this.teacherTree = []
          for (let i = 0; i < resData.length; i++) {
            this.teacherTree.push({
              id: resData[i].SchoolDistrictID,
              title: resData[i].Name,
              OrganizationID: resData[i].OrganizationID,
              ParentID: resData[i].ParentID,
              SchoolDistrictID: resData[i].SchoolDistrictID,
              children: this.teacherRepeat(resData[i].Children),
              checked: resData[i].Open
            })
          }
          // 编辑管理范围
          this.teacherSelect = this.studentCheckRepeat(this.teacherTree, this.teacherSelect)
        } else {
          this.xy.msgError(res.msg)
        }
      },
      teacherRepeat: function (ogrList) {
        var result = []
        for (var i = 0; i < ogrList.length; i++) {
          if (ogrList[i].Children.length > 0) {
            result.push({
              id: ogrList[i].SchoolDistrictID,
              title: ogrList[i].Name,
              OrganizationID: ogrList[i].OrganizationID,
              ParentID: ogrList[i].ParentID,
              SchoolDistrictID: ogrList[i].SchoolDistrictID,
              children: this.teacherRepeat(ogrList[i].Children),
              checked: ogrList[i].Open
            })
          } else {
            result.push({
              id: ogrList[i].SchoolDistrictID,
              title: ogrList[i].Name,
              OrganizationID: ogrList[i].OrganizationID,
              ParentID: ogrList[i].ParentID,
              SchoolDistrictID: ogrList[i].SchoolDistrictID,
              children: [],
              checked: ogrList[i].Open
            })
          }
        }
        return result
      },
      // 选择管理范围-确定
      async selectScopeSubmit () {
        let userIdArr = []
        if (this.selectUser.UserID === 0) {
          if (this.selectPersonType === 1) { // 教师
            this.checkAllListTeacher.map((item) => {
              userIdArr.push(item.UserID)
            })
          } else if (this.selectPersonType === 2) { // 学生
            this.checkAllList.map((item) => {
              userIdArr.push(item.id)
            })
          } else { // 3 家长
            console.log(this.checkAllListParent)

            this.checkAllListParent.map((item) => {
              userIdArr.push(item.id)
            })
          }
        } else {
          userIdArr.push(this.selectUser.UserID)
        }
        let TeacherModels = []
        for (let t = 0; t < this.teacherSelect.length; t++) {
          TeacherModels.push({
            SchoolDistrictID: this.teacherSelect[t].SchoolDistrictID,
            ParentID: this.teacherSelect[t].ParentID,
            OrganizationID: this.teacherSelect[t].OrganizationID
          })
        }
        let ClassModels = []
        for (let c = 0; c < this.studentSelect.length; c++) {
          ClassModels.push({
            SchoolDistrictID: this.studentSelect[c].SchoolDistrictID,
            StudentGradeForStudentYearID: this.studentSelect[c].StudentGradeForStudentYearID,
            StudentOrganizationID: this.studentSelect[c].StudentOrganizationID
          })
        }
        let DisciplineModels = []
        for (let d = 0; d < this.subjectSelect.length; d++) {
          DisciplineModels.push({
            SchoolDistrictID: this.subjectSelect[d].SchoolDistrictID,
            StudentGradeForStudentYearID: this.subjectSelect[d].StudentGradeForStudentYearID,
            DisciplineID: this.subjectSelect[d].DisciplineID
          })
        }
        // if (TeacherModels.length === 0 && ClassModels.length === 0 && DisciplineModels.length === 0) {
        //    xy.message.error(this, '至少选择一个');
        //    return false;
        // }
        this.xy.loading()
        let params = {
          TeacherModels: TeacherModels,
          ClassModels: ClassModels,
          DisciplineModels: DisciplineModels,
          SourceID: this.selectOrg.id,
          SourceType: this.selectOrg.type,
          Users: userIdArr,
          Code: this.selectOrg.Code,
          IsCreateUaer: this.selectUser.UserID === 0 // 是否是添加人员的设置权限
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AdministrationRole/EditAdministrationRoleRange`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('保存成功。')
          this.modalSelectScope = false
          this.modalSelectScopeNew = false
          if (this.selectPersonType === 1) { // 教师
            this.checkAllListTeacher = []
          } else if (this.selectPersonType === 2) { // 学生
            this.checkAllList = []
          } else { // 家长
            this.checkAllListParent = []
          }
          this.loadTable()
          this.getRoleTree(true)
        } else {
          this.xy.msgError(res.msg)
        }
      },
      async selectScopeSubmitNew () {
        let userIdArr = []
        if (this.selectUser.UserID === 0) {
          if (this.selectPersonType === 1) { // 教师
            this.checkAllListTeacher.map((item) => {
              userIdArr.push(item.UserID)
            })
          } else if (this.selectPersonType === 2) { // 学生
            this.checkAllList.map((item) => {
              userIdArr.push(item.id)
            })
          } else { // 3 家长
            this.checkAllListParent.map((item) => {
              userIdArr.push(item.id)
            })
          }
        } else {
          userIdArr.push(this.selectUser.UserID)
        }
        let TeacherModels = []
        for (let t = 0; t < this.teacherSelect.length; t++) {
          TeacherModels.push({
            SchoolDistrictID: this.teacherSelect[t].SchoolDistrictID,
            ParentID: this.teacherSelect[t].ParentID,
            OrganizationID: this.teacherSelect[t].OrganizationID
          })
        }
        let ClassModels = []
        for (let c = 0; c < this.studentSelect.length; c++) {
          ClassModels.push({
            SchoolDistrictID: this.studentSelect[c].SchoolDistrictID,
            StudentGradeForStudentYearID: this.studentSelect[c].StudentGradeForStudentYearID,
            StudentOrganizationID: this.studentSelect[c].StudentOrganizationID
          })
        }
        let DisciplineModels = []
        for (let d = 0; d < this.subjectSelect.length; d++) {
          DisciplineModels.push({
            SchoolDistrictID: this.subjectSelect[d].SchoolDistrictID,
            StudentGradeForStudentYearID: this.subjectSelect[d].StudentGradeForStudentYearID,
            DisciplineID: this.subjectSelect[d].DisciplineID
          })
        }
        this.xy.loading()
        let params = {
          TeacherModels: TeacherModels,
          ClassModels: ClassModels,
          DisciplineModels: DisciplineModels,
          SourceID: this.selectOrg.id,
          SourceType: this.selectOrg.type,
          Users: userIdArr,
          Code: this.selectOrg.Code,
          IsCreateUaer: this.selectUser.UserID === 0 // 是否是添加人员的设置权限
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AdministrationRole/EditAdministrationRoleRange`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('保存成功。')
          this.modalSelectScope = false
          this.modalSelectScopeNew = false
          if (this.selectPersonType === 1) { // 教师
            this.checkAllListTeacher = []
          } else if (this.selectPersonType === 2) { // 学生
            this.checkAllList = []
          } else { // 3 家长
            this.checkAllListParent = []
          }
          this.loadTable()
          this.getRoleTree(true)
        } else {
          this.xy.msgError(res.msg)
        }
      },
      preStep () {
        this.modalSelectScope = false
        this.more(String(this.selectPersonType), 'prevStep')
      },
      preStepNew () {
        this.modalSelectScopeNew = false
        this.more(String(this.selectPersonType))
      },
      // 删除
      del (row) {
        let that = this
        that.$Modal.confirm({
          title: '删除',
          content: '<p>您确定从此角色中移除“' + row.FullName + '”吗？</p>',
          async onOk () {
            that.xy.loading()
            let params = {
              Type: that.selectOrg.type,
              ID: row.ID
            }
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/AdministrationRole/DeleteDetailUser`, params, true)
            that.xy.unloading()
            if (res.success) {
              if (that.tbData.length > 1) {
                that.tbData.length = that.tbData.length - 1
              } else {
                if (that.pagination.current > 1) {
                  that.pagination.current = that.pagination.current - 1
                }
              }
              that.getRoleTree(true)
              that.xy.msgSuc('删除成功。')
              that.loadTable()
            } else {
              that.xy.msgError(res.msg || '删除失败。')
            }
          }
        })
      },
      // 批量删除
      moreDel (row) {
        let that = this
        that.$Modal.confirm({
          title: '删除',
          content: '<p>您确定要移除勾选人员吗？</p>',
          async onOk () {
            that.xy.loading()
            let params = {
              Type: that.selectOrg.type,
              ID: row.ID
            }
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/AdministrationRole/DeleteDetailUser`, params, true)
            that.xy.unloading()
            if (res.success) {
              if (that.tbData.length > 1) {
                that.tbData.length = that.tbData.length - 1
              } else {
                if (that.pagination.current > 1) {
                  that.pagination.current = that.pagination.current - 1
                }
              }
              that.getRoleTree(true)
              that.xy.msgSuc('删除成功。')
              that.loadTable()
            } else {
              that.xy.msgError(res.msg || '删除失败。')
            }
          }
        })
      },
      // 批量删除
      AllDel (row) {
        let that = this
        that.$Modal.confirm({
          title: '删除',
          content: '<p>您确定要移除全部人员吗？</p>',
          async onOk () {
            that.xy.loading()
            let params = {
              Type: that.selectOrg.type,
              ID: row.ID
            }
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/AdministrationRole/DeleteDetailUser`, params, true)
            that.xy.unloading()
            if (res.success) {
              if (that.tbData.length > 1) {
                that.tbData.length = that.tbData.length - 1
              } else {
                if (that.pagination.current > 1) {
                  that.pagination.current = that.pagination.current - 1
                }
              }
              that.getRoleTree(true)
              that.xy.msgSuc('删除成功。')
              that.loadTable()
            } else {
              that.xy.msgError(res.msg || '删除失败。')
            }
          }
        })
      },
      // 设置权限
      setPermission (row) {
        this.$store.commit('common/getThreeMenuName', '设置权限')
        this.$store.commit('common/getParam', { row: JSON.stringify(row) })
        this.$store.commit('base/changeRoleValue', this.getParams())
        this.$router.push({ name: 'permissionSetup', query: this.$store.state.common.menuInfo })
      },
      // 学生、家长、教师
      more (res, type) {
        switch (res) {
          case '1':
            this.addTeacher(type)
            break
          case '2':
            this.addStudent(type)
            break
          case '3':
            this.addParent(type)
            break
        }
      },

      // 添加家长-----------s
      async addParent (type) {
        if (type === 'prevStep') {
          // 在选择范围弹框点击‘上一步’回到选人弹框时
        } else {
          // 获取列表已添加家长-去重 roleType 2教师 3学生 4家长
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/AdministrationRole/GetAllUserByType`, {
            sourceID: this.selectOrg.id,
            sourceType: this.selectOrg.type,
            roleType: 4
          })
          if (res.success) {
            if (res.data == null) {
              this.haveParent = []
            } else {
              this.haveParent = res.data
              this.haveParent.map((item) => {
                item.id = item.UserID
              })
            }
          }
          this.xy.unloading()
          this.checkAllListParent = []
          this.newAddParent = [] // 重置
        }
        this.selectPersonType = 3

        this.isShowParent = true
      },
      // 取消添加家长
      selectCancelParent () {
        this.isShowParent = false
        this.checkAllListParent = []
      },
      // 添加家长-确认
      async selectConfirmParent (data) {
        this.checkAllListParent = [...data] // 获取子组件选中的家长数据
        let userIdArr = []
        if (this.checkAllListParent.length > 0) {
          this.checkAllListParent.map((item) => {
            userIdArr.push(item.id)
          })
          this.xy.loading()
          let params = {
            TeacherModels: [],
            ClassModels: [],
            DisciplineModels: [],
            SourceID: this.selectOrg.id,
            SourceType: this.selectOrg.type,
            Users: userIdArr,
            Code: this.selectOrg.Code,
            IsCreateUaer: true // 是否是添加人员的设置权限
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/AdministrationRole/EditAdministrationRoleRange`, params)
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('添加成功。')
            this.isShowParent = false
            this.checkAllListParent = []

            this.modalSelectScope = false // ?
            this.modalSelectScopeNew = false // ?

            this.loadTable() // 列表更新
            this.getRoleTree(true) // 左侧树刷新
          }
        } else {
          this.xy.msgError('请先选择家长。')
        }
      },
      // 添加家长-下一步
      nextConfirmParent (data) {
        this.checkAllListParent = [...data] // 获取子组件选中的家长数据
        if (this.checkAllListParent.length === 0) {
          return this.xy.msgError('请先选择家长。')
        }
        this.isShowParent = false
        this.selectScopeFun({
          UserID: 0
        })
        // 点'下一步'时返回的所有当前已选家长（未点确定添加的），需要在点'上一步'后，在选择家长弹框中回显（列表中的家长数据不做反选，所以不能添加到this.haveTeacher中）
        this.newAddParent = this.checkAllListParent
      },
      // 添加家长-----------end

      // 添加教师--------s
      async addTeacher (type) {
        if (type === 'prevStep') {
          // 在选择范围弹框点击‘上一步’回到选人弹框时
        } else {
          // 获取列表已添加教师-去重 roleType 2教师 3学生 4家长
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/AdministrationRole/GetAllUserByType`, {
            sourceID: this.selectOrg.id,
            sourceType: this.selectOrg.type,
            roleType: 2
          })
          if (res.success) {
            if (res.data == null) {
              this.haveTeacher = []
            } else {
              this.haveTeacher = res.data
              this.haveTeacher.map((item) => {
                item.id = item.UserID
              })
            }
          }
          this.xy.unloading()
          this.checkAllListTeacher = []
          this.newAddTeacher = [] // 重置
        }
        this.selectPersonType = 1

        this.isShowTeacher = true
      },
      // 取消添加教师
      selectCancelTeacher () {
        this.isShowTeacher = false
        this.checkAllListTeacher = []
      },
      // 添加教师-确认
      async selectConfirmTeacher (data) {
        this.checkAllListTeacher = [...data] // 获取子组件选中的教师数据
        let userIdArr = []
        if (this.checkAllListTeacher.length > 0) {
          this.checkAllListTeacher.map((item) => {
            userIdArr.push(item.UserID)
          })
          this.xy.loading()
          let params = {
            TeacherModels: [],
            ClassModels: [],
            DisciplineModels: [],
            SourceID: this.selectOrg.id,
            SourceType: this.selectOrg.type,
            Users: userIdArr,
            Code: this.selectOrg.Code,
            IsCreateUaer: true // 是否是添加人员的设置权限
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/AdministrationRole/EditAdministrationRoleRange`, params)
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('添加成功。')
            this.isShowTeacher = false
            this.checkAllListTeacher = []

            this.modalSelectScope = false // ?
            this.modalSelectScopeNew = false // ?

            this.loadTable() // 列表更新
            this.getRoleTree(true) // 左侧树刷新
          }
        } else {
          this.xy.msgError('请先选择教师。')
        }
      },
      // 添加教师-下一步
      nextConfirmTeacher (data) {
        this.checkAllListTeacher = [...data] // 获取子组件选中的教师数据
        if (this.checkAllListTeacher.length === 0) {
          return this.xy.msgError('请先选择教师。')
        }
        this.isShowTeacher = false
        this.selectScopeFun({
          UserID: 0
        })
        // 点'下一步'时返回的所有当前已选教师（未点确定添加的），需要在点'上一步'后，在选择教师弹框中回显（列表中的教师数据不做反选，所以不能添加到this.haveTeacher中）
        this.newAddTeacher = this.checkAllListTeacher
      },
      // 添加教师-----------end

      // 添加学生-----------s
      async addStudent (type) {
        if (type === 'prevStep') {
          // 在选择范围弹框点击‘上一步’回到选人弹框时
        } else {
          // 获取列表已添加学生-去重 roleType 2教师 3学生 4家长
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/AdministrationRole/GetAllUserByType`, {
            sourceID: this.selectOrg.id,
            sourceType: this.selectOrg.type,
            roleType: 3
          })
          if (res.success) {
            if (res.data == null) {
              this.haveStudent = []
            } else {
              this.haveStudent = res.data
              this.haveStudent.map((item) => {
                item.id = item.UserID
              })
            }
          }
          this.xy.unloading()
          this.checkAllList = []
          this.newAddStudent = [] // 重置
        }
        this.selectPersonType = 2

        this.isShowStudent = true
      },
      // 取消添加学生
      selectCancel () {
        this.isShowStudent = false
        this.checkAllList = []
      },
      // 添加学生-确认
      async selectConfirm (data) {
        this.checkAllList = [...data] // 获取子组件选中的学生数据
        let userIdArr = []
        if (this.checkAllList.length > 0) {
          this.checkAllList.map((item) => {
            userIdArr.push(item.id)
          })
          this.xy.loading()
          let params = {
            TeacherModels: [],
            ClassModels: [],
            DisciplineModels: [],
            SourceID: this.selectOrg.id,
            SourceType: this.selectOrg.type,
            Users: userIdArr,
            Code: this.selectOrg.Code,
            IsCreateUaer: true // 是否是添加人员的设置权限
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/AdministrationRole/EditAdministrationRoleRange`, params)
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('添加成功。')
            this.isShowStudent = false
            this.checkAllList = []

            this.modalSelectScope = false // ?
            this.modalSelectScopeNew = false // ?

            this.loadTable() // 列表更新
            this.getRoleTree(true) // 左侧树刷新
          }
        } else {
          this.xy.msgError('请先选择学生。')
        }
      },
      // 添加学生-下一步
      nextConfirm (data) {
        this.checkAllList = [...data] // 获取子组件选中的学生数据
        if (this.checkAllList.length === 0) {
          return this.xy.msgError('请先选择学生。')
        }
        this.isShowStudent = false
        this.selectScopeFun({
          UserID: 0
        })
        // 点'下一步'时返回的所有当前已选学生（未点确定添加的），需要在点'上一步'后，在选择学生弹框中回显（列表中的学生数据不做反选，所以不能添加到this.haveTeacher中）
        this.newAddStudent = this.checkAllList
      }
      // 添加学生-----------end
    }
  }
</script>
<style lang="less" scoped>
  .left-box {
    margin-right:20px;
    border: 1px solid #e3e3e3;
  }
  .box-header {
    height: 58px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed #4196FF;
    padding: 0 10px;
    font-size: 16px;
  }
  .box-header i {
    border: 1px solid #4196FF;
    border-radius:5px;
    cursor:pointer;
  }
  .box-body {
    height: 820px;
    overflow: auto;
  }
  .tree-dom {
    padding: 10px 14px;
  }
  .tree-dom .ivu-tree-title{
    font-size:14px;
  }
  .tree-dom .tree-li {
    display:inline-block;
    width:100%;
    min-width:200px;
  }
    .fl {
    float: left;
    button {
      margin-right: .5em;
    }
  }
  .fr {
    float: right;
  }
  .pr {
    position: relative;
  }
  .clearfix:after {
    content: "";
    display: table;
    clear: both;
  }
  .no-data-box {
    width: 392px;
    margin: 50px auto;
    position: relative;
}
.no-data-box > .no-data-img {
    width: 100%;
}
img {
    border: none;
    vertical-align: middle;
}
.no-data-box > .no-data-text {
    position: absolute;
    top: 207px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 18px;
    color: #ccc;
    display: inline-table;
}
</style>
