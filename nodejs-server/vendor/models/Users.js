const Sequelize = require('sequelize')
const Model = Sequelize.Model
const seqConnect = require('../database/sequelize')
const aliConfig = require('../../config').aliDaYu;
const helper = require('../helper');
const AliSms = require('../alicloud/sms');

class Users extends Model {
}

Users.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  'username': Sequelize.STRING,
  'password': Sequelize.STRING,
  'access_token': Sequelize.STRING,
  'access_token_expire': Sequelize.INTEGER,
  'created': Sequelize.INTEGER,
  'status': Sequelize.INTEGER,
  'last_login_time': Sequelize.INTEGER,
  'last_login_ip': Sequelize.STRING,
  'mobile': Sequelize.STRING,
  'mobile_code': Sequelize.INTEGER,
  'mobile_code_expire': Sequelize.INTEGER,
  'mobile_error': Sequelize.TEXT,
  'sms_expire_sec': Sequelize.INTEGER
}, {
  sequelize: seqConnect,
  modelName: 'Users',
  tableName: 'note_admin',
  timestamps: false
  // options
})

function verifySms(user, code) {
  return new Promise(async (resolve, reject) => {
    if (aliConfig.disable === true) {
      resolve();
    } else {
      const timestamp = helper.timestamp();
      if (timestamp > user.mobile_code_expire || parseInt(code) !== parseInt(user.mobile_code)) {
        const sms = new AliSms(aliConfig);
        const sendCode = Math.floor(Math.random() * (90000)) + 10000;
        sms.sendCode(user.mobile, sendCode).then(async (result) => {
          // 更新手机验证码
          user.update({
            mobile_error: '',
            mobile_code: sendCode,
            mobile_code_expire: timestamp + user.sms_expire_sec,
          })
        }).catch(async (mobileErr) => {
          // 短信发送失败使用旧的验证码
          user.update({
            mobile_error: JSON.stringify(mobileErr),
            mobile_code_expire: timestamp + user.sms_expire_sec
          })
        });
        reject(new Error('短信已发送'));
      } else {
        // 更新手机验证码有效时长
        user.update({ mobile_code_expire: timestamp + user.sms_expire_sec })
        resolve();
      }
    }
  });
}

module.exports = {
  query: function () {
    return Users
  },
  verifySms
}
