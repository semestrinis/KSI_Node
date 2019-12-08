var express = require('express');
var router = express.Router();
const {Client} = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

router.get('/get', function(req, res) 
{
    try 
    {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM "Matavimai", "Ribos" ORDER BY "ID" ASC LIMIT 1;');
      const results = { 'results': (result) ? result.rows : null};
      
      res.send(JSON.stringify(results));
      client.release();
    } 
    catch (err) 
    {
      console.error(err);
      res.send("Error " + err);
    }

    // client.connect();

    // client.query('SELECT * FROM "Matavimai", "Ribos" ORDER BY "ID" ASC LIMIT 1;', (err, res) =>
    //  {
    //     if (err) 
    //     {
    //         throw err;
    //     }
    //     for (let row of res.rows)
    //     {
    //       console.log(JSON.stringify(row));
    //     }
    //     client.end();
    //   });
});

router.post('/getAllData', async(req, res) =>
{
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

module.exports = router;

