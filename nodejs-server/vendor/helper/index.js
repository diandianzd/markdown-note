/**
 *  fun tools
 */
module.exports = {
  getNetIp: function (_http) {
    const ipStr = _http.headers['X-Real-IP'] || _http.headers['x-forwarded-for']
    if (ipStr) {
      const ipArray = ipStr.split(',')
      if (ipArray.length > 1) { // 如果获取到的为ip数组
        for (let i = 0; i < ipArray.length; i++) {
          const ipNumArray = ipArray[i].split('.')
          const tmp = `${ipNumArray[0]}.${ipNumArray[1]}`
          if (tmp === '192.168' || (ipNumArray[0] === '172' && ipNumArray[1] >= 16 && ipNumArray[1] <= 32) || tmp === '10.7') {

          } else {
            return ipArray[i]
          }
        }
      }
      return ipArray[0]
    } // 获取不到时
    if (typeof _http.ip === 'function') {
      return _http.ip()
        .substring(_http.ip()
          .lastIndexOf(':') + 1)
    }
    return '-1'
  },
  timestamp: function () {
    return Math.ceil(Date.now() / 1000)
  },
  checkCategoryValid: function (categories, id, parentId) {
    if (id === parentId) return false
    const categoryMap = {}
    categories.forEach((item) => {
      categoryMap[item.id] = parseInt(item.parent_id)
    })

    let cursorId = parseInt(parentId)
    let whileCount = 0
    while (true) {
      whileCount += 1
      cursorId = categoryMap[cursorId]
      if (cursorId === parseInt(id)) return false
      if (whileCount > 20) return false
      if (cursorId === -1 || cursorId === 0) return true
      if (!cursorId) return true
    }
  },
  success: function (res, data = null) {
    return res.send({
      code: 1,
      message: 'Ok',
      data
    })
  },
  error: function (res, message, code = 0) {
    return res.send({ code, message, data: null })
  }
}

