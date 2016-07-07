'use strict'

let router = require('express').Router()
let Chapter = require('../models/chapter')

router.param('chapterId', function (req, res, next, chapterId) {
  Chapter.findOne({ where: { id: chapterId } })
  .then((chapter) => {
    if (chapter) {
      req.requestedChapter = chapter
      next()
    } else {
      res.sendStatus(404)
    }
  })
  .catch(next)
})

router.get('/', function (req, res, next) {
  req.requestedBook.getChapters()
  .then((chapters) => {
    res.send(chapters)
  })
  .catch(next)
})

router.post('/', function (req, res, next) {
  Chapter.create(req.body)
  .then((createdChapter) => {
    return Promise.all([
      req.requestedBook.addChapter(createdChapter),
      createdChapter.setBook(req.requestedBook)
    ])
  })
  .spread((book, chapter) => {
    res.status(201).send(chapter)
  })
  .catch(next)
})

router.get('/:chapterId', function (req, res, next) {
  res.send(req.requestedChapter)
})

router.put('/:chapterId', function (req, res, next) {
  req.requestedChapter.update(req.body)
  .then((updatedChapter) => {
    res.send(updatedChapter)
  })
  .catch(next)
})

router.delete('/:chapterId', function (req, res, next) {
  req.requestedChapter.destroy()
  .then(() => {
    res.sendStatus(204)
  })
  .catch(next)
})

module.exports = router
