var express = require('express');
var router = express.Router();

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

router.get('/get', async(req, res) =>
{
    try 
    {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM public."Matavimai", public."Ribos" ORDER BY public."Matavimai"."ID" ASC LIMIT 1;');
      const results = { 'results': (result) ? result.rows : null};
      
      res.send(JSON.stringify(results[0]));
      client.release();
    } 
    catch (err) 
    {
      console.error(err);
      res.send("Error " + err);
    }
});

router.post('/ribos', async(req, res) =>
{
    var tempFrom = req.body.nuo;
    var tempTo = req.body.iki;

    console.log(tempFrom);
    console.log(tempTo);

    try 
    {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM "Ribos";');
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

module.exports = router;

