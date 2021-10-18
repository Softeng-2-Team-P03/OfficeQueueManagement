const dayjs = require('dayjs');
const BASEURL = '/api';

async function getCounters() {
    //call: GET /api/counters
    const response = await fetch(BASEURL + '/counters/');
    const counters = await response.json();

    if (response.ok) {
        return counters;
    } else {
        throw counters; //object with error
    }
}

async function getServices() {
    //call: GET /api/services
    const response = await fetch(BASEURL + '/services/');
    const services = await response.json();

    if (response.ok) {
        return services;
    } else {
        throw services; //object with error
    }
}

async function getTicket(service) {
    //calls function newTicket and newTicketTime
    return new Promise((resolve, reject) => {
        newTicket(service)
            .then((ticketNum) => {
                newTicketTime(service)
                    .then((ticketTime) => resolve({ ticketNum: ticketNum, ticketTime: ticketTime }))
                    .catch((err) => reject(err));
            }).catch((err) => reject(err));
    })
}

async function newTicket(service) {
    //call: POST /api/tickets
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ serviceType: service })
        }).then(res => {
            if (res.ok) {
                resolve(res);
            } else {
                res.json()
                    .then(message => reject(message)) // error in the response body
                    .catch(() => reject({ error: "Cannot parse server response." })) // something else
            }
        }).catch(() => reject({ error: "Cannot communicate with the server." })); //connection errors
    })
}

async function newTicketTime(service) {
    //call: GET /api/estimation
    const response = await fetch(BASEURL + '/services/estimation?type=' + service);
    const time = await response.json();

    if (response.ok) {
        return time;
    } else {
        throw time; //object with error from the server
    }
}

async function getNextTicket(counterId) {
    //call: GET /api/counters/:counterId/nextTicket
    const response = await fetch(BASEURL + '/counters/' + counterId + '/nextTicket');
    const ticket = await response.json();

    if (response.ok) {
        if (ticket.ticketNumber == null) {
            return 'No ticket to serve'
        }
        else {
            return `#${ticket.ticketNumber}`
        }
    } else {
        throw ticket; //object with error from the server
    }
}

async function getCurrentTicket(counterId) {
    //call: GET /api/counters/:counterId/currentTicket
    const response = await fetch(BASEURL + '/counters/' + counterId + '/currentTicket');
    const ticket = await response.json();

    if (response.ok) {
        if (ticket.ticketNumber == null) {
            return 'No ticket being served'
        }
        else {
            return `#${ticket.ticketNumber}`
        }
    } else {
        throw ticket; //object with error from the server
    }
}

async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user.name;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
    const response = await fetch(BASEURL + '/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo.name;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}



const API = { logIn, logOut, getUserInfo, getNextTicket, getCurrentTicket, getCounters, getServices, getTicket };
export default API;