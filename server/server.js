const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator'); // validation middleware
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao.js'); // module for accessing the users in the DB
const dao = require('./dao'); // module for accessing the DB
const officerDao = require('./officer-dao.js');

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
    function (username, password, done) {
        userDao.getUser(username, password).then((user) => {
            if (!user)
                return done(null, false, { message: 'Incorrect username and/or password.' });

            return done(null, user);
        })
    }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});

const app = new express();
const PORT = 3001;

app.use(morgan('dev'));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    return res.status(401).json({ error: 'not authenticated' });
}

// set up the session
app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/counters/:counterId/currentTicket', [
    check('counterId').isInt()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: "counterId is not an int" });
        }

        try {
            const result = await officerDao.getCurrentTicket(req.params.counterId);
            if (result.error) {
                return res.status(404).json(result); //Ticket being served not found
            }
            if (result == 0) {
                return res.json({ ticketNumber: null, info: 'No ticket being served.' })
            }
            else {
                return res.json({ ticketNumber: result })
            }
        } catch (err) {
            res.status(500).end();
        }
    }
);

//TO ADD: isLoggedIn (after testing a bit)
app.get('/api/counters/:counterId/nextTicket', [
    check('counterId').isInt()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: "counterId is not an int" });
        }

        try {
            const result = await officerDao.listServicesByCounter(req.params.counterId);

            if (result.error) {
                return res.status(404).json(result); //Counter with that id has no services
            }

            const servicesName = result; //array of services names
            let servicesInfo = [];
            for (const service of servicesName) {

                const result = await officerDao.getServiceInfo(service); //get serviceInfo (queue and serviceTime)
                if (result.error) {
                    return res.status(404).json(result); //If service with that name was not found in the DB
                }
                servicesInfo = [...servicesInfo, result];
            }

            servicesInfo.sort((a, b) => b.service_queue - a.service_queue || a.service_time - b.service_time);
            //Service queue order is DESC and service time order is ASC

            const service = servicesInfo[0];

            if (service.service_queue == 0) {
                const result = await officerDao.updateTicketServed(req.params.counterId, null); //Counter is serving no ticket

                if (result.error) {
                    return res.status(404).json(result); //Counter with that id not found
                }

                res.json({ ticketNumber: null, info: "No ticket to serve." }); //no ticket to serve
            }
            else {
                const ticketNum = await officerDao.selectTicketByService(service.service_type); //Get the MIN ticket of that Service

                if (ticketNum.error) {
                    return res.status(404).json(ticketNum); //Ticket with that service not found
                }

                const result = await officerDao.updateTicketServed(req.params.counterId, ticketNum); //Counter is serving the new ticket

                if (result.error) {
                    return res.status(404).json(result); //Counter with that id not found
                }

                await officerDao.deleteTicket(ticketNum); //Remove ticket from DB
                //No error check: ticket was found before, it should still be in the DB

                await officerDao.decreaseQueue(service.service_type); //Decrease service queue
                //No error check: service was found before, it should still be in the DB

                res.json({ ticketNumber: ticketNum }); //ticket removed and currently served by that counter
            }
        } catch (err) {
            res.status(500).end();
        }
    }
);

/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            // this is coming from userDao.getUser()
            return res.json(req.user);
        });
    })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
    req.logout();
    res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else
        res.status(401).json({ error: 'Unauthenticated user!' });;
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));