<template>
  <div>
    <a-modal :title="modalTitle"
             width='50%'
             :maskClosable="false"
             :visible="isShow"
             @cancel="cancel"
             :confirm-loading="confirmLoading">
      <a-spin :spinning="modalLoading"
              tip="加载中">
        <a-row class="xy-flex">
          <div class="left">
            <div class='input-box'>
              <a-input-search placeholder="请输入用户名/学籍号/姓名"
                              allowClear
                              v-model.trim="keyWord"
                              @search='searchFun' />
            </div>
            <a-tree show-icon
                    v-if='!isSearching&&newList.length>0&&isHaveStudent'
                    :tree-data="newList"
                    :load-data="newLoadData"
                    checkable
                    :checked-keys='curNode'
                    @check="onCheck"
                    @expand="onExpand"
                    :expanded-keys="expandedKeys"
                    :auto-expand-parent="autoExpandParent"
                    :selectable='false'
                    blockNode>
              <img v-if='node.image'
                   :src="node.image"
                   class="head-icon"
                   slot-scope="node"
                   slot="icon" />
              <span v-else
                    class="head-icon"
                    :class="!node.sex?'woman':''"
                    slot="icon"
                    slot-scope="node">
                {{xy.showName(node.title)}}
              </span>
              <template slot="title"
                        slot-scope="node">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{ node.name}}</span>
                  </template>
                  <span>{{ node.title}}</span>
                </a-tooltip>
              </template>
            </a-tree>
            <div class="nodata"
                 v-if='(newList.length==0&&!isSearching)||!isHaveStudent'>未搜索到相关结果。</div>
          </div>
          <div class="right">
            <div class="count-room"
                 v-if='checkAllList.length>0'>已选:{{checkAllList.length}}人</div>
            <div class="nodata"
                 style="margin-top:46px"
                 v-else>您还未选择任何学生，请选择学生。</div>
            <div class="room-overflow"
                 v-if='checkAllList.length>0'>
              <div v-for='item in checkAllList'
                   :key='item.id'
                   class="room">
                <div>
                  <img v-if='item.image'
                       :src="item.image"
                       class="head-icon">
                  <span v-else
                        class="head-icon"
                        :class="!item.sex?'woman':''">{{xy.showName(item.title)}}</span>
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>{{ item.name}}</span>
                    </template>
                    <span class="tag">{{item.title}}</span>
                  </a-tooltip>
                </div>
                <i class="iconfont del-btn"
                   @click="delFun(item)">&#xe6f3;</i>
              </div>
            </div>
          </div>
        </a-row>
      </a-spin>
      <div slot='footer'>
        <Button class='xy-modal-close'
                @click='cancel'>取消</Button>
        <Button class='xy-modal-primary'
                shape='circle'
                @click='confirm'>确定</Button>
      </div>
    </a-modal>
  </div>
