var express = require('express');
var router = express.Router();
var sys = require('sys')
var exec = require('child_process').exec;

/* GET home page. */
router.get('/', function(req, res) {
  var code = req.query.code;
  var ip = req.query.ip;
  res.render('index', { title: 'Express' , code: code});
});

router.get('/test', function(req, res) {
  var code = req.query.code;
  // var ip = req.query.ip;
  res.render('test', { title: 'Express' , code: code});
});

// Start Dolphin
router.get('/start_game', function(req, res) {
  function puts(error, stdout, stderr) { }
  exec("/Applications/Dolphin.app/Contents/MacOS/Dolphin -e ~/Downloads/ssbm.iso", puts);
  res.render('index', { title: 'Express' });
});

// End Dolphin
router.get('/end_game', function(req, res) {
  function puts(error, stdout, stderr) { }
  exec("killall Dolphin", puts);
  res.render('index', { title: 'Express' });
});

module.exports = router;