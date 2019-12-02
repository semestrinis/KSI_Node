var express = require('express');
var router = express.Router();
const {Client} = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

router.get('/get', function(req, res) 
{
    client.connect();

    client.query('SELECT * FROM Matavimai, Ribos ORDER BY ID ASC LIMIT 1;', (err, res) =>
     {
        if (err) 
        {
            throw err;
        }
        for (let row of res.rows)
        {
          console.log(JSON.stringify(row));
        }
        client.end();
      });









	//var db = req.db;
	// db.all('SELECT * FROM Matavimai, Ribos ORDER BY ID ASC LIMIT 1;', function(err,matavimas)
    // {
    //     if(err)
    //     {
    //         console.log('*** Error serving querying database. ' + err);
    //     }
    //     else
    //     {
	// 		res.json(matavimas);
    //     }
    // });
});

module.exports = router;

