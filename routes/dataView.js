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
      const result = await client.query('SELECT * FROM public."Matavimai" ORDER BY "ID" ASC LIMIT 10;');
      const results = { 'results': (result) ? result.rows : null};
      console.log(result);
      console.log(results);
      //res.send(JSON.stringify(results));
      res.render('dataView', { title: "Veliausi matavimai",data: results});
      client.release();
    } 
    catch (err) 
    {
      console.error(err);
      res.send("Error " + err);
    }
});

module.exports = router;