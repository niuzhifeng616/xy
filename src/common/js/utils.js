
import Cookies from 'js-cookie'
import { Message, Modal, Spin } from 'view-design'
import xyapi from '@/common/js/api'

let CryptoJS = require('crypto-js')
let moment = require('moment')

function Utils () {
  // 登录加密keynpm in
  this.options = {
    key: 'cuer6BeKHK0',
    iv: 'Xig6+j+mREs='
  }
}

Utils.prototype.moment = moment
Utils.prototype.post = xyapi.$post
Utils.prototype.get = xyapi.$get
Utils.prototype.put = xyapi.$put
Utils.prototype.setCookie = Cookies.set
Utils.prototype.getCookie = Cookies.get
Utils.prototype.removeCookie = Cookies.remove

Utils.prototype.setHOST = function (config) {
  let currentWebUrl = location.origin
  let result
  config.forEach(function (value) {
    if (value.webUrL === currentWebUrl) {
      result = {
        apiUrl: value.apiUrl
      }
    }
  })
  if (result) {
    return result
  } else {
    // alert('域名配置错误')
  }
}

// 登录密码加密
Utils.prototype.encrypt = function (str) {
  var key = CryptoJS.enc.Base64.parse(this.options.key) // key 要和后台一致
  var iv = CryptoJS.enc.Base64.parse(this.options.iv) // iv 要和后台一致
  str = CryptoJS.enc.Utf8.parse(str)
  return CryptoJS.DES.encrypt(str, key, { iv: iv, mode: CryptoJS.mode.CBC }).toString()
}

// 登录密码解密
Utils.prototype.decrypt = function (str) {
  var key = CryptoJS.enc.Base64.parse(this.options.key)
  var iv = CryptoJS.enc.Base64.parse(this.options.iv)
  var decryptObj = CryptoJS.DES.decrypt(str, key, { iv: iv, mode: CryptoJS.mode.CBC })
  return decryptObj.toString(CryptoJS.enc.Utf8)
}

/* url解析 */
Utils.prototype.parseQueryString = function (val) {
  let urlStr
  if (val) {
    urlStr = val
  } else {
    urlStr = location.search.substr(1) ? location.search.substr(1) : ''
  }
  let urlArr = []
  for (let i = 0; i < urlStr.split('&').length; i++) {
    urlArr.push(urlStr.split('&')[i].split('=')[0] ? urlStr.split('&')[i].split('=')[0] : '')
    urlArr.push(urlStr.split('&')[i].split('=')[1] ? urlStr.split('&')[i].split('=')[1] : 'onlyKey')
  }
  if (urlStr !== '') {
    var urlObj = {}
    for (var i = 0; i < urlArr.length; i += 2) {
      if (urlArr[i] !== '') {
        urlObj[urlArr[i]] = decodeURIComponent(urlArr[i + 1])
      }
    }
    return urlObj
  }
}

Utils.prototype.getIsPC = function () {
  var flag = true
  var userAgentInfo = navigator.userAgent
  var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']

  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}

/* 下载文件 */
Utils.prototype.downFile = function (url, data, type) {
  data = data || {}
  if (url.indexOf('?') > -1) {
    data = this.parseQueryString(url.slice(url.indexOf('?') + 1))
  }
  type = type || 'get'
  let formStr = `<form id='xyCommDownloadFileForm' style="visibility:hidden" method="${type}" action="${url}">`
  for (let key in data) {
    formStr += `<input type='hidden' name="${key}" value='${data[key]}'/>`
  }
  formStr += `<input type='hidden' name="XYTOKEN" value="${this.getCookie('.XYTOKEN')}" /></form>`

  let bodyDom = document.querySelector('body')
  let formWrap = document.createElement('div')
  formWrap.id = 'formWrap'
  bodyDom.appendChild(formWrap)
  let formWrapNode = document.getElementById('formWrap')
  formWrapNode.innerHTML = formStr
  let formDom = document.getElementById('xyCommDownloadFileForm')
  formDom.submit()
  bodyDom.removeChild(formWrapNode)
}

