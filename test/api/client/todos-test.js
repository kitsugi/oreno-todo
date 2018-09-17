'use strict';
var chai = require('chai');
var ZSchema = require('z-schema');
var customFormats = module.exports = function(zSchema) {
  // Placeholder file for all custom-formats in known to swagger.json
  // as found on
  // https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat

  var decimalPattern = /^\d{0,8}.?\d{0,4}[0]+$/;

  /** Validates floating point as decimal / money (i.e: 12345678.123400..) */
  zSchema.registerFormat('double', function(val) {
    return !decimalPattern.test(val.toString());
  });

  /** Validates value is a 32bit integer */
  zSchema.registerFormat('int32', function(val) {
    // the 32bit shift (>>) truncates any bits beyond max of 32
    return Number.isInteger(val) && ((val >> 0) === val);
  });

  zSchema.registerFormat('int64', function(val) {
    return Number.isInteger(val);
  });

  zSchema.registerFormat('float', function(val) {
    // better parsing for custom "float" format
    if (Number.parseFloat(val)) {
      return true;
    } else {
      return false;
    }
  });

  zSchema.registerFormat('date', function(val) {
    // should parse a a date
    return !isNaN(Date.parse(val));
  });

  zSchema.registerFormat('dateTime', function(val) {
    return !isNaN(Date.parse(val));
  });

  zSchema.registerFormat('password', function(val) {
    // should parse as a string
    return typeof val === 'string';
  });
};

customFormats(ZSchema);

var validator = new ZSchema({});
var supertest = require('supertest');
var api = supertest('http://localhost:8080'); // supertest init;
var expect = chai.expect;

/**
 * todosテスト
 */
describe('/todos', () => {
  /**
   * todo情報検索
   */
  describe('get', () => {
    /**
     * 各テスト前の処理
     */
    beforeEach(done => {
      done();
    });

    /**
     * 各テスト後の処理
     */
    afterEach(done => {
      done();
    });

    it('should respond with 200 successful operation', done => {
      /*eslint-disable*/
      const schema = {
        "title": "todos",
        "type": "array",
        "items": {
          "type": "object",
          "title": "TODOモデル",
          "required": [
            "_id",
            "title",
            "done",
            "createdAt",
            "updatedAt"
          ],
          "properties": {
            "_id": {
              "type": "string",
              "description": "todo id",
              "readOnly": true,
              "example": "dQmwl6ojF9MB0Z8y"
            },
            "title": {
              "type": "string",
              "description": "タイトル",
              "example": "買い物"
            },
            "content": {
              "type": "string",
              "description": "内容",
              "example": "お茶、豆腐、豚肉300g、うどん"
            },
            "done": {
              "type": "boolean",
              "description": "完了フラグ",
              "example": false
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "description": "作成日時",
              "example": "2018-09-20T10:00:00.000Z"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "description": "更新日時",
              "example": "2018-09-20T10:00:00.000Z"
            }
          }
        }
      };

      /*eslint-enable*/
      api.get('/todos')
        .query({
          //q: 'DATA GOES HERE',
          status: 'undone'
        })
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          };
          // 評価
          expect(validator.validate(res.body, schema)).to.be.true;
          done();
        }
      );
    });

  });

  /**
   * todo情報登録
   */
  describe('post', () => {
    /**
     * 各テスト前の処理
     */
    beforeEach(done => {
      done();
    });

    /**
     * 各テスト後の処理
     */
    afterEach(done => {
      done();
    });
  
    it('should respond with 201 successful operation', done => {
      /*eslint-disable*/
      const schema = {
        "type": "object",
        "title": "TODOモデル",
        "required": [
          "_id",
          "title",
          "done",
          "createdAt",
          "updatedAt"
        ],
        "properties": {
          "_id": {
            "type": "string",
            "description": "todo id",
            "readOnly": true,
            "example": "dQmwl6ojF9MB0Z8y"
          },
          "title": {
            "type": "string",
            "description": "タイトル",
            "example": "買い物"
          },
          "content": {
            "type": "string",
            "description": "内容",
            "example": "お茶、豆腐、豚肉300g、うどん"
          },
          "done": {
            "type": "boolean",
            "description": "完了フラグ",
            "example": false
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "作成日時",
            "example": "2018-09-20T10:00:00.000Z"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "description": "更新日時",
            "example": "2018-09-20T10:00:00.000Z"
          }
        }
      };

      /*eslint-enable*/
      api.post('/todos')
        .set('Content-Type', 'application/json')
        .send({
          title: '買い物', 
          content: '大根、ネギ、豚肉500g、豆腐'
        })
        .expect(201)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          // 評価
          expect(validator.validate(res.body, schema)).to.be.true;
          done();
        }
      );
    });

    it('should respond with 400 Bad request', done => {
      /*eslint-disable*/
      const schema = {
        "type": "object",
        "title": "エラー情報",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "integer"
          },
          "message": {
            "type": "string"
          }
        }
      };

      /*eslint-enable*/
      api.post('/todos')
        .set('Content-Type', 'application/json')
        .send({
          content: '大根、ネギ、豚肉500g、豆腐'
        })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          };
          // 評価
          expect(validator.validate(res.body, schema)).to.be.true;
          done();
        }
      );
    });

  });

});
