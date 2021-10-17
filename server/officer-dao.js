'use strict';
const db = require('./db');

//Retrieve all counters
exports.listCounters = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT COUNTER_ID
                     FROM COUNTER`
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const counters = rows.map((counter) => counter.COUNTER_ID);
      resolve(counters);
    })
  })
}

//Retrieve services by counter
exports.listServicesByCounter = (counterId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT SERVICE_TYPE
                     FROM COUNTER_SERVICES
                     WHERE COUNTER_ID = ?`
    db.all(sql, [counterId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      if (rows.length === 0) {
        resolve({ error: `Counter with id '${counterId}' has no services.` });
        return;
      }

      const services = rows.map((service) => service.SERVICE_TYPE);
      resolve(services);
    });
  });
};

exports.getServiceInfo = (serviceName) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT queue_counter, service_time
                     FROM SERVICE
                     WHERE SERVICE_TYPE = ?`
    db.get(sql, [serviceName], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row === undefined) {
        resolve({ error: `Service called '${serviceName}' was not found.` });
        return;
      }

      const service = {
        service_type: serviceName, service_time: row.service_time,
        service_queue: row.queue_counter == null ? 0 : row.queue_counter
      }
      resolve(service);
    });
  });
};

exports.selectTicketByService = (serviceName) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT MIN(TICKET_NUM) as ticketNum
                     FROM TICKET
                     WHERE SERVICE_TYPE = ?`
    db.get(sql, [serviceName], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row === undefined) {
        resolve({ error: `Ticket with service called '${serviceName}' was not found.` });
        return;
      }

      resolve(row.ticketNum);
    });
  });
};

exports.updateTicketServed = (counterId, ticketNum) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE COUNTER SET serving_num = ? WHERE COUNTER_ID = ?`
    db.run(sql, [ticketNum, counterId], function (err) {

      if (err) {
        reject(err);
        return;
      }

      if (this.changes == 0) {
        resolve({ error: `Counter with id '${counterId}' not found.` });
        return;
      }

      resolve(this.lastID);
    });
  });
};

exports.deleteTicket = (ticketNum) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM TICKET WHERE TICKET_NUM = ?`
    db.run(sql, [ticketNum], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(null);
    });
  });
};

exports.decreaseQueue = (serviceName) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE SERVICE SET queue_counter = queue_counter - 1 WHERE SERVICE_TYPE = ?`
    db.run(sql, [serviceName], function (err) {
      if (err) {
        reject(err);
        return;
      }

      if (this.changes === 0) {
        resolve({ error: `Service called '${serviceName}' was not found.` });
        return;
      }

      resolve(this.lastID);
    });
  });
};

exports.getCurrentTicket = (counterId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT serving_num
                     FROM COUNTER
                     WHERE COUNTER_ID = ?`
    db.get(sql, [counterId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row === undefined) {
        resolve({ error: `Ticket being served by counter with id '${counterId}' not found.` });
        return;
      }

      resolve(row.serving_num == null ? 0 : row.serving_num); // resolve(null) brings problems
    });
  });
};

exports.getTimeService = (type) => {
  return new Promise(async (resolve, reject) => {
    var sqlQuery = 'SELECT service_time as timeService  FROM SERVICE WHERE SERVICE_TYPE="' + type + '"';
    db.all(sqlQuery, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const tr = rows[0]["timeService"] != null ? rows[0]["timeService"] : 0;
      resolve(tr);

    });

  });
};


exports.getCounterCount = (type) => {
  return new Promise(async (resolve, reject) => {
    const sqlQuery = 'SELECT count(*) as countCounter  FROM COUNTER_SERVICES WHERE SERVICE_TYPE="' + type + '"';
    db.all(sqlQuery, (err, rows) => {
      if (err) {
        console.log("errr");
        reject(err);
        return;
      }
      const ki = rows[0]["countCounter"] != null ? rows[0]["countCounter"] : 0;
      resolve(ki)
    });


  });
};


exports.getQueueCounter = (type) => {
  return new Promise(async (resolve, reject) => {
    const sqlQuery = 'SELECT queue_counter as NO  FROM SERVICE WHERE SERVICE_TYPE="' + type + '"';
    db.all(sqlQuery, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const nr = rows[0]["NO"] != null ? rows[0]["NO"] : 1;
      resolve(nr);

    });

  });
};


//  summation (Σ) symbol 

exports.mathSigmaSymbol = (startIndex, endIndexInclusive) => {
  let accumulator = 0;
  for (let i = startIndex; i <= endIndexInclusive; i++) {
    accumulator += (1 / (i));
  }
  return accumulator;
}


exports.updateQueue = (type, operationType) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = 'SELECT queue_counter as NO  FROM SERVICE WHERE SERVICE_TYPE="' + type + '"';
    db.all(sqlQuery, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      var nr = rows[0]["NO"] != null ? rows[0]["NO"] : 0;
      console.log("nr" + nr)
      console.log("operationType" + operationType)
      if (operationType == 1)
        nr++;
      else if (operationType == 2 && nr > 0)
        nr--;
      else
        nr = 0;
      console.log("SERVICE" + nr);
      const sql = 'UPDATE SERVICE SET queue_counter=? WHERE SERVICE_TYPE = ?';
      db.run(sql, [nr, type], function (err) {
        if (err) {
          reject(err);
          return;
        }

        var data2 = {
          type: type,
          Queue: nr
        };
        // resolve(this.lastID);
        resolve(data2);
      });
    });

  });
};