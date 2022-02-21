<!-- 创建放假 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <Form class="creat-holiday-content"
            label-position='right'
            :label-width="100">
        <FormItem label="放假原因"
                  label-for="reason">
          <Input element-id='reason'
                 placeholder="请填写放假原因"
                 v-model="form.HolidayReason"
                 style="width: 500px"
                 clearable />
        </FormItem>
        <FormItem label="放假年级">
          <Tree :data="treeData"
                :empty-text="treeEmptyText"
                show-checkbox
                @on-check-change="treeCheck"
                class="tree-gread"></Tree>
        </FormItem>
        <div v-for="(item,index) in postData.HolidayList"
             :key='index'
             style=" position: relative;">
          <FormItem label="放假日期"
                    :label-for="`label${index}`">
            <date-picker type="date"
                         :element-id="`label${index}`"
                         :options="options3"
                         :value="item.HolidayDate"
                         placeholder="请选择放假日期"
                         style="width: 500px"
                         :editable="false"
                         @on-change='item.HolidayDate=$event'
                         format="yyyy-MM-dd"></date-picker>
          </FormItem>
          <div class="bottom">
            <span class="ivu-form-item-label">放假时段</span>
            <div>
              <radio-group v-model="item.BackupPeriod">
                <radio label="1"><span>全天</span></radio>
                <radio label="2"><span>上午</span></radio>
                <radio label="3"><span>下午</span></radio>
              </radio-group>
              <div style="margin:10px 0;">
                <checkbox v-model="item.single"
                          @on-change="checkChange(item)">需要补回</checkbox>
              </div>
            </div>
          </div>
          <FormItem v-if="item.single"
                    label="补回日期"
                    :label-for="`item${index}`">
            <date-picker type="date"
                         :value="item.BackupDate"
                         :options="options3"
                         placeholder="请选择补回日期"
                         :element-id="`item${index}`"
                         style="width: 500px"
                         :editable="false"
                         @on-change='item.BackupDate=$event'
                         format="yyyy-MM-dd"></date-picker>
          </FormItem>
          <span v-if="index > 0"
                class="close-icon"
                @click="del(index)">
            <Icon type="md-close-circle" /></span>
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
                :loading="loading"
                @click="submit">
          <span v-if="!loading">保存</span>
          <span v-else>保存中...</span>
        </Button>
        <!-- <Button class='xy-btn-close'
                @click="back"
                style="margin-left:10px">取消</Button> -->
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
        <Button class='xy-modal-close'
                @click="modalClassNotice = false">取消</Button>
      </div>
    </modal>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        modalClassNotice: false,
        loading: false,
        treeData: [],
        treeEmptyText: '',
        postData: {
          HolidayReason: '',
          StudentGradeForStudentYearIDs: [],
          HolidayList: [{
            BackupPeriod: '1',
            HolidayDate: '',
            BackupDate: '',
            single: false
          }]
        },
        treeDataList: [],
        arrData: [],
        postDataHolidayReason: {
          HolidayReason: [
            { required: true, message: '放假原因不能为空。', trigger: 'blur' },
            { type: 'string', max: 200, message: '放假原因不能超过200字符。', trigger: 'blur' }
          ]
        },
        options3: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000
          }
        },
        form: {
          HolidayReason: ''
        }

      }
    },
    created: function () {
      this.$store.commit('common/getThreeMenuName', '创建放假')
    },
    mounted: function () {
      this.getTree()
    },
    methods: {
      checkChange: function (item) {
        if (!item.single) {
          item.BackupDate = ''
        }
      },
      async subNotice () {
        this.modalClassNotice = false
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/TemporaryHoliday/CreateHoliday`, this.postData, true)
        this.loading = false
        if (res.success) {
          this.xy.msgSuc('创建成功。')
          this.back()
        } else {
          this.xy.unloading()
          this.xy.msgError(res.msg)
        };
      },
      // 保存
      async submit () {
        let that = this
        if (that.postData.StudentGradeForStudentYearIDs.length === 0) {
          this.xy.msgError('请选择放假年级。')
          return false
        }
        let hDate = this.postData.HolidayList.map(function (val) {
          return val.HolidayDate
        }).indexOf('')
        if (hDate > -1) {
          this.xy.msgError('请选择放假日期。')
          return false
        }
        let bDate = this.postData.HolidayList.map(function (val) {
          if (val.single) { return val.BackupDate }
        }).indexOf('')
        if (bDate > -1) {
          this.xy.msgError('请选择补回日期。')
          return false
        }

        that.postData.HolidayReason = that.form.HolidayReason
        if (that.postData.HolidayReason === '') {
          this.xy.msgError('请填写放假原因。')
          return false
        }
        if (that.postData.HolidayList[0].HolidayDate !== '' && that.postData.HolidayList[0].BackupDate !== '') {
          if ((that.postData.HolidayList[0].HolidayDate) === (that.postData.HolidayList[0].BackupDate)) {
            this.xy.msgError('放假日期和补回日期不能为同一天。')
            return false
          }
        }
        that.loading = true
        this.xy.loading()
        let arr = []
        this.postData.HolidayList.map(item => {
          if (item.single) {
            arr.push({
              BackupPeriod: item.BackupPeriod,
              HolidayDate: item.BackupDate,
              BackupDate: item.HolidayDate,
              single: item.single
            })
          }
        })
        if (arr.length === 0) {
          this.subNotice()
        } else {
          let obj = {
            StudentGradeForStudentYearIDs: this.postData.StudentGradeForStudentYearIDs,
            HolidayReason: this.postData.HolidayReason,
            HolidayList: arr
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/TemporaryHoliday/HasClassTableTime`, obj, true)
          if (res.success) {
            this.loading = false
            let resData = res.data
            if (resData.Return) {
              this.modalClassNotice = true
              this.xy.unloading()
            } else {
              this.subNotice()
            }
          } else {
            this.loading = false
            this.xy.unloading()
            this.xy.msgError(res.msg)
          };
        }
      },
      // 获取树
      async getTree () { // 获取左侧学届树
        this.treeEmptyText = '正在加载中...'
        this.treeData = []
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/TemporaryHoliday/GetTree`, {
          isShowAll: false,
          curNodeInfo: 0,
          isSetCount: true
        })
        this.xy.unloading()
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
                        // schoolDistrictID: dataList[i].SchoolDistrictID,
                        // studentYearID: dataList[i].YearList[j].StudentYearID,
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
        }
      },
      // 树选择
      treeCheck: function (val) {
        let that = this
        that.treeDataList = val
        that.arrData = []

        for (let i = 0; i < that.treeDataList.length; i++) {
          that.arrData.push(that.treeDataList[i].studentGradeForStudentYearID || 0)
        }

        that.postData.StudentGradeForStudentYearIDs = that.arrData
      },
      // 添加一天
      addOneday: function () {
        this.postData.HolidayList.push({
          BackupPeriod: '1',
          HolidayDate: '',
          BackupDate: '',
          single: false
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
    .top {
      margin-bottom: 15px;
    }
    .title {
      margin-bottom: 10px;
      font-size: 14px;
      margin-right: 10px;
      min-width: 100px;
      text-align: right;
      display: inline-block;
    }
    .bottom {
      display: flex;
      align-items: flex-start;
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
