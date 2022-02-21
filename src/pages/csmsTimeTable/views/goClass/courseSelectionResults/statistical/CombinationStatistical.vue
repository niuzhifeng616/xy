<!-- 组合统计 -->
<template>
  <div class="xy-content-body"
       style="padding-left: 0;">
    <div v-for="(i, index) in dataTable"
         :key="index"
         style="margin-bottom: 30px;">
      <p style="background: #f9f9f9;padding: 10px;">
        {{ index + 1 }}：{{ i.ObjectName }}。
      </p>
      <Table :columns="i.columns"
             :data="i.list"></Table>
             <!-- XyAntTable数据太大会卡 -->
      <!-- <XyAntTable :isPage='false'
                  :columns="i.columns"
                  :scrollx="'max-content'"
                  :dataSource="i.list"
                  nullData="该搜索条件下没有结果。"
                  :tableLoading="tableLoading">
        <template v-for='(item,cindex) in i .OrgInfo'>
          <div :slot="'SubjectCategoryName' + cindex"
               :key='cindex'
               slot-scope="text, record">
            <div style="min-width:100px">
              {{record['SubjectCategoryName' + cindex]}}
            </div>
          </div>
        </template>
      </XyAntTable> -->
    </div>
    <div v-if='!dataTable.length'
         class="no-data-box">
      <img class="no-data-img"
           src="@/assets/common/nullData.svg"
           alt="图片" />
      <span class="no-data-text">该搜索条件下没有结果。</span>
    </div>
    <Modal :value="filterSubjectModal"
           width="550"
           :transfer="false"
           title="筛选课程"
           :mask-closable="false"
           :closable="false"
           ok-text="确定"
           @on-cancel="cancel">
      <ul v-if="list[0].ThisID > 0">
        <li v-for="(item, index) in list"
            :key="index"
            style="margin: 10px 0">
          <checkbox v-model="item.checked"
                    :disabled="item.disabled"
                    @on-change="chooseSub(item, index)"
                    style="display: inline-block;">
            {{ item.ThisName }}</checkbox>
          <checkbox v-model="item.checkAll"
                    v-if="item.Childrens.length > 0"
                    :indeterminate="item.indeterminate"
                    :disabled="item.disabledAll"
                    @on-change="chooseAll(item, index)"
                    style="display: inline-block;">全选
          </checkbox>
          <checkbox-group v-model="item.checkAllGroup"
                          @on-change="chooseLayered(item, index)"
                          style="display: inline-block;">
            <checkbox :label="i.ThisID"
                      :key="i.ThisID"
                      :disabled="i.disabled"
                      v-for="i in item.Childrens">
              {{ i.ThisName }}
            </checkbox>
          </checkbox-group>
        </li>
      </ul>

      <div slot="footer">
        <Button class="xy-modal-close"
                @click="cancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="sure">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
