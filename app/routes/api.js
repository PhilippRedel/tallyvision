const express = require('express');
const router = express.Router();

/* GET api */
router.get('/', function(req, res, next) {
  res.send({ response: 'socket to me!' }).status(200);
});

module.exports = router;
