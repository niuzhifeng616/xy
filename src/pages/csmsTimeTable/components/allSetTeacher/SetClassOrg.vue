<template>
  <div class=" set-modal"
       style="overflow: auto;">
    <div class="left setClassBox"
         v-show='!modalLoading'>
      <a-tree :tree-data="newList"
              checkable
              :checked-keys='curNode'
              @check="onCheck"
              @expand="onExpand"
              :expanded-keys="expandedKeys"
              :auto-expand-parent="autoExpandParent"
              :selectable='false'
              blockNode
              v-show="newList.length">
        <template slot="teaName"
                  slot-scope="node">
          <span v-if='!node.leve'
                :title="node.title"> {{ node.title.length>30?node.title.substr(0,30)+'...':node.title }}</span>
          <span v-else
                :title="node.title">
            <span v-if='node.oldCName'>{{node.cName}}</span>
            <img v-if='setType===1&&node.oldLName'
                 src="@/assets/csmsTimeTable/exchange.png"
                 alt=""
                 class="exchange">
            <img v-if='setType===2&&node.oldTName'
                 src="@/assets/csmsTimeTable/exchange.png"
                 alt=""
                 class="exchange">
            <span v-if='setType===1&&node.oldLName'>{{node.lessonName}}</span>
            <span v-if='setType===2&&node.oldTName'>{{node.tName}}</span>
          </span>
        </template>
      </a-tree>
      <div class="nodata"
           v-if="!newList.length && !modalLoading">没有可设置的信息。</div>
    </div>
    <div class="loading-box"
         v-if="modalLoading">
      <a-spin tip="加载中" />
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ClassOrg',
    props: {
      isGetTree: {
        type: Boolean,
        required: true
      },
      // initTeacherTree: {
      //   type: Boolean,
      //   required: true
      // },
      setType: {
        type: Number,
        default: 2 // 2设置教师，1设置课时
      },
      // 已经选中的教师名称
      selectTeacherFullName: {
        type: String
      },
      userNames: {
        type: String
      },
      classTableID: { // 校区id
        type: Number,
        default: 0
      },
      isChangeSetTName: { // 是否修改教师
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        newList: [],
        copyDataList: [], // 避免操作污染数据源，缓存初始化数据源
        expandedKeys: [],
        copyExpandedKeys: [],
        autoExpandParent: true,
        selectTeacher: [], // 编辑的时候传入的教师UserId（这里需要注意的是，传入的数组必须是数字类型的 [1,2,3,4]）
        modalLoading: false, // 弹窗
        curNode: [], // 左侧选中的教师唯一id
        checkAllList: [], // 右侧选中的教师
        checkedValue: [], // 缓存的左侧被选中的值
        rightSta: false, // 是否是右侧删除（true）
        updateTName: ''
      }
    },
    watch: {
      isGetTree (val) {
        if (val) {
          this.initData()
          this.openAddModal()
        }
      },
      // initTeacherTree (val) { // 继续设置不刷新树
      //   if (val && !this.selectTeacherFullName) {
      //     this.initData()
      //     this.newList = JSON.parse(JSON.stringify(this.copyDataList))
      //     this.expandedKeys = JSON.parse(JSON.stringify(this.copyExpandedKeys))
      //   }
      // },
      isChangeSetTName (val) { // 继续设置
        if (val) {
          this.changeTitle()
        }
      }
    },
    methods: {
      initData () {
        this.checkAllList = []
        this.checkedValue = []
        this.autoExpandParent = true
        this.expandedKeys = []
        this.curNode = []
      },
      async openAddModal () {
        // console.log(this.classTableID)
        this.newList = []
        this.modalLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/CoursePlan/GetSettingCollection`, {
          classTableID: this.classTableID
        })
        this.modalLoading = false
        if (res.success) {
          if (res.data && !res.data.length) return
          this.curNode = []
          this.checkedValue = []
          this.newList = this.setTree(res.data)
          this.copyDataList = JSON.parse(JSON.stringify(this.newList))
          this.copyExpandedKeys = JSON.parse(JSON.stringify(this.expandedKeys))
          console.log(this.newList)
        // 根据选择的反选
        }
      },
      sliceName (cName, tName) {
        if (cName.length > 30) {
          cName = cName.slice(0, 30)
          tName = ''
        } else if (tName && (cName.length + tName.length > 30)) {
          cName = cName.slice(0, cName.length)
          tName = tName.slice(0, (30 - cName.length)) + '...'
        }
        let nameObj = {
          cName
        }
        if (this.setType === 1) { // 集中设置课时
          nameObj.lessonName = tName
        }
        if (this.setType === 2) { // 集中设置教师
          nameObj.tName = tName || ''
        }
        return nameObj
      },
      // 递归教师
      setTree (orglist, pId = -2, leve = 0) {
        let result = []; let obj = {}
        if (orglist.length > 0) {
          for (let i = 0; i < orglist.length; i++) {
            obj = {
              title: !leve ? orglist[i].Name : orglist[i].CollectionName,
              oldTName: orglist[i].TeacherName || '',
              oldCName: orglist[i].CollectionName || '',
              oldLName: orglist[i].LessonName || '',
              id: pId !== -2 ? `${orglist[i].CollectionID}/${orglist[i].CoursePlanID}/${pId}` : `${i + 2}`,
              key: pId !== -2 ? `${orglist[i].CollectionID}/${orglist[i].CoursePlanID}/${pId}` : `${i + 2}`,
              coursePlanID: leve > 0 ? orglist[i].CoursePlanID : '',
              collectionID: leve > 0 ? orglist[i].CollectionID : '',
              scopedSlots: { title: 'teaName' },
              leve: leve,
              children: !leve ? this.setTree(orglist[i].Childrens, orglist[i].Value, leve + 1) : []
            }
            if (!obj.leve) { // 默认展开到第二级
              this.expandedKeys.push(obj.id)
            }
            if (this.setType === 1 && obj.leve) { // 课时
              let LName = orglist[i].LessonName || '课时'
              obj.title = obj.title + (LName ? '→' + LName : '')
              obj = Object.assign(obj, this.sliceName(orglist[i].CollectionName, LName))
            } else if (this.setType === 2 && obj.leve) { // 教师
              let uName = orglist[i].UserName || ''
              obj.title = obj.title + (uName ? '→' + uName : '')
              obj = Object.assign(obj, this.sliceName(orglist[i].CollectionName, orglist[i].TeacherName))
            }
            result.push(obj)
          }
        }

        return result
      },
      changeTitle () {
        this.updateTName = this.selectTeacherFullName
        this.newList.map((item, index) => {
          if (item.children.length > 0) {
            item.children.map((citem, cindex) => {
              if (this.curNode.indexOf(citem.id) !== -1) {
                let obj = {}
                let titleName = citem.oldCName
                if (this.setType === 1 && citem.leve) {
                  titleName = titleName + (this.updateTName ? '→' + this.updateTName : '')
                  obj = this.sliceName(citem.oldCName, this.updateTName)
                  this.$set(citem, 'oldLName', this.updateTName)
                  this.$set(citem, 'lessonName', obj.lessonName)
                } else if (this.setType === 2 && citem.leve) {
                  let uNames = this.userNames
                  uNames = uNames ? uNames.slice(0, uNames.length - 1) : ''
                  titleName = titleName + (uNames ? '→' + uNames : '')
                  let teachName = this.updateTName
                  teachName = teachName ? teachName.slice(0, teachName.length - 1) : ''
                  obj = this.sliceName(citem.oldCName, teachName)
                  this.$set(citem, 'oldTName', teachName)
                  this.$set(citem, 'tName', obj.tName)
                }
                this.$set(citem, 'title', titleName)
                this.$set(citem, 'cName', obj.cName)
              }
              return citem
            })
          }
          return item
        })
        this.initData()
        this.expandedKeys = JSON.parse(JSON.stringify(this.copyExpandedKeys))
        console.log(this.newList)
      },
      //   ----------设置教师的选中start ----------
      // tree 组件自带方法，选中/反选
      onCheck (checkedKeys, info) {
        this.rightSta = false
        let nodeData = info.node.dataRef
        this.curNode = checkedKeys
        console.log(checkedKeys, info.node)
        if (!nodeData.leve) { // 勾选父级
          for (let i = 0; i < nodeData.children.length; i++) {
            if (info.checked) {
              if (checkedKeys.indexOf(nodeData.children[i].id) !== -1) {
                this.checkAllList.push(nodeData.children[i])
              }
            } else {
              this.checkAllList = this.checkAllList.filter(item => item.id !== nodeData.children[i].id)
            }
          }
        } else { // 勾选子级
          if (info.checked) {
            if (checkedKeys.indexOf(nodeData.id) !== -1) {
              this.checkAllList.push(nodeData)
            }
          } else {
            this.checkAllList = this.checkAllList.filter(item => item.id !== nodeData.id)
          }
        }
        console.log(this.checkAllList)
      },
      onExpand (expandedKeys) {
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      }
    }
  }
</script>
<style lang="less" scoped>
@import '../css/antModal.less';
</style>
