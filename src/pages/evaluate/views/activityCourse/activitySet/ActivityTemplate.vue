<!-- 活动模板 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <div class="xy-flex setting-wrap">
        <div class="index-level">
          <div class="index-level-title xy-flex xy-between xy-center">
            <div><i class="iconfont">&#xe6f2;</i><span>活动类型</span></div>
          </div>
          <div class="index-level-content">
            <ul class="index-list">
              <li v-for="(item,index) in activityTypeList"
                  :key="index"
                  :class="activityTypeId===item.ActivityCourseTypeID?'active':''">
                <div class="box"
                     @click="changeActivityType(item)">
                  <div class="index-point"></div>
                  <div class="index-name"
                       :title="item.ActivityCourseTypeName">{{item.ActivityCourseTypeName}}</div>
                </div>
              </li>
            </ul>
            <div v-if="activityTypeId===-1"
                 class="null-index"><i class="iconfont">&#xe6e7;</i><span>暂无活动类型</span></div>
          </div>
        </div>
        <div class="index-level">
          <div class="index-level-title xy-flex xy-between xy-center">
            <div><i class="iconfont">&#xe6f2;</i><span>模板名称</span></div>
          </div>
          <div class="index-level-content">
            <ul class="index-list">
              <li v-for="(item,index) in templateList"
                  :key="index"
                  :class="templateId===item.ActivityCourseTemplateID?'active':''">
                <div class="box"
                     @click="changeTemplate(item)">
                  <div class="index-point"></div>
                  <div class="index-name"
                       :title="item.ActivityCourseTemplateName">{{item.ActivityCourseTemplateName}}</div>
                </div>
              </li>
            </ul>
            <div v-if="templateId===-1"
                 class="null-index"><i class="iconfont">&#xe6e7;</i><span>暂无模板</span></div>
          </div>
        </div>
        <div class="index-level">
          <div class="index-level-title xy-flex xy-between xy-center">
            <div><i class="iconfont">&#xe6f2;</i><span>一级指标</span></div>
          </div>
          <div class="index-level-content">
            <ul class="index-list">
              <li v-for="(item,index) in level1List"
                  :key="index"
                  :class="isId1===item.ActivityCourseTemplateTargetID?'active':''">
                <div class="box"
                     @click="level1Btn(item)">
                  <div class="index-point"></div>
                  <div class="index-name"
                       :title="item.ActivityCourseTemplateTargetName">{{item.ActivityCourseTemplateTargetName}}</div>
                </div>
              </li>
            </ul>
            <div v-if="isId1===-1"
                 class="null-index"><i class="iconfont">&#xe6e7;</i><span>暂无指标</span></div>
          </div>
        </div>
        <div class="index-level">
          <div class="index-level-title xy-flex xy-between xy-center">
            <div><i class="iconfont">&#xe6f2;</i><span>二级指标</span></div>
          </div>
          <div class="index-level-content">
            <ul class="index-list">
              <li v-for="item in level2List"
                  :key="item.ActivityCourseTemplateTargetID"
                  :class="isId2===item.ActivityCourseTemplateTargetID?'active':''">
                <div class="box"
                     @click="level2Btn(item)">
                  <div class="index-point"></div>
                  <div class="index-name"
                       :title="item.ActivityCourseTemplateTargetName">{{item.ActivityCourseTemplateTargetName}}</div>
                </div>
              </li>
            </ul>
            <div v-if="isId2===-1"
                 class="null-index"><i class="iconfont">&#xe6e7;</i><span>暂无指标</span></div>
          </div>
        </div>
        <div class="index-level">
          <div class="index-level-title xy-flex xy-between xy-center">
            <div><i class="iconfont">&#xe6f2;</i><span>三级指标</span></div>
          </div>
          <div class="index-level-content">
            <ul class="index-list">
              <li v-for="(item,index) in level3List"
                  :key="index">
                <div class="box">
                  <div class="index-point"></div>
                  <div class="index-name"
                       :title="item.ActivityCourseTemplateTargetName">{{item.ActivityCourseTemplateTargetName}}</div>
                </div>
              </li>
            </ul>
            <div v-if="level3List.length<1"
                 class="null-index"><i class="iconfont">&#xe6e7;</i><span>暂无指标</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'acMarkManagement',
    data () {
      return {
        activityTypeList: [], // 活动类型名称,第一列
        templateList: [],
        level1List: [],
        level2List: [],
        level3List: [],
        activityTypeId: -1,
        templateId: -1,
        isId1: -1,
        isId2: -1
        // isId3: -1
      }
    },
    created () {
      this.getLevelList()
    },
    methods: {
      async getLevelList () {
        this.level1List = []
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseTemplate/GetAllTemplateList`)
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            this.activityTypeList = res.data
            this.activityTypeId = this.activityTypeList[0].ActivityCourseTypeID
            if (this.activityTypeList[0].ActivityCourseTemplateTargetList.length > 0) {
              this.templateList = this.activityTypeList[0].ActivityCourseTemplateTargetList
              this.templateId = this.templateList[0].ActivityCourseTemplateID
              if (this.templateList[0].Childrens.length > 0) {
                this.level1List = this.templateList[0].Childrens
                this.isId1 = this.level1List[0].ActivityCourseTemplateTargetID
                if (this.level1List[0].Childrens.length > 0) {
                  this.level2List = this.level1List[0].Childrens
                  this.isId2 = this.level2List[0].ActivityCourseTemplateTargetID
                  if (this.level2List[0].Childrens.length > 0) {
                    this.level3List = this.level2List[0].Childrens
                    // this.isId3 = this.level3List[0].ActivityCourseTemplateTargetID
                  }
                }
              }
            }
          }
        }
      },
      changeActivityType (val) {
        this.activityTypeId = val.ActivityCourseTypeID
        if (val.ActivityCourseTemplateTargetList.length > 0) { // 活动类型
          this.templateList = val.ActivityCourseTemplateTargetList
          this.templateId = this.templateList[0].ActivityCourseTemplateID
          if (this.templateList[0].Childrens.length > 0) {
            this.level1List = this.templateList[0].Childrens
            this.isId1 = this.level1List[0].ActivityCourseTemplateTargetID
            if (this.level1List[0].Childrens.length > 0) {
              this.level2List = this.level1List[0].Childrens
              this.isId2 = this.level2List[0].ActivityCourseTemplateTargetID
              if (this.level2List[0].Childrens.length > 0) {
                this.level3List = this.level2List[0].Childrens
              } else {
                this.level3List = []
              }
            } else {
              this.level2List = []
              this.isId2 = -1
              this.level3List = []
            }
          } else {
            this.level1List = []
            this.isId1 = -1
            this.level2List = []
            this.isId2 = -1
            this.level3List = []
          }
        } else {
          this.activityTypeList = []
          this.activityTypeId = -1
          this.level1List = []
          this.isId1 = -1
          this.level2List = []
          this.isId2 = -1
          this.level3List = []
        }
      },
      changeTemplate (val) { // 模板
        this.templateId = val.ActivityCourseTemplateID
        if (val.Childrens.length > 0) {
          this.level1List = val.Childrens
          this.isId1 = this.level1List[0].ActivityCourseTemplateTargetID
          if (this.level1List[0].Childrens.length > 0) {
            this.level2List = this.level1List[0].Childrens
            this.isId2 = this.level2List[0].ActivityCourseTemplateTargetID
            if (this.level2List[0].Childrens.length > 0) {
              this.level3List = this.level2List[0].Childrens
            } else {
              this.level3List = []
            }
          } else {
            this.level2List = []
            this.isId2 = -1
            this.level3List = []
          }
        } else {
          this.level1List = []
          this.isId1 = -1
          this.level2List = []
          this.isId2 = -1
          this.level3List = []
        }
      },
      level1Btn (val) { // 单击1级指标
        this.isId1 = val.ActivityCourseTemplateTargetID
        if (val.Childrens.length > 0) {
          this.level2List = val.Childrens
          this.isId2 = this.level2List[0].ActivityCourseTemplateTargetID
          if (this.level2List[0].Childrens.length > 0) {
            this.level3List = this.level2List[0].Childrens
          }
        } else {
          this.level2List = []
          this.level3List = []
          this.isId2 = -1
        }
      },
      level2Btn (val) { // 单击2级指标
        this.isId2 = val.ActivityCourseTemplateTargetID
        if (val.Childrens.length > 0) {
          this.level3List = val.Childrens
        } else {
          this.level3List = []
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-title,
.xy-content-body {
  background: none;
}
.setting-wrap {
  background: #fff;
  .index-level {
    flex: 1;
    .index-level-title {
      border-right: 1px solid #fff;
      height: 40px;
      line-height: 40px;
      background: rgba(65, 150, 255, 1);
      color: #fff;
      padding: 0 20px 0px;
      span {
        margin-left: 10px;
      }
    }
    .index-level-content {
      min-height: 540px;
      max-height: 700px;
      overflow-y: auto;
      border-right: 1px solid #f4f5f7;
      .index-list {
        li {
          cursor: pointer;
          border-bottom: 1px solid #dadada;
          .box {
            margin: 0 30px;
            display: flex;
            align-items: center;
            height: 50px;
            .index-point {
              width: 10px;
              height: 10px;
              background: rgba(213, 213, 213, 1);
              border-radius: 5px;
              margin-right: 10px;
            }
            .index-name {
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 230px;
            }
            .index-btn {
              visibility: hidden;
              i:nth-child(2) {
                margin-left: 30px;
              }
            }
          }
          .box:hover {
            .index-btn {
              visibility: visible;
              i:hover {
                color: #0877ff;
              }
            }
          }
        }
        li.active {
          background: #e7f2ff;
          .box {
            border: none;
            .index-point {
              background: #4196ff;
            }
            .index-name {
              color: #4196ff;
            }
          }
        }
      }
      .null-index {
        margin-top: 150px;
        text-align: center;
        color: rgba(0, 0, 0, 0.25);
        i {
          font-size: 18px;
        }
        span {
          font-size: 16px;
          margin-left: 10px;
        }
      }
    }
    .index-level-content.shadow {
      box-shadow: 0px 2px 19px 0px rgba(147, 147, 147, 0.5);
    }
  }
}
</style>
