var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) 
{
    //ar db = req.db;

    res.render('aboutUs', { title: 'Apie mus'});

});

module.exports = router;


router.get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM Matavimai');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })