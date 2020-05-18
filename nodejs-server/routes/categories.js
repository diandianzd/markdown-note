const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const helper = require('../vendor/helper');
const Categories = require('../vendor/models/Categories');
const Posts = require('../vendor/models/Posts');
const sequelize = require('../vendor/database/sequelize')


router.post('/delete', bodyParser.urlencoded({ extended: true }), async (req, res, next) => {
  // `UPDATE note_categories set status=0  WHERE id = ?`
  try {
    const id = parseInt(req.body.id || 0);
    const childCategoryExist = await Categories.query().findOne({where:{ status: 1, parent_id: id }})
    if (childCategoryExist) {
      return res.send({ code: 0, message: '请先删除子分类', data: null });
    }
    sequelize.transaction(function (t) {
      return Promise.all([
        Posts.query().update({ category: -1 }, { where: { category: id } }),
        Categories.query().update({ status: 0 }, { where: { id } }),
      ]);
    })

    helper.success(res)
  } catch (e) {
    console.log(e);
    res.send({ code: 0, message: '数据查询错误', data: null });
  }
});

router.post('/save', bodyParser.urlencoded({ extended: true }), async (req, res, next) => {
  // ``UPDATE note_categories set  status=1, name=? , icon=? , parent_id=?, modified= 1558938981, created= 1558938981 WHERE id = ?`
  try {
    const id = parseInt(req.body.id || 0)
    const { name, icon, parent_id = 0 } = req.body;
    const curTime = Math.ceil(new Date().getTime() / 1000);
    const params = {
      status: 1, name, icon, parent_id, modified: curTime,
    };
    let rs = null;
    if (id > 0) {
      const category = await Categories.query().findOne({where:{id}})
      if (!category) return helper.error('分类不存在')
      const queryAllCategories = await Categories.query().findAll({
        attributes:['id', 'parent_id'],
        where:{status:1},
        order:[['modified','desc']]
      })
      if (!helper.checkCategoryValid(queryAllCategories, id,parent_id)) {
        return res.send({ code: 0, message: '分类选择错误', data: null });
      }
      category.update(params)
      helper.success(res,{ id: req.body.id, isNewPost: 0 })
    } else {
      const category = await Categories.query().create(Object.assign(params, { created: curTime }))
      helper.success(res,{ id: category.id, isNewPost: 1 })
    }
  } catch (e) {
    console.log(e);
    res.send({ code: 0, message: '数据查询错误', data: null });
  }
});

router.post('/menudata', async (req, res, next) => {
  try {
    const queryPostCategories = await Posts.query().findAll({ attributes:['category'] })
    const postCatIds = queryPostCategories.reduce((pre, cur) => pre.concat(cur.category), []);
    const queryAllCategories = await Categories.query().findAll({
      attributes:['icon', 'id', 'name', 'parent_id'],
      where:{status: 1},
      order:[['modified','desc']],
      raw: true
    })
    queryAllCategories.forEach((item, index) => {
      if (postCatIds.includes(item.id)) {
        queryAllCategories[index].used = 1;
      } else {
        queryAllCategories[index].used = 0;
      }
    });
    helper.success(res,queryAllCategories)
  } catch (e) {
    console.log(e);
    res.send({ code: 0, message: '数据查询错误', data: null });
  }
});

module.exports = router;
