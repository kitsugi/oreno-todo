'use strict'

/**
 * Errorクラス
 */
module.exports = class Error {
  /**
   * インスタンスを初期化します。
   *
   * @param {string} code コード
   * @param {string} message メッセージ
   */
  constructor (code, message) {
    this.code = code
    this.message = message
  }
}
