'use strict';

const dateFormat = require('dateformat');

/**
 * Todoクラス
 */
module.exports = class Todo {
  constructor(id, title, content, done, created_at, updated_at) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.done = done || false;
    this.created_at = created_at || dateFormat(new Date(), 'isoUtcDateTime');
    this.updated_at = updated_at || this.created_at;
  }

  update(title, content, done) {
    this.title = title;
    this.content = content;
    this.done = done || false;
    this.updated_at = updated_at || dateFormat(new Date(), 'isoUtcDateTime');
  }
}
