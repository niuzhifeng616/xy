<template>
  <div>
    <!-- 模板管理-创建横版 // 缺少面包屑 -->
    <div class="xy-content-body pr">
        <div class="clearfix">
            <div class="fl">
                <span style="padding-top: 4px;">模板名称：</span>
                <Input v-model="TemplateName" v-cloak style="width:200px;margin-right:10px;" maxlength="10" />
                <span style="padding-top: 4px;">模板简介：</span>
                <Input v-model="TemplateDescribe" v-cloak style="width:300px;" maxlength="30" />
                <tooltip placement="top">
                    <img :src="require('@/assets/common/infoPublic/skin.svg')" @click="changeSkin" style="width:26px;cursor:pointer" />
                    <div slot="content">
                        <p v-cloak>换肤</p>
                    </div>
                </tooltip>
            </div>
            <div class="fr">
                <i-button type="primary" @click="addTemplate">保存</i-button>
            </div>
        </div>
        <div class="tamplet-box-container">
            <div class="tamplate-box-left">
                <div class="tamplate-table" ref="tamplateble" id="tamplateble" style="width: 100%;height: 100%;">
                    <div style="width:100%;" id="dorpContent">
                        <div v-for="(item,index) in dropList" :key="index" class="xy-drag-box" data-disable="0" v-cloak>{{index+1}}</div>
                    </div>
                    <div class="tamplate-module" id="templateModule" @drop="drop" @dragover.prevent></div>
                </div>
            </div>
            <div class="tamplate-box-right">
                <div style="color:#333;font-weight:bold;font-size:18px;margin-left:10px;">横版组件库</div>
                <div class="dragbox" ref="DragDom">
                    <div v-for="(item,index) in dragList" :key="index" v-cloak>
                        <div class="dragbox-title"><div class="title-describe" v-cloak>{{item.title}}</div></div>
                        <div class="dragebox-template">
                            <div v-for="(drags,index) in item.model"
                              v-cloak
                              :key="index"
                              :class="'dragbox-'+drags.ControlImgStyle"
                              @dragstart="dragstart(drags)"
                              draggable="true"
                              @drag='draging'
                              @dragend="dragend">
                              <div class="pr">
                                <!-- :src="require('@/assets/common/infoPublic/wait.png')
                                :src="require('@/assets/common/infoPublic/image/classCard/'+drags.ControlImg)"
                                :src="'/image/classCard/'+drags.ControlImg" -->
                                <img :src="require('@/assets/common/infoPublic/classCard/'+drags.ControlImg)" :class="'dragbox-template-img-size-'+drags.ControlImgStyle" :style="{border: skinN === 'ksl' ? '1px solid #e9e9e9' : '',borderRadius: skinN === 'ksl' ? '8px' : ''}" class="cursor-grab" />
                                <div class="pa dragbox-template-size" :class="'dragbox-template-size-'+drags.ControlImgStyle">
                                  <span>组件尺寸：</span>
                                  <span v-if="drags.ControlImgStyle==1">1*1</span>
                                  <span v-if="drags.ControlImgStyle==2">1*2</span>
                                  <span v-if="drags.ControlImgStyle==3">2*1</span>
                                  <span v-if="drags.ControlImgStyle==4">2*2</span>
                                  <span v-if="drags.ControlImgStyle==5">4*3（全屏）</span>
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <modal v-model="skinModal"
           :styles="{top:'20px',width:'880px'}"
           v-cloak
           :transfer="false"
           title="换肤"
           :loading="loading"
           :mask-closable="false"
           :closable="false">
        <div>
            <div class="title-describe">确定换肤后当前页面模板会清空，需要重新拖拽。</div>
            <div class="skin-flex-h">
                <div v-for="(item,index) in skinList" :key="index" class="skin-list-h cursor-p pr" :class="skinIndex==index?'active':''">
                    <div class="skin-list-h-img pr" @click="skinChangeBtn(item,index)">
                        <img :src="require('@/assets/common/infoPublic' + item.StyleImg)"
                         class="skin-imgs" />
                        <div class="skin-mark" v-if="skinIndex==index">
                            <Icon type="md-checkmark-circle-outline skin-icons" size="40" color="#fff"></Icon>
                        </div>
                    </div>
                    <p>{{item.StyleName}}</p>
                </div>
                <div class="skin-list-h">
                    <div class="null">
                        <img :src="require('@/assets/common/infoPublic/wait.png')" style="width: 60px;margin-bottom: 8px;" />
                        <p>敬请期待...</p>
                    </div>
                </div>
            </div>
        </div>
        <div slot="footer">
            <i-button type="default" @click="skinCancel">取消</i-button>
            <i-button type="primary" @click="skinOk">确定</i-button>
        </div>
    </modal>
  </div>
</template>

