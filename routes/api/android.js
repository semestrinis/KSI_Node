var express = require('express');
var router = express.Router();

router.get('/', function(req, res) 
{
    var db = req.db;
    
    getCategories(db, function(cats)
    {
        res.render('cats', { title: 'Kategorijos', data:cats });
    });
});

module.exports = router;

function getCategories(db, callback)
{
    db.all('select Kategorija.Pavadinimas, Spalva.Kodas from Kategorija, Spalva where Spalva.ID == Kategorija.SpalvosID order by Kategorija.Pavadinimas;', function(err,rows)
    {
        if(err)
        {
            console.log('*** Error serving querying database. ' + err);
            return callback(null);
        }
        else
        {
            return callback(rows);
        }
    });
}