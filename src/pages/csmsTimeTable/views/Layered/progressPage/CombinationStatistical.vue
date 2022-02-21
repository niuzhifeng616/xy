<!-- 组合统计 -->
<template>
  <div id="selectResult"
       class="xy-content-body"
       style="padding-left: 0;">

    <div v-for=' (i,index) in dataTable'
         style="margin-bottom: 30px;"
         :key='index'>
      <div style="background: #f9f9f9;padding: 10px; display:flex; justify-content: space-between;">
        <p>
          {{index+1}}：{{i.ObjectName}}。
        </p>
        <p>{{i.Total}}</p>
      </div>

      <Table ref="selection"
             :columns="i.columns"
             :data="i.list"
             class="thead-bg"></Table>
    </div>
    <div v-if='dataTable.length===0'
         class="no-data-box">
      <img class="no-data-img"
           src="@/assets/common/nullData.svg"
           alt="图片" />
      <span class="no-data-text">该搜索条件下没有结果。</span>
    </div>
    <modal v-model="modal"
           width=550
           :transfer="false"
           title="筛选课程"
           :mask-closable="false">
      <ul v-if='list.length>0&&list[0].ObjectID>0'
          class="course">
        <li v-for='(item,index) in list'
            style="margin: 10px 0"
            :key='index'>
          <div>
            <checkbox v-model="item.checked"
                      :disabled='item.disabled'
                      @on-change='chooseSub(item,index)'
                      style="display: inline-block;">
              {{item.ObjectName}}</checkbox>
            <checkbox v-model="item.checkAll"
                      :indeterminate="item.indeterminate"
                      v-if='item.Children.length>0&&list[0].ObjectID>0'
                      :disabled='item.disabledAll'
                      @on-change='chooseAll(item,index)'
                      style="display: inline-block;">全选
            </checkbox>
            <checkbox-group v-model="item.checkAllGroup"
                            @on-change="chooseLayered(item,index)"
                            style="display: inline-block;">
              <checkbox :label="i.ObjectID"
                        :key='i.ObjectID'
                        :disabled='i.disabled'
                        v-for='i in item.Children'>
                {{i.ObjectName}}
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
    </modal>

  </div>
</template>

<script>

  export default {
    data () {
      return {
        selectedSub: [], // 已选择的课程
        // 表格
        dataTable: [],
        // 弹窗
        modal: false,
        list: [{
          ObjectID: '',
          ObjectName: '',
          checked: false,
          disabled: false,
          checkAll: false,
          indeterminate: false,
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

    mounted: function () {
      this.getTable()
      this.getSubjectSettingInfo()
    },

    methods: {
      // 获取课程/层
      async getSubjectSettingInfo () {
        this.list = []
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/GetSubjectSettingInfo`, {
          layeredSelectProgrammeID: this.$parent.$parent.layeredStepsHeader.LayeredSelectProgrammeID
        })
        if (res.success) {
          if (res.data.Subinfo) {
            let datas = res.data.Subinfo || []
            if (datas.length) {
              this.list = this.initData(datas)
            }
          }
        }
      },
      async getTable () {
        let that = this
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/GetCombinationSelectInfo`, {
          StudentOrganizationIDS: this.$parent.classOrganizationIDs,
          LayeredSelectProgrammeID: this.$parent.$parent.layeredStepsHeader.LayeredSelectProgrammeID,
          LayeredSelectRotationID: this.$parent.$parent.layeredStepsHeader.LayeredSelectRotationID,
          SubjectList: that.selectedSub
        })

        if (res.success) {
          that.dataTable = []
          let reslut = res.data
          reslut.map(function (item) {
            item.columns = []
            if (item.OrgInfo.length > 0) {
              for (let i = 0; i < item.OrgInfo.length; i++) {
                item.columns.push({
                  title: item.OrgInfo[i].StudentOrganizationName,
                  key: 'SubjectCategoryName' + i,
                  minWidth: 100
                })
              };
            }
            let subjectList = []
            subjectList = item.OrgInfo
            item.list = [{}]
            for (let j = 0; j < subjectList.length; j++) {
              item.list[0]['SubjectCategoryName' + j] = subjectList[j].SCount
            }
          })
          that.dataTable = reslut
          this.xy.unloading()
        } else {
          that.xy.msgError(res.msg)
        };
      },
      filterSubject: function () {
        this.modal = true
      },
      initData (data) {
        data.map((item) => {
          item.checked = false
          item.disabled = false
          item.checkAll = false
          item.indeterminate = false
          item.disabledAll = false
          item.checkAllGroup = []
          if (item.Children.length > 0) {
            item.Children.map(function (t) {
              t.checked = false
              t.disabled = false
            })
          }
        })
        return data
      },
      cancel: function () {
        this.modal = false
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
            if (sitem.AID === item.ObjectID && sitem.Type === item.ObjectType) { // 反选课程
              item.checked = true
              item.disabledAll = true
              if (item.Children.length > 0) {
                item.Children.map(function (t) {
                  t.checked = false
                  t.disabled = true
                })
              }
            } else {
              if (item.Children.length > 0 && !item.disabledAll) {
                item.Children.map(function (t) {
                  t.checked = false
                  t.disabled = false
                  if (sitem.AID === t.ObjectID && sitem.Type === t.ObjectType) {
                    t.checked = true
                    t.disabled = false
                    item.disabled = true
                    item.checkAllGroup.push(t.ObjectID)
                  }
                })
                item.checkAll = !!(item.checkAllGroup.length && item.checkAllGroup.length === item.Children.length)
                item.indeterminate = !!(item.checkAllGroup.length && item.checkAllGroup.length < item.Children.length)
              }
            }
          })
          return item
        })
      },
      // -----------------筛选组合-------------------
      chooseSub: function (item, index) {
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
        this.list[index].indeterminate = false
      },
      chooseAll: function (item, index) {
        if (item.checkAll) {
          this.list[index].checked = false
          this.list[index].disabled = true
          let arr = []
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
        this.list[index].indeterminate = false
      },
      chooseLayered: function (item, index) {
        let that = this
        if (item.checkAllGroup.length > 0) {
          // 课程禁止选择
          this.list[index].checked = false
          this.list[index].disabled = true
          // 点亮全选按钮
          if (item.checkAllGroup.length === item.Children.length && item.Children.length) {
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

        this.list[index].Children.map(function (j) {
          j.checked = false
          that.list[index].checkAllGroup.map(function (t) {
            if (j.value === t) {
              j.checked = true
              j.disabled = false
            }
          })
        })
      },
      sure: function () {
        let arr = []
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
      }
    // -----------------筛选组合end-------------------

    }

  }
</script>
<style lang='less' scoped>
.course {
  max-height: 420px;
  overflow-y: auto;
}
</style>
