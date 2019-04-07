const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const moment = require('moment');

const expect = chai.expect;
const should = chai.should();

const {
    app,
    runServer,
    closeServer
} = require('../server');
const User = require('../models/user');
const Pantry = require('../models/pantry');
const Item = require('../models/item');
const {
    TEST_DATABASE_URL
} = require('../config');

chai.use(chaiHttp);

// Create user to seed db and test create user 
function generateUser() {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        pantry: faker.company.bsNoun()
    }
}

function seedUserData() {
    console.info('Seeding user data');
    const seedData = [];

    for (let i = 1; i < 10; i++) {
        seedData.push(generateUser());
    }
    return User.insertMany(seedData);
}

function generatePantry() {
    return {
        pantryName: faker.company.bsNoun(),
        memberIds: faker.random.uuid()
    }
}

function seedPantryData() {
    console.info('Seeding pantry data');
    const seedData = [];

    for (let i = 1; i < 10; i++) {
        seedData.push(generatePantry());
    }
    seedData.push({
        pantryName: "newPantry",
        memberIds: "12345"
    });
    //    console.log('seed data is:', seedData)
    return Pantry.insertMany(seedData);
}

function generateItem() {
    return {
        name: faker.random.word(),
        quantity: faker.random.number(),
        units: faker.random.word(),
        description: faker.lorem.sentence(),
        price: faker.finance.amount(),
        addedByUserId: faker.random.uuid(),
        addedTimestamp: faker.date.past(),
        updatedTimestamp: faker.date.recent(),
        pantryId: faker.random.uuid()
    }
}

function seedItemData() {
    console.info('Seeding item data');
    const seedData = [];

    for (let i = 1; i < 10; i++) {
        seedData.push(generateItem());
    }
    return Item.insertMany(seedData);
}

// Tear down Database after each test
function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting database');
        mongoose.connection.dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

// --------------------------------------------------------- //

describe('pantry api resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL)
            .then(console.log('Running server'))
            .catch(err => console.log({
                err
            }));
    });

    // passing
    it('should create a new user ', function () {
        seedUserData();
        const newUser = generateUser();
        return chai.request(app)
            .post('/users/create')
            .send(newUser)
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.include.keys('firstName', 'lastName',
                    'email', 'password', 'pantry');
                res.body.email.should.equal(newUser.email);
                res.body.password.should.not.equal(newUser.password);
                res.body.firstName.should.equal(newUser.firstName);
                res.body.lastName.should.equal(newUser.lastName);
                res.body.pantry.should.equal(newUser.pantry);
                res.body._id.should.not.be.null;
            });
    });
    //timeout error
    it('should check for duplicate emails', function () {
        seedUserData();
        const email = faker.internet.email();
        return chai.request(app)
            .get(`/check-duplicate-email/${email}`)
            .then(function (res) {
                res.should.have.status(200);
                //                res.should.have.length(0);
            });
    });
    //    // time out error
    it('should return a list of pantries', function () {
        seedPantryData();
        return chai.request(app)
            .get('/get-pantries')
            .then(function (res) {
                res.should.have.status(200);
                res.should.not.be.empty;
            });
    });
    // timeout error
    it('should return a user if login credentials are valid', function () {
        seedUserData();
        const newUser = generateUser();
        return chai.request(app)
            .post('/users/login')
            .send(newUser)
            .then(function (res) {
                res.should.have.status(401);
                res.should.be.json;
            });
    });
    //
    //    // timeout error
    it('should create a new pantry', function () {
        seedPantryData();
        const newPantry = generatePantry();
        return chai.request(app)
            .post('/pantry/create')
            .send(newPantry)
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
            });
    });

    it('should return a pantry', function () {
        seedPantryData();
        let pantryId;
        return Pantry
            .findOne({
                pantryName: "newPantry"
            })
            .then(function (pantry) {
                //                console.log(pantry);
                pantryId = pantry._id;
            });
        return chai.request(app)
            .get(`/show-pantry/${pantryId}`)
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
            });
    });

    it('should update a pantry with a user id', function () {
        let newPantry = generatePantry();
        let newUser = generateUser();
        return User.findOneAndUpdate(newUser._id, {
            pantry: `${newPantry.pantryName}`
        }).then(user => {
            return chai.request(app)
                .put('/add-user-pantry/' + user._id)
                .then(function (res) {
                    res.should.have.status(204);
                });
        });
    });
    //
    it('should add a new item to a pantry', function () {
        let pantryId;
        return Pantry
            .findOne({
                pantryName: "newPantry"
            })
            .then(function (pantry) {
                pantryId = pantry._id;
            });
        return chai.request(app)
            .get('/add-new-item/' + pantryId)
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
            });
    });

    it('should return update an item record', function () {
        seedItemData();
        let itemId;
        return Item
            .findOne()
            .then(item => {
                itemId = item._id;
                return chai.request(app)
                    .put('/update-item/' + itemId)
                    .send(item)
            })

            .then(function (res) {
                res.should.have.status(204);
            });
    });

    it('should delete an item', function () {
        seedItemData();
        let delItem;
        return Item
            .findOne()
            .then(item => {
                delItem = item;
                return chai.request(app)
                    .delete('/delete-item/' + delItem._id)
            })
            .then(res => {
                res.should.have.status(204);
            });
    });

    //     test every endpoint
    //     test every test one at a time

    //    afterEach(function () {
    //        return tearDownDb();
    //    });

    after(function () {
        //        return tearDownDb();        
        return closeServer();
    });
});
