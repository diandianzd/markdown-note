const Core = require('@alicloud/pop-core');

function Sms(config) {
  const client = new Core({
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25',
  });

  const params = {
    RegionId: 'cn-hangzhou',
    PhoneNumbers: '',
    SignName: config.SignName,
    TemplateCode: config.TemplateCode,
    TemplateParam: JSON.stringify({ code: '' }),
    OutId: '12345',
  };

  const requestOption = {
    method: 'POST',
  };


  this.sendCode = function (mobile, code) {
    return new Promise((resolve, reject) => {
      client.request('SendSms', Object.assign(params, {
        TemplateParam: JSON.stringify({ code }),
        PhoneNumbers: mobile,
      }), requestOption).then((result) => {
        console.log(JSON.stringify(result));
        resolve(result);
      }, (ex) => {
        console.log(ex);
        reject(ex);
      });
    });
  };
}
module.exports = Sms;
