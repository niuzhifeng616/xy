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
      <!-- <Table ref="selection"
             class="thead-bg"
             :columns="i.columns"
             :data="i.list"></Table> -->
      <XyAntTable :isPage='false'
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
      </XyAntTable>
    </div>
    <Modal v-model="modal"
           width="550"
           :transfer="false"
           title="筛选课程"
           :mask-closable="false"
           :closable="false"
           ok-text="确定"
           @on-cancel="cancel">
      <ul v-if="list[0].ObjectID > 0">
        <li v-for="(item, index) in list"
            :key="index"
            style="margin: 10px 0">
          <div>
            <checkbox v-model="item.checked"
                      :disabled="item.disabled"
                      @on-change="chooseSub(item, index)"
                      style="display: inline-block;">
              {{ item.ObjectName }}</checkbox>
            <checkbox v-model="item.checkAll"
                      v-if="item.Children.length > 0"
                      :disabled="item.disabledAll"
                      @on-change="chooseAll(item, index)"
                      style="display: inline-block;">全选
            </checkbox>
            <checkbox-group v-model="item.checkAllGroup"
                            @on-change="chooseLayered(item, index)"
                            style="display: inline-block;">
              <checkbox :label="i.ObjectID"
                        :key="i.ObjectID"
                        :disabled="i.disabled"
                        v-for="i in item.Children">
                {{ i.ObjectName }}
              </checkbox>
            </checkbox-group>
          </div>
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
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    name: 'statCombination',
    components: { XyAntTable },
    props: {
      LayeredSelectProgrammeID: {
        type: Number,
        required: true
      },
      LayeredSelectRotationID: {
        type: Number,
        required: true
      },
      classOrganizationIDs: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        selectedSub: [], // 已选择的课程
        // 表格
        dataTable: [],
        tableLoading: false,
        // 弹窗
        modal: false,
        list: [{
          ObjectID: '',
          ObjectName: '',
          checked: false,
          disabled: false,
          checkAll: false,
          disabledAll: false,
          checkAllGroup: [],
          Children: [{
            ObjectID: '',
            ObjectName: '',
            checked: false,
            disabled: false
          }]
        }]
      }
    },
    created () {
    },
    mounted () {
      if (this.LayeredSelectProgrammeID !== 0 && this.classOrganizationIDs.length > 0) {
        this.getTable()
        this.getSubjectSettingInfo()
      }
    },
    methods: {
      // 获取课程/层
      async getSubjectSettingInfo () {
        this.list = [{
          ObjectID: 0
        }]
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/GetSubjectSettingInfo`, {
          layeredSelectProgrammeID: this.LayeredSelectProgrammeID
        })
        if (res.success) {
          if (res.data.Subinfo) {
            var datas = res.data.Subinfo
            datas.map(function (item) {
              item.checked = false
              item.disabled = false
              item.checkAll = false
              item.disabledAll = false
              item.checkAllGroup = []
              if (item.Children.length > 0) {
                item.Children.map(function (t) {
                  t.checked = false
                  t.disabled = false
                })
              }
            })
            this.list = datas
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      async getTable () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredStatisticalAnalysis/GetCombinationSelectInfo`, {
          StudentOrganizationIDS: this.classOrganizationIDs,
          LayeredSelectProgrammeID: this.LayeredSelectProgrammeID,
          LayeredSelectRotationID: this.LayeredSelectRotationID,
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
                  title: item.OrgInfo[i].StudentGradeNameForStudentYearName + item.OrgInfo[i].StudentOrganizationName,
                  dataIndex: 'SubjectCategoryName' + i,
                  scopedSlots: { customRender: 'SubjectCategoryName' + i }
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
        }
        this.xy.unloading()
      },
      filterSubject () {
        this.modal = true
      },

      cancel () {
        this.modal = false
      },
      // -----------------筛选课程-------------------
      chooseSub (item, index) {
        if (item.checked) {
          this.list[index].checkAll = false
          this.list[index].disabledAll = true
          this.list[index].Children.map(function (t) {
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
          this.list[index].Children.map(function (t) {
            if (t.disabled) {
              t.disabled = false
            }
          })
        }
      },
      chooseAll (item, index) {
        if (item.checkAll) {
          this.list[index].checked = false
          this.list[index].disabled = true
          var arr = []
          this.list[index].Children.map((t, i) => {
            this.list[index].Children[i].checked = true
            this.list[index].Children[i].disabled = false
            arr.push(t.ObjectID)
          })
          this.list[index].checkAllGroup = arr
        } else {
          this.list[index].checked = false
          this.list[index].disabled = false
          this.list[index].Children.map((t, i) => {
            this.list[index].Children[i].checked = false
            this.list[index].Children[i].disabled = false
          })
          this.list[index].checkAllGroup = []
        }
      },
      chooseLayered (item, index) {
        if (item.checkAllGroup.length > 0) {
          // 课程禁止选择
          this.list[index].checked = false
          this.list[index].disabled = true
          // 点亮全选按钮
          if (item.checkAllGroup.length === item.Children.length) {
            this.list[index].checkAll = true
            this.list[index].disabledAll = false
          } else {
            this.list[index].checkAll = false
            this.list[index].disabledAll = false
          }
        } else {
          this.list[index].checked = false
          this.list[index].disabled = false
        }

        this.list[index].Children.map((j) => {
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
        this.list.map(function (item) {
          if (item.checked) {
            arr.push({
              AID: item.ObjectID,
              Type: item.ObjectType
            })
          } else if (item.checkAllGroup.length > 0) {
            item.Children.map(function (t) {
              if (item.checkAllGroup.indexOf(t.ObjectID) !== -1) {
                arr = arr.concat({
                  AID: t.ObjectID,
                  Type: t.ObjectType
                })
              }
            })
          }
        })
        this.selectedSub = arr
        this.getTable()
        this.modal = false
      },
      reset () {
        for (var i = 0; i < this.list.length; i++) {
          this.list[i].checkAllGroup = []
          this.list[i].checked = false
          this.list[i].disabled = false
          this.list[i].checkAll = false
          this.list[i].disabledAll = false
          if (this.list[i].Children.length > 0) {
            var value = this.list[i].Children
            for (var j = 0; j < value.length; j++) {
              value[j].checked = false
              value[j].disabled = false
            }
          }
        }
      }
    // -----------------筛选课程end-------------------
    }
  }
</script>
<style lang="less" scoped></style>
