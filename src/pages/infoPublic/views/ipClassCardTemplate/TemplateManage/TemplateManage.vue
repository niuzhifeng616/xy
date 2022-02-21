<template>
  <div>
    <!-- 模板管理 // 缺少面包屑 -->
    <div class="xy-content-title clearfix">
      <div class="fl">
        <dropdown
          @on-click="addTemplate"
          trigger="click">
          <Button type="primary">
            添加模板
            <icon type="ios-arrow-down"/>
          </Button>
          <dropdown-menu slot="list">
            <dropdown-item name="horizontal">横版</dropdown-item>
            <dropdown-item name="vertical">竖版</dropdown-item>
          </dropdown-menu>
        </dropdown>
      </div>
      <div class="fr">
        <i-input
          search
          v-model="searchName"
          @on-search="FromSubmit"
          placeholder="请输入模板名称"
          class="fr xy-content-title-search"
          style="width: auto;">
          <icon type="ios-search cursor-p"
            slot="suffix" />
        </i-input>
      </div>
      <div class="text-center">
        <ButtonGroup>
            <Button :type="horizontal" @click="changeTypeH(horizontal)">
                横版
            </Button>
            <Button :type="vertical" @click="changeTypeV(vertical)">
                竖版
            </Button>
        </ButtonGroup>
      </div>
    </div>
    <div class="xy-content-body pr">
      <!--初始loading-->
      <div
        v-if="isInitial"
        class="no-data-box isInitital-opacity"
        v-cloak>
        <img class="no-data-img" src="@/assets/common/loading.png" />
      </div>
      <!--暂无数据-->
      <div
        v-if="isEmpty && !isInitial"
        class="no-data-box"
        v-cloak>
        <img class="no-data-img" src="@/assets/common/nullData.svg" />
        <span class="no-data-text">
          暂无模板
        </span>
      </div>
      <div
        v-if="!isEmpty && !isInitial"
        class="xy-content-table clearfix"
        v-cloak>
        <div class="tem-list-flex">
          <div v-for="(item,index) in templateList" :key="index" class="template-content pr" v-cloak
            :class="item.ScreenMode === 0 ? 'template-content-h' : 'template-content-v'">
            <div v-if="item.TemplateThumbnail != null && item.TemplateThumbnail.length > 0" class="template-img-yes"
              :class="item.ScreenMode === 0 ? 'template-img-yes-h' : 'template-img-yes-v'">
              <img :src="item.TemplateThumbnail" style="width:100%;height:100%;display:block;border-radius:4px;" />
            </div>
            <!-- <div v-if="item.TemplateThumbnail != null && item.TemplateThumbnail.length > 0"
              class="template-img-no pr"
              :class="item.ScreenMode === 0 ? 'template-img-no-h' : 'template-img-no-v'"
              :style="{backgroundImage:'url('+ bgimage +')',backgroundSize:'cover'}">
              <div>
                <img :src="require('@/assets/common/infoPublic/icon.png')" />
              </div>
            </div> -->
            <div v-else
              class="template-img-no pr"
              :class="item.ScreenMode === 0 ? 'template-img-no-h' : 'template-img-no-v'"
              :style="{backgroundImage:'url('+ bgimage +')',backgroundSize:'cover'}">
              <div>
                <img :src="require('@/assets/common/infoPublic/icon.png')" />
              </div>
            </div>
            <div :class="item.ScreenMode === 1 ? 'template-v-position' : ''">
              <div
                class="clearfix"
                style="margin:10px 10px 5px">
                <div
                  class="fl nowrap template-name"
                  :title="item.TemplateName"
                  v-cloak>
                  {{ item.TemplateName }}
                </div>
                <div class="fr">
                  <Button type="info"
                    size="small"
                    :ghost="item.ScreenMode === 1"
                    @click="editTemplate(item)">{{ item.ShowModeType > 1 ? "编辑" : "查看" }}</Button>
                </div>
              </div>
              <div
                class="template-describe nowrap"
                v-cloak
                :title="item.TemplateDescribe">
                {{ item.TemplateDescribe }}
              </div>
            </div>
            <div
              v-if="item.ShowModeType == 99"
              class="del-template"
              @click="delTemplate(item)">
              <!-- <i class="fa fa-close"></i> -->
              <i class="iconfont" style="transform: rotate(45deg); display: block;">&#xe6a2;</i>
            </div>
          </div>
        </div>
        <div
          class="text-right"
          style="margin-top:50px;">
          <page
            :total="total"
            :page-size="pageSize"
            :current="pageCurrent"
            :page-size-opts="pages"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></page>
        </div>
      </div>
      <modal
        v-model="templateModal"
        v-cloak
        :transfer="false"
        title="温馨提示"
        :mask-closable="false"
      >
        <div class="dialog-model-content">
          <p class="f14">
            此模板正在被模式使用中，若想删除此模板，请先从相应模式中减去此模板。
          </p>
        </div>
        <div slot="footer">
          <Button class="xy-modal-primary"
            @click="cancelModal"
          >我知道了</Button>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  window.jQuery = $
  export default {
    name: 'TemplateManage',
    data () {
      return {
        bgimage: require('@/assets/common/infoPublic/classCard/df.png'),
        templateModal: false,
        temType: 0,
        horizontal: 'primary',
        vertical: 'default',
        noUrl: '',
        loading: true,
        searchName: '',
        total: 0, // 总条数
        pageSize: 8,
        pages: [8, 15, 20],
        pageCurrent: 1, // 当前页码
        pageList: 0, // 当前页数据条数
        isInitial: true, // 页面加载loading
        isEmpty: false, // 数据是否为空
        templateList: [],
        formValidate: {
          tempalteName: '',
          templateDescribe: ''
        },
        ruleValidate: {
          tempalteName: [
            { required: true, message: '模板名称不能为空', trigger: 'blur' }
          ],
          templateDescribe: [
            { required: true, message: '模板简介不能为空', trigger: 'blur' }
          ]
        },
        applications: '',
        breadcrumbIDs: 0,
        breadcrumbNames: '',
        apiPath: '',
        types: ''
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.applications = this.$store.state.infoPublic.applications
      this.breadcrumbIDs = this.$store.state.infoPublic.breadcrumbIDs
      this.breadcrumbNames = this.$store.state.infoPublic.breadcrumbNames
      this.types = this.$store.state.infoPublic.types
      if (this.types === 1) {
        this.changeTypeV()
      } else {
        this.changeTypeH()
      }
    },
    mounted () {},
    methods: {
      // this.xy.loading()
      //       let res = await this.xy.get(
      //         `${this.$store.state.apiPath}/api/Template/GetPage`
      //       )
      //       this.xy.unloading()
      //       if (res.success) {
      //       } else {
      //       }
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      // 横版
      changeTypeH () {
        this.horizontal = 'primary'
        this.vertical = 'default'
        this.temType = 0
        this.pageCurrent = 1
        this.getTemplate(0)
      },
      // 竖版
      changeTypeV () {
        this.vertical = 'primary'
        this.horizontal = 'default'
        this.temType = 1
        this.pageCurrent = 1
        this.getTemplate(1)
      },
      // 获取列表数据
      async getTemplate (types) {
        this.xy.loading()
        let res = await this.xy.get(
          // `${this.$store.state.apiPath}/api/Template/GetPage`,
          this.apiPath + `/api/Template/GetPage`,
          {
            type: types,
            PageIndex: this.pageCurrent,
            PageSize: this.pageSize,
            keyword: this.searchName
          }
        )
        this.xy.unloading()

        this.isInitial = false
        if (res.success) {
          if (res.data.data.length > 0) {
            this.templateList = res.data.data
            this.pageList = res.data.data.length
            this.total = res.data.totalRecords
            this.isEmpty = false
          } else {
            this.isEmpty = true
          }
        } else {
          this.isEmpty = true
        }
      },
      // 单击页码触发
      changePage (current) {
        this.pageCurrent = current
        this.getTemplate(this.temType)
      },
      // 单击切换每页展示条数触发
      changePageSize (size) {
        this.pageSize = size
        if (this.pageCurrent === 1) {
          this.getTemplate(this.temType)
        } else {
          this.pageCurrent = 1
        }
      },
      FromSubmit () {
        if (this.pageCurrent === 1) {
          this.getTemplate(this.temType)
        } else {
          this.pageCurrent = 1
        }
      },
      // 创建
      addTemplate (type) {
        this.$store.commit('infoPublic/setapplications', this.applications)
        this.$store.commit('infoPublic/setbreadcrumbIDs', this.breadcrumbIDs)
        this.$store.commit('infoPublic/setbreadcrumbNames', this.breadcrumbNames)
        if (type === 'horizontal') {
          // 横版
          this.$store.commit('infoPublic/settypes', 0)
          this.$store.commit('common/getThreeMenuName', '添加横版模板')
          this.$router.push({
            path: '/xyHome/CreateHorizontal',
            query: this.$store.state.common.menuInfo
          })
        } else {
          // 竖版
          this.$store.commit('infoPublic/settypes', 1)
          this.$store.commit('common/getThreeMenuName', '添加竖版模板')
          this.$router.push({
            path: '/xyHome/CreateVertical',
            query: this.$store.state.common.menuInfo
          })
        }
      },
      // 编辑/查看
      editTemplate (item) {
        this.$store.commit('infoPublic/setapplications', this.applications)
        this.$store.commit('infoPublic/setbreadcrumbIDs', this.breadcrumbIDs)
        this.$store.commit('infoPublic/setbreadcrumbNames', this.breadcrumbNames)
        this.$store.commit('infoPublic/setitem', item)
        if (this.temType === 0) {
          // 横版
          this.$store.commit('infoPublic/settypes', 0)
          this.$store.commit('common/getThreeMenuName', '编辑横版模板')
          this.$router.push({
            path: '/xyHome/EditHorizontal',
            query: this.$store.state.common.menuInfo
          })
        } else {
          // 竖版
          this.$store.commit('infoPublic/settypes', 1)
          this.$store.commit('common/getThreeMenuName', '编辑竖版模板')
          this.$router.push({
            path: '/xyHome/EditVertical',
            query: this.$store.state.common.menuInfo
          })
        }
      },
      // 删除
      async delTemplate (vals) {
        let _this = this
        // this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/Template/VerifyIsCanDel`,
          {
            templateId: vals.TemplateID
          },
          true
        )
        this.xy.unloading()
        if (res.success) {
          this.$Modal.confirm({
            title: '删除',
            content: '<p>您确认要删除此模板吗？</p>',
            onOk: function () {
              _this.xy.get(
                _this.apiPath + `/api/Template/DeleteTemplate?templateId=` + vals.TemplateID).then(res => {
                if (res.success) {
                  _this.xy.msgSuc('删除成功。')
                  if (_this.pageList === 1 && _this.pageCurrent > 1) {
                    _this.pageCurrent = _this.pageCurrent - 1
                  }
                  if (_this.temType === 0) {
                    _this.getTemplate(0)
                  } else {
                    _this.getTemplate(1)
                  }
                } else {
                  // _this.xy.msgError(res.msg)
                  _this.templateModal = true
                }
                _this.xy.unloading()
              })
            }
          })
        } else {
          console.log(res)
          // this.xy.msgError(res.msg)
          this.templateModal = true
        }
      },
      cancelModal () {
        this.templateModal = false
      }
    }
  }
