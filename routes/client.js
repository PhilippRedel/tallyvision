var express = require('express');
var router = express.Router();

/* GET client interface */
router.get('/', function(req, res, next) {
  res.render('client', {
    categories: res.app.get('categories'),
    contestants: res.app.get('contestants'),
  });
});

module.exports = router;
