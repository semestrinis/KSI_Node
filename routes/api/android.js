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
      const result = await client.query('SELECT * FROM public."Matavimai", public."Ribos" ORDER BY public."Matavimai"."ID" DESC LIMIT 1;');
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

router.get('/temperaturos', async(req, res) =>
{
    try 
    {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM public."Matavimai", public."Ribos" ORDER BY public."Matavimai"."ID" DESC LIMIT 150;');
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

router.post('/ribos', async(req, res) =>
{
    var tempFrom = req.body.nuo;
    var tempTo = req.body.iki;

    console.log(tempFrom);
    console.log(tempTo);

    try 
    {
      const client = await pool.connect()
      const result = await client.query('UPDATE public."Ribos" SET "Min_Temp" = '+tempFrom+', "Max_Temp" = '+tempTo+' WHERE "ID" = 1;');
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

