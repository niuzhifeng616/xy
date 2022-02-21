<template>
<div id="StepsContent">
  <div v-if='!isNull'>
    <div class="exports">
      <Button @click="exports" type="primary">导出</Button>
      <Input search v-model.trim="searchName" placeholder="请输入用户名/姓名" @on-search="DoSearch" @on-enter="DoSearch" class="fr xy-content-title-search" style="width: auto;" />
    </div>

    <XyAntTable
      :columns="columns"
      :dataSource="list"
      :tableLoading="tableLoading"
      :pagination="pagination"
      @change="handleTableChange"
      :scrollx="'max-content'"
      >
      <div slot="Icon" slot-scope="text, record">
        <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
          <span class="head-font">
            {{ xy.showName(record.TeacherName)}}
          </span>
        </div>
        <img style="width:30px;height:30px;border-radius:50%" v-else :src="$store.state.apiPath + record.Icon + '?' + Math.random() * 15">
      </div>
      <div style="min-width: 120px" slot="TeacherName" slot-scope="text, record">
        {{record.TeacherName}}
      </div>
      <div style="min-width: 120px" slot="UserName" slot-scope="text, record">
        {{record.UserName}}
      </div>
      <div style="min-width: 200px" slot="SchoolCardNumber" slot-scope="text, record">
        {{record.SchoolCardNumber}}
      </div>
      <div style="min-width: 120px" slot="InspectionVenues" slot-scope="text, record">
        {{record.InspectionVenues}}
      </div>
      <div style="min-width: 160px" slot="InspectionTimeName" slot-scope="text, record">
        {{record.InspectionTimeName}}
      </div>
    </XyAntTable>
  </div>
</div>

</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: {
      XyAntTable
    },
    name: 'Count',
    data () {
      return {
        searchName: '',
        list: [],
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        columns: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 40,
            align: 'right',
            scopedSlots: { customRender: 'Icon' },
            className: 'table-pic'
          },
          {
            title: '姓名',
            dataIndex: 'TeacherName',
            scopedSlots: { customRender: 'TeacherName' }
          },
          {
            title: '用户名',
            dataIndex: 'UserName',
            scopedSlots: { customRender: 'UserName' }
          },
          // {
          //   title: '校内号',
          //   dataIndex: 'SchoolCardNumber',
          //   scopedSlots: { customRender: 'SchoolCardNumber' }
          // },
          {
            title: '监考场次',
            dataIndex: 'InspectionVenues',
            scopedSlots: { customRender: 'InspectionVenues' }
          },
          {
            title: '监考时长',
            dataIndex: 'InspectionTimeName',
            scopedSlots: { customRender: 'InspectionTimeName' }
          }

        ],
        empty: [],
        tableLoading: false,
        ArrangeSupervisorExamID: 0,
        isNull: false,
        isSearchNull: false

      }
    },
    props: ['ASExamID'],
    watch: {
      ASExamID (newVal, oldVal) {
        this.ArrangeSupervisorExamID = newVal
        this.GetList()
      }
    },
    created () {
      this.ArrangeSupervisorExamID = this.ASExamID
      this.GetList()
      window.addEventListener('resize', () => {
        this.AddCard()
      }, false)
    },
    beforeDestroy () {
      window.removeEventListener('resize', () => {
        this.AddCard()
      }, false)
    },
    mounted () {

    },
    methods: {
      handleTableChange () {
        this.GetList()
      },
      async GetList () {
        this.tableLoading = true
        var obj = {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
          SearchText: this.searchName,
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportSummary/GetExamInspectionVenuesByPage`, obj)
        this.tableLoading = false
        if (res.success) {
          this.list = res.data.data
          this.pagination.total = res.data.totalRecords
          if (this.searchName === '') {
            this.isNull = this.pagination.total === 0
            this.isSearchNull = this.isNull
          } else {
            this.isNull = false
            this.isSearchNull = this.pagination.total === 0
          }
          this.AddCard()
        }
      },
      ChangePage (current) {
        $(window).scrollTop(0)
        this.pagination.current = current
        this.GetList()
      },
      ChangePageSize (size) {
        $(window).scrollTop(0)
        this.pagination.pageSize = size
        if (this.pagination.current === 1) {
          this.GetList()
        } else {
          this.pagination.current = 1
          this.AddCard()
        }
      },
      // 导出
      exports () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/ReportSummary/ExportExamInspectionVenuesAll`, {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID
        })
      },
      DoSearch () {
        this.pagination.current = 1
        this.GetList()
      },
      // 最后一行添加空卡片保证左对齐
      AddCard () {
        this.empty = []
        // 卡片内容区宽度
        // 每一排展示卡片的数量
        this.$nextTick(() => {
          if (this.$refs.card) {
            var cardWidth = this.$refs.card.offsetWidth
            var cardChildrenWidth = document.getElementsByClassName('card_div').offsetWidth
            var cardChildren = [].slice.call(document.getElementsByClassName('card_div'))
            var num1 = Math.floor(cardWidth / (cardChildrenWidth + 20)) // 每排放置的卡片数量
            if (this.list.length >= num1) { // 卡片数量超过一排
              this.$refs.card.style.justifyContent = 'space-between'
              cardChildren.forEach((item) => {
                item.style.marginRight = '20px'
              })
              // 需要在末尾添加的空卡片数量
              var num2 = num1 - (this.list.length) % num1
              if (num2 === num1) {
                num2 = 0
              }
              for (var i = 0; i < num2; i++) {
                this.empty.push([])
              }
            } else { // 卡片数量未超过一排
              this.$refs.card.style.justifyContent = 'flex-start'
              cardChildren.forEach((item) => {
                item.style.marginRight = '40px'
              })
            }
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
#StepsContent {
  padding: 20px;
}
.exports {
  margin-bottom: 20px;
}
.card {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.card_div {
  width: 280px;
  height: 125px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(229, 229, 229, 1);
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  font-weight: 400;
}
.card_div > div {
  display: inline-block;
  text-align: center;
}
.card_div_left {
  flex-grow: 1;
  padding: 15px 30px;
}
.card_div_right {
  text-align: center;
  width: 70px;
  background: rgba(236, 244, 255, 1);
}
.card_div_name {
  font-size: 18px;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.card_id {
  font-size: 14px;
  color: rgba(102, 102, 102, 1);
  margin-bottom: 18px;
}
.card_duration {
  font-size: 14px;
  background: rgba(247, 247, 247, 1);
  border-radius: 16px;
  padding: 3px;
}
.card_duration > span {
  display: inline-block;
  margin-left: 3px;
  vertical-align: middle;
}
.card_session {
  margin-top: 25px;
  font-size: 36px;
  color: rgba(65, 150, 255, 1);
}
.card_session ~ p {
  color: rgba(65, 150, 255, 1);
  margin-top: -8px;
}
.empty {
  width: 271px;
  margin-right: 20px;
}
.page_style {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

</style>
