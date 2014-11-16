var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var code = req.query.code;
  res.render('index', { title: 'Express' , code: code});
});

// Start Dolphin
router.get('/start_game', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
