'use strict';

const db = require('./db');

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

            if(rows.length === 0 ){
                resolve({error: `Counter with id '${counterId}' has no services.`});
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