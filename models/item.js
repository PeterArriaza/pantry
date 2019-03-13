"use strict";

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
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
    price: {
        type: String,
        required: false
    },
    addedByUserId: {
        type: String,
        required: true,
    },
    addedTimestamp: {
        type: Date,
        required: true
    },
    updatedTimestamp: {
        type: Date,
        default: Date.now
    }
})


const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
