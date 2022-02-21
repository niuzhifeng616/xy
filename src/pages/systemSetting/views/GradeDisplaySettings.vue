<template>
  <div class="GradeDisplaySettings">
    <div style="width:1330px;margin:auto">
      <h1 class="title-name">年级显示设置</h1>
      <!-- <div class="tip-text" v-if="show">
        <Icon type="ios-information-circle-outline" class="tip" />
        <span>
          说明：以下学年显示方式设置，仅用于称呼当前学年的学生年级。
        </span>
        <Icon @click="close" type="md-close" class="close" />
      </div> -->
      <Alert show-icon closable style="width: 992px; margin: 0 auto 24px">说明：以下学年显示方式设置，仅用于称呼当前学年的学生年级。</Alert>
      <ul class="ul-li">
        <li
          class="li-box"
          :class="vertical == 1 ? 'is-active' : ''"
          @click="vertical = 1"
          >
          <div class="box-header">
            <p class="line line1"></p>
            <p class="type-title">方式一</p>
          </div>
          <p class="box-body">
            “ 年级+入学年份 ” ，如：高一(2019级)、高二(2018级)、高三(2017级)
          </p>
        </li>
        <li
          class="li-box"
          style="margin:0 50px;"
          :class="vertical == 2 ? 'is-active' : ''"
          @click="vertical = 2"
          >
          <div class="box-header">
            <p class="line line2"></p>
            <p class="type-title">方式二</p>
          </div>
          <p class="box-body">“ 年级 ” ，如：高一、高二、高三</p>
        </li>
        <li
          class="li-box"
          :class="vertical == 3 ? 'is-active' : ''"
          @click="vertical = 3"
          >
          <div class="box-header">
            <p class="line line3"></p>
            <p class="type-title">方式三</p>
          </div>
          <p class="box-body">
            “ 入学年份 ” ，如：2019级高中、2018级高中、2017级高中
          </p>
        </li>
      </ul>
    </div>

    <div class="text-center" style="margin-top:97px;">
      <Button class="xy-btn-primary" shape="circle" @click="submit">确定</Button>
      <!-- <Button class="xy-btn-close">取消</Button> -->
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        vertical: '1',
        show: true
      }
    },
    mounted () {
      this.getType()
    },
    methods: {
      async getType () {
        this.xy.loading()
        try {
          const res = await this.xy.get(
            `${this.xyApi + '/base'}/api/Settings/GetGradePresent`
          )
          if (res.success) {
            this.vertical = res.data.GradePresent
          }
        } catch (error) {
          this.xy.mError('获取信息失败', error)
        }
        this.xy.unloading()
      },
      async submit () {
        this.xy.loading()
        const res = await this.xy.post(
          `${this.xyApi + '/base'}/api/Settings/EditGradePresent`,
          {
            GradePresent: this.vertical
          }
        )
        if (res.success) {
          this.xy.unloading()
          this.xy.msgSuc(res.data)
          this.getType()
        }
      },
      close () {
        this.show = false
      }
    }
  }
</script>

<style lang="less" scoped>
.GradeDisplaySettings {
  margin: 0 20px 20px;
  background: #fff;
  min-height: 664px;
}

.tip-text {
  margin: 0 auto;
  border: 1px solid #1890FF;
  border-radius: 4px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  background: #f3f9ff;
  color: #1890ff;;
  position: relative;
  padding: 0 15px 0 10px;
  margin-bottom: 24px;
  width: 992px;
  display: flex;
  align-items: center;
  .tip {
    margin-right: 8px;
    width: 14px;
    height: 14px;
  }
  .close {
    cursor: pointer;
    position: absolute;
    right: 15px;
  }
}

.title-name {
  font-size: 16px;
  font-weight: bold;
  color: rgba(0, 0, 0, .85);
  text-align: center;
  padding-top: 35px;
  margin-bottom: 36px;
}
.ul-li {
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 992px;
}
.li-box {
  width: 294px;
  height: 174px;
  background: #fff;
  box-shadow: 0px 2px 8px 0px #e7e7e7;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  cursor: pointer;
  padding: 24px 10px 0 24px;
}
.is-active {
  border: 1px solid #1890ff;
}

.box-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.line {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAqCAYAAADI3bkcAAADEklEQVRYR83ZyWsUQRjG4d/rjhIUxIsXEfHswZugIEjQgxg0QWIgKGqIqEGD4o6KG+7igrsibrgvRMGrF8GT6D/gRbyJBxXiVvKFmtB2Zqarxp42cxv6q/d7pmemuqtapF7OuVZgNzA1fSzw/Sdgl6RTgfVRZUpWO+c6gbNRCZWLN0s6mFNWf0wa/B6YlGOTDZKO5phHP9g5Nxr4mme4z+qWdDyv3CR4LPA5r+BUznpJJ/LILgrsgHWSTv4rOgb8BrCv9iMwHdgAjI8AGHqtpDMRYwaUhoJfAo2SeksJzjmb9l4D4yIAhl4tqeaZKBQ8Q9KrMnP2fmBLBNhKDd0p6ULkuL7yUHCDpC9lwEuAmzU0NvRKSZdjx4aCp0l6Wwa8HdgT29TXG3qFpCsx40PBD4FmSdak7+WcmwDYH3FiTMNU7W+PvhqaEQq2vGfAYeCDnyX2AVNCG1Wp+wUsl3QtJCsGHJJXa42hl0q6kRUwWMDmNHS7pFvV0IMJXEK3SbpTCT3YwCV0q6R75dBJ8EjgGzAk63dUwPGfgKHvp3ul74cfAU0FgEJa/PDoB8niNLjBT18zQxILqPkOLJb0uNTrL7C/IIwBngOzCgCFtDB0i6SnVjwA7NG2+ugBZockFlBj6EWSesqCE+gnwJwCQCEtDN1UEZxA2x+xMSSxgJreqmCPHgUYem4BoMwWmWCPtjna0PMyE+tcEAT26BGATeTz62yqGh8MTqDvAgv+FzoKnEDfBhb+B/TOaLBHDwfsNrC5QPQOSXtrAnv0MI9uKQC9VdKBile6UIBzbihw3W5SQsfUULdJ0qHSuJrPcCnAo2091lYDJmvIRklHkkX/DPY/DzvTtlxvzxIEHrfVuW3VHkvX5wJOoC8CywJRlcqqbhzmBvZoW62ct72GGtGG7ZJ0utL4XMEebZnngI5IdNBGYe7gBNq2VVcFooM3COsCTqBtA3tNBtqwHZIuhXy4uoETaHtU0FUBY5snhg3eEKwrODFX25Ok7hQ6ak8ttwtHyNfoz7bNHPaYYTLwDtgm6UXo+FLdH0SFCeBD6E+VAAAAAElFTkSuQmCC);
  background-size: 25px;
  background-position: center;
  background-repeat: no-repeat;
}
.line1 {
  background-color: #5bd171;
}
.line2 {
  background-color: #1890ff;
}
.line3 {
  background-color: #ffbf00;
}
.box-body {
  color: rgba(0, 0, 0, .45);
  font-size: 14px;
  line-height: 26px;
}
.type-title {
  margin: 0 16px;
  font-size: 16px;
  font-weight: bold;
  color: rgba(0, 0, 0, .65);
}
</style>
