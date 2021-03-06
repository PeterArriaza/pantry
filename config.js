'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || "mongodb://dbUser:dbUser123@pantry-food-management-shard-00-00-8tvns.mongodb.net:27017,pantry-food-management-shard-00-01-8tvns.mongodb.net:27017,pantry-food-management-shard-00-02-8tvns.mongodb.net:27017/pantry-food-management?ssl=true&replicaSet=pantry-food-management-shard-0&authSource=admin&retryWrites=true";
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
    "mongodb://dbUser:dbUser123@cluster0-shard-00-00-cq7bw.mongodb.net:27017,cluster0-shard-00-01-cq7bw.mongodb.net:27017,cluster0-shard-00-02-cq7bw.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";
exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';