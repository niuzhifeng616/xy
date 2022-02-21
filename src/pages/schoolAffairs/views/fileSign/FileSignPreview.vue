<template>
  <div class="xy-content-module">
    <div class="xy-content-title" style="text-align: center;" v-if='pageType !== "publish"'>
      <Button class="xy-primary" @click="create" :disabled='status'>确认发布</Button>
    </div>
    <div class="xy-content-body" style="text-align: center; height: 840px;">
      <div class="text">
        <div v-html='tag'></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'FileSignPreview',
    data () {
      return {
        type: '',
        tag: '',
        apiPath: '',
        fileForm: {},
        previewList: [],
        status: false,
        pageType: '' // add 新增页面  publish  已发布的页面   unpublish 未发布页面
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.pageType = this.$route.query.type
      this.fileForm = JSON.parse(this.$route.query.row)
      this.Preview()
      for (var key in this.fileForm) {
        if (key !== 'isRemind' && key !== 'time' && key !== 'SignFileID' && key !== 'SignFileID' && key !== 'SignFileID') {
          if (!this.fileForm[key]) {
            this.status = true
            break
          }
        }
      }
    },
    methods: {
      async Preview () {
        let id = this.pageType === 'add' ? '' : this.fileForm.SignFileID
        // 新增页面不需要传递SignFileId，其他都需要
        let params = {
          SignFileId: id,
          FileName: this.fileForm.filePath
        }
        let rs = await this.xy.get(this.apiPath + '/api/SignFileManage/GetPreviewFileData', params)
        if (rs.success) {
          this.previewList = rs.data
          this.setFormat()
        }
      },
      // 设置预览格式
      setFormat (previewList) {
        let arr = []
        this.tag = ''
        this.previewList.forEach((item) => {
          if (item.IsTable) {
            let style = ''
            let tableObj = item.Tables
            for (var key in tableObj.LayoutStyle) {
              if (tableObj.LayoutStyle[key]) {
                var attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                attrs = attrs.replace(/([A-Z])/g, '-$1').toLowerCase() // 将大驼峰改为css属性名格式
                style += attrs + ':' + tableObj.LayoutStyle[key] + ';'
              }
            }
            let tableRows = item.Tables.TRows
            let rows = ''
            let columns = ''
            let columnStyle = ''
            if (tableRows.length > 0) {
              tableRows.forEach((row) => {
                columns = ''
                row.forEach(function (column) {
                  for (let key in column.LayoutStyle) {
                    if (column.LayoutStyle[key]) {
                      var attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                      attrs = attrs.replace(/([A-Z])/g, '-$1').toLowerCase()

                      columnStyle += attrs + ':' + column.LayoutStyle[key] + ';'
                    }
                  }
                  // 如果文本为null  字体显示为白色
                  if (!column.Text || column.Text == null) {
                    if (column.FontStyle) {
                      column.FontStyle.color = '#fff'
                    } else {
                      column.FontStyle = { color: '#fff' }
                    }
                  } else {
                    column.FontStyle.color = 'black'
                  }

                  for (let key in column.FontStyle) {
                    if (column.FontStyle[key]) {
                      let attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                      attrs = attrs.replace(/([A-Z])/g, '-$1').toLowerCase()
                      columnStyle += attrs + ':' + column.FontStyle[key] + ';'
                    }
                  }
                  columns += '<td style="' + columnStyle + '">' + column.Text + '</td>'
                })
                rows += '<tr>' + columns + '</tr>'
              })
            }
            arr.push('<table  style=' + style + '>' + rows + '</table>')
          } else if (item.IsImage) {
            // 图片格式类似于： <div  style=""><image/></div>
            let style = ''
            for (let key in item.LayoutStyle) {
              if (item.LayoutStyle[key]) {
                let attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                attrs = attrs.replace(/([A-Z])/g, '-$1').toLowerCase() // 将大驼峰改为css属性名格式
                style += attrs + ':' + item.LayoutStyle[key] + ';'
              }
            }
            for (let key in item.FontStyle) {
              if (item.FontStyle[key]) {
                let attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                attrs = attrs.replace(/([A-Z])/g, '-$1').toLowerCase()
                style += attrs + ':' + item.FontStyle[key] + ';'
              }
            }
            let img = ''
            // let imgStyle
            // 每张图片的格式
            if (item.Images.length > 0) {
              item.Images.forEach((every) => {
                //  imgStyle = ''
                for (let key in every.ImgStyle) {
                  if (every.ImgStyle[key]) {
                    // let attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                    //   imgStyle += attrs + ':' + every.ImgStyle[key] + ';'
                  }
                }
                for (let key in every.LayoutStyle) {
                  if (every.LayoutStyle[key]) {
                    let attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                    attrs = attrs.replace(/([A-Z])/g, '-$1').toLowerCase()
                    //  imgStyle += attrs + ':' + every.LayoutStyle[key] + ';'
                  }
                }

                // img += '<image  style="' + '\"' + imgStyle + '\"' + '&nbsp; src=\"' + every.Src + '\"' + '"/>'
                img += `<image  style="width:100%;height:50%;" src="${this.xyApi}/base${every.Src}"/>`
              })
            }
            arr.push('<div  style="' + style + '">' + img + '</div>')
          } else {
            let style = ''
            for (let key in item.LayoutStyle) {
              if (item.LayoutStyle[key]) {
                let attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                attrs = attrs.replace(/([A-Z])/g, '-$1').toLowerCase() // 将大驼峰改为css属性名格式
                style += attrs + ':' + item.LayoutStyle[key] + ';'
              }
            }
            if (!item.Text || item.Text == null) {
              if (item.FontStyle) {
                item.FontStyle.color = '#fff'
              } else {
                item.FontStyle = { color: '#fff' }
              }
            }
            for (let key in item.FontStyle) {
              if (item.FontStyle[key]) {
                let attrs = key.charAt(0).toLowerCase() + key.slice(1, key.length)
                attrs = attrs.replace(/([A-Z])/g, '-$1').toLowerCase()

                style += attrs + ':' + item.FontStyle[key] + ';'
              }
            }

            arr.push('<p  style="' + style + '">' + (item.Text === '签字确认：{$}' ? '签字确认：<span class=\'sign-name\'>您的签字将在此处展示</span>' : item.Text) + '</p>')
          }
        })
        arr.forEach((item) => {
          this.tag += item
        })
      },
      // 请求接口发布 新增或者未发布 状态下
      // 确定发布
      create (val) {
        if (this.pageType === 'publish') {
          this.editPublish()
          return
        }
        let time1 = new Date(this.fileForm.date).getTime()
        if (this.fileForm.time > 0) {
          var time2 = parseInt(this.fileForm.time) * 60 * 60 * 1000
          if (time1 - time2 < new Date().getTime()) {
            this.xy.msgW('选择的截止时间无效。')
            return
          }
        }
        this.postCreate(val)
      },
      async postCreate (val) {
        this.xy.loading()
        let params = {
          SignFileID: this.pageType === 'add' ? '' : this.fileForm.SignFileID,
          SignFileName: this.fileForm.fileName,
          OriginalFileName: this.fileForm.uploadFile,
          SignFilePath: this.fileForm.filePath,
          StudentIDs: this.fileForm.publishClass,
          EndTime: this.fileForm.date,
          AutoNotify: this.fileForm.isRemind,
          AutoNotifyTime: parseInt(this.fileForm.time) || 0
        }
        let rs = await this.xy.post(this.apiPath + '/api/SignFileManage/Save', params, true)
        if (rs.success) {
          let id = this.pageType === 'add' ? rs.data.result : this.fileForm.SignFileID
          this.publish(id)
        } else {
          this.xy.unloading()
        }
      },
      // 请求接口发布 新增或者未发布 状态下
      async publish (CreatFileID) {
        let rs = await this.xy.post(this.apiPath + '/api/SignFileManage/Publish?SignFileID=' + CreatFileID)
        if (rs.success) {
          this.xy.msgSuc('发布成功。')
          this.xy.unloading()
          this.$router.push({
            path: '/xyHome/sa/FileSign/fileSignStudentList',
            query: { id: CreatFileID }
          })
        }
      },

      // 已发布的确认发布
      async editPublish () {
        let time1 = new Date(this.fileForm.date).getTime()
        if (this.fileForm.time > 0) {
          let time2 = parseInt(this.fileForm.time) * 60 * 60 * 1000
          if (time1 - time2 < new Date().getTime()) {
            this.msgW('选择的截止时间无效。')
            return
          }
        }
        let params = {
          SignFileID: this.fileForm.SignFileID,
          EndTime: this.fileForm.date,
          AutoNotify: this.fileForm.isRemind,
          AutoNofityTime: parseInt(this.fileForm.time) || 0
        }
        this.xy.loading()
        let rs = await this.xy.post(this.apiPath + '/api/SignFileManage/Modify', params)
        if (rs.success) {
          this.xy.msgSuc('发布成功。')
          this.xy.unloading()
          this.$router.push({
            path: '/xyHome/sa/FileSign/fileSignStudentList',
            query: { id: this.fileForm.SignFileID }
          })
        }
      },
      goback () {
        this.$router.go(-1)
      }
    }
  }
</script>
<style lang="less" scoped>
  .image {
    width: 412px;
    height: 840px;
  }

  .text {
    width: 412px;
    height: 840px;
    background: url('./img/preview.png') no-repeat center;
    background-size: 100%;
    margin: 0 auto;
    padding: 20px;
  }

  .text > div {
    width: 343px;
    text-align: left;
    margin: 15px auto;
    padding: 32px 5px;
    max-height: 717px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 0px;
  }

  .sign-name {
    color: red;
  }
</style>
