const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// Init app
const app = express();
// Bring in Models
const Article = require('./models/article');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}));
// parse application/jason
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/sandbox');
let db = mongoose.connection;

// Check connection
db.once('open', function() {
  console.log('Connected to mongoDB');
});

// Start Server
const port = process.env.PORT || 3000
app.listen(port, function() {
  console.log('Server started on port:', port);
});

// Check for DB errors
db.on('error', function() {
  console.log(err);
});

// Home Route
app.get('/', function(req, res) {
  Article.find({}, function(err, articles){
    if (err) {
      console.log(err);
    } else {
      res.json(articles);
    }
  });
});


// Get Single Article
app.get('/article/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.json(article);
  });
});

// // Edit Single Article
// app.get('/article/edit/:id', function(req, res){
//   Article.findById(req.params.id, function(err, article){
//     res.json(article);
//   });
// });

// Update submit POST Route
app.post('/articles/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let queryParam = {_id: req.params.id };

  Article.update(queryParam, article, function(err){
    if (err) {
      console.log(err);
      return;
    } else {
      res.json({
        "status": 200
      });
    }
  });
});

// Add Route
app.get('/articles/add', function(req, res) {
  res.send('add articles');
});

// Save Article
app.post('/articles/add', function(req, res) {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
      console.log('article saved');
    }
  });
});

app.delete('/article/:id', function(req, res) {
  let query = {_id: req.params.id};
  Article.remove(query, function(err){
    if (err) {
      console.log(err);
    } else {
      res.send('Success');
    }
  });
});