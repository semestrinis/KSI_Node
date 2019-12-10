var express = require('express');
var router = express.Router();

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});


/* GET home page. */
router.get('/', async(req, res) => 
{
    try 
    {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM public."Matavimai" ORDER BY "ID" DESC LIMIT 1;');
      const result1 = await client.query('SELECT * FROM public."Ribos" ORDER BY "ID" DESC LIMIT 1;');
      const results = { 'results': (result) ? result.rows : null};
      const results1 = { 'results1': (result1) ? result1.rows : null};
      res.render('main', { title: "Stotelės duomenys",data: results, data1: results1});
      client.release();
    } 
    catch (err) 
    {
      console.error(err);
      res.send("Error " + err);
    }
});

module.exports = router;