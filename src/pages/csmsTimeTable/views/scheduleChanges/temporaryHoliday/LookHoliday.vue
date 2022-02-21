<!-- 查看放假 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <div class="creat-holiday-content">
        <div class="block">
          <h2>放假原因</h2>
          <Input v-model="getData.HolidayReason"
                   disabled
                   style="width: 500px"
                   placeholder="请填写放假原因" />
        </div>
        <div class="block">
          <h2>放假年级</h2>
          <Tree :data="treeData"
                :empty-text="treeEmptyText"
                show-checkbox
                class="tree-gread"
                multiple></Tree>
        </div>
        <div class="holiday-time">
          <div>
            <label>放假日期</label>
            <date-picker disabled
                         type="date"
                         v-model="getData.HolidayDate"
                         :readonly="true"
                         placeholder="请选择放假日期"
                         style="width: 500px"
                         :editable="false"></date-picker>
          </div>
          <div>
            <label style="vertical-align:middle">放假时段</label>
            <radio-group v-model="getData.BackupPeriod">
              <radio label="1"
                     disabled><span>全天</span></radio>
              <radio label="2"
                     disabled><span>上午</span></radio>
              <radio label="3"
                     disabled><span>下午</span></radio>
            </radio-group>
          </div>
          <checkbox v-model="single"
                    disabled
                    style=" margin-left: 65px;">需要补回</checkbox>
          <div style=" margin-top: 15px;"
               v-if="getData.BackupDate != '0001-01-01T00:00:00'">
            <label>补回日期</label>
            <date-picker type="date"
                         disabled
                         :readonly="true"
                         v-model="getData.BackupDate"
                         placeholder="请选择补回日期"
                         style="width: 500px"
                         :editable="false"></date-picker>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        treeData: [],
        treeEmptyText: '',
        getData: {},
        holidayBaseID: 0,
        single: false,
        studentYearList: [],
        studentIDsList: ''
      }
    },
    created: function () {
      this.$store.commit('common/getThreeMenuName', '查看假期')
      if (this.$store.state.common.menuInfo.holidayBaseID) {
        this.holidayBaseID = this.$store.state.common.menuInfo.holidayBaseID
        this.getTP()
      }
    },
    methods: {
      // 获取
      async  getTP () {
        let that = this
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/TemporaryHoliday/GetInfo`, {
          holidayBaseID: that.holidayBaseID
        })
        if (res.success) {
          res.data.BackupPeriod = res.data.BackupPeriod.toString()
          that.getData = res.data
          if (res.data.BackupDate === '0001-01-01T00:00:00') {
            that.single = false
          } else {
            that.single = true
          }
          if (res.data.StudentGradeForStudentYearIDs) {
            that.studentIDsList = res.data.StudentGradeForStudentYearIDs.join(',')
            that.getTree()
          }
        }
        this.xy.unloading()
      },
      // 获取树
      async  getTree () { // 获取左侧学届树
        this.treeEmptyText = '正在加载中...'
        this.treeData = []
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/TemporaryHoliday/GetTree`, {
          isShowAll: false,
          curNodeInfo: '',
          isSetCount: true,
          studentGradeForStudentYearIDs: this.studentIDsList
        })
        this.xy.unloading()
        if (res.success) {
          let dataList = res.data
          if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
              this.treeData.push({
                id: dataList[i].SchoolDistrictID,
                title: dataList[i].SchoolDistrictName,
                disableCheckbox: true,
                expand: dataList[i].IsSelected,
                selected: dataList[i].IsSelected,
                level: 1,
                children: []
              })
              if (dataList[i].YearList.length > 0) {
                for (let j = 0; j < dataList[i].YearList.length; j++) {
                  this.treeData[i].children.push({
                    id: dataList[i].YearList[j].StudentYearID,
                    title: dataList[i].YearList[j].StudentYearName,
                    disableCheckbox: true,
                    expand: dataList[i].YearList[j].IsSelected,
                    selected: dataList[i].YearList[j].IsSelected,
                    level: 2,
                    children: []
                  })
                  for (let k = 0; k < dataList[i].YearList[j].GradeList.length; k++) {
                    if (dataList[i].YearList[j].GradeList[k].IsSelected) {
                      this.treeData[i].children[j].children.push({
                        id: dataList[i].YearList[j].GradeList[k].StudentGradeID,
                        studentGradeForStudentYearID: dataList[i].YearList[j].GradeList[k].StudentGradeForStudentYearID,
                        title: dataList[i].YearList[j].GradeList[k].StudentGradeName,
                        disableCheckbox: true,
                        selected: dataList[i].YearList[j].GradeList[k].IsSelected,
                        checked: dataList[i].YearList[j].GradeList[k].IsSelected,
                        level: 3,
                        children: []
                      })
                    }
                  };
                };
              };
            };
          }
          if (this.treeData.length === 0) {
            this.treeEmptyText = '学届树没有信息。'
          }
        }
      },
      // 返回
      back: function () {
        this.$router.push({ path: '/xyHome/holidayTable/temholiday' })
      }

    }

  }
</script>
<style lang='less' scoped>
.creat-holiday-content {
  width: 800px;
  margin: 30px auto 20px;
  h2 {
    margin-bottom: 10px;
    font-size: 14px;
    margin-right: 10px;
  }
  .block {
    display: flex;
    margin-bottom: 10px;
    .tree-gread {
      max-height: 300px;
      overflow-y: scroll;
      border: 1px solid #ddd;
      padding: 10px;
      width: 500px;
    }
  }
  .holiday-time {
    border-radius: 10px;
    position: relative;
    margin-bottom: 10px;
    div {
      margin-bottom: 10px;
    }
    label {
      margin-right: 10px;
    }
  }
}

.holiday-time:hover .close-icon i {
  opacity: 1 !important;
}
</style>