</script>
<style scoped>
.tem-list-flex {
    min-height: 600px;
    display: flex;
    flex-wrap: wrap;
    margin-left: 38px;
}

.template-content {
    margin: 30px 40px;
    box-shadow: 0px 2px 8px 0px rgba(12,30,59,0.15);
    border-radius: 4px;
}

.template-content-h {
    width: 330px;
    height: 234px;
}

.template-content-v {
    width: 240px;
    height: 340px;
}

.template-img-yes {
    width: 100%;
}

.template-img-no {
    width: 100%;
    text-align: center;
    border-radius: 4px;
}

.template-img-yes-h,
.template-img-no-h {
    height: 166px;
}

.template-img-yes-v,
.template-img-no-v {
    height: 340px;
}

.template-img-no-h {
    padding-top: 38px;
}

.template-img-no-v {
    padding-top: 100px;
}

.template-img-no > div,
.template-img-yes > div {
    width: 80px;
    height: 80px;
    line-height: 80px;
    border-radius: 50%;
    background: #fff;
    margin: 0 auto;
}

.template-img-no > div > img,
.template-img-yes > div > img {
    width: 40px;
}

.template-name {
    font-size: 18px;
    color: #444;
}

.template-describe {
    color: #7f7f7f;
    margin: 0px 10px;
}

