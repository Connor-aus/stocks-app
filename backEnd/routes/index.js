var express = require('express');
var router = express.Router();

const mysql = require("mysql2");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/user', function (req, res, next) {
  let query = "SELECT username"
});

module.exports = router;
