/**
 *  fun tools
 */
const app = function () {

};
// 获取外网ip
app.getNetIp = function (_http) {
  const ipStr = _http.headers['X-Real-IP'] || _http.headers['x-forwarded-for'];
  if (ipStr) {
    const ipArray = ipStr.split(',');
    if (ipArray.length > 1) { // 如果获取到的为ip数组
      for (let i = 0; i < ipArray.length; i++) {
        const ipNumArray = ipArray[i].split('.');
        const tmp = `${ipNumArray[0]}.${ipNumArray[1]}`;
        if (tmp === '192.168' || (ipNumArray[0] === '172' && ipNumArray[1] >= 16 && ipNumArray[1] <= 32) || tmp === '10.7') {

        } else {
          return ipArray[i];
        }
      }
    }
    return ipArray[0];
  } // 获取不到时
  if (typeof _http.ip === 'function') {
      return _http.ip().substring(_http.ip().lastIndexOf(':') + 1);
    }else{
      return '-1'
    }

};

app.timestamp = function () {
  return parseInt(new Date().getTime() / 1000, 10);
};

module.exports = app;
