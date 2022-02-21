<template>
  <div class='xy-content-module'  v-myTitle="{title:i}">
    <div id="content" ref="content">
      <div class="report-box">
        <pageCover :i="i" :studentInformationDatas="studentInformationDatas"  v-if="studentInformationDatas.length"/>
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
        <pageDubhe />
      </div>
       <!--天枢星课程-->
      <div class="report-box" v-for="(item,index) in dubheEchartalls" :key='index' >
        <pageDubheEcharts :dataAll='item'  :index="index+1" :pageObj="pageObj" :studentInformationDatas="studentInformationDatas" v-if="studentInformationDatas.length"/>
      </div>
      <!--玉衡星-->
       <div class="report-box pageAlioth">
        <pageAlioth :pageObj="pageObj"/>
      </div>
      <!--玉衡星课程-->
      <template v-if="aliothClass.length && studentInformationDatas.length">
        <div class="report-box" v-for="(item,index) in aliothClass" :key="item.name">
          <pageAliothClass :dataAll='item' :studentInformationDatas="studentInformationDatas"  :index="index+1" :pageObj="pageObj"/>
        </div>
      </template>
        <!--天璇星-->
      <div class="report-box pageMerak">
        <pageMerak :pageObj="pageObj"/>
      </div>
      <!-- 天璇星 晨读 -->
      <div class="report-box">
        <pageMorReading :studentInformationDatas="studentInformationDatas" v-if="studentInformationDatas.length" :pageObj="pageObj" />
      </div>

      <div class="report-box">
        <pageMorReadingImgs :studentInformationDatas="studentInformationDatas" v-if="studentInformationDatas.length" :pageObj="pageObj" />
      </div>
      <!-- 天璇星 午练 -->
      <div class="report-box">
        <pageNoon :studentInformationDatas="studentInformationDatas" v-if="studentInformationDatas.length"  :pageObj="pageObj"/>
      </div>
      <div class="report-box">
        <pageNoonImgs :studentInformationDatas="studentInformationDatas" v-if="studentInformationDatas.length" :pageObj="pageObj" />
      </div>
      <!-- 天玑星 -->
      <div class="report-box pagePhecda">
        <pagePhecda :pageObj="pageObj"/>
      </div>
      <!-- 寻根问祖 -->
       <div class="report-box lookRoot" v-show="grade ===7">
        <pageLookRoot :phecdaRes="phecdaRes"  :pageObj="pageObj"  v-if="phecdaRes.length"/>
      </div>
      <!-- 寻根问祖的照片 -->
      <div class="report-box rootImg" v-show="grade ===7">
        <pageRootImg :phecdaRes="phecdaRes" :type="'phecdaRes'"  :pageObj="pageObj" v-if="phecdaRes.length"/>
      </div>
      <!-- 寻根问祖 -->
       <div class="report-box lookRoot" v-show="grade ===7">
        <pageFamily :familyRes="familyRes" :pageObj="pageObj"  v-if="familyRes.length"/>
      </div>
      <!-- 家训与资源图片 -->
      <div class="report-box rootImg" v-show="grade ===7">
        <pageRootImg :phecdaRes="familyRes" :type="'familyRes'" :pageObj="pageObj" v-if="familyRes.length"/>
      </div>
      <!-- 人口迁徙 -->
      <div class="report-box lookRoot" v-show="grade ===7">
        <pageMigrate :migrateRes="migrateRes" :pageObj="pageObj"  v-if="migrateRes.length"/>
      </div>
      <!-- 人口迁徙 -->
      <div class="report-box rootImg" v-show="grade ===7">
        <pageRootImg :phecdaRes="migrateRes"  :pageObj="pageObj" :type="'migrateRes'" v-if="migrateRes.length"/>
      </div>
      <!-- 摇光星 -->
      <div class="report-box pageAlkaid">
        <pageAlkaid  :pageObj="pageObj"/>
      </div>

        <div v-for="(item, index2) in alkaidClass" :key="index2+item"  v-show="grade ===7">
          <div class="report-box">
            <pageAlkaidClass :studentInformationDatas="studentInformationDatas" :alkaidClass="item" :index="index2===0?1:index2*2+1"  :pageObj="pageObj" v-if="alkaidClass.length" />
          </div>
          <div class="report-box">
            <pageAlkaidRecord :alkaidClass="item"  :index="index2+(index2===0?2:index2+1*2)" :pageObj="pageObj" v-if="alkaidClass.length" />
          </div>
        </div>

     <div v-show="grade ===7" class="report-box" v-for="(item,index3) in alkaidClass.length" :key="index3+item" style="height:0"></div>

      <!---开阳星--->
      <div class="report-box pageMizar">
        <pageMizar :pageObj="pageObj"/>
      </div>
      <div class="report-box">
        <pageMizarCourse :studentInformationDatas="studentInformationDatas"  :pageObj="pageObj" v-if="studentInformationDatas.length" />
      </div>
      <div class="report-box">
        <pageMizarImgs :studentInformationDatas="studentInformationDatas"  :pageObj="pageObj" v-if="studentInformationDatas.length" />
      </div>
      <!---个人荣誉---->
      <div class="report-box pageHonor" style="height:1414px">
        <pageHonor />
      </div>
      <div class="report-box" style="height:1412px"  v-for="(item,index) in honorPages" :key='index + `a`'>
        <pageHonorSummary :pageObj="pageObj" :index="index" :page='item' :allData='honorLists' />
      </div>
      <!--学生自评--->
      <div class="report-box pageStudentAssessment">
        <pageStudentAssessment :pageObj="pageObj" :studentInformationDatas="studentInformationDatas" v-if="studentInformationDatas.length" />
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
  import html2Canvas from 'html2canvas'
  import JsPDF from 'jspdf'
  import pageCover from '@/pages/evaluate/components/pagePdf/pageCover'
  import pageIdea from '@/pages/evaluate/components/pagePdf/pageIdea'
  import pageMessage from '@/pages/evaluate/components/pagePdf/pageMessage'
  import pageTableContent from '@/pages/evaluate/components/pagePdf/pageTableContent'
  import pageIntroduction from '@/pages/evaluate/components/pagePdf/pageIntroduction'
  import pageMegrez from '@/pages/evaluate/components/pagePdf/pageMegrez'
  import pageClassEva from '@/pages/evaluate/components/pagePdf/pageClassEva'
  import pageAlioth from '@/pages/evaluate/components/pagePdf/pageAlioth'
  import pageAliothClass from '@/pages/evaluate/components/pagePdf/pageAliothClass'
  import pageDubhe from '@/pages/evaluate/components/pagePdf/pageDubhe'
  import pageDubheEcharts from '@/pages/evaluate/components/pagePdf/pageDubheEcharts'
  // import pageDubheEchartsEng from '@/pages/evaluate/components/pagePdf/pageDubheEchartsEng'
  // import pageDubheEchartsChin from '@/pages/evaluate/components/pagePdf/pageDubheEchartsChin'
  // import pageDubheEchartsMath from '@/pages/evaluate/components/pagePdf/pageDubheEchartsMath'
  // import pageDubheEchartsBio from '@/pages/evaluate/components/pagePdf/pageDubheEchartsBio'
  // import pageDubheEchartsGeo from '@/pages/evaluate/components/pagePdf/pageDubheEchartsGeo'
  // import pageDubheEchartsHis from '@/pages/evaluate/components/pagePdf/pageDubheEchartsHis'

  // import pageDubheEchartsDao from '@/pages/evaluate/components/pagePdf/pageDubheEchartsDao'
  import pageMerak from '@/pages/evaluate/components/pagePdf/pageMerak'
  import pagePhecda from '@/pages/evaluate/components/pagePdf/pagePhecda'
  import pageLookRoot from '@/pages/evaluate/components/pagePdf/pageLookRoot'
  import pageFamily from '@/pages/evaluate/components/pagePdf/pageFamily'
  import pageMigrate from '@/pages/evaluate/components/pagePdf/pageMigrate'
  import pageMorReading from '@/pages/evaluate/components/pagePdf/pageMorReading'
  import pageMorReadingImgs from '@/pages/evaluate/components/pagePdf/pageMorReadingImgs'
  import pageNoon from '@/pages/evaluate/components/pagePdf/pageNoon'
  import pageNoonImgs from '@/pages/evaluate/components/pagePdf/pageNoonImgs'
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
      // pageDubheEchartsHis,
      // pageDubheEchartsMath,
      // pageDubheEchartsEng,
      // pageDubheEchartsChin,
      // pageDubheEchartsGeo,
      // pageDubheEchartsBio,
      // pageDubheEchartsDao,
      pageClassEva,
      pageAlioth, // 玉衡星
      pageAliothClass, // 玉衡星 音乐国家课程
      pageMerak, // 天旋星
      pagePhecda, // 天玑星
      pageLookRoot,
      pageRootImg,
      pageFamily,
      pageMigrate,
      pageMorReading, // 天璇星 拓展课程
      pageMorReadingImgs,
      pageNoon,
      pageNoonImgs,
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
        // 玉衡星课程
        aliothClass: [
          {
            name: '美术',
            api: 'getArt',
            left: 40,
            right: 160
          },
          {
            name: '体育与健康',
            api: 'getSports',
            left: 60,
            right: 120
          },
          {
            name: '音乐',
            api: 'getMusic',
            left: 40,
            right: 80
          }
        ],
        // 摇光星课程
        alkaidClass: [],
        phecdaRes: [], // 天玑星 寻根问祖
        familyRes: [], // 天玑星 家训与资源
        migrateRes: [], // 天玑星 人口迁徙
        grade: '',
        honorLists: [],
        honorPages: [] // 一共有多少页（8条数据为一页）
      }
    },
    created () {
      console.log(this.md5(this.$route.query.student_id))
      // this.class = this.$route.query.class
      // this.grade = this.$route.query.grade
    },
    mounted () {
      this.$nextTick(async () => {
        this.getStudentList()
        this.getData()
      })
    },
    methods: {
      // 封页 学生信息
      async studentInformation (i) {
        let res = await this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/studentReport/getMoral`, {
          xuehao: i
        }, true)
        return new Promise((resolve) => {
          if (res.retCode === 100000) {
            this.aliothClass = [
              {
                name: '美术',
                api: 'getArt',
                left: 40,
                right: 160
              },
              {
                name: '体育与健康',
                api: 'getSports',
                left: 60,
                right: 120
              },
              {
                name: '音乐',
                api: 'getMusic',
                left: 40,
                right: 80
              }
            ]
            this.studentInformationDatas = JSON.parse(res.retData)
            this.gradeText = this.studentInformationDatas[0]['年级']

            this.classText = this.studentInformationDatas[0]['班级']
            switch (this.grade) {
              case 1:
                this.aliothClass[1].left = 80
                this.aliothClass[1].right = 160
                this.aliothClass.push({
                  name: '科学',
                  api: 'getScience',
                  left: 20,
                  right: 20
                })
                break
              case 2:
                this.aliothClass[1].left = 80
                this.aliothClass[1].right = 160
                this.aliothClass.push({
                  name: '科学',
                  api: 'getScience',
                  left: 20,
                  right: 20
                })
                break
              case 3:
                this.aliothClass.push(
                  {
                    name: '科学',
                    api: 'getScience',
                    left: 40,
                    right: 40
                  },
                  {
                    name: '信息技术',
                    api: 'getInformation',
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
                    api: 'getPsychology',
                    left: 20,
                    right: 80
                  },
                  {
                    name: '综合实践',
                    api: 'getComprehensive',
                    left: 20,
                    right: 40
                  },
                  {
                    name: '信息技术',
                    api: 'getInformation',
                    left: 20,
                    right: 40
                  }
                )
                break
            }
            setTimeout(() => {
              resolve('封页 学生信息')
            }, 3000)
            // this.dubheEchartallsDatas()
            let ti = this.studentInformationDatas[0]['学号'].substring(0, 3)
            this.dubheEchartallsDatas(Number(ti))
          }
        })
      },
      // 获取天玑星球 家族寻根之旅数据
      async getpagePhecda (i) {
        let res = await this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/StudentReport/getFamilyRoots`, {
          xuehao: i
        }, true)
        return new Promise((resolve) => {
          if (res.retCode === 100000) {
            this.phecdaRes = JSON.parse(res.retData)
            setTimeout(() => {
              resolve('家族寻根之旅数据')
            }, 3000)
          }
        })
      },
      // 获取天玑星家训与资源
      async getpageFamily (i) {
        let res = await this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/StudentReport/getFamily`, {
          xuehao: i
        }, true)
        return new Promise((resolve) => {
          if (res.retCode === 100000) {
            this.familyRes = JSON.parse(res.retData)
            setTimeout(() => {
              resolve('训与资源')
            }, 3000)
          }
        })
      },
      // 获取天玑星人口迁徙与回家的路
      async pageMigrate (i) {
        let res = await this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/StudentReport/getFamilyMigration`, {
          xuehao: i
        }, true)
        return new Promise((resolve) => {
          if (res.retCode === 100000) {
            this.migrateRes = JSON.parse(res.retData)
            setTimeout(() => {
              resolve('人口迁徙')
            }, 3000)
          }
        })
      },
      // 天枢星 图表
      async getChinese (i) {
        let interfaceRText = ''
        if (this.grade === 2) {
          interfaceRText = 'getTwoGradeChinesesubject'
        } else if (this.grade === 3) {
          interfaceRText = 'getThreeGradeChinesesubject'
        } else if (this.grade === 1) {
          interfaceRText = 'getOneGradeChinesesubject'
        } else {
          interfaceRText = 'getChinesesubject'
        }
        return new Promise((resolve) => {
          this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/studentReport/${interfaceRText}`, {
            xuehao: i
          }, true).then((res) => {
            if (res.retCode === 100000) {
              this.chiData = JSON.parse(res.retData)
              setTimeout(() => {
                resolve(JSON.parse(res.retData))
              }, 3000)
            }
          })
          // })
        })
      },
      async getMath (i) {
        let interfaceRText = ''
        if (this.grade === 2) {
          interfaceRText = 'getTwoGradeMathsubject'
        } else if (this.grade === 3) {
          interfaceRText = 'getThreeGradeMathsubject'
        } else if (this.grade === 1) {
          interfaceRText = 'getOneGradeMathsubject'
        } else {
          interfaceRText = 'getMathsubject'
        }
        return new Promise((resolve) => {
          this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/studentReport/${interfaceRText}`, {
            xuehao: i
          }, true).then((res) => {
            if (res.retCode === 100000) {
              // this.phecdaRes =\
              this.mathData = JSON.parse(res.retData)
              setTimeout(() => {
                resolve(JSON.parse(res.retData))
              }, 3000)
            }
          })
          // })
        })
      },

      async getEnglish (i) {
        let interfaceRText = ''
        if (this.grade === 2) {
          interfaceRText = 'getTwoGradeEnglishsubject'
        } else if (this.grade === 3) {
          interfaceRText = 'getThreeGradeEnglishsubject'
        } else if (this.grade === 1) {
          interfaceRText = 'getOneGradeEnglishsubject'
        } else {
          interfaceRText = 'getEnglishsubject'
        }
        return new Promise((resolve) => {
          this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/studentReport/${interfaceRText}`, {
            xuehao: i
          }, true).then((res) => {
            if (res.retCode === 100000) {
              // this.phecdaRes =
              this.englishData = JSON.parse(res.retData)
              setTimeout(() => {
                resolve(JSON.parse(res.retData))
              }, 3000)
            }
          })
        })
      },
      // 生物
      async getBiology (i) {
        return new Promise((resolve) => {
          this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/studentReport/getBiologysubject`, {
            xuehao: i
          }, true).then((res) => {
            if (res.retCode === 100000) {
              // this.phecdaRes =
              this.bioData = JSON.parse(res.retData)
              setTimeout(() => {
                resolve(JSON.parse(res.retData))
              }, 3000)
            }
          })
        })
      },
      // 地理
      async getGeography (i) {
        return new Promise((resolve) => {
          this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/studentReport/getGeographysubject`, {
            xuehao: i
          }, true).then((res) => {
            if (res.retCode === 100000) {
              // this.phecdaRes =
              this.diliData = JSON.parse(res.retData)
              setTimeout(() => {
                resolve(JSON.parse(res.retData))
              }, 3000)
            }
          })
        })
      },
      //  历史,
      async getHistory (i) {
        return new Promise((resolve) => {
          this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/studentReport/getHistorysubject`, {
            xuehao: i
          }, true).then((res) => {
            if (res.retCode === 100000) {
              // this.phecdaRes =
              this.hisData = JSON.parse(res.retData)
              setTimeout(() => {
                resolve(JSON.parse(res.retData))
              }, 3000)
            }
          })
        })
      },
      // 道法
      async getDaoism (i) {
        let interfaceRText = ''
        if (this.grade === 2) {
          interfaceRText = 'getTwoGradeDaoismsubject'
        } else if (this.grade === 3) {
          interfaceRText = 'getThreeGradeDaoismsubject'
        } else if (this.grade === 1) {
          interfaceRText = 'getOneGradeDaoismsubject'
        } else {
          interfaceRText = 'getDaoismsubject'
        }
        return new Promise((resolve) => {
          this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/studentReport/${interfaceRText}`, {
            xuehao: i
          }, true).then((res) => {
            if (res.retCode === 100000) {
              // this.phecdaRes =
              this.daoData = JSON.parse(res.retData)
              setTimeout(() => {
                resolve(JSON.parse(res.retData))
              }, 3000)
            }
          })
        })
      },
      async dubheEchartallsDatas (i) {
        // let judgexuehao = this.studentInformationDatas[0]['学号'].slice(0, 4)
        // let xuehao = this.studentInformationDatas[0]['学号']
        // 2010 一年级  2020 二年级  2030 三年级 2070七年级
        let sno = this.$route.query.student_id ? this.$route.query.student_id : '2010101'
        switch (i) {
          case 201:
            let apiArrs1 = ['getOneGradeChinesesubject', 'getOneGradeMathsubject', 'getOneGradeEnglishsubject', 'getOneGradeDaoismsubject']
            for (let i = 0; i < apiArrs1.length; i++) {
              let tempArryuwen = []
              let resyuwen = await this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/studentReport/${apiArrs1[i]}`, {
                xuehao: sno
              }, true)
              if (resyuwen.retCode === 100000) {
                tempArryuwen = JSON.parse(resyuwen.retData)
                this.dubheEchartalls.push(tempArryuwen)
                console.log(this.dubheEchartalls)
              }
            }
            break
          case 202:
            let apiArrs2 = ['getTwoGradeChinesesubject', 'getTwoGradeMathsubject', 'getTwoGradeEnglishsubject', 'getTwoGradeDaoismsubject']
            for (let i = 0; i < apiArrs2.length; i++) {
              let tempArryuwen = []
              let resyuwen = await this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/studentReport/${apiArrs2[i]}`, {
                xuehao: sno
              }, true)
              if (resyuwen.retCode === 100000) {
                tempArryuwen = JSON.parse(resyuwen.retData)
                this.dubheEchartalls.push(tempArryuwen)
                console.log(this.dubheEchartalls)
              }
            }
            break
          case 203:
            let apiArrs3 = ['getThreeGradeChinesesubject', 'getThreeGradeMathsubject', 'getThreeGradeEnglishsubject', 'getThreeGradeDaoismsubject']
            for (let i = 0; i < apiArrs3.length; i++) {
              let tempArryuwen = []
              let resyuwen = await this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/studentReport/${apiArrs3[i]}`, {
                xuehao: sno
              }, true)
              if (resyuwen.retCode === 100000) {
                tempArryuwen = JSON.parse(resyuwen.retData)
                this.dubheEchartalls.push(tempArryuwen)
                console.log(this.dubheEchartalls)
              }
            }
            break
          case 207:
            let apiArrs7 = ['getChinesesubject', 'getMathsubject', 'getEnglishsubject', 'getBiologysubject', 'getGeographysubject', 'getHistorysubject', 'getDaoismsubject']
            for (let i = 0; i < apiArrs7.length; i++) {
              let tempArryuwen = []
              let resyuwen = await this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/studentReport/${apiArrs7[i]}`, {
                xuehao: sno
              }, true)
              if (resyuwen.retCode === 100000) {
                tempArryuwen = JSON.parse(resyuwen.retData)
                this.dubheEchartalls.push(tempArryuwen)
                console.log(this.dubheEchartalls)
              }
            }
            break
        }
      },

      // 摇光星
      async alkaidEchartallsDatas (i) {
        return new Promise((resolve) => {
          console.log(this.gradeText, '333333333333333333333333333')
          this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/studentReport/getAssociationAmount`, {
            xuehao: i
          }, true).then((res) => {
            if (res.retCode === 100000) {
              this.alkaidClass = JSON.parse(res.retData)
              console.log(this.alkaidClass)
              setTimeout(() => {
                resolve(JSON.parse(res.retData))
              }, 3000)
            }
          })
        })
      },

      // 获取荣誉汇总列表
      async gethonorList (i) {
        return new Promise((resolve) => {
          this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/studentReport/getHonorSummary`, {
            xuehao: i
          }, true).then((res) => {
            if (res.retCode === 100000) {
              this.honorLists = JSON.parse(res.retData)
              let ahonorPages = this.honorLists.length > 8 ? Math.ceil(this.honorLists.length / 8) : 1
              console.log(ahonorPages)
              for (let i = 1; i <= ahonorPages; i++) {
                this.honorPages.push(i)
              }
              console.log(this.honorPages)
              console.log(this.honorLists)
              setTimeout(() => {
                resolve(JSON.parse(res.retData))
              }, 3000)
            }
          })
        })
      },
      // 根据年级班级获取 学生列表
      async getStudentList () {
        let i = this.$route.query.student_id ? this.$route.query.student_id : '2010101'
        console.log(i)
        this.grade = parseInt(i.slice(2, 3))
        console.log(typeof this.grade)
        this.class = i.slice(4, 5)
        let grade = this.grade === 1 ? '一年级' : this.grade === 2 ? '二年级' : this.grade === 3 ? '三年级' : '七年级'
        let classs = String(this.class + '班')
        console.log(this.grade)
        console.log(this.class)
        let res = await this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/studentReport/getStudentList`, {
          grade: grade,
          class: classs
          // grade: '二年级',
          // class: '1班'
        }, true)
        console.log(res)
        if (res.retCode === 100000) {
          let arr = JSON.parse(res.retData)
          console.log(arr)
          let numArr = arr.map(item => {
            return item['学号']
          })
          console.log(numArr)
          // this.getData(numArr)
        }
      },
      async getData (numArr) {
        /*
        * 七年级
        */
        // ['2010101', '2070102']
        // 2020101
        // let i = this.$route.query.student_id ? this.$route.query.student_id : '2010101'
        //  for (let i of ['2020101', '2020102', '2020103', '2020104', '2020105', '2020106', '2020107', '2020108']) {
        let i = this.$route.query.student_id ? this.$route.query.student_id : '2010101'
        let p1 = this.studentInformation(i)
        let p2 = this.getpagePhecda(i)
        let p3 = this.getpageFamily(i)
        let p4 = this.pageMigrate(i)
        // // 语文
        // let p5 = this.getChinese(i)
        // // 数学
        // let p6 = this.getMath(i)

        // // 英语
        // let p7 = this.getEnglish(i)
        // 道法
        // getDaoism
        // let p8, p9, p10
        // let p11 = this.getDaoism(i)
        // if (this.grade === 7) {
        //   // 生物
        //   p8 = this.getBiology(i)
        //   // 地理
        //   p9 = this.getGeography(i)
        //   // 历史
        //   p10 = this.getHistory(i)
        // }

        let p12 = this.alkaidEchartallsDatas(i)
        let p13 = this.gethonorList(i)
        this.i = i

        await Promise.all([p1, p2, p3, p4, p12, p13]).then(res => {
          // this.$print(this.$refs.content)
          setTimeout(() => {
            this.getIndex()
          }, 1000)
        })
        // setTimeout(() => { this.$print(this.$refs.content) }, 3000)
        // setTimeout(() => {
        //   this.$print(this.$refs.content)
        //   // window.print()
        // }, 2000)
      //  }
      },
      getIndex () {
        let obj1 = {}
        let arr = ['.pageMessage', '.pageDubhe', '.pageAlioth', '.pageMegrez', '.pagePhecda', '.pageAlkaid', '.pageMerak', '.pageMizar', '.pageHonor', '.pageStudentAssessment', '.pageTeacherAssessment', '.homeWork']
        // if (this.grade === 7) {
        //   arr = arr.concat(['.pagePhecda', '.pageAlkaid'])
        // }
        // ['.pageMessage', '.pageDubhe', '.pageAlioth', '.pageMegrez', '.pageMerak', '.pagePhecda', '.pageAlkaid', '.pageMizar', '.pageHonor', '.pageStudentAssessment', '.pageTeacherAssessment', '.homeWork']
        for (let a of arr) {
          console.log($(a).index())
          const obj = {}
          if (this.grade !== 7) {
            if (a === '.pageMizar' || a === '.pageHonor' || a === '.pageStudentAssessment' || a === '.pageTeacherAssessment' || a === '.homeWork' || a === '.pageAlkaid') {
              obj[a] = $(a).index() - 9
            } else {
              obj[a] = ($(a).index() + 1) - 4
            }
          } else {
            obj[a] = ($(a).index() + 1) - 4
          }
          console.log(obj)
          Object.assign(obj1, obj)
        }
        console.log(obj1)
        this.$set(this, 'pageObj', obj1)
      },
      // 判断是否需要分页
      isSplit (nodes, index, pageHeight) {
        if (nodes[index].offsetTop + nodes[index].offsetHeight < pageHeight && nodes[index + 1] && nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight > pageHeight) {
          return true
        }
        return false
      },
      handleDown (i) {
        console.log('我要打印了')
        return new Promise((resolve) => {
          // let target = document.querySelector('#content')
          // let target = this.$refs.content
          const A4_WIDTH = 592.28
          const A4_HEIGHT = 841.89
          this.$nextTick(async () => {
            // let target = document.querySelector('#content')
            let target = this.$refs.content
            // console.log(`内部打印${target}`)
            let pageHeight = target.scrollWidth / A4_WIDTH * A4_HEIGHT
            let lableListID = document.getElementsByClassName('target-node-item')
            for (let i = 0; i < lableListID.length; i++) {
              let multiple = Math.ceil((lableListID[i].offsetTop + lableListID[i].offsetHeight) / pageHeight)
              if (this.isSplit(lableListID, i, multiple * pageHeight)) {
                let divParent = lableListID[i].parentNode // 获取该div的父节点
                let newNode = document.createElement('div')
                // newNode.style.background = '#ffffff'
                let _H = multiple * pageHeight - (lableListID[i].offsetTop + lableListID[i].offsetHeight)
                newNode.style.height = _H + 50 + 'px'
                let next = lableListID[i].nextSibling // 获取div的下一个兄弟节点
                // 判断兄弟节点是否存在
                if (next) {
                  // 存在则将新节点插入到div的下一个兄弟节点之前，即div之后
                  divParent.insertBefore(newNode, next)
                } else {
                  // 不存在则直接添加到最后,appendChild默认添加到divParent的最后
                  divParent.appendChild(newNode)
                }
              }
            }

            resolve()

            this.down(target, `${i}`)
          }, 5000)

        // await this.down(target, `我的合同${this.i}`, async (file) => {
        //   // file:blob对象
        // })
        // this.i = i
        })
        //  this.down(target, `我的合同${i}`)
      },
      down (targetDom, name) {
        setTimeout(async => {
          let cloneDom = targetDom.cloneNode(true)
          cloneDom.style.width = targetDom.scrollWidth + 'px'
          cloneDom.style.height = targetDom.scrollHeight + 'px'
          cloneDom.style.background = '#FFFFFF'
          document.body.appendChild(cloneDom)
          html2Canvas(cloneDom, {
            //   scale: 1, // 提升画面质量，但是会增加文件大小
            useCORS: true, // 允许跨域图片 当图片是链接地址时，需加该属性，否组无法显示图片
            imageTimeout: 0, // 图片加载延迟，默认延迟为0，单位毫秒
            height: targetDom.scrollHeight, // canvas的高度设定
            width: targetDom.scrollWidth // canvas的宽度设定
          //   dpi: window.devicePixelRatio * scale, // 将分辨率提高到特定的DPI
          }).then(canvas => {
            document.body.removeChild(cloneDom)
            // a4纸的尺寸[592.28,841.89]
            const A4_WIDTH = 592.28
            const A4_HEIGHT = 841.89
            let contentWidth = canvas.width
            let contentHeight = canvas.height
            let pageData = canvas.toDataURL('image/jpeg', 1.0)
            // 一页pdf html页面生成的canvas高度;
            let pageHeight = contentWidth / A4_WIDTH * A4_HEIGHT
            // 未生成pdf的html页面高度
            let leftHeight = contentHeight
            // 页面偏移
            let position = 0
            // a4纸的尺寸[592.28,841.89]，html页面生成的canvas在pdf中图片的宽高
            let imgWidth = 596.6
            let imgHeight = A4_WIDTH / contentWidth * contentHeight
            // 设置pdf的尺寸，pdf要使用pt单位 已知 1pt/1px = 0.75   pt = (px/scale)* 0.75
            let pdf = new JsPDF('', 'pt', 'a4')
            // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度
            // 当内容未超过pdf一页显示的范围，无需分页
            if (leftHeight < pageHeight) {
              pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
            } else {
              while (leftHeight > 0) {
                pdf.addImage(pageData, 'JPEG', -2, position, imgWidth, imgHeight)
                leftHeight -= pageHeight
                position -= A4_HEIGHT
                // 避免添加空白页
                if (leftHeight > 0) {
                  pdf.addPage()
                }
              }
            }

            // 直接下载
            pdf.save(name + '.pdf')
          })
        }, 0)
      }
    }
  }
</script>
<!-- <script>
  function randomNum (minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10)
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
      // 或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum );
      default:
        return 0
    }
  }
  export default {
    name: 'App',
    data () {
      return {
        pageObj: {},
        i: 0
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.getData()
      })
    },
    methods: {
      sleep () {
        return new Promise((resolve, reject) => {
          let timer = randomNum(0, 3)
          setTimeout(() => {
            console.log(`模拟耗时${timer}s`)
            resolve()
          }, timer * 1000)
        })
      },
      async getData () {
        for (let i of ['a', 'b', 'c', 'd', 'e']) {
          this.i = i
          if (i === 0) {
            return false
          }
          await this.handleDown()
        }
      },
      handleDown () {
        return new Promise((resolve) => {
          // 确保虚拟DOM 挂载到真实DOM之后
          this.$nextTick(async () => {
            // 模拟下载操作完成
            await this.sleep()
            console.log(`内部打印${this.i}`)

            // 执行下一步操作
            resolve()
          })
        })
      }
    }
  } -->

<!-- </script> -->
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
