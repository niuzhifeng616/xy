<template>
  <div class="xy-content-module" id="XyContentModuleReplace" @click="allClick">
    <!-- 屏保管理-创建横版 // 缺少面包屑 -->
    <div class="xy-content-title" style="display:flex;justify-content:space-between;align-items:center">
      <div>
        <!-- <FormItem label="屏保名称：" labelFor="welcomeName" :label-width="80">
          <Input maxLength="10" v-cloak v-model="welcomeName" elementId="welcomeName" style="width:300px;margin-right:10px;" />
        </FormItem> -->
        <span style="color:rgba(0,0,0,0.6);" labelFor="welcomeName" :label-width="80">屏保名称：</span>
        <Input maxLength="10" v-cloak v-model="welcomeName" elementId="welcomeName" style="width:300px;margin-right:10px;" />
        <span style="color:rgba(0,0,0,0.6);margin-left:24px;">等待时间：</span>
        <Select v-model="latencyTime" style="width:150px">
            <Option value="0">不可操作，永远显示</Option>
            <Option value="1">1分钟</Option>
            <Option value="2">2分钟</Option>
            <Option value="3">3分钟</Option>
            <Option value="5">5分钟</Option>
            <Option value="10">10分钟</Option>
            <Option value="15">15分钟</Option>
        </Select>
        <span style="color:rgba(0,0,0,0.6);margin-left:24px;">起止时间：</span>
        <DatePicker type="datetimerange"
            v-cloak
            :editable="false"
            v-model="times"
            @on-change="timeChange"
            placement="bottom-end"
            placeholder="开始时间-结束时间"
            style="width: 300px;">
        </DatePicker>
      </div>
    </div>
    <div class="xy-content-body">
        <div style="display:flex;justify-content:flex-start;margin-bottom: 60px;">
            <div style="overflow-x:auto">
                <Button type="primary" icon="ios-add" @click="addTextBox">添加文本框</Button>
                <div class="welcome-bg" ref="tamplateble" id="tamplateble" :style="{borderRadius:'6px'}" v-cloak>
                    <div class="postionBox" :id="item.id" v-for="(item,index) in boxData" :key="index" :style="{'z-index':item.index,'top':item.yVal+'px','left':item.xVal+'px'}">
                        <div class="style-box">
                            <div>
                              <Select v-model="item.fontSize"
                                style="width:63px;height:24px;"
                                size="small"
                                :style="{'z-index':item.index}">
                                <Option :value="fontSize.val" v-for="fontSize in fontSizeData" :key="fontSize.key">{{fontSize.val}}</Option>
                              </Select>
                            </div>
                            <div class="style-bold" @click.stop="item.fontWeight=!item.fontWeight"
                                :class="item.fontWeight?'style-bold-active':''">B</div>
                            <div class="font-color" @click.stop="item.isShowColor=!item.isShowColor">
                                <div class="font-color-sample">
                                    <div style="height:20px;">A</div>
                                    <div :style="{background:item.colorVal.val,height:'2px',margin:'0 2px'}"></div>
                                </div>
                                <div style="background:#E6E6E6;">
                                    <Icon type="md-arrow-dropdown"></Icon>
                                </div>
                            </div>
                            <div class="font-color-box" v-if="item.isShowColor" :style="{'z-index':item.index}">
                                <div class="color-box-header">标准色</div>
                                <ul class="color-box-content">
                                    <li class="color-box-li"
                                        v-for="(color,index) in colorData"
                                        :key="index"
                                        @click.stop="colorSelect(item,color)"
                                        :style="{'background':color.val}"></li>
                                </ul>
                            </div>
                        </div>
                        <Icon type="ios-expand" class="move-btn" v-bind:class="item.isShowMask?'move-btn-active':''"
                          @click="item.isShowMask=!item.isShowMask"></Icon>
                        <Icon type="ios-trash-outline" class="del-btn" @click.stop="delTextBox(item)"></Icon>
                        <div class="changeBox" contenteditable="true"
                          @click.stop="textBoxFocus(item)"
                          :style="{color:item.colorVal.val,
                          fontWeight:item.fontWeight?'700':'400',
                          fontSize:item.fontSize+ 'px' }"></div>
                        <div class="changeBox1" v-if="item.isShowMask">
                          <Icon type="ios-expand" size="60" color="#ccc"></Icon>
                        </div>
                        <div class="top"></div>
                        <div class="right"></div>
                        <div class="bottom"></div>
                        <div class="left"></div>
                    </div>
                </div>
            </div>
            <div>
                <div style="display:flex;justify-content:space-between;align-items:center;height:40px;">
                    <p style="color:rgba(0,0,0,0.6);">当前图片：{{imgList.length}}张</p>
                    <div>
                        <!-- <Upload :action='(apiPath + "/api/Resource/UploadScreenSaverImage?ScreenMode=0")'
                                :headers="{'Access-Control-Allow-Origin' : '*','XYTOKEN':xy.getCookie('.XYTOKEN')}"
                                :before-upload="beforeUpload"
                                :on-success="handleSuccess" :show-upload-list="false" :max-size="1024">
                            <div style="cursor:pointer;">
                                <Icon type="ios-add" size="26" color="#4196FF" style="vertical-align:middle;"></Icon>
                                <span style="font-weight:400;color:#4196FF">添加图片</span>
                                <tooltip :max-width="200"
                                  placement="right-start"
                                  content="注意：为了保证展示效果，建议您上传长宽比例为16:9的图片，图片最大不能超过10M。">
                                    <icon type="md-alert" color="#6489d4" size="20"></icon>
                                </tooltip>
                            </div>
                        </Upload> -->
                        <XyUpfile
                          :showTxt="true"
                          ref="upfile"
                          :fileAccept="fileAccept"
                          :fileSize="size"
                          :importPath="upUrl"
                          @UploadOk="UploadOk"
                          :upTxt="'添加图片'"
                          :showTip="true"
                          :tipTxt="'注意：为了保证展示效果，建议您上传长宽比例为16:9的图片，图片最大不能超过10M。'"
                          :tipIconStyle="{ fontSize: '20px', color: '#6489d4' }"
                          >
                        </XyUpfile>
                    </div>
                </div>
                <ul class="img-ul" style="width:422px;">
                    <li class="img-li" v-for="(item, index) in imgList" :key="index">
                        <img :src="item.DownloadLink" v-cloak
                          style="width:100%;height:150px;border-radius:6px;box-shadow: 0px 10px 10px -6px rgba(0,0,0,0.4);"
                          class="cursor-p" @click="changeBg(item)" />
                        <Icon type="ios-trash-outline" class="img-del" @click="delImg(item)" v-if="!item.IsDefault"></Icon>
                        <Icon type="md-checkmark-circle-outline" class="img-select" v-if="item.ResourceID === BackgroundID"></Icon>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="submit-fix-btn">
        <Button class="xy-btn-primary" shape="circle" @click="submitCreat">保存</Button>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import html2canvas from 'html2canvas'
  import XyUpfile from '@/components/upFileOptimize/upFile.vue'
  window.jQuery = $
  export default {
    name: 'CreateHorizontalWelcome',
    components: {
      XyUpfile
    },
    data () {
      return {
        welcomeName: '',
        welcomeBgExample: '',
        times: [],
        imgList: [],
        BackgroundID: '',
        boxData: [
          {
            id: 'textBox1',
            index: 1,
            isShowColor: false,
            isShowStyleBox: false,
            colorVal: {
              key: 2,
              val: '#000'
            },
            fontSize: 18,
            fontWeight: false,
            xVal: '',
            yVal: '',
            isShowMask: false
          }
        ],
        latencyTime: '0',
        fontSizeData: [
          { key: 0, val: 12 },
          { key: 1, val: 14 },
          { key: 2, val: 16 },
          { key: 3, val: 18 },
          { key: 4, val: 20 },
          { key: 5, val: 22 },
          { key: 6, val: 24 },
          { key: 7, val: 26 },
          { key: 8, val: 28 },
          { key: 9, val: 36 },
          { key: 10, val: 48 },
          { key: 11, val: 60 },
          { key: 12, val: 72 }
        ],
        colorData: [
          {
            key: 1,
            val: '#fff'
          },
          {
            key: 2,
            val: '#000'
          },
          {
            key: 3,
            val: '#FF0000'
          },
          {
            key: 4,
            val: '#385E0F'
          },
          {
            key: 5,
            val: '#FFC000'
          },
          {
            key: 6,
            val: '#00B050'
          },
          {
            key: 7,
            val: '#00B0F0'
          },
          {
            key: 8,
            val: '#FFFF00'
          },
          {
            key: 9,
            val: '#0070C0'
          },
          {
            key: 10,
            val: '#002060'
          },
          {
            key: 11,
            val: '#7030A0'
          },
          {
            key: 12,
            val: '#13D7CB'
          }
        ],
        oMyForm: '',
        apiPath: '',
        // 上传资源优化
        fileAccept: 'image/jpg, image/jpeg, image/png, image/bmp',
        size: 10,
        upUrl: this.$store.state.apiPath + '/api/Resource/UploadScreenSaverImage',
        imgsLists: [],
        updingUrl: ''
      }
    },
    destroyed () {
      window.onresize = null
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.getAllScreenSaverImage(false)
    },
    mounted () {
      this.$nextTick(() => {
        let isDrop = false // 移动状态的判断鼠标按下才能移动
        let moveDom = null// 移动的DOM
        let downX = 0; let downY = 0 // 要移动DOM的坐标
        let moveX = 0; let moveY = 0 // 移动后坐标
        let boxHeight = 0; let boxWidth = 0// 盒子的宽、高
        let maxHeight = ''// 最大高度
        let maxWidth = ''// 最小高度
        let direction = ''// 扩大缩小的方向
        let postionBox = ''// 定位的盒子
        let posTop = 0// 定位距离top的值
        let posLeft = 0// 定位距离left的值
        $('#XyContentModuleReplace').on('mousedown', '.changeBox1', function (e) {
          reset()
          let btnX = e.clientX
          let btnY = e.clientY
          let isMove = true
          postionBox = $(this).parents('.postionBox')
          maxHeight = $('.welcome-bg').innerHeight()
          maxWidth = $('.welcome-bg').innerWidth()
          let pbTop = postionBox.position().top
          let pbLeft = postionBox.position().left
          $(this).mousemove(function (ve) {
            if (isMove) {
              let btnMoveX = ve.clientX - btnX
              let btnMoveY = ve.clientY - btnY
              // 上下移动
              if (btnMoveY !== 0) {
                if (btnMoveY > 0) { // 往下移动输入框
                  if ((pbTop + btnMoveY + postionBox.height()) < (maxHeight - 50)) {
                    postionBox.css('top', pbTop + btnMoveY)
                  } else {
                    isMove = false
                    $(this).unbind()
                  }
                }
                if (btnMoveY < 0) { // 往上移动输入框
                  if ((pbTop + btnMoveY) > 50) {
                    postionBox.css('top', pbTop + btnMoveY)
                  } else {
                    isMove = false
                    $(this).unbind()
                  }
                }
              };
              // 左右移动
              if (btnMoveX !== 0) {
                if (btnMoveX > 0) { // 往右移动
                  if ((btnMoveX + pbLeft + postionBox.width()) < (maxWidth - 50)) {
                    postionBox.css('left', pbLeft + btnMoveX)
                  } else {
                    isMove = false
                    $(this).unbind()
                  }
                }
                if (btnMoveX < 0) { // 往左移动
                  if ((btnMoveX + pbLeft) > 50) {
                    postionBox.css('left', pbLeft + btnMoveX)
                  } else {
                    isMove = false
                    $(this).unbind()
                  }
                }
              }
            }
          })
          $(this).mouseup(function (ve) {
            isMove = false
            $(this).unbind()
          })
          e.stopPropagation()
        })
        $('#XyContentModuleReplace').on('mousedown', '.bottom', function (e) {
          downY = e.clientY
          moveDom = $(this)
          isDrop = true
          direction = 'bottom'
          postionBox = $(this).parents('.postionBox')
          maxWidth = $('.welcome-bg').innerWidth()
          maxHeight = $('.welcome-bg').innerHeight()
          posTop = postionBox.position().top
          boxHeight = postionBox.height()
          e.stopPropagation()
        })
        $('#XyContentModuleReplace').on('mousedown', '.top', function (e) {
          downY = e.clientY
          moveDom = $(this)
          isDrop = true
          direction = 'top'
          postionBox = $(this).parents('.postionBox')
          maxWidth = $('.welcome-bg').innerWidth()
          maxHeight = $('.welcome-bg').innerHeight()
          posTop = postionBox.position().top
          boxHeight = postionBox.height()
          e.stopPropagation()
        })
        $('#XyContentModuleReplace').on('mousedown', '.left', function (e) {
          downX = e.clientX
          moveDom = $(this)
          isDrop = true
          direction = 'left'
          postionBox = $(this).parents('.postionBox')
          maxWidth = $('.welcome-bg').innerWidth()
          maxHeight = $('.welcome-bg').innerHeight()
          posLeft = postionBox.position().left
          boxWidth = postionBox.width()
          e.stopPropagation()
        })
        $('#XyContentModuleReplace').on('mousedown', '.right', function (e) {
          downX = e.clientX
          moveDom = $(this)
          isDrop = true
          direction = 'right'
          postionBox = $(this).parents('.postionBox')
          maxWidth = $('.welcome-bg').innerWidth()
          maxHeight = $('.welcome-bg').innerHeight()
          posLeft = postionBox.position().left
          boxWidth = postionBox.width()
          e.stopPropagation()
        })
        $('#XyContentModuleReplace').on('mousemove', moveDom, function (e) {
          if (isDrop) {
            let brotherBox = moveDom.siblings('.changeBox')
            // 上下操作
            moveY = e.clientY - downY// 移动后的Y
            if (postionBox.height() <= maxHeight) { // 上下扩大高度，要小于最外层高度
              if (direction === 'top') {
                if (moveY > 0) { // 往下缩小高度
                  if (postionBox.height() > 100) {
                    postionBox.css('min-height', boxHeight - moveY)
                    brotherBox.css('min-height', boxHeight - moveY)
                    postionBox.css('top', posTop + moveY)
                  } else {
                    isDrop = false
                    moveDom.unbind()
                  }
                }
                if (moveY < 0) { // 往上扩大高度
                  if ((posTop + moveY) > 50) { // 往上扩大高度到最外层时，不允许再扩大高度
                    postionBox.css('min-height', boxHeight - moveY)
                    brotherBox.css('min-height', boxHeight - moveY)
                    postionBox.css('top', posTop + moveY)
                  } else {
                    isDrop = false
                    moveDom.unbind()
                  }
                }
              }
              if (direction === 'bottom') {
                if ((posTop + moveY + boxHeight) < (maxHeight - 50)) { // 往下扩大高度到最外层时，不允许再扩大高度
                  if (postionBox.height() >= 100) {
                    postionBox.css('min-height', boxHeight + moveY)
                    brotherBox.css('min-height', boxHeight + moveY)
                  } else {
                    postionBox.css('min-height', 100)
                    brotherBox.css('min-height', 100)
                    isDrop = false
                    moveDom.unbind()
                  }
                } else {
                  isDrop = false
                  moveDom.unbind()
                }
              }
            } else {
              isDrop = false
              moveDom.unbind()
            }
            // 左右操作
            moveX = e.clientX - downX// 移动到的X
            if (postionBox.width() <= maxWidth) { // 左右扩大宽度，要小于最外层宽度
              if (postionBox.width() === 100) { // 缩小宽度到100时候，停止
                isDrop = false
                moveDom.unbind()
              }
              if (direction === 'left') {
                if (moveX > 0) { // 往有缩小宽度
                  postionBox.width(boxWidth - moveX)
                  postionBox.css('left', posLeft + moveX)
                }
                if (moveX < 0) { // 往左扩大宽度
                  if (Math.abs(moveX) <= posLeft) {
                    postionBox.width(boxWidth - moveX)
                    postionBox.css('left', posLeft + moveX)
                  } else {
                    isDrop = false
                    moveDom.unbind()
                  }
                }
              }

              if (direction === 'right') {
                if ((posLeft + moveX + boxWidth) <= (maxWidth - 50)) { // 往右扩大宽度到最外层时，不允许再扩大宽度
                  postionBox.width(boxWidth + moveX)
                } else {
                  // postionBox.width(maxWidth);
                  isDrop = false
                  moveDom.unbind()
                }
              }
            }
          }
          e.stopPropagation()
        })
        $('#XyContentModuleReplace').on('mouseup', moveDom, function (e) {
          isDrop = false
          moveDom = null
          e.stopPropagation()
        })
        $('.changeBox').keydown(function () {
          let postionBox = $(this).parents('.postionBox')
          let heigthVal = postionBox.height()
          let pbTop = postionBox.position().top
          let maxHeight = $('.welcome-bg').innerHeight()
          if ((pbTop + heigthVal) >= (maxHeight - 100)) {
            postionBox.height(maxHeight - 110)
            return false
          }
        })
        function reset () {
          isDrop = false // 移动状态的判断鼠标按下才能移动
          moveDom = null // 移动的DOM
          downX = 0; downY = 0 // 要移动DOM的坐标
          moveX = 0; moveY = 0 // 移动后坐标
          boxHeight = 0; boxWidth = 0// 盒子的宽、高
          maxHeight = ''// 最大高度
          maxWidth = ''// 最小高度
          direction = ''// 扩大缩小的方向
          postionBox = ''// 定位的盒子
          posTop = 0// 定位距离top的值
          posLeft = 0// 定位距离left的值
        }
      })
    },
    methods: {
      // 上传资源优化
      UploadOk (list) {
        // 获取最终生成的需要提交的数据格式
        console.log(list)
        this.imgLists = list
        this.getViewImg(list[0].FileName)
      },
      getViewImg (url) {
        let params = {
          FileName: url,
          ScreenMode: 0
        }
        this.xy.post(`${this.apiPath}/api/Resource/SaveScreenSaverImage`, params).then(res => {
          if (res.success) {
            this.fileName = res.data.result.DownloadLink
            this.updingUrl = res.data.result.FileName
            let resData = res.data.result
            let strurl = resData.DownloadLink
            strurl = strurl.replace('\\\\', '\\\\')
            strurl = strurl.replace('\\', '\\')
            strurl = strurl.replace('\\', '\\')
            strurl = strurl.replace('\\', '\\')
            console.log(resData)
            this.welcomeBgExample = resData.FileName
            let bg = document.getElementById('tamplateble')
            bg.style.backgroundImage = `url(${strurl})`
            this.BackgroundID = resData.ResourceID // 默认图片ID
            this.getAllScreenSaverImage(true)
          }
        })
      },
      // 初始获取所有背景图
      async getAllScreenSaverImage (isUpload) {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/Resource/GetAllScreenSaverImage`, {
            screenMode: 0
          }
        )
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            this.imgList = res.data
            console.log(res.data)
            if (!isUpload) {
              let strurl = this.imgList[0].DownloadLink
              this.welcomeBgExample = this.imgList[0].FileName// 默认显示图片
              let bg = document.getElementById('tamplateble')
              bg.style.backgroundImage = `url(${strurl})`
              this.BackgroundID = this.imgList[0].ResourceID // 默认图片ID
            }
          };
        } else {
          this.xy.msgError(res.msg)
        }
      },
      beforeUpload () {
        if (this.imgList.length === 20) {
          this.xy.msgError('最多上传20张。')
          return false
        }
      },
      handleSuccess (res, file) {
        if (res.data.success) {
          let resData = res.data.result
          let strurl = resData.DownloadLink
          strurl = strurl.replace('\\\\', '\\\\')
          strurl = strurl.replace('\\', '\\')
          strurl = strurl.replace('\\', '\\')
          strurl = strurl.replace('\\', '\\')
          this.welcomeBgExample = resData.FileName
          let bg = document.getElementById('tamplateble')
          bg.style.backgroundImage = `url(${strurl})`
          this.BackgroundID = resData.ResourceID // 默认图片ID
          this.getAllScreenSaverImage(true)
        }
      },
      changeBg (item) {
        console.log(item)
        this.BackgroundID = item.ResourceID
        let strurl = item.DownloadLink
        strurl = strurl.replace('\\\\', '\\\\')
        strurl = strurl.replace('\\', '\\')
        strurl = strurl.replace('\\', '\\')
        strurl = strurl.replace('\\', '\\')
        let bg = document.getElementById('tamplateble')
        bg.style.backgroundImage = `url(${strurl})`
        this.welcomeBgExample = item.FileName
        document.getElementById('tamplateble').style.backgroundImage = 'url(' + strurl.replace(/\\/g, '/') + ')'
      },
      async delImg (item) {
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + `/api/Resource/DeleteScreenSaverImage?resourceID=` + item.ResourceID
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          this.getAllScreenSaverImage(false)
        } else {
          this.xy.mError('删除失败。', res.msg)
        }
      },
      timeChange (val) {
        this.times = val
      },
      // 添加输入框等操作
      addTextBox () {
        if (this.boxData.length < 10) {
          let obj = {
            id: 'textBox' + (this.boxData.length + 1),
            index: this.boxData.length + 1,
            isShowColor: false,
            isShowStyleBox: false,
            colorVal: {
              key: 2,
              val: '#000'
            },
            fontSize: 18,
            fontWeight: false,
            xVal: '',
            yVal: 100 + this.boxData.length * 15
          }
          this.boxData.push(obj)
        } else {
          this.xy.msgError('最多只能添加十个文本框。')
        }
      },
      textBoxFocus (val) {
        this.boxData.map(function (item) {
          item.isShowStyleBox = false
          return item
        })
        val.isShowStyleBox = true
      },
      allClick (val) {
        this.boxData.map(function (item) {
          item.isShowStyleBox = false
          return item
        })
      },
      delTextBox (val) {
        let index = this.boxData.map(function (item) { return item }).indexOf(val)
        if (index !== -1) {
          this.boxData.splice(index, 1)
        }
      },
      colorSelect: function (item, color) {
        item.colorVal = color
        item.isShowColor = false
      },
      // 保存
      async submitCreat () {
        let that = this
        if ($.trim(this.welcomeName) === '') {
          this.xy.msgError('屏保名称不能为空。')
          return false
        };
        if (this.times[0] === '' || this.times[1] === '' || this.times.length === 0) {
          this.xy.msgError('应用日期不能为空。')
          return false
        };
        let arr = []
        let welcomeBgX = $('.welcome-bg').offset().left
        let welcomeBgY = $('.welcome-bg').offset().top
        for (let i = 0; i < this.boxData.length; i++) {
          let temp1 = '#' + this.boxData[i].id
          let strHtml = $('' + temp1 + '').children('.changeBox').html().split('<div>')
          let textContent = ''
          for (let n = 0; n < strHtml.length; n++) {
            if (this.removeHTMLTag(strHtml[n]).length > 0) {
              if (n + 1 !== strHtml.length) {
                textContent += this.removeHTMLTag(strHtml[n]) + '\\r\\n'
              } else {
                textContent += this.removeHTMLTag(strHtml[n])
              }
            }
          }
          arr.push({
            FontFamily: 0,
            FontSize: this.boxData[i].fontSize,
            FontColor: this.boxData[i].colorVal.key,
            IsBold: this.boxData[i].fontWeight,
            Align: 0,
            IsItalic: false,
            TextContent: textContent,
            TextBoxHeight: $('' + temp1 + '').height(),
            TextBoxWidth: $('' + temp1 + '').width(),
            XAxis: parseInt($('' + temp1 + '').offset().left - welcomeBgX),
            YAxis: parseInt($('' + temp1 + '').offset().top - welcomeBgY)
          })
        }
        // 隐藏编辑框的操作和边框样式
        $('.style-box').hide()
        $('.move-btn').hide()
        $('.del-btn').hide()
        $('.top').hide()
        $('.right').hide()
        $('.bottom').hide()
        $('.left').hide()
        $('.changeBox').css('border', 'none')
        this.xy.loading()
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        let canvas = document.createElement('canvas')
        // 获取指定的宽高
        const width = parseInt(window.getComputedStyle(this.$refs.tamplateble).width)
        const height = parseInt(window.getComputedStyle(this.$refs.tamplateble).height)
        // 宽高扩大 2 倍 处理图片模糊
        canvas.width = width * 2
        canvas.height = height * 2
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        const context = canvas.getContext('2d')
        context.scale(2, 2)
        html2canvas(this.$refs.tamplateble, {
          canvas,
          useCORS: true
        }).then(canvas => {
          let blob = that.getBlob(canvas)
          that.oMyForm = new FormData()
          let fileName = 'template' + '.jpeg'
          that.oMyForm.append('file', blob, fileName)
          that.oMyForm.append('fileType', 'image')
          that.savePingImg(fileName, arr, blob, blob.size)
        })
      },
      // 上传屏保
      savePingImg (fileName, arr, blob, size) {
        let upData = []
        upData.push({
          UploadFile: fileName,
          UploadFileSize: size
        })
        this.xy.post(this.apiPath + `/api/Resource/UploadScreenSaverThumbnail`, {
          Data: upData,
          BussinessStr: ''
        }).then(res => {
          if (res.success) {
            this.uploadFunc(blob, res.data.result.Data, arr)
          }
        })
      },
      uploadFunc (blob, callbackData, arr) {
        // put中的三个参数url，data，header中的type
        this.xy.put(callbackData[0].UpLoadAddress, blob, `${blob.type}`).then().catch(err => {
          if (err.message.indexOf('403') !== -1) {
            this.xy.msgError('服务器出错，上传失败，请联系管理员。')
            return false
          }
        })
        this.UploadScreenSaverThumbnail(arr, callbackData[0].UploadFileNames)
      },
      // 保存屏保缩略图
      async UploadScreenSaverThumbnail (arr, adress) {
        let that = this
        let c = await that.xy.post(
          that.apiPath + `/api/Resource/CreateScreenSaver`, {
            ScreenSaverName: that.welcomeName,
            LatencyTime: that.latencyTime,
            ScreenMode: 0,
            BackgroundImage: that.welcomeBgExample,
            BackgroundDLink: '',
            ScreenThumbnail: adress,
            StartDate: that.xy.moment(that.times[0]).format('YYYY-MM-DD  HH:mm:ss'),
            EndDate: that.xy.moment(that.times[1]).format('YYYY-MM-DD  HH:mm:ss'),
            Contents: arr
          }
        )
        that.xy.unloading()
        if (c.success) {
          that.xy.msgSuc('创建成功。')
          that.$router.back()
        }
      },
      // 获取blob对象
      getBlob (dataURI) {
        var data = dataURI.toDataURL('image/jpeg', 1)
        var datas = data.split(',')[1]
        var byteString = window.atob(datas)
        var ab = new ArrayBuffer(byteString.length)
        var ia = new Uint8Array(ab)
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ia], {
          'Access-Control-Allow-Origin': '*',
          type: 'image/jpeg'
        })
      },
      removeHTMLTag (str) { // 过滤HTML标签
        str = str.replace(/<\/?[^>]*>/g, '') // 去除HTML tag
        str = str.replace(/[ | ]*\n/g, '\n') // 去除行尾空白
        str = str.replace(/\n[\s| | ]*\r/g, '\n') // 去除多余空行
        str = str.replace(/ /ig, '') // 去掉
        return str
      }
    }
  }
</script>
<style lang="less" scoped>/*屏保列表start*/
.xy-content-body{
  padding: 10px;
}
.horizontal-vertical-ul{
    display:flex;
    justify-content:flex-start;
    align-items:center;
}
.horizontal-vertical-ul li {
    font-size: 14px;
    color:rgba(51,51,51,0.6);
    padding:13px 5px;
    margin-right:50px;
    cursor:pointer;
}
.horizontal-vertical-active {
    color: #4196FF!important;
    border-bottom: 2px solid #4196FF;
}
.screen-saver-list {
    display: flex;
    justify-content: flex-start;
    flex-wrap:wrap;
}
.screen-saver-li-horizontal {
    margin: 10px;
    width: 290px;
    height: 317px;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(236,236,236,1);
}
.screen-saver-li-vertical {
    margin: 10px;
    width: 290px;
    height: 508px;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(236,236,236,1);
}
.screen-info {
    padding: 10px 20px;
    color: rgba(0,0,0,0.4);
    font-size: 14px;
}
.screen-btn-list {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 48px;
    line-height:48px;
    background: rgba(247,249,250,1);
    border-top: 1px solid rgba(236,236,236,1);
}
.screen-btn-list li {
    flex: 1;
    text-align: center;
    color: #878889;
    cursor:pointer;
}
.no-screen-btn {
    color: rgba(135,136,137,0.5) !important;
    cursor: no-drop !important;
}
/*屏保列表end*/
.welcome-bg {
    background-repeat: no-repeat;
    background-size: cover;
    margin-right: 20px;
    /*padding:20px;*/
    text-align: center;
    position: relative;
    width: 1412px;
    height: 794px;
    /*border: 1px solid rgba(0,0,0,0.4);*/
    margin-top: 10px;
    overflow:hidden;
}
.welcome-preview-bg {
    min-height: 500px;
    max-height: 1080px;
    background-repeat: no-repeat;
    background-size: cover;
    margin-right: 20px;
    text-align: center;
}
.welcome-text,
.welcome-preview {
    padding: 10px;
    text-align: center;
    font-weight: bolder;
}
.welcome-text {
    background: none;
    border: 1px dashed #ccc;
    display: inline-block;
    width: 80%;
}
.welcome-bg>div:nth-child(1) .welcome-text{
    font-size: 50px;
    margin-top: 200px;
}
.welcome-preview-bg > div:nth-child(1) .welcome-preview {
    font-size: 50px;
    padding-top: 100px;
}
.welcome-bg > div:nth-child(2) .welcome-text {
    font-size: 30px;
    margin-top: 20px;
}
.welcome-preview-bg > div:nth-child(2) .welcome-preview {
    font-size: 30px;
    padding-top: 40px;
}
.welcome-bg>div:nth-child(3) .welcome-text {
    font-size: 20px;
    margin-top: 20px;
}
.welcome-preview-bg > div:nth-child(3) .welcome-preview {
    font-size: 20px;
    padding-top: 20px;
}

.postionBox {
    min-width: 200px;
    min-height: 100px;
    width: 790px;
    position: absolute;
    top: 100px;
    left: 312px;
    /*margin: auto;*/
}

.changeBox {
    min-width: 200px;
    min-height: 100px;
    width: 100%;
    height: 100%;
    border: 2px dashed #ccc;
    outline: none;
    text-align: left;
    padding: 4px 8px;
}

.changeBox1 {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    background: rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    cursor:pointer;
}

.postionBox .top,
.postionBox-vertical .top {
    position: absolute;
    top: -6px;
    left: 50%;
    width: 14px;
    height: 14px;
    margin: auto;
    border: 1px solid #ccc;
    background: #fff;
    cursor: n-resize;
}

.postionBox .right,
.postionBox-vertical .right {
    position: absolute;
    top: 50%;
    right: -6px;
    width: 14px;
    height: 14px;
    margin: auto;
    border: 1px solid #ccc;
    background: #fff;
    cursor: e-resize;
}

.postionBox .bottom,
.postionBox-vertical .bottom {
    position: absolute;
    bottom: -6px;
    left: 50%;
    width: 14px;
    height: 14px;
    margin: auto;
    border: 1px solid #ccc;
    background: #fff;
    cursor: n-resize;
}

.postionBox .left,
.postionBox-vertical .left {
    position: absolute;
    top: 50%;
    left: -6px;
    width: 14px;
    height: 14px;
    margin: auto;
    border: 1px solid #ccc;
    background: #fff;
    cursor: e-resize;
}

.move-btn {
    position: absolute;
    top: 0px;
    right: -45px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(217,217,217,1);
    box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    color: #333;
    text-align: center;
    font-size: 18px;
    cursor: pointer;
}

.move-btn:active {
    background: #4196FF;
    color: #fff;
}
.move-btn-active{
  background: #4196ff;
  color: #fff;
}
.del-btn {
    position: absolute;
    bottom: 0px;
    right: -45px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(217,217,217,1);
    box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    color: #333;
    text-align: center;
    font-size: 22px;
    cursor: pointer;
}

.style-box {
    width: 170px;
    height: 42px;
    background: rgba(255,255,255,1);
    box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    position: absolute;
    top: -50px;
    left: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
}
.style-bold {
    font-size: 21px;
    font-weight: bold;
    margin: 0 8px;
    padding: 0px 10px;
    height: 24px;
    line-height: 24px;
    border-radius: 2px;
    cursor: pointer;
}
.style-bold-active {
    background: #ddd;
}
.font-color {
    height: 24px;
    line-height: 24px;
    display: flex;
    text-align: center;
    border-radius: 2px;
}
.font-color-sample {
    width: 22px;
    background: #CCC;
    font-size: 19px;
    font-weight: 700
}
.font-color-box {
    position: absolute;
    top: 50px;
    left: 0;
    width: 234px;
    height: 45px;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(217,217,217,1);
    border-radius: 2px;
}
.color-box-header {
    height: 22px;
    line-height: 22px;
    text-align: left;
    background: rgba(245,245,245,1);
    border-radius: 2px;
    padding-left: 8px;
    font-size: 12px;
    color: rgba(0,0,0,0.4);
}
.color-box-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 22px;
    padding: 0 6px;
}
.color-box-li {
    width: 14px;
    height: 14px;
    border: 1px solid rgba(226,228,231,1);
    margin: 0 2px;
}
.submit-fix-btn {
    width: 100%;
    height: 52px;
    line-height: 52px;
    text-align: center;
    background: #fff;
    position: fixed;
    bottom: 0;
    border-top: 1px solid #ddd;
    z-index:99;
}
.img-ul {
    height: 790px;
    overflow-y: auto;
    padding: 0px 5px;
}
.img-li {
    margin-bottom: 20px;
    position: relative
}
.img-li:hover .img-del {
    display: block;
}
.img-del {
    display: none;
    position: absolute;
    top: 10px;
    right: 10px;
    color: #333;
    text-align: center;
    font-size: 22px;
    cursor: pointer;
}
.img-del:hover {
    color: #ed4014;
}
.img-select {
    position: absolute;
    top: 40%;
    right: 45%;
    font-size: 42px;
}
/*竖版*/
.welcome-bg-list-vertical {
    width: 100%;
    height: 1008px;
    text-align: center;
    border-left: 1px solid rgba(221,221,221,0.5);
    overflow-y:auto;
    margin-bottom:60px;
}
.welcome-bg-list-vertical li {
    margin-bottom: 20px;
    position:relative;
}
.welcome-bg-list-vertical li img {
    width: 144px;
    height: 256px;
    border-radius: 6px;
    cursor: pointer;
}
.welcome-bg-list-vertical:hover .img-del {
    display: block;
}
.welcome-preview-bg-vertical {
    min-height: 500px;
    max-height: 1080px;
    background-repeat: no-repeat;
    background-size: cover;
    margin-right: 20px;
    text-align: center;
}
.img-del-vertical {
    display:block;
    position: absolute;
    top: 10px;
    right: 20%;
    color: #333;
    text-align: center;
    font-size: 22px;
    cursor: pointer;
}
.welcome-bg-vertical {
    width: 567px;
    height: 1008px;
    margin: 0 auto;
    /*border: 1px solid #ddd;*/
    border-radius: 6px;

    background-repeat: no-repeat;
    background-size: cover;
    text-align: center;
    position: relative;
    margin-top: 10px;
    overflow: hidden;
}
.postionBox-vertical {
    min-width: 200px;
    min-height: 100px;
    width: 400px;
    position: absolute;
    top: 350px;
    left: 80px;
}
.welcome-text-vertical,
.welcome-preview-vertical {
    padding: 10px;
    text-align: center;
    font-weight: bolder;
}

.welcome-text-vertical {
    background: none;
    border: 1px dashed #ccc;
    display: inline-block;
    width: 80%;
}
.welcome-preview-bg-vertical > div:nth-child(3) .welcome-preview-vertical {
    font-size: 20px;
    padding-top: 20px;
}
.welcome-bg-list {
    width:280px;
    height: 900px;
    overflow-y: auto;
    padding: 0px 5px;
}
.welcome-bg-list li {
    margin-bottom: 20px;
}
.welcome-bg-list li img {
    width: 100%;
    height: 450px;
    border-radius: 6px;
    box-shadow: 0px 10px 10px -6px rgba(0,0,0,0.4);
    cursor:pointer;
}
</style>
