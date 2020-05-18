const Sequelize = require('sequelize')
const Model = Sequelize.Model
const seqConnect = require('../database/sequelize')

class PostsHistory extends Model {
}

PostsHistory.init({
  'log_id': {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  'id': Sequelize.INTEGER,
  'created': Sequelize.INTEGER,
  'type': Sequelize.STRING,
  'content': Sequelize.TEXT,
  'title': Sequelize.STRING,
  'status': Sequelize.STRING,
  'category': Sequelize.INTEGER,
  'md5': Sequelize.STRING
}, {
  sequelize: seqConnect,
  modelName: 'PostsHistory',
  tableName: 'note_posts_history',
  timestamps: false
  // options
})

function logHistory(post) {
  return new Promise(async (resolve, reject) => {
    try {
      const md5 = require('md5');
      const md5Key = md5(JSON.stringify(post));
      const hasHistory = await PostsHistory.findOne({where:{ md5: md5Key }})
      if (!hasHistory) {
        //    ` INSERT INTO note_posts_history set  id=?, type=?, content=? , title=? , status=?, category= ?, md5=?`
        PostsHistory.create(Object.assign(post, {
          md5: md5Key,
          created: Math.ceil(new Date().getTime() / 1000),
        }))
      }
      resolve();
    } catch (e) {
      console.log(e);
      reject();
    }
  });
}

module.exports = {
  query: function () {
    return PostsHistory
  },
  logHistory
}
