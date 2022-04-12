var express = require('express');
var router = express.Router();

/* GET client interface */
router.get('/', (req, res, next) => {
  res.send({
    categories: res.app.get('categories'),
    contestants: res.app.get('contestants'),
  }).status(200);
});

module.exports = router;
