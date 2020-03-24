const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const postsRouter = require('./routes/posts');
const DB = require('./vendor/database/mysql');
const helper = require('./vendor/helper');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
/* app.use(express.json());
app.use(express.urlencoded({extended: false})); */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express 4.0
// var bodyParser = require('body-parser');
/* app.use(bodyParser.json({limit: '1000mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '1000mb'})); */

// verify token
app.use(async (req, res, next) => {
  const { t } = req.body;

  const commonRouter = ['/users/login', '/'];
  if (commonRouter.includes(req.url)) {
    next();
  } else {
    try {
      const ip = helper.getNetIp(req);
      const user = await new DB().table('note_admin').where({ access_token: t || '' }).query(true);
      if (user.access_token_expire < helper.timestamp()) {
        throw new Error('token过期');
      } else {
        //  auth user
        req.body.user = user;
        const tokenExpire = helper.timestamp() + 300;
        // update token expire
        await new DB().table('note_admin').where({ id: user.id }).update({ access_token_expire: tokenExpire });
        next();
      }
    } catch (e) {
      console.log(e);
      res.send({ code: 401, message: 'token error', data: null });
    }
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/posts', postsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
