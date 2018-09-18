'use strict'

/**
 * Todoクラス
 */
module.exports = class Todo {
  /**
   * インスタンスを初期化します。
   *
   * @param {string} _id todo識別子
   * @param {string} title タイトル
   * @param {string} content 内容
   * @param {boolean} done 完了フラグ
   * @param {string} createdAt 作成日時
   * @param {string} updatedAt 更新日時
   */
  constructor (_id, title, content, done, createdAt, updatedAt) {
    this._id = _id
    this.title = title
    this.content = content
    this.done = done || false
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  /**
   * Todoインスタンスを生成します。
   *
   * @param {object} entry エントリ
   */
  static create (entry) {
    const todo = new Todo()
    return Object.assign(todo, entry)
  }

  /**
   * todo情報を更新します。
   *
   * @param {string} title タイトル
   * @param {string} content 内容
   * @param {boolean} done 完了フラグ
   */
  update (title, content, done = false) {
    this.title = title
    this.content = content
    this.done = done
  }

  /**
   * todo情報を完了します。
   */
  complete () {
    this.done = true
  }
}
