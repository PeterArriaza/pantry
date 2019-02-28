const express = require('express');
const app = express();
const config = require('./config');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs')

app.use(express.static('/public'));
mongoose.Promise = global.Promise;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/public/login.html');
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

var MOCK_PANTRY = {
    "items": [
        {
            "name": "eggs",
            "quantity": 12,
            "units": "EA",
            "description": "large, brown",
            "addedBy": "Pete Arriaza",
            "timestamp": 1470016976609
        },
        {
            "name": "cheese",
            "quantity": 2,
            "units": "lb",
            "description": "large, brown",
            "addedBy": "Pete Arriaza",
            "timestamp": 1470016976609
        },
        {
            "name": "bread",
            "quantity": 15,
            "units": "slices",
            "description": "whole wheat",
            "addedBy": "Pete Arriaza",
            "timestamp": 1470016976609
        }
    ]
};

function getRecentStatusUpdates(callbackFn) {
    setTimeout(function () {
        callbackFn(MOCK_STATUS_UPDATES)
    }, 100);
}

// this function stays the same when we connect
// to real API later
function displayStatusUpdates(data) {
    for (index in data.statusUpdates) {
        $('body').append(
            '<p>' + data.statusUpdates[index].text + '</p>');
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayStatusUpdates() {
    getRecentStatusUpdates(displayStatusUpdates);
}

$(function () {
    getAndDisplayStatusUpdates();
})

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
