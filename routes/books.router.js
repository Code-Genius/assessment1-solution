'use strict'

let router = require('express').Router()
let Promise = require('sequelize').Promise
let Book = require('../models/book')
let Chapter = require('../models/chapter')

router.param('id', function (req, res, next, id) {
  Book.findOne({ where: { id: id }})
  .then((book) => {
    if (book) {
      req.requestedBook = book
      next()
    } else {
      res.sendStatus(404)
    }
  })
  .catch(next)
})

router.get('/', function (req, res, next) {
  let options = {}
  if (req.query) options = { where: req.query }
  Book.findAll(options)
  .then((books) => {
    res.send(books)
  })
  .catch(next)
})

router.post('/', function (req, res, next) {
  Book.create(req.body)
  .then((createdBook) => {
    res.status(201).send(createdBook)
  })
  .catch(next)
})

router.get('/:id', function (req, res, next) {
  res.send(req.requestedBook)
})

router.put('/:id', function (req, res, next) {
  req.requestedBook.update(req.body)
  .then((updatedBook) => {
    res.send(updatedBook)
  })
  .catch(next)
})

router.delete('/:id', function (req, res, next) {
  req.requestedBook.destroy()
  .then(() => {
    res.sendStatus(204)
  })
  .catch(next)
})

router.use('/:id/chapters', require('./chapters.router'))

module.exports = router
