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



const API = { logIn, logOut, getUserInfo, getNextTicket, getCurrentTicket, getCounters };
export default API;