Utils.prototype.getAMorPMCHN = function (type) {
  var str = '上午'
  switch (type) {
    case 'MS':
      str = '早自习'
      break
    case 'AM':
      str = '上午'
      break
    case 'AB':
      str = '上午大课间'
      break
    case 'NS':
      str = '午休'
      break
    case 'PM':
      str = '下午'
      break
    case 'PB':
      str = '下午大课间'
      break
    case 'ES':
      str = '晚自习'
      break
  }
  return str
}
Utils.prototype.timeFormat = function (date, format) { // time时间格式化
  if (date === null || date === '') return ''

  if (typeof date === 'string') { // 如果是字符串转换为日期型
    date = new Date('2008-01-01 ' + date)
  }

  if (!format) {
    format = 'yyyy-MM-dd HH:mm:ss'
  }
  var obj =
    {
      'M+': date.getMonth() + 1, // 返回实际月份
      'd+': date.getDate(), // 返回当月第几天
      'H+': date.getHours(), // 返回小时
      'm+': date.getMinutes(), // 返回分钟
      's+': date.getSeconds(), // 返回秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 返回第几个季度
      'S': date.getMilliseconds(), // 返回毫秒
      'w': date.getDay(), // 返回星期几，0为星期日
      'W': '日一二三四五六'.charAt(date.getDay()) // 返回星期几的中文表示
    }

  // 年的单独处理
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  // 其他格式处理
  for (var k in obj) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? obj[k] : ('00' + obj[k]).substr(('' + obj[k]).length))
    }
  }
  return format
}

// name展示
Utils.prototype.showName = function (name) {
  // 纯中文：汉字姓名大于2个字展示最后2个字，小于等于2个字
  if (!name) {
    return ''
  } else if (/^[\u4e00-\u9fa5]+$/g.test(name)) {
    return name.length > 2 ? name.slice(-2) : name
  } else if (/^[A-Za-z]+$/g.test(name)) {
    // 纯英文名只展示两个字母
    return name.slice(0, 2)
  } else {
    // 其他
    return name.slice(0, 2)
  }
}

Utils.prototype.convertRangeNumber = function (num) {
  if (num < 0 || num > 19) {
    num = 0
  }
  let listU = [
    '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'
  ]
  return listU[num]
}

// 转换0-6的数字为星期的中文解释
// 从0开始
Utils.prototype.getChinesesWeekForNumSmall = function (num) {
  if (num < 0 || num > 6) {
    num = 0
  }
  var listU = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
  return listU[num]
}
/*
    colors() 返回其中的某一个颜色
    如果index不传，将随机赋予一个0-20之间的随机数
*/
Utils.prototype.colors = function (index = parseInt(10 + Math.random() * 10)) {
  let colorList = [
    {
      bg: 'rgba(36, 123, 254,0.1)',
      color: '#247BFE'
    },
    {
      bg: 'rgba(144, 86, 255,0.1)',
      color: '#9056FF'
    },
    {
      bg: 'rgba(0, 114, 41,0.1)',
      color: '#007229'
    },
    {
      bg: 'rgba(207, 82, 0,0.1)',
      color: '#CF5200'
    },
    {
      bg: 'rgba(247, 181, 0,0.1)',
      color: '#F7B500'
    },
    {
      bg: 'rgba(161, 105, 254,0.1)',
      color: '#A169FE'
    },
    {
      bg: 'rgba(59, 134, 254,0.1)',
      color: '#3B86FE'
    },
    {
      bg: 'rgba(222, 97, 0,0.1)',
      color: '#DE6100'
    },
    {
      bg: 'rgba(0, 149, 48,0.1)',
      color: '#009530'
    },
    {
      bg: 'rgba(252, 201, 0,0.1)',
      color: '#FCC900'
    },
    {
      bg: 'rgba(175, 133, 254,0.1)',
      color: '#AF85FE'
    },
    {
      bg: 'rgba(91, 156, 251,0.1)',
      color: '#5B9CFB'
    },
    {
      bg: 'rgba(241, 124, 14,0.1)',
      color: '#F17C0E'
    },
    {
      bg: 'rgba(0, 171, 57,0.1)',
      color: '#00AB39'
    },
    {
      bg: 'rgba(251, 202, 76,0.1)',
      color: '#FBCA4C'
    },
    {
      bg: 'rgba(193, 162, 254,0.1)',
      color: '#C1A2FE'
    },
    {
      bg: 'rgba(107, 164, 254,0.1)',
      color: '#6BA4FE'
    },
    {
      bg: 'rgba(249, 150, 74,0.1)',
      color: '#F9964A'
    },
    {
      bg: 'rgba(106, 220, 162,0.1)',
      color: '#6ADCA2'
    },
    {
      bg: 'rgba(255, 220, 79,0.1)',
      color: '#FFDC4F'
    },
    {
      bg: 'rgba(199, 172, 255,0.1)',
      color: '#C7ACFF'
    },
    {
      bg: 'rgba(120, 173, 253,0.1)',
      color: '#78ADFD'
    },
    {
      bg: 'rgba(253, 177, 121,0.1)',
      color: '#FDB179'
    },
    {
      bg: 'rgba(135, 224, 176,0.1)',
      color: '#87E0B0'
    },
    {
      bg: 'rgba(255, 229, 126,0.1)',
      color: '#FFE57E'
    },
    {
      bg: 'rgba(226, 205, 255,0.1)',
      color: '#E2CDFF'
    },
    {
      bg: 'rgba(138, 184, 255,0.1)',
      color: '#8AB8FF'
    },
    {
      bg: 'rgba(251, 195, 153,0.1)',
      color: '#FBC399'
    },
    {
      bg: 'rgba(167, 230, 196,0.1)',
      color: '#A7E6C4'
    }
  ]

  if (index < 20) {
    return colorList[index]
  } else {
    // 颜色色值是20个
    let value = 20
    let tIndex = index % value

    return colorList[tIndex]
  }
}
Utils.prototype.loading = function (name = '努力加载中...') {
  Spin.show({
    render: (h) => {
      return h('div', [
        // h('Icon', {
        //   'class': 'spin-icon-load',
        //   props: {
        //     type: 'ios-loading',
        //     size: 24
        //   }
        // }),
        // h('Img', {
        //   src: require('@/assets/common/loading.gif'),
        //   props: {
        //     src: require('@/assets/common/loading.gif')
        //   }
        // }),
        h('div', {
          'class': 'spin-icon-load-gif'
        })
        // h('div', name)
      ])
    }
  })
}

