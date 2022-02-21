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
          <div class="count-room" v-show='checkAllList.length'>已选:{{checkAllList.length}}个班级</div>
          <div class="nodata right-tip" v-show='!checkAllList.length && !modalLoading'>您还未选择任何班级，请选择班级。</div>
          <div class="room-overflow" v-if='checkAllList.length>0'>
            <div v-for='item in checkAllList' :key='item.id' class="room">
              <div>
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{ item.FullName}}</span>
                  </template>
                  <span class="tag"> {{item.FullName.length>20?item.FullName.substr(0,20)+'...':item.FullName}}</span>
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
    name: 'SelectClass',
    props: {
      modalTitle: {
        type: String,
        default: '添加班级'
      },
      isShow: {
        type: Boolean,
        required: true
      },
      // 外部组件传入的已经选中的班级
      selectMembers: {
        type: Array,
        required: false
      },
      // 外部组件传入的是否过滤已经选中的班级（默认false:不过滤+反选）
      setFilter: {
        type: Boolean,
        default: false
      },

      classTableID: { // 方案id
        type: Number,
        default: -99
      }
    },
    data () {
      return {
        newList: [],
        expandedKeys: [],
        autoExpandParent: true,
        keyWordTrim: '', // 搜索的value，去掉首尾空格后的值

        // 弹窗
        modalLoading: false,
        confirmLoading: false,
        curNode: [], // 左侧选中的班级唯一id(arr)（不包含搜索时已选中但是未展示的已选中数据）
        checkedValue: [], // 缓存的左侧被选中的班级对象（arr）（包含搜索时已选中但是未展示的已选中数据）

        // 右侧选中的班级
        selectTeacherIds: [], // 外部组件传入的班级UserId（这里需要注意的是，传入对象数组，对象中必须包含id[用户的id]）
        checkAllList: [], // 右侧已选显示数据, tree需要反选时需要加入外部传入的数据->selectTeacherIds。
        rightSta: false, // 是否是右侧删除（true）
        treeLoading: false, // 为了解决卡顿，添加loading动画状态控制
        include: [] // 在右侧点击班级删除时，此班级对应的左侧tree上所有不同组织的相同班级的唯一id的集合
      }
    },
    watch: {
      isShow (val) {
        if (val) {
          this.checkAllList = []
          this.autoExpandParent = true
          this.expandedKeys = []
          this.curNode = []
          this.openAddModal()
        }
      }
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
        if (this.checkAllList.length === 0) {
          this.xy.msgError('请选择班级。')
          return
        }
        this.$emit('select-confirm', this.checkAllList)
      },
      async openAddModal () {
        this.newList = []
        let params = {
          classTableID: this.classTableID // 方案id
        }
        this.modalLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Collection/GetOrgAllFilter`, params)
        this.modalLoading = false
        if (res.success) {
          if (res.data && !res.data.length) return
          this.curNode = []
          this.checkedValue = []
          this.newList = this.setTree(res.data, 0)
        }
      },
      // 递归
      setTree (orglist, lev) {
        let result = []; let obj = {}
        if (orglist && orglist.length) {
          for (let i = 0; i < orglist.length; i++) {
            // 校区
            obj = {
              title: orglist[i].Name,
              id: `${orglist[i].SchoolDistrictID}/${orglist[i].StudentGradeID}/${orglist[i].StudentYearID}/${orglist[i].StudentOrganizationID}`,
              key: `${orglist[i].SchoolDistrictID}/${orglist[i].StudentGradeID}/${orglist[i].StudentYearID}/${orglist[i].StudentOrganizationID}`,
              leve: lev,
              SchoolDistrictID: orglist[i].SchoolDistrictID,
              StudentYearID: orglist[i].StudentYearID,
              StudentOrganizationID: orglist[i].StudentOrganizationID,
              StudentGradeID: orglist[i].StudentGradeID,
              children: this.setTree(orglist[i].Children, lev + 1),
              FullName: orglist[i].FullName ? orglist[i].StudentYearName + orglist[i].StudentGradeName + orglist[i].StudentOrganizationName : '',
              scopedSlots: { title: 'title' }
            }
            if (lev === 0) { // 默认展开到第二级
              this.expandedKeys.push(obj.id)
            }
            result.push(obj)
          }
        }
        return result
      },
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
              // 点击右侧（反选操作，这里要做的是去删除左侧多个被选中的同一个班级） --- rightSta这个用来确认是右侧删除标识
              this.include = []
              // 这里将同一UserId的id拿到，因为，相同UserId的id不一样（同一班级可能会在不同组织下面）
              for (let item of this.checkedValue) {
                if (val.StudentOrganizationID === item.StudentOrganizationID && !this.include.includes(item.id)) {
                  this.include.push(item.id)
                }
              }
              // 拿到了同一班级的唯一id之后，挨个将左侧选中状态下的不同组织下面的班级取消选中状态
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
              // if (!info.checked && !nodeData.StudentOrganizationID && !nodeData.Children.length) return
              // 左侧取消选中（反选操作） 将被反选的唯一id传入，再去curNode中找到，再将其删除
              if (this.curNode.length && this.curNode.includes(val.id)) {
                if (this.curNode.findIndex(v => v === val.id) > -1) {
                  this.curNode.splice(this.curNode.findIndex(v => v === val.id), 1)
                }
              }
              // 先去删除缓存中的不同组织下的班级
              if (this.checkedValue.length) {
                if (this.checkedValue.findIndex(v => v.id === val.id) > -1) {
                  this.checkedValue.splice(this.checkedValue.findIndex(v => v.id === val.id), 1)
                }
              }
            }
            // 删除右侧列表中的唯一班级
            if (val.StudentOrganizationID && (((this.checkedValue.length && !this.checkedValue.map(v => v.StudentOrganizationID).includes(val.StudentOrganizationID)) || !this.checkedValue.length || this.rightSta))) {
              if (this.checkAllList.findIndex(v => v.StudentOrganizationID === val.StudentOrganizationID) > -1) {
                this.checkAllList.splice(this.checkAllList.findIndex(v => v.StudentOrganizationID === val.StudentOrganizationID), 1)
              }
            }
          } else {
            // 选中操作
            if (!this.checkedValue.length || (this.checkedValue.length && !this.checkedValue.map(v => v.id).includes(val.id))) {
              this.curNode.push(val.id)
              // 将左侧选中班级加入缓存数组
              this.checkedValue.push(val)
            }
            // 右侧要显示的班级去重
            if (val.StudentOrganizationID && !this.checkAllList.map(vv => vv.StudentOrganizationID).includes(val.StudentOrganizationID)) {
              this.checkAllList.push(val)
            }
          }
        }
      },
      //   ----------设置班级的选中end ----------
      //   ----------搜索tree,Start ----------
      onExpand (expandedKeys) {
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      }
    //   ----------搜索tree,end ----------
    }
  }
</script>
<style lang="less" scoped>
@import '../css/antModal.less';
</style>
