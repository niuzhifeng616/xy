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
            <span v-if='node.oldSName'>{{node.sName}}</span>
            <!-- <img v-if='node.ClassName'
                 src="@/assets/csmsTimeTable/exchange.png"
                 alt=""
                 class="exchange"> -->
            <span v-if='node.oldCName'>-{{node.cName}}</span>
            <img v-if='setType===3&&node.oldTName'
                 src="@/assets/csmsTimeTable/exchange.png"
                 alt=""
                 class="exchange">
            <img v-if='setType===4&&node.oldHName'
                 src="@/assets/csmsTimeTable/exchange.png"
                 alt=""
                 class="exchange">
            <span v-if='setType===3&&node.oldTName'>{{node.tName}}</span>
            <span v-if='setType===4&&node.oldHName'>{{node.hName}}</span>
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
        type: String
      },
      userNames: {
        type: String
      },
      setType: {
        type: Number,
        default: 3 // 3设置教师，4教室
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
        if (val && !this.selectTeacherFullName.length) {
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
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/GetSchoolBasedGrabCourseSettingListForEditStudentLimitation`, {
          ClassTableID: this.classTableID
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
        }
      },
      sliceName (sName, cName, tName) {
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
        let nameObj = {
          sName,
          cName
        }
        if (this.setType === 4) { // 集中设置教室
          nameObj.hName = tName
        }
        if (this.setType === 3) { // 集中设置教师
          nameObj.tName = tName
        }
        return nameObj
      },
      // 递归教师
      setTree (orglist) {
        let result = []
        if (orglist.length > 0) {
          for (let i = 0; i < orglist.length; i++) {
            let subName = orglist[i].SubjectCategoryName
            let sId = orglist[i].SubjectCategoryID
            result.push({
              id: sId,
              key: sId,
              title: subName,
              scopedSlots: { title: 'teaName' },
              leve: 0,
              children: []
            })
            this.expandedKeys.push(sId) // 默认展开到第2级
            for (var j = 0; j < orglist[i].Courses.length; j++) {
              for (var k = 0; k < orglist[i].Courses[j].Classs.length; k++) {
                let sName = orglist[i].Courses[j].SubjectName
                let cName = orglist[i].Courses[j].Classs[k].ClassName || ''
                let tName = orglist[i].Courses[j].Classs[k].TeacherName || ''
                let hName = orglist[i].Courses[j].Classs[k].HouseName || ''
                let obj = {
                  id: orglist[i].Courses[j].Classs[k].ClassID,
                  key: orglist[i].Courses[j].Classs[k].ClassID,
                  title: sName + cName,
                  scopedSlots: { title: 'teaName' },
                  oldSName: sName,
                  oldCName: cName,
                  oldTName: tName, // oldTName截取之前的名称
                  oldHName: hName,
                  leve: 1,
                  children: []
                }

                if (this.setType === 3) {
                  let uName = orglist[i].Courses[j].Classs[k].UserName || ''
                  obj.title = obj.title + (uName ? '→' + uName : '')
                  obj = Object.assign(obj, this.sliceName(sName, cName, tName))
                } else if (this.setType === 4) {
                  obj.title = obj.title + (hName ? '→' + hName : '')
                  obj = Object.assign(obj, this.sliceName(sName, cName, hName))
                }
                result[i].children.push(obj)
              }
            };
          }
        }
        return result
      },
      changeTitle () {
        this.updateTName = this.selectTeacherFullName
        this.newList.map((item, index) => {
          if (item.children.length > 0) {
            item.children.map((citem, cindex) => {
              // 更新title
              if (this.curNode.indexOf(citem.id) !== -1) {
                let obj = {}
                let titleName = citem.oldSName + (citem.oldCName || '')
                if (this.setType === 3 && citem.leve) {
                  titleName = titleName + (this.userNames ? '→' + this.userNames : '')
                  obj = this.sliceName(citem.oldSName, citem.oldCName, this.updateTName)
                  this.$set(citem, 'oldTName', this.updateTName)
                  this.$set(citem, 'tName', obj.tName)
                } else if (this.setType === 4 && citem.leve) {
                  titleName = titleName + (this.updateTName ? '→' + this.updateTName : '')
                  obj = this.sliceName(citem.oldSName, citem.oldCName, this.updateTName)
                  this.$set(citem, 'oldHName', this.updateTName)
                  this.$set(citem, 'hName', obj.hName)
                }
                this.$set(citem, 'title', titleName)
                this.$set(citem, 'sName', obj.sName)
                this.$set(citem, 'cName', obj.cName)
              // this.$set(citem, 'teacherIDs', this.updateTIDs)
              // let sName = ''; let cName = ''; let tName = '';
              // if (citem.leve) {
              // sName = citem.oldSName
              // cName = citem.oldCName
              // tName = newTName
              // obj = this.sliceName(citem.oldSName, citem.oldCName, newTName)
              // }
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
