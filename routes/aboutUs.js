var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) 
{
    //ar db = req.db;

    res.render('aboutUs', { title: 'Apie projektą'});

});

module.exports = router;

