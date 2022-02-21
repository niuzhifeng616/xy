<!--多张图片上传  -->
<template>
  <div class="up-image">
    <h4 class="up-title">活动照片</h4>
    <p class="up-conditions">支持.jpg，.jpeg，.png格式，图片大小不大于5M，图片数量不大于9张</p>
    <p class="up-box">
      <span class="up-line">上传照片</span>
      <Button :disabled='imageList.length===9?true:false'
              class="pr">
              <i class="iconfont font12">&#xe6c7;</i>
        <input type="file"
               multiple="multiple"
               @change="changeFunc($event)"
               class="pa cursor-p"
               style="top:0;left:0;width:100%;height:100%;opacity:0;">
        上传图片
      </Button>
    </p>
    <div class="image-box">
      <span v-for='item in imageList'
            :key="item.ActivityCourseStudentImageID">
        <i class="iconfont" @click='delImgae(item)' >&#xe6d8;</i>
        <img :src="base+item.ImageFliePath">
      </span>
    </div>
  </div>
</template>

<script>

  export default {
    props: {
      studentId: {
        type: Number
      }
    },
    components: {},
    data () {
      return {
        base: '',
        imageList: [],
        ActivityCourseProjectID: 0
      }
    },
    computed: {},
    watch: {
      studentId () {
        if (this.studentId > 0 && this.ActivityCourseProjectID) {
          this.GetImageByStudent()
        }
      }
    },
    created () {
      if (Object.keys(this.$store.state.common.menuInfo).length > 0) {
        this.ActivityCourseProjectID = this.$store.state.common.menuInfo.id
      }
      this.base = `${this.xyApi}/eva`
    },
    mounted () {

    },
    methods: {
      // 获取图片
      async GetImageByStudent () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseStatistics/GetImageByStudent`, {
          ActivityCourseProjectID: this.ActivityCourseProjectID,
          ActivityCourseStudentID: this.studentId
        }, true)
        this.xy.unloading()
        if (res.success) {
          this.imageList = res.data
        } else {
          this.xy.msgError(res.msg || '图片获取失败')
        }
      },
      async delImgae (item) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ActivityCourseStatistics/DeleteImageByStudent`, {
          ActivityCourseProjectID: this.ActivityCourseProjectID,
          ActivityCourseStudentID: this.studentId,
          ActivityCourseStudentImageID: item.ActivityCourseStudentImageID
        }, true)
        this.xy.unloading()
        if (res.success) {
          this.GetImageByStudent()
        } else {
          this.xy.msgError(res.msg || '图片删除失败')
        }
      },
      // 上传图片
      async changeFunc (e) {
        this.xy.loading()
        var filesUrls = e.target.files
        var imgMasSize = 1024 * 1024 * 5 // 5MB
        if (filesUrls.length + this.imageList.length > 9) {
          this.xy.unloading()
          let count = 9 - this.imageList.length
          this.xy.msgError(`最多只能选择${count}张图片`)
          return
        }
        for (var i = 0; i < filesUrls.length; i++) {
          if (['jpeg', 'png', 'jpg'].indexOf(filesUrls[i].type.split('/')[1]) < 0) {
            this.xy.unloading()
            this.xy.msgError('文件类型仅支持 jpeg，png，jpg')
            return
          };
          if (filesUrls[i].size > imgMasSize) {
            this.xy.unloading()
            this.xy.msgError('单张图片不能超过5M')
            return
          };
        };
        var formData = new FormData()
        for (var j = 0; j < filesUrls.length; j++) {
          formData.append('name', filesUrls[j].name)
          formData.append('type', filesUrls[j].type)
          formData.append('size', filesUrls[j].size)
          formData.append('lastModifiedDate', filesUrls[j].lastModifiedDate)
          formData.append('File', filesUrls[j], 'photo.jpg')
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ActivityCourseStatistics/UploadImageByStudent?ActivityCourseProjectID=${this.ActivityCourseProjectID}&ActivityCourseStudentID=${this.studentId}`, formData, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('图片上传成功')
          this.GetImageByStudent()
        } else {
          this.xy.msgError(res.msg || '图片上传失败')
        }
      }

    }
  }
</script>
<style lang='less' scoped>
.up-image {
  .up-title {
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
  .up-conditions {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    margin: 15px 0;
  }
  .up-box {
    display: flex;
    align-items: center;
    .up-line {
      display: inline-block;
      width: 120px;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
    }
    .font12{
      font-size: 12px;
    }
  }
  .image-box {
    margin-left: 120px;
    span {
      display: inline-block;
      position: relative;
      margin-right: 14px;
      width: 80px;
     height: 80px;
      margin-top: 10px;
      .iconfont {
        position: absolute;
        right: -2px;
        top:-10px;
        cursor: pointer;
        &:hover{
          color: red;
        }
      }
      img {
        width: 80px;
        height: 80px;
        border: 1px solid #e9e9e9;
        border-radius: 4px;
      }
    }
  }
}
</style>
