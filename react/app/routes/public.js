const express = require('express');
const router = express.Router();

/* GET public index */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TALLYVISION' });
});

module.exports = router;