Utils.prototype.unloading = function () {
  Spin.hide()
}
/* 成功提示 */
Utils.prototype.msgSuc = function (info) {
  Message.success({
    top: 50,
    content: info,
    duration: 2,
    background: false
  })
}

/* 失败提示 */
Utils.prototype.msgError = function (info) {
  Message.error({
    top: 50,
    content: info,
    duration: 2,
    background: false
  })
}

/* 警告提示 */
Utils.prototype.msgW = function (info) {
  Message.error({
    top: 50,
    content: info,
    duration: 2,
    background: false
  })
}

/* 弹出确认提示 */
Utils.prototype.mInfo = function (title, content) {
  Modal.info({
    title: title,
    content: content
  })
}
Utils.prototype.mSuc = function (title, content) {
  Modal.success({
    title: title,
    content: content
  })
}
Utils.prototype.mWarn = function (title, content) {
  Modal.warning({
    title: title,
    content: content
  })
}
Utils.prototype.mError = function (title, content) {
  Modal.error({
    title: title,
    content: content
  })
}
Utils.prototype.confirm = function (title, content, ok, cancel) {
  Modal.confirm({
    title: title,
    content: content,
    onOk: () => {
      ok()
    },
    onCancel: () => {
      if (cancel !== undefined) {
        cancel()
      }
    }
  })
}
Utils.prototype.setTableColumnsWidth = function (tableObj, ref, columns) {
  let tableClientWidth = tableObj.$refs[ref] ? tableObj.$refs[ref].$el.clientWidth : 0
  let columnsWidthSum = 0
  let nums = tableClientWidth / columns.length
  columns.map((column, columnIndex) => {
    if (column.width !== undefined) {
      columnsWidthSum += Number(column.width)
    } else {
      if (column.children !== undefined) {
        columnsWidthSum += this.getCloumnsWidth(column.children, columnsWidthSum, nums)
      }
    }
  })
  console.log(columnsWidthSum, tableClientWidth, columns.length)
  if (columnsWidthSum <= tableClientWidth) {
    for (let i = 0, len = columns.length; i < len; i++) {
      columns[i].width = tableClientWidth / columns.length
    }
  }
  return columns
}
Utils.prototype.getCloumnsWidth = function (column, columnsWidthSum, nums) {
  if (column !== undefined && column.length > 0) {
    for (let i = 0, len = column.length; i < len; i++) {
      column[i].width = nums
      columnsWidthSum += nums
      this.getCloumnsWidth(column[i].children, 0, nums)
      // if (column[i].width === undefined) {
      //   column[i].width = nums
      //   columnsWidthSum += nums
      // } else {
      //   this.getCloumnsWidth(column[i].children, 0, nums)
      // }
    }
  }
  return columnsWidthSum
}
let xyUtils = new Utils()
export default xyUtils
