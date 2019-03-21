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

    beforeEach(function () {
        return seedUserData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });

    describe('user endpoint tests', function () {
        it('should create a new user', function () {
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
    });
});
