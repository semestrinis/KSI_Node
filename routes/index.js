var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) 
{
    var db = req.db;

    getAllNotes(db, function(notes)
    {
        if(notes != null)
        {
            for(var i=0; i<notes.length; i++)
            {
                notes[i].DataIrLaikas = getReadableDateAndTime(notes[i].DataIrLaikas);
            }
        }
        res.render('index', { title: 'Užrašai', data:notes });
    });
});

module.exports = router;


function getAllNotes(db, callback)
{
    db.all('select Uzrasas.Pavadinimas, Uzrasas.DataIrLaikas, Uzrasas.ID, Spalva.Kodas As Spalva, Kategorija.Pavadinimas As Kategorija FROM Kategorija, Uzrasas, Spalva where Spalva.ID == Kategorija.SpalvosID and Uzrasas.KategorijosID = Kategorija.ID order by Uzrasas.DataIrLaikas DESC ;', function(err,rows)
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

function getReadableDateAndTime(timeStamp)
{
    var tempDateTime = new Date(timeStamp);
    var years, months, days, hours, minutes, seconds;

    years = tempDateTime.getFullYear();

    var mnth = tempDateTime.getMonth()+1; //Months start with 0 (january)

    if(mnth < 10)
    {
        months = '0' + mnth;
    }
    else
    {
        months = mnth;
    }

    var ds = tempDateTime.getDate();
    if(ds < 10)
    {
        days = '0' + ds;
    }
    else
    {
        days = ds;
    }

    var hr = tempDateTime.getHours();
    if(hr < 10)
    {
        hours = '0' + hr;
    }
    else
    {
        hours = hr;
    }

    var min = tempDateTime.getMinutes();
    if(min < 10)
    {
        minutes = '0' + min;
    }
    else
    {
        minutes = min;
    }

    var sec = tempDateTime.getSeconds();
    if(sec < 10)
    {
        seconds = '0' + sec;
    }
    else
    {
        seconds = sec;
    }

    var rez = years + "-" + months + "-" + days + " " + hours + ":" + minutes + ":" + seconds;
    return rez;
}