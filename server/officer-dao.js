'use strict';
const db = require('./db');
// const db =; 
// ----------->  <---------------
exports.getTimeService = (type) => {
  return new Promise(async(resolve, reject) => {
      var sqlQuery = 'SELECT service_time as timeService  FROM SERVICE WHERE SERVICE_TYPE="'+type+'"';
      await db.all(sqlQuery, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
       const tr = rows[0]["timeService"]!=null?rows[0]["timeService"]:0;
        resolve(tr);

      });

    });
  };


  exports.getCounterCount = (type) => {
    return new Promise(async(resolve, reject) => {
       const sqlQuery = 'SELECT count(*) as countCounter  FROM COUNTER_SERVICES WHERE SERVICE_TYPE="'+type+'"';
       await   db.all(sqlQuery, (err, rows) => {
            if (err) {
          console.log("errr");
              reject(err);
              return;
            } 
            const ki = rows[0]["countCounter"]!=null?rows[0]["countCounter"]:0;
             resolve(ki)
        });
  
  
      });
    };

    
  exports.getQueueCounter = (type) => {
    return new Promise(async(resolve, reject) => {
       const sqlQuery = 'SELECT queue_counter as NO  FROM SERVICE WHERE SERVICE_TYPE="'+type+'"';
        await db.all(sqlQuery, (err, rows) => {
          if (err) {
            reject(err);
            return;
          } 
         const nr = rows[0]["NO"]!=null?rows[0]["NO"]:1;
      resolve(nr);

      });
  
      });
    };


  //  summation (Σ) symbol 
    
  exports.mathSigmaSymbol = (startIndex, endIndexInclusive)  => { 
  let accumulator = 0;
  for(let i = startIndex; i <= endIndexInclusive; i++) {
    accumulator += (1/(i));
  }
  return accumulator;
}
// Counter Count
exports.getCountCustomerByService = (type) => {
  return new Promise(async(resolve, reject) => {
      var sqlQuery = 'SELECT count(TICKET_NUM) as count  FROM TICKET WHERE service_type="'+type+'"';
      await db.all(sqlQuery, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
       const tr = rows[0]["count"]!=null?rows[0]["count"]:0;
        resolve(tr);
      });

    });
  };
