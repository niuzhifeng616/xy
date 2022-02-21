<template>
  <div class="set-modal">
    <div class="left setTeacherBox"
         v-show='!modalLoading'>
      <div class='input-box'>
        <a-input-search placeholder="请输入用户名/工号/姓名"
                        allowClear
                        v-model="keyWord"
                        @search='searchFun' />
      </div>
      <a-tree show-icon
              id='tree'
              :tree-data="newList"
              checkable
              :checked-keys='curNode'
              @check="onCheck"
              @expand="onExpand"
              :expanded-keys="expandedKeys"
              :auto-expand-parent="autoExpandParent"
              :selectable='false'
              blockNode
              v-show="newList.length && !treeLoading">
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
        <template slot="teaName"
                  slot-scope="node">
          <span :title="node.userName">
           {{ node.title.length>20?node.title.substr(0,20)+'...':node.title }}
          </span>
        </template>
      </a-tree>
      <div class="loading-box"
           v-if="treeLoading">
        <a-spin tip="加载中" />
      </div>
      <div class="nodata"
           v-show="!newList.length && !modalLoading && !treeLoading">未搜索到相关结果。</div>
    </div>
    <div class="loading-box"
         v-if="modalLoading">
      <a-spin tip="加载中" />
    </div>
  </div>
