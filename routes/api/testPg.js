// var express = require('express');
// var router = express.Router();
// const { Client } = require('pg');

// router.get('/testGet', function(req, res) 
// {
// 	const client = new Client({
//         connectionString: process.env.DATABASE_URL,
//         ssl: true,
//       });
      
//       client.connect();
      
//       client.query('SELECT * FROM Matavimai, Ribos;', (err, res) => {
//         if (err) throw err;
//         for (let row of res.rows) {
//           console.log(JSON.stringify(row));
//         }
//         client.end();
//       }); 
// });

// module.exports = router;
//var db = req.db;
	// db.all('SELECT * FROM Matavimai, Ribos;', function(err,matavimas)
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