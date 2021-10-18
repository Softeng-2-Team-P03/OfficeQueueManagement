'use strict';
/* Data Access Object (DAO) module for getting/setting infos about the current situacion in the office*/

const db = require('./db');

//Retrieve all services
exports.listServices = () => {
    return new Promise((resolve, reject) => {
      const sql = `select SERVICE_TYPE from SERVICE`
      db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const services = rows.map((service) => service.SERVICE_TYPE);
        console.log(services);
        resolve(services);
      })
    })
  }
  

