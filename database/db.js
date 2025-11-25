const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "lab_nodejs",
    port: 3306
});


module.exports = db;
