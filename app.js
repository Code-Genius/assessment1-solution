'use strict';

var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');

var path = require('path')
var models = require('./models'),
    Author = models.Author,
    Book = models.Book,
    Chapter = models.Chapter,
    db = models.db;

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use('/files', express.static(path.join(__dirname + '/public/static')));

app.get('/api/books/', function(req, res, next){
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

app.post('/api/books/', function(req, res, next){
  Book.create({
    title: req.body.title,
    authorId: req.body.authorId
  })
  .then(function(book){
    res.status(201).json(book)
  }).catch(next)
})

app.get('/api/books/:id', function(req, res, next){
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

app.put('/api/books/:id', function(req, res, next){
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

app.delete('/api/books/:id', function(req, res, next){
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

app.get('/api/books/:id/chapters', function(req, res, next){
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

app.post('/api/books/:id/chapters', function(req, res, next){
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

app.get('/api/books/:bookId/chapters/:chapId', function(req, res, next){
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

app.put('/api/books/:bookId/chapters/:chapId', function(req, res, next){
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

app.delete('/api/books/:bookId/chapters/:chapId', function(req, res, next){
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

module.exports = app;

app.get('/broken', function(req, res, next){
  res.sendStatus(500)
})

app.get('/forbidden', function(req, res, next){
  res.sendStatus(403)
})

app.use(session({
  genid: function(req) {
    return req.headers.host
  },
  cookie: {},
  secret: 'dougFunny'
}))

app.get('/api/numVisits', function(req, res, next){
  var views = req.session.views

  if (!views) {
    views = req.session.views = {}
    views[req.sessionID] = 0;
  } else {
    views[req.sessionID]++
  }

  var resData = {number: views[req.sessionID]}
  res.status(200).send(resData)
})



app.use(function(err, req, res, next){
  res.status(err.status || 500).end();
})

module.exports = app;