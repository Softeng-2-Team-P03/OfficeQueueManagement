const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator'); // validation middleware
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao.js'); // module for accessing the users in the DB
const dao = require('./dao'); // module for accessing the DB
const OfficerDao = require('./officer-dao.js'); // module for accessing the DB

const dateRegex = new RegExp(/^([1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])[\ ]([01][0-9]|2[0-3]):[0-5][0-9])$/);
//RegExp to check if a date is like 'YYYY-MM-DD HH:mm'. It doesn't check if it's a valid date.

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

//***   Calculate Estimation Time   */
// http://localhost:3001/api/services/estimation?type=SPID
app.get('/api/services/estimation', async (req, res) => {
    const type=req.query.type;
    // tr= the service time for the request time 
    var tr = 0;
    // ki is the number of different types of requests served by counter i
    var ki = 0;
    // nr is the number of people in queue for request type r
    var nr = 0;

    const timeService = await OfficerDao.getTimeService(type);
    if (timeService.error)
        res.status(404).json(timeService);
    else
        tr = timeService;

    const counter = await OfficerDao.getCounterCount(type);
    if (counter.error)
        res.status(404).json(counter);
    else
        ki = counter;

    const queue = await OfficerDao.getQueueCounter(type);
    if (queue.error)
        res.status(404).json(queue);
    else
        nr = queue;
// Calc Sigma
    var sigma = OfficerDao.mathSigmaSymbol(1, ki);
    // Calculate Estimation Time
    const TR = tr * (nr / sigma + (1 / 2))
    console.log(TR)
    res.json(TR);
});

//***   Update QUEUE   */
// http://localhost:3001/api/services/updateQueue?type=SPID&operationType=1 
//OperationType 1= increase 2= deacrease and 3= reset
app.get('/api/services/updateQueue', async (req, res) => {
    const type=req.query.type;
    console.log("22"+type+"  "+req.query.OperationType)
    const timeService = await OfficerDao.updateQueue(type,req.query.OperationType);
    if (timeService.error)
        res.status(404).json(timeService);
    else
        tr = timeService;
    res.json(tr);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));