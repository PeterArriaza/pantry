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
