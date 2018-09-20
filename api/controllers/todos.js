'use strict'

const Error = require('../models/error')
const DAO = require('../daos')
const dao = DAO.getInstance()

/**
 * todo一覧を取得します。
 *
 * @param {Object} req Expressリクエスト情報
 * @param {Object} res Expressレスポンス情報
 */
function getTodoList (req, res) {
  const keyword = req.swagger.params.q.value
  const status = req.swagger.params.status.value
  let done = null
  if (status) {
    done = (status === 'done')
  }

  dao.search(keyword, done).then(docs => {
    res.json(docs)
  }, err => {
    res.status(500).json(new Error(err.code, err.message))
  })
}

/**
 * todoを取得します。
 *
 * @param {Object} req Expressリクエスト情報
 * @param {Object} res Expressレスポンス情報
 */
function getTodoById (req, res) {
  const todoId = req.swagger.params.id.value

  dao.getById(todoId).then(doc => {
    if (doc) {
      res.status(200).json(doc)
    } else {
      res.status(404).json(new Error('404', 'A todo with the specified ID was not found.'))
    }
  }, err => {
    res.status(500).json(new Error(err.code, err.message))
  })
}

/**
 * todoを登録します。
 *
 * @param {Object} req Expressリクエスト情報
 * @param {Object} res Expressレスポンス情報
 */
function createTodo (req, res) {
  const entry = req.swagger.params.entry.value

  if (entry.title) {
    dao.create(entry).then(newDoc => {
      res.status(201).json(newDoc)
    }, err => {
      res.status(500).json(new Error(err.code, err.message))
    })
  } else {
    res.status(400).json(new Error('400', 'title empty'))
  }
}

/**
 * todoを更新します。
 *
 * @param {Object} req Expressリクエスト情報
 * @param {Object} res Expressレスポンス情報
 */
function updateTodo (req, res) {
  const todoId = req.swagger.params.id.value
  const entry = req.swagger.params.entry.value

  dao.update(todoId, entry).then(numAffected => {
    if (numAffected > 0) {
      getTodoById(req, res)
    } else {
      res.status(404).json(new Error('404', 'A todo with the specified ID was not found.'))
    }
  }, err => {
    res.status(500).json(new Error(err.code, err.message))
  })
}

/**
 * todoを削除します。
 *
 * @param {Object} req Expressリクエスト情報
 * @param {Object} res Expressレスポンス情報
 */
function deleteTodo (req, res) {
  const todoId = req.swagger.params.id.value

  dao.delete(todoId).then(numRemoved => {
    if (numRemoved > 0) {
      res.status(204).end()
    } else {
      res.status(404).json(new Error('404', 'A todo with the specified ID was not found.'))
    }
  }, err => {
    res.status(500).json(new Error(err.code, err.message))
  })
}

module.exports = {
  getTodoList: getTodoList,
  getTodoById: getTodoById,
  createTodo: createTodo,
  updateTodo: updateTodo,
  deleteTodo: deleteTodo
}