// import XyAntTable from '@/components/table/XyAntTable'
  export default {
    name: 'combination',
    // components: { XyAntTable },
    props: {
      filterSubjectModal: {
        type: Boolean,
        required: true
      },
      classOrganizationIDs: {
        type: Array,
        required: true
      }
    },
    watch: {
      classOrganizationIDs: {
        handler: function (val, old) {
          if (this.classTableID && val.length) {
            this.getTable()
          }
        },
        deep: true
      }
    },
    data () {
      return {
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        // 表格
        dataTable: [],
        tableLoading: false,
        // 筛选课程弹窗
        selectedSub: [], // 已选择的课程
        list: [{
          ThisID: '',
          ThisName: '',
          checked: false,
          disabled: false,
          checkAll: false,
          indeterminate: false,
          disabledAll: false,
          checkAllGroup: [],
          Childrens: [{
            ThisID: '',
            ThisName: '',
            checked: false,
            disabled: false
          }]
        }]
      }
    },
    created () {
      if (this.classTableID && this.classOrganizationIDs.length > 0) {
        this.getTable()
        this.getSubjectSettingInfo()
      }
    },
    methods: {
      // 获取课程/层
      async getSubjectSettingInfo () {
        this.xy.loading()
        this.list = [{
          ThisID: 0
        }]
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassSubjectSetting/GetSettingList`, {
          classTableID: this.classTableID
        })
        if (res.success) {
          if (res.data.Result && res.data.Result.length) {
            var datas = res.data.Result || []
            if (datas.length) {
              this.list = this.initData(datas)
            }
          }
        }
        this.xy.unloading()
      },
      async getTable () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassSubjectSetting/GetMovingClassGroupCombinationSelectInfo`, {
          ClassTableID: this.classTableID,
          StudentOrganizationIDS: this.classOrganizationIDs,
          SubjectList: this.selectedSub
        })
        if (res.success) {
          this.dataTable = []
          var reslut = res.data
          reslut.map(function (item) {
            item.columns = []
            if (item.OrgInfo.length > 0) {
              for (var i = 0; i < item.OrgInfo.length; i++) {
                item.columns.push({
                  title: item.OrgInfo[i].StudentOrganizationFullName,
                  key: 'SubjectCategoryName' + i,
                  minWidth: 100
                // dataIndex: 'SubjectCategoryName' + i,
                // scopedSlots: { customRender: 'SubjectCategoryName' + i }
                })
              };
            }
            var subjectList = []
            subjectList = item.OrgInfo
            item.list = [{}]
            for (var j = 0; j < subjectList.length; j++) {
              item.list[0]['SubjectCategoryName' + j] = subjectList[j].SCount
            }
          })
          this.dataTable = reslut
          this.$emit('isExportFun', !!this.dataTable.length)
        }
        this.xy.unloading()
      },
      initData (data) {
        data.map((item) => {
          item.checked = false
          item.disabled = false
          item.checkAll = false
          item.indeterminate = false
          item.disabledAll = false
          item.checkAllGroup = []
          if (item.Childrens.length > 0) {
            item.Childrens.map(function (t) {
              t.checked = false
              t.disabled = false
            })
          }
        })
        return data
      },
      cancel () {
        this.$emit('filterSubjectFun', false)
        if (!this.selectedSub.length) {
          this.list = this.initData(this.list)
          return
        }
        this.list.map((item) => {
          item.checked = false
          item.disabled = false
          item.checkAll = false
          item.indeterminate = false
          item.disabledAll = false
          item.checkAllGroup = []

          this.selectedSub.map(sitem => {
            if (sitem.AID === item.ThisID && sitem.Type === item.ThisType) { // 反选课程
              item.checked = true
              item.disabledAll = true
              if (item.Childrens.length > 0) {
                item.Childrens.map(function (t) {
                  t.checked = false
                  t.disabled = true
                })
              }
            } else {
              if (item.Childrens.length > 0 && !item.disabledAll) {
                item.Childrens.map(function (t) {
                  t.checked = false
                  t.disabled = false
                  if (sitem.AID === t.ThisID && sitem.Type === t.ThisType) {
                    t.checked = true
                    t.disabled = false
                    item.disabled = true
                    item.checkAllGroup.push(t.ThisID)
                  }
                })
                item.checkAll = !!(item.checkAllGroup.length && item.checkAllGroup.length === item.Childrens.length)
                item.indeterminate = !!(item.checkAllGroup.length && item.checkAllGroup.length < item.Childrens.length)
              }
            }
          })
          return item
        })
      },
      // -----------------筛选课程-------------------
      chooseSub (item, index) {
        if (item.checked) {
          this.list[index].checkAll = false
          this.list[index].disabledAll = true
          this.list[index].Childrens.map(function (t) {
            if (!t.disabled) {
              t.disabled = true
            }
            if (t.checked) {
              t.checked = false
            }
          })
        } else {
          this.list[index].checkAll = false
          this.list[index].disabledAll = false
          this.list[index].Childrens.map(function (t) {
            if (t.disabled) {
              t.disabled = false
            }
          })
        }
        this.list[index].indeterminate = false
      },
      chooseAll (item, index) {
        if (item.checkAll) {
          this.list[index].checked = false
          this.list[index].disabled = true
          var arr = []
          this.list[index].Childrens.map((t, i) => {
            this.list[index].Childrens[i].checked = true
            this.list[index].Childrens[i].disabled = false
            arr.push(t.ThisID)
          })
          this.list[index].checkAllGroup = arr
        } else {
          this.list[index].checked = false
          this.list[index].disabled = false
          this.list[index].Childrens.map((t, i) => {
            this.list[index].Childrens[i].checked = false
            this.list[index].Childrens[i].disabled = false
          })
          this.list[index].checkAllGroup = []
        }
        this.list[index].indeterminate = false
      },
      chooseLayered (item, index) {
        if (item.checkAllGroup.length > 0) {
          // 课程禁止选择
          this.list[index].checked = false
          this.list[index].disabled = true
          // 点亮全选按钮
          if (item.checkAllGroup.length === item.Childrens.length && item.Childrens.length) {
            this.list[index].checkAll = true
            this.list[index].disabledAll = false
            this.list[index].indeterminate = false
          } else {
            this.list[index].checkAll = false
            this.list[index].disabledAll = false
            this.list[index].indeterminate = !!item.checkAllGroup.length
          }
        } else {
          this.list[index].checked = false
          this.list[index].disabled = false
          this.list[index].checkAll = false
          this.list[index].indeterminate = false
        }

        this.list[index].Childrens.map((j) => {
          j.checked = false
          this.list[index].checkAllGroup.map((t) => {
            if (j.value === t) {
              j.checked = true
              j.disabled = false
            }
          })
        })
      },
      sure () {
        var arr = []
        if (!this.list[0].ThisID) {
          this.$emit('filterSubjectFun', false, arr)
          return
        }
        this.list.map(function (item) {
          if (item.checked) {
            arr.push({
              AID: item.ThisID,
              Type: item.ThisType
            })
          } else if (item.checkAllGroup && item.checkAllGroup.length > 0) {
            item.Childrens.map(function (t) {
              if (item.checkAllGroup.indexOf(t.ThisID) !== -1) {
                arr = arr.concat({
                  AID: t.ThisID,
                  Type: t.ThisType
                })
              }
            })
          }
        })
        this.selectedSub = arr
        this.getTable()
        this.$emit('filterSubjectFun', false, arr)
      }
    // -----------------筛选课程end-------------------
    }
  }
</script>
<style lang="less" scoped>
/deep/.ivu-modal-body {
  min-height: 200px;
  max-height: 500px;
  overflow: auto;
  label {
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
</style>
