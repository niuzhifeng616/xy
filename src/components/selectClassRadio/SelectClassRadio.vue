<template>
  <div class="class-radio">
    <!-- 按班级调课 -->
    <Modal v-model="isShow"
           :transfer="false"
           width="600"
           :mask-closable="false"
           :closable="false">
      <p slot="header">选择班级</p>
      <Tabs :animated="false">
        <TabPane v-for="item in classData" :key="item.SchoolDistrictName" :label="item.SchoolDistrictName">
          <div class="select-school">
            <div class="select-grade" v-for="gradeItem in item.YearList" :key="gradeItem.name">
              <div class="select-grade-name">{{gradeItem.name}}</div>
              <span class="select-class"
                    @click="selectClass = childclass"
                    :class="childclass.StudentOrganizationID===selectClass.StudentOrganizationID?'active-class':''"
                    v-for="childclass in gradeItem.classList" :key="childclass.StudentOrganizationName">
                {{childclass.StudentOrganizationName}}
              </span>
            </div>
          </div>
        </TabPane>
      </Tabs>
      <div slot="footer">
        <Button type="text" size="large" @click="modalCancel">取消</Button>
        <i-button type="primary" size="large" @click="modalConfirm">确定</i-button>
      </div>
    </Modal>
  </div>
</template>
<script>

  export default {
    name: 'SelectClassRadio',
    props: {
      isShow: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        classData: [],
        selectClass: ''
      }
    },
    created () {
      this.getClassTree()
    },
    methods: {
      modalCancel () {
        this.$emit('select-cancel')
      },
      modalConfirm () {
        this.$emit('select-confirm', this.selectClass)
      },
      async getClassTree () { // 获取班级树
        this.selectClass = ''
        let params = {
          isShowAll: false,
          curNodeInfo: '',
          isSetCount: true
        }

        let rs = await this.xy.get(this.xyApi + '/api/StudentOrganizationMember/GetTree', params)
        if (rs.success) {
          let dataList = rs.data
          this.classData = []
          for (var i = 0; i < dataList.length; i++) {
            this.classData.push({
              SchoolDistrictID: dataList[i].SchoolDistrictID,
              SchoolDistrictName: dataList[i].SchoolDistrictName,
              YearList: []
            })
            if (dataList[i].YearList.length > 0) {
              for (var j = 0; j < dataList[i].YearList.length; j++) {
                if (dataList[i].YearList[j].GradeList.length > 0) {
                  for (var k = 0; k < dataList[i].YearList[j].GradeList.length; k++) {
                    if (this.classData[i].SchoolDistrictID === dataList[i].YearList[j].SchoolDistrictID) {
                      this.classData[i].YearList.push({
                        name: dataList[i].YearList[j].StudentYearName + dataList[i].YearList[j].GradeList[k].StudentGradeName,
                        StudentYearID: dataList[i].YearList[j].GradeList[k].StudentYearID,
                        classList: dataList[i].YearList[j].GradeList[k].OrgList
                      })
                    }
                  }
                }
              }
            }
          }
          this.selectClassModal = true
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .select-grade > .select-grade-name {
    display: block;
    font-weight: bold;
    margin: 20px 0 10px;
  }

  .select-grade > .select-class {
    display: inline-block;
    margin: 4px 6px;
    padding: 4px;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: center;
    min-width: 60px;
  }

  .select-grade > .select-class:hover {
    border-color: #2d8cf0;
    color: #2d8cf0
  }

  .active-class {
    border-color: #2d8cf0;
    background: #2d8cf0;
    color: #fff;
  }

  .active-class:hover {
    color: #fff !important;
  }
</style>
