// open the database
'use strict';

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('db-softeng2-project1.db', (err) => {
  if (err) throw err;
});

module.exports = db;