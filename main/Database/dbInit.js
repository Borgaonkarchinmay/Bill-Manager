const mysql = require('mysql')

const db = mysql.createConnection({
    user : "VOID",
    host : "localhost",
    password : "VOID",
    database : "invoicedb",
    multipleStatements: true,
});

module.exports = db;