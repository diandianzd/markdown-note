const Sequelize = require('sequelize')
const config = require('./../../config').mysql
const Op = Sequelize.Op
// 配置操作符别称
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
}

/**
 * 创建连接
 */
const seqConnection = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: 'mysql',
  port: 3306,
  pool: {
    max: 5,
    min: 0,
    idle: 30000
  },
  operatorsAliases
})
// 测试数据库链接
seqConnection.authenticate().then(function () {
  console.log('Mysql connection success')
}).catch(function (err) {
  // 数据库连接失败时打印输出
  console.error(err)
  throw err
})

module.exports = seqConnection
