<template>
  <div class="detail">
    <Drawer
      v-model="modalImport"
      width="370"
      @on-close="loadTable"
    >
      <div class="detailModel">
        <h3>
          荣誉详情
        </h3>
        <ul class="leave-list">
          <li class="info-item">
            <span class="title">项目名称</span>
            <span class="content">
              {{ rows.HonorManagementName }}
            </span>
          </li>
          <li class="info-item">
            <span class="title">学科</span>
            <span class="content">
              {{ rows.SubjectName }}
            </span>
          </li>
          <li class="info-item">
            <span class="title">荣誉类型</span>
            <span class="content">
              {{ rows.HonorTypeName }}
            </span>
          </li>
          <li class="info-item">
            <span class="title">荣誉级别</span>
            <span class="content">
              {{ rows.AwardsLevelName }}
            </span>
          </li>
          <li class="info-item">
            <span class="title">获奖等级</span>
            <span class="content">
              {{ rows.LevelName }}
            </span>
          </li>
          <li class="info-item">
            <span class="title">获奖时间</span>
            <span class="content">
              {{xy.moment(rows.AwardsDate).format('YYYY-MM-DD') }}
            </span>
          </li>
          <li class="info-item">
            <span class="title">项目概述</span>
            <span class="content">
              {{ rows.HonorManagementContent }}
            </span>
          </li>
          <li class="info-item" style="flex-direction: column;">
            <span class="title">上传证书</span>
            <div v-if="rows.Certificate !== ''" class="contentPic">
              <img
                v-for="(item, index) in rows.ImgUrl"
                :key="index"
                :src="host+item"
                alt=""
                @click="preview(index)"
              />
            </div>
              <Modal title="查看" v-model="visible">
                  <img :src="host + rows.ImgUrl[imgIndex]" v-if="visible" style="width: 100%;">
                  <div slot="footer">
                      <Button class="xy-modal-close" @click="visible=false">关闭</Button>
                  </div>
                </Modal>
          </li>
          <!--v-if="isFrom === 2"-->
          <li class="info-item">
            <span class="title">审批结果</span>
            <span class="content" v-show="rows.ApprovalState === 1">
              已通过
            </span>
            <span class="content" v-show="rows.ApprovalState === 2">
              已拒绝
            </span>
            <span class="content" v-show="rows.ApprovalState === 3">
              待审批
            </span>
          </li>
          <li class="info-item">
            <span class="title">审批说明</span>
             <span class="content">
                {{rows.ApprovalContent?rows.ApprovalContent:'暂无'}}
            </span>
          </li>
        </ul>
      </div>
    </Drawer>
  </div>
</template>
<script>
  export default {
    name: 'honorDetail',
    props: {
      // row
      row: {
        type: Object,
        default: () => {}
      },
      show: {
        type: Boolean,
        default: false
      },
      from: {
        type: Number
      }
    },
    data () {
      return {
        host: '',
        rows: {},
        isFrom: 0,
        modalImport: false,
        visible: false,
        imgIndex: -1
      }
    },
    watch: {
      row: {
        handler (newVal) {
          this.rows = newVal
          if (this.rows !== {}) { this.getGetDisciplineList() }
        },
        immediate: true
      },
      show: {
        handler (newVal) {
          this.modalImport = newVal
        },
        immediate: true
      },
      from: {
        handler (newVal) {
          this.isFrom = newVal
        },
        immediate: true
      }
    },
    created () {
      this.host = `${this.xyApi}/eva`
    },
    mounted () {},
    methods: {
      preview (index) {
        this.visible = true
        this.imgIndex = index
        console.log(this.rows.ImgUrl)
      },
      // 关闭抽屉
      loadTable () {
        this.$emit('loadTable')
      },
      async getGetDisciplineList () {
        console.log(this.rows)
        let res = await this.xy.get(
          this.xyApi + `/xy/comm/GetDisciplineList`
        )
        if (res.success) {
          res.data.map(item => {
            if (item.DisciplineID === this.row.SubjectID) {
              this.$set(this.row, 'SubjectName', item.DisciplineName)
            }
          })
        }
      }
    }
  }
</script>
<style lang='less' scoped>
  .detailModel {
    h3 {
      font-size: 18px;
      font-weight: 600;
      line-height: 28px;
    }
    .leave-list {
      font-size: 14px;
      line-height: 22px;
      .info-item {
        margin-top: 14px;
        display: flex;
        .title {
          color: rgba(0, 0, 0, 0.65);
          display: inline-block;
          width: 60px;
          display: flex;
          justify-content: flex-end;
        }
        .content {
          margin-left: 10px;
          color: rgba(0, 0, 0, 0.85);
          display: inline-block;
          vertical-align: top;
          width: 80%;
          img {
            width: 80px;
            height: 80px;
            padding: 7px;
            border: 1px solid #dddddd;
            border-radius: 4px;

          }
          .contentIcon {
            width: 80px;
            height: 80px;
            padding: 7px;
            border: 1px solid #dddddd;
            border-radius: 4px;
          }
        }
        .contentPic {
          margin-left: 5px;
          margin-top: 10px;
          width: 350px;
          img {
            width: 80px;
            height: 80px;
            margin: 7px;
            border-radius: 4px;
          }
        }
      }
    }
  }
</style>
