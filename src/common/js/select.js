var Funpatch = function patch () {
  if (typeof Array.includes === 'undefined') {
    // eslint-disable-next-line no-extend-native
    Array.prototype.includes = function (obj) {
      return this.indexOf(obj) >= 0
    }
  }

  if (typeof Array.findIndex === 'undefined') {
    // eslint-disable-next-line no-extend-native
    Array.prototype.findIndex = function (obj) {
      for (var i in this) {
        if (this[i] === obj) {
          return i
        }
      }
      return -1
    }
  }
  if (typeof Array.find === 'undefined') {
    // eslint-disable-next-line no-extend-native
    Array.prototype.find = function (fn) {
      for (var i in this) {
        if (fn(this[i], i, this) === true) {
          return this[i]
        }
      }
      return undefined
    }
  }
}
export { Funpatch }
