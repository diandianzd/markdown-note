const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const DB = require('../vendor/database/mysql');

router.post('/delete', bodyParser.urlencoded({ extended: true }), async (req, res, next) => {
  // `UPDATE note_categories set status=0  WHERE id = ?`
  try {
    const id = parseInt(req.body.id || 0, 10);
    const childCategoryExist = await new DB().table('note_categories').where({ status: 1, parent_id: id }).query(true);
    if (childCategoryExist) {
      return res.send({ code: 0, message: '请先删除子分类', data: null });
    }
    const rsp = await new DB().table('note_posts')
      .where({ category: id })
      .update({ category: -1 });
    const rs = await new DB().table('note_categories')
      .where({ id })
      .update({ status: 0 });
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

router.post('/save', bodyParser.urlencoded({ extended: true }), async (req, res, next) => {
  // ``UPDATE note_categories set  status=1, name=? , icon=? , parent_id=?, modified= 1558938981, created= 1558938981 WHERE id = ?`
  try {
    const id = parseInt(req.body.id || 0, 10);
    const { name, icon, categories } = req.body;
    let parentId = categories[categories.length - 1];
    if (!parentId || parentId === -1) parentId = 0;
    const curTime = Math.ceil(new Date().getTime() / 1000);
    const params = {
      status: 1, name, icon, parent_id: parentId, modified: curTime,
    };
    let rs = null;
    if (id > 0) {
      rs = await new DB().table('note_categories').where({ id }).update(params);
      res.send({
        code: 1,
        message: 'success',
        data: { id: req.body.id, isNewPost: 0 },
      });
    } else {
      rs = await new DB().table('note_categories').insert(Object.assign(params, { created: curTime }));
      res.send({
        code: 1,
        message: 'success',
        data: { id: rs.insertId, isNewPost: 1 },
      });
    }
    console.log(rs);
  } catch (e) {
    console.log(e);
    res.send({ code: 0, message: '数据查询错误', data: null });
  }
});

router.post('/list', async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    // select * from note_categories  order by id asc  limit ? offset ?
    const queryCount = await new DB().table('note_categories').select(['count(*) as total']).query(true);
    const queryList = await new DB().table('note_categories').orderBy('id asc').limit(limit)
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

router.post('/menudata', async (req, res, next) => {
  try {
    const queryPostCategories = await new DB().table('note_posts').select(['DISTINCT category']).query();
    const postCatIds = queryPostCategories.reduce((pre, cur) => pre.concat(cur.category), []);

    //    'select icon, id, name, parent_id from note_categories WHERE status = 1 order by modified desc'
    const queryAllCategories = await new DB().table('note_categories')
      .select(['icon', 'id', 'name', 'parent_id'])
      .where({ status: 1 })
      .orderBy('modified desc')
      .query();

    queryAllCategories.forEach((item, index) => {
      if (postCatIds.includes(item.id)) {
        queryAllCategories[index].used = 1;
      } else {
        queryAllCategories[index].used = 0;
      }
    });

    console.log(queryAllCategories)
    res.send({
      code: 1,
      message: 'success',
      data: queryAllCategories,
    });
  } catch (e) {
    console.log(e);
    res.send({ code: 0, message: '数据查询错误', data: null });
  }
});

module.exports = router;
