'use strict';

const Datastore = require('nedb');
const Todo = require('../models/todo');

module.exports = class TodosNedbDAO {
  constructor () {
    this.index = 0;
    this.db = new Datastore({ 
      filename: 'todo.db',      
      autoload: true,
      timestampData: true
    });
  }

  /**
   * 条件に一致したTODOリストを取得します。
   * 
   * @param {string} keyword 検索キーワード
   * @param {boolean} done 完了フラグ
   * @param {function(err, docs)} callback コールバック関数
   */
  search(keyword, done, callback) {
    const query = [];
    if (keyword) {
      const regex = new RegExp(keyword);
      query.push({$or: [{title: regex}, {content: regex}]});
    }
    if (done != null) {
      query.push({done: done});
    }

    this.db.find({$and: query}, function (err, docs) {
      callback(err, docs);
    });
  }

  /**
   * TODOリストを取得します。
   * 
   * @param {function(err, docs)} callback コールバック関数
   */
  getAll(callback) {
    this.db.find({}, function (err, docs) {      
      callback(err, docs);
    });
  }

  /**
   * 指定した番号のTODO情報を取得します。
   * 
   * @param {string} todoId TODO識別子
   * @param {function(err, doc)} callback コールバック関数
   */
  getById(todoId, callback) {
    this.db.findOne({_id: todoId}, function (err, doc) {
      let todo = null;
      if (doc) {
        todo = Todo.create(doc);
      }
      callback(err, todo);
    });
  }

  /**
   * TODO情報を作成します。
   * 
   * @param {object} entry エントリ
   * @param {function(err, doc)} callback コールバック関数
   */
  create(entry, callback) {
    const todo = Todo.create(entry);

    this.db.insert(todo, function(err, newDoc) {
      console.log(err, newDoc);
      callback(err, newDoc);
    });
  }

  /**
   * 指定した番号のTODO情報を更新します。
   * 
   * @param {string} todoId TODO識別子
   * @param {object} entry TODOエントリ
   * @param {function(err, numAffected)} callback コールバック関数
   */
  update(todoId, entry, callback) {
    
    this.db.update({_id: todoId}, {$set: entry}, {}, function (err, numAffected) {
      callback(err, numAffected);
    });
  }

  /**
   * 指定した識別子のTODO情報を削除します。
   * 
   * @param {string} todoId TODO識別子
   * @param {function(err, numRemoved)} callback コールバック関数
   */
  delete(todoId, callback) {
    this.db.remove({_id: todoId}, {}, function(err, numRemoved) {
      console.log(err, numRemoved);
      callback(err, numRemoved);
    });
  }
}
