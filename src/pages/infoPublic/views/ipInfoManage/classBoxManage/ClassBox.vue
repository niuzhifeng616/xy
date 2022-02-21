<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between xy-center">
      <div>
        <Select v-model="schoolIDItem"
          @on-change="schoolChange"
          placeholder="请选择校区"
          class="xy-content-title-search"
          style="width:150px"
          >
          <Option v-for="item in schoolList"
            :value="item"
            :key="item.CampusID"
            v-cloak
            >
            {{item.CampusName}}
          </Option>
        </Select>
        <Select v-model="buildingID"
          @on-change="buildChange"
          class="xy-content-title-search"
          placeholder="请选择教学楼"
          style="width:150px"
          >
          <Option v-for="item in buildList"
            :value="item.BuildingID"
            :key="item.BuildingID"
            v-cloak>
            {{ item.BuildingName }}
          </Option>
        </Select>
      </div>
      <Input search
        v-model="searchText"
        @on-search="FromSubmit"
        placeholder="输入教室编号"
        class="xy-content-title-search"
        style="width: auto;"
        />
    </div>
    <div class="xy-content-body">
      <!--初始loading-->
      <div v-if="isInitial" class="no-data-box isInitital-opacity" v-cloak>
        <img class="no-data-img" src="@/assets/common/loading.png" />
      </div>
      <!--暂无数据-->
      <div v-if="isEmpty && !isInitial" class="no-data-box" v-cloak>
        <img class="no-data-img" src="@/assets/common/nullData.svg" />
        <span class="no-data-text">暂无教室</span>
      </div>
        <!-- 班级列表 -->
        <div v-if="!isEmpty && !isInitial" class="clearfix">
          <div class="class-list clearfix">
            <div v-for="(item, index) in classList"
              class="class-main nowrap"
              :key="index"
              :title="item.ClassTerminalName"
              @click="classClick(item)"
              v-cloak
              >
              <span v-cloak>{{item.ClassTerminalName}}</span>
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
        applications: '',
        breadcrumbIDs: '',
        breadcrumbNames: '',
        isEmpty: false,
        isInitial: true,
        loading: true,
        searchText: '',
        schoolIDItem: {},
        schoolID: 0,
        schoolList: [],
        buildingID: 0,
        buildList: [],
        classList: [],
        apiPath: ''
      }
    },
    created: function () {
      this.apiPath = this.$store.state.apiPath
      this.GetAllCampus()
    },
    mounted: function () {},
    methods: {
      // 获取校区以及楼信息
      async GetAllCampus () {
        this.xy.loading()
        this.schoolList = []
        this.buildList = []
        let res = await this.xy.get(`${this.apiPath}/api/ClassInfo/GetAllCampus`, null, true)
        if (res.success) {
          if (res.data != null && res.data.length > 0) {
            for (let i = 0; i < res.data.length; i++) {
              this.schoolList.push(res.data[i])
            }
            this.schoolIDItem = this.schoolList[0]
            this.buildList = this.schoolList[0].Building
            this.schoolID = this.schoolIDItem.CampusID
            this.buildingID = this.buildList[0].BuildingID
            this.GetAll()
          } else {
            this.xy.unloading()
            this.isEmpty = true
          }
        } else {
          this.xy.unloading()
          this.isEmpty = true
          this.xy.msgError(res.Errmsg)
        }
      },
      // 获取所有班级信息列表
      async GetAll () {
        this.xy.loading()
        let res = await this.xy.get(`${this.apiPath}/api/ClassInfo/GetAll`, {
          schoolID: this.schoolID,
          buildingID: this.buildingID,
          searchText: this.searchText
        })
        this.isInitial = false
        if (res.success) {
          if (res.data != null && res.data.length > 0) {
            this.classList = res.data
            this.isEmpty = false
          } else {
            this.isEmpty = true
          }
        } else {
          this.isEmpty = true
          this.xy.msgError(res.Errmsg)
        }
        this.xy.unloading()
      },
      // 搜索
      FromSubmit: function () {
        this.pageCurrent = 1
        this.GetAll()
      },
      schoolChange: function (item) {
        this.schoolIDItem = item// 校区
        this.schoolID = item.CampusID// 校区ID
        this.buildList = item.Building// 对应的所有楼
        this.buildingID = item.Building[0].BuildingID
        this.GetAll()
      },
      buildChange: function (val) {
        this.buildingID = val
        this.GetAll()
      },
      classClick: function (row) {
        this.$store.commit('common/getParam', row)
        this.$store.commit('common/getThreeMenuName', '编辑班级百宝箱')
        this.$router.push({
          path: '/xyHome/ClassBoxEdit',
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .class-list{
    .class-main {
      background: #fff;
      width: 399px;
      height: 137px;
      line-height: 137px;
      text-align: center;
      margin: 0 15px 20px;
      cursor: pointer;
      float: left;
      position: relative;
      transition: all ease 0.5s;
      border: 1px solid rgba(236,238,241,1);
      box-shadow: 0px 3px 8px 0px rgba(196,196,196,0.63);
      border-radius: 4px;
      color: #444444;
      font-size: 18px;
      padding: 0px 30px;
      font-weight: 700;
    }
    .class-main:hover {
      transition: all ease 0.5s;
      box-shadow: 0px 3px 8px 0px rgba(54,54,54,0.63);
    }
  }
</style>
