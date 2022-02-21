<!-- 3.排课班级-->
<template>
<div>
    <div class="xy-content-title clearfix">
        <div class="fl">
            <Button class="xy-primary" :disabled="StepsHeader.isOperation != 0" @click="delAll">批量删除</Button>
            <div class="class-header" @click="checkAll" v-if="dataTable.length!==0">
                <div class="handle-crile"
                  :class="isSelectAll?'handle-crile-active':''"
                  style="vertical-align: middle;">
                  <Icon type="ios-checkmark" color="#4196FF" size="19" v-if="isSelectAll" />
                </div>
                <span>全选</span>
            </div>
        </div>
        <div class="fr pr">
            <Input search
              v-model.trim="searchTopName"
              @on-search="FromSubmit"
              placeholder="班级名称"
              class="fr xy-content-title-search"
              style="width: auto;" />
        </div>
    </div>
    <div class="xy-content-body">
        <ul class="class-ul" v-if="dataTable.length>0" style="display: flex;justify-content: flex-start;flex-wrap: wrap;">
          <li class="class-li li-first" @click="goSelectClass" :class="StepsHeader.isOperation != 0?'no-drop':''" style="text-align: center;line-height: 170px;padding: 0;color:rgba(0,0,0,0.45);">
            <i class="iconfont">&#xe6a2;</i>
            <span class="add-li">添加班级</span>
          </li>
          <li class="class-li pr" v-for="(item,index) in dataTable" :key="index">
              <div class="handle-icon handle-crile"
                    @click="check(item)"
                    :class="selectionAll.indexOf(item.CollectionID)!=-1?'handle-crile-active':''">
                  <Icon type="ios-checkmark" color="#4196FF" size="19"  v-if="selectionAll.indexOf(item.CollectionID)!=-1"  />
              </div>
              <div style="display:flex;align-items:center">
                  <i class="iconfont icon-after">&#xe6eb;</i>
                  <tooltip word-wrap placement="top" :content="item.CollectionName">
                      <div class="f16 nowrap" v-cloak style="font-weight:bold;width:180px;">{{item.CollectionName}}</div>
                  </tooltip>
              </div>
              <div class="btn-group">
                  <div class="group-one"
                    :class="StepsHeader.isOperation != 0?'group-one-disabled':''"
                        @click="del(item)">
                      <Icon type="ios-trash-outline" />
                      <span>删除</span>
                  </div>
                  <div style="width:2px;height:18px;background:#E5E5E5"></div>
                  <div class="group-one pr editor-icon">
                      <Icon type="ios-create-outline" />
                      <span>编辑</span>
                      <ul class="edito-ul">
                          <li :class="StepsHeader.isOperation != 0?'group-one-disabled':''"
                            @click.stop="editClassName(item)">
                              编辑名称
                          </li>
                          <li @click.stop="editorStudent(item)">编辑学生</li>
                      </ul>
                  </div>
              </div>
          </li>
        </ul>
        <div v-if="dataTable.length===0" class="no-data-box">
          <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
          <span class="no-data-text">该搜索条件下没有结果。</span>
          <div class="mt-20">
            <Button class="xy-btn-primary" shape="circle" @click="goSelectClass">添加班级</Button>
          </div>
        </div>
    </div>

    <!-- 编辑名称 -->
    <Modal v-model="modalEditorName"
          :transfer="false"
          :mask-closable="false"
          :closable="false">
        <p slot="header">编辑班级名称</p>
        <div style="font-size:14px;height:100px;display: flex;align-items: center;">
        <Input type="text" v-model="editorClassName" maxlength="20" placeholder="请输入班级名称" />
        </div>
        <div slot="footer">
            <Button type="text" size="large" @click="modalEditorName = false">取消</Button>
            <Button type="primary" size="large" @click="submintName">保存</Button>
        </div>
    </Modal>
    <!-- 添加班级 -->
    <SelectClasses
      :isShow="isShow"
      :classTableID="classTableID"
      :selectMembers="[...selectClass]"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm">
    </SelectClasses>
  </div>
