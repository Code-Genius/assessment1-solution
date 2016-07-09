var express = require('express');
var Book = require('../models/index').Book;
var Chapter = require('../models/index').Chapter;

var router = express.Router();

router.get('/', function(req, res, next){
  if (req.query.title) {
    Book.findAll({
      where: {
        title: req.query.title
      }
    }).then(function(books){
    res.json(books)
  }).catch(next)
  } else {
    Book.findAll({})
    .then(function(books){
      res.json(books)
    }).catch(next)
  }
})

router.post('/', function(req, res, next){
  Book.create({
    title: req.body.title,
    authorId: req.body.authorId
  })
  .then(function(book){
    res.status(201).json(book)
  }).catch(next)
})

router.get('/:id', function(req, res, next){
  var id = req.params.id;
  Book.findOne({
    where: {
      id: id
    }
  }).then(function(book) {
    if (!book) res.sendStatus(404);
    res.json(book)
  }).catch(next)
})

router.put('/:id', function(req, res, next){
  var id = req.params.id;
  Book.findOne({
    where: {
      id: id
    }
  }).then(function(book){
    if (!book) res.sendStatus(404);
    return book.update({
      title: req.body.title
    })
  }).then(function(updatedBook) {
    res.json(updatedBook)
  }).catch(next)
})

router.delete('/:id', function(req, res, next){
  var id = req.params.id;
  Book.destroy({
    where: {
      id: id
    }
  }).then(function(book) {
    if (!book) res.sendStatus(404);
    res.sendStatus(204);
  }).catch(next)
})

router.get('/:id/chapters', function(req, res, next){
  var id = req.params.id;
  Chapter.findAll({
    where: {
      bookId: id
    }
  }).then(function(chapters) {
    if (!chapters) res.sendStatus(404);
    res.json(chapters)
  }).catch(next)
})

router.post('/:id/chapters', function(req, res, next){
  var id = req.params.id;

  Chapter.create({
    title: req.body.title,
    text: req.body.text,
    number: req.body.number
  }).then(function(chapter) {
    Book.findOne({
      where: {
        id: id
      }
    }).then(function(book) {
      return chapter.setBook(book)
    }).then(function(updatedChapter){
      res.status(201).json(updatedChapter);
    }).catch(next)
  }).catch(next)

})

router.get('/:bookId/chapters/:chapId', function(req, res, next){
  var bookId = req.params.bookId;
  var chapId = req.params.chapId;
  Chapter.findOne({
    where: {
      bookId: bookId,
      id: chapId
    }
  }).then(function(chapter) {
    if (!chapter) res.sendStatus(404);
    res.json(chapter)
  }).catch(next)
})

router.put('/:bookId/chapters/:chapId', function(req, res, next){
  var bookId = req.params.bookId;
  var chapId = req.params.chapId;
  Chapter.findOne({
    where: {
      bookId: bookId,
      id: chapId
    }
  }).then(function(chapter){
    if (!chapter) res.sendStatus(404);
    return chapter.update({
      title: req.body.title
    })
  }).then(function(updatedChapter) {
    res.json(updatedChapter)
  }).catch(next)
})

router.delete('/:bookId/chapters/:chapId', function(req, res, next){
  var bookId = req.params.bookId;
  var chapId = req.params.chapId;
  Chapter.destroy({
    where: {
      bookId: bookId,
      id: chapId
    }
  }).then(function(chapter){
    if (!chapter) res.sendStatus(404);
    res.sendStatus(204);
  }).catch(next)
})

module.exports = router;