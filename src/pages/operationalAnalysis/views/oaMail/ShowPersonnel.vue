<!-- 消息发送的具体人员，详情 -->
<template>
  <div  class="xy-content-module" id="FileManage">
    <div class="xy-content-title clearfix">
      <div class="fl">
        <i-button type="primary" @click="ReturnClick" ghost>返回</i-button>
      </div>
      <div class="fr">
        <i-input search v-model="searchText" @on-search="FromSubmit" placeholder="输入用户名进行搜索" class="fr xy-content-title-search" style="width: auto;">
          <icon type="ios-search cursor-p" slot="suffix" />
        </i-input>
      </div>
    </div>
    <div class="xy-content-body">
      <!--初始loading-->
      <div v-if="isInitial" class="no-data-box isInitital-opacity">
      <img class="no-data-img" src="@/assets/common/nullData.svg" />
      </div>
      <!--暂无数据-->
      <div v-if="isEmpty" class="no-data-box" v-cloak>
        <img class="no-data-img" src="@/assets/common/nullData.svg" />
        <span class="no-data-text" v-cloak>暂无消息</span>
      </div>
      <div v-if="!isEmpty && !isInitial">

        <div class="pers-main teacher" v-if="teacherList.length > 0">
          <div class="pers-tit">
            教师
          </div>
          <div class="pers-box">
            <div class="pers-list" v-for="(item,index) in teacherList" :key='index' v-show="item.UserName.indexOf(searchText)>=0 || searchText===''">
              <div class="tit" v-cloak>{{item.FullName}}</div>
              <div class="number" v-cloak>{{item.UserName}}</div>
            </div>
          </div>
        </div>

        <div class="pers-main student" v-if="studentList.length > 0">
          <div class="pers-tit">
            学生
          </div>
          <div class="pers-box">
            <div class="pers-list" v-for="(item,index) in studentList" :key='index' v-show="item.UserName.indexOf(searchText)>=0 || searchText===''">
              <div class="tit" v-cloak>{{item.FullName}}</div>
              <div class="number" v-cloak>{{item.UserName}}</div>
            </div>
          </div>
        </div>

        <div class="pers-main parents" v-if="parentsList.length > 0">
          <div class="pers-tit">
            家长
          </div>
          <div class="pers-box">
            <div class="pers-list" v-for="(item,index) in parentsList" :key='index' v-show="item.UserName.indexOf(searchText)>=0 || searchText===''">
              <div class="tit" v-cloak>{{item.FullName}}</div>
              <div class="number" v-cloak>{{item.UserName}}</div>
            </div>
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
        info: '',
        mainList: [],
        teacherList: [],
        studentList: [],
        parentsList: [],
        searchText: '',
        isInitial: true, // 页面加载loading
        isEmpty: false // 数据是否为空
      }
    },
    computed: {
      params () {
        return this.$store.state.common.menuInfo
      }
    },
    created: function () {
      this.info = this.params.row
    },
    mounted: function () {
      this.GetMessageReceiveByID()
    },
    methods: {
      // 获取所有接收人员
      GetMessageReceiveByID: function () {
        this.xy.loading()
        let _this = this
        this.xy.get(`http://qa.api.oa.xiaoyangedu.net:37200/api/OAMessage/GetMessageReceiveByID`, {
          MessageID: this.info.MessageID
        }).then(res => {
          _this.isInitial = false
          if (res.success) {
            _this.mainList = res.data
            let teacherList = []
            let studentList = []
            let parentsList = []
            for (let i = 0; i < _this.mainList.length; i++) {
              // 教师
              if (_this.mainList[i].UserRole === 2) {
                teacherList.push(_this.mainList[i])
              }
              // 学生
              if (_this.mainList[i].UserRole === 3) {
                studentList.push(_this.mainList[i])
              }
              // 家长
              if (_this.mainList[i].UserRole === 4) {
                parentsList.push(_this.mainList[i])
              }
            }
            _this.teacherList = teacherList
            _this.studentList = studentList
            _this.parentsList = parentsList
            _this.isEmpty = false
            this.xy.unloading()
          } else {
            this.xy.unloading()
          };
        })
      },
      // 搜索
      FromSubmit: function (val) {
        this.searchText = val
      },
      // 返回
      ReturnClick: function () {
        this.$router.push({ path: '/xyHome/oaMailTable', query: this.$store.state.common.menuInfo })
      }
    }
  }
</script>
<style lang="less" scoped>
.pers-main {
  border: 1px solid rgba(233, 233, 233, 1);
  border-radius: 3px;
  margin-bottom: 15px;
}

.pers-main > .pers-tit {
  height: 32px;
  line-height: 32px;
  font-weight: bold;
  font-size: 16px;
  padding-left: 30px;
}

.pers-main > .pers-box {
  padding: 15px 8px 19px;
}

.pers-main > .pers-box > .pers-list {
  display: inline-block;
  width: 154px;
  height: 73px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(238, 239, 243, 1);
  box-shadow: 0px 1px 4px 0px rgba(211, 211, 211, 0.5);
  border-radius: 5px;
  margin: 7.5px;
  text-align: center;
}

.pers-main > .pers-box > .pers-list > .tit {
  font-size: 14px;
  font-weight: 400;
  margin-top: 15px;
  margin-bottom: 6px;
}

.pers-main > .pers-box > .pers-list > .number {
  font-size: 14px;
  font-weight: 400;
  color: #999;
}

.teacher > .pers-tit {
  color: rgba(65, 150, 255, 1);
  background: rgba(235, 242, 255, 1);
}

.student > .pers-tit {
  color: rgba(4, 184, 177, 1);
  background: rgba(231, 248, 247, 1);
}

.parents > .pers-tit {
  color: rgba(254, 147, 60, 1);
  background: rgba(255, 247, 237, 1);
}
</style>
