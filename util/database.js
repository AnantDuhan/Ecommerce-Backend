const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'realkart-db',
    password: 'AnantDuhan@0911##'
});

module.exports = pool.promise();
