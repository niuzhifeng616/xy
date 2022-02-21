<template>
  <div class='xy-content-module'  v-myTitle="{title:i}">
    <div id="content" ref="content">
      <div class="report-box">
        <pageCover :studentInformationDatas="studentInformationDatas" v-if="studentInformationDatas.length" />
      </div>
      <div class="report-box">
        <pageIdea />
      </div>
      <!--校长寄语-->
      <div class="report-box pageMessage" ref="pageMessage">
        <pageMessage/>
      </div>
      <!--目录-->
      <div class="report-box">
        <pageTableContent :pageObj="pageObj" :grade="grade"/>
      </div>
      <!-- 体系简介 -->
      <div class="report-box">
        <pageIntroduction />
      </div>
      <!-- 天权星 -->
      <div class="report-box pageMegrez">
        <pageMegrez />
      </div>
      <div class="report-box">
        <pageClassEva :studentInformationDatas="studentInformationDatas" v-if="studentInformationDatas.length" />
      </div>
       <!--天枢星-->
      <div class="report-box pageDubhe" ref='pageDubhe'>
        <pageDubhe :pageObj="pageObj" />
      </div>
       <!--天枢星课程-->
      <div class="report-box" v-for="(item,index) in dubheEchartalls" :key='item.name' >
        <pageDubheEcharts :getKnowledge="getKnowledge" :dataAll='item' :index="index" :pageObj="pageObj" :studentInformationDatas="studentInformationDatas" />
      </div>
      <!--玉衡星-->
       <div class="report-box pageAlioth">
        <pageAlioth :pageObj="pageObj"/>
      </div>
      <!--玉衡星课程-->
      <div v-for="(item,index) in aliothClass" :key="item.name">
        <div class="report-box" v-if="aliothClass.length && studentInformationDatas.length">
          <pageAliothClass :dataAll='item' :studentInformationDatas="studentInformationDatas" :index="index" :pageObj="pageObj"/>
        </div>
        <!-- <div class="report-box" v-if="item.api === 'getArt2' || item.api === 'getMusic2' || item.api === 'getPsychology2'">
          <pageAliothImg :dataAll='item' :studentInformationDatas="studentInformationDatas" :index="index" :pageObj="pageObj"  v-if="aliothClass.length && studentInformationDatas.length" />
        </div> -->
      </div>
        <!--天璇星-->
      <div class="report-box pageMerak">
        <pageMerak :pageObj="pageObj"/>
      </div>
      <!-- 天璇星 课程 -->
      <div v-for="(item, index) in merakDatas" :key="index + 'm'">
        <div class="report-box">
          <pageMorReading :evaData="item" :studentInformationDatas="studentInformationDatas" :index="index" v-if="studentInformationDatas.length" :pageObj="pageObj" />
        </div>

        <div class="report-box">
          <pageMorReadingImgs :evaData="item" :studentInformationDatas="studentInformationDatas" :index="index" v-if="studentInformationDatas.length" :pageObj="pageObj" />
        </div>
      </div>
      <!-- 天玑星 -->
      <div class="report-box pagePhecda">
        <pagePhecda :pageObj="pageObj"/>
      </div>
      <div v-for="(item, index) in phecdaRes" :key="item.指标名称" v-show="phecdaRes.length">
        <!-- 天玑星图表 -->
        <div class="report-box lookRoot">
          <pageLookRoot :phecdaResImg="phecdaResImg[index]" :phecdaRes="item" :index="index" :pageObj="pageObj"  v-if="item.length"/>
        </div>
        <!-- 天玑星图片 -->
        <div class="report-box rootImg">
          <pageRootImg :phecdaResImg="phecdaResImg[index]" :index="index"  :pageObj="pageObj" v-if="phecdaResImg.length"/>
        </div>
      </div>
      <!-- 摇光星 -->
      <div class="report-box pageAlkaid">
        <pageAlkaid  :pageObj="pageObj"/>
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
      <div class="report-box pageMizar">
        <pageMizar :pageObj="pageObj"/>
      </div>
      <div v-for="(item, index) in mizarData" :key="item.图片地址">
        <div class="report-box">
          <pageMizarCourse :index="index" :evaData="item" :studentInformationDatas="studentInformationDatas"  :pageObj="pageObj" v-if="studentInformationDatas.length" />
        </div>
        <div class="report-box">
          <pageMizarImgs :index="index" :evaData="item" :studentInformationDatas="studentInformationDatas"  :pageObj="pageObj" v-if="studentInformationDatas.length" />
        </div>
      </div>
      <!---个人荣誉---->
      <div class="report-box pageHonor" style="height:1414px">
        <pageHonor />
      </div>
      <div class="report-box" style="height:1412px"  v-for="(item,index) in honorPages" :key='index + `a`'>
        <pageHonorSummary :pageObj="pageObj" :index="index" :page='item' :name='name' :allData='honorLists' />
      </div>
      <!--学生自评--->
      <div class="report-box pageStudentAssessment">
        <pageStudentAssessment :stuSelfEva="stuSelfEva" :pageObj="pageObj" :studentInformationDatas="studentInformationDatas" v-if="studentInformationDatas.length" />
      </div>
      <!--老师寄语--->
      <div class="report-box pageTeacherAssessment">
        <pageTeacherAssessment :pageObj="pageObj" :studentInformationDatas="studentInformationDatas" v-if="studentInformationDatas.length" />
      </div>
      <!-- 七年级 -->
       <div class="report-box homeWork" v-if="grade=== 7">
        <pageHomeWork2 :pageObj="pageObj"></pageHomeWork2>
      </div>
       <!-- 三年级假期实践作业 -->
      <div class="report-box homeWork" v-else>
        <pageHomeWork :pageObj="pageObj"></pageHomeWork>
      </div>
      <!-- 封底 -->
      <div class="report-box final">
        <pageFinal></pageFinal>
      </div>
    </div>
  </div>
