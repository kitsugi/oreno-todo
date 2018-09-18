'use strict'

const TodosNedbDAO = require('./todos-nedb-dao')

let dao = null

module.exports.getInstance = (type) => {
  if (dao === null) {
    dao = new TodosNedbDAO()
  }

  return dao
//  throw new Error('Unknown DAO type ' + type)
}
