<template>
  <div class='xy-content-module'>
    <div id="content" ref="content">
      <div class="report-box">
        <pageCover :studentInformationDatas="studentInformationDatas" v-if="studentInformationDatas.length" />
      </div>
      <div class="report-box">
        <pageIdea />
      </div>
      <!--校长寄语-->
      <!--  -->
      <div class="report-box pageMessage" ref="pageMessage">
        <pageMessage/>
      </div>
      <!--目录-->
      <!--  -->
      <div class="report-box">
        <pageTableContent :pageObj="pageObj" :grade="grade" :gradeText="gradeText"/>
      </div>
      <!-- 体系简介 -->
      <!--  -->
      <div class="report-box">
        <pageIntroduction />
      </div>
      <!-- 天权星 -->
      <!--  -->
      <div class="report-box pageMegrez">
        <pageMegrez />
      </div>
      <div class="report-box">
        <pageClassEva :studentInformationDatas="studentInformationDatas" v-if="studentInformationDatas.length" />
      </div>
       <!--天枢星-->
       <!--  -->
      <div class="report-box pageDubhe" ref='pageDubhe'>
        <pageDubhe :pageObj="pageObj" />
      </div>
       <!--天枢星课程-->
       <!--  -->
      <!-- <div class="report-box" v-for="(item,index) in dubheEchartalls" :key='item.name' >
        <pageDubheEcharts :getKnowledge="getKnowledge" :dataAll='item' :index="index" :pageObj="pageObj" :studentInformationDatas="studentInformationDatas" />
      </div> -->
      <div class="report-box" v-for="(item, index) in dubheEchartalls" :key='item.name'>
        <pageDubheEcharts :dataAll='item' :pageObj="pageObj" :index="index" :studentInformationDatas="studentInformationDatas" :getKnowledge="item.getKnowledge"/>
      </div>
      <!--玉衡星-->
      <!--  -->
       <div class="report-box pageAlioth">
        <pageAlioth :pageObj="pageObj"/>
      </div>
      <!--玉衡星课程-->
      <!--  -->
      <!-- <div v-for="(item,index) in aliothClass" :key="item.name">
        <div class="report-box" v-if="aliothClass.length && studentInformationDatas.length">
          <pageAliothClass :dataAll='item' :studentInformationDatas="studentInformationDatas" :index="index" :pageObj="pageObj"/>
        </div>
      </div> -->
      <div v-for="(item,index) in yuhengData" :key="item.name">
        <div class="report-box">
          <pageAliothClass :dataAll='item' :studentInformationDatas="studentInformationDatas" :index="index" :pageObj="pageObj"/>
        </div>
      </div>
      <!--天璇星-->
      <!--  -->
      <div class="report-box pageMerak">
        <pageMerak :pageObj="pageObj"/>
      </div>
      <!-- 天璇星 课程 -->
      <!--  -->
      <div v-for="(item, index) in merakDatas" :key="index + 'm'">
        <div class="report-box">
          <pageMorReading :evaData="item" :studentInformationDatas="studentInformationDatas" :index="index" v-if="studentInformationDatas.length" :pageObj="pageObj" />
        </div>

        <div class="report-box">
          <pageMorReadingImgs :evaData="item" :studentInformationDatas="studentInformationDatas" :index="index" v-if="studentInformationDatas.length" :pageObj="pageObj" />
        </div>
      </div>
      <!-- 天玑星 -->
      <!--  -->
      <div class="report-box pagePhecda">
        <pagePhecda :pageObj="pageObj"/>
      </div>
      <div v-for="(item, index) in phecdaRes" :key="item.name" v-show="phecdaRes.length">
        <!-- 天玑星图表 -->
        <div class="report-box lookRoot">
          <pageLookRoot :phecdaResImg="item.imgs[0]" :phecdaRes="item" :index="index" :pageObj="pageObj"/>
        </div>
        <!-- 天玑星图片 -->
        <div class="report-box rootImg">
          <pageRootImg :phecdaResImg="item.imgs[0]" :index="index"  :pageObj="pageObj"/>
        </div>
      </div>
      <!-- 摇光星 -->
      <!--  -->
      <div class="report-box pageAlkaid">
        <pageAlkaid :pageObj="pageObj"/>
      </div>

      <div v-for="(item, index2) in alkaidClass" :key="index2+item">
        <div class="report-box">
          <pageAlkaidClass :studentInformationDatas="studentInformationDatas" :alkaidClass="item" :index="index2===0?1:index2*2+1"  :pageObj="pageObj" v-if="alkaidClass.length" />
        </div>
        <div class="report-box">
          <pageAlkaidRecord :alkaidClass="item"  :index="index2+(index2===0?2:index2+1*2)" :pageObj="pageObj" v-if="alkaidClass.length" />
        </div>
      </div>

      <div class="report-box" v-for="(item,index3) in alkaidClass.length" :key="index3+item" style="height:0"></div>

      <!---开阳星--->
      <!--  -->
      <div class="report-box pageMizar">
        <pageMizar :pageObj="pageObj"/>
      </div>
      <div v-for="(item, index) in mizarData" :key="index*999">
        <div class="report-box">
          <pageMizarCourse :index="index" :evaData="item" :studentInformationDatas="studentInformationDatas"  :pageObj="pageObj" v-if="studentInformationDatas.length" />
        </div>
        <div class="report-box">
          <pageMizarImgs :index="index" :evaData="item" :studentInformationDatas="studentInformationDatas"  :pageObj="pageObj" v-if="studentInformationDatas.length" />
        </div>
      </div>
      <!---个人荣誉---->
      <!--  -->
      <div class="report-box pageHonor" style="height:1414px">
        <pageHonor />
      </div>
      <div class="report-box" style="height:1412px"  v-for="(item,index) in honorPages" :key='index + `a`'>
        <pageHonorSummary :pageObj="pageObj" :index="index" :page='item' :name='name' :allData='honorLists' />
      </div>
      <!--学生自评--->
      <!--  -->
      <div class="report-box pageStudentAssessment">
        <pageStudentAssessment :pageObj="pageObj" :studentInformationDatas="studentInformationDatas" v-if="studentInformationDatas.length" />
      </div>
      <!--老师寄语--->
      <!--  -->
      <div class="report-box pageTeacherAssessment">
        <pageTeacherAssessment :pageObj="pageObj" :studentInformationDatas="studentInformationDatas" v-if="studentInformationDatas.length" />
      </div>
      <!-- 初中 -->
      <!--  -->
       <div class="report-box homeWork" v-if="grade === 7 || grade === 8">
        <pageHomeWork2 :pageObj="pageObj"></pageHomeWork2>
      </div>
       <!-- 小学 -->
       <!--  -->
      <div class="report-box homeWork" v-else>
        <pageHomeWork :pageObj="pageObj"></pageHomeWork>
      </div>
      <!-- 封底 -->
      <div class="report-box final">
        <pageFinal></pageFinal>
      </div>
  </div>
  <div class="load-pdf" @click="downLoad" v-show="showDownLoad" :disabled="loadingShow">下载PDF</div>
    <div class="loading" v-show="loadingShow">
        <a-progress type="circle" :width="50" :percent="loadingNum" :stroke-color="{
      '0%': '#108ee9',
      '100%': '#87d068',
    }"/>
      </div>
  </div>
