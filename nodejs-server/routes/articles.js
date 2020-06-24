const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser')
const helper = require('../vendor/helper');
const Posts = require('../vendor/models/Posts');
const PostsHistory = require('../vendor/models/PostsHistory');
const Categories = require('../vendor/models/Categories');


router.post('/delete', bodyParser.urlencoded({ extended: true }), async (req, res, next) => {
  // ``UPDATE note_posts set status="deleted"  WHERE id = ?`,
  try {
    const curTime = helper.timestamp();
    const id = parseInt(req.body.id || 0);
    Posts.query().update({
      status: 'deleted',
      category: -1,
      modified: curTime
    }, { where: { id } });
    helper.success(res)
  } catch (e) {
    console.log(e);
    helper.error(res, '数据查询错误');
  }
});
router.post('/view', async (req, res, next) => {
  const id = parseInt(req.query.id || 0);
  // 'select * from note_posts where id = ?',
  try {
    const post = await Posts.query().findOne({
      attributes: ['id', 'title', 'content', 'modified', 'created', 'category'],
      where: { id },
      raw: true
    })
    helper.success(res,post)
  } catch (e) {
    console.log(e);
    helper.error(res,'数据查询错误')
  }
});

router.post('/view-history', async (req, res, next) => {
  const {id = 0, direction = '', log_id = null} = req.query
  // 'select * from note_posts where id = ?',
  try {
    let where = {id}
    let asc = 'desc'
    if (log_id && ['gt','lt'].includes(direction)){
      where['log_id'] = { [`$${direction}`]: log_id }
      asc = direction === 'gt'?'asc':'desc'
    }

    const post = await PostsHistory.query().findOne({
      attributes: ['id', 'log_id', 'title', 'content'],
      where,
      order: [['log_id', asc]],
      raw: true
    })
    helper.success(res,post)
  } catch (e) {
    console.log(e);
    helper.error(res,'数据查询错误')
  }
});

router.post('/save', bodyParser.urlencoded({ extended: true }), async (req, res, next) => {
  // INSERT INTO note_posts set  status="active", type="markdown", title=? , content=? , category=?, modified= 1558938981, created= 1558938981
  try {
    const {
      title, content = '', id, type,
    } = req.body;
    const category = req.body.category || -1;
    const curTime = helper.timestamp();
    // 替换图片内容为 [img] 排除图片内容
    const contentFilter = content.replace(/!\[.*\]\(.*?\)|"data:image\/.*?base64.*?"/mg, '[img]');
    if (!content || !content.trim()) {
      return res.send({ code: 0, message: '文章没有内容', data: null });
    }
    const params = {
      status: 'active',
      title,
      type: 'markdown',
      content,
      content_filter: contentFilter,
      category,
      modified: curTime,
    };

    if (category !== -1){
      const existCategoryId = await Categories.query().findOne({where:{id:category}})
      if (!existCategoryId) return res.send({ code: 0, message: '分类不存在', data: null });
    }

    let rs = null;
    let rsData = null;
    if (id > 0) {
      rs = await Posts.query().update(params,{where:{ id }})
      rsData = { id: req.body.id, isNewPost: 0 };
    } else {
      rs = await Posts.query().create(Object.assign(params, { created: curTime }))
      rsData = { id: rs.id, isNewPost: 1 };
    }

    await PostsHistory.logHistory({
      title,
      content,
      category,
      id: rsData.id,
    });
    helper.success(res,rsData)
  } catch (e) {
    console.log(e);
    helper.error(res,'数据查询错误')
  }
});



router.post('/list', async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    let { title = '', content = '', status = 'active', category = null } = req.query;
    let { sort = 'modified', asc = 'desc' } = req.query;
    // verify values
    if (!['modified', 'id'].includes(sort)) sort = 'modified';
    if (!['desc', 'asc'].includes(asc)) asc = 'desc';

    let where = { status };
    if (content) {
      content = `%${content}%`;
      where['$or'] = {
        title: { $like: content },
        content_filter: { $like: content },
      };
    }
    if (category){
      where.category = category
    }

    //  `select created,id,title,type,status,category from note_posts WHERE category = ? and status='active'`,
    const queryCount = await Posts.query().count({ where })
    const queryList = await Posts.query().findAll({
      attributes:['created', 'id', 'title', 'type', 'status', 'category'],
      where,
      order: [[sort, asc]],
      limit,
      offset,
      raw: true
    })

    helper.success(res, {
      list: queryList,
      total: queryCount,
    });
  } catch (e) {
    console.log(e);
    helper.error(res,'数据查询错误')
  }
});

module.exports = router;
