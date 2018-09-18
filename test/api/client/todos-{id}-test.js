'use strict'

var chai = require('chai')
var ZSchema = require('z-schema')
var customFormats = module.exports = zSchema => {
  // Placeholder file for all custom-formats in known to swagger.json
  // as found on
  // https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat

  var decimalPattern = /^\d{0,8}.?\d{0,4}[0]+$/

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

var validator = new ZSchema({})
var supertest = require('supertest')
var api = supertest('http://localhost:8080') // supertest init
var expect = chai.expect

/**
 * todo情報を作成
 *
 * @param {Function} done 完了通知メソッド
 * @param {Function} callback コールバック関数
 */
function createTodo (done, callback) {
  api.post('/todos')
    .set('Content-Type', 'application/json')
    .send({
      title: '本購入',
      content: 'Docker/Kubernetes 実践コンテナ開発入門'
    })
    .expect(201)
    .end((err, res) => {
      if (err) {
        done(err)
      }
      callback(res.body._id)
      done()
    })
}

/**
 * todo情報を削除
 *
 * @param {Function} done 完了通知メソッド
 * @param {string} todoId TODO識別子
 */
function deleteTodo (done, todoId) {
  api.del(`/todos/${todoId}`)
    .set('Content-Type', 'application/json')
    .expect(204)
    .end(() => done())
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
 * todo情報全削除
 */
async function cleanupTodo () {
  const todoIds = await getTodoIds()

  todoIds.forEach(todoId => {
    api.del(`/todos/${todoId}`)
      .set('Content-Type', 'application/json')
      .expect(204)
      .end()
  })
}

/**
 * todos/{id}テスト
 */
describe('/todos/{id}', () => {
  /**
   * todo情報1件取得
   */
  describe('get', () => {
    let todoId = null

    /**
     * 各テスト前の処理
     */
    beforeEach(done => {
      createTodo(done, id => {
        todoId = id
      })
    })

    /**
     * 各テスト後の処理
     */
    afterEach(done => {
      deleteTodo(done, todoId)
    })

    // 存在する
    it('should respond with 200 successful operation', done => {
      const schema = {
        'type': 'object',
        'title': 'TODOモデル',
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
          expect(validator.validate(res.body, schema)).to.be.true
          done()
        })
    })

    // 存在しない
    it('should respond with 404 A todo with the specified...', done => {
      const schema = {
        'type': 'object',
        'title': 'エラー情報',
        'required': [
          'code',
          'message'
        ],
        'properties': {
          'code': {
            'type': 'integer'
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
          expect(validator.validate(res.body, schema)).to.be.true
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
      createTodo(done, id => {
        todoId = id
      })
    })

    /**
     * 各テスト後の処理
     */
    afterEach(done => {
      deleteTodo(done, todoId)
    })

    // 存在する
    it('should respond with 200 successful operation', done => {
      const schema = {
        'type': 'object',
        'title': 'TODOモデル',
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
          expect(validator.validate(res.body, schema)).to.be.true
          done()
        })
    })

    // 項目違い
    it('should respond with 400 Bad request', done => {
      const schema = {
        'type': 'object',
        'title': 'エラー情報',
        'required': [
          'code',
          'message'
        ],
        'properties': {
          'code': {
            'type': 'integer'
          },
          'message': {
            'type': 'string'
          }
        }
      }

      api.put(`/todos/${todoId}`)
        .set('Content-Type', 'application/json')
        .send({
          title: ''
        })
        .expect(400)
        .end((err, res) => {
          console.log('test', err, res.body)
          if (err) {
            return done(err)
          }
          // 評価
          expect(validator.validate(res.body, schema)).to.be.true
          done()
        })
    })

    // 存在しない
    it('should respond with 404 A todo with the specified...', done => {
      const schema = {
        'type': 'object',
        'title': 'エラー情報',
        'required': [
          'code',
          'message'
        ],
        'properties': {
          'code': {
            'type': 'integer'
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
          expect(validator.validate(res.body, schema)).to.be.true
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
      createTodo(done, id => {
        todoId = id
      })
    })

    /**
     * 各テスト後の処理
     */
    afterEach(done => {
      deleteTodo(done, todoId)
    })

    // 204
    it('should respond with 204 successful operation', done => {
      api.del(`/todos/${todoId}`)
        .set('Content-Type', 'application/json')
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          // 評価
          expect(res.body).to.be.NaN
          done()
        })
    })

    // 404
    it('should respond with 404 A todo with the specified...', done => {
      const schema = {
        'type': 'object',
        'title': 'エラー情報',
        'required': [
          'code',
          'message'
        ],
        'properties': {
          'code': {
            'type': 'integer'
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
          expect(validator.validate(res.body, schema)).to.be.true
          done()
        })
    })
  })
})
