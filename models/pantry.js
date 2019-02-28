"use strict";

const mongoose = require('mongoose');

const pantrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const Pantry = mongoose.model('Pantry', pantrySchema);

module.exports = Pantry;
