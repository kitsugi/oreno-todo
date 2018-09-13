'use strict';

const TodosMemoryDAO = require('./todos-memory-dao');

let dao = null;

module.exports.getInstance = (type) => {
  if (type === 'memory') {
    if (dao === null) {
      dao = new TodosMemoryDAO();
    }
    return dao;
  }

  throw new Error('Unknown DAO type ' + type);
}
