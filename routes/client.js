let clientTest = require('../controller/clientTest');
 
exports.default = (app) => {
// root path
app.get('/', (req, res) => {
return res.status(200).send({
'Please use following routes': {
'Read CSV File': 'http://localhost:3000/readCSVFile',
},
'method': 'get'
});
});
 
// route to upload CSV
app.get('/readCSVFile', clientTest.readCSVFile);
 
return (app)
}