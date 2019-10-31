const User = require('./models/user');
const Pantry = require('./models/pantry');
const Item = require('./models/item');
const express = require('express');
const config = require('./config');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs')
const app = express();
const passport = require('passport');
//const { router: authRouter, localStrategy, jwtStrategy } = require('./auth'); 
       
    
app.use(cors());
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('img'));
mongoose.Promise = global.Promise;

//passport.use(localStrategy);
//passport.use(jwtStrategy);
//app.use('/user/login/auth', authRouter);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// =========================== Run/Close Server ==============================

let server;

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

// create a new user account; first check information is valid

app.post('/users/create', (req, res) => {
    console.log('user creation attempt');
//    const requiredFields = ['email', 'password', 'firstName', 'lastName'];
//  const missingField = requiredFields.find(field => !(field in req.body));

//  if (missingField === 'pantry') {
//      return;
//  }
//    else {  
//    return res.status(422).json({
//      code: 422,
//      reason: 'ValidationError',
//      message: 'Missing field',
//      location: missingField
//    });
//  }
     
    const stringFields = ['email', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string');
console.log('checking for non string fields');
  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }
    
    const explicityTrimmedFields = ['email', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );
console.log('checking for non trimmed field');
  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    email: {
      min: 1
    },
    password: {
      min: 10,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  }; 
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );
console.log('checking for too small field');
  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }
    
    let {email, password, firstName, lastName, pantry} = req.body;
    
// Username and password come in pre-trimmed, otherwise an 
// error is thrown before this
  firstName = firstName.trim();
  lastName = lastName.trim();

//     NOT NEEDED DUE TO EMAIL VALIDATE IN CLIENT.JS
//    return User.find({email})
//    .count()
//    .then(count => {
//      if (count > 0) {
//        // There is an existing user with the same username
//        return Promise.reject({
//          code: 422,
//          reason: 'ValidationError',
//          message: 'Email already taken',
//          location: 'email'
//        });  
//      }               
//      });        
    console.log('salting password...');
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
});

app.get('/get-pantries', (req, res) => {
    Pantry
        .find()
        .then(function (pantries) {
            res.json({
                pantries
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
        "email": email
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
    const memberEmail = req.body.memberEmail;

    //using the mongoose DB schema, connect to the database and the user with the same username as above
    Pantry.create({
        pantryName,
        memberEmail
    }, (err, item) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal Error Creating Pantry'
            });
        }
        if (item) {
            return res.status(200).json(item);
        }
    });
});

// get user's pantry data
app.get('/show-pantry/:pantryId', function (req, res) {
    let pantry = req.params.pantryId;
//    console.log(pantry);
    Item.find({
            "pantryId": pantry
        }).then(item => {
            res.json(item);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error getting users pantry'
            });
        });
});

// update user's pantry details after new pantry creation
app.put('/add-user-pantry/:_id', function (req, res) {
    User.findByIdAndUpdate(req.params._id, {
        pantry: req.body.pantry
    }).then(updatedUser =>
        res.status(204).end()
    ).catch(err => {
        console.error(err);
        res.status(500).json({
            message: 'Internal Server Error getting users pantry'
        });
    });
});

// add new item to user pantry
app.post('/add-new-item/:pantryId', function (req, res) {

    //take the parameters from the ajax api call
    const name = req.body.name;
    const quantity = req.body.quantity;
    const units = req.body.units;
    const description = req.body.description;
    const price = req.body.price;
    const addedByUserId = req.body.addedByUserId;
    const addedTimestamp = req.body.addedTimestamp;
    const updatedTimestamp = req.body.updatedTimestamp;
    const pantryId = req.body.pantryId;

    //using the mongoose DB schema, connect to the database and the user with the same username as above
    Item.create({
        name,
        quantity,
        units,
        description,
        price,
        addedByUserId,
        addedTimestamp,
        updatedTimestamp,
        pantryId
    }, (err, item) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal Error Creating Pantry'
            });
        }
        if (item) {
            return res.status(200).json(item);
        }
    });
});

// update item on save changes click
app.put('/update-item/:itemId', function (req, res) {
    let toUpdate = {};
    let updateableFields = ['name', 'quantity', 'units', 'description', 'price', 'updatedTimestamp'];
    updateableFields.forEach(function (field) {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    Item.findByIdAndUpdate(req.params.itemId, {
        $set: toUpdate
    }).then(item => {
//        console.log(item);
        res.status(204).end();
    }).catch(err => {
        console.error(err);
        res.status(500).json({
            message: 'Internal Server Error getting users pantry'
        });
    });
});

app.delete('/delete-item/:itemId', (req, res) => {
//    console.log(req.params.itemId);
    Item
        .findByIdAndRemove(req.params.itemId)
        .then(() => {
            res.status(204).json({
                message: 'success'
            }).end();
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'something went terribly wrong deleting this item'
            });
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
