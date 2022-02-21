<template>
  <div class="tinymce-editor">
    <editor v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick">
    </editor>
  </div>
</template>
<script>
  import tinymce from 'tinymce/tinymce'
  import Editor from '@tinymce/tinymce-vue'
  import 'tinymce/themes/silver'
  // import 'tinymce/icons/default'
  import 'tinymce/themes/silver/theme'
  // 编辑器插件plugins
  // 更多插件参考：https://www.tiny.cloud/docs/plugins/
  import 'tinymce/plugins/image'// 插入上传图片插件
  import 'tinymce/plugins/media'// 插入视频插件
  import 'tinymce/plugins/table'// 插入表格插件
  import 'tinymce/plugins/lists'// 列表插件
  import 'tinymce/plugins/wordcount'// 字数统计插件
  export default {
    components: {
      Editor
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
      // 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
      baseUrl: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      plugins: {
        type: [String, Array],
        default: 'lists image media table wordcount'
      },
      toolbar: {
        type: [String, Array],
        default: 'undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat'
      },
      isUpload: {
        type: Boolean,
        default: false
      },
      apiPath: {
        type: String,
        default: ''
      },
      url: {
        type: String,
        default: ''
      },
      isCustomUplod: {// 是否执行自定义上传
        type: Boolean,
        default: false
      },
      uploadHandler: {
        type: Function
      }
    },
    data () {
      return {
        imgUrl: '',
        init: {
          language_url: `${this.baseUrl}/tinymce/langs/zh_CN.js`,
          language: 'zh_CN',
          skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide`,
          content_css: `${this.baseUrl}/tinymce/skins/content/default/content.css`,
          // skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide-dark`, // 暗色系
          // content_css: `${this.baseUrl}/tinymce/skins/content/dark/content.css`, // 暗色系
          height: 300,
          plugins: this.plugins,
          toolbar: this.toolbar,
          branding: false,
          menubar: false,
          aaa: () => {},
          // https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
          images_upload_handler: (blobInfo, success, failure) => {
            if (this.isCustomUplod) {
              this.EditorUpload(blobInfo, success, failure)
            } else {
              if (this.isUpload) {
                var xhr; var formData; var apiPath = this.apiPath
                xhr = new XMLHttpRequest()
                xhr.withCredentials = false
                xhr.open('POST', this.url)
                xhr.setRequestHeader('XYTOKEN', this.xy.getCookie('.XYTOKEN'))
                xhr.onload = function () {
                  var res
                  if (xhr.status !== 200) {
                    failure('HTTP Error: ' + xhr.status)
                    return
                  }
                  res = JSON.parse(xhr.responseText)
                  if (res.success) {
                    success(apiPath + res.data.result)
                  } else {
                    this.xy.msgError(res.msg)
                  }
                }
                formData = new FormData()
                formData.append('file', blobInfo.blob(), blobInfo.filename())
                xhr.send(formData)
              } else {
                const img = 'data:image/jpeg;base64,' + blobInfo.base64()
                success(img)
              }
            }
          }
        },
        myValue: this.value
      }
    },
    watch: {
      value (newValue) {
        this.myValue = newValue
      },
      myValue (newValue) {
        this.$emit('input', newValue)
      }
    },
    mounted () {
      tinymce.init({})
    },
    methods: {
      // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
      // 需要什么事件可以自己增加
      onClick (e) {
        // console.log(this.myValue)
        // this.$emit('onClick', e, tinymce)
      },
      // 可以添加一些自己的自定义事件，如清空内容
      clear () {
        this.myValue = ''
      },
      callback () {

      },
      EditorUpload (blobInfo, success, failure) {
        if (this.isUpload) {
          this.uploadHandler(blobInfo, success, failure)
        } else {
          const img = 'data:image/jpeg;base64,' + blobInfo.base64()
          success(img)
        }
      }
    }
  }
</script>
