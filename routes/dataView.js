var express = require('express');
var router = express.Router();
const {Client} = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});


/* GET home page. */
router.get('/getAllData', async(req, res) => 
{
    client.connect();

    client.query('SELECT * FROM public."Matavimai" ORDER BY public."Matavimai.ID" ASC LIMIT 10;', (err, res) =>
     {
        if (err) 
        {
            throw err;
        }
        //gal nereikia for (let row of res.rows)
        //{
          //console.log(JSON.stringify(row));
          res.render('dataView', { data: res.rows});
        //}
        client.end();
      });
});

module.exports = router;