.box-list {
    width: 200px;
    height: 100px;
    background: #eee;
    border-left: 1px solid #ccc;
    border-top: 1px solid #ccc;
}
/*横板*/
.tamplet-box-container {
    min-height: 200px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
}

#tamplateble {
    position: relative;
    padding: 10px;
    border-radius: 6px;
    background-repeat: no-repeat;
    background-size: cover;
}

#templateModule >>> .hover-template > .del-template-img{
    position: absolute;
    right: 9px;
    top: 5px;
    color: rgba(0,0,0,0.5);
    border-radius: 50%;
    font-size: 20px;
    display: inline-block;
    display: none;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 30px;
    cursor: pointer;
}

#templateModule >>> .hover-template:hover > .del-template-img {
    display: block;
}

.tamplate-module {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.xy-drag-box {
    display: inline-block;
    width: calc(25% - 20px);
    height: 0;
    padding-bottom: calc((22% - 20px) * 0.33 + 10px);
    padding-top: calc((22% - 20px) * 0.33 - 10px);
    background: #fff;
    margin: 10px;
    border-radius: 6px;
    text-align: center;
    font-size: 20px;
    color: #ccc;
}

.grid-lay-none {
    background: transparent !important;
    color: transparent;
}

.tamplate-box-left {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    padding: 10px 0px;
}

.tamplate-box-right {
    position: relative;
    width: calc(342px);
    height: 100%;
    padding: 15px;
}

.dragbox {
    height: 640px;
    overflow-y: auto;
    border: 1px solid #eee;
    margin-left: 10px;
}

.dragbox-title,
.dragebox-template {
    padding: 10px;
}

.dragbox-template-size {
    bottom: 2px;
    padding-left: 8px;
    background: rgba(0,0,0,0.4);
    color: #fff;
    font-weight: 700;
    border-radius: 6px;
}

.dragbox-template-size-1 {
    width: 50%;
}

.dragbox-template-size-2,
.dragbox-template-size-3,
.dragbox-template-size-4,
.dragbox-template-size-5 {
    width: 100%;
}

.dragbox-template-img-size-1 {
    width: 50%;
}

.dragbox-template-img-size-2,
.dragbox-template-img-size-3,
.dragbox-template-img-size-4,
.dragbox-template-img-size-5{
    width: 100%;
}

.dragbox-template-img-size-4 {
    height: 180px;
}

.dragbox-1,
.dragbox-2,
.dragbox-3,
.dragbox-4,
.dragbox-5 {
    padding: 10px;
}

/*竖版*/
.template-v-position {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 66px;
    border-radius: 0 0 4px 4px;
    background: rgba(0, 13, 29,0.8);
}

.template-v-position .template-name {
    font-size: 16px;
    color: #fff;
}

.template-v-position .template-describe {
    color: #8698af;
}

.tamplet-box-container-vertical {
    display: flex;
    margin: 20px auto 0;
    width: 1140px;
    padding: 10px;
    position: relative;
    background: rgba(65, 150, 255,0.1);
    border-radius: 8px;
}

.tamplet-box-container-vertical-disabled {
    width: 720px !important;
}

.tamplate-table-vertical {
    position: relative;
    padding: 10px;
    border-radius: 6px;
    background-repeat: no-repeat;
    background-size: cover;
    width: 700px;
}

.tamplate-module-vertical {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
}

.xy-drag-box-vertical {
    display: inline-block;
    width: calc(33% - 18px);
    height: 260px;
    line-height: 260px;
    background: #fff;
    margin: 10px;
    border-radius: 6px;
    text-align: center;
    font-size: 20px;
    color: #ccc;
}

.grid-lay-none-vertical {
    background: transparent !important;
    color: transparent;
}

.tamplate-box-left-vertical {
    padding: 10px 0px;
}

.tamplate-box-right-vertical {
    width: 400px;
    position: absolute;
    top: 20px;
    right: 10px;
    bottom: 20px;
    overflow-y: auto;
}

.dragbox-vertical {
    background: #fff;
    padding: 10px;
    border-radius: 8px;
}

.dragbox-title-vertical,
.dragebox-template-vertical {
    padding: 10px;
}

.dragbox-template-size-vertical {
    bottom: 3px;
    padding-left: 8px;
    background: rgba(0,0,0,0.4);
    color: #fff;
    font-weight: 700;
    border-radius: 6px;
}

.dragbox-template-size-1-vertical {
    width: 50%;
}

.dragbox-template-size-2-vertical,
.dragbox-template-size-3-vertical,
.dragbox-template-size-4-vertical,
.dragbox-template-size-5-vertical,
.dragbox-template-size-6-vertical {
    width: 100%;
}

.dragbox-template-img-size-1-vertical {
    width: 50%;
}

.dragbox-template-img-size-2-vertical,
.dragbox-template-img-size-3-vertical,
.dragbox-template-img-size-4-vertical,
.dragbox-template-img-size-5-vertical,
.dragbox-template-img-size-6-vertical {
    width: 100%;
}

.dragbox-template-img-size-4-vertical {
    height: 300px;
}

.dragbox-1-vertical,
.dragbox-2-vertical,
.dragbox-3-vertical,
.dragbox-4-vertical,
.dragbox-5-vertical,
.dragbox-6-vertical {
    padding: 10px;
}

.del-template-img-vertical {
  position: absolute;
  right: 9px;
  top: 5px;
  color: #fff;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  font-size: 20px;
  display: inline-block;
  display: none;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
}

.hover-template-vertical:hover .del-template-img-vertical {
    display: block;
}

.del-template {
  display:none;
  position: absolute;
  right: 9px;
  top: 5px;
  color: #fff;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  font-size: 20px;
  /*display: none;*/
  width: 36px;
  height: 36px;
  text-align: center;
  line-height: 35px;
  cursor: pointer;
}
.template-content:hover .del-template{
  display:block;
}
/*模式*/
.pattern-content {
  min-height: 200px;
  border: 1px solid #ddd;
  width: 1260px;
  margin: 0 auto 30px;
}

.pattern-content-title {
  font-size: 18px;
  background: rgba(65, 150, 255,0.1);
  padding: 10px;
  font-weight: 700;
}

.pattern-create-list {
    margin: 0 20px 20px 0px;
}

.create-h-pattern-List {
  width: 300px;
  height: 200px;
  box-shadow: 0px 2px 8px 0px rgba(12,30,59,0.15);
  border-radius: 4px;
}

.create-h-pattern-List-img {
    width: 100%;
    height: 150px;
}

.create-h-pattern-List-img > img {
    width: 100%;
    height: 100%;
}

.create-h-pattern-List-img-no {
    text-align: center;
    padding-top: 30px;
    width: 100%;
    height: 150px;
    border-radius:4px;
}

.create-h-pattern-List-img-no > div {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    line-height: 80px;
    margin: 0 auto;
    background: #fff;
}

.create-h-pattern-List-img-no > div > img {
    width: 40px;
}

.pattern-template-name {
    font-size: 18px;
    margin-top: 11px;
    width: 100%;
    padding: 0px 10px;
}

.pattern-h-checked-mark {
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    border-radius: 4px;
}

.pattern-h-checked-mark .h-icons {
    margin-top: 46px;
}

.pattern-custom-btn {
    cursor: pointer;
    color: #4196ff;
    margin-right: 15px;
    font-size: 14px;
}

.pattern-custom-del-btn {
    cursor: pointer;
    color: #ff8c8c;
    font-size: 14px;
}

.create-v-pattern-List {
    width: 240px;
    height: 340px;
    box-shadow: 0px 2px 8px 0px rgba(12,30,59,0.15);
    border-radius: 4px;
}

.create-v-pattern-List-img-yes {
    width: 100%;
    height: 100%;
}

.create-v-pattern-List-img-no {
    text-align: center;
    padding-top: 80px;
    width: 100%;
    height: 100%;
    border-radius: 4px;
}

.create-v-pattern-List-img-no > div {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  line-height: 80px;
  margin: 0 auto;
  background: #fff;
}

.create-v-pattern-List-img-no > div > img {
  width: 40px;
}

.pattern-v-checked-mark {
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    border-radius: 4px;
    z-index: 1;
}

.pattern-v-checked-mark .v-icons {
  margin-top: 120px;
}

.pattern-template-v-name {
  bottom: 0px;
  width: 100%;
  line-height: 50px;
  font-size: 16px;
  color: #fff;
  background: rgba(0,0,0,0.3);
  border-radius: 0 0 4px 4px;
  padding: 0px 10px;
}

.pattern-setting-time-content {
    margin: 20px 0px;
}

.pattern-setting-time-type {
    cursor: pointer;
    margin-bottom: 10px;
}

.pattern-setting-time-icon {
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    border-radius: 2px;
    border: 1px solid #ccc;
    margin-top: 2px;
    margin-right: 5px;
}

.pattern-checked-icon {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background: #4196ff;
}

.pattern-setting-content-time-list {
    margin-left: 25px;
}

@media (min-width:1366px) and (max-width:1440px) {
  .pattern-setting-content-time-list {
      max-height: 200px;
      overflow-y: auto;
  }
}

@media (min-width:1441px) and (max-width:1920px) {
  .pattern-setting-content-time-list {
      max-height: 500px;
      overflow-y: auto;
  }
}

.pattern-setting-content-time-list-content {
    margin-bottom: 10px;
}

.pattern-setting-time-explain {
    color: #7f7f7f;
    margin-left: 10px;
    font-size: 12px;
    margin-top: 2px;
}

.pattern-setting-time-btn-null {
    width: 26px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    font-size: 16px;
    border-radius: 50%;
    margin: 3px 10px 0px;
    background: #eee;
    color: #ccc;
}

.pattern-setting-time-btn {
    width: 26px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    font-size: 16px;
    border-radius: 50%;
    margin: 3px 10px 0px;
    cursor: pointer;
}

.pattern-setting-time-btn-add {
    background: rgba(65, 150, 255,0.3);
    color: #4196ff;
}

.pattern-setting-time-btn-del {
    background: rgba(255, 140, 140,0.3);
    color: #FF8C8C;
}

.skin-flex-h,
.skin-flex-v {
    display: flex;
    flex-wrap: wrap;
}

.skin-list-h {
    width: 25%;
    margin: 10px 0;
}

.skin-list-h > .skin-list-h-img {
    width: 200px;
    height: 100px;
}
.skin-list-h > .skin-list-h-img > img.skin-imgs {
    width: 100%;
    height: 100%;
}
.skin-list-h > p {
    margin-top: 10px;
    text-align: center;
    font-size: 14px;
}

.skin-list-h > div.null {
    width: 200px;
    text-align: center;
    height: 100px;
    padding-top: 10px;
    border: 1px solid #eee;
    border-radius: 4px;
    font-size: 14px;
    color: #7f7f7f;
}
.skin-list-h.active div.skin-mark {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    line-height: 100px;
    background: rgba(0,0,0,0.6);
}
.skin-list-v {
    width: 20%;
    margin: 10px;
}
.skin-list-v > .skin-list-v-img {
    width: 100%;
}
.skin-list-v > .skin-list-v-img > img.skin-imgs {
    width: 100%;
    height: 100%;
}
.skin-list-v > p {
    margin-top: 10px;
    text-align: center;
    font-size: 14px;
}

.skin-list-v > div.null {
    width: 170px;
    text-align: center;
    height: 301.5px;
    padding-top: 68px;
    border: 1px solid #eee;
    border-radius: 4px;
    font-size: 14px;
    color: #7f7f7f;
}

.skin-list-v.active div.skin-mark {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    line-height: 300px;
    background: rgba(0,0,0,0.6);
}
.ivu-btn-info {
    color: #fff;
    background-color: #2db7f5;
    border-color: #2db7f5;
}
</style>
