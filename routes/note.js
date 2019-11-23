var express = require('express');
var router = express.Router();

router.get('/new', function(req, res) 
{
    var db = req.db;
    
    getCategories(db, function(cats)
    {
        res.render('note_new', { title: 'Naujas Užrašas', data:cats });
    });
});

router.post('/new', function(req, res) 
{
    var db = req.db;
    
    var title = req.body.title;
    var cat = req.body.cat;
    var text = req.body.text;
        
    getCategories(db, function(cats)
    {
        if(title.length > 0 && text.length > 0)
        {
            var timeStamp = new Date().getTime();

            saveNote(title, cat, text, timeStamp, db, function(rez)
            {
                if(rez == null)
                {
                    res.render('note_new', { title: 'Naujas Užrašas', data:cats, info:"Užrašas išsaugotas!" });
                }
                else
                {
                    res.render('note_new', { title: 'Naujas Užrašas', data:cats, info:"Užrašas neišsaugotas!" });
                }
            });
         
        }
        else
        {
            res.render('note_new', { title: 'Naujas Užrašas', data:cats, info:"Įveskite trūkstamus duomenis!" });
        }
    });
});

router.get('/:id', function(req, res) 
{
    var id = req.params.id;
    var db = req.db;

    getNote(id, db, function(note)
    {
        if(note != null)
        {
            note.DataIrLaikas = getReadableDateAndTime(note.DataIrLaikas);
        }
        res.render('note', { title: 'Užrašas', data:note });
    });
});

router.get('/delete/:id', function(req, res) 
{
    var id = req.params.id;
    var db = req.db;
    getNote(id, db, function(note)
    {
        if(note != null)
        {
            note.DataIrLaikas = getReadableDateAndTime(note.DataIrLaikas);
            res.render('note_delete', { title: 'Užrašo trynimas', data: note, note_id:note.ID });
        }
        else
        {
            res.render('note_delete', { title: 'Užrašo trynimas', info: "Užrašas nerastas!", note_id:0 });
        }
    });
});

router.post('/delete/:id', function(req, res) 
{
    var id = req.params.id;
    var db = req.db;
    getNote(id, db, function(note)
    {
        if(note != null)
        {
            deleteNote(id, db, function(rez)
            {
                var msg = "";
                if(rez == null)
                {
                    msg = 'Užrašas "' + note.Pavadinimas + '" ištrintas!';
                }
                else
                {
                    msg = 'Užrašas "' + note.Pavadinimas + '" neištrintas!';
                }

                res.render('note_delete', { title: 'Užrašo trynimas', data: note, info: msg });
            });
        }
        else
        {
            res.render('note_delete', { title: 'Užrašo trynimas', info: "Užrašas nerastas!", note_id:0 });
        }
    });
});

router.get('/edit/:id', function(req, res) 
{
    var id = req.params.id;
    var db = req.db;
    getNote(id, db, function(note)
    {
        if(note != null)
        {
            getCategories(db, function(cats)
            {
                res.render('note_edit', { title: 'Užrašo redagavimas', data: note, cats:cats });
            });
        }
        else
        {
            res.render('note_edit', { title: 'Užrašo redagavimas', info: "Užrašas nerastas!" });
        }
    });
});

router.post('/edit/:id', function(req, res) 
{
    var db = req.db;
    
    var title = req.body.title;
    var cat = req.body.cat;
    var text = req.body.text;
    var note_id = req.body.note_id;
    var id = req.params.id;
    
    if(id != null && id == note_id)
    {    
        getCategories(db, function(cats)
        {
            if(title.length > 0 && text.length > 0)
            {
                var timeStamp = new Date().getTime();

                updateNote(note_id, title, cat, text, timeStamp, db, function(rez)
                {
                    if(rez == null)
                    {
                        getNote(id, db, function(note)
                        {
                            if(note != null)
                            {
                                res.render('note_edit', { title: 'Užrašo redagavimas', data: note, cats:cats, info:"Užrašas atnaujintas!" });
                            }
                            else
                            {
                                res.render('note_edit', { title: 'Užrašo redagavimas', info: "Užrašas nerastas!" });
                            }
                        });
                    }
                    else
                    {
                        res.render('note_edit', { title: 'Užrašo redagavimas', cats:cats, info:"Užrašas neatnaujintas!" });
                    }
                });

            }
            else
            {
                res.render('note_edit', { title: 'Užrašo redagavimas', cats:cats, info:"Įveskite trūkstamus duomenis!" });
            }
        });
    }
    else
    {
        res.render('note_edit', { title: 'Užrašo redagavimas', info: "Užrašas nerastas!" });
    }
});

module.exports = router;

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

function getNote(id, db, callback)
{
    db.all('select Uzrasas.Pavadinimas, Uzrasas.DataIrLaikas, Uzrasas.Tekstas, Uzrasas.ID, Spalva.Kodas As Spalva, Kategorija.Pavadinimas As Kategorija, Kategorija.ID As KatID FROM Kategorija, Uzrasas, Spalva where Spalva.ID == Kategorija.SpalvosID and Uzrasas.KategorijosID = Kategorija.ID and Uzrasas.ID = ? ;', id, function(err,rows)
    {
        if(err)
        {
            console.log('*** Error serving querying database. ' + err);
            return callback(null);
        }
        else
        {
            return callback(rows[0]);
        }
    });
}

function getCategories(db, callback)
{
    db.all('select * from Kategorija order by Pavadinimas;', function(err,rows)
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

function saveNote(title, cat, text, timeStamp, db, callback)
{
    var sqlInsert = "insert into Uzrasas (KategorijosID, Pavadinimas, Tekstas, DataIrLaikas) values ( ";
    sqlInsert += cat + ", ";
    sqlInsert += "'" + title + "', ";
    sqlInsert += "'" + text + "', ";
    sqlInsert += timeStamp + " ); ";
    
    db.run(sqlInsert, function(insertError)
    {
        //jei nebuvo jokios klaidos insertError=null
        //jei buvo klaida insertError=klaidos_pranesimas
        return callback(insertError);  
    });
}

function deleteNote(id, db, callback)
{    
    db.run("delete from Uzrasas where ID = ? ", id, function(deleteError)
    {
        //jei nebuvo jokios klaidos deleteError=null
        //jei buvo klaida deleteError=klaidos_pranesimas
        return callback(deleteError);  
    });
}

function updateNote(noteId, title, cat, text, timeStamp, db, callback)
{
    db.run("update Uzrasas set KategorijosID = ?, Pavadinimas = ?, Tekstas = ?, AtnaujinimoDataIrLaikas = ? where ID = ? ; ", cat, title, text, timeStamp, noteId, function(updateError)
    {
        //jei nebuvo jokios klaidos updateError=null
        //jei buvo klaida updateError=klaidos_pranesimas
        return callback(updateError);  
    });
}