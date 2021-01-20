var MongoClient = require('mongodb').MongoClient;
const createError = require('http-errors');
const {ObjectId} = require('mongodb');
const {Todo} = require('../todo-api/models/todo');



const dbPromise = MongoClient.connect('mongodb://localhost:27017/todos')
  .then((client) => client.db('todos'))
const listPromise = dbPromise.then((db) => db.collection('list'))

exports.index = function (req, res) {
  Todo.find()
    .then(todos =>
      res.send(todos))
}

exports.create = function (req, res, next) {
  if (!req.body.name) {
    return (next(createError(400, "name is required")))
  }
  const todo = new Todo({ name: req.body.name })
  todo.save()
    .then(() => res.send({ result: true }))
}

exports.show = function (req, res, next) {
  Todo.findOne({ _id: ObjectId(req.params.id) })
    .then((todoitem) => {
      console.log(todoitem)
      if (!todoitem) {
        return (next(createError(404, "no todo with that id")))
      }
      res.send(todoitem)
    })
}

exports.delete = function (req, res, next) {
  Todo.deleteOne({ _id: ObjectId(req.params.id) })
    .then((r) => {
      if (r.deletedCount) {
        return res.send({ result: true })
      }
      return (next(createError(404, "no todo with that id")))
    })
}

exports.update = function (req, res, next) {
  if (!req.body.name) {
    return (next(createError(400, "name is required")))
  }
  Todo.findOne({ _id: ObjectId(req.params.id) })
    .then((result) => {
      if (!result) {
        return (next(createError(404, "no todo with that id")))
      }
      result.name = req.body.name
      result.completed = req.body.completed
      result.save().then(() => res.send({ result: true }))
    })
}