const mkdirp = require('mkdirp')
const fs = require('fs')
const { series, src, dest, parallel } = require('gulp')
const del = require('del')
const inject = require('gulp-inject')
const rename = require('gulp-rename')
let Streamseries = require('stream-series')

const dirList = {
  mainDirName: 'build',
  subDir: {
    common: '',
    basic: '',
    // attendance: 'http://updatefjsdfz.att.xiaoyangedu.com',
    // evaluation: 'http://updatefjsdfz.eva.xiaoyangedu.com',
    // educationAffairs: 'http://updatefjsdfz.ea.xiaoyangedu.com',
    // schoolAffairs: 'http://updatefjsdfz.sa.xiaoyangedu.com',
    // operationalAnalysis: 'http://updatefjsdfz.oa.xiaoyangedu.com',
    // dataAnalysis: 'http://updatefjsdfz.da.xiaoyangedu.com',
    // infoPublic: 'http://updatefjsdfz.inp.xiaoyangedu.com',

    attendance: '',
    evaluation: '',
    educationAffairs: '',
    schoolAffairs: '',
    operationalAnalysis: '',
    dataAnalysis: '',
    infoPublic: ''
  }
}

const subDirNameList = Object.keys(dirList.subDir)

function cleanDir (cb) {
  if (fs.existsSync('./build')) {
    del([
      './build/*'
    ], cb())
  } else {
    mkdirp('./build', function (err) {
      if (err) {
        console.log(err)
      } else {
        cb()
      }
    })
  }
}

function makeDir (cb) {
  let count = 0
  subDirNameList.forEach(function (value) {
    mkdirp(`./build/${value}`, function (err) {
      if (err) {
        console.log(err)
      } else {
        count += 1
        if (count === subDirNameList.length) {
          cb()
        }
      }
    })
  })
}

function moveJs (cb) {
  let count = 0
  let jsArr = fs.readdirSync('./dist/js')
  jsArr.forEach(function (value) {
    subDirNameList.forEach(function (val) {
      if (value.split('.')[0] === 'chunk-vendors' || value.split('.')[0] === 'app') {
        src(`./dist/js/${value}`).pipe(dest(`./build/common`)).on('end', function (err) {
          if (err) {
            console.log(err)
          } else {
            count += 1
          }
          if (count === jsArr.length) {
            cb()
          }
        })
      }
      let valueString
      if (value.split('.')[0].indexOf('~') > -1) {
        valueString = value.split('.')[0].split('~')[0]
      } else {
        valueString = value.split('.')[0]
      }
      if (valueString === val) {
        src(`./dist/js/${value}`).pipe(dest(`./build/${val}`)).on('end', function (err) {
          if (err) {
            console.log(err)
          } else {
            count += 1
          }
          if (count === jsArr.length) {
            cb()
          }
        })
      }

    })
  })
}

function copyHTML (cb) {
  src(['./public/template.html'])
    .pipe(rename('index.html'))
    .pipe(dest('./build')).on('end', function () {
    cb()
  })
}

function copyIco (cb) {
  src(['./dist/favicon.ico'])
    .pipe(dest('./build/')).on('end', function () {
    cb()
  })
}

function copyIMg (cb) {
  src(['./dist/img/*'])
    .pipe(dest('./build/img')).on('end', function () {
    cb()
  })
}

function copyCss (cb) {
  src(['./dist/css/*'])
    .pipe(dest('./build/css')).on('end', function () {
    cb()
  })
}

let copyFile = parallel(copyHTML, copyIco, copyIMg, copyCss)

function injectFile (cb) {
  let target = src('./build/index.html')
  let sourcesCss = src(['./build/css/*.css'], { read: false })
  let common = src(['./build/common/*.js'], { read: true })
  let basic = src(['./build/basic/*.js'], { read: true })
  let attendance = src(['./build/attendance/*.js',], { read: true })
  let evaluation = src(['./build/evaluation/*.js',], { read: true })
  let educationAffairs = src(['./build/educationAffairs/*.js',], { read: true })
  let schoolAffairs = src(['./build/schoolAffairs/*.js',], { read: true })
  let operationalAnalysis = src(['./build/operationalAnalysis/*.js',], { read: true })
  let dataAnalysis = src(['./build/dataAnalysis/*.js',], { read: true })
  let infoPublic = src(['./build/infoPublic/*.js',], { read: true })

  let options = {
    addPrefix: '',
    relative: true,
    transform: function (filepath) {
      filepath = dirList.subDir[filepath.split('/')[0]] + '/' + filepath
      return inject.transform.apply(inject.transform, arguments)
    }
  }
  target.pipe(inject(sourcesCss, { relative: true }))
    .pipe(inject(Streamseries(common, basic, attendance, evaluation, educationAffairs, schoolAffairs, operationalAnalysis, dataAnalysis, infoPublic), options))
    .pipe(dest('./build'))
  cb()
}

exports.clean = cleanDir

exports.default = series(cleanDir, makeDir, moveJs, copyFile, injectFile)
