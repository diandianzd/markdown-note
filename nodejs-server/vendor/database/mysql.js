const mysql = require('mysql')
const config = require('../../config')

const pool = mysql.createPool(config.mysql)

module.exports = function () {
  this.sql = ''
  this.tableName = null
  this.values = []
  // select str
  this.selectStr = '*'
  // insert update data
  this.setStr = ''
  this.setValues = []
  this.setBind = {}
  //  where data
  this.whereStr = ''
  this.whereValues = []
  this.whereBind = {}
  // order
  this.orderStr = ''

  this.offsetStr = 'OFFSET 0'
  this.limitStr = 'LIMIT 1000'
  /**
   * set table name
   * @param tableName
   * @returns {exports}
   */
  this.table = function (tableName) {
    this.tableName = tableName
    return this
  }
  this.set = function (keyValues) {
    this.setBind = Object.assign(this.setBind, keyValues)

    this.setStr = ' SET '
    this.setValues = []
    Object.keys(this.setBind).map((key) => {
      const value = this.setBind[key]
      this.setValues.push(value)
      // mysql value bind
      this.setStr = `${this.setStr} ${key}=? ,`
    })
    const reg = /,$/gi
    this.setStr = this.setStr.replace(reg, '')
    return this
  }
  /**
   *  select fields
   * @param fields
   * @returns {exports}
   */
  this.select = function (fields) {
    this.selectStr = fields.join(',')
    return this
  }
  /**
   * limit
   * @param limit
   * @returns {exports}
   */
  this.limit = function (limit) {
    this.limitStr = ` LIMIT ${parseInt(limit)}`
    return this
  }

  /**
   *offset
   * @param offset
   * @returns {exports}
   */
  this.offset = function (offset) {
    this.offsetStr = ` OFFSET ${parseInt(offset)}`
    return this
  }

  /**
   * order
   * @param order
   * @returns {exports}
   */
  this.orderBy = function (order) {
    this.orderStr = ` ORDER BY ${order}`
    return this
  }

  /**
   * where
   * @param keyValues
   * @param filterWhere
   * @returns {exports}
   */
  this.where = function (keyValues, filterWhere = false) {
    // filter ''  undefined null
    if (filterWhere) {
      for (const [key, value] of Object.entries(keyValues)) {
        if (Array.isArray(value) && value.length === 2) {
          if (value[1] && value[1] !== '') this.whereBind[key] = value
        } else if (value && value !== '') this.whereBind[key] = value
      }
    } else {
      this.whereBind = Object.assign(this.whereBind, keyValues)
    }

    this.whereStr = ' WHERE '
    this.whereValues = []
    Object.keys(this.whereBind).map((key) => {
      const value = this.whereBind[key]
      let operation = '='
      // 自带查询操作
      let bindValue = ''
      if (Array.isArray(value)) {
        if (value.length !== 2) throw new Error(`mysql bind Array [operation,value] got ${JSON.stringify(value)}`)
        operation = String(value[0])
        bindValue = String(value[1])
      } else {
        bindValue = value
      }
      this.whereValues.push(bindValue)

      // if (typeof value === 'string') value = `'${value}'`
      // mysql value bind
      this.whereStr = `${this.whereStr} ${key} ${operation} ? and`
    })
    const reg = /and$/gi
    this.whereStr = this.whereStr.replace(reg, '')
    return this
  }
  /**
   * query
   * @param one
   * @returns {Promise<any>}
   */
  this.query = function (one = false) {
    // query bind were values
    this.values = this.whereValues
    this.sql = `SELECT ${this.selectStr} FROM 
                            ${this.tableName} 
                            ${this.whereStr}
                            ${this.orderStr}
                            ${this.limitStr} 
                            ${this.offsetStr} `
    return one ? this.one() : this.get()
  }
  /**
   * insert
   * @param keyValues
   * @returns {Promise<unknown>}
   */
  this.insert = function (keyValues) {
    this.set(keyValues)
    // query bind were values
    this.values = this.setValues
    this.sql = `INSERT INTO
                            ${this.tableName} 
                            ${this.setStr} `
    return this.get()
  }
  /**
   * update
   * @param keyValues
   * @returns {Promise<never>|Promise<unknown>}
   */
  this.update = function (keyValues) {
    this.set(keyValues)
    // query bind were values
    this.values = this.setValues.concat(...this.whereValues)
    this.sql = `UPDATE
                            ${this.tableName} 
                            ${this.setStr}
                             ${this.whereStr} `
    if (this.whereStr === '') {
      return Promise.reject(` MYSQL ERROR: \n 
            must set where when update\n 
            ${this.sql}`)
    }
    return this.get()
  }
  /**
   * command
   * @param sql
   * @param values
   * @returns {exports}
   */
  this.command = function (sql, values) {
    this.sql = sql
    this.values = values
    return this
  }
  /**
   * get
   * @returns {Promise<unknown>}
   */
  this.get = function () {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err)
        } else {
          connection.query(this.sql, this.values, (err, rows) => {
            if (err) {
              console.log('MYSQL ERROR: \n', `${err.sqlMessage}\n`, err.sql)
              // console.log('MYSQL ERROR: ', err)
              reject(err)
            } else {
              resolve(rows)
            }
            connection.release()
          })
        }
      })
    })
  }
  /**
   * one
   * @returns {Promise<unknown>}
   */
  this.one = function () {
    this.limit = 1
    this.offset = 0
    return this.get().then((rows) => {
      if (Object.keys(rows).length > 0) {
        return rows[0]
      }
      return null
    })
  }
}