</template>
<script>
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
      let i = this.$route.query.student_id ? this.$route.query.student_id : '2010101'
      let ti = i.substring(0, 3)
      this.dubheEchartallsKnowledge(Number(ti))
    },
    mounted () {
      this.$nextTick(async () => {
        let i = this.$route.query.student_id ? this.$route.query.student_id : '2010101'
        this.grade = parseInt(i.slice(2, 3))
        this.class = i.slice(4, 5)
        this.getData(i)
      })
    },
    methods: {
      // 封页 学生信息
      async studentInformation (i) {
        let res = await this.xy.get(`${this.api}/getMoral2`, {
          xuehao: i
        }, true)
        if (res.retCode === 100000) {
          this.aliothClass = [
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
          ]
          this.studentInformationDatas = JSON.parse(res.retData)
          this.name = this.studentInformationDatas[0]['姓名']
          this.gradeText = this.studentInformationDatas[0]['年级']
          this.classText = this.studentInformationDatas[0]['班级']
          this.pageMizarDatas()
          switch (this.grade) {
            case 1:
              this.aliothClass[1].left = 80
              this.aliothClass[1].right = 160
              this.aliothClass.push({
                name: '科学',
                api: 'getScience2',
                left: 20,
                right: 20
              })
              break
            case 2:
              this.aliothClass[1].left = 80
              this.aliothClass[1].right = 160
              this.aliothClass.push({
                name: '科学',
                api: 'getScience2',
                left: 20,
                right: 20
              })
              break
            case 3:
              this.aliothClass.push(
                {
                  name: '科学',
                  api: 'getScience2',
                  left: 40,
                  right: 40
                },
                {
                  name: '信息技术',
                  api: 'getInformation2',
                  left: 20,
                  right: 20
                }
              )
              break
            case 7:
              this.aliothClass[0].left = 20
              this.aliothClass[0].right = 80
              this.aliothClass.push(
                {
                  name: '心理健康',
                  api: 'getPsychology2',
                  left: 20,
                  right: 80
                },
                {
                  name: '综合实践',
                  api: 'getComprehensive2',
                  left: 20,
                  right: 40
                },
                {
                  name: '信息技术',
                  api: 'getInformation2',
                  left: 20,
                  right: 40
                }
              )
              break
          }
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
      async dubheEchartallsDatas (i) {
        // 2010 一年级  2020 二年级  2030 三年级 2070七年级
        let sno = this.$route.query.student_id ? this.$route.query.student_id : '2010101'
        switch (i) {
          case 201:
            let apiArrs1 = ['getOneGradeChineseSubject2', 'getOneGradeMathSubject2', 'getOneGradeEnglishSubject2']
            for (let i = 0; i < apiArrs1.length; i++) {
              let tempArryuwen = []
              let resyuwen = await this.xy.get(`${this.api}/${apiArrs1[i]}`, {
                xuehao: sno
              }, true)
              if (resyuwen.retCode === 100000) {
                tempArryuwen = JSON.parse(resyuwen.retData)
                this.dubheEchartalls.push(tempArryuwen)
              }
            }
            break
          case 202:
            let apiArrs2 = ['getTwoGradeChineseSubject2', 'getTwoGradeMathSubject2', 'getTwoGradeEnglishSubject2']
            for (let i = 0; i < apiArrs2.length; i++) {
              let tempArryuwen = []
              let resyuwen = await this.xy.get(`${this.api}/${apiArrs2[i]}`, {
                xuehao: sno
              }, true)
              if (resyuwen.retCode === 100000) {
                tempArryuwen = JSON.parse(resyuwen.retData)
                this.dubheEchartalls.push(tempArryuwen)
              }
            }
            break
          case 203:
            let apiArrs3 = ['getThreeGradeChineseSubject2', 'getThreeGradeMathSubject2', 'getThreeGradeEnglishSubject2']
            for (let i = 0; i < apiArrs3.length; i++) {
              let tempArryuwen = []
              let resyuwen = await this.xy.get(`${this.api}/${apiArrs3[i]}`, {
                xuehao: sno
              }, true)
              if (resyuwen.retCode === 100000) {
                tempArryuwen = JSON.parse(resyuwen.retData)
                this.dubheEchartalls.push(tempArryuwen)
              }
            }
            break
          case 207:
            let apiArrs7 = ['getChinese2', 'getMath2', 'getEnglish2', 'getBiology2', 'getGeography2', 'getHistory2', 'getDaoism2']
            for (let i = 0; i < apiArrs7.length; i++) {
              let tempArryuwen = []
              let resyuwen = await this.xy.get(`${this.api}/${apiArrs7[i]}`, {
                xuehao: sno
              }, true)
              if (resyuwen.retCode === 100000) {
                tempArryuwen = JSON.parse(resyuwen.retData)
                this.dubheEchartalls.push(tempArryuwen)
              }
            }
            break
        }
      },
      // 知识图谱
      async dubheEchartallsKnowledge (i) {
        let sno = this.$route.query.student_id ? this.$route.query.student_id : '2010101'
        let tempArryuwen = []
        let apiArrs = []
        switch (i) {
          case 201:
            apiArrs = ['语文', '数学', '英语']
            break
          case 202:
            apiArrs = ['语文', '数学', '英语']
            break
          case 203:
            apiArrs = ['语文', '数学', '英语']
            break
          case 207:
            apiArrs = ['语文', '数学', '英语', '生物', '地理', '历史', '道法']
            break
        }
        for (let i = 0; i < apiArrs.length; i++) {
          let resyuwen = await this.xy.get(`${this.api}/getKnowledge`, {
            xuehao: sno,
            xueke: apiArrs[i]
          }, true)
          if (resyuwen.retCode === 100000) {
            tempArryuwen = JSON.parse(resyuwen.retData)
            this.getKnowledge.push(tempArryuwen)
          }
        }
        this.dubheEchartallsDatas(i)
      },
      // 获取天璇星图片
      async getMerakImg (i) {
        this.xy.get(`${this.api}/getExpond2`, {
          xuehao: i
        }, true).then((res) => {
          if (res.retCode === 100000) {
            this.merakDatas = JSON.parse(res.retData)
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

      // 开阳星
      async pageMizarDatas () {
        this.xy.get(`${this.api}/getMizar2`, {
          nianji: this.gradeText,
          banji: this.classText
        }, true).then(res => {
          if (res.retCode === 100000) {
            let arrWrap = JSON.parse(res.retData)
            for (let i = 0; i < arrWrap.length - 1; i++) {
              let arr = []
              if (i === 0) {
                arr.push(arrWrap[i])
              }
              for (let j = 1; j < arrWrap.length; j++) {
                if (arrWrap[i].活动名称 === arrWrap[j].活动名称) {
                  arr.push(arrWrap[j])
                }
              }
              if (i === 0) {
                this.mizarData.push(arr)
              } else {
                if (arrWrap[i].活动名称 !== arrWrap[i - 1].活动名称) {
                  this.mizarData.push(arr)
                }
              }
            }
          }
        })
      },

      // 获取荣誉汇总列表
      async gethonorList (i) {
        this.xy.get(`${this.api}/getHonor2`, {
          xuehao: i
        }, true).then((res) => {
          if (res.retCode === 100000) {
            this.honorLists = JSON.parse(res.retData)
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
      async getData (i) {
        let p1 = this.studentInformation(i)
        let p2 = this.getpagePhecda(i)
        let p3 = this.pageMigrate(i)

        let p4 = this.alkaidEchartallsDatas(i)
        let p5 = this.gethonorList(i)
        let p6 = this.getStudentEva(i)
        let p7 = this.getMerakImg(i)
        this.i = i
        await Promise.all([p1, p2, p3, p4, p5, p6, p7]).then(res => {
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
            obj[a] = $(a).index() + this.merakDatas.length - 3
            if (a === '.pageHonor') {
              obj[a] = $(a).index() + this.merakDatas.length + 2
            }
            if (a === '.pageStudentAssessment' || a === '.pageTeacherAssessment' || a === '.homeWork') {
              obj[a] = $(a).index() + this.merakDatas.length + 1
            }
          } else {
            obj[a] = $(a).index() - 3
          }
          Object.assign(obj1, obj)
          console.log($(a).index(), $(a))
        }
        this.$set(this, 'pageObj', obj1)
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
  }
</style>