</template>
<script>
  import html2canvas from 'html2canvas'
  import jsPDF from 'jspdf'
  import md5 from 'md5-node'
  import pageCover from '@/pages/evaluate/components/pagePdf/pageCover'
  import pageIdea from '@/pages/evaluate/components/pagePdf/pageIdea'
  import pageMessage from '@/pages/evaluate/components/pagePdf/pageMessage'
  import pageTableContent from '@/pages/evaluate/components/pagePdf/pageTableContent'
  import pageIntroduction from '@/pages/evaluate/components/pagePdf/pageIntroduction'
  import pageMegrez from '@/pages/evaluate/components/pagePdf/pageMegrez'
  import pageClassEva from '@/pages/evaluate/components/pagePdf/pageClassEva'
  import pageAlioth from '@/pages/evaluate/components/pagePdf/pageAlioth'
  import pageAliothClass from '@/pages/evaluate/components/pagePdf/pageAliothClass'
  // import pageAliothImg from '@/pages/evaluate/components/pagePdf/pageAliothImg'
  import pageDubhe from '@/pages/evaluate/components/pagePdf/pageDubhe'
  import pageDubheEcharts from '@/pages/evaluate/components/pagePdf/pageDubheEcharts'

  import pageMerak from '@/pages/evaluate/components/pagePdf/pageMerak'
  import pagePhecda from '@/pages/evaluate/components/pagePdf/pagePhecda'
  import pageLookRoot from '@/pages/evaluate/components/pagePdf/pageLookRoot'
  import pageMorReading from '@/pages/evaluate/components/pagePdf/pageMorReading'
  import pageMorReadingImgs from '@/pages/evaluate/components/pagePdf/pageMorReadingImgs'
  import pageAlkaid from '@/pages/evaluate/components/pagePdf/pageAlkaid'
  import pageAlkaidClass from '@/pages/evaluate/components/pagePdf/pageAlkaidClass'
  import pageAlkaidRecord from '@/pages/evaluate/components/pagePdf/pageAlkaidRecord'
  import pageHomeWork from '@/pages/evaluate/components/pagePdf/pageHomeWork'
  import pageHomeWork2 from '@/pages/evaluate/components/pagePdf/pageHomeWork2'
  import pageMizar from '@/pages/evaluate/components/pagePdf/pageMizar'
  import pageMizarCourse from '@/pages/evaluate/components/pagePdf/pageMizarCourse'
  import pageMizarImgs from '@/pages/evaluate/components/pagePdf/pageMizarImgs'
  import pageHonor from '@/pages/evaluate/components/pagePdf/pageHonor'
  import pageHonorSummary from '@/pages/evaluate/components/pagePdf/pageHonorSummary'
  import pageStudentAssessment from '@/pages/evaluate/components/pagePdf/pageStudentAssessment'
  import pageTeacherAssessment from '@/pages/evaluate/components/pagePdf/pageTeacherAssessment'
  import pageRootImg from '@/pages/evaluate/components/pagePdf/pageRootImg'
  import pageFinal from '@/pages/evaluate/components/pagePdf/pageFinal'
  export default {
    name: '',
    components: {
      pageCover,
      pageIdea,
      pageMessage: pageMessage,
      pageTableContent, // 目录
      pageIntroduction,
      pageMegrez,
      pageDubhe, // 天枢星
      pageDubheEcharts, // 天枢星图表
      pageClassEva,
      pageAlioth, // 玉衡星
      pageAliothClass, // 玉衡星 音乐国家课程
      // pageAliothImg,
      pageMerak, // 天旋星
      pagePhecda, // 天玑星
      pageLookRoot,
      pageRootImg,
      pageMorReading, // 天璇星 拓展课程
      pageMorReadingImgs,
      pageAlkaid, // 摇光星
      pageAlkaidClass,
      pageAlkaidRecord,
      pageHomeWork, // 三年级暑期实践作业
      pageHomeWork2, // 七年级
      pageMizar, // 开阳星
      pageMizarCourse,
      pageMizarImgs,
      pageHonor, // 个人荣誉
      pageHonorSummary,
      pageStudentAssessment, // 学生自评
      pageTeacherAssessment, // 导师寄语
      pageFinal // 封底
    },
    data () {
      return {
        showDownLoad: false, // 下载按钮
        loadingNum: 0, // 进度条
        loadingShow: false,
        chiData: [],
        mathData: [],
        englishData: [],
        bioData: [],
        diliData: [],
        hisData: [],
        daoData: [],
        pageObj: {},
        // pageObj: [],
        i: '',
        classText: '',
        gradeText: '',
        // 基本信息
        studentInformationDatas: [],
        // 天枢星图表数据
        dubheEchartalls: [],
        getKnowledge: [],
        // 玉衡星课程
        aliothClass: [
          {
            name: '美术',
            api: 'getArt2',
            left: 40,
            right: 160
          },
          {
            name: '体育与健康',
            api: 'getSports2',
            left: 60,
            right: 120
          },
          {
            name: '音乐',
            api: 'getMusic2',
            left: 40,
            right: 80
          }
        ],
        // 玉衡星数据
        yuhengData: [],
        // 天璇星数据
        merakDatas: [],
        // 摇光星课程
        alkaidClass: [],
        phecdaRes: [], // 天玑星 寻根问祖
        phecdaResImg: [], // 天玑星 图片
        familyRes: [], // 天玑星 家训与资源
        migrateRes: [], // 天玑星 人口迁徙
        stuSelfEva: [], // 学生自评
        mizarData: [], // 开阳星
        grade: '',
        honorLists: [],
        honorPages: [], // 一共有多少页（8条数据为一页）
        api: 'http://prod.dmapi.xiaoyangedu.com/openapi/output/studentReport',
        name: ''
      }
    },
    created () {
      // let i = this.$route.query.student_id ? this.$route.query.student_id : '2010101'
      // let ti = i.substring(0, 3)
      // this.dubheEchartallsKnowledge(Number(ti))
    },
    mounted () {
      this.$nextTick(async () => {
        let i = this.$route.query.stoken ? window.atob(this.$route.query.stoken) : ''
        // let i = this.$route.query.stoken ? this.$route.query.stoken : ''
        // i = window.atob('MjAxMDEwMQ==')
        // i = window.atob(i)
        this.grade = parseInt(i.slice(2, 3))
        this.class = i.slice(4, 5)
        this.getData(i)
      })
    },
    methods: {
      // 封页 学生信息
      async studentInformation (i) {
        let res = await this.xy.get(`${this.api}/getMoral3`, {
          xuehao: i
        }, true)
        if (res.retCode === 100000) {
          this.studentInformationDatas = JSON.parse(res.retData)
          // console.log(this.studentInformationDatas)
          this.name = this.studentInformationDatas[0]['姓名']
          this.gradeText = this.studentInformationDatas[0]['年级']
          this.classText = this.studentInformationDatas[0]['班级']
          document.title = '学生成长报告册-' + this.studentInformationDatas[0]['姓名']
        }
      },
      // 获取天玑星 学生学科 家族寻根之旅数据
      async getpagePhecda (i) {
        let res = await this.xy.get(`${this.api}/getTianjiScore`, {
          xuehao: i
        }, true)
        if (res.retCode === 100000) {
          let arrWrap = JSON.parse(res.retData)
          this.phecdaRes = []
          for (let i = 0; i < arrWrap.length - 1; i++) {
            let arr = []
            for (let j = 1; j < arrWrap.length; j++) {
              if (arrWrap[i].学科 === arrWrap[j].学科) {
                arr.push(arrWrap[j])
              }
            }
            if (i === 0) {
              this.phecdaRes.push(arr)
            } else {
              if (arrWrap[i].学科 !== arrWrap[i - 1].学科) {
                this.phecdaRes.push(arr)
              }
            }
          }
          this.phecdaRes.map(item => {
            this.getpageFamily(item[0].学科)
          })
        }
      },
      // 获取天玑星图片
      async getpageFamily (i) {
        let res = await this.xy.get(`${this.api}/getTianjiImages`, {
          huodong: i
        }, true)
        if (res.retCode === 100000) {
          this.phecdaResImg.push(JSON.parse(res.retData)[0])
        }
      },
      // 获取天玑星人口迁徙与回家的路
      async pageMigrate (i) {
        let res = await this.xy.get(`${this.api}/getFamilyMigration`, {
          xuehao: i
        }, true)
        if (res.retCode === 100000) {
          this.migrateRes = JSON.parse(res.retData)
        }
      },
      // 获取瑶光星数据
      async getyaoguang (sno) {
        // let sno = this.$route.query.student_id ? this.$route.query.student_id : '2010101'
        let resJson = []
        let res = await this.xy.get(`${this.api}/getAssociation3`, {
          xuehao: sno
        }, true)
        resJson = JSON.parse(res.retData)
        let data = []
        data = resJson
        for (let i = 0; i < resJson.length; i++) {
          // 获取瑶光星项目成果指标数据(21-22-1)
          let res1 = await this.xy.get(`${this.api}/getAssociationPersonality3`, {
            xuehao: sno,
            kecheng: resJson[i]['选修课程']
          }, true)
          // 获取瑶光星项目实践指标数据(21-22-1)
          let res2 = await this.xy.get(`${this.api}/getAssociationCommon3`, {
            xuehao: sno,
            kecheng: resJson[i]['选修课程']
          }, true)
          // 获取瑶光星项目实践指标数据(21-22-1)
          let res3 = await this.xy.get(`${this.api}/getAssociationImage3`, {
            nianji: resJson[i]['年级'],
            shetuan: resJson[i]['选修课程']
          }, true)
          data[i].left = JSON.parse(res2.retData)
          data[i].right = JSON.parse(res1.retData)
          data[i].imgs = JSON.parse(res3.retData)
        }
        // console.log(data)
        this.alkaidClass = data
      },
      // 获取天玑星数据
      async getTianji (sno) {
        // let sno = this.$route.query.student_id ? this.$route.query.student_id : '2070404'
        let resJson = []
        let res = await this.xy.get(`${this.api}/getTianjiScore3`, {
          xuehao: sno
        }, true)
        resJson = JSON.parse(res.retData)
        // console.log(resJson)
        let dataName = []
        let data = []
        resJson.map((item) => {
          dataName.indexOf(item['学科']) === -1 && dataName.push(item['学科'])
        })
        for (let i = 0; i < dataName.length; i++) {
          data.push({ name: dataName[i], arr: [] })
          this.getTianjiImg(dataName[i]).then((res) => {
            // console.log(res)
            data[i].imgs = res
          })
          // console.log(imgs)
          for (let j = 0; j < resJson.length; j++) {
            if (dataName[i] === resJson[j]['学科']) {
              data[i].name = dataName[i]
              data[i].level = resJson[j]['等级']
              data[i].arr.push(resJson[j])
            }
          }
        }
        this.phecdaRes = data
        // console.log(data)
      },
      // 获取天玑星图片
      async getTianjiImg (huodong) {
        let resJson = []
        let res = await this.xy.get(`${this.api}/getTianjiImages3`, {
          huodong: huodong,
          nianji: this.gradeText,
          banji: this.classText
        }, true)
        resJson = JSON.parse(res.retData)
        // console.log(resJson)
        return resJson
      },
      // 获取天璇星数据
      async getTianxuan (sno) {
        // let sno = this.$route.query.student_id ? this.$route.query.student_id : '2010101'
        let resJson = []
        let res = await this.xy.get(`${this.api}/getExpond3`, {
          xuehao: sno
        }, true)
        resJson = JSON.parse(res.retData)
        console.log(resJson)
      },
      // 开阳星
      async pageMizarDatas (i) {
        this.xy.get(`${this.api}/getKaiYangImage3`, {
          xuehao: i
        }, true).then(res => {
          if (res.retCode === 100000) {
            // console.log(JSON.parse(res.retData))
            this.mizarData.push(JSON.parse(res.retData))
          }
        })
      },
      // 获取玉衡星数据
      async getYuheng (sno) {
        // let sno = this.$route.query.student_id ? this.$route.query.student_id : '2010101'
        let resJson = []
        let res = await this.xy.get(`${this.api}/getYuHengDataByStudent3`, {
          xuehao: sno
        }, true)
        resJson = JSON.parse(res.retData)
        // console.log(resJson)
        for (let i = 0; i < resJson.length; i++) {
          // 获取玉衡星学科素养指标数据(21-22-1)
          let res = await this.xy.get(`${this.api}/getYuHengDataByPersonality3`, {
            xuehao: sno,
            xueke: resJson[i]['学科']
          }, true)
          // 获取玉衡星习惯养成指标数据(21-22-1)
          let res2 = await this.xy.get(`${this.api}/getYuHengDataByCommon3`, {
            xuehao: sno,
            xueke: resJson[i]['学科']
          }, true)
          // 获取玉衡星体育数据(21-22-1)
          let res3 = await this.xy.get(`${this.api}/getSports3`, {
            xuehao: sno,
            xueke: resJson[i]['学科']
          }, true)
          // 获取体育年级项目情况(21-22-1)
          let res33 = await this.xy.get(`${this.api}/getSportsLevel3`, {
            nianji: this.gradeText
          }, true)
          // 获取玉衡星学科图片数据(21-22-1)
          let res4 = await this.xy.get(`${this.api}/getYuHengImage3`, {
            xuehao: sno,
            xueke: resJson[i]['学科']
          }, true)
          let api = ''
          if (this.gradeText === '初一(2021级)') {
            api = 'getPsychologyChuOne3'
          }
          if (this.gradeText === '初二(2020级)') {
            api = 'getPsychologyChuTwo3'
          }
          let res5 = null
          if (this.gradeText === '初一(2021级)' || this.gradeText === '初二(2020级)') {
            res5 = await this.xy.get(`${this.api}/${api}`, {
              xuehao: sno
            }, true)
          }
          // console.log(JSON.parse(res5.retData))
          let arr = [
            ...JSON.parse(res.retData).sort((a, b) => {
              return b['分数'] - a['分数']
            }).filter((item) => {
              return item['姓名'] !== '平均分'
            }),
            ...JSON.parse(res2.retData).sort((a, b) => {
              return b['分数'] - a['分数']
            }).filter((item) => {
              return item['姓名'] !== '平均分'
            })
          ]
          let data = {
            ...resJson[i],
            name: JSON.parse(res.retData)[0]['学科'],
            left1: JSON.parse(res2.retData).filter((item) => {
              return item['姓名'] !== '平均分'
            }),
            left2: JSON.parse(res2.retData).filter((item) => {
              return item['姓名'] === '平均分'
            }),
            right1: JSON.parse(res.retData).filter((item) => {
              return item['姓名'] !== '平均分'
            }),
            right2: JSON.parse(res.retData).filter((item) => {
              return item['姓名'] === '平均分'
            }),
            sport: resJson[i]['学科'] === '体育' ? JSON.parse(res3.retData)[0] : [],
            // sportDataX: resJson[i]['学科'] === '体育' ? JSON.parse(res33.retData) : [],
            dataArr: arr,
            img: JSON.parse(res4.retData),
            xinliData: res5 === null ? {} : JSON.parse(res5.retData)[0]
          }
          let sportData = []
          if (resJson[i]['学科'] === '体育') {
            // console.log(JSON.parse(res33.retData))
            for (let i = 0; i < JSON.parse(res33.retData).length; i++) {
              let item = JSON.parse(res33.retData)[i]
              if (item['项目名称'] === '50米跑') {
                sportData.push({
                  '项目名称': item['项目名称'],
                  '分数': data.sport['分数'],
                  '等级': data.sport['等级'],
                  '合格标准': data.sport['50米跑（合格标准）']
                })
              }
              if (item['项目名称'] === '坐位体前屈') {
                sportData.push({
                  '项目名称': item['项目名称'],
                  '分数': data.sport['分数1'],
                  '等级': data.sport['等级1'],
                  '合格标准': data.sport['坐位体前屈（合格标准）']
                })
              }
              if (item['项目名称'] === '1分钟跳绳') {
                sportData.push({
                  '项目名称': item['项目名称'],
                  '分数': data.sport['分数2'],
                  '等级': data.sport['等级2'],
                  '合格标准': data.sport['1分钟跳绳（合格标准）']
                })
              }
              if (item['项目名称'] === '1分钟仰卧起坐') {
                sportData.push({
                  '项目名称': item['项目名称'],
                  '分数': data.sport['分数3'],
                  '等级': data.sport['等级3'],
                  '合格标准': data.sport['1分钟仰卧起坐（合格标准）']
                })
              }
              if (item['项目名称'] === '50米×8往返跑') {
                sportData.push({
                  '项目名称': item['项目名称'],
                  '分数': data.sport['分数4'],
                  '等级': data.sport['等级4'],
                  '合格标准': data.sport['50米×8往返跑（合格标准）']
                })
              }
              if (item['项目名称'] === '立定跳远') {
                sportData.push({
                  '项目名称': item['项目名称'],
                  '分数': data.sport['分数5'],
                  '等级': data.sport['等级5'],
                  '合格标准': data.sport['立定跳远（合格标准）']
                })
              }
              if (item['项目名称'] === '引体向上（男）' && JSON.parse(res3.retData)[0]['性别'] === '男') {
                sportData.push({
                  '项目名称': item['项目名称'],
                  '分数': data.sport['分数6'],
                  '等级': data.sport['等级6'],
                  '合格标准': data.sport['引体向上（合格标准）']
                })
              }
              if (item['项目名称'] === '1000米跑（男）' && JSON.parse(res3.retData)[0]['性别'] === '男') {
                sportData.push({
                  '项目名称': item['项目名称'],
                  '分数': data.sport['分数7'],
                  '等级': data.sport['等级7'],
                  '合格标准': data.sport['1000米跑（合格标准）']
                })
              }
              if (item['项目名称'] === '800米跑（女）' && JSON.parse(res3.retData)[0]['性别'] === '女') {
                sportData.push({
                  '项目名称': item['项目名称'],
                  '分数': data.sport['分数8'],
                  '等级': data.sport['等级8'],
                  '合格标准': data.sport['800米跑（合格标准）']
                })
              }
            }
          }
          data['sportData'] = sportData
          // console.log(data)
          this.yuhengData.push(data)
          // console.log(data, data.name)
        }
        // console.log(this.yuhengData)
      },
      async dubheEchartallsDatas (sno) {
        // 2010 一年级  2020 二年级  2030 三年级 2070七年级
        // let sno = this.$route.query.student_id ? this.$route.query.student_id : '2010101'
        let resJson = []
        let res = await this.xy.get(`${this.api}/getTianShuDataByStudent3`, {
          xuehao: sno
        }, true)
        resJson = JSON.parse(res.retData)
        // console.log(resJson)
        for (let i = 0; i < resJson.length; i++) {
          // 获取天枢星学科素养指标数据(21-22-1)
          let res = await this.xy.get(`${this.api}/getTianShuDataByPersonality3`, {
            xuehao: sno,
            xueke: resJson[i]['学科']
          }, true)
          // 获取天枢星习惯指标数据(21-22-1)
          let res2 = await this.xy.get(`${this.api}/getTianShuDataByCommon3`, {
            xuehao: sno,
            xueke: resJson[i]['学科']
          }, true)
          // 获取天枢星知识点图片数据(21-22-1)
          let res3 = await this.xy.get(`${this.api}/getKnowleageImages3`, {
            xuehao: sno,
            xueke: resJson[i]['学科']
          }, true)
          // console.log(res3)
          // 获取天枢星知识点数据(21-22-1)
          let res4 = await this.xy.get(`${this.api}/getKnowledge3`, {
            xuehao: sno,
            xueke: resJson[i]['学科']
          }, true)
          // console.log(JSON.parse(res4.retData))
          let arr = [
            ...JSON.parse(res.retData).sort((a, b) => {
              return b['分数'] - a['分数']
            }).filter((item) => {
              return item['姓名'] !== '平均分'
            }),
            ...JSON.parse(res2.retData).sort((a, b) => {
              return b['分数'] - a['分数']
            }).filter((item) => {
              return item['姓名'] !== '平均分'
            })
          ]
          // console.log(arr)
          let data = {
            ...resJson[i],
            left1: JSON.parse(res2.retData).filter((item) => {
              return item['姓名'] !== '平均分'
            }),
            left2: JSON.parse(res2.retData).filter((item) => {
              return item['姓名'] === '平均分'
            }),
            right1: JSON.parse(res.retData).filter((item) => {
              return item['姓名'] !== '平均分'
            }),
            right2: JSON.parse(res.retData).filter((item) => {
              return item['姓名'] === '平均分'
            }),
            name: JSON.parse(res.retData)[0]['学科'],
            img: JSON.parse(res3.retData),
            dataArr: arr,
            getKnowledge: JSON.parse(res4.retData).length ? JSON.parse(res4.retData) : []

          }
          this.dubheEchartalls.push(data)
          this.getKnowledge.push(data.getKnowledge)
        }
      },
      // 获取天璇星图片
      async getMerakImg (i) {
        this.xy.get(`${this.api}/getExpond3`, {
          xuehao: i
        }, true).then((res) => {
          if (res.retCode === 100000) {
            this.merakDatas = JSON.parse(res.retData)
            // console.log(JSON.parse(res.retData))
          }
        })
      },

      // 摇光星
      async alkaidEchartallsDatas (i) {
        this.xy.get(`${this.api}/getAssociation2`, {
          xuehao: i
        }, true).then((res) => {
          if (res.retCode === 100000) {
            this.alkaidClass = JSON.parse(res.retData)
          }
        })
      },

      // 获取荣誉汇总列表
      async gethonorList (i) {
        this.xy.get(`${this.api}/getHonor3`, {
          xuehao: i
        }, true).then((res) => {
          if (res.retCode === 100000) {
            this.honorLists = JSON.parse(res.retData)
            // console.log(this.honorLists)
            let ahonorPages = this.honorLists.length > 8 ? Math.ceil(this.honorLists.length / 8) : 1
            for (let i = 1; i <= ahonorPages; i++) {
              this.honorPages.push(i)
            }
          }
        })
      },
      // 学生自评
      async getStudentEva (i) {
        let res = await this.xy.get(`${this.api}/getStudentSelfComment`, {
          xuehao: i
        }, true)
        if (res.retCode === 100000) {
          this.stuSelfEva = JSON.parse(res.retData)[0]
        }
      },

      // 下载pdf
      downLoad1 () {
        // var target = document.getElementsByClassName('right-aside')[0]
        var target = this.$refs.content
        html2canvas(target, {
          dpi: window.devicePixelRatio * 2,
          backgroundColor: '#fff',
          useCORS: true, // 第三个修改的地方
          allowTaint: true, // 允许跨域（默认false）
          scale: 2,
          async: true
        }).then((canvas) => {
          var state = canvas.toDataURL('image/png', 1);
          // eslint-disable-next-line new-cap
          var pdf = new jsPDF('', 'pt', 'a4');
          pdf.addImage(state)

          pdf.save('content.pdf')
        })
      },

      // 下载pdf
      downLoad () {
        // var target = document.getElementsByClassName('right-aside')[0]
        var target = this.$refs.content
        // // target.style.background = '#FFFFFF'
        console.log(target)
        // this.loadingShow = true
        this.loadingNum = 0
        html2canvas(target, {
          dpi: 144, // 导出pdf清晰度
          //    scale: 2,
          allowTaint: true,
          useCORS: true // 支持跨域打印图片
        }).then((canvas) => {
          var contentWidth = canvas.width
          var contentHeight = canvas.height
          console.log(contentWidth, contentHeight)
          // this.loadingNum = 10
          // 一页pdf显示html页面生成的canvas高度
          var pageHeight = contentWidth / 592.28 * 841.89;
          // var pageHeight = 1413
          // 未生成pdf的html页面高度
          var leftHeight = contentHeight
          // this.loadingNum = 20
          console.log(pageHeight, leftHeight)
          // 页面偏移
          var position = 0
          // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
          var imgWidth = 592.28
          var imgHeight = 592.28 / contentWidth * contentHeight
          var pageData = canvas.toDataURL('image/jpeg', 1.0);
          // var pageData = new Image()
          // pageData.setAttribute('crossOrigin', 'Anonymous'); // 解决图片跨域问题
          // pageData.src = canvas.toDataURL('image/jpeg', 1.0);
          console.log(pageData)
          // this.loadingNum = 30
          // eslint-disable-next-line new-cap
          var pdf = new jsPDF('', 'pt', 'a4');
          // console.log(pdf)
          // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
          // 当内容未超过pdf一页显示的范围，无需分页
          while (leftHeight > 0) {
            pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            // 避免添加空白页
            if (leftHeight > 0) {
              pdf.addPage()
              // n / 8 === 0 ? num -= 3 : num += 0.4
              // n++
              // this.loadingNum++
            }
            // else {
            //   this.loadingNum = 100
            //   setTimeout(() => {
            //     this.loadingShow = false
            //   }, 100)
            // }
          }
          console.log(pdf)
          pdf.save(`个性化成长报告-${this.studentInformationDatas[0]['姓名']}-${md5(this.i).slice(8, 24)}.pdf`)
          // pdf.save('content.pdf')
        })
      },
      async getData (i) {
        let p1 = this.studentInformation(i)
        // 天枢星
        let p2 = this.dubheEchartallsDatas(i)
        // 玉衡星
        let p3 = this.getYuheng(i)
        // 开阳星
        let p4 = this.pageMizarDatas(i)
        // 天玑星
        let p5 = this.getTianji(i)
        // 瑶光星
        let p6 = this.getyaoguang(i)
        // 天璇星
        let p7 = this.getMerakImg(i)

        let p8 = this.gethonorList(i)

        // let p9 = this.getStudentEva(i)

        // let p2 = this.getpagePhecda(i)
        // let p3 = this.pageMigrate(i)

        // let p4 = this.alkaidEchartallsDatas(i)
        this.i = i
        await Promise.all([p1, p2, p3, p4, p5, p6, p7, p8]).then(res => {
          setTimeout(() => {
            this.getIndex()
          }, 2500)
        })
      },
      getIndex () {
        let obj1 = {}
        let arr = ['.pageMegrez', '.pageDubhe', '.pageAlioth', '.pageMerak', '.pagePhecda', '.pageAlkaid', '.pageMizar', '.pageHonor', '.pageStudentAssessment', '.pageTeacherAssessment', '.homeWork']
        for (let a of arr) {
          const obj = {}
          if ($(a).index() > 20) {
            obj[a] = $(a).index()
            if (a === '.pageHonor') {
              obj[a] = $(a).index() + 2
            }
            // console.log($('.pageAlioth').index())
            if (a === '.pageMerak' && (this.gradeText === '初一(2021级)' || this.gradeText === '初二(2020级)')) {
              obj[a] = $('.pageMerak').index() - 3
            }
            if (a === '.pagePhecda') {
              if ((this.gradeText === '初一(2021级)' || this.gradeText === '初二(2020级)')) {
                obj[a] = $('.pagePhecda').index() + this.phecdaRes.length - 2
              } else {
                obj[a] = $('.pagePhecda').index() + 2
              }
            }
            if (a === '.pageAlkaid') {
              if ((this.gradeText === '初一(2021级)' || this.gradeText === '初二(2020级)')) {
                obj[a] = $('.pageAlkaid').index() + this.phecdaRes.length + 1
              } else {
                obj[a] = $('.pageAlkaid').index() + 2
              }
            }
            if (a === '.pageMizar') {
              if ((this.gradeText === '初一(2021级)' || this.gradeText === '初二(2020级)')) {
                obj[a] = $('.pageMizar').index() + this.phecdaRes.length + 1
              } else {
                obj[a] = $('.pageMizar').index() + 2
              }
            }
            if (a === '.pageHonor') {
              if ((this.gradeText === '初一(2021级)' || this.gradeText === '初二(2020级)')) {
                obj[a] = $('.pageHonor').index() + this.phecdaRes.length + 3
              } else {
                obj[a] = $('.pageHonor').index() + 4
              }
            }
            // if (a === '.pageAlkaid' || a === '.pageMizar') { pageHonor
            //   obj[a] = $(a).index() + 1
            // }
            if (a === '.pageStudentAssessment' || a === '.pageTeacherAssessment' || a === '.homeWork') {
              if (this.gradeText === '初一(2021级)' || this.gradeText === '初二(2020级)') {
                obj[a] = $(a).index() + this.phecdaRes.length + 2
              } else {
                obj[a] = $(a).index() + 3
              }
            }
          } else {
            obj[a] = $(a).index() - 3
          }
          Object.assign(obj1, obj)
          // console.log($(a).index(), $(a))
        }
        this.$set(this, 'pageObj', obj1)
        // setTimeout(() => {
        this.showDownLoad = false
        // }, 0)
      }
    }
  }
</script>
<style lang='less' scoped>
  .xy-content-module{
    margin: 0 auto;
    padding:0;
  }
  #content{
     width: 999px;
     /* height: 400px; */
     margin: auto;
  }
  .report-box{
    width: 999px;
    height: 1413px;
    color: #000;
    font-size: 18px;
    overflow: hidden;
  }
  .load-pdf{
    position: fixed;
    right: 50px;
    top: 50px;
    padding: 5px 10px;
    border-radius: 4px;
    // height: 30px;
    background: rgba(0, 0, 0, .5);
    color: #fff;
    cursor: pointer;
  }
  .loading{
    width: 50px;
    height: 50px;
    position: fixed;
    right: 60px;
    top: 90px;
    cursor: pointer;
    overflow: hidden;
  }
</style>
