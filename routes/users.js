const express = require('express')
    , router = express.Router();

router.get('/', function(req, res, next) {
    res.send();
});

module.exports = router;