</template>
<script>
  export default {
    name: 'SelectStudent',
    props: {
      modalTitle: {
        type: String,
        default: '选择学生'
      },
      isShow: {
        type: Boolean,
        required: true
      },
      isMustChoose: { // 是否必须选学生
        type: Boolean,
        default: true
      },
      // 请求接口的地址
      apiData: {
        type: Object,
        required: true,
        default: () => {
          return {
            url: '',
            type: 'get',
            params: {}
          }
        }
      },
      schoolDistrictID: { // 校区id
        type: Number,
        default: 0
      },
      isGraduation: {// 是否包含毕业
        type: Boolean,
        default: false
      },
      isEffective: {// 是否包含未在班级学生组织
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        newList: [],
        expandedKeys: [],
        autoExpandParent: true,
        keyWord: '',
        isHaveStudent: true, // 搜索之后，过滤掉已选中的学生后，newlist里，是否还有学生
        isSearching: false,
        selectStudent: [],
        // 弹窗
        modalLoading: false,
        confirmLoading: false,
        curNode: [],
        // 右侧选中的学生
        checkAllList: [],
        keepSearch: false // 是否处于搜索状态下
      }
    },
    watch: {
      isShow (val) {
        if (val) {
          this.keyWord = ''
          this.checkAllList = []
          this.autoExpandParent = true
          this.expandedKeys = []
          this.isHaveStudent = true
          this.curNode = []
          this.isSearching = false
          this.getAlreadyAddStudents()
        }
      }
    },
    methods: {
      // 弹窗
      cancel () {
        this.$emit('select-cancel')
      },
      // 确定
      confirm () {
        if (this.isMustChoose && this.checkAllList.length === 0) {
          this.xy.msgError('请选择学生。')
          return
        }
        this.$emit('select-confirm', this.checkAllList)
      },
      async getAlreadyAddStudents () {
        this.modalLoading = true
        let type = this.apiData.type || 'get'
        let params = type === 'get' ? this.apiData.params : { params: this.apiData.params }
        let res = await this.xy[type](`${this.apiData.url}`, params)
        if (res.success) {
          this.selectStudent = res.data || []
          if (this.selectStudent.length > 0) {
            this.selectStudent = this.selectStudent.map(item => item.UserID || item.id || item.StudentID)
          }
          // console.log(this.selectStudent)
          this.openAddModal()
        } else {
          this.modalLoading = false
        }
      },
      async openAddModal () {
        this.newList = []
        this.keepSearch = false
        let params = {
          schoolDistrictID: this.schoolDistrictID, // 查某个校区下的学生组织（默认查询全部）
          isGraduation: this.isGraduation,
          isEffective: this.isEffective
        }
        this.modalLoading = true
        this.isHaveStudent = true
        let res = await this.xy.get(this.xyApi + '/xy/component/GetStudentOrganizationTree', params)
        this.modalLoading = false
        if (res.success) {
          this.newList = this.setTree(res.data || [])
        }
      },
      // 递归学生
      setTree (orglist, rightArr = [], filterStudent = [], isSearch = false) {
        let result = []; let obj = {}
        for (let i = 0; i < orglist.length; i++) {
          let status = false
          if (rightArr.length > 0 && orglist[i].Type === 'ST') {
            if (rightArr.indexOf(orglist[i].ID) !== -1) {
              status = true
              this.curNode.push(orglist[i].ID)
            }
          }
          obj = {
            name: orglist[i].Type === 'ST' ? orglist[i].UserName : orglist[i].Name,
            title: orglist[i].Name.length > 20 ? orglist[i].Name.substr(0, 20) + '...' : orglist[i].Name,
            id: orglist[i].Type === 'ST' ? orglist[i].ID : `${orglist[i].SchoolDistrictID}/${orglist[i].StudentYearID}/${orglist[i].StudentOrganizationID}/${orglist[i].StudentGradeID}/${orglist[i].Type}`,
            key: orglist[i].Type === 'ST' ? orglist[i].ID : `${orglist[i].SchoolDistrictID}/${orglist[i].StudentYearID}/${orglist[i].StudentOrganizationID}/${orglist[i].StudentGradeID}/${orglist[i].Type}`,
            checked: status,
            isStudent: orglist[i].Type === 'ST',
            isLeaf: orglist[i].Type === 'ST',
            isHaveChild: true,
            schoolDistrictID: orglist[i].SchoolDistrictID,
            studentYearID: orglist[i].StudentYearID,
            studentGradeID: orglist[i].StudentGradeID,
            studentOrganizationID: orglist[i].StudentOrganizationID,
            type: orglist[i].Type,
            sex: orglist[i].Type === 'ST' ? orglist[i].Sex : '',
            image: orglist[i].Type === 'ST' ? orglist[i].Icon : '',
            children: this.setTree(orglist[i].MemberList, rightArr, filterStudent, isSearch) || [],
            scopedSlots: { title: 'title' }
          }
          if (orglist[i].Type === 'SG') { // 默认展开到年级
            this.expandedKeys.push(obj.id)
          }
          if (isSearch) {
            if (!obj.children.length && orglist[i].Type !== 'ST') {
              obj.isHaveChild = false
            }
            if (orglist[i].Type === 'SO' && obj.isHaveChild) { // 搜索时自动展开每一级
              this.expandedKeys.push(obj.id)
            }
          }

          if (orglist[i].Type === 'ST') {
            obj.scopedSlots.icon = 'icon'
            if (filterStudent.indexOf(orglist[i].ID) === -1) { // 没有添加过的学生放进tree里面，反之。
              result.push(obj)
              if (!this.isHaveStudent) {
                this.isHaveStudent = true
              }
            }
          } else {
            result.push(obj)
          }
        }
        return result
      },
      async newLoadData (treeNode) {
        let dataRef = treeNode.dataRef
        if ((dataRef.type !== 'SO' || dataRef.children.length > 0) && dataRef.isHaveChild) {
          return
        }
        let rightIds = this.checkAllList.length > 0 ? this.checkAllList.map(item => item.id) : []
        let params = {
          schoolDistrictID: dataRef.schoolDistrictID,
          studentYearID: dataRef.studentYearID,
          studentGradeID: dataRef.studentGradeID,
          studentOrganizationID: dataRef.studentOrganizationID
        }
        let rs = await this.xy.get(this.xyApi + '/xy/component/StudentOrganizationMember', params)
        let data = []
        let node = []
        if (rs.data.length > 0) {
          rs.data = rs.data[0].Students || []
          rs.data.forEach((val, index) => {
            if (this.selectStudent.indexOf(val.StudentID) === -1) { // 已经添加过的学生过滤不显示
              let obj = {
                isLeaf: true,
                id: val.StudentID,
                name: val.UserName,
                title: val.FullName.length > 20 ? val.FullName.substr(0, 20) + '...' : val.FullName,
                isStudent: true,
                sex: val.Sex,
                image: val.Icon,
                key: val.StudentID,
                scopedSlots: { title: 'title', icon: 'icon', hoverTitle: 'hoverTitle' },
                children: [],
                checked: rightIds.indexOf(val.StudentID) !== -1,
                schoolDistrictID: val.SchoolDistrictID,
                studentYearID: val.StudentYearID,
                studentGradeID: val.StudentGradeID,
                studentOrganizationID: val.StudentOrganizationID,
                studentGradeForStudentYearID: val.StudentGradeForStudentYearID
              }
              data.push(obj)
              if (obj.checked) {
                node.push(obj.id)
              }
            }
          })
        }

        if (data.length === 0) {
          dataRef.isHaveChild = false
        }

        dataRef.children = data
        this.newList = [...this.newList]
        this.curNode = [...node, ...this.curNode]
      },
      //   ----------设置学生的选中start ----------
      // 设置学生
      delFun (val) {
        this.checkAllList = this.checkAllList.filter(item => {
          return item.id !== val.id
        })
        this.chooseCheck(this.newList, val)
      },

      onCheck (checkNode, info) {
        let ids = this.checkAllList.length > 0 ? this.checkAllList.map(item => item.id) : []
        if (info.node.dataRef.isStudent) {
          this.changeData(info, checkNode, ids, true)
        } else if (info.node.dataRef.type !== 'SO' && !this.keepSearch) { // 没有获取到学生节点
          this.getStudentByOrgId(info, checkNode)
        } else if (info.node.dataRef.type !== 'SO' && this.keepSearch) { // 搜索状态下，已经获取到学生节点
          this.changeData(info, checkNode, ids, false)
        } else if (info.node.dataRef.type === 'SO' && info.node.dataRef.isHaveChild && info.node.dataRef.children.length === 0) { // 没有获取到学生节点
          this.getStudentByOrgId(info, checkNode)
        } else if (info.node.dataRef.type === 'SO' && info.node.dataRef.children.length > 0) {
          this.changeData(info, checkNode, ids, false)
        }
        this.curNode = checkNode
      },
      changeData (info, checkNode, ids, isStudent) {
        let arr = []
        if (info.checked && isStudent) {
          if (ids.indexOf(info.node.dataRef.id) === -1) { // 选中的是学生
            arr.push(info.node.dataRef)
          }
          this.checkAllList = [...this.checkAllList, ...arr]
        } else if (info.checked && !isStudent) {
          let childrenArr = info.node.dataRef.type === 'SO' ? info.node.dataRef.children : this.nodeList(info.node.dataRef.children)
          if (this.checkAllList.length === 0) {
            this.checkAllList = childrenArr
          } else {
            childrenArr.map(item => {
              if (ids.indexOf(item.id) === -1) {
                arr.push(item)
              }
            })
            this.checkAllList = [...this.checkAllList, ...arr]
          }
        } else if (!info.checked && isStudent && this.checkAllList.length > 0) {
          this.checkAllList = this.checkAllList.filter(val => val.id !== info.node.dataRef.id)
        } else if (!info.checked && !isStudent && this.checkAllList.length > 0) {
          let childrenArr = []
          if (info.node.dataRef.type === 'SO') {
            childrenArr = info.node.dataRef.children.map(item => item.id)
          } else {
            childrenArr = this.nodeList(info.node.dataRef.children)
            childrenArr = childrenArr.map(item => item.id)
          }
          // let childrenArr = info.node.dataRef.children.map(item => item.id)
          this.checkAllList = this.checkAllList.filter(item => !childrenArr.some(kitem => kitem === item.id))
        }
      },

      // 根据组织获取学生
      async getStudentByOrgId (info, checkNode) {
        this.modalLoading = true
        let dataRef = info.node.dataRef
        let params = {
          schoolDistrictID: dataRef.schoolDistrictID,
          studentYearID: dataRef.studentYearID,
          studentGradeID: dataRef.studentGradeID,
          studentOrganizationID: dataRef.studentOrganizationID
        }
        let res = await this.xy.get(this.xyApi + '/xy/component/StudentOrganizationMember', params)
        if (res.success) {
          this.setStudent(res.data, info, checkNode)
        }
        this.modalLoading = false
      },
      setStudent (data, info, checkNode) {
        let filterStudent = []
        let arr = []
        if (this.checkAllList.length > 0) {
          filterStudent = this.checkAllList.map(item => item.id)
        }
        let filterAllIds = [...this.selectStudent, ...filterStudent]
        data.map(kitem => {
          if (kitem.Students.length > 0) {
            kitem.Students.map(item => {
              let obj = {
                name: item.UserName,
                title: item.FullName.length > 20 ? item.FullName.substr(0, 20) + '...' : item.FullName,
                id: item.StudentID,
                key: item.StudentID,
                checked: info.checked,
                isStudent: true,
                isLeaf: true,
                schoolDistrictID: item.SchoolDistrictID,
                studentYearID: item.StudentYearID,
                studentGradeID: item.StudentGradeID,
                studentOrganizationID: item.StudentOrganizationID,
                type: item.Type,
                sex: item.Sex,
                image: item.Icon,
                children: [],
                scopedSlots: { title: 'title', icon: 'icon' }
              }
              if (info.checked) { // 根据左边勾选的组织，添加学生到右边
                if (filterAllIds.indexOf(item.StudentID) === -1) {
                  arr.push(obj)
                }
              } else if (!info.checked && this.checkAllList.length > 0) {
                let index = this.checkAllList.map((val) => {
                  return val.id
                }).indexOf(item.StudentID)
                if (index !== -1) {
                  this.checkAllList.splice(index, 1)
                }
              }
            })
          }
        })
        if (info.checked) {
          this.checkAllList = [...this.checkAllList, ...arr]
        }

        // if (info.checked) {
        //   this.curNode = Array.from(new Set([...checkNode, ...this.curNode]))
        // } else {
        //   this.curNode = checkNode
        // }
      },
      // 根据子节点的状态，设置父节点的状态
      chooseCheck (info = this.newList, val, arr = []) {
        // console.log(arr)
        for (let i = 0; i < info.length; i++) {
          if (info[i].type === 'SD') {
            if (info[i].schoolDistrictID === val.schoolDistrictID) {
              arr.push(`${info[i].schoolDistrictID}/${info[i].studentYearID}/${info[i].studentOrganizationID}/${info[i].studentGradeID}/${info[i].type}`)
              this.chooseCheck(info[i].children, val, arr)
              break
            }
          } else if (info[i].type === 'SG') {
            if (info[i].studentGradeID === val.studentGradeID) {
              arr.push(`${info[i].schoolDistrictID}/${info[i].studentYearID}/${info[i].studentOrganizationID}/${info[i].studentGradeID}/${info[i].type}`)
              this.chooseCheck(info[i].children, val, arr)
              break
            }
          } else if (info[i].type === 'SY') {
            if (info[i].studentYearID === val.studentYearID) {
              arr.push(`${info[i].schoolDistrictID}/${info[i].studentYearID}/${info[i].studentOrganizationID}/${info[i].studentGradeID}/${info[i].type}`)
              this.chooseCheck(info[i].children, val, arr)
              break
            }
          } else if (info[i].type === 'SO') {
            if (info[i].studentOrganizationID === val.studentOrganizationID) {
              arr.push(`${info[i].schoolDistrictID}/${info[i].studentYearID}/${info[i].studentOrganizationID}/${info[i].studentGradeID}/${info[i].type}`)
              this.chooseCheck(info[i].children, val, arr)
              break
            }
          } else if (info[i].isStudent) {
            if (info[i].id === val.id) {
              arr.push(info[i].id)
              break
            }
          }
        }
        this.curNode = this.curNode.filter(item => !arr.some(kitem => kitem === item))
      },
      nodeList (data, nodeData = []) { // 操作节点及子节点的id
        data.map(item => {
          if (item.type === 'ST') {
            nodeData.push(item)
          }
          if (item.children && item.children.length > 0) {
            this.nodeList(item.children, nodeData)
          }
        })
        return nodeData
      },
      //   ----------设置学生的选中end ----------
      //   ----------搜索tree,Start ----------
      onExpand (expandedKeys) {
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      async searchFun () {
        this.keepSearch = true
        if (this.keyWord.length === 0) {
          this.expandedKeys = []
          this.curNode = []
          this.openAddModal()
          return false
        }
        this.modalLoading = true
        this.isSearching = true
        this.isHaveStudent = false
        let params = {
          searchText: this.keyWord
        }
        let res = await this.xy.get(this.xyApi + '/xy/component/SearchStudentOrganizationMember', params)
        if (res.success) {
          this.newList = []
          this.studentArr = []
          let rightArr = this.checkAllList.map(item => item.id)
          if (this.schoolDistrictID > 0) {
            res.data = res.data.filter(item => item.SchoolDistrictID === this.schoolDistrictID)
          }
          if (res.data.length > 0) {
            this.expandedKeys = []
            this.curNode = []
            this.newList = this.setTree(res.data, rightArr, this.selectStudent, true)
          }
        }
        this.modalLoading = false
        this.isSearching = false
      }
    }
  }
</script>
<style lang="less" scoped>
@import '../css/antModal.less';
</style>