</template>
<script>
  import SelectClasses from '@/pages/csmsTimeTable/components/selectClass/CheckBoxSelectClass.vue'
  export default {
    components: {
      SelectClasses
    },
    data () {
      return {
        classPlan: {},
        StepsHeader: {},
        classTableID: 0,
        // 编辑名称
        modalEditorName: false,
        editorClass: '',
        editorClassName: '',
        // 列表
        searchTopName: '',
        isSelectAll: false,
        selectionAll: [],
        dataTable: [],
        // 添加班级
        isShow: false,
        selectClass: []
      }
    },
    created () {
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
      this.StepsHeader = this.$parent
      this.classTableID = this.classPlan.classTableID
      this.getTP()
    },
    methods: {
      // 获取校区、学年、学期
      async getSchool () {
        this.xy.loading()
        this.isLoading = true
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`)
        this.isLoading = false
        this.xy.unloading()
        if (res.success) {
          this.schoolData = res.data
        }
      },
      // 获取table数据
      async getTP () {
        this.isLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Collection/GetCollectionList`, {
          classTableID: this.classPlan.classTableID,
          collectionName: this.searchTopName
        })
        this.isLoading = false
        this.xy.unloading()
        if (res.success) {
          this.dataTable = res.data
          for (let i = 0; i < this.dataTable.length; i++) {
            this.$set(this.dataTable[i], 'collapse', false)
          }
        }
      },
      editoChange (val) {
        if (val.collapse) {
          val.collapse = false
        } else {
          this.dataTable.map((item) => {
            item.collapse = false
            return item
          })
          val.collapse = true
        }
      },
      closeEdito () {
        this.dataTable.map((item) => {
          item.collapse = false
          return item
        })
      },

      checkAll () {
        this.isSelectAll = !this.isSelectAll
        if (this.isSelectAll) { // 选中
          this.selectionAll = []
          this.dataTable.map((item) => {
            this.selectionAll.push(item.CollectionID)
            return item
          })
        } else { // 取消选中
          this.selectionAll = []
        }
      },
      check (val) {
        let index = this.selectionAll.map((item) => { return item }).indexOf(val.CollectionID)
        if (index === -1) {
          this.selectionAll.push(val.CollectionID)
          if (this.selectionAll.length === this.dataTable.length) { // 选中最后一个，全选做选中
            this.isSelectAll = true
          }
        } else {
          this.selectionAll.splice(index, 1)
          if (this.selectionAll.length !== this.dataTable.length) { // 取消全选
            this.isSelectAll = false
          }
        }
      },
      // 批量删除
      delAll () {
        if (this.selectionAll.length > 0) {
          let collectionIDs = ''
          for (let i = 0; i < this.selectionAll.length; i++) {
            collectionIDs += this.selectionAll[i] + ','
          }
          this.$Modal.confirm({
            title: '温馨提示',
            content: '删除排课班级将一并删除与班级相关的排课规则和已排出的课表，您确定要删除所有选中的班级吗？',
            onOk: () => {
              this.delAllObj(collectionIDs)
            }
          })
        } else {
          this.xy.msgError('请选择要删除的内容。')
        }
      },
      async delAllObj (collectionIDs) {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Collection/DeleteByIDs`, {
          ClassTableID: this.classPlan.classTableID,
          ids: $.trim(collectionIDs)
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          this.isSelectAll = false
          this.selectionAll = []
          this.StepsHeader.getGeneralFlows()// 成功后步骤可以点击
          this.getTP()
        }
      },
      // 单个删除
      del (row) {
        if (this.StepsHeader.isOperation === 0) {
          this.$Modal.confirm({
            title: '温馨提示',
            content: '删除排课班级将一并删除与该班级相关的排课规则和已排出的课表，您确定要删除"' + row.CollectionName + '"吗？',
            onOk: () => {
              this.delObj(row.CollectionID)
            }
          })
        }
      },
      async delObj (id) {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Collection/Delete`, {
          ClassTableID: this.classPlan.classTableID,
          id: id
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          this.StepsHeader.getGeneralFlows()// 成功后步骤可以点击
          this.getTP()
        }
      },
      // 搜索
      FromSubmit () {
        this.isSelectAll = false
        this.selectionAll = []
        this.getTP()
      },
      // 编辑学生
      editorStudent (row) {
        let datas = {
          collectionID: row.CollectionID
        }
        this.$store.commit('common/getParam', datas)
        this.$router.push({
          path: '/xyhome/administrativeStepHeader/administrativeStudentList',
          query: this.$store.state.common.menuInfo
        })
      },
      // 编辑名称
      editClassName (row) {
        if (this.StepsHeader.isOperation === 0) {
          let obj = row
          this.editorClass = obj
          this.editorClassName = obj.CollectionName
          this.modalEditorName = true
        }
      },
      // 保存名称
      async submintName () {
        if (this.editorClassName === '') {
          this.xy.msgSuc('班级名称不能为空。')
        } else {
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/Collection/Edit`, {
            ClassTableID: this.classPlan.classTableID,
            CollectionID: this.editorClass.CollectionID,
            CollectionName: this.editorClassName
          })
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('编辑名称成功。')
            this.modalEditorName = false
            this.getTP()
          }
        }
      },
      // 添加班级
      goSelectClass () {
        if (this.StepsHeader.isOperation === 0) {
          this.isShow = true
        }
      },
      selectCancel () {
        this.isShow = false
      },
      async selectConfirm (data) {
        this.isShow = false
        this.selectClass = [...data]
        let tutorArr = []
        for (let i = 0, len = this.selectClass.length; i < len; i++) {
          tutorArr.push({
            ClassTableID: this.classPlan.classTableID,
            CollectionName: this.selectClass[i].FullName,
            StudentGradeForStudentYearID: this.selectClass[i].StudentYearID,
            StudentOrganizationID: this.selectClass[i].StudentOrganizationID
          })
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Collection/Create`, tutorArr)
        this.xy.unloading()
        if (res.success) {
          this.StepsHeader.getGeneralFlows()// 成功后步骤可以点击
          this.getTP()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.icon-after{
      width: 49px;
      height: 48px;
      line-height: 48px;
      background: #ffbf00;
      border-radius: 50%;
      display: block;
      text-align: center;
      color: #fff;
      font-size: 26px;
      margin-right: 15px;
}
.editor-student {
    padding: 0px 20px;
}

.handle-crile {
    cursor: pointer;
    width: 20px;
    height: 20px;
    line-height:20px;
    text-align:center;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(237,237,237,1);
    border-radius: 6px;
    display: inline-block;
}
.handle-crile:hover {
    border-color: #4196FF;
}

.handle-crile-active {
    border-color: #4196FF;
}

.edito-header {
    margin-bottom: 5px;
    margin-left: 10px;
    display: inline-block;
    cursor: pointer;
}

.edito-header > span {
    color: #C2C2C2;
    user-select: none;
}
.student-ul{
    display:flex;
    justify-content:flex-start;
    flex-wrap:wrap;
}
.student-li {
    width: 20%;
    text-align:center;
}
.student-li .student-one {
    width: 94%;
    height: 210px;
    margin: 10px auto;
    text-align: left;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(242,242,242,1);
    box-shadow: 0px 4px 12px 0px rgba(228,228,228,0.5);
    border-radius: 4px;
    display: inline-block;
    padding: 30px 20px;
    position: relative;
    cursor: pointer;
}
.student-li-active {
    border-color: #4196FF;
}

 .handle-icon {
    position: absolute;
    top: 8px;
    right: 8px;
}

.student-info {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
}

.student-li .crile {
    width: 10px;
    height: 10px;
    background: rgba(255,255,255,1);
    border-radius: 50%;
    display: inline-block;
    margin-right: 10px;
}

.first-crile {
    border: 2px solid rgba(182,110,248,1);
}

.second-crile {
    border: 2px solid rgba(65,150,255,1);
}

.three-crile {
    border: 2px solid rgba(253,194,93,1);
}

.student-info .info1 {
    color: #999999;
    margin-right: 10px;
}

.edito-fotter {
    margin: 10px 0;
    text-align: right;
}
.class-header {
    display: inline-block;
    cursor: pointer;
}
.class-header > span {
   margin-left: 10px;
    user-select: none;
}
.class-li {
    display: inline-block;
    margin:11px;
    position: relative;
    padding:34px 20px 20px;
    width: 298px;
    height: 170px;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(233,233,233,1);
    cursor: pointer;
    .add-li{
      font-size: 16px;
      margin-left: 10px;
    }

}
.li-first:hover{
  border: 1px solid #1890FF;
  .add-li,.iconfont{
    color: #1890FF;
  }
}
.class-li .serial-number {
    width: 30px;
    height: 30px;
    line-height: 30px;
    background: rgba(238,245,255,1);
    border-radius: 50%;
    text-align: center;
    vertical-align: middle;
    margin-right: 24px;
    display: inline-block;
    color: #4196FF;
    cursor:pointer;
}
.class-li .btn-group {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 43px;
    line-height:43px;
    display:flex;
    align-items:center;
    background: #F9FAFB;
    border-radius:0 0 4px 4px;
    border-top:1px solid #E9E9E9
}
.class-li .btn-group .group-one {
    width: 150px;
    text-align: center;
    color: #999999;
    font-size: 14px;
    cursor: pointer;
    user-select: none
}
.class-li .btn-group .group-one:first-child:hover {
    color: #FDA8A4;
}
.class-li .btn-group .group-one:last-child:hover {
    color: #4196FF;
}
.class-li .btn-group .group-one .ivu-icon {
    font-size: 18px;
    vertical-align: text-bottom;
}
.group-one-disabled {
    color: #ddd !important;
    cursor: no-drop !important;
}
.class-li .btn-group .group-one-disabled:first-child:hover {
    color: #ddd !important;
}

.class-li .btn-group .group-one-disabled:last-child:hover {
    color: #ddd !important;
}
.edito-ul {
    position: absolute;
    top: 32px;
    right: 10px;
    width: 72px;
    height: 69px;
    background: rgba(255,255,255,1);
    box-shadow: 0px 2px 8px 0px rgba(183,183,183,0.5);
    border-radius: 4px;
    z-index: 99;
    display: none;
}
.edito-ul li {
    color: rgba(102,102,102,1);
    height: 34px;
    line-height: 34px;
    user-select: none
}
.edito-ul li:hover{
    color: #4196FF;
}
.editor-icon:hover{
  .edito-ul{
    display:block;
  }
}
/*ͨ��*/
.danger-btn {
    padding: 4px 15px;
    color: #4196FF;
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid #4196FF;
    white-space: nowrap;
    line-height: 1.5;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 12px;
    border-radius: 4px;
    -webkit-transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear,-webkit-box-shadow .2s linear;
    background-color: #fff;
}

.danger-btn:hover {
    color: #FF8C8C;
    border: 1px solid #FDBBBB;
    background: #FFECED;
    text-decoration: none;
}

.danger-btn:active, .danger-btn:focus {
    color: #2b85e4;
    background-color: #fff;
    border-color: #2b85e4;
    outline: 0;
}

.primary-btn {
    padding: 4px 15px;
    color: #fff;
    border: 1px solid #4196FF;
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    white-space: nowrap;
    line-height: 1.5;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 12px;
    border-radius: 4px;
    -webkit-transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear,-webkit-box-shadow .2s linear;
    background: #4196FF;
}

.primary-btn:active, .primary-btn:focus {
    outline: 0;
}

.primary-btn-ghost {
    padding: 4px 15px;
    color: #4196FF;
    border: 1px solid #4196FF;
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    white-space: nowrap;
    line-height: 1.5;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 12px;
    border-radius: 4px;
    -webkit-transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear,-webkit-box-shadow .2s linear;
    background-color: #fff;
}

.primary-btn-ghost:hover {
    background: rgba(65, 150, 255,0.1);
    text-decoration: none;
}

.primary-btn-ghost:active, .primary-btn-ghost:focus {
    outline: 0;
}

.btn-disabled {
    background-color: #E9E9E9 !important;
    color: #999 !important;
    border: none;
    cursor:no-drop;
}

.btn-disabled:hover {
    background-color: #E9E9E9 !important;
    color: #999 !important;
    border: none;
    text-decoration: none;
}

.btn-disabled:active, .btn-disabled:focus {
    background-color: #E9E9E9 !important;
    color: #999 !important;
    border: none;
    outline: 0;
}

.shape-circle {
    border-radius: 32px;
}
.no-drop{
  cursor: no-drop;
}
@media screen and (max-width: 1366px) {
    // .student-li {
    //     /*margin: 10px 16px;*/
    // }

    .class-li {
        margin: 9px;
    }
}

</style>
