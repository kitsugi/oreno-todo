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

describe('/todos/{id}', function() {
  describe('get', function() {
    it('should respond with 200 successful operation', function(done) {
      /*eslint-disable*/
      var schema = {
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
      api.get('/todos/{id PARAM GOES HERE}')
      .set('Content-Type', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

    it('should respond with 404 A todo with the specified...', function(done) {
      /*eslint-disable*/
      var schema = {
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
      api.get('/todos/{id PARAM GOES HERE}')
      .set('Content-Type', 'application/json')
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

  });

  describe('put', function() {
    it('should respond with 200 successful operation', function(done) {
      /*eslint-disable*/
      var schema = {
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
      api.put('/todos/{id PARAM GOES HERE}')
      .set('Content-Type', 'application/json')
      .send({
        entry: 'DATA GOES HERE'
      })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

    it('should respond with 400 Bad request', function(done) {
      /*eslint-disable*/
      var schema = {
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
      api.put('/todos/{id PARAM GOES HERE}')
      .set('Content-Type', 'application/json')
      .send({
        entry: 'DATA GOES HERE'
      })
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

    it('should respond with 404 A todo with the specified...', function(done) {
      /*eslint-disable*/
      var schema = {
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
      api.put('/todos/{id PARAM GOES HERE}')
      .set('Content-Type', 'application/json')
      .send({
        entry: 'DATA GOES HERE'
      })
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

  });

  describe('delete', function() {
    it('should respond with 204 successful operation', function(done) {
      api.del('/todos/{id PARAM GOES HERE}')
      .set('Content-Type', 'application/json')
      .expect(204)
      .end(function(err, res) {
        if (err) return done(err);

        expect(res.body).to.equal(null); // non-json response or no schema
        done();
      });
    });

    it('should respond with 404 A todo with the specified...', function(done) {
      /*eslint-disable*/
      var schema = {
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
      api.del('/todos/{id PARAM GOES HERE}')
      .set('Content-Type', 'application/json')
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

  });

});
