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
      var rezultatas = "";
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM public."Matavimai" ORDER BY "ID" DESC LIMIT 1;');
      const result1 = await client.query('SELECT * FROM public."Ribos" ORDER BY "ID" DESC LIMIT 1;');
      const results = { 'results': (result) ? result.rows : null};
      const results1 = { 'results1': (result1) ? result1.rows : null};
      //console.log(result1[0].Min_Temp);
      console.log(results[0].Temperatura1);
      //console.log(result1[0].Max_Temp);
      if(result1.Min_Temp > result.Temperatura1 && result.Temperatura1 < result1.Max_Temp)
      {
        rezultatas = "Pats tas";
      }
      else if(result.Temperatura1 > result1.Max_Temp)
      {
        rezultatas = "Per karsta, kolegos";
      }
      else if(result.Temperatura1 < result1.Min_Temp)
      {
        rezultatas = "Tadai, lysk jau lauk is saldytuvo";
      }
      else
      {
        rezultatas = "Kazkas negerai, gelbekit kolegos";
      }
      res.render('main', { title: "Stotelės duomenys",data: results, data1: results1, rezultatas: rezultatas});
      
      client.release();
    } 
    catch (err) 
    {
      console.error(err);
      res.send("Error " + err);
    }
});

module.exports = router;