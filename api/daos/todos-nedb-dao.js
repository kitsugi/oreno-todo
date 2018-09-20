'use strict'

const Datastore = require('nedb')
const Todo = require('../models/todo')
const config = require('config')

module.exports = class TodosNedbDAO {
  /**
   * インスタンスを初期化します。
   */
  constructor () {
    this.index = 0
    this.db = new Datastore({
      filename: config.database.path,
      autoload: true,
      timestampData: true
    })
  }

  /**
   * 条件に一致したtodoリストを取得します。
   *
   * @param {string} keyword 検索キーワード
   * @param {boolean} done 完了フラグ
   */
  async search (keyword, done) {
    const query = []
    if (keyword) {
      const regex = new RegExp(keyword)
      query.push({ $or: [{ title: regex }, { content: regex }] })
    }
    if (done != null) {
      query.push({ done: done })
    }

    return new Promise((resolve, reject) => {
      this.db.find({ $and: query }).sort({ updatedAt: -1 }).exec((err, docs) => {
        if (err) {
          reject(err)
        } else {
          resolve(docs)
        }
      })
    })
  }

  /**
   * todoリストを取得します。
   */
  async getAll () {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, docs) => {
        if (err) {
          reject(err)
        } else {
          resolve(docs)
        }
      })
    })
  }

  /**
   * 指定した番号のtodo情報を取得します。
   *
   * @param {string} todoId todo識別子
   */
  async getById (todoId) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: todoId }, (err, doc) => {
        if (err) {
          reject(err)
        } else {
          let todo = null
          if (doc) {
            todo = Todo.create(doc)
          }
          resolve(todo)
        }
      })
    })
  }

  /**
   * todo情報を作成します。
   *
   * @param {object} entry エントリ
   */
  async create (entry) {
    const todo = Todo.create(entry)

    return new Promise((resolve, reject) => {
      this.db.insert(todo, (err, newDoc) => {
        if (err) {
          reject(err)
        } else {
          resolve(newDoc)
        }
      })
    })
  }

  /**
   * 指定した番号のtodo情報を更新します。
   *
   * @param {string} todoId todo識別子
   * @param {object} entry todoエントリ
   */
  async update (todoId, entry) {
    return new Promise((resolve, reject) => {
      this.db.update({ _id: todoId }, { $set: entry }, {}, (err, numAffected) => {
        if (err) {
          reject(err)
        } else {
          resolve(numAffected)
        }
      })
    })
  }

  /**
   * 指定した識別子のtodo情報を削除します。
   *
   * @param {string} todoId todo識別子
   */
  async delete (todoId) {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: todoId }, {}, (err, numRemoved) => {
        if (err) {
          reject(err)
        } else {
          resolve(numRemoved)
        }
      })
    })
  }
}
