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

    res.render('aboutUs', { title: 'Apie mus'});

});

router.get('/getAllData', function(req, res) 
{
	// var db = req.db;
	// db.all('SELECT * FROM "Matavimai", "Ribos";', function(err,matavimas)
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

    try 
    {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM "Matavimai", "Ribos";');
      const results = { 'results': (result) ? result.rows : null};
      
      res.send(JSON.stringify(results));
      client.release();
    } 
    catch (err) 
    {
      console.error(err);
      res.send("Error " + err);
    }
});

router.get('/db', async (req, res) => 
{
    try 
    {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM public."Matavimai" ORDER BY "ID" ASC LIMIT 100');
      const results = { 'results': (result) ? result.rows : null};
      
      res.send(JSON.stringify(results));
      client.release();
    } 
    catch (err) 
    {
      console.error(err);
      res.send("Error " + err);
    }
  })

module.exports = router;