const express = require('express');

const router = express.Router();
const md5 = require('md5');
const bodyParser = require('body-parser');
const helper = require('../vendor/helper');
const Users = require('../vendor/models/Users');


/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

/* GET users listing. */
router.post('/heart', (req, res, next) => {
  helper.success(res)
});
/* GET users listing. */
router.post('/logout', async (req, res, next) => {
  try {
    const { id } = req.body.user;
    const user = await Users.query()
      .findOne({ where: { id } });
    user.update({
      access_token: 0,
      access_token_expire: 0,
      mobile_code: 0,
      mobile_code_expire: 0,
    });
    helper.success(res)
  } catch (e) {
    console.log(e);
    helper.error(res,'数据查询错误')
  }
});

router.post('/login', bodyParser.urlencoded({ extended: true }), async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await Users.query()
      .findOne({ where: { username } });
    if (!user) return helper.error('账号或密码错误');
    const timestamp = helper.timestamp();
    const md5Pwd = md5(user.id + password.substr(0, password.indexOf('.')));
    const mobileCode = password.substr(password.indexOf('.') + 1);
    const token = md5(new Date().getTime() + md5Pwd);
    const tokenExpire = timestamp + 300;

    if (md5Pwd !== user.password) return helper.error('账号或密码错误');
    const ip = helper.getNetIp(req);

    Users.verifySms(user, mobileCode)
      .then(async (data) => {
        user.update({
          access_token: token,
          access_token_expire: tokenExpire,
          last_login_ip: ip,
          last_login_time: timestamp,
        });
        helper.success(res, {
          id: 1,
          username: 'admin',
          access_token: token,
          currentAuthority: 'admin',
        });
      })
      .catch((err) => {
        helper.error('账号或密码错误');
      });
  } catch (e) {
    console.log(e);
    helper.error('数据查询错误');
  }
});

module.exports = router;
