<template>
  <div class="approval-news">
    <div class="approval-cont">
      <Form label-position="top">
        <FormItem label="发布到的班牌">
          <div class="tagbox">
            <Tag v-for="item in tagList" v-bind:name="item" :key="item" v-bind:title="item" type="border" color="blue"
                 style="margin-bottom:8px;">{{item}}
            </Tag>
          </div>
        </FormItem>
        <FormItem label="标题">
        <span>
             {{WelcomModel.WelcomeTitle}}
        </span>
        </FormItem>
        <FormItem label="发布内容">
          <i-col span="24">
            <div class="welcome-preview-bg"
                 v-bind:style="{backgroundImage:welcomeBgExample,height:WelcomModel.ScreenMode==1?'700px':''}">
              <div>
                <div class="welcome-preview" v-cloak v-bind:style="{paddingTop:WelcomModel.ScreenMode==1?'220px':''}">
                  {{WelcomModel.WelcomeTitle}}
                </div>
              </div>
              <div>
                <div class="welcome-preview" v-cloak>{{WelcomModel.WelcomeTarge}}</div>
              </div>
              <div>
                <div class="welcome-preview" v-cloak>{{WelcomModel.WelcomeContent}}</div>
              </div>
            </div>
          </i-col>
        </FormItem>
        <FormItem label="发布时间">
          <span style="font-size:14px;" v-cloak>
            <Icon type="ios-time" size="20" color="#6291e9" style="vertical-align:middle;"/>
            <span style="vertical-align:middle;">
                {{xy.moment(WelcomModel.StartDate).format('YYYY/MM/DD HH:mm')}}
               - {{xy.moment(WelcomModel.EndDate).format('YYYY/MM/DD HH:mm')}}
            </span>
          </span>
        </FormItem>
        <div class="detail" v-if="type <= 1">
          <div v-if="detailedResult.ApprovalResult === 0">
            <FormItem label="审批结果" v-cloak>
              <div class="not-approval">
                <img src="./imgs/seal.png"/>
                <span> 未审批 </span>
              </div>
            </FormItem>
          </div>
          <div v-else>
            <FormItem label="审批结果">
              <div v-if="detailedResult.ApprovalResult === 3" class="not-adopt">
                <img src="./imgs/adopt.png"/>
                <span> {{detailedResult.ApprovalResultName}} </span>
              </div>
              <div v-else class="not-adopt">
                <img src="./imgs/not-adopt.png"/>
                <span> {{detailedResult.ApprovalResultName}} </span>
              </div>
            </FormItem>
            <FormItem label="审批意见">
              <span v-if="detailedResult.ApprovalOpinion === ''">无</span>
              <span v-else>{{detailedResult.ApprovalOpinion}}</span>
            </FormItem>
          </div>
        </div>
        <div v-else class="edit">
          <FormItem label="审批结果">
            <RadioGroup v-model="appResult" v-bind:disabled="detailedResult.ApprovalResult != 2">
              <Radio label="3">
                通过
              </Radio>
              <radio label="4">
                不通过
              </radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="审批意见">
            <span>
                <Input type="textarea"
                       v-model="appCont"
                       :rows="6"
                       :disabled="detailedResult.ApprovalResult !== 2"
                       clearable></Input>
            </span>
          </FormItem>
        </div>
        <div class="approval-foot" v-if="detailedResult.ApprovalResult === 2 && type === 2">
          <Button class="xy-info" @click="Cancel">取消</Button>
          <Button class="xy-primary" @click="Ok">确定</Button>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ApprovalWelcome',
    data () {
      return {
        headTitle: '',
        row: '',
        tagList: [],
        WelcomModel: '',
        welcomeBgExample: '',

        // 审批结果
        appResult: '',
        appCont: '',
        // type 0  消息,
        // type 1  查看
        // type 2  编辑
        type: 0,
        info: '',
        apiPath: '',
        detailedResult: ''
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.getRows()
    },
    methods: {
      // 获取上一页参数
      getRows () {
        this.type = this.$route.query.type || 0
        this.type = parseInt(this.type)
        if (this.type === 0) {
          this.info = this.$route.query.messageModel
          this.row = JSON.parse(this.info.DetailParameter)
          this.apiPath = this.info.apiPath
        } else {
          this.row = JSON.parse(this.$route.query.row)
        }
        this.GetPublicApproveById()
      },

      // 根据ID获取本页要展示的值
      async GetPublicApproveById () {
        let params = {
          id: this.row.PublishTaskID,
          resourceType: this.row.PublishTaskType
        }
        let rs = await this.xy.get(this.apiPath + '/api/PublicTask/GetPublicApproveById', params)
        if (rs.success) {
          this.detailedResult = rs.data
          this.tagList = rs.data.PublishTaskName
          this.WelcomModel = rs.data.WelcomModel

          let strurl = this.WelcomModel.ScreenThumbnail
          strurl = strurl.replace('\\\\', '//')
          strurl = strurl.replace('\\', '/')
          strurl = strurl.replace('\\', '/')
          strurl = strurl.replace('\\', '/')
          this.welcomeBgExample = 'url(' + strurl + ')'
        }
      },

      // 查看详情
      edit (item) {
        this.noticeCreate = true
        this.seeNotice = item
      },
      noticeOk () {
        this.noticeCreate = false
      },
      noticeCancel () {

      },
      // 取消
      Cancel () {
        this.$Modal.confirm({
          title: '取消',
          content: '<p>您是否确定放弃本次审批？</p>',
          onOk: () => {
            this.$router.back()
          },
          onCancel: function () {
          }
        })
      },
      // 确定
      async Ok () {
        if (this.appCont.length >= 100) {
          this.xy.msgError('审批意见不能超过100个字符。')
          return
        }
        if (!this.appResult) {
          this.xy.msgError('请选择审批结果。')
          return
        }
        let params = {
          PublishTaskID: this.row.PublishTaskID,
          ApprovalResult: Number(this.appResult),
          ApprovalOpinion: this.appCont
        }

        let rs = await this.xy.post(this.apiPath + '/api/PublicTask/CreateApprove', params)
        if (rs.success) {
          this.xy.msgSuc('审批成功。')
          this.$router.back()
        }
      },
      // 返回
      ReturnBtn () {
        this.$router.back()
      }
    }

  }
