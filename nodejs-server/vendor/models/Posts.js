const Sequelize = require('sequelize')
const Model = Sequelize.Model
const seqConnect = require('../database/sequelize')

class Posts extends Model {
}

Posts.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  'title': Sequelize.STRING,
  'content': Sequelize.TEXT,
  'content_filter': Sequelize.TEXT,
  'modified': Sequelize.INTEGER,
  'created': Sequelize.INTEGER,
  'type': Sequelize.STRING,
  'status': Sequelize.STRING,
  'category': Sequelize.INTEGER
}, {
  sequelize: seqConnect,
  modelName: 'Posts',
  tableName: 'note_posts',
  timestamps: false
  // options
})

module.exports = {
  query: function () {
    return Posts
  }
}
