const Sequelize = require('sequelize')
const Model = Sequelize.Model
const seqConnect = require('../database/sequelize')

class Categories extends Model {
}

Categories.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  'name': Sequelize.STRING,
  'modified': Sequelize.INTEGER,
  'created': Sequelize.INTEGER,
  'status': Sequelize.INTEGER,
  'parent_id': Sequelize.INTEGER,
  'icon': Sequelize.STRING

}, {
  sequelize: seqConnect,
  modelName: 'Categories',
  tableName: 'note_categories',
  timestamps: false
  // options
})

module.exports = {
  query: function () {
    return Categories
  }
}
