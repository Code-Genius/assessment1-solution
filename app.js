var express = require('express');
var bodyParser = require('body-parser');
var bookRoute = require('./api/books');
var session = require('express-session');
var app = express();

app.use('/files', express.static('public/static'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/books', bookRoute);

app.get('/broken', function(req, res, next){
  res.sendStatus(500)
})

app.get('/forbidden', function(req, res, next){
  res.sendStatus(403)
})

app.use(session({
  genid: function(req) {
    return req.headers.host // use UUIDs for session IDs
  },
  // secret: 'dougFunny',
  cookie: {},
  secret: 'dougFunny'
  // resave: false,
  // saveUninitialized: true
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