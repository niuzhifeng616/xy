<template>
  <div>
    <!-- 模式管理 // 缺少面包屑 -->
    <div class="xy-content-title">
        <div class="fl">
            <dropdown @on-click="addPattern" trigger="click">
                <i-button type="primary">
                    添加模式
                    <icon type="ios-arrow-down"></icon>
                </i-button>
                <dropdown-menu slot="list">
                    <dropdown-item name="horizontal">横版</dropdown-item>
                    <dropdown-item name="vertical">竖版</dropdown-item>
                </dropdown-menu>
            </dropdown>
        </div>
        <div class="fr">
            <i-input search
                     v-model="searchName"
                     @on-search="FromSubmit"
                     placeholder="请输入模式名称"
                     class="fr xy-content-title-search"
                     style="width: auto;">
                <icon type="ios-search cursor-p" slot="suffix" />
            </i-input>
        </div>
        <div class="text-center">
            <button-group size="large">
                <i-button v-bind:type='horizontal' @click='changeTypeH(0)'>横版</i-button>
                <i-button v-bind:type='vertical' @click='changeTypeV(1)'>竖版</i-button>
            </button-group>
        </div>
    </div>
    <div class="xy-content-body pr">
        <!--初始loading-->
        <div v-if="isInitial" class="no-data-box isInitital-opacity" v-cloak>
            <img class="no-data-img" src="@/assets/common/loading.png" />
        </div>
        <!--暂无数据-->
        <div v-if="isEmpty && !isInitial" class="no-data-box" v-cloak>
            <img class="no-data-img" src="@/assets/common/nullData.svg" />
            <span class="no-data-text">
                暂无模式
            </span>
        </div>
        <div v-if="!isEmpty && !isInitial" class="xy-content-table">
            <div class="clearfix" style="padding:20px;">
                <div v-for="(item, index) in patternList" v-cloak class="pattern-content" v-bind:key="index">
                    <div class="pattern-content-title clearfix">
                        <div class="fl">
                            <span v-cloak>{{item.ShowModeName}}</span>

                            <tooltip v-if="item.ShowModeType<3" content="指日常教学周显示的模式" placement="bottom" style="margin-right:20px;">
                                <Icon type="md-help-circle" size="18" color="#ffad33" />
                            </tooltip>
                            <i-button type="primary" shape="circle" size="small" @click="applicationClassCard(item)">应用到班牌</i-button>
                        </div>
                        <div class="fr" v-if="item.ShowModeType==99">
                            <span class="pattern-custom-btn" @click="settingTime(item)">设置显示时间</span>
                            <span class="pattern-custom-btn" @click="editCustom(item)">编辑</span>
                            <span class="pattern-custom-del-btn" @click="delCustom(item.ShowModeID)">删除</span>
                        </div>
                        <!--<div class="fr" v-else style="font-weight: normal;font-size: 14px;">
                            <span>显示时间:</span>
                            <span>details.DisplayType==0?'指上课和上课前的小课间时长':'只要没有其他模板显示时，都会是这个模板</span>
                        </div>-->
                    </div>
                    <ul class="clearfix">
                        <li v-for="(details, index) in item.TemplateModelS" v-bind:key="index" class="fl template-content pr" v-cloak v-bind:class="item.ScreenMode===0?'template-content-h':'template-content-v'">
                            <div v-if="details.TemplateThumbnail!=null && details.TemplateThumbnail.length>0" class="template-img-yes" v-bind:class="item.ScreenMode===0?'template-img-yes-h':'template-img-yes-v'">
                                <img v-bind:src="details.TemplateThumbnail+'?'+new Date().getTime()"
                                    style="width:100%;height:100%;display:block;border-radius:4px;" />
                            </div>
                            <div v-else
                                class="template-img-no"
                                v-bind:style="{backgroundImage:'url('+bgimage+')',backgroundSize:'cover'}"
                                v-bind:class="item.ScreenMode===0?'template-img-no-h':'template-img-no-v'">
                                <div>
                                    <img v-bind:src="require('@/assets/common/infoPublic/icon.png')" />
                                </div>
                            </div>
                            <div v-bind:class="item.ScreenMode===1?'template-v-position':''">
                                <div class="clearfix" style="margin:10px 10px 5px">
                                    <div class="fl nowrap template-name" v-bind:title="details.TemplateName" v-cloak>{{details.TemplateName}}</div>
                                </div>
                                <div class="template-describe nowrap" v-cloak v-bind:title="details.TemplateDescribe">
                                    <span>{{details.TemplateDescribe}}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <modal v-model="patternModal"
              v-cloak
              :styles="{top:'20px',width:'1000px'}"
              :transfer="false"
              title="应用到指定班牌"
              :loading="loading"
              :mask-closable="false"
              :closable="false">
            <row>
                <i-col span="6" style="height: 352px;overflow:auto;">
                    <tree :data="getTreeList" @on-select-change="selectTree"></tree>
                </i-col>
                <i-col span="9" style="height: 352px;overflow:auto;padding:0px 10px;border-left: 1px solid #eee;border-right: 1px solid #eee;">
                    <div>
                        <checkbox v-for="(item, index) in tremianlArr" v-bind:key="index" size="large" v-model="item.checked" @on-change="changeCheckbox(item)" v-bind:disabled="screenModes!==item.ScreenMode">{{item.ClassTerminalName}}({{item.ScreenMode==0?'横':'竖'}})</checkbox>
                    </div>
                </i-col>
                <i-col span="9" style="padding:0px 10px;">
                    <div style="padding-bottom:10px;margin-bottom: 5px;border-bottom:1px solid #eee;">已选<b>{{classTerminalIDs.length}}</b>个班牌</div>
                    <div>
                        <tag type="border" color="primary" v-for="(item, index) in classTerminalIDs" v-bind:key="index" :name="item.ClassTerminalId" closable @on-close="handleClose">{{item.ClassTerminalName}}</tag>
                    </div>
                </i-col>
            </row>
            <div slot="footer">
              <Button class="xy-modal-close" @click="patternCancel">取消</Button>
              <Button class="xy-modal-primary" shape="circle" @click="patternOk">确定</Button>
            </div>
        </modal>
        <modal v-model="HPatternCreate"
              v-cloak
              v-bind:styles="{top:'20px',width:'1000px'}"
              v-bind:transfer="false"
              title="横版模式"
              v-bind:loading="loading"
              v-bind:mask-closable="false"
              v-bind:closable="false"
              @on-ok="hPatternOk"
              @on-cancel="hPatternCancel">
            <div>
                <div class="clearfix">
                    <div class="fl">
                        <span>模式名称</span>
                        <Input v-model="hPatternName" style="width:300px;" :maxlength="15" />
                    </div>
                    <div class="xy-content-title-search fl">
                        <span>皮肤</span>
                        <i-select v-model="styleCode"
                                  style="width:150px;"
                                  @on-change="changeSkin">
                            <i-option v-for="item in skinList" v-bind:value="item.StyleCode" v-bind:key="item.StyleID">{{item.StyleName}}</i-option>
                        </i-select>
                    </div>
                    <div class="fr">
                        <i-input search
                                v-model="hSearchName"
                                @on-search="hFromSubmit"
                                placeholder="请输入模板名称"
                                class="fr xy-content-title-search"
                                style="width: auto;">
                            <icon type="ios-search cursor-p" slot="suffix" />
                        </i-input>
                    </div>
                </div>
                <div class="title-describe mt-10">模式中只能有一种皮肤模板，如选择多种皮肤，则只会保存最后选择的皮肤所对应的模板。</div>
                <div>
                    <ul class="clearfix">
                      <template v-for="(item, index) in HList">
                        <li :key="index"
                            class="fl pattern-create-list pr"
                            @click="checkedHItem(item)"
                            v-if="item.hShow">
                            <div class="create-h-pattern-List cursor-p">
                                <div v-if="item.TemplateThumbnail!=null && item.TemplateThumbnail.length>0" class="create-h-pattern-List-img">
                                    <img v-bind:src="item.TemplateThumbnail+'?'+new Date().getTime()" style="width:100%;height:100%;display:block;border-radius:4px;" />
                                </div>
                                <div v-else class="create-h-pattern-List-img-no pr" v-bind:style="{backgroundImage:'url('+bgimage+')',backgroundSize:'cover'}">
                                    <div>
                                        <img v-bind:src="require('@/assets/common/infoPublic/icon.png')" />
                                    </div>
                                </div>
                                <div class="nowrap pattern-template-name" v-bind:title="item.TemplateName" v-cloak>{{item.TemplateName}}</div>
                            </div>
                            <div class="pattern-h-checked-mark cursor-p" v-if="item.checked">
                                <Icon type="md-checkmark-circle-outline h-icons" size="80" color="#fff"></Icon>
                            </div>
                        </li>
                      </template>
                    </ul>
                </div>
            </div>
        </modal>
        <modal v-model="VPatternCreate"
               v-cloak
               v-bind:styles="{top:'20px',width:'1000px'}"
               v-bind:transfer="false"
               title="竖板模式"
               v-bind:loading="loading"
               v-bind:mask-closable="false"
               v-bind:closable="false"
               @on-ok="vPatternOk"
               @on-cancel="vPatternCancel">
            <div>
                <div class="clearfix">
                    <div class="fl">
                        <span>模式名称</span>
                        <Input v-model.trim="vPatternName" style="width:300px;" :maxlength="15" />
                    </div>
                    <div class="xy-content-title-search fl">
                        <span>皮肤</span>
                        <i-select style="width:150px;"
                                  v-model="styleCode"
                                  @on-change="changeSkin">
                            <i-option v-for="(item, index) in skinList" v-bind:key="index" v-bind:value="item.StyleCode">{{item.StyleName}}</i-option>
                        </i-select>
                    </div>
                    <div class="fr">
                        <i-input search
                                v-model="vSearchName"
                                @on-search="vFromSubmit"
                                placeholder="请输入模板名称"
                                class="fr xy-content-title-search"
                                style="width: auto;">
                            <icon type="ios-search cursor-p" slot="suffix" />
                        </i-input>
                    </div>
                </div>
                <div class="title-describe mt-10">模式中只能有一种皮肤模板，如选择多种皮肤，则只会保存最后选择的皮肤所对应的模板。</div>
                <div>
                    <ul class="clearfix">
                        <li v-for="(item, index) in VList"
                            v-bind:key='index'
                            class="fl pattern-create-list"
                            @click="checkedVItem(item)">
                            <div v-if="item.vShow" class="create-v-pattern-List cursor-p pr">
                                <div v-if="item.TemplateThumbnail!=null && item.TemplateThumbnail.length>0"
                                    class="create-v-pattern-List-img-yes">
                                    <img v-bind:src="item.TemplateThumbnail+'?'+new Date().getTime()" style="width:100%;height:100%;display:block;border-radius:4px;" />
                                </div>
                                <div v-else
                                    class="create-v-pattern-List-img-no"
                                    v-bind:style="{backgroundImage:'url('+bgimage+')',backgroundSize:'cover'}">
                                    <div>
                                        <img v-bind:src="require('@/assets/common/infoPublic/icon.png')" />
                                    </div>
                                </div>
                                <div class="nowrap pattern-template-v-name pa" v-bind:title="item.TemplateName" v-cloak>{{item.TemplateName}}</div>
                                <div class="pattern-v-checked-mark cursor-p" v-if="item.checked">
                                    <Icon type="md-checkmark-circle-outline v-icons" size="80" color="#fff"></Icon>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </modal>
        <modal
          v-model="SettingTimeModal"
          v-cloak
          v-bind:styles="{top:'20px',width:'700px'}"
          v-bind:transfer="false"
          title="设置显示时间"
          v-bind:loading="loading"
          v-bind:mask-closable="false"
          >
          <div>
            <div class="title-describe">设置各时间段显示的模板</div>
            <div class="pattern-setting-time-content">
                <div class="pattern-setting-time-type clearfix">
                    <div class="fl" @click="systemClick">
                        <div class="pattern-setting-time-icon fl" v-bind:style="{'borderColor':SystemTime.Checked?'#4196ff':'#ccc'}">
                            <i v-if="SystemTime.Checked" class="pattern-checked-icon"></i>
                        </div>
                        <div class="fl f14"><b>{{SystemTime.Name}}</b></div>
                    </div>
                    <div class="fl f14 pattern-setting-time-explain">注:{{SystemTime.Explain}}</div>
                </div>
                <div class="pattern-setting-content-time-list">
                    <i-select v-model="systemtimeValue"
                              placeholder="请选择系统时间"
                              v-bind:disabled="!SystemTime.Checked"
                              style="width:200px;margin-right:10px;">
                        <i-option v-for="(item, index) in SystemTime.Times" v-bind:key='index' v-bind:value="item.Value">{{item.Text}}</i-option>
                    </i-select>
                    <i-select v-model="systemTemplate"
                              placeholder="请选择模板"
                              v-bind:disabled="!SystemTime.Checked"
                              style="width:200px;">
                        <i-option v-for="(item, index) in SystemTime.Templates" v-bind:key='index' v-bind:value="item.TemplateID">{{item.TemplateName}}</i-option>
                    </i-select>
                </div>
            </div>
            <div class="pattern-setting-time-content">
                <div class="pattern-setting-time-type clearfix">
                    <div class="fl" @click="customClick">
                        <div class="pattern-setting-time-icon fl" v-bind:style="{'borderColor':CustomTime.Checked?'#4196ff':'#ccc'}">
                            <i v-if="CustomTime.Checked" class="pattern-checked-icon"></i>
                        </div>
                        <div class="fl f14"><b>{{CustomTime.Name}}</b></div>
                    </div>
                </div>
                <div class="pattern-setting-content-time-list">
                    <div
                      v-for="(item,index) in CustomTime.TimeList"
                      v-bind:key='index'
                      class="clearfix pattern-setting-content-time-list-content"
                      >
                      <time-picker
                        v-model="item.Times"
                        v-bind:disabled="!CustomTime.Checked"
                        format="HH:mm"
                        type="timerange"
                        placement="bottom-end"
                        placeholder="开始时间-结束时间"
                        style="width: 168px;float:left;margin-right:10px;"
                        ></time-picker>
                        <i-select
                          v-model="item.TemplatesId"
                          placeholder="请选择模板"
                          style="width:200px;float:left;"
                          v-bind:disabled="!CustomTime.Checked"
                          >
                          <i-option
                            v-for="(child, index) in item.Templates"
                            :key='index'
                            :value="child.TemplateID"
                            >{{child.TemplateName}}</i-option>
                        </i-select>
                        <span v-if="CustomTime.Checked">
                          <span
                            class="fl pattern-setting-time-btn pattern-setting-time-btn-add"
                            @click="customAdd(index)"><i class="iconfont">&#xe6d1;</i></span>
                          <span
                            class="fl pattern-setting-time-btn pattern-setting-time-btn-del"
                            @click="customDel(index)"><i class="iconfont">&#xe6ce;</i></span>
                        </span>
                        <span v-else>
                          <span class="fl pattern-setting-time-btn-null"><i class="iconfont">&#xe6d1;</i></span>
                          <span class="fl pattern-setting-time-btn-null"><i class="iconfont">&#xe6ce;</i></span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="pattern-setting-time-content">
              <div class="pattern-setting-time-type clearfix">
                <div class="fl f14" style="margin-left: 24px;"><b>{{NullTime.Name}}</b></div>
                <div class="fl f14 pattern-setting-time-explain">注:{{NullTime.Explain}}</div>
              </div>
              <div class="pattern-setting-content-time-list">
                <i-select v-model="nullTimeTemplate" placeholder="请选择模板" style="width:200px;">
                  <i-option
                    v-for="(item, index) in NullTime.Templates"
                    :key='index'
                    :value="item.TemplateID"
                    >{{item.TemplateName}}</i-option>
                </i-select>
              </div>
            </div>
          </div>
          <div slot="footer">
            <Button class="xy-modal-close" @click="SettingTimeCancel">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="SettingTimeOk">确定</Button>
          </div>
        </modal>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  window.jQuery = $
  export default {
    name: 'PatternManage',
    data () {
      return {
        screenModes: 0,
        horizontal: 'primary',
        vertical: 'default',
        // bgimage: 'url(' + apiPath + '/Image/df.png)',
        // apiPath: xy.webUrl, // xy.serviceUrl,
        bgimage: require('@/assets/common/infoPublic/df.png'),
        tremianlArr: [],
        classTerminalIDs: [],
        saveDefaultdata: [],
        getTreeList: [
          {
            title: '全部分组',
            expand: true,
            ParentID: -1,
            ClassTerminalGroupID: 0,
            selected: true,
            TreminalS: [],
            children: []
          }
        ],
        patternModal: false,
        loading: true,
        isInitial: true, // 页面加载loading
        isEmpty: false, // 数据是否为空
        patternList: [],
        HPatternCreate: false,
        VPatternCreate: false,
        searchName: '',
        hPatternName: '',
        hSearchName: '',
        vPatternName: '',
        vSearchName: '',
        HList: [],
        VList: [],
        isEdit: false,
        ShowModeID: '',
        ShowModeType: '',
        SettingTimeModal: false,
        SystemTime: {
          Checked: false,
          Name: '系统时间显示的模板',
          Explain: '系统内置的时间，显示的优先级最高',
          Times: [],
          Templates: []
        },
        CustomTime: {
          Checked: false,
          Name: '自定义时间显示的模板',
          TimeList: [{
            Times: [],
            TemplatesId: '',
            Templates: []
          }]
        },
        NullTime: {
          Name: '缺省时间显示的模板（必选）',
          Explain: '只要没有其他模板显示时，都会显示这个模板',
          Templates: []
        },
        nullTimeTemplate: '',
        systemtimeValue: '',
        systemTemplate: '',
        TemplateModelS: [],
        options: {},
        skinList: [],
        styleCode: 'df',
        styleID: '',
        skinChangeType: 0,
        checkedTemplates: [],
        apiPath: ''
      }
    },
    watch: {
      saveDefaultdata (newValue) {
        this.tremianlArr = []
        this.getTreeList[0].TreminalS = []
        for (var i = 0; i < newValue.length; i++) {
          for (var j = 0; j < newValue[i].length; j++) {
            this.getTreeList[0].TreminalS.push(newValue[i][j])
            // 默认显示全部班牌
            // 屏保管理判断横版下竖版置灰竖版下横置灰
            if (this.screenModes !== 'undefined' && this.screenModes === 0 && newValue[i][j].ScreenMode === 1) {
              newValue[i][j].disabled = true
            } else if (this.screenModes !== 'undefined' && this.screenModes === 1 && newValue[i][j].ScreenMode === 0) {
              newValue[i][j].disabled = true
            }
            this.tremianlArr.push(newValue[i][j])
          }
        }
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.GetInSystemDropDownList()
    },
    mounted () {},
    methods: {
      // async
      // this.xy.loading()
      //       let res = await this.xy.get(
      //         this.apiPath + `/api/Template/GetPage`
      //       )
      //       this.xy.unloading()
      //       if (res.success) {
      //       } else {
      //       this.xy.msgError(res.msg)
      //       }
      async GetInSystemDropDownList () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/ShowMode/GetInSystemDropDownList`
        )
        this.xy.unloading()
        if (res.success) {
          this.SystemTime.Times = res.data
          this.changeTypeH(0)
        } else {
          this.xy.msgError(res.msg)
        }
      },
      changeSkin () {
        if (this.isEdit) {
          // 编辑时切换风格
          if (this.classTerminalIDs.length > 0) {
            this.xy.msgError('请先删除当前模式下的所有模板。')
          } else {
            this.getTemplate()
          };
        } else {
          // 新建时切换风格
          this.getTemplate()
        };
      },
      async getTemplate () {
        for (var e = 0; e < this.skinList.length; e++) {
          if (this.styleCode === this.skinList[e].StyleCode) {
            this.styleID = this.skinList[e].StyleID
          };
        };
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/Template/GetTemplateListByScreen`, {
            type: this.skinChangeType,
            stylecode: this.styleCode,
            keyword: this.skinChangeType === 0 ? this.hSearchName : this.vSearchName
          }
        )
        this.xy.unloading()
        if (res.success) {
          if (this.skinChangeType === 0) {
            this.HList = res.data
            if (this.HList.length > 0) {
              this.HList.forEach((item, i) => {
                // item.checked = false
                // item.hShow = true
                this.$set(item, 'checked', false)
                this.$set(item, 'hShow', true)
              })
              if (this.checkedTemplates.length > 0) {
                for (var i = 0; i < this.checkedTemplates.length; i++) {
                  for (var j = 0; j < this.HList.length; j++) {
                    if (this.checkedTemplates[i].TemplateID === this.HList[j].TemplateID) {
                      this.HList[j].checked = true
                    };
                  };
                };
              };
            };
          } else {
            this.VList = res.data
            if (this.VList.length > 0) {
              this.VList.forEach((item, i) => {
                // item.checked = false
                // item.vShow = true
                this.$set(item, 'checked', false)
                this.$set(item, 'vShow', true)
              })
              if (this.checkedTemplates.length > 0) {
                for (var k = 0; k < this.checkedTemplates.length; k++) {
                  for (var y = 0; y < this.VList.length; y++) {
                    if (this.checkedTemplates[k].TemplateID === this.VList[y].TemplateID) {
                      this.VList[y].checked = true
                    };
                  };
                };
              };
            };
          };
        } else {
          this.xy.msgError(res.msg)
        }
        this.changeLoading()
      },
      changeTypeH (types) {
        this.screenModes = types
        this.horizontal = 'primary'
        this.vertical = 'default'
        this.getPattern(types)
      },
      changeTypeV (types) {
        this.screenModes = types
        this.horizontal = 'default'
        this.vertical = 'primary'
        this.getPattern(types)
      },
      changeLoading () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      async getPattern (types) {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/ShowMode/GetShowModeByScreen`, {
            type: types,
            keyword: this.searchName
          }
        )
        this.xy.unloading()
        this.isInitial = false
        if (res.success) {
          if (res.data.length > 0) {
            this.patternList = res.data
            this.isEmpty = false
          } else {
            this.isEmpty = true
          };
        } else {
          this.isEmpty = true
          this.xy.msgError(res.msg)
        }
      },
      async getTree () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/ClassTerminalGroup/GetTreminalTree`
        )
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            this.getTreeList[0].children = res.data
            this.setTreeData(res.data)
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      setTreeData (data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].TreminalS.length > 0) {
            this.saveDefaultdata.push(data[i].TreminalS)
          }
          if (data[i].children.length > 0) {
            this.setTreeData(data[i].children)
          }
        }
      },
      // 应用到班牌
      applicationClassCard (item) {
        this.ShowModeID = item.ShowModeID
        if (item.TemplateModelS.length > 0) {
          for (var j = 0; j < item.TemplateModelS.length; j++) {
            if (item.TemplateModelS[j].TemplateLayout === null || item.TemplateModelS[j].TemplateLayout === '') {
              this.xy.msgError('有空白模板，无法指定到班牌。')
              return false
            };
          };
          this.getTree()
          this.saveDefaultdata = []
          this.patternModal = true
        } else {
          this.xy.msgError('模式下未找到相应模板，无法指定到班牌。')
          return false
        };
      },
      selectTree (val) {
        this.tremianlArr = []
        if (val.length === 0) {
          return
        }
        if (val[0].TreminalS.length > 0) {
          this.tremianlArr = val[0].TreminalS
          this.tremianlArr.map(function (val) {
            val.checked = false
            return val
          })
          for (var j = 0; j < this.classTerminalIDs.length; j++) {
            var all1 = this.tremianlArr.map(function (val) {
              return val.ClassTerminalId
            }).indexOf(this.classTerminalIDs[j].ClassTerminalId)
            if (all1 !== -1) {
              this.tremianlArr[all1].checked = true
            };
          };
        };
      },
      changeCheckbox (vals) {
        if (vals.checked) {
          this.classTerminalIDs.push(vals)
        } else {
          for (var i = 0; i < this.classTerminalIDs.length; i++) {
            if (this.classTerminalIDs[i].ClassTerminalId === vals.ClassTerminalId) {
              this.classTerminalIDs.splice(i, 1)
            };
          };
        };
      },
      handleClose (e, name) {
        for (var i = 0; i < this.classTerminalIDs.length; i++) {
          if (this.classTerminalIDs[i].ClassTerminalId === name) {
            for (var j = 0; j < this.tremianlArr.length; j++) {
              if (this.tremianlArr[j].ClassTerminalId === name) {
                this.tremianlArr[j].checked = false
              };
            };
            this.classTerminalIDs.splice(i, 1)
          };
        };
      },
      async patternOk () {
        var ids = []
        if (this.classTerminalIDs.length > 0) {
          for (var i = 0; i < this.classTerminalIDs.length; i++) {
            ids.push(this.classTerminalIDs[i].ClassTerminalId)
          };
        };
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + `/api/ShowMode/ApplyTreminal`, {
            ClassTerminalIDS: ids, // 班牌ID
            ShowModeID: this.ShowModeID// 模式ID
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('应用到指定班牌成功。')
          this.tremianlArr = []// 中间空
          this.classTerminalIDs = []// 右侧空
          this.patternModal = false
        }
        this.changeLoading()
      },
      patternCancel () {
        this.tremianlArr = []// 中间空
        this.classTerminalIDs = []// 右侧空
        this.patternModal = false
      },
      FromSubmit () {
        this.getPattern(this.screenModes)
      },
      hFromSubmit () {
        var that = this
        this.HList.forEach(function (item, i) {
          if (item.TemplateName.indexOf(that.hSearchName) >= 0 || that.hSearchName === '') {
            item.hShow = true
          } else {
            item.hShow = false
          };
        })
      },
      vFromSubmit () {
        var that = this
        this.VList.forEach(function (item, i) {
          if (item.TemplateName.indexOf(that.vSearchName) >= 0 || that.vSearchName === '') {
            item.vShow = true
          } else {
            item.vShow = false
          };
        })
      },
      // --------------
      getTemplateListByScreen (types, vals) {
        let checkedTemplate = []
        this.skinChangeType = types
        if (vals != null) {
          this.isEdit = true
          this.ShowModeID = vals.ShowModeID
          this.ShowModeType = vals.ShowModeType
          checkedTemplate = vals.TemplateModelS
          this.checkedTemplates = vals.TemplateModelS
          this.styleCode = vals.TemplateStyleCode
          this.styleID = vals.TemplateStyleID
          if (types === 0) {
            this.hPatternName = vals.ShowModeName
          } else {
            this.vPatternName = vals.ShowModeName
          };
        } else {
          this.isEdit = false
        };
        // 皮肤
        this.GetStyleByScreen(types, vals)
        this.GetTemplateListByScreen(types, vals, checkedTemplate)
      },
      async GetStyleByScreen (types, vals) {
        let res = await this.xy.get(
          this.apiPath + `/api/Template/GetStyleByScreen`, {
            type: types
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.skinList = res.data
          if (this.isEdit) {
            // 编辑
            console.log(vals)
            this.skinList.forEach(function (item) {
              if (item.StyleID === vals.TemplateStyleID) {
                this.styleID = vals.TemplateStyleCode
              }
            })
          } else {
            this.styleCode = 'df'
          };
        } else {
          this.xy.msgError(res.msg)
        }
      },
      async GetTemplateListByScreen (types, vals, checkedTemplate) {
        let res = await this.xy.get(
          this.apiPath + `/api/Template/GetTemplateListByScreen`, {
            type: types,
            stylecode: this.styleCode,
            keyword: types === 0 ? this.hSearchName : this.vSearchName
          }
        )
        this.xy.unloading()
        if (res.success) {
          if (types === 0) {
            this.HList = res.data
            if (this.HList.length > 0) {
              this.HList.forEach((item, i) => {
                // item.checked = false
                // item.hShow = true
                this.$set(item, 'checked', false)
                this.$set(item, 'hShow', true)
              })
              if (checkedTemplate.length > 0) {
                for (var i = 0; i < checkedTemplate.length; i++) {
                  for (var j = 0; j < this.HList.length; j++) {
                    if (checkedTemplate[i].TemplateID === this.HList[j].TemplateID) {
                      this.HList[j].checked = true
                    };
                  };
                };
              };
            };
            this.HPatternCreate = true
          } else {
            this.VList = res.data
            if (this.VList.length > 0) {
              this.VList.forEach((item, i) => {
                // item.checked = false
                // item.vShow = true
                this.$set(item, 'checked', false)
                this.$set(item, 'vShow', true)
              })
              if (checkedTemplate.length > 0) {
                for (var k = 0; k < checkedTemplate.length; k++) {
                  for (var y = 0; y < this.VList.length; y++) {
                    if (checkedTemplate[k].TemplateID === this.VList[y].TemplateID) {
                      this.VList[y].checked = true
                    };
                  };
                };
              };
            };
            this.VPatternCreate = true
          }
        } else {
          this.xy.msgError(res.msg)
        }
        this.changeLoading()
      },
      // ---------------
      addPattern (type) {
        this.styleCode = 'df'
        var types = 1// 竖版
        if (type === 'horizontal') {
          types = 0// 横板
        };
        this.getTemplateListByScreen(types, null)
      },
      // 横
      async hPatternOk () {
        var addArr = []
        if (this.hPatternName === '') {
          this.xy.msgError('模式名称不能为空。')
          this.changeLoading()
          return false
        };
        for (var i = 0; i < this.HList.length; i++) {
          if (this.HList[i].checked) {
            addArr.push({
              TemplateID: this.HList[i].TemplateID
            })
          };
        };
        if (addArr.length === 0) {
          this.xy.msgError('请选择模板。')
          this.changeLoading()
          return false
        };
        if (addArr.length > 3) {
          this.xy.msgError('最多选择三个模板。')
          this.changeLoading()
          return false
        };
        if (this.isEdit) {
          let res = await this.xy.post(
            this.apiPath + `/api/ShowMode/Edit`, {
              ShowModeID: this.ShowModeID,
              ShowModeName: this.hPatternName,
              ShowModeType: this.ShowModeType,
              TemplateStyleID: this.styleID,
              TemplateStyleCode: this.styleCode,
              ScreenMode: 0,
              Models: addArr
            }
          )
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('模式编辑成功。')
            this.HPatternCreate = false
            this.hPatternName = ''
            this.getPattern(this.screenModes)
          } else {
            this.xy.msgError(res.msg)
          }
          this.changeLoading()
        } else {
          let res = await this.xy.post(
            this.apiPath + `/api/ShowMode/Create`, {
              ShowModeName: this.hPatternName,
              ShowModeID: 0,
              ShowModeType: 0,
              ScreenMode: 0,
              TemplateStyleID: this.styleID,
              TemplateStyleCode: this.styleCode,
              Models: addArr
            }
          )
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('模式添加成功，请设置显示时间。')
            this.HPatternCreate = false
            this.hPatternName = ''
            this.changeTypeH(0)// 跳转至横板
          }
          this.changeLoading()
        };
      },
      // 竖
      async vPatternOk () {
        var addArr = []
        if (this.vPatternName === '') {
          this.xy.msgError('模式名称不能为空。')
          this.changeLoading()
          return false
        };
        for (var i = 0; i < this.VList.length; i++) {
          if (this.VList[i].checked) {
            addArr.push(this.VList[i])
          };
        };
        if (addArr.length === 0) {
          this.xy.msgError('请选择模板。')
          this.changeLoading()
          return false
        };
        if (addArr.length > 3) {
          this.xy.msgError('最多选择三个模板。')
          this.changeLoading()
          return false
        };
        if (this.isEdit) {
          let res = await this.xy.post(
            this.apiPath + `/api/ShowMode/Edit`, {
              ShowModeID: this.ShowModeID,
              ShowModeName: this.vPatternName,
              ShowModeType: this.ShowModeType,
              TemplateStyleID: this.styleID,
              TemplateStyleCode: this.styleCode,
              ScreenMode: 1,
              Models: addArr
            }
          )
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('模式编辑成功。')
            this.VPatternCreate = false
            this.vPatternName = ''
            this.getPattern(this.screenModes)
          } else {
            this.xy.msgError(res.msg)
          }
          this.changeLoading()
        } else {
          let res = await this.xy.post(
            this.apiPath + `/api/ShowMode/Create`, {
              ShowModeName: this.vPatternName,
              ShowModeID: 0,
              ShowModeType: 0,
              ScreenMode: 1,
              TemplateStyleID: this.styleID,
              TemplateStyleCode: this.styleCode,
              Models: addArr
            }
          )
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('模式添加成功，请设置显示时间。')
            this.VPatternCreate = false
            this.vPatternName = ''
            this.changeTypeV(1)// 跳转至横板
          }
          this.changeLoading()
        };
      },
      hPatternCancel () {
        this.HPatternCreate = false
        this.hPatternName = ''
      },
      vPatternCancel () {
        this.VPatternCreate = false
        this.vPatternName = ''
      },
      checkedHItem (vals) {
        vals.checked = !vals.checked
        this.styleID = vals.TemplateStyleID
      },
      checkedVItem (vals) {
        vals.checked = !vals.checked
        this.styleID = vals.TemplateStyleID
      },
      editCustom (vals) {
        this.getTemplateListByScreen(vals.ScreenMode, vals)
      },
      // 删除
      delCustom (id) {
        var _this = this
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确认要删除当前模式吗？</p>',
          onOk: function () {
            _this.xy.get(
              _this.apiPath + `/api/ShowMode/DeleteShowMode?showmodeid=` + id).then(res => {
              if (res.success) {
                _this.xy.msgSuc('删除成功。')
                _this.getPattern(_this.screenModes)
              } else {
                console.log(res)
                _this.xy.msgError(res.msg)
              }
              _this.xy.unloading()
            })
          }
        })
      },
      async settingTime (vals) {
        this.CustomTime.TimeList = []
        this.NullTime.Templates = []
        this.TemplateModelS = []
        this.SystemTime.Templates = []
        this.ShowModeID = ''
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/ShowMode/GetInstallShowModeById?showModeId=` + vals.ShowModeID
        )
        this.xy.unloading()
        if (res.success) {
          if (res.data.InDefault != null) {
            this.nullTimeTemplate = res.data.InDefault.TemplateId
          } else {
            this.nullTimeTemplate = ''
          };
          if (res.data.InCustom.length > 0) {
            this.CustomTime.Checked = true
            for (var i = 0; i < res.data.InCustom.length; i++) {
              this.CustomTime.TimeList.push({
                Times: [res.data.InCustom[i].StartTime, res.data.InCustom[i].EndTime],
                TemplatesId: res.data.InCustom[i].TemplateId,
                Templates: vals.TemplateModelS
              })
            };
          } else {
            this.CustomTime.Checked = false
            this.CustomTime.TimeList = [{
              Times: [],
              TemplatesId: '',
              Templates: vals.TemplateModelS
            }]
          };
          if (res.data.InSystem != null) {
            this.systemtimeValue = res.data.InSystem.ShowTimeType.toString()
            this.systemTemplate = res.data.InSystem.TemplateId
            this.SystemTime.Checked = true
          } else {
            this.systemtimeValue = ''
            this.systemTemplate = ''
            this.SystemTime.Checked = false
          };
        } else {
          this.xy.msgError(res.msg)
        }
        this.changeLoading()
        this.ShowModeID = vals.ShowModeID
        this.TemplateModelS = vals.TemplateModelS
        this.SystemTime.Templates = vals.TemplateModelS
        this.NullTime.Templates = vals.TemplateModelS
        this.SettingTimeModal = true
      },
      systemClick () {
        this.SystemTime.Checked = !this.SystemTime.Checked
      },
      customClick () {
        this.CustomTime.Checked = !this.CustomTime.Checked
      },
      customAdd (i) {
        if (this.CustomTime.TimeList.length < 15) {
          var items = {
            Times: [],
            Templates: this.TemplateModelS
          }
          this.CustomTime.TimeList.splice(i + 1, 0, items)
        } else {
          this.xy.msgError('自定义时间段最多只能添加15个。')
        };
      },
      customDel (j) {
        if (this.CustomTime.TimeList.length > 1) {
          this.CustomTime.TimeList.splice(j, 1)
        } else {
          this.xy.msgError('自定义时间段最少有一个。')
        };
      },
      async SettingTimeOk () {
        if (this.nullTimeTemplate === '' || this.nullTimeTemplate === 0) {
          this.xy.msgError('请设置缺省时间显示的模板。')
          this.changeLoading()
          return false
        };
        this.options = {
          ShowModeId: this.ShowModeID,
          InDefault: {
            TemplateId: this.nullTimeTemplate
          }
        }
        if (this.SystemTime.Checked) {
          if (this.systemtimeValue === '' || this.systemtimeValue === undefined) {
            this.xy.msgError('请选择系统时间。')
            this.changeLoading()
            return false
          };
          if (this.systemTemplate === '' || this.systemTemplate === undefined) {
            this.xy.msgError('请选择模板。')
            this.changeLoading()
            return false
          };
          this.options.InSystem = {
            ShowTimeType: Number(this.systemtimeValue),
            TemplateId: this.systemTemplate
          }
        };
        if (this.CustomTime.Checked) {
          this.options.InCustom = []
          let isNull = 0
          let isTempl = 0
          for (var i = 0; i < this.CustomTime.TimeList.length; i++) {
            if (this.CustomTime.TimeList[i].Times.length === 0) {
              isNull = 1
            };
            if (this.CustomTime.TimeList[i].TemplatesId === '') {
              isTempl = 1
            };
          };
          if (isNull === 1) {
            this.xy.msgError('自定义时间段不能为空。')
            this.changeLoading()
            return false
          };
          if (isTempl === 1) {
            this.xy.msgError('自定义时间段对应的模板不能为空。')
            this.changeLoading()
            return false
          };
          for (var j = 0; j < this.CustomTime.TimeList.length; j++) {
            this.options.InCustom.push({
              StartTime: this.CustomTime.TimeList[j].Times[0],
              EndTime: this.CustomTime.TimeList[j].Times[1],
              TemplateId: this.CustomTime.TimeList[j].TemplatesId,
              Sort: j + 1
            })
          };
        };
        this.xy.loading()
        console.log(this.options)
        let res = await this.xy.post(
          this.apiPath + `/api/ShowMode/Install`, this.options
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('设置成功。')
          this.SettingTimeModal = false
        } else {
          this.xy.msgError(res.msg)
        }
        this.changeLoading()
      },
      SettingTimeCancel () {
        this.SettingTimeModal = false
        this.nullTimeTemplate = ''
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
    line-height: 15px;
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
    color: #ccc;
}
.pattern-setting-time-btn-null i{
  font-size: 24px;
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
    color: #4196ff;
}

.pattern-setting-time-btn-del {
    color: #FF8C8C;
}
.pattern-setting-time-btn-add i,
.pattern-setting-time-btn-del i{
    font-size: 24px;
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

</style>
