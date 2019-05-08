var express = require('express');
var router  = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('client', { title: 'TALLYVISION', contestants: res.app.get('contestants') });
});

// ...
router.get('/:ID/ballot', function(req, res) {
	res.render('client-ballot', { title: 'TALLYVISION', categories: res.app.get('ballot-categories'), contestants: res.app.get('contestants'), ID: req.params.ID });
});

module.exports = router;