</template>
<script>
  export default {
    name: 'SetTeacherOrg',
    props: {
      modalTitle: {
        type: String,
        default: '选择教师'
      },
      isGetTree: {
        type: Boolean,
        required: true
      },
      initTeacherTree: {
        type: Boolean,
        required: true
      },
      //   // 已经选中的教师
      //   selectMembers: {
      //     type: Array,
      //     required: false
      //   },
      classTableID: { // 校区id
        type: Number,
        default: 0
      },
      isMustChoose: {
        type: Boolean,
        default: true,
        required: false
      }
    },
    data () {
      return {
        newList: [],
        copyDataList: [], // 避免操作污染数据源，缓存初始化数据源
        expandedKeys: [],
        copyExpandedKeys: [],
        autoExpandParent: true,
        keyWordTrim: '', // 搜索的value，去掉首尾空格后的值
        keyWord: '', // 搜索的关键字
        selectTeacher: [], // 编辑的时候传入的教师UserId（这里需要注意的是，传入的数组必须是数字类型的 [1,2,3,4]）
        modalLoading: false, // 弹窗
        curNode: [], // 左侧选中的教师唯一id
        checkAllList: [], // 右侧选中的教师
        checkedValue: [], // 缓存的左侧被选中的值
        rightSta: false, // 是否是右侧删除（true）
        treeLoading: false, // 为了解决卡顿，添加loading动画状态控制
        isHaveVal: false// 输入框的value是否为真
      }
    },
    watch: {
      isGetTree (val) {
        if (val) {
          this.keyWord = ''
          this.checkAllList = []
          this.autoExpandParent = true
          this.expandedKeys = []
          this.copyExpandedKeys = []
          //   this.selectTeacher = this.selectMembers
          this.curNode = []
          this.openAddModal()
        }
      },
      initTeacherTree (val) { // 继续设置不刷新树
        if (val) {
          this.curNode = []
          this.keyWord = ''
          this.checkAllList = []
          this.checkedValue = []
        // this.autoExpandParent = true
        // this.expandedKeys = []
        // this.curNode = []
        // this.newList = JSON.parse(JSON.stringify(this.copyDataList))
        // this.expandedKeys = JSON.parse(JSON.stringify(this.copyExpandedKeys))
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
        if (this.checkAllList.length === 0 && this.isMustChoose) {
          this.xy.msgError('请选择教师')
          return
        }
        this.$emit('select-confirm', this.checkAllList)
      },
      async openAddModal () {
        // console.log(this.classTableID)
        this.newList = []
        this.modalLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/CoursePlan/GetSettingTeacher`, {
          classTableID: this.classTableID
        })
        this.modalLoading = false
        if (res.success) {
          if (res.data && !res.data.SingleGetTreeReply.length) return
          this.curNode = []
          this.checkedValue = []
          this.newList = this.setTree(res.data.SingleGetTreeReply)
          this.copyDataList = JSON.parse(JSON.stringify(this.newList))
          this.copyExpandedKeys = [...this.expandedKeys]
          this.$nextTick(() => {
            document.getElementById('tree').scrollTop = 0
          })
        // console.log(this.newList)
        // 根据选择的反选
        }
      },
      // 递归教师
      setTree (orglist, pId = -2, leve = 0) {
        let result = []; let obj = {}
        if (orglist.length > 0) {
          for (let i = 0; i < orglist.length; i++) {
            obj = {
              typeId: pId !== -2 ? `${orglist[i].Value}/${pId}` : `${orglist[i].Value || i + 2}`,
              title: orglist[i].Name,
              userName: orglist[i].UserName,
              serachStr: `${orglist[i].Name} ${orglist[i].UserName} ${orglist[i].SchoolCardNumber}`,
              id: pId !== -2 ? `${orglist[i].Value}/${pId}` : `${orglist[i].Value || i + 2}`,
              key: pId !== -2 ? `${orglist[i].Value}/${pId}` : `${orglist[i].Value || i + 2}`,
              UserID: !orglist[i].IsOrganization ? orglist[i].Value : 0,
              scopedSlots: { title: 'teaName' },
              leve: leve,
              isOrg: orglist[i].IsOrganization,
              image: orglist[i].Icon,
              sex: orglist[i].Sex,
              children: this.setTree(orglist[i].Childrens, orglist[i].Value, leve + 1)
            }
            if (!orglist[i].IsOrganization) {
              obj.scopedSlots.icon = 'icon'
            }
            if (obj.leve === 0) { // 默认展开到第二级
              this.expandedKeys.push(obj.id)
            }
            // 右侧教师多个过滤操作，如果，有多个同一教师只显示一个
            if (this.selectTeacher && this.selectTeacher.length && ((!this.checkAllList.length && this.selectTeacher.includes(obj.UserID)) || (!this.checkAllList.map(v => v.title).includes(obj.title) && this.selectTeacher.includes(obj.UserID)))) {
              this.checkAllList.push(obj)
            }
            // 编辑的时候，将之前选中过的教师在左侧tree上面选中
            if (this.selectTeacher.includes(obj.UserID) && !this.curNode.includes(obj.id)) {
              this.curNode.push(obj.id)
              this.checkedValue.push(obj)
            }
            result.push(obj)
          }
        }
        return result
      },
      //   ----------设置教师的选中start ----------
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
        if (!val) return false
        // 这里遍历学校和年级，如果这两个children下面还有数据就继续递归
        if (val.children && val.children.length) {
          for (let item of val.children) {
            // 递归调用
            this.featchEndVal(item, status)
          }
        } else {
          if (!status) {
            // 点击右侧（反选操作，这里要做的是去删除左侧多个被选中的同一个教师） --- rightSta这个用来确认是右侧删除标识
            if (this.rightSta && this.curNode.length) {
              let include = []
              // 这里将同一UserId的id拿到，因为，相同UserId的id不一样（同一教师可能会在不同组织下面）
              for (let item of this.checkedValue) {
                if (item.UserID === val.UserID && !include.includes(item.id)) {
                  include.push(item.id)
                }
              }
              // console.log(this.curNode)
              // console.log(include)
              // 拿到了同一教师的唯一id之后，挨个将左侧选中状态下的不同组织下面的教师取消选中状态
              if (include.length) {
                for (let item of include) {
                  this.curNode.splice(this.curNode.findIndex(v => v === val.id), 1)
                  this.checkedValue.splice(this.checkedValue.findIndex(v => v.id === item), 1)
                }
              }
            } else {
              // if (!info.checked && !nodeData.UserID && !nodeData.children.length) return
              // 左侧取消选中（反选操作） 将被反选的唯一id传入，再去curNode中找到，再将其删除
              if (this.curNode.length && this.curNode.includes(val.id)) {
                this.curNode.splice(this.curNode.findIndex(v => v === val.id), 1)
              }
              // 先去删除缓存中的不同组织下的教师
              if (this.checkedValue.length) {
                this.checkedValue.splice(this.checkedValue.findIndex(v => v.id === val.id), 1)
              }
            }
            // 删除右侧列表中的唯一教师
            if (val.UserID && (((this.checkedValue.length && !this.checkedValue.map(v => v.UserID).includes(val.UserID)) || !this.checkedValue.length || this.rightSta))) {
              this.checkAllList.splice(this.checkAllList.findIndex(v => v.UserID === val.UserID), 1)
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
        // console.log(this.curNode, this.checkAllList, this.checkedValue)
        this.keyWordTrim = this.keyWord.trim()
        this.newList = JSON.parse(JSON.stringify(this.copyDataList)) // 深拷贝所有数据
        if (this.keyWordTrim) {
          this.treeLoading = true
          this.isHaveVal = true
          this.expandedKeys = []
          this.newList = this.filterKW(this.newList)
        } else if (!this.keyWordTrim && !this.keyWord.length) { // 清空内容或者直接点x
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
          if (vv.children && vv.children.length && (vv.isOrg)) {
            vv.children = vv.children.filter(vc => {
              if (vc.serachStr && vc.serachStr.indexOf(this.keyWordTrim) > -1) {
                // 检查当前筛选条件下是有有被选中的，如果有就要加入当前被选中的集合中。
                let userIds = []
                let typeIds = []
                this.checkedValue.map(v => {
                  userIds.push(v.UserID)
                  typeIds.push(v.typeId)
                })
                if (userIds.includes(vc.UserID) && typeIds.includes(vc.typeId) && !this.curNode.includes(vc.typeId)) {
                  this.curNode.push(vc.id)
                }
                // 将需要展开的组织的最后一级的typyId加入tree默认数组中
                this.expandedKeys.push(vc.typeId)
                return vc
              } else if (vc.children && vc.children.length) return vc
            })
          }
          vv.children = vv.children && vv.children.length ? this.filterKW(vv.children) : []
          return (vv.isOrg) && !vv.children.length ? null : vv
        }).filter(v => v)
      }
    //   ----------搜索tree,end ----------
    }
  }
</script>
<style lang="less" scoped>
@import '../css/antModal.less';
.set-modal {
  padding-right: 0;
}
</style>
