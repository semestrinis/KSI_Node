const { Client } = require("pg");
 
const client = new Client({
user: "postgres",
host: "localhost",
database: "newdb",
password: "root",
port: 5432
});
client.connect();
 
const getClient = (req) => new Promise((resolve, reject) => {
client.query(`SELECT clientid FROM clients WHERE clientid='${req.clientId}'`)
.then(client => resolve(client.rowCount))
.catch(err => reject(err))
})
 
const createOrder = (req) => new Promise((resolve, reject) => {
client.query(`INSERT INTO orders (orderId, clientId,request,duration) VALUES ('${req.orderId}','${req.clientId}','${req.requests}','${req.duration}')`)
.then(client => resolve(client))
.catch(err => reject(err))
})
 
const getOrder = (req) => new Promise((resolve, reject) => {
client.query(`SELECT orderId FROM orders WHERE orderId='${req.orderId}'`)
.then(client => resolve(client.rowCount))
.catch(err => reject(err))
})
 
module.exports = {
getClient,
createOrder,
getOrder
};