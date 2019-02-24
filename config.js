'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://dbUser:dbUser123@pantry-food-management-shard-00-00-8tvns.mongodb.net:27017,pantry-food-management-shard-00-01-8tvns.mongodb.net:27017,pantry-food-management-shard-00-02-8tvns.mongodb.net:27017/test?ssl=true&replicaSet=pantry-food-management-shard-0&authSource=admin&retryWrites=true';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
    'mongodb://dbUser:dbUser123@pantry-food-management-shard-00-00-8tvns.mongodb.net:27017,pantry-food-management-shard-00-01-8tvns.mongodb.net:27017,pantry-food-management-shard-00-02-8tvns.mongodb.net:27017/test?ssl=true&replicaSet=pantry-food-management-shard-0&authSource=admin&retryWrites=true';
exports.PORT = process.env.PORT || 8080;
