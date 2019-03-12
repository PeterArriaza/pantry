"use strict";

const mongoose = require('mongoose');

const pantrySchema = new mongoose.Schema({
    pantryName: {
        type: String,
        required: true
    },
    memberEmail: {
        type: String,
    }
})

const Pantry = mongoose.model('Pantry', pantrySchema);

module.exports = Pantry;
