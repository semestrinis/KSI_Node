var express = require('express');
var router = express.Router();

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

router.get('/', function(req, res) 
{
    var db = req.db;
    
});

router.post('/newmat1', async(req, res) =>
{
    var db = req.db;
    
    var temp1 = req.body.temperature1;
	var humidity = req.body.humidity;
	var temp2 = req.body.temperature2;
	var presure = req.body.presure;
	var light = req.body.light;
    
    var query1 = `INSERT INTO "Matavimai" ("Temperatura1", "Temperatura2", "Dregme", "Slegis", "Sviesa", "Data") VALUES ( ${temp1} , ${temp2} , ${humidity}, ${presure},${light}, NOW();`;
    console.log(query1);
	var query2 = 'SELECT * FROM "Ribos" ORDER BY "ID" DESC LIMIT 1;';
	
	//querry1
	try 
    {
		console.log("pre q1");
		const client = await pool.connect()
		const result = await client.query(query1);
		console.log("q1 done");
    } 
    catch (err) 
    {
		console.error(err);
		res.send("Error " + err);
	}
	console.log("Querry 1 Done");
	//querry2
	try 
    {
		const client = await pool.connect()
		const result = await client.query(query2);
		const results = { 'results': (result) ? result.rows : null};
		if(results[0].Min_Temp != null && results[0].Max_Temp != null)
		{
			console.log("3");
			var min = results[0].Min_Temp;
			var max = results[0].Max_Temp;
			res.format ({'text/plain': function()
			{
				res.send(`RESPONSE;min:${min}; max:${max};RESPONSE`)
			}});
			console.log("3.5");
		}	
		else
		{
			console.log("5");
			res.format (
			{
				'text/plain': function() 
				{
					res.send(`RESPONSE;min:20; max:24;RESPONSE`)
				}
			});
			console.log("6");
		}
    } 
    catch (err) 
    {
		console.error(err);
		res.send("Error " + err);
	}
	

	// try 
    // {
    //   const client = await pool.connect()
    //   const result = await client.query('SELECT * FROM public."Matavimai" ORDER BY "ID" ASC LIMIT 100');
    //   const results = { 'results': (result) ? result.rows : null};
      
    //   res.send(JSON.stringify(results));
    //   client.release();
    // } 
    // catch (err) 
    // {
    //   console.error(err);
    //   res.send("Error " + err);
    // }

    // db.all(query1, function(err)
    // {
    //     if(err)
    //     {
    //         console.log('*** Error serving querying database. ' + err);
    //     }
    //     else
    //     {
    //         console.log("Successful post of data"); 
    //     }
    // });
	
	
	// db.all(query2, function(err,ribos)
	// {
	// 	console.log(ribos);
	// 	if(ribos!=null)
	// 	{
			
	// 		if(ribos[0].Min_Temp != null && ribos[0].Max_Temp != null)
	// 		{
	// 			console.log("3");
	// 			var min = ribos[0].Min_Temp;
	// 			var max = ribos[0].Max_Temp;
	// 			res.format ({'text/plain': function() {res.send(`RESPONSE;min:${min}; max:${max};RESPONSE`)}});
	// 			console.log("3.5");
	// 		}	
	// 		console.log("4");			
	// 	}
	// 	else
	// 	{
	// 		console.log("5");
	// 		res.format ({'text/plain': function() {res.send(`RESPONSE;min:20; max:24;RESPONSE`)}});
	// 		console.log("6");
	// 	}
	// 	console.log("7");
		
	// });
});


module.exports = router;

