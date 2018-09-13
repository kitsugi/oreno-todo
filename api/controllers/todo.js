'use strict';

const DAO = require('../daos/index');
const dao = DAO.getInstance('memory');

/**
 * TODO一覧を取得します。
 * 
 * @param {Object} req Expressリクエスト情報
 * @param {Object} res Expressレスポンス情報
 */
function getTodoList(req, res) {
  res.json(dao.getAll());
}

/**
 * TODOを取得します。
 * 
 * @param {Object} req Expressリクエスト情報
 * @param {Object} res Expressレスポンス情報
 */
function getTodoById(req, res) {
  const id = req.swagger.params.id.value;
  const todo = dao.getById(id);

  res.json(todo);
}

/**
 * TODOを登録します。
 * 
 * @param {Object} req Expressリクエスト情報
 * @param {Object} res Expressレスポンス情報
 */
function createTodo(req, res) {
  const params = req.swagger.params.todo.value;
  const todo = dao.create(params.title, params.content);

  res.status(201).json(todo);
}

/**
 * TODOを更新します。
 * 
 * @param {Object} req Expressリクエスト情報
 * @param {Object} res Expressレスポンス情報
 */
function updateTodo(req, res) {
  const id = req.swagger.params.id.value;
  const params = req.swagger.params.todo.value;
  const todo = dao.update(id, params.title, params.content, params.done);

  res.json(todo);
}

/**
 * TODOを削除します。
 * 
 * @param {Object} req Expressリクエスト情報
 * @param {Object} res Expressレスポンス情報
 */
function deleteTodo(req, res) {
  const id = req.swagger.params.id.value;
  dao.delete(id);

  res.status(204).end();
}

module.exports = {  
  getTodoList: getTodoList,
  getTodoById: getTodoById,
  createTodo: createTodo,
  updateTodo: updateTodo,
  deleteTodo: deleteTodo
};