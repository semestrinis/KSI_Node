var express = require('express');
var router = express.Router();

router.get('/getAllData', function(req, res) 
{
	var db = req.db;
	db.all('SELECT * FROM Matavimai, Ribos;', function(err,matavimas)
    {
        if(err)
        {
            console.log('*** Error serving querying database. ' + err);
        }
        else
        {
			res.json(matavimas);
        }
    });
});

module.exports = router;

