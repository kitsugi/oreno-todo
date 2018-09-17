'use strict';

const DAO = require('../daos');
const dao = DAO.getInstance();
const Error = require('../models/error');

/**
 * TODO一覧を取得します。
 * 
 * @param {Object} req Expressリクエスト情報
 * @param {Object} res Expressレスポンス情報
 */
function getTodoList(req, res) {
  const keyword = req.swagger.params.q.value;
  const status = req.swagger.params.status.value;
  let done = null;
  if (status) {
    done = (status === 'done');
  }

  dao.search(keyword, done, (err, docs) => {
    console.log(err, docs);
    res.json(docs);
  });
}

/**
 * TODOを取得します。
 * 
 * @param {Object} req Expressリクエスト情報
 * @param {Object} res Expressレスポンス情報
 */
function getTodoById(req, res) {
  const todoId = req.swagger.params.id.value;

  dao.getById(todoId, (err, doc) => {
    if (doc) {
      res.status(200).json(doc);
    } else {
      res.status(404).json(new Error(404, "A todo with the specified ID was not found."));
    }
  });
}

/**
 * TODOを登録します。
 * 
 * @param {Object} req Expressリクエスト情報
 * @param {Object} res Expressレスポンス情報
 */
function createTodo(req, res) {
  const entry = req.swagger.params.entry.value;

  if (entry.title) {
    dao.create(entry, (err, newDoc) => {
      res.status(201).json(newDoc);
  });
  } else {
    res.status(400).json(new Error(400, "title empty"));
  }
}

/**
 * TODOを更新します。
 * 
 * @param {Object} req Expressリクエスト情報
 * @param {Object} res Expressレスポンス情報
 */
function updateTodo(req, res) {
  const todoId = req.swagger.params.id.value;
  const entry = req.swagger.params.entry.value;

  dao.update(todoId, entry, (err, numAffected) => {
    console.log(err, numAffected);
    if (numAffected > 0) {
      getTodoById(req, res);
    } else {
      res.status(404).json(new Error(404, "A todo with the specified ID was not found."));
    }
  });
}

/**
 * TODOを削除します。
 * 
 * @param {Object} req Expressリクエスト情報
 * @param {Object} res Expressレスポンス情報
 */
function deleteTodo(req, res) {
  const todoId = req.swagger.params.id.value;

  dao.delete(todoId, (err, numRemoved) => {
    console.log(err, numRemoved);
    if (numRemoved > 0) {
      res.status(204).end();
    } else {
      res.status(404).json(new Error(404, "A todo with the specified ID was not found."));
    }    
  });
}

module.exports = {  
  getTodoList: getTodoList,
  getTodoById: getTodoById,
  createTodo: createTodo,
  updateTodo: updateTodo,
  deleteTodo: deleteTodo
};