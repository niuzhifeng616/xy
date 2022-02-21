<template>
  <div class="setrule-select">
    <a-row class="xy-flex" v-show='!modalLoading'>
      <div class="left">
        <div class='input-box'>
          <a-input-search v-model="keyWord" placeholder="请输入用户名/工号/姓名" allowClear @search='searchFun' style="width:205px;" />
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
          <!-- <template v-if="node.isRule" slot="edit" slot-scope="node">
            <span @click="(e)=> editRule(node)"><Icon type="md-create" style="font-size:16px; margin-left:3px;" class="app-flex-box-icon"></Icon></span>
          </template> -->
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
              <span v-if="node.isRule" @click.stop="(e)=> editRule(node)"><Icon type="md-create" style="font-size:16px; margin-left:3px;" class="app-flex-box-icon"></Icon></span>
            </a-tooltip>
          </template>
        </a-tree>
        <div class="loading-tree" v-if="treeLoading">
          <a-spin tip="加载中" />
        </div>
        <div class="nodata" v-show="!newList.length && !modalLoading && !treeLoading">未搜索到相关结果。</div>
      </div>
    </a-row>
    <div class="loading-box" v-if="modalLoading">
      <a-spin tip="加载中" />
    </div>
  </div>
</template>
<script>
  export default {
    name: 'SelectTeacher',
    props: {
      // schoolDistrictID: { // 校区id
      //   type: Number,
      //   default: -99
      // }
      classTableID: {
        type: Number,
        default: -1
      },
      value: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        newList: [],
        copyDataList: [], // 避免操作污染数据源，缓存初始化数据源
        expandedKeys: [], // 当前展开的节点信息
        copyExpandedKeys: [], // 一定条件下保存搜索前展开的节点信息
        autoExpandParent: true,
        keyWord: '', // 搜索的关键字
        keyWordTrim: '', // 搜索的value，去掉首尾空格后的值
        isHaveVal: false, // 输入框的value是否为真

        modalLoading: false, // 加载中
        curNode: [], // 左侧选中的教师唯一id(arr)（不包含搜索时已选中但是未展示的已选中数据）
        checkedValue: [], // 缓存的左侧被选中的教师对象（arr）（包含搜索时已选中但是未展示的已选中数据）
        selectedTeacherIds: [], // 选中教师的UserID数组

        treeLoading: false // 为了解决卡顿，添加loading动画状态控制
      }
    },
    created () {
      this.resetTeacherTree()
    },
    methods: {
      resetTeacherTree () {
        this.keyWord = ''
        this.autoExpandParent = true
        this.expandedKeys = []
        this.copyExpandedKeys = []

        this.curNode = []
        this.checkedValue = []
        this.openAddModal()
      },
      // 清空搜索条件时还原被选中，或者进行一些其他操作
      clearKayWd (val = '') {
        if (val !== '') return
        this.curNode = this.checkedValue.map(v => v.id)
      },
      async openAddModal () {
        this.newList = []
        let params = {
          classTableID: this.classTableID,
          value: this.value,
          searchTxt: ''
        }
        this.modalLoading = true
        let res = await this.xy.get(this.$store.state.apiPath + '/api/GeneralRuleSetting/GetTeacherSearchTreeList', params)
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
            // if (orglist[i].OrganizationID === 0 || orglist[i].SchoolDistrictID === 0 || orglist[i].SchoolDistrictID === -1) { // 默认展开到第二级(OrganizationID === 0正常一级组织，SchoolDistrictID === 0自定义一级组织，SchoolDistrictID: -1未在组织教师)
            this.expandedKeys.push(obj.id) // 默认展开所有组织
            // }
            result.push(obj)
          }
        }
        if (orglist.Members && orglist.Members.length) {
          for (let i = 0; i < orglist.Members.length; i++) {
            // 教师
            obj = {
              typeId: `${orglist.SchoolDistrictID}/${orglist.OrganizationID}/${orglist.OrganizationType || ''}`,
              title: orglist.Members[i].FullName,
              userName: orglist.Members[i].UserName,
              serachStr: `${orglist.Members[i].FullName} ${orglist.Members[i].UserName} ${orglist.Members[i].SchoolCardNumber} ${orglist.Members[i].FullName.toLowerCase()} ${orglist.Members[i].UserName.toLowerCase()} ${orglist.Members[i].SchoolCardNumber.toLowerCase()}${orglist.Members[i].FullName.toUpperCase()} ${orglist.Members[i].UserName.toUpperCase()} ${orglist.Members[i].SchoolCardNumber.toUpperCase()}`,
              id: `${orglist.SchoolDistrictID}/${orglist.OrganizationID}/${orglist.Members[i].UserID}` || '',
              key: `${orglist.SchoolDistrictID}/${orglist.OrganizationID}/${orglist.Members[i].UserID}` || '',
              UserID: orglist.Members[i].UserID,
              scopedSlots: { title: 'teaName' },
              leve: 2,
              image: orglist.Members[i].Icon,
              sex: orglist.Members[i].Sex,
              isRule: orglist.Members[i].IsRule,
              children: []
            }
            if (orglist.Members[i].UserID > 0) {
              obj.scopedSlots.icon = 'icon'
            }
            // if (orglist.Members[i].IsRule) {
            //   obj.scopedSlots.edit = 'edit'
            // }
            result.push(obj)
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
            this.expandedKeys.push(obj.id)// 默认展开所有组织
            result.push(obj)
          }
        }
        return result
      },
      // 点击笔
      editRule (node) {
        this.curNode = [node.id]
        this.checkedValue = [node.dataRef]
        this.selectedTeacherIds = this.checkedValue.map(item => item.UserID)
        this.$emit('edit-rule', this.selectedTeacherIds)
      },

      //   ----------设置教师的选中start ----------
      // tree 组件自带方法，选中/反选
      onCheck (checkedKeys, info) {
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
            // 取消选中操作（tree取消选中多选框）

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
              this.selectedTeacherIds = this.checkedValue.map(item => item.UserID)
            } else {
              this.selectedTeacherIds = []
            }
            this.$emit('select-teacher', this.selectedTeacherIds)
          } else {
            // 选中操作
            if (!this.checkedValue.length || (this.checkedValue.length && !this.checkedValue.map(v => v.id).includes(val.id))) {
              this.curNode.push(val.id)
              // 将左侧选中教师加入缓存数组
              this.checkedValue.push(val)
            }
            this.selectedTeacherIds = this.checkedValue.map(item => item.UserID)
            this.$emit('select-teacher', this.selectedTeacherIds)
          }
        }
      },
      //   ----------设置教师的选中end ----------
      //   ----------搜索tree,Start ----------
      onExpand (expandedKeys) {
        this.expandedKeys = expandedKeys // 关闭节点时，未关闭子节点
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
@import './antModal.less';
</style>
