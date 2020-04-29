const express = require('express');

const router = express.Router();
const md5 = require('md5');
const bodyParser = require('body-parser');

const DB = require('../vendor/database/mysql');
const helper = require('../vendor/helper');
const AliSms = require('../vendor/alicloud/sms');
const config = require('../config');

function verifySms(user, code) {
  return new Promise(async (resolve, reject) => {
    if (config.aliDaYu.disable === true) {
      resolve();
    } else {
      const timestamp = helper.timestamp();
      if (timestamp > user.mobile_code_expire || parseInt(code) !== parseInt(user.mobile_code)) {
        const sms = new AliSms(config.aliDaYu);
        const sendCode = Math.floor(Math.random() * (90000)) + 10000;
        sms.sendCode(user.mobile, sendCode).then(async (result) => {
          // 更新手机验证码
          await new DB().table('note_admin')
            .where({ id: user.id })
            .update({
              mobile_error: '',
              mobile_code: sendCode,
              mobile_code_expire: timestamp + user.sms_expire_sec,
            });
        }).catch(async (mobileErr) => {
          // 短信发送失败使用旧的验证码
          await new DB().table('note_admin')
            .where({ id: user.id })
            .update({
              mobile_error: JSON.stringify(mobileErr),
              mobile_code_expire: timestamp + user.sms_expire_sec,
            });
        });
        reject(new Error('短信已发送'));
      } else {
        // 更新手机验证码有效时长
        await new DB().table('note_admin')
          .where({ id: user.id })
          .update({ mobile_code_expire: timestamp + user.sms_expire_sec });
        resolve();
      }
    }
  });
}

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

/* GET users listing. */
router.post('/heart', (req, res, next) => {
  res.send({
    code: 1,
    message: '操作成功！',
    data: null,
  });
});
/* GET users listing. */
router.post('/logout', async (req, res, next) => {
  try {
    const { id } = req.body.user;
    const result = await new DB().table('note_admin')
      .where({ id }).update({
        access_token: 0,
        access_token_expire: 0,
        mobile_code: 0,
        mobile_code_expire: 0,
      });
    res.send({ code: 1, message: 'success', data: null });
  } catch (e) {
    console.log(e);
    res.send({ code: 0, message: '数据查询错误', data: null });
  }
});
router.post('/login', bodyParser.urlencoded({ extended: true }), async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await new DB().table('note_admin').where({ username }).query(true);
    if (!user) return res.send({ code: 0, message: '账号或密码错误', data: null });
    const timestamp = helper.timestamp();
    const md5Pwd = md5(user.id + password.substr(0, password.indexOf('.')));
    const mobileCode = password.substr(password.indexOf('.') + 1);
    const token = md5(new Date().getTime() + md5Pwd);
    const tokenExpire = timestamp + 300;

    if (md5Pwd !== user.password) return res.send({ code: 0, message: '账号或密码错误', data: null });
    const ip = helper.getNetIp(req);

    verifySms(user, mobileCode).then(async (data) => {
      await new DB().table('note_admin')
        .where({ id: user.id })
        .update({
          access_token: token,
          access_token_expire: tokenExpire,
          last_login_ip: ip,
          last_login_time: timestamp,
        });

      res.send({
        code: 1,
        message: '操作成功',
        data: {
          id: 1, username: 'admin', access_token: token, currentAuthority: 'admin',
        },
      });
    }).catch((err) => {
      res.send({ code: 0, message: '账号或密码错误', data: null });
    });
  } catch (e) {
    console.log(e);
    res.send({ code: 0, message: '数据查询错误', data: null });
  }
});

module.exports = router;
