var express = require('express');
var router = express.Router();

/* api get route */
router.get('/', (req, res, next) => {
  res.send({ Message: 'Socket to me!' }).status(200);
});

module.exports = router;
