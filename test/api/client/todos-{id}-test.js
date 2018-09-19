'use strict'

const chai = require('chai')
const ZSchema = require('z-schema')
const customFormats = module.exports = zSchema => {
  const decimalPattern = /^\d{0,8}.?\d{0,4}[0]+$/

  /** Validates floating point as decimal / money (i.e: 12345678.123400..) */
  zSchema.registerFormat('double', val => {
    return !decimalPattern.test(val.toString())
  })

  /** Validates value is a 32bit integer */
  zSchema.registerFormat('int32', val => {
    // the 32bit shift (>>) truncates any bits beyond max of 32
    return Number.isInteger(val) && ((val >> 0) === val)
  })

  zSchema.registerFormat('int64', val => {
    return Number.isInteger(val)
  })

  zSchema.registerFormat('float', val => {
    // better parsing for custom 'float' format
    if (Number.parseFloat(val)) {
      return true
    } else {
      return false
    }
  })

  zSchema.registerFormat('date', val => {
    // should parse a a date
    return !isNaN(Date.parse(val))
  })

  zSchema.registerFormat('dateTime', val => {
    return !isNaN(Date.parse(val))
  })

  zSchema.registerFormat('password', val => {
    // should parse as a string
    return typeof val === 'string'
  })
}

customFormats(ZSchema)

const validator = new ZSchema({})
const supertest = require('supertest')
const api = supertest('http://localhost:8080') // supertest init
const expect = chai.expect

/**
 * todos/{id}テスト
 */
