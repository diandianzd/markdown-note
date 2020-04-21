const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const DB = require('../vendor/database/mysql');

function logHistory(post) {
  return new Promise(async (resolve, reject) => {
    try {
      const md5 = require('md5');
      const md5Key = md5(JSON.stringify(post));
      const hasHistory = await new DB().table('note_posts_history').where({ md5: md5Key }).query(true);
      if (!hasHistory) {
        //    ` INSERT INTO note_posts_history set  id=?, type=?, content=? , title=? , status=?, category= ?, md5=?`
        const rs = await new DB().table('note_posts_history')
          .insert(Object.assign(post, {
            md5: md5Key,
            created: Math.ceil(new Date().getTime() / 1000),
          }));
      }
      resolve();
    } catch (e) {
      console.log(e);
      reject();
    }
  });
}

router.post('/view', async (req, res, next) => {
  const id = parseInt(req.query.id || 0, 10);
  // 'select * from note_posts where id = ?',
  try {
    const post = await new DB().table('note_posts')
    .select(['id', 'title', 'content', 'modified', 'created', 'status', 'category'])
    .where({ id }).query(true);
    res.send({
      code: 1,
      message: 'success',
      data: post,
    });
  } catch (e) {
    console.log(e);
    res.send({ code: 0, message: '数据查询错误', data: null });
  }
});

router.post('/property', bodyParser.urlencoded({ extended: true }), async (req, res, next) => {
  try {
    const {
      title, id, type, status,
    } = req.body;
    const category = req.body.category || -1


    const rs = await new DB().table('note_posts')
      .where({ id })
      .update({
        status,
        type: 'markdown',
        title,
        category,
        modified: Math.ceil(new Date().getTime() / 1000),
      });
    console.log(rs);
    res.send({
      code: 1,
      message: 'success',
      data: { id: rs.insertId, isNewPost: 1 },
    });
  } catch (e) {
    console.log(e);
    res.send({ code: 0, message: '数据查询错误', data: null });
  }
});

router.post('/save', bodyParser.urlencoded({ extended: true }), async (req, res, next) => {
  // INSERT INTO note_posts set  status="active", type="markdown", title=? , content=? , category=?, modified= 1558938981, created= 1558938981
  try {
    const {
      title, content, id, type,
    } = req.body;
    const category = req.body.category || -1
    const curTime = Math.ceil(new Date().getTime() / 1000);
    // 替换图片内容为 [img] 减少内容搜索
    const contentFilter = content.replace(/!\[.*\]\(.*?\)|"data:image\/.*?base64.*?"/mg, '[img]');

    const params = {
      status: 'active',
      title,
      type: 'markdown',
      content,
      content_filter: contentFilter,
      category,
      modified: curTime,
    };

    let rs = null;
    let rsData = null;
    if (id > 0) {
      rs = await new DB().table('note_posts').where({ id }).update(params);
      rsData = { id: req.body.id, isNewPost: 0 };
    } else {
      rs = await new DB().table('note_posts').insert(Object.assign(params, { created: curTime }));
      rsData = { id: rs.insertId, isNewPost: 1 };
    }

    await logHistory({
      status: 'active',
      title,
      type,
      content,
      category,
      id: rsData.id,
    });

    res.send({
      code: 1,
      message: 'success',
      data: rsData,
    });
  } catch (e) {
    console.log(e);
    res.send({ code: 0, message: '数据查询错误', data: null });
  }
});

router.post('/delete', bodyParser.urlencoded({ extended: true }), async (req, res, next) => {
  // ``UPDATE note_posts set status="deleted"  WHERE id = ?`,
  try {
    const id = parseInt(req.body.id || 0, 10);
    const rs = await new DB().table('note_posts')
      .where({ id })
      .update({ status: 'deleted' });
    console.log(rs);
    res.send({
      code: 1,
      message: 'success',
      data: null,
    });
  } catch (e) {
    console.log(e);
    res.send({ code: 0, message: '数据查询错误', data: null });
  }
});

router.post('/list', async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    let { content = '', status = 'active',category = -1 } = req.query;
    let { sort = 'modified', asc = 'desc' } = req.query;
    // verify values
    if (!['modified', 'id'].includes(sort)) sort = 'modified';
    if (!['desc', 'asc'].includes(asc)) asc = 'desc';

    if (content) content = `%${content}%`;
    if (!status) status = 'active';

    //  `select created,id,title,type,status,category from note_posts WHERE category = ? and status='active'`,
    const queryCount = await new DB().table('note_posts').select(['count(*) as total'])
      .where({ status })
      .where({ category: category, content_filter: ['like', content] }, true)
      .query(true);
    const queryList = await new DB().table('note_posts').select(['created', 'id', 'title', 'type', 'status', 'category'])
      .where({ status })
      .where({ category: category, content_filter: ['like', content] }, true)
      .orderBy(`${sort} ${asc}`)
      .limit(limit)
      .offset(offset)
      .query();
    res.send({
      code: 1,
      message: 'success',
      data: {
        list: queryList,
        total: queryCount.total,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({ code: 0, message: '数据查询错误', data: null });
  }
});

module.exports = router;
