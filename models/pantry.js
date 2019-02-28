"use strict";

const mongoose = require('mongoose');

const pantrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    household: {
        type: String,
        required: true
    },
    memberList: {
        type: [String],
        required: false
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;
