'use strict'

const Datastore = require('nedb')
const Todo = require('../models/todo')

module.exports = class TodosNedbDAO {
  /**
   * インスタンスを初期化します。
   */
  constructor () {
    this.index = 0
    this.db = new Datastore({
      filename: 'todo.db',
      autoload: true,
      timestampData: true
    })
  }

  /**
   * 条件に一致したtodoリストを取得します。
   *
   * @param {string} keyword 検索キーワード
   * @param {boolean} done 完了フラグ
   * @param {function(err, docs)} callback コールバック関数
   */
  search (keyword, done, callback) {
    const query = []
    if (keyword) {
      const regex = new RegExp(keyword)
      query.push({ $or: [{ title: regex }, { content: regex }] })
    }
    if (done != null) {
      query.push({ done: done })
    }

    this.db.find({ $and: query }, (err, docs) => {
      callback(err, docs)
    })
  }

  /**
   * todoリストを取得します。
   *
   * @param {function(err, docs)} callback コールバック関数
   */
  getAll (callback) {
    this.db.find({}, (err, docs) => {
      callback(err, docs)
    })
  }

  /**
   * 指定した番号のtodo情報を取得します。
   *
   * @param {string} todoId todo識別子
   * @param {function(err, doc)} callback コールバック関数
   */
  getById (todoId, callback) {
    this.db.findOne({ _id: todoId }, (err, doc) => {
      let todo = null
      if (doc) {
        todo = Todo.create(doc)
      }
      callback(err, todo)
    })
  }

  /**
   * todo情報を作成します。
   *
   * @param {object} entry エントリ
   * @param {function(err, doc)} callback コールバック関数
   */
  create (entry, callback) {
    const todo = Todo.create(entry)

    this.db.insert(todo, (err, newDoc) => {
      callback(err, newDoc)
    })
  }

  /**
   * 指定した番号のtodo情報を更新します。
   *
   * @param {string} todoId todo識別子
   * @param {object} entry todoエントリ
   * @param {function(err, numAffected)} callback コールバック関数
   */
  update (todoId, entry, callback) {
    this.db.update({ _id: todoId }, { $set: entry }, {}, (err, numAffected) => {
      callback(err, numAffected)
    })
  }

  /**
   * 指定した識別子のtodo情報を削除します。
   *
   * @param {string} todoId todo識別子
   * @param {function(err, numRemoved)} callback コールバック関数
   */
  delete (todoId, callback) {
    this.db.remove({ _id: todoId }, {}, (err, numRemoved) => {
      callback(err, numRemoved)
    })
  }
}
