var express = require('express');
var router = express.Router();

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});


/* GET home page. */
router.get('/', function(req, res) 
{
    //ar db = req.db;

    res.render('main', { title: 'Oro stebėjimo stotelė'});

});

module.exports = router;