</script>
<style lang="less" scoped>
  .approval-cont {
    background: #fff;

    /* 审批列表班牌展示 */

    .tagbox {
      /*height:100px;
      overflow:hidden;*/
    }

    .welcome-bg {
      min-height: 700px;
      max-height: 1080px;
      background-repeat: no-repeat;
      background-size: cover;
      margin-right: 20px;
      text-align: center;
    }

    .welcome-preview-bg {
      margin-top: 15px;
      background-repeat: no-repeat;
      background-size: cover;
      margin-right: 20px;
      text-align: center;
      width: 100%;
      height: 259px;
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
    }

    .welcome-bg > div:nth-child(1) .welcome-text {
      font-size: 50px;
      margin-top: 200px;
    }

    .welcome-preview-bg > div:nth-child(1) .welcome-preview {
      font-size: 26px;
      padding-top: 70px;
    }

    .welcome-bg > div:nth-child(2) .welcome-text {
      font-size: 30px;
      margin-top: 40px;
    }

    .welcome-preview-bg > div:nth-child(2) .welcome-preview {
      font-size: 24px;
      padding-top: 8px;
    }

    .welcome-bg > div:nth-child(3) .welcome-text {
      font-size: 20px;
      margin-top: 40px;
    }

    .welcome-preview-bg > div:nth-child(3) .welcome-preview {
      font-size: 16px;
      padding-top: 0px;
    }

    .ivu-form-item {
      margin-bottom: 20px;

    }

    .ivu-form-item-content {
      font-size: 14px;
    }

    .ivu-tag {
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      background: #eff9ff !important;
      margin-right: 10px;
      margin-bottom: 8px;
      margin-top: 8px;
    }

    .ivu-form .ivu-form-item-label {
      font-size: 16px;
      font-weight: bold;
      display: block;
      width: 100%;
      text-align: left;
    }

    .approval-cont {
      width: 460px;
      margin: 0 auto;
    }

    .approval-foot {
      text-align: center;
      margin-bottom: 30px;
    }

    .approval-foot > button {
      margin: 0 15px;

    }

    .not-approval {
      width: 110px;
      height: 40px;
      background: rgba(251, 251, 251, 1);
      border: 1px solid rgba(232, 232, 232, 1);
      border-radius: 4px;
      margin-top: 45px;
      padding: 1px 19px;
      overflow: hidden;
    }

    .not-approval > img {
      display: inline-block;
      width: 14px;
      vertical-align: middle;
    }

    .not-approval > span {
      display: inline-block;
      vertical-align: middle;
      font-size: 16px;
      margin-left: 3px;
    }

    .not-adopt {
      max-width: 150px;
      height: 40px;
      background: rgba(251, 251, 251, 1);
      border: 1px solid rgba(232, 232, 232, 1);
      border-radius: 4px;
      margin-top: 45px;
      padding: 1px 19px;
      overflow: hidden;
      text-align: center;
    }

    .not-adopt > img {
      display: inline-block;
      width: 14px;
      vertical-align: middle;
    }

    .not-adopt > span {
      display: inline-block;
      vertical-align: middle;
      font-size: 16px;
      margin-left: 3px;
    }
  }
</style>
