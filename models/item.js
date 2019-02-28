"use strict";

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    units: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    addedBy: {
        type: String,
        required: true,
    }
})

const Item = mongoose.model('Item', userSchema);

module.exports = Item;
