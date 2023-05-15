const mysql = require('mysql')

const db = mysql.createConnection({
    user : "root",
    host : "localhost",
    password : "VOID",
    database : "invoicedb",
    multipleStatements: true,
});

module.exports = db;