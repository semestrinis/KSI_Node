const csv = require("csvtojson");
const db = require("../utils/db");
const async = require("async");
 
/**
* Method to read CSV File
* @param {*} req
* @param {*} res
*/
let readCSVFile = (req, res) => {
csv()
// reading static file in given location
.fromFile('public/requests.csv')
.then(requests => {
async.eachSeries(requests, async (request) => {
// reading each row of CSV Sheet
let clientRequests = await db.getClient({ clientId: request.clientId });
// checking if client exists in DB or not
if (clientRequests) {
let order = await db.getOrder({ orderId: request.orderId });
if (!order) await db.createOrder(request)
}
}, (err) => {
if (err) res.send("Something went wrong")
// return as CSV successfully saved
else res.status(200).send("Data imported successfully");
})
}).catch(() => res.send("Something went wrong"));
}
 
module.exports = {
readCSVFile
}