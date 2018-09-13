'use strict';

const Todo = require('../models/todo-model');

module.exports = class TodosMemoryDAO {
  constructor () {
    this.index = 0;
    this.data = new Map();
  }

  /**
   * TODOリストを取得します。
   */
  getAll() {
    return Array.from(this.data.values());
  }

  /**
   * 指定した番号のTODO情報を取得します。
   * 
   * @param {number} id TODO番号
   */
  getById(id) {
    if (!this.data.has(id)) {
      throw new Error(`Todo with id:${id} not found.`);
    }

    return this.data.get(id);
  }

  /**
   * TODO情報を作成します。
   * 
   * @param {string} title タイトル
   * @param {string} content 内容
   */
  create(title, content) {
    const id = this.index++;
    this.data.set(id, new Todo(id, title, content));

    return this.getById(id);
  }

  /**
   * 指定した番号のTODO情報を更新します。
   * 
   * @param {number} id TODO番号
   * @param {string} title タイトル
   * @param {string} content 内容
   * @param {boolean} done 完了フラグ
   */
  update(id, title, content, done) {
    if (!this.data.has(id)) {
      throw new Error(`Todo with id:${id} not found.`);
    }

    const todo = this.data.get(id);
    todo.update(title, content, done);

    return this.getById(todo.id);
  }

  /**
   * 指定した番号のTODO情報を削除します。
   * 
   * @param {number} id TODO番号
   */
  delete(id) {
    if (!this.data.has(id)) {
      throw new Error(`Todo with id:${id} not found.`);
    }

    return this.data.delete(id);
  }
}
