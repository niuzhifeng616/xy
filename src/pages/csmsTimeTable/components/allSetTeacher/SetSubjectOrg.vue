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
        <!-- <template slot="title"
                  slot-scope="node">
          <span :title="node.title">
            {{ node.title.length>30?node.title.substr(0,30)+'...':node.title }}
          </span>
        </template> -->
        <template slot="teaName"
                  slot-scope="node">
          <span v-if='!node.leve'
                :title="node.title"> {{ node.title.length>30?node.title.substr(0,30)+'...':node.title }}</span>
          <span v-else
                :title="node.title">
            <span v-if='node.SubjectName'>{{node.SubjectName}}</span>
            <!-- <img v-if='node.ClassName'
                 src="@/assets/csmsTimeTable/exchange.png"
                 alt=""
                 class="exchange"> -->
            <span v-if='node.ClassName'>-{{node.ClassName}}</span>
            <img v-if='node.TeacherName'
                 src="@/assets/csmsTimeTable/exchange.png"
                 alt=""
                 class="exchange">
            <span v-if='node.TeacherName'>{{node.TeacherName}}</span>
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
      initTeacherTree: {
        type: Boolean,
        required: true
      },
      // 已经选中的教师名称
      selectTeacherFullName: {
        type: Array
      },
      UserNames: {
        type: Array
      },
      selectTeacherIDs: {
        type: Array
      },
      classTableID: { // 校区id
        type: Number,
        default: 0
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
        updateTName: [],
        updateTIDs: []
      }
    },
    watch: {
      isGetTree (val) {
        if (val) {
          this.initData()
          this.openAddModal()
        }
      },
      initTeacherTree (val) { // 继续设置不刷新树
        if (val && !this.selectTeacherFullName.length > 0) {
          this.initData()
          this.newList = JSON.parse(JSON.stringify(this.copyDataList))
          this.expandedKeys = JSON.parse(JSON.stringify(this.copyExpandedKeys))
        }
      },
      selectTeacherFullName (val) {
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
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassAssignClassSetting/GetAssignClassListForEditTeacher`, { classTableID: this.classTableID })
        this.modalLoading = false
        if (res.success) {
          if (res.data && !res.data.length) return
          this.curNode = []
          this.checkedValue = []
          this.newList = this.setTree(res.data)
          this.copyDataList = JSON.parse(JSON.stringify(this.newList))
          this.copyExpandedKeys = JSON.parse(JSON.stringify(this.expandedKeys))
        }
      },
      // 递归教师
      setTree (orglist, leve = 0, parentName) {
        let result = []; let obj = {}
        if (orglist.length > 0) {
          for (let i = 0; i < orglist.length; i++) {
            let sName = ''; let cName = ''; let tName = ''; let titleName = ''
            if (leve) {
              sName = parentName || ''
              cName = orglist[i].ClassName || ''
              tName = orglist[i].TeacherNames || ''
              titleName = sName + (cName || '') + (orglist[i].UserNames ? '→' + orglist[i].UserNames : '')
              if (sName.length > 30) {
                sName = sName.slice(0, 30) + '...'
                cName = ''
                tName = ''
              } else if (sName.length + cName.length > 30) {
                sName = sName.slice(0, sName.length)
                cName = cName.slice(0, (30 - sName.length)) + '...'
                tName = ''
              } else if (sName.length + cName.length + tName.length > 30) {
                tName = tName.slice(0, (30 - sName.length - cName.length)) + '...'
              }
            // else if (sName.length + cName.length < 30) {
            //   tName = tName.slice(0, (30 - sName.length - cName.length))
            //   tName = tName ? `${tName}...` : ''
            // }
            }

            obj = {
              title: !leve ? orglist[i].SubjectName : titleName,
              SubjectName: sName,
              ClassName: cName,
              TeacherName: tName,
              oldSName: parentName || '',
              oldCName: orglist[i].ClassName || '',
              // oldTName: orglist[i].TeacherNames || '',
              ClassID: leve ? orglist[i].ClassID : 0,
              teacherIDs: leve ? orglist[i].TeacherIDs : 0,
              id: leve ? `${orglist[i].ClassID}` : `${orglist[i].CoursePlanID}/${orglist[i].ParentID}/${orglist[i].ParentType}`,
              key: leve ? `${orglist[i].ClassID}` : `${orglist[i].CoursePlanID}/${orglist[i].ParentID}/${orglist[i].ParentType}`,
              scopedSlots: { title: 'teaName' },
              leve: leve,
              children: !leve ? this.setTree(orglist[i].Class, leve + 1, orglist[i].SubjectName) : []
            }
            if (!obj.leve) { // 默认展开到第二级
              this.expandedKeys.push(obj.id)
            }
            result.push(obj)
          }
        }
        return result
      },
      changeTitle () {
        this.updateTName = this.selectTeacherFullName
        this.updateTIDs = this.selectTeacherIDs
        // this.newList = JSON.parse(JSON.stringify(this.copyDataList))
        this.newList.map((item, index) => {
          if (item.children.length > 0) {
            item.children.map((citem, cindex) => {
              // 更新title
              if (this.curNode.indexOf(citem.id) !== -1) {
                let newTName = this.updateTName.join(',')
                let UNames = this.UserNames.join(',')
                let sName = ''; let cName = ''; let tName = ''; let titleName = ''
                if (citem.leve) {
                  sName = citem.oldSName
                  cName = citem.ClassName
                  tName = newTName
                  titleName = sName + (cName || '') + (UNames ? '→' + UNames : '')
                  if (sName.length > 30) {
                    sName = sName.slice(0, 30) + '...'
                    cName = ''
                    tName = ''
                  } else if (sName.length + cName.length > 30) {
                    sName = sName.slice(0, sName.length)
                    cName = cName.slice(0, (30 - sName.length)) + '...'
                    tName = ''
                  } else if (sName.length + cName.length + tName.length > 30) {
                    tName = tName.slice(0, (30 - sName.length - cName.length)) + '...'
                  }
                }
                this.$set(citem, 'title', titleName)
                this.$set(citem, 'teacherIDs', this.updateTIDs)
                this.$set(citem, 'TeacherName', newTName)
              }
              return citem
            })
          }
          return item
        })
        this.initData()
        this.expandedKeys = JSON.parse(JSON.stringify(this.copyExpandedKeys))
      // console.log(this.newList)
      },
      //   ----------设置教师的选中start ----------
      // tree 组件自带方法，选中/反选
      onCheck (checkedKeys, info) {
        this.rightSta = false
        let nodeData = info.node.dataRef
        this.curNode = checkedKeys
        // console.log(checkedKeys, info.node)
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
      // console.log(this.checkAllList)
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
