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
 * todosテスト
 */
describe('/todos', () => {
  /**
   * テスト後の処理
   */
  after(done => {
    deleteTodos(() => {
      done()
    })
  })

  /**
   * todo情報検索
   */
  describe('get', () => {
    const schema = {
      'title': 'todos',
      'type': 'array',
      'items': {
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
    }

    /**
     * 各テスト前の処理
     */
    beforeEach(done => {
      createTodos(() => {
        done()
      })
    })

    it('todo検索 正常 条件:指定なし', done => {
      api.get('/todos')
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          // 評価
          expect(validator.validate(res.body, schema)).to.equal(true)
          expect(res.body.length).to.equal(6)
          done()
        })
    })

    it('todo検索 正常 条件:一致なし', done => {
      api.get('/todos')
        .query({
          q: '沖縄県'
        })
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          // 評価
          expect(validator.validate(res.body, schema)).to.equal(true)
          expect(res.body.length).to.equal(0)
          done()
        })
    })

    it('todo検索 正常 条件:完了', done => {
      api.get('/todos')
        .query({
          status: 'done'
        })
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          // 評価
          expect(validator.validate(res.body, schema)).to.equal(true)
          expect(res.body.length).to.equal(3)
          done()
        })
    })

    it('todo検索 正常 条件:買い物', done => {
      api.get('/todos')
        .query({
          q: '買い物'
        })
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          // 評価
          expect(validator.validate(res.body, schema)).to.equal(true)
          expect(res.body.length).to.equal(3)
          done()
        })
    })

    it('todo検索 正常 条件:埼玉県,未完了', done => {
      api.get('/todos')
        .query({
          q: '埼玉県',
          status: 'undone'
        })
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          // 評価
          expect(validator.validate(res.body, schema)).to.equal(true)
          expect(res.body.length).to.equal(1)
          done()
        })
    })
  })

  /**
   * todo情報登録
   */
  describe('post', () => {
    /**
     * 各テスト前の処理
     */
    beforeEach(done => {
      done()
    })

    /**
     * 各テスト後の処理
     */
    afterEach(done => {
      done()
    })

    it('todo登録 正常', done => {
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

      api.post('/todos')
        .set('Content-Type', 'application/json')
        .send({
          title: '買い物',
          content: '大根、ネギ、豚肉500g、豆腐'
        })
        .expect(201)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          // 評価
          expect(validator.validate(res.body, schema)).to.equal(true)
          done()
        })
    })

    it('todo登録 異常 タイトルなし', done => {
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

      api.post('/todos')
        .set('Content-Type', 'application/json')
        .send({
          content: '大根、ネギ、豚肉500g、豆腐'
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
  })
})

/**
 * todo情報を作成
 *
 * @param {object} entry 入力エントリ
 */
async function createTodo (entry) {
  return new Promise((resolve, reject) => {
    api.post('/todos')
      .set('Content-Type', 'application/json')
      .send(entry)
      .expect(201)
      .end((err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res.body._id)
      })
  })
}

/**
 * todoリストを作成
 *
 * @param {Function} callback コールバック関数
 */
async function createTodos (callback) {
  await deleteTodos()

  await createTodo({
    title: '本購入',
    content: 'Docker/Kubernetes 実践コンテナ開発入門',
    done: true
  })
  await createTodo({
    title: 'ハイキング',
    content: '埼玉県飯能市 25km',
    done: true
  })
  await createTodo({
    title: 'ジョギング',
    content: '埼玉県さいたま市 5km',
    done: false
  })
  await createTodo({
    title: '買い物',
    content: '豆腐、りんご、魚、コロッケ',
    done: true
  })
  await createTodo({
    title: '散歩',
    content: '犬の散歩、買い物袋',
    done: false
  })
  await createTodo({
    title: '買い物',
    content: 'お菓子、ジュース、ビニール袋',
    done: false
  })

  callback()
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
