<!-- 创建补课 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <Form class="creat-holiday-content"
            label-position='right'
            :label-width="100">
        <FormItem label="补课原因"
                  label-for="reason">
          <Input element-id='reason'
                 placeholder="请填写补课原因"
                 v-model="form.HolidayReason"
                 style="width: 500px"
                 clearable />
        </FormItem>
        <FormItem label="补课年级">
          <Tree :data="treeData"
                :empty-text="treeEmptyText"
                show-checkbox
                @on-check-change="treeCheck"
                class="tree-gread"></Tree>
        </FormItem>
        <div v-for="(item,index) in postData.HolidayList"
             :key='index'
             style=" position: relative;">
          <FormItem label="补课日期"
                    :label-for="`label${index}`">
            <date-picker type="date"
                         :value="item.HolidayDate"
                         :element-id="`label${index}`"
                         :options="options3"
                         placeholder="请选择补课日期"
                         style="width: 500px"
                         :editable="false"
                         @on-change='item.HolidayDate=$event'
                         format="yyyy-MM-dd"></date-picker>
          </FormItem>
          <FormItem label="补课时段">
            <radio-group v-model="item.BackupPeriod">
              <radio label="1"><span>全天</span></radio>
              <radio label="2"><span>上午</span></radio>
              <radio label="3"><span>下午</span></radio>
            </radio-group>
          </FormItem>
          <FormItem label="使用哪天课表"
                    :label-for="`item${index}`">
            <date-picker type="date"
                         :element-id="`item${index}`"
                         :value="item.BackupDate"
                         placeholder="请选择使用哪天课表"
                         style="width: 500px"
                         :editable="false"
                         @on-change='item.BackupDate=$event'
                         format="yyyy-MM-dd"></date-picker>
          </FormItem>
          <span v-if="index > 0"
                class="close-icon"
                @click="del(index)">
            <Icon type="md-close-circle" /> </span>
        </div>
        <div class="add-one-day"
             @click="addOneday">
          <Icon type="ios-add-circle-outline" /> 添加一天
        </div>
      </Form>
      <div class="creat-holiday-content">
        <Button class="xy-btn-primary"
                style="margin-left:100px"
                shape="circle"
                @click="submit"
                :loading="loading">
          <span v-if="!loading">保存</span>
          <span v-else>保存中...</span>
        </Button>
        <Button class='xy-btn-close'
                @click="back"
                style="margin-left:10px">取消</Button>
      </div>
    </div>
    <!-- 补课日期 -->
    <modal v-model="modalClassNotice"
           title="提示"
           :mask-closable="false"
           :transfer="false">
      <div>
        <p>补课日期已有课表，将被新使用的课表替换。</p>
      </div>
      <div slot="footer">
        <Button class="xy-modal-primary"
                shape="circle"
                @click="subNotice">确定</Button>
        <!-- <Button class='xy-modal-close'
                @click="modalClassNotice = false">取消</Button> -->
      </div>
    </modal>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,
        treeData: [],
        treeEmptyText: '',
        postData: {
          HolidayReason: '',
          StudentGradeForStudentYearIDs: [],
          HolidayList: [{
            BackupPeriod: '1',
            HolidayDate: '',
            BackupDate: ''
          }]
        },
        holidayBaseID: 0,
        getData: {},
        // 补课日期提示
        modalClassNotice: false,
        options3: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000
          }
        },
        form: {
          HolidayReason: ''
        },
        postDataHolidayReason: {
          HolidayReason: [
            { required: true, message: '补课原因不能为空。', trigger: 'blur' },
            { type: 'string', max: 200, message: '补课原因不能超过200字符。', trigger: 'blur' }
          ]
        }

      }
    },
    created: function () {
      this.$store.commit('common/getThreeMenuName', '创建补课')
      this.getTree()
    },
    methods: {
      // 保存
      async subNotice () {
        this.modalClassNotice = false
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/TemporaryHoliday/CreateMakeUpClass`, this.postData)
        if (res.success) {
          this.xy.unloading()
          this.xy.msgSuc('创建成功。')
          this.back()
        } else {
          this.xy.unloading()
          this.xy.msgError(res.msg)
        };
      },
      async submit () {
        let that = this
        if (that.postData.StudentGradeForStudentYearIDs.length === 0) {
          this.xy.msgError('请选择补课年级。')
          return false
        }
        let hDate = this.postData.HolidayList.map(function (val) {
          return val.HolidayDate
        }).indexOf('')
        if (hDate > -1) {
          this.xy.msgError('请选择补课日期。')
          return false
        }
        let bDate = this.postData.HolidayList.map(function (val) {
          return val.BackupDate
        }).indexOf('')
        if (bDate > -1) {
          this.xy.msgError('请选择使用哪天课表。')
          return false
        }
        if (that.postData.HolidayList[0].HolidayDate !== '' && that.postData.HolidayList[0].BackupDate !== '') {
          if ((this.postData.HolidayList[0].HolidayDate) === (this.postData.HolidayList[0].BackupDate)) {
            this.xy.msgError('补课日期与使用哪天课表不能为同一天。')
            return false
          }
        }

        that.postData.HolidayReason = that.form.HolidayReason
        if (that.postData.HolidayReason === '') {
          this.xy.msgError('请填写补课原因。')
          return false
        }
        that.loading = true
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/TemporaryHoliday/HasClassTableTime`, that.postData, true)
        if (res.success) {
          let resData = res.data
          if (resData.Return) {
            that.modalClassNotice = true
            this.xy.unloading()
          } else {
            let res = await this.xy.post(`${this.$store.state.apiPath}/api/TemporaryHoliday/CreateMakeUpClass`, this.postData, true)
            if (res.success) {
              this.xy.msgSuc('创建成功。')
              that.loading = false
              that.back()
            } else {
              that.loading = false
              this.xy.unloading()
              this.xy.msgError(res.msg)
            };
          }
        } else {
          this.xy.unloading()
          this.xy.msgError(res.msg)
        };
        that.loading = false
      },
      // 获取树
      async getTree () { // 获取左侧学届树
        this.treeEmptyText = '正在加载中...'
        this.treeData = []
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/TemporaryHoliday/GetTree`, {
          isShowAll: false,
          curNodeInfo: '',
          isSetCount: true
        }, true)
        if (res.success) {
          let dataList = res.data
          if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
              this.treeData.push({
                id: dataList[i].SchoolDistrictID,
                title: dataList[i].SchoolDistrictName,
                level: 1,
                children: []
              })
              if (dataList[i].YearList.length > 0) {
                for (let j = 0; j < dataList[i].YearList.length; j++) {
                  this.treeData[i].children.push({
                    id: dataList[i].YearList[j].StudentYearID,
                    title: dataList[i].YearList[j].StudentYearName,
                    level: 2,
                    children: []
                  })
                  if (dataList[i].YearList[j].GradeList.length > 0) {
                    for (let k = 0; k < dataList[i].YearList[j].GradeList.length; k++) {
                      this.treeData[i].children[j].children.push({
                        id: dataList[i].YearList[j].GradeList[k].StudentGradeID,
                        schoolDistrictID: dataList[i].SchoolDistrictID,
                        studentYearID: dataList[i].YearList[j].StudentYearID,
                        studentGradeForStudentYearID: dataList[i].YearList[j].GradeList[k].StudentGradeForStudentYearID,
                        title: dataList[i].YearList[j].GradeList[k].StudentGradeName,
                        level: 3,
                        children: []
                      })
                    };
                  };
                };
              };
            };
          };
          if (this.treeData.length === 0) {
            this.treeEmptyText = '学届树没有信息。'
          }
        } else {
          this.xy.msgError(res.msg)
        };
        this.xy.unloading()
      },
      // 树选择
      treeCheck: function (val) {
        for (let i = 0; i < val.length; i++) {
          this.postData.StudentGradeForStudentYearIDs.push(val[i].studentGradeForStudentYearID || 0)
        }
      },
      // 添加一天
      addOneday: function () {
        this.postData.HolidayList.push({
          BackupPeriod: '1',
          HolidayDate: '',
          BackupDate: ''
        })
      },
      // 删除一天
      del: function (index) {
        this.postData.HolidayList.splice(index, 1)
      },
      // 返回
      back: function () {
        this.$router.go(-1)
      }

    }

  }
</script>
<style lang='less' scoped>
.creat-holiday-content {
  width: 800px;
  margin: 30px auto 20px;
  /deep/.ivu-form-item-label {
    width: 100px;
  }
  .tree-gread {
    max-height: 300px;
    overflow-y: scroll;
    border: 1px solid #ddd;
    padding: 10px;
    width: 500px;
  }
  .holiday-time {
    margin: 15px 0 10px 0;
    position: relative;
    .title {
      margin-bottom: 10px;
      font-size: 14px;
      margin-right: 10px;
      min-width: 100px;
      text-align: right;
      display: inline-block;
    }
  }
  .add-one-day {
    margin-left: 100px;
    color: #4196ff;
    cursor: pointer;
    i {
      font-size: 18px;
    }
  }
  .close-icon {
    width: 20px;
    height: 20px;
    display: block;
    position: absolute;
    top: 10px;
    right: 0;
    cursor: pointer;
  }
  .close-icon i {
    display: block;
    text-align: center;
    line-height: 20px;
    font-size: 20px;
    color: #f40;
    transition: all 0.3s;
  }
}
</style>