describe('/todos/{id}', () => {
  /**
   * テスト後の処理
   */
  after(done => {
    deleteTodos(() => {
      done()
    })
  })

  /**
   * todo情報1件取得
   */
  describe('get', () => {
    let todoId = null

    /**
     * 各テスト前の処理
     */
    beforeEach(done => {
      const entry = {
        title: '本購入',
        content: 'Docker/Kubernetes 実践コンテナ開発入門'
      }
      createTodo(entry, (err, res) => {
        if (err) {
          done(err)
        }
        todoId = res.body._id
        done()
      })
    })

    /**
     * 各テスト後の処理
     */
    afterEach(done => {
      deleteTodos(() => {
        done()
      })
    })

    // 存在する
    it('todo取得 正常 データあり', done => {
      const schema = {
        'type': 'object',
        'title': 'todoモデル',
        'required': [
          '_id',
          'title',
          'done',
          'createdAt',
          'updatedAt'
        ],
        'properties': {
          '_id': {
            'type': 'string',
            'description': 'todo id',
            'readOnly': true,
            'example': 'dQmwl6ojF9MB0Z8y'
          },
          'title': {
            'type': 'string',
            'description': 'タイトル',
            'example': '買い物'
          },
          'content': {
            'type': 'string',
            'description': '内容',
            'example': 'お茶、豆腐、豚肉300g、うどん'
          },
          'done': {
            'type': 'boolean',
            'description': '完了フラグ',
            'example': false
          },
          'createdAt': {
            'type': 'string',
            'format': 'date-time',
            'description': '作成日時',
            'example': '2018-09-20T10:00:00.000Z'
          },
          'updatedAt': {
            'type': 'string',
            'format': 'date-time',
            'description': '更新日時',
            'example': '2018-09-20T10:00:00.000Z'
          }
        }
      }

      api.get(`/todos/${todoId}`)
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          // 評価
          expect(validator.validate(res.body, schema)).to.equal(true)
          done()
        })
    })

    // 存在しない
    it('todo取得 異常 データなし', done => {
      const schema = {
        'type': 'object',
        'title': 'エラー情報',
        'required': [
          'code',
          'message'
        ],
        'properties': {
          'code': {
            'type': 'string'
          },
          'message': {
            'type': 'string'
          }
        }
      }

      api.get('/todos/0123456789abcdef')
        .set('Content-Type', 'application/json')
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          // 評価
          expect(validator.validate(res.body, schema)).to.equal(true)
          done()
        })
    })
  })

  /**
   * todo情報1件更新
   */
  describe('put', () => {
    let todoId = null

    /**
     * 各テスト前の処理
     */
    beforeEach(done => {
      const entry = {
        title: 'ハイキング',
        content: '飯能アルプス 25km'
      }
      createTodo(entry, (err, res) => {
        if (err) {
          done(err)
        }
        todoId = res.body._id
        done()
      })
    })

    /**
     * 各テスト後の処理
     */
    afterEach(done => {
      deleteTodos(() => {
        done()
      })
    })

    // 存在する
    it('todo更新 正常 データあり', done => {
      const schema = {
        'type': 'object',
        'title': 'todoモデル',
        'required': [
          '_id',
          'title',
          'done',
          'createdAt',
          'updatedAt'
        ],
        'properties': {
          '_id': {
            'type': 'string',
            'description': 'todo id',
            'readOnly': true,
            'example': 'dQmwl6ojF9MB0Z8y'
          },
          'title': {
            'type': 'string',
            'description': 'タイトル',
            'example': '買い物'
          },
          'content': {
            'type': 'string',
            'description': '内容',
            'example': 'お茶、豆腐、豚肉300g、うどん'
          },
          'done': {
            'type': 'boolean',
            'description': '完了フラグ',
            'example': false
          },
          'createdAt': {
            'type': 'string',
            'format': 'date-time',
            'description': '作成日時',
            'example': '2018-09-20T10:00:00.000Z'
          },
          'updatedAt': {
            'type': 'string',
            'format': 'date-time',
            'description': '更新日時',
            'example': '2018-09-20T10:00:00.000Z'
          }
        }
      }

      api.put(`/todos/${todoId}`)
        .set('Content-Type', 'application/json')
        .send({
          title: 'ジョギング',
          content: '1日5km',
          done: true
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          // 評価
          expect(validator.validate(res.body, schema)).to.equal(true)
          done()
        })
    })

    // 項目違い
    it('todo更新 異常 タイトルnull', done => {
      const schema = {
        'type': 'object',
        'title': 'エラー情報',
        'required': [
          'code',
          'message'
        ],
        'properties': {
          'code': {
            'type': 'string'
          },
          'message': {
            'type': 'string'
          }
        }
      }

      api.put(`/todos/${todoId}`)
        .set('Content-Type', 'application/json')
        .send({
          title: null
        })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          // 評価
          expect(validator.validate(res.body, schema)).to.equal(true)
          done()
        })
    })

    // 存在しない
    it('todo更新 異常 データなし', done => {
      const schema = {
        'type': 'object',
        'title': 'エラー情報',
        'required': [
          'code',
          'message'
        ],
        'properties': {
          'code': {
            'type': 'string'
          },
          'message': {
            'type': 'string'
          }
        }
      }

      api.put('/todos/0123456789abcdef')
        .set('Content-Type', 'application/json')
        .send({
          title: 'ジョギング',
          content: '1日5km',
          done: true
        })
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          // 評価
          expect(validator.validate(res.body, schema)).to.equal(true)
          done()
        })
    })
  })

  /**
   * todo情報削除
   */
  describe('delete', () => {
    let todoId = null

    /**
     * 各テスト前の処理
     */
    beforeEach(done => {
      const entry = {
        title: '買い物',
        content: '豆腐、りんご、魚、コロッケ'
      }
      createTodo(entry, (err, res) => {
        if (err) {
          done(err)
        }
        todoId = res.body._id
        done()
      })
    })

    /**
     * 各テスト後の処理
     */
    afterEach(done => {
      deleteTodos(() => {
        done()
      })
    })

    // 204
    it('todo削除 正常 データあり', done => {
      api.del(`/todos/${todoId}`)
        .set('Content-Type', 'application/json')
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          // 評価
          expect(isNaN(res.body)).to.be.equal(true)
          done()
        })
    })

    // 404
    it('todo削除 異常 データなし', done => {
      const schema = {
        'type': 'object',
        'title': 'エラー情報',
        'required': [
          'code',
          'message'
        ],
        'properties': {
          'code': {
            'type': 'string'
          },
          'message': {
            'type': 'string'
          }
        }
      }

      api.del('/todos/0123456789abcdef')
        .set('Content-Type', 'application/json')
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          // 評価
          expect(validator.validate(res.body, schema)).to.equal(true)
          done()
        })
    })
  })
})

/**
 * todo情報を作成
 *
 * @param {object} entry 入力エントリ
 * @param {Function} callback コールバック関数
 */
function createTodo (entry, callback) {
  api.post('/todos')
    .set('Content-Type', 'application/json')
    .send(entry)
    .expect(201)
    .end((err, res) => {
      callback(err, res)
    })
}

/**
 * todo情報全取得
 */
async function getTodoIds () {
  return new Promise((resolve, reject) => {
    api.get('/todos')
      .set('Content-Type', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res.body.map(x => x._id))
      })
  })
}

/**
 * todoリストを削除
 */
async function deleteTodos (callback) {
  const todoIds = await getTodoIds()

  for (let todoId of todoIds) {
    await deleteTodo(todoId)
  }
  if (callback) {
    callback()
  }
}

/**
 * todo情報を削除
 *
 * @param {string} todoId todo識別子
 */
async function deleteTodo (todoId) {
  return new Promise((resolve, reject) => {
    api.del(`/todos/${todoId}`)
      .set('Content-Type', 'application/json')
      .expect(204)
      .end(() => resolve())
  })
}
