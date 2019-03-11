const User = require('./models/user');
const Pantry = require('./models/pantry');
const express = require('express');
const config = require('./config');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs')
const app = express();

app.use(cors());
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public'));
mongoose.Promise = global.Promise;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// =========================== Run/Close Server ==============================

let server;
// test8

function runServer(databaseUrl) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(config.PORT, () => {
                    console.log(`Listening on localhost:${config.PORT}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    }));
}

if (require.main === module) {
    runServer(config.DATABASE_URL).catch(err => console.error(err));
}

// =========================== Endpoints ====================================
app.post('/users/create', (req, res) => {
    console.log(req.body);
    let email = req.body.email;
    let password = req.body.password;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let pantry = req.body.pantry;
    password = password.trim();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error on genSalt'
            });
        }

        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error on hash'
                });
            }

            User.create({
                email,
                password: hash,
                firstName,
                lastName,
                pantry
            }, (err, item) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Error on Create User'
                    });
                }
                if (item) {
                    console.log(`New user with email ${email} was created`);
                    return res.status(200).json(item);
                }
            });
        });
    });

});

// Check for duplicate email in database for user sign up
app.get('/check-duplicate-email/:inputEmail', (req, res) => {
    let inputEmail = req.params.inputEmail;
    User
        .find({
            "email": inputEmail
        })
        .then(function (entries) {
            res.json({
                entries
            });
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
        });
})

// loggin in user
app.post('/users/login', function (req, res) {

    //take the username and the password from the ajax api call
    const email = req.body.email;
    const password = req.body.password;

    //using the mongoose DB schema, connect to the database and the user with the same username as above
    User.findOne({
        email: email
    }, function (err, items) {

        //if the there is an error connecting to the DB
        if (err) {

            //display it
            return res.status(500).json({
                message: "Error connecting to the DB"
            });
        }

        // if there are no users with this username
        if (!items) {
            //display it
            return res.status(401).json({
                message: "No users with this email"
            });
        }

        //if the username is found
        else {

            //try to validate the password
            items.validatePassword(password, function (err, isValid) {

                //if the connection to the DB to validate the password is not working
                if (err) {

                    //display error
                    return res.status(500).json({
                        message: "Could not connect to the DB to validate the password."
                    });
                }

                //if the password is not valid
                if (!isValid) {

                    //display error
                    return res.status(401).json({
                        message: "Password Invalid"
                    });
                }

                //if the password is valid
                else {
                    //return the logged in user
                    return res.json(items);
                }
            });
        };
    });
});

// create new pantry
app.post('/pantry/create', function (req, res) {

    //take the username and the password from the ajax api call
    const pantryName = req.body.pantryName;
    const memberArray = req.body.memberArray;

    //using the mongoose DB schema, connect to the database and the user with the same username as above
    Pantry.create({
        email,
        password: hash,
        firstName,
        lastName,
        pantry
    }, (err, item) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal Error Creating Pantry'
            });
        }
        if (item) {
            console.log(`New user with pantry ${pantryName} was created`);
            return res.status(200).json(item);
        }
    });
});

// =========================== Catch-all endpoint ===========================

app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not Found'
    });
});

// =========================== Exports ======================================

module.exports = {
    app,
    runServer,
    closeServer
};
