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
      //const results = { 'results': (result) ? result.rows : null};
      console.log(result);
      res.send(JSON.stringify(results));
      res.render('dataView', { data: result[1][1]});
      client.release();
    } 
    catch (err) 
    {
      console.error(err);
      res.send("Error " + err);
    }


    // client.connect();

    // client.query('SELECT * FROM public."Matavimai" ORDER BY public."Matavimai.ID" ASC LIMIT 10;', (err, res) =>
    //  {
    //     if (err) 
    //     {
    //         throw err;
    //     }
    //     //gal nereikia for (let row of res.rows)
    //     //{
    //       //console.log(JSON.stringify(row));
    //       res.render('dataView', { data: res.rows});
    //     //}
    //     client.end();
    //   });



});

module.exports = router;