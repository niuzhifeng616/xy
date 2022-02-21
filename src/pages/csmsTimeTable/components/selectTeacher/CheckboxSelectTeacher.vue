<template>
  <div>
    <a-modal :title="modalTitle"
              width='50%'
              :maskClosable="false"
              :visible="isShow"
              @cancel="cancel"
              :confirm-loading="confirmLoading">

      <a-row class="xy-flex" v-show='!modalLoading'>

        <div class="left">
          <div class='input-box'>
            <a-input-search v-model="keyWord" placeholder="请输入用户名/工号/姓名" allowClear @search='searchFun' />
          </div>
          <a-tree show-icon
                  :tree-data="newList"
                  checkable
                  :checked-keys='curNode'
                  @check="onCheck"
                  @expand="onExpand"
                  :expanded-keys="expandedKeys"
                  :auto-expand-parent="autoExpandParent"
                  :selectable='false'
                  blockNode
                  v-if="newList.length && !treeLoading"><!-- :checked-keys选中复选框的树节点 --><!-- :expanded-keys展开指定的树节点 -->
            <img v-if='node.image' :src="node.image" class="head-icon" slot-scope="node" slot="icon" />
            <span v-else class="head-icon" :class="!node.sex?'woman':''" slot="icon" slot-scope="node">{{xy.showName(node.title)}}</span>
            <template slot="title" slot-scope="node">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>{{ node.title}}</span>
                </template>
                <span>{{ node.title.length>20?node.title.substr(0,20)+'...':node.title }}</span>
              </a-tooltip>
            </template>
            <template slot="teaName" slot-scope="node">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>{{ node.userName}}</span>
                </template>
                <span> {{ node.title.length>20?node.title.substr(0,20)+'...':node.title }}</span>
              </a-tooltip>
            </template>
          </a-tree>
          <div class="loading-tree" v-if="treeLoading">
            <a-spin tip="加载中" />
          </div>
          <div class="nodata" v-show="!newList.length && !modalLoading && !treeLoading">未搜索到相关结果。</div>
        </div>

        <div class="right">
          <div class="count-room" v-show='checkAllList.length'>已选:{{checkAllList.length}}人</div>
          <div class="nodata right-tip" v-show='!checkAllList.length && !modalLoading'>您还未选择任何教师，请选择教师。</div>
          <div class="room-overflow" v-if='checkAllList.length>0'>
            <div v-for='item in checkAllList' :key='item.id' class="room">
              <div>
                <img v-if='item.image' :src="item.image" class="head-icon">
                <span v-else class="head-icon" :class="!item.sex?'woman':''">{{xy.showName(item.title)}}</span>
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{ item.userName}}</span>
                  </template>
                  <span class="tag"> {{item.title.length>20?item.title.substr(0,20)+'...':item.title}}</span>
                </a-tooltip>
              </div>
              <i class="iconfont del-btn" @click="delFun(item)">&#xe6f3;</i>
            </div>
          </div>
        </div>

      </a-row>

      <div class="loading-box" v-if="modalLoading">
        <a-spin tip="加载中" />
      </div>

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
    name: 'SelectTeacher',
    props: {
      modalTitle: {
        type: String,
        default: '选择教师'
      },
      isShow: {
        type: Boolean,
        required: true
      },
      isMustChoose: { // 是否必须选教师
        type: Boolean,
        default: true
      },
      // 外部组件传入的已经选中的教师
      selectMembers: {
        type: Array,
        required: false
      },
      // 外部组件传入的是否过滤已经选中的教师（默认false:不过滤+反选）
      setFilter: {
        type: Boolean,
        default: false
      },

      schoolDistrictID: { // 校区id
        type: Number,
        default: -99
      }
    },
    data () {
      return {
        newList: [],
        copyDataList: [], // 避免操作污染数据源，缓存初始化数据源
        expandedKeys: [],
        copyExpandedKeys: [], // 一定条件下保存搜索前展开的节点信息
        autoExpandParent: true,
        keyWord: '', // 搜索的关键字
        keyWordTrim: '', // 搜索的value，去掉首尾空格后的值
        isHaveVal: false, // 输入框的value是否为真

        // 弹窗
        modalLoading: false,
        confirmLoading: false,
        curNode: [], // 左侧选中的教师唯一id(arr)（不包含搜索时已选中但是未展示的已选中数据）
        checkedValue: [], // 缓存的左侧被选中的教师对象（arr）（包含搜索时已选中但是未展示的已选中数据）

        // 右侧选中的教师
        selectTeacherIds: [], // 外部组件传入的教师UserId（这里需要注意的是，传入对象数组，对象中必须包含id[用户的id]）
        checkAllList: [], // 右侧已选显示数据, tree需要反选时需要加入外部传入的数据->selectTeacherIds。
        rightSta: false, // 是否是右侧删除（true）
        treeLoading: false, // 为了解决卡顿，添加loading动画状态控制
        include: [] // 在右侧点击教师删除时，此教师对应的左侧tree上所有不同组织的相同教师的唯一id的集合
      }
    },
    watch: {
      isShow (val) {
        if (val) {
          this.keyWord = ''
          this.checkAllList = []
          this.autoExpandParent = true
          this.expandedKeys = []
          this.copyExpandedKeys = []
          // 外部组件传入的已添加数据
          if (this.selectMembers && this.selectMembers.length > 0) {
            this.selectTeacherIds = this.selectMembers.map(item => item.UserID)
          } else {
            this.selectTeacherIds = []
          }
          this.curNode = []
          this.openAddModal()
        }
      }
      // keyWord: {
      //   handler: 'clearKayWd'
      // }
    },
    methods: {
      // 清空搜索条件时还原被选中，或者进行一些其他操作
      clearKayWd (val = '') {
        if (val !== '') return
        this.curNode = this.checkedValue.map(v => v.id)
      },
      // 弹窗
      cancel () {
        this.$emit('select-cancel')
      },
      confirm () {
        if (this.isMustChoose && this.checkAllList.length === 0) {
          this.xy.msgError('请选择教师。')
          return
        }
        this.$emit('select-confirm', this.checkAllList)
      },
      async openAddModal () {
        this.newList = []
        let params = {
          schoolDistrictID: this.schoolDistrictID, // 校区ID（默认加载全部 -99 、 >0 加载固定校区、 = 0加载行政组织、= -1 加载未在组织教师 ）
          isLoadTeachingTeacher: true, // 是否加载教学教师（默认加载）
          isLoadAdministrationTeacher: true, // 是否加载行政教师（默认加载）
          isLoadNoOrgTeacher: true // 是否加载未在组织教师（默认加载）
        }
        this.modalLoading = true
        let res = await this.xy.get(this.xyApi + '/xy/component/GetTeacherTree', params)
        this.modalLoading = false
        if (res.success) {
          if (res.data && !res.data.length) return
          this.curNode = []
          this.checkedValue = []
          this.newList = this.setTree(res.data)
          this.copyDataList = JSON.parse(JSON.stringify(this.newList))
          this.copyExpandedKeys = [...this.expandedKeys]
        }
      },
      // 递归教师
      setTree (orglist) {
        let result = []; let obj = {}
        if (orglist && orglist.length) {
          for (let i = 0; i < orglist.length; i++) {
            // 校区
            obj = {
              title: orglist[i].OrganizationName,
              id: `${orglist[i].SchoolDistrictID}/${orglist[i].OrganizationID}/${orglist[i].OrganizationType || ''}`,
              key: `${orglist[i].SchoolDistrictID}/${orglist[i].OrganizationID}/${orglist[i].OrganizationType || ''}`,
              leve: 0,
              children: this.setTree(orglist[i]),
              scopedSlots: { title: 'title' }
            }
            if (orglist[i].OrganizationID === 0 || orglist[i].SchoolDistrictID === 0 || orglist[i].SchoolDistrictID === -1) { // 默认展开到第二级(OrganizationID === 0正常一级组织，SchoolDistrictID === 0自定义一级组织，SchoolDistrictID: -1未在组织教师)
              this.expandedKeys.push(obj.id)
            }
            result.push(obj)
          }
        }
        if (orglist.Members && orglist.Members.length) {
          for (let i = 0; i < orglist.Members.length; i++) {
            if (this.setFilter) { // 过滤tree + 不反选tree
              if (this.selectTeacherIds.indexOf(orglist.Members[i].UserID) === -1) { // 已经添加过的教师过滤不显示
                // 教师
                obj = {
                  typeId: `${orglist.SchoolDistrictID}/${orglist.OrganizationID}/${orglist.OrganizationType || ''}`,
                  title: orglist.Members[i].FullName,
                  userName: orglist.Members[i].UserName,
                  serachStr: `${orglist.Members[i].FullName} ${orglist.Members[i].UserName} ${orglist.Members[i].SchoolCardNumber}`,
                  id: `${orglist.SchoolDistrictID}/${orglist.OrganizationID}/${orglist.Members[i].UserID}` || '',
                  key: `${orglist.SchoolDistrictID}/${orglist.OrganizationID}/${orglist.Members[i].UserID}` || '',
                  UserID: orglist.Members[i].UserID,
                  scopedSlots: { title: 'teaName' },
                  leve: 2,
                  image: orglist.Members[i].Icon,
                  sex: orglist.Members[i].Sex,
                  children: []
                }
                if (orglist.Members[i].UserID > 0) {
                  obj.scopedSlots.icon = 'icon'
                }
                result.push(obj)
              }
            } else { // 不过滤tree + 反选tree
              // 教师
              obj = {
                typeId: `${orglist.SchoolDistrictID}/${orglist.OrganizationID}/${orglist.OrganizationType || ''}`,
                title: orglist.Members[i].FullName,
                userName: orglist.Members[i].UserName,
                serachStr: `${orglist.Members[i].FullName} ${orglist.Members[i].UserName} ${orglist.Members[i].SchoolCardNumber}`,
                id: `${orglist.SchoolDistrictID}/${orglist.OrganizationID}/${orglist.Members[i].UserID}` || '',
                key: `${orglist.SchoolDistrictID}/${orglist.OrganizationID}/${orglist.Members[i].UserID}` || '',
                UserID: orglist.Members[i].UserID,
                scopedSlots: { title: 'teaName' },
                leve: 2,
                image: orglist.Members[i].Icon,
                sex: orglist.Members[i].Sex,
                children: []
              }
              if (orglist.Members[i].UserID > 0) {
                obj.scopedSlots.icon = 'icon'
              }
              // 右侧教师多个过滤操作，如果，有多个同一教师只显示一个
              if (this.selectTeacherIds && this.selectTeacherIds.length && ((!this.checkAllList.length && this.selectTeacherIds.includes(obj.UserID)) || (!this.checkAllList.map(v => `${v.title}_${v.sex}`).includes(`${obj.title}_${obj.sex}`) && this.selectTeacherIds.includes(obj.UserID)))) {
                this.checkAllList.push(obj)
              }
              // 编辑的时候，将之前选中过的教师在左侧tree上面选中
              if (this.selectTeacherIds.includes(obj.UserID) && !this.curNode.includes(obj.id)) {
                this.curNode.push(obj.id)
                this.checkedValue.push(obj)
              }
              result.push(obj)
            }
          }
        }
        if (orglist.Childrens && orglist.Childrens.length) {
          for (let i = 0; i < orglist.Childrens.length; i++) {
            // 二三四...各级子组织
            obj = {
              title: orglist.Childrens[i].OrganizationName,
              id: `${orglist.Childrens[i].SchoolDistrictID}/${orglist.Childrens[i].OrganizationID}/${orglist.Childrens[i].OrganizationType || ''}`,
              key: `${orglist.Childrens[i].SchoolDistrictID}/${orglist.Childrens[i].OrganizationID}/${orglist.Childrens[i].OrganizationType || ''}`,
              leve: 1,
              children: this.setTree(orglist.Childrens[i]),
              scopedSlots: { title: 'title' }
            }
            result.push(obj)
          }
        }
        return result
      },
      //   ----------设置教师的选中start ----------
      // 设置教师
      delFun (val) {
        this.rightSta = true
        this.featchEndVal(val, false)
      },
      // tree 组件自带方法，选中/反选
      onCheck (checkedKeys, info) {
        this.rightSta = false
        let nodeData = info.node.dataRef
        this.featchEndVal(nodeData, info.checked)
      },
      /**
       * val 传入要处理的对象，比如晓羊校区
       * status 这个用来确认是选中（true），还是，取消选中（false）
       */
      featchEndVal (val, status) {
        // status: true选中了 false取消选中了
        if (!val) return false
        // 这里遍历学校和年级，如果这两个children下面还有数据就继续递归
        if (val.children && val.children.length) {
          for (let item of val.children) {
            // 递归调用
            this.featchEndVal(item, status)
          }
        } else {
          if (!status) {
            // 取消选中操作（tree取消选中多选框 和右侧'X'取消）
            if (this.rightSta && this.curNode.length) {
              // 点击右侧（反选操作，这里要做的是去删除左侧多个被选中的同一个教师） --- rightSta这个用来确认是右侧删除标识
              this.include = []
              // 这里将同一UserId的id拿到，因为，相同UserId的id不一样（同一教师可能会在不同组织下面）
              for (let item of this.checkedValue) {
                if (val.UserID === item.UserID && !this.include.includes(item.id)) {
                  this.include.push(item.id)
                }
              }
              // 拿到了同一教师的唯一id之后，挨个将左侧选中状态下的不同组织下面的教师取消选中状态
              if (this.include.length) {
                for (let item of this.include) {
                  if (this.curNode.findIndex(v => v === item) > -1) {
                    this.curNode.splice(this.curNode.findIndex(v => v === item), 1)
                  }
                  if (this.checkedValue.findIndex(v => v.id === item) > -1) {
                    this.checkedValue.splice(this.checkedValue.findIndex(v => v.id === item), 1)
                  }
                }
              }
            } else {
              // if (!info.checked && !nodeData.UserID && !nodeData.children.length) return
              // 左侧取消选中（反选操作） 将被反选的唯一id传入，再去curNode中找到，再将其删除
              if (this.curNode.length && this.curNode.includes(val.id)) {
                if (this.curNode.findIndex(v => v === val.id) > -1) {
                  this.curNode.splice(this.curNode.findIndex(v => v === val.id), 1)
                }
              }
              // 先去删除缓存中的不同组织下的教师
              if (this.checkedValue.length) {
                if (this.checkedValue.findIndex(v => v.id === val.id) > -1) {
                  this.checkedValue.splice(this.checkedValue.findIndex(v => v.id === val.id), 1)
                }
              }
            }
            // 删除右侧列表中的唯一教师
            if (val.UserID && (((this.checkedValue.length && !this.checkedValue.map(v => v.UserID).includes(val.UserID)) || !this.checkedValue.length || this.rightSta))) {
              if (this.checkAllList.findIndex(v => v.UserID === val.UserID) > -1) {
                this.checkAllList.splice(this.checkAllList.findIndex(v => v.UserID === val.UserID), 1)
              }
            }
          } else {
            // 选中操作
            if (!this.checkedValue.length || (this.checkedValue.length && !this.checkedValue.map(v => v.id).includes(val.id))) {
              this.curNode.push(val.id)
              // 将左侧选中教师加入缓存数组
              this.checkedValue.push(val)
            }
            // 右侧要显示的教师去重
            if (val.UserID && !this.checkAllList.map(vv => vv.UserID).includes(val.UserID)) {
              this.checkAllList.push(val)
            }
          }
        }
      },
      //   ----------设置教师的选中end ----------
      //   ----------搜索tree,Start ----------
      onExpand (expandedKeys) {
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
        if (!this.isHaveVal) {
          this.copyExpandedKeys = [...this.expandedKeys]
        }
      },
      // 执行搜索
      searchFun () {
        this.keyWordTrim = this.keyWord.trim()
        this.newList = JSON.parse(JSON.stringify(this.copyDataList)) // 深拷贝所有数据
        if (this.keyWordTrim) {
          this.treeLoading = true
          this.isHaveVal = true
          // this.curNode = []
          this.expandedKeys = []
          this.newList = this.filterKW(this.newList)
        } else if (!this.keyWordTrim && !this.keyWord.length) { // 清空内容
          this.treeLoading = true
          this.isHaveVal = false
          this.expandedKeys = [...this.copyExpandedKeys]
        } else if (!this.keyWordTrim && this.keyWord.length) { // 输入空格
          return
        }
        // 为了解决卡顿，添加loading动画
        setTimeout(() => {
          this.treeLoading = false
        }, 300)
        Object.assign(this, {
          expandedKeys: [...new Set(this.expandedKeys)],
          autoExpandParent: true
        })
      },
      // 递归操作，搜索出来的数据
      filterKW (val) {
        if (!val || !val.length) return null
        return val.map(vv => {
          if (vv.children && vv.children.length && (vv.leve === 0 || vv.leve === 1)) {
            vv.children = vv.children.filter(vc => {
              if (vc.serachStr && vc.serachStr.indexOf(this.keyWordTrim) > -1) {
                // 检查当前筛选条件下是有有被选中的，如果有就要加入当前被选中的集合中。
                // if (this.checkedValue.map(v => v.id).includes(vc.id)) {
                //   this.curNode.push(vc.id)
                // }
                // 将需要展开的组织的最后一级的typyId加入tree默认数组中
                this.expandedKeys.push(vc.typeId)
                return vc
              } else if (vc.children && vc.children.length) return vc
            })
          }
          vv.children = vv.children && vv.children.length ? this.filterKW(vv.children) : []
          return (vv.leve === 0 || vv.leve === 1) && !vv.children.length ? null : vv
        }).filter(v => v)
      }
    //   ----------搜索tree,end ----------
    }
  }
</script>
<style lang="less" scoped>
@import '../css/antModal.less';
</style>