<script>
  import $ from 'jquery'
  import html2canvas from 'html2canvas'
  window.jQuery = $
  export default {
    name: 'CreateHorizontal',
    data () {
      return {
        bgimage: require('@/assets/common/infoPublic/classCard/df.png'),
        addTemplateList: [],
        nowImg: '',
        addLeft: '',
        addTop: '',
        addWidth: '',
        addHeight: '',
        offsetLeftBox: [],
        myArray: [],
        sortable: null,
        dragStartType: {}, // 拖拽的值
        itemBox: {},
        dropList: [
          { startX: 0, startY: 0 },
          { startX: 1, startY: 0 },
          { startX: 2, startY: 0 },
          { startX: 3, startY: 0 },
          { startX: 0, startY: 1 },
          { startX: 1, startY: 1 },
          { startX: 2, startY: 1 },
          { startX: 3, startY: 1 },
          { startX: 0, startY: 2 },
          { startX: 1, startY: 2 },
          { startX: 2, startY: 2 },
          { startX: 3, startY: 2 }
        ],
        dragList: [],
        rows: {},
        TemplateName: '',
        TemplateDescribe: '',
        // apiPath: xy.webUrl,
        loading: true,
        skinModal: false,
        skinIndex: 0,
        skinList: [],
        allBox: {},
        styleID: 1,
        styleCode: 'df',
        skinI: 0,
        skinN: 'df',
        skinD: 0,
        applications: '',
        breadcrumbIDs: 0,
        breadcrumbNames: '',
        apiPath: '',
        scrollTop: '',
        ratio: null
      }
    },
    destroyed () {
      window.onresize = null
    },
    computed: {},
    created () {
      this.detectZoom()
      this.apiPath = this.$store.state.apiPath
      this.applications = this.$store.state.infoPublic.applications
      this.breadcrumbIDs = this.$store.state.infoPublic.breadcrumbIDs
      this.breadcrumbNames = this.$store.state.infoPublic.breadcrumbNames
      this.GetStyleByScreen()
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll, true)
      this.$nextTick(() => {
        let that = this
        let bg = document.getElementById('tamplateble')
        bg.style.backgroundImage = `url(${this.bgimage})`
        window.onresize = that.windowResize
        that.$nextTick(() => {
          that.windowResize()
          that.getTemplateList()
        })

        // 删除对应的模板
        let thatIndex = ''; let imgStyle = ''; let sIndex = ''; let eIndex = ''
        $('#templateModule').on('click', '.del-template-img', function () {
          that.itemBox = null
          for (let i = 0; i < that.addTemplateList.length; i++) {
            if (Number($(this).attr('data-indexs')) === -1) {
              // 4*3控件
              $(this).parent().remove()
              that.addTemplateList = []
              imgStyle = 5
            } else {
              if (Number($(this).attr('data-indexs')) === Number(that.addTemplateList[i].index)) {
                thatIndex = Number($(this).attr('data-indexs'))
                $(this).parent().remove()
                that.addTemplateList.splice(i, 1)
              };
              for (let j = 0; j < $('.xy-drag-box').length; j++) {
                if (j === thatIndex) {
                  imgStyle = $('.xy-drag-box').eq(j).attr('data-xy-style')// 图片类型
                  sIndex = $('.xy-drag-box').eq(j).attr('data-xy-one')// 放置的开始坐标
                  if ($('.xy-drag-box').eq(j).attr('data-xy-two') !== undefined) {
                    eIndex = $('.xy-drag-box').eq(j).attr('data-xy-two')// 放置的结束坐标
                  };
                };
              };
            };
          };
          if (imgStyle === '1') {
            $('.xy-drag-box').eq(sIndex).attr('data-disable', '0')
            $('.xy-drag-box').eq(sIndex).removeAttr('data-xy-style')
            $('.xy-drag-box').eq(sIndex).removeAttr('data-xy-one')
            $('.xy-drag-box').eq(sIndex).removeAttr('data-xy-two')
            $('.xy-drag-box').eq(sIndex).removeClass('grid-lay-none')
          // return;
          };
          if (imgStyle === '2' || imgStyle === '3') {
            $('.xy-drag-box').eq(sIndex).attr('data-disable', '0')
            $('.xy-drag-box').eq(sIndex).removeAttr('data-xy-style')
            $('.xy-drag-box').eq(sIndex).removeAttr('data-xy-one')
            $('.xy-drag-box').eq(sIndex).removeAttr('data-xy-two')
            $('.xy-drag-box').eq(sIndex).removeClass('grid-lay-none')

            $('.xy-drag-box').eq(eIndex).attr('data-disable', '0')
            $('.xy-drag-box').eq(eIndex).removeAttr('data-xy-style')
            $('.xy-drag-box').eq(eIndex).removeAttr('data-xy-one')
            $('.xy-drag-box').eq(eIndex).removeAttr('data-xy-two')
            $('.xy-drag-box').eq(eIndex).removeClass('grid-lay-none')
          };
          if (imgStyle === '4') {
            $('.xy-drag-box').eq(sIndex).attr('data-disable', '0')
            $('.xy-drag-box').eq(sIndex).removeAttr('data-xy-style')
            $('.xy-drag-box').eq(sIndex).removeAttr('data-xy-one')
            $('.xy-drag-box').eq(sIndex).removeAttr('data-xy-two')
            $('.xy-drag-box').eq(sIndex).removeClass('grid-lay-none')
            let a = Number(sIndex) + 1
            $('.xy-drag-box').eq(a).attr('data-disable', '0')
            $('.xy-drag-box').eq(a).removeAttr('data-xy-style')
            $('.xy-drag-box').eq(a).removeAttr('data-xy-one')
            $('.xy-drag-box').eq(a).removeAttr('data-xy-two')
            $('.xy-drag-box').eq(a).removeClass('grid-lay-none')
            let b = Number(sIndex) + 4
            $('.xy-drag-box').eq(b).attr('data-disable', '0')
            $('.xy-drag-box').eq(b).removeAttr('data-xy-style')
            $('.xy-drag-box').eq(b).removeAttr('data-xy-one')
            $('.xy-drag-box').eq(b).removeAttr('data-xy-two')
            $('.xy-drag-box').eq(b).removeClass('grid-lay-none')
            let c = Number(sIndex) + 5
            $('.xy-drag-box').eq(c).attr('data-disable', '0')
            $('.xy-drag-box').eq(c).removeAttr('data-xy-style')
            $('.xy-drag-box').eq(c).removeAttr('data-xy-one')
            $('.xy-drag-box').eq(c).removeAttr('data-xy-two')
            $('.xy-drag-box').eq(c).removeClass('grid-lay-none')
          };
          if (imgStyle === 5) {
            $('.xy-drag-box').attr('data-disable', '0')
            $('.xy-drag-box').removeAttr('data-xy-style')
            $('.xy-drag-box').removeAttr('data-xy-one')
            $('.xy-drag-box').removeAttr('data-xy-two')
            $('.xy-drag-box').removeClass('grid-lay-none')
          }
        })
      })
    },
    methods: {
      // 监听浏览器缩放比例
      detectZoom () {
        var ratio = 0
        var screen = window.screen
        var ua = navigator.userAgent.toLowerCase()
        if (window.devicePixelRatio !== undefined) {
          ratio = window.devicePixelRatio
        } else if (~ua.indexOf('msie')) {
          if (screen.deviceXDPI && screen.logicalXDPI) {
            ratio = screen.deviceXDPI / screen.logicalXDPI
          }
        } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
          ratio = window.outerWidth / window.innerWidth
        }
        if (ratio) {
          ratio = Math.round(ratio * 100)
        }
        console.log(ratio)
        this.ratio = ratio / 100
        return ratio
      },
      handleScroll (e) {
        let scrollTop = document.querySelector('#scrollWrap').scrollTop
        this.scrollTop = scrollTop
        this.windowResize()
      },
      // 初始获取所有风格
      async GetStyleByScreen () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/Template/GetStyleByScreen`,
          {
            type: 0
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.skinList = res.data
          this.skinList.forEach(item => {
            if (item.StyleID === 1) {
              this.$set(item, 'Checked', true)
            } else {
              this.$set(item, 'Checked', false)
            };
          })
        } else {
          this.xy.msgError(res.msg)
        }
      },

      skinChangeBtn (vals, i) {
        this.styleID = vals.StyleID
        this.styleCode = vals.StyleCode
        this.skinIndex = i
      },

      changeSkin () {
        this.skinModal = true
      },

      async skinOk () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/Template/GetControlByScreen`,
          {
            type: 0,
            stylecode: this.styleCode
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.skinI = this.skinIndex
          this.skinN = this.styleCode
          this.skinD = this.styleID
          $('#dorpContent').find('div.xy-drag-box').removeClass('grid-lay-none')
          $('#dorpContent').find('div.xy-drag-box').attr('data-disable', 0)
          $('#dorpContent').find('div.xy-drag-box').removeAttr('data-xy-style')
          $('#dorpContent').find('div.xy-drag-box').removeAttr('data-xy-one')
          this.addTemplateList = []
          $('#templateModule').find('div.hover-template').remove()
          this.xy.msgSuc('皮肤切换成功。')
          this.skinModal = false
          // 切换背景图
          let bg = document.getElementById('tamplateble')
          let changebg = require('@/assets/common/infoPublic/classCard/' + this.styleCode + '.png')
          bg.style.backgroundImage = `url(${changebg})`
          let newArr = []; let modelArr = []
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].ScreenMode === 0) {
              newArr.push({
                title: res.data[i].ControlName,
                id: res.data[i].ControlType,
                model: []
              })
              modelArr.push({
                ControlColor: res.data[i].ControlColor,
                ControlHeight: res.data[i].ControlHeight,
                ControlImg: res.data[i].ControlImg,
                ControlImgStyle: res.data[i].ControlImgStyle,
                ControlName: res.data[i].ControlName,
                ControlType: res.data[i].ControlType,
                ControlTypeName: res.data[i].ControlTypeName,
                ControlWidth: res.data[i].ControlWidth,
                TemplateControlID: res.data[i].TemplateControlID,
                ControlTypeCode: res.data[i].ControlTypeCode
              })
            };
          };
          var obj = {}
          // 去重
          newArr = newArr.reduce(function (item, next) {
            // eslint-disable-next-line no-unused-expressions
            obj[next.id] ? '' : obj[next.id] = true && item.push(next)
            return item
          }, [])
          for (let k = 0; k < newArr.length; k++) {
            for (let m = 0; m < modelArr.length; m++) {
              if (newArr[k].title === modelArr[m].ControlName) {
                newArr[k].model.push(modelArr[m])
              };
            };
          };
          this.dragList = newArr
        } else {
          this.xy.msgError(res.data.msg)
        }
      },

      skinCancel () {
        this.skinModal = false
        this.styleID = this.skinD
        this.skinIndex = this.skinI
        this.styleCode = this.skinN
      },

      async getTemplateList () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/Template/GetControlByScreen`, {
            type: 0,
            stylecode: this.styleCode
          }
        )
        this.xy.unloading()
        if (res.success) {
          let newArr = []; let modelArr = []
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].ScreenMode === 0) {
              newArr.push({
                title: res.data[i].ControlName,
                id: res.data[i].ControlType,
                model: []
              })
              modelArr.push({
                ControlColor: res.data[i].ControlColor,
                ControlHeight: res.data[i].ControlHeight,
                ControlImg: res.data[i].ControlImg,
                ControlImgStyle: res.data[i].ControlImgStyle,
                ControlName: res.data[i].ControlName,
                ControlType: res.data[i].ControlType,
                ControlTypeName: res.data[i].ControlTypeName,
                ControlWidth: res.data[i].ControlWidth,
                TemplateControlID: res.data[i].TemplateControlID,
                ControlTypeCode: res.data[i].ControlTypeCode
              })
            };
          };
          var obj = {}
          // 去重
          newArr = newArr.reduce(function (item, next) {
            // eslint-disable-next-line no-unused-expressions
            obj[next.id] ? '' : obj[next.id] = true && item.push(next)
            return item
          }, [])
          for (let k = 0; k < newArr.length; k++) {
            for (let m = 0; m < modelArr.length; m++) {
              if (newArr[k].title === modelArr[m].ControlName) {
                newArr[k].model.push(modelArr[m])
              };
            };
          };
          this.dragList = newArr
        } else {
          this.xy.msgError(res.data.msg)
        }
      },

      windowResize: function () {
        let pDom = document.getElementById('tamplateble')
        let pL = pDom.offsetLeft
        let pT = pDom.offsetTop
        let sT = this.scrollTop
        while (pDom === pDom.offsetParent) { // pDom = pDom.offsetParent;while (pDom != undefined)
          pL += pDom.offsetLeft
          pT += pDom.offsetTop
        };
        this.offsetLeftBox = []
        let doms = document.getElementsByClassName('xy-drag-box')
        for (let i = 0; i < doms.length; i++) {
          this.offsetLeftBox.push({
            dom: doms[i],
            index: i,
            width: doms[i].offsetWidth,
            height: doms[i].offsetHeight,
            oLeft: doms[i].offsetLeft + pL + 60,
            oRight: doms[i].offsetLeft + pL + 60 + doms[i].offsetWidth,
            oTop: doms[i].offsetTop + pT - sT + 140,
            oBottom: doms[i].offsetTop + pT - sT + 140 + doms[i].offsetHeight,
            yLeft: doms[i].offsetLeft,
            yTop: doms[i].offsetTop
          })
        };
        let wrapBox = document.getElementById('dorpContent')
        this.allBox = {
          dom: doms[0],
          index: 11,
          width: wrapBox.offsetWidth,
          height: wrapBox.offsetHeight,
          oLeft: wrapBox.offsetLeft + pL + 60,
          oRight: wrapBox.offsetLeft + pL + 60 + wrapBox.offsetWidth,
          oTop: wrapBox.offsetTop + pT - sT + 140,
          oBottom: wrapBox.offsetTop + pT - sT + 140 + wrapBox.offsetHeight,
          yLeft: wrapBox.offsetLeft,
          yTop: wrapBox.offsetTop
        }
        // 模板自适应
        let ysDom = $('.xy-drag-box')
        let resizeDom = $('#templateModule > div')
        for (let k = 0; k < ysDom.length; k++) {
          if (resizeDom.length > 0) {
            for (let j = 0; j < resizeDom.length; j++) {
              if (ysDom.eq(k).attr('data-xy-style') === '1') { // 1*1
                if (ysDom.eq(k).attr('data-xy-one') === resizeDom.eq(j).attr('data-nowi')) {
                  resizeDom.eq(j).css({
                    'width': ysDom.eq(k).innerWidth() + 'px',
                    'height': ysDom.eq(k).innerHeight() + 'px',
                    'top': (ysDom.eq(k).position().top + 10) + 'px',
                    'left': (ysDom.eq(k).position().left + 10) + 'px'
                  })
                };
              };
              if (ysDom.eq(k).attr('data-xy-style') === '2') { // 1*2
                if (ysDom.eq(k).attr('data-xy-one') === resizeDom.eq(j).attr('data-nowi')) {
                  resizeDom.eq(j).css({
                    'width': ysDom.eq(k).innerWidth() + 'px',
                    'height': (ysDom.eq(k).innerHeight() * 2 + 20) + 'px',
                    'top': (ysDom.eq(k).position().top + 10) + 'px',
                    'left': (ysDom.eq(k).position().left + 10) + 'px'
                  })
                };
              };
              if (ysDom.eq(k).attr('data-xy-style') === '3') { // 2*1
                if (ysDom.eq(k).attr('data-xy-one') === resizeDom.eq(j).attr('data-nowi')) {
                  resizeDom.eq(j).css({
                    'width': (ysDom.eq(k).innerWidth() * 2 + 20) + 'px',
                    'height': ysDom.eq(k).innerHeight() + 'px',
                    'top': (ysDom.eq(k).position().top + 10) + 'px',
                    'left': (ysDom.eq(k).position().left + 10) + 'px'
                  })
                };
              };
              if (ysDom.eq(k).attr('data-xy-style') === '4') { // 2*2
                if (ysDom.eq(k).attr('data-xy-one') === resizeDom.eq(j).attr('data-nowi')) {
                  resizeDom.eq(j).css({
                    'width': (ysDom.eq(k).innerWidth() * 2 + 20) + 'px',
                    'height': (ysDom.eq(k).innerHeight() * 2 + 20) + 'px',
                    'top': (ysDom.eq(k).position().top + 10) + 'px',
                    'left': (ysDom.eq(k).position().left + 10) + 'px'
                  })
                };
              };
            };
          };
        };
        if ($('.xy-drag-box').attr('data-xy-style') === '5') { // 4*3
          resizeDom.css({
            'width': ($('.xy-drag-box').innerWidth() * 4 + 60) + 'px',
            'height': ($('.xy-drag-box').innerHeight() * 3 + 40) + 'px',
            'top': ($('.xy-drag-box').position().top + 10) + 'px',
            'left': ($('.xy-drag-box').position().left + 10) + 'px'
          })
        };
      },
      dragstart (dragType) {
        this.dragStartType = dragType
        this.nowImg = dragType.ControlImg
      },

      draging (e) {
        // 拖拽ing的时候，底色随之改变
        e = e || window.event
        let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft // 分别兼容ie和chrome
        let scrollY = document.documentElement.scrollTop || document.body.scrollTop
        let x = e.pageX || (e.clientX + scrollX)// 兼容火狐和其他浏览器
        let y = e.pageY || (e.clientY + scrollY)
        this.addLeft = ''
        this.addTop = ''
        this.addWidth = ''
        this.addHeight = ''
        this.itemBox = ''
        for (let i = 0; i < this.offsetLeftBox.length; i++) {
          this.offsetLeftBox[i].dom.style.background = '#fff'
          if (this.offsetLeftBox[i].oLeft < x && x < this.offsetLeftBox[i].oRight) {
            if (this.offsetLeftBox[i].oTop < y && y < this.offsetLeftBox[i].oBottom) {
              //= =============1*1  Start==============
              if (this.dragStartType.ControlWidth === 1 && this.dragStartType.ControlHeight === 1) {
                this.addLeft = this.offsetLeftBox[i].yLeft
                this.addTop = this.offsetLeftBox[i].yTop
                this.addWidth = this.offsetLeftBox[i].width
                this.addHeight = this.offsetLeftBox[i].height
                this.itemBox = this.offsetLeftBox[i]
                this.offsetLeftBox[i].dom.style.background = 'rgb(0, 0, 0,0.2)'
              };
              //= =============1*2  Start==============
              if (this.dragStartType.ControlWidth === 1 && this.dragStartType.ControlHeight === 2) {
                if ((i + 4) < 12) {
                  if (this.offsetLeftBox[i].dom.getAttribute('data-disable') === '0') {
                    if (this.offsetLeftBox[i + 4].dom.getAttribute('data-disable') === '0') {
                      this.addLeft = this.offsetLeftBox[i].yLeft
                      this.addTop = this.offsetLeftBox[i].yTop
                      this.addWidth = this.offsetLeftBox[i].width
                      this.addHeight = this.offsetLeftBox[i].height
                      this.itemBox = this.offsetLeftBox[i]
                      this.offsetLeftBox[i].dom.style.background = 'rgb(0, 0, 0,0.2)'
                      this.offsetLeftBox[i + 4].dom.style.background = 'rgb(0, 0, 0,0.2)'
                      return false
                    };
                  };
                } else {
                  this.offsetLeftBox[i].dom.style.background = '#fff'
                  if (i === 8 || i === 9 || i === 10 || i === 11) {
                    if (this.offsetLeftBox[i].dom.getAttribute('data-disable') === '0') {
                      if (this.offsetLeftBox[i - 4].dom.getAttribute('data-disable') === '0') {
                        this.addLeft = this.offsetLeftBox[i - 4].yLeft
                        this.addTop = this.offsetLeftBox[i - 4].yTop
                        this.addWidth = this.offsetLeftBox[i - 4].width
                        this.addHeight = this.offsetLeftBox[i - 4].height
                        this.itemBox = this.offsetLeftBox[i - 4]
                        this.offsetLeftBox[i].dom.style.background = 'rgb(0, 0, 0,0.2)'
                        this.offsetLeftBox[i - 4].dom.style.background = 'rgb(0, 0, 0,0.2)'
                      } else {
                        return false
                      };
                    };
                  };
                };
              };
              //= =============2*1  Start==============
              if (this.dragStartType.ControlWidth === 2 && this.dragStartType.ControlHeight === 1) {
                if (i === 3 || i === 7 || i === 11) {
                  if (this.offsetLeftBox[i].dom.getAttribute('data-disable') === '0') {
                    if (this.offsetLeftBox[i - 1].dom.getAttribute('data-disable') === '0') {
                      this.addLeft = this.offsetLeftBox[i - 1].yLeft
                      this.addTop = this.offsetLeftBox[i - 1].yTop
                      this.addWidth = this.offsetLeftBox[i - 1].width
                      this.addHeight = this.offsetLeftBox[i - 1].height
                      this.itemBox = this.offsetLeftBox[i - 1]
                      this.offsetLeftBox[i].dom.style.background = 'rgb(0, 0, 0,0.2)'
                      this.offsetLeftBox[i - 1].dom.style.background = 'rgb(0, 0, 0,0.2)'
                      return false
                    };
                  };
                } else {
                  if (this.offsetLeftBox[i + 1].dom.getAttribute('data-disable') === '0') {
                    this.addLeft = this.offsetLeftBox[i].yLeft
                    this.addTop = this.offsetLeftBox[i].yTop
                    this.addWidth = this.offsetLeftBox[i].width
                    this.addHeight = this.offsetLeftBox[i].height
                    this.itemBox = this.offsetLeftBox[i]
                    this.offsetLeftBox[i].dom.style.background = 'rgb(0, 0, 0,0.2)'
                    this.offsetLeftBox[i + 1].dom.style.background = 'rgb(0, 0, 0,0.2)'
                    return false
                  };
                };
              };
              //= =============2*2  Start==============
              if (this.dragStartType.ControlWidth === 2 && this.dragStartType.ControlHeight === 2) {
                if ((i + 4) < 12) {
                  if (i === 3 || i === 7) {
                    if (this.offsetLeftBox[i].dom.getAttribute('data-disable') === '0') {
                      if (this.offsetLeftBox[i + 3].dom.getAttribute('data-disable') === '0' &&
                        this.offsetLeftBox[i + 4].dom.getAttribute('data-disable') === '0' &&
                        this.offsetLeftBox[i - 1].dom.getAttribute('data-disable') === '0') {
                        this.addLeft = this.offsetLeftBox[i - 1].yLeft
                        this.addTop = this.offsetLeftBox[i - 1].yTop
                        this.addWidth = this.offsetLeftBox[i - 1].width
                        this.addHeight = this.offsetLeftBox[i - 1].height
                        this.itemBox = this.offsetLeftBox[i - 1]
                        this.offsetLeftBox[i].dom.style.background = 'rgb(0, 0, 0,0.2)'
                        this.offsetLeftBox[i + 3].dom.style.background = 'rgb(0, 0, 0,0.2)'
                        this.offsetLeftBox[i + 4].dom.style.background = 'rgb(0, 0, 0,0.2)'
                        this.offsetLeftBox[i - 1].dom.style.background = 'rgb(0, 0, 0,0.2)'
                        return false
                      };
                    };
                  } else {
                    if (this.offsetLeftBox[i].dom.getAttribute('data-disable') === '0') {
                      if (this.offsetLeftBox[i + 4].dom.getAttribute('data-disable') === '0' &&
                        this.offsetLeftBox[i + 1].dom.getAttribute('data-disable') === '0' &&
                        this.offsetLeftBox[i + 5].dom.getAttribute('data-disable') === '0') {
                        this.addLeft = this.offsetLeftBox[i].yLeft
                        this.addTop = this.offsetLeftBox[i].yTop
                        this.addWidth = this.offsetLeftBox[i].width
                        this.addHeight = this.offsetLeftBox[i].height
                        this.itemBox = this.offsetLeftBox[i]
                        this.offsetLeftBox[i].dom.style.background = 'rgb(0, 0, 0,0.2)'
                        this.offsetLeftBox[i + 4].dom.style.background = 'rgb(0, 0, 0,0.2)'
                        this.offsetLeftBox[i + 1].dom.style.background = 'rgb(0, 0, 0,0.2)'
                        this.offsetLeftBox[i + 5].dom.style.background = 'rgb(0, 0, 0,0.2)'
                        return false
                      };
                    };
                  };
                } else {
                  if (i === 8 || i === 9 || i === 10) {
                    if (this.offsetLeftBox[i - 4].dom.getAttribute('data-disable') === '0' &&
                      this.offsetLeftBox[i - 3].dom.getAttribute('data-disable') === '0' &&
                      this.offsetLeftBox[i + 1].dom.getAttribute('data-disable') === '0') {
                      this.addLeft = this.offsetLeftBox[i - 4].yLeft
                      this.addTop = this.offsetLeftBox[i - 4].yTop
                      this.addWidth = this.offsetLeftBox[i - 4].width
                      this.addHeight = this.offsetLeftBox[i - 4].height
                      this.itemBox = this.offsetLeftBox[i - 4]
                      this.offsetLeftBox[i].dom.style.background = 'rgb(0, 0, 0,0.2)'
                      this.offsetLeftBox[i - 4].dom.style.background = 'rgb(0, 0, 0,0.2)'
                      this.offsetLeftBox[i - 3].dom.style.background = 'rgb(0, 0, 0,0.2)'
                      this.offsetLeftBox[i + 1].dom.style.background = 'rgb(0, 0, 0,0.2)'
                      return false
                    };
                  };
                  if (i === 11) {
                    if (this.offsetLeftBox[i - 5].dom.getAttribute('data-disable') === '0' &&
                      this.offsetLeftBox[i - 4].dom.getAttribute('data-disable') === '0' &&
                      this.offsetLeftBox[i - 1].dom.getAttribute('data-disable') === '0') {
                      this.addLeft = this.offsetLeftBox[i - 5].yLeft
                      this.addTop = this.offsetLeftBox[i - 5].yTop
                      this.addWidth = this.offsetLeftBox[i - 5].width
                      this.addHeight = this.offsetLeftBox[i - 5].height
                      this.itemBox = this.offsetLeftBox[i - 5]
                      this.offsetLeftBox[i].dom.style.background = 'rgb(0, 0, 0,0.2)'
                      this.offsetLeftBox[i - 5].dom.style.background = 'rgb(0, 0, 0,0.2)'
                      this.offsetLeftBox[i - 4].dom.style.background = 'rgb(0, 0, 0,0.2)'
                      this.offsetLeftBox[i - 1].dom.style.background = 'rgb(0, 0, 0,0.2)'
                      return false
                    };
                  };
                };
              };
            };
          };
        };
        if (this.allBox.oLeft < x && x < this.allBox.oRight) {
          if (this.allBox.oTop < y && y < this.allBox.oBottom) {
            //= =============4*3  Start==============
            if (this.dragStartType.ControlWidth === 4 && this.dragStartType.ControlHeight === 3) {
              for (let b = 0; b < this.offsetLeftBox.length; b++) {
                if (this.offsetLeftBox[b].dom.getAttribute('data-disable') === '0') {
                  this.addLeft = this.allBox.yLeft
                  this.addTop = this.allBox.yTop
                  this.addWidth = this.allBox.width
                  this.addHeight = this.allBox.height
                  this.itemBox = -1
                  this.offsetLeftBox[b].dom.style.background = 'rgb(0, 0, 0,0.2)'
                };
              };
            };
          };
        };
      },

      dragend (event) {
        let fives = 0
        event.dataTransfer.clearData()
        // 松开鼠标后添加自定义属性
        let newDom = $('.xy-drag-box')
        for (let i = 0; i < newDom.length; i++) {
          newDom.eq(i).css({ background: '#fff' })
          //= =============1*1  Start==============
          if (this.dragStartType.ControlWidth === 1 && this.dragStartType.ControlHeight === 1) {
            if (this.itemBox.index === i) {
              if (newDom.eq(this.itemBox.index).attr('data-disable') === '0') {
                newDom.eq(i).addClass('grid-lay-none')
                newDom.eq(i).attr('data-disable', '1')
                newDom.eq(this.itemBox.index).attr('data-xy-style', 1)
                newDom.eq(this.itemBox.index).attr('data-xy-one', this.itemBox.index)
              };
            };
          };
          //= =============1*2  Start==============
          if (this.dragStartType.ControlWidth === 1 && this.dragStartType.ControlHeight === 2) {
            if ((this.itemBox.index + 4) < 12) {
              if (newDom.eq(this.itemBox.index).attr('data-disable') === '0') {
                if (newDom.eq(this.itemBox.index + 4).attr('data-disable') === '0') {
                  newDom.eq(this.itemBox.index).addClass('grid-lay-none')
                  newDom.eq(this.itemBox.index).attr('data-disable', '1')
                  newDom.eq(this.itemBox.index + 4).addClass('grid-lay-none')
                  newDom.eq(this.itemBox.index + 4).attr('data-disable', '1')
                  newDom.eq(this.itemBox.index).attr('data-xy-style', 2)
                  newDom.eq(this.itemBox.index).attr('data-xy-one', this.itemBox.index)
                  newDom.eq(this.itemBox.index).attr('data-xy-two', (this.itemBox.index + 4))
                };
              };
            } else {
              if (this.itemBox.index === 8 || this.itemBox.index === 9 || this.itemBox.index === 10 || this.itemBox.index === 11) {
                if (newDom.eq(this.itemBox.index).attr('data-disable') === '0') {
                  if (newDom.eq(this.itemBox.index - 4).attr('data-disable') === '0') {
                    newDom.eq(this.itemBox.index).addClass('grid-lay-none')
                    newDom.eq(this.itemBox.index).attr('data-disable', '1')
                    newDom.eq(this.itemBox.index - 4).addClass('grid-lay-none')
                    newDom.eq(this.itemBox.index - 4).attr('data-disable', '1')
                    newDom.eq(this.itemBox.index - 4).attr('data-xy-style', 2)
                    newDom.eq(this.itemBox.index - 4).attr('data-xy-one', this.itemBox.index - 4)
                    newDom.eq(this.itemBox.index - 4).attr('data-xy-two', (this.itemBox.index))
                  };
                };
              }
            };
          };
          //= =============2*1  Start==============
          if (this.dragStartType.ControlWidth === 2 && this.dragStartType.ControlHeight === 1) {
            if (this.itemBox.index === 3 || this.itemBox.index === 7 || this.itemBox.index === 11) {
              if (newDom.eq(this.itemBox.index).attr('data-disable') === '0') {
                if (newDom.eq(this.itemBox.index - 1).attr('data-disable') === '0') {
                  newDom.eq(this.itemBox.index).addClass('grid-lay-none')
                  newDom.eq(this.itemBox.index).attr('data-disable', '1')
                  newDom.eq(this.itemBox.index - 1).addClass('grid-lay-none')
                  newDom.eq(this.itemBox.index - 1).attr('data-disable', '1')
                  newDom.eq(this.itemBox.index).attr('data-xy-style', 3)
                  newDom.eq(this.itemBox.index).attr('data-xy-one', this.itemBox.index - 1)
                  newDom.eq(this.itemBox.index).attr('data-xy-two', (this.itemBox.index))
                };
              };
            } else {
              if (newDom.eq(this.itemBox.index + 1).attr('data-disable') === '0') {
                newDom.eq(this.itemBox.index).addClass('grid-lay-none')
                newDom.eq(this.itemBox.index).attr('data-disable', '1')
                newDom.eq(this.itemBox.index + 1).addClass('grid-lay-none')
                newDom.eq(this.itemBox.index + 1).attr('data-disable', '1')
                newDom.eq(this.itemBox.index).attr('data-xy-style', 3)
                newDom.eq(this.itemBox.index).attr('data-xy-one', this.itemBox.index)
                newDom.eq(this.itemBox.index).attr('data-xy-two', (this.itemBox.index + 1))
              };
            };
          };
          //= =============2*2  Start==============
          if (this.dragStartType.ControlWidth === 2 && this.dragStartType.ControlHeight === 2) {
            if ((this.itemBox.index + 4) < 12) {
              if (this.itemBox.index === 3 || this.itemBox.index === 7) {
                if (newDom.eq(this.itemBox.index).attr('data-disable') === '0') {
                  if (newDom.eq(this.itemBox.index + 3).attr('data-disable') === '0' &&
                    newDom.eq(this.itemBox.index + 4).attr('data-disable') === '0' &&
                    newDom.eq(this.itemBox.index - 1).attr('data-disable') === '0') {
                    newDom.eq(this.itemBox.index).addClass('grid-lay-none')
                    newDom.eq(this.itemBox.index).attr('data-disable', '1')
                    newDom.eq(this.itemBox.index + 3).addClass('grid-lay-none')
                    newDom.eq(this.itemBox.index + 3).attr('data-disable', '1')
                    newDom.eq(this.itemBox.index + 4).addClass('grid-lay-none')
                    newDom.eq(this.itemBox.index + 4).attr('data-disable', '1')
                    newDom.eq(this.itemBox.index - 1).addClass('grid-lay-none')
                    newDom.eq(this.itemBox.index - 1).attr('data-disable', '1')
                    newDom.eq(this.itemBox.index - 1).attr('data-xy-style', 4)
                    newDom.eq(this.itemBox.index - 1).attr('data-xy-one', this.itemBox.index - 1)
                    newDom.eq(this.itemBox.index - 1).attr('data-xy-two', this.itemBox.index + 4)
                  };
                };
              } else {
                if (newDom.eq(this.itemBox.index).attr('data-disable') === '0') {
                  if (newDom.eq(this.itemBox.index + 4).attr('data-disable') === '0' &&
                    newDom.eq(this.itemBox.index + 1).attr('data-disable') === '0' &&
                    newDom.eq(this.itemBox.index + 5).attr('data-disable') === '0') {
                    newDom.eq(this.itemBox.index).addClass('grid-lay-none')
                    newDom.eq(this.itemBox.index).attr('data-disable', '1')
                    newDom.eq(this.itemBox.index + 4).addClass('grid-lay-none')
                    newDom.eq(this.itemBox.index + 4).attr('data-disable', '1')
                    newDom.eq(this.itemBox.index + 1).addClass('grid-lay-none')
                    newDom.eq(this.itemBox.index + 1).attr('data-disable', '1')
                    newDom.eq(this.itemBox.index + 5).addClass('grid-lay-none')
                    newDom.eq(this.itemBox.index + 5).attr('data-disable', '1')
                    newDom.eq(this.itemBox.index).attr('data-xy-style', 4)
                    newDom.eq(this.itemBox.index).attr('data-xy-one', this.itemBox.index)
                    newDom.eq(this.itemBox.index).attr('data-xy-two', (this.itemBox.index + 5))
                  }
                }
              };
            } else {
              if (this.itemBox.index === 8 || this.itemBox.index === 9 || this.itemBox.index === 10) {
                if (newDom.eq(this.itemBox.index - 4).attr('data-disable') === '0' &&
                  newDom.eq(this.itemBox.index - 3).attr('data-disable') === '0' &&
                  newDom.eq(this.itemBox.index + 1).attr('data-disable') === '0') {
                  newDom.eq(this.itemBox.index).addClass('grid-lay-none')
                  newDom.eq(this.itemBox.index).attr('data-disable', '1')
                  newDom.eq(this.itemBox.index - 4).addClass('grid-lay-none')
                  newDom.eq(this.itemBox.index - 4).attr('data-disable', '1')
                  newDom.eq(this.itemBox.index - 3).addClass('grid-lay-none')
                  newDom.eq(this.itemBox.index - 3).attr('data-disable', '1')
                  newDom.eq(this.itemBox.index + 1).addClass('grid-lay-none')
                  newDom.eq(this.itemBox.index + 1).attr('data-disable', '1')
                  newDom.eq(this.itemBox.index - 4).attr('data-xy-style', 4)
                  newDom.eq(this.itemBox.index - 4).attr('data-xy-one', (this.itemBox.index - 4))
                  newDom.eq(this.itemBox.index - 4).attr('data-xy-two', (this.itemBox.index + 1))
                };
              };
              if (this.itemBox.index === 11) {
                if (newDom.eq(this.itemBox.index - 5).attr('data-disable') === '0' &&
                  newDom.eq(this.itemBox.index - 4).attr('data-disable') === '0' &&
                  newDom.eq(this.itemBox.index - 1).attr('data-disable') === '0') {
                  newDom.eq(this.itemBox.index).addClass('grid-lay-none')
                  newDom.eq(this.itemBox.index).attr('data-disable', '1')
                  newDom.eq(this.itemBox.index - 5).addClass('grid-lay-none')
                  newDom.eq(this.itemBox.index - 5).attr('data-disable', '1')
                  newDom.eq(this.itemBox.index - 4).addClass('grid-lay-none')
                  newDom.eq(this.itemBox.index - 4).attr('data-disable', '1')
                  newDom.eq(this.itemBox.index - 1).addClass('grid-lay-none')
                  newDom.eq(this.itemBox.index - 1).attr('data-disable', '1')
                  newDom.eq(this.itemBox.index - 5).attr('data-xy-style', 4)
                  newDom.eq(this.itemBox.index - 5).attr('data-xy-one', (this.itemBox.index - 5))
                  newDom.eq(this.itemBox.index - 5).attr('data-xy-two', this.itemBox.index)
                };
              }
            };
          };
          //= =============4*3  Start==============
          if (this.dragStartType.ControlWidth === 4 && this.dragStartType.ControlHeight === 3) {
            if (newDom.eq(i).attr('data-disable') === '1') {
              fives = 1
            };
          };
        };
        if (this.dragStartType.ControlWidth === 4 && this.dragStartType.ControlHeight === 3) {
          if (fives === 0 && this.itemBox === -1) {
            newDom.addClass('grid-lay-none')
            newDom.attr('data-disable', '1')
            newDom.attr('data-xy-style', 5)
            newDom.attr('data-xy-one', 0)
            newDom.attr('data-xy-two', 11)
          };
        };
      },

      drop (event) {
        event.preventDefault()
        event.stopPropagation()
        // 结束拖拽后添加模板
        let dropDom = $('#templateModule')
        let childDom = ''
        let endDom = $('.xy-drag-box')
        let rh1 = 1
        let rh2 = 1
        let rh3 = 1
        let rh4 = 1
        let rh5 = 1
        let nowi = ''
        if (this.dragStartType.ControlWidth === 1 && this.dragStartType.ControlHeight === 1) {
          if (this.itemBox !== null) {
            for (let i = 0; i < endDom.length; i++) {
              if (this.itemBox.index === i) {
                nowi = i
                if (endDom.eq(i).attr('data-disable') === '0') {
                  rh1 = 0
                } else {
                  rh1 = 1
                };
              };
            };
          };
          if (rh1 === 0) {
            childDom = `<div style="position:absolute;
            left:${this.addLeft}px;
            top:${this.addTop}px;
            width:${this.addWidth}px;
            height:${this.addHeight}px;
            background:rgba(0,0,0,0.5);
            border-radius:6px;" 
            class="hover-template"
            data-nowi="${nowi}">
              <img src="${require('@/assets/common/infoPublic/classCard/' + this.nowImg)}" style='width:100%;height:100%;'>
              <i class='iconfont del-template-img' data-indexs="${this.itemBox.index}">&#xe6d8;</i>
            </div>`
            dropDom.append(childDom)
          } else {
            this.xy.msgError('请按照正确的方式拖拽。')
            return false
          };
        };
        if (this.dragStartType.ControlWidth === 1 && this.dragStartType.ControlHeight === 2) {
          if (this.itemBox !== null) {
            for (let j = 0; j < endDom.length; j++) {
              if (this.itemBox.index === j) {
                nowi = j
                if (endDom.eq(j).attr('data-disable') === '0') {
                  rh2 = 0
                } else {
                  rh2 = 1
                };
              };
            };
          };
          if (rh2 === 0) {
            childDom = `<div style="position:absolute;
            left:${this.addLeft}px;
            top:${this.addTop}px;
            width:${this.addWidth}px;
            height:${this.addHeight * 2 + 20}px;
            background:rgba(0,0,0,0.5);
            border-radius:6px;"
            class="hover-template"
            data-nowi="${nowi}">
              <img src="${require('@/assets/common/infoPublic/classCard/' + this.nowImg)}" style='width:100%;height:100%;'>
              <i class='iconfont del-template-img' data-indexs="${this.itemBox.index}">&#xe6d8;</i>
            </div>`
            dropDom.append(childDom)
          } else {
            this.xy.msgError('请按照正确的方式拖拽。')
            return false
          };
        };
        if (this.dragStartType.ControlWidth === 2 && this.dragStartType.ControlHeight === 1) {
          if (this.itemBox !== null) {
            for (let k = 0; k < endDom.length; k++) {
              if (this.itemBox.index === k) {
                nowi = k
                if (endDom.eq(k).attr('data-disable') === '0') {
                  rh3 = 0
                } else {
                  rh3 = 1
                };
              };
            };
          };
          if (rh3 === 0) {
            childDom = `<div style="position:absolute;
            left:${this.addLeft}px;
            top:${this.addTop}px;
            width:${this.addWidth * 2 + 20}px;
            height:${this.addHeight}px;
            background:rgba(0,0,0,0.5);
            border-radius:6px;"
            class="hover-template"
            data-nowi="${nowi}">
              <img src="${require('@/assets/common/infoPublic/classCard/' + this.nowImg)}" style='width:100%;height:100%;'>
              <i class="iconfont del-template-img" data-indexs="${this.itemBox.index}">&#xe6d8;</i>
            </div>`
            dropDom.append(childDom)
          } else {
            this.xy.msgError('请按照正确的方式拖拽。')
            return false
          };
        };
        if (this.dragStartType.ControlWidth === 2 && this.dragStartType.ControlHeight === 2) {
          if (this.itemBox !== null) {
            for (let g = 0; g < endDom.length; g++) {
              if (this.itemBox.index === g) {
                nowi = g
                if (endDom.eq(g).attr('data-disable') === '0') {
                  rh4 = 0
                } else {
                  rh4 = 1
                };
              };
            };
          };
          if (rh4 === 0) {
            childDom = `<div style="position:absolute;
            left:${this.addLeft}px;
            top:${this.addTop}px;
            width:${this.addWidth * 2 + 20}px;
            height:${this.addHeight * 2 + 20}px;
            background:rgba(0,0,0,0.5);
            border-radius:6px;"
            class="hover-template"
            data-nowi="${nowi}">
              <img src="${require('@/assets/common/infoPublic/classCard/' + this.nowImg)}" style='width:100%;height:100%;'>
              <i class="iconfont del-template-img" data-indexs="${this.itemBox.index}">&#xe6d8;</i>
            </div>`
            dropDom.append(childDom)
          } else {
            this.xy.msgError('请按照正确的方式拖拽。')
            return false
          };
        };
        if (this.dragStartType.ControlWidth === 4 && this.dragStartType.ControlHeight === 3) {
          if (this.itemBox !== null) {
            for (let v = 0; v < endDom.length; v++) {
              nowi = v
              if (endDom.eq(v).attr('data-disable') !== '0') {
                rh5 = 1
                break
              } else {
                rh5 = 0
              };
            };
          };
          if (rh5 === 0) {
            childDom = `<div style="position:absolute;
            left:${this.addLeft}px;
            top:${this.addTop}px;
            width:${this.addWidth}px;
            height:${this.addHeight}px;
            background:rgba(0,0,0,0.5);
            border-radius:6px;"
            class="hover-template"
            data-nowi="${nowi}">
              <img src="${require('@/assets/common/infoPublic/classCard/' + this.nowImg)}" style='width:100%;height:100%;'>
              <i class="iconfont del-template-img" data-indexs="` + -1 + `">&#xe6d8;</i>
            </div>`
            dropDom.append(childDom)
          } else {
            this.xy.msgError('请按照正确的方式拖拽。')
            return false
          };
        };
        let thisX = 0; let thisY = 0
        // 获取放置的坐标
        if (this.itemBox !== null) {
          for (let t = 0; t < this.dropList.length; t++) {
            if (this.itemBox.index === t) {
              thisX = this.dropList[t].startX
              thisY = this.dropList[t].startY
            };
          };
        };
        // 要保存的数据
        this.addTemplateList.push({
          index: this.itemBox.index,
          width: this.dragStartType.ControlWidth,
          height: this.dragStartType.ControlHeight,
          startX: thisX,
          startY: thisY,
          controlType: this.dragStartType.ControlType,
          controlImgStyle: this.dragStartType.ControlImgStyle,
          controlTypeCode: this.dragStartType.ControlTypeCode,
          controlColor: this.dragStartType.ControlColor
        })
      },

      // 保存
      async addTemplate () {
        let _this = this
        if (this.TemplateDescribe === '') {
          this.xy.msgError('模板简介不能为空。')
          return false
        };
        if (this.TemplateName === '') {
          this.xy.msgError('模板名称不能为空。')
          return false
        };
        if (this.addTemplateList.length < 1) {
          this.xy.msgError('模板不能为空。')
          return false
        };
        event.preventDefault()
        this.xy.loading()
        let canvas = document.createElement('canvas')
        // 获取指定的宽高
        const width = parseInt(window.getComputedStyle(this.$refs.tamplateble).width)
        const height = parseInt(window.getComputedStyle(this.$refs.tamplateble).height)
        // 宽高扩大 2 倍 处理图片模糊
        canvas.width = width * 2 * this.ratio
        canvas.height = height * 2 * this.ratio
        canvas.style.width = width * this.ratio + 'px'
        canvas.style.height = height * this.ratio + 'px'
        const context = canvas.getContext('2d')
        context.scale(2, 2)
        html2canvas(this.$refs.tamplateble, {
          canvas
        }).then((canvas) => {
          let blob = this.getBlob(canvas)
          let oMyForm = new FormData()
          let fileName = 'template' + '.jpeg'
          oMyForm.append('file', blob, fileName)
          oMyForm.append('BussinessStr', 0)
          _this.savePingImg(fileName, blob, blob.size)
        })
      },
      // 上传屏保
      savePingImg (fileName, oMyForm, size) {
        let upData = []
        upData.push({
          UploadFile: fileName,
          UploadFileSize: size
        })
        this.xy.post(this.apiPath + `/api/Template/UploadTemplateThumbnail`, {
          Data: upData,
          BussinessStr: ''
        }).then(res => {
          if (res.success) {
            this.uploadFunc(oMyForm, res.data.result.Data)
          }
        })
      },
      uploadFunc (oMyForm, callbackData) {
        // put中的三个参数url，data，header中的type
        this.xy.put(callbackData[0].UpLoadAddress, oMyForm, `${oMyForm.type}`).then().catch(err => {
          if (err.message.indexOf('403') !== -1) {
            this.xy.msgError('服务器出错，上传失败，请联系管理员。')
            return false
          }
        })
        this.Create(callbackData[0].UploadFileNames)
      },
      // 创建
      async Create (result) {
        let res = await this.xy.post(`${this.apiPath}/api/Template/Create`, {
          TemplateName: this.TemplateName,
          TemplateDescribe: this.TemplateDescribe,
          LayoutData: this.addTemplateList,
          ScreenMode: 0,
          TemplateStyleID: this.styleID,
          TemplateStyleCode: this.styleCode,
          TemplateThumbnail: result
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('新建模板成功。')
          this.$router.back()
        } else {
          this.xy.mError('创建失败', res.msg)
        }
      },

      // 获取blob对象
      getBlob (dataURI) {
        let data = dataURI.toDataURL('image/jpeg', 1)
        let datas = data.split(',')[1]
        let byteString = window.atob(datas)
        let ab = new ArrayBuffer(byteString.length)
        let ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ia], {
          type: 'image/jpeg'
        })
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

</style>
