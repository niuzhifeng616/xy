
<template>
  <div id="arrangingRules">
    <div class="CourseMutex-rule">
        <div class="clearfix" style="margin:20px;">
             <Button class="xy-primary" type="primary" @click="creatMutex"
                    :disabled="StepsHeader.isOperation != 0">创建互斥</Button>
                <Button class="xy-danger" type="primary" @click="delAll"
                        :disabled="StepsHeader.isOperation != 0?true:isHaveData?false:true">批量删除</Button>
                <Button class="xy-info" type="info" @click="checkAll" :disabled="StepsHeader.isOperation != 0?true:isHaveData?false:true">
                    <span v-if="!isSelectAll">全选</span>
                    <span v-if="isSelectAll">取消全选</span>
                </Button>
        </div>
        <div class="xy-content-table">
            <ul class="CourseMutex-ul" v-if="dataTable.length>0" >
                <li v-for="(item,index) in dataTable" :key="index">
                    <div class="CourseMutex-header clearfix">
                        <div class="header-icon">
                            <Icon type="ios-paper-outline" color="#4196FF" size="20" />
                        </div>
                        <div class="header-title">互斥课程</div>
                        <div class="header-check"
                             :class="selectionAll.indexOf(item.ID)!=-1?'header-check-active':''"
                             @click="check(item)">
                             <Icon type="ios-checkmark" color="#FFF" size="19" style="margin: -1px;"  v-if="selectionAll.indexOf(item.ID)!=-1"/>
                        </div>
                    </div>
                    <div class="CourseMutex-body nowrap" :title="item.Name">
                        <span class="nowrap" v-cloak>{{item.Name}}</span>
                    </div>
                    <div class="CourseMutex-footer" :class="StepsHeader.isOperation != 0?'no-drop':''" @click="delOne(item)">
                        <Icon type="ios-trash-outline" color="#999" size="18" />
                        <span>删除</span>
                    </div>
                </li>
            </ul>
            <div v-if="dataTable.length==0" class="no-data-box">
                <img class="no-data-img" :src="require('@/assets/common/nullData.svg')"/>
                <span class="no-data-text">
                  您还没有互斥课程的信息，请添加互斥课程。
                </span>
            </div>
        </div>

        <!--互斥课程组-->
        <Modal v-model="modalCreatMutex"
               v-if="StepsHeader.isOperation == 0"
               width="564"
               :transfer="false"
               :mask-closable="false">
            <p slot="header">互斥课程组</p>
            <div style="font-size:14px;height:400px;overflow-y:auto">
                <div style="padding:10px 15px;height:400px;overflow-y:auto;border:1px solid #eaeaea">
                    <h1 style="font-size:16px;margin-bottom:10px;">互斥课程不排在同一天</h1>
                    <CheckboxGroup v-model="crouseSelect">
                        <Checkbox :label="item.ID" v-for="(item,index) in crouseData" :key="index" style="display:block;margin:5px;">
                            <span class="f14" v-cloak>{{item.Name}}</span>
                        </Checkbox>
                    </CheckboxGroup>
                </div>
            </div>
            <div slot="footer">
                <Button class="xy-modal-close" @click="modalCreatMutex = false">取消</Button>
                <Button class="xy-modal-primary" shape="circle" @click="submitCreatMutex">保存</Button>
                <Button class="xy-modal-primary" shape="circle"  @click="submitContinueCreatMutex">保存并继续</Button>
            </div>
        </Modal>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        StepsHeader: {},
        classPlan: {},
        isHaveData: false,
        dataTable: [],
        selectionAll: [],
        isSelectAll: false,
        confirmParm: {},
        // 创建
        modalCreatMutex: false,
        crouseData: [],
        crouseSelect: []
      }
    },
    created () {
      this.StepsHeader = this.$parent.$parent
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
      this.getMutex()
    },
    mounted () {

    },
    methods: {
      // 获取table/分页数据
      getMutex () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetMutex`, {
          classTableID: this.classPlan.classTableID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.dataTable = res.data
            for (let i = 0; i < this.dataTable.length; i++) {
              this.dataTable[i].NameArr = this.dataTable[i].Name.split(',')
            };
            this.isSelectAll = false
            if (this.dataTable.length > 0) {
              this.isHaveData = true
            } else {
              this.isHaveData = false
            }
          }
        })
      },
      // 全选
      checkAll () {
        if (this.StepsHeader.isOperation === 0 && this.isHaveData) {
          this.isSelectAll = !this.isSelectAll
          if (this.isSelectAll) { // 选中
            this.selectionAll = []
            this.dataTable.map((item) => {
              this.selectionAll.push(item.ID)
              return item
            })
          } else { // 取消选中
            this.selectionAll = []
          }
        }
      },
      check (val) {
        let index = this.selectionAll.map((item) => { return item }).indexOf(val.ID)
        if (index === -1) {
          this.selectionAll.push(val.ID)
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
      // 删除
      delOne (row) {
        if (this.StepsHeader.isOperation === 0) {
          this.confirmParm = row
          this.xy.confirm('温馨提示', '您确定要删除' + row.Name + '吗？', this.delOneOk)
        }
      },
      delOneOk () {
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/DeleteMutex`, {
          id: this.confirmParm.ID,
          ClassTableID: this.classPlan.classTableID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('删除成功。')
            this.getMutex()
          }
        })
      },
      // 批量删除
      delAll () {
        if (this.StepsHeader.isOperation === 0) {
          if (this.selectionAll.length === 0) {
            this.xy.msgError('请选择删除项。')
          } else {
            this.xy.confirm('温馨提示', '您确定要删除所选中的课程互斥组？', this.delAllOk)
          }
        }
      },
      delAllOk () {
        let ids = ''
        for (let i = 0; i < this.selectionAll.length; i++) {
          ids += this.selectionAll[i] + ','
        }
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/DeleteListMutex`, {
          ids: ids,
          ClassTableID: this.classPlan.classTableID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('删除成功。')
            this.isSelectAll = false
            this.selectionAll = []
            this.getMutex()
          }
        })
      },
      // 创建互斥课程组
      creatMutex () {
        if (this.StepsHeader.isOperation === 0) {
          this.crouseData = []
          this.crouseSelect = []
          this.xy.loading()
          this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetCreateMutex`, {
            classTableID: this.classPlan.classTableID
          }).then(res => {
            this.xy.unloading()
            if (res.success) {
              this.crouseData = res.data
              this.modalCreatMutex = true
            }
          })
        }
      },
      submitCreatMutex () { // 保存
        if (this.crouseSelect.length === 0) {
          this.xy.msgError('请选择数据后再保存。')
          return false
        };
        if (this.crouseSelect.length <= 1) {
          this.xy.msgError('必须选中两条及以上数据。')
          return false
        };
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/CreateMutex`, {
          ClassTableID: this.classPlan.classTableID,
          Type: '',
          Subjects: this.crouseSelect
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.modalCreatMutex = false
            this.getMutex()
          }
        })
      },
      submitContinueCreatMutex () { // 保存并继续
        if (this.crouseSelect.length === 0) {
          this.xy.msgError('请选择数据后再保存。')
          return false
        };
        if (this.crouseSelect.length <= 1) {
          this.xy.msgError('必须选中两条及以上数据。')
          return false
        };
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/CreateMutex`, {
          ClassTableID: this.classPlan.classTableID,
          Type: '',
          Subjects: this.crouseSelect
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.getMutex()
            this.creatMutex()
          }
        })
      }
    }

  }
</script>
<style lang='less' scoped>
@import '../../css/arrangingRules.less';
</style>
